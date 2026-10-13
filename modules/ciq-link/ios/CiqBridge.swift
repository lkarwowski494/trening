import Foundation
import ConnectIQ

/// Most do Connect IQ Mobile SDK (zegarek z aplikacją Connect IQ). Jedyny obiekt rozmawiający z SDK; moduł Expo (CiqLinkModule) i AppDelegate tylko go wołają.
/// Stałe poniżej muszą zgadzać się z lib/watch/ciqWire.ts (CIQ_APP_UUID, CIQ_URL_SCHEME, CIQ_RESTORE_ID) — pilnuje tests/ciq-native.test.ts.
final class CiqBridge: NSObject, IQDeviceEventDelegate, IQAppMessageDelegate, IQUIOverrideDelegate {
  static let shared = CiqBridge()
  static let appUUID = UUID(uuidString: "f8ba5b0d-a666-42a5-bbad-734726c31501")!
  static let urlScheme = "trening-ciq"
  static let restoreId = "trening-ciq"
  private static let defaultsKey = "ciq.devices"
  private static let maxPending = 50

  /// Ustawiane przez moduł Expo, gdy JS słucha zdarzeń; bez niego wiadomości czekają w kolejce (aplikacja mogła zostać obudzona w tle przez Bluetooth, zanim JS wystartował).
  var emit: ((String, [String: Any]) -> Void)? {
    didSet { if emit != nil { flush() } }
  }
  private var pending: [(String, [String: Any])] = []
  private var started = false
  private var devices: [UUID: IQDevice] = [:]
  private var apps: [UUID: IQApp] = [:]
  private let lock = NSLock()

  // MARK: start

  /// Po starcie aplikacji: inicjalizuj SDK tylko, gdy użytkownik już sparował zegarek (inaczej samo uruchomienie aplikacji wywołałoby prośbę o zgodę na Bluetooth).
  func startIfPaired() {
    guard !loadStored().isEmpty else { return }
    start()
  }

  func start() {
    lock.lock(); defer { lock.unlock() }
    guard !started else { return }
    started = true
    ConnectIQ.sharedInstance().initialize(withUrlScheme: CiqBridge.urlScheme, uiOverrideDelegate: self, stateRestorationIdentifier: CiqBridge.restoreId)
    for d in loadStored() { register(d) }
  }

  private func register(_ d: IQDevice) {
    devices[d.uuid] = d
    let app = IQApp(uuid: CiqBridge.appUUID, storeUuid: CiqBridge.appUUID, device: d)
    apps[d.uuid] = app
    ConnectIQ.sharedInstance().register(forDeviceEvents: d, delegate: self)
    ConnectIQ.sharedInstance().register(forAppMessages: app, delegate: self)
  }

  // MARK: parowanie

  /// Przejście do aplikacji dostawcy zegarka (wybór urządzeń); powrót przez schemat URL -> handleURL.
  func showDeviceSelection() {
    start()
    ConnectIQ.sharedInstance().showConnectIQDeviceSelection()
  }

  func handleURL(_ url: URL) -> Bool {
    guard url.scheme == CiqBridge.urlScheme else { return false }
    start()
    guard let list = ConnectIQ.sharedInstance().parseDeviceSelectionResponse(from: url) as? [IQDevice] else { return false }
    // Zgodnie z dokumentacją: lista z aplikacji dostawcy zastępuje wszystko, co znaliśmy (użytkownik mógł cofnąć zgodę dla urządzenia).
    ConnectIQ.sharedInstance().unregisterForAllDeviceEvents(self)
    ConnectIQ.sharedInstance().unregisterForAllAppMessages(self)
    devices = [:]; apps = [:]
    for d in list { register(d) }
    store(list)
    emitEvent("onDevices", ["devices": deviceList()])
    return true
  }

  func forget() {
    ConnectIQ.sharedInstance().unregisterForAllDeviceEvents(self)
    ConnectIQ.sharedInstance().unregisterForAllAppMessages(self)
    devices = [:]; apps = [:]
    UserDefaults.standard.removeObject(forKey: CiqBridge.defaultsKey)
    emitEvent("onDevices", ["devices": [[String: Any]]()])
  }

  // MARK: urządzenia

  func deviceList() -> [[String: Any]] {
    devices.values.sorted { $0.friendlyName < $1.friendlyName }.map { d in
      ["id": d.uuid.uuidString, "name": d.friendlyName, "model": d.modelName, "status": ConnectIQ.sharedInstance().getDeviceStatus(d).rawValue]
    }
  }

  private func store(_ list: [IQDevice]) {
    let raw = list.map { ["id": $0.uuid.uuidString, "name": $0.friendlyName, "model": $0.modelName] }
    UserDefaults.standard.set(raw, forKey: CiqBridge.defaultsKey)
  }

  private func loadStored() -> [IQDevice] {
    guard let raw = UserDefaults.standard.array(forKey: CiqBridge.defaultsKey) as? [[String: String]] else { return [] }
    return raw.compactMap { r in
      guard let id = r["id"].flatMap({ UUID(uuidString: $0) }) else { return nil }
      return IQDevice(id: id, modelName: r["model"] ?? "", friendlyName: r["name"] ?? "")
    }
  }

  // MARK: wiadomości

  func send(deviceId: String, message: [String: Any], completion: @escaping ([String: Any]) -> Void) {
    start()
    guard let id = UUID(uuidString: deviceId), let app = apps[id] else { completion(["ok": false, "code": -1, "name": "UnknownDevice"]); return }
    ConnectIQ.sharedInstance().sendMessage(message, to: app, progress: { _, _ in }, completion: { result in
      completion(["ok": result.rawValue == 0, "code": result.rawValue, "name": NSStringFromSendMessageResult(result)])
    })
  }

  func openApp(deviceId: String, completion: @escaping ([String: Any]) -> Void) {
    start()
    guard let id = UUID(uuidString: deviceId), let app = apps[id] else { completion(["ok": false, "code": -1, "name": "UnknownDevice"]); return }
    ConnectIQ.sharedInstance().openAppRequest(app, completion: { result in
      completion(["ok": result.rawValue == 0, "code": result.rawValue, "name": NSStringFromSendMessageResult(result)])
    })
  }

  func appStatus(deviceId: String, completion: @escaping ([String: Any]) -> Void) {
    start()
    guard let id = UUID(uuidString: deviceId), let app = apps[id] else { completion(["installed": false, "version": 0]); return }
    ConnectIQ.sharedInstance().getAppStatus(app, completion: { status in
      completion(["installed": status?.isInstalled ?? false, "version": Int(status?.version ?? 0)])
    })
  }

  func showStore(deviceId: String) {
    guard let id = UUID(uuidString: deviceId), let app = apps[id] else { return }
    ConnectIQ.sharedInstance().showConnectIQStore(for: app)
  }

  // MARK: zdarzenia do JS (z kolejką, gdy JS jeszcze nie słucha)

  private func emitEvent(_ name: String, _ body: [String: Any]) {
    lock.lock()
    if let emit = emit { lock.unlock(); emit(name, body); return }
    pending.append((name, body))
    if pending.count > CiqBridge.maxPending { pending.removeFirst(pending.count - CiqBridge.maxPending) }
    lock.unlock()
  }

  private func flush() {
    lock.lock(); let items = pending; pending = []; let emit = self.emit; lock.unlock()
    for (n, b) in items { emit?(n, b) }
  }

  // MARK: delegaty SDK

  func needsToInstallConnectMobile() {
    // Aplikacji dostawcy zegarka nie ma na telefonie: JS pokazuje wskazówkę (stan „brak aplikacji”), sklep otwiera użytkownik na żądanie.
    emitEvent("onDevices", ["devices": deviceList(), "needsCompanion": true])
  }

  func showCompanionStore() { ConnectIQ.sharedInstance().showAppStoreForConnectMobile() }

  func deviceStatusChanged(_ device: IQDevice!, status: IQDeviceStatus) {
    emitEvent("onDeviceStatus", ["id": device.uuid.uuidString, "status": status.rawValue])
  }

  func deviceCharacteristicsDiscovered(_ device: IQDevice!) {}

  func receivedMessage(_ message: Any!, from app: IQApp!) {
    guard let dict = message as? [String: Any] else { return }
    emitEvent("onMessage", ["id": app.device.uuid.uuidString, "message": dict])
  }
}
