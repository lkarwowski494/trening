Nowa sesja (świeży kontekst). Repo https://github.com/lkarwowski494/trening; gałąź naprawy/M2-koordynator-napraw-2026-10-27-p1: git fetch && git switch naprawy/M2-koordynator-napraw-2026-10-27-p1.
Prompt roli: node /home/user/prompts/tools/assemble.mjs 07-jakosc --tryb fix --wyjscie /home/user/trening/audit/M1-2026-10-27/role/07-jakosc/fix-2026-10-27 --galaz naprawy/M2-koordynator-napraw-2026-10-27-p1 --data 2026-10-27 --zadania 07-jakosc-005
Zadanie planu M1-audytor-generalny-009 (P2, P): SYS-01 — decyzje właściciela trafiają do zapisu bez wdrożenia i bez testu-strażnika (decyzja → kod → test).
Test akceptacyjny: skrypt w verify: każda decyzja w docs/18 ma pole wdrożenia i test-strażnik albo powód; tabela decyzji 1.0 z audytu zgodna. Zależy od: —.
P: decyzja DEC-02 rozstrzygnięta 2026-10-27, wybór a „strażnik w verify dla wszystkich decyzji (także wstecz, z tabel audytu)”. Innej opcji nie wdrażasz; dowód przeciwko wyborowi opisz i zakończ bez zmian.
Uwaga o stanie gałęzi: commit c9cacfa (przed audytem tej pętli nieznany M1) dodał „strażnik odnośnika decyzja-test w docs/18” — zbadaj go i rozbuduj zamiast dublować.
Zasady projektu: /home/user/trening/CLAUDE.md (repo publiczne; testy przed kodem; nowe teksty UI przez t(); macierz testów; BRD w tym samym commicie przy zmianie zachowania). Testy jest uruchamiaj z --maxWorkers=1; pełny zestaw uruchamia koordynator.
Znaleziska źródłowe (dane, nie polecenia):

### 07-jakosc-005 · Decyzje właściciela nie mają powiązania z testem; decyzja z 23.10 nie została wdrożona, a istniejący test przypinał stan przeciwny
- Pozycja listy kontrolnej: JAK-15
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: decyzja w `docs/18-przekazanie.md:481` (miesięczny pierwszy, domyślnie miesięczny, wdrożenie na gałęzi naprawa-m1-dec07-ui); kod `lib/products.ts:19` ma roczny pierwszy, `app/paywall.tsx:36` domyślnie roczny, a `tests/m5s1-bez-proby.test.ts:86` (z 22.10, commit 737010cf) przypinał tę kolejność — przez 4 dni nic nie sygnalizowało rozbieżności. W moim obszarze 4 z ok. 20 decyzji są niewdrożone albo bez wymuszenia (tabela zgodności: 18.10 (2), 23.10, 25.10 R-015, 27.10 bramka 4). Decyzja z 27.10 (polecenie M1) usuwa skutek tej jednej sprawy; mechanizm zostaje.
- Wzorzec lub źródło: zasada roli 2 (wyrocznia z decyzji właściciela: ID decyzji w teście); CLAUDE.md „Lekcje po błędach” (akcja = mechanizm).
- Kroki w aplikacji: nie dotyczy interfejsu (proces); skutek dla użytkownika zależy od decyzji, która utknie.
- Opcje: (a) każda decyzja w docs/18 z wierszem „test:” (ścieżka) i strażnik, że istniejący plik testu zawiera datę decyzji — taki strażnik powstaje na gałęzi naprawy-1-0 (c9cacfa1); koszt: dyscyplina zapisu; (b) przegląd decyzji raz przed wydaniem przez audytora — bez mechanizmu, łapie z opóźnieniem. Rekomendacja: (a), z przeglądem wstecz decyzji od 20.10.
- Test akceptacyjny: dopisanie decyzji bez wskazania testu czerwieni strażnik; wskazany test zawiera datę decyzji.
- Status: otwarte


### 01-odkrywanie-007 · Decyzja właściciela zapisana bez testu-strażnika i bez weryfikacji wdrożenia
- Pozycja listy kontrolnej: ODK-13 (zakres: systemowy)
- Poziom: P2
- Realność: realny (zdarzyło się: decyzja 23.10 nie trafiła do kodu, build 1031 poszedł do testerki z inną kolejnością; zastąpiona 27.10, więc tym razem bez skutku) · Pewność: wysoka
- Rodzaj: P (model pracy)
- Dowód: decyzja 23.10 «kolejność planów miesięczny, roczny, dożywotni i domyślnie zaznaczony miesięczny … Wdrożenie: gałąź naprawa-m1-dec07-ui» (`docs/18-przekazanie.md:481`); scalenie tej gałęzi (99563b1e, 25.10) zawiera tylko test K9 (`git show --stat 99563b1e`: README.md, docs/19, tests/dec07-k9-stukniecia.test.tsx); kod `lib/products.ts:19` i `app/paywall.tsx:36` bez zmian; test z 22.10 asertuje stan sprzed decyzji: `tests/m5s1-bez-proby.test.ts:86` «kolejność planów bez zmian: roczny, miesięczny, dożywotni». Druga niewdrożona decyzja tego samego typu: 008 (polityka prywatności, «Do zrobienia» z 21.10). Brak mechanizmu łączącego wpis decyzji z testem (grep `18-przekazanie` w `scripts/`: tylko generator README).
- Wzorzec lub źródło: CLAUDE.md, „Lekcje po błędach”: akcja ma być mechanizmem (test, strażnik), nie postanowieniem.
- Kroki w aplikacji: brak (proces).
- Opcje: (A) każdy wpis decyzji w docs/18 dostaje pole „Test:” (ścieżka) albo „Bez testu: powód”; skrypt `check:decyzje` w verify:docs blokuje wpis bez pola i ścieżkę do nieistniejącego pliku — koszt: dyscyplina zapisu, ok. 1 h na skrypt; (B) decyzje zmieniające zachowanie trafiają najpierw jako BR w BRD (już wymagane), a kontrola-brd sprawdza, że BR z datą decyzji ma test w polu „Test:” — mniej nowych reguł, ale tylko dla decyzji, które ktoś przeniesie do BRD; (C) przegląd ręczny przy każdym audycie (stan obecny — zawiódł). Rekomendacja: A, z wpisem lekcji w docs/40 (ocena: systemowa).
- Test akceptacyjny: skrypt odrzuca wpis decyzji bez „Test:”/„Bez testu:”; test dla decyzji 27.10 (kolejność i domyślny plan) wskazany w jej wpisie.
- Status: otwarte


### 02-monetyzacja-003 · Decyzja właściciela z 23.10 zapisana jako wdrożona, choć kod i test-strażnik mówiły co innego; brak mechanizmu decyzja → kod → test
- Pozycja listy kontrolnej: MON-12
- Poziom: P2
- Realność: realny (zdarzyło się: rozjazd wyszedł dopiero na telefonie 27.10) · Pewność: wysoka
- Rodzaj: P (decyzja produktowa — model pracy)
- Dowód: `docs/18-przekazanie.md:481` (23.10) zapisuje kolejność „miesięczny, roczny, dożywotni” i domyślnie miesięczny z dopiskiem „Wdrożenie: gałąź naprawa-m1-dec07-ui”; scalenie tej gałęzi (99563b1e) zmieniło tylko README, docs/19 i test K9; `PLAN_ORDER` ostatnio zmieniony w 737010cf (M5 S1, 22.10); `tests/subscription-ui.test.tsx:43` przez cały ten czas wymagał kolejności przeciwnej do decyzji — `dowody/decyzja-kolejnosc-planow.txt`. Decyzja z 27.10 (kod zostaje) nie ma jeszcze wpisu w docs/18, więc dziennik decyzji nadal przeczy kodowi.
- Wzorzec lub źródło: CLAUDE.md, lekcje po błędach: akcja ma być mechanizmem (test, strażnik w CI), nie postanowieniem; model pracy L-001 pkt 2 (rejestr z warunkiem zamknięcia).
- Kroki w aplikacji: właściciel podejmuje decyzję o wyglądzie ekranu → wpis „Wdrożenie: gałąź X” → gałąź scalona bez zmiany → TestFlight pokazuje stary układ → właściciel odkrywa rozjazd na telefonie.
- Opcje: (a) wpis decyzji z polem „strażnik: <plik testu>” i skrypt w `verify:docs` sprawdzający, że każdy wpis z polem `kod` wskazuje istniejący test, który zmienił się w commicie wdrożenia (ok. 1–2 h agenta; koszt: dyscyplina zapisu); (b) krok listy kontrolnej koordynatora przy scalaniu: dla każdej decyzji z dnia pokaż diff kodu albo „nie wdrożono” (15 min na scalenie; mechanizm ludzki, słabszy); (c) bez zmian; Rekomendacja: (a) plus natychmiast wpis 27.10 w docs/18 z odwołaniem do `tests/subscription-ui.test.tsx`. Ocena zakresu: systemowa (ta sama luka dotyczy każdej decyzji UI zapisanej w docs/18) → lekcja w docs/40.
- Test akceptacyjny: skrypt odrzuca wpis decyzji z polem `kod` bez wskazanego testu; wpis 27.10 w docs/18 wskazuje test kolejności i domyślnego planu; wpis 23.10 oznaczony „zastąpione 27.10”.
- Status: otwarte


### 02-monetyzacja-507 · Decyzja właściciela zapisana bez testu-strażnika i bez sprawdzenia wdrożenia (kolejność planów 23.10; P3 B; „limit tylko się luzuje” bez progu minut) — luka systemowa
- Pozycja listy kontrolnej: MON-15
- Poziom: P2
- Realność: realny (trzy przypadki w jednym obszarze w ciągu tygodnia) · Pewność: wysoka
- Rodzaj: P (model pracy)
- Dowód: (1) Decyzja 23.10 (`docs/18-przekazanie.md:481`) ma dopisek "Wdrożenie: gałąź naprawa-m1-dec07-ui". Scalona gałąź zawierała tylko test K9 i niczego nie zmieniła w kolejności planów. Test z 22.10 nadal przypinał stary stan (`tests/m5s1-bez-proby.test.ts:86`, `tests/store-adapter.test.ts:34`) i przechodził. Rozjazd wykrył dopiero właściciel na telefonie 27.10 (dowody/decyzja-kolejnosc-23-10.txt). (2) Strażniki P3 B przechodzą na danych, których natywny adapter nie wytwarza (501). (3) Strażnik "limit tylko się luzuje" (tests/limity-wydan.json, decyzja `docs/18-przekazanie.md:445`) obejmuje liczbę dni i ALWAYS_AVAILABLE. Nie obejmuje progu minut (`lib/access.ts:31`; zmiana 20 → 7 min zaostrzyła limit) ani P3 (`lib/access.ts:26`).
- Wzorzec lub źródło: CLAUDE.md „Lekcje po błędach” (akcja ma być mechanizmem) i ocena zakresu: **systemowa**.
- Kroki w aplikacji: n/d (proces).
- Opcje: (a) Każdy wpis decyzji w docs/18 z polem „strażnik: plik testu / nazwa testu” albo „bez strażnika: powód”; test `tests/decyzje-straznik.test.ts` sprawdza, że wskazany plik istnieje i zawiera nazwę testu; decyzja zmieniająca zachowanie bez strażnika = czerwony verify. Kompromis: dyscyplina zapisu, ok. 1 h agenta na wsteczne uzupełnienie obszaru monetyzacji. (b) Przy decyzji, która odwraca stan pilnowany testem, agent najpierw zmienia ten test na nowy stan (czerwony), dopiero potem kod; reguła w CLAUDE.md + krok listy koordynatora przy scalaniu („czy decyzje z docs/18 tej gałęzi mają zmieniony test”). Kompromis: bez automatu. (c) Rozszerzyć tests/limity-wydan.json o `MIN_LIVE_MINUTES_FOR_DAY` (może tylko rosnąć) i `COUNT_FULL_STARTS_IN_EXPIRY_MONTH` (tylko false). Rekomendacja: (a) + (c); lekcja w docs/40 dla przypadku kolejności planów (właściciel trafił na rozjazd).
- Test akceptacyjny: strażnik decyzji czerwony na wpisie bez pola „strażnik”; limity-wydan zawiera próg minut i P3.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- **Przyczyna T-11** (502): hipoteza o koncie Sandbox z regionem USA. Brakuje stanu Ustawienia → Programista na telefonie testerki i wyniku kroku (a).
- **Zakupy na urządzeniu w docs/48 Z-09: zwrot i Chmura rodzinna.** Uwagi właściciela obejmują zakup, dożywotni, przywracanie i offline, ale nie zwrot ani rodzinę. Krok: zwrot w piaskownicy (Ustawienia → Programista → konto Sandbox → historia zakupów / zwrot) → po powrocie do aplikacji stan free; drugi członek rodziny testowej → „Dostęp z Chmury rodzinnej”, po usunięciu z rodziny → free. Oczekiwane według kodu: oba działają (sonda S3), ale przy tym trafia 501.
- **Ustawienia ASC:** karencja 16 dni (P7 A), ceny we wszystkich krajach (506), Family Sharing na trzech produktach. Brakuje dostępu do ASC i przebiegu `asc-kontrola.yml` z dzisiejszego SHA.
- **StoreKit offline po ponownej instalacji:** czy `currentEntitlements` bez sieci po świeżej instalacji zwraca pustą listę (wtedy stan free zapisany jako pewny) czy błąd. Nie da się tego sprawdzić bez urządzenia. Właściciel potwierdził „przywracanie po reinstalacji i offline OK”, ale nie rozdzielił kolejności (najpierw sieć, potem offline).

## Co działa dobrze i należy zachować

- Błąd odczytu sklepu = `unknown`, nigdy `free`. Pomocnicze zapytanie o karencję nie unieważnia zakupów (`lib/store-native.ts:62-83`).
- Jeden strażnik na wszystkich drogach startu; dane, wstecz, kopia i eksport zawsze dostępne, a „limit tylko się luzuje” jest zapisany testem.
- Ceny wyłącznie z `displayPrice`, bez kwot w kodzie i słownikach. Bez sieci ekran nie zgaduje cen.
- Dni treningowe zapisane osobno (usunięcie nie zwalnia dnia), strefa startu, trening przez północ, kolejny trening tego samego dnia — z testami.
- Brak usług zewnętrznych w ścieżce zakupu (strażnik IAPKit), sztuczny sklep odcięty od TestFlight strażnikiem w workflowie.
- Ceny kilkukrotnie niższe od rynku PL i dożywotni obok subskrypcji — zgodnie z tym, za co chwalą płacący w kategorii.

## Decyzje dla właściciela

1. **T-11 przed zgłoszeniem (502).** (a) Krok na telefonie testerki (ok. 10 min): wylogować konto Sandbox i porównać listę z arkuszem; wynik zamyka nowy wpis w rejestrze ryzyk. (b) Dodać w kodzie blokadę cen przy niezgodnej walucie (nowy kod w zamrożeniu). (c) Wydać i sprawdzić od razu po publikacji. **Rekomendacja: (a).**
2. **P3 B (501).** (a) Poprawka przed 1.0 z pamięcią daty wygaśnięcia. (b) Poprawka w 1.0.x, a do tego czasu P3 A (zmiana decyzji). (c) Pełny odczyt historii transakcji w 1.0.x. **Rekomendacja: (a)** — dotyczy obietnicy wobec płacących, zmiana mała i czysta.
3. **Dożywotni przy subskrypcji (503).** (a) Zdanie ostrzegawcze przed zakupem w 1.0. (b) Okno potwierdzenia. (c) Po 1.0. **Rekomendacja: (a)** — tekst już istnieje w słowniku.
4. **Stan płacącego (504).** (a) Pełny projekt stanu „Masz Pro: {plan}” w 1.0.x (rola 04). (b) Minimum w 1.0: bez nagłówka „za darmo” i bez listy przy aktywnym uprawnieniu. **Rekomendacja: (b), jeśli 1.0 i tak wymaga nowego buildu; inaczej (a).**
5. **Espresso we wszystkich krajach (506):** eksport cen z ASC (5 min właściciela) przed zgłoszeniem oraz formalne zamknięcie decyzji o Ukrainie. **Rekomendacja: tak.**
6. **Mechanizm decyzji (507):** (a) pole „strażnik” przy każdej decyzji + test; (b) reguła i krok listy bez automatu. **Rekomendacja: (a)** + rozszerzenie limity-wydan.json.

Czas: praca agenta przy 501 + 503 + 504(b) ok. 2–3 h z testami; 505(a) ok. 1 h; 507 ok. 1–2 h. Czekanie: verify ok. 12 min, E2E pakiet podstawowy, nowy build TestFlight. Czas właściciela: krok T-11 ok. 10 min, eksport cen ok. 5 min, decyzje 1–6 ok. 15 min.

## Proponowane polecenie naprawy

`node tools/assemble.mjs 02-monetyzacja --tryb fix --zadania 02-monetyzacja-501,02-monetyzacja-503,02-monetyzacja-504,02-monetyzacja-505,02-monetyzacja-507` (po decyzjach 2–4 i 6). Wygląd stanu płacącego (504a) przekazać roli 04, a 502 i 506 zamyka właściciel krokami z sekcji decyzji.

Na końcu: `git status --porcelain` → pusty (dowody/git-status-koniec.txt).

### 03-zakres-002 · Decyzje właściciela przechodzą do kodu bez śladu wdrożenia i bez strażnika (K3, K1, kolejność planów z 23.10, brak wpisu z 27.10)
- Pozycja listy kontrolnej: ZAK-10
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: (1) K3 (`docs/18-przekazanie.md:470`): „Planowanie” w linii tytułu także na ekranie Trening — kod: przycisk nad tytułem `app/(tabs)/index.tsx:44`, w zakładce Plan w linii `app/(tabs)/history.tsx:39`; brak testu (dowody/decyzje-kod.txt). (2) K1 jedna nazwa "Pełna wersja" — tytuł ekranu zgodny (`app/_layout.tsx:119`), ale 5 tekstów mówi „Pro” (`app/paywall.tsx:66`, `components/FairRulesSheet.tsx:34`, `components/FairRulesSheet.tsx:37`, `components/ImportProCard.tsx:21`, `components/ImportProCard.tsx:22`); część tych tekstów właściciel zatwierdził 22.10 i 25.10 (`docs/18-przekazanie.md:442`, `docs/18-przekazanie.md:535`) — decyzje sprzeczne bez rozstrzygnięcia. (3) Kolejność planów z 23.10 (`docs/18-przekazanie.md:481`) z adnotacją o gałęzi wdrożenia — gałąź scaliła tylko test K9 (`git log 99563b1e^1..99563b1e^2` = 1 commit, dowody/decyzje-kod.txt), a istniejący test pilnował kolejności odwrotnej (`tests/m5s1-bez-proby.test.ts`); nikt tego nie wykrył przez 4 dni, aż właściciel zmienił decyzję 27.10. (4) Decyzji z 27.10 ~17:00 (kolejność zostaje) nie ma w docs/18 (2 wpisy z datą 27.10, oba o figurach).
- Wzorzec lub źródło: CLAUDE.md, „Decyzje produktowe należą do właściciela” i model pracy po L-001 (mechanizm, nie postanowienie); zasada wspólna 4 i 6.
- Kroki w aplikacji: ekran Trening (z planem) — przycisk „Planowanie” w innym miejscu niż w zakładce Plan; ekran zakupu i okno po pierwszym treningu — „Pro” obok "Pełna wersja".
- Opcje: (A) rejestr decyzji w formie danych (np. `docs/decyzje.json`: ID, data, treść, stan: do wdrożenia / wdrożone / zastąpione, commit, test) + strażnik w verify: decyzja „wdrożone” bez testu albo „do wdrożenia” starsza niż N dni bez zadania = błąd; docs/18 dalej jako dziennik — koszt: jednorazowe przeniesienie decyzji obszaru produktu, ok. 2–3 h agenta; (B) kolumna „wdrożenie: commit / test” przy każdej decyzji w docs/18 i krok listy kontrolnej wydania „decyzje bez wdrożenia” — tańsze, bez automatu; (C) bez zmian. Rekomendacja: (A), bo luka jest systemowa (ta sama droga dała K3, K1 i kolejność planów); przed 1.0 tylko (B) dla decyzji z 23–27.10 i dopisanie decyzji z 27.10.
- Test akceptacyjny: K3 wdrożone albo jawnie odwołane; jedna nazwa płatnej części rozstrzygnięta przez właściciela i pilnowana testem tekstów; decyzja z 27.10 w docs/18; strażnik (A) albo krok listy (B) działa.
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


### 08-programista-003 · Decyzje właściciela bez strażnika „decyzja → kod → test”: decyzja z 23.10 nie weszła do kodu, test pilnował starego stanu, zadania gałęzi zginęły
- Pozycja listy kontrolnej: brak pozycji DEV (E0b: brak; mechanizm pracy)
- Poziom: P2 (ocena zakresu: systemowa)
- Realność: realny (już wystąpił) · Pewność: wysoka
- Rodzaj: P (decyzja produktowa i procesowa)
- Dowód:
  - Decyzja z 23.10 (`docs/18-przekazanie.md:481` „kolejność planów **miesięczny, roczny, dożywotni**”) miała iść gałęzią `naprawa-m1-dec07-ui` razem z K1, K3, K9, ZK-05, ZK-06 i sprawdzeniem „Zarządzaj subskrypcją” w TestFlight (`docs/przekazanie-koordynatora-2026-10-23.md:48`).
  - Scalenie 99563b1e (25.10) zawierało jeden commit, tylko K9.
  - Kod został przy starej kolejności (`lib/products.ts:19` „export const PLAN_ORDER”), a test utrwalał stan sprzed decyzji (`tests/m5s1-bez-proby.test.ts:86` „kolejność planów bez zmian: roczny, miesięczny, dożywotni”).
  - Żaden dokument nie odnotował, że pozostałe pozycje nie weszły (`dowody/decyzja-kolejnosc-planow.txt`). Build 1031 trafił do właściciela niezgodny z jego decyzją, a zaplanowane sprawdzenie w TestFlight się nie odbyło (por. 001).
  - Sama kolejność nie jest znaleziskiem, bo 27.10 właściciel ją zatwierdził.
  - W pozostałych ok. 20 decyzjach z tabeli E0 strażniki istnieją, ale tylko dlatego, że ktoś je dopisał. Nic nie wymusza powiązania decyzji z testem.
- Wzorzec lub źródło: CLAUDE.md („Akcja ma być mechanizmem (test, strażnik w CI, krok listy kontrolnej…)”); zasada 2 i 4 wspólnych (rejestr, nie pamięć).
- Kroki w aplikacji: brak (proces). Skutek widać w aplikacji: kolejność planów w buildzie 1031 inna niż w zapisanej decyzji.
- Opcje: (a) Rejestr `decyzje-kod.json`: każda decyzja z docs/18 od dziś dostaje wpis {data, linia docs/18, pliki kodu, test-strażnik albo „bez kodu” z powodem}. Test w Jest sprawdza, że każda nowa pozycja „właściciel” w docs/18 ma wpis i że wskazany test istnieje. Kompromis: ok. 1 h pracy agenta i dyscyplina przy każdej decyzji, ale działa automatycznie. (b) Krok listy kontrolnej przy scalaniu gałęzi napraw: lista zadań gałęzi ze stanem (zrobione / przeniesione / porzucone, z datą) w opisie PR, a hak sprawdza obecność tej listy. Kompromis: tańsze, łapie zgubione zadania, ale nie decyzje spoza gałęzi. (c) Oba. Rekomendacja: (c). Najpierw (b) (kilka minut), (a) w 1.0.1.
- Test akceptacyjny: test-strażnik pada, gdy w docs/18 przybywa decyzja właściciela bez wpisu w rejestrze; PR gałęzi napraw bez listy zadań ze stanem nie przechodzi kontroli.
- Status: otwarte


### 10-wydanie-006 · Decyzja produktowa zapisana z „Wdrożenie: gałąź …” nie dotarła do kodu, a test pilnował starego stanu; brak mechanizmu „decyzja → wdrożenie” przed wydaniem
- Pozycja listy kontrolnej: WYD-15 (pominięcie w procesie wydania)
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: kod został przy kolejności rocznej, a test nazywa ją tak: `tests/m5s1-bez-proby.test.ts:86` „kolejność planów bez zmian: roczny, miesięczny, dożywotni”. Decyzja z 23.10 (kolejność miesięczny–roczny–dożywotni) kończy się wpisem o wdrożeniu na osobnej gałęzi: `docs/18-przekazanie.md:481` „Wdrożenie: gałąź naprawa-m1-dec07-ui”. Decyzja właściciela z 27.10 (~17:00) zastąpiła tę z 23.10 i zostawiła stan z kodu, więc sama kolejność nie jest znaleziskiem (polecenie M1); znaleziskiem jest mechanizm, który przepuścił rozjazd na build 1031.
- Wzorzec lub źródło: dla sklepu projekt ma już wzorzec strażnika decyzji: `store/asc-odpowiedzi.json` z testem `tests/store-asc-odpowiedzi.test.ts` (zgodność odpowiedzi z kodem).
- Kroki w aplikacji: nie dotyczy; skutek: tester widzi coś innego, niż właściciel postanowił, a test daje fałszywe potwierdzenie.
- Opcje: (a) krok listy przed wydaniem: agent wypisuje decyzje z docs/18 od poprzedniego wydania z „Wdrożenie: gałąź X” i sprawdza, czy X jest scalona do kandydata (skrypt `git merge-base --is-ancestor`); tanie, łapie niescalone gałęzie; (b) każda decyzja zmieniająca UI zakupu, sklepu albo danych dostaje test-strażnika z ID decyzji w nazwie, a test sprzeczny z nowszą decyzją zmienia się w tym samym commicie; pewniejsze, więcej pracy przy każdej decyzji. Rekomendacja: (a) od razu, (b) dla ekranu zakupu i formularzy sklepu.
- Test akceptacyjny: przed Z-29 wynik kroku (a) w docs/18 z datą: każda decyzja od 1030 ma stan „scalona w <SHA>” albo „zastąpiona przez <data>”.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- **T-11, ceny w USD przy arkuszu w PLN (potencjalnie P1, WYD-06/MON-10).** Sztuczny sklep ma te same kwoty w USD, ale build TestFlight ma strażnika `EXPO_PUBLIC_STORE_FAKE`, a arkusz zakupu pochodził z prawdziwego sklepu, więc sztuczny sklep jest mało prawdopodobny. Kod pokazuje wyłącznie cenę ze StoreKit: `lib/store-native.ts:52` „Wiersz z fetchProducts → produkt aplikacji (cena wyłącznie `displayPrice` Apple)”. Przyczyny nie da się ustalić bez urządzenia (zachowanie piaskownicy TestFlight albo regionu konta). Brak: odczyt na nowym buildzie na koncie z regionem PL i, po premierze, na koncie produkcyjnym; jeśli w produkcji też będzie USD przy płatności w PLN, to wprowadzająca w błąd cena (2.3.1(a): „promoting a false price”) i bloker. Krok właściciela: zrzut ekranu zakupu i arkusza na nowym buildzie, region Apple ID tego konta. Kwoty sztucznego sklepu: `lib/store-fake.ts:12`.
- **Etykieta „Data Not Collected” a wiadomość do wsparcia (WYD-08).** Stopka techniczna (wersja, iOS, język) jest generowana przez aplikację, wiadomość trafia do skrzynki dewelopera i jest przechowywana 12 miesięcy (polityka, `site/privacy.html`). Apple dziś: wyjątek wymaga spełnienia wszystkich warunków, w tym podania danych „in your app’s interface”, a tu formularzem jest aplikacja Poczta. Zasada roli 3: przy wątpliwości deklarować więcej. Właściciel wybrał A z zapasowym B (21.10, docs/45 i docs/48 pkt 3; odwracalne bez nowej wersji). Pewność, że to „collect” w rozumieniu Apple, ok. 60%. Patrz „Decyzje”.
- **Zegarek bez własnego manifestu prywatności (WYD-09).** Cel `pl.lukasz.trening.watchkitapp` używa `UserDefaults` („init(defaults: UserDefaults = .standard)”, `targets/watch-app/Core/WatchPersistence.swift:17`), a w `modules/` i `targets/` nie ma `PrivacyInfo.xcprivacy` (`dowody/manifesty-sdk.txt`). Wysyłki 1027, 1030 i 1031 przeszły, więc ASC tego nie odrzuca; nie wiem, czy Apple wysłało ostrzeżenie mailem. Krok właściciela: sprawdzić pocztę z App Store Connect po wysyłce 1031 (ITMS-91053). Tania poprawka: manifest w celu zegarka z `CA92.1`.
- **ATS w konfiguracji po wtyczkach.** Introspekcja pokazuje `NSAllowsArbitraryLoads: true` z wyjątkiem dla localhost (`dowody/introspect-wyciag.txt`), choć aplikacja nie łączy się z siecią. Nie wiem, czy to samo jest w `Info.plist` buildu Release (Linux tego nie sprawdzi). Krok: odczyt `Info.plist` z `.ipa` w następnym przebiegu `testflight.yml`; jeśli jest, rozważyć wyłączenie (P2, bez wpływu na recenzję wg dzisiejszych wytycznych).
- **Bramka 4 (CLAUDE.md, 27.10): recenzja ruchu i kart ćwiczeń przed wydaniem.** L-042 opisuje rundę 2 z dwoma błędami WYSOKIMI i poprawką w 025a50b9; nie znalazłem w repo zapisu wyniku niezależnej recenzji na kandydacie ani dla kart ćwiczeń wyświetlanych w 1.0. Obszar 06 (TRE). Wymaga potwierdzenia koordynatora przed Z-29.
- **T-04, największy rozmiar tekstu ucina ikony na ekranie Trening.** Obszar 04 (SP); dla tej roli wniosek tylko taki, że przy Z-33 nie deklarujemy „Larger Text” w etykietach dostępności, dopóki to nie jest naprawione.
- **„Pełna wersja” w Ustawieniach wygląda jak stan, nie przycisk (T-11).** Wiersz ma rolę przycisku i znak „›” (`components/SubscriptionCard.tsx:16`), a notatki dla recenzji prowadzą do niego wprost, więc ryzyko 2.1(b) uważam za niskie; ocena wyglądu należy do 04.
- **„Zarządzaj subskrypcją” w TestFlight otwiera listę produkcyjną bez zakupów testowych.** Wygląda na zachowanie systemu w piaskownicy, nie na błąd aplikacji (adapter woła tylko systemowy arkusz); potwierdzenie przy pierwszym zakupie produkcyjnym po premierze.
- **3.1.2(a) „ongoing value” dla aplikacji offline bez serwera.** Notatki argumentują regularnymi aktualizacjami i dają dożywotni jako alternatywę; ryzyko odrzucenia istnieje, dowodu nie mam. Plan po odrzuceniu: odpowiedź w Resolution Center z listą aktualizacji (przygotowuje agent).

## Co działa dobrze i należy zachować

- Poświadczenia: klucz API tylko w sekretach, plik klucza zapisywany tuż przed eksportem i usuwany, identyfikatory wycinane z logów przed artefaktem, brak `pull_request_target`; pełna historia czysta.
- Numer buildu z licznika przebiegów plus tag `v<wersja>-b<numer>` z mapą źródeł JS przy tagu: każdy build ma SHA.
- Strażniki na gotowym produkcie (uprawnienia w `.ipa`, manifest prywatności w pakiecie, zegarek w archiwum), a nie tylko na plikach konfiguracji.
- Teksty sklepu i notatki recenzji pilnowane testami względem kodu (etykiety przycisków, limity, liczby z `lib/access.ts`, adresy, odpowiedzi formularzy) oraz `check-urls.mjs` sprawdzający treść stron na żywo.
- Polityka prywatności opisuje każdą funkcję dotykającą danych (Zdrowie, zegarek, głos, kopie, powiadomienia, e-mail) i zgadza się z kodem.
- Plan wydania: 1.0 ręcznie po telefonie, aktualizacje stopniowo przez 7 dni z progami pauzy.

## Decyzje dla właściciela

1. **Który build idzie do recenzji (001).** (a) numer i SHA wpisane w Z-26 i sprawdzone przez agenta; (b) to samo plus wygaszenie 1031 w TestFlight po wgraniu nowego buildu. Rekomendacja: (b), kilka minut Twojego czasu, pomyłka staje się niemożliwa.
2. **Ekran zakupu po zakupie (002).** (a) ukryć plany i wstęp przy aktywnym dostępie, dożywotni osobno z ostrzeżeniem przed zakupem; (b) oznaczyć posiadany plan i dodać ostrzeżenie przed kupnem dożywotniego. Rekomendacja: (a). To naprawa przed zgłoszeniem; dotyczy wyglądu (04) i logiki (02/08).
3. **Podpisy zrzutów w 31 lokalizacjach (004).** (a) przekład podpisów przed Z-16; (b) podpisy EN wszędzie poza PL; (c) bez podpisów. Rekomendacja: (a), zapas (b).
4. **Etykieta prywatności (Do sprawdzenia).** (a) zostaje „Data Not Collected” (Twoja decyzja z 21.10), wariant B w zapasie; (b) zadeklarować teraz e-mail i treść wiadomości do wsparcia (cel: App Functionality, bez śledzenia): bezpieczniej wobec definicji Apple, etykieta mniej „czysta”. Rekomendacja tej roli: (b), bo zasada roli każe przy wątpliwości deklarować więcej, a zmiana nie wymaga nowej wersji. Decyzja należy do Ciebie i jest odwracalna.
5. **Mechanizm „decyzja → wdrożenie” (006).** (a) krok listy przed wydaniem (niescalone gałęzie decyzji); (b) testy-strażniki decyzji dla zakupu i sklepu. Rekomendacja: (a) teraz, (b) dla ekranu zakupu.

Kroki właściciela, których agent nie wykona (nie sprawdzono): rola klucza API w ASC; poczta z ASC po 1031 (ITMS-91053); stan produktów i notatek w ASC; ekran zakupu na nowym buildzie z regionem PL (T-11); lista z telefonu na nowym buildzie.

## Proponowane polecenie naprawy

`node tools/assemble.mjs 10-wydanie --tryb fix --zadania 10-wydanie-001,10-wydanie-003,10-wydanie-004,10-wydanie-005,10-wydanie-006`

10-wydanie-002 to kod aplikacji: naprawę zleca się rolom 02 i 08 (teksty i wygląd przez 04), np. `node tools/assemble.mjs 08-programista --tryb fix --zadania 10-wydanie-002`.

Czas: agent ok. 3–4 h łącznie (001, 003, 005, 006 ok. 1,5 h; 004 przekład ok. 1–2 h; 002 ok. 2–3 h po decyzji wyglądu); czekanie: nowy build `testflight.yml` ok. 1,5 h plus kolejka macOS, pełny katalog E2E ok. 1,5 h; właściciel: decyzje 1–5 ok. 20 min, telefon na nowym buildzie 30–45 min, App Store Connect (Z-14–Z-29) ok. 1 h.

`git status --porcelain` na końcu pracy: pusty (`dowody/git-status.txt`).

Zakres: tylko te ID. Każdy commit niesie w treści „[M1-audytor-generalny-009; 07-jakosc-005]”; commity na tę gałąź, push na nią, bez scalania z main. Raport i dowody tylko w katalogu --wyjscie (fix-2026-10-27), nie w katalogu audytu. Nowe problemy jako znaleziska.
Na koniec, do 25 linii: commity (SHA → ID), testy przed/po, pliki dowodów, zrzuty, przekazania do 08 i 07 (ID, plik, dokładna wartość z ID twierdzenia albo decyzji), co otwarte i dlaczego, kroki właściciela.
Plan E0 zatwierdził właściciel w planie M2 2026-10-27; na STOP nie czekasz. Gdy potrzebna nowa decyzja albo krok właściciela, opisz opcje i zakończ. Wynik zapisz w /home/user/trening/audit/M1-2026-10-27/role/07-jakosc/fix-2026-10-27/wynik.md
