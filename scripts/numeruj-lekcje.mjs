// Numeracja lekcji w docs/40 (decyzja właściciela 21.10.2026, L-016): gałąź dopisuje lekcję z nagłówkiem „## L-NNN …”,
// numer nadaje koordynator przy scalaniu do main tym skryptem — kolejne wolne numery, najnowsza (najwyżej) dostaje najwyższy.
// Użycie: node scripts/numeruj-lekcje.mjs [plik] [--sprawdz]   (--sprawdz: kod 1, gdy są nienumerowane lekcje; nic nie zmienia)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function numeruj(tekst) {
  const linie = tekst.split('\n');
  const numery = linie.map((l) => /^## L-(\d{3}) /.exec(l)).filter(Boolean).map((m) => Number(m[1]));
  let nastepny = (numery.length ? Math.max(...numery) : 0) + 1;
  const robocze = linie.map((l, i) => (l.startsWith('## L-NNN ') ? i : -1)).filter((i) => i >= 0);
  for (const i of [...robocze].reverse()) linie[i] = linie[i].replace('## L-NNN ', `## L-${String(nastepny++).padStart(3, '0')} `);
  return { tekst: linie.join('\n'), nadane: robocze.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const plik = resolve(args.find((a) => !a.startsWith('--')) || resolve(dirname(fileURLToPath(import.meta.url)), '../docs/40-lekcje.md'));
  const wynik = numeruj(readFileSync(plik, 'utf8'));
  if (args.includes('--sprawdz')) {
    if (wynik.nadane) { console.error(`numeruj-lekcje: ${wynik.nadane} lekcji bez numeru (## L-NNN) — uruchom: node scripts/numeruj-lekcje.mjs`); process.exit(1); }
    console.log('numeruj-lekcje: wszystkie lekcje mają numer');
  } else {
    writeFileSync(plik, wynik.tekst);
    console.log(`numeruj-lekcje: nadano ${wynik.nadane}`);
  }
}
