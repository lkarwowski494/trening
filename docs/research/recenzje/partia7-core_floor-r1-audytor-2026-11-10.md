# Recenzja niezależna r1 — rodzina core_floor (partia 7, linia 1.1), 10.11.2026

Recenzent: audytor (subagent, partia 7, sesja D). Autor: programista (subagent, partia 7, sesja D). Stan: `figury/partia-7-core_floor` @ f3647df1 (worktree odłączone). Skrót v2 `core_floor` = `23d415649e1f` (`node scripts/zrodla-runtime.mjs --skroty`, policzony samodzielnie). Wpisy: `partia7-core_floor-r1.json`.

**Werdykt rodziny: do poprawy** — 2 × WYSOKIE (Sit Up, Bicycle Crunch). Pozostałe 19 ćwiczeń bez znalezisk blokujących. Wyjście: poprawka obu póz albo wstrzymanie dwóch rysunków (V2_WSTRZYMANE) i wyświetlenie reszty.

## Metoda
- Arkusze `arkusz-slad.mjs` (21 ćwiczeń, widok side, 21 kadrów co 0,05) wygenerowane samodzielnie; `arkusz-nakladka.mjs` dla Cross-Body Crunch, Bird Dog i Toe Touchers.
- Liczby z `frameAt`/`jointAngles`/`shapesAt` (skrypty recenzenta, poza repo): kąty stawów, tor barków i miednicy, najniższy punkt każdej części ciała, odległość dłoni od głowy, linie nakładki.
- Karty i zestawy z `lib/cues/text/pl.json`, `data/zrodla/cues.json`, `lib/figures/v2/cue-sets.json`; reguły z `data/zrodla/figury-sens.json` (core_floor).
- K14: `git diff origin/integracja-1-1...f3647df1 -- tests/`; heurystykę kierunku przeliczyłem na wszystkich plikach `poses/*.json`.
- Testy: `tests/figures-v2-core-floor.test.tsx`, `tests/figures-v2-kierunek-u.test.ts` (`--runInBand`): 95/95 zielone.

## Znaleziska

| # | Klasa | Ćwiczenie | Miara | Realność |
|---|---|---|---|---|
| W1 | WYSOKIE | Sit Up | Karta (`crunch.setup`): „dłonie przy głowie”. Na rysunku ręce leżą wzdłuż ciała i idą ku kolanom. Odległość chwytu od głowy: 89 cm (u = 0), 63 cm (u = 1); dla porównania Crunch ma 14 cm. Źródła kroku (cues.json: catalyst „fingers at the sides of the head”, barbend „hands behind your head”) mówią to samo co karta. | realny — każde otwarcie karty Sit Up |
| W2 | WYSOKIE | Bicycle Crunch | Stopa R stoi na podłodze w każdej klatce (0,0 cm, kolano 129°). Rusza się tylko noga L. Tułów się nie skręca (`twist` 0). Własny research (`docs/research/etap2/wyniki-2026-11-03/wyniki-A.md:12`) uznał wariant ze stopami na podłodze za „inna pozycja nóg, nie uproszczenie”. W `figury-sens.json` nie ma źródła ruchu Bicycle Crunch. Rysunek pokazuje więc inne ćwiczenie (podobne do Cross-Body Crunch). | realny |
| S1 | ŚREDNIE | Superman | W pozycji wyjściowej (u = 0) stopy wiszą 8,3 cm nad podłogą (kostka 16 cm, palce 12,6 cm). Nogi biegną od biodra ukośnie w górę. Karta: „Połóż się na brzuchu, nogi wyprostowane”; opis przybliżenia w generatorze: „stopy grzbietem w dół”. Uniesienie nóg w ruchu wynosi tylko +12 cm ponad ten start. Ruch jest mały (barki +8 cm, dłonie +17 cm), ale mieści się w regułach (≥ 5 cm, ≤ 10 cm). | realny |
| S2 | ŚREDNIE | Reverse Crunch | Kolano zgina się z 90° do 130° (+40°) i jest stawem mierzonym („Kąt na rysunku: kolano”). Według źródła reguły kolana mają stałe ugięcie (`kolana_ku_barkom`: „kolana przy stałym ugięciu”; cues.json rcrunch.hips, ACE #76: „bez zmiany kąta kolan”). Miednica +11 cm, kolano–bark 65 → 45 cm (spełnione). Tekst karty tego nie zabrania, więc to nie WYSOKIE. | realny |
| S3 | ŚREDNIE | Bird Dog (nakładka) | Linie poziome mają 60 cm (bark x 30…90, miednica x −18…42). W u = 1 dłoń jest w x 123 (33 cm za końcem linii), a kostka w x −70 (52 cm za końcem). Linia „dokąd ma sięgnąć” nie dochodzi do kończyny. | realny |
| N1 | NISKIE | Scissor Kick, Lying Leg Raise | Kolano „prostych nóg” zgina się w połowie przejścia: 20,1° przy u = 0,25 (klatki 0/0,5/1 mają ok. 10°) i 20,9° przy u = 0,13. Bierze się to z interpolacji między klatkami. | realny, ledwo widoczne |
| N2 | NISKIE | Alternate Heel Touchers, Scissor Kick | Nazwy i czasy faz: „Unoszenie 1 s” obejmuje uniesienie i sięgnięcie w obie strony, „Opuszczanie 2 s” powrót przez obie strony (najwyższy krok barków 6,4 cm na 0,05). Scissor Kick: dwie fazy „Naprzemiennie” o różnych czasach przy ruchu symetrycznym. | realny, kosmetyczne |
| N3 | NISKIE | Cross-Body Crunch (nakładka) | Łuk `coreCrunchHipLimb` i kąt biodra (58° → 123°) mierzy biodro unoszonej nogi L, a reguła `lopatki_od_podlogi` dotyczy unoszenia barków. | realny |
| N4 | NISKIE | 8 póz z `core_floor-zatwierdzone.json` | Tułów zapada się w podłogę do −3,5 cm. W pozach generatora i innych rodzinach to −2,0 do −2,9 cm. | realny, ledwo widoczne |

Uwagi bez klasy: komentarz w `DATA_UI.core_floor` (poseData.ts) mówi, że Bicycle i Cross-Body to „dwie strony w jednym przebiegu”, a dane rysują jedną stronę. Tytuł testu „wszystkie z generatora” w `figures-v2-core-floor.test.tsx` jest nieścisły: 8 póz pochodzi z pliku zamrożonego.

## Punkty wskazane przez autorów (ocena własna)
- **K14, heurystyka kierunku** (`tests/figures-v2-kierunek-u.test.ts`): warunek „miednica ≤ 12 cm w obu klatkach” zmienia klasyfikację tylko 3 ćwiczeń: Dead Bug (wysiłek → opuszczanie), Tuck Crunch i Cocoons (opuszczanie → wysiłek). Wszystkie trzy zmiany są poprawne. W pozostałych rodzinach nic się nie zmienia (przeliczone na wszystkich plikach póz). Próg pochodzi z danych reguły, nie z póz. **Akceptuję.**
- **Pozy z pliku zamrożonego:** 8 póz (Crunch, Frog, Janda, Oblique, Sit Up, Toe Touchers, Bicycle, Cross-Body) jest bajtowo równych plikowi póz. Wcześniej rodzina była poza zakresem testu odtwarzalności, więc teraz pilnowanie jest mocniejsze, nie słabsze. Wada: zmiana silnika nie przelicza tych póz. To nie znalezisko, ale W1 i W2 są właśnie w tych pozach.
- **Inne poluzowania w tests/:** pominięcie core_floor w pętli kierunku w `figures-v2-data` zastępuje jawny test faz rodziny. Pozostałe zmiany to liczniki (+21; 28 rodzin w TECHNIQUE; 407 w eksporcie) i odcisk Scissor Kick. Złote odciski innych rodzin się nie zmieniły. **Akceptuję.**
- **Scissor Kick (proste nogi):** biodro 44°/11° ↔ 11°/44° (karta 45° ↔ 10°), dolna stopa 6,3 cm nad podłogą, kolana ok. 10° w klatkach kluczowych (N1 między nimi). Zgodne z kartą.
- **Superman:** mały ruch zgodny z kartą („lekko nad podłogę”). Wstrzymanie `cobra.mis` jest dopuszczalne: tekst błędu na karcie, bez animacji. Problem jest w starcie (S1).
- **Reverse Crunch / Leg Pull-In:** uniesienie miednicy jest czytelne (11 i 12 cm, barki 0,0–0,1 cm). W Reverse Crunch dochodzi zgięcie kolan (S2). Leg Pull-In jest poprawny: start z prostych nóg.
- **Bicycle / Cross-Body, jedna strona:** jedna strona to dopuszczalna konwencja, tak samo jak w Dead Bug i Bird Dog („zmień strony”). Dla Cross-Body ruch jest poprawny. Dla Bicycle problemem nie jest jedna strona, tylko stopa na podłodze i brak skrętu (W2).
- **Dead Bug, fazy:** Opuszczanie 2 s → Unoszenie 1 s, przeciwna ręka (R) i noga (L), nie dotykają podłogi (2,8 cm i 25,8 cm). Zgodne z kartą.
- **Nakładka:** wszystkie trzy elementy mają reguły „ustalone” i wskazówki obecne na karcie lub w zestawie (crunch.move: Crunch, Hands Overhead, Toe Touchers, Cross-Body; bd.move: Bird Dog). Uzasadnienia pominięcia w nagłówku są rzeczowe. Uwagi: S3, N3.
- **K15:** nazwy faz Unoszenie, Opuszczanie i Naprzemiennie są w `lib/i18n.en.ts`.

## Zapisy (K9–K12)
- v2 `core_floor`: `liczba` 44 (`assignAll()`), 21 z rysunkiem, 23 bez rysunku. Werdykt „do poprawy” z polem `poprawka`.
- `v1_zastapiona`: Bird Dog, Dead Bug.
- Karty własne bez wpisu „karty”: Bird Dog i Dead Bug — obie „wyswietlana”. Karty Crunch, Sit Up, Scissor Kick, Hollow Hold, Reverse Crunch, Tuck Crunch, Superman i V-Up mają już wpisy. Wada Sit Up dotyczy rysunku, nie treści karty.
- Zestawy ogólne: 10 wpisów, wszystkie „wyswietlana”. Cocoons ma `open` (brak tekstu).
