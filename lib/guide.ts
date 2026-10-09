import { getState, save } from '@/lib/store';
import { t } from '@/lib/i18n';
import { deloadLessText } from '@/lib/start';

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
    t('Szablon otwiera się w podglądzie ze „Start”; zmiany (także folder) dopiero po „Edytuj” — zapisuje je „Zapisz”.'), /* edycja na żądanie, 08.10.2026 */
    t('„Archiwizuj” w podglądzie chowa szablon; przesunięcie w lewo na liście usuwa go (z potwierdzeniem).'),
  ] },
  /* H1 (audyt 0.10, UX-09): tematy, których brakowało — zmiany w trakcie treningu i historia */
  { id: 'during', route: '/', title: () => t('Zmiany w trakcie treningu'), steps: () => [
    t('„⇄ zamień” przy ćwiczeniu zamienia je na inne tylko w tym treningu — szablon zostaje.'),
    t('„Pomiń dziś” pomija resztę serii ćwiczenia w tym treningu.'),
    t('Superset ustawisz w szablonie: „Edytuj”, potem „⇅ SS” przy ćwiczeniu łączy je z następnym (w trakcie treningu ten sam przycisk jest przy ćwiczeniu) — przerwa liczy się po ostatnim ćwiczeniu grupy.') /* UI2-07: cytat widocznego tekstu przycisku */,
    t('Przesunięcie serii albo nazwy ćwiczenia w lewo usuwa je (z potwierdzeniem).'),
  ] },
  { id: 'history', route: '/history', title: () => t('Edycja sesji i trening wstecz'), steps: () => [
    t('W Kalendarzu stuknij sesję, potem „Edytuj” — zmiany zapisuje „Zapisz”, „Anuluj” je odrzuca.'),
    t('„+ Dodaj trening wstecz” zapisze trening, którego nie zapisałeś na bieżąco; z dnia w Kalendarzu — „Zapisz trening z tego dnia”.'),
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
  { id: 'deload', route: '/more/progress' /* H1 (audyt 0.10): ekran z przełącznikiem „Tydzień deload” — Kalendarz zwykle nie ma elementu deload */, title: () => t('Deload'), steps: () => [
    t('Po kilku tygodniach treningu z rzędu Kalendarz podpowie „Zaplanuj deload od …”.'),
    t('Tydzień oznaczysz też w Postępach przełącznikiem „Tydzień deload”.'),
    t('W Kalendarzu: stuknij dzień, potem „Więcej opcji” → „Oznacz tydzień jako deload” — także przyszły tydzień.'),
    t('W tygodniu deload „Start” i „Powtórz ostatni” zaproponują „Mniej serii”: {less}; ciężary i szablon bez zmian.', { less: deloadLessText() }), /* audyt 0.10 (D1, MER-04) */
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
    t('Więcej → Kopia zapasowa: eksport wszystkich danych do pliku i import z pliku.'),
    t('Automatyczna kopia po każdym treningu trafia do Plików (Ustawienia).'),
  ] },
];
export const guideSeen = (): string[] => getState().guideSeen ?? [];
export const guideProgress = () => ({ seen: GUIDE.filter(g => guideSeen().includes(g.id)).length, total: GUIDE.length });
/** Otwarcie tematu = przeczytany. Bez `userTouched` — to stan ekranu, nie dane treningowe. */
export function markGuideSeen(id: string) { const st = getState(); if (!GUIDE.some(g => g.id === id) || guideSeen().includes(id)) return; st.guideSeen = [...guideSeen(), id]; save(); }
