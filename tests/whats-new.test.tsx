/*
 * „Co nowego” (decyzja właściciela 08.10.2026): przycisk „i” w lewym górnym rogu ekranu Trening, kropka po aktualizacji (tylko u kogoś, kto już
 * trenował), sekcja rozwijana: bieżący wpis na górze, starsze zwinięte. State.whatsNewSeen (id wpisu). Wzór: Organizer (karta po aktualizacji).
 * Rodzaje (docs/20): logika (lista wpisów, kropka), dane (zapis/odczyt, sanityzacja, dane bez pola 1:1), ekran (położenie, kropka, rozwijanie,
 * starsze wpisy, zamknięcie, brak w trakcie treningu), VoiceOver (etykieta z informacją o nowościach, stan rozwinięcia), języki (EN). E2E: .maestro/13.
 */
import * as store from '@/lib/store';
import { WHATS_NEW, whatsNewUnseen, markWhatsNewSeen } from '@/lib/whatsnew';
import { applyLang } from '@/lib/i18n';
import { fresh, addWorkout, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const NOW = new Date(2026, 9, 8, 18, 0);
const S = () => store.getState();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); });

describe('logika i dane', () => {
  test('wpisy: unikalne id, od najnowszego, numery buildów rosną; niewydany (bez numeru) tylko na górze; każdy ma 2–10 punktów', () => {
    const ids = WHATS_NEW.map(e => e.id); expect(new Set(ids).size).toBe(ids.length);
    expect([...WHATS_NEW].sort((a, b) => b.date.localeCompare(a.date)).map(e => e.id)).toEqual(ids);
    const builds = WHATS_NEW.map(e => e.build).filter((b): b is number => b != null); expect([...builds].sort((a, b) => b - a)).toEqual(builds);
    expect(WHATS_NEW.slice(1).every(e => e.build! > 1000)).toBe(true);
    WHATS_NEW.forEach(e => { const it = e.items(); expect(it.length).toBeGreaterThanOrEqual(2); expect(it.length).toBeLessThanOrEqual(10); it.forEach(x => expect(x).toMatch(/\.$/)); });
  });
  test('kropka: nowa osoba (bez treningów) — nie; po treningu — tak; otwarcie zapisuje id najnowszego wpisu; nowy wpis — znowu tak', () => {
    expect(whatsNewUnseen()).toBe(false);
    addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(whatsNewUnseen()).toBe(true);
    markWhatsNewSeen(); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id); expect(whatsNewUnseen()).toBe(false);
    S().whatsNewSeen = WHATS_NEW[1].id; expect(whatsNewUnseen()).toBe(true); /* starszy wpis przeczytany → po aktualizacji kropka */
  });
  test('zapis i odczyt; sanityzacja (tylko niepusty tekst do 40 znaków); dane bez pola przechodzą bez dopisywania go', async () => {
    markWhatsNewSeen(); await store.flush(); await fresh(saved()); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id);
    for (const bad of [7, '', 'x'.repeat(41), null, { a: 1 }]) { (S() as any).whatsNewSeen = bad; store.save(); await store.flush(); await fresh(saved()); expect('whatsNewSeen' in S()).toBe(false); }
    expect(S().userTouched).not.toBe(true); /* stan ekranu, nie dane treningowe */
  });
});

describe('ekran Trening', () => {
  const boot = async (fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/' }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
  const withWorkout = () => { addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); };
  test('„i” w lewym górnym rogu — przed tytułem; bez treningów bez kropki', async () => {
    await boot();
    const i = screen.getByTestId('whats-new-i'); expect(i.props.accessibilityLabel).toBe('Co nowego'); expect(screen.queryByTestId('whats-new-dot')).toBeNull();
    const tree = JSON.stringify(screen.toJSON()); expect(tree.indexOf('whats-new-i')).toBeLessThan(tree.indexOf('"Trening"')); /* pierwszy w wierszu nagłówka, przed tytułem */
  });
  test('kropka po aktualizacji; otwarcie: bieżący wpis, starsze zwinięte; kropka znika; „Zamknij” i ponowne „i” zwijają', async () => {
    await boot(withWorkout);
    expect(screen.getByTestId('whats-new-dot')).toBeTruthy(); expect(screen.getByLabelText('Co nowego — są nowe zmiany')).toBeTruthy();
    expect(screen.queryByTestId('whats-new')).toBeNull();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    expect(screen.getByTestId('whats-new')).toBeTruthy(); expect(screen.getByRole('header', { name: 'Co nowego' })).toBeTruthy();
    expect(screen.getByTestId('whats-new-i').props.accessibilityState).toEqual({ expanded: true });
    expect(screen.getByText('W tej wersji')).toBeTruthy();
    for (const x of WHATS_NEW[0].items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
    expect(screen.queryByTestId('whats-new-dot')).toBeNull(); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id);
    const old = WHATS_NEW[1]; const oldItem = `• ${old.items()[0]}`; expect(screen.queryByText(oldItem)).toBeNull();
    const head = screen.getByText(/^▸ Wersja testowa 1004 · 7\.10\.2026$/); expect(head).toBeTruthy();
    expect(screen.getByText(/^▸ Wersja testowa 1001 · 6\.10\.2026$/)).toBeTruthy();
    await tap(head); await flushAll(5); expect(screen.getByText(oldItem)).toBeTruthy(); expect(screen.getByText(/^▾ Wersja testowa 1004/)).toBeTruthy();
    await tap(screen.getByText('Zamknij')); await flushAll(5); expect(screen.queryByTestId('whats-new')).toBeNull();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5); expect(screen.getByTestId('whats-new')).toBeTruthy();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5); expect(screen.queryByTestId('whats-new')).toBeNull();
  });
  test('wszystkie wpisy po polsku mają tytuł i punkty (wpis 1001 rozwinięty)', async () => {
    await boot(withWorkout); await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    await tap(screen.getByText(/^▸ Wersja testowa 1001/)); await flushAll(5);
    for (const x of WHATS_NEW[2].items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
  });
  test('treść wpisów po polsku na ekranie (wszystkie rozwinięte po kolei)', async () => {
    const texts = [
      'Nowy ekran Trening: dzisiejszy trening, tydzień w liczbach i ostatni trening; przewodnik po funkcjach w Więcej.',
      'Generator szablonów i planu tygodnia na Twoje polecenie (cel, miejsce, liczba i długość sesji) oraz kilka planów z wyborem aktywnego.',
      'Deload: podpowiedź w Kalendarzu i mniej serii przy starcie w tygodniu deload; przypomnienie rano w dniu treningu z planu.',
      '10 nowych języków: niemiecki, francuski, włoski, niderlandzki, szwedzki, duński, norweski, fiński, turecki i grecki.',
      '16 języków; wygląd jasny, ciemny albo jak w telefonie.',
      'Kalendarz zamiast Historii: plan tygodnia, przesuwanie treningów i propozycje zmian z myślą o regeneracji partii.',
      'Karta bieżącej serii w treningu; widok „Lista” jak wcześniej do wyboru w Ustawieniach.',
      'Na ekranie treningu: dzisiejszy trening z planu i podgląd 7 dni.',
      'Nowy wygląd: kolory i kroje, grafika talerzy na sztandze.',
      'Pauza treningu — czas pauzy nie liczy się do czasu trwania.',
      'Pierwsza wersja testowa: treningi z szablonów, historia, postępy i rekordy, kopia zapasowa w Plikach.',
      'Postępy: podsumowanie tygodnia i miesiąca z mapą mięśni, znacznik 10 serii na partię w tygodniu i oznaczanie tygodnia deload.',
      'Skala wysiłku RPE albo RIR w Ustawieniach.',
      'Szablony w folderach i archiwum, „Pomiń dziś” bez zmiany szablonu, usuwanie przesunięciem w lewo.',
    ];
    await boot(withWorkout); await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    const shown = new Set<string>(); const collect = () => texts.forEach(x => { if (screen.queryByText(`• ${x}`)) shown.add(x); });
    collect(); /* starsze otwierają się pojedynczo — otwarcie następnego zwija poprzedni */
    for (const e of WHATS_NEW.slice(1)) { await tap(screen.getByText(new RegExp(`^▸ Wersja testowa ${e.build}`))); await flushAll(5); collect(); }
    expect([...shown].sort()).toEqual([...texts].sort()); expect(texts.length).toBe(WHATS_NEW.flatMap(e => e.items()).length);
  });
  test('w trakcie treningu „i” nie ma (ekran treningu)', async () => {
    await boot(() => { const [tpl] = withDemoTemplates(); store.startFromTemplate(tpl); });
    expect(screen.queryByTestId('whats-new-i')).toBeNull();
  });
  test('English', async () => {
    await boot(withWorkout, 'en');
    expect(screen.getByLabelText("What's new — new changes")).toBeTruthy();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    expect(screen.getByText('In this version')).toBeTruthy(); expect(screen.getByText(/^▸ Test build 1004 · /)).toBeTruthy(); expect(screen.getByText('Close')).toBeTruthy();
  });
});
