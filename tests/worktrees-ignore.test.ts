/* Agenci pracują we własnych worktree w .claude/worktrees/ (CLAUDE.md, podział pracy 20.10.2026). To kopie repo wewnątrz repo:
   bez wykluczenia lint, Jest i tsc w głównym katalogu sprawdzają je drugi raz (verify 21.10.2026: 90 błędów lint z cudzych kopii). */
import { readFileSync } from 'fs';
import { join } from 'path';

const plik = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');

describe('worktree agentów poza zasięgiem narzędzi sprawdzających', () => {
  test('lint (eslint.config.js) ignoruje .claude/**', () => { expect(plik('eslint.config.js')).toContain("'.claude/**'"); });
  test('Jest pomija .claude/worktrees (modulePathIgnorePatterns)', () => {
    expect(JSON.parse(plik('package.json')).jest.modulePathIgnorePatterns).toContain('<rootDir>/.claude/worktrees');
  });
  test('tsc pomija .claude/worktrees, a node_modules dalej wykluczone', () => {
    const ex: string[] = JSON.parse(plik('tsconfig.json')).exclude;
    expect(ex).toEqual(expect.arrayContaining(['node_modules', '.claude/worktrees']));
  });
  test('git nie śledzi worktree (.gitignore)', () => { expect(plik('.gitignore')).toMatch(/^\.claude\/worktrees\/$/m); });
});
