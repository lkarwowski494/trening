import { getState, save, finishedWorkouts } from '@/lib/store';
import { t } from '@/lib/i18n';

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
  /* 1.0.1 (decyzja właściciela 06.11.2026, wariant B, docs/18): wersja testowa TestFlight tylko dla właściciela z obecnego stanu integracja-1-1 (prace linii 1.1); wpis przywraca przycisk ✦.
   * Bez numeru buildu — dopisuje się po przebiegu testflight.yml. id '2026-11-06', data 06.11.2026. Przekład na 33 języki: docs/lokalizacja/zestaw-przekladu-2026-11-06-co-nowego.json. */
  { id: '2026-11-06', date: '2026-11-06', items: () => [
    t('Nowe rysunki ruchu w ćwiczeniach na triceps oraz w podrzutach, rwaniach i ich odmianach.'),
    t('Nowe i dopracowane wskazówki techniki, m.in. dla barków, ćwiczeń mocy i mobilności.'),
    t('Zapowiedzi głosowe używają najlepszego głosu zainstalowanego w telefonie.'),
    t('Nowa osoba zaczyna na ekranie Trening od przycisku „Zacznij pierwszy trening” i tablicy „Pierwszy trening”.'),
  ] },
];

/** Kropka na „i”: najnowszy wpis nieprzeczytany — tylko u kogoś, kto już trenował (nowej osobie wszystko jest nowe; jak w Organizerze). */
export const whatsNewUnseen = () => WHATS_NEW.length > 0 && getState().whatsNewSeen !== WHATS_NEW[0].id && finishedWorkouts().length > 0;
/** Otwarcie sekcji = przeczytane. Bez `userTouched` — to stan ekranu, nie dane treningowe. */
export function markWhatsNewSeen() { const st = getState(); if (!WHATS_NEW.length || st.whatsNewSeen === WHATS_NEW[0].id) return; st.whatsNewSeen = WHATS_NEW[0].id; save(); }
