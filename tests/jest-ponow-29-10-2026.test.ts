/*
 * Decyzja właściciela 29.10.2026: verify ponawia tylko pliki Jest przerwane z zewnątrz (scripts/jest-ponow.mjs; lekcja w docs/40 o SIGTERM workerów).
 * Rodzaje (docs/20): logika (rozpoznanie przerwania), scenariusz (sztuczny uruchamiacz Jest zamiast prawdziwego), niezmiennik (verify woła skrypt).
 * Prawdziwy Jest nie jest uruchamiany: wynik JSON podstawia sztuczny uruchamiacz (JEST_PONOW_JEST).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SKRYPT = path.join(ROOT, 'scripts/jest-ponow.mjs');

const SIGTERM = 'Test suite failed to run\n\n  A jest worker process (pid=123) was terminated by another process: signal=SIGTERM, exitCode=null. Operation: ...';
const SIGKILL = SIGTERM.replace('SIGTERM', 'SIGKILL');
const przerwany = (name: string, msg = SIGTERM) => ({ name, status: 'failed', message: msg, assertionResults: [] });
const zielony = (name: string) => ({ name, status: 'passed', message: '', assertionResults: [{ status: 'passed' }] });
const asercja = (name: string) => ({ name, status: 'failed', message: '● t\n\n  expect(received).toBe(expected)', assertionResults: [{ status: 'failed' }] });
const wynik = (...testResults: { status: string }[]) => ({ success: testResults.every(t => t.status === 'passed'), testResults });

/** Sztuczny Jest: n-te wywołanie zapisuje scenariusz[n] do --outputFile i kończy się kodem 0/1 wg success; argumenty wywołań idą do dziennika. */
const FAKE = `
const fs = require('fs');
const dir = process.env.FAKE_DIR; const n = fs.readdirSync(dir).filter(f => f.startsWith('call-')).length;
fs.writeFileSync(dir + '/call-' + n + '.json', JSON.stringify(process.argv.slice(2)));
const sc = JSON.parse(fs.readFileSync(dir + '/scenariusz.json', 'utf8'));
const out = process.argv.find(a => a.startsWith('--outputFile=')).slice(13);
const w = sc[n];
fs.writeFileSync(out, JSON.stringify(w));
process.exit(w.success ? 0 : 1);
`;

function uruchom(...przebiegi: object[]) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-ponow-test-'));
  fs.writeFileSync(path.join(dir, 'fake.js'), FAKE);
  fs.writeFileSync(path.join(dir, 'scenariusz.json'), JSON.stringify(przebiegi));
  try {
    const r = spawnSync(process.execPath, [SKRYPT, '--maxWorkers=2'], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, JEST_PONOW_JEST: path.join(dir, 'fake.js'), FAKE_DIR: dir } });
    const wywolania = fs.readdirSync(dir).filter(f => f.startsWith('call-')).sort().map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as string[]);
    return { kod: r.status, log: r.stderr, wywolania };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

describe('scripts/jest-ponow.mjs — ponawia tylko przerwania z zewnątrz (decyzja 29.10.2026)', () => {
  test('(a) jeden plik przerwany SIGTERM, ponowienie zielone → kod 0; ponowiony tylko ten plik, osobno (--runInBand), w logu nazwa i powód', () => {
    const r = uruchom(wynik(zielony('/a.test.ts'), przerwany('/b.test.ts')), wynik(zielony('/b.test.ts')));
    expect(r.kod).toBe(0);
    expect(r.wywolania).toHaveLength(2);
    expect(r.wywolania[0]).toContain('--maxWorkers=2'); /* pierwszy przebieg zachowuje argumenty */
    expect(r.wywolania[1]).toEqual(expect.arrayContaining(['--runInBand', '--runTestsByPath', '/b.test.ts']));
    expect(r.wywolania[1]).not.toContain('/a.test.ts');
    expect(r.log).toMatch(/ponawiam TYLKO je/);
    expect(r.log).toContain('/b.test.ts');
    expect(r.log).toMatch(/SIGTERM/);
  });
  test('(a2) SIGKILL z tym samym komunikatem „terminated by another process” też jest przerwaniem', () => {
    const r = uruchom(wynik(przerwany('/b.test.ts', SIGKILL)), wynik(zielony('/b.test.ts')));
    expect(r.kod).toBe(0);
    expect(r.wywolania).toHaveLength(2);
  });
  test('(b) przerwanie, a ponowienie czerwone → kod 1 (jedno ponowienie, bez trzeciego)', () => {
    const r = uruchom(wynik(przerwany('/b.test.ts')), wynik(asercja('/b.test.ts')));
    expect(r.kod).toBe(1);
    expect(r.wywolania).toHaveLength(2);
    expect(r.log).toMatch(/ponowienie czerwone/);
  });
  test('(b2) ponowienie znowu przerwane → kod 1', () => {
    const r = uruchom(wynik(przerwany('/b.test.ts')), wynik(przerwany('/b.test.ts')));
    expect([r.kod, r.wywolania.length]).toEqual([1, 2]);
  });
  test('(c) zwykła porażka asercji → kod 1 bez ponawiania', () => {
    const r = uruchom(wynik(zielony('/a.test.ts'), asercja('/b.test.ts')));
    expect(r.kod).toBe(1);
    expect(r.wywolania).toHaveLength(1);
    expect(r.log).not.toMatch(/ponawiam/);
  });
  test('(c2) timeout, błąd kompilacji i przerwanie innym sygnałem nie są ponawiane', () => {
    const kompilacja = { name: '/k.test.ts', status: 'failed', message: 'Test suite failed to run\n\n  SyntaxError: Unexpected token', assertionResults: [] };
    const sigsegv = przerwany('/s.test.ts', SIGTERM.replace('SIGTERM', 'SIGSEGV'));
    const timeout = { name: '/t.test.ts', status: 'failed', message: 'thrown: "Exceeded timeout of 5000 ms for a test."', assertionResults: [{ status: 'failed' }] };
    for (const zly of [kompilacja, sigsegv, timeout]) {
      const r = uruchom(wynik(zly));
      expect([zly.name, r.kod, r.wywolania.length]).toEqual([zly.name, 1, 1]);
    }
  });
  test('(c3) plik z asercją nieudaną i komunikatem o zabitym workerze (są nieudane asercje) nie jest przerwaniem', () => {
    const mieszany = { name: '/m.test.ts', status: 'failed', message: SIGTERM, assertionResults: [{ status: 'failed' }] };
    expect(uruchom(wynik(mieszany)).kod).toBe(1);
  });
  test('(d) mieszane: przerwanie i porażka asercji → kod 1 bez ponawiania (nie maskujemy prawdziwej porażki)', () => {
    const r = uruchom(wynik(przerwany('/b.test.ts'), asercja('/c.test.ts')), wynik(zielony('/b.test.ts')));
    expect(r.kod).toBe(1);
    expect(r.wywolania).toHaveLength(1);
  });
  test('(e) brak porażek → kod 0, jeden przebieg', () => {
    const r = uruchom(wynik(zielony('/a.test.ts'), zielony('/b.test.ts')));
    expect([r.kod, r.wywolania.length]).toEqual([0, 1]);
  });
  test('przebieg nieudany bez żadnego nieudanego pliku (przyczyna nieznana) → kod 1 bez ponawiania', () => {
    const r = uruchom({ success: false, testResults: [zielony('/a.test.ts')] });
    expect([r.kod, r.wywolania.length]).toEqual([1, 1]);
  });
  test('wiele przerwanych plików: ponawiane razem w jednym przebiegu osobnym', () => {
    const r = uruchom(wynik(przerwany('/b.test.ts'), przerwany('/c.test.ts')), wynik(zielony('/b.test.ts'), zielony('/c.test.ts')));
    expect(r.kod).toBe(0);
    expect(r.wywolania[1]).toEqual(expect.arrayContaining(['/b.test.ts', '/c.test.ts']));
  });
});

describe('verify woła scripts/jest-ponow.mjs zamiast gołego jest (29.10.2026)', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  test('krok Jest w verify to skrypt ponawiający, bez gołego `jest` w łańcuchu', () => {
    expect(pkg.scripts.verify).toContain('node scripts/jest-ponow.mjs');
    expect(pkg.scripts.verify.split(' && ')).not.toContain('jest');
  });
});
