# Role mięśni — Downward Facing Balance (rodzina `mobility_floor`, fala W2, 02.11.2026)

Badacz merytoryczny. Sprawdzenie wyniku W1 („bez roli z powodem”) na kodzie i danych gałęzi badań. Nic w kodzie ani w `data/zrodla/*.json` nie zmienione.

## Czy ćwiczenie ma wiersze `muscleRoleRows`

- Udziały: `lib/catalog.generated.ts:1283` — glutes 1, hamstrings 0,5, lower_back 0,5, abs 0,25; pewność przypisania: `lib/catalog.generated.ts:2677`
  — „brak źródła — uproszczenie” (L6-S17).
- Próg wierszy: `lib/figures/v2/muscles.ts:15` — `MUSCLE_MIN_LOAD = 0.5`; `lib/muscleRoles.ts:57` filtruje `w >= MUSCLE_MIN_LOAD`.
- **Wynik: 3 wiersze** (glutes — główny, hamstrings i lower_back — pomocnicze; abs 0,25 odpada), każdy z `role: null`.
- Dlaczego `null`: `matchRole` (`lib/muscleRoles.ts:31–45`) sprawdza najpierw jawną listę z nazwy (`nameRules`, `data/zrodla/role-miesni.json:1488–1538` —
  tylko szrugsy i uginanie/prostowanie nadgarstka; Downward Facing Balance brak), potem reguły rodziny dla `pattern` z katalogu — tu `other`
  (`lib/catalog.generated.ts:568`), który jest na liście `withoutRole.wzorce` (`data/zrodla/role-miesni.json:1116–1123`), więc żadna reguła go nie obejmie.

## Czy da się dać role ze źródeł (wariant A — wpis w `nameRules`)

Mechanicznie tak (wpis `nameRules` z funkcją `glutes.hip_ext` / `hamstrings.hip_ext` / `lower_back.spine_ext`), merytorycznie — **nie teraz**:

1. **Brak źródła samego ćwiczenia.** Szukano 02.11.2026: nazwa dokładna („downward facing balance” stability ball) — jedyne trafienie to strona agregatora ćwiczeń
   (szczebel 5); bliskie ćwiczenia (leżenie przodem na piłce, unoszenie prostych nóg) — tylko Physitrack i VHI/Hattiesburg (szczebel 5 wg pliku szczebli) i strony aplikacji
   (nie źródło). Żadne przeczytane źródło szczebla ≤ 4 nie opisuje ćwiczenia ani pracy mięśni w nim.
2. **Udział mięśni bez podstawy** (`lib/catalog.generated.ts:2677`, „brak źródła — uproszczenie”) — opis roli nie może mieć mocniejszej podstawy niż udział, który opisuje.
3. **Izometria** (`metric: time`, `note`: „legs lifted and held straight”) — „Prostuje biodro” (`data/zrodla/role-miesni.json:55`) opisuje ruch, nie utrzymanie; precedens
   `exceptions.noRole` dla Wall Sit i L-Sit (`data/zrodla/role-miesni.json:1091–1105`). Uwaga: `nameRules` sprawdzane są przed strażnikiem „metric time w rodzinie z fazą”
   (`lib/muscleRoles.ts:35` przed `:41`), więc wpis z nazwy ominąłby tę ochronę — tym bardziej potrzebne źródło na funkcję w utrzymaniu. Jedyna funkcja o brzmieniu
   pasującym do utrzymania to `lower_back.spine_ext` („…i trzyma je prosto”, `data/zrodla/role-miesni.json:231`), ale i ona wymaga źródła pracy mięśni w tym ćwiczeniu.

## Wniosek

| Ćwiczenie | Mięsień (udział) | Propozycja | Stan |
|---|---|---|---|
| Downward Facing Balance | glutes (1, główny) | bez roli | gotowe — bez opisu, powód 1–3 |
| Downward Facing Balance | hamstrings (0,5) | bez roli | gotowe — bez opisu, powód 1–3 |
| Downward Facing Balance | lower_back (0,5) | bez roli | gotowe — bez opisu, powód 1–3 |

Potwierdzam wynik W1. Propozycja W1 (jawny wpis w `exceptions.noRole`, żeby przyszła reguła dla `other` ani wpis z nazwy go nie złapał) pozostaje aktualna — dziś wynik ten sam.

## Otwarte

- [OTWARTE] Udział mięśni i postać ćwiczenia (L6, „brak źródła — uproszczenie”); przypisanie do rodziny `mobility_floor` — ćwiczenie równowagi/izometria na piłce, nie rozciąganie
  (por. `docs/research/wskazowki-fala-w2/mobility_floor-reszta.md`, Otwarte). Do analityka/rewizji katalogu; dopiero po źródle udziału ma sens szukanie źródła roli.
