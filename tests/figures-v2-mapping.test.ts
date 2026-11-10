/*
 * Figury v2 — przypisanie 709 ćwiczeń katalogu do rodzin ruchu (grafiki ćwiczeń 1.0, decyzja właściciela 25.10.2026). Rodzaje (docs/20): dane i macierz — KAŻDE ćwiczenie
 * ma rodzinę, gotowe rodziny mają wariant dla każdego swojego ćwiczenia (i nic ponadto), liczności rodzin są znane (zmiana = świadoma), reguły nie mylą nazw.
 * Zadanie dla agentów rodzin: zmieniając reguły, aktualizuj liczności tutaj i dokument docs/51 (node scripts/figures/v2-gen.mjs --write).
 */
import { PLANNED_Z_DANYMI } from './helpers/rodziny-planned';
import fs from 'fs';
import path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { FAMILIES, FAMILY, OVERRIDES, familyOf, assignAll, VARIANTS, POSE_FAMILIES, DATA_UI, poseKeys, poseFile, dataUiForPose, figureSpec, staticPositions, boxFor, shapesAt, type FamilyId } from '@/lib/figures/v2';

const ALL = assignAll();
const KEYS = Object.keys(CATALOG);
const count = (id: FamilyId): number => KEYS.filter(k => ALL[k] === id).length;

/** Liczności rodzin (stan 25.10.2026, 709 ćwiczeń). */
const EXPECTED: Record<FamilyId, number> = {
  squat: 25, bench_press: 30, hinge: 32, pushup_plank: 30, dip: 5, overhead_press: 23, row: 13, cable_row: 10, pull_up: 13, pulldown: 8, lunge: 24, leg_machine: 8, leg_isolation: 14, calf_raise: 13,
  hip_bridge: 11, kb_ballistic: 17, olympic: 25, back_extension: 4, curl: 36, triceps: 32, delt_raise: 38, chest_fly: 20, shrug: 8, rotator_cuff: 8, core_floor: 44, core_hang: 4, core_standing: 19,
  carry: 7, cardio: 16, plyo: 28, sled_throw: 19, strongman: 10, glute_floor: 7, hip_abd_add: 8, mobility_stand: 36, mobility_floor: 22, foam_roll: 10, neck: 5, forearm: 13, thruster: 3, chest_press_machine: 5, cable_press: 4, kneeling_hinge: 2,
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
      'Push Press - Behind the Neck': 'overhead_press', 'Standing Barbell Press Behind Neck': 'overhead_press', 'Wide-Grip Pulldown Behind The Neck': 'pulldown', 'Standing Calf Raise': 'calf_raise', 'Leg Curl': 'leg_isolation', 'Cable Fly': 'chest_fly', 'Lateral Raise (hantle)': 'delt_raise', 'Plank': 'pushup_plank', 'Crunch': 'core_floor', 'Hanging Leg Raise': 'core_hang',
    };
    for (const [k, f] of Object.entries(want)) expect([k, ALL[k]]).toEqual([k, f]);
  });
  test('gotowe rodziny z rigiem (przysiad, wyciskanie leżąc, zawias): 87 ćwiczeń (12,3% biblioteki), każde ma wariant tej samej rodziny; brak wariantów osieroconych', () => {
    const ready = FAMILIES.filter(f => f.status === 'ready').map(f => f.id); expect(ready).toEqual(['squat', 'bench_press', 'hinge', 'pushup_plank', 'dip', 'overhead_press', 'row', 'cable_row', 'pull_up', 'pulldown', 'leg_machine', 'calf_raise', 'hip_bridge', 'kb_ballistic', 'olympic', 'back_extension', 'curl', 'triceps', 'delt_raise', 'chest_fly', 'shrug', 'rotator_cuff', 'core_hang', 'core_standing', 'carry', 'sled_throw', 'strongman', 'hip_abd_add', 'mobility_stand', 'mobility_floor', 'forearm', 'thruster', 'chest_press_machine', 'cable_press', 'kneeling_hinge']) /* 10.11.2026: + kb_ballistic ready po czystej r4 (audytor, sha 97edf91fc18d) */; /* 10.11.2026: + overhead_press ready po czystej r3 (audytor, sha 065ae12bd57d). 10.11.2026 (scalenie z integracją): + cable_row i hip_bridge ready 09.11.2026 (partia 2). chest_fly ready po czystej r2. 09.11.2026 (partia 1): kb_ballistic r2, chest_fly r1, overhead_press r1 „do poprawy” (WYSOKIE) — rodziny wracają do planned do czystej recenzji (dane póz i nakładka zostają)  + pulldown, leg_machine, shrug, hip_abd_add (partia 3, 09.11.2026; scalenie z integracją 10.11.2026) */ /* partia 4 (09–10.11.2026, scalenie 10.11.2026): + dip, back_extension, thruster, chest_press_machine, cable_press ready */ /* partia 2 (scalenie 10.11.2026): + pushup_plank, mobility_stand, mobility_floor ready */ /* 10.11.2026 (sesja B, scalenie z integracją): + rotator_cuff, core_hang, carry, forearm, kneeling_hinge (partia 5; scalenie z partiami 1–4 i 2 na scal/pociag-5 10.11.2026) */ /* 10.11.2026 (scalenie partii 8 z pociągiem-5): + core_standing, sled_throw, strongman */
    const rig = ready.filter(f => !POSE_FAMILIES.includes(f)); expect(rig).toEqual(['squat', 'bench_press', 'hinge']);
    const keys = KEYS.filter(k => rig.includes(ALL[k])); expect(keys.length).toBe(87);
    for (const k of keys) { expect([k, VARIANTS[k]?.family]).toEqual([k, ALL[k]]); expect([k, figureSpec(k)?.family]).toEqual([k, ALL[k]]); }
    expect(Object.keys(VARIANTS).sort()).toEqual([...keys].sort());
  });
  test('gotowe rodziny z danych (poses/<rodzina>.json): figura tylko dla ćwiczeń z wpisem w danych (11 z 13 w pull_up), reszta bez figury v2 (v1 albo brak); status „gotowa” = plik póz', () => {
    expect(POSE_FAMILIES).toEqual(['pull_up', 'curl', 'olympic', 'triceps', 'pulldown', 'shrug', 'hip_abd_add', 'leg_machine', 'calf_raise', 'kb_ballistic', 'hip_bridge', 'cable_row', 'delt_raise', 'row', 'chest_fly', 'overhead_press', 'dip', 'chest_press_machine', 'cable_press', 'back_extension', 'thruster', 'pushup_plank', 'mobility_floor', 'mobility_stand', 'rotator_cuff', 'forearm', 'carry', 'sled_throw', 'core_standing', 'strongman', 'core_hang', 'kneeling_hinge']); /* partia 2 (scalenie 10.11.2026): + pushup_plank, mobility_floor, mobility_stand */ /* 10.11.2026 (scalenie z integracją): + pulldown, shrug, hip_abd_add, leg_machine (partia 3, 09.11.2026); + dip, chest_press_machine, cable_press, back_extension, thruster (partia 4, 09–10.11.2026) */ /* 10.11.2026 (sesja B, scalenie z integracją): + forearm, carry, core_hang, kneeling_hinge, rotator_cuff (partia 5; scal/pociag-5) */ /* 10.11.2026 (scalenie partii 8 z pociągiem-5): + core_standing, sled_throw, strongman */
    /* 09.11.2026 (partia 1, decyzja w docs/18): rodziny z danymi póz po recenzji „do poprawy” wracają do planned (dane i nakładka zostają) — bez żadnej figury v2 do czystej rundy */
    for (const f of PLANNED_Z_DANYMI) { expect([f, FAMILY[f as FamilyId].status]).toEqual([f, 'planned']); for (const k of KEYS.filter(x => ALL[x] === f)) expect([k, figureSpec(k)]).toEqual([k, null]); }
    for (const f of POSE_FAMILIES.filter(x => !PLANNED_Z_DANYMI.includes(x))) {
      expect([f, FAMILY[f as FamilyId].status]).toEqual([f, 'ready']); for (const kk of poseKeys(f)) expect([kk, !!dataUiForPose(f, poseFile(f)!.cwiczenia[kk])]).toEqual([kk, true]); /* partia 8: prezentacja domyślna (sled_throw) albo DATA_UI */
      const keys = KEYS.filter(k => ALL[k] === f); const have = poseKeys(f);
      for (const k of have) expect([k, ALL[k]]).toEqual([k, f]); /* wpis w danych tylko dla ćwiczenia tej rodziny */
      for (const k of keys) { const sp = figureSpec(k); expect([k, sp === null]).toEqual([k, !have.includes(k)]); if (sp) { expect(sp.family).toBe(f); expect('data' in sp.variant).toBe(true); expect(VARIANTS[k]).toBeUndefined(); } }
    }
    expect(KEYS.filter(k => ALL[k] === 'pull_up' && !figureSpec(k)).sort()).toEqual(['Muscle Up', 'Rope Climb']);
    expect(KEYS.filter(k => ALL[k] === 'olympic' && !figureSpec(k))).toEqual(['Rack Delivery']);
    expect(KEYS.filter(k => figureSpec(k)).length).toBe(87 + 11 + 34 + 24 + 29 + 12 + 31 + 12 + 17 + 10 + 9 + 21 + 8 + 8 + 4 + 6 + 16 + 5 + 5 + 4 + 3 + 3 + 18 + 9 + 8 + 11 + 7 + 3 + 1 + 7 + 16 + 8 + 1); /* partia 2 (scalenie 10.11.2026): + pushup_plank (18 z 30 z danych), mobility_floor (9 z 22), mobility_stand (8 z 36) */ /* 10.11.2026: + kb_ballistic (16 z 17, r4 wyswietlana; Kettlebell Pirate Ships bez rysunku). */ /* 10.11.2026: + overhead_press (21 z 23, r3 wyswietlana). 10.11.2026 (scalenie): + hip_bridge (10 z 11, London Bridges bez rysunku) i cable_row (9 z 10, Sled Row bez pozy) z partii 2 (09.11.2026); + chest_fly (17, r2 wyswietlana).  09.11.2026: kb_ballistic (16), chest_fly (17), overhead_press (21) — planned do czystej recenzji; + overhead_press z danych (09.11.2026, partia 1: 21 z 23; Bradford Press i Handstand Push Up bez rysunku — brak źródła ruchu); + chest_fly z danych (09.11.2026, partia 1: 17 z 20; Around The Worlds, Machine Pullover, Svend Press bez rysunku — brak źródła ruchu); + row z danych (09.11.2026, partia 1: 12 z 13, Meadows Row bez rysunku — landmine); + delt_raise z danych (09.11.2026, ZB-042: 31 z 38, 7 bez rysunku); + kb_ballistic z danych (09.11.2026: 16 z 17, Kettlebell Pirate Ships bez rysunku: ćwiczenie otwarte w figury-sens.json); + calf_raise z danych (09.11.2026: 12 z 13, Smith Machine Reverse Calf Raise bez rysunku: ruch odwrotny, wpis „open” w figury-sens.json); */ /* + curl z danych (03.11.2026); + olympic z danych (04.11.2026, K1: 24 z 25, Rack Delivery bez rysunku); + triceps z danych (04.11.2026, K1) */ /* 10.11.2026 (scalenie z integracją): + 8 + 8 + 4 + 6 = pulldown, shrug, hip_abd_add, leg_machine z danych (partia 3, 09.11.2026: 8 z 8, 8 z 8, 4 z 8 — marsze z gumą wstrzymane, 6 z 8 — Calf Press wyjątek bez animacji, Smith Machine Leg Press bez pozy) */ /* partia 4 (scalenie 10.11.2026): + dip (5 z 5), chest_press_machine (5 z 5), cable_press (4 z 4), back_extension (3 z 4: Weighted Ball Hyperextension bez rysunku), thruster (3) z danych */ /* 10.11.2026 (partia 5, scalenie z integracją na scal/pociag-5): + forearm 11, carry 7, core_hang 3, kneeling_hinge 1, rotator_cuff 7 */ /* 10.11.2026 (scalenie partii 8 z pociągiem-5): + core_standing, sled_throw, strongman (core_standing 16, sled_throw 8, strongman 1) */
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
    const doc = /ok\. \*\*(\d+) h pracy agenta\*\*/.exec(fs.readFileSync(path.join(__dirname, '..', 'docs/51-figury-v2-pokrycie.md'), 'utf8'));
    expect(Number(doc![1])).toBe(sum); expect(sum).toBeGreaterThanOrEqual(0); expect(sum).toBeLessThan(200); /* 09.11.2026 (partia 3 + delt_raise): pozostałe rodziny maleją, dolny próg 100 h zastąpiony zgodnością z docs/51 */ /* 10.11.2026 (scalenie): dolny próg 100 h zdjęty (partia 1, 09.11.2026), zgodność z docs/51 zostaje */
  });
});
