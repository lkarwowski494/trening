# STAN partii P1 (tekst: squat i hinge, karty W1/W2) — linia 1.1

## Teraz
- 09.11.2026 runda 1 recenzji (badacz) naniesiona wg decyzji koordynatora 1–10 (docs/18 09.11): EliteFTS = 5 → sqc.chains/sqb.bands odrzucone; OHS sq.mis.heels ISSA + SBS (uproszczenie), ohs.setup skrócone; SLRDL (linki) uproszczenie wyciągu; Coach — kwalifikacje na stronie autora; Chains/Bands sq.mis.heels ACE + SBS (bez ExRx); Hack sq.mis.roundBack → otwarte; brzmienie cdl.setup EN, slrdl.move PL. Stan: **9 kart, 8 zdań, 14 źródeł**, odrzucone 15. P-8 (Clean Deadlift „drugie źródło przeczy standardowi”) — takiego zdania w STAN-P1 nie było; w p1-klucze miejsce Catalyst ma „błąd = zaprzeczenie standardu” (reguła uzupełnienia 2, nie sprzeczność źródeł). Następny krok: runda 2 (badacz) i recenzja PL/EN; gałąź czerwona wg A2.
- 09.11.2026 (sesja chmurowa, programista): gałąź `tekst/p1-squat-hinge` od `origin/integracja-1-1` (0e881c5). Dane P1: **9 kart z 17** — Clean Deadlift, Single Leg RDL (hantel), Single Leg RDL (linki), Barbell Hack Squat, Bodyweight Squat, Dumbbell Squat, Overhead Squat, Squat with Chains, Squat with Bands; 10 zdań PL/EN, 16 źródeł (fixture `tests/fixtures/cues-p1-squat-hinge.json`, test `tests/zrodla-pelne-cues-p1-squat-hinge.test.ts`, zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-11-09-p1-wskazowki.json`, lista dla recenzentów `p1-klucze.json`, wpis docs/18 09.11).
- Niewdrożone (bez błędu z 2 organizacjami; zostaje zestaw ogólny z animowanym błędem): SLDL, Smith SLDL, Deficit, Sumo (kettlebell), Axle, Cable (Bells of Steel = 5), Zercher, Double KB Front Squat. Błędy bez pozy rigu odrzucone: slrdl.mis.hipOpen, ohs.mis.armsForward.
- 09.11.2026: koordynator przyjął wariant A (squat, hinge w `v2` w recenzja-wyjatki-1-1.json, asercje stanu zależne od listy; decyzja w docs/18) — e3c80049.
- **Bloker 2 (raport do koordynatora 09.11.2026):** test-fast --od-bazy (222 pliki) + ponowienie 12 padłych na e3c80049: 21 testów czerwonych w 11 plikach. (1) Skutek ukrycia rodzin squat/hinge do recenzji różnicy: maestro-flows 17-biblioteka-technika i 57-grafika-cwiczenia (Back Squat bez rysunku — także prawdziwe E2E), maestro-57-bramka, spojnosc-karta-rysunek (5 rodzin/132), figury-recenzja N1, strona-eksport (`pelna`), pokrycie-katalogu zapadka (figura.v2 126<132, animowanyBlad 73<124, wskazowki.zTekstem 280<298, …). (2) Skutek karty ukrytej do przekładu (zestaw ogólny zastąpiony, karta własna niewidoczna — 9 ćwiczeń traci wskazówki w aplikacji do przekładu): figures-v2-nakladka-fix4 (Single Leg RDL), nakladka-squat-hinge W4' (Hack bez mis.roundBack), karty-recenzja (zestaw Barbell Hack Squat), zrodla-pelne-cues-a2-nogi:53 (strażnik A2: Overhead/Clean/… bez kart własnych), wybor-testow-l103 (+1), strona-eksport (słownik en +10). Nie przepisuję strażników przed decyzją (ryzyko osłabienia; reguła „dwa podejścia”).
- 09.11.2026 koordynator: **wariant A2** — gałąź czerwona do recenzji (audytor: różnice doboru i ślad; badacz: 9 kart; lokalizacja PL/EN) i ręcznego przekładu 10 zdań (tłumacz albo właściciel; nie ZB-054); nie scalać przed zielonym tests.yml. Po wynikach: poprawki rundy 1 i jeden commit strażników (2) i zapadki pokrycia z powodami.
- Lista 21 czerwonych testów (e3c80049; (1) ukrycie rodzin squat/hinge, (2) karta ukryta do przekładu zastępuje zestaw ogólny):
  - (2) `tests/figures-v2-nakladka-squat-hinge.test.tsx` — etap 2 po scaleniu E3: kolor błędu linii odniesienia i brak dwóch linii w tym samym miejscu (recenzja 2R P1: W4', S1) › W4': linia pleców (backLine) jest w kolorze błędu …
  - (1)+(2) `tests/strona-eksport.test.ts` — eksport dla strony: pole `pelna` = standard 1 „Pełna karta” liczony tą samą funkcją co licznik pokrycia (decyzja właściciela 02.11.2026, S6/F-20, wariant A) › każde ćwicz…
  - (2) `tests/strona-eksport.test.ts` — eksport dla strony: brak przekładu zdania = brak zdania, nigdy tekst angielski ani polski (K-13) › prawdziwy słownik: po przekładzie 52 zdań wersji 1.1 (ACG-003, 31.10.20…
  - (1) `tests/figury-recenzja.test.tsx` — zapis recenzji (docs/research/figury-recenzja.json) › N1 (recenzja 1R runda 2, 04.11.2026): każda linia odniesienia i element techniki użyte przy ćwiczeniu rodziny X poch…
  - (1)+(2) `tests/pokrycie-katalogu.test.ts` — pokrycie katalogu: zapadka (nie spada) › bieżące „dobre” liczby ≥ minimum zapisane w tests/fixtures/pokrycie-katalogu-min.json
  - (1)+(2) `tests/pokrycie-katalogu.test.ts` — pokrycie katalogu: zapadka (nie spada) › scenariusz: wzrost nie jest naruszeniem; nowa metryka bez minimum jest zgłoszona
  - (1)+(2) `tests/pokrycie-katalogu.test.ts` — pokrycie katalogu: zapadka (nie spada) › scenariusz: obniżka minimum bez powodu jest wykryta, z powodem — dozwolona
  - (2) `tests/wybor-testow-l103.test.ts` — L-103: prawdziwe repo — zmiana pliku z katalogu czytanego przez join › G3/L-100: rozszerzenie wzorca nie dokłada testów dla docs/research (pomiar 04.11.2026: 20 i 29 prze…
  - (2) `tests/karty-recenzja.test.tsx` — zapis recenzji treści kart (M1-audytor-generalny-038, DEC-10 a, 28.10.2026) › wpis „wyswietlana” ⇒ skrót = skrót bieżących wskazówek (zmiana tekstu bez nowej recenzji cze…
  - (1) `tests/maestro-57-bramka.test.ts` — 57 przy prawdziwej bramce 4 › stan danych (02.11.2026): squat i pull_up w v2 (zmiana któregokolwiek wymaga zmiany 57)
  - (1) `tests/maestro-57-bramka.test.ts` — 57 przy prawdziwej bramce 4 › stary 57 (twarde kroki Pull-Up z f77db9b) przechodzi przy pull_up w v2
  - (1) `tests/maestro-57-bramka.test.ts` — 57 przy prawdziwej bramce 4 › nowy 57 przechodzi
  - (1) `tests/spojnosc-karta-rysunek.test.ts` — spójność karty z rysunkiem (decyzja 04.11.2026, A) › dane: zakres to 5 rodzin gotowych; każda ma wyświetlane ćwiczenia (132) i reguły
  - (1) `tests/spojnosc-karta-rysunek.test.ts` — spójność karty z rysunkiem (decyzja 04.11.2026, A) › niezmiennik: wyjątki mają powód, są prawdziwe (użyte) i dotyczą wyświetlanych ćwiczeń; cue_wariant null ma powód
  - (1) `tests/spojnosc-karta-rysunek.test.ts` — spójność karty z rysunkiem (decyzja 04.11.2026, A) › dane: klucze cue_wariant wskazują wyświetlane ćwiczenie z zakresu i regułę, która do niego należy (wpis martwy czerwi…
  - (1) `tests/spojnosc-karta-rysunek.test.ts` — spójność karty z rysunkiem (decyzja 04.11.2026, A) › strażnik wykrywa lukę: zestaw bez zdania reguły (symulacja — zdanie usunięte z karty) daje wynik niepusty, wyjątek z …
  - (2) `tests/zrodla-pelne-cues-a2-nogi.test.ts` — A2 nogi: karty własne › rodziny squat i hinge (ready, zrecenzowane zestawy ogólne) bez kart własnych z tej partii — pokrycie „Pełna karta” nie spada
  - (2) `tests/figures-v2-nakladka-fix4.test.tsx` — R1 (fix4): element nakładki tylko z regułą wariantu o pewności „ustalone” › scenariusz: Single Leg RDL (hantel) i (linki) — karta ma rdl.dbMove, ale wariant jednonóż ma w…
  - (2) `tests/figures-v2-nakladka-fix4.test.tsx` — R1 (fix4): element nakładki tylko z regułą wariantu o pewności „ustalone” › macierz: różnica między „wskazówka na karcie” a „element rysowany” to dokładnie te dwa ćwiczen…
  - (1) `tests/maestro-flows.test.tsx` — scenariusze Maestro na drzewie dostępności (EN, en-US) › 17-biblioteka-technika.yaml
  - (1) `tests/maestro-flows.test.tsx` — scenariusze Maestro na drzewie dostępności (EN, en-US) › 57-grafika-cwiczenia.yaml
- tests.yml gałęzi będzie czerwony (świadomie, do decyzji).
- Następny krok: czekać na wyniki recenzji od koordynatora → poprawki rundy 1 → commit strażników → test-fast, verify:lekkie, push, tests.yml zielony.

## Otwarte po P1
- Chains/Bands: zdanie o zawieszeniu łańcuchów / zaczepieniu gum — drugie źródło szczebla 4 (EliteFTS = 5, runda 1).
- Pozy rigu dla błędów z 2 organizacjami: `slrdl.mis.hipOpen` (Single Leg RDL), `ohs.mis.armsForward` (Overhead Squat) — zmiana silnika (errors.ts, plik wspólny) poza partią tekstu.
- Drugie źródła szczebla 4: SLDL `mis.barAway`, Axle `mis.barAway`/`dl.mis.hipsFirst`, Zercher `sq.mis.chestDrop`, DKBFS `kbfs.mis.drop`, Cable Deadlift (ustawienie wyciągu — tylko blog producenta), Sumo (kb) `mis.roundBack` (tylko NASM).

## Narzędzia
- Python w katalogu roboczym sesji (`<SCRATCH>/tools`, poza repo): `import_p1.py` (bloki W2 i W1-przeliczenie, filtr ≥ 2 organizacje szczebla ≤ 4, błąd tylko z pozą rigu, karta tylko z błędem), `post_p1.py` (figures.json open, wskazowki-ogolne, cue-sets own, karty_nowe), `fx_p1.py` (fixture, zestaw przekładu), `klucze_p1.py` (+ `dobor.mjs` — różnica doboru względem bazy). Kolejność: import → post → `node scripts/cues/gen.mjs` → `node scripts/zrodla-runtime.mjs --write` (2×) → `node scripts/figures/gen.mjs` → fx → `UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts` → klucze.

## Pułapki
- Skrót recenzji rodziny v2 zawiera WYNIK doboru po kartach z pełnych danych (bez bramki ukrycia) — karta własna w rodzinie rigowej zmienia skrót nawet ukryta.
- Single Leg RDL ma rysunek v2 (hinge, styl singleLeg) — dobór bez zmian względem zestawu ogólnego.
