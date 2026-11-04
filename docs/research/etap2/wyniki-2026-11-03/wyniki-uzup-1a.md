# Uzupełnienie 1, ćwiczenia 1–11 — weryfikacja źródeł (03.11.2026)

Szczegóły (zdania pl/en, źródła z cytatami, szczeble) są w `wyniki-uzup-1a.json`. Wszystkie źródła mają szczebel 5 (praktyka), z wyjątkiem Catalyst Athletics (szczebel 4).
Połączone z: `wyniki-gemini-1.json`, `wyniki-gemini-1-r2.json`, `wklejone-1.md`. Każdą stronę przeczytałem (WebFetch, 03.11.2026) albo wkleił ją właściciel.

## Stan po połączeniu

| # | Ćwiczenie | Przed | Po | Niezależne źródła setup / move | mis |
|---|---|---|---|---|---|
| 1 | Around The Worlds | 1 źródło | **komplet** | fedb (kopia na fitnessvolt) + exercises.com.au | 1 źródło + wniosek |
| 2 | Behind-the-Back Barbell Wrist Curl | 1 źródło | **komplet** | WTG (E. Lord) + skimble 46407 (wklejone) + kasmaker | 1 źródło |
| 3 | Bradford Press | 1 źródło | **komplet** | setup: liftmanual + ellim; move: liftmanual + physicalculturestudy + ellim | 2 źródła |
| 4 | Carioca Quick Step | 1 źródło | **komplet** | Healthline (T. Read) + Marathon Handbook (A. Sayer) | 1 źródło |
| 5 | Clean Shrug | 1 źródło | **komplet** | Catalyst (4) + M&S (wklejone) + fedb (kopia na ironandoven) | 2 źródła |
| 6 | Cocoons | 1 źródło (słabe) | **komplet** | Fitness Volt (M. Magnante) + fitbod (wklejone) + kovo / liftmanual | 1 źródło + wniosek |
| 7 | Crucifix | 1 źródło (tylko ramiona) | **komplet** | setup: liftmanual + BarBend; move: liftmanual + gegnsgym | 1 źródło + wniosek |
| 8 | Dumbbell Incline Shoulder Raise | 1 źródło | **komplet** | WTG (M. Livelo) + hueman (+ fedb przy move) | 2 źródła |
| 9 | Dynamic Chest Stretch | 1 źródło (inna odmiana) | **komplet** (część wspólna) | fedb + ellim | 1 źródło |
| 10 | Conan's Wheel | brak | **komplet** | fedb + kovo + fitloop | 1 źródło + wniosek |
| 11 | Barbell Front Raise to Overhead | brak | **komplet** | fitnall (A. Albritton) + fedb | 1 źródło |

Wszystkie mają oznaczenie „praktyka” i czekają na recenzję niezależną z porównaniem z rysunkiem (L-047). Liczby (wysokość stojaka, czasy) i zdania o zdrowiu pominąłem.

## Uwagi dla recenzenta

- **Bradford Press:** według liftmanual i physicalculturestudy sztanga idzie tylko ponad czubek głowy, ellim pisze „directly overhead”. Tekst mówi „tylko tyle, by minęła czubek głowy”.
- **Dynamic Chest Stretch:** w fedb start z dłońmi razem z przodu, w ellim z rękami w bok. Setup podaje tylko część wspólną.
- **Barbell Front Raise to Overhead:** oba źródła mają łokcie lekko ugięte, a odmiana w katalogu to „straight-arm”. fitnall może być parafrazą fedb (brak wspólnych zdań, inny chwyt); liczę go jako niezależny.
- **Clean Shrug:** w M&S pierwsze powtórzenie startuje z podłogi; w Catalyst i fedb ze zwisu wysoko na udach.
- **Carioca:** Marathon Handbook ma unoszenie kolana przy kroku przed — pominięte.

## Miara jakości adresów Gemini (ćwiczenia 1–11, 46 adresów)

| Wynik | Liczba | Adresy |
|---|---|---|
| cytat zgodny | 18 | exercises.com.au; WTG wrist curl; kasmaker; liftmanual Bradford; ellim Bradford; marathonhandbook; M&S clean shrug (potwierdzony wklejeniem); ironandoven clean shrug (zarazem kopia fedb); fitnessvolt cocoons; kovo cocoons; liftmanual cocoons; liftmanual crucifix; gegnsgym crucifix; hueman; ellim chest stretch; kovo Conan; fitloop Conan; fitnall |
| kopia fedb | 3 | totalworkout cocoons (404, cytat = fedb); stayfit.dev (strona główna, cytat = fedb); ironandoven chest stretch (cytat = fedb, nieczytana) |
| inne ćwiczenie lub odmiana | 3 | jefit/135 (przysiad w maszynie Smitha); jefit/1133 (Cable One-Arm Reverse Fly); bearly.fit/hang-clean (zarzut ze zwisu; 404) |
| niezgodny | 2 | anterides (strona bez treści); pliability (brak sekcji, najbliższa — inna pozycja, bez dosłownego cytatu) |
| otwarte — 404 | 12 | hevy ×2; repcount; fitnesskar ×2; offtheleash; levelupbasket; titanlog; fitloop crucifix; ironandoven Conan; gripandgrub; repriot |
| otwarte — 403 / 503 | 7 | fitbod around-the-worlds; skimble/1111; compoundlifts (503); M&S Bradford; fitwill 1617; fitwill 2875; masterclass |
| nieczytane (niepotrzebne) | 1 | gegnsgym clean shrug |

Poza Gemini: fedb (raw JSON) przeczytany dla Around The Worlds, Clean Shrug, Dumbbell Incline Shoulder Raise, Dynamic Chest Stretch, Conan's Wheel i Standing Front Barbell Raise Over Head; WTG incline-dumbbell-shoulder-raise; Catalyst; Healthline (źródła z wcześniejszych rund, przeczytane ponownie dla cytatów setup).

## Otwarte pytania

- [OTWARTE] Szczebel Healthline (autor z certyfikatem, recenzent, data) — według reguły ogólnej z `szczeble-organizacji` może być 4; tu liczony jako 5.
- [OTWARTE] Muscle & Strength — szczebel organizacji nieustalony (403); liczony jako 5.
- [OTWARTE] Dosłowny cytat z pliability („double arm stretch for chest”) — narzędzie nie oddało tekstu dosłownie; nie liczony.
