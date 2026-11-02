# Wskazówki techniki — rodzina `cable_row` (fala W1, G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `cable_row` bez własnych wskazówek — Single Arm Cable Row, Machine Row, Standing Cable Row, Kneeling High Pulley Row,
  Leverage High Row, Cable Rope Rear-Delt Rows, Sled Row.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1 (praca NIEDOKOŃCZONA — patrz „Stan”)

Metoda jak w `row.md` (ta sama fala): ≥ 2 przeczytane (WebFetch, 02.11.2026) źródła szczebla 4 z różnych organizacji o TYM ćwiczeniu; strony aplikacji
treningowych wykluczone; zdania zestawu ogólnego bez potwierdzenia nie przechodzą; bez liczb.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Single Arm Cable Row | general (row) | gotowe (krótka karta) | katalog dopuszcza wyciąg dolny, środkowy i ławkę do wiosłowania — zdania niezależne od pozycji (stojąc/siedząc) |
| Machine Row | general (row) | gotowe (krótka karta) | NASM opisuje maszynę z oparciem pleców, Physitrack — z podporą klatki; zdania obejmują tylko część wspólną |
| Standing Cable Row | general (row) | częściowe | 2 źródła, ale jedno to blog sieci siłowni (szczebel do decyzji); źródła różnią się wysokością wyciągu i ustawieniem nóg |
| Kneeling High Pulley Row | general (row) | otwarte | nie badane (limit kontekstu) |
| Leverage High Row | general (row) | otwarte | nie badane |
| Cable Rope Rear-Delt Rows | general (faceRow) | otwarte | nie badane |
| Sled Row | open | otwarte | nie badane |

## 2. Blok JSON do `exercises` w `data/zrodla/cues.json`

```json
{
  "Single Arm Cable Row": {
    "setup": [
      {"c": "cr1.setup", "s": [["ace-337", "Step 2–3 (single handle on the cable pulley, one hand)"], ["prehabguys-single-arm-row-cable", "HOW (cable set-up, single arm row)"]]}
    ],
    "move": [
      {"c": "cr1.pull", "s": [["ace-337", "Step 3; Step 5 (pull the handle toward your body; slowly straighten the arm)"], ["prehabguys-single-arm-row-cable", "HOW (drive your elbow towards your back pocket; arm straightens on the return)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Machine Row": {
    "setup": [
      {"c": "mrow.setup", "s": [["nasm-seated-machine-row-close-grip", "Step 1–2 (adjust seat to the handles, feet on the platform, grip the handles)"], ["physitrack-seated-row-machine", "instrukcja (sit upright, adjust handles and chest pad, choose a grip)"]]}
    ],
    "move": [
      {"c": "mrow.pull", "s": [["nasm-seated-machine-row-close-grip", "Step 3–4 (pull toward your torso driving the elbows back; lower)"], ["physitrack-seated-row-machine", "instrukcja (pull until elbows are just past your sides; return to start)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Standing Cable Row — poza blokiem (częściowe, do decyzji o szczeblu źródła), proponowany wpis:

```json
{
  "Standing Cable Row": {
    "setup": [
      {"c": "scrow.setup", "s": [["physitrack-cable-rowing-standing", "Setup (hold the bar with both hands, stand)"], ["yourhouse-cable-row", "Standing Cable Row, Step 1 (grip the V-bar, step back)"]]}
    ],
    "move": [
      {"c": "scrow.pull", "s": [["physitrack-cable-rowing-standing", "Movement; Return (bend the elbows; slowly return under control)"], ["yourhouse-cable-row", "Standing Cable Row, Step 2–3 (row toward the torso; return slowly and under control)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

## 3. Nowe źródła (przeczytane WebFetch 02.11.2026)

| id | org | tytuł | url | szczebel |
|---|---|---|---|---|
| ace-337 | ACE (istnieje) | Single Arm Row (cable) | https://www.acefitness.org/resources/everyone/exercise-library/337/single-arm-row/ | 4 |
| prehabguys-single-arm-row-cable | The Prehab Guys (istnieje) | Single Arm Row – Cable | https://theprehabguys.com/vimeo-video/single-arm-row-cable/ | 4 |
| physitrack-seated-row-machine | Physitrack (istnieje) | Seated row, machine | https://us.physitrack.com/home-exercise-video/seated-row%252c-machine | 4 |
| physitrack-cable-rowing-standing | Physitrack (istnieje) | Cable Machine Rowing in Standing | https://ie.physitrack.com/home-exercise-video/cable-machine-rowing-in-standing | 4 |
| yourhouse-cable-row | Your House Fitness (nowa) | Exercise Tutorial: Cable Row | https://www.yourhousefitness.com/blog/exercise-tutorial-cable-row | 4 albo 5 — do decyzji (blog sieci siłowni) |

Istniejące źródło użyte ponownie: `nasm-seated-machine-row-close-grip` — przeczytane ponownie 02.11.2026; opisuje maszynę (oparcie pleców, podest na stopy),
więc dla Machine Row jest źródłem wprost.

Uwaga: `ace-337` — sprawdzić, czy id nie jest już zajęte w `sources` (strona ACE opisuje wersję na wyciągu stojąc).
Przeczytane, nie liczone: brak. Niedostępne: silversneakers.com (403), exrx.net (403).

## 4. Nowe zdania

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| cr1.setup | Przypnij pojedynczy uchwyt do wyciągu i chwyć go jedną ręką. | Clip a single handle to the cable and hold it in one hand. | ACE, The Prehab Guys |
| cr1.pull | Przyciągnij uchwyt, prowadząc łokieć w tył, potem powoli wyprostuj rękę. | Pull the handle by driving your elbow back, then slowly straighten your arm. | ACE, The Prehab Guys |
| mrow.setup | Ustaw siedzisko pod uchwyty, usiądź prosto i chwyć uchwyty. | Set the seat to the handles, sit tall and grab the handles. | NASM, Physitrack |
| mrow.pull | Przyciągnij uchwyty do tułowia, łokcie w tył; wróć do pozycji wyjściowej. | Pull the handles to your torso, elbows back; return to the start. | NASM, Physitrack |
| scrow.setup | Chwyć uchwyt wyciągu oburącz i stań przodem do maszyny. | Grab the cable handle with both hands and stand facing the machine. | Physitrack, Your House Fitness (częściowe) |
| scrow.pull | Przyciągnij uchwyt do tułowia, potem wróć powoli, pod kontrolą. | Pull the handle to your torso, then return slowly and under control. | Physitrack, Your House Fitness (częściowe) |

## 5. Otwarte

- **Single Arm Cable Row — wskazówki i błędy**: pauza na końcu (tylko ACE), ściągnięcie łopatki i „nie wzruszaj barkami, nie wyginaj pleców”
  (tylko The Prehab Guys) — po jednym źródle.
- **Machine Row — błędy**: NASM wymienia szarpanie, ciągnięcie samymi rękami, skracanie zakresu, zaokrąglanie barków; Physitrack nie ma błędów — po jednym źródle.
  Uwaga do zestawu ogólnego: NASM każe NIE prostować rąk do końca na powrocie („stop short of fully straightening”), a zdanie `row.fullStretch` mówi
  odwrotnie — tego zdania nie wolno używać dla Machine Row.
- **Standing Cable Row**: źródła różnią się wysokością wyciągu (klatka vs biodra) i ustawieniem łokci (na boki vs przy tułowiu) oraz nóg
  (wykrok vs równolegle) — możliwe, że opisują różne warianty; potrzebne trzecie źródło szczebla 4 i decyzja o szczeblu bloga sieci siłowni.
- **Kneeling High Pulley Row, Leverage High Row, Cable Rope Rear-Delt Rows, Sled Row** — nie badane w tej sesji.

## 6. Stan

- Zrobione: `row.md` (cała rodzina `row`), w tym pliku Single Arm Cable Row, Machine Row (gotowe, krótkie karty), Standing Cable Row (częściowe).
- Zostało: Kneeling High Pulley Row, Leverage High Row, Cable Rope Rear-Delt Rows, Sled Row; trzecie źródło dla Standing Cable Row; wskazówki i błędy
  dla Single Arm Cable Row i Machine Row (szukać drugiego źródła dla pauzy na końcu / ciągnięcia łokciem).
- Następny krok: Cable Rope Rear-Delt Rows (porównać z istniejącym Face Pull, ale liczyć tylko źródła o wiosłowaniu liną na tylne aktony barków),
  potem Kneeling High Pulley Row, Leverage High Row (producenci maszyn dźwigniowych), Sled Row.
- Pułapki: exrx.net 403; muscleandstrength.com 403; bodybuilding.com/exercises przekierowuje do sklepu (404); silversneakers.com 403;
  adresy barbend.com/?p=… i breakingmuscle.com/?p=… z wyszukiwarki prowadzą do strony głównej — trzeba właściwego adresu artykułu;
  większość wyników wyszukiwania to strony aplikacji (wykluczone).
