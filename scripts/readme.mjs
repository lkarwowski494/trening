// README.md — generator bloków z liczbami, odznakami, tabelami i drzewem katalogów (polecenie właściciela 18.10.2026).
// Zasada: w README nie ma liczb wpisanych ręcznie. Wszystko, co zawiera liczbę, wersję, listę plików albo stan z kodu, leży między znacznikami
//   <!-- gen:nazwa -->  …  <!-- /gen:nazwa -->
// i jest wyliczane z kodu, app.json, package.json, docs/19 (macierz), tests/przeplywy.json, .maestro/, .github/workflows/, store/Trening.storekit.
// Wzór: scripts/flows-catalog.mjs i scripts/test-matrix.mjs (--write / --check). Bramka: `npm run check:readme` (część `npm run verify`)
// i tests/readme.test.ts (brak liczb poza znacznikami, brak nazw innych aplikacji, brak danych osobowych, zgodność liczb z niezależnym obliczeniem).
// Użycie: node scripts/readme.mjs --write | --check | --list   [--readme <ścieżka>]
//   --write  uzupełnia bloki w README.md        --check  kod 1, gdy bloki są nieaktualne (kod 2: brak znacznika / zły argument)
//   --list   wypisuje nazwy bloków (JSON)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pokrycie } from './flows-catalog.mjs';
const ts = createRequire(import.meta.url)('typescript');

const root = fileURLToPath(new URL('..', import.meta.url));
const read = p => readFileSync(join(root, p), 'utf8');
const json = p => JSON.parse(read(p));
const fail = msg => { throw new Error(msg); };

/** Repozytorium GitHub (jedno miejsce; odznaki workflowów). Po przenosinach do organizacji zmienić tylko tutaj. */
export const REPO = 'lkarwowski494/trening';
/** Workflowy z odznakami stanu (muszą istnieć w .github/workflows). */
const CI_BADGES = ['tests.yml', 'e2e-ios.yml', 'ios-unsigned.yml'];

/* ---------- pliki śledzone przez git (bez git — przeszukanie katalogu) ---------- */
function trackedFiles() {
  /* 21.10.2026: przy nierozwiązanym konflikcie scalania `git ls-files` wypisuje plik raz na etap (1–3) → zdublowany wiersz drzewa w README; bez powtórzeń */
  try { return [...new Set(execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(Boolean))]; } catch { /* bez gita */ }
  const out = []; const SKIP = new Set(['node_modules', '.git', '.expo', 'ios', 'android', '.claude']); /* .claude/worktrees — kopie repo agentów */
  const walk = d => { for (const e of readdirSync(join(root, d), { withFileTypes: true })) { const p = d ? `${d}/${e.name}` : e.name; if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(p); } else out.push(p); } };
  walk(''); return out;
}
const walkFiles = (dir, re, out = []) => { for (const e of readdirSync(join(root, dir), { withFileTypes: true })) { const p = `${dir}/${e.name}`; if (e.isDirectory()) walkFiles(p, re, out); else if (re.test(e.name)) out.push(p); } return out; };

/* ---------- dane ---------- */
const app = json('app.json').expo; const pkg = json('package.json');
if (app.version !== pkg.version) fail(`wersja w app.json (${app.version}) ≠ package.json (${pkg.version})`);
const major = v => String(v).replace(/^[~^]/, '').split('.')[0];
const majMin = v => String(v).replace(/^[~^]/, '').split('.').slice(0, 2).join('.');

function langs() {
  const m = /export const LANGS = \[([^\]]*)\]/.exec(read('lib/i18n.ts')); if (!m) fail('lib/i18n.ts: brak LANGS');
  const list = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
  if (list.length !== Object.keys(app.locales).length) fail('LANGS ≠ app.json locales');
  return list.length;
}
/** Długość literału tablicowego `name = [...]` w pliku TS (bez rozwijania spreadów — spread to błąd, żeby liczba nie była zaniżona). */
function arrayLen(file, name) {
  const sf = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true); let n = -1;
  const unwrap = e => (ts.isAsExpression(e) || ts.isParenthesizedExpression(e) || ts.isSatisfiesExpression?.(e)) ? unwrap(e.expression) : e;
  const visit = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name && node.initializer) {
      const init = unwrap(node.initializer);
      if (!ts.isArrayLiteralExpression(init)) fail(`${file}: ${name} nie jest literałem tablicy`);
      if (init.elements.some(ts.isSpreadElement)) fail(`${file}: ${name} zawiera spread`);
      n = init.elements.length;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf); if (n < 0) fail(`${file}: brak ${name}`); return n;
}
const libraryCount = () => arrayLen('lib/seed.ts', 'LIB_BASE') + arrayLen('lib/catalog.generated.ts', 'CATALOG_LIB_EXTRA');

/** Przypadki testowe liczone STATYCZNIE (bez uruchamiania Jesta): wywołania test( / it( z .only/.skip/.each(…)( ; pętla z test( w środku liczy się raz. */
function staticTestCalls(files) {
  let n = 0;
  const isT = e => ts.isIdentifier(e) && (e.text === 'test' || e.text === 'it');
  const isTestCallee = e => isT(e) || (ts.isPropertyAccessExpression(e) && isT(e.expression) && ['only', 'skip', 'concurrent', 'failing'].includes(e.name.text))
    || (ts.isCallExpression(e) && ts.isPropertyAccessExpression(e.expression) && e.expression.name.text === 'each' && (isT(e.expression.expression) || (ts.isPropertyAccessExpression(e.expression.expression) && isT(e.expression.expression.expression))));
  for (const f of files) {
    const sf = ts.createSourceFile(f, read(f), ts.ScriptTarget.Latest, false, /\.tsx$/.test(f) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = node => { if (ts.isCallExpression(node) && isTestCallee(node.expression)) n++; ts.forEachChild(node, visit); };
    visit(sf);
  }
  return n;
}

function minIos() {
  if (app.ios?.deploymentTarget) return String(app.ios.deploymentTarget);
  const p = 'node_modules/expo-modules-core/ExpoModulesCore.podspec';
  if (!existsSync(join(root, p))) fail('brak node_modules (npm ci) — nie da się odczytać minimalnego iOS z bazy Expo');
  const m = /:ios\s*=>\s*'([\d.]+)'/.exec(read(p)); if (!m) fail(`${p}: brak minimum iOS`); return m[1];
}
function minWatchOs() {
  const m = /deploymentTarget:\s*'([\d.]+)'/.exec(read('targets/watch-app/expo-target.config.js')); if (!m) fail('targets/watch-app: brak deploymentTarget'); return m[1];
}
function matrixRows() {
  const d = read('docs/19-macierz-testow.md'); const out = {};
  for (const k of ['EKRAN', 'UI', 'TEKST', 'LOGIKA', 'WYMIAR']) {
    const m = new RegExp(`^\\| ${k} \\| (\\d+) \\| (\\d+) \\| (\\d+) \\|`, 'm').exec(d); if (!m) fail(`docs/19: brak wiersza ${k}`);
    out[k] = { n: +m[1], ok: +m[2], exc: +m[3] };
  }
  return out;
}
function maestro() {
  const files = readdirSync(join(root, '.maestro')).filter(f => /\.ya?ml$/.test(f) && f !== 'config.yaml');
  const listed = [...read('.maestro/config.yaml').matchAll(/^\s*-\s+(\S+\.ya?ml)\s*$/gm)].map(m => m[1]);
  for (const l of listed) if (!files.includes(l)) fail(`.maestro/config.yaml: brak pliku ${l}`);
  return { all: files.length, main: listed.length, experiments: files.length - listed.length };
}
function flows() {
  const cat = json('tests/przeplywy.json'); const by = {};
  for (const f of cat.przeplywy) by[pokrycie(f)] = (by[pokrycie(f)] ?? 0) + 1;
  return { n: cat.przeplywy.length, by };
}

/* ---------- opisy (teksty bez liczb; brakujący opis nowego katalogu / pliku / workflow = błąd, żeby README nie rozjechało się z repozytorium) ---------- */
const TOP = {
  'LICENSE': 'prawa autorskie: wszelkie prawa zastrzeżone',
  'app/': 'ekrany (expo-router): zakładki Trening, Historia, Postępy, Więcej oraz ekrany szczegółowe',
  'components/': 'trening w toku (ActiveWorkout), elementy interfejsu, kalendarz, wykresy, mapa mięśni',
  'lib/': 'logika bez interfejsu: stan i SQLite, plan, generator, statystyki, timer, kopia, tłumaczenia, dostęp i zakupy',
  'locales/': 'tłumaczenia nazw aplikacji i opisów uprawnień systemowych (na język)',
  'modules/': 'moduły natywne (Swift): przerwa z Live Activity, głos, łączność z zegarkiem',
  'targets/': 'cele Apple: widżet przerwy, aplikacja na Apple Watch i jej testy',
  'plugins/': 'wtyczki konfiguracji Expo',
  'tests/': 'testy Jest: logika, ekrany, scenariusze, macierz, niezmienniki, regresje; bramki repozytorium',
  '.maestro/': 'scenariusze E2E (Maestro, symulator iPhone) i podprzepływy',
  'scripts/': 'generatory i bramki: macierz testów, katalog przepływów, tłumaczenia, licencje, README',
  'docs/': 'dokumentacja i rejestr decyzji (po polsku), w tym dokumenty generowane z kodu',
  'site/': 'strona aplikacji: polityka prywatności i wsparcie (GitHub Pages)',
  'store/': 'konfiguracja sklepu: produkty zakupu (plik StoreKit), nazwy i lokalizacje do App Store Connect',
  'assets/': 'ikony, ekran startowy, grafiki',
  'watch-fixtures/': 'pliki wzorcowe protokołu telefon – zegarek',
  '.github/': 'workflowy GitHub Actions (testy, E2E, kompilacja, TestFlight, strona)',
  '.claude/': 'role agentów pracujących nad repozytorium',
  'CLAUDE.md': 'zasady pracy w repozytorium (obowiązują ludzi i agentów)',
  'README.md': 'ten plik (bloki liczbowe generuje scripts/readme.mjs)',
  'app.json': 'konfiguracja aplikacji Expo (wersja, języki, uprawnienia, wtyczki)',
  'package.json': 'zależności i polecenia npm; konfiguracja Jest',
  'package-lock.json': 'dokładne wersje zależności (npm ci)',
  'tsconfig.json': 'konfiguracja TypeScript',
  'eslint.config.js': 'konfiguracja ESLint (npm run lint, część verify)',
  'babel.config.js': 'konfiguracja Babel', 'metro.config.js': 'konfiguracja bundlera Metro',
  'eas.json': 'ustawienia narzędzi Expo (obraz SDK, wersja Node)',
  'jest.mutation.config.js': 'konfiguracja testów mutacyjnych', 'jest.perf.config.js': 'konfiguracja testów wydajności',
  'stryker.config.json': 'konfiguracja testów mutacyjnych (Stryker)',
  '.gitignore': 'pliki pomijane przez git',
};
const SUB = {
  'app/(tabs)': 'zakładki dolnego paska', 'app/more': 'ekrany z „Więcej”: język, kopia, import, miejsca, ustawienia, o aplikacji, licencje',
  'app/exercise': 'szczegóły ćwiczenia', 'app/history': 'szczegóły i edycja treningu z historii', 'app/template': 'edytor szablonu',
  'lib/state': 'migracje i operacje na stanie', 'lib/locales': 'słowniki tłumaczeń', 'lib/cues': 'wskazówki techniki ćwiczeń', 'lib/figures': 'sylwetki i rysunki ćwiczeń', 'lib/watch': 'protokół i model zegarka',
  'modules/rest-activity': 'przerwa jako Live Activity', 'modules/voice-cue': 'głos w słuchawkach', 'modules/watch-link': 'łączność z zegarkiem',
  'targets/rest-widget': 'widżet przerwy', 'targets/watch-app': 'aplikacja na Apple Watch', 'targets/watch-tests': 'testy zegarka', 'targets/watch-ui-tests': 'testy interfejsu zegarka',
  '.github/workflows': 'workflowy (tabela w sekcji „Status i dystrybucja”)', 'docs/research': 'research i źródła merytoryczne (własne wnioski; cudze treści na Dysku)',
  'docs/audyt-0.10': 'raporty audytu', 'docs/prompty': 'prompty pomocnicze',
};
const TREE_SUB = ['app', 'lib', 'modules', 'targets', 'docs', '.github'];
const WORKFLOW_ROLE = {
  'tests.yml': 'pełne `npm run verify` przy każdym wypchnięciu',
  'e2e-ios.yml': 'scenariusze Maestro na symulatorze iPhone',
  'ios-unsigned.yml': 'kompilacja natywna bez podpisu (sprawdzenie kodu, bez pliku do instalacji)',
  'testflight.yml': 'testy, build, podpis i wysyłka do TestFlight narzędziami Apple',
  'nightly.yml': 'noc: losowe sekwencje, testy mutacyjne, E2E na małym ekranie',
  'tests-tz.yml': 'testy w różnych strefach czasowych',
  'watch-sim.yml': 'testy aplikacji na Apple Watch na symulatorze watchOS i zrzuty',
  'pages.yml': 'publikacja strony (prywatność, wsparcie)',
  'asc-iap-localizations.yml': 'lokalizacje produktów zakupu w App Store Connect',
  'asc-metadane.yml': 'wgranie metadanych sklepu (opisy, nazwy, słowa kluczowe; 33 lokalizacje) do App Store Connect (ręcznie; podgląd domyślnie, zapis za zatwierdzeniem release)',
  'asc-zrzuty.yml': 'wgranie zrzutów ekranu sklepu (iPhone, Apple Watch; wszystkie lokalizacje) do App Store Connect (ręcznie; dry-run domyślnie, apply za zatwierdzeniem release)',
  'asc-kontrola.yml': 'kontrola ustawień App Store Connect (tylko odczyt; ręcznie; narzędzie z repozytorium narzędzi studia)',
  'store-screenshots.yml': 'zrzuty ekranu do App Store z symulatora (ręcznie)',
  'przeglad-tlumaczen.yml': 'przegląd tłumaczeń treści krytycznej przez API Anthropic (ręcznie, płatny, limit kosztu)',
  'przeklad-tlumaczen.yml': 'przekład kluczy słownika na 33 języki przez API Anthropic (ręcznie, płatny, limit 6 USD; propozycje jako artefakt)',
  'gemini-figury.yml': 'pozy figur v2 przez API Gemini (ręcznie, płatny, limit 3 USD; pilotaż, wynik jako artefakt)',
  'sprzatanie-galezi.yml': 'usuwanie gałęzi scalonych lub zatwierdzonych przez właściciela (ręcznie, podgląd domyślnie)',
};
const TRIGGERS = [['push', 'wypchnięcie'], ['pull_request', 'zgłoszenie zmian'], ['schedule', 'harmonogram'], ['workflow_dispatch', 'ręcznie'], ['workflow_call', 'wywołanie z innego workflow'], ['workflow_run', 'po innym workflow']];

/* ---------- odznaki ---------- */
const sh = s => String(s).replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_').replace(/\+/g, '%2B');
const badge = (alt, label, value, color, href, logo) => `[![${alt}](https://img.shields.io/badge/${sh(label)}-${sh(value)}-${color}?style=flat${logo ? `&logo=${logo}` : ''})](${href})`;

/* ---------- bloki ---------- */
const BLOCKS = {
  'badges-ci'() {
    const wf = readdirSync(join(root, '.github/workflows'));
    return CI_BADGES.map(f => {
      if (!wf.includes(f)) fail(`brak .github/workflows/${f}`);
      const name = /^name:\s*(.+)$/m.exec(read(`.github/workflows/${f}`))?.[1].replace(/^["']|["']$/g, '') ?? f;
      const url = `https://github.com/${REPO}/actions/workflows/${f}`;
      return `[![${name}](${url}/badge.svg)](${url})`;
    }).join('\n');
  },
  'badges-ver'() {
    return [
      badge('Wersja aplikacji', 'wersja', app.version, 'blue', 'docs/18-przekazanie.md'),
      badge('Minimalny iOS', 'iOS', `${minIos()}+`, 'black', 'https://developer.apple.com/ios/', 'apple'),
      badge('Minimalny watchOS', 'watchOS', `${minWatchOs()}+`, 'black', 'https://developer.apple.com/watchos/', 'apple'),
      badge('Expo SDK', 'Expo SDK', major(pkg.dependencies.expo), '000020', 'https://expo.dev/', 'expo'),
      badge('React Native', 'React Native', majMin(pkg.dependencies['react-native']), '61DAFB', 'https://reactnative.dev/', 'react'),
      badge('TypeScript', 'TypeScript', majMin(pkg.devDependencies.typescript), '3178C6', 'https://www.typescriptlang.org/', 'typescript'),
      badge('Baza lokalna SQLite, tryb offline', 'SQLite', 'offline', '003B57', 'https://www.sqlite.org/', 'sqlite'),
      badge('Języki interfejsu', 'języki', langs(), 'brightgreen', 'docs/16-jezyki-i-marka.md'),
      badge('Przypadki testowe liczone statycznie', 'testy (statycznie)', staticTestCalls(walkFiles('tests', /\.test\.[jt]sx?$/)), 'brightgreen', 'docs/19-macierz-testow.md'),
      badge('Scenariusze Maestro', 'scenariusze E2E', maestro().all, 'brightgreen', 'docs/37-katalog-przeplywow.md'),
    ].join('\n');
  },
  stats() {
    const mx = matrixRows(); const fl = flows(); const ma = maestro(); const testFiles = walkFiles('tests', /\.test\.[jt]sx?$/);
    const by = fl.by; const part = (k, lbl) => (by[k] ? `${lbl}: ${by[k]}` : null);
    const flowParts = [part('Maestro', 'Maestro'), part('Maestro (eksperyment)', 'Maestro, eksperymentalne'), part('Jest', 'Jest'), part('Telefon', 'lista kontrolna wydania (telefon)'), part('Projekt 0.20', 'w projekcie')].filter(Boolean).join(', ');
    const withTest = k => `${mx[k].n} (z testem: ${mx[k].ok}${mx[k].exc ? `, wyjątki: ${mx[k].exc}` : ''})`;
    const rows = [
      ['Wersja aplikacji', app.version, '`app.json`, `package.json` (docs/18)'],
      ['Minimalny iOS', minIos(), app.ios?.deploymentTarget ? '`app.json`' : 'baza Expo (`ExpoModulesCore.podspec`); tylko iPhone'],
      ['Minimalny watchOS (Apple Watch)', minWatchOs(), '`targets/watch-app/expo-target.config.js`, docs/35-zegarek-apple.md'],
      ['Platforma', `Expo SDK ${major(pkg.dependencies.expo)} · React Native ${majMin(pkg.dependencies['react-native'])} · React ${majMin(pkg.dependencies.react)} · TypeScript ${majMin(pkg.devDependencies.typescript)}`, '`package.json`'],
      ['Języki interfejsu', String(langs()), '`lib/i18n.ts` (`LANGS`), `app.json`, docs/16-jezyki-i-marka.md'],
      ['Ćwiczenia w bibliotece', String(libraryCount()), '`lib/seed.ts`, `lib/catalog.generated.ts`, docs/10-miejsca-i-sprzet.md'],
      ['Ekrany (trasy w `app/`)', withTest('EKRAN'), 'docs/19-macierz-testow.md'],
      ['Elementy UI (przyciski, pola, przełączniki)', withTest('UI'), 'docs/19-macierz-testow.md'],
      ['Komunikaty i teksty', withTest('TEKST'), 'docs/19-macierz-testow.md'],
      ['Funkcje biblioteki `lib/`', withTest('LOGIKA'), 'docs/19-macierz-testow.md'],
      ['Wymiary (listy wartości i typy-unie)', withTest('WYMIAR'), 'docs/19-macierz-testow.md'],
      ['Pliki testów Jest', String(testFiles.length), '`tests/*.test.ts(x)`, docs/09-plan-testow.md'],
      ['Przypadki testowe (statycznie)', String(staticTestCalls(testFiles)), 'wywołania `test(` i `it(` w kodzie testów, bez uruchamiania; `test.each` i pętla liczą się raz, więc liczba rzeczywistych przebiegów jest większa'],
      ['Przepływy użytkownika w katalogu E2E', `${fl.n} (${flowParts})`, 'docs/37-katalog-przeplywow.md'],
      ['Scenariusze Maestro', `${ma.all} (w głównym przebiegu: ${ma.main}, eksperymentalne: ${ma.experiments})`, '`.maestro/`, docs/38-przeplywy-i-luki-e2e.md'],
    ];
    return ['| Miara | Wartość | Źródło |', '|---|---|---|', ...rows.map(r => `| ${r[0]} | ${r[1]} | ${r[2]} |`)].join('\n');
  },
  pricing() {
    const acc = read('lib/access.ts'); const prod = read('lib/products.ts');
    const enabled = /ENABLED:\s*(true|false),/.exec(acc)?.[1]; const free = /FREE_TRAINING_DAYS_PER_MONTH:\s*(\d+)/.exec(acc)?.[1]; const grace = /OFFLINE_GRACE_DAYS:\s*(\d+)/.exec(acc)?.[1];
    if (!enabled || !free || !grace) fail('lib/access.ts: brak PAYWALL (ENABLED, FREE_TRAINING_DAYS_PER_MONTH, OFFLINE_GRACE_DAYS)');
    const kit = JSON.parse(read('store/Trening.storekit'));
    const subs = kit.subscriptionGroups.flatMap(g => g.subscriptions); const sub = p => subs.find(s => s.recurringSubscriptionPeriod === p) ?? fail(`store/Trening.storekit: brak subskrypcji ${p}`);
    const life = kit.products.find(p => p.type === 'NonConsumable') ?? fail('store/Trening.storekit: brak zakupu jednorazowego');
    const L = [];
    L.push(`Stan przełącznika płatności: \`PAYWALL.ENABLED\` = \`${enabled}\` (\`lib/access.ts\`) — ${enabled === 'true'
      ? `bez pełnej wersji można trenować na żywo do ${free} dni treningowych w miesiącu kalendarzowym (kolejny trening tego samego dnia nie zużywa limitu); zapisane wyniki, historia, kopia i eksport zostają zawsze dostępne.`
      : 'wszystkie funkcje są dostępne bez limitu, dopóki właściciel nie włączy płatności (zmiana jednej wartości i wydanie).'}`, '');
    L.push('| Plan | Rodzaj | Cena referencyjna (USD, plik `store/Trening.storekit`) |', '|---|---|---|');
    const days = p => ({ P3D: 3, P1W: 7, P2W: 14, P1M: 30, P2M: 60, P3M: 90 })[p] ?? fail(`store/Trening.storekit: nieznany okres oferty ${p}`);
    const intro = s => s.introductoryOffer?.paymentMode === 'free' ? `, pierwsze ${s.introductoryOffer.numberOfPeriods * days(s.introductoryOffer.subscriptionPeriod)} dni bezpłatnie` : '';
    L.push(`| Miesięczny | subskrypcja odnawiana co miesiąc${intro(sub('P1M'))} | ${sub('P1M').displayPrice} |`);
    L.push(`| Roczny | subskrypcja odnawiana co rok${intro(sub('P1Y'))} | ${sub('P1Y').displayPrice} |`);
    L.push(`| Dożywotni | zakup jednorazowy | ${life.displayPrice} |`, '');
    L.push(`Bez okresu próbnego (model M5 S1, 22.10.2026); karencja offline dla zapamiętanego dostępu: ${grace} dni (\`OFFLINE_GRACE_DAYS\`).`);
    return L.join('\n');
  },
  workflows() {
    const dir = '.github/workflows'; const files = readdirSync(join(root, dir)).filter(f => /\.ya?ml$/.test(f)).sort();
    const rows = files.map(f => {
      const y = read(`${dir}/${f}`); const name = /^name:\s*(.+)$/m.exec(y)?.[1].replace(/^["']|["']$/g, '') ?? f;
      const on = /^on:\s*\n((?:[ \t]+.*\n|\n)*)/m.exec(y)?.[1] ?? (/^on:\s*(.+)$/m.exec(y)?.[1] ?? '');
      const trig = TRIGGERS.filter(([k]) => new RegExp(`(^|\\s|\\[|,)${k}(\\s|:|\\]|,|$)`, 'm').test(on)).map(t => t[1]);
      const role = WORKFLOW_ROLE[f] ?? fail(`scripts/readme.mjs: dodaj opis workflow ${f} do WORKFLOW_ROLE`);
      return `| \`${f}\` | ${name} | ${trig.join(', ') || '—'} | ${role} |`;
    });
    return ['| Plik | Nazwa | Uruchamiany | Rola |', '|---|---|---|---|', ...rows].join('\n');
  },
  'verify-steps'() {
    const steps = pkg.scripts.verify.split(/\s+&&\s+/).map(s => s.trim()).filter(Boolean);
    const lines = steps.map((s, i) => {
      if (/^node -e /.test(s)) return `${i + 1}. sprzątanie katalogu tymczasowego eksportu`;
      return `${i + 1}. \`${s}\``;
    });
    return lines.join('\n');
  },
  tree() {
    const files = trackedFiles(); const L = ['```text', 'trening/'];
    const topDirs = [...new Set(files.filter(f => f.includes('/')).map(f => f.split('/')[0]))].sort();
    const topFiles = files.filter(f => !f.includes('/')).sort();
    const entries = [...topDirs.map(d => `${d}/`), ...topFiles];
    for (const e of entries) if (!TOP[e]) fail(`scripts/readme.mjs: dodaj opis "${e}" do TOP (nowy katalog lub plik w korzeniu repozytorium)`);
    const pad = Math.max(...entries.map(e => e.length), 24) + 2;
    entries.forEach((e, i) => {
      const last = i === entries.length - 1; L.push(`${last ? '└── ' : '├── '}${e.padEnd(pad)}${TOP[e]}`);
      const d = e.replace(/\/$/, '');
      if (e.endsWith('/') && TREE_SUB.includes(d)) {
        const subs = [...new Set(files.filter(f => f.startsWith(`${d}/`) && f.split('/').length > 2).map(f => f.split('/')[1]))].sort();
        const shown = subs.filter(s => SUB[`${d}/${s}`]);
        shown.forEach((s, j) => L.push(`${last ? '    ' : '│   '}${j === shown.length - 1 ? '└── ' : '├── '}${(`${s}/`).padEnd(pad - 4)}${SUB[`${d}/${s}`]}`));
      }
    });
    L.push('```');
    return L.join('\n');
  },
  'docs-index'() {
    const names = JSON.parse(read('tests/forbidden-names.json')); const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const res = [...names.names.map(n => new RegExp(`(?<![\\p{L}\\p{N}_])${esc(n)}(?:a|u|ie|iem|owi|y|ów|em|ach)?(?![\\p{L}\\p{N}_])`, 'gu')), ...names.namesAnyCase.map(n => new RegExp(`(?<![\\p{L}\\p{N}_])${esc(n)}(?:a|u|ie|iem|owi|y|ów|em|ach)?(?![\\p{L}\\p{N}_])`, 'giu'))];
    const clean = t => res.reduce((s, r) => s.replace(r, 'innej aplikacji'), t);
    const docs = readdirSync(join(root, 'docs')).filter(f => f.endsWith('.md')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    const L = [`<details><summary>Wszystkie dokumenty w <code>docs/</code> (${docs.length})</summary>`, ''];
    for (const f of docs) { const title = clean((read(`docs/${f}`).split('\n')[0] || '').replace(/^#+\s*/, '').trim()); L.push(`- [\`docs/${f}\`](docs/${f}) — ${title}`); }
    L.push('', '</details>');
    return L.join('\n');
  },
};
export const BLOCK_NAMES = Object.keys(BLOCKS);

/* ---------- składanie README ---------- */
const MARK = name => new RegExp(`(<!-- gen:${name} -->)([\\s\\S]*?)(<!-- /gen:${name} -->)`);
export function render(readme) {
  let out = readme;
  for (const name of BLOCK_NAMES) {
    const re = MARK(name); if (!re.test(out)) fail(`README.md: brak znaczników <!-- gen:${name} --> … <!-- /gen:${name} -->`);
    out = out.replace(re, (_, a, _b, c) => `${a}\n${BLOCKS[name]()}\n${c}`);
  }
  const known = [...out.matchAll(/<!-- gen:([\w-]+) -->/g)].map(m => m[1]).filter(n => !BLOCK_NAMES.includes(n));
  if (known.length) fail(`README.md: nieznane bloki generowane: ${known.join(', ')}`);
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const mode = args[0];
  const ri = args.indexOf('--readme'); const path = ri >= 0 ? args[ri + 1] : join(root, 'README.md');
  if (mode === '--list') { console.log(JSON.stringify(BLOCK_NAMES)); process.exit(0); }
  if (mode !== '--write' && mode !== '--check') { console.error('Użycie: node scripts/readme.mjs --write | --check | --list [--readme <plik>]'); process.exit(2); }
  try {
    const cur = readFileSync(path, 'utf8'); const want = render(cur);
    if (mode === '--write') { if (want !== cur) writeFileSync(path, want); console.log(`README: ${want !== cur ? 'zaktualizowano' : 'bez zmian'} (${relative(root, path) || path})`); process.exit(0); }
    if (want !== cur) { console.error('README.md nieaktualny — node scripts/readme.mjs --write'); process.exit(1); }
  } catch (e) { console.error(String(e.message || e)); process.exit(2); }
}
