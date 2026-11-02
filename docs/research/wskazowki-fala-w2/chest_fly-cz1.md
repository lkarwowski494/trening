# chest_fly (część 1, rozpiętki) — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Metoda: brief fali W2 (grupa G5) + CLAUDE.md („Merytoryczne podstawy”, „Wyjątek dla wskazówek techniki”, „Źródła publicznie anonimowo”).
Punkt wyjścia: W1 `chest_fly-cz1.md` (gałąź `badania/g5-pchanie`) i przeliczenie szczebli z 02.11.2026 z rozstrzygnięciami koordynatora 1.1
(poradnik Major Fitness o rozpiętkach na wyciągu z autorem NSCA-CPT i datą = 4 → Cable Fly (low to high) = karta częściowa).
Wszystkie strony przeczytane 02.11.2026 (WebFetch). Strony aplikacji treningowych z wyników wyszukiwania pominięte (nazwy nie zapisane).
Ról mięśni nie badałem: luki W1 (`role-miesni-fala-w1/chest_fly.md`) dotyczą tylko Bent-Arm Barbell Pullover, Around The Worlds i Crucifix — poza tym zakresem.

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Cable Fly (low to high) | gotowe — **dopisać do karty W1** (`mistakes`) | ustawienie + ruch z W1 (`cfly.low.setup`, `cfly.low.move`; ACE 163 + Major Fitness); błędy: `fly.mis.elbows`, `cfly.mis.torso` (po 2 źródła szczebla 4) — uwaga 1 |
| Band Chest Fly | gotowe — **dopisać do karty W1** (`mistakes`) | ustawienie + ruch + `bfly.arms` z W1; błąd wnioskowany `fly.mis.elbows` (zaprzeczenie `bfly.arms`) |
| Incline Chest Fly (hantle) | gotowe (nowa karta z błędem) | NFPT (artykuł z autorem z certyfikatami i datą) + BarBend; uwaga 2 o szczeblu NFPT |
| Decline Dumbbell Fly | otwarte | ruch, łokcie i `bp.mis.arch` mają 2 źródła; ustawienie — nie (Otwarte 1) |
| Pec Deck | otwarte | nadal tylko Hoist; tablica ćwiczeń Body-Solid tylko jako kopia u dystrybutora (Otwarte 2) |
| One-Arm Flat Bench Dumbbell Fly | otwarte | tylko BarBend (sekcja Single-Arm Dumbbell Flye) — Otwarte 3 |
| Cable Fly (high to low) | otwarte | bez zmian względem W1 — tylko Major Fitness |
| Single Arm Cable Fly | otwarte | bez zmian względem W1 |
| Incline Cable Fly | otwarte | bez zmian — brak źródła o wersji leżąc na ławce skośnej |
| Flat Bench Cable Fly | otwarte | bez zmian — Major Fitness opisuje wersję siedząc i wersję na ławce skośnej w dół, nie leżąc płasko |

Uwaga 1 (Cable Fly (low to high)): oba błędy Major Fitness stoją w części ogólnej poradnika („Step 5: Three Mistakes to Avoid”), a wersja
z dołu do góry jest w tym samym poradniku opisana jako odmiana tego samego ruchu (inne ustawienie bloczków). Drugie źródło (ACE 163) dotyczy
wprost tej wersji. Recenzent: sprawdzić, czy uznaje część ogólną Major Fitness za obejmującą tę odmianę; jeśli nie — `cfly.mis.torso` zostaje
z jednym źródłem (wypada), a `fly.mis.elbows` ma nadal ACE 163 (zaprzeczenie standardu) — wtedy dopisać `["wniosek", ...]` nie da się
(żadne potwierdzone zdanie tej karty nie mówi o łokciach), więc karta wraca do „częściowe”.

Uwaga 2 (NFPT): W1 oceniło `nfpt-incline-fly` jako 5 („Guest” bez kwalifikacji). 02.11.2026 strona pokazuje pod podpisem „Guest” biogram
Roberta Bovee z certyfikatami „Certified Master PPT, RTS, ETS, FTS” i datę 11.08.2025. Wg pliku szczebli (NFPT: „Liczy się artykuł z autorem,
datą i kwalifikacjami w biogramie”) → 4. Do potwierdzenia przez koordynatora, że te skróty to kwalifikacje trenerskie (nie rozwijałem ich na
przeczytanej stronie). Jeśli NFPT = 5 — Incline Chest Fly (hantle) wraca do „otwarte”.

### Blok do wdrożenia

```json
{
 "Cable Fly (low to high)": {
  "mistakes": [
   {"c": "fly.mis.elbows", "s": [
     ["majorfitness-cable-fly", "Step 5: Three Mistakes to Avoid — „Elbows bending too much”"],
     ["ace-163", "Step 2–4 (keep the same slight elbow bend — błąd = zaprzeczenie standardu)"]]},
   {"c": "cfly.mis.torso", "s": [
     ["ace-163", "Warnings (avoid the tendency to lean forward during this exercise)"],
     ["majorfitness-cable-fly", "Step 5: Three Mistakes to Avoid — „Rocking your torso to finish the rep”"]]}
  ]
 },
 "Band Chest Fly": {
  "mistakes": [
   {"c": "fly.mis.elbows", "s": [["wniosek", "bfly.arms"]]}
  ]
 },
 "Incline Chest Fly (hantle)": {
  "setup": [
   {"c": "dfly.setup", "s": [
     ["nfpt-incline-fly", "instrukcja, krok 1 (lie back on the incline bench, arms extended straight up toward the ceiling)"],
     ["barbend-dumbbell-flye-variations", "Incline Dumbbell Flye > How to Do the Incline Dumbbell Flye (lay back on the bench with dumbbells in your hands; slight bend in your elbows)"]]}
  ],
  "move": [
   {"c": "dfly.move", "s": [
     ["nfpt-incline-fly", "instrukcja (lower the weights out to the sides with elbows slightly bent; raise back to the start)"],
     ["barbend-dumbbell-flye-variations", "Incline Dumbbell Flye > How to Do… (open the arms wide to a deep chest stretch; hugging motion back up)"]]}
  ],
  "tips": [
   {"c": "fly.elbows", "s": [
     ["nfpt-incline-fly", "instrukcja (keeping elbows slightly bent — przy opuszczaniu i unoszeniu)"],
     ["barbend-dumbbell-flye-variations", "Incline Dumbbell Flye > How to Do… („Maintain a slight bend in your elbows.”)"]]}
  ],
  "mistakes": [
   {"c": "fly.mis.elbows", "s": [
     ["wniosek", "fly.elbows"],
     ["barbend-dumbbell-flye-variations", "Incline Dumbbell Flye > How to Do… (hugging a tree rather than pressing them straight up)"],
     ["nfpt-incline-fly", "lista błędów (avoid locking out your elbows after you have raised the dumbbells)"]]}
  ]
 }
}
```

Uwagi do bloku:
- `dfly.setup` („Połóż się na ławce, hantle nad klatką, łokcie lekko ugięte.”) pasuje dosłownie do wersji na ławce skośnej — nie mówi o kącie
  ławki; kąt zostaje bez liczby (NFPT „30 to 45 degrees”, BarBend „45 degrees works well for most folks” — tylko część wspólna „około 45°”,
  ale liczby kątów nie wpisuję w tej fali). Kąt pokazuje rysunek (`poses/chest_fly.json`, „Incline Chest Fly (hantle)”).
- `dfly.move` „wróć tym samym łukiem” — BarBend wprost (ruch obejmowania, nie wyciskanie w górę); NFPT mówi tylko „raise back” i nie przeczy.
- `fly.mis.elbows` przy hantlach na skosie obejmuje oba kierunki: zginanie (BarBend: nie wyciskać w górę) i prostowanie do blokady (NFPT).
- Pominięte (jedno źródło): `bp.mis.arch` przy Incline (tylko NFPT; BarBend każe utrzymać lekki łuk w górnej części pleców — nie przeczy
  wprost, ale nie potwierdza); `fly.control` przy Incline (tylko NFPT: opuszczanie przez kilka sekund).

## Nowe zdania (id | PL | EN)

| id | PL | EN (propozycja) |
|---|---|---|
| fly.mis.elbows | Zginanie i prostowanie łokci w trakcie powtórzenia. | Bending and straightening your elbows during the rep. |
| cfly.mis.torso | Bujanie tułowiem albo pochylanie się w przód, żeby dokończyć powtórzenie. | Rocking or leaning your torso forward to finish the rep. |

`fly.mis.elbows` — wspólne dla rodziny (prefiks `fly.` jak `fly.elbows`, `fly.control`); jest dokładnym zaprzeczeniem `fly.elbows`
(„w stałym kącie”) i `bfly.arms` („nie zginaj łokci w trakcie ruchu”), da się pokazać na rysunku (zmiana kąta w łokciu).
`cfly.mis.torso` — część wspólna ACE 163 (pochylanie w przód w trakcie) i Major Fitness (bujanie tułowiem); bez twierdzenia o barku (ACE wiąże
pochylenie z obciążeniem barku — twierdzenie o zdrowiu, nie w tej fali).

## Źródła

| id | adres | organizacja | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|---|
| ace-163 | https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/163/standing-incline-cable-flyes/ | ACE (z W1) | 4 — organizacja szkoląca trenerów, biblioteka ćwiczeń | Starting Position; Step 2–4; Variations; Warnings |
| majorfitness-cable-fly | https://www.majorfitness.com/blogs/training-tips/cable-chest-fly | Major Fitness (z W1) | 4 — rozstrzygnięcie koordynatora 1.1 (02.11.2026): autor Alan Wang, NSCA-CPT, NASM-CES, data 13.05.2026 widoczna na stronie | Step 5: Three Mistakes to Avoid; sekcje odmian |
| therabend-chest-flies, ace-160, bodylastics-crossover-fly | jak w W1 | jak w W1 | 4 (W1) | tylko przez `bfly.arms` (wniosek) |
| barbend-dumbbell-flye-variations | https://barbend.com/dumbbell-flye-variations/ | BarBend (nowe) | 4 — warunkowo 4: autor Alex Polish, NASM-CNC, ACE-CPT, SITA-SIFS; „Last updated on November 27th, 2024” | Incline / Decline / Single-Arm Dumbbell Flye > How to Do… |
| nfpt-incline-fly | https://nfpt.com/how-to-do-incline-bench-dumbbell-flyes/ (W1: https://nfpt.com/?p=4355) | NFPT | 4 (było 5 w W1) — biogram Robert Bovee, „Certified Master PPT, RTS, ETS, FTS”; 11.08.2025 — uwaga 2 | instrukcja; lista błędów |
| nfpt-decline-fly | https://nfpt.com/how-to-do-decline-bench-dumbbell-flyes/ | NFPT (ta sama org. co wyżej) | 4 (ten sam autor i data) — **tylko do Otwartych** (błąd w opisie ustawienia, Otwarte 1) | instrukcja; lista błędów |
| bodysolid-dpec-chart | https://orbitfitness.com.au/cdn/shop/files/exercise_chart_for_dpec-sf_pec_reardelt_machine.pdf | tablica ćwiczeń Body-Solid Pro-Dual DPEC („© 2006 Body-Solid, Inc.”) w plikach dystrybutora | nie źródło (kopia niepotwierdzona, uzup. 3) — tylko do Otwartych | „PEC FLY (PECTORALS)”, Instructions |
| healthline-pec-deck | https://www.healthline.com/health/pec-deck | Healthline | 5 — autorka bez kwalifikacji (recenzent Daniel Bubnis, M.S., NASM-CPT; 31.05.2019); wg „Reguły ogólnej” pliku szczebli autor musi mieć kwalifikacje — tylko do Otwartych | instrukcja pec deck |

Niezależność: BarBend i NFPT — różne organizacje; NFPT + BarBend nie są parą „ISSA + NFPT” z otwartego pkt 4 pliku szczebli.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| 1. Decline Dumbbell Fly — ustawienie | NFPT (decline) pisze „lay on a decline bench (your head above your feet)” — to przeczy samej definicji ławki skośnej w dół (głowa niżej niż stopy), więc tej strony nie używam do ustawienia; BarBend (Decline Dumbbell Flye) — ustawienie ławki „at the same angle you use for a decline bench press”, łopatki ściągnięte, lędźwie dociśnięte, bez pozycji hantli na starcie. Kandydaci z 2 źródłami (do karty, gdy znajdzie się drugie źródło ustawienia): `dfly.move` (NFPT: lower out to the side…, raise straight up; BarBend: lower out to your sides, return along the same path), `fly.elbows` (NFPT: elbows slightly bent; BarBend: „Keep a soft bend in your elbows.”), `bp.mis.arch` (NFPT: „Do not excessively arch your back or raise your hips off the bench.”; BarBend: lędźwie dociśnięte do ławki — zaprzeczenie standardu). Zaczepienie stóp — bez źródła |
| 2. Pec Deck (cała karta) | nadal tylko Hoist (jedna organizacja). Tablica Body-Solid DPEC (siedzisko tak, by ramiona były równoległe do podłogi; plecy płasko przy oparciu; ręce lekko ugięte; ramiona maszyny do zetknięcia; powolny powrót) — plik u dystrybutora; na bodysolid.com strona produktu DPEC linkuje tylko instrukcję montażu (DPEC.pdf, s. 2 bez opisu ćwiczeń), kartę danych i schemat — zgodności tablicy z oryginałem producenta nie potwierdziłem. Uwaga merytoryczna: Body-Solid ustawia siedzisko wg ramion równoległych do podłogi, kandydat W1 `pdeck.seat` — uchwyty na wysokości barków; przy wdrożeniu sprawdzić zgodność. Healthline (5) — maszyna z poduszkami na przedramiona (łokcie 90°), inny typ niż figura |
| 3. One-Arm Flat Bench Dumbbell Fly | tylko BarBend (Single-Arm Dumbbell Flye: ustawienie jak w zwykłej rozpiętce, ciężar w jednej ręce; drugi bark dociśnięty do ławki, żeby tułów się nie skręcał). Drugiego źródła o wersji jednorącz na ławce nie znalazłem; analogia do Chest Fly (hantle) nie jest wariantem sprzętu (zmienia się praca tułowia) — nie stosuję |
| 4. Incline Chest Fly (hantle) — `bp.mis.arch`, `fly.control` | po jednym źródle (NFPT) |
| 5. Cable Fly (low to high) — barki w przód na górze | tylko Major Fitness („Shoulders creeping forward at the top”) |
| 6. Cable Fly (high to low), Single Arm Cable Fly, Incline Cable Fly, Flat Bench Cable Fly | bez nowych źródeł w tej fali (powody jak w W1, Otwarte 3, 5, 8). Major Fitness ma też „Decline Cable Fly” (leżąc na ławce skośnej w dół) — nie odpowiada żadnemu z tych ćwiczeń |
| 7. Szczebel NFPT (uwaga 2) | skróty certyfikatów w biogramie do potwierdzenia przez koordynatora |

## Podsumowanie

- Ćwiczeń zbadanych: 10 (część 1 rodziny chest_fly).
- Karty z błędami: 3 — nowa: Incline Chest Fly (hantle); dopisane błędy do kart częściowych W1: Cable Fly (low to high), Band Chest Fly. Nowe karty bez błędów: 0.
- Błędy wnioskowane: 2 (`fly.mis.elbows` przy Band Chest Fly z `bfly.arms`; przy Incline Chest Fly z `fly.elbows`, tam także ze źródeł). Błędy ze źródeł: 2 (Cable Fly (low to high)).
- Role mięśni: 0 (brak luk dla tych ćwiczeń).
- Otwarte ćwiczenia: 7 (Decline Dumbbell Fly — blisko, brak tylko ustawienia).
- Nowe zdania: 2 (`fly.mis.elbows`, `cfly.mis.torso`). Nowe źródła: 2 liczące się (BarBend, NFPT decline — tylko otwarte) + NFPT incline przeszacowane 5 → 4; 2 tylko do otwartych (Body-Solid kopia, Healthline).

Zostało (następny krok): drugie źródło ustawienia dla Decline Dumbbell Fly (organizacja szkoląca albo szpital z opisem wersji na ławce w dół);
drugi producent pec deck z instrukcją na własnej domenie (Body-Solid: szukać tablicy DPEC na bodysolid.com; Matrix, Technogym);
pułapki: ManualsLib i kopie u dealerów nie liczą się bez oryginału; PDF-y producentów to często obrazy (czytać stronami, nie WebFetch).
