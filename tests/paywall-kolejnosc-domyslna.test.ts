/*
 * Strażnik decyzji produktowych o ekranie zakupu (właściciel 27.10.2026, zastępuje decyzję z 23.10.2026, docs/18): kolejność planów roczny → miesięczny → dożywotni,
 * domyślnie zaznaczony roczny. Decyzja z 23.10 (miesięczny pierwszy i domyślny) była zapisana w docs/18, ale nigdy niewdrożona ani przypięta testem — wyszło dopiero z telefonu (lekcja w docs/40).
 * Drugi strażnik (mechanizm z tej lekcji): wpis decyzji właściciela w docs/18 z datą od 28.10.2026, który ustala kolejność, stan domyślny, liczbę lub limit, ma odnośnik
 * do testu `[test: ścieżka]` (plik istnieje) albo jawne `[bez testu: powód]`.
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

describe('docs/18: decyzja właściciela z liczbą, kolejnością albo stanem domyślnym ma odnośnik do testu', () => {
  const FROM = new Date(2026, 9, 28).getTime(); /* wpisy sprzed tej daty zapisano przed wprowadzeniem reguły */
  const CUE = /kolejno|domyśl|zaznaczon|limit|próg|progi|liczb|ile |co ile|minut|dni w miesiącu/i;
  const entries = read('docs/18-przekazanie.md').split('\n').map((l, i) => ({ l, n: i + 1 })).filter(x => /^- \d{2}\.\d{2}\.2026 \(właściciel/.test(x.l))
    .map(x => { const m = /^- (\d{2})\.(\d{2})\.2026/.exec(x.l)!; return { ...x, t: new Date(2026, +m[2] - 1, +m[1]).getTime() }; }).filter(x => x.t >= FROM && CUE.test(x.l));
  test('każdy taki wpis: [test: istniejący plik] albo [bez testu: powód ≥ 10 znaków]', () => {
    const bad = entries.filter(x => {
      const tests = [...x.l.matchAll(/\[test: ([^\]]+)\]/g)].map(m => m[1].trim());
      if (tests.length) return !tests.every(p => fs.existsSync(path.join(root, p)));
      const no = /\[bez testu: ([^\]]{10,})\]/.exec(x.l); return !no;
    }).map(x => `docs/18:${x.n} ${x.l.slice(0, 80)}`);
    expect(bad).toEqual([]);
  });
  test('sam strażnik rozpoznaje wpis bez odnośnika (próbka) i wpis z odnośnikiem', () => {
    const ok = (l: string) => { const tests = [...l.matchAll(/\[test: ([^\]]+)\]/g)]; return tests.length > 0 || /\[bez testu: ([^\]]{10,})\]/.test(l); };
    expect(ok('- 28.10.2026 (właściciel): kolejność planów X')).toBe(false); expect(ok('- 28.10.2026 (właściciel): kolejność X [test: tests/a.test.ts]')).toBe(true);
    expect(ok('- 28.10.2026 (właściciel): limit [bez testu: tekst bez liczby w kodzie]')).toBe(true); expect(ok('- 28.10.2026 (właściciel): limit [bez testu: x]')).toBe(false);
  });
  test('wpis z 27.10.2026 o kolejności planów wskazuje ten plik testu', () => {
    const l = read('docs/18-przekazanie.md').split('\n').find(x => /^- 27\.10\.2026 ~16:00 UTC \(właściciel, test na telefonie, build 1031\)/.test(x))!;
    expect(l).toContain('[test: tests/paywall-kolejnosc-domyslna.test.ts]'); expect(read('docs/18-przekazanie.md')).toContain('ZASTĄPIONE 27.10.2026');
  });
});
