// Wgranie zrzutów ekranu do App Store Connect przez API (decyzja właściciela 25.10.2026, D2 w docs/48): z artefaktu `sklep-zrzuty-ramki` (iPhone)
// i `zegarek-zrzuty` (Apple Watch) do edytowalnej wersji aplikacji, dla wszystkich lokalizacji.
//   node scripts/asc/zrzuty.mjs --iphone <katalog> [--zegarek <katalog>] [--dry-run]   → plan bez zapisu (domyślnie)
//   node scripts/asc/zrzuty.mjs --iphone <katalog> [--zegarek <katalog>] --apply       → wgrywa i układa zrzuty
// Układ katalogów: <katalog>/<język aplikacji>/NN-<ekran>.png (iPhone: jeden rozmiar, np. artefakt `sklep-zrzuty-ramki/6.9`) i <katalog>/<język>/<stan>.png (zegarek).
// Interfejs: App Asset Library (Apple oznaczył appScreenshotSets i appScreenshots jako przestarzałe; odczyt dokumentacji 25.10.2026 —
// developer.apple.com/documentation/appstoreconnectapi/app-asset-library): obraz wgrywany raz (rezerwacja → PUT → `uploaded: true`), potem placement
// (APP_SCREENSHOT) na lokalizacji wersji i kolejność jednym żądaniem. Grupę urządzeń (placementGroup) wybiera skrypt z danych referencyjnych API
// (`appAssetLibraryRefData`) na podstawie dokładnych wymiarów pliku — identyfikatory nie są wpisane w kodzie (Apple: „Don’t hard-code them”).
// Zasady: NIGDY nie usuwa (klient: tylko GET, POST, PATCH; PUT tylko na adresy z rezerwacji); grupa, która ma już zrzuty, jest pomijana (zamiana zrzutów
// = ręcznie w App Store Connect); zapis tylko do edytowalnej wersji; w logu tylko kody lokalizacji, nazwy plików i liczby — nigdy adresy wgrywania,
// identyfikatory klucza, tokeny ani treść odpowiedzi API (repozytorium publiczne). Dane logowania: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeClient, makeJwt, BUNDLE_ID } from './iap-localizations.mjs';
import { EDITABLE_STATES, LOCALE_MAP, readOnlyClient } from './metadane.mjs';

export const PLACEMENT_TYPE = 'APP_SCREENSHOT';
export const ASSET_CATEGORY = 'APP_SCREENSHOTS_AND_PREVIEWS';
export const FEATURE_ID = 'APP_STORE_VERSIONS';
/** Limit Apple na grupę, gdy dane referencyjne go nie podają (strona „Discovering asset specifications”: 10 zrzutów na grupę). */
export const DEFAULT_MAX_PER_GROUP = 10;
/** Język aplikacji (katalog w artefakcie zrzutów) → kody lokalizacji repo/ASC (klucze LOCALE_MAP). Pusta lista = sklep nie ma tej lokalizacji (docs/45-widocznosc). */
export const SHOT_LOCALES = {
  pl: ['pl'], en: ['en-US', 'en-GB', 'en-AU', 'en-CA'], cs: ['cs'], sk: ['sk'], hu: ['hu'], ro: ['ro'], bg: [], hr: ['hr'], sl: [], sr: [], lt: [], lv: [], et: [],
  uk: ['uk'], es: ['es-ES'], 'es-419': ['es-MX'], pt: ['pt-PT'], 'pt-BR': ['pt-BR'], de: ['de-DE'], fr: ['fr-FR'], it: ['it'], nl: ['nl-NL'], sv: ['sv'], da: ['da'],
  nb: ['no'], fi: ['fi'], tr: ['tr'], el: ['el'], id: ['id'], ms: ['ms'], vi: ['vi'], ru: ['ru'], ja: ['ja'], ko: ['ko'], 'zh-Hant': ['zh-Hant'],
};

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
/** Wymiary i kanał alfa z nagłówka PNG (IHDR). Inny format → błąd (zrzuty z naszych workflowów są PNG). */
export function pngInfo(buf) {
  if (buf.length < 26 || !buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('to nie jest plik PNG');
  const colorType = buf[25];
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), alpha: colorType === 4 || colorType === 6 };
}

/** Grupy urządzeń, do których pasuje plik o danych wymiarach: wymiary → specyfikacje obrazu (bez alfa) → grupy z `specMappings` typu APP_SCREENSHOT. */
export function groupsFor({ refData, width, height }) {
  const specs = (refData.imageSpecs ?? []).filter(s => s.alphaAllowed === false && s.dimensions && s.dimensions.minWidth <= width && width <= s.dimensions.maxWidth
    && s.dimensions.minHeight <= height && height <= s.dimensions.maxHeight && (s.compatiblePlacementTypes ?? [PLACEMENT_TYPE]).includes(PLACEMENT_TYPE)).map(s => s.specId);
  const type = (refData.placementTypes ?? []).find(t => t.placementTypeId === PLACEMENT_TYPE);
  const groups = (type?.specMappings ?? []).filter(m => (m.specs ?? []).some(id => specs.includes(id))).map(m => m.placementGroupId);
  return [...new Set(groups)];
}

/** Limit zrzutów na grupę z danych referencyjnych (feature APP_STORE_VERSIONS, polityka APP_SCREENSHOT); brak danych → 10. */
export function maxPerGroup(refData, group) {
  for (const f of refData.features ?? []) {
    if ((f.featureId ?? f.feature ?? f.id) !== FEATURE_ID) continue;
    for (const p of f.placementPolicies ?? []) {
      if ((p.placementTypeId ?? p.placementType) !== PLACEMENT_TYPE) continue;
      for (const g of p.groupLimits ?? []) if ((g.groupIds ?? []).includes(group) && Number.isInteger(g.maxCount)) return g.maxCount;
    }
  }
  return DEFAULT_MAX_PER_GROUP;
}

/** Wczytuje katalog <język>/*.png → Map(język → [{ name, path, size, width, height, alpha }]) posortowane po nazwie; błędy plików osobno. */
export function readShots(dir, fs = { readdirSync, readFileSync, statSync, existsSync }) {
  const out = new Map(); const problems = [];
  if (!dir || !fs.existsSync(dir)) return { shots: out, problems: dir ? [`brak katalogu ${dir}`] : [] };
  for (const lang of fs.readdirSync(dir).filter(n => !n.startsWith('.')).sort()) {
    const p = join(dir, lang); if (!fs.statSync(p).isDirectory()) continue;
    const list = [];
    for (const f of fs.readdirSync(p).filter(n => /\.png$/i.test(n)).sort()) {
      try { const buf = fs.readFileSync(join(p, f)); list.push({ name: f, path: join(p, f), size: buf.length, ...pngInfo(buf) }); }
      catch (e) { problems.push(`${lang}/${f}: ${e.message}`); }
    }
    if (list.length) out.set(lang, list);
  }
  return { shots: out, problems };
}

const stateOf = r => r.attributes?.appStoreState ?? r.attributes?.appVersionState ?? '';
/** Aplikacja, edytowalna wersja iOS i jej lokalizacje (tylko GET). */
export async function discover(client) {
  const apps = await client.list('/v1/apps?filter[bundleId]=' + BUNDLE_ID);
  if (apps.length !== 1) throw new Error(`aplikacja ${BUNDLE_ID}: znaleziono ${apps.length}`);
  const appId = apps[0].id;
  const versions = await client.list(`/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS`);
  const version = versions.find(v => EDITABLE_STATES.has(stateOf(v))) ?? null;
  const locs = version ? new Map((await client.list(`/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations`)).map(r => [r.attributes.locale, r.id])) : new Map();
  const lib = await client.call('GET', `/v1/apps/${appId}/assetLibrary`);
  const refRes = await client.call('GET', '/v1/appAssetLibraryRefData');
  const refData = refRes?.data?.[0]?.attributes ?? refRes?.data?.attributes ?? {};
  return { appId, version, locs, libraryId: lib?.data?.id ?? null, refData, versionStates: versions.map(stateOf) };
}

/**
 * Plan: lista { source, lang, locale, locId, group, files[], action, reason }. Nic nie zapisuje. `existing(locId, group)` → liczba istniejących placementów grupy.
 * Źródła: 'iphone' i 'zegarek' (obie przez ten sam typ APP_SCREENSHOT; grupa z wymiarów pliku).
 */
export async function plan({ shots, locs, refData, existing }) {
  const rows = []; const errors = [];
  for (const [source, byLang] of Object.entries(shots)) {
    for (const [lang, files] of byLang) {
      if (!(lang in SHOT_LOCALES)) { errors.push(`${source}/${lang}: nieznany język aplikacji (brak w SHOT_LOCALES)`); continue; }
      const locales = SHOT_LOCALES[lang];
      if (!locales.length) { rows.push({ source, lang, locale: null, action: 'pomiń', reason: 'sklep nie ma tej lokalizacji (docs/45-widocznosc)' }); continue; }
      const byGroup = new Map();
      for (const f of files) {
        if (f.alpha) { errors.push(`${source}/${lang}/${f.name}: kanał alfa (Apple: obrazy bez alfa)`); continue; }
        const g = groupsFor({ refData, width: f.width, height: f.height });
        if (g.length !== 1) { errors.push(`${source}/${lang}/${f.name}: ${f.width}×${f.height} — ${g.length ? 'niejednoznaczna grupa urządzeń (' + g.join(', ') + ')' : 'brak pasującej specyfikacji w danych Apple'}`); continue; }
        if (!byGroup.has(g[0])) byGroup.set(g[0], []); byGroup.get(g[0]).push(f);
      }
      for (const [group, gf] of byGroup) {
        const max = maxPerGroup(refData, group);
        if (gf.length > max) { errors.push(`${source}/${lang}: ${gf.length} zrzutów w grupie ${group} > limit ${max}`); continue; }
        for (const locale of locales) {
          if (!LOCALE_MAP[locale]) { rows.push({ source, lang, locale, group, action: 'pomiń', reason: 'lokalizacja nieobsługiwana w ASC' }); continue; }
          const locId = locs.get(LOCALE_MAP[locale]);
          if (!locId) { rows.push({ source, lang, locale, group, files: gf, action: 'pomiń', reason: 'brak lokalizacji wersji w ASC (najpierw workflow „ASC metadane sklepu”)' }); continue; }
          const have = await existing(locId, group);
          if (have > 0) { rows.push({ source, lang, locale, locId, group, files: gf, action: 'pomiń', reason: `grupa ma już ${have} zrzutów (nic nie usuwam)` }); continue; }
          rows.push({ source, lang, locale, locId, group, files: gf, action: 'wgraj', reason: '' });
        }
      }
    }
  }
  return { rows, errors };
}

export const renderTable = rows => ['| Źródło | Język | Lokalizacja | Grupa urządzeń | Zrzuty | Działanie |', '|---|---|---|---|---|---|',
  ...rows.map(r => `| ${r.source} | ${r.lang} | ${r.locale ?? '—'} | ${r.group ?? '—'} | ${r.files?.length ?? 0} | ${r.action}${r.reason ? ' — ' + r.reason : ''}${r.error ? ' (błąd)' : ''} |`)].join('\n');

/** Wgranie jednego pliku do biblioteki: rezerwacja → PUT (części) → commit → czekanie na przetworzenie. Zwraca id obrazu. */
export async function uploadImage({ client, fetchFn, libraryId, refName, file, read, sleep, polls = 30 }) {
  const body = read(file.path);
  const res = await client.call('POST', '/v1/appAssetLibraryImages', { data: { type: 'appAssetLibraryImages',
    attributes: { fileName: file.name, fileSize: body.length, category: ASSET_CATEGORY, referenceName: refName },
    relationships: { assetLibrary: { data: { type: 'appAssetLibraries', id: libraryId } } } } });
  const id = res.data.id;
  for (const op of res.data.attributes.uploadOperations ?? []) {
    const headers = Object.fromEntries((op.requestHeaders ?? []).map(h => [h.name, h.value]));
    const r = await fetchFn(op.url, { method: op.method, headers, body: body.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) throw new Error(`wgrywanie części pliku ${file.name} → ${r.status}`);
  }
  await client.call('PATCH', `/v1/appAssetLibraryImages/${id}`, { data: { type: 'appAssetLibraryImages', id, attributes: { uploaded: true } } });
  for (let i = 0; i < polls; i++) {
    const s = (await client.call('GET', `/v1/appAssetLibraryImages/${id}`)).data.attributes;
    if (s.state === 'FAILED') throw new Error(`przetwarzanie ${file.name} nie powiodło się (${String(s.stateDetails ?? 'brak szczegółów').slice(0, 120)})`);
    if (s.state && !['AWAITING_UPLOAD', 'UPLOAD_COMPLETE'].includes(s.state)) return id;
    await sleep(2000);
  }
  throw new Error(`przetwarzanie ${file.name} trwa zbyt długo`);
}

/** Główny przebieg. Zwraca { code, rows }. Kod 1: błędy planu (pliki, grupy), brak aplikacji, brak edytowalnej wersji w trybie apply, błąd zapisu. */
export async function run({ client, fetchFn, shots, problems = [], apply = false, log = console.log, read = p => readFileSync(p), sleep = ms => new Promise(r => setTimeout(r, ms)) }) {
  log(`## Zrzuty ekranu → App Store Connect: tryb ${apply ? 'APPLY' : 'DRY-RUN (tylko odczyt)'}\n`);
  let code = problems.length ? 1 : 0;
  for (const p of problems) log(`BŁĄD pliku: ${p}`);
  const c = apply ? client : readOnlyClient(client);
  let d;
  try { d = await discover(c); } catch (e) { log(`BŁĄD: ${e.message}`); return { code: 1, rows: [] }; }
  if (!d.version || !d.libraryId) {
    log(!d.version ? `### Brak edytowalnej wersji aplikacji w App Store Connect\n\nStany wersji: ${d.versionStates.join(', ') || 'brak wersji'}. Utwórz wersję 1.0 (Prepare for Submission) i uruchom ponownie.` : '### Brak biblioteki zasobów aplikacji (assetLibrary)');
    return { code: apply ? 1 : code, rows: [] };
  }
  const existing = async (locId, group) => {
    const q = `/v1/appStoreVersionLocalizations/${locId}/placements?filter[placementType]=${PLACEMENT_TYPE}&filter[placementGroup]=${group}`;
    return (await c.list(q)).length;
  };
  const { rows, errors } = await plan({ shots, locs: d.locs, refData: d.refData, existing });
  if (errors.length) { code = 1; log('### Błędy planu (zapis zablokowany)\n'); for (const e of errors) log(`- ${e}`); log(''); }
  const n = a => rows.filter(r => r.action === a).length;
  if (apply && code) { log('Zapis wstrzymany — nic nie zapisano.'); return { code: 1, rows }; }
  if (apply) {
    const cache = new Map(); /* ścieżka pliku → id obrazu w bibliotece: ten sam plik angielski służy czterem lokalizacjom */
    for (const r of rows.filter(x => x.action === 'wgraj')) {
      try {
        const ids = [];
        for (const f of r.files) {
          if (!cache.has(f.path)) cache.set(f.path, await uploadImage({ client, fetchFn, libraryId: d.libraryId, refName: `trening-1.0/${r.source}/${r.lang}/${f.name}`, file: f, read, sleep }));
          ids.push(cache.get(f.path));
        }
        const placed = [];
        for (const id of ids) {
          const p = await client.call('POST', '/v1/appAssetLibraryPlacements', { data: { type: 'appAssetLibraryPlacements', attributes: { placementType: PLACEMENT_TYPE, placementGroup: r.group },
            relationships: { image: { data: { type: 'appAssetLibraryImages', id } }, appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: r.locId } } } } });
          placed.push({ type: 'appAssetLibraryPlacements', id: p.data.id });
        }
        await client.call('POST', '/v1/appAssetLibraryPlacementOrderingRequests', { data: { type: 'appAssetLibraryPlacementOrderingRequests', attributes: { placementGroup: r.group },
          relationships: { orderedPlacements: { data: placed }, appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: r.locId } } } } });
        r.written = true;
      } catch (e) { r.error = e.message; code = 1; log(`BŁĄD ${r.source}/${r.locale}: ${e.message}`); }
    }
  }
  log(renderTable(rows));
  log(`\nwgraj ${n('wgraj')}, pomiń ${n('pomiń')}${apply ? ', zapisano ' + rows.filter(r => r.written).length : ''}`);
  if (!apply && code === 0) log('Dry-run zakończony — nic nie zapisano. Zapis: uruchom ponownie z trybem „apply” i zatwierdź środowisko release.');
  return { code, rows };
}

async function main() {
  const args = process.argv.slice(2); const apply = args.includes('--apply');
  if (apply && args.includes('--dry-run')) { console.error('Podaj tylko jeden tryb.'); process.exit(2); }
  const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : ''; };
  const { ASC_KEY_ID: keyId, ASC_ISSUER_ID: issuerId, ASC_KEY_PATH: keyPath } = process.env;
  if (!keyId || !issuerId || !keyPath) { console.error('Brak ASC_KEY_ID, ASC_ISSUER_ID lub ASC_KEY_PATH.'); process.exit(2); }
  if (!opt('--iphone')) { console.error('Podaj --iphone <katalog>.'); process.exit(2); }
  const a = readShots(opt('--iphone')); const b = readShots(opt('--zegarek'));
  const shots = { iphone: a.shots, ...(b.shots.size ? { zegarek: b.shots } : {}) };
  const token = makeJwt({ keyId, issuerId, keyPem: readFileSync(keyPath, 'utf8') });
  const { code } = await run({ client: makeClient({ token }), fetchFn: fetch, shots, problems: [...a.problems, ...b.problems], apply });
  process.exit(code);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main().catch(e => { console.error(`Błąd: ${String(e.message).slice(0, 200)}`); process.exit(1); });
