#!/usr/bin/env node
/* L-117 (wariant A, właściciel 08.11.2026): zadanie `tag` w testflight.yml dopisuje wiersz tabeli „Dziennik wydań” (docs/09-plan-testow.md) po utworzeniu tagu.
 * Wiersz: | `tag` | build | `sha7` | numer przebiegu | wynik z id przebiegu i gałęzią |  (format pilnowany przez tests/audit-m1-050-release-log.test.ts).
 * Użycie: node scripts/dziennik-wydan.mjs --tag v1.1.0-b1040 --sha <sha> --run-number 40 --run-id 123 --galaz <gałąź> [--plik docs/09-plan-testow.md]
 * Idempotentny: gdy wiersz tagu już jest, plik się nie zmienia (kod wyjścia 0, komunikat „już jest”). Wiersz trafia na koniec tabeli sekcji. */
import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const NAGLOWEK = '## Dziennik wydań';
const TAG = /^v\d+\.\d+\.\d+-b(\d+)$/;

/** Wiersz dziennika; build z tagu. Rzuca, gdy tag/sha/numery są niepoprawne albo build ≠ 1000 + numer przebiegu (BUILD_BASE). */
export function wiersz({ tag, sha, runNumber, runId, galaz, buildBase = 1000 }) {
  const m = TAG.exec(tag ?? '');
  if (!m) throw new Error(`niepoprawny tag: ${tag}`);
  if (!/^[0-9a-f]{7,40}$/.test(sha ?? '')) throw new Error(`niepoprawny SHA: ${sha}`);
  if (!/^\d+$/.test(String(runNumber)) || !/^\d+$/.test(String(runId))) throw new Error('numer i id przebiegu muszą być liczbami');
  const build = Number(m[1]);
  if (build !== buildBase + Number(runNumber)) throw new Error(`build ${build} ≠ ${buildBase} + numer przebiegu ${runNumber}`);
  const g = String(galaz ?? '').replace(/[|`\n]/g, '');
  return `| \`${tag}\` | ${build} | \`${sha.slice(0, 7)}\` | ${runNumber} | zielony, id ${runId}; gałąź ${g || '(nieznana)'}; wiersz dopisany automatycznie przez testflight.yml (L-117) |`;
}

/** Zwraca { tekst, zmieniono }. Wstawia wiersz po ostatnim wierszu tabeli sekcji „Dziennik wydań”. */
export function dopisz(tekst, opis) {
  const w = wiersz(opis);
  const start = tekst.indexOf(NAGLOWEK);
  if (start < 0) throw new Error('brak sekcji „Dziennik wydań”');
  const koniecSekcji = (() => { const r = tekst.slice(start + 3).search(/\n## /); return r < 0 ? tekst.length : start + 3 + r; })();
  const sekcja = tekst.slice(start, koniecSekcji);
  if (sekcja.includes(`| \`${opis.tag}\` |`)) return { tekst, zmieniono: false };
  const linie = sekcja.split('\n');
  let ost = -1;
  linie.forEach((l, i) => { if (/^\|\s*`v\d+\.\d+\.\d+-b\d+`\s*\|/.test(l)) ost = i; });
  if (ost < 0) throw new Error('w sekcji brak wierszy tabeli');
  linie.splice(ost + 1, 0, w);
  return { tekst: tekst.slice(0, start) + linie.join('\n') + tekst.slice(koniecSekcji), zmieniono: true };
}

function arg(a, nazwa) { const i = a.indexOf(`--${nazwa}`); return i >= 0 ? a[i + 1] : undefined; }

function main(a) {
  const plik = arg(a, 'plik') ?? 'docs/09-plan-testow.md';
  const opis = { tag: arg(a, 'tag'), sha: arg(a, 'sha'), runNumber: arg(a, 'run-number'), runId: arg(a, 'run-id'), galaz: arg(a, 'galaz'), buildBase: Number(arg(a, 'build-base') ?? 1000) };
  const { tekst, zmieniono } = dopisz(readFileSync(plik, 'utf8'), opis);
  if (zmieniono) writeFileSync(plik, tekst);
  console.log(zmieniono ? `dopisano wiersz ${opis.tag}` : `wiersz ${opis.tag} już jest`);
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try { main(process.argv.slice(2)); } catch (e) { console.error(`dziennik-wydan: ${e.message}`); process.exit(1); }
}
