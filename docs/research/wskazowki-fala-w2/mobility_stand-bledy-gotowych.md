# Błędy („Czego unikać”) — rodzina `mobility_stand`, 15 ćwiczeń gotowych po W1

Data: 02.11.2026. Autor: badacz-merytoryczny (agent), fala W2, grupa G2 mobilność. Zakres: TYLKO błędy dla ćwiczeń, które po przeliczeniu W1
(02.11.2026) są „gotowe”; nie szukałem nowych zdań ustawienia ani ruchu. Podstawa: bloki JSON z plików fali W1 rodziny `mobility_stand`
(statyczne, statyczne-2, statyczne-3, dynamiczne, dynamiczne-uzupełnienie; późniejszy plik wygrywa) z pominięciem zdań z listy
„Zdania do pominięcia” przeliczenia W1 (żadne zdanie setup/move tych 15 ćwiczeń nie jest na tej liście).

**Metoda.** (a) Błąd ze źródeł — źródło W1 już opisuje błąd wprost albo standard; przy jednym źródle podającym błąd wprost drugim jest źródło
standardu tylko wtedy, gdy błąd jest jego bezpośrednim zaprzeczeniem (ta sama część ciała, to samo kryterium) — oznaczenie „błąd = zaprzeczenie
standardu” (reguła z uzupełnienia 2 rozstrzygnięcia szczebli, 02.11.2026). Strony ACE #152, #174, #202, #204, #211 i WebMD Ignite „Neck stretch
(front)” przeczytałem ponownie 02.11.2026 (jedno sprawdzenie strony), resztę miejsc biorę z odczytów W1. (b) Błąd wnioskowany — logiczne
zaprzeczenie potwierdzonego zdania ustawienia/ruchu tego ćwiczenia (id zdania podane), tylko takie, które da się pokazać na rysunku.
Bez liczb i twierdzeń o zdrowiu.

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan po W1 | Stan po W2 | Błędy (źródła / wnioskowane) | Uwaga |
|---|---|---|---|---|
| Chin To Chest Stretch (figura v2) | gotowe | gotowe | 1 / 1 | tylko `mistakes` |
| Side Neck Stretch (figura v2) | gotowe | gotowe | 1 / 1 | tylko `mistakes` |
| Overhead Triceps Stretch (figura v2) | gotowe | gotowe | 0 / 1 (+ `st.mis.force` z W1) | tylko `mistakes` |
| Standing Gastrocnemius Calf Stretch (figura v2) | gotowe | gotowe | 0 / 1 | tylko `mistakes`; W1 miało `mistakes: []` |
| Wall Calf Stretch (figura v2) | gotowe | gotowe | 2 / 0 (+ `heelUp`, `st.mis.force` z W1) | tylko `mistakes` |
| Standing Soleus And Achilles Stretch (figura v2) | gotowe | gotowe | 1 / 0 (+ `heelUp` z W1) | tylko `mistakes` |
| Chest And Front Of Shoulder Stretch | gotowe | gotowe | 1 / 0 | tylko `mistakes` |
| Cross-Body Shoulder Stretch | gotowe | gotowe | 1 / 0 | tylko `mistakes` |
| Overhead Stretch | gotowe | gotowe | 0 / 1 | tylko `mistakes` |
| Arm Circles | gotowe | gotowe | 0 / 1 | tylko `mistakes` |
| Ankle Circles | gotowe | gotowe | 0 / 1 | tylko `mistakes` |
| Standing Hip Circles | gotowe | gotowe | 0 / 1 | tylko `mistakes` |
| Wrist Circles | gotowe | gotowe | 0 / 1 | tylko `mistakes` |
| One Knee To Chest | gotowe | gotowe | 0 / 0 | brak błędu — patrz „Otwarte” |
| Standing Elevated Quad Stretch | gotowe | gotowe | 0 / 0 | brak błędu — patrz „Otwarte” (spór o postać „Elevated”) |

Razem: 7 błędów ze źródeł, 9 wnioskowanych, w 13 z 15 ćwiczeń.

## 2. Blok do wdrożenia

Lista `mistakes` DOPISUJE się do list z bloków W1 (nie zastępuje ich): zostają `mobility_stand.s.mis.heelUp` (Wall Calf, Soleus) i `st.mis.force`
(Wall Calf, Overhead Triceps — z `mobility_stand-statyczne-2`).

### Blok do wdrożenia

```json
{
  "Chin To Chest Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.shouldersMove", "s": [["ace-204", "zakończenie instrukcji: „Avoid any movement of the shoulders…” (błąd wprost)"], ["webmd-neck-stretch-front", "krok 2: „Slowly bend your head forward without moving your shoulders.” (standard; błąd = zaprzeczenie standardu)"]]},
      {"c": "mobility_stand.s.mis.slouch", "s": [["wniosek", "mobility_stand.s.chinSet"]]}
    ]
  },
  "Side Neck Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.shrug", "s": [["ace-202", "Step 2: „Be sure to maintain body alignment keeping your shoulders down and back.” (standard)"], ["nhs-flexibility", "Neck stretch: bark przytrzymany w dole drugą ręką (standard; odczyt W1)"], ["wniosek", "mobility_stand.s.neckShouldersDown"]]},
      {"c": "mobility_stand.s.mis.neckTurn", "s": [["wniosek", "mobility_stand.s.neckSideMove"]]}
    ]
  },
  "Overhead Triceps Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.triElbowLow", "s": [["wniosek", "mobility_stand.s.triSet"]]}
    ]
  },
  "Standing Gastrocnemius Calf Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.kneeBent", "s": [["wniosek", "gcalf.move"]]}
    ]
  },
  "Wall Calf Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.kneeBent", "s": [["ace-152", "Step 2: „…while keeping the opposite leg straightened…” (standard)"], ["webmd-heelcord", "„Lean forward, keeping the left leg straight and the left heel on the floor.” (standard; odczyt W1)"], ["nhs-flexibility", "Calf stretch: tylna noga prosta (standard; odczyt W1)"]]},
      {"c": "mobility_stand.s.mis.bottomOut", "s": [["nhs-shrops-calf", "s. 1, How to Stretch: „Do not lift the heels or push your bottom out.” (błąd wprost; odczyt W1)"], ["ace-152", "Step 2: „…keeping your pelvis and spine in alignment.”; Step 3: „…keep your body in alignment…” (standard; błąd = zaprzeczenie standardu)"]]}
    ]
  },
  "Standing Soleus And Achilles Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.soleusKneeStraight", "s": [["ace-152", "Step 4: „…slightly flex (bend) the back knee while pressing the heel into the floor.” (standard)"], ["nhs-shrops-calf", "s. 1, How to Stretch: kolana ugięte — rozciąganie niżej w łydce (standard; odczyt W1)"], ["wniosek", "mobility_stand.s.soleusMove"]]}
    ]
  },
  "Chest And Front Of Shoulder Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.hunch", "s": [["ace-209", "Step 2: łopatki ściągnięte, „slightly lift your chest up and out” (standard; odczyt W1)"], ["medlineplus-chest-stretch", "„…press your shoulder blades together. Your chest should stick out.” (standard; odczyt W1)"], ["wniosek", "mobility_stand.s.claspMove"]]}
    ]
  },
  "Cross-Body Shoulder Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.shrug", "s": [["ccv-flexibility", "Shoulder stretch: bark rozluźniony, nie unosi się do ucha (odczyt W1, parafraza)"], ["webmd-shoulder-posterior", "„Relax your shoulders.” (standard; odczyt W1)"], ["wniosek", "mobility_stand.s.shoulderLoose"]]}
    ]
  },
  "Overhead Stretch": {
    "mistakes": [
      {"c": "mobility_stand.s.mis.headBack", "s": [["wniosek", "mobility_stand.s.overheadSet"]]}
    ]
  },
  "Arm Circles": {
    "mistakes": [
      {"c": "mobility_stand.d.mis.armsDrop", "s": [["wniosek", "mobility_stand.d.armsT"]]}
    ]
  },
  "Ankle Circles": {
    "mistakes": [
      {"c": "mobility_stand.d.mis.wholeLeg", "s": [["wniosek", "mobility_stand.d.ankleCircles"]]}
    ]
  },
  "Standing Hip Circles": {
    "mistakes": [
      {"c": "mobility_stand.d.mis.notFromHip", "s": [["wniosek", "mobility_stand.d.hipCircles"]]}
    ]
  },
  "Wrist Circles": {
    "mistakes": [
      {"c": "mobility_stand.u.mis.forearm", "s": [["wniosek", "mobility_stand.u.wristCircles"]]}
    ]
  }
}
```

Uwagi do bloku:
- Side Neck, Soleus, Chest And Front Of Shoulder, Cross-Body: błąd jest bezpośrednim zaprzeczeniem standardu, który podają ≥ 2 niezależne
  źródła szczebla 4 (to samo zdanie W1 jest już potwierdzone tymi źródłami) — liczę jako „ze źródeł”, oznaczenie „błąd = zaprzeczenie standardu”;
  dodatkowo `wniosek` z id zdania, żeby recenzent widział, które potwierdzone zdanie zaprzeczam.
- Cross-Body: CCV opisuje „bark nie unosi się do ucha” (wg odczytu W1 — w treści zasady, parafraza), WebMD Ignite tylko „rozluźnij barki”.
  Relaks barku a podciąganie go do ucha uznaję za to samo kryterium — recenzent może zawęzić do „wnioskowany” (`wniosek` z `shoulderLoose` wystarcza).
- Wall Calf `kneeBent`: standard „tylna noga prosta” ma 3 niezależne organizacje (ACE, WebMD Ignite, nhs.uk); CCV też (W1), nie dopisuję.
- Wall Calf `bottomOut`: NHS Shropshire podaje błąd wprost; ACE #152 — standard wyrównania miednicy i kręgosłupa. Recenzent: sprawdzić, czy
  „Do not allow your hips to tilt forward” (ACE Step 2) nie znaczy odwrotnie (biodra opadające do ściany) — dlatego jako standard cytuję tylko
  „pelvis and spine in alignment”, nie to zdanie.
- `kneeBent` w Standing Gastrocnemius jest wnioskowany, bo w wersji na stopniu proste kolano podaje wprost tylko NHS Shropshire („legs straight”),
  ACE #211 i WebMD Ignite opisują samo opuszczanie pięty (uwaga W1 pod blokiem `gcalf.*`). Zdanie `gcalf.move` („Z prostym kolanem…”) jest potwierdzone.

## 3. Nowe zdania

| Id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| mobility_stand.s.mis.shouldersMove | Barki ruszają się razem z głową. | Shoulders moving along with your head. | ACE #204 (wprost „Avoid any movement of the shoulders”), WebMD Ignite (standard „without moving your shoulders”); zaprzecza też `chinShouldersStill` |
| mobility_stand.s.mis.slouch | Garbienie się — schylasz plecy zamiast samej głowy. | Slouching — bending your back instead of just your head. | wniosek z `mobility_stand.s.chinSet` („Stań albo usiądź prosto”) |
| mobility_stand.s.mis.shrug | Podciąganie barku do ucha. | Shrugging your shoulder up toward your ear. | Side Neck: ACE #202 + nhs.uk (standard, `neckShouldersDown`); Cross-Body: CCV + WebMD Ignite (`shoulderLoose`) |
| mobility_stand.s.mis.neckTurn | Głowa obraca się albo opada w przód, zamiast przechylać się w bok. | Turning your head or dropping it forward instead of tilting it to the side. | wniosek z `mobility_stand.s.neckSideMove` („ucho w stronę barku”) |
| mobility_stand.s.mis.triElbowLow | Łokieć zostaje przed twarzą, a dłoń nie schodzi na plecy. | Elbow stays in front of your face and your hand never gets down your back. | wniosek z `mobility_stand.s.triSet` (ręka uniesiona, dłoń opuszczona na plecy; ACE #174 „Reach your right arm to the ceiling”) |
| mobility_stand.s.mis.kneeBent | Uginanie kolana nogi, którą rozciągasz. | Bending the knee of the leg you're stretching. | Wall Calf: zaprzeczenie standardu (ACE #152, WebMD Ignite, nhs.uk); Gastrocnemius: wniosek z `gcalf.move` |
| mobility_stand.s.mis.bottomOut | Wypinanie pośladków zamiast trzymania ciała w jednej linii. | Sticking your bottom out instead of keeping your body in line. | NHS Shropshire (wprost) + ACE #152 (standard wyrównania) |
| mobility_stand.s.mis.soleusKneeStraight | Tylne kolano wyprostowane — rozciąganie ucieka wyżej w łydkę. | Back knee straight — the stretch moves higher up the calf. | ACE #152 krok 4 + NHS Shropshire (standard „lekko ugięte kolano”); wniosek z `soleusMove` |
| mobility_stand.s.mis.hunch | Garbienie się — barki lecą do przodu, a klatka się zapada. | Hunching — shoulders roll forward and your chest caves in. | ACE #209 + MedlinePlus (standard: łopatki razem, klatka do przodu); wniosek z `claspMove` |
| mobility_stand.s.mis.headBack | Odchylanie głowy do tyłu. | Tipping your head back. | wniosek z `mobility_stand.s.overheadSet` („patrz przed siebie”); WebMD Ignite podaje to wprost (jedno źródło — tylko wsparcie) |
| mobility_stand.d.mis.armsDrop | Ręce opadają poniżej barków. | Arms drifting down below shoulder height. | wniosek z `mobility_stand.d.armsT` („proste ręce w bok na wysokości barków”) |
| mobility_stand.d.mis.wholeLeg | Kręcenie całą nogą zamiast samą stopą. | Circling your whole leg instead of just the foot. | wniosek z `mobility_stand.d.ankleCircles` („koła w kostce”) |
| mobility_stand.d.mis.notFromHip | Kręcenie samym podudziem — ruch nie idzie z biodra. | Circling just the lower leg — the movement isn't coming from the hip. | wniosek z `mobility_stand.d.hipCircles` („koła z biodra”); pasuje do obu wersji kolana (prosta noga / kolano uniesione) |
| mobility_stand.u.mis.forearm | Kręcenie całym przedramieniem zamiast samą dłonią w nadgarstku. | Circling your whole forearm instead of just your hand at the wrist. | wniosek z `mobility_stand.u.wristCircles` („koła w nadgarstkach”) |

Słownik terminów: „podudzie”, „przedramię”, „łydka” — zwykłe słowa. Rejestr twierdzeń: nowe zdania błędów to tekst dziedzinowy — przy wdrożeniu
`node scripts/claims.mjs --stub`.

## 4. Źródła

Nowych źródeł brak — wszystkie id pochodzą z plików W1 (tam pełne adresy i opisy). Szczeble wg rozstrzygnięcia z 02.11.2026 i jego uzupełnień 2–3.

| Id | Adres | Organizacja | Szczebel | Uzasadnienie / odczyt |
|---|---|---|---|---|
| ace-152 | https://www.acefitness.org/resources/everyone/exercise-library/152/ | ACE | 4 | organizacja certyfikująca trenerów, treść firmowana; przeczytane ponownie 02.11.2026 (Step 2–4) |
| ace-174 | https://www.acefitness.org/resources/everyone/exercise-library/174/ | ACE | 4 | jw.; przeczytane ponownie 02.11.2026 (Step 1; strona nie ma sekcji błędów) |
| ace-202 | https://www.acefitness.org/resources/everyone/exercise-library/202/lateral-neck-flexion/ | ACE | 4 | jw.; przeczytane ponownie 02.11.2026 (Step 2, Cautions) |
| ace-204 | https://www.acefitness.org/resources/everyone/exercise-library/204/neck-flexion-and-extension/ | ACE | 4 | jw.; przeczytane ponownie 02.11.2026 (zakończenie instrukcji) |
| ace-209 | https://www.acefitness.org/resources/everyone/exercise-library/209/ | ACE | 4 | odczyt W1 (Step 2–3) |
| ace-211 | https://www.acefitness.org/resources/everyone/exercise-library/211/step-stretch/ | ACE | 4 | przeczytane ponownie 02.11.2026 — brak opisu kolana tylnej nogi i brak sekcji błędów (dlatego `kneeBent` w wersji na stopniu = wniosek) |
| webmd-neck-stretch-front | https://www.columbiadoctors.org/health-library/multimedia/neck-stretch-front/ | WebMD Ignite (ColumbiaDoctors) | 4 | placówka medyczna + „Current as of: May 1, 2026”; przeczytane ponownie 02.11.2026 (krok 2) |
| webmd-heelcord | https://www.ummhealth.org/health-library/heel-cord-gastrocnemius-stretch-flexibility | WebMD Ignite (UMass) | 4 wg W1 — UWAGA: przeliczenie W1 wymienia „WebMD Ignite na portalu UMass ×2” na szczeblu 5 | jeśli 5 — Wall Calf `kneeBent` nadal ma ACE #152 + nhs.uk (+ CCV) |
| webmd-shoulder-posterior | https://www.columbiadoctors.org/health-library/multimedia/shoulder-stretch-posterior/ | WebMD Ignite (ColumbiaDoctors) | 4 | odczyt W1 |
| nhs-flexibility | https://www.nhs.uk/live-well/exercise/flexibility-exercises/ | NHS (nhs.uk) | 4 | system ochrony zdrowia; odczyt W1 |
| nhs-shrops-calf | https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf | Shropshire Community Health NHS Trust | 4 | trust NHS (osobna organizacja od nhs.uk); odczyt W1 (s. 1) |
| ccv-flexibility | https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises | Cancer Council Victoria | 4 | organizacja zdrowia publicznego/pacjentów (uzupełnienie 2); odczyt W1 |
| medlineplus-chest-stretch | https://medlineplus.gov/ency/imagepages/19483.htm | MedlinePlus (NLM) | 4 | organizacja zdrowia publicznego, recenzja z datą; odczyt W1 |

## 5. Otwarte i uwagi dla integratora

- **One Knee To Chest — brak błędu.** Kandydaci: „druga stopa odrywa się od podłogi”, „lędźwie odrywają się od podłogi” — tylko WebMD Ignite
  (jedno źródło); zdanie `kneeChestSet` opisuje pozycję startową (obie stopy na podłodze), nie utrzymanie, więc wniosek byłby naciągany.
  „Szarpanie kolana” = trywialne (`st.mis.force` bez 2 źródeł dla tego ćwiczenia). Zostaje bez błędu.
- **Standing Elevated Quad Stretch — brak błędu.** „Kolana obok siebie” — tylko WebMD Ignite, „tułów prosto” — tylko CCV (W1). Do tego karta W1
  opisuje wersję bez podwyższenia, a decyzja o postaci „Elevated” jest otwarta (W1, statyczne-3) — błędu nie dopisuję przed tą decyzją.
- **Overhead Triceps — „bark do ucha”**: ACE #174 („keeping your shoulder down (away from your ears)”) — jedno źródło; CCV o barku nie mówi (W1).
  Nie wpisane; `mobility_stand.s.mis.shrug` można dodać, gdy znajdzie się drugie źródło.
- **Chin To Chest — „wysuwanie głowy w przód/w tył”**: ACE #204 („…or shifting the head anterior and posterior”) — jedno źródło. Nie wpisane.
  „Ciągnięcie głowy rękami” (opis katalogu) — żadne źródło nie opisuje ciągnięcia; ACE tylko lekki docisk palcami. Rysunek i karta: bez ciągnięcia.
- **Side Neck — „za mocny docisk dłonią”**: tylko ACE #202 (Cautions) i ACE #204 (ta sama organizacja). Nie wpisane.
- **Chest And Front Of Shoulder — „wyginanie lędźwi / wysuwanie bioder”**: tylko ACE #209 (W1). Nie wpisane.
- **Soleus — `bottomOut`**: NHS Shropshire podaje „push your bottom out” w opisie, który W1 wiąże z wersją z ugiętymi kolanami tylko dla „nie odrywaj pięt” —
  nie przenoszę na Soleus bez ponownego odczytu PDF (PDF przez WebFetch nieczytelny).
- **Arm Circles, Shoulder-type `dyn.mis.jerk`**: nadal tylko Cleveland Clinic (W1) — nie wpisane.
- **Standing Hip Circles**: `notFromHip` nie przesądza wersji kolana (prosta noga wg 2 źródeł vs kolano 90° wg bazy katalogu — otwarte z W1);
  rysunek błędu musi pokazać ruch tylko w stawie kolanowym.
- **Szczebel `webmd-heelcord`** (portal UMass): przeliczenie W1 wymienia „WebMD Ignite … na portalu ubezpieczyciela (UMass ×2)” na szczeblu 5 — integrator:
  potwierdzić; dla moich wpisów bez skutku (inne źródła wystarczają).
- **Niezależność**: w żadnym wpisie para nie składa się z dwóch publikacji tej samej organizacji (WebMD Ignite liczone raz; nhs.uk i NHS Shropshire to różne instytucje).
