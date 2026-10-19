/* Audyt M1 z 19.10.2026, partia 1 — komunikaty widoczne na ekranach (006). Czerwone na commicie 8273448. */
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

describe('M1-006: ekrany importu pokazują błąd zapisu zamiast „Zaimportowano”', () => {
  test('Kopia zapasowa -> Importuj backup przy niedziałającym zapisie: „Nie udało się zapisać danych”, bez „Zaimportowano”', async () => {
    await renderApp(); await flushAll(10);
    const other: any = seedState('pl'); other.settings.defaultRest = 33;
    (FS.readAsStringAsync as jest.Mock).mockImplementationOnce(async () => JSON.stringify({ format: 'trening-backup', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), state: other }));
    (DocumentPicker.getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///x.json' }] }));
    await go('/more/backup'); await flushAll(10);
    (global as any).__dbFail = (k: string) => k === 'state';
    await tap(screen.getByText('Importuj backup')); await act(async () => { pressAlert('Nadpisać dane?', 'Importuj'); }); await flushAll(50); await flushAll(50);
    expect(global.__alerts.some(a => a.title === t('Zaimportowano'))).toBe(false);
    expect(global.__alerts.some(a => a.title === t('Nie udało się zapisać danych'))).toBe(true);
  });
  test('Import CSV przy niedziałającym zapisie: „Nie udało się zapisać danych”, bez „Zaimportowano”', async () => {
    await renderApp(); await flushAll(10);
    const csv = fs.readFileSync(path.join(__dirname, 'fixtures', 'import-formatA.csv'), 'utf8');
    (FS.readAsStringAsync as jest.Mock).mockImplementationOnce(async () => csv);
    (DocumentPicker.getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///x.csv', name: 'x.csv' }] }));
    await go('/more/import'); await flushAll(10);
    await tap(screen.getByText(t('Wybierz plik CSV'))); await flushAll(20);
    (global as any).__dbFail = (k: string) => k === 'state';
    await tap(screen.getByText(t('Importuj'))); await flushAll(20); await flushAll(20);
    expect(global.__alerts.some(a => a.title === t('Zaimportowano'))).toBe(false);
    expect(global.__alerts.some(a => a.title === t('Nie udało się zapisać danych'))).toBe(true);
  });
});

