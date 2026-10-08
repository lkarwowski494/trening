import { getState, save, finishedWorkouts } from '@/lib/store';
import { t } from '@/lib/i18n';

/*
 * „Co nowego” (decyzja właściciela 08.10.2026): przycisk „i” w lewym górnym rogu ekranu Trening rozwija sekcję; po aktualizacji na „i” jest
 * kropka, dopóki sekcji nie otworzysz; nic nie wyskakuje samo. Bieżący wpis na górze, starsze zwinięte. Wzór: Organizer (karta po aktualizacji).
 * Historia buildów: docs/18 (1001 — 06.10, wygaszony; 1002–1004 — 07.10, testerzy dostali 1004).
 * Wpisy od najnowszego. `build` — numer buildu TestFlight (1000 + numer przebiegu testflight.yml); brak = zmiany jeszcze niewydane
 * („W tej wersji”) — numer dopisuje się przy wydaniu. `id` nie zmienia się po dopisaniu numeru (kropka nie wraca). Teksty przez t() (26 języków).
 */
export type WhatsNewEntry = { id: string; build?: number; date: string; items: () => string[] };

export const WHATS_NEW: WhatsNewEntry[] = [
  { id: '2026-10-08', date: '2026-10-08', items: () => [
    t('Kalendarz zamiast Historii: plan tygodnia, przesuwanie treningów i propozycje zmian z myślą o regeneracji partii.'),
    t('Na ekranie treningu: dzisiejszy trening z planu i podgląd 7 dni.'),
    t('Pauza treningu — czas pauzy nie liczy się do czasu trwania.'),
    t('Postępy: podsumowanie tygodnia i miesiąca z mapą mięśni, znacznik 10 serii na partię w tygodniu i oznaczanie tygodnia deload.'),
    t('Skala wysiłku RPE albo RIR w Ustawieniach.'),
    t('Szablony w folderach i archiwum, „Pomiń dziś” bez zmiany szablonu, usuwanie przesunięciem w lewo.'),
    t('Generator szablonów i planu tygodnia na Twoje polecenie (cel, miejsce, liczba i długość sesji) oraz kilka planów z wyborem aktywnego.'),
    t('Deload: podpowiedź w Kalendarzu i mniej serii przy starcie w tygodniu deload; przypomnienie rano w dniu treningu z planu.'),
  ] },
  { id: '2026-10-07', build: 1004, date: '2026-10-07', items: () => [
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
