#!/usr/bin/env node
// Pilotaż: dane póz figur v2 generuje Gemini przez API, nasza walidacja geometrii je sprawdza (decyzja właściciela 25.10.2026, docs/18, docs/52).
// Pętla dla każdego ćwiczenia rodziny: generuj → waliduj (biblioteka scripts/figures/v2-validate.mjs) → przy błędzie odeślij konkretny komunikat → najwyżej --proby prób.
// Licznik kosztu z odpowiedzi API (usage), twardy limit kosztu na przebieg (domyślnie 3 USD) — po przekroczeniu STOP, reszta ćwiczeń oznaczona „pominięte”.
// Wynik = artefakt (<wyjscie>/poze.json, raport.json, koszt.json, podsumowanie.md); skrypt NIE zapisuje nic w repozytorium. Nałożenie lokalnie po przeglądzie: --zastosuj <katalog>.
// Klucz: wyłącznie zmienna środowiskowa GEMINI_API_KEY (nagłówek x-goog-api-key; nigdy w logach, raporcie ani argumentach — wszystko, co wychodzi, przechodzi przez maskuj()). Bez zależności: fetch.
// Tryb API (--api, 26.10.2026, docs/52 pkt 6): `vertex` (domyślny) = Vertex AI / Agent Platform z kluczem API, endpoint globalny BEZ identyfikatora projektu
// (https://aiplatform.googleapis.com/v1/publishers/google/models/<model>:generateContent); `gemini` = Gemini API (AI Studio, Interactions). Sekret w obu przypadkach ten sam: GEMINI_API_KEY.
// Tryb vertex zaczyna od „próby połączenia” (najtańsze możliwe wywołanie); 401/402/403/429 = czytelny komunikat i STOP bez dalszych prób (kod 5).
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
//   node scripts/figures/gemini-pozy.mjs --lista-modeli --lokalizacja global   (bez kosztu: lista modeli widocznych dla klucza i odczyt każdego z naszych; modele.json)
//   node scripts/figures/gemini-pozy.mjs --zastosuj raport-pozy
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { maskuj } from '../maskuj.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const czytaj = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** Tryby API: vertex (Agent Platform z kluczem API, domyślny od 26.10.2026) i gemini (AI Studio). */
export const API_TRYBY = ['vertex', 'gemini'];
export const DOMYSLNY_API = 'vertex';
/** Dozwolone modele (te same identyfikatory w Gemini API i na Vertex — docs/52 pkt 1 i 6). Domyślny: flagowy, stabilny, structured output wprost w dokumentacji. */
export const MODELE = ['gemini-4-argon', 'gemini-3.1-pro-preview', 'gemini-3.8-flash'];
export const DOMYSLNY_MODEL = 'gemini-4-argon';
/** Ceny USD za 1 mln tokenów (standard, nie Batch — pętla jest iteracyjna). `od` = data (UTC, włącznie), od której obowiązuje stawka; ostatnia pasująca wygrywa. Źródło: docs/52. */
export const CENY = {
  'gemini-4-argon': [{ od: '2026-01-01', we: 2, wy: 10 }, { od: '2026-12-01', we: 4, wy: 20 }],
  'gemini-3.1-pro-preview': [{ od: '2026-01-01', we: 2, wy: 12 }], /* do 200 tys. tokenów kontekstu; nasze prompty są dużo mniejsze */
  'gemini-3.8-flash': [{ od: '2026-01-01', we: 0.75, wy: 3.75 }, { od: '2027-01-01', we: 1.5, wy: 7.5 }],
};
/** Vertex (strona cennika Agent Platform, odczyt 26.10.2026, region global, standard): te same stawki co w Gemini API; Argon do 30.11.2026 „2/10” to cena promocyjna rozliczana
 *  jako 50% zwrotu w kredytach od ceny listowej 4/20 — twardy limit liczymy od ceny listowej (bezpiecznie), `promo` = mnożnik kosztu netto po zwrocie. */
export const CENY_VERTEX = {
  'gemini-4-argon': [{ od: '2026-01-01', we: 4, wy: 20, promo: 0.5 }, { od: '2026-12-01', we: 4, wy: 20 }],
  'gemini-3.1-pro-preview': CENY['gemini-3.1-pro-preview'],
  'gemini-3.8-flash': CENY['gemini-3.8-flash'],
};
export const LIMIT_USD = 3;
export const PROBY = 4;
/** Założenia szacunku (NIE pomiar; do skorygowania po pilotażu): tokeny jednej odpowiedzi z pozą, myślenie modelu (liczone jako wyjście) i średnia liczba prób na ćwiczenie. */
export const ZALOZENIA = { wyjscie_poza: 2500, myslenie: 5000, srednia_prob: 1.6, bledy_na_cwiczenie: 1 };
export const MAX_TOKENS_ODPOWIEDZI = 16000;

export const cena = (model, data = new Date(), tryb = 'gemini') => {
  const t = (tryb === 'vertex' ? CENY_VERTEX : CENY)[model]; if (!t) throw new Error(`nieznany model: ${model} (dozwolone: ${MODELE.join(', ')})`);
  const d = (data instanceof Date ? data : new Date(data)).toISOString().slice(0, 10);
  return t.filter((x) => x.od <= d).pop() ?? t[0];
};
/** Koszt z pola usage odpowiedzi. Tokeny myślenia liczone jako wyjście (dokumentacja: „response pricing is the sum of output tokens and thinking tokens”); jeśli API już wlicza je do total_output_tokens, rachunek jest zawyżony (bezpieczny kierunek). */
export const kosztUsd = (uzycie, model, data, tryb = 'gemini') => {
  const c = cena(model, data, tryb); const we = uzycie?.total_input_tokens ?? 0; const wy = (uzycie?.total_output_tokens ?? 0) + (uzycie?.total_thought_tokens ?? 0);
  return (we * c.we + wy * c.wy) / 1e6;
};
/** Koszt netto po promocji (zwrot w kredytach), jeśli cennik go przewiduje; poza tym równy kosztowi listowemu. */
export const kosztNettoUsd = (uzycie, model, data, tryb = 'gemini') => kosztUsd(uzycie, model, data, tryb) * (cena(model, data, tryb).promo ?? 1);
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

/* ---------- maskowanie klucza i identyfikatorów (scripts/maskuj.mjs, lekcja L-035) ---------- */
export { maskuj };

/* ---------- klient API ---------- */
export const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions'; /* tryb gemini (Interactions, ai.google.dev/api/interactions-api) */
/** Lokalizacje (karta modelu Argon: Standard PayGo tylko `global` oraz multi-regiony `us`, `eu`; us-central1 nie jest obsługiwane). Bez projektu w adresie region wybiera host. */
export const LOKALIZACJE = ['global', 'us', 'eu'];
export const DOMYSLNA_LOKALIZACJA = 'global';
export const hostVertex = (lok = DOMYSLNA_LOKALIZACJA) => (lok === 'global' ? 'aiplatform.googleapis.com' : `${lok}-aiplatform.googleapis.com`);
export const ENDPOINT_VERTEX = `https://${hostVertex()}/v1/publishers/google/models`; /* tryb vertex: globalny, bez projektu; + /<model>:generateContent */
export const endpointVertex = (model, lok = DOMYSLNA_LOKALIZACJA) => `https://${hostVertex(lok)}/v1/publishers/google/models/${model}:generateContent`;
/** Statusy, po których NIE ponawiamy i kończymy cały przebieg (klucz, uprawnienia, rozliczenia, przydział). */
export const STATUSY_KRYTYCZNE = { gemini: [401, 402, 403, 404], vertex: [400, 401, 402, 403, 404, 429] };
export const KOMUNIKATY_KRYTYCZNE = {
  400: 'żądanie odrzucone jako niepoprawne (400) — stop po pierwszym błędzie; w raporcie są szczegóły pól (error.details) z odpowiedzi API',
  401: 'klucz odrzucony (401) — sprawdź wartość sekretu GEMINI_API_KEY (dla trybu vertex: klucz API Google Cloud z włączonym Agent Platform API, nie klucz z AI Studio)',
  402: 'wymagane rozliczenia lub brak kredytów (402) — sprawdź konto rozliczeniowe i kredyty projektu',
  403: 'brak uprawnień (403) — Agent Platform API niewłączone w projekcie, ograniczenia klucza (API restrictions), rola projektu albo model niedostępny dla tego typu klucza',
  404: 'model lub zasób nie znaleziony albo brak do niego dostępu (404) — stop po pierwszym błędzie; sprawdź --lokalizacja (global/us/eu), identyfikator modelu i dostęp klucza (uruchom wejście lista_modeli)',
  429: 'przekroczony przydział lub limit zapytań (429) — stop bez ponowień; sprawdź przydziały projektu w konsoli Google Cloud',
};
/** Formaty wymuszenia JSON w żądaniu vertex (dokumentacja GenerationConfig: pola responseMimeType/responseSchema/responseJsonSchema oznaczone jako przestarzałe na rzecz responseFormat[]).
 *  Próba połączenia wybiera pierwszy, który API przyjmie: schemat JSON → schemat OpenAPI (oczyszczony) → responseFormat → sam tryb JSON ze schematem w treści polecenia. */
export const FORMATY_VERTEX = ['jsonSchema', 'openApi', 'responseFormat', 'tekst'];
const KLUCZE_OPENAPI = ['type', 'format', 'title', 'description', 'nullable', 'enum', 'items', 'properties', 'required', 'minItems', 'maxItems', 'minimum', 'maximum', 'anyOf', 'propertyOrdering'];
/** Schemat JSON → podzbiór OpenAPI obsługiwany przez Vertex (usuwa $schema, additionalProperties, const, wielotypowe `type` itd.). */
export function schematOpenApi(sch) {
  if (Array.isArray(sch)) return sch.map(schematOpenApi);
  if (!sch || typeof sch !== 'object') return sch;
  const w = {};
  for (const [k, v] of Object.entries(sch)) {
    if (k === 'type' && Array.isArray(v)) { const t = v.filter((x) => x !== 'null'); w.type = t[0]; if (t.length !== v.length) w.nullable = true; }
    else if (k === 'const') w.enum = [v];
    else if (k === 'properties') w.properties = Object.fromEntries(Object.entries(v).map(([n, x]) => [n, schematOpenApi(x)]));
    else if (KLUCZE_OPENAPI.includes(k)) w[k] = k === 'items' || k === 'anyOf' ? schematOpenApi(v) : v;
  }
  return w;
}
export function trescVertex({ input, system, schemat, maxTokens, format }) {
  const tekst = format === 'tekst' ? `${input}\n\nOdpowiedz wyłącznie obiektem JSON zgodnym z tym schematem:\n${JSON.stringify(schemat)}` : input;
  const gc = { maxOutputTokens: maxTokens };
  if (format === 'jsonSchema') Object.assign(gc, { responseMimeType: 'application/json', responseJsonSchema: schemat });
  else if (format === 'openApi') Object.assign(gc, { responseMimeType: 'application/json', responseSchema: schematOpenApi(schemat) });
  else if (format === 'responseFormat') gc.responseFormat = [{ text: { mimeType: 'APPLICATION_JSON', schema: schemat } }];
  else Object.assign(gc, { responseMimeType: 'application/json' });
  return { contents: [{ role: 'user', parts: [{ text: tekst }] }], systemInstruction: { parts: [{ text: system }] }, generationConfig: gc };
}
export class BladApi extends Error {
  constructor(status, wiadomosc, krytyczny) { super(wiadomosc); this.name = 'BladApi'; this.status = status; this.krytyczny = krytyczny; }
}
export function klient(fetchFn, klucz, { tryb = 'gemini', lokalizacja = DOMYSLNA_LOKALIZACJA, endpoint, spij = (ms) => new Promise((r) => setTimeout(r, ms)), ponowien = 2 } = {}) {
  const krytyczne = STATUSY_KRYTYCZNE[tryb] ?? STATUSY_KRYTYCZNE.gemini;
  return {
    format: FORMATY_VERTEX[0], /* ustawiany przez próbę połączenia */
    async generuj({ model, system, input, schemat, maxTokens = MAX_TOKENS_ODPOWIEDZI, format = this.format }) {
      const url = endpoint ?? (tryb === 'vertex' ? endpointVertex(model, lokalizacja) : ENDPOINT);
      /* vertex: generateContent, format JSON wg `format` (FORMATY_VERTEX); maxOutputTokens ≤ 32 768 (limit żądania nie-strumieniowego dla Argon) */
      const body = tryb === 'vertex'
        ? trescVertex({ input, system, schemat, maxTokens, format })
        : { model, input, system_instruction: system, response_format: { type: 'text', mime_type: 'application/json', schema: schemat }, generation_config: { max_output_tokens: maxTokens } };
      for (let n = 0; ; n++) {
        const r = await fetchFn(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': klucz }, body: JSON.stringify(body) });
        if (r.ok) return r.json();
        let msg = ''; let det = ''; try { const e = (await r.json())?.error; msg = e?.message ?? ''; det = e?.details ? JSON.stringify(e.details) : ''; } catch { /* brak treści */ }
        const szczegol = maskuj(`${String(msg).slice(0, 300)}${det ? ` | details: ${det.slice(0, 1000)}` : ''}`, klucz); /* error.details (np. fieldViolations) wskazuje złe pole */
        if (krytyczne.includes(r.status)) throw new BladApi(r.status, `API ${r.status}: ${KOMUNIKATY_KRYTYCZNE[r.status]}${szczegol ? ` [${szczegol}]` : ''}`, true);
        if ((r.status === 429 || r.status >= 500) && n < ponowien) { await spij(2000 * 2 ** n); continue; }
        throw new BladApi(r.status, `API ${r.status}${szczegol ? `: ${szczegol}` : ''}`, false); /* treść błędu bez nagłówków i klucza */
      }
    },
  };
}
/** Odpowiedź API → { tekst, uzycie, status }. Gemini (Interactions): sklejone części „text” kroków „model_output”. Vertex (generateContent): części „text” pierwszego kandydata
 *  (bez myśli), status z finishReason (STOP = completed), zużycie przeliczone na wspólny kształt (candidatesTokenCount bez myślenia: total = prompt + candidates + toolUse + thoughts). */
export function odczytajOdpowiedz(o) {
  if (Array.isArray(o?.candidates) || o?.usageMetadata || o?.promptFeedback) {
    const k = o.candidates?.[0]; const u = o.usageMetadata;
    const tekst = (k?.content?.parts ?? []).filter((p) => typeof p.text === 'string' && !p.thought).map((p) => p.text).join('');
    const status = k ? (k.finishReason === 'STOP' || !k.finishReason ? 'completed' : String(k.finishReason).toLowerCase()) : (o.promptFeedback?.blockReason ? `zablokowane: ${String(o.promptFeedback.blockReason).toLowerCase()}` : null);
    const uzycie = u ? { total_input_tokens: (u.promptTokenCount ?? 0) + (u.toolUsePromptTokenCount ?? 0), total_output_tokens: u.candidatesTokenCount ?? 0, total_thought_tokens: u.thoughtsTokenCount ?? 0, total_tokens: u.totalTokenCount ?? null } : null;
    return { tekst, uzycie, status };
  }
  const tekst = (o?.steps ?? []).filter((s) => s.type === 'model_output').flatMap((s) => s.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  return { tekst, uzycie: o?.usage ?? null, status: o?.status ?? null };
}
export function parsujPoze(tekst) {
  const s = String(tekst ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return { poza: JSON.parse(s), blad: null }; } catch (e) { return { poza: null, blad: `niepoprawny JSON: ${e.message}` }; }
}

/* ---------- lista modeli (bez kosztu; tryb vertex) ---------- */
/** GET listy modeli wydawcy `google` (Model Garden, v1beta1) oraz GET każdego z naszych modeli (v1). Nic nie kosztuje (brak generowania). Zwraca { lista, sprawdzone, blad }. */
export async function listaModeli({ fetchFn, klucz, lokalizacja = DOMYSLNA_LOKALIZACJA, log = () => {}, modele = MODELE }) {
  const baza = `https://${hostVertex(lokalizacja)}`; const naglowki = { 'x-goog-api-key': klucz };
  const pobierz = async (url) => {
    const r = await fetchFn(url, { method: 'GET', headers: naglowki }); let tresc = null; try { tresc = await r.json(); } catch { /* brak treści */ }
    return { status: r.status, ok: r.ok, tresc, blad: r.ok ? null : maskuj(String(tresc?.error?.message ?? '').slice(0, 300), klucz) };
  };
  const wynik = { lokalizacja, host: hostVertex(lokalizacja), lista: null, lista_blad: null, sprawdzone: [] };
  let token = ''; const ids = [];
  for (let strona = 0; strona < 10; strona++) {
    const r = await pobierz(`${baza}/v1beta1/publishers/google/models?pageSize=100${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`);
    if (!r.ok) { wynik.lista_blad = `HTTP ${r.status}${r.blad ? `: ${r.blad}` : ''}`; if (STATUSY_KRYTYCZNE.vertex.includes(r.status) && r.status !== 404) wynik.krytyczny = r.status; break; }
    for (const m of r.tresc?.publisherModels ?? []) ids.push(String(m.name ?? '').split('/').pop());
    token = r.tresc?.nextPageToken ?? ''; wynik.lista = ids.filter(Boolean).sort();
    if (!token) break;
  }
  if (wynik.lista) log(`lista modeli (${lokalizacja}): ${wynik.lista.length} pozycji; gemini: ${wynik.lista.filter((i) => /^gemini/.test(i)).join(', ') || '(brak)'}`);
  else log(`lista modeli (${lokalizacja}) niedostępna: ${wynik.lista_blad}`);
  if (wynik.krytyczny) return wynik;
  for (const id of modele) {
    const r = await pobierz(`${baza}/v1/publishers/google/models/${id}`);
    wynik.sprawdzone.push({ model: id, status: r.status, ok: r.ok, blad: r.blad, na_liscie: wynik.lista ? wynik.lista.includes(id) : null });
    log(`model ${id} (${lokalizacja}): ${r.ok ? 'dostępny do odczytu' : `HTTP ${r.status}${r.blad ? ` — ${r.blad}` : ''}`}${wynik.lista ? `; na liście: ${wynik.lista.includes(id) ? 'tak' : 'nie'}` : ''}`);
    if (STATUSY_KRYTYCZNE.vertex.includes(r.status) && r.status !== 404) { wynik.krytyczny = r.status; break; }
  }
  return wynik;
}

/* ---------- próba połączenia (tryb vertex) ---------- */
export const SCHEMAT_PROBY = { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] };
/** Najtańsze możliwe wywołanie tym samym kształtem żądania (klucz, endpoint, model, tryb JSON ze schematem): krótki prompt, mały limit wyjścia. Błąd krytyczny (401/402/403/429) propaguje się wyżej. */
export async function probaPolaczenia({ api, model, stan, limit, dzis, tryb = 'vertex' }) {
  const c = cena(model, dzis, tryb); const najgorszy = (300 * c.we + 1024 * c.wy) / 1e6;
  if (stan.wydano + najgorszy > limit) return { ok: false, koszt_usd: 0, blad: 'limit kosztu mniejszy niż koszt próby połączenia' };
  const formaty = tryb === 'vertex' ? FORMATY_VERTEX : [undefined]; const odrzucone = [];
  for (const format of formaty) {
    let odp;
    try { odp = odczytajOdpowiedz(await api.generuj({ model, system: 'Odpowiadaj wyłącznie obiektem JSON.', input: 'Zwróć obiekt JSON {"ok": true}.', schemat: SCHEMAT_PROBY, maxTokens: 1024, ...(format ? { format } : {}) })); }
    catch (e) { if (e.status === 400 && format !== formaty[formaty.length - 1]) { odrzucone.push({ format, blad: e.message }); continue; } e.odrzucone_formaty = odrzucone; throw e; } /* 400 = ten format odrzucony, próbuj następny (400 nie jest rozliczany) */
    if (format) api.format = format;
    const k = kosztUsd(odp.uzycie, model, dzis, tryb); stan.wydano += k; stan.netto = (stan.netto ?? 0) + kosztNettoUsd(odp.uzycie, model, dzis, tryb);
    const p = parsujPoze(odp.tekst);
    return { ok: !p.blad && p.poza?.ok === true && odp.status === 'completed', koszt_usd: k, status: odp.status, blad: p.blad ?? null, format: format ?? null, odrzucone_formaty: odrzucone };
  }
}

/* ---------- pętla ---------- */
/** Jedno ćwiczenie: generuj → waliduj → poprawki. Zwraca wpis raportu; `stan.wydano` rośnie o koszt każdego wywołania; przekroczenie limitu przerywa z `przerwane: 'limit'`. */
export async function opracujCwiczenie({ api, kontrakt, rodzina, cwiczenie, model, proby, limit, stan, przyklady, wsk, zegar = () => Date.now(), dzis, tryb = 'gemini' }) {
  const wpis = { cwiczenie, proby: 0, ok: false, pierwsza_proba_ok: false, poprawki: 0, koszt_usd: 0, czas_ms: 0, bledy_historia: [], poza: null, przerwane: null };
  const schemat = kontrakt.schematPozy(rodzina); const opis = kontrakt.opisKontraktu(rodzina); const t0 = zegar(); let poprzednia = null;
  for (let n = 1; n <= proby; n++) {
    const najgorszy = ((przyblizTokeny(SYSTEM + opis) + 4000) * cena(model, dzis, tryb).we + MAX_TOKENS_ODPOWIEDZI * cena(model, dzis, tryb).wy) / 1e6; /* górna granica jednego wywołania */
    if (stan.wydano + najgorszy > limit) { wpis.przerwane = 'limit'; break; }
    const input = budujPrompt({ rodzina, cwiczenie, opis, przyklady, wsk, poprzednia });
    let odp;
    try { odp = odczytajOdpowiedz(await api.generuj({ model, system: SYSTEM, input, schemat })); } catch (e) { wpis.bledy_historia.push([{ kod: 'api', szczegol: e.message }]); wpis.przerwane = 'api'; if (e.krytyczny) wpis.krytyczny = e.message; break; }
    const k = kosztUsd(odp.uzycie, model, dzis, tryb); const kn = kosztNettoUsd(odp.uzycie, model, dzis, tryb); stan.wydano += k; stan.netto = (stan.netto ?? 0) + kn; wpis.koszt_usd += k; wpis.proby = n;
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
    rodzina: rap.rodzina, api: rap.api, model: rap.model, cwiczen: w.length, przeszlo: ok.length, za_pierwszym_razem: w.filter((x) => x.pierwsza_proba_ok).length,
    poprawek: w.reduce((s, x) => s + x.poprawki, 0), wywolan: w.reduce((s, x) => s + x.proby, 0), nieudane: w.filter((x) => !x.ok).map((x) => `${x.cwiczenie} (${x.przerwane})`),
    koszt_usd: Number(w.reduce((s, x) => s + x.koszt_usd, 0).toFixed(4)), czas_s: Math.round(w.reduce((s, x) => s + x.czas_ms, 0) / 1000), limit_usd: rap.limit_usd, zatrzymano_limitem: w.some((x) => x.przerwane === 'limit'),
  };
}
export function podsumowanieMd(s, krytyczny = null) {
  const p = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '—');
  return ['# Pilotaż póz przez API (propozycje do przeglądu)', '', `Rodzina \`${s.rodzina}\`, API \`${s.api ?? 'gemini'}\`, model \`${s.model}\`. Nic nie zapisano w repozytorium; nałożenie po przeglądzie: \`node scripts/figures/gemini-pozy.mjs --zastosuj <katalog>\`.`, '',
    '| miara | wartość |', '|---|---|', `| ćwiczeń | ${s.cwiczen} |`, `| przeszło walidację | ${s.przeszlo} (${p(s.przeszlo, s.cwiczen)}) |`, `| za pierwszym razem | ${s.za_pierwszym_razem} (${p(s.za_pierwszym_razem, s.cwiczen)}) |`,
    `| poprawek (ponowień po błędzie) | ${s.poprawek} |`, `| wywołań API | ${s.wywolan} |`, `| koszt | ${s.koszt_usd.toFixed(2)} USD (limit ${s.limit_usd} USD${s.zatrzymano_limitem ? ', ZATRZYMANO LIMITEM' : ''}) |`, `| czas | ${s.czas_s} s |`,
    ...(krytyczny ? ['', `PRZEBIEG ZATRZYMANY (błąd klucza, uprawnień, rozliczeń lub przydziału; bez dalszych prób): ${krytyczny}`] : []), ...(s.nieudane.length ? ['', `Nieudane: ${s.nieudane.join('; ')}`] : [])].join('\n') + '\n';
}

/* ---------- szacunek ---------- */
/** Szacunek kosztu rodziny (n ćwiczeń) i całości (liczba ćwiczeń). Wejście mierzone z promptu (jeśli kontrakt jest), wyjście z ZALOZENIA — oznaczone jako założenie. */
export function szacunek({ model, liczbaCwiczen, tokenyWejsciaNaProbe, dzis, zal = ZALOZENIA, tryb = 'gemini' }) {
  const c = cena(model, dzis, tryb); const prob = liczbaCwiczen * zal.srednia_prob;
  const we = prob * (tokenyWejsciaNaProbe + (zal.srednia_prob > 1 ? zal.wyjscie_poza * 0.5 : 0)); const wy = prob * (zal.wyjscie_poza + zal.myslenie);
  return { model, api: tryb, cwiczen: liczbaCwiczen, prob: Math.round(prob), tokeny_we: Math.round(we), tokeny_wy: Math.round(wy), koszt_usd: Number(((we * c.we + wy * c.wy) / 1e6).toFixed(2)), zalozenia: zal, cena: c };
}

/* ---------- uruchomienie ---------- */
export function parsujArgumenty(argv) {
  const o = { rodzina: null, api: DOMYSLNY_API, lokalizacja: DOMYSLNA_LOKALIZACJA, listaModeli: false, model: DOMYSLNY_MODEL, limitUsd: LIMIT_USD, proby: PROBY, szacuj: false, wyjscie: 'raport-pozy', zastosuj: null, cwiczenia: null, lista: null };
  const wart = (i, n) => { if (i + 1 >= argv.length) throw new Error(`brak wartości dla ${n}`); return argv[i + 1]; };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--szacuj') o.szacuj = true;
    else if (a === '--rodzina') { o.rodzina = wart(i++, a); if (!/^[a-z][a-z0-9_]{1,40}$/.test(o.rodzina)) throw new Error('--rodzina: oczekiwany identyfikator rodziny (małe litery, cyfry, _)'); }
    else if (a === '--api') { o.api = wart(i++, a); if (!API_TRYBY.includes(o.api)) throw new Error(`nieznany tryb --api: ${o.api} (dozwolone: ${API_TRYBY.join(', ')})`); }
    else if (a === '--lokalizacja') { o.lokalizacja = wart(i++, a); if (!LOKALIZACJE.includes(o.lokalizacja)) throw new Error(`nieznana --lokalizacja: ${o.lokalizacja} (dozwolone: ${LOKALIZACJE.join(', ')})`); }
    else if (a === '--lista-modeli') o.listaModeli = true;
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

export async function main(argv, env, { fetchFn = fetch, log: logSurowy = console.log, root = ROOT, dzis = new Date(), zegar = () => Date.now(), spij } = {}) {
  const o = parsujArgumenty(argv);
  const klucz = env.GEMINI_API_KEY || '';
  const log = (s) => logSurowy(maskuj(s, klucz)); /* nic nie wychodzi bez maskowania */
  const zapisz = (nazwa, tresc) => writeFileSync(join(o.wyjscie, nazwa), maskuj(tresc, klucz));
  if (o.listaModeli) { /* diagnostyka bez kosztu: tylko klucz + sieć, bez kontraktu i bez docs/51 */
    if (!klucz) { log('brak GEMINI_API_KEY — lista modeli niemożliwa'); return 2; }
    mkdirSync(o.wyjscie, { recursive: true });
    const w = await listaModeli({ fetchFn, klucz, lokalizacja: o.lokalizacja, log });
    zapisz('modele.json', JSON.stringify(w, null, 1) + '\n');
    return w.krytyczny ? 5 : 0;
  }
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
  const sz = szacunek({ model: o.model, liczbaCwiczen: lista.length, tokenyWejsciaNaProbe: wejscie, dzis, tryb: o.api });
  log(`rodzina ${o.rodzina}: ${lista.length} ćwiczeń; API ${o.api}${o.api === 'vertex' ? ` (${o.lokalizacja})` : ''}; model ${o.model}; szacunek (założenia, nie pomiar): ${sz.koszt_usd.toFixed(2)} USD; limit ${o.limitUsd} USD${kontrakt ? '' : ' [brak kontraktu v2-validate.mjs — wejście z założenia]'}`);
  zapisz('szacunek.json', JSON.stringify({ ...sz, kontrakt: !!kontrakt, limit_usd: o.limitUsd }, null, 1) + '\n');
  if (o.szacuj) return 0;
  if (!kontrakt) { log('brak scripts/figures/v2-validate.mjs (gałąź grafiki-cwiczen) — przebieg płatny niemożliwy'); return 4; }
  if (!klucz) { log('brak GEMINI_API_KEY — przebieg płatny niemożliwy (użyj --szacuj)'); return 2; }
  if (sz.koszt_usd > o.limitUsd) log(`UWAGA: szacunek ${sz.koszt_usd.toFixed(2)} USD przekracza limit ${o.limitUsd} USD — przebieg zatrzyma się na limicie (część ćwiczeń zostanie pominięta)`);
  const api = klient(fetchFn, klucz, { tryb: o.api, lokalizacja: o.lokalizacja, ...(spij ? { spij } : {}) }); const stan = { wydano: 0, netto: 0 }; let wyniki = []; let polaczenie = null; let krytyczny = null;
  const pominiete = (cw, powod) => ({ cwiczenie: cw, proby: 0, ok: false, pierwsza_proba_ok: false, poprawki: 0, koszt_usd: 0, czas_ms: 0, bledy_historia: [], poza: null, przerwane: powod });
  if (o.api === 'vertex') {
    try {
      polaczenie = await probaPolaczenia({ api, model: o.model, stan, limit: o.limitUsd, dzis, tryb: o.api });
      log(`próba połączenia (vertex, ${o.model}, format ${polaczenie.format ?? '?'}${polaczenie.odrzucone_formaty?.length ? `; odrzucone: ${polaczenie.odrzucone_formaty.map((x) => x.format).join(', ')}` : ''}): ${polaczenie.ok ? 'OK' : `odpowiedź nietypowa (status ${polaczenie.status ?? '?'}${polaczenie.blad ? `, ${polaczenie.blad}` : ''}) — kontynuuję`}; ${polaczenie.koszt_usd.toFixed(5)} USD`);
    } catch (e) {
      if (!e.krytyczny) polaczenie = { ok: false, koszt_usd: 0, blad: e.message, odrzucone_formaty: e.odrzucone_formaty ?? [] }; /* np. 5xx: pokazujemy błąd, pętla ćwiczeń sama go zgłosi per ćwiczenie */
      else { polaczenie = { ok: false, koszt_usd: 0, blad: e.message, odrzucone_formaty: e.odrzucone_formaty ?? [] }; krytyczny = e.message; log(`PRÓBA POŁĄCZENIA NIEUDANA — STOP bez dalszych prób: ${e.message}`); for (const x of e.odrzucone_formaty ?? []) log(`  format ${x.format} odrzucony wcześniej: ${x.blad}`); }
      if (!e.krytyczny) log(`próba połączenia nieudana: ${e.message}`);
    }
  }
  if (krytyczny) wyniki = lista.map((cw) => pominiete(cw, 'api'));
  else for (const cw of lista) {
    const w = await opracujCwiczenie({ api, kontrakt, rodzina: o.rodzina, cwiczenie: cw, model: o.model, proby: o.proby, limit: o.limitUsd, stan, przyklady: przykladyWzor, wsk: wskazowki(cw, root), zegar, dzis, tryb: o.api });
    wyniki.push(w); log(`${w.ok ? 'OK ' : 'NIE'} ${cw} (prób ${w.proby}, ${w.koszt_usd.toFixed(3)} USD)`);
    if (w.przerwane === 'limit') { for (const reszta of lista.slice(wyniki.length)) wyniki.push(pominiete(reszta, 'limit')); break; }
    if (w.krytyczny) { krytyczny = w.krytyczny; log(`STOP bez dalszych prób: ${w.krytyczny}`); for (const reszta of lista.slice(wyniki.length)) wyniki.push(pominiete(reszta, 'api')); break; }
  }
  const rap = { rodzina: o.rodzina, api: o.api, lokalizacja: o.lokalizacja, model: o.model, limit_usd: o.limitUsd, polaczenie, wyniki };
  const s = podsumowanie(rap); s.koszt_usd = Number(stan.wydano.toFixed(4)); /* łącznie z próbą połączenia */
  zapisz('poze.json', JSON.stringify({ rodzina: o.rodzina, api: o.api, model: o.model, poze: Object.fromEntries(wyniki.filter((x) => x.ok).map((x) => [x.cwiczenie, x.poza])) }, null, 1) + '\n');
  zapisz('raport.json', JSON.stringify(rap, null, 1) + '\n');
  zapisz('koszt.json', JSON.stringify({ koszt_usd: s.koszt_usd, koszt_po_promocji_usd: Number(stan.netto.toFixed(4)), limit_usd: o.limitUsd, api: o.api, model: o.model, wywolan: s.wywolan + (polaczenie ? 1 : 0), czas_s: s.czas_s }, null, 1) + '\n');
  zapisz('podsumowanie.md', podsumowanieMd(s, krytyczny));
  log(`raport: ${o.wyjscie}/ — przeszło ${s.przeszlo}/${s.cwiczen}, za 1. razem ${s.za_pierwszym_razem}, koszt ${s.koszt_usd.toFixed(2)} USD`);
  return krytyczny ? 5 : s.zatrzymano_limitem ? 3 : wyniki.some((x) => x.przerwane === 'api') ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2), process.env).then((c) => process.exit(c), (e) => { console.error(`błąd: ${maskuj(e.message, process.env.GEMINI_API_KEY)}`); process.exit(1); });
}
