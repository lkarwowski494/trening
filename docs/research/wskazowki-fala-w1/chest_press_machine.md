# chest_press_machine — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Szczeble źródeł poprawione wg rozstrzygnięcia koordynatora z 02.11.2026 — patrz sekcje „Korekta szczebli (02.11.2026)” i „Korekta szczebli — uzupełnienie 3” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Leverage Incline Chest Press | otwarte | Western SRS = 5; kopia instrukcji Life Fitness (SU10) bez potwierdzonej zgodności z oryginałem → nie źródło (uzupełnienie 3); zostaje 0 źródeł szczebla 4; kandydaci w „Otwarte” |
| Leverage Decline Chest Press | otwarte | brak przeczytanych źródeł szczebla 4 (strona producenta 403; reszta wyników to strony aplikacji) |
| Smith Machine Shoulder Press | otwarte | brak 2 przeczytanych źródeł; Western SRS (szczebel 5) opisuje tylko obsługę maszyny Smitha (blokada, ograniczniki), HKU — tylko wyciskanie leżąc na maszynie Smitha |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

Brak ćwiczeń gotowych — blok pusty. Kandydaci w „Otwarte”.

```json
{}
```

## Nowe zdania (id | PL | EN)

Wszystkie zdania to kandydaci dla ćwiczenia otwartego (Leverage Incline Chest Press) — nie do aplikacji, dopóki nie będzie 2 źródeł szczebla 4.

| id | PL | EN |
|---|---|---|
| mcpi.seat | Ustaw siedzisko tak, by uchwyty były na wysokości górnej części klatki; plecy oparte, stopy na podłodze. | Set the seat so the handles line up with your upper chest; back against the pad, feet on the floor. |
| mcpi.grip | Chwyć uchwyty nachwytem — dłonie skierowane od siebie. | Grab the handles overhand, palms facing away from you. |
| mcpi.move | Wypchnij uchwyty od siebie, po torze maszyny; wróć do pozycji wyjściowej. | Press the handles away from you along the machine's path, then return to the start. |
| press.mis.lock | Blokowanie łokci na końcu ruchu. | Locking out the elbows at the end of the press. |

`press.mis.lock` jest wspólne z rodziną cable_press (ten sam identyfikator w pliku cable_press.md); po korekcie szczebli nie jest użyte w żadnym bloku JSON.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| western-chest | https://uwo.ca/campusrec/orientation/equipment_guides/chest.html | Western University, Sport and Recreation Services — Equipment Guides, „Incline Press” | 5 (rozstrzygnięcie koordynatora 02.11.2026) | 02.11.2026 |
| lf-pro-su10 | https://www.manualsdir.com/manuals/166239/life-fitness-pro-series.html?page=13 | kopia instrukcji Life Fitness „Pro Series Owner's Manual” M051-00416-A000 (03.2001), Incline Chest Press SU10, s. 3-4, w serwisie z instrukcjami; zgodności z oryginałem producenta nie potwierdzono | nie źródło (kopia niepotwierdzona; uzupełnienie 3) | 02.11.2026 (tylko do Otwartych) |

Id `western-chest` jest już zaproponowane w docs/research/33 (dla Pec-Delt Fly) — ta sama strona, ten sam id.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Leverage Incline Chest Press — całe ćwiczenie | western-chest = 5; lf-pro-su10 — kopia niepotwierdzona (uzupełnienie 3); 0 źródeł szczebla 4. Kandydaci (zgodne w obu przeczytanych tekstach; potrzebne 2 źródła szczebla 4, np. producenci maszyn skośnych): setup `mcpi.seat` [western-chest „Incline Press: Setup (seat height — handles align with your chest); Tip (back flat into the bench, plant your feet)”; lf-pro-su10 s. 3-4 „hand grips align with your upper chest; feet on the floor, back straight”]; `mcpi.grip` [western-chest „Movement (overhand grip)”; lf-pro-su10 s. 3-4 „palms facing away from you”]; move `mcpi.move` [western-chest „Movement (press the handles forward)”; lf-pro-su10 s. 3-4 „push the handles up … slowly lower”]; błąd `press.mis.lock` [western-chest „Movement (maintaining a slight elbow bend)”; lf-pro-su10 s. 3-4 „without locking elbows”]. |
| Leverage Incline Chest Press — `mcp.move` (zestaw ogólny) | „Wypchnij uchwyty **przed siebie** do wyprostu rąk” — przy maszynie skośnej teksty mówią „up” (kopia Life Fitness) albo „forward” (Western); „do wyprostu” przeczy Western („maintaining a slight elbow bend”). Kandydat zastępczy `mcpi.move`. |
| Leverage Incline / Decline — `press.noLock` (zestaw ogólny) | „Prostuj ręce do końca” — Western każe zostawić lekkie ugięcie łokci; zgodne jest tylko „nie blokuj łokci” → `press.mis.lock`. Sygnał o błędzie zestawu ogólnego (Western ma szczebel 5, a kopia Life Fitness nie jest źródłem, ale oba przeczytane teksty są sprzeczne z „do końca”: „without locking elbows”). |
| Leverage Incline / Decline — `mcp.blades` (zestaw ogólny) | żadne przeczytane źródło maszyny skośnej nie wspomina o łopatkach |
| Leverage Incline / Decline — `mis.jerk` (zestaw ogólny) | brak w przeczytanych tekstach (tylko „slowly” w kopii Life Fitness) |
| Leverage Incline — „wracaj powoli” | tylko kopia Life Fitness; Western nie mówi o tempie |
| Leverage Incline — „łokcie idą na boki” | tylko kopia Life Fitness (elbows moving directly out to the sides) |
| Leverage Incline — wysokość uchwytów: „górna część klatki” | kopia Life Fitness i blog sieci siłowni (LA Fitness, „Living Healthy”, 13.09.2015 — szczebel 5, nie liczony) mówią „upper chest”, Western — „chest”; kierunkowo zgodne |
| Leverage Decline Chest Press | brak źródeł: strona producenta maszyny (decline chest press) — 403; ACE #166 to wyciskanie na wyciągu (inne ćwiczenie); reszta wyników to strony aplikacji (niedopuszczalne). Zestaw ogólny `machinePress` (`mcp.move`, `mcp.blades`, `press.noLock`, `mis.jerk`) — niepotwierdzony dla tej maszyny. |
| Smith Machine Shoulder Press | brak 2 źródeł: Western SRS (General Equipment, Smith Machine; szczebel 5) — tylko obsługa (ustawienie ograniczników, odblokowanie przez uniesienie i obrót sztangi), bez techniki wyciskania; HKU FHSC Chest s. 6 — wyciskanie leżąc; ExRx (SMShoulderPress) — 403. Zestaw ogólny `ohp` (`ohp.seat` mówi o hantlach przy barkach) nie pasuje do maszyny Smitha. |
| Smith Machine (obsługa) — „ustaw ograniczniki na dole zakresu ruchu” | tylko 1 źródło, szczebla 5 (Western SRS); HKU s. 6 opisuje tylko odhaczenie obrotem nadgarstków |

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (Western Univ. SRS: 5).

Źródła:
- western-chest: „4 (PROPOZYCJA)” → 5.
- lf-pro-su10: 4 → 4 (instrukcja producenta własnej maszyny; zastrzeżenie o kopii u osoby trzeciej dopisane). (Zmienione w uzupełnieniu 3 — niżej.)

Ćwiczenia (1 zmiana stanu):
- Leverage Incline Chest Press: gotowe (warunkowo) → otwarte (1 źródło szczebla 4).
- Bez zmian: Leverage Decline Chest Press, Smith Machine Shoulder Press — otwarte.
- Blok JSON: usunięty blok „Leverage Incline Chest Press” (przeniesiony do „Otwarte” jako kandydaci); blok pusty.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1. Sprawdzenie WebFetch 02.11.2026: kopia ma na s. 1 „PRO SERIES OWNER'S MANUAL”,
nr M051-00416-A000, marzec 2001; strona wsparcia Life Fitness — 403, dokumentu u producenta nie znaleziono (inna kopia tylko u dealera).
Zgodności z oryginałem nie potwierdzono.

Zmiany:
- lf-pro-su10: 4 → nie źródło (kopia niepotwierdzona).
- Leverage Incline Chest Press: otwarte → otwarte (teraz 0 zamiast 1 źródła szczebla 4).
- Blok JSON bez zmian (pusty); Leverage Decline Chest Press, Smith Machine Shoulder Press — bez zmian (otwarte).
