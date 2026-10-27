# Recenzja ruchu 1.1: rodzina pulldown (8 ćwiczeń), 27.10.2026

Metoda jak w `cable_row.md`: `origin/integracja-1-1` @ 4e5a7f95, plik `lib/figures/v2/poses/pulldown.json`, podgląd `htmlPodgladu` (każda klatka kluczowa, bok i przód), PNG w pełnej rozdzielczości z powiększeniem kadrów, liczby silnikiem v2 (`keyframeFrame`, `jointAngles`). Uzasadnień generatorów nie czytałem.
Rodzina ma w `families.ts` status `planned` (dziś niewyświetlana). Współrzędne: x w przód, y w górę, z w prawo, cm.

Walidator: **8/8 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Lat Pulldown | OK z uwagą | chwyt (15; 165,5) → (19; 97), czyli 8 cm pod barkiem, przed klatką; łokieć 19° → 140°; drążek przed twarzą (≥ 22,9 cm od środka głowy); uwaga A |
| Close-Grip Front Lat Pulldown | OK z uwagą | chwyt ±11, koniec y 88; A |
| Underhand Lat Pulldown | OK z uwagą | podchwyt (obrót przedramienia +78°), chwyt ±18; A |
| V-Bar Pulldown | OK z uwagą | uchwyt wąski ±7, łokcie przy tułowiu (odwiedzenie 20°); A |
| Single Arm Lat Pulldown | OK z uwagą | pracuje prawa ręka, lewa na udzie; A |
| Full Range-Of-Motion Lat Pulldown | OK z uwagą | dwa wyciągi po bokach, łokcie w dół do boków (z 37); A |
| **Wide-Grip Pulldown Behind The Neck** | **BŁĄD** | drążek ociera tył głowy i kończy w oparciu (nr 1) |
| Straight Arm Pulldown | OK | stanie z pochyleniem 15°, łokieć 12–13° w całym ruchu (`sapd.arms`), bark 144° → 27°, drążek z góry do ud (y 76,7) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Wide-Grip Pulldown Behind The Neck** | u = 0,5–1, drążek, głowa, oparcie (rzut z boku) | **Drążek przechodzi przez tył głowy i kończy w oparciu ławki.** Środek chwytu jedzie prosto w dół: (1; 163,6) → (−5; 136,3) → (−11; 109). Głowa stoi nieruchomo w (3; 126,9), promień 9,5 cm, bez pochylenia. W u = 0,625 drążek jest 9,9 cm od środka głowy na jej wysokości (y 129,5, x −6,5 = tył czaszki), więc styka się z nią albo w nią wchodzi (gryf ma własną grubość). W u = 0,875–1 drążek jest za plecami, w x −11 przy y 109, a linia oparcia (`lawka` kat 85, od (0; 45) do (−6,5; 119,7)) leży na tej wysokości w x −5,6. Gryf stoi więc 5 cm za płaszczyzną oparcia, wewnątrz jego obrysu. Na powiększeniu ostatnich klatek kropka chwytu leży na krawędzi oparcia albo w nim. | Bez oparcia za plecami (w tej maszynie uda trzymają wałki, `lpd.thighs`). Głowa lekko pochylona w przód (ok. 15–20°) w fazie przejścia drążka, a drążek ≥ 2 cm od powierzchni głowy. Koniec ruchu na wysokości karku (y ok. 105–110) tuż za szyją. | 80% | realny | nie: drążek wyciągu (`chwyt: drazek`) nie ma kolidera, a ostatni odcinek linki przy dłoniach jest wyłączony z kolizji (`colliders.ts`, `EQUIP.cableEnd`); kolizja z głową i z oparciem nie jest sprawdzana |

## OK z uwagą (backlog, nie blokuje)

- **A. Oparcie za plecami zamiast wałków na udach** (wszystkie 7 ćwiczeń siedzących). Rysunek ma `lawka` z oparciem pochylonym 5° w tył, a tułów leży na nim (−5° od pionu). Wskazówka `lpd.thighs` mówi o wałkach przytrzymujących uda. Ruch ściągania ciągnie ciało w górę, więc maszyna trzyma uda, a nie plecy. Lekkie odchylenie tułowia jest typowe, ale bez oparcia.
  Schematyczny rysunek maszyny dopuszcza kontrakt, więc to nie błąd. Wałków na udach nie da się dziś narysować bez nowego rodzaju sprzętu: to propozycja dla silnika, nie dla danych. Pewność 65%.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `osprzet_bez_przenikania` (niezmiennik) | drążek wyciągu (`chwyt: drazek`, odcinek między dłońmi) i lina (`lina`) mają kolider jak gryf sztangi; w każdej klatce ≥ 1 cm od głowy, tułowia i sprzętu stałego (`lawka`, kolumna) | Behind The Neck: 9,9 cm od środka głowy (promień 9,5) i 5 cm za oparciem | pozostałe 7: drążek ≥ 21 cm od środka głowy, przed ciałem, bez alarmu |
