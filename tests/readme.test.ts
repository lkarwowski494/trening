/*
 * README.md (polecenie właściciela 18.10.2026): liczby, odznaki wersji, tabele i drzewo katalogów są GENEROWANE przez scripts/readme.mjs
 * między znacznikami <!-- gen:nazwa -->…<!-- /gen:nazwa --> (wzór: scripts/flows-catalog.mjs, test-matrix.mjs). Ten plik pilnuje:
 *  - aktualności (--check), kompletu bloków i poprawności znaczników,
 *  - że poza blokami generowanymi nie ma liczb ani znaku „%” (żadnych ręcznie wpisanych statystyk i „100%”),
 *  - że wygenerowane liczby zgadzają się z niezależnym obliczeniem (kod aplikacji, app.json, package.json, docs/19, tests/przeplywy.json),
 *  - braku nazw innych aplikacji i marek (tests/forbidden-names.json), adresów e-mail, telefonów, identyfikatorów urządzeń i kont,
 *  - że odnośniki do docs/ i plików repozytorium istnieją, a odznaki CI wskazują istniejące workflowy.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { namesIn } from './forbidden-names';
import { LANGS } from '@/lib/i18n';
import { LIB } from '@/lib/seed';

const root = path.join(__dirname, '..');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const script = path.join(root, 'scripts/readme.mjs');
const node = (...args: string[]) => execFileSync('node', [script, ...args], { cwd: root, encoding: 'utf8', stdio: 'pipe' });
const GEN = /<!-- gen:([\w-]+) -->([\s\S]*?)<!-- \/gen:\1 -->/g;
const blocks = [...readme.matchAll(GEN)].map(m => ({ name: m[1], body: m[2] }));
const outside = readme.replace(GEN, '');
const gen = (n: string) => blocks.find(b => b.name === n)?.body ?? '';
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const walk = (d: string, re: RegExp, out: string[] = []): string[] => { for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, re, out); else if (re.test(e.name)) out.push(p); } return out; };

describe('README.md: bloki generowane', () => {
  test('scripts/readme.mjs --check przechodzi (README zgodny z kodem; nieaktualny → node scripts/readme.mjs --write)', () => {
    expect(() => node('--check')).not.toThrow();
  });
  test('komplet bloków z --list występuje w README, każdy raz, otwarty i zamknięty; brak znaczników bez pary', () => {
    const want: string[] = JSON.parse(node('--list'));
    expect(want.length).toBeGreaterThan(5);
    expect(blocks.map(b => b.name).sort()).toEqual([...want].sort());
    expect((readme.match(/<!-- gen:/g) || []).length).toBe(want.length);
    expect((readme.match(/<!-- \/gen:/g) || []).length).toBe(want.length);
    for (const b of blocks) expect({ b: b.name, empty: b.body.trim().length === 0 }).toEqual({ b: b.name, empty: false });
  });
  test('--write jest idempotentne i nie zmienia aktualnego README', () => {
    const before = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
    try { node('--write'); expect(fs.readFileSync(path.join(root, 'README.md'), 'utf8')).toBe(before); } finally { fs.writeFileSync(path.join(root, 'README.md'), before); }
  });
  test('ręczna zmiana wewnątrz bloku jest wykrywana przez --check (README skopiowane do katalogu tymczasowego)', () => {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'readme-'));
    try {
      const tampered = readme.replace(/(<!-- gen:stats -->)/, '$1\nRĘCZNY WPIS 999\n');
      expect(tampered).not.toBe(readme);
      fs.writeFileSync(path.join(tmp, 'README.md'), tampered);
      let code = 0; try { node('--check', '--readme', path.join(tmp, 'README.md')); } catch (e: any) { code = e.status; }
      expect(code).toBe(1);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  });
  test('brak znacznika w README → --check kończy się błędem', () => {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'readme-'));
    try {
      fs.writeFileSync(path.join(tmp, 'README.md'), '# Trening\n');
      let code = 0; try { node('--check', '--readme', path.join(tmp, 'README.md')); } catch (e: any) { code = e.status; }
      expect(code).not.toBe(0);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  });
});

describe('README.md: poza blokami generowanymi nie ma liczb ani procentów', () => {
  /** Dozwolone tokeny z cyframi: odwołania do dokumentów (docs/37, docs/37-katalog…), ADR-NNN, daty decyzji DD.MM.RRRR, adresy URL, kod w odwrotnych apostrofach z nazwą pliku/polecenia, nazwa marki. */
  const strip = (s: string) => s
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/docs\/[\w./-]+/g, 'docs/')
    .replace(/\bdocs\/\d+[a-z]?\b/g, 'docs/')
    .replace(/ADR-\d+/g, 'ADR')
    .replace(/\b\d{2}\.\d{2}\.\d{4}\b/g, 'DATA')
    .replace(/apps4brew/gi, 'marka')
    .replace(/\bi18n\b/g, 'tlumaczenia')
    .replace(/e2e/gi, 'ee')
    .replace(/<!--[\s\S]*?-->/g, '');
  test('żadnej cyfry poza blokami (liczby tylko z generatora)', () => {
    const bad = strip(outside).split('\n').map((l, i) => ({ l, i: i + 1 })).filter(x => /\d/.test(x.l));
    expect(bad.map(x => `${x.i}: ${x.l}`)).toEqual([]);
  });
  test('znak „%” nie występuje poza blokami (twierdzenia typu „100%” tylko generowane)', () => {
    expect(outside.split('\n').filter(l => l.includes('%'))).toEqual([]);
  });
  test('słowa-liczebniki typu „kilkadziesiąt/setki” i „100” nie zastępują liczb', () => {
    expect(outside).not.toMatch(/\b(setki|tysiące|kilkadziesiąt|kilkaset)\b/i);
  });
  test('w blokach generowanych są liczby (blok statystyk niepusty i z cyframi)', () => {
    expect(gen('stats')).toMatch(/\d/); expect(gen('badges-ver')).toMatch(/\d/);
  });
});

describe('README.md: wygenerowane liczby zgadzają się z niezależnym obliczeniem', () => {
  const app = json('app.json').expo; const pkg = json('package.json');
  const row = (label: RegExp) => (gen('stats').split('\n').find(l => label.test(l)) ?? '');
  test('wersja aplikacji = app.json = package.json', () => {
    expect(app.version).toBe(pkg.version);
    expect(row(/Wersja aplikacji/)).toContain(app.version);
    expect(gen('badges-ver')).toContain(`wersja-${app.version}`);
  });
  test('liczba języków = LANGS = app.json locales', () => {
    expect(LANGS.length).toBe(Object.keys(app.locales).length);
    expect(row(/Języki interfejsu/)).toMatch(new RegExp(`\\b${LANGS.length}\\b`));
  });
  test('ćwiczenia w bibliotece = LIB.length', () => {
    expect(row(/Ćwiczenia w bibliotece/)).toMatch(new RegExp(`\\b${LIB.length}\\b`));
  });
  test('Expo / React Native / TypeScript z package.json', () => {
    const major = (v: string) => v.replace(/^[~^]/, '').split('.')[0];
    const g = gen('stats');
    expect(g).toContain(`Expo SDK ${major(pkg.dependencies.expo)}`);
    expect(g).toContain(pkg.dependencies['react-native'].replace(/^[~^]/, '').split('.').slice(0, 2).join('.'));
    expect(g).toContain(pkg.devDependencies.typescript.replace(/^[~^]/, '').split('.').slice(0, 2).join('.'));
  });
  test('minimum watchOS z targets/watch-app/expo-target.config.js', () => {
    const wt = /deploymentTarget:\s*'([\d.]+)'/.exec(fs.readFileSync(path.join(root, 'targets/watch-app/expo-target.config.js'), 'utf8'))![1];
    expect(row(/watchOS/)).toContain(wt);
  });
  test('minimum iOS: z app.json albo z bazy Expo (ExpoModulesCore.podspec)', () => {
    const fromApp = app.ios?.deploymentTarget as string | undefined;
    const pod = /:ios\s*=>\s*'([\d.]+)'/.exec(fs.readFileSync(path.join(root, 'node_modules/expo-modules-core/ExpoModulesCore.podspec'), 'utf8'))![1];
    expect(row(/Minimalny iOS/)).toContain(fromApp ?? pod);
  });
  test('pliki testów Jest = pliki *.test.ts(x) w tests/ ; przypadki testowe liczone statycznie (≥ liczba plików)', () => {
    const files = walk('tests', /\.test\.[jt]sx?$/);
    expect(row(/Pliki testów/)).toMatch(new RegExp(`\\b${files.length}\\b`));
    const m = /Przypadki testowe[^|]*\|\s*(\d+)/.exec(gen('stats'));
    expect(m).not.toBeNull(); expect(Number(m![1])).toBeGreaterThanOrEqual(files.length);
    // dolna granica niezależna od generatora: prosta liczba linii z test( / it( na początku wyrażenia
    let simple = 0; for (const f of files) simple += (fs.readFileSync(path.join(root, f), 'utf8').match(/^\s*(?:test|it)(?:\.(?:only|skip))?\(/gm) || []).length;
    expect(Number(m![1])).toBeGreaterThanOrEqual(simple);
  });
  test('wiersze macierzy (ekrany, elementy UI, komunikaty, funkcje, wymiary) = tabela w docs/19 oraz „bez testu: 0”', () => {
    const d19 = fs.readFileSync(path.join(root, 'docs/19-macierz-testow.md'), 'utf8');
    const t = (k: string) => { const m = new RegExp(`^\\| ${k} \\| (\\d+) \\| (\\d+) \\| (\\d+) \\|`, 'm').exec(d19)!; return { n: Number(m[1]), ok: Number(m[2]) }; };
    expect(row(/Ekrany/)).toMatch(new RegExp(`\\b${t('EKRAN').n}\\b`));
    expect(row(/Elementy UI/)).toMatch(new RegExp(`\\b${t('UI').n}\\b`));
    expect(row(/Komunikaty/)).toMatch(new RegExp(`\\b${t('TEKST').n}\\b`));
    expect(row(/Funkcje/)).toMatch(new RegExp(`\\b${t('LOGIKA').n}\\b`));
    expect(row(/Wymiary/)).toMatch(new RegExp(`\\b${t('WYMIAR').n}\\b`));
    for (const k of ['EKRAN', 'UI', 'TEKST', 'LOGIKA', 'WYMIAR']) expect(t(k).ok).toBeLessThanOrEqual(t(k).n);
  });
  test('przepływy E2E i scenariusze Maestro = tests/przeplywy.json i .maestro/', () => {
    const cat = json('tests/przeplywy.json'); const yaml = fs.readdirSync(path.join(root, '.maestro')).filter(f => /\.ya?ml$/.test(f) && f !== 'config.yaml');
    expect(row(/Przepływy użytkownika/)).toMatch(new RegExp(`\\b${cat.przeplywy.length}\\b`));
    expect(row(/Scenariusze Maestro/)).toMatch(new RegExp(`\\b${yaml.length}\\b`));
  });
  test('cennik: przełącznik i limity z lib/access.ts, plany z lib/products.ts, ceny tylko z store/Trening.storekit', () => {
    const acc = fs.readFileSync(path.join(root, 'lib/access.ts'), 'utf8');
    const enabled = /ENABLED:\s*(true|false),/.exec(acc)![1]; const free = /FREE_LIVE_PER_MONTH:\s*(\d+)/.exec(acc)![1];
    expect(gen('pricing')).toContain(`PAYWALL.ENABLED\` = \`${enabled}\``);
    expect(gen('pricing')).toContain(free);
    const kit = fs.readFileSync(path.join(root, 'store/Trening.storekit'), 'utf8');
    for (const m of kit.matchAll(/"displayPrice"\s*:\s*"([\d.]+)"/g)) expect(gen('pricing')).toContain(m[1]);
    // ceny poza blokiem generowanym nie występują (żadnych kwot ręcznie) — pokrywa to test „żadnej cyfry”, tu dodatkowo symbole walut
    expect(outside).not.toMatch(/[$€£]|\bzł\b|\bUSD\b|\bEUR\b|\bPLN\b/);
  });
  test('workflowy: każdy plik .github/workflows/*.yml jest w tabeli; odznaki CI wskazują istniejące pliki', () => {
    const wfs = fs.readdirSync(path.join(root, '.github/workflows')).filter(f => /\.yml$/.test(f));
    for (const f of wfs) expect(gen('workflows')).toContain(`\`${f}\``);
    const used = [...gen('badges-ci').matchAll(/workflows\/([\w.-]+\.yml)\/badge\.svg/g)].map(m => m[1]);
    expect(used.length).toBeGreaterThanOrEqual(3);
    for (const u of ['tests.yml', 'e2e-ios.yml', 'ios-unsigned.yml']) expect(used).toContain(u);
    for (const u of used) expect(wfs).toContain(u);
  });
  test('brak odznaki pokrycia kodu (repo go nie mierzy: brak collectCoverage / coverageThreshold w konfiguracji Jest)', () => {
    expect(JSON.stringify(pkg.jest)).not.toMatch(/collectCoverage|coverageThreshold/);
    expect(readme).not.toMatch(/coverage/i);
  });
  test('drzewo katalogów: każdy katalog najwyższego poziomu śledzony w git jest w drzewie', () => {
    const top = new Set(execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(l => l.includes('/')).map(l => l.split('/')[0]));
    for (const d of top) expect(gen('tree')).toContain(`${d}/`);
  });
  test('indeks dokumentów: każdy plik docs/*.md występuje', () => {
    for (const f of fs.readdirSync(path.join(root, 'docs')).filter(f => /\.md$/.test(f))) expect(gen('docs-index')).toContain(`docs/${f}`);
  });
});

describe('README.md: treść, prywatność, odnośniki', () => {
  test('bez nazw innych aplikacji i marek (tests/forbidden-names.json)', () => {
    expect(namesIn(readme)).toEqual([]);
  });
  test('bez adresów e-mail, telefonów, identyfikatorów urządzeń i konta deweloperskiego, kluczy i tokenów', () => {
    expect(readme).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/);
    const noDates = readme.replace(/https?:\/\/\S+/g, '').replace(/\b\d{2}\.\d{2}\.\d{4}\b/g, '');
    expect(noDates).not.toMatch(/(?<![\w/.])(?:\+\d{1,3}[\s-]?)?\d{3}[\s-]\d{3}[\s-]\d{3}(?!\w)/); // telefony
    expect(noDates).not.toMatch(/\+\d{9,}|\b\d{10,}\b/); // długie ciągi cyfr
    expect(readme).not.toMatch(/\b[0-9A-F]{8}-[0-9A-F]{16}\b/); // UDID urządzenia
    expect(readme).not.toMatch(/\b[0-9a-f]{32,}\b/i);
    expect(readme).not.toContain(json('app.json').expo.ios.appleTeamId);
    expect(readme).not.toMatch(/BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{12,}|\.p8\b.*[A-Za-z0-9+/]{40,}/);
    expect(readme).not.toMatch(/\/tmp\/claude-|\.claude\/worktrees\//);
  });
  test('polski język i wymagane sekcje (zrzuty w przygotowaniu, repozytorium publiczne, instalacja przez TestFlight, import danych)', () => {
    for (const h of [/^## .*Zasady produktowe/m, /^## .*Moduły i ekrany/m, /^## .*Model cenowy/m, /^## .*Przepływ danych/m, /^## .*Warstwy testów/m, /^## .*Uruchomienie i weryfikacja/m, /^## .*Architektura kodu/m, /^## .*Dokumentacja/m, /^## .*Status i dystrybucja/m, /^## .*Zrzuty ekranu/m, /^## .*Repozytorium publiczne/m, /^## .*Import danych/m]) expect(readme).toMatch(h);
    expect(readme).toMatch(/zrzuty w przygotowaniu/i);
    expect(readme).toMatch(/ADR-031/);
    expect(readme).toMatch(/TestFlight/);
    expect(readme).toMatch(/store-screenshots\.yml/);
  });
  test('odznaki shields.io i workflow w nagłówku (przed pierwszą sekcją ##)', () => {
    const head = readme.slice(0, readme.indexOf('\n## '));
    expect(head).toMatch(/img\.shields\.io\/badge\//); expect(head).toMatch(/actions\/workflows\/tests\.yml\/badge\.svg/);
  });
  test('polecenia npm w README istnieją w package.json (scripts)', () => {
    const scripts = json('package.json').scripts as Record<string, string>;
    for (const m of readme.matchAll(/npm run ([\w:-]+)/g)) expect({ cmd: m[1], ok: m[1] in scripts }).toEqual({ cmd: m[1], ok: true });
  });
  test('check:readme jest w package.json i w verify', () => {
    const p = json('package.json');
    expect(p.scripts['check:readme']).toBe('node scripts/readme.mjs --check');
    expect(p.scripts.verify).toContain('npm run check:readme');
  });
  test('odnośniki do docs/ i plików repozytorium wskazują istniejące pliki', () => {
    const missing: string[] = [];
    for (const m of readme.matchAll(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g)) { const p = m[1].split('#')[0]; if (p && !fs.existsSync(path.join(root, p))) missing.push(p); }
    for (const m of readme.matchAll(/`(docs\/[\w./-]+\.md)`/g)) if (!fs.existsSync(path.join(root, m[1]))) missing.push(m[1]);
    for (const m of readme.matchAll(/\bdocs\/(\d+[a-z]?)(?![\w./-])/g)) if (!fs.readdirSync(path.join(root, 'docs')).some(f => f.startsWith(`${m[1]}-`))) missing.push(`docs/${m[1]}`);
    expect(missing).toEqual([]);
  });
  test('adresy https w README to wyłącznie znane domeny (shields.io, github.com, apps4brew.com, apple.com, expo.dev, reactnative.dev, typescriptlang.org, sqlite.org)', () => {
    const ok = /^(img\.shields\.io|github\.com|apps4brew\.com|www\.apple\.com|developer\.apple\.com|expo\.dev|reactnative\.dev|www\.typescriptlang\.org|www\.sqlite\.org|maestro\.mobile\.dev|testflight\.apple\.com|lkarwowski494\.github\.io)$/;
    const bad = [...readme.matchAll(/https?:\/\/([^/\s)"'>]+)/g)].map(m => m[1]).filter(h => !ok.test(h));
    expect(bad).toEqual([]);
  });
});
