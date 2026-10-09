# 30. Cel „Ogólny” w generatorze (trening dla zdrowia i sprawności) — przegląd źródeł i wdrożenie (09.10.2026)

Zlecenie: czwarty cel generatora „Ogólny” (trening ogólnorozwojowy, dla zdrowia i sprawności) dla 1–6 dni w tygodniu; uwagi pod celem
przy małej liczbie dni. Dokument uzupełnia `docs/research/22-serie-deload-generator.md` (nie powtarza jego tabel; odwołania „22/7a” itd.)
i `docs/research/29-jeden-dzien-tygodniowo.md` (1 dzień w tygodniu). Szkic z 09.10.2026 przeniesiony do repo przy wdrożeniu.

Metoda: teksty pobrane samodzielnie. **PT** = przeczytany pełny tekst, **CZ** = przeczytana część dokumentu (wskazane strony/tabele),
**A** = przeczytane streszczenie. Szczeble jak w CLAUDE.md (S1–S5). „Jedno źródło” = brak niezależnego potwierdzenia.

Zastrzeżenia o niezależności:
- **WHO 2020 i PAG 2018 (USA) nie są w pełni niezależne**: WHO korzystało z przeglądów przygotowanych dla komitetu PAG 2018, zaktualizowanych
  o nowe wyszukiwania (Bull 2020, podziękowania: „the systematic reviews of evidence prepared for 2018 US Physical Activity Guidelines Advisory
  Committee Scientific Report … were updated”). Liczone razem jako „WHO/PAG” przy regułach aktywności; ACSM to inna organizacja.
- **ACSM 2011 (Garber) i ACSM 2026 (Currier)** to ta sama organizacja, ale inne zespoły i inne metody (2011 — kategorie dowodów NHLBI,
  2026 — przegląd 137 przeglądów). Zgodność ACSM z WHO/PAG = dwie niezależne organizacje.
- ACSM 2011 przeczytany z kopii 6 stron (s. 1334–1336 z tabelami 1–2 i s. 1342–1345: trening oporowy, rozciąganie, neuromotoryka); reszta
  dokumentu (np. tabela intensywności) nieprzeczytana.

## 0. Stan: decyzje właściciela i wdrożenie (09.10.2026 wieczór, docs/18)

Właściciel (sprawy produktowe; merytorykę rozstrzyga hierarchia źródeł): wszystkie wybrane dni **siłowe** (1–6) + przełącznik „Dni cardio w planie”
(wariant B z sekcji 2, domyślnie wyłączony, tylko przy 4–6 dniach), **2 serie**, **bez rozciągania i równowagi** (pytanie o wiek → backlog);
„nie blokujmy 4–5 sesji siłowych” — przy 4+ dniach podział góra/dół jak przy masie. Wdrożenie (`lib/generator.ts`, `app/generator.tsx`):

| Parametr | Wdrożone | Podstawa / status |
|---|---|---|
| Dni | 1–6, wszystkie siłowe (`GEN_SESSIONS.general`) | G1, G19 (1 dzień — z uwagą); decyzja właściciela (więcej niż 3 dni siłowe dozwolone — G2 mówi o braku dowodu korzyści, nie o szkodzie) |
| Podział 1–3 dni | każda sesja = pełne FBW ze wszystkimi głównymi partiami (sesja `fbw`), nie dzień po dniu, gdy się da (`assignDays`/`bestDays`) | G1, G3 (pełna siłownia, 60/90 min: każda partia ≥ 2 dni przy 2–3 dniach — tests/gen-general.test.ts; przy 45 min część partii tylko pomocniczo — ostrzeżenie `rare`; FBW A/B masy ma zawias tylko w B), G10 — **uproszczenie** (≥ 48 h — jedno źródło); ta sama sesja co trening — konwencja |
| Podział 4–6 dni | góra/dół jak masa | decyzja właściciela; konwencja generatora (docs/24) |
| Przełącznik cardio | 4–6 dni: dni powyżej `GENERAL_LIFT_MAX` = 3 to sesje umiarkowanego cardio (długość = czas sesji — konwencja); które dni — najmniej par dzień po dniu (`assignDays`) | G2 (WHO c5, ACSM 2011 2–3 dni), G11, G12, G13 (osobne dni) |
| Serie | `GENERAL_SETS` = 2 (dolna granica `GENERAL_SETS_RANGE` 2–3) | G6 — część wspólna 2–3, „2” = uproszczenie |
| Powtórzenia | 8–12, w domu 12–20 (te same `REPS.gym` / `REPS.home` i ta sama reguła domu co masa) | G7 — 8–12 potwierdzone; 12–20 = **uproszczenie** w zakresie 8–20 |
| Wysiłek | słownie: „do chwili, gdy kolejne powtórzenie byłoby trudne — zmęczenie, ale nie wyczerpanie; do upadku nie trzeba” (także notatka szablonu) | G8 — opis potwierdzony; bez liczby RIR (jedno źródło na liczbę) |
| Przerwy | 120 s wielostawowe, 90 s jednostawowe i core (`REST`) | G9 — **uproszczenie** (rozbieżność źródeł) |
| Bój 4–6, kreska 10 serii | brak (`below10` = [] jak przy sile) | ciężkie 4–6 nie jest zaleceniem dla zdrowia; 10 serii — próg przerostu (ACSM 2026), nie zalecenie zdrowotne |
| Ostrzeżenia | `missing`, `rare` (WHO: ≥ 2 dni), `pairs`; „oneday” — tekst dla zdrowia (niżej); bez `unloaded`, `loadcap` (dotyczą ciężkich serii celu „Siła”) i `below` | G1; sekcja 3 |
| Cardio w podglądzie | „Cardio w planie: X min tygodniowo” + zalecenie WHO 150–300 / 75–150 min i „liczy się też ruch w ciągu dnia” (także 0 min) | G11 (WHO_MODERATE, WHO_VIGOROUS) |
| Rozciąganie, równowaga | nie ma | G15 — jedno źródło (PAG: korzyści nieznane); G17 — tylko 65+ |

## 1. Reguły dla treningu „ogólnego” — tabela

| # | Reguła | Źródła (szczebel, odczyt) | Status |
|---|---|---|---|
| G1 | Ćwiczenia wzmacniające **wszystkie główne grupy mięśni co najmniej 2 dni w tygodniu** | WHO 2020 (S2, PT, c1); PAG 2018 (S2, CZ, c2); ACSM 2026 (S2, PT, c3); ACSM 2011: każda główna grupa 2–3 dni/tydz., kat. A (S2, CZ, c4) | **potwierdzone** (WHO/PAG + ACSM) |
| G2 | Więcej niż 2–3 dni siłowe nie daje udowodnionej dodatkowej korzyści **zdrowotnej** | WHO 2020: brak dowodów dawka–odpowiedź dla większej ilości ćwiczeń wzmacniających (c5); ACSM 2011: „2–3 d·wk” (c4) | potwierdzone kierunkowo (brak dowodu korzyści ≠ dowód braku); górna granica „3” = ACSM 2011 |
| G3 | Główne grupy = nogi, biodra, plecy, klatka, brzuch, barki, ramiona | PAG 2018 s. 60 (c6); ACSM 2011 s. 1343: „chest, shoulders, back, hips, legs, trunk, and arms” | **potwierdzone** (dwie organizacje) |
| G4 | Wystarczy pokryć 4 obszary: góra/dół × pchanie/ciągnięcie (opcjonalnie 6: + poziomo/pionowo w górze) | ACSM 2026 (c7) — „in the view of the authors”, bez porównań w badaniach | **jedno źródło (opinia autorów)** — zgodne z G3 |
| G5 | Ćwiczenia wielostawowe + jednostawowe dla ważnych grup (brzuch, prostowniki grzbietu, łydki…); mięśnie przeciwstawne | ACSM 2011 s. 1343 (CZ) | jedno źródło; R7 z dok. 22 (Haugen 2023 i in.) potwierdza bazę wielostawową |
| G6 | **Serie na ćwiczenie: 1 seria działa, 2–3 zwykle lepiej**; zalecenie: co najmniej 2 | PAG 2018: „one set of 8 to 12 … effective, although 2 or 3 sets may be more effective” (c8); ACSM 2011: 2–4 serie, pojedyncza seria skuteczna u początkujących i starszych, kat. A (c4); ACSM 2026: co najmniej 2 serie (22/7g) | **potwierdzone: część wspólna 2–3**; „co najmniej 2” — ACSM 2026 |
| G7 | **Powtórzenia: 8–12** dla większości dorosłych; u starszych/początkujących i bez dużego ciężaru więcej (10–15, 10–20) | PAG 2018 (c8); ACSM 2011 tab. 2, kat. A (c4) i s. 1343 (10–20 u starszych, słabszych); ACSM 2026: dawne zalecenie 8–20 (c9), a przerost w szerokim zakresie 30–100% 1RM (22, sekcja 1) | **8–12 potwierdzone** (PAG + ACSM); 12–20 „w domu” = uproszczenie mieszczące się w 8–20 |
| G8 | **Wysiłek**: „umiarkowany lub większy”, do momentu, gdy kolejne powtórzenie byłoby trudne; zmęczenie, ale nie wyczerpanie; „high effort” | WHO 2020 (c1); PAG 2018 (c8); ACSM 2011 s. 1343 (c10); ACSM 2026: „high effort”, cel 2–3 RIR, dokładnego RIR nie ustalono (c3, 22/7d) | opis wysiłku **potwierdzony** (trzy dokumenty, dwie organizacje); **liczba RIR 2–3 = jedno źródło (ACSM 2026)** |
| G9 | Przerwy między seriami: w programie ogólnym 2–3 min | ACSM 2011, kat. B (c11); ACSM 2026: przerwa nie zmienia przyrostu siły, dla przerostu „insufficient data” (22/7e); Singer 2024: korzyść > 60 s (22) | **rozbieżność / jedno źródło na liczbę** → uproszczenie „zwykle 1,5–2 min” (jak REST) |
| G10 | Między sesjami tej samej partii ≥ 48 h | ACSM 2011 tab. 2, kat. A, i s. 1343 („48 to 72 h”) (c12) | **jedno źródło** (ACSM 2026: przy równej objętości częstotliwość 1 vs > 5 dni/tydz. nie zmienia przerostu — c13) → nazwane uproszczenie: FBW nie dzień po dniu |
| G11 | Aerobowa: **co najmniej 150–300 min umiarkowanej albo 75–150 min intensywnej** tygodniowo; liczy się każdy odcinek; „mniej niż nic” — każda ilość lepsza niż nic | WHO 2020 (22/7f, c14); PAG 2018 (c15); ACSM 2011: ≥ 150 min/tydz. (c16) | **potwierdzone** |
| G12 | Aerobową najlepiej **rozłożyć na co najmniej 3 dni** | PAG 2018 s. 57 (c17); ACSM 2011: umiarkowana ≥ 5 dni albo intensywna ≥ 3 dni (c16) | potwierdzone (dwie organizacje; liczby „3” i „5” różne — część wspólna: kilka dni, nie jeden) |
| G13 | Siłowe i cardio w **tej samej sesji**: przyrost mięśni i siły maksymalnej nie słabnie; słabnie siła eksplozywna (głównie w tej samej sesji) | Schumann 2022 (S2, PT, c18); Petré 2021 (S2, PT: osłabienie 1RM nóg tylko u wytrenowanych i tylko w tej samej sesji, c19); ACSM 2026: „insufficient data” dla tej samej sesji (c20) | **potwierdzone kierunkowo dla przerostu i siły u niewytrenowanych**; ACSM — brak danych → ostrożnie |
| G14 | Kolejność w jednej sesji: najpierw siłowe, potem cardio | Eddens 2018 (S2, PT): lepsza dynamiczna siła nóg, bez różnicy dla przerostu i tkanki tłuszczowej (c21); Schumann 2022: brak efektu kolejności dla siły eksplozywnej (c18) | **rozbieżność** → część wspólna: „najpierw siłowe” niczego nie pogarsza; nazwać konwencją z uzasadnieniem |
| G15 | Rozciąganie: **≥ 2–3 dni/tydz.**, seria ćwiczeń na główne grupy, ok. 60 s na ćwiczenie, zwykle ~10 min, najlepiej na rozgrzanych mięśniach | ACSM 2011 tab. 2 (kat. B/C) i s. 1344 (c22) | **jedno źródło (ACSM)**; PAG 2018: „appropriate part … even though their health benefits are unknown”, nie liczy się do zaleceń (c23); WHO 2020: brak zalecenia dla ogółu dorosłych |
| G16 | Długie statyczne rozciąganie tuż przed wysiłkiem siłowym może chwilowo obniżyć siłę (≥ 60 s na grupę); rozciąganie w rozgrzewce z dalszą częścią dynamiczną — bez znaczenia | Behm 2016 (S2, A, c24); ACSM 2011 s. 1344: „can have a negative effect on subsequent muscle strength and power” | potwierdzone kierunkowo (dwie niezależne grupy) |
| G17 | Równowaga / trening wieloskładnikowy: **dla osób 65+**, ≥ 3 dni/tydz. (WHO); dla młodszych skuteczność nieustalona | WHO 2020 (c25); PAG 2018 (osoby starsze, c26); ACSM 2011: neuromotoryka 2–3 dni, u starszych kat. B, u młodszych kat. D (c27) | potwierdzone **tylko dla starszych** |
| G18 | Rozgrzewka przed siłowym zwykle = te same ćwiczenia z mniejszym ciężarem | PAG 2018 s. 61 (c28); ACSM 2011 tab. 1: rozgrzewka może zmniejszać ryzyko, kat. C | potwierdzone kierunkowo (opis praktyki w zaleceniach) |
| G19 | Początek: można zacząć od **1 dnia** siłowego w tygodniu i dojść do 2 i więcej | PAG 2018 s. 62 (c29); WHO 2020: zacząć od małych ilości i stopniowo zwiększać (c30) | **WHO/PAG** (nie w pełni niezależne); ACSM — brak wprost |

## 2. Propozycja parametrów celu „Ogólny” (szkic przed decyzją — stan wdrożenia: sekcja 0)

| Parametr | Propozycja | Uzasadnienie / status |
|---|---|---|
| Dni siłowe | **min(n, 3)**, sesje FBW (każda sesja = wszystkie główne partie) | G1 (≥ 2), G2 (WHO: brak dowodu korzyści z więcej; ACSM 2011: 2–3), G3; FBW, bo przy 2–3 dniach tylko on daje każdą partię ≥ 2 dni — reszta to **konwencja** |
| Układ dni siłowych | 1: [pon]; 2: FBW A/B pon–czw; 3: FBW A/B/A pon–śr–pt (jak dziś) | G10 (≥ 48 h — jedno źródło, uproszczenie); już działa `bestDays` |
| Dni cardio | **n − 3** dla n = 4–6 (osobne sesje umiarkowanego cardio, długość = czas sesji, jak przy redukcji) | G11, G12; osobny dzień = najbezpieczniej wg G13 (ACSM 2026 „brak danych” dla tej samej sesji); długość = **konwencja** |
| Cardio w sesji siłowej (n = 1–3) | **opcja**: krótki blok cardio na końcu sesji siłowej (np. 15/20/30 min przy 45/60/90 min — **konwencja**, liczba do decyzji) | G13, G14: przy celu zdrowotnym siła eksplozywna nie jest celem; kolejność „najpierw siłowe” = część wspólna |
| Serie na ćwiczenie | **2** (wariant B: 3 jak dziś) | G6: 2 = dolna granica części wspólnej (ACSM 2026 „co najmniej 2”, ACSM 2011 2–4, PAG 1 lub 2–3); zostawia czas na więcej ćwiczeń i cardio |
| Powtórzenia | **8–12** (siłownia), **12–20** bez obciążenia zewnętrznego (jak REPS.home) | G7 (8–12 potwierdzone); 12–20 = uproszczenie w zakresie 8–20 (dawne zalecenie ACSM) i zgodne z ACSM 2026 (lżej, gdy blisko upadku) |
| Wysiłek (opis) | „Do chwili, gdy kolejne powtórzenie byłoby trudne; zwykle {2}–{3} powtórzenia w zapasie; do upadku nie trzeba” | G8: opis potwierdzony; liczby = RIR_ACSM (ACSM 2026, jedno źródło na liczbę — tak też opisane) |
| Przerwy | wielostawowe **120 s**, jednostawowe i core **90 s** (REST.multi / REST.iso), AVG_REST 105 | G9: uproszczenie (ACSM 2011: 2–3 min; ACSM 2026: przerwa nie zmienia siły) |
| Kolejność ćwiczeń | wielostawowe najpierw, potem jednostawowe (sloty FBW bez zmian); bez „boju głównego” 4–6 | G5; ciężkie 4–6 nie jest zaleceniem dla zdrowia (ACSM 2011: ≥ 80% 1RM tylko dla doświadczonych, kat. A) |
| Liczba ćwiczeń | z budżetu czasu (jak dziś), wszystkie MAJOR w każdej sesji FBW; ostrzeżenie, gdy partii brak | G1, G3, G4; dawne zalecenie ACSM „8–10 ćwiczeń” (c9) tylko informacyjnie — budżet czasu to **uproszczenie** |
| Kreska 10 serii/partię | **nie pokazywać** dla „Ogólnego” (jak przy sile) | 10 serii to próg przerostu (ACSM 2026), nie zalecenie zdrowotne |
| Rozgrzewka | WARMUP_MIN bez zmian; tekst: „lżejsze serie tych samych ćwiczeń” | G18 |
| Rozciąganie | **opcjonalna** informacja (po treningu ok. 10 min, ok. 60 s na ćwiczenie); bez długiego rozciągania statycznego przed seriami — **odrzucone przez właściciela 09.10** | G15 (jedno źródło — ACSM; PAG: korzyści zdrowotne nieznane), G16; **nie** jako twierdzenie o zdrowiu ani o zapobieganiu kontuzjom (ACSM 2011: brak spójnego związku) |
| Równowaga | nie dodawać teraz (generator nie zna wieku) — otwarte | G17 |
| Informacja o aktywności | podgląd: „Cardio w planie: X min/tydz. Zalecenie: co najmniej 150–300 min umiarkowanego lub 75–150 min intensywnego wysiłku — liczy się też ruch poza planem (np. szybki marsz)” | G11 (WHO_MODERATE, WHO_VIGOROUS już w kodzie) |
| GEN_SESSIONS | `general: [1, 2, 3, 4, 5, 6]` | 1 dzień dozwolony z uwagą (pkt 4), bo G19 |

Przykład tygodni (wariant rekomendowany, 60 min): 1 dzień — FBW A (+ blok cardio); 2 — FBW A, FBW B; 3 — FBW A/B/A;
4 — 3 × FBW + 1 cardio; 5 — 3 × FBW + 2 cardio; 6 — 3 × FBW + 3 cardio (FBW nigdy dzień po dniu, cardio w dni między nimi).

### Opcje dla aerobowej części planu (decyzja produktowa)
- **A (rekomendacja):** n ≤ 3 — tylko sesje siłowe + informacja o minutach ruchu poza planem; n ≥ 4 — nadwyżka dni ponad 3 to dni cardio.
  Plusy: zgodne z G2 (więcej dni siłowych nie daje udowodnionej korzyści zdrowotnej) i G12 (aerobowa w kilku dniach); oddzielne sesje —
  bez sporu o tę samą sesję (G13, ACSM „brak danych”). Minusy: przy 1–3 dniach plan sam nie dochodzi do 150 min.
- **B:** jak A + blok cardio na końcu każdej sesji siłowej (n ≤ 3). Plusy: więcej minut w planie. Minusy: mniej czasu na serie; długość bloku
  i łączenie w sesji — konwencja / dowody tylko z metaanaliz o przeroście i sile (nie o zdrowiu); więcej kodu (nowy rodzaj pozycji w szablonie).
- **C:** tylko informacja o 150–300 min, bez dni cardio. Plusy: najprostsze. Minusy: przy 4–6 dniach albo za dużo dni siłowych (G2), albo pusto.

## 3. Uwagi pod celem — wdrożone teksty (PL; liczby z kodu jako parametry)

Zasada: tekst nie twierdzi więcej niż źródła; liczby przez parametry (`MIN_DAYS`, `GENERAL_SETS`, `REPS`, `WHO_MODERATE`, `WHO_VIGOROUS`).
Uwaga przy zbyt małej liczbie dni = 1 dzień siłowy (ostrzeżenie `oneday`): **jedno miejsce — pod celem**, nie w podglądzie (rozstrzygnięcie
w raporcie wdrożenia, opcja A). Siła, masa, redukcja — dotychczasowy tekst z dokumentu 29 (mówi o mniejszej liczbie serii w jednej sesji, czyli
o trudności zmieszczenia serii — szczegóły partii poniżej 10 serii pokazuje ostrzeżenie `below` w podglądzie); „Ogólny” — tekst dla zdrowia:

- **Ogólny, opis celu** (2 zdania): {s} serie na ćwiczenie, {a}–{b} powtórzeń (w domu {c}–{d}), do chwili, gdy kolejne powtórzenie byłoby trudne;
  WHO 2020 zaleca ćwiczenia wzmacniające wszystkie główne partie co najmniej {n} dni w tygodniu (c1, c8).
- **Ogólny, 1 dzień** (`oneday`): {k} dzień siłowy to mniej niż zalecenie WHO 2020 (co najmniej {n} dni); na początek to dobry krok — wytyczne USA 2018
  radzą zacząć od {k} dnia i z czasem dojść do {n}; trochę ruchu jest lepsze niż żaden (c1, c29, c14).
- **Każdy cel, partia < {n} dni** — istniejące ostrzeżenie `rare` zostaje w podglądzie (lista partii; R1).
- Odrzucone szkice: osobna uwaga dla siły (ACSM 2026 ≥ 2 sesje) i masy (10 serii) obok `oneday` — powtarzałyby `oneday`, `rare` i `below`.

## 4. Cytaty (przeczytane; maks. 1–2 zdania)

- **c1 WHO 2020** (Bull i in., BJSM, PMC7719906, rekomendacje dla dorosłych): „Adults should also do muscle-strengthening activities at moderate or
  greater intensity that involve all major muscle groups on 2 or more days a week, as these provide additional health benefits.”
- **c2 PAG 2018** (Physical Activity Guidelines for Americans, 2nd ed., s. 8, Key Guidelines for Adults): „Adults should also do muscle-strengthening
  activities of moderate or greater intensity and that involve all major muscle groups on 2 or more days a week”.
- **c3 ACSM 2026** (Currier i in., PMC12965823, Dyskusja): „Our primary recommendation is that healthy adults perform RT with high effort … at least
  twice weekly, with all major muscle groups being engaged.”
- **c4 ACSM 2011** (Garber i in., MSSE 43(7), tab. 2, „Resistance exercise”): „Each major muscle group should be trained on 2–3 d·wk−1.”;
  „Two to four sets are the recommended for most adults to improve strength and power.”; „A single set of resistance exercise can be effective
  especially among older and novice exercisers.”; „8–12 repetitions is recommended to improve strength and power in most adults.” (wszystkie kat. A)
- **c5 WHO 2020** (Wyniki, dorośli): „There was no evidence to support a dose-response association with higher volumes of muscle-strengthening activities.”
- **c6 PAG 2018** (s. 60): „work the major muscle groups of the body—the legs, hips, back, chest, abdomen, shoulders, and arms.”
- **c7 ACSM 2026**: „In the view of the authors, applying the recommendations herein to the body regions ‘upper’ and ‘lower’ for ‘push’ and ‘pull’
  exercises (i.e., four body regions) is sufficient to target major muscle groups.”
- **c8 PAG 2018** (s. 60): „muscle-strengthening exercises should be performed to the point at which it would be difficult to do another repetition.
  When resistance training is used to enhance muscle strength, one set of 8 to 12 repetitions of each exercise is effective, although 2 or 3 sets may be more effective.”
- **c9 ACSM 2026** (Wstęp, o poprzednich zaleceniach ACSM 2009/2011): „two to three RT sessions per week, with eight to ten exercises involving major
  muscle groups per session, one to four sets per exercise, eight to twenty repetitions per set, 2–3 min rest between sets, loads 40%–70% 1RM”.
- **c10 ACSM 2011** (s. 1343): „The selected resistance should permit the completion of 8–12 repetitions per set—or the number needed to induce
  muscle fatigue but not exhaustion.”
- **c11 ACSM 2011** (s. 1342–1343): „For a general fitness program, rest intervals of 2–3 min are most effective”.
- **c12 ACSM 2011** (tab. 2): „A rest of ≥48 h between sessions for any single muscle group is recommended.”
- **c13 ACSM 2026** (Wyniki, przerost): „RT did not influence hypertrophy performed with low (1 d/wk) versus high (>5 d/wk) frequency when total volume was equated”.
- **c14 WHO 2020**: „Some physical activity is better than none.”; „MVPA bouts of any duration now count towards these recommendations”.
- **c15 PAG 2018** (s. 8): „adults should do at least 150 minutes … to 300 minutes … a week of moderate-intensity, or 75 minutes … to 150 minutes … a week
  of vigorous-intensity aerobic physical activity”.
- **c16 ACSM 2011** (tab. 2, aerobowa, kat. A): „≥5 d·wk−1 of moderate exercise, or ≥3 d·wk−1 of vigorous exercise, or a combination … on ≥3–5 d·wk−1 is recommended.”
- **c17 PAG 2018** (s. 57): „Research studies consistently show that activity performed on at least 3 days a week produces health benefits.”
- **c18 Schumann 2022** (Sports Med, PMC8891239, Wnioski): „Concurrent aerobic and strength training does not compromise muscle hypertrophy and maximal
  strength development. However, explosive strength gains may be attenuated, especially when aerobic and strength training are performed in the same session.”
- **c19 Petré 2021** (Sports Med, PMC8053170): „the negative effect observed in trained individuals occurred only when resistance and endurance training
  were conducted within the same training session”; u niewytrenowanych i średnio wytrenowanych brak różnicy (podgrupy).
- **c20 ACSM 2026**: „There were insufficient data to determine if strength was affected by … concurrent training (i.e., aerobic and RT in the same training session)”.
- **c21 Eddens 2018** (Sports Med, PMC5752732, Wnioski): „The findings support the practice of a resistance followed by endurance exercise order for the
  training outcome of lower-body dynamic strength”; „There was no support for a given exercise order for the training outcomes of lower-body static strength and muscle hypertrophy.”
- **c22 ACSM 2011** (s. 1344–1345): „Performing flexibility exercises ≥2–3 d·wk−1 is effective”; „For most individuals, this routine can be completed within 10 min.”
- **c23 PAG 2018** (s. 61): „flexibility activities are an appropriate part of a physical activity program, even though their health benefits are unknown
  and it is unclear whether they reduce risk of injury.”
- **c24 Behm 2016** (Appl Physiol Nutr Metab, PMID 26642915, streszczenie): „A dose-response relationship illustrated greater performance deficits with ≥60 s
  (-4.6%) than with <60 s (-1.1%) SS per muscle group.”
- **c25 WHO 2020** (osoby starsze): „older adults should do varied multicomponent physical activity that emphasises functional balance and strength training
  at moderate or greater intensity on 3 or more days a week”.
- **c26 PAG 2018** (s. 8, Key Guidelines for Older Adults): „older adults should do multicomponent physical activity that includes balance training as well
  as aerobic and muscle-strengthening activities.”
- **c27 ACSM 2011** (tab. 2, neuromotoryka): „≥2–3 d·wk−1 is recommended.” (kat. B); „The effectiveness of neuromuscular exercise training in younger and
  middle-aged persons has not been established, but there is probable benefit.” (kat. D)
- **c28 PAG 2018** (s. 61): „A warm-up for muscle-strengthening activity commonly involves doing exercises with lighter weight.”
- **c29 PAG 2018** (s. 62): „Initially, these activities can be done just 1 day a week starting at a light or moderate level of effort. Over time, the number
  of days a week can be increased to 2, and then possibly to more than 2.”
- **c30 WHO 2020**: „Start with small amounts of physical activity and gradually increase frequency, intensity and duration over time.”

Uwaga: WHO 2020 wspomina „gentle stretching” **tylko w zaleceniach dla kobiet w ciąży i po porodzie** („Adding gentle stretching may also be beneficial”)
— nie jest to zalecenie dla ogółu dorosłych i nie może być tak cytowane.

## 5. Czego NIE da się potwierdzić (nie wchodzi do aplikacji jako fakt)

- Dokładna liczba serii, RIR i przerw „dla zdrowia” — tylko przedziały (2–3 serie; opis wysiłku); RIR 2–3 = ACSM 2026 (jedno źródło na liczbę).
- Że 4–6 dni siłowych daje więcej korzyści **zdrowotnych** niż 2–3 (WHO: brak dowodów dawka–odpowiedź) — ani że szkodzi.
- Optymalna długość bloku cardio w sesji siłowej i podział minut cardio między dni — konwencja.
- Wpływ łączenia cardio i siłowego w tej samej sesji na wyniki **zdrowotne** (metaanalizy dotyczą siły, przerostu, mocy; ACSM 2026: brak danych).
- Że rozciąganie zapobiega kontuzjom, bólom pleców lub zakwasom (ACSM 2011: „No consistent link”; PAG: „unclear”; Behm 2016: brak wyraźnego efektu).
- Że ćwiczenia równowagi pomagają osobom < 65 lat (ACSM 2011: kat. D — opinia panelu).
- Że 48 h przerwy dla partii jest konieczne (ACSM 2011, kat. A, ale ACSM 2026: przy równej objętości częstotliwość nie zmienia przerostu) — uproszczenie.
- „8–10 ćwiczeń na sesję” — dawne zalecenie ACSM cytowane w ACSM 2026; samego ACSM 2009 nie przeczytano (płatny).

## 6. Otwarte pytania

1. ~~Wariant aerobowy~~ — rozstrzygnięte 09.10: B jako przełącznik (sekcja 0).
2. ~~Serie~~ — rozstrzygnięte 09.10: 2.
3. Czy pytać o wiek (65+) — wtedy ćwiczenia równowagi ≥ 3 dni (WHO) i dłuższe rozciąganie (ACSM 2011: 30–60 s). Bez wieku — nie dodawać.
4. ~~Rozciąganie~~ — rozstrzygnięte 09.10: bez rozciągania.
5. Intensywność cardio: generator ma „umiarkowane”; 1 min intensywnego ≈ 2 min umiarkowanego (WHO/PAG: 75–150 vs 150–300) — czy liczyć intensywne.
6. Siła/masa 1 dzień i górna granica serii na sesję — dokument 29 (drugi agent).
7. Pełne dokumenty nieprzeczytane: WHO Guidelines 2020 (IRIS, 9789240015128 — przeczytano artykuł Bull 2020 z rekomendacjami), ACSM 2009 (płatny),
   ACSM Guidelines for Exercise Testing and Prescription (płatna książka), NSCA (brak stanowiska o treningu „dla zdrowia” w odczycie).

## 7. Źródła

- WHO 2020: Bull FC i in. „World Health Organization 2020 guidelines on physical activity and sedentary behaviour”. Br J Sports Med 2020;54:1451–62.
  https://europepmc.org/article/PMC/PMC7719906 (PT)
- PAG 2018: U.S. Department of Health and Human Services. Physical Activity Guidelines for Americans, 2nd ed. 2018.
  https://health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf (CZ: s. 8, 57–62; Key Guidelines, rozdz. 4)
- ACSM 2026: Currier BS i in. ACSM Position Stand: Resistance Training Prescription… Med Sci Sports Exerc 2026;58(4):851–872.
  https://europepmc.org/article/PMC/PMC12965823 (PT)
- ACSM 2011: Garber CE i in. Quantity and quality of exercise… Med Sci Sports Exerc 2011;43(7):1334–1359. https://doi.org/10.1249/MSS.0b013e318213fefb
  (CZ: s. 1334–1336 z tab. 1–2, s. 1342–1345; kopia z materiałów dydaktycznych, wydawca — LWW)
- Schumann M i in. Compatibility of Concurrent Aerobic and Strength Training… Sports Med 2022;52(3):601– (online 2021). https://europepmc.org/article/PMC/PMC8891239 (PT)
- Petré H i in. Development of Maximal Dynamic Strength During Concurrent Resistance and Endurance Training… Sports Med 2021;51(5):991–.
  https://europepmc.org/article/PMC/PMC8053170 (PT)
- Eddens L, van Someren K, Howatson G. The Role of Intra-Session Exercise Sequence in the Interference Effect… Sports Med 2018;48(1):177–188 (online 2017).
  https://europepmc.org/article/PMC/PMC5752732 (PT)
- Behm DG, Blazevich AJ, Kay AD, McHugh M. Acute effects of muscle stretching on physical performance, range of motion, and injury incidence…
  Appl Physiol Nutr Metab 2016;41(1):1–11. https://doi.org/10.1139/apnm-2015-0235 (A)
- Z dokumentu 22 (bez ponownego odczytu): Pelland 2026 (A), Singer 2024 (PT), Donnelly 2009 (A).
