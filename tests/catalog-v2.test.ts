/* Katalog ćwiczeń 04.10.2026 (decyzja właściciela: rozbudowa własnego katalogu, każde ćwiczenie z obciążeniem partii; „zastosuj metody
 * weryfikacji, żeby było jak najmniej błędów”). Automatyczne reguły spójności całej biblioteki — dane w docs/research/equipment/catalog.json. */
import { CATALOG, MUSCLE_LOAD, MUSCLE_REGIONS, CABLES, CATALOG_LIB_EXTRA } from '@/lib/catalog.generated';
import { LIB, LIB_EXTRA_NAMES, seedState, musclesFor, metricFor, loadModeFor, MUSCLES_BY_NAME } from '@/lib/seed';
import { presetEquipment, availability, capsOf, implsAt, CAPABILITIES } from '@/lib/equipment';
import { exName, fold, applyLang } from '@/lib/i18n';
import { loc, userHome } from './locations-fixtures';
import * as store from '@/lib/store';
import { fresh } from './helpers';

const lib = () => seedState('pl').exercises;
/** Wyjątki od reguły „partia główna ↔ region z wagą 1” — tylko tam, gdzie zgrubna partia nie potrafi wyrazić prawdy (z uzasadnieniem). */
const RULE_EXCEPTIONS: Record<string, string> = {}; /* 04.10 wieczór: Hip Adduction ma partię „przywodziciele” — wyjątków brak */

describe('katalog ćwiczeń — spójność', () => {
  test('każde ćwiczenie biblioteki ma wpis w katalogu i obciążenie partii; nazwy unikalne (bez wielkości liter i polskich znaków), także po angielsku', () => {
    const names = LIB.map(l => l[0]);
    for (const n of names) { expect([n, !!CATALOG[n]]).toEqual([n, true]); expect([n, !!MUSCLE_LOAD[n]]).toEqual([n, true]); }
    expect(new Set(names.map(fold)).size).toBe(names.length);
    applyLang('en'); const en = lib().map(e => fold(exName(e))); applyLang('pl');
    expect(new Set(en).size).toBe(en.length);
    expect(CATALOG_LIB_EXTRA.length).toBe(LIB_EXTRA_NAMES.length); expect(names.length).toBe(125 + LIB_EXTRA_NAMES.length);
  });

  test('obciążenie partii zgodne z partiami ćwiczenia: główna → region z wagą 1, pomocnicza → region ≥ 0,5', () => {
    const bad: string[] = [];
    for (const e of lib()) {
      if (RULE_EXCEPTIONS[e.name]) continue; const ml = MUSCLE_LOAD[e.name] as Record<string, number>;
      const of = (m: string) => Object.entries(ml).filter(([r]) => (MUSCLE_REGIONS as Record<string, string | null>)[r] === m).map(([, w]) => w);
      for (const m of e.muscles) if (!of(m).some(w => w === 1)) bad.push(`${e.name}: główna ${m}`);
      for (const m of e.secondaryMuscles) if (!of(m).some(w => w >= 0.5)) bad.push(`${e.name}: pomocnicza ${m}`);
      if (e.group !== 'cardio' && !Object.values(ml).includes(1)) bad.push(`${e.name}: brak regionu głównego`);
    }
    expect(bad).toEqual([]);
  });

  test('źródło obciążenia pasuje do zgrubnego sprzętu; miara i tryb liczenia spójne; implements tylko hantle/kettle; linki — liczba linek', () => {
    const OK: Record<string, string[]> = { sztanga: ['barbell', 'ez_bar', 'trap_bar', 'smith', 'plate_loaded_machine'], hantle: ['dumbbell', 'kettlebell'], linki: ['cable'], maszyna: ['machine_stack', 'plate_loaded_machine', 'smith', 'none'], 'masa ciała': ['bodyweight', 'none', 'band'], inne: ['none', 'bodyweight', 'band', 'dumbbell', 'kettlebell', 'barbell'] };
    const bad: string[] = [];
    for (const e of lib()) {
      const c = CATALOG[e.name];
      if (!OK[e.equipment].includes(c.loadSource) && !(c.loadSource === 'bodyweight' && !e.metric.includes('weight'))) bad.push(`${e.name}: ${e.equipment} ↔ ${c.loadSource}`);
      if (c.implements !== undefined && !['dumbbell', 'kettlebell'].includes(c.loadSource)) bad.push(`${e.name}: implements`);
      if (c.implements === 2 && e.loadMode !== 'per_dumbbell' && e.loadMode !== 'total') bad.push(`${e.name}: para hantli i tryb ${e.loadMode}`); /* jeden hantel z trybem „na hantel” (One Arm Row) — zamierzone: objętość obu stron */
      const cable = c.loadSource === 'cable' || [...c.requires.flat(), ...c.recommended].some(x => x.startsWith('cable.'));
      if (cable !== (CABLES[e.name] !== undefined)) bad.push(`${e.name}: liczba linek ${CABLES[e.name]}`);
      if (e.group === 'cardio' && e.metric === 'weight_reps') bad.push(`${e.name}: cardio z ciężarem`);
    }
    expect(bad).toEqual([]);
  });

  test('dostępność: pełna siłownia ma niemal wszystko; „tylko masa ciała” — wyłącznie ćwiczenia bez obciążenia zewnętrznego; wymagania z ze słownika', () => {
    const vocab = new Set(CAPABILITIES); const gym = loc('G', presetEquipment('gym')); const bw = loc('B', presetEquipment('bodyweight'));
    const missingGym: string[] = []; const bwWrong: string[] = [];
    for (const e of lib()) {
      for (const c of [...(e.requires ?? []).flat(), ...(e.recommended ?? [])]) expect([e.name, vocab.has(c)]).toEqual([e.name, true]);
      if (!availability(e, gym).ok && e.group !== 'cardio') missingGym.push(e.name);
      /* konwencja R3 (catalog-notes): ćwiczenie zwykle bez obciążenia (wykroki, łydki na stopniu) — przyrząd tylko zalecany; dostępne bez sprzętu tylko wtedy */
      const LOAD_CAPS = ['db', 'kb', 'barbell', 'ez_bar', 'trap_bar', 'smith', 'landmine', 'med_ball'];
      if (availability(e, bw).ok && !['bodyweight', 'none', 'band'].includes(CATALOG[e.name].loadSource) && !(e.recommended ?? []).some(c => LOAD_CAPS.includes(c) || c.startsWith('cable.'))) bwWrong.push(e.name);
    }
    expect(bwWrong).toEqual([]);
    expect(missingGym.length).toBeLessThanOrEqual(Math.ceil(lib().length * 0.06)); /* siłownia z presetu nie ma np. stacji elektrycznej, GHD z opcjami */
  });

  test('stacja elektryczna (dom właściciela): każde ćwiczenie na linkach dostępne na stacji ma ją wśród przyrządów (implsAt)', () => {
    const home = userHome([2.5, 5, 10, 24]); const caps = capsOf(home); const bad: string[] = [];
    for (const e of lib()) if (CATALOG[e.name].loadSource === 'cable' && availability(e, home, caps).ok && !implsAt(e, home).includes('electric')) bad.push(e.name);
    expect(bad).toEqual([]);
  });

  test('nowe ćwiczenia: miara i partie z katalogu trafiają do biblioteki (metricFor, musclesFor, loadModeFor)', () => {
    for (const r of CATALOG_LIB_EXTRA) { expect(metricFor(r[0])).toBe(r[4]); expect(musclesFor(r[0], r[1] as never)).toEqual([r[6], r[7]]); expect(loadModeFor(r[2] as never, r[0])).toBe(r[5]); expect(MUSCLES_BY_NAME[r[0]]).toBeUndefined(); }
  });
});

describe('katalog ćwiczeń — migracja na telefonie', () => {
  test('dane schematu 15: nowe ćwiczenia dopisane raz; ćwiczenie o tej samej nazwie (także własne) nie dubluje; usunięte później nie wraca', async () => {
    const fx = require('./fixtures/state-090-schema15.json');
    await fresh(); const raw = JSON.parse(JSON.stringify(fx.state)); const first = LIB_EXTRA_NAMES[0];
    raw.exercises.push({ id: 'mine', name: first.toUpperCase(), group: 'inne', equipment: 'inne' });
    const m = store.migrate(raw); const names = m.exercises.map(e => e.name);
    expect(names.filter(n => fold(n) === fold(first))).toHaveLength(1);
    for (const n of LIB_EXTRA_NAMES.slice(1)) expect([n, names.includes(n)]).toEqual([n, true]);
    expect(m.exercises.length).toBe(fx.state.exercises.length + LIB_EXTRA_NAMES.length);
    const again = store.migrate(JSON.parse(JSON.stringify(m))); expect(again.exercises.length).toBe(m.exercises.length);
    const gone = JSON.parse(JSON.stringify(m)); gone.exercises = gone.exercises.filter((e: any) => e.name !== LIB_EXTRA_NAMES[1]);
    expect(store.migrate(gone).exercises.some(e => e.name === LIB_EXTRA_NAMES[1])).toBe(false); /* schemat 16 — bez ponownego dopisywania */
  });
});

import { REGION_LABEL, muscleLoadOf } from '@/lib/seed';
import { t } from '@/lib/i18n';
import { renderApp, flushAll, screen, go } from './app';
describe('katalog ćwiczeń — ekran', () => {
  test('nazwy regionów mają tłumaczenie EN; ekran ćwiczenia pokazuje obciążenie partii z katalogu (własne ćwiczenie — nie)', async () => {
    applyLang('en'); for (const v of Object.values(REGION_LABEL)) expect([v, t(v) !== v || ['biceps', 'triceps'].includes(v)]).toEqual([v, true]); applyLang('pl');
    await fresh(); const bp = store.getState().exercises.find(e => e.name === 'Bench Press (sztanga)')!; expect(muscleLoadOf(bp)[0]).toEqual(['chest', 1]);
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go(`/exercise/${bp.id}`); await flushAll(20);
    expect(screen.getByText('Obciążenie partii (z katalogu)')).toBeTruthy(); expect(screen.getByText(/klatka ●●●/)).toBeTruthy();
    const mine = store.newExercise('Moje'); await go(`/exercise/${mine.id}`); await flushAll(20); expect(screen.queryByText('Obciążenie partii (z katalogu)')).toBeNull();
  });
});

describe('katalog ćwiczeń — audyt 04.10 (znacznik zamiast numeru schematu)', () => {
  test('dane schematu 16 sprzed katalogu (build 01f2bee) też dostają nowe ćwiczenia — raz; nowa instalacja ma znacznik', async () => {
    const fx = require('./fixtures/state-090-schema15.json');
    await fresh(); const raw = JSON.parse(JSON.stringify(fx.state)); raw.schemaVersion = 16; /* jak po instalacji 01f2bee */
    const m = store.migrate(raw); expect(LIB_EXTRA_NAMES.every(n => m.exercises.some(e => e.name === n))).toBe(true);
    expect(store.migrate(JSON.parse(JSON.stringify(m))).exercises.length).toBe(m.exercises.length);
    expect(seedState('pl').libExtra).toBeTruthy(); expect(store.migrate(JSON.parse(JSON.stringify(seedState('pl')))).exercises.length).toBe(LIB.length);
  });
  test('kopia web 0.3: ćwiczenie własne o nazwie z nowego katalogu nie staje się ćwiczeniem biblioteki', async () => {
    await fresh(); const raw: any = { exercises: [{ id: 'x', name: LIB_EXTRA_NAMES[0], group: 'inne', equipment: 'inne' }], templates: [], workouts: [] };
    const m = store.migrate(raw); expect(m.exercises.find(e => e.id === 'x')!.lib).toBeUndefined();
  });
});

/* Decyzje właściciela 04.10.2026 (wieczór): „RDL i wiosłowanie jedną ręką jak i dwoma to dwa inne ćwiczenia”; partia „przywodziciele” — tak;
 * dopisać brakujący sprzęt i ćwiczenia — tak. */
import { MUSCLES, LIB_EXTRA_REVS, LIB_MUSCLE_FIXES } from '@/lib/seed';
import { CATALOG_CAPS } from '@/lib/catalog.generated';
import { EQUIPMENT, CAP_LABEL, loadsFor } from '@/lib/equipment';
const NEW_EQUIP = ['row_machine', 'pullover_machine', 'ab_crunch_machine', 'biceps_curl_machine', 'triceps_ext_machine', 'lateral_raise_machine', 'glute_kickback_machine', 'hip_thrust_machine', 'belt_squat', 'pendulum_squat', 'reverse_hyper', 'sled', 'battle_ropes', 'stability_ball', 'sliders', 'stair_climber', 'elliptical', 'ski_erg'];
describe('katalog ćwiczeń — decyzje 04.10 wieczór', () => {
  test('jednorącz i oburącz to osobne ćwiczenia: oburącz — dwie linki, jednorącz — jedna', () => {
    expect(CABLES['RDL (hantle/linki)']).toBe(2); expect(CABLES['Wiosłowanie na linkach (siedząc)']).toBe(2);
    expect(CABLES['Single Arm RDL (hantel/linka)']).toBe(1); expect(CABLES['Single Arm Cable Row']).toBe(1);
    const one = lib().find(e => e.name === 'Single Arm RDL (hantel/linka)')!; expect(one).toMatchObject({ implements: 1, loadMode: 'unilateral', pattern: 'hinge', muscles: ['dwugłowe'] });
    applyLang('en'); expect(exName(one)).toBe('Single Arm RDL (Dumbbell/Cable)'); applyLang('pl');
  });
  test('partia „przywodziciele”: na liście partii, region adductors → przywodziciele, bez wyjątków od reguły spójności', () => {
    expect(MUSCLES).toContain('przywodziciele'); expect(MUSCLE_REGIONS.adductors).toBe('przywodziciele'); expect(RULE_EXCEPTIONS).toEqual({});
    const by = (n: string) => lib().find(e => e.name === n)!;
    expect(by('Hip Adduction').muscles).toEqual(['przywodziciele']); expect(by('Copenhagen Plank').muscles).toEqual(['przywodziciele']); expect(by('Cable Hip Adduction').muscles).toEqual(['przywodziciele']);
    applyLang('en'); expect(t('przywodziciele')).toBe('adductors'); applyLang('pl');
  });
  test('nowy sprzęt: każda pozycja ma PL/EN, jest w pełnej siłowni i ma co najmniej jedno ćwiczenie; każda możliwość ma nazwę', () => {
    for (const id of NEW_EQUIP) { const x = EQUIPMENT.find(q => q.id === id); expect([id, !!x]).toEqual([id, true]); expect(!!(x!.pl && x!.en)).toBe(true);
      const g = loc('G', presetEquipment('gym')); const only = loc('X', [{ item: id, opts: [] }]);
      expect([id, lib().some(e => (e.requires ?? []).length > 0 && availability(e, only).ok && availability(e, g).ok)]).toEqual([id, true]); }
    for (const c of CATALOG_CAPS) expect([c, !!CAP_LABEL[c]]).toEqual([c, true]);
  });
  test('maszyny z ciężarami: ciężary z pozycji maszyny (nie z innej maszyny)', () => {
    const rm = EQUIPMENT.find(q => q.id === 'row_machine')!; expect(rm.load).toBe('machine');
    const list = (w: number) => ({ kind: 'list' as const, unit: 'kg' as const, items: [{ w, on: true }] });
    const g = loc('G', ['t_bar', 'row_machine', 'biceps_curl_machine', 'belt_squat', 'leg_press'].map((item, i) => ({ item, opts: [], load: list(10 * (i + 1)) })));
    for (const [n, item, w] of [['Machine Row', 'row_machine', 20], ['Machine Biceps Curl', 'biceps_curl_machine', 30], ['Belt Squat Machine', 'belt_squat', 40]] as const) { const r = loadsFor(lib().find(e => e.name === n)!, g); expect([n, r]).toEqual([n, { kind: 'loads', loads: [w], item }]); }
  });
});

describe('katalog ćwiczeń — migracja kroku 04.10 b', () => {
  test('dane po pierwszym kroku katalogu: dopisane tylko nowe ćwiczenia; usunięte z pierwszego kroku nie wracają; partie przywodzicieli poprawione tylko, gdy domyślne', async () => {
    expect(LIB_EXTRA_REVS).toEqual(['katalog-2026-10-04', 'katalog-2026-10-04b']);
    const b = new Set(CATALOG_LIB_EXTRA.filter(r => r[8] === 'katalog-2026-10-04b').map(r => r[0])); expect(b.size).toBe(22);
    await fresh(); const raw: any = JSON.parse(JSON.stringify(seedState('pl'))); raw.libExtra = 'katalog-2026-10-04'; delete raw.libExtraStep; /* jak dane z buildu 643cba7 */
    raw.exercises = raw.exercises.filter((e: any) => !b.has(e.name) && e.name !== 'Cossack Squat'); /* Cossack Squat (krok 1) usunięty przez użytkownika */
    const ha = raw.exercises.find((e: any) => e.name === 'Hip Adduction'); ha.muscles = ['pośladki']; ha.secondaryMuscles = [];
    const cp = raw.exercises.find((e: any) => e.name === 'Copenhagen Plank'); cp.muscles = ['core']; cp.secondaryMuscles = ['barki']; /* zmienione przez użytkownika */
    const m = store.migrate(raw); const names = m.exercises.map(e => e.name);
    for (const n of b) expect([n, names.includes(n)]).toEqual([n, true]); expect(names.includes('Cossack Squat')).toBe(false);
    expect(m).toMatchObject({ libExtra: 'katalog-2026-10-04', libExtraStep: 'katalog-2026-10-04b' }); /* audyt kroku b (MEDIUM): libExtra jak w 643cba7 */
    expect(m.exercises.find(e => e.name === 'Hip Adduction')!.muscles).toEqual(['przywodziciele']);
    expect(m.exercises.find(e => e.name === 'Copenhagen Plank')!).toMatchObject({ muscles: ['core'], secondaryMuscles: ['barki'] });
    const again = store.migrate(JSON.parse(JSON.stringify(m))); expect(again.exercises.length).toBe(m.exercises.length);
    expect(LIB_MUSCLE_FIXES.every(f => f.rev === 'katalog-2026-10-04b')).toBe(true);
  });
  test('ręczna zmiana partii po kroku b zostaje (poprawka partii tylko raz); nieznany przyszły znacznik — nic nie dopisuje', async () => {
    await fresh(); const s: any = JSON.parse(JSON.stringify(seedState('pl'))); s.exercises.find((e: any) => e.name === 'Hip Adduction').muscles = ['pośladki'];
    expect(store.migrate(s).exercises.find(e => e.name === 'Hip Adduction')!.muscles).toEqual(['pośladki']);
    const f: any = JSON.parse(JSON.stringify(seedState('pl'))); f.libExtraStep = 'katalog-2099'; f.exercises = f.exercises.filter((e: any) => e.name !== 'Machine Row');
    const m = store.migrate(f); expect(m.exercises.some(e => e.name === 'Machine Row')).toBe(false); expect(m.libExtraStep).toBe('katalog-2099');
  });
  test('dane bez znacznika (build 01f2bee / schemat 15): dopisane oba kroki; Hip Adduction z domyślną partią → przywodziciele', async () => {
    const fx = require('./fixtures/state-090-schema15.json'); await fresh(); const raw = JSON.parse(JSON.stringify(fx.state));
    const m = store.migrate(raw); expect(LIB_EXTRA_NAMES.every(n => m.exercises.some(e => e.name === n))).toBe(true);
    const ha = m.exercises.find(e => e.name === 'Hip Adduction'); if (ha) expect(ha.muscles).toEqual(['przywodziciele']);
  });
});

describe('katalog ćwiczeń — audyt kroku b (MEDIUM: powrót do starszego buildu)', () => {
  test('dane nowej wersji czytane regułą buildu 643cba7 (libExtra !== „katalog-2026-10-04” → dopisz) nie dopisują usuniętych; ponowna aktualizacja też nie', async () => {
    await fresh(); const s: any = JSON.parse(JSON.stringify(seedState('pl')));
    expect(s).toMatchObject({ libExtra: 'katalog-2026-10-04', libExtraStep: 'katalog-2026-10-04b' });
    s.exercises = s.exercises.filter((e: any) => e.name !== 'Cossack Squat' && e.name !== 'Machine Row');
    const m: any = store.migrate(s); expect(m.libExtra !== 'katalog-2026-10-04').toBe(false); /* stara reguła — nic nie dopisze */
    expect(store.migrate(JSON.parse(JSON.stringify(m))).exercises.some(e => e.name === 'Cossack Squat' || e.name === 'Machine Row')).toBe(false);
  });
});
