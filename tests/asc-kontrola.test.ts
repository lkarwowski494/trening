/*
 * Kontrola ustawień App Store Connect, TYLKO ODCZYT (decyzja właściciela 21.10.2026): narzędzie narzedzia/asc-kontrola/ (wspólne dla wielu aplikacji),
 * konfiguracja store/asc-kontrola.json, workflowy asc-kontrola-wspolna.yml (workflow_call) i asc-kontrola.yml (workflow_dispatch).
 * Kontrole działają na atrapie API w procesie potomnym (tests/fixtures/asc-kontrola-driver.mjs — moduły narzędzia to ESM z import.meta).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { PRODUCT_IDS, TRIAL_DAYS } from '@/lib/products';
import { FAKE_PRICES, PLN_PRICES } from '@/lib/store-fake';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const config = JSON.parse(read('store/asc-kontrola.json'));
const TOOL = 'narzedzia/asc-kontrola';
const walk = (d: string): string[] => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

const drive = (mode: string) => JSON.parse(execFileSync('node', [path.join(ROOT, 'tests/fixtures/asc-kontrola-driver.mjs'), mode], { encoding: 'utf8', maxBuffer: 20e6 }));
const row = (r: any, re: RegExp) => r.wyniki.find((x: any) => re.test(x.opis));
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
  test('identyfikator pakietu = app.json; oferta: 14 dni = TWO_WEEKS dla obu subskrypcji, bez dożywotniej', () => {
    expect(config.aplikacja.bundleId).toBe(JSON.parse(read('app.json')).expo.ios.bundleIdentifier);
    expect(TRIAL_DAYS).toBe(14); expect(config.oferta).toEqual({ produkty: ['monthly', 'yearly'], tryb: 'FREE_TRIAL', czas: 'TWO_WEEKS', bezDatyKonca: true });
  });
  test('terytoria: wymagana ósemka, strefa euro 21 krajów bez powtórzeń i z krajami z listy wybranych', () => {
    expect(config.terytoria.wybrane).toEqual(['USA', 'POL', 'DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'GBR']);
    const euro: string[] = config.terytoria.grupy.strefaEuro; expect(new Set(euro).size).toBe(euro.length); expect(euro).toHaveLength(21);
    for (const t of ['DEU', 'FRA', 'ITA', 'ESP', 'NLD']) expect(euro).toContain(t);
  });
  test('adresy: plik store/app-store-urls.json istnieje i ma trzy adresy; kategoria Health & Fitness, dodatkowa nie ustalona', () => {
    const u = JSON.parse(read(config.adresy.plik)); for (const k of ['privacyPolicyUrl', 'supportUrl', 'marketingUrl']) expect(u[k]).toMatch(/^https:\/\//);
    expect(config.kategoria).toEqual({ glowna: 'HEALTH_AND_FITNESS', dodatkowa: null });
  });
});

describe('kontrole na atrapie API', () => {
  test('wszystko zgodne: kod 0, ceny i oferty OK, brak RÓŻNICA i BŁĄD; metadane i notatki jako BRAK DANYCH, etykieta prywatności TYLKO RĘCZNIE', () => {
    const r = drive('zgodne');
    expect(r.code).toBe(0); expect(r.liczby['RÓŻNICA']).toBe(0); expect(r.liczby['BŁĄD']).toBe(0);
    for (const t of ['USA', 'POL', 'DEU', 'FRA', 'ITA', 'ESP', 'NLD']) expect(row(r, new RegExp(`^yearly ${t}:`)).status).toBe('OK');
    expect(row(r, /^yearly GBR:/).status).toBe('OK'); expect(row(r, /^monthly GBR:/).status).toBe('INFO'); expect(row(r, /^lifetime DEU:/).status).toBe('INFO');
    expect(row(r, /^yearly grupa strefaEuro \(21\): jedna kwota 7\.99/).status).toBe('OK'); expect(row(r, /^lifetime grupa strefaEuro/).status).toBe('INFO');
    expect(row(r, /^monthly: FREE_TRIAL, TWO_WEEKS/).status).toBe('OK'); expect(row(r, /^yearly: FREE_TRIAL, TWO_WEEKS/).status).toBe('OK');
    expect(row(r, /Family Sharing lifetime/).status).toBe('OK'); expect(row(r, /Kategoria główna: HEALTH_AND_FITNESS/).status).toBe('OK'); expect(row(r, /Kategoria dodatkowa/).status).toBe('INFO');
    for (const n of ['Privacy Policy URL', 'Support URL', 'Marketing URL']) expect(row(r, new RegExp(`^${n}`)).status).toBe('OK');
    expect(r.wyniki.find((x: any) => x.kontrola.startsWith('Nazwa, podtytuł')).status).toBe('BRAK DANYCH');
    expect(row(r, /oczekiwane po scaleniu M5/).status).toBe('BRAK DANYCH');
    expect(row(r, /^Notatki dla recenzenta/).status).toBe('BRAK DANYCH'); expect(row(r, /^Etykieta prywatności/).status).toBe('TYLKO RĘCZNIE');
    expect(row(r, /^Ocena wiekowa/).status).toBe('INFO'); expect(row(r, /^Dostępność w krajach/).status).toBe('INFO');
  });
  test('cena inna niż oczekiwana: RÓŻNICA i kod 1 (czerwony przebieg)', () => {
    const r = drive('cena-pl'); expect(r.code).toBe(1);
    expect(row(r, /^yearly POL:/)).toMatchObject({ status: 'RÓŻNICA', opis: 'yearly POL: jest 24.99, oczekiwane 19.99' });
  });
  test('cena bieżąca: zakończona i przyszła pozycja harmonogramu nie wpływają na wynik', () => { expect(row(drive('cena-historia'), /^yearly USA:/)).toMatchObject({ status: 'OK', opis: 'yearly USA: 6.99' }); });
  test('strefa euro: różnica jednego kraju wypisana z kodem kraju i kwotą', () => {
    const r = drive('euro-rozne'); expect(r.code).toBe(1);
    const g = row(r, /^yearly grupa strefaEuro/); expect(g.status).toBe('RÓŻNICA'); expect(g.opis).toContain('RÓŻNE KWOTY'); expect(g.opis).toContain('8.99: AUT'); expect(g.opis).toContain('7.99:');
  });
  test('oferty: brak oferty w jednym terytorium, zły tryb, data końca → RÓŻNICA ze szczegółem (kody terytoriów)', () => {
    expect(row(drive('oferta-brak'), /^yearly:/)).toMatchObject({ status: 'RÓŻNICA', opis: expect.stringContaining('bez oferty (1): JPN') });
    expect(row(drive('oferta-tryb'), /^monthly:/).opis).toContain('inny tryb niż FREE_TRIAL: USA');
    expect(row(drive('oferta-koniec'), /^monthly:/).opis).toContain('z datą końca: POL');
  });
  test('Family Sharing wyłączone wbrew decyzji → RÓŻNICA', () => { expect(row(drive('rodzina'), /Family Sharing yearly/)).toMatchObject({ status: 'RÓŻNICA' }); });
  test('kategoria inna niż oczekiwana → RÓŻNICA', () => { expect(row(drive('kategoria'), /Kategoria główna/)).toMatchObject({ status: 'RÓŻNICA', opis: 'Kategoria główna: jest LIFESTYLE, oczekiwane HEALTH_AND_FITNESS' }); });
  test('adresy: Privacy Policy URL inny w jednej lokalizacji → RÓŻNICA z kodem lokalizacji', () => { expect(row(drive('adres-roznica'), /^Privacy Policy URL/)).toMatchObject({ status: 'RÓŻNICA', opis: expect.stringContaining('pl') }); });
  test('metadane z pliku: zgodne → OK dla pól i listy lokalizacji (w tym en-AU, en-CA)', () => {
    const r = drive('meta'); expect(r.code).toBe(0);
    for (const n of ['Lista lokalizacji: 4 zgodnych', 'Nazwa: 4', 'Podtytuł: 4', 'Słowa kluczowe: 4', 'Tekst promocyjny: 4', 'Opis: 4']) expect(r.wyniki.find((x: any) => x.opis.startsWith(n))).toMatchObject({ status: 'OK' });
  });
  test('metadane: różna nazwa w pl i słowa kluczowe w en-US → RÓŻNICA; brakująca lokalizacja en-CA w wersji, ale nie w App Information, nie psuje listy', () => {
    const r = drive('meta-roznica'); expect(r.code).toBe(1);
    expect(row(r, /^Nazwa:/).opis).toBe('Nazwa: różni się w 1 z 4: pl'); expect(row(r, /^Słowa kluczowe:/).opis).toBe('Słowa kluczowe: różni się w 1 z 4: en-US');
  });
  test('metadane: brak lokalizacji w App Store Connect → lista lokalizacji bez błędu, brakujące pole wersji liczone tylko dla istniejących', () => {
    const r = drive('meta-lokale'); expect(row(r, /^Lista lokalizacji/).status).toBe('OK'); expect(row(r, /^Opis:/).opis).toBe('Opis: 3 lokalizacji zgodnych');
  });
  test('recenzent: dane osobowe nigdy w raporcie ani wierszach; puste pole kontaktu → RÓŻNICA; notatki z pliku porównane', () => {
    for (const mode of ['zgodne', 'notatki', 'notatki-roznica', 'recenzent-puste', 'szczegoly']) {
      const r = drive(mode); const all = JSON.stringify(r.wyniki) + r.raport;
      for (const s of ['Jan-Imie-Tajne', 'Kowalski-Tajne', '+48-600-TAJNY', 'recenzent-tajny@example.test', 'Notatki dla recenzenta.', 'Inne notatki']) expect(all).not.toContain(s);
    }
    expect(row(drive('zgodne'), /^Kontakt recenzenta/)).toMatchObject({ status: 'OK', opis: 'Kontakt recenzenta: wszystkie pola ustawione' });
    expect(row(drive('recenzent-puste'), /^Kontakt recenzenta/)).toMatchObject({ status: 'RÓŻNICA', opis: 'Kontakt recenzenta: puste pola: telefon' });
    expect(row(drive('notatki'), /^Notatki dla recenzenta/)).toMatchObject({ status: 'OK' });
    expect(row(drive('notatki-roznica'), /^Notatki dla recenzenta/)).toMatchObject({ status: 'RÓŻNICA' });
  });
  test('szczegóły: lista dostępnych krajów zawsze w raporcie, odpowiedzi wiekowe dopiero z opcją szczegoly', () => {
    const bez = drive('zgodne').raport; const z = drive('szczegoly').raport;
    expect(bez).toContain('dostępne ('); expect(bez).not.toContain('healthOrWellnessTopics = true'); expect(z).toContain('healthOrWellnessTopics = true'); expect(z).toContain('gambling = false');
  });
  test('raport: sekcje według obszarów, tabela ze statusami i podsumowanie z liczbami', () => {
    const t = drive('zgodne').raport;
    for (const h of ['## Ceny', '## Oferty wprowadzające', '## Produkty', '## Adresy', '## Metadane sklepu', '## Aplikacja', '## Informacje dla recenzenta']) expect(t).toContain(h);
    expect(t).toMatch(/Podsumowanie: OK \d+, RÓŻNICA 0, BRAK DANYCH \d+, TYLKO RĘCZNIE 1, INFO \d+, BŁĄD 0/); expect(t).toContain('| Kontrola | Status | Wynik |');
  });
  test('maskowanie: token, identyfikatory obiektów i szczegóły błędów Apple nie trafiają do raportu; błąd odczytu → BŁĄD i kod 1', () => {
    for (const mode of ['zgodne', 'szczegoly', 'blad-403']) {
      const r = drive(mode); const all = JSON.stringify(r) .replace(/"wywolania":\[[^\]]*\]/, '') + r.raport;
      expect(all).not.toMatch(/TOKEN-XYZ|SEKRET-SZCZEGOL|111222|GRP-1|SUB-\d|IAP-1|PS-1|INFO-1|VER-\d|AVAIL-1|Bearer/);
    }
    const r = drive('blad-403'); expect(r.code).toBe(1); expect(r.liczby['BŁĄD']).toBeGreaterThan(0);
    expect(r.wyniki.every((x: any) => x.status === 'BŁĄD' || x.status === 'TYLKO RĘCZNIE')).toBe(true);
    expect(r.wyniki[0].opis).toBe('odczyt nieudany: GET /v1/apps → 403 (FORBIDDEN_ERROR: Forbidden)');
  });
  test('tylko odczyt: wszystkie żądania do API to GET, w dodatku bez ciała', () => {
    const r = drive('zgodne'); expect(r.wywolania.length).toBeGreaterThan(20);
    expect(r.wywolania.every((x: string) => x.startsWith('GET /'))).toBe(true);
  });
  test('JWT ES256: nagłówek, treść (10 minut) i poprawny podpis', () => {
    const r = drive('jwt'); expect(r.header).toEqual({ alg: 'ES256', kid: 'KID1234567', typ: 'JWT' }); expect(r.payload).toEqual({ iss: 'ISSUER', iat: 1000, exp: 1600, aud: 'appstoreconnect-v1' }); expect(r.valid).toBe(true);
  });
  test('funkcje czyste: cena bieżąca, oczekiwana kwota z grupy, wybór wersji wg stanu, ścieżki bez identyfikatorów, lokalizacje', () => {
    const r = drive('czyste');
    expect(r.biezace).toEqual([['X', 2]]); /* cena z przyszłości i zakończona pominięte; z dwóch bieżących wygrywa późniejsza data */
    expect(r.oczek).toEqual([8.5, 7.99, null, null]); /* trzecia wartość to undefined (brak wpisu), w JSON null */
    expect(r.stan).toBe('c'); expect(r.stanPusty).toBeNull();
    expect(r.sciezki).toEqual(['/v1/apps/{id}/appInfos', '/v1/appInfos/{id}/ageRatingDeclaration', '/v2/appAvailabilities/{id}/territoryAvailabilities']);
    expect(r.metaBrakLokalizacji[0][1]).toContain('brakuje'); expect(r.metaBrakLokalizacji[0][0]).toBe('RÓŻNICA');
    expect(r.lokalizacje).toEqual({ zgodne: 1, rozne: ['b', 'c'], puste: ['b'] }); expect(r.kody).toEqual(['A, B', 'A, B +2']);
  });
  test('rejestr kontroli: każda ma id, obszar, nazwę, listę zasobów, dotyczy, pobierz i porownaj; id unikalne', () => {
    const r = drive('czyste'); for (const k of r.kontrole) expect(k).toMatchObject({ pola: [] });
    expect(new Set(r.kontrole.map((k: any) => k.id)).size).toBe(r.kontrole.length);
    expect(r.kontrole.map((k: any) => k.id)).toEqual(expect.arrayContaining(['ceny', 'oferty', 'rodzina', 'adresy', 'metadane', 'kategorie', 'wiek', 'dostepnosc', 'prywatnosc', 'recenzent']));
  });
});

describe('narzędzie: tylko odczyt i niezależność od aplikacji', () => {
  const pliki = walk(TOOL).filter(f => /\.(mjs|md|json)$/.test(f));
  test('katalog narzędzia ma pliki (README po polsku, klient, kontrole)', () => { expect(pliki.length).toBeGreaterThanOrEqual(12); expect(pliki).toContain(`${TOOL}/README.md`); });
  test('kod narzędzia nie zawiera metod zapisu (POST, PATCH, PUT, DELETE) ani wywołań fetch z inną metodą niż GET', () => {
    for (const f of pliki.filter(x => x.endsWith('.mjs'))) {
      const src = read(f);
      expect([f, /\b(POST|PATCH|PUT|DELETE)\b/.test(src)]).toEqual([f, false]);
      for (const m of src.matchAll(/method:\s*([^,}\s]+)/g)) expect([f, m[1]]).toEqual([f, "'GET'"]);
    }
    expect(read(`${TOOL}/klient.mjs`)).toMatch(/method: 'GET'/);
  });
  test('klient nie wypisuje sekretów: brak console.log danych logowania, a komunikat błędu bez treści odpowiedzi', () => {
    const src = pliki.filter(f => f.endsWith('.mjs')).map(read).join('\n');
    expect(src).not.toMatch(/console\.(log|error)\((keyId|issuerId|token|keyPem)|console\.(log|error)\([^)]*\$\{[^}]*(keyId|issuerId|token|keyPem)/);
    expect(src).not.toMatch(/e\.detail|\.detail\b|JSON\.stringify\(json/);
  });
  test('niezależność od aplikacji: w katalogu narzędzia brak słów „Trening”/„trening”, identyfikatora pakietu, identyfikatorów produktów i ścieżek tego repozytorium', () => {
    const zakazane = [/trening/i, new RegExp(config.aplikacja.bundleId.replace(/\./g, '\\.')), /pl\.lukasz/, /lukasz/i, /apps4brew/i, /(?<![\w-])store\//, /(?<![\w-])docs\//, /lkarwowski/i, /app\.json/, /lib\/products/];
    for (const f of pliki) { const src = read(f); for (const re of zakazane) expect([f, re.source, re.test(src)]).toEqual([f, re.source, false]); }
  });
  test('narzędzie nie importuje niczego spoza swojego katalogu (przenoszone w całości)', () => {
    for (const f of pliki.filter(x => x.endsWith('.mjs'))) for (const m of read(f).matchAll(/from '([^']+)'/g)) expect([f, m[1].startsWith('node:') || m[1].startsWith('./') || m[1].startsWith('../')]).toEqual([f, true]);
    for (const f of pliki.filter(x => x.endsWith('.mjs'))) for (const m of read(f).matchAll(/from '(\.\.\/[^']*)'/g)) expect([f, path.normalize(path.join(path.dirname(f), m[1])).startsWith(TOOL)]).toEqual([f, true]);
  });
});

describe('workflowy kontroli', () => {
  const wspolna = read('.github/workflows/asc-kontrola-wspolna.yml'); const cienki = read('.github/workflows/asc-kontrola.yml');
  test('warstwa wspólna: tylko workflow_call (config, szczegoly, narzedzia), trzy wymagane sekrety, odczyt treści, ubuntu', () => {
    expect(wspolna).toMatch(/\non:\n  workflow_call:\n    inputs:\n      config:\n[\s\S]*?required: true\n/); expect(wspolna).toMatch(/szczegoly:\n[\s\S]*?type: boolean/); expect(wspolna).toMatch(/narzedzia:\n[\s\S]*?default: narzedzia\/asc-kontrola/);
    for (const s of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8']) expect(wspolna).toMatch(new RegExp(`\\n      ${s}:\\n        required: true`));
    expect(wspolna).not.toMatch(/workflow_dispatch|schedule:|\bpush:|pull_request/); expect(wspolna).toMatch(/permissions:\n\s+contents: read\n/); expect(wspolna).not.toMatch(/contents: write|macos|eas-cli|EXPO_TOKEN/); expect(wspolna).toMatch(/runs-on: ubuntu-latest/);
  });
  test('warstwa wspólna: klucz maskowany, w RUNNER_TEMP i usuwany zawsze; wejścia tylko przez zmienne środowiskowe; bez słów zapisu', () => {
    expect(wspolna).toContain('::add-mask::$ASC_KEY_ID'); expect(wspolna).toContain('::add-mask::$ASC_ISSUER_ID'); expect(wspolna).toMatch(/umask 077/);
    expect(wspolna).not.toMatch(/echo[^\n]*\$\{?ASC_KEY_P8(?!" \|)/); expect(wspolna).not.toMatch(/echo "\$ASC_KEY_(ID|P8)|echo "\$ASC_ISSUER_ID/);
    expect(wspolna).toMatch(/- name: Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey\.p8"/);
    expect(wspolna).not.toMatch(/run:[^\n]*\$\{\{ inputs/);
    for (const v of ['KONFIGURACJA: ${{ inputs.config }}', 'NARZEDZIA: ${{ inputs.narzedzia }}', 'SZCZEGOLY: ${{ inputs.szczegoly }}']) expect(wspolna).toContain(v);
    expect(wspolna).toMatch(/node "\$NARZEDZIA\/kontrola\.mjs" --config "\$KONFIGURACJA"/); expect(wspolna).toContain('tee -a "$GITHUB_STEP_SUMMARY"'); expect(wspolna).not.toMatch(/\b(POST|PATCH|PUT|DELETE)\b/);
  });
  test('warstwa wspólna: bez nazw i ścieżek konkretnej aplikacji (przenoszona do repozytorium narzędzi)', () => { expect(wspolna).not.toMatch(/trening|lukasz|store\/|docs\//i); });
  test('cienki workflow: tylko ręcznie (wejście szczegoly), wywołuje warstwę wspólną lokalnie z secrets: inherit i konfiguracją store/asc-kontrola.json', () => {
    expect(cienki).toMatch(/\non:\n  workflow_dispatch:\n    inputs:\n      szczegoly:\n[\s\S]*?type: boolean\n\s+default: false\n/);
    expect(cienki).not.toMatch(/schedule:|\bpush:|pull_request|workflow_call/); expect(cienki).toMatch(/permissions:\n\s+contents: read\n/); expect(cienki).not.toMatch(/contents: write/);
    expect(cienki).toMatch(/uses: \.\/\.github\/workflows\/asc-kontrola-wspolna\.yml\n\s+with:\n\s+config: store\/asc-kontrola\.json\n\s+szczegoly: \$\{\{ inputs\.szczegoly \}\}\n\s+secrets: inherit/);
    expect(cienki).not.toMatch(/secrets\./);
  });
  test('workflowy są opisane w README repozytorium (WORKFLOW_ROLE) i nie mają innych sekretów niż klucz App Store Connect', () => {
    const r = read('scripts/readme.mjs'); expect(r).toContain("'asc-kontrola.yml':"); expect(r).toContain("'asc-kontrola-wspolna.yml':");
    for (const m of (wspolna + cienki).match(/secrets\.[A-Z_0-9]+/g) || []) expect(['secrets.ASC_KEY_ID', 'secrets.ASC_ISSUER_ID', 'secrets.ASC_KEY_P8']).toContain(m);
  });
});
