/* Słowniki języków (decyzja właściciela 05.10.2026). Źródło tekstów do tłumaczenia generowane z kodu — jedno źródło prawdy:
 *   UPDATE_I18N=1 npx jest tests/i18n-locales.test.ts   — zapisuje lib/locales/_source.json
 * Kompletność i poprawność każdego słownika: każdy klucz, te same {parametry}, liczba form liczby mnogiej wg lib/plural.ts. */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { allLabels } from '@/lib/equipment';
import { LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { PLURAL_FORMS } from '@/lib/plural';

const params = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');

const FILE = path.join(__dirname, '..', 'lib', 'locales', '_source.json');
type Src = { pl: string; en: string; plural?: true };
export function source(): Src[] {
  const m = new Map<string, Src>();
  for (const [pl, en] of Object.entries(EN)) m.set(pl, { pl, en, ...(pl.includes('|') && en.includes('|') ? { plural: true as const } : {}) });
  for (const x of allLabels()) if (!m.has(x.pl)) m.set(x.pl, { pl: x.pl, en: x.en });
  return [...m.values()].sort((a, b) => a.pl.localeCompare(b.pl, 'pl'));
}

test('lib/locales/_source.json jest aktualny względem kodu (słownik EN + etykiety sprzętu)', () => {
  const want = JSON.stringify(source(), null, 1) + '\n';
  if (process.env.UPDATE_I18N === '1') fs.writeFileSync(FILE, want);
  expect(fs.readFileSync(FILE, 'utf8')).toBe(want);
});


describe.each(LANGS.filter(l => l !== 'pl' && l !== 'en'))('słownik %s', l => {
  const d = LOCALES[l] ?? {}; const src = source();
  test('komplet kluczy, niepuste, te same {parametry}, bez kluczy spoza źródła', () => {
    const keys = new Set(src.map(s => s.pl));
    expect(src.filter(s => !(typeof d[s.pl] === 'string' && d[s.pl].trim())).map(s => s.pl)).toEqual([]);
    expect(src.filter(s => d[s.pl] !== undefined && params(d[s.pl]) !== params(s.pl)).map(s => s.pl)).toEqual([]);
    expect(Object.keys(d).filter(k => !keys.has(k))).toEqual([]);
  });
  test('liczba mnoga: tyle form, ile ma język', () => {
    const n = PLURAL_FORMS[l].length;
    expect(src.filter(s => s.plural && d[s.pl] !== undefined && d[s.pl].split('|').length !== n).map(s => `${s.pl} → ${d[s.pl]}`)).toEqual([]);
  });
  test('bez liter występujących tylko w polskim (przeciek nieprzetłumaczonego tekstu)', () => {
    const PL_ONLY = l === 'lt' ? /[łńśźżŁŃŚŹŻ]/ : /[ąęłńśźżĄĘŁŃŚŹŻ]/; /* litewski ma ą, ę */
    expect(src.filter(s => d[s.pl] !== undefined && PL_ONLY.test(d[s.pl])).map(s => `${s.pl} → ${d[s.pl]}`)).toEqual([]);
  });
});

test('iOS zna wszystkie języki aplikacji: CFBundleLocalizations i opisy uprawnień (locales/<kod>.json)', () => {
  const app = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf8')).expo;
  expect([...app.ios.infoPlist.CFBundleLocalizations].sort()).toEqual([...LANGS].sort());
  expect(Object.keys(app.locales).sort()).toEqual([...LANGS].sort());
  for (const l of LANGS) {
    const f = JSON.parse(fs.readFileSync(path.join(__dirname, '..', app.locales[l]), 'utf8'));
    expect([l, Object.keys(f).sort()]).toEqual([l, ['CFBundleDisplayName', 'NSHealthShareUsageDescription', 'NSHealthUpdateUsageDescription']]);
    expect(f.CFBundleDisplayName).toBe('Trening');
  }
});
