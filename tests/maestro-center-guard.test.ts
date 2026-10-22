/* Strażnik (E2E 39702654990, scenariusze 05, 25, 35): Maestro uznaje element za widoczny, gdy leży pod nagłówkiem albo paskiem zakładek, więc stuknięcie/
 * przesunięcie zaraz po `scrollUntilVisible` bez `centerElement` trafia w nagłówek lub pasek. Nowy taki krok wymaga `centerElement: true`.
 * Kroki, które już przechodzą na symulatorze (przebieg 39702654990: 27/30 zielonych), są na liście bazowej — lista ma się tylko zmniejszać. */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const dir = join(__dirname, '../.maestro');
const files = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(d, e.name)) : e.name.endsWith('.yaml') ? [join(d, e.name)] : []);

/** Zwraca „plik: element” dla każdego scrollUntilVisible bez centerElement, po którym (pomijając komentarze) następuje tapOn albo swipe. */
function bezSrodka(): string[] {
  const out = new Set<string>();
  for (const f of files(dir)) {
    const L = readFileSync(f, 'utf8').split('\n');
    for (let i = 0; i < L.length; i++) {
      if (!/^\s*- scrollUntilVisible:/.test(L[i]) || /centerElement/.test(L[i])) continue;
      let j = i + 1; while (j < L.length && (/^\s*#/.test(L[j]) || !L[j].trim())) j++;
      if (/^\s*- (tapOn|swipe: \{ from)\b/.test(L[j] ?? '')) out.add(f.slice(dir.length + 1) + ': ' + L[i].replace(/#.*$/, '').replace(/^\s*- scrollUntilVisible:\s*/, '').replace(/,\s*timeout:.*$/, '').trim());
    }
  }
  return [...out].sort();
}

test('stuknięcie lub przesunięcie po scrollUntilVisible bez centerElement tylko tam, gdzie przechodzi na symulatorze (lista bazowa, E2E 39702654990)', () => {
  const base = JSON.parse(readFileSync(join(__dirname, 'maestro-center-baza.json'), 'utf8')) as string[];
  const now = bezSrodka();
  expect({ nowe: now.filter(x => !base.includes(x)) }).toEqual({ nowe: [] }); // dodaj centerElement: true (albo przewiń swipe'em)
  expect({ nieaktualne: base.filter(x => !now.includes(x)) }).toEqual({ nieaktualne: [] }); // usuń wpis z listy bazowej
});
