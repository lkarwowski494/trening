/*
 * Audyt kontrolny 1 (przed 0.10.0), MER2-01 [WYSOKA]: opis e1RM ćwiczenia z udziałem masy ciała < 1 (pompki: BW_SHARE 0,64) mówił „masa ciała + X”,
 * a liczba to udział × masa ciała + X (80 kg: „64,85 kg (masa ciała + 13,65)”, a 80 + 13,65 = 93,65). Naprawa: przy udziale < 1 — „{p}% masy ciała + X”
 * (p z BW_SHARE), przy udziale 1 bez zmian. To samo w oknie rekordu po treningu.
 * Rodzaje (docs/20): logika (fmtE1, workoutPRs — PL i EN, kg i lb), ekran (Postępy Push Up i Pull Up), języki (EN + niezmiennik: opis zgadza się z liczbą), regresja.
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { BW_SHARE, fmtE1, e1rm, workoutPRs, bwE1Diff } from '@/lib/stats';
import { fresh, saved, addWorkout, ex, setBodyMass } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(30000);
const NOW = new Date(2026, 9, 8, 18).getTime();
const at = (d: number) => new Date(2026, 9, d, 18).getTime();
const P = Math.round(BW_SHARE['Push Up'] * 100);
const PUSH8 = e1rm(BW_SHARE['Push Up'] * 80, 8); /* 64,853… */
afterEach(() => { applyLang('pl'); applyUnit('kg'); jest.useRealTimers(); });

describe('MER2-01: logika', () => {
  beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
  test('fmtE1 Push Up (udział < 1): „{p}% masy ciała + X”, gdzie p% × masa + X = e1RM; Pull Up (udział 1) bez zmian — PL', () => {
    expect(P).toBe(64);
    expect(fmtE1(ex('Push Up'), PUSH8, 80)).toBe('64,85 kg (64% masy ciała + 13,65)');
    expect(fmtE1(ex('Push Up'), 40, 80)).toBe('40 kg (64% masy ciała − 11,2)');
    expect(fmtE1(ex('Pull Up'), 126.67, 80)).toBe('126,67 kg (masa ciała + 46,67)');
    /* niezmiennik: p% × masa ciała + różnica = e1RM (z dokładnością zaokrąglenia opisu) */
    expect((P / 100) * 80 + bwE1Diff(ex('Push Up'), PUSH8, 80)!).toBeCloseTo(PUSH8, 6);
    applyUnit('lb'); expect(fmtE1(ex('Push Up'), PUSH8, 80)).toMatch(/^[\d,]+ lb \(64% masy ciała \+ [\d,]+\)$/);
  });
  test('fmtE1 — EN', async () => {
    applyLang('en');
    expect(fmtE1(ex('Push Up'), PUSH8, 80)).toBe('64.85 kg (64% of body weight + 13.65)');
    expect(fmtE1(ex('Pull Up'), 126.67, 80)).toBe('126.67 kg (body weight + 46.67)');
  });
  test('okno rekordu po treningu (workoutPRs): Push Up — „64% masy ciała + X; seria …”, Pull Up bez zmian; EN', () => {
    setBodyMass(80);
    addWorkout(at(1), [['Push Up', [{ reps: 5 }]], ['Pull Up', [{ addKg: 10, reps: 8 }]]]);
    const w = addWorkout(at(3), [['Push Up', [{ reps: 8 }]], ['Pull Up', [{ addKg: 20, reps: 8 }]]]);
    const d = workoutPRs(w).flatMap(p => p.details);
    expect(d).toContain('e1RM 64,85 kg (64% masy ciała + 13,65; seria 0 kg × 8)');
    expect(d).toContain('e1RM 126,67 kg (masa ciała + 46,67; seria 20 kg × 8)');
    applyLang('en'); const e = workoutPRs(w).flatMap(p => p.details);
    expect(e).toContain('e1RM 64.85 kg (64% of body weight + 13.65; set 0 kg × 8)');
    expect(e).toContain('e1RM 126.67 kg (body weight + 46.67; set 20 kg × 8)');
  });
});

describe('MER2-01: ekran Postępy', () => {
  const boot = async (locale: 'pl' | 'en' = 'pl') => {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale);
    setBodyMass(80); addWorkout(at(1), [['Push Up', [{ reps: 8 }]], ['Pull Up', [{ addKg: 20, reps: 8 }]]]);
    store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10);
  };
  test('PL: Push Up „64,85 kg (64% masy ciała + 13,65)”, bez „masa ciała + 13,65”; Pull Up „masa ciała + 46,67”', async () => {
    await boot();
    await go(`/more/progress?ex=${ex('Push Up').id}`); await flushAll(10);
    expect(screen.getByText('64,85 kg (64% masy ciała + 13,65)')).toBeTruthy(); expect(screen.queryByText(/\(masa ciała \+ 13,65\)/)).toBeNull();
    await go(`/more/progress?ex=${ex('Pull Up').id}`); await flushAll(10);
    expect(screen.getByText('126,67 kg (masa ciała + 46,67)')).toBeTruthy();
  });
  test('EN: Push Up „64.85 kg (64% of body weight + 13.65)”', async () => {
    await boot('en');
    await go(`/more/progress?ex=${ex('Push Up').id}`); await flushAll(10);
    expect(screen.getByText('64.85 kg (64% of body weight + 13.65)')).toBeTruthy();
  });
});
