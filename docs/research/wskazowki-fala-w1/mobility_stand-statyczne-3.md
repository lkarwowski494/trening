# Wskazówki techniki — rodzina `mobility_stand`, część: rozciągania statyczne (3)

Kontynuacja `mobility_stand-statyczne-2.md`. Data: 02.11.2026. Autor: badacz-merytoryczny (agent), fala W1, grupa G2 mobilność.

**Metoda.** Jak w częściach 1–2: strony czytane przez WebFetch, PDF-y z zapisanego pliku jako obraz strony; zdanie „gotowe”, gdy
potwierdzają je ≥ 2 przeczytane źródła szczebla ≤ 4 z różnych organizacji. Postać ćwiczenia brana z opisu w katalogu
(`docs/research/equipment/catalog.json`, pole `note`, i `docs/research/25-biblioteka/L3.json`), bo nazwy bywają mylące. Liczby (czas,
powtórzenia) nie wchodzą do zdań. Szczeble wg „Rozstrzygnięcia szczebli źródeł” koordynatora (02.11.2026). Id z części 1–2 bez zmian.

## Ćwiczenia

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| Chin To Chest Stretch | gotowe | było: otwarte (jedno źródło ACE #204). Teraz 3 organizacje: ACE #204, WebMD Ignite (ColumbiaDoctors), Huntsman Cancer Institute / University of Utah Health. Opis katalogu: „Seated, hands pull the head down” — siedząc potwierdzają 2 źródła; docisk dłońmi — tylko ACE (lekki), patrz „Otwarte” |
| Standing Biceps Stretch | gotowe | było: otwarte. Postać z katalogu: „Hands clasped behind the back, arms raised”. Ustawienie: ACE #209 (krok 3), MedlinePlus, Healthline; ruch (unieś ręce): ACE #209 krok 3 + Healthline. MedlinePlus opisuje ściąganie dłoni w dół — liczony tylko dla ustawienia |
| Standing Chest Stretch | otwarte (bez zmian) | postać z katalogu to „Elbows Back”: „Standing, hands on lower back, elbows pulled back”. ACE #209 opisuje INNĄ postać (ręce wzdłuż ciała); dla „dłonie na dole pleców, łokcie w tył” znaleziono tylko źródła szczebla 5 (ośrodek sportowy uczelni, instrukcja producenta sprzętu innego rodzaju) |
| Standing Elevated Quad Stretch | częściowe → do decyzji koordynatora | „Elevated” = stopa tylnej nogi na ławce/stopniu (opis katalogu: „Rear foot on a bench or step; a chair or couch also works”, L3: „Stopa tylnej nogi na ławce (S17)”). Tę wersję potwierdza tylko jedno źródło (Christ Hospital, szczebel 4 PROPOZYCJA). Dane z części 1 (`quadSet`, `quadMove`) opisują INNĄ wersję (pięta przyciągana ręką, bez podwyższenia) — patrz „Otwarte” |

## Dane (do `exercises` w `data/zrodla/cues.json`)

```json
{
  "Chin To Chest Stretch": {
    "setup": [
      {"c": "mobility_stand.s.chinSet", "s": [["webmd-neck-stretch-front", "krok 1: „Sit up straight in a firm chair, or stand up straight.”"], ["hci-neck-exercises", "„Tilt Head Forward and Backward”, punkt 1: „Sitting or standing…”"], ["ace-204", "Step 1: stań, stopy na szerokość bioder (tylko wersja stojąca)"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.chinMove", "s": [["ace-204", "Step 2: „Slowly drop your chin toward your chest (neck flexion)”"], ["webmd-neck-stretch-front", "krok 2: „Slowly bend your head forward…”"], ["hci-neck-exercises", "„Tilt Head Forward and Backward”, punkt 1: „…bring your chin to your chest.”"]]}
    ],
    "tips": [
      {"c": "mobility_stand.s.chinShouldersStill", "s": [["ace-204", "Step 5: „Avoid any movement of the shoulders…”"], ["webmd-neck-stretch-front", "krok 2: „…without moving your shoulders.”"]]}
    ],
    "mistakes": []
  },
  "Standing Biceps Stretch": {
    "setup": [
      {"c": "mobility_stand.s.claspSet", "s": [["ace-209", "Step 3: „extend your arms behind your back, clasping your hands together” (ACE nazywa to rozciąganiem przodu barku i klatki)"], ["healthline-bicep-stretch", "Standing bicep stretch, krok 1: „Interlace your hands at the base of your spine.”"], ["medlineplus-chest-stretch", "„Clasp your hands behind your back…”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.bicepsMove", "s": [["healthline-bicep-stretch", "Standing bicep stretch, kroki 2–3: wyprostuj ręce, „Raise your arms up as high as you can.”"], ["ace-209", "Step 3: ręce wyprostowane za plecami, „slowly press out through your hands and lift up” (parafraza)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Uwaga: `claspSet` to zdanie z części 2 (Chest And Front Of Shoulder Stretch) — to samo ustawienie, użyte bez zmian.

## Nowe zdania

| Id | PL | EN (propozycja) | Uwaga |
|---|---|---|---|
| mobility_stand.s.chinSet | Stań albo usiądź prosto. | Stand or sit up tall. | WebMD Ignite, HCI (siedząc lub stojąc), ACE (stojąc) |
| mobility_stand.s.chinMove | Powoli opuść brodę w stronę klatki. | Slowly lower your chin toward your chest. | ACE #204, WebMD Ignite, HCI |
| mobility_stand.s.chinShouldersStill | Barki zostają w miejscu — rusza się tylko głowa. | Keep your shoulders still — only your head moves. | ACE #204, WebMD Ignite |
| mobility_stand.s.bicepsMove | Wyprostuj ręce i powoli unieś je za plecami. | Straighten your arms and slowly lift them behind you. | Healthline, ACE #209 krok 3 |

## Nowe źródła

```json
{
  "webmd-neck-stretch-front": {"org": "WebMD Ignite (publikacja: ColumbiaDoctors)", "title": "Neck stretch (front)", "url": "https://www.columbiadoctors.org/health-library/multimedia/neck-stretch-front/", "level": 4},
  "hci-neck-exercises": {"org": "Huntsman Cancer Institute, University of Utah Health", "title": "Neck Exercises (fact sheet, 2022)", "url": "https://hci-portal.hci.utah.edu/sites/factsheets/Shared%20Documents/neck-exercises.pdf", "level": 4},
  "healthline-bicep-stretch": {"org": "Healthline", "title": "Bicep stretches (Standing bicep stretch)", "url": "https://www.healthline.com/health/bicep-stretch", "level": 4}
}
```

| Id | Organizacja | Szczebel | (a) / (b) / (c) wg rozstrzygnięcia 02.11.2026 | Co potwierdza |
|---|---|---|---|---|
| webmd-neck-stretch-front | WebMD Ignite na stronie ColumbiaDoctors | 4 | (a) recenzja kliniczna (WebMD Ignite Clinical Review Board); (b) „Current as of: May 1, 2026”, „Author: WebMD Ignite Staff” (stopka); (c) tak | skłon głowy w przód siedząc albo stojąc, bez ruchu barków. Ta sama organizacja co inne `webmd-*` — w ćwiczeniu liczona raz |
| hci-neck-exercises | Huntsman Cancer Institute (University of Utah Health) | 4 | (a) materiał dla pacjentów centrum medycznego uczelni, „Approved by a team of medical, health, and communications specialists” (stopka); (b) treść firmowana „Produced by HCI © 2022”, „December 2022 • Review December 2025” (stopka; termin przeglądu minął — do odnotowania); (c) tak | broda do klatki siedząc lub stojąc (ćwiczenie „Tilt Head Forward and Backward”, w ćwiczeniu na powtórzenia — liczone tylko dla ruchu i ustawienia); zasada ogólna „Do not stretch to the point of pain.” (patrz „Otwarte”) |
| healthline-bicep-stretch | Healthline | 4 (PROPOZYCJA) | (a) serwis zdrowotny z redakcją i recenzją ekspercką (recenzent: Gregory Minnis, DPT); (b) autor: Emily Cronkleton, „Updated October 13, 2026”; (c) artykuł instruktażowy, linki do produktów wewnętrzne, brak ujawnienia afiliacji na stronie — koordynator: potwierdź (c) | dłonie splecione u dołu pleców, ręce proste, unoszenie; ostrożności: bez sprężynowania, nie zmuszaj pozycji (jedno źródło — „Otwarte”) |

Przeczytane i NIE liczone (szczebel 5 lub ta sama organizacja): ośrodek sportowy University of Sussex, PDF „trapezius-pectorals” (bez autora i daty;
ośrodek sportowy ≈ sieć siłowni → 5) — opisuje dokładnie postać katalogu Standing Chest Stretch (dłonie na dole pleców, łokcie do siebie);
Krames/StayWell „Quadriceps Stretch” (wydawca należy do WebMD Ignite — nie niezależny od `webmd-quad-standing`).

## Otwarte

- **Chin To Chest Stretch — docisk dłońmi** (opis katalogu „hands pull the head down”): tylko ACE #204 krok 5, i to jako „light pressure” palcami
  nad podstawą czaszki. Zalecenie dla figury i karty: bez ciągnięcia głowy rękami (ani źródło, ani dwa nie opisują „ciągnięcia”). Do zdania nie weszło.
- **Chin To Chest Stretch — ostrożność (zdrowie, pełne zasady):** „nie rozciągaj do bólu, tylko na tyle, na ile wygodnie” — dla ćwiczeń szyi przeczytane
  tylko w `hci-neck-exercises` (nagłówek, zasada ogólna). ACE #204 i WebMD Ignite nie podają ostrożności. Jedno źródło → `st.mis.force` NIE wpisane.
  Zawroty głowy — tylko NHS WWL (część 1, inne ćwiczenie szyi). Szukać: drugie źródło szczebla ≤ 4 z ostrożnością dla skłonu szyi w przód.
- **Chin To Chest Stretch — „aż poczujesz rozciąganie z tyłu szyi”:** żadne z trzech przeczytanych źródeł nie podaje miejsca odczucia → nie wpisane (`st.tension` też nie).
- **Standing Biceps Stretch:** (1) kierunek dłoni — Healthline „palms to face down”, MedlinePlus „palms facing up” (i ściąganie dłoni w dół zamiast unoszenia) —
  ŹRÓDŁA RÓŻNE, do zdań weszła tylko część wspólna (dłonie splecione); (2) `st.noBounce` i „nie zmuszaj pozycji” — tylko Healthline; (3) „bez wysuwania bioder
  i wyginania lędźwi” — tylko ACE #209; (4) Healthline „nie blokuj łokci” — jedno źródło. (5) ACE #209 nazywa ten wariant rozciąganiem przodu barku i klatki,
  nie bicepsa — rozkład mięśni w katalogu (biceps, klatka, przód barku) zgodny z Healthline + ACE łącznie.
- **Standing Chest Stretch:** postać katalogu („Elbows Back”: dłonie na dole pleców, łokcie w tył) — brak źródła szczebla ≤ 4. ACE #209 (ręce wzdłuż ciała,
  łopatki ściągnięte, klatka lekko w górę) to inna postać — drugiego źródła dla niej też brak (Healthwise „Chest and shoulder stretch” to ruch z rękami w „W”,
  na powtórzenia — nie liczony). **Do decyzji (sprawa produktowa, przez koordynatora do właściciela):** (A) zmienić opis/figurę na postać ACE #209 i szukać dla niej
  drugiego źródła; (B) zostawić „Elbows Back” i dalej szukać źródła szczebla ≤ 4 (ulotki fizjoterapii, NHS). Rekomendacja: A — ACE to szczebel 4 z pełnym opisem, a „Elbows Back” ma dziś tylko źródła szczebla 5.
- **Standing Elevated Quad Stretch:** znaczenie „Elevated” ustalone z wewnętrznego opisu katalogu (stopa tylnej nogi na ławce/stopniu), ale jego źródło
  (L3-S17, baza ćwiczeń) ma po rozstrzygnięciu 02.11.2026 szczebel 5. Wersję z podwyższeniem z ŹRÓDŁA szczebla 4 potwierdza tylko Christ Hospital (PDF
  „Hamstring, Quad stretches”, sekcja Quadriceps, punkt 1: tyłem do stołu, grzbiet stopy na blacie, miednica podwinięta, ugięcie kolana nogi stojącej;
  https://www.thechristhospital.com/Documents/Our%20Services/Hamstring,%20Quad%20stretches.pdf → przekierowanie na serwer plików; w treści brak nazwy
  organizacji i daty — (b) słabe, jak Duke w części 2). Nie znaleziono: ACE, NASM (404/brak), NHS inform (403), OUH NHS (strona z samym filmem, bez opisu).
  **Konflikt z częścią 1:** zdania `mobility_stand.s.quadSet` / `quadMove` (trzymaj się ściany, chwyć stopę i przyciągnij piętę) opisują wersję BEZ podwyższenia —
  do karty „Elevated” pasują tylko kierunkowo. **Do decyzji (produktowa):** (A) traktować ćwiczenie jako zwykłe stojące rozciąganie czworogłowego — karta z części 1
  zostaje, ale `recommended` (ławka, skrzynia) i nazwa wprowadzają w błąd → zmiana katalogu; (B) zostawić wersję z podwyższeniem — karta z części 1 NIE do
  wklejenia, ćwiczenie otwarte do czasu drugiego źródła szczebla ≤ 4. Rekomendacja: B nie ma dziś podstaw do karty; A wymaga zmiany katalogu — wybór właściciela.

## Stan

- **Zrobione:** Chin To Chest Stretch (gotowe), Standing Biceps Stretch (gotowe), Standing Chest Stretch (sprawdzone — otwarte, postać katalogu bez źródła ≤ 4),
  Standing Elevated Quad Stretch (znaczenie „Elevated” ustalone z katalogu; wersja potwierdzona jednym źródłem; konflikt z kartą z części 1 → decyzja).
- **Zostało:** drugie źródło szczebla ≤ 4 dla: wersji z podwyższeniem (quad), postaci „Elbows Back” albo ACE #209 (Standing Chest), ostrożności szyi;
  z części 2: Chest Stretch on Stability Ball, Wall Lat Stretch (zamiast Parkview).
- **Następny krok:** po decyzji A/B dla Standing Chest i Standing Elevated Quad — szukać w ulotkach fizjoterapii NHS (PDF czytać z pliku) i w bibliotekach
  WebMD Ignite na innych witrynach szpitali (np. „quad stretch with chair”) — pamiętając, że WebMD Ignite/Healthwise/Krames to jedna organizacja.
- **Pułapki:** nhsinform.scot — 403; OUH OxPARC — sam film, bez opisu; PDF Christ Hospital przekierowuje na serwer plików (pobrać z adresu docelowego i czytać
  przez Read z `pages`); Krames/StayWell = WebMD Ignite (nie liczyć osobno); specialolympicspa.org PDF — 404; wyniki wyszukiwania dla „Elbows Back”
  i „elevated quad” to głównie biblioteki aplikacji (nie są źródłem). Jak w częściach 1–2: mayoclinic.org i ExRx — 403, web.archive.org zablokowane.
