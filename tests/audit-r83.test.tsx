/* Runda 83 — backlog po pierwszym teście na iPhonie (docs/09):
 *  - T-053: przypomnienie o podpisie dopasowane do drogi instalacji (ad hoc przez EAS → nowy build w GitHubie; darmowe Apple ID → Sideloadly). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as signing from '@/lib/signing';
import { fresh } from './helpers';
import { renderApp, flushAll, screen } from './app';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const DAY = 86400e3;
/** Treść embedded.mobileprovision (plist w kopercie CMS — tu tylko śmieci przed XML-em) zakodowana base64, jak czyta ją aplikacja. */
const profileB64 = (created: number, expires: number, extra = '') => Buffer.from(`0\u0082\u0003garbage<?xml version="1.0"?><plist version="1.0"><dict><key>AppIDName</key><string>trening</string><key>CreationDate</key><date>${new Date(created).toISOString().replace(/\.\d+Z$/, 'Z')}</date>${extra}<key>ExpirationDate</key><date>${new Date(expires).toISOString().replace(/\.\d+Z$/, 'Z')}</date></dict></plist>`, 'latin1').toString('base64');

describe('T-053 przypomnienie o podpisie wg drogi instalacji', () => {
  const FS = require('expo-file-system');
  const useProfile = (b64: string | null) => {
    signing.__resetSigningCache();
    (global as { __bundleDir?: string | null }).__bundleDir = b64 ? '/var/containers/Bundle/Application/X/Trening.app/' : null;
    FS.getInfoAsync.mockImplementation(async (uri: string) => ({ exists: !!b64 && uri.endsWith('embedded.mobileprovision') }));
    FS.readAsStringAsync.mockImplementation(async (uri: string) => (b64 && uri.endsWith('embedded.mobileprovision') ? b64 : ''));
  };
  afterEach(() => { useProfile(null); FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); FS.readAsStringAsync.mockImplementation(async () => ''); });

  test('rodzaj profilu z okresu ważności: 7 dni = darmowe Apple ID (Sideloadly), rok = ad hoc (nowy build); brak CreationDate → droga główna', () => {
    const dec = (b64: string) => signing.decodeB64(b64);
    const c = Date.UTC(2026, 9, 2, 18, 37);
    expect(signing.parseRenewKind(dec(profileB64(c, c + 7 * DAY)))).toBe('sideloadly');
    // profil ad hoc z EAS: 02.10.2026 → 02.10.2027 (pierwszy build na iPhonie)
    expect(signing.parseRenewKind(dec(profileB64(c, Date.UTC(2027, 9, 2, 18, 37), '<key>Entitlements</key><dict><key>get-task-allow</key><false/></dict><key>ProvisionedDevices</key><array><string>00008110-000A</string></array>')))).toBe('rebuild');
    expect(signing.parseRenewKind('<key>ExpirationDate</key><date>2027-10-02T18:37:00Z</date>')).toBe('rebuild');
    expect(signing.parseRenewKind('')).toBe('rebuild');
    // granica: FREE_PROFILE_MAX_DAYS włącznie
    expect(signing.parseRenewKind(dec(profileB64(c, c + signing.FREE_PROFILE_MAX_DAYS * DAY)))).toBe('sideloadly');
    expect(signing.parseRenewKind(dec(profileB64(c, c + signing.FREE_PROFILE_MAX_DAYS * DAY + 1000)))).toBe('rebuild');
  });

  test('powiadomienie dzień przed wygaśnięciem: ad hoc → GitHub (bez Sideloadly), darmowe Apple ID → Sideloadly', async () => {
    await fresh();
    useProfile(profileB64(Date.now() - 360 * DAY, Date.now() + 5 * DAY)); global.__notifications.length = 0;
    await signing.scheduleReminder();
    const body = (global.__notifications as { content: { body: string } }[]).map(n => n.content.body);
    expect(body).toEqual(['Zrób backup (Więcej → Backup) i zbuduj aplikację od nowa w GitHubie: iPhone (EAS) → build. Dane zostają.']);
    useProfile(profileB64(Date.now() - 2 * DAY, Date.now() + 5 * DAY)); global.__notifications.length = 0;
    await signing.scheduleReminder();
    expect((global.__notifications as { content: { body: string } }[]).map(n => n.content.body)).toEqual(['Zrób backup (Więcej → Backup) i odnów w Sideloadly. Dane zostają.']);
  });

  test('baner na ekranie głównym: ad hoc → build w GitHubie, bez słowa o Sideloadly (PL i EN)', async () => {
    useProfile(profileB64(Date.now() - 364 * DAY, Date.now() + 1.2 * DAY));
    await renderApp(); await flushAll(50);
    expect(screen.getByText(/^Podpis aplikacji wygasa (za|dziś)/)).toBeTruthy();
    expect(screen.getByText('Zrób backup, potem w GitHubie: Actions → iPhone (EAS) → build i zainstaluj z linku. Dane zostają w telefonie.')).toBeTruthy();
    expect(screen.queryByText(/Sideloadly/)).toBeNull();
    useProfile(profileB64(Date.now() - 364 * DAY, Date.now() + 1.2 * DAY));
    await renderApp({ locale: 'en' }); await flushAll(50);
    expect(screen.getByText('Make a backup, then on GitHub: Actions → iPhone (EAS) → build, and install from the link. Your data stays on the phone.')).toBeTruthy();
    expect(screen.queryByText(/Sideloadly/)).toBeNull();
  });

  test('baner: darmowe Apple ID (7 dni) → nadal Sideloadly; profil wygasły ad hoc → „zbuduj ją od nowa w GitHubie”', async () => {
    useProfile(profileB64(Date.now() - 6 * DAY, Date.now() + 1.2 * DAY));
    await renderApp(); await flushAll(50);
    expect(screen.getByText('Zrób backup i odnów w Sideloadly (ok. 2 min). Dane zostają w telefonie.')).toBeTruthy();
    useProfile(profileB64(Date.now() - 366 * DAY, Date.now() - DAY));
    await renderApp(); await flushAll(50);
    expect(screen.getByText('Podpis aplikacji wygasł — zbuduj ją od nowa w GitHubie.')).toBeTruthy();
    expect(screen.queryByText(/Sideloadly/)).toBeNull();
  });

  test('profil ad hoc z dużym zapasem (rok) → brak banera, jak dotąd (> 2 dni)', async () => {
    useProfile(profileB64(Date.now() - DAY, Date.now() + 364 * DAY));
    await renderApp(); await flushAll(50);
    expect(screen.queryByText(/^Podpis aplikacji/)).toBeNull();
  });
});
