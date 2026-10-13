import Foundation
import WatchConnectivity
import HealthKit

/// Łącze z aplikacją na Apple Watch po stronie iPhone'a. Zegarek tylko wyświetla i odsyła zdarzenia; telefon trzyma stan (lib/watch/link.ts).
/// Komunikaty są dla tego modułu NIEPRZEZROCZYSTYMI ciągami JSON (kształt ustala protokół, docs/35):
/// - migawka (kind „snapshot”) telefon -> zegarek: applicationContext (stan, dostępny gdy zegarek był nieosiągalny) + sendMessage, gdy osiągalny (natychmiast);
/// - pozostałe komunikaty telefon -> zegarek (ack, welcome, polecenie sesji): sendMessage albo — bez połączenia — transferUserInfo (kolejka systemu);
/// - zegarek -> telefon (hello, zdarzenia): sendMessage (budzi aplikację w tle) albo transferUserInfo.
/// Komunikat z zegarka jest zapisywany w trwałej kolejce (UserDefaults) PRZED odpowiedzią transportową dla zegarka, więc nie ginie, gdy JavaScript jeszcze
/// nie działa (wybudzenie w tle) albo aplikacja padnie. JS pobiera kolejkę przez takeMessages(); powtórzone eventId pomija warstwa protokołu.
final class WatchLinkHub: NSObject, WCSessionDelegate {
  static let shared = WatchLinkHub()

  var onMessagesAvailable: (() -> Void)?
  var onStatusChanged: (() -> Void)?

  private let queueKey = "watchlink.messages.v1"
  private let maxQueued = 500
  private let wireKey = "msg"
  private let lock = NSLock()
  private let health = HKHealthStore()

  private var session: WCSession? { WCSession.isSupported() ? WCSession.default : nil }

  func activate() {
    guard let s = session else { return }
    s.delegate = self
    if s.activationState != .activated { s.activate() }
  }

  func status() -> [String: Any] {
    guard let s = session else { return ["supported": false, "activated": false, "paired": false, "installed": false, "reachable": false] }
    return ["supported": true, "activated": s.activationState == .activated, "paired": s.isPaired, "installed": s.isWatchAppInstalled, "reachable": s.isReachable]
  }

  /// Rodzaj komunikatu (pole „kind”) albo nil, gdy to nie jest obiekt JSON.
  private func kindOf(_ json: String) -> String? {
    guard let d = json.data(using: .utf8), let o = try? JSONSerialization.jsonObject(with: d) as? [String: Any] else { return nil }
    return o["kind"] as? String
  }

  @discardableResult
  func send(_ json: String) -> Bool {
    guard let s = session, s.activationState == .activated, s.isPaired, s.isWatchAppInstalled, let kind = kindOf(json) else { return false }
    let payload: [String: Any] = [wireKey: json]
    if kind == "snapshot" {
      do { try s.updateApplicationContext(payload) } catch { return false }
      if s.isReachable { s.sendMessage(payload, replyHandler: nil, errorHandler: nil) }
      return true
    }
    if s.isReachable {
      s.sendMessage(payload, replyHandler: nil, errorHandler: { [weak self] _ in self?.queueForLater(payload) })
    } else {
      queueForLater(payload)
    }
    return true
  }

  private func queueForLater(_ payload: [String: Any]) {
    #if !targetEnvironment(simulator)
    if let s = session, s.activationState == .activated, s.isPaired, s.isWatchAppInstalled { _ = s.transferUserInfo(payload) }
    #endif
  }

  /// Budzi aplikację na zegarku i prosi o start sesji treningu (HKHealthStore.startWatchApp). Zegarek startuje sesję też po poleceniu `session start`.
  func startWatchApp(_ done: @escaping (Bool) -> Void) {
    guard HKHealthStore.isHealthDataAvailable(), let s = session, s.isPaired, s.isWatchAppInstalled else { done(false); return }
    let c = HKWorkoutConfiguration()
    c.activityType = .traditionalStrengthTraining
    c.locationType = .indoor
    health.startWatchApp(with: c) { ok, _ in done(ok) }
  }

  // MARK: - Kolejka komunikatów z zegarka

  func takeMessages() -> [String] {
    lock.lock(); defer { lock.unlock() }
    let d = UserDefaults.standard
    let q = d.stringArray(forKey: queueKey) ?? []
    d.removeObject(forKey: queueKey)
    return q
  }

  /// Zapisuje komunikat w kolejce; false dla nieczytelnej treści (nie obiekt JSON z polem „kind”).
  private func enqueue(_ json: String) -> Bool {
    guard kindOf(json) != nil else { return false }
    lock.lock()
    let d = UserDefaults.standard
    var q = d.stringArray(forKey: queueKey) ?? []
    q.append(json)
    if q.count > maxQueued { q.removeFirst(q.count - maxQueued) }
    d.set(q, forKey: queueKey)
    lock.unlock()
    DispatchQueue.main.async { [weak self] in self?.onMessagesAvailable?() }
    return true
  }

  // MARK: - WCSessionDelegate

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    DispatchQueue.main.async { [weak self] in self?.onStatusChanged?() }
  }
  func sessionDidBecomeInactive(_ session: WCSession) {}
  func sessionDidDeactivate(_ session: WCSession) { session.activate() } // po zmianie sparowanego zegarka
  func sessionWatchStateDidChange(_ session: WCSession) { DispatchQueue.main.async { [weak self] in self?.onStatusChanged?() } }
  func sessionReachabilityDidChange(_ session: WCSession) { DispatchQueue.main.async { [weak self] in self?.onStatusChanged?() } }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
    if let json = message[wireKey] as? String, enqueue(json) { replyHandler(["received": true]) } else { replyHandler(["received": false]) }
  }
  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    if let json = userInfo[wireKey] as? String { _ = enqueue(json) }
  }
}
