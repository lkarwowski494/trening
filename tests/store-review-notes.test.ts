/* Notatki dla recenzenta App Store (store/review-notes.md, docs/41-droga-do-app-store.md A5 i B5; odświeżone przez M8 21.10.2026): limit pola,
 * teksty przycisków zgodne z aplikacją, liczby z kodu (okres próbny, limit), stan domyślny głosu i Zdrowia, bez danych osobowych (repo publiczne — CLAUDE.md). */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { PAYWALL } from '@/lib/access';
import { VOICE_NEW_INSTALL } from '@/lib/voice';
import { defaultSettings } from '@/lib/seed';

const md = fs.readFileSync(path.join(__dirname, '../store/review-notes.md'), 'utf8');
const blocks = md.split('```text').slice(1).map(b => b.split('```')[0]);
const [en, pl, subEn] = blocks;
const enValues = new Set(Object.values(EN as Record<string, string>));
const section = (text: string, head: string) => text.split(/\n(?=[A-ZĄĆĘŁŃÓŚŹŻ ]{5,}(?:\(|\n))/).find(s => s.startsWith(head)) ?? '';

describe('store/review-notes.md', () => {
  test('trzy bloki (EN do wklejenia, PL dla właściciela, notatka subskrypcji); EN mieści się w polu Notes (4000 bajtów wg App Store Connect Help)', () => {
    expect(blocks).toHaveLength(3); expect(Buffer.byteLength(en, 'utf8')).toBeLessThanOrEqual(4000);
  });
  test('przyciski i ekrany cytowane w EN istnieją w tekstach aplikacji (lib/i18n.en.ts), a w PL — jako klucze', () => {
    const quoted = [...en.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    expect(quoted.length).toBeGreaterThan(5);
    for (const q of quoted) expect([q, enValues.has(q)]).toEqual([q, true]);
    for (const q of [...pl.matchAll(/„([^”]+)”/g)].map(m => m[1])) expect([q, q in (EN as Record<string, string>)]).toEqual([q, true]);
  });
  test('liczby zgodne z kodem: limit darmowych dni treningowych w miesiącu; bez okresu próbnego i bez ofert wprowadzających (M5 S1)', () => {
    expect(en).toContain(`${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} training days per calendar month`); expect(pl).toContain(`${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} dni treningowych`);
    for (const b of [en, subEn, pl]) expect(b).not.toMatch(/[0-9]+-day (free|trial)|[0-9]+ dni (za darmo|okresu próbnego)|free for [0-9]+ days|after the first finished workout|po pierwszym zakończonym treningu/i);
    expect(md).not.toMatch(/one-month|free month|darmow\w* (pierwsz\w* )?miesiąc/i);
  });
  test('stan domyślny zgodny z kodem: głos po instalacji wyłączony, zapis do Zdrowia wyłączony', () => {
    expect(VOICE_NEW_INSTALL).toBe('off'); expect(defaultSettings().healthSync).toBe(false);
    expect(section(en, 'VOICE')).toContain('off by default'); expect(section(pl, 'ZAPOWIEDZI')).toContain('domyślnie wyłączone');
    expect(section(en, 'APPLE HEALTH')).toContain('off by default'); expect(section(pl, 'APPLE HEALTH')).toContain('domyślnie wyłączone');
  });
  test('bez danych osobowych: jedyny adres e-mail to adres wsparcia, bez numerów telefonu i haseł', () => {
    expect([...md.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map(m => m[0]).filter(a => a !== 'support@apps4brew.com')).toEqual([]);
    expect(md).not.toMatch(/\+?\d[\d ]{8,}\d/); expect(md).not.toMatch(/password:|hasło:/i);
  });
});
