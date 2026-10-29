# Recenzja niezależna — Pendlay Row (1.0.1, bramka 4, L-047, L-050)

Recenzent: audytor (sesja 1.0.1, niezależny; nie jest autorem). Autor: programista r2/pendlay.
Przedmiot: worktree /home/user/trening/.claude/worktrees/agent-a9a2d699e885e3f6b, gałąź r2/pendlay, HEAD b5e7265, zmiany `git diff fec3d5f b5e7265`.
Data: 29.10.2026. Nic nie poprawiano ani nie commitowano.

## Werdykty
- FIGURA v1: ZATWIERDZONE (wyswietlana). Skrót v1: 74a518fe67a5.
- KARTA: DO POPRAWY (drobna, tylko EN `pendlay.floor`, próg podobieństwa z docs/09 sekcja G). Poprawka nie zmienia skrótu karty
  (kartaSkrot liczy tylko z PL): 8ed7ee45c7ed. Po przeredagowaniu EN wpis „karty” niżej można wpisać bez kolejnej recenzji
  (zasada 2: naprawę potwierdza pomiar i test, nie następny audyt).
- Czy karta jest nie gorsza od 1.0: TAK, jest lepsza, nawet bez tej poprawki. W 1.0 (origin/wersja-1-0-1-r2:lib/cues/data.json)
  Pendlay Row ma kartę taką samą jak Bent Over Row (row.hinge, row.bbGrip, row.bbPull, hinge.back, row.fullStretch, mis.roundBack),
  bez cech Pendlaya. W `row.bbPull` jest „opuść do pełnego wyprostu rąk” zamiast odłożenia na podłogę. Nowa karta zachowuje row.bbGrip, hinge.back i mis.roundBack,
  dodaje start z podłogi, tułów prawie równolegle, dynamiczne przyciągnięcie z odłożeniem i błąd unoszenia tułowia. Ta sama fraza „dead stop on the floor”
  nie jest gorsza od 1.0 merytorycznie; narusza tylko regułę redakcyjną.

## Znaleziska

| # | Poziom | Pewność | Obszar | Opis | Kroki w aplikacji | Realność | Dowód |
|---|---|---|---|---|---|---|---|
| 1 | NISKIE (reguła docs/09 G; nie bloker) | 95% | prawa autorskie / podobieństwo do źródeł | EN `pendlay.floor` „Start every rep with the bar at a dead stop on the floor.” ma ze źródłem BarBend wspólny ciąg 6 słów „a dead stop on the floor”, czyli 2 wspólne 5-gramy. To próg „≥ 2 wspólne 5-gramy → do przeredagowania” (docs/09-plan-testow.md:114). Fraza jest potocznym zwrotem, więc realnego ryzyka praw autorskich nie ma, ale reguła jest jawna. | Język angielski → ćwiczenie Pendlay Row → Technika → Wskazówki. | realny (tekst widoczny po odkryciu karty), skutki znikome | Pomiar: scratchpad/ngram_pend.py na tekstach stron pobranych 29.10 (scratchpad/recpend/bb.txt): `bb max 6 'a dead stop on the floor' 5g 2`; pozostałe zdania karty ≤ 5 słów i ≤ 1 5-gram. Propozycja: „Begin each rep with the bar resting motionless on the floor.” (zmierzono: maks. ciąg 3 słowa, 0 wspólnych 5-gramów ze wszystkimi trzema źródłami). Uwaga: tests/figury-pendlay.test.ts wymaga `en['pendlay.floor']` z /dead stop/ — test trzeba zmienić razem z tekstem; inne języki bez zmian (sens ten sam). |

Brak znalezisk KRYTYCZNYCH, WYSOKICH i ŚREDNICH.

## Uwagi (nie są znaleziskami: poniżej progu pewności albo konwencja rodziny, już wyświetlana w 1.0)
- Podudzie odchylone do tyłu o ok. 14° (kolano za kostką: kolano x −17,1, kostka x −11,0). Środek masy ciała policzony z przybliżonych mas segmentów wypada ok. 2–3 j. za piętą.
  Tak samo jest w Bent Over Row (kolano −17,5, kostka −11,0; ta sama konwencja rodziny row, wyświetlana w 1.0). Na rysunku tego prawie nie widać.
  Pomysł do backlogu rodziny row (bez wersji): podudzie bliżej pionu przy większym ugięciu kolan. Bez wpływu na tę recenzję.
- Gryf przy wznoszeniu przesuwa się tuż przed linią goleni (0,65–2,6 j. przed osią podudzia, nigdy za nią) — wygląda jak sztanga prowadzona przy goleniach.
  Jest to dopuszczalne: położenie sztangi względem stóp i goleni jest w raporcie badacza otwarte, figura nie twierdzi nic więcej.
- Talerz nachodzi na tułów w pozycji końcowej. W widoku z boku talerz jest z boku ciała, więc to nie jest przenikanie (jak w Bent Over Row).
  Gryf, czyli środek talerza, leży 8 j. przed linią pleców (kreska tułowia ma 6 j. szerokości), więc nie wchodzi w tułów. W Bent Over Row ta odległość wynosi 7,1 j.
- PL `pendlay.pull` mówi „do dolnej części klatki albo brzucha” (EN: „upper stomach”). Wersja PL jest trochę szersza, ale zgodna z Coach („towards your stomach”). Bez poprawki.
- Po zmianie werdyktów na „wyswietlana” programista musi odświeżyć pliki runtime (lib/figures/data.json, lib/cues/data.json: Pendlay Row poza `open`/`hidden`) i zmienić strażniki,
  które dziś wymagają ukrycia: tests/figures.test.tsx:206 (`figureByKey('Pendlay Row')` null), tests/figury-pendlay.test.ts (wpis v1 „ukryta”, `FIG_DATA.open` zawiera Pendlay Row),
  tests/figury-recenzja.test.tsx (gałąź `hidden`).

## Sprawdzone obszary bez znalezisk

### Figura (pomiar modułem lib/figures/geom.ts z worktree, 4 klatki + 19 póz pośrednich na każde przejście; skrypt scratchpad/recpend/meas.ts, meas2.ts)
- Zakres stawów (rom z lib/figures/data.json: hip [−17,133], knee [0,141], ankle [−60,37], sh [−53,171], el [0,149]): biodro 126,1 (stałe), kolano 30 (stałe), kostka −14,1, bark od −41,6 do 71,4, łokieć od 0 do 135,8. 0 przekroczeń.
- Styk talerza z podłogą w pozycji start: dolna krawędź talerza 0,02 j. (sprawdzenie `low` hand y=13 ±0,5); w całej animacji minimum 0,02, talerz nie wchodzi w podłogę; figura min. y = 0.
- Ślizg stóp: 0,000 j. we wszystkich pozach (próg 2 j.).
- Tułów: 8,0° nad poziomem we wszystkich pozach, bez zmiany (nie unosi się). To nazwane uproszczenie: źródła mówią „równolegle”, „roughly parallel”, Coach 20–30°.
- Tor gryfu: rozrzut poziomy 4,1 j. przy drodze 27,8 j. w pionie (prawie pionowy). Koniec: gryf w 60% długości tułowia od biodra (dolna część klatki / górna część brzucha) i 8 j. przed linią pleców.
- Pętla ping-pong wraca do pozycji start (sztanga na podłodze, przerwa przy klatce = martwy punkt).
- Cecha rozpoznawcza wobec Bent Over Row (arkusz podglądu + liczby): tułów 8° wobec 30°; sztanga na podłodze (talerz 0,02 j.) wobec zawieszonej (dolna krawędź talerza 12,6 j. nad podłogą); 4 pozycje wobec 2. Różnica jest wyraźna.
- Sprawdzenia `why` w każdej klatce odwołują się do zdań karty tego ćwiczenia. Testy: figury-pendlay, figures, figury-recenzja, l047, zrodla-wiedzy — 112/112 zielone.

### Karta
- Cytaty z data/zrodla/cues.json porównane dosłownie z tekstem stron pobranych 29.10.2026 (curl, HTTP 200; pliki scratchpad/recpend/*.html):
  - BarBend: „With the barbell on the floor…”, „…explosively pull the barbell to the base of your chest.”, „…each rep is done from a dead stop on the floor…”, „…set up with your back roughly parallel to the floor.”, sekcja „Back Angle” (unoszenie barków względem bioder) — zgodne.
  - Breaking Muscle: „With a slight bend in your knees… parallel to the ground.”, „…touch your lower chest or upper abdomen before you allow it to return quickly to the ground.”, „Let the bar come to a complete rest on the ground before beginning the next rep.”, „Be conscious of maintaining a strict parallel position.” — zgodne.
  - Coach: „Your back should be at a 20-30° angle to the floor.”, „…hinged at the hips with your knees slightly bent and a neutral spine…”, „…explosively pull the bar towards your stomach…” — zgodne.
- Treść: każde zdanie pendlay.* ma ≥ 2 źródła szczebla 4 z różnych organizacji. W zdaniach nie ma liczb ani nazw źródeł (pl, en, de, es, fr, ja przejrzane; test sprawdza wszystkie języki).
  Kąt tułowia: wspólna część opisów to „prawie równolegle” (różnica z Coach zapisana w rejestrze).
- Podobieństwo pozostałych zdań (EN, pomiar jak w docs/09 G): pendlay.setup maks. 5 słów / 1 5-gram, pendlay.pull 5 / 1, pendlay.mis.torso 2 / 0, row.bbGrip, hinge.back, mis.roundBack ≤ 3 / 0.
- Przekłady (de, es, fr, ja): sens zgodny z PL/EN, terminy naturalne, bez liczb.
- Dane i prywatność: zmiana obejmuje tylko dane treści (bez schematu, migracji, importu i kopii); w tekstach brak sekretów i danych osobowych. Dostępność: tekst karty bez zmian w komponentach.

## Gotowe wpisy do docs/research/figury-recenzja.json

### v1 → "Pendlay Row" (zastępuje obecny wpis „ukryta”)
```json
"Pendlay Row": {
 "rodzina": "row",
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "stan": "zrecenzowana niezależnie (bramka 4, 1.0.1: nowa figura v1 — 4 pozycje, tułów prawie poziomo i nieruchomy, start ze sztangą na podłodze)",
 "autor": "programista r2/pendlay",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "kto": "audytor — recenzja niezależna bramki 4 (L-047, L-050), 29.10.2026; poprzednia recenzja „ukryta”: 06-tresci, 27.10.2026",
 "sha": "74a518fe67a5",
 "slad": "arkusz PNG klatek kluczowych (start, mid, mid2, end), póz pośrednich 0,25/0,5/0,75 każdego przejścia i nałożonego śladu toru punktów (L-050) obok Bent Over Row; pomiar modułem geometrii aplikacji na 4 klatkach i 19 pozach pośrednich każdego przejścia: zakres stawów wobec rom (0 przekroczeń), dolna krawędź talerza na starcie 0,02 j., talerz nigdy pod podłogą, ślizg stóp 0 j., tułów stale 8°, tor gryfu 4,1 j. w poziomie na 27,8 j. w pionie, gryf zawsze przed linią goleni, w końcu 8 j. przed linią pleców w 60% długości tułowia",
 "uwagi": "Cecha rozpoznawcza wobec wiosłowania w opadzie: tułów prawie poziomo (8°, uproszczenie ilustracyjne; źródła: „równolegle”/„prawie równolegle”, jedno 20–30°) i sztanga z podłogi w każdym powtórzeniu (pętla wraca do talerza na podłodze). Nachodzenie talerza na tułów w końcu — widok z boku, talerz z boku ciała, gryf poza kreską tułowia (jak w wiosłowaniu w opadzie). Podudzie odchylone do tyłu ok. 14° — konwencja rodziny row (to samo w wiosłowaniu w opadzie), uwaga do backlogu rodziny."
}
```

### karty → "Pendlay Row" (wpisać po przeredagowaniu EN `pendlay.floor`; skrót się nie zmienia, bo liczy się z PL)
```json
"Pendlay Row": {
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "stan": "zrecenzowana niezależnie (bramka 4, treść karty 1.0.1: ustawienie, ruch, wskazówki, błędy wobec źródeł przeczytanych 29.10.2026)",
 "autor": "programista r2/pendlay",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "kto": "audytor — recenzja niezależna treści karty (L-047), 29.10.2026; poprzednia wersja (skrót 60840343dff9): 06-tresci, 28.10.2026",
 "sha": "8ed7ee45c7ed",
 "slad": "cytaty z rejestru data/zrodla/cues.json porównane dosłownie z tekstem stron BarBend, Breaking Muscle i Coach pobranych 29.10.2026; pomiar podobieństwa EN (najdłuższy wspólny ciąg słów i wspólne 5-gramy, docs/09 sekcja G) dla 7 zdań karty; przegląd przekładów pl, en, de, es, fr, ja",
 "uwagi": "Karta lepsza od 1.0 (tam treść wiosłowania w opadzie bez cech Pendlaya). Wszystkie zdania pendlay.* mają ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji; bez liczb i nazw źródeł. Warunek przed wpisem: EN pendlay.floor przeredagowane (było 2 wspólne 5-gramy z BarBend, „a dead stop on the floor”); propozycja „Begin each rep with the bar resting motionless on the floor.” — 0 wspólnych 5-gramów. PL „do dolnej części klatki albo brzucha” nieco szersze niż EN — zgodne ze źródłem (w stronę brzucha)."
}
```
