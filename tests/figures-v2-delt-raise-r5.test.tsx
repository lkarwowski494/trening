/*
 * Rodzina delt_raise — poprawka po recenzji ruchu r5 (naprawa 08.11.2026, ZB-042 / B0′): r5-W1 (WYSOKIE) i r5-Ś1 (ŚREDNIE), Car Drivers.
 * Wada: pętla cykl_lustro bez marszu animowana `cycleAt` (cykl 2000 ms, tempo ignorowane), a pasek faz pokazywał fazy rodziny „Unoszenie 1 s · Pauza · Opuszczanie 2 s” (4000 ms) —
 * wyróżniona faza i sekundy nie odpowiadały rysunkowi, a błąd „szarpanie” zmieniał tylko liczby w pasku, nie ruch.
 * Naprawa tylko w plikach rodziny: Car Drivers wraca do wahadła (u 0 → 1 → 0 według `uAt` z tempem ćwiczenia/błędu — ten sam zegar co pasek faz); fazy „Obrót” i „Powrót”
 * (wyjątek DATA_UI rodziny; „Unoszenie/Opuszczanie” opisywały ruch, którego kierownica nie wykonuje). Każda miara ma negatyw (stan sprzed poprawki albo inne ćwiczenie).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json')));
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { FAMILY, figureSpec, loopOf, loopLength, phasesFor, phaseNames, tempoFor, uAt, phaseIndexAt, cycleLength, TEMPO, type FamilyId } from '@/lib/figures/v2';
import { ERRORS } from '@/lib/figures/v2/errors';

jest.mock('@/lib/figures/v2/poseData', () => {
  const real = jest.requireActual('@/lib/figures/v2/poseData');
  return { ...real, poseDataFor: (key: string, family: string) => {
    if (family !== 'delt_raise') return real.poseDataFor(key, family);
    const f = jest.requireActual('@/lib/figures/v2/poses/delt_raise.json').cwiczenia as Record<string, { cwiczenie: string; rodzina: string }>;
    const d = Object.prototype.hasOwnProperty.call(f, key) ? f[key] : undefined; return d && d.cwiczenie === key && d.rodzina === 'delt_raise' ? d : null;
  } };
});
const SAVED = FAMILY.delt_raise.status;
beforeAll(() => { FAMILY.delt_raise.status = 'ready'; });
afterAll(() => { FAMILY.delt_raise.status = SAVED; });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
afterEach(() => { jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

const CD = 'Car Drivers';
const DATA = jest.requireActual('@/lib/figures/v2/poses/delt_raise.json').cwiczenia as Record<string, { petla?: string; lustroRece?: boolean }>;
const PRZED = ['Unoszenie', 'Opuszczanie']; /* stan sprzed poprawki (08.11.2026): fazy rodziny */

describe('r5-W1: pasek faz Car Drivers i animacja mają jeden zegar (08.11.2026)', () => {
  test('Car Drivers nie jest już pętlą lustrzaną (cykl_lustro bez marszu): wahadło, bez zamiany rąk w danych', () => {
    expect([DATA[CD].petla, DATA[CD].lustroRece]).toEqual([undefined, undefined]); expect(loopOf(figureSpec(CD)!)).toBe('wahadlo');
  });
  test('fazy: Obrót 1 s · Pauza · Powrót 2 s · Pauza — nie „Unoszenie/Opuszczanie”, bez „Marsz”, wszystkie z sekundami', () => {
    const s = figureSpec(CD)!; expect(phaseNames(s)).toEqual({ first: 'Obrót', second: 'Powrót' });
    const ph = phasesFor(s); expect(ph.map(p => [p.name, p.ms])).toEqual([['Obrót', TEMPO.upMs], ['Pauza', 500], ['Powrót', TEMPO.downMs], ['Pauza', 500]]);
    expect(ph.some(p => p.untimed || p.name === 'Marsz')).toBe(false); expect(ph.map(p => p.name)).not.toContain(PRZED[0]); expect(ph.map(p => p.name)).not.toContain(PRZED[1]);
  });
  test('okres animacji = suma faz paska (4000 ms): u rośnie dokładnie w fazie „Obrót”, maleje w „Powrót”, a pętla się domyka', () => {
    const s = figureSpec(CD)!; const ph = phasesFor(s); const suma = ph.reduce((a, p) => a + p.ms, 0);
    expect(suma).toBe(loopLength(false)); expect(uAt(0, s.lowerFirst)).toBe(uAt(suma, s.lowerFirst));
    const poczatek = 500; /* wiodąca pauza (HOLD) — ostatnia faza poprzedniej pętli */
    expect([uAt(poczatek, s.lowerFirst), uAt(poczatek + TEMPO.upMs, s.lowerFirst)]).toEqual([0, 1]);
    expect(phaseIndexAt(poczatek + TEMPO.upMs / 2, ph)).toBe(0); expect(uAt(poczatek + TEMPO.upMs / 2, s.lowerFirst)).toBeGreaterThan(0.4);
    const wPowrocie = poczatek + TEMPO.upMs + 500 + TEMPO.downMs / 2; expect(phaseIndexAt(wPowrocie, ph)).toBe(2); expect(uAt(wPowrocie, s.lowerFirst)).toBeLessThan(0.6);
  });
  test('negatyw: stara pętla lustrzana miała cykl 2000 ms przy pasku 4000 ms — rozjazd, którego wahadło nie ma', () => {
    expect(cycleLength()).toBe(2000); expect(cycleLength()).not.toBe(phasesFor(figureSpec(CD)!).reduce((a, p) => a + p.ms, 0));
  });
  test('negatyw: inne wznosy rodziny zachowują fazy Unoszenie/Opuszczanie (zmiana dotyczy tylko Car Drivers)', () => {
    expect(phaseNames(figureSpec('Lateral Raise (hantle)')!)).toEqual({ first: 'Unoszenie', second: 'Opuszczanie' });
  });
});

describe('r5-Ś1: błąd „szarpanie” zmienia tempo ruchu, nie tylko liczby w pasku (08.11.2026)', () => {
  test('tempo błędu (450/350 ms) skraca fazy paska i przyspiesza rysunek: u osiąga 1 już po 350 ms fazy „Obrót”, poprawny ruch jeszcze nie', () => {
    const s = figureSpec(CD)!; const jerk = tempoFor(s, 'jerk'); const ok = tempoFor(s);
    expect(jerk).toEqual({ ...ERRORS.jerk.mods.tempo }); expect(jerk.upMs).toBeLessThan(ok.upMs);
    expect(phasesFor(s, jerk).map(p => p.ms)).toEqual([jerk.upMs, 500, jerk.downMs, 500]);
    const t = 500 + jerk.upMs; expect(uAt(t, s.lowerFirst, jerk)).toBe(1); expect(uAt(t, s.lowerFirst, ok)).toBeLessThan(0.9);
  });
});

describe('ekran: karta Car Drivers — licznik faz w komponencie', () => {
  const phasesText = (): string => screen.getByTestId('exercise-figure-v2-phases').queryAll((n: any) => n.type === 'Text').map(n => String(React.Children.toArray(n.props.children).join(''))).join('|');
  test('w trybie animacji licznik pokazuje „Obrót 1 s”, „Pauza”, „Powrót 2 s” i wyróżnia fazę zgodnie z rysunkiem (początek pętli: pauza → Obrót)', async () => {
    jest.useFakeTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false));
    await render(<ExerciseFigureV2 exercise={{ lib: true as const, libKey: CD }} />); await act(async () => { await Promise.resolve(); });
    expect(phasesText()).toMatch(/Obrót 1 s/); expect(phasesText()).toMatch(/Powrót 2 s/); expect(phasesText()).not.toMatch(/Unoszenie|Opuszczanie|Marsz/);
    await act(async () => { jest.advanceTimersByTime(500 + 300); }); expect(phasesText()).toMatch(/Obrót 1 s/);
  });
});
