/*
 * Skala wysiłku (pakiet C, 08.10.2026): w danych zawsze RPE, wyświetlanie i wpis w RPE albo RIR (ustawienie). Granice skali w jednym miejscu.
 * Zależy od: ./core; zewnętrzne: ../units.
 */
import { fmtNum } from '../units';
import { S } from './core';

/* ---------- skala wysiłku (pakiet C, 08.10.2026): w danych zawsze RPE; RIR = 10 − RPE (Zourdos i in., JSCR 2016: „RPE-10 = 0-RIR, RPE-9 = 1-RIR”)
 * ---------- */
export const effortScale = (): 'rpe' | 'rir' => (S?.settings.effortScale === 'rir' ? 'rir' : 'rpe');
export const effortLabel = () => (effortScale() === 'rir' ? 'RIR' : 'RPE');
const clamp10 = (v: number) => Math.min(10, Math.max(0, Math.round(v * 10) / 10));
/** MER-14 / LOG-15 (audyt 0.10): skala RPE-RIR ma wartości 1–10 (Helms i in. 2016, PMC4961270: „descriptors of effort for values below 5 (1–2 RPE =
 * ‘little to no effort,’ 3–4 RPE = ‘light effort’)” — RPE 0 nie istnieje), więc zapis RPE w 1–10, a RIR w 0–9. */
export const RPE_MIN = 1, RPE_MAX = 10;
/** Audyt kontrolny 1 MER2-08 (rekomendacja MER-14): w skali RIR wpis 0–RIR_MAX; więcej powtórzeń w zapasie = „lekko”, zapis RPE_LIGHT. Helms i in. 2016:
 * poniżej RPE 5 opisy słowne („3–4 RPE = ‘light effort’”), a nie RIR — RIR 6–9 nie przelicza się już na RPE 4–1. RPE_LIGHT = górna granica „light effort”. */
export const RIR_MAX = 5, RPE_LIGHT = 4;
/** RPE poniżej tego progu w skali RIR = „lekko” (RIR_MAX + 1, pokazywane „6+”). */
const RPE_RIR_MIN = 10 - RIR_MAX;
const clampRpe = (v: number) => Math.min(RPE_MAX, Math.max(RPE_MIN, Math.round(v * 10) / 10));
/** Zapisane RPE → wartość pokazywana w bieżącej skali. */
export const effortOut = (rpe: number) => (effortScale() === 'rir' ? (rpe < RPE_RIR_MIN ? RIR_MAX + 1 : clamp10(10 - rpe)) : rpe);
/** Wartość wysiłku jako tekst w bieżącej skali (opis serii, historia): w RIR „lekko” = „6+” (MER2-08). */
export const effortText = (rpe: number): string => (effortScale() === 'rir' && rpe < RPE_RIR_MIN ? `${RIR_MAX + 1}+` : fmtNum(effortOut(rpe), 1));
/** Wpisana wartość w bieżącej skali → RPE do zapisu ('' = puste); RIR > RIR_MAX → RPE_LIGHT („lekko”, MER2-08). */
export const effortIn = (v: number | ''): number | '' => (v === '' ? '' : effortScale() === 'rir' ? (v > RIR_MAX ? RPE_LIGHT : clampRpe(10 - v)) : clampRpe(v));
/** Wartość pola wysiłku do wyświetlenia w polu edycji. */
export const effortField = (rpe: number | '' | null | undefined): number | '' => (rpe === '' || rpe == null ? '' : effortOut(Number(rpe)));
