import Foundation
import Combine

// Warstwa łącząca model zegarka (WatchClient: clientStep/clientView) z transportem, sesją treningu i wibracją. Zależności wstrzykiwane przez protokoły,
// więc `swift test` sprawdza ją na fałszywych implementacjach (WatchFakes.swift); w aplikacji: WatchConnectivityClient, WorkoutController, SystemHaptics.

protocol WatchTransport: AnyObject {
  /// Każdy komunikat z telefonu (surowy JSON): migawka, ack, welcome, polecenie sesji.
  var onMessage: ((Data) -> Void)? { get set }
  var onReachability: ((Bool) -> Void)? { get set }
  var isReachable: Bool { get }
  func activate()
  /// Wysyła komunikat (JSON) do telefonu: hello albo zdarzenie. Kolejkowanie systemowe i ponowienia po stronie transportu; niepotwierdzone zdarzenia
  /// (bez `ack` protokołu) store wysyła ponownie po powrocie łączności i po `welcome`.
  func send(json: String)
}

protocol WorkoutDriver: AnyObject {
  var isActive: Bool { get }
  /// Sesja treningu wystartowała (HKWorkoutSession.startActivity).
  var onStarted: (() -> Void)? { get set }
  /// Sesja się skończyła: `saved` = trening zapisany w Apple Zdrowiu przez zegarek. Także gdy system zakończył sesję sam.
  var onEnded: ((Bool) -> Void)? { get set }
  func start()
  /// Kończy sesję; `save` = zapisz trening w Zdrowiu z identyfikatorem synchronizacji `workoutId` (ten sam co zapis telefonu — bez duplikatu).
  func end(save: Bool, workoutId: String)
}

protocol WatchHaptics: AnyObject {
  func restEnded()
  func doneTapped()
}

@MainActor
final class WatchStore: ObservableObject {
  @Published private(set) var state: ClientState
  @Published private(set) var sessionActive = false
  @Published private(set) var lang: String

  private let transport: WatchTransport
  private let workout: WorkoutDriver
  private let haptics: WatchHaptics
  private let persistence: WatchPersistence
  private let clock: () -> Double
  private let schedule: (Double, @escaping () -> Void) -> Void
  private var scheduleToken = 0
  private var lastAcceptedPressAt: Double = -1e18
  private var sessionWorkoutId: String?
  private var sessionStartedReported = false

  init(transport: WatchTransport, workout: WorkoutDriver, haptics: WatchHaptics, persistence: WatchPersistence, config: ClientConfig,
       systemLanguages: [String] = Locale.preferredLanguages,
       clock: @escaping () -> Double = { Date().timeIntervalSince1970 * 1000 },
       schedule: @escaping (Double, @escaping () -> Void) -> Void = { delayMs, fire in
         DispatchQueue.main.asyncAfter(deadline: .now() + delayMs / 1000, execute: fire)
       }) {
    self.transport = transport; self.workout = workout; self.haptics = haptics; self.persistence = persistence
    self.clock = clock; self.schedule = schedule
    var st = persistence.load() ?? initialClient(config)
    st.cfg = config            // wersja aplikacji i zdolności mogą się zmienić po aktualizacji
    st.connected = transport.isReachable
    self.state = st
    self.lang = persistence.lang ?? WatchLabels.resolve(preferred: systemLanguages)
    self.sessionWorkoutId = persistence.sessionWorkoutId
    transport.onMessage = { [weak self] d in Task { @MainActor in self?.receive(data: d) } }
    transport.onReachability = { [weak self] r in Task { @MainActor in self?.reachability(r) } }
    workout.onStarted = { [weak self] in Task { @MainActor in self?.sessionStarted() } }
    workout.onEnded = { [weak self] saved in Task { @MainActor in self?.sessionEnded(saved: saved) } }
  }

  var now: Double { clock() }
  func label(_ key: WatchLabelKey) -> String { WatchLabels.text(key, lang: lang) }
  func view(at nowMs: Double) -> ClientView { clientView(state, nowMs: nowMs) }

  // MARK: - Cykl życia

  func start() {
    transport.activate()
    apply(.launch)
    resendQueue()
  }

  /// Aplikacja wraca na ekran: nadrabiamy koniec przerwy, który minął, i ponawiamy niepotwierdzone zdarzenia.
  func didBecomeActive() {
    apply(.tick)
    resendQueue()
    objectWillChange.send()
  }

  // MARK: - Przyciski

  /// `main` = „Seria zrobiona” (przycisk i podwójne stuknięcie), `differ` = „Zrobione inaczej”.
  func press(_ b: ClientButton) {
    if b == .main || b == .differ {
      let t = now
      guard t - lastAcceptedPressAt >= WatchLimits.debounceMs else { return }
      let before = state.queue.count
      apply(.press(b))
      if state.queue.count > before { lastAcceptedPressAt = t; haptics.doneTapped() }
      return
    }
    apply(.press(b))
  }

  func tick() { apply(.tick) }

  // MARK: - Z telefonu

  func receive(data: Data) {
    guard let msg = WatchCodec.decodePhone(data) else {
      /* komunikat z przyszłości (wyższa wersja `v`) — aktualizacja aplikacji na zegarku */
      if let v = WatchCodec.probeVersion(data), v > watchProtocolVersion { state.upgrade = "watch"; persist() }
      return
    }
    apply(.receive(msg))
    switch msg {
    case .snapshot(let m):
      if !m.lang.isEmpty, WatchLabels.table[m.lang] != nil, m.lang != lang { lang = m.lang; persistence.lang = m.lang }
    case .welcome(let w):
      if w.ok { resendQueue() }
    case .session(let c):
      handleSession(c)
    case .ack:
      break
    }
  }

  /// Po powrocie łączności model wysyła `hello`; niepotwierdzone zdarzenia idą ponownie dopiero po `welcome` (telefon odpowiada, gdy jego strona działa).
  private func reachability(_ r: Bool) {
    apply(.connection(reachable: r))
  }

  // MARK: - Sesja treningu (Zdrowie)

  private func handleSession(_ c: WatchSessionCmd) {
    switch c.action {
    case .start:
      sessionWorkoutId = c.workoutId; persistence.sessionWorkoutId = c.workoutId
      if workout.isActive { sessionStarted() } else { workout.start() }
    case .end:
      sessionWorkoutId = c.workoutId; persistence.sessionWorkoutId = c.workoutId
      if workout.isActive { workout.end(save: c.save, workoutId: c.workoutId) } else { reportEnded(saved: false) }
    }
  }

  private func sessionStarted() {
    sessionActive = true
    guard let id = sessionWorkoutId, !sessionStartedReported else { return }
    sessionStartedReported = true
    note(.sessionStarted, workoutId: id)
  }

  private func sessionEnded(saved: Bool) {
    sessionActive = false
    reportEnded(saved: saved)
  }

  private func reportEnded(saved: Bool) {
    guard let id = sessionWorkoutId else { return }
    sessionWorkoutId = nil; persistence.sessionWorkoutId = nil; sessionStartedReported = false
    note(.sessionEnded, workoutId: id, saved: saved)
  }

  private func note(_ type: WatchEventType, workoutId: String, saved: Bool? = nil) {
    let ev = clientNoteSession(&state, type: type, workoutId: workoutId, at: now, saved: saved)
    persist()
    transport.send(json: WatchCodec.encode(ev))
  }

  // MARK: - Pomocnicze

  private func apply(_ input: ClientInput) {
    let t = now
    let endsBefore = clientRestEndsAt(state)   // przerwa, którą reduktor może uznać za skończoną w tym kroku
    let step = clientStep(state, TimedInput(at: t, input: input))
    state = step.state
    for m in step.out {
      transport.send(json: WatchCodec.encode(m))
      /* wibracja tylko, gdy przerwa skończyła się przed chwilą; zdarzenie dla głosu telefonu idzie zawsze */
      if case .event(let e) = m, e.type == .restEnded, let r = endsBefore, t - r <= WatchLimits.restEndGraceMs { haptics.restEnded() }
    }
    persist()
    scheduleTick()
  }

  private func resendQueue() {
    for e in state.queue { transport.send(json: WatchCodec.encode(e)) }
  }

  private func persist() { persistence.save(state) }

  private func scheduleTick() {
    scheduleToken += 1
    let token = scheduleToken
    let t = now
    let v = clientView(state, nowMs: t)
    var deadlines: [Double] = []
    if let end = v.restEndsAt { deadlines.append(end) }
    if let u = v.undoUntil { deadlines.append(u) }
    guard let next = deadlines.filter({ $0 > t }).min() else { return }
    schedule(next - t + 50) { [weak self] in
      Task { @MainActor in
        guard let self = self, self.scheduleToken == token else { return }
        self.tick()
      }
    }
  }
}
