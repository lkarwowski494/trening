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
    const firstBuilt = WHATS_NEW.findIndex(e => e.build != null); expect(firstBuilt).toBeGreaterThan(-1); expect(WHATS_NEW.slice(firstBuilt).every(e => e.build! > 1000)).toBe(true); /* niewydane wpisy tylko na górze (11.10.2026: 0.12 i wpis o nowym układzie) */
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
  test('9A (11.10.2026): ikona „Co nowego” to iskierka ✦, nie litera „i”; testID i etykieta VoiceOver bez zmian', async () => {
    await boot();
    const i = screen.getByTestId('whats-new-i'); const glyphs = i.findAll(n => (n.type as unknown) === 'Text').map(n => [n.props.children].flat().join(''));
    expect(glyphs).toEqual(['✦']); expect(i.props.accessibilityLabel).toBe('Co nowego'); expect(i.props.accessibilityRole).toBe('button');
  });
  test('kropka po aktualizacji; otwarcie: bieżący wpis, starsze zwinięte; kropka znika; „Zamknij” i ponowne „i” zwijają', async () => {
    await boot(withWorkout);
    expect(screen.getByTestId('whats-new-dot')).toBeTruthy(); expect(screen.getByLabelText('Co nowego — są nowe zmiany')).toBeTruthy();
    expect(screen.queryByTestId('whats-new')).toBeNull();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    expect(screen.getByTestId('whats-new')).toBeTruthy(); expect(screen.getByRole('header', { name: 'Co nowego' })).toBeTruthy();
    expect(screen.getByTestId('whats-new-i').props.accessibilityState).toEqual({ expanded: true });
    expect(screen.getByText(WHATS_NEW[0].build ? new RegExp(`^Wersja testowa ${WHATS_NEW[0].build} · `) : 'W tej wersji')).toBeTruthy(); /* bieżący wpis: niewydany albo wydany (0.11 — build 1005) */
    for (const x of WHATS_NEW[0].items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
    expect(screen.queryByTestId('whats-new-dot')).toBeNull(); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id);
    const old = WHATS_NEW.find(e => e.build === 1002)!; /* 1002 — rozwijany niżej (nad nim 0.17, 0.16, 0.15, 0.14, nowy układ 0.13, 0.12, 1005, 1004) */ const oldItem = `• ${old.items()[0]}`; expect(screen.queryByText(oldItem)).toBeNull();
    expect(screen.getByText(/^▸ Wersja testowa 1008 · 12 paź 2026$/)).toBeTruthy(); /* 0.12.0 — build 1008, zwinięte pod bieżącym wpisem 0.13 */
    expect(screen.getByText(/^▸ Wersja testowa 1005 · 10 paź 2026$/)).toBeTruthy(); /* 0.11.0 — wydanie 2 */
    expect(screen.getByText(/^▸ Wersja testowa 1004 · 9 paź 2026$/)).toBeTruthy(); /* 0.10.0 — wydanie 1 (A11B-8) */
    const head = screen.getByText(/^▸ Wersja testowa 1002 · 7 paź 2026$/); expect(head).toBeTruthy(); /* H3 (audyt 0.10): miesiąc słownie */
    expect(screen.getByText(/^▸ Wersja testowa 1001 · 6 paź 2026$/)).toBeTruthy();
    await tap(head); await flushAll(5); expect(screen.getByText(oldItem)).toBeTruthy(); expect(screen.getByText(/^▾ Wersja testowa 1002/)).toBeTruthy();
    await tap(screen.getByText('Zamknij')); await flushAll(5); expect(screen.queryByTestId('whats-new')).toBeNull();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5); expect(screen.getByTestId('whats-new')).toBeTruthy();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5); expect(screen.queryByTestId('whats-new')).toBeNull();
  });
  test('wszystkie wpisy po polsku mają tytuł i punkty (wpis 1001 rozwinięty)', async () => {
    await boot(withWorkout); await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    await tap(screen.getByText(/^▸ Wersja testowa 1001/)); await flushAll(5);
    for (const x of WHATS_NEW.find(e => e.build === 1001)!.items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
  });
  test('treść wpisów po polsku na ekranie (wszystkie rozwinięte po kolei)', async () => {
    const texts = [
      /* 13.10.2026 (0.17.0): spójna obsługa, „Napisz do nas” */
      'Spójniejsza obsługa w całej aplikacji: okna z „Anuluj” po lewej, „+” w nagłówkach list do dodawania oraz czytelniejsze komunikaty i opisy dla VoiceOver.',
      'Przycisk „Napisz do nas” w Więcej → O aplikacji.',
      /* 13.10.2026 (0.16.0): odczyt z Apple Health, paski serii z odcinkiem pośrednim, cel serii w generatorze */
      'Odczyt z Apple Health (włączasz w Ustawieniach): kroki i inne aktywności w panelu dnia, średnia kroków pod „Ten tydzień” oraz tętno i kcal z zegarka przy sesji.',
      'Paski serii pokazują osobno serie pośrednie (pomocnicze, liczone po 0,5).',
      'Generator uwzględnia Twój cel serii z Ustawień.',
      /* 12.10.2026 (0.15.0): Apple Health 16, parafrazy wskazówek */
      'Aktualizacja współpracy z Apple Health — zapis treningów działa jak dotąd.',
      'Poprawione sformułowania części wskazówek techniki.',
      /* 12.10.2026 (0.14.0, backlog A): cel serii na partię, poprawki, nowe ćwiczenia, miejsce treningu */
      'Cel serii na partię w tygodniu ustawisz w Ustawieniach (Automatycznie albo Ręcznie); paski w „Ten tydzień” i w Postępach mierzą do tego celu, a partia pomocnicza ćwiczenia liczy się za pół serii.',
      'Poprawki: Postępy pamiętają wybrane ćwiczenie, import bez godzin pokazuje „godzina nieznana”, a teksty pomocy zgadzają się z nazwami zakładek.',
      '20 nowych ćwiczeń ze wskazówkami w sekcji „Technika”.',
      'Trening dopisywany wstecz: miejsce treningu wybierzesz w edytorze.',
      /* 11.10.2026 (docs/18 P7): wspólny wpis o nowym układzie — nad 0.12 */
      'Cztery zakładki: Trening, Plan, Postępy i Więcej. Szablony i Ćwiczenia znajdziesz teraz w Więcej.',
      'Postępy mają własną zakładkę: podsumowanie, „Progresja”, wykresy ćwiczeń i masa ciała.',
      'Ekran Trening: „Planowanie” przy nazwie planu, „Ten tydzień” i „Progresja”; „Z szablonu” w arkuszu „Inny trening” otwiera wybór szablonu ze „Startem”.',
      /* 0.12 (decyzja właściciela 10.10.2026, wariant A): nazwy języków z LANG_NAME */
      '9 nowych języków: Português (Brasil), Español (Latinoamérica), Bahasa Indonesia, Bahasa Melayu, Tiếng Việt, Русский, 日本語, 한국어, 繁體中文.',
      '35 języków; język zmienisz w Ustawieniach.',
      /* 0.11 (A11B-8; dwa ostatnie — zaległości z 0.10: UI2-04, MER2-06) */
      'Nowy wygląd z ikony: znacznik dnia jak ikona aplikacji, stosy talerzy z procentem planu tygodnia, filiżanka w dzień odpoczynku, podsumowanie miesiąca jako stosy.',
      'Import historii treningów z plików CSV popularnych dzienników (Więcej → Kopia zapasowa → „Importuj historię z pliku CSV”), z podglądem przed zapisem.',
      'Krótka animacja przy starcie: talerze wsuwają się na gryf.',
      'Generator: wybór dni tygodnia, od 1 do 6 dni, cel „Ogólny” i „Plan z moich szablonów”.',
      'Ekran Trening w nowym układzie; „Powtórz ostatni” z nazwą i datą.',
      'Niezapisane zmiany w edycji szablonu i ćwiczenia przetrwają zamknięcie aplikacji — po starcie wrócisz do edycji albo je odrzucisz.',
      'Wyszukiwanie ćwiczeń także po dawnej nazwie.',
      '„Technika”: wskazówki do ćwiczenia otworzysz też z treningu i z szablonu.',
      'Numer buildu w „O aplikacji”.',
      'Od 0.10: szablon i ćwiczenie otwierają się w podglądzie — zmiany zaczynasz przyciskiem „Edytuj” i zatwierdzasz „Zapisz”.',
      'Od 0.10: biblioteka ćwiczeń uporządkowana — podobne warianty scalone, rzadsze widać po wyłączeniu filtra „Podstawowe” (Twoje treningi bez zmian); masa ciała z datą i e1RM w podciąganiu i pompkach, wskazówki techniki z rysunkiem ruchu, „Zapisz jako szablon” w historii.',
      'Nowy ekran Trening: dzisiejszy trening, tydzień w liczbach i ostatni trening; przewodnik po funkcjach w Więcej.',
      'Generator szablonów i planu tygodnia na Twoje polecenie (cel, miejsce, liczba i długość sesji) oraz kilka planów z wyborem aktywnego.',
      'Deload: podpowiedź w Kalendarzu, a w tygodniu deload przy starcie o około 1/3–1/2 mniej serii (np. 2 z 3; ćwiczenia z 1 serią bez zmian); przypomnienie rano w dniu treningu z planu.', /* audyt 0.10 (MER-04) */
      '10 nowych języków: niemiecki, francuski, włoski, niderlandzki, szwedzki, duński, norweski, fiński, turecki i grecki.',
      '16 języków; wygląd jasny, ciemny albo jak w telefonie.',
      'Kalendarz zamiast Historii: plan tygodnia, przesuwanie treningów i propozycje zmian z myślą o regeneracji partii.',
      'Karta bieżącej serii w treningu; widok „Lista” jak wcześniej do wyboru w Ustawieniach.',
      'Na ekranie treningu: dzisiejszy trening z planu, bieżący tydzień i najbliższe treningi z nazwą.', /* audyt 0.10 A9 */
      'Dostosuj do miejsca: po zmianie miejsca na takie bez potrzebnego sprzętu aplikacja proponuje zamienniki ćwiczeń do przejrzenia — zmiany tylko w tym treningu.',
      'W oknie zmienisz zamiennik albo wybierzesz „Bez zmian” lub „Pomiń dziś”; zastosowaną zamianę cofniesz przy ćwiczeniu.',
      'Miejsca treningu i „Dostosuj do miejsca”: zmiany tylko w dzisiejszym treningu — szablon i plan zostają bez zmian.',
      'Apple Watch: odhaczanie serii, przerwa z timerem i „Cofnij” przez 5 sekund (watchOS 10 lub nowszy).',
      'Zapowiedzi głosowe na początku przerwy: ćwiczenie, ciężar i powtórzenia.',
      '„Strażnik progresji” w Postępach: sylwetka z kierunkiem progresu oraz zdanie o brakach do celu z uwzględnieniem planu.',
      'Postępy: dwa słupki na partię — porównanie okresu z poprzednim okresem.',
      'Objaśnienia pod przyciskiem „i” na ekranach.',
      '„Poproś o nową funkcję” obok „Napisz do nas” w Więcej → O aplikacji.',
      'Poprawka: zapis i odczyt Apple Health działają (w poprzedniej wersji testowej brakowało uprawnienia).',
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
    for (const e of WHATS_NEW.slice(1)) { await tap((e.build ? screen.getByText(new RegExp(`^▸ Wersja testowa ${e.build}`)) : screen.getAllByText('▸ W tej wersji')[0])); await flushAll(5); collect(); }
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
    expect(screen.getByText('In this version')).toBeTruthy(); expect(screen.getByText(/^▸ Test build 1005 · 10 Oct 2026$/)).toBeTruthy(); expect(screen.getByText('Close')).toBeTruthy();
  });
});
