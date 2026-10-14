import { getState, save, finishedWorkouts } from '@/lib/store';
import { t, LANG_NAME } from '@/lib/i18n';
import { deloadLessText } from '@/lib/start';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { GEN_SESSIONS } from '@/lib/generator';

/*
 * „Co nowego” (decyzja właściciela 08.10.2026): przycisk „i” w lewym górnym rogu ekranu Trening rozwija sekcję; po aktualizacji na „i” jest
 * kropka, dopóki sekcji nie otworzysz; nic nie wyskakuje samo. Bieżący wpis na górze, starsze zwinięte. Wzór: Organizer (karta po aktualizacji).
 * Historia buildów: docs/18 (1001 — 06.10, wygaszony; 1002 — 07.10, f435c8c, zatwierdzony dla testerów zewnętrznych). Pakiet nazywany w planie
 * „build 1004” wyszedł z testflight.yml jako 1002 (numer = 1000 + numer przebiegu; audyt NAT-02, potwierdzone w App Store Connect 08.10.2026).
 * Wpisy od najnowszego. `build` — numer buildu TestFlight (1000 + numer przebiegu testflight.yml); brak = zmiany jeszcze niewydane
 * („W tej wersji”) — numer dopisuje się przy wydaniu. `id` nie zmienia się po dopisaniu numeru (kropka nie wraca). Teksty przez t() (26 języków).
 */
export type WhatsNewEntry = { id: string; build?: number; date: string; items: () => string[] };

/** Zakres liczby dni w generatorze (wszystkie cele) — z GEN_SESSIONS, nie wpisany w tekst. */
const genDays = () => { const all = Object.values(GEN_SESSIONS).flat(); return { a: Math.min(...all), b: Math.max(...all) }; };

/** Języki dodane w 0.12.0 (fale 1–4, docs/18); kk, uz, az i arabski — późniejsze wydanie. */
export const LANGS_012 = ['pt-BR', 'es-419', 'id', 'ms', 'vi', 'ru', 'ja', 'ko', 'zh-Hant'] as const;

export const WHATS_NEW: WhatsNewEntry[] = [
  /* 0.18.0 (docs/33, docs/18 13.10.2026): „Dostosuj do miejsca” — okno z zamiennikami po zmianie miejsca na takie bez potrzebnego sprzętu; zmiany tylko w bieżącym treningu,
   * szablon i plan bez zmian. Bez numeru buildu — dopisuje się po przebiegu testflight.yml. id '2026-10-16' (następny po 0.17), data 13.10.2026. */
  { id: '2026-10-16', date: '2026-10-13', items: () => [
    t('Dostosuj do miejsca: po zmianie miejsca na takie bez potrzebnego sprzętu aplikacja proponuje zamienniki ćwiczeń do przejrzenia — zmiany tylko w tym treningu.'),
    t('W oknie zmienisz zamiennik albo wybierzesz „Bez zmian” lub „Pomiń dziś”; zastosowaną zamianę cofniesz przy ćwiczeniu.'),
  ] },
  /* 0.17.0 (docs/32, docs/18 13.10.2026): spójna obsługa (wzorce interakcji), „Napisz do nas”, (punkt o prośbie o ocenę usunięty 13.10.2026, decyzja właściciela A — w TestFlight okno się nie pokazuje; prośba aktywna: lib/review-run.ts — aktywna niezależnie od
   * PAYWALL.ENABLED; system pokazuje okno tylko w wersji z App Store, w TestFlight nie). Subskrypcja jest wyłączona przełącznikiem — bez wzmianki. Bez numeru buildu — dopisuje się po
   * przebiegu testflight.yml (dopisany: build 1014, TestFlight 38413965421, tag v0.17.0-b1014). id '2026-10-15' (następny po 0.16), data 13.10.2026. */
  { id: '2026-10-15', build: 1014, date: '2026-10-13', items: () => [
    t('Spójniejsza obsługa w całej aplikacji: okna z „Anuluj” po lewej, „+” w nagłówkach list do dodawania oraz czytelniejsze komunikaty i opisy dla VoiceOver.'),
    t('Przycisk „Napisz do nas” w Więcej → O aplikacji.'),
  ] },
  /* 0.16.0 (docs/29, docs/18 13.10.2026): odczyt z Apple Health, paski serii z odcinkiem pośrednim, cel serii w generatorze. Build 1013 (TestFlight 38374133953, tag v0.16.0-b1013).
   * id '2026-10-14' (następny po 0.15), data 13.10.2026. */
  { id: '2026-10-14', build: 1013, date: '2026-10-13', items: () => [
    t('Odczyt z Apple Health (włączasz w Ustawieniach): kroki i inne aktywności w panelu dnia, średnia kroków pod „Ten tydzień” oraz tętno i kcal z zegarka przy sesji.'),
    t('Paski serii pokazują osobno serie pośrednie (pomocnicze, liczone po 0,5).'),
    t('Generator uwzględnia Twój cel serii z Ustawień.'),
  ] },
  /* 0.15.0 (docs/18): aktualizacja biblioteki Apple Health 8 → 16 (zapis treningów bez zmian dla użytkownika), parafrazy wskazówek techniki w EN.
   * Strona WWW w site/ — tylko repo, bez punktu. Build 1012 (TestFlight 38355743899; 1011 przepadł — limit certyfikatów). id '2026-10-13' (następny po 0.14), data wydania 12.10.2026. */
  { id: '2026-10-13', build: 1012, date: '2026-10-12', items: () => [
    t('Aktualizacja współpracy z Apple Health — zapis treningów działa jak dotąd.'),
    t('Poprawione sformułowania części wskazówek techniki.'),
  ] },
  /* 0.14.0 (backlog A, decyzja właściciela 12.10.2026, docs/18): cel serii na partię w Ustawieniach, poprawki błędów, 20 nowych ćwiczeń ze wskazówkami techniki,
   * miejsce treningu przy dopisywaniu wstecz. Bez numeru buildu — dopisuje się po przebiegu testflight.yml. */
  { id: '2026-10-12', build: 1010, date: '2026-10-12', items: () => [
    t('Cel serii na partię w tygodniu ustawisz w Ustawieniach (Automatycznie albo Ręcznie); paski w „Ten tydzień” i w Postępach mierzą do tego celu, a partia pomocnicza ćwiczenia liczy się za pół serii.'),
    t('Poprawki: Postępy pamiętają wybrane ćwiczenie, import bez godzin pokazuje „godzina nieznana”, a teksty pomocy zgadzają się z nazwami zakładek.'),
    t('20 nowych ćwiczeń ze wskazówkami w sekcji „Technika”.'),
    t('Trening dopisywany wstecz: miejsce treningu wybierzesz w edytorze.'),
  ] },
  /* Wydanie 2 (decyzja właściciela 11.10.2026, docs/18 P7 A): jeden wspólny wpis o nowym układzie — wydanie 1 (ekran Trening, „Progresja”) i wydanie 2 (cztery zakładki,
   * masa ciała w Postępach) oraz import CSV; to wpis wydania 0.13.0 (0.12.0 niżej wyszło bez wpisu o nowym ekranie). Numer buildu dopisuje się po wydaniu. */
  { id: '2026-10-11', build: 1009, date: '2026-10-12', items: () => [
    t('Cztery zakładki: Trening, Plan, Postępy i Więcej. Szablony i Ćwiczenia znajdziesz teraz w Więcej.'),
    t('Postępy mają własną zakładkę: podsumowanie, „Progresja”, wykresy ćwiczeń i masa ciała.'),
    t('Ekran Trening: „Planowanie” przy nazwie planu, „Ten tydzień” i „Progresja”; „Z szablonu” w arkuszu „Inny trening” otwiera wybór szablonu ze „Startem”.'),
    t('Import historii treningów z plików CSV popularnych dzienników (Więcej → Kopia zapasowa → „Importuj historię z pliku CSV”), z podglądem przed zapisem.'),
  ] },
  /* 0.12.0 (decyzja właściciela 10.10.2026, wariant A): języki fal 1–4; nazwy z LANG_NAME (każdy język we własnym brzmieniu, jedno źródło).
   * Liczby 9 i 35 to stan tego wydania (wpis historyczny) — nie z LANGS, żeby nie zmieniły się po kolejnych językach. */
  { id: '2026-10-10', build: 1008, date: '2026-10-12', items: () => [
    t('9 nowych języków: {list}.', { list: LANGS_012.map(l => LANG_NAME[l]).join(', ') }),
    t('35 języków; język zmienisz w Ustawieniach.'),
  ] },
  /* 0.11.0 (A11B-8, lista wydania). Dwa ostatnie punkty: zaległości z 0.10 wg audytu kontrolnego 1 (UI2-04, MER2-06) — wpis 0.10 ma już 9 punktów
   * (limit 10), a osoby aktualizujące z 1002 widzą je dopiero teraz. */
  { id: '2026-10-09', build: 1005, date: '2026-10-10', items: () => [ /* 0.11.0 — wydanie 2, build 1005 z 10.10.2026 (docs/18) */
    t('Nowy wygląd z ikony: znacznik dnia jak ikona aplikacji, stosy talerzy z procentem planu tygodnia, filiżanka w dzień odpoczynku, podsumowanie miesiąca jako stosy.'),
    t('Krótka animacja przy starcie: talerze wsuwają się na gryf.'),
    t('Generator: wybór dni tygodnia, od {a} do {b} dni, cel „Ogólny” i „Plan z moich szablonów”.', genDays()),
    t('Ekran Trening w nowym układzie; „Powtórz ostatni” z nazwą i datą.'),
    t('Niezapisane zmiany w edycji szablonu i ćwiczenia przetrwają zamknięcie aplikacji — po starcie wrócisz do edycji albo je odrzucisz.'),
    t('Wyszukiwanie ćwiczeń także po dawnej nazwie.'),
    t('„Technika”: wskazówki do ćwiczenia otworzysz też z treningu i z szablonu.'),
    t('Numer buildu w „O aplikacji”.'),
    t('Od 0.10: szablon i ćwiczenie otwierają się w podglądzie — zmiany zaczynasz przyciskiem „Edytuj” i zatwierdzasz „Zapisz”.'), /* UI2-04 */
    t('Od 0.10: biblioteka ćwiczeń uporządkowana — podobne warianty scalone, rzadsze widać po wyłączeniu filtra „Podstawowe” (Twoje treningi bez zmian); masa ciała z datą i e1RM w podciąganiu i pompkach, wskazówki techniki z rysunkiem ruchu, „Zapisz jako szablon” w historii.'), /* MER2-06, UI2-04 */
  ] },
  { id: '2026-10-08', build: 1004, date: '2026-10-09', items: () => [ /* 0.10.0 — wydanie 1, build 1004 z 09.10.2026 ok. 13:55 (docs/18); id bez zmian (kropka nie wraca) */
    t('Kalendarz zamiast Historii: plan tygodnia, przesuwanie treningów i propozycje zmian z myślą o regeneracji partii.'),
    t('Na ekranie treningu: dzisiejszy trening z planu, bieżący tydzień i najbliższe treningi z nazwą.'), /* audyt 0.10 A9: dawny tekst obiecywał „podgląd 7 dni” */
    t('Pauza treningu — czas pauzy nie liczy się do czasu trwania.'),
    t('Postępy: podsumowanie tygodnia i miesiąca z mapą mięśni, znacznik {n} serii na partię w tygodniu i oznaczanie tygodnia deload.', { n: WEEKLY_SETS_MARK }), /* LOG2-05 */
    t('Skala wysiłku RPE albo RIR w Ustawieniach.'),
    t('Szablony w folderach i archiwum, „Pomiń dziś” bez zmiany szablonu, usuwanie przesunięciem w lewo.'),
    t('Generator szablonów i planu tygodnia na Twoje polecenie (cel, miejsce, liczba i długość sesji) oraz kilka planów z wyborem aktywnego.'),
    t('Deload: podpowiedź w Kalendarzu, a w tygodniu deload przy starcie {less}; przypomnienie rano w dniu treningu z planu.', { less: deloadLessText() }), /* audyt 0.10 (MER-04) */
    t('Nowy ekran Trening: dzisiejszy trening, tydzień w liczbach i ostatni trening; przewodnik po funkcjach w Więcej.'),
  ] },
  { id: '2026-10-07', build: 1002, date: '2026-10-07', items: () => [
    t('Nowy wygląd: kolory i kroje, grafika talerzy na sztandze.'),
    t('Karta bieżącej serii w treningu; widok „Lista” jak wcześniej do wyboru w Ustawieniach.'),
    t('10 nowych języków: niemiecki, francuski, włoski, niderlandzki, szwedzki, duński, norweski, fiński, turecki i grecki.'),
  ] },
  { id: '2026-10-06', build: 1001, date: '2026-10-06', items: () => [
    t('Pierwsza wersja testowa: treningi z szablonów, historia, postępy i rekordy, kopia zapasowa w Plikach.'),
    t('16 języków; wygląd jasny, ciemny albo jak w telefonie.'),
  ] },
];

/** Kropka na „i”: najnowszy wpis nieprzeczytany — tylko u kogoś, kto już trenował (nowej osobie wszystko jest nowe; jak w Organizerze). */
export const whatsNewUnseen = () => getState().whatsNewSeen !== WHATS_NEW[0].id && finishedWorkouts().length > 0;
/** Otwarcie sekcji = przeczytane. Bez `userTouched` — to stan ekranu, nie dane treningowe. */
export function markWhatsNewSeen() { const st = getState(); if (st.whatsNewSeen === WHATS_NEW[0].id) return; st.whatsNewSeen = WHATS_NEW[0].id; save(); }
