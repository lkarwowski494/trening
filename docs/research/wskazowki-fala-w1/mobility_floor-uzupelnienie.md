# Wskazówki techniki — `mobility_floor`, uzupełnienie mobility_floor-nogi.md i mobility_floor-tulow.md (fala W1, G2)

Data: 02.11.2026. Autor: badacz-merytoryczny.
Metoda: dla ćwiczeń otwartych i częściowych z obu plików poprzedników szukano drugiego niezależnego źródła szczebla ≤ 4 z innej organizacji
niż już użyte; każdą stronę i PDF przeczytano (WebFetch, PDF-y otwierane stronami). Szczeble wg „Rozstrzygnięcia szczebli źródeł”
koordynatora z 02.11.2026 (autor + data albo treść firmowana przez organizację; bez marketingu). Wariant ruchu ustalany wg pola `note`
w `docs/research/equipment/catalog.json` i mapy mięśni w `lib/catalog.generated.ts` (figury v2 mają pozę tylko dla The Straddle).
Pliki poprzedników nie były zmieniane; id zdań i źródeł z nich użyte bez zmian.

## 1. Ćwiczenia (stan po uzupełnieniu)

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| The Straddle | gotowe | ACE 210 + YogaUOnline (zob. szczebel w tabeli źródeł); materiał Newport Beach tylko pomocniczo |
| Intermediate Groin Stretch | otwarte | nadal jedno źródło (Bay State); przeczytane kandydatury nie opisują tego wariantu albo niedostępne |
| Runner's Stretch | częściowe | wariant ustalony (unoszenie bioder / prostowanie przedniej nogi — tył uda), ale ruch ma po jednym źródle na wariant |
| Middle Back Stretch | częściowe | ustawienie stojąc — nadal bez dwóch źródeł (przeczytane materiały: tylko siedząc) |
| Kneeling Forearm Stretch | otwarte | nie znaleziono przeczytanego źródła szczebla 4 dla klęku z palcami do kolan |
| Side Lying Groin Stretch | otwarte | nie szukano do końca (limit kontekstu); `note` katalogu („top leg raised and held”) opisuje raczej unoszenie nogi niż rozciąganie |
| Peroneals Stretch | gotowe | Leeds Teaching Hospitals NHS + East Carolina University (klinika fizjoterapii) |
| Posterior Tibialis Stretch | gotowe | te same dwa źródła (wariant: ewersja) |

## 2. Dane do `exercises` w `data/zrodla/cues.json`

```json
{
  "The Straddle": {
    "setup": [
      {"c": "mobility_floor.u.straddleSit", "s": [["ace-210", "Starting Position (legs apart, knees extended, toes pointing up)"], ["yogau-wide-angle", "akapit o ustawieniu nóg (toes and kneecaps pointing toward the ceiling)"], ["newport-adductor", "s. 1, trzeci wariant, pkt 1–2 (pomocniczo)"]]},
      {"c": "mobility_floor.n.tall", "s": [["ace-210", "Starting Position (trunk vertical, head aligned with spine)"], ["yogau-wide-angle", "akapit o wydłużeniu kręgosłupa przed ruchem"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.hingeFlat", "s": [["ace-210", "Step 2 (hinge forward from the hips, back flat)"], ["yogau-wide-angle", "akapit o pochylaniu z bioder"], ["newport-adductor", "s. 1, trzeci wariant, pkt 4–5 (pomocniczo)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_floor.u.mis.roundInstead", "s": [["ace-210", "Step 2 (avoid rounding your back)"], ["yogau-wide-angle", "akapit o pochylaniu z bioder (collapse forward with a rounded back)"]]}
    ]
  },
  "Peroneals Stretch": {
    "setup": [
      {"c": "mobility_floor.u.ankleStrap", "s": [["leeds-ankle-phase2", "s. 1, ćw. 2 Stretching inversion/eversion, zdanie 1"], ["ecu-pt-inversion-towel", "opis ćwiczenia, zdanie 1"]]}
    ],
    "move": [
      {"c": "mobility_floor.u.invert", "s": [["leeds-ankle-phase2", "s. 1, ćw. 2, zdanie o inwersji"], ["ecu-pt-inversion-towel", "opis ćwiczenia, zdanie 2 (nacisk po wewnętrznej stronie stopy)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Posterior Tibialis Stretch": {
    "setup": [
      {"c": "mobility_floor.u.ankleStrap", "s": [["leeds-ankle-phase2", "s. 1, ćw. 2 Stretching inversion/eversion, zdanie 1"], ["ecu-pt-eversion-towel", "opis ćwiczenia, zdanie 1"]]}
    ],
    "move": [
      {"c": "mobility_floor.u.evert", "s": [["leeds-ankle-phase2", "s. 1, ćw. 2, zdanie o ewersji"], ["ecu-pt-eversion-towel", "opis ćwiczenia (nacisk po zewnętrznej stronie)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Runner's Stretch, Middle Back Stretch — wpisy z plików poprzedników bez zmian (nie zmieniły stanu). Pozostałe — bez wpisu (otwarte).

## 3. Nowe zdania

| id | PL | EN | uwaga |
|---|---|---|---|
| mobility_floor.u.straddleSit | Usiądź z nogami szeroko rozstawionymi, kolana i palce stóp skieruj w górę. | Sit with your legs wide apart, kneecaps and toes pointing up. | ACE: nogi proste; YogaUOnline: prostości nóg nie podaje — dlatego bez „proste” |
| mobility_floor.u.mis.roundInstead | Garbienie się zamiast pochylania z bioder. | Rounding your back instead of hinging from your hips. | istniejące `mobility_floor.n.mis.roundBack` mówi też o miednicy — tego źródła dla tego ćwiczenia nie podają |
| mobility_floor.u.ankleStrap | Usiądź i załóż pas lub ręcznik na stopę. | Sit and loop a strap or towel around your foot. | Leeds: na przednią połowę stopy; ECU: noga wyprostowana — po jednym źródle, nie wpisane |
| mobility_floor.u.invert | Ciągnij za wewnętrzny koniec pasa, żeby obrócić stopę do środka. | Pull on the inner end of the strap to turn your foot inward. | Peroneals Stretch |
| mobility_floor.u.evert | Ciągnij za zewnętrzny koniec pasa, żeby obrócić stopę na zewnątrz. | Pull on the outer end of the strap to turn your foot outward. | Posterior Tibialis Stretch |

Do sprawdzenia przez recenzenta lokalizacji (słownik terminów nie był sprawdzany w tej sesji).

## 4. Nowe źródła

```json
{
  "ace-210": {"org": "ACE", "title": "Seated Straddle Stretch (#210)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/210/seated-straddle-stretch/", "level": 4},
  "yogau-wide-angle": {"org": "YogaUOnline (prezentacja: J. Gudmestad, fizjoterapeutka)", "title": "Wide-Angle Seated Forward Bend – Open Inner Thighs Safely (07.03.2026)", "url": "https://yogauonline.com/yoga-practice-teaching-tips/yoga-practice-tips/julie-gudmestad-wide-angle-seated-forward-bend-open-inner-thighs-safely/", "level": 4},
  "newport-adductor": {"org": "City of Newport Beach (dział rekreacji)", "title": "Adductor Stretch (PDF, 1 s.)", "url": "https://newportbeachca.gov/home/showpublisheddocument/67378/637327494253770000", "level": 5},
  "leeds-ankle-phase2": {"org": "Leeds Teaching Hospitals NHS Trust, Physiotherapy Department (treść licencjonowana Physiotec)", "title": "Ankle Phase 2 Exercises (A. Brogden, 27.01.2022)", "url": "https://www.leedsth.nhs.uk/wp-content/uploads/2023/05/Metatarsal-Phase-2-exercises.pdf", "level": 4},
  "ecu-pt-inversion-towel": {"org": "East Carolina University Physical Therapy Clinic (Home Exercise Program)", "title": "Seated Ankle Inversion Stretch with Towel", "url": "https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=143", "level": 4},
  "ecu-pt-eversion-towel": {"org": "East Carolina University Physical Therapy Clinic (Home Exercise Program)", "title": "Seated Ankle Eversion Stretch with Towel", "url": "https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=138", "level": 4},
  "ace-cert-2910": {"org": "ACE (ACE Certified News, E. Bach, 11.2012)", "title": "A Detailed Guide to Designing Activity-specific Warm-up and Mobility Drills — Sprinter Hamstrings Stretch", "url": "https://www.acefitness.org/certifiednewsarticle/2910/a-detailed-guide-to-designing-activity-specific-warm-up-and-mobility-drills/", "level": 4}
}
```

| id | organizacja | szczebel | co potwierdza |
|---|---|---|---|
| ace-210 | ACE | 4 | rozkrok siedząc: nogi rozstawione, kolana proste, palce w górę, tułów pionowo; pochylenie z bioder z płaskimi plecami, „avoid rounding your back”; wydech, bez sprężynowania, do napięcia (te trzy — tylko ACE) |
| yogau-wide-angle | YogaUOnline | 4 (graniczny: platforma kształcenia nauczycieli jogi; artykuł z datą, autor „staff”, prezentuje fizjoterapeutka) | nogi szeroko, „toes and kneecaps pointing toward the ceiling”; ostrzega przed opadaniem „with a rounded back rather than hinging from your hips” |
| newport-adductor | City of Newport Beach | 5 (po rozstrzygnięciu z 02.11.2026: nie organizacja szkoląca ani serwis z redakcją, bez autora) — nie liczony | nogi proste szeroko, plecy proste, pochylenie z bioder na wydechu |
| leeds-ankle-phase2 | Leeds Teaching Hospitals NHS | 4 | „For inversion (supination), pull on the inside portion of the towel until a stretch is felt on the outside of your foot.”; analogicznie ewersja |
| ecu-pt-inversion-towel | East Carolina University | 4 (treść firmowana przez klinikę uczelni, bez autora i daty) | ręcznik na stopie, noga wyprostowana; nacisk po wewnętrznej stronie stopy |
| ecu-pt-eversion-towel | East Carolina University | 4 (j.w.) | ręcznik na stopie; nacisk ręką trzymającą zewnętrzną stronę ręcznika |
| ace-cert-2910 | ACE | 4 | „Sprinter Hamstrings Stretch”: z klęku, dłonie na podłodze, „stand up as high as possible into a sprint stance” — tylko do „Otwarte” (Runner's Stretch) |

Niezależność: `leeds-ankle-phase2` to treść licencjonowana od Physiotec (jak plik NASS z Leeds), ECU — osobna organizacja. OrthoIndy
i Upswing Health (przeczytany PDF „Groin Strain 1”) używają treści MedBridge — przy przyszłym liczeniu traktować je jako jedną organizację.

## 5. Otwarte

- **Intermediate Groin Stretch** — nadal jedno źródło (Bay State). Przeczytane bez skutku: Upswing Health „Groin Strain 1” (s. 1–2: brak
  tego ćwiczenia), OrthoIndy „Piriformis HEP” (hostowany przez praktykę NHS w Szkocji; brak), Connecticut Children's „Lower Extremity
  Stretching HEP” (przywodziciele tylko w podporze na czworakach), UW Orthopaedics (tylko stojąc). Niedostępne: Beacon Orthopaedics (403),
  Oxford University Hospitals „adductor” PDF (503), Yoga Journal (przekierowanie na logowanie). Strony platform ćwiczeń i aplikacji pominięte.
- **The Straddle** — wydech przy pochylaniu: ACE + Newport (szczebel 5) → nie wpisane. `st.noBounce`, `st.tension` — tylko ACE.
- **Runner's Stretch** — ustalenie wariantu: `note` katalogu „Low lunge, hands on the floor”, mapa mięśni hamstrings + calves + quads,
  opis identyfikacyjny w otwartym zbiorze ćwiczeń (szczebel 5, tylko identyfikacja): wykrok z dłońmi przy przedniej stopie, pięta przedniej
  stopy na ziemi, dla mocniejszego rozciągania unieś biodra (tył uda przedniej nogi). Figura v2 dla tego ćwiczenia nie istnieje.
  Ruch „unieś biodra, prostując przednią nogę” — jedno źródło szczebla 4: `ace-cert-2910`. Ruch „cofnij biodra nad tylne kolano” —
  jedno źródło: `endurancemag-runners-lunge` (tył uda i łydka). To dwa różne ruchy o tym samym celu — nie łączę ich w jedno zdanie.
  Topend (biodra w dół i w przód) opisuje rozciąganie zginaczy biodra — inny cel niż mapa mięśni katalogu.
  Kandydat na zdanie po drugim źródle: „Unieś biodra i prostuj przednią nogę, aż poczujesz rozciąganie z tyłu uda.”
- **Middle Back Stretch** — ustawienie stojąc: przeczytane Leeds NASS (s. 2: rotacja tułowia siedząc na krześle) i materiał UC Riverside
  (bez rotacji stojąc) nie pomagają. Uwaga: w katalogu to ćwiczenie scalono ze „Spinal Stretch” (skręt na krześle, `catalog-step-2026-10-09.json`),
  a `note` mówi „Standing torso twist” — do analityka: jeśli dopuścić wariant siedząc, istniejące źródła ruchu (NHS, CUH) wystarczą też do ustawienia.
- **Kneeling Forearm Stretch** — dalej bez źródła szczebla 4. StayWell „Wrist Flexion (Flexibility)” (Krames 90622) opisuje rozciąganie
  stojąc, ręka przed sobą — inne ćwiczenie. Wyniki dla klęku z palcami do kolan to strony aplikacji i platform — pominięte.
- **Side Lying Groin Stretch** — nie badane w tej sesji (limit kontekstu).
- **Peroneals / Posterior Tibialis** — miejsce odczucia rozciągania (zewnętrzna/wewnętrzna strona stopy) tylko Leeds; „palce do siebie” tylko ECU;
  noga wyprostowana tylko ECU → nie wpisane. Zestaw ogólny `st.*` — żadne z dwóch źródeł go nie podaje.

## 6. Stan

- Zrobione: The Straddle (gotowe), Peroneals Stretch (gotowe), Posterior Tibialis Stretch (gotowe); Runner's Stretch — wariant ustalony,
  nadal częściowe; Intermediate Groin, Middle Back (ustawienie), Kneeling Forearm — szukano, bez drugiego źródła.
- Zostało: Side Lying Groin Stretch (nie zaczęte); drugie źródło dla Intermediate Groin, ruchu Runner's Stretch (wariant „unieś biodra”),
  ustawienia Middle Back (albo decyzja o wariancie siedząc), Kneeling Forearm.
- Następny krok: koordynator wkleja 3 wpisy, 5 zdań i 6 źródeł (bez `newport-adductor` jako liczonego — szczebel 5; `ace-cert-2910` tylko jeśli
  Runner's Stretch dostanie drugie źródło). Dla Runner's Stretch szukać materiałów szpitalnych „half kneeling hamstring stretch” z uniesieniem bioder.
- Pułapki: PDF-y z treścią MedBridge/Physiotec to obrazy stron — czytać pojedyncze strony narzędziem Read (drogie w kontekście);
  wyniki wyszukiwania dla tych ćwiczeń to w większości platformy ćwiczeń i aplikacje (pominięte); Beacon Ortho 403, OUH 503, Special Olympics
  Canada i Nova Scotia Health PDF — 404; Yoga Journal wymaga logowania.
