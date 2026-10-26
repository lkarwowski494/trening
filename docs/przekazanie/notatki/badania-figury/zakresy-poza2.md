# Zakresy stawów w kontrakcie figur poza@2 (`EXT_ROM`) — sprawdzenie normami

Data: 26.10.2026. Autor: badacz merytoryczny. Nic nie jest commitowane.

## Zastrzeżenia

- **Nie czytałem kodu.** Stałej `EXT_ROM` nie ma w drzewie roboczym (`naprawa-e2e-26b`), a gałęzi
  `origin/figury-kontrakt-r4` nie mogłem otworzyć bez git. Sprawdzam wartości przekazane przez koordynatora.
- **Znak zakresu nadgarstka to moje założenie:** przyjmuję, że w „−70…80°” minus oznacza wyprost (70°), a plus zgięcie (80°).
- **Jak czytać zakres w figurze:** to granica pozy na rysunku, a nie norma, którą pokazujemy użytkownikowi. Granica nie powinna
  przekraczać typowego zakresu zdrowego dorosłego. Dlatego proponuję zaokrąglać do średniej z badań, a nie do „średnia + SD”.

## Wyniki

| Zakres | Kontrakt | Normy (przeczytane) | Ocena | Propozycja |
|---|---|---|---|---|
| Skręt tułowia | ±45° | rotacja lędźwiowa 38,4 ± 8,7° (P) i 38,6 ± 9,4° (L) [Z1]; rotacja piersiowa 36,6 ± 9,8° i 38,8 ± 10,5° (golfiści) [Z2] | 45° jest powyżej średnich z obu źródeł (37–39°), ale mieści się w średniej + 1 SD | **poprawić na ±40°** (zaokrąglenie części wspólnej); pewność: dwa źródła szczebla 3, jedno z populacji szczególnej |
| Przechył tułowia (skłon boczny) | ±35° | zgięcie boczne lędźwiowe 36,3 ± 6,4° i 36,2 ± 6,6° [Z1] | zgodne | **potwierdzić ±35°**; jedno źródło (szczebel 3) |
| Przechył miednicy | ±15° | brak przeczytanej normy | — | **uproszczenie**, bez zmian; [OTWARTE] |
| Przechył głowy | ±35° | zgięcie boczne szyi 42,1 ± 7,9° i 41,4 ± 7,7° [Z1] | kontrakt jest poniżej średniej, więc bezpiecznie mieści się w normie | **potwierdzić ±35°** (ostrożnie; można podnieść do ±40°); jedno źródło |
| Uniesienie barków | −3…6 cm | brak normy w cm | — | **uproszczenie z zakresem**, bez zmian |
| Wysunięcie barków | −4…6 cm | brak normy w cm | — | **uproszczenie z zakresem**, bez zmian |
| Nadgarstek: zgięcie i wyprost | −70…80° | zgięcie 74,03 ± 13,0°, wyprost 66,71 ± 14,1° [Z3]; zgięcie 73,9 ± 6,4°, wyprost 65,9 ± 5,2° [Z4] | oba badania niezależnie: zgięcie ok. 74°, wyprost ok. 66°; kontrakt jest nieco powyżej | **poprawić na −65…75°**; dwa źródła (szczebel 3) |
| Prono-supinacja | ±80° | dorośli 20–69 lat: nawracanie 76,9–82,0°, odwracanie 82,4–90,6° (średnie wg płci i wieku) [Z5] | zgodne: 80° to granica nawracania, a odwracanie bywa większe | **potwierdzić ±80°**; jedno źródło (baza referencyjna CDC, szczebel 3) |

## Źródła

- **Z1:** Apti A, Çolak TK, Akçay B. Normative Values for Cervical and Lumbar Range of Motion in Healthy Young Adults.
  J Turk Spinal Surg 2023;34(3):113–117.
  - Adres: https://openaccess.iku.edu.tr/entities/publication/1d43fa73-7df0-4c7f-b388-43469591b92b/full
  - Miejsce: wyniki (średnie ± SD).
  - Wniosek autorów: wartości są „generally similar to the widely used reference values of AAOS and Kendall McCreary”.
- **Z2:** Bloemhof BE, Volkwyn CA, Ferreira S. Establishing normative flexibility values for the thoracic spine of competitive male
  South African golfers. S Afr J Sports Med 2025;37(1).
  - Adres: https://pure.uj.ac.za/en/publications/establishing-normative-flexibility-values-for-the-thoracic-spine-/
  - Miejsce: streszczenie.
  - Cytat: „Left rotation averaged 36.6°±9.8° and right rotation 38.8°±10.5°.”
  - Pomiar inklinometrem cyfrowym. Populacja szczególna, więc źródło służy tylko jako potwierdzenie rzędu wielkości.
- **Z3:** Lendner N i in. Utility of the iPhone 4 Gyroscope Application in the Measurement of Wrist Motion. Hand (N Y) 2019;14(3):352–356.
  - Adres: https://pmc.ncbi.nlm.nih.gov/articles/PMC6535937/
  - Miejsce: tab. 2 (pomiar goniometrem, zdrowe nadgarstki).
  - Cytat: „The values found in our population were similar to other published data.”
- **Z4:** Chung WK, Park DC, Chi KS. Range of Active Motion and Axial Angles of the Wrist Joint in Normal Adult Korean.
  J Korean Orthop Assoc 1986;21(6):993–1002.
  - Adres: https://synapse.koreamed.org/articles/1122791
  - Miejsce: streszczenie; zgięcie 73,9 ± 6,386°, wyprost 65,9 ± 5,164°.
- **Z5:** Soucie JM i in. Range of motion measurements: reference values and a database for comparison studies. Haemophilia 2011
  (wersja elektroniczna z 11.11.2010).
  - Tabela wartości referencyjnych na stronie CDC: https://archive.cdc.gov/www_cdc_gov/ncbddd/jointrom/index.html
  - Miejsce: tabela „Elbow pronation / supination”, grupy wiekowe 20–44 i 45–69 lat.

**Odrzucone jako źródło:**
- Fiszki i tabele szkoleniowe z wartościami „AAOS 80/70, 45/35”. Nie są źródłem pierwotnym, a samej publikacji AAOS nie przeczytałem.
- Wartości z artykułu saudyjskiego (zgięcie boczne 26 ± 7°) i przeglądu Thoomes-de Graaf 2020 (szyja). Nie miałem dostępu do liczb
  z tekstu, tylko do streszczenia z wyszukiwarki.

## Otwarte pytania

1. [OTWARTE] Przechył miednicy ±15°: brak przeczytanej normy, więc zostaje uproszczeniem. Możliwy kierunek dalszych poszukiwań to
   normy odwiedzenia i przywiedzenia biodra w staniu.
2. [OTWARTE] Przesunięcia barków w cm: zostają uproszczeniem z zakresem. Norm w cm nie znalazłem; źródła podają te ruchy w stopniach
   ruchu obojczyka.
3. [OTWARTE] Skręt tułowia: Z1 mierzy rotację lędźwiową, a Z2 piersiową u golfistów. Normy dla całego tułowia (piersiowo-lędźwiowej
   łącznie) nie przeczytałem. Na tej podstawie proponowane ±40° pozostaje oznaczone jako „dwa źródła, część wspólna”.
4. [OTWARTE] Do potwierdzenia w kodzie: znaki i jednostki w `EXT_ROM` na gałęzi `origin/figury-kontrakt-r4`.
