import { getState, save, skipExercise, exById } from '../store';
import * as timer from '../timer';
import { completeSet, relabelRest } from '../setFlow';
import type { Workout } from '../seed';
import { WATCH, WATCH_PROTOCOL, type WatchAck, type WatchAckStatus, type WatchEvent, type WatchReason } from './protocol';

/*
 * Reducer zdarzeń z zegarka na treningu w toku (docs/35 rozdz. 2). Dwie warstwy:
 *  1. `decideWatchEvent` — CZYSTA decyzja: czy i co zrobić (zastosowano / powtórzenie / pominięto / odrzucono + akcja). Zdarzenia są bezwzględne
 *     (seria o id jest odhaczona), więc powtórzenie, zła kolejność i stara wersja migawki nie psują danych; decyzję testuje Jest, także na losowych sekwencjach.
 *  2. `applyWatchEvent` — wykonanie akcji tą samą drogą co ✓ na telefonie (lib/setFlow.ts: przerwa, stoper, Live Activity, głos) i potwierdzenie `ack`.
 * Owner 13.10.2026: zegarek tylko wyświetla i zarządza akcją — zdarzenia: zrobione według planu (`done`), zrobione inaczej niż w planie (`differ` — seria
 * dostaje znacznik „do uzupełnienia”), pomiń (`skip`, zegarek już zapytał o potwierdzenie), cofnij (`undo`), koniec przerwy (`restEnded`); przycisk główny
 * w przerwie odhacza następną serię (to zwykłe `done` następnej serii).
 */

/** Stan potrzebny do decyzji: trening w toku, godzina i przerwa z timera (lib/timer.ts `T`). */
export interface DecideCtx { w: Workout | null; nowMs: number; rest: { on: boolean; setId: string | null; endAt: number } | null }
export type WatchAction =
  | { kind: 'complete'; ei: number; si: number; differ: boolean }
  | { kind: 'markDiffer'; ei: number; si: number }
  | { kind: 'uncomplete'; ei: number; si: number }
  | { kind: 'skip'; blockId: string }
  | { kind: 'restEnded'; setId: string }
  | { kind: 'sessionStarted' }
  | { kind: 'sessionEnded'; saved: boolean };
export interface WatchDecision { status: WatchAckStatus; reason: WatchReason | null; action: WatchAction | null }

const D = (status: WatchAckStatus, reason: WatchReason | null = null, action: WatchAction | null = null): WatchDecision => ({ status, reason, action });
const locate = (w: Workout, setId: string): { ei: number; si: number } | null => {
  for (let ei = 0; ei < w.exercises.length; ei++) { const si = w.exercises[ei].sets.findIndex(s => s.id === setId); if (si >= 0) return { ei, si }; }
  return null;
};

export function decideWatchEvent(ev: WatchEvent, ctx: DecideCtx): WatchDecision {
  const w = ctx.w;
  if (!w) return D('rejected', 'no-workout');
  if (ev.workoutId !== w.id) return D('rejected', 'other-workout');
  /* M1-audytor-generalny-005: ten sam eventId jest powtórzeniem tylko wtedy, gdy zdarzenie nie jest późniejsze od ostatnio zastosowanego — zegarek z wyzerowanym
   * stanem liczy zdarzenia od nowa (apple-1, apple-2, …), ale jego godziny rosną. Dziennik bez watchLastAt (zapis sprzed zmiany) działa jak dotąd. */
  if (w.watchEvents?.includes(ev.eventId) && (w.watchLastAt === undefined || ev.at <= w.watchLastAt)) return D('duplicate');
  if (ev.at < ctx.nowMs - WATCH.MAX_EVENT_AGE_MS || ev.at < w.startedAt - WATCH.CLOCK_TOL_MS) return D('rejected', 'stale-time');
  if (ev.at > ctx.nowMs + WATCH.MAX_FUTURE_MS) return D('rejected', 'future-time');
  switch (ev.type) {
    case 'done': case 'differ': {
      const p = locate(w, ev.setId); const ex = p && exById(w.exercises[p.ei].exerciseId); if (!p || !ex) return D('rejected', 'set-gone');
      if (w.exercises[p.ei].skipped) return D('rejected', 'skipped-block');
      const s = w.exercises[p.ei].sets[p.si];
      if (ev.type === 'done') return s.done ? D('duplicate') : D('applied', null, { kind: 'complete', ...p, differ: false });
      if (!s.done) return D('applied', null, { kind: 'complete', ...p, differ: true });
      return s.toFill ? D('duplicate') : D('applied', null, { kind: 'markDiffer', ...p });
    }
    case 'undo': {
      const p = locate(w, ev.setId); if (!p) return D('rejected', 'set-gone');
      const s = w.exercises[p.ei].sets[p.si]; if (!s.done || s.completedAt == null) return D('ignored', 'not-done');
      /* „Cofnij” tylko tuż po odhaczeniu (okno + tolerancja zegarów); późniejsze odhaczenie tej samej serii z telefonu ma nowszą godzinę i nie da się go cofnąć starym zdarzeniem */
      if (ev.at - s.completedAt > WATCH.UNDO_SEC * 1000 + WATCH.CLOCK_TOL_MS || s.completedAt - ev.at > WATCH.CLOCK_TOL_MS) return D('rejected', 'undo-window');
      return D('applied', null, { kind: 'uncomplete', ...p });
    }
    case 'skip': {
      const e = w.exercises.find(x => x.id === ev.blockId); if (!e) return D('rejected', 'block-gone');
      return e.skipped ? D('duplicate') : D('applied', null, { kind: 'skip', blockId: e.id });
    }
    case 'restEnded': {
      const r = ctx.rest; if (!r || !r.on || r.setId !== ev.setId) return D('ignored', 'no-rest');
      if (r.endAt - ev.at > WATCH.REST_END_TOL_MS) return D('ignored', 'rest-not-over');
      return D('applied', null, { kind: 'restEnded', setId: ev.setId });
    }
    case 'sessionStarted': return w.watch?.startedAt ? D('duplicate') : D('applied', null, { kind: 'sessionStarted' });
    case 'sessionEnded': return w.watch?.endedAt ? D('duplicate') : D('applied', null, { kind: 'sessionEnded', saved: ev.saved });
  }
}

/** Zapamiętuje identyfikator zastosowanego zdarzenia w treningu (ograniczony dziennik; przeżywa restart) i godzinę najnowszego (watchLastAt). */
function remember(w: Workout, id: string, at: number) {
  const log = w.watchEvents ?? []; w.watchLastAt = Math.max(w.watchLastAt ?? at, at); if (!log.includes(id)) log.push(id); w.watchEvents = log.slice(-WATCH.EVENT_LOG_MAX); save(w);
}

/**
 * Stosuje zdarzenie z zegarka w trakcie treningu i zwraca `ack` dla zegarka. Tylko `applied` zmienia dane; reszta jest bezpieczna do powtórzenia.
 * Odhaczenie idzie przez `completeSet` z godziną zdarzenia (przerwa liczona od niej — po opóźnionym dostarczeniu zostaje reszta albo nic).
 */
export async function applyWatchEvent(ev: WatchEvent, rev: number): Promise<WatchAck> {
  const st = getState(); const w = st.active; const T = timer.T;
  const d = decideWatchEvent(ev, { w, nowMs: Date.now(), rest: { on: T.on, setId: T.setId, endAt: T.endAt } });
  const ack = (): WatchAck => ({ v: WATCH_PROTOCOL, kind: 'ack', eventId: ev.eventId, status: d.status, reason: d.reason, rev });
  if (d.status !== 'applied' || !d.action || !w) return ack();
  const a = d.action;
  switch (a.kind) {
    case 'complete': {
      await completeSet(a.ei, a.si, ev.at);
      const cur = getState().active; const s = cur?.exercises[a.ei]?.sets[a.si];
      if (cur && s && s.done && a.differ) { s.toFill = true; save(cur); }
      break;
    }
    case 'markDiffer': { const s = w.exercises[a.ei].sets[a.si]; s.toFill = true; save(w); break; }
    case 'uncomplete': await completeSet(a.ei, a.si); break;
    case 'skip': {
      const e = w.exercises.find(x => x.id === a.blockId);
      if (e && timer.S.on && e.sets.some(x => x.id === timer.S.setId)) await timer.stopSet(); /* jak „Pomiń dziś” na telefonie: pomiar pominiętego bloku się kończy */
      skipExercise(a.blockId); relabelRest(); break;
    }
    case 'restEnded': timer.tick(); break; /* telefon liczy koniec przerwy sam (powiadomienie, wibracja); zdarzenie tylko przyspiesza alarm, gdy czas już minął */
    case 'sessionStarted': w.watch = { client: ev.client, startedAt: ev.at }; save(w); break;
    case 'sessionEnded': w.watch = { ...(w.watch ?? { client: ev.client, startedAt: ev.at }), endedAt: ev.at, saved: a.saved }; save(w); break;
  }
  const cur = getState().active; if (cur && cur.id === ev.workoutId) remember(cur, ev.eventId, ev.at);
  return ack();
}
