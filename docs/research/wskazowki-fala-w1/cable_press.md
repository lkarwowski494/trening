# cable_press — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Szczeble źródeł poprawione wg rozstrzygnięcia koordynatora z 02.11.2026 — patrz sekcje „Korekta szczebli (02.11.2026)” i „Korekta szczebli — uzupełnienie 3” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/częściowe/otwarte) | Uwagi |
|---|---|---|
| Seated Cable Chest Press | otwarte | po korekcie szczebli Western SRS = 5; zostaje 1 źródło szczebla 4 (ACE #165); kandydaci w „Otwarte” |
| Single Arm Cable Chest Press | otwarte | po uzupełnieniu 3: strona Eleiko to „Resource” bez autora i bez podpisu „Eleiko Education” → 5; zostaje 1 źródło szczebla 4 (ACE #338); kandydaci w „Otwarte” |
| Incline Cable Chest Press | otwarte | brak przeczytanego źródła szczebla ≤ 4 dla wyciskania na wyciągu na ławce skośnej |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

Po uzupełnieniu 3 brak wpisów — blok pusty. Kandydaci w „Otwarte”.

```json
{}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN | użycie |
|---|---|---|---|
| cpress.seated | Usiądź plecami przy oparciu, stopy na podłodze; uchwyty przy klatce, łokcie ugięte. | Sit with your back against the pad and feet on the floor; handles by your chest, elbows bent. | kandydat (Seated — otwarte) |
| cpress.seatedMove | Wypchnij uchwyty przed siebie, potem powoli wróć w stronę klatki. | Press the handles straight out, then slowly bring them back toward your chest. | kandydat (Seated — otwarte) |
| cpress1.setup | Stań tyłem do wyciągu, uchwyt w jednej ręce na wysokości barku. | Stand with your back to the cable, handle in one hand at shoulder height. | kandydat (Single Arm — otwarte) |
| cpress1.move | Wypchnij uchwyt przed siebie do wyprostu ręki; wróć do pozycji wyjściowej. | Press the handle out until your arm is straight, then return to the start. | kandydat (Single Arm — otwarte) |
| press.mis.lock | Blokowanie łokci na końcu ruchu. | Locking out the elbows at the end of the press. | kandydat (Seated — otwarte) |

`press.mis.lock` jest wspólne z rodziną chest_press_machine (ten sam identyfikator w pliku chest_press_machine.md — dodać raz, gdy któreś ćwiczenie zostanie potwierdzone); nie jest użyte w żadnym bloku JSON.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| western-fm | https://uwo.ca/campusrec/orientation/equipment_guides/freemotion_transmissions.html | Western University, Sport and Recreation Services — Equipment Guides, „FM Chest” | 5 (rozstrzygnięcie koordynatora 02.11.2026) | 02.11.2026 |
| eleiko-65944a76 | https://eleiko.inspire360.com/resource/65944a7639c5b816e305b796 | Eleiko — platforma edukacyjna, dział „Resources” (nie kurs), Horizontal Cable Press – Low Split Stance, 1-Arm; bez autora, bez podpisu „Eleiko Education”, bez daty; nie dotyczy własnego sprzętu producenta | 5 (uzupełnienie 3) | 02.11.2026 (tylko do Otwartych) |

Istniejące id użyte ponownie (ta sama strona, przeczytana 02.11.2026): `ace-165`, `ace-338` (ACE — szczebel 4). Id `western-fm` jest już zaproponowane w docs/research/33.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Seated Cable Chest Press — całe ćwiczenie | Korekta szczebli 02.11.2026: western-fm = 5, zostaje 1 źródło szczebla 4 (ace-165). Dodatkowo Western nie pisze wprost, że FM Chest działa na linkach. Kandydaci: setup `cpress.seated` [ace-165 Step 1 (back firmly supported against the backrest; feet firmly on the floor; hands level with mid-chest); western-fm „FM Chest: Setup; Movement (start with bent elbows)”]; move `cpress.seatedMove` [ace-165 Step 2–3 (pressing forward; slowly return); western-fm „FM Chest: Movement (push the handles forward; return slowly)”]; błąd `press.mis.lock` [ace-165 Step 3 (fully extended, but not locked); western-fm „FM Chest: Tip (keep a soft bend in your elbows)”]. Potrzebne drugie źródło szczebla 4 dla wyciskania siedząc na wyciągu. |
| Single Arm Cable Chest Press — całe ćwiczenie | Uzupełnienie 3: eleiko-65944a76 = 5; zostaje 1 źródło szczebla 4 (ace-338). Kandydaci (zgodne w obu przeczytanych tekstach): setup `cpress1.setup` [ace-338 opis (pulley at shoulder-height, single handle; back towards the machine); eleiko-65944a76 Setup (facing away, handle in one hand in front of the shoulder)]; move `cpress1.move` [ace-338 opis (straighten the arm … bringing the arm back); eleiko-65944a76 Movement/Procedure]; wskazówka `cpress.base` [ace-338 opis (press both feet into the floor, squeeze the stomach); eleiko-65944a76 Coaching Points (keep your torso stable)]. Potrzebne drugie źródło szczebla 4. |
| Seated Cable Chest Press — `mcp.move` (zestaw ogólny) | „do wyprostu rąk” przeczy Western („soft bend in your elbows”) — Western ma szczebel 5, ale nadal jest przeczytanym źródłem sprzecznym; kandydat zastępczy `cpress.seatedMove` |
| Seated Cable Chest Press — `press.noLock` (zestaw ogólny) | „Prostuj ręce do końca” — Western każe zostawić lekkie ugięcie, ACE „not locked”; wspólne tylko „nie blokuj” → `press.mis.lock` |
| Seated Cable Chest Press — `mcp.blades` (zestaw ogólny; łopatki przy oparciu) | tylko 1 źródło (ace-165, Step 1–2); Western nie wspomina |
| Seated Cable Chest Press — `mis.jerk` (zestaw ogólny) | brak w źródłach jako błąd |
| Seated Cable Chest Press — wysokość uchwytów (barki albo środek klatki) | tylko 1 źródło (ace-165) |
| Seated Cable Chest Press — napięty brzuch | tylko 1 źródło (ace-165); Western FM Chest nie wspomina |
| Single Arm Cable Chest Press — błąd | żaden błąd nie ma 2 źródeł |
| Single Arm Cable Chest Press — `press.noLock` (zestaw ogólny `cablePress`) | żadne z dwóch przeczytanych tekstów nie mówi o łokciach na końcu ruchu; niepotwierdzone |
| Single Arm Cable Chest Press — `mis.jerk` (zestaw ogólny) | brak w źródłach |
| Single Arm Cable Chest Press — wysokość bloczka | teksty się różnią: ACE — na wysokości barków, Eleiko — na wysokości pasa (pozycja z niskim wykrokiem); wspólne tylko: uchwyt przy barku na starcie |
| Single Arm Cable Chest Press — „nie skręcaj tułowia” | tylko Eleiko (szczebel 5; Coaching Points: avoid excessive rotation) |
| Single Arm Cable Chest Press — „wracaj powoli” | tylko 1 źródło (ACE #338) |
| Incline Cable Chest Press | brak źródeł szczebla ≤ 4 (wyniki wyszukiwania — tylko strony aplikacji i serwisy konsumenckie). Zestaw ogólny `bench` (`bp.contact`, `bp.blades`, `bp.control`, `bp.mis.arch`) pochodzi ze sztangi na ławce płaskiej — `bp.control` mówi o odbijaniu ciężaru od klatki, co przy wyciągu nie występuje; niepotwierdzone dla tego wariantu. |

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (Western Univ. SRS: 5; kryteria a–c). Eleiko sprawdzone ponownie WebFetch 02.11.2026.

Źródła:
- western-fm: „4 (PROPOZYCJA)” → 5.
- eleiko-65944a76: 4 → 4 (platforma edukacyjna Eleiko z kursami; treść firmowana marką; bez marketingu w treści). (Zmienione w uzupełnieniu 3 — niżej.)
- ace-165, ace-338: 4 → 4 (bez zmiany).

Ćwiczenia (2 zmiany stanu):
- Seated Cable Chest Press: gotowe (warunkowo) → otwarte (1 źródło szczebla 4).
- Single Arm Cable Chest Press: gotowe → częściowe (bez błędu). (Zmienione w uzupełnieniu 3 — niżej.)
- Bez zmian: Incline Cable Chest Press — otwarte.
- Blok JSON: usunięty blok „Seated Cable Chest Press” (przeniesiony do „Otwarte” jako kandydaci).

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1 (Eleiko: 4 tylko teksty działu edukacji z autorem albo „Eleiko Education”).
Sprawdzenie WebFetch 02.11.2026: strona jest w dziale „Resources” (obok „Courses”, „Workshops”), to opis ćwiczenia, bez autora, bez
podpisu „Eleiko Education” i bez daty; w nagłówku tylko logo marki.

Zmiany:
- eleiko-65944a76: 4 → 5; usunięte z bloku JSON.
- Single Arm Cable Chest Press: częściowe → otwarte (zostaje 1 źródło — ACE #338); wpis usunięty z bloku JSON, kandydaci w „Otwarte”.
- Seated Cable Chest Press, Incline Cable Chest Press: bez zmian (otwarte).
