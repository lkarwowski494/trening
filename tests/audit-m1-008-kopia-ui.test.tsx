/* Audyt M1 z 19.10.2026, partia 1 — komunikaty widoczne na ekranach (008). Czerwone na commicie 8273448. */
import * as store from '@/lib/store';
import * as backup from '@/lib/backup';
import * as FS from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import * as fs from 'fs';
import * as path from 'path';
import { t } from '@/lib/i18n';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, pressAlert, seedState } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

jest.setTimeout(60000);
afterEach(() => { (global as any).__dbFail = false; });

describe('M1-008: nieudana automatyczna kopia po treningu jest widoczna, data ostatniej udanej zostaje', () => {
  test('Ekran główny: po nieudanej kopii baner z datą ostatniej udanej; udana kopia gasi baner; stan przeżywa restart', async () => {
    await renderApp(); await flushAll(10);
    const title = 'Nie udało się zapisać kopii po treningu';
    await act(async () => { await backup.autoBackup(); }); await flushAll(10); /* udana kopia */
    expect(screen.queryByText(t(title))).toBeNull();
    const okAt = store.getBackupStat().okAt!; expect(okAt).toBeGreaterThan(0);
    (FS.writeAsStringAsync as jest.Mock).mockRejectedValueOnce(new Error('ENOSPC'));
    await act(async () => { expect(await backup.autoBackup()).toBeNull(); }); await flushAll(10);
    expect(screen.getByText(t(title))).toBeTruthy();
    expect(screen.getByText(t('Ostatnia udana kopia: {date}', { date: store.fmtDate(okAt) }))).toBeTruthy();
    /* restart aplikacji: porażka i data zapamiętane w bazie (klucz „autobackup”) — nowy start pokazuje ten sam baner */
    const saved = JSON.parse(global.__kv.get('autobackup')!); expect(saved).toEqual({ okAt, failed: true });
    await renderApp({ kv: { autobackup: JSON.stringify(saved) } }); await flushAll(10);
    expect(screen.getByText(t(title))).toBeTruthy(); expect(screen.getByText(t('Ostatnia udana kopia: {date}', { date: store.fmtDate(okAt) }))).toBeTruthy();
    await act(async () => { expect(await backup.autoBackup()).not.toBeNull(); }); await flushAll(10);
    expect(screen.queryByText(t(title))).toBeNull();
  });
  test('kopia wyłączona w Ustawieniach: brak banera (nie próbowano)', async () => {
    await renderApp(); await flushAll(10); store.getState().settings.autoBackup = false;
    (FS.writeAsStringAsync as jest.Mock).mockRejectedValueOnce(new Error('ENOSPC'));
    await act(async () => { expect(await backup.autoBackup()).toBeNull(); }); await flushAll(10);
    expect(screen.queryByText(t('Nie udało się zapisać kopii po treningu'))).toBeNull();
  });
});
