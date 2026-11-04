/* Każde zadanie CI z pełnym Jestem pobiera tagi i pełną historię (lekcja o tests-tz 01.11.2026 w docs/40; rozszerzenie audytu jakości 012).
 * 012 dodało fetch-tags tylko do tests.yml, a test dziennika wydań (tests/audit-m1-050-release-log.test.ts) wymaga tagów w każdym CI (GITHUB_ACTIONS) —
 * tests-tz.yml padł we wszystkich strefach (przebieg 41347715999), a testflight.yml (npm run verify) i nightly.yml padłyby tak samo.
 * Strażnik: zadanie, które uruchamia pełny Jest (npm run verify, npm test, npx jest bez wskazania plików), ma w actions/checkout fetch-depth: 0 i fetch-tags: true. */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = join(__dirname, '..', '.github/workflows');
const PELNY_JEST = /npx jest(?![^\n]*(?:\btests\/|--testMatch))|npm run verify(?![:\w])|npm (?:run )?test(?![:\w])|jest-ponow\.mjs/;

/** Zadania (plik, id) z pełnym Jestem i to, czy ich kasa ma tagi i pełną historię. */
export function zadaniaZJestem(pliki: Record<string, string>): { plik: string; zadanie: string; tagi: boolean }[] {
  const out: { plik: string; zadanie: string; tagi: boolean }[] = [];
  for (const [plik, y] of Object.entries(pliki)) {
    const i = y.search(/^jobs:\s*$/m); if (i < 0) continue;
    const body = y.slice(i).split('\n').slice(1).join('\n');
    for (const p of body.split(/^(?=  [\w-]+:\s*(?:#.*)?$)/m).filter(x => /^  [\w-]+:/.test(x))) {
      if (!PELNY_JEST.test(p.replace(/^\s*#.*$/gm, ''))) continue;
      out.push({ plik, zadanie: p.split('\n')[0].trim().replace(/:.*$/, ''), tagi: /fetch-depth: 0/.test(p) && /fetch-tags: true/.test(p) });
    }
  }
  return out;
}

const PLIKI = Object.fromEntries(readdirSync(dir).filter(f => f.endsWith('.yml')).map(f => [f, readFileSync(join(dir, f), 'utf8')]));

describe('CI: zadania z pełnym Jestem mają tagi (01.11.2026)', () => {
  test('każde zadanie z pełnym Jestem: fetch-depth: 0 i fetch-tags: true', () => {
    const z = zadaniaZJestem(PLIKI);
    expect(z.filter(x => !x.tagi).map(x => `${x.plik}/${x.zadanie}`)).toEqual([]);
  });
  test('wykrywa znane zadania z pełnym Jestem (tests, tests-tz ×2, testflight, nightly); pomija verify:native i pojedyncze pliki', () => {
    const ids = zadaniaZJestem(PLIKI).map(x => `${x.plik}/${x.zadanie}`).sort();
    expect(ids).toEqual(expect.arrayContaining(['nightly.yml/losowe', 'testflight.yml/build', 'tests-tz.yml/jest', 'tests-tz.yml/zmiana-czasu', 'tests.yml/jest']));
    expect(ids.some(i => i.startsWith('ios-unsigned.yml') || i.startsWith('store-screenshots.yml') || i.startsWith('watch-sim.yml'))).toBe(false);
  });
  test('strażnik potrafi paść: zadanie z npx jest bez tagów', () => {
    const y = 'on: push\njobs:\n  a:\n    steps:\n      - uses: actions/checkout@v5\n      - run: npx jest --maxWorkers=2\n  b:\n    steps:\n      - uses: actions/checkout@v5\n        with:\n          fetch-depth: 0\n          fetch-tags: true\n      - run: npm run verify\n  c:\n    steps:\n      - run: npm run verify:native\n';
    expect(zadaniaZJestem({ 'x.yml': y })).toEqual([{ plik: 'x.yml', zadanie: 'a', tagi: false }, { plik: 'x.yml', zadanie: 'b', tagi: true }]);
  });
});
