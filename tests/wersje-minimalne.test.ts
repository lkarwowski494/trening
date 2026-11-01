/* Audyt jakości 009 (01.11.2026): Xcode, SDK symulatora i Maestro w CI bez minimalnych wersji. Jedno źródło liczb: scripts/ci/wersje-minimalne.json;
 * scripts/ci/sprawdz-wersje.sh daje twardy błąd przy niższej (i przy nierozpoznanej) wersji; select-xcode.sh, e2e-ios.yml i store-screenshots.yml go wołają.
 * Dowód na gotowym produkcie: przebieg e2e-ios.yml na macOS (log kroków „Wersja … — OK”). */
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8');
const min = JSON.parse(read('scripts/ci/wersje-minimalne.json')) as Record<string, string>;
const sprawdz = (klucz: string, tekst: string, env: Record<string, string> = {}) => { const r = spawnSync('bash', [join(root, 'scripts/ci/sprawdz-wersje.sh'), klucz, tekst], { encoding: 'utf8', env: { ...process.env, ...env } }); return { rc: r.status, out: r.stdout + r.stderr }; };
const xcode = (wersje: string[]) => { const d = mkdtempSync(join(tmpdir(), 'xc-')); wersje.forEach(v => mkdirSync(join(d, `Xcode_${v}.app`))); const r = spawnSync('bash', [join(root, 'scripts/ci/select-xcode.sh'), '26'], { encoding: 'utf8', env: { ...process.env, APPS_DIR: d, DRY_RUN: '1' } }); return { rc: r.status, out: r.stdout + r.stderr }; };

describe('minimalne wersje narzędzi CI', () => {
  test('plik minimów ma xcode, ios_sdk, maestro w formacie x.y[.z]', () => { for (const k of ['xcode', 'ios_sdk', 'maestro']) expect(min[k]).toMatch(/^\d+\.\d+(\.\d+)?$/); });
  test('sprawdz-wersje.sh: równa i wyższa przechodzą (w tym 26.10 > 26.4 — porównanie liczbowe, nie tekstowe)', () => {
    for (const k of ['xcode', 'ios_sdk', 'maestro']) { expect(sprawdz(k, min[k]).rc).toBe(0); expect(sprawdz(k, `${min[k]}.1`).rc).toBe(0); }
    expect(sprawdz('xcode', '26.10').rc).toBe(0); expect(sprawdz('maestro', 'Maestro 2.12.0').out).toContain('2.12.0');
  });
  test('sprawdz-wersje.sh: niższa → kod 1 z komunikatem o minimum; pusta i nierozpoznana → kod 1', () => {
    const nizsza = sprawdz('maestro', '2.10.9'); expect(nizsza.rc).toBe(1); expect(nizsza.out).toContain(`minimum ${min.maestro}`);
    expect(sprawdz('xcode', '26.3').rc).toBe(1); expect(sprawdz('ios_sdk', '25.9').rc).toBe(1); expect(sprawdz('xcode', '').rc).toBe(1); expect(sprawdz('maestro', 'brak wersji').rc).toBe(1);
  });
  test('nieznany klucz w pliku minimów → kod 2 (literówka w workflow nie przepuszcza sprawdzenia)', () => { expect(sprawdz('nieistniejacy', '1.0').rc).toBe(2); });
  test('select-xcode.sh: najnowszy 26.x poniżej minimum → błąd; 26.4.1 i nowszy → przechodzi', () => {
    const niski = xcode(['26.0.1', '26.3']); expect(niski.rc).toBe(1); expect(niski.out).toContain('niższy niż wymagane minimum');
    expect(xcode(['26.0.1', '26.4.1']).rc).toBe(0); expect(xcode(['26.3', '26.4.1', '26.6']).out).toContain('Wybrany Xcode: 26.6');
  });
  test('workflowy: e2e-ios.yml sprawdza SDK symulatora (oba kroki Simulator) i Maestro, store-screenshots.yml — Maestro; bez dopisku „|| true” przy wersji Maestro', () => {
    const e = read('.github/workflows/e2e-ios.yml'); expect((e.match(/sprawdz-wersje\.sh ios_sdk "\$SDK"/g) ?? []).length).toBe((e.match(/show-sdk-version/g) ?? []).length);
    expect(e).toMatch(/sprawdz-wersje\.sh maestro/); expect(e).not.toMatch(/maestro" --version \|\| true/); expect(read('.github/workflows/store-screenshots.yml')).toMatch(/sprawdz-wersje\.sh maestro/);
  });
  test('liczby w jednym miejscu: workflowy i skrypty nie wpisują minimów na sztywno', () => {
    for (const f of ['.github/workflows/e2e-ios.yml', 'scripts/ci/sprawdz-wersje.sh']) expect(read(f).replace(/#.*$/gm, '')).not.toContain(min.xcode);
    expect(read('scripts/ci/select-xcode.sh').replace(/#.*$/gm, '')).not.toMatch(/MIN=|26\.4/);
  });
});
