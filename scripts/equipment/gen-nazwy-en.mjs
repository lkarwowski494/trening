// ZB-025 b (nazwy EN po rid, ścieżka B, decyzja właściciela 31.10.2026): generuje lib/nazwy-en.generated.ts z docs/research/equipment/nazwy-en.json.
// Źródło jest po `rid` (stały identyfikator wiersza katalogu); do aplikacji trafia mapa po KLUCZU katalogu (rid nie może być w kodzie dostarczanym użytkownikowi —
// tests/provenance-guard.test.ts). Klucze katalogu, dane użytkownika i SCHEMA_VERSION bez zmian: to tylko warstwa nazw wyświetlanych (wzór: LIB_DISPLAY_NAME w lib/seed.ts).
// Użycie: node scripts/equipment/gen-nazwy-en.mjs [--check]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SRC = 'docs/research/equipment/nazwy-en.json';
export const KATALOG = 'docs/research/equipment/catalog.json';
export const OUT = 'lib/nazwy-en.generated.ts';

/** Z wpisów po rid → { nazwy: klucz → nazwa EN, dawne: klucz → [dawna nazwa EN] }; błąd przy rid spoza katalogu, powtórzeniu albo pustej nazwie. */
export function zbuduj(zrodlo, katalog) {
  const poRid = new Map(katalog.map(c => [c.rid, c.name]));
  const widziane = new Set(), nazwy = {}, dawne = {}, wyswietlane = {};
  for (const w of zrodlo.wpisy) {
    const klucz = poRid.get(w.rid);
    if (!klucz) throw new Error(`nazwy-en: rid ${w.rid} nie istnieje w katalogu`);
    if (widziane.has(w.rid)) throw new Error(`nazwy-en: rid ${w.rid} występuje dwa razy`);
    widziane.add(w.rid);
    if (typeof w.nazwa !== 'string' || !w.nazwa.trim() || typeof w.dawna !== 'string' || !w.dawna.trim()) throw new Error(`nazwy-en: ${w.rid} bez nazwy albo dawnej nazwy`);
    nazwy[klucz] = w.nazwa;
    if (w.wyswietlana) wyswietlane[w.wyswietlana] = w.nazwa; /* klucz z LIB_DISPLAY_NAME (znak towarowy) — exName dostaje też nazwę wyświetlaną */
    if (w.dawna !== w.nazwa) dawne[klucz] = [w.dawna];
  }
  return { nazwy: { ...nazwy, ...wyswietlane }, dawne };
}

export function renderuj({ nazwy, dawne }) {
  const q = s => JSON.stringify(s);
  const L = [
    '/* AUTOMATYCZNIE WYGENEROWANE przez scripts/equipment/gen-nazwy-en.mjs z docs/research/equipment/nazwy-en.json — nie edytować ręcznie.',
    ' * Nazwy angielskie ćwiczeń biblioteki (ZB-025 b, decyzja właściciela 31.10.2026): klucz katalogu → nazwa wyświetlana po angielsku (lib/i18n.ts exName).',
    ' * Klucze katalogu i dane użytkownika bez zmian; dawne nazwy angielskie służą tylko do wyszukiwania (lib/seed.ts formerEnNamesOf). */',
    'export const NAME_EN: Readonly<Record<string, string>> = {',
    ...Object.entries(nazwy).map(([k, v]) => `  ${q(k)}: ${q(v)},`),
    '};',
    'export const NAME_EN_FORMER: Readonly<Record<string, readonly string[]>> = {',
    ...Object.entries(dawne).map(([k, v]) => `  ${q(k)}: ${q(v)},`),
    '};',
    '',
  ];
  return L.join('\n');
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
  const out = renderuj(zbuduj(JSON.parse(readFileSync(join(root, SRC), 'utf8')), JSON.parse(readFileSync(join(root, KATALOG), 'utf8'))));
  if (process.argv.includes('--check')) {
    const cur = existsSync(join(root, OUT)) ? readFileSync(join(root, OUT), 'utf8') : null;
    if (cur !== out) { console.error(`${OUT} jest nieaktualny — uruchom: node scripts/equipment/gen-nazwy-en.mjs`); process.exit(1); }
    console.log('nazwy-en.generated.ts: aktualny');
  } else { writeFileSync(join(root, OUT), out); console.log(`zapisano ${OUT}`); }
}
