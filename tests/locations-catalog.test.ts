/* P-003 E1 (A): słownik możliwości, pozycje sprzętu, presety, dostępność ćwiczeń, katalog generowany z docs/research/equipment/catalog.json. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CAPABILITIES, CAP_LABEL, EQUIPMENT, EQUIP_GROUPS, LOCATION_PRESETS, availability, capsOf, presetEquipment, equipEntry, missingLabel, loadKindsFor, LOAD_PRESETS, equipById } from '@/lib/equipment';
import { CATALOG, CATALOG_CAPS } from '@/lib/catalog.generated';
import { LIB, seedState, equipFields } from '@/lib/seed';
import { demoTemplates } from './fixtures/demo-templates';
import { userHome, loc } from './locations-fixtures';

const root = join(__dirname, '..');
const catalog: any[] = JSON.parse(readFileSync(join(root, 'docs/research/equipment/catalog.json'), 'utf8'));

describe('katalog generowany', () => {
  test('lib/catalog.generated.ts jest aktualny względem catalog.json (gen.mjs --check)', () => {
    expect(() => execFileSync('node', [join(root, 'scripts/equipment/gen.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
  });
  test('katalog obejmuje dokładnie 270 ćwiczeń biblioteki (125 + 123 z katalogu 04.10.2026 + 22 z kroku b), z tymi samymi danymi co JSON', () => {
    expect(Object.keys(CATALOG).sort()).toEqual(LIB.map(l => l[0]).sort());
    expect(catalog).toHaveLength(270);
    for (const e of catalog) { const g = CATALOG[e.name]; expect(g.requires).toEqual(e.requires); expect(g.recommended).toEqual(e.recommended); expect(g.loadSource).toBe(e.loadSource); expect(g.pattern).toBe(e.pattern); expect(g.implements).toBe(e.implements); }
  });
  test('każdy wpis używa tylko słownika możliwości; słownik = możliwości z katalogu + kilka sprzętowych', () => {
    const vocab = new Set(CAPABILITIES);
    for (const e of catalog) for (const c of [...e.requires.flat(), ...e.recommended]) expect(vocab.has(c)).toBe(true);
    for (const c of CATALOG_CAPS) expect(vocab.has(c)).toBe(true);
  });
  test('implements: jeden hantel tylko tam, gdzie ćwiczy się jednym (One Arm Row, Concentration Curl, Kickback, Goblet…); pozostałe hantle — para', () => {
    for (const n of ['One Arm Row (hantle)', 'Concentration Curl (hantle)', 'Triceps Kickback', 'Goblet Squat', 'Hip Thrust (hantel)', 'Kettlebell Swing']) expect(CATALOG[n].implements).toBe(1);
    for (const n of ['Bench Press (hantle)', 'Deadlift (hantle)', 'RDL (hantle/linki)', "Farmer's Walk"]) expect(CATALOG[n].implements).toBe(2);
    for (const e of catalog) if (!['dumbbell', 'kettlebell'].includes(e.loadSource)) expect(e.implements).toBeUndefined();
  });
});

describe('sprzęt', () => {
  test('≈45–50 pozycji, unikalne id, każda w znanej grupie, z polską i angielską nazwą; każda daje tylko możliwości ze słownika', () => {
    expect(EQUIPMENT.length).toBeGreaterThanOrEqual(45);
    expect(new Set(EQUIPMENT.map(x => x.id)).size).toBe(EQUIPMENT.length);
    const vocab = new Set(CAPABILITIES);
    for (const x of EQUIPMENT) {
      expect(EQUIP_GROUPS).toContain(x.group); expect(x.pl.length).toBeGreaterThan(1); expect(x.en.length).toBeGreaterThan(1);
      for (const c of [...x.gives, ...(x.options ?? []).flatMap(o => o.gives)]) expect(vocab.has(c)).toBe(true);
      expect(new Set((x.options ?? []).map(o => o.id)).size).toBe((x.options ?? []).length);
    }
  });
  test('każda możliwość ze słownika ma etykietę PL i EN i da ją jakaś pozycja sprzętu', () => {
    const given = new Set(EQUIPMENT.flatMap(x => [...x.gives, ...(x.options ?? []).flatMap(o => o.gives)]));
    for (const c of CAPABILITIES) { expect(CAP_LABEL[c]?.pl).toBeTruthy(); expect(CAP_LABEL[c]?.en).toBeTruthy(); expect(given.has(c)).toBe(true); }
  });
  test('stacja z oporem elektrycznym/magnetycznym to JEDNA pozycja: zawsze wyciąg dolny; dwie linki, pas i opaski domyślnie; ramiona, ławka, lina — opcje', () => {
    expect(EQUIPMENT.filter(x => /elektryczn/.test(x.pl))).toHaveLength(1);
    const e = equipEntry('electric'); expect(e.opts.sort()).toEqual(['ankle', 'belt', 'dual']); expect(e.load).toEqual({ kind: 'electric', unit: 'kg', min: 0, max: 0, step: 0.5 });
    const caps = capsOf(loc('x', [e])); for (const c of ['cable.low', 'cable.dual', 'dip_belt', 'ankle_strap']) expect(caps.has(c)).toBe(true); expect(caps.has('cable.high')).toBe(false);
    const one = { ...e, opts: ['belt'] }; expect(capsOf(loc('x', [one])).has('cable.dual')).toBe(false); /* „jedna linka” (np. Voltra) */
    const arms = { ...e, opts: [...e.opts, 'arms'] }; expect(capsOf(loc('x', [arms])).has('cable.high')).toBe(true);
  });
  test('pozycje z ciężarami mają rodzaj i domyślny opis ciężarów; pozostałe — nie', () => {
    for (const x of EQUIPMENT) { const e = equipEntry(x.id); expect(!!x.load).toBe(!!e.load); }
    expect(equipEntry('db_fixed').load).toEqual({ kind: 'list', unit: 'kg', items: [] });
    expect(equipEntry('barbell').load).toEqual({ kind: 'plates', unit: 'kg', base: 20, plates: [] });
  });
  test('presety ciężarów modeli tylko ze źródeł; brak presetu TREXO (kroki regulacji nieznane)', () => {
    expect(LOAD_PRESETS.map(p => p.id).sort()).toEqual(['gymtek24', 'hopsport2x10', 'vishape_lite', 'vishape_pro']);
    expect(LOAD_PRESETS.some(p => /trexo/i.test(p.id + p.label))).toBe(false);
    for (const p of LOAD_PRESETS) expect(equipById(p.item)).toBeTruthy();
  });
});

describe('presety miejsc i dostępność', () => {
  const ex = seedState().exercises;
  test('„Pełna siłownia” → 270/270 dostępne', () => {
    const g = loc('Siłownia', presetEquipment('gym')); expect(ex.filter(e => availability(e, g).ok)).toHaveLength(270);
  });
  test('„Tylko masa ciała” → dokładnie ćwiczenia z pustą listą wymagań (45 od katalogu 04.10.2026; decyzja 4a)', () => {
    const b = loc('BW', presetEquipment('bodyweight')); const ok = ex.filter(e => availability(e, b).ok).map(e => e.name).sort();
    expect(ok).toEqual(catalog.filter(e => !e.requires.length).map(e => e.name).sort()); expect(ok).toHaveLength(45);
    for (const n of ['Walking Lunges', 'Reverse Lunge', 'Russian Twist']) expect(ok).toContain(n); /* 4a: bez hantli */
    expect(ok).not.toContain('Lunges (hantle)'); expect(ok).not.toContain('Step Up'); /* Step Up wymaga skrzyni/ławki */
  });
  test('„Dom” jest pusty; Hotel ma hantle, ławkę, bieżnię i rower', () => {
    expect(presetEquipment('home')).toEqual([]);
    const h = loc('Hotel', presetEquipment('hotel')); const caps = capsOf(h); for (const c of ['db', 'bench.flat', 'bench.incline', 'cardio.treadmill', 'cardio.bike']) expect(caps.has(c)).toBe(true);
    expect(LOCATION_PRESETS).toEqual(['gym', 'home', 'bodyweight', 'hotel']);
  });
  test('dom użytkownika (ławka regulowana, drążek, poręcze, 2× TREXO 24 kg, ViShape SmartGym Pro): kluczowe ćwiczenia', () => {
    const h = userHome(); const ok = (n: string) => availability(ex.find(e => e.name === n)!, h).ok;
    expect(ok('Bench Press (hantle)')).toBe(true); expect(ok('Back Squat')).toBe(false); expect(ok('Pull Up')).toBe(true); expect(ok('Chest Dip')).toBe(true);
    expect(ok('Przysiad z pasem (linki)')).toBe(true); /* przez stację elektryczną: wyciąg dolny + pas biodrowy */
    for (const n of ['Incline Bench Press (hantle)', 'RDL (hantle/linki)', 'Bulgarian Split Squat (hantle)', 'Hip Thrust (hantel)', 'Łydki na stopniu', 'Wiosłowanie na linkach (siedząc)', 'Hanging Leg Raise']) expect(ok(n)).toBe(true);
    for (const n of ['Lat Pulldown', 'Face Pull', 'Triceps Pushdown', 'Leg Press', 'Bench Press (sztanga)', 'Decline Bench Press']) expect(ok(n)).toBe(false); /* ViShape: bez wyciągu górnego */
    /* pełna lista do przejrzenia z użytkownikiem (docs/10, „Implementacja E1”) — 70 ze 125 przed katalogiem 04.10.2026, 147 z 248 po katalogu, teraz 149 z 270 (krok b: Single Arm RDL, Cable Hip Adduction) */
    expect(ex.filter(e => availability(e, h).ok)).toHaveLength(149);
    /* szablon „Legs — dom” w całości dostępny w domu */
    const sd = seedState(); const tpl = demoTemplates(sd.exercises).find(t => t.name === 'Legs — dom')!; /* szablon właściciela — dane testowe (od 03.10.2026 nie ma go w seedzie) */
    for (const i of tpl.items) expect(availability(sd.exercises.find(e => e.id === i.exerciseId)!, h).ok).toBe(true);
  });
  test('dopisek „brak: …” wymienia niespełnione grupy (w grupie alternatywy przez „/”)', () => {
    const bp = ex.find(e => e.name === 'Bench Press (sztanga)')!; const a = availability(bp, userHome());
    expect(a.missing).toEqual([['barbell'], ['rack', 'bench.uprights']]); expect(missingLabel(a.missing)).toBe('sztanga, klatka / stojaki / ławka ze stojakami');
    const ohp = ex.find(e => e.name === 'Seated Shoulder Press (hantle)')!; expect(availability(ohp, loc('x', [equipEntry('db_fixed'), equipEntry('bench_flat')])).missingRecommended).toEqual(['bench.incline']);
  });
  test('ćwiczenie własne (bez wymagań) jest zawsze dostępne — także w pustym miejscu', () => {
    expect(availability({ requires: [], recommended: [] }, loc('pusto', [])).ok).toBe(true);
    expect(availability({}, loc('pusto', [])).ok).toBe(true);
    expect(equipFields('Moje ćwiczenie', 'hantle', false)).toEqual({ requires: [], recommended: [], loadSource: 'dumbbell' });
    expect(equipFields('Bench Press (hantle)', 'hantle', false).requires).toEqual([]); /* ćwiczenie własne o nazwie z biblioteki — bez wymagań */
  });
  test('źródło obciążenia: najpierw loadSource, potem alternatywy z wymagań (RDL: hantle albo wyciąg; goblet: hantel albo kettle)', () => {
    expect(loadKindsFor(CATALOG['RDL (hantle/linki)'])).toEqual(['dumbbell', 'cable']);
    expect(loadKindsFor(CATALOG['Goblet Squat'])).toEqual(['dumbbell', 'kettlebell']);
    expect(loadKindsFor(CATALOG['Kettlebell Swing'])).toEqual(['kettlebell', 'dumbbell']);
    expect(loadKindsFor(CATALOG['Pull Up'])).toEqual([]);
  });
  test('dane: seedState ma pola sprzętowe dla wszystkich 270 ćwiczeń, zgodne z katalogiem', () => {
    for (const e of seedState().exercises) { const c = CATALOG[e.name]; expect(e.requires).toEqual(c.requires); expect(e.loadSource).toBe(c.loadSource); expect(e.pattern).toBe(c.pattern); expect(e.implements).toBe(c.implements); }
  });
});
