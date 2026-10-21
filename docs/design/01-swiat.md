# 01. Świat dziedziny (E1) — redesign M3, rola 04 build (21.10.2026)

Wejście: `docs/design/00-rozpoznanie.md`. Cel E1: inwentarz świata treningu siłowego, klisze kategorii, kandydaci na metaforę i wybór trzech do E2.
Fakty dziedzinowe mają przeczytane źródło (odczyt 21.10.2026, tekst sprawdzony dosłownie `pdftotext` + `grep`). Cudze zrzuty, ikony i nazwy aplikacji leżą poza repo (katalog przebiegu, `role/04-build/konkurencja/`).

**Źródła (szczebel 1 — przepisy organizacji sportowych):**
- [IPF] International Powerlifting Federation, *Technical Rulebook*, obowiązuje od 01.03.2026, v3 — https://www.powerlifting.sport/fileadmin/ipf/data/rules/technical-rules/english/2026_IPF_Technical_Rulebook__effective_01_March_2026__v3.pdf
- [IWF] International Weightlifting Federation, *Technical and Competition Rules & Regulations* 2019 (kopia PZPC) — https://pzpc.pl/download/file/3354. Wydanie bieżące IWF nieprzeczytane (`iwf.sport` zwraca 403) — `[DO USTALENIA]`, czy przytoczone punkty się nie zmieniły.

## 1. Inwentarz świata dziedziny

### Przedmioty i narzędzia
- Sztanga (gryf) z radełkowaniem i rowkami; gryf trójboju ma toczone znaczniki średnicy w odstępie 81 cm — [IPF] 2.2 (a) 6: „The bar shall have machined diameter markings spaced 81 cm apart.”
- Talerze (krążki) z otworem 52–53 mm, oznaczone ciężarem, zakładane od najcięższego do środka — [IPF] 2.3 (b) 2 i 7.
- Zaciski (2,5 kg każdy w trójboju — [IPF] 2.4), stojaki z regulacją co 2,5 cm — [IPF] 2.5 (2).
- Ławka, hantle, kettlebell, drążek, gumy, pas, owijki, magnezja, kreda na tablicy — przedmioty codzienne siłowni (opis praktyki, bez twierdzenia uczącego).
- Pomost zawodów: kwadrat 400 cm — [IWF] 3.3.2.2 („measures four hundred (400) cm on each side”).

### Materiały
Stal (gryf, radełkowanie), żeliwo i guma (talerze), guma podłogi, drewno pomostu, magnezja na dłoniach i gryfie, papier dziennika i protokołu, kreda na tablicy trenera. Bez twierdzeń uczących — materiał do kształtów i faktur.

### Znaki i oznaczenia
- **Światła sędziowskie:** każdy z trzech sędziów ma światło białe i czerwone; białe „good lift”, czerwone „no lift”; światła zapalają się razem, w poziomym rzędzie — [IPF] 2.8: „The white light indicates a “good lift,” and the red light indicates a “no lift.”” W [IWF] 3.3.6.8 światła decyzji świecą co najmniej 3 s.
- **Kartki przyczyny niezaliczenia:** czerwona, niebieska, żółta (przyczyna 1, 2, 3) — [IPF] 2.9.
- **Oznaczenie podejścia udanego i nieudanego na tablicy wyników:** przekreślenie albo kolor — [IWF] 3.3.6.18: „Successful and unsuccessful attempts must be marked differently (by strikethrough or by colour).”
- Ciężar na każdym talerzu czytelny dla sędziów — [IPF] 2.3 (b) 7.

### Dokumenty i formularze branżowe
- **Tablica podejść (Attempt Board):** nazwisko (nazwisko wersalikami), kod kraju, ciężar do podjęcia, numer podejścia, numer startowy, decyzja sędziów, zegar — [IWF] 3.3.6.15.
- **Tablica wyników:** trzy podejścia w każdym boju, suma, miejsce, wskazanie wywołanego i następnego zawodnika — [IWF] 3.3.6.17; wzór tablicy z kolumnami RD1–RD3 dla przysiadu, wyciskania i martwego ciągu — [IPF] 2.10.
- Karta podejść (zgłoszenie kolejnego ciężaru w ciągu 1 minuty od zapalenia świateł) — [IPF] reguła kolejności podejść (j), s. 29.
- Dziennik treningowy na papierze: kolumny ciężar × powtórzenia × serie — praktyka (szczebel 5), tylko jako wskazówka; nie wchodzi do aplikacji jako twierdzenie.

### Liternictwo
- Cyfry odlewane lub tłoczone na talerzach (duże, grube, często wersalikowe „KG”); cyfry zegarów zawodów (wyświetlacze segmentowe); nazwiska wersalikami na tablicy podejść ([IWF] 3.3.6.15); szablonowe napisy na sprzęcie. Kandydatów na krój szukam w E2 w tych źródłach (zasada studia 7), nie wśród modnych krojów.

### Dźwięki
- Sygnał „Down” widoczny i słyszalny po dwóch zgodnych decyzjach — [IWF] 3.3.6.5.
- **Sygnał ostrzegawczy zegara:** na podejście jest 60 s, sygnał po 30 s; przy dwóch podejściach z rzędu 120 s i sygnały 30 s po starcie i 30 s przed końcem — [IWF] 6.6.7: „After thirty (30) seconds, a warning signal sounds.”
- Stuk odkładanego gryfu, brzęk talerzy, klaśnięcie dłoni w magnezji — praktyka, materiał do haptyki (bez twierdzenia).

### Kolory nadane przez kody i normy
| Kod | Barwy | Źródło |
|---|---|---|
| Talerze zawodów | 25 kg czerwony, 20 niebieski, 15 żółty, 10 zielony, 5 biały; 2,5–0,5 kg te same barwy w tej kolejności | [IWF] 3.3.3.6 |
| Talerze trójboju | 25 kg czerwony, 20 niebieski, 15 żółty; 10 kg i mniej — dowolny | [IPF] 2.3 (b) 6 |
| Talerze treningowe | barwne albo czarne z barwnym obrzeżem i napisem „Training” | [IWF] 3.3.3.7 |
| Światła sędziowskie | biały = zaliczone, czerwony = niezaliczone | [IPF] 2.8; [IWF] 3.3.6.4 |
| Kartki przyczyny | czerwona 1, niebieska 2, żółta 3 | [IPF] 2.9 |

Paleta talerzy jest dziś paletą marki („Tuleja”, `lib/discColors.ts`), więc według pamięci portfolio nowy kierunek nie powtarza jej bez zapisanej decyzji. Barwy przepisów nie mają wartości hex — każdy hex w E2 będzie wyborem projektowym „w barwie kodu”, nie „hexem z przepisu”.

## 2. Skan konkurencji (wnioski neutralne)

Odczyt 21.10.2026, iTunes Search API (`country=pl`), frazy: „dziennik treningowy”, „workout log”, „gym tracker”, „strength training log”, „silownia”. Obejrzane ikony i do trzech zrzutów 15 popularnych dzienników treningowych (najwięcej ocen w kategorii Zdrowie i fitness). Lista z nazwami, adresami i obrazami — tylko w katalogu przebiegu poza gitem (zasada projektu: treści cudze i nazwy innych firm).

**Klisze kategorii:**
1. Ikona: hantel albo sztanga z boku na jednolitym tle — ok. połowa ikon.
2. Ciemne, prawie czarne tło z jednym jaskrawym akcentem: niebieski, limonkowa zieleń, czerwień, pomarańcz — większość zrzutów.
3. Sylwetka anatomiczna z mapą ciepła mięśni — ok. 9 z 15.
4. Tabela serii „# / poprzednio / kg / powt. / ✓” z zielonym odhaczeniem wiersza — w każdym dzienniku, który pokazuje ekran treningu.
5. Wykres liniowy rekordu z punktem „PR”, medale, rankingi, wieńce laurowe z liczbą użytkowników.
6. Hasła wersalikami w kursywie („log / track / progress”).

**Co z tego wynika dla Treningu:** obecny wygląd dzieli z kategorią sztangę na ikonie, niebieski akcent i tabelę serii z ✓. Żaden z obejrzanych dzienników nie używa jako elementu firmowego świateł sędziowskich, tablicy podejść ani zegara zawodów; talerze w kolorach kodu pojawiają się tylko w kalkulatorach talerzy. Akcent niebieski i limonkowy odpada jako „akcent konkurenta”; czerwień jest zajęta przez kilka aplikacji i w dziedzinie znaczy „niezaliczone”.

## 3. Kandydaci na metaforę (10)

| # | Metafora (jedno zdanie) | Dane użytkownika | Moment firmowy | Ryzyko (kicz / czytelność / koszt) |
|---|---|---|---|---|
| M1 | **Tablica podejść:** karta „teraz” jest tablicą podejścia z zawodów — ciężar do podjęcia, numer podejścia i zegar, czytelne z pomostu. | ciężar × powtórzenia następnej serii, „seria 2 z 4”, nazwa ćwiczenia, odliczanie przerwy | po „Seria zrobiona” tablica „przewraca się” na następne podejście; w przerwie wielki zegar | kicz: niski (to układ informacji, nie ozdoba); czytelność: wysoka z 1–2 m; koszt: niski. Uwaga: „tablica wyników” była kierunkiem C w 10.2026 (odrzucony na rzecz Kredy) — tamten był stylem, nie elementem z danymi |
| M2 | **Światła sędziowskie:** rząd świateł zapala się razem po każdej serii — biały znaczy „zrobione”. | serie ćwiczenia jako rząd świateł (zrobione / przed tobą), postęp treningu, na zegarku i ekranie blokady jako mały rząd | trzy (N) światła zapalają się jednocześnie z krótką wibracją po „Seria zrobiona” | kicz: średni (ryzyko „gry”); czytelność: wysoka, ale nic tylko kolorem — zapalone = pełny kształt, czekające = kontur; aplikacja nie ocenia serii, więc czerwień „no lift” nie występuje (zmiana znaczenia trzeba nazwać) |
| M3 | **Kreska kredą (zliczanie):** każda seria to kreska kredą, piąta przekreśla cztery — jak trener liczy na tablicy. | serie w treningu, treningi w tygodniu, objętość jako kreski | kreska rysuje się ręcznym pociągnięciem po odhaczeniu; tydzień jako tablica kresek | kicz: średni (faktura kredy); czytelność: zliczanie piątkami czytelne do ok. 20; koszt: średni (rysowane pociągnięcia). Nazwa „Kreda” była w 10.2026 stylem odrzuconym („PowerPoint”) — tu kreda jest zliczaniem, nie paletą |
| M4 | **Protokół zawodów (tablica wyników):** sesja to wiersz protokołu z polami RD1–RD3, udane podejścia oznaczone wg przepisu. | serie i ciężary sesji, rekordy, historia jako kolejne protokoły | pole podejścia „zapisuje się” i dostaje znak zaliczenia | kicz: niski; czytelność: dobra przy małej liczbie serii; **ryzyko generyczności wysokie** — to tabela serii, czyli klisza nr 4 kategorii |
| M5 | **Zegar zawodów:** przerwa i seria na czas jako zegar sędziowski z sygnałem 30 s przed końcem. | czas przerwy, czas serii, czas treningu | ostatnie 30 s przerwy z sygnałem (haptyka + opcjonalny dźwięk), zgodnie z logiką sygnałów [IWF] 6.6.7 | kicz: wysoki przy wyświetlaczu segmentowym; czytelność: wysoka; koszt: niski; dane wąskie (tylko czas) |
| M6 | **Gryf z radełkowaniem i znacznikami:** pasek postępu treningu jako gryf — radełkowane odcinki wypełniają się seriami, znaczniki dzielą ćwiczenia. | postęp treningu, ćwiczenia jako odcinki | odcinek radełkowania „łapie fakturę” po serii | kicz: niski; czytelność: niska w małym rozmiarze (faktura znika przy 320 pt i na zegarku); koszt: średni |
| M7 | **Talerze na gryfie (obecny element, kandydat na równi):** stos talerzy pokazuje objętość tygodnia albo serie. | tydzień jako stosy, ciężar | talerz wjeżdża na gryf | właściciel usunął pasek talerzy (DEC-06) i odrzucił pozostanie przy znacznikach dni (STOP 2); powtarza obecną tożsamość i kliszę ikony kategorii |
| M8 | **Pomost:** każda seria to „wejście na pomost” — ekran treningu to kwadrat pomostu z jednym ćwiczeniem na raz. | bieżące ćwiczenie, kolejność | wejście na pomost (ruch kadrowania) | dane słabe (głównie układ); kicz: średni (faktura drewna); koszt: średni |
| M9 | **Talerz treningowy z barwnym obrzeżem:** czarny talerz z barwną obwódką jako pierścień postępu ([IWF] 3.3.3.7). | pierścień = postęp serii lub tygodnia, barwa obrzeża = nic albo ciężar | obrzeże domyka się po serii | koło postępu to klisza aplikacji zdrowotnych; barwa talerza = ciężar, nie postęp (decyzja z 09.10.2026: kolor talerza koduje wyłącznie ciężar) |
| M10 | **Kartka zgłoszenia podejścia:** następny ciężar „zgłaszasz” jak na zawodach — karta z polem ciężaru, którą odkłada się po serii. | ciężar i powtórzenia następnej serii | karta odchodzi na stos sesji | dane jak M1, ale słabszy obraz (papier); ryzyko „karty SaaS” |

## 4. Wybór trzech do E2

| Kierunek | Kandydat | Uzasadnienie |
|---|---|---|
| A | **M1 Tablica podejść** | Wprost służy kontekstowi z E0: spojrzenie 1–3 s z 1–2 m. Niesie dokładnie dane karty „teraz” (ZM-01) i przerwy; przenosi się na zegarek i Live Activity. Najmniej ryzyka dla „prostoty ducha trackera”, a „wow” daje skala i rytm tablicy. |
| B | **M2 Światła sędziowskie** | Najmocniejszy „moment firmowy” przy najczęstszej czynności (odwaga w jednym miejscu: odhaczenie jako zdarzenie światła + haptyki). Mały rząd świateł działa w każdym rozmiarze (zegarek, ekran blokady, kalendarz). Nikt z kategorii go nie używa. |
| C | **M3 Kreska kredą** | Kierunek ludzki i ręczny, przeciwwaga dla technicznych A i B; zliczanie kreskami jest czytelne bez liczb i dobrze pokazuje tydzień (to, co było w znacznikach dni, ale z danymi serii). Sprawdza, czy „wow” może wynikać z rzemiosła, a nie ze skali. |

**Rezerwa:** M5 Zegar zawodów (gdyby A albo B odpadły — zwłaszcza jako moment przerwy z sygnałem 30 s) i M6 Gryf z radełkowaniem (gdyby właściciel chciał zostać bliżej sztangi bez talerzy).
**Odrzucone teraz:** M4 (klisza tabeli serii), M7 (decyzje DEC-06 i STOP 2, pamięć portfolio), M8 (słabe dane), M9 (klisza pierścienia, kolizja ze znaczeniem barwy talerza), M10 (dubluje M1 słabiej).

## 5. Otwarte pytania (merytoryczne — nie do właściciela)
- `[DO USTALENIA]` Bieżące wydanie przepisów IWF (2024/2025): czy 3.3.3.6, 3.3.6.15, 3.3.6.18 i 6.6.7 brzmią tak samo jak w wydaniu 2019. Strona `iwf.sport` niedostępna z tego środowiska.
- Zmiana znaczenia świateł (M2: biały = „zrobione”, nie „zaliczone przez sędziego”) to uproszczenie i analogia — jeśli kierunek B wygra, tekst w aplikacji nie może sugerować oceny techniki (rejestr twierdzeń, `npm run check:claims`).
- Sygnał 30 s przed końcem przerwy (M5/A) to analogia do zegara zawodów, nie zalecenie treningowe — przy wdrożeniu jako „konwencja”.

## 6. Test generyczności
Karty kontrolne (a) i (b) oraz porównanie pole po polu powstają na początku E2, przed kartami kierunków (procedura roli 04, E2 pkt 2).
