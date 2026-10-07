// Macierz testów (polecenie właściciela 06.10.2026: „pełen matrix możliwości … uzupełniane przy każdej kolejnej zmianie”).
// Inwentarz jest generowany z kodu — nie przepisywany ręcznie (CLAUDE.md: dokumenty z kodu, wzór gen.mjs --check):
//   EKRAN   — każda trasa w app/ (pokrycie: test otwiera trasę: go('/…') / renderApp({ route }) / ścieżka w teście),
//   UI      — każdy element, który użytkownik może nacisnąć lub wypełnić (Btn/Item/Chip/SwitchRow/Field/Segmented/NumInput/
//             accessibilityLabel z t()/tr()): pokrycie — tekst (część stała przed pierwszym „{”) występuje w teście,
//   LOGIKA  — każda eksportowana funkcja z lib/: pokrycie — nazwa użyta w teście,
//   WYMIAR  — listy wartości (metryki, typy serii, jednostki, języki, motywy, sprzęt, presety…): pokrycie — test macierzowy
//             iteruje po stałej (tests/matrix-*.test.ts*), więc każda nowa wartość jest testowana automatycznie.
// Wyjątki tylko z powodem: tests/matrix-exceptions.json ({ "id": "powód" }). Wyjątek, który ma już test, też jest błędem (do usunięcia).
// Użycie: node scripts/test-matrix.mjs --write  (docs/19-macierz-testow.md) | --check (verify: braki albo nieaktualny dokument → kod 1)
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));
const rel = p => relative(root, p).split('\\').join('/');
const walk = (d, re, out = []) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p, re, out); else if (re.test(f)) out.push(p); } return out; };
const read = p => readFileSync(p, 'utf8');
const unq = s => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');

/* Tylko pliki śledzone przez git (06.10.2026): dokument i bramka liczą to samo, co zobaczy CI — pliki testów w trakcie pisania (nieśledzone) nie zmieniają wyniku.
 * Nowy plik testów trzeba dodać do gita (git add) przed --write. Bez gita (np. paczka źródeł) — wszystkie pliki. */
let tracked = null; try { tracked = new Set(execFileSync('git', ['ls-files', 'tests', '.maestro'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean)); } catch { tracked = null; }
const isTracked = f => !tracked || tracked.has(rel(f));
const testFiles = walk(join(root, 'tests'), /\.(ts|tsx)$/).filter(f => !/matrix-gate\.test/.test(f) && isTracked(f));
const tests = testFiles.map(f => ({ f: rel(f), src: read(f) }));
const maestro = walk(join(root, '.maestro'), /\.ya?ml$/).filter(isTracked).map(f => ({ f: rel(f), src: read(f) }));
const evidence = (pred, pool = tests) => pool.filter(t => pred(t.src)).map(t => t.f);

const items = [];
const add = (kind, id, where, covered, extra = '') => items.push({ kind, id, where, covered, extra });

/* ---------- EKRAN ---------- */
for (const f of walk(join(root, 'app'), /\.tsx$/)) {
  const r = rel(f).replace(/^app\//, '').replace(/\.tsx$/, '');
  if (/(^|\/)(_layout|_sitemap|\+not-found)$/.test(r)) continue;
  const route = '/' + r.replace(/\(tabs\)\/?/, '').replace(/(^|\/)index$/, '').replace(/\[\w+\]/g, '');
  const stem = route.replace(/\/+$/, '') || '/';
  const pat = stem === '/' ? /renderApp\(|go\('\/'\)/ : new RegExp(`['"\`]${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"\`/?]|\\$\\{)`);
  add('EKRAN', stem, rel(f), evidence(s => pat.test(s)));
}

/* ---------- UI ---------- */
const uiRe = /\b(?:title|label|accessibilityLabel|detail|placeholder)=\{\s*(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'|<(?:Btn|Item|Chip|SwitchRow|Field|Segmented)\b[^>]*?\b(?:title|label)=\{\s*(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g;
const segRe = /\{\s*(?:value|v)\s*:\s*'[^']*'\s*,\s*label\s*:\s*(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g;
const ui = new Map();
for (const f of [...walk(join(root, 'app'), /\.tsx$/), ...walk(join(root, 'components'), /\.tsx$/)]) {
  const src = read(f);
  for (const m of src.matchAll(uiRe)) { const k = unq(m[1] ?? m[2]); if (!ui.has(k)) ui.set(k, rel(f)); }
  for (const m of src.matchAll(segRe)) { const k = unq(m[1]); if (!ui.has(k)) ui.set(k, rel(f)); }
  /* przyciski alertów ({ text: t('Usuń') }) i opcje menu akcji (tablice etykiet przekazywane do ActionSheet) */
  for (const m of src.matchAll(/\btext\s*:\s*(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g)) { const k = unq(m[1]); if (!ui.has(k)) ui.set(k, rel(f)); }
  for (const m of src.matchAll(/\b(?:labels|options)\s*(?:=|:)\s*\[([^\]]*)\]/g)) for (const n of m[1].matchAll(/\b(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g)) { const k = unq(n[1]); if (!ui.has(k)) ui.set(k, rel(f)); }
}
/* TEKST — każdy pozostały komunikat w UI (t/tr/tp z literałem): pokrycie — test sprawdza, że się pokazuje (tekst w teście) */
const txt = new Map();
for (const f of [...walk(join(root, 'app'), /\.tsx$/), ...walk(join(root, 'components'), /\.tsx$/), ...walk(join(root, 'lib'), /\.ts$/).filter(f => !/i18n(\.en)?\.ts$|locales/.test(f))]) {
  const src = read(f);
  for (const m of src.matchAll(/\b(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g)) { const k = unq(m[1]); if (!ui.has(k) && !txt.has(k)) txt.set(k, rel(f)); }
}
/** Część stała tekstu: najdłuższy fragment bez {parametrów} (min. 3 znaki) — test z konkretną wartością też ją zawiera. */
/** Tekst zapisany w teście jako wyrażenie regularne (/Usuń serię \\(1\\)/) też się liczy. */
const rxEsc = s => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const stable = k => k.split(/\{\w+\}/).map(s => s.trim()).sort((a, b) => b.length - a.length)[0] ?? '';
for (const [k, where] of [...ui].sort((a, b) => a[0].localeCompare(b[0], 'pl'))) {
  const s = stable(k);
  if (s.length < 2) { add('UI', k, where, ['(tylko parametry — pokrycie przez test ekranu)']); continue; }
  add('UI', k, where, [...evidence(x => x.includes(s) || x.includes(rxEsc(s))), ...evidence(x => x.includes(s), maestro)]);
}

for (const [k, where] of [...txt].sort((a, b) => a[0].localeCompare(b[0], 'pl'))) {
  const s = stable(k);
  if (s.length < 2) { add('TEKST', k, where, ['(tylko parametry)']); continue; }
  add('TEKST', k, where, [...evidence(x => x.includes(s)), ...evidence(x => x.includes(s), maestro)]);
}

/* ---------- LOGIKA ---------- */
for (const f of walk(join(root, 'lib'), /\.ts$/)) {
  const r = rel(f); if (/i18n\.en\.ts$|locales\//.test(r)) continue;
  const src = read(f);
  for (const m of src.matchAll(/^export\s+(?:async\s+)?(?:function\s+(\w+)|const\s+(\w+)\s*(?::[^=]+)?=\s*(?:\([^)]*\)|\w+)\s*(?::[^=]+)?=>)/gm)) {
    const n = m[1] ?? m[2]; const re = new RegExp(`\\b${n}\\b`);
    add('LOGIKA', `${r.replace(/^lib\//, '').replace(/\.ts$/, '')}.${n}`, r, evidence(s => re.test(s)));
  }
}

/* ---------- WYMIAR ---------- */
const DIMS = [
  ['metryki ćwiczeń', 'METRICS', 'lib/seed.ts'], ['typy serii', 'SET_KINDS', 'lib/seed.ts'], ['partie mięśniowe', 'MUSCLES', 'lib/seed.ts'],
  ['języki', 'LANGS', 'lib/i18n.ts'], ['jednostki kg/lb', 'UNITS', 'tests/matrix-dimensions.test.tsx'], ['motywy', 'THEMES', 'tests/matrix-dimensions.test.tsx'],
  ['pozycje sprzętu', 'EQUIPMENT', 'lib/equipment.ts'], ['presety miejsc', 'LOCATION_PRESETS', 'lib/equipment.ts'], ['presety modeli ciężarów', 'LOAD_PRESETS', 'lib/equipment.ts'],
  ['widoki treningu', 'WORKOUT_VIEWS', 'lib/seed.ts'], ['kolory talerzy (IWF)', 'IWF_DISC', 'lib/plates.ts'],
  ['ćwiczenia z katalogu', 'katalog (seedState().exercises)', 'lib/seed.ts'],
];
const dimTests = tests.filter(t => /^tests\/matrix-/.test(t.f));
for (const [name, c, where] of DIMS) {
  const key = c.split(' ')[0];
  add('WYMIAR', `${name} (${c})`, where, dimTests.filter(t => t.src.includes(`@matrix ${key}`)).map(t => t.f));
}

/* ---------- wyjątki i wynik ---------- */
const exPath = join(root, 'tests/matrix-exceptions.json');
const exc = existsSync(exPath) ? JSON.parse(read(exPath)) : {};
const keyOf = it => `${it.kind}:${it.id}`;
const ids = new Set(items.map(keyOf));
const missing = items.filter(it => !it.covered.length && !exc[keyOf(it)]);
const stale = Object.keys(exc).filter(k => !ids.has(k) || items.find(it => keyOf(it) === k)?.covered.length);

const kinds = ['EKRAN', 'UI', 'TEKST', 'LOGIKA', 'WYMIAR'];
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
let md = `# 19. Macierz testów (generowana)\n\n` +
  `Plik generuje \`node scripts/test-matrix.mjs --write\` z kodu i testów — nie edytuj ręcznie. \`npm run verify\` uruchamia \`--check\`:\n` +
  `nowy ekran, przycisk, pole, funkcja albo wartość wymiaru bez testu blokuje commit (polecenie właściciela 06.10.2026).\n` +
  `Wyjątki tylko z powodem w \`tests/matrix-exceptions.json\`. Pokrycie UI = tekst elementu występuje w teście (Jest albo Maestro);\n` +
  `to warunek konieczny, nie dowód — przepływy i logikę sprawdzają testy scenariuszowe (docs/09, sekcja „Macierz testów”).\n\n` +
  `| Rodzaj | Pozycji | Z testem | Wyjątki |\n|---|---|---|---|\n` +
  kinds.map(k => { const a = items.filter(i => i.kind === k); return `| ${k} | ${a.length} | ${a.filter(i => i.covered.length).length} | ${a.filter(i => !i.covered.length && exc[keyOf(i)]).length} |`; }).join('\n') + '\n';
for (const k of kinds) {
  md += `\n## ${k}\n\n| Pozycja | Źródło | Testy (pierwsze 3) |\n|---|---|---|\n`;
  for (const it of items.filter(i => i.kind === k)) md += `| ${cell(it.id)} | ${it.where} | ${it.covered.length ? cell(it.covered.slice(0, 3).join(', ') + (it.covered.length > 3 ? ` +${it.covered.length - 3}` : '')) : 'WYJĄTEK: ' + cell(exc[keyOf(it)] ?? 'BRAK')} |\n`;
}
const docPath = join(root, 'docs/19-macierz-testow.md');
const mode = process.argv[2];
if (mode === '--write') writeFileSync(docPath, md);
if (mode === '--list') { for (const it of missing) console.log(`${keyOf(it)}\t${it.where}`); process.exit(0); }
const docOk = existsSync(docPath) && read(docPath) === md;
console.log(`macierz: ${items.length} pozycji (${kinds.map(k => `${k} ${items.filter(i => i.kind === k).length}`).join(', ')}), bez testu: ${missing.length}, nieaktualne wyjątki: ${stale.length}`);
if (missing.length) console.log('BEZ TESTU:\n' + missing.slice(0, 80).map(it => `  ${keyOf(it)}  (${it.where})`).join('\n') + (missing.length > 80 ? `\n  … +${missing.length - 80}` : ''));
if (stale.length) console.log('Wyjątki do usunięcia (mają test albo pozycja zniknęła):\n' + stale.map(k => '  ' + k).join('\n'));
if (mode === '--check' && !docOk) console.log('docs/19-macierz-testow.md nieaktualny — uruchom: node scripts/test-matrix.mjs --write');
process.exit(missing.length || stale.length || (mode === '--check' && !docOk) ? 1 : 0);
