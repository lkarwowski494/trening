/*
 * M1-audytor-generalny-032 (pętla 2, reaudyt 28.10.2026; 12-niezawodnosc-003): kod diagnostyczny w e-mailu z ekranu błędu startu był tylko przy trybie
 * awaryjnym pętli awarii; przy wyjątku migracji i przy danych z nowszej wersji e-mail miał samą stopkę. Test: wyjątek migracji → „Napisz do nas” dołącza kod
 * etapu („start: migrate…” ze schematem); ekran danych z nowszej wersji nie ma „Napisz do nas” (kod i tak dołączony do błędu — „start: newer”), bez treści błędu i bez danych treningowych (decyzja 7a, 28.10.2026).
 */
import { Linking } from 'react-native';
import { t } from '@/lib/i18n';
import { seedState } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.setTimeout(60000);
const bodyOf = (u: string) => decodeURIComponent(/body=([^&]*)/.exec(u)![1]);
const spies: jest.SpyInstance[] = [];
afterEach(() => { spies.splice(0).forEach((s) => s.mockRestore()); });

describe('M1-032: kod diagnostyczny przy błędzie migracji i danych z nowszej wersji', () => {
  test('wyjątek migracji: e-mail z kodem „start: migrate”, bez treści błędu', async () => {
    const state = seedState('pl'); state.settings.defaultRest = 77;
    spies.push(jest.spyOn(require('@/lib/state/migrate'), 'migrate').mockImplementation(() => { throw new Error('boom-migracja'); }));
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true); spies.push(open);
    await renderApp({ saved: state }); await flushAll(50);
    expect(screen.getByText('boom-migracja')).toBeTruthy();
    await tap(screen.getByText(t('Napisz do nas'))); await flushAll(20);
    const url = String(open.mock.calls.at(-1)![0]); const body = bodyOf(url);
    expect(body).toMatch(/start: migrate\b[^\n]*schema \d+/); expect(decodeURIComponent(url)).not.toContain('boom-migracja'); expect(body).not.toMatch(/defaultRest|"workouts"/);
  });
});

describe('M1-032: startFailureDiag (lib/state/bootphase.ts)', () => {
  const { startFailureDiag } = require('@/lib/state/bootphase') as typeof import('@/lib/state/bootphase');
  const ctx = { ms: 120, hadData: true, starts: 1, schema: 19 };
  test.each([
    [{ migrationFailed: true }, 'start: migrate, 120 ms, data, schema 19, n=1'],
    [{ newerSchema: 25 }, 'start: newer, 120 ms, data, schema 25, n=1'],
    [{}, 'start: init, 120 ms, data, schema 19, n=1'],
  ] as [Record<string, unknown>, string][])('%j → %s; bez treści błędu', (pola, want) => {
    const e = Object.assign(new Error('treść-błędu'), pola); startFailureDiag(e, ctx);
    expect((e as unknown as { bootDiag: string }).bootDiag).toBe(want);
  });
  test('kod trybu pętli awarii (bootDiag) zostaje bez zmian; nie-obiekt ignorowany', () => {
    const e = Object.assign(new Error('x'), { bootDiag: 'start: loaded, 1 ms' }); startFailureDiag(e, ctx);
    expect((e as unknown as { bootDiag: string }).bootDiag).toBe('start: loaded, 1 ms'); expect(() => startFailureDiag('napis', ctx)).not.toThrow();
  });
});
