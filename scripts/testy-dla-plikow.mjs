// Testy Jest, które CZYTAJĄ dany plik (dokument, dane) przez fs, a nie importem — jedno miejsce dla verify:docs i test:fast (ZB-041 G3 i G5, L-100, 04.11.2026).
// `--findRelatedTests` idzie tylko po grafie importów, więc test sprawdzający np. docs/51 albo docs/research/recenzje/*.json nie jest powiązany ze zmianą pliku.
// Plik pasuje do testu, gdy źródło testu wymienia: pełną ścieżkę pliku; dla dokumentów (docs/, .md) także samą nazwę (numerowane docs/NN-… także bez .md);
// katalog pliku — ale tylko wtedy, gdy test ten katalog PRZEGLĄDA (readdir/walk/glob z tą ścieżką) albo buduje z niego ścieżki (`katalog/${nazwa}`).
// Samo wspomnienie katalogu w komentarzu albo komunikacie nie liczy się (G3: nowy plik w docs/research wybierał 84–95 testów zamiast kilku).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, normalize } from 'node:path';

const LISTA = /\b(readdirSync|readdir|walk\w*|glob\w*|listFiles?\w*)\s*\(/;
/** Ścieżka katalogu w źródle testu: jako napis „a/b” albo jako kolejne argumenty join('a', 'b'). */
const wymienia = (src, katalog) => src.includes(katalog) || new RegExp(katalog.split('/').map(s => `['"\`]${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`).join(',\\s*')).test(src);
/** L-103 (04.11.2026): ciąg literałów-argumentów join/resolve, po którym idzie nazwa zmienna (szablon z ${}, identyfikator, konkatenacja, wywołanie funkcji) — katalog jako osobny argument, np.
 *  path.join(ROOT, 'lib/figures/v2/poses', `${rodzina}.json`) albo join(ROOT, 'lib', 'figures', 'v2', 'poses', nazwa). Stały plik ('a.json') i sam katalog bez nazwy nie liczą się. */
const CIAG_JOIN = /((?:'[^'\n]*'|"[^"\n]*")\s*,\s*)+(?=`[^`]*\$\{|[A-Za-z_$][\w$.]*\s*[,)+(])/g;
const katalogJakoArgument = (src, katalog) => {
  for (const m of src.matchAll(CIAG_JOIN)) {
    const sciezka = [...m[0].matchAll(/['"]([^'"]*)['"]/g)].map(x => x[1]).join('/').replace(/\/+/g, '/').replace(/^(\.\.?\/)+/, '').replace(/^\/|\/$/g, ''); // „..” z __dirname testu = korzeń repo
    if (sciezka === katalog) return true;
  }
  return false;
};
const budujeSciezki = (src, katalog) => src.includes(`${katalog}/\${`) || src.includes(`${katalog}/' +`) || src.includes(`${katalog}/" +`) || katalogJakoArgument(src, katalog);
/** Czy test czyta pliki z katalogu: buduje ścieżki z jego nazwy albo wywołuje listowanie i wymienia ten katalog. */
export const czytaKatalog = (src, katalog) => budujeSciezki(src, katalog) || (LISTA.test(src) && wymienia(src, katalog));
/** Test przegląda cały katalog docs (każdy dokument może zmienić jego wynik). */
const przegladaDocs = /(readdirSync|walk)\((path\.)?join\([^)]*['"]docs['"]/;


// L-104 (04.11.2026): test, który URUCHAMIA skrypt repo (execFileSync/spawnSync/execSync/fork/execFile/spawn ze ścieżką scripts/**, także przez zmienną albo join, albo `npm run <skrypt z package.json>`),
// dziedziczy w wyborze zależności tego skryptu: graf jego importów (rekurencyjnie) oraz pliki i katalogi, które skrypt wymienia jako ścieżki (odczyty fs, transpilacja katalogu, dane).
// Przypadek: tests/figury-sens-pokrycie.test.ts uruchamia scripts/figures/pokrycie-sensu.mjs, a ten czyta karty (lib/cues/data.json, data/zrodla/figury-sens.json) — zmiana karty nie wybierała testu.
const URUCHOMIENIE = /\b(execFileSync|spawnSync|execSync|execFile|spawn|fork)\s*\(/;
const KOD = /\.(mjs|cjs|js|jsx|ts|tsx|sh)$/;
const ROZSZERZENIA = ['', '.mjs', '.js', '.cjs', '.ts', '.tsx', '.json', '/index.mjs', '/index.js', '/index.ts'];
const statCache = new Map();
const jest = (rel, root) => {
  const k = `${root}\0${rel}`;
  if (!statCache.has(k)) { try { statCache.set(k, statSync(join(root, rel))); } catch { statCache.set(k, null); } }
  return statCache.get(k);
};
/** Wszystkie kandydackie ścieżki względem korzenia repo, jakie źródło wymienia: literały (także składniki szablonów i tokeny po spacji) i ciągi literałów w join/resolve. */
export function sciezkiZLiteralow(src) {
  const wynik = new Set();
  const dodaj = t => {
    for (const tok of String(t).split(/[\s=:;,()[\]{}<>|&]+/)) {
      const c = normalize(tok.replace(/^['"`]+|['"`]+$/g, '')).replace(/^(\.\.?\/)+/, '').replace(/^\/+|\/+$/g, '');
      if (c && c !== '.' && c !== '..' && !c.startsWith('..')) wynik.add(c);
    }
  };
  const bezJoin = src.replace(/\b(?:join|resolve)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (_, args) => {
    let bieg = [];
    const zamknij = () => { if (bieg.length) dodaj(bieg.join('/')); bieg = []; };
    for (const m of args.matchAll(/\s*(?:'([^'\n]*)'|"([^"\n]*)"|`([^`\n]*)`|([^,]+?))\s*(?:,|$)/g)) {
      const lit = m[1] ?? m[2];
      if (lit !== undefined) bieg.push(lit);
      else if (m[3] !== undefined && !m[3].includes('${')) bieg.push(m[3]);
      else { if (m[3] !== undefined) dodaj(m[3].split(/\$\{[^}]*\}/).join(' ')); zamknij(); }
    }
    zamknij(); return ' ';
  });
  const literaly = tekst => { for (const m of tekst.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)) dodaj((m[1] ?? m[2] ?? m[3]).split(/\$\{[^}]*\}/).join(' ')); };
  literaly(bezJoin);
  for (const m of bezJoin.matchAll(/\$\{([^{}]*)\}/g)) literaly(m[1]); // literały wewnątrz ${…} szablonu (np. mod('plik.mjs'))
  return wynik;
}
/** Skrypty repo uruchamiane przez źródło testu (puste, gdy test nic nie uruchamia). Rozpoznaje ścieżki scripts/** w literałach, join i `npm run <nazwa>` z package.json. */
export function skryptyUruchamianePrzezTest(src, root) {
  if (!URUCHOMIENIE.test(src)) return [];
  const skrypty = new Set();
  const kandydaci = sciezkiZLiteralow(src);
  const katalogiSkryptow = ['scripts', ...[...kandydaci].filter(c => c.startsWith('scripts/') && jest(c, root)?.isDirectory())];
  for (const c of kandydaci) {
    if (c.startsWith('scripts/') && KOD.test(c) && jest(c, root)?.isFile()) skrypty.add(c);
    // nazwa pliku bez katalogu (const mod = f => join(ROOT, 'scripts/i18n', f); mod('kontekst.mjs')) — w przeglądanym katalogu skryptów
    else if (!c.includes('/') && KOD.test(c)) for (const k of katalogiSkryptow) if (jest(`${k}/${c}`, root)?.isFile()) skrypty.add(`${k}/${c}`);
  }
  const npmRun = [...src.matchAll(/\bnpm\s+run\s+([\w:.-]+)/g)].map(m => m[1]);
  if (npmRun.length && existsSync(join(root, 'package.json'))) {
    const polecenia = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts ?? {};
    for (const n of npmRun) for (const m of String(polecenia[n] ?? '').matchAll(/scripts\/[\w./-]+/g)) if (jest(m[0], root)?.isFile()) skrypty.add(m[0]);
  }
  return [...skrypty].sort();
}
const zaleznosciCache = new Map();
/** Zależności skryptu: pliki (moduły importowane rekurencyjnie, uruchamiane skrypty, pliki czytane) i katalogi (czytane lub przeglądane). */
export function zaleznosciSkryptu(skrypt, root) {
  const klucz = `${root}\0${skrypt}`;
  if (zaleznosciCache.has(klucz)) return zaleznosciCache.get(klucz);
  const pliki = new Set(); const katalogi = new Set(); const kolejka = [skrypt];
  while (kolejka.length) {
    const plik = kolejka.pop();
    if (pliki.has(plik)) continue;
    pliki.add(plik);
    if (!KOD.test(plik)) continue;
    const src = readFileSync(join(root, plik), 'utf8');
    for (const m of src.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const cel = ROZSZERZENIA.map(r => normalize(join(dirname(plik), m[1] + r))).find(r => jest(r, root)?.isFile());
      if (cel && !cel.startsWith('..')) kolejka.push(cel);
    }
    for (const c of sciezkiZLiteralow(src)) {
      if (c.startsWith('node_modules') || c.startsWith('.git')) continue;
      const st = jest(c, root);
      if (!st) continue;
      if (st.isFile()) { if (c.startsWith('scripts/') && KOD.test(c)) kolejka.push(c); else pliki.add(c); }
      else if (c.includes('/')) katalogi.add(c); // katalog jednopoziomowy (lib, docs, data…) wybrałby pół repo — skrypt czyta w nim zwykle konkretne podkatalogi
    }
  }
  const wynik = { pliki, katalogi };
  zaleznosciCache.set(klucz, wynik);
  return wynik;
}
/** Testy uruchamiające skrypt, którego zależność jest wśród zmienionych plików (także kod: zmiana modułu importowanego przez skrypt nie jest w grafie importów testu). */
const uruchomieniaCache = new Map();
/** Test → skrypty, które uruchamia (tylko testy z uruchomieniem; liczone raz na proces). */
export function uruchomieniaSkryptow(root) {
  if (!uruchomieniaCache.has(root)) {
    const mapa = new Map();
    for (const t of readdirSync(join(root, 'tests')).filter(f => /\.test\.tsx?$/.test(f))) {
      const skrypty = skryptyUruchamianePrzezTest(readFileSync(join(root, 'tests', t), 'utf8'), root);
      if (skrypty.length) mapa.set(t, skrypty);
    }
    uruchomieniaCache.set(root, mapa);
  }
  return uruchomieniaCache.get(root);
}
export function testyUruchamiajaceSkrypty(pliki, root) {
  const trafione = new Set();
  for (const [t, skrypty] of uruchomieniaSkryptow(root)) {
    const zal = skrypty.map(s => zaleznosciSkryptu(s, root));
    if (pliki.some(f => zal.some(z => z.pliki.has(f) || [...z.katalogi].some(k => f.startsWith(`${k}/`))))) trafione.add(`tests/${t}`);
  }
  return [...trafione].sort();
}

export function testyCzytajace(pliki, root, { zawszeDocs = false } = {}) {
  const wszystkie = readdirSync(join(root, 'tests')).filter(f => /\.test\.tsx?$/.test(f));
  const zrodla = Object.fromEntries(wszystkie.map(f => [f, readFileSync(join(root, 'tests', f), 'utf8')]));
  const trafione = new Set();
  for (const f of pliki) {
    const nazwa = basename(f);
    const dokument = f.startsWith('docs/') || f.endsWith('.md');
    const frazy = [f];
    if (dokument) { frazy.push(nazwa); if (/^\d/.test(nazwa)) frazy.push(nazwa.replace(/\.md$/, '')); }
    const katalog = dirname(f);
    const katalogMa = katalog !== '.' && katalog !== 'docs';
    for (const t of wszystkie) {
      const src = zrodla[t];
      if ((zawszeDocs && przegladaDocs.test(src)) || frazy.some(fr => src.includes(fr)) || (katalogMa && czytaKatalog(src, katalog))) trafione.add(`tests/${t}`);
    }
  }
  return [...trafione].sort();
}
