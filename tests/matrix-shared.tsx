/*
 * Wspólne dla tests/matrix-dim-*.test.tsx (podział 06.10.2026: jeden plik zajmował 2,4 GB pamięci i proces Jesta był zabijany na maszynie macOS 7 GB).
 * Macierz wymiarów (polecenie właściciela 06.10.2026: „pełen matrix możliwości”; bramka: scripts/test-matrix.mjs, sekcja WYMIAR).
 *
 * Testy kombinatoryczne iterują po LISTACH WARTOŚCI Z KODU (METRICS, SET_KINDS, MUSCLES, LANGS, EQUIPMENT, LOCATION_PRESETS, LOAD_PRESETS,
 * katalog ćwiczeń ze stanu startowego) — nowa wartość dopisana w kodzie trafia tu sama. Jednostki (UNITS) i motywy (THEMES) nie mają
 * listy w kodzie (tylko typy `Unit` / `ThemeSetting`), więc listy niżej są zbudowane z obiektu `satisfies Record<typ, 1>` — nowa wartość
 * typu bez wpisu tutaj nie przejdzie typecheck.
 *
 * Wartości oczekiwane liczone NIEZALEŻNIE od kodu aplikacji (wzory z dokumentacji: objętość = ciężar × powtórzenia × mnożnik, e1RM Epley,
 * formaty tekstu serii), a nie przez wołanie tych samych funkcji. Rozbieżność z poprawnym zachowaniem → `test.failing` z komentarzem
 * ZNALEZISKO (kodu aplikacji nie zmieniamy).
 */
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import * as store from '@/lib/store';
import * as edit from '@/lib/edit';
import * as stats from '@/lib/stats';
import { buildBackup, buildCsv, parseBackup } from '@/lib/backup';
import { addLocation, setEquip, setOpt, setLoad, equipOf, activeEquip } from '@/lib/locations';
import {
  EQUIPMENT, LOCATION_PRESETS, LOAD_PRESETS, LOCATION_PRESET_LABEL, CAPABILITIES, CAP_LABEL, equipById, capsOf, availability, loadKindsFor, loadsFor,
  implAt, implsAt, applyLoadPreset, presetEquipment, equipLabel, blankLoad, equipEntry, type EquipItem,
} from '@/lib/equipment';
import { validateSpec, specValues, type LoadSpec } from '@/lib/loads';
import { LANGS, applyLang, exName, t, tIn, lbl, lang, decimalComma, type Lang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { KG_PER_LB, wIn, wOut, wField, wInKeep, applyUnit, wu, type Unit } from '@/lib/units';
import { light, dark } from '@/lib/theme';
import { METRICS, SET_KINDS, MUSCLES, IMPLS, GROUPS, METRIC_LABEL, SET_KIND_LABEL, LOAD_MODE_LABEL, REGION_LABEL, LOAD_SOURCE_BY_EQUIPMENT, hasWeight, hasReps, hasTime, hasDistance, seedState, uid, type Exercise, type MetricType, type SetKind, type ThemeSetting, type WSet, type Workout, type Template } from '@/lib/seed';
import { renderApp, flushAll, screen, go } from './app';
import { fresh } from './helpers';


/* ---------- wymiary bez listy w kodzie (kompletność wymusza typecheck) ---------- */
export const UNITS = Object.keys({ kg: 1, lb: 1 } satisfies Record<Unit, 1>) as Unit[];
export const THEMES = Object.keys({ light: 1, dark: 1, auto: 1 } satisfies Record<ThemeSetting, 1>) as ThemeSetting[];

/* ---------- wspólne ---------- */
export const S = () => store.getState();
export const CATALOG0 = seedState('pl').exercises; /* katalog ze świeżego stanu (nazwy do test.each) */
export const isBWx = (e: Pick<Exercise, 'equipment'>) => e.equipment === 'masa ciała';
/** Mnożnik objętości wg dokumentacji (seed.ts LOAD_MODE_LABEL): per hantel / jednostronne ×2, łącznie ×1; masa ciała ×1. */
export const multOf = (e: Exercise) => isBWx(e) ? 1 : e.loadMode === 'total' ? 1 : 2;
export const epley = (load: number, reps: number) => load > 0 && reps > 0 ? (reps === 1 ? load : load * (1 + reps / 30)) : 0;
export const fmtPl = (v: number) => String(v).replace('.', ',');
export const secTxt = (s: number) => { const m = Math.floor(s / 60), r = s % 60; return m ? `${m}:${String(r).padStart(2, '0')}` : `${r}s`; };
export const distTxt = (m: number) => m >= 1000 ? `${fmtPl(m / 1000)} km` : `${m} m`;
export const setUnit = (u: Unit) => { S().settings.unit = u; store.applyPrefs(); store.save(); };
/** Prosty parser CSV (cudzysłowy, przecinki w polach). */
export function parseCsv(txt: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let f = ''; let q = false;
  for (let i = 0; i < txt.length; i++) { const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; } else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; } else f += c; }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}
export const VALS = ['weight', 'reps', 'durationSec', 'distanceM', 'addKg', 'bandId', 'kind', 'warmup', 'done'] as const;
export const valsOf = (w: Workout) => w.exercises.map(e => e.sets.map(s => VALS.map(k => s[k])));

/* ---------- reprezentanci metryk: z katalogu, po jednym na (metryka × masa ciała / tryb liczenia) ---------- */
export type Rep = { name: string; metric: MetricType; bw: boolean };
export const REPS: Rep[] = METRICS.flatMap(m => { const seen = new Set<string>(); const out: Rep[] = [];
  for (const e of CATALOG0) { if (e.metric !== m) continue; const k = isBWx(e) ? 'bw' : e.loadMode; if (seen.has(k)) continue; seen.add(k); out.push({ name: e.name, metric: m, bw: isBWx(e) }); }
  return out; });

/** Wartości serii w jednostce WYŚWIETLANIA (W, N, F, D — tak układa je addSet: rozgrzewka przed roboczymi, drop na końcu). */
export const KINDS_ORDER: SetKind[] = ['warmup', 'normal', 'failure', 'drop'];
export const W_DISP: Record<Unit, Record<SetKind, number>> = { kg: { warmup: 20, normal: 60, failure: 62.5, drop: 40 }, lb: { warmup: 45, normal: 135, failure: 137.5, drop: 90 } };
export const ADD_DISP: Record<Unit, Record<SetKind, number | ''>> = { kg: { warmup: '', normal: 10, failure: 12.5, drop: 0 }, lb: { warmup: '', normal: 20, failure: 25, drop: 0 } };
export const REPS_V: Record<SetKind, number> = { warmup: 10, normal: 8, failure: 6, drop: 12 };
export const TIME_V: Record<SetKind, number> = { warmup: 20, normal: 60, failure: 75, drop: 30 };
export const DIST_V: Record<SetKind, [number, number]> = { warmup: [400, 180], normal: [1000, 300], failure: [1500, 420], drop: [500, 200] };
export const loadDisp = (r: Rep, u: Unit, k: SetKind): number | '' => !hasWeight(r.metric) ? '' : r.bw ? ADD_DISP[u][k] : W_DISP[u][k];

/** Wypełnia serię wartościami właściwymi dla metryki (wpis jak w polu: jednostka wyświetlania → wIn). */
export function fill(ex: Exercise, r: Rep, u: Unit, s: WSet, k: SetKind) {
  const m = r.metric;
  if (hasWeight(m)) { const v = loadDisp(r, u, k); store.writeLoad(ex, s, v === '' ? '' : wIn(v)); }
  if (hasReps(m)) s.reps = REPS_V[k];
  if (m === 'distance_time') { s.distanceM = DIST_V[k][0]; s.durationSec = DIST_V[k][1]; } else if (hasTime(m)) s.durationSec = TIME_V[k];
}
/** Trening: jedno ćwiczenie, serie o rodzajach `kinds`, wszystkie odhaczone; zwraca zapisany trening. */
export function doWorkout(ex: Exercise, r: Rep, u: Unit, kinds: SetKind[], agoMs = 600e3, values = true): Workout {
  store.startEmpty(); store.addExerciseToActive(ex); const a = S().active!; a.startedAt = Date.now() - agoMs;
  while (a.exercises[0].sets.length < kinds.length) store.addSet(0);
  a.exercises[0].sets.forEach((s, i) => { s.kind = kinds[i]; s.warmup = kinds[i] === 'warmup'; if (values) fill(ex, r, u, s, kinds[i]); });
  store.save(a);
  const t0 = a.startedAt + 1000; a.exercises[0].sets.forEach((_, i) => store.toggleDone(0, i, t0 + i * 1000));
  return store.finishWorkout(t0 + kinds.length * 1000)!;
}
/** Oczekiwany opis serii (setSummary, widok historii) — niezależnie od kodu, wg formatów z dokumentacji (pl). */
export function expSummary(r: Rep, u: Unit, k: SetKind): string {
  const m = r.metric; const l = loadDisp(r, u, k);
  if (m === 'time') return secTxt(TIME_V[k]);
  if (m === 'distance_time') return `${distTxt(DIST_V[k][0])} ${secTxt(DIST_V[k][1])}`;
  if (m === 'weight_time') return `${fmtPl(Number(l) || 0)}${u}×${secTxt(TIME_V[k])}`;
  if (m === 'reps') return `${REPS_V[k]}`;
  return r.bw ? `${REPS_V[k]}${l ? '@+' + fmtPl(Number(l)) : ''}` : `${fmtPl(Number(l))}×${REPS_V[k]}`;
}

afterEach(() => { applyLang('pl'); applyUnit('kg'); });

/* ======================================================================================================================== */
