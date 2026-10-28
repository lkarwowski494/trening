// Znacznik zielonego verify (L-NNN, decyzja właściciela 28.10.2026, opcja A): reguła „pełne verify przed wypchnięciem” z CLAUDE.md jako mechanizm.
//   node scripts/verify-znacznik.mjs --zapisz pelne|dokumenty   — koniec `npm run verify` / `npm run verify:docs`: zapisuje drzewo HEAD (git rev-parse HEAD^{tree}),
//                                                                  tylko przy czystej kopii roboczej (bez zmian i bez nieśledzonych plików); w CI nic nie robi
//   node scripts/verify-znacznik.mjs --sprawdz <sha>             — hak pre-push: kod 0, gdy drzewo commitu <sha> ma znacznik „pelne” albo „dokumenty”
//                                                                  i zmiany od origin/main to same dokumenty (jak verify:docs); inaczej kod 1 z poleceniem naprawy
// Plik: <wspólny katalog .git>/verify-znaczniki.json (wspólny dla worktree), ostatnie MAKS wpisów; VERIFY_ZNACZNIK_PLIK zastępuje ścieżkę (testy).
// Obejście świadome: git push --no-verify.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MAKS = 50;
const RODZAJE = ['pelne', 'dokumenty'];
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const sprobuj = (...a) => { try { return git(...a); } catch { return null; } };
const jestDokumentem = f => /\.md$/.test(f) && !/^(tests|watch-fixtures)\//.test(f); /* ta sama reguła co scripts/verify-docs.mjs */

const plik = () => process.env.VERIFY_ZNACZNIK_PLIK || resolve(git('rev-parse', '--git-common-dir'), 'verify-znaczniki.json');
const czytaj = () => { try { const d = JSON.parse(readFileSync(plik(), 'utf8')); return Array.isArray(d) ? d : []; } catch { return []; } };

export function zapisz(rodzaj) {
  if (!RODZAJE.includes(rodzaj)) { console.error(`verify-znacznik: nieznany rodzaj „${rodzaj}” (${RODZAJE.join(', ')})`); return 2; }
  if (process.env.CI) return 0;
  const brud = git('status', '--porcelain');
  if (brud) {
    console.error(`verify-znacznik: kopia robocza ma zmiany albo nieśledzone pliki — znacznik NIE zapisany (hak pre-push zatrzyma wypchnięcie).\n${brud.split('\n').slice(0, 10).join('\n')}\nZatwierdź zmiany (git add, commit) i uruchom verify ponownie.`);
    return 0; /* verify było zielone — nie wywracamy go; brak znacznika wystarczy */
  }
  const wpis = { drzewo: git('rev-parse', 'HEAD^{tree}'), rodzaj, commit: git('rev-parse', '--short', 'HEAD'), data: new Date().toISOString() };
  const lista = [wpis, ...czytaj().filter(w => !(w.drzewo === wpis.drzewo && w.rodzaj === rodzaj))].slice(0, MAKS);
  writeFileSync(plik(), JSON.stringify(lista, null, 1) + '\n');
  console.log(`verify-znacznik: zapisany (${rodzaj}, ${wpis.commit}, drzewo ${wpis.drzewo.slice(0, 12)})`);
  return 0;
}

/** Czy wszystkie zmiany commitu od bazy origin/main to dokumenty (brak origin/main albo brak zmian → nie). */
function tylkoDokumenty(sha) {
  const baza = sprobuj('merge-base', 'origin/main', sha); if (!baza) return false;
  const pliki = (sprobuj('diff', '--name-only', baza, sha) ?? '').split('\n').filter(Boolean);
  return pliki.length > 0 && pliki.every(jestDokumentem);
}

export function sprawdz(sha) {
  const drzewo = sha && sprobuj('rev-parse', `${sha}^{tree}`);
  if (!drzewo) { console.error(`verify-znacznik: nie znam commitu ${sha}`); return 1; }
  const wpisy = czytaj().filter(w => w.drzewo === drzewo);
  if (wpisy.some(w => w.rodzaj === 'pelne')) return 0;
  if (wpisy.some(w => w.rodzaj === 'dokumenty') && tylkoDokumenty(sha)) return 0;
  console.error(`verify-znacznik: commit ${sha.slice(0, 7)} nie ma zielonego verify dla tego stanu plików${wpisy.length ? ' (znacznik verify:docs, a zmiany to nie same dokumenty)' : ''}.`);
  return 1;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const a = process.argv.slice(2);
  const i = a.indexOf('--zapisz'), j = a.indexOf('--sprawdz');
  if (i >= 0) process.exit(zapisz(a[i + 1]));
  if (j >= 0) process.exit(sprawdz(a[j + 1]));
  console.error('użycie: --zapisz pelne|dokumenty | --sprawdz <sha>'); process.exit(2);
}
