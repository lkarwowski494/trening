/*
 * M1-audytor-generalny-067 (DEC-21 a): rejestr języków docs/lokalizacja/jezyki.md — wiersz dla każdego kodu z LANGS (bez dodawania nowych języków), kolumny:
 * kod, fala, tłumaczenie, recenzja drugim agentem, drugi przegląd (native speaker), kontrole automatyczne, zrzuty, opis sklepu (nazwa, opis, zakupy).
 * Test porównuje listę kodów z LANGS i sprawdza kolumny, które da się wyliczyć z repo (nazwa w App Store, zakupy, pliki testów kontrolnych, język w słowniku).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, LANG_NAME, type Lang } from '@/lib/i18n';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const REG = 'docs/lokalizacja/jezyki.md';

/** Kod języka aplikacji → kody lokalizacji App Store Connect z store/app-store-names.json (en ma dwa). */
const ASC: Partial<Record<Lang, string[]>> = { en: ['en-US', 'en-GB', 'en-AU', 'en-CA'], es: ['es-ES'], 'es-419': ['es-MX'], pt: ['pt-PT'], de: ['de-DE'], fr: ['fr-FR'], nl: ['nl-NL'], nb: ['no'] };
const NOT_ASC: readonly Lang[] = ['bg', 'sr', 'lt', 'lv', 'et']; /* store/iap-localizations.json „ascLocaleBrak”, sprawdzone 14.10.2026 */
const SL_REJECTED: Lang = 'sl';
const CHECK_FILES: Partial<Record<Lang, string>> = { 'pt-BR': 'tests/i18n-variants.test.ts', 'es-419': 'tests/i18n-variants.test.ts', id: 'tests/i18n-wave2.test.ts', ms: 'tests/i18n-wave2.test.ts', vi: 'tests/i18n-wave2.test.ts', ru: 'tests/i18n-wave3.test.ts', ja: 'tests/i18n-wave4.test.ts', ko: 'tests/i18n-wave4.test.ts', 'zh-Hant': 'tests/i18n-wave4.test.ts' };

type Row = { kod: string; cells: string[] };
function rows(): Row[] {
  const d = read(REG); const a = d.indexOf('<!-- rejestr:start -->'); const b = d.indexOf('<!-- rejestr:end -->');
  if (a < 0 || b < a) return [];
  return d.slice(a, b).split('\n').filter((l) => /^\| `/.test(l)).map((l) => { const c = l.split('|').slice(1, -1).map((x) => x.trim()); return { kod: c[0].replace(/`/g, ''), cells: c }; });
}
const HEAD = ['kod', 'język', 'fala (decyzja)', 'tłumaczenie', 'recenzja drugim agentem', 'drugi przegląd (native speaker)', 'kontrole automatyczne', 'zrzuty z symulatora', 'nazwa w App Store', 'opis w App Store', 'zakupy (ASC)'];

describe('rejestr języków (docs/lokalizacja/jezyki.md)', () => {
  const r = rows();
  test('wiersz dla każdego kodu z LANGS, w tej samej kolejności, bez dodatkowych', () => { expect(r.map((x) => x.kod)).toEqual([...LANGS]); });
  test('nagłówek tabeli ma wszystkie kolumny DEC-21', () => {
    const d = read(REG); const head = d.split('\n').find((l) => l.startsWith('| kod |'))!;
    expect(head.split('|').slice(1, -1).map((x) => x.trim())).toEqual(HEAD);
    for (const x of r) expect(x.cells).toHaveLength(HEAD.length);
  });
  test('nazwa języka w rejestrze = LANG_NAME', () => { for (const x of r) expect(x.cells[1]).toBe(LANG_NAME[x.kod as Lang]); });
  test('nazwa w App Store: kody lokalizacji z store/app-store-names.json albo „brak” dla języków poza ASC', () => {
    const names = Object.keys(JSON.parse(read('store/app-store-names.json')).names as Record<string, string>);
    for (const x of r) {
      const l = x.kod as Lang; const codes = ASC[l] ?? (NOT_ASC.includes(l) ? [] : [l]);
      if (codes.length) { for (const c of codes) expect(names).toContain(c); expect(x.cells[8]).toBe(codes.join(', ')); } else expect(x.cells[8]).toMatch(/^brak/);
    }
    const covered = new Set(r.flatMap((x) => ASC[x.kod as Lang] ?? (NOT_ASC.includes(x.kod as Lang) ? [] : [x.kod])));
    expect([...names].filter((n) => !covered.has(n))).toEqual([]);
  });
  test('opis w App Store: każdy język z lokalizacją App Store ma opis w store/app-store-metadata.json (M5, 22.10.2026); języki poza ASC — brak', () => {
    const meta = JSON.parse(read('store/app-store-metadata.json')).lokalizacje as Record<string, { description?: string }>;
    for (const x of r) {
      const l = x.kod as Lang; const codes = ASC[l] ?? (NOT_ASC.includes(l) ? [] : [l]);
      if (codes.length) { for (const c of codes) expect([c, !!meta[c]?.description]).toEqual([c, true]); expect(x.cells[9]).toMatch(/^store\/app-store-metadata\.json/); }
      else expect(x.cells[9]).toMatch(/^brak/);
    }
  });
  test('zakupy: tłumaczenie w store/iap-localizations.json; poza ASC: bg sr lt lv et; sl odrzucony 14.10.2026', () => {
    const iap = Object.keys(JSON.parse(read('store/iap-localizations.json')).tlumaczenia as Record<string, string>);
    for (const x of r) {
      const l = x.kod as Lang;
      if (l === 'pl' || l === 'en') expect(x.cells[10]).toMatch(/^wersja bazowa/);
      else { expect(iap).toContain(l); expect(x.cells[10]).toMatch(NOT_ASC.includes(l) ? /^pominięty/ : l === SL_REJECTED ? /^odrzucony/ : /^tak/); }
    }
  });
  test('kontrole: wymienione pliki testów istnieją; każdy język ma „locales” i „cues”', () => {
    for (const x of r) {
      expect(x.cells[6]).toMatch(/locales/); expect(x.cells[6]).toMatch(/cues/);
      const f = CHECK_FILES[x.kod as Lang]; if (f) { expect(fs.existsSync(path.join(ROOT, f))).toBe(true); expect(x.cells[6]).toContain(path.basename(f)); }
    }
    for (const f of ['tests/i18n-locales.test.ts', 'tests/cues.test.tsx', 'tests/audit-m1-049-critical-content.test.ts']) expect(fs.existsSync(path.join(ROOT, f))).toBe(true);
  });
  test('drugi przegląd (native speaker): niewykonany w żadnym języku; zgodnie z docs/16 (spójne z R-010)', () => {
    for (const x of r) expect(x.cells[5]).toMatch(/^niewykonany/);
    expect(read('docs/40-lekcje.md')).toMatch(/\| R-010 \|/);
  });
  test('zgodność z kontrolą krytyczną (docs/16): recenzja drugim agentem w rejestrze = kolumna w docs/16', () => {
    const d16 = read('docs/16-jezyki-i-marka.md');
    for (const x of r.filter((y) => y.kod !== 'pl')) {
      const line = d16.split('\n').find((l) => l.startsWith(`| ${x.kod} | `) && l.includes('niewykonany'))!;
      expect(line).toBeDefined(); expect(line.includes('| tak (')).toBe(x.cells[4].startsWith('tak'));
    }
  });
  test('rejestr zapisuje zasadę: nowy język = nowy wiersz (bez dodawania języków w tym zadaniu)', () => {
    expect(read(REG)).toMatch(/nowy język[^\n]*wiersz/i);
  });
});
