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

## Dopisek: przebieg pl,en 40487178778 (zrzuty-1-0 @ e61683b5, aplikacja z 40457513087) — zielony, 1 h 28 min (6.9 ok. 71 min, 6.3 ok. 46 min na 20 ekranów)
- Artefakt `sklep-zrzuty-ramki`: 40 PNG (pl, en × 10 × 2 rozmiary), **wszystkie `srgb` bez kanału alfa**, 1320 × 2868 i 1206 × 2622 (`identify`).
- **ZNALEZISKO (pl/10-import, 6.9): zamiast podglądu importu otwarte puste systemowe okno wyboru plików („Recents / No Recents”).** Dziennik `pl-import-import/maestro.log`: akcja
  nie powiodła się po 3 próbach (asercja „Browse|Recents|Cancel” nie przeszła), skrypt tylko ostrzegał i zrobił zrzut. en/10-import jest poprawny. Naprawa w potoku: ekran powtarzany raz,
  po drugiej porażce zrzut ląduje w `.nieudane` (nie w zestawie) i na liście w podsumowaniu; test na atrapach `tests/store-screenshots-retry.test.ts`. **Zestaw pl 6.9 wymaga powtórzenia ekranu `import`** (wejście `ekrany=import`).
- pl 01–09: bez nachodzenia; podpisy PL (zaakceptowane 14.10) i EN zgodne z `store/screenshot-captions.json`. pl/02-cwiczenie: kąt kolana 0° (w en 5°) — faza animacji losowa, jak wyżej.
- Podpisy `cwiczenie` PL „Rysunki ruchu i wskazówki techniki” i EN „Movement drawings and technique cues” (status propozycja) mieszczą się w 2 wierszach, bez ucięcia.

## Zegarek (watch-sim 40488905420 @ 6c0976df, 35 języków)
- 175 PNG = 35 × 5 (bez stanu „paused”), nazwy `01-set-first … 05-idle`, **416 × 496 `srgb`, bez kanału alfa** (identify na wszystkich); poprzedni zestaw 40477377838: 210 PNG, też bez alfy.
- Dane w języku zrzutu: obejrzane pl, en, de, ja, ru (np. ja „セット 1/3”, ru „подход 1 из 3”); nazwa ćwiczenia „Bench Press (Barbell)” po angielsku we wszystkich językach poza pl (nazwa z katalogu), jednostki i ciężar „80 kg × 8” takie same.
- Nakładka „Trening wstrzymany” nie występuje (stan pominięty); błąd w aplikacji opisany w backlogu 1.0.1 (docs/21).
- **Uwaga do decyzji właściciela:** w pasku stanu każdego zrzutu czerwona ikona „brak telefonu” (przekreślony iPhone) i godzina bieżąca (nie 9:41). Ikona to znacznik „offline” aplikacji zegarka na symulatorze bez sparowanego telefonu; na zrzucie w sklepie wygląda jak błąd.
  Opcje: A) zaakceptować (zero pracy; ryzyko słabszego wrażenia), B) wyłączyć znacznik tylko w konfiguracji Debug przy migawce testowej (zmiana w `targets/watch-app`, wymaga przebiegu watch-sim; ok. 1 h pracy agenta + 1 przebieg) — rekomendacja B przed wgraniem zegarka, ale nie blokuje 1.0 (zegarek można dodać po premierze).
