/*
 * Adapter wspólnego protokołu zegarka (gałąź f020-protokol, lib/watch/protocol.ts) <-> wąska migawka i zdarzenia Connect IQ (ciqWire.ts).
 * Typy poniżej są STRUKTURALNE (tylko pola, z których korzystamy) — kształt jak WatchSnapshot / WatchEvent z f020-protokol; po scaleniu gałęzi
 * WatchSnapshot jest przypisywalny do ProtoSnapshotLike bez zmian. Czysty TypeScript, bez zależności od natywnych modułów.
 *
 * Różnice, które adapter wyrównuje:
 *  - tryby: idle -> idle, done -> end, set -> set, rest -> rest (w przerwie `now` to NASTĘPNA seria, `after` — co po jej odhaczeniu; dokładnie tak liczy je zegarek);
 *  - czas: znacznik końca przerwy (ms) -> sekundy do końca w chwili wysyłki (zegarek nie porównuje zegarów); zdarzenia zegarka mają sekundy -> ms;
 *  - zdarzenie restEnd wskazuje seria, która URUCHOMIŁA przerwę (tak mówi protokół), a zegarek zna następną serię — adapter bierze `rest.setId` z bieżącej migawki telefonu;
 *  - odhaczenie „na ślepo” (zegarek bez łączności, setId puste) -> bieżąca seria telefonu (ctx.nowSetId);
 *  - workoutId zegarek nie zna — dopisuje telefon z bieżącej migawki.
 * Pominięte świadomie (zegarek z Connect IQ ich nie pokazuje): paused, doneCount/totalCount, toFillCount, lang, targetSec.
 */
import { CIQ_EVENT_TYPES, type CiqEvent, type CiqSetView, type CiqSnapshot } from './ciqWire';

export type ProtoNow = { setId: string; blockId: string; title: string; counter: string; load: string; group: string | null; timed: boolean };
export type ProtoSnapshotLike = {
  rev: number; phase: 'idle' | 'set' | 'rest' | 'done'; workoutId: string | null; now: ProtoNow | null;
  rest: { setId: string; endsAt: number; cue: string; last: boolean } | null;
  after: { restSec: number | null; cue: string; last: boolean; now: ProtoNow | null } | null;
};
export type ProtoEventLike = {
  v: 1; kind: 'event'; eventId: string; workoutId: string; baseRev: number; at: number; client: 'garmin';
  type: 'done' | 'differ' | 'skip' | 'undo' | 'restEnded'; setId?: string; blockId?: string;
};

const view = (n: ProtoNow): CiqSetView => ({ setId: n.setId, blockId: n.blockId, title: n.title, counter: n.counter, load: n.load, ...(n.group ? { group: n.group } : {}), ...(n.timed ? { timed: true } : {}) });
const EMPTY: CiqSetView = { setId: '', title: '', counter: '', load: '' };

/** Migawka wspólnego protokołu -> migawka Connect IQ. `nowMs` = chwila wysyłki (do policzenia sekund przerwy). */
export function ciqSnapshotFromProtocol(s: ProtoSnapshotLike, nowMs: number): CiqSnapshot {
  const rev = s.rev;
  if (s.phase === 'idle') return { rev, mode: 'idle' };
  const next = s.after && s.after.now ? { set: view(s.after.now), restSec: s.after.restSec ?? 0, cue: s.after.cue } : undefined;
  if (s.phase === 'rest' && s.rest) {
    const left = Math.max(0, Math.ceil((s.rest.endsAt - nowMs) / 1000));
    return { rev, mode: 'rest', now: s.now ? view(s.now) : EMPTY, restLeftSec: left, cue: s.rest.cue, ...(next ? { next } : {}) };
  }
  if (s.phase === 'set' && s.now) return { rev, mode: 'set', now: view(s.now), ...(next ? { next } : {}) };
  return { rev, mode: 'end' };
}

export type AdapterCtx = { workoutId: string; baseRev: number; restSetId: string | null; nowSetId: string | null };

/** Zdarzenie z zegarka (już zwalidowane przez parseCiqEvent) -> zdarzenie wspólnego protokołu; null = nie jest zdarzeniem treningu (np. powitanie). */
export function protocolEventFromCiq(e: CiqEvent, ctx: AdapterCtx): ProtoEventLike | null {
  const base = { v: 1 as const, kind: 'event' as const, eventId: e.eventId, workoutId: ctx.workoutId, baseRev: e.baseRev, at: e.at * 1000, client: 'garmin' as const };
  switch (e.type) {
    case 'done': case 'doneDiff': {
      const setId = e.setId === '' ? ctx.nowSetId : e.setId; if (!setId) return null;
      return { ...base, type: e.type === 'done' ? 'done' : 'differ', setId };
    }
    case 'skip': {
      const blockId = e.blockId ?? ''; if (!blockId) return null;
      return { ...base, type: 'skip', blockId };
    }
    case 'undo': return { ...base, type: 'undo', setId: e.setId };
    case 'restEnd': { const setId = ctx.restSetId ?? e.setId; return setId ? { ...base, type: 'restEnded', setId } : null; }
    case 'hello': return null;
  }
}
/** Zgodność nazw: każdy rodzaj zdarzenia zegarka ma jawną obsługę w adapterze (test sprawdza pokrycie). */
export const CIQ_ADAPTED_EVENTS = Object.keys(CIQ_EVENT_TYPES) as (keyof typeof CIQ_EVENT_TYPES)[];
