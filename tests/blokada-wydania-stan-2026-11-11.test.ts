/*
 * W-05 (sesja M, 11.11.2026; do weta): `npm run check:release` zgłaszał R-015 jako otwarte, choć stan zaczyna się od „**zamknięte 05.11.2026**” — w historii tej samej
 * komórki jest „otwarte, bo zestaw miał wpis „zmieniony”” (historię pilnuje tests/blokada-wydania.test.ts). Poprawka scripts/ci/blokada-wydania.mjs (blockingRisks):
 * o stanie decyduje POCZĄTEK komórki „stan” — wiersz zaczynający się od „zamknięte” albo „zaakceptowane” (także pogrubionych) nie blokuje; słowa w historii nie zmieniają stanu.
 * Wiersz zaczynający się od „otwarte” z historią „wcześniej zamknięte” nadal blokuje (fail-closed bez zmian).
 * Przypadek L-080: repozytorium próbne na gałęzi z wcześniejszymi zmianami kodu względem main — skrypt uruchomiony jako polecenie ocenia rejestr gałęzi.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts/ci/blokada-wydania.mjs');
const table = (rows: string[]) => ['## Rejestr ryzyk (otwarte blokują wydanie)', '', '| id | ryzyko | warunek zamknięcia | stan |', '|---|---|---|---|', ...rows, '', '## Lekcje', ''].join('\n');
const blockingRisks = (md: string): string[] => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rejestr-')), 'r.md'); fs.writeFileSync(f, md);
  return (JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { blockingRisks } from ${JSON.stringify('file://' + SCRIPT)}; import { readFileSync } from 'node:fs'; process.stdout.write(JSON.stringify(blockingRisks(readFileSync(process.argv[1], 'utf8'))));`, f], { encoding: 'utf8' })) as { id: string }[]).map(r => r.id);
};

describe('W-05 (11.11.2026): stan ryzyka = początek komórki „stan”', () => {
  test('zamknięte z historią „otwarte” w tej samej komórce nie blokuje; otwarte z historią „zamknięte” blokuje', () => {
    expect(blockingRisks(table([
      '| R-1 | a | b | **zamknięte 05.11.2026** (dowód: przebieg 42103385218; ten sam dzień wcześniej otwarte, bo zestaw miał wpis). Poprzednio: **zamknięte 26.10.2026** |',
      '| R-2 | a | b | zaakceptowane 22.10.2026 (teoretyczny; wcześniej otwarte) |',
      '| R-3 | a | b | **otwarte 11.11.2026** — wcześniej **zamknięte 01.11.2026**, wróciło |',
      '| R-4 | a | b | otwarte (31.10.2026) |',
      '| R-5 | a | b | **częściowo spełnione 22.10.2026** — zamknięte dla iOS |',
    ]))).toEqual(['R-3', 'R-4', 'R-5']);
  });
  /* 11.11.2026 (DIF-01, audyt W-10): R-015 otwarty ponownie, dopóki zestaw przekładu ma wpis „zmieniony” — stan bieżącego rejestru zależy od zestawu (tests/blokada-wydania.test.ts). */
  test('bieżący rejestr: R-015 blokuje wydanie dokładnie wtedy, gdy zaczyna się od „otwarte” (11.11.2026: wpis „zmieniony” DIF-01); zamknięty z historią „otwarte” nie blokuje', () => {
    const row = fs.readFileSync(path.join(ROOT, 'docs/40-lekcje.md'), 'utf8').split('\n').find(l => l.startsWith('| R-015 |')) ?? '';
    const { PENDING } = require('./pending-translation') as { PENDING: { rodzaj: string }[] }; const pending = PENDING.some(p => p.rodzaj === 'zmieniony');
    expect(row.split(' | ').at(-1)).toMatch(pending ? /^otwarte \d{2}\.\d{2}\.\d{4}[\s\S]*\*\*zamknięte 05\.11\.2026\*\*/ : /^\*\*zamknięte \d{2}\.\d{2}\.\d{4}\*\*[\s\S]*otwarte/);
    expect(blockingRisks(fs.readFileSync(path.join(ROOT, 'docs/40-lekcje.md'), 'utf8')).includes('R-015')).toBe(pending);
  });

  test('L-080: skrypt jako polecenie na gałęzi z wcześniejszymi zmianami kodu względem main — ocenia rejestr gałęzi (zamknięte z historią → kod 0; dopisane otwarte → kod 1)', () => {
    const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'blokada-l080-')));
    const git = (...a: string[]) => execFileSync('git', a, { cwd: dir, env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
    try {
      for (const f of ['scripts/ci/blokada-wydania.mjs', 'scripts/check-bundle.mjs', 'lib/sources.ts']) {
        fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(dir, f));
      }
      fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(dir, 'node_modules'));
      fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\n');
      fs.mkdirSync(path.join(dir, 'docs'));
      fs.writeFileSync(path.join(dir, 'docs/40-lekcje.md'), table(['| R-1 | a | b | otwarte (01.11.2026) |']));
      git('init', '-q', '-b', 'main'); git('add', '-A'); git('commit', '-q', '-m', 'baza');
      git('checkout', '-q', '-b', 'integracja-proba');
      fs.writeFileSync(path.join(dir, 'lib/kod.ts'), 'export const x = 1;\n'); git('add', '-A'); git('commit', '-q', '-m', 'kod na gałęzi');
      fs.writeFileSync(path.join(dir, 'docs/40-lekcje.md'), table(['| R-1 | a | b | **zamknięte 11.11.2026** — dowód: `t.test.ts`; wcześniej otwarte (01.11.2026) |']));
      git('add', '-A'); git('commit', '-q', '-m', 'same dokumenty');
      expect(execFileSync('git', ['diff', '--name-only', 'main...HEAD'], { cwd: dir, encoding: 'utf8' })).toContain('lib/kod.ts');
      const r = spawnSync(process.execPath, [path.join(dir, 'scripts/ci/blokada-wydania.mjs')], { cwd: dir, encoding: 'utf8' });
      expect(r.stdout).toContain('rejestr ryzyk: brak otwartych blokujących wydanie');
      expect(r.status).toBe(0);
      fs.writeFileSync(path.join(dir, 'docs/40-lekcje.md'), table(['| R-1 | a | b | **zamknięte 11.11.2026** — dowód: `t.test.ts` |', '| R-2 | a | b | otwarte (11.11.2026) — wcześniej zamknięte |']));
      const r2 = spawnSync(process.execPath, [path.join(dir, 'scripts/ci/blokada-wydania.mjs')], { cwd: dir, encoding: 'utf8' });
      expect(r2.stderr).toMatch(/WYDANIE ZABLOKOWANE[^\n]*R-2/);
      expect(r2.status).toBe(1);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
});
