/* P-003 E1 — weryfikacja 2 audytu: HIGH (M3 a treningi sprzed miejsc) i 4 uwagi LOW. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as L from '@/lib/locations';
import { achievable, convertSpec, fillRange, validateSpec, rangeCount, LOAD_LIMITS, type LoadSpec } from '@/lib/loads';
import { fresh, ex, addWorkout } from './helpers';
import { renderApp, flushAll, screen, go } from './app';
import { userHome } from './locations-fixtures';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const tplOf = (names: string[], repMin = 5, repMax = 10) => { const t = store.newTemplate(); names.forEach((n, i) => t.items.push({ id: 'i' + i, exerciseId: ex(n).id, sets: 1, repMin, repMax, restSec: null, startWeight: '', targetSec: '', groupId: null })); store.save(); return t; };

describe('HIGH: treningi sprzed miejsc nie są „innym miejscem”', () => {
  test('repro: historia bez miejsc (24×10, 61×5) → pierwsze miejsce „Pełna siłownia” → start wstawia 24 i 61, ✓ zapisuje ciężar', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 24, reps: 10 }]], ['Back Squat', [{ weight: 61, reps: 5 }]]]);
    L.addLocation('gym'); const tpl = tplOf(['Bench Press (hantle)', 'Back Squat']); store.startFromTemplate(tpl);
    const a = store.getState().active!; expect(a.locationId).toBe(store.getState().settings.mainLocationId);
    expect(a.exercises.map(e => [e.sets[0].weight, e.sets[0].reps])).toEqual([[24, 10], [61, 5]]); /* 24 i 61 są poza listą siłowni (co 2,5) — mimo to wstawione */
    store.toggleDone(0, 0); expect([a.exercises[0].sets[0].weight, a.exercises[0].sets[0].reps]).toEqual([24, 10]);
    a.exercises[1].sets[0].weight = ''; a.exercises[1].sets[0].reps = ''; store.toggleDone(1, 0); expect([a.exercises[1].sets[0].weight, a.exercises[1].sets[0].reps]).toEqual([61, 5]); /* ✓ pustej serii — z podpowiedzi */
  });
  test('historia w tym samym miejscu dalej wypełnia (także wartości spoza listy)', async () => {
    await fresh(); const s = store.getState().settings; const h = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); s.locations.push(h); s.mainLocationId = h.id;
    addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 21, reps: 8 }]]]).locationId = h.id; store.save();
    store.startFromTemplate(tplOf(['Bench Press (hantle)'])); expect(store.getState().active!.exercises[0].sets[0].weight).toBe(21);
  });
  test('siatka bezpieczeństwa: ✓ pustej serii, gdy ciężar z innego miejsca wstrzymany — ani powtórzeń z podpowiedzi, ani dolnej granicy zakresu', async () => {
    await fresh(); const s = store.getState().settings; const h = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); s.locations.push(h); s.mainLocationId = h.id; const gym = L.addLocation('gym', 'Siłownia');
    addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]]]).locationId = gym.id; store.save();
    store.startEmpty(); store.addExerciseToActive(ex('Bench Press (hantle)')); const e = store.getState().active!.exercises[0]; e.repMin = 6; e.repMax = 8;
    store.toggleDone(0, 0); expect([e.sets[0].weight, e.sets[0].reps, e.sets[0].hinted]).toEqual(['', '', undefined]);
    e.sets[0].done = false; e.sets[0].weight = 22; store.toggleDone(0, 0); expect([e.sets[0].weight, e.sets[0].reps]).toEqual([22, 8]); /* wpisany ciężar — powtórzenia z podpowiedzi jak dotąd */
  });
});

describe('LOW', () => {
  const gymBar: LoadSpec = { kind: 'plates', unit: 'kg', base: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25].map(w => ({ w, n: 2 })) };
  test('1: talerze kg → lb dokładnym współczynnikiem — liczba osiągalnych ciężarów bez prawie-duplikatów', () => {
    const lb = convertSpec(gymBar, 'lb'); expect(lb.kind === 'plates' && lb.plates[6].w).toBe(2.755778);
    expect(achievable(lb)).toHaveLength(achievable(gymBar).length);
    const many: LoadSpec = { ...gymBar, plates: gymBar.kind === 'plates' ? gymBar.plates.map(p => ({ ...p, n: 8 })) : [] }; expect(achievable(convertSpec(many, 'lb'))).toHaveLength(achievable(many).length);
    const back = achievable(convertSpec(lb, 'kg')); expect(back).toEqual(achievable(gymBar));
  });
  test('2: zakres poza 0,001–1000 odrzucany w edytorze; zły opis z importu → pusty domyślny (edytor nie znika)', async () => {
    expect(fillRange([], 0, 10, 1)).toBeNull(); expect(fillRange([], 990, 1001, 1)).toBeNull(); expect(fillRange([], 1, 2, 0.0001)).toBeNull(); expect(fillRange([], 1, 3, 1)).toHaveLength(3);
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState()));
    raw.settings.locations = [{ id: 'a', name: 'X', equipment: [{ item: 'electric', opts: ['dual'], load: { kind: 'electric', min: 1, max: 10, step: 0 } }, { item: 'db_fixed', load: 'zz' }, { item: 'barbell', load: { kind: 'plates', base: 20, plates: [{ w: 0, n: 2 }] } }] }];
    const m = store.migrate(raw); const eq = m.settings.locations[0].equipment;
    expect(eq[0].load).toEqual({ kind: 'electric', unit: 'kg', min: 0, max: 0, step: 0.5 }); expect(eq[1].load).toEqual({ kind: 'list', unit: 'kg', items: [] });
    expect(eq[2].load).toEqual({ kind: 'plates', unit: 'kg', base: 20, plates: [{ w: 0, n: 2 }] }); /* dopiero dodany wiersz talerza zostaje */
  });
  test('3: zmiana jednostki stacji nie przekracza limitu ustawień (krok zaokrąglony w górę)', () => {
    const kg: LoadSpec = { kind: 'electric', unit: 'kg', min: 1, max: 940, step: 0.47 }; expect(validateSpec(kg)).toBeNull();
    const lb = convertSpec(kg, 'lb'); if (lb.kind !== 'electric') throw new Error();
    expect(rangeCount(lb.min, lb.max, lb.step)!).toBeLessThanOrEqual(LOAD_LIMITS.rangeValues); expect(validateSpec(lb)).toBeNull(); expect(lb.step).toBeCloseTo(0.47 / 0.45359237, 5); /* weryfikacja 3: krok dokładnym współczynnikiem */
    const edge: LoadSpec = { kind: 'electric', unit: 'kg', min: 0, max: 1999 * 0.47, step: 0.47 }; const e2 = convertSpec(edge, 'lb') as any; expect(rangeCount(e2.min, e2.max, e2.step)!).toBeLessThanOrEqual(LOAD_LIMITS.rangeValues);
  });
  test('4: ciężar w edytorze ma w podpowiedzi VoiceOver nazwę pozycji', async () => {
    await fresh(); const s = store.getState().settings; const h = userHome([4, 8]); s.locations.push(h); s.mainLocationId = h.id; await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/location/home'); await flushAll(10);
    const c = screen.getByLabelText('8 kg'); expect(c.props.accessibilityHint).toBe('Hantle (stała waga albo z szybką regulacją)'); expect(c.props.accessibilityRole).toBe('switch');
  });
});
