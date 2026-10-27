# Recenzja ruchu 1.1: rodzina sled_throw (8 ćwiczeń), 27.10.2026

Metoda jak w `core_hang.md` i `strongman.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2 na siatce u co 0,0125). Uzasadnień generatorów ani opisów commitów nie czytałem.

Walidator: **8/8 OK**. Szczelność reguł automatycznych: **0 z 2 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Medicine Ball Slam | OK z uwagą | piłka nad głową (216 cm) → zawias (biodro 86°, tułów 52°) → piłka przed kolanami (51 cm); A, B |
| One-Arm Medicine Ball Slam | OK z uwagą | jak wyżej, prawa ręka z piłką, lewa towarzyszy; A, B |
| Standing Two-Arm Overhead Throw | OK z uwagą | piłka za głową (x −22, tułów odchylony 8°) → rzut w przód, ręce do 135°; A |
| Backward Medicine Ball Throw | OK z uwagą | przysiad (kolano 100°), piłka między nogami → wyprost, ręce nad głową z odchyleniem do tyłu (−6°); A, B |
| Medicine Ball Scoop Throw | OK z uwagą | przysiad → rzut oburącz od dołu w przód i w górę (piłka 45 → 202 cm); A |
| Wall Ball | OK z uwagą | przysiad (kolano 103°, piłka przy klatce), wyprost z wypchnięciem piłki nad głowę; ściana x 95; A, C |
| **Sled Push** | **BŁĄD** | nr 1 |
| **Sled Drag (Harness)** | **BŁĄD** | nr 1 |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Sled Push, Sled Drag (Harness)** | u = 0 → 0,58, nogi | **W pierwszej połowie ruchu chód jest odwrotny (jak Yoke Walk w `strongman.md`).** Miednica stoi w x ≈ −4 (Drag: 0), dłonie na słupkach sań bez ruchu (Push). Prawa stopa od u = 0 do 0,58 dotyka podłogi (podeszwa 0,4–0,9 cm), a kostka sunie po podłodze do przodu z x −62 do +7, czyli o 69 cm. Lewa w tym czasie jest w powietrzu (13–21 cm) i cofa się z x 22 do −6. W drugiej połowie (u 0,6–1) jest już poprawnie: lewa w kontakcie cofa się (−6 → −59), a prawa idzie w powietrzu do przodu (do x 58). Detektor poślizgu: prawa dx +71 cm, lewa −38 cm (Drag: +71 / −36). | Przez cały ruch stopa podporowa w kontakcie przesuwa się względem miednicy tylko do tyłu (odpycha podłoże), a wykroczna przenosi się do przodu nad podłogą. W pierwszej połowie wykroczna powinna być lewa (do przodu), a podporowa prawa (do tyłu). | 90% | realny | nie: brak reguły na kierunek ruchu stopy w kontakcie (propozycja `stopa_podporowa_nie_sunie` w `strongman.md`) |

## OK z uwagą (backlog, nie blokuje)

- **A. Palce nad podłogą przy wspięciu.** Overhead Throw: 3,3 cm przez u 0,45–1. Backward, Scoop i Wall Ball: do 3,3 cm na końcu. Slam: 2,3 cm w u = 0. Ta sama klasa co uwaga A w `olympic.md`.
- **B. Piłka nie opuszcza dłoni.** Slam kończy się z piłką przed kolanami (51 cm), a nie przy podłodze. Rzuty kończą się z piłką w dłoniach. To ograniczenie rysunku (piłka przypięta do chwytu). Cecha „uderz piłką o podłogę” jest słabo widoczna. Propozycja: w Slam piłka w u = 1 bliżej podłogi (ok. 20–30 cm, przed stopami).
- **C. Błąd `sq.mis.kneesIn` (Wall Ball) jest niewidoczny w rzucie z boku.** Kolana schodzą się w płaszczyźnie czołowej, a rodzina ma `views: ['side']`. Wiersz błędu wygląda jak poza poprawna.
- **D.** Sanie są narysowane jako płoza z jednym talerzem i słupkiem uchwytu. To przybliżenie sprzętu, czytelne.

## Proponowana reguła

`stopa_podporowa_nie_sunie` (jak w `strongman.md`): w marszu w miejscu kostka w kontakcie przesuwa się względem miednicy tylko do tyłu. Łapie Sled Push i Sled Drag (+71 cm), Yoke Walk (+50 cm), a nie flaguje carry (dx −44…−56).
