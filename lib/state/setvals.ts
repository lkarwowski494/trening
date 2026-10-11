/*
 * Wartości serii: pusta seria, kopiowanie wartości, pola używane przez metrykę ćwiczenia (czyszczenie reszty), wartości wstawione przez
 * aplikację (pre — decyzja 02.10.2026, audyt B2) i reguła „asysty gumą nie da się odtworzyć”.
 * Zależy od: ./sets; zewnętrzne: ../seed.
 */
import { uid, hasTime, hasReps, hasWeight, hasDistance, type WSet, type Exercise, type SetKind } from '../seed';
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

/** Rodzina serii (runda 6): rozgrzewka, drop set, reszta (zwykła / do upadku). Ciężar dropu nie trafia do serii roboczej i odwrotnie. */
export const setFam = (k: SetKind | undefined) => k === 'warmup' ? 'w' : k === 'drop' ? 'd' : 'n';
/**
 * Kaskada w dół (decyzja właściciela 11.10.2026, pkt 6, wariant A): wartość wpisana w wierszu `i` przechodzi do KOLEJNYCH wierszy tej samej rodziny
 * (setFam), ale tylko tam, gdzie pole jest puste ALBO ma jeszcze poprzednią wartość wiersza `i` (`old`, sprzed wpisu) — czyli nie było zmienione
 * ręcznie. Nigdy nie rusza serii odhaczonej ani innej wartości. Bez nowego pola w danych: „ręcznie zmienione” = „różni się od poprzedniej wartości
 * wiersza i”. Podpowiedzi „Poprzednio” i placeholdery nie są wartościami (pola zostają puste), więc nie liczą się jako ręczne.
 * Wspólne dla treningu w toku (WSet) i edytora szablonu (TRow). `get`/`put` — dostęp do pola (ciężar: pole właściwe dla sprzętu, loadFieldValue);
 * `sameBand` — przy ±kg z gumą wiersz z inną gumą nie dostaje cudzej asysty. Zwraca liczbę zmienionych wierszy.
 */
export function cascadeDown<R extends { kind: SetKind; done?: boolean; bandId?: string }>(rows: readonly R[], i: number, old: number | '',
    get: (r: R) => number | '', put: (r: R, v: number | '') => void, sameBand = false): number {
  const from = rows[i]; if (!from) return 0; const nv = get(from); if (nv === old) return 0; let n = 0;
  for (let j = i + 1; j < rows.length; j++) {
    const x = rows[j];
    if (x.done || setFam(x.kind) !== setFam(from.kind) || (sameBand && (x.bandId ?? '') !== (from.bandId ?? ''))) continue;
    const cur = get(x); if (cur !== '' && cur !== old) continue;
    put(x, nv); n++;
  }
  return n;
}
