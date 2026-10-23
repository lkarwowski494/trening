#!/usr/bin/env node
// Kosztorys przekładu zestawu kluczy na języki aplikacji przez API Anthropic (Message Batches) — decyzja właściciela 23.10.2026 (docs/18).
// TYLKO LICZY: nie łączy się z siecią, nie czyta ANTHROPIC_API_KEY, nic nie wysyła. Przekład (osobne narzędzie) wymaga zgody właściciela na wydatek.
// Zestaw: docs/lokalizacja/zestaw-przekladu-2026-10-23.json (klucz, PL, EN). Ceny, modele i przybliżenie tokenów — jedno miejsce: scripts/i18n/przeglad-api.mjs.
// Użycie: node scripts/i18n/przeklad-szacuj.mjs [--zestaw <plik>] [--md]   (--md: tabela do wklejenia do docs/lokalizacja/kosztorys-przekladu-*.md)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CENY, MODELE, RABAT_BATCH, REJESTR, jezyki, nazwaJezyka, przyblizTokeny } from './przeglad-api.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
/** Założenia (nie pomiar): przekład ≈ tokeny angielskiego tekstu × WSPOLCZYNNIK (długość zdań w języku docelowym względem angielskiego), obwiednia JSON na klucz,
 * myślenie modelu na żądanie (przekład krótkich tekstów, effort low/medium). Szacunek zawyżony celowo — jak w przeglad-api.mjs. */
export const ZALOZENIA = { obwiednia: 12, myslenie: 3000, instrukcjaPowtorzen: 0 };
/** Języki wymagające pełnego przekładu; warianty es-419 i pt-BR dostają przekład osobno (nakładka różnic względem es/pt — w szacunku jak pełny język: zawyżenie). */
export const WSPOLCZYNNIK = (kod) => (['ja', 'ko', 'zh-Hant'].includes(kod) ? 1.0 : ['el', 'bg', 'ru', 'uk', 'sr'].includes(kod) ? 1.6 : ['de', 'fi', 'hu', 'tr', 'nl', 'sv', 'da', 'nb', 'et', 'lt', 'lv', 'sl', 'hr', 'cs', 'sk', 'ro', 'pl'].includes(kod) ? 1.35 : 1.25);
export const SYSTEM = [
  'Jesteś doświadczonym tłumaczem aplikacji do treningu siłowego (iOS). Tłumaczysz z polskiego na język docelowy; angielski jest drugim tekstem odniesienia.',
  'Zachowaj sens, liczby i wszystkie zmienne {…} bez zmian (nazwy, bez przyrostków tam, gdzie rejestr tego zabrania). Pisz naturalnie, krótko, w drugiej osobie, w rejestrze podanym dla języka.',
  'Nie dodawaj nazw źródeł, autorów ani organizacji, jeśli nie ma ich w polskim tekście; zdania ostrzegawcze (zdrowie, bezpieczeństwo, asekuracja) tłumacz wiernie, bez złagodzenia.',
  'Formy liczby mnogiej oddzielone znakiem | zachowaj w liczbie i kolejności wymaganej przez język. Odpowiedz wyłącznie obiektem JSON: klucz = polski tekst, wartość = tłumaczenie.',
].join(' ');

export function wczytaj(plik) { return JSON.parse(readFileSync(plik, 'utf8')).klucze; }

/** Wiersz kosztorysu jednego języka: { kod, klucze, we, wy }. */
export function wiersz(kod, klucze) {
  const wstep = `Język docelowy: ${nazwaJezyka(kod)} (${kod}). Rejestr: ${REJESTR[kod] ?? 'jak w iOS danego języka'}.`;
  const lista = JSON.stringify(klucze.map((k) => ({ pl: k.pl, en: k.en })));
  const we = przyblizTokeny(`${SYSTEM}\n${wstep}\n${lista}`);
  const wy = Math.ceil(klucze.reduce((s, k) => s + przyblizTokeny(k.en) * WSPOLCZYNNIK(kod) + ZALOZENIA.obwiednia, 0)) + ZALOZENIA.myslenie;
  return { kod, klucze: klucze.length, we, wy };
}
export const koszt = (we, wy, model) => ((we * CENY[model].we + wy * CENY[model].wy) / 1e6) * RABAT_BATCH;

export function kosztorys(klucze, kody = jezyki(root).filter((k) => k !== 'en')) {
  const w = kody.map((k) => wiersz(k, klucze));
  const we = w.reduce((s, x) => s + x.we, 0), wy = w.reduce((s, x) => s + x.wy, 0);
  return { wiersze: w, jezykow: w.length, kluczy: klucze.length, we, wy, usd: Object.fromEntries(Object.values(MODELE).map((m) => [m, koszt(we, wy, m)])) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2); const i = a.indexOf('--zestaw');
  const plik = i >= 0 ? a[i + 1] : join(root, 'docs/lokalizacja/zestaw-przekladu-2026-10-23.json');
  const k = kosztorys(wczytaj(plik));
  console.log(`Języków: ${k.jezykow} × kluczy: ${k.kluczy}; tokeny wejścia ${k.we}, wyjścia ${k.wy} (szacunek, Batch −${RABAT_BATCH * 100}%)`);
  for (const [m, c] of Object.entries(k.usd)) console.log(`  ${m}: ≈ ${c.toFixed(2)} USD`);
  if (a.includes('--md')) for (const x of k.wiersze) console.log(`| ${x.kod} | ${x.klucze} | ${x.we} | ${x.wy} |`);
}
