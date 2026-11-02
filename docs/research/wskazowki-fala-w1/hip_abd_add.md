# Wskazówki techniki — rodzina `hip_abd_add` (fala W1, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny (dwie sesje: Lateral Band Walk — sesja 1; uzupełnienia pozostałych — sesja 2)
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## Korekta szczebli 2 (02.11.2026)

Zastosowano ROZSTRZYGNIĘCIE 2 koordynatora linii 1.1 (02.11.2026, ok. 07:55). Bez nowych źródeł.

- **The Prehab Guys** (`prehab-tag-lateral-band-walk`, `prehab-standing-hip-adduction-band`, `prehab-standing-hip-flexion-band`) 4 → **5**: strony `vimeo-video`/`vimeo-tag` bez autora i kwalifikacji (sprawdzone 02.11 na dwóch stronach `vimeo-video` tego serwisu — ten sam szablon; opis w `glute_floor.md`).
- **HKU CSE** (`hku-shsc-legs`) „do oceny” → **5** (uczelniane centrum sportu bez autora). **Physitrack** → 5 (w tym pliku nie liczony; strony Monster Walk i „lateral band walks” i tak odrzucone).
- Potwierdzone 4: NASM, ACE, ISSA, Life Fitness (tylko własne maszyny). Western SRS — 5 bez zmian.
- **Lateral Band Walk** — zostaje gotowe: każde zdanie ma nadal NASM + ACE; usunięte odwołania do Prehab.
- **Cable Hip Adduction** — było otwarte; po korekcie `hadd.setup`, `hadd.move`, `fp.chest` mają tylko ACE 104 (Prehab — 5).
- **Band Hip Adduction** — było otwarte; `hadd.setup` i `hadd.move` zostają z 2 źródłami (ISSA + ACE 104, wariant: wyciąg); `fp.chest` — tylko ACE 104.
- Reguła błędów: w tym pliku nie ma zdań błędów w blokach JSON — bez zmian.
- Gotowe: przed 1 → po **1** (Lateral Band Walk).

Metoda: brief fali W1 i `docs/research/33-wskazowki-partia2.md` („Metoda”). Każde zdanie ma ≥ 2 przeczytane źródła szczebla 4
z różnych organizacji; żadne przeczytane źródło mu nie przeczy. Bez liczb i bez twierdzeń zdrowotnych. Szczeble organizacji wg rozstrzygnięć
koordynatora linii 1.1 z 02.11.2026 (Western SRS = 5; producenci = 4 tylko dla własnego sprzętu; rozstrzygnięcie 2 — wyżej).

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Hip Abduction | otwarte | instrukcja producenta Life Fitness (SL60) — jedna organizacja szczebla 4; Western SRS = 5; ACE 155 bez opisu (docs/33) |
| Hip Adduction | otwarte | instrukcja producenta Life Fitness (SL55) — jedna organizacja; ACE 104 i HKU opisują wyciąg, nie maszynę |
| Cable Hip Abduction | otwarte | HKU s. 5 (szczebel 5) + T Nation (szczebel nieoceniony); brak źródeł szczebla 4 |
| Cable Hip Adduction | otwarte | po korekcie 2 każde zdanie ma tylko ACE 104 (Prehab — 5) |
| Lateral Band Walk | **gotowe** | NASM, ACE (2 artykuły = jedna organizacja) |
| Monster Walk | otwarte | źródła różnie definiują ćwiczenie (ACE: chód w bok; inne: krok w przód/skos); strona Physitrack wewnętrznie sprzeczna |
| Band Hip Adduction | otwarte | ustawienie i ruch: ISSA + ACE 104 (wariant: wyciąg); brak zdań wskazówek/błędów z 2 źródłami |
| Hip Flexion with Band | otwarte | ACE 133 nie podaje wprost kierunku ruchu nogi; Prehab — 5; ACE 6315 — wersja izometryczna |

## Wpisy do `cues.json` → `exercises`

```json
{
  "Lateral Band Walk": {
    "setup": [
      {"c": "bw.setup", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „Place the mini-band just above your knees (or lower…)”, „feet hip-width apart”"],
        ["ace-pro-5043", "Lateral Band Walks — taśma na podudziach nad kostkami"],
        ["ace-pro-6315", "Monster Walks (wersja: chód w bok) — taśma tuż nad kolanem"]
      ]}
    ],
    "move": [
      {"c": "bw.move", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „sidestep in one direction with slow and controlled steps”"],
        ["ace-pro-6315", "Monster Walks — chód w bok, krok zaczyna noga prowadząca"]
      ]}
    ],
    "tips": [
      {"c": "bw.squat", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „Keep your knees bent … athletic stance (almost a squat)” w trakcie kroków"],
        ["ace-pro-6315", "Monster Walks — „keep a soft bend at the knees”"]
      ]},
      {"c": "bw.tension", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — stopy co najmniej na szerokość bioder „to maintain resistance in the band”"],
        ["ace-pro-6315", "Monster Walks — „Maintain resistance with the band”"]
      ]}
    ],
    "mistakes": []
  }
}
```

Uwaga do zestawu ogólnego: obecny zestaw (`cue-sets.json`) ma błąd `mis.jerk` („…rzucanie ciężarem…”) — przy gumie brzmi nietrafnie i żadne
przeczytane źródło nie opisuje tego błędu przy tym ćwiczeniu; w karcie powyżej go nie ma.

Uwaga do `bw.move` („drugą nogę dostaw spokojnie”): „spokojnie” opiera się na NASM („slow and controlled steps”); ACE 6315 opisuje chód w bok bez słowa o tempie, ale mu nie przeczy. Przed korektą 2 drugim źródłem tej części była strona Prehab (teraz 5) — koordynator może skrócić zdanie do „Zrób krok w bok i dostaw drugą nogę.”, jeśli uzna, że ACE nie potwierdza „spokojnie”.

## Nowe zdania

| id | PL | EN (propozycja) | Potrzeba |
|---|---|---|---|
| bw.setup | Minigumę załóż nad kolanami albo niżej, nad kostkami; stopy na szerokość bioder. | Put the mini band above your knees or lower, above your ankles; feet hip-width apart. | brak zdania o ustawieniu marszu z gumą |
| bw.move | Zrób krok w bok, a drugą nogę dostaw spokojnie. | Step to the side, then bring the other foot over slowly. | brak zdania o przebiegu ruchu |
| bw.tension | Guma ma być napięta przez cały czas — nie pozwól jej się poluzować. | Keep the band tight the whole time — don't let it go slack. | wspólna wskazówka NASM i ACE; brak istniejącego zdania |

Zdanie istniejące użyte: `bw.squat`.

Propozycje zdań dla ćwiczeń jeszcze otwartych (do użycia, gdy dojdą brakujące źródła — w „Otwarte”):

| id | PL | EN (propozycja) | Potrzeba |
|---|---|---|---|
| hadd.setup | Załóż mankiet albo gumę na kostkę nogi, która będzie pracować. | Strap the cuff or loop the band around the ankle of your working leg. | ustawienie przywodzenia na stojąco (wyciąg i guma) |
| hadd.move | Przeprowadź nogę do środka, przed nogę podporową, i wróć. | Bring your leg in, across in front of your standing leg, then return. | ruch przywodzenia na stojąco |

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| nasm-blog-active-recovery | https://www.nasm.org/resource-center/blog/active-recovery | NASM | 4 | sekcja „Lateral Band Walk”: „sidestep in one direction with slow and controlled steps” |
| ace-pro-5043 | https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/ | ACE | 4 | E. Kovar, 22.09.2014, „Lateral Band Walks” |
| ace-pro-6315 | https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/ | ACE | 4 | E. Kovar, 01.03.2017, „Monster Walks”, „Clam Shells”: „Maintain resistance with the band and keep a soft bend at the knees.” |
| prehab-tag-lateral-band-walk | https://theprehabguys.com/vimeo-tag/lateral-band-walk/ | The Prehab Guys | **5** (korekta 2: bez autora) | „Side Step”, „Side Step – Band, On Toes”, „Side Step – Knees Straight, Band” — nie liczy się |
| ace-104 | https://www.acefitness.org/resources/everyone/exercise-library/104/standing-hip-adduction/ | ACE | 4 | Standing Hip Adduction (wyciąg): „Keep the back straight and the left knee slightly bent” — tylko w „Otwarte” |
| hku-shsc-legs | https://www.cse.hku.hk/document/exercises-SHSC-GlutesQuadsHipHamstrings.pdf | HKU CSE (uczelniane centrum sportu) | **5** (korekta 2) | s. 5 Cable Hip Abduction; s. 6 (adduction): „Kick the strapped leg inwards, crossing the other leg while keeping a straight posture.” — nie liczy się |
| western-hips | https://uwo.ca/campusrec/orientation/equipment_guides/hips_and_glutes.html | Western SRS | 5 (rozstrzygnięcie 02.11) | „Hip Abductions/Adductions”, „LF Hip and Glute” — nie liczy się do dwóch źródeł |
| prehab-standing-hip-adduction-band | https://theprehabguys.com/vimeo-video/standing-hip-adduction-band/ | The Prehab Guys | **5** (korekta 2) | COMPENSATION: „Do not let your body move!” — nie liczy się |
| issa-gracilis | https://www.issaonline.com/blogs/strength/gracilis-muscle-pain-causes-stretches-strength-exercises | ISSA | 4 (treść firmowana „ISSA”, 05.02.2024) | „Standing thigh adduction with a resistance band”: „Stand with one end of the band around the ankle and the other around a stationary object.” — tylko w „Otwarte” |
| lf-pro-sl60 | https://www.manualsdir.com/manuals/166239/life-fitness-pro-series.html?page=35 | Life Fitness (producent, własny sprzęt) | 4 | instrukcja Pro Series, Hip Abductor (SL60): „Hold the handles and slowly move the pads out, pushing with the knees.” — tylko w „Otwarte” (kopia instrukcji w serwisie z instrukcjami) |
| lf-pro-sl55 | https://www.manualsdir.com/manuals/166239/life-fitness-pro-series.html?page=34 | Life Fitness (producent, własny sprzęt) | 4 | Hip Adductor (SL55): „Hold the handles and slowly move the pads in, pushing with the knees.” — tylko w „Otwarte” |
| ace-133 | https://www.acefitness.org/resources/everyone/exercise-library/133/standing-leg-extension/ | ACE | 4 | Standing Leg Extension: mankiet na kostce, zaczep „behind your body” — tylko w „Otwarte” |
| prehab-standing-hip-flexion-band | https://theprehabguys.com/vimeo-video/standing-hip-flexion-with-band/ | The Prehab Guys | **5** (korekta 2) | HOW: „Place a resistance band around your ankle.” — nie liczy się |

```json
{
  "nasm-blog-active-recovery": {"org": "NASM", "title": "Active Recovery: Benefits, Examples & Best Practices (blog NASM) — Lateral Band Walk", "url": "https://www.nasm.org/resource-center/blog/active-recovery", "level": 4},
  "ace-pro-5043": {"org": "ACE", "title": "Kovar E.: How to Self-Care for the IT Band (ACE, 22.09.2014)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/", "level": 4},
  "ace-pro-6315": {"org": "ACE", "title": "Kovar E.: 8 Hip-strengthening Exercises Using the Versa Loop (ACE, 01.03.2017)", "url": "https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/", "level": 4}
}
```

Uwaga: „Versa Loop” w tytule ACE to nazwa sprzętu z tytułu artykułu — przy integracji można skrócić tytuł. Źródła oznaczone „tylko w »Otwarte«”
nie mają wpisu JSON — dopisać przy domknięciu ćwiczenia. Źródła szczebla 5 — bez wpisu (gdyby koordynator chciał je zapisać: `level: 5`).

## Otwarte

- **Hip Abduction** (maszyna) — Life Fitness SL60: siad, stopy na podpórkach, kolana razem, „slowly move the pads out, pushing with the knees”, chwila
  w skrajnym położeniu, powolny powrót; Western (szczebel 5) — zgodny. Jedna organizacja szczebla 4. Instrukcja Cybex VR2 (manualslib, s. 48–50)
  ma tylko opis oparcia i zakresu, bez kroków; Cybex Eagle (notice-facile) — 403. Rozstrzygnie: drugi producent z krokami ćwiczenia (np. instrukcja
  albo naklejka maszyny innej marki).
- **Hip Adduction** (maszyna) — Life Fitness SL55: kolana rozstawione na starcie, „slowly move the pads in, pushing with the knees”, powolny powrót.
  Jedna organizacja. Rozstrzygnie: jak wyżej.
- **Cable Hip Abduction** — HKU s. 5 („Kick out the strapped leg to the side while keeping a straight posture.”; szczebel 5) i T Nation (M. Shaughnessy, 06.05.2021,
  https://archive.t-nation.com/training/cable-glute-exercises-form/: stań prosto na podwyższeniu, linka za nogą podporową, prowadź piętą, krótki zakres;
  błąd: trzymanie się i opieranie o maszynę; szczebel nieoceniony — wydawca związany z producentem suplementów) — żadne nie liczone. Uwaga: T Nation uznaje trzymanie się maszyny za błąd, a przy Cable Kickback źródła każą się trzymać — różne ćwiczenia, ale przy
  ustawieniu odwodzenia nie wpisywać „trzymaj się” bez rozstrzygnięcia.
- **Cable Hip Adduction** (korekta 2) — `hadd.setup` (ACE 104 przygotowanie), `hadd.move` (ACE 104 „directly in front of the left foot”), `fp.chest` „Tułów stabilny i wyprostowany.”
  (ACE 104 „Keep the back straight”) — każde z 1 źródłem szczebla 4; Prehab (wariant: guma) i HKU s. 6 — 5. „Napnij brzuch” — tylko Prehab (5);
  „powoli wracaj”, „noga podporowa lekko ugięta” — tylko ACE. Rozstrzygnie: druga organizacja szczebla 4 z opisem przywodzenia na stojąco (wyciąg albo guma) i trzecie zdanie wskazówek.
- **Band Hip Adduction** — z 2 źródłami szczebla 4: `hadd.setup` (ISSA „band around the ankle and the other around a stationary object”; ACE 104 — wariant: wyciąg),
  `hadd.move` (ISSA „closer to the body's midline”; ACE 104 — wariant: wyciąg). `fp.chest` — tylko ACE 104 (Prehab — 5). Brakuje dwóch zdań wskazówek/błędów. Rozstrzygnie: druga organizacja szczebla 4 opisująca wskazówki przywodzenia z gumą.
- **Hip Flexion with Band** — ACE 133 „Standing Leg Extension”: mankiet na kostce, zaczep za plecami, unieś stopę, prostuj kolano, powoli wróć;
  koniec zakresu, gdy biodra lub tułów odchylają się w tył. Prehab „Standing Hip Flexion With Band” (szczebel 5): guma na kostce, stań na jednej nodze, napnij
  udo i najpierw wyprostuj kolano, potem „kick out”. Żadne nie podaje wprost kierunku ruchu („w przód” to wniosek z tytułu i ustawienia zaczepu) —
  nie wpisuję. Rozstrzygnie: dwa źródła szczebla 4 z jawnym opisem uniesienia nogi w przód z gumą.
- **Monster Walk** — ACE 6315 nazywa „Monster Walks” chód w bok, a strony Physitrack (szczebel 5) i wyniki wyszukiwania opisują marsz w przód/skos; strona Physitrack sama sobie przeczy (taśma przy kostkach vs nad kolanami, kolana ugięte vs proste). Najpierw ustalić, który ruch pokazuje figura `bandWalk` dla tego klucza — to pytanie do koordynatora/figur, potem źródła.
- **The Prehab Guys w `cues.json`** — organizacja zapisana tam jako szczebel 4; strony `vimeo-video`/`vimeo-tag` nie mają autora. Decyzja koordynatora: zmiana szczebla całej organizacji albo tylko tych stron.
- **Zestawy ogólne (informacja o błędach zestawów):** dla Hip Abduction/Adduction i Cable Hip Abduction/Adduction zestaw zawiera `hab.hips` („Biodra i tułów nieruchomo…”) i `llc.control` — przeczytane źródła potwierdzają tylko „stój prosto / plecy proste”, nie „biodra nieruchomo”; `hab.mis.high` („Noga za wysoko — biodro się przechyla”) — nie znalazłem źródła. Uzupełnienie sesji 2: przy maszynach Life Fitness zgodne z `llc.control` jest tylko „slowly … slowly return” (jedna organizacja); przy przywodzeniu z gumą Prehab „Do not let your body move!” pasuje do `hab.hips`, ale to źródło szczebla 5.

## Dostęp

- ExRx i web.archive.org — nie próbowano (polecenie koordynatora: 403/blokada).
- NASM exercise library: `tube-walking-side-to-side`, `side-lying-hip-abduction` → 404.
- Physitrack „lateral band walks” opisuje inne ćwiczenie (marsz w przód z oporem asystenta) — nie użyto. Physitrack „monster walk with band” — wewnętrznie sprzeczny, nie użyto.
- The Prehab Guys „Monster Walk – Band” — za logowaniem.
- Speediance „cable hip abduction” — brak opisu.
- HKU PDF — tekst w obrazach; przeczytane strony 4–7 jako obraz.
- notice-facile.com (instrukcja Cybex Eagle Hip Ab-Ad) — 403; manuals.online (Life Fitness Hip Abduction/Adduction) — 404.
- Wyniki wyszukiwania dla maszyn to w większości serwisy aplikacji treningowych i sklepy — pominięte, nie zapisane.
