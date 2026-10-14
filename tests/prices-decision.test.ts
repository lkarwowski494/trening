/*
 * Ceny wg decyzji właściciela z 13.10.2026 (M1, docs/18): miesięczna 0,99, roczna = 5 × miesięczna (4,99), dożywotnia = 3 × roczna (14,99)
 * w USD/EUR/GBP; PL 3,99 / 19,99 / 59,99 zł. Jedno źródło dla sztucznego sklepu i testów: FAKE_PRICES (lib/store-fake.ts).
 * Pilnuje zgodności z FAKE_PRICES: store/Trening.storekit, docs/27 (rozdz. 1), docs/15, brak starych cen (6,99 / 21,99) poza zapisem historii.
 */
import * as fs from 'fs';
import * as path from 'path';
import { FAKE_PRICES } from '@/lib/store-fake';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const num = (s: string) => s.replace('$', '');
const pl = (s: string) => num(s).replace('.', ',');

describe('ceny M1 (13.10.2026)', () => {
  test('FAKE_PRICES: 0,99 / 4,99 / 14,99, proporcje 5× i 3×', () => {
    expect(FAKE_PRICES).toEqual({ monthly: '$0.99', yearly: '$4.99', lifetime: '$14.99' });
    const cents = (s: string) => Math.round(parseFloat(num(s)) * 100);
    // M1: roczna = 5 × miesięczna (z zaokrągleniem do punktu cenowego x,99), dożywotnia = 3 × roczna
    expect(Math.round(cents(FAKE_PRICES.monthly) * 5 / 100) * 100 - 1).toBe(cents(FAKE_PRICES.yearly));
    expect(Math.round(cents(FAKE_PRICES.yearly) * 3 / 100) * 100 - 1).toBe(cents(FAKE_PRICES.lifetime));
  });
  test('store/Trening.storekit ma te same ceny co FAKE_PRICES', () => {
    const f = JSON.parse(read('store/Trening.storekit'));
    const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions);
    const byId = (id: string) => [...f.products, ...subs].find((x: any) => x.productID.endsWith(id));
    expect(byId('.monthly').displayPrice).toBe(num(FAKE_PRICES.monthly));
    expect(byId('.yearly').displayPrice).toBe(num(FAKE_PRICES.yearly));
    expect(byId('.lifetime').displayPrice).toBe(num(FAKE_PRICES.lifetime));
  });
  test('docs/27 rozdz. 1: tabela ma ceny z FAKE_PRICES i PL 3,99 / 19,99 / 59,99 zł', () => {
    const d = read('docs/27-subskrypcja-spec.md');
    const row = (label: string) => d.split('\n').find(l => l.startsWith('| ' + label)) ?? '';
    expect(row('Subskrypcja miesięczna')).toContain(`${pl(FAKE_PRICES.monthly)} USD`); expect(row('Subskrypcja miesięczna')).toContain('3,99 zł');
    expect(row('Subskrypcja roczna')).toContain(`${pl(FAKE_PRICES.yearly)} USD`); expect(row('Subskrypcja roczna')).toContain('19,99 zł');
    expect(row('Dostęp dożywotni')).toContain(`${pl(FAKE_PRICES.lifetime)} USD`); expect(row('Dostęp dożywotni')).toContain('59,99 zł');
    expect(d).toContain('13.10.2026');
  });
  test('docs/15: opis EN i blok cen podają ceny M1; odesłanie do docs/18', () => {
    const d = read('docs/15-app-store.md');
    expect(d).toContain(`0.99 per month or ${num(FAKE_PRICES.yearly)} per year`);
    expect(d).toContain(`lifetime access purchase for ${num(FAKE_PRICES.lifetime)}`);
    expect(d).toMatch(/ZMIANA CEN \(decyzja właściciela 13\.10\.2026[^)]*docs\/18/);
  });
  test('stare ceny 6,99 / 21,99 nie występują w kodzie, testach, .maestro ani w docs/27', () => {
    const files = ['lib/store-fake.ts', 'store/Trening.storekit', 'docs/27-subskrypcja-spec.md', 'tests/subscription-i18n.test.ts', 'tests/subscription-ui.test.tsx', 'tests/store-adapter.test.ts'];
    for (const f of files) expect(read(f)).not.toMatch(/6[.,]99|21[.,]99/);
    const m = fs.readdirSync(path.join(root, '.maestro')).filter(f => f.endsWith('.yaml'));
    for (const f of m) expect(read('.maestro/' + f)).not.toMatch(/6[.,]99|21[.,]99/);
  });
});
