/* Podział scenariuszy Maestro na części (13.10.2026, decyzja właściciela): każdy scenariusz w DOKŁADNIE jednej części, nowy scenariusz bez wagi
 * nie jest pomijany, podział deterministyczny i zrównoważony; workflow e2e-ios.yml: build raz, macierz części, artefakty z numerem części. */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

const root = path.join(__dirname, '..');
const script = path.join(root, 'scripts/ci/e2e-shards.mjs');
const cfgPath = path.join(root, 'scripts/ci/e2e-shards.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const maestro = path.join(root, '.maestro');
const wf = fs.readFileSync(path.join(root, '.github/workflows/e2e-ios.yml'), 'utf8');

type Part = { czesc: number; files: string[]; update: string[]; waga_s: number };
const plan = (dir = maestro, config = cfgPath): Part[] => JSON.parse(execFileSync('node', [script, 'plan', '--dir', dir, '--config', config], { encoding: 'utf8' }));
/** Scenariusz z tagiem `eksperyment` (katalog przepływów, docs/38 pkt 5) nie wchodzi do podziału na części — idzie osobnym, niewiążącym zadaniem. */
const isExp = (dir: string, f: string) => /^tags:\n\s+- eksperyment\s*$/m.test(fs.readFileSync(path.join(dir, f), 'utf8'));
const scenarios = (dir: string) => fs.readdirSync(dir).filter(f => f.endsWith('.yaml') && f !== 'config.yaml' && !isExp(dir, f)).sort();
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'shards-'));

describe('podział scenariuszy na części', () => {
  test('każdy scenariusz z .maestro jest w dokładnie jednej części (zwykły albo aktualizacja), bez dubli i bez obcych plików', () => {
    const all = plan().flatMap(p => [...p.files, ...p.update]);
    expect([...all].sort()).toEqual(scenarios(maestro));
    expect(new Set(all).size).toBe(all.length);
    expect(plan()).toHaveLength(cfg.czesci);
  });

  test('33 i 34 (tag aktualizacja) trafiają razem do jednej części; pozostałe części nie wykonują testu aktualizacji', () => {
    const withUpd = plan().filter(p => p.update.length);
    expect(withUpd).toHaveLength(1);
    expect(withUpd[0].update).toEqual(['33-aktualizacja-przygotuj.yaml', '34-aktualizacja-sprawdz.yaml']);
    expect(plan().flatMap(p => p.files).filter(f => /^3[34]-/.test(f))).toEqual([]);
  });

  test('podział jest deterministyczny (dwa uruchomienia = ten sam wynik) i zrównoważony (różnica części ≤ najdłuższy scenariusz, największa ≤ 115% średniej)', () => {
    expect(plan()).toEqual(plan());
    const w = plan().map(p => p.waga_s); const avg = w.reduce((a, b) => a + b, 0) / w.length;
    expect(Math.max(...w) - Math.min(...w)).toBeLessThanOrEqual(Math.max(...Object.values<number>(cfg.wagi_s)));
    expect(Math.max(...w)).toBeLessThanOrEqual(avg * 1.15);
  });

  test('wagi: bez przestarzałych wpisów (każdy plik z wagą istnieje) i z dodatnimi liczbami całkowitymi', () => {
    for (const [f, v] of Object.entries<number>(cfg.wagi_s)) { expect({ f, istnieje: fs.existsSync(path.join(maestro, f)) }).toEqual({ f, istnieje: true }); expect(Number.isInteger(v) && v > 0).toBe(true); }
    expect(cfg.czesci).toBeGreaterThanOrEqual(2);
  });

  test('NOWY scenariusz bez wagi nie jest pomijany: trafia automatycznie do jednej części (waga domyślna), reszta podziału wciąż pełna', () => {
    const d = tmp(); fs.cpSync(maestro, d, { recursive: true });
    fs.writeFileSync(path.join(d, '40-nowy-bez-wagi.yaml'), 'appId: x\nname: Nowy\n---\n- launchApp\n');
    fs.writeFileSync(path.join(d, '41-drugi-nowy.yaml'), 'appId: x\nname: Drugi\n---\n- launchApp\n');
    const all = plan(d).flatMap(p => [...p.files, ...p.update]);
    expect([...all].sort()).toEqual(scenarios(d));
    expect(all.filter(f => /^4[01]-/.test(f))).toHaveLength(2);
    expect(Object.keys(cfg.wagi_s)).not.toContain('40-nowy-bez-wagi.yaml'); /* jest bez wagi — a mimo to przypisany */
  });

  test('NOWY scenariusz z tagiem aktualizacja dołącza do grupy aktualizacji (nie ginie, nie rozbija pary)', () => {
    const d = tmp(); fs.cpSync(maestro, d, { recursive: true });
    fs.writeFileSync(path.join(d, '36-aktualizacja-dodatkowy.yaml'), 'appId: x\nname: Dod\ntags:\n  - aktualizacja\n---\n- launchApp\n');
    const upd = plan(d).flatMap(p => p.update);
    expect(upd).toEqual(['33-aktualizacja-przygotuj.yaml', '34-aktualizacja-sprawdz.yaml', '36-aktualizacja-dodatkowy.yaml']);
  });

  test('config.yaml i katalog subflows nie są scenariuszami; wszystkie scenariusze są wpisane w config.yaml (tak jak wymaga maestro-selectors)', () => {
    const list = [...fs.readFileSync(path.join(maestro, 'config.yaml'), 'utf8').matchAll(/^\s+- (\d\d-.*\.yaml)$/gm)].map(m => m[1]).sort();
    expect(list).toEqual(scenarios(maestro));
  });
});

describe('polecenie „czesc” (krok „Plan części” w workflow)', () => {
  const run = (n: number, only = '') => {
    const out = path.join(tmp(), 'czesc'); const gh = path.join(tmp(), 'out.txt'); fs.writeFileSync(gh, '');
    const log = execFileSync('node', [script, 'czesc', String(n), '--out', out], { encoding: 'utf8', env: { ...process.env, ONLY: only, GITHUB_OUTPUT: gh } });
    const o = Object.fromEntries(fs.readFileSync(gh, 'utf8').trim().split('\n').map(l => l.split('='))) as Record<string, string>;
    return { log, o, files: fs.existsSync(out) ? scenarios(out) : [], sub: fs.existsSync(path.join(out, 'subflows')) };
  };
  const parts = plan();

  test('bez ONLY: katalog części = jej scenariusze zwykłe + subflows; razem wszystkie części dają wszystkie scenariusze zwykłe, update tylko w jednej', () => {
    const rs = parts.map(p => run(p.czesc));
    rs.forEach((r, i) => { expect(r.files).toEqual(parts[i].files); expect(r.sub).toBe(true); expect(r.o.main).toBe('true'); });
    expect(rs.filter(r => r.o.update === 'true')).toHaveLength(1);
    expect(rs.flatMap(r => r.files).sort()).toEqual(scenarios(maestro).filter(f => !/^3[34]-/.test(f)));
  });

  test('ONLY="31 35": suma części = dokładnie 31 i 35, każdy w swojej stałej części; części bez wybranych kończą się bez pracy (any=false)', () => {
    const rs = parts.map(p => run(p.czesc, '31 35'));
    expect(rs.flatMap(r => r.files).sort()).toEqual(['31-pierwszy-tydzien.yaml', '35-ustawienia-dostepnosc.yaml']);
    rs.forEach((r, i) => { expect(r.files).toEqual(parts[i].files.filter(f => /^(31|35)-/.test(f))); expect(r.o.any).toBe(String(r.files.length > 0)); });
    expect(rs.some(r => r.o.update === 'true')).toBe(false);
  });

  test('ONLY="33" albo "34": test aktualizacji w jednej części, bez zwykłych scenariuszy; ONLY="3" nie wybiera 31/32/33 (całe numery, nie podciągi)', () => {
    for (const only of ['33', '34', '33 34']) { const rs = parts.map(p => run(p.czesc, only)); expect(rs.filter(r => r.o.update === 'true')).toHaveLength(1); expect(rs.flatMap(r => r.files)).toEqual([]); expect(rs.filter(r => r.o.main === 'true')).toHaveLength(0); }
    expect(parts.flatMap(p => run(p.czesc, '3').files)).toEqual([]);
  });

  test('zły numer części kończy się błędem', () => {
    expect(() => execFileSync('node', [script, 'czesc', String(cfg.czesci + 1)], { stdio: 'pipe' })).toThrow();
    expect(() => execFileSync('node', [script, 'czesc', '0'], { stdio: 'pipe' })).toThrow();
  });
});

describe('e2e-ios.yml po podziale na części', () => {
  const job = (n: string) => { const i = wf.indexOf(`\n  ${n}:\n`); const rest = wf.slice(i + 1); const m = rest.slice(1).search(/\n  \w[\w-]*:\n/); return m < 0 ? rest : rest.slice(0, m + 1); };

  test('build raz (pomijany przy aplikacja_z_przebiegu), potem macierz części z fail-fast: false; liczba części = konfiguracji', () => {
    const b = job('build'), e = job('e2e');
    expect(b).toMatch(/if: inputs\.aplikacja_z_przebiegu == ''/); expect(b).toMatch(/name: trening-sim-app/); expect(b).toMatch(/xcodebuild/);
    expect(b).not.toMatch(/maestro|simctl/i);
    expect(e).toMatch(/needs: build/); expect(e).toMatch(/!cancelled\(\) && \(needs\.build\.result == 'success' \|\| needs\.build\.result == 'skipped'\)/);
    expect(e).toMatch(/fail-fast: false/);
    const shards = JSON.parse(e.match(/shard: (\[[\d, ]+\])/)![1]); expect(shards).toEqual(Array.from({ length: cfg.czesci }, (_, i) => i + 1));
    expect(e).toMatch(/node scripts\/ci\/e2e-shards\.mjs czesc "\$SHARD"/);
  });

  test('zachowane: wejścia, concurrency, strażniki czasu, powtórzenie, podsumowanie porażki, test aktualizacji tylko w części z planu', () => {
    for (const i of ['aplikacja_z_przebiegu', 'urzadzenie', 'wyglad', 'poprzednia_wersja_z_przebiegu', 'tylko_scenariusze']) expect(wf).toMatch(new RegExp(`\\n\\s+${i}:`));
    expect(wf).toMatch(/workflow_call:/); expect(wf).toMatch(/group: e2e-\$\{\{ github\.ref \}\}-\$\{\{ github\.event_name \}\}\n\s+cancel-in-progress: \$\{\{ github\.event_name == 'push' \}\}/);
    const e = job('e2e');
    expect(e.match(/guard\(\)/g)).toHaveLength(2); expect(e).toMatch(/MAESTRO_ALARM:-6000/); expect(e).toMatch(/MAESTRO_ALARM_UPD:-1500/);
    expect(e).toMatch(/iOS driver not ready in time\|deviceInfo failed/); expect(e).toMatch(/name: Podsumowanie porażki[\s\S]*if: failure\(\)/);
    expect(e).toMatch(/id: prev\n\s+if: \$\{\{ !cancelled\(\) && steps\.plan\.outputs\.update == 'true'/);
    expect(e).toMatch(/33-aktualizacja-przygotuj\.yaml[\s\S]*34-aktualizacja-sprawdz\.yaml/);
    expect(e).toMatch(/if: steps\.plan\.outputs\.main == 'true'/); expect(e).toMatch(/steps\.plan\.outputs\.any == 'true'/);
  });

  test('artefakty porażek mają numer części w nazwie (nie nadpisują się); jedyny artefakt bez numeru to aplikacja i log builda z zadania build', () => {
    const names = [...wf.matchAll(/actions\/upload-artifact@v4[\s\S]*?\n\s+name: (\S+)/g)].map(m => m[1]).sort();
    expect(names).toEqual(['e2e-ios-${{', 'e2e-ios-eksperymenty', 'trening-sim-app', 'xcodebuild-log-sim'].sort()); /* 14.10.2026: osobne, niewiążące zadanie eksperymentów 40–42 (decyzja właściciela) */
    expect(job('e2e')).toMatch(/name: e2e-ios-\$\{\{ matrix\.shard \}\}/);
    expect(job('e2e')).not.toMatch(/name: e2e-ios\n/);
  });
});

describe('e2e-ios.yml: eksperymenty 40–42 (decyzja właściciela 14.10.2026 — osobno, niewiążąco)', () => {
  test('osobne zadanie po buildzie, nie czerni przebiegu, tylko pliki z tagiem eksperyment, bez sekretów poza GITHUB_TOKEN', () => {
    const j = wf.slice(wf.indexOf('\n  eksperymenty:'));
    expect(j).toMatch(/needs: build/); expect(j).toMatch(/continue-on-error: true/);
    expect(j).toMatch(/grep -l -E '\^  - eksperyment\$'/);
    expect([...j.matchAll(/secrets\.(\w+)/g)].map(m => m[1])).toEqual(['GITHUB_TOKEN']);
  });
});
