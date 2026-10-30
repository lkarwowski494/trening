/*
 * Treść dokumentów, które przy przeniesieniu repozytorium do Apps4Brew idą na Dysk (docs/46, decyzje D1 i D5 z 21.10.2026; ZB-004, 30.10.2026):
 * docs/21 (backlog), docs/41, docs/42, docs/43, docs/45-formalnosci-asc, docs/49, docs/wzrost.md (docs/45-formalnosci i 49: decyzja P1 C, 30.10.2026). Asercje WYDZIELONE bez zmiany brzmienia z plików wskazanych w nagłówkach
 * poniżej — w tym repozytorium biegną tak samo jak dotąd. Ten plik ma w scripts/przeniesienie-1.0.json akcję „usun” (w nowym repo nie ma
 * dokumentów, które sprawdza); pozostałe asercje tamtych testów zostają i przechodzą po przeniesieniu.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const sekcja = (d: string, od: string, doo: string) => d.slice(d.indexOf(od), d.indexOf(doo, d.indexOf(od) + 1));

describe('M1-030 (z audit-m1-2026-10-27-030-liczby-w-kodzie): backlog w docs/21', () => {
  test('migracja literałów fontSize/borderRadius na tokeny: pozycja backlogu 1.0.1 z ID zadania', () => {
    const line = read('docs/21-roadmapa-offline.md').split('\n').find(l => l.includes('M1-audytor-generalny-030'));
    expect(line).toBeTruthy(); expect(line).toMatch(/1\.0\.1/); expect(line).toMatch(/token/);
  });
});

describe('M1-035 (z audit-m1-2026-10-27-035-duze-pliki): backlog w docs/21', () => {
  test('docs/21: pozycja backlogu z wersją 1.1 i ID zadania', () => {
    const lines = read('docs/21-roadmapa-offline.md').split('\n'); const i = lines.findIndex(l => l.includes('M1-audytor-generalny-035'));
    expect(i).toBeGreaterThanOrEqual(0); expect(lines[i]).toMatch(/1\.1/); expect(lines[i]).toMatch(/20 KB/);
  });
});

describe('M1-047 (z m1-047-otwarte-wskazniki): backlog w docs/21', () => {
  test('docs/21: Pendlay Row w backlogu 1.0.1 z zakresem pracy', () => {
    expect(read('docs/21-roadmapa-offline.md')).toMatch(/\*\*Pendlay Row\*\*[^\n]*źródła[^\n]*recenzj[^\n]*1\.0\.1/);
  });
});

/* z audit-m1-2026-10-27-037-dokumenty-wydania */
describe('10-wydanie-005: plan „zły build” bez znaczników [DO PRZECZYTANIA] (DEC-07 b, 27.10.2026)', () => {
  const s = sekcja(read('docs/42-plan-wydania-1.0.md'), '## 4. Zły build', '## 5.');
  test('pkt 4 nie ma [DO PRZECZYTANIA]', () => {
    expect(s.length).toBeGreaterThan(500);
    expect(s).not.toMatch(/DO PRZECZYTANIA/);
  });
  test('wycofanie ze sprzedaży: strona Apple, cytat o zainstalowanych kopiach i dacie odczytu', () => {
    expect(s).toContain('https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store/');
    expect(s).toContain('Users who previously downloaded your app from the App Store in that country or region will continue to receive app updates.');
    expect(s).toContain('Remove App From Sale');
    expect(s).toMatch(/odczyt 27\.10\.2026/);
  });
  test('przyspieszona recenzja: strona Apple, warunek „krytyczny błąd” i kroki w notatce', () => {
    expect(s).toContain('https://developer.apple.com/help/app-review/after-submitting-for-review/request-expedited-review/');
    expect(s).toContain('Only submissions that have already been sent to App Review can be expedited.');
    expect(s).toContain('include the steps to reproduce the bug on the current version of your app');
  });
});


/* z audit-m1-2026-10-27-037-dokumenty-wydania */
describe('M1-037 backlog (DEC-07 b, 27.10.2026): pozycje poza 1.0 wpisane do docs/21 z wersją, nie do „Backlogu bez priorytetu”', () => {
  const d = read('docs/21-roadmapa-offline.md');
  const s = sekcja(d, '### Backlog z audytu M1 — DEC-07 b', '\n### ');
  const bezPriorytetu = sekcja(d, '### Backlog bez priorytetu', '\n### ');
  test.each(['03-zakres-006', '03-zakres-007', '11-wzrost-002', '11-wzrost-004', '02-monetyzacja-005', '02-monetyzacja-506'])('%s: wiersz z wersją i warunkiem', (id) => {
    const w = s.split('\n').find(l => l.includes(id)) ?? '';
    expect(w).toMatch(/\*\*Wersja:\*\* (1\.0\.1|1\.0\.x|1\.1)/);
    expect(w).toMatch(/Warunek|Powrót|Kiedy/);
    expect(bezPriorytetu).not.toContain(id);
  });
});


describe('droga do sklepu — dokumenty strategiczne zgodne z M5 S1 i bramką E2E (M1-047, z audit-m1-047-store-docs)', () => {
  const FILES_S = ['docs/41-droga-do-app-store.md', 'docs/42-plan-wydania-1.0.md', 'docs/43-przekazanie.md', 'docs/45-formalnosci-asc.md']; /* docs/45-formalnosci: P1 C, 30.10.2026 */
  const HISTORY = /uchylon|zastąpion|nieaktualn/i;
  const TRIAL = /oferta wprowadzając\w*[^.\n]{0,40}14 dni|14 dni oferty|oferta 14 dni|oferta 1 miesiąc|2 Weeks|2 tygodnie, obie|próba 14 dni|14 dniach próby|sprawdź próbę|próbę i cenę|TRIAL_DAYS = 14|planu, próba/i;
  const E2E_OLD = /3 (kolejn\w+ )?nocn\w+|trybie ścisłym/i;
  const offending = (re: RegExp) => FILES_S.flatMap((f) => read(f).split('\n').map((l, i) => [f, i + 1, l] as const)).filter(([, , l]) => re.test(l) && !HISTORY.test(l)).map(([f, n, l]) => `${f}:${n} ${l.slice(0, 120)}`);
  test('żadna instrukcja nie każe zakładać ani sprawdzać okresu próbnego (poza historią oznaczoną „uchylone”)', () => { expect(offending(TRIAL)).toEqual([]); });
  test('żaden dokument nie wymaga „3 nocy” ani „trybu ścisłego” jako bramki App Store (poza historią)', () => { expect(offending(E2E_OLD)).toEqual([]); });
  test('docs/42 (pkt 1.2 i W1-02) podaje bramkę z CLAUDE.md: jeden pełny katalog na standardowym iPhonie', () => {
    const d42 = read('docs/42-plan-wydania-1.0.md');
    expect(d42.split('\n').find((l) => l.startsWith('2. **Testy:**'))).toMatch(/jeden pełny katalog E2E na standardowym iPhonie/);
    expect(d42.split('\n').find((l) => l.includes('**W1-02**'))).toMatch(/jeden pełny katalog E2E na standardowym iPhonie/);
  });
  test('docs/42 pkt 1.6: wynik bramki W0 z docs/monetyzacja.md, nie „brak”', () => {
    expect(read('docs/monetyzacja.md')).toContain('## Bramka W0');
    const l = read('docs/42-plan-wydania-1.0.md').split('\n').find((x) => x.startsWith('6. **Model płatności:**')) ?? '';
    expect(l).not.toMatch(/W0: brak/); expect(l).toMatch(/Bramka W0/);
  });
  test('docs/43: K-011 oznaczone jako uchylone, bez kroków zakładania oferty', () => {
    const d = read('docs/43-przekazanie.md'); const h = d.split('\n').find((l) => l.startsWith('## K-011')) ?? '';
    expect(h).toMatch(/UCHYLONE 22\.10\.2026/); expect(d).not.toMatch(/Create Introductory Offer|Duration = /);
  });
});

describe('reguły uczciwej promocji i przekaz startowy w docs/wzrost.md i docs/41 (M1-055, M1-056, z audit-m1-055-promo-rules)', () => {
  const growth = read('docs/wzrost.md'); const agent = read('.claude/agents/marketing.md');
  const PRZEKAZ = 'szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta';
  test('docs/wzrost.md pkt 6: ujawnienie autorstwa, bez próśb o oceny do znajomych, zgoda na e-maile do klubów, zakaz forów', () => {
    const sec = growth.slice(growth.indexOf('## 6. Reguły uczciwej promocji'));
    expect(sec).toMatch(/Ujawnienie autorstwa/);
    expect(sec).toMatch(/Bez próśb o oceny do znajomych i rodziny/);
    expect(sec).toMatch(/zgod[ay] odbiorcy na kontakt/);
    expect(sec).toMatch(/zakaz promocji; wpis tylko po pisemnej zgodzie administracji/);
    expect(sec).toContain('DEC-02');
  });
  test('rola marketingu odsyła do docs/wzrost.md', () => { expect(agent).toContain('docs/wzrost.md'); });
  test('nowy przekaz jest w docs/wzrost.md', () => { expect(growth).toContain(PRZEKAZ); });
  test('stare hasło z 13.10.2026: docs/wzrost.md oznacza je jako nieobowiązujące; docs/41 go nie zawiera', () => {
    expect(growth).toMatch(/Wcześniejsze hasło .* nie obowiązuje/);
    expect(read('docs/41-droga-do-app-store.md')).not.toMatch(/Prosty dziennik siłowni|zostaje w Twoim telefonie/);
  });
});

describe('L-028 dla docs/43: kroki dla właściciela w Apple mają źródło (z kroki-wlasciciela-zrodla)', () => {
  const KROK = /App Store Connect →|Ustawienia → App Store|Users and Access/;
  const ZRODLO = /https:\/\/(developer|support)\.apple\.com\//;
  const WYJATKI: Record<string, string> = {
    'K-013. Polityka prywatności: adres w App Store Connect (M1-013)': 'wpisanie adresu w jedno pole formularza ASC, adres pochodzi z repo',
  };
  test('docs/43-przekazanie.md', () => {
    const bez = read('docs/43-przekazanie.md').split(/^## /m).slice(1)
      .filter((x) => KROK.test(x) && !ZRODLO.test(x)).map((x) => x.split('\n')[0].trim()).filter((h) => !(h in WYJATKI));
    expect(bez).toEqual([]);
  });
  test('wyjątki są aktualne (każdy nagłówek nadal istnieje)', () => {
    for (const h of Object.keys(WYJATKI)) expect(read('docs/43-przekazanie.md')).toContain(`## ${h}`);
  });
});

describe('docs/49: lista TestFlight 1.0 dla telefonu (z m1-045-notatki-sciezka-zakupu i m1-011-duzy-tekst-metoda; P1 C, 30.10.2026)', () => {
  const card = read('components/SubscriptionCard.tsx');
  const FREE_PL = /: t\('([^']+)'\);\n/.exec(card.slice(card.indexOf('const title =')))![1];
  const OWNED_PL = [...card.matchAll(/t\('(Masz plan: [^']+)'\)/g)].map((m) => m[1]);
  test('docs/49 T-11: po zakupie tytuły z ownedPlanTitle, bez zakupu „Zobacz plany Pro”, bez „Masz pełną wersję”', () => {
    const t11 = read('docs/49-testflight-1-0.md').split('\n').find((l) => l.includes('**T-11')) ?? '';
    for (const o of OWNED_PL) expect(t11).toContain(o);
    expect(t11).toContain(`→ „${FREE_PL}”`);
    expect(t11).not.toMatch(/Masz pełną wersję|→ „Pełna wersja”/);
  });
  test('docs/49 T-04: największy tekst — stan „dziś bez treningu” z ikoną startu kolejnego treningu', () => {
    const t04 = read('docs/49-testflight-1-0.md').split('\n').find((l) => l.includes('**T-04')) ?? '';
    expect(t04).toMatch(/dziś bez treningu[^\n]*ikon/);
  });
});
