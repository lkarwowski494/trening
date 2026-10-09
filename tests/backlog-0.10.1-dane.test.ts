/*
 * Backlog audytu kontrolnego 1 (09.10.2026), obszary DAT/LOG/X/LIVE — testy regresji logiki (0.10.1). Każdy test odtwarza dowód audytora
 * (raporty audytu kontrolnego 1, docs/25 „Audyt kontrolny 1”) i sprawdza poprawne zachowanie. Ekrany: tests/backlog-0.10.1-dane-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, addWorkout } from './helpers';
import { sessionsFor } from '@/lib/stats';
import { periodSummary } from '@/lib/period';
import * as edit from '@/lib/edit';
import { addLocation, duplicateLocation } from '@/lib/locations';
import { parseBackup } from '@/lib/backup';
import * as draft from '@/lib/draft';
import type { Template, Exercise } from '@/lib/seed';

describe('LIVE2-04: staleBody na zegarze strefy startu', () => {
  test('LIVE2-04: z tz godziny przeliczone wallTs; bez tz (dane sprzed J3) — strefa bieżąca jak dotąd', async () => {
    await fresh(); const at = new Date(2026, 9, 9, 10, 0).getTime(); const tz = -new Date(at).getTimezoneOffset() + 120;
    const w = store.fmtTime(store.wallTs({ startedAt: at, tzOffsetMin: tz }));
    expect(w).not.toBe(store.fmtTime(at));
    expect(timer.staleBody('work', at, true, at, tz)).toBe(`Ostatnia seria o ${w}. Zakończyć trening z tą godziną końca?\nTrening w pauzie od ${w}.`);
    expect(timer.staleBody('none', at, false, null, tz)).toBe(`Trening rozpoczęty o ${w}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić.`);
    expect(timer.staleBody('work', at, false, null, undefined)).toBe(timer.staleBody('work', at));
  });
});

describe('DAT2-04 (= DAT-08): import z powtórzonym id miejsca albo zapisanego planu nie gubi drugiego wpisu (reguła „~n” jak uniqueIds)', () => {
  test('DAT2-04: dwa miejsca o tym samym id → oba zostają, drugie z id „~2”; dwa plany o id „p” → oba; migrate idempotentne', async () => {
    await fresh(); addLocation('gym', 'Siłownia'); addLocation('home', 'Dom');
    const st = JSON.parse(JSON.stringify(store.getState())); const id0 = st.settings.locations[0].id; st.settings.locations[1].id = id0;
    st.savedPlans = [{ id: 'p', name: 'A', days: [] }, { id: 'p', name: 'B', days: [] }];
    const r = parseBackup(JSON.stringify({ format: 'trening-backup', schemaVersion: 17, state: st }));
    expect(r.settings.locations.map(l => [l.id, l.name])).toEqual([[id0, 'Siłownia'], [`${id0}~2`, 'Dom']]);
    expect(r.settings.mainLocationId).toBe(id0);
    expect((r.savedPlans ?? []).map(p => [p.id, p.name])).toEqual([['p', 'A'], ['p~2', 'B']]);
    const again = store.migrate(JSON.parse(JSON.stringify(r))); expect(again.settings.locations).toEqual(r.settings.locations); expect(again.savedPlans).toEqual(r.savedPlans);
  });
  test('DAT2-04: id „~2” już zajęte → „~3”', async () => {
    await fresh(); addLocation('gym', 'A'); addLocation('home', 'B'); addLocation('hotel', 'C');
    const st = JSON.parse(JSON.stringify(store.getState())); const L = st.settings.locations; const id0 = L[0].id; L[1].id = id0; L[2].id = `${id0}~2`;
    L.push({ ...L[2], id: id0, name: 'D' });
    const r = store.migrate(st); expect(r.settings.locations.map(l => l.id.replace(id0, 'x'))).toEqual(['x', 'x~3', 'x~2', 'x~4']);
  });
});

describe('LOG-16 (= LOG2-04): nazwa miejsca po dopisku „(kopia)” albo numeru nie przekracza NAME_MAX', () => {
  test('LOG-16: duplikat miejsca z nazwą 80 znaków ≤ 80 i z dopiskiem „(kopia)”; druga kopia z numerem; to samo przy dodaniu miejsca o tej samej nazwie', async () => {
    await fresh(); const long = 'x'.repeat(store.NAME_MAX);
    const a = addLocation('gym', long); const c1 = duplicateLocation(a.id)!; const c2 = duplicateLocation(a.id)!;
    const b = addLocation('gym', long); const b3 = addLocation('gym', long);
    for (const l of [a, c1, c2, b, b3]) expect(l.name.length).toBeLessThanOrEqual(store.NAME_MAX);
    expect(c1.name.endsWith(' (kopia)')).toBe(true); expect(c2.name.endsWith(' (kopia) 2')).toBe(true); expect(b.name.endsWith(' 2')).toBe(true); expect(b3.name.endsWith(' 3')).toBe(true);
    expect(new Set([a, c1, c2, b, b3].map(l => l.name)).size).toBe(5);
    const s = addLocation('gym', 'Dom'); const s2 = addLocation('gym', 'Dom'); expect([s.name, s2.name]).toEqual(['Dom', 'Dom 2']); expect(duplicateLocation(s.id)!.name).toBe('Dom (kopia)');
  });
});

describe('X2-02: Postępy i rekordy okresu pokazują dzień na zegarze strefy startu (wallTs, J3) — jak Historia i Kalendarz', () => {
  afterEach(() => { jest.useRealTimers(); });
  test('X2-02: trening nd. 4.10 20:00 zapisany w strefie +10 h (pon. 5.10 06:00) → sesja Postępów i rekord tygodnia 5–11.10 z datą 5.10', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 9, 12, 0).getTime() }); await fresh();
    const at = new Date(2026, 9, 4, 20, 0).getTime();
    addWorkout(new Date(2026, 9, 1, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const w = addWorkout(at, [['Back Squat', [{ weight: 120, reps: 5 }]]]); w.tzOffsetMin = store.tzOffsetAt(at) + 600; store.save();
    const day = (ts: number) => store.localISODate(new Date(ts));
    expect(store.workoutDay(w)).toBe('2026-10-05');
    const s = sessionsFor(ex('Back Squat')).find(x => x.workout.id === w.id)!;
    expect(day(s.shown)).toBe('2026-10-05'); expect(s.date).toBe(at); /* porównania „before” dalej po prawdziwej chwili */
    const ps = periodSummary('week', 0, new Date(2026, 9, 9, 12, 0)); const pr = ps.prs.find(p => p.workoutId === w.id)!;
    expect(ps.workouts).toBe(1); expect(pr).toBeTruthy(); expect(day(pr.at)).toBe('2026-10-05'); expect(pr.at).toBeGreaterThanOrEqual(ps.start);
    /* dane bez strefy (sprzed J3): jak dotąd */
    delete w.tzOffsetMin; store.save(); expect(sessionsFor(ex('Back Squat')).find(x => x.workout.id === w.id)!.shown).toBe(at);
  });
});

describe('LOG2-03: edycja daty treningu na dzień z inną porą czasu (lato → zima) nie przesuwa prawdziwej chwili startu', () => {
  /* Strefa testów: Europe/Warsaw (tests/global-setup.js) — lipiec +120, styczeń +60. W strefie bez zmiany czasu przypadek się nie zdarza (test sprawdza wtedy to samo). */
  const NOW = new Date(2026, 9, 9, 12, 0).getTime();
  test('LOG2-03: trening 10.07 10:00 (strefa telefonu z chwili startu) → data 10.01, godzina 10:00 → start 10.01 10:00 czasu lokalnego, strefa z nowej daty', async () => {
    await fresh(); const at = new Date(2026, 6, 10, 10, 0).getTime();
    const w = addWorkout(at, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.tzOffsetMin = store.tzOffsetAt(at); store.save();
    const d = edit.beginEdit(w.id)!; expect([d.date, d.time]).toEqual(['2026-07-10', '10:00']);
    edit.draftSetWhen(d.key, { date: '2026-01-10' }); const r = edit.commitDraft(w.id, NOW);
    expect('w' in r).toBe(true); if (!('w' in r)) return;
    const jan = new Date(2026, 0, 10, 10, 0).getTime();
    expect(r.w.startedAt).toBe(jan); expect(r.w.tzOffsetMin).toBe(store.tzOffsetAt(jan)); expect(store.wallTs(r.w)).toBe(jan);
    expect(edit.timeText(store.wallTs(r.w))).toBe('10:00');
  });
  test('LOG2-03: trening z podróży (strefa startu ≠ strefa telefonu) — zmiana daty liczy dalej na zegarze strefy startu, strefa bez zmian', async () => {
    await fresh(); const at = new Date(2026, 6, 10, 10, 0).getTime(); const tz = store.tzOffsetAt(at) + 300;
    const w = addWorkout(at, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.tzOffsetMin = tz; store.save();
    const d = edit.beginEdit(w.id)!; edit.draftSetWhen(d.key, { date: '2026-01-10' }); const r = edit.commitDraft(w.id, NOW);
    expect('w' in r).toBe(true); if (!('w' in r)) return;
    expect(r.w.tzOffsetMin).toBe(tz); expect(edit.timeText(store.wallTs(r.w))).toBe(d.time); expect(edit.dateText(store.wallTs(r.w))).toBe('2026-01-10');
  });
});

const addItem = (tpl: Template, e: Exercise) => { tpl.items.push({ id: Math.random().toString(36).slice(2), exerciseId: e.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl); };

describe('UX2-03 = DAT2-06: szkic edycji szablonu i ćwiczenia przeżywa zamknięcie aplikacji przez iOS (osobny klucz bazy, przywracany po starcie)', () => {
  /** „Zabicie” aplikacji i ponowny start na tej samej bazie (pamięć — w tym mapa szkiców — znika; zostaje tylko to, co zapisane). */
  const restart = async () => { const kv = new Map(global.__kv); store.__resetForTests(); draft.__resetObjDrafts(); global.__kv.clear(); kv.forEach((v, k) => global.__kv.set(k, v)); await store.init(); return draft.restoreObjDrafts(); };
  const tick = async () => { await jest.advanceTimersByTimeAsync(400); for (let i = 0; i < 10; i++) await Promise.resolve(); };
  beforeEach(() => { jest.useFakeTimers({ now: new Date(2026, 9, 9, 12, 0).getTime() }); });
  afterEach(() => { jest.useRealTimers(); });
  test('UX2-03: szablon 9 → 10 ćwiczeń w szkicu, aplikacja zabita (bez „Zapisz”) → po starcie szkic wraca (10), szablon w stanie bez zmian (9); szkic do pytania', async () => {
    await fresh(); const tpl = store.newTemplate(); tpl.name = 'Push'; for (const e of store.getState().exercises.filter(x => x.lib).slice(0, 9)) addItem(tpl, e);
    store.save(tpl); await store.flush(); const n0 = tpl.items.length; expect(n0).toBe(9);
    const d = draft.beginObjDraft<Template>('template', tpl.id)!; addItem(d, store.getState().exercises.filter(x => x.lib)[20]); d.name = 'Push+'; store.save(d); await tick();
    expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(true);
    const r = await restart();
    expect(store.getState().templates.find(x => x.id === tpl.id)!.items).toHaveLength(n0);
    expect(r).toEqual([{ kind: 'template', id: tpl.id, name: 'Push+', isNew: false }]);
    const d2 = draft.objDraft<Template>('template', tpl.id)!; expect(d2.items).toHaveLength(n0 + 1); expect(draft.objDirty('template', tpl.id)).toBe(true);
    expect(draft.commitObjDraft('template', tpl.id)).toBe(true); await tick(); await store.flush();
    expect(store.getState().templates.find(x => x.id === tpl.id)!.items).toHaveLength(n0 + 1); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
    expect(await restart()).toEqual([]);
  });
  test('UX2-03: ćwiczenie — szkic przywrócony; „Odrzuć” (discardObjDraft) usuwa szkic także z bazy; szkic bez zmian nie pyta', async () => {
    await fresh(); const e = ex('Back Squat'); const d = draft.beginObjDraft<Exercise>('exercise', e.id)!; d.notes = 'kolana na zewnątrz'; store.save(d); await tick();
    expect(await restart()).toEqual([{ kind: 'exercise', id: e.id, name: e.name, isNew: false }]); expect(draft.objDraft<Exercise>('exercise', e.id)!.notes).toBe('kolana na zewnątrz');
    expect(ex('Back Squat').notes).not.toBe('kolana na zewnątrz');
    draft.discardObjDraft('exercise', e.id); await tick(); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false); expect(await restart()).toEqual([]);
    draft.beginObjDraft('exercise', e.id); await tick(); expect(await restart()).toEqual([]); expect(draft.objDraft('exercise', e.id)).toBeUndefined(); /* bez zmian — nic do przywrócenia */
  });
  test('UX2-03: szkic zapisany przy wyjściu do tła (flush) bez czekania na opóźniony zapis', async () => {
    await fresh(); const e = ex('Back Squat'); const d = draft.beginObjDraft<Exercise>('exercise', e.id)!; d.notes = 'x'; store.save(d); await store.flush();
    expect(JSON.parse(global.__kv.get(draft.DRAFTS_KEY)!).items[0].obj.notes).toBe('x');
  });
  test('UX2-03: zapis szkicu nie trafia do stanu, kopii ani „cfg” (bez zmiany schematu); uszkodzony klucz szkiców — start bez szkiców', async () => {
    await fresh(); const e = ex('Back Squat'); const d = draft.beginObjDraft<Exercise>('exercise', e.id)!; d.notes = 'tajne'; store.save(d); await tick(); await store.flush();
    expect(global.__kv.get('state')).not.toContain('tajne'); expect(global.__kv.get('cfg') ?? '').not.toContain('tajne');
    global.__kv.set(draft.DRAFTS_KEY, '{nie json'); expect(await restart()).toEqual([]);
    global.__kv.set(draft.DRAFTS_KEY, JSON.stringify({ v: 1, items: [{ kind: 'template', id: 'nie-ma', obj: { id: 'nie-ma', name: 'X', items: [] }, orig: '' }, { kind: 'zly', id: e.id, obj: {}, orig: '' }] })); expect(await restart()).toEqual([]);
  });
  test('UX2-03: przywrócony szkic przechodzi porządkowanie jak import (pozycja z nieistniejącym ćwiczeniem odpada, nazwa przycięta)', async () => {
    await fresh(); const tpl = store.newTemplate(); tpl.name = 'A'; addItem(tpl, ex('Back Squat')); store.save(tpl); await store.flush();
    const d = draft.beginObjDraft<Template>('template', tpl.id)!; d.name = 'B'; store.save(d); await tick();
    const raw = JSON.parse(global.__kv.get(draft.DRAFTS_KEY)!); raw.items[0].obj.items.push({ ...raw.items[0].obj.items[0], id: 'zz', exerciseId: 'nie-ma' }); raw.items[0].obj.name = 'y'.repeat(200); global.__kv.set(draft.DRAFTS_KEY, JSON.stringify(raw));
    await restart(); const d2 = draft.objDraft<Template>('template', tpl.id)!; expect(d2.items.map(i => i.exerciseId)).toEqual([ex('Back Squat').id]); expect(d2.name.length).toBeLessThanOrEqual(store.NAME_MAX);
  });
});

describe('UX2-12: pusty „Nowy szablon” / „Nowe ćwiczenie” po zabiciu aplikacji w trakcie tworzenia nie zostaje na liście', () => {
  const restart = async () => { const kv = new Map(global.__kv); store.__resetForTests(); draft.__resetObjDrafts(); global.__kv.clear(); kv.forEach((v, k) => global.__kv.set(k, v)); await store.init(); return draft.restoreObjDrafts(); };
  const tick = async () => { await jest.advanceTimersByTimeAsync(400); for (let i = 0; i < 10; i++) await Promise.resolve(); };
  beforeEach(() => { jest.useFakeTimers({ now: new Date(2026, 9, 9, 12, 0).getTime() }); });
  afterEach(() => { jest.useRealTimers(); });
  test('UX2-12: „+ Nowy” szablon i „+ Nowe” ćwiczenie bez zmian (szkic nowego obiektu) → po starcie oba usunięte, bez pytania', async () => {
    await fresh(); const tpl = store.newTemplate(); const e = store.newExercise(); draft.beginObjDraft('template', tpl.id, { isNew: true }); draft.beginObjDraft('exercise', e.id, { isNew: true }); await tick(); await store.flush();
    expect(await restart()).toEqual([]);
    expect(store.getState().templates.some(x => x.id === tpl.id)).toBe(false); expect(store.getState().exercises.some(x => x.id === e.id)).toBe(false);
    await store.flush(); expect(global.__kv.get('state')).not.toContain(tpl.id);
  });
  test('UX2-12: zabicie, zanim szkic trafił do bazy — pusty, nietknięty obiekt o domyślnej nazwie sprzątany przy starcie (dane z 0.10.0 też)', async () => {
    await fresh(); const tpl = store.newTemplate(); const e = store.newExercise(); await store.flush(); global.__kv.delete(draft.DRAFTS_KEY);
    expect(await restart()).toEqual([]); expect(store.getState().templates.some(x => x.id === tpl.id)).toBe(false); expect(store.getState().exercises.some(x => x.id === e.id)).toBe(false);
  });
  test('UX2-12: nowy szablon ze zmienionym szkicem — wraca do edycji (isNew) i NIE jest usuwany; po „Zapisz” zostaje na stałe', async () => {
    await fresh(); const tpl = store.newTemplate(); const d = draft.beginObjDraft<Template>('template', tpl.id, { isNew: true })!; d.name = 'Nogi'; addItem(d, ex('Back Squat')); store.save(d); await tick(); await store.flush();
    expect(await restart()).toEqual([{ kind: 'template', id: tpl.id, name: 'Nogi', isNew: true }]);
    expect(store.getState().templates.some(x => x.id === tpl.id)).toBe(true);
    draft.commitObjDraft('template', tpl.id, { keepNew: true }); await tick(); await store.flush();
    expect(await restart()).toEqual([]); expect(store.getState().templates.find(x => x.id === tpl.id)!.name).toBe('Nogi');
  });
  test('UX2-12: nie rusza obiektów zmienionych albo z inną nazwą: zapisany pusty szablon (UI2-05), własne ćwiczenie z 1002 nigdy nieedytowane, ćwiczenie w szablonie', async () => {
    await fresh(); const kept = store.newTemplate(); draft.beginObjDraft('template', kept.id, { isNew: true }); draft.commitObjDraft('template', kept.id, { keepNew: true });
    const own = store.newExercise('Mój wykrok'); const used = store.newExercise(); const tpl = store.newTemplate(); tpl.name = 'T'; addItem(tpl, used); store.save(tpl);
    await tick(); await store.flush(); await restart();
    const st = store.getState(); expect(st.templates.some(x => x.id === kept.id)).toBe(true); expect(st.exercises.some(x => x.id === own.id)).toBe(true); expect(st.exercises.some(x => x.id === used.id)).toBe(true);
  });
  test('UX2-12: „Odrzuć zmiany” w pytaniu po starcie (dropRestored) — nowy obiekt znika, istniejący zostaje bez zmian', async () => {
    await fresh(); const tpl = store.newTemplate(); const d = draft.beginObjDraft<Template>('template', tpl.id, { isNew: true })!; d.name = 'Nogi'; store.save(d);
    const e = ex('Back Squat'); const de = draft.beginObjDraft<Exercise>('exercise', e.id)!; de.notes = 'x'; store.save(de); await tick(); await store.flush();
    const r = await restart(); expect(r.map(x => x.kind).sort()).toEqual(['exercise', 'template']);
    for (const x of r) draft.dropRestored(x);
    expect(store.getState().templates.some(x => x.id === tpl.id)).toBe(false); expect(ex('Back Squat').notes).not.toBe('x'); await tick(); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
  });
});
