import XCTest
@testable import WatchCore

@MainActor
final class WatchStoreTests: XCTestCase {
  private var transport = FakeTransport()
  private var workout = FakeWorkout()
  private var haptics = FakeHaptics()
  private var persistence = MemoryPersistence()
  private var nowMs = T0
  private var scheduled: [(delay: Double, fire: () -> Void)] = []
  private let apple = ClientConfig(client: .apple, app: "0.20.0", session: true)

  private func makeStore(reachable: Bool = true, autoReply: Bool = true, persisted: ClientState? = nil, languages: [String] = ["pl-PL"]) -> WatchStore {
    transport = FakeTransport(reachable: reachable, autoReply: autoReply)
    workout = FakeWorkout(); haptics = FakeHaptics(); persistence = MemoryPersistence(state: persisted)
    scheduled = []
    return WatchStore(transport: transport, workout: workout, haptics: haptics, persistence: persistence, config: apple, systemLanguages: languages,
                      clock: { [unowned self] in self.nowMs }, schedule: { [unowned self] d, f in self.scheduled.append((d, f)) })
  }

  /// Wywołania zwrotne transportu i sesji trafiają do `Task { @MainActor }` — oddajemy sterowanie kilka razy, żeby się wykonały.
  private func settle() async { for _ in 0..<8 { await Task.yield() } }

  override func setUp() async throws { nowMs = T0 }

  private func session(_ action: String, id: String = "workout-1", save: Bool = true) -> String {
    "{\"v\":1,\"kind\":\"session\",\"action\":\"\(action)\",\"workoutId\":\"\(id)\",\"save\":\(save)}"
  }

  func testStartActivatesTransportSendsHelloAndGetsWelcome() async {
    let s = makeStore()
    s.start(); await settle()
    XCTAssertTrue(transport.activated)
    XCTAssertEqual(transport.sentKinds, ["hello"])
    XCTAssertNotNil(persistence.load())
    XCTAssertNil(s.state.upgrade)
  }

  /// Decyzja właściciela 14.10.2026: zgoda na Zdrowie przy pierwszym otwarciu aplikacji na zegarku, nie przy pierwszym treningu.
  func testStartAsksForHealthAuthorizationOnFirstLaunchWithoutStartingSession() async {
    let s = makeStore()
    XCTAssertEqual(workout.authorizationRequests, 0)       // sam store jeszcze o nic nie prosi
    s.start(); await settle()
    XCTAssertEqual(workout.authorizationRequests, 1)       // otwarcie aplikacji = prośba o zgodę
    XCTAssertEqual(workout.starts, 0)                       // bez sesji treningu i bez polecenia telefonu
    XCTAssertFalse(s.sessionActive)
    XCTAssertTrue(transport.activated)                      // reszta startu bez zmian
  }

  func testAuthorizationIsAskedOncePerLaunchNotOnResume() async {
    var s = makeStore()
    s.start(); s.didBecomeActive(); s.didBecomeActive(); await settle()
    XCTAssertEqual(workout.authorizationRequests, 1)       // powrót na ekran nie pyta ponownie
    s = makeStore(persisted: persistence.load())            // kolejne uruchomienie (stan z dysku, nowy FakeWorkout): znów jedna prośba; system pokaże okno tylko gdy zgoda nieustalona
    s.start(); await settle()
    XCTAssertEqual(workout.authorizationRequests, 1)
  }

  func testSessionStartFromPhoneWorksWithoutPriorAuthorizationRequest() async {
    let s = makeStore()
    s.start(); await settle()
    transport.deliver(json: session("start")); await settle()
    XCTAssertEqual(workout.starts, 1)
    XCTAssertTrue(s.sessionActive)
    XCTAssertEqual(workout.authorizationRequests, 1)       // zgoda tylko przy otwarciu; polecenie sesji nie dokłada kolejnej prośby w store
  }

  func testDefaultLanguageFromSystemThenFromSnapshot() async {
    let s = makeStore(languages: ["de-DE"])
    XCTAssertEqual(s.lang, "de")
    XCTAssertEqual(s.label(.done), "Satz erledigt")
    s.start()
    transport.deliver(json: Fixtures.snapshotJSON("set-first"))                          // lang pl
    await settle()
    XCTAssertEqual(s.lang, "pl")
    XCTAssertEqual(persistence.lang, "pl")
    XCTAssertEqual(s.label(.done), "Seria zrobiona")
  }

  func testUnknownSnapshotLanguageKeepsCurrentOne() async {
    let s = makeStore(languages: ["en-US"])
    s.start()
    var snap = Fixtures.snapshot("set-first"); snap.lang = "xx"
    transport.deliver(json: String(data: try! JSONEncoder().encode(snap), encoding: .utf8)!)
    await settle()
    XCTAssertEqual(s.lang, "en")
  }

  func testSnapshotShowsSetAndPressSendsDoneAndStartsRest() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    XCTAssertEqual(s.view(at: nowMs).screen, .set)
    s.press(.main); await settle()
    XCTAssertEqual(haptics.doneCount, 1)
    let done = transport.sentEvents.first { $0.type == .done }
    XCTAssertEqual(done?.setId, "set-0-0"); XCTAssertEqual(done?.eventId, "apple-1")
    let v = s.view(at: nowMs + 10)
    XCTAssertEqual(v.screen, .rest)
    XCTAssertTrue(v.cue?.contains("seria 2") ?? false)
    XCTAssertTrue(s.state.queue.isEmpty, "telefon potwierdził (ack)")
    XCTAssertEqual(Int(scheduled.last!.delay), Int(Double(WatchLimits.undoSec) * 1000) + 50, "najbliższy termin to koniec okna „Cofnij”")
  }

  func testQuickSecondPressIsDebounced() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    s.press(.main); nowMs += 100; s.press(.main); await settle()
    XCTAssertEqual(transport.sentEvents.filter { $0.type == .done }.count, 1)
    XCTAssertEqual(haptics.doneCount, 1)
    nowMs += WatchLimits.debounceMs; s.press(.main); await settle()
    XCTAssertEqual(transport.sentEvents.filter { $0.type == .done }.count, 2)
  }

  func testRestEndHapticAndEventWhenTimerFires() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    s.press(.main); await settle()
    nowMs = T0 + 90_100
    scheduled.last?.fire(); await settle()
    XCTAssertEqual(haptics.restEndedCount, 1)
    XCTAssertTrue(transport.sentEvents.contains { $0.type == .restEnded && $0.setId == "set-0-0" })
  }

  func testStaleRestFromSnapshotSendsEventButDoesNotBuzz() async {
    let s = makeStore()
    s.start()
    nowMs = T0 + 90_000 + WatchLimits.restEndGraceMs + 1                            // przerwa z migawki skończyła się dawno temu
    transport.deliver(json: Fixtures.snapshotJSON("rest-after-first")); await settle()
    s.tick(); await settle()
    XCTAssertEqual(haptics.restEndedCount, 0)
    XCTAssertTrue(transport.sentEvents.contains { $0.type == .restEnded })
  }

  func testOlderScheduledTickIsIgnoredAfterRescheduling() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    s.press(.main); await settle()
    let first = scheduled.last
    nowMs = T0 + 1000
    s.press(.undo); await settle()
    nowMs = T0 + 90_100
    first?.fire(); await settle()
    XCTAssertEqual(haptics.restEndedCount, 0)
    XCTAssertFalse(transport.sentEvents.contains { $0.type == .restEnded })
  }

  func testOfflineEventsStayQueuedAndAreResentAfterReconnect() async {
    let s = makeStore(reachable: false, autoReply: false)
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    s.press(.main); await settle()
    XCTAssertTrue(s.view(at: nowMs).offline)
    XCTAssertEqual(transport.sentEvents.filter { $0.eventId == "apple-1" }.count, 1)
    XCTAssertEqual(s.state.queue.count, 1)
    // powrót łączności: hello i ponowna wysyłka niepotwierdzonych zdarzeń (ten sam eventId — telefon pomija powtórki)
    transport.autoReply = true
    transport.setReachable(true); await settle()
    XCTAssertEqual(transport.sentEvents.filter { $0.eventId == "apple-1" }.count, 2)
    XCTAssertTrue(s.state.queue.isEmpty)
    XCTAssertEqual(transport.sentKinds.filter { $0 == "hello" }.count, 2)
    XCTAssertFalse(s.view(at: nowMs).offline)
  }

  func testWelcomeResendsQueuedEventsOnce() async {
    let s = makeStore(autoReply: false)
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    s.press(.main); await settle()
    transport.deliver(json: "{\"v\":1,\"kind\":\"welcome\",\"ok\":true,\"protocol\":1,\"upgrade\":null}"); await settle()
    XCTAssertEqual(transport.sentEvents.filter { $0.eventId == "apple-1" }.count, 2)
  }

  func testQueuedEventsSurviveRestart() async {
    var st = initialClient(apple)
    st = clientStep(st, TimedInput(at: T0, input: .receive(.snapshot(Fixtures.snapshot("set-first"))))).state
    st = clientStep(st, TimedInput(at: T0, input: .press(.main))).state
    let s = makeStore(persisted: st)
    s.start(); await settle()
    XCTAssertTrue(transport.sentEvents.contains { $0.eventId == "apple-1" })
    XCTAssertEqual(s.view(at: T0 + 10).screen, .rest)                               // po restarcie nakładka nadal pokazuje przerwę
  }

  func testSkipFlowThroughStore() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    s.press(.skip)
    XCTAssertTrue(s.view(at: nowMs).confirmSkip)
    s.press(.cancelSkip)
    XCTAssertFalse(transport.sentEvents.contains { $0.type == .skip })
    s.press(.skip); s.press(.confirmSkip); await settle()
    XCTAssertTrue(transport.sentEvents.contains { $0.type == .skip && $0.blockId == "block-0" })
  }

  func testDifferThroughStore() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    s.press(.differ); await settle()
    XCTAssertTrue(transport.sentEvents.contains { $0.type == .differ && $0.setId == "set-0-0" })
    XCTAssertEqual(haptics.doneCount, 1)
  }

  func testFutureProtocolMessageShowsUpdate() async {
    let s = makeStore()
    s.start()
    transport.deliver(json: "{\"v\":2,\"kind\":\"snapshot\",\"nowe\":true}"); await settle()
    XCTAssertEqual(s.view(at: nowMs).screen, .update)
    XCTAssertEqual(workout.starts, 0)
  }

  // MARK: - Sesja treningu (Zdrowie)

  func testSessionStartCommandStartsWorkoutAndReportsToPhone() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); await settle()
    XCTAssertEqual(workout.starts, 0, "sesję startuje polecenie telefonu, nie sama migawka")
    transport.deliver(json: session("start")); await settle()
    XCTAssertEqual(workout.starts, 1)
    XCTAssertTrue(s.sessionActive)
    let ev = transport.sentEvents.first { $0.type == .sessionStarted }
    XCTAssertEqual(ev?.workoutId, "workout-1")
    transport.deliver(json: session("start")); await settle()                       // powtórzone polecenie: bez drugiej sesji i bez drugiego raportu
    XCTAssertEqual(workout.starts, 1)
    XCTAssertEqual(transport.sentEvents.filter { $0.type == .sessionStarted }.count, 1)
  }

  func testSessionEndSavesWithPhoneWorkoutIdAndReportsSaved() async {
    let s = makeStore()
    s.start(); transport.deliver(json: Fixtures.snapshotJSON("set-first")); transport.deliver(json: session("start")); await settle()
    transport.deliver(json: session("end", save: true)); await settle()
    XCTAssertEqual(workout.ends.count, 1)
    XCTAssertEqual(workout.ends.first?.save, true)
    XCTAssertEqual(workout.ends.first?.workoutId, "workout-1")                      // ten sam identyfikator synchronizacji co zapis telefonu (bez duplikatu)
    XCTAssertFalse(s.sessionActive)
    XCTAssertEqual(transport.sentEvents.last { $0.type == .sessionEnded }?.saved, true)
  }

  func testSessionEndWithoutSaveReportsNotSaved() async {
    let s = makeStore()
    s.start(); transport.deliver(json: session("start")); await settle()
    transport.deliver(json: session("end", save: false)); await settle()
    XCTAssertEqual(workout.ends.first?.save, false)
    XCTAssertEqual(transport.sentEvents.last { $0.type == .sessionEnded }?.saved, false)
  }

  func testSaveFailureIsReportedAsNotSaved() async {
    let s = makeStore()
    s.start(); transport.deliver(json: session("start")); await settle()
    workout.saveSucceeds = false
    transport.deliver(json: session("end", save: true)); await settle()
    XCTAssertEqual(transport.sentEvents.last { $0.type == .sessionEnded }?.saved, false)
  }

  func testSessionEndWithoutALiveSessionReportsNotSavedSoPhoneDoesNotWait() async {
    let s = makeStore()
    s.start(); await settle()
    transport.deliver(json: session("end", id: "workout-7")); await settle()
    XCTAssertEqual(workout.ends.count, 0)
    let ev = transport.sentEvents.last { $0.type == .sessionEnded }
    XCTAssertEqual(ev?.workoutId, "workout-7"); XCTAssertEqual(ev?.saved, false)
  }

  func testSystemEndedSessionIsReportedAsNotSaved() async {
    let s = makeStore()
    s.start(); transport.deliver(json: session("start")); await settle()
    workout.isActive = false; workout.onEnded?(false); await settle()               // np. użytkownik włączył systemowe Treningi
    XCTAssertFalse(s.sessionActive)
    XCTAssertEqual(transport.sentEvents.last { $0.type == .sessionEnded }?.saved, false)
  }

  func testSessionEventsAreQueuedUntilAcked() async {
    let s = makeStore(reachable: false, autoReply: false)
    s.start(); transport.deliver(json: session("start")); await settle()
    XCTAssertTrue(s.state.queue.contains { $0.type == .sessionStarted })
    transport.autoReply = true; transport.setReachable(true); await settle()
    XCTAssertTrue(s.state.queue.isEmpty)
  }
}
