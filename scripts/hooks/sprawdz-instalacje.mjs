// Pierwszy krok `npm run verify` (L-014, decyzja właściciela 21.10.2026): hak pre-push musi być zainstalowany.
// `prepare` (instaluj.mjs) nie biegnie przy `npm ci --ignore-scripts`, a wtedy czerwony commit można wypchnąć bez sprawdzeń (L-009, L-014).
// OK, gdy hak, który git wywoła przy pushu (wg core.hooksPath albo .git/hooks), jest wykonywalny i ma TĘ SAMĄ TREŚĆ co scripts/hooks/pre-push
// bieżącego checkoutu. Porównujemy treść, nie ścieżkę: core.hooksPath bywa bezwzględne i wskazuje scripts/hooks innego worktree tego samego repo
// (konfiguracja jest wspólna dla worktree), a to nadal ten sam hak (22.10.2026).
// W CI (zmienna CI) i poza repozytorium git (paczka) sprawdzenie pomijamy z komunikatem.
import { execFileSync } from 'node:child_process';
import { accessSync, constants, existsSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';

const git = (...args) => execFileSync('git', args, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
const rzecz = p => { try { return realpathSync(p); } catch { return resolve(p); } };

if (process.env.CI) { console.log('hak pre-push: sprawdzenie pominięte w CI (zmienna CI)'); process.exit(0); }
if (!existsSync(join(process.cwd(), '.git'))) { console.log('hak pre-push: sprawdzenie pominięte — to nie jest repozytorium git'); process.exit(0); }

let ok = false;
try {
  const hak = rzecz(git('rev-parse', '--path-format=absolute', '--git-path', 'hooks/pre-push'));
  const naszHak = rzecz('scripts/hooks/pre-push');
  if (existsSync(hak) && readFileSync(hak, 'utf8') === readFileSync(naszHak, 'utf8')) { accessSync(hak, constants.X_OK); ok = true; }
} catch { /* brak gita albo hak nie do wykonania — traktujemy jak brak instalacji */ }

if (!ok) {
  console.error([
    'hak pre-push NIE jest zainstalowany — verify zatrzymane (L-014).',
    'Hak (lint + check:readme + check:matrix) nie biegnie przy `npm ci --ignore-scripts`, więc czerwony commit przeszedłby do zdalnego repozytorium.',
    'Zainstaluj go poleceniem:  node scripts/hooks/instaluj.mjs',
    '(ustawia core.hooksPath = scripts/hooks; powtórz verify). Gdy core.hooksPath wskazuje na coś innego, skopiuj scripts/hooks/pre-push do katalogu haków.',
  ].join('\n'));
  process.exit(1);
}
console.log('hak pre-push: zainstalowany');
