# Ekran „Trening” nowej osoby — kandydaci, karty kontrolne, test generyczności (05.11.2026)

Decyzja typu P w ramach **istniejącego systemu** (tokeny `lib/tokens.ts`, Barlow Condensed z `docs/design/fonty`, motyw talerzy A2) — nie nowa
tożsamość. Przedmiot ze świata dziedziny jest już wybrany (kierunek A „tablica podejść”, 21.10.2026); pytanie brzmi, **jaki element firmowy
z prawdziwymi danymi może mieć osoba, która jeszcze nic nie zrobiła**.

Uwaga: `docs/design/tokeny.ts` różni się od `lib/tokens.ts` w `MOTIF.where` (sylwetka w rogu → ikonka po tytule, 22.10.2026) i w kilku stałych
przejściowych. Makiety biorą wartości z `lib/tokens.ts` (stan obowiązujący); plik w `docs/design` jest nieaktualną propozycją E3.

## Dane nowej osoby (sprawdzone w kodzie — szczegóły w `as-is.md`)

Data i bieżący tydzień · stan kroków (szablon, plan) · ustawienia: jednostka kg, miejsca brak, motyw · biblioteka ćwiczeń · licznik darmowych dni (gdy włączony).
Nie ma: szablonów, planu, historii, miejsc.

## Kandydaci (10)

| # | Kandydat (1 zdanie) | Prawdziwe dane elementu firmowego | Moment firmowy | Ryzyko |
|---|---|---|---|---|
| C1 | **Tablica dnia** — granatowa tablica „Dziś” od pierwszego dnia: „DZIŚ: CZWARTEK, 5 LISTOPADA” i wiersze stanu startu | data; liczba szablonów, plan, liczba treningów | wiersz „Szablony 0 → 1” obraca się jak klapka (`MOTION.boardFlipMs`) | „0 / brak / 0” brzmi jak braki; pierwsza wersja z wielką cyfrą daty wpadła w kliszę „duża liczba + etykieta + statystyki” (poprawione) |
| C2 | **Pusty tydzień** — pasek tygodnia (jak u osoby z planem) od pierwszego dnia, dziś w ramce, pusty stan z gryfem A2 | prawdziwe dni tygodnia, „dziś”, dni wolne bez znaku | po pierwszym zapisanym treningu w kolumnie „dziś” pojawia się znak dnia | ekran spokojny, „wow” dopiero w momencie; pusty pasek może wyglądać na niezaładowany |
| C3 | **Karta zgłoszenia** — „Pierwsze kroki” jako rubryki karty zgłoszenia zawodnika z wartościami | miejsca, jednostka, szablony, plan, pierwszy trening, import | „✓” wbija się jak stempel przy ustawionej rubryce | zmienia formę P4 A i zdanie o miejscach; bliskie liście ustawień |
| C4 | **Światła kroków** — trzy światła sędziowskie dla kroków 1–3, białe = zrobione | stan kroków | światło zapala się z wibracją | wraca do kierunku B, niewybranego 21.10.2026; „gra” na ekranie startu |
| C5 | **Intro przechodzi w ekran** — talerze z intro zostają na ekranie jako gryf nowej osoby | brak (dekoracja) | ładowanie talerzy | ozdoba bez danych — odrzucony (zasada studia 2) |
| C6 | **Biblioteka na tablicy** — ruchoma figura ćwiczenia z biblioteki i liczba ćwiczeń | biblioteka | figura wykonuje powtórzenie | bramka 4 (recenzja figur), wygląda jak samouczek, ruch w pętli rozprasza |
| C7 | **Grafik siłowni** — tydzień jako tablica grafiku zajęć z „wolnymi” polami | tydzień | wpis pojawia się w polu | dubluje C2 z mniejszą zgodnością z istniejącym paskiem |
| C8 | **Licznik darmowych dni jako talerze** | dni treningowe w miesiącu | talerz znika | łamie zasadę „kolor talerza = tylko ciężar” — odrzucony |
| C9 | **Tablica podejść „na sucho”** — podgląd tablicy treningu z przykładowym ćwiczeniem | brak (dane przykładowe) | „Seria zrobiona” na niby | samouczek przed wartością (U13), fałszywe dane — odrzucony |
| C10 | **Pierwsza strona dziennika** — kartka notesu z datą i miejscem na wpis | data | podpis ręczny | papier/kreda odrzucone 07.10.2026 („PowerPoint”) — odrzucony |

**Wybór:** K1 = C1, K2 = C2, K3 = C3 (trzy różne odpowiedzi: tablica, tydzień, rubryki — każda niesie inne prawdziwe dane).
**Rezerwa:** C4 (gdyby właściciel chciał mocniejszego momentu i zgodził się wrócić do świateł) i C6 (po recenzji figur, gdyby chciał pokazać bibliotekę).

## Karty kontrolne (napisane przed porównaniem, bez patrzenia na K1–K3)

**(a) Dziennik siłowni bez wiedzy o dziedzinie — ekran pierwszego uruchomienia:** duży nagłówek „Witaj!” z ilustracją albo zdjęciem hantli;
pierścień postępu „0/3” nad listą zadań z ikonami w kolorowych kółkach; przycisk „Rozpocznij trening” z gradientem; kafelki statystyk z zerami;
ruch: lista wjeżdża „fade + slide up”.

**(b) Inna dziedzina, podobny przepływ (aplikacja do nauki z codziennym celem):** licznik serii dni z płomieniem; rząd 7 kropek tygodnia,
dzisiejsza pulsuje; maskotka z dymkiem; lista „pierwsze kroki” z odhaczaniem i procentem; ruch: konfetti po pierwszym zadaniu.

## Test generyczności (pole po polu)

| Pole | K1 Tablica dnia | K2 Pusty tydzień | K3 Karta zgłoszenia | Pokrywa się z kartą kontrolną / kalibracją? | Zmiana |
|---|---|---|---|---|---|
| Paleta | tokeny A (granat tablicy, krem, hala) | to samo + motyw A2 w pustym stanie | to samo | nie (gradient, kolorowe kółka — nie) | — |
| Krój tytułów | Barlow Condensed (zatwierdzony) | to samo | to samo | nie | — |
| Element firmowy | tablica „Dziś” z wierszami stanu | pasek tygodnia ze znakiem dnia | rubryki z wartościami | **K1 v1: tak** — wielka cyfra daty + 3 pola = „duża liczba + mała etykieta + statystyki” (kalibracja); **K2: częściowo** — rząd 7 dni = kropki tygodnia z (b); **K3: częściowo** — lista zadań z (a) | K1: cyfra usunięta, tablica w postaci „Dziś” jak u osoby z planem (para przed/po). K2: bez licznika serii, bez pulsowania, znak dnia = ikona aplikacji i tylko po prawdziwym treningu, dni wolne bez znaku. K3: bez pierścienia i procentu, rubryki z wartościami zamiast pól wyboru, bez wersalików z rozstrzeleniem w podpisach |
| Układ | tablica → start → kroki | pasek → pusty stan → start → kroki | start → rubryki | (a) nagłówek „Witaj” → pierścień → lista: nie | — |
| Ruch | klapka jednego wiersza (250 ms) | znak dnia w kolumnie „dziś” (250 ms) | stempel „✓” (250 ms) | (a) fade+slide każdej sekcji, (b) konfetti: nie | jeden moment na kierunek, „Ogranicz ruch”: przenikanie albo od razu |
| Głos | teksty z `lib/i18n`, nowe oznaczone | to samo | to samo | „Witaj!”: nie | — |

## Karty kierunków (skrót; pełne w panelach makiet)

| | K1 Tablica dnia | K2 Pusty tydzień | K3 Karta zgłoszenia |
|---|---|---|---|
| Plik | `../kierunki/start-1-1-tablica-dnia.html` | `../kierunki/start-1-1-pusty-tydzien.html` | `../kierunki/start-1-1-zgloszenie.html` |
| Idea | Nowa osoba od razu dostaje tablicę „Dziś” — z datą i stanem startu zamiast ćwiczeń | Tydzień, który zapełni się treningami, jest widoczny od pierwszego dnia | Kroki jako karta zgłoszenia: co aplikacja o Tobie wie i gdzie to zmienić |
| Dane | data, szablony, plan, treningi | dni tygodnia, dziś, znak dnia po treningu | miejsca, jednostka, szablony, plan, pierwszy trening, import |
| VoiceOver | „Tablica dnia: dziś, czwartek, 5 listopada. Szablony: 0. Plan tygodnia: brak. Treningi: 0.” | dzień: „czwartek, 5 listopada, dziś, wolne” | rubryka: „Szablony: 1, ustawione. Szablony i plan.” |
| Decyzje | żadnej nie zmienia | zmienia regułę z kodu `TodayPlan.tsx:20,35` (nie decyzję właściciela) | **zmienia P4 A (forma kroków) i 11.10.2026 (zdanie „Miejsca i sprzęt” → rubryka)** |
| Wspólne opcje TO BE | Z-2 (tekst przycisku), Z-4 (wiersze z „›”) | Z-2, Z-4, **Z-5 (domknięcie)** | Z-2 |

## Render, pomiar, krytyka (05.11.2026)

Makiety: generator `../narzedzia/start-1-1-gen.mjs` → `../kierunki/start-1-1-*.html` (+ `start-1-1.css`, chrom z `wspolne.css`). Zrzuty `zrzuty.mjs`:
84 pliki (3 kierunki × stany × 320/390/430 × jasny/ciemny × domyślny/AX5), krój Barlow Condensed potwierdzony jako załadowany. Arkusze: `zrzuty/arkusz-*.png`;
wybrane pełne zrzuty: `zrzuty/kierunki/`; skala szarości: `zrzuty/szary-*.png`; pary przed/po: `zrzuty/kierunki/*-przed-390-dark.png` / `*-po-390-dark.png`.

- **Kontrast** (`../kierunki/kontrast-start-1-1-wynik.txt`): 17 par, wszystkie OK; najniższe: ciemna krawędź tablicy na tle 3,68:1 (element, próg 3), ramka rubryki K3 na tle jasnym 3,88:1 (element).
- **Warsztat** (`warsztat-wynik.txt`, 390 px): 0 błędów we wszystkich kierunkach. Ostrzeżenia: liczba wielkości tekstu (10–12) i odstępy poza 4 px pochodzą z paneli opisu i wspólnego chromu (pasek stanu, zakładki) — na samym ekranie 6–7 wielkości (13–34 px, w tym 14 px numeru kroku jak `TEXT_SIZE.medium`), jedyny odstęp poza siatką to 2 px pod tytułem przycisku startu (jak w aplikacji, `StartPanel.tsx:63`). Pasek tygodnia K2 poprawiony na 4/8 px.
- **Skala szarości:** stan kroków i rubryk niesie kształt („✓”, pełne kółko, mocniejsza ramka), „dziś” — ramka; nic tylko kolorem.

**Krytyka (najpierw usterki):**

| Kierunek | Usterka (miejsce — co nie tak) | Poziom | Stan |
|---|---|---|---|
| K1 | Tablica — wielka cyfra „5” + trzy pola z liczbami = klisza „duża liczba + etykieta + statystyki” (pyt. 3) | P1 | naprawione: tablica w postaci „DZIŚ: …” z wierszami, jak u osoby z planem (para przed/po) |
| wszystkie | Zdanie „Miejsca i sprzęt” zawijało się w połowie szerokości, „›” w środku wiersza | P1 | naprawione (CSS `.zdanie`) |
| wszystkie | Nazwa działania kroku szarym drobnym tekstem — nie wygląda na działanie (przejście poznawcze, P2) | P1 | naprawione: tekst główny, półgruby |
| K3 | Pierwsza wersja wyglądała jak lista Ustawień — metafora karty niewidoczna (pyt. 7) | P1 | naprawione: rubryki z ramką, podpis–wartość–działanie (para przed/po) |
| K3 | „kg ✓” — „ustawione”, choć to założenie aplikacji | P1 | naprawione: bez „✓” |
| wszystkie | Motyw A2 przy AX5 został (w aplikacji znika od skali 1,4) | P2 | naprawione w makiecie (`clamp` od `--dt-tytul`) |
| K2 | Pusty pasek ma wolny rząd pod numerami (miejsce na znak dnia) — może wyglądać na niezaładowany | P2 | pozostaje: to reguła „wolne = bez znaku”; łagodzi go zdanie pustego stanu |
| wszystkie | AX5: kroki zostają w dwóch kolumnach (numer + tekst), tekst w wąskiej kolumnie przy 320 pt | P2 | pozostaje — tak samo jak dziś w aplikacji; do zrobienia przy wdrożeniu (stos pionowy) |
| K1 | „0 / brak / 0” na tablicy brzmi jak wyliczenie braków | P2 | pozostaje — pytanie do właściciela |

Pytania listy 10: (1) pierwsza sekunda — K1 tablica z dzisiejszą datą, K2 tydzień z „dziś”, K3 przycisk startu; (2) element czytelny przy 320 pt we wszystkich; (5) ciemny wg tokenów `dark`, nie odwrócony; (6) AX5 — nic nie ucięte, pasek K2 i liczby z limitem DEC-10; (7) bez nazwy i ikony: K1 — granatowa tablica z wersalikami Barlow, K2 — pasek z ramką dziś, K3 — rubryki z wartościami Barlow (najsłabszy); (9) mrużenie: obrazy `../kierunki/start-1-1-*-mruzenie-390.png` zapisane, ocena okiem — do zrobienia na STOP (nie obejrzane w pełnej rozdzielczości); (10) cudzysłowy drukarskie, pauzy, cyfry tabelaryczne.
