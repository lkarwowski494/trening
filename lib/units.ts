import { locale, t } from './i18n';

/*
 * Jednostki (LOC-02, ADR-027). Dane zawsze w kg — funty tylko przy wyświetlaniu i wpisywaniu,
 * więc przełączenie jednostki niczego nie przelicza w historii i nie traci precyzji.
 * Wyświetlanie: kg do 0,01 (mikroobciążenia 1,25 kg), lb do 0,1; liczby w formacie języka (62,5 / 62.5).
 */
export type Unit = 'kg' | 'lb';
export const KG_PER_LB = 0.45359237;
let unit: Unit = 'kg';
export const applyUnit = (u: Unit | undefined) => { unit = u === 'lb' ? 'lb' : 'kg'; };
/**
 * WARTOŚĆ LOGICZNA jednostki ('kg' | 'lb'): zapis, CSV, kopia, obliczenia i porównania. NIE do wyświetlania i NIE do t() — do tego służy unitLabel()
 * (decyzja właściciela 10a, 28.10.2026, 09-lokalizacja-005: w ru/uk/bg/sr/el etykieta ma lokalny symbol; strażnik tests/units-label.test.ts).
 */
export const wu = (): Unit => unit;
/** Skrót jednostki ze słownika (klucz „{n} …”): „{n} кг” → „кг”. Jedno źródło etykiet i liczb z jednostką (fmtW, fmtDist). */
const bare = (s: string): string => s.replace(/\s*\{n\}\s*/, '');
/** ETYKIETA jednostki masy do wyświetlania (pola, nagłówki, podpisy, opisy VoiceOver) w języku aplikacji: „kg”, w ru „кг”. Dane i eksport używają wu(). */
export const unitName = (u: Unit): string => bare(u === 'lb' ? t('{n} lb') : t('{n} kg'));
export const unitLabel = (): string => unitName(unit);
/*
 * System miar (M2-LOK07-01, DEC-28, 20.10.2026): jedno ustawienie — metryczny (kg, km, m) albo imperialny (lb, mi, yd). Pole `unit` zostaje ('kg' | 'lb'),
 * imperialny = 'lb'; zapis kanoniczny bez zmian: masa w kg, dystans w metrach (bez migracji). Dystans w polach wpisujemy w m / yd (krótka jednostka),
 * a pokazujemy w km / mi od progu `DIST_LONG_FROM_M` (jedno miejsce na progi).
 */
export const M_PER_YD = 0.9144;
export const M_PER_MI = 1609.344;
/** Od jakiej długości (w metrach) dystans pokazujemy w dużej jednostce: metryczny 1 km, imperialny 1 mi. */
export const DIST_LONG_FROM_M = { metric: 1000, imperial: M_PER_MI } as const;
export const isImperial = (): boolean => unit === 'lb';
/** Krótka jednostka dystansu w polach wpisu: m albo yd. */
export const distUnit = (): 'm' | 'yd' => unit === 'lb' ? 'yd' : 'm';
/** ETYKIETA krótkiej jednostki dystansu w polach wpisu (jak w fmtDist, przez słownik): „m” / „yd”, w ru „м” / „ярд”. Wartość logiczna: distUnit(). */
export const distLabel = (): string => bare(unit === 'lb' ? t('{n} yd') : t('{n} m'));
/** Etykieta dużej jednostki dystansu (km / mi) ze słownika — do podpisów obok liczby. */
export const distLongLabel = (): string => bare(unit === 'lb' ? t('{n} mi') : t('{n} km'));
/** Dystans w metrach → liczba w polu wpisu (m albo pełne yardy). Metryczny: wartość bez zmian. */
export const dOut = (m: number | '' | undefined | null): number | '' => m === '' || m == null ? '' : unit === 'lb' ? Math.round(Number(m) / M_PER_YD) : Number(m);
/**
 * Wpis w polu dystansu → metry do zapisu. Metryczny: pełne metry (jak dotąd, runda 55/56). Imperialny: yardy → metry z dokładnością do cm (zapis ma 2 miejsca,
 * więc 6 yd → 5,49 m → znów „6 yd”; pełne metry gubiłyby yardy). `keep` = zapisane metry, gdy wpisana liczba jest tą, którą pole pokazywało (jak wInKeep).
 */
export const dIn = (v: number | '', keep?: number | ''): number | '' => {
  if (v === '') return ''; if (typeof keep === 'number' && Number.isFinite(keep)) return keep;
  const n = Math.max(0, Number(v)); return unit === 'lb' ? round(n * M_PER_YD, 2) : Math.round(n);
};
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
/**
 * Q-021: wpis w polu ciężaru → kg do zapisu, z zachowaniem kg sprzed edycji. `keep` = kg, które pole pokazywało, gdy zaczęła się edycja —
 * podawane przez NumInput (prop `stored`) tylko wtedy, gdy wpisana liczba jest DOKŁADNIE tą, którą pole wtedy pokazywało (wOut).
 * Wtedy kg się nie zmieniają: 61,23 kg (135,0 lb na ekranie) po ponownym wpisaniu „135” zostaje 61,23, a nie 61,25 (wIn przyciąga do
 * „okrągłych” kg) — i nie przenosi się na dalsze serie. Inna liczba → zwykły wIn.
 */
export const wInKeep = (v: number | '', keep?: number | ''): number | '' => typeof keep === 'number' && Number.isFinite(keep) ? keep : wIn(v);
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
export const fmtVol = (kg: number): string => withLabel(fmtNum(volOut(kg), 0));
export const fmtW = (kg: number, withUnit = true): string => { const s = fmtNum(wOut(kg), unit === 'lb' ? 1 : 2); return withUnit ? withLabel(s) : s; };
/** Liczba z etykietą jednostki masy wg słownika języka (kolejność i spacja jak w słowniku). */
const withLabel = (n: string): string => unit === 'lb' ? t('{n} lb', { n }) : t('{n} kg', { n });
