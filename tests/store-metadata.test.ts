/* Metadane App Store Connect (store/app-store-metadata.json, docs/41 D2–D4): limity pól wg App Store Connect Help (przeczytane 14.10.2026 —
 * „Subtitle … can't be longer than 30 characters”, „Keywords … up to 100 bytes”, „Promotional Text … can't be longer than 170 characters”,
 * opis do 4000 znaków), decyzje właściciela 14.10.2026 (D-1 P, D-4 A, nazwa „Strażnik progresji”), adresy = lib/products.ts. */
import * as fs from 'fs';
import * as path from 'path';
import { PRIVACY_URL, TERMS_URL } from '@/lib/products';
import { PAYWALL } from '@/lib/access';

const m = JSON.parse(fs.readFileSync(path.join(__dirname, '../store/app-store-metadata.json'), 'utf8'));
const names = JSON.parse(fs.readFileSync(path.join(__dirname, '../store/app-store-names.json'), 'utf8')).names;
const L = m.lokalizacje as Record<string, { subtitle: string; keywords: string; promotionalText: string; description: string }>;

describe('store/app-store-metadata.json', () => {
  test('PL i EN (en-US): wszystkie pola, limity Apple', () => {
    expect(Object.keys(L).sort()).toEqual(['en-US', 'pl']);
    for (const [l, v] of Object.entries(L)) {
      expect({ l, sub: [...v.subtitle].length <= 30, kw: Buffer.byteLength(v.keywords, 'utf8') <= 100, promo: [...v.promotionalText].length <= 170, desc: [...v.description].length <= 4000 })
        .toEqual({ l, sub: true, kw: true, promo: true, desc: true });
      expect(v.keywords.split(',').every(k => k.trim().length > 2 || /^[A-Z]{3}$/.test(k))).toBe(true); /* „each greater than two characters” */
    }
  });
  test('słowa kluczowe nie powtarzają słów z nazwy (Apple: „you shouldn’t duplicate these values in the keyword list”)', () => {
    for (const [l, v] of Object.entries(L)) {
      const own = new Set(`${names[l]}`.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
      expect({ l, dup: v.keywords.toLowerCase().split(',').filter(k => own.has(k.trim())) }).toEqual({ l, dup: [] });
    }
  });
  test('decyzje właściciela 14.10.2026: podtytuł „przejrzysty / clean” (także w pierwszym zdaniu opisu i słowach kluczowych EN), „Strażnik progresji”, płatności od 1.0 bez kwot, warunki i polityka', () => {
    expect(L.pl.subtitle).toBe('Przejrzysty dziennik bez konta'); expect(L['en-US'].subtitle).toBe('Clean gym log. No account.');
    expect(L.pl.description.split('.')[0]).toContain('przejrzysty'); expect(L['en-US'].description.split('.')[0]).toContain('clean');
    expect(L['en-US'].keywords.split(',')).toContain('clean');
    expect(L.pl.description).toContain('STRAŻNIK PROGRESJI'); expect(L['en-US'].description).toContain('PROGRESS GUARD');
    for (const v of Object.values(L)) {
      expect(v.description).toContain(TERMS_URL); expect(v.description).toContain(PRIVACY_URL);
      expect(v.description).toContain(`${PAYWALL.FREE_LIVE_PER_MONTH} `);
      expect(v.description + v.promotionalText).not.toMatch(/\d+[,.]\d\d\s*(zł|PLN|USD|EUR|GBP|€|\$|£)|(zł|PLN|USD|EUR|GBP|€|\$|£)\s*\d/); /* bez kwot */
    }
  });
});
