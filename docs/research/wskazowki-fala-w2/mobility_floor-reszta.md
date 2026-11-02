# Wskazówki techniki — mobility_floor, reszta po W1 (fala W2, G2, 02.11.2026)

Badacz merytoryczny. Zakres: pięć ćwiczeń rodziny `mobility_floor` otwartych po W1 i bez póz v2: Upper Back Stretch, Intermediate Groin Stretch,
Side Lying Groin Stretch, Kneeling Forearm Stretch, Downward Facing Balance. Stan wyjściowy: przeliczenie W1 z 02.11.2026 (wszystkie pięć „otwarte”;
dla Upper Back Stretch zdania `mobility_floor.t.upperBack.setup` i `.reach` na liście „do pominięcia”, bo Sussexsport = szczebel 5).
Szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md` (z uzupełnieniami). Liczby (czasy, powtórzenia) i zdania o zdrowiu — świadomie poza blokiem.

## 0. Postać ćwiczeń w katalogu (`docs/research/equipment/catalog.json`, pole `note`)

| Ćwiczenie | `note` w katalogu | Uwagi |
|---|---|---|
| Upper Back Stretch | „Hands clasped forward, shoulders rounded.” (l. 27653) | bez sprzętu, pozycja (siedząc/stojąc) nieokreślona |
| Intermediate Groin Stretch | „Lying, leg out to the side with a strap. Belt, rope or band as a strap.” (l. 26499) | leżenie na plecach, pas |
| Side Lying Groin Stretch | „Side-lying, top leg raised and held.” (l. 27198) | opis bliższy unoszeniu nogi (wzmacnianie odwodzicieli) niż rozciąganiu przywodzicieli — patrz „Otwarte” |
| Kneeling Forearm Stretch | „Kneeling, palms flat with fingers back.” (l. 26640) | kierunek pochylenia nie podany |
| Downward Facing Balance | „Prone on a stability ball, hands on the floor, legs lifted and held straight.” (l. 22411) | `pattern: other`, wymaga piłki; równowaga/izometria, nie rozciąganie |

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan po W1 | Stan po W2 | Błędy (źródła / wnioskowane) |
|---|---|---|---|
| Upper Back Stretch | otwarte (2 zdania do pominięcia) | **gotowe** (setup 1, move 1; po 2 niezależne źródła szczebla 4) | 0 / 1 |
| Intermediate Groin Stretch | otwarte | otwarte (nadal jedno źródło szczebla 4 — Bay State) | — |
| Side Lying Groin Stretch | otwarte | otwarte (brak źródła; postać ćwiczenia niejasna) | — |
| Kneeling Forearm Stretch | otwarte | otwarte (jedyne opisy klęku z palcami do kolan — szczebel 5) | — |
| Downward Facing Balance | otwarte | otwarte (brak źródła; ćwiczenie nie należy do rozciągania) | — |

## 2. Blok do wdrożenia

Zdania `mobility_floor.t.upperBack.setup` i `.reach` zaproponowała W1 (`mobility_floor-tulow`, tabela nowych zdań) — brzmienie bez zmian;
W2 dokłada drugie niezależne źródło szczebla 4 (Vanderbilt) w miejsce Sussexsport (szczebel 5). Zestaw ogólny z `lib/figures/v2/cue-sets.json:682`
(`st.tension`, `st.noBounce`, `st.breathe`, `st.mis.force`) — bez potwierdzenia dla tego ćwiczenia (żadne z dwóch źródeł go nie podaje), nie wpisany.

```json
{
  "Upper Back Stretch": {
    "setup": [
      {"c": "mobility_floor.t.upperBack.setup", "s": [["w2g2-mfr-webmdignite-upperback", "krok 2"], ["w2g2-mfr-vumc-desk", "Recommended desk stretches, pkt 2 „Sitting stretch for upper body”"]]}
    ],
    "move": [
      {"c": "mobility_floor.t.upperBack.reach", "s": [["w2g2-mfr-webmdignite-upperback", "krok 4"], ["w2g2-mfr-vumc-desk", "Recommended desk stretches, pkt 2 „Sitting stretch for upper body”"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_floor.t.upperBack.mis.handsLow", "s": [["wniosek", "mobility_floor.t.upperBack.setup"]]}
    ]
  }
}
```

Co dokładnie potwierdzają źródła:
- `mobility_floor.t.upperBack.setup` („Spleć palce przed sobą na wysokości barków.”): WebMD Ignite krok 2 — „With your arms about shoulder height, clasp your hands
  in front of you.”; Vanderbilt — „straighten your arms out in front of you with your fingers laced.” (ręce wyprostowane przed sobą = na wysokości barków; wysokość
  wprost tylko WebMD Ignite — recenzent oceni, czy „arms out in front” wystarcza).
- `mobility_floor.t.upperBack.reach` („Sięgaj dłońmi w przód, aż poczujesz rozciąganie w górnej części pleców.”): WebMD Ignite krok 4 — „Reach straight forward
  so you are rounding your upper back.” + „You'll feel a stretch across your upper back and shoulders.”; Vanderbilt — „You should feel this stretch in your arms and your upper back.”
  (wypchnięcie wyprostowanych rąk w przód; ruch „sięgaj” u Vanderbilta wyrażony jako „straighten your arms out in front”).

## 3. Nowe zdania

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| mobility_floor.t.upperBack.mis.handsLow | Dłonie opuszczone nisko, poniżej barków. | Hands dropped well below shoulder height. | błąd wnioskowany: zaprzeczenie `mobility_floor.t.upperBack.setup` (dłonie splecione na wysokości barków — WebMD Ignite krok 2); zmienia ustawienie, widoczne na rysunku |

Zdania z W1 użyte bez zmian (jeszcze nie w `lib/cues/text/pl.json`): `mobility_floor.t.upperBack.setup`, `mobility_floor.t.upperBack.reach`.

## 4. Źródła

```json
{
  "w2g2-mfr-webmdignite-upperback": {"org": "WebMD Ignite (publikowane przez ColumbiaDoctors Health Library)", "title": "Lower neck and upper back (rhomboid) stretch (Current as of: May 1, 2026)", "url": "https://www.columbiadoctors.org/health-library/multimedia/lower-neck-upper-back-rhomboid-stretch/", "level": 4},
  "w2g2-mfr-vumc-desk": {"org": "Vanderbilt University Medical Center (My Vanderbilt Health)", "title": "Simple desk stretches for back, neck and shoulder pain (S. Kendrick, 19.08.2025)", "url": "https://my.vanderbilthealth.com/?p=40626", "level": 4}
}
```

| id | szczebel | uzasadnienie szczebla | przeczytane miejsce |
|---|---|---|---|
| w2g2-mfr-webmdignite-upperback | 4 | WebMD Ignite — „4 warunkowo”: materiał publikowany przez placówkę medyczną z datą (ColumbiaDoctors, „Current as of: May 1, 2026”); deklarowana recenzja zespołu lekarzy, pielęgniarek i in. To ta sama treść co `webmd-ignite-upper-back` z W1 (przeczytana ponownie 02.11.2026); Healthwise/Kaiser „Healthy Upper Back” = ta sama organizacja — nie jest drugim źródłem | kroki 1–6 |
| w2g2-mfr-vumc-desk | 4 | system ochrony zdrowia (szpital uczelniany) — szczebel 4 z samego firmowania (uzupełnienie 2 do pliku szczebli); autor i data na stronie | sekcja „Recommended desk stretches”, pkt 2 „Sitting stretch for upper body” |

Przeczytane, niewliczone: Calderdale and Huddersfield NHS „Soft Tissue Stretches” (csph0152 v3, s. 1–3: tylko szyja i czworoboczny — inne ćwiczenia);
Shirley Ryan AbilityLab „Lower Body: Range of Motion Exercises Self Directed for the Legs” (s. 1–3: pas tylko dla dwugłowych i łydki; „Inner and Outer Thigh
Stretch” siedząc z ugiętym kolanem — nie ten wariant); Bay State Physical Therapy (PMC blog, 17.07.2024, „Adductor (Groin) Stretch”) — przeczytane ponownie,
zgodne z W1 (patrz Otwarte); MDedge „Rehabilitating groin pull” (W. Nagler, zmiana 17.01.2019) — „Side-lying adductor stretch” z uniesionym ugiętym kolanem i rotacją
biodra, nie wariant katalogu; YogaUOnline „Reclining Hand to Big Toe Pose” — bez autora i daty → 5; Fitness Volt „Kneeling Forearm Stretch Alternatives” — bez autora
i daty → 5; Topend Sports „Wrist Extension Stretch” — bez autora, inne ćwiczenie (stojąc, ręka przed sobą).

## 5. Otwarte i uwagi dla integratora

- **[OTWARTE] Upper Back Stretch — zaokrąglenie pleców i broda do klatki.** Katalog („shoulders rounded”) i WebMD Ignite (kroki 3–4: broda do klatki,
  zaokrąglenie, „pulling your shoulder blades apart”) — jedno źródło szczebla 4; Vanderbilt milczy; Sussexsport (szczebel 5) każe trzymać plecy proste. Bez drugiego
  źródła nie wpisuję. Kandydat po drugim źródle: „Zaokrąglij górę pleców i rozsuń łopatki.” Pozycja siedząc/stojąc: WebMD — oba, Vanderbilt — siedząc na krześle;
  przypisanie do `mobility_floor` (podłoga) do sprawdzenia przez analityka/figury, zdania bloku pozycji nie przesądzają.
- **[OTWARTE] Intermediate Groin Stretch** — nadal jedno źródło szczebla 4: Bay State („Take a stretching band and put it around your foot.”, następnie noga w przód
  i „let your leg gently fall out to the side towards the floor until you feel a stretch in your inner thigh.”). Szukano w tej sesji: Emory „flexibility stretches” PDF
  (404), UCSF Sports Rehab „Lower Body Stretches” PDF (403), Shirley Ryan AbilityLab (brak wariantu), YogaUOnline (5), wyniki z Physitrack (5) i aplikacji pominięte.
  Kandydaci na zdania po drugim źródle: „Załóż pas na stopę i unieś prostą nogę.” / „Opuść nogę powoli w bok, aż poczujesz rozciąganie po wewnętrznej stronie uda.”
- **[OTWARTE] Side Lying Groin Stretch** — brak źródła. Postać z katalogu („top leg raised and held”) opisuje raczej unoszenie górnej nogi (odwodzenie), a mapa mięśni
  (przywodziciele, dwugłowe po 0,25) — rozciąganie; przeczytane źródła opisują inne warianty (MDedge — ugięte kolano z rotacją). Do analityka: ustalić postać
  (albo scalić z Intermediate Groin / usunąć) przed dalszym szukaniem.
- **[OTWARTE] Kneeling Forearm Stretch** — jedyne opisy klęku z dłońmi płasko, palcami do kolan i „lean back” to strony szczebla 5 (Fitness Volt bez autora, katalogi
  i aplikacje). W1: Medical News Today opisuje pochylenie w przód (sprzeczny kierunek). Szukano: NASM/ISSA/ACE/BarBend (brak trafień; strona BarBend o nadgarstkach 404),
  szpitalne karty rozciągania zginaczy nadgarstka (wszystkie stojąc/siedząc z ręką przed sobą — inne ćwiczenie). Kierunek ruchu z `note` katalogu nie wynika.
- **[OTWARTE] Downward Facing Balance** — jedyne trafienie nazwy to strona agregatora ćwiczeń (szczebel 5); bliskie ćwiczenia (unoszenie nóg w leżeniu przodem na piłce)
  tylko w Physitrack, VHI/Hattiesburg (5) i aplikacjach. To ćwiczenie równowagi/izometryczne tyłu ciała, nie rozciąganie podłogowe — przypisanie do rodziny
  `mobility_floor` wygląda na błąd (zgodnie z W1, `mobility_floor-nogi`, Otwarte). Zestaw `{"b":"open"}` (`lib/figures/v2/cue-sets.json:198`) bez zmian.
- Zestaw ogólny `st.*` dla czterech rozciągań (`lib/figures/v2/cue-sets.json:287, 320, 525, 682`) — dla żadnego z nich nie znalazłem dwóch źródeł; do przeglądu zestawu.
- Liczby (czas trzymania: WebMD Ignite 15–30 s, Vanderbilt 20 s; powtórzenia) — poza blokiem, inne zasady.

## Stan

- Zrobione (02.11.2026): Upper Back Stretch → gotowe (2 zdania z W1 z nową parą źródeł, 1 błąd wnioskowany, 1 nowe zdanie, 2 źródła); pozostałe cztery przeszukane — otwarte z powodem.
- Zostało: drugie źródło dla Intermediate Groin; ustalenie postaci Side Lying Groin i Downward Facing Balance (analityk); źródło szczebla 4 dla Kneeling Forearm.
- Pułapki: PDF-y szpitalne przez WebFetch przychodzą jako binarne — czytać zapisany plik narzędziem Read (obrazy stron, drogie w kontekście); Emory i UCSF PDF — 404/403;
  strony Prehab Guys przekierowują na logowanie.
