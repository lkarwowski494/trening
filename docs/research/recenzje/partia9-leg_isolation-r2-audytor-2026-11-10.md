# Recenzja niezależna rodziny v2 `leg_isolation` — partia 9, runda 2 (audytor, 10.11.2026)

Zakres: figury/partia-9-leg_isolation @ 09043585 (po r1 @ d4febb69). Zmiana od r1: tylko `tests/figures-v2-tor.test.ts` (naprawa Ś1) oraz README/macierz. Autor: programista partii 9; recenzent: audytor.

## Werdykt

**Rodzina: wyświetlana** (0 × KRYTYCZNE/WYSOKIE). Ś1 z r1 naprawione. Rysunek i treści bez zmian: skróty przeliczone samodzielnie (`zrodla-runtime.mjs --skroty`) są identyczne z r1 — v2 `5edb92cc8fa2`; karty Leg Extension `438254c7031a`, Leg Curl `f9681b034104`, Lying Leg Curl `e5e0bad9da9f`, Seated Band Hamstring Curl `4120ffb04282`, Slider Hamstring Curl `d4048f0a72f5`; zestawy Single-Leg Leg Extension `dd254d049291`, Standing Leg Curl i Standing Cable Leg Curl `0b503ccdff6a`; v1 Lying Leg Curl `0889838b0f76`. Ocena ruchu z r1 obowiązuje bez zmian.

## K14 — `git diff d4febb6..0904358 -- tests/`

| Zmiana | Ocena |
|---|---|
| `progLukuKolana`: próg = strzałka łuku r − √(r² − (l/2)²) + 2 cm, r = kostka–kolano (u = 0, rzut z boku), l = cięciwa kostki u = 0 → u = 1 | próg z geometrii ruchu (ten sam wzór i dryf co zaakceptowany `progDzwigni` chest_press_machine), nie z bieżącego odchylenia; zawrócenia nadal ≤ 1 |
| Zakres: jawna lista `NOGA_LUK` (6 ćwiczeń z kostką na łuku); Slider i Seated Band zostają przy 4 cm (test: `progLukuKolana` = null) | pozostałe rodziny i ćwiczenia bez zmian — funkcja zwraca null poza listą, gałęzie `ok` dla innych rodzin nietknięte |
| Negatywy: tor odkształcony o próg + 3 cm → false; 2 zawrócenia → false; próg w przedziale 9–17 cm | oblewają naprawdę (odchylenie p + 3 > p; zawrócenia 2 > 1); przedział zamyka próg przed rozrostem danych |

Nie jest to poluzowanie. Uwaga kosmetyczna (bez klasy): komentarz podaje Δθ 85–96°, Leg Extension ma 79° (strzałka 9,6 cm, w przedziale testu).

Uruchomione pojedynczo: `tests/figures-v2-tor.test.ts` — 200/200 zielone.

## Stan znalezisk z r1

- Ś1 — naprawione (wyżej).
- Ś2 — nadal otwarte: `tests/architecture-limits.test.ts` czerwony, `lib/figures/v2/poseData.ts` 25 673 B > próg 24 736 B (wariant A leada: próg = 25 673).
- N1–N5 — bez zmian, NISKIE, do backlogu.
