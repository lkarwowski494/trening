import ExpoModulesCore
import WatchConnectivity

public class WatchLinkModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WatchLink")

    // onMessages: w kolejce są nowe komunikaty z zegarka (JS wywołuje takeMessages); onStatus: zmiana parowania/osiągalności.
    Events("onMessages", "onStatus")

    OnCreate {
      let hub = WatchLinkHub.shared
      hub.activate()
      hub.onMessagesAvailable = { [weak self] in self?.sendEvent("onMessages", [:]) }
      hub.onStatusChanged = { [weak self] in self?.sendEvent("onStatus", WatchLinkHub.shared.status()) }
    }

    OnDestroy {
      WatchLinkHub.shared.onMessagesAvailable = nil
      WatchLinkHub.shared.onStatusChanged = nil
    }

    Function("isSupported") { () -> Bool in WCSession.isSupported() }

    Function("getStatus") { () -> [String: Any] in WatchLinkHub.shared.status() }

    AsyncFunction("send") { (json: String) -> Bool in WatchLinkHub.shared.send(json) }

    AsyncFunction("startWatchApp") { (promise: Promise) in
      WatchLinkHub.shared.startWatchApp { promise.resolve($0) }
    }

    Function("takeMessages") { () -> [String] in WatchLinkHub.shared.takeMessages() }
  }
}
