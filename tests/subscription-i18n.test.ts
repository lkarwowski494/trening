/* 0.17.0 / M5 S1 (22.10.2026), teksty subskrypcji i ekranu zakupu (bez okresu próbnego i przypomnienia) — tabela polski → angielski (klucze lib/i18n.en.ts) i użycie w obu językach z parametrami.
 * Rodzaje (docs/20): języki i wygląd (EN i PL), tekst (każdy klucz z literałem w kodzie testu). Pozostałe 33 języki: tłumacz (tests/i18n-locales.test.ts czerwone do czasu dostarczenia). */
import { EN } from '@/lib/i18n.en';
import { t, tp, applyLang } from '@/lib/i18n';

const PAIRS: [string, string][] = [
  ['Pełna wersja', 'Full version'],
  ['Trening to część mojego tygodnia', 'Training is part of my week'],
  ['Szukam swojego rytmu', 'Still finding my rhythm'],
  ['Trening to moje życie', 'Training is my life'],
  ['Cały rok treningów, rozliczany rocznie.', 'A whole year of workouts, billed yearly.'],
  ['Płacisz co miesiąc i kończysz, kiedy chcesz.', 'Pay month by month and stop whenever you like.'],
  ['Płacisz raz i masz na zawsze.', 'Pay once, keep it forever.'],
  ['rok', 'year'],
  ['miesiąc', 'month'],
  ['{price} jednorazowo', '{price} one-time'],
  ['{price}/{period}', '{price}/{period}'],
  ['Kup na zawsze', 'Buy forever'],
  ['Subskrybuj', 'Subscribe'],
  ['Czeka na zgodę organizatora rodziny.', 'Waiting for approval from the family organizer.'],
  ['Przywrócono zakupy.', 'Purchases restored.'],
  ['Nie znaleziono zakupów dla tego konta Apple.', 'No purchases found for this Apple account.'],
  ['Nie udało się przywrócić zakupów. Sprawdź połączenie z internetem.', 'Couldn\'t restore purchases. Check your internet connection.'],
  ['Potrzebne połączenie z internetem.', 'An internet connection is needed.'],
  ['Trenuj {n} dni w miesiącu za darmo. Pro zdejmuje limit. Anulujesz w ustawieniach konta Apple, kiedy zechcesz.', 'Train {n} days a month for free. Pro removes the limit. Cancel anytime in your Apple account settings.'],
  ['Jesteśmy z Ciebie dumni!', 'We\'re proud of you!'],
  ['W tym miesiącu ciężko trenujesz i wykorzystujesz wszystkie darmowe dni treningowe ({n}). Dobra robota!', 'You\'ve trained hard this month and used all {n} free training days. Good job!'],
  ['{app} tworzy niezależny deweloper: bez reklam, bez zbierania danych. Jeśli Ci pomaga, wybierz plan i trenuj bez limitu. Darmowe dni wracają {date}.', '{app} is made by an independent developer: no ads, no data collection. If it helps you, choose a plan to keep training without limits. Your free days come back on {date}.'],
  ['Masz dostęp na zawsze', 'You have access forever'],
  ['Masz pełną wersję', 'You have the full version'],
  ['Dostęp z Chmury rodzinnej', 'Access through Family Sharing'],
  ['Dostęp z kodu do {date}', 'Access from a code until {date}'],
  ['Dostęp do {date}', 'Access until {date}'],
  ['Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.', 'Your subscription still renews — cancel it so you don\'t pay twice.'],
  ['Zarządzaj subskrypcją', 'Manage subscription'],
  ['Ładowanie cen…', 'Loading prices…'],
  ['Ceny są niedostępne bez połączenia z internetem.', 'Prices are unavailable without an internet connection.'],
  ['Subskrypcja odnawia się automatycznie, dopóki jej nie anulujesz w ustawieniach konta Apple.', 'The subscription renews automatically until you cancel it in your Apple account settings.'],
  ['Bez zakupu: do {n} dni treningowych w miesiącu; historia, kopia i eksport zawsze dostępne.', 'Without a purchase: up to {n} training days per month; history, backup and export always available.'],
  ['Przywróć zakupy', 'Restore purchases'],
  ['Zrealizuj kod', 'Redeem code'],
  ['Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.', 'Purchases are tied to your Apple account. You restore workouts from a backup.'],
  ['Warunki korzystania', 'Terms of Use'],
  ['Otwiera stronę w przeglądarce.', 'Opens the page in your browser.'],
  ['Prywatność', 'Privacy'],
  ['Darmowe dni treningowe w tym miesiącu: wykorzystano {n} z {limit}', 'Free training days this month: {n} of {limit} used'],
  ['{left} {n} z {limit} darmowych dni treningowych w tym miesiącu.', '{n} of {limit} free training days {left} this month.'],
  ['Subskrypcja', 'Subscription'],
];
afterEach(() => { applyLang('pl'); });
test.each(PAIRS)('EN: „%s” → „%s”', (pl, en) => { expect(EN[pl]).toBe(en); });
test('wszystkie klucze: te same {parametry} w polskim i angielskim, niepuste, bez duplikatów', () => {
  const p = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(','); expect(new Set(PAIRS.map(x => x[0])).size).toBe(PAIRS.length);
  for (const [pl, en] of PAIRS) { expect(en.trim()).not.toBe(''); expect(p(en)).toBe(p(pl)); }
});
test('t() w obu językach podstawia parametry (cena, okres, data, liczby, nazwa aplikacji) i nie zostawia nawiasów', () => {
  const args: Record<string, string | number> = { price: '3,99 zł', period: 'miesiąc', date: '1 lis', n: 4, limit: 5, app: 'Trening', left: 'Zostały' };
  for (const lang of ['pl', 'en'] as const) { applyLang(lang); for (const [pl] of PAIRS) { const r = t(pl, args); expect(r).not.toMatch(/\{\w+\}/); expect(r.length).toBeGreaterThan(0); } }
});
test('odmiana „Został|Zostały|Zostało” (licznik dni): polski 0/1/2/5/22, angielski „left” w obu formach', () => {
  applyLang('pl'); expect([0, 1, 2, 4, 5, 22].map(n => tp(n, 'Został|Zostały|Zostało'))).toEqual(['Zostało', 'Został', 'Zostały', 'Zostały', 'Zostało', 'Zostały']);
  applyLang('en'); expect([0, 1, 2, 5].map(n => tp(n, 'Został|Zostały|Zostało'))).toEqual(['left', 'left', 'left', 'left']);
});
