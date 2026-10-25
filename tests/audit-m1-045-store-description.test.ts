/*
 * M1-audytor-generalny-045: projekt opisu sklepu (docs/15) zgodny z kodem i modelem stałym. Sprawdza:
 *  - docs/monetyzacja.md = jedyne miejsce z modelem (ceny, 5 dni treningowych/mies., brak okresu próbnego — M5 S1 22.10.2026) i zgadza się z kodem (FAKE_PRICES, PLN_PRICES, PAYWALL, .storekit);
 *  - docs/15 i docs/18 nie podają innych kwot USD/EUR/GBP poza blokami historii (<!-- historia:start --> … <!-- historia:end -->) albo wierszami oznaczonymi jako zastąpione;
 *  - pozostałości EAS (iphone-eas.yml, iphone-local.yml, eas submit/upload) tylko w blokach historii;
 *  - opis PL/EN: odczyt i zapis Zdrowia, Apple Watch, zapowiedzi głosowe, 14 dni; bez kalkulatora talerzy; liczba języków = LANGS.length;
 *    limity znaków/bajtów i tabele liczb zgodne z tekstem; bez nazw aplikacji konkurencji.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS } from '@/lib/i18n';
import { FAKE_PRICES, PLN_PRICES } from '@/lib/store-fake';
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
  test('ceny USD/EUR/GBP, PLN, limit dni i brak okresu próbnego zgodne z kodem i plikiem .storekit', () => {
    const m = doc();
    const usd = (s: string) => s.replace('$', '').replace('.', ',');
    expect(m).toContain(`| miesięczna | ${usd(FAKE_PRICES.monthly)} |`);
    expect(m).toContain(`| roczna | ${usd(FAKE_PRICES.yearly)} |`);
    expect(m).toContain(`| dożywotnia | ${usd(FAKE_PRICES.lifetime)} |`);
    expect(m).toContain(PLN_PRICES.monthly); expect(m).toContain(PLN_PRICES.yearly); expect(m).toContain(PLN_PRICES.lifetime);
    expect(m).toContain(`**${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} dni treningowych**`); expect(m).toContain('**Bez okresu próbnego**'); expect(m).not.toMatch(/\*\*14 dni\*\*/);
    const f = JSON.parse(read('store/Trening.storekit'));
    const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions);
    expect(f.products[0].displayPrice).toBe(FAKE_PRICES.lifetime.replace('$', ''));
    expect(subs.find((x: any) => x.productID.endsWith('.yearly')).displayPrice).toBe(FAKE_PRICES.yearly.replace('$', ''));
    expect(subs.find((x: any) => x.productID.endsWith('.monthly')).displayPrice).toBe(FAKE_PRICES.monthly.replace('$', ''));
  });
  /* bramka W0 przeprowadzona 21.10.2026 (rola 02, decyzja właściciela na STOP 2 M3): wynik ma próg, werdykt i punkt kontrolny z liczbą */
  test('wynik bramki W0 zapisany z progiem, werdyktem i punktem kontrolnym', () => {
    const w0 = doc().split('## Bramka W0')[1]?.split('\n## ')[0] ?? '';
    expect(w0).toMatch(/500 USD netto\/rok/);
    expect(w0).toMatch(/werdykt \*\*wydać\*\*/);
    expect(w0).toMatch(/Punkt kontrolny[^\n]*8 tygodniach[^\n]*310 pobrań[^\n]*75 płacących/);
    expect(w0).not.toMatch(/DO USTALENIA/);
  });
  test('stan kodu: PAYWALL.ENABLED = true w źródle (w Jest wyłączony w setup.js — odczyt pliku)', () => {
    const src = read('lib/access.ts'); expect(src).toMatch(/ENABLED: true,/); expect(doc()).toContain('PAYWALL.ENABLED = true');
  });
});

describe('docs/15 i docs/18: brak sprzecznych kwot i pozostałości EAS', () => {
  const AMOUNT = /(\d{1,3})[.,](\d{2})\s*(?:USD|EUR|GBP|\$|€|£)/g;
  const OK = new Set(['0,99', '6,99', '14,99']);
  for (const [name, text] of [['docs/15', d15], ['docs/18', d18]] as const) {
    test(`${name}: kwoty USD/EUR/GBP inne niż 0,99 / 6,99 / 14,99 tylko w historii albo w wierszu „zastąpione/było”`, () => {
      /* 21.10.2026 (właściciel): roczna w euro = przeliczenie Apple 7,99 € (docs/monetyzacja.md) — dozwolona tylko z walutą euro */
      const ok = (x: RegExpMatchArray) => OK.has(`${x[1]},${x[2]}`) || (`${x[1]},${x[2]}` === '7,99' && /€|EUR/.test(x[0]));
      const bad = outsideHistory(text).filter(({ line }) => [...line.matchAll(AMOUNT)].some((x) => !ok(x)) && PLAN_CTX.test(line) && !MARK.test(line)).map((x) => `${name}:${x.n}: ${x.line.trim().slice(0, 100)}`);
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

describe('store/app-store-metadata.json: opis i tekst promocyjny PL/EN zgodne z kodem (źródło od 22.10.2026, przebieg M5; wcześniej docs/15)', () => {
  const L = JSON.parse(read('store/app-store-metadata.json')).lokalizacje as Record<string, { description: string; promotionalText: string; keywords: string }>;
  for (const [lang, code] of [['PL', 'pl'], ['EN', 'en-US'], ['EN-GB', 'en-GB']] as const) {
    const pl = lang === 'PL';
    const desc = L[code].description; const promo = L[code].promotionalText; const kw = L[code].keywords;
    test(`${lang}: bez kalkulatora talerzy (opis, słowa kluczowe, tekst promocyjny)`, () => {
      expect(desc + promo + kw).not.toMatch(/talerz|\bplates?\b/i);
    });
    test(`${lang}: model M5 S1 (22.10.2026) — darmowe do ${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} dni treningowych w miesiącu, Pro bez limitu, bez okresu próbnego; liczba języków = LANGS.length`, () => {
      expect(desc + promo).not.toMatch(/14 (dni|days)|free trial|No subscriptions?|okres próbny|Pierwszy miesiąc|First month|4 treningi|4 live/i);
      expect(desc).toContain(pl ? `${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} dni treningowych w miesiącu` : `${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} training days a month`);
      expect(desc).toMatch(/\bPro\b/);
      expect(desc).toContain(`${LANGS.length} ${pl ? 'języków' : 'languages'}`);
    });
    test(`${lang}: Apple Watch, zapowiedzi głosowe, odczyt i zapis Apple Health, system miar; nazwy widoków jak w interfejsie`, () => {
      expect(desc).toMatch(/Apple Watch/);
      expect(desc).toMatch(pl ? /zapowiedzi głosowe/i : /spoken|voice/i);
      expect(desc).toMatch(pl ? /zapis[^\n]*Apple Health/i : /saving[^\n]*Apple Health/i);
      expect(desc).toMatch(pl ? /odczyt[^\n]*Apple Health/i : /read[^\n]*Apple Health|reading[^\n]*Apple Health/i);
      expect(desc).toMatch(pl ? /imperialn/i : /imperial/i);
      expect(desc).not.toMatch(/kg lub lb|kg or lb/);
      /* po redesignie M3 (22.10.2026): Ustawienia → „Widok treningu”: „Skupiony” / „Lista”; „Dostosuj do miejsca”; gumy (nie taśmy) */
      expect(desc).toContain(pl ? '„Skupiony”' : '"Focused"'); expect(desc).toContain(pl ? '„Lista”' : '"List"');
      expect(desc).toContain(pl ? '„Dostosuj do miejsca”' : '"Adjust to location"'); expect(desc).not.toMatch(/Taśmy i gumy|"Focus" view|classic list/);
    });
    test(`${lang}: blok cenowy bez list kwot, plan miesięczny porównany z espresso + przypis z przedziałem cen bez źródła (21.10.2026; źródło usunięte z tekstów publicznych 25.10.2026, zostaje w docs/research/espresso-mimit-2026-10.md)`, () => {
      expect(desc).not.toMatch(/\[(BLOK CENOWY|PRICING BLOCK)/);
      expect(desc).toMatch(pl ? /plan miesięczny w cenie porównywalnej z jednym espresso w barze\*/ : /monthly plan for about the price of one espresso at a bar\*/);
      const foot = desc.split('\n').find((l) => l.startsWith('* ')) ?? '';
      expect(foot).toMatch(pl ? /od 1,06 € do 1,51 €/ : /EUR 1\.06–1\.51/);
      expect(foot).not.toMatch(/MIMIT|Assoutenti|C\.r\.c\.|Teleborsa|dane|data from|Ministe/i); expect(foot).toMatch(/2026/); /* 25.10.2026: „całkiem anonimowo” — przypis bez źródła */
      const rest = desc.split('\n').filter((l) => !l.startsWith('* ')).join('\n');
      expect(rest).not.toMatch(/\d+[.,]\d\d\s*(zł|PLN|USD|EUR|GBP|€|\$|£)|(USD|EUR|GBP|€|\$|£)\s*\d/);
      expect(rest).toMatch(pl ? /Aktualne ceny widać w App Store przed zakupem/ : /Current prices are shown in the App Store before purchase/);
    });
    test(`${lang}: limity App Store (opis ≤ 4000, tekst promocyjny ≤ 170 znaków)`, () => {
      expect([...desc].length).toBeLessThanOrEqual(4000); expect([...promo].length).toBeLessThanOrEqual(170);
    });
  }
});
