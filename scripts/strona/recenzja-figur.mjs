// Bramka 4 dla eksportu strony (CLAUDE.md 27.10.2026: „rodzina bez recenzji = nie wyświetlana, strona jej nie eksportuje”; decyzja właściciela 9a, 28.10.2026).
// Figura rodziny v2 trafia do eksportu tylko, gdy rodzina ma status „ready” ORAZ wpis w sekcji `v2` pliku docs/research/figury-recenzja.json (werdykt „wyswietlana”)
// z aktualnym skrótem. Skrót = `rodzinaSkrot` z scripts/skrot-v2-wynik.mjs (to samo, co zapis recenzji w scripts/zrodla-runtime.mjs): skrót WYNIKU rysunku rodziny (kształty klatek, dobór, kadr, tempo)
// + tekst pliku rodziny (rig albo pozy), jej nakładki i warstwy rysowania (decyzja właściciela 09.11.2026, wariant A; wcześniej tekst wszystkich plików wspólnych, V2_WSPOLNE).
// Brak pliku zapisu = żadna rodzina nie jest eksportowana (fail closed). Użycie: node scripts/strona/recenzja-figur.mjs --skroty [--recenzja <plik>]
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot } from './ts-loader.mjs';
import { rodzinaSkrot, V2_RIGI } from '../skrot-v2-wynik.mjs';

export const PLIK_RECENZJI = join(repoRoot, 'docs/research/figury-recenzja.json');
/** Pliki rigu rodzin v2 z własnym rigiem. */
export const RIGI = V2_RIGI;
/** Skrót bieżącej wersji rysunku rodziny (jedno źródło ze scripts/zrodla-runtime.mjs). */
export const skrotRodziny = rodzinaSkrot;
/** Zapis recenzji rodzin v2 ({} gdy pliku nie ma). */
export function zapisRodzin(plik = PLIK_RECENZJI) { return existsSync(plik) ? (JSON.parse(readFileSync(plik, 'utf8')).v2 ?? {}) : {}; }
/** Zbiór rodzin do eksportu: status „ready” ∩ wpis „wyswietlana” z skrótem równym bieżącemu. */
export function rodzinyZRecenzja(rodzinyReady, plik = PLIK_RECENZJI, skroty = {}) {
  const zapis = zapisRodzin(plik);
  return new Set(rodzinyReady.filter(f => zapis[f]?.werdykt === 'wyswietlana' && zapis[f].sha === (skroty[f] ?? skrotRodziny(f)))); /* `skroty`: już policzone (skrót z wyniku rysunku liczy się sekundy) */
}

if (process.argv[1] && process.argv[1].endsWith('recenzja-figur.mjs') && process.argv.includes('--skroty')) {
  const { appRequire } = await import('./ts-loader.mjs');
  const ready = appRequire()('lib/figures/v2/index.ts').FAMILIES.filter(f => f.status === 'ready').map(f => f.id);
  const i = process.argv.indexOf('--recenzja');
  const skroty = Object.fromEntries(ready.map(f => [f, skrotRodziny(f)]));
  console.log(JSON.stringify({ ready, skroty, eksportowane: [...rodzinyZRecenzja(ready, i > 0 ? process.argv[i + 1] : PLIK_RECENZJI, skroty)] }));
}
