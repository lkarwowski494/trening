# 50 — Figury v2: grafiki ćwiczeń dla całej biblioteki (projekt, etap 1)

Decyzja właściciela 25.10.2026 (docs/18): grafiki ćwiczeń w 1.0 dla całej biblioteki (709) — główny wyróżnik aplikacji. **Zmiana 26.10.2026 (docs/18): 1.0 bez nowych grafik, biblioteka v2 w 1.1.** Wzór wizualny: makieta właściciela
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
(zestaw ogólny z dopiskiem „Ogólne wskazówki dla tego ruchu”, `hasTechnique` w `lib/figures/v2/ui.ts`; ćwiczenia spoza gotowych rodzin dostaną zestaw ogólny razem z figurą w kolejnych etapach). E2E: scenariusz `.maestro/57-grafika-cwiczenia.yaml`
(przepływ **SZ-14** w `tests/przeplywy.json`, ten sam scenariusz biegnie w interpreterze Jest). Zrzuty obu motywów i płynność animacji na telefonie — lista „tylko telefon”.

## 10. Kontrakt danych rodziny (dla zewnętrznego generatora póz)

Cel (decyzja właściciela 25.10.2026): pozę ćwiczenia może wypełnić ZEWNĘTRZNY generator (pilotaż: API Gemini, rodzina `pull_up`, `scripts/figures/gemini-pozy.mjs`, docs/52), a nasze testy sprawdzają wynik tak samo jak rigi gotowych rodzin.
Źródło prawdy: `lib/figures/v2/contract.ts` (typy, `CONTRACT` z liczbami, `poseSchema`, interpreter, walidator); schemat JSON w repozytorium: `docs/schemas/figury-v2-poza.schema.json` (generowany `node scripts/figures/v2-validate.mjs --schema --write`, sprawdzany w `check:figures-v2`);
walidator: `node scripts/figures/v2-validate.mjs <plik.json> [--podglad katalog]` (kod 0 = poprawne, 1 = błędy z komunikatami, 2 = użycie). Przykład z gotowej rodziny (`exampleFor('Back Squat', …)`) przechodzi ten sam walidator.

**Format (jeden obiekt na ćwiczenie).** Układ jak w silniku: cm, x = przód, y = góra (podłoga y = 0), z = prawa strona osoby; kąty w stopniach; strony `R`/`L` (prawa/lewa).
- `kontrakt` = `figury-v2/poza@2` (walidator przyjmuje też `poza@1` — dane zapisane przed rozszerzeniem; `poza@1` z polem poza@2 jest odrzucane), `rodzina`, `cwiczenie` (klucz katalogu, np. „Pull Up”).
- `sprzet[]`: `sztanga` (x, y, talerze, podazaZaChwytem, dlugosc; drążek to sztanga bez talerzy), `slupek` (x, h), `podloga` (x0, x1), `skrzynia` (x0, x1, top). Zasady rodziny w `TEMPLATES` (pull_up: dokładnie jeden nieruchomy drążek bez talerzy, x ∈ [−30, 30], y ∈ [200, 260], słupek i podłoga; domyślny sprzęt w `TEMPLATES.pull_up.defaultGear`).
- `klatki[]` (2–12, rosnące `u`, pierwsza u = 0, ostatnia u = 1; między nimi interpolacja liniowa — ruch zakrzywiony wymaga klatek pośrednich): `miednica` [x, y, z], `pochylenieTulowia`, opcjonalnie `zgiecieKregoslupa`, `pochylenieGlowy`, `nogi.{R,L}` (`kostka` + opcjonalnie `podbicie`, `rotacjaStopy`, `odchylenieKolana`),
  `rece.{R,L}` (`chwyt` + opcjonalnie `biegunLokcia`, `dolnaCzesc`). Kolana i łokcie liczy nasz IK (dwukostny, długości kości stałe: `BODY`), więc generator podaje tylko cele; tułów ma stałą długość (barki wynikają z miednicy i pochylenia).
- `bledy[]` (≤ 3): błąd = MODYFIKACJA pozy poprawnej, nie osobna poza: `cue` (id wskazówki „częsty błąd” z `cue-sets.json` albo `lib/cues` — tekst błędu bierzemy z naszego słownika, generator nie pisze tekstów ani liczb do wyświetlenia), `znacznik` (gdzie ✕: knees, heels, back, pelvis, bar),
  `dotyczy[]` (deklarowane wielkości: knee, ankle, hip, spine, kneeLat, heel, pelvis, bar, shoulder, elbow), `klatki[]` z deltami (te same pola co poza, wszystkie opcjonalne, dodawane do pozy poprawnej; pierwsza u = 0 z deltą zerową, ostatnia u = 1).
  Błędy tempa (np. „szarpanie”) nie są pozą — zostają w `ERRORS` (`kind: 'tempo'`).

**Co sprawdza walidator (`validatePose`; kody w komunikatach):** `schemat` (typy, zakresy, pola — ze ścieżką, np. `$.klatki[1].u: 2 > maksimum 1`), `kontrakt`/`rodzina`, `klatki-u`, `sprzet` (zasady rodziny), `geometria` (kości, zasięg IK, podłoga, przenikanie ciało–sprzęt, głowa × ręce; ten sam `checkFrame` co dla rodzin),
`chwyt` (dłoń na osi sztangi, tolerancja 0,6 cm: „dłoń prawa wobec drążka/sztangi: dłoń 6.00 cm od chwytu … w fazie u=0.50”), `zakres` (zakresy stawów z docs/research/28; wyjątki rodziny z powodem: `TEMPLATES.<rodzina>.allow`), `ciaglosc` (skok stawu ≤ 6 cm na 1/48 ruchu; ruchy dynamiczne — lot, przechwyt, wymach — z deklaracją `dynamiczne` w `data/zrodla/figury-sens.json` (powód obowiązkowy, 26.10.2026) mają limit `CONTRACT.maxJumpDynamic` = 16 cm; pomiar generatora: skok z zamachem rąk 420–590 cm drogi najszybszego punktu na cały ruch wobec 288 cm limitu zwykłego; test zgodności wstecznej: rodziny bez deklaracji bez zmian, `tests/figury-dynamiczne.test.ts`),
`ruch` (≥ 8 cm), a dla błędów: `blad-cue` (spoza listy ćwiczenia), `blad-u`, `blad-start` (delta na starcie ≠ 0), `blad-niedeklarowane` (kąt biodra/kolana/kostki/łokcia/barku zmienia się o > 4° bez deklaracji w `dotyczy`), `blad-niewidoczny` (< 3 cm i < 8°) oraz `geometria`/`chwyt` dla pozy błędu (nie przenika sprzętu).
Komunikaty są konkretne (wartość, strona, faza u, wskazówka naprawy), żeby model mógł poprawić dokładnie to miejsce.

**Interfejs biblioteki dla pilotażu** (`scripts/figures/v2-validate.mjs`): `schematPozy(rodzina)`, `opisKontraktu(rodzina)`, `waliduj(poza, { rodzina, cwiczenie })` → `{ ok, bledy: [{ kod, szczegol }] }`, `przyklad(rodzina)` → `[{ cwiczenie, poza }]` (gotowe rodziny: przysiad, wyciskanie leżąc, zawias; rodzina planowana → `[]`),
`zastosuj(root, wynik)` → po przeglądzie zapisuje poprawne pozy do `lib/figures/v2/poses/<rodzina>.json` (odrzucone zwraca z błędami). Rodzina `pull_up` jest „pusta do wypełnienia”: szablon sprzętu (drążek ze słupkiem), opis ruchu i wyjątek zakresu barku (zwis, ramiona nad głową — uproszczenie ilustracyjne) w `TEMPLATES.pull_up`, lista 13 ćwiczeń w docs/51.
Test: `tests/figures-v2-contract.test.ts` (poza podciągania zwis → góra przechodzi; przykłady z gotowych rodzin przechodzą; każdy kod błędu ma przypadek negatywny).

**Czego kontrakt (jeszcze) nie robi:** nie obejmuje sprzętu ruchomego innego niż sztanga między dłońmi, linek, kółek, liny ani ruchu cyklicznego z obrotem wokół kotwicy; nie ma kształtów mięśni ani toru (liczone z pozy jak dla rodzin); poza z danych nie jest jeszcze podłączona do `figureSpec` — po przeglądzie wyniku pilotażu
(`zastosuj`) rodzina dostaje status gotowej i ładowanie z `poses/`. Ocena pilotażu (odsetek poprawnych za pierwszym razem, koszt) — docs/52.

## 11. Etap 2 (25.10.2026): styl, mięśnie, tor, fazy, linie odniesienia, błędy ✕

- **Styl**: odcienie bliższej i dalszej strony ciała (role `skin/skinFar`, `cloth/clothFar` + światło `skinHi/clothHi`), talerz po dalszej stronie jako jasne koło za ciałem, po bliższej tylko cienki obrys (przezroczysty); kadr wg proporcji widoku (figura większa przy wyciskaniu z boku).
- **Mięśnie zawsze widoczne** z legendą „Mięśnie główne / pomocnicze”; przy ćwiczeniach o przybliżonym doborze mięśni (105 ćwiczeń) dopisek „Dobór mięśni: przybliżony” (bez słowa „uproszczenie” — zakaz oznaczeń pewności w tekstach UI). Dane z katalogu (`muscleLoad`), nie z makiety.
- **Tor ruchu** (linia drogi sztangi lub dłoni), **licznik faz z tempem** (Opuszczanie 2 s · Pauza · Wypychanie 1 s; `t()`), **linie odniesienia bez liczb** tylko tam, gdzie wskazówka ma źródło (uda równolegle ← `sq.depth`, sztanga nad środkiem stopy ← `dl.feet`, kolana nad palcami ← `sq.kneesToes`, linia pleców ← `hinge.back`; `guides.ts`).
- **Przysiad bez pauzy na dole** (NSCA Basics 2012 s. 49–50: nie zatrzymywać ruchu na dole; pauza 0,5 s była konwencją bez źródła): `tempoFor` → `holdLowMs: 0`; pozostałe rodziny bez zmian.
- **Błędy ✕** (`errors.ts`): 7 błędów (kolana do środka, pięty, zaokrąglone plecy, nadmierne wygięcie lędźwi, sztanga od ciała, kolana ugięte w RDL, szarpanie) jako delty parametrów rigu z wagą rosnącą z ruchem; przełącznik „Pokaż częsty błąd”; testy: poza błędu bez przenikania (126 par), niedeklarowane kąty ≤ 4°, widoczna różnica, brak różnicy na starcie.
- **Widok z góry** dla ćwiczeń w leżeniu (przyjęty). **Wskazówki** po korekcie badacza (NSCA Basics, 25.10.2026): `lunge.torso` → „Plecy proste przez cały ruch.”, `pp.dip` → „Ugięcie krótkie, tułów napięty.”, `row.bbPull`/`row.dbPull` → „… do brzucha” — zmienione w PL i EN (`lib/cues/text`); pozostałe 33 języki wymagają przeglądu tłumacza (stare brzmienie do czasu przekładu).
  Nie zrobione: nowy błąd `lpd.mis.lean` (rodzina ściągania drążka jeszcze nie ma figury — dopisać razem z rodziną `pulldown`) (oddech: patrz niżej).
- **Kąty z decyzji właściciela 25.10.2026** (`katy-oddech.json`): palce w przysiadzie ok. 15–20° (opis, `toeAngleApplies`). Oddech „wydech w trudnej fazie, wdech w łatwej” tylko izolacje i maszyny, spokojny oddech w deskach, bez Valsalvy — do wdrożenia z rodzinami izolacji, maszyn i deski (żadna gotowa rodzina nie jest izolacją).
- **Wyciskanie leżąc: model wg rzeczywistości (decyzja właściciela 26.10.2026, „jak jest w rzeczywistości — nadrzędne”; parametry z badań: `data/zrodla/figury-wyciskanie.json`, pełne dane ze źródłami, runtime bez nazw).** Liczba „łokcie ok. 45°” nie ma źródła (otwarte) — opis i linia usunięte; wskazówki tekstowej o łokciach nie ma (wymaga dwóch przeczytanych źródeł szczebla 4). Źródło ma regułę (podręcznik NSCA 2012, s. 53–55): nadgarstki nad łokciami, przedramiona prostopadle do podłogi, chwyt „trochę szerzej niż barki”, dotyk na klatce (skos: górna część). Rig czterech wariantów (sztanga i hantle, płasko i skos; parametr `vert`) liczy łokieć z łańcucha 3D bark–łokieć–dłoń (stałe długości segmentów; IK wybiera z okręgu dozwolonych łokci punkt najbliższy położeniu pod dłonią), więc odwiedzenie łokci WYNIKA z geometrii. Sylwetka tych wariantów (`BENCH.dims`; pozostałe rodziny i warianty zostają na wspólnym `BODY`): połowa barków 20,5 cm, ramię 33, przedramię 26,5 (mediany ANSUR II M; zgodne z danymi urzędowymi i proporcjami segmentów). Chwyt: połowa rozstawu dłoni 35 cm sztanga (1,7 × szerokość dwubarkowa — **konwencja** w zakresie 1,4–2,0 × z badań), 32 cm hantle; dotyk 16 cm (płasko) i 10 cm (skos) poniżej linii stawów ramiennych (**uproszczenie**, zakres 10–20). **Wynik na dole:** przedramię 0–9° od pionu; odwiedzenie ramienia od osi tułowia w widoku z góry: 42° (sztanga płasko), 43° (sztanga skos), 33° (hantle płasko), 37° (hantle skos); zgięcie łokcia 135–144°. Pomiar 3D z badania (59° przy chwycie średnim) używa innej definicji kąta. Granice okna punktu dotyku i „staw = akromion bocznie” to uproszczenia; niewiadome w `data/zrodla/figury-wyciskanie.json` → `otwarte`.
- **Kąt na rysunku** (25.10.2026): linia „Kąt na rysunku: zgięcie łokcia/kolana/biodra {n}°” pod licznikiem faz, liczona z geometrii klatki (`measuredAngle`), kursywą; zalecenia ze źródłami półpogrubieniem. **Reguły wyciskania z opisu NSCA:** `tests/figures-v2-bench-rules.test.ts` ((b)–(f)); reguła (a) otwarta — docs/18, 25.10.2026. Walidator `v2-validate.mjs` obejmuje dziś rodziny bez ławki (kontrakt nie ma sprzętu „ławka”), więc reguły ławki pilnuje test rigu; dopisać po rozszerzeniu kontraktu o ławkę.


- 26.10.2026 (właściciel: wyjątek od zamrożenia 1.0; naprawy po audycie, badacz r6): wymiary sprzętu — talerze `plateZ` [66, 71] (wcześniej 44–49 cm leżały na części chwytnej gryfu), łańcuchy sztangi `chainZ` 73 (dwa, na tulejach; wcześniej jeden w osi), ławka `benchW` 30 cm; gryf `barR` 1,6 zostaje jawną konwencją „pogrubienie dla czytelności” (norma 1,4–1,45; styk gryfu z klatką i odstępy kolizji bez przesunięcia). Źródło (szczebel 4, jedno): przepisy techniczne federacji trójboju siłowego 01.2024, s. 7–9 — pełne dane w `data/zrodla/figury-sprzet.json`, w module bez nazw. Testy: `tests/zrodla-pelne-sprzet.test.ts`, `tests/figures-v2-sprzet-geometria.test.ts`. Pliki do przejęcia przez gałąź grafiki-sprzet (1.1): `lib/figures/v2/draw.ts` (EQUIP, łańcuch `bar`), `lib/figures/v2/scene.ts` (pole `bar` łańcucha), `lib/figures/v2/rigs/{squat,hinge,benchPress}.ts` (`bar: true`), `data/zrodla/figury-sprzet.json`, oba testy.

## 12. Model pracy i bramki jakości grafik (26.10.2026)

Pozy z danych trafiają do aplikacji dopiero po bramkach (geometria, sens ruchu, niezależny przegląd, testy): `docs/53-grafiki-model-pracy.md`. Kontrakt danych ma od 26.10.2026 pole sprzętu `trzyma` (ćwiczenia jednorącz); reguły sensu: `data/zrodla/figury-sens.json` + `scripts/figures/v2-sens.mjs`. Procedura generowania póz w aplikacji Gemini: `docs/52` pkt 7 i 7a.

## 13. Pozy z danych w aplikacji (26.10.2026)

Rodzina z plikiem `lib/figures/v2/poses/<rodzina>.json` (import: `gemini-pozy.mjs --z-pliku`, po bramkach docs/53) jest „gotowa” i działa w sekcji Technika jak rodziny z rigiem — generycznie, bez kodu per rodzina:
rejestr `lib/figures/v2/poseData.ts` (ładowanie leniwe), `figureSpec` buduje wariant z danych, `frameAt` = `keyframeFrame` (ta sama `Frame` co rigi: kształty, mięśnie, tor, kadr, kolidery), błędy z `bledy[]` to błędy `data:<i>` (poza poprawna + delty,
znacznik ✕ z danych), tekst błędu przez `errorText` (słownik wskazówek, a dla id bez zdania — `t()`; dziś `hang.noSwing`). **Nowa rodzina z danymi wymaga trzech wpisów**: `LOAD` i `DATA_UI` (nazwy faz, kierunek pętli, mierzony staw) w `poseData.ts` oraz statusu `ready` w `families.ts`;
test `figures-v2-mapping` i `figures-v2-data` obejmują ją automatycznie. Ćwiczenia rodziny bez wpisu w danych (pull_up: Muscle Up, Rope Climb) nie mają figury v2 (v1 albo brak). Izometrie (`ISOMETRIC`, zgodne z pomiarem czasu w katalogu) rysowane statycznie.
Tor ruchu przy nieruchomym drążku = droga miednicy (`info.trail`). Tempo: faza wysiłku 1 s, powrót 2 s (anim.ts, ACSM 2009 — jak martwy ciąg z podłogi). Pokrycie: docs/51 (kolumna „Z figurą”).

## 14. Punkty styku, znaczki ✓/✕, strzałki toru (26.10.2026, polecenie właściciela; wzór wizualny: jego makieta — poświata strefy styku, znaczki przy wskazówkach, grot toru)

- **Punkty styku liczone z geometrii** (`contacts.ts`, jedna funkcja `contactsOf(klatka)` dla KAŻDEJ rodziny, bez wpisów per ćwiczenie): pięta i palce stopy na podłodze albo wierzchu skrzyni/maty (tolerancja `CONTACT.floor` = 1 cm), głowa, plecy i miednica na ławce/macie/ścianie/skrzyni
  (kolidery tułowia, głowy i miednicy ≤ `CONTACT.surface` = 1,5 cm; głowa 3,5 cm — środek głowy modelu leży na osi tułowia, uproszczenie), dłoń na trzymanym sprzęcie (tolerancja chwytu walidatora). Rysunek: dwie półprzezroczyste elipsy (halo i rdzeń),
  w kolorze „dobrze” (`contactOk` = token `doneLine`) w pozie poprawnej; w widoku błędu styk, który poza poprawna w tej samej pozycji ma, a poza błędu go traci (oderwana pięta, oderwane pośladki), jest rysowany na miejscu styku pozy poprawnej w kolorze „błąd” (`contactBad` = `danger`). Kontrast ≥ 3:1 do tła i karty w czterech paletach — test.
- **Pięć punktów styku w wyciskaniu leżąc** (głowa, barki i górne plecy, pośladki, obie stopy): NSCA Basics 2012, opis ustawienia w wyciskaniu leżąc — dodane jako źródło wskazówki `bp.contact` w `data/zrodla/cues.json` (obok ACE, NASM, Stronger by Science; runtime bez nazw).
  Dla pozostałych rodzin punkty wynikają wyłącznie z geometrii (bez dodatkowych twierdzeń). Ławka ujemna: stopy pod wałkami, nie na podłodze (wyjątek nazwany w `requiredContacts`).
- **Reguła sensu** (docs/53): `requiredContacts(spec)` — styki wymagane w pozie poprawnej (przysiad: obie stopy; wyciskanie: głowa, plecy, pośladki + stopy; zawias: stopa podporowa, drugą poza ćwiczeniami jednonóż; podciąganie: dłonie, przy jednorącz tylko ręka trzymająca);
  test macierzowy sprawdza je w 13 pozycjach dla każdego ćwiczenia z figurą. W danych walidatora: reguła `dlonie_na_drazku` (typ `styk_dlonie`, grupa „styk”, wskazówka `pu.grip`) w `data/zrodla/figury-sens.json` + ewaluator w `v2-sens.mjs` + opis w poleceniu (`gemini-polecenia.mjs`).
- **Znaczki ✓/✕** (`badges.ts`, `ui.badgesFor`): ✓ przy części ciała, której dotyczy wskazówka ćwiczenia (tablica `CUE_ANCHOR`: id wskazówki → część ciała; wskazówka bez wpisu nie ma znaczka), ✕ przy znaczniku błędu w widoku błędu; maks. 3 naraz.
  Znaczek jest przyciskiem (pole dotyku 44 pt, etykieta VoiceOver „Wskazówka: …” / „Częsty błąd: …”); stuknięcie zatrzymuje animację (znaczek się porusza) i pokazuje tekst wskazówki pod rysunkiem.
- **Strzałki toru**: grot na obu końcach toru (koniec u = 1 w stronę pierwszej fazy, początek w stronę powrotu), `TRAIL_ARROW`.
- **Wydajność**: `frameAt` ma pamięć ostatnich 48 klatek (ta sama klatka w kształtach, liniach, stykach i znaczkach to jeden obiekt), styki liczone raz na klatkę (`WeakMap`). Zrzuty przed/po: scratchpad `zrzuty-grafiki/styk/`.
## 13. Rozszerzenie modelu figury: poza@2 (26.10.2026)

Decyzja właściciela (26.10.2026): rozszerzamy model figury tak, żeby prawie cała biblioteka miała animację; ćwiczenia, których nie da się narysować, nie stają się wyjątkami. `figury-v2/poza@2` jest **zgodna wstecz**: dochodzą wyłącznie pola OPCJONALNE (brak pola = 0 = zachowanie jak w poza@1). Rysunek wszystkich gotowych figur, przykładów z rigów i póz z `poses/` jest bajtowo ten sam co przed zmianą (`tests/figures-v2-zgodnosc-wsteczna.test.ts`, wzorzec `tests/fixtures/figury-v2-zlote.json`).

| Pole (klatka / delta) | Znaczenie i znak | Zakres walidatora |
|---|---|---|
| `obrotTulowia` | obrót całego tułowia z miednicą wokół osi długiej; +90° = klatka ku prawej stronie osoby (deska bokiem, Copenhagen) | ±180° (orientacja ciała, nie staw) |
| `skretTulowia` | skręt klatki względem miednicy; + = ku prawej stronie; liczony względem ciała, więc działa w staniu i w leżeniu | ±40° |
| `przechylTulowia` | skłon boczny (sztywny przechył osi tułowia w biodrach); + = głowa ku prawej | ±35° |
| `przechylMiednicy` | przechył miednicy w płaszczyźnie czołowej; + = prawe biodro wyżej; przesuwa tylko biodra | ±15° |
| `przechylGlowy` | skłon boczny głowy względem tułowia; + = ucho ku prawemu barkowi | ±35° |
| `rece.R/L.uniesienieBarkow` | uniesienie (+) / obniżenie (−) barku wzdłuż osi tułowia, cm (szrugsy) | −3…+6 cm |
| `rece.R/L.wysuniecieBarkow` | protrakcja (+) / retrakcja (−) barku wzdłuż przodu klatki, cm | −4…+6 cm |
| `rece.R/L.zgiecieNadgarstka` | zgięcie dłoniowe (+) / wyprost (−); dłoń jest osobnym odcinkiem, chwyt zostaje środkiem dłoni | −65…+75° |
| `rece.R/L.obrotPrzedramienia` | 0 = kciuk w górę, + supinacja, − pronacja; wyznacza płaszczyznę zgięcia nadgarstka (`Arm.palm`) | ±80° |

**Źródła zakresów (26.10.2026, badacz; pełne dane: `data/zrodla/figury-zakresy-poza2.json`, test `tests/zrodla-pelne-zakresy.test.ts`):** skręt tułowia ±40° (poprzednio ±45°) i nadgarstek −65…+75° (poprzednio −70…+80°; ujemny = wyprost) mają po dwa przeczytane źródła (szczebel 3); skłon boczny tułowia ±35°, skłon głowy ±35° i obrót przedramienia ±80° — po jednym; przechył miednicy ±15° i barki w cm to **UPROSZCZENIE ILUSTRACYJNE** (brak norm; **[OTWARTE — badacz]**). Zakres w figurze to granica pozy na rysunku, nie norma pokazywana użytkownikowi; liczby tylko w `EXT_ROM` (`lib/figures/v2/skeleton.ts`, bez nazw źródeł; schemat i opis kontraktu generują się z niego).
Walidator (`validatePose`) sprawdza nowe zakresy w każdej fazie (kod `zakres`, nazwa pola w komunikacie); błędy jako delty deklarują zmiany nowych pól istniejącymi etykietami `dotyczy`: tułów (obrót, skręt, skłon, przechył głowy) = `spine`, przechył miednicy = `pelvis`, uniesienie barku = `shoulder`, nadgarstek i przedramię = `elbow`.
Silnik: osie tułowia w `trunkAxes` (kolejność: obrót ciała → skłon → skręt; przechył miednicy osobno), stawy biodrowe i barki z tych osi, nadgarstek iteracyjnie (chwyt = cel), kolider dłoni osobno od przedramienia przy zgiętym nadgarstku. `jointAngles` zwraca dodatkowo `trunkRoll`, `trunkTwist`, `trunkLean`, `pelvisTilt`, `headTilt`, `shrug`, `protract`, `wristFlex`, `forearmRoll`, a **biodro ma znak** (przeprost = wartość ujemna, próg 2 cm za osią tułowia; wcześniej wyprost czytał się jak zgięcie). Skutek: leżenie na ławce ma biodro ≈ −22° (wyjątek rodziny `bench_press` w teście zakresów: −25°, uproszczenie).
Granice: sprzęt poza osią z (skrzynie po bokach, taśmy podwieszane) — gałąź `grafiki-sprzet` (pole `z` w sprzęcie); poza@2 niczego tam nie zmienia. Reguły sensu czytające nowe pola mają `wymaga: "poza@2"` i typy `stopien_swobody` / `punkt_zakres` (`data/zrodla/figury-sens.json` → `_typy`); ćwiczenie z regułą wymagającą pola, którego kontrakt nie ma, czeka i nie dostaje polecenia.
