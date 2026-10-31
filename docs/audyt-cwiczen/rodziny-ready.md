# Partia 2 — 4 rodziny `ready`: squat, bench_press, hinge, pull_up (stan `integracja-1-1` @ 46a8f1cc)

Audytor niezależny (nie był autorem figur ani kart). Metoda: pomiary ze współrzędnych silnika (`frameAt`, `shapesAt`, `jointAngles`; moduły TS ładowane jak `scripts/strona/ts-loader.mjs`), kadry u = 0…1 co 0,05, wszystkie widoki ćwiczenia, z mięśniami i trybami błędów. Porównanie z drugim drzewem roboczym na `wersja-1-0-1-r2` e796c7ed. Reguły jakości: `node scripts/figures/jakosc-raport.mjs --json` (536 pozycji, 1 naruszenie: Wall Sit „klatki_rozne” — figura statyczna, oczekiwane). Arkuszy PNG nie generowano (bez playwrighta w tej sesji) — ocena wizualna sylwetek zostaje dla recenzenta bramki 4.

## 1. Dlaczego rodziny są ukryte (potwierdzone)

- Skrót rodziny = plik rigu/póz + `V2_WSPOLNE` (`scripts/zrodla-runtime.mjs:94–95`). Przeliczony przez audytora z drzewa e796c7ed daje dokładnie skróty z wpisów v2 w `docs/research/figury-recenzja.json` (squat d2d946b53cf5, bench_press 0bb8fc229bf7, hinge e9af1b06ec31). Na 46a8f1cc: 2995928b0ddf, cd6e3751e4d5, 3fb8aebb32e3 → `lib/figures/data.json` `v2: []`.
- pull_up nie ma wpisu v2 w recenzji (tylko squat, bench_press, hinge) — rodzina nigdy nie przeszła bramki 4 ruchu.
- Pliki wspólne zmienione od e796c7ed (`git diff --stat e796c7ed HEAD -- lib/figures/v2`): draw.ts, scene.ts, skeleton.ts, figure.ts, anim.ts, errors.ts, math.ts, variants.ts, rigs/benchPress.ts (normalizacja bieguna łokcia), rigs/squat.ts (pole `barBack`, nieużywane przez żaden wariant), a poza skrótem także contract.ts, contacts.ts, guides.ts, muscles.generated.ts, poseData.ts, render.ts, ui.ts, cue-sets.json.

## 2. Rysunek wobec stanu zrecenzowanego (87 ćwiczeń squat/bench_press/hinge)

Odciski kształtów (21 kadrów × widoki × tryby błędów, z mięśniami; współrzędne zaokrąglone do 0,1):

- **62 identyczne** z e796c7ed (pełna lista w `lista.md`, kolumna „Rysunek wobec 1.0.1”).
- **16 różnią się tylko błędem „pięty” z przodu** (Back Squat, Front Squat, Przysiad z pasem (linki), Cable, Bodyweight, Smith, Zercher, Double KB Front, Landmine, Reverse Band Power, Squat with Bands/Chains, Overhead, Dumbbell, Dip Belt, Band Squat): spód buta z przodu od y = 0 (wcześniej 5,7). Z przodu przy uniesionej pięcie palce zostają na podłodze, więc nowy rysunek jest poprawniejszy; błąd nadal widać z boku. Wymaga tylko potwierdzenia w recenzji.
- **9 różni się w pozie bazowej**: Box Squat ×4 (z przodu kolejność rysowania skrzyni z −1040 na −11,5), Deficit Deadlift (podest z przodu, to samo), Single Leg RDL ×2 (stopa wolnej nogi z przodu: podeszwa 51,5 → 39,5), One-Arm Kettlebell Floor Press (z góry kettlebell y 21,5 → 33), Smith Machine Stiff-Legged Deadlift (zmiana ruchu: `variants.ts` `sx: [-2, 20]`, tor gryfu 7,3 cm przed śródstopiem na całym ruchu, prowadnica Smitha — tor pionowy).
- Wniosek: pomiar koordynatora (78/87 identycznych pozy) potwierdzam (62 + 16). Z mięśniami i błędami liczę **62** identyczne (koordynator: 58 — różnica metody, bez wpływu na wniosek).

## 3. Pomiary ruchu (wszystkie 98 ćwiczeń z figurą)

Skrót (pełne liczby w skrypcie audytora; nie trafiają do repo):
- **Styk z podłogą/sprzętem:** stopy y = 0 na każdym kadrze we wszystkich ćwiczeniach stojących (Deficit: 6 = podest; decline: 59 = podpórka; floor press: 2 = kolana ugięte na podłodze); pięty nie odrywają się w pozie poprawnej (max 0). Pull_up: stopy 19–115 cm nad podłogą (zwis), dłonie na drążku (y 230/245).
- **Tor ciężaru wobec śródstopia (z boku):** martwe ciągi z podłogi −1,7…+4,1 cm (Deadlift (hantle) −1,7…+0,1 — wada z TestFlight usunięta), sumo −0,5…+5,7, RDL ≤ 6,9, Good Morning 0,1, przysiady ze sztangą 0,2 (front 0,2…3,5, Zercher 0,2…8,4). Wyjątki z założenia: Smith (gryf w prowadnicy, −13,8 przysiad / +7,3 SLDL), pas biodrowy (ciężar = miednica), Barbell Hack Squat (OP-1).
- **Kierunek u i fazy:** przysiady, RDL, Good Morning, wyciskania — u = 0 góra, pierwsza faza „Opuszczanie”; martwe ciągi i Rack Pull — u = 0 dół, „Podnoszenie”; pull_up — u = 0 zwis (łokieć 14°), u = 1 broda 3 cm nad drążkiem (łokieć 142°), „Podciąganie”. Dead Hang i Wall Sit statyczne (bez animacji i licznika, `components/ExerciseFigureV2.tsx:68`).
- **Kąty skrajne:** przysiad 104–128° w kolanie (Box 104,6 = skrzynia), Good Morning tułów 21→42° (karta „nie dalej niż do poziomu” — zgodne), RDL tułów 55–68°, wyciskanie łokieć 4° → 120–145° (Chain Press 90°, zrecenzowane), Front Squat ramię 83–87° (łokcie wysoko — zgodne z kartą).
- **Pull_up (11, pierwsza ocena):** One Arm Chin-Up — wolna ręka (łokieć 103°) nie na drążku; Gironda — odchylenie tułowia 0→40°, mostek do drążka (broda 19 cm pod drążkiem); Wide-Grip Rear Pull-Up — głowa 17,7 cm przed drążkiem na górze (drążek za karkiem); Gorilla Chin/Crunch — kolana 29→110°, biodra 11→70° razem z podciąganiem; Scapular Pull-Up — łokcie proste (7°), ciało w górę o 8 cm. Bez wady ruchu w pomiarach; Side To Side Chins — ACG-005.

## 4. Karta a rysunek (98)

- Karty własne (20: squat 5, bench_press 5, hinge 7, pull_up 3) — recenzja treści aktualna (skróty zgodne); zdania nie przeczą pomiarom (np. Deadlift „barki mniej więcej nad sztangą”, Front Squat „łokcie wysoko”, Good Morning głębokość).
- Zestawy ogólne squat/bench_press/hinge (70) — recenzja 28.10 z aktualnym skrótem; dopasowanie do ćwiczenia potwierdzam dla każdego (lista w `lista.md`).
- Zestawy ogólne pull_up (8) — bez recenzji; 5 nie pasuje (ACG-001), Dead Hang z uwagą (ACG-004), Gorilla Chin brak przekładów (ACG-003).

## 5. Znaleziska partii 2 (szczegóły w `raport.md`)

ACG-001 (WYSOKIE), ACG-002 (ŚREDNIE), ACG-003 (ŚREDNIE), ACG-004 (NISKIE), ACG-005 (NISKIE). Otwarte pytania: OP-1 (Barbell Hack Squat), OP-2 (Pin Press i Good Morning off Pins zaczynają od góry), OP-3 (ostrzeżenie przy Barbell Guillotine Bench Press).
