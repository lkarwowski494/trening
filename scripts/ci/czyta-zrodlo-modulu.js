/* Wykrywanie testów, które czytają TEKST źródłowy mutowanego modułu lib/ (nocne mutacje, 02.11.2026; wcześniej 01.11.2026 audyt jakości 004).
 * Jedno miejsce dla jest.mutation.config.js i tests/mutation-config.test.ts (dotąd ten sam regex w obu).
 * Wariant A (właściciel 02.11.2026): test „czyta źródło”, gdy po usunięciu komentarzy zawiera literał '[../]lib/<moduł>.ts' (w ', " albo `; przedrostek dozwolony) ORAZ readFileSync
 * (bezpośrednio albo w pomocniku `read()`/`code()` zdefiniowanym w tym samym pliku — tak czytają audit-m1-045, audit-m1-046, m5s1-bez-proby).
 * Import `@/lib/access` nie jest literałem z „.ts”, więc testy logiki (access.test.ts, timer-logic.test.ts) zostają w konfiguracji.
 * Moduł w CommonJS, bo używa go też Jest bez transformacji. */
const bezKomentarzy = tekst => tekst.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
/** Czy tekst testu (po usunięciu komentarzy) czyta źródło któregoś z mutowanych modułów ('lib/x', 'lib/state/migrate' — bez „.ts”). */
function czytaZrodlo(tekst, mutowane) {
  const z = bezKomentarzy(tekst);
  if (!/readFileSync/.test(z)) return false;
  /* literał może mieć przedrostek (np. '../lib/access.ts', path.join(__dirname, '../lib/access.ts')) */
  return mutowane.some(m => new RegExp('[\'"`][^\'"`\\n]*' + m.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '\\.ts[\'"`]').test(z));
}
module.exports = { czytaZrodlo, bezKomentarzy };
