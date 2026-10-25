/* Decyzja właściciela 25.10.2026 (docs/18, docs/40): (A) tests-tz.yml — przebieg z zegarem przypiętym do nocy zmiany czasu; (B) nightly.yml — mutacje
 * w macierzy po modułach (całość w jednym zadaniu liczyła ok. 27 h przy limicie 5 h) i jedno podsumowanie. Testy pliku workflowu nie zastępują przebiegu dowodowego (L-001). */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const tz = read('.github/workflows/tests-tz.yml'); const nightly = read('.github/workflows/nightly.yml');

describe('tests-tz.yml — zadanie „zmiana-czasu” (A)', () => {
  const job = tz.slice(tz.indexOf('  zmiana-czasu:'));
  test('zadanie istnieje, biegnie na ubuntu-latest, bez sekretów, z PIN_NOW i TZ z jednej pozycji macierzy', () => {
    expect(job).not.toBe(''); expect(job).toMatch(/runs-on:\s*ubuntu-latest/); expect(tz).not.toMatch(/secrets\./);
    expect(job).toMatch(/PIN_NOW="\$\{STREFA_CHWILA##\*\|\}"/); expect(job).toMatch(/TZ="\$\{STREFA_CHWILA%%\|\*\}"/); expect(job).toMatch(/fail-fast:\s*false/);
  });
  test('macierz obejmuje zmianę czasu w Europie jesienią i wiosną oraz w USA; każda chwila to ISO w UTC tuż po zmianie', () => {
    const poz = [...job.matchAll(/^\s*-\s*(\S+)\|(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s*$/gm)].map(m => [m[1], m[2]]);
    expect(poz).toEqual(expect.arrayContaining([['Europe/Warsaw', '2027-10-31T02:30:00Z'], ['Europe/Warsaw', '2027-03-28T03:00:00Z'], ['America/Los_Angeles', '2027-11-07T10:30:00Z']]));
    for (const [z, iso] of poz) { /* chwila ma być 0,5–3 h po przejściu — w strefie jest już nowe przesunięcie, a start sprzed kilku godzin wypada w starym */
      const t = Date.parse(iso); const off = (ms: number) => Date.parse(new Date(ms).toLocaleString('sv-SE', { timeZone: z }).replace(' ', 'T') + 'Z') - ms;
      expect([z, off(t - 8 * 3600e3) !== off(t)]).toEqual([z, true]);
    }
  });
  test('pliki z własnym zegarem są pominięte (scripts/ci/pin-wykluczenia.mjs), a reszta biegnie z przypiętym „teraz”', () => {
    expect(tz).toMatch(/--testPathIgnorePatterns "\$\(node scripts\/ci\/pin-wykluczenia\.mjs\)"/);
    const wyk = execFileSync('node', [path.join(root, 'scripts/ci/pin-wykluczenia.mjs')]).toString().trim().split('|');
    expect(wyk).toEqual(expect.arrayContaining(['/tests/health-read-ui\\.test\\.tsx$'])); expect(wyk).not.toContain('/tests/edit-history\\.test\\.tsx$'); expect(wyk.length).toBeGreaterThan(50);
  });
  test('dawne zadanie jest bez zmian (macierz stref z matrix-time.test.ts)', () => { expect(tz).toMatch(/matrix:\s*\n\s*tz:\s*\n(\s*-\s*.+\n)+/); expect(tz).toMatch(/TZ=\$\{\{\s*matrix\.tz\s*\}\}\s+npx jest --maxWorkers=2/); });
});

describe('nightly.yml — mutacje po modułach (B)', () => {
  const conf = JSON.parse(read('stryker.config.json')) as { mutate: string[]; thresholds: { break: number } };
  const moduly = (/modul:\s*\[([^\]]+)\]/.exec(nightly)?.[1] ?? '').split(',').map(s => `lib/${s.trim()}.ts`).sort();
  test('macierz modułów = `mutate` ze stryker.config.json (dodanie modułu do konfiguracji bez zadania zostawia go niemierzonym)', () => { expect(moduly).toEqual([...conf.mutate].sort()); });
  test('zadanie modułu: konfiguracja z jednym modułem i bez progu break, limit czasu w granicach, raport jako artefakt', () => {
    expect(nightly).toMatch(/c\.mutate=\['lib\/\$\{\{ matrix\.modul \}\}\.ts'\]/); expect(nightly).toMatch(/break: null/); expect(nightly).toMatch(/npx stryker run stryker\.modul\.json/);
    expect(nightly).toMatch(/name: mutacje-\$\{\{ strategy\.job-index \}\}/); expect(nightly).toMatch(/timeout-minutes: 300/);
  });
  test('podsumowanie: osobne zadanie zbiera raporty modułów (zgłoszenie nocne czyta wynik zadania „mutacje” — jak dotąd)', () => {
    expect(nightly).toMatch(/mutacje-podsumowanie:\s*\n(?:.*\n)*?\s*needs: \[mutacje\]/); expect(nightly).toMatch(/pattern: mutacje-\*/);
    expect(nightly).toMatch(/needs: \[losowe, mutacje, e2e-maly-ekran-ciemny\]/); expect(nightly).not.toMatch(/secrets\./);
  });
  test('M1-047: w nightly.yml nie ma bramki „3 kolejne nocne pełne przebiegi” jako obowiązującej', () => { expect(nightly).not.toMatch(/^\s*#\s*3 kolejne nocne/m); });
});

describe('scripts/ci/mutacje-podsumowanie.mjs', () => {
  const rap = (f: Record<string, string[]>) => ({ files: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, { mutants: v.map(status => ({ status })) }])) });
  const uruchom = (raporty: object[], mutate: string[], prog: number | null) => {
    const d = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mut-'));
    raporty.forEach((r, i) => { fs.mkdirSync(path.join(d, `mutacje-${i}`)); fs.writeFileSync(path.join(d, `mutacje-${i}`, 'report.json'), JSON.stringify(r)); });
    const cfg = path.join(d, 's.json'); fs.writeFileSync(cfg, JSON.stringify({ mutate, thresholds: { break: prog } }));
    try { return { kod: 0, out: execFileSync('node', [path.join(root, 'scripts/ci/mutacje-podsumowanie.mjs'), d, cfg], { stdio: 'pipe' }).toString() }; }
    catch (e) { return { kod: (e as { status: number }).status, out: String((e as { stdout: Buffer }).stdout) }; }
  };
  test('sumuje moduły z katalogów artefaktów i całość; wykryte = Killed + Timeout; wszystkie = bez Ignored', () => {
    const r = uruchom([rap({ 'lib/a.ts': ['Killed', 'Survived', 'Ignored'] }), rap({ 'lib/b.ts': ['Timeout', 'NoCoverage', 'Killed'] })], ['lib/a.ts', 'lib/b.ts'], 40);
    expect(r.kod).toBe(0); expect(r.out).toMatch(/lib\/a\.ts \| 1 \| 2 \| 50\.0/); expect(r.out).toMatch(/Razem: 3 z 5 \(60\.0%\); próg break: 40%/);
  });
  test('moduł bez raportu, wynik poniżej progu i brak raportów — kod 1 z opisem', () => {
    const b = uruchom([rap({ 'lib/a.ts': ['Killed'] })], ['lib/a.ts', 'lib/b.ts'], 40); expect(b.kod).toBe(1); expect(b.out).toMatch(/Brak raportu modułów: lib\/b\.ts/);
    const p = uruchom([rap({ 'lib/a.ts': ['Survived', 'Survived', 'Killed'] })], ['lib/a.ts'], 40); expect(p.kod).toBe(1); expect(p.out).toMatch(/poniżej progu 40%/);
    const n = uruchom([], ['lib/a.ts'], 40); expect(n.kod).toBe(1); expect(n.out).toMatch(/Brak raportów/);
  });
});
