# Ponowna recenzja ruchu (bramka 4) — backlog-figur @ be89aae2, runda 2 (28.10.2026)

Recenzent niezależny. Nie czytałem opisów poprawek, commitów gałęzi, komentarzy generatorów ani linii stanu. Dane póz: `lib/figures/v2/poses/*.json` z odłączonego worktree `/home/user/wt/rec-bf2` @ be89aae2. Bazy porównawcze: r1 = a40f7cac (stan z recenzji „DO POPRAWY”), integracja = origin/integracja-1-1, mobilność zatwierdzona r6 = ff7332e7.
Pliki pomocnicze (zoomy, arkusze klatek, narzędzia): `/tmp/claude-0/rec-bf2/out/` i `/tmp/claude-0/rec-bf2/tools/` (lokalnie, poza repo); „out/…” w tabeli odnosi się do tego katalogu.
**Render własny: 21 klatek (u = 0…1 co 0,05) × wszystkie widoki × poza poprawna i rzędy błędów = 924 komórki dla 14 ćwiczeń** (Clamshell, Fire Hydrant 2 widoki × 2 rzędy; ER hantel 2 × 1; Superman 1 × 2; Lower Back Curl 1 × 1; Seal Row 2 × 1; Side-Lying Quad 1 × 1; 7 wiosłowań 2 × 2). Ślad toru: 41 próbek u na ćwiczenie, nałożony na półprzezroczyste klatki u = 0 i u = 1.
Podglądy `podglady-1-1/backlog-figur-r2/*`: wszystkie 6 mają PODGLAD-WAZNY (commit 762651a7, drzewo czyste; od 762651a7 do be89aae2 zmienił się tylko docs/19). Klatki w `poze.json` podglądu = klatki danych gałęzi dla wszystkich ocenianych ćwiczeń.
Walidator (`waliduj`) na danych gałęzi i na pozach z podglądu: 7/7 ocenianych ćwiczeń ok:true. Testy celowane: figury-backlog-r2 i figury-backlog-bramka — 58/58 zaliczonych (`--maxWorkers=1`).
Kontekst wagi: rodziny glute_floor, rotator_cuff, core_floor, back_extension, row i mobility_floor mają status „planned” (`poseData.ts` ładuje tylko pull_up). Figury nie są dziś widoczne w aplikacji, a werdykt dotyczy bramki 4 przed włączeniem rodziny.

## Podsumowanie
| Wynik | Liczba | Ćwiczenia |
|---|---|---|
| OK | 12 | External Rotation (hantel), Superman, Lower Back Curl, Seal Row (sztanga), 7 wiosłowań w opadzie, Fire Hydrant |
| OK z uwagą | 2 | Clamshell (U1: kandydat rzędu błędu), Side-Lying Quad Stretch (U3: przybliżenie „biodro ≈ 13°”, bez zmian od r6) |
| BŁĄD | 0 | — |

Ślad: 14/14 bez BŁĘDU. Żaden tor dłoni, sprzętu, stopy ani kolana nie ma zmiany kierunku (0 we wszystkich osiach) i nie przenika podłoża. Jedyne zawrócenia to łokcie w wiosłowaniach (1 w osi x lub z). Łokieć nie jest kończyną dystalną ani sprzętem, a łuk łokcia wokół barku jest zgodny z ruchem.
Znaleziska r1: F1, F2, F5 (w manifeście) i F6 usunięte. F3: w danych gałęzi nie ma rzędu błędu (świadomie), a kandydat w generatorze pokazuje błąd częściowo — U1. F4: przybliżenie jawnie opisane, a liczby się zgadzają.
**Werdykt: ZATWIERDZONE** — backlog-figur może iść do integracja-1-1. Uwagi U1–U4 → backlog (NISKIE).

## Tabela
| Ćwiczenie | Ruch | Treść | Ślad | Werdykt | Szczegóły |
|---|---|---|---|---|---|
| Clamshell | OK | OK | OK: kolano R zakres 21,7 cm (droga 22,2), stopa R 4,8 cm, palce R 10,5 cm; 0 zmian kierunku; min y kształtu −1,9 (dolny bark, jak r6) | OK z uwagą | **F1 usunięte:** górna stopa leży na dolnej, podeszwy poziomo. u = 0: pięta R (55,5; 10,2; 7,4), palce (68,0; 10,2; −14,3); dolna: pięta (55,5; 0,2; 3,0), palce (68,0; 0,2; −18,7). Oś stopy 3,9° od płaszczyzny nogi (r1: stopa skręcona ~90°, w sufit). Przy otwieraniu stopa obraca się z goleniem (podbicie 0→30), palce unoszą się o 10,4 cm, a pięty zostają razem (zoom: out/cl-feet.png). Kolano 88,4°, biodro 47,9→34,4°, kolano górne +19,5 cm, tułów i miednica nieruchome. **F3:** dane gałęzi nie mają rzędu błędu (`bledy: []` także w integracji). Karta pokaże wskazówkę hab.mis.high bez animacji ✕ (figure.ts:64). Kandydat w generatorze/podglądzie: U1 |
| External Rotation (hantel) | OK | OK | OK: hantel/dłoń R zakres 40,7 cm (y 26,2, z 31,1), 0 zmian; łokieć R zakres 0,7 cm | OK | **F1 usunięte:** stopy ułożone jak w Clamshell u = 0, stopa górna 3,9° od płaszczyzny nogi. Łokieć przy boku (z 5,4 = bark 5,4), zgięty 101–102°, przedramię z poziomu (chwyt y 40,4, z −26,9) do pionu (y 66,6, z 4,2). shRot 53,8→73,3. **F6 usunięte:** wpis przybliżenia jest. Rząd błędu rot.mis.elbowAway: brak w danych i w podglądzie (bez zmian) |
| Superman | OK | OK | OK: dłonie 17,4 cm, kolana 5,2, pięty 10,0, palce 12,5; 0 zmian; ręce i nogi unoszą się razem | OK | **F2 usunięte:** stopa w zgięciu podeszwowym (kostka −50°), palce od głowy (palce x −102,3 vs pięta −80,6), grzbietem w dół, pięta nad kostką (zoom: out/sup-feet.png). Stopy i golenie uniesione już w u = 0 (kostka y 16) — tak samo w integracji (zatwierdzone n6), nie regresja. Rząd cobra.mis tylko w podglądzie (nie w danych) |
| Lower Back Curl | OK | OK | OK: tylko łokcie 3,3 cm, dłonie 0,4 cm; 0 zmian | OK | **F2 usunięte:** palce od głowy (x −102,4 vs pięta −82,2), kostka −50°, czubek buta ok. 0,5 cm nad podłogą, goleń leży (zoom: out/lbc-feet.png). Dawny „but 3,5 cm nad podłogą” już nie występuje. **F6 usunięte:** wpis przybliżenia jest. Drobna niezgodność wpisu: „bez kontaktu palców z podłogą”, a czubek jest ok. 0,5 cm nad nią, czyli praktycznie styka (tekst wewnętrzny) |
| Seal Row (sztanga) | OK | OK | OK: gryf/dłonie zakres 46,1 cm (x 24, y 39,4), droga 46,1 = prosta, 0 zmian; min y gryfu 26,1; łokcie 1 zawrócenie x/z (łuk wokół barku) | OK | **F2 usunięte:** stopy za końcem ławki, grzbietem w dół, palce do tyłu (kostka −56°, palce x −116,6 vs pięta −97,4; zoom: out/seal-feet.png). Czubki wystają poza krawędź ławki. Reszta bez zmian od r1 |
| Bent Over Row (sztanga) | OK | OK | OK: gryf 42,9 cm (x 23,7, y 35,7), prosta, 0 zmian; gryf startuje nad środkiem stopy (x ≈ 9) | OK | Dane bez zmian od r1. **F4:** kolano 25,7°, goleń −17,9° od pionu, kostka −18,6°, kolano 6,6 cm za piętą — zgodne z wpisem przybliżenia (14–18°, 4–7 cm, ≈ 14–19°), który nazywa też, że środka ciężkości nie zmierzono. Cecha zachowana (tułów w opadzie, gryf do brzucha) |
| Bent Over Row (hantle) | OK | OK | OK: hantle 42,5 cm, 0 zmian | OK | jak wyżej (te same liczby nóg) |
| Reverse Grip Bent Over Row | OK | OK | OK: gryf 42,0 cm, 0 zmian | OK | jak wyżej |
| Barbell Rear Delt Row | OK | OK | OK: gryf 39,9 cm, 0 zmian; łokcie szeroko (z 17,8) | OK | jak wyżej |
| Pendlay Row | OK | OK | OK: gryf 52,0 cm (start y 23,2), 0 zmian | OK | kolano 25,9°, goleń −15,9°, kolano 5,3 cm za piętą — w przedziałach wpisu |
| Bent Over Row (linki) | OK | OK | OK: dłonie 42,5 cm, 0 zmian | OK | jak Bent Over Row |
| T-Bar Row | OK | OK | OK: uchwyt 43,5 cm (droga 43,8 — łuk dźwigni), 0 zmian | OK | jak Bent Over Row; dźwignia bez zmian |
| Fire Hydrant (zmiana poza zleceniem) | OK | OK | OK: kolano R 38,8 cm (z 34,4), pięta R 30,8, palce R 53,3; 0 zmian; min y palców 1,9 | OK | **Bez regresji, poprawa.** u = 0 identyczne z integracją. W integracji stopa przy unoszeniu wisiała pionowo pod kolanem (oś stopy 29° od płaszczyzny nogi w u = 0,5 i 55° w u = 1), czyli była skręcona względem goleni. Teraz obraca się z nogą (2° w całym ruchu). Z przodu w u = 1 stopa schowana za udem, z boku skośnie w dół i do tyłu (out/fh-cmp.png, out/fh-side-cmp.png). Tułów nieruchomy (bd.level) |
| Side-Lying Quad Stretch (zmiana poza zleceniem) | OK | OK | OK: poza statyczna — brak ruchu kończyn (wszystkie zakresy < 0,3 cm), min y −1,9 (dolny bark, jak r6) | OK z uwagą | **Bez regresji względem r6 (ff7332e7).** Zmieniła się tylko stopa górna: kostka 13→−1°, oś stopy 36→8° od płaszczyzny nogi; pięta (9,9; 35,0) vs (11,3; 35,0). Chwyt dłoni R = kostka R (10,6; 44,2; 22,4) bez zmian. Wizualnie prawie identycznie (out/slq-cmp.png). Uwaga U3 (wewnętrzna, z r6): wpis „biodro ≈ 13°” przy biodrze 8–11° |

## Uwagi (pewność > 80%, żadna nie blokuje)
| # | Waga | Pewność | Realność | Opis i dowód |
|---|---|---|---|---|
| U1 | NISKIE | 90% | brzegowy: dotyczy dopiero dodania rzędu do danych | Kandydat rzędu błędu Clamshell hab.mis.high („Noga za wysoko — biodro zaczyna się przechylać”), istniejący tylko w generatorze i podglądzie. Noga wyżej jest już widoczna: kolano y 50,7 vs 42,9 w u = 1, udo prawie pionowo z przodu. Tułów skręca się o 25° (twist). Miednica się nie rusza: `pelvisRight` (0; 1; 0,3) i tilt 0 w obu rzędach, a znacznik i tekst mówią „biodro/pelvis”. Na rysunku przechyla się więc obręcz barkowa, nie biodro. Przy dodawaniu rzędu do danych lepiej odchylić miednicę (przechylMiednicy/obrót miednicy). Dowód: tools/err.mjs, out/Clamshell-klatki.png (rząd 2) |
| U2 | NISKIE | 95% | teoretyczny (proces; wada sprzed tej gałęzi) | Podgląd ≠ dane dla 3 póz spoza zakresu: Reverse Flyes With External Rotation, Lying T-Bar Row, Chest Supported Row. W podglądzie (i w generatorze, także na integracji) siedzisko ławki 2 i kostki x 78,2 z biegunem kolana −1. W danych (= integracja) siedzisko 20, kostki x 61,1, biegun +1. Znacznik PODGLAD-WAZNY tego nie wykrywa. Ponowne `--zastosuj` tych rodzin zmieni 3 pozy bez recenzji |
| U3 | NISKIE | 85% | teoretyczny (tekst wewnętrzny) | Side-Lying Quad: przybliżenie „biodro ≈ 13°”, a tabela daje 8–11° (było już w r6) |
| U4 | NISKIE | 85% | teoretyczny (tekst wewnętrzny) | Lower Back Curl: przybliżenie „bez kontaktu palców z podłogą”, a czubek buta jest ok. 0,5 cm nad podłogą (praktycznie styk) |

## Szczelność reguł
Bez BŁĘDÓW do rozliczenia. Nowa reguła osi stopy (w płaszczyźnie nogi) przechodzi na wszystkich 7 pozach w zakresie z wartościami 1–8°. Sama złapała dawną wadę Fire Hydrant (29–55° w integracji), więc działa także poza zakresem, dla którego ją stroiłem.
Propozycja dla U1: reguła „znacznik błędu wskazuje część, która się zmienia” — przy `znacznik: pelvis` miednica musi się zmienić o ≥ X° między rzędem błędu a pozą poprawną w klatce u = 1.
Propozycja dla U2: znacznik ważności porównuje `poze.json` podglądu z `lib/figures/v2/poses/<rodzina>.json` (klatki i sprzęt) albo nazywa rozbieżności.

## Lista kontrolna (kroki 1–11)
1. Przybliżenia: wpisy Clamshell, ER, Superman, LBC, Seal Row i 7 wiosłowań są, cecha rozpoznawcza zachowana.
2. Styk zmierzony we wszystkich 21 klatkach: min y kształtów, stopy i podłoga/ławka (zoomy z siatką 5 cm).
3. Rzędy błędów: U1. W danych gałęzi rzędy są tylko w row (mis.roundBack, bez zmian).
4. Reguły (waliduj) na wszystkich ocenianych pozach: ok. Testy backlogu 58/58.
5. Kąty liczone własnym narzędziem (`jointAngles`, R/L osobno) — zgodne z wpisami.
6. Znacznik: 6/6 ważne, commit 762651a7 (kod = be89aae2).
8. Zasięg podpór: Seal Row — tułów na ławce, stopy poza krawędzią, świadomie.
9. Sprzęt: bez zmian.
11. Ślad: arkusze w `backlog-figur-r2-slad/` (14 PNG). Uwaga techniczna: w widoku z góry (top) pozioma kreska to linia podłogi narzędzia, nie element sceny.
