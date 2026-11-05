/* Strażnik czasu pojedynczego testu (decyzja właściciela 05.11.2026 ~11:40 UTC, wariant A; lekcja o tests/audit-k1-bl-mer.test.tsx w docs/40).
 * Logika: scripts/kontrola-czasu-testu.mjs; źródło czasów: wynik JSON zapisany przez scripts/jest-ponow.mjs (JEST_PONOW_WYNIK); próg w scripts/ci/czasy-tests.json.
 * Negatywy: test ponad progiem → odmowa z nazwą; poniżej → OK; brak czasów → jasny komunikat (nie cichy sukces); L-080: gałąź z wcześniejszymi zmianami. */
import { spawnSync } from 'child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const ROOT = join(__dirname, '..');
const SKRYPT = join(ROOT, 'scripts/kontrola-czasu-testu.mjs');
const czasy = JSON.parse(readFileSync(join(ROOT, 'scripts/ci/czasy-tests.json'), 'utf8'));
const yml = readFileSync(join(ROOT, '.github/workflows/tests.yml'), 'utf8');
const PROG: number = czasy.prog_czasu_testu;

type Ocena = { naruszenia: { plik: string; test: string; ms: number; limit: number; udzial: number }[]; wyjatki: unknown[]; zmierzone: number; bladCzasow?: string };
/* Moduł .mjs ładujemy w osobnym procesie Node (Jest tu nie obsługuje dynamicznego import ESM); funkcje dostają dane jako JSON. */
const wModule = (kod: string, wejscie: unknown) => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SKRYPT)}; const w = JSON.parse(process.env.WEJSCIE); console.log(JSON.stringify(${kod}));`], { encoding: 'utf8', env: { ...process.env, WEJSCIE: JSON.stringify(wejscie) } });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
};
const mod = {
  limitPliku: (zrodlo: string, domyslny: number) => wModule('m.limitPliku(w.zrodlo, w.domyslny)', { zrodlo, domyslny }),
  ocenCzasy: (wynik: object, o: { prog: number; odczytaj: (p: string) => string | null; wyjatki: object[]; domyslny: number; korzen: string }) =>
    wModule('(() => { const z = w.zrodla; return m.ocenCzasy(w.wynik, { prog: w.prog, odczytaj: p => z[p] ?? null, wyjatki: w.wyjatki, domyslny: w.domyslny, korzen: w.korzen }); })()',
      { wynik, prog: o.prog, wyjatki: o.wyjatki, domyslny: o.domyslny, korzen: o.korzen, zrodla: ZRODLA_BIEZACE }),
};
let ZRODLA_BIEZACE: Record<string, string> = {};

const przypadek = (title: string, duration: number | null) => ({ title, fullName: `S ${title}`, status: 'passed', duration });
const wynik = (...pliki: { name: string; assertionResults: object[] }[]) => ({ success: true, testResults: pliki });
const plik = (name: string, ...a: object[]) => ({ name, assertionResults: a });
const oceń = (w: object, zrodla: Record<string, string>, wyjatki: object[] = []): Ocena => {
  ZRODLA_BIEZACE = zrodla;
  return mod.ocenCzasy(w, { prog: PROG, odczytaj: (p: string) => zrodla[p] ?? null, wyjatki, domyslny: 5000, korzen: '/r' });
};

describe('próg (05.11.2026): jedyne źródło liczby to scripts/ci/czasy-tests.json', () => {
  test('prog_czasu_testu = 0,5 z opisem; skrypt nie ma własnej liczby progu', () => {
    expect(PROG).toBe(0.5);
    expect(czasy.prog_czasu_testu_opis).toMatch(/05\.11\.2026/);
    expect(readFileSync(SKRYPT, 'utf8')).not.toMatch(/\b0\.5\b|\b50\s*%/);
  });
});

describe('limitPliku: limit przypadków wyznaczony statycznie z pliku testu (05.11.2026)', () => {
  test('brak jawnego limitu → domyślny z konfiguracji Jest', () => { expect(mod.limitPliku('test("a", () => {});', 5000)).toEqual({ limit: 5000, zrodlo: 'domyślny' }); });
  test('jest.setTimeout(N) i separator tysięcy _', () => {
    expect(mod.limitPliku('jest.setTimeout(240000);\n', 5000)).toEqual({ limit: 240000, zrodlo: 'jest.setTimeout' });
    expect(mod.limitPliku('jest.setTimeout(60_000);', 5000).limit).toBe(60000);
  });
  test('jawny limit przypadku: trzeci argument zamykający test', () => {
    expect(mod.limitPliku('test("a", async () => {\n  x();\n}, 480000);', 5000)).toEqual({ limit: 480000, zrodlo: 'jawny limit przypadku' });
  });
  test('największy z kilku; małe liczby (< 1000) w innych wywołaniach nie są limitem', () => {
    expect(mod.limitPliku('jest.setTimeout(60000); test("a", () => {}, 120000); f({ a: 1 }, 20);', 5000).limit).toBe(120000);
    expect(mod.limitPliku('f({ a: 1 }, 20);', 5000).limit).toBe(5000);
  });
});

describe('ocenCzasy: ponad progiem → odmowa z nazwą, poniżej → OK (05.11.2026)', () => {
  const zrodla = { 'tests/a.test.ts': 'jest.setTimeout(240000);' };
  test('test trwający 121 s przy limicie 240 s (ponad 50%) → naruszenie z plikiem, nazwą, czasem i limitem', () => {
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('wolny', 121000), przypadek('szybki', 100))), zrodla);
    expect(r.naruszenia).toHaveLength(1);
    expect(r.naruszenia[0]).toMatchObject({ plik: 'tests/a.test.ts', test: 'S wolny', ms: 121000, limit: 240000 });
    expect(r.naruszenia[0].udzial).toBeGreaterThan(PROG);
    expect(r.zmierzone).toBe(2);
  });
  test('dokładnie na progu (120 s z 240 s) → OK; poniżej → OK', () => {
    expect(oceń(wynik(plik('/r/tests/a.test.ts', przypadek('na progu', 240000 * PROG), przypadek('mało', 1000))), zrodla).naruszenia).toEqual([]);
  });
  test('plik bez jawnego limitu: 3 s przy domyślnych 5 s → naruszenie, 2 s → OK', () => {
    expect(oceń(wynik(plik('/r/tests/b.test.ts', przypadek('3 s', 3000))), {}).naruszenia).toHaveLength(1);
    expect(oceń(wynik(plik('/r/tests/b.test.ts', przypadek('2 s', 2000))), {}).naruszenia).toEqual([]);
  });
  test('przypadek pominięty (duration null) nie liczy się', () => {
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('pominięty', null), przypadek('ok', 10))), zrodla);
    expect(r.zmierzone).toBe(1); expect(r.naruszenia).toEqual([]);
  });
  test('wyjątek (plik + pełna nazwa testu) przenosi naruszenie na listę wyjątków; inny test w tym samym pliku nadal odrzucony', () => {
    const w = [{ plik: 'tests/a.test.ts', test: 'S wolny', powod: 'p', data: '05.11.2026', plan: 'pl' }];
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('wolny', 200000), przypadek('inny', 200000))), zrodla, w);
    expect(r.wyjatki).toHaveLength(1); expect(r.naruszenia.map(n => n.test)).toEqual(['S inny']);
  });
  test('brak czasów: pusty wynik albo przypadki bez duration → bladCzasow, nie cichy sukces', () => {
    expect(oceń({ testResults: [] }, {}).bladCzasow).toMatch(/brak czasów/);
    expect(oceń(wynik(plik('/r/tests/a.test.ts', { title: 'x', status: 'passed' })), {}).bladCzasow).toMatch(/duration/);
  });
});

describe('polecenie node scripts/kontrola-czasu-testu.mjs (05.11.2026)', () => {
  const tmp: string[] = [];
  afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
  /** Korzeń próbny: scripts/ci/czasy-tests.json z progiem, package.json, opcjonalnie plik testu i wyjątki. */
  function korzen(opcje: { testy?: Record<string, string>; wyjatki?: object[] } = {}) {
    const d = mkdtempSync(join(tmpdir(), 'czas-testu-')); tmp.push(d);
    mkdirSync(join(d, 'scripts/ci'), { recursive: true }); mkdirSync(join(d, 'tests'), { recursive: true });
    writeFileSync(join(d, 'scripts/ci/czasy-tests.json'), JSON.stringify({ prog_czasu_testu: PROG }));
    writeFileSync(join(d, 'package.json'), JSON.stringify({ jest: {} }));
    for (const [p, z] of Object.entries(opcje.testy ?? {})) writeFileSync(join(d, p), z);
    if (opcje.wyjatki) writeFileSync(join(d, 'tests/czas-testu-wyjatki.json'), JSON.stringify({ wyjatki: opcje.wyjatki }));
    return d;
  }
  const uruchom = (d: string, w: object | null) => {
    const f = join(d, 'wynik.json'); if (w) writeFileSync(f, JSON.stringify(w));
    return spawnSync(process.execPath, [SKRYPT, f, '--root', d], { encoding: 'utf8' });
  };
  const wolny = (d: string) => wynik(plik(join(d, 'tests/a.test.ts'), przypadek('wolny', 130000), przypadek('szybki', 50)));

  test('test ponad progiem → kod 1, komunikat z nazwą testu, czasem i limitem', () => {
    const d = korzen({ testy: { 'tests/a.test.ts': 'jest.setTimeout(240000);' } });
    const r = uruchom(d, wolny(d));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('tests/a.test.ts'); expect(r.stderr).toContain('S wolny'); expect(r.stderr).toMatch(/130\.0 s z limitu 240 s/); expect(r.stderr).toMatch(/podziel/);
  });
  test('wszystko poniżej progu → kod 0 i linia raportu z liczbą przypadków', () => {
    const d = korzen({ testy: { 'tests/a.test.ts': 'jest.setTimeout(240000);' } });
    const r = uruchom(d, wynik(plik(join(d, 'tests/a.test.ts'), przypadek('a', 1000), przypadek('b', 2000))));
    expect(r.status).toBe(0); expect(r.stdout).toMatch(/kontrola-czasu-testu: 2 przypadków, próg 50% limitu; ponad progiem: 0, z wyjątkiem: 0/);
  });
  test('wyjątek w tests/czas-testu-wyjatki.json → kod 0, wyjątek wypisany z planem', () => {
    const d = korzen({ testy: { 'tests/a.test.ts': 'jest.setTimeout(240000);' }, wyjatki: [{ plik: 'tests/a.test.ts', test: 'S wolny', powod: 'p', data: '05.11.2026', plan: 'podział na języki' }] });
    const r = uruchom(d, wolny(d));
    expect(r.status).toBe(0); expect(r.stdout).toMatch(/wyjątek \(05\.11\.2026\).*podział na języki/);
  });
  test('brak pliku wyniku → kod 2 i komunikat (nie cichy sukces); wynik bez czasów → kod 2', () => {
    const d = korzen(); const r = uruchom(d, null);
    expect(r.status).toBe(2); expect(r.stderr).toMatch(/brak pliku wyniku Jest.*kontrola NIE przeszła/);
    const r2 = uruchom(d, { success: true, testResults: [] });
    expect(r2.status).toBe(2); expect(r2.stderr).toMatch(/brak czasów/);
  });
  test('uszkodzony JSON → kod 2', () => {
    const d = korzen(); writeFileSync(join(d, 'wynik.json'), '{nie json');
    const r = spawnSync(process.execPath, [SKRYPT, join(d, 'wynik.json'), '--root', d], { encoding: 'utf8' });
    expect(r.status).toBe(2); expect(r.stderr).toMatch(/nie jest poprawnym JSON/);
  });
  test('L-080 (05.11.2026): gałąź z wcześniejszymi zmianami względem main — kontrola liczy tylko z wyniku przebiegu, nie z różnicy gałęzi; ten sam werdykt na main i na gałęzi', () => {
    const d = korzen({ testy: { 'tests/a.test.ts': 'jest.setTimeout(240000);' } });
    const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' };
    const g = (...a: string[]) => spawnSync('git', a, { cwd: d, env, encoding: 'utf8' });
    g('init', '-q', '-b', 'main'); g('add', '.'); g('commit', '-q', '-m', 'baza');
    g('checkout', '-q', '-b', 'funkcja'); writeFileSync(join(d, 'tests/inny.test.ts'), '// wcześniejsza zmiana'); g('add', '.'); g('commit', '-q', '-m', 'wcześniejszy kod');
    writeFileSync(join(d, 'docs.md'), 'tylko dokument'); g('add', '.'); g('commit', '-q', '-m', 'dokument');
    expect(uruchom(d, wolny(d)).status).toBe(1);
    g('checkout', '-q', 'main');
    expect(uruchom(d, wolny(d)).status).toBe(1);
  });
});

describe('jest-ponow zapisuje wynik dla strażnika (JEST_PONOW_WYNIK, 05.11.2026)', () => {
  const FAKE = `const fs=require('fs');const dir=process.env.FAKE_DIR;const n=fs.readdirSync(dir).filter(f=>f.startsWith('call-')).length;fs.writeFileSync(dir+'/call-'+n,'');
const sc=JSON.parse(fs.readFileSync(dir+'/sc.json','utf8'));const out=process.argv.find(a=>a.startsWith('--outputFile=')).slice(13);fs.writeFileSync(out,JSON.stringify(sc[n]));process.exit(sc[n].success?0:1);`;
  const uruchomPonow = (...przebiegi: object[]) => {
    const d = mkdtempSync(join(tmpdir(), 'ponow-wynik-'));
    try {
      writeFileSync(join(d, 'fake.js'), FAKE); writeFileSync(join(d, 'sc.json'), JSON.stringify(przebiegi));
      const r = spawnSync(process.execPath, [join(ROOT, 'scripts/jest-ponow.mjs')], { encoding: 'utf8', env: { ...process.env, JEST_PONOW_JEST: join(d, 'fake.js'), FAKE_DIR: d, JEST_PONOW_WYNIK: join(d, 'wynik.json') } });
      return { kod: r.status, wynik: existsSync(join(d, 'wynik.json')) ? JSON.parse(readFileSync(join(d, 'wynik.json'), 'utf8')) : null };
    } finally { rmSync(d, { recursive: true, force: true }); }
  };
  const ok = (name: string, ms: number) => ({ name, status: 'passed', message: '', assertionResults: [{ status: 'passed', duration: ms }] });
  test('zielony przebieg → plik wyniku z czasami', () => {
    const r = uruchomPonow({ success: true, testResults: [ok('/a.test.ts', 7)] });
    expect(r.kod).toBe(0); expect(r.wynik.testResults[0].assertionResults[0].duration).toBe(7);
  });
  test('plik ponowiony: w wyniku czasy z ponowienia, pozostałe pliki z pierwszego przebiegu', () => {
    const przerwany = { name: '/b.test.ts', status: 'failed', message: 'Test suite failed to run\n\n  A jest worker process (pid=1) was terminated by another process: signal=SIGTERM, exitCode=null.', assertionResults: [] };
    const r = uruchomPonow({ success: false, testResults: [ok('/a.test.ts', 7), przerwany] }, { success: true, testResults: [ok('/b.test.ts', 99)] });
    expect(r.kod).toBe(0);
    expect(r.wynik.testResults.map((t: { name: string; assertionResults: { duration?: number }[] }) => [t.name, t.assertionResults[0]?.duration])).toEqual([['/a.test.ts', 7], ['/b.test.ts', 99]]);
  });
});

describe('tests.yml: strażnik w każdej części Jest po kroku Jest (05.11.2026; wzór tests/tests-yml-czas.test.ts)', () => {
  const jest = yml.slice(yml.indexOf('\n  jest:'), yml.indexOf('\n  verify:'));
  test('krok Jest zapisuje wynik (JEST_PONOW_WYNIK), a następny krok uruchamia scripts/kontrola-czasu-testu.mjs na tym samym pliku', () => {
    expect(jest).toMatch(/JEST_PONOW_WYNIK: \$\{\{ runner\.temp \}\}\/jest-wynik\.json/);
    const iJest = jest.indexOf('node scripts/jest-ponow.mjs'); const iKontrola = jest.indexOf('node scripts/kontrola-czasu-testu.mjs "$WYNIK_JEST"');
    expect(iJest).toBeGreaterThan(0); expect(iKontrola).toBeGreaterThan(iJest);
    expect(jest).toMatch(/kontrola-czasu-testu\.mjs "\$WYNIK_JEST"/); expect(jest).toMatch(/WYNIK_JEST: \$\{\{ runner\.temp \}\}\/jest-wynik\.json/); /* 05.11.2026: osobna nazwa zmiennej w kroku kontroli — „PONOW” w kroku łapał strażnik ponowień (tests/ponowienia-workflow.test.ts) */
  });
  test('krok kontroli nie jest pomijany po zielonym Jeście (bez if: false / continue-on-error)', () => {
    const krok = jest.slice(jest.indexOf('- name: Czas pojedynczego testu'));
    expect(krok).toContain('kontrola-czasu-testu.mjs'); expect(krok).not.toMatch(/continue-on-error|if:\s*false/);
  });
});

describe('tests/czas-testu-wyjatki.json: wyjątki z powodem, datą i planem (05.11.2026)', () => {
  const plikWyj = join(ROOT, 'tests/czas-testu-wyjatki.json');
  const w = JSON.parse(readFileSync(plikWyj, 'utf8')) as { wyjatki: { plik: string; test: string; powod: string; data: string; plan: string }[] };
  test('każdy wpis ma plik testu istniejący w repo, nazwę, powód, datę DD.MM.RRRR i plan; bez duplikatów', () => {
    for (const x of w.wyjatki) {
      expect(existsSync(join(ROOT, x.plik))).toBe(true);
      expect(x.test.length).toBeGreaterThan(0); expect(x.powod.length).toBeGreaterThan(10); expect(x.plan.length).toBeGreaterThan(10);
      expect(x.data).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    }
    expect(new Set(w.wyjatki.map(x => `${x.plik}|${x.test}`)).size).toBe(w.wyjatki.length);
  });
});
