# Role mięśni — fala W1, grupa g1: core w zwisie (core_hang)

Data: 02.11.2026 · autor: badacz-merytoryczny · tylko zbieranie danych (bez zmian w `data/zrodla/`).

Funkcja `obliques.trunk_flex`, źródła i blok JSON — **w `core_floor.md`** (reguła `core_flexion` + `obliques` + `aux`).
Szczeble źródeł 4–5 sprawdzone 02.11.2026 — sekcja „Korekta szczebli 02.11.2026” niżej i w `core_floor.md`.

## Pary

| ćwiczenie [pattern] | mięsień | rola | propozycja funkcji | przypisanie | stan |
|---|---|---|---|---|---|
| Hanging Leg Raise [core_flexion] | obliques | aux | `obliques.trunk_flex` | reguła core_flexion+obliques+aux | gotowe |
| Hanging Knee Raise [core_flexion] | obliques | aux | `obliques.trunk_flex` | jw. | gotowe |
| Toes to Bar [core_flexion] | obliques | aux | `obliques.trunk_flex` | jw. | gotowe |
| L-Sit [core_flexion] | abs | main | — | zostaje w `exceptions.noRole` | otwarte |

Uzasadnienie: dane już opisują prosty brzucha w tych trzech ćwiczeniach jako „Zgina tułów…” (reguła `core_flexion` + `abs` + `main`); skośne przy obustronnym skurczu też zginają tułów (S18: „to flex the trunk anteriorly”; S29-g1: „during bilateral contraction, it flexes the trunk;”), więc zdanie pomocnicze „Pomaga zginać tułów” jest z tym spójne. Role (skośne 0,5) — `MUSCLE_LOAD` w `lib/catalog.generated.ts`.

## Blok JSON

Brak dodatkowych wpisów — reguła w bloku `core_floor.md`.

## Otwarte

- [OTWARTE] L-Sit, prosty brzucha (utrzymanie pozycji): żadne przeczytane źródło nie opisuje roli prostego w utrzymaniu nóg w poziomie (główną pracę wykonują zginacze biodra, których katalog nie ma jako regionu). Możliwa funkcja „utrzymanie miednicy” (S17 „stabilizes and controls tilt of the pelvis”) byłaby przeniesieniem z ćwiczeń przeciw wyprostowi — analogia, bez tekstu. Wyjątek zostaje.
- [OTWARTE] Czy podnoszenie nóg w zwisie to zgięcie tułowia, czy głównie zgięcie w biodrze — dotyczy już istniejącej reguły dla prostego (nie zmieniam; sygnał dla przeglądu reguły `core_flexion`).

## Korekta szczebli 02.11.2026

`obliques.trunk_flex` po korekcie stoi na dwóch liczonych źródłach szczebla 4: S18 (Kenhub) i S29-g1 (Elsevier; oceniony — 4, treść firmowana przez wydawcę na podstawie podręcznika).
S30-g1 (Kenhub) nie jest niezależne od S18, a S31-g1 (learnmuscles) po korekcie ma szczebel 5. Gdyby koordynator obniżył Elsevier, te 3 pary przeszłyby do „jedno źródło”
(szczegóły: `core_floor.md`). Pary gotowe: **3 przed → 3 po**.

## Stan

- Zrobione: 3 pary gotowe (nowa reguła wspólna), L-Sit otwarte. Korekta szczebli 02.11.2026 — bez zmian statusów.
- Zostało: przeniesienie do danych; ewentualny przegląd, czy wznosy nóg w zwisie należą do `core_flexion`.
- Pułapki: `obliques.trunk_flex` zależy od szczebla Elsevier (S29-g1).
