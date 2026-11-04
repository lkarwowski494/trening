/*
 * Status wersji iOS w App Store Connect, TYLKO ODCZYT (decyzja koordynatora 03.11.2026, ZB-022): scripts/asc/status-wersji.mjs i asc-status-wersji.yml.
 * Wzór: tests/asc-metadane.test.ts — skrypt (ESM) działa w procesie potomnym na atrapie API (fetch podstawiony).
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const root = join(__dirname, '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8');
const wf = read('.github/workflows/asc-status-wersji.yml');
const SCRIPT = read('scripts/asc/status-wersji.mjs');

const DRIVER = `
import { run } from ${JSON.stringify(join(root, 'scripts/asc/status-wersji.mjs'))};
import { makeClient } from ${JSON.stringify(join(root, 'scripts/asc/iap-localizations.mjs'))};
import { readOnlyClient } from ${JSON.stringify(join(root, 'scripts/asc/metadane.mjs'))};
const sc = JSON.parse(process.argv[1]);
const calls = []; const out = [];
const resp = (status, body) => ({ ok: status < 400, status, json: async () => body });
const fakeFetch = async (url, init = {}) => {
  const m = init.method || 'GET'; const p = new URL(url).pathname; calls.push(m + ' ' + p);
  if (p === '/v1/apps') return resp(200, { data: sc.noApp ? [] : [{ id: 'APPID-SECRET', attributes: {} }] });
  if (p === '/v1/apps/APPID-SECRET/appStoreVersions') return resp(200, { data: sc.versions.map((v, i) => ({ id: 'VERID-SECRET-' + i, attributes: v })) });
  if (p === '/v1/apps/APPID-SECRET/reviewSubmissions') return sc.subsFail ? resp(403, { errors: [{ code: 'FORBIDDEN', title: 'no' }] }) : resp(200, { data: (sc.subs ?? []).map((v, i) => ({ id: 'SUBID-SECRET-' + i, attributes: v })) });
  return resp(404, { errors: [] });
};
const client = makeClient({ fetchFn: fakeFetch, token: 't', sleep: async () => {} });
const { code } = await run({ client, log: s => out.push(s) });
let probe = null; if (sc.probe) { try { await readOnlyClient(client).call(sc.probe, '/v1/apps', {}); } catch (e) { probe = e.message; } }
console.log(JSON.stringify({ code, calls, out: out.join('\\n'), probe }));
`;
const drive = (sc: object) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', DRIVER, JSON.stringify(sc)], { encoding: 'utf8' })) as { code: number; calls: string[]; out: string; probe: string | null };

const VERS = [
  { versionString: '0.9', platform: 'IOS', appStoreState: 'READY_FOR_SALE', createdDate: '2026-09-01T10:00:00Z' },
  { versionString: '1.0', platform: 'IOS', appStoreState: 'WAITING_FOR_REVIEW', createdDate: '2026-10-30T09:12:00Z' },
];

describe('scripts/asc/status-wersji.mjs: logika na atrapie API', () => {
  test('wypisuje numer wersji, platformę, stan i datę; najnowsza wersja pierwsza', () => {
    const r = drive({ versions: VERS, subs: [{ platform: 'IOS', state: 'WAITING_FOR_REVIEW', submittedDate: '2026-10-31T12:00:00Z' }] });
    expect(r.code).toBe(0);
    expect(r.out).toContain('| 1.0 | IOS | WAITING_FOR_REVIEW | 2026-10-30 |');
    expect(r.out).toContain('| 0.9 | IOS | READY_FOR_SALE | 2026-09-01 |');
    expect(r.out.indexOf('| 1.0 |')).toBeLessThan(r.out.indexOf('| 0.9 |'));
    expect(r.out).toContain('| IOS | WAITING_FOR_REVIEW | 2026-10-31 |');
  });
  test.each(['WAITING_FOR_REVIEW', 'IN_REVIEW', 'READY_FOR_DISTRIBUTION', 'PENDING_DEVELOPER_RELEASE', 'REJECTED'])('stan %s trafia do logu (także z pola appVersionState)', st => {
    const r = drive({ versions: [{ versionString: '1.0', platform: 'IOS', appVersionState: st, createdDate: '2026-10-30T09:12:00Z' }] });
    expect(r.out).toContain(`| 1.0 | IOS | ${st} |`);
  });
  test('tylko żądania GET i nic poza odczytem wersji, aplikacji i zgłoszeń', () => {
    const r = drive({ versions: VERS });
    expect(r.calls.length).toBeGreaterThan(0);
    expect(r.calls.every(c => c.startsWith('GET '))).toBe(true);
  });
  test('klient tylko do odczytu: próba zapisu kończy się błędem, a żądanie nie wychodzi', () => {
    for (const m of ['POST', 'PATCH', 'DELETE', 'PUT']) { const r = drive({ versions: VERS, probe: m }); expect(r.probe).toMatch(/tylko do odczytu/); expect(r.calls.some(c => c.startsWith(m))).toBe(false); }
  });
  test('w logu nie ma identyfikatorów aplikacji, wersji ani zgłoszeń', () => {
    const r = drive({ versions: VERS, subs: [{ platform: 'IOS', state: 'COMPLETE', submittedDate: '2026-10-31T12:00:00Z' }] });
    expect(r.out).not.toMatch(/SECRET|APPID|VERID|SUBID/); expect(r.out).not.toMatch(/@|pl\.lukasz/);
  });
  test('brak aplikacji → kod 1; brak wersji → kod 0 z wierszem „brak wersji”; błąd zgłoszeń nie przerywa', () => {
    expect(drive({ noApp: true, versions: [] }).code).toBe(1);
    const r = drive({ versions: [] }); expect(r.code).toBe(0); expect(r.out).toContain('brak wersji');
    const f = drive({ versions: VERS, subsFail: true }); expect(f.code).toBe(0); expect(f.out).toContain('Zgłoszenia do recenzji: niedostępne'); expect(f.out).toContain('| 1.0 | IOS');
  });
  test('wartości z API są oczyszczane (bez znaków sterujących i znaczników)', () => {
    const r = drive({ versions: [{ versionString: '1.0\n<b>x</b>', platform: 'IOS', appStoreState: 'IN_REVIEW', createdDate: '2026-10-30T09:12:00Z' }] });
    expect(r.out).not.toMatch(/[<>]/);
  });
});

describe('scripts/asc/status-wersji.mjs (statycznie)', () => {
  test('używa wspólnego klienta (makeClient, readOnlyClient), bez drugiej implementacji i bez metod zapisu', () => {
    expect(SCRIPT).toMatch(/import \{ makeClient, makeJwt, BUNDLE_ID \} from '\.\/iap-localizations\.mjs'/);
    expect(SCRIPT).toMatch(/import \{ readOnlyClient \} from '\.\/metadane\.mjs'/);
    expect(SCRIPT).not.toMatch(/\bfetch\(|'(POST|PATCH|PUT|DELETE)'/);
  });
});

describe('workflow asc-status-wersji.yml (statycznie)', () => {
  test('tylko workflow_dispatch, contents: read, bez zapisów do repo ani środowiska release', () => {
    expect(wf).toMatch(/\non:\n  workflow_dispatch:\n/); expect(wf).toMatch(/\npermissions:\n  contents: read\n/);
    expect(wf).not.toMatch(/contents: write|id-token|pull_request|schedule:|^\s+push:|environment:|workflow_run/m);
    expect(wf).toMatch(/runs-on: ubuntu-latest/); expect(wf).not.toMatch(/macos|eas-cli|EXPO_TOKEN/);
  });
  test('te same trzy sekrety co asc-kontrola.yml (bez nowych), klucz maskowany w RUNNER_TEMP i usuwany zawsze', () => {
    expect([...new Set(wf.match(/secrets\.[A-Z_0-9]+/g))].sort()).toEqual([...new Set(read('.github/workflows/asc-kontrola.yml').match(/secrets\.[A-Z_0-9]+/g))].sort());
    expect(wf).toContain('::add-mask::$ASC_KEY_ID'); expect(wf).toContain('umask 077');
    expect(wf).not.toMatch(/echo[^\n]*\$\{?ASC_KEY_P8(?!" \|)/); expect(wf).not.toMatch(/echo "\$ASC_KEY_(ID|P8)|echo "\$ASC_ISSUER_ID/);
    expect(wf).toMatch(/- name: Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey\.p8"/);
    expect(wf).not.toMatch(/run:[^\n]*\$\{\{ inputs/); expect(wf).not.toMatch(/\bDELETE\b|--zapis|--apply/);
  });
  test('uruchamia status-wersji.mjs i zapisuje wynik w podsumowaniu przebiegu', () => {
    expect(wf).toContain('node scripts/asc/status-wersji.mjs'); expect(wf).toContain('$GITHUB_STEP_SUMMARY');
  });
});
