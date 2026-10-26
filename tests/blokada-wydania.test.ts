/*
 * Blokada wydania przez wyjątek anonimizacji (decyzja właściciela 25.10.2026, docs/18; rejestr ryzyk docs/40, R-015): stare tłumaczenia z nazwami źródeł pod nowym kluczem
 * (rodzaj „zmieniony” w zestawie przekładu) są dopuszczone tylko do czasu przekładu przez API; przed wydaniem wyjątek musi być pusty (`npm run check:release`).
 * Rodzaje (docs/20): logika (openExceptions na sztucznym repozytorium), scenariusz (kod wyjścia 1 / 0), niezmienniki (stan repozytorium zgodny z zestawem), dokument (wiersz R-015).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { PENDING } from './pending-translation';

const root = path.join(__dirname, '..');
const SCRIPT = path.join(root, 'scripts/ci/blokada-wydania.mjs');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
type Open = { keys: string[]; translations: number; languages: number; withNames: string[]; namedTranslations: number };
const openIn = (dir: string): Open => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `import { openExceptions } from ${JSON.stringify('file://' + SCRIPT)}; process.stdout.write(JSON.stringify(openExceptions(process.argv[1])));`, dir], { encoding: 'utf8' }));
/** Sztuczne repozytorium: zestaw przekładu + słowniki dwóch języków (jeden ze starym tłumaczeniem z nazwą, drugi bez nazwy). */
function fake(klucze: { rodzaj: string; pl: string }[], dicts: Record<string, Record<string, string>>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blokada-'));
  fs.mkdirSync(path.join(dir, 'docs/lokalizacja'), { recursive: true }); fs.mkdirSync(path.join(dir, 'lib/locales'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs/lokalizacja/zestaw-przekladu-2026-10-23.json'), JSON.stringify({ klucze }));
  for (const [l, d] of Object.entries(dicts)) fs.writeFileSync(path.join(dir, `lib/locales/${l}.json`), JSON.stringify(d));
  fs.writeFileSync(path.join(dir, 'lib/locales/_source.json'), '[]');
  return dir;
}

describe('blokada wydania: openExceptions', () => {
  test('liczy tylko wpisy „zmieniony”; „nowy” nie jest wyjątkiem anonimizacji; zlicza stare tłumaczenia i te z nazwami źródeł', () => {
    const dir = fake([{ rodzaj: 'zmieniony', pl: 'A' }, { rodzaj: 'zmieniony', pl: 'B' }, { rodzaj: 'nowy', pl: 'C' }], { cs: { A: 'Pravidlo (WHO, ACSM)', B: 'Bez nazwy', C: 'x' }, de: { A: 'Regel', B: 'Ohne' } });
    const r = openIn(dir);
    expect(r.keys).toEqual(['A', 'B']); expect(r.translations).toBe(4); expect(r.languages).toBe(2); expect(r.withNames).toEqual(['A']); expect(r.namedTranslations).toBe(1);
  });
  test('pusty zestaw (po przekładzie) → brak wyjątków', () => {
    const r = openIn(fake([], { cs: { A: 'x' } })); expect(r.keys).toEqual([]); expect(r.withNames).toEqual([]); expect(r.namedTranslations).toBe(0);
  });
});

describe('blokada wydania: skrypt w repozytorium', () => {
  const run = () => spawnSync('node', [SCRIPT], { encoding: 'utf8' });
  test('kod wyjścia 1 dokładnie wtedy, gdy zestaw przekładu ma wpisy „zmieniony”; komunikat wskazuje R-015 i liczby', () => {
    const pending = PENDING.filter(p => p.rodzaj === 'zmieniony').length;
    const r = run();
    expect(r.status).toBe(pending > 0 ? 1 : 0);
    if (pending > 0) { expect(r.stderr).toContain('R-015'); expect(r.stderr).toContain(`${pending} kluczy`); expect(r.stderr).toContain('WYDANIE ZABLOKOWANE'); }
    else expect(r.stdout).toContain('wyjątek anonimizacji pusty');
  });
  test('npm run check:release istnieje i NIE jest częścią verify (zwykła praca ma prawo mieć wyjątek; blokuje krok wydania)', () => {
    const s = JSON.parse(read('package.json')).scripts as Record<string, string>;
    expect(s['check:release']).toBe('node scripts/ci/blokada-wydania.mjs'); expect(s.verify).not.toContain('check:release');
  });
});

describe('rejestr ryzyk: R-015', () => {
  const row = () => read('docs/40-lekcje.md').split('\n').find(l => l.startsWith('| R-015 |')) ?? '';
  test('wiersz R-015: opis ryzyka, automatyczny warunek zamknięcia (check:release) i stan „otwarte”, dopóki zestaw ma wpisy „zmieniony”', () => {
    const cells = row().split('|').map(c => c.trim());
    expect(cells[1]).toBe('R-015'); expect(cells[2]).toMatch(/nazw[aą]? źródeł|nazwami źródeł/); expect(cells[3]).toContain('npm run check:release');
    const pending = PENDING.some(p => p.rodzaj === 'zmieniony');
    expect(/^otwarte/.test(cells[4])).toBe(pending); if (!pending) expect(cells[4]).toMatch(/^\*\*zamknięte \d{2}\.\d{2}\.\d{4}\*\*/);
  });
});
