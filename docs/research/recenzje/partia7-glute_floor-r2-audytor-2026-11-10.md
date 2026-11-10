# Recenzja niezależna r2 — rodzina `glute_floor` (partia 7, linia 1.1), 10.11.2026

Recenzent: audytor (subagent, partia 7, sesja D). Poprawki r1: programista inny niż autor. Stan zamrożony: `figury/partia-7-glute_floor` @ 79a59d21 (worktree odłączony). Zakres r2: różnica 843bbe38..79a59d21 (W1, W2, N3, złote odciski, nowe testy).

**Werdykt rodziny: wyswietlana** — W1 i W2 z r1 rozwiązane, nowych znalezisk KRYTYCZNYCH ani WYSOKICH brak. Ś1, N1, N2, N4, N5 z r1 zostają w backlogu (nie blokują), N3 rozwiązane.

## Różnica r1 → r2 (`cmp` arkuszy własnych)
Arkusze `arkusz-slad.mjs` (14) i `arkusz-nakladka.mjs --family glute_floor` (24) wygenerowałem na 79a59d21 i porównałem `cmp` (HTML i PNG) z arkuszami r1 (843bbe38).
- **Bajtowo równe:** Donkey Kick, Fire Hydrant, Clamshell, Hip Extension with Bands, Machine Glute Kickback — wszystkie widoki, z pozami błędu; Prone Flutter Kicks — poza poprawna, side i front.
- **Różne:** Cable Kickback — wszystkie arkusze (dłonie, kolumna); Prone Flutter Kicks — tylko poza błędu `data:0`, side i front.
- Dane póz (`git diff`) zmieniły się tylko w Cable Kickback (`wyciag.x` 86,3 → 85,3, chwyt z ±14 → ±5) i w Prone Flutter Kicks (`bledy[0]`: dodane `pochylenieTulowia` 0 → −15 oraz `dotyczy` + hip, shoulder). Generator `agent-pozy/glute_floor.mjs` zmieniony zgodnie z tym; `figury-generator-odtwarza` zielony.

## W1 — Cable Kickback: rozwiązane
- Chwyt `[76,3; 123,6; ±5]`, kolumna `x = 85,3`, szerokość 10 → przednia ściana `x 80,3`, krawędzie `z ±5`. `gap(farm, tower)` = **+0,7 cm** w każdym z 21 kadrów (r1: 7,0). Przenikania nie ma, więc tolerancja walidatora 0,3 cm nie ma tu zastosowania.
- Dłonie się nie stykają: `farmR>farmL` > 3 cm. Łokcie są szeroko (z 23,5), a przedramiona zbiegają do kolumny.
- Arkusz z boku: dłonie oparte o przednią ścianę kolumny. Z przodu dłonie są na środku, przed klatką; kolumna leży za figurą, bo taki jest układ warstw rysunku (`LAYER.backEquip`), jak w innych rodzinach z wyciągiem.
- Karta `ck.setup` („trzymając się jej”) jest teraz zgodna z rysunkiem. Ruch nogi, ślad i mankiet bez zmian.

## W2 — Prone Flutter Kicks, poza błędu `hext.mis.arch`: rozwiązane
- Liczby (u = 1): miednica bez zmian (−66; 53,2), barki 53,2 → **65,6 cm** (klatka uniesiona o 12,4 cm), `spineMid` 53,6, dolna krawędź tułowia ok. 43,1 przy blacie 43 → bez przenikania (r1: ok. 6 cm w blat). Przy u = 0,5: 42,9 (≥ 42). Kolidery: tułów i miednica 0,7 cm nad ławką, uda 0,5 cm.
- Dłonie zostają na ławce (chwyt `[32; 46; ±19]`, błąd IK 0), łokcie się przestawiają. Biodra względem tułowia przechodzą w wyprost (u = 1: −11° / −29°).
- Czytelność: w powiększeniu (u = 1, poprawnie i błąd) widać wyraźną wklęsłość lędźwi między miednicą na ławce a uniesioną klatką. Błąd czyta się jako „łuk w plecach”, zgodnie ze zdaniem błędu zestawu hipExt („Plecy wyginają się w łuk, gdy noga idzie w górę”). Ruch nóg w pozie błędu jest taki sam jak w pozie poprawnej.

## N3 — opisy wyjątków toru: rozwiązane
`tests/tor-wyjatki.json`: „ok. 44°” zamiast „ok. 20°–30°” (Cable, Machine), zgodnie z pomiarem r1 (Δθ ≈ 44°, strzałka 6,0–6,1 cm).

## Złote odciski (`tests/fixtures/figury-v2-zlote.json`)
- Zmieniło się 5 wpisów (svg + raw): Donkey Kick, Cable Kickback, Hip Extension with Bands, Machine Glute Kickback, Prone Flutter Kicks. Fire Hydrant i Clamshell są bez zmian.
- Teza programisty się potwierdza. Na b66ecfa2 wszystkie 7 ćwiczeń miało `bledy: []`, na 843bbe38 pięć dostało pozę błędu, a odcisków nie przeliczono. Test zgodności musiał więc być czerwony już na 843bbe38.
- 3 pozy bez zmiany ruchu (Donkey Kick, Hip Extension with Bands, Machine Glute Kickback) mają w 843..79a bajtowo równe dane i arkusze (także pozy błędu), czyli zmieniły tylko odcisk. Cable Kickback i Prone Flutter Kicks mają zmiany celowe (W1, W2), opisane w nagłówku `figures-v2-zgodnosc-wsteczna.test.ts`.
- Uwaga procesowa (NISKIE): w r1 `figures-v2-zgodnosc-wsteczna` nie był na liście czerwonych dozwolonych (K1), a autor go nie zgłosił.

## Testy (K14) — `git diff 843bbe38..79a59d21 -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-glute-floor.test.tsx | +2 testy „recenzja r1”: W1 `gap(farm, tower) ≤ 1` w każdym u; W2 `spineMid.y − 10,5 ≥ 43 − 1` dla pozy błędu | zaostrzenie. Oba oblewają dane z 843bbe38 (7,0 cm; 36,7 < 42), czyli odtwarzają wady. NISKIE: brak jawnych przypadków negatywnych w pliku, a W2 ma blat i grubość tułowia wpisane liczbą zamiast z `benchBack`/`GIRTH.trunkDepth` |
| figures-v2-zgodnosc-wsteczna.test.ts | wpis „zmiana celowa” | poprawny opis (5 póz, FH i Clamshell bez zmian) |
| tor-wyjatki.json | opis kąta | N3 |

Uruchomione pojedynczo, `--runInBand`: `figures-v2-glute-floor`, `figures-v2-zgodnosc-wsteczna`, `figures-v2-tor`, `figury-generator-odtwarza` — 861/861 zielone.

## Znaleziska r2
| ID | Klasa | Pewność | Opis | Realność |
|---|---|---|---|---|
| N6 | NISKIE | 85% | Testy W1/W2 bez jawnych negatywów (K5); W2 ma stałe 43 i 10,5 zamiast danych sprzętu i `GIRTH` | teoretyczny |
| N7 | NISKIE | 90% | Proces: czerwony test złotych odcisków na 843bbe38 spoza listy K1 | teoretyczny |

Otwarte z r1 (backlog, bez zmian): Ś1 (Machine bez ramy), N1 (przedramię w poręczy Machine, −2,5 cm), N2 (kolano podporowe 1,4 cm), N4 (`miednica_bez_skretu` „ustalone” na wniosku z ACE #38), N5 (faza Clamshell „Rozsuwanie”).

## Skróty (`node scripts/zrodla-runtime.mjs --skroty` w worktree 79a59d21)
v2 glute_floor `cfdc21dbffc8`; karty: Donkey Kick `90713799544e`, Fire Hydrant `9941c4ec90d1`, Clamshell `eeb474aeef3c`, Cable Kickback `00c3363b505c`, Hip Extension with Bands `8c83adfcf23f`; zestawy: Machine Glute Kickback `5541a16a3e76`, Prone Flutter Kicks `5541a16a3e76`. `assignAll()`: 7. `v1_zastapiona`: [] (brak wpisów v1).
