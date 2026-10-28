// Bramka 4 dla eksportu strony (CLAUDE.md 27.10.2026: „rodzina bez recenzji = nie wyświetlana, strona jej nie eksportuje”; decyzja właściciela 9a, 28.10.2026).
// Figura rodziny v2 trafia do eksportu tylko, gdy rodzina ma status „ready” ORAZ wpis w sekcji `v2` pliku docs/research/figury-recenzja.json (werdykt „wyswietlana”)
// z aktualnym skrótem. Skrót = sha256 (12 znaków) tekstu: pliki rigu rodziny + wspólny moduł rigów + warianty (squat, bench_press, hinge) albo, dla rodzin z danych pozy,
// lib/figures/v2/poses/<rodzina>.json + wspólny moduł rigów + warianty. Dla rodzin z rigiem wzór jest ten sam co `rodzinaSkrot` w scripts/zrodla-runtime.mjs (zapis recenzji).
// Brak pliku zapisu = żadna rodzina nie jest eksportowana (fail closed). Użycie: node scripts/strona/recenzja-figur.mjs --skroty [--recenzja <plik>]
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot } from './ts-loader.mjs';

export const PLIK_RECENZJI = join(repoRoot, 'docs/research/figury-recenzja.json');
/** Pliki rigu rodzin v2 z własnym rigiem. */
export const RIGI = { squat: 'squat.ts', bench_press: 'benchPress.ts', hinge: 'hinge.ts' };
const sha12 = t => createHash('sha256').update(t).digest('hex').slice(0, 12);

/** Skrót bieżącej wersji danych rodziny (rig albo poza z danych). */
export function skrotRodziny(rodzina) {
  const zrodlo = RIGI[rodzina] ? `lib/figures/v2/rigs/${RIGI[rodzina]}` : `lib/figures/v2/poses/${rodzina}.json`;
  return sha12([zrodlo, 'lib/figures/v2/rigs/common.ts', 'lib/figures/v2/variants.ts'].map(p => readFileSync(join(repoRoot, p), 'utf8')).join('\n'));
}
/** Zapis recenzji rodzin v2 ({} gdy pliku nie ma). */
export function zapisRodzin(plik = PLIK_RECENZJI) { return existsSync(plik) ? (JSON.parse(readFileSync(plik, 'utf8')).v2 ?? {}) : {}; }
/** Zbiór rodzin do eksportu: status „ready” ∩ wpis „wyswietlana” z skrótem równym bieżącemu. */
export function rodzinyZRecenzja(rodzinyReady, plik = PLIK_RECENZJI) {
  const zapis = zapisRodzin(plik);
  return new Set(rodzinyReady.filter(f => zapis[f]?.werdykt === 'wyswietlana' && zapis[f].sha === skrotRodziny(f)));
}

if (process.argv[1] && process.argv[1].endsWith('recenzja-figur.mjs') && process.argv.includes('--skroty')) {
  const { appRequire } = await import('./ts-loader.mjs');
  const ready = appRequire()('lib/figures/v2/index.ts').FAMILIES.filter(f => f.status === 'ready').map(f => f.id);
  const i = process.argv.indexOf('--recenzja');
  console.log(JSON.stringify({ ready, skroty: Object.fromEntries(ready.map(f => [f, skrotRodziny(f)])), eksportowane: [...rodzinyZRecenzja(ready, i > 0 ? process.argv[i + 1] : PLIK_RECENZJI)] }));
}
