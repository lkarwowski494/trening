# Recenzja niezależna ruchu — partia wspólna B (W1/W2/H1 + podłączenie curl) — bramka 4, L-047, L-050

- Data: 03.11.2026. Recenzent: audytor (niezależny). Autor: programista curl. Gałąź `figury/curl-wspolne` @ 90a7821c (worktree /home/user/wt-curl-b, tylko odczyt, `git status` czysty), zmiany 6102b96d..90a7821c nad 1065b7c6.
- Pozy curl (`lib/figures/v2/poses/curl.json`) bez zmian względem r3 (`git diff a2ed2b85..HEAD -- lib/figures/v2/poses/` pusty) — oceniam tylko wpływ W1/W2/H1 i podłączenia; reszta ruchu jak w r3 (docs/research/recenzje-figur/curl-r3.md).
- Liczby: skrypt poza repo (<scratchpad>/an/m.mjs, `loadV2` z scripts/figures/v2-build.mjs, `frameAt` w 41 próbkach u): zgięcie łokcia, dryf łokcia, źródło śladu (odległość od chwytu R/L i miednicy), odchylenie śladu od cięciwy w każdym widoku, oś hantla.
- Arkusze obejrzane w pełnej rozdzielczości: curl/Biceps-Curl-hantle-front.png, curl/High-Cable-Curl-front.png, curl/Hammer-Curl-front.png, curl/Hammer-Curl-side.png, curl/Cross-Body-Hammer-Curl-front.png, roznica/Pull-Up-side.png (katalog /home/user/arkusze-curl/arkusze-wspolne/).
- Skróty: `node scripts/zrodla-runtime.mjs --skroty` na 90a7821c (rodzinaSkrot = plik rigu/póz + V2_WSPOLNE, scripts/zrodla-runtime.mjs:97,103).

**Wynik: curl — 22 wyswietlana, 12 poprawka (W1b, WYSOKIE), 0 wstrzymana jako ruch; rodzina jako całość do poprawy (wpis v2 „ukryta” do czasu poprawki W1b). Rodziny ready: 4 × wyswietlana (różnica bez zmian merytorycznych, nowe skróty).**

## Znaleziska

| ID | Poziom | Pewność | Ćwiczenia | Wada | Kroki w aplikacji | Realność | Dowód | Poprawka |
|---|---|---|---|---|---|---|---|---|
| W1b | WYSOKIE | 90% | 12 obustronnych z dwoma osobnymi ciężarami: Biceps Curl (hantle), Hammer Curl, Standing Dumbbell Reverse Curl, Standing Inner-Biceps Curl, Incline Curl (hantle), Incline Hammer Curl, Lying Supine Dumbbell Curl, Preacher Curl, Preacher Hammer Dumbbell Curl, Spider Curl, Cable Curl (dwie linki), High Cable Curl | W1 ustawia ślad „obie ręce — środek między chwytami” (contract.ts:421–423). Przy dwóch osobnych ciężarach środek wypada w osi ciała, gdzie nie ma żadnego ciężaru: w widoku z przodu „tor ciężaru” to pionowa kreska wzdłuż mostka (Biceps Curl, Hammer Curl), a w High Cable Curl krótka strzałka na twarzy/głowie, daleko od dłoni przy uszach. Pomiar: odległość śladu od chwytu R/L = połowa rozstawu (25 cm hantle, 31 cm Inner-Biceps, 29–81 cm High Cable), odchylenie w widoku front = 0,0 (linia w osi). Rodziny rigowe mają tę samą sytuację rozwiązaną odwrotnie, jako poprawkę: squat.ts:194 i hinge.ts:218 („hantle po bokach: ślad toru przy hantlu (widok z przodu), nie w osi ciała”), benchPress.ts:151 | Ćwiczenie → rysunek → widok z przodu (np. Hammer Curl, High Cable Curl) | realny (każde wyświetlenie widoku z przodu tych 12 ćwiczeń) | curl/Biceps-Curl-hantle-front.png (wszystkie 21 kadrów: przerywana linia od krocza do mostka, hantle po bokach bez śladu); curl/High-Cable-Curl-front.png (strzałka śladu na twarzy, dłonie 30–70 cm obok); curl/Hammer-Curl-front.png (jak Biceps) | Dla dwóch osobnych ciężarów (hantel bez `trzyma` = para hantli; wyciąg z dwoma uchwytami) ślad = chwyt jednej ręki (np. R, jak w rigach), nie środek; środek tylko dla jednego uchwytu wspólnego (drążek, lina, gryf). Strażnik: w widoku front ślad obustronnych hantli/dwóch linek ma |z| ≥ szerokość barków (wzór squat.ts:194); test toru (C) tego nie łapie |
| C1 | ŚREDNIE | 85% | test tests/figures-v2-tor.test.ts | Próg łuku 30 cm przepuszcza ślad w złym miejscu (W1b: odchylenie 0,0 w osi ciała) i jest o ok. 6 cm luźniejszy od geometrii (patrz C) | — | brzegowy (strażnik, nie UI) | pomiary niżej | patrz C |
| N5 | NISKIE | 85% | 17 ćwiczeń curl z zestawem ogólnym bez wpisu „zestawy” (wszystkie „general” poza Seated CG) | Bez recenzji zestawu ogólnego ui.ts:24 zwraca brak wskazówek i błędów — rysunek bez sekcji „Czego unikać” i bez animacji błędu tempa. Fail-closed, zgodne z regułą; to luka treści, nie ruchu | Ćwiczenie, np. Drag Curl → karta bez wskazówek | realny | figury-recenzja.json „zestawy”: z 34 curl tylko Seated CG | backlog / recenzja zestawów — nie blokuje rysunku |

## A) 34 ćwiczenia curl

Wspólne dla wszystkich: ustawienie, zakres łokcia, pozycja ramienia — bez zmian względem r3 (pozy bez zmian); potwierdzam liczbowo: zgięcie min–max i dryf łokcia jak w r3 (np. Barbell Curl 13–149°, dryf 3,7 cm; Drag Curl dryf 25 cm, łokcie w tył; preacher ×8 ramię 40° od pionu, nieruchome; Incline ramię −4…2° za tułowiem; Bayesian ramię −35°; Lying CG High Pulley ramię −158°). Ślad (L-050): przy sztandze/EZ = środek gryfu (info.load, bez zmian), przy jednym uchwycie wyciągu/linie = środek uchwytu (poprawnie), przy `trzyma` = chwyt tej ręki (poprawnie: Cross Body, One-Arm Cable, Bayesian, Concentration ×2, One Arm DB Preacher, Machine). W widoku z boku ślad wszystkich 34 leży na dłoni/gryfie i kreśli łuk wokół łokcia (odchylenie od cięciwy 12,5–23,8 cm; Hammer-Curl-side.png: łuk na hantlu, strzałki na obu końcach).

H1 (oś hantla): poprawka potwierdzona. Hammer-Curl-side.png — hantel prostopadle do przedramienia w płaszczyźnie strzałkowej (przy przedramieniu poziomo — pionowo, u = 0,5); Hammer-Curl-front.png — główki nad i pod dłonią (chwyt młotkowy), nie poprzeczny gryf; Cross-Body-Hammer-Curl-front.png — hantel pionowo przy dłoni idącej do przeciwnego barku. Liczbowo: oś w 4 hammerach ma z = 0 w całym ruchu (np. Hammer u = 0,5: [−0,02, −1,00, 0]). Biceps Curl (hantle), Incline, Preacher Curl, Concentration ×2, Lying Supine (obrót 0→70): przy dole oś przód–tył (chwyt neutralny), dalej płynnie w poprzek — zgodne z supinacją w trakcie ruchu.

| # | Ćwiczenie | Werdykt | Uwagi |
|---|---|---|---|
| 1 | Barbell Curl | wyswietlana | ślad = gryf, łuk 22,6 cm (bok) |
| 2 | EZ Bar Curl | wyswietlana | łuk 23,8 cm; W2: talerze na końcach gryfu 120 (plateZs, draw.ts:10–13) |
| 3 | Reverse Curl | wyswietlana | nachwyt, łuk do 123° |
| 4 | Drag Curl | wyswietlana | ślad pionowy (0,0 cm od cięciwy) — zgodne z cechą ćwiczenia |
| 5 | Biceps Curl (hantle) | poprawka | W1b: ślad z przodu w osi ciała (arkusz front) |
| 6 | Hammer Curl | poprawka | H1 naprawione; W1b |
| 7 | Standing Dumbbell Reverse Curl | poprawka | W1b; nachwyt (obrót −70, oś w poprzek) poprawnie |
| 8 | Standing Inner-Biceps Curl | poprawka | W1b (ślad 31 cm od każdej dłoni) |
| 9 | Cross Body Hammer Curl | wyswietlana | H1 naprawione; ślad na prawej dłoni, ukośnie do przeciwnego barku |
| 10 | Cable Curl | wyswietlana | jeden uchwyt — środek poprawny; karta własna bez „mistakes” → brak błędu (zgodne) |
| 11 | Reverse Cable Curl | wyswietlana | jeden uchwyt |
| 12 | Hammer Curl (linki) | wyswietlana | lina — środek poprawny |
| 13 | Standing One-Arm Cable Curl | wyswietlana | ślad na prawej dłoni |
| 14 | Cable Curl (dwie linki) | poprawka | W1b: dwa uchwyty, ślad w osi |
| 15 | Incline Curl (hantle) | poprawka | W1b |
| 16 | Incline Hammer Curl | poprawka | H1 naprawione; W1b |
| 17 | Lying Supine Dumbbell Curl | poprawka | W1b (ślad nad tułowiem, hantle obok ławki) |
| 18 | High Cable Curl | poprawka | W1b — najwyraźniej: ślad na głowie (High-Cable-Curl-front.png) |
| 19 | Bayesian Curl | wyswietlana | ślad na prawej dłoni |
| 20 | Concentration Curl (hantle) | wyswietlana | ślad na dłoni z hantlem |
| 21 | Seated Close-Grip Concentration Barbell Curl | wyswietlana | gryf; W2; błąd tempa — patrz D |
| 22 | Standing Concentration Curl | wyswietlana | ślad na dłoni |
| 23 | Lying Close-Grip Bar Curl On High Pulley | wyswietlana | jeden drążek — środek poprawny |
| 24 | Lying Cable Curl | wyswietlana | jeden uchwyt |
| 25 | Barbell Preacher Curl | wyswietlana | gryf |
| 26 | Preacher Curl (EZ) | wyswietlana | gryf; W2 |
| 27 | Reverse EZ-Bar Preacher Curl | wyswietlana | gryf; W2 |
| 28 | Preacher Curl | poprawka | W1b (dwa hantle) |
| 29 | Preacher Hammer Dumbbell Curl | poprawka | H1 naprawione; W1b |
| 30 | Cable Preacher Curl | wyswietlana | jeden uchwyt |
| 31 | Machine Biceps Curl | wyswietlana | ślad na prawym chwycie dźwigni (trzyma R) — przy dłoni, akceptowalne |
| 32 | One Arm Dumbbell Preacher Curl | wyswietlana | ślad na prawej dłoni |
| 33 | Spider Curl | poprawka | W1b (dwa hantle) |
| 34 | Spider Curl (sztanga) | wyswietlana | gryf |

Błędy w „Czego unikać” (pytanie o ćwiczenia bez bledy[]): pustą listę `bledy` ma 20 ćwiczeń (nie 6). Żadne nie jest blokujące: Cable Curl i Preacher Curl mają karty własne z pustą sekcją „mistakes” (nie ma tekstu do zilustrowania); 17 z zestawem ogólnym (`err: mis.jerk`) bez recenzji zestawu nie pokazuje ani tekstu, ani błędu (ui.ts:24, fail-closed — N5); Seated CG pokazuje błąd tempa (D). Rysunek nigdy nie pokazuje błędu bez tekstu ani tekstu z błędem pozy, którego nie da się narysować.

## B) Rodziny ready (squat, bench_press, hinge, pull_up) — wyswietlana ×4

- Zmiana śladu W1 jest tylko w `keyframeFrame` (contract.ts:421–423), wywoływanym wyłącznie dla wariantu z danymi (figure.ts:73). Rigi squat/bench_press/hinge liczą `info.load` we własnych plikach (squat.ts:193–194, benchPress.ts:151, hinge.ts:218) — żaden plik rigu nie jest w diffie 1065b7c6..HEAD; `trailShapes` (guides.ts:36) bez zmian.
- pull_up: sprzęt wszystkich 11 ćwiczeń = sztanga/slupek/podloga (brak hantel/wyciag/dzwignia) → warunek W1 niespełniony, ślad = miednica jak dotąd (contract.ts:420). roznica/Pull-Up-side.png: przerywana pionowa linia na miednicy, 21 kadrów, bez bujania — jak w recenzji 01.11.
- H1 działa tylko na hantlu z jawnym `obrotPrzedramienia` w danych póz (contract.ts:418) — rigi nie przechodzą tej ścieżki. W2 (`plateZs`) zmienia rysunek tylko przy gryfie krótszym niż barLen; odciski rigów 87/87 i pull_up 11/11 bajtowo równe (DOWOD-roznica.txt; tests/figures-v2-zgodnosc-wsteczna.test.ts — odcisk kształtów, ślad rigów poza odciskiem, ale jego źródło bez zmian w kodzie).
- Wniosek: rysunek i ślad 4 rodzin bez zmian merytorycznych; zmienia się tylko skrót (V2_WSPOLNE). Uwaga: poprawka W1b zmieni contract.ts → skróty wszystkich 5 rodzin trzeba będzie odświeżyć ponownie (recenzja różnicy, nie pełna).

## C) Próg toru łukowego (30 cm, ≤ 1 zawrócenie)

Geometria: promień łuku = łokieć–chwyt 33,0 cm (wszystkie 34). Strzałka łuku = r·(1 − cos(Δθ/2)): przy Δθ = 136° (Barbell Curl 13→149°) 20,6 cm, + dryf łokcia 3,7 cm ≈ 24 cm; pomiar max 23,8 cm (EZ Bar Curl, bok), min 12,5 cm (Lying CG High Pulley). Próg 30 cm odpowiada łukowi ok. 160° przy r = 33 — fizycznie poprawny łuk nie przekroczy ok. 25 cm, więc 30 cm daje ok. 6 cm luzu i nie łapie ucieczki toru rzędu 5 cm. Większa wada: próg sprawdza kształt, nie miejsce — ślad w osi ciała (W1b) ma odchylenie 0,0 i przechodzi.
Propozycja: (1) próg per ćwiczenie z geometrii: odchylenie ≤ r·(1 − cos(Δθ/2)) + dryf łokcia + 2 cm (r i Δθ z klatek) — albo prościej stały 26 cm; (2) nowy warunek miejsca: ślad w każdym kadrze ≤ 3 cm od chwytu trzymającej ręki albo od środka jednego uchwytu (dla pary hantli/dwóch linek — od chwytu ręki R); (3) zostawić ≤ 1 zawrócenie.

## D) Wyjątek „Seated Close-Grip Concentration Barbell Curl|mis.jerk”

Jedyne ćwiczenie curl z błędem tempa: zestaw ogólny `err: [mis.jerk]` z recenzją „zestawy” (ui.ts:24, 38). Błąd tempa nie zmienia pozy — jest pokazywany zmianą tempa animacji (errors.ts:43: opuszczanie 450 ms, uginanie 350 ms, „szarpanie zamiast kontrolowanego ruchu”) i znacznikiem na gryfie (figure.ts:167: `info.load`, przy sztandze obecny). To ten sam mechanizm co w rodzinach ready (zrecenzowany). Werdykt: zrozumiały w tym samym stopniu co w rigach; wyjątek w teście uzasadniony (kryterium ≥ 3 cm różnicy pozy nie dotyczy błędu tempa). Ograniczenie: arkusz statyczny nie pokazuje tempa — oceniłem z kodu; w E2E/na telefonie wystarczy jedno spojrzenie przy pakiecie podstawowym. Sugestia (NISKIE): zamiast listy kluczy wyjątek po rodzaju błędu (`ERRORS[e].kind === 'tempo'`), żeby nie dopisywać 17 kolejnych przy recenzji zestawów.

## Sprawdzone bez znalezisk
- H1 (oś hantla) w 4 hammerach i w ćwiczeniach z supinacją w trakcie ruchu.
- W2 (talerze na końcach gryfu 120 cm) — kod plateZs, dotyczy tylko gryfu krótszego niż barLen.
- Ślad przy `trzyma` (7 ćwiczeń jednorącz / dźwignia) i przy jednym uchwycie (sztanga, EZ, drążek, lina) — 22 ćwiczenia.
- Różnica 4 rodzin ready — bez zmian rysunku i śladu.
- Prywatność/dane/sekrety: zakres nie dotyczy (dane póz i kod rysunku; recenzent nie zmienił plików śledzonych).

## Ograniczenia
- Pełne arkusze obejrzane dla 5 ćwiczeń curl i Pull Up bok; pozostałe 29 curl oceniłem liczbowo (źródło śladu, odchylenie, oś hantla) i przez porównanie z r3 (pozy bez zmian). Arkusze roznica/ dla Back Squat, Bench Press, Deadlift nieoglądane — rysunek bajtowo równy, kod śladu rigów nietknięty.
- Zestawy ogólne curl (treść) — poza zakresem (recenzja „zestawy”).

---

# Recenzja niezależna ruchu — partia wspólna B, r2 (po poprawce W1b) — bramka 4, L-047, L-050

- Data: 03.11.2026. Recenzent: audytor (niezależny, nie autor). Autor: programista curl. Worktree /home/user/wt-curl-b, gałąź `figury/curl-wspolne` @ 61949ba9 (tylko odczyt, `git status` czysty). Różnica 90a7821c..61949ba9: 18249bd2 (W1b + C1), e4b5ff5d (C1 wariant 2, figures-v2-data), 61949ba9 (generowane).
- Skróty: `node scripts/zrodla-runtime.mjs --skroty` uruchomione samodzielnie — wynik bajtowo równy /home/user/stan-curl2/skroty-r2.json. v2: curl a350009031ac, squat 7dda7de11e7a, bench_press 514477abea1d, hinge 3083acdf1a01, pull_up 874f6d310756.
- Liczby: skrypt poza repo (<scratchpad>/r2/m.mjs i t.mjs; `loadV2`, `frameAt`/`keyframeFrame`, 41 próbek u).
- Testy: `npx jest --runInBand tests/figures-v2-tor.test.ts tests/figury-curl-wspolne-w1-w2.test.ts` — 233/233 zielone.

**Wynik: curl — 34 × wyswietlana (12 po W1b naprawione, 22 bez zmian), 0 poprawka, 0 wstrzymana. Rodziny ready: squat, bench_press, hinge, pull_up — 4 × wyswietlana (tylko nowe skróty). Brak znalezisk KRYTYCZNE/WYSOKIE. Propozycje wpisów v2: /home/user/stan-curl2/recenzja-ruchu-B-r2.json.**

## Znaleziska

| ID | Poziom | Pewność | Dotyczy | Opis | Kroki w aplikacji | Realność | Dowód | Propozycja |
|---|---|---|---|---|---|---|---|---|
| T1 | NISKIE | 90% | tests/figures-v2-tor.test.ts (warunek miejsca, `odChwytu`) | Dla ćwiczeń z `trzyma` (`dwa` = false) dopuszczalnym punktem jest też środek między dłońmi. Cofnięcie śladu jednorącz do osi ciała przeszłoby warunek miejsca; warunek promienia złapałby to w 6 z 7 (rozrzut środka 3,9–21,8 cm), ale nie w Machine Biceps Curl (0,6 cm) | brak (strażnik, nie UI) | teoretyczny (wymaga zmiany kodu) | pomiar t.mjs; test linie z `odChwytu`/`dwa` | przy `trzyma` porównywać tylko z `grips[trzyma]`; backlog |
| T2 | NISKIE | 85% | ten sam test | 9 ćw. curl ze sztangą/EZ jest poza warunkiem miejsca i promienia (filtr ZESTAW bez sztangi); chroni je tylko próg kształtu 26 cm. Ślad = info.load z gryfu, kod nietknięty | brak | teoretyczny | ZESTAW: `!d.sprzet.some(x => x.rodzaj === 'sztanga')` | opcjonalnie: load ≤ 3 cm od środka chwytów; backlog |

Wcześniejsze: W1b (WYSOKIE) — naprawione; C1 (ŚREDNIE) — naprawione (patrz D); N5 (NISKIE, zestawy ogólne) — bez zmian, backlog.

## A) 12 ćwiczeń po W1b

Kod: contract.ts:423 — `dwaCiezary = (hantel && !pionowo) || (wyciag && dwa === true)`, stosowane tylko bez `trzyma` i bez sztangi; ślad = `grips.R`. Pomiar (41 próbek): ślad 0,00 cm od chwytu R w każdej klatce, |z| ≥ 22 cm (było 0 — oś ciała), rozrzut promienia ślad–łokieć 0,00 cm (r = 33,0), ≤ 1 zawrócenie w każdym widoku.

Arkusze r2 z przodu (wszystkie 12 obejrzane w pełnej rozdzielczości, 21 kadrów) — ślad przy dłoni prawej ręki w każdym kadrze:

| Ćwiczenie | Werdykt | Ślad / tor |
|---|---|---|
| Biceps Curl (hantle) | wyswietlana | przód: pionowa linia przy prawym hantlu (było: mostek); bok obejrzany — łuk 17,1 cm wokół łokcia na hantlu |
| Hammer Curl | wyswietlana | przód: przy prawym hantlu; bok 22,7 cm |
| Standing Dumbbell Reverse Curl | wyswietlana | przy prawym hantlu; bok 14,3 cm |
| Standing Inner-Biceps Curl | wyswietlana | przy prawym hantlu (ręce odwiedzione); bok 16,6 cm |
| Incline Curl (hantle) | wyswietlana | przy prawym hantlu, przy ławce; bok 19,7 cm |
| Incline Hammer Curl | wyswietlana | jw.; bok 19,7 cm |
| Lying Supine Dumbbell Curl | wyswietlana | przy prawej dłoni obok ławki (było: nad tułowiem); bok 15,4 cm |
| Preacher Curl | wyswietlana | przy prawym hantlu nad modlitewnikiem; bok 15,3 cm |
| Preacher Hammer Dumbbell Curl | wyswietlana | jw.; bok 15,3 cm |
| Spider Curl | wyswietlana | przy prawym hantlu (po stronie R figury); bok 15,8 cm |
| Cable Curl (dwie linki) | wyswietlana | wzdłuż prawego przedramienia/uchwytu; bok 17,1 cm |
| High Cable Curl | wyswietlana | łuk 14,0 cm przy prawej dłoni od wysokości barku ku głowie (było: strzałka na twarzy, 29–81 cm od dłoni) |

Widoki z boku: 11 z 12 bajtowo równe r1 (rzut boczny pomija z, a ręce symetryczne); Biceps-Curl-hantle-side różni się i został obejrzany — ślad na hantlu, łuk poprawny.

## B) 22 wcześniej zaakceptowane — bez zmian

Klasyfikacja sprzętu curl.json: `dwaCiezary` = true dokładnie dla 12 ćwiczeń z listy W1b; 22 pozostałe: 9 ze sztangą/EZ (ślad = info.load, gałąź pomijana), 7 z `trzyma` (Cross Body Hammer, Standing One-Arm Cable, Bayesian, Concentration (hantle), Standing Concentration, Machine Biceps (dźwignia), One Arm DB Preacher), 6 z jednym uchwytem wyciągu bez `dwa` (Cable Curl, Reverse Cable Curl, Hammer Curl (linki), Lying CG High Pulley, Lying Cable Curl, Cable Preacher) — środek między chwytami jak dotąd. Pomiar: różnica śladu HEAD względem reguły W1 = 0,00 cm w każdej próbce dla wszystkich 22. Werdykt r1 (wyswietlana) obowiązuje; nowe arkusze niepotrzebne.

## C) Rodziny ready — 4 × wyswietlana

Rigi squat/bench_press/hinge nie przechodzą przez keyframeFrame (figure.ts:73); pull_up przechodzi, ale sprzęt 11 ćw. to sztanga/slupek/podloga — warunek W1/W1b niespełniony. Wszystkie 8 arkuszy roznica r2 obejrzane w pełnej rozdzielczości (Back Squat przód/bok, Bench Press sztanga bok/góra, Deadlift sztanga przód/bok, Pull Up przód/bok): ślad na środku gryfu (jeden gryf — oś poprawna) albo na miednicy (pull_up), tor bez zmian; wszystkie 8 bajtowo równe arkuszom z 90a7821c (cmp). Zmienia się tylko skrót.

## D) Warunki testu toru — adekwatne

- Próg łuku 26 cm: geometria r·(1 − cos(Δθ/2)) + dryf ≈ 24 cm; pomiar max 23,8 cm (EZ Bar Curl, bok) — zapas 2,2 cm, przepuszcza każdy poprawny łuk, łapie ucieczkę rzędu ≥ 3 cm. Adekwatny.
- Ślad ≤ 3 cm od chwytu: dla par hantli/dwóch linek tylko chwyty R/L (środek wykluczony) — dokładnie to, czego zabrakło przy W1b; ma przypadek negatywny (środek przy Hammer Curl > 9 cm). Adekwatny; luka T1/T2 (NISKIE).
- Rozrzut promienia ≤ 3 cm: pomiar max 2,48 cm (Hammer Curl (linki), środek liny przy dryfie łokcia) — zapas 0,5 cm, ciasny, ale fizycznie uzasadniony (sztywne przedramię); przypadek negatywny High Cable Curl (> 3 cm). Adekwatny.
- Zawrócenia ≤ 1 — bez zmian.

## Sprawdzone bez znalezisk
- Ślad 12 ćwiczeń W1b (arkusze i liczby); niezmienność 22 pozostałych (kod + liczby); 4 rodziny ready (8 arkuszy + kod); skróty (uruchomione samodzielnie); testy toru (233/233).
- Dane, migracje, import/kopia, prywatność i sekrety, dostępność, ryzyko odrzucenia przez Apple: zmiana nie dotyczy (kod rysunku i testy; brak danych użytkownika i tekstów UI).

## Ograniczenia
- Widoki z boku 11 ćw. W1b nieoglądane ponownie — bajtowo równe r1 (cmp), ocenione liczbowo.
- Arkusze roznica oceniane jako stan bez zmian względem zatwierdzonych wpisów — nie jest to ponowna pełna recenzja ruchu tych rodzin.

## Dopisek (03.11.2026, na prośbę koordynatora)

- **Liczba curl = 36, nie 34.** Wartość liczy test tests/figury-recenzja.test.tsx:58–63 z `assignAll()`, tak samo jak przy pull_up (13 przypisanych, 11 rysowanych). 36 = 34 ćwiczenia rysowane z danych póz + Zottman Curl i Zottman Preacher Curl. Oba Zottmany są bez rysunku (W8, decyzja właściciela 03.11.2026). Sprawdziłem: nie ma ich w curl.json, `figureSpec` i `shownFigureSpec` zwracają null, nie mają figury v1. Aplikacja pokazuje dla nich kartę bez rysunku. Eksport strony ich nie rysuje, bo scripts/strona/eksport.mjs:132 stosuje regułę `shownFigureSpec`. Zgodne z W8 — nie jest to znalezisko.
- **v1 rodziny curl → „zastapiona”.** Dotyczy 5 wpisów: Biceps Curl (hantle), Barbell Curl, EZ Bar Curl, Hammer Curl, Cable Curl. Po podłączeniu curl `shownFigureSpec` zwraca dla nich figurę v2, a test w :55 nie dopuszcza wtedy werdyktu „wyswietlana”. Skróty v1 bez zmian (bieżące). Jeśli rodzina v2 straci ważną recenzję, `figureWithheld` (figure.ts:60–62) zostawi kartę bez rysunku i nie wróci do v1 — zabezpieczenie domyślnie zamknięte. Wpisy są w JSON, w kluczu `v1`.

---

# Recenzja niezależna treści kart — rodzina curl (bramka 4) i zmiany testów, 03.11.2026

Recenzent: audytor (nie pisał zestawów, kart ani rysunków). Materiał: worktree /home/user/wt-curl-b, gałąź figury/curl-wspolne @ 90a7821c (`git log 1065b7c6..HEAD`: 7 commitów). Ruch/rysunki — poza zakresem (inny audytor).

## A. Brakujące wpisy i werdykty

Lista wyliczona tak jak w teście (tests/karty-recenzja.test.tsx:36 GENERAL_SHOWN = cue-sets `b: general` ∧ `figureSpec(k)`; :47 wymaga `REC.zestawy[k].rodzina === f`; wyjątki tests/recenzja-wyjatki-1-1.json — brak curl).
Rodzina curl w cue-sets.json: 31 zestawów ogólnych; z figurą v2: 28 (bez figury: Reverse Plate Curls, Zottman Curl, Zottman Preacher Curl — wyjątek W8, nie wyświetlane). Wpis ma już Seated Close-Grip Concentration Barbell Curl (skrót 57beffa85533 = bieżący). **Brakuje 27** — wszystkie z rodziny curl, poza curl brak braków.
Przebieg: `npx jest tests/karty-recenzja.test.tsx --runInBand` → 1 czerwony (test :45), 14 zielonych.

Teksty (lib/cues/text/pl.json / en.json) użyte w zestawach:
- preacher.setup — „Oprzyj tył ramienia o podpórkę modlitewnika, pachą blisko jej krawędzi.”
- preacher.range — „Pełny zakres: od wyprostu do pełnego zgięcia łokcia.”
- curl.control — „Opuszczaj ciężar powoli, z kontrolą.”
- curl.noSwing — „Tułów nieruchomo: bez bujania i odchylania się.”
- curl.elbows — „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- mis.jerk — „Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu.”
- curl.mis.elbows — „Wysuwanie łokci do przodu albo od tułowia.”
EN zgodne znaczeniowo z PL.

Werdykt: **wyswietlana dla wszystkich 27** (propozycje wpisów 1:1: /home/user/stan-curl2/recenzja-kart-B.json, uwagi per ćwiczenie). Kluczowe kontrole przypisania:
- curl.elbows słusznie POMINIĘTE tam, gdzie łokieć celowo nie jest przy boku: Drag Curl (łokcie cofają się), Bayesian Curl (ramię za tułowiem), High Cable Curl (ramiona na wysokości barków) — zgodne z ruchem.
- preacher.setup tylko przy wariantach z podpórką modlitewnika (Barbell/Cable/One Arm Dumbbell/Preacher Hammer/Reverse EZ-Bar Preacher); preacher.range (tekst bez słowa „modlitewnik”) przy wariantach podpartych/leżących — poprawne.
- Mięśnie (lib/figures/v2/muscles.generated.ts, bez zmian w gałęzi): biceps 1 we wszystkich; przedramiona 1 w nachwytach (Reverse*), 0,5 w młotkowych — kierunkowo zgodne z ruchem.

Uwagi NISKIE (backlog, nie blokują):
1. Incline Curl (hantle), Incline Hammer Curl — curl.noSwing „bez … odchylania się” przy tułowiu leżącym na ławce skośnej: sens poprawny („nie odrywaj tułowia”), brzmienie ogólne. Pewność 85%, realny (karta widoczna przy każdym otwarciu ćwiczenia), poziom NISKIE.
2. Preacher Curl (EZ) — brak preacher.setup przy innych wariantach modlitewnika z tą wskazówką (cue-sets.json). Niespójność, nie błąd. NISKIE.
3. mis.jerk — źródła w data/zrodla/wskazowki-ogolne.json wskazują kartę Seated Cable Row (NASM „jerky movements”, ExRx „do not bounce”), czyli analogię do innego ćwiczenia; dla curl istnieje bezpośrednie źródło już w rejestrze (nasm-barbell-bicep-curl, Common Mistakes „swinging”, użyte przy curl.noSwing w data/zrodla/cues.json „Biceps Curl (hantle)”). Proponuję dopisać je do mis.jerk (tekst bez zmian). NISKIE.

Rejestr twierdzeń: identyfikatory wskazówek nie mają wpisów w docs/research/rejestr-twierdzen.json — i nie muszą: scripts/claims.mjs:22 skanuje tylko lib/i18n.en.ts (DICT); wskazówki techniki pilnuje data/zrodla/wskazowki-ogolne.json → data/zrodla/cues.json (preacher.* — „Preacher Curl”, curl.control/elbows — „Cable Curl”, curl.noSwing/elbows/mis.elbows — „Biceps Curl (hantle)”, każde po 2 źródła z miejscem; preacher.setup — dwa badania, ustawienie testowe, oznaczone „słabsze”, karta Preacher Curl już „wyswietlana” w sekcji karty z tym tekstem). Nazwy faz „Uginanie/Opuszczanie” (poseData.ts DATA_UI.curl) mają przekład w lib/i18n.en.ts:786, :798.

Sekcja „karty”: bez nowych wpisów. Karty własne curl przechodzą: Biceps Curl (hantle), Barbell Curl, EZ Bar Curl, Hammer Curl, Cable Curl — v1 „wyswietlana” ze skrótem = bieżący (np. Barbell Curl 121b0a0fed00); Preacher Curl — „karty” 558e35a77598 = bieżący.

Po przepisaniu wpisów: `node scripts/zrodla-runtime.mjs --write` (lista „general” w lib/cues/data.json — test :77), potem karty-recenzja, recenzja-wyjatki-1-1, zrodla-runtime. Skróty: `node scripts/zrodla-runtime.mjs --skroty` (pole `zestawy`); zależą tylko od cue-sets.json i pl.json.

## B. Zmiany testów (`git diff 1065b7c6..HEAD -- tests/`)

| # | Plik | Ocena | Propozycja |
|---|------|-------|-----------|
| B1 | tests/figures-v2-data.test.tsx:43 — pętla „frameAt z danych” zawężona do `f === "pull_up"`; komentarz „curl ma własne testy (figury-curl-*)” | **Osłabienie (ŚREDNIE, pewność 95%)**. W tests/figury-curl-*.test.ts nie ma asercji lowerFirst, measuredJoint, phasesFor ani wzrostu kąta łokcia (sprawdzone nazwy testów). Sprawdziłem: wszystkie 34 curl spełniają `lowerFirst === false`, `measuredJoint === 'elbow'`, fazy `Uginanie 1000 / Pauza 500 / Opuszczanie 2000 / Pauza 500`, `measuredAngle(1) > measuredAngle(0)` — wypadły z kontroli bez potrzeby. | Zawęzić do pull_up tylko asercję uniesienia miednicy (`pelvis[1]`); resztę zostawić dla wszystkich rodzin z danych z nazwami faz z `DATA_UI[f].names` (bez stałej „Podciąganie”). Komentarz poprawić. |
| B2 | tests/figures-v2-tor.test.ts:25–30 — próg 30 cm dla toru łukowego curl zamiast 4 cm | Uczciwe dostosowanie co do zasady (łuk chwytu wokół łokcia; zmierzone odchylenia 12,5–23,8 cm, zawsze ≤ 1 zawrócenie), ale strażnik słaby: 30 cm od cięciwy przepuści prawie każdy tor. | Dla rodzin łukowych sprawdzać stały promień: rozrzut odległości śladu od łokcia ≤ ok. 3 cm. Pomiar (side): większość 0–1,6 cm; Incline Curl/Incline Hammer 3,2 cm; **High Cable Curl 9,1 cm** — przekazać audytorowi ruchu (możliwa zmiana długości przedramienia albo ślad nie z tej ręki). Ewentualnie obniżyć PROG_LUK do ok. 26 cm. |
| B3 | tests/figures-v2-data.test.tsx:75 — `mis.jerk` odfiltrowany z porównania errorsOf ↔ bledy[] dla wszystkich rodzin; `e.length > 0` tylko pull_up | Dostosowanie zgodne z kodem (lib/figures/v2/ui.ts:37–38 dokłada błąd tempa ze wskazówek); `e.length > 0` dla curl słusznie zdjęte (bledy[] puste w 20 z 34 ćwiczeń). Lekkie poluzowanie: filtr przepuści mis.jerk przy dowolnym ćwiczeniu. | Zamiast filtra: oczekiwane = `bledy[].cue` + `mis.jerk` tylko gdy `cueIdsOf(k).errs` zawiera mis.jerk. NISKIE. |
| B4 | tests/figures-v2-data.test.tsx — BLAD_NIEWIDOCZNY (Seated Close-Grip…|mis.jerk) | Uczciwe: błąd tempa nie zmienia pozy; lista jawna, 1 pozycja. | — |
| B5 | tests/strona-eksport.test.ts:162 — 98 → 132 | Uczciwe. Eksport jest fail-closed na skrócie recenzji (scripts/strona/eksport.mjs:71, :133; recenzja-figur.mjs:26–28); test podaje zapis z bieżącymi skrótami (:37, :50), więc 132 = 87 + 11 + 34 „po recenzji”. | — |
| B6 | tests/figures-v2-mapping.test.ts:42, :49, :57 | Uczciwe (lista ready, POSE_FAMILIES, licznik +34). Nazwa testu :48 „11 z 13 w pull_up” nadal prawdziwa. | — |
| B7 | tests/figury-curl-poprawki-r2.test.ts:82 — `naprawione` = `pr.axis` w case 'dumbbell' | Uczciwe, węższe niż wcześniej, ale wskazuje faktyczną poprawkę; sedno H1 pilnują testy H1 w figury-curl-wspolne-w1-w2.test.ts:44–66. | — |

## Sprawdzone bez znalezisk
Przypisanie zestawów do ruchu (27), teksty PL/EN, źródła wskazówek (łańcuch wskazowki-ogolne → cues.json), karty własne curl (skróty), przekład nazw faz, eksport strony (fail-closed), dane i prywatność — nie dotyczy (brak zmian w danych użytkownika, sekretów w diffie testów brak).

## Niesprawdzone
Treść innych języków niż PL/EN; źródła muscles.generated.ts w catalog.json (bez zmian w gałęzi); ruch i rysunki (inny audytor).

## A2. Karty własne curl po zastąpieniu wpisów v1 (dopisek 03.11.2026, na prośbę koordynatora)
Po zmianie v1 na „zastapiona” wszystkie 5 ćwiczeń (Biceps Curl (hantle), Barbell Curl, EZ Bar Curl, Hammer Curl, Cable Curl) ma własną kartę w data/zrodla/cues.json bez wpisu w „karty” — test tests/karty-recenzja.test.tsx:43 zatrzymuje się na pierwszym (Biceps Curl (hantle)), ale wymaga wpisu dla wszystkich 5.
Werdykt: **wyswietlana ×5** (wpisy w recenzja-kart-B.json, klucz `karty`; skrót `kartaSkrot`, scripts/zrodla-runtime.mjs:72; polecenie `node scripts/zrodla-runtime.mjs --skroty`, pole `karty`): Biceps Curl (hantle) a0799f84e329, Barbell Curl c262b156adeb, EZ Bar Curl eb090c667ee2, Hammer Curl fd2226f3b461, Cable Curl db8b6290098b.
Zgodność z figurą v2 (pomiar frameAt/poses/curl.json): Biceps Curl — obrót przedramienia 0° → 70° zgodny z „obracając dłoń w stronę barku”; Hammer — obrót 0° w całym ruchu = „dłonie zwrócone do ciała”; Barbell/EZ/Hammer — przedramię u góry 17–19° od pionu (tekst „aż przedramiona będą pionowo” — przybliżenie, zgodne kierunkowo); Cable — podchwyt 70°. Uwaga dla audytora ruchu: EZ Bar Curl w dole ma łokieć zgięty 16° przy tekście „do pełnego wyprostu rąk”.
