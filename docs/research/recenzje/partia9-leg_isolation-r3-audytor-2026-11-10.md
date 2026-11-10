# Recenzja niezależna rodziny v2 `leg_isolation` — partia 9, runda 3 (audytor, 10.11.2026)

Zakres (wąski): figury/partia-9-leg_isolation @ 3fbadace (po r2 @ 09043585). Zmiana: Seated Band Hamstring Curl — poza (`poses/leg_isolation.json`, tylko to ćwiczenie) z generatora (`agent-pozy/leg_isolation.mjs`, `guma()`), testy figures-v2-data, figures-v2-zgodnosc-wsteczna i wzorzec `figury-v2-zlote.json`. Autor: programista partii 9; recenzent: audytor.

## Werdykt

**Rodzina: wyświetlana** (0 × KRYTYCZNE/WYSOKIE). Regresję ACG-019 w Seated Band, przepuszczoną w r1 i r2, poprawiono.

## Seated Band Hamstring Curl (arkusz arkusz-slad, side, 21 kadrów, pełna rozdzielczość; frameAt co 0,025)

- Miednica stoi (0; 48). Udo nieruchome: biodro 91,9–94,4° (zakres 2,5°, limit 5°), kolano przesuwa się najwyżej o 1,9 cm (x 41,8–42,0; y 49,6–51,5). Było (d4febb6): 25,2° i 18,8 cm.
- Kolano 12,6° → 92,1°: goleń obraca się w stałym kolanie od nogi prawie prostej, uniesionej przed sobą (kostka 42,5 cm nad podłogą), do pięty pod kolanem (kostka 8,6 cm, pięta ≥ 0 cm). Druga noga stoi przy 90°.
- Guma: zaczep z przodu na słupku (x 125, y 40 przy wysokości słupka 60) do kostki, długość 42,8 → 88,6 cm — rozciąga się przy uginaniu. Ślad (kostka) jednym łukiem, bez zawróceń.
- Styki: skrzynia 0 cm, stopy ≥ −0,3 cm.
- Karta własna: bandcurl.setup (przodem do zaczepu, pętla na kostce, noga wyprostowana przed sobą) — zgodne; bandcurl.move (zgięcie kolana, piętą ciągnie gumę w tył, powrót) — zgodne; lcurl.full — kolano 92,1° (N5 z r1 bez zmian, NISKIE); lcurl.mis.partial bez animacji. Ćwiczenie ma kartę własną (`own`), zestawu ogólnego nie ma. Wymaganie „uda i biodra nieruchomo” (ACG-019, reguły wariantu `_uginanie_jednonoz`) spełnione.

## K14 — `git diff 0904358..3fbadac -- tests/`

| Zmiana | Ocena |
|---|---|
| `JERK_TEMPO_RODZINY` + `leg_isolation` | Nie poluzowanie. Zakres: tylko wskazówka `mis.jerk` (błąd tempa, w figury-sens.json `bledy_bez_animacji` z powodem); test negatywny „inna wskazówka albo rodzina” bez zmian. Próba mutacyjna (usunięcie `leg_isolation`): figures-v2-data nadal 23/23, czyli w tym SHA wpis jeszcze niczego nie zwalnia — zadziała dopiero, gdy zestawy rodziny trafią na listę `general`. |
| `figury-v2-zlote.json`: odcisk (svg, raw) tylko Seated Band; opis zmiany celowej w nagłówku zgodnosc-wsteczna | Nie poluzowanie: zmienia się jeden wpis, i tylko dlatego, że zmieniła się poza (inny skrót pozy niż w b66ecfa i d4febb6); pozostałe 623 odciski bez zmian. |

Uruchomione pojedynczo (`--runInBand`): figures-v2-planned-acg-leg-isolation 8/8, figures-v2-data 23/23, figures-v2-zgodnosc-wsteczna 624/624, figures-v2-leg-isolation 38/38, figures-v2-tor 200/200, figury-generator-odtwarza 18/18.

## Dlaczego r1 to przepuściło (do lekcji)

Zmierzyłem w r1 zmianę biodra (66,5 → 91,7°) i uniesienie kolana o 18,5 cm. Oceniłem je jednak tylko wobec tekstu karty własnej, a nie wobec reguł wariantu (`_uginanie_jednonoz`: biodra nieruchome) i ACG-019. Uruchomiłem też tylko testy wybrane po nazwie rodziny, bez wyszukania wszystkich testów czytających `poses/leg_isolation.json`. Dlatego czerwony `figures-v2-planned-acg-leg-isolation` nie trafił do przeglądu.

## Skróty (przeliczone samodzielnie, `zrodla-runtime.mjs --skroty`)

v2 `leg_isolation`: **`19fc316f3a19`** (było `5edb92cc8fa2`). Bez zmian: karty Leg Extension `438254c7031a`, Leg Curl `f9681b034104`, Lying Leg Curl `e5e0bad9da9f`, Seated Band Hamstring Curl `4120ffb04282`, Slider Hamstring Curl `d4048f0a72f5`; zestawy Single-Leg Leg Extension `dd254d049291`, Standing Leg Curl i Standing Cable Leg Curl `0b503ccdff6a`; v1 Lying Leg Curl `0889838b0f76`.

## Stan znalezisk

Ś1 — naprawione (r2). Ś2 — otwarte: architecture-limits czerwony, `poseData.ts` 25 673 B > 24 736 B (wariant A: próg = 25 673). N1–N5 bez zmian (NISKIE, backlog).
