# Recenzja ruchu 1.1: rodzina overhead_press (21 ćwiczeń), 27.10.2026

Metoda i zastrzeżenia jak w `dip.md`: `origin/integracja-1-1` @ 4e5a7f95, istniejące pozy z `lib/figures/v2/poses/overhead_press.json`, PNG w pełnej rozdzielczości, liczby z silnika v2.
Do porównania par ćwiczeń dodałem skrypt różnic: największa różnica położenia stawów (cm), obrotu przedramienia i odwiedzenia barku na 41 punktach u.

Walidator: **21/21 OK**. Szczelność reguł automatycznych: **0 z 2 błędów (0%)**.

Cechy wspólne rodziny: stanie (miednica 0; 89,5), kolano 10°, tułów pionowo. Wyciskanie stojące (sztanga, hantle, guma, kettlebell, linki) ma **identyczną trajektorię**: chwyt (22; 154; ±26) → (22; 178) → (7; 203), łokieć 130° → 9°. Różnica stawów sztanga ↔ hantle wynosi 0,0 cm.
Wersje siedzące są tym samym ruchem przesuniętym na ławkę 45 cm, z oparciem −5°.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Overhead Press (sztanga) | OK z uwagą | start na wysokości ust (uwaga A) |
| Overhead Press (hantle) | OK z uwagą | A |
| Band Shoulder Press | OK z uwagą | A; guma od stóp do dłoni mija uda z boku (z ≈ 21 cm przy biodrze 8,5 + udo) |
| Double Kettlebell Press | OK z uwagą | A; kule za nadgarstkiem (`dzwon: tyl`), pozycja rack |
| Kettlebell Press | OK z uwagą | A; wolna ręka na biodrze (łokieć 87°) |
| Single Arm Overhead Press (hantel) | OK z uwagą | A |
| See-Saw Press | OK z uwagą | A; ręce na przemian (L w górze, gdy R na dole), poprawnie |
| **Arnold Press** | **BŁĄD** | brak cechy rozpoznawczej (nr 1) |
| **Kettlebell Arnold Press** | **BŁĄD** | jak nr 1 |
| Seated Shoulder Press (hantle) | OK z uwagą | A (chwyt 14 cm nad barkiem) |
| Kettlebell Seated Press | OK z uwagą | A |
| Seated Barbell Military Press | OK z uwagą | A; ruch identyczny z hantlami (0,0 cm) |
| Seated Cable Shoulder Press | OK z uwagą | A; linki od dolnych bloczków z = ±90 |
| Wyciskanie nad głowę (linki) | OK z uwagą | A |
| Standing Barbell Press Behind Neck | OK | sztanga z karku (−13; 148) prosto do góry (8; 196), chwyt ±46; tył głowy mija o ok. 2 cm (głowa r 9,5 w x 0, sztanga x −13) |
| Push Press | OK z uwagą | ugięcie jest (kolano 10° → 54° → 10° w u 0–0,3), ale tułów pochyla się 10° (uwaga B) |
| Push Press - Behind the Neck | OK z uwagą | B |
| Landmine Press | OK | łuk wokół osi landmine (x 169, długość 200): odległość chwyt–oś 200,1 / 199,7 cm; chwyt (16; 134) → (55; 169), łokieć 141° → 16° |
| Landmine Linear Jammer | OK | wybicie z półprzysiadu (biodro 48°, kolano 67°) do wyprostu, potem wypchnięcie |
| Single-Arm Linear Jammer | OK | jak wyżej, jedna ręka |
| Pike Push Up | OK | biodra wysoko (biodro 118° → 126°), głowa schodzi przed dłonie (x 79 przy dłoniach 66), 19 cm nad podłogą, łokieć 15° → 115° |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Arnold Press**, **Kettlebell Arnold Press** | cały ruch, ramiona | **Ruch jest tym samym wyciskaniem co Overhead Press (hantle), różni się tylko obrotem przedramienia.** Różnica położenia stawów Arnold ↔ OHP hantle wynosi najwyżej 3,3 cm (łokieć, u = 0,25), a odwiedzenie barku najwyżej 6,1° (Arnold: 10° → 12° → 7°). Łokcie przez cały ruch są w z = 23–25 przy barku 19, więc ani się nie schodzą przed klatką na starcie, ani nie rozchodzą na boki w trakcie. Jedyna różnica to obrót przedramienia +80° → −75°. Na obrazie prawie go nie widać: w rzucie z przodu rączka hantla jest pozioma i na starcie, i na górze, a w rzucie z boku hantel jest widoczny od czoła (koło). Ten sam wynik daje Kettlebell Arnold ↔ Kettlebell Press. | Start: hantle przed twarzą, dłonie do siebie, łokcie przed klatką blisko siebie (odwiedzenie barku małe, łokcie bliżej osi ciała niż barki). W trakcie łokcie rozchodzą się na boki (odwiedzenie rośnie do ok. 60–90° w połowie), a przedramię obraca się, tak że na górze dłonie patrzą w przód. Wskazówki w aplikacji są ogólne (`ohp.*`), więc zakres ruchu łokci musi potwierdzić badacz (2 źródła szczebla 4). | 70% | realny | nie: `klatki_rozne` i reguły sensu nie porównują ćwiczeń między sobą. Nie ma reguły „wariant z nazwą własną różni się od wariantu bazowego cechą widoczną” |

## OK z uwagą (backlog, nie blokuje)

- **A. Dolna pozycja wyciskania na wysokości ust, nie przy barkach** (14 ćwiczeń: wszystkie stojące i siedzące wyciskania sprzed głowy).
  Chwyt w u = 0 leży 14 cm nad stawem barku (y 154 przy barku 139,5; środek głowy 161,5) i 22 cm przed nim, a łokieć ma 130°.
  Wskazówki mówią „sztanga przy przedniej części barków” i „opuść go z powrotem do barków” (`ohp.*`, Overhead Press sztanga). Przy obojczyku chwyt byłby ok. 5–8 cm nad stawem barku i ok. 10–14 cm przed nim, a łokieć ok. 140–150°.
  Brakuje ok. 9 cm z 58 cm drogi sztangi. Ruch jest rozpoznawalny, a opuszczanie do brody to częsta praktyka, stąd tylko uwaga. Pewność 60%.
- **B. Push Press:** w ugięciu (u = 0,06–0,3) tułów pochyla się do 10° w przód, a barki idą +4 cm w przód. Wskazówka mówi „ugięcie krótkie, tułów napięty”, a typowo ugięcie w push pressie jest pionowe, z tułowiem pionowo. Pewność 60%.
- Overhead Press (hantle) ma tę samą pozycję co sztanga, a hantle stoją przed twarzą (x 22) zamiast przy barkach/uszach. Zgodne ze wskazówką „łokcie pod nadgarstkami”, ale wygląda jak start Arnolda (por. nr 1).

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `wariant_rozny_od_bazy` | dla par „wariant z nazwą własną ↔ bazowy” (Arnold ↔ OHP hantle, KB Arnold ↔ KB Press) w rodzinie: max różnica stawów ≥ 8 cm albo różnica odwiedzenia barku ≥ 20° w jakiejś klatce; sama zmiana `obrotPrzedramienia` nie wystarcza | Arnold 3,3 cm / 6,1°, KB Arnold to samo | See-Saw ↔ OHP hantle różni się fazą (> 40 cm), Behind Neck ↔ OHP sztanga (> 30 cm) |
