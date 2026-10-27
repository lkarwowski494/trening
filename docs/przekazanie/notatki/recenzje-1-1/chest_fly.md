# Recenzja ruchu 1.1: rodzina chest_fly (17 ćwiczeń), 27.10.2026

Metoda jak w `dip.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2).

Walidator: **17/17 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

Rozpiętki mają poprawny łuk:

- łokieć stały 14° (wskazówka „łokcie lekko ugięte, w stałym kącie”);
- leżąc: od rozłożenia (łokieć na wysokości barku, y 53 przy barku 53, odwiedzenie 90°) do dłoni nad klatką (y 114);
- stojąc z linkami: ramiona na wysokości bloczka (y 140, high-to-low 143 → 108, low-to-high 121 → 170).

Pullovery idą zza głowy (zgięcie barku 140–165°) nad klatkę i dalej ku biodrom (29–70°).

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Chest Fly (hantle)** | **BŁĄD** | w górze obie dłonie w jednym punkcie (nr 1) |
| **Incline Chest Fly (hantle)** | **BŁĄD** | jak nr 1 |
| **Decline Dumbbell Fly** | **BŁĄD** | jak nr 1 |
| One-Arm Flat Bench Dumbbell Fly | OK | ta sama trajektoria, jedna ręka (bez kolizji) |
| **Flat Bench Cable Fly** | **BŁĄD** | jak nr 1 (uchwyty linek) |
| **Incline Cable Fly** | **BŁĄD** | jak nr 1 |
| Cable Fly, Cable Fly (high to low), Cable Fly (low to high), Band Chest Fly | OK (4) | dłonie w górze ±17,6 (bez kolizji) |
| Single Arm Cable Fly | OK | ręka przechodzi za oś ciała (z −4) |
| Pec Deck | OK z uwagą | siad plecami do oparcia (poprawnie), ramiona na wysokości barków; jedna dźwignia (uwaga przekrojowa, README) |
| Crucifix | OK | ćwiczenie izometryczne (`izometryczne` = true): utrzymanie ramion w bok na wysokości barków (odwiedzenie 90°), poza statyczna, zgodnie z istotą ćwiczenia |
| Pullover (hantel) | OK | hantel pionowo oburącz, łokieć 11–15° |
| Front Raise And Pullover | OK | sztanga zza głowy (165°) nad biodra (29°) |
| Wide-Grip Decline Barbell Pullover | OK | |
| Bent-Arm Barbell Pullover | OK | łokieć stały 50° |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Chest Fly (hantle), Incline Chest Fly (hantle), Decline Dumbbell Fly, Flat Bench Cable Fly, Incline Cable Fly** (5 ćwiczeń) | u = 1 (i okolice), dłonie i hantle / uchwyty | **Obie dłonie spotykają się w jednym punkcie, więc dłonie i hantle się przenikają.** W u = 1 chwyty R i L leżą w z +0,2 i −0,2, czyli 0,4 cm od siebie (Chest Fly: (−50; 113,9; ±0,2), Incline: (−23,4; 154,8; ±0,2), Decline: (−50,5; 113,2; ±0,2)). Szerokość dłoni i hantla (talerze) wynosi kilka do kilkunastu cm, więc dwie bryły zajmują to samo miejsce. W rzucie z przodu przedramiona krzyżują się nad klatką, a dwa hantle zlewają się w jeden. Wersje stojące z linkami kończą w ±17,6 i nie mają tego problemu. | Na górze hantle stykają się albo prawie stykają: środki chwytów ok. ±8–10 cm od osi (dłonie nad mostkiem, hantle obok siebie, nie w sobie). Łuk bez zmian. | 80% | realny (każde wyświetlenie, końcowa klatka; ruch wahadłowy zatrzymuje się w niej na 0,5 s) | nie: walidator sprawdza przenikanie ciała z podłogą i sprzętem, ale nie dłoń–dłoń ani sprzęt–sprzęt w dwóch rękach |

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `dlonie_nie_przenikaja` (niezmiennik) | w każdej klatce odległość chwytów R–L ≥ szerokość dłoni (ok. 8 cm), a przy dwóch hantlach / uchwytach ≥ suma promieni talerzy; wyjątek: jeden przedmiot trzymany oburącz (hantel `pionowo`, sztanga, talerz, lina) | 5 rozpiętek: 0,4 cm | Pullover (hantel pionowo, jeden przedmiot) bez alarmu; Cable Fly 35 cm |

Skan wszystkich 11 rodzin tej partii (minimalna odległość chwytów R–L przy dwóch osobnych przedmiotach, 41 punktów u) znalazł poza tymi 5 rozpiętkami jeszcze Tate Press (1,0 cm, błąd w `triceps.md`). Wszystkie pozostałe ćwiczenia mają ≥ 8 cm.
