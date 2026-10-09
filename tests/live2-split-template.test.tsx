/*
 * Audyt kontrolny 1 (przed 0.10.0), LIVE2-01 [WYSOKA] i LIVE2-03 [NISKA] — łańcuch podziału bloku (zamiana ćwiczenia albo przyrządu po odhaczeniu
 * części serii: bloki z tą samą pozycją szablonu) to JEDNA pozycja szablonu. Podstawa: sondy audytora N4 / N4b / N5 / N4-skutki
 * (scratchpad/audit2/LIVE, zz-audit2-live-a/b). Przed naprawą: pytanie „Zaktualizować szablon?” mimo zamiany (H5: zamiana — bez pytania),
 * a „Zaktualizuj szablon” dawało dwie pozycje z tym samym id; „Pełny trening” po skróconym z zamianą przywracał serie złemu blokowi.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { templateDiff, updateTemplateFromWorkout } from '@/lib/tplsync';
import { repeatCounts } from '@/lib/start';
import { buildBackup, parseBackup } from '@/lib/backup';
import { presetEquipment } from '@/lib/equipment';
import type { Template, TemplateItem } from '@/lib/seed';
import { fresh, ex, saved, pressAlert } from './helpers';
import { userHome, loc } from './locations-fixtures';
import { renderApp, tap, flushAll, screen, act, go, swipeDelete, startEdit, tplDraft } from './app';

jest.setTimeout(120000);
const S = () => store.getState();
const J = (x: unknown) => JSON.parse(JSON.stringify(x));
afterEach(async () => { try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const ids = (t: Template) => t.items.map(i => i.id);
const uniq = (t: Template) => new Set(ids(t)).size === t.items.length;
const item = (id: string, name: string, sets: number, extra: Partial<TemplateItem> = {}): TemplateItem => ({ id, exerciseId: ex(name).id, sets, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null, ...extra });
const mkTpl = (items: TemplateItem[], name = 'Push') => { const t = store.newTemplate(); t.name = name; t.items.push(...items); store.save(t); return t; };
/** Szablon z audytu: Bench Press 3 × 60 (+ Back Squat 2 × 80); start, ✓ seria 1, „⇄ zamień” na Bench Press (hantle) — podział bloku. */
const splitSwap = (withSquat = true) => {
  const t = mkTpl([item('a', 'Bench Press (sztanga)', 3), ...(withSquat ? [item('b', 'Back Squat', 2, { startWeight: 80 })] : [])]);
  store.startFromTemplate(t); const a = S().active!; a.exercises[0].sets.forEach(s => { s.reps = 8; }); store.toggleDone(0, 0);
  const r = store.swapBlock(a.exercises[0].id, ex('Bench Press (hantle)').id)!; expect(r).toBeTruthy();
  expect(a.exercises.map(e => [e.tplItemId, e.sets.length, !!e.swappedFrom])).toEqual([['a', 1, false], ['a', 2, true], ...(withSquat ? [['b', 2, false]] : [])]);
  return { t, a };
};

describe('LIVE2-01: zamiana w trakcie ćwiczenia (podział bloku) a „Zaktualizować szablon?” (H5)', () => {
  test('N4: podział zamianą — bez pytania; wymuszone „Zaktualizuj szablon” nie dubluje pozycji i nie zmienia jej serii', async () => {
    await fresh(); const { t, a } = splitSwap(); const before = J(t.items);
    expect(templateDiff(t, J(a))).toBeNull();
    updateTemplateFromWorkout(t, J(a));
    expect(uniq(t)).toBe(true); expect(ids(t)).toEqual(['a', 'b']); expect(t.items.map(i => i.sets)).toEqual([3, 2]);
    expect(J(t.items[0])).toEqual(before[0]); /* zamiana — pozycja bez zmian */
  });
  test('łańcuch z zamianą i dodaną serią zamiennika — wciąż bez pytania (jak zamiana całego bloku); inne różnice zgłaszane raz, bez „Inne serie”', async () => {
    await fresh(); const { t, a } = splitSwap(); store.addSet(1); expect(templateDiff(t, J(a))).toBeNull();
    a.exercises.splice(2, 1); const d = templateDiff(t, J(a))!; expect(d).toEqual({ added: [], removed: ['Back Squat'], sets: [], order: false });
    updateTemplateFromWorkout(t, J(a)); expect(ids(t)).toEqual(['a']); expect(t.items[0].sets).toBe(3);
  });
  test('kolejność: łańcuch liczony na miejscu pierwszego bloku — przeniesienie zamiennika za inne ćwiczenie to inna kolejność, ale nadal jedna pozycja', async () => {
    await fresh(); const { t, a } = splitSwap(); const [A, B, C] = a.exercises; a.exercises = [A, C, B];
    expect(templateDiff(t, J(a))).toBeNull(); /* pierwszy blok łańcucha przed Back Squat — kolejność pozycji bez zmian */
    a.exercises = [C, A, B]; expect(templateDiff(t, J(a))).toEqual({ added: [], removed: [], sets: [], order: true });
    updateTemplateFromWorkout(t, J(a)); expect(ids(t)).toEqual(['b', 'a']); expect(uniq(t)).toBe(true);
  });
  test('N4b: sama zmiana przyrządu z podziałem (swapImpl) — suma serii łańcucha: 1 + 2 = 3 bez pytania; dodana seria → „Inne serie”, aktualizacja = jedna pozycja z 4 seriami', async () => {
    await fresh(undefined, 'pl'); const st = S(); st.settings.locations = [userHome([2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 24]), loc('Pełna siłownia', presetEquipment('gym'), 'gym')]; st.settings.mainLocationId = 'home'; store.save();
    const RDL = 'RDL (hantle/linki)'; const t = mkTpl([item('a', RDL, 3, { startWeight: '' })], 'Pull'); t.locationId = 'home'; store.save(t);
    store.startFromTemplate(t); const a = S().active!; expect(a.exercises[0].impl).toBe('dumbbell'); a.exercises[0].sets[0].weight = 20; a.exercises[0].sets[0].reps = 10; store.toggleDone(0, 0);
    expect(store.swapImpl(a.exercises[0].id, 'electric')).toBeTruthy();
    expect(a.exercises.map(e => [e.tplItemId, e.impl, e.sets.length, e.swappedFrom])).toEqual([['a', 'dumbbell', 1, undefined], ['a', 'electric', 2, undefined]]);
    expect(templateDiff(t, J(a))).toBeNull();
    store.addSet(1); expect(templateDiff(t, J(a))).toEqual({ added: [], removed: [], sets: [ex(RDL).name], order: false });
    updateTemplateFromWorkout(t, J(a)); expect(ids(t)).toEqual(['a']); expect(t.items[0].sets).toBe(4); expect(store.tplRows(t.items[0])).toHaveLength(4);
    store.cancelWorkout(); store.startFromTemplate(t); expect(S().active!.exercises.map(e => [e.tplItemId, e.sets.length])).toEqual([['a', 4]]); /* start — jeden blok */
  });
  test('N4-skutki: „Powtórz ostatni” po treningu z podziałem — podział zostaje (powtórzenie), ale pytania nie ma i aktualizacja nie dubluje pozycji', async () => {
    await fresh(); const { t, a } = splitSwap(false); a.exercises[1].sets.forEach(s => { s.weight = 20; s.reps = 8; }); store.toggleDone(1, 0); store.toggleDone(1, 1); store.finishWorkout();
    store.repeatLast(); const r = S().active!; expect(r.exercises.map(e => e.tplItemId)).toEqual(['a', 'a']);
    expect(templateDiff(t, J(r))).toBeNull(); updateTemplateFromWorkout(t, J(r)); expect(ids(t)).toEqual(['a']); expect(t.items[0].sets).toBe(3);
  });
  test('niezmiennik: szablon już zepsuty w pamięci (dwie pozycje „a”) — dopasowanie najwyżej raz, po aktualizacji id unikalne', async () => {
    await fresh(); const t = mkTpl([item('a', 'Bench Press (sztanga)', 1), item('a', 'Bench Press (sztanga)', 3)]);
    store.startFromTemplate(t); const a = S().active!; expect(a.exercises.map(e => e.tplItemId)).toEqual(['a', 'a']);
    updateTemplateFromWorkout(t, J(a)); expect(uniq(t)).toBe(true);
  });
  test('fuzz niezmienników (znalezisko przy LIVE2-01): ćwiczenie dodane w treningu i usunięte z biblioteki w trakcie (archiwum) — bez pytania i nie trafia do szablonu', async () => {
    await fresh(); const t = mkTpl([item('a', 'Bench Press (sztanga)', 1)]); store.startFromTemplate(t); store.addExerciseToActive(ex('Plank')); const a = S().active!;
    store.toggleDone(1, 0); store.deleteExercise(ex('Plank').id); expect(ex('Plank').archived).toBe(true);
    expect(templateDiff(t, J(a))).toBeNull(); updateTemplateFromWorkout(t, J(a)); expect(t.items.map(i => store.exById(i.exerciseId)!.name)).toEqual(['Bench Press (sztanga)']);
  });
  test('N5 (ekran): zamiana w trakcie, „Zakończ” — bez okna „Zaktualizować szablon?”', async () => {
    await fresh(); const { a } = splitSwap(false); a.exercises[1].sets.forEach(s => { s.weight = 20; s.reps = 8; }); store.toggleDone(1, 0); store.toggleDone(1, 1);
    await act(async () => { await store.flush(); }); await renderApp({ saved: J(saved()) }); await flushAll(10);
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(1000);
    expect(S().active).toBeNull(); expect(global.__alerts.some(x => x.title.startsWith('Zaktualizować szablon'))).toBe(false);
  });
  test('N5 kontrola (ekran): bez zamiany, ćwiczenie usunięte w treningu — okno jest, „Zaktualizuj szablon” zostawia jedną pozycję', async () => {
    await fresh(); const t = mkTpl([item('a', 'Bench Press (sztanga)', 3), item('b', 'Back Squat', 2, { startWeight: 80 })]); store.startFromTemplate(t); const a = S().active!;
    a.exercises.forEach(e => e.sets.forEach(s => { s.reps = 8; })); store.toggleDone(0, 0); store.toggleDone(1, 0); a.exercises.splice(1, 1);
    await act(async () => { await store.flush(); }); await renderApp({ saved: J(saved()) }); await flushAll(10);
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(1000);
    await act(async () => { pressAlert('Zaktualizować szablon „Push”?', 'Zaktualizuj szablon'); }); await flushAll(10);
    const tt = S().templates.find(x => x.name === 'Push')!; expect(ids(tt)).toEqual(['a']);
  });
});

describe('LIVE2-01 (dane): naprawa szablonów już zepsutych — migrate nadaje nowe id duplikatom, serie zostają', () => {
  test('migrate: dwie pozycje „a” (1 i 3 serie, te same id wierszy) → unikalne id pozycji i wierszy, serie [1, 3]; idempotentne; eksport → import bez strat; edycja drugiej nie zmienia pierwszej', async () => {
    await fresh(); const bench = ex('Bench Press (sztanga)').id;
    const row = (id: string) => ({ id, kind: 'normal', reps: 8, weight: 60, durationSec: '', distanceM: '' });
    const raw: any = J(S()); raw.templates = [{ ...J(store.newTemplate()), name: 'Push', items: [
      { id: 'a', exerciseId: bench, sets: 1, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null, rows: [row('r1')] },
      { id: 'a', exerciseId: bench, sets: 3, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null, rows: [row('r1'), row('r2'), row('r3')] }] }];
    const m = store.migrate(J(raw)); const t = m.templates.find(x => x.name === 'Push')!;
    expect(uniq(t)).toBe(true); expect(t.items[0].id).toBe('a'); expect(t.items.map(i => i.sets)).toEqual([1, 3]);
    for (const it of t.items) { const r = (it.rows ?? []).map(x => x.id); expect(new Set(r).size).toBe(r.length); } /* wiersze — id unikalne w pozycji (edytor szuka wiersza w jego pozycji) */
    expect(J(store.migrate(J(m)))).toEqual(J(m)); /* idempotentne */
    await fresh(J(m)); const back = parseBackup(JSON.stringify(buildBackup())); expect(J(back.templates)).toEqual(J(S().templates)); /* kopia eksport → import */
    const tt = S().templates.find(x => x.name === 'Push')!; store.tplAddRow(tt, tt.items[1].id); expect(tt.items.map(i => i.sets)).toEqual([1, 4]); /* „+ seria” w drugiej — tylko druga */
    store.startFromTemplate(tt); expect(new Set(S().active!.exercises.map(e => e.tplItemId)).size).toBe(2);
  });
});

describe('LIVE2-01 (ekran): edytor szablonu usuwa wskazaną pozycję, nie pierwszą z tym samym id', () => {
  test('dwie pozycje z tym samym id w szkicu (dane sprzed naprawy, przed ponownym wczytaniem) — przesunięcie „Plank” usuwa Plank, Back Squat zostaje', async () => {
    await fresh(); const t = mkTpl([item('i1', 'Back Squat', 2, { startWeight: '' }), item('i2', 'Plank', 1, { startWeight: '' })], 'T1');
    await act(async () => { await store.flush(); }); await renderApp({ saved: J(saved()) }); await flushAll(10); await go(`/template/${t.id}`); await flushAll(10); await startEdit();
    const d = tplDraft(t.id); expect(d.items.map(i => i.id)).toEqual(['i1', 'i2']); d.items[1].id = 'i1'; /* jak szablon po LIVE2-01 w tej samej sesji */
    await swipeDelete('Usuń ćwiczenie: Plank'); await act(async () => { pressAlert('Usunąć z szablonu?', 'Usuń'); }); await flushAll(10);
    expect(tplDraft(t.id).items.map(i => store.exById(i.exerciseId)!.name)).toEqual(['Back Squat']);
  });
});

describe('LIVE2-03: „Pełny trening” po skróconym treningu z zamianą w trakcie — pełna liczba dla łańcucha, nie dla oryginału', () => {
  const rows4 = () => ({ rows: [1, 2, 3, 4].map(j => ({ id: 'r' + j, kind: 'normal' as const, reps: 8 as number | '', weight: 100 as number | '', durationSec: '' as const, distanceM: '' as const })) });
  /** Szablon Bench 4 × 100; „Mniej serii” (2); ✓ A1; zamiana na hantle (B: 1 seria); ✓ B1 (30 kg); „Zakończ”. */
  const deloadSplit = () => {
    const t = mkTpl([item('a', 'Bench Press (sztanga)', 4, rows4())]); store.startFromTemplate(t, { deload: true }); const a = S().active!;
    expect(a.exercises[0].sets).toHaveLength(2); expect(a.exercises[0].deloadFull).toBe(4); store.toggleDone(0, 0);
    store.swapBlock(a.exercises[0].id, ex('Bench Press (hantle)').id); expect(a.exercises[0].deloadFull).toBeUndefined(); expect(a.exercises[1].deloadFull).toBe(3); /* reszta pełnej liczby przechodzi na B */
    Object.assign(a.exercises[1].sets[0], { weight: 30, reps: 8 }); store.toggleDone(1, 0); return { t, w: store.finishWorkout()! };
  };
  const work = (sets: { kind?: string }[]) => sets.filter(s => s.kind !== 'warmup' && s.kind !== 'drop').length;
  test('z szablonu: repeatCounts pełny = 4, „Pełny trening” = A × 1 + B × 3 (wartości B z jego serii), „Jak ostatnio” = 1 + 1', async () => {
    await fresh(); const { w } = deloadSplit(); expect(repeatCounts(w)).toMatchObject({ full: 4, less: 2, shortened: true });
    store.repeatLast(); let r = S().active!; expect(r.exercises.map(e => work(e.sets))).toEqual([1, 3]); expect(r.exercises[1].sets.map(s => s.weight)).toEqual([30, 30, 30]);
    store.cancelWorkout(); store.repeatLast({ deload: true }); r = S().active!; expect(r.exercises.map(e => work(e.sets))).toEqual([1, 1]); expect(r.exercises.map(e => e.deloadFull)).toEqual([undefined, 3]);
  });
  test('bez szablonu (usunięty): z zapamiętanej liczby bloków — łącznie 4, nie 4 + 1', async () => {
    await fresh(); const { t, w } = deloadSplit(); store.deleteTemplate(t.id); expect(repeatCounts(w)).toMatchObject({ full: 4, less: 2 });
    store.repeatLast(); expect(S().active!.exercises.map(e => work(e.sets))).toEqual([1, 3]);
  });
  test('cofnięcie zamiany po podziale — pełna liczba wraca do scalonego bloku', async () => {
    await fresh(); const t = mkTpl([item('a', 'Bench Press (sztanga)', 4, rows4())]); store.startFromTemplate(t, { deload: true }); const a = S().active!; store.toggleDone(0, 0);
    store.swapBlock(a.exercises[0].id, ex('Bench Press (hantle)').id); store.undoSwap(a.exercises[1].id);
    expect(a.exercises).toHaveLength(1); expect(a.exercises[0].sets).toHaveLength(2); expect(a.exercises[0].deloadFull).toBe(4);
  });
});
