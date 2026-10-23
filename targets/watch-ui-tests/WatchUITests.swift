import XCTest

// Testy interfejsu aplikacji na Apple Watch (XCUITest, symulator watchOS; workflow watch-sim.yml — docs/35-zegarek-apple). Telefonu nie ma: komunikaty z plików
// wzorcowych protokołu (watch-fixtures) trafiają do aplikacji zmienną środowiskową WATCH_FAKE_SNAPSHOT_JSON (tylko konfiguracja Debug) — jeden komunikat
// albo tablica; fałszywy „telefon” odpowiada jak prawdziwy (welcome na hello, ack na zdarzenie), chyba że zegarek ma być „poza zasięgiem”.
// Elementy po stabilnych identyfikatorach (nie po tekście), więc test działa w każdym języku; teksty sprawdza osobno pętla po 35 językach.
// Migawki mają stałą godzinę z października 2026 (przerwy w nich są już „skończone”), więc przerwę na ekranie wywołuje dopiero „Seria zrobiona”.
@MainActor
final class WatchUITests: XCTestCase {
  private let root: URL = {
    var u = URL(fileURLWithPath: #filePath)
    for _ in 0..<3 { u.deleteLastPathComponent() } // WatchUITests.swift, watch-ui-tests, targets → korzeń repozytorium
    return u
  }()

  override func setUp() async throws { continueAfterFailure = false }

  /// Pliki wzorcowe protokołu (watch-fixtures/) albo wygenerowane dla Apple Watch (tests/fixtures/watch-app/: labels.json).
  private func fixture(_ path: String, apple: Bool = false) -> Data {
    let url = root.appendingPathComponent(apple ? "tests/fixtures/watch-app/\(path)" : "watch-fixtures/\(path)")
    guard let d = try? Data(contentsOf: url) else { fatalError("Brak pliku wzorcowego: \(url.path)") }
    return d
  }

  private func object(_ name: String, edit: (inout [String: Any]) -> Void = { _ in }) -> [String: Any] {
    var obj = try! JSONSerialization.jsonObject(with: fixture("snapshots/\(name).json")) as! [String: Any]
    edit(&obj)
    return obj
  }

  private func json(_ messages: [[String: Any]]) -> String {
    let data = messages.count == 1 ? try! JSONSerialization.data(withJSONObject: messages[0]) : try! JSONSerialization.data(withJSONObject: messages)
    return String(data: data, encoding: .utf8)!
  }

  private let sessionStart: [String: Any] = ["v": 1, "kind": "session", "action": "start", "workoutId": "workout-1", "save": true]

  @discardableResult
  private func launch(_ messages: [[String: Any]]?, reachable: Bool = true, undoSec: Int = 120, args: [String] = []) -> XCUIApplication {
    let app = XCUIApplication()
    /* Okno „Cofnij” (5 s w aplikacji) liczy się od stuknięcia, a wolny symulator odpowiada na jedno zapytanie o element nawet 10–30 s (przebieg 39365741191) — więc testy
       dostają okno 120 s (tylko Debug); skrócenie do 5 s sprawdzają testy logiki (ClientModelTests, WatchStoreTests). Bonus: układ ekranu przerwy nie przesuwa się w trakcie testu. */
    app.launchEnvironment["WATCH_FAKE_UNDO_SEC"] = String(undoSec)
    if let m = messages { app.launchEnvironment["WATCH_FAKE_SNAPSHOT_JSON"] = json(m) }
    if !reachable { app.launchEnvironment["WATCH_FAKE_REACHABLE"] = "0" }
    app.launchArguments += args
    app.launch()
    _ = app.wait(for: .runningForeground, timeout: 15) // kAXErrorServerNotFound: migawka drzewa dostępności za wcześnie po starcie
    return app
  }
  @discardableResult
  private func launch(_ snapshot: String, lang: String? = nil, reachable: Bool = true, undoSec: Int = 120, args: [String] = []) -> XCUIApplication {
    launch([object(snapshot) { if let l = lang { $0["lang"] = l } }], reachable: reachable, undoSec: undoSec, args: args)
  }

  private func el(_ app: XCUIApplication, _ id: String) -> XCUIElement { app.descendants(matching: .any).matching(identifier: id).firstMatch }
  private func appears(_ app: XCUIApplication, _ id: String, timeout: TimeInterval = 10, file: StaticString = #filePath, line: UInt = #line) {
    XCTAssertTrue(el(app, id).waitForExistence(timeout: timeout), "brak elementu \(id)", file: file, line: line)
  }
  private func gone(_ app: XCUIApplication, _ id: String, timeout: TimeInterval = 5, file: StaticString = #filePath, line: UInt = #line) {
    let e = expectation(for: NSPredicate(format: "exists == false"), evaluatedWith: el(app, id))
    XCTAssertEqual(XCTWaiter().wait(for: [e], timeout: timeout), .completed, "element \(id) nie zniknął", file: file, line: line)
  }
  private func pending(_ app: XCUIApplication) -> String { el(app, "watch.debug.pending").label }
  /// Licznik zdarzeń czekających na telefon (element tylko w konfiguracji Debug) — potwierdzenia przychodzą asynchronicznie.
  private func waitPending(_ app: XCUIApplication, _ want: String, timeout: TimeInterval = 5, file: StaticString = #filePath, line: UInt = #line) {
    let deadline = Date().addingTimeInterval(timeout)
    while Date() < deadline { if pending(app) == want { return }; usleep(200_000) }
    XCTAssertEqual(pending(app), want, file: file, line: line)
  }

  // MARK: - Stany bez treningu

  /// Prawdziwy transport na symulatorze bez sparowanego telefonu: brak osiągalności i brak migawki → „Połącz z telefonem” (model referencyjny: idle tylko przy połączeniu).
  func testNoPhoneAndNoWorkoutAsksToConnect() { let app = launch(nil); appears(app, "watch.connect") }
  func testIdleSnapshot() { let app = launch("idle"); appears(app, "watch.idle") }
  func testDoneSnapshotShowsNothingLeft() { let app = launch("done"); appears(app, "watch.nothing") }
  func testLastSetRestAlreadyElapsedShowsNothingLeft() { let app = launch("last-rest"); appears(app, "watch.nothing") }

  func testFinishedAfterTheWorkoutEndsOnThePhone() {
    let app = launch([object("set-first"), object("idle") { $0["rev"] = 9 }])
    appears(app, "watch.finished")
  }

  func testFutureProtocolVersionAsksForUpdate() {
    let app = launch([["v": 2, "kind": "snapshot", "nowe": true]])
    appears(app, "watch.update")
  }

  // MARK: - Seria

  func testSetShowsExerciseCounterAndLoad() {
    let app = launch("set-first")
    appears(app, "watch.title")
    XCTAssertEqual(el(app, "watch.title").label, "Bench Press (sztanga)")
    XCTAssertEqual(el(app, "watch.counter").label, "seria 1 z 3")
    XCTAssertEqual(el(app, "watch.load").label, "80 kg × 8")
    XCTAssertTrue(el(app, "watch.primary").isEnabled)
    XCTAssertEqual(el(app, "watch.primary").label, "Seria zrobiona")
    XCTAssertTrue(el(app, "watch.skip").exists)
    XCTAssertTrue(el(app, "watch.differ").exists)
  }

  /// M3 ZM-05 (docs/32 wz. 24): w trakcie pomiaru serii na czas (migawka `now.measuring`) przycisk główny to „Zakończ serię”; bez pomiaru — „Seria zrobiona”.
  func testPrimaryButtonSaysFinishSetWhileMeasuring() {
    let app = launch("timed-set-measuring")
    appears(app, "watch.primary")
    XCTAssertEqual(el(app, "watch.primary").label, "Zakończ serię")
    XCTAssertTrue(el(app, "watch.primary").isEnabled)
  }

  /// Język z migawki, nie z systemu: etykieta pomiaru z tabeli (pełną pętlę 35 języków robi XCTest WatchLabelsTests — tu jeden inny język, żeby nie wydłużać wolnego symulatora).
  func testFinishSetLabelFollowsSnapshotLanguage() throws {
    let labels = try JSONSerialization.jsonObject(with: fixture("labels.json", apple: true)) as! [String: [String: String]]
    let app = launch("timed-set-measuring", lang: "de")
    appears(app, "watch.primary")
    XCTAssertEqual(el(app, "watch.primary").label, labels["de"]!["finish"])
  }

  func testPrimaryButtonSaysSetDoneForTimedSetWithoutMeasurement() {
    let app = launch("timed-set")
    appears(app, "watch.primary")
    XCTAssertEqual(el(app, "watch.primary").label, "Seria zrobiona")
  }

  func testPausedBadge() { let app = launch("paused"); appears(app, "watch.paused") }

  func testSupersetGroupLabelIsShown() {
    let app = launch([object("set-first") { o in var n = o["now"] as! [String: Any]; n["group"] = "SS A"; o["now"] = n }])
    appears(app, "watch.group")
    XCTAssertEqual(el(app, "watch.group").label, "SS A")
  }

  func testLongGermanTextIsReachableAndTranslated() {
    let long = "Beidarmiges Schulterdrücken mit Kurzhanteln im Sitzen"
    let app = launch([object("set-first") { o in o["lang"] = "de"; var n = o["now"] as! [String: Any]; n["title"] = long; o["now"] = n }])
    appears(app, "watch.title")
    XCTAssertTrue(el(app, "watch.title").label.hasPrefix("Beidarmiges"))
    XCTAssertEqual(el(app, "watch.primary").label, "Satz erledigt")
  }

  // MARK: - Zrobione, przerwa, cofnij

  func testDoneStartsRestWithAnnouncementAndUndo() {
    let app = launch("set-first")
    appears(app, "watch.primary"); el(app, "watch.primary").tap()
    appears(app, "watch.timer")
    appears(app, "watch.cue")
    XCTAssertTrue(el(app, "watch.cue").label.contains("seria 2"), "zapowiedź to tekst z telefonu")
    appears(app, "watch.undo")
    XCTAssertTrue(el(app, "watch.primary").exists, "w przerwie przycisk główny odhacza następną serię")
  }

  func testUndoReturnsToTheSet() {
    let app = launch("set-first")
    appears(app, "watch.primary"); el(app, "watch.primary").tap()
    appears(app, "watch.undo"); el(app, "watch.undo").tap()
    appears(app, "watch.title")
    gone(app, "watch.timer")
    XCTAssertEqual(el(app, "watch.counter").label, "seria 1 z 3")
  }

  func testUndoDisappearsAfterWindow() {
    let app = launch("set-first", undoSec: 35) // okno „Cofnij” skrócone do 35 s (zapas na wolny symulator), przerwa trwa 90 s
    appears(app, "watch.primary"); el(app, "watch.primary").tap()
    appears(app, "watch.undo")
    gone(app, "watch.undo", timeout: 60)
    XCTAssertTrue(el(app, "watch.timer").exists)
  }

  func testPrimaryInRestTicksNextSetAndThenAsksToConnect() {
    let app = launch("set-first")
    appears(app, "watch.primary"); el(app, "watch.primary").tap()
    appears(app, "watch.timer")
    sleep(1) // ponad okno podwójnego kliknięcia (400 ms)
    el(app, "watch.primary").tap()
    appears(app, "watch.connect") // znane są tylko dwie serie z migawki (set-first + after)
  }

  func testDifferStartsRestToo() {
    let app = launch("set-first")
    appears(app, "watch.differ"); el(app, "watch.differ").tap()
    appears(app, "watch.timer")
  }

  func testLastSetShowsNothingLeftAndNoPrimary() {
    // ostatnia seria: after.now = nil → po „zrobione” przerwa z komunikatem „zakończ trening na telefonie” (raz)
    let app = launch([object("set-first") { o in var a = o["after"] as! [String: Any]; a["now"] = NSNull(); a["last"] = true; o["after"] = a }])
    appears(app, "watch.primary"); el(app, "watch.primary").tap()
    appears(app, "watch.timer")
    appears(app, "watch.nothing")
    gone(app, "watch.cue")   // 23.10.2026: zapowiedź ostatniej przerwy nie dubluje komunikatu „zakończ na telefonie”
    gone(app, "watch.primary")
  }

  // MARK: - Pomiń

  func testSkipAsksForConfirmationAndCancelGoesBack() {
    let app = launch("set-first")
    appears(app, "watch.skip"); el(app, "watch.skip").tap()
    appears(app, "watch.confirm.title")
    el(app, "watch.confirm.cancel").tap()
    appears(app, "watch.title")
    waitPending(app, "pending 0")
  }

  func testSkipConfirmedSendsEventAndKeepsScreenUntilPhoneAnswers() {
    let app = launch("set-first")
    appears(app, "watch.skip"); el(app, "watch.skip").tap()
    appears(app, "watch.confirm.skip"); el(app, "watch.confirm.skip").tap()
    appears(app, "watch.title")
    waitPending(app, "pending 0") // fałszywy telefon potwierdził zdarzenie „pomiń”
  }

  // MARK: - Brak połączenia, sesja treningu

  func testOfflineShowsBadgeAndQueuesEvents() {
    let app = launch("set-first", reachable: false)
    appears(app, "watch.offline")
    waitPending(app, "pending 0")
    el(app, "watch.primary").tap()
    appears(app, "watch.timer") // bez połączenia zegarek sam przechodzi do przerwy
    waitPending(app, "pending 1") // zdarzenie czeka na telefon
  }

  func testOfflineAfterTwoDonesAsksToConnect() {
    let app = launch("set-first", reachable: false)
    appears(app, "watch.primary"); el(app, "watch.primary").tap()
    appears(app, "watch.timer"); sleep(1); el(app, "watch.primary").tap()
    appears(app, "watch.connect")
    gone(app, "watch.primary")
  }

  func testSessionIndicatorAppearsWhenPhoneStartsTheSession() {
    let app = launch([object("set-first"), sessionStart])
    appears(app, "watch.session") // wskaźnik trwającej sesji treningu (wymóg Apple)
  }

  // MARK: - Dostępność i języki

  func testControlsHaveAccessibilityLabels() {
    let app = launch("set-first")
    appears(app, "watch.primary")
    for id in ["watch.primary", "watch.differ", "watch.skip"] { XCTAssertFalse(el(app, id).label.isEmpty, id) }
  }

  func testLargestTextStillShowsPrimaryButton() {
    let app = launch("set-first", args: ["-UIPreferredContentSizeCategoryName", "UICTContentSizeCategoryAccessibilityXXXL"])
    appears(app, "watch.title")
    XCTAssertTrue(el(app, "watch.primary").exists)
  }

  /// Etykiety w każdym z 35 języków aplikacji (język z migawki telefonu), zgodne z tests/fixtures/watch-app/labels.json
  /// (generowane z lib/watchLabels.ts przez tests/watch-apple-i18n.test.ts).
  func testButtonLabelsInEveryLanguage() throws {
    let labels = try JSONSerialization.jsonObject(with: fixture("labels.json", apple: true)) as! [String: [String: String]]
    XCTAssertEqual(labels.count, 35)
    for (lang, l) in labels.sorted(by: { $0.key < $1.key }) {
      let app = launch("set-first", lang: lang)
      appears(app, "watch.primary")
      XCTAssertEqual(el(app, "watch.primary").label, l["done"], "język \(lang)")
      XCTAssertEqual(el(app, "watch.differ").label, l["differ"], "język \(lang)")
      XCTAssertEqual(el(app, "watch.skip").label, l["skip"], "język \(lang)")
      app.terminate()
      sleep(1) // 35 uruchomień z rzędu: daj symulatorowi domknąć poprzedni proces
    }
  }
}
