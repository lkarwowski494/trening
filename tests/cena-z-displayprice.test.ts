/*
 * Waluta na ekranie zakupu (build 1031, 27.10.2026; docs/waluta-ekranu-zakupu-1031.md): cena pokazywana użytkownikowi pochodzi WYŁĄCZNIE z `displayPrice` sklepu Apple —
 * bez zapasowej ceny, twardej waluty, pamięci podręcznej cen ani własnego formatowania. Strażnik: kod aplikacji nie zawiera symboli ani kodów walut, `Intl.NumberFormat`,
 * `toLocaleString` na cenach, a `StoreProduct` ma tylko pole `displayPrice` (bez `price`/`currency`). Ceny testowe żyją wyłącznie w lib/store-fake.ts.
 */
import * as fs from 'fs';
import * as path from 'path';
import { productFromStore } from '@/lib/store-native';
import { PRODUCT_IDS } from '@/lib/products';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const code = (f: string) => read(f).replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
const FILES = ['lib/store-native.ts', 'lib/store-adapter.ts', 'lib/products.ts', 'lib/entitlement.ts', 'app/paywall.tsx', 'components/SubscriptionCard.tsx'];

describe('cena na ekranie zakupu = displayPrice sklepu', () => {
  test.each(FILES)('%s: bez symboli i kodów walut, bez Intl/toLocaleString, bez pamięci podręcznej cen', f => {
    const c = code(f);
    expect(c).not.toMatch(/[$€£]\s?\d|\d\s?(zł|PLN|USD|EUR|GBP)\b|'(USD|PLN|EUR|GBP)'|"(USD|PLN|EUR|GBP)"/);
    expect(c).not.toMatch(/Intl\.NumberFormat|toLocaleString|toFixed/);
    expect(c).not.toMatch(/AsyncStorage|SecureStore|kv.*price|cachedPrice|lastPrice/i);
  });
  test('produkt ze sklepu: cena = displayPrice bez zmian (także USD przy dowolnym storefroncie); pola price/currency nie trafiają do aplikacji', () => {
    const p = productFromStore({ id: PRODUCT_IDS.monthly, displayPrice: '$0.99', price: 0.99, currency: 'USD', subscriptionPeriodUnitIOS: 'month' })!;
    expect(p).toEqual({ plan: 'monthly', productId: PRODUCT_IDS.monthly, displayPrice: '$0.99', period: 'month' });
    expect(Object.keys(p).sort()).toEqual(['displayPrice', 'period', 'plan', 'productId']);
    expect(productFromStore({ id: PRODUCT_IDS.yearly, displayPrice: '19,99 zł', subscriptionPeriodUnitIOS: 'year' })!.displayPrice).toBe('19,99 zł');
  });
  test('ceny testowe ($0.99 / $6.99 / $14.99) tylko w sztucznym sklepie; sztuczny sklep tylko przy EXPO_PUBLIC_STORE_FAKE', () => {
    const src = ['lib', 'app', 'components'].flatMap(d => fs.readdirSync(path.join(root, d), { recursive: true } as never).map(String).filter(f => /\.tsx?$/.test(f)).map(f => `${d}/${f}`));
    const withPrices = src.filter(f => /\$0\.99|\$6\.99|\$14\.99/.test(code(f)));
    expect(withPrices).toEqual(['lib/store-fake.ts']);
    expect(code('lib/products.ts')).toMatch(/EXPO_PUBLIC_STORE_FAKE === '1'/);
  });
});
