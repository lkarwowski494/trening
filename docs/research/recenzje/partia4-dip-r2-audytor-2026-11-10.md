# Recenzja niezależna rodziny v2 `dip` — runda 2 (audytor, 10.11.2026)

Różnica po poprawkach W1/W2 (programista poprawki ≠ autor rodziny ≠ recenzent). Stan: `figury/partia-4-dip` @ e3c79af (r1 na fb8cf48), czysta kopia recenzji.

## Werdykt

| Wpis | Werdykt |
|---|---|
| v2 `dip` (5 ćwiczeń, 0 bez rysunku; sha 2d9f3c8f5868) | **do poprawy** (W4) |
| karty Chest Dip, Triceps Dips (ławka) | wyswietlana (bez zmian danych) |
| zestawy Triceps Dip, Ring Dips | wyswietlana |
| zestaw Dip Machine | do poprawy (W3 z r1, dane bez zmian) |
| v1 Triceps Dips (ławka) | zastapiona — razem z v2 „wyswietlana” |

## Stan znalezisk r1

- **W1 naprawione**: chwyt ławki z = ±11, cała dłoń na blacie (11 + 3,6 = 14,6 ≤ 15 cm), na wysokości blatu w każdym kadrze; arkusz z przodu obejrzany.
- **W2 naprawione**: dwie dźwignie (R z = +50, L z = −50), każda dłoń przy końcu własnej dźwigni, arkusze side/front obejrzane.
- **W3** bez zmian (zestaw Dip Machine) — do poprawy, backlog leada.
- **Ś1** (poręcze niewidoczne z przodu) bez zmian — backlog.
- Nowy test `tests/figures-v2-dip-podpora.test.ts`: 9/9 zielony (`--runInBand`); próg z geometrii (szerokość ławki, promień dłoni, 1 cm do podpory), negatywy odtwarzają W1 (z = ±22) i W2 (jedna dźwignia). Sprawdza tylko klatki kluczowe (7 wartości u) — wystarczające, bo chwyt jest stały albo na łuku dźwigni.

## Nowe znalezisko

| ID | Klasa | Pewność | Gdzie | Opis i miara | Realność |
|---|---|---|---|---|---|
| W4 | WYSOKIE | 90% | Triceps Dips (ławka), rzut z przodu, u ≥ 0,3 | Łokcie wyraźnie na zewnątrz (zgłoszenie programisty potwierdzone liczbami). Przy u = 1: łokieć z = 34,7 cm, bark 19,0, dłoń 11,0 — łokieć 23,7 cm na zewnątrz od dłoni i 15,7 cm poza barkiem; odwiedzenie ramienia (shAbd) 30°, przedramię odchylone ok. 46° od pionu w rzucie z przodu. Źródło reguły rodziny (NASM Bench Dips) wymienia to jako błąd: „Excessive elbow flare” (Common Mistakes) i „keep elbows pointing straight back (not flaring out)” (FAQ). Rysunek pokazuje błąd jako wzór. Błąd był już w r1 (łokieć z = 36,8 przy dłoni 22, shAbd 35°) — przeoczony przeze mnie w r1; po zwężeniu chwytu bardziej widoczny. Dla porównania Triceps Dip (poręcze): łokieć 5,1 cm poza dłonią, shAbd 15°. Test: w każdym u `abs(elbow.z) ≤ max(abs(shoulder.z), abs(grip.z)) + 3 cm` (łokieć w korytarzu bark–dłoń, łokcie do tyłu); dziś przy u = 1: 34,7 > 22,0. Poprawka: biegun łokcia do tyłu (np. [-1, -0.3, ±0.1] zamiast [-0.4, -1, ±0.3] w `zLawki`, `scripts/figures/agent-pozy/dip.mjs`). | realny (każde otwarcie rzutu z przodu) |

## Bez zmian względem r1 (cmp)

Arkusze `arkusz-slad.mjs` (PNG i HTML) bajtowo równe r1: Chest Dip side/front, Triceps Dip side/front, Ring Dips side/front. Różne (obejrzane od nowa): Triceps Dips (ławka) side/front, Dip Machine side/front.
`checkFrame` + `holdChecks` w 21 kadrach ławki i maszyny — 0 problemów. Zakres łokcia: ławka 16,0°/84,0° (reguła zakres ≤ 25°/≥ 80° spełniona), Dip Machine 21,3°/89,8°.

Skróty (`zrodla-runtime.mjs --skroty`, kopia @ e3c79af): v2 dip 2d9f3c8f5868; karty Chest Dip 58bc2ad0a6ce, Triceps Dips (ławka) 457bb9d115cb; zestawy Triceps Dip / Ring Dips / Dip Machine 90516c549650; v1 Triceps Dips (ławka) 0e72ab5e0fbf.
