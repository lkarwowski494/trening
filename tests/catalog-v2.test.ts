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
const RULE_EXCEPTIONS: Record<string, string> = {
  'Hip Adduction': 'przywodziciele nie mają zgrubnej partii; partia z grupy „pośladki” (zapasowa) — pośladki w rzeczywistości 0,25',
};

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
