# Recenzja niezależna rodziny forearm — partia 5, runda r2 (audytor, 10.11.2026)

Stan zamrożony: `figury/partia-5` @ `4fa83a0c` (baza r1 `f0e4c57`; poprawki innego programisty: `48efb77f` W1, `4a54a751` S2, `4fa83a0c` pochodne). Recenzent: audytor (subagent), autor ≠ recenzent.
Arkusze: `arkusz-slad.mjs` — 11 ćwiczeń × side, 21 kadrów, `scratchpad/rec-forearm-r2`; cmp z r1: Reverse Plate Curls, Dumbbell Lying Pronation, Dumbbell Lying Supination bajtowo równe, 8 zmienionych. Liczby z `frameAt`.
Skróty (`--skroty`, sam): v2.forearm `3adcb03ac869` → `72e5f9d98b29`; reszta bez zmian względem f0e4c57 (diff: jedna linia). Zestawy: `8b1a50266007` (7 uginań), `8f9b3d083294` (Behind-the-Back), `88e974d922c7` (Reverse Plate Curls) — bez zmian. `liczba` = 13.

**Werdykt rodziny: do poprawy** (nowe W2 WYSOKIE).

## Poprawki r1
- **W1 — naprawione.** Behind-the-Back: palm x = −1,0 (dłoń do tyłu, nachwyt jak w źródle), chwyt 8,4 cm w tył i 2,0 cm w górę, odstęp od ciała 4,0 → 12,2 cm.
- **S2 — naprawione.** Dół ruchu −45° (uginanie) / +45° (odwrotne), zakres 97° / 93°; hantle przy kolanie: odstęp −0,1 cm, przenikanie 0,08 cm (≤ 1 cm, K7).

## Nowe znalezisko
| # | Klasa | Pewność | Opis i miara | Realność |
|---|---|---|---|---|
| W2 | WYSOKIE | 85% | Behind-the-Back: poza nadgarstkiem rusza się całe ramię. Kąt łokcia 24,3° → 0,0°, ramię 29° → 17° od pionu (12°), łokieć przesuwa się o 6,6 cm (z tego 4,4 cm w u 0,75–1 — widoczne „szarpnięcie” na końcu), błąd chwytu 0,39 cm w u = 1 (chwyt na granicy zasięgu; w r1: łokieć 16° → 26°, 2,5 cm). Źródło (`wyniki-uzup-1a.json:25`, kasmaker): „Keep your arms straight and your shoulders still so the only movement is at the wrists”. Test odtwarzający: zmiana kąta łokcia ≤ 5° i przesunięcie łokcia ≤ 2 cm w u 0…1; err chwytu ≤ 0,1 cm. Kroki: karta ćwiczenia → rysunek. | realny |

## Zostają (backlog, wersja do nadania przez koordynatora)
- **FA-S1 ŚREDNIE** — Reverse Plate Curls: talerz zawsze pionowy (`draw.ts:476`), przedramię obraca się o 104° przy zgięciu nadgarstka 0.
- **FA-S3 ŚREDNIE** — Dumbbell Lying Pronation / Supination rysowane na siedząco (nazwa „Lying”); obie są tą samą pętlą (różni je tylko pozycja startowa).
- **FA-N1 NISKIE** — 7 uginań: łokieć w 3D obok uda (z 30,8 vs udo 8,5–13,8); w rzucie z boku niewidoczne.
- **FA-N2 NISKIE** — poza błędu wr.mis.lift: łokieć opada 3,5 cm, zamiast się oderwać.
- **FA-N3 NISKIE** — Behind-the-Back: 2,0 cm w górę vs 8,4 cm w tył, a źródło mówi „up and slightly back”. Przy dłoni 7 cm i starcie −30° wynika to z geometrii; start bliżej 0° dałby wyraźniejsze „w górę”.

## K14 — `git diff f0e4c57..4fa83a0c -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| figury-forearm-ruch | Behind-the-Back: palm.x < 0, chwyt.x maleje, chwyt.y rośnie > 1 cm, odstęp ≥ 1 cm; 7 uginań: dół 44–65° | zaostrzenie. Próg 1 cm w górę: z geometrii dłoni 7 cm i zgięcia −30° → +50° wychodzi 7·(cos 30° − cos 50°) = 1,56 cm — próg uzasadniony. Brak testu „ramię nieruchome” (W2) |
| zgodnosc-wsteczna + figury-v2-zlote.json | odciski | zmienione dokładnie 8 wpisów `forearm/*` (7 uginań + Behind-the-Back), reszta bajtowo równa |
| Testy rodziny | figury-forearm-ruch, nakladka-forearm, zgodnosc-wsteczna | 660/660 przechodzą |

## Zestawy (K12)
9 wpisów „wyswietlana”. W 7 uginaniach „tak nisko, jak pozwala nadgarstek” pasuje teraz do dołu ±45°. Behind-the-Back: wr.range — ruch nadgarstka unosi sztangę w górę i do tyłu, zgodnie ze zdaniem; W2 to wada rysunku ramienia, nie zdania zestawu. Reverse Plate Curls — bez zmian.

## Sprawdzone bez znalezisk
Orientacja hantli i dłoni (pod- i nachwyt), wyciąg, łokieć nieruchomy w 7 uginaniach (kąt 116,9–117,1°), ślad w chwycie we wszystkich 11, przenikanie ciężaru, nakładka (`forearmWristLimb`, `forearmElbowPlumb`) bez zmian.
