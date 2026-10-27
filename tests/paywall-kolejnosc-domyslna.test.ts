/*
 * Strażnik decyzji produktowych o ekranie zakupu (właściciel 27.10.2026, zastępuje decyzję z 23.10.2026, docs/18): kolejność planów roczny → miesięczny → dożywotni,
 * domyślnie zaznaczony roczny. Decyzja z 23.10 (miesięczny pierwszy i domyślny) była zapisana w docs/18, ale nigdy niewdrożona ani przypięta testem — wyszło dopiero z telefonu (lekcja w docs/40).
 * Strażnik mechanizmu z tej lekcji (każdy wpis decyzji w docs/18 ma pole wdrożenia i test albo powód; od 28.10.2026 test zawiera datę decyzji):
 * tests/decyzje-straznik.test.ts i `npm run check:decyzje` (scripts/decyzje.mjs; M1-audytor-generalny-009, DEC-02 a) — zastępuje tu dawną regułę słów kluczowych od 28.10.2026.
 */
import * as fs from 'fs';
import * as path from 'path';
import { PLAN_ORDER } from '@/lib/products';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');

describe('ekran zakupu: kolejność planów i plan domyślny (decyzja 27.10.2026)', () => {
  test('PLAN_ORDER: roczny, miesięczny, dożywotni', () => { expect(PLAN_ORDER).toEqual(['yearly', 'monthly', 'lifetime']); });
  test('domyślnie zaznaczony plan na ekranie zakupu to pierwszy z PLAN_ORDER (roczny)', () => {
    const src = read('app/paywall.tsx'); const m = /useState<EntitlementPlan>\('(\w+)'\)/.exec(src);
    expect(m).not.toBeNull(); expect(m![1]).toBe(PLAN_ORDER[0]); expect(m![1]).toBe('yearly');
  });
  test('lista planów jest wyświetlana w kolejności PLAN_ORDER, nie w kolejności zwróconej przez sklep', () => {
    expect(read('app/paywall.tsx')).toContain('PLAN_ORDER.map(plan => products.find(p => p.plan === plan))');
  });
});

describe('docs/18: wpis decyzji z 27.10.2026 o kolejności planów', () => {
  test('wpis z 27.10.2026 o kolejności planów wskazuje ten plik testu', () => {
    const l = read('docs/18-przekazanie.md').split('\n').find(x => /^- 27\.10\.2026 ~16:00 UTC \(właściciel, test na telefonie, build 1031\)/.test(x))!;
    expect(l).toContain('[test: tests/paywall-kolejnosc-domyslna.test.ts]'); expect(read('docs/18-przekazanie.md')).toContain('ZASTĄPIONE 27.10.2026');
  });
});
