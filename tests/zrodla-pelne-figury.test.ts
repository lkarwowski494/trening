/*
 * Testy, które potrzebują PEŁNYCH danych figur (data/zrodla/figures.json): źródła granic zakresu stawów, powody ćwiczeń bez rysunku, generator dokumentu docs/research/28,
 * zgodność pliku runtime (lib/figures/data.json, bez źródeł i powodów) z pełnymi danymi. Wyodrębnione z tests/figures.test.tsx (decyzja właściciela 25.10.2026: pełne
 * źródła mogą zostać przeniesione poza repozytorium publiczne razem z data/zrodla i tym plikiem). Rodzaje (docs/20): dane, niezmienniki (runtime = funkcja pełnych danych), dokument.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { FIG_DATA } from '@/lib/figures';
import { FIG_FULL } from './zrodla-pelne';

const root = path.join(__dirname, '..');
const KEYS = Object.keys(FIG_FULL.exercises);

describe('pełne dane figur (data/zrodla/figures.json)', () => {
  test('powód braku rysunku ma ≥ 40 znaków; granice zakresu stawów mają źródło (≥ 20 znaków) i min < max', () => {
    for (const [k, why] of Object.entries(FIG_FULL.open)) expect([k, why.length > 40]).toEqual([k, true]);
    for (const v of ['side', 'front'] as const) for (const [j, r] of Object.entries(FIG_FULL.rom[v])) expect([v, j, r.min < r.max, r.src.length > 20]).toEqual([v, j, true, true]);
  });
});

describe('plik runtime lib/figures/data.json = funkcja pełnych danych, bez nazw', () => {
  test('generator zrodla-runtime --check: plik aktualny', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
  });
  test('figury identyczne z pełnymi danymi poza figurami bez aktualnej recenzji bramki 4 (te są na liście otwartej); granice stawów te same (min/max) bez pola src; brak pola note w rom', () => {
    /* bramka 4 (CLAUDE.md 27.10.2026, DEC-01 b): przepuszczanie po recenzji — szczegóły i strażnik w tests/figury-recenzja.test.tsx */
    const rec: { v1: Record<string, { werdykt: string }> } = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/figury-recenzja.json'), 'utf8'));
    const hidden = KEYS.filter(k => !(k in FIG_DATA.exercises));
    for (const k of hidden) expect([k, rec.v1[k]?.werdykt]).toEqual([k, 'ukryta']);
    expect(FIG_DATA.exercises).toEqual(Object.fromEntries(KEYS.filter(k => !hidden.includes(k)).map(k => [k, FIG_FULL.exercises[k]])));
    for (const v of ['side', 'front'] as const) expect(FIG_DATA.rom[v]).toEqual(Object.fromEntries(Object.entries(FIG_FULL.rom[v]).map(([j, r]) => [j, { min: r.min, max: r.max }])));
    expect(FIG_DATA.open).toEqual([...Object.keys(FIG_FULL.open), ...hidden]);
    expect(Object.keys(FIG_DATA).sort()).toEqual(['exercises', 'open', 'rom']);
    expect(Object.keys(FIG_DATA.rom).sort()).toEqual(['front', 'side']);
  });
});

describe('dokument figur (generowany z pełnych danych)', () => {
  test('docs/research/28-figury.md aktualny i dane poprawne (scripts/figures/gen.mjs --check)', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/figures/gen.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    const doc = fs.readFileSync(path.join(root, 'docs/research/28-figury.md'), 'utf8');
    for (const k of KEYS) expect(doc).toContain(`### ${k}`);
    for (const k of Object.keys(FIG_FULL.open)) expect(doc).toContain(`| ${k} |`);
    expect(doc).toContain('Uproszczenie ilustracyjne');
  });
  test('verify uruchamia sprawdzenie dokumentu figur', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    expect(pkg.scripts['check:figures']).toBe('node scripts/figures/gen.mjs --check');
    expect(pkg.scripts.verify).toContain('npm run check:figures');
  });
});
