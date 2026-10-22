/*
 * M2-LOK07-01 (DEC-28, 20.10.2026): „System miar” — metryczny (kg, km, m) / imperialny (lb, mi, yd) zamiast samej jednostki ciężaru.
 * Zapis bez zmian (kg i metry, pole `unit`: imperialny = 'lb'), bez migracji danych. Dystans w imperialnym: wiersz serii, podsumowanie, rekordy, historia — mi / yd;
 * pola wpisu w yd (zapis w metrach z dokładnością do cm, bez dryfu); progi km/mi w jednym module (lib/units). CSV zostaje w metrach (kolumna Distance, opis w Ustawieniach).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { fmtDist } from '@/lib/store';
import { applyUnit, dIn, dOut, distUnit, isImperial, M_PER_MI, M_PER_YD, DIST_LONG_FROM_M } from '@/lib/units';
import { applyLang, t } from '@/lib/i18n';
import { spokenDist, spokenMeters, nowParts, distParts } from '@/lib/live';
import { fresh } from './helpers';
import { renderApp, flushAll, screen, go, type, tap, act } from './app';

jest.setTimeout(60000);
afterEach(() => { applyUnit('kg'); applyLang('pl'); });
const ex = (name: string) => store.getState().exercises.find(e => e.name === name)!;

describe('fmtDist: metryczny bez zmian, imperialny mi / yd (próg w jednym module)', () => {
  test.each([[0, '0 m'], [5, '5 m'], [999, '999 m'], [1000, '1 km'], [1500, '1,5 km'], [42195, '42,2 km']] as const)('metryczny %s m → %s', (m, want) => { applyUnit('kg'); expect(fmtDist(m)).toBe(want); });
  test.each([[0, '0 yd'], [0.9144, '1 yd'], [91.44, '100 yd'], [1609, '1760 yd'], [M_PER_MI, '1 mi'], [5000, '3,11 mi'], [42195, '26,22 mi']] as const)('imperialny %s m → %s', (m, want) => { applyUnit('lb'); expect(fmtDist(m)).toBe(want); });
  test('progi: metryczny 1000 m, imperialny 1 mi; krótka jednostka pola: m / yd', () => {
    expect(DIST_LONG_FROM_M).toEqual({ metric: 1000, imperial: 1609.344 }); applyUnit('kg'); expect([isImperial(), distUnit()]).toEqual([false, 'm']); applyUnit('lb'); expect([isImperial(), distUnit()]).toEqual([true, 'yd']);
  });
  test('angielski: „mi” i „yd”', () => { applyLang('en'); applyUnit('lb'); expect(fmtDist(5000)).toBe('3.11 mi'); expect(fmtDist(91.44)).toBe('100 yd'); });
});

describe('pola dystansu: wpis w jednostce użytkownika, zapis w metrach, bez dryfu', () => {
  test('metryczny: pełne metry jak dotąd; imperialny: yardy → metry (cm), z powrotem te same yardy dla każdego 1–5000 yd', () => {
    applyUnit('kg'); expect([dIn(1234.4), dIn(''), dOut(100), dOut('')]).toEqual([1234, '', 100, '']);
    applyUnit('lb'); expect(dIn(100)).toBe(91.44); expect(dOut(91.44)).toBe(100);
    for (let y = 1; y <= 5000; y++) { const m = dIn(y) as number; expect([y, dOut(m)]).toEqual([y, y]); expect(Math.abs(m - y * M_PER_YD)).toBeLessThan(0.005 + 1e-9); }
  });
  test('keep: wpisana liczba równa pokazanej nie zmienia zapisanych metrów (100 m w imperialnym pokazuje 109 yd; ponowne „109” zostawia 100 m)', () => {
    applyUnit('lb'); expect(dOut(100)).toBe(109); expect(dIn(109, 100)).toBe(100); expect(dIn(110)).toBe(100.58);
  });
});

describe('głos i ekran blokady', () => {
  test('spokenDist: metryczny jak spokenMeters; imperialny słowami (jardy, mile)', () => {
    applyUnit('kg'); expect(spokenDist(400)).toBe(spokenMeters(400));
    applyUnit('lb'); expect(spokenDist(91.44)).toBe('100 jardów'); expect(spokenDist(0.9144)).toBe('1 jard'); expect(spokenDist(M_PER_MI)).toBe('1 mila'); expect(spokenDist(M_PER_MI * 5)).toBe('5 mil');
    applyLang('en'); expect(spokenDist(91.44)).toBe('100 yards'); expect(spokenDist(M_PER_MI)).toBe('1 mile'); expect(spokenDist(M_PER_MI * 5)).toBe('5 miles');
  });
  test('distParts: metryczny liczba i m; imperialny yd (zaokrąglone) albo mi od progu 1 mi', () => {
    applyUnit('kg'); expect(distParts(400)).toEqual({ num: '400', unit: 'm' });
    applyUnit('lb'); expect(distParts(400)).toEqual({ num: '437', unit: 'yd' }); expect(distParts(M_PER_MI)).toEqual({ num: '1', unit: 'mi' }); expect(distParts(5000)).toEqual({ num: '3,11', unit: 'mi' });
  });
  test('nowParts (ekran blokady / aktywność): imperialny — yd albo mi; metryczny bez zmian', async () => {
    await fresh(); const run = ex('Bieg'); const set = { distanceM: 400, durationSec: 100 } as never;
    applyUnit('kg'); expect(nowParts(run, set)).toMatchObject({ num: '400', unit: 'm' });
    applyUnit('lb'); expect(nowParts(run, set)).toMatchObject({ num: '437', unit: 'yd' }); expect(nowParts(run, { distanceM: 5000, durationSec: 100 } as never)).toMatchObject({ num: '3,11', unit: 'mi' });
  });
});

describe('ekrany: Ustawienia, trening, historia, postępy', () => {
  test('Ustawienia: jedno ustawienie „System miar” z dwiema opcjami; „Jednostka ciężaru” znika; wybór zapisuje unit (imperialny = lb) i przełącza yd w polu dystansu', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    expect(screen.getAllByText('System miar').length).toBeGreaterThan(0); expect(screen.queryByText('Jednostka ciężaru')).toBeNull();
    const imp = screen.getByLabelText('imperialny (lb, mi, yd)'); const met = screen.getByLabelText('metryczny (kg, km, m)');
    expect(met.props.accessibilityState.selected).toBe(true);
    await tap(imp); await flushAll(5); expect(store.getState().settings.unit).toBe('lb'); expect(screen.getByLabelText('imperialny (lb, mi, yd)').props.accessibilityState.selected).toBe(true);
    await tap(screen.getByLabelText('metryczny (kg, km, m)')); await flushAll(5); expect(store.getState().settings.unit).toBe('kg');
  });
  test('trening w imperialnym: pole dystansu w yd (placeholder), wpis 100 → 91,44 m w zapisie, pole nadal „100”; po restarcie bez zmian; wiersz historii „100 yd”', async () => {
    await renderApp(); await act(async () => { store.getState().settings.unit = 'lb'; require('@/lib/store').applyPrefs?.(); });
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Bieg')); }); await flushAll(10);
    /* M3 p2 (ZM-01): dystans wpisuje się na tablicy „teraz” — jednostka (yd) obok liczby, pole wpisu po stuknięciu */
    expect(screen.getAllByText('yd').length).toBeGreaterThan(0); await tap(screen.getByTestId('board-value-distanceM')); await flushAll(5);
    const f = screen.getByTestId('board-input-distanceM'); expect(f.props.placeholder).toBe('—');
    await type(f, '100'); await flushAll(5);
    expect(store.getState().active!.exercises[0].sets[0].distanceM).toBe(91.44); expect(screen.getByTestId('board-input-distanceM').props.value).toBe('100');
    const raw = JSON.parse(JSON.stringify(store.getState())); expect(store.migrate(raw).active!.exercises[0].sets[0].distanceM).toBe(91.44); /* migracja nie obcina do pełnych metrów */
    await act(async () => { store.getState().active!.exercises[0].sets[0].durationSec = 30; }); expect(store.setSummary(ex('Bieg'), store.getState().active!.exercises[0].sets[0])).toContain('100 yd');
  });
  test('trening w metrycznym: placeholder „m”, wpis zapisuje pełne metry jak dotąd', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Bieg')); }); await flushAll(10);
    expect(screen.getAllByText('m').length).toBeGreaterThan(0); await tap(screen.getByTestId('board-value-distanceM')); await flushAll(5);
    const f = screen.getByTestId('board-input-distanceM'); await type(f, '400.6'); await flushAll(5);
    expect(store.getState().active!.exercises[0].sets[0].distanceM).toBe(401);
  });
});

describe('strażnik: teksty dystansu tylko przez helper', () => {
  const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) && !/i18n(\.en)?\.ts$/.test(e.name) ? [path.join(d, e.name)] : []);
  test("t('{n} km') i t('{n} m') (oraz {n} mi / {n} yd) występują tylko w lib/state/time.ts", () => {
    const root = path.join(__dirname, '..'); const bad: string[] = [];
    for (const d of ['app', 'components', 'lib']) for (const f of walk(path.join(root, d))) { const src = fs.readFileSync(f, 'utf8'); if (/'\{n\} (km|m|mi|yd)'/.test(src) && !f.endsWith(path.join('lib', 'state', 'time.ts'))) bad.push(path.relative(root, f)); }
    expect(bad).toEqual([]);
  });
  test('słownik: klucze nowego ustawienia i jednostek są w angielskim słowniku', () => {
    const { EN } = require('@/lib/i18n.en'); for (const k of ['System miar', 'metryczny (kg, km, m)', 'imperialny (lb, mi, yd)', '{n} mi', '{n} yd', 'mila|mile|mil', 'mili', 'jard|jardy|jardów', 'jarda']) expect([k, k in EN]).toEqual([k, true]);
    expect(t('System miar')).toBe('System miar');
  });
});
