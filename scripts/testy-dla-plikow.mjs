// Testy Jest, które CZYTAJĄ dany plik (dokument, dane) przez fs, a nie importem — jedno miejsce dla verify:docs i test:fast (ZB-041 G3 i G5, L-100, 04.11.2026).
// `--findRelatedTests` idzie tylko po grafie importów, więc test sprawdzający np. docs/51 albo docs/research/recenzje/*.json nie jest powiązany ze zmianą pliku.
// Plik pasuje do testu, gdy źródło testu wymienia: pełną ścieżkę pliku; dla dokumentów (docs/, .md) także samą nazwę (numerowane docs/NN-… także bez .md);
// katalog pliku — ale tylko wtedy, gdy test ten katalog PRZEGLĄDA (readdir/walk/glob z tą ścieżką) albo buduje z niego ścieżki (`katalog/${nazwa}`).
// Samo wspomnienie katalogu w komentarzu albo komunikacie nie liczy się (G3: nowy plik w docs/research wybierał 84–95 testów zamiast kilku).
import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

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
