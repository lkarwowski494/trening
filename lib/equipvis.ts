import { getState, exById, isBW, locationById, listLocFor, pinnedImpl, liveBlockImpl } from './store';
import { loadsFor, plateSpecFor } from './equipment';
import { hasLoad } from './loads';
import { platesPerSide, type PlatePlan } from './plates';
import { hasWeight, type Exercise, type Impl, type WExercise, type WSet, type Workout } from './seed';

/*
 * Grafika sprzętu na karcie „teraz” (decyzja właściciela 07.10.2026: „Dla sztabek — na podstawie tego, co jest wpisane w serii — stos na X.
 * Dla gum — tak samo. Hantle tak samo itd.”; docs/18). Wszystko z wartości serii — nic nie jest przeliczane ani zmieniane w danych.
 * Przyrząd bloku: liveBlockImpl (miejsca), bez miejsc — z rodzaju obciążenia ćwiczenia (loadSource).
 */
export type EquipVis =
  | { kind: 'plates'; plan: PlatePlan }
  | { kind: 'stack'; kg: number; window: { kg: number; pin: boolean }[] | null }
  | { kind: 'dumbbell' | 'kettlebell'; n: 1 | 2; eachKg: number }
  | { kind: 'electric'; kg: number }
  | { kind: 'band'; color: string; level: number; role: 'resist' | 'assist' }
  | { kind: 'bodyweight'; addKg: number };

const SOURCE_IMPL: Partial<Record<NonNullable<Exercise['loadSource']>, Impl>> = { barbell: 'barbell', ez_bar: 'ez_bar', trap_bar: 'trap_bar', dumbbell: 'dumbbell', kettlebell: 'kettlebell', cable: 'cable', machine_stack: 'machine' };
/** Przyrząd bloku: z miejsca treningu albo (bez miejsc) z rodzaju obciążenia ćwiczenia. Maszyna z talerzami (plate_loaded) — bez grafiki stosu. */
export function implFor(w: Workout, e: WExercise): Impl | undefined {
  const ex = exById(e.exerciseId); if (!ex) return undefined;
  return liveBlockImpl(e, w.locationId) ?? (ex.loadSource ? SOURCE_IMPL[ex.loadSource] : undefined);
}
/** Okno stosu: do 5 sąsiednich wartości listy ciężarów miejsca wokół wpisanej (bolec na niej); wartości spoza listy albo bez listy — null. */
export function stackWindow(loads: readonly number[], kg: number, size = 5): { kg: number; pin: boolean }[] | null {
  const i = loads.findIndex(v => hasLoad([v], kg)); if (i < 0) return null;
  const half = Math.floor(size / 2); const from = Math.max(0, Math.min(i - half, loads.length - size)); const to = Math.min(loads.length, from + size);
  return loads.slice(from, to).map((v, j) => ({ kg: v, pin: from + j === i }));
}

/** Grafiki dla serii (kolejność wyświetlania): obciążenie przyrządu, potem guma. Pusta lista — bez grafiki (sama liczba na karcie). */
export function equipVisFor(w: Workout, e: WExercise, set: WSet): EquipVis[] {
  const ex = exById(e.exerciseId); if (!ex) return [];
  const out: EquipVis[] = []; const m = ex.metric ?? 'weight_reps'; const kg = typeof set.weight === 'number' && set.weight > 0 ? set.weight : null;
  if (isBW(ex)) { const a = Number(set.addKg); if (hasWeight(m) && set.addKg !== '' && set.addKg != null && a) out.push({ kind: 'bodyweight', addKg: a }); }
  else if (hasWeight(m) && kg != null) {
    const impl = implFor(w, e); const loc = locationById(listLocFor(e, w.locationId));
    if (impl === 'barbell' || impl === 'ez_bar' || impl === 'trap_bar') { const plan = platesPerSide(kg, plateSpecFor(ex, loc, pinnedImpl(e))); if (plan) out.push({ kind: 'plates', plan }); }
    else if (impl === 'dumbbell' || impl === 'kettlebell') { const mode = ex.loadMode ?? 'total'; out.push(mode === 'unilateral' ? { kind: impl, n: 1, eachKg: kg } : mode === 'per_dumbbell' ? { kind: impl, n: 2, eachKg: kg } : { kind: impl, n: (ex.implements ?? 1) === 2 ? 2 : 1, eachKg: (ex.implements ?? 1) === 2 ? kg / 2 : kg }); }
    else if (impl === 'electric') out.push({ kind: 'electric', kg });
    else if (impl === 'machine' || impl === 'cable') { const l = loadsFor(ex, loc, pinnedImpl(e)); out.push({ kind: 'stack', kg, window: l.kind === 'loads' ? stackWindow(l.loads, kg) : null }); }
  }
  if (set.bandId) { const b = getState().bands.find(x => x.id === set.bandId); if (b) out.push({ kind: 'band', color: b.color, level: b.level, role: isBW(ex) && ex.bandAssistable ? 'assist' : 'resist' }); }
  return out;
}

/** Kolor gumy na rysunku z nazwy (dowolny tekst użytkownika): znane nazwy po polsku i angielsku; inne — null (szary pasek z nazwą). */
const BAND_HEX: Record<string, string> = {
  czerwona: '#D7263D', red: '#D7263D', czarna: '#15171A', black: '#15171A', fioletowa: '#6B3FA0', purple: '#6B3FA0', violet: '#6B3FA0',
  zielona: '#2E9E5B', green: '#2E9E5B', niebieska: '#1F5FD1', blue: '#1F5FD1', 'żółta': '#F2C230', yellow: '#F2C230',
  'pomarańczowa': '#E8590C', orange: '#E8590C', szara: '#8A8D93', grey: '#8A8D93', gray: '#8A8D93', 'różowa': '#E0619A', pink: '#E0619A',
  'brązowa': '#7A4E2D', brown: '#7A4E2D', 'biała': '#FFFFFF', white: '#FFFFFF',
};
export const bandHex = (color: string): string | null => BAND_HEX[color.trim().toLowerCase()] ?? null;
