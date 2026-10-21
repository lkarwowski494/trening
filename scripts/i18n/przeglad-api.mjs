#!/usr/bin/env node
// Przegląd tłumaczeń przez API Anthropic (Message Batches) — decyzja właściciela 20.10.2026 (ryzyko R-010, docs/16 „Treść krytyczna”).
// Jedno żądanie na język: zdania treści krytycznej (zdanie medyczne, asekuracja, wskazówki techniki) i klucze dodane/zmienione od `--od`.
// Skrypt NIE zmienia słowników — zapisuje tylko raport (raport-tlumaczen/<język>.json i podsumowanie.md); poprawki nanosi człowiek po przejrzeniu.
// Klucz: wyłącznie zmienna środowiskowa ANTHROPIC_API_KEY (nigdy w logach, raporcie ani argumentach). Bez zależności: fetch.
// Użycie:
//   node scripts/i18n/przeglad-api.mjs --szacuj                  — tylko koszt (bez klucza: przybliżenie; z kluczem: count_tokens, darmowy)
//   node scripts/i18n/przeglad-api.mjs --limit 2                 — przebieg dowodowy na 2 pierwszych językach (płatny)
//   node scripts/i18n/przeglad-api.mjs --model sonnet            — opcja tańsza (domyślnie najnowszy Opus, effort medium)
//   node scripts/i18n/przeglad-api.mjs --wznow <id_batcha>       — pobranie wyników batcha po przekroczeniu czasu oczekiwania
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

/* ---------- liczby w jednym miejscu (ceny i identyfikatory modeli: skill claude-api, tabela „Current Models”, 2026-10-06) ---------- */
export const MODELE = { opus: 'claude-opus-5-5', sonnet: 'claude-sonnet-5-5' };
/** USD za 1 mln tokenów, ceny standardowe; Message Batches liczą RABAT_BATCH tej ceny. */
export const CENY = { 'claude-opus-5-5': { we: 4, wy: 20 }, 'claude-sonnet-5-5': { we: 2, wy: 10 } };
export const RABAT_BATCH = 0.5;
export const DOMYSLNY_MODEL = MODELE.opus;
export const DOMYSLNY_EFFORT = 'medium';
export const EFFORTY = ['low', 'medium', 'high', 'xhigh', 'max'];
/** Powyżej tego szacunku (USD) przebieg zatrzymuje się, chyba że podano --zgoda-koszt (decyzja właściciela 20.10.2026: 50 USD na przebieg). */
export const LIMIT_KOSZTU_USD = 50;
export const MAX_TOKENS = 64000;
export const OD_DOMYSLNIE = '8273448';
export const WAGI = ['krytyczna', 'średnia', 'niska'];
/** Założenia szacunku wyjścia (nie pomiar): zdanie „ok” ≈ 8 tokenów, poprawka ≈ 90; 20% zdań z poprawką; myślenie modelu ≈ 10 000 tokenów na żądanie. */
export const SZACUNEK_WYJSCIA = { tokenyOk: 8, tokenyPoprawka: 90, udzialPoprawek: 0.2, myslenie: 10000 };
export const CZEKAJ_MIN_DOMYSLNIE = 120;
export const INTERWAL_S = 60;
const API = 'https://api.anthropic.com/v1';
const WERSJA_API = '2023-06-01';

/** Treść krytyczna wskazana z docs/16 i tests/audit-m1-049-critical-content.test.ts (klucze słownika = polski tekst). */
export const KRYTYCZNE_KLUCZE = [
  'Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.',
  'Asekuracja',
  'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.',
  'bez asekuracji w stojakach',
];

/** Rejestr zwracania się per język (docs/16). */
export const REJESTR = {
  en: 'neutralny, bezpośredni; polecenia w trybie rozkazującym („Tap”, „Choose”)',
  cs: 'standard, formalny jak w iOS', sk: 'standard, formalny jak w iOS', hu: 'standard, formalny jak w iOS', ro: 'standard, formalny jak w iOS',
  bg: 'standard, formalny jak w iOS', hr: 'standard, formalny jak w iOS', sl: 'standard, formalny jak w iOS', lt: 'standard, formalny jak w iOS',
  lv: 'standard, formalny jak w iOS', uk: 'standard, formalny jak w iOS',
  sr: 'serbski, cyrylica, ekawica; polecenia jak w iOS („Додирните”)', et: 'standard, „sina” (jak Apple w iOS po estońsku)',
  es: 'es-ES (Hiszpania), „tú”', 'es-419': 'hiszpański Ameryki Łacińskiej, „tú” (jak Apple es-MX)',
  pt: 'pt-PT (Portugalia), formalnie, bez „você”', 'pt-BR': 'pt-BR, „você”, polecenia w trybie łączącym („Toque”, „Escolha”)',
  de: '„du”', fr: '„vous” (forma grzecznościowa); spacja nierozdzielająca przed ? ! : ; i w « »', it: '„tu”', nl: '„je/jij”',
  sv: '„du”', da: '„du”', nb: '„du”', fi: '„sinä”; bez końcówek fleksyjnych przy {parametrach}', tr: '„siz” (forma grzecznościowa); bez przyrostków przy {parametrach}',
  el: 'jak Apple; „;” jako znak zapytania', id: '„Anda”, polecenia bez „-lah”', ms: '„anda”', vi: '„bạn”, uprzejme „hãy” w poleceniach',
  ru: 'interfejs „вы” (jak iOS); wskazówki techniki „ты” (głos trenera)',
  ja: 'grzeczny styl です/ます, przyciski krótkie', ko: 'styl grzecznościowy: -니다 w zdaniach, -세요 w poleceniach',
  'zh-Hant': 'Tajwan, „你”, znaki tradycyjne, słownictwo iOS tajwańskie',
};

const czytaj = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** Wariant regionalny = słownik bazowy + nakładka (jak lib/locales/index.ts i lib/cues/index.ts). */
const BAZA = { 'es-419': 'es', 'pt-BR': 'pt' };

export function jezyki(root) {
  const dir = join(root, 'lib/locales');
  const kody = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)).sort();
  return ['en', ...kody.filter((k) => k !== 'en')];
}

export const zmienne = (s) => (String(s).match(/\{[^}]*\}/g) ?? []).sort();

/** Zdania do przeglądu niezależne od języka: { id, rodzaj, klucz, pl, en }. `poprzednieZrodlo` = _source.json ze stanu `--od` (tablica {pl,en}) albo null. */
export function zbierzZdania(root, poprzednieZrodlo) {
  const zrodlo = czytaj(join(root, 'lib/locales/_source.json'));
  const en = new Map(zrodlo.map((e) => [e.pl, e.en]));
  const out = []; const widziane = new Set();
  for (const k of KRYTYCZNE_KLUCZE) {
    if (!en.has(k)) throw new Error(`brak klucza treści krytycznej w lib/locales/_source.json: ${k.slice(0, 40)}…`);
    out.push({ rodzaj: 'krytyczne', klucz: k, pl: k, en: en.get(k) }); widziane.add(k);
  }
  if (poprzednieZrodlo) {
    const stare = new Map(poprzednieZrodlo.map((e) => [e.pl, e.en]));
    for (const e of zrodlo) {
      if (widziane.has(e.pl)) continue;
      if (!stare.has(e.pl) || stare.get(e.pl) !== e.en) { out.push({ rodzaj: 'nowe', klucz: e.pl, pl: e.pl, en: e.en }); widziane.add(e.pl); }
    }
  }
  const pl = czytaj(join(root, 'lib/cues/text/pl.json')); const ang = czytaj(join(root, 'lib/cues/text/en.json'));
  for (const id of Object.keys(pl).sort()) out.push({ rodzaj: 'wskazowka', klucz: id, pl: pl[id], en: ang[id] ?? '' });
  return out.map((z, i) => ({ id: i + 1, ...z }));
}

function slownik(root, sciezka, kod) {
  const wczytaj = (k) => { const p = join(root, sciezka, `${k}.json`); return existsSync(p) ? czytaj(p) : {}; };
  return BAZA[kod] ? { ...wczytaj(BAZA[kod]), ...wczytaj(kod) } : wczytaj(kod);
}

/** Zdania z tłumaczeniem w języku `kod`; brak tłumaczenia → tlum = null (zgłaszane lokalnie jako krytyczne). */
export function zdaniaJezyka(root, kod, zdania) {
  const ui = kod === 'en' ? null : slownik(root, 'lib/locales', kod); const cue = slownik(root, 'lib/cues/text', kod);
  return zdania.map((z) => {
    const tlum = kod === 'en' ? (z.en || null) : (z.rodzaj === 'wskazowka' ? cue[z.klucz] : ui[z.klucz]) ?? null;
    return { ...z, tlum: typeof tlum === 'string' && tlum.trim() ? tlum : null };
  });
}

/** Kontrola lokalna (bez API): zgodność zmiennych {…} z polskim źródłem i brak tłumaczenia. */
export function kontrolaLokalna(zdaniaJ) {
  const w = [];
  for (const z of zdaniaJ) {
    if (z.tlum === null) { w.push({ id: z.id, klucz: z.klucz, problem: 'brak tłumaczenia', waga: 'krytyczna' }); continue; }
    const a = zmienne(z.pl).join(''); const b = zmienne(z.tlum).join('');
    if (a !== b) w.push({ id: z.id, klucz: z.klucz, problem: `zmienne: źródło ${a || '—'}, tłumaczenie ${b || '—'}`, waga: 'krytyczna' });
  }
  return w;
}

export const nazwaJezyka = (kod) => { try { return new Intl.DisplayNames(['pl'], { type: 'language' }).of(kod) ?? kod; } catch { return kod; } };

export const SYSTEM = [
  'Jesteś doświadczonym tłumaczem i redaktorem aplikacji do treningu siłowego (iOS). Przeglądasz gotowe tłumaczenia z polskiego, angielski jest drugim tekstem odniesienia.',
  'Dla każdego zdania oceń: (1) poprawność znaczenia względem polskiego źródła; (2) czy nie złagodzono ani nie wzmocniono twierdzeń medycznych i dotyczących bezpieczeństwa',
  '(zalecenie konsultacji z lekarzem, asekuracja, ostrzeżenia); (3) formę grzecznościową zgodną z podanym rejestrem języka (każda niezgodność to osobna uwaga);',
  '(4) naturalność dla rodzimego użytkownika; (5) zgodność zmiennych {…} (te same nazwy, bez tłumaczenia ani zmiany, bez dodanych przyrostków tam, gdzie rejestr tego zabrania);',
  '(6) liczbę mnogą (formy zgodne z gramatyką języka, gdy zdanie zawiera liczbę lub zmienną liczbową).',
  'Nie zgłaszaj różnic czysto stylistycznych bez powodu. Nie oceniaj merytorycznej prawdziwości zaleceń treningowych — tylko wierność przekładu.',
  'Wagi: „krytyczna” = zmiana lub utrata znaczenia, złagodzenie/wzmocnienie twierdzenia medycznego lub bezpieczeństwa, uszkodzona zmienna, niewłaściwy rejestr w zdaniu medycznym;',
  '„średnia” = niejasność, błędny rejestr w zwykłym zdaniu, nienaturalne sformułowanie, niespójna terminologia; „niska” = drobny styl, interpunkcja, typografia.',
  'Odpowiedz WYŁĄCZNIE jednym obiektem JSON, bez komentarza i bez bloku kodu. Kluczem jest numer zdania (tekst), wartością albo "ok", albo obiekt',
  '{"poprawka": "<proponowany pełny tekst w języku docelowym>", "powod": "<krótko, po polsku>", "waga": "krytyczna" | "średnia" | "niska"}. Każde zdanie musi mieć wpis.',
].join(' ');

export function budujZadanie(kod, zdaniaJ) {
  const lista = zdaniaJ.filter((z) => z.tlum !== null).map((z) => (kod === 'en'
    ? { id: String(z.id), rodzaj: z.rodzaj, pl: z.pl, tlumaczenie: z.tlum }
    : { id: String(z.id), rodzaj: z.rodzaj, pl: z.pl, en: z.en, tlumaczenie: z.tlum }));
  const user = [
    `Język docelowy: ${nazwaJezyka(kod)} (${kod}).`,
    `Rejestr i konwencje tego języka: ${REJESTR[kod] ?? 'jak w iOS danego języka'}.`,
    kod === 'en' ? 'To jest angielski tekst źródłowy aplikacji — oceń go względem polskiego.' : 'Pole „en” to angielski tekst odniesienia, „tlumaczenie” to tekst do oceny.',
    `Zdań: ${lista.length}. Rodzaje: krytyczne = zdanie medyczne i asekuracja; wskazowka = zdania wskazówek techniki ćwiczeń; nowe = teksty dodane lub zmienione w ostatnich partiach.`,
    '', JSON.stringify(lista),
  ].join('\n');
  return { system: SYSTEM, messages: [{ role: 'user', content: user }] };
}

export function budujZadanieBatcha(kod, zdaniaJ, { model, effort }) {
  const z = budujZadanie(kod, zdaniaJ);
  return { custom_id: `tl-${kod}`, params: { model, max_tokens: MAX_TOKENS, system: z.system, messages: z.messages, output_config: { effort } } };
}

/* ---------- odpowiedź ---------- */
const NORM_WAGA = (w) => { const s = String(w ?? '').toLowerCase().trim().replace('srednia', 'średnia'); return WAGI.includes(s) ? s : 'średnia'; };

export function parsujOdpowiedz(tekst, idy) {
  let s = String(tekst ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const a = s.indexOf('{'); const b = s.lastIndexOf('}');
  if (a < 0 || b <= a) return { blad: 'brak obiektu JSON w odpowiedzi', wyniki: {}, brak: [...idy] };
  let obj;
  try { obj = JSON.parse(s.slice(a, b + 1)); } catch (e) { return { blad: `niepoprawny JSON: ${e.message}`, wyniki: {}, brak: [...idy] }; }
  const wyniki = {}; const brak = [];
  for (const id of idy) {
    const v = obj[String(id)];
    if (v === undefined) { brak.push(id); continue; }
    if (typeof v === 'string' && v.trim().toLowerCase() === 'ok') { wyniki[id] = { ocena: 'ok' }; continue; }
    if (v && typeof v === 'object') {
      wyniki[id] = { ocena: 'poprawka', poprawka: typeof v.poprawka === 'string' ? v.poprawka : null, powod: String(v.powod ?? ''), waga: NORM_WAGA(v.waga) };
      continue;
    }
    wyniki[id] = { ocena: 'poprawka', poprawka: null, powod: `nierozpoznana odpowiedź: ${String(v).slice(0, 120)}`, waga: 'średnia' };
  }
  return { blad: null, wyniki, brak };
}

/** Jedna linia wyniku batcha → { kod, blad, tekst, uzycie }. Nie zachowuje nagłówków ani surowej odpowiedzi. */
export function odczytajLinie(linia) {
  const r = JSON.parse(linia); const kod = String(r.custom_id).replace(/^tl-/, ''); const res = r.result ?? {};
  if (res.type !== 'succeeded') return { kod, blad: `${res.type}${res.error?.error?.message ? `: ${res.error.error.message}` : res.error?.message ? `: ${res.error.message}` : ''}`, tekst: null, uzycie: null };
  const m = res.message ?? {};
  const tekst = (m.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  if (m.stop_reason === 'max_tokens') return { kod, blad: 'odpowiedź ucięta (max_tokens)', tekst: null, uzycie: m.usage ?? null };
  if (m.stop_reason === 'refusal') return { kod, blad: 'odmowa modelu (refusal)', tekst: null, uzycie: m.usage ?? null };
  return { kod, blad: null, tekst, uzycie: m.usage ?? null };
}

export function raportJezyka(kod, zdaniaJ, odczyt, meta) {
  const lokalne = kontrolaLokalna(zdaniaJ);
  const idy = zdaniaJ.filter((z) => z.tlum !== null).map((z) => z.id);
  const p = odczyt.blad ? { blad: odczyt.blad, wyniki: {}, brak: idy } : parsujOdpowiedz(odczyt.tekst, idy);
  const uwagi = []; let ok = 0;
  for (const z of zdaniaJ) {
    const w = p.wyniki[z.id]; if (!w) continue;
    if (w.ocena === 'ok') { ok++; continue; }
    uwagi.push({ klucz: z.klucz, rodzaj: z.rodzaj, pl: z.pl, tlumaczenie: z.tlum, poprawka: w.poprawka, powod: w.powod, waga: w.waga });
  }
  const porz = { krytyczna: 0, 'średnia': 1, niska: 2 }; uwagi.sort((a, b) => porz[a.waga] - porz[b.waga]);
  return { jezyk: kod, ...meta, zdan: zdaniaJ.length, ok, uwagi, brak_odpowiedzi: p.brak.map((id) => zdaniaJ.find((z) => z.id === id)?.klucz), blad: p.blad, kontrola_lokalna: lokalne.map(({ klucz, problem, waga }) => ({ klucz, problem, waga })) };
}

const licz = (r, w) => r.uwagi.filter((u) => u.waga === w).length;
export function podsumowanieMd(raporty, meta) {
  const L = ['# Przegląd tłumaczeń przez API', '', `Model: \`${meta.model}\`, effort: \`${meta.effort}\`, batch: \`${meta.batch_id ?? '—'}\`. Języków: ${raporty.length}.`,
    'Raport informacyjny — słowniki nie zostały zmienione. Poprawki nanosi człowiek po przejrzeniu (propozycje modelu bywają błędne).', '',
    '| język | zdań | ok | krytyczne | średnie | niskie | bez odpowiedzi | kontrola lokalna | błąd |', '|---|---|---|---|---|---|---|---|---|'];
  for (const r of raporty) L.push(`| ${r.jezyk} | ${r.zdan} | ${r.ok} | ${licz(r, 'krytyczna')} | ${licz(r, 'średnia')} | ${licz(r, 'niska')} | ${r.brak_odpowiedzi.length} | ${r.kontrola_lokalna.length} | ${r.blad ?? ''} |`);
  const kryt = raporty.flatMap((r) => r.uwagi.filter((u) => u.waga === 'krytyczna').map((u) => ({ jezyk: r.jezyk, ...u })));
  L.push('', `## Uwagi krytyczne (${kryt.length})`, '');
  const ob = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 200);
  for (const u of kryt) L.push(`- **${u.jezyk}** (${u.rodzaj}) „${ob(u.pl)}” → obecnie „${ob(u.tlumaczenie)}”; propozycja „${ob(u.poprawka)}”; powód: ${ob(u.powod)}`);
  const lok = raporty.flatMap((r) => r.kontrola_lokalna.map((k) => ({ jezyk: r.jezyk, ...k })));
  if (lok.length) { L.push('', `## Kontrola lokalna (bez API) (${lok.length})`, ''); for (const k of lok) L.push(`- **${k.jezyk}** „${ob(k.klucz)}”: ${k.problem}`); }
  return L.join('\n') + '\n';
}

/* ---------- szacunek kosztu ---------- */
const cjk = (c) => (c >= 0x3040 && c <= 0x30ff) || (c >= 0x3400 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xf900 && c <= 0xfaff);
/** Przybliżenie liczby tokenów bez sieci (zawyżone celowo): znaki łacińskie ~2,8 znaku/token, inne alfabety ~1,7, CJK ~1 znak/token. */
export function przyblizTokeny(tekst) {
  let t = 0; for (const ch of String(tekst)) { const c = ch.codePointAt(0); t += c < 0x250 ? 0.36 : cjk(c) ? 1 : 0.6; }
  return Math.ceil(t);
}
export const tekstZadania = (z) => `${z.system}\n${z.messages.map((m) => m.content).join('\n')}`;
export function tokenyWyjscia(n) { const s = SZACUNEK_WYJSCIA; return Math.ceil(n * ((1 - s.udzialPoprawek) * s.tokenyOk + s.udzialPoprawek * s.tokenyPoprawka) + s.myslenie); }
export function kosztUsd(tokWe, tokWy, model) {
  const c = CENY[model]; if (!c) throw new Error(`nieznany model dla cennika: ${model}`);
  return ((tokWe * c.we + tokWy * c.wy) / 1e6) * RABAT_BATCH;
}

export function szacunek(wiersze, model) {
  const we = wiersze.reduce((s, w) => s + w.we, 0); const wy = wiersze.reduce((s, w) => s + w.wy, 0);
  return { jezykow: wiersze.length, zdan: wiersze.reduce((s, w) => s + w.zdan, 0), tokeny_we: we, tokeny_wy: wy, koszt_usd: kosztUsd(we, wy, model),
    koszt_wg_modelu: Object.fromEntries(Object.values(MODELE).map((m) => [m, kosztUsd(we, wy, m)])) };
}

/* ---------- API (fetch; klucz tylko w nagłówku x-api-key) ---------- */
export function klient(fetchFn, klucz) {
  const naglowki = { 'x-api-key': klucz, 'anthropic-version': WERSJA_API, 'content-type': 'application/json' };
  const wywolaj = async (metoda, url, cialo, tekst = false) => {
    const r = await fetchFn(url, { method: metoda, headers: naglowki, body: cialo ? JSON.stringify(cialo) : undefined });
    if (!r.ok) { let m = ''; try { m = (await r.json())?.error?.message ?? ''; } catch { /* brak treści */ } throw new Error(`API ${metoda} ${new URL(url).pathname}: HTTP ${r.status} ${m}`.trim()); }
    return tekst ? r.text() : r.json();
  };
  return {
    liczTokeny: async (model, z) => (await wywolaj('POST', `${API}/messages/count_tokens`, { model, system: z.system, messages: z.messages })).input_tokens,
    utworz: (requests) => wywolaj('POST', `${API}/messages/batches`, { requests }),
    pobierz: (id) => wywolaj('GET', `${API}/messages/batches/${encodeURIComponent(id)}`),
    wyniki: (url) => wywolaj('GET', url, null, true),
  };
}

export async function czekajNaBatch(api, id, { czekajMin, interwalS, log, spij = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const koniec = Date.now() + czekajMin * 60000;
  for (;;) {
    const b = await api.pobierz(id);
    if (b.processing_status === 'ended') return b;
    log(`batch ${id}: ${b.processing_status}, w toku ${b.request_counts?.processing ?? '?'}`);
    if (Date.now() + interwalS * 1000 > koniec) throw Object.assign(new Error(`przekroczono czas oczekiwania (${czekajMin} min); wyniki odbierzesz: --wznow ${id}`), { kodWyjscia: 4 });
    await spij(interwalS * 1000);
  }
}

/* ---------- uruchomienie ---------- */
export function parsujArgumenty(argv) {
  const o = { model: DOMYSLNY_MODEL, effort: DOMYSLNY_EFFORT, szacuj: false, limit: null, wyjscie: 'raport-tlumaczen', od: OD_DOMYSLNIE, zgodaKoszt: false, maxKoszt: LIMIT_KOSZTU_USD, wznow: null, czekajMin: CZEKAJ_MIN_DOMYSLNIE };
  const wart = (i, n) => { if (i + 1 >= argv.length) throw new Error(`brak wartości dla ${n}`); return argv[i + 1]; };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--szacuj') o.szacuj = true;
    else if (a === '--zgoda-koszt') o.zgodaKoszt = true;
    else if (a === '--model') { const v = wart(i++, a); o.model = MODELE[v] ?? v; }
    else if (a === '--effort') o.effort = wart(i++, a);
    else if (a === '--limit') { const v = wart(i++, a); if (v !== '') { const n = Number(v); if (!Number.isInteger(n) || n < 1) throw new Error('--limit: liczba całkowita ≥ 1'); o.limit = n; } }
    else if (a === '--wyjscie') o.wyjscie = wart(i++, a);
    else if (a === '--od') o.od = wart(i++, a);
    else if (a === '--max-koszt') o.maxKoszt = Number(wart(i++, a));
    else if (a === '--wznow') o.wznow = wart(i++, a);
    else if (a === '--czekaj-min') o.czekajMin = Number(wart(i++, a));
    else throw new Error(`nieznany argument: ${a}`);
  }
  if (!CENY[o.model]) throw new Error(`nieznany model: ${o.model} (dozwolone: ${Object.values(MODELE).join(', ')})`);
  if (!EFFORTY.includes(o.effort)) throw new Error(`nieznany effort: ${o.effort} (dozwolone: ${EFFORTY.join(', ')})`);
  return o;
}

function poprzednieZrodlo(root, od) {
  if (!od) return null;
  try { return JSON.parse(execFileSync('git', ['show', `${od}:lib/locales/_source.json`], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] })); }
  catch { throw new Error(`nie ma commitu ${od} w historii (w CI: actions/checkout z fetch-depth: 0); --od "" pomija klucze z różnicy`); }
}

export async function main(argv, env, { fetchFn = fetch, log = console.log, root = resolve(dirname(fileURLToPath(import.meta.url)), '../..') } = {}) {
  const o = parsujArgumenty(argv); const klucz = env.ANTHROPIC_API_KEY || '';
  const api = klucz ? klient(fetchFn, klucz) : null;
  const zdania = zbierzZdania(root, poprzednieZrodlo(root, o.od));
  const kody = jezyki(root).slice(0, o.limit ?? undefined);
  const mapa = Object.fromEntries(kody.map((k) => [k, zdaniaJezyka(root, k, zdania)]));
  log(`zdań: ${zdania.length} (krytyczne ${zdania.filter((z) => z.rodzaj === 'krytyczne').length}, nowe ${zdania.filter((z) => z.rodzaj === 'nowe').length}, wskazówki ${zdania.filter((z) => z.rodzaj === 'wskazowka').length}); języków: ${kody.length}; model: ${o.model}; effort: ${o.effort}`);
  mkdirSync(o.wyjscie, { recursive: true });
  const zadania = kody.map((k) => budujZadanieBatcha(k, mapa[k], o));

  if (!o.wznow) {
    const wiersze = [];
    for (const [i, k] of kody.entries()) {
      const z = zadania[i].params; const n = mapa[k].filter((x) => x.tlum !== null).length;
      const we = api ? await api.liczTokeny(o.model, z) : przyblizTokeny(tekstZadania(z));
      wiersze.push({ jezyk: k, zdan: n, we, wy: tokenyWyjscia(n) });
    }
    const s = szacunek(wiersze, o.model);
    const zrodlo = api ? 'count_tokens (wejście), wyjście z założeń' : 'przybliżenie (bez klucza), wyjście z założeń';
    log(`szacunek (${zrodlo}, Batch −${RABAT_BATCH * 100}%): wejście ${s.tokeny_we}, wyjście ${s.tokeny_wy} tokenów; ${Object.entries(s.koszt_wg_modelu).map(([m, c]) => `${m} ≈ ${c.toFixed(2)} USD`).join(', ')}`);
    writeFileSync(join(o.wyjscie, 'szacunek.json'), JSON.stringify({ zrodlo, model: o.model, effort: o.effort, zalozenia_wyjscia: SZACUNEK_WYJSCIA, ...s, wiersze }, null, 1) + '\n');
    if (s.koszt_usd > o.maxKoszt && !o.zgodaKoszt) { log(`STOP: szacowany koszt ${s.koszt_usd.toFixed(2)} USD przekracza limit ${o.maxKoszt} USD; uruchom ponownie z zgodą na koszt (--zgoda-koszt)`); return 3; }
    if (o.szacuj) return 0;
  }
  if (!api) { log('brak ANTHROPIC_API_KEY — przebieg płatny niemożliwy (użyj --szacuj)'); return 2; }

  let id = o.wznow;
  if (!id) { const b = await api.utworz(zadania); id = b.id; log(`wysłano batch ${id}`); }
  let batch;
  try { batch = await czekajNaBatch(api, id, { czekajMin: o.czekajMin, interwalS: INTERWAL_S, log }); }
  catch (e) { log(e.message); return e.kodWyjscia ?? 1; }
  const linie = (await api.wyniki(batch.results_url)).split('\n').filter((l) => l.trim());
  const odczyty = Object.fromEntries(linie.map((l) => { const r = odczytajLinie(l); return [r.kod, r]; }));
  const meta = { model: o.model, effort: o.effort, batch_id: id };
  const raporty = kody.map((k) => raportJezyka(k, mapa[k], odczyty[k] ?? { blad: 'brak wyniku w batchu', tekst: null }, meta));
  for (const r of raporty) writeFileSync(join(o.wyjscie, `${r.jezyk}.json`), JSON.stringify(r, null, 1) + '\n');
  writeFileSync(join(o.wyjscie, 'podsumowanie.md'), podsumowanieMd(raporty, meta));
  log(`raport: ${o.wyjscie}/ (${raporty.length} języków, krytyczne uwagi: ${raporty.reduce((s, r) => s + licz(r, 'krytyczna'), 0)})`);
  return raporty.some((r) => r.blad) ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2), process.env).then((c) => process.exit(c), (e) => { console.error(`błąd: ${e.message}`); process.exit(1); });
}
