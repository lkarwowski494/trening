// Szybki cykl w trakcie pracy (decyzja właściciela 11.10.2026, wariant B): tylko testy związane ze zmienionymi plikami
// (jest --findRelatedTests), wynik bez szczegółów udanych testów. Pełne `npm run verify` zostaje przed wypchnięciem.
// Użycie: npm run test:fast            — zmiany względem HEAD (z nieśledzonymi)
//         npm run test:fast -- <ref>  — zmiany względem gałęzi/commitu, np. origin/feature/e2-swap
//         node scripts/test-fast.mjs --od-bazy — (verify:szybkie, decyzja właściciela 03.11.2026) zmiany względem wspólnego przodka HEAD z origin/integracja-1-1 albo origin/main
//                                         (bliższego), czyli cała gałąź funkcji, nie tylko niezacommitowane; bez żadnej z tych gałęzi — względem HEAD
//         node scripts/test-fast.mjs --plan [<ref>] — tylko wypisuje plan (JSON), bez uruchamiania Jesta; TEST_FAST_CHANGED (pliki rozdzielone
//                                         znakiem nowej linii) zastępuje odczyt z gita — do testów
// M1-audytor-generalny-059: Jest uruchamiany przez node i plik jest.js (uruchamianie przez npx kończyło się ENOENT na Windows, gdzie jest npx.cmd);
// scenariusze Maestro (.maestro/*.yaml) nie mają powiązania importami, więc ich zmiana dodaje tests/maestro-flows.test.tsx.
import { execSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { testyCzytajace, testyUruchamiajaceSkrypty } from './testy-dla-plikow.mjs';
const args = process.argv.slice(2); const planOnly = args.includes('--plan');
const odBazy = args.includes('--od-bazy');
const sh = c => execSync(c, { encoding: 'utf8' }).split('\n').map(s => s.trim()).filter(Boolean);
const probuj = c => { try { return execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };
/** Bliższa baza gałęzi: wspólny przodek HEAD z origin/integracja-1-1 albo origin/main (mniej commitów do HEAD wygrywa). */
function bazaGalezi() {
  const kandydaci = ['origin/integracja-1-1', 'origin/main'].map(r => probuj(`git merge-base HEAD ${r}`)).filter(Boolean)
    .map(sha => ({ sha, n: Number(probuj(`git rev-list --count ${sha}..HEAD`)) }));
  return kandydaci.sort((a, b) => a.n - b.n)[0]?.sha ?? probuj('git rev-parse HEAD');
}
const ref = (odBazy ? bazaGalezi() : args.find(a => !a.startsWith('--'))) || 'HEAD';
const changed = process.env.TEST_FAST_CHANGED !== undefined ? process.env.TEST_FAST_CHANGED.split('\n').map(s => s.trim()).filter(Boolean)
  : [...sh(`git diff --name-only ${ref}`), ...sh('git ls-files --others --exclude-standard')];
const files = [...new Set(changed)].filter(f => /\.(tsx?|jsx?|json|ya?ml)$/.test(f) && !f.startsWith('docs/'));
if (files.some(f => /^\.maestro\/.+\.ya?ml$/.test(f)) && !files.includes('tests/maestro-flows.test.tsx')) files.push('tests/maestro-flows.test.tsx');
// 1.0.1 (lekcja po czerwonym tests.yml bfca98c): testy plików generowanych ze słowników (InfoPlist zegarka, widżet, zgody Zdrowia) czytają je z dysku, nie przez import —
// --findRelatedTests ich nie znajduje. Zmiana słownika (tłumaczeń) dodaje je ręcznie.
const OD_SLOWNIKA = ['tests/watch-apple-i18n.test.ts', 'tests/widget-i18n.test.ts', 'tests/health-permissions.test.ts', 'tests/i18n-locales.test.ts'];
if (files.some(f => /^(lib\/locales\/|locales\/|lib\/i18n\.en\.ts$)/.test(f))) for (const t of OD_SLOWNIKA) if (!files.includes(t)) files.push(t);
// L-100 (ZB-041 G5, 04.11.2026): testy czytające dokumenty i dane przez fs (docs/**, docs/research/**, tests/fixtures/**, lib/cues/**, docs/lokalizacja/**…) nie mają importu,
// więc --findRelatedTests ich nie znajduje. Każdy zmieniony plik niebędący kodem dokłada testy, których źródło go wymienia (ścieżka, nazwa dokumentu, katalog przeglądany
// albo budujący ścieżki) — wspólny wybór z verify:docs: scripts/testy-dla-plikow.mjs. Zmiana kodu (.ts/.tsx/.js/.jsx) nadal tylko przez graf importów.
const czytajace = testyCzytajace([...new Set(changed)].filter(f => !/\.(tsx?|jsx?|mjs|cjs)$/.test(f)), resolve(dirname(fileURLToPath(import.meta.url)), '..'));
// L-104 (04.11.2026): test uruchamiający skrypt repo dziedziczy zależności skryptu (importy rekurencyjnie + czytane pliki), także gdy zmienił się kod (.ts/.mjs) — scripts/testy-dla-plikow.mjs
const korzen = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const t of [...czytajace, ...testyUruchamiajaceSkrypty([...new Set(changed)], korzen)]) if (!files.includes(t)) files.push(t);
const jestBin = join(dirname(createRequire(import.meta.url).resolve('jest/package.json')), 'bin', 'jest.js');
const command = process.execPath; const jestArgs = [jestBin, '--findRelatedTests', ...files, '--silent', '--reporters=summary'];
if (planOnly) { console.log(JSON.stringify({ command, args: jestArgs, files, baza: ref })); process.exit(0); }
if (!files.length) { console.log('test:fast — brak zmienionych plików kodu względem', ref); process.exit(0); }
console.log(`test:fast — ${files.length} plików względem ${ref}`);
// ZB-041 G8: przez jest-ponow (jedno ponowienie plików przerwanych z zewnątrz albo padłych tylko na limicie czasu testu); wybór testów jak w planie
const r = spawnSync(command, [join(dirname(fileURLToPath(import.meta.url)), 'jest-ponow.mjs'), ...jestArgs.slice(1)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
