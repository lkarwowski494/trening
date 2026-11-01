/*
 * Pomiar wydajności WZGLĘDNY (07-jakosc-005, 01.11.2026): testy jednostkowe nie porównują czasu wykonania z liczbą milisekund (próg ms padał na wolnym albo
 * obciążonym CI, a przy luźnym progu niczego nie chronił). Zamiast tego: czas operacji dzielony przez czas stałego obciążenia odniesienia, mierzonego w tym samym
 * procesie tuż obok (zwolnienie maszyny wydłuża oba), każdy pomiar to najlepszy z kilku przebiegów (odcina wahnięcia GC i kolejki procesora).
 * Liczby (krotności) są TYLKO tu — jedno miejsce; typowe wartości zmierzone 01.11.2026 w komentarzu przy każdej, limit ≥ 10× typowej (łapie regresję rzędu wielkości,
 * np. zgubiony cache, nie szum). Dokładne budżety czasu (ms) — `npm run perf` (scripts/perf), poza `npm test`.
 */
export const ODNIESIENIE_N = 20_000;
const robota = (): number => { let s = 0; const a: number[] = []; for (let i = 0; i < ODNIESIENIE_N; i++) { s += Math.sin(i) * Math.sqrt(i + 1); if (i % 64 === 0) a.push(s); } return s + a.length; };
const teraz = (): number => require('perf_hooks').performance.now() as number;
/** Średni czas jednego wywołania `fn` (ms): najlepsza z `powtorzen` serii po `n` wywołań. */
export function srednioMs(fn: () => void, n: number, powtorzen = 3): number {
  let best = Infinity;
  for (let r = 0; r < powtorzen; r++) { const t0 = teraz(); for (let i = 0; i < n; i++) fn(); best = Math.min(best, (teraz() - t0) / n); }
  return best;
}
/** Czas obciążenia odniesienia (ms) — jednostka dla krotności. */
export const odniesienieMs = (): number => srednioMs(() => { robota(); }, 1, 5);
/** Krotność czasu odniesienia, jaką zajmuje operacja `fn` (średnio na wywołanie). */
export function krotnosc(fn: () => void, n: number): number { return srednioMs(fn, n) / odniesienieMs(); }
/** Limity krotności (typowa wartość zmierzona 01.11.2026 → limit ≥ 10×). */
export const LIMIT_KROTNOSCI = {
  /* klatka figury z mięśniami, torem i błędem (figures-v2-data): typowo ~0,07 */ klatka: 1,
  /* styki + znaczki jednej klatki (figures-v2-styk): typowo ~1,3 */ styki: 15,
  /* pełny krok animacji, 4 rodziny (figures-v2-styk): typowo 0,17–0,39 */ krok: 5,
} as const;
