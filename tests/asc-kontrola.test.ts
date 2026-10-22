/*
 * Kontrola ustawień App Store Connect, TYLKO ODCZYT (decyzja właściciela 21.10.2026). Narzędzie i testy jego logiki (atrapa API, maskowanie, brak metod zapisu,
 * niezależność od aplikacji, kształt workflow wspólnego) są we wspólnym repozytorium narzędzi studia (lkarwowski494/apps4brew-narzedzia, katalog testy/).
 * Tutaj zostaje to, co należy do aplikacji: konfiguracja store/asc-kontrola.json zgodna z docs/monetyzacja.md i kodem oraz cienki workflow asc-kontrola.yml
 * przypięty do SHA narzędzia.
 */
import * as fs from 'fs';
import * as path from 'path';
import { PRODUCT_IDS } from '@/lib/products';
import { FAKE_PRICES, PLN_PRICES } from '@/lib/store-fake';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const config = JSON.parse(read('store/asc-kontrola.json'));

const pl = (n: number) => n.toFixed(2).replace('.', ',');

describe('store/asc-kontrola.json: oczekiwane wartości zgodne z docs/monetyzacja.md i kodem (liczby w jednym miejscu)', () => {
  const doc = read('docs/monetyzacja.md');
  const sekcja = doc.slice(doc.indexOf('## Ceny w App Store Connect'));
  const komorki = (plan: string) => (sekcja.split('\n').find(l => l.startsWith(`| ${plan} |`)) ?? '').split('|').slice(2, -1).map(s => s.trim());
  const fmt = (v: number | null | undefined) => (v === null || v === undefined ? '[OTWARTE]' : pl(v));
  test.each(['monthly', 'yearly', 'lifetime'] as const)('tabela cen w docs/monetyzacja.md = ceny %s w konfiguracji (USA, Polska, strefa euro, Wielka Brytania)', klucz => {
    const plan = { monthly: 'miesięczna', yearly: 'roczna', lifetime: 'dożywotnia' }[klucz];
    const c = config.ceny[klucz];
    expect(komorki(plan)).toEqual([fmt(c.USA), fmt(c.POL), fmt(c.strefaEuro), fmt(c.GBR)]);
  });
  test.each(['monthly', 'yearly', 'lifetime'] as const)('USA i Polska (%s) = FAKE_PRICES i PLN_PRICES w kodzie', klucz => {
    expect(pl(config.ceny[klucz].USA)).toBe(FAKE_PRICES[klucz].replace('$', '').replace('.', ','));
    expect(`${pl(config.ceny[klucz].POL)} zł`).toBe(PLN_PRICES[klucz]);
  });
  test('identyfikatory produktów = PRODUCT_IDS; rodzaje; Family Sharing dla wszystkich (decyzja 11.10.2026)', () => {
    for (const [klucz, productId] of Object.entries(PRODUCT_IDS)) {
      const p = config.produkty.find((x: any) => x.klucz === klucz);
      expect(p.productId).toBe(productId); expect(p.rodzaj).toBe(klucz === 'lifetime' ? 'jednorazowy' : 'subskrypcja'); expect(config.rodzina[klucz]).toBe(true);
    }
    expect(config.produkty).toHaveLength(Object.keys(PRODUCT_IDS).length);
  });
  test('identyfikator pakietu = app.json; brak ofert wprowadzających w obu subskrypcjach (M5 S1, R-M5-3)', () => {
    expect(config.aplikacja.bundleId).toBe(JSON.parse(read('app.json')).expo.ios.bundleIdentifier);
    expect(config.oferta).toEqual({ produkty: ['monthly', 'yearly'], brak: true });
  });
  test('terytoria: wymagana ósemka, strefa euro 21 krajów bez powtórzeń i z krajami z listy wybranych', () => {
    expect(config.terytoria.wybrane).toEqual(['USA', 'POL', 'DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'GBR']);
    const euro: string[] = config.terytoria.grupy.strefaEuro; expect(new Set(euro).size).toBe(euro.length); expect(euro).toHaveLength(21);
    for (const t of ['DEU', 'FRA', 'ITA', 'ESP', 'NLD']) expect(euro).toContain(t);
  });
  test('metadane: źródła opisują rzeczywiste pliki sklepu (kod lokalizacji → nazwa / podtytuł / słowa); gdy plik jest w repo, ścieżki i pola istnieją', () => {
    expect(config.metadane.zrodla.map((z: any) => z.plik)).toEqual(['store/app-store-names.json', 'store/app-store-metadata.json']);
    for (const z of config.metadane.zrodla) {
      if (!fs.existsSync(path.join(ROOT, z.plik))) continue; /* app-store-metadata.json dojdzie ze scaleniem przebiegu M5 (docs/45) */
      const dane = JSON.parse(read(z.plik)); const wpisy = Object.entries(dane[z.korzen]).filter(([k]) => !k.startsWith('_'));
      expect(wpisy.length).toBeGreaterThan(20);
      for (const [, wpis] of wpisy) for (const klucz of Object.values(z.pola) as (string | null)[]) expect(typeof (klucz === null ? wpis : (wpis as any)[klucz])).toBe('string');
    }
  });
  test('adresy: plik store/app-store-urls.json istnieje i ma trzy adresy; kategoria Health & Fitness, dodatkowa nie ustalona', () => {
    const u = JSON.parse(read(config.adresy.plik)); for (const k of ['privacyPolicyUrl', 'supportUrl', 'marketingUrl']) expect(u[k]).toMatch(/^https:\/\//);
    expect(config.kategoria).toEqual({ glowna: 'HEALTH_AND_FITNESS', dodatkowa: null });
  });
});


describe('workflow asc-kontrola.yml: cienka warstwa wywołująca narzędzie studia', () => {
  const cienki = read('.github/workflows/asc-kontrola.yml');
  test('tylko ręcznie (wejście szczegoly), odczyt treści, bez harmonogramu i wypchnięć', () => {
    expect(cienki).toMatch(/\non:\n  workflow_dispatch:\n    inputs:\n      szczegoly:\n[\s\S]*?type: boolean\n\s+default: false\n/);
    expect(cienki).not.toMatch(/schedule:|\bpush:|pull_request|workflow_call/); expect(cienki).toMatch(/permissions:\n\s+contents: read\n/); expect(cienki).not.toMatch(/contents: write/);
  });
  test('wywołuje workflow narzędzi przypięty do pełnego SHA (40 znaków hex), nie do gałęzi; konfiguracja store/asc-kontrola.json', () => {
    const m = cienki.match(/uses: lkarwowski494\/apps4brew-narzedzia\/\.github\/workflows\/asc-kontrola\.yml@([^\s]+)\n/);
    expect(m).not.toBeNull(); expect(m![1]).toMatch(/^[0-9a-f]{40}$/);
    expect(cienki).toMatch(/with:\n\s+config: store\/asc-kontrola\.json\n\s+szczegoly: \$\{\{ inputs\.szczegoly \}\}\n/);
    expect(cienki).not.toContain('./.github/workflows/asc-kontrola-wspolna.yml'); expect(fs.existsSync(path.join(ROOT, '.github/workflows/asc-kontrola-wspolna.yml'))).toBe(false);
    expect(fs.existsSync(path.join(ROOT, 'narzedzia'))).toBe(false); /* narzędzie mieszka we wspólnym repozytorium, tu nie ma kopii */
  });
  test('sekrety przekazane jawnie: dokładnie ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8 (bez secrets: inherit)', () => {
    expect(cienki).toMatch(/secrets:\n      ASC_KEY_ID: \$\{\{ secrets\.ASC_KEY_ID \}\}\n      ASC_ISSUER_ID: \$\{\{ secrets\.ASC_ISSUER_ID \}\}\n      ASC_KEY_P8: \$\{\{ secrets\.ASC_KEY_P8 \}\}\n/);
    expect(cienki).not.toMatch(/secrets: inherit/); expect([...(cienki.match(/secrets\.[A-Z_0-9]+/g) || [])].sort()).toEqual(['secrets.ASC_ISSUER_ID', 'secrets.ASC_KEY_ID', 'secrets.ASC_KEY_P8']);
  });
  test('workflow opisany w README repozytorium (WORKFLOW_ROLE); warstwa wspólna nie jest już w tym repozytorium', () => {
    const r = read('scripts/readme.mjs'); expect(r).toContain("'asc-kontrola.yml':"); expect(r).not.toContain('asc-kontrola-wspolna');
  });
});
