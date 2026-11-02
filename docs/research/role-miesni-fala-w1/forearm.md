# Role mięśni — rodzina `forearm` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: luki w rodzinie `forearm` (wzorzec `isolation`, region `forearms`, udział 1): Dumbbell Lying Pronation, Dumbbell Lying Supination, Wrist Roller, Plate Pinch, Reverse Plate Curls.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1.

Reguła ogólna: wzorzec `isolation` dla `forearms` nie ma reguły rodzinnej (`withoutRole.kombinacje`: zginanie / prostowanie / nawracanie / chwyt), więc tylko `nameRules` z jawną listą — jak dla zginania i prostowania nadgarstka (`forearms.wrist_flex`, `forearms.wrist_ext`). Precedens: tam ruch wynika z nazwy ćwiczenia, a funkcję mięśnia potwierdzają 2 źródła anatomiczne. Tę samą zasadę stosuję tu: nazwa jednoznacznie nazywa ruch w stawie → wystarczą 2 przeczytane źródła anatomiczne funkcji. Gdy nazwa nie mówi, który ruch (Wrist Roller, Plate Pinch), potrzeba źródła opisu ćwiczenia — bez niego bez opisu.

## Wyniki

| Ćwiczenie | Region (udział) | Wynik | Uzasadnienie |
|---|---|---|---|
| Dumbbell Lying Pronation | forearms (1) | gotowe — nowa funkcja `forearms.pronate` | Nazwa: nawracanie. S1 (Muscles That Move the Forearm: mięśnie nawracające to nawrotny obły i nawrotny czworoboczny) + S9 (Pronator Teres — Actions: „Pronation of the forearm.”; Pronator Quadratus — „Pronates the forearm.”). Dwa źródła. |
| Dumbbell Lying Supination | forearms (1) | gotowe — nowa funkcja `forearms.supinate` | Nazwa: odwracanie. S28 (Supinator — Actions: „Supinates the forearm.”; także Brachioradialis: udział w odwracaniu) + nowe SN-F2 (Kenhub, mięsień odwracacz, Function: obraca kość promieniową na zewnątrz w stawie promieniowo-łokciowym bliższym — mechanizm odwracania). Uwaga: S1 nie liczę — tabela przy ryc. 11.26 opisuje odwracacz jako obracający dłoń „palm-down” (sprzeczne z tekstem głównym, prawdopodobnie błąd w podręczniku). Biceps też odwraca przedramię, ale to inny region (`biceps`), nie dotyczy tego zdania. |
| Reverse Plate Curls | forearms (1) | gotowe — nowa funkcja `forearms.elbow_flex` | Nazwa: uginanie ramion (zgięcie łokcia) chwytem nachwytem. Mięsień ramienno-promieniowy (przedramię) zgina łokieć: S28 (Brachioradialis — Actions: „Flexes at the elbow.”), S1 (Muscles That Move the Forearm: ramienno-promieniowy może szybko zginać przedramię), SN-F1 (Kenhub, Function: współdziała z bicepsem i ramiennym przy zginaniu łokcia). Trzy źródła. Zdanie mówi tylko o zgięciu łokcia razem z bicepsem; nie twierdzi, że chwyt nachwytem „bardziej angażuje” przedramię (tego nie sprawdzałem). |
| Wrist Roller | forearms (1) | otwarte (bez opisu) | Z nazwy nie wynika ruch. Wyszukane opisy ćwiczenia są niezgodne co do tego, który kierunek zwijania to zginanie, a który prostowanie nadgarstka; wśród wyników były strony aplikacji i sklepy (nie są źródłem) oraz encyklopedia (poza hierarchią). Nie przeczytałem 2 opisów z kwalifikujących się źródeł. Kandydat na zdanie wspólne („Na zmianę zgina i prostuje nadgarstek”) — dopiero po 2 przeczytanych opisach ćwiczenia. |
| Plate Pinch | forearms (1) | otwarte (bez opisu) | `forearms.grip` („Zaciska dłoń na uchwycie”, źródła o zaciśnięciu pięści) nie opisuje chwytu szczypcowego płaskich talerzy. Funkcje zginaczy palców i kciuka są w S1/S9, ale to, jak pracują przy ściskaniu talerzy (palce proste, kciuk przeciwstawiony — także mięśnie samej dłoni, nie przedramienia), wymaga źródła opisu ćwiczenia; nie znalazłem przeczytanego. |

## Propozycje do `data/zrodla/role-miesni.json`

### `functions` (nowe)

```json
"forearms.pronate": {
 "region": "forearms", "staw": "promieniowo-łokciowy", "ruch": "nawracanie (pronacja)",
 "pl": { "main": "Obraca przedramię dłonią w dół", "aux": "Pomaga obracać przedramię dłonią w dół" },
 "en": { "main": "Turns your forearm palm-down", "aux": "Helps turn your forearm palm-down" },
 "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["S1", "S9"],
 "uwaga": "Tylko jawna lista nameRules (nawracanie z nazwy)."
},
"forearms.supinate": {
 "region": "forearms", "staw": "promieniowo-łokciowy", "ruch": "odwracanie (supinacja)",
 "pl": { "main": "Obraca przedramię dłonią w górę", "aux": "Pomaga obracać przedramię dłonią w górę" },
 "en": { "main": "Turns your forearm palm-up", "aux": "Helps turn your forearm palm-up" },
 "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["S28", "SN-F2"],
 "uwaga": "Tylko jawna lista nameRules (odwracanie z nazwy). S1 pominięte: tabela przy ryc. 11.26 sprzeczna z tekstem."
},
"forearms.elbow_flex": {
 "region": "forearms", "staw": "łokciowy", "ruch": "zgięcie (mięsień ramienno-promieniowy)",
 "pl": { "main": "Zgina łokieć razem z bicepsem", "aux": "Pomaga zginać łokieć" },
 "en": { "main": "Bends your elbow together with your biceps", "aux": "Helps bend your elbow" },
 "pewnosc": "ustalone (3 niezależne)", "status": "ustalone", "zrodla": ["S1", "S28", "SN-F1"],
 "uwaga": "Tylko jawna lista nameRules (uginanie nachwytem z nazwy)."
}
```

Uwaga do tekstu: „dłonią w dół / w górę” zakłada przedramię poziomo (leżenie, łokieć oparty) — tak jest w obu ćwiczeniach z listy. Przy rozszerzaniu listy o ćwiczenia w innym ułożeniu sprawdzić brzmienie (do przeglądu tłumacza / recenzenta lokalizacji).

### `nameRules.reguly` (nowe wpisy)

```json
{ "muscle": "forearms", "roles": ["main", "aux"], "function": "forearms.pronate", "exercises": ["Dumbbell Lying Pronation"] },
{ "muscle": "forearms", "roles": ["main", "aux"], "function": "forearms.supinate", "exercises": ["Dumbbell Lying Supination"] },
{ "muscle": "forearms", "roles": ["main", "aux"], "function": "forearms.elbow_flex", "exercises": ["Reverse Plate Curls"] }
```

Koordynator: przed dopisaniem sprawdzić w katalogu inne ćwiczenia z nazwą jednoznacznie wskazującą nawracanie/odwracanie albo uginanie nachwytem, gdzie `forearms` ≥ 0,5 jest bez opisu (np. warianty „Reverse Curl”) — dopisać je do tych samych list tylko po sprawdzeniu nazwy (nie zgadywać).

## Nowe źródła

| id (roboczy) | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| SN-F1 | Kenhub | Vasković J. Brachioradialis muscle (rec. 03.11.2023), sekcja Function | https://www.kenhub.com/en/library/anatomy/brachioradialis-muscle | 4 | 02.11.2026 |
| SN-F2 | Kenhub | Vasković J. Supinator muscle (rec. 03.11.2023), sekcja Function | https://www.kenhub.com/en/library/anatomy/supinator-muscle | 4 | 02.11.2026 |

Istniejące, ponownie przeczytane 02.11.2026: S1 (OpenStax 11.5 — Muscles That Move the Forearm, tabela przy ryc. 11.26; ryc. 11.27), S9 (TeachMeAnatomy, anterior forearm, akt. 15.12.2025 — Pronator Teres/Quadratus, Flexor Pollicis Longus), S28 (TeachMeAnatomy, posterior forearm, akt. 12.12.2025 — Brachioradialis, Supinator). Do `S9.miejsce` dopisać „Pronator Teres, Pronator Quadratus — Actions”; do `S28.miejsce` — „Brachioradialis, Supinator — Actions”; do `S1.miejsce` — „tabela przy ryc. 11.26 (pronatory, ramienno-promieniowy)”.

## Otwarte

- [OTWARTE] Wrist Roller — 2 przeczytane opisy ćwiczenia z kwalifikujących się źródeł (organizacje szkolące trenerów, producent sprzętu, uczelnia), zgodne co do ruchu nadgarstka.
- [OTWARTE] Plate Pinch — źródło opisu pracy mięśni przedramienia przy chwycie szczypcowym; do tego czasu bez opisu.
- [OTWARTE] Błąd w S1 (tabela odwracacza przy ryc. 11.26) — nie używać S1 jako źródła odwracania.
