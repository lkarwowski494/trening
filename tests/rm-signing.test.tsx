/* Decyzja właściciela 09.10.2026 ok. 17:10 (docs/18): aplikację instalujemy tylko przez TestFlight. Usunięte: przypomnienie o odnowieniu
 * podpisu (T-053, dawne lib/signing.ts — baner na ekranie głównym, dopisek w „Więcej”, powiadomienie dzień przed wygaśnięciem) i cała droga
 * instalacji z komputera (artefakt .ipa w ios-unsigned.yml, opis w README). Powód: tekst przypomnienia wymieniał narzędzie innej firmy —
 * ryzyko odrzucenia przez Apple (wytyczne 2.3.7, 5.2.1) i naruszenie zasady z 09.10 (CLAUDE.md „Treści cudze i nazwy innych firm”).
 * Regresja: żaden tekst aplikacji ani słownik nie wraca do instalacji z komputera ani do odnowienia podpisu; ekran główny i „Więcej” nie
 * pokazują nic o podpisie także wtedy, gdy w paczce aplikacji jest profil z bliską datą wygaśnięcia; stare zaplanowane przypomnienie
 * (z buildu instalowanego z komputera) jest odwoływane przy starcie. */
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { LEGACY_REMINDER_IDS, cancelLegacyReminders } from '@/lib/planReminder';
import { EN } from '@/lib/i18n.en';
import { renderApp, flushAll, screen, go } from './app';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const ROOT = join(__dirname, '..');
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const walk = (dir: string): string[] => readdirSync(join(ROOT, dir)).flatMap(n => { const p = `${dir}/${n}`; return statSync(join(ROOT, p)).isDirectory() ? walk(p) : [p]; });

/** Teksty o odnowieniu podpisu i instalacji z komputera — w kluczach (PL) i w każdym tłumaczeniu. */
const PL_BAD = [/podpis(u)? aplikacji/i, /Podpis ważny/, /odnów w /, /zbuduj (ją|aplikację) od nowa/, /\(EAS\)/, /zainstaluj z linku/];
/** Nazwy narzędzi do instalacji z komputera pilnuje tests/forbidden-names.test.ts (lista w tests/forbidden-names.json, bez wyjątków dla przypomnienia). */
const ANY_BAD = [/\bEAS\b/, /GitHub/, /\.ipa\b/i, /mobileprovision/i];
const EN_BAD = [/app signature/i, /signature (valid|expire)/i, /rebuild the app/i, /renew (it )?in/i];

describe('instalacja tylko przez TestFlight — bez przypomnienia o podpisie (decyzja 09.10.2026)', () => {
  test('lib/signing.ts usunięty; kod aplikacji nie czyta profilu z paczki i nie importuje dawnego modułu', () => {
    expect(existsSync(join(ROOT, 'lib/signing.ts'))).toBe(false);
    const src = ['app', 'components', 'lib'].flatMap(walk).filter(p => /\.(ts|tsx)$/.test(p));
    expect(src.length).toBeGreaterThan(50);
    const hits = src.filter(p => /embedded\.mobileprovision|@\/lib\/signing|from '\.\/signing'|SigningBanner|renewTexts|scheduleReminder\b/.test(read(p)));
    expect(hits).toEqual([]);
  });

  test('słownik EN (klucze PL i wartości) bez tekstów o podpisie i instalacji z komputera', () => {
    const dict = EN;
    expect(Object.keys(dict).length).toBeGreaterThan(500);
    const bad = Object.entries(dict).filter(([k, v]) => PL_BAD.some(r => r.test(k)) || ANY_BAD.some(r => r.test(k) || r.test(v)) || EN_BAD.some(r => r.test(v)));
    expect(bad).toEqual([]);
  });

  test('25 słowników (lib/locales/*.json) i _source.json bez tych tekstów', () => {
    const files = readdirSync(join(ROOT, 'lib/locales')).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThanOrEqual(25);
    for (const f of files) {
      const raw = read(`lib/locales/${f}`); const d = JSON.parse(raw);
      const entries: [string, string][] = Array.isArray(d) ? d.flatMap((x: Record<string, string>) => [[x.pl ?? '', x.en ?? '']] as [string, string][]) : Object.entries(d) as [string, string][];
      const bad = entries.filter(([k, v]) => PL_BAD.some(r => r.test(k)) || ANY_BAD.some(r => r.test(k) || r.test(String(v))));
      expect([f, bad]).toEqual([f, []]);
    }
  });

  test('ios-unsigned.yml to tylko sprawdzenie kompilacji: bez paczki .ipa do instalacji, bez podpisu ad hoc i bez nazw narzędzi', () => {
    const y = read('.github/workflows/ios-unsigned.yml');
    expect(y).toMatch(/xcodebuild -workspace/); expect(y).toMatch(/CODE_SIGNING_ALLOWED=NO/);
    expect(y).not.toMatch(/\.ipa|Payload|codesign|Apple ID|unsigned-ipa/i);
    for (const n of ['testflight.yml', 'e2e-ios.yml']) expect(read(`.github/workflows/${n}`)).not.toMatch(/unsigned-ipa|darmow\w+ Apple ID|podpisuje go Twoim/i);
    expect(read('README.md')).not.toMatch(/unsigned-ipa|darmow\w+ Apple ID|Zapas bez płatnego konta/);
  });

  test('ekran główny i „Więcej” nic nie mówią o podpisie, nawet z profilem w paczce wygasającym za 2 dni; brak takiego powiadomienia', async () => {
    const FS = require('expo-file-system/legacy'); const DAY = 86400e3; const iso = (t: number) => new Date(t).toISOString().replace(/\.\d+Z$/, 'Z');
    const b64 = Buffer.from(`<?xml version="1.0"?><plist version="1.0"><dict><key>CreationDate</key><date>${iso(Date.now() - 5 * DAY)}</date><key>ExpirationDate</key><date>${iso(Date.now() + 2 * DAY)}</date></dict></plist>`, 'latin1').toString('base64');
    (global as { __bundleDir?: string | null }).__bundleDir = '/var/Trening.app/';
    FS.getInfoAsync.mockImplementation(async (uri: string) => ({ exists: uri.endsWith('embedded.mobileprovision') }));
    FS.readAsStringAsync.mockImplementation(async (uri: string) => (uri.endsWith('embedded.mobileprovision') ? b64 : ''));
    try {
      await renderApp(); await flushAll(50);
      expect(screen.queryByText(/[Pp]odpis aplikacji|GitHub/)).toBeNull();
      expect((global.__notifications as { content: { title: string; body: string } }[]).filter(n => /podpis|GitHub/i.test(n.content.title + n.content.body))).toEqual([]);
      await go('/more'); await flushAll(50);
      expect(screen.queryByText(/Podpis ważny/)).toBeNull();
    } finally {
      (global as { __bundleDir?: string | null }).__bundleDir = null;
      FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); FS.readAsStringAsync.mockImplementation(async () => '');
    }
  });

  test('cancelLegacyReminders: odwołuje stare przypomnienie o podpisie (build z komputera → TestFlight zachowuje zaplanowane powiadomienia); powtórne wywołanie bez skutków ubocznych', async () => {
    expect(LEGACY_REMINDER_IDS).toEqual(['signing-reminder']);
    global.__cancelled.length = 0;
    await cancelLegacyReminders(); await cancelLegacyReminders();
    expect(global.__cancelled).toEqual(['signing-reminder', 'signing-reminder']);
    const keep = global.__cancelled; (global as { __cancelled: unknown }).__cancelled = { push: () => { throw new Error('iOS odmówił'); } }; /* błąd iOS nie przerywa startu */
    try { await expect(cancelLegacyReminders()).resolves.toBeUndefined(); } finally { (global as { __cancelled: unknown }).__cancelled = keep; }
  });

  test('start aplikacji odwołuje stare przypomnienie o podpisie', async () => {
    global.__cancelled.length = 0;
    await renderApp(); await flushAll(50);
    expect(global.__cancelled).toContain('signing-reminder');
  });
});
