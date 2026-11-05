/* Strażnik czasu pojedynczego testu (decyzja właściciela 05.11.2026 ~11:40 UTC, wariant A; lekcja o tests/audit-k1-bl-mer.test.tsx w docs/40).
 * Logika: scripts/kontrola-czasu-testu.mjs; źródło czasów: wynik JSON zapisany przez scripts/jest-ponow.mjs (JEST_PONOW_WYNIK); próg w scripts/ci/czasy-tests.json.
 * Poprawka 05.11.2026 po przebiegu dowodowym tests.yml 42039115183 (129 fałszywych zgłoszeń przy limicie wyznaczanym statycznie z tekstu pliku):
 * limit efektywny zapisuje w czasie działania tests/setup-limity-czasu.js (JEST_LIMITY_PLIK), a lista bazowa tests/czas-testu-wyjatki.json działa jak zapadka.
 * Negatywy: test ponad progiem → odmowa z nazwą; poniżej → OK; brak czasów albo limitu → jasny komunikat (nie cichy sukces); wpis bazowy w progu → odmowa; L-080. */
import { spawnSync } from 'child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const ROOT = join(__dirname, '..');
const SKRYPT = join(ROOT, 'scripts/kontrola-czasu-testu.mjs');
const czasy = JSON.parse(readFileSync(join(ROOT, 'scripts/ci/czasy-tests.json'), 'utf8'));
const yml = readFileSync(join(ROOT, '.github/workflows/tests.yml'), 'utf8');
const PROG: number = czasy.prog_czasu_testu;

type Naruszenie = { plik: string; test: string; ms: number; limit: number; udzial: number };
type Ocena = { naruszenia: Naruszenie[]; wyjatki: unknown[]; zbedne: Naruszenie[]; bezLimitu: { plik: string; test: string }[]; zmierzone: number; bladCzasow?: string };
/* Moduł .mjs ładujemy w osobnym procesie Node (Jest tu nie obsługuje dynamicznego import ESM); funkcje dostają dane jako JSON. */
const wModule = (kod: string, wejscie: unknown) => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SKRYPT)}; const w = JSON.parse(process.env.WEJSCIE); console.log(JSON.stringify(${kod}));`], { encoding: 'utf8', env: { ...process.env, WEJSCIE: JSON.stringify(wejscie) } });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
};
const wczytajLimity = (tekst: string): { limity: Record<string, number | null>; uszkodzone: number } => wModule('m.wczytajLimity(w.tekst)', { tekst });

const przypadek = (title: string, duration: number | null) => ({ title, fullName: `S ${title}`, status: 'passed', duration });
const wynik = (...pliki: { name: string; assertionResults: object[] }[]) => ({ success: true, testResults: pliki });
const plik = (name: string, ...a: object[]) => ({ name, assertionResults: a });
const wiersz = (p: string, test: string, limit: number | null) => JSON.stringify({ plik: p, test, limit });
/** Limity dla przypadków `S <tytuł>` w pliku p. */
const limity = (p: string, wpisy: Record<string, number | null>) => wczytajLimity(Object.entries(wpisy).map(([t, l]) => wiersz(p, `S ${t}`, l)).join('\n')).limity;
const oceń = (w: object, lim: Record<string, number | null>, wyjatki: object[] = [], margines = 1): Ocena =>
  wModule('m.ocenCzasy(w.wynik, { prog: w.prog, limity: w.limity, wyjatki: w.wyjatki, margines: w.margines, korzen: "/r" })', { wynik: w, prog: PROG, limity: lim, wyjatki, margines });

describe('próg (05.11.2026): jedyne źródło liczby to scripts/ci/czasy-tests.json', () => {
  test('prog_czasu_testu = 0,5 z opisem; skrypt nie ma własnej liczby progu ani marginesu zapadki', () => {
    expect(PROG).toBe(0.5);
    expect(czasy.prog_czasu_testu_opis).toMatch(/05\.11\.2026/);
    expect(czasy.zapadka_margines).toBeGreaterThan(0); expect(czasy.zapadka_margines).toBeLessThanOrEqual(1);
    expect(czasy.zapadka_margines_opis).toMatch(/05\.11\.2026/);
    expect(readFileSync(SKRYPT, 'utf8')).not.toMatch(/\b0\.[58]\b|\b50\s*%|\b80\s*%/);
  });
});

describe('wczytajLimity: plik wierszy JSON z setup (05.11.2026)', () => {
  test('wiersz → limit; powtórzony przypadek (ponowienie pliku) — ostatni znany; null nie nadpisuje znanego; uszkodzone wiersze liczone', () => {
    const t = [wiersz('tests/a.test.ts', 'S x', 5000), wiersz('tests/a.test.ts', 'S x', 7000), wiersz('tests/a.test.ts', 'S x', null), wiersz('tests/a.test.ts', 'S y', null), '{nie json', '', '{"plik":1}'].join('\n');
    const r = wczytajLimity(t);
    expect(r.limity['tests/a.test.ts\tS x']).toBe(7000); expect(r.limity['tests/a.test.ts\tS y']).toBeNull(); expect(r.uszkodzone).toBe(2);
  });
});

describe('ocenCzasy: ponad progiem → odmowa z nazwą, poniżej → OK (05.11.2026)', () => {
  const lim = limity('tests/a.test.ts', { wolny: 240000, szybki: 240000, 'na progu': 240000, mało: 240000, inny: 240000, ok: 240000 });
  test('test trwający 121 s przy limicie 240 s (ponad 50%) → naruszenie z plikiem, nazwą, czasem i limitem', () => {
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('wolny', 121000), przypadek('szybki', 100))), lim);
    expect(r.naruszenia).toHaveLength(1);
    expect(r.naruszenia[0]).toMatchObject({ plik: 'tests/a.test.ts', test: 'S wolny', ms: 121000, limit: 240000 });
    expect(r.naruszenia[0].udzial).toBeGreaterThan(PROG);
    expect(r.zmierzone).toBe(2);
  });
  test('dokładnie na progu (120 s z 240 s) → OK; poniżej → OK', () => {
    expect(oceń(wynik(plik('/r/tests/a.test.ts', przypadek('na progu', 240000 * PROG), przypadek('mało', 1000))), lim).naruszenia).toEqual([]);
  });
  test('limit jest per przypadek, nie per plik: krótki test w pliku z długim limitem innego testu też jest oceniany (czego nie robił odczyt statyczny)', () => {
    const l = limity('tests/b.test.ts', { krótki: 5000, długi: 480000 });
    const r = oceń(wynik(plik('/r/tests/b.test.ts', przypadek('krótki', 3000), przypadek('długi', 100000))), l);
    expect(r.naruszenia.map(n => n.test)).toEqual(['S krótki']);
    expect(oceń(wynik(plik('/r/tests/b.test.ts', przypadek('krótki', 2000), przypadek('długi', 200000))), l).naruszenia).toEqual([]);
  });
  test('przypadek pominięty (duration null) nie liczy się', () => {
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('pominięty', null), przypadek('ok', 10))), lim);
    expect(r.zmierzone).toBe(1); expect(r.naruszenia).toEqual([]);
  });
  test('brak czasów: pusty wynik albo przypadki bez duration → bladCzasow, nie cichy sukces', () => {
    expect(oceń({ testResults: [] }, {}).bladCzasow).toMatch(/brak czasów/);
    expect(oceń(wynik(plik('/r/tests/a.test.ts', { title: 'x', status: 'passed' })), {}).bladCzasow).toMatch(/duration/);
  });
  test('przypadek bez znanego limitu (brak wiersza albo null) → na liście bezLimitu, nie cicho OK', () => {
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('nieznany', 1), przypadek('null', 1))), { 'tests/a.test.ts\tS null': null });
    expect(r.bezLimitu.map(x => x.test)).toEqual(['S nieznany', 'S null']); expect(r.naruszenia).toEqual([]);
  });
});

describe('zapadka: lista bazowa tylko maleje (05.11.2026)', () => {
  const lim = limity('tests/a.test.ts', { wolny: 240000, inny: 240000, 'tuż nad': 240000 });
  const w = [{ plik: 'tests/a.test.ts', test: 'S wolny', powod: 'stan bazowy 05.11.2026', data: '05.11.2026', plan: 'pl' }];
  test('wyjątek (plik + pełna nazwa testu) przenosi naruszenie na listę wyjątków; NOWY przypadek w tym samym pliku nadal odrzucony', () => {
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('wolny', 200000), przypadek('inny', 200000))), lim, w);
    expect(r.wyjatki).toHaveLength(1); expect(r.naruszenia.map(n => n.test)).toEqual(['S inny']); expect(r.zbedne).toEqual([]);
  });
  test('wpis bazowy, którego przypadek mieści się już w progu → zbędny (odmowa w poleceniu)', () => {
    const r = oceń(wynik(plik('/r/tests/a.test.ts', przypadek('wolny', 1000))), lim, w);
    expect(r.zbedne.map(n => n.test)).toEqual(['S wolny']); expect(r.naruszenia).toEqual([]);
  });
  test('margines: przypadek tuż pod progiem (49%) przy marginesie 0,8 nie czyni wpisu zbędnym; przy marginesie 1 — tak', () => {
    const tuz = wynik(plik('/r/tests/a.test.ts', przypadek('wolny', 240000 * 0.49)));
    expect(oceń(tuz, lim, w, 0.8).zbedne).toEqual([]); expect(oceń(tuz, lim, w, 1).zbedne).toHaveLength(1);
  });
  test('wpis bez przypadku w wyniku tej części (inny shard) jest pomijany — ani wyjątek, ani zbędny', () => {
    const r = oceń(wynik(plik('/r/tests/inny.test.ts', przypadek('x', 1))), { ...lim, ...limity('tests/inny.test.ts', { x: 5000 }) }, w);
    expect(r.zbedne).toEqual([]); expect(r.wyjatki).toEqual([]); expect(r.naruszenia).toEqual([]);
  });
});

describe('polecenie node scripts/kontrola-czasu-testu.mjs (05.11.2026)', () => {
  const tmp: string[] = [];
  afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
  /** Korzeń próbny: scripts/ci/czasy-tests.json z progiem, opcjonalnie wyjątki. */
  function korzen(opcje: { wyjatki?: object[]; margines?: number } = {}) {
    const d = mkdtempSync(join(tmpdir(), 'czas-testu-')); tmp.push(d);
    mkdirSync(join(d, 'scripts/ci'), { recursive: true }); mkdirSync(join(d, 'tests'), { recursive: true });
    writeFileSync(join(d, 'scripts/ci/czasy-tests.json'), JSON.stringify({ prog_czasu_testu: PROG, zapadka_margines: opcje.margines ?? 1 }));
    if (opcje.wyjatki) writeFileSync(join(d, 'tests/czas-testu-wyjatki.json'), JSON.stringify({ wyjatki: opcje.wyjatki }));
    return d;
  }
  const uruchom = (d: string, w: object | null, lim: string | null = wiersze({ wolny: 240000, szybki: 240000 }), dodatkowe: string[] = []) => {
    const f = join(d, 'wynik.json'); if (w) writeFileSync(f, JSON.stringify(w));
    const l = join(d, 'limity.jsonl'); if (lim !== null) writeFileSync(l, lim);
    return spawnSync(process.execPath, [SKRYPT, f, '--limity', l, '--root', d, ...dodatkowe], { encoding: 'utf8', env: { ...process.env, JEST_LIMITY_PLIK: '' } });
  };
  const wiersze = (o: Record<string, number | null>, p = 'tests/a.test.ts') => Object.entries(o).map(([t, l]) => wiersz(p, `S ${t}`, l)).join('\n');
  const wolny = (d: string) => wynik(plik(join(d, 'tests/a.test.ts'), przypadek('wolny', 130000), przypadek('szybki', 50)));

  test('test ponad progiem → kod 1, komunikat z nazwą testu, czasem i limitem oraz gotowym wpisem', () => {
    const d = korzen();
    const r = uruchom(d, wolny(d));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('tests/a.test.ts'); expect(r.stderr).toContain('S wolny'); expect(r.stderr).toMatch(/130\.0 s z limitu 240 s/); expect(r.stderr).toMatch(/podziel/);
    expect(r.stderr).toContain('stan bazowy 05.11.2026');
  });
  test('wszystko poniżej progu → kod 0 i linia raportu z liczbą przypadków', () => {
    const d = korzen();
    const r = uruchom(d, wynik(plik(join(d, 'tests/a.test.ts'), przypadek('wolny', 1000), przypadek('szybki', 2000))));
    expect(r.status).toBe(0); expect(r.stdout).toMatch(/kontrola-czasu-testu: 2 przypadków, próg 50% limitu; ponad progiem: 0, z wyjątkiem: 0, zbędne wyjątki: 0, bez znanego limitu: 0/);
  });
  test('wyjątek bazowy → kod 0, wyjątek wypisany z planem', () => {
    const d = korzen({ wyjatki: [{ plik: 'tests/a.test.ts', test: 'S wolny', powod: 'stan bazowy 05.11.2026', data: '05.11.2026', plan: 'podział na języki' }] });
    const r = uruchom(d, wolny(d));
    expect(r.status).toBe(0); expect(r.stdout).toMatch(/wyjątek \(05\.11\.2026\).*podział na języki/);
  });
  test('zapadka: wpis bazowy w progu → kod 1 z listą zbędnych wpisów', () => {
    const d = korzen({ wyjatki: [{ plik: 'tests/a.test.ts', test: 'S szybki', powod: 'stan bazowy 05.11.2026', data: '05.11.2026', plan: 'podział na języki' }] });
    const r = uruchom(d, wynik(plik(join(d, 'tests/a.test.ts'), przypadek('szybki', 100))));
    expect(r.status).toBe(1); expect(r.stderr).toMatch(/już mieści się w progu.*usuń/); expect(r.stderr).toContain('S szybki');
  });
  test('zapadka: nowy przypadek ponad progiem przy istniejącej liście bazowej → kod 1 (lista tylko maleje)', () => {
    const d = korzen({ wyjatki: [{ plik: 'tests/a.test.ts', test: 'S szybki', powod: 'stan bazowy 05.11.2026', data: '05.11.2026', plan: 'podział na języki' }] });
    const r = uruchom(d, wynik(plik(join(d, 'tests/a.test.ts'), przypadek('szybki', 130000), przypadek('wolny', 130000))));
    expect(r.status).toBe(1); expect(r.stderr).toMatch(/1 NOWYCH przypadków/); expect(r.stderr).toContain('S wolny');
  });
  test('brak pliku wyniku → kod 2 i komunikat (nie cichy sukces); wynik bez czasów → kod 2', () => {
    const d = korzen(); const r = uruchom(d, null);
    expect(r.status).toBe(2); expect(r.stderr).toMatch(/brak pliku wyniku Jest.*kontrola NIE przeszła/);
    const r2 = uruchom(d, { success: true, testResults: [] });
    expect(r2.status).toBe(2); expect(r2.stderr).toMatch(/brak czasów/);
  });
  test('brak pliku limitów → kod 2 z komunikatem; przypadek bez limitu → kod 2 z listą', () => {
    const d = korzen();
    const r = uruchom(d, wolny(d), null);
    expect(r.status).toBe(2); expect(r.stderr).toMatch(/brak pliku limitów.*kontrola NIE przeszła/);
    const r2 = uruchom(d, wolny(d), wiersze({ szybki: 240000 }));
    expect(r2.status).toBe(2); expect(r2.stderr).toMatch(/1 przypadków bez znanego limitu/); expect(r2.stderr).toContain('S wolny');
  });
  test('--propozycja: stdout to JSON z gotowymi wpisami bazowymi (plik, test, powód ze stanem bazowym, data, plan), kod 0', () => {
    const d = korzen();
    const r = uruchom(d, wolny(d), undefined, ['--propozycja']);
    expect(r.status).toBe(0);
    const wpisy = JSON.parse(r.stdout);
    expect(wpisy).toHaveLength(1);
    expect(wpisy[0]).toMatchObject({ plik: 'tests/a.test.ts', test: 'S wolny', data: '05.11.2026' });
    expect(wpisy[0].powod).toContain('stan bazowy 05.11.2026'); expect(wpisy[0].plan.length).toBeGreaterThan(10);
  });
  test('uszkodzony JSON → kod 2', () => {
    const d = korzen(); writeFileSync(join(d, 'wynik.json'), '{nie json'); writeFileSync(join(d, 'l.jsonl'), '');
    const r = spawnSync(process.execPath, [SKRYPT, join(d, 'wynik.json'), '--limity', join(d, 'l.jsonl'), '--root', d], { encoding: 'utf8' });
    expect(r.status).toBe(2); expect(r.stderr).toMatch(/nie jest poprawnym JSON/);
  });
  test('L-080 (05.11.2026): gałąź z wcześniejszymi zmianami względem main — kontrola liczy tylko z wyniku przebiegu, nie z różnicy gałęzi; ten sam werdykt na main i na gałęzi', () => {
    const d = korzen();
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

/* Prawdziwy Jest z tests/setup-limity-czasu.js: limit zapisany = limit, którego jest-circus faktycznie użyje. Plik próbny w katalogu poza tests/ (wzór
 * tests/jest-sterta-02-11-2026.test.ts), ignorowany przez git; testMatch w wierszu poleceń tylko dla niego. */
describe('tests/setup-limity-czasu.js: efektywny limit przypadku zapisany w czasie działania (05.11.2026)', () => {
  const KAT = `.jest-limity-tmp-${process.pid}`;
  const uruchomJest = (zrodlo: string, ustaw = true) => {
    mkdirSync(join(ROOT, KAT), { recursive: true });
    const wynikJson = join(ROOT, KAT, 'wynik.json'); const limityPlik = join(ROOT, KAT, 'limity.jsonl');
    try {
      writeFileSync(join(ROOT, KAT, 'p.test.js'), zrodlo);
      const env: NodeJS.ProcessEnv = { ...process.env }; delete env.JEST_LIMITY_PLIK; if (ustaw) env.JEST_LIMITY_PLIK = limityPlik;
      const r = spawnSync(process.execPath, [join(ROOT, 'node_modules/jest/bin/jest.js'), '--testMatch', `<rootDir>/${KAT}/*.test.js`, '--runInBand', '--ci', '--silent', '--json', `--outputFile=${wynikJson}`], { cwd: ROOT, env, encoding: 'utf8' });
      const wiersze = existsSync(limityPlik) ? readFileSync(limityPlik, 'utf8') : null;
      const w = JSON.parse(readFileSync(wynikJson, 'utf8'));
      return { kod: r.status, stderr: r.stderr, wiersze, wynik: w };
    } finally { rmSync(join(ROOT, KAT), { recursive: true, force: true }); }
  };
  const limitDla = (wiersze: string | null, test: string) => { const l = wczytajLimity(wiersze ?? '').limity; return l[`${KAT}/p.test.js\t${test}`]; };

  test('limit domyślny, jawny trzeci argument, test.each z limitem, jest.setTimeout w pliku; nazwy zgodne z fullName wyniku Jest', () => {
    const r = uruchomJest(`
describe('opis', () => {
  test('domyślny', () => {});
  test('jawny', () => {}, 123456);
  test.each([1, 2])('each %i', () => {}, 4321);
  describe('wew', () => { it('zagnieżdżony', () => {}); });
});`);
    expect(r.kod).toBe(0);
    expect(limitDla(r.wiersze, 'opis domyślny')).toBe(5000);
    expect(limitDla(r.wiersze, 'opis jawny')).toBe(123456);
    expect(limitDla(r.wiersze, 'opis each 1')).toBe(4321); expect(limitDla(r.wiersze, 'opis each 2')).toBe(4321);
    expect(limitDla(r.wiersze, 'opis wew zagnieżdżony')).toBe(5000);
    for (const a of r.wynik.testResults[0].assertionResults) expect(limitDla(r.wiersze, a.fullName)).toBeGreaterThan(0);
  });
  test('jest.setTimeout na wierszu głównym pliku (także wywołany w describe) obowiązuje wszystkie przypadki; jawny limit przypadku go wyprzedza', () => {
    const r = uruchomJest(`
jest.setTimeout(240000);
describe('opis', () => { test('a', () => {}); test('b', () => {}, 777); });`);
    expect(limitDla(r.wiersze, 'opis a')).toBe(240000); expect(limitDla(r.wiersze, 'opis b')).toBe(777);
  });
  test('jest.setTimeout w beforeAll nie zmienia limitu circus — zapisany jest limit rzeczywisty (5000), nie liczba z tekstu pliku', () => {
    const r = uruchomJest(`beforeAll(() => { jest.setTimeout(99000); }); test('a', () => {});`);
    expect(limitDla(r.wiersze, 'a')).toBe(5000);
  });
  test('bez JEST_LIMITY_PLIK hak nie jest rejestrowany: żaden plik nie powstaje, testy przechodzą', () => {
    const r = uruchomJest(`test('a', () => {});`, false);
    expect(r.kod).toBe(0); expect(r.wiersze).toBeNull();
  });
  test('jest.setupFilesAfterEnv w package.json wskazuje ten plik; katalog próbny jest ignorowany przez git', () => {
    expect(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).jest.setupFilesAfterEnv).toContain('<rootDir>/tests/setup-limity-czasu.js');
    expect(readFileSync(join(ROOT, '.gitignore'), 'utf8')).toMatch(/^\.jest-limity-tmp-\*\/?$/m);
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
  test('oba kroki dostają tę samą ścieżkę limitów (JEST_LIMITY_PLIK) — zapisuje ją tests/setup-limity-czasu.js, czyta kontrola (05.11.2026)', () => {
    const wystapienia = jest.match(/JEST_LIMITY_PLIK: \$\{\{ runner\.temp \}\}\/jest-limity\.jsonl/g) ?? [];
    expect(wystapienia).toHaveLength(2);
    expect(jest.indexOf('JEST_LIMITY_PLIK')).toBeLessThan(jest.indexOf('node scripts/jest-ponow.mjs'));
    expect(jest.lastIndexOf('JEST_LIMITY_PLIK')).toBeGreaterThan(jest.indexOf('node scripts/jest-ponow.mjs'));
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
