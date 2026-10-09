/*
 * Research biblioteki ćwiczeń (docs/research/25-biblioteka/L1…L6.json, docs/research/24) — wdrożenie po decyzji właściciela 09.10.2026 (ok. 00:10,
 * docs/18: wariant B). Rodzaje (docs/20): dane (każdy rekord researchu wdrożony albo w jawnym wyjątku z powodem), migracja (zmiany nazw, scalenia,
 * usunięcia, poprawki pól, sprzęt — idempotentnie, z historią, przez kopię), logika (miara ciężar + dystans, sprzęt), ekran (filtr „Podstawowe”
 * na liście Ćwiczeń, w wyborze ćwiczenia i w zamianie), języki (nazwy po zmianach w 26 językach).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as store from '@/lib/store';
import { CATALOG, MUSCLE_LOAD, CABLES, CATALOG_NICHE, CATALOG_RESEARCH, CATALOG_STEP, CATALOG_UNMAPPED } from '@/lib/catalog.generated';
import { LIB, LIB_KEYS, LIB_RENAMED, LIB_MERGED, LIB_REMOVED, LIB_BASE_NAMES, LIB_EXTRA_REV, seedState, musclesFor, metricFor, loadModeFor, isNiche, muscleConfidence, unmappedMuscleOf, hasWeight, hasDistance, hasTime, hasReps, METRICS, type State, type WSet } from '@/lib/seed';
import { presetEquipment, availability, capsOf, equipById, CAP_LABEL, EQUIP_FILL2, presetHint, fillEquip2 } from '@/lib/equipment';
import { applyLang, exName, LANGS, t } from '@/lib/i18n';
import { buildBackup, parseBackup, buildCsv } from '@/lib/backup';
import { totalKind, recordsFor } from '@/lib/stats';
import { nowParts } from '@/lib/live';
import { fresh, set, addWorkout } from './helpers';
import { loc } from './locations-fixtures';
import { renderApp, flushAll, screen, go, tap, type } from './app';

type Rec = { name: string; verdict: string; scope: string; mergeInto?: string; fixes: Record<string, unknown>; confidence: string; sources: string[]; part: string };
const research: Rec[] = [1, 2, 3, 4, 5, 6].flatMap(n => (JSON.parse(readFileSync(join(__dirname, '..', `docs/research/25-biblioteka/L${n}.json`), 'utf8')) as Rec[]).map(r => ({ ...r, part: `L${n}` })));
const catalogJson: { name: string; note?: string }[] = JSON.parse(readFileSync(join(__dirname, '..', 'docs/research/equipment/catalog.json'), 'utf8'));
const row = (n: string) => LIB.find(r => r[0] === n)!;
const final = (n: string) => LIB_RENAMED[n] ?? n;

/** Jawne wyjątki: rekord researchu, którego pole wdrożono inaczej — z powodem (decyzja właściciela 09.10.2026 do pytań otwartych). */
const EXCEPTIONS: Record<string, string> = {
  'Back Squat|secondaryMuscles': 'docs/research/24 Q1 B (rekomendacja; decyzja 09.10.2026 — pytania produktowe wg rekomendacji): + przywodziciele (wzrost zmierzony S1, S2); rekord L4 bez tej decyzji (Q-L4-5)',
};
/** Zmiany spoza rekordów — rozstrzygnięcia pytań otwartych (docs/18, 09.10.2026), scripts/equipment/apply-library-25.mjs DECISION_FIXES. */
const DECISIONS: [string, (n: string) => unknown, unknown, string][] = [
  ...['One Arm Row (hantle)', 'Bent Over Row (hantle)', 'Floor Press (hantle)'].map(n => [n, (x: string) => CATALOG[x].requires.some(g => g.includes('db') && g.includes('kb')), true, 'L5 Q1 A: kettlebell jako drugi przyrząd'] as [string, (n: string) => unknown, unknown, string]),
  ...['Wrist Curl (hantle)', 'Reverse Wrist Curl (hantle)'].map(n => [n, (x: string) => row(x)[1], 'biceps', 'L1 Q1 A: przedramiona w grupie „biceps”'] as [string, (n: string) => unknown, unknown, string]),
  ...['Handstand Push Up', 'Wall Sit', 'Wall Calf Stretch', 'Wall Lat Stretch', 'Wall Ball'].map(n => [n, (x: string) => CATALOG[x].requires.some(g => g.length === 1 && g[0] === 'wall'), true, 'L5 Q7: ściana'] as [string, (n: string) => unknown, unknown, string]),
  ['Dip Machine', (x: string) => CATALOG[x].requires, [['dip_machine']], 'L5 Q7: maszyna do dipów'],
  ['Back Squat', (x: string) => musclesFor(x, 'nogi'), [['czworogłowe'], ['pośladki', 'przywodziciele']], 'docs/24 Q1 B: przywodziciele (S1, S2)'],
  ['Leg Press', (x: string) => musclesFor(x, 'nogi'), [['czworogłowe'], ['pośladki', 'przywodziciele']], 'docs/24 Q1 B: przywodziciele (S3)'],
  ['Circus Bell', (x: string) => CATALOG[x].requires, [['circus_bell']], 'L5 Q7: circus bell (rekord researchu)'],
  ...["Farmer's Walk", 'Suitcase Carry', 'Sled Push', 'Yoke Walk', "Farmer's Walk (trap bar)", 'Bear Crawl Sled Drag'].map(n => [n, metricFor, 'weight_distance', 'L3 Q2 (a), L6 Q-L6-3: ciężar + dystans'] as [string, (n: string) => unknown, unknown, string]),
  ...['External Rotation (hantel)', 'Barbell Incline Shoulder Raise', 'Smith Machine Reverse Calf Raise', 'Hip Flexion with Band'].map(n => [n, (x: string) => !!CATALOG_UNMAPPED[x], true, 'L2 Q1/Q2/Q5: mięsień spoza mapy — oznaczenie'] as [string, (n: string) => unknown, unknown, string]),
];

describe('dane: katalog zgodny z researchem L1–L6 (każdy rekord wdrożony albo w wyjątku)', () => {
  test('854 rekordy researchu; w bibliotece 709 = ZOSTAJE + NISZOWE; scalone i usunięte znikają (krok danych je zna)', () => {
    expect(research).toHaveLength(854); expect(new Set(research.map(r => r.name)).size).toBe(854);
    const kept = research.filter(r => r.verdict !== 'SCALIĆ' && r.verdict !== 'USUNĄĆ');
    expect(LIB).toHaveLength(kept.length); expect(LIB).toHaveLength(709); expect(new Set(kept.map(r => final(r.name)))).toEqual(new Set(LIB.map(r => r[0])));
    expect(CATALOG_NICHE.size).toBe(kept.filter(r => r.scope === 'NISZOWE').length);
    for (const r of research) {
      const where = `${r.part} ${r.name}`;
      if (r.verdict === 'USUNĄĆ') { expect([where, LIB_KEYS.has(r.name), LIB_REMOVED.has(r.name)]).toEqual([where, false, true]); continue; }
      if (r.verdict === 'SCALIĆ') { expect([where, LIB_KEYS.has(r.name), LIB_MERGED[r.name]]).toEqual([where, false, final(r.mergeInto!)]); expect(LIB_KEYS.has(LIB_MERGED[r.name])).toBe(true); continue; }
      const n = final(r.name); expect([where, LIB_KEYS.has(n)]).toEqual([where, true]);
      if (r.fixes.name) expect([where, LIB_RENAMED[r.name]]).toEqual([where, r.fixes.name]);
      expect([where, CATALOG_NICHE.has(n)]).toEqual([where, r.scope === 'NISZOWE']);
      expect([where, CATALOG_RESEARCH[n]]).toEqual([where, [r.part, r.confidence, r.sources]]);
      const [, g, eq, band] = row(n); const [mu, mu2] = musclesFor(n, g);
      for (const [k, v] of Object.entries(r.fixes)) {
        if (EXCEPTIONS[`${r.name}|${k}`]) continue;
        const got = k === 'name' ? n : k === 'muscles' ? mu : k === 'secondaryMuscles' ? mu2 : k === 'group' ? g : k === 'metric' ? metricFor(n) : k === 'loadMode' ? loadModeFor(eq, n) : k === 'bandAssistable' ? !!band
          : k === 'requires' ? CATALOG[n].requires : k === 'recommended' ? CATALOG[n].recommended : k === 'pattern' ? CATALOG[n].pattern : k === 'cables' ? CABLES[n] : k === 'muscleLoad' ? MUSCLE_LOAD[n] : k === 'note' ? catalogJson.find(e => e.name === n)!.note : Symbol('nieznane pole');
        expect([where, k, got]).toEqual([where, k, v]);
      }
    }
  });
  test('rozstrzygnięcia pytań otwartych (docs/18, 09.10.2026) — wdrożone', () => {
    for (const [n, f, v, why] of DECISIONS) expect([n, why, f(n)]).toEqual([n, why, v]);
    expect(Object.keys(EXCEPTIONS)).toEqual(['Back Squat|secondaryMuscles']); /* pozostałe poprawki z rekordów wdrożone wprost */
  });
  test('pewność przypisania partii i źródła: „mocne” / „umiarkowane” ukrywają dopisek „uproszczenie”; mięsień spoza mapy ma oznaczenie', () => {
    const e = (n: string) => ({ lib: true, libKey: n });
    expect(muscleConfidence(e('Back Squat'))).toBe('mocne'); expect(muscleConfidence(e('Dead Bug'))).toBe('jedno źródło'); expect(muscleConfidence({ lib: undefined, libKey: 'Back Squat' })).toBeUndefined();
    expect(unmappedMuscleOf(e('Smith Machine Reverse Calf Raise'))).toBe('tibialis_anterior'); expect(unmappedMuscleOf(e('Back Squat'))).toBeUndefined();
    expect(musclesFor('Smith Machine Reverse Calf Raise', 'łydki')[0]).toEqual([]); expect(MUSCLE_LOAD['Smith Machine Reverse Calf Raise']).toEqual({});
  });
  test('ćwiczenia bazowe po researchu (docs/research/24 pkt 5.2): 124 (Rear Delt Raise scalone), partie, tryb, miara', () => {
    expect(LIB_BASE_NAMES.size).toBe(124); expect(LIB_BASE_NAMES.has('Upright Row (hantle)')).toBe(true); expect(LIB_BASE_NAMES.has('Rear Delt Raise (hantle)')).toBe(false);
    expect(musclesFor('Back Squat', 'nogi')).toEqual([['czworogłowe'], ['pośladki', 'przywodziciele']]); expect(musclesFor('Deadlift (sztanga)', 'plecy')).toEqual([['dwugłowe', 'pośladki'], ['plecy', 'czworogłowe']]);
    expect(musclesFor('Back Extension', 'plecy')).toEqual([['plecy', 'dwugłowe'], ['pośladki']]); expect(musclesFor('Hip Thrust (sztanga)', 'pośladki')).toEqual([['pośladki'], []]);
    expect(loadModeFor('hantle', 'Concentration Curl (hantle)')).toBe('unilateral'); expect(loadModeFor('sztanga', 'Concentration Curl (hantle)')).toBe('total'); /* inny sprzęt — tryb za sprzętem */
    expect(row('Box Jump')[1]).toBe('nogi'); expect(metricFor("Farmer's Walk")).toBe('weight_distance');
  });
});

/** Stan „sprzed researchu”: biblioteka bieżąca + ćwiczenie dawnego katalogu (klucz wycofany/przemianowany) i znacznik kroku 05.10. */
function oldState(extra: Record<string, unknown>[] = []): State {
  const s = JSON.parse(JSON.stringify(seedState('pl'))) as State; (s as State & { libExtraStep?: string }).libExtraStep = 'katalog-2026-10-05'; delete (s as Partial<State>).equipFill2;
  for (const x of extra) s.exercises.push({ ...s.exercises[0], requires: [], recommended: [], notes: '', tempo: '', restSec: null, restWarmupSec: null, archived: undefined, ...x } as never);
  return JSON.parse(JSON.stringify(s));
}
const W = (id: string, at: number, blocks: [string, Partial<WSet>[]][], extra: Record<string, unknown> = {}) => ({ id, ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: at, finishedAt: at + 3600e3, note: '',
  exercises: blocks.map(([e, ss], i) => ({ id: `${id}-b${i}`, exerciseId: e, restSec: 90, repMin: null, repMax: null, groupId: null, sets: ss.map(p => set(p)) })), ...extra });
const idem = (s: State) => { const a = store.migrate(JSON.parse(JSON.stringify(s))); const b = store.migrate(JSON.parse(JSON.stringify(a))); expect(b).toEqual(a); return a; };

describe('migracja: zmiany nazw, scalenia, usunięcia (krok katalogu 09.10.2026)', () => {
  beforeEach(async () => { await fresh(); });
  test('zmiana nazwy: nazwa kanoniczna i klucz → nowe (id, historia i rekordy bez zmian); nazwa nadana przez użytkownika zostaje', () => {
    const s = oldState([{ id: 'ur', name: 'Upright Row', libKey: 'Upright Row', lib: true, group: 'barki', equipment: 'hantle', loadMode: 'per_dumbbell' }, { id: 'ur2', name: 'Moje wiosło', libKey: 'Lateral Raise - With Bands', lib: true }]);
    s.exercises = s.exercises.filter(e => e.name !== 'Upright Row (hantle)' && e.name !== 'Band Lateral Raise');
    s.workouts = [W('w1', Date.UTC(2026, 8, 1), [['ur', [{ weight: 10, reps: 10 }]], ['ur2', [{ reps: 15 }]]])] as never;
    const m = idem(s);
    expect(m.exercises.find(e => e.id === 'ur')).toMatchObject({ name: 'Upright Row (hantle)', libKey: 'Upright Row (hantle)', lib: true });
    expect(m.exercises.find(e => e.id === 'ur2')).toMatchObject({ name: 'Moje wiosło', libKey: 'Band Lateral Raise', lib: true });
    expect(m.workouts[0].exercises.map(b => b.exerciseId)).toEqual(['ur', 'ur2']);
  });
  test('scalenie z historią: treningi, trening w toku („zamienione z”), szablony i zamienniki przechodzą na docelowe; notatka i przerwa nie giną; wpis znika', () => {
    const s = oldState([{ id: 'x', name: 'Seated Side Lateral Raise', libKey: 'Seated Side Lateral Raise', lib: true, group: 'barki', equipment: 'hantle', loadMode: 'per_dumbbell', notes: 'siedząc, oparcie', restSec: 75, tempo: '3010' }]);
    const T = s.exercises.find(e => e.name === 'Lateral Raise (hantle)')!; T.notes = 'łokcie lekko ugięte';
    const BP = s.exercises.find(e => e.name === 'Bench Press (hantle)')!;
    s.workouts = [W('w1', Date.UTC(2026, 8, 1), [['x', [{ weight: 8, reps: 12 }, { weight: 10, reps: 10 }]], [T.id, [{ weight: 9, reps: 12 }]]])] as never;
    s.active = W('a', Date.UTC(2026, 9, 8), [['x', [{ weight: 8, reps: 12, done: false }]]], { finishedAt: null }) as unknown as State['active']; (s.active!.exercises[0] as { swappedFrom?: string }).swappedFrom = T.id;
    s.templates = [{ id: 't', ownerId: 'local', createdAt: 1, updatedAt: 1, name: 'Barki', items: [{ id: 'i1', exerciseId: 'x', sets: 3, repMin: 10, repMax: 15, restSec: null, startWeight: '', targetSec: '', groupId: null }, { id: 'i2', exerciseId: BP.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, alternates: [{ locationId: 'L', exerciseId: 'x', restSec: null }] }] }] as never;
    const m = idem(s);
    expect(m.exercises.some(e => e.id === 'x' || e.name === 'Seated Side Lateral Raise')).toBe(false);
    const t2 = m.exercises.find(e => e.id === T.id)!; expect(t2).toMatchObject({ notes: 'łokcie lekko ugięte\nsiedząc, oparcie', restSec: 75, tempo: '3010' });
    expect(m.workouts[0].exercises.map(b => b.exerciseId)).toEqual([T.id, T.id]); expect(m.workouts[0].exercises[0].sets.map(x => [x.weight, x.reps])).toEqual([[8, 12], [10, 10]]);
    expect(m.active!.exercises[0].exerciseId).toBe(T.id); expect(m.active!.exercises[0].swappedFrom).toBeUndefined(); /* A→A — bez „zamienione z” */
    expect(m.templates[0].items[0].exerciseId).toBe(T.id); expect(m.templates[0].items[1].alternates).toEqual([{ locationId: 'L', exerciseId: T.id, restSec: null }]);
  });
  test('scalenie bez docelowego (usunięte na stałe): scalany wpis przejmuje klucz docelowego — to samo id i historia', () => {
    const s = oldState([{ id: 'x', name: 'Narrow Stance Leg Press', libKey: 'Narrow Stance Leg Press', lib: true, group: 'nogi', equipment: 'maszyna' }]);
    s.exercises = s.exercises.filter(e => e.name !== 'Leg Press'); s.workouts = [W('w1', Date.UTC(2026, 8, 1), [['x', [{ weight: 100, reps: 10 }]]])] as never;
    const m = idem(s); const x = m.exercises.find(e => e.id === 'x')!;
    expect(x).toMatchObject({ name: 'Leg Press', libKey: 'Leg Press', lib: true, muscles: musclesFor('Leg Press', 'nogi')[0], requires: CATALOG['Leg Press'].requires });
    expect(m.workouts[0].exercises[0].exerciseId).toBe('x');
  });
  test('scalenie zmieniające sens zapisu: ciężar zewnętrzny → dociążenie (Kettlebell Pistol Squat → Pistol Squat); masa ciała z dociążeniem → ćwiczenie z hantlami zostaje własnym', () => {
    const s = oldState([{ id: 'kp', name: 'Kettlebell Pistol Squat', libKey: 'Kettlebell Pistol Squat', lib: true, group: 'nogi', equipment: 'hantle', loadMode: 'total' },
      { id: 'su', name: 'Step-up with Knee Raise', libKey: 'Step-up with Knee Raise', lib: true, group: 'nogi', equipment: 'masa ciała', loadMode: 'total' },
      { id: 'u', name: 'Open Palm Kettlebell Clean', libKey: 'Open Palm Kettlebell Clean', lib: true, group: 'inne', equipment: 'hantle', loadMode: 'total' }]);
    s.workouts = [W('w1', Date.UTC(2026, 8, 1), [['kp', [{ weight: 12, reps: 5 }]], ['su', [{ addKg: 10, reps: 8 }]], ['u', [{ weight: 16, reps: 5 }]]])] as never;
    const m = idem(s); const pistol = m.exercises.find(e => e.name === 'Pistol Squat')!;
    expect(m.exercises.some(e => e.id === 'kp')).toBe(false); expect(m.workouts[0].exercises[0]).toMatchObject({ exerciseId: pistol.id }); expect(m.workouts[0].exercises[0].sets[0]).toMatchObject({ weight: '', addKg: 12, reps: 5 });
    expect(m.exercises.find(e => e.id === 'su')).toMatchObject({ name: 'Step-up with Knee Raise', equipment: 'masa ciała' }); expect(m.exercises.find(e => e.id === 'su')!.lib).toBeUndefined();
    expect(m.exercises.find(e => e.id === 'u')!.lib).toBeUndefined(); /* inny mnożnik objętości (łącznie ↔ jednostronnie) — zostaje własnym */
    expect(m.workouts[0].exercises.map(b => b.exerciseId).slice(1)).toEqual(['su', 'u']);
  });
  test('usunięcie: nieużyte znika; użyte w treningu albo szablonie, z notatką albo z inną nazwą — zostaje jako własne (nic nie ginie)', () => {
    const s = oldState([{ id: 'r1', name: 'Heavy Bag Thrust', libKey: 'Heavy Bag Thrust', lib: true }, { id: 'r2', name: 'Linear Acceleration Wall Drill', libKey: 'Linear Acceleration Wall Drill', lib: true },
      { id: 'r3', name: 'One Arm Floor Press', libKey: 'One Arm Floor Press', lib: true, notes: 'moje' }, { id: 'r4', name: 'Wrist Rotations with Straight Bar', libKey: 'Wrist Rotations with Straight Bar', lib: true }]);
    s.workouts = [W('w1', Date.UTC(2026, 8, 1), [['r2', [{ reps: 5 }]]])] as never;
    s.templates = [{ id: 't', ownerId: 'local', createdAt: 1, updatedAt: 1, name: 'X', items: [{ id: 'i', exerciseId: 'r4', sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }] }] as never;
    const m = idem(s); const by = (id: string) => m.exercises.find(e => e.id === id);
    expect(by('r1')).toBeUndefined();
    for (const id of ['r2', 'r3', 'r4']) { expect(by(id)).toBeTruthy(); expect(by(id)!.lib).toBeUndefined(); expect(by(id)!.libKey).toBeUndefined(); }
    expect(m.templates[0].items.map(i => i.exerciseId)).toEqual(['r4']); expect(m.workouts[0].exercises[0].exerciseId).toBe('r2');
  });
  test('poprawki pól (krok raz): domyślne partie, tryb i miara → nowe; zmienione przez użytkownika zostają; miara ćwiczenia z historią — bez zmian', () => {
    const s = oldState(); const by = (n: string) => s.exercises.find(e => e.name === n)!;
    by('Back Squat').secondaryMuscles = ['pośladki', 'dwugłowe']; by('Leg Press').secondaryMuscles = ['pośladki']; by('Deadlift (sztanga)').muscles = ['plecy', 'dwugłowe']; by('Deadlift (sztanga)').secondaryMuscles = ['pośladki', 'czworogłowe'];
    by('Hip Thrust (sztanga)').secondaryMuscles = ['core']; /* użytkownik zmienił */ by('Concentration Curl (hantle)').loadMode = 'per_dumbbell';
    by("Farmer's Walk").metric = 'weight_time'; by('Suitcase Carry').metric = 'weight_time'; by('Box Jump').group = 'cardio';
    s.workouts = [W('w1', Date.UTC(2026, 8, 1), [[by('Suitcase Carry').id, [{ weight: 20, durationSec: 60 }]]])] as never;
    const m = idem(s); const mb = (n: string) => m.exercises.find(e => e.name === n)!;
    expect(mb('Back Squat').secondaryMuscles).toEqual(['pośladki', 'przywodziciele']); expect(mb('Leg Press').secondaryMuscles).toEqual(['pośladki', 'przywodziciele']); expect(mb('Deadlift (sztanga)')).toMatchObject({ muscles: ['dwugłowe', 'pośladki'], secondaryMuscles: ['plecy', 'czworogłowe'] });
    expect(mb('Hip Thrust (sztanga)').secondaryMuscles).toEqual(['core']); expect(mb('Concentration Curl (hantle)').loadMode).toBe('unilateral'); expect(mb('Box Jump').group).toBe('nogi');
    expect(mb("Farmer's Walk").metric).toBe('weight_distance'); expect(mb('Suitcase Carry').metric).toBe('weight_time'); /* z historią czasu — nic nie znika z widoku */
    expect(m.libExtraStep).toBe(LIB_EXTRA_REV);
    const again: State = JSON.parse(JSON.stringify(m)); again.exercises.find(e => e.name === 'Back Squat')!.secondaryMuscles = ['pośladki', 'dwugłowe'];
    expect(store.migrate(again).exercises.find(e => e.name === 'Back Squat')!.secondaryMuscles).toEqual(['pośladki', 'dwugłowe']); /* ręczna zmiana po kroku zostaje */
  });
  test('kopia zapasowa ze scalonym ćwiczeniem: import przenosi dane, eksport → import bez zmian', async () => {
    const s = oldState([{ id: 'x', name: 'Narrow Stance Squats', libKey: 'Narrow Stance Squats', lib: true, group: 'nogi', equipment: 'sztanga' }]);
    s.workouts = [W('w1', Date.UTC(2026, 8, 1), [['x', [{ weight: 100, reps: 5 }]]])] as never;
    await fresh(s); const sq = store.getState().exercises.find(e => e.name === 'Back Squat')!;
    expect(store.getState().workouts[0].exercises[0].exerciseId).toBe(sq.id); expect(recordsFor(sq).maxLoad).toBe(100);
    const env = buildBackup(); const back = parseBackup(JSON.stringify(env)); expect(back.exercises).toEqual(store.getState().exercises); expect(back.workouts).toEqual(store.getState().workouts);
  });
});

describe('sprzęt: circus bell, maszyna do dipów, ściana (L5 Q7)', () => {
  test('słownik i pozycje: PL/EN, presety (siłownia: dipy i ściana; masa ciała i hotel: ściana; dom pusty; strongman poza presetem)', () => {
    for (const c of ['circus_bell', 'dip_machine', 'wall']) expect([c, !!CAP_LABEL[c]?.en]).toEqual([c, true]);
    for (const id of ['circus_bell', 'dip_machine', 'wall']) expect(!!equipById(id)).toBe(true);
    const items = (p: Parameters<typeof presetEquipment>[0]) => presetEquipment(p).map(e => e.item);
    expect(items('gym')).toEqual(expect.arrayContaining(['dip_machine', 'wall'])); expect(items('gym')).not.toContain('circus_bell');
    expect(items('bodyweight')).toEqual(['floor_mat', 'wall']); expect(items('hotel')).toContain('wall'); expect(items('home')).toEqual([]);
    expect(presetHint('bodyweight')).toBe('mata i ściana');
    const lib = seedState('pl').exercises; const av = (n: string, l: ReturnType<typeof loc>) => availability(lib.find(e => e.name === n)!, l).ok;
    const bare = loc('Park', [{ item: 'floor_mat', opts: [] }]); const wall = loc('Dom', [{ item: 'wall', opts: [] }]);
    expect(av('Handstand Push Up', bare)).toBe(false); expect(av('Handstand Push Up', wall)).toBe(true); expect(av('Push Up', bare)).toBe(true);
    expect(av('Dip Machine', loc('S', [{ item: 'triceps_ext_machine', opts: [] }]))).toBe(false); expect(av('Dip Machine', loc('S', [{ item: 'dip_machine', opts: [] }]))).toBe(true);
    expect(av('Circus Bell', loc('D', [{ item: 'db_fixed', opts: [] }]))).toBe(false); expect(av('Circus Bell', loc('D', [{ item: 'circus_bell', opts: [] }]))).toBe(true);
  });
  test('migracja raz: ściana do każdego zapisanego miejsca, maszyna do dipów tylko do miejsc z presetu siłowni; odznaczenie zostaje', () => {
    const s = oldState(); s.settings.locations = [{ ...loc('Siłownia', presetEquipment('gym').filter(e => e.item !== 'wall' && e.item !== 'dip_machine')) }, { ...loc('Dom', [{ item: 'db_fixed', opts: [] }]) }] as never; s.settings.mainLocationId = s.settings.locations[0].id;
    const m = store.migrate(JSON.parse(JSON.stringify(s))); const it = (i: number) => m.settings.locations[i].equipment.map(e => e.item);
    expect(it(0)).toEqual(expect.arrayContaining(['wall', 'dip_machine'])); expect(it(1)).toEqual(['db_fixed', 'wall']); expect(m.equipFill2).toBe(EQUIP_FILL2.rev);
    const again: State = JSON.parse(JSON.stringify(m)); again.settings.locations[1].equipment = again.settings.locations[1].equipment.filter(e => e.item !== 'wall');
    expect(store.migrate(again).settings.locations[1].equipment.map(e => e.item)).toEqual(['db_fixed']);
    expect(seedState('pl').equipFill2).toBe(EQUIP_FILL2.rev);
  });
});

describe('miara ciężar + dystans (noszenie, sanki)', () => {
  beforeEach(async () => { await fresh(); });
  test('pola serii, opis, najlepsza seria, rekordy (max ciężar, max dystans, łączny dystans), CSV i kopia', () => {
    expect(METRICS).toContain('weight_distance'); expect([hasWeight('weight_distance'), hasDistance('weight_distance'), hasTime('weight_distance'), hasReps('weight_distance')]).toEqual([true, true, false, false]);
    const fw = store.getState().exercises.find(e => e.name === "Farmer's Walk")!; expect(fw.metric).toBe('weight_distance');
    addWorkout(Date.UTC(2026, 9, 1), [["Farmer's Walk", [{ weight: 24, distanceM: 40 }, { weight: 32, distanceM: 30 }]]]);
    expect(totalKind(fw)).toBe('łączny dystans'); const r = recordsFor(fw); expect(r.maxLoad).toBe(32); expect(r.maxDistance).toBe(40); expect(r.bestTotal).toBe(70);
    expect(store.setSummary(fw, set({ weight: 32, distanceM: 30 }))).toBe('32kg×30 m');
    expect(store.setScore(fw, set({ weight: 32, distanceM: 30 }))).toBeGreaterThan(store.setScore(fw, set({ weight: 24, distanceM: 40 })));
    expect(nowParts(fw, set({ weight: 32, distanceM: 30 }))).toEqual({ num: '32', unit: 'kg', tail: ' × 30 m' });
    expect(buildCsv()).toMatch(/,Farmer's Walk,2,32,0,30,0,/);
    const back = parseBackup(JSON.stringify(buildBackup())); expect(back.workouts[0].exercises[0].sets.map(s => [s.weight, s.distanceM])).toEqual([[24, 40], [32, 30]]);
  });
  test('ekran: seria spaceru farmera ma pola ciężaru i dystansu (bez stopera); Postępy pokazują max ciężar i najdłuższy dystans', async () => {
    const fw = store.getState().exercises.find(e => e.name === "Farmer's Walk")!;
    addWorkout(Date.UTC(2026, 9, 1), [["Farmer's Walk", [{ weight: 32, distanceM: 30 }]]]);
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) });
    store.startEmpty(); store.addExerciseToActive(store.exById(fw.id)!); await flushAll(20);
    expect(screen.getAllByText('m', { includeHiddenElements: true }) /* A11-18: nagłówki kolumn ukryte przed VoiceOver */.length).toBeGreaterThan(0); expect(screen.queryByText('▶')).toBeNull();
    await go(`/more/progress?ex=${fw.id}`); await flushAll(20); expect(screen.getByText('Najdłuższy dystans')).toBeTruthy();
  });
});

describe('logika listy domyślnej (wariant B)', () => {
  test('exercisesInUse: treningi (historia, w toku, „zamienione z”) i szablony (pozycje, zamienniki); inCoreList: podstawowe, własne i użyte; libShowAll zapamiętany', async () => {
    await fresh(); const st = store.getState(); const by = (n: string) => st.exercises.find(e => e.name === n)!;
    const a = by('Svend Press'), b = by('Floor Press with Chains'), c = by('Bench Press with Chains'), d = by('Band Bench Press'), e = by('Clock Push-Up');
    expect([a, b, c, d, e].every(isNiche)).toBe(true); expect(isNiche(by('Bench Press (sztanga)'))).toBe(false);
    addWorkout(Date.UTC(2026, 9, 1), [['Floor Press with Chains', [{ weight: 60, reps: 5 }]]]);
    st.workouts[0].exercises[0].swappedFrom = c.id; st.templates.push({ id: 't', ownerId: 'local', createdAt: 1, updatedAt: 1, name: 'A', items: [{ id: 'i', exerciseId: d.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, alternates: [{ locationId: 'L', exerciseId: e.id, restSec: null }] }] }); store.save();
    const used = store.exercisesInUse(); expect([a, b, c, d, e].map(x => used.has(x.id))).toEqual([false, true, true, true, true]);
    expect(store.inCoreList(a, used)).toBe(false); expect(store.inCoreList(b, used)).toBe(true); expect(store.inCoreList(store.newExercise('Moje'), used)).toBe(true);
    expect(store.libShowAll()).toBe(false); store.setLibShowAll(true); expect(store.getState().settings.libShowAll).toBe(true); store.setLibShowAll(false); expect('libShowAll' in store.getState().settings).toBe(false);
    const raw = JSON.parse(JSON.stringify(store.getState())); raw.settings.libShowAll = 'tak'; expect(store.migrate(raw).settings.libShowAll).toBeUndefined(); raw.settings.libShowAll = true; expect(store.migrate(raw).settings.libShowAll).toBe(true);
  });
  test('fillEquip2: ściana zawsze, maszyna do dipów tylko w miejscu z presetu siłowni; bez duplikatów', () => {
    const gym = loc('G', presetEquipment('gym').filter(x => x.item !== 'wall' && x.item !== 'dip_machine')); fillEquip2(gym); fillEquip2(gym);
    expect(gym.equipment.filter(x => x.item === 'wall' || x.item === 'dip_machine').map(x => x.item).sort()).toEqual(['dip_machine', 'wall']);
    const home = loc('H', [{ item: 'triceps_ext_machine', opts: [] }]); fillEquip2(home); expect(home.equipment.map(x => x.item)).toEqual(['triceps_ext_machine', 'wall']);
  });
});

describe('ekran: filtr „Podstawowe” (lista Ćwiczeń, wybór ćwiczenia, zamiana)', () => {
  const niche = 'Svend Press'; const core = 'Bench Press (sztanga)';
  test('lista Ćwiczeń: niszowe ukryte (licznik), wyszukiwanie je pokazuje, „+ Podstawowe” pokazuje wszystkie — zapamiętane; użyte i własne zawsze', async () => {
    await fresh(); expect(isNiche(store.getState().exercises.find(e => e.name === niche)!)).toBe(true);
    const mine = store.newExercise('Moje ćwiczenie'); void mine; const used = store.getState().exercises.find(e => e.name === 'Floor Press with Chains')!; addWorkout(Date.UTC(2026, 9, 1), [['Floor Press with Chains', [{ weight: 60, reps: 5 }]]]); void used;
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())), url: '/exercises' }); await flushAll(20);
    const nicheCount = store.getState().exercises.filter(e => !e.archived && isNiche(e) && e.name !== 'Floor Press with Chains').length;
    expect(screen.getByText(t('niszowe ukryte: {n} — znajdziesz je wyszukiwaniem', { n: nicheCount }))).toBeTruthy();
    const listed = () => (screen.getByTestId('exercises-list').props.data as { kind: string; e?: { name: string } }[]).filter(r => r.kind === 'ex').map(r => r.e!.name); /* N3: lista wirtualizowana — sprawdzamy dane listy */
    expect(listed()).not.toContain(niche); expect(listed()).toContain('Moje ćwiczenie'); expect(listed()).toContain('Floor Press with Chains');
    await type(screen.getByPlaceholderText('Szukaj…'), 'svend'); await flushAll(5); expect(screen.getByText(niche)).toBeTruthy(); expect(screen.getByText('wyszukiwanie obejmuje też niszowe')).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj…'), ''); expect(screen.getByLabelText('Filtr: podstawowe ćwiczenia').props.accessibilityHint).toBe('Tapnij, by pokazać wszystkie.'); await tap(screen.getByLabelText('Filtr: podstawowe ćwiczenia')); await flushAll(5);
    expect(store.getState().settings.libShowAll).toBe(true); expect(screen.getByText('wszystkie ćwiczenia, także niszowe')).toBeTruthy();
    expect(screen.getByLabelText('Pokazane wszystkie ćwiczenia, także niszowe').props.accessibilityHint).toBe('Tapnij, by zostawić podstawowe.'); /* A11-18 */
    await tap(screen.getByLabelText('Pokazane wszystkie ćwiczenia, także niszowe')); expect(store.getState().settings.libShowAll).toBeUndefined();
  });
  test('wybór ćwiczenia do szablonu: niszowe ukryte do wyszukania; ten sam zapamiętany filtr', async () => {
    await fresh(); const st = store.getState(); st.templates.push({ id: 'tp', ownerId: 'local', createdAt: 1, updatedAt: 1, name: 'A', items: [] }); store.save();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/picker?target=template:tp'); await flushAll(20);
    expect(screen.getByText(/niszowe ukryte: \d+/)).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'svend'); await flushAll(5); expect(screen.getByText(niche)).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'bench press (szt'); await flushAll(5); expect(screen.getByText(core)).toBeTruthy();
  });
});

describe('języki: nazwy biblioteki po zmianach', () => {
  test('w każdym języku poza polskim nazwy bez polskich dopisków w nawiasach; nowe nazwy unikalne', () => {
    const lib = seedState('pl').exercises; const PL = /\((sztanga|hantle|hantel|linki|ławka|bieżnia|talerz|hantle\/linki|hantel\/linka|dwie linki)\)/;
    for (const l of LANGS.filter(x => x !== 'pl')) { applyLang(l); const names = lib.map(e => exName(e)); expect([l, names.filter(n => PL.test(n))]).toEqual([l, []]); expect(new Set(names).size).toBe(names.length); }
    applyLang('en'); expect(exName(lib.find(e => e.name === 'Lying Neck Extension (talerz)')!)).toBe('Lying Neck Extension (Plate)'); expect(exName(lib.find(e => e.name === 'Upright Row (hantle)')!)).toBe('Upright Row (Dumbbell)');
    applyLang('pl'); expect(CATALOG_STEP.rev).toBe(LIB_EXTRA_REV);
  });
});
