# Weryfikacja Gemini research-2, ćwiczenia 1–10 (03.11.2026)

Plik wejściowy: `gemini/research-2.txt`, linie 1–223. Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026) — ustawienie i przebieg
ruchu z 2 niezależnych źródeł (szczebel 5 wystarcza, oznaczenie „praktyka”), „czego unikać” może być wnioskowane; liczby i zdrowie
pominięte. Strony aplikacji treningowych dopuszczone jako szczebel 5 (`docs/18-przekazanie.md:201`, wariant A); nazwy firm tylko tutaj.
Wszystkie źródła = szczebel 5 → pozycje „otwarte” do recenzji niezależnej (L-047), nie „gotowe”. Szczegóły i cytaty: `wyniki-gemini-2a.json`.

Wariant każdego ćwiczenia ustalony z opisu katalogu (free-exercise-db, pole `fedb` w `docs/research/equipment/catalog.json`) —
tylko do identyfikacji wariantu, nie jako źródło.

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone |
|---|---|---|---|
| 1 | Front Incline Dumbbell Raise | komplet | strongermobileapp; weighttraining.guide (E. Lord) |
| 2 | Front Raise And Pullover | komplet | jefit /162; exercise.com (przeróbka tekstu fedb) |
| 3 | GHD Sit Up | komplet (+ mis z 2 źródeł) | boxrox (K. Wlodarczyk); repcountapp |
| 4 | Groiners | komplet | kovofitness; fitnessdrum (R. Turp, tylko setup); exercise.com (move) |
| 5 | Hip Circles (Prone) | komplet (+ mis z 2 źródeł) | physitrack; playerstrust.com — oba spoza Gemini |
| 6 | Hip Flexion with Band | komplet (setup jako część wspólna); zaczep z tyłu — 1 źródło | gymreapers (R. Pilon); getwellen |
| 7 | Incline Push-Up Reverse Grip | **brak** | tylko lustro opisu katalogu (fitnessvolt); workoutlabs — sztanga przy podłodze (możliwe uproszczenie) |
| 8 | Incline Walk (bieżnia) | setup komplet, **move 1 źródło** | peloton; hingehealth (recenzja PT) |
| 9 | Intermediate Groin Stretch | komplet | physitrack (au); yogavastu — oba spoza Gemini |
| 10 | Iron Crosses (Stretch) | komplet (+ mis z 2 źródeł) | trainwell; peloton (M. Ross) — „scorpion stretch”, spoza Gemini |

Komplet: 8 (1, 2, 3, 4, 5, 6, 9, 10). Jedno źródło: 1 (8 — move). Brak: 1 (7).

## Rozbieżności wariantu (ważne dla recenzenta i rysunku)
- **Iron Crosses**: katalog = leżąc przodem (noga za plecami do przeciwnej dłoni); wszystkie źródła Gemini = leżąc na plecach (inny ruch). Użyte źródła „scorpion stretch”.
- **Groiners**: katalog = wyskok obiema nogami; większość źródeł Gemini = krok jedną nogą (inny wariant).
- **Front Raise And Pullover**: Ellim i Motra = unoszenie stojąc + pullover leżąc (inny wariant).
- **Front Incline Dumbbell Raise**: źródła — hantle zwisają po bokach; katalog — ręce przed sobą nad udami. Wersja leżąc przodem (prone) = inne ćwiczenie.
- **Hip Flexion with Band**: getwellen — pętla na obu kostkach bez zaczepu; physitrack — prosta noga (nie liczony).

## Sprzeczności na tym samym szczeblu (nie weszły do zdań)
- Incline Walk: Peloton — lekkie pochylenie w stronę wzniesienia jest dobre; Hinge Health — pochylanie/zginanie w pasie to częsty błąd.
- Hip Flexion with Band: getwellen — wyprostowana postawa; gymreapers — lekkie zgięcie w biodrach, stanie prosto przez cały ruch jako błąd.
- GHD: miednica „off the pad” (boxrox) vs „just behind the middle of the pad” (repcount) — zdanie z częścią wspólną.

## Cytaty Gemini niezgodne ze stroną (5 + 1 zły adres)
- jefit /1115 — pod tym adresem inne ćwiczenie (unoszenie talerza); cytowany tekst jest pod /162.
- boxrox (GHD, move) — dwa zdania z różnych kroków sklejone, pominięte zdanie środkowe.
- repcountapp (GHD, setup i move) — zdania z różnych kroków sklejone (2 cytaty).
- gymreapers (Hip Flexion) — oba zdania istnieją, ale w sekcjach innych ćwiczeń z artykułu (marsz z pętlą, „Standing Band Knee Raise”); użyte zdania z sekcji „Standing Hip Flexion”.
- fitnessvolt (Intermediate Groin, Front Raise And Pullover, Incline Push-Up) — tekst to dosłowna kopia free-exercise-db (nie liczona jako niezależna).
- Zgodne dosłownie: strongermobileapp (3), weighttraining.guide incline, boxrox setup i mis, getwellen (2), kovofitness (2), fitnessdrum setup, peloton, hingehealth.

## Adresy nieczytelne
- 403: fitwill ×2 (1710, 1718), muscleandstrength (reverse-grip-incline-push-up), fitbod (prone-hip-circles-forward), medium (achieving_fitness).
- 404: hussle, getwrkout, fitnesskar (front-raise-pullover), theprogrm, fixmee, motra (mini-loop-band…), blackroll, loadmuscle, peakprimalwellness, toddsmithfitness, walkingpad, equinox, bodyspec, vivehealth, yogauonline, siddhiyoga, theholisticcare, huggermugger, fitnessvolt (intermediate-groin) — 19.
- Bez treści (weryfikacja botów / pusta): musclemagfitness, lyfta, catalystathletics (exercise/165), surreyphysio, lifeworkskc, habuild, becomeapersonaltrainer.
- Nieotwierane (niepotrzebne albo inny wariant): swolverine, ksquaredfitness, ironcrewathletics, programme.app, fitsociety, caliverse, inspireusa, getfitapp, fitbeast, hortonbarbell ×2, overtimeathletes, strive-workout, fitnesskar (iron cross), ellim ×2, weighttraining.guide prone, catalyst (artykuł).

## Otwarte pytania
- [OTWARTE] Incline Push-Up Reverse Grip: brak 2 niezależnych opisów wersji na sztandze Smitha/podwyższeniu. Recenzent: czy workoutlabs (sztanga przy podłodze, ten sam chwyt i ruch) może być nazwanym „uproszczeniem”.
- [OTWARTE] Incline Walk: druga strona opisująca sam chód (żwawo, głowa w górze) — wszystkie pozostałe adresy Gemini = 404.
- [OTWARTE] Front Incline Dumbbell Raise: pozycja startowa rąk (po bokach vs przed sobą) — zgodność z rysunkiem.
- [OTWARTE] Iron Crosses: recenzent potwierdza, że „scorpion stretch” leżąc przodem to ruch z rysunku.
- [OTWARTE] Plik `szczeble-organizacji-2026-11-02.md` (gałąź `badania/lokalne-0211`) — nie czytałem (to zadanie nie miało narzędzia powłoki do `git show`); szczeble przypisane: wszystkie 5, zgodnie z rundą r2.
- exercise.com (Front Raise And Pullover, Groiners) = przeróbki tekstu free-exercise-db: nie łączyć w parę z innym lustrem fedb; tu para z niezależnym tekstem (jefit, kovofitness).
