// Dopisanie lokalizacji produktów zakupu (grupa subskrypcji + 2 subskrypcje + zakup jednorazowy) w App Store Connect przez API.
// Decyzja właściciela 14.10.2026 (wariant A). Źródło tekstów: store/iap-localizations.json (jedno źródło prawdy).
//   node scripts/asc/iap-localizations.mjs            → plan bez zmian (--dry-run, domyślnie)
//   node scripts/asc/iap-localizations.mjs --apply    → tworzy brakujące i aktualizuje różniące się
//   dodatkowo --tylko <klucz>:<lokalizacja> (np. yearly:cs) → tylko jeden element (pierwszy zapis do usługi zewnętrznej, L-001 pkt 1)
// API v2 (od App Store Connect API 4.4.1; wycofane zasoby v1 znikną na początku 2027 — docs/research/asc-iap-v2-2026-11-13.md):
//   lokalizacje należą do wersji roboczej produktu (…Version, stan PREPARE_FOR_SUBMISSION); skrypt wersji NIE tworzy — brak edytowalnej wersji = problem, bez zapisu.
// Zasady: NIGDY nie usuwa (klient dopuszcza tylko GET, POST, PATCH); EN (U.S.) i PL wpisane przez właściciela tylko odczytuje i porównuje;
// repozytorium jest publiczne — w logu tylko liczby, kody lokalizacji i nazwy produktów, nigdy identyfikatory klucza, tokeny ani odpowiedzi API.
// Dane logowania z zmiennych środowiskowych: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH (plik .p8).
import { createPrivateKey, sign as cryptoSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { jestGlowny } from '../modul-glowny.mjs';

export const BUNDLE_ID = 'pl.lukasz.trening';
export const SUBSCRIPTION_GROUP_ID = '22474799';
export const PRODUCTS = {
  monthly: { productId: 'pl.lukasz.trening.full.monthly', kind: 'subscription' },
  yearly: { productId: 'pl.lukasz.trening.full.yearly', kind: 'subscription' },
  lifetime: { productId: 'pl.lukasz.trening.full.lifetime', kind: 'iap' },
};
/** Lokalizacje wpisane przez właściciela — skrypt ich nie zapisuje. */
export const OWNER_LOCALES = ['en-US', 'pl'];
export const API = 'https://api.appstoreconnect.apple.com';
/** Jedyny stan wersji, w którym zapisujemy lokalizacje (wniosek z nazwy stanu; potwierdza pierwszy zapis na jednym elemencie — docs/research/asc-iap-v2-2026-11-13.md pkt 5). */
export const EDITABLE_STATE = 'PREPARE_FOR_SUBMISSION';
export const ONLY_KEYS = ['group', 'monthly', 'yearly', 'lifetime'];
const ALLOWED_METHODS = new Set(['GET', 'POST', 'PATCH']);

const b64u = b => Buffer.from(b).toString('base64url');
/** Token JWT ES256 (ważny 10 minut) — bez zależności, tylko `crypto`. */
export function makeJwt({ keyId, issuerId, keyPem, now = Math.floor(Date.now() / 1000) }) {
  const head = b64u(JSON.stringify({ alg: 'ES256', kid: keyId, typ: 'JWT' }));
  const body = b64u(JSON.stringify({ iss: issuerId, iat: now, exp: now + 600, aud: 'appstoreconnect-v1' }));
  const sig = cryptoSign('sha256', Buffer.from(`${head}.${body}`), { key: createPrivateKey(keyPem), dsaEncoding: 'ieee-p1363' });
  return `${head}.${body}.${b64u(sig)}`;
}

/** Klient API: tylko GET/POST/PATCH; stronicowanie przez links.next; błąd bez treści odpowiedzi (tylko status, kody i tytuły).
 *  `token`: tekst albo fabryka `() => tekst` wywoływana przy każdym żądaniu (długie przebiegi odnawiają token; zgodne wstecz ze stałym tokenem). */
export function makeClient({ fetchFn = fetch, token, sleep = ms => new Promise(r => setTimeout(r, ms)) }) {
  async function call(method, path, body) {
    if (!ALLOWED_METHODS.has(method)) throw new Error(`Niedozwolona metoda ${method} — skrypt nigdy nie usuwa`);
    const url = path.startsWith('http') ? path : API + path;
    for (let attempt = 0; ; attempt++) {
      const res = await fetchFn(url, { method, headers: { Authorization: `Bearer ${typeof token === 'function' ? token() : token}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      if (res.status === 429 && attempt < 3) { await sleep(2000 * (attempt + 1)); continue; }
      let json = null; try { json = await res.json(); } catch { json = null; }
      if (!res.ok) {
        const errs = (json?.errors ?? []).map(e => [e.code, e.title].filter(Boolean).join(': ')).filter(Boolean).join('; ');
        const err = new Error(`${method} ${path.split('?')[0].replace(/\/[0-9a-f-]{8,}/gi, '/{id}')} → ${res.status}${errs ? ` (${errs})` : ''}`); err.status = res.status; throw err;
      }
      return json;
    }
  }
  async function list(path) {
    const out = []; let next = path + (path.includes('?') ? '&' : '?') + 'limit=200';
    while (next) { const j = await call('GET', next); out.push(...(j?.data ?? [])); next = j?.links?.next ?? null; }
    return out;
  }
  return { call, list };
}

/** Plan dla jednego obiektu: istniejące lokalizacje (locale → {id, name, description}) kontra tłumaczenia. */
export function planObject({ key, translations, owner, existing, hasDescription }) {
  const fields = hasDescription ? ['name', 'description'] : ['name'];
  const same = (a, b) => fields.every(f => (a?.[f] ?? '') === (b?.[f] ?? ''));
  const items = [];
  for (const [lang, tr] of Object.entries(translations)) {
    if (!tr.ascLocale) { items.push({ key, lang, locale: null, action: 'pomiń', reason: 'brak lokalizacji w App Store Connect' }); continue; }
    const have = existing.get(tr.ascLocale); const want = tr[key];
    if (!have) items.push({ key, lang, locale: tr.ascLocale, action: 'utwórz', want });
    else if (same(have, want)) items.push({ key, lang, locale: tr.ascLocale, action: 'pomiń', reason: 'bez zmian' });
    else items.push({ key, lang, locale: tr.ascLocale, action: 'zaktualizuj', id: have.id, want });
  }
  const ownerReport = [];
  for (const [locale, text] of Object.entries(owner)) {
    const have = existing.get(locale); const want = text[key];
    if (!have) ownerReport.push({ key, locale, status: 'brak w App Store Connect (wpisz ręcznie)' });
    else if (!same(have, want)) ownerReport.push({ key, locale, status: 'RÓŻNICA względem pliku (nie zmieniam)' });
    else ownerReport.push({ key, locale, status: 'zgodne z plikiem' });
  }
  const known = new Set([...OWNER_LOCALES, ...Object.values(translations).map(t => t.ascLocale).filter(Boolean)]);
  const extra = [...existing.keys()].filter(l => !known.has(l));
  return { items, ownerReport, extra };
}

const toMap = rows => new Map(rows.map(r => [r.attributes.locale, { id: r.id, name: r.attributes.name, description: r.attributes.description }]));

/** Wybiera wersję roboczą (najwyższy numer w stanie edytowalnym) albo null; `states` do komunikatu (bez identyfikatorów). */
export function pickDraft(versions) {
  const drafts = versions.filter(v => v.attributes?.state === EDITABLE_STATE).sort((a, b) => (b.attributes.version ?? 0) - (a.attributes.version ?? 0));
  return { draft: drafts[0] ?? null, states: [...new Set(versions.map(v => v.attributes?.state ?? '?'))] };
}

/** Znajduje obiekty w App Store Connect, ich wersje robocze i istniejące lokalizacje (v2). Zwraca listę celów (cel = obiekt z `existing`, ścieżkami tworzenia i aktualizacji). */
export async function discover(client, log) {
  const targets = []; const problems = [];
  const draftOf = async (path, label, key) => {
    const { draft, states } = pickDraft(await client.list(path));
    if (!draft) problems.push({ key, text: `${label}: brak wersji roboczej (${EDITABLE_STATE}); stany wersji: ${states.join(', ') || 'brak wersji'} — skrypt nie tworzy wersji (decyzja właściciela 13.11.2026, wariant A): utwórz wersję roboczą produktu w App Store Connect, potem ponów dry-run` });
    return draft;
  };
  const localizationsOf = async path => toMap(await client.list(path));
  try {
    const groups = await client.list('/v1/apps?filter[bundleId]=' + BUNDLE_ID);
    if (groups.length !== 1) throw new Error(`aplikacja ${BUNDLE_ID}: znaleziono ${groups.length}`);
    const appId = groups[0].id;
    // Grupa subskrypcji
    const sg = await client.list(`/v1/apps/${appId}/subscriptionGroups`);
    const group = sg.find(g => g.id === SUBSCRIPTION_GROUP_ID);
    if (!group) throw new Error('grupa subskrypcji o oczekiwanym ID nie należy do aplikacji');
    const gv = await draftOf(`/v1/subscriptionGroups/${group.id}/versions`, 'grupa subskrypcji', 'group');
    if (gv) targets.push({ key: 'group', label: 'grupa subskrypcji', hasDescription: false, existing: await localizationsOf(`/v1/subscriptionGroupVersions/${gv.id}/localizations`),
      create: (locale, w) => ({ type: 'subscriptionGroupLocalizations', attributes: { locale, name: w.name }, relationships: { version: { data: { type: 'subscriptionGroupVersions', id: gv.id } } } }),
      createPath: '/v2/subscriptionGroupLocalizations', updatePath: id => `/v2/subscriptionGroupLocalizations/${id}`, updateType: 'subscriptionGroupLocalizations' });
    const subs = await client.list(`/v1/subscriptionGroups/${group.id}/subscriptions`);
    for (const [key, p] of Object.entries(PRODUCTS).filter(([, p]) => p.kind === 'subscription')) {
      const sub = subs.find(x => x.attributes.productId === p.productId);
      if (!sub) { problems.push({ key, text: `brak subskrypcji ${p.productId}` }); continue; }
      const sv = await draftOf(`/v1/subscriptions/${sub.id}/versions`, p.productId, key);
      if (!sv) continue;
      targets.push({ key, label: p.productId, hasDescription: true, existing: await localizationsOf(`/v1/subscriptionVersions/${sv.id}/localizations`),
        create: (locale, w) => ({ type: 'subscriptionLocalizations', attributes: { locale, name: w.name, description: w.description }, relationships: { version: { data: { type: 'subscriptionVersions', id: sv.id } } } }),
        createPath: '/v2/subscriptionLocalizations', updatePath: id => `/v2/subscriptionLocalizations/${id}`, updateType: 'subscriptionLocalizations' });
    }
    // Zakup jednorazowy (Non-Consumable)
    const lt = PRODUCTS.lifetime;
    const iaps = await client.list(`/v1/apps/${appId}/inAppPurchasesV2?filter[productId]=${lt.productId}`);
    const iap = iaps.find(x => x.attributes.productId === lt.productId);
    if (!iap) problems.push({ key: 'lifetime', text: `brak produktu ${lt.productId}` });
    else {
      const iv = await draftOf(`/v2/inAppPurchases/${iap.id}/versions`, lt.productId, 'lifetime');
      if (iv) targets.push({ key: 'lifetime', label: lt.productId, hasDescription: true, existing: await localizationsOf(`/v1/inAppPurchaseVersions/${iv.id}/localizations`),
        create: (locale, w) => ({ type: 'inAppPurchaseLocalizations', attributes: { locale, name: w.name, description: w.description }, relationships: { version: { data: { type: 'inAppPurchaseVersions', id: iv.id } } } }),
        createPath: '/v2/inAppPurchaseLocalizations', updatePath: id => `/v2/inAppPurchaseLocalizations/${id}`, updateType: 'inAppPurchaseLocalizations' });
    }
  } catch (e) { problems.push({ key: null, text: e.message }); }
  return { targets, problems };
}

/** `--tylko klucz:lokalizacja` → { key, locale }; błędy wejścia przed jakimkolwiek wywołaniem API. */
export function parseOnly(only, data) {
  if (only === undefined || only === null || only === '') return null;
  const m = /^([a-z]+):([A-Za-z0-9-]+)$/.exec(String(only));
  if (!m) throw new Error('--tylko wymaga postaci <klucz>:<lokalizacja>, np. yearly:cs');
  const [, key, locale] = m;
  if (!ONLY_KEYS.includes(key)) throw new Error(`--tylko: nieznany klucz (dozwolone: ${ONLY_KEYS.join(', ')})`);
  if (OWNER_LOCALES.includes(locale)) throw new Error('--tylko: lokalizacje właściciela (en-US, pl) nie są zapisywane przez skrypt');
  const lang = Object.entries(data.tlumaczenia).find(([, t]) => t.ascLocale === locale)?.[0];
  if (!lang) throw new Error('--tylko: lokalizacja spoza pliku tłumaczeń (albo nieobsługiwana w App Store Connect)');
  return { key, locale, lang };
}

/** Główny przebieg. Zwraca { code, counts } (code 1 przy brakujących obiektach lub błędach zapisu). */
export async function run({ client, data, apply = false, only, log = console.log }) {
  const filter = parseOnly(only, data);
  const { targets: all, problems } = await discover(client, log);
  const targets = filter ? all.filter(t => t.key === filter.key) : all;
  log(`Tryb: ${apply ? 'APPLY (zapis)' : 'DRY-RUN (bez zmian)'}; obiektów znalezionych: ${all.length} z 4${filter ? `; zawężenie: ${filter.key}:${filter.locale}` : ''}`);
  const counts = { 'utwórz': 0, 'zaktualizuj': 0, 'pomiń': 0, błędy: 0, różniceWłaściciela: 0 };
  for (const t of targets) {
    const plan = planObject({ key: t.key, translations: data.tlumaczenia, owner: data.wpisaneRecznie, existing: t.existing, hasDescription: t.hasDescription });
    log(`\n== ${t.label} (istniejących lokalizacji: ${t.existing.size}) ==`);
    for (const r of plan.ownerReport) { log(`  [właściciel] ${r.locale}: ${r.status}`); if (!r.status.startsWith('zgodne')) counts.różniceWłaściciela++; }
    if (plan.extra.length) log(`  [obce, nietykane] ${plan.extra.join(', ')}`);
    for (const it of filter ? plan.items.filter(i => i.locale === filter.locale) : plan.items) {
      let note = it.reason ? ` (${it.reason})` : '';
      if (apply && (it.action === 'utwórz' || it.action === 'zaktualizuj')) {
        try {
          if (it.action === 'utwórz') await client.call('POST', t.createPath, { data: t.create(it.locale, it.want) });
          else await client.call('PATCH', t.updatePath(it.id), { data: { type: t.updateType, id: it.id, attributes: t.hasDescription ? { name: it.want.name, description: it.want.description } : { name: it.want.name } } });
          note = ' → zapisano';
        } catch (e) { counts.błędy++; note = ` → BŁĄD ${e.message}`; }
      }
      counts[it.action]++;
      log(`  ${it.lang} → ${it.locale ?? '-'}: ${it.action}${note}`);
    }
  }
  const liczone = filter ? problems.filter(p => p.key === filter.key || p.key === null) : problems;
  for (const p of problems) log(`PROBLEM${filter && !liczone.includes(p) ? ' (poza zawężeniem, nie wpływa na kod wyjścia)' : ''}: ${p.text}`);
  log(`\nPodsumowanie: utwórz ${counts['utwórz']}, zaktualizuj ${counts['zaktualizuj']}, pomiń ${counts['pomiń']}, błędy zapisu ${counts.błędy}, różnice w lokalizacjach właściciela ${counts.różniceWłaściciela}, problemy ${problems.length}${filter ? ` (liczone do kodu wyjścia: ${liczone.length})` : ''}`);
  return { code: liczone.length || counts.błędy ? 1 : 0, counts, problems: problems.map(p => p.text) };
}

async function main() {
  const args = process.argv.slice(2); const apply = args.includes('--apply');
  const oi = args.indexOf('--tylko'); const only = oi >= 0 ? args[oi + 1] : undefined;
  if (oi >= 0 && !only) { console.error('--tylko wymaga wartości <klucz>:<lokalizacja>.'); process.exit(2); }
  if (apply && args.includes('--dry-run')) { console.error('Podaj tylko jeden tryb.'); process.exit(2); }
  const { ASC_KEY_ID: keyId, ASC_ISSUER_ID: issuerId, ASC_KEY_PATH: keyPath } = process.env;
  if (!keyId || !issuerId || !keyPath) { console.error('Brak ASC_KEY_ID, ASC_ISSUER_ID lub ASC_KEY_PATH.'); process.exit(2); }
  const data = JSON.parse(readFileSync(new URL('../../store/iap-localizations.json', import.meta.url), 'utf8'));
  const token = makeJwt({ keyId, issuerId, keyPem: readFileSync(keyPath, 'utf8') });
  const { code } = await run({ client: makeClient({ token }), data, apply, only });
  process.exit(code);
}
if (jestGlowny(import.meta.url)) main().catch(e => { console.error(`Błąd: ${String(e.message).slice(0, 200)}`); process.exit(1); });
