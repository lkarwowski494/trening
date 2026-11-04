# Weryfikacja Gemini research 3 — ćwiczenia 11–20 (03.11.2026)

Wejście: `gemini/research-3.txt`, linie 203–394. Reguła: etap 2 (CLAUDE.md, „Merytoryczne podstawy”) — ustawienie
i przebieg ruchu z 2 niezależnych źródeł szczebla 5 („praktyka”); „czego unikać” może być wnioskiem z ruchu;
liczby i zdrowie pominięte (szyja z obciążeniem — tylko technika). Strony aplikacji treningowych = szczebel 5
(właściciel 03.11.2026, `docs/18-przekazanie.md:201`, wariant A); nazwy firm tylko tutaj, nigdy w pl/en.
Wszystkie pozycje „otwarte” do recenzji niezależnej (L-047). Szczegóły, adresy, cytaty: `wyniki-gemini-3b.json`.
Warianty ustalone z `docs/research/equipment/catalog.json` (pole `fedb`, `note`).

## Wynik

| # | Ćwiczenie | Stan | Źródła pary |
|---|---|---|---|
| 11 | Lunge Pass Through | komplet | Ellim + Motra (spoza Gemini) |
| 12 | Lying Cable Curl | komplet (źródła zastępcze) | StrengthLog + RepStack (tekst fedb) + ManiacMuscle; wszystkie adresy Gemini martwe |
| 13 | Lying Leg Crossover Swings | komplet | Ellim + US Marine Corps/DVIDS „Supine Leg Overs” (spoza Gemini) |
| 14 | Lying Machine Squat | 1 źródło; odmiana pomylona przez Gemini | RepStack (tekst fedb) |
| 15 | Lying Neck Extension (talerz) | komplet (źródła zastępcze) | StrengthLog + WorkoutLabs; Kovo/SmartWorkout = uprząż (inna odmiana) |
| 16 | Lying Neck Flexion (talerz) | komplet | WeightTraining.guide (E. Lord; spoza Gemini) + Kovo |
| 17 | Lying Supine Dumbbell Curl | komplet warunkowo (niezależność) | Iron and Oven (tekst fedb) + Wikipedia |
| 18 | Machine Pullover | komplet (źródła zastępcze); oś obrotu 1 źródło | Life Fitness, instrukcja SU60 (szczebel 4) + Inspire USA |
| 19 | Meadows Row | brak nowych (wszystkie adresy Gemini martwe) | setup/move już na gałęzi: BarBend + Generation Iron (`z-galezi/obowiazkowe-mieszane.md:319–331`); mis — wniosek |
| 20 | Medicine Ball Full Twist | komplet (setup, move); mis wniosek + Hueman | RepStack (tekst fedb) + Intermountain Health (spoza Gemini) |

Komplet: 7 (11, 12, 13, 15, 16, 18, 20) + 1 warunkowo (17). 1 źródło: 1 (14). Brak nowych: 1 (19 — pokryty z gałęzi).

## Poprawka do JSON (do zrobienia przy wdrożeniu)
- 11 Lunge Pass Through, setup: rozstaw stóp różny (Ellim — biodra, Motra — barki). Część wspólna: zdanie bez rozstawu —
  „Stań prosto z kettlebell w jednej ręce przy boku.” / „Stand tall with a kettlebell in one hand at your side.” (JSON ma jeszcze „na szerokość bioder”).

## Cytaty Gemini niezgodne / niepotwierdzone / pomylona odmiana
- Niezgodne z przeczytaną treścią albo z innej odmiany: 4 — Fitness Volt (11: „oburącz przy klatce”, a obie strony: jedna ręka przy boku; strona 404),
  Kovo i SmartWorkout (15: uprząż na głowę, katalog ma talerz), Mikolo/Gymshark/REP Fitness/GMWD (14: hack squat, REP nawet ze sztangą).
- Niepotwierdzone: Ellim 11 — drugie zdanie cytatu „Keep your gaze fixed forward…”; Iron and Oven 17 — cytat o ruchu.
- Cytaty Fitness Volt „…-alternative” (11, 12, 20) to tekst free-exercise-db — nawet czytelne byłyby kopią, nie osobnym źródłem.
- Dosłowne: Ellim (11, 13), Strive (13), Kovo flexion (16), Iron and Oven setup/mis (17), Wikipedia (17), Hueman (20).
- Odmiany pomylone: 14 (Lying Machine Squat ≠ Hack Squat, catalog.json:2435 vs 19899), 15 (uprząż zamiast talerza), 13 częściowo (Fitwill z ugiętym kolanem; Ellim/Strive — wersja z przytrzymaniem, katalog dynamiczna — ruch ten sam).

## Adresy martwe (21 z 29 otwartych adresów Gemini)
- 404: fitnessvolt (11, 20, 12), tayloredpt, captainworkout, fitnesskar, liftorra, smartworkout (18), kaizer, gymkee, athleanx (po przekierowaniu), setforset, soletreadmills, dumbbellsdirect, gymaholic.
- 403: fitwill (12, 15), bodybuilding-wizard. 503: compoundlifts. Strona weryfikacji: origym.ie, hevyapp.com.
- Spoza Gemini nieczytelne: exrx (LVPullover, LyingCrossover) 403, musclewiki 403, Marines PDF 403, skimble 403, stack.com 503, muscleandstrength 403.

## Otwarte pytania
- [OTWARTE] 14 Lying Machine Squat: drugie niezależne źródło do maszyny leżąc (nie hack squat, nie siedząc).
- [OTWARTE] 17: czy opis Wikipedii nie pochodzi z tekstu fedb (zbieżna treść) — jeśli tak, 1 źródło.
- [OTWARTE] 15: WorkoutLabs — tekst przepisany, treścią bliski fedb; para trzyma się dzięki StrengthLog, ale gdyby StrengthLog odpadł — 1 źródło.
- [OTWARTE] 16/15: Kovo wygląda na katalog generowany — niezależność (jak w 2b).
- [OTWARTE] 18: oś obrotu maszyny na wysokości barków — tylko instrukcja Life Fitness; drugie źródło (adresy Gemini martwe).
- [OTWARTE] 19: „Czego unikać” tylko wniosek z ruchu gałęzi; Gemini nie dał czytelnego źródła.
- Szczeble: wszystkie serwisy poza instrukcją Life Fitness = 5 (brak autora z kwalifikacjami albo brak w `szczeble-organizacji-2026-11-02.md`); DVIDS (US Marine Corps) i Intermountain Health — bez autora → 5.
