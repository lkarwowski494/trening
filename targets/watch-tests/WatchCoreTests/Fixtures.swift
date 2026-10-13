import Foundation
import XCTest
@testable import WatchCore

// Pliki „złote” (JSON) leżą w repozytorium: tests/fixtures/watch-app (docelowo watch-fixtures/ z gałęzi protokołu — docs/36, „Dopasowanie do protokołu”).
// Zegarek nie może się rozjechać z protokołem: te same pliki czyta Jest (tests/watch-apple-contract.test.ts) i XCTest. Zmiana protokołu = zmiana plików
// = czerwone testy tu.
enum Fixtures {
  static let dir: URL = {
    var u = URL(fileURLWithPath: #filePath)
    for _ in 0..<4 { u.deleteLastPathComponent() } // Fixtures.swift, WatchCoreTests, watch-tests, targets
    return u.appendingPathComponent("tests/fixtures/watch-app")
  }()

  static func data(_ path: String) -> Data {
    let url = dir.appendingPathComponent(path)
    guard let d = try? Data(contentsOf: url) else { fatalError("Brak pliku złotego: \(url.path)") }
    return d
  }

  static func names(_ sub: String) -> [String] {
    let url = dir.appendingPathComponent(sub)
    let files = (try? FileManager.default.contentsOfDirectory(atPath: url.path)) ?? []
    return files.filter { $0.hasSuffix(".json") }.sorted()
  }

  static func snapshot(_ name: String) -> WatchSnapshot {
    do { return try JSONDecoder().decode(WatchSnapshot.self, from: data("snapshots/\(name).json")) } catch { fatalError("Migawka \(name): \(error)") }
  }
  static func snapshotJSON(_ name: String) -> String { String(data: data("snapshots/\(name).json"), encoding: .utf8)! }

  /// JSON bez wartości null (Swift pomija pola nil, plik złoty ma je jawnie).
  static func normalized(_ data: Data) -> NSObject {
    func strip(_ v: Any) -> Any {
      if let d = v as? [String: Any] { return d.compactMapValues { $0 is NSNull ? nil : strip($0) } }
      if let a = v as? [Any] { return a.map(strip) }
      return v
    }
    let o = try! JSONSerialization.jsonObject(with: data)
    return (strip(o) as AnyObject) as! NSObject
  }

  static func constants() -> (undoSec: Int, offlineDoneMax: Int, protocolVersion: Int) {
    let o = try! JSONSerialization.jsonObject(with: data("constants.json")) as! [String: Any]
    let w = o["WATCH"] as! [String: Any]
    return ((w["UNDO_SEC"] as! NSNumber).intValue, (w["OFFLINE_DONE_MAX"] as! NSNumber).intValue, (o["WATCH_PROTOCOL"] as! NSNumber).intValue)
  }
}

/// Stała chwila używana w plikach złotych (początek scenariuszy: 13.10.2026 10:00:00 czasu lokalnego świata testów).
let T0: Double = 1_791_878_400_000

// MARK: - Scenariusze (wejścia → zdarzenia i widok po każdym kroku)

extension WatchOutgoing: Decodable {
  private enum Key: String, CodingKey { case kind }
  init(from decoder: Decoder) throws {
    let kind = try decoder.container(keyedBy: Key.self).decode(String.self, forKey: .kind)
    switch kind {
    case "hello": self = .hello(try WatchHello(from: decoder))
    case "event": self = .event(try WatchEvent(from: decoder))
    default: throw DecodingError.dataCorrupted(.init(codingPath: decoder.codingPath, debugDescription: "nieznany komunikat do telefonu: \(kind)"))
    }
  }
}

struct ScenarioStep: Decodable {
  var at: Double
  var input: ClientInput
  var out: [WatchOutgoing]
  var view: ClientView
  var note: String?
}

struct Scenario: Decodable {
  var name: String
  var doc: String
  var cfg: ClientConfig
  var steps: [ScenarioStep]
}

extension Fixtures {
  static func scenario(_ file: String) -> Scenario {
    do { return try JSONDecoder().decode(Scenario.self, from: data("scenarios/\(file)")) } catch { fatalError("Scenariusz \(file): \(error)") }
  }
}
