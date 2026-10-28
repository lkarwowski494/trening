# Polecenie przeglądu ścieżki wrażliwej (zakupy) — do uruchomienia przez koordynatora

Subagent fix nie ma narzędzia subagentów, więc przegląd z trybu fix (D-043) jest **nieodbyty**. Uruchom nowego subagenta z tym poleceniem:

> Przejrzyj wyłącznie `git diff e6114d1..ee43b82` w repo /home/user/trening (kopia: `dowody/diff-ee43b82.patch`).
> Znalezisko: 04-studio-projektowe-601 / M1-audytor-generalny-039 — karta stanu planu na ekranie zakupu (`app/paywall.tsx`, testID `paywall-owned`)
> była grupą `accessible`, więc przycisk „Zarządzaj subskrypcją” był ukryty przed VoiceOver i XCTest. Naprawa: zdjęte `accessible` z karty.
> Zasady 10–14 (wklejone): 10 zero utraty danych użytkownika; 11 testy przed kodem, nie dopasowuj testów; 12 działania zewnętrzne tylko za zgodą;
> 13 koszty 0 zł poza Apple; 14 repo publiczne — żadnych sekretów, kluczy, `.env`.
> Zgłoś tylko P0/P1 z `plik:linia` i scenariuszem w aplikacji albo napisz „brak uwag”.
