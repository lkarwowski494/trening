/*
 * M1-audytor-generalny-041: (a) przypomnienie o końcu okresu próbnego było planowane w języku z chwili synchronizacji i po zmianie języka zostawało w starym;
 * (b) nazwy plików kopii po polsku („trening-…”, „trening-przed-importem-…”). Po naprawie: wybór języka planuje przypomnienie ponownie (lib/entitlement.ts
 * resyncTrialReminder), nazwy plików są neutralne („training-…”, „training-before-import-…”), a wyrażenia puli kopii rozpoznają stare i nowe nazwy.
 */
import * as backup from '@/lib/backup';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { TRIAL_REMINDER_ID } from '@/lib/trialReminder';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import * as ent from '@/lib/entitlement';
import { applyLang } from '@/lib/i18n';
import { fresh } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

jest.setTimeout(60000);
const DAY = 86400e3; const NOW = new Date(2026, 9, 14, 12, 0).getTime();
const trial = (end: number): Entitlement => ({ plan: 'monthly', source: 'purchase', expiresAt: end, trial: true });
const notes = () => global.__notifications as { identifier: string; content: { title: string } }[];
afterEach(() => { PAYWALL.ENABLED = false; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); jest.restoreAllMocks(); });

describe('przypomnienie o końcu próby po zmianie języka', () => {
  test('próba w toku (PL) → wybór English na ekranie Język → przypomnienie zaplanowane ponownie po angielsku (jedno, ten sam identyfikator)', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true; setStoreAdapter(createFakeStore([trial(NOW + 30 * DAY)])); await ent.initEntitlements(); for (let i = 0; i < 8; i++) await Promise.resolve();
    expect(notes()).toHaveLength(1); expect(notes()[0].content.title).toBe('Okres próbny dobiega końca');
    await renderApp({ url: '/more/language' }); await flushAll(10);
    global.__notifications.length = 0; global.__cancelled.length = 0;
    await tap(screen.getByText('English')); await act(async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); }); await flushAll(10);
    expect(global.__cancelled).toContain(TRIAL_REMINDER_ID); expect(notes()).toHaveLength(1); expect(notes()[0].identifier).toBe(TRIAL_REMINDER_ID); expect(notes()[0].content.title).toBe('Your free trial is ending');
  });
  test('bez próby (lub bez odpowiedzi sklepu) zmiana języka niczego nie planuje', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true; setStoreAdapter(createFakeStore([])); await ent.initEntitlements(); for (let i = 0; i < 8; i++) await Promise.resolve();
    global.__notifications.length = 0; await ent.resyncTrialReminder(); expect(notes()).toEqual([]);
    ent.resetEntitlementsForTests(); global.__cancelled.length = 0; await ent.resyncTrialReminder(); expect(global.__cancelled).toEqual([]); /* brak odpowiedzi sklepu → bez zmian */
  });
});

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
