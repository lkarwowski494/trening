/* Słowniki języków (decyzja właściciela 05.10.2026). Źródło tekstów do tłumaczenia generowane z kodu — jedno źródło prawdy:
 *   UPDATE_I18N=1 npx jest tests/i18n-locales.test.ts   — zapisuje lib/locales/_source.json
 * Kompletność i poprawność każdego słownika: każdy klucz, te same {parametry}, liczba form liczby mnogiej wg lib/plural.ts. */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { allLabels } from '@/lib/equipment';

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

