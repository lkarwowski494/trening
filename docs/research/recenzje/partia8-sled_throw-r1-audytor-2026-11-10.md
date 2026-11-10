# Partia 8 — sled_throw, recenzja niezależna r1 (audytor, 10.11.2026)

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusze ze śladem toru). Stan zamrożony: figury/partia-8-sled_strongman @ 75777836, odłączony worktree recenzenta. Recenzent nie pisał rodziny, nakładki, kart ani zestawów.

**Werdykt rodziny: do poprawy** (1 × WYSOKIE: W1).

## Zakres i metoda
- Arkusze `scripts/figures/arkusz-slad.mjs` wygenerowane samodzielnie: 8 ćwiczeń, widok side (+ Wall Ball front, EXERCISE_VIEWS) = 9 arkuszy, 21 kadrów co 0,05, PNG 2100 px obejrzane w pełnej rozdzielczości.
- Liczby z `frameAt` (u co 0,05 i 0,01): kąty kolana/biodra, pochylenie tułowia, położenie chwytów, barku, głowy, piłki; `checkFrame` (0 kolizji we wszystkich kadrach), stopy ≥ −0,2 cm względem podłogi.
- Kształt toru (miara z tests/figures-v2-tor.test.ts, 25 próbek) policzony samodzielnie.
- Testy pojedyncze `--runInBand`: figures-v2-sled-throw, figures-v2-strongman, figures-v2-sled-throw-tor, figures-v2-tor — 230/230 zielone.
- `assignAll()`: 19 ćwiczeń rodziny (8 z rysunkiem, 11 bez pozy).

## Znaleziska
| ID | Klasa | Pewność | Ćwiczenie | Opis i miara | Realność |
|---|---|---|---|---|---|
| W1 | WYSOKIE | 85% | Backward Medicine Ball Throw | Ruch kończy się piłką pionowo nad głową, nie „za siebie”. u = 1: x chwytu −0,4 cm, x barku −5,7 cm, x głowy −6,8 cm → dłonie 5,3 cm PRZED linią barków (ramię 4,8° przed pionem), tułów odchylony tylko 6°. Karta (bmbt.move): „przerzuć ją nad głową za siebie”; opis ruchu w figury-sens (dynamiczne): „ręce za głowę”. Silnik to umie: Standing Two-Arm Overhead Throw w u = 0 ma piłkę 6,6 cm za głową. Test odtwarzający: w u = 1 x_chwyt < x_bark (dane 75777836 oblewają: +5,3 cm). | realny — Biblioteka → Backward Medicine Ball Throw → Technika: animacja wygląda jak wyrzut w górę |
| Ś1 | ŚREDNIE | 85% | Wall Ball | Dno przysiadu nad równoległą: u = 0,40 staw biodrowy 11,0 cm nad kolanem, udo 17° nad poziomem (kolano 78° wewn., biodro 90°), a karta ma błąd wb.mis.shallow „Za płytki przysiad”. Reguła wallball_przysiad (analogia, zgięcie kolana ≥ 80°: jest 102°) przechodzi, karta nie podaje głębokości — dlatego nie blokuje. Propozycja: dno z biodrem ≤ wysokości kolana. | realny (każde wyświetlenie), niejednoznaczny |
| N1 | NISKIE | 95% | Medicine Ball Slam | Reguła slam_plecy („ustalone”) ma `cue: hinge.back`, ale `wskazowki_na_reguly` sled_throw nie mapuje hinge.back — dlatego brak elementu. Uzasadnienie w nagłówku overlay/sled_throw.ts poprawne; dopisanie mapowania to decyzja badacza. | — |
| N2 | NISKIE | 100% | (testy) | tests/figures-v2-nakladka-triceps-olympic.test.tsx w opisie wskazuje tests/figures-v2-nakladka-sled-throw.test.tsx — pliku nie ma (nakładkę sprawdza figures-v2-sled-throw.test.tsx). | — |
| N3 | NISKIE | 90% | (testy, K14) | Warunek „rodzina z danymi ma wpis DATA_UI” zastąpiony `dataUiForPose` (figures-v2-data, figures-v2-mapping): każde ćwiczenie z `petla: cykl_lustro` bez wpisu dostaje GAIT_UI („Marsz”). Dziś cykl_lustro mają tylko marsze (carry 7, sled_throw 2, strongman 1) — bez skutku; komentarz poseData.ts:6 („MUSI mieć wpis (test)”) jest nieaktualny. Propozycja: strażnik „cykl_lustro bez DATA_UI ⇒ chód”. | teoretyczny |

## Pytania autora
1. **tor-wyjatki.json (6 wpisów):** liczby zgadzają się z pomiarem recenzenta (odchylenie / zawrócenia): Slam 43,0/1, One-Arm 43,0/1, Backward 53,6/1, Scoop 12,2/1, Standing Two-Arm 23,5/0, Wall Ball side 15,8/2. Łuk ramion obracających się w barkach jest zamierzony, kształty na arkuszach bez „S” poza Wall Ball (dwa zawrócenia w x: zejście z piłką przy klatce, potem wyrzut — zgodne z ruchem). Wall Ball front: 0,0 cm — test toru i tak nie sprawdza widoku front (CASES biorą widoki rodziny: side). Wpis Backward może się zmienić po W1.
2. **contract.ts, ślad `pilka_lekarska`:** poprawny; ślad = środek chwytów (oburącz) albo chwyt R (`trzyma: 'R'`, One-Arm), w każdym kadrze 0,0 cm od chwytu. Piłka One-Arm rysowana 10 cm nad dłonią (leży na dłoni) — ślad przy dłoni, zgodnie z K4. Przypadek negatywny (miednica > 9 cm) jest; test sprawdza wynik keyframeFrame, więc po cofnięciu gałęzi kontraktu pada.
3. **Slam kończy się ok. 51 cm nad podłogą:** u = 1 piłka na wys. 50,8 cm (One-Arm 60,8 cm), ręce w dół i lekko w przód (chwyt 26 cm przed barkiem), tułów 52°, kolana 58° zgięcia. To moment wypuszczenia; karta („rzuć ją prosto w dół, w podłogę”) nie wymaga pokazania uderzenia — rysunek nie przeczy karcie. Plecy proste (tułów sztywny), piłka na szczycie 40 cm nad głową (slam_nad_glowa ≥ 5 cm spełnione).
5. **Nakładka:** tylko reguły „ustalone”, cue obecne na karcie (Sled Push własna; Sled Drag i Scoop Throw przez zestaw ogólny — elementy pojawią się po wpisach „zestawy” z tej recenzji), elementy tylko w rzucie z boku (rodzina ma jeden widok). Brak elementu dla slam_plecy — uzasadnienie poprawne (N1). wallball_kolana pominięta słusznie (sq.kneesToes nie ma na karcie Wall Ball).
6. **Testy K14:** figures-v2-data/mapping — N3; wykluczenie sled_throw/strongman z ogólnego testu faz zastąpione testami rodzin (fazy „Rzut”/„Marsz”, widoki); liczby 386 → 395 (strona) i 13 rodzin (gemini) zgodne z +8 +1 i dwiema rodzinami ready; zmiany KO-022 (skrot-v2-*, curl-poprawki, architecture-limits) to przeniesienie ścieżek na pliki rodzin bez osłabienia (architecture-limits zaostrzony: usunięty wyjątek rozmiaru poseData.ts).

## Ruch pozostałych ćwiczeń (bez znalezisk)
- Medicine Ball Slam / One-Arm: start na palcach, piłka nad i lekko za głową, zawias do 52°, ręka wolna w One-Arm towarzyszy.
- Standing Two-Arm Overhead Throw: piłka 6,6 cm za głową w u = 0 („trochę za nią”), wyrzut przed siebie z wyprostu (kolano 179°).
- Medicine Ball Scoop Throw: z przysiadu (kolano 78° wewn.) do pełnego wyprostu (kolano 179°, biodro 171°, wspięcie na palce) — mb.legs spełnione; wyrzut 42° przed pionem.
- Sled Push: dłonie na pionowych uchwytach (75; 88 cm), tułów 33° w przód (sled.lean), napęd nóg naprzemienny.
- Sled Drag (Harness): przodem od sanek, linka od pasa (miednica), tułów 34° w przód, ręce w naprzemiennym wymachu.
- Wall Ball: piłka przy klatce na starcie, wyrzut jednym ruchem nad głowę, ściana przed ćwiczącym; poza Ś1 bez uwag.

## Skróty (policzone samodzielnie, `node scripts/zrodla-runtime.mjs --skroty` @ 75777836)
v2 sled_throw 693594ff4218; karty: Medicine Ball Slam cbe93cfddf5e, Standing Two-Arm Overhead Throw 85de3b2b60b3, Backward Medicine Ball Throw 871996234a76, Wall Ball 6f2a286d08b6, Sled Push ef9ee9fdcec0; zestawy: One-Arm Medicine Ball Slam ad4e223d4754, Medicine Ball Scoop Throw 12ca0a03ffbe, Sled Drag (Harness) 6fc414841b18.
