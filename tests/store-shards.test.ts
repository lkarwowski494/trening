/*
 * Podział zrzutów do App Store na równoległe zadania macOS (27.10.2026; decyzja właściciela: wszystkie 35 języków). Przyczyna: przebieg „all” w jednym zadaniu
 * (run 40464544722) zmierzył ok. 2,7 min na ekran → ok. 16 h na rozmiar, limit zadania 180 min ucinał po ok. 6 językach (docs/40, lekcja o estymacie niezmierzonej).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { LANGS } from '@/lib/i18n';

const root = path.join(__dirname, '..');
const wf = fs.readFileSync(path.join(root, '.github/workflows/store-screenshots.yml'), 'utf8');
const sh = fs.readFileSync(path.join(root, 'scripts/ci/store-screenshots.sh'), 'utf8');
/** Skrypt jest ESM (.mjs) — wołamy go w procesie potomnym; `ls` podmienia odczyt katalogu danych (lista nazw plików). */
function esm(expr: string): any {
  const out = execFileSync('node', ['--input-type=module', '-e', `import * as M from ${JSON.stringify(path.join(root, 'scripts/ci/store-shards.mjs'))}; const r = ${expr}; console.log(JSON.stringify(r === undefined ? null : r))`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(out);
}
const tryEsm = (expr: string): string => { try { esm(expr); return ''; } catch (e) { return String((e as { stderr?: Buffer }).stderr ?? e); } };
const names = (ls: readonly string[]) => JSON.stringify(ls.map(l => `routes-${l}.json`).concat(['state-pl-trening.json', 'trening-historia.csv']));
const plan = (lang: string, sizes: string, n: number, ls?: string) => esm(`M.plan(${JSON.stringify(lang)}, ${JSON.stringify(sizes)}, ${n}, 'x'${ls ? `, () => ${ls}` : ''})`);
const SIZES = esm('M.SIZES'); const PER_SCREEN_MIN: number = esm('M.PER_SCREEN_MIN'); const MAX_SHARDS: number = esm('M.MAX_SHARDS');

describe('store-shards: podział języków', () => {
  test('all = wszystkie 35 języków z plików routes, bez powtórzeń, każdy dokładnie raz w rozmiarze', () => {
    const m = plan('all', '6.9', 6, names(LANGS));
    expect(m.include).toHaveLength(6);
    const all = m.include.flatMap((j: { jezyki: string }) => j.jezyki.split(','));
    expect(all).toHaveLength(35); expect(new Set(all).size).toBe(35); expect([...all].sort()).toEqual([...LANGS].sort());
    for (const j of m.include) expect(j.jezyki.split(',').length).toBeGreaterThanOrEqual(5); /* 35 / 6 — po 5–6 języków (2,7–3,5 h na zadanie, limit zadania 330 min), dwie fale po 3 zadania */
  });
  test('zadania nierówne różnią się najwyżej o 1 język', () => {
    const sizes = plan('all', '6.9', 4, names(LANGS)).include.map((j: { jezyki: string }) => j.jezyki.split(',').length);
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1); expect(sizes.reduce((a: number, b: number) => a + b)).toBe(35);
  });
  test('rozmiary: 6.9 i 6.3 dają osobne zadania z wzorcem symulatora', () => {
    const m = plan('pl,en', '6.9,6.3', 1);
    expect(m.include.map((j: { rozmiar: string; shard: number; jezyki: string }) => `${j.rozmiar}#${j.shard}:${j.jezyki}`)).toEqual(['6.9#1:pl,en', '6.3#1:pl,en']);
    expect(m.include[0].wzorzec).toBe(SIZES['6.9']); expect(m.include[1].wzorzec).toBe(SIZES['6.3']);
  });
  test('lista po przecinku: bez powtórzeń i pustych; więcej zadań niż języków = po jednym', () => {
    expect(esm("M.languagesFrom('pl, en,pl,,de', 'x')")).toEqual(['pl', 'en', 'de']);
    expect(plan('pl,en', '6.9', 5).include).toHaveLength(2);
    expect(esm("M.split(['a', 'b', 'c'], 5)")).toEqual([['a'], ['b'], ['c']]);
  });
  test('błędy: nieznany rozmiar, liczba zadań poza 1–8, brak języków', () => {
    expect(tryEsm("M.plan('pl', '7.0', 1, 'x')")).toMatch(/nieznany rozmiar/);
    expect(tryEsm("M.plan('pl', '6.9', 0, 'x')")).toMatch(/liczba zadań/);
    expect(tryEsm(`M.plan('pl', '6.9', ${MAX_SHARDS + 1}, 'x')`)).toMatch(/liczba zadań/);
    expect(tryEsm("M.plan('all', '6.9', 1, 'x', () => [])")).toMatch(/brak języków/);
  });
});

describe('store-screenshots.yml: macierz z podziału, scalanie artefaktów, powtórzenie ekranu', () => {
  test('macierz z wyjścia zadania „dane”, nazwa artefaktu z numerem zadania, limit czasu ponad pomiar', () => {
    expect(wf).toMatch(/matrix: \$\{\{ fromJSON\(needs\.dane\.outputs\.matrix\) \}\}/);
    expect(wf).toMatch(/node scripts\/ci\/store-shards\.mjs/);
    expect(wf).toMatch(/name: 'zrzuty \(\$\{\{ matrix\.rozmiar \}\}, zadanie \$\{\{ matrix\.shard \}\}\)'/); /* bez znaku # poza cudzysłowem (komentarz YAML) */
    expect(wf).toMatch(/name: sklep-zrzuty-\$\{\{ matrix\.rozmiar \}\}-\$\{\{ matrix\.shard \}\}/);
    expect(wf).toMatch(/JEZYKI: \$\{\{ matrix\.jezyki \}\}/);
    const t = Number(/timeout-minutes: (\d+)   # pomiar 27\.10\.2026/.exec(wf)![1]);
    expect(t).toBeGreaterThanOrEqual(Math.ceil(6 * 10 * PER_SCREEN_MIN) + 60); expect(t).toBeLessThanOrEqual(360);
  });
  test('ramki scalają artefakty wszystkich zadań (pattern + merge-multiple)', () => {
    expect(wf).toMatch(/pattern: sklep-zrzuty-\*\n\s+path: sklep-zrzuty\n\s+merge-multiple: true/);
  });
  test('wejścia rozmiary / zadan / ekrany; domyślnie 6.9 i 6 zadań, najwyżej 3 naraz', () => {
    expect(wf).toMatch(/rozmiary:[\s\S]*?default: '6\.9'/); expect(wf).toMatch(/zadan:[\s\S]*?default: '6'/); expect(wf).toMatch(/max-parallel: 3/); expect(wf).toMatch(/ekrany:[\s\S]*?default: ''/);
    expect(wf).toMatch(/EKRANY: \$\{\{ inputs\.ekrany \}\}/);
  });
  test('skrypt zrzutów zapisuje pomiar czasu na ekran (podstawa kolejnych szacunków, lekcja z 27.10.2026)', () => {
    expect(sh).toMatch(/GITHUB_STEP_SUMMARY/); expect(sh).toMatch(/s na ekran/);
  });
  test('docs/48 nie podaje czasu zrzutów 35 języków bez oznaczenia pomiaru', () => {
    const d = fs.readFileSync(path.join(root, 'docs/48-zgloszenie-1-0.md'), 'utf8');
    expect(d).toMatch(/zmierzone 27\.10\.2026/); expect(d).not.toMatch(/CI ok\. 2 h zegarowo\)/);
  });
  test('skrypt: EKRANY filtruje ekrany, numeracja plików zostaje z pełnego scenorysu', () => {
    expect(sh).toMatch(/i=\$\(\(i \+ 1\)\)\n\s+if \[ -n "\$\{EKRANY:-\}" \] && \[\[ ",\$EKRANY," != \*",\$name,"\* \]\]; then continue; fi/);
  });
});
