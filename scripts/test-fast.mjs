// Szybki cykl w trakcie pracy (decyzja właściciela 11.10.2026, wariant B): tylko testy związane ze zmienionymi plikami
// (jest --findRelatedTests), wynik bez szczegółów udanych testów. Pełne `npm run verify` zostaje przed wypchnięciem.
// Użycie: npm run test:fast            — zmiany względem HEAD (z nieśledzonymi)
//         npm run test:fast -- <ref>  — zmiany względem gałęzi/commitu, np. origin/feature/e2-swap
//         node scripts/test-fast.mjs --plan [<ref>] — tylko wypisuje plan (JSON), bez uruchamiania Jesta; TEST_FAST_CHANGED (pliki rozdzielone
//                                         znakiem nowej linii) zastępuje odczyt z gita — do testów
// M1-audytor-generalny-059: Jest uruchamiany przez node i plik jest.js (uruchamianie przez npx kończyło się ENOENT na Windows, gdzie jest npx.cmd);
// scenariusze Maestro (.maestro/*.yaml) nie mają powiązania importami, więc ich zmiana dodaje tests/maestro-flows.test.tsx.
import { execSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
const args = process.argv.slice(2); const planOnly = args.includes('--plan');
const ref = args.find(a => !a.startsWith('--')) || 'HEAD';
const sh = c => execSync(c, { encoding: 'utf8' }).split('\n').map(s => s.trim()).filter(Boolean);
const changed = process.env.TEST_FAST_CHANGED !== undefined ? process.env.TEST_FAST_CHANGED.split('\n').map(s => s.trim()).filter(Boolean)
  : [...sh(`git diff --name-only ${ref}`), ...sh('git ls-files --others --exclude-standard')];
const files = [...new Set(changed)].filter(f => /\.(tsx?|jsx?|json|ya?ml)$/.test(f) && !f.startsWith('docs/'));
if (files.some(f => /^\.maestro\/.+\.ya?ml$/.test(f)) && !files.includes('tests/maestro-flows.test.tsx')) files.push('tests/maestro-flows.test.tsx');
const jestBin = join(dirname(createRequire(import.meta.url).resolve('jest/package.json')), 'bin', 'jest.js');
const command = process.execPath; const jestArgs = [jestBin, '--findRelatedTests', ...files, '--silent', '--reporters=summary'];
if (planOnly) { console.log(JSON.stringify({ command, args: jestArgs, files })); process.exit(0); }
if (!files.length) { console.log('test:fast — brak zmienionych plików kodu względem', ref); process.exit(0); }
console.log(`test:fast — ${files.length} plików względem ${ref}`);
const r = spawnSync(command, jestArgs, { stdio: 'inherit' });
process.exit(r.status ?? 1);
