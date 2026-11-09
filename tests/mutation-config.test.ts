// skanuje: tests
/* M1-audytor-generalny-055: nocny job `mutacje` nie wykonywał mutantów, bo suche przejście Strykera padało na testach, które uruchamiają
   skrypty potomne (`--check` generatorów) w kopii projektu. Strażnik: testy z procesami potomnymi są poza konfiguracją mutacji,
   a konfiguracja dalej obejmuje testy logiki. */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { czytaZrodlo } from '../scripts/ci/czyta-zrodlo-modulu';

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
  /* Nocne 25.10.2026 (przebieg dowodowy mutacji po modułach): tests/dzwiek-telefon-1030.test.ts czyta modules/voice-cue/ios/VoiceCueModule.swift, a kopia projektu Strykera pomija katalogi „ios”
     (stryker.config.json → ignorePatterns) — suche przejście padało „ENOENT”. Testy czytające źródła natywne (Swift, modules/…/ios) sprawdzają kontrakt natywny, nie logikę lib/ — poza konfiguracją mutacji. */
  test('testy czytające źródła natywne (.swift, modules/…/ios) są poza konfiguracją mutacji — kopia Strykera pomija katalogi ios', () => {
    const natywne = testy.filter(f => /\.swift['"`]|modules\/[\w-]+\/ios/.test(readFileSync(join(root, 'tests', f), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')));
    expect(natywne).toContain('dzwiek-telefon-1030.test.ts');
    expect(natywne.filter(f => !ignored('tests/' + f))).toEqual([]);
  });
  /* Nocne 01.11.2026 (audyt jakości 004): tests/m5s1-dni-treningowe.test.ts czyta tekst lib/access.ts (regex na „ENABLED: true”), a w kopii Strykera moduł jest zinstrumentowany —
     suche przejście padało i mutanty modułu `access` nie były liczone wcale. Test czytający źródło mutowanego modułu nie mierzy logiki (każdy mutant psuje go „z zewnątrz”) — poza konfiguracją mutacji. */
  test('testy czytające tekst źródłowy mutowanego modułu lib/ są poza konfiguracją mutacji (kopia Strykera instrumentuje moduły)', () => {
    const mutowane = (JSON.parse(readFileSync(join(root, 'stryker.config.json'), 'utf8')).mutate as string[]).map(m => m.replace(/\.ts$/, ''));
    const zrodlowe = testy.filter(f => czytaZrodlo(readFileSync(join(root, 'tests', f), 'utf8'), mutowane));
    expect(zrodlowe).toContain('m5s1-dni-treningowe.test.ts');
    expect(zrodlowe.filter(f => !ignored('tests/' + f))).toEqual([]);
  });
  /* Nocne 41347718181 (analiza 02.11.2026, wariant A): tests/audit-m1-045-store-description.test.ts czyta lib/access.ts pomocnikiem read() (ścieżka nie stoi przy readFileSync) — dawny regex tego
     nie widział i suche przejście Strykera dla `access` padało; to samo audit-m1-046 (code() → lib/timer.ts) i m5s1-bez-proby (tablica ścieżek). Testy logiki tych modułów zostają. */
  test('02.11.2026: testy czytające źródło przez pomocnik (read/code) albo z tablicy ścieżek są poza konfiguracją; testy logiki access/timer zostają', () => {
    for (const f of ['audit-m1-045-store-description', 'audit-m1-046-privacy-notifications', 'm5s1-bez-proby']) expect([f, ignored(`tests/${f}.test.ts`)]).toEqual([f, true]);
    for (const f of ['access', 'timer-logic', 'entitlement', 'csv-import-logic']) { expect(testy).toContain(`${f}.test.ts`); expect([f, ignored(`tests/${f}.test.ts`)]).toEqual([f, false]); }
  });
  test('czytaZrodlo: literał ścieżki + readFileSync (także w pomocniku); sam import, komentarz i brak odczytu nie liczą się', () => {
    const m = ['lib/access', 'lib/state/migrate'];
    expect(czytaZrodlo("const read = (f) => fs.readFileSync(f); read('lib/access.ts')", m)).toBe(true);
    expect(czytaZrodlo('const r = fs.readFileSync; r(`lib/state/migrate.ts`)', m)).toBe(true);
    expect(czytaZrodlo('const files = ["lib/access.ts"]; fs.readFileSync(files[0])', m)).toBe(true);
    expect(czytaZrodlo("import { PAYWALL } from '@/lib/access'; fs.readFileSync('docs/x.md')", m)).toBe(false);
    expect(czytaZrodlo("// 'lib/access.ts'\nfs.readFileSync('docs/x.md')", m)).toBe(false);
    expect(czytaZrodlo("const x = 'lib/access.ts';", m)).toBe(false);
    expect(czytaZrodlo("fs.readFileSync(path.join(__dirname, '../lib/access.ts'), 'utf8')", m)).toBe(true);
    expect(czytaZrodlo("fs.readFileSync('lib/accessory.ts')", m)).toBe(false);
  });
  test('testy z dwoma znanymi przypadkami z audytu są wykluczone: backlog-0.10.1-dane i locations-catalog', () => {
    expect(ignored('tests/backlog-0.10.1-dane.test.ts')).toBe(true);
    expect(ignored('tests/locations-catalog.test.ts')).toBe(true);
  });
  /* Nocne 08.11.2026 (diagnoza main 2e4b0f82): „failed tests in the initial test run” dla modułu access — tests/m5s1-dni-treningowe.test.ts czyta tekst lib/access.ts regexem,
     a kopia Strykera jest zinstrumentowana. Nazwany przypadek (nie tylko reguła ogólna): test zostaje w zwykłym Jest, w przebiegu Stryker go nie ma; logika access zostaje. */
  test('08.11.2026: m5s1-dni-treningowe (regex na tekście lib/access.ts) jest poza przebiegiem Stryker, a testy logiki access w nim zostają', () => {
    expect(ignored('tests/m5s1-dni-treningowe.test.ts')).toBe(true);
    expect(readFileSync(join(root, 'tests/m5s1-dni-treningowe.test.ts'), 'utf8')).toMatch(/readFileSync\(path\.join\(__dirname, '\.\.\/lib\/access\.ts'\)/);
    for (const f of ['access.test.ts', 'm5s1-dni-zapis.test.ts']) expect(ignored('tests/' + f)).toBe(false);
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
