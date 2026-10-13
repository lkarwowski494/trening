/* Adapter wspólnego protokołu zegarka <-> Connect IQ (lib/watch/ciqAdapter.ts): migawki (4 fazy), zdarzenia (6 rodzajów), przypadki brzegowe, niezmienniki.
 * Obiekty wejściowe mają kształt WatchSnapshot / WatchEvent z gałęzi f020-protokol (lib/watch/protocol.ts). Po scaleniu gałęzi: dopisać testy na jej plikach „złotych”. */
import { ciqSnapshotFromProtocol, protocolEventFromCiq, CIQ_ADAPTED_EVENTS, type ProtoSnapshotLike, type ProtoNow } from '@/lib/watch/ciqAdapter';
import { toCiqWire, parseCiqEvent, CIQ_EVENT_TYPES, CIQ_KEYS, CIQ_MODES } from '@/lib/watch/ciqWire';
import { CiqWatchModel } from '@/lib/watch/ciqModel';
import { T0 } from './ciq-scenarios';

const now = (n: number, extra: Partial<ProtoNow> = {}): ProtoNow => ({ setId: `s${n}`, blockId: 'b1', title: 'Przysiad', counter: `seria ${n} z 3`, load: '100 kg × 5', group: null, timed: false, ...extra });
const NOW_MS = 1_800_000_000_000;
const snap = (over: Partial<ProtoSnapshotLike>): ProtoSnapshotLike => ({ rev: 4, phase: 'set', workoutId: 'w-1', now: now(2), rest: null, after: { restSec: 90, cue: 'Następne: Przysiad, seria 3 z 3, 100 kg × 5', last: false, now: now(3) }, ...over });

describe('migawka protokołu -> Connect IQ', () => {
  test('idle -> idle bez pól serii', () => { expect(ciqSnapshotFromProtocol(snap({ phase: 'idle', workoutId: null, now: null, after: null }), NOW_MS)).toEqual({ rev: 4, mode: 'idle' }); });
  test('done -> end', () => { expect(ciqSnapshotFromProtocol(snap({ phase: 'done', now: null, after: null }), NOW_MS)).toEqual({ rev: 4, mode: 'end' }); });
  test('set: bieżąca seria i „po odhaczeniu” (następna seria, przerwa, zapowiedź)', () => {
    expect(ciqSnapshotFromProtocol(snap({}), NOW_MS)).toEqual({
      rev: 4, mode: 'set', now: { setId: 's2', blockId: 'b1', title: 'Przysiad', counter: 'seria 2 z 3', load: '100 kg × 5' },
      next: { set: { setId: 's3', blockId: 'b1', title: 'Przysiad', counter: 'seria 3 z 3', load: '100 kg × 5' }, restSec: 90, cue: 'Następne: Przysiad, seria 3 z 3, 100 kg × 5' },
    });
  });
  test('set bez przerwy (środek rundy superserii): restSec null -> 0; grupa i seria na czas przechodzą', () => {
    const s = ciqSnapshotFromProtocol(snap({ now: now(1, { group: 'SS A', timed: true }), after: { restSec: null, cue: '', last: false, now: now(2) } }), NOW_MS) as { now: Record<string, unknown>; next: { restSec: number } };
    expect(s.next.restSec).toBe(0); expect(s.now).toMatchObject({ group: 'SS A', timed: true });
  });
  test('set bez „po odhaczeniu” (ostatnia seria): bez next', () => { expect(ciqSnapshotFromProtocol(snap({ after: { restSec: null, cue: '', last: true, now: null } }), NOW_MS)).not.toHaveProperty('next'); });
  test('rest: sekundy do końca w chwili wysyłki (zaokrąglone w górę), zapowiedź, następna seria', () => {
    const s = ciqSnapshotFromProtocol(snap({ phase: 'rest', now: now(3), rest: { setId: 's2', endsAt: NOW_MS + 89_100, cue: 'Następne: Przysiad', last: false }, after: { restSec: 90, cue: 'x', last: false, now: now(4) } }), NOW_MS);
    expect(s).toMatchObject({ mode: 'rest', restLeftSec: 90, cue: 'Następne: Przysiad', now: { setId: 's3' }, next: { set: { setId: 's4' } } });
  });
  test('rest po końcu czasu: 0 s, nie ujemne', () => { expect(ciqSnapshotFromProtocol(snap({ phase: 'rest', rest: { setId: 's2', endsAt: NOW_MS - 5000, cue: '', last: false } }), NOW_MS)).toMatchObject({ restLeftSec: 0 }); });
  test('rest po ostatniej serii (now = null): przerwa z pustą serią i zapowiedzią „nic więcej”', () => {
    const s = ciqSnapshotFromProtocol(snap({ phase: 'rest', now: null, after: null, rest: { setId: 's3', endsAt: NOW_MS + 30_000, cue: 'Nic więcej do zrobienia', last: true } }), NOW_MS);
    expect(s).toMatchObject({ mode: 'rest', now: { setId: '' }, cue: 'Nic więcej do zrobienia', restLeftSec: 30 });
  });
  test('faza set bez bieżącej serii albo rest bez przerwy: zegarek dostaje „koniec”, nie zepsuty ekran', () => {
    expect(ciqSnapshotFromProtocol(snap({ now: null }), NOW_MS)).toEqual({ rev: 4, mode: 'end' }); expect(ciqSnapshotFromProtocol(snap({ phase: 'rest', rest: null }), NOW_MS)).toEqual({ rev: 4, mode: 'end' });
  });
  test('wynik przechodzi przez toCiqWire i model zegarka: tryb i seria zgodne', () => {
    const m = new CiqWatchModel('w1'); m.applySnapshot(toCiqWire(ciqSnapshotFromProtocol(snap({}), NOW_MS)), T0);
    expect(m.view(T0)).toMatchObject({ mode: CIQ_MODES.set, setId: 's2', hasNext: true });
    m.applySnapshot(toCiqWire(ciqSnapshotFromProtocol(snap({ phase: 'rest', now: now(3), rest: { setId: 's2', endsAt: NOW_MS + 60_000, cue: 'c', last: false } }), NOW_MS)), T0);
    expect(m.view(T0)).toMatchObject({ mode: CIQ_MODES.rest, setId: 's3', restLeft: 60 });
  });
});

describe('zdarzenie Connect IQ -> protokół', () => {
  const ctx = { workoutId: 'w-1', baseRev: 4, restSetId: 's2', nowSetId: 's3' };
  const ev = (t: string, extra: Record<string, unknown> = {}) => parseCiqEvent({ k: 'e', v: 1, t, e: 'w9-1', b: 4, id: 's2', a: T0, c: 'g0.1.0', ...extra })!;
  test.each([
    ['d', {}, { type: 'done', setId: 's2' }], ['x', {}, { type: 'differ', setId: 's2' }], ['s', { bk: 'b7' }, { type: 'skip', blockId: 'b7' }], ['u', {}, { type: 'undo', setId: 's2' }],
  ])('rodzaj %s', (code, extra, want) => {
    expect(protocolEventFromCiq(ev(code, extra), ctx)).toEqual({ v: 1, kind: 'event', eventId: 'w9-1', workoutId: 'w-1', baseRev: 4, at: T0 * 1000, client: 'garmin', ...want });
  });
  test('restEnd: setId serii, która uruchomiła przerwę, z bieżącej migawki telefonu (nie następna seria z zegarka)', () => {
    expect(protocolEventFromCiq(ev('r', { id: 's3' }), ctx)).toMatchObject({ type: 'restEnded', setId: 's2' });
    expect(protocolEventFromCiq(ev('r', { id: 's3' }), { ...ctx, restSetId: null })).toMatchObject({ type: 'restEnded', setId: 's3' });
  });
  test('odhaczenie na ślepo (puste setId) -> bieżąca seria telefonu; bez niej null', () => {
    expect(protocolEventFromCiq(ev('d', { id: '' }), ctx)).toMatchObject({ type: 'done', setId: 's3' }); expect(protocolEventFromCiq(ev('x', { id: '' }), ctx)).toMatchObject({ type: 'differ', setId: 's3' });
    expect(protocolEventFromCiq(ev('d', { id: '' }), { ...ctx, nowSetId: null })).toBeNull();
  });
  test('powitanie nie jest zdarzeniem treningu; pominięcie bez bloku -> null', () => {
    expect(protocolEventFromCiq(ev('h', { id: '' }), ctx)).toBeNull(); expect(protocolEventFromCiq(ev('s', { id: 's2' }), ctx)).toBeNull();
  });
  test('czas: sekundy zegarka -> milisekundy; client = garmin', () => { const p = protocolEventFromCiq(ev('d'), ctx)!; expect(p.at).toBe(T0 * 1000); expect(p.client).toBe('garmin'); });
  test('każdy rodzaj zdarzenia zegarka ma obsługę w adapterze (pokrycie)', () => { expect(CIQ_ADAPTED_EVENTS.sort()).toEqual(Object.keys(CIQ_EVENT_TYPES).sort()); expect(Object.values(CIQ_KEYS).includes('b')).toBe(true); });
});
