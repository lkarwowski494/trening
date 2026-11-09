# Stan — partia rodzin 1 (linia 1.1)

Gałąź `figury/partia-1` od `origin/integracja-1-1` @ aeabf69. Zlecenie koordynatora 09.11.2026 (sesja koordynatora linii 1.1).
Rodziny: calf_raise, row, kb_ballistic, chest_fly, overhead_press (kolejność: od najmniejszej — pomiar czasu na rodzinę).
Brief autora rodziny: `briefy/partia-1-autor.md`. Recenzja: subagent `audytor` (≠ autor), pliki `docs/research/recenzje/partia1-<rodzina>-*`.

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą): overhead_press +21, chest_fly +17, kb_ballistic +16, calf_raise +12, row +12 (pełna karta).

| Rodzina | Autor (SHA) | Recenzja ruchu | Nakładka/zestawy | Wpisy | Stan |
|---|---|---|---|---|---|
| calf_raise | — | — | — | — | w toku |
| row | — | — | — | — | otwarte |
| kb_ballistic | — | — | — | — | otwarte |
| chest_fly | — | — | — | — | otwarte |
| overhead_press | — | — | — | — | otwarte |

## overhead_press (autor, 09.11.2026; start 20:34, koniec ok. 21:00 UTC; gałąź figury/partia-1-ohp)

Zrobione (SHA 2bf82137 + ten commit stanu):
- Podłączenie: families.ts `ready`, `LOAD` w poseData.ts, `DATA_UI.overhead_press` (Wypychanie/Opuszczanie, łokieć; wyjątek Pike Push Up: najpierw Opuszczanie, lowerFirst). 21 z 23 ćwiczeń ma rysunek; Bradford Press i Handstand Push Up bez rysunku (WYJATKI w generatorze: OTWARTE, brak źródła ruchu; brak wskazówek) — do decyzji właściciela, nie dopisywałem wyjątku.
- Generator zgodny z plikiem póz od startu (odtwarzanie-poz: puste) — rozbieżności (a) brak. Poprawki w generatorze: (1) 4 ćwiczenia z hantlami (Overhead Press hantle, Seated Shoulder Press hantle, Single Arm, See-Saw) miały obrót przedramienia 0 (młotkowy) → oś hantla w poprzek↔wzdłuż↔w poprzek w trakcie ruchu; teraz −80° (granica ±80 kontraktu; stała HW), oś ≤ 15° od osi z. (2) Single-Arm Linear Jammer: dłoń 12 cm od osi, gryf (20 cm, środek z=0, rig rysuje go zawsze na osi) kończył się przed dłonią, ślad 12 cm od chwytu → zh = 2 cm (ślad 2 cm).
- Nakładka `lib/figures/v2/overlay/overhead_press.ts` (3 elementy: ohpElbowLimb wyprost_lokci, ohpElbowsUnderRef pion przez NADGARSTEK do wysokości łokcia w side+front, ohpBarOverShoulderRef pion przez bark w górę w side); rejestr dopisany na końcu TECHNIQUE. Bez elementu: ciezar_nad_glowe, start_przy_barkach (strefy), tulow_wysoko, krotkie_ugiecie/nogi_pracuja (mierzony staw to łokieć), analogie. Ćwiczenia bez wskazówki powiązanej z regułą (Arnold ×1, KB Press, Single Arm, Landmine ×3, Pike, Push Press) bez elementu.
- Test `tests/figures-v2-ohp-p1.test.ts` (26 testów, zielony): podłączenie, DATA_UI, ślad ≤ 3 cm (negatyw +5 cm), styk (ciężar vs ciało ≥ 0 cm; zza karku gryf–głowa/szyja ≥ 0; ławka ≥ −1 cm; checkFrame), oś hantla (negatyw: obrót 0), K8 z reguł (łokieć ≤ 20°, chwyt ≤ 20 cm nad barkami na dole, ≥ 10 cm nad głową, ≤ 10 cm przed/za barkiem, łokieć ≤ 10 cm od nadgarstka i chwytu), rejestr nakładki i miary elementów z negatywami, błąd Pike.
- Dane przeliczone: zrodla-runtime --write, macierz (po `git add`: test-matrix czyta tylko śledzone pliki — pułapka), pokrycie, README.

Zostało / następny krok:
1. Pełny przebieg `npx jest tests/figures-v2 tests/figury --runInBand` NIE został dokończony (po 20 min nadal biegł; równolegle inne sesje). Uruchomić w paczkach i poprawić testy zmienione przez podłączenie: na pewno `tests/figures-v2-mapping.test.ts` (lista ready, POSE_FAMILIES, licznik figur +21), prawdopodobnie testy wymieniające rejestr TECHNIQUE / `figures-v2-nakladka-fix4`, `figury-recenzja`/`karty-recenzja`/`l047`/`zrodla-runtime` (dozwolone czerwone). Wzór zmian: commit 94abf6cd na figury/partia-1-row.
2. Zestawy ogólne do recenzji (cue-sets.json): Double Kettlebell Press (ohp: move/tall/elbowsUnder), Kettlebell Arnold Press (ohp: move/tall/fullExt — Arnold z obrotem, zdania zwykłego wyciskania), Seated Cable Shoulder Press (move/seat/fullExt), See-Saw (move/elbowsUnder/tall, ruch naprzemienny), Standing Barbell Press Behind Neck (tall/fullExt — „prosto nad głowę” przy chwycie zza karku), Push Press - Behind the Neck (pp.dip/pp.legs), Landmine Press (press.noLock, plank.brace), Landmine Linear Jammer i Single-Arm Linear Jammer (pp.legs, plank.brace), Pike Push Up (plank.brace przy biodrach w górze). CUE_REQUIRES/CUE_NOT_IN_FAMILY nie dopisywałem.
3. Karty v1 do `zastapiona` (robi programista partii): Overhead Press (sztanga), Overhead Press (hantle), Seated Shoulder Press (hantle), Push Press, Wyciskanie nad głowę (linki). Karty własne z wpisem „karty” już są: Push Press, Arnold, Seated BB, KB Press, KB Seated, Band, Single Arm; własne BEZ wpisu „karty” (sprawdzić cueSelection=own): m.in. Overhead Press (sztanga), Overhead Press (hantle), Seated Shoulder Press (hantle), Wyciskanie nad głowę (linki).
4. Nie zrobione: BRD (docs/brd) i i18n — brak nowych kluczy UI (nazwy faz istniejące); nie uruchamiałem verify.

Wnioski z oglądania arkuszy (arkusze poza repo; obejrzane w pełnej rozdzielczości: sztanga, hantle, siedzące hantle, Arnold, KB Press, Double KB, Landmine ×3 (Press, Linear Jammer, Single-Arm), Pike, Push Press, BTN, Seated BB, Seated Cable — 15 z 21; NIE obejrzane wprost: Band, linki stojące, KB Seated, KB Arnold, See-Saw po poprawce, Single Arm DB, Push Press BTN):
- Szczyt: ramię ok. 9° przed pionem, chwyt ~7 cm przed barkiem, łokieć 9° — to limit zakresu barku silnika (shSag 171°; xTop=6 w generatorze nie jest błędem: xTop −2 daje 180° i odrzuca pozę). Pion barku w nakładce pokazuje to przesunięcie (reguła: ≤ 10 cm).
- Sztanga przed twarzą: odstęp gryf–głowa ≥ 8,7 cm (bez cofania głowy), zza karku ≥ 1,9 cm; brak przenikania.
- Landmine: gryf rig-owy zawsze poprzeczny (z, 20 cm) przy dłoniach w widoku z przodu — ograniczenie silnika (zgłosić: gryf landmine powinien leżeć wzdłuż osi dźwigni). Pozostałe landmine OK (łuk wokół osi, łokieć 141° → 16°).
- Pike Push Up: kadr wygląda poprawnie (biodra w górze, głowa do podłogi), ślad = miednica.
- Seated: ławka z oparciem 85° jak krzesło, słupek stojaka 35 cm za oparciem — akceptowalne.
