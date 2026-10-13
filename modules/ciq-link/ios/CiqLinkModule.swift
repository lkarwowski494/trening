import ExpoModulesCore

public class CiqLinkModule: Module {
  public func definition() -> ModuleDefinition {
    Name("CiqLink")
    Events("onMessage", "onDeviceStatus", "onDevices")

    OnStartObserving {
      CiqBridge.shared.emit = { [weak self] name, body in self?.sendEvent(name, body) }
    }
    OnStopObserving {
      CiqBridge.shared.emit = nil
    }

    Function("isSupported") { () -> Bool in true }

    // Pokazuje aplikację dostawcy zegarka (wybór urządzeń); aplikacja trafia w tło, powrót przez schemat URL.
    Function("pair") { () -> Void in CiqBridge.shared.showDeviceSelection() }
    Function("showCompanionStore") { () -> Void in CiqBridge.shared.showCompanionStore() }
    Function("forget") { () -> Void in CiqBridge.shared.forget() }
    Function("devices") { () -> [[String: Any]] in CiqBridge.shared.deviceList() }
    Function("showStore") { (deviceId: String) -> Void in CiqBridge.shared.showStore(deviceId: deviceId) }

    AsyncFunction("send") { (deviceId: String, message: [String: Any], promise: Promise) in
      CiqBridge.shared.send(deviceId: deviceId, message: message) { promise.resolve($0) }
    }
    AsyncFunction("openApp") { (deviceId: String, promise: Promise) in
      CiqBridge.shared.openApp(deviceId: deviceId) { promise.resolve($0) }
    }
    AsyncFunction("appStatus") { (deviceId: String, promise: Promise) in
      CiqBridge.shared.appStatus(deviceId: deviceId) { promise.resolve($0) }
    }
  }
}
