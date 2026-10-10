import { getState, save, finishedWorkouts } from '@/lib/store';
import { t } from '@/lib/i18n';
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

export const WHATS_NEW: WhatsNewEntry[] = [
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
