/* Metadane App Store Connect — podtytuł i słowa kluczowe (store/app-store-metadata.json; nazwy: store/app-store-names.json). Przebieg M5 widoczności
 * w sklepie (docs/45), decyzje właściciela 21.10.2026 (STOP 1 i STOP 2, przekazane przez koordynatora). Limity wg App Store Connect Help
 * „Platform version information” (odczyt 21.10.2026): Subtitle ≤ 30 znaków; Keywords „One or more keywords (each greater than two characters)
 * … up to 100 bytes”; „you shouldn't duplicate” nazwy aplikacji w słowach kluczowych; App Store search: bez powtórzeń słów z nazwy i podtytułu. */
import * as fs from 'fs';
import * as path from 'path';
import { namesIn } from './forbidden-names';
import { PRIVACY_URL, TERMS_URL } from '@/lib/products';
import { LANGS } from '@/lib/i18n';
import { PAYWALL } from '@/lib/access';

const read = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
const names = read('store/app-store-names.json').names as Record<string, string>;
const meta = read('store/app-store-metadata.json');
const L = meta.lokalizacje as Record<string, { subtitle: string; keywords: string; description: string; promotionalText: string }>;
/* Model M5 S1 (decyzja właściciela 22.10.2026; kontrakt: docs/monetyzacja-badanie-2026-10.md rozdz. 11): aplikacja darmowa bez okresu próbnego,
 * limit dni treningowych w miesiącu, Pro bez limitu. Liczba z kontraktu; gdy kod ma już stałą PAYWALL.FREE_TRAINING_DAYS_PER_MONTH — test pilnuje zgodności. */
const FREE_DAYS = 5;
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
  test('opis i tekst promocyjny w każdej lokalizacji (M5, 22.10.2026; model M5 S1): limity 4000 / 170 znaków, linki Warunków i Polityki prywatności, 35 języków, limit darmowych dni w opisie i tekście promocyjnym, bez okresu próbnego (14), przypis espresso', () => {
    for (const [l, v] of Object.entries(L)) {
      const d = v.description ?? ''; const p = v.promotionalText ?? '';
      const foot = d.split('\n').filter((x) => x.startsWith('* '));
      const rest = d.split('\n').filter((x) => !x.startsWith('* ')).join('\n').replace(TERMS_URL, '').replace(PRIVACY_URL, '');
      expect({ l, d: [...d].length > 800 && [...d].length <= 4000, p: p.length > 40 && [...p].length <= 170, terms: d.includes(TERMS_URL), privacy: d.includes(PRIVACY_URL),
        jezyki: new RegExp(`(^|\\D)${LANGS.length}(\\D|$)`).test(d), bezProby: !/(^|\D)14(\D|$)/.test(d + p), limit: new RegExp(`(^|\\D)${FREE_DAYS}(\\D|$)`).test(d) && new RegExp(`(^|\\D)${FREE_DAYS}(\\D|$)`).test(p),
        przypis: foot.length === 1 && /1[.,]06/.test(foot[0]) && /1[.,]51/.test(foot[0]) && /MIMIT/.test(foot[0]) && /2026/.test(foot[0]),
        kwoty: /\d+[.,]\d\d\s*(zł|PLN|USD|EUR|GBP|€|\$|£)|(USD|EUR|GBP|€|\$|£)\s*\d/.test(rest + p), marki: namesIn(`${d} ${p}`) })
        .toEqual({ l, d: true, p: true, terms: true, privacy: true, jezyki: true, bezProby: true, limit: true, przypis: true, kwoty: false, marki: [] });
    }
  });
  test('limit darmowych dni zgodny z kodem, gdy kod ma już stałą modelu M5 S1', () => {
    const k = (PAYWALL as unknown as Record<string, unknown>).FREE_TRAINING_DAYS_PER_MONTH;
    if (k !== undefined) expect(k).toBe(FREE_DAYS);
  });
  test('en-AU = en-GB i en-CA = en-US także w opisie i tekście promocyjnym (decyzja STOP 1, 21.10.2026)', () => {
    expect([L['en-AU'].description, L['en-AU'].promotionalText]).toEqual([L['en-GB'].description, L['en-GB'].promotionalText]);
    expect([L['en-CA'].description, L['en-CA'].promotionalText]).toEqual([L['en-US'].description, L['en-US'].promotionalText]);
  });
  test('bez nazw innych aplikacji i marek (wytyczna 2.3.7) i bez kwot w polach', () => {
    for (const [l, v] of Object.entries(L)) {
      const all = `${names[l]} ${v.subtitle} ${v.keywords}`;
      expect({ l, marki: namesIn(all), kwoty: /\d+[,.]\d\d|zł|PLN|USD|EUR|€|\$|£/.test(all) }).toEqual({ l, marki: [], kwoty: false });
    }
  });
});
