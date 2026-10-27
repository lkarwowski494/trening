# Recenzja ruchu 1.1: rodzina strongman (1 ćwiczenie), 27.10.2026

Metoda jak w `core_hang.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2 na siatce u co 0,0125). Uzasadnień generatorów ani opisów commitów nie czytałem.

Walidator: **1/1 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Yoke Walk** | **BŁĄD** | chód odwrotny: stopa podporowa jedzie po podłodze do przodu (nr 1) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Yoke Walk** | u = 0 → 1, obie nogi | **Chód „moonwalk”: stopa na podłodze sunie do przodu, a stopa w powietrzu cofa się.** Miednica stoi w x = −2. Prawa stopa przez cały ruch dotyka podłogi (podeszwa 0,7–0,9 cm), a kostka przesuwa się z x −20,6 do +29,6, czyli o 50 cm do przodu po podłodze. Lewa stopa w tym czasie jest w powietrzu (podeszwa 20 → 0,3 cm) i cofa się z x 11 do −24. W chodzie jest odwrotnie: stopa podporowa stoi (względem miednicy cofa się), a wykroczna przenosi się do przodu w powietrzu. Tak jest w rodzinie carry (Farmer's Walk: stopa podporowa dx −56 cm w kontakcie, wykroczna do przodu nad podłogą). Do tego miednica opada o 16 cm (100 → 84). W u = 0 postać stoi na palcach tylnej stopy (kostka y 19,3, podbicie −45°) z kolanem przedniej nogi uniesionym o 76°, a w u = 1 jest w wykroku (kolana 29° i 67°). | Cykl kroku jak w carry: stopa podporowa w kontakcie przesuwa się do tyłu względem miednicy, wykroczna do przodu nad podłogą. Krótkie kroki pod ciężarem (rozstaw kostek ≤ 40–50 cm), miednica waha się najwyżej o ok. 5–8 cm (carry: 86–94 cm). | 95% | realny (każde wyświetlenie) | nie: reguły rodziny (`tulow_pion_marsz`, `tulow_bez_przechylu`) sprawdzają tylko tułów, a marsz jest w `otwarte_czesciowo` („marsz bez reguły”) |

## OK z uwagą (backlog, nie blokuje)

- Jarzmo narysowane jako sztanga z talerzami na barkach (gryf y 132–148, dłonie przy barkach, łokcie 149°). Nie ma ram ani nóg jarzma. To przybliżenie sprzętu, czytelne jako „ciężar na barkach”.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `stopa_podporowa_nie_sunie` (niezmiennik) | gdy podeszwa < 1,5 cm w kolejnych próbkach, a miednica stoi w x (marsz w miejscu): kostka przesuwa się względem miednicy tylko do tyłu (dx ≤ 0). W ruchach z przemieszczeniem miednicy (skoki, wykroki) stopa w kontakcie stoi w miejscu (przesunięcie ≤ 3 cm) | Yoke +50 cm | carry: dx −44…−56 (zgodnie), thruster i olympic: 0 cm |
