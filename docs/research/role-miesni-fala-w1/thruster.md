# Role mięśni — grupa G3, rodzina `thruster` (fala W1)

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3)
Zakres: luki „brak reguły” dla Thruster (hantle) i Kettlebell Thruster (pattern `squat`). Reguły wspólne i źródła S29–S34 — `olympic.md`.

## Zakres reguły

`squat|front_delt` (≥ 0,5) w katalogu: Thruster (hantle), Kettlebell Thruster (główny) oraz Overhead Squat, One-Arm Overhead Kettlebell Squat, Snatch Balance (pomocniczy). W przysiadach nad głową ramię nie unosi się, tylko trzyma ciężar — reguła rodziny `squat|front_delt` dałaby fałszywe zdanie. `squat|triceps` (≥ 0,5): oba thrustery i Snatch Balance. Ewentualna reguła — tylko nameRules z listą dwóch thrusterów.

## Tabela luk

| Luka (pattern\|region\|rola) | Ćwiczenia | Wynik | Uzasadnienie |
|---|---|---|---|
| squat\|front_delt\|main | Thruster (hantle), Kettlebell Thruster | otwarte | Brak źródła przebiegu ruchu w barku dla thrustera. Przeczytane źródło (S35, szczebel 4) opisuje tylko, że ramiona „wypychają sztangę nad głowę”; przypisanie zgięcia barku przez analogię do wyciskania nad głowę (S23) = uproszczenie, nie wyświetlane |
| squat\|triceps\|aux | Thruster (hantle), Kettlebell Thruster | otwarte | S35: na końcu ruchu „the hips, knees, and arms are fully extended” — jedno źródło szczebla 4 (i dotyczy wersji ze sztangą) |

## Propozycje (format role-miesni.json)

Bez reguł do wdrożenia. Kandydat po znalezieniu drugiego źródła (wtedy status funkcji ustalone, bo funkcje już istnieją):

```json
{
  "nameRules": {
    "kandydaci_po_drugim_zrodle": [
      { "muscle": "front_delt", "roles": ["main"], "function": "front_delt.shoulder_flex",
        "exercises": ["Thruster (hantle)", "Kettlebell Thruster"] },
      { "muscle": "triceps", "roles": ["aux"], "function": "triceps.elbow_ext",
        "exercises": ["Thruster (hantle)", "Kettlebell Thruster"] }
    ]
  },
  "sources": [
    {
      "id": "S35", "tier": 4,
      "cite": "CrossFit Essentials: The Thruster (organizacja szkoląca trenerów; wersja ze sztangą)",
      "url": "https://www.crossfit.com/essentials/the-thruster",
      "miejsce": "Thruster Benefits; How to Do the Thruster — Finish Position; Muscle Groups Worked",
      "cytaty": [
        "„The thruster moves the body through a large range of motion by including elements of a front squat and an overhead press.”",
        "„the hips, knees, and arms are fully extended.”"
      ]
    }
  ]
}
```

## Zdania PL | EN

Brak (nic gotowego). Gdyby kandydaci weszli: „Unosi ramię do przodu.” | „Raises your arm forward.”; „Pomaga prostować łokieć.” | „Helps straighten your elbow.” (istniejące teksty funkcji).

## Źródła

| id | organizacja | szczebel | miejsce | użycie |
|---|---|---|---|---|
| S35 | CrossFit Essentials „The Thruster” | 4 | Thruster Benefits; Finish Position | jedno źródło — tylko w „Otwarte” |
| S23 | istniejące (Padovan i in. 2025, wyciskanie nad głowę) | 3 | Discussion | tylko analogia |

Szukane i nie znalezione: badanie EMG albo kinematyki thrustera (PMC, wyszukiwanie 02.11.2026 — wyniki to strony komercyjne i aplikacji, które nie są źródłem). Nazwa organizacji tylko w tym wewnętrznym dokumencie (źródła publicznie anonimowo).

## Otwarte

- [OTWARTE] Thrustery — przedni akton (główny): potrzebne drugie niezależne źródło, które opisuje uniesienie ramienia (zgięcie barku) w thrusterze, najlepiej biblioteka ćwiczeń innej organizacji szkolącej trenerów albo badanie.
- [OTWARTE] Thrustery — triceps (pomocniczy): drugie źródło dla prostowania łokcia (S35 to jedno źródło szczebla 4).
- [OTWARTE] Czy nameRules dla thrusterów mają mieć fazę „gdy pchasz” (dziś nameRules są bez fazy) — sprawa formatu, do koordynatora.

## Stan

- Zrobione: obie luki thrustera przejrzane; zakres reguły sprawdzony w katalogu; jedno źródło szczebla 4 przeczytane.
- Zostało: drugie źródło dla obu par.
- Następny krok: szukać w bibliotekach ćwiczeń organizacji szkolących trenerów (np. NSCA, NASM) opisu thrustera z prostowaniem ramion nad głową.
- Pułapki: reguła rodziny `squat|front_delt` lub `squat|triceps` objęłaby przysiady nad głową i Snatch Balance (trzymanie, nie unoszenie).
