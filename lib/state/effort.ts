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
/** Audyt kontrolny 1 MER2-08 i M1-audytor-generalny-020 (DEC-04 a, 27.10.2026): w skali RIR wpis 0–RIR_MAX; więcej powtórzeń w zapasie = „lekko”, zapis RPE_LIGHT.
 * Helms i in. 2016 (PMC4961270): „scores of 5–6 were grouped as 4–6 RIR”, a poniżej RPE 5 skala ma opisy słowne („3–4 RPE = ‘light effort’”), nie RIR.
 * RIR 4–6 należy więc do przedziału RPE 5–6: RIR do 5 = 10 − RIR, RIR powyżej 5 do RIR_MAX = RPE_RIR_MIN (najniższe RPE przedziału). RPE_LIGHT = górna
 * granica „light effort”. Zapisane dane się nie zmieniają (stare „lekko” = RPE 4). */
export const RIR_MAX = 6, RPE_LIGHT = 4;
/** RPE poniżej tego progu w skali RIR = „lekko” (pokazywane „RIR_MAX + 1” z plusem, „7+”); najniższe RPE z opisem w powtórzeniach w zapasie. */
export const RPE_RIR_MIN = 5;
const clampRpe = (v: number) => Math.min(RPE_MAX, Math.max(RPE_MIN, Math.round(v * 10) / 10));
/** Zapisane RPE → wartość pokazywana w bieżącej skali. */
export const effortOut = (rpe: number) => (effortScale() === 'rir' ? (rpe < RPE_RIR_MIN ? RIR_MAX + 1 : clamp10(10 - rpe)) : rpe);
/** Wartość wysiłku jako tekst w bieżącej skali (opis serii, historia): w RIR „lekko” = „7+” (MER2-08, M1-audytor-generalny-020). */
export const effortText = (rpe: number): string => (effortScale() === 'rir' && rpe < RPE_RIR_MIN ? `${RIR_MAX + 1}+` : fmtNum(effortOut(rpe), 1));
/** Wpisana wartość w bieżącej skali → RPE do zapisu ('' = puste); RIR > RIR_MAX → RPE_LIGHT („lekko”, MER2-08); RIR 5–6 → RPE 5 (przedział 4–6 RIR, M1-audytor-generalny-020). */
export const effortIn = (v: number | ''): number | '' => (v === '' ? '' : effortScale() === 'rir' ? (v > RIR_MAX ? RPE_LIGHT : clampRpe(Math.max(RPE_RIR_MIN, 10 - v))) : clampRpe(v));
/** Wartość pola wysiłku do wyświetlenia w polu edycji. */
export const effortField = (rpe: number | '' | null | undefined): number | '' => (rpe === '' || rpe == null ? '' : effortOut(Number(rpe)));
