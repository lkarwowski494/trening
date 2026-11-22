// App Analytics z App Store Connect API (KO-100, KO-106): pobiera raporty „App Store Discovery and Engagement” i „App Store Downloads” (wariant Standard)
// i zapisuje znormalizowane, dzienne CSV (data × terytorium × źródło) do katalogu --out.
//   node scripts/asc/analityka.mjs --out <katalog> [--zapisz-zadanie]
// TRYB DOMYŚLNY: TYLKO ODCZYT (GET). Jedyny zapis: `--zapisz-zadanie` → jedno żądanie ONGOING dla aplikacji, gdy żadne ONGOING nie istnieje
// (zgoda właściciela 22.11.2026, KO-106; L-001: GET najpierw, POST tylko przy braku, sprawdzenie stanu w tym samym przebiegu). Drugiego zapisu nie ma:
// żądanie zatrzymane (stoppedDueToInactivity) kończy przebieg kodem 1 bez automatycznego tworzenia nowego.
// PRYWATNOŚĆ (repo publiczne, CLAUDE.md): liczby i identyfikatory NIGDY w logu; w logu tylko liczba plików i wierszy, stany żądania i nazwy raportów Apple.
// Dane trafiają wyłącznie do katalogu --out, który w produkcji jest kopią PRYWATNEGO repo właściciela (docs/wydanie/asc-analityka-kroki-wlasciciela.md).
// Źródła: developer.apple.com/documentation/appstoreconnectapi/downloading-analytics-reports, …/analytics-reports/app-store-discovery-and-engagement, …/app-download
// i …/analytics-reports/data-completeness-corrections (najnowsza instancja z późniejszym processingDate zastępuje wcześniejszą — rekordów tej samej daty nie łączymy).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { makeClient, makeJwt, BUNDLE_ID } from './iap-localizations.mjs';
import { jestGlowny } from '../modul-glowny.mjs';

/** Raporty do pobrania: dopasowanie po polu `name` (Apple nie dokumentuje pełnych nazw — wariant Standard wybieramy po słowie „Standard”,
 *  a gdy go brak, bierzemy jedyny pasujący; nazwy wybranych raportów trafiają do logu, bo to metadane Apple, nie dane konta). */
export const RAPORTY = [
  { klucz: 'discovery', plik: 'discovery.csv', kategoria: 'APP_STORE_ENGAGEMENT', nazwa: /discovery and engagement/i,
    klucze: ['date', 'territory', 'source_type', 'page_type', 'event', 'engagement_type'], wartosci: ['counts', 'unique_counts'],
    // Apple: „Unique Counts” = unikalni użytkownicy w wierszu (wymiary Device i Platform Version); po zsumowaniu wierszy urządzeń to NIE jest liczba unikalnych osób (08-programista-004)
    nazwyWyniku: { unique_counts: 'unique_counts_suma_urzadzen' } },
  { klucz: 'pobrania', plik: 'pobrania.csv', kategoria: 'COMMERCE', nazwa: /downloads/i,
    klucze: ['date', 'territory', 'source_type', 'page_type', 'download_type'], wartosci: ['counts'] },
  // KO-121 (d), Droga 1: raporty kategorii COMMERCE w tym samym żądaniu ONGOING (bez numeru dostawcy). Dane z szumem Apple (szacunki do trendów).
  // „Paying Users” celowo POMINIĘTE: Apple — „This metric is not summable across rows” (agregacja po urządzeniach dałaby błędną liczbę).
  { klucz: 'zakupy', plik: 'zakupy.csv', kategoria: 'COMMERCE', nazwa: /purchases/i,
    klucze: ['date', 'territory', 'purchase_type', 'content_name', 'payment_method', 'source_type', 'page_type'], wartosci: ['purchases', 'proceeds_in_usd', 'sales_in_usd'] },
  { klucz: 'subskrypcje_stan', plik: 'subskrypcje-stan.csv', kategoria: 'COMMERCE', nazwa: /subscription state/i,
    klucze: ['date', 'territory', 'state_metric', 'subscription_name', 'subscription_duration', 'billing_frequency', 'offer_type', 'auto_renew_status', 'cancellation_reason'], wartosci: ['counts'] },
  { klucz: 'subskrypcje_zdarzenia', plik: 'subskrypcje-zdarzenia.csv', kategoria: 'COMMERCE', nazwa: /subscription event/i, kolumnaDaty: 'event_date',
    klucze: ['date', 'territory', 'event_sub_type', 'event_grouping', 'subscription_name', 'subscription_duration', 'offer_type', 'cancellation_reason', 'app_download_source_type'], wartosci: ['counts'] },
];

/** Nazwa kolumny wartości w wyniku (agregat) — domyślnie jak w raporcie Apple. */
export const nazwaWyniku = (def, k) => def.nazwyWyniku?.[k] ?? k;

export const ZADANIE = { accessType: 'ONGOING' };

/** Plan dla żądań raportów aplikacji: 'brak' (wolno utworzyć), 'jest' (ONGOING aktywne), 'zatrzymane' (ONGOING, ale stoppedDueToInactivity — nie tworzymy nowego). */
export function planZadania(requests) {
  const ongoing = requests.filter(r => r.attributes?.accessType === 'ONGOING');
  if (!ongoing.length) return 'brak';
  return ongoing.some(r => r.attributes?.stoppedDueToInactivity !== true) ? 'jest' : 'zatrzymane';
}
export const aktywneZadanie = requests => requests.find(r => r.attributes?.accessType === 'ONGOING' && r.attributes?.stoppedDueToInactivity !== true) ?? null;

/** Treść żądania POST /v1/analyticsReportRequests (AnalyticsReportRequestCreateRequest: attributes.accessType + relationships.app.data). */
export const tresciZadania = appId => ({ data: { type: 'analyticsReportRequests', attributes: { ...ZADANIE }, relationships: { app: { data: { type: 'apps', id: appId } } } } });

/** Wybór raportów według `RAPORTY`: preferuje „Standard”, odrzuca „Detailed”, gdy jest Standard. */
export function wybierzRaport(reports, def) {
  const pasuje = reports.filter(r => (r.attributes?.category ?? def.kategoria) === def.kategoria && def.nazwa.test(r.attributes?.name ?? ''));
  const standard = pasuje.filter(r => /standard/i.test(r.attributes?.name ?? ''));
  if (standard.length) return standard[0];
  const nieDetailed = pasuje.filter(r => !/detailed/i.test(r.attributes?.name ?? ''));
  return nieDetailed[0] ?? null;
}

/** Tekst segmentu (po ewentualnym gunzip) → wiersze obiektów; kolumny po nazwach (Apple: pozycje kolumn mogą się zmienić), separator tab albo przecinek. */
export function parsujSegment(bufor) {
  const surowy = Buffer.isBuffer(bufor) ? bufor : Buffer.from(bufor);
  const tekst = (surowy[0] === 0x1f && surowy[1] === 0x8b ? gunzipSync(surowy) : surowy).toString('utf8').replace(/^﻿/, '');
  const linie = tekst.split(/\r?\n/).filter(l => l.trim() !== '');
  if (!linie.length) return [];
  const sep = linie[0].includes('\t') ? '\t' : ',';
  const nazwa = s => s.trim().replace(/^"|"$/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const naglowek = linie[0].split(sep).map(nazwa);
  return linie.slice(1).map(l => { const k = l.split(sep); const o = {}; naglowek.forEach((n, i) => { o[n] = (k[i] ?? '').trim().replace(/^"|"$/g, ''); }); return o; });
}

/** Suma po wymiarach z def.klucze (Device, Platform Version itd. są pomijane — sumujemy); puste i nienumeryczne wartości liczymy jako 0.
 *  Uwaga: unique_counts sumowane po urządzeniach może zawyżać liczbę unikalnych użytkowników korzystających z kilku urządzeń. */
export function agreguj(wiersze, def) {
  const mapa = new Map();
  for (const w of wiersze) {
    const klucz = def.klucze.map(k => w[k] ?? '');
    if (!klucz[0]) continue;
    const id = JSON.stringify(klucz);
    const poz = mapa.get(id) ?? { klucz, suma: def.wartosci.map(() => 0) };
    def.wartosci.forEach((k, i) => { const n = Number(w[k]); if (Number.isFinite(n)) poz.suma[i] = Math.round((poz.suma[i] + n) * 1e6) / 1e6; });
    mapa.set(id, poz);
  }
  return [...mapa.values()].map(p => Object.fromEntries([...def.klucze.map((k, i) => [k, p.klucz[i]]), ...def.wartosci.map((k, i) => [nazwaWyniku(def, k), p.suma[i]])]));
}

/** Z listy {processingDate, wiersze} zostaw dla każdej daty (kolumna `date`) wiersze z instancji o najpóźniejszym processingDate (docs: „Use the latest instance”). */
export function najnowszePoDacie(instancje) {
  const wybrane = new Map();
  for (const ins of instancje) {
    const daty = new Set(ins.wiersze.map(w => w.date).filter(Boolean));
    for (const d of daty) { const jest = wybrane.get(d); if (!jest || ins.processingDate > jest.processingDate) wybrane.set(d, { processingDate: ins.processingDate, instancje: [ins] }); else if (ins.processingDate === jest.processingDate && !jest.instancje.includes(ins)) jest.instancje.push(ins); }
  }
  const out = [];
  for (const [d, w] of wybrane) for (const ins of w.instancje) out.push(...ins.wiersze.filter(r => r.date === d));
  return out;
}

const esc = v => { const s = String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
export const doCsv = (wiersze, kolumny) => [kolumny.join(','), ...[...wiersze].sort((a, b) => kolumny.map(k => String(a[k]).localeCompare(String(b[k]))).find(x => x) ?? 0).map(w => kolumny.map(k => esc(w[k])).join(','))].join('\n') + '\n';

/** Wczytuje wcześniejszy CSV (nasz format) do wierszy; liczby wracają jako liczby. */
export function zCsv(tekst, def) {
  const linie = String(tekst ?? '').split(/\r?\n/).filter(Boolean);
  if (linie.length < 2) return [];
  const naglowek = linie[0].split(',');
  return linie.slice(1).map(l => {
    const pola = []; let cur = '', q = false;
    for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; } else if (c === '"') q = true; else if (c === ',') { pola.push(cur); cur = ''; } else cur += c; }
    pola.push(cur);
    const o = {}; naglowek.forEach((n, i) => { o[n] = def.wartosci.some(k => nazwaWyniku(def, k) === n) ? Number(pola[i]) : pola[i] ?? ''; }); return o;
  });
}

/** Scalenie: daty obecne w nowych wierszach zastępują wszystkie stare wiersze tych dat; starsze daty zostają (instancje Apple żyją 35 dni). */
export function scal(stare, nowe) {
  const daty = new Set(nowe.map(w => w.date));
  return [...stare.filter(w => !daty.has(w.date)), ...nowe];
}

const pobierzSegment = async (fetchFn, seg) => {
  const res = await fetchFn(seg.attributes.url); // adres podpisany przez Apple, ważny 5 minut; BEZ nagłówka Authorization (inny host)
  if (!res.ok) throw new Error(`pobranie segmentu → ${res.status}`);
  const bufor = Buffer.from(await res.arrayBuffer());
  const suma = seg.attributes.checksum;
  if (suma && createHash('md5').update(bufor).digest('hex') !== String(suma).toLowerCase()) throw new Error('suma kontrolna segmentu niezgodna');
  return bufor;
};

/** Główny przebieg. `zapiszZadanie` włącza jedyny zapis. Zwraca { code, stan }. Kody: 0 OK, 1 błąd albo żądanie zatrzymane, 3 brak żądania (tryb tylko-odczyt) albo brak instancji. */
export async function run({ client, fetchFn = fetch, out, zapiszZadanie = false, log = console.log, dzis = new Date().toISOString().slice(0, 10) }) {
  const stan = { data_przebiegu: dzis, zadanie: null, raporty: {}, wiersze: {} };
  try {
    const apps = await client.list('/v1/apps?filter[bundleId]=' + BUNDLE_ID);
    if (apps.length !== 1) { log(`BŁĄD: aplikacja ${BUNDLE_ID}: znaleziono ${apps.length}`); return { code: 1, stan }; }
    const appId = apps[0].id;
    let zadania = await client.list(`/v1/apps/${appId}/analyticsReportRequests`);
    let plan = planZadania(zadania);
    log(`Żądania raportów: ${zadania.length}; ONGOING: ${plan === 'brak' ? 'brak' : plan === 'jest' ? 'aktywne' : 'ZATRZYMANE (stoppedDueToInactivity)'}`);
    if (plan === 'brak' && zapiszZadanie) {
      await client.call('POST', '/v1/analyticsReportRequests', tresciZadania(appId));
      zadania = await client.list(`/v1/apps/${appId}/analyticsReportRequests`); // sprawdzenie w usłudze w tym samym przebiegu
      plan = planZadania(zadania);
      log(`Utworzono żądanie ONGOING; sprawdzenie w usłudze: ${plan === 'jest' ? 'aktywne' : plan === 'brak' ? 'NIE WIDAĆ żądania' : 'zatrzymane'}`);
      if (plan !== 'jest') return { code: 1, stan: { ...stan, zadanie: plan } };
      log('Pierwsze dane Apple udostępnia po 1–2 dniach od żądania; ponów odczyt później.');
      return { code: 0, stan: { ...stan, zadanie: plan, utworzono: true } };
    }
    stan.zadanie = plan;
    if (plan === 'brak') { log('Brak żądania ONGOING (tryb tylko-odczyt). Uruchom z --zapisz-zadanie po zgodzie właściciela.'); return { code: 3, stan }; }
    if (plan === 'zatrzymane') { log('Żądanie ONGOING zatrzymane z powodu braku odczytów. Nowe żądanie wymaga zgody właściciela (drugi zapis) — nie tworzę go automatycznie.'); return { code: 1, stan }; }
    const zadanie = aktywneZadanie(zadania);
    const raporty = await client.list(`/v1/analyticsReportRequests/${zadanie.id}/reports`);
    let razem = 0;
    for (const def of RAPORTY) {
      const raport = wybierzRaport(raporty, def);
      if (!raport) { log(`Raport „${def.klucz}”: jeszcze niedostępny (Apple generuje pierwsze raporty po 1–2 dniach).`); stan.raporty[def.klucz] = null; continue; }
      stan.raporty[def.klucz] = raport.attributes?.name ?? null;
      log(`Raport „${def.klucz}”: ${raport.attributes?.name ?? '?'}`);
      const instancje = await client.list(`/v1/analyticsReports/${raport.id}/instances?filter[granularity]=DAILY`);
      const wczytane = [];
      for (const ins of instancje) {
        const segmenty = await client.list(`/v1/analyticsReportInstances/${ins.id}/segments`);
        const wiersze = [];
        for (const seg of segmenty) wiersze.push(...parsujSegment(await pobierzSegment(fetchFn, seg)).map(w => (def.kolumnaDaty ? { ...w, date: w[def.kolumnaDaty] } : w)));
        wczytane.push({ processingDate: ins.attributes?.processingDate ?? '', wiersze });
      }
      const nowe = agreguj(najnowszePoDacie(wczytane), def);
      if (!nowe.length) { log(`Raport „${def.klucz}”: brak wierszy w instancjach.`); stan.wiersze[def.klucz] = 0; continue; }
      mkdirSync(out, { recursive: true });
      const sciezka = join(out, def.plik);
      const kolumny = [...def.klucze, ...def.wartosci.map(k => nazwaWyniku(def, k))];
      const wynik = scal(existsSync(sciezka) ? zCsv(readFileSync(sciezka, 'utf8'), def) : [], nowe);
      writeFileSync(sciezka, doCsv(wynik, kolumny));
      stan.wiersze[def.klucz] = wynik.length; razem += wynik.length;
      log(`Zapisano ${def.plik}: ${wynik.length} wierszy`);
    }
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, 'stan.json'), JSON.stringify(stan, null, 2) + '\n');
    return { code: razem ? 0 : 3, stan };
  } catch (e) { log(`BŁĄD: ${String(e.message).slice(0, 200)}`); return { code: 1, stan }; }
}

async function main() {
  const arg = process.argv.slice(2);
  const iOut = arg.indexOf('--out');
  const out = iOut >= 0 ? arg[iOut + 1] : null;
  const { ASC_KEY_ID: keyId, ASC_ISSUER_ID: issuerId, ASC_KEY_PATH: keyPath } = process.env;
  if (!out || !keyId || !issuerId || !keyPath) { console.error('Użycie: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH oraz --out <katalog> [--zapisz-zadanie].'); process.exit(2); }
  const token = () => makeJwt({ keyId, issuerId, keyPem: readFileSync(keyPath, 'utf8') });
  const client = makeClient({ token });
  const { code } = await run({ client, out, zapiszZadanie: arg.includes('--zapisz-zadanie') });
  process.exit(code);
}
if (jestGlowny(import.meta.url)) main().catch(e => { console.error(`Błąd: ${String(e.message).slice(0, 200)}`); process.exit(1); });
