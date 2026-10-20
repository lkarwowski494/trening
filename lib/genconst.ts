/* M1-audytor-generalny-054: stałe generatora potrzebne też ostrzeżeniu o limicie obciążenia (loadcap) — w osobnym module bez zależności,
 * żeby generator ↔ loadcap nie tworzyły cyklu importów. Generator re-eksportuje je pod dotychczasową nazwą (lib/generator.ts). */

/** Zakresy powtórzeń [od, do]: ciężki bój główny (≈ ≥ HEAVY_PCT% 1RM), dodatkowe przy sile, masa na siłowni, masa w domu / bez obciążenia (R3, R4). */
export const REPS: Readonly<Record<'heavy' | 'strength' | 'gym' | 'home', readonly [number, number]>> = { heavy: [4, 6], strength: [6, 10], gym: [8, 12], home: [12, 20] };

/** ACSM 2026 tab. 6 (siła): „Intensity: ≥80% 1RM (dose-response)”. */
export const HEAVY_PCT = 80;
