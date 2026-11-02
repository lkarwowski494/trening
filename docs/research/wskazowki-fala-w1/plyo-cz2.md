# Wskazówki techniki — plyo, część 2 (skoki, rzadsze ćwiczenia)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3); uzupełnienie: druga sesja tego samego zadania, 02.11.2026. Zakres: tylko zbieranie danych (bez zmian w kodzie i `data/zrodla/*.json`).

Zasada: każde zdanie w danym ćwiczeniu ma ≥ 2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji (wyjątek dla wskazówek techniki w CLAUDE.md). Zdania z zestawu ogólnego `jump` (`jump.drive`, `jump.land`, `jump.mis.stiff`) wpisuję tylko tam, gdzie przeczytane źródła dla tego wariantu je potwierdzają — w pozostałych przypadkach krótsza karta albo „otwarte”.

Uwaga o zbiorze, z którego pochodzą nazwy katalogu (pole `fedb`): według rozstrzygnięcia koordynatora linii 1.1 (02.11.2026) to szczebel 5 — **nie liczy się** do dwóch źródeł (tak samo `docs/research/26-grafiki-i-wskazowki.md` pkt 1 i 6; inaczej niż w ACG-015, gdzie był policzony przy „Dumbbell Seated Box Jump”).

**Physitrack (2. sesja):** to platforma ćwiczeń dla fizjoterapeutów — według rozstrzygnięcia 02.11 dokumentacja innych aplikacji nie jest źródłem, a jej status jest niepewny. Wpisy, które stały na Physitrack + 1 źródle, przeniosłem do osobnego bloku **„warunkowo — do decyzji koordynatora”** (sekcja 2b); w głównym bloku danych zostaje tylko to, co ma 2 źródła bez Physitrack. Producenci liczą się tylko dla własnego rodzaju sprzętu (inSPORTline — skrzynie plyometryczne: tak).

## 1. Tabela ćwiczeń

| Klucz | Status | Uwagi |
|---|---|---|
| Dumbbell Seated Box Jump | częściowe | Tips `bj.land`, błąd `bj.mis.stiff` (te same źródła co „Box Jump”; zgodne z ACG-015). Brak: setup, move — siad przodem do skrzyni potwierdza tylko Catalyst (`fedb` się nie liczy). `jump.drive` sprzeczny z wariantem — nie wpisywać. |
| Single-Leg Lateral Hop | otwarte (warunkowo częściowe) | Setup/move/tips stały na Physitrack + The Prehab Guys → blok warunkowy 2b. Zastępstwa dla Physitrack nie znalazłem. Brak błędu: „kolano do środka” tylko Prehab Guys. |
| Lateral Cone Hops | częściowe (warunkowo gotowe) | Bez Physitrack: move `plyo.coneLat.hop` = ACE #120 + NISMAT (placówka medyczna, treść firmowana, data w adresie — szczebel do potwierdzenia). Setup, wskazówki i błąd — tylko ACE poza Physitrack → blok 2b. |
| Front Cone Hops | otwarte | Tylko ACE #118. Szukane w 2. sesji: The Prehab Guys (tylko wersje jednonóż), uczelniana karta UF RecSports (przeskok obunóż przez pachołek w przód — centrum rekreacji, nie organizacja szkoląca trenerów; do decyzji koordynatora, niewliczone). |
| Alternate Leg Diagonal Bound | otwarte | Nie znalazłem przeczytanego opisu w bibliotece szczebla 4. |
| Box Skip | otwarte | Jedno źródło (książka szczebla 3, fragment u wydawcy) — za mało; szczebel 3 tylko gdy autor NSCA / uznany naukowiec — do sprawdzenia. |
| Single-Leg Stride Jump | otwarte | Fragment wydawcy nie otwiera się; innych źródeł szczebla 4 brak. |
| Alternate Leg Push-Off | częściowe | Setup i move: ACE + producent skrzyń (inSPORTline, własny sprzęt — liczy się). Brak błędu: lądowanie na prostych kolanach tylko ACE. Zamach rąk — sprzeczność, pominięte. |
| Single Leg Push-Off | otwarte | Tylko ACE (#230). 2. sesja: nie szukano (limit kontekstu). |
| Side to Side Box Shuffle | otwarte | Tylko instrukcja producenta skrzyń (inSPORTline s. 3). 2. sesja: nie szukano. |
| Double Leg Butt Kick | otwarte | Brak przeczytanego źródła szczebla 4 (wyniki dotyczą biegowego „butt kicks”, inny ruch; karta trustu NHS też opisuje wariant biegowy). |
| Single Leg Butt Kick | otwarte | Jak wyżej. |
| Side Standing Long Jump | otwarte | Brak przeczytanego źródła szczebla 4. |
| Side Hop-Sprint | otwarte | Brak przeczytanego źródła szczebla 4. |
| Single-Leg Hop Progression | otwarte | Brak przeczytanego źródła szczebla 4. |

## 2. Dane (format `data/zrodla/cues.json`) — bez Physitrack

```json
{
  "sources": {
    "ace-120": {
      "org": "ACE",
      "title": "Lateral Cone Jumps (#120)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/",
      "level": 4
    },
    "ace-246": {
      "org": "ACE",
      "title": "Alternate Leg Push-off (#246)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/",
      "level": 4
    },
    "insportline-qt1005": {
      "org": "inSPORTline",
      "title": "Plyometric Box Set — instrukcja (QT1005), s. 3 „Plyo Boxes Exercises”",
      "url": "https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf",
      "level": 4
    },
    "nismat-lat-jump-cone": {
      "org": "NISMAT",
      "title": "Lateral Jump Over Cone (26.05.2020)",
      "url": "https://nismat.org/2020/05/26/lateral-jump-over-cone/amp/",
      "level": 4
    }
  },
  "orgs": {
    "inSPORTline": {
      "name": "inSPORTline — instrukcja zestawu skrzyń plyometrycznych (producent sprzętu)",
      "level": 4,
      "kind": "maker"
    },
    "NISMAT": {
      "name": "Nicholas Institute of Sports Medicine and Athletic Trauma (placówka medycyny sportowej, Nowy Jork) — materiały ćwiczeń (szczebel 4 do potwierdzenia przez koordynatora)",
      "level": 4,
      "kind": "site"
    }
  },
  "exercises": {
    "Lateral Cone Hops": {
      "setup": [],
      "move": [
        {"c": "plyo.coneLat.hop", "s": [["ace-120", "Step 2–3"], ["nismat-lat-jump-cone", "instrukcja, zdanie 2 (jump with both feet sideways over the cone, then back)"]]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Alternate Leg Push-Off": {
      "setup": [
        {"c": "plyo.pushoff.setup", "s": [["ace-246", "Step 1"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Start"]]}
      ],
      "move": [
        {"c": "plyo.altPushoff.move", "s": [["ace-246", "Step 2–3"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Action"]]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Dumbbell Seated Box Jump": {
      "setup": [],
      "move": [],
      "tips": [
        {"c": "bj.land", "s": [["ace-115", "Step 4–6"], ["nasm-box-jumps", "Common Mistakes (landing with straight knees)"]]}
      ],
      "mistakes": [
        {"c": "bj.mis.stiff", "s": [["nasm-box-jumps", "Common Mistakes"], ["ace-115", "Step 5 (avoid locking your knees)"]]}
      ]
    }
  }
}
```

## 2b. Warunkowo — do decyzji koordynatora (wpisy stojące na Physitrack + 1 źródle)

Wyniki pierwszej sesji, zachowane bez zmian. Wdrożyć tylko, jeżeli koordynator uzna Physitrack za źródło szczebla 4; inaczej pozostają otwarte.

```json
{
  "sources": {
    "physitrack-lat-hops-hurdles": {"org": "Physitrack", "title": "Lateral hops over hurdles", "url": "https://uk.physitrack.com/home-exercise-video/lateral-hops-over-hurdles", "level": 4},
    "physitrack-lat-jumps-hurdles": {"org": "Physitrack", "title": "Lateral jumps over hurdles", "url": "https://uk.physitrack.com/home-exercise-video/lateral-jumps-over-hurdles", "level": 4},
    "prehab-lat-sl-hop-cone": {"org": "The Prehab Guys", "title": "Lateral Single Leg Hop With Cone", "url": "https://theprehabguys.com/vimeo-video/lateral-single-leg-hop-with-cone/", "level": 4}
  },
  "exercises": {
    "Lateral Cone Hops": {
      "setup": [
        {"c": "plyo.coneLat.setup", "s": [["ace-120", "Step 1"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdania 1–2"]]}
      ],
      "move": [
        {"c": "plyo.coneLat.move", "s": [["ace-120", "Step 2–3; Step 7"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdania 2–5"]]}
      ],
      "tips": [
        {"c": "jump.land", "s": [["ace-120", "Step 5"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdanie 3"]]},
        {"c": "plyo.landTrunk", "s": [["ace-120", "Step 6"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdania 3–4"]]},
        {"c": "plyo.quickOff", "s": [["ace-120", "Step 3; Step 7 (ONLY a very brief pause)"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdanie ostatnie (minimising your time on the floor)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["ace-120", "Step 5 (Avoid locking your knees or quads)"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdanie 3 (pozytywnie: lądowanie z ugiętymi kolanami i biodrami)"]]}
      ]
    },
    "Single-Leg Lateral Hop": {
      "setup": [
        {"c": "plyo.slLatHop.setup", "s": [["physitrack-lat-hops-hurdles", "instrukcja, zdania 1–2"], ["prehab-lat-sl-hop-cone", "opis: set-up 2 cones to the side of you"]]}
      ],
      "move": [
        {"c": "plyo.slLatHop.move", "s": [["physitrack-lat-hops-hurdles", "instrukcja, zdania 3–5"], ["prehab-lat-sl-hop-cone", "opis: hopping on the same leg, then repeat on the other side"]]}
      ],
      "tips": [
        {"c": "plyo.landSoft", "s": [["physitrack-lat-hops-hurdles", "instrukcja, zdanie 3 (landing softly)"], ["prehab-lat-sl-hop-cone", "opis: landing softly vs. being loud/stomping"]]}
      ],
      "mistakes": []
    }
  }
}
```

Uwagi do danych:
- `ace-115`, `nasm-box-jumps`, orgi `ACE`, `Physitrack`, `The Prehab Guys` już istnieją w `cues.json` — bez zmian.
- Lateral Cone Hops: przy uznaniu Physitrack blok 2b zastępuje wpis z sekcji 2, a `plyo.coneLat.hop` (ACE + NISMAT) dochodzi do `move` obok `plyo.coneLat.move` albo go zastępuje (prostsze zdanie; decyzja programisty/recenzenta).
- Puste listy (`mistakes: []` itd.) oznaczają brak potwierdzenia — szczegóły w sekcji 5. Ćwiczenia „częściowe” nie powinny dostać statusu karty „gotowa”, dopóki braki nie są uzupełnione albo świadomie przyjęte.
- „Dumbbell Seated Box Jump”: dane dla `bj.land` i `bj.mis.stiff` przeniesione bez zmian z wpisu „Box Jump”; zgodnie z ACG-015 z zestawu ogólnego usunąć `jump.drive`.

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| `plyo.coneLat.hop` (2. sesja) | Przeskakuj obunóż bokiem nad pachołkiem. | Jump sideways over the cone, off both feet. |
| `plyo.coneLat.setup` (warunkowo, 2b) | Ustaw pachołki w rzędzie i stań bokiem do pierwszego. | Set the cones in a row and stand side-on to the first one. |
| `plyo.coneLat.move` (warunkowo, 2b) | Z krótkiego ugięcia przeskocz obunóż bokiem nad pachołkiem i od razu nad kolejnym. | From a quick dip, jump sideways off both feet over the cone, then straight over the next one. |
| `plyo.landTrunk` (warunkowo, 2b) | Przy lądowaniu tułów lekko pochylony, plecy proste. | On landing, lean your chest slightly forward and keep your back straight. |
| `plyo.quickOff` (warunkowo, 2b) | Po lądowaniu odbijaj się od razu — jak najkrócej na ziemi. | Bounce straight off after each landing — spend as little time on the ground as you can. |
| `plyo.slLatHop.setup` (warunkowo, 2b) | Stań na jednej nodze bokiem do pachołka. | Stand on one leg, side-on to the cone. |
| `plyo.slLatHop.move` (warunkowo, 2b) | Przeskocz bokiem nad pachołkiem, cały czas na tej samej nodze; potem zmień nogę. | Hop sideways over the cone on the same leg, then switch legs. |
| `plyo.landSoft` (warunkowo, 2b) | Ląduj miękko, nie tupnij. | Land softly — don't stomp. |
| `plyo.pushoff.setup` | Stań przodem do skrzyni: jedna stopa na skrzyni, druga na podłodze. | Face the box with one foot on top and the other on the floor. |
| `plyo.altPushoff.move` | Odepchnij się nogą ze skrzyni w górę, w powietrzu zmień nogi i wyląduj drugą stopą na skrzyni. | Drive up off the foot on the box, switch legs in the air and land with the other foot on the box. |

Istniejące zdania użyte bez zmian: `jump.land`, `jump.mis.stiff` (tylko 2b), `bj.land`, `bj.mis.stiff`. Każde nowe zdanie wymaga wpisu w rejestrze twierdzeń (`node scripts/claims.mjs --stub`) i przeglądu tłumacza/recenzenta lokalizacji — poza zakresem tej pracy.

## 4. Źródła (przeczytane 02.11.2026)

| id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-120 | https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ | ACE | 4 | Kroki 1–8 i uwaga końcowa. Step 5: „Avoid locking your knees or quads on your landing…”; Step 6: „Land with your trunk inclined slightly forward, head aligned with your spine and back rigid or flat.” |
| ace-118 | https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/ | ACE | 4 | Kroki 1–8 (przeskoki obunóż w przód nad pachołkami). Nieużyte — brak drugiego źródła. |
| ace-246 | https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/ | ACE | 4 | Step 1–4: „quickly swing your left leg forward and your right leg back so that you will land with your left foot on top”. |
| ace-230 | https://www.acefitness.org/resources/everyone/exercise-library/230/single-leg-push-off/ | ACE | 4 | Kroki 1–4 i wskazówki. Nieużyte — brak drugiego źródła. |
| ace-115 | https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/ | ACE | 4 | (istniejące) Step 4–6 — lądowanie. |
| nasm-box-jumps | https://www.nasm.org/resource-center/exercise-library/box-jumps | NASM | 4 | (istniejące, wg ACG-015) Common Mistakes; Step 4: zejście krokiem. |
| insportline-qt1005 | https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf | inSPORTline (producent skrzyń — własny sprzęt) | 4 | s. 3 „Plyo Boxes Exercises”: ALTERNATING PUSH-OFF (lewa górna) — Start: „Stand on the ground and place one foot on the box, heel close to closest edge.” Druga pozycja o tej samej nazwie (lewa dolna) — przeskok bokiem nad skrzynią („Side to Side Box Shuffle”). |
| nismat-lat-jump-cone (2. sesja) | https://nismat.org/2020/05/26/lateral-jump-over-cone/amp/ | NISMAT (placówka medycyny sportowej; konto instytucji, data 26.05.2020 w adresie) | 4 — do potwierdzenia | „Jump with both feet sideways over the cone, then back.” (3 zdania; bez lądowania i błędów; wysokość pachołka i czas pominięte — liczby) |
| physitrack-lat-hops-hurdles | https://uk.physitrack.com/home-exercise-video/lateral-hops-over-hurdles | Physitrack | do decyzji koordynatora | Pełna instrukcja (7 zdań): „Stand at one end with your side to the hurdles and stand on one leg.” |
| physitrack-lat-jumps-hurdles | https://uk.physitrack.com/home-exercise-video/lateral-jumps-over-hurdles | Physitrack | do decyzji koordynatora | Pełna instrukcja (7 zdań); „The aim is to spring quickly off the floor between each hurdle, minimising your time on the floor.” |
| prehab-lat-sl-hop-cone | https://theprehabguys.com/vimeo-video/lateral-single-leg-hop-with-cone/ | The Prehab Guys | 4 | „Perform this drill with hopping on the same leg, then repeat on the other side.”; „we do not want the knee to collapse in”. |
| catalyst-552 | https://www.catalystathletics.com/exercise/552/Seated-Box-Jump/ | Catalyst Athletics | 4 | „Sit on a small box in front of a taller box and place your feet in your jumping stance close to the base.” Nieużyte (jedno źródło). |
| hk-radcliffe-box-skip | https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips | Human Kinetics (fragment książki J. Radcliffe, „High-Powered Plyometrics”, wyd. 3, s. 62–63) | 3 jeśli autor spełnia kryterium (NSCA / naukowiec) — do sprawdzenia | Box Skip: start „assume an upright stance with one leg slightly behind the other”. Nieużyte — jedno źródło. |
| ufl-recsports-handout (2. sesja, nieużyte) | https://recsports.ufl.edu/wp-content/uploads/2020/05/RecSports-Injury-Prevention-Handout.pdf | Univ. of Florida RecSports | do decyzji koordynatora (centrum rekreacji uczelni) | Tylko wynik wyszukiwarki — PDF NIE przeczytany w tej sesji; kandydat na drugie źródło dla Front Cone Hops |

Odrzucone jako źródła (zasady projektu): strony innych aplikacji treningowych i serwisów z planami, zbiór z pola `fedb` (szczebel 5), materiały trenerów szkolnych (szczebel 5), ExRx (403, archiwum zablokowane). Niedostępne w 2. sesji: Special Olympics Canada „Agility.pdf” (404).

## 5. Otwarte

- [OTWARTE] **Physitrack** — status źródła do decyzji koordynatora (platforma ćwiczeń dla fizjoterapeutów; rozstrzygnięcie 02.11: dokumentacja innych aplikacji nie jest źródłem). Zależą od tego: Lateral Cone Hops (setup, 3 wskazówki, błąd) i Single-Leg Lateral Hop (setup, move, wskazówka). Zastępstw szukano: The Prehab Guys (tylko wersje jednonóż / inne kierunki), NISMAT (znalezione dla ruchu Lateral Cone Hops — bez lądowania i błędów), Special Olympics Canada (404).
- [OTWARTE] **Dumbbell Seated Box Jump — setup i move**: niezależnie potwierdza tylko Catalyst (bez hantla). `fedb` to szczebel 5. Wariant „hantel oburącz przy klatce” wynika z nazwy ćwiczenia, nie z techniki.
- [OTWARTE] **`bj.stepDown`** (zejście krokiem): przeczytane tylko NASM.
- [OTWARTE] **Single-Leg Lateral Hop — błąd**: „kolano ucieka do środka” tylko w The Prehab Guys. „Lądowanie na sztywnych nogach” — żadne źródło wprost.
- [OTWARTE] **Lateral Cone Hops — `jump.mis.stiff`**: poza Physitrack tylko ACE; NISMAT nie opisuje lądowania.
- [OTWARTE] **Alternate Leg Push-Off — zamach rąk**: ACE (jedna ręka, naprzemiennie) vs producent (oburącz); część wspólna bez zdania. Błąd i miękkie lądowanie — tylko ACE.
- [OTWARTE] **Front Cone Hops**: tylko ACE #118; kandydat UF RecSports (nieprzeczytany, szczebel do decyzji).
- [OTWARTE] **Single Leg Push-Off**: tylko ACE #230 (2. sesja — nie szukano).
- [OTWARTE] **Side to Side Box Shuffle**: tylko inSPORTline (2. sesja — nie szukano).
- [OTWARTE] **Box Skip**: tylko fragment książki; sprawdzić, czy autor spełnia kryterium szczebla 3.
- [OTWARTE] **Alternate Leg Diagonal Bound, Single-Leg Stride Jump, Double Leg Butt Kick, Single Leg Butt Kick, Side Standing Long Jump, Side Hop-Sprint, Single-Leg Hop Progression**: brak przeczytanego opisu w bibliotece szczebla 4. Rekomendacja dla koordynatora: karta bez własnych wskazówek albo ukrycie (status nie `ready`) do czasu źródeł — decyzja produktowa.
- Zestaw ogólny `jump` (`jump.drive` z zamachem rąk) dziś przypisany do „Alternate Leg Diagonal Bound” i „Bench Jump” oraz `jump.land`/`jump.mis.stiff` do „Alternate Leg Push-Off” i „Box Skip” — przeczytane źródła ich dla tych wariantów nie potwierdzają dwukrotnie; do rozważenia przy decyzji o kartach.

## 6. Stan

- Zrobione (1. sesja): 15/15 ćwiczeń ocenionych.
- Zrobione (2. sesja, 02.11): szczeble poprawione wg rozstrzygnięcia 02.11 (`fedb` = 5; producent tylko dla własnego sprzętu — inSPORTline zostaje); wpisy Physitrack przeniesione do bloku warunkowego 2b; Lateral Cone Hops: nowe zdanie `plyo.coneLat.hop` (ACE + NISMAT); Front Cone Hops — szukane, bez drugiego źródła.
- Stan bez Physitrack: gotowe 0, częściowe 3 (Lateral Cone Hops, Alternate Leg Push-Off, Dumbbell Seated Box Jump), otwarte 12. Przy uznaniu Physitrack: Lateral Cone Hops gotowe, Single-Leg Lateral Hop częściowe.
- Zostało: drugie źródła dla Front Cone Hops (przeczytać PDF UF RecSports i zdecydować o szczeblu), Single Leg Push-Off, Side to Side Box Shuffle (instrukcje innych producentów skrzyń), błędów w Single-Leg Lateral Hop i Alternate Leg Push-Off; zastępstwa Physitrack; 7 ćwiczeń bez żadnego źródła.
- Następny krok: PDF-y instrukcji producentów skrzyń plyometrycznych (lateral/side shuffle, single-leg push-off), podręczniki trenerów Special Olympics (inne adresy), NSCA Coach (PDF o pliometrii).
- Pułapki: strony innych aplikacji dominują w wynikach wyszukiwania — odrzucać; Physitrack ma adresy regionalne (us/uk/ca/au) tej samej treści — jedno źródło; The Prehab Guys: adresy `library.…?p=` przekierowują na logowanie, publiczne są `theprehabguys.com/vimeo-video/…`; blogi sklepów odzieżowych (bez autora) — szczebel 5.
