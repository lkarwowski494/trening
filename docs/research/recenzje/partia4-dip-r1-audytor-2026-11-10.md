# Recenzja niezależna rodziny v2 `dip` — runda 1 (audytor, 10.11.2026)

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusze ze śladem toru). Stan zamrożony: `figury/partia-4-dip` @ fb8cf48 (baza 47e3715f), czysta kopia robocza recenzji.
Autor rodziny: programista (partia 4). Recenzent: audytor (nie pisał rodziny, nakładki, kart ani zestawów).

## Werdykt

| Wpis | Werdykt |
|---|---|
| v2 `dip` (5 ćwiczeń, 0 bez rysunku) | **do poprawy** (W1, W2) |
| karta Chest Dip | wyswietlana |
| karta Triceps Dips (ławka) | wyswietlana (treść karty poprawna; rozjazd z rysunkiem to W1 po stronie rysunku) |
| zestaw Triceps Dip | wyswietlana |
| zestaw Ring Dips | wyswietlana |
| zestaw Dip Machine | **do poprawy** (W3) |
| v1 Triceps Dips (ławka) | zastapiona (wpis przenieść razem z v2 „wyswietlana” po r2) |

## Znaleziska

| ID | Klasa | Pewność | Gdzie | Opis i miara (do testu odtwarzającego) | Realność |
|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | Triceps Dips (ławka), rzut z przodu, wszystkie 21 kadrów | Dłonie obok ławki, nie na niej. Karta: „Oprzyj dłonie o krawędź ławki za sobą”. Chwyt `z = ±22` cm (`poses/dip.json`, rece.chwyt), ławka bez pola `w` → szerokość 30 cm (`draw.ts:22` benchW, `colliders.ts:77`), czyli krawędź w `z = ±15`. Środek dłoni 7,0 cm poza krawędzią, cała dłoń (GIRTH.hand 3,6) 3,4 cm poza ławką — podpór w powietrzu. Test: w każdym u `abs(grip.z) + GIRTH.hand ≤ szerokość/2` i `grip.y − seatTop ≈ GIRTH.hand ± 1 cm`. Poprawka: chwyt `z ≤ ±11` (dłonie przy biodrach, ok. 16 cm za miednicą — bez kolizji) albo ławka z `w` obejmującym dłonie. | realny (każde otwarcie rzutu z przodu) |
| W2 | WYSOKIE | 95% | Dip Machine, rzut z przodu i z boku | Jedna dźwignia (`dzwignia`, `trzyma: "R"`), lewa dłoń pcha powietrze. Ćwiczenie oburęczne. Odległość lewego chwytu od najbliższego przyrządu ≈ 44 cm w każdym kadrze (chwyt L `z = −22`, koniec jedynej dźwigni `z = +22`). Wzór poprawny w rodzinie ready: Machine Lateral Raise / Reverse Pec Deck (`poses/delt_raise.json`: dwie dźwignie R i L). Test: w ćwiczeniu z dźwignią w trybie „dlonie” każda dłoń ≤ 1 cm od końca jakiejś dźwigni (albo `trzyma: "obie"`). | realny |
| W3 | WYSOKIE | 90% | zestaw ogólny Dip Machine (`cue-sets.json`, f = dip) | Zdania zestawu przeczą rysunkowi siedzącej maszyny: bdip.move „Opuść się, zginając łokcie … wypchnij się do wyprostu” — miednica nie rusza się (przesunięcie 0,0 cm, u 0→1); bdip.range „w dół do lekkiego rozciągnięcia, w górę do wyprostu rąk” — na rysunku wyprost (łokieć 21,3°) jest na DOLE (chwyt y = 34,7 cm), zgięcie (89,8°) na górze (y = 60,2 cm). Wpis „zestawy” do poprawy; poprawka po stronie badacza: osobny zestaw dla maszyny albo `CUE_NOT_IN_FAMILY`/`CUE_REQUIRES` (`lib/figures/v2/cueSets.ts`). Bez wpisu element dipElbowLimb się nie rysuje, tekst zestawu nie pokazuje się (stan dziś). | realny (po wpisie „wyswietlana”) |
| Ś1 | ŚREDNIE | 90% | Chest Dip, Triceps Dip, rzut z przodu | Poręcze niewidoczne: przekrój poręczy to koło r = 1,75 cm na warstwie `backEquip` (`draw.ts:317-320`) pod dłonią (r 3,6) — 0 px widać; postać „wisi” 80 cm nad podłogą bez podpory. Końce poręczy (x1 = +30) są bliżej widza niż dłoń (x = 0), więc powinny leżeć przed dłonią. Kod wspólny (draw.ts); dziś jedyna rodzina ready z `poreczy`. | realny, czytelność — backlog |
| N1 | NISKIE | 90% | `tests/figures-v2-nakladka-dip.test.tsx` (test „element wynika ze zdania bdip.*”) | Asercja `cueIdsOf(k)` zawiera bdip.* tylko dla ławki zmieni się po wpisach „zestawy” Triceps Dip i Ring Dips — przepisujący poprawia test w tym samym commicie. | pewne przy przeniesieniu wpisów |

## Sprawdzone bez znalezisk

- **K4/ślad**: 10 arkuszy `arkusz-slad.mjs` (5 ćwiczeń × side, front), pełna rozdzielczość. Ślad: bez ciężaru — miednica, pion (Chest Dip 18,5 cm, Triceps Dip 20,4, Ring Dips 17,8, ławka 16,7); Dip Machine — chwyt R, łuk dźwigni (promień stały 75,4 cm w każdym kadrze, odległość śladu od chwytu 0).
- **K7**: `checkFrame` + `holdChecks` w 21 kadrach × 5 ćwiczeń — 0 problemów; dłonie na poręczach i kółkach (błąd 0,00 cm); dłoń maszyny przy siedzisku 3,4 cm odstępu.
- **K8 / reguła `zakres`** (min_max 80°, max_min 25°): góra/dół łokcia — Chest Dip 12,5°/95,2°, Triceps Dip 12,0°/95,0°, Ring Dips 12,5°/92,8°, ławka 15,3°/85,6°, Dip Machine 21,3°/89,8°; zgodne z „mniej więcej kąt prosty” i „do wyprostu” bez blokowania.
- **Tułów**: Triceps Dip 4° (pion — akcent na triceps), Chest Dip 28°→34° w przód (karta „Pochyl tułów lekko w przód”, błąd „Za mocne pochylenie” — kierunkowo zgodne, liczby karta nie podaje), Ring Dips 24°, ławka ok. 8° w tył (w przedziale tulow_pion −10…25°). Nogi zgięte ok. 95°, stopy nad podłogą (Chest Dip: „stopy nad podłogą” ✓).
- **K6**: poręcze wzdłuż osi x, taśmy kółek z kotwic z = ±49 do kółek z = ±28 (zbieżne do dołu, typowe), dźwignia — oś obrotu za oparciem.
- **Fazy (K15)**: Opuszczanie 2 s / Podnoszenie 1 s; Dip Machine Wypychanie 1 s / Powrót 2 s (`poseData.ts`, wyjątek z nazwami faz); błędy animowane: brak (`grupy_bledow` puste, mis.jerk bez animacji z powodem).
- **Nakładka** (`overlay/dip.ts`): jedna reguła „ustalone” (`zakres`), cue = bdip.move/bdip.range ∈ `wskazowki_na_reguly`, tylko rzut z boku; arkusz `arkusz-nakladka.mjs` ławki — linia przez ramię i łuk zgodne z kątem (15°→86°). Odrzucenie `tulow_pion` uzasadnione (bdip.move nie mówi o tułowiu, brak klucza). Chest Dip bez elementu — słusznie (dip.move bez przypisania reguły).
- **Karty (K11)**: Chest Dip (dip.setup/move/chestLean, plank.brace, 3 błędy) — zgodna z rysunkiem; Triceps Dips (ławka) (bdip.setup/move/easier/range) — zgodna poza W1 (rysunek).
- **Zestawy (K12)**: Triceps Dip i Ring Dips — oba zdania pasują do ruchu na rysunku; mis.jerk tylko tekst.
- **K14** (`git diff 47e3715f..fb8cf48 -- tests/`): bez nieuzasadnionych poluzowań. figures-v2-data — pętla ogólna wyłącza dip, zastąpiona osobnym testem (fazy, staw, progi z reguły 80°/25°, nie z danych); mapping/strona-eksport/gemini/regresja nakładek — liczby zgodne z włączeniem 5 ćwiczeń; generator — `dip` dopisany do W_ZAKRESIE (zaostrzenie). Luka K5: brak testu „dłoń na podporze” (W1) i „każda dłoń na dźwigni” (W2) — testy odtwarzające z miar wyżej.
- **K9**: `liczba` = 5 (assignAll, `recenzja-szkielet.mjs dip`), bez_rysunku = [].

Skróty (`zrodla-runtime.mjs --skroty`, kopia recenzji @ fb8cf48): v2 dip 830575734450; karty Chest Dip 58bc2ad0a6ce, Triceps Dips (ławka) 457bb9d115cb; zestawy Triceps Dip / Ring Dips / Dip Machine 90516c549650; v1 Triceps Dips (ławka) 0e72ab5e0fbf.
