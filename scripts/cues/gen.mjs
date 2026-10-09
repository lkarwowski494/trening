// Wskazówki techniki (etap 1, decyzja właściciela 08.10.2026 ok. 23:50): generuje docs/research/27-wskazowki-zrodla.md z lib/cues/data.json
// i lib/cues/text/pl.json oraz sprawdza dane (każda wskazówka ≥ 2 źródła z różnych organizacji, istniejące id, 2–4 wskazówki…).
// Dokument jest generowany z danych — nie przepisywać ręcznie (CLAUDE.md; wzór scripts/equipment/gen.mjs).
// Użycie: node scripts/cues/gen.mjs  (zapis) | node scripts/cues/gen.mjs --check  (verify: błędne dane albo nieaktualny dokument → kod 1)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const DATA = join(root, 'lib/cues/data.json');
const PL = join(root, 'lib/cues/text/pl.json');
const OUT = join(root, 'docs/research/27-wskazowki-zrodla.md');

export const SECTIONS = { setup: 'Ustawienie', move: 'Ruch', tips: 'Wskazówki', mistakes: 'Częste błędy' };
/** Liczba wskazówek w sekcji „Wskazówki” (polecenie: 2–4 najważniejsze) i minimalna liczba niezależnych organizacji na wskazówkę.
 * „Częste błędy” — 0–4: sekcja znika, gdy żaden błąd nie ma dwóch źródeł (nie dopisujemy błędów z jednego źródła). */
export const TIPS_MIN = 2, TIPS_MAX = 4, MIN_ORGS = 2;

export function validate(data, pl) {
  const errs = [];
  const used = new Set(), usedSrc = new Set();
  for (const [id, o] of Object.entries(data.orgs ?? {})) if (!o || typeof o.name !== 'string' || ![2, 3, 4].includes(o.level)) errs.push(`orgs.${id}: nazwa i szczebel 2–4`);
  for (const [id, s] of Object.entries(data.sources ?? {})) {
    if (!s || !data.orgs?.[s.org]) errs.push(`sources.${id}: nieznana organizacja ${s && s.org}`);
    if (!s || typeof s.title !== 'string' || !s.title) errs.push(`sources.${id}: tytuł`);
    if (!s || !/^https:\/\//.test(s.url)) errs.push(`sources.${id}: adres https`);
    if (s && s.archive !== undefined && !/^https:\/\/web\.archive\.org\/web\/\d{8,14}\//.test(s.archive)) errs.push(`sources.${id}: archive musi być migawką Wayback`);
    if (s && s.level !== data.orgs?.[s.org]?.level && ![2, 3, 4].includes(s.level)) errs.push(`sources.${id}: szczebel`);
  }
  for (const [ex, x] of Object.entries(data.exercises ?? {})) {
    for (const sec of Object.keys(x)) if (!(sec in SECTIONS)) errs.push(`${ex}: nieznana sekcja ${sec}`);
    for (const sec of Object.keys(SECTIONS)) {
      const list = x[sec] ?? [];
      if (sec === 'tips' ? list.length < TIPS_MIN || list.length > TIPS_MAX : sec === 'mistakes' ? list.length > TIPS_MAX : list.length < 1) errs.push(`${ex}: sekcja ${sec} ma ${list.length} pozycji`);
      const ids = new Set();
      for (const r of list) {
        if (!r || typeof r.c !== 'string' || !Object.prototype.hasOwnProperty.call(pl, r.c)) { errs.push(`${ex}.${sec}: brak tekstu PL dla ${r && r.c}`); continue; }
        if (ids.has(r.c)) errs.push(`${ex}.${sec}: powtórzone zdanie ${r.c}`); ids.add(r.c); used.add(r.c);
        if (!Array.isArray(r.s)) { errs.push(`${ex}.${r.c}: brak źródeł`); continue; }
        const orgs = new Set();
        for (const ref of r.s) {
          const [sid, at] = Array.isArray(ref) ? ref : [];
          const s = data.sources?.[sid];
          if (!s) { errs.push(`${ex}.${r.c}: nieznane źródło ${sid}`); continue; }
          if (typeof at !== 'string' || !at.trim()) errs.push(`${ex}.${r.c}: brak miejsca w źródle ${sid}`);
          orgs.add(s.org); usedSrc.add(sid);
        }
        if (orgs.size < MIN_ORGS) errs.push(`${ex}.${r.c}: ${orgs.size} organizacja(e) — wymagane ≥ ${MIN_ORGS} niezależne źródła`);
      }
    }
  }
  for (const k of Object.keys(pl)) { if (!used.has(k)) errs.push(`pl.json: nieużywane zdanie ${k}`); if (typeof pl[k] !== 'string' || !pl[k].trim()) errs.push(`pl.json: puste ${k}`); }
  for (const k of Object.keys(data.sources ?? {})) if (!usedSrc.has(k)) errs.push(`sources.${k}: nieużywane źródło`);
  for (const k of Object.keys(data.open ?? {})) { if (data.exercises?.[k]) errs.push(`open.${k}: ćwiczenie ma wskazówki`); if (typeof data.open[k] !== 'string' || !data.open[k].trim()) errs.push(`open.${k}: brak powodu`); }
  return errs;
}

const md = s => String(s).replace(/\|/g, '\\|');
export function render(data, pl) {
  const exs = Object.keys(data.exercises);
  const nCues = exs.reduce((a, k) => a + Object.values(data.exercises[k]).reduce((b, l) => b + l.length, 0), 0);
  const L = [];
  L.push('# 27 — Wskazówki techniki: źródła (generowane)');
  L.push('');
  L.push('AUTOMATYCZNIE WYGENEROWANE przez `scripts/cues/gen.mjs` z `lib/cues/data.json` i `lib/cues/text/pl.json` — nie edytować ręcznie.');
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
  L.push('');
  L.push('## Organizacje i szczeble (hierarchia z CLAUDE.md)');
  L.push('');
  L.push('| Skrót | Organizacja | Szczebel |');
  L.push('|---|---|---|');
  for (const [id, o] of Object.entries(data.orgs)) L.push(`| ${md(id)} | ${md(o.name)} | ${o.level} |`);
  L.push('');
  L.push(`## Podsumowanie`);
  L.push('');
  L.push(`- Ćwiczenia ze wskazówkami: ${exs.length}; zdań (z powtórzeniami między ćwiczeniami): ${nCues}; unikalnych zdań: ${Object.keys(pl).length}; źródeł: ${Object.keys(data.sources).length}.`);
  const open = Object.entries(data.open ?? {});
  L.push(`- Ćwiczenia bazowe bez wskazówek (otwarte): ${open.length}.`);
  L.push('');
  if (open.length) {
    L.push('## Otwarte — bez wskazówek');
    L.push('');
    L.push('| Ćwiczenie | Powód |');
    L.push('|---|---|');
    for (const [k, why] of open) L.push(`| ${md(k)} | ${md(why)} |`);
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
      for (const r of list) L.push(`- ${pl[r.c]} — ${r.s.map(([sid, at]) => `${data.sources[sid].org}: [${md(data.sources[sid].title)}](${data.sources[sid].archive ?? data.sources[sid].url}) (${md(at)})`).join('; ')} \`${r.c}\``);
      L.push('');
    }
  }
  L.push('## Źródła');
  L.push('');
  L.push('| Id | Organizacja | Tytuł | Adres | Migawka (odczyt) |');
  L.push('|---|---|---|---|---|');
  for (const [id, s] of Object.entries(data.sources).sort((a, b) => a[0].localeCompare(b[0]))) L.push(`| ${md(id)} | ${md(s.org)} | ${md(s.title)} | ${s.url} | ${s.archive ?? '—'} |`);
  L.push('');
  return L.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const data = JSON.parse(readFileSync(DATA, 'utf8')); const pl = JSON.parse(readFileSync(PL, 'utf8'));
  const errs = validate(data, pl);
  if (errs.length) { console.error('Błędy danych wskazówek:\n' + errs.map(e => '  ' + e).join('\n')); process.exit(1); }
  const out = render(data, pl);
  if (process.argv.includes('--check')) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== out) { console.error('docs/research/27-wskazowki-zrodla.md nieaktualny — uruchom: node scripts/cues/gen.mjs'); process.exit(1); }
    console.log(`wskazówki: ${Object.keys(data.exercises).length} ćwiczeń, dokument aktualny`);
  } else { writeFileSync(OUT, out); console.log('zapisano', OUT); }
}
