/** M1-013 (DEC-05): komunikat „Sklep chwilowo niedostępny” (pusta lista produktów) ma tłumaczenie w każdym słowniku i w angielskim. */
import fs from 'fs';
import path from 'path';

const KEY = 'Sklep chwilowo niedostępny';
const dir = path.join(__dirname, '..', 'lib', 'locales');

describe('M1-013: „Sklep chwilowo niedostępny” w słownikach', () => {
  test('angielski w lib/i18n.en.ts', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'lib', 'i18n.en.ts'), 'utf8');
    expect(src).toContain(`'${KEY}':`);
  });
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_') && !['es-419.json', 'pt-BR.json'].includes(f));
  test('31 słowników bazowych (es-419 i pt-BR dziedziczą z es i pt)', () => { expect(files).toHaveLength(31); });
  test.each(files)('%s: niepusty przekład, inny niż polski klucz', f => {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Record<string, string>;
    expect(typeof d[KEY]).toBe('string'); expect(d[KEY].trim().length).toBeGreaterThan(2); expect(d[KEY]).not.toBe(KEY);
  });
  test('_source.json zawiera parę pl/en', () => {
    const src = JSON.parse(fs.readFileSync(path.join(dir, '_source.json'), 'utf8')) as { pl: string; en: string }[];
    expect(src.find(x => x.pl === KEY)?.en).toBe('Store temporarily unavailable');
  });
});
