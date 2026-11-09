// skanuje: tests
/* L-103 (04.11.2026, koordynator 1.1): wybór testów czytających pliki przez fs (scripts/testy-dla-plikow.mjs) rozpoznaje też ścieżkę budowaną jako
   join(…, '<katalog>', <zmienna|szablon|konkatenacja>) — katalog jako osobny argument join, bez listowania (tests/figury-recenzja-p4a.test.ts:12 dla lib/figures/v2/poses/olympic.json).
   Strażnik na całym katalogu tests/: dla każdego testu z takim odczytem wybór dla istniejącego pliku z tego katalogu zawiera ten test (wyliczane z repo, bez listy ręcznej).
   Przypadek „gałąź z wcześniejszymi zmianami względem main” (L-080): wybór zależy tylko od treści testów i listy plików, nie od historii gita — pokazuje to test na liście zmian z kodem i dokumentami. */
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const MODUL = join(root, 'scripts/testy-dla-plikow.mjs');
/** Moduł .mjs ładujemy w osobnym procesie (Jest ma tu CommonJS): kod JS dostaje `m` i dane `d`, wypisuje JSON. */
const wMjs = <T>(kod: string, dane: unknown): T => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(MODUL)}; const d = JSON.parse(process.argv[1]); console.log(JSON.stringify(${kod}));`, JSON.stringify(dane)], { encoding: 'utf8', maxBuffer: 1 << 26 });
  expect([r.status, r.stderr]).toEqual([0, '']); return JSON.parse(r.stdout);
};
const wybor = (pliki: string[]): string[] => wMjs('m.testyCzytajace(d, ' + JSON.stringify(root) + ')', pliki);

describe('L-103: czytaKatalog — katalog jako argument join ze zmienną nazwą pliku', () => {
  const K = 'lib/figures/v2/poses';
  test.each([
    ["path.join(ROOT, 'lib/figures/v2/poses', `${rodzina}.json`)", true],
    ["join(ROOT, 'lib/figures/v2/poses', rodzina + '.json')", true],
    ["join(ROOT, 'lib/figures/v2/poses', nazwa)", true],
    ["join(ROOT, 'lib/figures/v2/poses', plik(rodzina))", true],
    ["join(ROOT, 'lib', 'figures/v2', 'poses', `${r}.json`)", true],
    ["join(ROOT, 'lib', 'figures', 'v2', 'poses', r)", true],
    ['readFileSync(`${ROOT}/lib/figures/v2/poses/${r}.json`)', true],
    ["join(ROOT, 'lib/figures/v2/poses', 'olympic.json')", false], // stały plik: wybiera go pełna ścieżka, nie katalog
    ["join(ROOT, 'lib/figures/v2/poses')", false],
    ["join(ROOT, 'lib/figures/v2', `${r}.json`)", false], // inny katalog
    ["// lib/figures/v2/poses są ręczne, join(ROOT, 'docs', x)", false],
  ])('%s → %s', (src, oczekiwane) => { expect(wMjs('m.czytaKatalog(d[0], d[1])', [src, K])).toBe(oczekiwane); });
});

describe('L-103: prawdziwe repo — zmiana pliku z katalogu czytanego przez join', () => {
  test('lib/figures/v2/poses/olympic.json wybiera tests/figury-recenzja-p4a.test.ts (przypadek z tests.yml 41799749451)', () => {
    expect(wybor(['lib/figures/v2/poses/olympic.json'])).toContain('tests/figury-recenzja-p4a.test.ts');
  });
  test('lista zmian z kodem i dokumentami (gałąź z wcześniejszymi zmianami względem main): wybór zawiera test p4a i test dokumentów', () => {
    const w = wybor(['lib/figures/v2/poses/olympic.json', 'lib/units.ts', 'docs/40-lekcje.md']);
    expect(w).toContain('tests/figury-recenzja-p4a.test.ts'); expect(w).toContain('tests/waskie-gardla-zb041.test.ts');
  });
  test('G3/L-100: rozszerzenie wzorca nie dokłada testów dla docs/research (pomiar 04.11.2026: 20 i 29 przed i po zmianie; wybierają je nazwy plików, nie katalog)', () => {
    /* 04.11.2026 (L-104): +1 — tests/wybor-testow-l104.test.ts czyta pliki docs/research w scenariuszach (pomiar: integracja 20/29, gałąź L-104 21/30; różnica = tylko ten test) */
    expect(wybor(['docs/research/rejestr-twierdzen.json']).length).toBeLessThanOrEqual(21);
    expect(wybor(['docs/research/figury-recenzja.json']).length).toBeLessThanOrEqual(31); /* 04.11.2026 (L-104): +1 — ten sam test L-104 (ścieżki docs/research w scenariuszach); 09.11.2026 (A3): +1 — tests/zrodla-pelne-cues-a3-przyciaganie.test.ts czyta figury-recenzja.json (karty A3 bez wpisu „karty”, L-047; pomiar: 30 → 31, różnica = tylko ten test) */
  });
});

/** Ciągi literałów napisowych (argumenty join/resolve), po których następuje nazwa zmienna: szablon z ${}, identyfikator albo wywołanie funkcji. */
const CIAG = /((?:'[^'\n]*'|"[^"\n]*")\s*,\s*)+(?=`[^`]*\$\{|[A-Za-z_$][\w$.]*\s*[,)+(])/g;
const ODCZYT_FS = /\b(readFileSync|readFile|existsSync|statSync|lstatSync|readdirSync|createReadStream)\b/;

describe('L-103: strażnik na całym katalogu tests/ — każdy odczyt fs ze stałym katalogiem repo i zmienną nazwą pliku jest rozpoznany', () => {
  const testy = readdirSync(join(root, 'tests')).filter(f => /\.test\.tsx?$/.test(f));
  /** [test, katalog repo, przykładowy plik z katalogu] dla każdego odczytu stałego katalogu. */
  const przypadki: Array<[string, string, string]> = [];
  for (const t of testy) {
    const src = readFileSync(join(root, 'tests', t), 'utf8');
    if (!ODCZYT_FS.test(src)) continue;
    const widziane = new Set<string>();
    for (const m of src.matchAll(CIAG)) {
      const katalog = [...m[0].matchAll(/['"]([^'"]*)['"]/g)].map(x => x[1]).join('/').replace(/\/+/g, '/').replace(/^(\.\.?\/)+/, '').replace(/^\/|\/$/g, '');
      if (!katalog || katalog === '..' || katalog === '.' || katalog === 'docs' || widziane.has(katalog)) continue; // docs/NN-….md wybiera nazwa pliku, nie sam katalog (scripts/testy-dla-plikow.mjs: katalogMa)
      const abs = join(root, katalog);
      if (!existsSync(abs) || !statSync(abs).isDirectory()) continue;
      const plik = readdirSync(abs).sort().find(f => statSync(join(abs, f)).isFile());
      if (plik) { widziane.add(katalog); przypadki.push([t, katalog, `${katalog}/${plik}`]); }
    }
  }
  test('wykryto odczyty stałych katalogów (strażnik nie jest pusty)', () => { expect(przypadki.length).toBeGreaterThan(10); });
  test('dla każdego przypadku wybór dla pliku z katalogu zawiera test', () => {
    const wybrane = wMjs<string[][]>(`d.map(p => m.testyCzytajace([p], ${JSON.stringify(root)}))`, przypadki.map(([, , plik]) => plik));
    const brak = przypadki.filter(([t], i) => !wybrane[i].includes(`tests/${t}`)).map(([t, k]) => `${t} ← ${k}`);
    expect(brak).toEqual([]);
  });
});
