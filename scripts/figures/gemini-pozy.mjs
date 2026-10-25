#!/usr/bin/env node
// Pilotaż: dane póz figur v2 generuje Gemini przez API, nasza walidacja geometrii je sprawdza (decyzja właściciela 25.10.2026, docs/18, docs/52).
// Pętla dla każdego ćwiczenia rodziny: generuj → waliduj (biblioteka scripts/figures/v2-validate.mjs) → przy błędzie odeślij konkretny komunikat → najwyżej --proby prób.
// Licznik kosztu z odpowiedzi API (usage), twardy limit kosztu na przebieg (domyślnie 3 USD) — po przekroczeniu STOP, reszta ćwiczeń oznaczona „pominięte”.
// Wynik = artefakt (<wyjscie>/poze.json, raport.json, koszt.json, podsumowanie.md); skrypt NIE zapisuje nic w repozytorium. Nałożenie lokalnie po przeglądzie: --zastosuj <katalog>.
// Klucz: wyłącznie zmienna środowiskowa GEMINI_API_KEY (nagłówek x-goog-api-key; nigdy w logach, raporcie ani argumentach). Bez zależności: fetch.
//
// KONTRAKT Z SILNIKIEM (gałąź grafiki-cwiczen, docs/50; adapter poniżej ładuje go dynamicznie, więc skrypt działa też bez niego — wtedy tylko --szacuj z założeniami):
//   scripts/figures/v2-validate.mjs  eksportuje:
//     schematPozy(rodzina)                  → JSON Schema odpowiedzi (podzbiór JSON Schema obsługiwany przez structured output Gemini)
//     opisKontraktu(rodzina)                → tekst: co oznaczają pola, jednostki, ograniczenia geometrii (wchodzi do promptu)
//     waliduj(poza, { rodzina, cwiczenie }) → { ok: boolean, bledy: [{ kod, szczegol }] }   (testy geometrii: kości, zasięg, podłoga, przenikanie, chwyt, zakres stawów…)
//     przyklad(rodzina)                     → [{ cwiczenie, poza }]  gotowa rodzina jako few-shot (np. squat)
//     zastosuj(root, wynik)                 → (tylko dla --zastosuj) zapis póz w lib/figures/v2 po przeglądzie
// Użycie:
//   node scripts/figures/gemini-pozy.mjs --rodzina pull_up --szacuj
//   node scripts/figures/gemini-pozy.mjs --rodzina pull_up --model gemini-4-argon --limit-usd 3 --proby 4 --wyjscie raport-pozy
//   node scripts/figures/gemini-pozy.mjs --zastosuj raport-pozy
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const czytaj = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** Dozwolone modele (odczyt ai.google.dev 25.10.2026, docs/52). Domyślny: flagowy, stabilny, structured output wprost w dokumentacji. */
export const MODELE = ['gemini-4-argon', 'gemini-3.1-pro-preview', 'gemini-3.8-flash'];
export const DOMYSLNY_MODEL = 'gemini-4-argon';
/** Ceny USD za 1 mln tokenów (standard, nie Batch — pętla jest iteracyjna). `od` = data (UTC, włącznie), od której obowiązuje stawka; ostatnia pasująca wygrywa. Źródło: docs/52. */
export const CENY = {
  'gemini-4-argon': [{ od: '2026-01-01', we: 2, wy: 10 }, { od: '2026-12-01', we: 4, wy: 20 }],
  'gemini-3.1-pro-preview': [{ od: '2026-01-01', we: 2, wy: 12 }], /* do 200 tys. tokenów kontekstu; nasze prompty są dużo mniejsze */
  'gemini-3.8-flash': [{ od: '2026-01-01', we: 0.75, wy: 3.75 }, { od: '2027-01-01', we: 1.5, wy: 7.5 }],
};
export const LIMIT_USD = 3;
export const PROBY = 4;
/** Założenia szacunku (NIE pomiar; do skorygowania po pilotażu): tokeny jednej odpowiedzi z pozą, myślenie modelu (liczone jako wyjście) i średnia liczba prób na ćwiczenie. */
export const ZALOZENIA = { wyjscie_poza: 2500, myslenie: 5000, srednia_prob: 1.6, bledy_na_cwiczenie: 1 };
export const MAX_TOKENS_ODPOWIEDZI = 16000;

export const cena = (model, data = new Date()) => {
  const t = CENY[model]; if (!t) throw new Error(`nieznany model: ${model} (dozwolone: ${MODELE.join(', ')})`);
  const d = (data instanceof Date ? data : new Date(data)).toISOString().slice(0, 10);
  return t.filter((x) => x.od <= d).pop() ?? t[0];
};
/** Koszt z pola usage odpowiedzi. Tokeny myślenia liczone jako wyjście (dokumentacja: „response pricing is the sum of output tokens and thinking tokens”); jeśli API już wlicza je do total_output_tokens, rachunek jest zawyżony (bezpieczny kierunek). */
export const kosztUsd = (uzycie, model, data) => {
  const c = cena(model, data); const we = uzycie?.total_input_tokens ?? 0; const wy = (uzycie?.total_output_tokens ?? 0) + (uzycie?.total_thought_tokens ?? 0);
  return (we * c.we + wy * c.wy) / 1e6;
};
export const przyblizTokeny = (s) => Math.ceil(String(s).length / 3);

/* ---------- kontrakt (adapter do gałęzi grafiki-cwiczen) ---------- */
export async function wczytajKontrakt(root = ROOT, ladowacz = (p) => import(pathToFileURL(p).href)) {
  const p = join(root, 'scripts/figures/v2-validate.mjs');
  if (!existsSync(p)) return null;
  const m = await ladowacz(p);
  for (const f of ['schematPozy', 'opisKontraktu', 'waliduj', 'przyklad']) if (typeof m[f] !== 'function') throw new Error(`v2-validate.mjs: brak eksportu ${f}() (kontrakt w nagłówku gemini-pozy.mjs)`);
  return m;
}

/** Ćwiczenia rodziny z docs/51 (sekcja „### <rodzina> (n) — …”, nazwy po średnikach). */
export function cwiczeniaRodziny(rodzina, plik = join(ROOT, 'docs/51-figury-v2-pokrycie.md')) {
  if (!existsSync(plik)) throw new Error(`brak ${plik} (jest na gałęzi grafiki-cwiczen; uruchom z tej gałęzi)`);
  const linie = readFileSync(plik, 'utf8').split('\n'); const i = linie.findIndex((l) => new RegExp(`^### ${rodzina} \\(\\d+\\)`).test(l));
  if (i < 0) throw new Error(`rodzina „${rodzina}” nie występuje w ${plik}`);
  const tresc = linie.slice(i + 1).join('\n').split(/\n### |\n## /)[0];
  return tresc.split(/;|\n/).map((s) => s.trim()).filter(Boolean);
}

/** Wskazówki i typowe błędy ćwiczenia: lib/figures/v2/cue-sets.json (ok/err = id) + teksty lib/cues/text/pl.json. Brak wpisu → puste listy. */
export function wskazowki(cwiczenie, root = ROOT) {
  const pc = join(root, 'lib/figures/v2/cue-sets.json'); const pt = join(root, 'lib/cues/text/pl.json');
  const set = existsSync(pc) ? (czytaj(pc).items ?? {})[cwiczenie] : null; const tekst = existsSync(pt) ? czytaj(pt) : {};
  const mapuj = (ids) => (ids ?? []).map((id) => ({ id, tekst: tekst[id] ?? null }));
  return { ok: mapuj(set?.ok), bledy: mapuj(set?.err) };
}

/* ---------- prompt ---------- */
export const SYSTEM = [
  'Jesteś animatorem postaci do aplikacji treningowej. Zwracasz dane póz ćwiczeń jako JEDEN obiekt JSON zgodny ze schematem — bez komentarza i bez bloku kodu.',
  'Pozy mają być poprawne anatomicznie i geometrycznie: stałe długości kości, kontakt z podłogą i sprzętem, dłonie na chwycie, brak przenikania ciała i sprzętu, kąty stawów w zakresie ruchu.',
  'Kąty i rozstawy bez źródła to uproszczenie ilustracyjne — nie dodawaj liczb ani opisów do wyświetlenia użytkownikowi. Wskazówki i błędy podane niżej są wiedzą o ruchu (nie do przepisania do wyniku); typowy błąd ✕ pokaż jako osobny wariant ruchu, jeśli schemat go przewiduje.',
  'Jeśli otrzymasz listę błędów walidacji poprzedniej próby, popraw dokładnie te miejsca i zwróć pełny, poprawiony obiekt.',
].join(' ');

export function budujPrompt({ rodzina, cwiczenie, opis, przyklady, wsk, poprzednia = null }) {
  const L = [`Rodzina ruchu: ${rodzina}.`, `Ćwiczenie: ${cwiczenie}.`, '', 'Kontrakt danych:', opis ?? '(brak opisu kontraktu)', ''];
  if (przyklady?.length) { L.push('Przykład gotowej rodziny (wzorzec formatu i poprawności):'); for (const p of przyklady) L.push(JSON.stringify({ cwiczenie: p.cwiczenie, poza: p.poza })); L.push(''); }
  if (wsk?.ok?.length) L.push('Wskazówki techniki tego ruchu:', ...wsk.ok.map((w) => `- ${w.tekst ?? w.id}`), '');
  if (wsk?.bledy?.length) L.push('Typowe błędy (ilustrowane jako ✕):', ...wsk.bledy.map((w) => `- ${w.id}: ${w.tekst ?? w.id}`), '');
  if (poprzednia) L.push('Poprzednia odpowiedź nie przeszła walidacji.', 'Poprzednia odpowiedź:', JSON.stringify(poprzednia.poza ?? poprzednia.tekst), 'Błędy:', ...poprzednia.bledy.map((b) => `- ${b.kod}: ${b.szczegol ?? ''}`), 'Zwróć pełny poprawiony obiekt.');
  else L.push(`Wygeneruj dane póz dla ćwiczenia „${cwiczenie}”.`);
  return L.join('\n');
}

/* ---------- klient API (Interactions, ai.google.dev/api/interactions-api) ---------- */
export const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
export function klient(fetchFn, klucz, { endpoint = ENDPOINT, spij = (ms) => new Promise((r) => setTimeout(r, ms)), ponowien = 2 } = {}) {
  return {
    async generuj({ model, system, input, schemat, maxTokens = MAX_TOKENS_ODPOWIEDZI }) {
      const body = { model, input, system_instruction: system, response_format: { type: 'text', mime_type: 'application/json', schema: schemat }, generation_config: { max_output_tokens: maxTokens } };
      for (let n = 0; ; n++) {
        const r = await fetchFn(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': klucz }, body: JSON.stringify(body) });
        if (r.ok) return r.json();
        if ((r.status === 429 || r.status >= 500) && n < ponowien) { await spij(2000 * 2 ** n); continue; }
        let msg = ''; try { msg = (await r.json())?.error?.message ?? ''; } catch { /* brak treści */ }
        throw new Error(`API ${r.status}${msg ? `: ${String(msg).slice(0, 300)}` : ''}`); /* treść błędu bez nagłówków i klucza */
      }
    },
  };
}
/** Odpowiedź Interaction → { tekst, uzycie, status }. Tekst = sklejone części „text” kroków „model_output”. */
export function odczytajOdpowiedz(o) {
  const tekst = (o?.steps ?? []).filter((s) => s.type === 'model_output').flatMap((s) => s.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  return { tekst, uzycie: o?.usage ?? null, status: o?.status ?? null };
}
export function parsujPoze(tekst) {
  const s = String(tekst ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return { poza: JSON.parse(s), blad: null }; } catch (e) { return { poza: null, blad: `niepoprawny JSON: ${e.message}` }; }
}

/* ---------- pętla ---------- */
/** Jedno ćwiczenie: generuj → waliduj → poprawki. Zwraca wpis raportu; `stan.wydano` rośnie o koszt każdego wywołania; przekroczenie limitu przerywa z `przerwane: 'limit'`. */
export async function opracujCwiczenie({ api, kontrakt, rodzina, cwiczenie, model, proby, limit, stan, przyklady, wsk, zegar = () => Date.now(), dzis }) {
  const wpis = { cwiczenie, proby: 0, ok: false, pierwsza_proba_ok: false, poprawki: 0, koszt_usd: 0, czas_ms: 0, bledy_historia: [], poza: null, przerwane: null };
  const schemat = kontrakt.schematPozy(rodzina); const opis = kontrakt.opisKontraktu(rodzina); const t0 = zegar(); let poprzednia = null;
  for (let n = 1; n <= proby; n++) {
    const najgorszy = ((przyblizTokeny(SYSTEM + opis) + 4000) * cena(model, dzis).we + MAX_TOKENS_ODPOWIEDZI * cena(model, dzis).wy) / 1e6; /* górna granica jednego wywołania */
    if (stan.wydano + najgorszy > limit) { wpis.przerwane = 'limit'; break; }
    const input = budujPrompt({ rodzina, cwiczenie, opis, przyklady, wsk, poprzednia });
    let odp;
    try { odp = odczytajOdpowiedz(await api.generuj({ model, system: SYSTEM, input, schemat })); } catch (e) { wpis.bledy_historia.push([{ kod: 'api', szczegol: e.message }]); wpis.przerwane = 'api'; break; }
    const k = kosztUsd(odp.uzycie, model, dzis); stan.wydano += k; wpis.koszt_usd += k; wpis.proby = n;
    const p = odp.status && odp.status !== 'completed' ? { poza: null, blad: `status ${odp.status}` } : parsujPoze(odp.tekst);
    const bledy = p.blad ? [{ kod: 'json', szczegol: p.blad }] : (kontrakt.waliduj(p.poza, { rodzina, cwiczenie }).bledy ?? []);
    wpis.poza = p.poza;
    if (!bledy.length) { wpis.ok = true; wpis.pierwsza_proba_ok = n === 1; wpis.poprawki = n - 1; break; }
    wpis.bledy_historia.push(bledy); poprzednia = { poza: p.poza, tekst: odp.tekst, bledy };
  }
  wpis.czas_ms = zegar() - t0; if (!wpis.ok && !wpis.przerwane) wpis.przerwane = 'proby';
  return wpis;
}

export function podsumowanie(rap) {
  const w = rap.wyniki; const ok = w.filter((x) => x.ok);
  return {
    rodzina: rap.rodzina, model: rap.model, cwiczen: w.length, przeszlo: ok.length, za_pierwszym_razem: w.filter((x) => x.pierwsza_proba_ok).length,
    poprawek: w.reduce((s, x) => s + x.poprawki, 0), wywolan: w.reduce((s, x) => s + x.proby, 0), nieudane: w.filter((x) => !x.ok).map((x) => `${x.cwiczenie} (${x.przerwane})`),
    koszt_usd: Number(w.reduce((s, x) => s + x.koszt_usd, 0).toFixed(4)), czas_s: Math.round(w.reduce((s, x) => s + x.czas_ms, 0) / 1000), limit_usd: rap.limit_usd, zatrzymano_limitem: w.some((x) => x.przerwane === 'limit'),
  };
}
export function podsumowanieMd(s) {
  const p = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '—');
  return ['# Pilotaż póz przez API (propozycje do przeglądu)', '', `Rodzina \`${s.rodzina}\`, model \`${s.model}\`. Nic nie zapisano w repozytorium; nałożenie po przeglądzie: \`node scripts/figures/gemini-pozy.mjs --zastosuj <katalog>\`.`, '',
    '| miara | wartość |', '|---|---|', `| ćwiczeń | ${s.cwiczen} |`, `| przeszło walidację | ${s.przeszlo} (${p(s.przeszlo, s.cwiczen)}) |`, `| za pierwszym razem | ${s.za_pierwszym_razem} (${p(s.za_pierwszym_razem, s.cwiczen)}) |`,
    `| poprawek (ponowień po błędzie) | ${s.poprawek} |`, `| wywołań API | ${s.wywolan} |`, `| koszt | ${s.koszt_usd.toFixed(2)} USD (limit ${s.limit_usd} USD${s.zatrzymano_limitem ? ', ZATRZYMANO LIMITEM' : ''}) |`, `| czas | ${s.czas_s} s |`,
    ...(s.nieudane.length ? ['', `Nieudane: ${s.nieudane.join('; ')}`] : [])].join('\n') + '\n';
}

/* ---------- szacunek ---------- */
/** Szacunek kosztu rodziny (n ćwiczeń) i całości (liczba ćwiczeń). Wejście mierzone z promptu (jeśli kontrakt jest), wyjście z ZALOZENIA — oznaczone jako założenie. */
export function szacunek({ model, liczbaCwiczen, tokenyWejsciaNaProbe, dzis, zal = ZALOZENIA }) {
  const c = cena(model, dzis); const prob = liczbaCwiczen * zal.srednia_prob;
  const we = prob * (tokenyWejsciaNaProbe + (zal.srednia_prob > 1 ? zal.wyjscie_poza * 0.5 : 0)); const wy = prob * (zal.wyjscie_poza + zal.myslenie);
  return { model, cwiczen: liczbaCwiczen, prob: Math.round(prob), tokeny_we: Math.round(we), tokeny_wy: Math.round(wy), koszt_usd: Number(((we * c.we + wy * c.wy) / 1e6).toFixed(2)), zalozenia: zal, cena: c };
}

/* ---------- uruchomienie ---------- */
export function parsujArgumenty(argv) {
  const o = { rodzina: null, model: DOMYSLNY_MODEL, limitUsd: LIMIT_USD, proby: PROBY, szacuj: false, wyjscie: 'raport-pozy', zastosuj: null, cwiczenia: null, lista: null };
  const wart = (i, n) => { if (i + 1 >= argv.length) throw new Error(`brak wartości dla ${n}`); return argv[i + 1]; };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--szacuj') o.szacuj = true;
    else if (a === '--rodzina') { o.rodzina = wart(i++, a); if (!/^[a-z][a-z0-9_]{1,40}$/.test(o.rodzina)) throw new Error('--rodzina: oczekiwany identyfikator rodziny (małe litery, cyfry, _)'); }
    else if (a === '--model') { o.model = wart(i++, a); if (!MODELE.includes(o.model)) throw new Error(`nieznany model: ${o.model} (dozwolone: ${MODELE.join(', ')})`); }
    else if (a === '--limit-usd') { o.limitUsd = Number(wart(i++, a)); if (!(o.limitUsd > 0 && o.limitUsd <= 50)) throw new Error('--limit-usd: liczba z przedziału (0, 50]'); }
    else if (a === '--proby') { o.proby = Number(wart(i++, a)); if (!Number.isInteger(o.proby) || o.proby < 1 || o.proby > 8) throw new Error('--proby: liczba całkowita 1–8'); }
    else if (a === '--cwiczenia') o.cwiczenia = wart(i++, a).split(',').map((s) => s.trim()).filter(Boolean); /* zawężenie listy (np. jedno ćwiczenie do próby) */
    else if (a === '--lista') o.lista = wart(i++, a); /* plik docs/51 (domyślnie docs/51-figury-v2-pokrycie.md) */
    else if (a === '--wyjscie') o.wyjscie = wart(i++, a);
    else if (a === '--zastosuj') o.zastosuj = wart(i++, a);
    else throw new Error(`nieznany argument: ${a}`);
  }
  return o;
}

export async function main(argv, env, { fetchFn = fetch, log = console.log, root = ROOT, dzis = new Date(), zegar = () => Date.now(), spij } = {}) {
  const o = parsujArgumenty(argv);
  const kontrakt = await wczytajKontrakt(root);
  if (o.zastosuj) {
    if (!kontrakt || typeof kontrakt.zastosuj !== 'function') { log('brak v2-validate.mjs → zastosuj(): nałożenie niemożliwe'); return 4; }
    const wynik = czytaj(join(resolve(o.zastosuj), 'poze.json')); log(JSON.stringify(await kontrakt.zastosuj(root, wynik))); return 0;
  }
  if (!o.rodzina) throw new Error('wymagane: --rodzina <id>');
  let lista = cwiczeniaRodziny(o.rodzina, o.lista ? resolve(o.lista) : join(root, 'docs/51-figury-v2-pokrycie.md'));
  if (o.cwiczenia) lista = lista.filter((c) => o.cwiczenia.includes(c));
  const przyklady = kontrakt ? kontrakt.przyklad(o.rodzina) : []; /* few-shot: dla rodziny planowanej — gotowy wzór (squat) wybiera przyklad() */
  const przykladyWzor = przyklady?.length ? przyklady : (kontrakt ? kontrakt.przyklad('squat') : []);
  mkdirSync(o.wyjscie, { recursive: true });
  const wejscie = kontrakt ? przyblizTokeny(SYSTEM + kontrakt.opisKontraktu(o.rodzina) + JSON.stringify(kontrakt.schematPozy(o.rodzina)) + JSON.stringify(przykladyWzor)) + 300 : 3000;
  const sz = szacunek({ model: o.model, liczbaCwiczen: lista.length, tokenyWejsciaNaProbe: wejscie, dzis });
  log(`rodzina ${o.rodzina}: ${lista.length} ćwiczeń; model ${o.model}; szacunek (założenia, nie pomiar): ${sz.koszt_usd.toFixed(2)} USD; limit ${o.limitUsd} USD${kontrakt ? '' : ' [brak kontraktu v2-validate.mjs — wejście z założenia]'}`);
  writeFileSync(join(o.wyjscie, 'szacunek.json'), JSON.stringify({ ...sz, kontrakt: !!kontrakt, limit_usd: o.limitUsd }, null, 1) + '\n');
  if (o.szacuj) return 0;
  if (!kontrakt) { log('brak scripts/figures/v2-validate.mjs (gałąź grafiki-cwiczen) — przebieg płatny niemożliwy'); return 4; }
  const klucz = env.GEMINI_API_KEY || '';
  if (!klucz) { log('brak GEMINI_API_KEY — przebieg płatny niemożliwy (użyj --szacuj)'); return 2; }
  if (sz.koszt_usd > o.limitUsd) log(`UWAGA: szacunek ${sz.koszt_usd.toFixed(2)} USD przekracza limit ${o.limitUsd} USD — przebieg zatrzyma się na limicie (część ćwiczeń zostanie pominięta)`);
  const api = klient(fetchFn, klucz, spij ? { spij } : {}); const stan = { wydano: 0 }; const wyniki = [];
  for (const cw of lista) {
    const w = await opracujCwiczenie({ api, kontrakt, rodzina: o.rodzina, cwiczenie: cw, model: o.model, proby: o.proby, limit: o.limitUsd, stan, przyklady: przykladyWzor, wsk: wskazowki(cw, root), zegar, dzis });
    wyniki.push(w); log(`${w.ok ? 'OK ' : 'NIE'} ${cw} (prób ${w.proby}, ${w.koszt_usd.toFixed(3)} USD)`);
    if (w.przerwane === 'limit') { for (const reszta of lista.slice(wyniki.length)) wyniki.push({ cwiczenie: reszta, proby: 0, ok: false, pierwsza_proba_ok: false, poprawki: 0, koszt_usd: 0, czas_ms: 0, bledy_historia: [], poza: null, przerwane: 'limit' }); break; }
  }
  const rap = { rodzina: o.rodzina, model: o.model, limit_usd: o.limitUsd, wyniki };
  const s = podsumowanie(rap);
  writeFileSync(join(o.wyjscie, 'poze.json'), JSON.stringify({ rodzina: o.rodzina, model: o.model, poze: Object.fromEntries(wyniki.filter((x) => x.ok).map((x) => [x.cwiczenie, x.poza])) }, null, 1) + '\n');
  writeFileSync(join(o.wyjscie, 'raport.json'), JSON.stringify(rap, null, 1) + '\n');
  writeFileSync(join(o.wyjscie, 'koszt.json'), JSON.stringify({ koszt_usd: s.koszt_usd, limit_usd: o.limitUsd, model: o.model, wywolan: s.wywolan, czas_s: s.czas_s }, null, 1) + '\n');
  writeFileSync(join(o.wyjscie, 'podsumowanie.md'), podsumowanieMd(s));
  log(`raport: ${o.wyjscie}/ — przeszło ${s.przeszlo}/${s.cwiczen}, za 1. razem ${s.za_pierwszym_razem}, koszt ${s.koszt_usd.toFixed(2)} USD`);
  return s.zatrzymano_limitem ? 3 : wyniki.some((x) => x.przerwane === 'api') ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2), process.env).then((c) => process.exit(c), (e) => { console.error(`błąd: ${e.message}`); process.exit(1); });
}
