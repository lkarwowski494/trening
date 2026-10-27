# Recenzja ruchu 1.1: rodzina triceps (29 ćwiczeń), 27.10.2026

Metoda jak w `dip.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2).

Walidator: **29/29 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**. Błąd znaleziony skanem przenikania dłoni (skrypt `dlonie`: minimalna odległość chwytów R–L przy dwóch osobnych przedmiotach, wszystkie 11 rodzin), potwierdzony na obrazie.

Szablony rodziny (wszystkie z nieruchomym ramieniem; pracuje tylko łokieć, zgodnie ze wskazówkami „ramiona nieruchomo”):

- **nad głową, stojąc** (8): ramię prawie pionowo (zgięcie barku 168°, łokieć w (6; 170)), chwyt za głową (−23; 157) → nad głową (9; 202), łokieć 120–124° → 14–21°.
  Przedramię mija głowę bokiem (z 13–17 przy promieniu głowy 9,5), bez przenikania.
- **leżąc** (Skullcrusher ×3, One-Arm Lying, Band Skull Crusher, Chain Handle, Cable Lying, Behind The Head, Tate Press): ramię lekko za pionem (100–110°), gryf schodzi nad czoło lub za czubek głowy (−83; 68) przy głowie (−72; 53), łokieć 100–132° → 0–19°.
- **ławka skośna / ujemna** (Incline ×2, Decline ×2): ten sam ruch przy pochyleniu ławki.
- **wyciąg z góry** (Pushdown ×3): łokieć przy boku (7; 108), chwyt (37; 114) → (11; 77), łokieć 98° → 16–24°.
- **w pochyleniu** (Kickback ×3): tułów 68°, ramię wzdłuż tułowia (zgięcie barku 0°), łokieć 91° → 7°.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Overhead Triceps Extension (EZ), Standing Overhead Barbell Triceps Extension, Overhead Triceps Extension (hantel), Kettlebell Overhead Triceps Extension, Dumbbell One-Arm Triceps Extension, Band Overhead Triceps Extension, Cable Overhead Extension, Standing Low-Pulley One-Arm Triceps Extension | OK (8) | |
| Skullcrusher (sztanga), Skullcrusher (EZ), Skullcrusher (hantle), One-Arm Lying Dumbbell Triceps Extension, Band Skull Crusher, Chain Handle Extension, Cable Lying Triceps Extension, Lying Close-Grip Barbell Triceps Extension Behind The Head | OK (8) | |
| **Tate Press** | **BŁĄD** | przedramiona się krzyżują, hantle przenikają się na mostku (nr 1) |
| Incline Barbell Triceps Extension, Cable Incline Triceps Extension, Decline Dumbbell Triceps Extension, Decline EZ Bar Triceps Extension | OK (4) | |
| Triceps Pushdown, Reverse Grip Triceps Pushdown (obrót +75°), Single Arm Triceps Pushdown | OK (3) | |
| Triceps Kickback, Two-Arm Dumbbell Kickback, Triceps Kickback (linki) | OK (3) | w wersji jednorącz wolna ręka zwisa swobodnie; wskazówki aplikacji nie wymagają podparcia |
| Machine Triceps Extension | OK z uwagą | jedna dźwignia (`trzyma: R`), uwaga przekrojowa (README) |
| Kneeling Cable Triceps Extension | OK z uwagą | ławka bez funkcji (uwaga L) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Tate Press** | u = 0 … 0,5, dłonie i hantle | **Dłonie przechodzą przez oś ciała, a hantle wchodzą w siebie.** W u = 0 chwyt R jest w (−44; 69; −1), czyli po lewej stronie osi, a chwyt L symetrycznie po prawej. W rzucie z przodu przedramiona tworzą „X” nad mostkiem, a hantle nachodzą na siebie. Najmniejsza odległość chwytów R–L to 1,0 cm (u = 0,35). W u = 0,25 dwa hantle ustawiają się w jedną linię z nachodzącymi talerzami. Wyprost (łokieć 132° → 0°) i łokcie na boki (z 28) są poprawne. | Hantle leżą na mostku końcami do siebie (stykają się talerzami). Środki chwytów ok. ±15 cm od osi (połowa długości hantla), przedramiona się nie krzyżują, łokcie na boki. | 80% | realny | nie: brak reguły dłoń–dłoń / sprzęt–sprzęt (jak w `chest_fly.md`, propozycja `dlonie_nie_przenikaja`) |

## OK z uwagą (backlog, nie blokuje)

- **L. Kneeling Cable Triceps Extension:** sprzęt ma `lawka` (blat 43 cm), ale ławka stoi ok. 60 cm przed postacią i nic jej nie dotyka. Postać klęczy pionowo (miednica y 50, biodro −6°, kolano 102°) i robi ten sam ruch co stojąc nad głową (różnica tylko o 40 cm w pionie).
  Popularny wariant „kneeling” to klęk tyłem do wyciągu z tułowiem w przód i łokciami opartymi o ławkę. Tę formę sugeruje obecność ławki. Wskazówki aplikacji (ogólne „łokcie nad głową”) obrazowi nie przeczą.
  Albo zdjąć ławkę ze sprzętu, albo użyć jej jako podparcia łokci. Pewność 60%.
- Machine Triceps Extension: patrz uwaga przekrojowa o maszynach dwuręcznych w `README.md`.
