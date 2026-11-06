// Status wersji iOS w App Store Connect, TYLKO ODCZYT (decyzja koordynatora 03.11.2026, ZB-022 w docs/zobowiazania.md): stan recenzji bez udziału właściciela.
//   node scripts/asc/status-wersji.mjs
// Klient: wspólny z metadane.mjs (makeClient z iap-localizations.mjs) owinięty w readOnlyClient — każda metoda poza GET kończy się błędem.
// Repozytorium jest publiczne: w logu tylko numer wersji, platforma, stan i daty; nigdy identyfikatory aplikacji, wersji ani zgłoszeń, e-maile, tokeny.
// API nie podaje daty „ostatniej zmiany stanu” wersji: wypisujemy datę utworzenia wersji (appStoreVersions.createdDate) i datę wysłania do recenzji (reviewSubmissions.submittedDate).
// Dane logowania: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH (plik .p8).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { makeClient, makeJwt, BUNDLE_ID } from './iap-localizations.mjs';
import { readOnlyClient } from './metadane.mjs';

export const stateOf = r => r.attributes?.appStoreState ?? r.attributes?.appVersionState ?? '';
const day = s => (s ? String(s).slice(0, 10) : '—');
const clean = s => String(s ?? '—').replace(/[^\w .+()-]/g, '').slice(0, 40) || '—';

/** Wiersze statusu wersji (bez identyfikatorów), najnowsze utworzone pierwsze. */
export function statusRows(versions) {
  return versions
    .map(v => ({ version: clean(v.attributes?.versionString), platform: clean(v.attributes?.platform), state: clean(stateOf(v)), created: day(v.attributes?.createdDate) }))
    .sort((a, b) => (a.created < b.created ? 1 : a.created > b.created ? -1 : 0));
}
export function submissionRows(subs) {
  return subs.map(s => ({ platform: clean(s.attributes?.platform), state: clean(s.attributes?.state), submitted: day(s.attributes?.submittedDate) }))
    .sort((a, b) => (a.submitted < b.submitted ? 1 : a.submitted > b.submitted ? -1 : 0));
}

/** Główny przebieg (tylko GET). Zwraca { code }. Kod 1: brak aplikacji albo błąd API. */
export async function run({ client, log = console.log }) {
  const c = readOnlyClient(client);
  log('## Status wersji iOS w App Store Connect (tylko odczyt)\n');
  try {
    const apps = await c.list('/v1/apps?filter[bundleId]=' + BUNDLE_ID);
    if (apps.length !== 1) { log(`BŁĄD: aplikacja ${BUNDLE_ID}: znaleziono ${apps.length}`); return { code: 1 }; }
    const appId = apps[0].id;
    const rows = statusRows(await c.list(`/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS`));
    log('| Wersja | Platforma | Stan | Utworzona |\n|---|---|---|---|');
    for (const r of rows) log(`| ${r.version} | ${r.platform} | ${r.state} | ${r.created} |`);
    if (!rows.length) log('| brak wersji | — | — | — |');
    log('');
    let subs = [];
    try { subs = submissionRows(await c.list(`/v1/apps/${appId}/reviewSubmissions?filter[platform]=IOS`)); } catch (e) { log(`Zgłoszenia do recenzji: niedostępne (${String(e.message).slice(0, 80)})\n`); }
    if (subs.length) {
      log('| Zgłoszenie do recenzji: platforma | Stan | Wysłane |\n|---|---|---|');
      for (const s of subs) log(`| ${s.platform} | ${s.state} | ${s.submitted} |`);
      log('');
    }
    return { code: 0 };
  } catch (e) { log(`BŁĄD: ${String(e.message).slice(0, 200)}`); return { code: 1 }; }
}

async function main() {
  const { ASC_KEY_ID: keyId, ASC_ISSUER_ID: issuerId, ASC_KEY_PATH: keyPath } = process.env;
  if (!keyId || !issuerId || !keyPath) { console.error('Brak ASC_KEY_ID, ASC_ISSUER_ID lub ASC_KEY_PATH.'); process.exit(2); }
  const token = () => makeJwt({ keyId, issuerId, keyPem: readFileSync(keyPath, 'utf8') });
  const { code } = await run({ client: makeClient({ token }) });
  process.exit(code);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main().catch(e => { console.error(`Błąd: ${String(e.message).slice(0, 200)}`); process.exit(1); });
