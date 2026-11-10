# Recenzja niezależna r2 — rodzina core_floor (partia 7, linia 1.1), 10.11.2026

Recenzent: audytor (subagent, partia 7, sesja D). Autor rodziny: programista (subagent, partia 7, sesja D). Poprawki r1 zrobił inny programista. Stan: `figury/partia-7-core_floor` @ bf7d4f14 (worktree odłączone). Zakres: różnica f3647df1..bf7d4f14 oraz arkusze całej rodziny porównane z r1. Skrót v2 `core_floor` = `8cf398255940` (`--skroty` na bf7d4f14). Wpisy: `partia7-core_floor-r2.json` (kompletne, do przepisania 1:1).

**Werdykt rodziny: wyswietlana.** Oba WYSOKIE z r1 są rozwiązane. Nie ma nowych znalezisk KRYTYCZNYCH ani WYSOKICH.

## Różnica
- **Zmienione pliki:** pozy Sit Up i Bicycle Crunch (`poses/core_floor.json` i `core_floor-zatwierdzone.json`), 2 złote odciski, test „recenzja r1” w `figures-v2-core-floor.test.tsx`, opis zmiany celowej w `figures-v2-zgodnosc-wsteczna.test.ts`.
- **Arkusze:** `arkusz-slad.mjs`, 21 ćwiczeń, widok side. Porównanie `cmp` PNG z r1: 19 z 21 jest bajtowo równych. Różnią się tylko Sit Up i Bicycle Crunch; oba oglądane w pełnej rozdzielczości.
- **Testy** (`--runInBand`): `figures-v2-core-floor` i `figures-v2-zgodnosc-wsteczna`, 637/637 zielone.

## Ocena poprawek

| r1 | Stan | Miara (frameAt co 0,01) |
|---|---|---|
| W1 Sit Up | rozwiązane | Chwyt najwyżej 14,2 cm od głowy w każdej klatce (r1: 89 cm). Tor tułowia bez zmian (barki +51,6 cm). Stopy na podłodze (0,0 cm). |
| W2 Bicycle Crunch | rozwiązane | Obie stopy są nad podłogą: stawy stóp co najmniej 25,2 cm, kształt stóp co najmniej 24,7 cm. Kolana zmieniają się naprzemiennie 99° ↔ 8°, biodro zgiętej nogi dochodzi do 98°. Dłonie przy głowie (14,1 cm), więc zdanie crunch.neck pasuje wprost. Tułów najniżej −0,8 cm. Brak skrętu (twist 0) przyjmuję jako uproszczenie rzutu bocznego, bo żaden tekst zestawu nie opisuje skrętu. |

Testy r1 nie mają osobnego przypadku negatywnego. Dane sprzed poprawki je oblewają (89 cm > 20 cm; 0,0 cm < 5 cm), więc warunek K5 jest spełniony.

## Nowe obserwacje (nie blokują)
- **N5 NISKIE, Cross-Body Crunch** (pytanie leada): dłonie są 77–89 cm od głowy, ręka sięga ku przeciwnemu kolanu. Zestaw ogólny tego ćwiczenia (crunch.move, crunch.neck, crunch.lowBack) nie zawiera `crunch.setup` („dłonie przy głowie”) i nie ma karty własnej. Rysunek nie przeczy więc żadnemu tekstowi i nie jest to ten sam przypadek co W1 (tam przeczył karcie). crunch.neck („nie ciągnij głowy rękami”) jest przy tych rękach bezprzedmiotowe, ale nie fałszywe. Nie sprawdziłem źródła wariantu z ręką ku kolanu, dlatego trafia do backlogu.
- **N6 NISKIE, Bicycle Crunch:** barki stoją na 18,3 cm w u = 0 (prawe kolano zgięte) i na 30,0 cm w u = 1 (lewe kolano zgięte). Strony są asymetryczne, a fazy „Unoszenie 1 s / Opuszczanie 2 s” przy ruchu naprzemiennym — jak N2 z r1.

## Otwarte z r1 (bez zmian, do backlogu)
- S1 Superman (stopy 8,3 cm nad podłogą w u = 0). Lead uzasadnił odłożenie: zysk 0,6 cm przy walidacji ud.
- S2 Reverse Crunch (kolano 90° → 130°).
- S3 nakładka Bird Dog (linie 33 i 52 cm za krótkie).
- N1–N4 jak w r1.
