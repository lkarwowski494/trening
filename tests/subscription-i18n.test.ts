/* 0.17.0, teksty subskrypcji, ekranu zakupu i przypomnienia przed końcem próby — tabela polski → angielski (klucze lib/i18n.en.ts) i użycie w obu językach z parametrami.
 * Rodzaje (docs/20): języki i wygląd (EN i PL), tekst (każdy klucz z literałem w kodzie testu). Pozostałe 33 języki: tłumacz (tests/i18n-locales.test.ts czerwone do czasu dostarczenia). */
import { EN } from '@/lib/i18n.en';
import { t, tp, applyLang } from '@/lib/i18n';

const PAIRS: [string, string][] = [
  ['Pełna wersja', 'Full version'],
  ['Rocznie', 'Yearly'],
  ['Miesięcznie', 'Monthly'],
  ['Na zawsze', 'Forever'],
  ['rok', 'year'],
  ['miesiąc', 'month'],
  ['{price} jednorazowo', '{price} one-time'],
  ['{days} dni za darmo, potem {price}/{period}', '{days} days free, then {price}/{period}'],
  ['{price}/{period}', '{price}/{period}'],
  ['Kup na zawsze', 'Buy forever'],
  ['Zacznij {days} dni za darmo', 'Start {days} days free'],
  ['Subskrybuj', 'Subscribe'],
  ['Czeka na zgodę organizatora rodziny.', 'Waiting for approval from the family organizer.'],
  ['Przywrócono zakupy.', 'Purchases restored.'],
  ['Nie znaleziono zakupów dla tego konta Apple.', 'No purchases found for this Apple account.'],
  ['Nie udało się przywrócić zakupów. Sprawdź połączenie z internetem.', 'Couldn\'t restore purchases. Check your internet connection.'],
  ['Potrzebne połączenie z internetem.', 'An internet connection is needed.'],
  ['Wykorzystano limit darmowych treningów w tym miesiącu ({n}). Kolejne od {date}.', 'You\'ve used this month\'s free workouts ({n}). More from {date}.'],
  ['Treningi na żywo bez miesięcznego limitu.', 'Live workouts without the monthly limit.'],
  ['Masz dostęp na zawsze', 'You have access forever'],
  ['Masz pełną wersję', 'You have the full version'],
  ['Dostęp z Chmury rodzinnej', 'Access through Family Sharing'],
  ['Okres próbny do {date}', 'Free trial until {date}'],
  ['Dostęp z kodu do {date}', 'Access from a code until {date}'],
  ['Dostęp do {date}', 'Access until {date}'],
  ['Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.', 'Your subscription still renews — cancel it so you don\'t pay twice.'],
  ['Zarządzaj subskrypcją', 'Manage subscription'],
  ['Ładowanie cen…', 'Loading prices…'],
  ['Ceny są niedostępne bez połączenia z internetem.', 'Prices are unavailable without an internet connection.'],
  ['Subskrypcja odnawia się automatycznie, dopóki jej nie anulujesz w ustawieniach konta Apple.', 'The subscription renews automatically until you cancel it in your Apple account settings.'],
  ['Bez zakupu: {n} {s} na żywo w miesiącu; historia, kopia zapasowa i eksport są zawsze dostępne.', 'Without a purchase: {n} live {s} per month; history, backup and export are always available.'],
  ['Przywróć zakupy', 'Restore purchases'],
  ['Zrealizuj kod', 'Redeem code'],
  ['Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.', 'Purchases are tied to your Apple account. You restore workouts from a backup.'],
  ['Warunki korzystania', 'Terms of Use'],
  ['Otwiera stronę w przeglądarce.', 'Opens the page in your browser.'],
  ['Prywatność', 'Privacy'],
  ['trening|treningi|treningów', 'workout|workouts'],
  ['Darmowe treningi w tym miesiącu: {n} z {limit}', 'Free workouts this month: {n} of {limit}'],
  ['Subskrypcja', 'Subscription'],
  ['Okres próbny dobiega końca', 'Your free trial is ending'],
  ['Okres próbny kończy się {date}. Jeśli nie chcesz subskrypcji, anuluj ją w ustawieniach konta Apple.', 'Your free trial ends on {date}. If you don\'t want the subscription, cancel it in your Apple account settings.'],
];
afterEach(() => { applyLang('pl'); });

test.each(PAIRS)('EN: „%s” → „%s”', (pl, en) => { expect(EN[pl]).toBe(en); });
test('wszystkie klucze 0.17.0: te same {parametry} w polskim i angielskim, niepuste, bez duplikatów', () => {
  const p = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(','); expect(new Set(PAIRS.map(x => x[0])).size).toBe(PAIRS.length);
  for (const [pl, en] of PAIRS) { expect(en.trim()).not.toBe(''); expect(p(en)).toBe(p(pl)); }
});
test('t() w obu językach podstawia parametry (cena, okres, data, liczby) i nie zostawia nawiasów', () => {
  const args: Record<string, string | number> = { price: '3,99 zł', period: 'miesiąc', date: '1 lis', n: 4, limit: 4, s: 'treningi', days: 14 };
  for (const lang of ['pl', 'en'] as const) { applyLang(lang); for (const [pl] of PAIRS) { if (pl.includes('|')) continue; const r = t(pl, args); expect(r).not.toMatch(/\{\w+\}/); expect(r.length).toBeGreaterThan(0); } }
  applyLang('en'); expect(t('{days} dni za darmo, potem {price}/{period}', { days: 14, price: '$4.99', period: 'year' })).toBe('14 days free, then $4.99/year');
  applyLang('pl'); expect(t('{days} dni za darmo, potem {price}/{period}', { days: 14, price: '19,99 zł', period: 'rok' })).toBe('14 dni za darmo, potem 19,99 zł/rok');
});
test('liczebnik „trening|treningi|treningów” (limit darmowych treningów): polski 1/2/5, angielski 1/4', () => {
  applyLang('pl'); expect([1, 2, 4, 5, 22].map(n => tp(n, 'trening|treningi|treningów'))).toEqual(['trening', 'treningi', 'treningi', 'treningów', 'treningi']);
  applyLang('en'); expect([1, 4].map(n => tp(n, 'trening|treningi|treningów'))).toEqual(['workout', 'workouts']);
});
