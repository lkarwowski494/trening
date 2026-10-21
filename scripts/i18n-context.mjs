// Plik kontekstu tłumaczeń (M1-audytor-generalny-066, DEC-20): dla każdego krótkiego klucza słownika (≤ 20 znaków) — gdzie jest użyty (plik:linia z t()/tr()/tp()),
// żeby tłumacz widział, czy „Seria”, „Zrób” albo „Plan” to przycisk, nagłówek czy etykieta pola. Klucze użyte dynamicznie (listy, etykiety w danych) dostają wpis
// „dynamiczny”. Generowany z kodu, nie przepisywany ręcznie (wzór: gen.mjs --check).
// Uruchom: node scripts/i18n-context.mjs --write   (zapis docs/lokalizacja/konteksty.json)   |   --check (kod wyjścia 1 = nieaktualny)
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export const SHORT_MAX = 20;
const root = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(root, 'docs/lokalizacja/konteksty.json');
const files = [];
const walk = d => { for (const f of readdirSync(d).sort()) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f) && !/i18n(\.en)?\.ts$/.test(f) && !/\.generated\./.test(f)) files.push(p); } };
['app', 'components', 'lib'].forEach(d => walk(join(root, d)));
const unq = s => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
const uses = new Map();
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n'); const rel = relative(root, f).split('\\').join('/');
  lines.forEach((ln, i) => {
    for (const m of ln.matchAll(/\b(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g)) add(unq(m[1]), rel, i + 1);
    for (const m of ln.matchAll(/\btp\([^,]+,\s*'((?:[^'\\]|\\.)*)'/g)) add(unq(m[1]), rel, i + 1);
  });
}
function add(k, f, l) { const a = uses.get(k) ?? []; if (a.length < 3 && !a.some(x => x.startsWith(f + ':'))) a.push(`${f}:${l}`); uses.set(k, a); }
export function build() {
  const src = JSON.parse(readFileSync(join(root, 'lib/locales/_source.json'), 'utf8'));
  const out = {};
  for (const e of src.map(x => x.pl).filter(k => [...k].length <= SHORT_MAX).sort((a, b) => a.localeCompare(b, 'pl'))) out[e] = uses.get(e)?.join(', ') ?? 'dynamiczny (lista, etykieta albo dane w kodzie)';
  return JSON.stringify(out, null, 1) + '\n';
}
if (process.argv[1] && process.argv[1].endsWith('i18n-context.mjs')) {
  const next = build();
  if (process.argv.includes('--write')) { writeFileSync(OUT, next); console.log('zapisano docs/lokalizacja/konteksty.json'); }
  else { const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''; if (cur !== next) { console.log('docs/lokalizacja/konteksty.json nieaktualny — uruchom: node scripts/i18n-context.mjs --write'); process.exit(1); } console.log('kontekst tłumaczeń aktualny'); }
}
