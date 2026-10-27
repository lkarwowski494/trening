# Recenzja ruchu 1.1: rodzina rotator_cuff (7 ćwiczeń), 27.10.2026

Rodzina opcjonalna tej partii. Metoda jak w `dip.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2).

Walidator: **7/7 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

Wspólny ruch rotacji: łokieć przy boku (0; 109; 20), zgięty 88–91°, dłoń z przodu przy brzuchu (28; 109; 3) → na zewnątrz (18; 109; 48). Rotacja zewnętrzna to 0 → 1, wewnętrzna odwrotnie.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **External Rotation (hantel)** | **BŁĄD** | rotacja w płaszczyźnie poziomej na stojąco z hantlem, czyli bez oporu (nr 1) |
| External Rotation (linki), External Rotation with Band | OK (2) | wyciąg / guma z boku na wysokości łokcia (y 100, z −75), opór poziomy, poprawnie |
| Internal Rotation with Band, Cable Internal Rotation | OK (2) | zaczep po drugiej stronie (z 90), ruch odwrotny |
| Band Pull Apart | OK | ramiona na wysokości barków z przodu (x 62) na boki (x −11), łokieć 14° stały |
| Reverse Flyes With External Rotation | OK z uwagą | leżenie przodem na ławce skośnej, ramiona w bok (odwiedzenie 1° → 72°) z rotacją (obrót −60°), łokieć 35° stały; uwaga D z `row.md` (biodro −37°, wyjątek zakresu) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **External Rotation (hantel)** | cały ruch: ustawienie | **Rotacja zewnętrzna z hantlem w staniu, w płaszczyźnie poziomej.** Hantel porusza się poziomo: chwyt y 109 stale, z 3 → 48. Ciężar hantla działa pionowo, więc w tym ruchu prawie nie stawia oporu rotatorom. To ta sama poza i trajektoria co wersje z linką i gumą (różnica 0 cm), z innym przyrządem. Wersje z oporem poziomym (wyciąg, guma) są poprawne. | Z hantlem: leżenie na boku, łokieć przy boku zgięty 90°, hantel unosi się z okolicy brzucha w górę, czyli rotacja przeciw grawitacji. Druga możliwość: pozycja 90/90 (ramię odwiedzone 90°, przedramię z poziomu do pionu). Wariant do potwierdzenia przez badacza. | 70% | realny (rysunek sugeruje ćwiczenie bez obciążenia) | nie: reguły nie wiążą kierunku ruchu ciężaru wolnego (hantel) z kierunkiem grawitacji |

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `ciezar_wolny_pod_grawitacje` | dla sprzętu hantel / kettlebell / sztanga / talerz: w ruchu roboczym zmiana wysokości chwytu ≥ 30% drogi chwytu (ciężar wolny musi się unosić i opadać) | External Rotation (hantel): Δy = 0 przy drodze 46 cm | wznosy, uginania, wyciskania: Δy ≥ 50% drogi; Car Drivers (obrót talerza) do sprawdzenia, ale ma Δy 18–37 cm |
