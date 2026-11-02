/*
 * pull_up — Side To Side Chins: wariant C (decyzja właściciela 02.11.2026, docs/18): rysunek pokazuje podciągnięcie zawsze ku prawej dłoni (bez naprzemienności),
 * a karta nazywa to uproszczeniem zwykłym zdaniem pod rysunkiem (jak opis stóp w przysiadzie: components/ExerciseFigureV2.tsx, testID exercise-figure-v2-oneside).
 * Rodzaje (docs/20): ekran (figura, sekcja „Technika”), języki (PL/EN + komplet tłumaczeń), niezmienniki (zdanie tylko przy tym ćwiczeniu, widoczne mimo
 * braku recenzji zestawu ogólnego wskazówek), dostępność (zwykły tekst w języku interfejsu).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: sprawdzamy zdanie przy rysunku, nie recenzję rodziny */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { ExerciseCues } from '@/components/ExerciseCues';
import { figureSpec } from '@/lib/figures/v2';
import { oneSideNoteApplies, ONE_SIDE_FIGURES } from '@/lib/figures/v2/cueSets';
import { applyLang, t } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';

const PL = 'Rysunek pokazuje ruch w jedną stronę — w kolejnym powtórzeniu podciągasz się do drugiej dłoni.';
const EN = 'The drawing shows the movement to one side only — on the next rep you pull up toward the other hand.';
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
beforeEach(() => { AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true)); });
afterEach(() => { applyLang('pl'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });
const PULL_UP = ['Gironda Sternum Chins', 'Chin Up', 'Mixed Grip Chin', 'Neutral Grip Pull Up', 'One Arm Chin-Up', 'Pull Up', 'Wide-Grip Rear Pull-Up', 'Dead Hang', 'Gorilla Chin/Crunch', 'Scapular Pull-Up'];

describe('Side To Side Chins — zdanie o ruchu w jedną stronę (wariant C, 02.11.2026)', () => {
  test('lista: tylko Side To Side Chins; reszta rodziny pull_up i inne rodziny — bez zdania', () => {
    expect(ONE_SIDE_FIGURES).toEqual(['Side To Side Chins']);
    expect(oneSideNoteApplies(figureSpec('Side To Side Chins')!)).toBe(true);
    for (const k of [...PULL_UP, 'Back Squat', 'Sumo Deadlift']) expect([k, oneSideNoteApplies(figureSpec(k)!)]).toEqual([k, false]);
  });
  test('figura: zdanie po polsku pod rysunkiem tylko przy Side To Side Chins', async () => {
    render(<ExerciseFigureV2 exercise={lib('Side To Side Chins')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-oneside').props.children).toBe(PL);
    screen.unmount();
    for (const k of PULL_UP) { const r = render(<ExerciseFigureV2 exercise={lib(k)} />); await flush(); expect([k, screen.queryByTestId('exercise-figure-v2-oneside')]).toEqual([k, null]); r.unmount(); }
  });
  test('figura: po angielsku', async () => {
    applyLang('en'); render(<ExerciseFigureV2 exercise={lib('Side To Side Chins')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-oneside').props.children).toBe(EN);
  });
  test('karta „Technika”: zdanie widoczne mimo braku recenzji zestawu ogólnego; w innym podciąganiu go nie ma', async () => {
    render(<ExerciseCues exercise={{ ...lib('Side To Side Chins'), recommended: undefined, catalogRev: undefined } as never} initialOpen />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-oneside').props.children).toBe(PL);
    screen.unmount();
    render(<ExerciseCues exercise={{ ...lib('Pull Up'), recommended: undefined, catalogRev: undefined } as never} initialOpen />); await flush();
    expect(screen.queryByTestId('exercise-figure-v2-oneside')).toBeNull();
  });
  test('tekst: zwykłym językiem, bez oznaczenia wagi w interfejsie; wszystkie języki mają tłumaczenie różne od polskiego', () => {
    expect(PL).not.toMatch(/uproszczeni|konwencj/i); expect(EN).not.toMatch(/simplif|convention/i);
    expect(t(PL)).toBe(PL); applyLang('en'); expect(t(PL)).toBe(EN); applyLang('pl');
    const brak = Object.entries(LOCALES).filter(([lang, d]) => !['pt-BR', 'es-419'].includes(lang) && (!d![PL] || d![PL] === PL)).map(([lang]) => lang);
    expect(brak).toEqual([]);
  });
});
