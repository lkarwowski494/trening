# Wskazówki techniki — `mobility_stand`, ruchy dynamiczne — uzupełnienie mobility_stand-dynamiczne.md

Data: 02.11.2026. Autor: badacz-merytoryczny (agent). Fala W1, grupa G2 (mobilność).

**Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/cues.json`.** Plik bazowy `mobility_stand-dynamiczne.md` pozostaje bez zmian;
ten plik tylko go uzupełnia (id zdań i źródeł z pliku bazowego użyte bez zmian, nowe zdania w przestrzeni `mobility_stand.u.*`).

**Metoda.** Szukałem brakujących źródeł szczebla ≤ 4 z organizacji innych niż w pliku bazowym (WebMD Ignite/Healthwise liczone jako jedna organizacja),
czytając strony (WebFetch) i PDF-y z pobranego pliku. Szczeble według „Rozstrzygnięcia szczebli źródeł” z briefu (02.11.2026): materiał WebMD Ignite
liczę tylko, gdy opublikowała go placówka medyczna z datą; strony siłowni, klubów, klinik prywatnych bez autora i rekreacji uczelnianej — szczebel 5 (nie liczone).
Wariant (siedząc / stojąc) liczony z opisem „(wariant: …)”.

## Ćwiczenia — stan po uzupełnieniu

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| World's Greatest Stretch | częściowe (bez zmian) | skręt z ręką do sufitu nadal jedno źródło (CFMWS); znaleziony szpital (Vail Health) potwierdza tylko wyprost przedniej nogi — trzecie źródło dla `wgsHamstring`, nie skrętu |
| Shoulder Circles | **gotowe** (było: częściowe) | ustawienie: Univ. of Iowa (Community Health Collaborative) + WebMD Ignite (ColumbiaDoctors, 01.05.2026); oba kierunki: Iowa + WebMD Ignite + Inclusive Sport |
| Dynamic Chest Stretch | częściowe (bez zmian) | ustawienie nadal tylko Inclusive Sport; nie znaleziono drugiego źródła szczebla ≤ 4 |
| Wrist Circles | **gotowe** (było: otwarte) | UC Berkeley UHS + WebMD Ignite (ColumbiaDoctors, wariant: siedząc); pozycja rąk w bok (opis bazy katalogu) — niepotwierdzona, patrz „Otwarte” |
| Knee Circles | otwarte | jedno źródło: Korpus Piechoty Morskiej USA (TECOM, 2017) |
| Standing Pelvic Tilt | otwarte | przeczytane źródła szpitalne opisują tylko wersję leżącą (analogia, nie liczy się) |
| Round The World Shoulder Stretch | otwarte | jedno źródło dla przenoszenia kija nad głową (organizacja certyfikująca trenerów, 2004); do tego niezgodność z opisem z bazy katalogu |
| Dynamic Back Stretch | otwarte (bez zmian) | nie znaleziono nowego źródła |
| Hip Circles (Prone) | otwarte (bez zmian) | nie znaleziono źródła; dalej niezgodna rodzina (ćwiczenie w klęku podpartym) |
| Lying Leg Crossover Swings | otwarte (bez zmian) | nie znaleziono źródła; niezgodna rodzina (leżenie tyłem) |
| Iron Crosses (Stretch) | otwarte (bez zmian) | znalezione opisy „scorpion” (leżenie przodem) — tylko szczebel 5 i strony aplikacji; niezgodna rodzina |
| Groiners | otwarte (bez zmian) | opis z katalogu: wskok obunóż z podporu do dłoni; znalezione opisy wyłącznie na stronach aplikacji i serwisach bez redakcji eksperckiej |

## Dane (do `exercises` w `data/zrodla/cues.json`) — tylko ćwiczenia, które zmieniły stan

```json
{
  "Shoulder Circles": {
    "setup": [
      {"c": "mobility_stand.u.standArmsLoose", "s": [["uiowa-chc-shoulder-neck", "„Shoulder Rolls”, punkt 1"], ["webmd-ignite-shoulder-roll", "kroki 1–2 (stojąc lub siedząc)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.shoulderRoll", "s": [["sportsg-inclusive-warmup", "Warm-up, „Shoulder Mobility”"], ["cc-seated-warmup", "s. 2, „Shoulder Shrugs” (wariant: siedząc) i s. 1 „Exercise Tips”"], ["uiowa-chc-shoulder-neck", "„Shoulder Rolls”, punkty 2–3"], ["webmd-ignite-shoulder-roll", "kroki 3–4 (smooth, circular motion)"]]}
    ],
    "tips": [
      {"c": "mobility_stand.u.bothWays", "s": [["uiowa-chc-shoulder-neck", "„Shoulder Rolls”, punkty 2–3 (forward, then backward)"], ["webmd-ignite-shoulder-roll", "kroki 3–4 (koło w jedną, potem w drugą stronę)"], ["sportsg-inclusive-warmup", "Warm-up, „Shoulder Mobility”"]]}
    ],
    "mistakes": []
  },
  "Wrist Circles": {
    "setup": [
      {"c": "mobility_stand.u.looseFist", "s": [["ucb-uhs-work-warmup", "„7 Wrist Circles”, punkt 1 (hands loosely closed)"], ["webmd-ignite-wrist-circles-fist", "krok 1 (very light fist; wariant: siedząc, przedramię na udzie)"]]}
    ],
    "move": [
      {"c": "mobility_stand.u.wristCircles", "s": [["ucb-uhs-work-warmup", "„7 Wrist Circles”, punkty 2–3"], ["webmd-ignite-wrist-circles-fist", "krok 2 (make slow circles with your hand; wariant: siedząc)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

## Nowe zdania

| Id | PL | EN (propozycja) | Uwaga |
|---|---|---|---|
| mobility_stand.u.standArmsLoose | Stań prosto, ręce luźno wzdłuż tułowia. | Stand tall with your arms relaxed at your sides. | Iowa: „back straight and your arms relaxed at your sides”; WebMD Ignite: „Stand or sit up straight… Keep your arms relaxed.” |
| mobility_stand.u.bothWays | Zmieniaj kierunek — raz w przód, raz w tył. | Switch direction — forward, then backward. | ogólne dla krążeń w płaszczyźnie strzałkowej; do innych ćwiczeń tylko po sprawdzeniu źródeł |
| mobility_stand.u.looseFist | Zaciśnij dłonie luźno w pięści. | Make loose fists. | |
| mobility_stand.u.wristCircles | Zataczaj dłońmi koła w nadgarstkach. | Circle your hands at the wrists. | oba kierunki — tylko UC Berkeley (szczebel ≤ 4), w „Otwarte” |

## Nowe źródła

```json
{
  "uiowa-chc-shoulder-neck": {"org": "University of Iowa — Community Health Collaborative (Dept. of Health, Sport, & Human Physiology)", "title": "Ergonomics: Shoulder & Neck Exercises", "url": "https://chtc.sites.uiowa.edu/ergonomics-shoulder-neck-exercises", "level": 4},
  "webmd-ignite-shoulder-roll": {"org": "WebMD Ignite (biblioteka ColumbiaDoctors)", "title": "Shoulder Roll (akt. 01.05.2026)", "url": "https://www.columbiadoctors.org/health-library/multimedia/shoulder-roll/", "level": 4},
  "webmd-ignite-wrist-circles-fist": {"org": "WebMD Ignite (biblioteka ColumbiaDoctors)", "title": "Wrist Circles (Fist) (akt. 01.05.2026)", "url": "https://www.columbiadoctors.org/health-library/multimedia/wrist-circles-fist/", "level": 4}
}
```

| Id | Organizacja | Szczebel | Co potwierdza |
|---|---|---|---|
| uiowa-chc-shoulder-neck | University of Iowa (wydział zdrowia i sportu) | 4 (PROPOZYCJA, materiał uczelniany bez autora — jak UC Berkeley UHS) | Shoulder Circles: plecy proste, ręce luźno wzdłuż tułowia; krążenie w przód, potem w tył |
| webmd-ignite-shoulder-roll | WebMD Ignite (ta sama organizacja co `webmd-ignite-ankle-circles`) | 4 (placówka medyczna + data — spełnia rozstrzygnięcie z 02.11.2026) | Shoulder Circles: stań/usiądź prosto, ręce luźno, płynne koła w obie strony |
| webmd-ignite-wrist-circles-fist | WebMD Ignite | 4 (jw.) | Wrist Circles (wariant: siedząc): dłoń w luźnej pięści, powolne koła |

Uwaga: Shoulder Circles ma tylko jedno źródło WebMD Ignite (`webmd-ignite-shoulder-roll`); Wrist Circles — jedno (`webmd-ignite-wrist-circles-fist`). W żadnym
ćwiczeniu WebMD Ignite nie liczy się podwójnie.

Cytaty kontrolne (po 1 zdaniu): Iowa „Shoulder Rolls” — „Keep your back straight and your arms relaxed at your sides”; WebMD Ignite „Shoulder Roll” krok 3 —
„Roll your shoulders up, then back, then down, and then forward in a smooth, circular motion.”; WebMD Ignite „Wrist Circles (Fist)” krok 2 — „Make slow circles with your hand.”

### Przeczytane, nieużyte w danych (do wykorzystania później albo odrzucone)

| Źródło (adres, miejsce) | Organizacja / szczebel | Co mówi | Dlaczego nie w danych |
|---|---|---|---|
| https://www.vailhealth.org/pdf/events/VH_FitnessAsYouAge-Handout-Stretches.pdf — s. 2 „Lunge to Hamstring Stretch”, s. 2 „Inch Worms” | Vail Health (szpital), treść firmowana, bez daty — 4 (PROPOZYCJA) | wykrok, dłonie po obu stronach przedniej stopy, biodra w tył i wyprost przedniej nogi; inchworm z podporu | dla WGS potwierdza tylko `wgsHamstring` (trzecie źródło, wariant bez skrętu) — stan WGS się nie zmienia; dłonie „inside and outside” przedniej stopy — inaczej niż `wgsLunge` (obie od wewnątrz) |
| https://www.dartmouth-hitchcock.org/sites/default/files/2020-12/dynamic-stretching-for-athletes.pdf — s. 3 „Crawl stretch” | Dartmouth-Hitchcock Rehabilitation Medicine (szpital), firmowane, nr 201110-240 — 4 (PROPOZYCJA) | inchworm ze startu na stojąco, nogi proste | poza zakresem zlecenia; daje drugie źródło (obok ACE #254) dla startu Inchworm na stojąco — do wykorzystania przy przeglądzie Inchworm. Kolana: D-H i CFMWS „straight”, ACE „soft, not locked” — sprzeczność zostaje |
| https://www.dvidshub.net/video/551398/knee-circles — opis „Preparation”/„Execution” | U.S. Marine Corps Training and Education Command, autor i data (2017) — 4 (PROPOZYCJA, jak CFMWS) | stopy razem, kolana ugięte, dłonie na kolanach; krążenie kolanami, kolana razem | jedno źródło |
| https://www.crossfit.com/workout/2004/12/09 — podpis zdjęcia | organizacja certyfikująca trenerów, treść firmowana, data — 4 | szeroki chwyt, kij z przodu nad głowę i do tyłu bez zginania rąk | jedno źródło; do tego opis z bazy katalogu (kij za biodrami, unoszenie za głową) może oznaczać tylko część łuku — do rozstrzygnięcia definicji |
| https://www.emfc.org/wp-content/uploads/Worlds-Greatest-stretch.pdf | siłownia ATP / klub piłkarski — 5 | WGS: łokieć do przedniej stopy, potem ręka do sufitu | szczebel 5 — nie liczony |
| https://rehabhero.ca/exercise/spider-man-reach-stretch | prywatna sieć klinik, autor bez kwalifikacji — 5 | wykrok, ręka do sufitu ze skrętem górnej części pleców | szczebel 5 — nie liczony |
| https://www.pdx.edu/recreation/sites/g/files/znldhr2076/files/2020-12/Week%206%20Mobility%20Routine.pdf — s. 3 „Wrist Circles” | rekreacja uczelniana, bez autora i daty — 5 (jak Western SRS) | Wrist Circles z rękami w bok i pięściami (zgodne z opisem bazy katalogu) | szczebel 5 — nie liczony |
| https://news.hss.edu/9-of-the-best-dynamic-stretches-to-warm-up-with-before-a-workout-according-to-personal-trainers/ | HSS — przedruk z serwisu prasowego | tylko nazwy ćwiczeń, bez instrukcji | brak treści technicznej |
| https://www.cedars-sinai.org/health-topics/how-to-do-a-pelvic-tilt-exercise; https://www.southtees.nhs.uk/resources/pelvic-tilt/ | szpitale — 4 | pochylenie miednicy w leżeniu tyłem | inne ułożenie (analogia) — nie liczone dla Standing Pelvic Tilt |

## Otwarte

- **World's Greatest Stretch — skręt z ręką do sufitu** (`mobility_stand.d.wgsTwist`) → nadal jedno źródło szczebla ≤ 4 (CFMWS). Przeszukane: ACE, NASM (adresy 404),
  NSCA, HSS, Cleveland/Mayo, Brookbush Institute (strona bez treści instrukcji), szpitale (Vail Health, Dartmouth-Hitchcock — wersje bez skrętu albo skręt w pozycji stojącej
  z piłką), materiały wojskowe USMC (PDF 403). Znalezione opisy skrętu — wyłącznie szczebel 5 albo strony aplikacji. Drugie źródło niezależne od CFMWS dla CAŁOŚCI:
  ACE #140 (bez skrętu) + Vail Health (bez skrętu) — potwierdzają wykrok i wyprost nogi, nie skręt.
- **Dynamic Chest Stretch — ustawienie** → nadal tylko Inclusive Sport. KU „Arm Swings” nie opisuje ustawienia (przeczytane ponownie 02.11.2026).
- **Wrist Circles — pozycja rąk i kierunki** → opis z bazy katalogu (ręce w bok) potwierdza tylko materiał szczebla 5 (PSU); UC Berkeley — łokcie zgięte przed sobą,
  WebMD Ignite — siedząc, przedramię na udzie. Rysunek: zgodne ze źródłami są ręce przed sobą. Oba kierunki — tylko UC Berkeley; „powoli” — tylko WebMD Ignite.
- **Shoulder Circles — `dyn.mis.jerk`** → nadal tylko Cleveland Clinic (WebMD Ignite mówi „smooth”, nie o szarpaniu).
- **Knee Circles** → jedno źródło (USMC TECOM). Pozostałe znalezione opisy — strony aplikacji.
- **Standing Pelvic Tilt** → brak źródła wersji stojącej szczebla ≤ 4 (wersje leżące w Cedars-Sinai i South Tees NHS — analogia).
- **Round The World Shoulder Stretch** → jedno źródło (organizacja certyfikująca trenerów) + niepewna definicja (pełny łuk z przodu do tyłu vs opis z bazy katalogu).
- **Groiners, Dynamic Back Stretch, Hip Circles (Prone), Lying Leg Crossover Swings, Iron Crosses (Stretch)** → brak źródeł szczebla ≤ 4; trzy ostatnie dalej w niezgodnej rodzinie
  (patrz plik bazowy, „Rozbieżność rodziny”).
- **Szczeble PROPOZYCJA po rozstrzygnięciu z 02.11.2026**: punkt (a) rozstrzygnięcia nie wymienia wprost uczelni ani szpitali, choć brief (zasady) podaje je jako szczebel 4 —
  do potwierdzenia przez koordynatora dla: UC Berkeley UHS, Univ. of Iowa, Vail Health, Dartmouth-Hitchcock, USMC, CFMWS, Inclusive Sport. Jeśli uczelnie spadną do 5:
  Wrist Circles → otwarte (zostaje WebMD Ignite), Shoulder Circles → setup tylko WebMD Ignite → częściowe.

## Stan

- **Zrobione (02.11.2026):** wszystkie 12 ćwiczeń ze zlecenia przejrzane. Zmiana stanu: Shoulder Circles (częściowe → gotowe), Wrist Circles (otwarte → gotowe).
  Bez zmian: World's Greatest Stretch i Dynamic Chest Stretch (częściowe), 8 otwartych. Nowe zdania: 4. Nowe źródła w danych: 3 (+ 4 przeczytane do przyszłego użycia).
- **Zostało:** drugie źródło skrętu WGS i ustawienia Dynamic Chest Stretch; Knee Circles, Round The World (drugie źródło + definicja), Standing Pelvic Tilt; ćwiczenia leżące
  po decyzji o rodzinie; Groiners.
- **Następny krok:** przewodnik Special Olympics „Fitness Dynamic Stretches Guide” (PDF > 10 MB — potrzebny odczyt lokalny, np. pobranie przez koordynatora); NSCA
  (artykuły NSCA Coach o rozgrzewce — przeszukiwanie serwisu, nie wyszukiwarki); materiały fizjoterapii NHS dla ciąży (często mają pochylenie miednicy na stojąco; PDF Frimley zwrócił 500).
- **Pułapki:** NASM — zgadywane adresy ćwiczeń zwracają 404 (oba wzory: `/resource-center/exercise-library/<slug>` i `/exercise-library/<slug>`); trngcmd.marines.mil — 403;
  jmu.edu PDF i uofmhealth.org (część stron) — 404/403; Medibank — 404; PDF-y z obrazem (UC Berkeley, Dartmouth-Hitchcock, Vail Health, PSU) czytelne dopiero z pobranego pliku;
  wyszukiwarka zwraca głównie serwisy aplikacji i media — nie są źródłem.
