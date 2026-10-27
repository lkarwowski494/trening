# Recenzja ruchu 1.1: rodzina hip_abd_add (6 ćwiczeń), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, liczby z silnika v2, kierunek zgięcia kolana).

Walidator: **6/6 OK**. Błędów: 0.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Hip Abduction | OK z uwagą | Siedzi na maszynie (oparcie 80°), tułów nieruchomy. Kolana rozchodzą się z ±14,3 do ±34,4 cm (z 28,6 do 68,8 cm), obie nogi symetrycznie, kolano 83° → 77°. Dłonie na uchwytach przy siedzisku. Uwaga A |
| Hip Adduction | OK z uwagą | Ten sam układ w odwrotnej kolejności (±34,4 → ±14,3 cm). Uwaga A |
| Cable Hip Abduction | OK | Stoi na lewej nodze (kolano 5°), miednica i tułów nieruchome (tułów 2°). Linka z przeciwnej strony (słupek z = −50) przechodzi przed nogą podporową. Kostka R odchodzi z z = 8,5 do 51,8 cm i unosi się do 20,6 cm, czyli odwiedzenie ok. 30°. Dłonie na biodrach |
| Cable Hip Adduction | OK | Linka z boku (z = 85). Noga R startuje odwiedziona (kostka z = 46,9) i przechodzi do osi przed nogą podporową (z = 0, x = 9,8 przy kostce L w x = 0) |
| Lateral Band Walk | OK | Półprzysiad (kolano 58°, biodro 50°, tułów 20°), guma na kostkach. Krok w bok: kostka R z = 14 → 27 (uniesiona 5,5 cm) → 40, czyli rozstaw 28 → 54 cm. Kolana na zewnątrz linii biodro–kostka (bez koślawienia) |
| Monster Walk | OK | Ta sama postawa, krok skośnie w przód: kostka R (0; 14) → (26; 28), uniesienie 5,5 cm, kolano nad linią biodro–kostka |

## OK z uwagą (backlog, nie blokuje)

- **A. Maszyna do odwodzenia i przywodzenia (Hip Abduction, Hip Adduction):** narysowana jest jedna dźwignia, tylko po prawej (`trzyma: R`), z punktem nacisku przy kostkach (y = 8,4). Lewa noga pracuje bez oporu. W typowej maszynie poduszki leżą po obu stronach, na zewnętrznej (odwodzenie) albo wewnętrznej (przywodzenie) stronie kolan lub ud. Ta sama klasa co „Dip Machine: tylko prawa dźwignia” w `dip.md`. Pewność 65%.
- **Uwaga ogólna:** `cue-sets.json` deklaruje błędy (`mis.jerk`, a przy Cable Hip Abduction `hab.mis.high`), a żadna z 6 póz nie ma wiersza błędu. To nie jest błąd ruchu, ale karta „częsty błąd” nie dostanie ilustracji. Do sprawdzenia, czy to zamierzone (szarpania nie da się pokazać pozą, za to `hab.mis.high` tak).
