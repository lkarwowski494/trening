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
  test('poprawny YAML z wyzwalaczem workflow_dispatch (14.10.2026: dwukropek w nazwie kroku unieważnił plik — GitHub: „does not have workflow_dispatch”)', () => {
    const doc = require('js-yaml').load(y); expect(Object.keys(doc.on)).toEqual(['workflow_dispatch']); expect(Object.keys(doc.jobs)).toEqual(['dane', 'build', 'zrzuty', 'ramki', 'zakup']);
  });
  test('build jak w App Store: bez sztucznego sklepu i bez udawanego zegarka (te zmienne ustawia tylko e2e-ios.yml)', () => {
    expect(y).not.toMatch(/EXPO_PUBLIC_(STORE|WATCH)_FAKE/); expect(y).toMatch(/-configuration Release/); expect(y).toMatch(/CODE_SIGNING_ALLOWED=NO/);
  });
  test('rozmiary wymagane przez Apple: 6,9″ (iPhone 17 Pro Max) i wymagany 6,3″ (iPhone 17 Pro); zrzut zakupu tylko na żądanie', () => {
    expect(y).toMatch(/rozmiar: '6\.9'\s+# [^\n]*\n\s+wzorzec: 'iPhone 17 Pro Max \\\('/); expect(y).toMatch(/rozmiar: '6\.3'\s+# [^\n]*\n\s+wzorzec: 'iPhone 17 Pro \\\('/);
    expect(y).toMatch(/inputs\.zrzut_zakupu_z_przebiegu != ''/); expect(y).toMatch(/\[\["zakup","\/paywall","jasny",""\]\]/);
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
  const rows = [...src.matchAll(/\['([a-z-]+)', '(\/[^']*)'(?: \+ \w+)?, '([a-z]+)', '([a-z0-9-]*)'\]/g)].map(m => ({ name: m[1], path: m[2], variant: m[3], action: m[4] }));
  test('scenorys: 9 ekranów w kolejności właściciela (14.10.2026), ekrany istnieją w aplikacji (expo-router)', () => {
    expect(rows.map(r => r.name)).toEqual(['trening', 'postepy-cwiczenia', 'straznik', 'plan', 'dostosuj', 'progresja', 'historia', 'szablony', 'import']);
    const file = (p: string) => {
      const seg = p.replace(/^\//, '').replace(/\?.*$/, '');
      const cands = seg === '' ? ['app/(tabs)/index.tsx'] : [`app/${seg}.tsx`, `app/(tabs)/${seg}.tsx`, `app/${seg.split('/')[0]}/[id].tsx`];
      return cands.some(c => fs.existsSync(path.join(root, c)));
    };
    for (const r of rows) expect([r.path, file(r.path)]).toEqual([r.path, true]);
  });
  test('warianty stanu: 1–2 ekrany w ciemnym motywie; akcje Maestro istnieją w scripts/ci/maestro-sklep', () => {
    expect(new Set(rows.map(r => r.variant))).toEqual(new Set(['trening', 'jasny', 'ciemny', 'adapt']));
    const dark = rows.filter(r => r.variant === 'ciemny').length; expect(dark).toBeGreaterThanOrEqual(1); expect(dark).toBeLessThanOrEqual(2);
    for (const a of rows.map(r => r.action).filter(Boolean)) expect([a, fs.existsSync(path.join(root, 'scripts/ci/maestro-sklep', a + '.yaml'))]).toEqual([a, true]);
    expect(fs.existsSync(path.join(root, 'scripts/ci/maestro-sklep/przygotuj.yaml'))).toBe(true);
    expect(fs.readFileSync(path.join(root, 'components/HistoryCalendar.tsx'), 'utf8')).toContain("testID={delta < 0 ? 'month-prev' : 'month-next'"); /* akcja poprzedni-miesiac */
  });
  test('akcje Maestro poza .maestro/ (to nie scenariusze E2E), bez czyszczenia danych pokazowych', () => {
    for (const f of fs.readdirSync(path.join(root, 'scripts/ci/maestro-sklep'))) {
      const y2 = fs.readFileSync(path.join(root, 'scripts/ci/maestro-sklep', f), 'utf8');
      expect([f, /appId: pl\.lukasz\.trening/.test(y2), /clearState: true/.test(y2)]).toEqual([f, true, false]);
    }
  });
  test('uruchamiane tylko jawnie (poza zwykłym jest) i bez zapisu, gdy nie podano katalogu; zmyślony CSV w formacie importu', () => {
    expect(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).jest.testMatch).toEqual(['<rootDir>/tests/**/*.test.[jt]s?(x)']);
    expect(src).toMatch(/const out = process\.env\.STORE_SEED_OUT; if \(!out\) return;/);
    expect(src).toContain("'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE'");
  });
});

(hasPy ? describe : describe.skip)('scripts/ci/store-screenshots.sh (xcrun i maestro podstawione)', () => {
  test('dla każdego ekranu: zapis stanu wariantu do bazy (koniec przerwy od chwili zrzutu), start, łącze, akcja Maestro, zrzut', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sklep-')); const bin = path.join(tmp, 'bin'); const cont = path.join(tmp, 'container');
    const data = path.join(tmp, 'dane'); const out = path.join(tmp, 'out'); const log = path.join(tmp, 'xcrun.log');
    fs.mkdirSync(bin); fs.mkdirSync(cont); fs.mkdirSync(data);
    fs.writeFileSync(path.join(bin, 'xcrun'), `#!/usr/bin/env bash
echo "$*" >> "${log}"
case "$2" in
  get_app_container) echo "${cont}" ;;
  io) cp "${cont}/Library/SQLite/trening.db" "$5" ;;
esac
`, { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'maestro'), `#!/usr/bin/env bash\necho "maestro $(basename "$4")" >> "${log}"\n`, { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'sleep'), '#!/usr/bin/env bash\nexit 0\n', { mode: 0o755 });
    for (const l of ['pl', 'de']) {
      fs.writeFileSync(path.join(data, `state-${l}-trening.json`), JSON.stringify({ settings: { language: l }, timer: { restEndAt: 1 }, __sklepRestLeft: 95 }));
      fs.writeFileSync(path.join(data, `state-${l}-ciemny.json`), JSON.stringify({ settings: { language: l, theme: 'dark' }, timer: { restEndAt: null } }));
      fs.writeFileSync(path.join(data, `routes-${l}.json`), JSON.stringify([['trening', '/', 'trening', ''], ['historia', '/history', 'ciemny', 'poprzedni-miesiac'], ['import', '/more/import', 'ciemny', 'import']]));
    }
    fs.writeFileSync(path.join(data, 'trening-historia.csv'), 'Date,Workout Name\n');
    const t0 = Date.now();
    const res = execFileSync('bash', [path.join(root, 'scripts/ci/store-screenshots.sh'), 'SIM-1', out, data, 'all'], { env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
    expect(res).toContain('Zrzuty: 6 plików');
    const calls = fs.readFileSync(log, 'utf8').trim().split('\n');
    expect(calls[0]).toMatch(/^simctl status_bar SIM-1 override --time 9:41/); expect(calls[1]).toBe('maestro przygotuj.yaml'); expect(calls[calls.length - 1]).toBe('simctl status_bar SIM-1 clear');
    expect(calls.filter(c => c.startsWith('simctl openurl'))).toEqual(['simctl openurl SIM-1 trening://history', 'simctl openurl SIM-1 trening://more/import', 'simctl openurl SIM-1 trening://history', 'simctl openurl SIM-1 trening://more/import']);
    expect(calls.filter(c => c.startsWith('maestro ') && c !== 'maestro przygotuj.yaml')).toEqual([...Array(2)].flatMap(() => ['maestro dialogi.yaml', 'maestro dialogi.yaml', 'maestro poprzedni-miesiac.yaml', 'maestro dialogi.yaml', 'maestro import.yaml'])); /* okna systemowe zatwierdzane po każdym starcie i łączu */
    expect(calls.filter(c => c.startsWith('simctl launch'))).toHaveLength(6); /* świeży start na każdy ekran */
    expect(fs.existsSync(path.join(cont, 'Documents', 'trening-historia.csv'))).toBe(true);
    const read = (f: string) => JSON.parse(execFileSync('python3', ['-I', '-c', 'import sqlite3,sys;print(sqlite3.connect(sys.argv[1]).execute("select v from kv where k=?",("state",)).fetchone()[0])', f], { encoding: 'utf8' }));
    for (const l of ['de', 'pl']) {
      expect(fs.readdirSync(path.join(out, l)).sort()).toEqual(['01-trening.png', '02-historia.png', '03-import.png']);
      const tr = read(path.join(out, l, '01-trening.png')); expect(tr.settings.language).toBe(l); expect(tr.__sklepRestLeft).toBeUndefined();
      expect(tr.timer.restEndAt).toBeGreaterThanOrEqual(t0 + 95e3); expect(tr.timer.restEndAt).toBeLessThan(Date.now() + 96e3);
      expect(read(path.join(out, l, '02-historia.png')).settings.theme).toBe('dark');
    }
    expect(fs.existsSync(path.join(out, '.state.json'))).toBe(false);
  });
  test('język bez danych jest pomijany z ostrzeżeniem (bez przerwania pozostałych)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sklep-')); const bin = path.join(tmp, 'bin'); fs.mkdirSync(bin); fs.mkdirSync(path.join(tmp, 'dane'));
    fs.writeFileSync(path.join(bin, 'xcrun'), '#!/usr/bin/env bash\nexit 0\n', { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'maestro'), '#!/usr/bin/env bash\nexit 0\n', { mode: 0o755 });
    const res = execFileSync('bash', [path.join(root, 'scripts/ci/store-screenshots.sh'), 'SIM-1', path.join(tmp, 'out'), path.join(tmp, 'dane'), 'fi'], { env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
    expect(res).toContain('::warning::Brak danych dla języka fi'); expect(res).toContain('Zrzuty: 0 plików');
  });
});
