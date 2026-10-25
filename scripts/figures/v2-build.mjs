// Narzędzie deweloperskie figur v2: transpiluje lib/figures/v2/**/*.ts (+ lib/tokens.ts) do CJS w katalogu tymczasowym, żeby skrypty
// (podgląd, generator dokumentu) mogły używać silnika bez Jesta. Użycie: import { loadV2 } from './v2-build.mjs'; const v2 = await loadV2(outDir).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const req = createRequire(import.meta.url);
const ts = req(path.join(root, 'node_modules', 'typescript'));

const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

/** Transpiluje pliki do outDir (zachowując układ katalogów względem korzenia repo) i zwraca moduły: { v2: lib/figures/v2/index, tokens: lib/tokens }. */
export function loadV2(outDir) {
  const files = [...walk(path.join(root, 'lib', 'figures', 'v2')).filter(f => f.endsWith('.ts')), path.join(root, 'lib', 'tokens.ts'),
    ...(fs.existsSync(path.join(root, 'lib', 'catalog.generated.ts')) ? [path.join(root, 'lib', 'catalog.generated.ts')] : [])];
  for (const f of files) {
    const rel = path.relative(root, f).replace(/\.ts$/, '.js'); const out = path.join(outDir, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const js = ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
    fs.writeFileSync(out, js);
  }
  fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"commonjs"}');
  const r = createRequire(path.join(outDir, 'x.js'));
  return { v2: r('./lib/figures/v2/index.js'), tokens: r('./lib/tokens.js'), catalog: fs.existsSync(path.join(outDir, 'lib/catalog.generated.js')) ? r('./lib/catalog.generated.js') : null };
}
