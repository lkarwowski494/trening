/* Uprawnienia Apple włączane przez scripts/eas/asc-capabilities.cjs (obejście expo/eas-cli#3986, 02.10.2026). */
import crypto from 'crypto';
import { execFileSync } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cap = require('../scripts/eas/asc-capabilities.cjs');

jest.setTimeout(60000);

test('JWT dla App Store Connect: ES256 w formacie JOSE (r‖s, 64 B), weryfikowalny kluczem publicznym, ważny 15 min', () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  const tok: string = cap.jwt({ keyPem: pem, keyId: 'KID', issuer: 'ISS', now: 1000 });
  const [h, b, s] = tok.split('.');
  expect(JSON.parse(Buffer.from(h, 'base64url').toString())).toEqual({ alg: 'ES256', kid: 'KID', typ: 'JWT' });
  expect(JSON.parse(Buffer.from(b, 'base64url').toString())).toEqual({ iss: 'ISS', iat: 1000, exp: 1900, aud: 'appstoreconnect-v1' });
  const sig = Buffer.from(s, 'base64url'); expect(sig).toHaveLength(64);
  expect(crypto.verify('sha256', Buffer.from(`${h}.${b}`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, sig)).toBe(true);
});

test('mapowanie uprawnień: HealthKit → HEALTHKIT, części HealthKit bez osobnej pozycji, nieznane = błąd', () => {
  expect(cap.capabilitiesFor({ 'com.apple.developer.healthkit': true, 'com.apple.developer.healthkit.access': [] })).toEqual(['HEALTHKIT']);
  expect(cap.capabilitiesFor(undefined)).toEqual([]);
  expect(() => cap.capabilitiesFor({ 'com.apple.developer.nfc.readersession.formats': ['TAG'] })).toThrow(/Nieznane uprawnienie/);
});

test('dzisiejsza konfiguracja aplikacji: aplikacja HealthKit + grupa aplikacji, widżet tylko grupa aplikacji (07.10.2026: widżet „Tydzień treningów”; push usunięty pluginem)', () => {
  const cfg = JSON.parse(execFileSync('npx', ['expo', 'config', '--type', 'introspect', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  expect(cap.wantedFromConfig(cfg)).toEqual({ 'pl.lukasz.trening': ['APP_GROUPS', 'HEALTHKIT'], 'pl.lukasz.trening.restwidget': ['APP_GROUPS'] });
});

/* Q-023 (runda 83): scripts/eas/configure-credentials.exp — wybór urządzeń w `eas credentials:configure-build` (eas-cli 24.8.0:
 * DeviceUtils.chooseDevicesAsync = multiselect z pakietu prompts 2.4.2, min 1, pytanie osobno dla aplikacji i widżetu). Dawne „a” na każde
 * pojawienie się pytania odznaczało domyślnie zaznaczone urządzenia (błąd „minimum 1”, wybór dopiero za drugim razem) i wysyłało klawisze
 * także po przerysowaniu. Test czyta reguły ze skryptu i odgrywa je (jak expect: wzorce po kolei, dopasowanie zjada bufor) na prawdziwym
 * promptcie z node_modules — tej samej wersji co w eas-cli 24.8.0 (sprawdzane niżej). */
describe('Q-023 configure-credentials.exp: wybór urządzeń', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('fs') as typeof import('fs'); const { PassThrough } = require('stream') as typeof import('stream');
  const src = fs.readFileSync(require('path').join(__dirname, '../scripts/eas/configure-credentials.exp'), 'utf8');
  /** Reguły `-re {wzorzec} { … send "x" … }` w kolejności ze skryptu; exit = koniec z kodem. */
  const rules = [...src.matchAll(/^\s*-re \{(.+?)\} \{(.*)\}\s*$/gm)].map(m => ({ re: new RegExp(m[1]), keys: [...m[2].matchAll(/send "((?:[^"\\]|\\.)*)"/g)].map(k => k[1].replace(/\\r/g, '\r')), exit: /\bexit\b/.test(m[2]) }));
  function prompt(selected: boolean[], stdin: NodeJS.ReadableStream, stdout: NodeJS.WritableStream) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MultiselectPrompt } = require('prompts/lib/elements');
    return new Promise<number[]>(res => { const p = new MultiselectPrompt({ message: 'Select devices for the ad hoc build:', selectionFormat: '<num> devices selected', hint: '- Space to select. Return to submit', instructions: false, min: 1, stdin, stdout, choices: selected.map((s, i) => ({ title: `0000811${i}-000A (iPhone) (Telefon ${i})`, value: i, selected: s })) }); p.on('submit', (v: { selected: boolean }[]) => res(v.map((x, i) => x.selected ? i : -1).filter(i => i >= 0))); });
  }
  /** Kolejne pytania o urządzenia (aplikacja, widżet) z domyślnym zaznaczeniem; zwraca wybory i wysłane klawisze. */
  async function play(targets: boolean[][]) {
    const stdin = new PassThrough(), stdout = new PassThrough(); (stdout as unknown as { columns: number }).columns = 120; const keys: string[] = []; let buf = '';
    stdout.on('data', d => { buf += d.toString(); for (let again = true; again;) { again = false; for (const r of rules) { const m = r.re.exec(buf); if (m) { buf = buf.slice(m.index + m[0].length); if (r.exit) throw new Error('exit: ' + r.re); for (const k of r.keys) { keys.push(k); setTimeout(() => stdin.write(k), 2); } again = true; break; } } } });
    const out: (number[] | 'brak odpowiedzi')[] = [];
    for (const t of targets) { out.push(await Promise.race([prompt(t, stdin, stdout), new Promise<'brak odpowiedzi'>(r => setTimeout(() => r('brak odpowiedzi'), 500))])); stdout.write('\n✔ Created provisioning profile\n'); }
    await new Promise(r => setTimeout(r, 30)); return { out, keys: keys.join('').replace(/\r/g, '⏎') };
  }
  test('prompts w node_modules to ta sama wersja co w eas-cli 24.8.0 (2.4.2)', () => {
    expect(require('prompts/package.json').version).toBe('2.4.2');
  });
  test('domyślnie zaznaczone (bez profilu — wszystkie): sam Enter, bez „a”; dwa pytania (aplikacja, widżet) — po jednym Enterze', async () => {
    expect(await play([[true, true], [true, true]])).toEqual({ out: [[0, 1], [0, 1]], keys: '⏎⏎' });
    expect(await play([[true]])).toEqual({ out: [[0]], keys: '⏎' });
  });
  test('nic nie zaznaczone: Enter → błąd „minimum 1” → „a” (wszystkie) → Enter', async () => {
    expect(await play([[false, false]])).toEqual({ out: [[0, 1]], keys: '⏎a⏎' });
  });
  test('istniejący profil (zaznaczone urządzenia z profilu): Enter je zostawia — bez odznaczania i bez klawiszy do kolejnych pytań', async () => {
    expect(await play([[true, false], [false, true]])).toEqual({ out: [[0], [1]], keys: '⏎⏎' });
  });
});
