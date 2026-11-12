/*
 * 07-jakosc-002 (audyt 12.11.2026, KO-058 A): strażnik „uruchomiony bezpośrednio” w skryptach .mjs musi porównywać ścieżki REALNE.
 * Node podaje w import.meta.url ścieżkę realną, a process.argv[1] bywa przez dowiązanie (macOS: os.tmpdir() = /var → /private/var) —
 * naiwne porównanie daje „to nie moduł główny” i skrypt kończy się kodem 0 bez pracy (tak padł tests/strona-eksport-recenzja.test.ts na macOS, build TestFlight 1.1).
 * Rodzaje (docs/20): logika (jestGlowny), regresja (eksport.mjs pod dowiązaniem), niezmiennik (żaden skrypt nie porównuje import.meta.url z argv[1] bez jestGlowny/realpath — dotyczy też NOWYCH skryptów).
 * Gałąź długo żyjąca (L-080): strażnik skanuje wszystkie skrypty z drzewa, więc obejmuje także te dodane na gałęzi przed scaleniem.
 */
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const root = path.join(__dirname, '..');
const KATALOGI = ['scripts', 'docs']; /* zakres: skrypty .mjs w scripts/ i docs/ (narzędzia docs/design, docs/monetyzacja) */
const wszystkie = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === 'node_modules' ? [] : wszystkie(p);
  return e.name.endsWith('.mjs') ? [p] : [];
});
/** Linia z kruchym porównaniem: import.meta.url z argv[1] bez jestGlowny ani realpath. */
export const kruche = (linia: string): boolean => /argv\[1\]/.test(linia) && /import\.meta\.url/.test(linia) && !/jestGlowny\(|realpathSync/.test(linia);

describe('moduł główny pod dowiązaniem (07-jakosc-002, 12.11.2026)', () => {
  let tmp = '';
  beforeAll(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'glowny-')); });
  afterAll(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

  test('rozpoznanie kruchej linii (sam detektor)', () => {
    expect(kruche("if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {")).toBe(true);
    expect(kruche('if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {')).toBe(true);
    expect(kruche('if (process.argv[1] === fileURLToPath(import.meta.url)) {')).toBe(true);
    expect(kruche('if (jestGlowny(import.meta.url)) {')).toBe(false);
    expect(kruche('const x = realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));')).toBe(false);
    expect(kruche('const a = process.argv.slice(2);')).toBe(false);
  });

  test('żaden skrypt .mjs (scripts/, docs/) nie porównuje import.meta.url z argv[1] bez jestGlowny/realpath', () => {
    const zle: string[] = [];
    for (const k of KATALOGI) for (const f of wszystkie(path.join(root, k))) {
      fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (kruche(l)) zle.push(`${path.relative(root, f)}:${i + 1}`); });
    }
    expect(zle).toEqual([]);
  });

  test('jestGlowny: skrypt uruchomiony przez dowiązanie do katalogu i do pliku jest rozpoznany jako główny, import — nie', () => {
    const real = path.join(tmp, 'real'); fs.mkdirSync(real);
    fs.copyFileSync(path.join(root, 'scripts/modul-glowny.mjs'), path.join(real, 'modul-glowny.mjs'));
    fs.writeFileSync(path.join(real, 'x.mjs'), "import { jestGlowny } from './modul-glowny.mjs';\nconsole.log(jestGlowny(import.meta.url) ? 'MAIN' : 'IMPORT');\n");
    fs.writeFileSync(path.join(real, 'y.mjs'), "import './x.mjs';\n");
    fs.symlinkSync(real, path.join(tmp, 'link'));
    fs.symlinkSync(path.join(real, 'x.mjs'), path.join(tmp, 'plik.mjs'));
    const uruchom = (p: string) => spawnSync('node', [p], { encoding: 'utf8' }).stdout.trim();
    expect(uruchom(path.join(real, 'x.mjs'))).toBe('MAIN');
    expect(uruchom(path.join(tmp, 'link', 'x.mjs'))).toBe('MAIN'); /* dowiązanie do katalogu (macOS: tmpdir) */
    expect(uruchom(path.join(tmp, 'plik.mjs'))).toBe('MAIN'); /* dowiązanie do pliku */
    expect(uruchom(path.join(real, 'y.mjs'))).toBe('IMPORT'); /* zaimportowany nie jest głównym */
  });

  test('eksport.mjs uruchomiony przez dowiązanie do scripts/ działa (użycie + kod 2), a nie kończy się cicho kodem 0', () => {
    const link = path.join(tmp, 'scripts-link'); fs.symlinkSync(path.join(root, 'scripts'), link);
    const r = spawnSync('node', [path.join(link, 'strona/eksport.mjs')], { encoding: 'utf8' });
    expect(r.status).toBe(2); expect(r.stderr).toContain('użycie: node scripts/strona/eksport.mjs');
  }, 60000);
});
