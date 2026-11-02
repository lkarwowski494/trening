# Role mięśni — rodzina core_hang, fala W2, 02.11.2026

Tylko zbieranie danych. Podstawa: `role-miesni-fala-w1/core_hang.md` (3 pary skośnych gotowe przez wspólną regułę z `core_floor.md`; L-Sit otwarte)
i `muscleRoleRows` (`lib/muscleRoles.ts:55–62`: wiersze = regiony z udziałem ≥ `MUSCLE_MIN_LOAD`, 0,25 — mały udział bez opisu).

## 1. Pary (udziały: `lib/catalog.generated.ts:831–832, 946–947`)

| wiersz (ćwiczenie, mięsień) | proponowana funkcja / reguła | źródła (miejsce, szczebel) | status |
|---|---|---|---|
| Hanging Leg Raise / Hanging Knee Raise / Toes to Bar, abs (1) | `abs.trunk_flex` — istniejąca reguła core_flexion+abs+main | istniejące | bez zmian (ma opis) |
| Hanging Leg Raise / Hanging Knee Raise / Toes to Bar, obliques (0,5) | `obliques.trunk_flex` — reguła core_flexion+obliques+aux z W1 `core_floor.md` | S18 (Kenhub, 4), S29-g1 (Elsevier, 4) — z W1 | dwa_zrodla (W1; jeden wpis reguły wspólny z core_floor — nie dublować) |
| **Hanging Leg Raise, forearms (0,5)** | `forearms.grip` przez `nameRules` (nowe w W2) | S1 OpenStax 11.5 („bends the fingers to make a fist”), szczebel 3; S9 — istniejące źródła funkcji | dwa_zrodla |
| **Hanging Knee Raise, forearms (0,5)** | jw. | jw. | dwa_zrodla |
| L-Sit, abs (1) | zostaje w `exceptions.noRole` (wpis już jest: „utrzymanie pozycji, nie zgięcie tułowia”) | — | bez roli (wyjątek zostaje) |
| Toes to Bar, forearms (0,25); HLR/HKR, lats (0,25); L-Sit, quads/triceps (0,25) | — | — | mały udział, bez wiersza |

Nowe w W2: dwie pary przedramion (HLR, HKR) — W1 ich nie ujęło. Dziś bez opisu, bo `forearms.grip` ma reguły tylko dla `v_pull`, `hinge`, `carry`
(`data/zrodla/role-miesni.json:745–754, 880–889, 1078–1088`), a nie dla `core_flexion`. Ćwiczenie odbywa się w zwisie na drążku (Catalyst #45: „Hang from a pull-up bar
or stall bars.”; `wskazowki-fala-w2/core_hang.md`), więc praca przedramion to ten sam chwyt drążka co w podciąganiu (`v_pull` → `forearms.grip`). To nie analogia
twierdzenia: funkcja (zginacze palców zaciskają dłoń) jest anatomiczna i już potwierdzona dwoma źródłami; reguła tylko wskazuje, że ćwiczenie wymaga chwytu.
Reguła po nazwie zamiast reguły rodziny, bo `core_flexion` obejmuje też ćwiczenia bez chwytu (np. brzuszki na podłodze).

## 2. Blok do wdrożenia (`data/zrodla/role-miesni.json`)

### nameRules.reguly (dopisać)

```json
[
  {"muscle": "forearms", "roles": ["aux"], "function": "forearms.grip",
   "exercises": ["Hanging Leg Raise", "Hanging Knee Raise"],
   "uwaga": "zwis na drążku/uchwytach — chwyt jak w podciąganiu (v_pull); Toes to Bar ma przedramiona 0,25 (bez wiersza)"}
]
```

Zdanie w aplikacji (isolation-free: nameRule → wariant bez fazy): „Pomaga zaciskać dłoń na uchwycie.” / „Helps keep your hand closed around the grip.”
Pole `uwaga` w regule — tylko jeśli format `nameRules` je dopuszcza (istniejące reguły mają `pominiete`, nie `uwaga`); inaczej pominąć.

### rules (z W1 core_floor — przypomnienie, jeden wpis)

```json
{"pattern": "core_flexion", "muscle": "obliques", "roles": ["aux"], "function": "obliques.trunk_flex", "phase": false}
```

### exceptions.noRole

Bez zmian — L-Sit/abs już jest (`data/zrodla/role-miesni.json:1100–1105`).

## 3. Uzasadnienie L-Sit (wyjątek zostaje)

L-Sit to utrzymanie pozycji (`metric: time`); tułów się nie zgina. CrossFit (G. Glassman, 05.2003, `crossfit.com/essentials/the-l-sit`) opisuje rolę brzucha
jako przeciwdziałanie momentowi w biodrze, by utrzymać nogi i nie dopuścić do przeprostu kręgosłupa — to stabilizacja, nie zgięcie; przeczytane źródło
szczebla 4 trenerskie, nie anatomiczne, i jedno → bez nowej funkcji („utrzymuje miednicę” byłoby analogią z ćwiczeń przeciw wyprostowi, W1).

## 4. Źródła

| id | adres | szczebel | miejsce |
|---|---|---|---|
| S1 (istniejące) | https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs | 3 | Muscles That Move the Wrist, Hand, and Fingers — cytat w danych |
| S9 (istniejące) | wg `data/zrodla/role-miesni.json` | wg danych | wg danych |
| catalyst-45 | https://catalystathletics.com/exercise/45/Hanging-Leg-Raise/ (czytane 02.11.2026) | 4 | opis ćwiczenia, zdanie 2 (zwis na drążku) — tylko uzasadnienie przypisania |

## 5. Otwarte

1. Hanging Knee Raise z `dip.bars` (krzesło kapitańskie: przedramiona na podpórkach, dłonie na uchwytach) — chwyt nadal jest, ale słabszy; udział 0,5 pochodzi z katalogu — nie zmieniam.
2. Pytanie z W1: czy wznosy nóg w zwisie to zgięcie tułowia, czy głównie zgięcie w biodrze (reguła `core_flexion` dla prostego brzucha) — bez zmian, sygnał do przeglądu reguły.
