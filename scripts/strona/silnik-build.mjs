// Silnik figur v2 dla przeglądarki (strona z biblioteką ćwiczeń, opcja „ten sam kod”): transpiluje do modułów ES wyłącznie to, co potrzebne do narysowania pozy
// z próbek klatek (figury.json): math, skeleton, scene, draw, render, anim — bez rigów rodzin, wariantów, katalogu (340 KB), mięśni, walidacji kontraktu i koliderów
// (te działają w testach aplikacji i przy eksporcie). Wyjście: <out>/silnik/*.js + MANIFEST.json (wersja, commit).
// Użycie: node scripts/strona/silnik-build.mjs --out <katalog> [--no-min] [--commit <sha>]
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { repoRoot } from './ts-loader.mjs';

const req = createRequire(import.meta.url);
/** Moduły silnika wysyłane do przeglądarki (ścieżki względem lib/figures/v2, bez .ts). */
export const MODULES = ['math', 'skeleton', 'scene', 'draw', 'render', 'anim'];
const gitCommit = () => { try { return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim(); } catch { return 'unknown'; } };
/** `from './x'` → `from './x.js'` (moduły ES w przeglądarce wymagają rozszerzenia). */
export const esmSpecifiers = js => js.replace(/(from\s*['"])(\.{1,2}\/[^'"]+)(['"])/g, (_m, a, p, c) => `${a}${p}.js${c}`);

export async function buildEngine({ out, min = true, commit = process.env.ATLAS_COMMIT || gitCommit() }) {
  const ts = req(join(repoRoot, 'node_modules/typescript'));
  const terser = min ? req(join(repoRoot, 'node_modules/terser')) : null;
  const dir = join(out, 'silnik'); rmSync(dir, { recursive: true, force: true });
  const files = [];
  const emit = async (rel, code) => {
    if (terser) code = (await terser.minify(code, { module: true, compress: { passes: 2 }, mangle: true, format: { comments: false } })).code + '\n';
    const f = join(dir, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, code); files.push(rel);
  };
  for (const m of MODULES) {
    const src = readFileSync(join(repoRoot, 'lib/figures/v2', `${m}.ts`), 'utf8');
    const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 } }).outputText;
    await emit(`${m}.js`, esmSpecifiers(js));
  }
  mkdirSync(dir, { recursive: true });
  const entry = readFileSync(new URL('./figura.entry.js', import.meta.url), 'utf8');
  await emit('figura.js', entry);
  files.sort();
  const app = JSON.parse(readFileSync(join(repoRoot, 'app.json'), 'utf8')).expo;
  writeFileSync(join(dir, 'MANIFEST.json'), JSON.stringify({ app: { version: app.version, commit }, minified: !!terser, files }, null, 1) + '\n');
  return { dir, files };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
  const a = process.argv.slice(2), arg = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : undefined; };
  const out = arg('--out'); if (!out) { console.error('użycie: node scripts/strona/silnik-build.mjs --out <katalog> [--no-min] [--commit <sha>]'); process.exit(2); }
  const r = await buildEngine({ out, min: !a.includes('--no-min'), ...(arg('--commit') ? { commit: arg('--commit') } : {}) });
  console.log(`silnik: ${r.files.length} plików → ${r.dir}`);
}
