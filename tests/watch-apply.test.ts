/*
 * lib/watch/apply.ts — reducer zdarzeń z zegarka na treningu w toku (docs/35 rozdz. 3.4): czysta decyzja (`decideWatchEvent`) na macierzy typ zdarzenia × stan oraz
 * wykonanie (`applyWatchEvent`) tą samą drogą co ✓ na telefonie. Zdarzenia są bezwzględne: powtórzenie, zła kolejność i stara migawka nie psują danych.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { decideWatchEvent, applyWatchEvent, type DecideCtx } from '@/lib/watch/apply';
import { WATCH, WATCH_EVENT_TYPES, type WatchEvent } from '@/lib/watch/protocol';
import { prMap } from '@/lib/stats';
import { completeSet } from '@/lib/setFlow';
import { fresh, saved } from './helpers';
import { world, A, sid, NOW, teardownWorld } from './watch-world';

afterEach(teardownWorld);
let n = 0;
const ev = (type: WatchEvent['type'], extra: Record<string, unknown> = {}, at = NOW + 1000, o: Partial<WatchEvent> = {}): WatchEvent =>
  ({ v: 1, kind: 'event', eventId: `t-${++n}`, workoutId: A().id, baseRev: 1, at, client: 'apple', type, ...extra, ...o } as WatchEvent);
const ctx = (o: Partial<DecideCtx> = {}): DecideCtx => ({ w: A(), nowMs: NOW + 2000, rest: null, ...o });
const dec = (e: WatchEvent, o: Partial<DecideCtx> = {}) => decideWatchEvent(e, ctx(o));

describe('decideWatchEvent: stan ogólny', () => {
  test('brak treningu → rejected no-workout; inny trening → other-workout; powtórzony eventId → duplicate (także przed sprawdzaniem serii)', async () => {
    await world();
    expect(dec(ev('done', { setId: sid(0, 0) }), { w: null })).toEqual({ status: 'rejected', reason: 'no-workout', action: null });
    expect(dec(ev('done', { setId: sid(0, 0) }, NOW + 1000, { workoutId: 'inny' }))).toEqual({ status: 'rejected', reason: 'other-workout', action: null });
    A().watchEvents = ['t-dup']; expect(dec(ev('done', { setId: 'nie ma' }, NOW + 1000, { eventId: 't-dup' }))).toEqual({ status: 'duplicate', reason: null, action: null });
  });
  test('czas: zdarzenie starsze niż okno, sprzed startu treningu albo z przyszłości → rejected', async () => {
    await world(); const s = { setId: sid(0, 0) };
    expect(dec(ev('done', s, NOW - WATCH.MAX_EVENT_AGE_MS - 1), { nowMs: NOW }).reason).toBe('stale-time');
    expect(dec(ev('done', s, A().startedAt - WATCH.CLOCK_TOL_MS - 1)).reason).toBe('stale-time');
    expect(dec(ev('done', s, NOW + 2000 + WATCH.MAX_FUTURE_MS + 1)).reason).toBe('future-time');
    expect(dec(ev('done', s, A().startedAt - WATCH.CLOCK_TOL_MS)).status).toBe('applied'); /* granica: jeszcze w tolerancji zegarów */
  });
});
describe('decideWatchEvent: done / differ', () => {
  test('done: seria otwarta → complete; odhaczona → duplicate; nieznana → set-gone; pominięty blok → skipped-block; ćwiczenie usunięte z biblioteki → set-gone', async () => {
    await world();
    expect(dec(ev('done', { setId: sid(0, 1) }))).toEqual({ status: 'applied', reason: null, action: { kind: 'complete', ei: 0, si: 1, differ: false } });
    A().exercises[0].sets[0].done = true; expect(dec(ev('done', { setId: sid(0, 0) }))).toEqual({ status: 'duplicate', reason: null, action: null });
    expect(dec(ev('done', { setId: 'nie ma' }))).toMatchObject({ status: 'rejected', reason: 'set-gone' });
    store.skipExercise(A().exercises[1].id); expect(dec(ev('done', { setId: sid(1, 0) }))).toMatchObject({ status: 'rejected', reason: 'skipped-block' });
    const lib = store.getState().exercises; const i = lib.findIndex(x => x.id === A().exercises[2].exerciseId); const keep = lib.splice(i, 1)[0];
    expect(dec(ev('done', { setId: sid(2, 0) }))).toMatchObject({ status: 'rejected', reason: 'set-gone' }); lib.splice(i, 0, keep);
  });
  test('differ: seria otwarta → complete z differ; odhaczona bez znacznika → markDiffer; ze znacznikiem → duplicate', async () => {
    await world();
    expect(dec(ev('differ', { setId: sid(0, 0) })).action).toEqual({ kind: 'complete', ei: 0, si: 0, differ: true });
    A().exercises[0].sets[0].done = true; expect(dec(ev('differ', { setId: sid(0, 0) })).action).toEqual({ kind: 'markDiffer', ei: 0, si: 0 });
    A().exercises[0].sets[0].toFill = true; expect(dec(ev('differ', { setId: sid(0, 0) }))).toMatchObject({ status: 'duplicate', action: null });
    expect(dec(ev('differ', { setId: 'nie ma' })).reason).toBe('set-gone');
  });
});
describe('decideWatchEvent: undo', () => {
  test('w oknie → uncomplete; seria nieodhaczona → ignored not-done; poza oknem → undo-window; odhaczona PÓŹNIEJ niż zdarzenie → undo-window; nieznana → set-gone', async () => {
    await world(); const s = A().exercises[0].sets[0]; s.done = true; s.completedAt = NOW + 1000;
    expect(dec(ev('undo', { setId: s.id }, NOW + 1000 + WATCH.UNDO_SEC * 1000)).action).toEqual({ kind: 'uncomplete', ei: 0, si: 0 });
    expect(dec(ev('undo', { setId: s.id }, NOW + 1000 + WATCH.UNDO_SEC * 1000 + WATCH.CLOCK_TOL_MS)).status).toBe('applied'); /* granica z tolerancją zegarów */
    expect(dec(ev('undo', { setId: s.id }, NOW + 1000 + WATCH.UNDO_SEC * 1000 + WATCH.CLOCK_TOL_MS + 1))).toMatchObject({ status: 'rejected', reason: 'undo-window' });
    s.completedAt = NOW + 1000 + WATCH.CLOCK_TOL_MS + 1; expect(dec(ev('undo', { setId: s.id }, NOW + 1000))).toMatchObject({ status: 'rejected', reason: 'undo-window' });
    s.done = false; s.completedAt = null; expect(dec(ev('undo', { setId: s.id }))).toMatchObject({ status: 'ignored', reason: 'not-done' });
    expect(dec(ev('undo', { setId: 'nie ma' })).reason).toBe('set-gone');
  });
});
describe('decideWatchEvent: skip, restEnded, sesja', () => {
  test('skip: blok otwarty → skip; pominięty → duplicate; nieznany → block-gone', async () => {
    await world(); const b = A().exercises[1].id;
    expect(dec(ev('skip', { blockId: b })).action).toEqual({ kind: 'skip', blockId: b }); A().exercises[1].skipped = true;
    expect(dec(ev('skip', { blockId: b })).status).toBe('duplicate'); expect(dec(ev('skip', { blockId: 'nie ma' }))).toMatchObject({ status: 'rejected', reason: 'block-gone' });
  });
  test('restEnded: bez przerwy / inna seria → ignored no-rest; koniec jeszcze daleko → ignored rest-not-over; w tolerancji → applied', async () => {
    await world(); const s = sid(0, 0); const at = NOW + 90e3;
    expect(dec(ev('restEnded', { setId: s }, at))).toMatchObject({ status: 'ignored', reason: 'no-rest' });
    expect(dec(ev('restEnded', { setId: s }, at), { rest: { on: false, setId: s, endAt: at } }).reason).toBe('no-rest');
    expect(dec(ev('restEnded', { setId: s }, at), { rest: { on: true, setId: 'inna', endAt: at } }).reason).toBe('no-rest');
    expect(dec(ev('restEnded', { setId: s }, at - WATCH.REST_END_TOL_MS - 1), { rest: { on: true, setId: s, endAt: at } })).toMatchObject({ status: 'ignored', reason: 'rest-not-over' });
    expect(dec(ev('restEnded', { setId: s }, at - WATCH.REST_END_TOL_MS), { rest: { on: true, setId: s, endAt: at } })).toMatchObject({ status: 'applied', action: { kind: 'restEnded', setId: s } });
  });
  test('sesja zegarka: sessionStarted raz (potem duplicate), sessionEnded raz', async () => {
    await world(); expect(dec(ev('sessionStarted')).action).toEqual({ kind: 'sessionStarted' }); A().watch = { client: 'apple', startedAt: NOW };
    expect(dec(ev('sessionStarted')).status).toBe('duplicate'); expect(dec(ev('sessionEnded', { saved: true })).action).toEqual({ kind: 'sessionEnded', saved: true });
    A().watch!.endedAt = NOW + 5000; expect(dec(ev('sessionEnded', { saved: true })).status).toBe('duplicate');
  });
  test.each([...WATCH_EVENT_TYPES])('typ „%s”: decyzja zawsze ma status z listy i spójną akcję (applied ⇔ akcja)', async type => {
    await world(); const extra: Record<string, unknown> = { setId: sid(0, 0), blockId: A().exercises[0].id, saved: true };
    for (const w of [null, A()]) { const d = decideWatchEvent(ev(type, extra), { w, nowMs: NOW + 2000, rest: null }); expect(d.status === 'applied').toBe(d.action !== null); }
  });
});

describe('applyWatchEvent: skutki', () => {
  test('done: seria odhaczona z godziną zdarzenia, przerwa liczona od niej, podpis = zapowiedź, ack applied; powtórzenie nic nie zmienia (bajt w bajt)', async () => {
    await world(); jest.setSystemTime(NOW + 5000); const e = ev('done', { setId: sid(0, 0) }, NOW + 2000);
    const ack = await applyWatchEvent(e, 7);
    expect(ack).toEqual({ v: 1, kind: 'ack', eventId: e.eventId, status: 'applied', reason: null, rev: 7 });
    const s = A().exercises[0].sets[0]; expect([s.done, s.completedAt]).toEqual([true, NOW + 2000]); expect([timer.T.on, timer.T.setId, timer.T.endAt]).toEqual([true, s.id, NOW + 2000 + 90e3]);
    expect(timer.T.sub).toBe('Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń'); expect(A().watchEvents).toEqual([e.eventId]);
    const before = JSON.stringify(A()); const again = await applyWatchEvent(e, 8); expect(again).toMatchObject({ status: 'duplicate', rev: 8 }); expect(JSON.stringify(A())).toBe(before);
  });
  test('done po opóźnionym dostarczeniu: przerwa już minęła → bez przerwy (jak ✓ po późnym wybudzeniu)', async () => {
    await world(); jest.setSystemTime(NOW + 300e3); await applyWatchEvent(ev('done', { setId: sid(0, 0) }, NOW + 1000), 1);
    expect(A().exercises[0].sets[0].done).toBe(true); expect(timer.T.on).toBe(false);
  });
  test('przycisk główny w przerwie: done następnej serii uruchamia nową przerwę po tej serii', async () => {
    await world(); await applyWatchEvent(ev('done', { setId: sid(0, 0) }, NOW + 1000), 1); jest.setSystemTime(NOW + 20e3);
    await applyWatchEvent(ev('done', { setId: sid(0, 1) }, NOW + 20e3), 2); expect(timer.T.setId).toBe(sid(0, 1)); expect(timer.T.endAt).toBe(NOW + 20e3 + 90e3);
    expect(A().exercises[0].sets.map(s => s.done)).toEqual([true, true, false]);
  });
  test('kolejność zdarzeń nie ma znaczenia dla danych: done(B) przed done(A) odhacza obie serie', async () => {
    await world(); jest.setSystemTime(NOW + 10e3);
    await applyWatchEvent(ev('done', { setId: sid(0, 1) }, NOW + 5000), 1); await applyWatchEvent(ev('done', { setId: sid(0, 0) }, NOW + 1000), 2);
    expect(A().exercises[0].sets.map(s => s.done)).toEqual([true, true, false]);
  });
  test('differ: seria odhaczona ze znacznikiem „do uzupełnienia”; rekordy jej nie liczą; zdjęcie znacznika przywraca rekord; undo zdejmuje odhaczenie i znacznik', async () => {
    await world(); const w0 = A(); const e0 = w0.exercises[0];
    /* rekord do pobicia: wcześniejszy trening z lżejszą serią tego ćwiczenia */
    const { addWorkout } = require('./helpers'); addWorkout(NOW - 7 * 86400e3, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    jest.setSystemTime(NOW + 3000);
    await applyWatchEvent(ev('differ', { setId: sid(0, 0) }, NOW + 2000), 1); const s = e0.sets[0];
    expect([s.done, s.toFill]).toEqual([true, true]); expect(prMap(A()).get(s.id)).toBeUndefined();
    delete s.toFill; expect(prMap(A()).get(s.id)?.length).toBeGreaterThan(0);
    s.toFill = true; await applyWatchEvent(ev('undo', { setId: s.id }, NOW + 3000), 2); expect([s.done, s.toFill, s.completedAt]).toEqual([false, undefined, null]); expect(timer.T.on).toBe(false);
  });
  test('differ na serii już odhaczonej (z telefonu): tylko znacznik, przerwa i godzina bez zmian', async () => {
    await world(); await completeSet(0, 0); const at0 = A().exercises[0].sets[0].completedAt; const end = timer.T.endAt;
    const ack = await applyWatchEvent(ev('differ', { setId: sid(0, 0) }, NOW + 1500), 1); expect(ack.status).toBe('applied');
    expect([A().exercises[0].sets[0].toFill, A().exercises[0].sets[0].completedAt, timer.T.endAt]).toEqual([true, at0, end]);
  });
  test('skip: blok pominięty, stoper jego serii zatrzymany, podpis przerwy przeliczony, bez pytania drugi raz', async () => {
    await world(); A().exercises.slice(0, 2).forEach(e => e.sets.forEach(x => { x.done = true; })); const plank = A().exercises[2];
    await timer.startSet(plank.sets[0].id, 45); expect(timer.S.on).toBe(true);
    const ack = await applyWatchEvent(ev('skip', { blockId: plank.id }), 1); expect(ack.status).toBe('applied'); expect(plank.skipped).toBe(true); expect(timer.S.on).toBe(false);
  });
  test('restEnded: przerwa, której czas minął, kończy się alarmem; za wcześnie — ignorowane', async () => {
    await world(); await completeSet(0, 0); const end = timer.T.endAt;
    expect((await applyWatchEvent(ev('restEnded', { setId: sid(0, 0) }, end - 30e3), 1)).status).toBe('ignored'); expect(timer.T.alarmed).toBe(false);
    jest.setSystemTime(end + 100); const ack = await applyWatchEvent(ev('restEnded', { setId: sid(0, 0) }, end), 2); expect(ack.status).toBe('applied'); expect(timer.T.alarmed).toBe(true);
  });
  test('sesja zegarka: start i koniec zapisane w treningu; koniec bez startu też zapisany', async () => {
    await world(); await applyWatchEvent(ev('sessionStarted', {}, NOW + 1000), 1); expect(A().watch).toEqual({ client: 'apple', startedAt: NOW + 1000 });
    await applyWatchEvent(ev('sessionEnded', { saved: true }, NOW + 5000), 2); expect(A().watch).toEqual({ client: 'apple', startedAt: NOW + 1000, endedAt: NOW + 5000, saved: true });
    await world(); await applyWatchEvent(ev('sessionEnded', { saved: false }, NOW + 5000, { client: 'garmin' }), 1); expect(A().watch).toEqual({ client: 'garmin', startedAt: NOW + 5000, endedAt: NOW + 5000, saved: false });
  });
  test('odrzucone / zignorowane zdarzenia nie zmieniają danych i nie wpisują się do dziennika', async () => {
    await world(); const before = JSON.stringify(A());
    for (const e of [ev('done', { setId: 'nie ma' }), ev('undo', { setId: sid(0, 0) }), ev('skip', { blockId: 'nie ma' }), ev('restEnded', { setId: sid(0, 0) }), ev('done', { setId: sid(0, 0) }, NOW - WATCH.MAX_EVENT_AGE_MS - 1)])
      expect((await applyWatchEvent(e, 1)).status).not.toBe('applied');
    expect(JSON.stringify(A())).toBe(before);
  });
  test('dziennik zdarzeń ograniczony do WATCH.EVENT_LOG_MAX (zostają najnowsze)', async () => {
    await world(); jest.setSystemTime(NOW + 5000); A().watchEvents = [...Array(WATCH.EVENT_LOG_MAX + 30).keys()].map(i => `x-${i}`);
    const e = ev('done', { setId: sid(0, 1) }, NOW + 3000); await applyWatchEvent(e, 2);
    expect(A().watchEvents).toHaveLength(WATCH.EVENT_LOG_MAX); expect(A().watchEvents!.at(-1)).toBe(e.eventId); expect(A().watchEvents![0]).toBe('x-31');
  });
  test('dziennik przeżywa restart telefonu: po wczytaniu zapisu to samo zdarzenie to duplicate, dane bez zmian', async () => {
    await world(); jest.setSystemTime(NOW + 5000); const e = ev('done', { setId: sid(0, 0) }, NOW + 2000); await applyWatchEvent(e, 1);
    await store.flush(); const snap = JSON.parse(JSON.stringify(saved())); await fresh(snap);
    expect(store.getState().active!.watchEvents).toEqual([e.eventId]); const before = JSON.stringify(store.getState().active);
    expect((await applyWatchEvent(e, 2)).status).toBe('duplicate'); expect(JSON.stringify(store.getState().active)).toBe(before);
    /* odhaczenie cofnięte na telefonie po restarcie: stare done z kolejki zegarka NIE odhacza serii na nowo */
    await completeSet(0, 0); expect(store.getState().active!.exercises[0].sets[0].done).toBe(false);
    expect((await applyWatchEvent(e, 3)).status).toBe('duplicate'); expect(store.getState().active!.exercises[0].sets[0].done).toBe(false);
  });
});
