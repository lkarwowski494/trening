// Metadane aplikacji NA ŻYWO w App Store Connect (KO-106, kolejność (a)): wersja w sprzedaży (READY_FOR_SALE) → lokalizacje wersji
// (słowa kluczowe, opis, tekst promocyjny, „Co nowego”) oraz informacje o aplikacji (nazwa, podtytuł) dla wszystkich lokalizacji; dostępność terytoriów.
//   node scripts/asc/na-zywo.mjs --out <katalog>
// TYLKO ODCZYT (readOnlyClient: każda metoda poza GET kończy się błędem). Dane trafiają do katalogu --out (w produkcji: prywatne repo właściciela);
// w logu publicznym tylko liczby lokalizacji i stany, bez treści (metadane sklepu są publiczne, ale log ma być jednolity z analityką).
// Dzisiejszy podgląd (scripts/asc/metadane.mjs) czyta tylko wersję edytowalną; ten skrypt czyta wersję opublikowaną.
// Źródła: developer.apple.com/documentation/appstoreconnectapi/get-v1-apps-_id_-appstoreversions (filter[appStoreState]),
// …/get-v1-appstoreversions-_id_-appstoreversionlocalizations, …/get-v1-appinfos-_id_-appinfolocalizations, …/get-v1-apps-_id_-appavailabilityv2.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { makeClient, makeJwt, BUNDLE_ID } from './iap-localizations.mjs';
import { readOnlyClient } from './metadane.mjs';
import { jestGlowny } from '../modul-glowny.mjs';

export const STAN_WERSJI_NA_ZYWO = 'READY_FOR_SALE';
/** Stany appInfo oznaczające obiekt opublikowany; gdy żaden nie pasuje, a appInfo jest jeden, bierzemy go (oznaczone w stanie jako „zakladany”). [DO USTALENIA]: dokładne wartości stanu appInfo przy pierwszym odczycie. */
export const STANY_INFO_NA_ZYWO = ['READY_FOR_DISTRIBUTION', 'READY_FOR_SALE'];

const stan = r => r.attributes?.appStoreState ?? r.attributes?.appVersionState ?? r.attributes?.state ?? '';

export const wersjaNaZywo = versions => versions.find(v => stan(v) === STAN_WERSJI_NA_ZYWO) ?? null;
export function infoNaZywo(infos) {
  const live = infos.find(i => STANY_INFO_NA_ZYWO.includes(stan(i)));
  if (live) return { info: live, zakladany: false };
  return infos.length === 1 ? { info: infos[0], zakladany: true } : { info: null, zakladany: false };
}

const pole = (a, k) => (a?.[k] === undefined || a?.[k] === null ? '' : String(a[k]));
/** Wiersze lokalizacji wersji: locale + pola tekstowe (bajty słów kluczowych liczone dla kontroli limitu 100 B z docs/ASO). */
export const wierszeWersji = locs => locs.map(l => ({ locale: pole(l.attributes, 'locale'), keywords: pole(l.attributes, 'keywords'), keywords_bytes: Buffer.byteLength(pole(l.attributes, 'keywords'), 'utf8'),
  description: pole(l.attributes, 'description'), promotionalText: pole(l.attributes, 'promotionalText'), whatsNew: pole(l.attributes, 'whatsNew') })).sort((a, b) => a.locale.localeCompare(b.locale));
export const wierszeInfo = locs => locs.map(l => ({ locale: pole(l.attributes, 'locale'), name: pole(l.attributes, 'name'), subtitle: pole(l.attributes, 'subtitle') })).sort((a, b) => a.locale.localeCompare(b.locale));
/** Dostępność terytoriów: lista kodów (id zasobów appAvailabilityV2 → territoryAvailabilities); formę odpowiedzi sprawdza test na atrapie. */
export const dostepnosc = (availability, territories) => ({
  dostepna_w_nowych_terytoriach: availability?.attributes?.availableInNewTerritories ?? null,
  terytoria: territories.map(t => ({ id: t.relationships?.territory?.data?.id ?? t.id, dostepna: t.attributes?.available ?? null })).sort((a, b) => String(a.id).localeCompare(String(b.id))),
});

/** Główny przebieg (tylko GET). Zwraca { code, wynik }. Kod 1: brak aplikacji/wersji w sprzedaży albo błąd API. */
export async function run({ client, out, log = console.log }) {
  const c = readOnlyClient(client);
  try {
    const apps = await c.list('/v1/apps?filter[bundleId]=' + BUNDLE_ID);
    if (apps.length !== 1) { log(`BŁĄD: aplikacja ${BUNDLE_ID}: znaleziono ${apps.length}`); return { code: 1 }; }
    const appId = apps[0].id;
    const wersje = await c.list(`/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS`);
    const wersja = wersjaNaZywo(wersje);
    if (!wersja) { log(`Brak wersji w stanie ${STAN_WERSJI_NA_ZYWO}. Stany: ${wersje.map(v => String(stan(v)).replace(/[^A-Z_]/g, '')).join(', ') || 'brak wersji'}.`); return { code: 1 }; }
    const locsWersji = await c.list(`/v1/appStoreVersions/${wersja.id}/appStoreVersionLocalizations`);
    const infos = await c.list(`/v1/apps/${appId}/appInfos`);
    const { info, zakladany } = infoNaZywo(infos);
    const locsInfo = info ? await c.list(`/v1/appInfos/${info.id}/appInfoLocalizations`) : [];
    let dost = null;
    try {
      const av = await c.call('GET', `/v1/apps/${appId}/appAvailabilityV2`);
      const avId = av?.data?.id;
      const teryt = avId ? await c.list(`/v2/appAvailabilities/${avId}/territoryAvailabilities?include=territory`) : [];
      dost = dostepnosc(av?.data, teryt);
    } catch (e) { log(`Dostępność terytoriów: niedostępna (${String(e.message).slice(0, 80)})`); }
    const wynik = { wersja: String(wersja.attributes?.versionString ?? ''), stan_wersji: stan(wersja), info_zakladany: zakladany, wersja_lokalizacje: wierszeWersji(locsWersji), info_lokalizacje: wierszeInfo(locsInfo), dostepnosc: dost };
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, 'metadane-na-zywo.json'), JSON.stringify(wynik, null, 2) + '\n');
    log(`Wersja w sprzedaży: ${wynik.stan_wersji}; lokalizacji wersji: ${wynik.wersja_lokalizacje.length}; lokalizacji informacji: ${wynik.info_lokalizacje.length}; terytoriów: ${dost ? dost.terytoria.length : 'brak danych'}${zakladany ? '; appInfo założony (stan niepewny)' : ''}`);
    return { code: 0, wynik };
  } catch (e) { log(`BŁĄD: ${String(e.message).slice(0, 200)}`); return { code: 1 }; }
}

async function main() {
  const arg = process.argv.slice(2);
  const i = arg.indexOf('--out');
  const out = i >= 0 ? arg[i + 1] : null;
  const { ASC_KEY_ID: keyId, ASC_ISSUER_ID: issuerId, ASC_KEY_PATH: keyPath } = process.env;
  if (!out || !keyId || !issuerId || !keyPath) { console.error('Użycie: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH oraz --out <katalog>.'); process.exit(2); }
  const token = () => makeJwt({ keyId, issuerId, keyPem: readFileSync(keyPath, 'utf8') });
  const { code } = await run({ client: makeClient({ token }), out });
  process.exit(code);
}
if (jestGlowny(import.meta.url)) main().catch(e => { console.error(`Błąd: ${String(e.message).slice(0, 200)}`); process.exit(1); });
