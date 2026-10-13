import Foundation
import WatchConnectivity

// Transport zegarka: WatchConnectivity. Migawka z telefonu przychodzi jako applicationContext (stan, także gdy zegarek był nieosiągalny) albo sendMessage
// (natychmiast); pozostałe komunikaty (ack, welcome, polecenie sesji) — sendMessage albo transferUserInfo. Do telefonu: sendMessage (budzi aplikację
// w tle), a bez połączenia transferUserInfo (kolejka systemu, dostarczana po kolei). Symulator nie obsługuje transferUserInfo — tam komunikat czeka
// w kolejce zdarzeń zegarka (ClientState.queue) i store wysyła go ponownie po powrocie łączności. Powtórzone eventId telefon pomija.
final class WatchConnectivityClient: NSObject, WCSessionDelegate, WatchTransport {
  var onMessage: ((Data) -> Void)?
  var onReachability: ((Bool) -> Void)?

  private var session: WCSession? { WCSession.isSupported() ? WCSession.default : nil }
  var isReachable: Bool { session?.isReachable ?? false }

  func activate() {
    guard let s = session else { return }
    s.delegate = self
    s.activate()
  }

  func send(json: String) {
    guard let s = session else { return }
    let payload: [String: Any] = [WatchWire.message: json]
    if s.activationState == .activated && s.isReachable {
      s.sendMessage(payload, replyHandler: { _ in }, errorHandler: { [weak self] _ in self?.queueForLater(payload) })
    } else {
      queueForLater(payload)
    }
  }

  private func queueForLater(_ payload: [String: Any]) {
    #if !targetEnvironment(simulator)
    if let s = session, s.activationState == .activated { _ = s.transferUserInfo(payload) }
    #endif
  }

  private func deliver(_ dict: [String: Any]) {
    if let json = dict[WatchWire.message] as? String { onMessage?(Data(json.utf8)) }
  }

  // MARK: - WCSessionDelegate

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    if activationState == .activated {
      deliver(session.receivedApplicationContext)
      onReachability?(session.isReachable)
    }
  }

  func sessionReachabilityDidChange(_ session: WCSession) { onReachability?(session.isReachable) }

  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) { deliver(applicationContext) }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
    deliver(message)
    replyHandler([WatchWire.received: true])
  }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any]) { deliver(message) }

  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) { deliver(userInfo) }
}
