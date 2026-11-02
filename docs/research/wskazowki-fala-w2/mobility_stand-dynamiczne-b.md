# Wskazówki techniki — `mobility_stand`, ruchy dynamiczne, część B (fala W2, G2)

Data: 02.11.2026. Autor: badacz-merytoryczny (agent). Prefiks źródeł: `w2g2-msb-`.

**Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/cues.json`.** Plik uzupełnia pliki W1 `mobility_stand-dynamiczne.md`
i `mobility_stand-dynamiczne-uzupelnienie.md`; stany wyjściowe wg przeliczenia koordynatora G2 z 02.11.2026 (ma pierwszeństwo).
Szczeble wg rozstrzygnięcia z 02.11.2026 z uzupełnieniami 1–3 (trusty NHS, szpitale, WebMD Ignite na stronie placówki medycznej z datą = 4;
Sport Singapore, uczelniane centra sportu, Physitrack, strony bez autora = 5; The Prehab Guys tylko z autorem).

**Postać ćwiczeń w katalogu.** `lib/catalog.generated.ts` nie ma instrukcji (tylko sprzęt, wzorzec, mięśnie, źródło `L3`); definicję wziąłem z opisu
otwartej bazy, z której pochodzi katalog (pliki `Dynamic_Chest_Stretch.json`, `Dynamic_Back_Stretch.json`, `Knee_Circles.json`), wyłącznie jako
definicję ruchu, nie jako źródło wskazówek (szczebel 5):
- Dynamic Chest Stretch — stojąc, proste ręce wyciągnięte przed sobą, dłonie razem; wymach prostymi rękami w tył i powrót przed siebie („klaśnięcie”).
- Dynamic Back Stretch — stojąc, stopy na szerokość barków; proste ręce wymachem w przód i w górę, z każdym razem wyżej, aż nad głowę.
- Knee Circles — stojąc, nogi razem, dłonie przy talii; krążenie kolanami.
- Iron Crosses (Stretch), Hip Circles (Prone), Lying Leg Crossover Swings — opis z W1 (leżenie przodem / klęk podparty / leżenie tyłem); patrz „Uwagi dla integratora”.

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan po W1 (przeliczenie) | Stan po W2 | Błędy (źródła / wnioskowane) | Uwaga |
|---|---|---|---|---|
| Dynamic Chest Stretch | otwarte | otwarte | 0 / 0 | `chestSwing` nadal jedno źródło szczebla 4 (KU Health System); nie znaleziono drugiego |
| Dynamic Back Stretch | otwarte | otwarte | 0 / 0 | brak źródła szczebla ≤ 4 dla wymachu prostych rąk w przód nad głowę |
| Knee Circles | otwarte | otwarte | 0 / 0 | jedno źródło (USMC TECOM, z W1); różnica z katalogiem co do dłoni |
| Hip Circles (Prone) | otwarte | otwarte — jedno źródło | 0 / 0 | ACE (artykuł z autorem CSCS, 2012); drugie znalezione bez autora (szczebel 5) |
| Iron Crosses (Stretch) | otwarte | otwarte | 0 / 0 | brak źródła szczebla ≤ 4 |
| Lying Leg Crossover Swings | otwarte | otwarte — jedno źródło | 0 / 0 | USMC TECOM „Supine Leg Overs” (autor, 2017); z błędami w źródle — czekają na drugie źródło |
| Shoulder Circles | częściowe | częściowe (tips dopełnione) | 0 / 0 | `mobility_stand.u.bothWays` ma teraz 2 źródła (trust NHS + WebMD Ignite); ustawienie nadal jedno źródło. W bloku tylko klucz `tips` — integrator scala z blokiem W1 |

Wnioskowanych błędów nie proponuję: jedyne potwierdzone zdania tych ćwiczeń (`mobility_stand.d.shoulderRoll`, `mobility_stand.u.bothWays`) dają
tylko zaprzeczenia typu „za szybko” / „w jedną stronę” — nie do pokazania na rysunku (wyłączone przez brief).

## 2. Blok do wdrożenia

```json
{
  "Shoulder Circles": {
    "tips": [
      {"c": "mobility_stand.u.bothWays", "s": [["w2g2-msb-cht-early-shoulder", "s. 1, ćwiczenie 1 „Sit or stand” (Roll your shoulders in both directions; wariant: stojąc lub siedząc)"], ["webmd-ignite-shoulder-roll", "kroki 3–4 (koło w jedną, potem w drugą stronę)"]]}
    ]
  }
}
```

Uwaga: `webmd-ignite-shoulder-roll` to istniejące id źródła z pliku W1 `mobility_stand-dynamiczne-uzupelnienie.md` (WebMD Ignite na stronie
ColumbiaDoctors, akt. 01.05.2026). Po scaleniu Shoulder Circles ma: move `shoulderRoll` (2 źródła wg przeliczenia), tips `bothWays` (2 źródła),
setup `standArmsLoose` — nadal do pominięcia (jedno źródło szczebla 4: WebMD Ignite; trust NHS mówi tylko „sit or stand”, bez prostych pleców
i rozluźnionych rąk — rysunek w ulotce pokazuje ręce wzdłuż tułowia, ale tekstu na to nie ma). Stan: częściowe.

## 3. Nowe zdania

Brak (użyte tylko istniejące zdanie W1 `mobility_stand.u.bothWays`). Propozycje do czasu drugiego źródła — w „Otwarte”.

## 4. Źródła

| Id | Adres, miejsce | Organizacja | Szczebel (uzasadnienie) | Co potwierdza |
|---|---|---|---|---|
| w2g2-msb-cht-early-shoulder | https://plr.cht.nhs.uk/download/202/Early%20Shoulder%20Exercises%20A4 — s. 1, pierwsze ćwiczenie („Sit or stand”) | Calderdale and Huddersfield NHS Foundation Trust, Physiotherapy Department; ulotka csph0004 v4, przegląd 1/27 | 4 — trust NHS, treść firmowana (uzup. 2: szpitale/systemy ochrony zdrowia) | Shoulder Circles: krążenie barków w obie strony, stojąc lub siedząc. Cytat: „Roll your shoulders in both directions.” |
| w2g2-msb-ace-bach-2012 | https://www.acefitness.org/certifiednewsarticle/2910/a-detailed-guide-to-designing-activity-specific-warm-up-and-mobility-drills/ — sekcja ćwiczeń, „Fire Hydrant Circles”; ta sama treść w PDF ACE Certified News, listopad 2012, s. 1 | ACE (ACE Certified News); autor Eric Bach, B.S., CSCS | 4 — organizacja certyfikująca trenerów, autor z kwalifikacjami, data | Hip Circles (Prone) — jedno źródło: klęk podparty, zgięte kolano uniesione w bok, biodra neutralnie, koła w obie strony. Cytat: „From a quadruped position, lift the bent knee out to the side while maintaining neutral hips.” |
| w2g2-msb-usmc-supine-leg-overs | https://www.dvidshub.net/video/551838/supine-leg-overs — opis „Preparation”, „Execution”, „Common Mistakes” | U.S. Marine Corps Training and Education Command (DVIDS); wideo Capt. Matthew Holfinger, nagr. 26.06.2017, publ. 27.09.2017 | 4 PROPOZYCJA — autor i data są, ale organizacja wojskowa spoza listy w uzup. 2 (analogicznie do USMC z W1; CFMWS bez autora = 5) — do decyzji koordynatora | Lying Leg Crossover Swings — jedno źródło: leżenie tyłem, stopy razem, ręce w bok dłońmi w dół; stopa do przeciwnej dłoni, barki przy podłodze, naprzemiennie. Cytat: „The Marine will try to touch their foot to the opposite hand while keeping the shoulders flat on the deck.” |

Przeczytane, nieliczone:

| Adres, miejsce | Ocena | Dlaczego nie |
|---|---|---|
| https://theprehabguys.com/vimeo-video/quadruped-hip-car/ — „Exercise notes” (HOW, COMPENSATION), publ. 12.05.2019 | 5 — brak autora (uzup. 2: Prehab Guys tylko artykuł z autorem) | Hip Circles (Prone): klęk podparty, koło biodrem, „isolate motion to your hip joint” — zgodne z ACE, ale nie liczy się |
| https://www.dvidshub.net/video/677374/scorpion | USMC TECOM, opis tylko „Marine conducts a proper scorpion.” | brak instrukcji (Iron Crosses) |
| https://www.nsca.com/contentassets/11647622285541019ee8ed532743cce5/coach-5.1.4-dynamic-warm-ups-for-the-land-based-athlete.pdf — s. 28, Table 1 | NSCA Coach 5.1, Triano i Pellegrini (MS, CSCS) | tylko nazwy („Arm circles”, „Crossbody arm swings”) bez opisu wykonania — nie potwierdza żadnego zdania |
| https://royalberkshire.nhs.uk/media/bvnhihdc/shoulder-injuries-exercise-advice_aug22.pdf — ćw. 2 | trust NHS, 4 | wymach jednej ręki w skłonie z podparciem (wahadło) — inne ćwiczenie niż Dynamic Chest Stretch (analogia) |
| https://hartfordhealthcarerehabnetwork.org/services/sports-medicine/conditions-treatments/dynamic-stretch-warmup | sieć rehabilitacji szpitalnej, 4 | brak ćwiczeń z tej części (wymachy rąk, krążenia) |
| https://www.nyuhs.org/sites/default/files/2021-03/Arm%20Swing.pdf | 5 — autor „Admin”, rysunki z serwisów qigong | wahadłowy wymach rąk z uginaniem kolan — inne ćwiczenie niż Dynamic Back Stretch |
| https://www.cuh.nhs.uk/patient-information/shoulder-range-of-movement-exercises-2 | trust NHS, 4 | nie ma krążenia barków (wynik wyszukiwarki przypisał mu zdanie z ulotki CHT) |
| https://jssm.org/tablejssm-11-600.xml/table002.xml | czasopismo recenzowane | rozgrzewka z rakietą tenisową — nie dotyczy |

## 5. Otwarte i uwagi dla integratora

**Otwarte (z powodem):**
- **Dynamic Chest Stretch** — `mobility_stand.d.chestSwing` i ustawienie: drugie źródło szczebla ≤ 4 nieznalezione. Przeszukane w W2: szpitale/trusty NHS
  (Royal Berkshire, Hartford HealthCare, CUH), NSCA (NSCA Coach 5.1 — tylko nazwa „Crossbody arm swings”), wyszukiwanie „arm hugs / swing arms out to the sides
  across chest” — wyniki: Physitrack, serwisy aplikacji, media (5 lub nie źródło). Do tego definicja katalogu (start z dłońmi razem przed sobą) różni się od
  KU (wymach w bok i przez ciało) tylko kolejnością faz — zdanie W1 nie przesądza pozycji startowej.
- **Dynamic Back Stretch** — brak źródła szczebla ≤ 4 dla wymachu prostych rąk w przód nad głowę ze stopniowo większym zakresem; KU „Arm Swings” (W1) to wymach
  naprzemienny — wariant, jedno źródło.
- **Knee Circles** — jedno źródło (USMC TECOM z W1: stopy razem, kolana ugięte, dłonie NA kolanach). Katalog: dłonie przy talii — rozbieżność; rysunek powinien
  poczekać na źródło. Przeszukane: hospital/NHS/university „knee circles / knee rotations” — wyłącznie serwisy aplikacji i strony bez autora; materiał Special Olympics PA
  (PDF „unified fitness with machines warm-up”) nieczytany — organizacja sportowa, prawdopodobnie 5.
- **Hip Circles (Prone)** — jedno źródło szczebla 4 (`w2g2-msb-ace-bach-2012`). Propozycje zdań na później (NIE do bloku):
  `mobility_stand.b.quadSet` „Klęknij podparty na dłoniach i kolanach.” / „Get on your hands and knees.”;
  `mobility_stand.b.kneeOutCircle` „Unieś zgięte kolano w bok i zataczaj nim koła — w obie strony.” / „Lift your bent knee out to the side and circle it, both ways.”;
  `mobility_stand.b.hipsLevel` (tips) „Biodra trzymaj równo.” / „Keep your hips level.” Potrzebne drugie źródło szczebla 4 (np. artykuł Prehab Guys z autorem, szpital).
- **Lying Leg Crossover Swings** — jedno źródło (`w2g2-msb-usmc-supine-leg-overs`, szczebel 4 PROPOZYCJA). Źródło podaje też błędy („Letting shoulders come off the deck”,
  „Bending the knee”). Propozycje na później: ustawienie „Połóż się na plecach, nogi razem, ręce w bok dłońmi do podłogi.”; ruch „Przenieś prostą nogę nad sobą do
  przeciwnej dłoni, barki zostają na podłodze; zmieniaj nogi.”; błędy „Barki odrywają się od podłogi.”, „Zgięte kolano.” Drugiego źródła nie znaleziono (ACE #231 to
  inne ćwiczenie — W1).
- **Iron Crosses (Stretch)** — brak źródła szczebla ≤ 4. Przeszukane: „scorpion” leżenie przodem (hospital / sports medicine / DVIDS) — wideo USMC bez opisu,
  pozostałe: serwisy aplikacji, Fitness Volt bez sprawdzenia autora, przedruki niskiej jakości.
- **Shoulder Circles — ustawienie** (`mobility_stand.u.standArmsLoose`) — nadal jedno źródło (WebMD Ignite). Próby drugiego: CUH (brak ćwiczenia), Leicester (404),
  WWL „Shoulder Exercises Level 1” (odczytana tylko okładka: Wrightington, Wigan and Leigh NHS FT, MSK Physiotherapy, Tpy 026, 01.2022 — treść ćwiczeń do sprawdzenia
  na dalszych stronach), PeaceHealth i Michigan Medicine (Healthwise = ta sama organizacja co WebMD Ignite, nie niezależne). Liczby powtórzeń z ulotek — nie do bloku.

**Uwagi dla integratora:**
- **Rodzina vs postać ćwiczenia:** Iron Crosses (Stretch) — leżenie przodem; Hip Circles (Prone) — klęk podparty; Lying Leg Crossover Swings — leżenie tyłem
  (potwierdza to też opis USMC „Supine Leg Overs”). Żadne nie jest stojące, a są w `mobility_stand` (przypisanie po słowach nazwy — W1: `lib/figures/v2/families.ts:140`,
  nie sprawdzałem tej linii ponownie). Sugestia jak w W1: przenieść do `mobility_floor` (decyzja właściwej roli); przyszłe zdania tych ćwiczeń dać w przestrzeni rodziny docelowej.
- **Szczebel USMC TECOM** (Knee Circles z W1, Lying Leg Crossover Swings tutaj) — do rozstrzygnięcia przez koordynatora; uzupełnienie 2 ocenia CFMWS bez autora na 5,
  a o materiałach wojskowych z autorem i datą nie mówi.
- Shoulder Circles: w bloku tylko `tips` (scalić z blokiem W1; setup W1 nadal na liście do pominięcia).
