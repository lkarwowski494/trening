// Wskazówki techniki (etap 1, decyzja właściciela 08.10.2026 ok. 23:50): generuje docs/research/27-wskazowki-zrodla.md z data/zrodla/cues.json
// i lib/cues/text/pl.json oraz sprawdza dane (każda wskazówka ≥ 2 źródła z różnych organizacji, istniejące id, 2–4 wskazówki…).
// Dokument jest generowany z danych — nie przepisywać ręcznie (CLAUDE.md; wzór scripts/equipment/gen.mjs).
// Użycie: node scripts/cues/gen.mjs  (zapis) | node scripts/cues/gen.mjs --check  (verify: błędne dane albo nieaktualny dokument → kod 1)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const DATA = join(root, 'data/zrodla/cues.json');
const PL = join(root, 'lib/cues/text/pl.json');
const OUT = join(root, 'docs/research/27-wskazowki-zrodla.md');

export const SECTIONS = { setup: 'Ustawienie', move: 'Ruch', tips: 'Wskazówki', mistakes: 'Czego unikać' };
/** Liczba wskazówek w sekcji „Wskazówki” (polecenie: 2–4 najważniejsze) i minimalna liczba niezależnych organizacji na wskazówkę.
 * „Częste błędy” — 0–4: sekcja znika, gdy żaden błąd nie ma dwóch źródeł (nie dopisujemy błędów z jednego źródła). */
export const TIPS_MIN = 2, TIPS_MAX = 4, MIN_ORGS = 2;
/** Rodzaj organizacji (podpis w aplikacji bez nazw — audyt kontrolny 1 MER2-07, decyzja właściciela 09.10.2026 wariant A); = CUE_BASIS_KINDS w lib/cues. */
/** Znaczniki odwołań (trzeci element [źródło, miejsce, znacznik]) — audyt kontrolny 1 MER2-04: „analogia” = źródło opisuje inne ćwiczenie
 * (np. High Row przy Face Pull); takie odwołanie zostaje w dokumencie jako kontekst, ale nie liczy się do MIN_ORGS. */
export const MARKS = { analogia: 'analogia — inne ćwiczenie; nie liczy się do ≥ 2 źródeł' };
export const KINDS = { org: 'organizacja szkoleniowa (biblioteka ćwiczeń)', site: 'serwis specjalistyczny', maker: 'producent sprzętu', study: 'badanie (czasopismo recenzowane)', book: 'książka uznanego autora (szczebel 3; tytuł tylko na prywatnym Dysku)' };

/** id zdań używane przez zestawy ogólne (cue-sets.json). */
function idsZestawow() { const f = join(root, 'lib/figures/v2/cue-sets.json'); return existsSync(f) ? Object.values(JSON.parse(readFileSync(f, 'utf8')).items).flatMap(e => [...(e.ok ?? []), ...(e.err ?? [])]) : []; }
/** Szczebel źródła: własny (`level` źródła — organizacje warunkowe oceniane per strona) albo szczebel organizacji. */
export function srcLevel(data, s) { return s?.level ?? data.orgs?.[s?.org]?.level; }
/** Maksymalny szczebel źródła, które liczy się do pary (szczebel 5 = tylko wskazówka, nie para — CLAUDE.md, hierarchia; decyzje 02.11.2026). */
export const MAX_COUNT_LEVEL = 4;
/** Nieprzezroczysty identyfikator książki (decyzja właściciela 02.11.2026: tytuł, autorzy i cytat tylko na prywatnym Dysku). */
export const BOOK_ID_RE = /^dysk-k\d+$/;
/** Pola zdania poza `c` i `s`: `uproszczenie` (opis), `jedno_zrodlo` (ustawienie/ruch z jednego źródła szczebla ≤ 3). */
const CUE_FIELDS = ['c', 's', 'uproszczenie', 'jedno_zrodlo'];
/** Organizacje liczące się do pary: źródła bez znacznika „analogia”, nie „wniosek”, szczebla ≤ MAX_COUNT_LEVEL. */
export function liczaceOrg(data, refs) {
  const orgs = new Set();
  for (const ref of refs) { const [sid, , mark] = Array.isArray(ref) ? ref : []; const s = data.sources?.[sid]; if (s && mark === undefined && srcLevel(data, s) <= MAX_COUNT_LEVEL) orgs.add(s.org); }
  return orgs;
}
/** `id zdania → sekcja` w ćwiczeniu. */
const sekcjeZdan = x => { const m = new Map(); for (const sec of Object.keys(SECTIONS)) for (const r of x[sec] ?? []) if (r && typeof r.c === 'string' && !m.has(r.c)) m.set(r.c, sec); return m; };
/** `extraUsed` — id zdań używane przez zestawy ogólne (lib/figures/v2/cue-sets.json, od 27.10.2026): mają tekst w pl.json, ale nie występują w data.json (własne wskazówki ćwiczeń). */
export function validate(data, pl, extraUsed = idsZestawow()) {
  const errs = [];
  const used = new Set(extraUsed), usedSrc = new Set();
  for (const [id, o] of Object.entries(data.orgs ?? {})) {
    if (!o || typeof o.name !== 'string' || ![2, 3, 4, 5].includes(o.level)) errs.push(`orgs.${id}: nazwa i szczebel 2–5`);
    if (!o || !Object.prototype.hasOwnProperty.call(KINDS, o.kind)) errs.push(`orgs.${id}: rodzaj (${Object.keys(KINDS).join(', ')})`);
    if (o && o.warunkowo !== undefined && (typeof o.warunkowo !== 'string' || !o.warunkowo.trim())) errs.push(`orgs.${id}: warunkowo — opis warunku szczebla 4`);
    if (o && o.kind === 'book') {
      if (!BOOK_ID_RE.test(id) || o.name !== id) errs.push(`orgs.${id}: książka — nieprzezroczysty identyfikator (dysk-kN) jako id i nazwa; tytuł tylko na prywatnym Dysku`);
      if (o.level !== 3) errs.push(`orgs.${id}: książka — szczebel 3`);
    }
  }
  for (const [id, s] of Object.entries(data.sources ?? {})) {
    const org = data.orgs?.[s?.org];
    if (!s || !org) errs.push(`sources.${id}: nieznana organizacja ${s && s.org}`);
    if (!s || typeof s.title !== 'string' || !s.title) errs.push(`sources.${id}: tytuł`);
    if (org?.kind === 'book') {
      if (s.url !== undefined || s.archive !== undefined) errs.push(`sources.${id}: książka — bez adresu i migawki (tytuł i cytat tylko na prywatnym Dysku)`);
      if (typeof s.title === 'string' && !BOOK_ID_RE.test(s.title)) errs.push(`sources.${id}: książka — tytuł to nieprzezroczysty identyfikator (dysk-kN)`);
    } else if (!s || !/^https:\/\//.test(s.url)) errs.push(`sources.${id}: adres https`);
    if (s && s.archive !== undefined && org?.kind !== 'book' && !/^https:\/\/web\.archive\.org\/web\/\d{8,14}\//.test(s.archive)) errs.push(`sources.${id}: archive musi być migawką Wayback`);
    if (s && s.level !== undefined && ![2, 3, 4, 5].includes(s.level)) errs.push(`sources.${id}: szczebel`);
    if (s && org && org.warunkowo === undefined && s.level !== undefined && s.level !== org.level) errs.push(`sources.${id}: szczebel źródła różni się od szczebla organizacji (własny szczebel tylko dla organizacji warunkowych)`);
    if (s && org?.warunkowo !== undefined) {
      if (![4, 5].includes(s.level)) errs.push(`sources.${id}: organizacja warunkowa — szczebel strony (4 albo 5) wpisany przy źródle`);
      else if (s.level === 4 && (typeof s.strona !== 'string' || !s.strona.trim())) errs.push(`sources.${id}: szczebel 4 wymaga opisu strony (autor z kwalifikacjami, data) w polu strona`);
      else if (s.level === 5 && (typeof s.strona !== 'string' || !s.strona.trim())) errs.push(`sources.${id}: szczebel 5 wymaga uzasadnienia w polu strona`);
    }
  }
  const partial = new Set(data.partial ?? []);
  for (const ex of partial) {
    const x = data.exercises?.[ex];
    if (!x) { errs.push(`partial.${ex}: ćwiczenie nie ma wskazówek`); continue; }
    if ((x.setup ?? []).length >= 1 && (x.move ?? []).length >= 1 && (x.tips ?? []).length >= TIPS_MIN) errs.push(`partial.${ex}: komplet sekcji — wpis zbędny`);
    if (Object.keys(SECTIONS).reduce((a, sec) => a + (x[sec] ?? []).length, 0) < TIPS_MIN) errs.push(`partial.${ex}: łącznie mniej niż ${TIPS_MIN} wskazówki`);
  }
  const luki = data.luki ?? {}, lukiUzyte = new Set();
  for (const [k, why] of Object.entries(luki)) {
    const [ex, c] = k.split('::');
    if (typeof why !== 'string' || !why.trim()) errs.push(`luki.${k}: powód`);
    if (!data.exercises?.[ex] || !sekcjeZdan(data.exercises[ex]).has(c)) errs.push(`luki.${k}: nieistniejące zdanie`);
  }
  for (const [ex, x] of Object.entries(data.exercises ?? {})) {
    const zdania = sekcjeZdan(x);
    for (const sec of Object.keys(x)) if (!(sec in SECTIONS)) errs.push(`${ex}: nieznana sekcja ${sec}`);
    for (const sec of Object.keys(SECTIONS)) {
      const list = x[sec] ?? [];
      /* 0.14.0 (partie 1–2 researchu, docs/research/31 i 33): ćwiczenia z listy „partial” mogą nie mieć ustawienia, ruchu lub 2 wskazówek — research potwierdził
       * tylko część sekcji, a braków nie dopisujemy z jednego źródła; wystarczy łącznie ≥ TIPS_MIN wskazówek (sprawdzane niżej), górne granice zostają. */
      const part = partial.has(ex);
      if (sec === 'tips' ? (!part && list.length < TIPS_MIN) || list.length > TIPS_MAX : sec === 'mistakes' ? list.length > TIPS_MAX : (!part && list.length < 1)) errs.push(`${ex}: sekcja ${sec} ma ${list.length} pozycji`);
      const ids = new Set();
      for (const r of list) {
        if (!r || typeof r.c !== 'string' || !Object.prototype.hasOwnProperty.call(pl, r.c)) { errs.push(`${ex}.${sec}: brak tekstu PL dla ${r && r.c}`); continue; }
        if (ids.has(r.c)) errs.push(`${ex}.${sec}: powtórzone zdanie ${r.c}`); ids.add(r.c); used.add(r.c);
        for (const f of Object.keys(r)) if (!CUE_FIELDS.includes(f)) errs.push(`${ex}.${r.c}: nieznane pole ${f}`);
        if (r.uproszczenie !== undefined && (typeof r.uproszczenie !== 'string' || !r.uproszczenie.trim())) errs.push(`${ex}.${r.c}: uproszczenie — niepusty opis`);
        if (r.jedno_zrodlo !== undefined && r.jedno_zrodlo !== true) errs.push(`${ex}.${r.c}: jedno_zrodlo może mieć tylko wartość true`);
        if (!Array.isArray(r.s)) { errs.push(`${ex}.${r.c}: brak źródeł`); continue; }
        let wnioski = 0;
        const zrodla = [];
        for (const ref of r.s) {
          const [sid, at, mark] = Array.isArray(ref) ? ref : [];
          if (sid === 'wniosek') { /* błąd wnioskowany ze zdania tej karty (decyzja 02.11.2026 ~14:15): `at` = id zdania */
            if (sec !== 'mistakes') { errs.push(`${ex}.${r.c}: wniosek tylko w sekcji błędów`); continue; }
            const ssec = zdania.get(at);
            if (ssec === undefined) { errs.push(`${ex}.${r.c}: wniosek ze zdania spoza tej karty (${at})`); continue; }
            if (ssec === 'mistakes') { errs.push(`${ex}.${r.c}: wniosek ze zdania błędu (${at}) — błąd wynika ze zdania ustawienia, ruchu lub wskazówki`); continue; }
            const src = x[ssec].find(q => q.c === at);
            if (!liczaceOrg(data, src.s ?? []).size) { errs.push(`${ex}.${r.c}: wniosek ze zdania bez własnych źródeł (${at})`); continue; }
            wnioski++; continue;
          }
          const s = data.sources?.[sid];
          if (!s) { errs.push(`${ex}.${r.c}: nieznane źródło ${sid}`); continue; }
          if (typeof at !== 'string' || !at.trim()) errs.push(`${ex}.${r.c}: brak miejsca w źródle ${sid}`);
          if (mark !== undefined && !Object.prototype.hasOwnProperty.call(MARKS, mark)) errs.push(`${ex}.${r.c}: nieznany znacznik „${mark}” przy ${sid} (dozwolone: ${Object.keys(MARKS).join(', ')})`);
          usedSrc.add(sid); zrodla.push(ref);
        }
        const orgs = liczaceOrg(data, zrodla);
        const klucz = `${ex}::${r.c}`;
        let ok = orgs.size >= MIN_ORGS || (sec === 'mistakes' && wnioski >= 1);
        if (r.jedno_zrodlo === true) {
          if (sec !== 'setup' && sec !== 'move') errs.push(`${ex}.${r.c}: jedno_zrodlo tylko w ustawieniu i ruchu`);
          else if (orgs.size >= MIN_ORGS) errs.push(`${ex}.${r.c}: jedno_zrodlo zbędne — wskazówka ma komplet źródeł`);
          else if (orgs.size === 1 && zrodla.every(ref => !(srcLevel(data, data.sources[ref[0]]) <= 3) && ref[2] === undefined)) errs.push(`${ex}.${r.c}: jedno_zrodlo wymaga źródła szczebla ≤ 3`);
          else if (orgs.size === 1) ok = true;
        }
        if (klucz in luki) { lukiUzyte.add(klucz); if (ok) errs.push(`luki.${klucz}: wskazówka ma komplet źródeł — luka zbędna`); }
        else if (!ok) errs.push(`${ex}.${r.c}: ${orgs.size} organizacja(e) — wymagane ≥ ${MIN_ORGS} niezależne źródła`);
      }
    }
  }
  for (const k of Object.keys(pl)) { if (!used.has(k)) errs.push(`pl.json: nieużywane zdanie ${k}`); if (typeof pl[k] !== 'string' || !pl[k].trim()) errs.push(`pl.json: puste ${k}`); }
  for (const k of Object.keys(data.sources ?? {})) if (!usedSrc.has(k)) errs.push(`sources.${k}: nieużywane źródło`);
  for (const k of Object.keys(data.open ?? {})) { if (data.exercises?.[k]) errs.push(`open.${k}: ćwiczenie ma wskazówki`); if (typeof data.open[k] !== 'string' || !data.open[k].trim()) errs.push(`open.${k}: brak powodu`); }
  return errs;
}

const md = s => String(s).replace(/\|/g, '\\|');
/** Odwołanie do źródła w dokumencie: książka — tylko id i miejsce; „wniosek” — zdanie tej karty; szczebel 5 — z oznaczeniem (nie liczy się do pary). */
const refMd = data => ([sid, at, mark]) => {
  if (sid === 'wniosek') return `wniosek ze zdania \`${at}\` tej karty`;
  const s = data.sources[sid], lv = srcLevel(data, s), tag = lv > MAX_COUNT_LEVEL ? `szczebel ${lv} — nie liczy się do pary; ` : '';
  const who = data.orgs[s.org].kind === 'book' ? `${s.title}` : `${s.org}: [${md(s.title)}](${s.archive ?? s.url})`;
  return `${who} (${tag}${mark ? `${md(MARKS[mark] ?? mark)}; ` : ''}${md(at)})`;
};
export function render(data, pl) {
  const exs = Object.keys(data.exercises);
  const nCues = exs.reduce((a, k) => a + Object.values(data.exercises[k]).reduce((b, l) => b + l.length, 0), 0);
  const L = [];
  L.push('# 27 — Wskazówki techniki: źródła (generowane)');
  L.push('');
  L.push('AUTOMATYCZNIE WYGENEROWANE przez `scripts/cues/gen.mjs` z `data/zrodla/cues.json` i `lib/cues/text/pl.json` — nie edytować ręcznie.');
  L.push('Sprawdzanie: `node scripts/cues/gen.mjs --check` (część `npm run verify`).');
  L.push('');
  L.push('Decyzja właściciela: docs/18, 08.10.2026 (ok. 23:50) — wariant A etapami; etap 1 = własne wskazówki tekstowe dla ćwiczeń bazowych (research: docs/research/26).');
  L.push('');
  L.push('## Zasady');
  L.push('');
  L.push(`- Każda wskazówka ma co najmniej ${MIN_ORGS} przeczytane źródła z różnych organizacji (sprawdza skrypt); miejsce w źródle podane przy odwołaniu.`);
  L.push('- Sformułowania własne (parafraza faktów i metod — art. 1 ust. 2¹ pr. aut.); zdań źródeł nie kopiujemy.');
  L.push('- Bez twierdzeń medycznych („zapobiega kontuzjom” itp.); w aplikacji stopka z odesłaniem do lekarza lub fizjoterapeuty.');
  L.push('- Tylko część wspólna źródeł; gdzie źródła się różnią (np. głębokość, rozstaw), wskazówka mówi tyle, ile mówią wszystkie, albo podaje przedział.');
  L.push('- Strony ExRx.net czytane przez Wayback Machine (bezpośrednio HTTP 403) — przy źródle adres migawki.');
  L.push('- Źródło opisujące inne ćwiczenie (np. High Row przy Face Pull) ma znacznik „analogia” i nie liczy się do minimum źródeł; wariant tego samego ćwiczenia (np. wyciskanie siedząc i stojąc, hantle i sztanga) — z opisem w miejscu odwołania (audyt kontrolny 1 MER2-04, 09.10.2026).');
  L.push('');
  L.push('## Organizacje i szczeble (hierarchia z CLAUDE.md)');
  L.push('');
  L.push('W aplikacji podpis „Na podstawie: …” podaje tylko rodzaje źródeł (kolumna „Rodzaj”), bez nazw organizacji i marek (audyt kontrolny 1 MER2-07, decyzja właściciela 09.10.2026, wariant A); pełna lista — ten dokument.');
  L.push('');
  L.push('| Skrót | Organizacja | Szczebel | Rodzaj (podpis w aplikacji) |');
  L.push('|---|---|---|---|');
  for (const [id, o] of Object.entries(data.orgs)) L.push(`| ${md(id)} | ${md(o.name)} | ${o.level}${o.warunkowo ? ` (warunkowo 4: ${md(o.warunkowo)})` : ''} | ${md(KINDS[o.kind] ?? '?')} |`);
  L.push('');
  L.push(`## Podsumowanie`);
  L.push('');
  L.push(`- Ćwiczenia ze wskazówkami: ${exs.length}; zdań (z powtórzeniami między ćwiczeniami): ${nCues}; unikalnych zdań: ${new Set(exs.flatMap(e => Object.keys(SECTIONS).flatMap(sec => (data.exercises[e][sec] ?? []).map(r => r.c)))).size}; źródeł: ${Object.keys(data.sources).length}.`);
  const open = Object.entries(data.open ?? {});
  L.push(`- Ćwiczenia bazowe bez wskazówek (otwarte): ${open.length}.`);
  if ((data.partial ?? []).length) L.push(`- Ćwiczenia z niepełnym zestawem sekcji (research potwierdził tylko część; braków nie dopisujemy z jednego źródła): ${data.partial.length} — ${data.partial.map(md).join(', ')}.`);
  L.push('');
  if (open.length) {
    L.push('## Otwarte — bez wskazówek');
    L.push('');
    L.push('| Ćwiczenie | Powód |');
    L.push('|---|---|');
    for (const [k, why] of open) L.push(`| ${md(k)} | ${md(why)} |`);
    L.push('');
  }
  const luki = Object.entries(data.luki ?? {});
  if (luki.length) {
    L.push('## Luki — wskazówki bez pary źródeł');
    L.push('');
    L.push('Po przeliczeniu szczebli (docs/18, 02.11.2026) wskazówka ma tylko jedno źródło szczebla ≤ 4; zostaje w danych do uzupełnienia przez badacza, a lista może się tylko skracać (skrypt zgłasza lukę, która ma już parę).');
    L.push('');
    L.push('| Ćwiczenie | Zdanie | Powód |');
    L.push('|---|---|---|');
    for (const [k, why] of luki) { const [ex, c] = k.split('::'); L.push(`| ${md(ex)} | \`${c}\` | ${md(why)} |`); }
    L.push('');
  }
  L.push('## Wskazówki i źródła');
  L.push('');
  for (const ex of exs) {
    L.push(`### ${ex}`);
    L.push('');
    for (const [sec, label] of Object.entries(SECTIONS)) {
      const list = data.exercises[ex][sec] ?? [];
      if (!list.length) continue;
      L.push(`**${label}**`);
      L.push('');
      for (const r of list) L.push(`- ${pl[r.c]} — ${r.s.map(refMd(data)).join('; ')}${r.uproszczenie ? ` [uproszczenie: ${md(r.uproszczenie)}]` : ''}${r.jedno_zrodlo ? ' [jedno źródło]' : ''} \`${r.c}\``);
      L.push('');
    }
  }
  L.push('## Źródła');
  L.push('');
  L.push('| Id | Organizacja | Tytuł | Adres | Migawka (odczyt) |');
  L.push('|---|---|---|---|---|');
  for (const [id, s] of Object.entries(data.sources).sort((a, b) => a[0].localeCompare(b[0]))) L.push(`| ${md(id)} | ${md(s.org)} | ${md(s.title)} | ${s.url ?? '—'} | ${s.archive ?? '—'} |`);
  L.push('');
  return L.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const data = JSON.parse(readFileSync(DATA, 'utf8')); const pl = JSON.parse(readFileSync(PL, 'utf8'));
  const sets = JSON.parse(readFileSync(join(root, 'lib/figures/v2/cue-sets.json'), 'utf8')).items;
  const errs = validate(data, pl, Object.values(sets).flatMap(e => [...(e.ok ?? []), ...(e.err ?? [])]));
  if (errs.length) { console.error('Błędy danych wskazówek:\n' + errs.map(e => '  ' + e).join('\n')); process.exit(1); }
  const out = render(data, pl);
  if (process.argv.includes('--check')) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== out) { console.error('docs/research/27-wskazowki-zrodla.md nieaktualny — uruchom: node scripts/cues/gen.mjs'); process.exit(1); }
    console.log(`wskazówki: ${Object.keys(data.exercises).length} ćwiczeń, dokument aktualny`);
  } else { writeFileSync(OUT, out); console.log('zapisano', OUT); }
}
