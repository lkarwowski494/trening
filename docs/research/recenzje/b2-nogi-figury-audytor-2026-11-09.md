# Recenzja niezależna B2 (figury nóg) — origin/figury/b2-nogi @ 01953ee4 vs origin/integracja-1-1

Recenzent: audytor (opus), 09.11.2026, worktree (katalog tymczasowy) (usunięty po recenzji). Autor: sesja B #4, programista. L-047: autor ≠ recenzent.
Wynik: **0 KRYTYCZNE, 0 WYSOKIE, 0 ŚREDNIE**. Każde z 7 ćwiczeń: **ZATWIERDZONE** (ruch i ślad). Merytoryka źródeł (uproszczenie BSS, hk-landow-stepup) — u badacza, nie oceniam.

## Jak powstał ślad toru (L-050)
`arkusz-slad.mjs` nie rysuje rodzin planned. Kopia narzędzia poza repo:
narz/slad-planned.mjs — po `loadV2(tmp)` łata TYLKO przetranspilowane kopie w katalogu tymczasowym:
(1) `figure.js`: usunięty warunek `fam.status !== 'ready'`; (2) `poseData.js`: do `LOAD` dopisane `lunge` i `leg_isolation`, do `DATA_UI` wpisy prezentacji (nazwy faz, staw `knee`) — nie wpływają na geometrię klatek ani `trailFor`; potem czyszczenie `require.cache` i zwykły przebieg arkusza (21 kadrów co 0,05, `trailFor`, linia przerywana). Repo bez zmian (`git status` czysty).
Arkusze (pełna rozdzielczość, 2100 px): b2-arkusze/slad/*.png (13 arkuszy: 7 ćwiczeń × widoki side/front).
Podglądy z `run.mjs --podglad` (z rzędem błędu): .../b2-arkusze/li/leg_isolation/, .../b2-arkusze/lu/lunge/ (manifest, katy-stawow.md, PODGLAD-WAZNY.txt).
Pomiar per klatka (41 próbek u = 0…1, jointAngles + geometria bark–biodro–kolano + checkFrame): .../b2-arkusze/slider-pomiar.txt (tymczasowy test usunięty).

## 1. Slider Hamstring Curl — ZATWIERDZONE
- Karta: setup „Połóż się na plecach, kolana ugięte, pięty na ślizgaczach”; move „Unieś biodra, wysuń nogi do wyprostu, potem przyciągnij pięty — biodra cały czas w górze”; błąd `ballcurl.mis.sag` „Biodra opadające”. Rysunek pokazuje fazę ruchu głównego (start już w moście) — zgodne.
- Liczby (41 próbek, noga R): kolano 100,0° → 11,8° monotonicznie; miednica (staw biodrowy) 32,8 → 14,5 cm monotonicznie; barki 9,5–9,6 cm (na podłodze); kostki 9,6–11,2 cm (pięty przy podłodze, ślizgacz jedzie z piętą).
- Linia bark–biodro–kolano (geometria w płaszczyźnie strzałkowej): odchylenie od prostej **2,5–3,3°**, stały kierunek, brak skoku między klatkami — to most bez załamania w biodrze w całym ruchu. `jointAngles().hip` daje |5,4…8,8°| ze zmiennym znakiem (−8,8…8,3° w katy-stawow.md) — znany brak znaku przy małych kątach (test ACG-019 to opisuje); geometria rozstrzyga, że biodro się nie zgina. Zgodne z opisem autora (5–9°) co do modułu.
- Ciągłość: 9 klatek, przyrosty gładkie (bez przeskoku przy u = 0,125 krokach). checkFrame: **0 problemów w 41/41 próbkach**.
- Wygląd: u = 0 wyraźny most (biodra wysoko, kolana ~100°), u = 1 ciało w linii barki–biodra–pięty, pośladki nad podłogą (kadr w pełnej rozdzielczości, sl0.png/sl8.png). Wygląda jak most z uginaniem nóg.
- Ślad: tor miednicy — pojedynczy gładki łuk z góry w dół i lekko ku stopom (obrót wokół barków), bez zawracania. Wartość „odstęp −11,9 cm” w podpisie jest bez znaczenia (brak ciężaru zewnętrznego) — cecha narzędzia, nie znalezisko.
- Sprzęt bez zmian; rząd `ht.mis.arch` usunięty, `bledy: []`.
- Uwaga (bez poziomu, nie blokuje): przy ewentualnej przyszłej animacji `ballcurl.mis.sag` potrzebna reguła wysokości/kąta bioder mierzona geometrią, nie `jointAngles().hip` (brak znaku).

## 2. Karty z wycofanym błędem z animacji — ZATWIERDZONE (5)
- Porównanie JSON pozy (stary plik z integracja-1-1 vs nowy): Split Squat, Lunges (sztanga), Barbell Walking Lunge, Barbell Step Up — **zmienione wyłącznie pole `bledy`** (`[lunge.mis.kneeIn]` → `[]`); klatki, sprzęt, pętla identyczne. Slider — `klatki` (przebudowa, pkt 1) i `bledy`. Pozostałe ćwiczenia obu rodzin bez zmian.
- Powody w figury-sens `bledy_bez_animacji` — sensowne:
  - `lunge2.mis.lean`: brak reguły kąta tułowia (plecy_proste mierzy zgięcie kręgosłupa) — poza błędu nieodróżnialna regułą. OK.
  - `stepup.mis.push`: rozkład siły między nogami. OK (pozą dałoby się co najwyżej zasugerować, ale nie sprawdzić regułą).
  - `stepup.mis.drop`: cecha tempa. OK.
  - `ballcurl.mis.sag`: reguły ślizgacza nie mierzą wysokości bioder. OK, z dopiskiem o backlogu.
- Ślad: Split Squat — tor miednicy pionowy, krótki (bez ciężaru); Lunges (sztanga), Barbell Walking Lunge — sztanga na plecach, tor pionowy/zgodny z marszem; Barbell Step Up — tor sztangi ukośny w górę i w przód nad stopę na podwyższeniu, gładki. Split Squat: tylna stopa na palcach, tylne kolano przy dole tuż nad podłogą — zgodne z kartą (split.setup, bss.move).

## 3. BSS (sztanga) i Smith Machine BSS — błąd `lunge.mis.kneeIn` — ZATWIERDZONE (ruch)
- Rząd błędu w obu wariantach **identyczny** z BSS (hantle) (porównanie JSON: ta sama delta `odchylenieKolana` R: 0 → −2,7 → −5,5 → −8,2 → −11 przy u 0…1, `dotyczy: kneeLat`); klatki obu wariantów bez zmian w tej gałęzi.
- Widok z przodu (kadry u = 0,75 i 1 w pełnej rozdzielczości: bss-front.png, smith-front.png): przednie kolano wyraźnie schodzi do środka nad stopą; reszta ciała i sztanga bez zmian.
- Smith: sztanga na prowadnicy — ślad pionowy wzdłuż szyny, kolano w błędzie nie przesuwa sztangi. Prowadnica ustala tor sztangi, nie tor kolana, więc koślawienie przedniego kolana jest tak samo możliwe jak z hantlami; ruch nóg wariantów nie różni się. BSS (sztanga): stojak w kadrze, tor sztangi pionowy.
- Oznaczenie „uproszczenie: wariant sprzętu: hantle (błąd z karty BSS (hantle)…)” — uczciwe co do ruchu. Dopisek „do potwierdzenia przez recenzenta niezależnego” w polu `uproszczenie` (data/zrodla/cues.json) można po tej recenzji zastąpić potwierdzeniem (decyzja autora/koordynatora; tekst wewnętrzny, nie UI).

## Proponowane pola do wpisów (figury-recenzja.json, rodziny planned — przy podłączeniu)
- leg_isolation / Slider Hamstring Curl:
  `slad`: "arkusz 21 kadrów (u co 0,05), side, ślad trailFor przez kopię arkusz-slad.mjs z łatą statusu planned w katalogu tymczasowym; tor miednicy jednym gładkim łukiem 32,8 → 14,5 cm, barki 9,5–9,6 cm, pięty 9,6–11,2 cm; 01953ee4"
  `uwagi`: "most w całym ruchu: linia bark–biodro–kolano 2,5–3,3° (geometria), kolano 100 → 11,8°, checkFrame 0/41; jointAngles().hip bez znaku (|5,4–8,8°|); błąd ballcurl.mis.sag bez animacji — powód sensowny; 0 K/W"
- lunge / Split Squat, Lunges (sztanga), Barbell Walking Lunge, Barbell Step Up:
  `slad`: "arkusze side+front 21 kadrów, ślad trailFor (jak wyżej); tor ciężaru/miednicy gładki, klatki identyczne z integracja-1-1 (porównanie JSON)"
  `uwagi`: "wycofany lunge.mis.kneeIn (spoza karty); zmienione tylko pole bledy; powody bledy_bez_animacji (lean/push/drop) sensowne; 0 K/W"
- lunge / BSS (sztanga), Smith Machine BSS:
  `slad`: "arkusze side+front, tor sztangi pionowy (Smith: wzdłuż prowadnicy); klatki bez zmian"
  `uwagi`: "rząd lunge.mis.kneeIn identyczny z BSS (hantle), widoczny w widoku z przodu; ruch nóg nie różni się od wariantu z hantlami (prowadnica nie ustala kolana) — uproszczenie wariant sprzętu uczciwe co do ruchu; merytoryka źródeł u badacza; 0 K/W"

## Sprawdzone bez znalezisk
Zgodność rysunku Slidera z kartą; ciągłość i checkFrame; niezmienność klatek 5 kart; powody bledy_bez_animacji; animacja kneeIn w BSS sztanga/Smith; ślad toru (7 ćwiczeń); testy figures-v2-planned-acg-leg-isolation, zrodla-pelne-cues-b2-nogi, figury-p2-r3 — 669/669 zielone (pod flock). Dane/prywatność/sekrety: zmiana nie dotyka danych użytkownika ani sekretów; karty ukryte (hidden) do recenzji.
