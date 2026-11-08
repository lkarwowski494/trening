# STAN partii A2 (tekst: nogi/biodra) — linia 1.1

## Teraz
- 09.11.2026 ~01:00 PL (sesja B #1, programista): dane A2 — 20 kart, 33 zdania PL/EN, 28 źródeł (fixture `tests/fixtures/cues-a2-nogi.json`, test `tests/zrodla-pelne-cues-a2-nogi.test.ts`, zestaw przekładu `zestaw-przekladu-2026-11-08-a2-wskazowki.json`, wpis docs/18 08.11, lista dla recenzenta `a2-klucze.json`). Zakres z `policz()`: 58 ćw. bez wskazówek w 8 rodzinach + role 5.
- 7 kart wstrzymanych do B2 (animowany błąd póz spoza karty: 6 wykroków lunge.mis.kneeIn, Slider ht.mis.arch). Narzędzia figur: `kartaWlasna` (karta ukryta z pełnych danych).
- Bramka recenzji: wariant A przyjęty (koordynator 08.11.2026; mechanizm 1fb70b67 + 0e9884d7): 19 kart w `karty_nowe`, Calf Raise (linki) w `zestawy_zmienione`; po wpisie „wyswietlana” usunąć pozycje.
- **Otwarte po A2 (decyzje koordynatora 08.11.2026, P1–P4):**
  - P1 — karty W1/W2 dla rodzin ready (squat, hinge; dziś zrecenzowane zestawy ogólne) → osobna partia z recenzją od razu (17): Stiff-Legged Barbell Deadlift, Smith Machine Stiff-Legged Deadlift, Deficit Deadlift, Sumo Deadlift (kettlebell) (hinge-cz1 W2); Clean Deadlift, Axle Deadlift, Cable Deadlift (hinge-cz2 W2); Single Leg RDL (hantel), Single Leg RDL (linki) (W1 przeliczenie); Barbell Hack Squat, Bodyweight Squat, Dumbbell Squat, Overhead Squat, Zercher Squat, Double Kettlebell Front Squat (squat-cz1 W2); Squat with Chains, Squat with Bands (squat-cz2 W2).
  - P2 — błędy W2 dla istniejących kart (zmiana karty = ponowna recenzja) → partia z recenzją: Lunges (hantle), Walking Lunges, Reverse Lunge — `lunge2.mis.lean`; Step Up — `stepup.mis.push`, `stepup.mis.drop` (poza blokiem, `w2-ramiona` lunge.md).
  - P4 — role: London Bridges i Smith Machine Reverse Calf Raise (błędna rodzina), Hip Flexion with Band (propozycja `quads.hip_flex`, jedno źródło) — otwarte; Wall Sit (brak roli potwierdzony) i Crossover Reverse Lunge (mobility) — bez zmian.
  - B2 — 7 kart wstrzymanych (animowany błąd póz spoza karty): Split Squat, Lunges (sztanga), Barbell Walking Lunge, Barbell Step Up, Bulgarian Split Squat (sztanga), Smith Machine Bulgarian Split Squat (`lunge.mis.kneeIn`), Slider Hamstring Curl (`ht.mis.arch`); generator glute_floor: rząd błędu Clamshell/Fire Hydrant z `clam.mis.roll`/`fh.mis.twist` (+ grupa w figury-sens.json).
- Następny krok: verify:lekkie (bramka lekka od 0fd6bc81) → push → tests.yml; potem recenzja niezależna (koordynator).
- Narzędzia: `narzedzia-a2.md` (run_a2.sh od commitu bazy 391af68 — nie od HEAD).
- Pułapki: blok W1 `lunge.md` przed przeliczeniem NIEAKTUALNY; nowe źródła z jawnym `level`; id zdań w tabelach z dopiskiem po backtickach; generator póz przepuszcza tylko błędy karty (model.mjs zbuduj).

## Historia (przeniesione z „Teraz”)
- 08.11.2026 ~21:10 PL (koordynator): gałąź `tekst/a2-nogi` utworzona od `integracja-1-1` (e2df51f5). Wykonawca: sesja B #1 w chmurze (rola programista). Zakres wg planu `plan-1-1-i-1-2-2026-11-08.md` wiersz 1-A2. Wzór: partia A1 (`tekst/a1-pchanie`). Bez przekładu przez API.
- Narzędzia partii A1 (`narzedzia-a1.md`, Python, ścieżki lokalne koordynatora do podmiany): `ext.py`/`tabs.py` — parsowanie bloków JSON i tabel „Źródła” z plików badań; `pick.py`/`cand.py` — wybór kart z listy partii; `import_cards.py` — import kart do `data/zrodla/cues.json` (odrzuca błędy bez 2 organizacji, zapisuje listę kluczy); `post.py` — zestawy wskazówek, pole otwarcia figur, fixture, zestaw przekładu. Kolejność A1: importer → `post.py` → `gen.mjs` → `zrodla-runtime --write` → `claims.mjs --stub` → testy.

## Historia
