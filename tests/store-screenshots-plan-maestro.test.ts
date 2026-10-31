/*
 * Zrzuty do App Store (101-24, 29.10.2026): plan uruchomień Maestro. Dotąd na ekran przypadały 2–3 uruchomienia (dialogi, akcja, dialogi), każde z własnym startem
 * sterownika XCTest (L-054: 2,7–3,5 min na ekran). Teraz jedno uruchomienie na ekran, z tymi samymi plikami akcji w jednym przepływie. Test uruchamia prawdziwy
 * scripts/ci/store-screenshots.sh na atrapach xcrun, maestro i sleep (bez macOS) i liczy wywołania Maestro.
 */
import { execFileSync } from 'child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const root = join(__dirname, '..');
const tmp: string[] = [];
afterAll(() => tmp.forEach(d => rmSync(d, { recursive: true, force: true })));

/** Liczba wywołań Maestro PRZED zmianą: przygotuj (1) + na ekran dialogi + [akcja] + dialogi. */
const PRZED = (ekrany: number, zAkcja: number) => 1 + 2 * ekrany + zAkcja;
/** PO zmianie: przygotuj (1) + jedno na ekran. */
const PO = (ekrany: number) => 1 + ekrany;

function run(routes: string[][], langs: string[]) {
  const d = mkdtempSync(join(tmpdir(), 'zrp-')); tmp.push(d);
  const bin = join(d, 'bin'); const data = join(d, 'data'); const app = join(d, 'app'); const out = join(d, 'out'); mkdirSync(bin); mkdirSync(data); mkdirSync(app);
  const stub = (n: string, body: string) => { writeFileSync(join(bin, n), `#!/bin/bash\n${body}\n`); chmodSync(join(bin, n), 0o755); };
  stub('sleep', 'exit 0');
  stub('xcrun', `case "$2" in get_app_container) echo "${app}";; io) [ "$4" = screenshot ] && touch "$5"; exit 0;; esac; exit 0`);
  stub('maestro', `echo "WYWOLANIE $4" >> "${d}/calls"; cat "$4" >> "${d}/flows"; echo "---" >> "${d}/flows"; exit 0`);
  for (const l of langs) {
    writeFileSync(join(data, `routes-${l}.json`), JSON.stringify(routes));
    writeFileSync(join(data, `state-${l}-jasny.json`), '{}');
  }
  writeFileSync(join(data, 'trening-historia.csv'), 'a');
  execFileSync('bash', [join(root, 'scripts/ci/store-screenshots.sh'), 'UDID', out, data, langs.join(',')], {
    encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
  });
  const calls = readFileSync(join(d, 'calls'), 'utf8').trim().split('\n');
  return { out, calls, flows: readFileSync(join(d, 'flows'), 'utf8') };
}

describe('store-screenshots.sh: plan uruchomień Maestro (101-24)', () => {
  const routes = [['plan', '/plan', 'jasny', ''], ['import', '/more/import', 'jasny', 'import'], ['wykres', '/progress', 'jasny', 'e1rm']];
  test('jeden język, 3 ekrany (2 z akcją): 4 uruchomienia zamiast 9', () => {
    const r = run(routes, ['pl']);
    expect(PRZED(3, 2)).toBe(9);
    expect(r.calls).toHaveLength(PO(3));
  });
  test('dwa języki: uruchomień tyle co ekranów + 1 (przygotuj raz na przebieg)', () => {
    const r = run(routes, ['pl', 'en']);
    expect(r.calls).toHaveLength(PO(6));
    expect(r.calls.length).toBeLessThan(PRZED(6, 4));
  });
  test('przepływ ekranu: dialogi, akcja, dialogi — te same pliki co dotąd, w tej kolejności', () => {
    const r = run([['import', '/more/import', 'jasny', 'import']], ['pl']);
    const ekran = r.flows.slice(r.flows.lastIndexOf('appId'));
    const kolejnosc = [...ekran.matchAll(/runFlow: .*\/([a-z0-9-]+)\.yaml/g)].map(m => m[1]);
    expect(kolejnosc).toEqual(['dialogi', 'import', 'dialogi']);
  });
  test('ekran bez akcji: dialogi dwa razy, bez pliku akcji', () => {
    const r = run([['plan', '/plan', 'jasny', '']], ['pl']);
    const ekran = r.flows.slice(r.flows.lastIndexOf('appId'));
    expect([...ekran.matchAll(/runFlow: .*\/([a-z0-9-]+)\.yaml/g)].map(m => m[1])).toEqual(['dialogi', 'dialogi']);
  });
  test('zrzuty te same: plik na ekran w katalogu języka', () => {
    const r = run(routes, ['pl']);
    for (const f of ['01-plan', '02-import', '03-wykres']) expect(existsSync(join(r.out, `pl/${f}.png`))).toBe(true);
  });
});
