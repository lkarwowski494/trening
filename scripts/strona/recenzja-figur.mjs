// Bramka 4 dla eksportu strony (CLAUDE.md 27.10.2026: „rodzina bez recenzji = nie wyświetlana, strona jej nie eksportuje”; decyzja właściciela 9a, 28.10.2026).
// Figura rodziny v2 trafia do eksportu tylko, gdy rodzina ma status „ready” ORAZ wpis w sekcji `v2` pliku docs/research/figury-recenzja.json (werdykt „wyswietlana”)
// z aktualnym skrótem. Skrót = sha256 (12 znaków) tekstu: plik rigu rodziny (squat, bench_press, hinge) albo, dla rodzin z danych pozy, lib/figures/v2/poses/<rodzina>.json,
// + pliki wspólne V2_WSPOLNE (wspólny moduł rigów, warianty, rysowanie, sceny, szkielet, matematyka, czas, błędy, figura — R2-6 z linii 1.0.1, scalenie 31.10.2026; od ACG-002 31.10.2026 całe domknięcie importów rysunku poza zestawami wskazówek). Dla rodzin z rigiem wzór jest ten sam co `rodzinaSkrot` w scripts/zrodla-runtime.mjs (zapis recenzji).
// Brak pliku zapisu = żadna rodzina nie jest eksportowana (fail closed). Użycie: node scripts/strona/recenzja-figur.mjs --skroty [--recenzja <plik>]
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot } from './ts-loader.mjs';

export const PLIK_RECENZJI = join(repoRoot, 'docs/research/figury-recenzja.json');
/** Pliki rigu rodzin v2 z własnym rigiem. */
export const RIGI = { squat: 'squat.ts', bench_press: 'benchPress.ts', hinge: 'hinge.ts' };
const sha12 = t => createHash('sha256').update(t).digest('hex').slice(0, 12);
/** Pliki wspólne rodzin v2, które zmieniają rysunek — ta sama lista co V2_WSPOLNE w scripts/zrodla-runtime.mjs (parytet: tests/strona-eksport-recenzja.test.ts). */
export const WSPOLNE = ['lib/figures/v2/rigs/common.ts', 'lib/figures/v2/variants.ts', 'lib/figures/v2/draw.ts', 'lib/figures/v2/scene.ts', 'lib/figures/v2/skeleton.ts', 'lib/figures/v2/math.ts', 'lib/figures/v2/anim.ts', 'lib/figures/v2/errors.ts', 'lib/figures/v2/figure.ts', 'lib/figures/v2/muscles.ts', 'lib/figures/v2/muscles.generated.ts', 'lib/figures/v2/guides.ts', 'lib/figures/v2/contacts.ts', 'lib/figures/v2/colliders.ts', 'lib/figures/v2/render.ts', 'lib/figures/v2/families.ts', 'lib/figures/v2/poseData.ts', 'lib/figures/v2/contract.ts', 'lib/figures/v2/gear.ts', 'lib/figures/v2/leverGuard.ts', 'lib/figures/v2/overheadException.ts', 'lib/figures/v2/palette.ts', 'lib/figures/v2/badges.ts', 'lib/figures/v2/ui.ts', 'lib/figures/v2/styki.json'];

/** Skrót bieżącej wersji danych rodziny (rig albo poza z danych). */
export function skrotRodziny(rodzina) {
  const zrodlo = RIGI[rodzina] ? `lib/figures/v2/rigs/${RIGI[rodzina]}` : `lib/figures/v2/poses/${rodzina}.json`;
  return sha12([zrodlo, ...WSPOLNE].map(p => readFileSync(join(repoRoot, p), 'utf8')).join('\n'));
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
