import Foundation

// Model stanu ZEGARKA — port modelu referencyjnego z lib/watch/client.ts (gałąź f020-protokol, docs/35 rozdz. 3): reduktor `clientStep` (wejście z godziną →
// nowy stan i komunikaty do telefonu) i `clientView` (widok do wyświetlenia). Zegarek niczego nie edytuje: wyświetla migawkę i wysyła zdarzenia bezwzględne
// („zrobione według planu”, „zrobione inaczej”, „pomiń” z potwierdzeniem, „cofnij”, koniec przerwy). Bez połączenia sam przechodzi do przerwy po „zrobione”
// (pole `after` migawki), po drugim „zrobione” — „Połącz z telefonem”. Zachowanie sprawdza ScenarioReplayTests na scenariuszach wygenerowanych z TS
// (tests/fixtures/watch-app/scenarios): każdy krok = to samo wyjście i ten sam widok. Czysty Swift (Foundation) — bez UI i bez zegara systemowego.

/// Liczby zegarka w jednym miejscu. Pierwsze dwie są lustrem WATCH.UNDO_SEC i WATCH.OFFLINE_DONE_MAX (lib/watch/protocol.ts) — pilnuje ich constants.json.
enum WatchLimits {
  /// Jak długo po „Seria zrobiona” zegarek pokazuje „Cofnij”.
  static let undoSec = 5
  /// Tyle „zrobione” bez połączenia zegarek przyjmuje (z pola `after`); potem „Połącz z telefonem”.
  static let offlineDoneMax = 2
  /// Platforma (nie protokół): przycisk i gest w tym samym ułamku sekundy liczą się raz — drugie „zrobione” odhaczyłoby następną serię.
  static let debounceMs: Double = 400
  /// Platforma: wibracja „koniec przerwy” tylko, gdy przerwa skończyła się przed chwilą (stara przerwa z odebranej migawki nie wibruje).
  static let restEndGraceMs: Double = 10_000
}

struct ClientConfig: Codable, Equatable {
  var client: WatchClientKind
  var app: String
  var session: Bool
}

struct ClientUndo: Codable, Equatable {
  var setId: String
  var until: Double
}

struct ClientState: Codable, Equatable {
  var cfg: ClientConfig
  var seq: Int
  var connected: Bool
  /// ostatnia migawka z telefonu
  var base: WatchSnapshot?
  /// zdarzenia wysłane i jeszcze niepotwierdzone (`ack`) — zegarek pokazuje ich skutek lokalnie
  var queue: [WatchEvent]
  var undo: ClientUndo?
  var confirmSkip: Bool
  /// po migawce `idle` poprzedzonej treningiem: „Trening zakończony”
  var finished: Bool
  var upgrade: String?
  var restEndedSent: String?
}

func initialClient(_ cfg: ClientConfig) -> ClientState {
  ClientState(cfg: cfg, seq: 0, connected: true, base: nil, queue: [], undo: nil, confirmSkip: false, finished: false, upgrade: nil, restEndedSent: nil)
}

enum ClientButton: String, Codable, Equatable, CaseIterable { case main, differ, skip, confirmSkip, cancelSkip, undo }

enum ClientInput: Equatable {
  case launch                                   // start aplikacji / powrót na ekran: zgłasza się `hello`
  case connection(reachable: Bool)              // zmiana osiągalności telefonu
  case receive(PhoneMessage)
  case press(ClientButton)
  case tick
}

struct TimedInput: Equatable {
  var at: Double
  var input: ClientInput
}

enum ClientScreen: String, Codable, Equatable, CaseIterable { case idle, set, rest, done, connect, update, finished }
enum ClientAction: String, Codable, Equatable, CaseIterable { case done, differ, skip, undo }

struct ClientView: Codable, Equatable {
  var screen: ClientScreen
  var title: String
  var counter: String
  var load: String
  var group: String?
  /// zapowiedź w przerwie (ten sam tekst co głos)
  var cue: String?
  var restEndsAt: Double?
  var restTotalSec: Int?
  var paused: Bool
  var timed: Bool
  var targetSec: Int?
  var doneCount: Int
  var totalCount: Int
  var toFillCount: Int
  /// „Cofnij” widoczne do tej chwili (ms)
  var undoUntil: Double?
  /// okno „Pominąć ćwiczenie?” [Anuluj, Pomiń]
  var confirmSkip: Bool
  /// dostępne akcje; przycisk główny = `done`
  var actions: [ClientAction]
  /// ikona „bez telefonu”
  var offline: Bool
  /// czekamy na potwierdzenie telefonu (widok z projekcji lokalnej)
  var busy: Bool
}

// MARK: - Projekcja niepotwierdzonych zdarzeń na migawce

private struct Local {
  var phase: WatchPhase
  var now: WatchNow?
  var rest: WatchRest?
  var after: WatchAfter?
  var blind: Bool
}

private func isDone(_ e: WatchEvent) -> Bool { e.type == .done || e.type == .differ }

/// Skutek niepotwierdzonych zdarzeń na ostatniej migawce. Zdarzenie już ujęte w migawce (telefon przesunął `now`) nie zmienia widoku — sprawdza `setId`,
/// więc powtórzenie i spóźniony `ack` nie odhaczają kolejnej serii.
private func project(_ base: WatchSnapshot, _ queue: [WatchEvent]) -> (local: Local, pendingDone: Int) {
  var L = Local(phase: base.phase, now: base.now, rest: base.rest, after: base.after, blind: false)
  var stack: [(ev: WatchEvent, before: Local)] = []
  var pendingDone = 0
  for ev in queue {
    if isDone(ev), let evSet = ev.setId {
      guard let now = L.now, now.setId == evSet else { continue }
      stack.append((ev, L)); pendingDone += 1
      guard let a = L.after else { L.blind = true; L.after = nil; continue }
      var rest: WatchRest? = nil
      if let sec = a.restSec, sec > 0 {
        rest = WatchRest(setId: evSet, startedAt: ev.at, endsAt: ev.at + Double(sec) * 1000, totalSec: sec, cue: a.cue, last: a.last)
      }
      let phase: WatchPhase = rest != nil ? .rest : (a.now != nil ? .set : .done)
      L = Local(phase: phase, now: a.now, rest: rest, after: nil, blind: false)
    } else if ev.type == .undo {
      var i = stack.count - 1
      while i >= 0 {
        let s = stack[i]
        if s.ev.setId != nil, s.ev.setId == ev.setId {
          L = s.before
          stack.removeSubrange(i...)
          pendingDone = max(0, pendingDone - 1)
          break
        }
        i -= 1
      }
    } else if ev.type == .skip {
      if let now = L.now, now.blockId == ev.blockId { L.now = nil; L.blind = true; L.after = nil }
    }
  }
  return (L, pendingDone)
}

// MARK: - Widok

/// Widok do wyświetlenia w chwili `nowMs`.
func clientView(_ s: ClientState, nowMs: Double) -> ClientView {
  let blank = ClientView(screen: .idle, title: "", counter: "", load: "", group: nil, cue: nil, restEndsAt: nil, restTotalSec: nil, paused: false, timed: false,
                         targetSec: nil, doneCount: 0, totalCount: 0, toFillCount: 0, undoUntil: nil, confirmSkip: false, actions: [], offline: !s.connected, busy: false)
  func with(_ screen: ClientScreen, _ edit: (inout ClientView) -> Void = { _ in }) -> ClientView {
    var v = blank; v.screen = screen; edit(&v); return v
  }
  if s.upgrade == "watch" { return with(.update) }
  guard let base = s.base else { return with(s.connected ? .idle : .connect) }
  if s.finished { return with(.finished) { $0.title = base.title } }
  if base.phase == .idle { return with(s.connected ? .idle : .connect) }
  let (L, pendingDone) = project(base, s.queue)
  var v = blank
  v.title = base.title; v.paused = base.paused
  v.doneCount = base.doneCount + pendingDone; v.totalCount = base.totalCount; v.toFillCount = base.toFillCount
  if !s.connected && pendingDone >= WatchLimits.offlineDoneMax { v.screen = .connect; return v }
  let rest: WatchRest? = (L.rest != nil && L.rest!.endsAt > nowMs) ? L.rest : nil
  let phase: WatchPhase = rest != nil ? .rest : (L.now != nil ? .set : .done)
  let n = L.now
  let undoUntil: Double? = (s.undo != nil && s.undo!.until > nowMs) ? s.undo!.until : nil
  var actions: [ClientAction] = (n != nil && !L.blind) ? [.done, .differ, .skip] : []
  if undoUntil != nil { actions.append(.undo) }
  switch phase { case .rest: v.screen = .rest; case .set: v.screen = .set; default: v.screen = .done }
  v.title = n?.title ?? base.title
  v.counter = n?.counter ?? ""
  v.load = n?.load ?? ""
  v.group = n?.group
  v.cue = rest?.cue
  v.restEndsAt = rest?.endsAt
  v.restTotalSec = rest?.totalSec
  v.timed = n?.timed ?? false
  v.targetSec = n?.targetSec
  v.undoUntil = undoUntil
  v.confirmSkip = s.confirmSkip && n != nil
  v.actions = actions
  v.busy = !s.queue.isEmpty || L.blind
  return v
}

// MARK: - Reduktor

struct ClientStep: Equatable {
  var state: ClientState
  var out: [WatchOutgoing]
}

/// Reduktor zegarka: wejście (z godziną) → nowy stan i komunikaty do telefonu.
func clientStep(_ s0: ClientState, _ ti: TimedInput) -> ClientStep {
  var s = s0
  var out: [WatchOutgoing] = []
  let at = ti.at

  func hello() -> WatchOutgoing {
    .hello(WatchHello(v: watchProtocolVersion, kind: "hello", client: s.cfg.client, protocolVersion: watchProtocolVersion, app: s.cfg.app, caps: WatchCaps(session: s.cfg.session)))
  }
  func emit(_ type: WatchEventType, _ id: String) {
    var ev = WatchEvent(v: watchProtocolVersion, kind: "event", eventId: "\(s.cfg.client.rawValue)-\(s.seq + 1)", workoutId: s.base?.workoutId ?? "", baseRev: s.base?.rev ?? 0,
                        at: at, client: s.cfg.client, type: type, setId: nil, blockId: nil, saved: nil)
    if type == .skip { ev.blockId = id } else { ev.setId = id }
    s.seq += 1; s.queue.append(ev); out.append(.event(ev))
  }

  let view = clientView(s, nowMs: at)
  switch ti.input {
  case .launch:
    out.append(hello())
  case .connection(let reachable):
    s.connected = reachable
    if reachable { out.append(hello()) }
  case .receive(let msg):
    switch msg {
    case .snapshot(let m):
      let wasWorking = !(s.base?.workoutId ?? "").isEmpty
      let finished = m.phase == .idle && (wasWorking || s.finished)
      /* migawka starsza niż ostatnia w tym samym treningu (spóźniona) — pomijamy */
      if let b = s.base, m.rev < b.rev, m.workoutId == b.workoutId { break }
      s.base = m
      s.finished = finished
      s.confirmSkip = (m.phase == .idle || m.phase == .done) ? false : s.confirmSkip
    case .ack(let m):
      s.queue.removeAll { $0.eventId == m.eventId }
    case .welcome(let m):
      s.upgrade = m.ok ? nil : m.upgrade
    case .session:
      break /* sesją treningu zajmuje się warstwa platformy (WatchStore) */
    }
  case .press(let b):
    let n: WatchNow? = (view.actions.contains(.done) && s.base != nil) ? project(s.base!, s.queue).local.now : nil
    switch b {
    case .main, .differ:
      guard let n = n, view.actions.contains(.done) else { break }
      emit(b == .main ? .done : .differ, n.setId)
      s.undo = ClientUndo(setId: n.setId, until: at + Double(WatchLimits.undoSec) * 1000)
      s.confirmSkip = false
    case .skip:
      if n != nil { s.confirmSkip = true }
    case .cancelSkip:
      s.confirmSkip = false
    case .confirmSkip:
      if let n = n, s.confirmSkip { emit(.skip, n.blockId); s.confirmSkip = false }
    case .undo:
      if let u = s.undo, u.until > at { emit(.undo, u.setId); s.undo = nil }
    }
  case .tick:
    if let u = s.undo, u.until <= at { s.undo = nil }
    let local: Local? = s.base != nil ? project(s.base!, s.queue).local : nil
    if let r = local?.rest, r.endsAt <= at, s.restEndedSent != r.setId {
      emit(.restEnded, r.setId)
      s.restEndedSent = r.setId
    }
  }
  return ClientStep(state: s, out: out)
}

/// Koniec przerwy, którą reduktor uzna za bieżącą (lokalna projekcja niepotwierdzonych zdarzeń na migawce) — warstwa platformy rozstrzyga po nim, czy wibrować.
func clientRestEndsAt(_ s: ClientState) -> Double? {
  guard let b = s.base else { return nil }
  return project(b, s.queue).local.rest?.endsAt
}

// MARK: - Zdarzenia spoza reduktora (sesja treningu)

/// Zdarzenie sesji treningu (`sessionStarted` / `sessionEnded`) — powstaje w warstwie platformy, nie w reduktorze; trafia do tej samej kolejki
/// niepotwierdzonych zdarzeń, więc wraca do telefonu aż do `ack`. `workoutId` z polecenia `session` (migawka może być już „idle”, a telefon odrzuca puste id).
func clientNoteSession(_ s: inout ClientState, type: WatchEventType, workoutId: String, at: Double, saved: Bool? = nil) -> WatchEvent {
  let ev = WatchEvent(v: watchProtocolVersion, kind: "event", eventId: "\(s.cfg.client.rawValue)-\(s.seq + 1)", workoutId: workoutId, baseRev: s.base?.rev ?? 0, at: at,
                      client: s.cfg.client, type: type, setId: nil, blockId: nil, saved: type == .sessionEnded ? (saved ?? false) : nil)
  s.seq += 1; s.queue.append(ev)
  return ev
}

// MARK: - Dekodowanie wejść z plików złotych

extension PhoneMessage: Decodable {
  private enum Key: String, CodingKey { case kind }
  init(from decoder: Decoder) throws {
    let kind = try decoder.container(keyedBy: Key.self).decode(String.self, forKey: .kind)
    switch kind {
    case "snapshot": self = .snapshot(try WatchSnapshot(from: decoder))
    case "ack": self = .ack(try WatchAck(from: decoder))
    case "welcome": self = .welcome(try WatchWelcome(from: decoder))
    case "session": self = .session(try WatchSessionCmd(from: decoder))
    default: throw DecodingError.dataCorrupted(.init(codingPath: decoder.codingPath, debugDescription: "nieznany rodzaj komunikatu: \(kind)"))
    }
  }
}

extension ClientInput: Decodable {
  private enum Key: String, CodingKey { case t, reachable, msg, button }
  init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: Key.self)
    switch try c.decode(String.self, forKey: .t) {
    case "launch": self = .launch
    case "connection": self = .connection(reachable: try c.decode(Bool.self, forKey: .reachable))
    case "receive": self = .receive(try c.decode(PhoneMessage.self, forKey: .msg))
    case "press": self = .press(try c.decode(ClientButton.self, forKey: .button))
    case "tick": self = .tick
    default: throw DecodingError.dataCorrupted(.init(codingPath: decoder.codingPath, debugDescription: "nieznane wejście"))
    }
  }
}
