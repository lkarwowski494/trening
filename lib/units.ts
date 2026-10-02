import { locale } from './i18n';

/*
 * Jednostki (LOC-02, ADR-027). Dane zawsze w kg — funty tylko przy wyświetlaniu i wpisywaniu,
 * więc przełączenie jednostki niczego nie przelicza w historii i nie traci precyzji.
 * Wyświetlanie: kg do 0,01 (mikroobciążenia 1,25 kg), lb do 0,1; liczby w formacie języka (62,5 / 62.5).
 */
export type Unit = 'kg' | 'lb';
export const KG_PER_LB = 0.45359237;
let unit: Unit = 'kg';
export const applyUnit = (u: Unit | undefined) => { unit = u === 'lb' ? 'lb' : 'kg'; };
export const wu = (): Unit => unit;
/** Zaokrąglenie symetryczne (połówki od zera) — −0,45 i 0,45 dają lustrzane wyniki (runda 28: asysta gumy = −nominał). */
const round = (v: number, d: number) => { const f = 10 ** d; return Math.sign(v) * Math.round(Math.abs(v) * f) / f + 0; };
/** kg → wartość do wyświetlenia (kg do 0,01; lb do 0,1). */
export const wOut = (kg: number): number => unit === 'lb' ? round(kg / KG_PER_LB, 1) : round(kg, 2);
/** Pole z danych (kg lub '') → wartość do pola edycji. */
export const wField = (kg: number | '' | undefined | null): number | '' => kg === '' || kg == null ? '' : wOut(Number(kg));
/** Wartość wpisana przez użytkownika → kg do zapisu. */
/**
 * Runda 26: funty zamieniamy na „okrągłe” kg — najgrubsze z 0,25 / 0,1 / 0,05 / 0,01 kg, które wyświetla się jako ta sama
 * liczba funtów. Wpisanie „220,5 lb” przy historii 100 kg daje 100 kg (a nie 100,0165 — fałszywy rekord przy tym samym wyniku).
 */
export const wIn = (v: number | ''): number | '' => {
  if (v === '') return ''; const n = Number(v); if (unit !== 'lb') return round(n, 2); /* runda 59: kg jak na ekranie (0,01) — 100,004 to nie rekord nad 100 */
  return snapLb(n);
};
/** Runda 27: przyciąganie liczy od wartości WYŚWIETLANEJ (0,1 lb) — ta sama liczba na ekranie = te same kg. */
export function snapLb(n: number): number {
  // Runda 28: wg wartości bezwzględnej (asysta ujemna lustrzana) i przez 0,01 lb — 1,6499999 (stary zapis) i 1,65 (wpis) dają to samo.
  const sign = Math.sign(n); const shown = round(round(Math.abs(n), 2), 1); const kg = shown * KG_PER_LB;
  for (const step of [0.25, 0.1, 0.05, 0.01]) { const k = Math.round(kg / step) * step; if (round(k / KG_PER_LB, 1) === shown) return sign * round(k, 2) + 0; }
  return sign * round(kg, 6) + 0;
}
/**
 * Runda 27: wartości zapisane przed rundą 26 z funtów (surowe lb × 0,45359237) — przyciągane jak nowe wpisy. Rozpoznajemy je
 * po tym, że nie leżą na siatce 0,01 kg, a w funtach mają najwyżej 2 miejsca po przecinku. Wpisy w kg zostają bez zmian.
 */
export function snapLegacyLb(v: unknown): unknown {
  if (typeof v !== 'number' || !Number.isFinite(v) || v === 0) return v;
  if (Math.abs(v * 100 - Math.round(v * 100)) < 1e-6) return v;
  const lb = v / KG_PER_LB; if (Math.abs(lb * 100 - Math.round(lb * 100)) > 1e-8) return v; // runda 29: 1e-8 — stare zapisy trafiają z błędem ≤ 3e-11, a kg z 3 miejscami (np. 681,518) już nie
  const r = snapLb(round(lb, 2)); return Number.isFinite(r) ? r : v; // runda 49: bardzo duże liczby nie stają się Infinity
}
/** Liczba w formacie języka (przecinek po polsku), bez zbędnych zer. */
export const fmtNum = (v: number, maxDec = 2): string => { try { return v.toLocaleString(locale(), { maximumFractionDigits: maxDec, useGrouping: false }); } catch { return String(round(v, maxDec)); } };
/** Sformatowany ciężar z jednostką, np. „62,5 kg” / „137.8 lb”. */
/** Objętość (kg) w jednostce wyświetlania, zaokrąglona do całości już po przeliczeniu (runda 6). */
/** Objętość jako liczba całkowita w jednostce wyświetlania — jedno zaokrąglenie z kg (wykresy i etykiety zgodne, runda 8). */
export const volOut = (kg: number): number => Math.round(unit === 'lb' ? kg / KG_PER_LB : kg);
export const fmtVol = (kg: number): string => `${fmtNum(volOut(kg), 0)} ${unit}`;
export const fmtW = (kg: number, withUnit = true): string => { const s = fmtNum(wOut(kg), unit === 'lb' ? 1 : 2); return withUnit ? `${s} ${unit}` : s; };
