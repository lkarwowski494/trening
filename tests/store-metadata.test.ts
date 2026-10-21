/* Metadane App Store Connect — podtytuł i słowa kluczowe (store/app-store-metadata.json; nazwy: store/app-store-names.json). Przebieg M5 widoczności
 * w sklepie (docs/45), decyzje właściciela 21.10.2026 (STOP 1 i STOP 2, przekazane przez koordynatora). Limity wg App Store Connect Help
 * „Platform version information” (odczyt 21.10.2026): Subtitle ≤ 30 znaków; Keywords „One or more keywords (each greater than two characters)
 * … up to 100 bytes”; „you shouldn't duplicate” nazwy aplikacji w słowach kluczowych; App Store search: bez powtórzeń słów z nazwy i podtytułu. */
import * as fs from 'fs';
import * as path from 'path';
import { namesIn } from './forbidden-names';

const read = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
const names = read('store/app-store-names.json').names as Record<string, string>;
const meta = read('store/app-store-metadata.json');
const L = meta.lokalizacje as Record<string, { subtitle: string; keywords: string }>;
const words = (s: string) => s.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

describe('store/app-store-metadata.json', () => {
  test('te same lokalizacje co nazwy (33: 31 + en-AU, en-CA — decyzja STOP 1, 21.10.2026)', () => {
    expect(Object.keys(L).sort()).toEqual(Object.keys(names).sort());
    expect(Object.keys(names)).toEqual(expect.arrayContaining(['en-AU', 'en-CA']));
    expect(Object.keys(names)).toHaveLength(33);
  });
  test('limity Apple: podtytuł ≤ 30 znaków, słowa kluczowe ≤ 100 B, każde słowo > 2 znaki, przecinki bez spacji', () => {
    for (const [l, v] of Object.entries(L)) {
      const kw = v.keywords.split(',');
      expect({ l, sub: [...v.subtitle].length <= 30, b: Buffer.byteLength(v.keywords, 'utf8') <= 100, krotkie: kw.filter(k => [...k].length <= 2), spacje: /,\s|\s,/.test(v.keywords) })
        .toEqual({ l, sub: true, b: true, krotkie: [], spacje: false });
    }
  });
  test('słowa kluczowe bez powtórzeń i bez słów z nazwy i podtytułu', () => {
    for (const [l, v] of Object.entries(L)) {
      const own = new Set([...words(names[l]), ...words(v.subtitle)]);
      const kw = v.keywords.toLowerCase().split(',');
      expect({ l, dup: kw.filter((k, i) => kw.indexOf(k) !== i), zNazwy: kw.filter(k => own.has(k)) }).toEqual({ l, dup: [], zNazwy: [] });
    }
  });
  test('decyzje właściciela (STOP 2, 21.10.2026): nazwa PL, podtytuły PL/EN zastępują D-4 z 14.10.2026; en-AU = en-GB, en-CA = en-US', () => {
    expect(names.pl).toBe('Trening: dziennik treningowy');
    expect(L.pl.subtitle).toBe('Serie i przerwy. Bez konta');
    for (const l of ['en-US', 'en-GB', 'en-AU', 'en-CA']) expect([l, L[l].subtitle]).toEqual([l, 'Workout tracker. No account.']);
    expect([names['en-AU'], L['en-AU']]).toEqual([names['en-GB'], L['en-GB']]);
    expect([names['en-CA'], L['en-CA']]).toEqual([names['en-US'], L['en-US']]);
  });
  test('bez nazw innych aplikacji i marek (wytyczna 2.3.7) i bez kwot w polach', () => {
    for (const [l, v] of Object.entries(L)) {
      const all = `${names[l]} ${v.subtitle} ${v.keywords}`;
      expect({ l, marki: namesIn(all), kwoty: /\d+[,.]\d\d|zł|PLN|USD|EUR|€|\$|£/.test(all) }).toEqual({ l, marki: [], kwoty: false });
    }
  });
});
