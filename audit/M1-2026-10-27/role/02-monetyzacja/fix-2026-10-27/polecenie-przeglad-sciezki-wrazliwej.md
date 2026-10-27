Polecenie przeglądu ścieżki wrażliwej (zakupy; D-043) — nieodbyte w sesji 02-monetyzacja fix p2 (sesja jako subagent bez narzędzia subagentów). Uruchamia koordynator w NOWYM subagencie, bez rozumowania sesji 02.

Wejście dla przeglądającego (tylko to):
- `git diff 82f6310..<commit 010> -- app/paywall.tsx tests/audit-m1-2026-10-27-010-stan-mam-plan.test.tsx tests/subscription-ui.test.tsx tests/audit-m1-2026-10-27-001-dozywotni-przy-subskrypcji.test.tsx .maestro/21-subskrypcja.yaml .maestro/35-ustawienia-dostepnosc.yaml`
- Znalezisko: M1-audytor-generalny-010 (DEC-09 a, 27.10.2026): przy aktywnym planie ekran zakupu pokazuje „Masz plan: X” zamiast oferty, bez wstępu o darmowych dniach, bez „Subskrybuj” przy posiadanym planie, lista planów zwinięta pod „Zmień plan”.
- Zasady wspólne 10–14 (wklej z promptu roli: zero utraty danych, testy przed kodem, działania zewnętrzne tylko za zgodą, koszty 0 zł, repo publiczne).

Pytanie: czy zmiana może (a) pozwolić kupić posiadany plan drugi raz, (b) ukryć przywracanie zakupów, zarządzanie subskrypcją albo uwagę o odnawianiu przed zakupem dożywotniego, (c) zmienić dane użytkownika albo stan uprawnień, (d) pokazać stan „masz plan” bez uprawnienia ze sklepu?
Wynik: tylko P0/P1 z `plik:linia` i scenariuszem w aplikacji albo „brak uwag”. Drugiego przeglądu nie ma.
