# Kierunki E2 — redesign M3 (rola 04 build, 21.10.2026)

Cztery kierunki na tym samym ekranie kluczowym: ekran treningu z kartą „teraz” w stanie „seria” (wpis z ±, ZM-01) i „przerwa”. Zestaw kierunków ustalił właściciel na STOP E1 (docs/18, 21.10.2026). Strona dla właściciela: [`../porownanie.html`](../porownanie.html), zrzut: [`../porownanie.png`](../porownanie.png).

| Plik | Kierunek | Element firmowy (dane) | Krój tytułów |
|---|---|---|---|
| [`a-tablica-podejsc.html`](a-tablica-podejsc.html) | A — Tablica podejść (M1) | tablica: ciężar × powtórzenia, numer serii, pola serii, zegar przerwy | Barlow Condensed |
| [`b-swiatla-sedziowskie.html`](b-swiatla-sedziowskie.html) | B — Światła sędziowskie (M2) | rząd świateł = serie: zrobione, teraz, przed tobą, pominięta (czerwone z „×”, na próbę) | Chivo |
| [`c-kreska-kreda.html`](c-kreska-kreda.html) | C — Kreska kredą (M3) | kreski: serie treningu w piątkach i serie ćwiczenia; świeża kreska żółta | Caveat |
| [`d-talerze-iwf.html`](d-talerze-iwf.html) | D — Talerze IWF w środku aplikacji | gryf z talerzami = serie ćwiczenia; wariant D1 bez barw (zgodny z decyzją 09.10.2026) | Archivo szerokie |

Każdy plik zawiera: oba stany ekranu (`<main data-ekran="seria|przerwa">`), kartę stylu (idea, element i dane, paleta z pochodzeniem, kroje, kształty, ruch/haptyka/dźwięk, głos, ikona, argument), ikonę w trzech rozmiarach (jasną i ciemną) oraz mały format: ekran blokady (Live Activity przerwy) i zegarek. Wersja ciemna: `data-theme="dark"`. Nazwy i liczby na ekranach: [PRZYKŁAD].

Pliki HTML generuje `node docs/design/narzedzia/kierunki-gen.mjs` (wspólny chrom: `wspolne.css`). Zrzuty: `docs/design/narzedzia/zrzuty.mjs` (320/390/430 pt × jasny/ciemny × domyślny/AX5). Playwright jest uruchamiany spoza projektu, a projekt nie dostaje nowych zależności.

## Skala tekstu (wyjątek od podłogi studia — decyzja STOP E1)
Wariant „AX5” skryptu (`--dt-tresc: 3.1`) renderuję informacyjnie, a makiety stosują DEC-10: opisy do 200% (`--dt-opis`), liczby w polach do 130% (`--dt-liczba`) z podglądem po przytrzymaniu. Różnica wobec podłogi studia (treść do ok. 310%) to zapisany wyjątek (docs/18, STOP E1).

## Test generyczności — pole po polu
Karty kontrolne (a) i (b): `docs/design/01-swiat.md` §6. Zostały napisane przed kartami kierunków. Odniesienie: „Kalibracja domyślnych wyborów” roli 04.

| Kier. | Pole | Karta (a) | Karta (b) | Kalibracja | Zmiana / decyzja |
|---|---|---|---|---|---|
| A | paleta | **pokrycie** w pierwszej wersji: prawie czarna tablica i jaskrawy bursztyn („ciemne tło + jeden akcent”) | — | „prawie czarne tło z jednym akcentem” | Tablica granatowa `#13294B` na jasnym tle hali `#E6E8E5`. Bursztyn tylko dla „teraz” (zegar i ramka bieżącej serii), nie jako akcent interfejsu. |
| A | krój tytułów | Inter/Space Grotesk — brak pokrycia | — | wersaliki z rozstrzeleniem | Wersaliki tylko w nazwie ćwiczenia na tablicy, jak nazwisko na tablicy podejść (IWF 3.3.6.15); pozostałe etykiety zwykłą wielką literą. Decyzja do potwierdzenia w E3. |
| A | element firmowy | pierścień, płomień — brak | karta bieżącego kroku — częściowe | — | Tablica niesie pola wszystkich serii z wynikami, a nie jeden krok. |
| A | układ | duża liczba + kafelki — **pokrycie** z „bohaterem” | — | „duża liczba + mała etykieta” | Duża liczba zostaje, bo to zadanie do wykonania czytane z 2 m, a nie statystyka. Nie ma kafelków statystyk ani gradientu. |
| A | ruch | fade + slide, konfetti — brak | — | — | Jeden ruch: przewrócenie klapki; przy „Ogranicz ruch” przenikanie. |
| B | paleta | ciemne tło + jaskrawa czerwień — **pokrycie** w pierwszej wersji | — | „prawie czarne + cynobrowy akcent” | Tło jasne (aluminium `#EEF0F2`), a grafit tylko w obudowie świateł. Czerwień nie jest akcentem: to znak pominiętej serii, zawsze z „×” (IPF 2.8). Interfejs czarno-biały. |
| B | krój tytułów | grotesk w stylu Inter — **częściowe** | — | Inter jako krój tożsamości | Chivo 800 o szerszych cyfrach. Ryzyko zostaje, więc krój rozstrzyga porównanie 5 krojów po wyborze (E2 krok 6). |
| B | element firmowy | pierścień postępu (koło) — **częściowe** | okrągły minutnik — częściowe | — | Światła są policzalne (jedno na serię) i nie wypełniają się procentem. |
| B | ikona | — | — | — | Pierwsza wersja (trzy białe koła) czytała się jak „⋯ więcej”. Teraz obudowa z dwoma białymi i jednym czerwonym światłem. |
| B | układ, ruch | — | — | — | Zapalenie światła (ok. 120 ms) i błysk całego rzędu na koniec ćwiczenia. |
| C | paleta | — | **pokrycie** w pierwszym pomyśle: kremowy papier | krem `#F4F1EA` (druga fala) | Chłodna biel magnezji `#F5F6F3`, bez terakoty i bez szeryfu. Żółta kreda tylko na świeżej kresce; ciemny motyw to łupek. |
| C | krój tytułów | — | kontrastowy szeryf — brak | — | Caveat (pismo ręczne) tylko w nazwach i nagłówkach; liczby krojem systemowym. |
| C | element firmowy | płomień serii dni — brak (inne dane) | — | — | Kreski liczą serie, a nie dni z rzędu. |
| C | układ, ruch | — | karta kroku — brak (bez kart) | karty SaaS — brak | Pociągnięcie kreski; przy „Ogranicz ruch” od razu. |
| D | paleta | — | — | papier `#F4F3EF` blisko kremu | Bez zmiany: to obecny motyw, który właściciel wskazał na STOP E1 (wyjątek zapisany). Papier jest neutralny, bez terakoty. |
| D | krój tytułów | — | — | — | Archivo szerokie zamiast obecnego IBM Plex. |
| D | element firmowy | — | — | sztanga to klisza kategorii (E1) | Według lekcji z Treningu klisza, która niesie dane, przestaje być kliszą. Tu talerze niosą serie. Konflikt z decyzją 09.10.2026 opisany na bramce. |
| D | układ | duża liczba — **pokrycie** jak w A | — | „bohater” | Uzasadnienie jak w A. |
| D | ruch | — | — | — | Wsunięcie talerza ruchem z intro; ostatnia seria domyka zacisk. |

Pamięć portfolio: żaden kierunek nie bierze palety ani kroju Organizera (piasek, terakota, Bricolage, Atkinson) ani NaviStories (brąz, Jost). A–C nie używają palety talerzy jako palety marki (decyzja STOP E1).

## Kontrast (WCAG 2.2, skrypt `../narzedzia/kontrast.mjs`)
Pary sąsiadujących kolorów obu motywów: [`kontrast.json`](kontrast.json), wynik: [`kontrast-wynik.txt`](kontrast-wynik.txt). Wszystkie 70 par spełnia próg (kod 0). Poprawki po pierwszym pomiarze:
- A, ciemny: brzeg tablicy `#2E4D7C` → `#5675A8`.
- B: czerwone światło `#E0262F` → `#EC3B43`, bo „×” na czerwieni i czerwień na obudowie miały 2,92:1.
- B, ciemny: brzeg obudowy → `#6A707A`.
- C: kreska czekająca → `#848D87`.
- D: kontur czekający → `#8C897F` w jasnym i `#70747C` w ciemnym.
- D: talerz żółty na papierze ma 1,51:1, więc talerz żółty i biały dostają obrys w kolorze gryfu (mierzony obrys/talerz).

Tabela kontrastu z wariantem „Zwiększ kontrast” powstaje w E3 dla wybranego kierunku.

## Pomiar warsztatu (`../narzedzia/warsztat.mjs`, 390 px)
Wszystkie cztery pliki: **0 błędów** (brak tekstu < 11 px i cienkich odmian). Ostrzeżenia dotyczą liczby wielkości i kolorów tekstu (14–18 wielkości). Wynikają głównie z paneli poza ekranem: karty stylu, ikon, ekranu blokady i zegarka. Hierarchię samego ekranu porządkuje E3 (skala typograficzna w tokenach). Odstępy poza jednostką 4 px pochodzą z obramowań 1–3 px i z elementów skalowanych zmienną tekstu.

## Kroje (licencje)
Wszystkie kroje mają licencję SIL Open Font License 1.1, która pozwala osadzić je w aplikacji. Pliki i licencje leżą w `../fonty/<krój>/` (`OFL.txt`) i pochodzą z repozytorium google/fonts (katalog `ofl/`, pobrane 21.10.2026).

| Krój | Rola w makiecie | Licencja |
|---|---|---|
| Barlow Condensed 600/700 | tytuły i liczby A | OFL 1.1 (`barlow-condensed/OFL.txt`) |
| Chivo (zmienny) | tytuły i liczby B | OFL 1.1 (`chivo/OFL.txt`) |
| Caveat (zmienny) | tytuły C | OFL 1.1 (`caveat/OFL.txt`) |
| Archivo (zmienny, szerokość 62–125%) | tytuły i liczby D | OFL 1.1 (`archivo/OFL.txt`) |
| Source Sans 3 (zmienny) | krój zastępczy treści (na iOS: SF Pro) | OFL 1.1 (`source-sans-3/OFL.txt`; „Source” to zastrzeżona nazwa kroju) |

## Ikony
`ikony/<k>-jasna.svg` i `ikony/<k>-ciemna.svg`. A–C to nowe szkice, a D to obecna ikona (`assets/brand/icon.svg`, `icon-dark.svg`). Kontrola `ikona.mjs` (1024 px, bez przezroczystości) dała kod 0 dla A, B, C (obu wariantów) i dla D w wersji jasnej. Obecna ikona ciemna D ma przezroczyste tło (wariant ciemny iOS), więc skrypt dla iOS zwraca 1. To zamierzone; do sprawdzenia w E3 przy plikach ikony. Pliki docelowe ikony (warstwy, Android, zegarek) powstają w E3 dla wybranego kierunku.

## E2b — warianty A1 i A2 (21.10.2026, po wyborze kierunku A)
Właściciel wybrał A i poprosił o dwa warianty obok siebie (docs/18, STOP E2). Ikona i intro zostają obecne. Strona: [`../porownanie-a.html`](../porownanie-a.html), zrzut: [`../porownanie-a.png`](../porownanie-a.png).

| Plik | Wariant | Ekrany (`data-ekran`) |
|---|---|---|
| [`a1-tablica.html`](a1-tablica.html) | A1: A jak w E2 | seria, przerwa, start (Trening przed treningiem), postepy (pusty stan ZM-06) |
| [`a2-tablica-talerze.html`](a2-tablica-talerze.html) | A2: A z barwami talerzy w tle startu i pustych stanów (krycie 16% jasny / 20% ciemny) | jak A1 |
| [`a-serie.html`](a-serie.html) | pola serii dla 1–12 serii i tryb zapasowy > 12; zrzut [`../a-serie.png`](../a-serie.png) | arkusz |

Generator: `node docs/design/narzedzia/a-warianty-gen.mjs`. Zrzuty 390 pt (jasny i ciemny) leżą w `zrzuty/a1-*`, `zrzuty/a2-*`, a pełny zestaw 320/390/430 × motyw × AX5 leży poza repo w katalogu roboczym audytu M3.
Kontrast: [`kontrast-a.json`](kontrast-a.json) → [`kontrast-a-wynik.txt`](kontrast-a-wynik.txt): 44 pary, wszystkie spełniają progi, kod 0. Zawiera tekst i tekst pomocniczy na każdej barwie talerza A2 w obu motywach.

**Kroje tytułowe (E2 krok 6):** [`../kroje.html`](../kroje.html), zrzut [`../kroje.png`](../kroje.png). Pięć krojów na ekranie A1: Barlow Condensed (obecny), Oswald, Big Shoulders, Saira Condensed i Doto. Wszystkie OFL 1.1, pliki i licencje w `../fonty/<krój>/OFL.txt` (google/fonts, `ofl/`, pobrane 21.10.2026).
