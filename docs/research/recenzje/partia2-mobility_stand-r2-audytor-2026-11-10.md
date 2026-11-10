# Recenzja niezależna r2 — rodzina v2 `mobility_stand` (partia 2, linia 1.1), 10.11.2026

Recenzent: audytor (sesja r2). Nie pisał rodziny, kart, zestawów ani poprawek r1 (L-047). Stan zamrożony: `4c3ece3` (poprawki W1 i N2 po r1, inny programista), odłączony worktree; baza porównania `c0672ee` (stan r1), drugi odłączony worktree. Skrót rigu v2 (`node scripts/zrodla-runtime.mjs --skroty` w worktree r2): `8ebfcea965c8` (r1: `b163704bf6c6`; zmiana wynika z danych pozy Soleus). `assignAll()` → 36 ćwiczeń rodziny (8 z rysunkiem).

**Werdykt rodziny: wyświetlana.** 0 × KRYTYCZNE/WYSOKIE. W1 i N2 usunięte. Ś1 (Overhead Triceps Stretch) i N1 (Gastrocnemius) → backlog. Zestawy 3/3 i karty 5/5: wyświetlana (karta Soleus oceniona ponownie wobec nowego rysunku, pozostałe przeniesione z r1, bez zmian). Wpisy do przepisania: `partia2-mobility_stand-r2.json`.

## Metoda
- `arkusz-slad.mjs` na 4c3ece3 i na c0672ee: 8 ćwiczeń × side i front = 16 arkuszy na SHA (21 kadrów co 0,05), PNG 2100 px w pełnej rozdzielczości; Soleus — kadr u = 0,5 powiększony w obu widokach.
- Liczby z `frameAt` (u = 0/0,5/1) skryptem recenzenta: kąty kolan i łokci, wysokości pięt i palców, `gap()` kapsuł ciała do ściany, `checkFrame`, przenikanie ciało–ciało.
- Porównanie danych: 8 wpisów `poses/mobility_stand.json` (JSON) c0672ee vs 4c3ece3; `cmp` wszystkich arkuszy.

## (1) W1 — usunięte
Standing Soleus And Achilles Stretch @ 4c3ece3 (poza statyczna, u = 0/0,5/1 identyczne):
- props: podłoga + ściana `x 75, h 250, front` — tak samo jak Wall Calf Stretch.
- dłonie na ścianie: chwyt (72; 132; ±19), przedramię–ściana −0,3 cm po obu stronach (Wall Calf −0,3), łokcie zgięte 56,6° (Wall Calf 63,1°).
- kolana: przednie 25,9°, tylne 13,7° — reguła `obie_kolana_lekko` (10–30°, `kolano_lekko_max_deg` = 30) spełniona; karta „Lekko ugnij tylne kolano” zgodna. Dla porównania Wall Calf: tylne 7,9°, przednie 41,9°.
- pięty i palce obu stóp y = 0 (stopy płasko, „pięta zostaje na podłodze”); kąt podudzie–stopa nogi tylnej 59,9°.
- tułów 22°, głowa x 18,5 (z dala od ściany); `checkFrame` 0 błędów; przenikanie tylko segmentów sąsiednich (staw), ten sam wzór co Wall Calf.
- Test odtwarzający `tests/figures-v2-mobility-stand-poprawki-r1.test.ts`: 4/4 na 4c3ece3; skopiowany na c0672ee — 3/4 czerwone (test faktycznie odtwarza W1). Dopuszczalne wcięcie do 1,5 cm jest szersze niż zmierzone −0,3 cm — bez wpływu.

## (2) Zakres zmiany — tylko Soleus
- JSON pozy: zmieniony tylko wpis „Standing Soleus And Achilles Stretch”; Standing Gastrocnemius Calf Stretch (ze stopniem ACG-013) i 6 pozostałych są identyczne z c0672ee.
- `cmp` arkuszy: 14 par (7 ćwiczeń × 2 widoki, PNG i HTML) bajtowo identyczne; różni się tylko Soleus (side, front).
- N2: komentarz `PRZYBLIZENIA` Gastrocnemius opisuje teraz stopień z danych i rozjazd generatora (`tests/figury-generator-odtwarza.test.ts:26`, 9/9 zielone).

## (3) Ślad
Wszystkie 8 to pozycje statyczne bez ciężaru i przyrządu (ściana i stopień to podpory) → ślad nie jest rysowany (04.11.2026 (4) B). Podpis „odstęp −11,9 cm” w arkuszach to `odstepCiezaru` liczone dla punktu `info.trail` (miednica) wobec tułowia — artefakt narzędzia przy braku ciężaru, taki sam na c0672ee i we wszystkich 8 ćwiczeniach; nie dotyczy aplikacji.

## (4) Testy (K14)
`git diff c0672ee..4c3ece3 -- tests/`: nowy test W1, jedna linia opisu zmiany celowej w `figures-v2-zgodnosc-wsteczna.test.ts`, w `figury-v2-zlote.json` zmieniony tylko odcisk `mobility_stand/Standing Soleus And Achilles Stretch` (svg, raw). Bez poluzowań. Uruchomione `--runInBand`: zgodnosc-wsteczna 626/626, poprawki-r1 4/4, generator-odtwarza 9/9, figury-sens-pokrycie 2/2, planned-acg-mobility-stand 5/5, nakladka-mobility-stand 9/9.

## (5) Skróty (z worktree r2)
v2 `mobility_stand` 8ebfcea965c8; karty: Chin To Chest 87d9ec3873de, Side Neck 5bad44d2b0c3, Overhead Triceps 9b2ae69aca8e, Wall Calf 07a87a7c88c3, Soleus b1ad85a5d670; zestawy: Standing Chest 0869a1be9df2, Gastrocnemius 78c1fe12ffea, Standing Lateral edf062289105 — karty i zestawy identyczne jak w r1.

## (6) Zestawy i karty
- Karta Soleus (K11) wobec nowego rysunku: „Oprzyj dłonie o ścianę i cofnij jedną nogę; obie stopy płasko, palce do przodu” — zgodna (ściana, −0,3 cm, noga tylna cofnięta x −36 wobec x 26, stopy płasko); „Lekko ugnij tylne kolano, pięta zostaje na podłodze” — 13,7°, pięta y = 0; błąd „Odrywanie tylnej pięty” nie pokazany w pozie poprawnej. **wyświetlana**.
- Pozostałe 4 karty i 3 zestawy: werdykty r1 przeniesione (oznaczone w `stan` i `uwagi`), bo skróty i rysunki bez zmian.
- `v1_zastapiona`: puste (żadne z 8 nie ma wpisu v1).

## Backlog (nie blokuje)
- Ś1 ŚREDNIE — Overhead Triceps Stretch: dłoń za szyją zamiast na środku pleców, ręka pomocnicza nie dociska łokcia (powód: bark 192° > limit modelu 171°).
- N1 NISKIE — Standing Gastrocnemius Calf Stretch: na stopniu tylko palce (4,1 cm).

## Sprawdzone bez znalezisk
Ruch i liczby Soleus; niezmienność 7 ćwiczeń; nakładka (bez zmian w danych i arkuszach); testy (K14); mięśnie (brak ról, 04.11.2026 (4) B); liczby i twierdzenia, prywatność (bez nazw źródeł w tekstach, treść kart bez zmian).
