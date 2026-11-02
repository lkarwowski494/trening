# Role mięśni — rodzina `glute_floor` (fala W2, G4)

Data: 02.11.2026 · status: **PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Luki rodziny wg W1 (gałąź badania/g4-nogi, plik role `hip_abd_add.md`, tabela „Luki”): Clamshell i Fire Hydrant — `glutes` jako aux.
W `data/zrodla/role-miesni.json` region `glutes` ma tylko funkcję `glutes.hip_ext` (wiersz 50); odwodzenie jest w regionie `abductors`
(`abductors.hip_abd`, wiersz 169). Region `glutes` = pośladek wielki.

| ćwiczenie | region | rola | proponowana funkcja / reguła `nameRules` | źródła | status |
|---|---|---|---|---|---|
| Clamshell | glutes | aux | nowa `glutes.hip_ext_rot` („Pomaga obracać udo na zewnątrz” / „Helps turn your thigh outward”); reguła `{"muscle":"glutes","roles":["aux"],"function":"glutes.hip_ext_rot","exercises":["Clamshell"]}` — brzmienie i JSON jak w W1 | S11 (TeachMeAnatomy, Gluteus Maximus — Actions: „assists with lateral rotation”), Kenhub „Gluteus maximus muscle”, Function (W1); dodatkowo Radiopaedia (niżej): „lateral rotator of the thigh”. Ruch = rotacja zewnętrzna: ACE 6315 „externally rotate the top leg” | **gotowe** (dwa źródła, W1; Radiopaedia tylko wzmacnia) |
| Fire Hydrant | glutes | aux | nowa `glutes.hip_abd` („Pomaga odsuwać nogę w bok” / „Helps move your leg out to the side”), `pewnosc: uproszczenie` (odwodzi tylko górna część mięśnia); reguła `{"muscle":"glutes","roles":["aux"],"function":"glutes.hip_abd","exercises":["Fire Hydrant"]}` | Kenhub, Function: „The superior portion of the muscle participates in the abduction of the thigh” (W1); Radiopaedia „Gluteus maximus muscle”, Summary/Action: „abduction at the hip (upper fibers)” (przeczytane 02.11.2026) | **otwarte (warunkowo uproszczenie)** — szczebel Radiopaedii nieustalony |

## Nowe źródło

| id | adres | autor / data | szczebel |
|---|---|---|---|
| S30 (numer nada koordynator) | https://radiopaedia.org/articles/gluteus-maximus-muscle | utworzone 13.04.2016 (autor pierwotny bez czytelnego nazwiska), ostatnia rewizja: Tariq Walizai, 15.10.2024 | **[OTWARTE]** — brak w `szczeble-organizacji-2026-11-02.md`; redagowany przez lekarzy serwis referencyjny (wiki z redakcją) — kandydat na 4 jak Kenhub, ale bez rozstrzygnięcia koordynatora się nie liczy |

## Otwarte

- [OTWARTE] Fire Hydrant — reguła wejdzie, gdy koordynator uzna Radiopaedię za szczebel 4 (albo znajdzie się drugie źródło anatomiczne
  szczebla 2–4 o odwodzeniu przez górne włókna pośladka wielkiego). Ta sama funkcja zamknęłaby też luki `glutes` aux w rodzinie
  `hip_abd_add` (Hip Abduction, Cable Hip Abduction, Lateral Band Walk, Monster Walk) — poza zakresem tego pliku.
- [OTWARTE] Fire Hydrant — czy przy zgiętym biodrze ruch opisywać jako odwodzenie, czy rotację (W1): ACE 7409 i ISSA opisują uniesienie
  kolana w bok, ACE 6402 i ISSA nazywają to odwodzeniem — propozycja trzyma się odwodzenia.
- Pozostałe ćwiczenia rodziny (Donkey Kick, Cable Kickback, Hip Extension with Bands, Machine Glute Kickback, Prone Flutter Kicks) — W1 nie
  wskazało luk; w W2 nie sprawdzano ponownie.
