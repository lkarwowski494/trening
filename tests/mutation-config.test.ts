/* M1-audytor-generalny-055: nocny job `mutacje` nie wykonywał mutantów, bo suche przejście Strykera padało na testach, które uruchamiają
   skrypty potomne (`--check` generatorów) w kopii projektu. Strażnik: testy z procesami potomnymi są poza konfiguracją mutacji,
   a konfiguracja dalej obejmuje testy logiki. */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const cfg = require('../jest.mutation.config.js') as { testPathIgnorePatterns: string[]; testMatch: string[]; testTimeout?: number };
const ignored = (rel: string) => cfg.testPathIgnorePatterns.some(p => new RegExp(p).test('/' + rel));
const testy = readdirSync(join(root, 'tests')).filter(f => f.endsWith('.test.ts'));
const spawnuje = (f: string) => /child_process|execFileSync|execSync|spawnSync|--check/.test(readFileSync(join(root, 'tests', f), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''));

describe('konfiguracja testów mutacyjnych (M1-055)', () => {
  test('testy uruchamiające procesy potomne i skrypty --check są poza konfiguracją mutacji', () => {
    const wewnatrz = testy.filter(f => spawnuje(f) && !ignored('tests/' + f));
    expect(wewnatrz).toEqual([]);
  });
  test('testy z dwoma znanymi przypadkami z audytu są wykluczone: backlog-0.10.1-dane i locations-catalog', () => {
    expect(ignored('tests/backlog-0.10.1-dane.test.ts')).toBe(true);
    expect(ignored('tests/locations-catalog.test.ts')).toBe(true);
  });
  test('testy logiki modułów mutowanych zostają w konfiguracji', () => {
    for (const f of ['stats', 'plan-calendar', 'units', 'generator'].flatMap(n => testy.filter(t => t.startsWith(n)))) expect(ignored('tests/' + f)).toBe(false);
    expect(testy.filter(f => !ignored('tests/' + f)).length).toBeGreaterThan(50);
  });
  /* Nocne 25.10.2026: suche przejście Strykera padło na teście, który renderuje ekran (tests/catalog-v2.test.ts, „Exceeded timeout of 5000 ms”) — zimna kopia
     projektu i dwa równoległe procesy wydłużają pierwszy render ponad domyślne 5 s Jesta. Limit testu w konfiguracji mutacji jak w testach ekranów (jest.setTimeout(30000)). */
  test('limit czasu pojedynczego testu w konfiguracji mutacji nie jest domyślnymi 5 s (zimny start sandboxu Strykera)', () => {
    expect(cfg.testTimeout).toBeGreaterThanOrEqual(30000);
  });
  test('moduły mutowane w stryker.config.json istnieją', () => {
    const s = JSON.parse(readFileSync(join(root, 'stryker.config.json'), 'utf8'));
    for (const m of s.mutate as string[]) expect(() => readFileSync(join(root, m))).not.toThrow();
  });
});
