# Plan integracji badań fali W1 i dojścia do celów 1.1 = B (02.11.2026)

Stan repo: `integracja-1-1` @ b102f5b0. Gałęzie badań czytane przez `git show origin/badania/<slug>:<plik>`, niczego nie przełączano ani nie uruchamiano z testów/npm.
Liczby kart policzone skryptem tylko do odczytu na blokach JSON plików fali
(skrypt analizy ze scratchpadu dawnej sesji — niedostępny; przeliczenie powtórzyć z danych gałęzi).
Reguły liczenia:
- **karta własna** = co najmniej 1 zdanie ustawienia + 1 zdanie ruchu, każde z ≥ 2 źródłami szczebla ≤ 4 z różnych organizacji (docs/18-przekazanie.md:134);
- **z błędami** = karta własna + co najmniej 1 zdanie w `mistakes`;
- karty „częściowe” liczą się jako własne, z pustym `mistakes` (docs/18-przekazanie.md:143).

Pomijam bloki oznaczone przez badaczy jako wstrzymane, warunkowe albo otwarte (lista niżej), cały blok `overhead_press-cz1.md` (STAN-g5-pchanie.md:41)
i 73 zdania z `przeliczenie-2026-11-02.md` (G2).

Dwa scenariusze szczebli:
- **P (ostrożny):** źródła z uzupełnienia 3 i warunkowe z uzupełnienia 2 (The Prehab Guys, Coach) NIE liczą się tam, gdzie gałąź ich nie przeliczyła;
- **O (optymistyczny):** liczą się wszystkie, które badacz wpisał jako szczebel 4.

Zawsze 5: free-exercise-db, Physitrack, Onnit i pozostałe źródła z listy „5” (docs/18-przekazanie.md:135,141,142).

Ograniczenia:
- 203 identyfikatorów źródeł stoi tylko w tabelach markdown (nie w JSON). Skrypt przypisuje im organizację po przedrostku id i szczebel 4, chyba że przedrostek wskazuje źródło z listy „5”.
- Wynik jest dokładny co do struktury kart (ustawienie/ruch/błąd). Co do szczebli jest szacunkiem, który programista powinien powtórzyć po przeliczeniu plików przez badacza.

## 0. Które gałęzie zastosowały które uzupełnienie szczebli (weryfikacja)

| Gałąź | Rozstrzygnięcie 1 | Uzup. 2 | Uzup. 3 | Dowód |
|---|---|---|---|---|
| lokalne-0211 (curl, delt_raise, triceps, lunge) | **nie** (pliki sprzed rozstrzygnięcia; free-exercise-db tylko odnotowane) | nie | nie | README.md:6 „do przeliczenia przy integracji”; 0 sekcji korekty w 8 plikach; curl-2.md: 63 wzmianki free-exercise-db, lunge.md: 68 Eleiko |
| G1 core | tak | tak | **tak** | STAN-g1-core.md:6; sekcje „uzupełnienie 3” w back_extension, core_standing-1/-2 |
| G2 mobilność | tak | tak (przeliczenie ma pierwszeństwo) | nie, **bez skutku** (Healthline i tak nieliczony, Coach = 5) | STAN-g2-mobilnosc.md:27; przeliczenie-2026-11-02.md:7 |
| G3 moc | tak | **nie** | **nie** | STAN-g3-moc.md:59 „NIE zastosowane jeszcze w plikach rodzin”, :77-83; 0 sekcji korekty w 11 plikach |
| G4 nogi | tak | tak | **nie** | STAN-g4-nogi.md:5 (tylko rozstrzygnięcia 1 i 2); Onnit 27×, Fitness Volt 31×, Eleiko 11×, Mikolo 10×, Life Fitness/ManualsLib w hinge-cz1/-cz2, kneeling_hinge, leg_machine, hip_abd_add |
| G5 pchanie | tak | tak | **tak, w 10 z 13 plików** | STAN-g5-pchanie.md:34. **Bez sekcji uzup. 3:** overhead_press-cz2.md (Landmine Press stoi na BarBend + OriGym — do sprawdzenia per autor) i chest_fly-cz2.md (bez skutku dla JSON). Prehab Guys w KB Press i Band Shoulder Press (overhead_press-cz1b.md:43) nieprzeliczony wg uzup. 2 |
| G6 przyciąganie | tak | **tylko w osobnym pliku** (rodziny nie przepisane) | **nie** | STAN-g6-przyciaganie.md:31-33; g6-szczeble-uzupelnienie-2.md; Fitness Volt/Generation Iron/Healthline/Eleiko w row, cable_row, forearm, pulldown, strongman |

**Korekta do przekazania:** to, że „G3 i G5 nie zastosowały uzupełnienia 3”, zgadza się dla G3. Dla G5 nie: G5 je zastosował (poza 2 plikami).
Uzupełnienia 3 nie zastosowały natomiast **G4, G6 i lokalne-0211** (lokalne-0211 — także żadnej korekty szczebli).

Stany w plikach, które są nieaktualne i wymagają przeliczenia:
- **STAN-g1-core.md:20 „20 gotowe”** — kryterium sprzed decyzji „ustawienie + ruch”. Według minimalnej karty kwalifikuje się 11.
  - core_hang.md:26: Hanging Leg/Knee Raise mają `setup: []`, `move: []`.
  - Decline Crunch, GHD Sit Up, Decline Reverse Crunch, Cable Reverse Crunch, Lower Back Curl, Reverse Hyperextension mają tylko ruch.
  - Bicycle Crunch nie ma zdania ruchu.
- **curl.md:24-45 i curl-2.md** — „gotowe” = ustawienie + wskazówki, **bez sekcji ruchu** (`"move": []`, curl.md:102). Według minimalnej karty: 0 kart.
  Do tego curl.md:1 — jedno ze źródeł (dokumentacja innej aplikacji) odrzucone przez koordynatora.
- **delt_raise.md / delt_raise-2.md**: 9 z 11 kart stało na free-exercise-db (README.md:6). Zostają 2 (One-Arm Lateral Raise (hantel), Dumbbell Scaption) — obie bez błędu.
- **STAN-g3-moc.md:14-19 (31 + 18)**: przed uzup. 2 i 3.
  - Onnit: `kbb.cleanSetup`, `kbb.mis.bang` → Kettlebell Clean i One-Arm KB C&J odpadają (kb_ballistic-cz1.md:33).
  - Experience Life / Life Time: błędy w Power/Hang/Block/Split Clean, Thruster (hantle), Kettlebell Thruster (thruster.md:24) — zależą od autora strony.
  - The Prehab Guys: Lateral Box Jump, błąd Broad Jump (plyo-cz1.md:37).
  - IronMind: Split Snatch (olympic-snatch.md:26) i blok 2b olympic-clean.md:235 — uzup. 2 przywraca je przy autorze Schmitz (STAN-g3-moc.md:63-64).
- **STAN-g4-nogi.md:22 (12 gotowe)**: skrypt potwierdza 12 w obu scenariuszach.
  Zdania na Onnit/Fitness Volt/Eleiko wypadają w hinge-cz2.md:70 i kneeling_hinge.md:41 (blok pusty), ale nie zmieniają liczby kart.
  Do ręcznego sprawdzenia: zdania drugorzędne w hinge-cz1/-cz2.
- **STAN-g6-przyciaganie.md:15-23**: tabela nieaktualna (sama mówi „NADRZĘDNE” w :31).
  - Spadają: Muscle Up, Single Arm Cable Row, Jumping Jacks, High Knees, Fast Skipping, Carioca, 2 karty One-Arm Wrist Curl (:35).
  - Zależne od uzup. 3: Machine Row (Healthline), Seal Row i Lying T-Bar Row (Fitness Volt / Generation Iron), Single Arm Lat Pulldown (Eleiko).

Bloki pominięte jako wstrzymane/warunkowe:
- G1: back_extension.md:83, core_floor-3.md:57, core_standing-1.md:122 (7 ćw.), core_standing-2.md:71, neck.md:56;
- G2: mobility_stand-statyczne-2.md:76 (Wall Lat);
- G3: olympic-clean.md:235 (IronMind, 4 ćw.), plyo-cz2.md:140 (Physitrack — odrzucone);
- G4: hinge-cz1.md:125, leg_isolation.md:196, leg_machine.md:84 (Hack Squat — ukryty, STAN-g4-nogi.md:29), squat-cz1.md:177;
- G5: overhead_press-cz1.md:29 (NIEWAŻNY);
- G6: shrug.md:46 (2 karty warunkowe).

## 1. Inwentarz per rodzina (po przeliczeniu wg obecnych decyzji)

Kolumny:
- „Ćw.” — liczba ćwiczeń rodziny i dotychczasowe własne (docs/55-pokrycie-katalogu.md:54-96);
- „Badane” — ćwiczenia w blokach do wdrożenia;
- „Własne P/O” — karty własne (ustawienie + ruch);
- „z błędami P/O”;
- „Otwarte” = ćw. rodziny − dotychczasowe własne − nowe własne (P);
- „Zdania” — nowe id spoza `lib/cues/text/pl.json` w kartach scenariusza P, unikalne, ustawienie/ruch/wskazówka/błąd.

| Gałąź | Rodzina | Ćw. / własne dziś | Badane | Własne P/O | z błędami P/O | Otwarte (P) | Zdania U/R/W/B (P) | Uwagi |
|---|---|---|---|---|---|---|---|---|
| lokalne | curl | 36/6 (55:56) | 20 | **0/0** | 0/0 | 30 | 0 | wszystkie bez ruchu → częściowe; badać zdania ruchu |
| lokalne | delt_raise | 38/5 (55:55) | 11 | 2/2 | 0/0 | 31 | 2/2/0/0 | free-exercise-db zabrał 9 kart |
| lokalne | triceps | 32/4 (55:59) | 14 | 11/13 | 7/8 | 17 | 9/9/5/4 | Skullcrusher (sztanga), Reverse Grip Pushdown zależne od szczebla 4 warunkowo (NFPT/BarBend) |
| lokalne | lunge | 24/6 (55:65) | 8 | 3/6 | 2/2 | 15 | 1/0/0/0 | Eleiko/Inspire (uzup. 3): Smith Bulgarian, Split Squat, Bulgarian (sztanga) |
| G1 | core_floor | 44/4 (55:54) | 11 | 6/6 | 0/0 | 34 | 6/6/1/0 | 5 kart bez ustawienia → częściowe |
| G1 | core_standing | 19/2 (55:69) | 4 | 4/4 | 3/3 | 13 | 3/4/2/2 | |
| G1 | core_hang | 4/0 (55:94) | 2 | 0/0 | 0/0 | 4 | 0 | karty bez ustawienia i ruchu |
| G1 | back_extension | 4/1 (55:92) | 2 | 0/0 | 0/0 | 3 | 0 | |
| G1 | neck | 5/0 (55:91) | 2 | 1/1 | 1/1 | 4 | 1/1/0/1 | Front And Back — pytanie o dwa szpitale NHS (STAN-g1:53) |
| G2 | foam_roll | 10/0 (55:80) | 9 | 9/9 | 3/3 | 1 | 10/9/3/1 | brak danych póz v2 — tylko droga własna |
| G2 | mobility_floor | 22/0 (55:67) | 18 | 10/10 | 3/3 | 12 | 10/12/5/3 | + 4 częściowe bez ustawienia lub ruchu (przeliczenie) |
| G2 | mobility_stand | 36/0 (55:57) | 25 | 15/15 | 3/3 | 21 | 13/14/3/1 | |
| G2 | rotator_cuff | 8/0 (55:85) | 7 | 3/3 | 2/2 | 5 | 4/3/0/0 | |
| G3 | olympic | 25/0 (55:63) | 22 | 21/22 | 14/20 | 4 | 10/15/5/7 | błędy zależne od Experience Life (uzup. 3) |
| G3 | kb_ballistic | 17/1 (55:71) | 9 | 7/7 | 4/4 | 9 | 5/5/8/3 | klucz „Snatch” nie istnieje w katalogu — ustalić nazwę |
| G3 | plyo | 28/1 (55:62) | 11 | 7/8 | 4/6 | 20 | 5/8/1/0 | Prehab Guys → Lateral Box Jump |
| G3 | sled_throw | 19/1 (55:70) | 7 | 6/6 | 1/1 | 12 | 6/5/2/1 | |
| G3 | thruster | 3/0 (55:95) | 2 | 1/2 | 0/2 | 2 | 1/0/1/0 | Life Time (Experience Life) |
| G4 | hinge* | 32/7 (55:58) | 4 | 4/4 | 4/4 | — | 3/3/0/1 | rodzina gotowa: zastępuje zrecenzowany zestaw ogólny, przyrost 0 |
| G4 | squat* | 25/5 (55:64) | 1 | 1/1 | 1/1 | — | 1/0/0/0 | jw. (Barbell Hack Squat) |
| G4 | calf_raise | 13/3 (55:74) | 2 | 2/2 | 2/2 | 8 | 1/1/0/0 | |
| G4 | glute_floor | 7/0 (55:88) | 2 | 2/2 | 1/1 | 5 | 1/2/1/0 | |
| G4 | hip_abd_add | 8/0 (55:82) | 1 | 1/1 | 0/0 | 7 | 1/1/1/0 | |
| G4 | hip_bridge | 11/3 (55:78) | 1 | 1/1 | 1/1 | 7 | 1/1/0/0 | |
| G4 | leg_isolation | 14/4 (55:73) | 1 | 1/1 | 1/1 | 9 | 1/1/0/1 | |
| G4 | leg_machine, kneeling_hinge | 8/2, 2/0 | 0 | 0 | 0 | 6, 2 | 0 | Hack Squat ukryty (STAN-g4:29) |
| G5 | bench_press* | 30/5 (55:60) | 5 | 5/5 | 5/5 | — | 6/6/2/4 | rodzina gotowa, przyrost 0 |
| G5 | overhead_press | 23/5 (55:66) | 5 | 3/5 | 2/4 | 15 | 3/2/1/2 | KB Press, Band Shoulder Press na Prehab Guys |
| G5 | chest_fly | 20/2 (55:68) | 3 | 3/3 | 0/0 | 15 | 3/3/2/0 | wszystkie częściowe |
| G5 | pushup_plank | 30/7 (55:61) | 3 | 3/3 | 1/1 | 20 | 3/3/1/1 | |
| G5 | dip, chest_press_machine, cable_press | 5/1, 5/2, 4/1 | 0 | 0 | 0 | 4, 3, 3 | 0 | wszystko otwarte po uzup. 3 |
| G6 | forearm | 13/0 (55:75) | 8 | 5/5 | 0/0 | 8 | 3/2/0/0 | |
| G6 | cardio | 16/5 (55:72) | 12 | 3/3 (+dopełnienia) | 1/1 | 8 | 4/3/4/1 | Skakanka, Assault Bike: usunąć z `open` (STAN-g6:27) |
| G6 | pulldown | 8/2 (55:84) | 4 | 3/4 | 0/0 | 3 | 0/0/1/0 | Eleiko: Single Arm Lat Pulldown |
| G6 | row | 13/6 (55:77) | 3 | 1/3 | 1/1 | 6 | 1/1/1/0 | Fitness Volt / Generation Iron |
| G6 | cable_row | 10/3 (55:79) | 3 | 1/2 | 0/1 | 6 | 1/1/0/0 | Healthline: Machine Row |
| G6 | carry | 7/2 (55:87) | 3 | 2/2 | 0/0 | 3 | 1/1/0/0 | |
| G6 | strongman | 10/0 (55:81) | 4 | 2/2 | 1/1 | 8 | 2/3/1/1 | |
| G6 | pull_up* | 13/3 (55:76) | 2 | 1/1 | 0/0 | — | 1/2/0/0 | Rope Climb (bez figury, liczy się); Muscle Up spada (Coach = 5) |
| G6 | shrug | 8/2 (55:86) | 2 warunkowe | 0 (2 po decyzji 4 G6) | 0 | 6 | 0 | |

\* rodzina gotowa (figura v2 z recenzją): karta własna zastępuje zestaw ogólny, który już się liczy. Przyrost wskazówek 0 (hinge 4, squat 1, bench_press 5).

**Razem** (skrypt, wiersz TOTAL; 251 badanych ćwiczeń w blokach do wdrożenia):
- karty własne: **150 (P) / 164 (O)**;
- z błędami: **68 / 82**;
- nowe zdania (unikalne id, P): **~335** (lokalne 32, G1 27, G2 91, G3 88, G4 22, G5 42, G6 35).
  W scenariuszu O ~367. Każde zdanie wymaga PL+EN i 33 pozostałych języków (`lib/cues/text/*.json`, 35 plików).

Role mięśni (dziś 509/709 ćwiczeń z rolą, docs/55-pokrycie-katalogu.md:27):

| Grupa | Gotowe | Otwarte | Źródło |
|---|---|---|---|
| G1 | core_floor 18 par, core_standing 13, core_hang 3, back_extension 1, szyja 3 (po decyzji A) | 9 + 24 + 1 + 2 (izometrie → noRole) | STAN-g1-core.md:34-40 |
| G2 | rotator_cuff 8 par (2 nowe funkcje), Downward Facing Balance bez roli z powodem | 2 pary (Cuban Press) | STAN-g2-mobilnosc.md:33-36 |
| G3 | olympic N1–N8, kb_ballistic, thruster 4 pary, plyo 55 par, sled_throw 4 pary | plyo ok. 26 par, olympic 3 ćw., sanie, TGU, rwania KB | STAN-g3-moc.md:27-36. N4 = badanie czytane w streszczeniu (:29) |
| G4 | 2 propozycje | 17 | STAN-g4-nogi.md:22, :43-46 |
| G5 | pushup_plank 3 ćw. (nowa funkcja `obliques.side_hold`), OHP 2 pary, dip 3 ćw., chest_fly 2 ćw. | reszta | STAN-g5-pchanie.md:55-60. Statusy wg wariantu A: Push Press i dipy = „jedno źródło”, Landmine = „uproszczenie” |
| G6 | pull_up 10× upper_back + rear_delt + Dead Hang, pulldown 7×, forearm 3, carry 1, strongman 2 (5 nowych funkcji, 1 reguła, 1 zmiana statusu) | jw. w tabeli G6 | STAN-g6-przyciaganie.md:15-23, :29 |
| lokalne-0211 | — | — | brak plików ról |

Wszystkie role idą przez `nameRules` w `data/zrodla/role-miesni.json` (`matchRole`, lib/muscleRoles.ts:30-35) — wariant A (docs/18-przekazanie.md:143).
Numery źródeł S29–S35 dublują się między G1, G2 i G3 — przenumerować (STAN-g1:70, STAN-g2:52, STAN-g3:36).

## 2. Co to daje do celów 1.1

Stan dziś (docs/55-pokrycie-katalogu.md, wygenerowany 02.11.2026 05:56 UTC — `git log` pliku):
- wskazówki (własne lub ogólne): **178/640** (:45);
- częste błędy: **116/557** (:46);
- własne: 101/102 (:42);
- własne z błędami: 39/43 (:44).

Przyrost po integracji (ćwiczenia, które dziś nie liczą się do danej metryki; skrypt, kolumny gainWsk/gainMis):
- wskazówki: **+137 (P) / +151 (O)** → **315–329 / 640**, luka **311–325**;
- częste błędy: **+57 / +71** → **173–187 / 557**, luka **370–384**;
- własne: ~+147 → ~248 (cel 102 osiągnięty); własne z błędami: +65 do +79 → ok. 104–118 (cel 43 osiągnięty).

Warunek liczenia: karta trafia do `lib/cues/data.json` tylko z trybem `own` w `lib/figures/v2/cue-sets.json` i bez wpisu `hidden`, czyli po recenzji treści L-047 (scripts/pokrycie-katalogu.mjs:68-69, :73).

Uwaga — karta częściowa (pusty `mistakes`) zabiera ćwiczeniu błędy zestawu ogólnego. Gdy ćwiczenie ma tryb own, błędy liczą się tylko z karty własnej (pokrycie-katalogu.mjs:74).
- Dotyczy ok. 82 kart bez błędu (150 − 68).
- Dziś to nic nie zabiera: ich rodziny nie mają recenzji v2.
- Ale obniża sufit drogi „figury v2” dla celu 557 (pkt 4).

## 3. Partie integracji (dla programisty)

Pliki wspólne każdej partii:
- `data/zrodla/cues.json` (klucze `exercises`/`sources` nieposortowane — konflikty tekstowe przy dopisywaniu na koniec);
- `lib/cues/text/*.json` (35 plików, klucze posortowane);
- `lib/figures/v2/cue-sets.json` (posortowane, zmiana `b` na `own`);
- `lib/cues/data.json` (generowany, `scripts/cues/gen.mjs`);
- `docs/27`;
- `docs/55` + `tests/fixtures/pokrycie-katalogu-min.json` (generowane: `node scripts/pokrycie-katalogu.mjs --write` / `--podnies-minimum`).

Role: `data/zrodla/role-miesni.json`, `lib/i18n.en.ts` + słowniki języków (zdania ról).

Rejestr twierdzeń (`scripts/claims.mjs:2,22,28`) obejmuje teksty słownika interfejsu (`lib/i18n.en.ts`) ze statusem „uproszczenie”, „jedno źródło” itd. Dotyczy więc zdań ról i opisów uproszczeń, **nie** zdań wskazówek w `lib/cues/text`. Te pilnuje `check:cues` (źródła w `cues.json`).

Kolejność kroków w każdej partii:
1. przeliczenie szczebli;
2. JSON → `cues.json`;
3. zdania PL+EN;
4. `cue-sets` own;
5. tłumacz (33 języki);
6. recenzent lokalizacji;
7. recenzja niezależna L-047 (bez niej karta jest `hidden` i się nie liczy);
8. pełne verify;
9. `--podnies-minimum`.

| Partia | Zakres | Ćw. (P/O) | Zdania (P) | Ryzyka | Warunek wstępny |
|---|---|---|---|---|---|
| **P0 — reguły i porządki** | `orgs` w cues.json: Physitrack, Breaking Muscle, free-exercise-db → 5; Coach i Prehab per strona (STAN-g4:34, :63; docs/18:141). Usunąć Skakankę i Assault Bike z `open`. Scalić `nhs-sitting` = `nhs-sitting-exercises` (STAN-g2:52) | 0 nowych | 0 | Istniejące karty tracą podparcie: skrypt wskazuje Pendlay Row, Łydki na stopniu, Back Extension (sekcja ustawienia/ruchu). Zapadka minimum może zaprotestować — potrzebne pole `powod` | — |
| **P1 — G2 mobilność** | foam_roll, mobility_floor, mobility_stand, rotator_cuff | 37 | 91 | Najprostsze: przeliczenie gotowe, źródła medyczne. Do zrobienia: reguła „błąd = zaprzeczenie standardu” i 11 PDF-ów „4p” (STAN-g2:43, :53) | P0 |
| **P2 — G3 moc** | olympic, kb_ballistic, plyo, sled_throw, thruster | 42/45 | 88 | Wymaga przeliczenia przez badacza wg uzup. 2 i 3 (STAN-g3:59-83). Klucz „Snatch”. Sygnał błędu zestawu ogólnego `pp.legs` w Jerk Dip Squat (STAN-g3:49) | badacz: przeliczenie G3 |
| **P3 — G1 core + lokalne-0211** | core_floor, core_standing, neck(1), triceps, lunge, delt_raise | 27/32 | 59 | lokalne-0211 bez żadnej korekty szczebli. curl = 0. Szyja zależy od decyzji właściciela tylko w części ról. Pytania G1 o warianty i analogie (STAN-g1:52-57) | badacz: przeliczenie lokalne-0211 |
| **P4 — G6 przyciąganie** | forearm, cardio, pulldown, row, cable_row, carry, strongman, pull_up (Rope Climb) | 18/22 | 35 | Przepisać JSON wg g6-szczeble-uzupelnienie-2.md i uzup. 3. Rope Climb w rodzinie pull_up — skrót recenzji v2 świeży (docs/18:127): sprawdzić, czy zmiana `cue-sets` nie zmienia skrótu. Prefiks `dh.`, termin „fałszywy chwyt” (STAN-g6:47) | badacz: uzup. 2/3 w plikach |
| **P5 — G4 + G5 pchanie/nogi** | calf_raise, glute_floor, hip_abd_add, hip_bridge, leg_isolation, overhead_press, chest_fly, pushup_plank + rodziny gotowe hinge(4), squat(1), bench_press(5) | 26/28 (w tym 10 w rodzinach gotowych) | 64 | 10 kart w rodzinach gotowych zastępuje zrecenzowany zestaw ogólny (przyrost wskazówek 0) i może zmienić skrót wpisu recenzji v2 → ponowna recenzja rodziny (fail-closed). G4: uzup. 3 nie zastosowane. G5: Landmine (OriGym), Prehab w KB/Band Press. Interpretacje Band Bench Press, Chain Press, Clock Push-Up (docs/18:143) | badacz: uzup. 3 w G4 |
| **R — role mięśni** | wszystkie pliki `role-miesni-fala-w1/*` | ok. 150+ par | zdania funkcji (nowe: 2 G2, `obliques.side_hold`, 5 G6) | Statusy „jedno źródło” i „uproszczenie” → wpisy w rejestrze twierdzeń. Przenumerowanie źródeł S29+. Faza „gdy się wybijasz” wymaga zmiany kodu (STAN-g3:45) | decyzja „szyja” (pkt 5) |

**Równoległość:**
- Przeliczenia szczebli przez badaczy (G3, G4, G6, lokalne-0211) dotyczą tylko `docs/research/*` na osobnych gałęziach. **Mogą iść równolegle już teraz.**
- Partie P1–P5 i R dotykają tych samych plików (`cues.json`, 35 słowników, `cue-sets.json`, `data.json`, docs/55, fixture). Tekstowo nie da się ich bezpiecznie rozdzielić: `cues.json` nie jest posortowany, a pliki generowane trzeba przeliczyć po każdym scaleniu.
- **Zalecenie: scalanie sekwencyjne z potokiem.** Partia N w tłumaczeniu i recenzji, partia N+1 w przygotowaniu JSON na osobnej gałęzi. Przed scaleniem rebase i ponowne wygenerowanie `data.json`/docs/55/fixture.
- Alternatywa (zmiana kodu, osobna decyzja): pomocnik scalający `cues.json` po kluczach. Wtedy P1–P5 mogą iść w równoległych worktree.
- R równolegle z P1–P5 tylko w części `role-miesni.json`. Słowniki interfejsu (`lib/i18n.en.ts`) też współdzielone, z tym samym tłumaczem.

Kolejność: P0 → P1 → P2 → P3 → P4 → P5, R po P1 albo równolegle po decyzji o szyi.
P5 na końcu: najmniejszy przyrost do celów i ryzyko ponownej recenzji trzech rodzin gotowych.

## 4. Plan fal do celów B — SZKIC (liczby z skryptu, szacunki czasu bez potwierdzenia = [OTWARTE])

Po integracji brakuje 311–325 wskazówek i 370–384 tekstów błędów.

Droga „figury v2” (zestaw ogólny liczy się tylko przy figurze v2 z recenzją ruchu i recenzji zestawu):
- 36 rodzin ma dane póz (`lib/figures/v2/poses/*.json`). Poza 4 rodzinami gotowymi i bez ćwiczeń z kartą własną po integracji zostaje **262 ćwiczeń z zestawem ogólnym (255 z błędami)**.
- Najwięcej w: curl 30, delt_raise 23, plyo 19, triceps 15, lunge 15, core_floor 13, overhead_press 13, chest_fly 12, pushup_plank 11 (skrypt).
- Sufit samej drogi figur: wskazówki ≈ 315 + 262 = **577 < 640**, błędy ≈ 173 + 255 = **428 < 557**. To przy 100% zatwierdzeń zestawów — próbna partia B4 dała 20/25 (STAN-1-1.md:23).
- Ok. 130 ćwiczeń nie ma ani danych póz, ani karty własnej, np. foam_roll, neck, cardio, większość mobility_stand (36 ćw., 8 z pozami), mobility_floor, strongman, sled_throw. Dla nich jedyna droga to własne wskazówki albo nowe dane póz.

Warianty:
- **A — tylko badania własnych wskazówek.**
  - Wydajność fali W1: 150 kart z 251 badanych ćwiczeń w 7 sesjach.
  - Wydajność maleje na reszcie (G4 12/95, G5 10/94 gotowych z błędem), a pozostało ok. 394 ćwiczeń bez wskazówek.
  - Nie dojdzie do 640/557. [OTWARTE: liczba sesji]
- **B — tylko figury v2 z recenzją** (33 rodziny planned + recenzje zestawów ogólnych).
  - Sufit 577/428 — **nie wystarczy**.
  - Czas: recenzja rodziny z poprawkami trwała od godzin (squat, bench, hinge 01/02.11) do doby (pull_up, decyzja właściciela) — STAN-1-1.md:19-23. [OTWARTE]
- **C — mieszany (rekomendacja).**
  - Figury v2 dla wszystkich rodzin z pozami, od największych: curl, delt_raise, triceps, lunge, plyo, core_floor, overhead_press, chest_fly, pushup_plank.
  - Do tego fala badań W2 nastawiona na:
    - (a) **błędy** dla kart częściowych (~82 nowe + 62 dotychczasowe własne bez błędów) — to jest wąskie gardło celu 557;
    - (b) rodziny bez póz: mobility, foam_roll, cardio, strongman, neck, sled_throw — co najmniej 63 nowe karty, by dobić do 640.
  - Na co się czeka: decyzje właściciela (pkt 5), przeliczenia badaczy, limit konta, wolna maszyna do pełnego verify (każde scalenie ok. 1–1,5 h verify, STAN-g2:63).
  - Czas: [OTWARTE] — rząd kilkudziesięciu sesji agenta (recenzje rodzin + W2 + integracje). Cel B w 1.1 jest zagrożony bez przesunięcia terminu wydania.

Rekomendacja: C.
- Przy partiach rozważyć dla rodzin z pozami, które idą drogą figur (curl, delt_raise, chest_fly, core_floor): kartę częściową przyjąć dopiero z błędem albo zostawić zestaw ogólny. Inaczej ok. 80 ćwiczeń traci szansę na błąd z zestawu ogólnego — decyzja koordynatora albo właściciela, bo zmienia wdrożenie decyzji z docs/18:143.
- Liczby dojścia [OTWARTE] do potwierdzenia uruchomieniem `node scripts/pokrycie-katalogu.mjs` po P1.

## 5. Decyzje otwarte do właściciela — SZKIC

1. **Szyja — role mięśni `neck.flex`/`neck.ext`:** A — reguły po nazwie jak szrugsy (3 ćwiczenia z opisem, rekomendacja badacza); B — szyja bez opisu. `badania/g1-core:docs/research/role-miesni-fala-w1/neck.md:98-99`; STAN-g1-core.md:47.
2. **Toes to Bar:** A — wersja ścisła (pasują `hang.slow`/`hang.noSwing`, zgodne z figurą; rekomendacja); B — z wymachem (te zdania błędne). Niezależnie od wyboru brak drugiego źródła dla `hang.setup`, `hang.t2b.move`, `hang.pressBar`. `core_hang.md:118-123`; STAN-g1-core.md:48.
3. Medicine Ball Full Twist (w źródłach w parze) i Weighted Ball Side Bend (leżenie bokiem na piłce vs zestaw stojący) — STAN-g1-core.md:49-50.
4. G2 — postać ćwiczeń vs katalog (Standing Chest Stretch, Torso Rotation, Groiners, Runner's Stretch, Middle Back Stretch…) i przypisanie rodzin (Iron Crosses, Hip Circles (Prone), Lying Leg Crossover Swings, Downward Facing Balance) — STAN-g2-mobilnosc.md:46-49. Zdanie „Jeśli coś boli, przerwij” (twierdzenie zdrowotne) — :50.
5. G3 — faza w `nameRules` („gdy się wybijasz”) wymaga zmiany kodu — STAN-g3-moc.md:45. Uproszczenia „bazowy ruch” w wariantach olimpijskich — :44 (koordynator).
6. G4 — `adductors.hip_ext` (22 pary): pokazać uproszczenie czy zdanie prawdziwe dla całej grupy — STAN-g4-nogi.md:43.
7. G6 — karty złożone wyłącznie ze źródeł wariantów (One-Arm Wrist Curl, shrug linki/Leverage) — STAN-g6-przyciaganie.md:45. Tryb `open` zamiast zestawu ogólnego dla 6 ćwiczeń — :46.
8. Cele B a karty częściowe (pkt 4, nowe).

Do koordynatora (nie właściciela):
- szczeble NFPT „by Guest” (STAN-g4:32), dwa szpitale NHS (STAN-g1:53), B. Lee / skakanka (STAN-g6:37), Eleiko — kwalifikacje i wyciągi (szczeble…md uzup. 3 „Otwarte” 2);
- Band Bench Press / Chain Press / Clock Push-Up (STAN-g5:89, :98);
- błędy zestawów ogólnych do backlogu: STAN-g1:59-61, STAN-g3:47-57, STAN-g4:38-40, STAN-g5:66-79, STAN-g6:46.
