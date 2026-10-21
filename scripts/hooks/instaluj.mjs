// Instalacja haka pre-push (L-009): ustawia core.hooksPath na scripts/hooks. Uruchamia go `npm ci` (skrypt `prepare`).
// Nigdy nie przerywa instalacji: w CI (zmienna CI), w katalogu bez .git (paczka) i bez gita kończy się cicho kodem 0.
// Ścieżka względna działa także w worktree: konfiguracja jest wspólna, a git liczy ją od katalogu roboczego worktree.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const KATALOG_HAKOW = 'scripts/hooks';
const git = (...args) => execFileSync('git', args, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();

try {
  if (process.env.CI) process.exit(0);
  if (!existsSync(join(process.cwd(), '.git'))) process.exit(0); // .git bywa plikiem (worktree)
  let obecny = '';
  try { obecny = git('config', '--local', '--get', 'core.hooksPath'); } catch { /* brak ustawienia */ }
  if (obecny && obecny !== KATALOG_HAKOW) {
    console.log(`hak pre-push: pomijam — core.hooksPath już ustawione na „${obecny}”`);
    process.exit(0);
  }
  git('config', '--local', 'core.hooksPath', KATALOG_HAKOW);
  console.log(`hak pre-push: core.hooksPath = ${KATALOG_HAKOW}`);
} catch {
  /* brak gita albo błąd konfiguracji — instalacja zależności ma przejść */
}
process.exit(0);
