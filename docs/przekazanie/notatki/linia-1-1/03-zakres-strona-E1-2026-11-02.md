# 03-zakres (build, moduł zmiany-zakresu) — strona techniqueatlas, raport E1 (02.11.2026)

Rola `03-zakres --tryb build --moduly zmiany-zakresu` (prompts d32b4b8). Wejście: raport E0 (`03-zakres-strona-E0-2026-11-02.md`), decyzje bramki E0 (docs/18, ostatni wpis 02.11.2026). Stan: trening @ 2a63c77, techniqueatlas @ 5911dca.
Metoda: wymiary pokrycia i soczewki przeszedł niezależny agent (tylko repo), wzorzec serwisów inny agent (tylko sieć), żaden nie widział wyniku drugiego. Kluczowe tezy sprawdzone u źródła przez koordynatora (oznaczone ✔).

## 1. Główna praca i pętla

- **Praca główna (robocza, J-W1 — do zapisania przez rolę 01, ER-13):** „Kiedy szukam w sieci, jak zrobić ćwiczenie albo czym je zastąpić sprzętem, który mam, chcę od razu dostać technikę i gotowy do użycia wynik (zamiennik, plan na kartce albo w linku), bez konta i bez instalowania czegokolwiek, żeby zrobić trening dziś.”
- **Praca druga (J-W2, persona trenera):** „Kiedy układam trening podopiecznemu, chcę wydrukować czytelny plan z techniką i adresem strony, żeby podopieczny ćwiczył sam.”
- **Pętla główna:** wyszukiwarka → strona ćwiczenia (F-S01) → narzędzie przy ćwiczeniu: co zamiast / co zrobię z tym sprzętem (F-S02, F-S03) → dodaj do planu (F-S04) → wynik: druk/PDF, CSV, link (F-S04, F-S05, F-S17) → aplikacja jako jedna z opcji po wyniku (F-S11).
- **Poza pętlą (osobne wejścia z wyszukiwarki, nie kroki pętli):** kalkulatory (F-S07), bilans (F-S08), gotowy plan (F-S09), słownik (F-S10), sylwetka (F-S06 — w pętli tylko jako alternatywne wejście do listy). Ocena kombajnu: E2.
- **Brak w pętli dziś (✔ `techniqueatlas:src/pages.mjs:182-191`):** strona ćwiczenia nie ma żadnego wejścia do narzędzi — pętla nie istnieje, dopóki karta nie dostanie przycisków „co zamiast” i „dodaj do planu”.

## 2. Wymiary pokrycia

| # | Wymiar | Wynik | Dowód |
|---|---|---|---|
| 1 | Praca od początku do końca | wejście jest (strony ćwiczeń); praca nie (brak wejścia do narzędzi, brak CSS druku); powrót łamie zmiana języka (gubi część po #) i niezamrożone slugi; po roku stary link planu bez wersji formatu nie odtworzy usuniętego/przemianowanego ćwiczenia | `src/pages.mjs:28`, `:182-191`; `assets/site.css` (0 trafień „print”); `slugs.lock.json` 0 wpisów |
| 2 | Pominięcia | druk (F-S17), wersjonowany format # z przekierowaniami slugów (F-S18), kg/lb w kalkulatorach (F-S19), puste stany narzędzi i działanie bez JS, droga dla osoby bez iPhone'a (plakietka App Store bez sensu na Androidzie), dostępność narzędzi | `tests/dostepnosc.test.mjs:30`; `docs/brd/odkrywanie.md:18` (P-1 tylko z iPhone'em) |
| 3 | Nadmiar | słownik (F-S10) to osobny tor treści, nie krok pętli; sylwetka (F-S06) w większości dubluje filtr partii (12 regionów vs 11 partii); talerze wymagają 2–3 ustawień, których strona nie zapamięta (bez localStorage) | `src/pages.mjs:84`, `src/taksonomia.mjs:3`, docs/54:32 |
| 4 | Podłogi | teksty strony poza rejestrem twierdzeń; T-050 [OTWARTE]; repo strony bez pliku licencji, stopka „All rights reserved” ✔ (`src/ui/en.json:25`) — sprzeczne z drukiem dla trenerów; eksport bez listy funkcji wydania (pkt 9); `appStoreId` puste; wydruk bez zdania „nie porada medyczna” | `scripts/claims.mjs:22`; `rejestr-twierdzen.json` T-050; `techniqueatlas:config.json` |
| 5 | Intuicyjność (przesiew) | jedno zdanie, bez nowych pojęć: F-S01, F-S02, F-S03; wymaga zdania wyjaśnienia: plan w linku („zapisz ten adres — plan jest w nim”); nowe pojęcia/ustawienia: e1RM (granica ok. 10 powtórzeń, jednostka), talerze (gryf, zaciski, posiadane talerze), bilans (serie na tydzień), gotowy plan (presety miejsc) | [OCENA] przesiew roli 03 (jedno zdanie, nowe pojęcie, ustawienie) |
| 6 | Wartość | F-S02…F-S10 tylko H (ZAL-S1); wzorzec serwisów (§4) daje poziom R dla: zamienników z filtrem sprzętu, kalkulatora talerzy, 1RM z tabelą, sylwetki → lista, objętości na partię; brak R dla druku/CSV (żaden serwis tego nie ma — wyróżnik, ale bez dowodu popytu); sygnał użycia bez skryptu wymaga, by narzędzie miało własny adres (narzędzia webmastera liczą adresy) | docs/18 (02.11, analityka A); docs/54:207 |
| 7 | Koszt i ryzyko (właściciel nie przegląda) | dziś 30 kluczy UI × 35 języków = 1050 tekstów; [OCENA: liczba pól interfejsu × 35] narzędzia +60–120 kluczy = 2100–4200 tekstów, każdy sprawdzany tylko przez agentów; ok. 10 strażników buildu: S5/S8 rozszerzone, tekst dziedzinowy w `src/ui`, „wkrótce”, pełna karta, zdania tylko z listy funkcji wydania, zgodność starych linków, druk/CSV, słowo „darmowy”, wektory RD-01 | `techniqueatlas:src/ui/en.json`; `tests/build.test.mjs:194-195` |
| 8 | Zależności i blokery | PIN → zamrożenie slugów → format linku (F-S18) → F-S04/F-S05; S4 wymaga tagu 1.1; rozszerzony eksport (lista funkcji wydania, `FREE_TRAINING_DAYS_PER_MONTH`, pole „pełna”) przed F-S02, F-S03, F-S11, F-S12; F-S09 dopiero po wydzieleniu czystego generatora (linia 1.2) i T-050; licencja przed pierwszym wydrukiem | `techniqueatlas:src/straznicy.mjs:34-35`; `lib/generator.ts:195-200` ✔ |
| 9 | Podział | [OCENA] jedna witryna; narzędzia jako podstrony z własnymi adresami (segmenty adresów ustalić przed indeksowaniem); inna praca w innym repo: F-S09 (aplikacja), F-S10 (badacz), F-S13 (teksty prawne), F-S15 (aplikacja 1.2) | docs/54:508 |

## 3. Soczewki

- **Nowy odwiedzający, pierwsze minuty:** ze strony ćwiczenia nie ma drogi do narzędzi; bez JS narzędzia milczą; nikt nie mówi, że plan zniknie z zamknięciem karty, jeśli nie zapisze adresu; na Androidzie plakietka App Store jest bezużyteczna — opcje wyniku muszą mieć sens bez aplikacji.
- **Zaawansowany po roku:** stary link działa tylko z wersjonowanym formatem # i przekierowaniami slugów; potrzebuje lb i własnego gryfa; e1RM powyżej ok. 10 powtórzeń wymaga komunikatu; CSV to droga w jedną stronę (nie wraca do edycji); link gotowego planu musi kodować wynik, nie odpowiedzi — inaczej po zmianie reguł pokaże inny plan.
- **Trener:** granica ZP-08 (patrz §6, ZAL-S4); licencja na druk nie istnieje, stopka jej przeczy; imię podopiecznego w planie trafiłoby do linku, który się udostępnia (prywatność: bez pola imienia albo pole tylko na wydruku); wydruk bez stopki z adresem.
- **Właściciel jako jedyny opiekun (bez przeglądu):** każde wydanie aplikacji przebudowuje stronę; kilka tysięcy tekstów sprawdzają tylko agenci; nowe twierdzenia strony nie mają strażnika; punkt kontrolny 8 tygodni (ZAL-S1, ZAL-S2) zadziała tylko, gdy narzędzia mają własne adresy.

## 4. Wzorzec najlepszych w klasie (odczyt 02.11.2026)

Cudze treści (nazwy, cytaty, adresy): Dysk, „Trening App / 05 Research konkurencji / 2026-11-02 Strona techniqueatlas — wzorzec serwisów WWW (E1 roli 03-zakres)”. Tu tylko wnioski.

- **Kryterium wyboru:** obecność domeny w wynikach wyszukiwania dla 15 angielskich zapytań typowych dla pętli (zamienniki, sprzęt, 1RM, talerze, sylwetka, plan do druku), tylko serwisy mające jednocześnie bibliotekę i narzędzia; wybrane trzy najczęstsze (5, 4 i 3 zapytania). Zastrzeżenie: wyszukiwarka narzędzia agenta, nie ranking — liczona obecność, nie pozycja.
- **Serwis A (portal z reklamami, konto opcjonalne):** osobna strona zamienników każdego ćwiczenia, filtr sprzętu z presetami („w domu”, „hantle + ławka”), 10 zamienników z uzasadnieniem dopasowania, progresje odróżnione od zamienników; kalkulator talerzy z kg/lb, własnym gryfem i posiadanymi talerzami. Za kontem: zapamiętanie sprzętu, zapis listy. Brak druku, PDF, CSV, planu w linku; jeden język. Sygnał kombajnu: ponad 200 kalkulatorów.
- **Serwis B (lejek do aplikacji):** strona ćwiczenia z techniką, trzy wezwania do aplikacji na stronie; narzędzia bez konta (sylwetka → lista, talerze, 1RM, objętość tygodniowa z jawnym wzorem i ograniczeniami) obok narzędzi spoza tematu (kroki, woda, typ sylwetki). Generator planu na stronie nie daje planu — odsyła do pobrania aplikacji. Zamienniki z innego wzorca ruchu (słaby wzorzec).
- **Serwis C (darmowe arkusze programów):** statyczne listy zamienników, wyszukiwarka programów ze stanem w adresie („zapisz albo skopiuj adres, udostępnij”), kalkulatory talerzy, 1RM, rozgrzewki z talerzami. Eksport = kopia arkusza; bez aplikacji.
- **Wnioski:** standard (brak = pominięcie): zamienniki z filtrem sprzętu na własnym adresie, uzasadnienie dopasowania, talerze z kg/lb, 1RM z tabelą, sylwetka → lista, wszystko bez konta. Druk/PDF/CSV planu nie ma nikt — wyróżnik dla trenera bez wzorca. Stan w adresie jest znanym wzorcem. Aplikacja jako opcja po wyniku, nie zamiast wyniku (B pokazuje słabość lejka dla osoby bez aplikacji). Skargi użytkowników na te serwisy: nie znalezione [DO USTALENIA].

## 5. Pominięcia → ER dla roli 01 i nowi kandydaci

- **ER-13** (docs/brd/errata.md): brak person „odwiedzający strony bez aplikacji” i „trener drukujący plany”, prac J-W1/J-W2 i BR dla F-S02…F-S09, F-S17…F-S19 — BRD zna tylko P-1 z iPhone'em (`docs/brd/odkrywanie.md:18`).
- **ER-14:** reguła indeksowania strony („pełna karta” i/lub „własne wskazówki”) poza BR-BIB-006 (`docs/brd/wymagania.md:551`); rozstrzygnięcie w §7 pkt 1.
- **Nowi kandydaci (ID dalej od E0):** F-S17 druk planu (stopka z adresem, zdanie „nie porada medyczna”, ostrzeżenia generatora); F-S18 wersjonowany format planu w # z dekoderem i przekierowaniami slugów; F-S19 kg/lb w kalkulatorach; F-S20 eksport rozszerzony (lista funkcji wydania, liczba dni bez opłat z `PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`, pole „pełna” z `elementyKarty`, presety miejsc); F-S21 licencja strony i nowa stopka w 35 językach; F-S22 strażnik tekstu dziedzinowego w `techniqueatlas:src/ui` + S5/S8 dla narzędzi. Do rozważenia w E2: „otwórz plan z CSV”, zamiana całego planu (wzorzec A).

## 6. Sprzeczności z wejściem (status ZAL)

| Wejście | Status po E1 | Dowód |
|---|---|---|
| ZAL-S1 popyt narzędzi | hipoteza; częściowo wzmocniona rynkiem (R) dla zamienników, talerzy, 1RM, sylwetki, objętości; druk/CSV bez R | §4 |
| ZAL-S3 „plany liczone tym samym `generate()`” | **podważone** (w obecnym kodzie): `generate()` czyta stan aplikacji (`lib/generator.ts:1`, `:195` ✔), kod strony go nie wywołuje (grep `generate` w `techniqueatlas/src`: 0 ✔); test `tests/audit-0.10-gen.test.ts:34` sprawdza generator w aplikacji. Prawdziwe dopiero po wydzieleniu czystego modułu (linia 1.2) | — |
| ZAL-S4 druk dla trenerów a ZP-08 | **potwierdzone warunkowo**: ZP-08 wyklucza relację trener–podopieczny z aplikacji (`docs/brd/README.md:24`); licencja na druk to zgoda prawna, nie funkcja relacji. Warunek do kontraktu: strona bez listy podopiecznych, przypisywania planów, wglądu w wyniki i pola imienia w linku. Uwaga: decyzja 26.10 nazywa kreator „zaczątkiem modułu trenerskiego” (docs/54:493) — do usunięcia w E3 | — |
| „Zaostrzenie D1 do pełnej karty” (docs/18, 02.11) | **w praktyce luzuje D1**: D1 indeksuje tylko własne wskazówki (`techniqueatlas:src/pages.mjs:193-194` ✔), a pełna karta zalicza też zrecenzowany zestaw ogólny (`scripts/pokrycie-katalogu.mjs:73` ✔) — do indeksu weszłyby strony ze wspólnym tekstem rodziny (ryzyko „treści masowe”, R2 badania indeksowania) | §7 pkt 1 |
| Talerze (F-S07) bez dowodu (docs/21:256) | dowód R z wzorca (3/3 serwisy); w aplikacji nadal brak — na stronie bez odnośnika „w aplikacji” | §4 |
| Format CSV | sprzeczne: „format importu aplikacji” (docs/54:493) vs „CSV do arkusza” (docs/18, 02.11); aplikacja importuje z CSV tylko historię (`lib/csvimport.ts`) — do E2 (jeden format czytany przez arkusz i przez import 1.2) | — |
| Licencja dla trenerów | stopka „All rights reserved” ✔ i docs/54:58 przeczą decyzji — F-S21 | — |
| Odrzucone „d” (wydruk w innym języku) | wraca samo, jeśli plan w # przechodzi przez przełącznik języka — §7 pkt 2 | `src/pages.mjs:28` |
| Token kampanii „per narzędzie” | dziś per język (`src/pages.mjs:29`); format i limit długości nierozstrzygnięte (docs/54:207) — do E3 | — |
| Raport E0, „linia 325” | tekst S6 jest w docs/54:327 | — |

Niesprawdzona wykonalność: pobranie CSV i druk przez `blob:`/`data:` przy CSP `default-src 'self'` — sprawdzenie w E2 (przeglądarka bezgłowa).

## 7. Decyzje do bramki E1

1. **Reguła indeksowania:** A — „pełna karta **i** własne wskazówki” (D1 bez luzowania; mniej stron w indeksie na starcie; rekomendacja: chroni przed oceną treści masowych, a reguła sama zdejmuje `noindex`, gdy ćwiczenie dostanie własne wskazówki); B — sama „pełna karta” z zestawem ogólnym (więcej stron od startu, ryzyko R2). [wykonalność: `techniqueatlas:src/pages.mjs:193-195` (warunek `own`), `scripts/pokrycie-katalogu.mjs:73` (`pelna`)]
2. **Plan w # przy zmianie języka:** A — zachować (nie gubi danych odwiedzającego; skutkiem ubocznym wraca odrzucone „d”, nazwane jako skutek, bez osobnej funkcji; rekomendacja: utrata planu przy kliknięciu języka to utrata danych); B — gubić (zgodne z odrzuceniem „d”, ale plan znika bez ostrzeżenia). [wykonalność: niesprawdzona — przełącznik w `techniqueatlas:src/pages.mjs:28` generuje statyczne linki, zachowanie # wymaga skryptu na stronie]

## 8. Dalej

E2: cięcie (podłoga → WTP-0 → test zasady 18 → ranking), ≥ 2 warianty startu strony 1.1, kombajn (F-S06, F-S10), format CSV, wykonalność druku/CSV przy CSP. Czas agenta [OCENA]: 1–2 h; czas właściciela: decyzje na bramce.
