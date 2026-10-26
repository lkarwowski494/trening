/*
 * Figury v2 — przypisanie 709 ćwiczeń katalogu do rodzin ruchu (grafiki ćwiczeń 1.0, decyzja właściciela 25.10.2026). Rodzaje (docs/20): dane i macierz — KAŻDE ćwiczenie
 * ma rodzinę, gotowe rodziny mają wariant dla każdego swojego ćwiczenia (i nic ponadto), liczności rodzin są znane (zmiana = świadoma), reguły nie mylą nazw.
 * Zadanie dla agentów rodzin: zmieniając reguły, aktualizuj liczności tutaj i dokument docs/51 (node scripts/figures/v2-gen.mjs --write).
 */
import { CATALOG } from '@/lib/catalog.generated';
import { FAMILIES, FAMILY, OVERRIDES, familyOf, assignAll, VARIANTS, POSE_FAMILIES, DATA_UI, poseKeys, figureSpec, staticPositions, boxFor, shapesAt, type FamilyId } from '@/lib/figures/v2';

const ALL = assignAll();
const KEYS = Object.keys(CATALOG);
const count = (id: FamilyId): number => KEYS.filter(k => ALL[k] === id).length;

/** Liczności rodzin (stan 25.10.2026, 709 ćwiczeń). */
const EXPECTED: Record<FamilyId, number> = {
  squat: 25, bench_press: 30, hinge: 32, pushup_plank: 30, dip: 5, overhead_press: 21, row: 13, cable_row: 10, pull_up: 13, pulldown: 7, lunge: 24, leg_machine: 8, leg_isolation: 14, calf_raise: 13,
  hip_bridge: 11, kb_ballistic: 17, olympic: 25, back_extension: 4, curl: 36, triceps: 32, delt_raise: 38, chest_fly: 20, shrug: 8, rotator_cuff: 8, core_floor: 44, core_hang: 4, core_standing: 19,
  carry: 7, cardio: 16, plyo: 28, sled_throw: 19, strongman: 10, glute_floor: 7, hip_abd_add: 8, mobility_stand: 36, mobility_floor: 22, foam_roll: 11, neck: 8, forearm: 12, thruster: 3, chest_press_machine: 5, cable_press: 4, kneeling_hinge: 2,
};

describe('rodziny ruchu i przypisanie ćwiczeń', () => {
  test('709 ćwiczeń, 43 rodziny; każde ćwiczenie ma dokładnie jedną rodzinę z listy; sumy liczności zgadzają się', () => {
    expect(KEYS.length).toBe(709); expect(FAMILIES.length).toBe(43); expect(new Set(FAMILIES.map(f => f.id)).size).toBe(43);
    for (const k of KEYS) expect([k, FAMILY[ALL[k]] !== undefined]).toEqual([k, true]);
    expect(Object.values(EXPECTED).reduce((a, b) => a + b, 0)).toBe(709);
    for (const f of FAMILIES) expect([f.id, count(f.id)]).toEqual([f.id, EXPECTED[f.id]]);
  });
  test('familyOf zgadza się z assignAll, a jawne wyjątki (OVERRIDES) wskazują istniejące ćwiczenia i wygrywają z regułami', () => {
    for (const k of KEYS) expect(familyOf(k)).toBe(ALL[k]);
    for (const [k, f] of Object.entries(OVERRIDES)) { expect([k, k in CATALOG]).toEqual([k, true]); expect(ALL[k]).toBe(f); }
  });
  test('reguły nie mylą nazw (błędy z pierwszej wersji reguł): „chin” w „machine”, „push” w „pushdown”, „press” w „Pallof Press”, „drag” w „Drag Curl”', () => {
    const want: Record<string, FamilyId> = {
      'Push Up': 'pushup_plank', 'Triceps Pushdown': 'triceps', 'Machine Row': 'cable_row', 'Machine Biceps Curl': 'curl', 'Chin Up': 'pull_up', 'Pull Up': 'pull_up', 'Pallof Press': 'core_standing',
      'Drag Curl': 'curl', 'Dragon Flag': 'core_floor', 'Leg Press': 'leg_machine', 'Hack Squat': 'leg_machine', 'Barbell Hack Squat': 'squat', 'Thruster (hantle)': 'thruster', 'Jerk Dip Squat': 'olympic',
      'Snatch Balance': 'olympic', 'Clean Deadlift': 'hinge', 'Snatch Deadlift': 'hinge', 'Hip Thrust (sztanga)': 'hip_bridge', 'Kettlebell Swing': 'kb_ballistic', 'Back Extension': 'back_extension',
      'Cable Overhead Extension': 'triceps', 'Chest Dip': 'dip', 'Machine Chest Press': 'chest_press_machine', 'Lat Pulldown': 'pulldown', 'Sled Push': 'sled_throw', 'Box Jump': 'plyo', 'Farmer\'s Walk': 'carry',
      'Standing Calf Raise': 'calf_raise', 'Leg Curl': 'leg_isolation', 'Cable Fly': 'chest_fly', 'Lateral Raise (hantle)': 'delt_raise', 'Plank': 'pushup_plank', 'Crunch': 'core_floor', 'Hanging Leg Raise': 'core_hang',
    };
    for (const [k, f] of Object.entries(want)) expect([k, ALL[k]]).toEqual([k, f]);
  });
  test('gotowe rodziny z rigiem (przysiad, wyciskanie leżąc, zawias): 87 ćwiczeń (12,3% biblioteki), każde ma wariant tej samej rodziny; brak wariantów osieroconych', () => {
    const ready = FAMILIES.filter(f => f.status === 'ready').map(f => f.id); expect(ready).toEqual(['squat', 'bench_press', 'hinge', 'pull_up']);
    const rig = ready.filter(f => !POSE_FAMILIES.includes(f)); expect(rig).toEqual(['squat', 'bench_press', 'hinge']);
    const keys = KEYS.filter(k => rig.includes(ALL[k])); expect(keys.length).toBe(87);
    for (const k of keys) { expect([k, VARIANTS[k]?.family]).toEqual([k, ALL[k]]); expect([k, figureSpec(k)?.family]).toEqual([k, ALL[k]]); }
    expect(Object.keys(VARIANTS).sort()).toEqual([...keys].sort());
  });
  test('gotowe rodziny z danych (poses/<rodzina>.json): figura tylko dla ćwiczeń z wpisem w danych (11 z 13 w pull_up), reszta bez figury v2 (v1 albo brak); status „gotowa” = plik póz', () => {
    expect(POSE_FAMILIES).toEqual(['pull_up']);
    for (const f of POSE_FAMILIES) {
      expect([f, FAMILY[f as FamilyId].status]).toEqual([f, 'ready']); expect([f, !!DATA_UI[f]]).toEqual([f, true]);
      const keys = KEYS.filter(k => ALL[k] === f); const have = poseKeys(f);
      for (const k of have) expect([k, ALL[k]]).toEqual([k, f]); /* wpis w danych tylko dla ćwiczenia tej rodziny */
      for (const k of keys) { const sp = figureSpec(k); expect([k, sp === null]).toEqual([k, !have.includes(k)]); if (sp) { expect(sp.family).toBe(f); expect('data' in sp.variant).toBe(true); expect(VARIANTS[k]).toBeUndefined(); } }
    }
    expect(KEYS.filter(k => ALL[k] === 'pull_up' && !figureSpec(k)).sort()).toEqual(['Muscle Up', 'Rope Climb']);
    expect(KEYS.filter(k => figureSpec(k)).length).toBe(87 + 11);
  });
  test('planowane rodziny: brak figury (figureSpec = null), szacunek pracy i widoki opisane; klucz spoza katalogu → null', () => {
    for (const f of FAMILIES.filter(x => x.status === 'planned')) { expect([f.id, f.effort > 0, f.views.length > 0, f.label.length >= 5]).toEqual([f.id, true, true, true]); }
    for (const k of KEYS.filter(x => FAMILY[ALL[x]].status === 'planned')) expect(figureSpec(k)).toBeNull();
    expect(figureSpec('Ćwiczenie własne')).toBeNull();
  });
  test('specyfikacja: widoki rodziny, izometria (siad przy ścianie) = jedna pozycja statyczna, reszta start i koniec; kadr obejmuje wszystkie klatki', () => {
    const wall = figureSpec('Wall Sit')!; expect(wall.static).toBe(true); expect(staticPositions(wall)).toEqual([1]);
    const sq = figureSpec('Back Squat')!; expect(sq.static).toBe(false); expect(staticPositions(sq)).toEqual([0, 1]); expect(sq.views).toEqual(['side', 'front']); expect(figureSpec('Bench Press (sztanga)')!.views).toEqual(['side', 'top']);
    expect(figureSpec('Deadlift (sztanga)')!.lowerFirst).toBe(false); expect(figureSpec('RDL (sztanga)')!.lowerFirst).toBe(true); expect(sq.lowerFirst).toBe(true);
    const box = boxFor(sq, 'side'); expect(boxFor(sq, 'side')).toBe(box); expect(box.w).toBeGreaterThan(50); expect(box.h).toBeGreaterThan(150);
    expect(shapesAt(sq, 0.5, 'side', true).length).toBeGreaterThan(shapesAt(sq, 0.5, 'side').length);
  });
  test('szacunek pracy pozostałych rodzin: suma godzin pracy agenta jest policzona w dokumencie (docs/51) i zgadza się z kodem', () => {
    const sum = FAMILIES.filter(f => f.status === 'planned').reduce((s, f) => s + f.effort, 0);
    expect(sum).toBeGreaterThan(100); expect(sum).toBeLessThan(200);
  });
});
