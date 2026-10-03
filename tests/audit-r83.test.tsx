/* Runda 83 — backlog po pierwszym teście na iPhonie (docs/09):
 *  - T-053: przypomnienie o podpisie dopasowane do drogi instalacji (ad hoc przez EAS → nowy build w GitHubie; darmowe Apple ID → Sideloadly);
 *  - T-055: martwy kod asysty kg gumy usunięty (nominalKg, pairAssist, applyBandAssist); stare kopie z nominalKg dalej się importują, pole odpada. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as signing from '@/lib/signing';
import * as backup from '@/lib/backup';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, ex, seedWithDemo, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

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

describe('T-055 gumy bez kg: dawne nominalKg tylko przyjmowane przy imporcie', () => {
  test('świeża instalacja, nowa guma z ekranu Gumy i zapis — bez pola nominalKg', async () => {
    await renderApp(); await flushAll(10);
    expect(store.getState().bands.length).toBeGreaterThan(0); for (const b of store.getState().bands) expect(b).not.toHaveProperty('nominalKg');
    await go('/more/bands'); await flushAll(10); await tap(screen.getByText('+ Guma')); await flushAll(400); await store.flush();
    expect(global.__kv.get('state')).not.toMatch(/nominalKg/); expect(JSON.stringify(backup.buildBackup())).not.toMatch(/nominalKg/);
  });
  test('stara kopia z asystą kg gum (różne postaci) importuje się; pole odpada, gumy (kolor, poziom) i serie bez zmian', async () => {
    await fresh(); const old = seedWithDemo() as any; old.bands[0].nominalKg = 20; old.bands[1].nominalKg = '12,5'; old.bands[2].nominalKg = { v: 1 };
    const pu = old.exercises.find((e: any) => e.name === 'Pull Up');
    old.workouts = [{ id: 'w1', startedAt: Date.now() - 86400e3, finishedAt: Date.now() - 86000e3, templateName: 'T', note: '', exercises: [{ id: 'e1', exerciseId: pu.id, restSec: 90, sets: [{ id: 's1', reps: 8, addKg: -20, bandId: old.bands[0].id, done: true, kind: 'normal' }] }] }];
    const st = backup.parseBackup(JSON.stringify({ format: 'trening-backup', schemaVersion: SCHEMA_VERSION, exportedAt: '2026-10-01T10:00:00Z', state: old }));
    expect(st.bands.map(b => [b.color, b.level])).toEqual(old.bands.map((b: any) => [b.color, b.level])); for (const b of st.bands) expect(b).not.toHaveProperty('nominalKg');
    const s0 = st.workouts[0].exercises[0].sets[0]; expect([s0.bandId, s0.addKg, s0.reps]).toEqual([old.bands[0].id, -20, 8]);
    store.replaceState(st); expect(store.migrate(JSON.parse(JSON.stringify(store.getState())))).toEqual(JSON.parse(JSON.stringify(store.getState()))); /* idempotentnie */
  });
  test('po imporcie starej kopii z kg gum: przycisk gumy w treningu nie wpisuje kg; ręczne ±kg zostaje przy zmianie, zdjęciu i usunięciu gumy', async () => {
    const old = seedWithDemo() as any; old.bands.forEach((b: any) => { b.nominalKg = 20; }); old.exercises.find((e: any) => e.name === 'Pull Up').bandAssistable = true;
    await renderApp({ saved: old }); await flushAll(10);
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); }); await flushAll(10);
    const s0 = () => store.getState().active!.exercises[0].sets[0];
    await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); expect([s0().bandId !== '', s0().addKg]).toEqual([true, '']);
    await act(async () => { s0().addKg = -7.5; store.save(store.getState().active); });
    for (let i = 0; i < 3; i++) { await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); expect(s0().addKg).toBe(-7.5); }
    expect(s0().bandId).toBe(''); /* trzy gumy: cienka → średnia → gruba → brak */
    await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); const id = s0().bandId;
    await go('/more/bands'); await flushAll(10);
    const order = [...store.getState().bands].sort((a, b) => a.level - b.level); const row = order.findIndex(b => b.id === id); expect(row).toBe(0);
    await tap(screen.getAllByLabelText('Usuń gumę')[0]); pressAlert('Usunąć gumę?', 'Usuń'); await flushAll(5);
    expect([s0().bandId, s0().addKg]).toEqual(['', -7.5]);
  });
  test('jeden cykl gum (store.nextBandId) dla treningu i edytora historii: brak → cienka → … → gruba → brak; usunięta guma → od początku', async () => {
    await fresh(); const [A, B, C] = [...store.getState().bands].sort((a, b) => a.level - b.level);
    expect([store.nextBandId(''), store.nextBandId(A.id), store.nextBandId(B.id), store.nextBandId(C.id), store.nextBandId('usunięta')]).toEqual([A.id, B.id, C.id, '', A.id]);
  });
});
