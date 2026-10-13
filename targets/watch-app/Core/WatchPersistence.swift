import Foundation

/// Trwałość stanu zegarka (migawka, kolejka niepotwierdzonych zdarzeń, okno „Cofnij”, licznik zdarzeń) — po restarcie aplikacji zegarek nie gubi zdarzeń.
protocol WatchPersistence: AnyObject {
  func load() -> ClientState?
  func save(_ state: ClientState)
  var lang: String? { get set }
  /// Trening, dla którego zegarek prowadzi sesję (z polecenia `session start`) — po restarcie wiadomo, komu zgłosić koniec sesji.
  var sessionWorkoutId: String? { get set }
}

final class UserDefaultsPersistence: WatchPersistence {
  private let defaults: UserDefaults
  private let key = "watch.client.v1"
  private let langKey = "watch.lang"
  private let sessionKey = "watch.session.workout"
  init(defaults: UserDefaults = .standard) { self.defaults = defaults }
  func load() -> ClientState? {
    guard let d = defaults.data(forKey: key) else { return nil }
    return try? JSONDecoder().decode(ClientState.self, from: d)
  }
  func save(_ state: ClientState) {
    if let d = try? JSONEncoder().encode(state) { defaults.set(d, forKey: key) }
  }
  var lang: String? {
    get { defaults.string(forKey: langKey) }
    set { defaults.set(newValue, forKey: langKey) }
  }
  var sessionWorkoutId: String? {
    get { defaults.string(forKey: sessionKey) }
    set { defaults.set(newValue, forKey: sessionKey) }
  }
}

final class MemoryPersistence: WatchPersistence {
  private var state: ClientState?
  var lang: String?
  var sessionWorkoutId: String?
  init(state: ClientState? = nil) { self.state = state }
  func load() -> ClientState? { state }
  func save(_ state: ClientState) { self.state = state }
}
