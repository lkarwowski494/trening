/* L-117 (08.11.2026): skrypt scripts/dziennik-wydan.mjs dopisuje wiersz „Dziennik wydań” po tagu z testflight.yml.
 * Dowód na kopii repozytorium (docs/09 skopiowane do katalogu próbnego): wiersz ma format czytany przez strażnika tests/audit-m1-050-release-log.test.ts, drugie wywołanie nie dubluje. */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
const skrypt = path.join(root, 'scripts/dziennik-wydan.mjs');
const doc = fs.readFileSync(path.join(root, 'docs/09-plan-testow.md'), 'utf8');
const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dziennik-')));
const kopia = path.join(dir, '09.md');
const ARGS = ['--tag', 'v1.1.0-b1040', '--sha', 'abcdef0123456789abcdef0123456789abcdef01', '--run-number', '40', '--run-id', '555666777', '--galaz', 'integracja-1-1', '--plik', kopia];
const uruchom = (a: string[]) => spawnSync('node', [skrypt, ...a], { encoding: 'utf8' });
/* ten sam parser co strażnik tests/audit-m1-050-release-log.test.ts */
const WZOR = /^\|\s*`(v\d+\.\d+\.\d+-b(\d+))`\s*\|\s*(\d+)\s*\|\s*`([0-9a-f]{7,40})`\s*\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*$/;

beforeEach(() => fs.writeFileSync(kopia, doc));
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe('dziennik-wydan.mjs', () => {
  test('dopisuje wiersz w formacie strażnika, na końcu tabeli sekcji, reszta pliku bez zmian', () => {
    const r = uruchom(ARGS);
    expect(r.status).toBe(0);
    const po = fs.readFileSync(kopia, 'utf8');
    const nowe = po.split('\n').filter(l => l.includes('v1.1.0-b1040'));
    expect(nowe).toHaveLength(1);
    const m = WZOR.exec(nowe[0])!;
    expect(m).not.toBeNull();
    expect([m[1], m[3], m[4], m[5]]).toEqual(['v1.1.0-b1040', '1040', 'abcdef0', '40']);
    expect(m[6]).toContain('id 555666777');
    expect(m[6]).toContain('integracja-1-1');
    const przed = doc.split('\n'), pol = po.split('\n');
    expect(pol).toHaveLength(przed.length + 1);
    const idx = pol.indexOf(nowe[0]);
    expect(WZOR.test(pol[idx - 1])).toBe(true); // bezpośrednio po poprzednim wierszu tabeli
    expect(pol.filter((_, i) => i !== idx)).toEqual(przed);
  });

  test('idempotentny: drugie wywołanie nie zmienia pliku ani nie dubluje wiersza', () => {
    uruchom(ARGS);
    const raz = fs.readFileSync(kopia, 'utf8');
    const r = uruchom(ARGS);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('już jest');
    expect(fs.readFileSync(kopia, 'utf8')).toBe(raz);
  });

  test('odrzuca zły tag, zły SHA i build niezgodny z numerem przebiegu (plik bez zmian)', () => {
    const zmien = (k: string, v: string) => { const a = [...ARGS]; a[a.indexOf(k) + 1] = v; return a; };
    for (const a of [zmien('--tag', '1.1.0'), zmien('--sha', 'xyz'), zmien('--run-number', '41'), zmien('--run-id', 'abc')]) {
      expect(uruchom(a).status).toBe(1);
      expect(fs.readFileSync(kopia, 'utf8')).toBe(doc);
    }
  });

  test('znaki | i ` w nazwie gałęzi nie psują tabeli', () => {
    const a = [...ARGS]; a[a.indexOf('--galaz') + 1] = 'a|b`c';
    uruchom(a);
    expect(WZOR.test(fs.readFileSync(kopia, 'utf8').split('\n').find(l => l.includes('v1.1.0-b1040'))!)).toBe(true);
  });

  test('wiersz po dopisaniu przechodzi parser strażnika w pełnym dzienniku (spójność build = 1000 + przebieg)', () => {
    uruchom(ARGS);
    const sekcja = fs.readFileSync(kopia, 'utf8').split('## Dziennik wydań')[1].split('\n## ')[0];
    const wiersze = sekcja.split('\n').map(l => WZOR.exec(l)).filter(Boolean) as RegExpExecArray[];
    for (const m of wiersze) expect(Number(m[3])).toBe(1000 + Number(m[5]));
    expect(new Set(wiersze.map(m => m[1])).size).toBe(wiersze.length);
  });
});
