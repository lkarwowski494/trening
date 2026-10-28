# Skan „wybrzuszeń” narysowanego toru ruchu — wszystkie ćwiczenia z figurą (28.10.2026)

Audytor, tylko odczyt. Kod: main 2385e75a (build 1032 = 025a50b9; między nimi w lib/figures zmieniły się tylko lib/figures/data.json, czyli v1, oraz ui.tsx — silnik v2 bez zmian), integracja-1-1 6bee23f7.
Skrypty i surowe wyniki: skan-torow/skan.mjs, skan-torow/wynik-{main,int,intall}.json, kadry: skan-torow/kadry.mjs.

## 1. Co rysuje ślad
- **v2:** `trailFor` (lib/figures/v2/figure.ts:126-130 na main; :184-188 na integracji) bierze 25 klatek u = i/24 i `trailShapes` (guides.ts:33-39) rysuje **łamaną** przez `proj(f.info.load)` (na integracji `f.info.trail ?? f.info.load`, guides.ts:36). Bez wygładzania i bez interpolacji krzywą.
  - load = środek gryfu albo ciężaru (rigi: hinge.ts:135, squat.ts:155, benchPress.ts:98); przysiad bez ciężaru: dłonie (squat.ts default); przysiad z pasem: miednica.
  - Rodziny z danymi (integracja): `info.trail = sk.pelvis`, gdy ćwiczenie nie ma sztangi trzymanej w dłoniach (contract.ts:406). Wtedy hantle, kettlebell i skoki pokazują **tor miednicy**.
- **v1** (components/ExerciseFigure.tsx, lib/figures/geom.ts): **śladu nie rysuje**. W kodzie nie ma trail, dash ani guide. 53 ćwiczenia z figurą v1 widocznych w 1.0 nie mają czego mierzyć.
- **Interpolacja nie jest przyczyną.** Łamana 1/24 i gęsta siatka u = 0,01 różnią się najwyżej o 0,25 cm na main. Na integracji różnica powyżej 1 cm występuje tylko w szybkich skokach plyo (do 4,6 cm), czyli tam, gdzie łamana ścina łuk lotu. Kształt śladu to wprost geometria rigów i danych.

## 2. Miary i próg
Każdy rysowany widok (side, front, top), dokładnie ta łamana, którą rysuje aplikacja.
- (a) **Maksymalne odchylenie od cięciwy** start–koniec (przy pętli zamkniętej: start–najdalszy punkt), w cm, z miejscem (u i wysokość względem kolana).
- (b) **Zawrócenia w poziomie** z histerezą 1 cm, czyli drgania poniżej 1 cm się nie liczą.
- (c) **Odchylenie od pionu** `max|x−x0|` oraz od pionu przez śródstopie (`info.midfoot`).

**Próg:** odchylenie > 3 cm albo ≥ 2 zawrócenia. Uzasadnienie, skalibrowane na zrzutach właściciela:
- Deadlift (hantle) na main ma 1,7 cm i 1 zawrócenie. Właściciel ocenił go jako „prawie prosto”.
- Deadlift (sztanga) ma 4,2 cm i 2 zawrócenia. To wyraźne wybrzuszenie na telefonie.

Sam próg względny (15% skoku) daje fałszywe trafienia przy krótkich torach, np. RDL o długości 21 cm, więc służy tylko pomocniczo.

Dla ruchów „prostych” stosuję dodatkowo (c). Maszyna Smitha: gryf na prowadnicach nie może iść ukośnie.

## 3. Liczby
- **Ćwiczenia z figurą:** 623 wiersze w tabeli.
  - 1.0 (main), razem 140: v2 87 (squat 25, bench_press 30, hinge 32; 1 izometria bez śladu) i v1 53 (bez śladu).
  - Integracja: 98 v2 w gotowych rodzinach (te same 87 + pull_up 11) oraz 438 ćwiczeń z plików póz rodzin **planned** (35 plików niepodpiętych w poseData.ts:13-15; liczone bezpośrednio przez keyframeFrame).
- **Powyżej progu:** main 40 wierszy; integracja (536) 155.
- **BŁĘDY widoczne w 1.0: 16.**
  - 11 to martwe ciągi z „S” przy kolanie.
  - 5 to maszyna Smitha: 4 wyciskania i SLDL. Ich tor jest prosty, ale ukośny, a szyna jedzie razem z gryfem. Wykrywa to dopiero miara (c), nie (a).
- **BŁĘDY w 1.1 (integracja), razem 27:**
  - 18 w rodzinach z rigiem. To te same 16 co na main, tylko większe, plus Deadlift (hantle) i One-Arm Side Deadlift. Integracja **nie ma poprawek z main** (150 commitów za main, m.in. c6b1c813 i 03723210 w hinge.ts).
  - 9 w rodzinach planned (dziś niewidoczne): 4 podrzuty i 5 skoków w miejscu.
  - pull_up (11, ready na integracji): 0 trafień.

## 4. Lista BŁĘDÓW — widoczne w 1.0 najpierw

| # | Ćwiczenia | Widoczne w 1.0 | Pomiar (main) | Waga / pewność / realność | Kroki | Dowód (kadr PNG, pełna rozdzielczość) |
|---|---|---|---|---|---|---|
| 1 | **Deadlift (sztanga)** | tak | 4,2 cm od cięciwy, 2 zawrócenia, 6,8 cm od pionu śródstopia; gryf x: 9,5 → 13,3 (wys. 46–49 cm ≈ kolano, dKol +1,6) → 4,8 (y 62–74) → 8,5 | **WYSOKIE** (ten sam ekran pokazuje linię pionu przez śródstopie i tekst „sztanga… nad środkiem stopy”, dl.feet; rysunek temu przeczy). Pewność 95%. **Realny.** | Ćwiczenie → Deadlift (Barbell) → Technika (rozwinięte, animacja) | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Deadlift-sztanga-.png; zrzut właściciela dowody/deadlift-barbell-1032.png |
| 2 | Axle Deadlift, Deadlift with Bands, Deadlift with Chains, Reverse Band Deadlift, Clean Deadlift (identyczny tor jak nr 1); Deficit Deadlift (4,7 cm, 2 zawr.); Snatch Deadlift (4,9 / 2); Cable Deadlift (4,4 / 2); Rack Pull i Rack Pull with Bands (5,6 / 2) | tak | jak wyżej: S przy kolanie, potem gryf za śródstopiem i haczyk w przód przy wyproście | **WYSOKIE** (zestaw ogólny „dl.close” bez linii pionu; ta sama błędna nauka toru). Pewność 95%. **Realny.** | Ćwiczenie z listy → Technika | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Rack-Pull.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Cable-Deadlift.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Snatch-Deadlift.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Deficit-Deadlift.png |
| 3 | Smith Machine Stiff-Legged Deadlift | tak | 6,4 cm od cięciwy, zawrócenie, tor „C”; szyna rysowana na x gryfu, więc „prowadnica” przesuwa się z klatki na klatkę | ŚREDNIE (sprzeczność rysunku z budową maszyny). Pewność 90%. **Realny.** | jw. | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Smith-Machine-Stiff-Legged-Deadlift.png |
| 4 | Smith Machine Bench Press, Smith Machine Incline Press, Smith Machine Decline Press, Smith Machine Close-Grip Bench Press | tak | tor prosty, ale ukośny: 15–18 cm w poziomie na 47–60 cm skoku; pionowa szyna rysowana pod gryfem jedzie z nim wzdłuż ławki | ŚREDNIE. Pewność 90%. **Realny.** | jw. | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Smith-Machine-Bench-Press.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Smith-Machine-Incline-Press.png |
| 5 | (tylko integracja) Deadlift (sztanga) i rodzina z nr 2 | nie | na integracji 12,0–14,7 cm, 2 zawrócenia (Deadlift: x 16,5 → 27,3 → 11,8) | WYSOKIE dla 1.1, jeśli scalenie main → integracja zgubi poprawki hinge.ts. Pewność 95%. Realny po wydaniu 1.1. | jw. na buildzie z integracji | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Deadlift-sztanga-.png |
| 6 | (tylko integracja) Deadlift (hantle), One-Arm Side Deadlift | nie | 16,3 i 12,3 cm (na main poprawione: 1,7 i 0) | jw. (regres przy scalaniu) | jw. | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Deadlift-hantle-.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/One-Arm-Side-Deadlift.png |
| 7 | (planned) Power Jerk, Split Jerk, Squat Jerk, Clean and Jerk | nie | gryf w wybiciu ucieka 13–21 cm w przód i wraca (Power Jerk: x 0,8 → 21,4 → 1,3; 20,8 cm, 2 zawr.; Clean and Jerk: 31 cm, 7 zawr.) | ŚREDNIE (rodzina niewidoczna; przed podpięciem do naprawy). Pewność 85%. Teoretyczny dla 1.0 i 1.1, dopóki rodzina jest planned. | — | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Power-Jerk.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Split-Jerk.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Squat-Jerk.png |
| 8 | (planned) Jump Squat, Star Jump, Weighted Jump Squat, Double Leg Butt Kick, Single Leg Butt Kick | nie | skok w miejscu, a miednica w locie zawraca w poziomie o 25–40 cm (Jump Squat: +6,5 → −20 przy wznoszeniu 103 → 124 cm). Fizycznie niemożliwe: w locie prędkość pozioma jest stała. | ŚREDNIE. Pewność 85%. Jak nr 7. | — | /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Jump-Squat.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Star-Jump.png, /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/int/Weighted-Jump-Squat.png |

## 5. Wspólne przyczyny
1. **Martwe ciągi z podłogi (nr 1, 2, 5, 6): gryf szuka pierwszego styku z nogą, zamiast iść po pionie.**
   - Mechanizm: lib/figures/v2/rigs/hinge.ts:107-111 (main). Dla każdej klatki `barX` startuje z 60 cm i maleje co 0,25 cm do pierwszego styku z kapsułą uda lub podudzia. Ograniczenie od dołu to `HINGE.xMin = 4.5` (hinge.ts:50), czyli 2 cm za śródstopiem (midfoot = 6,5, hinge.ts:135).
   - Skutek: tor gryfu = obrys nóg. Kolano wysunięte w środku ciągu wypycha gryf w przód (+6,8 cm), nad kolanem gryf opada do ogranicznika za śródstopiem, a przy wyproście udo przesuwa go znowu w przód.
   - Komentarz w nagłówku obiecuje, że „gryf jest zawsze nad śródstopiem” (hinge.ts:9), ale pomiar pokazuje 4,8–13,3 cm.
   - Dlaczego testy tego nie złapały: tests/figures-v2-geometry.test.ts:89-90 („gryf nad śródstopiem”) dopuszcza x od 4,5 do 30 cm, czyli okno 25,5 cm. Testu kształtu śladu nie ma. tests/figures-v2-guides.test.tsx:38-44 sprawdza tylko liczbę odcinków i punkt startu.
   - Diagnozę samego martwego ciągu (dlaczego kolano nie schodzi z drogi) zostawiam równoległemu raportowi.
2. **Smith (nr 3, 4): szyna rysowana pod gryfem.** Prowadnica jest rysowana na bieżącym x gryfu, a nie w stałym miejscu, i gryf nie jest więziony do pionu: benchPress.ts:108, hinge.ts:138, squat.ts:170. Przysiad na Smisie ma tor pionowy, ale tylko dlatego, że rig to zapewnia.
3. **Integracja w tyle za main (nr 5, 6)** — gałąź nie ma c6b1c813 / 03723210 (hinge.ts: `conv`, `dbFloorGrip`, `sideBar`). Do pilnowania przy scalaniu.
4. **Rodziny z danymi (nr 7, 8):** klatki kluczowe z generatora; walidator kontraktu (contract.ts) nie sprawdza kształtu toru (load/trail).

## 6. DO OCENY (nie zgłaszam jako błąd; pewność < 80%)
- **Sumo Deadlift (+ Bands, Chains, Reverse Band) i Sumo Deadlift (kettlebell)** — 4,4–5,6 cm: pionowo, potem haczyk 5–7 cm w przód przy wyproście. Ten sam mechanizm co w przyczynie 1.
- **RDL (sztanga), RDL (hantle/linki), Stiff-Legged Barbell Deadlift, Single Leg RDL ×2** — „C” 4,2–6,4 cm po udach. Zgodne z „blisko nóg”, niezgodne z komentarzem „nad śródstopiem”.
- **Sumo Squat (hantel)** — ręce ukośnie w przód i tor 24 cm po skosie; hantel nie wisi pionowo. squat.ts:133, kotwica `trunkPoint(…, 2, 21, …)`. Kadr: /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Sumo-Squat-hantel-.png.
- **Barbell Hack Squat** — gryf za ciałem ciągnięty za miednicą, 22 cm w tył (squat.ts:144). Kadr: /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skan-torow/kadry/main/Barbell-Hack-Squat.png.
- Zercher Squat (9,9 cm, ciężar przed tułowiem na stojąco), Goblet Squat / Cable Squat (5–6 cm), Front Squat i Double KB Front Squat (3,3–3,7 cm na samym starcie), Dumbbell Squat (3,5 cm).
- **Integracja:**
  - podnoszenia olimpijskie z podłogi — w 1. ciągu gryf odchodzi od ciała o 2,6–3,9 cm przy kolanie, ten sam wzór co martwy ciąg; reszta „S” jest naturalna;
  - Snatch Balance, Push Press, Standing Barbell Press Behind Neck, KB Push Press/Jerk (tor miednicy 10–18 cm), Barbell Side Split Squat, Tuck/Depth Jump.

## 7. OCZEKIWANY ŁUK (krótko)
- **Uginania (curl, 9) i prostowania (triceps, 7):** obrót ciężaru wokół łokcia.
- **Pullovery i Front Raise to Overhead / Straight Raises:** obrót wokół barku.
- **Overhead Press (sztanga) / Seated Military:** pionowo, potem cofnięcie nad głowę („wokół twarzy”).
- **Wykroki i pistol, Belt Squat, Dip Belt / Przysiad z pasem, Thruster, Wall Ball:** tor miednicy (krok albo biodra w tył).
- **Landmine:** łuk końca gryfu wokół osi.
- **Cable Pull Through:** linka zza pleców.
- **Seated Good Mornings:** obrót wokół bioder.
- **Bent Press, Toes to Bar, rzuty:** łuk z natury ruchu.
- **Skoki z przemieszczeniem (box, broad, bound, lateral):** parabola lotu.
- **Bodyweight/Band Squat:** ślad pokazuje dłonie, nie ciężar.

## 8. Propozycja stałego strażnika
`tests/figures-v2-tor.test.ts`:
- **Zakres:** każde `figureSpec` (gotowe rodziny) oraz każdy wpis w `poses/*.json` (także planned, przez keyframeFrame), w każdym widoku z `spec.views`. Liczy **dokładnie** `trailFor(spec, view)`, czyli łamaną rysowaną w aplikacji.
- **Asercje:**
  - (1) odchylenie od cięciwy ≤ 3 cm;
  - (2) zawrócenia w poziomie (histereza 1 cm) ≤ 1;
  - (3) dla martwych ciągów z podłogi i przysiadów ze sztangą: |x_gryfu − midfoot| ≤ 3 cm w całym ruchu, zamiast dzisiejszego okna 4,5–30 cm w figures-v2-geometry.test.ts:89-90;
  - (4) sprzęt na prowadnicach (`rail`): x szyny stały we wszystkich klatkach i x gryfu = x szyny (±0,5 cm);
  - (5) skok w miejscu: w fazie lotu brak zawrócenia w poziomie.
- **Wyjątki:** `tests/tor-wyjatki.json` z kategorią i powodem: `luk-lokiec`, `luk-bark`, `tor-miednicy`, `krok`, `skok-z-przemieszczeniem`, `nad-glowe`, `landmine`, `linka`, plus opcjonalny limit cm dla danego ćwiczenia. Wyjątek bez powodu oznacza czerwony test (wzór: `tests/matrix-exceptions.json`).
- **Uzupełnienie:** walidator kontraktu póz (contract.ts) powinien dostać tę samą miarę, żeby generator odrzucał takie pozy przed importem.
- **Stan dziś:** z tym progiem test na main byłby czerwony dla 16 ćwiczeń z listy BŁĘDÓW. Pozycje „DO OCENY” trzeba rozstrzygnąć (naprawa albo wyjątek z powodem) przed włączeniem testu.

## 9. Tabela wszystkich ćwiczeń z figurą
Kolumny: maksymalne odchylenie łamanej od cięciwy w najgorszym widoku, zawrócenia, zakres poziomy. Wiersze „main” to 1.0. Wiersze „integracja” rodzin squat/hinge/bench_press pokazują dzisiejszy stan gałęzi integracji (inna geometria niż main). „—” = poniżej progu.

| # | Ćwiczenie | System | Gałąź | Rodzina | Status | Widoczne w 1.0 | Maks. odchylenie od cięciwy (cm) / widok | Zawrócenia w poziomie (≥1 cm) | Zakres poziomy (cm) | Klasyfikacja |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Bench Press (sztanga) | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 14.0 | — |
| 2 | Bench Press (hantle) | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 16.0 | — |
| 3 | Incline Bench Press (sztanga) | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 13.4 | — |
| 4 | Incline Bench Press (hantle) | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 13.4 | — |
| 5 | Decline Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.8 | — |
| 6 | Deadlift (sztanga) | v2 | main | hinge | ready | tak | 4.2 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 7 | Deadlift (hantle) | v2 | main | hinge | ready | tak | 1.7 (side) | 1 | 1.8 | — |
| 8 | Sumo Deadlift | v2 | main | hinge | ready | tak | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 9 | Trap Bar Deadlift | v2 | main | hinge | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 10 | RDL (sztanga) | v2 | main | hinge | ready | tak | 5.4 (side) | 1 | 6.0 | DO OCENY (łuk „C” po udach) |
| 11 | RDL (hantle/linki) | v2 | main | hinge | ready | tak | 4.2 (side) | 1 | 4.2 | DO OCENY (łuk „C” po udach) |
| 12 | Good Morning | v2 | main | hinge | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 13 | Close Grip Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 18.0 | — |
| 14 | Back Squat | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 15 | Front Squat | v2 | main | squat | ready | tak | 3.3 (side) | 0 | 3.3 | DO OCENY |
| 16 | Goblet Squat | v2 | main | squat | ready | tak | 6.1 (side) | 1 | 9.0 | DO OCENY |
| 17 | Przysiad z pasem (linki) | v2 | main | squat | ready | tak | 8.6 (side) | 0 | 22.7 | OCZEKIWANY ŁUK (tor miednicy w przysiadzie) |
| 18 | Box Squat | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 19 | Wall Sit | v2 | main | squat | ready | tak | izometria — śladu brak | — | — | — |
| 20 | Decline Bench Press (hantle) | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.8 | — |
| 21 | Floor Press (hantle) | v2 | main | bench_press | ready | tak | 0.2 (side) | 0 | 15.0 | — |
| 22 | Floor Press (sztanga) | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 23 | Squeeze Press (hantle) | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 24 | Smith Machine Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 25 | Smith Machine Incline Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.1 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 26 | Rack Pull | v2 | main | hinge | ready | tak | 5.6 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 27 | JM Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 12.0 | — |
| 28 | Single Leg RDL (hantel) | v2 | main | hinge | ready | tak | 4.4 (side) | 1 | 4.8 | DO OCENY (łuk „C” po udach) |
| 29 | Single Leg RDL (linki) | v2 | main | hinge | ready | tak | 5.5 (side) | 1 | 6.0 | DO OCENY (łuk „C” po udach) |
| 30 | Cable Squat | v2 | main | squat | ready | tak | 5.1 (side) | 1 | 8.2 | DO OCENY |
| 31 | Bodyweight Squat | v2 | main | squat | ready | tak | 4.3 (side) | 1 | 4.6 | OCZEKIWANY (śledzi dłonie wysunięte w przód, nie ciężar) |
| 32 | Smith Machine Squat | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 33 | Zercher Squat | v2 | main | squat | ready | tak | 9.9 (side) | 0 | 11.6 | DO OCENY |
| 34 | Double Kettlebell Front Squat | v2 | main | squat | ready | tak | 3.7 (side) | 0 | 3.8 | DO OCENY |
| 35 | Landmine Squat | v2 | main | squat | ready | tak | 4.8 (side) | 1 | 6.7 | OCZEKIWANY ŁUK |
| 36 | Sumo Squat (hantel) | v2 | main | squat | ready | tak | 7.3 (side) | 0 | 24.2 | DO OCENY |
| 37 | Cable Pull Through | v2 | main | hinge | ready | tak | 5.5 (side) | 0 | 8.2 | OCZEKIWANY ŁUK |
| 38 | Sumo Deadlift (kettlebell) | v2 | main | hinge | ready | tak | 4.4 (side) | 0 | 4.5 | DO OCENY (haczyk w przód przy wyproście) |
| 39 | Single Arm RDL (hantel/linka) | v2 | main | hinge | ready | tak | 2.2 (side) | 0 | 3.2 | — |
| 40 | One-Arm Kettlebell Floor Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 41 | One Arm Dumbbell Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 42 | Barbell Guillotine Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 2.0 | — |
| 43 | Wide-Grip Barbell Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 44 | Smith Machine Decline Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.8 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 45 | Band Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 46 | Chain Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 47 | Axle Deadlift | v2 | main | hinge | ready | tak | 4.2 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 48 | Deadlift with Bands | v2 | main | hinge | ready | tak | 4.2 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 49 | Deadlift with Chains | v2 | main | hinge | ready | tak | 4.2 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 50 | Deficit Deadlift | v2 | main | hinge | ready | tak | 4.7 (side) | 2 | 8.8 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 51 | Rack Pull with Bands | v2 | main | hinge | ready | tak | 5.6 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 52 | Reverse Band Deadlift | v2 | main | hinge | ready | tak | 4.2 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 53 | Bench Press with Chains | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 54 | Floor Press with Chains | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 55 | Reverse Band Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 56 | Board Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 57 | Pin Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 15.0 | — |
| 58 | Close-Grip Dumbbell Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 18.0 | — |
| 59 | Close-Grip EZ-Bar Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 18.0 | — |
| 60 | Smith Machine Close-Grip Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 18.0 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 61 | Reverse Grip Bench Press | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 17.0 | — |
| 62 | Decline Close-Grip Bench To Skull Crusher | v2 | main | bench_press | ready | tak | 0.0 (side) | 0 | 9.0 | — |
| 63 | Box Squat with Bands | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 64 | Box Squat with Chains | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 65 | Reverse Band Box Squat | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 66 | Reverse Band Power Squat | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 67 | Squat with Bands | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 68 | Squat with Chains | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 69 | Barbell Hack Squat | v2 | main | squat | ready | tak | 8.6 (side) | 0 | 21.9 | DO OCENY |
| 70 | Overhead Squat | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 71 | Dumbbell Squat | v2 | main | squat | ready | tak | 3.5 (side) | 1 | 4.4 | DO OCENY |
| 72 | One-Arm Overhead Kettlebell Squat | v2 | main | squat | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 73 | Dip Belt Squat | v2 | main | squat | ready | tak | 8.6 (side) | 0 | 22.7 | OCZEKIWANY ŁUK (tor miednicy w przysiadzie) |
| 74 | Band Squat | v2 | main | squat | ready | tak | 4.3 (side) | 1 | 4.6 | OCZEKIWANY (śledzi dłonie wysunięte w przód, nie ciężar) |
| 75 | Cable Deadlift | v2 | main | hinge | ready | tak | 4.4 (side) | 2 | 9.0 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 76 | Leverage Deadlift | v2 | main | hinge | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 77 | One-Arm Side Deadlift | v2 | main | hinge | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 78 | Rickshaw Deadlift | v2 | main | hinge | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 79 | Band Good Morning | v2 | main | hinge | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 80 | Clean Deadlift | v2 | main | hinge | ready | tak | 4.2 (side) | 2 | 8.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 81 | Good Morning off Pins | v2 | main | hinge | ready | tak | 0.0 (side) | 0 | 0.0 | — |
| 82 | Reverse Band Sumo Deadlift | v2 | main | hinge | ready | tak | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 83 | Smith Machine Stiff-Legged Deadlift | v2 | main | hinge | ready | tak | 6.4 (side) | 1 | 6.5 | BŁĄD (maszyna Smitha: gryf na prowadnicach, szyna rysowana pod gryfem) |
| 84 | Snatch Deadlift | v2 | main | hinge | ready | tak | 4.9 (side) | 2 | 9.0 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 85 | Stiff-Legged Barbell Deadlift | v2 | main | hinge | ready | tak | 6.4 (side) | 1 | 6.5 | DO OCENY (łuk „C” po udach) |
| 86 | Sumo Deadlift with Bands | v2 | main | hinge | ready | tak | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 87 | Sumo Deadlift with Chains | v2 | main | hinge | ready | tak | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 88 | Bench Press (sztanga) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 14.0 | — |
| 89 | Bench Press (hantle) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 16.0 | — |
| 90 | Incline Bench Press (sztanga) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 13.4 | — |
| 91 | Incline Bench Press (hantle) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 13.4 | — |
| 92 | Decline Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.8 | — |
| 93 | Deadlift (sztanga) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.0 (side) | 2 | 15.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 94 | Deadlift (hantle) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 16.3 (side) | 1 | 22.5 | BŁĄD (tylko integracja: brak poprawki z main) |
| 95 | Sumo Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 96 | Trap Bar Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 97 | RDL (sztanga) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 7.5 (side) | 1 | 8.2 | DO OCENY (łuk „C” po udach) |
| 98 | RDL (hantle/linki) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 6.8 (side) | 1 | 7.5 | DO OCENY (łuk „C” po udach) |
| 99 | Chin Up | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 100 | Pull Up | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 101 | Neutral Grip Pull Up | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 102 | Good Morning | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 103 | Close Grip Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 18.0 | — |
| 104 | Back Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 105 | Front Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 3.7 (side) | 0 | 3.8 | DO OCENY |
| 106 | Goblet Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 6.1 (side) | 1 | 9.0 | DO OCENY |
| 107 | Przysiad z pasem (linki) | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 8.6 (side) | 0 | 22.7 | OCZEKIWANY ŁUK (tor miednicy w przysiadzie) |
| 108 | Box Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 109 | Wall Sit | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | izometria — śladu brak | — | — | — |
| 110 | Decline Bench Press (hantle) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.8 | — |
| 111 | Floor Press (hantle) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.3 (side) | 0 | 15.0 | — |
| 112 | Floor Press (sztanga) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 113 | Squeeze Press (hantle) | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 114 | Smith Machine Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 115 | Smith Machine Incline Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.1 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 116 | Rack Pull | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 3.7 (side) | 1 | 13.8 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 117 | Dead Hang | v2 | integracja | pull_up | ready | nie | izometria — śladu brak | — | — | — |
| 118 | JM Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 12.0 | — |
| 119 | Single Leg RDL (hantel) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 7.1 (side) | 1 | 7.5 | DO OCENY (łuk „C” po udach) |
| 120 | Single Leg RDL (linki) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 7.9 (side) | 1 | 8.8 | DO OCENY (łuk „C” po udach) |
| 121 | Cable Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 5.1 (side) | 1 | 8.2 | DO OCENY |
| 122 | Bodyweight Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 4.3 (side) | 1 | 4.6 | OCZEKIWANY (śledzi dłonie wysunięte w przód, nie ciężar) |
| 123 | Smith Machine Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 124 | Zercher Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 9.9 (side) | 0 | 11.6 | DO OCENY |
| 125 | Double Kettlebell Front Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 3.7 (side) | 0 | 3.8 | DO OCENY |
| 126 | Landmine Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 4.8 (side) | 1 | 6.7 | OCZEKIWANY ŁUK |
| 127 | Sumo Squat (hantel) | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 7.3 (side) | 0 | 24.2 | DO OCENY |
| 128 | Cable Pull Through | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 6.2 (side) | 1 | 7.2 | OCZEKIWANY ŁUK |
| 129 | Sumo Deadlift (kettlebell) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 4.4 (side) | 0 | 4.5 | DO OCENY (haczyk w przód przy wyproście) |
| 130 | Single Arm RDL (hantel/linka) | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 4.1 (side) | 0 | 5.8 | DO OCENY (łuk „C” po udach) |
| 131 | One-Arm Kettlebell Floor Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 132 | One Arm Dumbbell Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 133 | Barbell Guillotine Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 2.0 | — |
| 134 | Wide-Grip Barbell Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 135 | Smith Machine Decline Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.8 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 136 | Band Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 137 | Chain Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 138 | Axle Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.0 (side) | 2 | 15.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 139 | Deadlift with Bands | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.0 (side) | 2 | 15.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 140 | Deadlift with Chains | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.0 (side) | 2 | 15.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 141 | Deficit Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 14.7 (side) | 2 | 15.8 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 142 | Gironda Sternum Chins | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 16.0 | — |
| 143 | Mixed Grip Chin | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 144 | One Arm Chin-Up | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 145 | Rack Pull with Bands | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 3.7 (side) | 1 | 13.8 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 146 | Reverse Band Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.0 (side) | 2 | 15.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 147 | Scapular Pull-Up | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 148 | Side To Side Chins | v2 | integracja | pull_up | ready | nie | 2.5 (front) | 0 | 10.0 | — |
| 149 | Wide-Grip Rear Pull-Up | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 150 | Bench Press with Chains | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 151 | Floor Press with Chains | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 152 | Reverse Band Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 153 | Board Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 154 | Pin Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 15.0 | — |
| 155 | Close-Grip Dumbbell Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 18.0 | — |
| 156 | Close-Grip EZ-Bar Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 18.0 | — |
| 157 | Smith Machine Close-Grip Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 18.0 | BŁĄD (szyna przesuwa się z gryfem; tor ukośny ~15 cm) |
| 158 | Reverse Grip Bench Press | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 17.0 | — |
| 159 | Decline Close-Grip Bench To Skull Crusher | v2 | integracja | bench_press | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 9.0 | — |
| 160 | Box Squat with Bands | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 161 | Box Squat with Chains | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 162 | Reverse Band Box Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 163 | Reverse Band Power Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 164 | Squat with Bands | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 165 | Squat with Chains | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 166 | Barbell Hack Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 8.6 (side) | 0 | 21.9 | DO OCENY |
| 167 | Overhead Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 168 | Dumbbell Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 3.5 (side) | 1 | 4.4 | DO OCENY |
| 169 | One-Arm Overhead Kettlebell Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 170 | Dip Belt Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 8.6 (side) | 0 | 22.7 | OCZEKIWANY ŁUK (tor miednicy w przysiadzie) |
| 171 | Band Squat | v2 | integracja | squat | ready | nie (stan gałęzi integracji) | 4.3 (side) | 1 | 4.6 | OCZEKIWANY (śledzi dłonie wysunięte w przód, nie ciężar) |
| 172 | Cable Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.7 (side) | 2 | 15.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 173 | Leverage Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 174 | One-Arm Side Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.3 (side) | 2 | 17.0 | BŁĄD (tylko integracja: brak poprawki z main) |
| 175 | Rickshaw Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 176 | Band Good Morning | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 177 | Clean Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.0 (side) | 2 | 15.5 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 178 | Good Morning off Pins | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 0.0 (side) | 0 | 0.0 | — |
| 179 | Reverse Band Sumo Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 180 | Smith Machine Stiff-Legged Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 6.9 (side) | 1 | 7.0 | BŁĄD (maszyna Smitha: gryf na prowadnicach, szyna rysowana pod gryfem) |
| 181 | Snatch Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 12.9 (side) | 2 | 19.0 | BŁĄD (S: gryf wypchnięty kolanem, potem za śródstopiem) |
| 182 | Stiff-Legged Barbell Deadlift | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 6.9 (side) | 1 | 7.0 | DO OCENY (łuk „C” po udach) |
| 183 | Sumo Deadlift with Bands | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 184 | Sumo Deadlift with Chains | v2 | integracja | hinge | ready | nie (stan gałęzi integracji) | 5.6 (side) | 0 | 6.8 | DO OCENY (haczyk w przód przy wyproście) |
| 185 | Gorilla Chin/Crunch | v2 | integracja | pull_up | ready | nie | 0.0 (side) | 0 | 0.0 | — |
| 186 | Back Extension | v2 | integracja | back_extension | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 187 | Reverse Hyperextension | v2 | integracja | back_extension | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 188 | Lower Back Curl | v2 | integracja | back_extension | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 189 | Wyciskanie na linkach (stojąc) | v2 | integracja | cable_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 190 | Single Arm Cable Chest Press | v2 | integracja | cable_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 191 | Seated Cable Chest Press | v2 | integracja | cable_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 192 | Incline Cable Chest Press | v2 | integracja | cable_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 193 | Seated Cable Row | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 194 | Wiosłowanie na linkach (siedząc) | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 195 | Cable Rope Rear-Delt Rows | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 196 | Standing Cable Row | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 197 | Single Arm Cable Row | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 198 | Face Pull | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 199 | Machine Row | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 200 | Leverage High Row | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 201 | Kneeling High Pulley Row | v2 | integracja | cable_row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 202 | Łydki na stopniu | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 203 | Standing Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 204 | Smith Machine Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 205 | Calf Raise (sztanga) | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 206 | Calf Raise (linki) | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 207 | Donkey Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 208 | Band Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 209 | Single Leg Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 210 | Seated Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 211 | Seated Calf Raise (hantle) | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 212 | Barbell Seated Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.2 (side) | 0 | 0.9 | — |
| 213 | Dumbbell Seated One-Leg Calf Raise | v2 | integracja | calf_raise | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 214 | Farmer's Walk | v2 | integracja | carry | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 215 | Farmer's Walk (Farmers Handles) | v2 | integracja | carry | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 216 | Farmer's Walk (trap bar) | v2 | integracja | carry | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 217 | Rickshaw Carry | v2 | integracja | carry | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 218 | Suitcase Carry | v2 | integracja | carry | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 219 | Overhead Carry (hantle) | v2 | integracja | carry | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 220 | Double Kettlebell Front Rack Carry | v2 | integracja | carry | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 221 | Chest Fly (hantle) | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 222 | Incline Chest Fly (hantle) | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 223 | Decline Dumbbell Fly | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 224 | One-Arm Flat Bench Dumbbell Fly | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 225 | Flat Bench Cable Fly | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 226 | Incline Cable Fly | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 227 | Cable Fly | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 228 | Cable Fly (high to low) | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 229 | Cable Fly (low to high) | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 230 | Single Arm Cable Fly | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 231 | Band Chest Fly | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 232 | Pec Deck | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 233 | Crucifix | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 234 | Pullover (hantel) | v2 | integracja | chest_fly | planned | nie | 0.0 (top) | 0 | 0.0 | — |
| 235 | Front Raise And Pullover | v2 | integracja | chest_fly | planned | nie | 40.1 (side) | 0 | 116.8 | OCZEKIWANY ŁUK (obrót wokół barku) |
| 236 | Wide-Grip Decline Barbell Pullover | v2 | integracja | chest_fly | planned | nie | 22.6 (side) | 0 | 89.3 | OCZEKIWANY ŁUK (obrót wokół barku) |
| 237 | Bent-Arm Barbell Pullover | v2 | integracja | chest_fly | planned | nie | 18.7 (side) | 1 | 52.0 | OCZEKIWANY ŁUK (obrót wokół barku) |
| 238 | Machine Chest Press | v2 | integracja | chest_press_machine | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 239 | Leverage Incline Chest Press | v2 | integracja | chest_press_machine | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 240 | Leverage Decline Chest Press | v2 | integracja | chest_press_machine | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 241 | Machine Shoulder Press | v2 | integracja | chest_press_machine | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 242 | Smith Machine Shoulder Press | v2 | integracja | chest_press_machine | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 243 | Crunch | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 244 | Frog Sit-Ups | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 245 | Janda Sit-Up | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 246 | Oblique Crunches - On The Floor | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 247 | Sit Up | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 248 | Toe Touchers | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 249 | Bicycle Crunch | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 250 | Cross-Body Crunch | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 251 | Scissor Kick | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 252 | Bird Dog | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 253 | Crunch - Hands Overhead | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 254 | Dead Bug | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 255 | Hollow Hold | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 256 | Lying Leg Raise | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 257 | Reverse Crunch | v2 | integracja | core_floor | planned | nie | 0.3 (side) | 0 | 1.2 | — |
| 258 | Tuck Crunch | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 259 | Cocoons | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 260 | Leg Pull-In | v2 | integracja | core_floor | planned | nie | 0.3 (side) | 0 | 1.5 | — |
| 261 | Superman | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 262 | V-Up | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 263 | Alternate Heel Touchers | v2 | integracja | core_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 264 | Hanging Knee Raise | v2 | integracja | core_hang | planned | nie | 0.2 (side) | 0 | 8.7 | — |
| 265 | Hanging Leg Raise | v2 | integracja | core_hang | planned | nie | 0.3 (side) | 0 | 10.4 | — |
| 266 | Toes to Bar | v2 | integracja | core_hang | planned | nie | 5.7 (side) | 0 | 22.0 | OCZEKIWANY ŁUK |
| 267 | Barbell Side Bend | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 268 | Side Bend (hantel) | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 269 | One-Arm High-Pulley Cable Side Bends | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 270 | Weighted Ball Side Bend | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 271 | Bosu Ball Cable Crunch With Side Bends | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 272 | Russian Twist | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 273 | Medicine Ball Full Twist | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 274 | Cable Russian Twists | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 275 | Pallof Press | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 276 | Pallof Press With Rotation | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 277 | Cable Woodchop | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 278 | Cable Judo Flip | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 279 | Landmine Rotation | v2 | integracja | core_standing | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 280 | Kettlebell Windmill | v2 | integracja | core_standing | planned | nie | 0.5 (side) | 0 | 18.0 | — |
| 281 | Double Kettlebell Windmill | v2 | integracja | core_standing | planned | nie | 0.5 (side) | 0 | 18.0 | — |
| 282 | Bent Press | v2 | integracja | core_standing | planned | nie | 11.4 (side) | 1 | 40.2 | OCZEKIWANY ŁUK |
| 283 | Barbell Curl | v2 | integracja | curl | planned | nie | 16.4 (side) | 1 | 21.9 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 284 | EZ Bar Curl | v2 | integracja | curl | planned | nie | 16.1 (side) | 1 | 21.5 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 285 | Reverse Curl | v2 | integracja | curl | planned | nie | 13.6 (side) | 1 | 22.2 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 286 | Drag Curl | v2 | integracja | curl | planned | nie | 11.0 (side) | 1 | 13.6 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 287 | Biceps Curl (hantle) | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 288 | Hammer Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 289 | Standing Dumbbell Reverse Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 290 | Zottman Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 291 | Standing Inner-Biceps Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 292 | Cross Body Hammer Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 293 | Cable Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 294 | Reverse Cable Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 295 | Hammer Curl (linki) | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 296 | Standing One-Arm Cable Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 297 | Cable Curl (dwie linki) | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 298 | Incline Curl (hantle) | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 299 | Incline Hammer Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 300 | Lying Supine Dumbbell Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 301 | High Cable Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 302 | Bayesian Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 303 | Concentration Curl (hantle) | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 304 | Seated Close-Grip Concentration Barbell Curl | v2 | integracja | curl | planned | nie | 14.3 (side) | 1 | 14.5 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 305 | Standing Concentration Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 306 | Lying Close-Grip Bar Curl On High Pulley | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 307 | Lying Cable Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 308 | Barbell Preacher Curl | v2 | integracja | curl | planned | nie | 15.5 (side) | 1 | 33.4 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 309 | Preacher Curl (EZ) | v2 | integracja | curl | planned | nie | 15.3 (side) | 1 | 33.0 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 310 | Reverse EZ-Bar Preacher Curl | v2 | integracja | curl | planned | nie | 13.4 (side) | 1 | 28.5 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 311 | Preacher Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 312 | Preacher Hammer Dumbbell Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 313 | Zottman Preacher Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 314 | Cable Preacher Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 315 | Machine Biceps Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 316 | One Arm Dumbbell Preacher Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 317 | Spider Curl | v2 | integracja | curl | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 318 | Spider Curl (sztanga) | v2 | integracja | curl | planned | nie | 15.8 (side) | 1 | 28.2 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 319 | Lateral Raise (hantle) | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 320 | One-Arm Lateral Raise (hantel) | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 321 | Band Lateral Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 322 | Dumbbell Scaption | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 323 | Front Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 324 | Single Dumbbell Front Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 325 | Front Plate Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 326 | Alternating Deltoid Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 327 | Barbell Front Raise to Overhead | v2 | integracja | delt_raise | planned | nie | 47.5 (side) | 1 | 62.0 | OCZEKIWANY ŁUK (obrót wokół barku) |
| 328 | Dumbbell Front Raise to Overhead | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 329 | Cable Front Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 330 | Cable Lateral Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 331 | Cable Seated Lateral Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 332 | Upright Row (sztanga) | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 333 | Upright Row (hantle) | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 334 | Dumbbell One-Arm Upright Row | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 335 | Upright Row (linki) | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 336 | Band Upright Row | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 337 | Smith Machine Upright Row | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 338 | Car Drivers | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 339 | Reverse Fly (hantle) | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 340 | One-Arm Cable Rear Lateral Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 341 | Cable Reverse Fly | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 342 | Y Raise (hantle) | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 343 | Cable Y Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 344 | Machine Lateral Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 345 | Reverse Pec Deck | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 346 | Straight Raises on Incline Bench | v2 | integracja | delt_raise | planned | nie | 18.2 (side) | 0 | 61.9 | OCZEKIWANY ŁUK (obrót wokół barku) |
| 347 | Smith Machine One-Arm Upright Row | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 348 | Front Incline Dumbbell Raise | v2 | integracja | delt_raise | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 349 | Chest Dip | v2 | integracja | dip | planned | nie | 0.1 (side) | 0 | 3.5 | — |
| 350 | Triceps Dip | v2 | integracja | dip | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 351 | Ring Dips | v2 | integracja | dip | planned | nie | 0.1 (side) | 0 | 1.3 | — |
| 352 | Dip Machine | v2 | integracja | dip | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 353 | Triceps Dips (ławka) | v2 | integracja | dip | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 354 | Barbell Wrist Curl | v2 | integracja | forearm | planned | nie | 1.8 (side) | 1 | 2.6 | — |
| 355 | Barbell Reverse Wrist Curl | v2 | integracja | forearm | planned | nie | 2.0 (side) | 1 | 2.3 | — |
| 356 | Wrist Curl (hantle) | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 357 | Reverse Wrist Curl (hantle) | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 358 | One-Arm Dumbbell Wrist Curl | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 359 | One-Arm Dumbbell Reverse Wrist Curl | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 360 | Cable Wrist Curl | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 361 | Behind-the-Back Barbell Wrist Curl | v2 | integracja | forearm | planned | nie | 1.6 (side) | 0 | 8.8 | — |
| 362 | Reverse Plate Curls | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 363 | Dumbbell Lying Pronation | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 364 | Dumbbell Lying Supination | v2 | integracja | forearm | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 365 | Donkey Kick | v2 | integracja | glute_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 366 | Fire Hydrant | v2 | integracja | glute_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 367 | Clamshell | v2 | integracja | glute_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 368 | Cable Kickback | v2 | integracja | glute_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 369 | Hip Extension with Bands | v2 | integracja | glute_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 370 | Machine Glute Kickback | v2 | integracja | glute_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 371 | Prone Flutter Kicks | v2 | integracja | glute_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 372 | Hip Abduction | v2 | integracja | hip_abd_add | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 373 | Hip Adduction | v2 | integracja | hip_abd_add | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 374 | Cable Hip Abduction | v2 | integracja | hip_abd_add | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 375 | Cable Hip Adduction | v2 | integracja | hip_abd_add | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 376 | Lateral Band Walk | v2 | integracja | hip_abd_add | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 377 | Monster Walk | v2 | integracja | hip_abd_add | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 378 | Glute Bridge | v2 | integracja | hip_bridge | planned | nie | 1.3 (side) | 0 | 5.1 | — |
| 379 | Glute Bridge (sztanga) | v2 | integracja | hip_bridge | planned | nie | 1.3 (side) | 0 | 10.4 | — |
| 380 | Frog Pump | v2 | integracja | hip_bridge | planned | nie | 0.9 (side) | 0 | 3.6 | — |
| 381 | Single Leg Glute Bridge | v2 | integracja | hip_bridge | planned | nie | 1.3 (side) | 0 | 5.1 | — |
| 382 | Hip Thrust (sztanga) | v2 | integracja | hip_bridge | planned | nie | 1.9 (side) | 1 | 2.1 | — |
| 383 | Hip Thrust (hantel) | v2 | integracja | hip_bridge | planned | nie | 2.0 (side) | 0 | 8.1 | — |
| 384 | Single Leg Hip Thrust | v2 | integracja | hip_bridge | planned | nie | 2.0 (side) | 0 | 8.1 | — |
| 385 | Smith Machine Hip Thrust | v2 | integracja | hip_bridge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 386 | Machine Hip Thrust | v2 | integracja | hip_bridge | planned | nie | 2.0 (side) | 0 | 8.1 | — |
| 387 | Stability Ball Hip Bridge | v2 | integracja | hip_bridge | planned | nie | 1.1 (side) | 0 | 8.9 | — |
| 388 | Kettlebell Swing | v2 | integracja | kb_ballistic | planned | nie | 0.7 (side) | 0 | 3.9 | — |
| 389 | One-Arm Kettlebell Swings | v2 | integracja | kb_ballistic | planned | nie | 0.7 (side) | 0 | 3.9 | — |
| 390 | Kettlebell Clean | v2 | integracja | kb_ballistic | planned | nie | 2.3 (side) | 2 | 6.6 | OCZEKIWANY ŁUK (zamach/zarzut, tor miednicy) |
| 391 | Double Kettlebell Clean | v2 | integracja | kb_ballistic | planned | nie | 2.3 (side) | 2 | 6.6 | OCZEKIWANY ŁUK (zamach/zarzut, tor miednicy) |
| 392 | Dumbbell Clean | v2 | integracja | kb_ballistic | planned | nie | 2.3 (side) | 2 | 6.6 | OCZEKIWANY ŁUK (zamach/zarzut, tor miednicy) |
| 393 | Bottoms-Up Clean From The Hang Position | v2 | integracja | kb_ballistic | planned | nie | 2.0 (side) | 1 | 6.8 | — |
| 394 | Kettlebell Snatch | v2 | integracja | kb_ballistic | planned | nie | 19.5 (side) | 1 | 11.2 | OCZEKIWANY ŁUK (zamach/zarzut, tor miednicy) |
| 395 | Double Kettlebell Snatch | v2 | integracja | kb_ballistic | planned | nie | 19.6 (side) | 1 | 11.2 | OCZEKIWANY ŁUK (zamach/zarzut, tor miednicy) |
| 396 | Snatch (hantel) | v2 | integracja | kb_ballistic | planned | nie | 19.5 (side) | 1 | 11.2 | OCZEKIWANY ŁUK (zamach/zarzut, tor miednicy) |
| 397 | Double Kettlebell Push Press | v2 | integracja | kb_ballistic | planned | nie | 13.8 (side) | 2 | 18.5 | DO OCENY (tor miednicy: wybicie w przód 10–18 cm) |
| 398 | Double Kettlebell Jerk | v2 | integracja | kb_ballistic | planned | nie | 10.4 (side) | 2 | 18.5 | DO OCENY (tor miednicy: wybicie w przód 10–18 cm) |
| 399 | One-Arm Kettlebell Push Press | v2 | integracja | kb_ballistic | planned | nie | 14.1 (side) | 2 | 18.1 | DO OCENY (tor miednicy: wybicie w przód 10–18 cm) |
| 400 | One-Arm Kettlebell Jerk | v2 | integracja | kb_ballistic | planned | nie | 9.8 (side) | 2 | 17.8 | DO OCENY (tor miednicy: wybicie w przód 10–18 cm) |
| 401 | One-Arm Kettlebell Split Jerk | v2 | integracja | kb_ballistic | planned | nie | 17.6 (side) | 1 | 20.4 | DO OCENY (tor miednicy: wybicie w przód 10–18 cm) |
| 402 | Kettlebell Sumo High Pull | v2 | integracja | kb_ballistic | planned | nie | 2.6 (side) | 0 | 16.7 | — |
| 403 | One-Arm Kettlebell Clean and Jerk | v2 | integracja | kb_ballistic | planned | nie | 26.4 (side) | 2 | 19.2 | DO OCENY (tor miednicy: wybicie w przód 10–18 cm) |
| 404 | Seated Good Mornings | v2 | integracja | kneeling_hinge | planned | nie | 3.3 (side) | 0 | 34.6 | OCZEKIWANY ŁUK |
| 405 | Leg Extension | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 406 | Single-Leg Leg Extension | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 407 | Leg Curl | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 408 | Lying Leg Curl | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 409 | Standing Leg Curl | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 410 | Standing Cable Leg Curl | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 411 | Seated Band Hamstring Curl | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 412 | Slider Hamstring Curl | v2 | integracja | leg_isolation | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 413 | Leg Press | v2 | integracja | leg_machine | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 414 | Single Leg Press | v2 | integracja | leg_machine | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 415 | Hack Squat | v2 | integracja | leg_machine | planned | nie | 0.7 (side) | 0 | 12.5 | — |
| 416 | Pendulum Squat | v2 | integracja | leg_machine | planned | nie | 1.1 (side) | 0 | 12.5 | — |
| 417 | Lying Machine Squat | v2 | integracja | leg_machine | planned | nie | 0.7 (side) | 0 | 21.0 | — |
| 418 | Belt Squat Machine | v2 | integracja | leg_machine | planned | nie | 6.8 (side) | 0 | 16.2 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 419 | Split Squat | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 420 | Split Squat (linki) | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 421 | Reverse Lunge | v2 | integracja | lunge | planned | nie | 4.0 (side) | 0 | 36.0 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 422 | Walking Lunges | v2 | integracja | lunge | planned | nie | 4.8 (side) | 0 | 53.4 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 423 | Lunges (hantle) | v2 | integracja | lunge | planned | nie | 4.8 (side) | 0 | 53.4 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 424 | Lunges (sztanga) | v2 | integracja | lunge | planned | nie | 4.7 (side) | 0 | 53.4 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 425 | Barbell Walking Lunge | v2 | integracja | lunge | planned | nie | 4.7 (side) | 0 | 53.4 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 426 | Elevated Back Lunge | v2 | integracja | lunge | planned | nie | 4.6 (side) | 0 | 46.7 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 427 | Slider Reverse Lunge | v2 | integracja | lunge | planned | nie | 4.0 (side) | 0 | 36.0 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 428 | Step Up | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 40.1 | — |
| 429 | Barbell Step Up | v2 | integracja | lunge | planned | nie | 0.1 (side) | 0 | 36.7 | — |
| 430 | Pistol Squat | v2 | integracja | lunge | planned | nie | 9.7 (side) | 1 | 18.3 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 431 | Smith Machine Pistol Squat | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 432 | Single-Leg High Box Squat | v2 | integracja | lunge | planned | nie | 6.5 (side) | 0 | 17.1 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 433 | Lunge Pass Through | v2 | integracja | lunge | planned | nie | 4.0 (side) | 0 | 36.0 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 434 | Curtsy Lunge | v2 | integracja | lunge | planned | nie | 3.5 (side) | 0 | 32.0 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 435 | Crossover Reverse Lunge | v2 | integracja | lunge | planned | nie | 3.5 (side) | 0 | 32.0 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 436 | Bulgarian Split Squat (hantle) | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 437 | Bulgarian Split Squat (sztanga) | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 438 | Smith Machine Bulgarian Split Squat | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 439 | Suspended Split Squat | v2 | integracja | lunge | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 440 | Lateral Lunge | v2 | integracja | lunge | planned | nie | 3.2 (side) | 0 | 18.0 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 441 | Cossack Squat | v2 | integracja | lunge | planned | nie | 4.3 (front) | 0 | 27.5 | OCZEKIWANY ŁUK (krok / miednica w tył) |
| 442 | Barbell Side Split Squat | v2 | integracja | lunge | planned | nie | 13.0 (side) | 1 | 13.0 | DO OCENY |
| 443 | The Straddle | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 444 | Seated Calf Stretch | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 445 | Seated Floor Hamstring Stretch | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 446 | Butterfly Stretch | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 447 | Child's Pose | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 448 | Kneeling Hip Flexor Stretch | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 449 | Supine Hamstring Stretch | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 450 | Side-Lying Quad Stretch | v2 | integracja | mobility_floor | planned | nie | izometria — śladu brak | — | — | — |
| 451 | Cat-Cow | v2 | integracja | mobility_floor | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 452 | Chin To Chest Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 453 | Side Neck Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 454 | Overhead Triceps Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 455 | Standing Chest Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 456 | Standing Gastrocnemius Calf Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 457 | Wall Calf Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 458 | Standing Soleus And Achilles Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 459 | Standing Lateral Stretch | v2 | integracja | mobility_stand | planned | nie | izometria — śladu brak | — | — | — |
| 460 | Power Clean | v2 | integracja | olympic | planned | nie | 16.4 (side) | 5 | 24.2 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 461 | Clean | v2 | integracja | olympic | planned | nie | 18.5 (side) | 3 | 21.7 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 462 | Split Clean | v2 | integracja | olympic | planned | nie | 13.2 (side) | 5 | 23.9 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 463 | Hang Clean | v2 | integracja | olympic | planned | nie | 20.4 (side) | 1 | 21.0 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 464 | Block Clean | v2 | integracja | olympic | planned | nie | 19.9 (side) | 2 | 22.0 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 465 | Block Power Clean | v2 | integracja | olympic | planned | nie | 15.1 (side) | 4 | 24.7 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 466 | Barbell Snatch | v2 | integracja | olympic | planned | nie | 11.0 (side) | 6 | 11.2 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 467 | Power Snatch | v2 | integracja | olympic | planned | nie | 14.2 (side) | 5 | 17.8 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 468 | Split Snatch | v2 | integracja | olympic | planned | nie | 9.4 (side) | 5 | 22.9 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 469 | Hang Snatch | v2 | integracja | olympic | planned | nie | 12.1 (side) | 4 | 11.7 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 470 | Block Snatch | v2 | integracja | olympic | planned | nie | 10.7 (side) | 5 | 10.7 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 471 | Block Power Snatch | v2 | integracja | olympic | planned | nie | 12.7 (side) | 4 | 18.0 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 472 | Clean Pull | v2 | integracja | olympic | planned | nie | 5.0 (side) | 2 | 6.7 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 473 | Snatch Pull | v2 | integracja | olympic | planned | nie | 5.0 (side) | 2 | 6.8 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 474 | Clean Shrug | v2 | integracja | olympic | planned | nie | 2.8 (side) | 0 | 6.5 | — |
| 475 | Snatch Shrug | v2 | integracja | olympic | planned | nie | 3.7 (side) | 0 | 6.5 | DO OCENY |
| 476 | Power Jerk | v2 | integracja | olympic | planned | nie | 20.8 (side) | 2 | 20.6 | BŁĄD (podrzut: gryf ucieka 13–21 cm w przód i wraca) |
| 477 | Split Jerk | v2 | integracja | olympic | planned | nie | 8.8 (side) | 3 | 33.8 | BŁĄD (podrzut: gryf ucieka 13–21 cm w przód i wraca) |
| 478 | Squat Jerk | v2 | integracja | olympic | planned | nie | 18.9 (side) | 3 | 24.4 | BŁĄD (podrzut: gryf ucieka 13–21 cm w przód i wraca) |
| 479 | Jerk Dip Squat | v2 | integracja | olympic | planned | nie | 0.8 (side) | 0 | 15.5 | — |
| 480 | Snatch Balance | v2 | integracja | olympic | planned | nie | 19.0 (side) | 1 | 49.0 | DO OCENY |
| 481 | Muscle Snatch | v2 | integracja | olympic | planned | nie | 8.7 (side) | 3 | 8.8 | DO OCENY (S w ciągu; 1. ciąg 2,6–3,9 cm od ciała przy kolanie) |
| 482 | Clean and Jerk | v2 | integracja | olympic | planned | nie | 31.0 (side) | 7 | 40.8 | BŁĄD (podrzut: gryf ucieka 13–21 cm w przód i wraca) |
| 483 | Overhead Press (sztanga) | v2 | integracja | overhead_press | planned | nie | 9.7 (side) | 0 | 14.8 | OCZEKIWANY ŁUK |
| 484 | Overhead Press (hantle) | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 485 | Band Shoulder Press | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 486 | Double Kettlebell Press | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 487 | Kettlebell Press | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 488 | Single Arm Overhead Press (hantel) | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 489 | See-Saw Press (Alternating Side Press) | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 490 | Arnold Press | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 491 | Kettlebell Arnold Press | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 492 | Seated Shoulder Press (hantle) | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 493 | Kettlebell Seated Press | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 494 | Seated Barbell Military Press | v2 | integracja | overhead_press | planned | nie | 9.7 (side) | 0 | 14.8 | OCZEKIWANY ŁUK |
| 495 | Seated Cable Shoulder Press | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 496 | Wyciskanie nad głowę (linki) | v2 | integracja | overhead_press | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 497 | Standing Barbell Press Behind Neck | v2 | integracja | overhead_press | planned | nie | 12.1 (side) | 0 | 21.0 | DO OCENY |
| 498 | Push Press | v2 | integracja | overhead_press | planned | nie | 9.7 (side) | 1 | 18.9 | DO OCENY |
| 499 | Push Press - Behind the Neck | v2 | integracja | overhead_press | planned | nie | 12.0 (side) | 2 | 21.0 | DO OCENY |
| 500 | Landmine Press | v2 | integracja | overhead_press | planned | nie | 1.7 (side) | 0 | 38.6 | — |
| 501 | Landmine Linear Jammer | v2 | integracja | overhead_press | planned | nie | 1.7 (side) | 0 | 38.6 | — |
| 502 | Pike Push Up | v2 | integracja | overhead_press | planned | nie | 1.5 (side) | 0 | 28.6 | — |
| 503 | Single-Arm Linear Jammer | v2 | integracja | overhead_press | planned | nie | 1.4 (side) | 0 | 34.6 | — |
| 504 | Jump Squat | v2 | integracja | plyo | planned | nie | 29.7 (side) | 4 | 26.6 | BŁĄD (skok w miejscu: zawracanie w poziomie w fazie lotu) |
| 505 | Tuck Jump | v2 | integracja | plyo | planned | nie | 23.7 (side) | 4 | 41.4 | DO OCENY (miednica ≠ środek masy w skulonej pozycji) |
| 506 | Double Leg Butt Kick | v2 | integracja | plyo | planned | nie | 37.4 (side) | 2 | 56.0 | BŁĄD (skok w miejscu: zawracanie w poziomie w fazie lotu) |
| 507 | Star Jump | v2 | integracja | plyo | planned | nie | 32.1 (side) | 4 | 33.3 | BŁĄD (skok w miejscu: zawracanie w poziomie w fazie lotu) |
| 508 | Box Jump | v2 | integracja | plyo | planned | nie | 59.3 (side) | 2 | 89.5 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 509 | Bench Jump | v2 | integracja | plyo | planned | nie | 55.2 (side) | 2 | 89.3 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 510 | Broad Jump | v2 | integracja | plyo | planned | nie | 41.8 (side) | 2 | 139.2 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 511 | Frog Hops | v2 | integracja | plyo | planned | nie | 49.2 (side) | 2 | 81.8 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 512 | Front Cone Hops | v2 | integracja | plyo | planned | nie | 24.5 (side) | 3 | 54.8 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 513 | Single-Leg Hop Progression | v2 | integracja | plyo | planned | nie | 25.7 (side) | 3 | 49.9 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 514 | Single Leg Butt Kick | v2 | integracja | plyo | planned | nie | 14.5 (side) | 3 | 28.7 | BŁĄD (skok w miejscu: zawracanie w poziomie w fazie lotu) |
| 515 | Box Skip | v2 | integracja | plyo | planned | nie | 51.7 (side) | 2 | 78.5 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 516 | Single-Leg Stride Jump | v2 | integracja | plyo | planned | nie | 55.4 (side) | 2 | 94.4 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 517 | Weighted Jump Squat | v2 | integracja | plyo | planned | nie | 21.3 (side) | 4 | 28.2 | BŁĄD (skok w miejscu: zawracanie w poziomie w fazie lotu) |
| 518 | Alternate Leg Push-Off | v2 | integracja | plyo | planned | nie | 8.5 (side) | 1 | 28.7 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 519 | Single Leg Push-Off | v2 | integracja | plyo | planned | nie | 62.0 (side) | 1 | 28.5 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 520 | Split Jump | v2 | integracja | plyo | planned | nie | 5.8 (side) | 1 | 5.8 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 521 | Alternate Leg Diagonal Bound | v2 | integracja | plyo | planned | nie | 43.0 (side) | 1 | 79.4 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 522 | Depth Jump | v2 | integracja | plyo | planned | nie | 33.5 (side) | 5 | 46.3 | DO OCENY (miednica ≠ środek masy w skulonej pozycji) |
| 523 | Dumbbell Seated Box Jump | v2 | integracja | plyo | planned | nie | 67.0 (side) | 1 | 124.5 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 524 | Lateral Cone Hops | v2 | integracja | plyo | planned | nie | 34.1 (front) | 0 | 55.0 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 525 | Side Hop-Sprint | v2 | integracja | plyo | planned | nie | 35.8 (front) | 0 | 60.0 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 526 | Side Standing Long Jump | v2 | integracja | plyo | planned | nie | 44.4 (front) | 0 | 110.0 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 527 | Lateral Bound | v2 | integracja | plyo | planned | nie | 44.4 (front) | 0 | 90.0 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 528 | Single-Leg Lateral Hop | v2 | integracja | plyo | planned | nie | 29.6 (front) | 0 | 45.0 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 529 | Lateral Box Jump | v2 | integracja | plyo | planned | nie | 55.9 (front) | 0 | 55.0 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 530 | Side to Side Box Shuffle | v2 | integracja | plyo | planned | nie | 30.2 (front) | 0 | 42.0 | OCZEKIWANY ŁUK (skok z przemieszczeniem / tor miednicy) |
| 531 | Lat Pulldown | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 532 | Close-Grip Front Lat Pulldown | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 533 | Underhand Lat Pulldown | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 534 | V-Bar Pulldown | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 535 | Single Arm Lat Pulldown | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 536 | Full Range-Of-Motion Lat Pulldown | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 537 | Wide-Grip Pulldown Behind The Neck | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 538 | Straight Arm Pulldown | v2 | integracja | pulldown | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 539 | Push Up | v2 | integracja | pushup_plank | planned | nie | 1.2 (side) | 0 | 5.0 | — |
| 540 | Push-Up Wide | v2 | integracja | pushup_plank | planned | nie | 1.5 (side) | 0 | 4.5 | — |
| 541 | Close-Grip Push-Up | v2 | integracja | pushup_plank | planned | nie | 1.3 (side) | 0 | 4.8 | — |
| 542 | Diamond Push Up | v2 | integracja | pushup_plank | planned | nie | 1.5 (side) | 0 | 4.5 | — |
| 543 | Decline Push Up | v2 | integracja | pushup_plank | planned | nie | 1.1 (side) | 0 | 4.6 | — |
| 544 | Incline Push Up | v2 | integracja | pushup_plank | planned | nie | 1.7 (side) | 0 | 17.0 | — |
| 545 | Incline Push-Up Close-Grip | v2 | integracja | pushup_plank | planned | nie | 1.5 (side) | 0 | 16.4 | — |
| 546 | Single-Arm Push-Up | v2 | integracja | pushup_plank | planned | nie | 0.2 (side) | 0 | 3.5 | — |
| 547 | Plank | v2 | integracja | pushup_plank | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 548 | Mountain Climbers | v2 | integracja | pushup_plank | planned | nie | 0.0 (side) | 1 | 1.5 | — |
| 549 | Plank Shoulder Taps | v2 | integracja | pushup_plank | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 550 | Plyo Push-Up | v2 | integracja | pushup_plank | planned | nie | 6.0 (side) | 1 | 7.9 | DO OCENY |
| 551 | Rollout (sztanga) | v2 | integracja | pushup_plank | planned | nie | 0.0 (side) | 0 | 62.0 | — |
| 552 | Barbell Rollout from Bench | v2 | integracja | pushup_plank | planned | nie | 0.0 (side) | 0 | 79.4 | — |
| 553 | Standing Barbell Rollout | v2 | integracja | pushup_plank | planned | nie | 0.0 (side) | 0 | 114.6 | — |
| 554 | Suspended Push-Up | v2 | integracja | pushup_plank | planned | nie | 1.6 (side) | 0 | 15.5 | — |
| 555 | Suspended Fallout | v2 | integracja | pushup_plank | planned | nie | 1.9 (side) | 0 | 18.0 | — |
| 556 | External Rotation (hantel) | v2 | integracja | rotator_cuff | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 557 | External Rotation (linki) | v2 | integracja | rotator_cuff | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 558 | External Rotation with Band | v2 | integracja | rotator_cuff | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 559 | Internal Rotation with Band | v2 | integracja | rotator_cuff | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 560 | Cable Internal Rotation | v2 | integracja | rotator_cuff | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 561 | Band Pull Apart | v2 | integracja | rotator_cuff | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 562 | Reverse Flyes With External Rotation | v2 | integracja | rotator_cuff | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 563 | Bent Over Row (sztanga) | v2 | integracja | row | planned | nie | 0.1 (side) | 0 | 23.7 | — |
| 564 | Bent Over Row (hantle) | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 565 | Reverse Grip Bent Over Row | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 23.2 | — |
| 566 | Barbell Rear Delt Row | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 16.0 | — |
| 567 | Pendlay Row | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 19.6 | — |
| 568 | Smith Machine Bent Over Row | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 569 | Bent Over Row (linki) | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 570 | One Arm Row (hantle) | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 571 | T-Bar Row | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 572 | Seal Row (sztanga) | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 24.0 | — |
| 573 | Lying T-Bar Row | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 574 | Chest Supported Row | v2 | integracja | row | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 575 | Shrugs (sztanga) | v2 | integracja | shrug | planned | nie | 0.2 (side) | 0 | 2.9 | — |
| 576 | Shrugs (hantle) | v2 | integracja | shrug | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 577 | Shrugs (linki) | v2 | integracja | shrug | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 578 | Barbell Shrug Behind The Back | v2 | integracja | shrug | planned | nie | 0.1 (side) | 0 | 11.6 | — |
| 579 | Smith Machine Behind the Back Shrug | v2 | integracja | shrug | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 580 | Leverage Shrug | v2 | integracja | shrug | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 581 | Calf-Machine Shoulder Shrug | v2 | integracja | shrug | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 582 | Middle Back Shrug | v2 | integracja | shrug | planned | nie | 0.0 (front) | 0 | 0.0 | — |
| 583 | Medicine Ball Slam | v2 | integracja | sled_throw | planned | nie | 3.0 (side) | 0 | 9.3 | — |
| 584 | One-Arm Medicine Ball Slam | v2 | integracja | sled_throw | planned | nie | 3.0 (side) | 0 | 9.3 | — |
| 585 | Standing Two-Arm Overhead Throw | v2 | integracja | sled_throw | planned | nie | 0.3 (side) | 0 | 6.7 | — |
| 586 | Backward Medicine Ball Throw | v2 | integracja | sled_throw | planned | nie | 6.6 (side) | 0 | 19.6 | OCZEKIWANY ŁUK |
| 587 | Medicine Ball Scoop Throw | v2 | integracja | sled_throw | planned | nie | 7.6 (side) | 1 | 20.3 | OCZEKIWANY ŁUK |
| 588 | Wall Ball | v2 | integracja | sled_throw | planned | nie | 16.3 (side) | 2 | 16.1 | OCZEKIWANY ŁUK (tor miednicy w przysiadzie) |
| 589 | Sled Push | v2 | integracja | sled_throw | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 590 | Sled Drag (Harness) | v2 | integracja | sled_throw | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 591 | Yoke Walk | v2 | integracja | strongman | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 592 | Thruster (hantle) | v2 | integracja | thruster | planned | nie | 6.3 (side) | 1 | 19.3 | OCZEKIWANY ŁUK (tor miednicy w przysiadzie) |
| 593 | Kettlebell Thruster | v2 | integracja | thruster | planned | nie | 6.3 (side) | 1 | 19.3 | OCZEKIWANY ŁUK (tor miednicy w przysiadzie) |
| 594 | Clean and Press | v2 | integracja | thruster | planned | nie | 5.1 (side) | 1 | 5.2 | DO OCENY |
| 595 | Overhead Triceps Extension (EZ) | v2 | integracja | triceps | planned | nie | 15.2 (side) | 1 | 33.8 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 596 | Standing Overhead Barbell Triceps Extension | v2 | integracja | triceps | planned | nie | 15.3 (side) | 1 | 34.1 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 597 | Overhead Triceps Extension (hantel) | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 598 | Kettlebell Overhead Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 599 | Dumbbell One-Arm Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 600 | Band Overhead Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 601 | Cable Overhead Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 602 | Standing Low-Pulley One-Arm Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 603 | Skullcrusher (sztanga) | v2 | integracja | triceps | planned | nie | 11.7 (side) | 1 | 21.8 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 604 | Skullcrusher (EZ) | v2 | integracja | triceps | planned | nie | 11.7 (side) | 1 | 21.8 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 605 | Skullcrusher (hantle) | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 606 | One-Arm Lying Dumbbell Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 607 | Band Skull Crusher | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 608 | Chain Handle Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 609 | Cable Lying Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 610 | Incline Barbell Triceps Extension | v2 | integracja | triceps | planned | nie | 5.2 (side) | 0 | 29.2 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 611 | Cable Incline Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 612 | Decline Dumbbell Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 613 | Decline EZ Bar Triceps Extension | v2 | integracja | triceps | planned | nie | 11.7 (side) | 1 | 21.8 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 614 | Tate Press | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 615 | Lying Close-Grip Barbell Triceps Extension Behind The Head | v2 | integracja | triceps | planned | nie | 9.6 (side) | 1 | 16.4 | OCZEKIWANY ŁUK (obrót wokół łokcia) |
| 616 | Machine Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 617 | Triceps Pushdown | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 618 | Reverse Grip Triceps Pushdown | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 619 | Single Arm Triceps Pushdown | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 620 | Triceps Kickback | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 621 | Two-Arm Dumbbell Kickback | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 622 | Triceps Kickback (linki) | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 623 | Kneeling Cable Triceps Extension | v2 | integracja | triceps | planned | nie | 0.0 (side) | 0 | 0.0 | — |
| 624 | Barbell Curl | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 625 | Bent Over Row (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 626 | Bent Over Row (sztanga) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 627 | Biceps Curl (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 628 | Bird Dog | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 629 | Bulgarian Split Squat (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 630 | Cable Curl | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 631 | Cable Lateral Raise | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 632 | Cable Overhead Extension | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 633 | Calf Press (leg press) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 634 | Chest Supported Row | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 635 | Chin Up | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 636 | Dead Bug | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 637 | EZ Bar Curl | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 638 | Face Pull | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 639 | Front Raise | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 640 | Glute Bridge | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 641 | Hammer Curl | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 642 | Hip Thrust (hantel) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 643 | Hip Thrust (sztanga) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 644 | Incline Push Up | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 645 | Kettlebell Swing | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 646 | Lat Pulldown | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 647 | Lateral Raise (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 648 | Leg Press | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 649 | Lunges (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 650 | Lying Leg Curl | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 651 | Machine Chest Press | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 652 | Mountain Climbers | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 653 | Neutral Grip Pull Up | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 654 | One Arm Row (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 655 | Overhead Press (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 656 | Overhead Press (sztanga) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 657 | Overhead Triceps Extension (hantel) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 658 | Pistol Squat | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 659 | Plank | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 660 | Pull Up | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 661 | Push Up | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 662 | Rowing Machine | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 663 | Seated Cable Row | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 664 | Seated Shoulder Press (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 665 | Shrugs (hantle) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 666 | Shrugs (sztanga) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 667 | Skullcrusher (EZ) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 668 | Standing Calf Raise | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 669 | Step Up | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 670 | T-Bar Row | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 671 | Triceps Dips (ławka) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 672 | Triceps Pushdown | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 673 | Walking Lunges | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 674 | Wiosłowanie na linkach (siedząc) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 675 | Wyciskanie nad głowę (linki) | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |
| 676 | Łydki na stopniu | v1 | main | — | — | tak | ślad nie jest rysowany (v1) | — | — | nie dotyczy |