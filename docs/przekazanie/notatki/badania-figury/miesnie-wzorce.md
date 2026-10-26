# Mięśnie główne i pomocnicze na figurach — wnioski (25.10.2026)

Dane: `miesnie-wzorce.json`.

## Wnioski

1. **Nie potrzeba nowego researchu mięśni dla 709 ćwiczeń — jest już zrobiony.** `docs/research/equipment/catalog.json` ma
   `muscleLoad` dla 709/709 ćwiczeń razem z `research.confidence` i `research.sources` (docs/research/24 — 125 bazowych,
   38 źródeł, m.in. przeglądy S4, S6, S14, S16, S18, S32, S33; docs/research/25-biblioteka L1–L6 — reszta). Figura powinna czytać
   te dane: 1 → główna, 0,5 → pomocnicza, 0,25 → mały udział (najsłabsze podświetlenie albo brak).
2. **Mięśnie w makiecie są wymyślone regułami po nazwie i w kilku miejscach przeczą zbadanym danym**:
   triceps jako główny przy wyciskaniu leżąc i nad głową, biceps jako główny przy podciąganiu, pośladki jako główne przy przysiadzie,
   przedramiona jako główne przy zwykłym uginaniu, czworogłowe przy łydkach, zębaty przedni bez źródła. Z docs/24: wzrost tricepsa
   po samym wyciskaniu mierzony w 3 badaniach, ale klatka rośnie bardziej (S7) → triceps pomocniczy; biceps przy ściąganiu rośnie
   ok. połowę tego, co przy uginaniu (S11–S13) → pomocniczy.
3. **Format:** mięśnie na ćwiczenie = `muscleLoad` z katalogu (to są „wyjątki na ćwiczenie” — wszystkie 709 już je mają);
   `patternDefaults` w JSON tylko awaryjnie i jako kontrola spójności (test: każde ćwiczenie archetypu ma główną z listy archetypu
   albo zapisany powód).
4. **Słownik regionów:** makieta ma regiony, których katalog nie zna (`serratus`, podział `traps_upper`/`traps_mid`) — bez nowych
   źródeł nie podświetlać; mapowanie w `regionMap`. Katalog ma `neck`, którego makieta nie rysuje.
5. **Krzywe „napięcia” mięśni** (`DEFAULT_TENSION_CURVES`, `evaluateMuscleTension`: „stretch-peak”, „lockout-peak”…) — animowane
   natężenie koloru w fazach ruchu nie ma żadnego źródła; to twierdzenie fizjologiczne. [OTWARTE] → zalecenie: stałe podświetlenie.

## Pewność (część wspólna źródeł)

| Archetyp | Główne | Pomocnicze | Pewność |
|---|---|---|---|
| przysiad | czworogłowe | pośladki (+ przywodziciele: decyzja Q1) | mocne |
| martwy ciąg z podłogi | dwugłowe, pośladki | plecy (dolne), czworogłowe | umiarkowane; w catalog.json nadal plecy = 1 — do sprawdzenia |
| RDL | dwugłowe | pośladki, plecy | mocne |
| hip thrust | pośladki | — (dwugłowe: EMG tak, wzrost nie — jedno źródło) | mocne / jedno źródło |
| wykroki | czworogłowe, pośladki | — | umiarkowane |
| wyciskanie leżąc | klatka | triceps, przedni akton | mocne |
| pompki | klatka | triceps, przedni akton | umiarkowane |
| nad głowę | przedni akton | triceps | umiarkowane |
| podciąganie/ściąganie | najszerszy | biceps | mocne (biceps) |
| wiosłowania | najszerszy, góra pleców | biceps, tylny akton | mocne/umiarkowane |
| izolacje ramion, nóg, łydki | mięsień docelowy | — | mocne/umiarkowane |
| core | prosty brzucha | skośne | umiarkowane (przeglądy EMG) |
| noszenie, szrugsy | — | — | uproszczenie / jedno źródło |

Nowe źródła przeczytane w tej sesji (streszczenia, Europe PMC, 25.10.2026): Hamlyn i in. 2007, JSCR, PMID 18076231 — „the LSES EMG
activity during the 80% 1RM squat significantly exceeded 80% 1RM deadlift LSES EMG activity by 34.5%” (szczebel 3, aktywacja);
Clark i in. 2012, JSCR, PMID 22373894 (przegląd) — przysiad angażuje mięśnie tułowia („trunk muscle activation (TMA)”);
przegląd EMG pompek, Front Physiol 2023, https://pmc.ncbi.nlm.nih.gov/articles/PMC10728295/ — „increased activity of the middle
trapezius (MT) and serratus anterior (SA) muscles during the push-up plus (PUP) exercise”.

## Otwarte

1. [OTWARTE] Zębaty przedni i podział czworobocznego — czy dodawać regiony (decyzja produktowa + źródła).
2. [OTWARTE] Deadlift (sztanga): catalog.json `lower_back: 1` vs propozycja docs/24 (plecy pomocnicze).
3. [OTWARTE] Przywodziciele jako pomocnicze w przysiadach (docs/24 Q1).
4. Do potwierdzenia w ACSM's Resources for the Personal Trainer 6e (Dysk): rozdział o anatomii czynnościowej / kinezjologii —
   mięśnie w ruchach podstawowych (szczebel 3), zwłaszcza dla przypisań „jedno źródło” (szrugsy, unoszenie tyłem, Face Pull, noszenie).
