# Ponowna recenzja ruchu i treści kart: tryb cykliczny marszu (10 ćwiczeń z 3 rodzin), 27.10.2026

Recenzent niezależny (recenzent chód). Nie czytałem README podglądów, komunikatów commitów gałęzi, komentarzy w generatorach `agent-pozy` ani linii stanu agentów.

## Co sprawdziłem

- **Gałąź:** `origin/silnik-chod-cykliczny` @ e3e7620d, w odłączonym worktree `/home/user/wt/rec-chod`, usuniętym po pracy. Za bramkę geometrii przyjmuję tests.yml 40499445415 (zielony, dane koordynatora). Lokalnie nie uruchamiałem jest ani walidatora (pkt 12). Pomiary liczyłem jednym wątkiem.
- **Podglądy:** `podglady-1-1/chod-cykliczny/{carry,sled_throw,strongman}`. Każdy katalog ma `PODGLAD-WAZNY.txt`, `katy-stawow.md` i `manifest.json`. Tabela kątów jest zgodna z moimi liczbami (np. Sled Push: kolano 13,2…129,8°).
- **Render własny: 17 klatek × 2 widoki (bok, przód) × 10 ćwiczeń.** Klatki są co 1/8 połowy, w całej pętli u 0 → 2. Do renderu użyłem `keyframeFrame`, `dataShapes` i `svgDocument` z lib/figures/v2. Pliki leżą w `/tmp/claude-0/rec-chod/png/`.
- **Liczby:**
  - siatka co 1/80 połowy: 161 klatek pętli, a do kontaktów 2 pętle z zawinięciem;
  - mierzyłem stawy, pięty i palce, kontakty (podeszwa < 1,5 cm), przesunięcie kostki względem miednicy w kontakcie oraz `stanceAdvance` i `loopJoinGap` z silnika;
  - linię kąta i fazy karty liczyłem przez `measuredAngle`, `phasesFor` i `angleLineShown` na specyfikacji zbudowanej ręcznie.
  - Skrypty leżą w `/tmp/claude-0/rec-chod/s/`, poza repo.
- **Treść karty:**
  - `cue-sets.json`, `lib/cues/data.json` i `lib/cues/text/pl.json`;
  - `anim.ts`, `figure.ts` i `poseData.ts`, czyli tryb pętli, `walkPhases` i `GAIT_UI`;
  - `ExerciseFigureV2.tsx`, czyli licznik i linia kąta;
  - `lib/i18n.en.ts` („Marsz” → „Walking”).

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 3 | Farmer's Walk (Farmers Handles), Farmer's Walk (trap bar), Suitcase Carry |
| OK z uwagą | 7 | Farmer's Walk, Rickshaw Carry, Overhead Carry (hantle), Double Kettlebell Front Rack Carry, Sled Push, Sled Drag (Harness), Yoke Walk |
| BŁĄD | 0 | — |

**Pierwotny błąd „moonwalk” (p4b nr 2, sled_throw nr 1, strongman nr 1, carry D) jest usunięty we wszystkich 10 ćwiczeniach.** W całej pętli:

- stopa w kontakcie przesuwa się względem miednicy tylko do tyłu. Największy ruch w przód to 0,4–0,7 cm (przetoczenie na palcach przy odbiciu, poniżej progu 2 cm). Cofnięcie w kontakcie wynosi od 37,5 cm (Yoke) do 81,7 cm (sanie);
- w osi z poślizgu nie ma (0 cm);
- styk połówek jest ciągły: `loopJoinGap` = 0 cm, skok przez zawinięcie u 2 → 0 też 0 cm. Największy skok punktu między klatkami 1/80 wynosi 2,6 cm;
- druga połowa to ten sam krok drugą nogą (lustro z). Ręce zostają przy ciężarze tam, gdzie powinny. Suitcase: kettlebell przez całą pętlę w prawej ręce. Sled Push: dłonie na słupkach (79; 88). Sled Drag: ręce pracują naprzemiennie, a ręka idzie przeciwnie do nogi. W u = 0 lewa noga jest z przodu (x +22) i prawa ręka z przodu (x +90). W u = 1 jest odwrotnie, a w u ≈ 0,5 ręce i nogi mijają się.

**Szczelność reguł:** BŁĘDÓW nie ma. Uwaga 1 (lot w Sled Push i Drag) nie jest łapana przez żadną regułę (propozycja niżej).

## Tabela

| Ćwiczenie | Ruch | Treść karty | Werdykt | Szczegóły |
|---|---|---|---|---|
| Farmer's Walk | marsz poprawny: lądowanie na pięcie (u = 0: palce 6 cm), odbicie z palców; miednica 86–94 cm, tułów 0°; obie fazy symetryczne | wskazówki `carry.two`, `carry.walk` i „Plecy proste” zgadzają się z obrazem; „Marsz” bez sekund | OK z uwagą | uwagi 3 i 4 oraz pierwotna A (hantel poprzecznie, ograniczenie silnika, bez zmian) |
| Farmer's Walk (Farmers Handles) | jak wyżej | `carry.noLean`, `carry.walk`; „Marsz” | OK | uwaga 4 wspólna |
| Farmer's Walk (trap bar) | jak wyżej, gryf w dłoniach | jak wyżej | OK | uwaga 4 wspólna |
| Rickshaw Carry | jak wyżej, krok krótszy (±22 cm) | jak wyżej | OK z uwagą | pierwotne przybliżenie ramy rikszy bez zmian |
| Suitcase Carry | ciężar stale w prawej ręce, tułów bez przechyłu, lewa ręka luźno | `carry.one`, `carry.walk`, `carry.noLean`; zgodne | OK | uwaga 4 wspólna |
| Overhead Carry (hantle) | marsz poprawny | jak Handles | OK z uwagą | pierwotna B nadal: chwyt 16 cm przed miednicą, y 199 |
| Double Kettlebell Front Rack Carry | marsz poprawny | jak Handles | OK z uwagą | pierwotna C nadal: chwyt 34 cm przed osią, y 136 |
| Sled Push | marsz na palcach z wysokim kolanem (biodro do 106°, kolano do 130°), tułów pochylony 33° (stały), dłonie na saniach; moonwalk usunięty | wskazówki `sled.lean` i `sled.legs` nie mają tekstu w `pl.json`, więc karta pokazuje 0 wskazówek | OK z uwagą | uwagi 1, 4 i 5 |
| Sled Drag (Harness) | jak Push, ręce przeciwnie do nóg | jak Push | OK z uwagą | uwagi 1, 2, 4 i 5 |
| Yoke Walk | krótki krok (±15–22 cm), miednica stała 86 cm, tułów 3°; moonwalk usunięty | `carry.noLean`, `carry.walk`; zgodne | OK z uwagą | uwagi 3 i 4 |

## OK z uwagą (backlog, nie blokuje)

1. **Sled Push i Sled Drag: faza lotu przy stałej miednicy.** Waga: ŚREDNIE. Realność: realny, bo widać to przy każdym wyświetleniu.
   - Od u ≈ 0,02 do 0,25 każdej połowy (ok. ¼ kroku, ok. 240 ms przy 1 s/krok) obie stopy są nad podłogą. Przy u = 0,125 palce R są na 4,3 cm, a palce L na 6,2 cm. Przy u = 0,188 R ma 9,0 cm, a L 3,5 cm.
   - Miednica stoi w tym czasie na wysokości 79 cm, więc postać na chwilę „wisi” na rączkach sań. Na klatkach 1,125 i 0,125 (`/tmp/claude-0/rec-chod/png/sp.png`) widać obie stopy w powietrzu.
   - Ten stan był już przed trybem cyklicznym (p4b: kontakt L dopiero od u 0,25), a teraz pojawia się w każdym kroku.
   - Przy pchaniu ciężkich sań zwykle zawsze któraś stopa jest na podłodze. Lot jest zrozumiały tylko przy sprincie z saniami, ale wtedy miednica powinna się wznosić i opadać.
   - Propozycja: przednia stopa ląduje przed oderwaniem tylnej, czyli kontakt L od u ≈ 0,0, a nie 0,25.
   - Reguła `marsz_zawsze_podparcie`: w trybie `cykl_lustro` w każdej próbce co najmniej jedna podeszwa < 1,5 cm. Dziś łapałaby tylko sanie: carry i Yoke mają podparcie ciągłe.
   - Pewność: 70%.
2. **Sled Drag: zamach rąk jak w sprincie.** Waga: NISKIE. Zgięcie barku dochodzi do 104,5°, dłoń z przodu jest na wysokości 116 cm, a łokieć stoi stale na ok. 30°. Przy marszu z ciężkimi saniami na szelkach zamach jest zwykle mniejszy. Pewność: 50%.
3. **Yoke Walk: chód na ugiętych nogach i lądowanie na palcach.** Waga: NISKIE.
   - Kolano nogi podporowej ma 31–42° przez większość podparcia.
   - Stopa wykroczna ląduje palcami przed piętą: u = 0,875 palce 1,2 cm, pięta 9,4 cm; u = 0,938 palce 0,8, pięta 4,8.
   - W fazie przenoszenia pięta unosi się do 37 cm, czyli to kopnięcie piętą przy kroku ±15–22 cm.
   - Krótki, „drobiący” krok pod jarzmem jest czytelny, ale ugięcie jest dość głębokie.
   - Farmer's Walk dla porównania: lądowanie na pięcie, kolano podporowe 3–6°.
   - Pewność: 55%.
4. **Linia kąta na karcie ma w marszu mało sensu.** Waga: NISKIE, dotyczy wszystkich 10 ćwiczeń.
   - `GAIT_UI` / `DATA_UI.carry` wybiera kolano jednej strony (prawe, bo przy równym zakresie wygrywa prawa). W animacji wartość zmienia się 2 razy na sekundę: carry 3 → 68°, sanie 13 → 128°, Yoke 31 → 96°.
   - Na rysunku są dwie nogi, a podpis „Kąt na rysunku: zgięcie kolana N°” nie mówi, którego kolana dotyczy.
   - W trybie „Ogranicz ruch” (pozycja u = 1) karta podaje dla Farmer's Walk „zgięcie kolana 54°” (tylna noga przy odbiciu), dla Yoke „31°”, a dla sań „96°”. Użytkownik może to odczytać jako zalecenie „idź na ugiętych kolanach”.
   - Faza „Marsz” bez sekund jest poprawna: jedna faza `untimed`, tłumaczenie „Walking”, bez pauz.
   - Rekomendacja: w trybie cyklicznym ukryć linię kąta (`hideAngle` dla `walk`).
   - Drobiazg w kodzie: `walkPhases` ustawia `ms` = `loopLength` wahadła (4000), a nie `cycleLength` (2000). Przy jednej fazie nie ma to skutku.
5. **Sled Push i Sled Drag: karta bez wskazówek.** Waga: NISKIE, stan sprzed tej gałęzi. Zestaw ma `sled.lean` i `sled.legs`, ale `lib/cues/text/pl.json` nie ma tych kluczy, więc wskazówki są odfiltrowane. Pochylenie tułowia 33–34° i napęd nogami są na obrazie, ale tekst ich nie opisuje.
6. **Uwagi bez nowej treści.**
   - Carry ma bardzo krótkie podparcie obunóż: ok. 2–3% kroku (u 0,99–1,01), podczas gdy w chodzie jest go więcej. Przy 1 s/krok to niezauważalne.
   - Pierwotne uwagi A, B i C z `carry.md` są nadal aktualne, z tymi samymi liczbami.
   - W tej gałęzi wszystkie trzy rodziny mają w `families.ts` status `planned`, a `poseData.ts` ładuje tylko `pull_up`, więc w aplikacji tych figur jeszcze nie widać. Ocena dotyczy stanu po podłączeniu.

## Rodziny gotowe do statusu „zatwierdzona” (ruch)

- **carry:** tak, z uwagami 4 i 6 w backlogu.
- **strongman (Yoke Walk):** tak, z uwagą 3.
- **sled_throw (Sled Push, Sled Drag):** tak, jeśli uwagę 1 przyjąć jako backlog ŚREDNIE. Rekomenduję jednak poprawić lot przed podłączeniem, bo to tania zmiana klatek u 0–0,25.
