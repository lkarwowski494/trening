# 06-tresci · fix p2 · M1-audytor-generalny-005 (06-tresci-001) — wynik

Data: 2026-10-27 · Rola: 06-tresci (tryb fix) · Decyzja: DEC-01 b + pkt 7a właściciela (wada pewna → poprawka, niepewna → ukrycie).
Kopia robocza: `/home/user/trening/.claude/worktrees/agent-a61045dbe650f8b51`, gałąź `worktree-agent-a61045dbe650f8b51` (baza `naprawy/M2-koordynator-napraw-2026-10-27-p1` = 862f119). Nie wypchnięte, bez scalania.
Commit: **562798d** — „Bramka 4 dla figur v1: recenzja 56 animacji (21 poprawionych, 2 ukryte) i strażnik …” [M1-audytor-generalny-005; 06-tresci-001].

## ETAP 0 — środowisko
Linux bez Xcode/symulatora, Node 22.22.0, git (worktree), sieć przez proxy: nasm.org 200, acefitness.org 403, exrx.net 403, web.archive.org — zerwane połączenie. Brak przeglądarki do zrzutów aplikacji; podglądy figur rysowane z tej samej geometrii (`lib/figures/geom.ts`) skryptem poza repo (`narzedzia/render-v1.mjs` + `narzedzia/rysuj.py`, PIL). Repo publiczne (CLAUDE.md, ADR-031). Brak narzędzia subagentów w tej sesji — recenzję wykonałam sama jako agent spoza autorów figur v1.

## Co zrobiono
1. **Recenzja bramki 4 wszystkich 56 figur v1** wyświetlanych w 1.0 (lista: `dowody/lista-v1.txt`): dla każdej arkusz pozycji kluczowych i póz pośrednich animacji (`dowody/podglady-przed/*.png`), tory punktów (`dowody/tory-przed.txt`), detektor ślizgu podpór i przenikania przyrządów (`dowody/poslizg-przed.txt`), karta: wskazówki z odwołaniami do źródeł, notatka figury, mięśnie z katalogu, wynik sprawdzeń „why” (`dowody/karty/*.txt`). Kryterium: czy animacja (także między pozycjami) zgadza się ze zdaniami karty i z fizyką ruchu (podpory w miejscu, ciało nie przechodzi przez przyrząd).
2. **Wynik:** 33 figury bez wad (3 z uwagami kosmetycznymi), 23 z wadą ruchu: 21 poprawionych, 2 ukryte. 15 figur v1 ćwiczeń z gotową rodziną v2 nie jest wyświetlanych (werdykt „zastapiona”).
3. **Mechanizm (test akceptacyjny DEC-01 b):** zapis `docs/research/figury-recenzja.json` (v1: wpis na ćwiczenie — rodzina, werdykt, data, kto, skrót danych figury i wskazówek; v2: wpis na gotową rodzinę — skrót rigu i liczba ćwiczeń); `scripts/zrodla-runtime.mjs:57` przepuszcza do `lib/figures/data.json` tylko figury z werdyktem wyswietlana albo zastapiona i aktualnym skrótem (`--skroty` liczy skróty, `scripts/zrodla-runtime.mjs:44`); figura bez wpisu, ukryta albo zmieniona po recenzji trafia na listę otwartą i się nie rysuje. Strażnik `tests/figury-recenzja.test.tsx`: wpis dla każdej figury v1 (rodzina = przypisanie v2), skrót = bieżący, plik runtime = tylko recenzowane, „zastapiona” tylko przy figurze v2, rodzina v2 `ready` ⇒ wpis z bieżącym skrótem rigu i liczbą ćwiczeń, generator wyrzuca figurę zmienioną po recenzji, ekran figury ukrytej (same wskazówki), testy regresji 21 wad, niezmiennik toru dla wszystkich figur v1.
4. Dokument `docs/research/28-figury.md` oznacza figury ukryte (`scripts/figures/gen.mjs:112`); BRD BR-BIB-001 — nowy scenariusz (`docs/brd/wymagania.md:381`); L-042 — akcja 3 zrobiona i rozszerzenie na v1 (`docs/40-lekcje.md:57`).

## Lista: rodzina / ćwiczenie / wada / poprawka / stan

Jednostka „j.” = 1/100 wzrostu figury (ok. 1,75 cm). „Było” — dane bazy 862f119; „po” — `dowody/metryki-po.json`.

| rodzina | ćwiczenie | wada (wskazówka karty) | poprawka | stan |
|---|---|---|---|---|
| pull_up | Pull Up | ciało buja się pod drążkiem, biodro 21,6 j. w przód i w tył (pu.noSwing „Bez bujania”) | pozycja „w trakcie” z biodrem pod drążkiem, tułów na górze odchylony o 14°; rozrzut 7,1 j. | poprawiona |
| pull_up | Chin Up | jak wyżej, 22,2 j. | jak wyżej; 8,2 j. | poprawiona |
| pull_up | Neutral Grip Pull Up | jak wyżej, 22,2 j. | jak wyżej; 8,2 j. | poprawiona |
| pulldown | Lat Pulldown | drążek łukiem do 21 j. przed linię bloczka (lpd.pull „w dół przed twarzą”) | pozycja „w trakcie”, dłoń pod bloczkiem; łuk 2,7 j. (było 18,9) | poprawiona |
| overhead_press | Overhead Press (sztanga) | gryf wybiega łukiem przed linię startu ok. 8 j. (ohp.tall „prosto w górę”) | pozycja „w trakcie”: gryf mija twarz z przodu (≥ 7,5 j. od środka głowy), pionowo w górę; wybieg 0,6 j. | poprawiona |
| overhead_press | Overhead Press (hantle) | ciężar łukiem przed twarzą, łuk 10,9 j. | pozycja „w trakcie”, łokcie pod nadgarstkami; łuk 2,5 j. | poprawiona |
| overhead_press | Seated Shoulder Press (hantle) | łuk 10,5 j. | jak wyżej; 2,1 j. | poprawiona |
| overhead_press | Wyciskanie nad głowę (linki) | łuk 10,9 j. | jak wyżej; 2,5 j. | poprawiona |
| overhead_press | Push Press | łuk gryfu przed twarzą; nogi i ręce prostują się naraz (pp.legs „ręce kończą ruch”); figura ma już 3 pozycje — limit silnika v1 | rodzina v2 overhead_press z fazami albo 4. pozycja w silniku v1 (ugięcie → wyprost nóg z gryfem przy barkach → wyciśnięcie) | **ukryta** (wskazówki zostają) |
| row | Pendlay Row | figura identyczna z wiosłowaniem w opadzie — brak cechy rozpoznawczej (bramka 4, pkt 1 listy recenzenta); karta też nie opisuje startu z podłogi | wskazówka i poza: start z podłogi przy każdym powtórzeniu, tułów prawie równolegle do podłogi — po potwierdzeniu w 2 zgodnych źródłach szczebla 4 (strony 27.10 niedostępne, 403) | **ukryta** (wskazówki zostają) |
| pushup_plank | Push Up | dłonie ślizgają się po podłodze o 5,7 j. | pozycja „w trakcie” w połowie głębokości; ślizg 1 j. | poprawiona |
| pushup_plank | Incline Push Up | dłonie ślizgają się po krawędzi o 6 j. | jak wyżej; 2,2 j. | poprawiona |
| chest_press_machine | Machine Chest Press | uchwyt opada i wznosi się, łuk 9,3 j. | pozycja „w trakcie”; łuk 1,3 j. | poprawiona |
| cable_row | Seated Cable Row | uchwyt z wysokości barków do brzucha, linka do 34,5° od poziomu (wbrew notatce „linka poziomo”) | bloczek i start na wysokości brzucha, pozycja „w trakcie”; linka do 1,6° | poprawiona |
| cable_row | Wiosłowanie na linkach (siedząc) | jak wyżej (ta sama figura) | jak wyżej | poprawiona |
| hip_bridge | Hip Thrust (sztanga) | dłonie 10–20 j. od gryfu (ht.hold „przytrzymuj ciężar dłońmi”) | ręce zgięte, dłonie na gryfie w obu pozycjach (≤ 2 j.) | poprawiona |
| hip_bridge | Hip Thrust (hantel) | jak wyżej | jak wyżej | poprawiona |
| dip | Triceps Dips (ławka) | pięty jadą po podłodze 9,7 j. i odrywają się; biodra startują 18 j. przed ławką | nowe pozy: ręce prawie pionowo, biodra 2–8 j. przed krawędzią, pięty w miejscu (ślizg 2,7 j.) | poprawiona |
| leg_machine | Leg Press | platforma jedzie prawie poziomo (−171°) przy powierzchni pod 45°; biodro 132° na dole | nowe pozy: platforma prostopadle do swojej powierzchni (odchyłka ≤ 1,2°), kolano 89° i biodro 114° na dole, kolano 6° na górze, oparcie równoległe do tułowia | poprawiona |
| lunge | Bulgarian Split Squat (hantle) | tylna stopa odrywa się od ławki o 7,6 j. (bss.setup) | pozycja „w trakcie” z tylną stopą na ławce; 2 j. | poprawiona |
| lunge | Step Up | stopa nogi zakrocznej przechodzi przez skrzynię (6 j.) | pozycja „w trakcie”: noga uniesiona za skrzynią; 0 j. | poprawiona |
| lunge | Lunges (hantle) | przednia stopa sunie po podłodze zamiast kroku (lunge.fwd „krok w przód”) | pozycja „w trakcie”: krok z uniesioną przednią nogą | poprawiona |
| lunge | Walking Lunges | jak wyżej | jak wyżej | poprawiona |
| row | T-Bar Row | kosmetyka: talerz przy dłoniach od strony osi zamiast na końcu gryfu | przesunąć talerz za dłonie (koniec gryfu) | bez zmian, backlog |
| core_floor | Bird Dog | kosmetyka: dłoń 1,2 j. pod podłogą w pozycji wyjściowej, krótki ślizg dłoni i stopy przy odrywaniu | t z 17° na ok. 19° i pozycja „w trakcie” z kończynami nad podłogą | bez zmian, backlog |
| lunge | Reverse Lunge | kosmetyka: przednia stopa przesuwa się o 3,1 j. przy unoszeniu figury | pozycja z kotwicą na przedniej stopie bez „lift” | bez zmian, backlog |

Bez wad (zapis z uwagą „Ruch i karta zgodne”): Bent Over Row ×2, One Arm Row, Chest Supported Row, Face Pull, uginania ×5, szrugsy ×2, unoszenia ×3, łydki ×2, Calf Press, Lying Leg Curl, Plank, Mountain Climbers, Dead Bug, Rowing Machine, Skullcrusher, Pushdown, prostowania nad głową ×2, Kettlebell Swing, Glute Bridge, Pistol Squat (szczegóły w `docs/research/figury-recenzja.json`).

## Testy przed i po
- Przed (baza 862f119, bez zapisu i mechanizmu): `tests/figury-recenzja.test.tsx` — 28 nie przechodzi, 3 przechodzą (`dowody/jest-przed.txt`, pełny wynik `dowody/jest-przed-pelny.txt`); każdy test regresji czerwony z liczbą wady (np. rozrzut biodra 21,6; łuk 18,9; ślizg 5,7).
- Etap pośredni (mechanizm i zapis, wady ukryte, przed poprawkami): strażnik zielony poza liczbą ćwiczeń v2 (wartość do uzupełnienia) — `dowody/jest-etap-ukryte.txt`.
- Po (commit 562798d): 26 zestawów, 427 testów — wszystkie przechodzą (figury v1 i v2, wskazówki, źródła w paczce, BRD, język de z „Techniką”, `tests/figury-1-0-recenzja.test.ts`) — `dowody/jest-po-pelny.txt`; `npx tsc --noEmit` bez błędów; `check:matrix`, `check:figures`, `check:zrodla-runtime`, `check:cues`, `check:claims`, `kontrola-brd` — bez błędów. `check:readme` — nieaktualne liczniki testów w README (plik generowany; regeneracja raz po scaleniu — koordynator). Pełnego verify nie uruchamiałam (polecenie: pełny zestaw uruchamia koordynator).
- Zmienione istniejące testy (zmiana zachowania, nie dopasowanie): `tests/zrodla-pelne-figury.test.ts` (runtime = pełne dane bez figur ukrytych, ukryte na liście otwartej), `tests/figures.test.tsx` (Pendlay Row bez figury; test „Ogranicz ruch” na Reverse Lunge zamiast ukrytego Push Press), zrzut SVG Pull Up (3 pozycje).

## Strona techniqueatlas (tylko odczyt, `/home/user/lkarwowski494/techniqueatlas`)
- Strona jest przypięta do commitu aplikacji bd7e62f (gałąź integracja-1-1, `PIN.json`) i budowana z eksportu aplikacji (`scripts/strona/eksport.mjs` w tym commicie). Eksport figur: tylko figury v2 — rodziny „ready” (tam: squat, bench_press, hinge, pull_up) oraz rodziny z plikami pozy pilotażu (`lib/figures/v2/poses/`: core_floor, pull_up, pushup_plank). **Figur v1 strona nie eksportuje w ogóle**, więc Push Press i Pendlay Row nie mają tam rysunku niezależnie od tej zmiany; ich karty (wskazówki, mięśnie) strona pokazuje.
- Nowe znalezisko (poza zakresem, do decyzji): eksport strony przepuszcza figury z plików pozy pilotażu bez statusu `ready` i bez wpisu recenzji — sprzeczne z CLAUDE.md 27.10 („rodzina bez recenzji … strona jej nie eksportuje”). Realność: brzegowa do startu strony (indeksowanie wyłączone, Pages wyłączone). Krok: w eksporcie aplikacji warunek „rodzina ready i wpis w `docs/research/figury-recenzja.json` z aktualnym skrótem” (rola 08) albo wycofanie plików pilotażu z eksportu; zmiana w repo strony — krok właściciela. Opcje: (a) warunek w eksporcie aplikacji + test parytetu — zalecane (jedno źródło prawdy); (b) filtr w repo strony — dubluje regułę.

## Przekazania
- **Rola 08 (programista):** zmiany w `scripts/zrodla-runtime.mjs` i `scripts/figures/gen.mjs` wykonałam w ramach polecenia (mechanizm z testu akceptacyjnego) — do przeglądu kodu przy scalaniu. Przy przeniesieniu na integracja-1-1: dopisać warunek recenzji w eksporcie strony (wyżej) i, gdy pull_up stanie się tam rodziną v2 `ready`, wpis v2 w zapisie (test to wymusi).
- **Rola 07 (tester-e2e):** szybki przebieg `tylko_scenariusze` dla 17 (biblioteka, „Technika”) i obejrzenie zrzutu karty z poprawioną figurą v1 (np. Pull Up, Overhead Press (sztanga)) na symulatorze — Linux nie pokaże animacji w aplikacji; geometria jest ta sama co w zrzucie SVG testów.
- **Koordynator:** regeneracja README (liczniki) po scaleniu; pełne verify.

## Co otwarte i dlaczego
- **Push Press i Pendlay Row ukryte** — decyzja właściciela: naprawa przed 1.0 (czwarta pozycja w silniku v1 / wskazówka Pendlaya po potwierdzeniu źródeł) czy w 1.0.1. Rekomendacja: 1.0.1 — wskazówki tekstowe zostają, ryzyko błędnego rysunku znika, a poprawka wymaga zmiany silnika albo nowych źródeł.
- **Zapis v2 przeniesiony z L-042**, nie powtórzona recenzja (zakres zadania: v1); skrót wiąże go z bieżącym rigiem — każda zmiana rigu wymaga nowej recenzji.
- **Źródła wskazówek nie otwarte ponownie** (403/Wayback niedostępny): recenzja treści karty = zgodność figury ze zdaniami, wiarygodność zdań i spójność odwołań do źródeł (2–3 na zdanie w `data/zrodla/cues.json`); mięśnie — przegląd wiarygodności (Do sprawdzenia u źródła, np. Bird Dog: skośne i prostownik jako główne).
- **Niezależność:** recenzję i poprawki wykonała ta sama rola; poprawki sprawdzają testy regresji (zasada audytów pkt 2). Próbka kontrolna drugiego recenzenta (model pracy 53: 3 losowe ćwiczenia) — do uruchomienia przez koordynatora, jeśli chce.
- Uwagi kosmetyczne (T-Bar, Bird Dog, Reverse Lunge) — backlog 1.0.1, nie blokują (próg wydania: brak błędu techniki).

## Kroki właściciela
1. Decyzja: Push Press i Pendlay Row — naprawa przed 1.0 czy w 1.0.1 (rekomendacja wyżej).
2. Decyzja o stronie: warunek recenzji w eksporcie figur (opcja a, zalecana) przed startem strony z 1.1.

## Kontrola dowodów i sekretów
`node audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs wynik.md <kopia robocza> <katalog wyniku>` → „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone” (kod 0). Raport bez e-maili, UDID i sekretów; zapis recenzji w repo bez nazw źródeł.
