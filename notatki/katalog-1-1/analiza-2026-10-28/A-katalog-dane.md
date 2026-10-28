# A. Katalog ćwiczeń i dane — analiza (1.1 na integracji, porównanie z 1.0)

Sesja katalog-1-1, 28.10.2026. Tylko odczyt. Kod: `/home/user/wt/int` (integracja-1-1 @ 55ba40c), main = `origin/main` @ 96c24258.
Integracja odbiega od main o 191 commitów main (`git rev-list --count $(git merge-base HEAD origin/main)..origin/main` = 191).
Skrypty pomocnicze (tylko odczyt, poza repo): `/tmp/claude-0/-home-user-trening/9f842785-f516-5903-b6ba-5599da566068/scratchpad/{inv.mjs,inv2.mjs,full.mjs,feat.mjs,fb.mjs,dups.py}`.
Eksport strony uruchomiony lokalnie do scratchpadu: `node scripts/strona/eksport.mjs --out <scratchpad>/eksport` (35 języków, 9,8 s, nic nie zapisuje w repo).

## Streszczenie

1. **Katalog: 709 ćwiczeń, tyle samo w 1.0 i 1.1.** Różnica 1.0/1.1 to 2 poprawki `muscleLoad` (diff `catalog.json`). Słowniki: 16 wzorców ruchu, 11 partii (grup), 12 partii mięśni aplikacji, 19 regionów, 91 możliwości sprzętu, 6 klas sprzętu, 43 rodziny figur v2.
2. **Figury w aplikacji 1.1:** v2 ma 98 ćwiczeń (w 1.0: 87), v1 tylko 53 (razem 71 figur v1). **558 z 709 (79%) nie ma żadnej figury.**
   - Dane póz istnieją dla dalszych 438 ćwiczeń, ale ich rodziny mają status `planned`.
   - Tylko 4 z 43 rodzin są `ready` (squat, bench_press, hinge, pull_up).
3. **Karty:**
   - 102 ćwiczenia mają własne wskazówki, z czego tylko 43 mają „częste błędy”.
   - 538 ma ogólny zestaw rodziny: 170 różnych zestawów, największego używa 34 ćwiczeń.
   - 69 nie ma żadnego tekstu.
   - **Pełną kartę (własne wskazówki z błędami, figura v2, animowany błąd, role mięśni) ma 17 ćwiczeń.**
   - Pola „opis” nie ma ani w aplikacji, ani w eksporcie.
4. **Nazwy ćwiczeń w 33 językach (poza PL i EN): 0 z 709 przetłumaczonych.** Wszędzie wyświetla się nazwa angielska (DEC-13, `lib/i18n.ts:138-144`).
   - Wyjątek: 9 nazw polskich (np. „Bieg”) i nawiasy po polsku tłumaczone na angielski (`EX_FULL`, `EX_PAREN`).
   - Konwencji „nazwa EN + nazwa lokalna” nie ma nigdzie: ani w danych, ani w słowniku terminów (51 pojęć, żadna nazwa ćwiczenia), ani w rolach tłumacz/recenzent.
5. **Polska wersja jest mieszana:** 627 nazw angielskich, 75 angielskich z polskim nawiasem („Bench Press (sztanga)”), 7 w pełni polskich. Wyszukiwarka aplikacji szuka tylko po kluczu i nazwie EN: „przysiad” znajduje 1 ćwiczenie, „Kniebeuge” — 0.
6. **Teksty kart w 35 językach:**
   - Własne karty (306 zdań) i role mięśni (965 zdań) mają komplet w każdym języku.
   - **53 zdania zestawów ogólnych dodane w 1.1 istnieją tylko po PL i EN.** W 33 językach przechodzą na angielski: 574 wystąpienia, 222 ćwiczenia na język.
   - W aplikacji 1.1 widać to już przy 8 ćwiczeniach z gotową figurą (7 z rodziny bench_press, `bp.elbowsMid`, oraz Gorilla Chin/Crunch).
7. **Konwencja nazw jest niespójna:**
   - nawias PL (75) obok prefiksu EN („Dumbbell Squat”, 27×);
   - „Push Up” 7× obok „Push-Up” 11×;
   - „Single Arm / Single-Arm / One Arm / One-Arm” = 7/2/4/24;
   - 54 nazwy w liczbie mnogiej;
   - 7 z myślnikiem-separatorem;
   - dwa schematy rolowania: 8× „-SMR” i 2× „Foam Roll:”.
8. **Prawie-duplikaty z dowodem:**
   - Standing Gastrocnemius ≈ Wall Calf: identyczna poza w danych 1.1.
   - „Seated Cable Row” i „Seated Cable Row (home)”: identyczne wymagania i mięśnie.
   - Identyczne pozy dla różnych ćwiczeń: Curtsy Lunge = Crossover Reverse Lunge (w drugim ginie rotacja tułowia), Walking Lunges = Lunges (hantle), Chin Up = Neutral Grip Pull Up (rodzina ready, widoczne w 1.1).
   - Łącznie 72 ćwiczenia dzielą pozę ciała z innym ćwiczeniem.
9. **Dane mięśni i partii:**
   - Tylko 39 ćwiczeń ma dobór mięśni „mocne/ustalone”; 114 to „uproszczenie”, 215 — „jedno źródło”.
   - 105 nie ma partii głównej; 10 z nich trenuje mięśnie spoza mapy (stożek rotatorów, zębaty przedni, zginacze biodra, piszczelowy).
   - 5 ćwiczeń szyi jest w partii „barki”, 3 przywodzenia w „pośladki”.
   - 34 ćwiczenia z kettlebell mają klasę sprzętu „hantle”, więc filtr strony „Hantle” je pokaże.
10. **Eksport strony 1.1 dziś: 709 ćwiczeń × 35 języków, 0 figur.**
    - Brakuje pliku recenzji `docs/research/figury-recenzja.json` na integracji, więc eksport domyka się bezpiecznie (fail closed).
    - Skróty v2 zapisane na main nie pasują do rigów 1.1 (np. squat: `fd142e983e89` na main, `fd180abc03f9` na integracji), więc po scaleniu też będzie 0 bez nowej recenzji.
    - Integracja nie ma też bramki kart (DEC-10 a, sekcje `karty`/`zestawy`).
11. **Dwa błędy kontraktu eksport ↔ strona** (oba niewidoczne w 1.0):
    - Eksport podaje `roles[].region`, a strona czyta `roles[].id` (`techniqueatlas/src/pages.mjs:172`), więc nazwa partii wyjdzie jako „undefined”.
    - Eksport po cichu podstawia angielski za brakujący przekład (`eksport.mjs:93`, `cuesWithoutText = 0`), wbrew zasadzie strony „nigdy fallback” (docs/54 pkt 6).
12. **Luki w zakresie:**
    - Brakuje popularnych ćwiczeń rozgrzewki i mobilności (przeprosty z gumą, wall slides, otwieranie piersiowego, 90/90, pigeon, couch stretch, pies z głową w dół, kobra, Y-T-W leżąc, chin tuck).
    - Brakuje kalisteniki (front lever, planche, archer, shrimp squat, ring row), maszyn (wspomagane podciąganie i dipy), olimpijskich (hang power clean, push jerk) i tibialis raise.
    - Każde nowe ćwiczenie dokłada się do warunku startu strony S6 (709/709 figur).
13. **Znaki towarowe:** `trademark-check.json` strony ma 0 z 709 nazw sprawdzonych. Klucze z markami (Assault Bike, Ski Erg, Bosu…) mają nazwy zastępcze w UI, ale trafiają do pola `id` w JSON eksportu.
14. **Rekomendacje (szczegóły w pkt 6):**
    - (a) teraz, póki `slugs.lock.json` jest pusty: przewodnik stylu i poprawione nazwy EN oraz stabilne `rid` jako identyfikator eksportu;
    - (b) jedna struktura nazw lokalnych `{nazwa, aliasy, status}` per język, wspólna dla aplikacji i strony; strona pokazuje „lokalna + EN”, aplikacja wg decyzji właściciela;
    - (c) zamrożenie zakresu katalogu w 1.1, nowe ćwiczenia od 1.2;
    - (d) przed eksportem scalić main do integracji i naprawić oba kontrakty.

---

## 1. Inwentarz

### 1.1 Liczności (polecenia w nawiasach)

| Co | Liczba | Dowód |
|---|---|---|
| Ćwiczenia w katalogu | 709 (1.0: 709) | `python3 -c "json.load(open('docs/research/equipment/catalog.json'))"`, `git show origin/main:…/catalog.json`; `seed.LIB.length` = 709 (124 bazowe + 585 dopisanych) |
| Podstawowe / niszowe (`scope: niche`) | 305 / 404 | `CATALOG_NICHE`, eksport `niche` |
| Wzorce ruchu (`pattern`) | 16 — isolation 205, hinge 81, mobility 68, h_push 56, other 52, core_flexion 43, v_push 41, squat 36, h_pull 25, lunge 24, core_other 22, v_pull 17, cardio 17, core_anti_ext 9, carry 9, core_anti_rot 4 | Counter po `pattern` |
| Źródło obciążenia (`loadSource`) | 12 — bodyweight 197, barbell 130, dumbbell 105, cable 81, none 76, kettlebell 34, machine_stack 21, band 20, smith 19, plate_loaded 17, ez_bar 7, trap_bar 2 | Counter |
| Klasa sprzętu (`Equipment`, 6) | masa ciała 192, sztanga 142, hantle 139, inne 92, linki 81, maszyna 63 | eksport `equipment`; `lib/seed.ts:74` |
| Możliwości sprzętu (`CATALOG_CAPS`) | 91 | `labels.capabilities` w eksporcie |
| Ćwiczenia bez wymagań sprzętowych | 140 | `feat.mjs` |
| Partie (`GROUPS`) | 11 — inne 105, nogi 103, plecy 97, core 90, barki 89, klatka 65, biceps 49, triceps 46, pośladki 31, cardio 20, łydki 14 | `lib/seed.ts:75` |
| Partie mięśni aplikacji (`MUSCLES`) | 12 | `lib/seed.ts:44` |
| Regiony mięśni (`REGION_LABEL`) | 19 (z „szyja” poza mapą partii) | `lib/seed.ts:144-147` |
| Mięśnie poza mapą (`unmapped`) | 10 ćwiczeń: rotator_cuff 6, serratus_anterior 3, hip_flexors 1, tibialis_anterior 1 (Smith Machine Reverse Calf Raise — regiony puste) | catalog.json `unmapped` |
| Pewność doboru mięśni | umiarkowane 313, jedno źródło 206, brak źródła — uproszczenie 92, mocne 36, umiarkowane (analogia) 28, uproszczenie (analogia) 13+9, jedno źródło (analogia) 9, ustalone (przegląd) 3 | `research.confidence` |
| Rodziny figur v2 | 43: **ready 4** (squat 25, bench_press 30, hinge 32, pull_up 13), planned 39 | `lib/figures/v2/families.ts:27-35`, `inv.mjs` |
| Ćwiczenia z figurą v2 w aplikacji 1.1 | **98** (squat 25, bench 30, hinge 32, pull_up 11 z 13) — 1.0: 87 | `figureSpec` w `inv.mjs` |
| Ćwiczenia z danymi pozy v2 (pliki `poses/*.json`) | 449 (w tym 11 pull_up); podłączony do aplikacji tylko `pull_up` (`poseData.ts:13-15`) | `inv.mjs` |
| Ćwiczenia bez figury v2 i bez danych pozy | 173 (cardio 16, foam_roll 10, neck 5 — rodziny bez żadnej pozy; mobility 41 z 58; core_floor 23 z 44; pushup_plank 13 z 30) | `inv.mjs` |
| Figury v1 | 71 (1.0: 68), z tego **53 tylko v1** (bez v2) | `lib/figures/data.json` |
| **Bez żadnej figury w aplikacji 1.1** | **558** (podstawowe 209 z 305, niszowe 349 z 404) | `inv.mjs`, `inv2.mjs` |
| Sekcja „Technika” widoczna w aplikacji 1.1 | 180 | `hasTechnique` |
| Własne wskazówki (`lib/cues/data.json`) | 102 (1.0: 101): ustawienie 93, ruch 96, wskazówki 100, **błędy 43** | `feat.mjs` |
| Zestaw ogólny rodziny (`cue-sets.json`, `b: general`) | 538 (z błędem 514); w aplikacji widoczny tylko przy figurze v2 (`ExerciseCues.tsx:30`) | eksport |
| Bez tekstu (`open`) | 69 (sled_throw 9, core_floor 8, strongman 8, neck 5, …) | eksport |
| Figura z animowanym błędem | 92 | `errorsOf` |
| Role mięśni („Co robią mięśnie”) | 509 (reguły tylko dla 7 wzorców złożonych) | eksport `roles` |
| Uwaga o asekuracji | 85 (stojaki 43, osoba 15, hantle nad twarzą 27) | `feat.mjs` |
| Zamienniki (3) | 604; 99 bez żadnego (68 mobilność, 19 izolacji) | eksport `alternatives` |
| Pole „opis” | **0** (katalog ma 667 wewnętrznych `note` po angielsku, nigdzie niewyświetlanych) | catalog.json |

Spójność ID jest dobra. Każdy klucz w `cues/data.json`, `cue-sets.json` (709), `figures/data.json`, `poses/*.json` jest w katalogu (0 sierot, `inv.mjs`). Każde ćwiczenie ma też rodzinę.
Kluczem jest jednak **nazwa** (mieszana PL/EN), a nie `rid`, choć każde ćwiczenie ma unikalny `rid` (709/709, 0 duplikatów).

### 1.2 Tabela pokrycia: cecha karty × liczba ćwiczeń (aplikacja 1.1)

| Cecha karty | Ćwiczeń | % z 709 | Uwagi |
|---|---|---|---|
| Nazwa EN | 709 | 100 | z `exName` w `en` |
| Nazwa PL spójnie po polsku | 7 | 1 | 75 z polskim nawiasem, 627 po angielsku |
| Nazwa w pozostałych 33 językach | 0 | 0 | angielska wszędzie |
| Partia i sprzęt | 709 | 100 | — |
| Mięśnie (regiony) | 707 | 99,7 | puste: Incline Walk, Smith Machine Reverse Calf Raise |
| Partia główna | 604 | 85 | 105 bez |
| Dobór mięśni „mocne/ustalone” | 39 | 5,5 | — |
| Role mięśni | 509 | 72 | — |
| Własne: ustawienie / ruch / wskazówki / błędy | 93 / 96 / 100 / 43 | 13 / 14 / 14 / 6 | — |
| Zestaw ogólny (widoczny tylko z figurą v2) | 538 | 76 | 170 unikalnych zestawów |
| Jakikolwiek tekst techniki | 640 | 90 | — |
| Figura v2 (aplikacja) | 98 | 14 | — |
| Figura v1 (jedyna) | 53 | 7,5 | — |
| Animowany częsty błąd | 92 | 13 | — |
| Linia kąta / tempo / fazy | tylko przy v2 (98) | 14 | — |
| Opis | 0 | 0 | — |
| Zamienniki | 604 | 85 | — |
| **Pełna karta** (własne wskazówki z błędami + v2 + animowany błąd + role) | **17** | 2,4 | — |

Z 102 ćwiczeń z własną kartą tylko 20 ma figurę v2 (`full.mjs`). Własne karty powstały dla ćwiczeń bazowych, a figury v2 — dla rodzin squat/bench/hinge/pull_up. Te dwa zbiory słabo się pokrywają.

---

## 2. Nazwy ćwiczeń w 35 językach

**Skąd biorą się nazwy:**
- Klucz katalogu = nazwa kanoniczna z `catalog.json`. 440 wpisów pochodzi z publicznej bazy ćwiczeń (pole `fedb`), stąd styl „Title Case” („From The Hang Position”).
- Wyświetlanie: `exName` (`lib/i18n.ts:138-144`). PL pokazuje klucz bez zmian. Pozostałe 34 języki pokazują klucz z tłumaczeniem polskich nawiasów (`EX_PAREN`, 11 wpisów) i 9 polskich nazw (`EX_FULL`).
- Nazwy z markami zastępuje `LIB_DISPLAY_NAME` (`lib/seed.ts:280`, 3 wpisy).
- Głos VoiceOver dla nazw biblioteki to angielski (`exNameLang`, `i18n.ts:147`).

**Liczby z eksportu (`atlas-<lang>.json`, porównanie `name` z en):**
- Każdy z 33 języków: **0 nazw różnych od angielskiej** (709/709 spada do angielskiego).
- `pl`: 85 nazw różnych od EN.

**Przegląd przekładów nazw:**
- nie istnieje, bo nie ma czego przeglądać;
- `docs/lokalizacja/slownik-terminow.json` ma 51 pojęć (przerwa, seria, sztanga…) i żadnej nazwy ćwiczenia;
- `.claude/agents/tlumacz.md` i `recenzent-lokalizacji.md` nie wspominają nazw ćwiczeń (grep pusty).

**Komplet tekstów kart per język** (polecenie: `lib/cues/text/*.json` względem id używanych w `cues/data.json` i `cue-sets.json`):

| Język | Zdania własnych kart (306) | Zdania zestawów ogólnych (179) | Role mięśni (965 wystąpień) | Etykiety (partie, regiony, sprzęt, UI, fazy) |
|---|---|---|---|---|
| pl, en | 306 | 179 | 965 | komplet |
| 31 pełnych (bg … zh-Hant) | 306 | **126 (brak 53)** | 965 | komplet (1 możliwość „ghd” = en) |
| es-419, pt-BR (nakładki) | dziedziczą z es/pt; pt-BR nakłada 6 własnych mniej | jak wyżej | 965 | komplet |

Brakujące 53 id (np. `st.tension`, `st.breathe`, `smr.slow`, `jump.land`, `oly.back`, `bp.elbowsMid`, `hang.slow`) dodano w 1.1 (commity b1f8ea59, ff3dde5d; na main jest 306 zdań i 0 braków).
Zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-10-27-wskazowki.json` istnieje — [DO USTALENIA] czy przekład jest zaplanowany przed 1.1.

**Etykiety rodzin ruchu (filtr D6 strony)** istnieją tylko po polsku. Eksport dodaje `families` wyłącznie dla `pl` (`eksport.mjs`, `labels.families`).

---

## 3. Jakość danych

Waga według progu z CLAUDE.md; realność i „widoczne w 1.0” przy każdym znalezisku.

| ID | Znalezisko | Dowód | Waga | Realność | W 1.0 |
|---|---|---|---|---|---|
| K-01 | Nazwy w 33 językach wyłącznie angielskie, PL mieszane (627 EN / 75 EN + nawias PL / 7 PL), wyszukiwanie tylko po kluczu i EN | `i18n.ts:138-144`; `app/exercises.tsx:33`, `app/picker.tsx:32` (`fold(e.name)` / `fold(exName(e))`) | ŚREDNIE (decyzja produktowa DEC-13; nie bloker) | realny | tak |
| K-02 | Klucz = nazwa wyświetlana. Zmiana nazwy wymaga kroku katalogu z migracją (`CATALOG_STEP.renamed`, `seed.ts:226`); stabilny `rid` istnieje, ale nie jest kluczem eksportu ani slugów | catalog.json `rid` 709/709; `eksport.mjs`: `id: key`, slug z nazwy EN | NISKIE (struktura) | — | tak |
| K-03 | Niespójna konwencja nazw (liczby w streszczeniu pkt 7). Do tego: małe/wielkie słowa funkcyjne 34/23, „Fly/Flye(s)” 13/2, „Skullcrusher/Skull Crusher” 3/2, „EZ Bar/EZ-Bar/(EZ)” 2/2/3, „Smith” bez „Machine” 1×, nawiasy EN 17 typów („(Farmers Handles)”, „(Harness)”, „(Stretch)”) | `python3` z regexami (polecenie w scratchpadzie) | NISKIE (aplikacja), ŚREDNIE (strona: tytuły i slugi publiczne) | realny | tak |
| K-04 | Prawie-duplikaty i identyczne rysunki różnych ćwiczeń — lista niżej | `dups.py`; hash `klatki`+`sprzet` w `poses/*.json` | ŚREDNIE (mylący rysunek lub karta; po włączeniu rodzin) | realny | katalog tak; pozy planned nie; Chin Up = Neutral Grip widoczne w 1.1 |
| K-05 | Ogólne nazwy ukrywające wariant: „Leg Curl” (notatka: „presumably the seated machine”), „Standing Calf Raise” (maszyna) obok „Calf Raise (sztanga)”, „Front Raise”, „Preacher Curl”, „Decline Bench Press” (sztanga), „Spider Curl” (hantle) obok „Spider Curl (sztanga)” | catalog.json `note` | NISKIE | realny | tak |
| K-06 | Partia sprzeczna z mięśniami: 5 ćwiczeń szyi → „barki”; 3 przywodzenia bioder → „pośladki” (przy istniejącej partii mięśni „przywodziciele”); 3 „Incline Shoulder Raise” (zębaty) → „barki”, a regionem głównym jest klatka; Smith Machine Reverse Calf Raise → „łydki”, choć pracuje piszczelowy przedni (regiony puste). Martwe ciągi → „plecy” przy głównych dwugłowych/pośladkach (konwencja siłowni — [DO USTALENIA] czy zamierzona) | eksport: 49 niezgodności `group` vs region o najwyższym obciążeniu | ŚREDNIE (filtr „partia” na stronie i w aplikacji pokazuje szyję pod barkami) | realny | tak |
| K-07 | Klasa sprzętu zgrubna: 34 ćwiczenia z kettlebell w klasie „hantle”, gumy i ergometry w „inne” | eksport `(loadSource, equipment)` | NISKIE (aplikacja), ŚREDNIE (filtr „sprzęt” strony; docs/54 pkt 17.4 otwarty) | realny | tak |
| K-08 | 105 ćwiczeń bez partii głównej (68 mobilność, 15 cardio, 15 izolacji — rotacje barku, szyja, unoszenia „shoulder raise” — i 7 „other”); 10 trenuje mięśnie spoza mapy. Dobór mięśni „mocne/ustalone” tylko 39 | eksport `muscles.main`; `research.confidence` | ŚREDNIE (karta bez „mięśni głównych”) | realny | tak |
| K-09 | Jedna karta dla dwóch przyrządów: „RDL (hantle/linki)”, „Single Arm RDL (hantel/linka)” — ustawienie mówi tylko o hantlach. „Step Up”: tekst „z hantlami”, choć hantle tylko zalecane | eksport `cues` vs `requires` | NISKIE | realny | tak |
| K-10 | Rodzina jako etykieta filtra myli: Turkish Get Up i Spider Crawl w „Sanie, rzuty piłką, uderzenia” (`families.ts`, reguła `has(n,'spider crawl','turkish')`); Russian Twist i Seated Barbell Twist w „Core stojąc”; Downward Facing Balance trafia do mobility_floor przez regułę „reszta” (`families.ts:141`) | eksport `family` | NISKIE (filtr D6 strony) | realny | nie (filtr tylko na stronie) |
| K-11 | Brak opisu ćwiczenia; 538 kart ogólnych dzieli 170 zestawów (największy: 34 ćwiczenia z tym samym tekstem); warianty („with Bands”, „Reverse Band”) mają kartę identyczną z bazą bez słowa o różnicy | eksport | ŚREDNIE (strona: cienka i powielona treść; aplikacja: użytkownik nie wie, czym się różni wariant) | realny | tak |
| K-12 | 53 zdania zestawów ogólnych 1.1 tylko PL/EN. W aplikacji 1.1 przy 8 ćwiczeniach z figurą v2 jedno zdanie po angielsku w 33 językach (Decline Bench Press, Decline Bench Press (hantle), Smith Machine Bench Press, Smith Machine Decline Press, Chain Press, Bench Press with Chains, Reverse Band Bench Press — `bp.elbowsMid`; Gorilla Chin/Crunch — `hang.slow`) | `fb.mjs` | ŚREDNIE (tekst w innym języku) | realny w 1.1 | nie |
| K-13 | Eksport po cichu podstawia angielski (`eksport.mjs:93`: `cueDict(l)[id] ?? cueDict('en')[id] ?? …`), więc `cues.missing` i `cuesWithoutText` = 0. Strona uznaje kartę za kompletną i pokazuje angielski tekst na stronach 33 języków: 222 ćwiczenia na język | eksport `atlas-de.json` vs `atlas-en.json`; docs/54, wiersz 190: „Nigdy fallback na en/pl” | ŚREDNIE (strona: łamie S10 i zasadę hreflang „treść w swoim języku”) | realny przy publikacji | nie |
| K-14 | Kontrakt ról: eksport `roles: [{region, text}]` (`eksport.mjs:148`), strona `L.regions[r.id]` (`techniqueatlas/src/pages.mjs:172`) → „undefined — …” przy 509 ćwiczeniach. Test strony podaje dane z `id` („dziś eksport nie ma ról”, `tests/build.test.mjs:146-148`), więc rozjazdu nie łapie | kod obu repo; [DO USTALENIA] nie uruchamiałem builda strony | ŚREDNIE | realny przy następnym buildzie z bieżącym PIN | nie |
| K-15 | Bramka recenzji na integracji: brak `docs/research/figury-recenzja.json` → eksport ma 0 figur (`recenzja-figur.mjs --skroty` → `eksportowane: []`). Skróty v2 z main nie pasują do 1.1 (squat `fd142e983e89` vs `fd180abc03f9`; bench `286637bfbd22` vs `29aee9d03e90`; hinge `b8a26c16d090` vs `d74821b853fb`). Brakuje też bramki kart DEC-10 a (`tests/karty-recenzja.test.tsx` nie istnieje na integracji). Na integracji 102 własne karty przechodzą bez wpisu recenzji (na main 52 wpisy `karty`, 1 „do poprawy”) | `ls tests/`, `git show origin/main:docs/research/figury-recenzja.json` | WYSOKIE dla wydania 1.1 (zasada „rodzina/karta bez recenzji = niewyświetlana”); naprawa = scalenie main + nowe recenzje | realny | nie (main ma bramkę) |
| K-16 | Znaki towarowe: `trademark-check.json` → `nazwy: {}` (0/709). Klucze z markami są w polu `id` eksportu (Assault Bike, Ski Erg, Bosu Ball…); HTML strony używa `slug`, nie `id` (`pages.mjs` — [DO USTALENIA] indeks wyszukiwarki). Inne nazwy do sprawdzenia przez badacza: Pec Deck, Battle Ropes, Conan's Wheel, Landmine Linear Jammer i eponimy (Arnold, Zottman, Pendlay, Meadows, JM, Tate, Svend, Gironda, Bradford, Janda, Otis, Pallof, Copenhagen) — [DO USTALENIA], nie oceniałem | `techniqueatlas/trademark-check.json` | ŚREDNIE (ryzyko S3 przy indeksowaniu; aplikacja: wytyczne Apple) | brzegowy | tak (nazwy w UI) |
| K-17 | Pochodzenie nazw z publicznej bazy (440 `fedb`) — licencja bazy [DO USTALENIA] (badacz). Opisy z bazy nie są kopiowane (notatki własne) | catalog.json `fedb` | NISKIE | teoretyczny | tak |

**Lista prawie-duplikatów i wariantów do rozstrzygnięcia (K-04).** Rozstrzyga badacz i analityk; scalenie zmienia historię, więc o nim decyduje właściciel.
- **Standing Gastrocnemius Calf Stretch ≈ Wall Calf Stretch:**
  - identyczna poza i sprzęt w `poses/mobility_stand.json`;
  - opis katalogu („Heel on a step… reach for the toes”) ma 1 źródło;
  - badacz rekomenduje przedefiniować na wariant na stopniu (`notatki/katalog-1-1/badacz-gastroc-row.md`).
- **Seated Cable Row ≈ „Wiosłowanie na linkach (siedząc)” (EN: „Seated Cable Row (home)”):**
  - identyczne `requires` i `muscleLoad`;
  - różni je tylko notatka „owner station”;
  - na stronie powstaną dwie strony o niemal tej samej nazwie.
- **Curtsy Lunge = Crossover Reverse Lunge (poza i sprzęt identyczne):**
  - drugie to wg katalogu ćwiczenie rozgrzewkowe z rotacją tułowia (`pattern: mobility`), której rysunek nie pokazuje.
- **Walking Lunges = Lunges (hantle) oraz Lunges (sztanga) = Barbell Walking Lunge (pozy identyczne):**
  - rysunek nie pokazuje marszu;
  - nazwy „Lunges” (l. mn.) nie mówią, że to wykrok w miejscu.
- **Chin Up = Neutral Grip Pull Up (poza i sprzęt identyczne)** — rodzina `ready`, widoczne w 1.1. Recenzja pull_up wskazuje podobną klasę błędu („wariant nie różni się od bazy”).
- **Leverage Shrug = Calf-Machine Shoulder Shrug** (identyczne pozy, różne maszyny).
- **Mylące pary nazw:**
  - Toe Touchers (brzuch) / Standing Toe Touches (skłon);
  - Treadmill Walking / Incline Walk (bieżnia);
  - Upper Back Stretch / Middle Back Stretch (skręt tułowia);
  - Overhead Stretch / Standing Lateral Stretch / Wall Lat Stretch;
  - Stability Ball Crunch / Crunch - Legs On Exercise Ball.
- **Kandydaci na rodzinę wariantów (grupowanie, nie scalanie):**
  - 136 par z `dups.py` (ta sama klasa sprzętu, ten sam wzorzec, mięśnie o podobieństwie cosinusowym ≥ 0,9, wspólne słowa w nazwie);
  - np. Bench Press ×7 wariantów, Cable Curl ×6, Leg Curl ×5, Kettlebell Press ×4, Wrist Curl ×6, Sumo/Box Squat z gumami i łańcuchami.

**Wyrywkowe 20 ćwiczeń (karta vs dane)** — 10 z własną kartą, 10 z zestawem ogólnym, losowo (`random.seed(28)`):
- Trap Bar Deadlift, Incline Walk, RDL (hantle/linki), Step Up, Hip Thrust (sztanga), Russian Twist, T-Bar Row, Pull Up, Seated Calf Raise, Back Squat;
- Standing Leg Curl, Band Upright Row, Wide-Grip Pulldown Behind The Neck, Pendulum Squat, Clean, Leverage Incline Chest Press, Jumping Jacks, Deadlift with Bands, Reverse Band Deadlift, Incline Cable Fly.

Wynik:
- Sprzęt i mięśnie zgodne z kartą w 16/20.
- Uwagi w 4:
  - RDL (hantle/linki) i Step Up — K-09;
  - Incline Walk — karta bez mięśni, choć `muscleLoad` ma 4 regiony po 0,5; filtr `muscleLoadOf` tnie je, bo partie są puste;
  - Deadlift with Bands / Reverse Band Deadlift — karta nie mówi nic o gumach (K-11).
- Nie oceniałem merytorycznie poprawności wskazówek — to zakres trwającego audytu.

---

## 4. Luki w zakresie (kandydaci, bez nazw marek)

Sprawdzone wyszukiwaniem podciągów w 709 nazwach. Pominąłem ćwiczenia obecne pod inną nazwą (np. Inverted Row = australian pull-up, Pullover (hantel), Machine Crunch, Snatch Deadlift = snatch-grip deadlift).

- **Rozgrzewka i mobilność** (68 w katalogu, głównie rozciąganie statyczne):
  - przeprosty z gumą lub kijem (pass-through);
  - wall slides, wall angels;
  - otwieranie klatki leżąc na boku (open book) i rotacja piersiowa w klęku;
  - 90/90 dla bioder, hip airplane;
  - mobilność kostki „kolano do ściany”, głęboki przysiad z utrzymaniem;
  - spiderman lunge;
  - pigeon, couch stretch, pies z głową w dół, kobra / sfinks;
  - unoszenia Y-T-W leżąc przodem;
  - pompka łopatkowa (scap push-up), chin tuck;
  - marsz w mostku (glute bridge march).
- **Kalistenika:** front lever i back lever (z progresjami tuck), planche (tuck / pseudo-planche push-up), human flag, skin the cat, archer push-up i archer pull-up, typewriter pull-up, shrimp squat, ring row, utrzymanie podporu na poręczach (support hold), crow.
- **Cardio:** sprint i interwały, bieg wahadłowy (shuttle), skater jumps, crab walk, shadow boxing, marsz z obciążeniem plecakiem, marsz w terenie; [DO DECYZJI] pływanie — poza siłownią.
- **Olimpijskie:** hang power clean, hang power snatch, push jerk, tall clean, drop snatch, Sotts press (eponim — badacz), jerk zza karku, clean/snatch high pull.
- **Maszyny:** wspomagane podciąganie i wspomagane dipy (popularne, brak), V-squat, modlitewnik na maszynie, wyprosty biodra na maszynie, nazwa „Seated Leg Curl” (dziś ukryta jako „Leg Curl”).
- **Inne popularne:** tibialis raise (dziś tylko wariant na Smisie), Spanish squat, B-stance RDL, suitcase deadlift, cable pullover, lean-away lateral raise, waiter curl, „21s”, Z-press.
- **Rehabilitacyjne i przedsionkowe:**
  - Aplikacja nie udziela porad medycznych, a ćwiczenia przedsionkowe są terapią. Rekomenduję poza zakresem.
  - Najwyżej ogólna „równowaga”: stanie na jednej nodze, stanie stopa za stopą, chód na palcach i piętach, step-down.
  - Opisy bez obietnic zdrowotnych, zgodnie z hierarchią źródeł.

Koszt jednego nowego ćwiczenia w obecnym modelu:
- wpis katalogu z badaniem mięśni (2 źródła albo „jedno źródło”);
- reguła rodziny;
- poza v2 i bramki 1–12 z notatki 53 (z recenzją ruchu);
- wskazówki z 2 źródłami szczebla 4;
- przekład 33 języków;
- recenzja lokalizacji;
- wpis znaku towarowego;
- test macierzy i BRD.

Szacunek: ok. 1–2 h pracy agenta na ćwiczenie przy pracy partiami po rodzinie, plus kolejka recenzji. [Szacunek, nie pomiar.]

---

## 5. Zgodność 1.0 / 1.1 i strona

| Co | 1.0 (main) | 1.1 (integracja) | Strona (eksport z integracji dziś) |
|---|---|---|---|
| Ćwiczenia | 709 | 709 | 709 × 35 języków = 24 815 stron ćwiczeń |
| Figura v2 | 87 (3 rodziny) | 98 (4 rodziny) | **0** (brak zapisu recenzji; fail closed — `recenzja-figur.mjs`) |
| Figura v1 | 68 (53 „wyswietlana”, 3 „ukryta”) | 71 | strona v1 nie eksportuje (tylko v2) |
| Własne karty | 101 (z bramką `karty`) | 102 (bez bramki DEC-10 a) | 102 w każdym języku, komplet tekstów |
| Zestawy ogólne | 70 z recenzją `zestawy` | 538 w danych (widoczne tylko z figurą v2) | 538 w eksporcie; 222/ćwiczeń na język z angielskim tekstem w 33 językach (K-13) |
| Nazwy lokalne | 0 | 0 | 0 (D2 A: angielskie; `lang="en"`) |
| Indeksowalne wg D1 (własna karta kompletna) i D3 (pl, en) | — | — | 102 × 2 = 204 strony; `config.json` → `indeksowanie: false` |
| Z figurą i własną kartą („pełna strona”) | — | 20 | **0** |
| Bez figury | 558 bez żadnej | 558 bez żadnej | 709 |
| Bez recenzji bramki 4 (stan zapisu maszynowego) | 0 rodzin v2 bez wpisu (3/3) | wszystkie 4 ready bez wpisu (pliku nie ma) | wszystkie |
| Znaki towarowe sprawdzone | — | — | 0/709 |
| Warunek startu S6 (709/709 figur albo wyjątek) | — | — | 0/709 (docs/54, wiersz 42, podaje „87 z 709” — dziś nieaktualne: aplikacja ma 98, eksport 0) |

Recenzje ruchu rodzin 1.1 istnieją jako notatki (`docs/przekazanie/notatki/recenzje-1-1/README.md` na `przekazanie-konta`, 29 rodzin z wieloma „BŁĄD”, np. hinge 22, olympic 18, bench 16). Nie przekładają się na zapis maszynowy, który czyta eksport. Tego nie powielam — to zakres trwającego audytu.

---

## 6. Opcje ulepszeń

Koszty: czas pracy agenta (z pracą równoległą), czekanie, czas właściciela, koszt w zł/USD.
Ceny API wg `docs/lokalizacja/kosztorys-przekladu-2026-10-23.md` (74 klucze × 33 języki ≈ 3 USD w trybie Batch). Szacunki dla nazw to ekstrapolacja do sprawdzenia `node scripts/i18n/przeklad-szacuj.mjs`.

### 6.1 Inwentarz i pokrycie (pkt 1)
- **A. Raport pokrycia generowany z kodu** (skrypt + `--check` w verify; tabela z pkt 1.2 per ćwiczenie i per rodzina, liczba języków z kompletem, wpis recenzji, eksport). Zysk: liczby zawsze aktualne (dziś docs/54 podaje 87, a stan to 98/0). Koszt: 2–3 h agenta, 0 zł.
- **B. Raz, ręcznie, w notatce.** Zysk: od razu. Koszt: 0,5 h; dezaktualizuje się przy pierwszej zmianie (wbrew zasadzie „dokumenty generowane z kodu”).
- **Rekomendacja: A.** Raport może zasilić inwentarz trwającego audytu (krok 1).

### 6.2 Nazwy ćwiczeń: EN + lokalna (pkt 2) — decyzja właściciela

Warunek wspólny wszystkich opcji poza N0: **najpierw poprawić kanoniczne nazwy EN** (6.3 B), bo z nich powstają przekłady i slugi. Dziś `slugs.lock.json` jest pusty, więc zmiana nazwy nic nie kosztuje na stronie. Po pierwszej publikacji każda zmiana wymaga przekierowania.

| Opcja | Co | Zysk | Koszt i ryzyko |
|---|---|---|---|
| N0 | Bez zmian (DEC-13): EN wszędzie; tylko uporządkowanie PL (7 polskich nazw i 75 nawiasów do jednego wzoru) | zgodność z decyzją, zero tłumaczeń | strona nie odpowiada na lokalne zapytania (R4 w docs/54); PL dalej mieszane, jeśli nie zrobimy porządku; agent 1–2 h |
| N1 | EN główna + **aliasy lokalne** (1–3 na ćwiczenie) tylko do wyszukiwania i metadanych: aplikacja szuka po aliasie, strona dodaje „także: …” pod H1, `alternateName` w JSON-LD i alias w `<title>` | lokalne zapytania trafiają, bez zmiany wyglądu aplikacji; aliasy mogą być potoczne (żargon siłowni) | 709 × 33 krótkich tekstów; przekład API ok. 6–12 USD (szacunek), przegląd API kilka USD; agent 6–8 h (dane, `exName`/wyszukiwanie, eksport, strona, testy, BRD); czekanie: Batch do 24 h; właściciel: zgoda na kwotę, decyzja o przeglądzie native speakerów [DO USTALENIA koszt] |
| N2 | **Obie nazwy widoczne**: na stronie lokalna w H1 + EN pod spodem (`lang="en"`); w aplikacji EN główna + lokalna drugą linią (albo przełącznik w Ustawieniach „Nazwy ćwiczeń: angielskie / w moim języku”) | pełny cel właściciela; najlepsze SEO; użytkownik rozpozna ćwiczenie w obu językach | jak N1 + układ list i nagłówków (długie nazwy de/fi/hu), VoiceOver dwujęzyczny, E2E na listach, zrzuty; agent 10–14 h; większe ryzyko złej nazwy w widocznym miejscu → każdy język do recenzji przed indeksowaniem (D3) |
| N3 | **Generator kompozycyjny**: słownik rdzeni (~150, np. „Bench Press”, „Curl”) i modyfikatorów (~80: przyrząd, chwyt, ławka, jednorącz), szablony szyku per język, wynik do przeglądu | ok. 230 × 33 ≈ 7,6 tys. jednostek zamiast 23,4 tys.; spójne nazwy wariantów; łatwe dopisywanie ćwiczeń | gramatyka (przypadki, rodzaj, szyk w ja/ko/tr/fi/hu) daje nienaturalne nazwy — sprzeczne z zasadą „jak powie trener”; agent 12–20 h; i tak potrzebna ręczna lista wyjątków |
| N4 | **Decyzja per język** na podstawie researchu: tam, gdzie na siłowniach mówi się po angielsku, zostaje EN (+ aliasy); tam, gdzie po swojemu — N2 | najbardziej naturalne | research per język (badacz; prompt dla Gemini z weryfikacją badacza), 33 decyzje; agent 4–6 h researchu + koszt N1/N2 dla wybranych języków |

**Struktura danych (wspólna dla N1–N4):**
- plik `lib/exnames/<język>.json`: klucz = `rid` (stabilny), wartość `{ n?: nazwa lokalna, aka?: [aliasy], st: 'szkic' | 'przegląd' | 'native', p?: pewność }`;
- nazwa EN w jednym polu katalogu (`nameEn`), niezależnym od klucza;
- strażniki:
  - słownik terminów (nowe pojęcia: przyrządy, chwyty, pozycje);
  - zakaz nazw marek (`tests/forbidden-names.json`);
  - długość nazwy;
  - `trademark-check` per nazwa lokalna;
  - brak fallbacku na stronie;
- role tłumacz i recenzent-lokalizacji z dopisaną sekcją o nazwach.

**Rekomendacja:**
- **N1 teraz** (aliasy, wyszukiwanie w aplikacji, metadane strony), w strukturze gotowej na N2;
- **N2 na stronie** od startu w językach z `indeksujJezyki` (dziś pl, en);
- aplikacja: wybór EN-główna vs przełącznik zostawiony właścicielowi (zmiana DEC-13);
- zakres: najpierw 305 podstawowych we wszystkich językach (≈ 43%), niszowe później;
- N3 odrzucam (sprzeczne z „tekstami naturalnymi”).

### 6.3 Jakość danych i nazwy kanoniczne (pkt 3)
- **A. Krok katalogu „porządki”**: scalenia i zmiany kluczy przez istniejący mechanizm `CATALOG_STEP` (renamed/merged), z migracją i dawnymi nazwami w wyszukiwarce. Zysk: czyste dane u źródła. Koszt: agent 4–6 h + badacz 2–3 h (każde scalenie z uzasadnieniem); właściciel decyduje o każdym scaleniu (zmienia historię użytkownika). Ryzyko: migracja danych — regresja w teście migracji.
- **B. Warstwa nazw wyświetlanych bez zmiany kluczy**: przewodnik stylu EN i mapa „klucz → nazwa EN” (jak `LIB_DISPLAY_NAME`, ale kompletna). Przewodnik: przyrząd jako przedrostek („Dumbbell Bench Press”), „Push-Up”, „One-Arm”, „Single-Leg”, „Fly”, liczba pojedyncza, bez „ - ”, małe słowa funkcyjne, „Foam Roll: X”. Do tego `rid` jako identyfikator w eksporcie i lock slugów. Zysk: spójne nazwy na stronie i w aplikacji, bez migracji, przed zamrożeniem slugów. Koszt: agent 3–5 h (709 nazw, test przewodnika stylu jako strażnik) + przegląd badacza nazw ogólnych (2–3 h); 0 zł.
- **C. Tylko oznaczenia**: dopisać do kart i rysunków różnicę wariantu (6.5 B), bez zmiany nazw i scaleń. Koszt: patrz 6.5.
- **Partie i sprzęt (K-06, K-07):**
  - (i) szyja → „inne” albo nowa partia „szyja”;
  - (ii) przywodzenia → partia „nogi” z mięśniem „przywodziciele”;
  - (iii) filtr sprzętu na stronie po `loadSource` (12 klas, z kettlebell), nie po 6 klasach aplikacji.
  - Koszt ok. 2 h agenta + `LIB_FIELD_FIXES` (migracja pól). Partie to decyzja produktowa, mięśnie rozstrzyga badacz.
- **Rekomendacja: B teraz** (przed publikacją strony). **A tylko dla par z dowodem** (Gastrocnemius / Wall Calf wg badacza, Seated Cable Row / „home”, Curtsy / Crossover), po audycie. Partie (i) i (ii) w tym samym kroku.

### 6.4 Luki w zakresie (pkt 4)
- **A. Zamrożenie katalogu w 1.1** (CLAUDE.md „Audyty i wydania” pkt 3); lista kandydatów z pkt 4 do backlogu 1.2. Zysk: warunek S6 strony (709/709) osiągalny; brak nowych recenzji. Koszt: 0.
- **B. Partia ~25 najczęściej szukanych w 1.2**: rozgrzewka i mobilność 10, maszyny wspomagane 2, olimpijskie 3, kalistenika 6, tibialis raise, Spanish squat i inne. Grupować po istniejących rodzinach, żeby nie tworzyć nowych rigów. Koszt: ok. 25–50 h agenta (szacunek 1–2 h na ćwiczenie) + recenzje + przekład (kilka USD).
- **C. Ćwiczenia własne jako wyjście awaryjne** + link „Brakuje ćwiczenia?” do formularza prośby (wzór „Poproś o funkcję”). Zysk: dane o realnym popycie przed rozbudową. Koszt: 1–2 h agenta.
- **Rekomendacja: A + C w 1.1, B w 1.2** w kolejności popytu z C. Ćwiczenia rehabilitacyjne i przedsionkowe poza zakresem.

### 6.5 Karty i treść strony (pkt 1, 3, 5)
- **A. Własne karty dla 203 podstawowych bez nich** (2 źródła szczebla 4 na ćwiczenie). Zysk: strony indeksowalne (D1), lepsza aplikacja. Koszt: ok. 10–15 min badacza na ćwiczenie → 35–50 h agenta równolegle + przekład 33 języków (kilka USD) + recenzja treści.
- **B. Zdanie „czym się różni od …”** generowane z danych wariantu (ławka, chwyt, przyrząd, guma, jednorącz) dla 538 kart ogólnych; tekst opisowy z pól katalogu, bez twierdzeń o efektach. Zysk: każda strona ma unikalną treść, a wariant jest zrozumiały. Koszt: 4–6 h agenta + przekład szablonów (mało tekstu) + wpis „konwencja” w rejestrze twierdzeń.
- **C. Strona rodziny zamiast stron wariantów** dla kart ogólnych (D1 C). Zysk: mniej stron. Koszt: gorsza odpowiedź na zapytanie o konkretne ćwiczenie.
- **Rekomendacja: B od razu, A partiami** (najpierw 305 podstawowych z danymi pozy — 257 ma pozę albo rig).

### 6.6 Eksport i strona (pkt 5)
- **A. Naprawy kontraktu przed kolejnym przypięciem (PIN):**
  - (1) scalić main do integracji (bramki DEC-10 a i zapis recenzji);
  - (2) `roles[].region` ↔ `id` — jedno pole i test parytetu po obu stronach;
  - (3) eksport bez fallbacku: brak przekładu = `missing++` i brak tekstu, a nie angielski;
  - (4) eksport po `rid` (id) + `nameEn` zamiast klucza z marką.
  Koszt: agent 3–4 h; czekanie: CI; 0 zł.
- **B. Start strony z podzbiorem**: publikować tylko ćwiczenia z figurą v2 po recenzji i z kompletem tekstu w języku, resztę dodawać, gdy dojdą figury. Wymaga zmiany S6 (wyjątki z powodem w `start-wyjatki.json` albo nowa reguła). Zysk: wcześniejszy start i SEO od razu na najlepszych stronach. Koszt: decyzja właściciela; strona na starcie mniejsza (dziś 98 kandydatów, a po recenzjach 1.1 może być ok. 450).
- **C. Start dopiero przy 709/709** (obecny S6). Zysk: pełny katalog. Koszt: czekanie na 39 rodzin (173 ćwiczenia bez żadnych danych pozy) — najdłużej.
- **Rekomendacja: A natychmiast, potem B** (decyzja właściciela; zgodne z D1 „indeksujemy tylko strony z własną treścią”).

---

## 7. Pytania, które powinien zamknąć trwający audyt „wszystkich ćwiczeń i grafik”
1. **Identyczne pozy różnych ćwiczeń (72):** które to błąd rysunku, a które dopuszczalne przybliżenie? W szczególności Chin Up / Neutral Grip (ready), Curtsy / Crossover Reverse, Walking / stationary lunge, Gastrocnemius / Wall Calf.
2. **Partie:** szyja w „barkach”, przywodzenia w „pośladkach”, „Incline Shoulder Raise” (zębaty) w „barkach” — czy to konwencja z decyzją, czy błąd danych?
3. **Mięśnie spoza mapy** (rotatory, zębaty, zginacze biodra, piszczelowy): pokazywać jako „inne” czy dodać regiony?
4. **Karty mieszające przyrządy** („RDL (hantle/linki)”) — czy ustawienie ma opisywać oba?
5. Czy 53 nowe zdania 1.1 mają być przetłumaczone przed wydaniem 1.1 (8 ćwiczeń z figurą je pokazuje)?
6. Zapis recenzji rodzin 1.1 w formie maszynowej (sekcja `v2` z aktualnymi skrótami), żeby eksport mógł je wpuścić.

## 8. [DO USTALENIA]
- Licencja publicznej bazy ćwiczeń, z której pochodzi 440 nazw (badacz).
- Znaki towarowe nazw z K-16 i eponimów (badacz; S3 strony).
- Czy podział martwych ciągów do partii „plecy” to zamierzona konwencja.
- Build strony z bieżącym PIN (nie uruchamiałem) — potwierdzenie K-14 na wygenerowanym HTML.
- Koszt przeglądu native speakerów dla nazw (N1/N2) — wycena właściciela.
- Rzeczywisty koszt przekładu nazw: `node scripts/i18n/przeklad-szacuj.mjs` na zestawie 709 nazw (nie uruchamiałem, szacunek z kosztorysu 23.10).
