import XCTest
@testable import WatchCore

/// Odtwarza na Swift scenariusze wygenerowane z modelu referencyjnego (lib/watch/client.ts): każdy krok daje te same zdarzenia i ten sam widok.
/// To jest ręka na pulsie zgodności zegarka z protokołem — tu zegarek nie może się rozjechać.
final class ScenarioReplayTests: XCTestCase {
  func testFixturesCoverTheExpectedScenarios() {
    let names = Fixtures.names("scenarios").map { String($0.dropLast(5)) }
    for want in ["basic-apple", "undo-window", "differ", "skip-confirm", "main-in-rest", "rest-ended", "offline-two-done", "stale-snapshot", "finished-and-update", "last-set-and-done", "paused"] {
      XCTAssertTrue(names.contains(want), "brak scenariusza \(want)")
    }
  }

  func testEveryScenarioReplaysIdentically() {
    var total = 0
    for file in Fixtures.names("scenarios") {
      let sc = Fixtures.scenario(file)
      var st = initialClient(sc.cfg)
      for (i, step) in sc.steps.enumerated() {
        let r = clientStep(st, TimedInput(at: step.at, input: step.input))
        st = r.state
        XCTAssertEqual(r.out, step.out, "\(sc.name), krok \(i) (\(step.note ?? "")): zdarzenia do telefonu")
        XCTAssertEqual(clientView(st, nowMs: step.at), step.view, "\(sc.name), krok \(i) (\(step.note ?? "")): widok")
        total += 1
      }
    }
    XCTAssertGreaterThan(total, 50)
  }

  /// Stan zegarka przeżywa zapis i odczyt w KAŻDYM kroku każdego scenariusza (restart aplikacji w dowolnym momencie nie zmienia widoku).
  func testStateSurvivesEncodeDecodeAtEveryStep() throws {
    for file in Fixtures.names("scenarios") {
      let sc = Fixtures.scenario(file)
      var st = initialClient(sc.cfg)
      for (i, step) in sc.steps.enumerated() {
        st = clientStep(st, TimedInput(at: step.at, input: step.input)).state
        st = try JSONDecoder().decode(ClientState.self, from: JSONEncoder().encode(st))
        XCTAssertEqual(clientView(st, nowMs: step.at), step.view, "\(sc.name), krok \(i) po restarcie")
      }
    }
  }

  func testScenarioClientsMatchTheirEventIdPrefix() {
    for file in Fixtures.names("scenarios") {
      let sc = Fixtures.scenario(file)
      for step in sc.steps { for case .event(let e) in step.out { XCTAssertTrue(e.eventId.hasPrefix(sc.cfg.client.rawValue + "-"), sc.name); XCTAssertEqual(e.client, sc.cfg.client) } }
    }
  }
}
