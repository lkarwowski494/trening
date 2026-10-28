# Recenzja niezależna ruchu i geometrii — figury v2, poprawki 1.0.1 (bramka 4, L-047, L-050)

- Recenzent: audytor (sesja 1.0.1, niezależny). Autor: programista r2/figury-v2.
- Kod: `r2/figury-v2`, HEAD bf18a97, diff `04b8fba..bf18a97`, worktree `/home/user/trening/.claude/worktrees/agent-a0e42cab32be175f6` (nic nie zmieniane, `git status` czysty).
- Metoda: własna kopia obu stanów (`git archive 04b8fba` / `bf18a97`) w `/tmp/claude-0/-home-user-trening/22a5d54a-fd35-5956-8784-cf11c89aac0b/scratchpad/rec/{base,head}`. Pomiary z danych silnika (`frameAt`, `jointAngles`, `checkFrame`, `shapesAt`, `trailFor`), skrypty w `.../scratchpad/rec/tools/` (cmp.mjs, err.mjs, m_bench.mjs, sag.mjs, arm.mjs, elz.mjs, hinge.mjs, band.mjs, anch.mjs, fl.mjs, misc.mjs). Kadry 3–4,5× z nałożonym śladem: `.../scratchpad/rec/png/*.png`, dla porównania stan bazowy `.../scratchpad/rec/png-base/`. Arkusze autora `.../scratchpad/figury-v2/po/slad/slad-0..5.png` obejrzane w pełnej rozdzielczości.
- Testy: `npx jest tests/figury-1-0-1-uwagi.test.ts tests/figures-v2-geometry.test.ts tests/figures-v2-tor.test.ts tests/figury-1-0-recenzja.test.ts` — 4 zestawy, 72/72 zielone.
- Konwencja: u = 0 pozycja wyjściowa, u = 1 dolny punkt (wyciskanie, zawias „lowerFirst”) albo wyprost (martwy ciąg z podłogi). Wymiary w cm; x ujemne = w stronę głowy (ławka).

## Brak regresji (niezależnie od odcisków autora)

- Porównanie stanów kształt po kształcie: wszystkie widoki, 41 klatek (Δu = 1/40), ślad `trailFor` w każdym widoku, oraz klatki wszystkich błędów (`ERRORS`) przy u = 0…1. Wynik: **51 ćwiczeń identycznych** (kształty, ślady i klatki błędów bajt w bajt), **36 zmienionych** — ta sama lista co `odciski-roznice.txt`.
- W 36 zmienionych zmiany ograniczone do celu poprawki: hantle (11 ćwiczeń) — tylko `TRAIL` w widoku z przodu/z góry; Rack Pull, Rack Pull with Bands, Good Morning off Pins, Pin Press — tylko `rackPost`/`rackPin`; Board Press — tylko `board`; Reverse Band ×5, Cable Deadlift, Single Leg RDL (linki) — tylko `band`/`bandAnchor`/`cable`/`pulley`; ciało (szkielet) zmienione wyłącznie w: 4× wąski chwyt, 3× ławka ujemna, JM, Skull Crusher, Band Squat (ręce), trap bar ×3, Cable Pull Through — zgodnie z zakresem.

## Werdykty

| Ćwiczenie | Werdykt | Pomiar / dowód |
|---|---|---|
| Close Grip Bench Press | ZATWIERDZONE (+ UWAGA NISKIE 1) | chwyt ±18 przy barkach ±20,5 (0,88×); dół: przedramię 1,4° czołowo / 11,2° strzałkowo, odwiedzenie z góry 7°, łokieć 137°; dotyk 20 cm poniżej linii barków (x −30 vs bark −50); `checkFrame` czysty w 41 klatkach. Kadr `rec/png/Close-Grip-Bench-Press.png` |
| Close-Grip EZ-Bar Press | ZATWIERDZONE (+ N1) | jak wyżej (identyczna geometria) |
| Smith Machine Close-Grip Bench Press | ZATWIERDZONE | dół jak wyżej; góra przedramię 15° strzałkowo — skutek pionowej szyny w punkcie dotyku (reguła Smitha z L-050) |
| Close-Grip Dumbbell Press | ZATWIERDZONE (+ N1) | hantle nachwytem w ±18, wewnętrzne głowice ±7,9…12,7 (odstęp 15,8 cm, bez kolizji), kadr `rec/png/Close-Grip-Dumbbell-Press.png`; ryzyko autora „chwyt 18” — zgodne z cgbp.grip („na szerokość barków lub trochę węziej”) |
| JM Press | **DO POPRAWY — WYSOKIE (stan zastany, pewność 85%)** | cel poprawki spełniony (łokieć maks. 146,9° ≤ 149°), ale ruch ramienia błędny: u = 1 łokieć 26,2 cm za barkiem w stronę głowy i 9,7 cm poniżej stawu barkowego, obok głowy (ramię 110° od pionu, shSag 200°); w połowie ruchu łokcie rozchylone do z = 41 przy barku z = 19 (odwiedzenie z góry 57°). Karta ćwiczenia ma tylko wskazówkę ruchu `cgbp.elbows` „Łokcie blisko tułowia przez cały ruch.” — figura jej przeczy; w JM press łokcie idą w stronę stóp, gryf do szyi/brody (u nas ruch bliższy pullover). Stan bazowy taki sam (shSag 204°, 27,2 cm) — nie regresja. Kadr `rec/png/JM-Press.png` (u = 1 z boku i z góry), pomiar `tools/arm.mjs`, `tools/elz.mjs`. Wyjątek `ALLOW['JM Press'].shSag 205` w `tests/figures-v2-geometry.test.ts:25` ma błędne uzasadnienie („gryf przy szyi” nie wymaga ramienia za głową) |
| Decline Close-Grip Bench To Skull Crusher | **DO POPRAWY — WYSOKIE (stan zastany, pewność 85%)** | łokieć maks. 147,7° ≤ 149° (cel spełniony); u = 1 ramię 80° od pionu w stronę głowy (łokieć 22,8 cm za barkiem, nad czubkiem głowy), w ruchu łokcie do z = 43 (bark 19; odwiedzenie z góry 64°). Jedyna wskazówka „ok” karty to `cgbp.elbows` „Łokcie blisko tułowia przez cały ruch.” (`lib/figures/v2/cue-sets.json:174`) — figura jej przeczy, a wpis `zestawy` w `docs/research/figury-recenzja.json` twierdzi zgodność z figurą. Stan bazowy taki sam (25,3 cm, z 43,5). Kadr `rec/png/Decline-Close-Grip-Bench-To-Skull-Crusher.png` |
| Decline Bench Press | ZATWIERDZONE | dół: przedramię 6,3° czołowo / 9,9° strzałkowo (było 8,4 / 11,8); dotyk 19,7 cm poniżej barków (dolna klatka); `checkFrame` czysty |
| Decline Bench Press (hantle) | ZATWIERDZONE | 4,7° / 8,7° (było 8,6 / 13,1) |
| Smith Machine Decline Press | ZATWIERDZONE | 6,3° / 9,9° (było 8,4 / 11,8); szyna stała |
| Board Press | ZATWIERDZONE (+ UWAGA NISKIE 2) | deska 4 cm: spód y 65,1 przy obrysie klatki 65,6 (x −36) i 64,9 (x −42) — leży na klatce; gryf na desce (test); z boku widoczna na górze ruchu i przez półprzezroczysty talerz na dole (`rec/png/Board-Press.png`). **Z góry deska niewidoczna**: rysowana przed tułowiem (z = −1020 vs tułów −25), prostokąt ±8 cm w obrysie tułowia ±13,6…18,6 — test „widoczna w widokach (bok, góra)” sprawdza tylko obecność kształtu |
| Pin Press | **DO POPRAWY — ŚREDNIE (F2, tanie)** | bolec pod gryfem w dolnym punkcie poprawnie (test), ale stojak poza talerzami: `EQUIP.rackZ = 76` (`lib/figures/v2/draw.ts:18`), talerze `plateZ` 66/71 ± 1,4 → 64,6…72,4; bolec 66…76 przechodzi przez talerze; komentarz mówi „jak `post`”, a `post` stoi w ±64 (`draw.ts:161`). Z góry słupki na zewnątrz talerzy, bolce pod talerzami (`rec/png/Pin-Press.png`) |
| Rack Pull | **DO POPRAWY — ŚREDNIE (F2)** | bolec pod gryfem na starcie (y 43,4 = dno gryfu), stały w ruchu (test); z przodu słupki w ±76 na zewnątrz talerzy, gryf (tuleje do ±110) przechodzi przez słupki, bolce pod talerzami (`rec/png/Rack-Pull.png`, dolny rząd). W prawdziwym stojaku talerze są na zewnątrz słupków |
| Rack Pull with Bands | **DO POPRAWY — ŚREDNIE (F2)** + UWAGA N4 | jak Rack Pull; dolny koniec gumy jedzie z gryfem 2,5 cm |
| Good Morning off Pins | **DO POPRAWY — ŚREDNIE (F2)** + UWAGA NISKIE 3 | bolce pod gryfem w dolnym punkcie (y 128,3), stałe; F2 z przodu. N3: bolce na 128 cm, bo zawias „dzień dobry” jest płytki (tułów 21° → 42°, gryf opada 8 cm; stan zastany, zgodny z gm.depth „łagodne rozciągnięcie”) — ruch „z bolców” wygląda na kilkucentymetrowy (`rec/png/Good-Morning-off-Pins.png`) |
| Band Squat | ZATWIERDZONE (+ UWAGA NISKIE 5) | dwie gumy spod śródstopia (z ±20) do dłoni (z ±15), koniec w dłoni; łokieć 140° stały (≤ 149°, ryzyko autora — bez zastrzeżeń); dłonie 19,5 cm przed barkiem, 9 cm niżej; Bodyweight Squat bez zmian. N5: guma wchodzi 3,0 cm w obrys uda (promień 7,6) przy u ≈ 0,375 — na rysunku niewidoczne (linia i tak na udzie); łokcie szeroko na boki (z 36…42 przy barku 19, odwiedzenie 34–47°) — `rec/png/Band-Squat.png` |
| Trap Bar Deadlift | ZATWIERDZONE (+ UWAGA NISKIE 6) | wyprost: tułów 1,4° (było −6,4°), min. w ruchu ≥ 1,4°; tor x 4,8 stały (pionowy). N6: kolano na wyproście 10,3° (inne martwe ciągi 4,6–5°) — „miękkie” kolano, czytelne jako wyprost (`rec/png/Trap-Bar-Deadlift.png`) |
| Leverage Deadlift | ZATWIERDZONE (+ N6) | jak trap bar (1,4°, kolano 10,3°) |
| Rickshaw Deadlift | ZATWIERDZONE (+ N6) | jak trap bar |
| Cable Pull Through | ZATWIERDZONE | kolano maks. 24,1° (u 0,5–0,65), na dole 19,7°; tułów na dole 60,8° (było: kolano 41,5°, tułów 29,8° — półprzysiad); linka od bloczka z tyłu między nogami, `checkFrame` czysty; dłonie: x 13 → 5 → 9 cm (jedno zawrócenie, ok. 6,5 cm od cięciwy). Wyjątek toru `Cable Pull Through|side` (`tests/tor-wyjatki.json`, wpis sprzed zmiany) — uzasadniony: łuk wynika z rąk wiszących z barków przy zawiasie, nie z błędu (`rec/png/Cable-Pull-Through.png`) |
| Reverse Band Deadlift | ZATWIERDZONE | kotwica x 8,9 / y 150 stała (0 cm), guma ≤ 1,8° od pionu |
| Reverse Band Sumo Deadlift | ZATWIERDZONE | kotwica stała, guma ≤ 5,9° od pionu |
| Reverse Band Bench Press | ZATWIERDZONE | kotwica nad górnym położeniem gryfu (x −48), stała; na dole guma 9,8° od pionu |
| Reverse Band Box Squat / Reverse Band Power Squat | ZATWIERDZONE | kotwica x 6,5 / y 175 stała, guma pionowo (0°) |
| Cable Deadlift | ZATWIERDZONE | bloczek x 9,0 stały (było: jechał 3,7 cm), linka ≤ 4,5° od pionu |
| Single Leg RDL (linki) | ZATWIERDZONE | bloczek x 14,2 stały, linka ≤ 4° od pionu |
| Bench Press (hantle), Incline Bench Press (hantle), Floor Press (hantle), Squeeze Press (hantle), One Arm Dumbbell Bench Press | ZATWIERDZONE | zmiana tylko śladu z góry: ślad przy prawym hantlu (z = z hantla ± 0,01 w każdej klatce, test). Ryzyko autora „ślad z góry ukośny” — poprawny: hantle zbiegają się 32 → 22 cm ku górze i przesuwają nad barki (slad-0, slad-1, slad-2) |
| Deadlift (hantle), RDL (hantle/linki), Single Leg RDL (hantel), Single Arm RDL (hantel/linka), Dumbbell Squat | ZATWIERDZONE | zmiana tylko śladu z przodu: pionowy ślad przy hantlu (|x| ≈ 30 w Deadlift (hantle)), nie w osi ciała (slad-0, slad-2, slad-4). Znacznik ✕ błędu „gryf” stoi teraz na prawym hantlu — akceptowalne |

### Pozycje „bez zmian” z rekomendacją autora

| Temat | Ocena rekomendacji | Pomiar |
|---|---|---|
| Overhead Squat / One-Arm OH KB Squat — bark 183–198° | **Uzasadniona** (UWAGA NISKIE, wyjątek zostaje) | ręce pionowo nad śródstopiem (ciężar x 6,5 stały) przy tułowiu 22° → zgięcie barku względem tułowia ≈ 180° + 22° (pomiar maks. 197,0° / 198,4°); model nie ma wyprostu odcinka piersiowego, więc nadmiar trafia w bark. Alternatywa (ręce w przód) łamie „gryf nad śródstopiem” — gorsza |
| Sumo — tor ukośny | **Uzasadniona jako backlog z wersją** (NISKIE) | x ciężaru 4,5 → 12,5 (8,0 cm), start 2 cm za śródstopiem, wyprost 6 cm przed; prosty ukos przechodzi strażnika (≤ 4 cm od prostej), więc tylko recenzja go łapie — wpisać do backlogu z wersją |
| RDL — ramiona 23° od pionu na dole | **Uzasadniona** (NISKIE) | RDL (sztanga) −23,1°, RDL (hantle) −23,0°, Smith SLDL −23,1° — dłonie za pionem barków (w stronę nóg), tułów 60°, kolano 13–17°; zgodne z „gryf blisko nóg”, barki przed gryfem |

## Znaleziska (od najpoważniejszego)

| ID | Poziom | Pewność | Realność | Kroki w aplikacji | Dowód |
|---|---|---|---|---|---|
| F1 | WYSOKIE (stan zastany, nie regresja) | 85% | realny | Ćwiczenia → JM Press albo Decline Close-Grip Bench To Skull Crusher → karta, animacja figury (bok i góra) | JM: łokieć u = 1 w (−76,2; 43,5; 32,4) przy barku (−50; 53,2; 19) — za głową i poniżej barku; Skull Crusher: łokieć (−73,7; 61,0; 39,7) przy barku (−50,9; 56,9; 19). Obie karty uczą „Łokcie blisko tułowia przez cały ruch.” (`lib/cues/text/pl.json` cgbp.elbows; `lib/figures/v2/cue-sets.json:174, 299`). Kadry `rec/png/JM-Press.png`, `rec/png/Decline-Close-Grip-Bench-To-Skull-Crusher.png`. Uwaga: zewnętrznego źródła techniki JM nie udało się otworzyć w tej sesji (ExRx 403, inne 404) — sprzeczność z własną kartą jest mierzalna niezależnie od tego; technikę docelową potwierdza badacz |
| F2 | ŚREDNIE (nowy kod tej zmiany; tania poprawka) | 95% | realny | Rack Pull / Rack Pull with Bands / Good Morning off Pins → widok z przodu; Pin Press → widok z góry | `EQUIP.rackZ: 76` (`lib/figures/v2/draw.ts:18`) vs talerze 64,6…72,4 (`plateZ [66, 71]`, `plateW 2.8`, `draw.ts:13`) i `post` w ±64 (`draw.ts:161`); bolec `sg*76 → sg*66` (`draw.ts` case 'rack') leży pod talerzami. Słupki powinny stać wewnątrz talerzy (≤ ok. 62,8 przy `postW` 3,5) |
| F3 | ŚREDNIE (stan zastany, ta sama klasa co poprawka „zaczepy stałe”) | 95% | realny | Ćwiczenia → Band Bench Press (bok) | dolny koniec gumy „na podłodze” jedzie z gryfem: Band Bench Press 15,0 cm (x −48 → −33), Sumo Deadlift with Bands 8,0 cm, Deadlift with Bands 3,3 cm, Rack Pull with Bands 2,5 cm (`tools/fl.mjs`; `benchPress.ts` i `hinge.ts`: `{ from: c, to: [c[0], 0, 0] }`). Poprawka objęła tylko gumy „hang” i linki; test `figury-1-0-1-uwagi` sprawdza tylko je. Band Bench Press 15 cm to skala dawnej szyny Smitha (15–18 cm, L-050) |
| N1 | NISKIE | 90% | realny | wąski chwyt (4 ćw.), widok z boku w połowie ruchu | przedramię strzałkowo do 34° od pionu przy u 0,5–0,6 (zwykłe wyciskanie 17°, hantle 30°) — skutek łokci przy tułowiu; na dole 11° (`tools/sag.mjs`). Bez zmiany, informacyjnie |
| N2 | NISKIE | 95% | realny | Board Press → widok z góry | deska niewidoczna (zasłania ją tułów); test `figury-1-0-1-uwagi.test.ts` („widoczna w widokach (bok, góra)”) sprawdza tylko istnienie kształtu |
| N3 | NISKIE (stan zastany) | 90% | realny | Good Morning off Pins (bok) | bolce na 128 cm, ruch gryfu 8 cm (płytki zawias „dzień dobry”, tułów 21° → 42°) |
| N4 | NISKIE | 90% | realny | Rack Pull with Bands | guma od gryfu do podłogi jedzie 2,5 cm (część F3) |
| N5 | NISKIE | 85% | realny | Band Squat | guma 3,0 cm w obrysie uda przy u ≈ 0,375; łokcie szeroko na boki (z 36…42) |
| N6 | NISKIE | 90% | realny | Trap Bar / Leverage / Rickshaw — wyprost | kolano 10,3°, biodro 6,8° na wyproście (inne martwe ciągi 4,6–5°) |

## Wiersz `slad` do docs/research/figury-recenzja.json

```
"slad": "arkusze śladu toru figury-v2/po/slad/slad-0..5.png (36 zmienionych ćwiczeń, u 0/0,5/1, wszystkie widoki rodziny, nałożony trailFor) i kadry 3–4,5× rec/png (Close Grip, Close-Grip Dumbbell, JM, Skull Crusher, Board, Pin, Rack Pull, GM off Pins, Band Squat, Cable Pull Through, Trap Bar, Band Bench); sprawdzono: ślad hantli przy prawym hantlu (z = z hantla w każdej klatce; z góry ukos = zbieżność hantli 32→22 cm — poprawny), trap bar/Leverage/Rickshaw pionowo (x 4,8 stałe), Cable Pull Through łuk dłoni 13→5→9 cm (1 zawrócenie, ok. 6,5 cm od cięciwy — wyjątek toru zasadny), wąski chwyt i ławka ujemna — kształt toru jak w zwykłym wyciskaniu, zaczepy Reverse i bloczki stałe (0 cm), sumo ukośny 8 cm (NISKIE, backlog), Band Squat — ślad rąk (wyjątek); 51 niezmienionych ćwiczeń: kształty, ślady i klatki błędów identyczne bajt w bajt z 04b8fba"
```

Proponowany zapis wpisu: `"autor": "programista r2/figury-v2"`, `"recenzent": "audytor (sesja 1.0.1, niezależny)"`, data 2026-10-28, HEAD bf18a97. Werdykt zbiorczy: **nie wszystkie zatwierdzone** — F1 (JM Press, Skull Crusher) i F2 (stojak z bolcami, 4 ćwiczenia) do poprawy przed statusem „naprawione”; F3 do decyzji (tania poprawka tą samą metodą co „zaczepy stałe” albo backlog z wersją); NISKIE → backlog z wersją.
