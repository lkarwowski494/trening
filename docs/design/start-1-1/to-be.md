# Ekran „Trening” nowej osoby — TO BE (linia 1.1, 05.11.2026)

Propozycje zmian przepływu z katalogu uproszczeń (moduł „przepływy i gesty”, U1–U15). To hipotezy do decyzji właściciela, nie normy. Każda ma
opcję „zostawić”. Wygląd tych zmian pokazują trzy kierunki (`kandydaci.md`, `../kierunki/start-1-1-*.html`); żadna zmiana nie dotyka danych
ani modelu danych (bez migracji). Koszt TO BE to szacunek z makiety — do potwierdzenia po wdrożeniu.

| ID | Tarcie | Wzorzec | Zmiana | Zysk | Ryzyko | Wysiłek | Opcje (rekomendacja **pogrubiona**) |
|---|---|---|---|---|---|---|---|
| Z-1 | ST-01, ST-03, ST-09 | U13 (działanie od razu) + U11 (widoczny stan) | Dzień dzisiejszy i stan startu pokazane jako element firmowy (tablica albo pasek tygodnia), zanim powstanie plan | nowa osoba od pierwszej sekundy widzi aplikację „swoją” i dzisiejszy dzień; „wow” z danych, nie z ozdoby | dłuższy ekran; nowa wersja stanu w testach | M | **(a) element firmowy od pierwszego dnia** (kierunki K1/K2/K3) · (b) zostawić |
| Z-2 | ST-01 | U9 (jeden główny następny krok) | Przycisk startu nowej osoby mówi działanie: „Zacznij pierwszy trening” z podpisem „pusty — ćwiczenia dodasz w trakcie”; „Pusty trening” zostaje w arkuszu „Inny trening” | znika sprzeczność „pusty” vs „start”; jedna droga do pierwszej wartości | nowy tekst (i18n, tłumacz, recenzent lokalizacji); test E2E 31/59 czyta etykietę | S | **(a) nowy tekst tylko dla `kind: 'empty'` bez historii** · (b) zostawić „Pusty trening” |
| Z-3 | ST-01, ST-08 | U12 (najczęstsze widoczne, reszta stopniowo) | Kolejność kroków: „Pierwszy trening” jako krok 1 (już zrobiony = przycisk wyżej), szablon i plan jako kroki 2–3 „kiedy zechcesz” | lista nie blokuje pierwszego treningu | **zmienia decyzję P4 A (11.10.2026)** w części kolejności; testy `tests/audit-0.10-ui.test.tsx` | S | (a) zmienić kolejność · **(b) zostawić kolejność, a krok 3 zamienić na zdanie przy przycisku startu** (bez zmiany decyzji) · (c) zostawić |
| Z-4 | ST-02 | U12 | Przyciski kroków drugiej rangi jako wiersze listy z „›” (wzorzec 17 w docs/32), jeden ciężar wizualny; przycisk pełnej rangi ma tylko start | jeden punkt skupienia (test mrużenia) | kroki dalej mają po jednym przycisku — P4 A zachowane | S | **(a) wiersze z „›”** · (b) zostawić małe przyciski |
| Z-5 | ST-07 | U9 + U11 | Po pierwszym treningu zamiast znikania: jednorazowe domknięcie na tej samej powierzchni („Pierwszy trening zapisany” + znak dnia w pasku), potem „Ten tydzień” | domknięcie i widoczny postęp | nowy stan; nie może być oknem (kolejne okno po „Uczciwych zasadach”) | M | **(a) domknięcie w elemencie firmowym (znak dnia)** · (b) zostawić znikanie |
| Z-6 | ST-04, ST-05 | U15 (jedna akcja, jeden wygląd) | W Planowaniu dla osoby bez szablonów: pierwszy wiersz „+ Nowy szablon” nad dniami; „+” w nagłówku zostaje „Dodaj plan” | najkrótsza droga widoczna | ekran Planowania poza zakresem tego zadania | M | (a) zmiana w Planowaniu · **(b) osobne zadanie po wyborze kierunku** · (c) zostawić |
| Z-7 | ST-06 | U9 | Zapis szablonu otwartego z dnia planu wraca do Planowania z wyróżnionym dniem | widać przypisanie | jak Z-6 | S | (a) zmienić · **(b) osobne zadanie (razem z Z-6)** · (c) zostawić |

## Koszt AS IS → TO BE (szacunek)

| Przepływ | Kroki | Stuknięcia | Pola | Decyzje | Zmiany ekranu | Do zapamiętania | Porażki przejścia |
|---|---|---|---|---|---|---|---|
| 1 Pierwszy trening AS IS | 7 | ok. 10 | 2 | 2 | 3 | 0 | 2 (kroki 1 i 7) |
| 1 TO BE (Z-1, Z-2, Z-4, Z-5) | 7 | ok. 10 | 2 | 2 | 3 | 0 | 0 (szacunek) |
| 2 Plan AS IS | 7 | 8–9 | 0–1 | 3 | 5 | 1 | 3 (kroki 2, 2′, 5) |
| 2 TO BE (Z-6, Z-7) | 5 | 6–7 | 0–1 | 3 | 3 | 0 | 0 (szacunek) |

Przepływ 1 nie skraca się w stuknięciach — zyskuje w zrozumieniu (P1/P3 kroku 1) i w domknięciu (P4 kroku 7). To zamierzone: liczby to przybliżenie wysiłku, nie cel.

## Ograniczenia zachowane we wszystkich kierunkach

- Układ B „najpierw trening” (09.10.2026): duży przycisk startu u góry, nad krokami (`app/(tabs)/index.tsx:37`).
- Lista „Pierwsze kroki” (08.10.2026), nie jedna karta powitalna; bez karuzeli (`docs/18-archiwum-do-11.10.md:139,147-148`).
- P4 A: każdy krok ma jeden przycisk; krok 4 (CSV, DEC-04 a) pomijalny i nigdy „zrobiony”; zdanie „Miejsca i sprzęt” z odnośnikiem; „Przewodnik”.
- Kolor talerza koduje wyłącznie ciężar (IWF) — nigdy kroki, dni ani postęp. Motyw talerzy A2 tylko tam, gdzie pozwala `MOTIF.where` (`lib/tokens.ts:68`), jako tło bez znaczenia, ukryty dla VoiceOver i przy „Zwiększ kontrast”.
- Bez treści treningowych (porad, liczb dziedzinowych) — rejestr twierdzeń nie jest potrzebny.
- Zmiany ekranu Planowania (Z-6, Z-7) są poza tym ekranem — proponowane jako osobne zadanie.
