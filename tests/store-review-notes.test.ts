/* Notatki dla recenzenta App Store (store/review-notes.md, docs/41-droga-do-app-store.md, 14.10.2026): limit pola, teksty przycisków zgodne
 * z aplikacją, bez danych osobowych (repo publiczne — CLAUDE.md). */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { PAYWALL } from '@/lib/access';

const md = fs.readFileSync(path.join(__dirname, '../store/review-notes.md'), 'utf8');
const blocks = md.split('```text').slice(1).map(b => b.split('```')[0]);
const [en, pl] = blocks;
const enValues = new Set(Object.values(EN as Record<string, string>));

describe('store/review-notes.md', () => {
  test('dwa bloki (EN do wklejenia, PL dla właściciela); EN mieści się w polu Notes (4000 bajtów wg App Store Connect Help)', () => {
    expect(blocks).toHaveLength(2); expect(Buffer.byteLength(en, 'utf8')).toBeLessThanOrEqual(4000);
  });
  test('przyciski i ekrany cytowane w EN istnieją w tekstach aplikacji (lib/i18n.en.ts), a w PL — jako klucze', () => {
    const quoted = [...en.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    expect(quoted.length).toBeGreaterThan(5);
    for (const q of quoted) expect([q, enValues.has(q)]).toEqual([q, true]);
    for (const q of [...pl.matchAll(/„([^”]+)”/g)].map(m => m[1])) expect([q, q in (EN as Record<string, string>)]).toEqual([q, true]);
  });
  test('liczby zgodne z kodem: limit darmowych treningów w miesiącu', () => {
    expect(en).toContain(`${PAYWALL.FREE_LIVE_PER_MONTH} live workouts per calendar month`); expect(pl).toContain(`${PAYWALL.FREE_LIVE_PER_MONTH} treningi na żywo`);
  });
  test('bez danych osobowych: jedyny adres e-mail to adres wsparcia, bez numerów telefonu i haseł', () => {
    expect([...md.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map(m => m[0]).filter(a => a !== 'support@apps4brew.com')).toEqual([]);
    expect(md).not.toMatch(/\+?\d[\d ]{8,}\d/); expect(md).not.toMatch(/password:|hasło:/i);
  });
});
