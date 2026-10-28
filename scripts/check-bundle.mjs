// Strażnik paczki aplikacji (decyzja właściciela 25.10.2026, docs/18: „całkiem anonimowo”): w wyeksportowanym pakiecie (`expo export --platform ios`, verify zostawia go w
// .expo/verify-export do końca kroku) nie ma nazw źródeł ani organizacji — mimo że interfejs ich nie pokazuje, paczka nie ma ich nosić. Wzorce: lib/sources.ts
// (SOURCE_NAME_PATTERNS, jedno miejsce). Jedyny wyjątek: stare tłumaczenia kluczy z zestawu do przekładu (rodzaj „zmieniony”, docs/lokalizacja/zestaw-przekladu-*.json —
// to samo, co dopuszcza tests/zrodla-wiedzy.test.ts); wyjątek znika razem z wpisami zestawu (docs/40, rejestr ryzyk R-015).
// Pakiet to bytecode Hermes: łańcuchy są ciągłe (ASCII/UTF-8 albo UTF-16LE, bez separatorów), więc skanujemy trzy widoki bajtów (utf8, utf16le od 0 i od 1) i
// wzorzec jest bez „nie-litery przed” (w ciągłym zapisie poprzedzająca litera należy do sąsiedniego łańcucha).
// Użycie: node scripts/check-bundle.mjs [katalog-eksportu]   (domyślnie .expo/verify-export; kod 1 = znaleziono nazwy lub brak pakietu)
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';

const root = fileURLToPath(new URL('..', import.meta.url));
const require_ = createRequire(import.meta.url);

/** Wzorce z lib/sources.ts (TypeScript → CommonJS w locie, bez duplikowania listy). */
export function loadPatterns() {
  const ts = require_('typescript');
  const js = ts.transpileModule(readFileSync(join(root, 'lib/sources.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', js)(m, m.exports);
  return m.exports.SOURCE_NAME_PATTERNS;
}
/** Wyrażenie nazw (wielkość liter ma znaczenie), bez warunku „nie litera przed”. */
export const nameRegex = patterns => new RegExp(`(?:${patterns.join('|')})`, 'gu');

/** Stare tłumaczenia kluczy „zmieniony” z zestawu do przekładu, które zawierają nazwy — jedyne dozwolone. */
export function allowedStrings(re) {
  const out = new Set();
  const dir = join(root, 'docs/lokalizacja');
  const changed = new Set();
  for (const f of readdirSync(dir).filter(f => /^zestaw-przekladu-.*\.json$/.test(f))) for (const k of JSON.parse(readFileSync(join(dir, f), 'utf8')).klucze ?? []) if (k.rodzaj === 'zmieniony') changed.add(k.pl);
  const ldir = join(root, 'lib/locales');
  for (const f of readdirSync(ldir).filter(f => f.endsWith('.json') && !f.startsWith('_'))) {
    const d = JSON.parse(readFileSync(join(ldir, f), 'utf8'));
    for (const k of changed) { const v = d[k]; if (typeof v === 'string') { re.lastIndex = 0; if (re.test(v)) out.add(v); } }
  }
  return [...out].sort((a, b) => b.length - a.length);
}

/** Widoki tekstowe bajtów pliku (utf8, utf16le od 0 i od 1). */
export const views = buf => [buf.toString('utf8'), buf.toString('utf16le'), buf.subarray(1).toString('utf16le')];

/** Strażnik paczki sprawdza tylko nazwy DŁUŻSZE niż SHORT_MAX liter. Historia (trzy nawroty tej samej klasy): L-033 (skrót w długim biegu znaków) → L-039 (granica słowa z jednej strony) → drugi nawrót
 * (tests.yml 40567640699: bajty „B\\CKC.CDC<U+FFFD>j>/”, kropka i bajt nie-tekstowy) → wariant C (właściciel 28.10.2026). Przyczyna: bajtkod Hermes nie ma granic łańcuchów, więc każda
 * heurystyka granic słowa na bajtach daje przypadkowe trafienia krótkiego skrótu, rosnące z rozmiarem paczki. Skróty (≤ 4 litery: WHO, CDC, ACSM, NSCA, ISSN) sprawdza deterministycznie
 * tests/zrodla-wiedzy.test.ts w naszych źródłach tekstu (słowniki, wskazówki, sklep, literały w app/components/lib), gdzie granice słowa są pewne. Nazwy dłuższe łapiemy w ciągłym zapisie:
 * przypadkowe trafienie 5+ liter jest praktycznie niemożliwe. Odrzucone: parser tablicy łańcuchów Hermes (zależny od wersji SDK). */
export const SHORT_MAX = 4;

/** Trafienia nazw w buforze po usunięciu dozwolonych łańcuchów: [{ nazwa, kontekst }]. */
export function findNames(buf, re, allowed = []) {
  const hits = [];
  for (let text of views(buf)) {
    for (const a of allowed) if (text.includes(a)) text = text.split(a).join('\u0000');
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) { if (m[0].length <= SHORT_MAX) continue; hits.push({ nazwa: m[0], kontekst: text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).replace(/[^\p{L}\p{N} .,:;()/_-]/gu, '·') }); }
  }
  return hits;
}

const SKIP_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ttf', '.otf', '.mp3', '.mp4', '.wav', '.caf', '.aiff']);
function files(dir, out = []) {
  for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) files(p, out); else if (!SKIP_EXT.has(extname(f).toLowerCase())) out.push(p); }
  return out;
}

/** Skanuje katalog eksportu; zwraca { bundles, hits }. */
export function scanExport(dir) {
  const re = nameRegex(loadPatterns()), allowed = allowedStrings(re);
  const all = files(dir), bundles = all.filter(f => /\.(hbc|js|bundle)$/.test(f)), hits = [];
  for (const f of all) for (const h of findNames(readFileSync(f), re, allowed)) hits.push({ plik: f.slice(dir.length + 1), ...h });
  return { bundles, hits, allowed: allowed.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2] ?? join(root, '.expo/verify-export');
  if (!existsSync(dir)) { console.error(`brak katalogu eksportu: ${dir} (najpierw expo export --platform ios)`); process.exit(1); }
  const { bundles, hits, allowed } = scanExport(dir);
  if (!bundles.length) { console.error('w eksporcie nie ma pakietu JS (.hbc/.js) — strażnik nie sprawdził niczego'); process.exit(1); }
  if (hits.length) {
    const by = new Map(); for (const h of hits) by.set(`${h.plik}: ${h.nazwa}`, (by.get(`${h.plik}: ${h.nazwa}`) ?? 0) + 1);
    console.error(`W paczce są nazwy źródeł (${hits.length} trafień):`); for (const [k, n] of by) console.error(`  ${k} ×${n}`);
    for (const h of hits.slice(0, 8)) console.error(`  …${h.kontekst}…`);
    process.exit(1);
  }
  console.log(`paczka bez nazw źródeł (${bundles.length} plik(i) pakietu; dozwolonych starych tłumaczeń: ${allowed})`);
}
