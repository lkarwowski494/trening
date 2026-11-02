# cable_press — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Seated Cable Chest Press | gotowe warunkowo | ACE #165 (siedząc, wyciąg) + Western SRS „FM Chest” (maszyna Free-Motion, siedząc). Warunki: (1) uznanie szczebla Western SRS (docs/research/33, pyt. 1); (2) Western nie pisze wprost, że FM Chest działa na linkach — to, że maszyny tej serii są linkowe, nie zostało potwierdzone przeczytanym źródłem |
| Single Arm Cable Chest Press | gotowe (ustawienie + ruch + wskazówka; bez błędu — jak wzór „Wyciskanie na linkach (stojąc)”, który też ma pusty `mistakes`) | ACE #338 (stojąc, jednorącz) + Eleiko (jednorącz, niski wykrok) — dwie niezależne organizacje |
| Incline Cable Chest Press | otwarte | brak przeczytanego źródła szczebla ≤ 4 dla wyciskania na wyciągu na ławce skośnej |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

```json
{
 "Seated Cable Chest Press": {
  "setup": [
   {"c": "cpress.seated", "s": [
     ["ace-165", "Step 1 (back firmly supported against the backrest; feet firmly on the floor; hands level with mid-chest)"],
     ["western-fm", "FM Chest: Setup (back flat against the bench, feet on the floor); Movement (start with bent elbows)"]
   ]}
  ],
  "move": [
   {"c": "cpress.seatedMove", "s": [
     ["ace-165", "Step 2; Step 3 (pressing forward; slowly return … handles back towards your chest)"],
     ["western-fm", "FM Chest: Movement (push the handles forward; return slowly)"]
   ]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "press.mis.lock", "s": [
     ["ace-165", "Step 3 (fully extended, but not locked)"],
     ["western-fm", "FM Chest: Tip (keep a soft bend in your elbows)"]
   ]}
  ]
 },
 "Single Arm Cable Chest Press": {
  "setup": [
   {"c": "cpress1.setup", "s": [
     ["ace-338", "opis (pulley at shoulder-height, single handle; back towards the machine)"],
     ["eleiko-65944a76", "Setup (facing away, hold the handle with one hand in front of the shoulder)"]
   ]}
  ],
  "move": [
   {"c": "cpress1.move", "s": [
     ["ace-338", "opis (straighten the arm … bringing the arm back)"],
     ["eleiko-65944a76", "Movement/Procedure (press the handle away … extend the working arm; reverse … to the starting position)"]
   ]}
  ],
  "tips": [
   {"c": "cpress.base", "s": [
     ["ace-338", "opis (press both feet into the floor, squeeze the stomach)"],
     ["eleiko-65944a76", "Coaching Points (keep your torso stable; driving your legs through the ground)"]
   ]}
  ],
  "mistakes": []
 }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| cpress.seated | Usiądź plecami przy oparciu, stopy na podłodze; uchwyty przy klatce, łokcie ugięte. | Sit with your back against the pad and feet on the floor; handles by your chest, elbows bent. |
| cpress.seatedMove | Wypchnij uchwyty przed siebie, potem powoli wróć w stronę klatki. | Press the handles straight out, then slowly bring them back toward your chest. |
| cpress1.setup | Stań tyłem do wyciągu, uchwyt w jednej ręce na wysokości barku. | Stand with your back to the cable, handle in one hand at shoulder height. |
| cpress1.move | Wypchnij uchwyt przed siebie do wyprostu ręki; wróć do pozycji wyjściowej. | Press the handle out until your arm is straight, then return to the start. |
| press.mis.lock | Blokowanie łokci na końcu ruchu. | Locking out the elbows at the end of the press. |

`press.mis.lock` jest wspólne z rodziną chest_press_machine (ten sam identyfikator w pliku chest_press_machine.md — dodać raz).

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| western-fm | https://uwo.ca/campusrec/orientation/equipment_guides/freemotion_transmissions.html | Western University, Sport and Recreation Services — Equipment Guides, „FM Chest” | 4 (PROPOZYCJA — docs/research/33, pyt. 1) | 02.11.2026 |
| eleiko-65944a76 | https://eleiko.inspire360.com/resource/65944a7639c5b816e305b796 | Eleiko (producent sprzętu) — Horizontal Cable Press – Low Split Stance, 1-Arm | 4 | 02.11.2026 |

Istniejące id użyte ponownie (ta sama strona, przeczytana 02.11.2026): `ace-165`, `ace-338`. Id `western-fm` jest już zaproponowane w docs/research/33.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Seated Cable Chest Press — `mcp.move` (zestaw ogólny) | „do wyprostu rąk” przeczy Western („soft bend in your elbows”); zastąpione `cpress.seatedMove` |
| Seated Cable Chest Press — `press.noLock` (zestaw ogólny) | „Prostuj ręce do końca” — Western każe zostawić lekkie ugięcie; wspólne tylko „nie blokuj” → `press.mis.lock` |
| Seated Cable Chest Press — `mcp.blades` (zestaw ogólny; łopatki przy oparciu) | tylko 1 źródło (ace-165, Step 1–2); Western nie wspomina |
| Seated Cable Chest Press — `mis.jerk` (zestaw ogólny) | brak w źródłach jako błąd; „powoli” przy powrocie jest w `cpress.seatedMove` |
| Seated Cable Chest Press — wysokość uchwytów (barki albo środek klatki) | tylko 1 źródło (ace-165) |
| Seated Cable Chest Press — napięty brzuch | tylko 1 źródło (ace-165); Western FM Chest nie wspomina |
| Seated Cable Chest Press — bez Western | jeśli Western SRS = szczebel 5 albo FM Chest okaże się maszyną bez linek, zostaje jedno źródło (ACE) → otwarte |
| Single Arm Cable Chest Press — `press.noLock` (zestaw ogólny `cablePress`) | żadne z dwóch źródeł nie mówi o łokciach na końcu ruchu; niepotwierdzone |
| Single Arm Cable Chest Press — `mis.jerk` (zestaw ogólny) | brak w źródłach |
| Single Arm Cable Chest Press — wysokość bloczka | źródła się różnią: ACE — na wysokości barków, Eleiko — na wysokości pasa (pozycja z niskim wykrokiem); wspólne tylko: uchwyt przy barku na starcie (`cpress1.setup`) |
| Single Arm Cable Chest Press — „nie skręcaj tułowia” | tylko 1 źródło (Eleiko, Coaching Points: avoid excessive rotation) |
| Single Arm Cable Chest Press — „wracaj powoli” | tylko 1 źródło (ACE #338) |
| Incline Cable Chest Press | brak źródeł szczebla ≤ 4 (wyniki wyszukiwania — tylko strony aplikacji i serwisy konsumenckie). Zestaw ogólny `bench` (`bp.contact`, `bp.blades`, `bp.control`, `bp.mis.arch`) pochodzi ze sztangi na ławce płaskiej — `bp.control` mówi o odbijaniu ciężaru od klatki, co przy wyciągu nie występuje; niepotwierdzone dla tego wariantu. |
