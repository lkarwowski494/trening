# Przepływy TO BE — zatwierdzone na STOP 2 przebiegu M3 (21.10.2026)

Tylko przepływy wybrane przez właściciela 21.10.2026 (docs/18). Opisują przebieg, nie wygląd — wygląd powstaje w E3 (rola 04 build) i jest wybierany okiem.
Koszt TO BE to szacunek z opisu kroków (analiza AS IS roli 04, 21.10.2026); pomiar na wdrożonym kodzie w E5. Logika i dane bez zmian, poza ZM-07 (ustawienia, z migracją wartości i STOP przed partią).

| ZM | Przepływ | Koszt AS IS → TO BE (szacunek) |
|---|---|---|
| ZM-01 | Karta „teraz”: wynik serii na karcie | pola na serię 2 → 0–2; kroki „porażka” 1 → 0 |
| ZM-02 | Ekran treningu: mniej rzeczy nad kartą | elementy nad kartą 8 (+ notatka) → 3–4 |
| ZM-03 | Generator: jeden krok po „Zapisz”, bez przełącznika trybu | stuknięcia 6 → 4; zmiany ekranu 5 → 3; kroki „porażka” 2 → 0 |
| ZM-04 | Usuwanie poza treningiem: widoczna droga obok gestu | droga bez gestu: brak → jest; kroki „porażka” 1 → 0 |
| ZM-05 | Seria na czas: jedna nazwa akcji | nazwy tej samej akcji 2 → 1 |
| ZM-06 | Postępy: pusty stan i wybór ćwiczenia (z M1-026) | elementy w pustym stanie: 40 chipów → pusty stan z akcją |
| ZM-07 | Dźwięk i wibracje osobno | przełączniki 1 → 2 |

## ZM-01 — Karta „teraz” (P01, P03)
1. Karta „teraz” pokazuje ciężar i powtórzenia (albo czas/dystans) z podpowiedzi albo puste pola.
2. Stuknięcie liczby otwiera wpis na karcie (klawiatura numeryczna); obok liczby przyciski ± o krok sprzętu.
3. „Seria zrobiona” → zapis i start przerwy (jak dziś).
4. Przy brakującej wartości „Seria zrobiona” nie odhacza serii — przenosi kursor do brakującego pola, bez okna.
Reguła kroku ± i to, czy seria bez wyniku jest serią — sprawdza badacz (sprawa merytoryczna). Sesje zapisane wcześniej z pustymi seriami zostają bez zmian.

## ZM-02 — Ekran treningu (P01, P03)
1. Nagłówek w jednej linii: nazwa i czas treningu.
2. Miejsce, pauza, głos i notatka szablonu w menu „⋯” treningu (albo jednym wierszu ikon z etykietami — forma w E3).
3. Główna akcja ekranu to seria; „Zakończ” jako przycisk drugorzędny.
4. Prośba o zgodę na powiadomienia przy pierwszej przerwie („Przerwa trwa — powiadomić na koniec?”), nie w nagłówku; komunikat po odmowie raz, potem tylko w Ustawieniach.

## ZM-03 — Generator (P02)
1. „Zapisz szablony i plan”.
2. Gdy nie ma aktywnego planu: plan staje się aktywny bez pytania; przejście do Planowania z jednym zdaniem potwierdzenia na ekranie (bez okna „Zapisano”).
3. Gdy aktywny plan jest: pytanie o zastąpienie zostaje (decyzja z konsekwencją).
4. Zgoda na przypomnienie dopiero przy pierwszym zaplanowanym dniu albo jako wiersz w Planowaniu.
5. Przełącznik trybu znika z generatora; „Plan z moich szablonów” zostaje jako osobne wejście w Planowaniu i w Pierwszych krokach. Zmiana zakresu — do potwierdzenia przez rolę 03 przed E3.

## ZM-04 — Usuwanie poza treningiem (P08)
1. Ekrany szczegółów (sesja, szablon, ćwiczenie własne, miejsce) mają na dole „Usuń {obiekt}” → to samo okno [Anuluj, Usuń] co gest.
2. Listy bez ekranu szczegółów (pomiary masy ciała, gumy, talerze) mają „Edytuj” w nagłówku z trybem usuwania jak listy iOS.
3. Gest przesunięcia zostaje jako skrót (spójnie z DEC-12).

## ZM-05 — Seria na czas (P09)
W trakcie pomiaru karta i dolny pasek mają jedną nazwę: „Zakończ serię”; po pomiarze „Seria zrobiona” jak w innych seriach. Etykiety VoiceOver i zegarka zmieniane razem (docs/32 wz. 24).

## ZM-06 — Postępy (P07, z obowiązkowym M1-026 / DEC-09)
1. Wykres i rekordy wybranego ćwiczenia na górze ekranu (DEC-09).
2. Bez historii: sam pusty stan z akcją „Zacznij trening”.
3. Z historią: chipy tylko ćwiczeń z danymi; pozostałe przez wyszukiwanie.
4. Pod pustym stanem zostaje sekcja „Masa ciała” z wejściem do pomiarów (doprecyzowanie właściciela 21.10.2026, docs/18).

## ZM-07 — Dźwięk i wibracje (P11) — flaga danych
1. Dwa przełączniki w Ustawieniach: „Dźwięk na koniec przerwy” i „Wibracje”.
2. Krótka wibracja przy ✓ (zgodnie z docs/37 ZD-01), gdy „Wibracje” włączone.
3. Migracja: oba nowe pola przejmują wartość obecnego przełącznika „Dźwięk i wibracja”; test na kopii danych poprzedniej wersji. STOP przed partią.

## Decyzje wspólne (21.10.2026)
- Element firmowy: nowy element niosący dane (np. postęp serii albo tygodnia), trzy wyrenderowane kierunki w E3, wybór okiem.
- Skala tekstu: DEC-10 bez zmian (opisy do 200%, liczby z podglądem po przytrzymaniu — Large Content Viewer).
- Linia bazowa wyglądu: zrzuty iOS z nocnego E2E 21.10.2026 (przebieg 39537208004) jako „przed”.

## Bez zmian
P04, P05, P06, P10, P12, P13, P14, P15 — koszt adekwatny, bez kroku „porażka”. Trening z podpowiedziami (1 stuknięcie na serię) nie może się wydłużyć.
