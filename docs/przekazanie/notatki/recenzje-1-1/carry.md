# Recenzja ruchu 1.1: rodzina carry (7 ćwiczeń), 27.10.2026

Metoda jak w `core_hang.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2 na siatce u co 0,0125). Uzasadnień generatorów ani opisów commitów nie czytałem.

Walidator: **7/7 OK**. Błędów nie znalazłem, więc szczelności nie liczę.

Wszystkie 7 póz ma ten sam cykl kroku:

- miednica stoi w x = 0, a jej wysokość waha się 86–94 cm;
- stopa podporowa w kontakcie przesuwa się do tyłu względem miednicy o 44–56 cm, a wykroczna idzie do przodu nad podłogą (podeszwa do 10,6 cm);
- tułów pionowo (0°), bez skłonu bocznego, ręce proste (łokieć 13–15°).

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Farmer's Walk | OK z uwagą | hantle przy biodrach (y 73–81, z ±25); uwaga A |
| Farmer's Walk (Farmers Handles) | OK z uwagą | jak wyżej (z ±29); A |
| Farmer's Walk (trap bar) | OK | gryf sześciokątny w dłoniach na wysokości bioder |
| Rickshaw Carry | OK z uwagą | rama rikszy narysowana jako gryf sześciokątny (przybliżenie sprzętu) |
| Suitcase Carry | OK | kettlebell w prawej ręce przy biodrze (z 29), tułów bez przechyłu (0°), lewa ręka luźno |
| Overhead Carry (hantle) | OK z uwagą | uwaga B |
| Double Kettlebell Front Rack Carry | OK z uwagą | uwaga C |

## OK z uwagą (backlog, nie blokuje)

- **A. Hantel zawsze poprzecznie.** W rzucie z przodu hantle (i uchwyty farmerskie) leżą wzdłuż osi z, a wewnętrzny talerz nachodzi na obrys uda (powiększenie u = 0,375–0,625). Przy noszeniu chwyt jest neutralny i hantel leży wzdłuż kierunku chodu. Silnik ma tylko dwa ułożenia hantla, poprzeczne i pionowe (`draw.ts`), więc to ograniczenie silnika, a nie pozy. W aplikacji rodzina ma tylko rzut z boku, gdzie tego nie widać.
- **B. Overhead Carry: hantle 16 cm przed barkami.** Chwyt (16; 199–205), ramię 164° od tułowia, łokieć 15°. Nad głową ciężar zwykle stoi nad barkami (nad środkiem stopy). Pewność 55%.
- **C. Front Rack: kettlebelle 34 cm przed osią tułowia.** Chwyt (34; 136–142), łokieć 115°, ramię 31° w przód. W pozycji „rack” dłoń jest przy obojczyku, ramię blisko tułowia, a dzwon opiera się o przedramię i klatkę. Na obrazie dzwon jest między dłonią a klatką, więc czyta się to jak „trzymanie przed klatką”. Reguła `rack_caly` mierzy tylko wysokość chwytu względem barków. Pewność 60%.
- **D. Animacja wahadłowa.** Faza 0 → 1 to jeden krok lewą nogą, a powrót 1 → 0 odtwarza go wstecz, więc postać robi krok w przód i krok w tył. To ograniczenie silnika (uwaga przekrojowa w `README.md`), a nie póz.
