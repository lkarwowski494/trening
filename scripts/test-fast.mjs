// Szybki cykl w trakcie pracy (decyzja właściciela 11.10.2026, wariant B): tylko testy związane ze zmienionymi plikami
// (jest --findRelatedTests), wynik bez szczegółów udanych testów. Pełne `npm run verify` zostaje przed wypchnięciem.
// Użycie: npm run test:fast            — zmiany względem HEAD (z nieśledzonymi)
//         npm run test:fast -- <ref>  — zmiany względem gałęzi/commitu, np. origin/feature/e2-swap
import { execSync, spawnSync } from 'node:child_process';
const ref = process.argv[2] || 'HEAD';
const sh = c => execSync(c, { encoding: 'utf8' }).split('\n').filter(Boolean);
const files = [...new Set([...sh(`git diff --name-only ${ref}`), ...sh('git ls-files --others --exclude-standard')])]
  .filter(f => /\.(tsx?|jsx?|json|ya?ml)$/.test(f) && !f.startsWith('docs/'));
if (!files.length) { console.log('test:fast — brak zmienionych plików kodu względem', ref); process.exit(0); }
console.log(`test:fast — ${files.length} plików względem ${ref}`);
const r = spawnSync('npx', ['jest', '--findRelatedTests', ...files, '--silent', '--reporters=summary'], { stdio: 'inherit' });
process.exit(r.status ?? 1);
