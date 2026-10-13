import Foundation

// Fałszywe zależności: testy jednostkowe (swift test) i testy interfejsu na symulatorze (migawka w zmiennej środowiskowej).
// Kompilowane też w aplikacji, ale używane tylko przy #if DEBUG + zmienna WATCH_FAKE_SNAPSHOT_JSON (TreningWatchApp.swift).

final class FakeTransport: WatchTransport {
  var onMessage: ((Data) -> Void)?
  var onReachability: ((Bool) -> Void)?
  var isReachable: Bool
  private(set) var activated = false
  /// Wszystko, co zegarek wysłał do telefonu (JSON), w kolejności.
  private(set) var sent: [String] = []
  /// Gdy true i zegarek osiągalny, „telefon” odpowiada jak prawdziwy: `welcome` na `hello`, `ack` (applied) na zdarzenie.
  var autoReply: Bool
  init(reachable: Bool = true, autoReply: Bool = true) { isReachable = reachable; self.autoReply = autoReply }

  func activate() { activated = true }

  func send(json: String) {
    sent.append(json)
    guard autoReply, isReachable, let o = try? JSONSerialization.jsonObject(with: Data(json.utf8)) as? [String: Any], let kind = o["kind"] as? String else { return }
    if kind == "hello" { deliver(json: "{\"v\":1,\"kind\":\"welcome\",\"ok\":true,\"protocol\":1,\"upgrade\":null}") }
    if kind == "event", let id = o["eventId"] as? String {
      let rev = (o["baseRev"] as? NSNumber)?.intValue ?? 0
      deliver(json: "{\"v\":1,\"kind\":\"ack\",\"eventId\":\"\(id)\",\"status\":\"applied\",\"reason\":null,\"rev\":\(rev)}")
    }
  }

  /// Komunikat „z telefonu”.
  func deliver(json: String) { onMessage?(Data(json.utf8)) }
  func setReachable(_ r: Bool) { isReachable = r; onReachability?(r) }

  /// Zdarzenia (typ + id) wysłane do telefonu — wygodne do asercji.
  var sentEvents: [WatchEvent] { sent.compactMap { WatchCodec.decodeEvent(json: $0) } }
  var sentKinds: [String] { sent.compactMap { (try? JSONSerialization.jsonObject(with: Data($0.utf8)) as? [String: Any])?["kind"] as? String } }
}

final class FakeWorkout: WorkoutDriver {
  var isActive = false
  var onStarted: (() -> Void)?
  var onEnded: ((Bool) -> Void)?
  private(set) var starts = 0
  private(set) var ends: [(save: Bool, workoutId: String)] = []
  /// Wynik zapisu zgłaszany przy końcu sesji (true = zegarek zapisał trening w Zdrowiu).
  var saveSucceeds = true
  func start() { isActive = true; starts += 1; onStarted?() }
  func end(save: Bool, workoutId: String) { isActive = false; ends.append((save, workoutId)); onEnded?(save && saveSucceeds) }
}

final class FakeHaptics: WatchHaptics {
  private(set) var restEndedCount = 0
  private(set) var doneCount = 0
  func restEnded() { restEndedCount += 1 }
  func doneTapped() { doneCount += 1 }
}
