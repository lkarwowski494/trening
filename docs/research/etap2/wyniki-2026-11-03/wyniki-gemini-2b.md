# Weryfikacja Gemini research 2 — ćwiczenia 11–20 (03.11.2026)

Wejście: `gemini/research-2.txt`, linie 224–445. Reguła: etap 2 (CLAUDE.md, „Merytoryczne podstawy”) — ustawienie
i przebieg ruchu z 2 niezależnych źródeł szczebla 5 („praktyka”); „czego unikać” może być wnioskiem z ruchu;
liczby i zdrowie pominięte. Strony aplikacji treningowych = szczebel 5 (właściciel 03.11.2026, `docs/18-przekazanie.md:201`, wariant A);
nazwy firm tylko w tym pliku, nigdy w tekstach pl/en. Wszystkie źródła = szczebel 5 → pozycje „otwarte” do recenzji
niezależnej (L-047), nie „gotowe”. Szczegóły, adresy, cytaty: `wyniki-gemini-2b.json`.

## Wynik

| # | Ćwiczenie | Stan | Źródła pary |
|---|---|---|---|
| 11 | Isometric Wipers | komplet | Fitness Volt (Dr. Malik) + WeightTraining.guide (E. Lord; spoza Gemini) |
| 12 | Janda Sit-Up | komplet (źródła zastępcze) | Fitness Volt (M. Magnante) + Breaking Muscle (C. Marker); wszystkie adresy Gemini martwe |
| 13 | Jefferson Squat | komplet (+3 błędy) | Fitness Volt, WeightTraining.guide, BOXROX |
| 14 | Keg Load | 1 źródło | Bearly Fit (lustro pages.dev); [OTWARTE] wariant katalogu (wyścig z noszeniem?) |
| 15 | Kettlebell Halo with Overhead Extension | setup + krążenie komplet; wyprost nad głową 1 źródło | Iron and Oven + SET FOR SET (sam halo) |
| 16 | Kettlebell Pirate Ships | 1 źródło | Lift Manual |
| 17 | Kettlebell Sumo High Pull | komplet | Fitness Volt (Magnante) + Ellim |
| 18 | Knee Circles | komplet | Motra + Caliverse (inne adresy niż Gemini) |
| 19 | Kneeling Cable Crunch With Alternating Oblique Twists | setup komplet; move komplet warunkowo | skręt: The Workout Digest (B. Ward) + lustro free-exercise-db |
| 20 | Kneeling Forearm Stretch | komplet; niezależność do sprawdzenia | Kovo + AthleMove (+ Iron and Oven) |

Komplet: 7 (w tym 19 warunkowo, 20 z zastrzeżeniem niezależności). Częściowo: 1 (15). 1 źródło: 2 (14, 16). Brak: 0.

## Cytaty Gemini niezgodne ze stroną / błędne przypisanie (5 przypadków)
- Gravitus (19): wszystkie 3 cytaty nieobecne na stronie (strona nie ma wariantu skośnego ani sekcji błędów).
- Fitness Volt (19): „right elbow towards your left knee” — z wariantu jednorącz, nie z tego ćwiczenia.
- Lyfta (16): adres -84r pokazuje inne ćwiczenie (wyciskanie z gumą); cytaty nieobecne.
- Motra (18): cytat ustawienia „Stand upright with feet together…” nie znaleziony na czytelnej stronie.
- Fitness Volt (13): „avoid leaning to one side” istnieje, ale w sekcji o mięśniach, nie wśród błędów.
- Ćwiczenie pomylone przez Gemini: 11 i 18 — część źródeł opisuje wersję leżąc na plecach (inne ćwiczenie niż w katalogu).
- Dosłowne: Jefferson (FV, WTG, BOXROX), Keg (Bearly), Halo (Iron and Oven, SET FOR SET), Pirate (Lift Manual),
  Sumo (FV, Ellim), Forearm (Kovo, AthleMove, Iron and Oven), Isometric Wipers (FV), OneRep.

## Adresy nieczytelne
- 403: fitwill.app (1715, 0500, 1714, 0543, 1717), muscleandstrength.com/exercises/kettlebell-halo, gmb.io/knee-health.
- 404: lifetime.life (Janda), smartworkout.app, martinkoban.com, gatewayofhealth.com PDF, bearly.fit, ahumanweb.com,
  onepeloton.com/blog/kettlebell-halo, training.fit, julielohre.com/sumo-high-pull, greatist.com, fitnesskar.com,
  motra.com/exercises/knee-circles, learn.athleanx.com (po przekierowaniu), ritfitsports.com.
- Inne: adamschiro.ca 503, caliverse.app/exercises/knee-circles 500, gegnsgym.com i spotebi.com — strona weryfikacji
  (treść niedostępna), exercises.com.au — pusta, blackbeltwiki 410.

## Otwarte pytania
- [OTWARTE] Keg Load: czy katalog to ładowanie z podłogi przed podestem, czy wyścig z noszeniem beczek (tekst typu free-exercise-db) — rozstrzyga rysunek.
- [OTWARTE] Kneeling Cable Crunch: jedno ze źródeł skrętu to lustro free-exercise-db bez podanego pochodzenia — czy liczyć do pary; różnica: kolano to samo vs przeciwne (zdanie bez strony).
- [OTWARTE] Iron and Oven, Kovo, AthleMove: wyglądają na generowane katalogi; Kovo i Iron and Oven mają prawie ten sam opis ustawienia (20) — sprawdzić niezależność.
- [OTWARTE] Plik `szczeble-organizacji-2026-11-02.md` — nie istnieje w roboczym drzewie, a nie miałem narzędzia do `git show origin/badania/lokalne-0211:…`; wszystkie źródła przypisane do szczebla 5 (autorzy z kwalifikacjami: Magnante — ACE, Dr. Malik — MD; ewentualny szczebel „warunkowo 4” nie sprawdzony).
- Halo (15): wyprost nad głową — szukać drugiego źródła opisującego połączenie halo z wyprostem; do tego czasu 1 źródło.
