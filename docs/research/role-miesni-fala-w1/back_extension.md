# Role mięśni — fala W1, grupa g1: wyprost pleców (back_extension)

Data: 02.11.2026 · autor: badacz-merytoryczny · tylko zbieranie danych (bez zmian w `data/zrodla/`).

Blok JSON (`nameRules` `lower_back` → `lower_back.spine_ext` dla Superman i Lower Back Curl) — **w `core_floor.md`**.
Szczeble źródeł 4–5 sprawdzone 02.11.2026 — sekcja „Korekta szczebli 02.11.2026” niżej.

## Pary

| ćwiczenie [pattern] | mięsień | rola | propozycja funkcji | przypisanie | stan |
|---|---|---|---|---|---|
| Lower Back Curl [other] | lower_back | main | `lower_back.spine_ext` (istniejąca) | nameRules (rodzina `other` mieszana) | gotowe (zależne od decyzji o TeachMeAnatomy — zob. korekta) |

Uzasadnienie:
- Ruch: `note` w `docs/research/equipment/catalog.json` — wyprost pleców w leżeniu przodem, unosi się tylko klatka („Prone back extension lifting only the chest”). Rola: `lower_back` 1 (`MUSCLE_LOAD`), partia „plecy” główna.
- Funkcja `lower_back.spine_ext` ma już dwa źródła: S4 (OpenStax 11.3: „it is the primary extensor of the vertebral column”) i S10 (TeachMeAnatomy: „Acts bilaterally to extend the vertebral column and head.”).
- Aktywność w wyproście pleców: S26 (przegląd systematyczny, tab. 3, Park i in. 2015): „Back extension elicited the greatest ES activation.”
- Górna część pleców i pośladki mają tu 0,25 — mały udział, bez opisu (zasada `MUSCLE_MIN_LOAD`).

## Otwarte

- Brak dla tej pary. Uwaga: przy przenoszeniu warto sprawdzić, czy inne ćwiczenia wyprostu pleców w rodzinie `other` (poza zakresem tej fali) też nie potrzebują wpisu na tej samej liście.
- [DO DECYZJI KOORDYNATORA LINII] szczebel TeachMeAnatomy (S10) — zob. korekta.

## Korekta szczebli 02.11.2026

Jedyne źródło szczebla 4 w tym pliku: S10 (TeachMeAnatomy, „The Intrinsic Back Muscles”, Jones O., akt. 06.11.2025 — istniejące w `data/zrodla/role-miesni.json`).
Ocena wg kryteriów koordynatora (na podstawie strony tego samego serwisu otwartej 02.11.2026 — S16): (b) autor i data — tak; (c) reklama własnej płatnej
wersji serwisu, bez afiliacji — raczej spełnione; (a) strona nie opisuje redakcji ani recenzji eksperckiej — **wątpliwe → do decyzji koordynatora linii**.
Nie zmieniam statusu, bo funkcja `lower_back.spine_ext` jest już w danych i pokazywana przy innych ćwiczeniach — decyzja dotyczy całego rejestru, nie tej pary.
Skutek przy uznaniu TeachMeAnatomy za szczebel 5: `lower_back.spine_ext` ma jedno liczone źródło (S4, OpenStax, szczebel 3) → „jedno źródło” dla wszystkich par
z tą funkcją (w tym Lower Back Curl i Superman z tej fali); S26 opisuje aktywność, nie funkcję. S4 (szczebel 3) i S26 (szczebel 2) — bez zmian.
Pary gotowe: **1 przed → 1 po** (warunkowo, jw.).

## Stan

- Zrobione: 1 para gotowa. Korekta szczebli 02.11.2026 — bez zmiany statusu; zależność od decyzji o TeachMeAnatomy zapisana.
- Zostało: przeniesienie do danych (wspólna lista z Superman — `core_floor.md`); decyzja koordynatora o TeachMeAnatomy.
- Pułapki: brak poza zależnością od S10.


## Korekta szczebli — uzupełnienie 2 (02.11.2026)

Dopisał koordynator grupy G1 na podstawie ustaleń badaczy (sekcja 6 w `wskazowki-fala-w1/core_floor-2.md`).
Bez zmian stanu. Uzupełnienie 2 dotyczy organizacji zdrowia, centrów sportu i serwisów trenerskich; źródła ról to podręczniki anatomii i serwisy anatomiczne (S-id), których nie obejmuje. Sussex Sport (S34-g1, uczelniane centrum sportu) — szczebel 5 bez względu na autora, bo i tak jest jedynym źródłem `obliques.antirotation`. TeachMeAnatomy — nadal do decyzji koordynatora linii (uzupełnienie 2 go nie obejmuje).
