/*
 * Audyt 0.10.0 (08.10.2026), obszar LIVE — testy regresji na poziomie logiki (decyzje właściciela 08.10.2026: „naprawiamy wszystko”, rekomendacje
 * z docs/25 i raportów źródłowych). Każdy test odtwarza błąd z dowodu audytora (zz-audit-live-*, zz-audit-mer-deload, zz-audit-log-a) i sprawdza
 * poprawne zachowanie. Ekrany: tests/audit-0.10-live.test.tsx.
 */
import * as store from '@/lib/store';
import { restLabel, setLabel, setMarkOf, nowParts, focusCounter } from '@/lib/live';
import { deloadCounts, repeatCounts, deloadLessText, startRepeatLast } from '@/lib/start';
import { deloadKeep } from '@/lib/deload';
import { beginEdit, draftSetWhen, checkDraft, commitDraft, activeEnd } from '@/lib/edit';
import { applyUnit } from '@/lib/units';
import { nearestLoad } from '@/lib/equipvis';
import { fresh, ex, addWorkout, saved } from './helpers';
import { buildBackup, parseBackup } from '@/lib/backup';
import type { SetKind, Workout } from '@/lib/seed';

const S = () => store.getState();
afterEach(() => { applyUnit('kg'); });

/** Trening w toku z ćwiczeniami `names` (po `n` serii), opcjonalnie wszystkie w jednym supersecie. */
async function live(names: string[], n = 1, group = false) {
  await fresh(); store.startEmpty(); names.forEach(x => store.addExerciseToActive(ex(x)));
  names.forEach((_, i) => { for (let k = 1; k < n; k++) store.addSet(i); });
  const a = S().active!; if (group) for (let i = 0; i + 1 < names.length; i++) store.linkWithNext(a.exercises, i, a);
  return a;
}
/** Kolejność karty „teraz”: focusSet → odhaczenie (toggleDone, jak przycisk karty); „(p)” = po serii startuje przerwa. */
function order(a: Workout, tags: string[]) {
  const out: string[] = [];
  for (let i = 0; i < 30; i++) { const p = store.focusSet(a); if (!p) break; const lbl = setLabel(a.exercises[p.ei], p.si); const r = store.toggleDone(p.ei, p.si); out.push(`${tags[p.ei]}${lbl}${r ? '(p)' : ''}`); }
  return out.join(' ');
}

describe('F1 (LIVE-01): superset i „Pomiń dziś” — pominięty blok nie wstrzymuje przerw drugiego ćwiczenia', () => {
  test('F1 (LIVE-01): SS A+B (3+3), A1, B1, „Pomiń dziś” B → po A2 i A3 przerwa (roundRest z ostatniego niepominiętego = A)', async () => {
    const a = await live(['Bench Press (sztanga)', 'Back Squat'], 3, true); a.exercises[0].restSec = 70; a.exercises[1].restSec = 150;
    expect(store.toggleDone(0, 0)).toBeNull(); expect(store.toggleDone(1, 0)).toBe(150); /* runda zamknięta przez B — przerwa rundy (B ostatni w grupie) */
    store.skipExercise(a.exercises[1].id);
    expect(store.roundRest(0)).toBe(70); /* ostatni NIEPOMINIĘTY członek grupy */
    expect(store.toggleDone(0, 1)).toBe(70); expect(store.toggleDone(0, 2)).toBe(70);
  });
  test('F1 (LIVE-01): SS A+B+C, B pominięty od początku → A1 bez przerwy (C zaległe), C1 zamyka rundę z przerwą C', async () => {
    const a = await live(['Bench Press (sztanga)', 'Back Squat', 'Pull Up'], 2, true); a.exercises.forEach((e, i) => { e.restSec = 60 + i * 10; });
    store.skipExercise(a.exercises[1].id);
    expect(store.toggleDone(0, 0)).toBeNull(); expect(store.toggleDone(2, 0)).toBe(80);
    expect(store.toggleDone(0, 1)).toBeNull(); expect(store.toggleDone(2, 1)).toBe(80);
  });
  test('F1 (LIVE-01): pominięty ostatni członek z rozgrzewką nie blokuje przerwy po rozgrzewce i serii A; „Przywróć” wraca do rund', async () => {
    const a = await live(['Bench Press (sztanga)', 'Back Squat'], 2, true); a.exercises[0].restSec = 70; a.exercises[1].restSec = 150; store.addSet(0, 'warmup');
    ex('Bench Press (sztanga)').restWarmupSec = null as never;
    store.skipExercise(a.exercises[1].id);
    expect(store.toggleDone(0, 0)).toBe(70); /* rozgrzewka A: żaden zaległy członek za A (B pominięty) */
    expect(store.toggleDone(0, 1)).toBe(70);
    store.unskipExercise(a.exercises[1].id); expect(store.roundRest(0)).toBe(150); expect(store.toggleDone(0, 2)).toBeNull(); /* B znów w rundzie: A2 przed B1 */
  });
});

describe('F2 (LIVE-02): kolejność karty „teraz” w supersecie — po liczbie odhaczonych serii roboczych, rozgrzewka członka przed jego pierwszą serią roboczą', () => {
  const ss = async (warmA: boolean, warmB: boolean) => {
    const a = await live(['Bench Press (sztanga)', 'Pull Up'], 3, true); if (warmA) store.addSet(0, 'warmup'); if (warmB) store.addSet(1, 'warmup');
    ex('Bench Press (sztanga)').restWarmupSec = null as never; ex('Pull Up').restWarmupSec = null as never; return a;
  };
  test('F2 (LIVE-02): bez rozgrzewek — A1, B1, A2, B2…; przerwa po każdej rundzie (po B)', async () => {
    expect(order(await ss(false, false), ['A', 'B'])).toBe('A1 B1(p) A2 B2(p) A3 B3(p)');
  });
  test('F2 (LIVE-02): rozgrzewka w A — AW, A1, B1…; przerwy przy B (audyt: AW → B1 → A1(przerwa))', async () => {
    expect(order(await ss(true, false), ['A', 'B'])).toBe('AW A1 B1(p) A2 B2(p) A3 B3(p)');
  });
  test('F2 (LIVE-02): rozgrzewka w B — A1, BW, B1… (audyt: A1 → BW → A2 → B1(przerwa))', async () => {
    expect(order(await ss(false, true), ['A', 'B'])).toBe('A1 BW B1(p) A2 B2(p) A3 B3(p)');
  });
  test('F2 (LIVE-02): rozgrzewki w obu — AW, A1, BW, B1…', async () => {
    expect(order(await ss(true, true), ['A', 'B'])).toBe('AW A1 BW B1(p) A2 B2(p) A3 B3(p)');
  });
  test('F2 (LIVE-02): drop set należy do rundy swojej serii — zaraz po niej, przed B1 (etykiety wierszy: 1, 1D, 2)', async () => {
    const a = await live(['Bench Press (sztanga)', 'Pull Up'], 2, true); store.addSet(0, 'drop'); /* A: 1, 2, D → przenosimy drop za serię 1 */
    const A = a.exercises[0]; A.sets = [A.sets[0], A.sets[2], A.sets[1]];
    expect(order(a, ['A', 'B'])).toBe('A1 A1D B1(p) A2 B2(p)');
  });
  test('F2 (LIVE-02): blok rozdzielony zamianą (A z odhaczoną serią + zamiennik) liczy serie jak jeden członek — po A1 i zamianie najpierw C1', async () => {
    const a = await live(['Bench Press (sztanga)', 'Pull Up'], 3, true);
    store.toggleDone(0, 0); const r = store.swapBlock(a.exercises[0].id, ex('Bench Press (hantle)').id); expect(r).toBeTruthy();
    expect(a.exercises.map(e => e.sets.length)).toEqual([1, 2, 3]);
    expect(store.focusSet(a)).toEqual({ ei: 2, si: 0 }); /* runda 1 członka C, nie runda 2 zamiennika */
    expect(order(a, ['A', 'A′', 'C'])).toBe('C1(p) A′1 C2(p) A′2 C3(p)');
  });
  test('F2: focusSet(w, assumeDone) — stan po odhaczeniu wskazanej serii (wspólne dla karty i podpisu przerwy)', async () => {
    const a = await live(['Bench Press (sztanga)'], 2);
    expect(store.focusSet(a)).toEqual({ ei: 0, si: 0 }); expect(store.focusSet(a, a.exercises[0].sets[0].id)).toEqual({ ei: 0, si: 1 });
    expect(store.focusSet(a, a.exercises[0].sets[1].id)).toEqual({ ei: 0, si: 0 }); expect(store.focusSet(null)).toBeNull();
  });
});

describe('F5 (LIVE-04): podpis przerwy (Live Activity) według tej samej reguły co karta „teraz”', () => {
  test('F5 (LIVE-04): pominięty Back Squat → „dalej: Plank” (audyt: „dalej: Back Squat”, a karta na Planku)', async () => {
    const a = await live(['Bench Press (sztanga)', 'Back Squat', 'Plank']); store.skipExercise(a.exercises[1].id);
    expect(restLabel(a, 0, 0)).toEqual({ sub: 'dalej: Plank', last: false });
    a.exercises[0].sets[0].done = true; expect(store.focusSet(a)).toEqual({ ei: 2, si: 0 });
  });
  test('F5 (LIVE-04): wcześniejsze ćwiczenie nieodhaczone → podpis wskazuje je, jak karta (audyt: „dalej: Leg Press”)', async () => {
    const a = await live(['Bench Press (sztanga)', 'Back Squat', 'Leg Press']);
    expect(restLabel(a, 1, 0)).toEqual({ sub: 'dalej: Bench Press (sztanga)', last: false });
    a.exercises[1].sets[0].done = true; expect(restLabel(a, 2, 0)).toEqual({ sub: 'dalej: Bench Press (sztanga)', last: false }); /* audyt: nazwa właśnie zrobionego */
  });
  test('F5 (LIVE-04): następna seria tego samego ćwiczenia / supersetu — „nazwa · seria n”', async () => {
    const a = await live(['Bench Press (sztanga)', 'Pull Up'], 2, true);
    expect(restLabel(a, 0, 0)).toEqual({ sub: 'Pull Up · seria 1', last: false });
    a.exercises[0].sets[0].done = true; expect(restLabel(a, 1, 0)).toEqual({ sub: 'Bench Press (sztanga) · seria 2', last: false });
  });
  test('F5 (LIVE-04, decyzja B): po ostatniej serii treningu — przerwa zostaje, podpis „nic więcej do zrobienia” (last)', async () => {
    const a = await live(['Bench Press (sztanga)', 'Plank'], 1); a.exercises[0].sets[0].done = true;
    expect(restLabel(a, 1, 0)).toEqual({ sub: 'nic więcej do zrobienia', last: true });
    store.skipExercise(a.exercises[1].id); expect(restLabel(a, 0, 0)).toEqual({ sub: 'nic więcej do zrobienia', last: true }); /* reszta tylko pominięta */
    expect(restLabel(a, 7, 0)).toEqual({ sub: '', last: false });
  });
});

describe('F9 (UI-10 / LIVE-14, wariant A): duża liczba na karcie — jednostka przy ciężarze, licznik bez drop setów', () => {
  test('F9 (UI-10): nowParts — „80 kg × 8”, „20 kg × 45s”, „+10 kg × 8”, „masa ciała × 8”, „5000 m · 25:00”, puste pola „—”', async () => {
    await fresh(); const j = (p: { num: string; unit: string; tail: string }) => `${p.num}${p.unit ? ' ' + p.unit : ''}${p.tail}`;
    const s = (p: object) => ({ ...store.emptySet(), ...p });
    expect(j(nowParts(ex('Bench Press (sztanga)'), s({ weight: 80, reps: 8 })))).toBe('80 kg × 8');
    expect(nowParts(ex('Bench Press (sztanga)'), s({ weight: 80, reps: 8 }))).toEqual({ num: '80', unit: 'kg', tail: ' × 8' });
    expect(j(nowParts(ex('Bench Press (sztanga)'), s({})))).toBe('— × —');
    const wt = ex('Back Squat'); wt.metric = 'weight_time'; expect(j(nowParts(wt, s({ weight: 20, durationSec: 45 })))).toBe('20 kg × 45s'); wt.metric = 'weight_reps';
    expect(j(nowParts(ex('Chest Dip'), s({ addKg: 10, reps: 8 })))).toBe('+10 kg × 8');
    expect(j(nowParts(ex('Pull Up'), s({ addKg: -15, reps: 5 })))).toBe('-15 kg × 5');
    expect(j(nowParts(ex('Chest Dip'), s({ reps: 8 })))).toBe('masa ciała × 8');
    const run = S().exercises.find(e => (e.metric ?? 'weight_reps') === 'distance_time')!; expect(j(nowParts(run, s({ distanceM: 5000, durationSec: 1500 })))).toBe('5000 m · 25:00');
    expect(j(nowParts(ex('Plank'), s({ durationSec: 60 })))).toBe('1:00');
    applyUnit('lb'); expect(j(nowParts(ex('Bench Press (sztanga)'), s({ weight: 80, reps: 5 })))).toBe('176,4 lb × 5');
  });
  test('F9 (LIVE-14): focusCounter — „seria k z n” bez drop setów; drop jako drop serii k; rozgrzewka osobno', async () => {
    const a = await live(['Bench Press (sztanga)'], 3); store.addSet(0, 'drop'); store.addSet(0, 'warmup'); const e = a.exercises[0]; /* W, 1, 2, 3, D */
    expect(e.sets.map(x => x.kind)).toEqual(['warmup', 'normal', 'normal', 'normal', 'drop']);
    expect(focusCounter(e, 0)).toEqual({ kind: 'warmup', n: 'W', all: 3 });
    expect(focusCounter(e, 3)).toEqual({ kind: 'normal', n: '3', all: 3 });
    expect(focusCounter(e, 4)).toEqual({ kind: 'drop', n: '3', all: 3 }); /* audyt: „seria 4D z 4” */
    e.sets[2].kind = 'failure'; expect(focusCounter(e, 2)).toEqual({ kind: 'normal', n: '2F', all: 3 });
    expect(setLabel(e, 4)).toBe('3D'); /* etykieta wiersza tak samo (decyzja 08.10 ~20:20 „spójnie wszędzie”): drop serii 3, nie „4D” */
    expect(['warmup', 'normal', 'drop', 'normal', 'failure', 'drop'].map((_, i, k) => setMarkOf(k as SetKind[], i))).toEqual(['W', '1', '1D', '2', '3F', '3D']);
    expect(setMarkOf(['drop', 'normal'], 0)).toBe('1D'); expect(setMarkOf(['normal'], 3)).toBe('4'); expect(setMarkOf([], -1)).toBe('0');
  });
});

describe('F8 (LOG-04): edytor historii — wpisany czas trwania = czas bez pauz po przycięciu pauz', () => {
  const H = (h: number, m = 0) => new Date(2026, 9, 1, h, m).getTime();
  beforeEach(() => { jest.useFakeTimers({ now: new Date(2026, 9, 8, 12, 0) }); });
  afterEach(() => { jest.useRealTimers(); });
  test('F8 (LOG-04): activeEnd — przejście po pauzach i dodawanie czasu aktywnego (pauzy nieposortowane, przed startem, styk z końcem)', () => {
    const M = 60e3;
    expect(activeEnd(0, 20 * M, [[30 * M, 60 * M]])).toBe(20 * M); expect(activeEnd(0, 25 * M, [[20 * M, 40 * M]])).toBe(45 * M);
    expect(activeEnd(0, 20 * M, [[20 * M, 40 * M]])).toBe(20 * M); /* koniec na początku pauzy — pauza odpada */
    expect(activeEnd(0, 50 * M, [[40 * M, 45 * M], [10 * M, 20 * M]])).toBe(65 * M); expect(activeEnd(10 * M, 5 * M, [[0, 12 * M]])).toBe(17 * M); expect(activeEnd(0, 5 * M, [])).toBe(5 * M);
  });
  test('F8 (LOG-04): pauza na końcu (min 30–60), wpisane 20 → koniec po 20 min aktywnych, pauza odpada, czas 20 (audyt: 30)', async () => {
    await fresh(); const w = addWorkout(H(18), [['Back Squat', [{ weight: 100, reps: 5, completedAt: H(18, 5) }]]]);
    w.finishedAt = H(19); w.pauses = [[H(18, 30), H(19)]]; store.save();
    const d = beginEdit(w.id)!; expect(d.min).toBe('30'); draftSetWhen(d.key, { min: '20' });
    const c = checkDraft(d.key); if ('error' in c) throw new Error(c.error);
    expect(c.w.finishedAt).toBe(H(18, 20)); expect(c.w.pauses).toBeUndefined(); expect(store.workoutDurSec(c.w)).toBe(20 * 60);
    const r = commitDraft(d.key); if ('error' in r) throw new Error(r.error); expect(store.workoutDurSec(r.w)).toBe(20 * 60);
  });
  test('F8 (LOG-04): pauza w środku (20–40), skrócenie przed jej końcem (15) → koniec 15 min po starcie; dłużej (25) → pauza zostaje, koniec 45', async () => {
    await fresh(); const w = addWorkout(H(18), [['Back Squat', [{ weight: 100, reps: 5, completedAt: H(18, 5) }]]]);
    w.finishedAt = H(19); w.pauses = [[H(18, 20), H(18, 40)]]; store.save();
    let d = beginEdit(w.id)!; expect(d.min).toBe('40'); draftSetWhen(d.key, { min: '15' });
    let c = checkDraft(d.key); if ('error' in c) throw new Error(c.error);
    expect(c.w.finishedAt).toBe(H(18, 15)); expect(c.w.pauses).toBeUndefined(); expect(store.workoutDurSec(c.w)).toBe(15 * 60); /* audyt: koniec 35, pauza 20–35, czas 20 */
    draftSetWhen(d.key, { min: '25' }); c = checkDraft(d.key); if ('error' in c) throw new Error(c.error);
    expect(c.w.finishedAt).toBe(H(18, 45)); expect(c.w.pauses).toEqual([[H(18, 20), H(18, 40)]]); expect(store.workoutDurSec(c.w)).toBe(25 * 60);
    d = beginEdit(w.id)!; draftSetWhen(d.key, { date: '2026-10-02', time: '07:00', min: '30' }); c = checkDraft(d.key); if ('error' in c) throw new Error(c.error); /* nowy start: pauza przesuwa się ze startem */
    const s2 = new Date(2026, 9, 2, 7, 0).getTime(); expect(c.w.startedAt).toBe(s2); expect(c.w.pauses).toEqual([[s2 + 20 * 60e3, s2 + 40 * 60e3]]); expect(c.w.finishedAt).toBe(s2 + 50 * 60e3); expect(store.workoutDurSec(c.w)).toBe(30 * 60);
  });
});

describe('D1 / LOG-17: deload — ten sam dobór serii przy starcie, w pytaniu i przy „Powtórz ostatni”', () => {
  const tpl = (sets: number[]) => { const t = store.newTemplate(); t.items = sets.map((n, i) => ({ id: 'i' + i, exerciseId: ex(['Back Squat', 'Bench Press (sztanga)', 'Lat Pulldown'][i % 3]).id, sets: n, repMin: 8, repMax: 12, restSec: 120, startWeight: '', targetSec: '', groupId: null })); store.save(); return t; };
  test('LOG-17: pozycja z usuniętym ćwiczeniem nie liczy się w pytaniu (audyt: „4 zamiast 7”, a start 2 z 3)', async () => {
    await fresh(); const t = tpl([3, 4]); ex('Bench Press (sztanga)').archived = true;
    expect(deloadCounts(t)).toEqual({ full: 3, less: 2, single: false, shortened: false });
    store.startFromTemplate(t, { deload: true }); expect(S().active!.exercises.map(e => e.sets.length)).toEqual([2]);
  });
  test('D1 (MER-05): repeatCounts / repeatLast({ deload }) — cięcie deloadKeep na blok, rozgrzewki i drop sety jak przy szablonie', async () => {
    await fresh();
    addWorkout(Date.now() - 86400e3, [['Back Squat', [{ kind: 'warmup', warmup: true, weight: 40, reps: 10 }, { weight: 100, reps: 8 }, { weight: 100, reps: 8 }, { weight: 100, reps: 8 }, { kind: 'drop', weight: 80, reps: 6 }]], ['Plank', [{ durationSec: 60 }]]]);
    expect(repeatCounts(store.finishedWorkouts()[0])).toEqual({ full: 4, less: 3, single: true, shortened: false });
    store.repeatLast({ deload: true }); const a = S().active!;
    expect(a.exercises.map(e => e.sets.map(s => s.kind))).toEqual([['warmup', 'normal', 'normal'], ['normal']]);
    expect(a.exercises[0].sets.map(s => s.weight)).toEqual([40, 100, 100]); /* ciężary bez zmian */
  });
  test('D1 (MER-05): ostatni trening z usuniętym ćwiczeniem — liczy tylko bloki, które „Powtórz ostatni” wstawi', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 8 }, { weight: 100, reps: 8 }]], ['Leg Press', [{ weight: 100, reps: 8 }, { weight: 100, reps: 8 }]]]);
    ex('Leg Press').archived = true; expect(repeatCounts(store.finishedWorkouts()[0])).toEqual({ full: 2, less: 1, single: false, shortened: false });
    expect(store.repeatBlocks(store.finishedWorkouts()[0]).map(e => e.exerciseId)).toEqual([ex('Back Squat').id]);
    const it = { id: 'x', exerciseId: ex('Leg Press').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null };
    expect(store.startableItem(it)).toBe(false); expect(store.startableItem({ ...it, exerciseId: ex('Back Squat').id })).toBe(true); expect(store.startableItem({ ...it, exerciseId: 'nie-ma' })).toBe(false);
  });
  test('D1 (MER-05): startRepeatLast poza tygodniem deload — od razu, bez pytania; bez historii nic; `after` po starcie', async () => {
    await fresh(); const after = jest.fn(); startRepeatLast(after); expect(S().active).toBeNull(); expect(after).not.toHaveBeenCalled();
    addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 8 }, { weight: 100, reps: 8 }]]]); global.__alerts.length = 0;
    startRepeatLast(after); expect(global.__alerts).toHaveLength(0); expect(S().active!.exercises[0].sets).toHaveLength(2); expect(after).toHaveBeenCalledTimes(1);
  });
});

describe('D1+ (decyzja 08.10.2026, koordynator: „lepsza opcja”): powtórzenie skróconego treningu — bez drugiego cięcia, z przywróceniem pełnego', () => {
  const tpl = (rows: ('normal' | 'drop' | 'warmup')[][], names = ['Back Squat', 'Bench Press (sztanga)', 'Plank']) => {
    const t = store.newTemplate(); t.name = 'Upper';
    t.items = rows.map((r, i) => ({ id: 'i' + i, exerciseId: ex(names[i]).id, sets: r.length, repMin: 8, repMax: 12, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null, rows: r.map((k, j) => ({ id: `r${i}_${j}`, kind: k, reps: 8 as number | '', weight: (k === 'drop' ? 60 : k === 'warmup' ? 40 : 100) as number | '', durationSec: '' as const, distanceM: '' as const })) }));
    store.save(); return t;
  };
  /** Start z cięciem deload, odhaczenie wszystkiego (wartości z szablonu), zakończenie. */
  const doneDeload = (t: ReturnType<typeof tpl>) => { store.startFromTemplate(t, { deload: true }); const a = S().active!; a.exercises.forEach((e, ei) => e.sets.forEach((_, si) => store.toggleDone(ei, si))); return store.finishWorkout()!; };
  const work = (sets: { kind?: string }[]) => sets.filter(s => s.kind !== 'warmup' && s.kind !== 'drop').length;
  test('D1+: start z „Mniej serii” oznacza trening (deload) i zapamiętuje pełną liczbę serii roboczych przyciętych bloków; zostaje po „Zakończ”', async () => {
    await fresh(); const t = tpl([['warmup', 'normal', 'normal', 'normal', 'drop'], ['normal']]); store.startFromTemplate(t, { deload: true });
    const a = S().active!; expect(a.deload).toBe(true); expect(a.exercises.map(e => e.deloadFull)).toEqual([3, undefined]); /* 1 seria — bez cięcia, bez znacznika */
    a.exercises.forEach((e, ei) => e.sets.forEach((_, si) => store.toggleDone(ei, si))); const w = store.finishWorkout()!;
    expect(w.deload).toBe(true); expect(w.exercises.map(e => e.deloadFull)).toEqual([3, undefined]);
    store.startFromTemplate(t); expect(S().active!.deload).toBeUndefined(); expect(S().active!.exercises.every(e => e.deloadFull === undefined)).toBe(true); /* pełny start bez znacznika */
  });
  test('D1+: repeatCounts skróconego — „mniej” = jak ostatnio (bez drugiego cięcia), „pełny” = przywrócony z szablonu', async () => {
    await fresh(); const t = tpl([['normal', 'normal', 'normal', 'normal'], ['normal', 'normal', 'normal']]); const w = doneDeload(t);
    expect(w.exercises.map(e => work(e.sets))).toEqual([2, 2]);
    expect(repeatCounts(w)).toEqual({ full: 7, less: 4, single: false, shortened: true });
    expect(store.deloadTail(w, w.exercises[0]).map(x => x.kind)).toEqual(['normal', 'normal']); expect(store.deloadTail({ ...w, deload: undefined }, w.exercises[0])).toEqual([]); /* zwykły trening — nic */
  });
  test('D1+: repeatLast({ deload }) skróconego — powtarza go jak jest (2 → 2, nie 1), znacznik i pełne liczby zostają', async () => {
    await fresh(); const t = tpl([['normal', 'normal', 'normal', 'normal']]); doneDeload(t);
    store.repeatLast({ deload: true }); const a = S().active!; expect(work(a.exercises[0].sets)).toBe(2); expect(a.deload).toBe(true); expect(a.exercises[0].deloadFull).toBe(4);
  });
  test('D1+: repeatLast() skróconego — przywraca pełny trening z szablonu: brakujące serie robocze (wartości ostatniej serii) i drop set; bez znacznika', async () => {
    await fresh(); const t = tpl([['warmup', 'normal', 'normal', 'normal', 'drop']]); const w = doneDeload(t); expect(w.exercises[0].sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'normal']);
    store.repeatLast(); const a = S().active!; const e = a.exercises[0];
    expect(e.sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'normal', 'normal', 'drop']); expect(e.sets.map(s => s.weight)).toEqual([40, 100, 100, 100, 60]);
    expect(e.sets.map(s => s.reps)).toEqual([8, 8, 8, 8, 8]); expect(e.sets.every(s => !s.done)).toBe(true); expect(new Set(e.sets.map(s => s.id)).size).toBe(5);
    expect(a.deload).toBeUndefined(); expect(e.deloadFull).toBeUndefined();
  });
  test('D1+: bez szablonu (usunięty) — przywrócenie z zapamiętanej liczby; szablon zmieniony później — wygrywa szablon', async () => {
    await fresh(); const t = tpl([['normal', 'normal', 'normal']]); doneDeload(t);
    t.items[0].rows!.push({ id: 'x', kind: 'normal', reps: 6, weight: 110, durationSec: '', distanceM: '' }); store.save(t);
    expect(repeatCounts(store.finishedWorkouts()[0])).toMatchObject({ full: 4, less: 2 }); /* szablon ma teraz 4 serie */
    store.deleteTemplate(t.id); expect(repeatCounts(store.finishedWorkouts()[0])).toMatchObject({ full: 3, less: 2 }); /* zapamiętane deloadFull = 3 */
    store.repeatLast(); expect(S().active!.exercises[0].sets.map(s => [s.kind, s.weight, s.reps])).toEqual([['normal', 100, 8], ['normal', 100, 8], ['normal', 100, 8]]);
  });
  test('D1+: powtórzenie zwykłego treningu z cięciem zapamiętuje pełną liczbę — kolejne powtórzenie znów może wrócić do pełnego', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Back Squat', [1, 2, 3, 4, 5].map(() => ({ weight: 100, reps: 5 }))]]);
    store.repeatLast({ deload: true }); let a = S().active!; expect(a.deload).toBe(true); expect(work(a.exercises[0].sets)).toBe(3); expect(a.exercises[0].deloadFull).toBe(5);
    a.exercises[0].sets.forEach((_, si) => store.toggleDone(0, si)); store.finishWorkout();
    expect(repeatCounts(store.finishedWorkouts()[0])).toEqual({ full: 5, less: 3, single: false, shortened: true });
    store.repeatLast(); a = S().active!; expect(work(a.exercises[0].sets)).toBe(5); expect(a.deload).toBeUndefined();
  });
  test('D1+ (dane): migrate — deload tylko true, deloadFull liczba całkowita 1–50 i tylko w treningu deload; idempotentne; kopia eksport → import bez strat', async () => {
    await fresh(); const t = tpl([['normal', 'normal', 'normal']]); doneDeload(t);
    const raw: any = JSON.parse(JSON.stringify(S()));
    raw.workouts.push({ ...JSON.parse(JSON.stringify(raw.workouts[0])), id: 'zly', startedAt: raw.workouts[0].startedAt - 864e5, finishedAt: raw.workouts[0].finishedAt - 864e5, deload: 'tak', exercises: raw.workouts[0].exercises.map((e: any) => ({ ...e, id: 'z' + e.id, deloadFull: 3 })) });
    raw.workouts.push({ ...JSON.parse(JSON.stringify(raw.workouts[0])), id: 'zly2', startedAt: raw.workouts[0].startedAt - 2 * 864e5, finishedAt: raw.workouts[0].finishedAt - 2 * 864e5, exercises: raw.workouts[0].exercises.map((e: any, i: number) => ({ ...e, id: 'y' + e.id, deloadFull: ['x', 0, 2.5, 999, -3][i] ?? 'x' })) });
    const m = store.migrate(JSON.parse(JSON.stringify(raw)));
    const by = (id: string) => m.workouts.find(w => w.id === id)!;
    expect(by(raw.workouts[0].id).deload).toBe(true); expect(by(raw.workouts[0].id).exercises[0].deloadFull).toBe(3);
    expect('deload' in by('zly')).toBe(false); expect('deloadFull' in by('zly').exercises[0]).toBe(false); /* bez znacznika — bez liczby */
    expect(by('zly2').deload).toBe(true); expect(by('zly2').exercises.map(e => e.deloadFull)).toEqual([undefined]); /* „x” odpada */
    const m2 = store.migrate(JSON.parse(JSON.stringify(m))); expect(m2.workouts).toEqual(m.workouts);
    expect(store.migrate({ ...JSON.parse(JSON.stringify(raw)), workouts: [{ ...raw.workouts[0], exercises: [{ ...raw.workouts[0].exercises[0], deloadFull: 2.6 }] }] }).workouts[0].exercises[0].deloadFull).toBe(3);
    expect(store.migrate({ ...JSON.parse(JSON.stringify(raw)), workouts: [{ ...raw.workouts[0], exercises: [{ ...raw.workouts[0].exercises[0], deloadFull: 80 }] }] }).workouts[0].exercises[0].deloadFull).toBe(50);
    const before = JSON.parse(JSON.stringify(S())); const after = parseBackup(JSON.stringify(buildBackup()));
    expect(after.workouts).toEqual(before.workouts); expect(after.workouts[0].deload).toBe(true);
    store.startFromTemplate(t, { deload: true }); await store.flush(); await fresh(saved()); expect(S().active!.deload).toBe(true); expect(S().active!.exercises[0].deloadFull).toBe(3); /* trening w toku po restarcie */
  });
});

describe('D2 (MER-04, wariant A): tekst „o około 1/3–1/2 mniej serii (np. 2 z 3)” zgodny z deloadKeep', () => {
  test('D2 (MER-04): dla n = 2..6 cięcie deloadKeep mieści się w 1/3–1/2; przykład w tekście liczony z deloadKeep(3); 1 seria bez zmian', async () => {
    await fresh();
    for (let n = 2; n <= 6; n++) { const cut = (n - deloadKeep(n)) / n; expect(cut).toBeGreaterThanOrEqual(1 / 3 - 1e-9); expect(cut).toBeLessThanOrEqual(1 / 2); }
    expect(deloadKeep(1)).toBe(1);
    const txt = deloadLessText(); expect(txt).toBe(`o około 1/3–1/2 mniej serii (np. ${deloadKeep(3)} z 3; ćwiczenia z 1 serią bez zmian)`);
    expect(txt).not.toMatch(/połow/);
  });
});

describe('LIVE-17: ciężar, którego nie da się ułożyć z talerzy', () => {
  test('LIVE-17: nearestLoad — najbliższy osiągalny (remis → lżejszy); pusta lista → null', () => {
    expect(nearestLoad([20, 25, 30, 102.5], 102.05)).toBe(102.5); expect(nearestLoad([20, 25, 30], 27.5)).toBe(25); expect(nearestLoad([20, 25], 8035)).toBe(25);
    expect(nearestLoad([], 50)).toBeNull(); expect(nearestLoad([20, 22.5], 21)).toBe(20);
  });
});

describe('F7 (LIVE-12): store nie nadpisuje treningu w toku', () => {
  test('F7 (LIVE-12): startEmpty / startFromTemplate / repeatLast przy treningu w toku nic nie robią (zwracają false)', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 8 }]]]);
    const t = store.newTemplate(); t.items = [{ id: 'i', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }];
    expect(store.startEmpty()).toBe(true); const id = S().active!.id; store.addExerciseToActive(ex('Bench Press (sztanga)'));
    expect(store.startEmpty()).toBe(false); expect(store.startFromTemplate(t)).toBe(false); expect(store.repeatLast()).toBe(false);
    expect(S().active!.id).toBe(id); expect(S().active!.exercises).toHaveLength(1);
    store.cancelWorkout(); expect(store.repeatLast()).toBe(true); expect(S().active!.exercises.map(e => e.exerciseId)).toEqual([ex('Back Squat').id]);
  });
});
