import Foundation

// Protokół telefon <-> zegarek, strona Apple Watch (0.20 „Zegarki i głos”, docs/35-zegarek-apple). Lustro typów z lib/watch/protocol.ts (gałąź f020-protokol,
// docs/35): jedna wersjonowana postać komunikatów dla obu zegarków. Telefon = mózg (stan, teksty, decyzje), zegarek = wyświetlacz z kilkoma przyciskami;
// wszystkie teksty dynamiczne przychodzą GOTOWE, w języku aplikacji. Kształt JSON sprawdzają pliki „złote” (tests/fixtures/watch-app → docelowo
// watch-fixtures/) — czytają je Jest i XCTest; zmiana protokołu = zmiana plików = czerwone testy po obu stronach.
// Plik jest kompilowany i w celu watchOS, i w pakiecie testów (targets/Package.swift) — tylko Foundation.

/// Wersja protokołu, którą rozumie ta wersja zegarka (WATCH_PROTOCOL w lib/watch/protocol.ts).
let watchProtocolVersion = 1

enum WatchClientKind: String, Codable, Equatable, CaseIterable { case apple, garmin }
enum WatchPhase: String, Codable, Equatable, CaseIterable { case idle, set, rest, done }

/// Bieżąca seria do wyświetlenia (teksty gotowe).
struct WatchNow: Codable, Equatable {
  var setId: String
  var blockId: String       // adresat „pomiń”
  var title: String
  var counter: String       // „seria 2 z 4”
  var load: String          // „80 kg × 8”, „masa ciała × 12”, „45 s”
  var group: String?        // „SS A”
  var timed: Bool
  var targetSec: Int?
  var measuring: Bool?      // M3 (ZM-05): telefon mierzy tę serię na czas → przycisk główny „Zakończ serię”; pole bywa nieobecne (starszy telefon)
}

/// Przerwa w toku; `cue` = ten sam tekst co głos w słuchawkach.
struct WatchRest: Codable, Equatable {
  var setId: String         // seria, która uruchomiła przerwę
  var startedAt: Double     // ms od 1970
  var endsAt: Double
  var totalSec: Int
  var cue: String
  var last: Bool
}

/// Co zobaczy zegarek po „Seria zrobiona” na bieżącej serii — policzone z góry przez telefon (zegarek działa bez telefonu).
struct WatchAfter: Codable, Equatable {
  var restSec: Int?
  var cue: String
  var last: Bool
  var now: WatchNow?
}

struct WatchSnapshot: Codable, Equatable {
  var v: Int
  var kind: String
  var rev: Int
  var lang: String
  var phase: WatchPhase
  var paused: Bool
  var workoutId: String?
  var title: String
  var now: WatchNow?
  var rest: WatchRest?
  var after: WatchAfter?
  var doneCount: Int
  var totalCount: Int
  var toFillCount: Int
}

enum WatchEventType: String, Codable, Equatable, CaseIterable { case done, differ, skip, undo, restEnded, sessionStarted, sessionEnded }

/// Zdarzenie zegarek -> telefon. Bezwzględne (nie przełączniki); telefon pomija powtórzone `eventId`.
struct WatchEvent: Codable, Equatable {
  var v: Int
  var kind: String          // „event”
  var eventId: String
  var workoutId: String
  var baseRev: Int
  var at: Double
  var client: WatchClientKind
  var type: WatchEventType
  var setId: String?
  var blockId: String?
  var saved: Bool?          // sessionEnded
}

struct WatchCaps: Codable, Equatable { var session: Bool }
struct WatchHello: Codable, Equatable {
  var v: Int
  var kind: String          // „hello”
  var client: WatchClientKind
  var protocolVersion: Int
  var app: String
  var caps: WatchCaps
  enum CodingKeys: String, CodingKey { case v, kind, client, protocolVersion = "protocol", app, caps }
}

struct WatchWelcome: Codable, Equatable {
  var v: Int
  var kind: String
  var ok: Bool
  var protocolVersion: Int
  var upgrade: String?      // „watch” | „phone”
  enum CodingKeys: String, CodingKey { case v, kind, ok, protocolVersion = "protocol", upgrade }
}

struct WatchAck: Codable, Equatable {
  var v: Int
  var kind: String
  var eventId: String
  var status: String        // applied | duplicate | ignored | rejected
  var reason: String?
  var rev: Int
}

enum WatchSessionAction: String, Codable, Equatable, CaseIterable { case start, end }
/// Sesja treningu zegarka (Zdrowie): `save` = telefon ma włączony zapis do Zdrowia, więc zegarek MA zapisać trening; false = sesja tylko jako środek techniczny.
struct WatchSessionCmd: Codable, Equatable {
  var v: Int
  var kind: String
  var action: WatchSessionAction
  var workoutId: String
  var save: Bool
}

/// Komunikat telefon -> zegarek.
enum PhoneMessage: Equatable {
  case snapshot(WatchSnapshot)
  case ack(WatchAck)
  case welcome(WatchWelcome)
  case session(WatchSessionCmd)
}

/// Komunikat zegarek -> telefon, który model zegarka wysyła sam (reszta — zdarzenia sesji — powstaje w warstwie platformy).
enum WatchOutgoing: Equatable {
  case hello(WatchHello)
  case event(WatchEvent)
}

enum WatchCodec {
  private static func probe(_ data: Data) -> (kind: String, v: Int)? {
    guard let o = try? JSONSerialization.jsonObject(with: data) as? [String: Any], let k = o["kind"] as? String else { return nil }
    return (k, (o["v"] as? NSNumber)?.intValue ?? 0)
  }

  /// Wersja komunikatu (pole `v`) — pozwala rozpoznać komunikat z przyszłości, którego pozostałe pola mogą już nie pasować.
  static func probeVersion(_ data: Data) -> Int? { probe(data)?.v }

  /// Komunikat z telefonu; nil dla nieczytelnego, nieznanego rodzaju albo niezgodnej wersji.
  static func decodePhone(_ data: Data) -> PhoneMessage? {
    guard let p = probe(data), p.v == watchProtocolVersion else { return nil }
    let d = JSONDecoder()
    switch p.kind {
    case "snapshot": return (try? d.decode(WatchSnapshot.self, from: data)).map(PhoneMessage.snapshot)
    case "ack": return (try? d.decode(WatchAck.self, from: data)).map(PhoneMessage.ack)
    case "welcome": return (try? d.decode(WatchWelcome.self, from: data)).map(PhoneMessage.welcome)
    case "session": return (try? d.decode(WatchSessionCmd.self, from: data)).map(PhoneMessage.session)
    default: return nil
    }
  }
  static func decodePhone(json: String) -> PhoneMessage? { decodePhone(Data(json.utf8)) }

  private static func encoder() -> JSONEncoder { let e = JSONEncoder(); e.outputFormatting = [.sortedKeys]; return e }
  static func encode(_ m: WatchOutgoing) -> String {
    let data: Data?
    switch m {
    case .hello(let h): data = try? encoder().encode(h)
    case .event(let e): data = try? encoder().encode(e)
    }
    return data.flatMap { String(data: $0, encoding: .utf8) } ?? "{}"
  }
  static func encode(_ e: WatchEvent) -> String { encode(.event(e)) }
  static func decodeEvent(json: String) -> WatchEvent? { try? JSONDecoder().decode(WatchEvent.self, from: Data(json.utf8)) }
}

/// Klucze słownika WatchConnectivity (wartość to ciąg JSON całego komunikatu — bez typów, które plist odrzuca).
enum WatchWire {
  static let message = "msg"
  /// Odpowiedź na poziomie transportu: odbiorca zapisał komunikat w trwałej kolejce (to NIE jest `ack` protokołu).
  static let received = "received"
}
