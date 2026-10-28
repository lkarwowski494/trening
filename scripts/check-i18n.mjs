// Sprawdza kompletność tłumaczeń (T-040): każde t('…') / t("…") / t(`…`) / tr(…) / tp(n, …) z literałem w kodzie
// musi mieć wpis w lib/i18n.en.ts z tymi samymi parametrami {…}. Kod czytany składnią TypeScript (nie wyrażeniem regularnym), więc
// cudzysłów, szablon bez podstawień i wywołanie przez obiekt (i18n.t) są widziane tak samo jak apostrof.
// Klucz z podstawieniem (t(`a ${x}`)) i klucz sklejany (t('a' + x)) nie da się sprawdzić — to BŁĄD (użyj parametru {…}).
// Słowniki języków (lib/locales/*.json): pismo języka (09-lokalizacja-007) — w języku spoza łaciny tekst z literami bez pisma tego języka
// (np. ru z tekstem łacinką) jest błędem, chyba że jest na liście docs/lokalizacja/pismo-wyjatki.json (terminy, marki, symbole);
// w języku łacińskim błędem są litery innego pisma. Zastępuje test „liter polskich” w obcych słownikach.
// Wartości dynamiczne (partie, sprzęt, rodzaje PR…) sprawdza tests/regress.test.tsx (R39-02), bo wymagają importu modułów.
// Nieużywanych wpisów słownika skrypt nie wykrywa (część kluczy jest używana dynamicznie).
// Uruchom: node scripts/check-i18n.mjs  (kod wyjścia 1 = braki; root = katalog nad scripts/, więc test kopiuje skrypt do próbki projektu)
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ts = createRequire(import.meta.url)('typescript');
const root = fileURLToPath(new URL('..', import.meta.url)); /* runda 59: ścieżki ze spacją/ł i Windows */
const rel = p => p.replace(root, '').replace(/\\/g, '/');

const files = [];
const walk = d => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f) && !/i18n(\.en)?\.ts$/.test(f)) files.push(p); } };
['app', 'components', 'lib'].forEach(d => existsSync(join(root, d)) && walk(join(root, d)));

const isLit = n => n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n));
const calleeName = c => ts.isIdentifier(c.expression) ? c.expression.text : ts.isPropertyAccessExpression(c.expression) ? c.expression.name.text : '';

const used = new Map(), unverifiable = [];
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const where = n => `${rel(f)}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`;
  const visit = n => {
    if (ts.isCallExpression(n)) {
      const name = calleeName(n), arg = name === 'tp' ? n.arguments[1] : name === 't' || name === 'tr' ? n.arguments[0] : undefined;
      if (arg) {
        if (isLit(arg)) used.set(arg.text, f);
        else if (ts.isTemplateExpression(arg) || (ts.isBinaryExpression(arg) && arg.operatorToken.kind === ts.SyntaxKind.PlusToken && (isLit(arg.left) || ts.isTemplateExpression(arg.left)))) unverifiable.push(`${where(n)} ${name}(${arg.getText(sf).slice(0, 50)})`);
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

/* Słownik EN: właściwości obiektu EN z literałowym kluczem i wartością (apostrof, cudzysłów albo szablon bez podstawień). */
const enPath = join(root, 'lib/i18n.en.ts');
const enSf = ts.createSourceFile(enPath, readFileSync(enPath, 'utf8'), ts.ScriptTarget.Latest, true);
const dict = {};
const visitEn = n => {
  if (ts.isPropertyAssignment(n) && (isLit(n.name) || ts.isStringLiteral(n.name)) && isLit(n.initializer)) dict[n.name.text] = n.initializer.text;
  ts.forEachChild(n, visitEn);
};
visitEn(enSf);

const params = k => [...k.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
const keys = new Set(Object.keys(dict));
const missing = [...used.keys()].filter(k => !keys.has(k));
const badParams = Object.keys(dict).filter(k => params(k) !== params(dict[k]));

/* Pismo języka w słownikach lib/locales/*.json. */
const SCRIPT = { bg: ['Cyrillic'], ru: ['Cyrillic'], uk: ['Cyrillic'], sr: ['Cyrillic', 'Latin'], el: ['Greek'], ja: ['Han', 'Hiragana', 'Katakana'], ko: ['Hangul', 'Han'], 'zh-Hant': ['Han'] };
const OTHER = ['Cyrillic', 'Greek', 'Han', 'Hiragana', 'Katakana', 'Hangul', 'Arabic', 'Hebrew', 'Thai', 'Devanagari'];
const reScript = list => new RegExp(list.map(s => `\\p{Script=${s}}`).join('|'), 'u');
export function bledyPisma(lang, dictionary, wyjatki = []) {
  const ok = new Set(wyjatki), bad = [];
  const own = SCRIPT[lang];
  for (const [k, v] of Object.entries(dictionary)) {
    if (typeof v !== 'string' || ok.has(v)) continue;
    const letters = v.replace(/\{\w+\}/g, ' ').match(/\p{L}/gu) || [];
    if (!letters.length) continue;
    if (own) { const re = reScript(own); if (!letters.some(c => re.test(c))) bad.push(`${lang} „${k.slice(0, 40)}” → „${v.slice(0, 50)}”: brak liter pisma języka`); }
    else { const re = reScript(OTHER); const x = letters.find(c => re.test(c)); if (x) bad.push(`${lang} „${k.slice(0, 40)}” → „${v.slice(0, 50)}”: litery obcego pisma (${x})`); }
  }
  return bad;
}
const localesDir = join(root, 'lib/locales');
const scriptErrors = [];
if (existsSync(localesDir)) {
  const exPath = join(root, 'docs/lokalizacja/pismo-wyjatki.json');
  const wyjatki = existsSync(exPath) ? JSON.parse(readFileSync(exPath, 'utf8')).wartosci ?? [] : [];
  for (const f of readdirSync(localesDir)) if (/^[A-Za-z]{2,3}(-[A-Za-z0-9]+)*\.json$/.test(f)) scriptErrors.push(...bledyPisma(f.slice(0, -5), JSON.parse(readFileSync(join(localesDir, f), 'utf8')), wyjatki));
}

console.log(`i18n: ${used.size} tekstów w kodzie, ${keys.size} w słowniku EN`);
if (missing.length) console.log('BRAK tłumaczenia:\n' + missing.map(k => `  '${k}'  (${rel(used.get(k))})`).join('\n'));
if (unverifiable.length) console.log('Klucz nie do sprawdzenia (podstawienie albo sklejanie zamiast parametru {…}):\n' + unverifiable.map(k => '  ' + k).join('\n'));
if (badParams.length) console.log('Różne parametry {…} w PL i EN:\n' + badParams.map(k => '  ' + k).join('\n'));
if (scriptErrors.length) console.log('Pismo języka w słownikach (lib/locales):\n' + scriptErrors.map(k => '  ' + k).join('\n'));
process.exit(missing.length || badParams.length || unverifiable.length || scriptErrors.length ? 1 : 0);
