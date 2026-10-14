/*
 * Lokalizacje produktów zakupu w App Store Connect (decyzja właściciela 14.10.2026, wariant A): dane store/iap-localizations.json i skrypt
 * scripts/asc/iap-localizations.mjs. Skrypt działa na atrapie serwera API (fetch podstawiony w procesie potomnym — moduł jest ESM z import.meta).
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { LANGS } from '../lib/i18n';
import { LOCALES } from '../lib/locales';
import { namesIn } from './forbidden-names';

const root = join(__dirname, '..');
type Txt = { name: string; description?: string };
type Entry = { ascLocale: string | null; group: Txt; monthly: Txt; yearly: Txt; lifetime: Txt };
const data = JSON.parse(readFileSync(join(root, 'store/iap-localizations.json'), 'utf8')) as {
  limity: { nazwa: number; opis: number }; wpisaneRecznie: Record<string, Omit<Entry, 'ascLocale'>>; tlumaczenia: Record<string, Entry>;
};
const KEYS = ['group', 'monthly', 'yearly', 'lifetime'] as const;
const len = (s: string) => [...s].length;
const LANGS33 = LANGS.filter(l => l !== 'pl' && l !== 'en');

/** Mapowanie kodów języków aplikacji na kody lokalizacji App Store Connect (jawnie, żeby zmiana pliku nie przechodziła niezauważona). */
const MAPPING: Record<string, string | null> = {
  cs: 'cs', sk: 'sk', hu: 'hu', ro: 'ro', bg: null, hr: 'hr', sl: null, sr: null, lt: null, lv: null, et: null, uk: 'uk',
  es: 'es-ES', 'es-419': 'es-MX', pt: 'pt-PT', 'pt-BR': 'pt-BR', de: 'de-DE', fr: 'fr-FR', it: 'it', nl: 'nl-NL', sv: 'sv', da: 'da', nb: 'no',
  fi: 'fi', tr: 'tr', el: 'el', id: 'id', ms: 'ms', vi: 'vi', ru: 'ru', ja: 'ja', ko: 'ko', 'zh-Hant': 'zh-Hant',
};

describe('store/iap-localizations.json: dane', () => {
  test('komplet: dokładnie 33 języki aplikacji poza PL i EN, każdy z grupą i trzema produktami', () => {
    expect(LANGS33).toHaveLength(33);
    expect(Object.keys(data.tlumaczenia).sort()).toEqual([...LANGS33].sort());
    for (const l of LANGS33) for (const k of KEYS) {
      const t = data.tlumaczenia[l][k]; expect([l, k, typeof t.name, t.name.trim() === t.name && t.name.length > 0]).toEqual([l, k, 'string', true]);
      if (k !== 'group') expect([l, k, typeof t.description, (t.description ?? '').trim().length > 0]).toEqual([l, k, 'string', true]);
      else expect(t.description).toBeUndefined();
    }
  });
  test.each(LANGS33)('%s: limity znaków App Store Connect (nazwa ≤ 30, opis ≤ 45; Apple: In-App Purchase Information), bez znaczników i znaków sterujących', (l) => {
    for (const k of KEYS) {
      const t = data.tlumaczenia[l][k];
      expect([l, k, 'nazwa', len(t.name) <= data.limity.nazwa && len(t.name) >= 2]).toEqual([l, k, 'nazwa', true]);
      if (t.description !== undefined) expect([l, k, 'opis', len(t.description) <= data.limity.opis]).toEqual([l, k, 'opis', true]);
      for (const s of [t.name, t.description ?? '']) { expect(s).not.toMatch(/[<>]/); expect(s).not.toMatch(/[\u0000-\u001f\u007f]/); }
    }
    expect(data.limity).toEqual({ nazwa: 30, opis: 45 });
  });
  test('limity także dla EN i PL wpisanych przez właściciela', () => {
    for (const loc of Object.values(data.wpisaneRecznie)) for (const k of KEYS) { const t = loc[k]; expect(len(t.name)).toBeLessThanOrEqual(30); expect(len(t.description ?? '')).toBeLessThanOrEqual(45); }
  });
  test('mapowanie języków aplikacji na lokalizacje App Store Connect: jawne, bez powtórzeń; nieobsługiwane = null (bg, sr, lt, lv, et, sl)', () => {
    expect(Object.fromEntries(LANGS33.map(l => [l, data.tlumaczenia[l].ascLocale]))).toEqual(MAPPING);
    const codes = Object.values(MAPPING).filter(Boolean) as string[]; expect(new Set(codes).size).toBe(codes.length); expect(codes).toHaveLength(27);
    expect(LANGS33.filter(l => MAPPING[l] === null).sort()).toEqual(['bg', 'et', 'lt', 'lv', 'sl', 'sr']);
    for (const c of codes) expect(c).not.toMatch(/^(en|pl)(-|$)/); /* EN i PL wpisał właściciel */
  });
  test.each(LANGS33)('%s: nazwy używają tego samego tłumaczenia „Pełna wersja” co słownik aplikacji (lib/locales)', (l) => {
    const full = (LOCALES[l as keyof typeof LOCALES] as Record<string, string>)['Pełna wersja']; expect(full).toBeTruthy();
    for (const k of ['monthly', 'yearly', 'lifetime'] as const) expect([l, k, data.tlumaczenia[l][k].name.startsWith(`${full} — `)]).toEqual([l, k, true]);
    expect(data.tlumaczenia[l].group.name.toLowerCase()).toContain(full.toLowerCase());
    expect(data.tlumaczenia[l].group.name.startsWith('Trening — ')).toBe(true);
  });
  test('trzy produkty mają w każdym języku różne nazwy i różne opisy', () => {
    for (const l of LANGS33) { const e = data.tlumaczenia[l]; for (const f of ['name', 'description'] as const) expect(new Set((['monthly', 'yearly', 'lifetime'] as const).map(k => e[k][f])).size).toBe(3); }
  });
  test('brak nazw innych aplikacji i marek (lista tests/forbidden-names.json)', () => {
    expect(namesIn(readFileSync(join(root, 'store/iap-localizations.json'), 'utf8'))).toEqual([]);
  });
  test('spójność z tekstem wpisanym przez właściciela w App Store Connect (EN U.S. i PL) oraz ze słownikiem aplikacji', () => {
    expect(data.wpisaneRecznie).toEqual({
      'en-US': { group: { name: 'Trening Full Version' }, monthly: { name: 'Full version — monthly', description: 'All features, billed monthly' }, yearly: { name: 'Full version — yearly', description: 'All features, billed once a year' }, lifetime: { name: 'Full version — lifetime', description: 'All features, one-time purchase' } },
      pl: { group: { name: 'Trening — pełna wersja' }, monthly: { name: 'Pełna wersja — miesięcznie', description: 'Wszystkie funkcje, płatność co miesiąc' }, yearly: { name: 'Pełna wersja — rocznie', description: 'Wszystkie funkcje, płatność raz w roku' }, lifetime: { name: 'Pełna wersja — dożywotnio', description: 'Wszystkie funkcje, jednorazowy zakup' } },
    });
    const en = readFileSync(join(root, 'lib/i18n.en.ts'), 'utf8'); expect(en).toContain("'Pełna wersja': 'Full version'");
    expect(data.wpisaneRecznie['en-US'].monthly.name.startsWith('Full version')).toBe(true); expect(data.wpisaneRecznie.pl.monthly.name.startsWith('Pełna wersja')).toBe(true);
  });
  test('lokalizacje z listy Apple: kody w zbiorze lokalizacji App Store Connect (App Store localizations, 14.10.2026)', () => {
    const KNOWN = ['ar-SA', 'ca', 'zh-Hans', 'zh-Hant', 'hr', 'cs', 'da', 'nl-NL', 'fi', 'fr-FR', 'fr-CA', 'de-DE', 'el', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'no', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sk', 'sl', 'es-MX', 'es-ES', 'sv', 'th', 'tr', 'uk', 'vi'];
    for (const c of Object.values(MAPPING).filter(Boolean) as string[]) expect(KNOWN).toContain(c);
  });
});

/* Atrapa serwera API + uruchomienie skryptu w procesie potomnym (ESM). Wynik: JSON na stdout. */
const DRIVER = `
import { run, makeClient, makeJwt, SUBSCRIPTION_GROUP_ID } from ${JSON.stringify(join(root, 'scripts/asc/iap-localizations.mjs'))};
import { readFileSync } from 'node:fs'; import { generateKeyPairSync, createPublicKey, verify } from 'node:crypto';
const data = JSON.parse(readFileSync(${JSON.stringify(join(root, 'store/iap-localizations.json'))}, 'utf8'));
const mode = process.argv[1];
const rows = (obj, locs) => locs.map((l, i) => ({ id: obj + '-' + i, attributes: { locale: l, name: data.wpisaneRecznie[l][obj === 'GROUP' ? 'group' : obj].name, description: data.wpisaneRecznie[l][obj === 'GROUP' ? 'group' : obj].description } }));
const store = { GROUP: rows('GROUP', ['en-US', 'pl']), monthly: rows('monthly', ['en-US', 'pl']), yearly: rows('yearly', ['en-US', 'pl']), lifetime: rows('lifetime', ['en-US', 'pl']) };
if (mode === 'owner-diff') store.monthly[1].attributes.name = 'Inna nazwa'; if (mode === 'owner-missing') store.yearly.pop();
if (mode === 'stale') store.yearly.push({ id: 'y-cs', attributes: { locale: 'cs', name: 'stare', description: 'stare' } });
if (mode === 'foreign') store.GROUP.push({ id: 'g-xx', attributes: { locale: 'ar-SA', name: 'x' } });
const calls = []; let n = 0;
const typeToObj = { subscriptionGroupLocalizations: 'GROUP', inAppPurchaseLocalizations: 'lifetime' };
const resp = (status, body) => ({ ok: status < 400, status, json: async () => body });
const fakeFetch = async (url, init = {}) => {
  const m = init.method || 'GET'; const u = new URL(url); const p = u.pathname; calls.push(m + ' ' + p);
  if (mode === 'fail-post' && m === 'POST' && calls.filter(c => c.startsWith('POST')).length === 2) return resp(409, { errors: [{ code: 'ENTITY_ERROR', title: 'bad', detail: 'SECRET-DETAIL' }] });
  if (m === 'GET') {
    if (p === '/v1/apps') return resp(200, { data: [{ id: '777', attributes: {} }] });
    if (p === '/v1/apps/777/subscriptionGroups') return resp(200, { data: mode === 'no-group' ? [] : [{ id: SUBSCRIPTION_GROUP_ID, attributes: {} }] });
    if (p === '/v1/subscriptionGroups/' + SUBSCRIPTION_GROUP_ID + '/subscriptions') return resp(200, { data: [{ id: 'S1', attributes: { productId: 'pl.lukasz.trening.full.monthly' } }, { id: 'S2', attributes: { productId: 'pl.lukasz.trening.full.yearly' } }] });
    if (p === '/v1/apps/777/inAppPurchasesV2') return resp(200, { data: [{ id: 'I1', attributes: { productId: 'pl.lukasz.trening.full.lifetime' } }] });
    let mm;
    if ((mm = p.match(/^\\/v1\\/subscriptionGroups\\/(\\d+)\\/subscriptionGroupLocalizations$/))) return resp(200, { data: store.GROUP });
    if ((mm = p.match(/^\\/v1\\/subscriptions\\/(S\\d)\\/subscriptionLocalizations$/))) return resp(200, { data: store[mm[1] === 'S1' ? 'monthly' : 'yearly'] });
    if (p === '/v2/inAppPurchases/I1/inAppPurchaseLocalizations') return resp(200, { data: store.lifetime });
    return resp(404, { errors: [] });
  }
  const body = JSON.parse(init.body);
  if (m === 'POST') {
    const a = body.data.attributes; const rel = Object.values(body.data.relationships)[0].data; const key = typeToObj[body.data.type] || (rel.id === 'S1' ? 'monthly' : 'yearly');
    store[key].push({ id: 'new-' + (++n), attributes: { ...a } }); return resp(201, { data: { id: 'new-' + n } });
  }
  if (m === 'PATCH') { const id = p.split('/').pop(); for (const k of Object.keys(store)) { const r = store[k].find(x => x.id === id); if (r) Object.assign(r.attributes, body.data.attributes); } return resp(200, { data: {} }); }
  return resp(405, {});
};
const logs = [];
const out = {};
if (mode === 'jwt') {
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const jwt = makeJwt({ keyId: 'KID1234567', issuerId: 'ISSUER', keyPem: privateKey.export({ type: 'pkcs8', format: 'pem' }), now: 1000 });
  const [h, b, s] = jwt.split('.'); out.header = JSON.parse(Buffer.from(h, 'base64url')); out.payload = JSON.parse(Buffer.from(b, 'base64url'));
  out.valid = verify('sha256', Buffer.from(h + '.' + b), { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(s, 'base64url')); out.sigLen = Buffer.from(s, 'base64url').length;
} else if (mode === 'delete') {
  try { await makeClient({ fetchFn: fakeFetch, token: 't' }).call('DELETE', '/v1/subscriptionLocalizations/x'); out.threw = false; } catch (e) { out.threw = true; out.msg = e.message; }
} else {
  const client = makeClient({ fetchFn: fakeFetch, token: 't' });
  const apply = ['apply', 'stale', 'foreign', 'fail-post'].includes(mode);
  const first = await run({ client, data, apply, log: l => logs.push(l) });
  out.first = { code: first.code, counts: first.counts, problems: first.problems }; out.callsAfterFirst = [...calls]; out.logs1 = [...logs];
  if (mode === 'apply' || mode === 'stale') { calls.length = 0; logs.length = 0; const second = await run({ client, data, apply: true, log: l => logs.push(l) }); out.second = { code: second.code, counts: second.counts }; out.callsSecond = [...calls]; out.logs2 = [...logs]; }
  out.store = Object.fromEntries(Object.entries(store).map(([k, v]) => [k, v.map(r => [r.attributes.locale, r.attributes.name, r.attributes.description])]));
}
process.stdout.write(JSON.stringify(out));
`;
const drive = (mode: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', DRIVER, mode], { encoding: 'utf8', maxBuffer: 20e6 }));
const MAPPED = LANGS33.filter(l => MAPPING[l]).length; /* 27 (sl odrzucony przez ASC 14.10.2026) */

describe('scripts/asc/iap-localizations.mjs na atrapie API', () => {
  test('dry-run: znajduje 4 obiekty, planuje utworzenie lokalizacji dla każdego obsługiwanego języka (4 × 27), niczego nie zapisuje', () => {
    const r = drive('dry');
    expect(r.first.code).toBe(0); expect(r.first.counts).toMatchObject({ 'utwórz': 4 * MAPPED, 'zaktualizuj': 0, 'pomiń': 4 * 6, błędy: 0, różniceWłaściciela: 0 });
    expect(r.callsAfterFirst.every((c: string) => c.startsWith('GET '))).toBe(true);
    expect(r.logs1[0]).toContain('DRY-RUN'); expect(r.logs1[0]).toContain('4 z 4');
    expect(r.logs1.join('\n')).toContain('bg → -: pomiń (brak lokalizacji w App Store Connect)');
    expect(r.store.GROUP).toHaveLength(2); /* bez zmian */
  });
  test('apply tworzy brakujące (4 × 27 POST), EN i PL nie są dotykane; drugi przebieg = same „pomiń” i zero zapisów (idempotencja)', () => {
    const r = drive('apply');
    expect(r.first.counts).toMatchObject({ 'utwórz': 4 * MAPPED, 'zaktualizuj': 0, błędy: 0 }); expect(r.first.code).toBe(0);
    expect(r.callsAfterFirst.filter((c: string) => c.startsWith('POST ')).length).toBe(4 * MAPPED); expect(r.callsAfterFirst.some((c: string) => c.startsWith('PATCH '))).toBe(false);
    expect(r.second.counts).toMatchObject({ 'utwórz': 0, 'zaktualizuj': 0, 'pomiń': 4 * (MAPPED + 6), błędy: 0 }); expect(r.second.code).toBe(0);
    expect(r.callsSecond.every((c: string) => c.startsWith('GET '))).toBe(true);
    for (const k of ['GROUP', 'monthly', 'yearly', 'lifetime']) { expect(r.store[k]).toHaveLength(2 + MAPPED); expect(r.store[k].slice(0, 2).map((x: string[]) => x[0])).toEqual(['en-US', 'pl']); }
    const de = r.store.monthly.find((x: string[]) => x[0] === 'de-DE'); expect(de.slice(1)).toEqual([data.tlumaczenia.de.monthly.name, data.tlumaczenia.de.monthly.description]);
    const mx = r.store.GROUP.find((x: string[]) => x[0] === 'es-MX'); expect(mx[1]).toBe(data.tlumaczenia['es-419'].group.name);
  });
  test('różniąca się lokalizacja jest aktualizowana (PATCH), pozostałe tworzone; po tym drugi przebieg nic nie zmienia', () => {
    const r = drive('stale');
    expect(r.first.counts['zaktualizuj']).toBe(1); expect(r.callsAfterFirst.filter((c: string) => c.startsWith('PATCH ')).length).toBe(1);
    expect(r.store.yearly.find((x: string[]) => x[0] === 'cs')[1]).toBe(data.tlumaczenia.cs.yearly.name);
    expect(r.second.counts).toMatchObject({ 'utwórz': 0, 'zaktualizuj': 0 }); expect(r.callsSecond.every((c: string) => c.startsWith('GET '))).toBe(true);
  });
  test('NIGDY nie usuwa: żadne wywołanie DELETE w przebiegach; klient odrzuca DELETE; obca lokalizacja zostaje nietknięta', () => {
    for (const m of ['apply', 'stale', 'foreign']) { const r = drive(m); expect([...r.callsAfterFirst, ...(r.callsSecond ?? [])].filter((c: string) => c.startsWith('DELETE'))).toEqual([]); }
    const d = drive('delete'); expect(d.threw).toBe(true); expect(d.msg).toContain('nigdy nie usuwa');
    const f = drive('foreign'); expect(f.store.GROUP.some((x: string[]) => x[0] === 'ar-SA' && x[1] === 'x')).toBe(true); expect(f.logs1.join('\n')).toContain('[obce, nietykane] ar-SA');
  });
  test('EN (U.S.) i PL: różnica lub brak tylko raportowane, nigdy zapisywane', () => {
    const diff = drive('owner-diff'); expect(diff.first.counts.różniceWłaściciela).toBe(1); expect(diff.logs1.join('\n')).toContain('[właściciel] pl: RÓŻNICA względem pliku (nie zmieniam)');
    expect(diff.callsAfterFirst.every((c: string) => c.startsWith('GET '))).toBe(true);
    const miss = drive('owner-missing'); expect(miss.logs1.join('\n')).toContain('[właściciel] pl: brak w App Store Connect (wpisz ręcznie)');
    const ap = drive('apply'); expect(ap.callsAfterFirst.some((c: string) => c.includes('/subscriptionLocalizations/') && c.startsWith('PATCH'))).toBe(false);
  });
  test('brak obiektu w App Store Connect: problem i kod 1; błąd zapisu liczony, przebieg trwa dalej, treść błędu (detail) nie trafia do logu', () => {
    const ng = drive('no-group'); expect(ng.first.code).toBe(1); expect(ng.first.problems.length).toBeGreaterThan(0);
    const fp = drive('fail-post'); expect(fp.first.code).toBe(1); expect(fp.first.counts.błędy).toBe(1); expect(fp.first.counts['utwórz']).toBe(4 * MAPPED);
    const log = fp.logs1.join('\n'); expect(log).toContain('BŁĄD'); expect(log).toContain('ENTITY_ERROR'); expect(log).not.toContain('SECRET-DETAIL');
  });
  test('JWT ES256: nagłówek, ładunek (aud, iss, exp = iat + 10 min), podpis 64 bajty i poprawny', () => {
    const r = drive('jwt'); expect(r.header).toEqual({ alg: 'ES256', kid: 'KID1234567', typ: 'JWT' });
    expect(r.payload).toEqual({ iss: 'ISSUER', iat: 1000, exp: 1600, aud: 'appstoreconnect-v1' }); expect(r.sigLen).toBe(64); expect(r.valid).toBe(true);
  });
  test('log nie zawiera identyfikatorów obiektów ani danych konta (repozytorium publiczne)', () => {
    const r = drive('apply'); const all = [...r.logs1, ...r.logs2].join('\n');
    expect(all).not.toMatch(/777|S1|S2|I1|22474799|new-\d|Bearer|BEGIN/);
  });
  test('kod skryptu: brak wywołania DELETE i wypisywania sekretów', () => {
    const src = readFileSync(join(root, 'scripts/asc/iap-localizations.mjs'), 'utf8');
    expect(src).not.toMatch(/'DELETE'\s*,\s*[`'"\/]/); expect(src).toContain("new Set(['GET', 'POST', 'PATCH'])"); expect(src).not.toMatch(/console\.log\([^)]*(keyId|issuerId|token|keyPem)/);
  });
});
