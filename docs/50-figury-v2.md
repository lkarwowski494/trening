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

## 9. Podłączenie do aplikacji (nie zrobione w etapie 1)

`ExerciseFigureV2` jest gotowy i przetestowany, ale **nie zastępuje jeszcze `ExerciseFigure`** w `components/ExerciseCues.tsx` (zmiana widoczna w E2E, nowe teksty w sekcji Technika, scenariusze Maestro). Proponowany układ:
v2 dla ćwiczeń z gotową rodziną, v1 jako rezerwa dla 71 dotychczasowych figur do czasu gotowości wszystkich rodzin; dopisek `generalCueNote` i lista wskazówek z `cueSelection` w tej samej sekcji.
Przy podłączeniu: krok E2E (nowy ekran/przepływ → `tests/przeplywy.json`), zrzuty w obu motywach, sprawdzenie listy „tylko telefon” (płynność animacji).
