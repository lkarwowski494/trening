import Foundation
import XCTest
@testable import WatchCore

// Pliki „złote” (JSON) leżą w repozytorium: tests/fixtures/watch-app (docelowo watch-fixtures/ z gałęzi protokołu — docs/35-zegarek-apple, „Dopasowanie do protokołu”).
// Zegarek nie może się rozjechać z protokołem: te same pliki czyta Jest (tests/watch-apple-contract.test.ts) i XCTest. Zmiana protokołu = zmiana plików
// = czerwone testy tu.
enum Fixtures {
  /// Korzeń repozytorium (cztery składniki od ścieżki tego pliku: Fixtures.swift, WatchCoreTests, watch-tests, targets).
  static let root: URL = {
    var u = URL(fileURLWithPath: #filePath)
    for _ in 0..<4 { u.deleteLastPathComponent() }
    return u
  }()
  /// Pliki wzorcowe PROTOKOŁU (generowane z kodu telefonu przez tests/watch-fixtures.test.ts, docs/35).
  static let dir = root.appendingPathComponent("watch-fixtures")
  /// Pliki wygenerowane dla Apple Watch (etykiety w 35 językach, tagi języka) — tests/watch-apple-i18n.test.ts.
  static let appleDir = root.appendingPathComponent("tests/fixtures/watch-app")

  static func data(_ path: String, in base: URL? = nil) -> Data {
    let url = (base ?? dir).appendingPathComponent(path)
    guard let d = try? Data(contentsOf: url) else { fatalError("Brak pliku wzorcowego: \(url.path)") }
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

  /// JSON bez wartości null (Swift pomija pola nil, plik wzorcowy ma je jawnie).
  static func normalized(_ data: Data) -> NSObject {
    func strip(_ v: Any) -> Any {
      if let d = v as? [String: Any] { return d.compactMapValues { $0 is NSNull ? nil : strip($0) } }
      if let a = v as? [Any] { return a.map(strip) }
      return v
    }
    let o = try! JSONSerialization.jsonObject(with: data)
    return (strip(o) as AnyObject) as! NSObject
  }

  /// protocol.json: wersja protokołu i stałe (WATCH w lib/watch/protocol.ts).
  static func protocolInfo() -> (version: Int, undoSec: Int, offlineDoneMax: Int, json: [String: Any]) {
    let o = try! JSONSerialization.jsonObject(with: data("protocol.json")) as! [String: Any]
    let c = o["constants"] as! [String: Any]
    return ((o["protocol"] as! NSNumber).intValue, (c["UNDO_SEC"] as! NSNumber).intValue, (c["OFFLINE_DONE_MAX"] as! NSNumber).intValue, o)
  }
}

/// Początek scenariuszy w plikach wzorcowych (13.10.2026 10:00:00 UTC, ms) — świat testów protokołu ma zegar zamrożony na tej chwili.
let T0: Double = 1_791_885_600_000

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

struct ScenarioExpect: Decodable {
  var out: [WatchOutgoing]
  var view: ClientView
}

struct ScenarioStep: Decodable {
  var at: Double
  var input: ClientInput
  var note: String?
  var expect: ScenarioExpect
}

struct Scenario: Decodable {
  var name: String
  var doc: String
  var config: ClientConfig
  var steps: [ScenarioStep]
}

extension Fixtures {
  static func scenario(_ file: String) -> Scenario {
    do { return try JSONDecoder().decode(Scenario.self, from: data("scenarios/\(file)")) } catch { fatalError("Scenariusz \(file): \(error)") }
  }
}
