// Pisownia marki w plikach, których nie importuje kod (JSON, HTML, Markdown, InfoPlist, scenariusze) — spójność z lib/brand.ts (BRAND_NAME).
// Decyzja właściciela 09.11.2026 (docs/18, ZB-056): marka „RepsGoat”; pisownię (wielkość liter) zmienia się w jednym miejscu — lib/brand.ts.
//   node scripts/marka.mjs           → kontrola: kod 1, gdy któryś plik z listy ZGODNOSC zapisuje markę inaczej niż BRAND_NAME
//   node scripts/marka.mjs --marka=XYZ → kontrola względem podanej pisowni (test wykrywania różnic)
//   node scripts/marka.mjs --write   → ujednolica pisownię we wszystkich plikach z listy (potem: UPDATE_WATCH_APPLE=1 UPDATE_WIDGET=1 npx jest tests/watch-apple-i18n.test.ts tests/widget-i18n.test.ts
//                                       oraz node scripts/asc/kontrola-oczekiwane.mjs i node scripts/readme.mjs --write, jeśli zmieniły się pliki generowane)
// Słowo kluczowe „repgoat” (bez „s”, pole słów kluczowych App Store) i dokumenty w docs/ (zapis decyzji z datą) nie podlegają zamianie.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WZOR = /repsgoat/gi;

/** Pisownia marki z lib/brand.ts (źródło prawdy; plik .ts czytany jako tekst, żeby skrypt działał bez kompilacji). */
export function markaZKodu() {
  const m = readFileSync(join(ROOT, 'lib', 'brand.ts'), 'utf8').match(/export const BRAND_NAME = '([^']+)'/);
  if (!m) throw new Error('lib/brand.ts: brak BRAND_NAME');
  return m[1];
}

const wKatalogu = (dir, ok) => (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter(ok).map(f => `${dir}/${f}`) : []);
const lproj = dir => (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter(d => d.endsWith('.lproj')).map(d => `${dir}/${d}/InfoPlist.strings`) : []);

/** Pliki, w których marka występuje i musi mieć pisownię z BRAND_NAME. */
export const ZGODNOSC = [
  'app.json', 'README.md',
  ...wKatalogu('locales', f => f.endsWith('.json')),
  ...lproj('targets/watch-app'), ...lproj('targets/rest-widget'),
  'targets/watch-app/expo-target.config.js', 'targets/rest-widget/expo-target.config.js',
  ...wKatalogu('store', f => /\.(json|md|txt)$/.test(f)),
  ...wKatalogu('site', f => f.endsWith('.html')),
  'scripts/ci/maestro-sklep/import.yaml', '.maestro/subflows/wybierz-plik-kopii.yaml', '.maestro/60-baza-uszkodzona.yaml', 'scripts/asc/metadane.mjs',
];

/** Pliki zapisujące markę inaczej niż `marka` (lista pusta = zgodność). */
export function bladPisowni(marka = markaZKodu()) {
  const zle = [];
  for (const f of ZGODNOSC) {
    const inne = [...new Set((readFileSync(join(ROOT, f), 'utf8').match(WZOR) ?? []).filter(x => x !== marka))];
    if (inne.length) zle.push(`${f}: ${inne.join(', ')}`);
  }
  return zle;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = process.argv.find(a => a.startsWith('--marka='));
  const marka = arg ? arg.slice(8) : markaZKodu(); /* --marka= tylko do testu wykrywania */
  if (process.argv.includes('--write')) {
    let n = 0;
    for (const f of ZGODNOSC) { const s = readFileSync(join(ROOT, f), 'utf8'); const t = s.replace(WZOR, marka); if (t !== s) { writeFileSync(join(ROOT, f), t); n++; } }
    console.log(`marka „${marka}”: zmieniono ${n} plików`);
  } else {
    const zle = bladPisowni(marka);
    if (zle.length) { console.error(`Pisownia marki różni się od lib/brand.ts („${marka}”) — uruchom node scripts/marka.mjs --write:\n${zle.join('\n')}`); process.exit(1); }
    console.log(`marka „${marka}”: ${ZGODNOSC.length} plików zgodnych`);
  }
}
