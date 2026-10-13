import XCTest
@testable import WatchCore

final class WatchProtocolTests: XCTestCase {
  func testAllSnapshotFixturesDecodeAndRoundTrip() throws {
    let names = Fixtures.names("snapshots")
    XCTAssertGreaterThanOrEqual(names.count, 15)
    for n in names {
      let data = Fixtures.data("snapshots/\(n)")
      let snap = try JSONDecoder().decode(WatchSnapshot.self, from: data)
      XCTAssertEqual(snap.v, watchProtocolVersion, n)
      XCTAssertEqual(snap.kind, "snapshot", n)
      XCTAssertEqual(Fixtures.normalized(try JSONEncoder().encode(snap)), Fixtures.normalized(data), n)
      XCTAssertEqual(WatchCodec.decodePhone(data), .snapshot(snap), n)
    }
  }

  func testEveryPhaseHasAFixture() {
    var phases = Set<String>()
    for n in Fixtures.names("snapshots") { phases.insert(Fixtures.snapshot(String(n.dropLast(5))).phase.rawValue) }
    XCTAssertEqual(phases, Set(["idle", "set", "rest", "done"]))
  }

  /// Poprawne komunikaty z telefonu (ack, welcome, session, migawka) dekodują się; zegarek ich nie odrzuca.
  func testValidPhoneMessagesDecode() {
    for (file, kind) in [("ack-applied", "ack"), ("ack-rejected", "ack"), ("welcome-ok", "welcome"), ("welcome-update-phone", "welcome"), ("welcome-update-watch", "welcome"), ("session-start", "session"), ("session-end", "session")] {
      guard let m = WatchCodec.decodePhone(Fixtures.data("messages/valid/\(file).json")) else { return XCTFail("\(file) nie dekoduje się") }
      switch (m, kind) {
      case (.ack, "ack"), (.welcome, "welcome"), (.session, "session"): break
      default: XCTFail("\(file): zły rodzaj")
      }
    }
  }

  /// Komunikaty zegarka (hello, zdarzenia) kodujemy tak samo jak w plikach wzorcowych — telefon je przyjmie (parseWatchMessage).
  func testWatchMessagesEncodeLikeTheValidFixtures() throws {
    var checked = 0
    for n in Fixtures.names("messages/valid") where n.hasPrefix("hello-") || n.hasPrefix("event-") {
      let data = Fixtures.data("messages/valid/\(n)")
      let m = try JSONDecoder().decode(WatchOutgoing.self, from: data)
      XCTAssertEqual(Fixtures.normalized(Data(WatchCodec.encode(m).utf8)), Fixtures.normalized(data), n)
      checked += 1
    }
    XCTAssertEqual(checked, 2 + 7)   // 2 × hello, 7 typów zdarzeń
  }

  func testEveryMessageInScenariosRoundTrips() throws {
    var kinds = Set<String>()
    for file in Fixtures.names("scenarios") {
      let sc = Fixtures.scenario(file)
      for step in sc.steps {
        for o in step.expect.out {
          let json = WatchCodec.encode(o)
          let back = try JSONDecoder().decode(WatchOutgoing.self, from: Data(json.utf8))
          XCTAssertEqual(back, o, sc.name)
          switch o { case .hello: kinds.insert("hello"); case .event(let e): kinds.insert("event:" + e.type.rawValue) }
        }
        if case .receive(let m) = step.input {
          switch m { case .snapshot: kinds.insert("snapshot"); case .ack: kinds.insert("ack"); case .welcome: kinds.insert("welcome"); case .session: kinds.insert("session") }
        }
      }
    }
    for k in ["hello", "event:done", "event:differ", "event:skip", "event:undo", "event:restEnded", "snapshot", "ack", "welcome"] { XCTAssertTrue(kinds.contains(k), "scenariusze nie obejmują \(k)") }
  }

  func testHelloUsesProtocolKeyAndCapabilities() {
    let h = WatchHello(v: 1, kind: "hello", client: .apple, protocolVersion: 1, app: "0.20.0", caps: WatchCaps(session: true))
    let json = WatchCodec.encode(.hello(h))
    XCTAssertTrue(json.contains("\"protocol\":1"))
    XCTAssertTrue(json.contains("\"caps\":{\"session\":true}"))
    XCTAssertTrue(json.contains("\"client\":\"apple\""))
  }

  func testPhoneMessagesFromWire() {
    XCTAssertEqual(WatchCodec.decodePhone(json: "{\"v\":1,\"kind\":\"welcome\",\"ok\":false,\"protocol\":2,\"upgrade\":\"watch\"}"),
                   .welcome(WatchWelcome(v: 1, kind: "welcome", ok: false, protocolVersion: 2, upgrade: "watch")))
    XCTAssertEqual(WatchCodec.decodePhone(json: "{\"v\":1,\"kind\":\"ack\",\"eventId\":\"apple-1\",\"status\":\"duplicate\",\"reason\":null,\"rev\":4}"),
                   .ack(WatchAck(v: 1, kind: "ack", eventId: "apple-1", status: "duplicate", reason: nil, rev: 4)))
    XCTAssertEqual(WatchCodec.decodePhone(json: "{\"v\":1,\"kind\":\"session\",\"action\":\"start\",\"workoutId\":\"w\",\"save\":true}"),
                   .session(WatchSessionCmd(v: 1, kind: "session", action: .start, workoutId: "w", save: true)))
  }

  func testUnknownBrokenOrFutureMessagesAreRejected() {
    XCTAssertNil(WatchCodec.decodePhone(json: "nie json"))
    XCTAssertNil(WatchCodec.decodePhone(json: "{\"v\":1,\"kind\":\"cos\"}"))
    XCTAssertNil(WatchCodec.decodePhone(json: "{\"v\":1,\"kind\":\"snapshot\"}"))         // brak wymaganych pól
    XCTAssertNil(WatchCodec.decodePhone(json: "{\"v\":2,\"kind\":\"welcome\",\"ok\":true,\"protocol\":2,\"upgrade\":null}"))
    XCTAssertEqual(WatchCodec.probeVersion(Data("{\"v\":2,\"kind\":\"snapshot\"}".utf8)), 2)
    XCTAssertNil(WatchCodec.probeVersion(Data("[]".utf8)))
  }

  func testLimitsAndEnumsMirrorTheProtocolFile() {
    let p = Fixtures.protocolInfo()
    XCTAssertEqual(WatchLimits.undoSec, p.undoSec)
    XCTAssertEqual(WatchLimits.offlineDoneMax, p.offlineDoneMax)
    XCTAssertEqual(watchProtocolVersion, p.version)
    func names<T: RawRepresentable & CaseIterable>(_ t: T.Type) -> Set<String> where T.RawValue == String { Set(t.allCases.map { $0.rawValue }) }
    func list(_ k: String) -> Set<String> { Set(p.json[k] as! [String]) }
    XCTAssertEqual(names(WatchPhase.self), list("phases"))
    XCTAssertEqual(names(WatchEventType.self), list("eventTypes"))
    XCTAssertEqual(names(WatchClientKind.self), list("clients"))
    XCTAssertEqual(names(WatchSessionAction.self), list("sessionActions"))
    XCTAssertEqual(names(ClientScreen.self), list("clientScreens"))
    XCTAssertEqual(names(ClientAction.self), list("clientActions"))
    XCTAssertEqual(names(WatchLabelKey.self).subtracting(["workoutOn"]), list("labelIds"))   // workoutOn: tylko Apple Watch
  }

  func testWireKeysAreStable() {
    XCTAssertEqual(WatchWire.message, "msg")
    XCTAssertEqual(WatchWire.received, "received")
  }
}
