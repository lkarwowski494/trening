# Recenzja ruchu 1.1: rodzina delt_raise (30 ćwiczeń), 27.10.2026

Metoda jak w `dip.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2).

Walidator: **30/30 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

Ruchy podstawowe są poprawne i zgodne ze wskazówkami:

- **wznos bokiem:** łokieć 6° → 13° (stały, lekko ugięty), odwiedzenie 10° → 85°, w u = 1 łokieć y 139 przy barku 140, a dłoń y 130 („łokcie na wysokości dłoni lub wyżej”);
- **scaption:** płaszczyzna ok. 38° przed czołową (chwyt (39; 138; 69));
- **wznos przodem:** do wysokości barków (chwyt y 148), łokieć 14° stały; wersje „to Overhead” kończą nad głową (zgięcie barku 167°);
- **podciąganie wzdłuż tułowia (upright row):** łokcie do wysokości barków (y 135–138), sztanga do klatki (y 126), łokieć 22° → 138°;
- **odwrotne rozpiętki w pochyleniu:** tułów 68°, ramiona prostopadle do tułowia (odwiedzenie 88°), dłonie na wysokości barków (y 93 przy 95);
- **Y raise:** zgięcie barku 166° przy odwiedzeniu 32°, czyli litera Y.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Lateral Raise (hantle), One-Arm Lateral Raise (hantel), Band Lateral Raise, Cable Lateral Raise, Cable Seated Lateral Raise | OK (5) | |
| Dumbbell Scaption | OK | |
| Front Raise, Single Dumbbell Front Raise, Front Plate Raise, Alternating Deltoid Raise, Cable Front Raise | OK (5) | |
| Barbell Front Raise to Overhead, Dumbbell Front Raise to Overhead | OK (2) | łokieć 25° stały |
| Upright Row (sztanga), Upright Row (hantle), Dumbbell One-Arm Upright Row, Upright Row (linki), Band Upright Row, Smith Machine Upright Row, Smith Machine One-Arm Upright Row | OK (7) | |
| Car Drivers | OK z uwagą | obrót talerza tylko w jedną stronę (uwaga M) |
| Reverse Fly (hantle) | OK z uwagą | tułów 68° od pionu przy wskazówce „pochyl tułów prawie poziomo” (pewność 50%) |
| One-Arm Cable Rear Lateral Raise | OK | |
| Cable Reverse Fly | OK | stojąc, ramiona na wysokości barków z przodu (x 62) na boki (x −11), łokieć 14° stały |
| Y Raise (hantle), Cable Y Raise | OK (2) | |
| Machine Lateral Raise | OK z uwagą | jedna dźwignia (uwaga przekrojowa, README) |
| **Reverse Pec Deck** | **BŁĄD** | siedzi plecami do oparcia, wbrew wskazówce (nr 1) |
| Straight Raises on Incline Bench | OK | leżenie na skośnej ławce (35°), sztanga z przodu nad głowę (zgięcie barku 45° → 150°), łokieć 14–17° |
| Front Incline Dumbbell Raise | OK z uwagą | ruch poprawny (hantle zwisają pod barkami i idą przodem do wysokości barków, y 87); uwaga D z `row.md` (biodro −37°, wyjątek zakresu) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Reverse Pec Deck** | wszystkie klatki: ustawienie i sprzęt | **Postać siedzi plecami do oparcia, a wskazówka wyświetlana przy ćwiczeniu mówi: „Usiądź przodem do oparcia, klatka przy podporze”.** Ławka (blat 43 cm) ma oparcie za plecami. Tułów pionowo (0°), miednica (14; 54), twarz w +x, ramiona przed sobą (chwyt (76; 96)) rozchodzą się na boki (x 3, odwiedzenie 80°). W rzucie z boku to zwykłe siedzenie na krześle z oparciem. Dźwignia ma `trzyma: "R"`, więc maszyna ma jedną rączkę, a lewa ręka robi ruch w powietrzu. Łokcie kończą w x 9 przy barku x 14, czyli przed linią pleców (wskazówka: „aż łokcie znajdą się tuż za linią pleców”). | Siad przodem do maszyny, klatka oparta o podporę (podpora przed tułowiem, plecy wolne). Dwie dźwignie (R i L) z rączkami na wysokości barków. Ruch ramion na boki i w tył, aż łokcie miną linię pleców (x łokcia ≤ x barku − ok. 10 cm). | 75% | realny | nie: `sprzet_rozpoznawczy` sprawdza obecność ławki, a nie stronę oparcia; nie ma reguły zgodności ustawienia ze wskazówką `setup` |

## OK z uwagą (backlog, nie blokuje)

- **M. Car Drivers:** talerz trzymany przed sobą na wysokości barków obraca się w jedną stronę (dłoń R y 138 → 156, dłoń L 138 → 119). Animacja wahadłowa wraca tylko do środka, więc obrotu w drugą stronę („kierownica” w lewo i w prawo) nie widać. Klasa jak Side To Side Chins (pull_up, uwaga G) i Zottman (curl, uwaga J). Pewność 60%.
- Machine Lateral Raise: jedna dźwignia (README, uwaga przekrojowa).
