# Role mięśni — rodzina `squat`, cz. 2 — fala W2

- Data: 02.11.2026
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1
- Autor: badacz-merytoryczny (fala W2)
- Podstawa: luki z W1 (gałąź badania/g4-nogi, plik `role-w1/squat.md`), `data/zrodla/role-miesni.json` (`exceptions.noRole`).

Ćwiczenia z gumami i łańcuchami (Squat with Bands/Chains, Box Squat with Bands/Chains, Reverse Band Box/Power Squat, Band Squat) nie mają luk
w liście W1. Zgodnie ze zleceniem koordynatora tu tylko propozycje `exceptions.noRole` dla dwóch luk z W1. Nowych źródeł anatomicznych
nie czytano — żadna luka nie dostaje funkcji ani reguły `nameRules`.

| ćwiczenie | region | rola | proponowana funkcja / reguła | źródła | status |
|---|---|---|---|---|---|
| Overhead Squat | front_delt | aux | `exceptions.noRole` — „unosi ramię do przodu” (`front_delt.shoulder_flex`) nie opisuje ruchu: ramię nieruchomo nad głową | brak (funkcja utrzymania bez przeczytanego źródła) | otwarte — proponowany wyjątek |
| One-Arm Overhead Kettlebell Squat | obliques | aux | `exceptions.noRole` — „skręca i pochyla tułów” (`obliques.rotate_bend`) nie opisuje ruchu: tułów utrzymywany prosto przy ciężarze z jednej strony | brak (funkcja przeciw pochyleniu w bok bez źródła) | otwarte — proponowany wyjątek |

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

Wpis wyjątku nie twierdzi niczego w aplikacji (rola zostaje bez opisu), więc nie wymaga źródła; funkcje utrzymania zostają otwarte —
rozstrzygną ≥ 2 źródła szczebla 2–3 (EMG naramiennego przedniego w przysiadzie nad głową; mięśnie skośne przy jednostronnym obciążeniu).
