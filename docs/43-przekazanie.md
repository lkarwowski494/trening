# 43. Przekazanie pracy (stan 20.10.2026, ok. 19:30 UTC) — na nowe konto Claude

Powód: limit tygodniowy konta koordynatora na wyczerpaniu (decyzja właściciela 20.10.2026: drugie konto). Ten plik + CLAUDE.md + docs/18 + docs/40 wystarczą do kontynuacji.

## Stan
- Gałąź **`audyt-m1`** (HEAD 590f7fc): naprawy M2 audytu M1 z 19.10.2026 — partie 1–4 (70 zadań minus 026/029/030/036 przekazane do M3) + LOK-07 (System miar, mile/jardy, domyślnie z regionu) + poprawki E2E (13/31/36, slotHeight). Pełne verify jednym ciągiem: EXIT 0 (8367 testów).
- **Nie scalone do main.** PR jeszcze nie otwarty — czeka na zielone E2E.
- Gałąź `m3-wejscie/029-ikony`: materiał (WIP ikon) dla M3 — nie scalać.
- Statusy zadań M2 i paczka audytu: tylko lokalnie u właściciela / w katalogu `audit/` (poza repo, publiczne repo). Werdykt M1: P0 001 i 011 — naprawione w partiach 1–2.

## Co biegnie / co zrobić najpierw (koordynator)
1. E2E na `audyt-m1` (od 13:00 UTC brak maszyn macOS u GitHuba, ponawiane ~12×): run **39427683836** (pakiet podstawowy z testem aktualizacji; wejście `poprzednia_wersja_z_przebiegu=39409052958`) i **39427688524** (`tylko_scenariusze` 09 11 15 19 32 35 37, `poprzednia_wersja_z_przebiegu=brak`). Przy „not acquired by Runner” — ponawiać (`gh run rerun <id>`), skrypt `scratchpad`-owy watch-run nie przeżyje zmiany konta.
2. Dowód 058 (mały ekran): `e2e-ios.yml`, `tylko_scenariusze: 01`, `urzadzenie: 'iPhone SE|iPhone 16e|iPhone 17e'`, `poprzednia_wersja_z_przebiegu: brak` — w logu „Ekran: … szerokość ekranu N pt”; jeśli 390 pt, zapytać właściciela, czy wystarczy.
3. Plik poprzedniej wersji (062): artefakt `trening-sim-app` z run **39409052958** (build 0.20 b1018 na tagu `v0.20.0-b1018`) wygasa ok. 21.10 11:00 UTC. Jeśli wygaśnie: `gh workflow run e2e-ios.yml --ref v0.20.0-b1018 -f tylko_scenariusze=01`. Sesja Claude Code nie może tworzyć wydań (403) → krok właściciela K-062 niżej.
4. Po zielonym E2E: PR `audyt-m1` → `main` (opis: partie, przebiegi dowodowe, ryzyka R-004…R-012 z docs/40), właściciel: K-062, potem scalenie. Po scaleniu `testflight.yml` (bramka E2E czeka na zielony pakiet na tym SHA).
5. Potem: przegląd treści krytycznej w 34 językach (R-010) — wyłącznie Claude (rola tlumacz + badacz), teksty „do przeglądu tłumacza” z partii; przegląd badacza: rejestr twierdzeń (docs/research/rejestr-twierdzen.json), zdanie asekuracji (docs/10), R1 i docs/10 pkt 4.4.
6. Potem: **M3 Redesigner w nowej sesji czatu** z najświeższego `lkarwowski494/prompts` (`git pull`, `node tools/assemble.mjs M3-redesigner --galaz redesign/trening-<data> --plik m3.md`), wejścia obowiązkowe: 026, 029 (+gałąź m3-wejscie/029-ikony), 030, 036, DEC-05 (głos domyślnie wył.), DEC-06 (bez paska talerzy), DEC-28/29 (system miar).
7. Potem: jeden reaudyt końcowy (M1, nowy LOK-07), kontrola na telefonie (R-004 powiadomienie pilne, głos, mile, nowe ekrany), zrzuty i opis sklepu, 1.0.

## Kontekst i plan całości (przeczytaj najpierw)
**Cel:** wydać aplikację Trening (iOS + Apple Watch, Expo/React Native, 35 języków, bez konta, dane tylko na telefonie) w App Store jako **1.0** „w pełnym standardzie”. Właściciel: Łukasz (nie ekspert dziedzinowy, nie używa Terminala). Studio: Apps4Brew (strona apps4brew.com/trening/ — polityka prywatności i wsparcie już opublikowane; osobne repo strony studia).

**Model monetyzacji (STAŁY, nie proponować zmian):** 0,99 USD/mies., **6,99 USD/rok**, 14,99 USD dożywotnio; 14 dni oferty wprowadzającej; po niej 4 treningi/mies. za darmo. Zakupy włączane od 1.0.

**Droga do App Store (kolejność ustalona z właścicielem):**
1. Naprawy audytu M1 (M2) na `audyt-m1` → PR → `main` → TestFlight. ← *tu jesteśmy (kroki 1–6 niżej)*
2. **M3 Redesigner** (biblioteka `lkarwowski494/prompts`, najświeższa wersja przy starcie) w nowym czacie: AS IS na działającej aplikacji (zrzuty/nagrania z E2E w CI + nagrania z telefonu właściciela), propozycje TO BE do decyzji właściciela (STOP-y), projekt od zera, wdrożenie partiami, weryfikacja. Obowiązkowe wejścia: zadania audytu 026 (układ Postępów), 029 (ikony zamiast emoji; WIP na gałęzi `m3-wejscie/029-ikony`), 030 (duży tekst, Large Content Viewer), 036 (tokeny pisma i promieni); głos domyślnie wyłączony (DEC-05); brak paska talerzy (DEC-06); System miar (DEC-28/29).
3. **Jeden reaudyt końcowy** (M1, z nowym LOK-07 — systemy miar) po M3; naprawy tym samym procesem (M2).
4. Pełny katalog E2E w trybie ścisłym (bramka App Store, CLAUDE.md) + 3 czyste noce.
5. **Kontrola na telefonie** (lista „tylko telefon”): powiadomienie „pilne” w trybie skupienia (R-004), głos, mile/jardy, nowe ekrany, Apple Watch, Zdrowie, zakup w piaskownicy (K-012).
6. Zrzuty do sklepu (ciemny motyw, ramki i podpisy, 9 ekranów wg scenorysu z 19.10; generator `store-screenshots.yml`) i opis sklepu (docs/15) — **dopiero po M3**; akceptacja właściciela (podpisy EN też).
7. App Store Connect (kroki właściciela niżej: cena 6,99, oferta 14 dni, adres polityki, etykieta prywatności, ankieta wiekowa), migracja repo do organizacji **Apps4Brew** (właściciel: puste repo + sekrety), wersja **1.0** („Co nowego” czyszczone), wysłanie do Apple, ręczne wydanie po akceptacji, wydanie stopniowe wg docs/42.

**Otwarte u właściciela (poza listą kroków):** Google Workspace (w toku, sekcja „W toku u właściciela”), próg i data premiery dla decyzji o Androidzie (docs/wzrost.md), ewentualny przegląd sekretów GitHub (K-019).

**Gdzie co jest:** decyzje z datą → docs/18; lekcje i rejestr ryzyk (otwarte blokują wydanie) → docs/40; wymagania (BRD) → docs/brd; plan wydania 1.0 → docs/42; droga do sklepu → docs/41 (gałąź f020-sklep, częściowo na main); ceny → docs/monetyzacja.md; języki → docs/16 i docs/lokalizacja; research konkurencji i rejestr decyzji merytorycznych → Google Drive „Trening App” (nie w repo). Backlog bez priorytetu → docs/21 (wspominać tylko zbiorczo).

## Podział między konta (decyzja właściciela 20.10.2026)
- **Obecne konto** domyka kroki 1–6 z listy „Co biegnie / co zrobić najpierw” (E2E → PR i scalenie → TestFlight → dowody → przegląd tłumaczeń przez API → przegląd badacza) i **nie zaczyna kroku 7 (M3) ani dalszych**.
- **Nowe konto** zaczyna od pierwszego niezakończonego kroku według sekcji „Dziennik przekazania” niżej (normalnie od kroku 7: M3 w nowym czacie).
- Ten plik jest aktualizowany po każdym kroku (sekcja „Dziennik przekazania”).

## Pierwsza wiadomość dla nowego konta

**Aktualny, pełny prompt startowy: `docs/44-prompt-nowe-konto.md` (21.10.2026) — ma pierwszeństwo przed krótką wersją niżej.**
 (wklej w Claude Code w chmurze, repo lkarwowski494/trening)
```
Jesteś koordynatorem projektu Trening (rola z CLAUDE.md). Kontynuujesz pracę po poprzednim koncie.
Przeczytaj: CLAUDE.md, docs/43-przekazanie.md (stan, dziennik przekazania, kolejne kroki), końcówkę docs/18 i rejestr ryzyk w docs/40.
Pobierz najnowszy stan: git fetch, gałąź main; dziennik jest na main.
Zacznij od pierwszego niezakończonego kroku w „Dzienniku przekazania” w docs/43, potem prowadź mnie dalej po jednym kroku.
Odpowiadaj po polsku.
```

## Dziennik przekazania (aktualizowany po każdym kroku)
| data i godzina (UTC) | krok | stan |
|---|---|---|
| 20.10 19:30 | 1. E2E na audyt-m1 | w toku — brak maszyn macOS u GitHuba od 13:00 UTC, ponawiane |
| 20.10 20:15 | 5. przegląd tłumaczeń przez API | w toku — programista przygotowuje skrypt i workflow na gałęzi `przeglad-tlumaczen` (decyzje: Opus effort medium, limit 50 USD/przebieg, auto-reload w konsoli wyłączony); właściciel: sekret `ANTHROPIC_API_KEY` w GitHub (instrukcja po gotowym workflow) |
| 20.10 20:40 | 5. przegląd tłumaczeń przez API | właściciel dodał sekret `ANTHROPIC_API_KEY` (osobny klucz „Trening — przegląd tłumaczeń”); konsola Anthropic: brak metody płatności, limit wydatków 200 USD, auto-reload wyłączony — przekroczenie kredytów niemożliwe. Przy migracji repo do Apps4Brew dodać ten sekret ponownie. |
| 20.10 21:00 | 5. przegląd tłumaczeń przez API | workflow `przeglad-tlumaczen.yml` + `scripts/i18n/przeglad-api.mjs` scalone do `audyt-m1` (342 zdania × 34 języki; szacunek: Opus 5.5 effort medium, batch ≈ 8,7 USD, przebieg dowodowy `limit=2` ≈ 0,5 USD). Uruchomienie możliwe dopiero po scaleniu PR do main. Kolejność: szacunek → `limit=2` → pełny → raport do tłumacza, zdanie asekuracji do badacza. Inne repozytoria właściciela: nocne testy wyłączone (20.10). |
| 20.10 21:10 | zgody z góry (właściciel) | do końca kroków 1–6 koordynator może bez pytania: (1) przegląd tłumaczeń przez API (szacunek → limit 2 → całość, ≤ 50 USD/przebieg), (2) **scalić PR audyt-m1 → main sam**, gdy E2E i verify zielone i właściciel zrobił K-062 (wyjątek od „scalenie tylko na polecenie właściciela”, dotyczy tych PR), (3) poprawki po przeglądach tłumacza i badacza na osobnej gałęzi + PR do main (scalenie jak w 2, po testach i pakiecie podstawowym E2E), (4) ponowienia i przebiegi dowodowe CI. Zgody nie obejmują kroku 7+ (M3) ani K-062 (wydanie na GitHubie robi właściciel — sesja nie ma uprawnień). |
| 20.10 21:25 | K-062 | ZROBIONE przez właściciela: wydanie `v0.20.0-b1018` (pre-release) z `Trening-sim.zip` 33 036 227 B (zgodny z artefaktem run 39409052958). Test aktualizacji w E2E na main może brać poprzednią wersję z pliku wydania. |
| 21.10 | wyjątek „ton trenera” (właściciel) | decyzja: wskazówki techniki (`lib/cues`) zostają w formie „ty”; ekrany i komunikaty formalne (docs/16, docs/18). Poprawione zdania UI w formie „ty” (sztuk): bg 70, cs 62, el 160, hr 80, hu 83, lt 67, lv 65, pt 59, ro 80, sk 62, sl 63, sr 68, uk 37 — lista z raportu API plus przegląd własny wszystkich kluczy. Do sprawdzenia przez native speakera: el (cały rejestr zmieniony z „ty” na „wy”), hu, lt, lv, ro. |
| 20.10 23:40 | 1. E2E na audyt-m1 | maszyna przyszła ok. 22:40 UTC; pakiet podstawowy (run 39427683836) CZERWONY: 09 (asercja „Settings”, 2×), test aktualizacji 33/34 (scenariusz na starej wersji 0.20 szuka „Measurement system”, a stara ma „Weight unit”), 01 raz (przeszedł po ponowieniu). Tester E2E naprawia na gałęzi `audyt-m1-e2e2` z szybkim przebiegiem „09 33 34 01”; potem scalić do audyt-m1 i powtórzyć pakiet podstawowy. Mechanizm testu aktualizacji z pliku wydania zadziałał („Poprzednia wersja: 0.20.0”). |
| 21.10 02:10 | 1. E2E na audyt-m1 | poprawki scenariuszy 09, 32, 33/34 (gałąź audyt-m1-e2e2, szybkie przebiegi zielone) scalone do audyt-m1 (2673817), pełne verify zielone (8415 testów); pakiet podstawowy E2E na audyt-m1 w toku (run 39528479670, poprzednia wersja z pliku wydania). Lekcja L-011 w docs/40. Kolejno: zielony → PR → scalenie → TestFlight → przegląd tłumaczeń przez API. |
| 21.10 02:45 | 2. PR i scalenie | E2E pakiet podstawowy na audyt-m1 zielony (run 39528479670; test aktualizacji z pliku wydania v0.20.0-b1018 — dowód DEC-27; scenariusz 52 przeszedł po ponowieniu). PR #14 audyt-m1 → main scalony przez koordynatora (zgoda właściciela), merge 0fd4687. Na main ruszyły: TestFlight (run 39534334516, bramka czeka na E2E 39534334502), Testy, Pages. **Dalsza praca od main** (gałąź audyt-m1 zakończona). |
| 21.10 03:00 | 5–6. przegląd tłumaczeń i badacza | przegląd API: szacunek 9,37 USD; dowód limit=2 (0,52 USD) OK; pełny batch `msgbatch_01HsrjDsBkKt9AEzypNeYU3Y` (34 języki): 54 uwagi krytyczne + ok. 230–260 uwag „forma ty zamiast formalnej” w 12 językach (bg, cs, el, hr, hu, lt, lv, pt, ro, sk, sl, sr, uk) — wskazówki techniki są po „ty”, a docs/16 mówi „formalny jak w iOS”: **DO DECYZJI WŁAŚCICIELA** (opcje: wskazówki formalnie wszędzie vs wyjątek „ton trenera — ty” dla wskazówek). Tłumacz nanosi krytyczne i merytoryczne poprawki na gałęzi `poprawki-tlumaczen` (bez masowej zmiany rejestru). Badacz (asekuracja, R1, ACSM 2026, T-005/T-039) na gałęzi `przeglad-badacza`; pozostałe ok. 36 wpisów rejestru twierdzeń — otwarte. TestFlight z main czeka na E2E (run 39534334502). |
| 21.10 04:35 | 3–6 | E2E z main (39534334502) zielone, bramka TestFlight przepuściła (dowód M1-018), build w toku (run 39534334516). Tłumacz: 53/54 krytycznych, 513 innych poprawek (commit 874f5c7). Badacz: raport `docs/research/przeglad-badacza-2026-10-21.md`; brzmienia naniesione (asekuracja „sprzęt i osoba asekurująca” NSCA 2017; R1 „za mało dowodów”; rejestr T-005, T-039, nowy T-040; Smith — nie dotyczy). Gałąź `poprawki-tlumaczen` → E2E pakiet podstawowy w toku → PR → scalenie (zgoda). **Otwarte:** decyzja właściciela o rejestrze „ty” we wskazówkach (13 języków, ok. 3000 zdań); nowe zdanie asekuracji i R1 w 33 językach bez drugiej recenzji — powtórzyć przegląd API przed App Store; ok. 36 wpisów rejestru twierdzeń bez przeglądu badacza; native speaker: lista w docs/16. |
| 21.10 05:30 | **kroki 1–6 ZAKOŃCZONE na tym koncie** | PR #14 (naprawy M2) i PR #15 (poprawki tłumaczeń + badacz + dziennik) scalone do main (8484125). TestFlight **build 1022** wysłany (bramka E2E zadziałała, wydanie v0.20.0-b1022 z mapą źródeł i Trening-sim.zip); push PR #15 uruchamia kolejny build. **Nowe konto zaczyna od kroku 7 (M3 w nowym czacie).** Otwarte, do zrobienia przed App Store (nie blokują M3): (a) **decyzja właściciela**: wskazówki techniki w 13 językach (bg, cs, el, hr, hu, lt, lv, pt, ro, sk, sl, sr, uk; ok. 3000 zdań) — forma „ty” vs formalna z docs/16 (opcje: wszystko formalnie przez przegląd/poprawki API vs zapisany wyjątek „ton trenera — ty” dla wskazówek); (b) powtórny przegląd API dla nowych zdań (asekuracja, R1) w 33 językach — przed App Store; (c) ok. 36 wpisów rejestru twierdzeń (T-001–T-004, T-006–T-038) bez przeglądu badacza; T-003 (ACSM 2009, 2–10%) nie sprawdzone (płatny dostęp); (d) native speaker: lista w docs/16; (e) przebiegi dowodowe: 058 mały ekran (`tylko_scenariusze: 01`, `urzadzenie: iPhone SE|iPhone 16e|iPhone 17e`), 055 nocne mutacje, 057 strefy, 056 trzy noce `losowe`; (f) ryzyka R-004…R-012 w docs/40. |
| 21.10 07:30 | przekazanie | pełny prompt startowy w `docs/44-prompt-nowe-konto.md`; PR #17 (wyjątek „ton trenera” + ok. 1000 formalnych tekstów ekranów w 13 językach + wiersz b1022 w docs/09) czeka na E2E (run 39555291208) i scalenie — pierwsze zadanie nowego konta, jeśli nie scalone. |
| 21.10 08:05 | nowe konto: start, PR #17 | PR #17 był już scalony (07:52, 69988ea); na main biegną E2E pakiet podstawowy (run 39565108193, maszyna przydzielona), Testy (39565108298), TestFlight (39565108351, czeka na bramkę E2E). Czerwony tests.yml po PR #16 (39549939632) = niestabilny test `health-query` (losowe id „8432ed24-…”), poprawka + lekcja L-012 na gałęzi `claude/optimistic-clarke-9tj0im`. tests-tz czerwony tylko na starej gałęzi `feature/e2-swap` (−0 vs 0; na main już poprawione). |
| 21.10 08:15 | 7. M3 Redesigner | sesja M3 założona przez koordynatora („Trening — M3 Redesigner (redesign/trening-2026-10-21)”), prompt składany w sesji z najświeższego `prompts` (97ec212 lub nowszy); wejścia: 026, 029 (+`m3-wejscie/029-ikony`), 030, 036, DEC-05, DEC-06, DEC-28/29, wyjątek „ton trenera”. Czeka na STOP 1 (decyzje właściciela, m.in. bramka opłacalności — W0 brak). Nocny przebieg 21.10: mutacje i E2E mały ekran/ciemny czerwone — analiza tester-e2e w toku. |
| 21.10 11:10 | koordynacja | PR #18 scalony (8763e58: test Zdrowia, Stryker, noc tylko main, worktree poza lint/Jest/tsc, R-011 zamknięte, decyzje 21.10 w docs/18). Na main E2E (39578800712) → TestFlight (39578800586, PR #17 + #18). Agenci: tester-e2e (17e), programista (zgłoszenie z nocy), badacz (rejestr twierdzeń). Kolejka prac koordynatora w tym pliku; przegląd koordynatora co godzinę (docs/18). M3 w swojej sesji za STOP 2 (decyzje właściciela). |

## Kolejka prac koordynatora (stan bieżący; właściciel 21.10.2026: koordynator sam rozdziela pracę i przekazuje ją między agentami)
Przegląd co godzinę (zaplanowane zadanie „Trening: koordynator — przegląd co godzinę”, docs/18) bierze stąd następne zadanie, gdy obszar plików jest wolny.

| # | zadanie | rola / model | obszar plików | stan |
|---|---|---|---|---|
| 1 | Scenariusze E2E na iPhone 17e (klawiatura nad wierszem wyniku; 12, 31) + strażnik + przebieg dowodowy | tester-e2e / sonnet | `.maestro/`, `tests/maestro-*` | w toku (gałąź `e2e-maly-ekran`) |
| 2 | Zgłoszenie (issue) z czerwonej nocy + przebieg dowodowy | programista / sonnet | `nightly.yml`, `scripts/ci/nocny-raport.mjs`, `tests/nocny-raport*` | w toku (gałąź `nocny-raport`; PR z workflowem → zgoda właściciela) |
| 3 | Przegląd ok. 36 wpisów rejestru twierdzeń (T-001–T-038), T-003 | badacz-merytoryczny / opus | `docs/research/` | **zrobione 21.10** (912c123: 34 potwierdzone, 3 do zmiany brzmienia T-002/T-003/T-032; T-041 Helms i in. 2016 + wzorzec cytatu „i in. RRRR” w `claims.mjs`) |
| 4 | Ciemny motyw w nocnym E2E rzeczywiście ciemny (L-013 akcja 4) | tester-e2e / sonnet | `.maestro/`, `e2e-ios.yml` | czeka na 1 i 2 (te same pliki) |
| 5 | Wdrożenie brzmień z przeglądu badacza: T-002, T-003, T-032 (+ opcjonalnie T-021, komentarz T-008) w 35 językach + `claims.mjs --rehash` (raport `docs/research/przeglad-badacza-2026-10-21b.md`) | tlumacz / sonnet | `lib/i18n*`, `lib/locales/` | czeka na scalenie M3 (teksty UI) |
| 6 | Powtórny przegląd tłumaczeń przez API (asekuracja, R1 + nowe teksty M3) | koordynator (workflow) | — | po M3 (jeden przebieg dla wszystkich nowych zdań) |
| 7 | Przebiegi dowodowe przed App Store: 3 czyste noce pełnego katalogu (tryb ścisły), strefy (`tests-tz.yml`) | koordynator | — | po 1, 2 i 4 |
| 8 | Hak pre-push (lint + check:readme + check:matrix, `prepare`) + krok „sprawdź tests.yml po wypchnięciu” w `.claude/agents/*.md` (L-009; decyzja właściciela 21.10 w sesji M3, b78ddb3) | programista / sonnet | `scripts/hooks/`, `package.json`, `.claude/agents/` | w toku (gałąź `hak-pre-push`) |
| 9 | Po TestFlight: lista „telefon zaraz po buildzie” (R-004 i lista „tylko telefon”) | koordynator → właściciel | — | po buildzie z main 8763e58 |
| — | **Obszar M3** (gałąź `redesign/trening-2026-10-21`, partie p1–p6): `app/`, `components/`, `lib/` (theme, ekrany, teksty, słowniki), ikony, zegarek, `docs/design/`, `docs/32`, `docs/m3-stan.md`; scenariusze `.maestro/` po scaleniu main (ustalone z M3 21.10) | M3 | — | koordynator tu nie wchodzi |
| 10 | Po kroku 4 (M3 scalone, brzmienia, przegląd tłumaczeń): **pełny głęboki audyt M1 całej aplikacji** (z LOK-07) + naprawy blokerów (M2) — decyzja właściciela 21.10 | M1 / M2 | — | po 5 i 6 |
| 11 | Po audycie: 3 czyste noce (tryb ścisły), telefon, zrzuty i opis sklepu, App Store Connect, migracja do Apps4Brew, 1.0. **M4 dopiero po wydaniu** (zakres 1.0 zamrożony) | wydawca / właściciel | — | po 10 |

## Zasady pracy obowiązujące (skrót; pełne w CLAUDE.md i docs/18)
- Podział pracy na agentów według obszaru plików (CLAUDE.md, 20.10.2026); pliki generowane i pełne verify raz po scaleniu.
- Oszczędzanie limitu (docs/18, 20.10.2026): lżejsze modele dla ról wykonawczych, pakiet podstawowy E2E zamiast pełnego katalogu (pełny tylko przed App Store/po M3), jeden reaudyt, zwięzłe raporty, logi CI tylko filtrem.
- Właściciel: po polsku, decyzje produktowe z ≥2 opcjami (AskUserQuestion), zadania dla niego po jednym z instrukcją krok po kroku; nie używa Terminala.
- Zaplanowane zadania: dla Treningu brak aktywnych (lista w docs/18, 20.10.2026).

## W toku u właściciela
- Google Workspace (po weryfikacji DSA 20.10.2026): domena apps4brew.com w Porkbun, poczta dziś = przekierowanie Porkbun na prywatny Gmail (nikt jeszcze nie pisze). Krok 2 (rekord TXT weryfikacji Google w Porkbun) wydany; następny: MX Google (`smtp.google.com`, priorytet 1) zamiast przekierowania Porkbun + SPF `v=spf1 include:_spf.google.com ~all`, użytkownik `lukasz@`, aliasy `support@`, `kontakt@`. Nie ruszać rekordów A/CNAME strony.

## Kroki właściciela (kopia z katalogu audytu)
# Kroki właściciela — partia 2 napraw z audytu M1 (20.10.2026)

Kroki robisz Ty (ja ich nie wykonuję). Jedno zadanie naraz; po każdym napisz „zrobione” albo wklej, co widzisz na ekranie.
Model monetyzacji jest stały: 0,99 USD/mies., roczna i dożywotnia wg App Store Connect (patrz uwaga o cenie rocznej na końcu), próba 14 dni, 4 treningi w miesiącu po wygaśnięciu.

## K-011. App Store Connect: oferta wprowadzająca 14 dni w obu subskrypcjach (M1-011)

Kod i plik testowy `store/Trening.storekit` mówią już „14 dni” (2 tygodnie). W App Store Connect oferta ma być identyczna, bo to ona decyduje o tym, co Apple pokaże i naliczy.

1. Wejdź na https://appstoreconnect.apple.com i zaloguj się.
2. Moje aplikacje (My Apps) → Trening.
3. Lewe menu → sekcja „Monetization” → „Subscriptions”.
4. Otwórz grupę „Pełna wersja”.
5. Kliknij subskrypcję **miesięczną**.
6. Przewiń do sekcji „Subscription Prices” → obok niej „Introductory Offers” (Oferty wprowadzające) → ikona plusa „+” (albo „Create Introductory Offer”).
   - Jeśli oferta „1 miesiąc” już istnieje: kliknij ją, a następnie „Edit”/„Delete” i utwórz nową. Apple nie pozwala zmienić długości istniejącej oferty — usuń starą (jeśli nikt jeszcze z niej nie skorzystał) i dodaj nową.
7. Ustaw: Countries or Regions = wszystkie (All), Start Date = dzisiaj, End Date = bez daty końca (No End Date), Type = „Free” (Bezpłatna), Duration = **„2 Weeks” (2 tygodnie)**.
8. Zapisz („Confirm”/„Save”).
9. Wróć do grupy „Pełna wersja”, otwórz subskrypcję **roczną** i powtórz kroki 6–8 (ten sam typ „Free”, czas „2 Weeks”).
10. Sprawdź na liście obu subskrypcji: w kolumnie ofert wprowadzających ma być „Free, 2 Weeks”.

## K-012. Test w piaskownicy: dostęp po ponownej instalacji (M1-012)

Test na iPhonie, wymaga builda z TestFlight z włączonymi zakupami (obecny build ma zakupy wyłączone, więc test zrobisz dopiero po włączeniu).

1. App Store Connect → Users and Access → „Sandbox” → „Test Accounts” → „+”: utwórz konto testowe (dowolny adres e-mail, którego nie używasz w Apple ID; hasło zapisz).
2. Na iPhonie: Ustawienia → App Store → na samym dole „Sandbox Account” → zaloguj kontem testowym.
3. Zainstaluj build z TestFlight, otwórz Trening → ekran zakupu → kup dożywotni (okno Apple powie „Sandbox”).
4. Sprawdź, że w Trening → Więcej → Subskrypcja widać „Masz dostęp na zawsze”.
5. Usuń aplikację z telefonu (przytrzymaj ikonę → Usuń aplikację).
6. Włącz tryb samolotowy (Centrum sterowania → samolot).
7. Zainstaluj aplikację ponownie z TestFlight (potrzebna sieć na czas pobrania — pobierz najpierw, potem włącz tryb samolotowy) i otwórz ją.
8. Oczekiwany wynik: aplikacja odczytuje zakup z urządzenia i pokazuje pełną wersję (bez ekranu zakupu przy starcie treningu), albo — jeśli Apple nie odpowiada — po wejściu w „Przywróć zakupy” po wyłączeniu trybu samolotowego.
9. Wynik zapisz: „dostęp był od razu” / „dopiero po Przywróć zakupy” / „brak dostępu”.

## K-013. Polityka prywatności: adres w App Store Connect (M1-013)

Aplikacja linkuje teraz do https://apps4brew.com/trening/privacy.html (sprawdziłem 20.10.2026: strona odpowiada, ma sekcję Apple Watch i wersję 0.20.0). Adres w App Store Connect musi być identyczny.

1. App Store Connect → Moje aplikacje → Trening → lewe menu „App Information”.
2. Pole „Privacy Policy URL” ma być: `https://apps4brew.com/trening/privacy.html`. Jeśli jest inne (np. adres z github.io), zamień i kliknij „Save”.
3. W zakładce wersji aplikacji: „Support URL” `https://apps4brew.com/trening/support.html`, „Marketing URL” `https://apps4brew.com/`.
4. Uwaga na przyszłość: od teraz test pilnuje, żeby data wersji w `site/privacy.html` nie była niższa niż wersja z `app.json`. Przy każdym podniesieniu wersji trzeba zaktualizować stronę i opublikować ją w repo strony studia (eksport: `scripts/site/export-apps4brew.mjs` na gałęzi `f020-sklep`, po jej scaleniu).

## K-019. Ustawienia GitHub: skanowanie sekretów, środowisko „release”, sekrety (M1-019)

Robisz jedno po drugim w repozytorium GitHub → Settings.

**A. Skanowanie sekretów i ochrona wypychania**
1. Settings → (lewe menu) „Code security” (albo „Advanced Security”).
2. „Secret scanning” → Enable. „Push protection” → Enable.

**B. Środowisko „release” z zatwierdzeniem**
1. Settings → Environments. Jeśli „release” już jest (powstaje samo przy pierwszym przebiegu `testflight.yml` z nowego kodu) — kliknij je; jeśli nie — „New environment”, nazwa `release`, „Configure environment”.
2. „Required reviewers” → zaznacz → wpisz swoje konto → „Save protection rules”.
3. Skutek: każdy przebieg TestFlight zatrzymuje się przy zadaniu „build” i czeka na Twoje „Approve” (po przejściu bramki E2E). Przebiegi dowodowe też.
4. (Opcjonalnie, później) Przenieś `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` z „Repository secrets” do „Environment secrets” środowiska release, wtedy tylko zatwierdzone zadanie je widzi. Zrób to dopiero po udanym przebiegu dowodowym.

**C. Usunięcie nieużywanych sekretów**
1. Settings → Secrets and variables → Actions → „Repository secrets”.
2. Przy `EXPO_TOKEN`, `ASC_API_KEY_P8` i `APPLE_TEAM_ID` (jeśli są na liście) kliknij kosz → „Remove secret”. Zostają tylko `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`.

**D. Ochrona gałęzi main (M1-018)**
1. Settings → Branches → „Add branch ruleset” (albo „Add classic branch protection rule”), gałąź `main`.
2. Zaznacz „Require status checks to pass” i dodaj sprawdzenie z workflowu „Testy” (zadanie `verify`); „Block force pushes”.
3. Zapisz („Create”).

## Uwaga o cenie rocznej (do potwierdzenia przez koordynatora)
Polecenie partii 2 podaje „6,99 USD/rok”, a kod, plik `store/Trening.storekit`, docs/15 i decyzja z 13–14.10.2026 mają **4,99 USD/rok** (6,99 to cena z 11.10.2026, zastąpiona 13.10.2026). Cen nie zmieniałem. Jeżeli stałą ceną rocznej ma być 6,99, to osobna decyzja i zmiana (kod, ASC, testy) — daj znać.

## K-CENA. App Store Connect: cena roczna 6,99 USD (decyzja 20.10.2026)

Kod, plik testowy `store/Trening.storekit` i dokumenty mówią już 6,99 USD/rok. W App Store Connect cena subskrypcji rocznej ma być taka sama. Jedno kliknięcie po drugim:

1. https://appstoreconnect.apple.com → Moje aplikacje (My Apps) → Trening.
2. Lewe menu → „Monetization” → „Subscriptions” → grupa „Pełna wersja”.
3. Otwórz subskrypcję **roczną**.
4. Sekcja „Subscription Prices” → „Current Pricing for New Subscribers” → „Edit” (albo „+ / Add Subscription Price”).
5. Kraj bazowy: Stany Zjednoczone (United States), cena **6,99 USD** (wybierz punkt cenowy 6.99). Zostaw włączone automatyczne przeliczenie na inne kraje (Apple wylicza resztę z ceny bazowej).
6. Kliknij „Next”, potem „Confirm”. Przy pytaniu o obecnych subskrybentów wybierz „Do not preserve current price” — jest to cena przed premierą, nikt jeszcze nie subskrybuje (jeśli nie ma takiej opcji, pomiń).
7. Ceny w Polsce, strefie euro i Wielkiej Brytanii: sprawdź, czy po przeliczeniu EUR i GBP wyszło 6,99 (jeśli nie — popraw ręcznie na 6,99 € / 6,99 £); PL zostaje 19,99 zł.
8. Napisz „zrobione” albo wklej, co widzisz w kolumnie ceny roczna.

---

# Kroki właściciela — partia 4 napraw (programista B, 20.10.2026)

Jedno zadanie naraz; odpowiedz krótko (litera opcji albo „zrobione”).

## K-P4-1. Decyzja o Androidzie po 8 tygodniach: metryka, próg, data (M1-072)

W `docs/wzrost.md`, sekcja 5, są trzy opcje metryki i pola do wpisania. Model płatności zostaje stały (żadna opcja go nie dotyka).

1. Wybierz metrykę: **A** pobrania miesięcznie z App Store Connect (prosta, ale mówi o sile wersji iOS, nie o Androidzie); **B** odsetek kupujących po 14 dniach próby (bliżej przychodu, ale przy małej liczbie pobrań próba będzie za mała); **C** zgłoszenia użytkowników o Androidzie (bezpośrednio o Androidzie, ale zgłasza ich niewielu). Rekomendacja: A jako główna, C jako uzupełnienie.
2. Podaj próg dla wybranej metryki (liczbę). W dokumencie jest tylko kandydat z 06.10.2026: „100 pobrań miesięcznie” — to był cel wzrostu, nie próg dla Androida. Nie wpisuję liczby za Ciebie.
3. Podaj planowaną datę premiery (z niej wyliczam datę oceny: premiera + 56 dni).
4. Odpowiedz np. „A, próg 100, premiera 15.11.2026”; agent wpisze to do docs/wzrost.md.

## K-P4-2. Drugi przegląd tłumaczeń przed wydaniem w App Store (ryzyko R-010, M1-049)

Treść krytyczna (zdanie medyczne, asekuracja, wskazówki techniki) ma w 34 językach tylko kontrolę automatyczną (docs/16, sekcja „Treść krytyczna”). Ryzyko R-010 w docs/40 blokuje wydanie w App Store (TestFlight nie). Wybierz drogę:

1. **A — przegląd przez Gemini** (masz subskrypcję): przygotuję prompt z listą zdań i prośbą o ocenę poprawności i formy (vous/siz w fr i tr); wynik sprawdzi badacz. Szybko i bez kosztu, ale to nadal model, nie native speaker.
2. **B — native speakerzy dla wybranych języków** (np. największe rynki): wolniej i z kosztem, ale to jedyna kontrola poza modelem.
3. **C — wydanie 1.0 w mniejszej liczbie języków** (pozostałe po przeglądzie): najbezpieczniejsze, ale zmienia zakres wydania.
Rekomendacja: A teraz (tanio, od razu), B dla języków z największą liczbą spodziewanych użytkowników. Napisz literę.

## K-P4-3. Wynik bramki W0 (jeśli istnieje)

Jeśli masz wynik bramki W0 (raport roli 02 u Ciebie), wklej go albo podaj miejsce; wpiszę go jako informację w `docs/monetyzacja.md` (nie zmienia modelu). Jeśli nie ma — napisz „brak”, zostaje oznaczenie [DO USTALENIA].

## K-P4-4. Plan wydania 1.0 (docs/42): przeczytaj i zatwierdź

1. Otwórz `docs/42-plan-wydania-1.0.md` (5 części, ok. 5 minut).
2. Sprawdź punkt 4 „Zły build” i napisz, czy zgadzasz się z kolejnością kroków.
3. Dwie rzeczy zostawiłem otwarte dla Ciebie: progi „stop” dla wydania stopniowego (ile zgłoszeń wstrzymuje etapowanie) oraz czy i jak informować użytkowników przy złym buildzie.

## K-062. Wydanie v0.20.0-b1018 z plikiem Trening-sim.zip (przed scaleniem PR M2)
Sesja koordynatora nie może tworzyć wydań na GitHubie (403). Bez tego pliku pierwsze E2E po scaleniu (test aktualizacji 33–34) padnie i zablokuje TestFlight.
1. github.com/lkarwowski494/trening → Actions → przebieg E2E na tagu v0.20.0-b1018 (run 39409052958) → sekcja Artifacts → pobierz „trening-sim-app” (zip; w środku jest Trening-sim.zip — rozpakuj RAZ, żeby mieć plik Trening-sim.zip). Artefakt żyje 1 dzień — inaczej koordynator zbuduje go ponownie.
2. Code → Releases → Draft a new release → Choose a tag: v0.20.0-b1018 → tytuł „0.20.0 (build 1018)” → przeciągnij Trening-sim.zip → zaznacz „Set as a pre-release” → Publish release.
