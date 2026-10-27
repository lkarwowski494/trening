# Recenzja ruchu 1.1: rodzina cable_press (4 ćwiczenia), 27.10.2026

Metoda jak w `cable_row.md`: `origin/integracja-1-1` @ 4e5a7f95, plik `lib/figures/v2/poses/cable_press.json`, podgląd `htmlPodgladu` (każda klatka kluczowa, bok i przód, wiersze błędów), PNG w pełnej rozdzielczości, liczby silnikiem v2. Uzasadnień generatorów nie czytałem.
Rodzina ma w `families.ts` status `planned` (dziś niewyświetlana). Współrzędne: x w przód, y w górę, z w prawo, cm.

Walidator: **4/4 OK**. Błędów nie znalazłem, więc szczelności nie liczę (0 z 0).

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Wyciskanie na linkach (stojąc) | OK z uwagą | tyłem do dwóch wyciągów (x −45, z ±75), chwyt przy barkach (14; 130,5) → przed siebie (62,4; 137,5), łokieć 146° → 19° (bez blokowania, `press.noLock`), tułów pionowo, stopy płasko; uwaga A |
| Single Arm Cable Chest Press | OK | prawa ręka jak wyżej, lewa dłoń na brzuchu (2; 99,5; −22), linka od prawego wyciągu nie przecina tułowia |
| Seated Cable Chest Press | OK z uwagą | siedzisko 45, oparcie 85°, łopatki przy oparciu (tułów stały), łokieć 146° → 19°; A |
| Incline Cable Chest Press | OK | ławka skośna 55° (tułów 35° od pionu), bloczki nisko (y 15, z ±105), wypychanie prostopadle do tułowia (33° nad poziomem przy prostopadłej 35°); wiersz błędu `bp.mis.arch` widoczny |

## Znaleziska: BŁĄD

Brak.

## OK z uwagą (backlog, nie blokuje)

- **A. Bloczki 20–25 cm nad barkami** (Wyciskanie stojąc: bloczek y 160 przy barku 139,5; Seated: y 130 przy barku 105). Wskazówka `cpress.setup` mówi „mniej więcej na wysokości klatki lub barków”. Linka schodzi więc ku dłoniom pod kątem ok. 25° w stojącym i ok. 15° w siedzącym: ruch jest „lekko w dół”, a nie poziomy.
  Kierunek oporu nie zmienia rozpoznania ćwiczenia. Bloczek na wysokości barku (y ok. 140 stojąc, 105 siedząc) zgodziłby obraz ze wskazówką. Pewność 60%.
