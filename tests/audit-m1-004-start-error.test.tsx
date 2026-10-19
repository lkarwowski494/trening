/* M1-audytor-generalny-004: ekran błędu startu — wysłanie danych (albo najnowszej kopii z Plików), wskazanie kopii w Plikach, kontakt;
 * żadna akcja nie zmienia bazy. Czerwone na 8273448. */
import { Linking } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FS from 'expo-file-system/legacy';
import * as store from '@/lib/store';
import { t, appName } from '@/lib/i18n';
import { AUTO_KEEP } from '@/lib/backup';
import { BOOT_GUARD_KEY, BOOT_STABLE_MS } from '@/lib/state/crashguard';
import { SUPPORT_EMAIL } from '@/lib/support';
import { exportLatestCopy, exportStartData } from '@/lib/backup';
import { fresh, seedState } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.setTimeout(60000);
const spies: jest.SpyInstance[] = [];
afterEach(() => { (global as any).__dbOpenFail = false; spies.splice(0).forEach(s => s.mockRestore()); (FS.readDirectoryAsync as jest.Mock).mockImplementation(async () => []); });
const snapshot = () => new Map([...global.__kv].filter(([k]) => k !== BOOT_GUARD_KEY));

describe('M1-004: ekran błędu startu — nie tylko ponowienie', () => {
  test('baza się nie otwiera: „Wyślij dane” udostępnia najnowszą kopię z puli (Pliki → Backup), wskazanie kopii w Plikach, „Napisz do nas”; baza bez zmian', async () => {
    (FS.readDirectoryAsync as jest.Mock).mockImplementation(async () => ['trening-2026-10-10-101010.json', 'trening-2026-10-12-090000.json', 'trening-2026-10-12-090000-2.json', 'inne.txt', 'trening-przed-importem-2026-10-11-100000.json']);
    (global as any).__dbOpenFail = true; await renderApp(); await flushAll(10);
    expect(screen.getByText('Nie udało się otworzyć danych.')).toBeTruthy();
    expect(screen.getByText(t('Automatyczna kopia po każdym treningu: Pliki → Na moim iPhonie → {app} → Backup.', { app: appName() }))).toBeTruthy();
    const kv = snapshot(); (Sharing.shareAsync as jest.Mock).mockClear();
    await tap(screen.getByText(t('Wyślij dane'))); await flushAll(20);
    expect(Sharing.shareAsync).toHaveBeenCalledTimes(1); expect((Sharing.shareAsync as jest.Mock).mock.calls[0][0]).toBe('file:///doc/Backup/trening-2026-10-12-090000-2.json');
    spies.push(jest.spyOn(Linking, 'openURL').mockResolvedValue(true));
    await tap(screen.getByText(t('Napisz do nas'))); await flushAll(20);
    expect((Linking.openURL as jest.Mock).mock.calls[0][0]).toContain(`mailto:${SUPPORT_EMAIL}`);
    expect(snapshot()).toEqual(kv); expect(AUTO_KEEP).toBeGreaterThan(0);
  });
  test('baza się nie otwiera i brak kopii w Plikach: komunikat „Nie udało się wysłać danych”', async () => {
    (global as any).__dbOpenFail = true; await renderApp(); await flushAll(10); (Sharing.shareAsync as jest.Mock).mockClear();
    await tap(screen.getByText(t('Wyślij dane'))); await flushAll(20);
    expect(Sharing.shareAsync).not.toHaveBeenCalled(); expect(global.__alerts.some(a => a.title === t('Nie udało się wysłać danych'))).toBe(true);
  });
  test('wyjątek po init: „Wyślij dane” wysyła bieżące dane z bazy, baza bez zmian', async () => {
    const state = seedState('pl'); state.settings.defaultRest = 55;
    spies.push(jest.spyOn(require('@/lib/draft'), 'restoreObjDrafts').mockImplementation(() => { throw new Error('boom-after-init'); }));
    await renderApp({ saved: state }); await flushAll(50);
    expect(screen.getByText('Nie udało się otworzyć danych.')).toBeTruthy(); expect(screen.getByText('boom-after-init')).toBeTruthy();
    const kv = snapshot(); (FS.writeAsStringAsync as jest.Mock).mockClear(); (Sharing.shareAsync as jest.Mock).mockClear();
    await tap(screen.getByText(t('Wyślij dane'))); await flushAll(20);
    const written = (FS.writeAsStringAsync as jest.Mock).mock.calls.find(c => /trening-dane-/.test(String(c[0])));
    expect(JSON.parse(written![1]).state.settings.defaultRest).toBe(55); expect(Sharing.shareAsync).toHaveBeenCalledTimes(1); expect(snapshot()).toEqual(kv);
  });
});

describe('M1-004: exportLatestCopy i exportStartData', () => {
  const dir = (names: string[] | Error) => (FS.readDirectoryAsync as jest.Mock).mockImplementation(async () => { if (names instanceof Error) throw names; return names; });
  test('exportLatestCopy: najnowsza kopia z puli (po treningu albo bezpieczeństwa, z numerem z tej samej sekundy); brak plików, błąd katalogu albo pliki spoza puli -> false', async () => {
    (Sharing.shareAsync as jest.Mock).mockClear(); dir([]);
    expect(await exportLatestCopy()).toBe(false); dir(new Error('EIO')); expect(await exportLatestCopy()).toBe(false); dir(['inne.txt', 'trening-zle.json']); expect(await exportLatestCopy()).toBe(false);
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
    dir(['trening-2026-10-12-090000.json', 'trening-przed-czyszczeniem-2026-10-13-080000.json', 'trening-2026-10-12-090000-2.json']);
    expect(await exportLatestCopy()).toBe(true); expect((Sharing.shareAsync as jest.Mock).mock.calls.at(-1)![0]).toBe('file:///doc/Backup/trening-przed-czyszczeniem-2026-10-13-080000.json');
  });
  test('exportStartData: gdy baza ma dane — wysyła je (nie kopię z Plików); gdy bazy nie ma — najnowszą kopię z puli', async () => {
    dir(['trening-2026-10-12-090000.json']); (Sharing.shareAsync as jest.Mock).mockClear(); (FS.writeAsStringAsync as jest.Mock).mockClear();
    await fresh(); expect(await exportStartData()).toBe(true);
    expect((FS.writeAsStringAsync as jest.Mock).mock.calls.some(c => /trening-dane-/.test(String(c[0])))).toBe(true); expect((Sharing.shareAsync as jest.Mock).mock.calls.at(-1)![0]).not.toContain('Backup/');
    store.__resetForTests(); (Sharing.shareAsync as jest.Mock).mockClear(); expect(await exportStartData()).toBe(true);
    expect((Sharing.shareAsync as jest.Mock).mock.calls.at(-1)![0]).toBe('file:///doc/Backup/trening-2026-10-12-090000.json');
  });
});
