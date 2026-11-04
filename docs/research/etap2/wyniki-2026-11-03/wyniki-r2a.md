# Runda 2, r2a — 9 ćwiczeń bez kompletu (03.11.2026)

Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026). Setup i move wymagają 2 niezależnych źródeł; wystarczy szczebel 5 z oznaczeniem „praktyka”. Mis pochodzi ze źródła albo jest wnioskiem z ruchu. Liczby i treści o zdrowiu pomijam.
Szczeble ustalam według `szczeble-organizacji-2026-11-02.md`. HSS to szpital, więc szczebel 4 (wiersz 71). Keiser to producent, więc szczebel 4, ale tylko dla jego roweru (wiersz 14). Najpierw przejrzałem wcześniejsze wyniki: p4a, p5a, p6, gemini-3a/3b, uz2b, uzup-1b, A/C/D. Stron już sprawdzonych nie otwierałem ponownie.
Szczegóły i cytaty są w JSON, podzielonym na dwa pliki: `wyniki-r2a.json` (pozycje 1–5) i `wyniki-r2a-czesc2.json` (pozycje 6–9). Każdy komplet ma stan „otwarte”, czyli czeka na recenzję niezależną (L-047).

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 1 | Rower | **komplet** (setup, move, mis), szczebel 4 | HSS (sz. 4) + Keiser (sz. 4, producent roweru stacjonarnego) | 1 / 2 |
| 2 | Meadows Row (mis) | **komplet**: mis z 2 źródeł | Muscle Booster/Welltech (D. Sautter, NASM; sz. 5) + Generation Iron (zapis z gałęzi). Welltech jest też 3. źródłem dla setup/move | 2 / 4 |
| 3 | Kneeling High Pulley Row (move) | **komplet** (praktyka); mis z 2 źródeł | fedb + ManiacMuscle (strona była w partii D, ale wcześniej nie liczono jej dla move) | 0 / 1 |
| 4 | Smith Machine Reverse Calf Raise | **komplet warunkowo** | pięty na podeście, ruch i mis: fedb + potreningu.pl (wersja bez Smitha). Smith: fedb + Motra (?) | 2 / 4 |
| 5 | Smith Machine Hip Raise | **brak po rundzie 2** (1 źródło: fedb) | — | 2 / 3 |
| 6 | Bosu Ball Cable Crunch With Side Bends | **brak po rundzie 2** (1 źródło) | — | 1 / 3 |
| 7 | Cable Judo Flip | **bez zmian: częściowo** (fedb + Jefit, niezależność niepewna) | — | 2 / 0 |
| 8 | Seated Close-Grip Concentration Barbell Curl | **komplet** (praktyka) | fedb + LoadMuscle (gryf EZ). „Wąski chwyt” podają tylko fedb + Motra | 1 / 1 |
| 9 | Smith Incline Shoulder Raise | **rozbieżność**: zdania warunkowe | ruch łopatek: weighttraining.guide + Rehab Hero (obie z hantlami). Smith opisuje tylko fedb, a jego opis jest niejednoznaczny | 1 / 2 |

Komplet: 4 (nr 1, 2, 3, 8). Komplet warunkowo: 1 (nr 4). Częściowo: 1 (nr 7). Rozbieżność z zdaniami warunkowymi: 1 (nr 9). Brak po rundzie 2: 2 (nr 5, 6).
Koszt łącznie: 12 wyszukań i 20 odczytów stron, średnio 1,3 wyszukania i 2,2 strony na ćwiczenie.

## Rozbieżności do recenzji (nie weszły do zdań albo zdania są warunkowe)
- **Rower:** katalog obejmuje też jazdę na zewnątrz (`catalog.json:3716`), a zdania opisują rower stacjonarny. Recenzent sprawdza na rysunku, czy to rower stacjonarny. HSS i Keiser podają różne kąty ugięcia kolana. To liczby, więc żaden kąt nie wszedł do zdania. Dla Keiser liczy się wyłącznie dokumentacja jego roweru, co tu jest spełnione.
- **Meadows Row:** drugie źródło dla mis to Generation Iron według zapisu gałęzi (`z-galezi/obowiazkowe-mieszane.md:170`), w tej rundzie go nie czytałem. Szczebel GI zależy od warunku K3. Jeśli GI odpadnie, mis = Welltech + wniosek z ruchu. Welltech to strona aplikacji, więc szczebel 5, mimo że autor ma kwalifikacje.
- **Kneeling High Pulley Row:** według fedb łokcie idą na boki („elbows out”). ManiacMuscle każe prowadzić łokcie do tyłu, a dłonie na końcu lekko się rozchodzą. Do zdania weszła tylko część wspólna: lina do górnej części klatki i ściągnięcie łopatek. Recenzent sprawdza na rysunku kierunek łokci.
- **Smith Machine Reverse Calf Raise:** potreningu.pl opisuje ten sam ruch (pięty na podwyższeniu, unoszenie przodostopia, opuszczenie palców poniżej krawędzi), ale bez sztangi. Obciążenie sztangą Smitha opisują tylko fedb i Motra, a Motra ma układ fedb. Recenzent decyduje, czy Smitha uznać za wariant sprzętu (nazwane uproszczenie).
- **Seated Close-Grip Concentration Barbell Curl:** LoadMuscle pisze „your elbow” (l. poj.) i nie wspomina o wąskim chwycie. Pod względem tekstu i układu jest niezależny od fedb. Wąski chwyt opierają tylko fedb i Motra.
- **Smith Incline Shoulder Raise:** note katalogu (`catalog.json:14699`) mówi o wysunięciu łopatek (zębaty przedni). Fedb opisuje wyprost łokci z lekkiego ugięcia, czyli raczej krótkie wyciskanie. Dwa niezależne źródła wysunięcia łopatek przy prostych rękach na ławce skośnej opisują wersję z hantlami. Zdania warunkowe w JSON obowiązują tylko wtedy, gdy recenzent potwierdzi na rysunku ruch łopatek i uzna Smitha za wariant sprzętu. Mis („nie zginaj łokci”) przeczy fedb.
- **Smith Machine Hip Raise:** pod tą nazwą krążą 3 różne ruchy: fedb (leżenie na ławce, stopy na sztandze, podwinięcie miednicy), hip thrust (bearly, Cora) i most biodrowy (Lyfta). Strona MuscleWiki „smith-machine-reverse-crunch-hip-raise” pasuje nazwą do fedb, ale zwraca 403.

## Otwarte pytania
- [OTWARTE] Smith Machine Hip Raise: drugi opis odmiany fedb. Kandydat to MuscleWiki (403, trzeba go otworzyć w innej sesji albo w przeglądarce właściciela).
- [OTWARTE] Bosu Ball Cable Crunch With Side Bends: drugi opis wersji leżącej z dwoma wyciągami. Artykuł bodybuilding.com „Cable-Ready Abs” jest martwy (404 po przekierowaniu), a Oxygen wymaga logowania.
- [OTWARTE] Cable Judo Flip: czy Jefit 786 liczy się jako niezależne źródło (decyzja koordynatora z p6)? Innego opisu nie ma.
- [OTWARTE] Smith Incline Shoulder Raise: jaki ruch pokazuje rysunek?
- Martwe albo 403 w tej rundzie: powerliftingtechnique.com/meadows-row, sportskeeda (Meadows), livestrong 188652 (przekierowanie na everydayhealth), web.archive.org (narzędzie nie ma dostępu), MuscleWiki (403), shop.bodybuilding.com (404), oxygenmag (logowanie).
