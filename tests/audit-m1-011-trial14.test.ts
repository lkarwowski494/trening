/*
 * Audyt M1 z 19.10.2026, partia 2 — M1-audytor-generalny-011: okres próbny to 14 dni (model stały, 19.10.2026), nie „1 miesiąc”.
 * Pilnuje jednej stałej TRIAL_DAYS, pliku .storekit (oferta wprowadzająca P2W), sztucznego sklepu, ekranu zakupu i wszystkich słowników (35 języków).
 * Ceny i limit darmowych treningów zostają bez zmian (tests/prices-decision.test.ts, tests/access.test.ts).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as products from '@/lib/products';
import { LANGS, applyLang, t } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { createFakeStore } from '@/lib/store-fake';
import { priceLine } from '@/app/paywall';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8'); const DAY = 86400e3;
const KEYS = ['{days} dni za darmo, potem {price}/{period}', 'Zacznij {days} dni za darmo'] as const;
const OLD = ['1 miesiąc za darmo, potem {price}/{period}', 'Zacznij miesiąc za darmo'];
afterEach(() => applyLang('pl'));

describe('M1-011: okres próbny 14 dni', () => {
  test('jedna stała: TRIAL_DAYS = 14, brak TRIAL_MONTHS w kodzie', () => {
    expect((products as any).TRIAL_DAYS).toBe(14); expect((products as any).TRIAL_MONTHS).toBeUndefined();
    for (const f of ['lib/products.ts', 'lib/store-fake.ts', 'app/paywall.tsx', 'scripts/readme.mjs']) expect(read(f)).not.toMatch(/TRIAL_MONTHS/);
  });
  test('store/Trening.storekit: oferta wprowadzająca „free”, 2 tygodnie (P2W) × 1 w obu subskrypcjach; P1M tylko jako okres odnowienia miesięcznej', () => {
    const f = JSON.parse(read('store/Trening.storekit')); const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions);
    expect(subs).toHaveLength(2);
    for (const s of subs) expect(s.introductoryOffer).toMatchObject({ paymentMode: 'free', subscriptionPeriod: 'P2W', numberOfPeriods: 1 });
    expect(subs.filter((s: any) => s.introductoryOffer.subscriptionPeriod === 'P1M')).toEqual([]);
  });
  test('sztuczny sklep: zakup z próbą kończy się po 14 dniach', async () => {
    const now = Date.UTC(2026, 9, 20); jest.useFakeTimers({ now });
    try { for (const plan of ['monthly', 'yearly'] as const) { const f = createFakeStore([]); await f.purchase(plan); const e = (await f.currentEntitlements())[0]; expect(e.trial).toBe(true); expect(e.expiresAt).toBe(now + 14 * DAY); } } finally { jest.useRealTimers(); }
  });
  test('ekran zakupu: wiersz ceny i etykieta przycisku mówią „14” (pl i en); bez słowa „miesiąc za darmo”', () => {
    const p = { plan: 'yearly', productId: 'x', displayPrice: '$4.99', period: 'year', trial: true } as const;
    expect(priceLine(p)).toBe('14 dni za darmo, potem $4.99/rok'); expect(t('Zacznij {days} dni za darmo', { days: 14 })).toBe('Zacznij 14 dni za darmo');
    applyLang('en'); expect(priceLine(p)).toBe('14 days free, then $4.99/year'); expect(t('Zacznij {days} dni za darmo', { days: 14 })).toBe('Start 14 days free');
  });
  test('słowniki: każdy z 35 języków ma oba teksty z {days} i bez starych kluczy „miesiąc”', () => {
    for (const k of KEYS) expect(EN[k]).toMatch(/\{days\}/);
    for (const k of OLD) expect(EN[k]).toBeUndefined();
    const langs = LANGS.filter(l => l !== 'pl' && l !== 'en');
    expect(langs).toHaveLength(33);
    for (const l of langs) {
      const d = LOCALES[l] as Record<string, string>; expect(d).toBeTruthy();
      for (const k of KEYS) { expect([l, k, typeof d[k]]).toEqual([l, k, 'string']); expect([l, k, d[k].includes('{days}')]).toEqual([l, k, true]); expect(d[k]).not.toBe(k); }
      for (const k of OLD) expect([l, k, d[k]]).toEqual([l, k, undefined]);
    }
  });
  test('strażnik: scenariusze Maestro i dokument katalogu przepływów nie obiecują „1 month free”', () => {
    expect(fs.readdirSync(path.join(root, '.maestro')).filter(x => x.endsWith('.yaml') && /1 month free|free month/.test(read('.maestro/' + x)))).toEqual([]);
    expect(read('tests/przeplywy.json')).not.toMatch(/miesiąc za darmo/);
  });
});
