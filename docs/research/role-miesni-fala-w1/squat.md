# Role mięśni — rodzina `squat` (fala W1)

- Data: 02.11.2026
- Autor: badacz-merytoryczny
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Podstawa: `data/zrodla/role-miesni.json` (rules dla `pattern: squat`, functions, exceptions.noRole, withoutRole). W tej sesji nie
przeczytano nowych źródeł anatomicznych/biomechanicznych (limit kontekstu — wskazówki techniki miały pierwszeństwo), więc żadna luka
nie dostaje reguły. Poniżej — dlaczego każda luka istnieje i co ją rozstrzygnie.

## Reguły `squat` (stan)

| muscle | roles | function | status funkcji | wyświetlane? |
|---|---|---|---|---|
| quads | main, aux | quads.knee_ext | (wyświetlana) | tak (wyjątek: Wall Sit) |
| glutes | main, aux | glutes.hip_ext | (wyświetlana) | tak |
| adductors | main, aux | adductors.hip_ext | `uproszczenie` | **nie** — decyzja 26.10.2026: tylko `ustalone`/`dwa_zrodla` |
| lower_back | main, aux | lower_back.spine_ext | (wyświetlana) | tak |

Reguła dla adductors NIE jest ograniczona do `main` — obejmuje też `aux`. Luka „adductors aux” (Back Squat, Leg Press) wynika ze
statusu funkcji (`uproszczenie`: wyprost biodra źródła S2/S14 przypisują przywodzicielowi wielkiemu, region `adductors` to cała grupa),
nie z braku reguły. Dotyczy tak samo `main` (np. przysiad sumo) — wszystkie 22 pary z tą funkcją są bez opisu.

## Luki

| Ćwiczenie | Mięsień | Rola | Wynik | Powód / co rozstrzygnie |
|---|---|---|---|---|
| Back Squat | adductors | aux | otwarte | funkcja `adductors.hip_ext` = `uproszczenie` (patrz wyżej). Dodatkowe źródła nie zmienią statusu, bo uproszczeniem jest region (grupa vs przywodziciel wielki). Rozstrzygnie: decyzja produktowa (pokazać uproszczenie z dopiskiem albo zdanie prawdziwe dla całej grupy) i ≥ 2 źródła szczebla 2–3, że grupa przywodzicieli pracuje w fazie wstawania przysiadu (kandydaci do przeczytania: S20 — już w danych; przegląd EMG przysiadu, np. Clark i in. 2012, J Strength Cond Res — nieprzeczytany). |
| Leg Press (pattern squat) | adductors | aux | otwarte | jak wyżej. |
| Front Squat | abs | aux | otwarte | `withoutRole.kombinacje`: „abs … poza regułami (np. w squat) — brak przeczytanego źródła roli w tym typie ruchu”. Jedyna pasująca funkcja (`abs.antilordosis`) ma status `jedno_zrodlo`; `abs.trunk_flex` nie opisuje ruchu (tułów się nie zgina). Rozstrzygnie: ≥ 2 źródła szczebla 2–3 o roli mięśni brzucha w przysiadzie z obciążeniem z przodu (kandydat: S26 — sprawdzić, czy przegląd obejmuje przysiad przedni; nie sprawdzono w tej sesji). |
| Zercher Squat | abs | aux | otwarte | jak Front Squat. |
| Double Kettlebell Front Squat | abs | aux | otwarte | jak Front Squat. |
| One-Arm Overhead Kettlebell Squat | obliques | aux | otwarte | `obliques.rotate_bend` („skręca i pochyla tułów”) nie opisuje ruchu — przy jednostronnym ciężarze tułów nie skręca się ani nie pochyla; rola to raczej utrzymanie tułowia prosto (przeciw pochyleniu w bok) — taka funkcja nie istnieje w danych i nie ma przeczytanego źródła. Powiązane [OTWARTE]: „obliques w core_anti_rot — brak źródła”. Rozstrzygnie: nowa funkcja (np. `obliques.anti_lateral`) z ≥ 2 źródłami szczebla 2–3 (kandydat: S27 — chód z jednostronnym ciężarem, aktywność mięśni tułowia; analogia, nie przysiad). |
| Overhead Squat | front_delt | aux | otwarte | `front_delt.shoulder_flex` („pomaga unosić ramię do przodu”) nie opisuje ruchu — ramię jest nieruchomo nad głową (utrzymanie), faza „gdy wstajesz” nie pasuje. Rozstrzygnie: funkcja utrzymania ramienia nad głową z ≥ 2 źródłami szczebla 2–3 o EMG naramiennego przedniego w przysiadzie nad głową; inaczej zostaje bez opisu (wzór: `exceptions.noRole`). |
| Wall Sit | quads | main | potwierdzone — zostaje | `exceptions.noRole` (izometria, metric `time`; „gdy wstajesz”/„prostuje” nie opisują ruchu) — zgodne z zasadą `exceptions.zasada`. Bez zmian. |

## Propozycje reguł/funkcji/źródeł (JSON)

Brak propozycji z ≥ 2 przeczytanymi źródłami w tej sesji. Proponowane wpisy do `exceptions.noRole` (porządkowo, żeby luka była
świadoma, nie przypadkowa) — do decyzji koordynatora:

```json
{
  "exceptions": {
    "noRole": [
      {"exercise": "Overhead Squat", "muscles": ["front_delt"], "powod": "ramię utrzymywane nad głową bez ruchu — „unosi ramię do przodu” nie opisuje ruchu; [OTWARTE] funkcja utrzymania"},
      {"exercise": "One-Arm Overhead Kettlebell Squat", "muscles": ["obliques"], "powod": "tułów utrzymywany prosto przy jednostronnym ciężarze — „skręca i pochyla” nie opisuje ruchu; [OTWARTE] funkcja przeciw pochyleniu w bok"}
    ]
  }
}
```

## Źródła

Nie dodano nowych. Odwołania do istniejących: S2, S14, S20, S26, S27 (`role-miesni.json` → `sources`).

## Otwarte

- adductors (cała rodzina squat, main i aux) — status `uproszczenie`; decyzja produktowa + źródła grupowe (patrz tabela).
- abs aux w przysiadach z ciężarem z przodu — brak funkcji z 2 źródłami.
- obliques aux przy jednostronnym ciężarze nad głową — brak funkcji i źródeł.
- front_delt aux w Overhead Squat — brak funkcji utrzymania.

## Stan

- Zrobione: analiza reguł i wyjątków dla wszystkich luk z zadania; Wall Sit potwierdzony.
- Zostało: przeczytać S26 (czy obejmuje przysiad przedni), przegląd EMG przysiadu dla przywodzicieli, źródła dla utrzymania ramienia nad głową i przeciw pochyleniu w bok.
- Następny krok: S26 → sekcja wyników o mięśniu prostym brzucha w przysiadach; potem wyszukiwanie przeglądów EMG przysiadu z obciążeniem nad głową.
- Pułapki: web.archive.org niedostępne dla narzędzia; ExRx 403.
