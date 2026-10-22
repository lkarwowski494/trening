/*
 * Ceny wg decyzji właściciela: 13.10.2026 (M1, docs/18) miesięczna 0,99 i dożywotnia 14,99; 20.10.2026 roczna 6,99 USD (zastępuje 4,99 z 13–14.10.2026; docs/18)
 * w USD/EUR/GBP; PL 4,99 / 19,99 / 59,99 zł (14.10.2026: miesięczna 4,99, bo 3,99 nie ma w siatce Apple; docs/18). Jedno źródło dla sztucznego sklepu i testów: FAKE_PRICES (lib/store-fake.ts).
 * Pilnuje zgodności z FAKE_PRICES: store/Trening.storekit, docs/27 (rozdz. 1), docs/15, brak starych cen (roczna 4,99 USD / dożywotnia 21,99) poza zapisem historii.
 */
import * as fs from 'fs';
import * as path from 'path';
import { FAKE_PRICES, PLN_PRICES } from '@/lib/store-fake';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const num = (s: string) => s.replace('$', '');
const pl = (s: string) => num(s).replace('.', ',');

describe('ceny M1 (13.10.2026, stan App Store Connect 14.10.2026)', () => {
  test('PLN_PRICES: 4,99 / 19,99 / 59,99 zł (roczna = 4 miesięczne, dożywotnia = 3 roczne)', () => {
    expect(PLN_PRICES).toEqual({ monthly: '4,99 zł', yearly: '19,99 zł', lifetime: '59,99 zł' });
    const v = (s: string) => parseFloat(s.replace(',', '.'));
    expect(Math.round(v(PLN_PRICES.monthly) * 4)).toBe(Math.round(v(PLN_PRICES.yearly))); expect(Math.round(v(PLN_PRICES.yearly) * 3)).toBe(Math.round(v(PLN_PRICES.lifetime)));
  });
  test('ASC w .storekit: Family Sharing we wszystkich trzech, bez ofert wprowadzających (M5 S1), roczna poziom 1, miesięczna poziom 2', () => {
    const f = JSON.parse(read('store/Trening.storekit'));
    const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions); const all = [...f.products, ...subs];
    expect(all).toHaveLength(3); for (const x of all) expect(x.familyShareable).toBe(true);
    for (const x of subs) expect(x.introductoryOffer).toBeUndefined();
    const sub = (id: string) => subs.find((x: any) => x.productID.endsWith(id));
    expect(sub('.yearly').groupNumber).toBe(1); expect(sub('.monthly').groupNumber).toBe(2);
    expect(sub('.monthly').recurringSubscriptionPeriod).toBe('P1M'); expect(sub('.yearly').recurringSubscriptionPeriod).toBe('P1Y');
    expect(f.products[0].type).toBe('NonConsumable');
  });
  test('FAKE_PRICES: 0,99 / 6,99 / 14,99 (roczna 6,99 USD — decyzja właściciela 20.10.2026; proporcje 5× i 3× z 13.10 nie obowiązują)', () => {
    expect(FAKE_PRICES).toEqual({ monthly: '$0.99', yearly: '$6.99', lifetime: '$14.99' });
    const cents = (s: string) => Math.round(parseFloat(num(s)) * 100);
    expect(cents(FAKE_PRICES.yearly)).toBeGreaterThan(cents(FAKE_PRICES.monthly)); expect(cents(FAKE_PRICES.lifetime)).toBeGreaterThan(cents(FAKE_PRICES.yearly)); /* kolejność: miesięczna < roczna < dożywotnia */
  });
  test('README (gen:pricing) i docs/15 pokazują ceny z FAKE_PRICES, docs/18 zapisuje decyzję 20.10.2026 z odrzuconą ceną 4,99', () => {
    const r = read('README.md'); const g = r.slice(r.indexOf('<!-- gen:pricing -->'), r.indexOf('<!-- /gen:pricing -->'));
    expect(g).toMatch(new RegExp(`Roczny[^\\n]*\\| ${num(FAKE_PRICES.yearly).replace('.', '\\.')} \\|`));
    const d = read('docs/18-przekazanie.md'); const i = d.indexOf('20.10.2026 (właściciel): cena roczna'); expect(i).toBeGreaterThan(-1);
    expect(d.slice(i, i + 1200)).toContain('6,99'); expect(d.slice(i, i + 1200)).toContain('odrzucon');
  });
  test('store/Trening.storekit ma te same ceny co FAKE_PRICES', () => {
    const f = JSON.parse(read('store/Trening.storekit'));
    const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions);
    const byId = (id: string) => [...f.products, ...subs].find((x: any) => x.productID.endsWith(id));
    expect(byId('.monthly').displayPrice).toBe(num(FAKE_PRICES.monthly));
    expect(byId('.yearly').displayPrice).toBe(num(FAKE_PRICES.yearly));
    expect(byId('.lifetime').displayPrice).toBe(num(FAKE_PRICES.lifetime));
  });
  test('docs/27 rozdz. 1: tabela ma ceny z FAKE_PRICES i PL z PLN_PRICES', () => {
    const d = read('docs/27-subskrypcja-spec.md');
    const row = (label: string) => d.split('\n').find(l => l.startsWith('| ' + label)) ?? '';
    expect(row('Subskrypcja miesięczna')).toContain(`${pl(FAKE_PRICES.monthly)} USD`); expect(row('Subskrypcja miesięczna')).toContain(PLN_PRICES.monthly);
    expect(row('Subskrypcja roczna')).toContain(`${pl(FAKE_PRICES.yearly)} USD`); expect(row('Subskrypcja roczna')).toContain(PLN_PRICES.yearly);
    expect(row('Dostęp dożywotni')).toContain(`${pl(FAKE_PRICES.lifetime)} USD`); expect(row('Dostęp dożywotni')).toContain(PLN_PRICES.lifetime);
    expect(d).toContain('13.10.2026');
  });
  test('docs/15: zapis zmian cen zostaje (13.10, 20.10); blok cenowy opisu bez kwot — decyzja właściciela 21.10.2026 (docs/18, docs/research/espresso-mimit-2026-10.md)', () => {
    const d = read('docs/15-app-store.md');
    expect(d).toContain('ZMIANA CENY ROCZNEJ (decyzja właściciela 20.10.2026');
    expect(d).toMatch(/ZMIANA CEN \(decyzja właściciela 13\.10\.2026[^)]*docs\/18/);
    /* 21.10.2026: kwoty z opisu usunięte (opis EN widzą kraje z innymi cenami; ceny pokazuje App Store) — wcześniejsze asercje kwot w opisie zastąpione */
    expect(d).not.toContain(`0.99 per month or ${num(FAKE_PRICES.yearly)} per year`);
    expect(d).not.toContain(`${PLN_PRICES.monthly} miesięcznie lub ${PLN_PRICES.yearly} rocznie`);
    const m = JSON.parse(read('store/app-store-metadata.json')).lokalizacje; /* od 22.10.2026 opis w jednym miejscu: store/app-store-metadata.json */
    expect(m.pl.description).toContain('plan miesięczny w cenie porównywalnej z jednym espresso w barze*');
    expect(m['en-US'].description).toContain('monthly plan for about the price of one espresso at a bar*');
    expect(read('docs/18-przekazanie.md')).toMatch(/opis bez list kwot/);
  });
  test('docs/18: wpis z 14.10.2026 opisuje ceny PL, Family Sharing, darmowe 14 dni, poziomy, Billing Grace Period i Standard EULA', () => {
    const d = read('docs/18-przekazanie.md'); const i = d.indexOf('14.10.2026 (właściciel): ceny w App Store Connect'); expect(i).toBeGreaterThan(-1);
    const e = d.slice(i, i + 4000);
    for (const k of ['4,99 zł', '19,99 zł', '59,99 zł', '24,99', '69,99', 'Family Sharing', 'armowy miesiąc', 'poziom 1', 'poziom 2', 'Billing Grace Period', '3 dni', 'All Renewals', 'Standard EULA', 'DSA', '9+']) expect(e).toContain(k);
  });
  test('stara cena roczna 4,99 USD i dożywotnia 21,99 nie występują w kodzie, testach, .maestro ani w docs/27 (PLN 4,99 zł miesięcznie to inna cena)', () => {
    const files = ['lib/store-fake.ts', 'store/Trening.storekit', 'docs/27-subskrypcja-spec.md', 'tests/subscription-i18n.test.ts', 'tests/subscription-ui.test.tsx', 'tests/store-adapter.test.ts'];
    expect(read('docs/27-subskrypcja-spec.md')).not.toMatch(/3,99 zł/);
    for (const f of files) expect(read(f)).not.toMatch(/(?<![\d.,])\$4\.99|(?<![\d.,])4[.,]99 USD|(?<![\d.,])21[.,]99/);
    expect(JSON.parse(read('store/Trening.storekit')).subscriptionGroups.flatMap((g: any) => g.subscriptions).map((x: any) => x.displayPrice)).not.toContain('4.99');
    const m = fs.readdirSync(path.join(root, '.maestro')).filter(f => f.endsWith('.yaml'));
    for (const f of m) expect(read('.maestro/' + f)).not.toMatch(/(?<![\d.,])\$4\.99|(?<![\d.,])21[.,]99/);
  });
});
