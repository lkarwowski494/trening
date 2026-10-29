/*
 * Wgranie metadanych sklepu do App Store Connect (polecenie właściciela 22.10.2026): skrypt scripts/asc/metadane.mjs i workflow asc-metadane.yml.
 * Wzór: tests/iap-localizations.test.ts — skrypt (ESM) działa w procesie potomnym na atrapie serwera API (fetch podstawiony).
 * Dane: store/app-store-metadata.json, store/app-store-names.json, store/app-store-urls.json.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { namesIn } from './forbidden-names';

const root = join(__dirname, '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8');
const meta = JSON.parse(read('store/app-store-metadata.json')) as { lokalizacje: Record<string, Record<string, string>> };
const names = JSON.parse(read('store/app-store-names.json')) as { names: Record<string, string> };
const wf = read('.github/workflows/asc-metadane.yml');
const SCRIPT = read('scripts/asc/metadane.mjs');
const LANGS = Object.keys(meta.lokalizacje);

/** Jawne mapowanie kodów repo → ASC (zmiana pliku nie przechodzi niezauważona). */
const EXPECTED_MAP: Record<string, string | null> = {
  pl: 'pl', 'en-US': 'en-US', 'en-GB': 'en-GB', 'en-AU': 'en-AU', 'en-CA': 'en-CA', cs: 'cs', sk: 'sk', hu: 'hu', ro: 'ro', hr: 'hr', sl: null, uk: 'uk',
  'es-ES': 'es-ES', 'es-MX': 'es-MX', 'pt-PT': 'pt-PT', 'pt-BR': 'pt-BR', 'de-DE': 'de-DE', 'fr-FR': 'fr-FR', it: 'it', 'nl-NL': 'nl-NL', sv: 'sv', da: 'da',
  no: 'no', fi: 'fi', tr: 'tr', el: 'el', id: 'id', ms: 'ms', vi: 'vi', ru: 'ru', ja: 'ja', ko: 'ko', 'zh-Hant': 'zh-Hant',
};
/** Kody lokalizacji App Store Connect (lista Apple „App Store localizations”, jak w tests/iap-localizations.test.ts, 14.10.2026 + angielskie warianty). */
const ASC_KNOWN = ['ar-SA', 'ca', 'zh-Hans', 'zh-Hant', 'hr', 'cs', 'da', 'nl-NL', 'fi', 'fr-FR', 'fr-CA', 'de-DE', 'el', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'no', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sk', 'sl', 'es-MX', 'es-ES', 'sv', 'th', 'tr', 'uk', 'vi', 'en-US', 'en-GB', 'en-AU', 'en-CA'];

const DRIVER = `
import * as M0 from ${JSON.stringify(join(root, 'scripts/asc/metadane.mjs'))};
import { makeClient } from ${JSON.stringify(join(root, 'scripts/asc/iap-localizations.mjs'))};
const M = { ...M0, makeClient };
import { readFileSync } from 'node:fs';
const sc = JSON.parse(process.argv[1]);
const rd = f => JSON.parse(readFileSync(${JSON.stringify(root + '/')} + f, 'utf8'));
const data = { meta: rd('store/app-store-metadata.json'), names: rd('store/app-store-names.json'), urls: rd('store/app-store-urls.json') };
if (sc.mutate) for (const [path, v] of sc.mutate) { const [, loc, field] = path.split('/'); data.meta.lokalizacje[loc][field] = v; }
const states = sc.versions ?? [];
const store = { info: new Map((sc.infoLocs ?? []).map((l, i) => [l.locale, { id: 'il' + i, attributes: { ...l } }])), ver: new Map((sc.verLocs ?? []).map((l, i) => [l.locale, { id: 'vl' + i, attributes: { ...l } }])) };
const calls = []; let n = 0; let verGets = 0;
const resp = (status, body) => ({ ok: status < 400, status, json: async () => body });
const fakeFetch = async (url, init = {}) => {
  const m = init.method || 'GET'; const p = new URL(url).pathname; calls.push(m + ' ' + p);
  if (m === 'GET') {
    if (p === '/v1/apps') return resp(200, { data: [{ id: '777', attributes: {} }] });
    if (p === '/v1/apps/777/appStoreVersions') return resp(200, { data: states.map((s, i) => ({ id: 'V' + i, attributes: { appStoreState: s } })) });
    if (p === '/v1/apps/777/appInfos') return resp(200, { data: [{ id: 'AI1', attributes: { appStoreState: sc.infoState ?? 'PREPARE_FOR_SUBMISSION' } }] });
    if (p === '/v1/appInfos/AI1/appInfoLocalizations') return resp(200, { data: [...store.info.values()] .map(r => ({ id: r.id, attributes: r.attributes })) });
    if (/^\\/v1\\/appStoreVersions\\/V\\d\\/appStoreVersionLocalizations$/.test(p)) {
      verGets++; const hide = verGets <= (sc.hideVerGets ?? 0) ? new Set(sc.hideVer ?? []) : new Set();
      return resp(200, { data: [...store.ver.values()].filter(r => !hide.has(r.attributes.locale)).map(r => ({ id: r.id, attributes: r.attributes })) });
    }
    return resp(404, { errors: [] });
  }
  const body = JSON.parse(init.body);
  if (sc.failOn && calls.filter(c => c.startsWith(m)).length === sc.failOn) return resp(409, { errors: [{ code: 'ENTITY_ERROR', title: 'bad', detail: 'SECRET-DETAIL' }] });
  const target = body.data.type === 'appInfoLocalizations' ? store.info : store.ver;
  if (m === 'POST' && sc.autoVer && body.data.type === 'appStoreVersionLocalizations' && store.ver.has(body.data.attributes.locale)) return resp(409, { errors: [{ code: 'ENTITY_ERROR.ATTRIBUTE.INVALID.DUPLICATE', title: 'duplicate', detail: 'SECRET-DETAIL' }] });
  if (m === 'POST' && sc.autoVer && body.data.type === 'appInfoLocalizations' && !store.ver.has(body.data.attributes.locale)) store.ver.set(body.data.attributes.locale, { id: 'auto' + (++n), attributes: { locale: body.data.attributes.locale } });
  if (m === 'POST') { target.set(body.data.attributes.locale, { id: 'new' + (++n), attributes: { ...body.data.attributes } }); return resp(201, { data: { id: 'new' + n } }); }
  if (m === 'PATCH') { for (const r of target.values()) if (r.id === body.data.id) Object.assign(r.attributes, body.data.attributes); return resp(200, { data: {} }); }
  return resp(405, {});
};
const out = {}; const logs = [];
if (sc.mode === 'unit') {
  out.map = M.LOCALE_MAP; out.limity = M.LIMITY;
  const wanted = M.buildWanted(data);
  out.errs = M.validate({ wanted, findBrands: M.makeBrandFinder(rd('tests/forbidden-names.json')) });
  out.errsBad = M.validate({ wanted: { pl: { info: { name: 'x'.repeat(31), subtitle: 'ok', privacyPolicyUrl: 'http://x' }, version: { description: 'd'.repeat(4001), keywords: 'ą'.repeat(51), promotionalText: 'p'.repeat(171), supportUrl: 'https://a.b', marketingUrl: 'https://a.b' } }, xx: wanted.pl } });
  out.brand = M.makeBrandFinder({ names: ['Marka'], namesAnyCase: ['innamarka'] })('Aplikacja INNAMARKA i Marka');
  let t = false; try { await M.makeClient({ fetchFn: fakeFetch, token: 't' }).call('DELETE', '/v1/appInfoLocalizations/x'); } catch (e) { t = true; } out.deleteThrows = t;
} else {
  const base = M.makeClient({ fetchFn: fakeFetch, token: 't' });
  const log = l => logs.push(l);
  const findBrands = M.makeBrandFinder(rd('tests/forbidden-names.json'));
  const r1 = await M.run({ client: base, data, zapis: sc.zapis, log, findBrands }); out.code1 = r1.code; out.calls1 = [...calls]; out.logs1 = logs.join('\\n');
  if (sc.twice) { calls.length = 0; logs.length = 0; const r2 = await M.run({ client: base, data, zapis: true, log, findBrands }); out.code2 = r2.code; out.calls2 = [...calls]; out.logs2 = logs.join('\\n'); }
  out.store = { info: Object.fromEntries([...store.info].map(([k, v]) => [k, v.attributes])), ver: Object.fromEntries([...store.ver].map(([k, v]) => [k, v.attributes])) };
}
process.stdout.write(JSON.stringify(out));
`;
type Sc = { mode?: string; zapis?: boolean; twice?: boolean; versions?: string[]; infoState?: string; infoLocs?: Record<string, string>[]; verLocs?: Record<string, string>[]; failOn?: number; autoVer?: boolean; hideVer?: string[]; hideVerGets?: number; mutate?: [string, string][] };
const drive = (sc: Sc) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', DRIVER, JSON.stringify(sc)], { encoding: 'utf8', maxBuffer: 50e6 })) as Record<string, any>;
const mapped = LANGS.filter(l => EXPECTED_MAP[l]);
const writes = (calls: string[]) => calls.filter(c => !c.startsWith('GET'));

describe('dane i mapowanie lokalizacji (repo → App Store Connect)', () => {
  test('33 lokalizacje w repo; mapowanie jawne; kody ASC z listy Apple, bez powtórzeń; sl pomijany (L-003)', () => {
    const u = drive({ mode: 'unit' });
    expect(LANGS).toHaveLength(33);
    expect(Object.keys(names.names).sort()).toEqual([...LANGS].sort());
    expect(u.map).toEqual(EXPECTED_MAP);
    expect(Object.keys(u.map).sort()).toEqual([...LANGS].sort());
    const codes = Object.values(u.map).filter(Boolean) as string[];
    expect(new Set(codes).size).toBe(codes.length); expect(codes).toHaveLength(32);
    for (const c of codes) expect(ASC_KNOWN).toContain(c);
    expect(u.map.sl).toBeNull();
  });
  test('rozbieżności nazewnicze: nb z aplikacji to no w ASC, es-419 to es-MX, zh-Hant bez zmian', () => {
    expect(LANGS).toEqual(expect.arrayContaining(['no', 'es-MX', 'zh-Hant']));
    expect(LANGS).not.toEqual(expect.arrayContaining(['nb', 'es-419']));
  });
});

describe('walidacja (limity Apple, odczyt dokumentacji 22.10.2026)', () => {
  test('limity: nazwa 30, podtytuł 30, słowa kluczowe 100 B, opis 4000, tekst promocyjny 170, nowości 4000', () => {
    expect(drive({ mode: 'unit' }).limity).toEqual({ name: 30, subtitle: 30, keywords: 100, description: 4000, promotionalText: 170, whatsNew: 4000 });
  });
  test('dane z repo przechodzą walidację we wszystkich 33 lokalizacjach (limity, https, marki)', () => {
    expect(drive({ mode: 'unit' }).errs).toEqual([]);
  });
  test('przekroczenia limitów, adres bez https i nieznany kod są wykrywane (słowa kluczowe liczone w bajtach)', () => {
    const e = drive({ mode: 'unit' }).errsBad as { lang: string; field: string; problem: string }[];
    expect(e.map(x => `${x.lang}/${x.field}`).sort()).toEqual(['pl/description', 'pl/keywords', 'pl/name', 'pl/privacyPolicyUrl', 'pl/promotionalText', 'xx/*']);
    expect(e.find(x => x.field === 'keywords')!.problem).toBe('102 B > 100 B');
  });
  test('wykrywanie nazw innych marek (z końcówką fleksyjną, bez rozróżniania wielkości dla listy namesAnyCase)', () => {
    expect(drive({ mode: 'unit' }).brand).toEqual(['Marka', 'innamarka']);
    expect(namesIn(read('store/app-store-metadata.json') + read('store/app-store-names.json') + read('store/app-store-urls.json'))).toEqual([]);
  });
  test('podtytuł ponad limit w danych blokuje zapis — kod 1, zero zapisów', () => {
    const r = drive({ zapis: true, versions: ['PREPARE_FOR_SUBMISSION'], mutate: [['meta/pl/subtitle', 'x'.repeat(31)]] });
    expect(r.code1).toBe(1); expect(writes(r.calls1)).toEqual([]); expect(r.logs1).toContain('pl / subtitle: 31 znaków > 30');
  });
});

describe('plan i zapis na atrapie API', () => {
  const infoOk = (l: string) => ({ locale: l, name: names.names[l], subtitle: meta.lokalizacje[l].subtitle, privacyPolicyUrl: 'https://apps4brew.com/trening/privacy.html' });
  test('podgląd bez wersji w ASC: czytelny komunikat z krokiem dla właściciela, tylko GET, kod 0', () => {
    const r = drive({ versions: ['READY_FOR_SALE'], infoLocs: [infoOk('pl')] });
    expect(r.code1).toBe(0); expect(writes(r.calls1)).toEqual([]);
    expect(r.logs1).toContain('Brak edytowalnej wersji'); expect(r.logs1).toContain('utwórz wersję 1.0');
    expect(r.logs1).toContain('pominięto'); /* wersja pominięta; informacje o aplikacji porównane */
  });
  test('zapis bez edytowalnej wersji: kod 1, komunikat, zero zapisów (także informacji o aplikacji)', () => {
    const r = drive({ zapis: true, versions: [] });
    expect(r.code1).toBe(1); expect(writes(r.calls1)).toEqual([]); expect(r.logs1).toContain('utwórz wersję 1.0'); expect(r.logs1).toContain('nic nie zapisano');
  });
  test('podgląd z wersją: tylko GET; tabela lokalizacja × pole ze stanami nowa / zmiana / bez zmian; sl pominięty', () => {
    const r = drive({ versions: ['PREPARE_FOR_SUBMISSION'], infoLocs: [infoOk('pl'), { ...infoOk('cs'), name: 'Stara nazwa' }],
      verLocs: [{ locale: 'pl', description: meta.lokalizacje.pl.description, keywords: 'stare', promotionalText: meta.lokalizacje.pl.promotionalText, supportUrl: 'https://apps4brew.com/trening/support.html', marketingUrl: 'https://apps4brew.com/' }] });
    expect(r.code1).toBe(0); expect(writes(r.calls1)).toEqual([]);
    const L = r.logs1 as string;
    expect(L).toContain('| Lokalizacja | ASC | Działanie | name | subtitle | privacyPolicyUrl |');
    expect(L).toContain('| pl | pl | bez zmian | bez zmian | bez zmian | bez zmian |');
    expect(L).toContain('| cs | cs | zaktualizuj | zmiana | bez zmian | bez zmian |');
    expect(L).toMatch(/\| pl \| pl \| zaktualizuj \| bez zmian \| zmiana \| bez zmian \| bez zmian \| bez zmian \|/); /* tylko słowa kluczowe */
    expect(L).toMatch(/\| de-DE \| de-DE \| utwórz \| nowa \| nowa \| nowa \| nowa \| nowa \|/);
    expect(L).toMatch(/\| sl \| — \| pomiń \|/);
    expect(L).toContain('Podgląd zakończony — nic nie zapisano');
  });
  test('zapis: tworzy brakujące (POST) i aktualizuje różniące się (PATCH, tylko zmienione pola), nigdy DELETE; drugi przebieg bez zapisów', () => {
    const r = drive({ zapis: true, twice: true, versions: ['PREPARE_FOR_SUBMISSION'], infoLocs: [infoOk('pl'), { ...infoOk('cs'), name: 'Stara nazwa' }],
      verLocs: [{ locale: 'pl', description: 'stary opis', keywords: meta.lokalizacje.pl.keywords, promotionalText: meta.lokalizacje.pl.promotionalText, supportUrl: 'https://apps4brew.com/trening/support.html', marketingUrl: 'https://apps4brew.com/' }] });
    expect(r.code1).toBe(0); expect(r.code2).toBe(0);
    const w = writes(r.calls1) as string[];
    expect(w.filter(c => c.startsWith('POST /v1/appInfoLocalizations'))).toHaveLength(mapped.length - 2); /* poza pl i cs */
    expect(w.filter(c => c.startsWith('POST /v1/appStoreVersionLocalizations'))).toHaveLength(mapped.length - 1); /* poza pl */
    expect(w.filter(c => c.startsWith('PATCH')).sort()).toEqual(['PATCH /v1/appInfoLocalizations/il1', 'PATCH /v1/appStoreVersionLocalizations/vl0']);
    expect(w.some(c => c.startsWith('DELETE'))).toBe(false);
    expect(r.store.ver.pl.description).toBe(meta.lokalizacje.pl.description);
    expect(r.store.info.cs.name).toBe(names.names.cs);
    expect(r.store.info['de-DE']).toMatchObject({ name: names.names['de-DE'], subtitle: meta.lokalizacje['de-DE'].subtitle });
    expect(r.store.ver['no']).toMatchObject({ keywords: meta.lokalizacje.no.keywords, promotionalText: meta.lokalizacje.no.promotionalText });
    expect(r.store.info.sl).toBeUndefined(); expect(r.store.ver.sl).toBeUndefined();
    expect(writes(r.calls2)).toEqual([]); /* idempotentne */
  });
  test('101-31: ASC samo tworzy lokalizację wersji przy nowej lokalizacji aplikacji — lista odświeżona, PATCH zamiast drugiego POST (bez 409)', () => {
    const r = drive({ zapis: true, autoVer: true, versions: ['PREPARE_FOR_SUBMISSION'] });
    expect(r.code1).toBe(0); expect(r.logs1).not.toContain('BŁĄD');
    const w = writes(r.calls1) as string[];
    expect(w.filter(c => c.startsWith('POST /v1/appStoreVersionLocalizations'))).toEqual([]);
    expect(w.filter(c => c.startsWith('PATCH /v1/appStoreVersionLocalizations'))).toHaveLength(mapped.length);
    expect(r.store.ver['de-DE']).toMatchObject({ description: meta.lokalizacje['de-DE'].description, keywords: meta.lokalizacje['de-DE'].keywords });
    expect(r.store.ver.sl).toBeUndefined();
  });
  test('101-31: 409 DUPLICATE przy tworzeniu lokalizacji wersji (lista nieświeża) — pobranie istniejącej i PATCH; inny 409 nadal jest błędem', () => {
    const r = drive({ zapis: true, autoVer: true, hideVer: ['de-DE'], hideVerGets: 2, versions: ['PREPARE_FOR_SUBMISSION'] });
    expect(r.code1).toBe(0); expect(r.logs1).not.toContain('BŁĄD');
    expect((writes(r.calls1) as string[]).filter(c => c.startsWith('POST /v1/appStoreVersionLocalizations'))).toHaveLength(1);
    expect(r.store.ver['de-DE']).toMatchObject({ description: meta.lokalizacje['de-DE'].description });
    const f = drive({ zapis: true, versions: ['PREPARE_FOR_SUBMISSION'], failOn: 2 });
    expect(f.code1).toBe(1); expect(f.logs1).toContain('BŁĄD');
  });
  test('101-31: podgląd nie wysyła zapisów także w scenariuszu z autoVer', () => {
    const r = drive({ zapis: false, autoVer: true, versions: ['PREPARE_FOR_SUBMISSION'] });
    expect(r.code1).toBe(0); expect(writes(r.calls1)).toEqual([]);
  });
  test('zapis nie usuwa lokalizacji spoza repozytorium i nie zmienia ich', () => {
    const r = drive({ zapis: true, versions: ['PREPARE_FOR_SUBMISSION'], infoLocs: [{ locale: 'ar-SA', name: 'x', subtitle: 'y' }], verLocs: [{ locale: 'ar-SA', description: 'x' }] });
    expect(r.store.info['ar-SA']).toEqual({ locale: 'ar-SA', name: 'x', subtitle: 'y' }); expect(r.store.ver['ar-SA']).toEqual({ locale: 'ar-SA', description: 'x' });
    expect(r.logs1).toContain('Lokalizacje w ASC spoza repozytorium (nietykane): ar-SA');
    expect((r.calls1 as string[]).some(c => c.includes('ar-SA') || c.startsWith('DELETE'))).toBe(false);
  });
  test('wersja w stanie edytowalnym po odrzuceniu (DEVELOPER_REJECTED) też jest celem zapisu; wersja w recenzji nie', () => {
    expect(writes(drive({ zapis: true, versions: ['DEVELOPER_REJECTED'] }).calls1).length).toBeGreaterThan(0);
    const r = drive({ zapis: true, versions: ['WAITING_FOR_REVIEW', 'READY_FOR_SALE'] });
    expect(r.code1).toBe(1); expect(writes(r.calls1)).toEqual([]);
  });
  test('błąd jednego zapisu: kod 1, pozostałe lokalizacje zapisane, w logu tylko status i kod (bez treści odpowiedzi)', () => {
    const r = drive({ zapis: true, versions: ['PREPARE_FOR_SUBMISSION'], failOn: 2 });
    expect(r.code1).toBe(1); expect(r.logs1).toContain('BŁĄD'); expect(r.logs1).toContain('409'); expect(r.logs1).toMatch(/\| błąd/);
    expect(r.logs1).not.toContain('SECRET-DETAIL');
    expect(writes(r.calls1).length).toBeGreaterThan(10);
  });
  test('klient nigdy nie usuwa: DELETE odrzucany, podgląd odrzuca też POST i PATCH', () => {
    expect(drive({ mode: 'unit' }).deleteThrows).toBe(true);
    expect(SCRIPT).toMatch(/Podgląd jest tylko do odczytu/); expect(SCRIPT).not.toMatch(/'DELETE'|"DELETE"/);
  });
  test('wynik nie zawiera identyfikatorów klucza ani tokenu (log: kody lokalizacji, pola, liczby)', () => {
    const r = drive({ zapis: true, versions: ['PREPARE_FOR_SUBMISSION'] });
    expect(r.logs1).not.toMatch(/Bearer|ASC_KEY|ISSUER|BEGIN PRIVATE|eyJ/);
    expect(SCRIPT).not.toMatch(/console\.(log|error)\([^)]*(keyId|issuerId|token|keyPem)/);
  });
});

describe('workflow asc-metadane.yml (statycznie)', () => {
  test('tylko ręcznie, wejście tryb: podglad (domyślnie) albo zapis; odczyt treści repozytorium; bez zapisów do repo', () => {
    expect(wf).toMatch(/\non:\n  workflow_dispatch:\n    inputs:\n      tryb:\n/); expect(wf).toMatch(/options: \[podglad, zapis\]\n\s+default: podglad\n/);
    expect(wf).toMatch(/\npermissions:\n  contents: read\n/); expect(wf).not.toMatch(/contents: write|id-token|pull_request|schedule:|^\s+push:/m);
    expect(wf).toMatch(/runs-on: ubuntu-latest/); expect(wf).not.toMatch(/macos|eas-cli|EXPO_TOKEN/);
  });
  test('zapis tylko w jobie ze środowiskiem release (po podglądzie, tylko dla trybu zapis); podgląd bez środowiska', () => {
    const [head, zapisJob] = wf.split(/\n  zapis:\n/);
    expect(zapisJob).toMatch(/needs: podglad/); expect(zapisJob).toMatch(/if: \$\{\{ inputs\.tryb == 'zapis' \}\}/); expect(zapisJob).toMatch(/environment: release/);
    expect(zapisJob).toContain('metadane.mjs --zapis'); expect(head).not.toContain('--zapis'); expect(head).not.toMatch(/environment:/);
    expect(head).toContain('metadane.mjs --podglad');
  });
  test('te same sekrety co testflight.yml i zakupy (bez nowych), klucz maskowany w RUNNER_TEMP i usuwany zawsze, wejście tylko przez środowisko', () => {
    for (const k of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8']) expect(wf).toContain(`secrets.${k}`);
    expect([...new Set(wf.match(/secrets\.[A-Z_0-9]+/g))].sort()).toEqual(['secrets.ASC_ISSUER_ID', 'secrets.ASC_KEY_ID', 'secrets.ASC_KEY_P8']);
    expect(wf.match(/::add-mask::\$ASC_KEY_ID/g)).toHaveLength(2); expect(wf.match(/umask 077/g)).toHaveLength(2);
    expect(wf).not.toMatch(/echo[^\n]*\$\{?ASC_KEY_P8(?!" \|)/); expect(wf).not.toMatch(/echo "\$ASC_KEY_(ID|P8)|echo "\$ASC_ISSUER_ID/);
    expect(wf.match(/- name: Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey\.p8"/g)).toHaveLength(2);
    expect(wf).not.toMatch(/run:[^\n]*\$\{\{ inputs/); expect(wf).not.toMatch(/\bDELETE\b/);
    expect(wf).toContain('$GITHUB_STEP_SUMMARY');
  });
});
