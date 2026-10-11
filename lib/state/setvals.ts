/*
 * Wartości serii: pusta seria, kopiowanie wartości, pola używane przez metrykę ćwiczenia (czyszczenie reszty), wartości wstawione przez
 * aplikację (pre — decyzja 02.10.2026, audyt B2) i reguła „asysty gumą nie da się odtworzyć”.
 * Zależy od: ./sets; zewnętrzne: ../seed.
 */
import { uid, hasTime, hasReps, hasWeight, hasDistance, type WSet, type Exercise } from '../seed';
import { bandById, isBW, usesBand } from './sets';

export const blankSet = (): WSet => ({ id: uid(), weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal',
    warmup: false, note: '', done: false, completedAt: null, actualRest: null });
/** Kopiuje wartości serii (bez statusu) — używane przy autouzupełnianiu z „poprzednio” i z poprzedniej serii. */
const copyVals = (from: Partial<WSet> | null | undefined): Partial<WSet> => from
    ? { weight: from.weight ?? '', reps: from.reps ?? '', durationSec: from.durationSec ?? '', distanceM: from.distanceM ?? '', bandId: from.bandId ?? '',
    addKg: from.addKg ?? '' } : {};
export const VAL_KEYS = ['weight', 'reps', 'durationSec', 'distanceM', 'addKg'] as const;
/* Decyzja 02.10.2026 (audyt B2, „przenieś na nieruszone”): wartości wstawione przez aplikację na starcie zapamiętane w s.pre.
 * Gdy odhaczona seria ma wartość inną niż jej wstępna, dalsze nieodhaczone serie tej samej rodziny, nietknięte ręcznie
 * i wciąż z tą samą wartością wstępną, dostają nową wartość (24 → 25 kg na wszystkich). Piramidy (różne wartości) zostają. */
export const PRE_KEYS = ['weight', 'reps', 'distanceM', 'addKg'] as const;
export function markPre(s: WSet): WSet {
  const p: NonNullable<WSet['pre']> = {};
  for (const k of PRE_KEYS) if (typeof s[k] === 'number') p[k] = s[k] as number;
  if (Object.keys(p).length) s.pre = p; else delete s.pre;
  return s;
}
/** Runda 10: pola wartości używane przez bieżącą metrykę ćwiczenia (metrykę można zmienić po treningach). */
export function usedKeys(ex: Exercise | undefined): Record<typeof VAL_KEYS[number] | 'bandId', boolean> {
  const m = ex?.metric ?? 'weight_reps'; const bw = !!ex && isBW(ex);
  return { weight: hasWeight(m) && !bw, addKg: hasWeight(m) && bw, reps: hasReps(m), durationSec: hasTime(m), distanceM: hasDistance(m),
      bandId: usesBand(ex) /* runda 11: guma tylko przy gumach; 06.10.2026: także opór gumy */ };
}
/** Czyści w serii pola, których metryka nie używa (wartości skopiowane ze starszej sesji). */
function stripUnused(ex: Exercise | undefined, s: WSet): WSet {
  const u = usedKeys(ex);
  for (const k of VAL_KEYS) if (!u[k]) (s as any)[k] = ''; /* P-001: zdjęta guma nie zabiera już ±kg (dawniej runda 49) */
  if (!u.bandId || (s.bandId && !bandById(s.bandId))) s.bandId = ''; /* runda 16: usunięta guma nie wraca */
  return s;
}
export const isEmpty = (v: unknown) => v === '' || v == null;
/** Runda 72 (T5): seria z asystą gumy, której nie da się odtworzyć (guma usunięta albo asysta gumą wyłączona) — jej powtórzenia bez asysty
 * zapisałyby trudniejsze ćwiczenie (fałszywy rekord), więc z takiej serii nie przepisujemy żadnych wartości. */
/* T6: także guma bez wpisanej asysty (kg); T7: tylko ćwiczenia z masą ciała — tam guma zmienia obciążenie */
export const assistLost = (ex: Exercise | undefined, p: Partial<WSet> | null | undefined) => !!ex && isBW(ex) && !!p?.bandId
    && (!ex.bandAssistable || !bandById(p.bandId));
export { copyVals, stripUnused };
