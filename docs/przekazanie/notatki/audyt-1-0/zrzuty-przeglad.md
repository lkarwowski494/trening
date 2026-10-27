# Przegląd zrzutów iPhone 1.0 (agent „zrzuty 1.0”, 27.10.2026)

Źródło: store-screenshots run 40464544722 (zrzuty-1-0 @ c5d0177, aplikacja z 40457513087, jezyki=all) — **anulowany po limicie 180 min zadania**
(w 3 h powstało 6,5 z 35 języków: bg cs da de el en + 5 ekranów es-419). Przejrzane 1:1 w pełnej rozdzielczości (1320 × 2868): **en, 10 ekranów po ramkach**
(ramki złożone lokalnie tym samym `scripts/ci/store-frames.sh`), oraz surowe de i el (ekrany 01, 02, 04, 06). Ponowny przebieg pl,en: patrz dopisek na dole.

## Ustalenia blokujące zestaw
1. **Czas przebiegu `jezyki=all` jest nierealny:** ok. 2,7 min na ekran (Maestro: 2–3 uruchomienia na ekran, każde ok. 1 min na wolnym symulatorze macos-26) → 35 języków × 10 ekranów
   ≈ 16 h macOS na rozmiar; docs/48 podaje „ok. 2 h zegarowo” (estymata niezmierzona). Limit zadania 180 min ucina przebieg. Opcje: patrz raport (D7).
2. **Kanał alfa:** surowe zrzuty z symulatora to `srgba` (RGBA); po `store-frames.sh` wynik to `srgb` 1320 × 2868 bez alfy (sprawdzone `identify` na 10 plikach en) — Apple przyjmie.
   Zrzuty języków bez podpisów (poza pl, en) NIE przechodzą przez ramki → zostają z alfą (ramki je pomijają z ostrzeżeniem); gdyby trafiły do ASC, zostaną odrzucone.
3. **Ekran 02-cwiczenie — do powtórzenia po scaleniu `naprawa-figury-1-0` (PR #73):** figura przysiadu pokazana w kadrze animacji; faza losowa — w en „kąt kolana 5°”, w de 0°, w el 22°
   (te same dane, inny moment animacji), czyli zrzuty języków różnią się pozą. Do ustalenia przy powtórzeniu: kadr w stałej fazie (np. pauza animacji przed zrzutem), jeśli się da bez zmiany kodu.

## Uwagi do każdego obrazu (en, po ramkach)
| Ekran | Uwagi |
|---|---|
| 01-trening | Podpis OK, bez nachodzenia. W kadrze karta „Resting — notify you when it ends?” (prośba aplikacji o powiadomienie) — zasłania treść, wygląda jak okno systemowe; do decyzji (kosmetyka). Nagłówek „Back Squat” stykający się z kartą (brak odstępu). Dolny pasek zakrywa kolejną sekcję (normalne przewinięcie). |
| 02-cwiczenie | Patrz pkt 3. Technika rozwinięta, rysunek czytelny (widok z boku i z przodu), tekst się nie nachodzi. Dolna linia „Tips” ucięta ramką (normalne). |
| 03-postepy-cwiczenia | OK; wykres e1RM i rekordy czytelne; daty „Aug 14 – Oct 23”. |
| 04-straznik | OK; sylwetki małe względem ekranu; wiersz „hamstrings” ucięty paskiem (normalne). |
| 05-plan | Dolna ~25% ekranu pusta — słaby ekran sklepu (kosmetyka). Brak dolnego paska (ekran z „Back”). |
| 06-dostosuj | Dolna ~20% pusta; okno z „Cancel” po lewej (zgodnie ze wzorcem). W de/el nazwy ćwiczeń i „Home” po angielsku (nazwy z katalogu/dane użytkownika). W el tytuł „Προσαρμογή σε:…” ucięty wielokropkiem. |
| 07-progresja | OK; data „Oct 1 – Oct 27 vs Sep 1 – Sep 27” zależy od dnia przebiegu (zrzut robić po 10. dniu miesiąca — zachowane). |
| 08-historia | OK; kalendarz i lista; „Planning” w nagłówku. |
| 09-szablony | **Ponad połowa ekranu pusta** (4 szablony) — najsłabszy ekran zestawu (kosmetyka; można zamienić albo dodać szablony w danych pokazowych). |
| 10-import | W „Date range” brak roku przy dacie końcowej („Tue, Aug 26, 2025 – Tue, Jul 21”) — niespójny format zakresu dat w aplikacji (kosmetyczny; do backlogu 1.0.1). Ikona (i) w osobnej linii pod opisem. |

## Wymiary, alfa, język danych, nachodzenie, podpisy
- Wymiary: wszystkie 1320 × 2868 (6.9″), zgodne z wymaganiem; 6.3″ (1206 × 2622) w artefakcie 12724798548 (nieoglądane 1:1, ten sam skrypt).
- Alfa: patrz pkt 2 powyżej.
- Język danych: nazwy szablonów („Legs”, „Push”, „Full body”), nazwa miejsca „Home” i nazwy ćwiczeń w oknie „Dostosuj” są angielskie we wszystkich językach (znane ograniczenie docs/41: dane użytkownika).
- Nachodzące elementy: brak w en; w el legenda Strażnika zawija się do 2 wierszy; tytuł okna „Dostosuj” ucięty.
- Podpisy: tylko pl i en (status en/cwiczenie = propozycja do akceptacji właściciela); pozostałe 31 języków bez podpisów — krok „ramki” je pomija.
