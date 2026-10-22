/*
 * M1-audytor-generalny-041: nazwy plików kopii po polsku („trening-…”, „trening-przed-importem-…”). Po naprawie nazwy plików są neutralne („training-…”,
 * „training-before-import-…”), a wyrażenia puli kopii rozpoznają stare i nowe nazwy. Część (a) — przypomnienie o końcu okresu próbnego po zmianie języka —
 * usunięta 22.10.2026 razem z okresem próbnym (M5 S1; strażnik braku oferty: tests/m5s1-bez-proby.test.ts).
 */
import * as backup from '@/lib/backup';
import { PAYWALL } from '@/lib/access';
import { resetStoreAdapterForTests } from '@/lib/store-adapter';
import * as ent from '@/lib/entitlement';
import { applyLang } from '@/lib/i18n';
import { fresh } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

jest.setTimeout(60000);
afterEach(() => { PAYWALL.ENABLED = false; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); jest.restoreAllMocks(); });

describe('nazwy plików kopii', () => {
  const FS = require('expo-file-system/legacy'); const SH = require('expo-sharing');
  const writes = (re: RegExp) => (FS.writeAsStringAsync as jest.Mock).mock.calls.filter((c: unknown[]) => re.test(String(c[0])));
  beforeEach(() => { FS.writeAsStringAsync.mockClear(); FS.deleteAsync.mockClear(); });
  afterEach(() => { FS.readDirectoryAsync.mockImplementation(async () => []); FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); });
  test('wyrażenia puli rozpoznają stare i nowe nazwy (kopia po treningu, bezpieczeństwa); obce pliki nie wchodzą do puli', () => {
    const { AUTO_RE, SAFETY_RE } = backup as unknown as { AUTO_RE: RegExp; SAFETY_RE: RegExp };
    for (const n of ['trening-2026-10-03-120005.json', 'trening-2026-10-03-120005-2.json', 'training-2026-10-03-120005.json', 'training-2026-10-03-120005-12.json']) expect([n, AUTO_RE.test(n)]).toEqual([n, true]);
    for (const n of ['trening-przed-importem-2026-10-03-120005.json', 'trening-przed-czyszczeniem-2026-10-03-120005-3.json', 'training-before-import-2026-10-03-120005.json', 'training-before-reset-2026-10-03-120005-2.json']) expect([n, SAFETY_RE.test(n)]).toEqual([n, true]);
    for (const n of ['training-before-import-2026-10-03-120005.json', 'trening-przed-importem-2026-10-03-120005.json', 'moje.json', 'training-2026-10-03.json', 'training-backup-2026-10-03.json']) expect([n, AUTO_RE.test(n)]).toEqual([n, false]);
    for (const n of ['training-2026-10-03-120005.json', 'trening-2026-10-03-120005.json', 'training-before-x-2026-10-03-120005.json']) expect([n, SAFETY_RE.test(n)]).toEqual([n, false]);
  });
  test('nowe kopie: po treningu „training-…”, przed importem „training-before-import-…”, przed czyszczeniem „training-before-reset-…”', async () => {
    await fresh(); jest.useFakeTimers({ now: new Date(2026, 9, 3, 12, 0, 5) });
    await act(async () => { const { getState } = require('@/lib/store'); getState().settings.autoBackup = true; });
    expect(await backup.autoBackup()).toBe('file:///doc/Backup/training-2026-10-03-120005.json');
    expect(await backup.safetyBackup('import')).toBe('file:///doc/Backup/training-before-import-2026-10-03-120005.json');
    expect(await backup.safetyBackup('reset')).toBe('file:///doc/Backup/training-before-reset-2026-10-03-120005.json');
    expect(writes(/trening-/)).toEqual([]);
  });
  test('rotacja puli liczy razem stare („trening-…”) i nowe („training-…”) kopie po treningu', async () => {
    await fresh(); jest.useFakeTimers({ now: new Date(2026, 9, 3, 12, 0, 5) }); await act(async () => { require('@/lib/store').getState().settings.autoBackup = true; });
    const old = Array.from({ length: 6 }, (_, i) => `trening-2026-09-${String(10 + i).padStart(2, '0')}-070000.json`); const mid = Array.from({ length: 6 }, (_, i) => `training-2026-09-${String(20 + i).padStart(2, '0')}-070000.json`);
    FS.readDirectoryAsync.mockImplementation(async () => [...old, ...mid, 'moje.json']);
    await backup.autoBackup(); expect((FS.deleteAsync as jest.Mock).mock.calls.map((c: unknown[]) => String(c[0]).split('/').pop())).toEqual([old[1], old[0]]); /* 12 w puli (bez „moje.json”) → 2 najstarsze, niezależnie od prefiksu */
  });
  test('eksport JSON i CSV: neutralne nazwy plików tymczasowych; sprzątanie zostawionych plików rozpoznaje stare i nowe', async () => {
    await fresh(); SH.shareAsync.mockClear();
    await backup.exportBackup(); await backup.exportCsv(); const shared = (SH.shareAsync as jest.Mock).mock.calls.map((c: unknown[]) => String(c[0]).split('/').pop());
    expect(shared[0]).toMatch(/^training-backup-\d{4}-\d{2}-\d{2}\.json$/); expect(shared[1]).toMatch(/^training-\d{4}-\d{2}-\d{2}\.csv$/);
    FS.readDirectoryAsync.mockImplementation(async () => ['trening-backup-2026-10-03.json', 'training-backup-2026-10-03.json', 'training-2026-10-03.csv', 'trening-dane-2026-10-03.json', 'training-data-2026-10-03.json', 'training-recovery-2026-10-03.json', 'obcy.json']);
    expect(await backup.cleanShareLeftovers()).toBe(6);
  });
});
