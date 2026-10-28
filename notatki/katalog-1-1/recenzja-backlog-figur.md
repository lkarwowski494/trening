# Recenzja ruchu (bramka 4) — backlog-figur @ a40f7cac, 28.10.2026

Podglądy własne: /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/bf-rec (6 rodzin, wszystkie PODGLAD-WAZNY, znacznik zgodny, commit a40f7cac, drzewo czyste).
Baza: /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/bf-base (origin/integracja-1-1 @ 6bee23f7; worktree usunięty).
Pomiary: skrypty w /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/tools (szkielet 3D z keyframeFrame, ramki kształtów z SVG).
Kontekst wagi: rodziny glute_floor, rotator_cuff, back_extension, core_floor, row, mobility_floor mają status „planned” (lib/figures/v2/families.ts:33,44,50,51,59,62; figure.ts:33 zwraca null) — figury v2 tych rodzin NIE są dziś widoczne w aplikacji. Niżej: werdykt bramki 4 (blokuje przełączenie rodziny na „ready”), nie bloker wydania.

## Werdykty
| Poza | Werdykt | Powód |
|---|---|---|
| Clamshell | DO POPRAWY | górna stopa skierowana w sufit (F1); reszta OK: leży, głowa na dłoni, kolano 88–90°, biodro 34–48°, kolano górne unosi się o 19,5 cm, stopy przy sobie w kostkach |
| External Rotation (hantel) | DO POPRAWY (tylko F1) | ręka robocza R = górna, hantel w R (trzyma 'R'), łokieć przy boku (−19; 33,6), łokieć 90° stały, przedramię z poziomu do pionu; F1 jak wyżej |
| Lower Back Curl | DO POPRAWY | stopa jako pełny but skierowany ku głowie (F2), bez wpisu przybliżenia (F6) |
| Superman | DO POPRAWY | F2 |
| Seal Row (sztanga) | DO POPRAWY | F2; reszta bez zmian |
| 7 póz wiosłowania w opadzie | ZATWIERDZONE z uwagą F4 | tułów, miednica, barki i tor chwytu bajtowo te same; kolano 25,7° (Pendlay 25,9°) |
| Butterfly Stretch | ZATWIERDZONA | z boku bez zmian (ramki butów identyczne); kostki ±5,1, pięty 5,2 cm od siebie — nadal siad motyla w ramach dotychczasowego przybliżenia |
| Pozostałe pozy 6 rodzin | brak regresji | poze.json identyczne z bazą; PNG różnią się tylko szerokością tła (wspólna część piksel w piksel taka sama) |
| v1 row (data.json) | BEZ ZMIANY RYSUNKU, poprawny | zmienione tylko why[].tol 15→10 (Bent Over Row sztanga/hantle, T-Bar Row; Pendlay dziedziczy przez „like”); p.knee=20 bez zmian; `why` czyta tylko evalCheck w tests/figures.test.tsx i gen.mjs, ExerciseFigure.tsx nie |
| lezyBokNogaCm 3→4 + profil | OK, nie przepuszcza nogi uniesionej | wartości reguły: Clamshell/ER udo 3,7, goleń 3,0; SLQ udo 3,4, goleń 3,0. Kostka dolnej nogi +2 cm → goleń 5,0 (łapie), +4 → udo 4,1 i goleń 6,4. Przechodzi tylko +1 cm. Zapas Clamshell: 0,3 cm |

## Znaleziska
| # | Waga | Pewność | Realność | Opis i dowód |
|---|---|---|---|---|
| F1 | ŚREDNIE | 95% | realny po włączeniu rodziny (dziś niewidoczne) | Clamshell i External Rotation (hantel): górna stopa R w każdej klatce w sufit. u=0: pięta (64,6; 10,4; 3,3), palce (67,7; 35,2; 3,8); oś stopy 3,6° od normalnej płaszczyzny uda i goleni, czyli stopa skręcona o ok. 90° względem kolana. Dolna stopa leży w tej płaszczyźnie (87,7°), więc palce stóp są 22 cm od siebie. SVG z boku: but górny x 52,4…68,0, y 9,2…38,4 (pionowy), dolny y −0,3…13,1. Przyczyna: mob.mjs:86 `bokNogiUlozone` — górna noga `pod: null, rot: 10` (domyślne dla stania), dolna `rot: 60`. W bazie obie stopy były pionowo. Kroki: rodzina glute_floor/rotator_cuff → ready → karta ćwiczenia Clamshell. |
| F2 | ŚREDNIE | 90% | realny po włączeniu rodziny | Superman, Lower Back Curl, Seal Row: przy `rot: 70` but rysuje się w pełnej długości (ok. 29 cm; SVG LBC x −90,2…−61,0) podeszwą w dół, palcami ku głowie (palce x −75,8 vs pięta −84,4), pod goleniami. Wygląda jak stopa zgięta wzdłuż goleni, a w leżeniu przodem palce idą w drugą stronę. Uzasadnienie w przybliżeniu („model stopy nie ma palców do tyłu”; core_floor.mjs ROT_STOPA_LEZY, row.mjs PRZYBLIZENIA) jest nieaktualne: silnik od b07c7ed7 (27.10) ma `podbicie` 91–270°, użyte w Child's Pose (208°). Sprawdzone `waliduj`: Superman podbicie 200 / rot 0 → ok:true (palce do tyłu na wysokości kostki); Lower Back Curl 210–215 → ok:true; Seal Row 220–230 → ok:true (195–205 przekracza zakres kostki −60°). Reguł jakości R9/R10 dla tych wariantów nie uruchamiałem. Dodatkowo LBC: dół buta 3,5 cm nad podłogą, choć goleń leży. |
| F3 | ŚREDNIE | 90% | realny po włączeniu rodziny; istniało przed zmianą | Clamshell, rząd błędu hab.mis.high („Noga za wysoko — biodro zaczyna się przechylać”): różni się od pozy poprawnej tylko skrętem tułowia (skretTulowia do 25°). pelvisRight u=1 identyczny w obu rzędach [0; 1; 0,3], kolano górne identyczne (33,8; 42,9; −18). Rysunek nie pokazuje ani nogi wyżej, ani przechyłu miednicy, mimo znacznika na „pelvis”; z boku bark przesuwa się tylko o 3,8 cm w pionie. Zmiana znaku −25→+25 dobrze daje toczenie się do tyłu, ale samą wadę ma też baza. |
| F4 | NISKIE | 85% | realny po włączeniu rodziny | 7 póz wiosłowania: kolano zmniejszone przesunięciem stóp do przodu (3,4 cm; Pendlay 5,1 cm, nie „1–3 cm”), bez zmiany miednicy. Goleń odchylona do tyłu: −17,9° od pionu (było −11,2°), Pendlay −15,9° (było −6,6°). Kostka w zgięciu podeszwowym −18,6° przy płaskiej stopie, kolano 6,6 cm za piętą (było 2 cm). Plus: gryf na starcie nad środkiem stopy (x 9,0 vs 9,8; było 9 vs 6,4). Mój szacunek środka ciężkości ciało+60 kg wypada przy pięcie (−3,1 vs pięta −2,5), ale to zgrubny model — nie zgłaszam przewracania. Tor ciężaru i tułów bez zmian. |
| F5 | NISKIE | 90% | teoretyczny (dokumentacja) | mob.mjs:72 (BOK.ROLL): „w widoku z boku, jedynym w aplikacji, odchylenia nie widać” — nieprawda dla rodzin, które teraz używają BOK: glute_floor ma widoki ['side','front'], rotator_cuff ['front','side'] (families.ts:50,59). Odchylenie tułowia o 15° jest w widoku z przodu. |
| F6 | NISKIE | 90% | teoretyczny (spójność przybliżeń) | External Rotation (hantel) używa tego samego odstępstwa (ROLL −75°, leżenie na lewym boku) co Clamshell, ale nie ma wpisu przybliżenia (manifest: przyblizenie=None). Lower Back Curl ma tę samą rotację stopy 70° co Superman i Seal Row, a też nie ma wpisu. |

## Lista kontrolna (kroki 1–10)
1. Przybliżenia: cecha rozpoznawcza zachowana we wszystkich ocenianych pozach (Clamshell: otwieranie kolana widać w widoku z przodu). Uzasadnienia — F2 (nieaktualne), F6 (brak wpisów).
2. Styk/leżenie mierzone z SVG i szkieletu: tułów i dolna noga Clamshell/ER leżą (reguła 3,0–3,7 cm), głowa podparta; R10 nie zgłasza, żadna część ciała nie znika. But LBC 3,5 cm nad podłogą (F2).
3. Rząd błędu: F3.
4. Reguły na wszystkich pozach: `jakosc-raport.mjs` — 536 póz (449 z danych, 87 z rigów), 1 naruszenie (Wall Sit, klatki_rozne, poza zakresem zmiany). `waliduj` na 449 pozach danych → 0 niezaliczonych.
5. Tabela kątów zgodna z opisem: Clamshell kolano 88–90°, biodro 34–48°; wiosłowanie kolano 25,7°. Uwaga: tabela łączy obie strony, więc kostka 1…15,8° miesza stopę górną i dolną i nie pokazuje F1.
6. Znacznik: wszystkie 6 katalogów PODGLAD-WAZNY, `podglad-znacznik.mjs` potwierdza zgodność.
7. Fałszywe alarmy: brak trafień poza Wall Sit.
8. Zasięg podpór: Seal Row — nie zmieniane poza stopą.
9. Sprzęt: T-Bar — dźwignia i chwyt bez zmian, stopy przesunięte o 3,4 cm, bez przenikania (waliduj ok).
10. Pary o identycznej tabeli: Clamshell i External Rotation (hantel) mają różne tabele, bez konfliktu.

## Luki w liście i procesie
- L1: Podgląd autora (backlog-figur-podglad) zbudowany na 57a909ca z „drzewo: zmienione” i tylko dla zmienionych póz. Nie ma mobility_floor (Butterfly zmieniony później, w d02b7920) ani póz niezmienionych, więc nie dało się z niego sprawdzić regresji. Pozy row/glute/rotator/core/back z podglądu autora = moje, bajt w bajt. Propozycja: znacznik ma odrzucać podgląd, który nie obejmuje całej rodziny albo jest starszy niż ostatni commit zmieniający rodzinę.
- L2: Żadna bramka nie łapie orientacji stopy względem kolana (F1, F2: waliduj i R9/R10 przechodzą). Propozycja reguły: oś stopy w płaszczyźnie biodro–kolano–kostka ±30°, z wyjątkiem świadomej rotacji z wpisem przybliżenia.
- L3: Krok 5 (tabela kątów łączy strony) ukrywa asymetrię stron w pozach jednostronnych/na boku. Propozycja: osobne kolumny R/L.
- L4: Przybliżenia powołujące się na ograniczenie silnika nie są sprawdzane po zmianie silnika (F2). Propozycja: przy zmianie kontraktu przejrzeć PRZYBLIZENIA ze zdaniem „model nie ma…”.
