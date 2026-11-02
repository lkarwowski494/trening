# Role mięśni — fala W2, rodzina `triceps` (Body-Up)

Data: 2026-11-02. Autor: badacz-merytoryczny (G7). Zakres: tylko dane.

## Wniosek

Body-Up (katalog `docs/research/equipment/catalog.json`, wpis „Body-Up” ok. l. 17377: „From a forearm plank press up onto the hands”) to przejście
z deski na przedramionach do podporu na dłoniach — brzuch trzyma tułów jak w desce. Pasuje istniejąca funkcja `abs.antilordosis`
(„Pomaga utrzymać lędźwie bez wygięcia”), ale ona ma status `jedno_zrodlo` (wprost tylko S17) i nie jest wyświetlana. Dodatkowo opis ruchu
pochodzi tylko z katalogu (free-exercise-db, szczebel 5) → przypisanie to **uproszczenie (analogia do deski)** i zostaje bez wyświetlania.

## Tabela

| Ćwiczenie | Region (obc.) | Propozycja | Pewność | Źródła |
|---|---|---|---|---|
| Body-Up | abs (0,5) | `abs.antilordosis`, aux | jedno źródło + uproszczenie (analogia do deski; opis ćwiczenia szczebel 5) | S17, S26 |

### Blok do wdrożenia

```json
{
  "nameRules.reguly (dopisać, opcjonalnie)": [
    {
      "muscle": "abs",
      "roles": ["aux"],
      "function": "abs.antilordosis",
      "status": "uproszczenie",
      "exercises": ["Body-Up"],
      "uproszczenie": "analogia do deski: przejście z podporu na przedramionach na dłonie przy prostym tułowiu; opis ćwiczenia tylko z katalogu (szczebel 5); funkcja abs.antilordosis sama ma status jedno_zrodlo — nie wyświetlać"
    }
  ]
}
```

Bez nowych funkcji i nowych źródeł.

## Źródła

- S17 (istn.) — Kenhub, Rectus abdominis, Function; szczebel 4 (serwis anatomiczny z autorem i recenzją).
- S26 (istn.) — Oliva-Lozano, Muyor 2020, przegląd systematyczny, 4.1 Discussion; szczebel 2, ale nie nazywa funkcji (nie liczy się jako drugie źródło funkcji).

## Otwarte

- [OTWARTE] Źródło szczebla 3–4 opisujące Body-Up (lub „plank up-down”) i pracę brzucha w tym ruchu — nie szukałem dalej, bo funkcja i tak nie jest wyświetlana; przy podniesieniu `abs.antilordosis` do `dwa_zrodla` wrócić do tego wiersza.
