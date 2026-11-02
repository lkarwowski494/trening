# Role mięśni — fala W2, rodzina `delt_raise` (wiosłowanie pionowe, odwrotne rozpiętki, unoszenia)

Data: 2026-11-02. Autor: badacz-merytoryczny (G7). Zakres: tylko dane — bez zmian w kodzie i `data/zrodla/role-miesni.json`.
Wiersze: z briefu koordynatora (region(obciążenie)); regiony z rolą już nadaną pomijam.

## Wnioski

1. **Wiosłowanie pionowe (upright row), górna część pleców** — górne włókna czworobocznego unoszą łopatkę i obracają ją przy odwodzeniu
   ramienia (S5, S30-delt); EMG potwierdza pracę górnej i środkowej części czworobocznego w tym ćwiczeniu (S29-delt). Nowa funkcja
   `upper_back.scap_elev_rot`.
2. **Wiosłowanie pionowe, przedni akton** — przednie włókna „prowadzą” odwodzenie (S33-delt), EMG mierzy ich pracę (S29-delt), ale
   TeachMeAnatomy (S6) podaje tylko zgięcie i rotację wewnętrzną. Funkcja wprost w jednym źródle → **jedno źródło** (bez wyświetlania).
3. **Odwrotne rozpiętki i unoszenia w opadzie, górna część pleców** — środkowa część czworobocznego ściąga łopatki (S5, S30-delt);
   EMG: największa aktywność środkowego czworobocznego przy odwodzeniu poziomym w leżeniu przodem (S31-delt). Istniejąca funkcja
   `upper_back.scap_retract`.
4. **Y raise i scaption, górna część pleców** — czworoboczny obraca łopatkę w górę przy unoszeniu ramienia (S5, S30-delt); EMG: unoszenie
   ramion nad głowę w leżeniu przodem daje największą aktywność dolnej części czworobocznego (S31-delt). Nowa funkcja `upper_back.scap_upward_rot`.
5. **Scaption, boczny akton** — unoszenie w płaszczyźnie łopatki („full can”) pobudza boczny akton ok. 52% MVIC (S32-delt); funkcja
   odwodzenia — S1, S6. Istniejąca funkcja `side_delt.shoulder_abd`.
6. **Y raise, tylny akton** — tylko analogia: w leżeniu przodem przy ok. 100° odwiedzenia tylny akton ok. 87% MVIC (S32-delt); Y raise
   unosi ramię wyżej → **uproszczenie (analogia)**.
7. Otwarte: boczny akton w unoszeniu do przodu nad głowę i w „halo”; przedramiona w Car Drivers; „chest” w Incline Shoulder Raise.

## Tabela

| Ćwiczenie | Region (obc.) | Propozycja | Pewność | Źródła |
|---|---|---|---|---|
| Upright Row (sztanga) | upper_back (0,5) | `upper_back.scap_elev_rot`, aux | dwa źródła (anatomia S5, S30-delt; ruch S29-delt) | S5, S29-delt, S30-delt |
| Upright Row (hantle), (linki), Smith Machine Upright Row, Band Upright Row, Dumbbell One-Arm Upright Row, Smith Machine One-Arm Upright Row | upper_back (0,5) | jw. | dwa źródła; wariant sprzętu — uproszczenie co do EMG (S29-delt: sztanga) | jw. |
| wszystkie 7 wiosłowań pionowych (jw.) | front_delt (0,5) | `front_delt.abd_assist`, aux | jedno źródło (funkcja wprost tylko S33-delt) | S29-delt, S33-delt |
| Cable Reverse Fly | upper_back (0,5) | `upper_back.scap_retract`, aux | dwa źródła; wariant sprzętu (linki, stojąc) — uproszczenie co do EMG | S5, S30-delt, S31-delt |
| Dumbbell Lying One-Arm Rear Lateral Raise | upper_back (0,5) | jw. | dwa źródła; wariant (jednorącz, leżąc) — uproszczenie co do EMG | jw. |
| One-Arm Cable Rear Lateral Raise | upper_back (0,5) | jw. | jw. | jw. |
| Sled Reverse Flye | upper_back (0,5) | jw. | dwa źródła; wariant sprzętu (sanie) — uproszczenie co do EMG | jw. |
| Straight Raises on Incline Bench | upper_back (0,5) | `upper_back.scap_upward_rot`, aux | uproszczenie (analogia do uniesienia nad głowę w leżeniu przodem; zakres w tym ćwiczeniu niepotwierdzony) | S30-delt, S31-delt |
| Y Raise (hantle), Cable Y Raise | upper_back (0,5) | `upper_back.scap_upward_rot`, aux | dwa źródła (anatomia S5, S30-delt; ruch S31-delt) | S5, S30-delt, S31-delt |
| Y Raise (hantle), Cable Y Raise | rear_delt (0,5) | `rear_delt.shoulder_ext`, aux | uproszczenie (analogia: „prone full can” ok. 100°, S32-delt) | S6, S32-delt |
| Dumbbell Scaption | side_delt (0,5) | `side_delt.shoulder_abd`, aux | dwa źródła (S1, S6; ruch S32-delt) | S1, S6, S32-delt |
| Dumbbell Scaption | upper_back (0,5) | `upper_back.scap_upward_rot`, aux | dwa źródła (anatomia S5, S30-delt; S31-delt: unoszenie w płaszczyźnie łopatki > 120° = ćwiczenie z dużą rotacją górną) | S5, S30-delt, S31-delt |
| Dumbbell / Barbell Front Raise to Overhead | side_delt (0,5) | otwarte | — | brak źródła roli bocznego aktonu w zgięciu > 90° |
| Kettlebell Halo | side_delt (0,5) | otwarte | — | ruch okrężny, brak źródła |
| Car Drivers | forearms (0,5) | otwarte (kandydat `forearms.grip`, aux) | — | opis ćwiczenia tylko z katalogu (szczebel 5) |
| Dumbbell / Barbell / Smith Incline Shoulder Raise | chest (0,5) | otwarte — patrz „Uwaga dla koordynatora” | — | — |

### Uwaga dla koordynatora (Incline Shoulder Raise — prawdopodobny błąd danych katalogu)

Katalog (`docs/research/equipment/catalog.json`, wpisy „Dumbbell Incline Shoulder Raise” ok. l. 14576–14618, „Barbell …” ok. l. 14621, „Smith …” ok. l. 14670)
opisuje ruch jako wypychanie łopatek prostymi rękami na ławce skośnej („Scapular protraction with straight arms”) i ma `"unmapped": "serratus_anterior"`
z notatką, że zębaty przedni zmapowano na `front_delt`/`chest`. Wysuwanie łopatki to funkcja zębatego przedniego (S1, tab. 11.8: „Scapula: protracts”);
piersiowy mniejszy według S1 łopatkę obniża, a piersiowy większy według S7 „draws the scapula anteroinferiorly”. Region `chest` = piersiowy większy,
więc `chest 0,5` jest zastępstwem za mięsień bez regionu, nie pomiarem. Zdanie roli dla `chest` byłoby mylące — **nie proponuję**. Do decyzji
koordynatora/właściciela: obniżyć `chest` albo dodać region zębatego; nie poprawiałem danych.

### Blok do wdrożenia

```json
{
  "functions": {
    "upper_back.scap_elev_rot": {
      "region": "upper_back", "staw": "łopatka", "ruch": "uniesienie i rotacja górna (górne włókna czworobocznego)",
      "pl": { "main": "Unosi i obraca łopatki, gdy unosisz łokcie", "aux": "Pomaga unosić i obracać łopatki, gdy unosisz łokcie" },
      "en": { "main": "Lifts and rotates your shoulder blades as you raise your elbows", "aux": "Helps lift and rotate your shoulder blades as you raise your elbows" },
      "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["S5", "S29-delt", "S30-delt"],
      "uwaga": "Tylko jawna lista nameRules (wiosłowanie pionowe)."
    },
    "upper_back.scap_upward_rot": {
      "region": "upper_back", "staw": "łopatka", "ruch": "rotacja górna przy unoszeniu ramienia",
      "pl": { "main": "Obraca łopatki w górę, gdy unosisz ręce", "aux": "Pomaga obracać łopatki w górę, gdy unosisz ręce" },
      "en": { "main": "Rotates your shoulder blades upward as you raise your arms", "aux": "Helps rotate your shoulder blades upward as you raise your arms" },
      "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["S5", "S30-delt", "S31-delt"],
      "uwaga": "Tylko jawna lista nameRules (Y raise, scaption; Straight Raises on Incline Bench jako uproszczenie). Tekst do przeglądu recenzenta lokalizacji."
    },
    "front_delt.abd_assist": {
      "region": "front_delt", "staw": "ramienny", "ruch": "udział w odwodzeniu",
      "pl": { "main": "Unosi ramię w bok", "aux": "Pomaga unosić ramię w bok" },
      "en": { "main": "Raises your arm out to the side", "aux": "Helps raise your arm out to the side" },
      "pewnosc": "jedno źródło", "status": "jedno_zrodlo", "zrodla": ["S33-delt", "S29-delt"],
      "uwaga": "Funkcję wprost podaje tylko S33-delt (szczebel 4); S29-delt mierzy aktywność przedniego aktonu, nie nazywa funkcji; S6 jej nie wymienia."
    }
  },
  "nameRules.reguly (dopisać)": [
    { "muscle": "upper_back", "roles": ["aux"], "function": "upper_back.scap_elev_rot",
      "exercises": ["Upright Row (hantle)", "Upright Row (linki)", "Upright Row (sztanga)", "Smith Machine Upright Row", "Band Upright Row", "Dumbbell One-Arm Upright Row", "Smith Machine One-Arm Upright Row"],
      "uproszczenie": "wariant sprzętu Upright Row (sztanga) — ten sam ruch barku i łopatki" },
    { "muscle": "front_delt", "roles": ["aux"], "function": "front_delt.abd_assist",
      "exercises": ["Upright Row (hantle)", "Upright Row (linki)", "Upright Row (sztanga)", "Smith Machine Upright Row", "Band Upright Row", "Dumbbell One-Arm Upright Row", "Smith Machine One-Arm Upright Row"] },
    { "muscle": "upper_back", "roles": ["aux"], "function": "upper_back.scap_retract",
      "exercises": ["Cable Reverse Fly", "Dumbbell Lying One-Arm Rear Lateral Raise", "One-Arm Cable Rear Lateral Raise", "Sled Reverse Flye"],
      "uproszczenie": "wariant sprzętu odwrotnych rozpiętek (S31-delt: odwodzenie poziome w leżeniu przodem)" },
    { "muscle": "upper_back", "roles": ["aux"], "function": "upper_back.scap_upward_rot",
      "exercises": ["Y Raise (hantle)", "Cable Y Raise", "Dumbbell Scaption"] },
    { "muscle": "upper_back", "roles": ["aux"], "function": "upper_back.scap_upward_rot", "status": "uproszczenie",
      "exercises": ["Straight Raises on Incline Bench"],
      "uproszczenie": "analogia do uniesienia ramion nad głowę w leżeniu przodem (S31-delt); zakres ruchu w tym ćwiczeniu niepotwierdzony" },
    { "muscle": "rear_delt", "roles": ["aux"], "function": "rear_delt.shoulder_ext", "status": "uproszczenie",
      "exercises": ["Y Raise (hantle)", "Cable Y Raise"],
      "uproszczenie": "analogia do „prone full can” (ok. 100° odwiedzenia, S32-delt)" },
    { "muscle": "side_delt", "roles": ["aux"], "function": "side_delt.shoulder_abd",
      "exercises": ["Dumbbell Scaption"] }
  ],
  "sources (dopisać)": [
    { "id": "S29-delt", "tier": 3,
      "cite": "McAllister MJ, Schilling BK, Hammond KG, Weiss LW, Farney TM. Effect of grip width on electromyographic activity during the upright row. J Strength Cond Res 2013;27(1):181–187",
      "url": "https://pubmed.ncbi.nlm.nih.gov/22362088/", "miejsce": "abstrakt (pełny tekst niedostępny)",
      "cytaty": ["mierzone: „upper trapezius (UT), middle trapezius (MT), and biceps brachii (BB)” oraz trzy aktony naramiennego", "„those who seek to maximize involvement of the deltoid and trapezius muscles during the URR should use a wide grip”"] },
    { "id": "S30-delt", "tier": 4,
      "cite": "Sendić G (rec. Mytilinaios D). Trapezius muscle. Kenhub (rec. 30.10.2023)",
      "url": "https://www.kenhub.com/en/library/anatomy/trapezius-muscle", "miejsce": "Function",
      "cytaty": ["„The trapezius muscle is also responsible for upward rotation of the scapula, along with the serratus anterior muscle.”", "„The transverse (middle) fibers act together with the rhomboids to produce a retraction of the scapula”"] },
    { "id": "S31-delt", "tier": 3,
      "cite": "Ekstrom RA, Donatelli RA, Soderberg GL. Surface electromyographic analysis of exercises for the trapezius and serratus anterior muscles. J Orthop Sports Phys Ther 2003;33(5):247–258",
      "url": "https://pubmed.ncbi.nlm.nih.gov/12774999/", "miejsce": "abstrakt (Results)",
      "cytaty": ["„The arm raise overhead exercise in the prone position produced the maximum EMG activity in the lower trapezius.”", "środkowy czworoboczny: najwyżej przy odwodzeniu poziomym z rotacją zewnętrzną i unoszeniu ramienia nad głowę w leżeniu przodem"] },
    { "id": "S32-delt", "tier": 3,
      "cite": "Reinold MM i in. Electromyographic analysis of the supraspinatus and deltoid muscles during 3 common rehabilitation exercises. J Athl Train 2007;42(4):464–469",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2140071", "miejsce": "Methods (Exercises); Abstract (Results)",
      "cytaty": ["full can: „elevates the upper extremity at approximately 30° of horizontal abduction in the plane of the scapula”", "„The posterior deltoid showed significantly greater activity during the prone full-can exercise (87 ± 53% MVIC).”"] },
    { "id": "S33-delt", "tier": 4,
      "cite": "Pirie E (rec. Grujičić R). Deltoid muscle. Kenhub (rec. 30.10.2023)",
      "url": "https://www.kenhub.com/en/library/anatomy/the-deltoid-muscle", "miejsce": "Function",
      "cytaty": ["„The clavicular and scapular spinal fibers of the muscle guide the arm through the abduction motion.”"] }
  ]
}
```

## Źródła

| Id | Organizacja / autor | Szczebel i uzasadnienie |
|---|---|---|
| S1, S6, S5, S7 (istn.) | OpenStax; TeachMeAnatomy (dr O. Jones) | 3; 4 — jak w role-miesni.json |
| S29-delt | McAllister i in., University of Memphis; J Strength Cond Res | 3 — badanie EMG, recenzowane (16 osób); przeczytany abstrakt |
| S30-delt | Kenhub, autorka lekarka, recenzent lekarz, data | 4 — serwis anatomiczny z autorem i recenzją (jak S17, S18) |
| S31-delt | Ekstrom i in.; J Orthop Sports Phys Ther | 3 — badanie EMG, recenzowane (30 osób); przeczytany abstrakt |
| S32-delt | Reinold i in. (ASMI); J Athl Train, pełny tekst PMC | 3 — badanie EMG z elektrodą igłową, recenzowane |
| S33-delt | Kenhub (inna autorka niż S30-delt, ta sama organizacja) | 4 — z S30-delt to JEDNA organizacja: nie liczę ich jako dwóch niezależnych źródeł (w żadnej funkcji nie stoją razem jako para) |

Pliku `szczeble-organizacji-2026-11-02.md` nie mogłem otworzyć (brak git w tej sesji) — szczeble wg CLAUDE.md, spójnie z S1–S28; koordynator: sprawdzić Kenhub (S30-delt, S33-delt) względem tego pliku.

## Otwarte

- [OTWARTE] Boczny akton w Dumbbell/Barbell Front Raise to Overhead — brak przeczytanego źródła, że boczny akton pomaga przy zgięciu ramienia powyżej 90° (S1 mówi tylko o całym naramiennym: „facilitates flexing”).
- [OTWARTE] Kettlebell Halo — ruch okrężny wokół głowy; nie znalazłem opisu stawowego ani EMG.
- [OTWARTE] Car Drivers, przedramiona — kandydat `forearms.grip` (talerz trzymany w wyprostowanych rękach), ale opis ćwiczenia pochodzi tylko z katalogu/free-exercise-db (szczebel 5); potrzebne 2 źródła techniki szczebla 4.
- [OTWARTE] Incline Shoulder Raise — patrz uwaga wyżej (dane katalogu).
- [OTWARTE] Przedni akton w upright row — drugie źródło anatomiczne, które wprost przypisuje przednim włóknom udział w odwodzeniu (poza Kenhub).
- [OTWARTE] Pełne teksty S29-delt i S31-delt (paywall) — wnioski oparte na abstraktach.
- Teksty `scap_elev_rot` i `scap_upward_rot` — do recenzenta lokalizacji (czy trener tak powie; „obraca łopatki w górę” bywa niejasne).
