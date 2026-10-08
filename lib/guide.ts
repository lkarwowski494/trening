import { getState, save } from '@/lib/store';
import { t } from '@/lib/i18n';

/*
 * Przewodnik po najważniejszych funkcjach (decyzja właściciela 08.10.2026, wariant A): tematy z 2–4 krokami i przyciskiem „Pokaż”, który otwiera
 * opisany ekran; przeczytane tematy odhaczone (State.guideSeen — id tematów). Wejście: Więcej → Przewodnik, „Pierwsze kroki” (nowa osoba),
 * „Co nowego” (po aktualizacji). Same instrukcje obsługi — bez twierdzeń dziedzinowych poza tymi, które aplikacja już opisuje ze źródłami.
 * Kroki opisują nazwy przycisków z interfejsu (te same klucze t()) — zmiana nazwy przycisku wymaga zmiany kroku (test w tests/guide.test.tsx).
 */
export type GuideTopic = { id: string; title: () => string; steps: () => string[]; route: string };
export const GUIDE: GuideTopic[] = [
  { id: 'workout', route: '/', title: () => t('Trening i serie'), steps: () => [
    t('Na ekranie Trening stuknij „Start” przy szablonie albo „Pusty trening”.'),
    t('Wpisz ciężar i powtórzenia, odhacz serię ✓ — przerwa odlicza się sama.'),
    t('„⏸ Pauza” zatrzymuje zegar treningu; czas pauzy nie liczy się do czasu trwania.'),
    t('Na koniec „Zakończ trening i zapisz” — sesja trafi do Kalendarza.'),
  ] },
  { id: 'templates', route: '/templates', title: () => t('Szablony'), steps: () => [
    t('W zakładce Szablony „+ Nowy” tworzy szablon: ćwiczenia, serie, zakres powtórzeń i przerwy.'),
    t('W edytorze szablonu przeniesiesz go do folderu albo archiwum.'),
    t('Przesunięcie w lewo na liście usuwa szablon (z potwierdzeniem).'),
  ] },
  { id: 'plan', route: '/history', title: () => t('Plan tygodnia i Kalendarz'), steps: () => [
    t('W Kalendarzu „Plan tygodnia” przypisuje szablony do dni — plan powtarza się co tydzień.'),
    t('Stuknij dzień w Kalendarzu: „Przesuń albo pomiń” pokazuje możliwości — przesunięcie planu o 1 dzień, tylko tego treningu, zamianę albo wolne.'),
    t('Na górze listy jest polecana: wraca do rutyny i nie gubi treningu, potem unika par dzień po dniu z tymi samymi partiami i zmienia najmniej dni.'),
    t('Kilka planów: „+ Nowy plan” tworzy kopię do zmiany, a „Ustaw jako aktywny” w „Inne plany” ją włącza — zmiany dni wracają razem z planem.'),
  ] },
  { id: 'generator', route: '/generator', title: () => t('Generator szablonów i planu'), steps: () => [
    t('„Wygeneruj szablony i plan” (Szablony albo Plan tygodnia): wybierz cel, miejsce, liczbę i długość sesji.'),
    t('Przejrzyj podgląd i „Na czym to oparte” — wynik zapisuje się dopiero po zatwierdzeniu.'),
    t('Szablony trafiają do folderu „Wygenerowane”, a plan do „Inne plany” albo od razu jako aktywny.'),
  ] },
  { id: 'deload', route: '/history', title: () => t('Deload'), steps: () => [
    t('Po kilku tygodniach treningu z rzędu Kalendarz podpowie „Zaplanuj deload od …”.'),
    t('Tydzień oznaczysz też w Postępach przełącznikiem „Tydzień deload”.'),
    t('W Kalendarzu: stuknij dzień, potem „Więcej opcji” → „Oznacz tydzień jako deload” — także przyszły tydzień.'),
    t('W tygodniu deload „Start” zaproponuje „Mniej serii” — ciężary i szablon bez zmian.'),
  ] },
  { id: 'progress', route: '/more/progress', title: () => t('Postępy i rekordy'), steps: () => [
    t('Więcej → Postępy: podsumowanie tygodnia lub miesiąca z poprzednim okresem obok.'),
    t('Mapa mięśni i serie na partię z kreską 10 serii tygodniowo.'),
    t('Wykresy ćwiczeń i rekordy; rekord w trakcie treningu widać przy serii.'),
  ] },
  { id: 'places', route: '/more/locations', title: () => t('Miejsca i sprzęt'), steps: () => [
    t('Więcej → Miejsca i sprzęt: dom, siłownia, hotel — każdy ze swoim sprzętem i ciężarami.'),
    t('Lista ćwiczeń, zamiany i generator pokazują to, co da się zrobić w wybranym miejscu.'),
  ] },
  { id: 'backup', route: '/more/backup', title: () => t('Kopia zapasowa'), steps: () => [
    t('Więcej → Backup: eksport wszystkich danych do pliku i import z pliku.'),
    t('Automatyczna kopia po każdym treningu trafia do Plików (Ustawienia).'),
  ] },
];
export const guideSeen = (): string[] => getState().guideSeen ?? [];
export const guideProgress = () => ({ seen: GUIDE.filter(g => guideSeen().includes(g.id)).length, total: GUIDE.length });
/** Otwarcie tematu = przeczytany. Bez `userTouched` — to stan ekranu, nie dane treningowe. */
export function markGuideSeen(id: string) { const st = getState(); if (!GUIDE.some(g => g.id === id) || guideSeen().includes(id)) return; st.guideSeen = [...guideSeen(), id]; save(); }
