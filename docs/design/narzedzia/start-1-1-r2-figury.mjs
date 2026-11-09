// start-1-1-r2-figury.mjs — klatki prawdziwych figur v2 (te same funkcje co components/ExerciseFigureV2.tsx) do makiet rundy 2 ekranu startowego.
// Użycie (bez zależności aplikacji w runtime, tylko tsc z node_modules):
//   node_modules/.bin/tsc --ignoreConfig lib/figures/v2/index.ts lib/tokens.ts --outDir <tmp> --rootDir . --module commonjs --target es2020 \
//     --resolveJsonModule --esModuleInterop --skipLibCheck --noEmitOnError false --types node
//   (+ kopia plików lib/**/*.json do <tmp>/lib — require() w runtime)
//   node docs/design/narzedzia/start-1-1-r2-figury.mjs <tmp> docs/design/kierunki/start-1-1-r2-figury.js
// Kolory: role palety figury → zmienne CSS --f-<rola>, wartości z figurePalette(lib/tokens.ts light/dark) — w pliku jako dwa zestawy.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const [dir, out] = process.argv.slice(2);
const req = createRequire(resolve(dir) + '/');
const f = req('./lib/figures/v2/index.js');
const tok = req('./lib/tokens.js');
const { CATALOG } = req('./lib/catalog.generated.js');
const N = 20; // klatek na pół pętli (u 0 → 1); odtwarzanie wahadłowe tempem uAt() w start-1-1-r2.js
const KEYS = ['Back Squat', 'Deadlift (sztanga)', 'Bench Press (sztanga)'];
const roles = Object.keys(f.figurePalette(tok.dark));
const varPal = Object.fromEntries(roles.map((r) => [r, `var(--f-${r})`]));
const r1 = (n) => Math.round(n * 10) / 10;
const ex = {};
for (const key of KEYS) {
  const spec = f.shownFigureSpec(key);
  if (!spec) throw new Error('brak figury v2 (rodzina nie gotowa): ' + key);
  const view = 'side';
  const box = f.boxFor(spec, view, []);
  const frames = [];
  for (let i = 0; i < N; i++) frames.push(f.svgInner(f.shapesAt(spec, i / (N - 1), view, false), varPal).replace(/(\d+)\.\d+/g, (m) => String(Math.round(+m * 10) / 10)));
  const trail = f.trailFor ? f.svgInner(f.trailFor(spec, view), varPal).replace(/(\d+)\.\d+/g, (m) => String(Math.round(+m * 10) / 10)) : '';
  ex[key] = { trail, family: spec.family, lowerFirst: spec.lowerFirst, box: { x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h) }, frames };
}
const shown = Object.keys(CATALOG).filter((k) => { try { return !!f.shownFigureSpec(k); } catch { return false; } }).length;
const pal = (th) => Object.fromEntries(Object.entries(f.figurePalette(th)).map(([k, v]) => [`--f-${k}`, v]));
const data = { generated: '05.11.2026', shownCount: shown, catalogCount: Object.keys(CATALOG).length, tempo: f.TEMPO, palette: { light: pal(tok.light), dark: pal(tok.dark), lightHC: pal(tok.lightHC), darkHC: pal(tok.darkHC) }, ex };
writeFileSync(out, '/* wygenerowane: docs/design/narzedzia/start-1-1-r2-figury.mjs — nie edytować ręcznie */\nwindow.FIG = ' + JSON.stringify(data) + ';\n');
console.log(out, 'figury z ruchem w katalogu:', shown, 'katalog:', data.catalogCount, 'rozmiar kB:', Math.round(JSON.stringify(data).length / 1024));
