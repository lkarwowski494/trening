// Recenzje klientów z App Store Connect (KO-121 (c)): TYLKO ODCZYT (readOnlyClient). Zapis do katalogu --out (w produkcji: prywatne repo właściciela).
//   node scripts/asc/recenzje.mjs --out <katalog>
// NIE zapisujemy pseudonimu autora (pole pseudonimu — osoba trzecia). Treść recenzji nigdy w logu; w logu tylko liczności.
// Źródła: developer.apple.com/documentation/appstoreconnectapi/get-v1-apps-_id_-customerreviews (CustomerReview.Attributes: body, createdDate, rating, title, territory),
// …/get-v1-apps-_id_-customerreviewsummarizations (CustomerReviewSummarization.Attributes: createdDate, locale, platform, text).
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { makeClient, makeJwt, BUNDLE_ID } from './iap-localizations.mjs';
import { readOnlyClient } from './metadane.mjs';
import { stronicuj, zapiszJson } from './pomocnicze.mjs';
import { jestGlowny } from '../modul-glowny.mjs';

const tekst = v => (v === undefined || v === null ? '' : String(v));
const dzien = s => tekst(s).slice(0, 10);

/** Recenzja → wiersz bez pseudonimu autora. */
export const wierszRecenzji = r => ({ id: tekst(r.id), data: dzien(r.attributes?.createdDate), terytorium: tekst(r.attributes?.territory), ocena: Number(r.attributes?.rating ?? 0), tytul: tekst(r.attributes?.title), tresc: tekst(r.attributes?.body) });
/** Scalenie po id: nowe wiersze zastępują stare o tym samym id, pozostałe zostają; najnowsze pierwsze. */
export function scalRecenzje(stare, nowe) {
  const ids = new Set(nowe.map(w => w.id));
  return [...nowe, ...stare.filter(w => !ids.has(w.id))].sort((a, b) => b.data.localeCompare(a.data) || a.id.localeCompare(b.id));
}

export async function run({ client, out, log = console.log }) {
  const c = readOnlyClient(client);
  try {
    const apps = await c.list('/v1/apps?filter[bundleId]=' + BUNDLE_ID);
    if (apps.length !== 1) { log(`BŁĄD: aplikacja ${BUNDLE_ID}: znaleziono ${apps.length}`); return { code: 1 }; }
    const appId = apps[0].id;
    const { data } = await stronicuj(c, `/v1/apps/${appId}/customerReviews`);
    const sciezka = join(out, 'recenzje.json');
    let stare = [];
    try { if (existsSync(sciezka)) stare = JSON.parse(readFileSync(sciezka, 'utf8')); } catch { stare = []; }
    const znane = new Set(stare.map(w => w.id));
    const nowe = data.map(wierszRecenzji);
    const razem = scalRecenzje(stare, nowe);
    zapiszJson(out, 'recenzje.json', razem);
    let streszczen = 'brak danych';
    try {
      const s = await stronicuj(c, `/v1/apps/${appId}/customerReviewSummarizations?filter[platform]=IOS`);
      const wiersze = s.data.map(x => ({ locale: tekst(x.attributes?.locale), platforma: tekst(x.attributes?.platform), data: dzien(x.attributes?.createdDate), tekst: tekst(x.attributes?.text) }));
      zapiszJson(out, 'streszczenia-recenzji.json', wiersze); streszczen = String(wiersze.length);
    } catch (e) { log(`Streszczenia recenzji: niedostępne (${String(e.message).slice(0, 80)})`); }
    log(`recenzji: ${razem.length} (nowych: ${nowe.filter(w => !znane.has(w.id)).length}); streszczeń: ${streszczen}`);
    return { code: 0 };
  } catch (e) { log(`BŁĄD: ${String(e.message).slice(0, 200)}`); return { code: 1 }; }
}

async function main() {
  const arg = process.argv.slice(2); const i = arg.indexOf('--out'); const out = i >= 0 ? arg[i + 1] : null;
  const { ASC_KEY_ID: keyId, ASC_ISSUER_ID: issuerId, ASC_KEY_PATH: keyPath } = process.env;
  if (!out || !keyId || !issuerId || !keyPath) { console.error('Użycie: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH oraz --out <katalog>.'); process.exit(2); }
  const token = () => makeJwt({ keyId, issuerId, keyPem: readFileSync(keyPath, 'utf8') });
  const { code } = await run({ client: makeClient({ token }), out });
  process.exit(code);
}
if (jestGlowny(import.meta.url)) main().catch(e => { console.error(`Błąd: ${String(e.message).slice(0, 200)}`); process.exit(1); });
