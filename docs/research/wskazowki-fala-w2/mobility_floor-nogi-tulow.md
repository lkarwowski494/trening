# mobility_floor — rozciągania nóg i tułowia, fala W2 (02.11.2026)

Zakres: ćwiczenia otwarte i częściowe po przeliczeniu W1 (`przeliczenie-2026-11-02.md`, ma pierwszeństwo przed plikami W1
`mobility_floor-nogi.md`, `-tulow.md`, `-uzupelnienie.md`). Badacz merytoryczny, tylko zbieranie danych. Strony czytane 02.11.2026 przez WebFetch,
PDF-y jako obrazy stron (narzędzie Read). Prefiks nowych źródeł: `w2g2-mfn-`. Id źródeł bez prefiksu to źródła z W1 (odczyt i miejsce z W1).

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan po W1 (przeliczenie) | Stan po W2 | Błędy (źródła / wnioskowane) | Uwaga |
|---|---|---|---|---|
| Seated Calf Stretch | otwarte | gotowe | 0 / 1 | pełny wpis (setup, move, mistakes) |
| Seated Floor Hamstring Stretch | częściowe (setup i 2 wskazówki pominięte) | gotowe | 0 / 2 | w bloku: setup, tips, mistakes — integrator scala z `move` i `hsKneeStraight` z W1 |
| Supine Hamstring Stretch | częściowe (setup pominięty) | gotowe | 1 (błąd = zaprzeczenie standardu) / 0 | rozbieżność figura v2 ↔ karta, p. 5.1 |
| IT Band and Glute Stretch | otwarte | gotowe | 0 / 1 | pełny wpis |
| Seated Rotation Stretch | częściowe (setup pominięty) | gotowe (warunek: szczebel Mayo, p. 5.3) | 0 / 1 | pełny wpis, wskazówka `hipsDown` = uproszczenie |
| Runner's Stretch | otwarte | otwarte | — | p. 5.4 |
| Middle Back Stretch | częściowe (tylko move) | częściowe | — | p. 5.5 |

## 2. Blok do wdrożenia

```json
{
  "Seated Calf Stretch": {
    "setup": [
      {"c": "mobility_floor.n.calfStrap", "s": [["w2g2-mfn-ace-214", "Starting Position (seated, legs extended; band around the sole of your foot)"], ["w2g2-mfn-abuhb-calf", "s. 1, Towel Stretch, pkt 1"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.calfPull", "s": [["w2g2-mfn-ace-214", "Step 2 (pull the band towards you, toes towards you) i Starting Position (without bending your knees)"], ["w2g2-mfn-abuhb-calf", "s. 1, Towel Stretch, pkt 2 (keeping your knee straight, pull the ends of the towel towards you)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_floor.n.mis.kneeBent", "s": [["wniosek", "mobility_floor.n.calfPull"]]}
    ]
  },
  "Seated Floor Hamstring Stretch": {
    "setup": [
      {"c": "mobility_floor.n.hsSeat", "s": [["livewell-lower-limb-stretch", "s. 2, Hamstring Muscle Stretch, punkt 1"], ["w2g2-mfn-vumc-89925", "opis ułożenia (one leg extended; sole of the other foot against the mid-thigh)"]]}
    ],
    "tips": [
      {"c": "mobility_floor.n.hingeFlat", "s": [["w2g2-mfn-vumc-89925", "opis ułożenia i ruchu (back straight)"], ["covenant-lower-body-flex", "s. 1, HURDLER STRETCH, pkt 3 (Maintain spinal alignment)"]]},
      {"c": "st.noBounce", "s": [["w2g2-mfn-vumc-89925", "ostrzeżenia (be sure not to bounce)"], ["livewell-lower-limb-stretch", "s. 1, Instructions for Stretching, punkt 4"]]}
    ],
    "mistakes": [
      {"c": "mobility_floor.n.mis.kneeBent", "s": [["wniosek", "mobility_floor.n.hsKneeStraight"]]},
      {"c": "mobility_floor.n.mis.roundBack", "s": [["wniosek", "mobility_floor.n.hingeFlat"]]}
    ]
  },
  "Supine Hamstring Stretch": {
    "setup": [
      {"c": "mobility_floor.n.hsStrap", "s": [["orthoindy-itb-program", "s. 1, Supine Hamstring Stretch with Strap, Setup"], ["w2g2-mfn-sralab-rom", "s. 1, Hamstring Stretch, kroki 1–2"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.hsPull", "s": [["orthoindy-itb-program", "s. 1, Supine Hamstring Stretch with Strap, Movement"], ["vumc-90608", "krok 2"], ["w2g2-mfn-sralab-rom", "s. 1, Hamstring Stretch, kroki 2 i 4"]]}
    ],
    "mistakes": [
      {"c": "mobility_floor.n.mis.hsKneeBent", "s": [["w2g2-mfn-aaos-hip", "Supine Hamstring Stretch, krok 4 (Straighten your leg) — błąd = zaprzeczenie standardu"], ["w2g2-mfn-sralab-rom", "s. 1, Hamstring Stretch, krok 3 (keep the knee straight) — błąd = zaprzeczenie standardu"], ["vumc-90608", "krok 2 (straight or slightly bent) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "IT Band and Glute Stretch": {
    "setup": [
      {"c": "mobility_floor.n.hsStrap", "s": [["orthoindy-itb-program", "s. 1, Supine ITB Stretch with Strap, Setup"], ["w2g2-mfn-cc-itband", "Strap IT band stretch, kroki 1–2"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.itbAcross", "s": [["orthoindy-itb-program", "s. 1, Supine ITB Stretch with Strap, Movement"], ["w2g2-mfn-cc-itband", "Strap IT band stretch, krok 3"]]}
    ],
    "tips": [
      {"c": "mobility_floor.n.itbHips", "s": [["w2g2-mfn-cc-itband", "Strap IT band stretch, krok 3 (while keeping your hips flat)"], ["orthoindy-itb-program", "s. 1, Supine ITB Stretch with Strap (barki i biodra na podłodze — odczyt W1, „Pojedyncze źródła”)"]]}
    ],
    "mistakes": [
      {"c": "mobility_floor.n.mis.itbHipLift", "s": [["wniosek", "mobility_floor.n.itbHips"]]}
    ]
  },
  "Seated Rotation Stretch": {
    "setup": [
      {"c": "mobility_floor.t.seatRot.setup", "s": [["w2g2-mfn-aaos-hip", "Seated Rotation Stretch, kroki 1–2"], ["w2g2-mfn-mayo-beacon", "opis (legs straight out in front; foot flat outside the other knee)"]]},
      {"c": "mobility_floor.t.seatRot.elbow", "s": [["w2g2-mfn-aaos-hip", "Seated Rotation Stretch, krok 4 (opposite arm on your bent thigh)"], ["w2g2-mfn-mayo-beacon", "opis (elbow on the outside of the bent leg)"]]}
    ],
    "move": [
      {"c": "mobility_floor.t.seatRot.move", "s": [["w2g2-mfn-aaos-hip", "Seated Rotation Stretch, krok 3 (Slowly twist toward your bent leg)"], ["w2g2-mfn-mayo-beacon", "opis (turn your chest, head and eyes)"]]}
    ],
    "tips": [
      {"c": "mobility_floor.t.seatRot.head", "s": [["w2g2-mfn-aaos-hip", "Seated Rotation Stretch, krok 5 (Look over your shoulder)"], ["w2g2-mfn-mayo-beacon", "opis (chest, head and eyes)"], ["cuh-spinal-rom", "Seated trunk rotation (wariant: krzesło)"]]},
      {"c": "mobility_floor.t.seatRot.hipsDown", "s": [["w2g2-mfn-aaos-hip", "Seated Rotation Stretch, Tip (sit bones pressed into the floor)"], ["nhs-sitting-exercises", "Upper-body twist (Without moving your hips) — uproszczenie: wariant na krześle"]]}
    ],
    "mistakes": [
      {"c": "mobility_floor.t.seatRot.mis.hipLift", "s": [["wniosek", "mobility_floor.t.seatRot.hipsDown"]]}
    ]
  }
}
```

## 3. Nowe zdania

Istniejące użyte ponownie: `mobility_floor.n.calfStrap`, `calfPull`, `hsSeat`, `hingeFlat`, `hsStrap`, `hsPull`, `itbAcross`, `mobility_floor.n.mis.roundBack`,
`mobility_floor.t.seatRot.*` (zdania z W1), `st.noBounce`.

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| mobility_floor.n.mis.kneeBent | Uginanie kolana nogi, która ma zostać prosta. | Bending the knee that should stay straight. | wniosek: zaprzecza `calfPull` („kolano trzymaj proste”; ACE 214 + ABUHB) i `hsKneeStraight` (W1: Livewell + Covenant) |
| mobility_floor.n.mis.hsKneeBent | Mocno ugięte kolano uniesionej nogi. | Letting the raised leg bend a lot at the knee. | błąd = zaprzeczenie standardu: AAOS („Straighten your leg”), SRALab („keep the knee straight”), Vanderbilt/StayWell („straight or slightly bent”). Część wspólna: noga prosta albo prawie prosta — dlatego „mocno ugięte”, a nie „ugięte” |
| mobility_floor.n.itbHips | Biodra zostają płasko na podłodze. | Keep your hips flat on the floor. | Cleveland Clinic krok 3 + OrthoIndy (odczyt W1) |
| mobility_floor.n.mis.itbHipLift | Odrywanie biodra od podłogi, gdy noga idzie w poprzek. | Lifting your hip off the floor as your leg crosses over. | wniosek z `itbHips` |
| mobility_floor.t.seatRot.hipsDown | Pośladki zostają na podłodze. | Keep both sit bones on the floor. | AAOS Tip (wprost); NHS „without moving your hips” — wariant na krześle (uproszczenie) |
| mobility_floor.t.seatRot.mis.hipLift | Odrywanie pośladka od podłogi przy skręcie. | Lifting a sit bone off the floor as you twist. | wniosek z `seatRot.hipsDown` |

Do recenzji lokalizacji: zgodność ze słownikiem terminów nie sprawdzana.

## 4. Źródła

| id | adres | organizacja | szczebel i uzasadnienie | co potwierdza (cytat ≤ 1 zdanie) |
|---|---|---|---|---|
| w2g2-mfn-ace-214 | https://www.acefitness.org/resources/everyone/exercise-library/214/seated-calf-stretch/ | ACE | 4 — biblioteka ćwiczeń organizacji certyfikującej (precedens) | „Assume a seated position with legs extended in front of you without bending your knees.” (Starting Position); Step 2: przyciąganie taśmy, palce do siebie; Step 3: „do not bounce” |
| w2g2-mfn-abuhb-calf | https://abuhb.nhs.wales/files/patient-information-leaflets1/foot-care-podiatry/calf-muscle-stretching-guide-piu1442-pdf/ | Aneurin Bevan University Health Board (NHS Wales), Podiatry & Orthotics, „Calf Muscle Stretching Guide”, ABUHB/PIU 1442/1, 09.2026 | 4 — system ochrony zdrowia, firmowanie (uzup. 2) | „Keeping your knee straight, pull the ends of the towel towards you.” (s. 1, Towel Stretch) |
| w2g2-mfn-sralab-rom | https://sralab.org/sites/default/files/2017-04/Lower%20Body_%20Range%20of%20motion%20self%20directed%20for%20the%20legs.pdf | Shirley Ryan AbilityLab (szpital rehabilitacyjny), autor: Physical Therapy Practice Council, © 2017 | 4 — szpital, autor zbiorowy fizjoterapeutów | „Place strap around arch of left foot.” / „While lying down, slowly lift leg using strap.” (s. 1, Hamstring Stretch, kroki 1–2); krok 3: kolano proste |
| w2g2-mfn-aaos-hip | https://www.orthoinfo.org/en/recovery/hip-conditioning-program | American Academy of Orthopaedic Surgeons (OrthoInfo), „Hip Conditioning Program”, opracował/aktualizował Michael J. Alaia, MD, FAAOS | 4 — materiał dla pacjentów organizacji lekarzy z nazwanym autorem (typ HSS); bez daty przeglądu na stronie | Seated Rotation Stretch: „Sit on the floor with both legs straight in front of you.”; Tip: „Keep your sit bones pressed into the floor throughout the stretch.”; Supine Hamstring Stretch, krok 4: „Straighten your leg…” |
| w2g2-mfn-vumc-89925 | https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,89925 | StayWell/WebMD Ignite w bibliotece pacjenta Vanderbilt Health, „Seated Hamstring Stretch”, Date Last Reviewed 12/1/2022 | 4 — WebMD Ignite u placówki medycznej z datą (szczeble, wiersz WebMD Ignite). Ta sama organizacja co `vumc-90608` i `staywell-89925` z W1 — nigdzie nie liczona podwójnie | „Sit with one leg extended and your back straight.”; „During the exercise, be sure not to bounce.” |
| w2g2-mfn-cc-itband | https://health.clevelandclinic.org/it-band-stretches | Cleveland Clinic, artykuł z ekspertką Shelley Krampf, PT, DPT, 26.09.2024 | 4 — system ochrony zdrowia (uzup. 2) | „Lift your right leg up straight before bringing it across your body (to the left) while keeping your hips flat.” (Strap IT band stretch, krok 3) |
| w2g2-mfn-mayo-beacon | https://www.beaconhealthsystem.org/library/video/seated-spinal-twist/ | treść Mayo Foundation for Medical Education and Research (MFMER) w bibliotece Beacon Health System (szpital) | 4 wg uzup. 2 (szpital/system ochrony zdrowia, firmowanie wystarcza, data niewymagana) — ALE korekta szczebli z 02.11 zaliczyła „Mayo/MFMER bez daty i autora” do 5 (p. 5.3) | „Take your left foot and place it flat on the ground on the outside of your right knee.”; „Place your elbow on the outside of your left leg.” |
| w2g2-mfn-ace-blog-5916 | https://www.acefitness.org/resources/everyone/blog/5916/yoga-poses-to-effectively-stretch-the-it-band/ | ACE (blog), Shoshana Hebshi, RYT-200, 28.04.2016 | warunkowo 4 (autorka spoza ekspertów ACE, kwalifikacja jogowa) — NIEUŻYTE w bloku | Supine Stretch With a Strap: noga w poprzek ciała, „keeping your left shoulder on the floor” |

Źródła z W1 użyte w bloku (bez zmian opisu): `orthoindy-itb-program` (OrthoIndy = treść MedBridge, 4), `vumc-90608`, `livewell-lower-limb-stretch`,
`covenant-lower-body-flex`, `nhs-sitting-exercises`, `cuh-spinal-rom`. `staywell-89925` (portal ubezpieczyciela, 5) zastąpione przez `w2g2-mfn-vumc-89925`
(ta sama karta 3,S,89925 u szpitala z datą).

Przeczytane, nieużyte: Vanderbilt/StayWell 3,S,89923 „Hamstring Stretch (with Towel)” (https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,89923, przegląd 4/1/2024 —
ręcznik za udem, kolana ugięte; p. 5.1); ACE 232 „Supine IT Band Stretch” (inny ruch: pięta na palcach, rotacja bioder); Dartmouth-Hitchcock „IT band” PDF
(brak tego rozciągania); Covenant „Lower Body Flexibility” s. 1 (HURDLER: „the ___ leg comfortably bent” — bez położenia stopy, dlatego nie do `hsSeat`).

## 5. Otwarte i uwagi dla integratora

**5.1 Supine Hamstring Stretch — figura v2 ≠ karta.** Figura (`scripts/figures/agent-pozy/mobility_floor.mjs`, funkcja `supineHamstring`, i `PRZYBLIZENIA`)
rysuje wariant AAOS: dłonie splecione za udem, druga noga ugięta, stopa na podłodze. Notatka katalogu i zdania karty: pas na stopie („Lying, strap around the foot”).
Decyzja dla koordynatora/figur: (A) poprawić figurę na wariant z pasem (zgodny z katalogiem i blokiem wyżej) — rekomendacja; (B) zmienić kartę na wariant figury —
da się go potwierdzić: ułożenie na plecach z ugiętymi kolanami (AAOS krok 1; Vanderbilt 89923 „knees bent and feet flat”), chwyt za udem albo ręcznik za udem
(AAOS krok 3 i nawias; Vanderbilt 89923 krok 1), prostowanie nogi i przyciąganie (AAOS krok 4; Vanderbilt 89923 krok 2). Błąd „ciągnięcie za kolano”
(AAOS: „Do not pull at your knee joint.”) — jedno źródło. Błąd `mis.hsKneeBent` pasuje do obu wariantów.
Rozbieżność kolana: SRALab/AAOS — noga prosta; Vanderbilt 90608 i OrthoIndy (W1) — prosta lub lekko ugięta. Część wspólna: prosta albo prawie prosta;
istniejąca wskazówka W1 `hsSoftKnee` („może być lekko ugięte”) mieści się w niej.

**5.2 Seated Calf Stretch — kolano.** ACE 214 krok 4 opisuje ugięte kolano jako osobny wariant (rozciąga głębszy mięsień łydki). Błąd `kneeBent` dotyczy
wersji z katalogu (noga prosta), nie twierdzi, że wariant z ugiętym kolanem jest zły. Figura v2: obie nogi proste, taśma na jednej stopie — zgodna.
Wskazówki `st.noBounce` (ACE) i „siedź prosto” (ACE) — po jednym źródle, nie wpisane.

**5.3 Seated Rotation Stretch — szczebel Mayo.** Przeliczenie pominęło `seatRot.setup`/`elbow`, bo Illinois Extension i Mayo uznano za 5 (korekta szczebli).
Uzup. 2 daje szpitalom i systemom ochrony zdrowia szczebel 4 z samego firmowania; Mayo Clinic to system szpitali, a tu treść MFMER stoi u szpitala
(Beacon Health System). Jeśli koordynator utrzyma 5 dla Mayo → `seatRot.setup`, `seatRot.elbow` i `seatRot.move` mają po jednym źródle (AAOS) i ćwiczenie
wraca do „częściowe”. AAOS mówi „arm on your bent thigh” (ręka na udzie), nie wprost „łokieć na zewnątrz kolana” — zgodność z `seatRot.elbow` przybliżona;
recenzent może woleć brzmienie „Przeciwną rękę oprzyj o ugięte udo”. `seatRot.hipsDown` = uproszczenie (drugie źródło to wariant na krześle).
Wydech przy skręcie (Mayo) i podparcie ręką z tyłu (AAOS) — po jednym źródle.

**5.4 Runner's Stretch — otwarte.** Postać z katalogu: „Low lunge, hands on the floor”, mięśnie: tył uda, łydki, czworogłowe. Ustawienie
`lungeHands` ma po przeliczeniu tylko źródła szczebla 5 (Topend, Endurance Mag). Jedyne źródło szczebla 4: ACE CertifiedNews 2910 (E. Bach, CSCS, 11.2012,
W1 `ace-cert-2910`) — „Sprinter Hamstrings Stretch”: z klęku dłonie na podłodze, wstać „as high as possible into a sprint stance” ze stopami płasko.
Przeszukane bez skutku (02.11): frazy „runner's stretch” + „straighten your front leg” / „hands on the floor” + „lift your hips” — wyniki to serwisy fitness,
jogi, ubezpieczyciel (Medibank) i aplikacje, bez szpitali i organizacji szkolących. Następny trop: karty „half kneeling hamstring stretch” trustów NHS
i szpitali (wariant „biodra w tył nad tylne kolano” — wtedy figurę i postać trzeba dopasować do źródeł).

**5.5 Middle Back Stretch — ustawienie otwarte.** Notatka katalogu: „Standing torso twist”; ruch potwierdzony w W1 tylko w wariancie siedząc (NHS, CUH).
Szukano (02.11) „standing trunk rotation” / „hands on your hips” w materiałach szpitalnych — trafienia to wyłącznie Physitrack (5) i aplikacje; Leeds NASS —
tylko siedząc (W1). Bez dwóch źródeł szczebla 4 dla ustawienia stojąc. Rekomendacja jak W1: decyzja analityka — przyjąć wariant siedząc (wtedy
źródła NHS/CUH wystarczą do ustawienia) albo zostawić częściowe.

**5.6 IT Band and Glute Stretch.** „Barki zostają na podłodze” (istniejące `mobility_floor.t.supTwist.shoulders`) — OrthoIndy (W1) + ACE blog 5916
(warunkowo 4). Do wpisania dopiero, gdy koordynator uzna blog ACE z autorką RYT-200 za 4.

**5.7 Liczby i zdrowie.** Czasy trzymania (ACE 15–30 s; ABUHB, SRALab, Cleveland Clinic 30 s; AAOS 30–60 s) i zdania o bólu (ABUHB s. 1, Vanderbilt 89925) —
nie do bloku (pełne zasady).

**5.8 Pułapki sieci.** PDF-y szpitalne przez WebFetch nieczytelne — czytać zapisany plik narzędziem Read; orthoinfo.aaos.org przekierowuje na orthoinfo.org;
patienteducation.nationwidechildrens.org — host poza dozwoloną siecią sesji; Kaiser Permanente PDF (mydoctor.kaiserpermanente.org) — 404.
