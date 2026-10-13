import XCTest
@testable import WatchCore

final class WatchProtocolTests: XCTestCase {
  func testAllSnapshotFixturesDecodeAndRoundTrip() throws {
    let names = Fixtures.names("snapshots")
    XCTAssertGreaterThanOrEqual(names.count, 10)
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

  func testEveryMessageInScenariosRoundTrips() throws {
    var kinds = Set<String>()
    for file in Fixtures.names("scenarios") {
      let sc = Fixtures.scenario(file)
      for step in sc.steps {
        for o in step.out {
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

  func testLimitsMirrorTheProtocolConstants() {
    let c = Fixtures.constants()
    XCTAssertEqual(WatchLimits.undoSec, c.undoSec)
    XCTAssertEqual(WatchLimits.offlineDoneMax, c.offlineDoneMax)
    XCTAssertEqual(watchProtocolVersion, c.protocolVersion)
  }

  func testWireKeysAreStable() {
    XCTAssertEqual(WatchWire.message, "msg")
    XCTAssertEqual(WatchWire.received, "received")
  }
}
