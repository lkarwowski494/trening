/*
 * Figury v2 — komponent ExerciseFigureV2 (grafiki ćwiczeń 1.0, decyzja właściciela 25.10.2026). Rodzaje (docs/20): ekran (oba motywy, Ogranicz ruch → statycznie,
 * zmiana ustawienia, pauza WCAG 2.2.2), dostępność (jeden obraz z opisem, przycisk pauzy osobno), języki (PL/EN etykiety), niezmienniki treści (żadnych liczb ani kątów
 * na rysunku — kąty bez źródła nie są pokazywane), wygląd (kolory z tokenów motywu), rodziny bez figury → nic.
 */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { figurePalette, TEMPO, loopLength, figureSpec, MUSCLE_DATA } from '@/lib/figures/v2';
import { errorsOf, hasTechnique } from '@/lib/figures/v2/ui';
import { applyLang } from '@/lib/i18n';
import { light, dark } from '@/lib/theme';

const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock; addEventListener: jest.Mock };
const setReduce = (v: boolean | 'never') => { AI.isReduceMotionEnabled.mockImplementation(() => v === 'never' ? new Promise(() => {}) : Promise.resolve(v)); };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
const pathsOf = (): string[] => screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => typeof n.props.d === 'string').map((n: { props: Record<string, unknown> }) => n.props.d as string);
afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); jest.restoreAllMocks(); });

describe('komponent ExerciseFigureV2', () => {
  test('animacja: dwa widoki (z boku, z przodu), kształty zmieniają się w czasie; pauza WCAG 2.2.2 zatrzymuje i wznawia', async () => {
    jest.useFakeTimers(); setReduce(false);
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-anim')).toBeTruthy(); expect(screen.getByTestId('exercise-figure-v2-side')).toBeTruthy(); expect(screen.getByTestId('exercise-figure-v2-front')).toBeTruthy();
    const d0 = pathsOf().join();
    await act(async () => { jest.advanceTimersByTime(TEMPO.holdMs + TEMPO.downMs / 2); });
    expect(pathsOf().join()).not.toBe(d0);
    const btn = screen.getByRole('button', { name: 'Zatrzymaj animację' }); fireEvent.press(btn);
    expect(screen.queryByTestId('exercise-figure-v2-anim')).toBeNull(); expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy();
    expect(screen.getByText('Pozycja wyjściowa')).toBeTruthy(); expect(screen.getByText('Pozycja końcowa')).toBeTruthy();
    const dp = pathsOf().join(); await act(async () => { jest.advanceTimersByTime(3000); }); expect(pathsOf().join()).toBe(dp);
    fireEvent.press(screen.getByRole('button', { name: 'Wznów animację' })); expect(screen.getByTestId('exercise-figure-v2-anim')).toBeTruthy();
    expect(loopLength(true)).toBe(4000); /* jedna pętla 4 s, ale powtarza się bez końca (łącznie > 5 s) — przycisk pauzy jest zawsze przy animacji */
  });
  test('Ogranicz ruch → statycznie: start i koniec, w każdym oba widoki; bez animacji i bez przycisku pauzy', async () => {
    jest.useFakeTimers(); setReduce(true);
    render(<ExerciseFigureV2 exercise={lib('Bench Press (sztanga)')} />); await flush();
    expect(screen.queryByTestId('exercise-figure-v2-anim')).toBeNull();
    for (const id of ['start-side', 'start-top', 'end-side', 'end-top']) expect(screen.getByTestId(`exercise-figure-v2-${id}`)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Zatrzymaj animację' })).toBeNull();
    const d = pathsOf().join(); await act(async () => { jest.advanceTimersByTime(5000); }); expect(pathsOf().join()).toBe(d);
  });
  test('zmiana ustawienia „Ogranicz ruch” w trakcie zatrzymuje animację; przed odczytem ustawienia statycznie', async () => {
    setReduce('never');
    const { unmount } = render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); unmount();
    setReduce(false); render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-anim')).toBeTruthy();
    const call = AI.addEventListener.mock.calls.filter((c: unknown[]) => c[0] === 'reduceMotionChanged').pop();
    await act(async () => { (call![1] as (v: boolean) => void)(true); });
    expect(screen.queryByTestId('exercise-figure-v2-anim')).toBeNull(); expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy();
  });
  test('izometria (siad przy ścianie): jedna pozycja statyczna, bez podpisu pozycji i bez pauzy; rodzina bez figury, ćwiczenie własne → nic', async () => {
    setReduce(false); render(<ExerciseFigureV2 exercise={lib('Wall Sit')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); expect(screen.queryByText('Pozycja wyjściowa')).toBeNull(); expect(screen.queryByRole('button', { name: 'Zatrzymaj animację' })).toBeNull();
    expect(screen.getByText('Rysunek schematyczny — pozycje orientacyjne.')).toBeTruthy();
    const a = render(<ExerciseFigureV2 exercise={lib('Push Up')} />); expect(a.toJSON()).toBeNull();
    const b = render(<ExerciseFigureV2 exercise={{ lib: false }} />); expect(b.toJSON()).toBeNull();
  });
  test('VoiceOver: jeden obraz z opisem „Rysunek ruchu: …” w języku interfejsu; przycisk pauzy osobno', async () => {
    setReduce(true); render(<ExerciseFigureV2 exercise={lib('Deadlift (sztanga)')} name="Martwy ciąg" />); await flush();
    const img = screen.getByTestId('exercise-figure-v2-image'); expect(img.props.accessibilityRole).toBe('image'); expect(img.props.accessible).toBe(true); expect(img.props.accessibilityLabel).toBe('Rysunek ruchu: Martwy ciąg');
    applyLang('en'); setReduce(false); render(<ExerciseFigureV2 exercise={lib('Deadlift (sztanga)')} name="Deadlift" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe('Movement drawing: Deadlift'); expect(screen.getByRole('button', { name: 'Pause animation' })).toBeTruthy();
  });
  test('bez kątów na rysunku: żadnego znaku stopnia; cyfry tylko w liczniku faz (tempo w sekundach)', async () => {
    setReduce(true); render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    const texts = screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === RN.Text).flatMap((n: { props: { children?: unknown } }) => React.Children.toArray(n.props.children as React.ReactNode)).map(String);
    for (const x of texts) { expect([x, /°/.test(x)]).toEqual([x, false]); if (/[0-9]/.test(x)) expect([x, /^(Opuszczanie|Wstawanie|Wypychanie|Podnoszenie|Prostowanie) [0-9,]+ s/.test(x)]).toEqual([x, true]); }
  });
  test('licznik faz z tempem ilustracyjnym: Opuszczanie 2 s · Wstawanie 1 s (przysiad bez pauzy na dole); martwy ciąg z podłogi: Podnoszenie 1 s, Opuszczanie 2 s; podświetlona bieżąca faza przy animacji', async () => {
    jest.useFakeTimers(); setReduce(false);
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    const ph = () => screen.getByTestId('exercise-figure-v2-phases');
    expect(screen.getByText('Opuszczanie 2 s ·')).toBeTruthy(); expect(screen.queryByText('Pauza ·')).toBeNull(); /* przysiad bez pauzy na dole (NSCA Basics s. 49–50) */ expect(screen.getByText('Wstawanie 1 s')).toBeTruthy(); expect(ph()).toBeTruthy();
    await act(async () => { jest.advanceTimersByTime(TEMPO.holdMs + 500); });
    expect(screen.getByText('Opuszczanie 2 s ·').props.style.color).toBe(light.accent);
    screen.unmount(); render(<ExerciseFigureV2 exercise={lib('Deadlift (sztanga)')} />); await flush();
    expect(screen.getByText('Podnoszenie 1 s ·')).toBeTruthy(); expect(screen.getByText('Opuszczanie 2 s')).toBeTruthy(); /* martwy ciąg zachowuje pauzy */ expect(screen.getAllByText(/Pauza/).length).toBeGreaterThan(0);
  });
  test('izometria: bez licznika faz', async () => { setReduce(true); render(<ExerciseFigureV2 exercise={lib('Wall Sit')} />); await flush(); expect(screen.queryByTestId('exercise-figure-v2-phases')).toBeNull(); });
  test('mięśnie zawsze widoczne z legendą: główne (czworogłowe) i pomocnicze; przy pewności „uproszczenie” dopisek', async () => {
    setReduce(true); render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByText('Mięśnie główne: czworogłowe')).toBeTruthy(); expect(screen.getByText(/^Mięśnie pomocnicze: /)).toBeTruthy(); expect(screen.queryByTestId('exercise-figure-v2-simplified')).toBeNull();
    const ids = pathsOf().length; expect(ids).toBeGreaterThan(60);
    const simple = Object.keys(MUSCLE_DATA).find(k => figureSpec(k) && /uproszczenie/.test(MUSCLE_DATA[k].confidence));
    expect(simple).toBeTruthy(); screen.unmount(); render(<ExerciseFigureV2 exercise={lib(simple!)} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-simplified')).toBeTruthy(); expect(screen.getByText('Dobór mięśni: uproszczenie')).toBeTruthy();
  });
  test('przełącznik „Pokaż częsty błąd”: pokazuje opis błędu ze wskazówki i zmienia rysunek; „Ukryj” przywraca; ćwiczenie bez błędu nie ma przełącznika', async () => {
    setReduce(true); render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    const d0 = pathsOf().join('|'); expect(screen.queryByTestId('exercise-figure-v2-error')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Pokaż częsty błąd' }));
    expect(screen.getByTestId('exercise-figure-v2-error')).toBeTruthy(); expect(screen.getByText(/^Częsty błąd: /)).toBeTruthy(); expect(pathsOf().join('|')).not.toBe(d0);
    expect(screen.getByTestId('exercise-figure-v2-error-kneesIn')).toBeTruthy(); fireEvent.press(screen.getByTestId('exercise-figure-v2-error-heels')); expect(screen.getAllByText(/pięt/i).length).toBeGreaterThan(0);
    fireEvent.press(screen.getByRole('button', { name: 'Ukryj częsty błąd' })); expect(screen.queryByTestId('exercise-figure-v2-error')).toBeNull(); expect(pathsOf().join('|')).toBe(d0);
    screen.unmount(); render(<ExerciseFigureV2 exercise={lib('Wall Sit')} />); await flush(); expect(screen.queryByRole('button', { name: 'Pokaż częsty błąd' })).toBeNull();
  });
  test('błąd tempa (szarpanie) przyspiesza animację; przycisk błędu dostępny również w animacji', async () => {
    jest.useFakeTimers(); setReduce(false);
    const k = Object.keys(MUSCLE_DATA).find(x => figureSpec(x) && errorsOf(figureSpec(x)!).length === 1 && errorsOf(figureSpec(x)!)[0].error === 'jerk')!;
    expect(k).toBeTruthy(); render(<ExerciseFigureV2 exercise={lib(k)} />); await flush(); fireEvent.press(screen.getByRole('button', { name: 'Pokaż częsty błąd' }));
    expect(screen.getByText(/Opuszczanie 0,5 s|Opuszczanie 0,4 s/)).toBeTruthy();
  });
  test('angielski: etykiety licznika, legendy i przełącznika po angielsku', async () => {
    applyLang('en'); setReduce(false); render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByText('Lowering 2 s ·')).toBeTruthy(); expect(screen.getByText('Main muscles: quads')).toBeTruthy(); expect(screen.getByRole('button', { name: 'Show common mistake' })).toBeTruthy();
  });
  test.each([['light', light], ['dark', dark]] as const)('kolory z motywu (%s): skóra, ubranie, sprzęt i podłoga z tokenów (figurePalette)', async (mode, th) => {
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => mode) as never); setReduce(true);
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    const fills = new Set(screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => typeof n.props.fill === 'string').map((n: { props: Record<string, unknown> }) => n.props.fill as string));
    const pal = figurePalette(th); for (const c of [pal.skin, pal.cloth, pal.steel]) expect([mode, c, fills.has(c)]).toEqual([mode, c, true]);
    expect(screen.getByText('Pozycja wyjściowa').props.style.color).toBe(th.muted);
  });
  test.each(['Back Squat', 'Bench Press (sztanga)', 'Deadlift (sztanga)', 'Wall Sit'])('rysunek statyczny jest deterministyczny i niepusty: %s', async k => {
    setReduce(true); const a = render(<ExerciseFigureV2 exercise={lib(k)} />); await flush(); const d1 = pathsOf().join('|'); a.unmount();
    render(<ExerciseFigureV2 exercise={lib(k)} />); await flush(); expect(pathsOf().join('|')).toBe(d1); expect(pathsOf().length).toBeGreaterThan(30);
  });
  test('hasTechnique: ćwiczenie z gotową rodziną v2 ma sekcję „Technika” (także bez własnych wskazówek), ćwiczenie spoza rodzin — tylko gdy ma wskazówki', () => {
    expect(hasTechnique(lib('Back Squat'))).toBe(true); expect(hasTechnique(lib('Box Squat'))).toBe(true); expect(hasTechnique({ lib: false })).toBe(false);
    expect(hasTechnique(lib('Pec Deck'))).toBe(false);
  });
});
