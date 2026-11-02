# 03-zakres (build, moduły zmiany-zakresu + ciecie) — strona techniqueatlas, raport E2 (02.11.2026)

Rola `03-zakres --tryb build --moduly zmiany-zakresu` (prompts d32b4b8; moduł `ciecie` z `role/03-zakres/moduly/ciecie.md` — w złożonym prompcie go nie było, przeczytany z pliku). Wejście: raporty E0 i E1 (obok), decyzje bramek E0 i E1 (docs/18, dwa ostatnie wpisy z 02.11.2026). Stan: trening @ 4dc2290, techniqueatlas @ 5911dca.

## 1. Wykonalność druku i CSV przy CSP strony (sprawdzone 02.11.2026)

- Reguła strony: `default-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'` (meta, `techniqueatlas:src/pages.mjs:18`).
- Próba: strona z tą samą metą, skrypt i CSS z własnego źródła (`'self'`), serwer lokalny, Playwright 1.63 + Chromium (headless). Skrypt próby: scratchpad sesji (`csp/t.js`, `csp/site/`), nie commitowany.
- Wynik (Chromium): pobranie CSV z `URL.createObjectURL(new Blob(...))` + `<a download>` — plik `plan.csv` dostarczony; pobranie przez `<a href="data:text/csv,...">` — plik dostarczony; `@media print` stosuje się (ukrycie elementu, zmiana koloru); `window.print` dostępne; `page.pdf()` tworzy PDF; **0 komunikatów o naruszeniu CSP**. Wniosek: dyrektywy CSP strony nie blokują pobierania przez `blob:`/`data:` ani druku — warunek: kod narzędzia w pliku `.js` z własnego źródła (bez skryptów w treści strony, które `default-src 'self'` blokuje).
- **Niesprawdzone:** WebKit (Safari, w tym iOS — jak traktuje `download` przy `blob:`) i Firefox — przeglądarek nie ma w kontenerze. Kontrola zastępcza: przebieg Playwright WebKit na maszynie macOS w CI przed pierwszym wydaniem narzędzia z CSV (krok do kontraktu, E3). [DO USTALENIA]

## 2. Cięcie według modułu `ciecie`

Wyjątek nazwany (bramka E0, pkt 2): właściciel niczego nie przegląda, więc koszt w godzinach właściciela ≈ 0 dla każdej funkcji i ranking RICE nic nie rozróżnia. Linię cięcia wyznaczają (zgodnie z decyzją) ryzyko i warunki merytoryczne: (1) podłoga, (2) podstawa, (3) test zasady 18, (4) zamiast wyniku RICE — kolejność według ryzyka [OCENA: nowe twierdzenia > nowe teksty × 35 języków > zależność od nieistniejącego kodu]. Do `zakres.mjs` (E3) kolumna „Koszt [h]” dostanie czas kontroli zastępczych agentów, nazwany uproszczeniem.

### 2a. Podłogi i warunki startu (stałe — wchodzą przed rankingiem razem z funkcją, której dotyczą)

| ID | Funkcja | Podłoga | Chroni |
|---|---|---|---|
| F-S13 | Polityka prywatności, licencja, regulamin, stopka | prawo; **łączy F-S21** (licencja i stopka w 35 językach — ta sama treść; F-S21 nie wraca jako osobne ID) | wszystko; licencja → F-S17 |
| F-S16 | Przepięcie PIN na commit z nazwami EN, zamrożenie slugów 709 | indeksowanie (znalezisko E0 pkt 1) | F-S01, F-S05, F-S18 |
| F-S18 | Wersjonowany format planu w # z dekoderem i przekierowaniami slugów | dane odwiedzającego (stary link po roku) | F-S05, F-S04 |
| F-S20 | Eksport rozszerzony (lista funkcji wydania, `FREE_TRAINING_DAYS_PER_MONTH` z `lib/access.ts:25`, pole „pełna”, presety miejsc) | sklep: docs/54 pkt 9 (zdania tylko o funkcjach wydanej wersji) | F-S11, F-S12, F-S02, F-S03 |
| F-S14 | Eksport słownika i tłumaczeń aplikacji na stronę | jakość tekstów w 35 językach (ponowne użycie zamiast nowych tekstów) | narzędzia |
| F-S22 | Strażnik tekstu dziedzinowego w `techniqueatlas:src/ui` + S5/S8 dla narzędzi | merytoryka (luka `scripts/claims.mjs:22`) | F-S07, F-S08, F-S10 |
| F-S11 | Komponent „w aplikacji” + token kampanii | sklep: pkt 9; decyzja 02.11 | — |
| F-S12 | Akapit o wsparciu | prawo (bez „darmowa” przy płatnej części) | — |
| nowa w F-S04 | Ochrona CSV przed formułami arkusza (pole zaczynające się od `=`, `+`, `-`, `@` dostaje prefiks) | bezpieczeństwo — dotyczy, gdy plan ma jakiekolwiek pole wpisywane przez odwiedzającego; źródło do przeczytania w E3 [DO USTALENIA] | F-S04 |

### 2b. Test zasady 18 i decyzja proponowana

Wartość: wszystkie narzędzia mają dowód H (ZAL-S1) z wyjątkiem właściciela i punktem kontrolnym 8 tygodni (bramka E0, pkt 3); poziom R z wzorca serwisów (E1 §4) wzmacnia F-S02, F-S03, F-S06, F-S07, F-S08.

| ID | Funkcja | Wartość | Intuicyjność (przesiew E1) | Warunek merytoryczny / bloker | Propozycja |
|---|---|---|---|---|---|
| F-S01 | Biblioteka (pełna karta i własne wskazówki) | decyzja właściciela | jedno zdanie | S4 (tag 1.1), F-S16 | MVP — start |
| F-S02 | Co zamiast | H + R (3/3) | jedno zdanie | eksport zamienników (F-S20) | MVP — fala 1 |
| F-S03 | Co zrobię z tym sprzętem | H + R | jedno zdanie | F-S20 (presety miejsc) | MVP — fala 1 |
| F-S04 | Układanie planu + CSV | H, bez R (wyróżnik) | jedno zdanie | F-S18, format CSV (§4) | MVP — fala 1 (wyjątek H, ZAL-S1) |
| F-S17 | Druk planu (stopka z adresem, „nie porada medyczna”) | H (persona trenera) | jedno zdanie | F-S13 (licencja), WebKit (§1) | MVP — fala 1 |
| F-S05 | Plan w linku | H; stan w adresie to znany wzorzec (serwis C) | wymaga zdania „zapisz ten adres” | F-S18; # przez zmianę języka (decyzja E1 A) | MVP — fala 1 |
| F-S07 | e1RM + talerze | H + R (3/3) | nowe pojęcia (granica ok. 10 powtórzeń, gryf, zaciski) | RD-01 z wektorami; F-S22; pytanie o lb (§5 pkt 4) | MVP — fala 2 |
| F-S08 | Bilans serii (tylko „za mało”) | H + R | nowe pojęcie (serie na tydzień) | T-034, T-055, T-005, T-006; F-S22 | MVP — fala 2 |
| F-S06 | Sylwetka | H + R częściowo | jedno zdanie, ale klikany rysunek | **kombajn** (§3); nowy rysunek + recenzja anatomii + dostępność | do decyzji (§3) |
| F-S10 | Słownik pojęć | H | — (tor treści) | **kombajn** (§3); 6–10 h badań, rejestr twierdzeń, F-S22 | do decyzji (§3) |
| F-S09 | Gotowy plan z kilku pytań | H | presety miejsc | `generate()` czyta stan aplikacji (`lib/generator.ts:1`, `:195`), T-050 [OTWARTE] | PÓŹNIEJ. Powrót: czysty `generate()` wydzielony (linia 1.2) i T-050 zamknięte |
| F-S15 | Import planu do aplikacji + strażnik „wkrótce” | decyzja 02.11 | — | wydanie 1.2 | PÓŹNIEJ (1.2); strażnik „wkrótce” razem z F-S04 |
| F-S19 | kg/lb w kalkulatorach | R (3/3) | jedno ustawienie | — | część F-S07, pytanie §5 pkt 4 |

Pętla opinii (E2 pkt 6 kontraktu): na stronie wycięta z zapisanym powodem — właściciel odrzucił „zgłoś uwagę” (o) 02.11.2026; sygnałem są tokeny kampanii i narzędzia webmastera (decyzja analityki A).

## 3. Kombajn

- **F-S06 sylwetka** — dubluje filtr partii (12 regionów rysunku vs 11 partii, `techniqueatlas:src/taksonomia.mjs:3`), dokłada drugi sposób wejścia do tej samej listy, nowy rysunek (recenzja anatomii, etykiety w 35 językach, klikany SVG jako ryzyko bariery dostępności). Opcje: **(a) PÓŹNIEJ** — powrót: w punkcie kontrolnym 8 tygodni strony list partii mają wejścia z wyszukiwarki (wtedy sylwetka jako drugi widok tego samego filtra, bez osobnego narzędzia); (b) wejście w fali 2 jako drugi widok filtra partii na stronie listy (bez osobnego adresu). Rekomendacja: (a) — wartość jest już w filtrze partii, a rysunek to najdroższy element do recenzji przy najmniejszym zysku.
- **F-S10 słownik** — inna praca (nauka pojęć, nie zrobienie treningu dziś), osobny tor treści (badacz, rejestr twierdzeń, przekład przez API), ryzyko „cienkich stron” w indeksie. Opcje: **(a) tor treści roli 06 po fali 2**, publikowany hasło po haśle, gdy hasło przejdzie rejestr twierdzeń i recenzję; bez odnośnika do aplikacji (decyzja 02.11); (b) bez osobnych stron słownika — definicja tylko przy narzędziu, które używa pojęcia (e1RM, bilans), jako tekst pod polem. Rekomendacja: (a) — zachowuje wybór właściciela, ale nie blokuje narzędzi i nie wpuszcza do indeksu haseł bez recenzji; (b) daje mniej tekstów, ale zmienia wybraną funkcję w inną.

Podział na witryny: [OCENA] jedna witryna (E1 wymiar 9) — narzędzia jako podstrony z własnymi adresami; osobnej strony dla słownika nie proponuję (wytyczne 4.2/4.3 dotyczą aplikacji, nie stron; tu decyduje koszt utrzymania i jeden PIN danych).

## 4. Format CSV (sprzeczność docs/54:493 vs docs/18 02.11)

- **A — jeden format planu czytany przez arkusz i przez import 1.2 (rekomendacja):** UTF-8 z BOM, separator `;` przy językach z przecinkiem dziesiętnym, `,` w pozostałych; pierwsza kolumna `id` ćwiczenia (stała, niezależna od języka), dalej nazwa w języku strony, dzień, kolejność, serie, powtórzenia, przerwa; nagłówki w języku strony + stała kolumna wersji formatu. Import 1.2 rozpoznaje plik po kolumnie `id` i wersji, nie po nagłówkach. Kompromis: jedna kolumna „techniczna” widoczna w arkuszu. [wykonalność: parser z separatorem `, ; tab`, BOM i cudzysłowami już jest — `lib/csvcore.ts` (`parseCsv`, `detectDelimiter`, import w `lib/csvparse.ts:19`); separator według języka w arkuszu — niesprawdzone w Excelu/Numbers, sprawdzenie w E3 plikiem próbnym]
- **B — dwa kanały:** CSV tylko do arkusza (bez kolumny `id`), import 1.2 z linku planu (format F-S18) przez `trening://`. Kompromis: czystszy arkusz, ale import zależy od niesprawdzonej obsługi linku (`app/_layout.tsx:33`, tylko komentarz) i nie działa z pliku. [wykonalność niesprawdzona]
- Odrzucone przeze mnie: format historii (formatA/B) — plan nie ma dat ani wyników serii.

## 5. Warianty startu strony od 1.1

Wspólne dla wszystkich: podłogi z §2a przed funkcją, której dotyczą; F-S09 i F-S15 PÓŹNIEJ (1.2); każde narzędzie przechodzi recenzję autor ≠ recenzent, strażniki buildu i przebieg w przeglądarce bezgłowej ze zrzutami ocenianymi przez innego agenta (bramka E0, pkt 2). Liczby tekstów — [OCENA] z E1 (narzędzia +60–120 kluczy × 35 języków), podział między fale moja ocena.

| | W0 — biblioteka najpierw, narzędzia falami (rekomendacja) | W1 — start z pętlą | W2 — start z pętlą i kalkulatorami |
|---|---|---|---|
| Na starcie 1.1 | F-S01 + F-S13, F-S16, F-S20 (część: lista funkcji), F-S11, F-S12 | W0 + F-S02, F-S03, F-S04, F-S17, F-S05, F-S18, F-S14, F-S22 | W1 + F-S07 (z F-S19 lub bez), F-S08 |
| Potem | fala 1 (pętla) gdy jej podłogi zielone, bez czekania na wydanie aplikacji; fala 2 (F-S07, F-S08); słownik jako tor treści | fala 2; słownik | słownik |
| Nowe teksty × 35 na starcie [OCENA] | ok. 10–20 kluczy (licencja, stopka, wsparcie) | ok. 50–90 kluczy | ok. 70–120 kluczy |
| Ryzyko | najmniejsze: start zależy tylko od PIN, slugów, tagu 1.1 i licencji; zegar indeksowania rusza najwcześniej | start czeka na F-S18, F-S14, F-S22 i WebKit (§1); błąd w narzędziu widać od pierwszego dnia | j.w. + nowe twierdzenia (RD-01, T-034…) na starcie; najwięcej do recenzji naraz |
| Co wypada na starcie | narzędzia (dochodzą w tygodniach po starcie) | kalkulatory, bilans | nic poza F-S06, F-S09, F-S10, F-S15 |
| Punkt kontrolny 8 tyg. (ZAL-S1, ZAL-S2) | liczony od wejścia każdej fali | od startu | od startu |

Rekomendacja: **W0** — zgodna z decyzją „narzędzia dochodzą kolejno” i z apetytem bez przeglądu właściciela: każda fala ma własną bramkę i nie trzyma startu biblioteki, której indeksowanie potrzebuje czasu. W1 wybrać, jeśli ważniejsze jest, by strona od pierwszego dnia była „narzędziem”, a nie katalogiem.

### Pytania do właściciela poza wariantem
1. Kombajn F-S06 (§3): (a) PÓŹNIEJ — rekomendacja, (b) drugi widok filtra w fali 2.
2. Kombajn F-S10 (§3): (a) tor treści po fali 2 — rekomendacja, (b) definicje tylko przy narzędziach.
3. Format CSV (§4): A — jeden format — rekomendacja, B — dwa kanały.
4. F-S19 a odrzucony 02.11 „przelicznik kg↔lb”: (a) talerze i e1RM z wyborem kg/lb (to nie przelicznik — talerze w lb mają inne rozmiary; standard 3/3 serwisów) — rekomendacja; (b) tylko kg (zgodnie z literą odrzucenia; strona mniej użyteczna dla rynku z lb).

## 6. Statusy założeń po E2

- ZAL-S1: hipoteza (bez zmian; punkt kontrolny per fala w W0).
- ZAL-S3: podważone (E1) — F-S09 PÓŹNIEJ do wydzielenia czystego `generate()`.
- ZAL-S4: potwierdzone warunkowo (E1) — warunek do kontraktu E3: brak pola imienia w linku i CSV.
- Nowe: ZAL-S5 „pobieranie CSV i druk działają przy CSP strony” — potwierdzone w Chromium (§1), WebKit i Firefox [DO USTALENIA].

## 7. Dalej (E3)

Wiersze ZM i przepisane pkt 1, 2, 8–11, linia 327 i decyzja 26.10 w `techniqueatlas:docs/54-strona-biblioteki.md`; tabela kontraktu z wynikiem `zakres.mjs` (kod 0); krok WebKit w CI; strażnik „wkrótce” jako zadanie dla programisty. Czas agenta [OCENA]: 2–3 h. Oczekiwanie: CI po wypchnięciu w obu repo. Czas właściciela: ta bramka (4 pytania + wariant, ok. 10 min).
