# Role mięśni — fala W1, grupa g1: wyprost pleców (back_extension)

Data: 02.11.2026 · autor: badacz-merytoryczny · tylko zbieranie danych (bez zmian w `data/zrodla/`).

Blok JSON (`nameRules` `lower_back` → `lower_back.spine_ext` dla Superman i Lower Back Curl) — **w `core_floor.md`**.

## Pary

| ćwiczenie [pattern] | mięsień | rola | propozycja funkcji | przypisanie | stan |
|---|---|---|---|---|---|
| Lower Back Curl [other] | lower_back | main | `lower_back.spine_ext` (istniejąca) | nameRules (rodzina `other` mieszana) | gotowe |

Uzasadnienie:
- Ruch: `note` w `docs/research/equipment/catalog.json` — wyprost pleców w leżeniu przodem, unosi się tylko klatka („Prone back extension lifting only the chest”). Rola: `lower_back` 1 (`MUSCLE_LOAD`), partia „plecy” główna.
- Funkcja `lower_back.spine_ext` ma już dwa źródła: S4 (OpenStax 11.3: „it is the primary extensor of the vertebral column”) i S10 (TeachMeAnatomy: „Acts bilaterally to extend the vertebral column and head.”).
- Aktywność w wyproście pleców: S26 (przegląd systematyczny, tab. 3, Park i in. 2015): „Back extension elicited the greatest ES activation.”
- Górna część pleców i pośladki mają tu 0,25 — mały udział, bez opisu (zasada `MUSCLE_MIN_LOAD`).

## Otwarte

- Brak dla tej pary. Uwaga: przy przenoszeniu warto sprawdzić, czy inne ćwiczenia wyprostu pleców w rodzinie `other` (poza zakresem tej fali) też nie potrzebują wpisu na tej samej liście.

## Stan

- Zrobione: 1 para gotowa.
- Zostało: przeniesienie do danych (wspólna lista z Superman — `core_floor.md`).
- Pułapki: brak.
