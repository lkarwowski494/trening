# Runda 2 (r2b), 9 ćwiczeń: wyszukiwanie bez Gemini (03.11.2026)

Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026). Setup i move potrzebują 2 niezależnych źródeł. Szczebel 5 wystarczy i daje oznaczenie „praktyka”. Mis pochodzi ze źródeł albo jest wnioskiem z ruchu. Liczby i treści o zdrowiu pominąłem.
Najpierw przeszukałem wcześniejsze wyniki: uz2a, uz2b, p4a, p5a, p5b, gemini-3b, gemini-4b, A/B/C/D. Strony już sprawdzone i strony z 403 (exrx, fitbod, fitwill, muscleandstrength) pominąłem. Jest jeden wyjątek: przez pomyłkę otworzyłem ponownie Fitness Volt „barbell-rolleout-guide”. Wynik się nie zmienił.
Parafraz fedb (Motra, RitFit, Jefit, exercise.com) nie liczę. Szczeble ustaliłem według `szczeble-organizacji-2026-11-02.md`. Wszystkie pozycje mają stan „otwarte” i czekają na recenzję niezależną (L-047). Cytaty i miejsca są w `wyniki-r2b.json`.

## Wynik

| # | Ćwiczenie | Stan po rundzie 2 | Co nowego | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 1 | Dumbbell Lying Pronation | **brak po rundzie 2** (wersja leżąc przodem) | nic; wersji leżąc przodem z obrotem przedramienia nie opisuje żadne czytelne źródło | 3 / 0 |
| 2 | Lying Machine Squat | **brak po rundzie 2** (mechanika fedb) | nic; liftosaur opisuje maszynę siedzącą | 3 / 1 |
| 3 | Smith Machine Pistol Squat | **brak po rundzie 2** | my-personaltrainer.it opisuje inną odmianę: wolna noga jest z tyłu | 2 / 1 |
| 4 | Side Lying Groin Stretch | **brak po rundzie 2** | Anantasana (Art of Living) to pokrewna poza z prostą nogą; nie liczę | 3 / 2 |
| 5 | Incline Push-Up Reverse Grip | **brak po rundzie 2** | nic | 2 / 0 |
| 6 | Standing Barbell Rollout | **komplet warunkowo** (setup to część wspólna) | loadmuscle (sz. 5) jest drugim źródłem setup; potwierdza też move i mis | 3 / 3 |
| 7 | Reverse Flyes With External Rotation | **częściowo** | kierunek obrotu (kciuki w górę) potwierdzają Generation Iron (T. Ramos) i VHI, ale opisują wersję bez obrotu w trakcie | 1 / 3 |
| 8 | Supine One-Arm Overhead Throw | **brak po rundzie 2** | nic | 2 / 0 |
| 9 | Lying Supine Dumbbell Curl | **setup komplet, move częściowo** | weighttraining.guide „supine dumbbell curl” (E. Lord) | 3 / 3 |

Liczby: komplet 0. Komplet warunkowo: 1 (nr 6). Częściowo: 2 (nr 7 i 9). Jedno źródło: bez zmian u nr 4, 5 i 8 (tylko fedb). Brak po rundzie 2: 6 (nr 1, 2, 3, 4, 5 i 8).
Koszt łącznie: 22 wyszukania i 13 odczytów stron, czyli średnio 2,4 wyszukania i 1,4 strony na ćwiczenie.
Wszystkie nowe źródła mają szczebel 5. Generation Iron (T. Ramos, ACSM CPT, 2024) jest warunkowo na szczeblu 4, ale nie ma nazwanego recenzenta (szczeble:113).

## Rozbieżności do recenzji (nie weszły do zdań albo weszły jako część wspólna)
- **Dumbbell Lying Pronation:** tu potrzebna jest decyzja koordynatora o odmianie, a nie dalsze szukanie. Note katalogu (:16781) mówi „prone” i obrót przedramienia. Fedb (:16755) opisuje rotację barku. Czytelne źródła obrotu przedramienia opisują leżenie na boku (uz2a). Są dwie opcje. Pierwsza: zmienić note na wersję na boku, co daje 2 źródła. Druga: zostawić ćwiczenie bez kompletu. Rysunek trzeba sprawdzić w obu przypadkach.
- **Lying Machine Squat:** w uz2a GMWD opisuje platformę, która się rusza, a fedb oparcie, które się rusza. Nowego źródła nie znalazłem. Opisy leżącej maszyny do przysiadów istnieją tylko jako kopie fedb i patent.
- **Smith Machine Pistol Squat:** my-personaltrainer.it (dr M. Bonazzelli) kładzie sztangę na plecach, jak fedb. Wolna noga jest jednak z tyłu, czasem na ławce, więc to odmiana bliższa przysiadowi bułgarskiemu.
- **Side Lying Groin Stretch:** Anantasana ma podobną pozycję (leżenie na boku, uniesiona i trzymana górna noga). Ma jednak prostą nogę i prostą dolną nogę, a fedb ma zgięte dolne kolano i przyciąga kolano do barku. Recenzent może sprawdzić, czy rysunek nie jest bliższy Anantasanie.
- **Standing Barbell Rollout:** loadmuscle nie mówi wprost o pochyleniu i podaje rozstaw stóp „na szerokość barków”. Fitwill (403, tekst znany tylko z wyszukiwarki) podaje „na szerokość bioder”. Recenzent może usunąć rozstaw ze zdania. Nie wiem, czy loadmuscle jest niezależny od Lyfty. Brzmienie jest inne.
- **Reverse Flyes With External Rotation:** fedb opisuje obrót w trakcie unoszenia na ławce skośnej. Generation Iron (Blackburn) i VHI opisują leżenie przodem na stole z kciukami w górze od startu. Wspólny jest tylko stan końcowy, czyli ręce na boki i kciuki w górę. To rozstrzyga wcześniejszą sprzeczność z paulstokes („dłonie do sufitu”, gemini-4b) na korzyść fedb. Strona Merck Manual o tej samej nazwie opisuje inne ćwiczenie: łokieć zgięty, obrót przedramienia.
- **Lying Supine Dumbbell Curl:** weighttraining.guide (E. Lord) pozwala, by ramię wracało do boku w trakcie, i radzi nie prostować łokci do końca. Fedb trzyma ramiona przy tułowiu. Zdanie o ruchu mówi tylko o zgięciu łokci. Recenzent porówna dolną pozycję z rysunkiem. W tekście wtg jest ostrzeżenie o ścięgnach (to treść o zdrowiu), więc je pominąłem.

## Otwarte pytania
- [OTWARTE] Dumbbell Lying Pronation: odmiana do decyzji koordynatora (opcje wyżej).
- [OTWARTE] Lying Machine Squat, Smith Machine Pistol Squat, Side Lying Groin Stretch, Incline Push-Up Reverse Grip, Supine One-Arm Overhead Throw: brak drugiego niezależnego źródła po rundzie 2. Co sprawdziłem, jest w `wyniki-r2b.json`, w polu „sprawdzone_bez_wyniku”. Strony, które mogłyby pomóc, zwracają 403: fitwill 0347, 0494, 2826 i 1040, muscleandstrength, exrx, fitbod. Dla nr 5 i 8 pozostają opcje „uproszczenia” z uz2a i p5b, do decyzji recenzenta.
- [OTWARTE] Reverse Flyes With External Rotation: czy wersja Blackburna z kciukami w górę od startu liczy się dla odmiany z katalogu (note :14918 „finishing with external rotation”)?
- [OTWARTE] Standing Barbell Rollout: czy loadmuscle jest niezależny od Lyfty?
- Pliki robocze `wyniki-r2b-tmp2.json` i `wyniki-r2b-tmp3.json` zostały scalone do `wyniki-r2b.json` i można je usunąć.
