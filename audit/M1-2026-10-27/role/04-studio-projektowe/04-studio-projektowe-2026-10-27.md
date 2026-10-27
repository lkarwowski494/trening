# Audyt: Studio Projektowe (UX, marka, przepływy) — Trening — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 (HEAD odłączony, sprawdzony na starcie i na końcu) · Tryb: audit (wariant głęboki, M1) · Moduły: render-i-krytyka, pamiec-portfolio, kontekst-oczy-zajete (częściowo), przeplywy-i-gesty · Środowisko: Linux, Node 22, Playwright 1.63 (Chromium), Expo web działa (eksport w worktree w scratchpadzie); brak Xcode, symulatora iOS i telefonu; GitHub CLI bez zalogowania (niepotrzebne). Dowód: `dowody/srodowisko-i-git-status.txt`.

## Podsumowanie
System wyglądu z redesignu M3 jest wdrożony i spójny: tablica „teraz” jako element firmowy niesie dane (nazwa, seria n z m, ciężar × powtórzenia, pola serii, zegar przerwy), główna praca (zapis serii) kosztuje 1 stuknięcie, palety jasna, ciemna i obie „Zwiększ kontrast” spełniają progi kontrastu (252 z 254 par; 2 braki to obramowanie nie niosące stanu), strażniki wzorców docs/32 są zielone (327/327). Najważniejsze ryzyko dla 1.0 leży w dwóch obserwacjach właściciela z telefonu: ekran „Pełna wersja” po zakupie nie ma stanu „masz ten plan” i dalej sprzedaje posiadany plan (T-11, 04-studio-projektowe-001), oraz ucięte ikony ekranu Trening przy największym tekście (T-04, 04-studio-projektowe-002) — tego drugiego nie odtworzyłem w emulacji Dynamic Type na web, więc przyczyna wymaga zrzutu z telefonu. Trzecie P1 to mechanizm: decyzje właściciela o wyglądzie z 23.10 (kolejność planów, „Planowanie” w linii tytułu, podgląd liczb w 1.0.1) zostały zapisane w docs/18 bez testu-strażnika i bez śladu wdrożenia, a istniejące testy pilnują stanu sprzed decyzji (04-studio-projektowe-003). Decyzje do podjęcia: kształt stanu po zakupie (D1), mechanizm „decyzja → test” (D2), sprawdzanie dużego tekstu na symulatorze (D3).

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 04-studio-projektowe-001 | P1 | D | Ekran „Pełna wersja” po zakupie nie mówi, jaki plan masz, i dalej sprzedaje ten sam plan | otwarte |
| 04-studio-projektowe-002 | P1 | D | Ikony ekranu Trening ucięte przy największym tekście (T-04) — przyczyna nieustalona, brak sprawdzenia dużego tekstu na iOS | otwarte |
| 04-studio-projektowe-003 | P1 | P | Decyzje właściciela o interfejsie zapisane bez testu-strażnika i bez weryfikacji wdrożenia; testy pilnują stanu sprzed decyzji | otwarte |
| 04-studio-projektowe-004 | P1 | D | W wąskim układzie tabeli serii przycisk stopera i pole RPE mają 40 pt szerokości (poniżej przyjętych 44 pt) | otwarte |
| 04-studio-projektowe-005 | P2 | D | „Planowanie” na ekranie Trening stoi nad tytułem, a nie w linii tytułu (DEC-07 K3 niewdrożone) | otwarte |
| 04-studio-projektowe-006 | P2 | D | Wiersz „Pełna wersja” w Ustawieniach wygląda jak stan, nie jak przejście do zakupu (T-11) | otwarte |
| 04-studio-projektowe-007 | P2 | D | „Pierwsze kroki”: przycisk „Planowanie” przy kroku „utwórz szablon”, krok 3 wskazuje nieistniejący „Start” | otwarte |
| 04-studio-projektowe-008 | P2 | D | Migracja na tokeny niedokończona (67 literałów fontSize, 18 borderRadius, stare `F.heavy`) i bez wersji w backlogu | otwarte |
| 04-studio-projektowe-009 | P2 | D | Kolejność ćwiczeń zmienia się tylko przeciąganiem (bez przycisku dla osób bez VoiceOver) | otwarte |
| 04-studio-projektowe-010 | P2 | D | Pasek tygodnia przy 320 pt i dużym tekście: skróty dni zlewają się („SOB.NIEDZ.”) | otwarte |
| 04-studio-projektowe-011 | P2 | D | Przegląd ciągów „A · B · C” z docs/32 wzorzec 28 nadal otwarty, ciągi o zmiennej treści zostały | otwarte |

Liczby: P0 — 0, P1 — 4, P2 — 7.

## Linia bazowa i założenia

**Stan projektu (z polecenia M1; proponowany tekst sekcji do CLAUDE.md, bo plik jej nie ma):** „Etap: TestFlight 1.0 (build 1031), przed zgłoszeniem do App Store; użytkownicy: tylko testerzy (dane na ich telefonach). Sklep: konfiguracja pełna (miesięczny, roczny, dożywotni; PL 4,99 / 19,99 / 59,99 zł; Family Sharing; bez okresu próbnego). Rynek główny Polska, potem 35 języków. Repo treści prywatnych: brak. Standard marki: wysoki. Próg opłacalności 500 USD netto/rok (D-024; model M5 S1 ok. 471 USD przy 15%, wybrany świadomie 22.10.2026). Polityka języków: szeroka (D-026). Przegląd treści krytycznych: niezależna recenzja agentowa (bramka 4). Cel: iOS-owy dziennik treningu siłowego, offline, bez konta, uczciwy freemium.”

**Bramka opłacalności (zasada 20):** wynik w `docs/monetyzacja.md`, „Bramka W0” z dopiskiem DEC-07 K8 (23.10.2026), użyta ponownie (MON-18) — nie liczę jej; model optymalny = obecny M5 S1.

**E0b — kontekst użycia ustalony od nowa (przed lekturą design-spec):** siłownia albo dom; telefon na ławce, w kieszeni albo w dłoni między seriami; spojrzenie 2–5 s; ręce zajęte przy sztandze, czasem spocone; światło hali (jasne, odblaski) albo półmrok; hałas (muzyka) — dźwięk nie może być jedynym sygnałem; sesja 45–90 min, kilkadziesiąt zapisów. Główny przepływ nie dzieje się „bez patrzenia”, więc moduł oczy-zajęte stosuję częściowo (zasada 6: jedna duża akcja w zasięgu kciuka, ekran nie gaśnie, poprzedni i następny krok widoczne). Wynik: spełnione — „Seria zrobiona” 60 pt pełnej szerokości, zegar przerwy na tablicy, „Następna: …”, przełącznik „Nie wygaszaj ekranu” (`wakeLock`), haptyka i dźwięk osobno, Live Activity i zegarek.

**Klisze kategorii (soczewka krytyka):** ciemne tło z jednym jaskrawym akcentem, karty SaaS z liczbą i etykietą, wersaliki nad nagłówkami, sztanga jako ozdoba. Trening: granat tablicy podejść + krem cyfr + bursztyn „teraz” wywodzą się z dziedziny (tablica podejść) i mają zapisane decyzje (STOP E2/E3, 21.10.2026); wersaliki tylko w nagłówkach grup i na tablicy (DEC-17, W3); sztanga po tytule to ozdoba, ale z decyzją właściciela (22.10.2026). Rozpoznawalność bez nazwy i ikony: tablica „teraz” (granat, Barlow Condensed wersalikami, cyfry 96 pt, pola serii) — tak, element, nie tylko kolor. Kafelki „Ten tydzień” (liczba + mała etykieta, 2 × 2) to wzorzec z kalibracji („duża liczba + mała etykieta”) bez osobnej decyzji — mieszczą się w decyzji z 08.10.2026 (dashboard tygodnia, wariant A), więc nie zgłaszam.

**Wymiary pokrycia:**
| Wymiar | Wynik |
|---|---|
| Konteksty użycia przepływów | opisane wyżej i w `przeplywy-as-is.md`; zgodne z kontekstem; luka 004 (cele 40 pt w wąskim układzie) |
| Stany kluczowych ekranów | pierwsze uruchomienie, pusty (Postępy), typowy, przerwa, trening w toku, zakup: darmowy / limit / po zakupie / dożywotni / brak sieci / pusta lista (kod); luka 001 (po zakupie) i 007 (pierwsze uruchomienie) |
| Element firmowy | tablica „teraz” i „Dziś”: dane prawdziwe, VoiceOver jeden element z opisem liczb (`components/NowBoard.tsx:72`), działa w serii, przerwie, serii na czas, > 12 polach (kod) |
| Podłogi dostępności | kontrast: kod 1, 2 pary obramowania (`dowody/sp04-kontrast.txt`); nic tylko kolorem: zrzuty w skali szarości OK (`zrzuty/ark-390-dark-szary.png`); tekst do AX5: emulacja web, luki 002 i 010; cele: 004; gesty: 009; „Ogranicz ruch”: OK |
| Ruch, haptyka, dźwięk | intro i figura respektują „Ogranicz ruch” (`components/Intro.tsx:39`), przewrót tablicy przechodzi w przenikanie (`components/BoardFace.tsx:28`); dźwięk i wibracje osobnymi przełącznikami; lekkie stuknięcie przy ✓ niewdrożone — otwarte u właściciela (docs/32 wz. 29), nie zgłaszam |
| Obecność poza ekranami | ikona 1024 RGB bez przezroczystości + warianty ciemny i tinted; ekran startowy tło `bg` (jasny/ciemny); zegarek 1024; Live Activity — nie sprawdzono (tylko telefon; właściciel potwierdził PL/EN/DE); zrzuty sklepu — rola 11 |
| Głos i teksty | pusty stan zaprasza („Wykresy pojawią się… / Zacznij trening”), błędy z nazwą akcji (strażnik S8 zielony), potwierdzenia z obiektem; teksty nagłówka zakupu po zakupie mylące (001) |
| Motyw ciemny i „Zwiększ kontrast” | pełne palety (`lib/tokens.ts`), nie odwrócone; w ciemnym przycisk główny jasny (decyzja STOP E3) |
| Lokalizacja | najdłuższy język el i 320 pt — wzorce w `docs/design/wzorce-zrzuty/`; w tym audycie tylko PL/EN; formaty dat słownie (S12 zielony) |

**Soczewki (bez subagentów, po kolei):** (1) ręce zajęte — P3 1 stuknięcie, cele 44–60 pt poza wąskim układem (004); (2) VoiceOver / największy tekst — VoiceOver: role i etykiety pilnowane strażnikami S13–S14 i matrycą a11y; największy tekst: 002, 010, opisy bez limitu 200% w części tekstów (wiersze `Item`, tytuły bloków) — rosną bardziej niż DEC-10, ale się zawijają, nie zgłaszam; (3) krytyk klisz — wyżej; (4) nowa osoba w pierwszych minutach — 007.

**Wzorzec najlepszych w klasie:** według biblioteki (cytaty HIG i opisy ADA z `docs/audyt-2026-10-18/research-ux-nagradzane.md` w repo prompts, odczyt 20.10.2026; w tej sesji nie otwierane ponownie — Dysk i repo prompts niedostępne): jeden element firmowy niosący dane (Flighty — tablica odlotów; tu tablica podejść), stan bieżący na jedno spojrzenie (Crouton — tylko bieżący krok; tu tablica „teraz” i „Następna: …”). Skanu konkurencji w sklepie PL nie zrobiłem (materiały na Dysku, niedostępny) — „nie sprawdzono”.

**Rejestr założeń:** `docs/zalozenia.md` nie istnieje — brak propozycji zmian statusu.

## Pokrycie (co sprawdzono, czego nie)
| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| Ekran Trening (pierwsze uruchomienie, z planem, bez planu, trening w toku, przerwa) | tak (web, 320/390, jasny/ciemny, szary, emulacja AX5) | `dowody/web-zrzuty.txt`, `zrzuty/ark-t04-light.png`, `zrzuty/ark-t04-320.png`, `zrzuty/ark-t04-aktywny-390-dark-ax5.png`, `zrzuty/as-is/` |
| Plan, Postępy (z danymi i pusty), Więcej, Ustawienia, Sesja, Ćwiczenie, Szablon, Generator | tak (web, zrzuty) | `zrzuty/ark-390-dark.png`, `zrzuty/ark-390-light.png`, `zrzuty/ark-320-dark.png` |
| Ekran zakupu: darmowy, po zakupie rocznym, dożywotni; karta w Ustawieniach | tak (web, sztuczny sklep z buildu E2E) + kod | `zrzuty/ark-paywall.png`, kod `app/paywall.tsx` |
| Kontrast tokenów (4 palety, 254 pary) | tak | `dowody/sp04-kontrast.txt` |
| Strażniki wzorców docs/32 i tokenów | tak (6 plików, 327 testów) | `dowody/strazniki-jest.txt` |
| Literały stylów, skalowanie tekstu, emoji | tak (grep) | `dowody/sp03-literaly.txt`, `dowody/sp07-skalowanie.txt`, `dowody/sp11-emoji.txt` |
| Decyzje właściciela docs/18 (obie części) → kod → test | tak (tabela niżej) | `dowody/decyzje-kod.txt` |
| Gesty | tak (kod) | `gesty.md` |
| Okna systemowe (Alert, ActionSheet), zakup w arkuszu Apple, Live Activity, zegarek, VoiceOver na urządzeniu, Dynamic Type na iOS, „Pogrubiony tekst” | **nie** — web ich nie odtwarza, brak symulatora | kroki właściciela w „Do sprawdzenia” |
| Ekrany rzadkie (miejsca, gumy, import, kopia, licencje, przewodnik, adapt, swap, picker) | częściowo (strażniki S1–S18, bez zrzutów) | `dowody/strazniki-jest.txt` |
| Skan konkurencji i pamięć portfolio z repo prompts | nie (Dysk i repo prompts niedostępne) | — |

## Kontrola dowodów i sekretów
Wynik `node audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 04-studio-projektowe`: zapis w `dowody/sprawdz-raport.txt` (OK, kod 0 — wklejony niżej po ostatnim przebiegu).

```
$ node audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md /home/user/trening audit/M1-2026-10-27/role/04-studio-projektowe --rola 04-studio-projektowe
OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 04-studio-projektowe
exit=0
```

`git status --porcelain` na końcu audytu: pusty wynik, kod 0 (pliki śledzone nietknięte) — `dowody/srodowisko-i-git-status.txt`. W raporcie i dowodach brak e-maili, UDID, sekretów i nazw innych aplikacji.

## Stosowalność listy kontrolnej
| Pozycja | Status (dotyczy / nie dotyczy + powód / decyzja D-xx) | Wynik (ok / znalezisko ID / nie sprawdzono + powód) |
|---|---|---|
| SP-01 przepływ → ekran | dotyczy (kontrakt zakresu: DEC-02 „bez kontraktu zakresu”, więc BRD i katalog przepływów docs/37) | ok — każdy ekran z `app/` ma wejście (design-spec §10, 36 tras); brak elementów osieroconych w sprawdzonych ekranach |
| SP-02 element firmowy | dotyczy | ok — tablica „teraz” i „Dziś” z prawdziwymi danymi; ozdoby (sztanga po tytule, motyw A2) z decyzjami właściciela |
| SP-03 tokeny | dotyczy | 04-studio-projektowe-008 |
| SP-04 kontrast | dotyczy | ok (252/254; 2 braki: obramowanie niewybranego planu — stan niesie ramka 2 pt w akcencie, zob. „Do sprawdzenia”) |
| SP-05 nie tylko kolor | dotyczy | ok — skala szarości: strażnik (znak + wzór), kalendarz (pełny / kontur), serie (✓ + wypełnienie), pola tablicy (ramka); legenda mięśni figury ma też tekst |
| SP-06 cele 44 pt | dotyczy (projekt przyjął 44 pt — `SIZE.hit`) | 04-studio-projektowe-004 |
| SP-07 skalowanie tekstu | dotyczy | 04-studio-projektowe-002, 04-studio-projektowe-010; brak `allowFontScaling={false}`; podgląd liczb po przytrzymaniu — decyzja na 1.0.1 (DEC-01 a, 23.10), nie zgłaszam |
| SP-08 ruch, haptyka, dźwięk | dotyczy | ok |
| SP-09 słownik i etykiety | dotyczy | 04-studio-projektowe-006 |
| SP-10 stany ekranów | dotyczy | 04-studio-projektowe-001 |
| SP-11 teksty, emoji | dotyczy | ok — emoji tylko w komentarzach (DEC-11 wdrożone); symbole ✓ ✕ ★ ✦ typograficzne |
| SP-12 wybory domyślne bez decyzji | dotyczy | 04-studio-projektowe-011 |
| SP-13 zgodność z docs/design | dotyczy (linia bazowa jest: `docs/design/wzorce-zrzuty/`, 140 zrzutów) | ok z różnicami nazwanymi decyzjami (sztanga po tytule 22.10, pełne tabele serii 04-002, motyw A2 tylko w pustych stanach) — `zrzuty/ark-sp13.png`; mechanizm decyzji: 04-studio-projektowe-003 |
| SP-14 kroje | dotyczy | ok — Barlow Condensed 600/700 + systemowy, OFL w `assets/fonts/OFL-BarlowCondensed.txt`, licencja na liście licencji |
| SP-15 elementy platformy, alternatywy gestów | dotyczy | 04-studio-projektowe-005, 04-studio-projektowe-009 |
| SP-16 ikona, ekran startowy, intro | dotyczy | ok — tło startu = `bg` jasny/ciemny (app.json), intro ok. 1 s, stuknięcie pomija, przy „Ogranicz ruch” bez animacji |
| SP-17 kontekst (ręce zajęte) | dotyczy (P1, nie jazda) | ok dla głównej akcji; cele w wąskim układzie → 004 |
| SP-18 VoiceOver, pogrubiony tekst | dotyczy | ok w kodzie (role, etykiety, opis tablicy, `isBoldTextEnabled` w `lib/a11yPrefs.ts:32`); na urządzeniu nie sprawdzono (właściciel: pogrubiony tekst OK) |
| SP-19 koszt przepływów | dotyczy (moduł przeplywy-i-gesty) | 04-studio-projektowe-007; P7 porażka → 001 i 006 |
| SP-20 gesty | dotyczy | ok (`gesty.md`) |
| SP-21 ikona aplikacji | dotyczy | ok — `assets/icon.png` 1024 RGB, warianty ciemny i tinted w `app.json`; Android nie wydawany (DEC-26) |

**Czego nie da się sprawdzić tutaj:** Dynamic Type i „Pogrubiony tekst” na iOS, VoiceOver, okna systemowe, arkusz zakupu i ceny ze StoreKit, Live Activity, zegarek, haptyka i dźwięk — tylko symulator albo telefon (kroki w „Do sprawdzenia”).

### Decyzje właściciela w obszarze roli → kod → test-strażnik (docs/18-przekazanie.md i docs/18-archiwum-do-11.10.md)
| Decyzja (data, miejsce) | Kod | Test-strażnik | Wynik |
|---|---|---|---|
| 07.10 usuwanie: przesunięcie + potwierdzenie wszędzie (archiwum) → 19.10 DEC-12 menu → 21.10 ZM-04/W2 „Usuń {obiekt}” | `components/SwipeRow.tsx`, `components/DeleteButton.tsx` | `tests/swipe-delete.test.tsx` | zgodne (zielony) |
| 09.10 intro ok. 1 s, stuknięcie pomija, „Ogranicz ruch” bez animacji (archiwum) | `components/Intro.tsx:39` | `tests/intro.test.tsx` | zgodne |
| 09.10 filiżanka dnia odpoczynku → 22.10 znaczniki dni A2 (docs/18) | `components/Motif.tsx:29` | `tests/motyw.test.tsx` | zgodne (zrzut `zrzuty/ark-390-dark.png`) |
| 11.10 4 zakładki (docs/18) | `app/(tabs)/_layout.tsx` | `tests/tabs-four.test.tsx` | zgodne |
| 11.10 P4 „Pierwsze kroki” 3 kroki, każdy z jednym przyciskiem | `components/Dashboard.tsx:98` | `tests/m3-p2-start.test.tsx` (częściowo) | zgodne z literą; etykiety mylą → 007 |
| 13.10 docs/32 decyzje 1–5 (Anuluj po lewej, Anuluj w potwierdzeniach, „+”, szkic, „Wróć”) | `components/CloseButton.tsx`, `lib/confirm.ts`, `components/AddButton.tsx` | S1–S5 (`tests/close-button-guard.test.tsx`, `tests/interaction-guards.test.ts`) | zgodne (zielone) |
| 14.10 nazwa „Strażnik progresji” widoczna | `components/GuardSection.tsx` | `tests/guard-ui.test.tsx` | zgodne |
| 19.10 / DEC-06 pasek talerzy i kalkulator usunięte | brak `PlateBar` w app/ components/ lib/ | `dowody/decyzje-kod.txt` (0 plików) | zgodne |
| 20.10 DEC-05 głos domyślnie wyłączony (nowa instalacja) | `lib/seed.ts:323` | `tests/` (M1-027, test ustawień domyślnych) | zgodne |
| 20.10 DEC-09 Postępy: wykres i rekordy na górze | `app/(tabs)/progress.tsx:80` | `tests/m3-p3*.test.tsx` | zgodne (zrzut) |
| 20.10 DEC-10 opisy do 200%, liczby do 130%; 23.10 DEC-01 a: kalendarz 130% przed 1.0, podgląd po przytrzymaniu 1.0.1 | `lib/theme.ts:71`, `components/HistoryCalendar.tsx` | `tests/matrix-a11y.test.tsx` | limity zgodne; podgląd 1.0.1 **nie ma w backlogu docs/21** → 003 |
| 20.10 DEC-11 własne ikony zamiast emoji | `components/Icon.tsx` | `dowody/sp11-emoji.txt` (emoji tylko w komentarzach) | zgodne |
| 20.10 DEC-17 wersaliki i „·” | `components/ui.tsx` `upperText()` | `tests/audit-m1-063-caps-separators.test.ts` | wersaliki zgodne; przegląd „·” otwarty → 011 |
| 20.10 DEC-18 ekran Język „Zmień w ustawieniach iOS” | `app/more/language.tsx:21` | testy ekranu języka | zgodne |
| 21.10 M3 system E3 (palety, Barlow, HC, tło startu = bg) | `lib/tokens.ts`, `lib/theme.ts`, `app.json` | `tests/m3-contrast.test.ts`, `tests/audit-m1-031-contrast.test.tsx` | zgodne; migracja literałów niedokończona → 008 |
| 21.10 ZM-01/ZM-05 tablica, „Seria zrobiona” bez wartości → pole, „Zakończ serię” | `components/NowBoard.tsx` | `tests/m3-p2-board-ui.test.tsx` | zgodne |
| 21.10 ZM-02 zgoda na powiadomienia przy pierwszej przerwie | `components/ActiveWorkout.tsx:291` | testy M3 p2 | zgodne |
| 21.10 ZM-07 dwa przełączniki dźwięk/wibracje; 23.10 wariant A wskazówka trybu cichego | `app/more/settings.tsx:44` | testy p5d, `tests/dzwiek-telefon-1030.test.ts` | zgodne |
| 21.10 W1 c „Planowanie” w tym samym miejscu co w zakładce Plan; 23.10 DEC-07 K3 w linii tytułu także na Trening | `app/(tabs)/index.tsx:44` vs `app/(tabs)/history.tsx:39` | `tests/m3-p2-start.test.tsx:31` pilnuje stanu **sprzed** K3 | **niewdrożone** → 005, 003 |
| 22.10 sztanga po tytule, `TabHeader`, wskaźnik przewijania ukryty | `components/Motif.tsx`, `components/Scroll.tsx:10` | `tests/trening-naglowek.test.tsx`, S18 | zgodne |
| 22.10 M5 S1 (A) zakup tylko przy limicie i w Ustawieniach, licznik dni na starcie; (B) nagłówek o limicie; (C) nazwy planów; tekst przy limicie wariant B | `components/StartPanel.tsx`, `app/paywall.tsx:66` | `tests/subscription-ui.test.tsx`, `tests/m5s1-bez-proby.test.ts` | zgodne dla stanu darmowego; stan po zakupie nieprzewidziany → 001 |
| 23.10 kolejność planów miesięczny / roczny / dożywotni, domyślnie miesięczny | `lib/products.ts:19` (roczny pierwszy) | `tests/m5s1-bez-proby.test.ts:86` pilnuje roczny pierwszy | niewdrożone przez 4 dni; **zastąpione decyzją 27.10 ok. 17:00** (kod zgodny z nią) — samo w sobie nie znalezisko; mechanizm → 003 |
| 23.10 domyślny motyw ciemny nowej instalacji | `lib/seed.ts:273` | testy ustawień domyślnych | zgodne |
| 23.10 DEC-03 c przywrócony przełącznik trybu generatora | `app/generator.tsx:41` | testy generatora | zgodne |
| 23.10 DEC-05 a „Sklep chwilowo niedostępny” | `app/paywall.tsx:79` (`paywall-empty`) | `tests/subscription-ui.test.tsx` | zgodne |
| 23.10 DEC-07 K1 jedna nazwa „Pełna wersja” | `app/_layout.tsx` (tytuł okna), `components/SubscriptionCard.tsx:16` | testy ekranu zakupu | zgodne; ta sama nazwa jako tytuł wiersza w Ustawieniach myli → 006 |
| 23.10 DEC-07 K9 ≤ 1 stuknięcie do odhaczonej serii | `components/NowBoard.tsx` | `tests/dec07-k9-stukniecia.test.tsx` | zgodne |
| 25.10 okno „Uczciwe zasady” z „Anuluj” w nagłówku | `components/FairRulesSheet.tsx` | S1 (`tests/close-button-guard.test.tsx`) | zgodne |
| 26.10 pusta historia „Co nowego” — bez przycisku ✦ | `lib/whatsnew.ts:18` | `tests/release-1.0.test.tsx` | zgodne |
| 27.10 „Technika” rozwinięta w karcie, zwinięta w podglądzie z treningu (`?cues=0`) | `components/ExerciseCues.tsx:80` (wejście z treningu daje `?cues=1`) | `tests/cues.test.tsx` | zgodne z zapisem (docs/18 sam notuje brak wejścia `?cues=0`) |
| 27.10 ok. 17:00 kolejność planów roczny / miesięczny / dożywotni, domyślnie roczny | `lib/products.ts:19`, `app/paywall.tsx:36` | `tests/m5s1-bez-proby.test.ts:86` | zgodne |

## Znaleziska (szczegóły)

### 04-studio-projektowe-001 · Ekran „Pełna wersja” po zakupie nie mówi, jaki plan masz, i dalej sprzedaje ten sam plan
- Pozycja listy kontrolnej: SP-10
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: nagłówek o darmowych dniach nie zależy od stanu dostępu — `app/paywall.tsx:66` (Text `paywall-headline` w gałęzi bez limitu); karta posiadania pokazuje tylko „Masz pełną wersję” i datę, bez nazwy planu — `app/paywall.tsx:68`; lista planów i przycisk zakupu rysują się dla każdego stanu poza dożywotnim, bez oznaczenia posiadanego planu — `app/paywall.tsx:80`, `app/paywall.tsx:88`. Zrzut po zakupie rocznym (sztuczny sklep): `zrzuty/pw-po-zakupie-rocznym-390-dark.png`, `zrzuty/pw-po-zakupie-rocznym-390-light.png`, `zrzuty/ark-paywall.png` (kolumny 3–4). Obserwacja właściciela T-11 (build 1031, konto testerki PL) — ta sama.
- Wzorzec lub źródło: macierz stanów roli (stan „ostrzeżenie/praca w tle”: widoczny status), heurystyka Nielsena 1 (widoczność stanu) i 6; przejście poznawcze P7 krok 3 — porażka Q4 (`przeplywy-as-is.md`).
- Kroki w aplikacji: Więcej → Ustawienia → Pełna wersja → wybierz plan → Subskrybuj → zakup w arkuszu Apple → ekran wraca na górę: „Masz pełną wersję”, pod nią „Trenuj 5 dni w miesiącu za darmo…”, posiadany plan zaznaczony i „Subskrybuj”.
- Opcje: (a) stan subskrybenta: karta „Twój plan: {nazwa}” z datą odnowienia i „Zarządzaj subskrypcją”, nagłówek ofert i lista schowane pod „Zmień plan” (posiadany plan oznaczony, bez „Subskrybuj”) — czytelne, kilka nowych tekstów; (b) lista zostaje, przy posiadanym planie „Twój plan” i nieaktywny przycisk, nagłówek zależny od stanu — mniej zmian, ekran dalej długi; Rekomendacja: (a) (`to-be.md`, T1). Zakres tekstów — rola 09; zgodność z wytycznymi zakupów — rola 02.
- Test akceptacyjny: test ekranu z uprawnieniem miesięcznym, rocznym, z kodu i z Chmury rodzinnej: brak nagłówka o darmowych dniach, nazwa posiadanego planu widoczna i czytana przez VoiceOver, przy posiadanym planie brak przycisku zakupu; scenariusz Maestro 21 rozszerzony o stan po zakupie.
- Status: otwarte

### 04-studio-projektowe-002 · Ikony ekranu Trening ucięte przy największym tekście (T-04) — przyczyna nieustalona, brak sprawdzenia dużego tekstu na iOS
- Pozycja listy kontrolnej: SP-07
- Poziom: P1
- Realność: realny (zaobserwowany przez właściciela na buildzie 1031) · Pewność: średnia (co do przyczyny; samo zjawisko — obserwacja właściciela)
- Rodzaj: D
- Dowód: emulacja Dynamic Type w Expo web (mnożnik 3,12 = AX5 dla tekstu treści, ograniczony przez `maxFontSizeMultiplier` jak w RN iOS: `node_modules/react-native/ReactCommon/react/renderer/textlayoutmanager/platform/ios/react/renderer/textlayoutmanager/RCTAttributedTextUtils.mm:230` skaluje też interlinię) **nie odtwarza** ucięcia na ekranie Trening (390 i 320 pt, jasny i ciemny, z planem, bez planu, pierwsze uruchomienie, trening w toku): `zrzuty/t04-trening-plan-390-dark-ax5.png`, `zrzuty/ark-t04-light.png`, `zrzuty/ark-t04-320.png`, `zrzuty/ark-t04-aktywny-390-dark-ax5.png`, `dowody/web-zrzuty.txt` (0 elementów przyciętych). Emulacja pokazuje inną cechę: grafiki (znaczniki dni, stosy talerzy, znaki legendy strażnika, sztanga po tytule) mają stały rozmiar przy 2–3 razy większym tekście. Na pasku zakładek w web podpisy są przycięte już przy rozmiarze domyślnym (`zrzuty/tabbar-cmp.png`) — artefakt web bez dolnego bezpiecznego obszaru, niedowód. W CI nie ma żadnego przebiegu z dużym tekstem: `.maestro/` i workflowy nie ustawiają rozmiaru treści (`grep content_size` — 0 trafień, `dowody/sp07-skalowanie.txt`).
- Wzorzec lub źródło: podłoga roli „Tekst skaluje się do AX5, kluczowe elementy nie są ucinane” (HIG Typography; WWDC24 Dynamic Type, cytaty w bibliotece ról); próg wydania CLAUDE.md: bariera dostępności = WYSOKIE, jeśli element jest nie do użycia.
- Kroki w aplikacji: Ustawienia iOS → Dostępność → Ekran i wielkość tekstu → Większy tekst → Większe rozmiary dostępności, suwak maksymalnie → Trening, ekran Trening (właściciel: duża szara ikona startu kolejnego treningu ucięta).
- Opcje: (a) zrzut z telefonu przy AX5 (krok właściciela, 2 min) + naprawa wskazanego elementu; (b) scenariusz Maestro z `xcrun simctl ui booted content_size accessibility-extra-extra-extra-large` i zrzutami ekranu Trening przy każdym E2E podstawowym — mechanizm na przyszłość; Rekomendacja: (a) przed 1.0, (b) jako strażnik (decyzja D3).
- Test akceptacyjny: zrzut z symulatora przy AX5 (ekran Trening z planem i bez, trening w toku) bez przyciętych ikon i przycisków; przy decyzji D3 b — scenariusz w pakiecie podstawowym.
- Status: otwarte

### 04-studio-projektowe-003 · Decyzje właściciela o interfejsie zapisane bez testu-strażnika i bez weryfikacji wdrożenia; testy pilnują stanu sprzed decyzji
- Pozycja listy kontrolnej: SP-13
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: (1) decyzja 23.10 o kolejności planów (docs/18-przekazanie.md, wpis "ekran Pełna wersja — kolejność planów miesięczny, roczny, dożywotni") i DEC-07 K3 (ten sam plik, karty P2) były przypisane gałęzi `naprawa-m1-dec07-ui` (`docs/przekazanie-koordynatora-2026-10-23.md:26`), ale scalona gałąź zawiera tylko K9, DEC-05 i DEC-01 (`git log 99563b1e^2`, `dowody/decyzje-kod.txt`); (2) test `tests/m5s1-bez-proby.test.ts:86` utrwala kolejność sprzed decyzji 23.10 (roczny pierwszy), a `tests/m3-p2-start.test.tsx:31` utrwala "Planowanie" nad tytułem, sprzeczne z K3 — testy są zielone, więc nic nie sygnalizuje rozjazdu; (3) "podgląd liczb po przytrzymaniu — 1.0.1" (DEC-01 a, 23.10) nie ma wpisu w backlogu `docs/21-roadmapa-offline.md` (grep: 0 trafień). Kolejność planów wykrył właściciel na telefonie, a 27.10 zmienił decyzję — przypadek zamknięty, mechanizm nie.
- Wzorzec lub źródło: CLAUDE.md, „Lekcje po błędach” (akcja ma być mechanizmem, nie postanowieniem) i zasada „Model pracy po L-001”; zasada wspólna 2 (dowód zamiast deklaracji).
- Kroki w aplikacji: nie dotyczy (proces); skutek dla użytkownika: interfejs inny niż zatwierdzony przez właściciela (005).
- Ocena zakresu: **systemowa** — ta sama luka może wrócić przy każdej decyzji o wyglądzie lub tekście. Opcje: (a) rejestr decyzji UI w pliku danych (ID decyzji → test lub wyjątek z powodem), strażnik w verify sprawdza, że każda decyzja z docs/18 oznaczona `[UI]` ma test, a zmiana decyzji wymusza zmianę testu z tym ID — pewne, koszt S–M; (b) krok listy kontrolnej koordynatora przy scalaniu gałęzi napraw: „każda decyzja przypisana gałęzi ma commit i test” — tańsze, zależne od pamięci koordynatora; Rekomendacja: (a).
- Test akceptacyjny: strażnik wykrywa decyzję `[UI]` bez testu (czerwony na próbce), a K3 i podgląd 1.0.1 mają test albo wpis w backlogu z wersją.
- Status: otwarte

### 04-studio-projektowe-004 · W wąskim układzie tabeli serii przycisk stopera i pole RPE mają 40 pt szerokości (poniżej przyjętych 44 pt)
- Pozycja listy kontrolnej: SP-06
- Poziom: P1 (reguła SP-06: projekt przyjął 44 pt, element w głównym przepływie z rękami zajętymi)
- Realność: brzegowy (tylko gdy szeroki układ się nie mieści: ekrany ok. 320–375 pt, tryb „Powiększenie ekranu”) · Pewność: wysoka
- Rodzaj: D
- Dowód: `components/WorkoutBlocks.tsx:51` — układ COMPACT: `play: 40`, `rpe: 40` (wysokość 44, `components/WorkoutBlocks.tsx:231`); układ szeroki ma 44 i 46 (`components/WorkoutBlocks.tsx:49`). Cel dotyku w tokenach: `SIZE.hit = 44` (`lib/tokens.ts:155`). Bez `hitSlop` na tych elementach.
- Wzorzec lub źródło: podłogi dostępności roli (44 × 44 pt, decyzja studia; HIG minimum 28); design-spec §1 „Cel dotykowy ≥ 44 pt”.
- Kroki w aplikacji: iPhone o szerokości 320–375 pt albo „Powiększenie ekranu” → trening z ćwiczeniem na czas (plank) i włączonym RPE → tabela serii pod tablicą → przycisk ▶ stopera i pole RPE węższe niż 44 pt.
- Opcje: (a) `hitSlop` poziomy 2 pt na obu elementach (obszar 44 pt bez zmiany układu) — tanie; (b) szerokość 44 i przeniesienie RPE do menu serii przy wąskim ekranie — więcej zmian; Rekomendacja: (a).
- Test akceptacyjny: test układu COMPACT: każdy element interaktywny wiersza serii ma szerokość + hitSlop ≥ 44.
- Status: otwarte

### 04-studio-projektowe-005 · „Planowanie” na ekranie Trening stoi nad tytułem, a nie w linii tytułu (DEC-07 K3 niewdrożone)
- Pozycja listy kontrolnej: SP-15
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: Trening — przycisk w osobnym wierszu nad tytułem, `app/(tabs)/index.tsx:44`; Plan — w linii tytułu, `app/(tabs)/history.tsx:39`; zrzut `zrzuty/ark-390-dark.png` (kolumny 2 i 3). Decyzja: docs/18-przekazanie.md, DEC-07 K3 (a) z 23.10.2026; wzorzec 19 c docs/32 (ta sama akcja w tym samym miejscu).
- Wzorzec lub źródło: docs/32 wzorzec 19 c; zasada projektowa właściciela z 13.10.2026 (to samo działa i stoi tak samo).
- Kroki w aplikacji: ekran Trening z planem → „Planowanie” w prawym górnym rogu nad tytułem; zakładka Plan → „Planowanie” w linii tytułu „Plan”.
- Opcje: (a) wdrożyć K3 (`TabHeader row` jak w Plan) — zgodne z decyzją, ekran niższy o linię; (b) zostawić i zapisać zmianę K3 — bez pracy, niespójne położenie; Rekomendacja: (a) (`to-be.md`, T3).
- Test akceptacyjny: `tests/m3-p2-start.test.tsx` zmieniony: przycisk w wierszu `title-row`; przy 320 pt i dużym tekście tytuł i przycisk się zawijają, nic nie jest ucięte.
- Status: otwarte

### 04-studio-projektowe-006 · Wiersz „Pełna wersja” w Ustawieniach wygląda jak stan, nie jak przejście do zakupu (T-11)
- Pozycja listy kontrolnej: SP-09
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `components/SubscriptionCard.tsx:16` — tytuł wiersza to nazwa produktu, podpis to licznik dni; w stanie darmowym czyta się jak informacja o posiadanej wersji. Zrzut: `zrzuty/as-is/as-is-p6-01-wiecej-ustawienia.png` (stan „na zawsze”); obserwacja właściciela T-11 dla stanu darmowego. Przejście poznawcze P7 krok 1 — porażka Q2.
- Wzorzec lub źródło: słownik interakcji roli — etykieta opisuje akcję i obiekt; heurystyka Nielsena 2.
- Kroki w aplikacji: konto bez zakupu → Więcej → Ustawienia → sekcja „Subskrypcja”: wiersz „Pełna wersja / Darmowe dni treningowe w tym miesiącu: wykorzystano 0 z 5”.
- Opcje: (a) tytuł zależny od stanu: darmowy — akcja („Kup pełną wersję” albo „Zobacz plany”), po zakupie — stan („Twój plan: …”) — jasne, nowe teksty; (b) zostawić tytuł, dopisać podpowiedź VoiceOver i „›” — mniejsza zmiana, wzrok bez poprawy; Rekomendacja: (a), spójnie z 001.
- Test akceptacyjny: test karty w stanie darmowym i pełnym: tytuł darmowy zawiera czasownik akcji, pełny nazywa plan.
- Status: otwarte

### 04-studio-projektowe-007 · „Pierwsze kroki”: przycisk „Planowanie” przy kroku „utwórz szablon”, krok 3 wskazuje nieistniejący „Start”
- Pozycja listy kontrolnej: SP-19
- Poziom: P2
- Realność: realny (każda nowa osoba, raz) · Pewność: wysoka
- Rodzaj: D
- Dowód: krok 1 i 2 dostają ten sam przycisk `planning` — `components/Dashboard.tsx:98`, `components/Dashboard.tsx:101`, `components/Dashboard.tsx:102`; krok 3 i styl "ghost" przycisku Przewodnik — `components/Dashboard.tsx:103`; zdanie o miejscach jako szary tekst bez znaku przejścia — `components/Dashboard.tsx:105`. Zrzut: `zrzuty/as-is/as-is-p1-01-pierwsze-uruchomienie.png` (na ekranie jest "Pusty trening", nie "Start").
- Wzorzec lub źródło: przejście poznawcze (Flaherty, NN/g) — P1 kroki 2 i 3 „porażka”; heurystyki 1 i 2; docs/32 wzorzec 17 (przejście ma „›”).
- Kroki w aplikacji: świeża instalacja → ekran Trening → „Pierwsze kroki”.
- Opcje: (a) etykieta kroku 1 nazwana celem, tekst kroku 3 zależny od stanu, zdanie o miejscach jako wiersz z „›”, jeden styl przycisków — kilka tekstów w 35 językach; (b) zostawić — sprzeczna wskazówka w pierwszej minucie; Rekomendacja: (a) (`to-be.md`, T2).
- Test akceptacyjny: test „Pierwszych kroków” w stanie bez szablonu: tekst kroku 3 nie zawiera „Start”, przyciski kroków 1 i 2 mają różne etykiety, wszystkie przyciski jednego rodzaju.
- Status: otwarte

### 04-studio-projektowe-008 · Migracja na tokeny niedokończona (67 literałów fontSize, 18 borderRadius, stare `F.heavy`) i bez wersji w backlogu
- Pozycja listy kontrolnej: SP-03
- Poziom: P2
- Realność: realny (różne wielkości pisma na tym samym ekranie, np. „Ten tydzień” na Trening) · Pewność: wysoka
- Rodzaj: D
- Dowód: `dowody/sp03-literaly.txt` — 67 `fontSize` i 18 `borderRadius` liczbowych w app/ i components/, najwięcej `components/GuardSection.tsx` (21) i `components/Dashboard.tsx` (15); stary krój `F.heavy` m.in. `components/Dashboard.tsx:21`; zapadka `tests/token-baseline.json` tylko nie pozwala rosnąć. Zaplanowana w M3 migracja w partiach p2–p5 (docs/design/design-spec.md §10) nie objęła tych plików; wpisu z wersją w docs/21 brak.
- Wzorzec lub źródło: SP-03; design-spec §10 (S — `font(rola)` zamiast liczbowych `fontSize`).
- Kroki w aplikacji: ekran Trening → „Ten tydzień” (kafelki, zdania strażnika 13 pt, przycisk 15 pt) obok elementów z ról `TYPE` — 5–6 wielkości tekstu na jednym ekranie.
- Opcje: (a) migracja `Dashboard`, `GuardSection`, `ProgressBars`, `PeriodSummary`, `RecordsCard`, `plan.tsx` w 1.0.1 z wpisem w backlogu — porządek, ryzyko regresji układu; (b) zostawić zapadkę bez terminu — dług rośnie wraz z nowymi ekranami; Rekomendacja: (a) z wersją 1.0.1.
- Test akceptacyjny: `tests/token-baseline.json` bez wymienionych plików; zrzuty ekranu Trening i Postępy porównane z `docs/design/wzorce-zrzuty/`.
- Status: otwarte

### 04-studio-projektowe-009 · Kolejność ćwiczeń zmienia się tylko przeciąganiem (bez przycisku dla osób bez VoiceOver)
- Pozycja listy kontrolnej: SP-15
- Poziom: P2
- Realność: brzegowy (osoby z ograniczoną precyzją ruchu, bez czytnika ekranu) · Pewność: wysoka
- Rodzaj: D
- Dowód: `components/DragList.tsx:98` — akcje "w górę / w dół" tylko jako akcje dostępności; brak widocznej alternatywy (`gesty.md`).
- Wzorzec lub źródło: podłoga „Każdy gest ma alternatywę w postaci przycisku” (HIG Accessibility, Gestures — cytaty w bibliotece ról).
- Kroki w aplikacji: Szablon albo trening → „Kolejność” → zmiana kolejności możliwa tylko przeciągnięciem uchwytu.
- Opcje: (a) menu wiersza „Przesuń wyżej / niżej”; (b) strzałki przy wierszu; (c) zostawić; Rekomendacja: (a) (`to-be.md`, T4).
- Test akceptacyjny: test ekranu Kolejność: zmiana pozycji bez gestu daje ten sam wynik co przeciągnięcie.
- Status: otwarte

### 04-studio-projektowe-010 · Pasek tygodnia przy 320 pt i dużym tekście: skróty dni zlewają się („SOB.NIEDZ.”)
- Pozycja listy kontrolnej: SP-07
- Poziom: P2
- Realność: brzegowy (320 pt + tekst ≥ 130%; limit liczb 1,3 osiągany już przy największym rozmiarze spoza „dostępności”) · Pewność: średnia (emulacja web, krój zastępczy)
- Rodzaj: D
- Dowód: `zrzuty/ark-t04-320.png` (pierwsza kolumna, pasek tygodnia); siedem kolumn `flex: 1` z odstępem 2 pt, skróty wersalikami z limitem `NUM_SCALE_MAX` — `components/TodayPlan.tsx:56` i `components/TodayPlan.tsx:63`.
- Wzorzec lub źródło: podłoga „Tekst”: przy dużym tekście układ się przestawia, nic się nie nakłada; decyzja R-011 (21.10) — 375 i mniej bez automatycznego sprawdzenia.
- Kroki w aplikacji: iPhone z „Powiększeniem ekranu” albo SE, tekst w największym rozmiarze spoza dostępności → Trening → pasek tygodnia.
- Opcje: (a) skróty jednoliterowe albo dwuliterowe przy braku miejsca (`weekdayLabels` w wersji krótkiej) — tanie; (b) zostawić (ekran ≤ 375 pt poza testami, R-011); Rekomendacja: (a) przy migracji tokenów (008).
- Test akceptacyjny: test szerokości (320 pt, skala 1,3): każdy skrót dnia mieści się w swojej kolumnie.
- Status: otwarte

### 04-studio-projektowe-011 · Przegląd ciągów „A · B · C” z docs/32 wzorzec 28 nadal otwarty, ciągi o zmiennej treści zostały
- Pozycja listy kontrolnej: SP-12
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: docs/32 wz. 28 „Stan kodu: [OTWARTE] przegląd przy redesignie wyglądu”; ciągi zostały m.in. `components/StartPanel.tsx:27` (podpis przycisku startu: dzień i liczba ćwiczeń przez „·”), `components/StartPanel.tsx:51` (Powtórz ostatni: nazwa · data); zrzut `zrzuty/as-is/as-is-p2-02-inny-trening.png`.
- Wzorzec lub źródło: kalibracja domyślnych wyborów roli (ciągi „A · B · C” to chrom szablonu); DEC-17 wariant a.
- Kroki w aplikacji: Trening → przycisk startu i arkusz „Inny trening”.
- Opcje: (a) przegląd ciągów w 1.0.1 z regułą DEC-17 (zdanie albo osobna linia) — porządek, teksty w 35 językach; (b) zapisać wyjątek dla podpisów przycisków startu — bez pracy; Rekomendacja: (a) z wersją w backlogu.
- Test akceptacyjny: `tests/audit-m1-063-caps-separators.test.ts` rozszerzony o listę dozwolonych ciągów z powodem.
- Status: otwarte

**Weryfikacja przeciwna (E2) dla P1**
- 001: próbowałem obalić — czy lista po zakupie służy zmianie planu (crossgrade)? Kod nie oznacza posiadanego planu i nie zmienia przycisku; testy `tests/subscription-ui.test.tsx` sprawdzają tylko obecność karty `paywall-owned`. Przetrwało.
- 002: emulacja nie odtworzyła — obniżyłem pewność do średniej, ale zjawisko zgłosił właściciel na urządzeniu, a projekt nie ma żadnej kontroli dużego tekstu na iOS. Przetrwało jako P1 z krokiem właściciela.
- 003: czy K3 mogło zostać świadomie wycofane? Brak wpisu w docs/18 po 23.10; test pilnuje stanu sprzed decyzji. Przetrwało.
- 004: czy hitSlop nadrabia? Nie ma `hitSlop` na tych elementach. Przetrwało (brzegowe).
- Odrzucone jako znalezisko po E2: ceny w USD na liście przy arkuszu w PLN (T-11) — ceny pochodzą wyłącznie z `displayPrice` StoreKit (`lib/store-native.ts:57`), aplikacja ich nie formatuje; przyczyna leży w StoreKit/TestFlight albo w konfiguracji produktów — pewność < 80%, przeniesione do "Do sprawdzenia".

## Do sprawdzenia (pewność ≤ 80%)
- **T-11 ceny USD na liście, PLN w arkuszu (TestFlight, konto PL):** aplikacja wyświetla `displayPrice` z StoreKit bez zmian (`lib/store-native.ts:57`; ceny w kodzie są tylko w sztucznym sklepie E2E). Brakuje: odczytu dokumentacji Apple o walucie `Product.displayPrice` w TestFlight `[DO USTALENIA]` i sprawdzenia w produkcji. Krok właściciela po wydaniu: na koncie PL otworzyć "Pełna wersja" w wersji z App Store i zrobić zrzut cen. Rola 02/08 — skutek dla zaufania do ceny (3.1.2).
- **T-11 „Zarządzaj subskrypcją” w TestFlight otwiera listę produkcyjną:** wywołanie systemowe (`deepLinkToSubscriptions`); zachowanie piaskownicy TestFlight `[DO USTALENIA]` w dokumentacji Apple — nie defekt aplikacji, dopóki produkcja działa.
- **T-04 — krok właściciela:** zrzut ekranu Trening przy AX5 (z planem, bez treningu w toku) i w trakcie treningu; jeśli ucięte są ikony paska zakładek, problem dotyczy natywnego paska (web nie odtwarza).
- **Obramowanie niewybranego planu 1,43:1 (jasny) / 1,23:1 (ciemny):** stan wyboru niesie ramka 2 pt w akcencie (≥ 3:1), karta ma etykietę tekstową; WCAG 1.4.11 wymaga kontrastu granicy tylko, gdy jest potrzebna do rozpoznania elementu — do oceny na telefonie w słońcu (`dowody/sp04-kontrast.txt`).
- **Tytuły bloków ćwiczeń i wiersze `Item` bez limitu powiększenia** (rosną do 312%, ponad DEC-10 200%) — zawijają się, nic nie ucinają w emulacji; czy to zamierzone wobec DEC-10 — do potwierdzenia przez właściciela przy D3.
- **„Pogrubiony tekst” dla kroju systemowego** (R-014, `lib/theme.ts` komentarz „[DO USTALENIA, lista tylko telefon]”) — właściciel potwierdził „pogrubiony tekst OK” na buildzie 1031; zamknięcie R-014 — rola 10.

## Co działa dobrze i należy zachować
- Tablica „teraz”: element firmowy z dziedziny, niesie wszystkie dane serii, opis VoiceOver jednym elementem, ruch przewrotu z wersją „Ogranicz ruch”.
- Zapis serii 1 stuknięciem z testem-wymaganiem (K9), duży przycisk główny 60 pt, ± 44 pt.
- Palety jasna, ciemna i obie HC z pomiarem; ciemny motyw zaprojektowany (przycisk główny jasny), nie odwrócony.
- Strażniki wzorców docs/32 (S1–S18) — spójne zamykanie okien, potwierdzenia, usuwanie z drogą bez gestu.
- Stany kolorów zawsze ze znakiem, słowem albo wzorem (strażnik progresji, kalendarz, serie) — sprawdzone w skali szarości.
- Brak `allowFontScaling={false}`; limity skali w jednym miejscu (`TEXT_SCALE`).

## Decyzje dla właściciela
- **D1 — stan po zakupie na ekranie „Pełna wersja” (001, 006):** (a) karta „Twój plan” + „Zmień plan”, oferta schowana; (b) lista zostaje z oznaczeniem „Twój plan” i nieaktywnym przyciskiem. Kompromis: (a) czytelniejsze, więcej zmian; (b) mniej pracy, ekran dalej sprzedaje. Rekomendacja: (a). Czas agenta ok. 1–2 h + przekład; czekanie: E2E podstawowy.
- **D2 — mechanizm „decyzja → test” (003):** (a) rejestr decyzji UI ze strażnikiem w verify; (b) krok listy koordynatora przy scalaniu. Rekomendacja: (a) — mechanizm, nie postanowienie (zasada lekcji). Czas agenta ok. 2–3 h.
- **D3 — duży tekst na iOS (002, 010):** (a) scenariusz E2E z rozmiarem AX5 i zrzutami 3 ekranów w pakiecie podstawowym (+ ok. 2–3 min na przebieg); (b) emulacja web z tego audytu jako test Jest (tani, bez natywnych pasków i krojów); (c) tylko zrzut właściciela przed wydaniem. Rekomendacja: (a) + (b); przed 1.0 co najmniej (c) — zrzut T-04 (2 min właściciela).
- **D4 — K3 „Planowanie” (005):** wdrożyć (rekomendacja) albo zapisać zmianę decyzji.
- **D5 — pamięć portfolio (repo prompts):** wpis Treningu jest nieaktualny (IBM Plex, papier `#F4F3EF`, akcent `#1F5FD1`). Proponowany wpis: „Trening („Tablica podejść”, od M3 21.10.2026): element firmowy — tablica „teraz” (granat `#13294B`, krem cyfr `#F5F1E6`, bursztyn „teraz” `#F2A900`), tło „hala” `#E6E8E5` / `#161C24`; krój Barlow Condensed 600/700 (tytuły, liczby) + systemowy; motyw talerzy IWF tylko jako subtelne tło pustych stanów; ikona i intro „Tuleja” bez zmian. Uwagi właściciela: 21.10 „front end chyba trochę odstaje… nie ma efektu wow przy zachowaniu prostoty ducha trackera”; wybór A2.” Wpisuje właściciel (zasada modułu).
- **D6 — sekcja „Stan projektu” w CLAUDE.md:** tekst w „Linia bazowa i założenia”; wpisać albo zostawić w poleceniach M1.
- **D7 — wersje backlogu dla 008 i 011:** 1.0.1 (rekomendacja) albo bez terminu.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 04-studio-projektowe --tryb fix --zadania 04-studio-projektowe-001,04-studio-projektowe-002,04-studio-projektowe-004,04-studio-projektowe-005,04-studio-projektowe-006,04-studio-projektowe-007`
(003 — po decyzji D2, zadanie koordynatora/roli 08; 008–011 — po decyzji D7.)
