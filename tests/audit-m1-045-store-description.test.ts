/*
 * M1-audytor-generalny-045: projekt opisu sklepu (docs/15) zgodny z kodem i modelem stałym. Sprawdza:
 *  - docs/monetyzacja.md = jedyne miejsce z modelem (ceny, 14 dni, 4 treningi/mies.) i zgadza się z kodem (FAKE_PRICES, PLN_PRICES, TRIAL_DAYS, PAYWALL, .storekit);
 *  - docs/15 i docs/18 nie podają innych kwot USD/EUR/GBP poza blokami historii (<!-- historia:start --> … <!-- historia:end -->) albo wierszami oznaczonymi jako zastąpione;
 *  - pozostałości EAS (iphone-eas.yml, iphone-local.yml, eas submit/upload) tylko w blokach historii;
 *  - opis PL/EN: odczyt i zapis Zdrowia, Apple Watch, zapowiedzi głosowe, 14 dni; bez kalkulatora talerzy; liczba języków = LANGS.length;
 *    limity znaków/bajtów i tabele liczb zgodne z tekstem; bez nazw aplikacji konkurencji.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS } from '@/lib/i18n';
import { FAKE_PRICES, PLN_PRICES } from '@/lib/store-fake';
import { TRIAL_DAYS } from '@/lib/products';
import { PAYWALL } from '@/lib/access';
import { namesIn, CFG } from './forbidden-names';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const d15 = read('docs/15-app-store.md');
const d18 = read('docs/18-przekazanie.md');

/** Wiersze poza blokami historii. */
function outsideHistory(text: string): { n: number; line: string }[] {
  const out: { n: number; line: string }[] = []; let inH = false;
  text.split('\n').forEach((line, i) => {
    if (line.includes('<!-- historia:start')) inH = true;
    else if (line.includes('<!-- historia:end')) inH = false;
    else if (!inH) out.push({ n: i + 1, line });
  });
  return out;
}
const MARK = /zast[ąę]p|było|~~|odrzucon|\(historia\)|nieaktualn|konkurent/i;
/** Wiersz o cenach planów aplikacji (nie o domenie czy skrzynce). */
const PLAN_CTX = /roczn|miesięczn|dożywotn|subskrypcj|cennik/i;

describe('docs/monetyzacja.md: jedno miejsce modelu, zgodne z kodem', () => {
  const doc = () => (fs.existsSync(path.join(ROOT, 'docs/monetyzacja.md')) ? read('docs/monetyzacja.md') : '');
  test('ceny USD/EUR/GBP, PLN, okres próbny i limit zgodne z kodem i plikiem .storekit', () => {
    const m = doc();
    const usd = (s: string) => s.replace('$', '').replace('.', ',');
    expect(m).toContain(`| miesięczna | ${usd(FAKE_PRICES.monthly)} |`);
    expect(m).toContain(`| roczna | ${usd(FAKE_PRICES.yearly)} |`);
    expect(m).toContain(`| dożywotnia | ${usd(FAKE_PRICES.lifetime)} |`);
    expect(m).toContain(PLN_PRICES.monthly); expect(m).toContain(PLN_PRICES.yearly); expect(m).toContain(PLN_PRICES.lifetime);
    expect(m).toContain(`**${TRIAL_DAYS} dni**`);
    expect(m).toContain(`**${PAYWALL.FREE_LIVE_PER_MONTH} treningi na żywo**`);
    const f = JSON.parse(read('store/Trening.storekit'));
    const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions);
    expect(f.products[0].displayPrice).toBe(FAKE_PRICES.lifetime.replace('$', ''));
    expect(subs.find((x: any) => x.productID.endsWith('.yearly')).displayPrice).toBe(FAKE_PRICES.yearly.replace('$', ''));
    expect(subs.find((x: any) => x.productID.endsWith('.monthly')).displayPrice).toBe(FAKE_PRICES.monthly.replace('$', ''));
  });
  test('wynik bramki W0 oznaczony jako nieustalony w repo (nie zgadujemy)', () => { expect(doc()).toMatch(/W0[^\n]*DO USTALENIA/); });
  test('stan kodu: zakupy za przełącznikiem PAYWALL.ENABLED', () => { expect(doc()).toContain(`PAYWALL.ENABLED = ${PAYWALL.ENABLED}`); });
});

describe('docs/15 i docs/18: brak sprzecznych kwot i pozostałości EAS', () => {
  const AMOUNT = /(\d{1,3})[.,](\d{2})\s*(?:USD|EUR|GBP|\$|€|£)/g;
  const OK = new Set(['0,99', '6,99', '14,99']);
  for (const [name, text] of [['docs/15', d15], ['docs/18', d18]] as const) {
    test(`${name}: kwoty USD/EUR/GBP inne niż 0,99 / 6,99 / 14,99 tylko w historii albo w wierszu „zastąpione/było”`, () => {
      const bad = outsideHistory(text).filter(({ line }) => [...line.matchAll(AMOUNT)].some((x) => !OK.has(`${x[1]},${x[2]}`)) && PLAN_CTX.test(line) && !MARK.test(line)).map((x) => `${name}:${x.n}: ${x.line.trim().slice(0, 100)}`);
      expect(bad).toEqual([]);
    });
  }
  test('docs/15: EAS (iphone-eas.yml, iphone-local.yml, eas submit/upload) tylko w blokach historii albo w wierszu „usunięt”', () => {
    const bad = outsideHistory(d15).filter(({ line }) => /iphone-eas|iphone-local|eas submit|eas upload/i.test(line) && !/usunięt/.test(line)).map((x) => `${x.n}: ${x.line.trim().slice(0, 100)}`);
    expect(bad).toEqual([]);
  });
  test('docs/15 i docs/18: bez nazw aplikacji konkurencji', () => {
    /* aplikacje treningowe = początek wspólnej listy tests/forbidden-names.json (19 pierwszych pozycji, stan 20.10.2026; dalej marki urządzeń i sprzętu); nazw nie powtarzamy w teście */
    const COMP = CFG.names.slice(0, 19); expect(COMP.length).toBeGreaterThan(10);
    const hits: string[] = [];
    for (const [name, text] of [['docs/15', d15], ['docs/18', d18]] as const) text.split('\n').forEach((l, i) => { const f = namesIn(l).filter((n) => COMP.includes(n)); if (f.length) hits.push(`${name}:${i + 1}: ${f.join(',')}`); });
    expect(hits).toEqual([]);
  });
});

describe('docs/15: projekt opisu sklepu zgodny z kodem', () => {
  const sec = (from: string, to: string) => { const a = d15.indexOf(from); const b = d15.indexOf(to, a + 1); expect(a).toBeGreaterThan(-1); expect(b).toBeGreaterThan(a); return d15.slice(a, b); };
  const pl = sec('### Polski (pl)', '### English (en-US)');
  const en = sec('### English (en-US)', '### Rekomendacja nazwy');
  const fenced = (s: string) => { const m = /```text\n([\s\S]*?)```/.exec(s); expect(m).not.toBeNull(); return m![1]; };
  const promo = (s: string) => { const m = /\*\*Tekst promocyjny:\*\*\n\n(.+)\n/.exec(s); expect(m).not.toBeNull(); return m![1]; };
  const kw = (s: string) => { const m = /\*\*Słowa kluczowe\*\*[^\n]*\n\n`([^`]+)`/.exec(s); expect(m).not.toBeNull(); return m![1]; };
  const row = (s: string, label: string) => { const m = new RegExp(`\\| ${label} \\| (\\d+) / (\\d+) \\|`).exec(s) ?? new RegExp(`\\| ${label} \\| (\\d+) / (\\d+) \\|`).exec(s); expect(m).not.toBeNull(); return Number(m![1]); };

  for (const [lang, s] of [['PL', pl], ['EN', en]] as const) {
    const desc = fenced(s);
    test(`${lang}: bez kalkulatora talerzy (opis, słowa kluczowe, tekst promocyjny)`, () => {
      expect(desc + promo(s) + kw(s)).not.toMatch(/talerz|\bplates?\b/i);
    });
    test(`${lang}: pierwsze ${TRIAL_DAYS} dni (nie „miesiąc”), liczba języków = LANGS.length`, () => {
      expect(promo(s)).toMatch(new RegExp(`${TRIAL_DAYS} (dni|days)`));
      expect(desc).toMatch(new RegExp(`${TRIAL_DAYS} (dni|days)`));
      expect(desc + promo(s)).not.toMatch(/Pierwszy miesiąc|First month/i);
      expect(desc).toContain(`${LANGS.length} ${lang === 'PL' ? 'języków' : 'languages'}`);
    });
    test(`${lang}: Apple Watch, zapowiedzi głosowe, odczyt i zapis Apple Health, system miar`, () => {
      expect(desc).toMatch(/Apple Watch/);
      expect(desc).toMatch(lang === 'PL' ? /zapowiedzi głosowe/i : /spoken|voice/i);
      expect(desc).toMatch(lang === 'PL' ? /zapis[^\n]*Apple Health/i : /saving[^\n]*Apple Health/i);
      expect(desc).toMatch(lang === 'PL' ? /odczyt[^\n]*Apple Health/i : /read[^\n]*Apple Health|reading[^\n]*Apple Health/i);
      expect(desc).toMatch(lang === 'PL' ? /imperialn/i : /imperial/i);
      expect(desc).not.toMatch(/kg lub lb|kg or lb/);
    });
    test(`${lang}: limity App Store i liczby w tabeli zgodne z tekstem`, () => {
      const d = [...desc.replace(/\n$/, '')].length; const p = [...promo(s)].length; const k = Buffer.byteLength(kw(s), 'utf8');
      expect(d).toBeLessThanOrEqual(4000); expect(p).toBeLessThanOrEqual(170); expect(k).toBeLessThanOrEqual(100);
      expect(row(s, 'Opis')).toBe(d); expect(row(s, 'Tekst promocyjny')).toBe(p);
      expect(row(s, 'Słowa kluczowe')).toBe([...kw(s)].length);
    });
  }
});
