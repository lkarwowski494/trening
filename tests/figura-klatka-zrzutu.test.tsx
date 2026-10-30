/*
 * 101-32 (zrzut sklepu 02, decyzja właściciela 30.10.2026 — wariant A1 do potwierdzenia): build zrzutów do App Store ustawia EXPO_PUBLIC_FIGURA_STOP=1,
 * a animowana figura v2 stoi w pozycji u = 1 (koniec pierwszej fazy; przysiad — dół), więc zrzut 02 jest taki sam we wszystkich językach.
 * Bez flagi (TestFlight, App Store, E2E) — animacja jak zawsze; „Ogranicz ruch” i pauza nadal pokazują widok statyczny.
 */
import React from 'react';
import * as RN from 'react-native';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { measuredAngle, shownFigureSpec, TEMPO } from '@/lib/figures/v2';

const ZEWNETRZNA = process.env.EXPO_PUBLIC_FIGURA_STOP; // wartość z otoczenia (np. job TestFlight uruchamia npm run verify)
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
const pathsOf = (): string => screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => typeof n.props.d === 'string').map((n: { props: Record<string, unknown> }) => n.props.d as string).join();
const wf = (n: string) => readFileSync(join(__dirname, '..', '.github/workflows', n), 'utf8');
afterEach(() => { delete process.env.EXPO_PUBLIC_FIGURA_STOP; jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

describe('101-32: figura zatrzymana w buildzie zrzutów (30.10.2026)', () => {
  test('z flagą: widok animowany, ten sam rysunek w każdej chwili, kąt pozycji u = 1 (Back Squat — dół przysiadu)', async () => {
    process.env.EXPO_PUBLIC_FIGURA_STOP = '1'; jest.useFakeTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false));
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-anim')).toBeTruthy();
    const d0 = pathsOf();
    for (const t of [TEMPO.holdMs, TEMPO.downMs, 1234, 4000]) { await act(async () => { jest.advanceTimersByTime(t); }); expect(pathsOf()).toBe(d0); }
    const spec = shownFigureSpec('Back Squat')!; const kat = measuredAngle(spec, 1);
    expect(kat.deg).toBeGreaterThan(90);
    expect(screen.getByTestId('exercise-figure-v2-angle').props.children).toContain(`${Math.round(kat.deg)}°`);
  });
  test('bez flagi: animacja się zmienia (TestFlight i App Store bez zmian)', async () => {
    jest.useFakeTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false));
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    const d0 = pathsOf(); await act(async () => { jest.advanceTimersByTime(TEMPO.holdMs + TEMPO.downMs / 2); }); expect(pathsOf()).not.toBe(d0);
  });
  test('z flagą: „Ogranicz ruch” i pauza nadal dają widok statyczny (dostępność bez zmian)', async () => {
    process.env.EXPO_PUBLIC_FIGURA_STOP = '1'; AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    const r = render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); r.unmount();
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false));
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    fireEvent.press(screen.getByRole('button', { name: 'Zatrzymaj animację' }));
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy();
  });
  test('flaga tylko w buildzie zrzutów: store-screenshots.yml tak (krok Build), testflight.yml i e2e-ios.yml nie; otoczenie verify bez flagi', () => {
    const s = wf('store-screenshots.yml');
    expect(s).toMatch(/- name: Build \(Release, symulator, bez podpisu\)[^\n]*\n\s+env:\n\s+EXPO_PUBLIC_FIGURA_STOP: '1'/);
    for (const n of ['testflight.yml', 'e2e-ios.yml', 'ios-unsigned.yml', 'nightly.yml']) expect(wf(n)).not.toContain('EXPO_PUBLIC_FIGURA_STOP');
    expect(ZEWNETRZNA).toBeUndefined();
  });
});
