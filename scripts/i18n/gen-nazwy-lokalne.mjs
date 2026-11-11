#!/usr/bin/env node
// Nazwy lokalne ćwiczeń (ZB-044, W-03, decyzja koordynatora KO-044 B 11.11.2026; decyzje właściciela 07.11 i 08.11.2026 w docs/18):
// źródło docs/lokalizacja/nazwy-lokalne.json → lib/nazwy-lokalne.ts. Do aplikacji trafia język TYLKO z recenzją o wyniku „zatwierdzone”
// (pole recenzji: kto, kiedy, plik zapisu; autor przekładu ≠ recenzent — L-047). Generowane z danych, nie przepisywane ręcznie (wzór: gen.mjs --check).
// Uruchom: node scripts/i18n/gen-nazwy-lokalne.mjs --write | --check (kod wyjścia 1 = plik nieaktualny albo dane błędne)
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const ZRODLO = 'docs/lokalizacja/nazwy-lokalne.json';
export const CEL = 'lib/nazwy-lokalne.ts';
/** Najdłuższa nazwa lokalna (znaki) — podpis pod tytułem karty (docs/32 wzorzec 34); dłuższa = błąd danych. */
export const MAX_ZNAKOW = 60;

export const nazwyEnKatalogu = (root) => Object.fromEntries([...readFileSync(join(root, 'lib/nazwy-en.generated.ts'), 'utf8').matchAll(/^\s*"((?:[^"\\]|\\.)+)": "((?:[^"\\]|\\.)+)"/gm)].map((m) => [JSON.parse(`"${m[1]}"`), JSON.parse(`"${m[2]}"`)]));
/** Klucze katalogu (lib/catalog.generated.ts) — nazwa lokalna wiąże się z kluczem katalogu (exLocal: libKey ?? name); NAME_EN ma też dawne nazwy wyświetlane (LIB_DISPLAY_NAME), które kluczami nie są. */
const kluczeKatalogu = (root) => { const kat = readFileSync(join(root, 'lib/catalog.generated.ts'), 'utf8'); return Object.keys(nazwyEnKatalogu(root)).filter((k) => kat.includes(JSON.stringify(k))); };

/** Błędy danych: klucz spoza katalogu, pusta albo za długa nazwa, recenzja „zatwierdzone” bez recenzenta/daty/pliku albo recenzent = autor. */
export function bledy(dane, katalog) {
  const b = [], kat = new Set(katalog);
  for (const [k, m] of Object.entries(dane.nazwy ?? {})) {
    if (!kat.has(k)) b.push(`klucz spoza katalogu: ${k}`);
    for (const [l, v] of Object.entries(m)) {
      if (!(l in (dane.jezyki ?? {}))) b.push(`${k}: język ${l} bez wpisu w „jezyki”`);
      if (typeof v !== 'string' || !v.trim()) b.push(`${k}/${l}: pusta nazwa`);
      else if ([...v].length > MAX_ZNAKOW) b.push(`${k}/${l}: ${[...v].length} znaków > ${MAX_ZNAKOW}`);
    }
  }
  for (const [l, j] of Object.entries(dane.jezyki ?? {})) {
    const r = j.recenzja;
    if (r?.wynik === 'zatwierdzone') {
      for (const pole of ['recenzent', 'data', 'plik']) if (!r[pole]) b.push(`${l}: recenzja „zatwierdzone” bez pola ${pole}`);
      if (r.recenzent && r.recenzent === j.autor) b.push(`${l}: recenzent = autor (${r.recenzent}) — L-047`);
    }
  }
  return b;
}

export function generuj(dane) {
  const zatw = Object.entries(dane.jezyki ?? {}).filter(([, j]) => j.recenzja?.wynik === 'zatwierdzone').map(([l]) => l).sort();
  const mapa = {};
  for (const l of zatw) {
    const m = {};
    for (const [k, n] of Object.entries(dane.nazwy ?? {})) if (typeof n[l] === 'string' && n[l].trim()) m[k] = n[l].trim();
    mapa[l] = m;
  }
  const rec = Object.fromEntries(zatw.map((l) => { const r = dane.jezyki[l].recenzja; return [l, { autor: dane.jezyki[l].autor, recenzent: r.recenzent, data: r.data, plik: r.plik }]; }));
  return `/* AUTOMATYCZNIE WYGENEROWANE przez scripts/i18n/gen-nazwy-lokalne.mjs z ${ZRODLO} — nie edytować ręcznie.
 * Nazwy lokalne ćwiczeń biblioteki (ZB-044, decyzja właściciela 07.11.2026 i 08.11.2026): klucz katalogu → nazwa w języku interfejsu, pokazywana TYLKO na karcie
 * ćwiczenia pod nazwą angielską (wariant A „Podpis”) i używana w wyszukiwaniu. Źródło: wyłącznie lista nazw PO RECENZJI — język trafia tu dopiero z recenzją
 * „zatwierdzone” (NAZWY_LOKALNE_RECENZJA: autor ≠ recenzent, data, plik zapisu). Język bez recenzji: karta pokazuje samą nazwę angielską. */
export const NAZWY_LOKALNE: Readonly<Record<string, Readonly<Record<string, string>>>> = ${JSON.stringify(mapa, null, 1)};

/** Pole recenzji każdego języka w NAZWY_LOKALNE (KO-044 B, W-03 11.11.2026). */
export const NAZWY_LOKALNE_RECENZJA: Readonly<Record<string, { autor: string; recenzent: string; data: string; plik: string }>> = ${JSON.stringify(rec, null, 1)};
`;
}

/** Zestaw do przekładu API (scripts/i18n/przeklad-api.mjs) z polskich nazw: rodzaj „nazwa” (nie wchodzi do PENDING testów UI), pole „katalog” (nie „id” —
 * „id” oznacza zestaw wskazówek), kontekst pozycji = czym jest tekst. */
export const KONTEKST_NAZWY = 'NAZWA ĆWICZENIA (karta, wyszukiwanie): jak mówią na siłowni w tym języku; sprzęt zachowaj';
export function zestawNazw(dane, nazwyEn) {
  return { _opis: 'W-03 (11.11.2026, ZB-044, KO-044 B): nazwy lokalne ćwiczeń do przekładu na 33 języki z polskich nazw (docs/lokalizacja/nazwy-lokalne.json). Rodzaj „nazwa”: poza listą PENDING testów interfejsu; nałożenie: node scripts/i18n/gen-nazwy-lokalne.mjs --z-raportu <katalog raportu>, potem recenzja.', data: '2026-11-11',
    klucze: Object.entries(dane.nazwy).filter(([, n]) => n.pl).map(([k, n]) => ({ rodzaj: 'nazwa', katalog: k, pl: n.pl, en: nazwyEn[k], kontekst: KONTEKST_NAZWY })) };
}
/** Nakłada propozycje raportu przekładu (<katalog>/<język>.json: { jezyk, model, propozycje: { pl → nazwa } }) na dane; autor języka = model API. */
export function zRaportu(dane, raporty, data) {
  const poPl = new Map(); for (const [k, n] of Object.entries(dane.nazwy)) if (n.pl) { if (poPl.has(n.pl)) throw new Error(`polska nazwa nieunikalna: ${n.pl}`); poPl.set(n.pl, k); }
  const wynik = { jezykow: 0, nazw: 0, pominiete: [] };
  for (const r of raporty) {
    if (typeof r.jezyk !== 'string' || r.jezyk === 'pl' || r.jezyk === 'en') { wynik.pominiete.push(`raport bez języka docelowego`); continue; }
    dane.jezyki[r.jezyk] = { autor: `przekład API (${r.model ?? 'model nieznany'}, ${data})`, recenzja: null }; wynik.jezykow++;
    for (const [pl, v] of Object.entries(r.propozycje ?? {})) { const k = poPl.get(pl); if (!k || typeof v !== 'string' || !v.trim()) { wynik.pominiete.push(`${r.jezyk}: ${pl}`); continue; } dane.nazwy[k][r.jezyk] = v.trim(); wynik.nazw++; }
  }
  return wynik;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const tryb = process.argv[2];
  if (tryb === '--zestaw') { const d = JSON.parse(readFileSync(join(ROOT, ZRODLO), 'utf8')); writeFileSync(process.argv[3], JSON.stringify(zestawNazw(d, nazwyEnKatalogu(ROOT)), null, 1) + '\n'); console.log(`zapisano ${process.argv[3]}`); process.exit(0); }
  if (tryb === '--z-raportu') {
    const kat = process.argv[3], d = JSON.parse(readFileSync(join(ROOT, ZRODLO), 'utf8'));
    const raporty = readdirSync(kat).filter((f) => /^[a-z]{2}(-[A-Za-z0-9]+)?\.json$/.test(f)).map((f) => JSON.parse(readFileSync(join(kat, f), 'utf8')));
    const w = zRaportu(d, raporty, new Date().toISOString().slice(0, 10)); writeFileSync(join(ROOT, ZRODLO), JSON.stringify(d, null, 1) + '\n');
    console.log(`nałożono ${w.nazw} nazw w ${w.jezykow} językach; pominięte: ${w.pominiete.length}`); for (const p of w.pominiete) console.log('POMINIĘTE', p); process.exit(w.pominiete.length ? 1 : 0);
  }
  const dane = JSON.parse(readFileSync(join(ROOT, ZRODLO), 'utf8'));
  const b = bledy(dane, kluczeKatalogu(ROOT));
  if (b.length) { for (const x of b) console.log('BŁĄD', x); process.exit(1); }
  const tekst = generuj(dane), cel = join(ROOT, CEL);
  if (tryb === '--write') { writeFileSync(cel, tekst); console.log(`zapisano ${CEL}`); }
  else if (tryb === '--check') { if (!existsSync(cel) || readFileSync(cel, 'utf8') !== tekst) { console.log(`${CEL} nieaktualny — node scripts/i18n/gen-nazwy-lokalne.mjs --write`); process.exit(1); } console.log(`${CEL} aktualny`); }
  else { console.log('Użycie: --write | --check'); process.exit(2); }
}
