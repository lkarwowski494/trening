/* Pakiet podstawowy E2E, ponowienie pojedynczego scenariusza i tryb ścisły (decyzja właściciela 19.10.2026):
 * TestFlight blokuje pakiet podstawowy (kluczowe przepływy, 2 maszyny, ~20–25 min), pełny katalog biegnie nocą niewiążąco z pomiarem niestabilności,
 * a przed App Store — pełny w trybie ścisłym (bez ponowień). Lista: scripts/ci/e2e-podstawowy.json; wybór: docs/38. */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const spec = JSON.parse(read('scripts/ci/e2e-podstawowy.json'));
const cfg = JSON.parse(read('scripts/ci/e2e-shards.json'));
const wf = read('.github/workflows/e2e-ios.yml');
const night = read('.github/workflows/nightly.yml');
const shards = path.join(root, 'scripts/ci/e2e-shards.mjs');
const maestro = path.join(root, '.maestro');
const isExp = (f: string) => /^tags:\n\s+- eksperyment\s*$/m.test(read(`.maestro/${f}`));
const files = fs.readdirSync(maestro).filter(f => /^\d\d-.*\.yaml$/.test(f) && !isExp(f)).sort();
const num = (f: string) => f.slice(0, f.indexOf('-'));

const run = (args: string[], env: Record<string, string> = {}) => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pakiet-')), 'czesc'); const gh = path.join(path.dirname(out), 'gh-output');
  const log = execFileSync('node', [shards, ...args, '--out', out], { encoding: 'utf8', env: { ...process.env, PAKIET: '', ONLY: '', GITHUB_OUTPUT: gh, ...env } });
  return { log, out: fs.existsSync(out) ? fs.readdirSync(out).filter(f => f.endsWith('.yaml')).sort() : [], gh: fs.existsSync(gh) ? fs.readFileSync(gh, 'utf8') : '' };
};

describe('pakiet podstawowy — lista', () => {
  test('12–15 przepływów, każdy numer z listy to istniejący scenariusz z katalogu części (nie eksperyment), bez dubli, każdy z uzasadnieniem', () => {
    const nums: string[] = spec.scenariusze;
    expect(nums.length).toBeGreaterThanOrEqual(12); expect(nums.length).toBeLessThanOrEqual(15); expect(new Set(nums).size).toBe(nums.length);
    for (const n of nums) expect({ n, plik: files.filter(f => num(f) === n).length }).toEqual({ n, plik: 1 });
    expect(Object.keys(spec.przeplywy).sort()).toEqual([...nums].sort());
    for (const v of Object.values<string>(spec.przeplywy)) expect(v.length).toBeGreaterThan(15);
  });
  test('33 i 34 (para aktualizacji) są razem; pakiet obejmuje przepływy z decyzji: start, zapis serii, historia, plan, zakup/limit, Zdrowie, aktualizacja, ustawienia/język, ⓘ, strażnik', () => {
    const nums: string[] = spec.scenariusze;
    expect(nums.includes('33')).toBe(nums.includes('34')); expect(nums).toContain('33');
    for (const n of ['31', '01', '05', '13', '21', '20', '35', '09', '53', '52']) expect(nums).toContain(n);
  });
  test('docs/38 opisuje pakiet podstawowy, TestFlight/App Store, tryb ścisły i warunek 3 nocnych przebiegów', () => {
    const d = read('docs/' + fs.readdirSync(path.join(root, 'docs')).find(f => /^38-/.test(f))!);
    expect(d).toMatch(/Pakiet podstawowy E2E/); expect(d).toMatch(/tryb ścisły/i); expect(d).toMatch(/3 kolejne nocne/i); expect(d).toMatch(/TestFlight/); expect(d).toMatch(/App Store/);
  });
});

describe('podział pakietu na maszyny', () => {
  test('pakiet podstawowy (domyślny, także przy pustym PAKIET): dokładnie pliki z listy na czesci_podstawowy maszynach, każdy w jednej części, zrównoważone i ≤ 30 min na część', () => {
    const plan = JSON.parse(execFileSync('node', [shards, 'plan-podstawowy'], { encoding: 'utf8' })) as { files: string[]; update: string[]; waga_s: number }[];
    expect(plan).toHaveLength(cfg.czesci_podstawowy); expect(cfg.czesci_podstawowy).toBeLessThan(cfg.czesci);
    const all = plan.flatMap(p => [...p.files, ...p.update]).sort();
    expect(all).toEqual(files.filter(f => spec.scenariusze.includes(num(f)))); expect(new Set(all).size).toBe(all.length);
    for (const p of plan) expect(p.waga_s).toBeLessThanOrEqual(30 * 60);
    expect(plan.filter(p => p.update.length)).toHaveLength(1);
  });
  test('workflow ma 3 maszyny w macierzy: przy pakiecie podstawowym trzecia nie dostaje scenariuszy (any=false) i kończy od razu', () => {
    const r = run(['czesc', '3'], { PAKIET: 'podstawowy' }); expect(r.out).toEqual([]); expect(r.gh).toMatch(/any=false/);
    const r0 = run(['czesc', '3'], {}); expect(r0.gh).toMatch(/any=false/); /* puste PAKIET (push) = podstawowy */
  });
  test('pakiet podstawowy: części 1 i 2 razem wykonują dokładnie listę (zwykłe + aktualizacja)', () => {
    const got = [1, 2].map(n => run(['czesc', String(n)], { PAKIET: 'podstawowy' })); const main = got.flatMap(g => g.out);
    expect(main.filter(f => !/^3[34]-/.test(f)).sort()).toEqual(files.filter(f => spec.scenariusze.includes(num(f)) && !/^3[34]-/.test(f)));
    expect(got.filter(g => /update=true/.test(g.gh))).toHaveLength(1);
  });
  test('pakiet pełny: wszystkie scenariusze katalogu na 3 maszynach; tylko_scenariusze ma pierwszeństwo przed pakietem', () => {
    const all = [1, 2, 3].map(n => run(['czesc', String(n)], { PAKIET: 'pelny' }));
    expect(all.flatMap(g => g.out).filter(f => !/^3[34]-/.test(f)).sort()).toEqual(files.filter(f => !/^3[34]-/.test(f)));
    const only = [1, 2, 3].map(n => run(['czesc', String(n)], { PAKIET: 'podstawowy', ONLY: '12 28' })).flatMap(g => g.out).sort();
    expect(only).toEqual(files.filter(f => /^(12|28)-/.test(f)));
  });
  test('nieznany pakiet to błąd (nie ciche uruchomienie nie tego, co trzeba)', () => {
    expect(() => run(['czesc', '1'], { PAKIET: 'czesciowy' })).toThrow();
  });
});

describe('workflow e2e-ios.yml i nightly.yml — wejścia i ponowienie', () => {
  test('wejścia: pakiet (podstawowy domyślnie | pelny), tryb_scisly (domyślnie false) — w workflow_dispatch i workflow_call', () => {
    expect(wf).toMatch(/pakiet:\n\s+description:[^\n]*\n\s+type: choice\n\s+options: \[podstawowy, pelny\]\n\s+default: podstawowy/);
    expect(wf).toMatch(/tryb_scisly:\n\s+description:[^\n]*\n\s+type: boolean\n\s+default: false/);
    expect(wf).toMatch(/pakiet: \{ type: string, required: false, default: 'podstawowy' \}/); expect(wf).toMatch(/tryb_scisly: \{ type: boolean, required: false, default: false \}/);
  });
  test('tryb ścisły wymusza pełny katalog i wyłącza ponowienia (Maestro i test aktualizacji)', () => {
    expect(wf).toMatch(/PAKIET: \$\{\{ inputs\.tryb_scisly == true && 'pelny' \|\| inputs\.pakiet \}\}/);
    expect(wf.match(/STRICT: \$\{\{ inputs\.tryb_scisly == true && 'true' \|\| 'false' \}\}/g)).toHaveLength(2);
    expect(wf.match(/\[ "\$STRICT" != "true" \]/g)).toHaveLength(2);
  });
  test('ponowienie: tylko nieudane scenariusze (nieudane → osobne uruchomienie pliku, raz), wynik nie jest ukrywany (krok „Wyniki scenariuszy”, zadanie wyniki, artefakt e2e-wyniki)', () => {
    expect(wf).toMatch(/node scripts\/ci\/e2e-wyniki\.mjs nieudane e2e-out\/report\.xml "\$DIR"/);
    expect(wf).toMatch(/guard maestro --device "\$SIM" test "\$DIR\/\$f" --format junit --output "e2e-out\/ponowienie\//);
    expect(wf).toMatch(/faza e2e-out\/aktualizacja\/ponowienie/);
    expect(wf).toMatch(/e2e-wyniki\.mjs wyniki e2e-out/); expect(wf).toMatch(/name: e2e-wyniki/); expect(wf).toMatch(/e2e-wyniki\.mjs zbierz/);
    expect(wf).not.toMatch(/maxRetries|retry-failed|continue-on-error: true\n\s+timeout-minutes: 300/);
  });
  test('eksperymenty (niewiążące) tylko z pełnym katalogiem; nightly.yml uruchamia pakiet pelny (pomiar niestabilności), nie tryb ścisły', () => {
    expect(wf).toMatch(/inputs\.tylko_scenariusze == '' && \(inputs\.pakiet == 'pelny' \|\| inputs\.tryb_scisly == true\)/);
    expect(night).toMatch(/uses: \.\/\.github\/workflows\/e2e-ios\.yml\n\s+with:\n\s+pakiet: pelny/); expect(night).not.toMatch(/tryb_scisly: true/);
  });
});

/* ---- scripts/ci/e2e-wyniki.mjs ---- */
/* moduł ESM (.mjs) — Jest (CJS) wywołuje go podprocesem Node: wyrażenie dostaje `w` (eksporty) i `d` (katalog), wynik wraca jako JSON */
const wynik = (expr: string, d: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import * as w from ${JSON.stringify('file://' + path.join(root, 'scripts/ci/e2e-wyniki.mjs'))}; const d = ${JSON.stringify(d)}; console.log(JSON.stringify(${expr}))`], { encoding: 'utf8' }));
const junit = (cases: { name: string; ok: boolean; t: number }[]) => `<?xml version="1.0"?><testsuites><testsuite name="s">${cases.map(c => c.ok ? `<testcase id="${c.name}" name="${c.name}" classname="${c.name}" time="${c.t}"/>` : `<testcase id="${c.name}" name="${c.name}" classname="${c.name}" time="${c.t}"><failure>x</failure></testcase>`).join('')}</testsuite></testsuites>`;

describe('e2e-wyniki.mjs — wyniki i niestabilność', () => {
  const mk = (first: any[], retry?: any[], upd?: any[]) => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'wyn-')); fs.writeFileSync(path.join(d, 'report.xml'), junit(first));
    if (retry) { fs.mkdirSync(path.join(d, 'ponowienie')); fs.writeFileSync(path.join(d, 'ponowienie', 'a.xml'), junit(retry)); }
    if (upd) { fs.mkdirSync(path.join(d, 'aktualizacja')); fs.writeFileSync(path.join(d, 'aktualizacja', 'przygotuj.xml'), junit(upd)); }
    return d;
  };
  test('klasyfikacja: przeszedł / przeszedł w ponowieniu / padł dwa razy / padł (bez ponowienia, tryb ścisły) — z czasami', async () => {
    const d = mk([{ name: 'A', ok: true, t: 10 }, { name: 'B', ok: false, t: 20 }, { name: 'C', ok: false, t: 30 }, { name: 'D', ok: false, t: 40 }], [{ name: 'B', ok: true, t: 11 }, { name: 'C', ok: false, t: 12 }]);
    const rows = wynik('w.collect(d)', d); const by = Object.fromEntries(rows.map((r: any) => [r.scenariusz, r]));
    expect(by.A).toEqual({ scenariusz: 'A', wynik: 'przeszedl', czas_s: 10 });
    expect(by.B).toEqual({ scenariusz: 'B', wynik: 'przeszedl_w_ponowieniu', czas_s: 20, czas_ponowienia_s: 11 });
    expect(by.C.wynik).toBe('padl_dwa_razy'); expect(by.D.wynik).toBe('padl'); /* D nie miał ponowienia (tryb ścisły albo brak pliku) */
    const md = wynik('w.markdown(w.collect(d), "T")', d) as string; expect(md).toMatch(/Zielone dopiero w ponowieniu \(niestabilne\):\*\* B/); expect(md).toMatch(/Czerwone:\*\* C \(padł dwa razy\); D/);
  });
  test('test aktualizacji (33–34) wchodzi do wyników z katalogu aktualizacja/ i jego ponowienie z aktualizacja/ponowienie/', async () => {
    const d = mk([{ name: 'A', ok: true, t: 5 }], undefined, [{ name: 'Aktualizacja', ok: false, t: 7 }]);
    fs.mkdirSync(path.join(d, 'aktualizacja', 'ponowienie')); fs.writeFileSync(path.join(d, 'aktualizacja', 'ponowienie', 'przygotuj.xml'), junit([{ name: 'Aktualizacja', ok: true, t: 8 }]));
    expect(wynik('w.collect(d)', d).find((r: any) => r.scenariusz === 'Aktualizacja').wynik).toBe('przeszedl_w_ponowieniu');
  });
  test('nieudane → nazwy plików (po `name:` z yaml); nieznana nazwa tylko ostrzeżenie; zbierz łączy części w jeden JSON', async () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'wyn-')); const dir = path.join(d, 'sc'); fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, '07-a.yaml'), 'appId: x\nname: Zamiana (E2)\n---\n- launchApp\n'); fs.writeFileSync(path.join(dir, '08-b.yaml'), 'appId: x\nname: Szablon\n---\n- launchApp\n');
    fs.writeFileSync(path.join(d, 'r.xml'), junit([{ name: 'Zamiana (E2)', ok: false, t: 1 }, { name: 'Szablon', ok: true, t: 1 }, { name: 'Nieznany', ok: false, t: 1 }]));
    expect(execFileSync('node', [path.join(root, 'scripts/ci/e2e-wyniki.mjs'), 'nieudane', path.join(d, 'r.xml'), dir], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()).toBe('07-a.yaml');
    const o1 = mk([{ name: 'A', ok: true, t: 1 }]), o2 = mk([{ name: 'B', ok: false, t: 2 }], [{ name: 'B', ok: true, t: 3 }]);
    execFileSync('node', [path.join(root, 'scripts/ci/e2e-wyniki.mjs'), 'wyniki', o1, '1']); execFileSync('node', [path.join(root, 'scripts/ci/e2e-wyniki.mjs'), 'wyniki', o2, '2']);
    const all = fs.mkdtempSync(path.join(os.tmpdir(), 'wyn-')); fs.cpSync(o1, path.join(all, 'e2e-ios-1'), { recursive: true }); fs.cpSync(o2, path.join(all, 'e2e-ios-2'), { recursive: true });
    const outJson = path.join(all, 'out.json'); execFileSync('node', [path.join(root, 'scripts/ci/e2e-wyniki.mjs'), 'zbierz', all, '--out', outJson]);
    expect(JSON.parse(fs.readFileSync(outJson, 'utf8')).scenariusze.map((r: any) => [r.scenariusz, r.wynik])).toEqual([['A', 'przeszedl'], ['B', 'przeszedl_w_ponowieniu']]);
  });
});

/* M1-audytor-generalny-058: nocny przebieg „mały ekran” wybierał iPhone 17e (390 pt) — pierwszy z listy po modelu. Wybór po szerokości ekranu i jej zapis w logu. */
describe('wybór symulatora według szerokości ekranu (M1-058)', () => {
  const U = (n: number) => `0000000${n}-0000-0000-0000-000000000000`.slice(-36);
  const lista = `-- iOS 26.5 --\n    iPhone 16e (${U(1)}) (Shutdown)\n    iPhone 17e (${U(2)}) (Shutdown)\n    iPhone 17 (${U(3)}) (Shutdown)\n    iPhone SE (3rd generation) (${U(4)}) (Shutdown)\n    iPad Pro (${U(5)}) (Shutdown)\n`;
  const sel = (wz: string, extra: string[] = []) => execFileSync('node', [path.join(root, 'scripts/ci/sim-wybor.mjs'), wz, ...extra], { input: lista, encoding: 'utf8' }).trim();
  test('spośród pasujących bierze najwęższy, nie pierwszy z listy', () => {
    expect(sel('iPhone SE|iPhone 16e|iPhone 17e')).toBe(U(4));
    expect(sel('iPhone 16e|iPhone 17e')).toBe(U(1));
  });
  test('wzorzec domyślny „iPhone 17 (” wskazuje iPhone 17 jak dotąd', () => { expect(sel('iPhone 17 \\(')).toBe(U(3)); });
  test('brak dopasowania daje pusty wynik, a --opis podaje szerokość ekranu', () => {
    expect(sel('iPhone 99')).toBe('');
    expect(sel('iPhone 16e|iPhone 17e', ['--opis'])).toBe('iPhone 16e — szerokość ekranu 390 pt (próg małego ekranu: 375 pt)');
  });
  test('e2e-ios.yml używa wyboru w obu krokach „Simulator” i wypisuje szerokość ekranu w logu', () => {
    expect(wf.match(/node scripts\/ci\/sim-wybor\.mjs "\$pat"/g)).toHaveLength(4); /* 2× wybór + 2× opis */
    expect(wf.match(/sim-wybor\.mjs "\$pat" --opis/g)).toHaveLength(2);
    expect(wf).not.toMatch(/grep -m1 -E "\$pat"/);
  });
  test('nocny pakiet „mały ekran” nadal prosi o SE i modele „e” (najwęższy wygrywa)', () => { expect(night).toMatch(/urzadzenie: 'iPhone SE\|iPhone 16e\|iPhone 17e'/); });
});
