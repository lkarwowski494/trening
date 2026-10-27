# Recenzja ruchu 1.1: rodzina leg_machine (7 ćwiczeń), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, liczby z silnika v2). Dodatkowo liczyłem środek ciężkości funkcją `srodekCiezkosci` z `v2-jakosc.mjs` (masy segmentów z `data/zrodla/figury-masy-segmentow.json`) i porównywałem go z zasięgiem stóp na osi x.

Walidator: **7/7 OK**. Szczelność reguł automatycznych: **0 z 3 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Leg Press | OK | Siedzisko z oparciem (80°), platforma na dźwigni prostej (−15°) pod stopami. Kolano 86° → 15° (dół mniej więcej pod kątem prostym jak w `lp.setup`, na górze bez blokowania kolan jak w `lp.noLock`), biodro 125° → 86°. Miednica nieruchoma na siedzisku. Wiersz błędu `sq.mis.kneesIn` widoczny |
| Single Leg Press | OK | Jak Leg Press, platforma pod prawą stopą (z = 13). Lewa stopa na podłodze przed siedziskiem, kolano ok. 90° |
| Calf Press (leg press) | OK | Nogi prawie proste (kolano 15°, jak w `calf.knees`). Ruch tylko w kostce: 9° → −46°, palce pchają platformę (kostka x 90,7 → 90,6, pięta 97,7 → 90,5, palce 97,7 → 109,7). Wiersz błędu „niepełny zakres” |
| **Hack Squat** | **BŁĄD** | brak oparcia pod plecami, środek ciężkości 31–44 cm za piętami (nr 1) |
| **Pendulum Squat** | **BŁĄD** | to samo (nr 2) |
| **Lying Machine Squat** | **BŁĄD** | to samo przy tułowiu odchylonym 48° (nr 3) |
| Belt Squat Machine | OK z uwagą | Przysiad poprawny: kolano 8° → 108°, biodro 12° → 105°, tułów 4° → 30°, pięty na podłodze, środek ciężkości nad stopami (x −0,6…−3,8 przy stopach −5,9…18,7). Uwaga A |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Hack Squat** | wszystkie klatki: sprzęt, tułów | **Postać leży odchylona do tyłu w powietrzu, bez oparcia.** Sprzęt to `podloga` i `dzwignia` (obrót, punkt `miednica`, oś w (119,9; 116,2), ramię 140 cm). W rzucie z boku to jeden pręt od miednicy skośnie w górę i w przód, przez uda. Nie ma oparcia pod plecami ani platformy pod stopami. Tułów odchylony o 25° (`pochylenieTulowia` −25), barki 21–24 cm za miednicą. Środek ciężkości ciała leży w x = −11,8 / −5,1 / 1,5 (u = 0 / 0,5 / 1), a stopy w x 32,3…56,9, czyli **31–44 cm za piętami**: bez oparcia człowiek przewróciłby się do tyłu. Wskazówka `hack.setup`: „Oprzyj plecy o oparcie maszyny, stopy na platformie”. Ruch nóg jest poprawny (kolano 22° → 100°, biodro 25° → 70°, pięty na podłodze). | Oparcie (sanie na prowadnicy pod ok. 45°) pod plecami i barkami na całej długości ruchu, poduszki na barkach, platforma pod stopami. Plecy ≤ 3 cm od oparcia w każdej klatce, oparcie przesuwa się z miednicą wzdłuż prowadnicy. | 90% | realny (każde wyświetlenie) | nie: `srodek_ciezkosci_podparcie` obejmuje tylko podpory jednorącz/jednonóż, a `sprzet_rozpoznawczy` przechodzi przy samej `dzwignia` |
| 2 | **Pendulum Squat** | wszystkie klatki | Ta sama poza co Hack Squat (klatki identyczne, ruch w u = 0,5 nieco inny). Dźwignia to pręt od miednicy w tył i w dół do osi (−58,9; 32,8), bez oparcia i bez poduszek na barki. Środek ciężkości 34–44 cm za piętami (x −11,8 / −2,9 / 1,5). W maszynie wahadłowej plecy i barki opierają się o poduszki na ramieniu wahadła. | Oparcie i poduszki barkowe na ramieniu wahadła (łuk wokół osi za osobą), plecy na oparciu w każdej klatce. | 85% | realny | nie |
| 3 | **Lying Machine Squat** | wszystkie klatki | Tułów odchylony o 48°, pręt dźwigni od miednicy w górę i w przód (oś (82,7; 157)), bez oparcia. Środek ciężkości x = −25,2 / −14,8 / −4,5, czyli **37–57 cm za piętami**. „Lying” oznacza leżenie plecami na pochyłym oparciu. | Pochyłe oparcie pod całymi plecami (ok. 45–50°), poduszki barkowe, platforma pod stopami. | 85% | realny | nie |

## OK z uwagą (backlog, nie blokuje)

- **A. Belt Squat Machine: maszyna nierozpoznawalna.** Dźwignia to 33-centymetrowy pręt przy miednicy (oś (12,8; 60,7)). Nie ma pasa, łańcucha, platformy ani poręczy. Dłonie stoją w powietrzu przed klatką (chwyt (18,5; 123,5) → (24; 79,2)). Na podglądzie to zwykły przysiad bez obciążenia z rękami w przód. Przy pasie biodrowym typowo trzyma się poręcze maszyny, a tułów zostaje bardziej pionowy (30° na dole jest dopuszczalne). Pewność 65%.

## Proponowana reguła

| Reguła | Warunek | Błędy | Pozostałe |
|---|---|---|---|
| `srodek_ciezkosci_wszedzie` (niezmiennik) | w każdej klatce rzut środka ciężkości leży wewnątrz wielokąta podparcia, który obejmuje stopy, dłonie na podłodze **i** zadeklarowany sprzęt dotykający ciała (siedzisko, oparcie, ławka, podpórka). Reguła działa dla każdej rodziny, nie tylko dla podporów jednorącz | Hack 31–44 cm, Pendulum 34–44 cm, Lying 37–57 cm poza podparciem | Belt Squat, Leg Press (siedzisko), przysiady z partii 2: bez alarmu |
