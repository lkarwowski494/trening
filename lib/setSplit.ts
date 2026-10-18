import { t, tp } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';

/*
 * Serie na partię: odcinek bezpośredni i pośredni (decyzja właściciela 13.10.2026, wariant A; docs/18, docs/research/32).
 * JEDNO ŹRÓDŁO LICZENIA dla pasków „Ten tydzień”, Postępów, podsumowania, mapy mięśni i generatora:
 *  - bezpośrednio = serie ćwiczeń, w których partia jest główna (waga 1);
 *  - pośrednio    = serie ćwiczeń, w których partia jest pomocnicza; do celu liczą się po SECONDARY_SHARE (0,5);
 *  - total        = direct + indirectWeighted — to jest liczba porównywana z celem (jak dotąd).
 * Uproszczenie: waga 0,5 = metoda „fractional” (Pelland i in. 2024/2026, metaanaliza); szczegóły: docs/research/32.
 */
/** Partia pomocnicza liczona jako SECONDARY_SHARE serii i dnia — Pelland, metoda „fractional” (metaanaliza, szczebel 2; uproszczenie). */
export const SECONDARY_SHARE = 0.5;

export type SetSplit = { /** serie bezpośrednie */ direct: number; /** liczba serii pomocniczych (surowa, bez wagi) */ indirectSets: number; /** serie pomocnicze z wagą SECONDARY_SHARE */ indirectWeighted: number; /** direct + indirectWeighted — wartość porównywana z celem */ total: number };
export const emptySplit = (): SetSplit => ({ direct: 0, indirectSets: 0, indirectWeighted: 0, total: 0 });
export const makeSplit = (direct: number, indirectSets: number): SetSplit => { const w = indirectSets * SECONDARY_SHARE; return { direct, indirectSets, indirectWeighted: w, total: direct + w }; };
export const sumSplit = (a: SetSplit, b: SetSplit): SetSplit => makeSplit(a.direct + b.direct, a.indirectSets + b.indirectSets);

/** Dolicza `n` serii ćwiczenia do partii głównych (bezpośrednio) i pomocniczych (pośrednio). */
export function addSplitSets(acc: Record<string, SetSplit>, muscles: readonly string[], secondary: readonly string[], n: number): void {
  for (const m of muscles) acc[m] = makeSplit((acc[m]?.direct ?? 0) + n, acc[m]?.indirectSets ?? 0);
  for (const m of secondary) acc[m] = makeSplit(acc[m]?.direct ?? 0, (acc[m]?.indirectSets ?? 0) + n);
}
/** Sumy ważone (total) z podziału — do kolorowania mapy mięśni i porównań. */
export const splitTotals = (r: Record<string, SetSplit>): Record<string, number> => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.total]));
/** Sumuje dwa słowniki podziałów (np. wykonane + zaplanowane). */
export function mergeSplits(a: Record<string, SetSplit>, b: Record<string, SetSplit>): Record<string, SetSplit> {
  const out: Record<string, SetSplit> = { ...a }; for (const [k, v] of Object.entries(b)) out[k] = out[k] ? sumSplit(out[k], v) : v; return out;
}

const n1 = (v: number) => fmtNum(v, 1);
/** Podpis serii: „6 + 1,5 pośrednio (3 serie)”; bez serii pośrednich — samo „6”; z celem — „… / 10”. */
export function splitText(s: SetSplit, goal?: number): string {
  const n = s.indirectSets; /* nazwa `n`: test liczby mnogiej (tests/matrix-i18n) zna argumenty tp() */
  const base = n > 0 ? t('{d} + {w} pośrednio ({n} {s})', { d: n1(s.direct), w: n1(s.indirectWeighted), n, s: tp(n, 'seria|serie|serii') }) : n1(s.direct);
  return goal ? `${base} / ${n1(goal)}` : base;
}
/** Etykieta dla czytnika ekranu: obie wartości i cel; bez serii pośrednich — sama liczba (+ cel). */
export function splitLabel(s: SetSplit, goal?: number): string {
  const base = s.indirectSets > 0 ? t('{d} bezpośrednio, {w} pośrednio (serie pomocnicze: {n})', { d: n1(s.direct), w: n1(s.indirectWeighted), n: s.indirectSets }) : n1(s.direct);
  return goal ? `${base}, ${t('cel {n}', { n: n1(goal) })}` : base;
}
