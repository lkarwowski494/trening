import {
  WATCH, WATCH_PROTOCOL, type PhoneToWatch, type WatchAfter, type WatchClient, type WatchEvent, type WatchNow, type WatchPhase, type WatchRest, type WatchSnapshot, type WatchToPhone,
} from './protocol';

/*
 * Model stanu ZEGARKA — wzorzec referencyjny dla klientów Apple Watch (SwiftUI) i zegarka z Connect IQ (Monkey C), które są cienkie i mają dokładnie to zachowanie
 * (docs/35 rozdz. 3). Czysty TypeScript: Jest sprawdza model na Linuksie, a `watch-fixtures/scenarios/*.json` (wygenerowane z niego) odtwarzają testy Swift
 * (`swift test`) i Monkey C — wejścia → zdarzenia do wysłania i widok do wyświetlenia. Zegarek niczego nie edytuje: tylko wyświetla migawkę i wysyła
 * zdarzenia bezwzględne (zrobione według planu, zrobione inaczej, pomiń z potwierdzeniem, cofnij, koniec przerwy).
 *
 * Bez połączenia zegarek sam przechodzi do przerwy po „Seria zrobiona” (pole `after` migawki: długość przerwy, zapowiedź i następna seria policzone przez telefon);
 * drugie „zrobione” (przycisk główny w przerwie odhacza następną serię) też ma swoją serię w `after.now`; potem — „Połącz z telefonem” i dalej nic nie przyjmuje
 * (nie zgadujemy serii, których zegarek nie zna).
 */

export interface ClientConfig { client: WatchClient; app: string; session: boolean }

export type ClientInput =
  | { t: 'launch' }                                   // start aplikacji / powrót na ekran: zgłasza się `hello`
  | { t: 'connection'; reachable: boolean }           // zmiana osiągalności telefonu
  | { t: 'receive'; msg: PhoneToWatch }
  | { t: 'press'; button: 'main' | 'differ' | 'skip' | 'confirmSkip' | 'cancelSkip' | 'undo' }
  | { t: 'tick' };
/** Wejście z godziną (ms) zegarka. */
export interface TimedInput { at: number; input: ClientInput }

export interface QueuedEvent { ev: WatchEvent; ackRev: number | null }
export interface ClientState {
  cfg: ClientConfig; seq: number; connected: boolean;
  /** ostatnia migawka z telefonu */
  base: WatchSnapshot | null;
  /** zdarzenia wysłane i jeszcze nieuwzględnione w migawce telefonu — zegarek pokazuje ich skutek lokalnie. `ackRev` = numer migawki z potwierdzenia: wpis znika dopiero, gdy
   * przyjdzie migawka o tym numerze (albo nowsza) — bez migotania widoku między potwierdzeniem a migawką; potwierdzenie przed migawką jest normalne (telefon wysyła migawkę, potem ack). */
  queue: QueuedEvent[];
  /** ostatnie migawki (najstarsza pierwsza) — z nich zegarek odtwarza widok po „Cofnij” zdarzenia, które telefon już uwzględnił */
  history: WatchSnapshot[];
  undo: { setId: string; until: number } | null;
  confirmSkip: boolean;
  /** po migawce `idle` poprzedzonej treningiem: „Trening zakończony” */
  finished: boolean;
  upgrade: 'watch' | 'phone' | null;
  restEndedSent: string | null;
}
export const initialClient = (cfg: ClientConfig): ClientState => ({ cfg, seq: 0, connected: true, base: null, queue: [], history: [], undo: null, confirmSkip: false, finished: false, upgrade: null, restEndedSent: null });

export const CLIENT_SCREENS = ['idle', 'set', 'rest', 'done', 'connect', 'update', 'finished'] as const;
export type ClientScreen = typeof CLIENT_SCREENS[number];
export const CLIENT_ACTIONS = ['done', 'differ', 'skip', 'undo'] as const;
export type ClientAction = typeof CLIENT_ACTIONS[number];
export interface ClientView {
  screen: ClientScreen;
  title: string; counter: string; load: string; group: string | null;
  /** zapowiedź w przerwie (ten sam tekst co głos) */
  cue: string | null;
  restEndsAt: number | null; restTotalSec: number | null;
  paused: boolean; timed: boolean; targetSec: number | null;
  /** telefon mierzy tę serię na czas: przycisk główny = „Zakończ serię” (M3 ZM-05) */
  measuring: boolean;
  doneCount: number; totalCount: number; toFillCount: number;
  /** „Cofnij” widoczne do tej chwili (ms) albo null */
  undoUntil: number | null;
  /** okno „Pominąć ćwiczenie?” [Anuluj, Pomiń] */
  confirmSkip: boolean;
  /** dostępne akcje; przycisk główny = `done` */
  actions: ClientAction[];
  /** ikona „bez telefonu” */
  offline: boolean;
  /** czekamy na potwierdzenie telefonu (widok z projekcji lokalnej) */
  busy: boolean;
}

interface Local { phase: WatchPhase; now: WatchNow | null; rest: WatchRest | null; after: WatchAfter | null; blind: boolean }
const localOf = (s: WatchSnapshot): Local => ({ phase: s.phase, now: s.now, rest: s.rest, after: s.after, blind: false });
const isDone = (e: WatchEvent) => e.type === 'done' || e.type === 'differ';

/** Skutek zdarzeń czekających na migawkę (powtórzenie zdarzenia już ujętego w migawce nie zmienia widoku — sprawdza `setId`). */
function project(base: WatchSnapshot, queue: QueuedEvent[], history: WatchSnapshot[]): { local: Local; pendingDone: number } {
  let L = localOf(base); const stack: { ev: WatchEvent; before: Local }[] = []; let pendingDone = 0;
  for (const { ev } of queue) {
    if (isDone(ev) && 'setId' in ev) {
      if (!L.now || L.now.setId !== ev.setId) continue;
      stack.push({ ev, before: L }); pendingDone++;
      const a = L.after;
      if (!a) { L = { ...L, blind: true, after: null }; continue; }
      const rest: WatchRest | null = a.restSec ? { setId: ev.setId, startedAt: ev.at, endsAt: ev.at + a.restSec * 1000, totalSec: a.restSec, cue: a.cue, last: a.last } : null;
      L = { phase: rest ? 'rest' : a.now ? 'set' : 'done', now: a.now, rest, after: null, blind: false };
    } else if (ev.type === 'undo') {
      const i = stack.map(x => 'setId' in x.ev && x.ev.setId === ev.setId).lastIndexOf(true);
      if (i >= 0) { L = stack[i].before; stack.length = i; pendingDone = Math.max(0, pendingDone - 1); continue; }
      /* telefon już uwzględnił odhaczenie (migawka z przerwą po nim): wracamy do ostatniej migawki, w której ta seria była bieżąca; przerwa po cofniętej serii znika */
      const prev = [...history].reverse().find(h => h.now?.setId === ev.setId);
      if (prev && !(L.now && L.now.setId === ev.setId)) L = { ...localOf(prev), phase: 'set', rest: null };
    } else if (ev.type === 'skip') {
      if (L.now && L.now.blockId === ev.blockId) L = { ...L, now: null, blind: true, after: null };
    }
  }
  return { local: L, pendingDone };
}

/** Widok do wyświetlenia w chwili `nowMs`. */
export function clientView(s: ClientState, nowMs: number): ClientView {
  const blank: ClientView = { screen: 'idle', title: '', counter: '', load: '', group: null, cue: null, restEndsAt: null, restTotalSec: null, paused: false, timed: false, targetSec: null, measuring: false,
    doneCount: 0, totalCount: 0, toFillCount: 0, undoUntil: null, confirmSkip: false, actions: [], offline: !s.connected, busy: false };
  if (s.upgrade === 'watch') return { ...blank, screen: 'update' };
  if (s.upgrade === 'phone') return { ...blank, screen: 'connect' }; /* telefon starszy od zegarka: aktualizację robi się na telefonie — zegarek prosi o połączenie */
  if (!s.base) return { ...blank, screen: s.connected ? 'idle' : 'connect' };
  if (s.finished) return { ...blank, screen: 'finished', title: s.base.title };
  if (s.base.phase === 'idle') return { ...blank, screen: s.connected ? 'idle' : 'connect' };
  const { local: L, pendingDone } = project(s.base, s.queue, s.history);
  const base = { ...blank, title: s.base.title, paused: s.base.paused, doneCount: s.base.doneCount + pendingDone, totalCount: s.base.totalCount, toFillCount: s.base.toFillCount };
  if (!s.connected && pendingDone >= WATCH.OFFLINE_DONE_MAX) return { ...base, screen: 'connect' };
  const rest = L.rest && L.rest.endsAt > nowMs ? L.rest : null;
  const phase: WatchPhase = rest ? 'rest' : L.now || L.blind ? 'set' : 'done';
  const n = L.now; const undoUntil = s.undo && s.undo.until > nowMs ? s.undo.until : null;
  const actions: ClientAction[] = n && !L.blind ? ['done', 'differ', 'skip'] : [];
  if (undoUntil != null) actions.push('undo');
  return { ...base, screen: phase, title: n ? n.title : base.title, counter: n ? n.counter : '', load: n ? n.load : '', group: n?.group ?? null, cue: rest && !rest.last ? rest.cue : null, /* ostatnia przerwa: zapowiedź „nic więcej do zrobienia” zastępuje jedna etykieta „zakończ na telefonie” (23.10.2026, bez dublowania) */
    restEndsAt: rest ? rest.endsAt : null, restTotalSec: rest ? rest.totalSec : null, timed: n?.timed ?? false, targetSec: n?.targetSec ?? null, measuring: n?.measuring === true, undoUntil,
    confirmSkip: s.confirmSkip && !!n, actions, busy: s.queue.some(q => q.ev.type !== 'restEnded') || L.blind };
}

export interface ClientStep { state: ClientState; out: WatchToPhone[] }

/** Reduktor zegarka: wejście (z godziną) → nowy stan i komunikaty do telefonu. */
export function clientStep(s0: ClientState, ti: TimedInput): ClientStep {
  const { at, input } = ti; let s: ClientState = { ...s0, queue: [...s0.queue] }; const out: WatchToPhone[] = [];
  const hello = (): WatchToPhone => ({ v: WATCH_PROTOCOL, kind: 'hello', client: s.cfg.client, protocol: WATCH_PROTOCOL, app: s.cfg.app, caps: { session: s.cfg.session } });
  const emit = (type: 'done' | 'differ' | 'skip' | 'undo' | 'restEnded', id: string) => {
    const base = { v: WATCH_PROTOCOL, kind: 'event' as const, eventId: `${s.cfg.client}-${s.seq + 1}`, workoutId: s.base?.workoutId ?? '', baseRev: s.base?.rev ?? 0, at, client: s.cfg.client };
    const ev = (type === 'skip' ? { ...base, type, blockId: id } : { ...base, type, setId: id }) as WatchEvent;
    s = { ...s, seq: s.seq + 1, queue: [...s.queue, { ev, ackRev: null }] }; out.push(ev);
  };
  const view = clientView(s, at);
  switch (input.t) {
    case 'launch': out.push(hello()); break;
    case 'connection':
      s = { ...s, connected: input.reachable };
      if (input.reachable) out.push(hello());
      break;
    case 'receive': {
      const m = input.msg;
      if (m.kind === 'snapshot') {
        const wasWorking = !!s.base?.workoutId; const finished = m.phase === 'idle' && (wasWorking || s.finished);
        /* migawka starsza od ostatniej (spóźniona) — pomijamy */
        if (s.base && m.rev < s.base.rev && m.workoutId === s.base.workoutId) break;
        const history = [...(s.base ? [...s.history, s.base] : s.history)].slice(-WATCH.CLIENT_HISTORY);
        s = { ...s, base: m, history, finished, confirmSkip: m.phase === 'idle' || m.phase === 'done' ? false : s.confirmSkip, queue: s.queue.filter(q => q.ackRev == null || q.ackRev > m.rev) };
      } else if (m.kind === 'ack') {
        const have = s.base?.rev ?? 0;
        s = { ...s, queue: s.queue.flatMap(q => q.ev.eventId !== m.eventId ? [q] : have >= m.rev ? [] : [{ ...q, ackRev: m.rev }]) };
      } else if (m.kind === 'welcome') s = { ...s, upgrade: m.ok ? null : m.upgrade };
      break;
    }
    case 'press': {
      const b = input.button; const n = view.actions.includes('done') ? project(s.base!, s.queue, s.history).local.now : null;
      if (b === 'main' || b === 'differ') {
        if (!n || !view.actions.includes('done')) break;
        emit(b === 'main' ? 'done' : 'differ', n.setId); s = { ...s, undo: { setId: n.setId, until: at + WATCH.UNDO_SEC * 1000 }, confirmSkip: false };
      } else if (b === 'skip') { if (n) s = { ...s, confirmSkip: true }; }
      else if (b === 'cancelSkip') s = { ...s, confirmSkip: false };
      else if (b === 'confirmSkip') { if (n && s.confirmSkip) { emit('skip', n.blockId); s = { ...s, confirmSkip: false }; } }
      else if (b === 'undo') { if (s.undo && s.undo.until > at) { emit('undo', s.undo.setId); s = { ...s, undo: null }; } }
      break;
    }
    case 'tick': {
      if (s.undo && s.undo.until <= at) s = { ...s, undo: null };
      const { local } = s.base ? project(s.base, s.queue, s.history) : { local: null };
      const r = local?.rest;
      if (r && r.endsAt <= at && s.restEndedSent !== r.setId) { emit('restEnded', r.setId); s = { ...s, restEndedSent: r.setId }; }
      break;
    }
  }
  return { state: s, out };
}
