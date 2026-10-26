#!/usr/bin/env node
// Przekład kluczy słownika na 33 języki przez API Anthropic (Message Batches) — decyzja właściciela 23.10.2026 (docs/18), rejestr zwracania się: docs/16.
// Wzór: scripts/i18n/przeglad-api.mjs (ten sam klient, ceny, modele, limit kosztu, odbiór wyników). Jedno żądanie na język.
// Wejście: zestaw kluczy czekających na przekład (domyślnie docs/lokalizacja/zestaw-przekladu-2026-10-23.json — ten sam plik, który czyta tests/pending-translation.ts):
//   klucz (tekst polski) + angielski tekst odniesienia; dla rodzaju „zmieniony” także poprzednie polskie brzmienie.
// Wyjście: PROPOZYCJE tłumaczeń jako artefakt JSON (<wyjscie>/<język>.json, podsumowanie.md, szacunek.json). Skrypt NIE zapisuje słowników.
// Osobny tryb --zastosuj <katalog raportu> nakłada wynik na lib/locales lokalnie, PO PRZEGLĄDZIE człowieka (bez sieci i bez klucza).
// Klucz: wyłącznie zmienna środowiskowa ANTHROPIC_API_KEY (nigdy w logach, raporcie ani argumentach). Bez zależności: fetch.
// Wyjątek „ton trenera” (docs/16) dotyczy tylko wskazówek techniki ćwiczeń — te klucze to teksty interfejsu, więc obowiązuje rejestr interfejsu danego języka.
// Użycie:
//   node scripts/i18n/przeklad-api.mjs --szacuj                    — tylko koszt (bez klucza: przybliżenie; z kluczem: count_tokens, darmowy)
//   node scripts/i18n/przeklad-api.mjs --limit 2                   — przebieg dowodowy na 2 pierwszych językach (płatny)
//   node scripts/i18n/przeklad-api.mjs --model sonnet              — opcja tańsza (domyślnie najnowszy Opus, effort medium)
//   node scripts/i18n/przeklad-api.mjs --wznow <id_batcha>         — pobranie wyników batcha po przekroczeniu czasu oczekiwania
//   node scripts/i18n/przeklad-api.mjs --zastosuj raport-przekladu — nałożenie przejrzanego raportu na lib/locales (lokalnie)
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { CENY, MODELE, RABAT_BATCH, DOMYSLNY_MODEL, DOMYSLNY_EFFORT, EFFORTY, MAX_TOKENS, REJESTR, INTERWAL_S, CZEKAJ_MIN_DOMYSLNIE, jezyki, zmienne, nazwaJezyka, przyblizTokeny, tekstZadania, kosztUsd, klient, czekajNaBatch } from './przeglad-api.mjs';
import { maskuj } from '../maskuj.mjs';

/** Powyżej tego szacunku (USD) przebieg zatrzymuje się, chyba że podano --zgoda-koszt (zgoda właściciela 23.10.2026: do 6 USD). */
export const LIMIT_KOSZTU_USD = 6;
export const ZESTAW_DOMYSLNY = 'docs/lokalizacja/zestaw-przekladu-2026-10-23.json';
/** Założenia szacunku wyjścia (nie pomiar, zawyżone celowo): tokeny tłumaczenia ≈ tokeny angielskiego × WSPOLCZYNNIK języka; obwiednia JSON na klucz; myślenie modelu na żądanie (effort medium). */
export const ZALOZENIA = { obwiednia: 12, myslenie: 3000 };
export const WSPOLCZYNNIK = (kod) => (['ja', 'ko', 'zh-Hant'].includes(kod) ? 1.0 : ['el', 'bg', 'ru', 'uk', 'sr'].includes(kod) ? 1.6 : ['de', 'fi', 'hu', 'tr', 'nl', 'sv', 'da', 'nb', 'et', 'lt', 'lv', 'sl', 'hr', 'cs', 'sk', 'ro'].includes(kod) ? 1.35 : 1.25);

/* Słownik terminów treningowych (decyzja właściciela 25.10.2026): docs/lokalizacja/slownik-terminow.json; moduł CommonJS, wspólny ze strażnikiem testowym. */
const SLOWNIK_MOD = createRequire(import.meta.url)('./slownik.cjs');
/** Słownik projektu; null tylko w atrapach projektu bez pliku (testy z fixture) — prawdziwy przebieg ma plik w repozytorium (pilnuje tests/slownik-terminow.test.ts). */
export const slownikTerminow = (root) => (existsSync(join(root, SLOWNIK_MOD.PLIK_SLOWNIKA)) ? SLOWNIK_MOD.wczytaj(root) : null);

const czytaj = (p) => JSON.parse(readFileSync(p, 'utf8'));
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export const SYSTEM = [
  'Jesteś doświadczonym tłumaczem aplikacji do treningu siłowego (iOS). Tłumaczysz teksty interfejsu z polskiego na język docelowy; angielski jest drugim tekstem odniesienia.',
  'Zachowaj sens, liczby i wszystkie zmienne {…} bez zmian (te same nazwy, bez tłumaczenia, bez dodanych przyrostków tam, gdzie rejestr tego zabrania). Pisz naturalnie, krótko, w rejestrze podanym dla języka.',
  'To teksty interfejsu dla zwykłych użytkowników, nie dla naukowców: nie dodawaj nazw źródeł, autorów, organizacji, lat ani oznaczeń pewności („wstępne”, „potwierdzone”, „jedno źródło”, „uproszczenie”), jeśli nie ma ich w polskim tekście.',
  'Zdania ostrzegawcze (zdrowie, bezpieczeństwo, asekuracja) tłumacz wiernie, bez złagodzenia i bez wzmocnienia. Nazwy elementów interfejsu w cudzysłowach („…”) tłumacz tak, jak brzmią w tym języku w tym samym zestawie (spójnie).',
  'Jeśli podano „stare” tłumaczenie poprzedniego brzmienia, użyj go tylko jako wzoru terminologii — nie przenoś z niego nazw źródeł ani zdań, których nie ma w nowym polskim tekście.',
  'Pisz naturalnie, tak jak powiedziałby trener albo kolega na siłowni w tym języku: potoczny termin siłowni zamiast naukowego żargonu i stylu podręcznikowego, bez zbędnych zastrzeżeń, krótko (ekran telefonu). Terminy treningowe tłumacz WYŁĄCZNIE według słownika terminów podanego dla języka (termin zalecany; terminów oznaczonych „NIE używaj” nie używaj nigdy, bo znaczą co innego albo brzmią jak przerwa w pracy).',
  'Formy liczby mnogiej oddzielone znakiem | zachowaj w liczbie i kolejności wymaganej przez język. Odpowiedz WYŁĄCZNIE jednym obiektem JSON, bez komentarza i bez bloku kodu: kluczem jest numer pozycji (tekst), wartością tłumaczenie (tekst).',
].join(' ');

/** Zestaw: { klucze: [{ rodzaj: 'nowy'|'zmieniony', pl, en, poprzedni_pl? }] } → pozycje z numerem (id) i rodzajem. */
export function wczytajZestaw(plik) {
  if (!existsSync(plik)) throw new Error(`brak zestawu do przekładu: ${plik} (jest na gałęzi z tekstami; uruchom workflow z tej gałęzi)`);
  const z = czytaj(plik);
  if (!Array.isArray(z.klucze)) throw new Error(`${plik}: oczekiwane pole „klucze”`);
  return z.klucze.map((k, i) => {
    if (typeof k.pl !== 'string' || !k.pl.trim() || typeof k.en !== 'string' || !k.en.trim()) throw new Error(`${plik}: pozycja ${i + 1} bez pl/en`);
    return { id: i + 1, rodzaj: k.rodzaj, pl: k.pl, en: k.en, poprzedni_pl: k.poprzedni_pl ?? null };
  });
}

/** Języki do przekładu: wszystkie słowniki lib/locales poza PL i EN (33). */
export const kodyDoPrzekladu = (root) => jezyki(root).filter((k) => k !== 'en' && k !== 'pl');

/** Stare tłumaczenie klucza zmienionego (słownik trzyma je pod nowym kluczem do czasu przekładu); brak → null. */
export function stare(root, kod) {
  const p = join(root, 'lib/locales', `${kod}.json`);
  return existsSync(p) ? czytaj(p) : {};
}

export function budujZadanie(kod, pozycje, staraTresc = {}, slownik = null) {
  const lista = pozycje.map((p) => {
    const o = { id: String(p.id), pl: p.pl, en: p.en };
    if (p.rodzaj === 'zmieniony' && typeof staraTresc[p.pl] === 'string') o.stare = staraTresc[p.pl];
    return o;
  });
  const user = [
    `Język docelowy: ${nazwaJezyka(kod)} (${kod}).`,
    `Rejestr i konwencje tego języka: ${REJESTR[kod] ?? 'jak w iOS danego języka'}.`,
    ...(slownik ? [SLOWNIK_MOD.blokPromptu(slownik, kod)].filter(Boolean) : []),
    `Pozycji: ${lista.length}. Pole „pl” to tekst źródłowy, „en” angielski tekst odniesienia, „stare” (jeśli jest) — poprzednie tłumaczenie poprzedniego brzmienia.`,
    '', JSON.stringify(lista),
  ].join('\n');
  return { system: SYSTEM, messages: [{ role: 'user', content: user }] };
}

export function budujZadanieBatcha(kod, pozycje, staraTresc, { model, effort }, slownik = null) {
  const z = budujZadanie(kod, pozycje, staraTresc, slownik);
  return { custom_id: `pr-${kod}`, params: { model, max_tokens: MAX_TOKENS, system: z.system, messages: z.messages, output_config: { effort } } };
}

/** Typografia języka: fr — spacja nierozdzielająca przed ; : ! ? » i po « (strażnik A11N-03, tests/audit-k1-bl-mer.test.tsx); inne języki bez zmian. */
export function typografia(kod, tekst) {
  return kod === 'fr' ? tekst.replace(/[ \t]([;:!?»])/g, '\u00a0$1').replace(/«[ \t]/g, '«\u00a0') : tekst;
}

/** Indeks klamry zamykającej pierwszy obiekt JSON od pozycji `a` (z uwzględnieniem łańcuchów i znaków ucieczki); gdy się nie domyka — ostatnia „}” w tekście (jak dawniej).
 * Komentarz modelu po obiekcie (np. „zmienne {n} bez zmian”) nie może przesuwać końca obiektu. */
export function zamknieciaObiektu(s, a) {
  if (a < 0) return -1;
  let g = 0, w = false, u = false;
  for (let i = a; i < s.length; i++) {
    const c = s[i];
    if (w) { if (u) u = false; else if (c === '\\') u = true; else if (c === '"') w = false; continue; }
    if (c === '"') w = true; else if (c === '{') g++; else if (c === '}' && --g === 0) return i;
  }
  return s.lastIndexOf('}');
}

/** Odpowiedź modelu → { blad, propozycje: {pl: tlumaczenie}, odrzucone: [{klucz, powod}] }. Tłumaczenie bez zgodnych zmiennych {…} albo puste trafia do „odrzucone”. */
export function parsujOdpowiedz(tekst, pozycje, kod = null, slownik = null) {
  const s = String(tekst ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const a = s.indexOf('{'); const b = zamknieciaObiektu(s, a);
  if (a < 0 || b <= a) return { blad: 'brak obiektu JSON w odpowiedzi', propozycje: {}, odrzucone: pozycje.map((p) => ({ klucz: p.pl, powod: 'brak odpowiedzi' })) };
  let obj;
  try { obj = JSON.parse(s.slice(a, b + 1)); } catch (e) { return { blad: `niepoprawny JSON: ${e.message}`, propozycje: {}, odrzucone: pozycje.map((p) => ({ klucz: p.pl, powod: 'brak odpowiedzi' })) }; }
  const propozycje = {}; const odrzucone = [];
  for (const p of pozycje) {
    const v = obj[String(p.id)];
    if (typeof v !== 'string' || !v.trim()) { odrzucone.push({ klucz: p.pl, powod: 'brak tłumaczenia w odpowiedzi' }); continue; }
    if (zmienne(p.pl).join('') !== zmienne(v).join('')) { odrzucone.push({ klucz: p.pl, powod: `zmienne: źródło ${zmienne(p.pl).join('') || '—'}, tłumaczenie ${zmienne(v).join('') || '—'}`, tlumaczenie: v }); continue; }
    const naruszenia = kod && slownik ? SLOWNIK_MOD.sprawdz(slownik, kod, p.pl, v) : [];
    if (naruszenia.length) { odrzucone.push({ klucz: p.pl, powod: `słownik terminów: ${naruszenia.map((n) => `${n.pojecie} /${n.wzorzec}/ — ${n.powod}`).join('; ')}`, tlumaczenie: v }); continue; }
    propozycje[p.pl] = typografia(kod, v.trim());
  }
  return { blad: null, propozycje, odrzucone };
}

/** Jedna linia wyniku batcha → { kod, blad, tekst, uzycie }. */
export function odczytajLinie(linia) {
  const r = JSON.parse(linia); const kod = String(r.custom_id).replace(/^pr-/, ''); const res = r.result ?? {};
  if (res.type !== 'succeeded') return { kod, blad: maskuj(`${res.type}${res.error?.error?.message ? `: ${res.error.error.message}` : res.error?.message ? `: ${res.error.message}` : ''}`), tekst: null, uzycie: null };
  const m = res.message ?? {};
  const tekst = (m.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  if (m.stop_reason === 'max_tokens') return { kod, blad: 'odpowiedź ucięta (max_tokens)', tekst: null, uzycie: m.usage ?? null };
  if (m.stop_reason === 'refusal') return { kod, blad: 'odmowa modelu (refusal)', tekst: null, uzycie: m.usage ?? null };
  return { kod, blad: null, tekst, uzycie: m.usage ?? null };
}

export function raportJezyka(kod, pozycje, odczyt, meta, slownik = null) {
  const p = odczyt.blad ? { blad: odczyt.blad, propozycje: {}, odrzucone: pozycje.map((x) => ({ klucz: x.pl, powod: 'brak odpowiedzi' })) } : parsujOdpowiedz(odczyt.tekst, pozycje, kod, slownik);
  return { jezyk: kod, ...meta, pozycji: pozycje.length, przyjete: Object.keys(p.propozycje).length, blad: p.blad, odrzucone: p.odrzucone, propozycje: p.propozycje };
}

export function podsumowanieMd(raporty, meta) {
  const L = ['# Przekład kluczy przez API (propozycje)', '', `Model: \`${meta.model}\`, effort: \`${meta.effort}\`, batch: \`${meta.batch_id ?? '—'}\`. Języków: ${raporty.length}.`,
    'Propozycje do przeglądu przez tłumacza — słowniki nie zostały zmienione. Nałożenie po przeglądzie: `node scripts/i18n/przeklad-api.mjs --zastosuj <katalog>`.', '',
    '| język | pozycji | przyjęte | odrzucone | błąd |', '|---|---|---|---|---|'];
  for (const r of raporty) L.push(`| ${r.jezyk} | ${r.pozycji} | ${r.przyjete} | ${r.odrzucone.length} | ${r.blad ?? ''} |`);
  const ob = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 120);
  const odrz = raporty.flatMap((r) => r.odrzucone.map((o) => ({ jezyk: r.jezyk, ...o })));
  if (odrz.length) { L.push('', `## Odrzucone (${odrz.length})`, ''); for (const o of odrz) L.push(`- **${o.jezyk}** „${ob(o.klucz)}”: ${o.powod}`); }
  return L.join('\n') + '\n';
}

/* ---------- szacunek kosztu ---------- */
export function wiersz(kod, pozycje, staraTresc, model, slownik = null) {
  const z = budujZadanie(kod, pozycje, staraTresc, slownik);
  const wy = Math.ceil(pozycje.reduce((s, p) => s + przyblizTokeny(p.en) * WSPOLCZYNNIK(kod) + ZALOZENIA.obwiednia, 0)) + ZALOZENIA.myslenie;
  return { jezyk: kod, pozycji: pozycje.length, we: przyblizTokeny(tekstZadania(z)), wy, model };
}
export function szacunek(wiersze, model) {
  const we = wiersze.reduce((s, w) => s + w.we, 0); const wy = wiersze.reduce((s, w) => s + w.wy, 0);
  return { jezykow: wiersze.length, pozycji: wiersze[0]?.pozycji ?? 0, tokeny_we: we, tokeny_wy: wy, koszt_usd: kosztUsd(we, wy, model), koszt_wg_modelu: Object.fromEntries(Object.values(MODELE).map((m) => [m, kosztUsd(we, wy, m)])) };
}

/* ---------- nałożenie raportu na słowniki (lokalnie, po przeglądzie) ---------- */
/** Nakłada propozycje z katalogu raportu na lib/locales/<kod>.json (tylko klucze z zestawu; istniejące wpisy są zastępowane, nowe dopisywane na końcu — kolejność normalizuje
 * UPDATE_I18N=1 npx jest tests/i18n-locales.test.ts). Potem usuwa z zestawu wpisy, które mają już tłumaczenie we wszystkich językach. Zwraca podsumowanie. */
export function zastosuj(root, katalog, plikZestawu) {
  const zestaw = czytaj(plikZestawu); const dozwolone = new Map(zestaw.klucze.map((k) => [k.pl, k]));
  const pliki = readdirSync(katalog).filter((f) => f.endsWith('.json') && !['szacunek.json'].includes(f));
  const podsumowanie = { jezykow: 0, zapisanych: 0, pominietych: [] }; const pokrycie = new Map();
  for (const f of pliki) {
    const r = czytaj(join(katalog, f)); const kod = r.jezyk;
    if (typeof kod !== 'string' || !existsSync(join(root, 'lib/locales', `${kod}.json`))) { podsumowanie.pominietych.push(`${f}: nieznany język`); continue; }
    const plik = join(root, 'lib/locales', `${kod}.json`); const d = czytaj(plik);
    for (const [pl, tl] of Object.entries(r.propozycje ?? {})) {
      if (!dozwolone.has(pl)) { podsumowanie.pominietych.push(`${kod}: klucz spoza zestawu „${pl.slice(0, 40)}”`); continue; }
      if (typeof tl !== 'string' || !tl.trim() || zmienne(pl).join('') !== zmienne(tl).join('')) { podsumowanie.pominietych.push(`${kod}: zmienne „${pl.slice(0, 40)}”`); continue; }
      d[pl] = typografia(kod, tl); podsumowanie.zapisanych++; pokrycie.set(pl, (pokrycie.get(pl) ?? 0) + 1);
    }
    writeFileSync(plik, JSON.stringify(d, null, 1) + '\n'); podsumowanie.jezykow++;
  }
  const kody = kodyDoPrzekladu(root);
  const pozostale = zestaw.klucze.filter((k) => (pokrycie.get(k.pl) ?? 0) < kody.length); /* wpis zostaje, dopóki nie nałożono go we wszystkich 33 językach */
  podsumowanie.zestaw_przed = zestaw.klucze.length; podsumowanie.zestaw_po = pozostale.length;
  zestaw.klucze = pozostale; writeFileSync(plikZestawu, JSON.stringify(zestaw, null, 1) + '\n');
  return podsumowanie;
}

/* ---------- uruchomienie ---------- */
export function parsujArgumenty(argv) {
  const o = { model: DOMYSLNY_MODEL, effort: DOMYSLNY_EFFORT, szacuj: false, limit: null, wyjscie: 'raport-przekladu', zestaw: ZESTAW_DOMYSLNY, zgodaKoszt: false, maxKoszt: LIMIT_KOSZTU_USD, wznow: null, czekajMin: CZEKAJ_MIN_DOMYSLNIE, zastosuj: null };
  const wart = (i, n) => { if (i + 1 >= argv.length) throw new Error(`brak wartości dla ${n}`); return argv[i + 1]; };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--szacuj') o.szacuj = true;
    else if (a === '--zgoda-koszt') o.zgodaKoszt = true;
    else if (a === '--model') { const v = wart(i++, a); o.model = MODELE[v] ?? v; }
    else if (a === '--effort') o.effort = wart(i++, a);
    else if (a === '--limit') { const v = wart(i++, a); if (v !== '') { const n = Number(v); if (!Number.isInteger(n) || n < 1) throw new Error('--limit: liczba całkowita ≥ 1'); o.limit = n; } }
    else if (a === '--wyjscie') o.wyjscie = wart(i++, a);
    else if (a === '--zestaw') o.zestaw = wart(i++, a);
    else if (a === '--max-koszt') o.maxKoszt = Number(wart(i++, a));
    else if (a === '--wznow') o.wznow = wart(i++, a);
    else if (a === '--czekaj-min') o.czekajMin = Number(wart(i++, a));
    else if (a === '--zastosuj') o.zastosuj = wart(i++, a);
    else throw new Error(`nieznany argument: ${a}`);
  }
  if (!CENY[o.model]) throw new Error(`nieznany model: ${o.model} (dozwolone: ${Object.values(MODELE).join(', ')})`);
  if (!EFFORTY.includes(o.effort)) throw new Error(`nieznany effort: ${o.effort} (dozwolone: ${EFFORTY.join(', ')})`);
  return o;
}

export async function main(argv, env, { fetchFn = fetch, log = console.log, root = ROOT } = {}) {
  const o = parsujArgumenty(argv);
  const plikZestawu = resolve(root, o.zestaw);
  if (o.zastosuj) { const p = zastosuj(root, resolve(o.zastosuj), plikZestawu); log(`nałożono ${p.zapisanych} tłumaczeń w ${p.jezykow} językach; zestaw: ${p.zestaw_przed} → ${p.zestaw_po} wpisów; pominięte: ${p.pominietych.length}`); for (const x of p.pominietych) log(`  pominięto: ${x}`); log('Dalej: UPDATE_I18N=1 npx jest tests/i18n-locales.test.ts, przegląd tłumacza, npm run test:fast.'); return 0; }
  const klucz = env.ANTHROPIC_API_KEY || '';
  const api = klucz ? klient(fetchFn, klucz) : null;
  const pozycje = wczytajZestaw(plikZestawu);
  const kody = kodyDoPrzekladu(root).slice(0, o.limit ?? undefined);
  const stareTresc = Object.fromEntries(kody.map((k) => [k, stare(root, k)]));
  log(`pozycji: ${pozycje.length} (nowe ${pozycje.filter((p) => p.rodzaj === 'nowy').length}, zmienione ${pozycje.filter((p) => p.rodzaj === 'zmieniony').length}); języków: ${kody.length}; model ${o.model}, effort ${o.effort}`);
  mkdirSync(o.wyjscie, { recursive: true });
  const slownik = slownikTerminow(root);
  const zadania = kody.map((k) => budujZadanieBatcha(k, pozycje, stareTresc[k], o, slownik));

  if (!o.wznow) {
    const wiersze = [];
    for (const [i, k] of kody.entries()) {
      const w = wiersz(k, pozycje, stareTresc[k], o.model, slownik);
      if (api) w.we = await api.liczTokeny(o.model, zadania[i].params);
      wiersze.push(w);
    }
    const s = szacunek(wiersze, o.model);
    const zrodlo = api ? 'count_tokens (wejście), wyjście z założeń' : 'przybliżenie (bez klucza), wyjście z założeń';
    log(`szacunek (${zrodlo}, Batch −${RABAT_BATCH * 100}%): wejście ${s.tokeny_we}, wyjście ${s.tokeny_wy} tokenów; ${Object.entries(s.koszt_wg_modelu).map(([m, c]) => `${m} ≈ ${c.toFixed(2)} USD`).join(', ')}`);
    writeFileSync(join(o.wyjscie, 'szacunek.json'), JSON.stringify({ zrodlo, model: o.model, effort: o.effort, zalozenia_wyjscia: ZALOZENIA, ...s, wiersze }, null, 1) + '\n');
    if (s.koszt_usd > o.maxKoszt && !o.zgodaKoszt) { log(`STOP: szacowany koszt ${s.koszt_usd.toFixed(2)} USD przekracza limit ${o.maxKoszt} USD; uruchom ponownie z zgodą na koszt (--zgoda-koszt)`); return 3; }
    if (o.szacuj) return 0;
  }
  if (!api) { log('brak ANTHROPIC_API_KEY — przebieg płatny niemożliwy (użyj --szacuj)'); return 2; }

  let id = o.wznow;
  if (!id) { const b = await api.utworz(zadania); id = b.id; log(`wysłano batch ${id}`); }
  let batch;
  try { batch = await czekajNaBatch(api, id, { czekajMin: o.czekajMin, interwalS: INTERWAL_S, log }); }
  catch (e) { log(maskuj(e.message)); return e.kodWyjscia ?? 1; }
  const linie = (await api.wyniki(batch.results_url)).split('\n').filter((l) => l.trim());
  const odczyty = Object.fromEntries(linie.map((l) => { const r = odczytajLinie(l); return [r.kod, r]; }));
  const meta = { model: o.model, effort: o.effort, batch_id: id };
  const raporty = kody.map((k) => raportJezyka(k, pozycje, odczyty[k] ?? { blad: 'brak wyniku w batchu', tekst: null }, meta, slownik));
  for (const r of raporty) writeFileSync(join(o.wyjscie, `${r.jezyk}.json`), JSON.stringify(r, null, 1) + '\n');
  writeFileSync(join(o.wyjscie, 'podsumowanie.md'), podsumowanieMd(raporty, meta));
  log(`raport: ${o.wyjscie}/ (${raporty.length} języków, odrzucone pozycje: ${raporty.reduce((s, r) => s + r.odrzucone.length, 0)})`);
  return raporty.some((r) => r.blad) ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2), process.env).then((c) => process.exit(c), (e) => { console.error(`błąd: ${maskuj(e.message)}`); process.exit(1); });
}
