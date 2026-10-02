// Sprawdza kompletność tłumaczeń (T-040): każde t('…') / tr('…') / tp(n, '…') z literałem w kodzie
// musi mieć wpis w lib/i18n.en.ts z tymi samymi parametrami {…}.
// Wartości dynamiczne (partie, sprzęt, rodzaje PR…) sprawdza tests/regress.test.tsx (R39-02), bo wymagają importu modułów.
// Nieużywanych wpisów słownika skrypt nie wykrywa (część kluczy jest używana dynamicznie).
// Uruchom: node scripts/check-i18n.mjs  (kod wyjścia 1 = braki)
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url)); /* runda 59: ścieżki ze spacją/ł i Windows */
const files = [];
const walk = d => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f) && !/i18n(\.en)?\.ts$/.test(f)) files.push(p); } };
['app', 'components', 'lib'].forEach(d => walk(join(root, d)));

const unq = s => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
const used = new Map();
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\b(?:t|tr)\(\s*'((?:[^'\\]|\\.)*)'/g)) used.set(unq(m[1]), f);
  for (const m of src.matchAll(/\btp\([^,]+,\s*'((?:[^'\\]|\\.)*)'/g)) used.set(unq(m[1]), f);
}
const dictSrc = readFileSync(join(root, 'lib/i18n.en.ts'), 'utf8');
const params = k => [...k.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
const dict = Object.fromEntries([...dictSrc.matchAll(/'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'/g)].map(m => [unq(m[1]), unq(m[2])]));
const keys = new Set(Object.keys(dict));
const missing = [...used.keys()].filter(k => !keys.has(k));
const badParams = Object.keys(dict).filter(k => params(k) !== params(dict[k]));
console.log(`i18n: ${used.size} tekstów w kodzie, ${keys.size} w słowniku EN`);
if (missing.length) console.log('BRAK tłumaczenia:\n' + missing.map(k => `  '${k}'  (${used.get(k).replace(root, '')})`).join('\n'));
if (badParams.length) console.log('Różne parametry {…} w PL i EN:\n' + badParams.map(k => '  ' + k).join('\n'));
process.exit(missing.length || badParams.length ? 1 : 0);
