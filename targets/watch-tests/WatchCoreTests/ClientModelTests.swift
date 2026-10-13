import XCTest
@testable import WatchCore

/// Przypadki poza scenariuszami z modelu referencyjnego: granice, idempotencja, kolejność zdarzeń, trwałość, sesja treningu.
final class ClientModelTests: XCTestCase {
  private let apple = ClientConfig(client: .apple, app: "0.20.0", session: true)

  private func step(_ s: ClientState, _ at: Double, _ input: ClientInput) -> ClientStep { clientStep(s, TimedInput(at: at, input: input)) }
  private func started(_ snap: String = "set1") -> ClientState {
    var s = initialClient(apple)
    s = step(s, T0, .receive(.welcome(WatchWelcome(v: 1, kind: "welcome", ok: true, protocolVersion: 1, upgrade: nil)))).state
    return step(s, T0, .receive(.snapshot(Fixtures.snapshot(snap)))).state
  }
  private func events(_ r: ClientStep) -> [WatchEvent] { r.out.compactMap { if case .event(let e) = $0 { return e } else { return nil } } }

  func testLaunchSaysHelloWithClientAndSessionCapability() {
    let r = step(initialClient(apple), T0, .launch)
    guard case .hello(let h) = r.out.first else { return XCTFail("oczekiwano hello") }
    XCTAssertEqual(h.client, .apple); XCTAssertEqual(h.protocolVersion, watchProtocolVersion); XCTAssertEqual(h.app, "0.20.0"); XCTAssertTrue(h.caps.session)
    XCTAssertEqual(r.out.count, 1)
  }

  func testPressesWithoutAWorkoutDoNothing() {
    var s = initialClient(apple)
    for b in [ClientButton.main, .differ, .skip, .confirmSkip, .cancelSkip, .undo] {
      let r = step(s, T0, .press(b)); XCTAssertTrue(r.out.isEmpty, b.rawValue); s = r.state
    }
    XCTAssertEqual(clientView(s, nowMs: T0).screen, .idle)
    XCTAssertTrue(s.queue.isEmpty)
  }

  func testEventCarriesWorkoutRevisionAndTimeOfThePress() {
    let s = started()
    let e = events(step(s, T0 + 777, .press(.main)))
    XCTAssertEqual(e.count, 1)
    XCTAssertEqual(e[0].type, .done); XCTAssertEqual(e[0].setId, "set-0-0"); XCTAssertEqual(e[0].workoutId, "workout-1")
    XCTAssertEqual(e[0].baseRev, Fixtures.snapshot("set1").rev); XCTAssertEqual(e[0].at, T0 + 777); XCTAssertEqual(e[0].eventId, "apple-1"); XCTAssertEqual(e[0].client, .apple)
  }

  func testEventIdsAreSequentialAndSurviveRestart() throws {
    var s = started()
    s = step(s, T0 + 1000, .press(.main)).state
    s = try JSONDecoder().decode(ClientState.self, from: JSONEncoder().encode(s))        // restart aplikacji
    let e = events(step(s, T0 + 20_000, .press(.main)))
    XCTAssertEqual(e.first?.eventId, "apple-2")
  }

  func testSnapshotReflectingTheEventDoesNotApplyItTwice() {
    // „zrobione” wysłane (zdarzenie w kolejce), telefon przysłał już migawkę z przerwą, ale ack jeszcze nie doszedł — widok nie odhacza kolejnej serii
    var s = started()
    s = step(s, T0 + 1000, .press(.main)).state
    s = step(s, T0 + 1200, .receive(.snapshot(Fixtures.snapshot("rest1")))).state
    let v = clientView(s, nowMs: T0 + 1300)
    XCTAssertEqual(v.screen, .rest); XCTAssertEqual(v.counter, "seria 2 z 3")
    XCTAssertEqual(v.doneCount, Fixtures.snapshot("rest1").doneCount)               // bez doliczenia zdarzenia, które migawka już ma
    XCTAssertEqual(s.queue.count, 1)
    s = step(s, T0 + 1400, .receive(.ack(WatchAck(v: 1, kind: "ack", eventId: "apple-1", status: "applied", reason: nil, rev: 2)))).state
    XCTAssertTrue(s.queue.isEmpty)
  }

  func testDuplicateAckAndUnknownAckAreHarmless() {
    var s = started()
    s = step(s, T0 + 1000, .press(.main)).state
    let ack = WatchAck(v: 1, kind: "ack", eventId: "apple-1", status: "applied", reason: nil, rev: 2)
    s = step(s, T0 + 1100, .receive(.ack(ack))).state
    let again = step(s, T0 + 1200, .receive(.ack(ack)))
    XCTAssertEqual(again.state, s)
    XCTAssertTrue(again.out.isEmpty)
  }

  func testUndoRestoresPreviousRestWhenTwoSetsWereTicked() {
    var s = started()
    s = step(s, T0 + 1000, .press(.main)).state
    s = step(s, T0 + 2000, .press(.main)).state
    let r = step(s, T0 + 3000, .press(.undo))
    XCTAssertEqual(events(r).first?.type, .undo); XCTAssertEqual(events(r).first?.setId, "set-0-1")
    let v = clientView(r.state, nowMs: T0 + 3100)
    XCTAssertEqual(v.screen, .rest); XCTAssertEqual(v.counter, "seria 2 z 3")      // znów przerwa po pierwszej serii, następna do odhaczenia: druga
  }

  func testUndoIsRefusedAfterTheWindow() {
    var s = started()
    s = step(s, T0 + 1000, .press(.main)).state
    let late = step(s, T0 + 1000 + Double(WatchLimits.undoSec) * 1000 + 1, .press(.undo))
    XCTAssertTrue(late.out.isEmpty)
  }

  func testDoneDuringRestStartsANewRestAndSupersedesTheOldEnd() {
    var s = started("rest1")                                                       // przerwa po set-0-0 do T0+90 s, następna: set-0-1, po niej set-0-2
    s = step(s, T0 + 10_000, .press(.main)).state                                  // set-0-1 odhaczona w przerwie → nowa przerwa 90 s od T0+10 s
    XCTAssertTrue(events(step(s, T0 + 91_000, .tick)).isEmpty, "stary koniec przerwy już nie obowiązuje")
    let r = step(s, T0 + 100_000, .tick)
    XCTAssertEqual(events(r).first?.type, .restEnded); XCTAssertEqual(events(r).first?.setId, "set-0-1")
  }

  func testRestEndedFiresOncePerRest() {
    var s = started()
    s = step(s, T0 + 1000, .press(.main)).state
    let r1 = step(s, T0 + 1000 + 90_000, .tick)
    XCTAssertEqual(events(r1).first?.type, .restEnded); XCTAssertEqual(events(r1).first?.setId, "set-0-0")
    XCTAssertTrue(events(step(r1.state, T0 + 1000 + 91_000, .tick)).isEmpty)
  }

  func testNoTickEventsWithoutSnapshot() {
    XCTAssertTrue(step(initialClient(apple), T0, .tick).out.isEmpty)
  }

  func testOfflineThirdPressDoesNothing() {
    var s = started()
    s = step(s, T0 + 100, .connection(reachable: false)).state
    s = step(s, T0 + 1000, .press(.main)).state
    s = step(s, T0 + 20_000, .press(.main)).state
    let third = step(s, T0 + 21_000, .press(.main))
    XCTAssertTrue(third.out.isEmpty)
    XCTAssertEqual(clientView(third.state, nowMs: T0 + 21_000).screen, .connect)
  }

  func testReconnectSendsHelloAndBackOnlineAcksClearTheQueue() {
    var s = started()
    s = step(s, T0 + 100, .connection(reachable: false)).state
    s = step(s, T0 + 1000, .press(.main)).state
    let back = step(s, T0 + 30_000, .connection(reachable: true))
    if case .hello = back.out.first {} else { XCTFail("po powrocie łączności hello") }
    XCTAssertEqual(back.state.queue.count, 1)                                       // zdarzenie czeka na ack (store wyśle je ponownie)
  }

  func testFutureProtocolWelcomeShowsUpdateAndNewWelcomeClearsIt() {
    var s = started()
    s = step(s, T0 + 1, .receive(.welcome(WatchWelcome(v: 1, kind: "welcome", ok: false, protocolVersion: 2, upgrade: "watch")))).state
    XCTAssertEqual(clientView(s, nowMs: T0 + 2).screen, .update)
    s = step(s, T0 + 3, .receive(.welcome(WatchWelcome(v: 1, kind: "welcome", ok: true, protocolVersion: 1, upgrade: nil)))).state
    XCTAssertEqual(clientView(s, nowMs: T0 + 4).screen, .set)
  }

  func testSessionNotesGoThroughTheSameQueueAndUseThePhoneWorkoutId() {
    var s = started()
    s = step(s, T0 + 1000, .press(.main)).state                                    // apple-1
    let startEv = clientNoteSession(&s, type: .sessionStarted, workoutId: "workout-1", at: T0 + 2000)
    let endEv = clientNoteSession(&s, type: .sessionEnded, workoutId: "workout-1", at: T0 + 3000, saved: true)
    XCTAssertEqual([startEv.eventId, endEv.eventId], ["apple-2", "apple-3"])
    XCTAssertNil(startEv.saved); XCTAssertEqual(endEv.saved, true)
    XCTAssertEqual(s.queue.map { $0.type }, [.done, .sessionStarted, .sessionEnded])
    // po migawce „idle” (trening skończony na telefonie) zdarzenie sesji nadal ma id treningu z polecenia, nie puste
    var idle = Fixtures.snapshot("idle"); idle.rev = 99
    s = step(s, T0 + 4000, .receive(.snapshot(idle))).state
    let late = clientNoteSession(&s, type: .sessionEnded, workoutId: "workout-1", at: T0 + 5000, saved: false)
    XCTAssertEqual(late.workoutId, "workout-1"); XCTAssertEqual(late.saved, false)
    XCTAssertEqual(clientView(s, nowMs: T0 + 6000).screen, .finished)               // zdarzenia sesji nie psują widoku
  }

  func testLimitsAreTheDocumentedOnes() {
    XCTAssertEqual(WatchLimits.undoSec, 5)
    XCTAssertEqual(WatchLimits.offlineDoneMax, 2)
    XCTAssertGreaterThan(WatchLimits.debounceMs, 0)
  }
}
