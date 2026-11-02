# Wskazówki techniki — rodzina `glute_floor` (fala W1, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda: jak w `hip_abd_add.md` (ten sam katalog) i docs/33 „Metoda”.

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Cable Kickback | otwarte | ruch ma 2 źródła (HKU s. 4, Western FM — wariant: maszyna FreeMotion); brak drugiego zdania wskazówek/błędów z 2 źródłami |
| Donkey Kick | otwarte | nie zbadane w tej sesji |
| Fire Hydrant | otwarte | ustawienie i ruch mają 2 źródła (ACE 7409, Physitrack); wskazówki tylko ACE |
| Clamshell | **gotowe** | NASM (blog), ACE 6315, Physitrack, Catalyst Athletics |
| Machine Glute Kickback | otwarte | jedno źródło (Western „LF Hip and Glute”); maszyny różnią się konstrukcją |
| Hip Extension with Bands | otwarte | nie zbadane w tej sesji (ACE 6315 „Elevated Plank With Hip Extension” — inne ułożenie ciała, analogia) |
| Prone Flutter Kicks | otwarte | nie zbadane w tej sesji |

## Wpisy do `cues.json` → `exercises`

```json
{
  "Clamshell": {
    "setup": [
      {"c": "clam.setup", "s": [
        ["nasm-blog-banded-clamshell", "Setup — „lie on one side with the knees bent and stacked”"],
        ["ace-pro-6315", "Clam Shells — leżenie na boku, kolana ugięte, nogi jedna na drugiej"],
        ["physitrack-clamshell", "Step 1 — „Lie on your good side with your legs bent and stacked on top of one another.”"],
        ["catalyst-766", "opis — leżenie na boku z ugiętymi kolanami"]
      ]}
    ],
    "move": [
      {"c": "clam.move", "s": [
        ["nasm-blog-banded-clamshell", "Movement — stopy razem, górne kolano „as high as possible”, ruch „slow and controlled”"],
        ["ace-pro-6315", "Clam Shells — „Keeping the inner arches of the feet together, externally rotate the top leg…”"],
        ["physitrack-clamshell", "FAQ — stopy razem, powoli unieś górne kolano i powoli opuść"],
        ["catalyst-766", "opis — unieś górne kolano jak najdalej i wróć pod kontrolą"]
      ]}
    ],
    "tips": [
      {"c": "clam.noRoll", "s": [
        ["nasm-blog-banded-clamshell", "Movement — bez odchylania bioder do tyłu"],
        ["catalyst-766", "opis — „Without rolling the body” (parafraza z wynikiem narzędzia)"]
      ]},
      {"c": "llc.control", "s": [
        ["nasm-blog-banded-clamshell", "Movement / Coaching Cues — „slow and controlled”, unikać rozpędu"],
        ["catalyst-766", "opis — powrót pod kontrolą"],
        ["physitrack-clamshell", "FAQ — „slowly lower your top knee back to the starting position”"]
      ]}
    ],
    "mistakes": []
  }
}
```

Uwaga do zestawu ogólnego Clamshell (`hab.hips`, `llc.control`, `hab.mis.high`): `hab.mis.high` („Noga za wysoko…”) przeczy źródłom
(NASM i Catalyst: kolano „as high as possible”, ACE: do końca zakresu ruchu) — zestaw do poprawy; karta powyżej go nie ma.

## Nowe zdania

| id | PL | EN (propozycja) | Potrzeba |
|---|---|---|---|
| clam.setup | Połóż się na boku, kolana ugięte, nogi ułożone jedna na drugiej. | Lie on your side, knees bent, legs stacked. | brak zdania o ułożeniu na boku z ugiętymi kolanami |
| clam.move | Trzymając stopy razem, unieś górne kolano jak najwyżej i opuść je powoli. | Keep your feet together, lift your top knee as high as you can, then lower it slowly. | brak zdania o ruchu „muszli” |
| clam.noRoll | Biodra nie uciekają do tyłu — zostań na boku. | Don't let your hips roll back — stay on your side. | wspólna wskazówka NASM i Catalyst |

Zdanie istniejące użyte: `llc.control`.

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| nasm-blog-banded-clamshell | https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes | NASM | 4 | Setup, Movement, Coaching Cues; „The primary muscle targeted during the banded clamshell is the gluteus medius.” |
| physitrack-clamshell | https://www.physitrack.com/exercise-library/how-to-perform-the-clamshell-exercise | Physitrack | 4 | Step 1–3, FAQ |
| catalyst-766 | https://catalystathletics.com/exercise/766/Clamshell/ | Catalyst Athletics (NOWA org.) | 4 (PROPOZYCJA) | opis ćwiczenia; narzędzie zwróciło parafrazę + krótki cytat „a very simple and accessible exercise to strengthen the lateral hip” |
| ace-pro-7409 | https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/ | ACE | 4 | P. McCall, 30.10.2019, „Fire Hydrant”: „Start in a quadruped position with the hands under the shoulders and knees under the hips.” — tylko w „Otwarte” |
| ace-pro-6402 | https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/ | ACE | 4 | A. Chelik, 01.05.2017, „Two-legged Fire Hydrant” — tylko w „Otwarte” |
| physitrack-fire-hydrant | https://www.physitrack.com/exercise-library/how-to-perform-the-fire-hydrant-exercise | Physitrack | 4 | Step 1–2 — tylko w „Otwarte” |
| western-fm | https://uwo.ca/campusrec/orientation/equipment_guides/freemotion_transmissions.html | Western SRS (jak w docs/33) | 4 | FM Hamstring, wersja na pośladki — tylko w „Otwarte” |

`ace-pro-6315` — opis w `hip_abd_add.md`.

```json
{
  "orgs": {
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; serwis szkoleniowy podnoszenia ciężarów)", "level": 4, "kind": "site"}
  },
  "sources": {
    "nasm-blog-banded-clamshell": {"org": "NASM", "title": "The Banded Clamshell: A Simple Move for Stronger Glutes (blog NASM)", "url": "https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes", "level": 4},
    "physitrack-clamshell": {"org": "Physitrack", "title": "Step-by-step guide to the clamshell exercise", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-clamshell-exercise", "level": 4},
    "catalyst-766": {"org": "Catalyst Athletics", "title": "Clamshell (#766)", "url": "https://catalystathletics.com/exercise/766/Clamshell/", "level": 4}
  }
}
```

Bez Catalyst karta Clamshell nadal jest kompletna? Nie w całości: `clam.noRoll` ma wtedy tylko NASM — przy odrzuceniu Catalyst
zostają `clam.setup`, `clam.move`, `llc.control` (1 zdanie wskazówek) → ćwiczenie „otwarte”. Decyzja o szczeblu Catalyst — audytor.

## Otwarte

- **Cable Kickback** — ruch: HKU s. 4 „Kick out the strapped leg backwards while keeping a straight posture.” + Western FM „keep your leg extended and drive your heel backwards toward the ceiling” (wariant: maszyna). Ustawienie przodem do wyciągu tylko HKU; noga prosta tylko Western (HKU — zdjęcie, nie tekst). Zestaw ogólny (`hext.range`, `plank.brace`, `hext.mis.arch`) nie ma potwierdzenia w przeczytanych źródłach dla tego ćwiczenia. Rozstrzygnie: druga organizacja opisująca wyciąg stojąc.
- **Fire Hydrant** — ustawienie (klęk podparty, dłonie pod barkami, kolana pod biodrami: ACE 7409, Physitrack krok 1) i ruch (unieś kolano w bok: ACE 7409, Physitrack krok 2) mają 2 źródła; wskazówki (biodra i barki równo — ACE 6402; kręgosłup długi, napięty brzuch — ACE 7409) tylko ACE. Strona Physitrack ma sprzeczności (lista mięśni, FAQ) — liczona tylko dla kroków 1–2. Zestaw ogólny `hab.mis.high` — bez źródła.
- **Machine Glute Kickback** — Western „LF Hip and Glute”: „Push the pad down with your leg until your hip is fully extended, then reverse the movement with control.” Jedna organizacja.
- **Donkey Kick, Hip Extension with Bands, Prone Flutter Kicks** — nie zbadane (limit kontekstu).
- Zestawy ogólne `hipExt` (Cable Kickback, Donkey Kick, Machine Glute Kickback, Hip Extension with Bands, Prone Flutter Kicks): `plank.brace` („Napnij brzuch…”) przy wersjach stojących/leżących — źródło tylko dla podporu; do przeglądu przy kolejnej partii.

## Dostęp

- ExRx i web.archive.org — nie próbowano (polecenie koordynatora).
- Physio-pedia — 403. Strony serwisów aplikacji z wyników wyszukiwania pominięto (nie zapisano).

## Stan

- Zrobione: Clamshell (gotowe), Lateral Band Walk (gotowe, w `hip_abd_add.md`); częściowe dane: Cable Kickback, Fire Hydrant, Machine Glute Kickback, Cable Hip Abduction, Cable Hip Adduction, Hip Abduction.
- Zostało: Donkey Kick, Hip Extension with Bands, Prone Flutter Kicks, Band Hip Adduction, Hip Flexion with Band; drugie źródło dla Cable Hip Adduction (1 wskazówka), Fire Hydrant (wskazówki), Cable Kickback.
- Następny krok: szukać w NASM (blog), HSS, Coach, BarBend, Breaking Muscle, Physitrack/Prehab Guys po nazwach ćwiczeń; producenci sprzętu dla maszyn (odwodzenie/przywodzenie, kickback).
- Pułapki: NASM exercise library — zgadywane adresy dają 404 (szukać przez wyszukiwarkę z `allowed_domains`); strony Physitrack bywają sprzeczne lub opisują inne ćwiczenie — czytać kroki, nie FAQ; Prehab Guys — pojedyncze filmy za logowaniem, strony „vimeo-tag” dostępne; PDF HKU to obrazy (czytać stronami); ACE nazywa „monster walk” chód w bok.
