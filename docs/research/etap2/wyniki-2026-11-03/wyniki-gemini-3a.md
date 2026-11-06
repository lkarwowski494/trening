# Weryfikacja Gemini research-3, ćwiczenia 1–10 (03.11.2026)

Plik wejściowy: `gemini/research-3.txt`, linie 1–202. Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026) — ustawienie i przebieg
ruchu z 2 niezależnych źródeł (szczebel 5 wystarcza, oznaczenie „praktyka”), „czego unikać” może być wnioskowane; liczby i zdrowie
pominięte. Strony aplikacji treningowych dopuszczone jako szczebel 5 (`docs/18-przekazanie.md:201`, wariant A); nazwy firm tylko tutaj.
Wszystkie źródła = szczebel 5 → pozycje „otwarte” do recenzji niezależnej (L-047), nie „gotowe”. Szczegóły i cytaty: `wyniki-gemini-3a.json`.

Wariant każdego ćwiczenia ustalony z opisu free-exercise-db (pole `fedb` w `docs/research/equipment/catalog.json`, tekst czytany z
`raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<Nazwa>.json`). Fedb = szczebel 5
(`szczeble-organizacji-2026-11-02.md:33`) i liczy się najwyżej jako JEDNO źródło; jego kopie (repstack, IRON&OVEN, cytaty Gemini z
fitnessvolt) nie są drugim źródłem. Cytaty fedb sprawdzone dosłownie (drugi odczyt z pytaniem tak/nie).

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone |
|---|---|---|---|
| 1 | Kneeling High Pulley Row | **częściowo**: setup komplet (część wspólna), **move 1 źródło** | fedb; kovofitness (klęczące ściąganie — tylko setup) |
| 2 | Kneeling Squat | komplet (+ mis z 2 źródeł) | setforset (G. Reid); fitnessdrum (J. Graham) |
| 3 | Landmine Linear Jammer | komplet (drugie źródło = landmine thruster bez uchwytu) | fedb; trainwell — spoza Gemini |
| 4 | Leg Pull-In | komplet | fedb; flabfix — spoza Gemini |
| 5 | Leg Swings (Side-to-Side) | komplet (+ mis z 2 źródeł) | hortonbarbell (R. Horton); fitnessprogramer |
| 6 | Leverage Decline Chest Press | komplet | fedb; fitnessprogramer |
| 7 | Leverage High Row | komplet | fedb; volm |
| 8 | Leverage Incline Chest Press | komplet (setup część wspólna) | fedb; liftosaur |
| 9 | London Bridges | komplet (setup część wspólna, + mis z 2 źródeł) | fedb (kopia IRON&OVEN); fitnessvolt (M. Magnante) |
| 10 | Lower Back Curl | komplet (setup część wspólna, + mis z 2 źródeł) | fedb; daniwinks (D. Enos) — spoza Gemini |

Komplet: 9 (2–10). Częściowo / jedno źródło: 1 (1 — move). Brak: 0.

## Pomylone odmiany (źródła Gemini nie liczone)
- **Lower Back Curl**: fedb = leżąc przodem NA PODŁODZE, ręce w bok, unoszenie klatki. Wszystkie 3 źródła Gemini = wyprost na ławce/maszynie do hiperekstensji.
- **Landmine Linear Jammer**: fedb = przysiad + dynamiczne wstanie z wypchnięciem sztangi (uchwyt). Wszystkie 5 źródeł Gemini = wyciskanie landmine (bez nóg).
- **Leg Pull-In**: fedb = leżąc na plecach. Gemini: 3 źródła wersji siedzącej + Kovo „alternate leg pull” (inne); jedyny pasujący (Fitbod) — 403.
- **Kneeling High Pulley Row**: Kovo = klęczące ściąganie drążka nad głową z łokciami przy tułowiu — sprzeczne z fedb (lina, łokcie na boki); liczony tylko dla części wspólnej ustawienia.
- **Leverage High Row**: Stronger = wiosłowanie z oparciem klatki bez uchwytów nad głową — inny wariant.
- **London Bridges**: fitnessvolt — stopy na podłodze, fedb — na zablokowanej sztandze/skrzyni (ustawienie jako część wspólna).

## Rozbieżności do recenzji (nie weszły do zdań)
- Incline: wysokość uchwytów — fedb przy górze klatki, liftosaur „oczy na wysokości uchwytów”.
- Kneeling Squat: rozstaw kolan — biodra (setforset) vs barki (fitnessdrum).
- Linear Jammer: kierunek wypchnięcia — trainwell „directly overhead”, fedb po łuku landmine.
- Lower Back Curl: ręce — fedb na boki, daniwinks wzdłuż tułowia.
- **London Bridges w `luki.json` ma rodzinę `hip_bridge`** — ruch to odchylenie na linie, nie mostek biodrowy; do sprawdzenia przez koordynatora.

## Cytaty Gemini niezgodne ze stroną: 2 (+ ok. 4 będących tekstem fedb)
- kovofitness (KHPR, move): „Pull the bar down to your collarbone…” — brak na stronie; strona: „Kneel facing the machine and pull the bar down toward your chest…”.
- ironandoven (London Bridges, setup): dwa zdania sklejone z pominięciem zdania o zablokowanej sztandze Smitha.
- Tekst fedb podany jako cudzy: fitnessvolt (KHPR, High Row), ironandoven (London Bridges), repstack (spoza Gemini).

## Martwe adresy Gemini: 11
gymaholic (404), fitnessvolt kneeling-high-pulley-row-alternative (404), powerliftingtechnique (403), steelsupplements (404), fitbod
leg-pull-in (403), smartworkout decline-chest-press (404), dumbbellsdirect decline (404), nikostrainer (404), kovofitness incline (404),
fitnesskar (404), eresfitness (strona bez treści ćwiczenia). Spoza Gemini też: fitwill (403), muscleandstrength (403), bodybuilding.com (przekierowanie do sklepu).

## Otwarte pytania
- [OTWARTE] KHPR — drugie źródło dla przebiegu ruchu (lina z górnego wyciągu, klęcząc, łokcie na boki); znalezione tylko kopie fedb i wersje stojące.
- [OTWARTE] Linear Jammer — czy landmine thruster bez uchwytu to ten sam ruch (recenzent z rysunkiem).
- Nieczytane, bo wystarczyło: ellim, fitwill (wymachy), lyfta, flexxp (decline), dumbbellsdirect (kneeling squat).
