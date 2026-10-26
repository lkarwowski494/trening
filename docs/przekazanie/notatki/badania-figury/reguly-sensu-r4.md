# Reguły sensu ruchu — runda 4, partia 1 (badacz, 26.10.2026)

Dane: `reguly-sensu-r4-patch.json` obok. To JSON Merge Patch (RFC 7386) do `data/zrodla/figury-sens.json` z gałęzi `gemini-polecenia` (c472269, worktree `scratchpad/wt-polecenia` = origin).
Nie miałem powłoki, więc niczego nie uruchamiałem (ani `pokrycie-sensu.mjs`, ani walidatora). Liczby pokrycia policzyłem ręcznie z `docs/51` i `cue-sets.json`.

## Zakres — różnica względem zlecenia

Zlecenie wymienia „ok. 37 rodzin bez reguł, w tym mobility, olympic, plyo, curl, triceps, delt_raise, lunge, row, overhead_press, chest_fly”. W c472269 te rodziny (poza mobility) mają już reguły z r1–r3: w danych jest 17 rodzin. Bez reguł zostało **26 rodzin, 281 ćwiczeń**.
- Partia 1 (ten plik): **24 rodziny, 223 ćwiczenia.** Reguły ma 137 z nich, 86 ma jawne `otwarte` z powodem.
- Partia 2: **mobility_stand i mobility_floor (58)**. Wskazówki `st.*`/`dyn.*` mówią o tempie i napięciu, nie o geometrii, więc każde rozciąganie potrzebuje własnego źródła pozycji (wniosek z r1). Do tego otwarte z partii 1: foam_roll (11), szyja z talerzem (3), ćwiczenia z zestawem „open”.
- Pokrycie po partii 1 (szacunek ręczny): ok. 537/709 ćwiczeń z regułami (r2: 400). Do potwierdzenia przez `node scripts/figures/pokrycie-sensu.mjs`.

## Zadanie B — rozstrzygnięcia

### B1. Incline Bench Press (hantle): przedramię 12,3 cm przy limicie 10 cm
**To nie jest sprzeczność źródeł. Próg zostaje, poprawić trzeba rig.**
- NSCA Basics, s. 54–55 (Dumbbell Incline Bench Press): opuszczaj hantle, trzymając dłonie nad barkami, do poziomu klatki; ramiona ok. 45° do tułowia. Najczęstszy błąd według NSCA: „letting the dumbbells and hands go wider than the elbows (i.e., the forearms should not go wider than perpendicular to the ground)”. Na s. 54: „Wrists should be in line with elbows, and forearms perpendicular to the ground”.
- SBS How to Bench, Biomechanics → Elbow Extension (przeczytane w r2): ciężar ma być mniej więcej nad łokciem.
- Rachunek na `BODY` (ramię 31 cm, przedramię z dłonią 33 cm, ławka 30°). Przyjąłem przedramię pionowe i chwyt ok. 10 cm od barków wzdłuż tułowia, ok. 13 cm nad jego osią. Wtedy łokieć leży ok. 26 cm pod barkiem, a kąt ramię–tułów wynosi 32–49°. Oba warunki są spełnione jednocześnie: odchyłka ≤ 10 cm i odwiedzenie ≤ 75°.
- Skąd 12,3 cm w rigu (wniosek z `benchPress.ts` i `variants.ts`):
  - `touch: 38` stawia hantle 12 cm od barków, a NSCA każe opuszczać je do górnej części klatki.
  - Biegun łokcia `[0, −1, 0,222]` ściąga łokieć pionowo w dół (świat), a nie pod chwyt.
  - `grip: 26` przy `flare: 0,222` daje dłonie szerzej niż łokcie, czyli dokładnie błąd opisany przez NSCA.
- Propozycja dla rigu: `touch` ok. 40–41 i biegun łokcia ustawiony tak, żeby łokieć był pod chwytem. Liczba 10 cm to konwencja (≈ 20° odchylenia przedramienia od pionu).
- Kandydat na nową regułę (nie wdrażam): „chwyt nie szerzej niż łokieć” w osi z, z NSCA s. 55. To jedna organizacja, więc najpierw drugie źródło.

### B2. RDL, Stiff-Legged, Single Leg RDL, Cable Pull Through
**Progi zostają (biodro ≥ 60°, kolano ≤ 45°, zakres biodra ≥ 1,5 × zakres kolana). Jedna sprzeczność to błąd definicji, dwie to błędy rigów.**
- **Spójność progów:** średnie z pomiaru Lee i in. 2018 (PMC6323186, Table 3) spełniają wszystkie trzy warunki naraz. Biodro 80° ≥ 60°, kolano 34° ≤ 45°, stosunek 80/34 ≈ 2,4 ≥ 1,5. Progi nie wykluczają się wzajemnie.
- **Single Leg RDL (biodro 44°) — błąd definicji w danych (mój z r3).** `zawias_biodrowy` z `noga: "srednia"` uśrednia obie nogi.
  - `jointAngles().hip` liczy kąt barki–biodro–kolano, więc noga wolna wyprostowana w linii tułowia ma ≈ 0°. Średnia to połowa kąta nogi podporowej (44 ≈ 88/2).
  - Naprawa: nowe reguły `zawias_w_biodrach_jednonoz` i `kolana_lekko_ugiete_jednonoz` z `noga: "podporowa"` (parametr już obsługiwany przez ewaluator).
  - Źródło ruchu: Kim, Jeon, Eom 2026, Sci Rep 16:27481 (PMC13534463), Methods: „bring the torso to a position as close to horizontal as possible”. Do tego ACE #127: „Keep the left knee slightly bent and the back straight while leaning forward on the left hip.”
  - **Do potwierdzenia przez programistę:** kąt biodra samej nogi podporowej w rigu (oczekuję ok. 85–90°).
- **Cable Pull Through (biodro 56°, zakres kolana 41,5°) — rig.**
  - Dicus i in. 2023, Int J Exerc Sci 16(4):12–22 (PMC10124728), Introduction, zalicza pull-through do zawiasów na prostych nogach razem z RDL. Takie zawiasy „tend to keep the knee in a 'soft' (i.e., slightly flexed, but consistent) position”.
  - Zakres kolana 41,5° to ruch prowadzony kolanem, czyli raczej przysiad.
  - Rig: kolano stałe ok. 15–25°, biodro na dole ≥ 70°.
- **Stiff-Legged (kolano 48,5°) — rig.** Odmiana „na prostych nogach” nie może mieć kolana bardziej zgiętego niż RDL (średnia + 1 SD = 46,5°). Rig: kolano ok. 20–30°.
  - Pomiaru kąta kolana w tej odmianie nie znalazłem. Morse i in. 2013 (ISBS, Bridgewater State) podaje tylko tabelę kręgosłupa — przeczytałem całość.
- Ocena realności: wszystkie trzy przypadki są **realne** dla potoku grafik (gotowe figury nie przechodzą bramki 3). Danych użytkownika nie dotyczą.

## Zadanie A — reguły per rodzina (skrót; pełne dane w łatce)

Każde ćwiczenie ma jawny wpis w `warianty`. Pola `zrodlo`, `liczba` i `pewnosc` są przy każdej regule.

| Rodzina | Ćw. | Z regułami | Otwarte | Reguły (typ) | Pewność kierunku |
|---|---|---|---|---|---|
| hip_bridge | 11 | 10 | 1 | miednica w górę (`miednica_unosi_sie`), linia barki–biodra–kolana na górze (`miednica_na_linii`), plecy bez łuku (`kregoslup_neutralny`), pięty (`piety_na_podlodze`) | ustalone (ACE #49, NASM Floor Bridge — przeczytane) |
| calf_raise | 13 | 12 | 1 | wspięcie: kostka ≤ −15° (`potrojny_wyprost`), kolana proste / zgięte w siadzie | ustalone (cues.json: ExRx, ACE #51/#73, NASM) |
| leg_isolation | 14 | 12 | 2 | zakres kolana (**nowy** `kolano_zakres_ruch`), biodra nieruchome, nordic: biodra proste | ustalone (cues.json; badania PMC) |
| back_extension | 4 | 4 | 0 | zgięcie w biodrach ≥ 70°, wyprost, plecy neutralne | ustalone (pmc-8057707, pmc-11964695) |
| core_hang | 4 | 3 | 1 | ręce proste, kolana do klatki, nogi uniesione, kolana lekko ugięte | jedno źródło (ISSA) + konwencja |
| dip | 5 | 5 | 0 | zakres łokcia ≥ 80° / ≤ 25°, tułów pionowo (ławka) | ustalone (NASM Bench Dips, Catalyst #546 — przeczytane) |
| chest_press_machine | 5 | 5 | 0 | zakres łokcia, plecy przy oparciu, start przy barkach, nad głowę | ustalone (cues.json) |
| cable_press | 4 | 4 | 0 | zakres łokcia, tułów stabilny, ławka | ustalone / analogia |
| thruster | 3 | 3 | 0 | przysiad, kolana, pięty, nad głowę; Clean and Press — plecy i tor | analogia (squat, ohp, olympic) |
| kb_ballistic | 17 | 16 | 1 | swing: zawias i wyprost (pomiar Van Gelder 2015), plecy, ręka na wysokość; clean / snatch / jerk — analogia olympic | kierunek ustalony + jedno źródło pomiarowe |
| core_standing | 19 | 1 | 18 | Pallof: tułów nieruchomy, wypchnięcie, wysokość chwytu | ustalone; reszta — KONTRAKT |
| carry | 7 | 7 | 0 | tułów pionowo, ręce proste przy biodrach / nad głową / przy barkach | ustalone (ACE #359, NSCA Coach 7-3, NASM) |
| rotator_cuff | 8 | 7 | 1 | łokieć przy boku, stały kąt, dłoń w bok; band pull apart — analogia delt_raise | ustalone (ACE #352, ISSA) |
| forearm | 12 | 1 | 11 | Reverse Plate Curls = reguły curl | reszta — KONTRAKT |
| glute_floor | 7 | 7 | 0 | plecy bez łuku, noga do linii tułowia, rozstaw kolan (**nowy** `rozstaw_zakres`) | jedno źródło + analogia / konwencja |
| hip_abd_add | 8 | 7 | 1 | rozstaw kostek / kolan (**nowy**), tułów stoi, półprzysiad w marszu z gumą | ustalone (słownik: ACE, ISSA, NHS) |
| leg_machine | 8 | 8 | 0 | zakres kolana, kolana w linii stóp, miednica stała, pięty; łydki na suwnicy | ustalone (ACE #154, NASM, ExRx) |
| kneeling_hinge | 2 | 1 | 1 | plecy, pochylenie ≥ 30° | analogia |
| cardio | 16 | 13 | 3 | wioślarz (5 reguł, Concept2 — przeczytane), rower: kolano 10–45°, chód wyprostowany, burpee: wyprost, podskoki: lot | ustalone / definicja / konwencja |
| sled_throw | 19 | 9 | 10 | sanki: pochylenie i plecy, rzuty: potrójny wyprost, slam, TGU, wall ball | ustalone / konwencja |
| strongman | 10 | 2 | 8 | Jefferson Squat: plecy i kolana; Yoke Walk: tułów | analogia |
| shrug | 8 | 0 | 8 | — | KONTRAKT |
| neck | 8 | 0 | 8 | — (3 błędnie przypisane, niżej) | — |
| foam_roll | 11 | 0 | 11 | — | partia 2 |

## Dwa nowe typy reguł (definicje w `_typy`)

1. **`kolano_zakres_ruch`** `{nogi: "obie" | "co_najmniej_jedna", min_max_deg?, max_min_deg?, min_min_deg?}` — kąt kolana każdej nogi w ruchu.
   - Potrzebny, bo `kolano_biodro_zakres` i `ugiecie_kolan_zakres` liczą średnią obu nóg. W odmianach jednonóż noga wolna fałszuje średnią — to ten sam błąd co w B2.
   - Szkic ewaluatora: dla R i L `r = zakres(p.map(s => v2.jointAngles(s.f.sk, side).knee))`. `ok = (min_max ⇒ r.max ≥ min_max) ∧ (max_min ⇒ r.min ≤ max_min) ∧ (min_min ⇒ r.min ≥ min_min)`. Dla „obie”: every, inaczej some.
2. **`rozstaw_zakres`** `{punkt: "kostki" | "kolana", min_cm}` — rozpiętość odległości 3D między lewym a prawym punktem w ruchu. Odpowiednik `dlonie_zblizaja_sie` dla nóg.

**L-036 — co sprawdziłem i czego nie.** W 24 rodzinach nie ma żadnej pozy (rig ani odpowiedź Gemini), więc sprawdzenia na prawdziwej pozie nie da się zrobić przed pierwszą pozą rodziny. Zrobiłem rachunek na parametrach gotowego rigu `squat` (nie uruchomiony):
- Back Squat (kolano 0 → ok. 115°): `kolano_zakres_ruch {obie, 80, 15}` przechodzi.
- Przysiad z głębokością 60°: nie przechodzi (max 60 < 80).
- `rozstaw_zakres {kostki, 15}` na przysiadzie (stopy stoją): nie przechodzi, co jest poprawne — przysiad to nie odwodzenie.

**Warunek wdrożenia:** test „poza poprawna przechodzi / poza z błędem łamie tylko swoją grupę” na pierwszej pozie każdej rodziny, zanim reguły rodziny trafią do bramki blokującej. Do tego czasu wyniki tych dwóch typów traktować jako ostrzeżenie.

## Znaleziska przy okazji (dla programisty i koordynatora)

1. **Ograniczenia kontraktu (szkielet v2).** PoseIn ma tylko pochylenie tułowia w płaszczyźnie strzałkowej i zgięcie kręgosłupa. Nie ma:
   - skrętu ani skłonu bocznego tułowia,
   - przechyłu miednicy,
   - uniesienia barków,
   - stawu nadgarstka i obrotu przedramienia.

   Dlatego **ok. 45 ćwiczeń jest OTWARTE z powodu kontraktu, nie źródeł**: rotacje i skłony boczne (16), szrugsy (8), nadgarstek (10), skłon boczny głowy, „nie przechylaj miednicy / tułowia” w odwodzeniu i noszeniu.

   **Decyzja produktowa dla właściciela:**
   - (A) rozszerzyć kontrakt o skręt i skłon boczny tułowia oraz uniesienie barków — więcej pracy w silniku i poleceniu;
   - (B) zostawić te ćwiczenia bez grafiki v2 (jawne wyjątki).

   Rekomendacja: B na wydanie 1.1, A do backlogu z priorytetem dla rotacji (16 ćwiczeń core).
2. **Błędne przypisanie rodziny (realny).** `Push Press - Behind the Neck`, `Standing Barbell Press Behind Neck` i `Wide-Grip Pulldown Behind The Neck` trafiają do `neck` przez słowo „neck” w nazwie. Propozycja: dopisać do `OVERRIDES` → `overhead_press`, `overhead_press`, `pulldown`. Źródło ruchu dla wyciskania zza karku: NSCA Basics s. 42.
3. **`jointAngles().hip` nie ma znaku** (opis w `_typy._uwaga_r4_biodro_bez_znaku`). Przeprost biodra czyta się jak zgięcie:
   - progi „biodro ≤ X” po wyproście dostały zapas (swing: 25°);
   - wymachu nogi w tył (kickbacki) nie da się dziś sprawdzić.
   - Propozycja: kąt ze znakiem względem `sk.front`.
4. **olympic.wyprost_bioder_kolan (dane r2, lokalne).** Parametr nazywa się `strony: "obie"`, a ewaluator `potrojny_wyprost` czyta `nogi`. Reguła działa więc jako „co najmniej jedna noga”, słabiej niż zamierzono. Nie zmieniam tego w łatce, bo zaostrzenie może zmienić wynik gotowych póz. Programista: zmienić na `nogi: "obie"` po sprawdzeniu na pozach olympic.
5. **Ręka pracująca w odmianach jednorącz** (powtórzenie `_typy._strony_pracujace`). Dotyczy nowych rodzin: kb_ballistic (5 ćw.), cable_press (1), TGU, rotator_cuff (jednorącz). Bez `sprzet.trzyma` wolna ręka trafi do reguł rąk.

## Źródła przeczytane w tej rundzie (26.10.2026)

| # | Źródło | Szczebel | Miejsce i cytat (≤ 2 zdania) | Do czego |
|---|---|---|---|---|
| Z27 | Kim J, Jeon Y, Eom K. Biomechanical analysis of single leg deadlift under the effect of instability. Sci Rep 2026;16:27481. https://pmc.ncbi.nlm.nih.gov/articles/PMC13534463/ | 3 | Methods → Design and procedures: „bring the torso to a position as close to horizontal as possible” | B2, SL RDL (bezwzględnych kątów nie podaje — tylko różnice ROM) |
| Z28 | ACE #127 Single-Arm Single-Leg Romanian Dead-Lift. https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/ | 4 | Krok 2: „Keep the left knee slightly bent and the back straight while leaning forward on the left hip.” | B2, SL RDL |
| Z29 | Dicus JR i in. A Comparison of Muscle Recruitment Across Three Straight-Legged, Hinge-Pattern Resistance Training Exercises. Int J Exerc Sci 2023;16(4):12–22. https://pmc.ncbi.nlm.nih.gov/articles/PMC10124728/ | 3 | Introduction: zawiasy na prostych nogach „tend to keep the knee in a 'soft' (i.e., slightly flexed, but consistent) position”; przykłady: RDL, reverse hyperextension, cable pull-through | B2, Pull Through, Stiff-Legged, Reverse Hyper |
| Z30 | Morse J, Wu T, Russell PJ, Jillson N. The Effects of Load Mass on the Kinematics of Stiff-Legged Deadlift. ISBS 2013. https://ojs.ub.uni-konstanz.de/cpa/article/view/5699 | 3 | Table 1: tylko kąt kręgosłupa; kątów kolana brak | B2 — negatywne (brak liczby) |
| Z31 | NSCA Basics of Strength and Conditioning Manual (wyciąg `scratchpad/zrodla/nsca-basics.txt`), s. 54–55 | 4 | DB Incline: „The most common error is letting the dumbbells and hands go wider than the elbows…”; upper arms 45° to the torso | B1 |
| Z32 | ACE #49 Glute Bridge. https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/ | 4 | Krok 2: „press your hips upwards off the floor into extension”; „Avoid pushing your hips too high as this generally increases the amount of hyperextension (arching) in your low back.” | hip_bridge |
| Z33 | NASM Floor Bridge. https://www.nasm.org/resource-center/exercise-library/floor-bridge | 4 | Krok 3: „Drive through your feet to lift your hips toward the ceiling, creating a straight line from your knees through hips to shoulders.” | hip_bridge |
| Z34 | NASM Bench Dips. https://www.nasm.org/resource-center/exercise-library/bench-dips | 4 | Krok 3: „descending until your elbows bend to approximately 90 degrees”; Common Mistakes: „Excessive forward lean…” | dip |
| Z35 | Catalyst Athletics #546 Bench Dip. https://catalystathletics.com/exercise/546/Bench-Dip | 4 | „Keeping your trunk upright, lower yourself as far as possible, then press back up to the top.” | dip |
| Z36 | ISSA, 5 Best Exercises to Include in Your Core Workout. https://www.issaonline.com/blogs/training-tips/5-best-exercises-to-include-in-your-core-workout | 4 | Hanging Leg Raises: „Keeping the ribcage down and the knees slightly bent”; „The height of the legs can vary for each individual but can be as high as possible while still maintaining proper form.” | core_hang |
| Z37 | Van Gelder LH i in. Int J Sports Phys Ther 2015;10(6):811–826. https://pmc.ncbi.nlm.nih.gov/articles/PMC4637916/ | 3 | Results → Descriptive Analysis of Hip Flexion and Extension ROM: zgięcie biodra 85,4 ± 9,0° (oburącz), wyprost −9,7 ± 7,8° | kb_ballistic (swing) |
| Z38 | Concept2, Indoor Rowing Technique. https://www.concept2.com/indoor-rowers/training/technique | 4 (producent) | The Catch: „Shins are vertical, or as close to vertical as is comfortable for you.”; The Finish: „Legs are extended.” | cardio (wioślarz) |

Pozostałe źródła reguł (ExRx, NASM, ACE #51/#73/#153/#154/#186/#188/#294/#332/#352/#358/#359/#388/#391, ISSA, NHS, Eleiko, Mullane 2021, PMC: 8057707, 11964695, 9528903, 13517625, 10753835, 9517252, 4887549, 5473370, 12286126; van der Horst 2015) mają miejsca w `cues.json` albo w słowniku badacza (`wskazowki-slownik*.json`, `wskazowki-cwiczenia-08-korekty.json`). Dziś nie czytałem ich ponownie — w JSON oznaczone „cues.json” lub „słownik badacza”.

Odrzucone jako źródło (szczebel 5, tylko identyfikacja ruchu): opisy pull-through i single-leg deadlift w serwisach komercyjnych. Nie przeczytane:
- ExRx CBPullThrough (403, archiwum niedostępne dla narzędzia);
- PDF Dicus i in. z digitalcommons (403) — przeczytany tekst z PMC.

## Otwarte pytania

1. **[OTWARTE — właściciel, produkt]** Kontrakt v2 bez skrętu i skłonu tułowia, przechyłu miednicy, uniesienia barków i nadgarstka (znalezisko 1). Opcje A i B są wyżej; rekomendacja: B teraz, A do backlogu.
2. **[OTWARTE — koordynator]** Partia 2: mobility (58) i foam_roll (11). Każde rozciąganie potrzebuje źródła opisu pozycji (np. ACE/NASM dla danego rozciągania). Alternatywa: przyjąć `izometryczne_kandydaci` z r3 i regułę „poza nieruchoma” (`szkielet_nieruchomy` ze wskazówki st.noBounce: ACE #212, NASM) — tania, ale sprawdza tylko bezruch, nie pozycję. Rekomendacja: źródła pozycji dla rozciągań statycznych (ok. 30) i OTWARTE dla dynamicznych bez opisu.
3. **[OTWARTE]** Bujanie w zwisie (hang.noSwing), wymach nogi w tył (kickbacki), lądowanie w niskich podskokach (skakanka, skipy), położenie stopy w biegu — brak miary albo brak progu w źródłach.
4. **[OTWARTE]** Pomiar kąta kolana w martwym ciągu na prostych nogach, w pull-through i w swingu (Van Gelder nie podaje kolan). Stosunek 1,5 w zawiasach pozostaje konwencją.
5. **[OTWARTE]** Wyciskanie hantli na skosie — reguła „dłonie nie szerzej niż łokcie” (NSCA) czeka na drugie źródło.
6. Wszystkie progi w cm i stopniach to uproszczenia rysunku albo konwencje; aplikacja ich nie podaje jako faktu (docs/53). Zmiana progu tylko w JSON, z dopiskiem w `liczba`.
