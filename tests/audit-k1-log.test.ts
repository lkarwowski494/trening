/*
 * Audyt kontrolny 1 (przed 0.10.0), LOG2-01 [WYSOKA]: „Zaktualizuj szablon” po zamianie ćwiczenia (swapBlock) albo przyrządu (swapImpl) w trakcie
 * ćwiczenia (podział bloku — dwa bloki z tym samym tplItemId) powielał pozycję szablonu z tym samym id i ucinał serie.
 * Zasada (lib/tplsync, H5 — decyzja właściciela 08.10.2026, A+B): zamiana ćwiczenia jest „tylko na dziś” — pozycja szablonu bez zmian;
 * zmiana przyrządu nie zmienia składu (to samo ćwiczenie), więc serie obu części bloku liczą się jako serie jednej pozycji.
 * Rodzaje (docs/20): logika, scenariusz (start → zamiana → pytanie → aktualizacja → restart → następny start), dane (migrate: powtórzone id
 * pozycji dostają nowe — idempotentnie, kopia), regresja.
 */
import * as store from '@/lib/store';
import { fresh, ex, saved } from './helpers';
import { templateDiff, updateTemplateFromWorkout } from '@/lib/tplsync';
import { addLocation } from '@/lib/locations';
import { implsAt } from '@/lib/equipment';
import { base, uid, type Template, type Workout } from '@/lib/seed';

const NOW = new Date(2026, 9, 7, 9).getTime();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { jest.useRealTimers(); });

const tpl = (names: string[], extra: Partial<Template> = {}): Template => ({ ...base(), name: 'S', items: names.map(n => ({ id: uid(), exerciseId: ex(n).id, sets: 3, repMin: 5, repMax: 8, restSec: 120, startWeight: '', targetSec: '', groupId: null })), ...extra });
const startT = (T: Template) => { store.getState().templates.push(T); store.save(); expect(store.startFromTemplate(T)).toBe(true); return store.getState().active!; };
const snapOf = (): Workout => JSON.parse(JSON.stringify(store.getState().active));
const shape = (T: Template) => T.items.map(i => [store.exById(i.exerciseId)!.name, store.tplRows(i).map(r => r.kind).join(',')]);
const uniqueIds = (T: Template) => new Set(T.items.map(i => i.id)).size === T.items.length;

/** Restart (zapis → odczyt) i następny start z szablonu: bloki z unikalnymi pozycjami szablonu. */
async function restartAndStart(id: string) {
  await store.flush(); await fresh(saved());
  const T2 = store.getState().templates.find(x => x.id === id)!;
  expect(uniqueIds(T2)).toBe(true);
  expect(store.startFromTemplate(T2)).toBe(true);
  const blocks = store.getState().active!.exercises;
  expect(new Set(blocks.map(b => b.tplItemId)).size).toBe(blocks.length);
  return { T2, blocks };
}

describe('LOG2-01: zamiana ćwiczenia z podziałem bloku', () => {
  test('logika: brak pytania (zamiana tylko na dziś); wymuszona aktualizacja nie zmienia pozycji; restart i następny start — 2 pozycje, unikalne id', async () => {
    const T = tpl(['Back Squat', 'Pull Up']); const before = shape(T); const ids = T.items.map(i => i.id);
    const a = startT(T); a.exercises[0].sets.forEach(s => { s.weight = 100; s.reps = 5; }); store.toggleDone(0, 0); store.toggleDone(0, 1);
    expect(store.swapBlock(a.exercises[0].id, ex('Front Squat').id)).not.toBeNull();
    const snap = snapOf(); expect(snap.exercises.map(b => b.tplItemId)).toEqual([ids[0], ids[0], ids[1]]); /* podział: dwa bloki tej samej pozycji */
    expect(templateDiff(T, snap)).toBeNull();
    store.finishWorkout(); updateTemplateFromWorkout(T, snap);
    expect(T.items.map(i => i.id)).toEqual(ids); expect(shape(T)).toEqual(before); expect(store.tplWorkSets(T)).toBe(6);
    const { T2, blocks } = await restartAndStart(T.id);
    expect(shape(T2)).toEqual(before); expect(blocks.map(b => [store.exById(b.exerciseId)!.name, b.sets.length])).toEqual([['Back Squat', 3], ['Pull Up', 3]]);
  });
  test('scenariusz: zamiana z podziałem + dodane ćwiczenie → pytanie tylko o dodane; aktualizacja: pozycja zamieniona bez zmian, jedna na id', async () => {
    const T = tpl(['Back Squat', 'Pull Up']); const before = shape(T);
    const a = startT(T); store.toggleDone(0, 0);
    store.swapBlock(a.exercises[0].id, ex('Front Squat').id); store.addExerciseToActive(ex('Plank'));
    const snap = snapOf(); const d = templateDiff(T, snap)!;
    expect(d).toEqual({ added: ['Plank'], removed: [], sets: [], order: false });
    store.finishWorkout(); updateTemplateFromWorkout(T, snap);
    expect(uniqueIds(T)).toBe(true); expect(shape(T).slice(0, 2)).toEqual(before); expect(shape(T).map(x => x[0])).toEqual(['Back Squat', 'Pull Up', 'Plank']);
    await restartAndStart(T.id);
  });
});

describe('LOG2-01: zmiana przyrządu z podziałem bloku', () => {
  const setup = () => {
    const gym = addLocation('gym'); store.getState().settings.mainLocationId = gym.id; store.save();
    const e = ex('RDL (hantle/linki)'); expect(implsAt(e, gym).length).toBeGreaterThan(1);
    const T: Template = { ...base(), name: 'I', locationId: gym.id, items: [{ id: uid(), exerciseId: e.id, sets: 3, repMin: 8, repMax: 12, restSec: 90, startWeight: '', targetSec: '', groupId: null }, { id: uid(), exerciseId: ex('Pull Up').id, sets: 3, repMin: 5, repMax: 8, restSec: 120, startWeight: '', targetSec: '', groupId: null }] };
    const a = startT(T); a.exercises[0].sets.forEach(s => { s.weight = 20; s.reps = 10; }); store.toggleDone(0, 0);
    const other = implsAt(e, gym).find(i => i !== a.exercises[0].impl)!; expect(store.swapImpl(a.exercises[0].id, other)).not.toBeNull();
    return { T, a };
  };
  test('logika: ten sam skład (1 + 2 serie = 3) → brak pytania; wymuszona aktualizacja — jedna pozycja z 3 seriami; restart i start', async () => {
    const { T } = setup(); const before = shape(T); const ids = T.items.map(i => i.id);
    const snap = snapOf(); expect(snap.exercises.map(b => b.tplItemId)).toEqual([ids[0], ids[0], ids[1]]);
    expect(templateDiff(T, snap)).toBeNull();
    store.finishWorkout(); updateTemplateFromWorkout(T, snap);
    expect(T.items.map(i => i.id)).toEqual(ids); expect(shape(T)).toEqual(before);
    const { blocks } = await restartAndStart(T.id); expect(blocks.map(b => b.sets.length)).toEqual([3, 3]);
  });
  test('scenariusz: po podziale dodana seria w nowym bloku → „Inne serie” raz; aktualizacja — jedna pozycja z 4 seriami (odhaczona + 3)', async () => {
    const { T, a } = setup(); const ids = T.items.map(i => i.id);
    store.addSet(1); expect(a.exercises[1].sets.length).toBe(3);
    const snap = snapOf(); const d = templateDiff(T, snap)!;
    expect(d.sets).toEqual([d.sets[0]]); expect(d.added).toEqual([]); expect(d.removed).toEqual([]); expect(d.order).toBe(false);
    store.finishWorkout(); updateTemplateFromWorkout(T, snap);
    expect(T.items.map(i => i.id)).toEqual(ids); expect(store.tplRows(T.items[0]).length).toBe(4); expect(T.items[0].sets).toBe(4);
    const { blocks } = await restartAndStart(T.id); expect(blocks.map(b => b.sets.length)).toEqual([4, 3]);
  });
});

describe('LOG2-01: dane — szablon już zepsuty (powtórzone id pozycji)', () => {
  test('migrate nadaje nowe id powtórzonym pozycjom (uniqueIds: deterministyczne „<id>~2”, pierwsza zostaje — historia wskazuje na nią); idempotentne; kopia i restart', async () => {
    const T = tpl(['Back Squat', 'Pull Up']); const dup = { ...JSON.parse(JSON.stringify(T.items[0])), sets: 2 }; T.items.splice(1, 0, dup);
    store.getState().templates.push(T); store.save(); await store.flush();
    expect(saved().templates.find(x => x.id === T.id)!.items.map(i => i.id)).toEqual(T.items.map(i => i.id)); /* stan sprzed naprawy: powtórzone id */
    const m = store.migrate(JSON.parse(JSON.stringify(saved())));
    const M = m.templates.find(x => x.id === T.id)!;
    expect(M.items.length).toBe(3); expect(M.items[0].id).toBe(T.items[0].id); expect(M.items[1].id).toBe(T.items[0].id + '~2'); expect(new Set(M.items.map(i => i.id)).size).toBe(3);
    expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
    await store.flush(); await fresh(saved());
    const T2 = store.getState().templates.find(x => x.id === T.id)!; expect(uniqueIds(T2)).toBe(true);
    expect(store.startFromTemplate(T2)).toBe(true); const bl = store.getState().active!.exercises; expect(new Set(bl.map(b => b.tplItemId)).size).toBe(3);
  });
});
