# 50 — Figury v2: grafiki ćwiczeń dla całej biblioteki (projekt, etap 1)

Decyzja właściciela 25.10.2026 (docs/18): grafiki ćwiczeń w 1.0 dla całej biblioteki (709) — główny wyróżnik aplikacji. Wzór wizualny: makieta właściciela
(`docs/design/figury/makieta-v7-1.html`, **wzór wizualny, nie źródło merytoryczne**). Ten dokument opisuje architekturę i zasady; liczby pokrycia i lista ćwiczeń na rodzinę
generuje `scripts/figures/v2-gen.mjs` do `docs/51-figury-v2-pokrycie.md`. Silnik: `lib/figures/v2/`, komponent: `components/ExerciseFigureV2.tsx`. Poprzedni system
(`lib/figures`, 71 figur z kątami stawów i zdaniami wskazówek, docs/research/28) zostaje nietknięty i działa dalej — figury v2 obowiązują dopiero po podłączeniu (pkt 9).

## 1. Architektura

**Jeden szkielet 3D, rzut na dowolny widok.** Osoba ma 3D szkielet (cm; x = przód, y = góra, z = prawa strona; `skeleton.ts`, wymiary w `BODY`, jedno miejsce). Kończyny to dwukostny IK z biegunem
(kierunek zgięcia kolana i łokcia), kręgosłup ma zgięcie, głowa kierunek. Ten sam szkielet daje widok **z boku**, **z przodu** i **z góry** (dla ćwiczeń w leżeniu) — nie rysujemy dwóch osobnych figur,
więc widoki nigdy się nie rozjeżdżają, a odwiedzenie łokci, szerokość chwytu i rozstaw stóp są prawdziwe geometrycznie (a nie „rzutem ręki” jak w v1). Rysunek: kapsuły kończyn, kontur tułowia z profilu,
głowa, buty, sprzęt (`draw.ts`); kształty 2D mają role kolorów, nie kolory.

**Rodzina ruchu (archetyp) = jeden plik w `rigs/`**: funkcja `frame(parametry, u)` (u 0–1: pozycja wyjściowa → skrajna) zwraca klatkę: szkielet + rekwizyty + punkty znaczące + dozwolone kontakty.
Pozy nie są wpisywane kątami: **wynikają z ograniczeń** (stopy płasko na podłodze; gryf nad śródstopiem w przysiadzie, bo tułów się dopasowuje; w martwym ciągu gryf przesuwa się po nogach i nie
przenika podudzi, ramiona proste, tułów dopasowany do długości; na ławce plecy leżą na oparciu, gryf dotyka klatki). To eliminuje klasę błędów makiety (gryf poza dłońmi, nogi przez słupek,
sztanga na głowie) już na etapie konstrukcji i pozwala je łapać testami.

**Ćwiczenie = rodzina + parametry wariantu** (`variants.ts`, tabela jawna): sprzęt (sztanga, hantle, kettlebell, linka, trap bar, Smith, taśmy, łańcuchy), kąt ławki, szerokość chwytu, jednostronność,
skrzynia, ściana, platforma. Zero wyrażeń regularnych przy parametrach — wariant to decyzja o tym, co rysunek pokazuje.

**Przypisanie 709 ćwiczeń do rodzin** (`families.ts`): reguły po nazwie, wzorcu (`pattern`) i sprzęcie z katalogu + jawne wyjątki (`OVERRIDES`); test pilnuje, że każde ćwiczenie ma rodzinę i liczności się
zgadzają. Wynik: **43 rodziny** pokrywają wszystkie 709 ćwiczeń; pierwsze 3 gotowe (przysiad 25, wyciskanie leżąc 30, zawias 32 = **87 ćwiczeń, 12,3%**), 40 do zrobienia (**622 ćwiczenia**).
Najwięcej ćwiczeń na rodzinę: core_floor 44, delt_raise 38, curl 36, mobility_stand 36, triceps 32, hinge 32; dziesięć największych z 40 pozostałych rodzin pokrywa 315 ćwiczeń (44% biblioteki). Pełna tabela: docs/51.

## 2. Co jest twierdzeniem, a co ilustracją (zasady merytoryczne CLAUDE.md)

- **Kąty, rozstawy, głębokość, szerokość chwytu, pochylenie tułowia** bez źródła = „uproszczenie ilustracyjne”. Na rysunku **nie ma liczb, etykiet kątów ani „90° = błąd”** (badacz: kąty łokci 45°/90° bez źródła
  szczebla ≥ 3). Zakresy stawów w testach pochodzą z docs/research/28 (CDC, Anderton); wyjątki (rack przedni, nad głową, gryf przy szyi) są nazwane i uzasadnione w teście.
- **Mięśnie**: dane **z katalogu** (`docs/research/equipment/catalog.json` → `muscleLoad`, 709/709, z pewnością i źródłami; generuje `v2-gen.mjs` → `muscles.generated.ts`), nie z makiety (ta przeczy zbadanym danym:
  triceps/biceps jako główne, pośladki w przysiadzie). 1 = główny, 0,5 = pomocniczy, 0,25 nie podświetlany; podświetlenie **stałe** (bez animowanej „krzywej napięcia” — brak źródła). Regiony bez odpowiednika
  w katalogu (zębaty przedni, podział czworobocznego) nie są rysowane. Komponent ma wyłącznik `muscles` (domyślnie wyłączony do decyzji o sposobie pokazywania — pkt 8).
- **Tempo**: 2 s w dół / 1 s w górę (mieści się w zaleceniu 1–2 s na fazę, ACSM 2009; zakres czasu powtórzenia 0,5–8 s daje podobny przerost — Schoenfeld 2015; badacz 25.10.2026); pauzy 0,5 s to konwencja bez źródła.
  **Brak etykiet oddechu (IN/EX) i cyklu 4 s** (konwencja bez źródła, sprzeczna z częścią źródeł przy ciężkich bojach). Liczby w jednym miejscu: `anim.ts`.
- **Wskazówki** (`cue-sets.json`, `cueSets.ts`): przypisanie przez zestawy na wzorzec ruchu od badacza (nie przez mapę z makiety). Decyzja właściciela 25.10.2026, **wariant A**: wskazówki wzorca także przy
  ćwiczeniach-analogiach, z dopiskiem „Ogólne wskazówki dla tego ruchu” (`t()`, PL i EN); przy 102 ćwiczeniach opisanych w źródłach wprost (lib/cues) dopisku nie ma; 69 ćwiczeń otwartych = grafika bez tekstu
  (538 ogólnych). **Przełącznik w danych**: `CUE_POLICY` (A albo B = tylko ćwiczenia ze źródłami). Strażnik „wskazówka nie przeczy ruchowi”: `CUE_REQUIRES` wiąże id wskazówki z cechami wariantu rysunku
  (np. „z podłogi” odrzuca RDL, „stopy na podłodze” odrzuca ławkę ujemną) i jest sprawdzany dla każdego ćwiczenia gotowej rodziny. 52 id nie ma jeszcze tekstu w `lib/cues/text/pl.json` (lista `newIds`;
  teksty i źródła w słowniku badacza — wdroży tłumacz). Wskazówka `mis.jerk` przy analogiach do przeglądu przy podłączaniu.
- **Rysunki własne**, bez odrysowywania cudzych; makieta służy wyłącznie jako wzór wyglądu (sylwetka, sprzęt, widoki).

## 3. Wygląd, motyw, dostępność

Kolory wyłącznie z tokenów (`palette.ts`: `figurePalette(theme)` miesza tokeny `lib/theme`; zero literałów hex w kodzie rysunku): skóra = neutralna szarość („manekin”; wariant tonu skóry — otwarte), ubranie =
akcent (granat/krem), ciężary = barwa pasma (teal). Działa w jasnym, ciemnym i „Zwiększ kontrast”; test sprawdza kontrast ≥ 3:1 (1.4.11) skóry, ubrania, ram i ciężarów do tła i karty we wszystkich czterech paletach.
Komponent: jeden obraz z opisem „Rysunek ruchu: nazwa” (VoiceOver), przycisk „Zatrzymaj animację” (WCAG 2.2.2), „Ogranicz ruch” albo pauza → pozycje statycznie z podpisami, tak jak v1.

## 4. Wydajność i rozmiar

Klatka (oba widoki, ok. 33 kształtów na widok) liczy się w 1–3 ms w Node (zawias najdłużej — rozwiązanie ograniczeń); animacja 30 klatek/s (`TEMPO.tickMs`) przez `react-native-svg` ze zmianą stanu — jak v1; na telefonie
trzeba to potwierdzić w E2E/na urządzeniu. Rozmiar: kod silnika ok. 115 KB źródła, dane mięśni 78 KB (generowane) i zestawów wskazówek 69 KB (oba ładowane razem z modułem — do rozważenia leniwe `require`, jak
lib/cues/text), brak nowych zależności. Podział na rodziny nie zwiększa kosztu klatki.

## 5. Testy (rodzaje wg docs/20)

`tests/figures-v2-geometry.test.ts` — **każdy wariant, 25 pozycji ruchu**: długości kości, zasięg IK, podłoga, brak przenikania ciało–sprzęt (z deklarowanymi kontaktami), dłonie na sprzęcie, zakres stawów,
ciągłość ruchu (brak przeskoków), regresja błędów makiety (sztanga nie zasłania głowy i leży na górnej części pleców, gryf nad śródstopiem, gryf przy podudziach w martwym ciągu, gryf w dłoniach i na klatce w wyciskaniu).
`tests/figures-v2-engine.test.ts` — matematyka, IK, szkielet, rzuty, kształty, kolory i kontrast, tempo, kolidery, mięśnie, dokument generowany. `tests/figures-v2-mapping.test.ts` — macierz 709 ćwiczeń → rodziny,
warianty bez sierot. `tests/figures-v2-cues.test.tsx` — zestawy wskazówek, przełącznik, dopisek, strażnik. `tests/figures-v2-ui.test.tsx` — komponent (motywy, Ogranicz ruch, pauza, VoiceOver, brak liczb na rysunku).
**Nowa rodzina dziedziczy cały zestaw niezmienników**: wystarczy dopisać ją do listy gotowych rodzin w `tests/figures-v2-geometry.test.ts` (stała `READY`) — generyczne sprawdzenia (`checkFrame`) obejmą jej ćwiczenia.

## 6. Jak dodać rodzinę (instrukcja dla agenta)

1. `node scripts/figures/podglad-v2.mjs --out <katalog> --family <id>` pokazuje arkusz PNG (po dodaniu rigu); `--muscles` włącza podświetlenie; `--key "Nazwa"` jedno ćwiczenie. Playwright: `NODE_PATH=/opt/node-tools/node_modules`.
2. Plik `lib/figures/v2/rigs/<rodzina>.ts` z `frame(parametry, u)` (wzór: `rigs/hinge.ts` — poza z ograniczeń; `rigs/squat.ts` — z harmonogramu i równowagi; `rigs/benchPress.ts` — leżenie, widok z góry).
   Rekwizyty: `scene.ts` (`Prop`), kształty: `draw.ts` (`propShapes`) i koliderów: `colliders.ts` (`equipColliders`) — nowe rekwizyty dopisz we wszystkich trzech.
3. Tabela wariantów w `variants.ts` (każde ćwiczenie rodziny), rodzina `status: 'ready'` w `families.ts`, gałąź w `figure.ts` (`frameAt`).
4. `node scripts/figures/v2-gen.mjs --write` (docs/51), liczności w `tests/figures-v2-mapping.test.ts`, `READY` w teście geometrii, `npx jest tests/figures-v2-*`.
5. Obejrzyj zrzuty obu motywów i **popraw błędy wizualne przed oddaniem**; wyjątki od zakresów stawów tylko z powodem (`ALLOW` w teście geometrii).

## 7. Pozostałe rodziny i szacunek pracy

Tabela z godzinami pracy agenta (rig + testy + przegląd zrzutów) na każdą z 40 rodzin: docs/51 (generowana). Suma ok. 126 h pracy agenta; z pracą równoległą kilku agentów po rodzinach — wąskie gardła to nie
programowanie, tylko przeglądy zrzutów i czekanie na CI/E2E. Rodziny trudniejsze (olimpijskie, cardio i lokomocja, mobilność, wykroki, w podporze) mają największy szacunek; wiele z nich (podpora na dłoniach,
ruchy cykliczne bez rekwizytów) wymaga rozszerzenia silnika o drugą podporę/obrót wokół kotwicy (jak `level` w v1) — zadanie wspólne, najlepiej zrobić je przy `pushup_plank`.

## 8. Otwarte decyzje i pytania

1. **Mięśnie na figurze — pokazywać domyślnie?** (a) tak, stałe podświetlenie główne/pomocnicze + krótka legenda (nowy tekst `t()`); (b) przełącznik „Mięśnie” w sekcji Technika; (c) dopiero po decyzji o regionach (zębaty, trapez). Rekomendacja: (b).
2. **Ćwiczenia z pewnością „brak źródła — uproszczenie” (105 w katalogu)**: podświetlać z oznaczeniem „uproszczenie” (rekomendacja) albo nie podświetlać.
3. **Wariant tonu skóry i ubrania** (makieta ma odcienie): dziś jedna neutralna paleta; opcje w ustawieniach wyglądu — decyzja produktowa.
4. **Widok z przodu przy ćwiczeniach w leżeniu** pokazuje widok z góry (głowa u góry) zamiast elewacji od strony głowy (ta zasłania klatkę) — zatwierdzić.
5. **Format tempa**: 3 liczby w aplikacji (np. 3-1-1) vs 4 w makiecie — jeśli animacja ma odtwarzać tempo użytkownika, ujednolicić (decyzja produktowa).
6. Reguła „wydech przy wysiłku”, Valsalva — poza grafiką (badacz: brak drugiego źródła; rekomendacja: nie pokazywać).

## 9. Podłączenie do aplikacji (etap 2, 25.10.2026)

`ExerciseCues` pokazuje `ExerciseFigureV2` tam, gdzie istnieje gotowa rodzina (87 ćwiczeń); `ExerciseFigure` (v1) zostaje dla pozostałych do czasu gotowości wszystkich rodzin. Sekcja „Technika” pojawia się też przy ćwiczeniu z figurą v2 bez własnych wskazówek
(zestaw ogólny z dopiskiem „Ogólne wskazówki dla tego ruchu”, `hasTechnique` w `lib/figures/v2/ui.ts`; ćwiczenia spoza gotowych rodzin dostaną zestaw ogólny razem z figurą w kolejnych etapach). E2E: scenariusz `.maestro/55-grafika-cwiczenia.yaml`
(przepływ **SZ-14** w `tests/przeplywy.json`, ten sam scenariusz biegnie w interpreterze Jest). Zrzuty obu motywów i płynność animacji na telefonie — lista „tylko telefon”.

## 10. Kontrakt danych rodziny (dla zewnętrznego generatora póz)

Cel (decyzja właściciela 25.10.2026): pozę ćwiczenia może wypełnić ZEWNĘTRZNY generator (pilotaż: API Gemini, rodzina `pull_up`, `scripts/figures/gemini-pozy.mjs`, docs/52), a nasze testy sprawdzają wynik tak samo jak rigi gotowych rodzin.
Źródło prawdy: `lib/figures/v2/contract.ts` (typy, `CONTRACT` z liczbami, `poseSchema`, interpreter, walidator); schemat JSON w repozytorium: `docs/schemas/figury-v2-poza.schema.json` (generowany `node scripts/figures/v2-validate.mjs --schema --write`, sprawdzany w `check:figures-v2`);
walidator: `node scripts/figures/v2-validate.mjs <plik.json> [--podglad katalog]` (kod 0 = poprawne, 1 = błędy z komunikatami, 2 = użycie). Przykład z gotowej rodziny (`exampleFor('Back Squat', …)`) przechodzi ten sam walidator.

**Format (jeden obiekt na ćwiczenie).** Układ jak w silniku: cm, x = przód, y = góra (podłoga y = 0), z = prawa strona osoby; kąty w stopniach; strony `R`/`L` (prawa/lewa).
- `kontrakt` = `figury-v2/poza@1`, `rodzina`, `cwiczenie` (klucz katalogu, np. „Pull Up”).
- `sprzet[]`: `sztanga` (x, y, talerze, podazaZaChwytem, dlugosc; drążek to sztanga bez talerzy), `slupek` (x, h), `podloga` (x0, x1), `skrzynia` (x0, x1, top). Zasady rodziny w `TEMPLATES` (pull_up: dokładnie jeden nieruchomy drążek bez talerzy, x ∈ [−30, 30], y ∈ [200, 260], słupek i podłoga; domyślny sprzęt w `TEMPLATES.pull_up.defaultGear`).
- `klatki[]` (2–12, rosnące `u`, pierwsza u = 0, ostatnia u = 1; między nimi interpolacja liniowa — ruch zakrzywiony wymaga klatek pośrednich): `miednica` [x, y, z], `pochylenieTulowia`, opcjonalnie `zgiecieKregoslupa`, `pochylenieGlowy`, `nogi.{R,L}` (`kostka` + opcjonalnie `podbicie`, `rotacjaStopy`, `odchylenieKolana`),
  `rece.{R,L}` (`chwyt` + opcjonalnie `biegunLokcia`, `dolnaCzesc`). Kolana i łokcie liczy nasz IK (dwukostny, długości kości stałe: `BODY`), więc generator podaje tylko cele; tułów ma stałą długość (barki wynikają z miednicy i pochylenia).
- `bledy[]` (≤ 3): błąd = MODYFIKACJA pozy poprawnej, nie osobna poza: `cue` (id wskazówki „częsty błąd” z `cue-sets.json` albo `lib/cues` — tekst błędu bierzemy z naszego słownika, generator nie pisze tekstów ani liczb do wyświetlenia), `znacznik` (gdzie ✕: knees, heels, back, pelvis, bar),
  `dotyczy[]` (deklarowane wielkości: knee, ankle, hip, spine, kneeLat, heel, pelvis, bar, shoulder, elbow), `klatki[]` z deltami (te same pola co poza, wszystkie opcjonalne, dodawane do pozy poprawnej; pierwsza u = 0 z deltą zerową, ostatnia u = 1).
  Błędy tempa (np. „szarpanie”) nie są pozą — zostają w `ERRORS` (`kind: 'tempo'`).

**Co sprawdza walidator (`validatePose`; kody w komunikatach):** `schemat` (typy, zakresy, pola — ze ścieżką, np. `$.klatki[1].u: 2 > maksimum 1`), `kontrakt`/`rodzina`, `klatki-u`, `sprzet` (zasady rodziny), `geometria` (kości, zasięg IK, podłoga, przenikanie ciało–sprzęt, głowa × ręce; ten sam `checkFrame` co dla rodzin),
`chwyt` (dłoń na osi sztangi, tolerancja 0,6 cm: „dłoń prawa wobec drążka/sztangi: dłoń 6.00 cm od chwytu … w fazie u=0.50”), `zakres` (zakresy stawów z docs/research/28; wyjątki rodziny z powodem: `TEMPLATES.<rodzina>.allow`), `ciaglosc` (skok stawu ≤ 6 cm na 1/48 ruchu),
`ruch` (≥ 8 cm), a dla błędów: `blad-cue` (spoza listy ćwiczenia), `blad-u`, `blad-start` (delta na starcie ≠ 0), `blad-niedeklarowane` (kąt biodra/kolana/kostki/łokcia/barku zmienia się o > 4° bez deklaracji w `dotyczy`), `blad-niewidoczny` (< 3 cm i < 8°) oraz `geometria`/`chwyt` dla pozy błędu (nie przenika sprzętu).
Komunikaty są konkretne (wartość, strona, faza u, wskazówka naprawy), żeby model mógł poprawić dokładnie to miejsce.

**Interfejs biblioteki dla pilotażu** (`scripts/figures/v2-validate.mjs`): `schematPozy(rodzina)`, `opisKontraktu(rodzina)`, `waliduj(poza, { rodzina, cwiczenie })` → `{ ok, bledy: [{ kod, szczegol }] }`, `przyklad(rodzina)` → `[{ cwiczenie, poza }]` (gotowe rodziny: przysiad, wyciskanie leżąc, zawias; rodzina planowana → `[]`),
`zastosuj(root, wynik)` → po przeglądzie zapisuje poprawne pozy do `lib/figures/v2/poses/<rodzina>.json` (odrzucone zwraca z błędami). Rodzina `pull_up` jest „pusta do wypełnienia”: szablon sprzętu (drążek ze słupkiem), opis ruchu i wyjątek zakresu barku (zwis, ramiona nad głową — uproszczenie ilustracyjne) w `TEMPLATES.pull_up`, lista 13 ćwiczeń w docs/51.
Test: `tests/figures-v2-contract.test.ts` (poza podciągania zwis → góra przechodzi; przykłady z gotowych rodzin przechodzą; każdy kod błędu ma przypadek negatywny).

**Czego kontrakt (jeszcze) nie robi:** nie obejmuje sprzętu ruchomego innego niż sztanga między dłońmi, linek, kółek, liny ani ruchu cyklicznego z obrotem wokół kotwicy; nie ma kształtów mięśni ani toru (liczone z pozy jak dla rodzin); poza z danych nie jest jeszcze podłączona do `figureSpec` — po przeglądzie wyniku pilotażu
(`zastosuj`) rodzina dostaje status gotowej i ładowanie z `poses/`. Ocena pilotażu (odsetek poprawnych za pierwszym razem, koszt) — docs/52.

## 11. Etap 2 (25.10.2026): styl, mięśnie, tor, fazy, linie odniesienia, błędy ✕

- **Styl**: odcienie bliższej i dalszej strony ciała (role `skin/skinFar`, `cloth/clothFar` + światło `skinHi/clothHi`), talerz po dalszej stronie jako jasne koło za ciałem, po bliższej tylko cienki obrys (przezroczysty); kadr wg proporcji widoku (figura większa przy wyciskaniu z boku).
- **Mięśnie zawsze widoczne** z legendą „Mięśnie główne / pomocnicze”; przy pewności „uproszczenie” (105 ćwiczeń) dopisek „Dobór mięśni: uproszczenie”. Dane z katalogu (`muscleLoad`), nie z makiety.
- **Tor ruchu** (linia drogi sztangi lub dłoni), **licznik faz z tempem** (Opuszczanie 2 s · Pauza · Wypychanie 1 s; `t()`), **linie odniesienia bez liczb** tylko tam, gdzie wskazówka ma źródło (uda równolegle ← `sq.depth`, sztanga nad środkiem stopy ← `dl.feet`, kolana nad palcami ← `sq.kneesToes`, linia pleców ← `hinge.back`; `guides.ts`).
- **Przysiad bez pauzy na dole** (NSCA Basics 2012 s. 49–50: nie zatrzymywać ruchu na dole; pauza 0,5 s była konwencją bez źródła): `tempoFor` → `holdLowMs: 0`; pozostałe rodziny bez zmian.
- **Błędy ✕** (`errors.ts`): 7 błędów (kolana do środka, pięty, zaokrąglone plecy, nadmierne wygięcie lędźwi, sztanga od ciała, kolana ugięte w RDL, szarpanie) jako delty parametrów rigu z wagą rosnącą z ruchem; przełącznik „Pokaż częsty błąd”; testy: poza błędu bez przenikania (126 par), niedeklarowane kąty ≤ 4°, widoczna różnica, brak różnicy na starcie.
- **Widok z góry** dla ćwiczeń w leżeniu (przyjęty). **Wskazówki** po korekcie badacza (NSCA Basics, 25.10.2026): `lunge.torso` → „Plecy proste przez cały ruch.”, `pp.dip` → „Ugięcie krótkie, tułów napięty.”, `row.bbPull`/`row.dbPull` → „… do brzucha” — zmienione w PL i EN (`lib/cues/text`); pozostałe 33 języki wymagają przeglądu tłumacza (stare brzmienie do czasu przekładu).
  Nie zrobione: nowy błąd `lpd.mis.lean` (rodzina ściągania drążka jeszcze nie ma figury — dopisać razem z rodziną `pulldown`); przedział kąta palców w przysiadzie (15–20°, szczebel 4 dwa zgodne źródła) jako linia odniesienia i oddech „wydech w trudnej fazie” (tylko izolowane i maszyny) — czekają na decyzję produktową o ich pokazaniu;
  łokcie ok. 45° przy wyciskaniu — wstrzymane do decyzji właściciela.
