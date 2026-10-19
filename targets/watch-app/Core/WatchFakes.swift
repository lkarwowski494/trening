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

  /// „Telefon” zachowuje się jak prawdziwy: na „zrobione” / „inaczej” wysyła NOWĄ migawkę (przerwa, następna seria z `after`), na „cofnij” — poprzednią,
  /// i dopiero potem `ack` z numerem tej migawki (docs/35-zegarki: najpierw migawka, potem ack). Ack bez migawki (rev = migawka zegarka) kasuje lokalny skutek akcji.
  var phoneFollowsEvents = true
  /// Gdy migawka nie ma `after` (nic dalej nie wiadomo): false = telefon milczy i zdarzenie zostaje w kolejce (ekrany „Połącz z telefonem” w testach interfejsu),
  /// true = tylko `ack`.
  var acksEventsWithoutNextSet = true
  private var seenEventIds = Set<String>()
  private var lastSnapshot: [String: Any]?
  private var snapshotHistory: [[String: Any]] = []

  /// Następna migawka po odhaczeniu: seria z `after.now`, przerwa z `after.restSec`, licznik +1; nil, gdy migawka nie ma `after`.
  private func nextSnapshot(after ev: [String: Any], from snap: [String: Any]) -> [String: Any]? {
    guard let after = snap["after"] as? [String: Any] else { return nil }
    var n = snap
    n["rev"] = ((snap["rev"] as? NSNumber)?.intValue ?? 0) + 1
    if let next = after["now"], !(next is NSNull) { n["now"] = next } else { n["now"] = NSNull() }
    let sec = (after["restSec"] as? NSNumber)?.intValue ?? 0
    let at = (ev["at"] as? NSNumber)?.doubleValue ?? 0
    let setId = (ev["setId"] as? String) ?? ((snap["now"] as? [String: Any])?["setId"] as? String) ?? ""
    if sec > 0 {
      n["phase"] = "rest"
      n["rest"] = ["setId": setId, "startedAt": at, "endsAt": at + Double(sec) * 1000, "totalSec": sec, "cue": after["cue"] ?? NSNull(), "last": after["last"] ?? false] as [String: Any]
    } else {
      n["phase"] = n["now"] is NSNull ? "done" : "set"
      n["rest"] = NSNull()
    }
    n["after"] = NSNull()
    n["doneCount"] = ((snap["doneCount"] as? NSNumber)?.intValue ?? 0) + 1
    return n
  }

  private func deliverAck(_ id: String, _ rev: Int) {
    deliver(json: "{\"v\":1,\"kind\":\"ack\",\"eventId\":\"\(id)\",\"status\":\"applied\",\"reason\":null,\"rev\":\(rev)}")
  }

  private func deliverDict(_ d: [String: Any]) {
    guard let data = try? JSONSerialization.data(withJSONObject: d), let str = String(data: data, encoding: .utf8) else { return }
    deliver(json: str)
  }

  func activate() { activated = true }

  func send(json: String) {
    sent.append(json)
    guard autoReply, isReachable, let o = try? JSONSerialization.jsonObject(with: Data(json.utf8)) as? [String: Any], let kind = o["kind"] as? String else { return }
    if kind == "hello" { deliver(json: "{\"v\":1,\"kind\":\"welcome\",\"ok\":true,\"protocol\":1,\"upgrade\":null}") }
    if kind == "event", let id = o["eventId"] as? String {
      var rev = (o["baseRev"] as? NSNumber)?.intValue ?? 0
      let duplicate = !seenEventIds.insert(id).inserted /* powtórzone eventId: telefon pomija, potwierdza bieżącą migawką */
      if phoneFollowsEvents, !duplicate, let snap = lastSnapshot, let type = o["type"] as? String {
        if type == "done" || type == "differ" {
          guard let next = nextSnapshot(after: o, from: snap) else { if acksEventsWithoutNextSet { rev = (snap["rev"] as? NSNumber)?.intValue ?? rev; deliverAck(id, rev) }; return }
          snapshotHistory.append(snap); deliverDict(next); rev = (next["rev"] as? NSNumber)?.intValue ?? rev
        } else if type == "undo", var prev = snapshotHistory.popLast() {
          prev["rev"] = ((snap["rev"] as? NSNumber)?.intValue ?? 0) + 1; deliverDict(prev); rev = (prev["rev"] as? NSNumber)?.intValue ?? rev
        }
      }
      if duplicate { rev = (lastSnapshot?["rev"] as? NSNumber)?.intValue ?? rev }
      deliverAck(id, rev)
    }
  }

  /// Komunikat „z telefonu”.
  func deliver(json: String) {
    if phoneFollowsEvents, let o = try? JSONSerialization.jsonObject(with: Data(json.utf8)) as? [String: Any], o["kind"] as? String == "snapshot" { lastSnapshot = o }
    onMessage?(Data(json.utf8))
  }
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
  /// Ile razy aplikacja poprosiła o zgodę na Zdrowie (przy otwarciu); sama prośba nie zaczyna sesji.
  private(set) var authorizationRequests = 0
  private(set) var ends: [(save: Bool, workoutId: String)] = []
  /// Wynik zapisu zgłaszany przy końcu sesji (true = zegarek zapisał trening w Zdrowiu).
  var saveSucceeds = true
  func requestAuthorization() { authorizationRequests += 1 }
  func start() { isActive = true; starts += 1; onStarted?() }
  func end(save: Bool, workoutId: String) { isActive = false; ends.append((save, workoutId)); onEnded?(save && saveSucceeds) }
}

final class FakeHaptics: WatchHaptics {
  private(set) var restEndedCount = 0
  private(set) var doneCount = 0
  func restEnded() { restEndedCount += 1 }
  func doneTapped() { doneCount += 1 }
}
