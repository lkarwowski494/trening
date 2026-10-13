/*
 * lib/watch/snapshot.ts — migawka dla zegarka: czysta funkcja stanu treningu (docs/35 rozdz. 2). Fazy idle / set / rest / done, `after` (co zobaczy zegarek po
 * „Seria zrobiona”, policzone z góry), supersety, drop sety, pominięte bloki, metryki, jednostki, 35 języków, budżet rozmiaru komunikatu.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { buildSnapshot, snapshotKey, watchNow, type SnapshotCtx } from '@/lib/watch/snapshot';
import { WatchLink, snapshotBytes, type WatchTransport } from '@/lib/watch/link';
import { WATCH, WATCH_PHASES } from '@/lib/watch/protocol';
import { restCue } from '@/lib/live';
import { completeSet } from '@/lib/setFlow';
import { LANGS, applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { world, A, sid, NOW, teardownWorld } from './watch-world';

afterEach(teardownWorld);
const ctx = (o: Partial<SnapshotCtx> = {}): SnapshotCtx => ({ rev: 7, nowMs: Date.now(), rest: null, ...o });
const restOf = (): NonNullable<SnapshotCtx['rest']> => ({ on: timer.T.on, setId: timer.T.setId, endAt: timer.T.endAt, total: timer.T.total });
const snap = (o: Partial<SnapshotCtx> = {}) => buildSnapshot(A(), ctx(o));

describe('faza idle (brak treningu)', () => {
  test('wszystko puste, wersja i numer przechodzą dalej, język aplikacji', () => {
    applyLang('en');
    expect(buildSnapshot(null, ctx())).toEqual({ v: 1, kind: 'snapshot', rev: 7, lang: 'en', phase: 'idle', paused: false, workoutId: null, title: '', now: null, rest: null, after: null, doneCount: 0, totalCount: 0, toFillCount: 0 });
  });
});
describe('faza set', () => {
  test('pierwsza seria: ćwiczenie, licznik, ciężar × powtórzenia, id serii i bloku; po odhaczeniu — przerwa 90 s i zapowiedź następnej serii', async () => {
    await world(); const s = snap(); const e = A().exercises[0];
    expect(s).toMatchObject({ phase: 'set', paused: false, workoutId: A().id, title: 'Push', rest: null, doneCount: 0, totalCount: 7, toFillCount: 0, lang: 'pl' });
    expect(s.now).toEqual({ setId: sid(0, 0), blockId: e.id, title: 'Bench Press (sztanga)', counter: 'seria 1 z 3', load: '80 kg × 8', group: null, timed: false, targetSec: null });
    expect(s.after).toEqual({ restSec: 90, cue: 'Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń', last: false,
      now: { setId: sid(0, 1), blockId: e.id, title: 'Bench Press (sztanga)', counter: 'seria 2 z 3', load: '80 kg × 8', group: null, timed: false, targetSec: null } });
  });
  test('ostatnia seria bloku: `after` pokazuje następne ćwiczenie („dalej: …”) z jego przerwą', async () => {
    await world(); A().exercises[0].sets[0].done = true; A().exercises[0].sets[1].done = true;
    const s = snap(); expect(s.now!.setId).toBe(sid(0, 2)); expect(s.after).toMatchObject({ restSec: 90, cue: 'dalej: Pull Up, +10 kg, 8 powtórzeń', last: false, now: { title: 'Pull Up', counter: 'seria 1 z 2', load: '+10 kg × 8' } });
  });
  test('seria na czas: stoper i cel; pusty ciężar „—”; masa ciała bez dociążenia', async () => {
    await world(); A().exercises.slice(0, 2).forEach(e => e.sets.forEach(x => { x.done = true; }));
    expect(snap().now).toMatchObject({ title: 'Plank', counter: 'seria 1 z 2', load: '45 s', timed: true, targetSec: 45 });
    A().exercises[2].sets[0].durationSec = ''; expect(snap().now).toMatchObject({ load: '—', timed: true, targetSec: null });
    A().exercises[1].sets.forEach(x => { x.done = false; x.addKg = ''; }); A().exercises[0].sets.forEach(x => { x.done = true; });
    expect(snap().now).toMatchObject({ title: 'Pull Up', load: 'masa ciała × 8' });
  });
  test('rozgrzewka i drop set: licznik jak karta „teraz”', async () => {
    await world(); store.addSet(0, 'warmup'); store.addSet(0, 'drop');
    expect(snap().now!.counter).toBe('rozgrzewka'); const e = A().exercises[0]; e.sets.filter(x => x.kind === 'warmup').forEach(x => { x.done = true; });
    e.sets.filter(x => x.kind === 'normal').forEach(x => { x.done = true; }); expect(snap().now).toMatchObject({ counter: 'seria 3 z 3 · drop set' });
  });
  test('brak przerwy po serii, po której idzie drop set (restAfter na kopii): restSec null, zapowiedź pusta, `now` = drop set', async () => {
    await world(); store.addSet(0, 'drop'); const e = A().exercises[0]; e.sets.slice(0, 2).forEach(x => { x.done = true; });
    const s = snap(); expect(s.now!.setId).toBe(e.sets[2].id); expect(s.after).toMatchObject({ restSec: null, cue: '', last: false });
    expect(s.after!.now).toMatchObject({ counter: 'seria 3 z 3 · drop set' });
  });
  test('pauza treningu: znacznik `paused`', async () => { await world(); store.pauseWorkout(); expect(snap().paused).toBe(true); store.resumeWorkout(); expect(snap().paused).toBe(false); });
});
describe('superset', () => {
  test('środek rundy: po A1 brak przerwy (restSec null), następna seria to B1; po B1 przerwa rundy 75 s i etykieta grupy', async () => {
    await world({ ss: true }); let s = snap(); expect(s.now).toMatchObject({ title: 'Bench Press (sztanga)', group: 'SS A' });
    expect(s.after).toMatchObject({ restSec: null, cue: '', now: { title: 'Pull Up', group: 'SS A' } });
    A().exercises[0].sets[0].done = true; s = snap(); expect(s.now).toMatchObject({ title: 'Pull Up' });
    expect(s.after).toMatchObject({ restSec: 75, cue: 'Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń', now: { title: 'Bench Press (sztanga)', counter: 'seria 2 z 3' } });
  });
});
describe('faza rest', () => {
  test('po odhaczeniu: przerwa ze znacznikami, zapowiedź = podpis timera = restCue; `now` = następna seria; `after` liczone dla następnej', async () => {
    await world(); await completeSet(0, 0); const s = snap({ rest: restOf() });
    expect(s.phase).toBe('rest'); expect(s.rest).toEqual({ setId: sid(0, 0), startedAt: NOW, endsAt: NOW + 90e3, totalSec: 90, cue: 'Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń', last: false });
    expect(s.rest!.cue).toBe(timer.T.sub); expect(s.rest!.cue).toBe(restCue(A(), sid(0, 0)).text);
    expect(s.now!.setId).toBe(sid(0, 1)); expect(s.after!.now!.setId).toBe(sid(0, 2)); expect(s).toMatchObject({ doneCount: 1, totalCount: 7 });
  });
  test('przerwa po korekcie ±15 s: nowy koniec i długość w migawce', async () => {
    await world(); await completeSet(0, 0); await timer.adjust(15); const s = snap({ rest: restOf() });
    expect([s.rest!.endsAt, s.rest!.totalSec]).toEqual([NOW + 105e3, 105]);
  });
  test('przerwa minęła (koniec ≤ teraz) albo seria przerwy zniknęła albo timer wyłączony: faza set bez `rest`', async () => {
    await world(); await completeSet(0, 0); const r = restOf();
    expect(snap({ rest: r, nowMs: r.endAt }).phase).toBe('set'); expect(snap({ rest: { ...r, setId: 'nie ma' } }).rest).toBeNull();
    expect(snap({ rest: { ...r, on: false } }).phase).toBe('set'); expect(snap({ rest: { ...r, setId: null } }).phase).toBe('set');
  });
  test('po ostatniej serii treningu przerwa zostaje: faza rest, `last`, brak `now` i `after`; po jej końcu — faza done', async () => {
    await world(); A().exercises.forEach(e => e.sets.forEach(x => { x.done = true; })); A().exercises[2].sets[1].done = false;
    await completeSet(2, 1); const r = restOf(); const s = snap({ rest: r });
    expect(s).toMatchObject({ phase: 'rest', now: null, after: null, doneCount: 7, totalCount: 7, rest: { last: true, cue: 'nic więcej do zrobienia' } });
    expect(snap({ rest: r, nowMs: r.endAt + 1 })).toMatchObject({ phase: 'done', rest: null, now: null });
  });
  test('ostatnia seria bez przerwy zerowej: `after` ostatniej serii ma last i brak następnej', async () => {
    await world(); A().exercises.forEach(e => e.sets.forEach(x => { x.done = true; })); A().exercises[2].sets[1].done = false;
    expect(snap().after).toMatchObject({ restSec: 90, cue: 'nic więcej do zrobienia', last: true, now: null });
  });
});
describe('liczniki i pominięcia', () => {
  test('doneCount / totalCount / toFillCount; pominięty blok wypada z `total` (odhaczone serie zostają)', async () => {
    await world(); A().exercises[0].sets[0].done = true; A().exercises[0].sets[0].toFill = true; A().exercises[0].sets[1].done = true;
    expect(snap()).toMatchObject({ doneCount: 2, totalCount: 7, toFillCount: 1 });
    store.skipExercise(A().exercises[1].id); expect(snap()).toMatchObject({ doneCount: 2, totalCount: 5 });
    store.skipExercise(A().exercises[0].id); expect(snap()).toMatchObject({ doneCount: 2, totalCount: 4 }); /* 2 odhaczone + 2 deski */
    expect(snap().now).toMatchObject({ title: 'Plank' });
  });
  test('wszystkie bloki pominięte albo skończone: faza done', async () => {
    await world(); A().exercises.forEach(e => store.skipExercise(e.id)); expect(snap()).toMatchObject({ phase: 'done', now: null, after: null });
  });
  test('ćwiczenie usunięte z biblioteki nie liczy się', async () => {
    await world(); const id = A().exercises[1].exerciseId; const lib = store.getState().exercises; const i = lib.findIndex(x => x.id === id); const keep = lib.splice(i, 1)[0];
    expect(snap().totalCount).toBe(5); lib.splice(i, 0, keep);
  });
});
describe('teksty: jednostki, nazwy, język', () => {
  test('funty: ciężar w migawce w lb (jak karta „teraz”)', async () => { await world(); applyUnit('lb'); expect(snap().now!.load).toBe('176,4 lb × 8'); expect(snap().after!.cue).toBe('Bench Press (sztanga) · seria 2, 176,4 lb, 8 powtórzeń'); });
  test('długie nazwy są skracane z „…” bez rozcinania pary zastępczej; limity pól', async () => {
    await world(); A().templateName = 'Ż'.repeat(100); const e = store.getState().exercises.find(x => x.id === A().exercises[0].exerciseId)!; const old = e.name; e.name = '😀'.repeat(80); (e as { lib?: boolean }).lib = false;
    const s = snap(); expect(Array.from(s.title)).toHaveLength(WATCH.TITLE_MAX); expect(s.title.endsWith('…')).toBe(true); expect(Array.from(s.now!.title)).toHaveLength(WATCH.TITLE_MAX); expect(s.now!.title).not.toMatch(/[\ud800-\udbff]$/);
    expect(Array.from(s.after!.cue).length).toBeLessThanOrEqual(WATCH.CUE_MAX); e.name = old;
  });
  test('nazwa treningu pusta → „Trening” w języku aplikacji', async () => { await world(); A().templateName = ''; expect(snap().title).toBe('Trening'); applyLang('en'); expect(snap().title).toBe('Workout'); });
  test.each(LANGS.map(l => [l]))('język %s: migawka ma lang, teksty bez {…}, licznik i zapowiedź niepuste, mieści się w budżecie', async l => {
    await world(); await completeSet(0, 0); applyLang(l); const s = snap({ rest: restOf() });
    expect(s.lang).toBe(l); expect(s.phase).toBe('rest'); expect(s.now!.counter).not.toBe(''); expect(JSON.stringify(s)).not.toMatch(/\{[a-z]+\}/);
    expect(s.rest!.cue.length).toBeGreaterThan(0); expect(snapshotBytes(s)).toBeLessThanOrEqual(WATCH.MSG_MAX_BYTES);
  });
  test('najgorszy przypadek rozmiaru: superset, długie nazwy, rozgrzewka i drop — nadal w budżecie', async () => {
    await world({ ss: true }); A().templateName = 'W'.repeat(100);
    for (const e of A().exercises) { const x = store.getState().exercises.find(y => y.id === e.exerciseId)!; (x as { lib?: boolean }).lib = false; x.name = 'Ą'.repeat(100); }
    store.addSet(0, 'warmup'); store.addSet(0, 'drop'); expect(snapshotBytes(snap())).toBeLessThanOrEqual(WATCH.MSG_MAX_BYTES);
  });
  test('faza zawsze z listy WATCH_PHASES', async () => { await world(); expect(WATCH_PHASES).toContain(snap().phase); expect(WATCH_PHASES).toContain(buildSnapshot(null, ctx()).phase); });
});
describe('snapshotKey i watchNow', () => {
  test('klucz ignoruje numer wersji, ale reaguje na zmianę treści', async () => {
    await world(); expect(snapshotKey(snap({ rev: 1 }))).toBe(snapshotKey(snap({ rev: 99 }))); const k0 = snapshotKey(snap()); A().exercises[0].sets[0].weight = 82.5; const k1 = snapshotKey(snap()); expect(k1).not.toBe(k0);
    A().exercises[0].sets[0].weight = 85; expect(snapshotKey(snap())).not.toBe(k1); expect(snapshotKey(snap({ nowMs: Date.now() + 5000 }))).toBe(snapshotKey(snap()));
  });
  test('watchNow: pozycja poza treningiem albo ćwiczenie spoza biblioteki → null', async () => { await world(); expect(watchNow(A(), { ei: 9, si: 0 })).toBeNull(); expect(watchNow(A(), { ei: 0, si: 9 })).toBeNull(); expect(watchNow(A(), { ei: 0, si: 0 })).not.toBeNull(); });
});

describe('WatchLink.snapshot: numer wersji rośnie tylko przy zmianie treści', () => {
  const mk = () => { const sent: unknown[] = []; const tr: WatchTransport = { send: m => { sent.push(m); }, onMessage: () => () => {}, reachable: () => true }; return { sent, link: new WatchLink(tr, () => Date.now()) }; };
  test('push bez zmiany nic nie wysyła; zmiana ciężaru podnosi rev; force wysyła tę samą treść z tym samym rev', async () => {
    await world(); const { sent, link } = mk(); const a = link.push(); expect(a!.rev).toBe(1); expect(link.push()).toBeNull(); expect(sent).toHaveLength(1);
    A().exercises[0].sets[0].weight = 82.5; const b = link.push(); expect(b!.rev).toBe(2); expect(b!.now!.load).toBe('82,5 kg × 8');
    const c = link.push(true); expect(c!.rev).toBe(2); expect(sent).toHaveLength(3); link.stop();
  });
});
