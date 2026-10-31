# Decyzja — nazwy angielskie ćwiczeń przed startem strony i wydaniem 1.1 (do decyzji właściciela, 31.10.2026)

Dlaczego teraz: strona techniqueatlas startuje z 1.1 ze wszystkimi 709 adresami (decyzja 31.10.2026, docs/18). Adres ćwiczenia (slug) powstaje z nazwy angielskiej (`scripts/strona/eksport.mjs:54` — `makeSlugs` z `exName`) i zostaje zamrożony w `slugs.lock.json` przy pierwszej publikacji (D2; pliku nie ma w repo trening — leży po stronie techniqueatlas, stanu tutaj nie sprawdzałem). Po zamrożeniu każda zmiana nazwy = przekierowanie. Nazwy wpływają też na ZB-010 (aktualizacja SDK tylko, gdy 1.1 nie zmienia danych użytkownika).

Liczby (szkic przewodnika `origin/przekazanie-konta:notatki/katalog-1-1/przewodnik-nazw-en-szkic-2026-10-30.md`, sekcje 2 i 4): 709 ćwiczeń; **267 nazw EN zmienia się** wg przewodnika (442 bez zmian); 85 kluczy katalogu po polsku albo z polskim nawiasem (+8 z dobrą nazwą EN, ale kluczem PL/z marką); klucz katalogu = nazwa (K-02), `rid` stały 709/709; duplikatów po zmianie 0. Schemat danych w 1.1 bez zmian: `SCHEMA_VERSION = 19` (`lib/seed.ts:12`).

## Opcje

**A (rekomendacja) — przewodnik nazw teraz, warstwa nazw wyświetlanych (ścieżka B przewodnika), bez zmiany kluczy.**
Pole `nameEn` po `rid`; `exName` dla języków innych niż PL zwraca nową nazwę; eksport strony bierze slug z nowej nazwy; stare nazwy EN jako aliasy wyszukiwania. Dane użytkownika nietknięte → **SDK w 1.1 możliwe** (ZB-010).
Koszt: klucz ≠ nazwa EN zostaje w kodzie (porządki kluczy później, osobnym wydaniem); 267 zmian dotyka zrzutów EN, scenariuszy E2E szukających po tekście, VoiceOver (`exNameLang`) i przekładu nazw. Wymaga recenzji badacza (nazwy ogólne, sekcja 3 — marki/eponimy) i recenzenta lokalizacji (naturalność EN) przed zamrożeniem.
Wykonalność: wykonalne — wzorzec warstwy wyświetlanej istnieje (`LIB_DISPLAY_NAME`, `EX_FULL`, `EX_PAREN`); bez migracji.

**B — przewodnik teraz, zmiana kluczy katalogu z migracją (ścieżka A przewodnika).**
Nowy krok katalogu (`renamed`: ok. 275 kluczy) stosowany przez `lib/state/migrate-catalog.ts` do ćwiczeń, treningów, szablonów i historii użytkownika. Czyste dane (klucz = nazwa EN).
Koszt: migracja danych użytkownika w pierwszej aktualizacji po 1.0 → wg zasady „SDK osobno od schematu” **aktualizacja SDK nie w 1.1** (osobne wydanie, ZB-010 przesunięte); ryzyko migracji (import CSV, kopia, kopie ze starszych wersji) i pełny zakres testów danych.
Wykonalność: wykonalne (mechanizm `LIB_RENAMED` działa od 09.10.2026), ale najdroższe i najbardziej ryzykowne.

**C — bez zmiany nazw w 1.1; strona startuje z dzisiejszymi nazwami EN.**
Najmniej pracy; SDK w 1.1 możliwe.
Koszt: adresy strony zamrażają dzisiejszą niespójność (4 zapisy jednostronności, nawiasy z przyrządem w 75 nazwach, „-SMR”, liczba mnoga); późniejsza poprawa = przekierowania 267 adresów i utrata części sygnału wyszukiwarki.
Wykonalność: wykonalne od ręki.

Rekomendacja: **A** — jedyna opcja, która przed zamrożeniem adresów porządkuje nazwy i nie blokuje SDK w 1.1. Przy A potrzebne są też rozstrzygnięcia przewodnika P1–P4 (rekomendacje szkicu: P1 „Single-Arm/Single-Leg” wszędzie, P2 liczba pojedyncza z zamkniętą listą wyjątków, P3 bez „Barbell” w klasycznych bojach, P4 „Dumbbell or Cable Romanian Deadlift”) — konwencje, nie kwestie merytoryczne.

Czas (szacunek, nie pomiar): A — 1 agent programisty (warstwa + strażnik regex + testy) + recenzje badacza i lokalizacji; czeka się na: E2E (scenariusze po tekście), zrzuty EN. Czas właściciela: ta decyzja (+ P1–P4, jeśli nie przyjmie rekomendacji szkicu).
