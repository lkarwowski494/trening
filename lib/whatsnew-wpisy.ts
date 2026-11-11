import { t, appName, lang } from '@/lib/i18n';

/* Wpisy „Co nowego” bez zależności od magazynu danych (W-22, 11.11.2026): czyta je także generator pola whatsNew metadanych sklepu (scripts/store-whatsnew.mjs) w zwykłym Node. */
/*
 * „Co nowego” (decyzja właściciela 08.10.2026): przycisk „i” w lewym górnym rogu ekranu Trening rozwija sekcję; po aktualizacji na „i” jest
 * kropka, dopóki sekcji nie otworzysz; nic nie wyskakuje samo. Bieżący wpis na górze, starsze zwinięte. Wzór: Organizer (karta po aktualizacji).
 * Historia buildów: docs/18 (1001 — 06.10, wygaszony; 1002 — 07.10, f435c8c, zatwierdzony dla testerów zewnętrznych). Pakiet nazywany w planie
 * „build 1004” wyszedł z testflight.yml jako 1002 (numer = 1000 + numer przebiegu; audyt NAT-02, potwierdzone w App Store Connect 08.10.2026).
 * Wpisy od najnowszego. `build` — numer buildu TestFlight (1000 + numer przebiegu testflight.yml); brak = zmiany jeszcze niewydane
 * („W tej wersji”) — numer dopisuje się przy wydaniu. `id` nie zmienia się po dopisaniu numeru (kropka nie wraca). Teksty przez t() (26 języków).
 */
export type WhatsNewEntry = { id: string; build?: number; date: string; items: () => string[] };

/*
 * 1.0.0 (decyzja właściciela 14.10.2026, docs/18): pierwsza wersja w App Store — historia „Co nowego” wyczyszczona, bo nie ma zmian względem poprzedniej
 * wersji sklepowej. Wpisy 0.10–0.20 (buildy TestFlight 1001–1030) zostają w historii git (tag v0.20.0-b1030) i w docs/09. Pusta lista = przycisk ✦ i panel
 * się nie pokazują (components/WhatsNew.tsx); pierwszy wpis 1.1 przywraca je bez zmian w komponencie. Pilnuje tests/whats-new.test.tsx.
 */
export const WHATS_NEW: WhatsNewEntry[] = [
  /* 1.1.0 (W-08, 11.11.2026, docs/18; tryb analogia do weta): jeden wpis 1.1 zastępuje wpis 1.0.1 (id 2026-11-06) — 1.0.1 był tylko buildem TestFlight właściciela, użytkownik App Store
   * aktualizuje się z 1.0.0. Nowe id = kropka wraca także po wpisie 1.0.1. Cztery punkty z 1.0.1 bez zmian brzmienia (przekłady zostają); dwa nowe: rysunki ruchu (528 z 708 ćwiczeń z figurą v2,
   * docs/55) i nazwy EN z nazwą lokalną (ZB-044) — ten punkt tylko poza angielskim (po angielsku nazwy się nie zmieniły). Bez numeru buildu — dopisuje się po przebiegu testflight.yml.
   * Przekład 33 języków: docs/lokalizacja/zestaw-przekladu-2026-11-11-co-nowego-1-1.json. */
  { id: '2026-11-11', date: '2026-11-11', items: () => [
    t('Rysunki ruchu ma teraz większość ćwiczeń z biblioteki: maszyny i linki, kettlebell, skoki, brzuch, mobilność i wiele innych.'),
    t('Nowe i dopracowane wskazówki techniki, m.in. dla barków, ćwiczeń mocy i mobilności.'),
    ...(lang() === 'en' ? [] : [t('Nazwy ćwiczeń z biblioteki są po angielsku, jak na większości siłowni. Przy wielu ćwiczeniach na karcie pod nazwą widać też nazwę w Twoim języku, a wyszukiwarka znajduje je po obu nazwach.')]),
    t('Zapowiedzi głosowe używają najlepszego głosu zainstalowanego w telefonie.'),
    t('Nowa osoba zaczyna na ekranie Trening od przycisku „Zacznij pierwszy trening” i tablicy „Pierwszy trening”.'),
    t('Aplikacja nazywa się teraz {app}. Treningi, szablony i ustawienia zostają bez zmian.', { app: appName() }) /* nazwa 1.1: 09.11.2026, docs/18, ZB-056 */,
  ] },
];
