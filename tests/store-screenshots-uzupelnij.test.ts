/*
 * Zrzuty do App Store: uzupełnianie z poprzedniego przebiegu (decyzja właściciela 29.10.2026, wariant A). Przebieg 40861500739 dał dobre zrzuty w 17 językach bez 08-historia i 10-import
 * (w .nieudane); nocny przebieg robi TYLKO brakujące ekrany, a wynik zadania jest kompletem dla jego języków (ramki i asc-zrzuty biorą jeden przebieg).
 * Logika pomijania jest w scripts/ci/store-screenshots.sh (zmienna UZUPELNIJ), nie w YAML; podział zadań liczy tylko brakujące ekrany (scripts/ci/store-shards.mjs).
 */
import { execFileSync } from 'child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const root = join(__dirname, '..');
const wf = readFileSync(join(root, '.github/workflows/store-screenshots.yml'), 'utf8');
const tmp: string[] = [];
afterAll(() => tmp.forEach(d => rmSync(d, { recursive: true, force: true })));
const put = (p: string, c: string) => { mkdirSync(join(p, '..'), { recursive: true }); writeFileSync(p, c); };

/** Skrypt na atrapach (xcrun zapisuje w pliku zrzutu napis NOWY, maestro liczy uruchomienia akcji); `prev` = pliki poprzedniego przebiegu względem katalogu uzupełnienia. */
function run(prev: Record<string, string> | null, langs = 'pl', ekrany = '') {
  const d = mkdtempSync(join(tmpdir(), 'uz-')); tmp.push(d);
  const bin = join(d, 'bin'); const data = join(d, 'data'); const app = join(d, 'app'); const out = join(d, 'out'); const uz = join(d, 'uz');
  mkdirSync(bin); mkdirSync(data); mkdirSync(app); mkdirSync(uz);
  const stub = (n: string, body: string) => { writeFileSync(join(bin, n), `#!/bin/bash\n${body}\n`); chmodSync(join(bin, n), 0o755); };
  stub('sleep', 'exit 0');
  stub('xcrun', `case "$2" in get_app_container) echo "${app}";; io) [ "$4" = screenshot ] && echo NOWY > "$5"; exit 0;; esac; exit 0`);
  stub('maestro', `echo "$4" >> "${d}/akcje"; exit 0`);
  for (const l of ['pl', 'de']) {
    writeFileSync(join(data, `routes-${l}.json`), JSON.stringify([['plan', '/plan', 'jasny', ''], ['import', '/more/import', 'jasny', 'import'], ['historia', '/history', 'jasny', '']]));
    writeFileSync(join(data, `state-${l}-jasny.json`), '{}');
  }
  writeFileSync(join(data, 'trening-historia.csv'), 'a');
  for (const [f, c] of Object.entries(prev ?? {})) put(join(uz, f), c);
  const summary = join(d, 'summary.md');
  const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${bin}:${process.env.PATH}`, GITHUB_STEP_SUMMARY: summary, EKRANY: ekrany };
  if (prev) env.UZUPELNIJ = uz; else delete env.UZUPELNIJ;
  const log = execFileSync('bash', [join(root, 'scripts/ci/store-screenshots.sh'), 'UDID', out, data, langs], { encoding: 'utf8', env });
  const akcje = existsSync(join(d, 'akcje')) ? readFileSync(join(d, 'akcje'), 'utf8') : '';
  return { out, log, akcje, summary: existsSync(summary) ? readFileSync(summary, 'utf8') : '', read: (f: string) => readFileSync(join(out, f), 'utf8').trim() };
}

describe('store-screenshots.sh: UZUPELNIJ — tylko brakujące ekrany', () => {
  test('ekran z gotowym plikiem jest skopiowany z poprzedniego przebiegu i nie jest robiony od nowa; brakujące są robione', () => {
    const r = run({ 'pl/01-plan.png': 'STARY', 'pl/03-historia.png': 'STARY3' });
    expect(r.read('pl/01-plan.png')).toBe('STARY'); expect(r.read('pl/03-historia.png')).toBe('STARY3');
    expect(r.read('pl/02-import.png')).toBe('NOWY');
    expect(r.akcje.match(/import\.yaml/g)).toHaveLength(1); /* akcja tylko dla brakującego ekranu importu */
    expect(r.log).toMatch(/Pomiar: \d+ s na ekran \(1 ekranów/); /* pomiar liczy tylko zrobione ekrany */
    expect(r.log).toMatch(/Uzupełnienie: 2 ekranów z poprzedniego przebiegu/);
  });
  test('komplet w poprzednim przebiegu: nic nie jest robione, wynik zadania = komplet (bez uruchamiania Maestro i zrzutów)', () => {
    const r = run({ 'pl/01-plan.png': 'A', 'pl/02-import.png': 'B', 'pl/03-historia.png': 'C' });
    expect(['pl/01-plan.png', 'pl/02-import.png', 'pl/03-historia.png'].map(f => r.read(f))).toEqual(['A', 'B', 'C']);
    expect(r.akcje).not.toMatch(/import\.yaml/); expect(r.log).not.toMatch(/Pomiar:/);
  });
  test('pliki z .nieudane poprzedniego przebiegu nie są brane jako gotowe — ekran jest robiony od nowa', () => {
    const r = run({ 'pl/01-plan.png': 'STARY', '.nieudane/pl/02-import.png': 'ZLY', '.nieudane/pl/03-historia.png': 'ZLY' });
    expect(r.read('pl/02-import.png')).toBe('NOWY'); expect(r.read('pl/03-historia.png')).toBe('NOWY'); expect(r.read('pl/01-plan.png')).toBe('STARY');
    expect(existsSync(join(r.out, '.nieudane'))).toBe(false);
  });
  test('pusty plik z poprzedniego przebiegu nie jest gotowy; pliki innych języków nie są kopiowane do wyniku', () => {
    const r = run({ 'pl/01-plan.png': '', 'de/01-plan.png': 'DE' }, 'pl');
    expect(r.read('pl/01-plan.png')).toBe('NOWY'); expect(existsSync(join(r.out, 'de'))).toBe(false);
  });
  test('bez UZUPELNIJ: wszystko robione jak dotąd', () => {
    const r = run(null);
    expect(['pl/01-plan.png', 'pl/02-import.png', 'pl/03-historia.png'].map(f => r.read(f))).toEqual(['NOWY', 'NOWY', 'NOWY']); expect(r.log).not.toMatch(/Uzupełnienie/);
  });
  test('EKRANY razem z UZUPELNIJ: filtr działa jak dotąd (tylko wskazane ekrany), gotowy wskazany ekran jest kopiowany, brakujący robiony', () => {
    const r = run({ 'pl/01-plan.png': 'STARY' }, 'pl', 'plan,import');
    expect(r.read('pl/01-plan.png')).toBe('STARY'); expect(r.read('pl/02-import.png')).toBe('NOWY'); expect(existsSync(join(r.out, 'pl/03-historia.png'))).toBe(false);
  });
});

describe('store-shards.mjs: podział według brakujących ekranów', () => {
  const esm = (expr: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import * as M from ${JSON.stringify(join(root, 'scripts/ci/store-shards.mjs'))}; console.log(JSON.stringify(${expr}))`], { encoding: 'utf8' }));
  test('bez wag: podział jak dotąd; z wagami: zrównoważony według brakujących ekranów, każdy język dokładnie raz (także z zerem brakujących)', () => {
    const w: Record<string, number> = { a: 10, b: 10, c: 0, d: 0, e: 0, f: 1 };
    const m = esm(`M.plan('a,b,c,d,e,f', '6.9', 2, 'x', undefined, (r, l) => (${JSON.stringify(w)})[l])`);
    const sh: string[][] = m.include.map((j: { jezyki: string }) => j.jezyki.split(','));
    expect(sh.flat().sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    const load = sh.map(s => s.reduce((n, l) => n + w[l], 0)); expect(Math.abs(load[0] - load[1])).toBeLessThanOrEqual(1);
    expect(esm("M.plan('a,b,c,d', '6.9', 2, 'x').include.map(j => j.jezyki)")).toEqual(['a,b', 'c,d']);
  });
  test('wagi z katalogu: liczba ekranów w routes minus gotowe pliki PNG poprzedniego przebiegu (.nieudane się nie liczy)', () => {
    const d = mkdtempSync(join(tmpdir(), 'sh-')); tmp.push(d);
    writeFileSync(join(d, 'routes-pl.json'), JSON.stringify([['a', '/', 'x', ''], ['b', '/', 'x', ''], ['c', '/', 'x', '']]));
    put(join(d, 'uz/6.9/pl/01-a.png'), 'x'); put(join(d, 'uz/6.9/.nieudane/pl/02-b.png'), 'x');
    expect(esm(`M.missingScreens(${JSON.stringify(d)}, ${JSON.stringify(join(d, 'uz'))}, '6.9', 'pl')`)).toBe(2);
    expect(esm(`M.missingScreens(${JSON.stringify(d)}, ${JSON.stringify(join(d, 'uz'))}, '6.9', 'de')`)).toBe(0); /* brak danych języka — nic do zrobienia */
  });
});

describe('store-screenshots.yml: wejście uzupelnij_z_przebiegu', () => {
  test('wejście istnieje, domyślnie puste (jak dotąd)', () => {
    expect(wf).toMatch(/uzupelnij_z_przebiegu:[\s\S]*?default: ''/);
  });
  test('pobranie artefaktów zrzutów z tamtego przebiegu tylko gdy wejście niepuste (zadania „zrzuty” i „dane”), przez run-id i token domyślny', () => {
    const steps = wf.split(/\n(?=      - )/).filter(s => /name: Poprzednie zrzuty do uzupełnienia/.test(s));
    expect(steps.length).toBeGreaterThanOrEqual(2);
    for (const s of steps) {
      expect(s).toMatch(/if: inputs\.uzupelnij_z_przebiegu != ''/); expect(s).toMatch(/run-id: \$\{\{ inputs\.uzupelnij_z_przebiegu \}\}/);
      expect(s).toMatch(/github-token: \$\{\{ secrets\.GITHUB_TOKEN \}\}/); expect(s).toMatch(/pattern: sklep-zrzuty-\[0-9\]\*/); expect(s).toMatch(/merge-multiple: true/);
    }
    expect(wf).toMatch(/UZUPELNIJ: \$\{\{ inputs\.uzupelnij_z_przebiegu != ''/);
  });
  test('brak nowych uprawnień i sekretów: tylko contents: read i actions: read, jedyny sekret to GITHUB_TOKEN', () => {
    expect(/\npermissions:\n  contents: read\n  actions: read\n(?=concurrency:)/.test(wf)).toBe(true);
    expect([...wf.matchAll(/secrets\.(\w+)/g)].map(m => m[1]).every(n => n === 'GITHUB_TOKEN')).toBe(true);
    expect(wf).not.toMatch(/\n\s+(contents|actions|id-token|packages|pull-requests): write/);
  });
  test('ramki dalej biorą artefakty z bieżącego przebiegu (bez run-id)', () => {
    expect(wf).toMatch(/name: Podpisy i ramki|pattern: sklep-zrzuty-\*\n\s+path: sklep-zrzuty\n\s+merge-multiple: true/);
    const ramki = wf.slice(wf.indexOf('\n  ramki:'), wf.indexOf('\n  zakup:'));
    expect(ramki).not.toMatch(/run-id/);
  });
  test('podział zadań dostaje katalog poprzednich zrzutów tylko przy wejściu', () => {
    expect(wf).toMatch(/store-shards\.mjs "\$JEZYKI" "\$ROZMIARY" "\$ZADAN" sklep-dane "\$\{UZUPELNIJ_KATALOG:-\}"/); expect(wf).toMatch(/UZUPELNIJ_KATALOG: \$\{\{ inputs\.uzupelnij_z_przebiegu != '' && /);
  });
});
