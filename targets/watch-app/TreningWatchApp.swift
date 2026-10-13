import SwiftUI
import WatchKit
import HealthKit

// Aplikacja na Apple Watch (0.20 „Zegarki i głos”, docs/36): wyświetla to, co dzieje się na telefonie (bieżące ćwiczenie, seria k z n,
// ciężar i powtórzenia, od początku przerwy zapowiedź następnego ćwiczenia, odliczanie przerwy z wibracją) i odsyła zdarzenia:
// „zrobione według planu”, „zrobione inaczej”, „pomiń” (z potwierdzeniem), „cofnij”. BEZ edycji na zegarku. Teksty dynamiczne przychodzą
// z telefonu gotowe. Podwójne stuknięcie (watchOS 11) = „zrobione według planu”.

@MainActor
final class AppEnvironment {
  static let shared = AppEnvironment()
  let workout = WorkoutController()
  let transport = WatchConnectivityClient()

  static let config = ClientConfig(client: .apple, app: (Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String) ?? "0", session: true)

  lazy var store: WatchStore = {
    #if DEBUG
    /// Testy interfejsu na symulatorze (tests/fixtures/watch-app, targets/watch-ui-tests): migawka w zmiennej środowiskowej, bez telefonu.
    /// Tylko w konfiguracji Debug — wydanie (Release) ignoruje te zmienne.
    let env = ProcessInfo.processInfo.environment
    if let json = env["WATCH_FAKE_SNAPSHOT_JSON"] {
      let online = env["WATCH_FAKE_REACHABLE"] != "0"
      let ft = FakeTransport(reachable: online, autoReply: online)
      let s = WatchStore(transport: ft, workout: FakeWorkout(), haptics: FakeHaptics(), persistence: MemoryPersistence(), config: AppEnvironment.config)
      /* jeden komunikat albo tablica komunikatów (np. migawka i polecenie sesji) — dostarczane po kolei */
      var messages = [json]
      if json.hasPrefix("["), let arr = try? JSONSerialization.jsonObject(with: Data(json.utf8)) as? [[String: Any]] {
        messages = arr.compactMap { try? JSONSerialization.data(withJSONObject: $0) }.compactMap { String(data: $0, encoding: .utf8) }
      }
      DispatchQueue.main.async { for m in messages { ft.deliver(json: m) } }
      return s
    }
    #endif
    return WatchStore(transport: transport, workout: workout, haptics: SystemHaptics(), persistence: UserDefaultsPersistence(), config: AppEnvironment.config)
  }()
}

final class AppDelegate: NSObject, WKApplicationDelegate {
  /// Telefon wywołał HKHealthStore.startWatchApp(with:) — startujemy sesję treningu z jego konfiguracją (polecenie `session start` dowiąże ją do treningu).
  func handle(_ workoutConfiguration: HKWorkoutConfiguration) {
    Task { @MainActor in AppEnvironment.shared.workout.start(configuration: workoutConfiguration) }
  }
}

@main
struct TreningWatchApp: App {
  @WKApplicationDelegateAdaptor(AppDelegate.self) private var delegate
  @Environment(\.scenePhase) private var phase

  var body: some Scene {
    WindowGroup {
      RootView(store: AppEnvironment.shared.store)
        .onAppear { AppEnvironment.shared.store.start() }
        .onChange(of: phase) { _, p in if p == .active { AppEnvironment.shared.store.didBecomeActive() } }
    }
  }
}
