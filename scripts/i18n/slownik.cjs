// Słownik terminów treningowych (decyzja właściciela 25.10.2026): jedno źródło docs/lokalizacja/slownik-terminow.json.
// Używają go: strażnik tests/slownik-terminow.test.ts, przekład przez API (scripts/i18n/przeklad-api.mjs) i role tlumacz / recenzent-lokalizacji.
// Zasada nadrzędna: teksty mają brzmieć naturalnie, jak mówi trener albo kolega na siłowni w danym języku (nie jak podręcznik).
'use strict';
/* CommonJS, żeby ten sam moduł działał w Jest (tests/slownik-terminow.test.ts) i w skrypcie ESM (scripts/i18n/przeklad-api.mjs). */
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const ROOT = resolve(__dirname, '../..');
const PLIK_SLOWNIKA = 'docs/lokalizacja/slownik-terminow.json';
const PEWNOSCI = ['wysoka', 'srednia', 'niska'];

function wczytaj(root = ROOT) { return JSON.parse(readFileSync(resolve(root, PLIK_SLOWNIKA), 'utf8')); }
const re = (s) => new RegExp(s, 'iu');

/** Czy polski tekst zawiera pojęcie (wzorzec „wykrywaj”, bez trafień „wyklucz”). */
function wykryte(pojecie, pl) {
  if (!re(pojecie.wykrywaj).test(pl)) return false;
  return !(pojecie.wyklucz && re(pojecie.wyklucz).test(pl));
}

/** Naruszenia słownika w tłumaczeniu: [{ pojecie, wzorzec, powod }] (puste = zgodne). */
function sprawdz(slownik, kod, pl, tlumaczenie) {
  const wynik = [];
  for (const p of slownik.pojecia) {
    const zak = p.jezyki[kod]?.zakazane;
    if (!zak?.length || !wykryte(p, pl)) continue;
    for (const z of zak) if (re(z.wzorzec).test(tlumaczenie)) wynik.push({ pojecie: p.id, wzorzec: z.wzorzec, powod: z.powod });
  }
  return wynik;
}

/** Wpisy słownika dla jednego języka docelowego. */
function wpisyDlaJezyka(slownik, kod) {
  return slownik.pojecia.filter((p) => p.jezyki[kod]).map((p) => ({ id: p.id, pl: p.pl, znaczenie: p.znaczenie, ...p.jezyki[kod] }));
}

/** Blok tekstu do promptu przekładu: tylko wpisy języka docelowego (termin zalecany + zakazane z powodem). Pusty, gdy brak wpisów. */
function blokPromptu(slownik, kod) {
  const w = wpisyDlaJezyka(slownik, kod);
  if (!w.length) return '';
  const linie = w.map((e) => {
    let s = `- ${e.pl} (${e.znaczenie}) → ${e.zalecany}`;
    if (e.zakazane?.length) s += `; NIE używaj: ${e.zakazane.map((z) => `„${z.wzorzec.replace(/\(\?<!\\p\{L\}\)|\(\?!\\p\{L\}\)/g, '')}” (${z.powod})`).join('; ')}`;
    return s;
  });
  return ['Słownik terminów treningowych (obowiązkowy; teksty mają brzmieć naturalnie, jak mówi trener albo kolega na siłowni w tym języku, nie jak podręcznik; odmieniaj termin według gramatyki):', ...linie].join('\n');
}

const ESC = (t) => String(t).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const CZYSC = (w) => w.replace(/\(\?<!\\p\{L\}\)|\(\?!\\p\{L\}\)|\\b/g, '');

/** Dokument docs/lokalizacja/slownik-terminow.md — generowany z JSON (nie przepisywać ręcznie): UPDATE_I18N=1 npx jest tests/slownik-terminow.test.ts. */
function dokument(slownik) {
  const kody = Object.keys(slownik.pojecia[0].jezyki);
  const L = ['# Słownik terminów treningowych (35 języków)', '',
    'Plik generowany z `docs/lokalizacja/slownik-terminow.json` (jedno źródło); nie edytuj ręcznie: `UPDATE_I18N=1 npx jest tests/slownik-terminow.test.ts`.', '',
    '**Zasada pierwsza (właściciel, 25.10.2026): teksty mają być naturalne.** Opieramy się na źródłach naukowych, ale nie pouczamy ludzi jak profesorzy: mówimy tak jak trener albo kolega na siłowni w danym języku, jak w każdej innej aplikacji treningowej. Termin zalecany = potoczny termin siłowni, nie naukowy, chyba że potoczny wprowadza w błąd.', '',
    'Gdzie użyty: strażnik `tests/slownik-terminow.test.ts` (żaden tekst UI ani wskazówka techniki z pojęciem słownika nie używa terminu zakazanego; wyjątki z powodem w `docs/lokalizacja/slownik-wyjatki.json`), przekład przez API (`scripts/i18n/przeklad-api.mjs` dołącza wpisy języka docelowego i odrzuca tłumaczenia z terminem zakazanym), role `tlumacz` i `recenzent-lokalizacji`.', '',
    `Pewność: **wysoka** — ${slownik.pewnosc.wysoka}; **srednia** — ${slownik.pewnosc.srednia}; **niska** — ${slownik.pewnosc.niska}. Żaden wpis nie przeszedł recenzji native speakera.`, '',
    '## Pojęcia', '', '| id | pojęcie | znaczenie |', '|---|---|---|'];
  for (const p of slownik.pojecia) L.push(`| \`${p.id}\` | ${ESC(p.pl)} | ${ESC(p.znaczenie)} |`);
  L.push('', '## Terminy zalecane (rdzeń)', '', 'Przerwa między seriami, seria, powtórzenie, zakres powtórzeń, deload — pozostałe pojęcia w pliku JSON.', '',
    '| język | przerwa | seria | powtórzenie | zakres powtórzeń | deload | do upadku |', '|---|---|---|---|---|---|---|');
  const id = (i, k) => ESC(slownik.pojecia.find((p) => p.id === i).jezyki[k].zalecany);
  for (const k of kody) L.push(`| \`${k}\` | ${id('przerwa', k)} | ${id('seria', k)} | ${id('powtorzenie', k)} | ${id('zakres_powtorzen', k)} | ${id('deload', k)} | ${id('do_upadku', k)} |`);
  L.push('', '## Terminy zakazane (strażnik)', '', '| język | pojęcie | zakazane | powód |', '|---|---|---|---|');
  for (const k of kody) for (const p of slownik.pojecia) for (const z of p.jezyki[k].zakazane ?? []) L.push(`| \`${k}\` | \`${p.id}\` | ${ESC(CZYSC(z.wzorzec))} | ${ESC(z.powod)} |`);
  const niskie = [];
  for (const k of kody) for (const p of slownik.pojecia) if (p.jezyki[k].pewnosc === 'niska') niskie.push(`| \`${k}\` | \`${p.id}\` | ${ESC(p.jezyki[k].zalecany)} | ${ESC(p.jezyki[k].uwaga)} |`);
  L.push('', `## Do potwierdzenia przez native speakera (${niskie.length})`, '', 'Pytanie do każdego: czy tak powiedziałby trener albo kolega na siłowni w tym języku? Jeśli nie — jak mówi się naprawdę? (Lista z docs/16.)', '', '| język | pojęcie | obecny termin | wątpliwość |', '|---|---|---|---|', ...niskie, '');
  return L.join('\n');
}

module.exports = { PLIK_SLOWNIKA, PEWNOSCI, wczytaj, wykryte, sprawdz, wpisyDlaJezyka, blokPromptu, dokument };
