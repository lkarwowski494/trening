# chest_press_machine — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Leverage Incline Chest Press | gotowe (zależy od uznania szczebla Western SRS — docs/research/33, pyt. 1) | ustawienie, chwyt, ruch, błąd — Western SRS (maszyna płytowa „Incline Press”) + Life Fitness (Incline Chest Press SU10); jedna wskazówka z dwóch producentów nie wystarcza do kompletu bez Western |
| Leverage Decline Chest Press | otwarte | brak przeczytanych źródeł szczebla 4 (strona producenta 403; reszta wyników to strony aplikacji) |
| Smith Machine Shoulder Press | otwarte | brak 2 przeczytanych źródeł; Western SRS opisuje tylko obsługę maszyny Smitha (blokada, ograniczniki), HKU — tylko wyciskanie leżąc na maszynie Smitha |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

```json
{
 "Leverage Incline Chest Press": {
  "setup": [
   {"c": "mcpi.seat", "s": [
     ["western-chest", "Incline Press: Setup (seat height — handles align with your chest); Tip (back flat into the bench, plant your feet)"],
     ["lf-pro-su10", "Incline Chest Press (SU10), s. 3-4: hand grips align with your upper chest; feet on the floor, back straight"]
   ]},
   {"c": "mcpi.grip", "s": [
     ["western-chest", "Incline Press: Movement (overhand grip)"],
     ["lf-pro-su10", "Incline Chest Press (SU10), s. 3-4 (palms facing away from you)"]
   ]}
  ],
  "move": [
   {"c": "mcpi.move", "s": [
     ["western-chest", "Incline Press: Movement (press the handles forward)"],
     ["lf-pro-su10", "Incline Chest Press (SU10), s. 3-4 (push the handles up … slowly lower to the starting position)"]
   ]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "press.mis.lock", "s": [
     ["western-chest", "Incline Press: Movement (maintaining a slight elbow bend)"],
     ["lf-pro-su10", "Incline Chest Press (SU10), s. 3-4 (hold in the top position without locking elbows)"]
   ]}
  ]
 }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| mcpi.seat | Ustaw siedzisko tak, by uchwyty były na wysokości górnej części klatki; plecy oparte, stopy na podłodze. | Set the seat so the handles line up with your upper chest; back against the pad, feet on the floor. |
| mcpi.grip | Chwyć uchwyty nachwytem — dłonie skierowane od siebie. | Grab the handles overhand, palms facing away from you. |
| mcpi.move | Wypchnij uchwyty od siebie, po torze maszyny; wróć do pozycji wyjściowej. | Press the handles away from you along the machine's path, then return to the start. |
| press.mis.lock | Blokowanie łokci na końcu ruchu. | Locking out the elbows at the end of the press. |

`press.mis.lock` jest wspólne z rodziną cable_press (ten sam identyfikator w pliku cable_press.md).

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| western-chest | https://uwo.ca/campusrec/orientation/equipment_guides/chest.html | Western University, Sport and Recreation Services — Equipment Guides, „Incline Press” | 4 (PROPOZYCJA — docs/research/33, pyt. 1) | 02.11.2026 |
| lf-pro-su10 | https://www.manualsdir.com/manuals/166239/life-fitness-pro-series.html?page=13 | Life Fitness (producent sprzętu) — „Pro Series User Manual”, Incline Chest Press SU10, s. 3-4; kopia instrukcji w serwisie z instrukcjami | 4 | 02.11.2026 |

Id `western-chest` jest już zaproponowane w docs/research/33 (dla Pec-Delt Fly) — ta sama strona, ten sam id.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Leverage Incline Chest Press — `mcp.move` (zestaw ogólny) | „Wypchnij uchwyty **przed siebie** do wyprostu rąk” — przy maszynie skośnej źródła mówią „up” (Life Fitness) albo „forward” (Western); „do wyprostu” przeczy Western („maintaining a slight elbow bend”). Zastąpione `mcpi.move`. |
| Leverage Incline / Decline — `press.noLock` (zestaw ogólny) | „Prostuj ręce do końca” — Western każe zostawić lekkie ugięcie łokci; zgodne jest tylko „nie blokuj łokci” → `press.mis.lock`. Sygnał o błędzie zestawu ogólnego. |
| Leverage Incline / Decline — `mcp.blades` (zestaw ogólny) | żadne przeczytane źródło maszyny skośnej nie wspomina o łopatkach |
| Leverage Incline / Decline — `mis.jerk` (zestaw ogólny) | brak w przeczytanych źródłach (tylko „slowly” w Life Fitness) |
| Leverage Incline — „wracaj powoli” | tylko 1 źródło (lf-pro-su10); Western nie mówi o tempie |
| Leverage Incline — „łokcie idą na boki” | tylko 1 źródło (lf-pro-su10: elbows moving directly out to the sides) |
| Leverage Incline — wysokość uchwytów: „górna część klatki” | Life Fitness i blog sieci siłowni (LA Fitness, „Living Healthy”, 13.09.2015 — szczebel niepewny, nie liczony) mówią „upper chest”, Western — „chest”; kierunkowo zgodne, przyjęte „górna część klatki” |
| Leverage Incline — bez Western | jeśli audytor uzna materiały uczelnianych centrów sportu za szczebel 5, zostaje jedno źródło (Life Fitness) → otwarte |
| Leverage Decline Chest Press | brak źródeł: strona producenta maszyny (decline chest press) — 403; ACE #166 to wyciskanie na wyciągu (inne ćwiczenie); reszta wyników to strony aplikacji (niedopuszczalne). Zestaw ogólny `machinePress` (`mcp.move`, `mcp.blades`, `press.noLock`, `mis.jerk`) — niepotwierdzony dla tej maszyny. |
| Smith Machine Shoulder Press | brak 2 źródeł: Western SRS (General Equipment, Smith Machine) — tylko obsługa (ustawienie ograniczników, odblokowanie przez uniesienie i obrót sztangi), bez techniki wyciskania; HKU FHSC Chest s. 6 — wyciskanie leżąc; ExRx (SMShoulderPress) — 403. Zestaw ogólny `ohp` (`ohp.seat` mówi o hantlach przy barkach) nie pasuje do maszyny Smitha. |
| Smith Machine (obsługa) — „ustaw ograniczniki na dole zakresu ruchu” | tylko 1 źródło (Western SRS); HKU s. 6 opisuje tylko odhaczenie obrotem nadgarstków |
