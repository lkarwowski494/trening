# Etap 2 (ZB-033) — paczka D (barki, ramiona, przyciąganie, moc): źródła szczebla 5

Badacz, 03.11.2026. Wejście: `docs/research/etap2/wyniki-2026-11-03/luki.json` (paczka D, bez `zestaw_ogolny`: 77 ćwiczeń). Wzór: `docs/research/etap2/p0-luki.md`.
Szukano wyłącznie w 4 serwisach z listy właściciela (wariant B, 03.11.2026): R = atlas Centrum Respo, F = Fabryka Siły (atlas i starszy
dział `/cwiczenia/` — ta sama firma), S = grupa SFD (potreningu.pl + atlas.kulturystyka.pl, jedno źródło), M = maniacmuscle.com.
Wszystkie = **szczebel 5** (żadna strona nie ma autora z kwalifikacjami). Wyszukiwarka ogólna tylko z ograniczeniem do tych domen.
Liczby (tempo, kąty, ciężar, odległość) i zdrowie — nie z tych źródeł (pominięte, nawet gdy strona je podaje). Oznaczenie: „praktyka”.
Odczyt przez narzędzie pobierające stronę (model pomocniczy podaje fragmenty jako dosłowne) — recenzent niezależny sprawdza cytaty na stronie.
Błędy „wniosek” — z istniejących zdań tego ćwiczenia (teksty bazowe: `lib/cues/text/pl.json` w repo), bez nowych źródeł.
F vs S (kopiowanie): we wszystkich parach przeczytanych stron brzmienie różne (F: „Pozycja…/Tempo…/Nie szarp ciężaru”, S: „Stań…/Biorąc wdech…/Skup się…”) — nie stwierdzono przepisania.

**Szczegóły i cytaty:** część 1 — niżej; część 2 (curl) — `wyniki-D-czesc2.md`; część 3 (delt_raise, częściowo) — `wyniki-D-czesc3.md`.
JSON: `wyniki-D.json` (część 1), `wyniki-D-czesc2.json`, `wyniki-D-czesc3.json` — do scalenia (ten sam format).

## Tabela (stan 03.11.2026; 26 z 77 ćwiczeń)

| Ćwiczenie | Zdanie (rola) | Źródła | Stan | Uwagi |
|---|---|---|---|---|
| High Cable Curl (obow.) | setup, move, mis | F, S | **2 z 3** | R i M nie mają ćwiczenia |
| Meadows Row (obow.) | mis | — | **brak w 4 serwisach; wniosek możliwy** | błąd do wnioskowania z setup/move na gałęzi `badania/obowiazkowe-1-1` (`mieszane.md:177`) |
| Medicine Ball Slam (obow.) | setup | F, S | **2 z 3** | F: piłka między nogami, S: nad głową — część wspólna |
| Medicine Ball Slam (obow.) | mis | `["wniosek", "hinge.back"]` (+ S wprost) | **wniosek — praktyka** | |
| Cable Curl | mis | `["wniosek", "curl.elbows"]` | **wniosek — praktyka** | albo istniejące id `curl.mis.elbows` |
| Lateral Raise (hantle) | mis | `["wniosek", "lat.setup"]` | **wniosek — praktyka** | |
| Cable Lateral Raise | mis | `["wniosek", "clat.setup"]` | **wniosek — praktyka** | |
| Front Raise | mis | `["wniosek", "front.elbows"]` | **wniosek — praktyka** | |
| Reverse Fly (hantle) | mis | `["wniosek", "rear.setup"]` | **wniosek — praktyka** | wyjątek „bez animacji” |
| Reverse Pec Deck | mis | `["wniosek", "rpd.elbowsHigh"]` | **wniosek — praktyka** | wyjątek „bez animacji” |
| Kettlebell Swing | mis | `["wniosek", "kb.hips"]` | **wniosek — praktyka** | |
| Preacher Curl | move, mis | R, F, M (+S sztanga) | **komplet 3 — praktyka** | R, M jednorącz, F oburącz — recenzent; wyjątek „bez animacji” |
| Standing Concentration Curl | setup, move, mis | R, F, M | **komplet 3 — praktyka** | M: dwa hantle — uproszczenie, recenzent |
| Lying Close-Grip Bar Curl On High Pulley | setup, move, mis | F, S | **2 z 3** | |
| Lying Cable Curl | — | M | **brak (1 z 3)** | F, S mają tylko wersję z wyciągiem górnym |
| Lying Supine Dumbbell Curl | — | — | **brak** | |
| Seated Close-Grip Concentration Barbell Curl | — | — | **brak** | |
| Standing Inner-Biceps Curl | — | — | **brak** | |
| Upright Row (linki) | setup, move, mis | S (wyciąg), F (sztanga), R (guma) | **komplet 3 — praktyka + uproszczenie (wariant sprzętu)** | F i R liczą się dopiero po potwierdzeniu recenzenta; mis: S, R |
| Smith Machine Upright Row | — | jak Upright Row | **uproszczenie — recenzent; inaczej brak** | |
| Dumbbell One-Arm Upright Row | — | — | **otwarte** | wersji jednorącz nie szukano osobno; przeczytane strony opisują tylko oburącz |
| Smith Machine One-Arm Upright Row | — | — | **otwarte** | jw. |
| Y Raise (hantle) | setup / move / mis | R, F (+S guma) | **setup 2 z 3; move komplet 3 (S uproszczenie); mis 2 z 3** | M tylko z gumą |
| Machine Lateral Raise | — | — | **brak** | |
| Cable Y Raise | — | — | **brak** | |

Niezrobione (51): pozostałe delt_raise (Barbell Front Raise to Overhead, Barbell Incline Shoulder Raise, Cable Reverse Fly, Cable Seated Lateral Raise,
Car Drivers, Dumbbell Front Raise to Overhead, Dumbbell Incline Shoulder Raise, Front Incline Dumbbell Raise, Kettlebell Halo with Overhead Extension,
One-Arm Cable Rear Lateral Raise, One-Arm Incline Lateral Raise, Single Dumbbell Front Raise, Sled Reverse Flye, Smith Incline Shoulder Raise,
Straight Raises on Incline Bench), forearm (4), kb_ballistic (5), olympic (3), pull_up/pulldown (Muscle Up, Full Range-Of-Motion Lat Pulldown),
cable_row (3), row/shrug (Barbell Rear Delt Row, Calf-Machine Shoulder Shrug, Middle Back Shrug), carry (2), sled_throw (8), strongman (8) — lista w `STAN-D.md`.

## Część 1 — szczegóły, zdania PL + EN, cytaty

### High Cable Curl — 2 z 3
- **F** https://www.fabrykasily.pl/cwiczenia/na-biceps/jednoczesne-zginanie-przedramion-stojac-z-wykorzystaniem (2015-12-22, bez autora):
  „Ramiona wyciągnięte, uchwyty wyciągu trzymane podchwytem.”; „wykonaj mocne zgięcie przedramion w pełnym zakresie ruchu”; „Nie szarp ciężaru.”
- **S** https://potreningu.pl/atlas-cwiczen/dla-kobiet/291/uginanie-przedramion-na-wyciagu-gornym-stojac-w-bramie (bez autora i daty):
  „Stań w lekkim rozkroku pomiędzy linkami wyciągów górnych.”; „Złap podchwytem rączki.”; „Ruch powinien być płynny.”
- Propozycja (gdy trzecie źródło): setup PL „Stań między dwoma górnymi wyciągami i chwyć uchwyty podchwytem, ręce wyciągnięte w bok.” EN „Stand between two high pulleys and take the handles underhand, arms out to the sides.” („w bok” — z F; S nie mówi wprost);
  move PL „Ugnij ręce w łokciach, potem płynnie wróć.” EN „Curl your arms, then return smoothly.”; mis PL „Szarpanie ciężaru.” EN „Jerking the weight.”
- Bez wyniku: R — https://centrumrespo.pl/atlas/kategoria/biceps/ str. 1–4 (tylko wyciąg dolny), wyszukiwanie w domenie „uginanie przedramion wyciąg górny brama biceps”;
  M — https://maniacmuscle.com/category/arms/biceps/, wyszukiwanie „cable high curl double biceps crossover”.

### Meadows Row — brak w 4 serwisach
Wyszukiwanie „Meadows row” w 5 domenach listy — tylko inne wiosłowania. Propozycja błędu (wniosek, jeśli setup mówi o stabilnym tułowiu):
PL „Obracanie tułowia przy przyciąganiu.” EN „Twisting your torso as you pull.” — koordynator dobiera id zdania bazowego.

### Medicine Ball Slam — setup 2 z 3, mis wniosek
- **F** https://www.fabrykasily.pl/cwiczenia/crossfit/slam-ball-uderzenia-pilka (2016-03-30): „Pozycja stojąca, nogi rozstawione na szerokość barków.”; „Piłka lekarska między nogami.”
- **S** https://potreningu.pl/atlas-cwiczen/crossfit/535/ball-slams: „Stań w lekkim rozkroku.”; „Chwyć piłkę lekarską, a następnie unieś ją na wyprostowanych ramionach nad głowę.”; „Należy pamiętać o prostych plecach.”
- setup PL „Stań w lekkim rozkroku, piłkę trzymaj oburącz.” EN „Stand with your feet about shoulder-width apart and hold the ball with both hands.”
- mis PL „Zaokrąglanie pleców przy rzucie i podnoszeniu piłki.” EN „Rounding your back as you slam or pick up the ball.”
- Bez wyniku: M — „medicine ball slam”; R — „slam ball piłka uderzenia”.

### Błędy jako wniosek z istniejących zdań
- Cable Curl (`curl.elbows`): PL „Odsuwanie łokci od tułowia w trakcie uginania.” EN „Letting your elbows drift away from your sides.”
- Lateral Raise (hantle) (`lat.setup`), Cable Lateral Raise (`clat.setup`): PL „Bujanie tułowiem, żeby unieść ciężar.” EN „Swinging your torso to get the weight up.”
- Front Raise (`front.elbows`): PL „Zginanie i prostowanie łokci w trakcie ruchu.” EN „Bending and straightening your elbows during the rep.”
- Reverse Fly (hantle) (`rear.setup`): PL „Unoszenie tułowia w trakcie ruchu.” EN „Raising your torso during the rep.”
- Reverse Pec Deck (`rpd.elbowsHigh`): PL „Opuszczanie łokci poniżej barków.” EN „Letting your elbows drop below your shoulders.”
- Kettlebell Swing (`kb.hips`): PL „Unoszenie kettlebella siłą barków zamiast bioder.” EN „Lifting the kettlebell with your shoulders instead of your hips.”
