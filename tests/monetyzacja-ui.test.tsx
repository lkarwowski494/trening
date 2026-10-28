/*
 * 1.0 (decyzja właściciela 25.10.2026; docs/monetyzacja.md): okno „Uczciwe zasady” po pierwszym ukończonym treningu na żywo (MAN-01) i karta po imporcie CSV (CSV-08).
 * Rodzaje (docs/20): logika (fairRulesDue, flaga), ekran (okno, karta), scenariusz (zakończ → okno → zamknij → drugi trening bez okna; plany → ekran zakupu),
 * macierz (PL/EN × jasny/ciemny; free/full/wyłączony przełącznik), dane (flaga w zapisie, kopii i migracji), wzorzec zamykania okien (Anuluj w nagłówku okna).
 */
import * as fs from 'fs';
import * as RN from 'react-native';
import * as store from '@/lib/store';
import { applyLang, t, tIn, LANGS } from '@/lib/i18n';
import { PAYWALL } from '@/lib/access';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { fairRulesDue, markFairRulesSeen, offerAudience } from '@/lib/fairrules';
import { buildBackup, parseBackup } from '@/lib/backup';
import { ESPRESSO_URL, PRIVACY_URL } from '@/lib/products';
import { CLOSE_TEST_ID } from '@/components/CloseButton';
import { fresh, saved, addWorkout, ex, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

jest.setTimeout(120000);
const NOW = new Date(2026, 9, 25, 12).getTime(); const S = () => store.getState();
const FULL = [{ plan: 'lifetime' as const, source: 'purchase' as const }];
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.restoreAllMocks(); jest.useRealTimers(); });

/** Trening na żywo kończony w interfejsie (jak w idea-request.test.tsx); `access`: sklep odpowiada „brak uprawnień” (free) albo dożywotnie (full). */
async function boot(o: { access?: 'free' | 'full' | 'off'; locale?: 'pl' | 'en'; mode?: 'light' | 'dark'; prior?: number } = {}) {
  const locale = o.locale ?? 'en'; jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale);
  if (o.mode) jest.spyOn(RN, 'useColorScheme').mockImplementation((() => o.mode) as never);
  const access = o.access ?? 'free'; resetEntitlementsForTests(); PAYWALL.ENABLED = access !== 'off'; setStoreAdapter(createFakeStore(access === 'full' ? FULL : []));
  for (let i = 0; i < (o.prior ?? 0); i++) { const w = addWorkout(NOW - (i + 1) * 2 * 86400e3, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Upper A'); w.live = true; }
  await startLive(locale);
}
async function startLive(locale: 'pl' | 'en') {
  store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); S().active!.exercises[0].sets = S().active!.exercises[0].sets.slice(0, 1);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); jest.setSystemTime(NOW); for (let i = 0; i < 6; i++) await flushAll(10);
  await act(async () => { const s = S().active!.exercises[0].sets[0]; s.weight = 50; s.reps = 5; store.toggleDone(0, 0); }); await flushAll(10);
}
const finish = async (locale: 'pl' | 'en' = 'en') => {
  await tap(screen.getByText(locale === 'en' ? 'Finish' : 'Zakończ')); await act(async () => { locale === 'en' ? pressAlert('Finish workout?', 'Finish') : pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
};
const win = () => screen.queryByTestId('fair-rules');

describe('MAN-01: okno „Uczciwe zasady” po pierwszym ukończonym treningu na żywo', () => {
  test('free: po „Finish” okno z tytułem, trzema zdaniami, przyciskiem głównym i drugorzędnym; główny zamyka i zapamiętuje; drugi trening → bez okna', async () => {
    await boot(); await finish(); expect(win()).toBeTruthy();
    expect(screen.getByText('First workout done!')).toBeTruthy(); expect(screen.getByText('Train 5 days a month for free, no time limit.')).toBeTruthy();
    expect(screen.getByText('Every feature works from day one, with no account and no ads. Your data stays on your phone.')).toBeTruthy();
    expect(screen.getByText('Want to train more often? Pro removes the limit: subscribe, or pay once for good.')).toBeTruthy();
    expect(screen.getByText("Awesome, I'll keep training!")).toBeTruthy(); expect(screen.getByText('See Pro plans ›')).toBeTruthy();
    expect(S().seenFairRulesManifest).toBeUndefined();
    await tap(screen.getByTestId('fair-rules-ok')); await flushAll(10); expect(win()).toBeNull(); expect(S().seenFairRulesManifest).toBe(true); expect(saved().seenFairRulesManifest).toBe(true);
    /* drugi trening na żywo */
    await act(async () => { require('expo-router').router.replace('/'); }); await flushAll(10); await startLive('en'); await finish(); expect(win()).toBeNull();
  });
  test('full (dożywotni) nie widzi okna i flaga nie jest ustawiana; przełącznik wyłączony — też nie', async () => {
    await boot({ access: 'full' }); await finish(); expect(win()).toBeNull(); expect(S().seenFairRulesManifest).toBeUndefined();
  });
  test('PAYWALL wyłączony: bez okna', async () => { await boot({ access: 'off' }); await finish(); expect(win()).toBeNull(); expect(S().seenFairRulesManifest).toBeUndefined(); });
  test('drugorzędny przycisk zamyka okno, zapamiętuje i otwiera ekran zakupu', async () => {
    await boot(); await finish(); await tap(screen.getByTestId('fair-rules-plans')); await flushAll(30);
    expect(S().seenFairRulesManifest).toBe(true); expect(win()).toBeNull(); expect(screen.getByTestId('paywall-headline')).toBeTruthy();
  });
  test('wzorzec zamykania okien (docs/32): „Anuluj” po lewej w nagłówku okna zamyka i zapamiętuje; tło okna nie jest drugim przyciskiem', async () => {
    await boot({ locale: 'pl' }); await finish('pl'); const b = screen.getByTestId(CLOSE_TEST_ID); expect(b.props.accessibilityLabel).toBe('Anuluj'); expect(screen.getByTestId('fair-rules-scrim').props.accessible).toBe(false);
    expect(screen.getAllByTestId(CLOSE_TEST_ID)).toHaveLength(1); await tap(b); await flushAll(10); expect(win()).toBeNull(); expect(S().seenFairRulesManifest).toBe(true);
  });
  test.each([['pl', 'light'], ['en', 'dark']] as const)('macierz: %s, motyw %s — teksty z t(), przyciski z rolą „przycisk”', async (locale, mode) => {
    await boot({ locale, mode }); await finish(locale); expect(win()).toBeTruthy();
    for (const id of ['fair-rules-ok', 'fair-rules-plans']) expect(screen.getByTestId(id).props.accessibilityRole).toBe('button');
    expect(screen.getByText(tIn(locale, 'Super, trenuję dalej!'))).toBeTruthy(); expect(screen.getByText(tIn(locale, 'Zobacz plany Pro ›'))).toBeTruthy();
  });
  test('PL: pełne teksty okna (tytuł, trzy zdania, dwa przyciski)', async () => {
    await boot({ locale: 'pl' }); await finish('pl');
    for (const x of ['Pierwszy trening za Tobą!', 'Wszystkie funkcje działają od pierwszego dnia, bez konta i bez reklam. Dane zostają w telefonie.', 'Trenuj 5 dni w miesiącu za darmo, bez końca.',
      'Chcesz częściej? Pro zdejmuje limit: subskrypcja albo jednorazowy zakup na zawsze.', 'Super, trenuję dalej!', 'Zobacz plany Pro ›']) expect(screen.getByText(x)).toBeTruthy();
  });
  test('nie pokazuje się po otwarciu starego treningu z historii (tylko świeżo zakończony), nawet gdy flaga nie jest ustawiona', async () => {
    await boot({ prior: 1 }); await finish(); await tap(screen.getByTestId('fair-rules-ok')); delete S().seenFairRulesManifest; const id = S().workouts[S().workouts.length - 1].id;
    await act(async () => { require('expo-router').router.push('/history'); }); await flushAll(10);
    await act(async () => { require('expo-router').router.push(`/history/${encodeURIComponent(id)}`); }); await flushAll(30); expect(win()).toBeNull();
  });
});

describe('link „Skąd ta cena?” w oknie → strona indeksu espresso', () => {
  test.each([['en', 'Why this price? See the espresso index.'], ['pl', 'Skąd ta cena? Poznaj indeks espresso.']] as const)('%s: przycisk z podpowiedzią „otwiera stronę w przeglądarce”, otwiera ESPRESSO_URL, okno zostaje otwarte i flaga się nie ustawia', async (locale, label) => {
    const open = jest.spyOn(RN.Linking, 'openURL').mockResolvedValue(undefined as never); await boot({ locale }); await finish(locale);
    const b = screen.getByTestId('fair-rules-espresso'); expect(b.props.accessibilityRole).toBe('button'); expect(b.props.accessibilityLabel).toBe(label);
    expect(b.props.accessibilityHint).toBe(locale === 'en' ? 'Opens the page in your browser.' : 'Otwiera stronę w przeglądarce.');
    await tap(b); await flushAll(10); expect(open).toHaveBeenCalledWith(ESPRESSO_URL); expect(win()).toBeTruthy(); expect(S().seenFairRulesManifest).toBeUndefined();
  });
  test('adres w jednym miejscu (lib/products.ts), na stronie marki jak polityka prywatności, i prowadzi do istniejącego pliku site/espresso.html', () => {
    expect(ESPRESSO_URL.replace('espresso.html', '')).toBe(PRIVACY_URL.replace('privacy.html', '')); expect(ESPRESSO_URL).not.toMatch(/github/);
    const file = ESPRESSO_URL.split('/').pop()!; expect(fs.existsSync(`site/${file}`)).toBe(true);
    expect(fs.readFileSync('components/FairRulesSheet.tsx', 'utf8')).not.toMatch(/https?:\/\//);
  });
  test('strona: PL i EN, średnia cena espresso bez wskazania źródła (25.10.2026), ograniczenia porównania, bez kwot planów aplikacji i bez nazw innych aplikacji; karta po imporcie linku nie ma', () => {
    const html = fs.readFileSync('site/espresso.html', 'utf8'); const body = html.replace(/<!--[\s\S]*?-->/g, '');
    const pl = body.slice(body.indexOf('<section lang="pl"'), body.indexOf('<section lang="en"')); const en = body.slice(body.indexOf('<section lang="en"'));
    for (const w of ['1,29 €', '1,06 €', '1,51 €', 'Aktualną cenę zawsze widzisz w sklepie']) expect(pl).toContain(w);
    for (const w of ['€1.29', '€1.06', '€1.51', 'You always see the current price in the store']) expect(en).toContain(w);
    for (const w of ['MIMIT', 'C.r.c.', 'Assoutenti', 'Teleborsa', 'teleborsa.it', 'źródło', 'source']) { expect([w, pl.includes(w)]).toEqual([w, false]); expect([w, en.includes(w)]).toEqual([w, false]); }
    for (const price of ['0,99', '6,99', '14,99', '4,99', '19,99', '59,99', '0.99', '6.99', '14.99', '7,99', '17,99']) expect(body).not.toContain(price);
    expect(fs.readFileSync('components/ImportProCard.tsx', 'utf8')).not.toContain('espresso');
  });
});

describe('fairRulesDue / flaga: logika i dane', () => {
  test('warunki: tylko trening na żywo, flaga nieustawiona, free i włączony przełącznik; stan niepewny bez zapamiętanego wyniku nie pokazuje', async () => {
    await fresh(); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    const live = addWorkout(NOW, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'A'); live.live = true; const back = addWorkout(NOW - 1e6, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'B');
    expect(fairRulesDue(live, NOW)).toBe(false); /* sklep jeszcze nie odpowiedział, brak zapamiętanego wyniku: cicho jak free, bez oferty */
    expect(fairRulesDue(back, NOW)).toBe(false);
    PAYWALL.ENABLED = false; expect(fairRulesDue(live, NOW)).toBe(false);
  });
  test('offerAudience: false przy wyłączonym przełączniku i bez odpowiedzi sklepu; true dla free po odpowiedzi sklepu', async () => {
    await fresh(); resetEntitlementsForTests(); PAYWALL.ENABLED = false; expect(offerAudience(NOW)).toBe(false);
    PAYWALL.ENABLED = true; expect(offerAudience(NOW)).toBe(false); /* niepewny stan bez zapamiętanego wyniku */
    setStoreAdapter(createFakeStore([])); await require('@/lib/entitlement').refreshEntitlements(); expect(offerAudience(NOW)).toBe(true);
    resetStoreAdapterForTests(); setStoreAdapter(createFakeStore(FULL)); await require('@/lib/entitlement').refreshEntitlements(); expect(offerAudience(NOW)).toBe(false);
  });
  test('flaga: markFairRulesSeen jest idempotentna, trafia do zapisu i do kopii zapasowej, a stara kopia bez pola nie ma jej po wczytaniu', async () => {
    await fresh(); expect(S().seenFairRulesManifest).toBeUndefined(); markFairRulesSeen(); markFairRulesSeen(); expect(S().seenFairRulesManifest).toBe(true);
    const parsed = parseBackup(JSON.stringify(buildBackup())); expect(parsed.seenFairRulesManifest).toBe(true);
    const old = JSON.parse(JSON.stringify(S())); delete old.seenFairRulesManifest; expect('seenFairRulesManifest' in store.migrate(old)).toBe(false);
    const bad = JSON.parse(JSON.stringify(S())); bad.seenFairRulesManifest = 'tak'; expect('seenFairRulesManifest' in store.migrate(bad)).toBe(false);
    const ok = JSON.parse(JSON.stringify(S())); expect(store.migrate(ok).seenFairRulesManifest).toBe(true);
  });
  test('teksty okna i karty mają tłumaczenie EN w słowniku i nie zawierają kwot ani nazw innych aplikacji', () => {
    const keys = ['Pierwszy trening za Tobą!', 'Super, trenuję dalej!', 'Zobacz plany Pro ›', 'Historia jest już w telefonie']; for (const k of keys) expect(tIn('en', k)).not.toBe(k);
    const src = fs.readFileSync('components/FairRulesSheet.tsx', 'utf8') + fs.readFileSync('components/ImportProCard.tsx', 'utf8'); expect(src).not.toMatch(/\d+[,.]\d{2}\s?(zł|\$|€|USD)/); expect(LANGS.length).toBeGreaterThan(30);
  });
});

describe('CSV-08: karta po udanym imporcie', () => {
  const CSV = 'Date,Workout Name,Exercise,Weight (kg),Reps\n2026-03-02 18:05:00,Góra,Alfa,50,10';
  const pickFile = (txt: string) => {
    (require('expo-document-picker').getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/x.csv' }] }));
    (require('expo-file-system/legacy').readAsStringAsync as jest.Mock).mockImplementationOnce(async () => txt);
  };
  async function importOn(access: 'free' | 'full' | 'off', locale: 'pl' | 'en' = 'pl', csv = CSV) {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); resetEntitlementsForTests(); PAYWALL.ENABLED = access !== 'off'; setStoreAdapter(createFakeStore(access === 'full' ? FULL : []));
    store.save(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); for (let i = 0; i < 6; i++) await flushAll(10);
    await go('/more/import'); await flushAll(10); pickFile(csv); await tap(screen.getByText(t('Wybierz plik CSV'))); await flushAll(10);
    await tap(screen.getByText(t('Importuj'))); await flushAll(10); expect(global.__alerts.some(a => a.title === t('Zaimportowano'))).toBe(true);
  }
  test('free: po imporcie pod komunikatem sukcesu karta z nagłówkiem, treścią i przyciskiem do ekranu zakupu', async () => {
    await importOn('free'); expect(screen.getByTestId('import-pro-card')).toBeTruthy(); expect(screen.getByText('Historia jest już w telefonie')).toBeTruthy();
    expect(screen.getByText(/Zaimportowane treningi, rekordy i wykresy są zawsze dostępne/)).toBeTruthy();
    expect(screen.getByText('Zaimportowane treningi, rekordy i wykresy są zawsze dostępne, także bez internetu. Trenuj 5 dni w miesiącu za darmo — Pro zdejmuje limit, także jednorazowo na zawsze.')).toBeTruthy();
    await tap(screen.getByTestId('import-pro-plans')); await flushAll(30); expect(screen.getByTestId('paywall-headline')).toBeTruthy();
  });
  test('full: bez karty', async () => { await importOn('full'); expect(screen.queryByTestId('import-pro-card')).toBeNull(); });
  test('wyłączony przełącznik: bez karty', async () => { await importOn('off'); expect(screen.queryByTestId('import-pro-card')).toBeNull(); });
  test('EN: karta po angielsku', async () => {
    await importOn('free', 'en'); expect(screen.getByText('Your history is now on your phone')).toBeTruthy(); expect(screen.getByText('See Pro plans ›')).toBeTruthy();
  });
  test('nowy wybór pliku chowa kartę (podgląd kolejnego importu)', async () => {
    await importOn('free'); expect(screen.getByTestId('import-pro-card')).toBeTruthy(); pickFile(CSV.replace('2026-03-02', '2026-03-09')); await tap(screen.getByText(t('Wybierz plik CSV'))); await flushAll(10);
    expect(screen.queryByTestId('import-pro-card')).toBeNull();
  });
});
