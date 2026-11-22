// Ceny subskrypcji i planu dożywotniego z App Store Connect (KO-121 (d), Z-36 w docs/48): TYLKO ODCZYT (readOnlyClient).
//   node scripts/asc/ceny.mjs --out <katalog>     → ceny.json (do prywatnego repo); w logu tylko liczności.
// Źródła: developer.apple.com/documentation/appstoreconnectapi/get-v1-subscriptiongroups-_id_-subscriptions, …/get-v1-subscriptions-_id_-prices
// (SubscriptionPrice nie niesie kwoty — kwota w dołączonym SubscriptionPricePoint: customerPrice, proceeds), …/get-v1-apps-_id_-inapppurchasesv2,
// …/get-v2-inapppurchases-_id_-iappriceschedule, …/get-v1-inapppurchasepriceschedules-_id_-manualprices i …-automaticprices (InAppPurchasePrice: manual, startDate, endDate).
import { readFileSync } from 'node:fs';
import { makeClient, makeJwt, BUNDLE_ID, SUBSCRIPTION_GROUP_ID, PRODUCTS } from './iap-localizations.mjs';
import { readOnlyClient } from './metadane.mjs';
import { stronicuj, zapiszJson } from './pomocnicze.mjs';
import { jestGlowny } from '../modul-glowny.mjs';

const tekst = v => (v === undefined || v === null ? '' : String(v));
const lub = v => (v === undefined || v === null || v === '' ? null : v);

/** Ceny z odpowiedzi { data, included }: kwota z punktu cenowego powiązanego relacją `rel`, terytorium z relacji `territory`. */
export function zlozCeny({ data, included }, rel, typPunktu) {
  const punkty = new Map(included.filter(x => x.type === typPunktu).map(x => [x.id, x.attributes ?? {}]));
  return data.map(p => {
    const pt = punkty.get(p.relationships?.[rel]?.data?.id) ?? {};
    return { terytorium: tekst(p.relationships?.territory?.data?.id), cena_klienta: lub(pt.customerPrice), dochod: lub(pt.proceeds), start: lub(p.attributes?.startDate), reczna: p.attributes?.manual ?? null };
  }).sort((a, b) => a.terytorium.localeCompare(b.terytorium) || String(a.start).localeCompare(String(b.start)));
}

export async function run({ client, out, log = console.log }) {
  const c = readOnlyClient(client);
  try {
    const apps = await c.list('/v1/apps?filter[bundleId]=' + BUNDLE_ID);
    if (apps.length !== 1) { log(`BŁĄD: aplikacja ${BUNDLE_ID}: znaleziono ${apps.length}`); return { code: 1 }; }
    const appId = apps[0].id;
    const produkty = []; let ceny = 0;
    const subs = (await stronicuj(c, `/v1/subscriptionGroups/${SUBSCRIPTION_GROUP_ID}/subscriptions`)).data;
    for (const s of subs) {
      const lista = zlozCeny(await stronicuj(c, `/v1/subscriptions/${s.id}/prices?include=subscriptionPricePoint,territory`), 'subscriptionPricePoint', 'subscriptionPricePoints');
      produkty.push({ productId: tekst(s.attributes?.productId), nazwa: tekst(s.attributes?.name), rodzaj: 'subskrypcja', stan: tekst(s.attributes?.state), okres: tekst(s.attributes?.subscriptionPeriod), ceny: lista });
      ceny += lista.length;
    }
    const iap = (await stronicuj(c, `/v1/apps/${appId}/inAppPurchasesV2?filter[productId]=${PRODUCTS.lifetime.productId}`)).data[0];
    if (!iap) log('Plan dożywotni: brak w App Store Connect');
    else {
      const harmonogram = await c.call('GET', `/v2/inAppPurchases/${iap.id}/iapPriceSchedule`);
      const sid = harmonogram?.data?.id;
      const sciezka = r => `/v1/inAppPurchasePriceSchedules/${sid}/${r}?include=inAppPurchasePricePoint,territory`;
      const lista = sid ? [...zlozCeny(await stronicuj(c, sciezka('manualPrices')), 'inAppPurchasePricePoint', 'inAppPurchasePricePoints'), ...zlozCeny(await stronicuj(c, sciezka('automaticPrices')), 'inAppPurchasePricePoint', 'inAppPurchasePricePoints')] : [];
      produkty.push({ productId: tekst(iap.attributes?.productId), nazwa: tekst(iap.attributes?.name), rodzaj: 'iap', stan: tekst(iap.attributes?.state), okres: '', ceny: lista });
      ceny += lista.length;
    }
    zapiszJson(out, 'ceny.json', { produkty });
    log(`produktów: ${produkty.length}; cen: ${ceny}`);
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
