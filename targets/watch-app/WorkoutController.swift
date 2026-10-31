import Foundation
import HealthKit
import WatchKit

// Sesja treningu na zegarku (HKWorkoutSession) — po to, żeby aplikacja żyła i mogła wibrować po opuszczeniu ręki (WKInterfaceDevice.play w tle działa
// tylko z aktywną sesją treningu) oraz żeby tętno i energia trafiły do treningu. Zegarek niczego nie edytuje: sesję startuje polecenie telefonu
// (`session start`) i kończy `session end` (docs/35 rozdz. 6, docs/35-zegarek-apple). Sesja może też wystartować z `startWatchApp` (WKApplicationDelegate.handle).
//
// Zapis do Apple Health (polecenie `session end` z `save = true`): zegarek zapisuje HKWorkout z TYM SAMYM HKMetadataKeySyncIdentifier (= id treningu)
// i SyncVersion = 1 co telefon (lib/health.ts) — HealthKit odrzuca drugi zapis tego samego treningu, więc duplikatu nie ma, kto by pierwszy nie zapisał.
// Wynik (`saved`) wraca do telefonu zdarzeniem `sessionEnded`; telefon zapisuje sam tylko wtedy, gdy zegarek nie zapisał (lib/watch/health.ts).
final class WorkoutController: NSObject, WorkoutDriver, HKWorkoutSessionDelegate, HKLiveWorkoutBuilderDelegate {
  var onStarted: (() -> Void)?
  var onEnded: ((Bool) -> Void)?
  private(set) var isActive = false

  private let store = HKHealthStore()
  private var session: HKWorkoutSession?
  private var builder: HKLiveWorkoutBuilder?
  private var starting = false
  private var endingByUs = false
  /// Pauza treningu na telefonie (B-04, 1.0.1): sesja ma być wstrzymana, gdy telefon ma pauzę. Pamiętane też wtedy, gdy sesja jeszcze nie jest w stanie `running`
  /// (start jest asynchroniczny) — zastosuje je delegat przy przejściu do `running`.
  private var wantsPaused = false

  private var shareTypes: Set<HKSampleType> {
    var s: Set<HKSampleType> = [HKObjectType.workoutType()]
    if let e = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) { s.insert(e) }
    if let h = HKQuantityType.quantityType(forIdentifier: .heartRate) { s.insert(h) }
    return s
  }
  private var readTypes: Set<HKObjectType> {
    var s: Set<HKObjectType> = [HKObjectType.workoutType()]
    if let h = HKQuantityType.quantityType(forIdentifier: .heartRate) { s.insert(h) }
    if let e = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) { s.insert(e) }
    return s
  }

  /// Wywołanie z WKApplicationDelegate.handle(_:) po HKHealthStore.startWatchApp(with:) z telefonu.
  func start(configuration: HKWorkoutConfiguration) { begin(configuration) }

  func start() {
    let c = HKWorkoutConfiguration()
    c.activityType = .traditionalStrengthTraining
    c.locationType = .indoor
    begin(c)
  }

  /// Zgoda na Zdrowie przy otwarciu aplikacji (nie dopiero przy pierwszej sesji) — okno systemowe pojawia się raz; potem wywołanie jest bez skutku.
  /// Wynik nie jest tu potrzebny: bez zgody ekrany działają, a sesja (`begin`) sprawdzi zgodę jeszcze raz.
  func requestAuthorization() {
    guard HKHealthStore.isHealthDataAvailable() else { return }
    store.requestAuthorization(toShare: shareTypes, read: readTypes) { _, _ in }
  }

  private func begin(_ config: HKWorkoutConfiguration) {
    guard !isActive, !starting, HKHealthStore.isHealthDataAvailable() else { return }
    starting = true
    store.requestAuthorization(toShare: shareTypes, read: readTypes) { [weak self] ok, _ in
      DispatchQueue.main.async {
        guard let self = self else { return }
        self.starting = false
        guard ok else { return } // bez zgody: wyświetlanie działa, bez sesji (bez wibracji w tle); zapisuje telefon
        do {
          let s = try HKWorkoutSession(healthStore: self.store, configuration: config)
          let b = s.associatedWorkoutBuilder()
          b.dataSource = HKLiveWorkoutDataSource(healthStore: self.store, workoutConfiguration: config)
          s.delegate = self
          b.delegate = self
          self.session = s; self.builder = b
          let start = Date()
          s.startActivity(with: start)
          b.beginCollection(withStart: start) { _, _ in }
          self.isActive = true
          self.endingByUs = false
          self.wantsPaused = false
          self.onStarted?()
        } catch {
          self.session = nil; self.builder = nil
        }
      }
    }
  }

  /// Pauza i wznowienie sesji razem z telefonem: HealthKit zapisuje zdarzenia pauzy, a czas trwania treningu w Zdrowiu nie liczy pauzy — tak samo jak Historia
  /// w aplikacji i zapis z telefonu (`healthStart`). Wywołanie spoza stanu `running`/`paused` jest zapamiętane i zastosowane przy zmianie stanu sesji.
  func setPaused(_ paused: Bool) {
    wantsPaused = paused
    applyPause()
  }

  private func applyPause() {
    guard let s = session else { return }
    if wantsPaused, s.state == .running { s.pause() }
    else if !wantsPaused, s.state == .paused { s.resume() }
  }

  func end(save: Bool, workoutId: String) {
    guard let s = session, let b = builder else { isActive = false; onEnded?(false); return }
    wantsPaused = false
    endingByUs = true
    s.end()
    session = nil; builder = nil
    isActive = false
    b.endCollection(withEnd: Date()) { [weak self] _, _ in
      guard save else {
        b.discardWorkout()
        DispatchQueue.main.async { self?.onEnded?(false) }
        return
      }
      let meta: [String: Any] = [HKMetadataKeySyncIdentifier: workoutId, HKMetadataKeySyncVersion: 1]
      b.addMetadata(meta) { _, _ in
        b.finishWorkout { workout, _ in
          DispatchQueue.main.async { self?.onEnded?(workout != nil) }
        }
      }
    }
  }

  // MARK: - HKWorkoutSessionDelegate

  func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
    // Pauza z telefonu mogła nadejść, zanim sesja weszła w `running` (albo `resume` przed końcem pauzy) — dopasowanie stanu sesji do stanu telefonu.
    if toState == .running || toState == .paused {
      DispatchQueue.main.async { [weak self] in
        guard let self = self, self.session === workoutSession else { return }
        self.applyPause()
      }
    }
    // System może zakończyć sesję sam (np. użytkownik włączył systemowe Treningi) — wyświetlanie działa dalej, bez wibracji w tle; zapisuje telefon.
    if (toState == .ended || toState == .stopped), !endingByUs, session === workoutSession, isActive {
      DispatchQueue.main.async { [weak self] in
        guard let self = self else { return }
        self.isActive = false; self.session = nil; self.builder = nil
        self.onEnded?(false)
      }
    }
  }

  func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {}

  // MARK: - HKLiveWorkoutBuilderDelegate

  func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
  func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {}
}

/// Krótkie, systemowe wzorce (HealthKit wstrzymuje zbieranie tętna na czas wibracji — docs Apple, WKInterfaceDevice.play).
final class SystemHaptics: WatchHaptics {
  func restEnded() { WKInterfaceDevice.current().play(.notification) }
  func doneTapped() { WKInterfaceDevice.current().play(.click) }
}
