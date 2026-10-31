// Szybkie verify dla commitu zmieniającego TYLKO dokumenty (decyzja właściciela 21.10.2026 „Szybsze verify dla dokumentów”).
// Dokument = plik .md (docs/**, CLAUDE.md, README.md, .claude/agents/*.md), poza makietami w tests/ i watch-fixtures/. Dane i kod w docs/
// (json, csv, mjs) oraz wszystko inne — kod, testy, skrypty, workflowy, konfiguracja — idą pełnym `npm run verify`.
// Zmiany liczone względem punktu rozejścia z ref (domyślnie origin/main) razem z nieśledzonymi i niezatwierdzonymi. H1 (decyzja właściciela 31.10.2026 ~11:35, ZB-028):
// gdy względem origin/main są zmiany kodu, liczą się zmiany od najbliższego przodka HEAD z zielonym pełnym verify (znacznik „pelne”, scripts/verify-znacznik.mjs) —
// same dokumenty od tamtej chwili wystarczą; bez takiego przodka — jak dotąd, pełne verify.
// Uruchamia: check:readme, check:matrix, check:claims, check:decyzje, check:i18n, check:pokrycie (+ kontrola BRD przy zmianie docs/brd) oraz tylko te testy Jest,
// które wymieniają zmieniony dokument (nazwa, ścieżka, katalog) albo przeglądają cały katalog docs. Cel: 1–2 min zamiast 12–15.
// CI na PR i tak uruchamia pełne testy przed scaleniem.
// Użycie: npm run verify:docs [-- <ref>]
//         node scripts/verify-docs.mjs --plan [<ref>]            — tylko wypisuje plan (JSON), niczego nie uruchamia
//         node scripts/verify-docs.mjs --czy-dokumenty [<ref>]   — kod 0, gdy są zmiany i wszystkie są dokumentami (dla haka pre-push)
// VERIFY_DOCS_CHANGED (pliki rozdzielone znakiem nowej linii) zastępuje odczyt z gita — do testów.
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jestDokumentem } from './dokumenty.mjs';
import { bazaPelnego } from './verify-znacznik.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const planOnly = args.includes('--plan');
const czyDokumenty = args.includes('--czy-dokumenty');
const ref = args.find(a => !a.startsWith('--')) || 'origin/main';

const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const lines = s => s.split('\n').map(x => x.trim()).filter(Boolean);

const zmienioneOd = baza => [...new Set([...lines(git('diff', '--name-only', baza)), ...lines(git('ls-files', '--others', '--exclude-standard'))])];
/** Lista zmian i baza porównania: punkt rozejścia z ref, a gdy tam jest kod — H1: najbliższy przodek z pełnym verify (tylko przy domyślnym ref). */
function zmienione() {
  if (process.env.VERIFY_DOCS_CHANGED !== undefined) return { zm: lines(process.env.VERIFY_DOCS_CHANGED), baza: null };
  const baza = git('merge-base', ref, 'HEAD').trim();
  const zm = zmienioneOd(baza);
  if (ref !== 'origin/main' || zm.every(jestDokumentem)) return { zm, baza };
  const pelne = bazaPelnego('HEAD');
  if (!pelne) return { zm, baza };
  const odPelnego = zmienioneOd(pelne);
  return odPelnego.length && odPelnego.every(jestDokumentem) ? { zm: odPelnego, baza: pelne } : { zm, baza };
}

/* Testy Jest związane z dokumentami: wymieniają nazwę pliku (z rozszerzeniem; bez rozszerzenia tylko numerowane docs/NN-…),
   ścieżkę albo katalog (nie sam „docs”), plus testy przeglądające cały katalog docs. */
function testyDlaDokumentow(pliki) {
  const wszystkie = readdirSync(join(root, 'tests')).filter(f => /\.test\.tsx?$/.test(f));
  const zrodla = Object.fromEntries(wszystkie.map(f => [f, readFileSync(join(root, 'tests', f), 'utf8')]));
  const przeglada = /(readdirSync|walk)\((path\.)?join\([^)]*['"]docs['"]/;
  const frazy = new Set();
  for (const f of pliki) {
    const nazwa = basename(f);
    frazy.add(f); frazy.add(nazwa);
    if (/^\d/.test(nazwa)) frazy.add(nazwa.replace(/\.md$/, ''));
    const katalog = dirname(f);
    if (katalog !== '.' && katalog !== 'docs') frazy.add(katalog);
  }
  return wszystkie
    .filter(f => przeglada.test(zrodla[f]) || [...frazy].some(fr => zrodla[f].includes(fr)))
    .map(f => `tests/${f}`)
    .sort();
}

const { zm, baza } = zmienione();
const poza = zm.filter(f => !jestDokumentem(f));
const dokumenty = zm.length > 0 && poza.length === 0;

if (czyDokumenty) process.exit(dokumenty ? 0 : 1);

if (zm.length === 0) {
  console.log(`verify:docs — brak zmian względem ${process.env.VERIFY_DOCS_CHANGED !== undefined ? 'listy' : ref}`);
  if (planOnly) console.log(JSON.stringify({ ref, zmienione: [], dokumenty: false, poza: [], komendy: [], testy: [] }));
  process.exit(0);
}

const komendy = ['npm run check:readme', 'npm run check:matrix', 'npm run check:claims', 'npm run check:decyzje', 'npm run check:i18n', 'npm run check:pokrycie'];
if (zm.some(f => f.startsWith('docs/brd/'))) komendy.push('node scripts/kontrola-brd.mjs docs/brd');
const testy = dokumenty ? testyDlaDokumentow(zm) : [];

if (planOnly) { console.log(JSON.stringify({ ref, baza, zmienione: zm, dokumenty, poza, komendy: dokumenty ? komendy : [], testy })); process.exit(0); }

if (!dokumenty) {
  console.error('verify:docs — zmiany poza dokumentami — uruchom npm run verify');
  console.error(`Pliki poza dokumentami (${poza.length}): ${poza.slice(0, 10).join(', ')}${poza.length > 10 ? ', …' : ''}`);
  process.exit(1);
}

const start = Date.now();
console.log(`verify:docs — ${zm.length} dokumentów względem ${baza && ref === 'origin/main' && git('merge-base', ref, 'HEAD').trim() !== baza ? `commitu z pełnym verify ${baza.slice(0, 8)}` : ref}`);
for (const k of komendy) {
  console.log(`verify:docs: ${k}`);
  const r = spawnSync(k, { cwd: root, shell: true, stdio: 'inherit' });
  if (r.status !== 0) { console.error(`verify:docs — błąd w: ${k}`); process.exit(r.status ?? 1); }
}
if (testy.length) {
  const jestBin = join(dirname(createRequire(import.meta.url).resolve('jest/package.json')), 'bin', 'jest.js');
  console.log(`verify:docs: jest — ${testy.length} testów czytających dokumenty`);
  const r = spawnSync(process.execPath, [jestBin, '--runTestsByPath', ...testy, '--silent', '--reporters=summary'], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) { console.error('verify:docs — błąd w testach Jest'); process.exit(r.status ?? 1); }
}
console.log(`verify:docs — zielone po ${Math.round((Date.now() - start) / 1000)} s`);
/* L-049 (opcja A, 28.10.2026): znacznik „dokumenty” dla haka pre-push; nie w trybie testowym (VERIFY_DOCS_CHANGED) ani przy porównaniu z innym ref niż origin/main */
if (process.env.VERIFY_DOCS_CHANGED === undefined && ref === 'origin/main') spawnSync(process.execPath, [join(root, 'scripts/verify-znacznik.mjs'), '--zapisz', 'dokumenty'], { cwd: root, stdio: 'inherit' });
