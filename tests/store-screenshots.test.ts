/* Zrzuty do App Store (docs/41-droga-do-app-store.md, 14.10.2026): workflow store-screenshots.yml, skrypt scripts/ci/store-screenshots.sh
 * i dane pokazowe scripts/screens/store-seed.test.ts. Na Linuksie bez Xcode: `xcrun` podstawiony skryptem, który zapisuje wywołania. */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const root = path.join(__dirname, '..');
const y = fs.readFileSync(path.join(root, '.github/workflows/store-screenshots.yml'), 'utf8');
const hasPy = (() => { try { execFileSync('python3', ['-c', 'import sqlite3']); return true; } catch { return false; } })();

describe('store-screenshots.yml', () => {
  test('tylko ręcznie, odczyt treści, bez sekretów poza tokenem przebiegu, wejścia tylko przez zmienne środowiskowe', () => {
    expect(y).toMatch(/\non:\n  workflow_dispatch:\n    inputs:\n/);
    expect(y).not.toMatch(/^\s+(push|schedule|pull_request(_target)?|workflow_call):/m);
    expect(y).toMatch(/\npermissions:\n  contents: read\n  actions: read\n/); expect(y).not.toMatch(/: write/);
    for (const m of y.match(/secrets\.[A-Z_0-9]+/g) || []) expect(m).toBe('secrets.GITHUB_TOKEN');
    expect(y).not.toMatch(/run:[^\n]*\$\{\{/); /* ani inputs, ani matrix w poleceniach powłoki */
  });
  test('build jak w App Store: bez sztucznego sklepu i bez udawanego zegarka (te zmienne ustawia tylko e2e-ios.yml)', () => {
    expect(y).not.toMatch(/EXPO_PUBLIC_(STORE|WATCH)_FAKE/); expect(y).toMatch(/-configuration Release/); expect(y).toMatch(/CODE_SIGNING_ALLOWED=NO/);
  });
  test('rozmiary wymagane przez Apple: 6,9″ (iPhone 17 Pro Max) i wymagany 6,3″ (iPhone 17 Pro); zrzut zakupu tylko na żądanie', () => {
    expect(y).toMatch(/rozmiar: '6\.9'\s+# [^\n]*\n\s+wzorzec: 'iPhone 17 Pro Max \\\('/); expect(y).toMatch(/rozmiar: '6\.3'\s+# [^\n]*\n\s+wzorzec: 'iPhone 17 Pro \\\('/);
    expect(y).toMatch(/inputs\.zrzut_zakupu_z_przebiegu != ''/); expect(y).toMatch(/\[\["zakup","\/paywall"\]\]/);
    expect(y).toMatch(/bash scripts\/ci\/store-screenshots\.sh "\$SIM" "sklep-zrzuty\/\$ROZMIAR" sklep-dane "\$JEZYKI"/);
    expect(y).toMatch(/--testMatch "\*\*\/scripts\/screens\/store-seed\.test\.ts"/);
  });
  test('artefakty publiczne najwyżej 3 dni', () => {
    const uploads = y.split('actions/upload-artifact@v4').length - 1; expect(uploads).toBeGreaterThan(0);
    expect((y.match(/retention-days: 3\n/g) || []).length).toBe(uploads);
  });
});

describe('dane pokazowe (scripts/screens/store-seed.test.ts)', () => {
  const src = fs.readFileSync(path.join(root, 'scripts/screens/store-seed.test.ts'), 'utf8');
  test('ekrany istnieją w aplikacji (expo-router) i jest ich najwyżej 10 (limit App Store na rozmiar)', () => {
    const paths = [...src.matchAll(/\['[a-z-]+', '(\/[^'?]*)/g)].map(m => m[1]);
    expect(paths.length).toBeGreaterThan(4); expect(paths.length).toBeLessThanOrEqual(10);
    const file = (p: string) => {
      const seg = p.replace(/^\//, '');
      const cands = seg === '' ? ['app/(tabs)/index.tsx'] : [`app/${seg}.tsx`, `app/(tabs)/${seg}.tsx`, `app/${seg.split('/')[0]}/[id].tsx`];
      return cands.some(c => fs.existsSync(path.join(root, c)));
    };
    for (const p of paths) expect([p, file(p)]).toEqual([p, true]);
  });
  test('uruchamiane tylko jawnie (poza zwykłym jest) i bez zapisu, gdy nie podano katalogu', () => {
    expect(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).jest.testMatch).toEqual(['<rootDir>/tests/**/*.test.[jt]s?(x)']);
    expect(src).toMatch(/const out = process\.env\.STORE_SEED_OUT; if \(!out\) return;/);
  });
});

(hasPy ? describe : describe.skip)('scripts/ci/store-screenshots.sh (xcrun podstawiony)', () => {
  test('zapisuje dane do bazy aplikacji, otwiera ekrany łączem i robi zrzut każdego ekranu w każdym języku', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sklep-')); const bin = path.join(tmp, 'bin'); const cont = path.join(tmp, 'container');
    const data = path.join(tmp, 'dane'); const out = path.join(tmp, 'out'); const log = path.join(tmp, 'xcrun.log');
    fs.mkdirSync(bin); fs.mkdirSync(cont); fs.mkdirSync(data);
    /* atrapa xcrun: zapis wywołań; get_app_container zwraca katalog danych; screenshot tworzy plik (kopiuje bazę, żeby sprawdzić jej stan w chwili zrzutu) */
    fs.writeFileSync(path.join(bin, 'xcrun'), `#!/usr/bin/env bash
echo "$*" >> "${log}"
case "$2" in
  get_app_container) echo "${cont}" ;;
  io) cp "${cont}/Library/SQLite/trening.db" "$5" ;;
esac
`, { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'sleep'), '#!/usr/bin/env bash\nexit 0\n', { mode: 0o755 });
    for (const l of ['pl', 'de']) {
      fs.writeFileSync(path.join(data, `state-${l}.json`), JSON.stringify({ settings: { language: l } }));
      fs.writeFileSync(path.join(data, `routes-${l}.json`), JSON.stringify([['trening', '/'], ['postepy', '/progress?ex=abc']]));
    }
    const res = execFileSync('bash', [path.join(root, 'scripts/ci/store-screenshots.sh'), 'SIM-1', out, data, 'all'], { env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
    expect(res).toContain('Zrzuty: 4 plików');
    const calls = fs.readFileSync(log, 'utf8').trim().split('\n');
    expect(calls.filter(c => c.startsWith('simctl openurl'))).toEqual(['simctl openurl SIM-1 trening://', 'simctl openurl SIM-1 trening://progress?ex=abc', 'simctl openurl SIM-1 trening://', 'simctl openurl SIM-1 trening://progress?ex=abc']);
    expect(calls.filter(c => c.startsWith('simctl launch'))).toHaveLength(2);
    expect(calls[0]).toMatch(/^simctl status_bar SIM-1 override --time 9:41/); expect(calls[calls.length - 1]).toBe('simctl status_bar SIM-1 clear');
    /* przed każdym startem aplikacja jest zatrzymana, a baza zapisana od nowa */
    expect(calls.findIndex(c => c.startsWith('simctl terminate'))).toBeLessThan(calls.findIndex(c => c.startsWith('simctl launch')));
    for (const l of ['de', 'pl']) {
      expect(fs.readdirSync(path.join(out, l)).sort()).toEqual(['01-trening.png', '02-postepy.png']);
      const v = execFileSync('python3', ['-I', '-c', 'import sqlite3,sys;print(sqlite3.connect(sys.argv[1]).execute("select v from kv where k=?",("state",)).fetchone()[0])', path.join(out, l, '01-trening.png')], { encoding: 'utf8' });
      expect(JSON.parse(v).settings.language).toBe(l);
    }
  });
  test('język bez danych jest pomijany z ostrzeżeniem (bez przerwania pozostałych)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sklep-')); const bin = path.join(tmp, 'bin'); fs.mkdirSync(bin); fs.mkdirSync(path.join(tmp, 'dane'));
    fs.writeFileSync(path.join(bin, 'xcrun'), '#!/usr/bin/env bash\nexit 0\n', { mode: 0o755 });
    const res = execFileSync('bash', [path.join(root, 'scripts/ci/store-screenshots.sh'), 'SIM-1', path.join(tmp, 'out'), path.join(tmp, 'dane'), 'fi'], { env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
    expect(res).toContain('::warning::Brak danych dla języka fi'); expect(res).toContain('Zrzuty: 0 plików');
  });
});
