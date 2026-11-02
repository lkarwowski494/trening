# Role mięśni — rodzina figur `mobility_floor` (fala W1, 02.11.2026)

Badacz merytoryczny. Dane wejściowe: `data/zrodla/role-miesni.json` (assembly, exceptions, withoutRole), `lib/muscleRoles.ts` (`matchRole`),
`lib/catalog.generated.ts`, `docs/research/equipment/catalog.json` (wpis „Downward Facing Balance”), `docs/research/25-biblioteka/L6.json`.
Nic w kodzie ani w `data/zrodla/*.json` nie zostało zmienione.

## Czym jest Downward Facing Balance

- Wpis katalogu (`docs/research/equipment/catalog.json`, „Downward Facing Balance”): `pattern` `other`, `metric` `time`, `loadSource` `none`,
  sprzęt: piłka gimnastyczna; opis: „Prone on a stability ball, hands on the floor, legs lifted and held straight.”
- `docs/research/25-biblioteka/L6.json` (ten sam wpis): „Utrzymanie nóg w górze w leżeniu przodem na piłce — ćwiczenie równowagi/izometria”;
  pewność przypisania mięśni: **„brak źródła — uproszczenie”** (L6-S17), zakres NISZOWE.
- To pozycja utrzymywana (izometria na czas), nie ruch w stawie.

## Tabela ćwiczeń

| Ćwiczenie | Mięsień (udział) | Propozycja | Stan |
|---|---|---|---|
| Downward Facing Balance | glutes (1 → main) | bez roli (noRole, powód niżej) | gotowe — bez opisu |
| Downward Facing Balance | hamstrings (0,5 → aux) | bez roli | gotowe — bez opisu |
| Downward Facing Balance | lower_back (0,5 → aux) | bez roli | gotowe — bez opisu |
| pozostałe `mobility_floor`, `mobility_stand`, `foam_roll` | tylko udziały 0,25 (niepodświetlane) | nie dotyczy | nie dotyczy |

## Wniosek

- **Bez roli — z trzech niezależnych powodów:**
  1. `pattern` `other` jest na liście `withoutRole.wzorce` („rodzina mieszana … z samej rodziny nie wynika ruch w stawie”) — żadna reguła
     z `rules` go nie obejmie; `matchRole` zwraca dziś `null` i tak zostaje.
  2. Ćwiczenie izometryczne (`metric: time`) — ta sama zasada co Wall Sit i L-Sit w `exceptions.noRole` („utrzymanie pozycji”): zdanie o ruchu
     („Prostuje biodro”) nie opisuje utrzymania nóg w górze.
  3. Samo przypisanie mięśni (glutes 1, hamstrings 0,5, lower_back 0,5) ma w katalogu pewność „brak źródła — uproszczenie” — opis roli nie może
     mieć mocniejszej podstawy niż udział, który opisuje.
- Nie szukałem źródła dla funkcji „utrzymuje biodro w wyproście” — nawet przy źródle zdanie nie przeszłoby powodu 3; najpierw trzeba by potwierdzić
  udział mięśni (zadanie dla rewizji katalogu L6, nie dla ról).
- Propozycja (opcjonalna, tylko dokumentacyjna — dziś wynik ten sam): jawny wpis w `exceptions.noRole`, żeby przyszła reguła dla `other` go nie złapała:

```json
{
  "exercise": "Downward Facing Balance",
  "muscles": ["glutes", "hamstrings", "lower_back"],
  "powod": "utrzymanie nóg w górze w leżeniu przodem na piłce (metric: time) — izometria, nie ruch w stawie; udział mięśni w katalogu: „brak źródła — uproszczenie” (L6)"
}
```

Bez nowych funkcji i bez nowych źródeł.

## Pozostałe ćwiczenia rodzin mobility_floor, mobility_stand, foam_roll

Według zestawienia koordynatora (wynik `muscleRoleRows` na 02.11.2026) pozostałe ćwiczenia rodzin `mobility_floor`, `mobility_stand` i `foam_roll`
nie mają podświetlanych mięśni — `muscleRoleRows` zwraca `[]` — więc ról nie dotyczy. Sprawdzone wyrywkowo w `MUSCLE_LOAD`
(`lib/catalog.generated.ts`): Cat-Cow, Child's Pose, Butterfly Stretch, Supine Spinal Twist mają wyłącznie udziały 0,25 (poniżej progu podświetlenia
`MUSCLE_MIN_LOAD`, `meta.zasadaRol`: „0,25 = mały udział, nie podświetlany → bez opisu”).

## Otwarte

- [OTWARTE] Udział mięśni w Downward Facing Balance — w katalogu „brak źródła — uproszczenie” (L6-S17). Poza zakresem ról; do rewizji katalogu.

## Stan

- **Zrobione (02.11.2026):** Downward Facing Balance — 3 pary rozstrzygnięte jako „bez opisu” z powodem; propozycja wpisu `exceptions.noRole`.
  Wyrywkowe potwierdzenie, że rozciąganie ma tylko udziały 0,25.
- **Zostało:** decyzja programisty/koordynatora, czy dopisać jawny wpis `noRole` (nie zmienia wyniku).
- **Następny krok:** brak po stronie badań.
- **Pułapki:** nie dodawać reguły dla `pattern` `other` — rodzina mieszana; pełnej listy `mobility_stand` i `foam_roll` nie sprawdzałem pojedynczo
  (oparte na wyniku `muscleRoleRows` od koordynatora + próbce).
