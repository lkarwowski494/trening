/* 21.10.2026: README z podwójnym wierszem drzewa po przegenerowaniu w trakcie scalania (dwa razy u koordynatora, raz w M3 — L-016 na gałęzi M3).
   Mechanizm: przy nierozwiązanym konflikcie `git ls-files` wypisuje plik raz na etap konfliktu; generator musi brać pliki bez powtórzeń. */
import { execFileSync } from 'child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const git = (cwd: string, ...a: string[]) => execFileSync('git', ['-c', 'user.email=t@example.invalid', '-c', 'user.name=t', ...a], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

test('git ls-files przy konflikcie scalania wypisuje plik kilka razy (odtworzenie mechanizmu)', () => {
  const d = mkdtempSync(join(tmpdir(), 'ls-files-'));
  git(d, 'init', '-q', '-b', 'main'); writeFileSync(join(d, 'README.md'), 'a\n'); git(d, 'add', '.'); git(d, 'commit', '-qm', 'a');
  git(d, 'checkout', '-qb', 'x'); writeFileSync(join(d, 'README.md'), 'x\n'); git(d, 'commit', '-qam', 'x');
  git(d, 'checkout', '-q', 'main'); writeFileSync(join(d, 'README.md'), 'm\n'); git(d, 'commit', '-qam', 'm');
  try { git(d, 'merge', 'x'); } catch { /* konflikt — oczekiwany */ }
  const lista = git(d, 'ls-files').split('\n').filter(Boolean);
  expect(lista.filter((f) => f === 'README.md').length).toBeGreaterThan(1);
});

test('scripts/readme.mjs bierze pliki z git ls-files bez powtórzeń i pomija .claude przy przeszukaniu katalogu', () => {
  const s = readFileSync(join(__dirname, '../scripts/readme.mjs'), 'utf8');
  expect(s).toMatch(/\[\.\.\.new Set\(execFileSync\('git', \['ls-files'\]/);
  expect(s).toMatch(/SKIP = new Set\(\[[^\]]*'\.claude'/);
});
