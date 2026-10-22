/*
 * M3 — poprawki po przebiegu E2E 39676394005 (21.10.2026): E2E-11 (tablica „teraz”: pole wpisu pod rodzicem `accessible` — ukryte przed VoiceOver i XCTest),
 * E2E-05 (Postępy: ScrollView z contentOffset ustawianym przy każdym renderze — ⓘ przewijało na górę), E2E-35 (skala wysiłku RIR w Ustawieniach → trening).
 * Rodzaje (docs/20): scenariusz, niezmiennik (strażnik dostępności tablicy), regresja. Teksty 09-lokalizacja-001…003: tests/m3-fix-e2e-teksty.test.ts.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, addWorkout, set } from './helpers';
import { renderApp, tap, flushAll, screen, act, fireEvent, openInfo } from './app';
import { within } from '@testing-library/react-native';
import fs from 'fs';
import path from 'path';
import { EN } from '@/lib/i18n.en';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { jest.restoreAllMocks(); try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });

/** Czy któryś przodek elementu jest grupą `accessible` (iOS chowa wtedy potomków przed VoiceOver i XCTest). */
const accessibleAncestor = (el: { parent: any; props: any }): string | null => { for (let p = el.parent; p; p = p.parent) if (p.props?.accessible === true && !(el.props.testID && p.props.testID === el.props.testID)) return String(p.props.testID ?? p.props.accessibilityLabel ?? p.type); return null; };

describe('E2E-11: tablica „teraz” — pola wpisu i przyciski poza grupą accessible', () => {
  const boot = async () => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(20); };
  test('pole wpisu ciężaru (po „Seria zrobiona” bez ciężaru), przyciski ± i wartość nie leżą pod rodzicem accessible; opis tablicy zostaje elementem accessible', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await boot();
    await tap(screen.getByTestId('focus-done')); await flushAll(10);
    const input = screen.getByTestId('board-input-weight'); expect(accessibleAncestor(input)).toBeNull();
    for (const id of ['step-weight-down', 'step-weight-up', 'step-reps-down', 'step-reps-up']) expect([id, accessibleAncestor(screen.getByTestId(id))]).toEqual([id, null]);
    const d = screen.getByTestId('board-desc'); expect(d.props.accessible).toBe(true); expect(d.props.accessibilityLabel).toContain('Bench Press');
  });
  test('pole wpisu nie jest też ukryte przed VoiceOver przez rodzica (accessibilityElementsHidden)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await boot();
    await tap(screen.getByTestId('focus-done')); await flushAll(10);
    for (let p = screen.getByTestId('board-input-weight').parent; p; p = p.parent) { expect(p.props?.accessibilityElementsHidden).not.toBe(true); expect(p.props?.importantForAccessibility).not.toBe('no-hide-descendants'); }
  });
});

describe('E2E-05: Postępy — ⓘ nie zmienia przewinięcia', () => {
  const seed = () => { addWorkout(Date.now() - 3 * 864e5, [['Back Squat', [{ weight: 80, reps: 5 }]]], 'Góra A'); addWorkout(Date.now() - 2 * 864e5, [['Back Squat', [{ weight: 90, reps: 5 }]]], 'Góra A'); addWorkout(Date.now() - 864e5, [['Bench Press (sztanga)', [set({ weight: 60, reps: 8 })]]], 'Góra B'); };
  const boot = async () => { await fresh(); seed(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/progress' }); await flushAll(10); };
  const offset = () => JSON.stringify(screen.getByTestId('progress-scroll').props.contentOffset);
  test('stuknięcie ⓘ po przewinięciu: objaśnienie widoczne, a contentOffset ScrollView nie jest ustawiany z pozycji przewinięcia (skok na górę)', async () => {
    await boot(); const before = offset();
    await act(async () => { fireEvent.scroll(screen.getByTestId('progress-scroll'), { nativeEvent: { contentOffset: { x: 0, y: 1400 }, contentSize: { width: 390, height: 4000 }, layoutMeasurement: { width: 390, height: 800 } } }); });
    await act(async () => { store.save(); }); await flushAll(10); /* zmiana stanu (useTick) renderuje Postępy ponownie — jak ogłoszenie, zegar albo zapis w tle */
    await openInfo('sets-part'); await flushAll(10);
    expect(screen.getByTestId('info-text-sets-part')).toBeTruthy(); expect(offset()).toBe(before);
  });
  test('wybór chipa ćwiczenia nadal pokazuje wykres tego ćwiczenia', async () => {
    await boot(); await tap(screen.getByLabelText('Bench Press (sztanga)')); await flushAll(10);
    expect(screen.getByTestId('progress-chooser')).toBeTruthy(); expect(screen.getAllByText(/Bench Press/).length).toBeGreaterThan(0);
  });
});

describe('E2E-32 (przebieg 39726518856, 22.10.2026): rekordy ćwiczenia z hantlami w Postępach — asercja scenariusza 32 na wierszu rekordu, nie na chipie wykresu', () => {
  /* Przyczyna: „Max weight” trafiało przed M3 w chip metryki („max weight”, Maestro bez rozróżniania wielkości liter). Od ZM-06 ostatnio trenowane ćwiczenie jest już wybrane,
   * stuknięcie jego chipa nic nie zmienia (bez przewinięcia na górę), a karta z chipami metryk leży nad krawędzią; widoczne są „RECORDS” i wiersze rekordów. */
  const boot = async () => { await fresh(); addWorkout(Date.now() - 864e5, [['Bench Press (hantle)', [{ weight: 24, reps: 8 }]]], 'Góra A'); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/progress' }); await flushAll(10); };
  test('ostatnio trenowane ćwiczenie z hantlami jest wybrane na górze, a jego grupa rekordów ma wiersz „Max ciężar (per hantel)”', async () => {
    await boot();
    expect(screen.getByTestId('progress-hero')).toBeTruthy();
    expect(within(screen.getByTestId('progress-records')).getByText('Max ciężar (per hantel)')).toBeTruthy();
  });
  test('scenariusz 32: asercja po „RECORDS” to angielska etykieta tego wiersza rekordu (nie chip metryki „max weight” nad krawędzią)', () => {
    const flow = fs.readFileSync(path.join(__dirname, '../.maestro/32-regularny-uzytkownik.yaml'), 'utf8');
    const after = flow.slice(flow.indexOf('extendedWaitUntil: { visible: "RECORDS"'));
    const assert = /- assertVisible: "([^"]+)"/.exec(after)![1].replace(/\\\\/g, '');
    expect(assert).toBe(EN['Max ciężar (per hantel)']);
    expect(assert.toLowerCase()).not.toBe(EN['max ciężar'].toLowerCase());
  });
});

describe('E2E-35: skala wysiłku RIR z Ustawień trafia do treningu', () => {
  test('stuknięcie „RIR” (testID effort-scale-rir) zapisuje effortScale i trening w widoku listy ma kolumnę RIR', async () => {
    await fresh(); S().settings.showRpe = true; S().settings.workoutView = 'list'; store.save(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); await flushAll(10);
    await tap(screen.getByTestId('effort-scale-rir')); await flushAll(10);
    expect(S().settings.effortScale).toBe('rir');
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/' }); await flushAll(20); /* nowe uruchomienie: ustawienie przetrwało zapis */
    const hid = { includeHiddenElements: true }; expect(screen.getAllByText('RIR', hid).length).toBeGreaterThan(0); expect(screen.queryAllByText('RPE', hid)).toHaveLength(0); /* nagłówek kolumny jest ukryty przed VoiceOver (A11-18) */
  });
});

describe('Scenariusze Maestro: po wpisie w wyszukiwarce wyboru ćwiczenia zawsze Enter', () => {
  test('każdy inputText po „Search exercises…” ma zaraz po sobie (poza asercją wartości pola) pressKey: Enter', () => {
    const fs = require('fs'); const path = require('path'); const dir = path.join(__dirname, '..', '.maestro'); const bad: string[] = [];
    for (const f of fs.readdirSync(dir).filter((x: string) => x.endsWith('.yaml'))) {
      const L: string[] = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
      L.forEach((l, i) => { if (!/^\s*- inputText:/.test(l) || !/Search exercises/.test(L.slice(Math.max(0, i - 3), i).join('\n'))) return; if (/inputText/.test(L[i + 1] ?? '')) return; const next = L.slice(i + 1).find(x => x.trim() && !/^\s*- assertVisible/.test(x) && !/^\s*#/.test(x)) ?? ''; if (!/^\s*- pressKey: Enter/.test(next)) bad.push(`${f}:${i + 1}`); });
    }
    expect(bad).toEqual([]);
  });
});

describe('04-studio-projektowe-001: cyfry tablicy jak w makiecie (render, nie tylko funkcja)', () => {
  const RN = require('react-native'); const { within } = require('@testing-library/react-native');
  const sizeAt = async (w: number, weight: number, reps: number, lb = false) => {
    const { applyUnit } = require('@/lib/units');
    jest.spyOn(RN, 'useWindowDimensions').mockReturnValue({ width: w, height: 800, scale: 2, fontScale: 1 });
    await fresh(); S().settings.unit = lb ? 'lb' : 'kg'; applyUnit(lb ? 'lb' : 'kg'); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); Object.assign(S().active!.exercises[0].sets[0], { weight, reps });
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(20);
    const st = (id: string) => ([] as any[]).concat(within(screen.getByTestId(id)).getByText(/\d/).props.style).flat(3).reduce((a: any, x: any) => ({ ...a, ...(x || {}) }), {});
    const out = { w: st('board-value-weight').fontSize as number, r: st('board-value-reps').fontSize as number }; applyUnit('kg'); return out;
  };
  test('390 pt, „80 × 6”: cyfry co najmniej 80 pt (wzorzec ok. 93)', async () => { const s = await sizeAt(390, 80, 6); expect(s.w).toBeGreaterThanOrEqual(80); expect(s.w).toBe(s.r); });
  test.each([[320], [375], [390], [430]])('%i pt, „187,5 lb × 12”: szacunek szerokości wiersza (cyfra 0,6 em, przecinek 0,3 em, „×” 0,45 kroju, „lb”) mieści się w tablicy', async w => {
    const size = (await sizeAt(w, 85, 12, true)).w; const inner = w - 4 * 16;
    const est = size * (6 * 0.6 + 0.3) + size * 0.45 * 0.7 + 2 * 4 + 28 + 4; expect(est).toBeLessThanOrEqual(inner); expect(size).toBeGreaterThanOrEqual(40);
  });
});

describe('04-studio-projektowe-004: kontur pola czekającego widoczny w każdej palecie', () => {
  const { light, dark, lightHC, darkHC } = require('@/lib/theme');
  const lum = (h: string) => { const c = h.slice(1).match(/../g)!.map((x: string) => parseInt(x, 16) / 255).map((v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  test('render (jasny): kontur pola czekającego ma kolor inny niż tło tablicy i kontrast ≥ 3:1 do niego (we wszystkich czterech paletach)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(20);
    const st = ([] as any[]).concat(screen.getByTestId('board-field-1', { includeHiddenElements: true }).props.style).flat(3).reduce((a: any, x: any) => ({ ...a, ...(x || {}) }), {});
    expect(st.borderColor).not.toBe(light.board); expect(ratio(st.borderColor, light.board)).toBeGreaterThanOrEqual(3);
    for (const [n, p] of [['jasny', light], ['ciemny', dark], ['jasny HC', lightHC], ['ciemny HC', darkHC]] as [string, any][]) expect([n, ratio(p.boardMuted, p.board) >= 3]).toEqual([n, true]);
  });
});

describe('04-studio-projektowe-005: seria na czas — dokładnie jeden „Zakończ serię”', () => {
  const run = async (view: 'focus' | 'list') => {
    await fresh(); S().settings.workoutView = view; store.startEmpty(); store.addExerciseToActive(ex('Plank')); S().active!.exercises[0].sets[0].durationSec = 30;
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(20);
  };
  test('widok tablicy: po Start jest jeden przycisk (na tablicy), a „Zakończ serię” kończy pomiar', async () => {
    await run('focus'); await tap(screen.getByTestId('focus-start')); await flushAll(20); expect(timer.S.on).toBe(true);
    expect(screen.getAllByText('Zakończ serię')).toHaveLength(1); expect(screen.getByTestId('focus-finish-set')).toBeTruthy();
  });
  test('widok listy: pasek stopera jest jedynym przyciskiem „Zakończ serię” (bez tablicy)', async () => {
    await run('list'); await tap(screen.getByLabelText(/Start/)); await flushAll(20);
    if (!timer.S.on) await tap(screen.getAllByText(/^▶/)[0]); await flushAll(20); expect(timer.S.on).toBe(true); expect(screen.getAllByText('Zakończ serię')).toHaveLength(1); expect(screen.queryByTestId('focus-finish-set')).toBeNull();
  });
});

describe('04-studio-projektowe-006: rząd ponad 12 pól przewijany palcem (etykieta VoiceOver „lista serii przewijana” zgodna z zachowaniem)', () => {
  const HID = { includeHiddenElements: true } as const;
  const run = async (n: number) => { await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); for (let i = 1; i < n; i++) store.addSet(0); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(20); };
  test('15 serii: kontener pól przepuszcza dotyk do przewijanego rzędu (nie „none”), przewijanie włączone, opis mówi o przewijaniu', async () => {
    await run(15); expect(screen.getByTestId('board-fields', HID).props.pointerEvents).not.toBe('none'); expect(screen.getByTestId('board-fields-scroll', HID).props.scrollEnabled).toBe(true);
    expect(screen.getByTestId('board-desc').props.accessibilityLabel).toContain('lista serii przewijana');
  });
  test('8 serii: pola bez dotyku (pointerEvents none), bez przewijania i bez wzmianki o przewijaniu', async () => {
    await run(8); expect(screen.getByTestId('board-fields', HID).props.pointerEvents).toBe('none'); expect(screen.queryByTestId('board-fields-scroll', HID)).toBeNull(); expect(screen.getByTestId('board-desc').props.accessibilityLabel).not.toContain('przewijana');
  });
});

describe('04-studio-projektowe-007: przyciski ± mieszczą się w tablicy przy 320 pt', () => {
  const RN = require('react-native');
  const flat = (st: any) => ([] as any[]).concat(st).flat(3).reduce((a: any, x: any) => ({ ...a, ...(x || {}) }), {});
  test.each([[320], [375], [390]])('%i pt: suma szerokości wiersza ± (koła 44 pt, etykiety, odstępy) ≤ szerokość wnętrza tablicy', async w => {
    jest.spyOn(RN, 'useWindowDimensions').mockReturnValue({ width: w, height: 800, scale: 2, fontScale: 1 });
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(20);
    const up = (n: any, f: (x: any) => boolean) => { let p = n.parent; while (p && !f(p)) p = p.parent; return p; };
    const group = (k: string) => up(screen.getByTestId(`step-${k}-down`), (x: any) => typeof flat(x.props.style).gap === 'number'); /* [−][jednostka][+] */
    const groups = ['weight', 'reps'].map(k => { const g = group(k); const gap = flat(g.props.style).gap ?? 0; const label = (g.findAll((c: any) => typeof flat(c.props?.style).minWidth === 'number') as any[]).map((c: any) => flat(c.props.style).minWidth)[0] ?? 0; return 44 * 2 + label + 2 * gap; });
    const rowGap = flat(up(group('weight'), (x: any) => typeof flat(x.props.style).gap === 'number')?.props.style).gap ?? 0; const total = groups.reduce((a, b) => a + b, 0) + rowGap;
    expect(total).toBeLessThanOrEqual(w - 4 * 16);
  });
});

describe('lib/board: boardDigitChars (04-studio-projektowe-001)', () => {
  const { boardDigitChars } = require('@/lib/board');
  test('cyfry liczą się po 1, separator dziesiętny i dwukropek po pół, „—” za 1, słowo („masa ciała”) za 3; „×” i jednostki nie wchodzą', () => {
    expect(boardDigitChars(['80', '6'])).toBe(3); expect(boardDigitChars(['187,5', '12'])).toBe(6.5); expect(boardDigitChars(['1:30', '—'])).toBe(4.5);
    expect(boardDigitChars(['masa ciała', '8'])).toBe(4); expect(boardDigitChars([])).toBe(0);
  });
});
