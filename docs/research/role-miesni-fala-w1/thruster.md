# Role mięśni — grupa G3, rodzina `thruster` (fala W1)

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3; kontynuacja tego samego dnia — N5, N6)
Zakres: luki „brak reguły” dla Thruster (hantle) i Kettlebell Thruster (pattern `squat`). Reguły wspólne i źródła S29–S34 — `olympic.md`.

Szczeble źródeł według rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): CrossFit i ACE — organizacje szkolące/certyfikujące trenerów, treść
firmowana przez organizację → szczebel 4; dwie różne organizacje → dwa niezależne źródła.

## Zakres reguły

`squat|front_delt` (≥ 0,5) w katalogu: Thruster (hantle), Kettlebell Thruster (główny) oraz Overhead Squat, One-Arm Overhead Kettlebell Squat, Snatch Balance (pomocniczy). W przysiadach nad głową ramię nie unosi się, tylko trzyma ciężar — reguła rodziny `squat|front_delt` dałaby fałszywe zdanie. `squat|triceps` (≥ 0,5): oba thrustery i Snatch Balance. Reguła — tylko nameRules z listą dwóch thrusterów.

## Tabela luk

| Luka (pattern\|region\|rola) | Ćwiczenia | Wynik | Uzasadnienie |
|---|---|---|---|
| squat\|front_delt\|main | Thruster (hantle), Kettlebell Thruster | **gotowe** → N5 `front_delt.shoulder_flex` | dwa źródła szczebla 4 mówią wprost, że część górna to wyciskanie nad głowę: S35 (CrossFit, „elements of a front squat and an overhead press”) i W1G3-S10 (ACE, hantle: wstając z przysiadu „press the dumbbells overhead”, chwyt neutralny, łokcie przy tułowiu — ramię idzie do przodu i w górę). Funkcja przedniego aktonu w wyciskaniu nad głowę — istniejąca reguła `v_push` (S23, ustalone) |
| squat\|triceps\|aux | Thruster (hantle), Kettlebell Thruster | **gotowe** → N6 `triceps.elbow_ext` | S35: na końcu „the hips, knees, and arms are fully extended”; W1G3-S10: „by straightening the arms” — dwie organizacje |

Kettlebell Thruster: oba źródła opisują sztangę (S35) i hantle (W1G3-S10); kettlebell to ten sam ruch z innym przyrządem trzymanym przy barkach. Dołączony
do list z adnotacją — koordynator może go przenieść do `pominiete`, jeśli uzna zmianę przyrządu za analogię.

## Propozycje (format role-miesni.json)

```json
{
  "nameRules": {
    "reguly": [
      {
        "id": "N5",
        "muscle": "front_delt",
        "roles": ["main"],
        "function": "front_delt.shoulder_flex",
        "exercises": ["Thruster (hantle)", "Kettlebell Thruster"],
        "zrodlaZastosowania": ["S35", "W1G3-S10", "S23"],
        "uwaga": "Thruster = przysiad przedni + wyciskanie nad głowę w jednym ruchu (S35, W1G3-S10). Przedni akton unosi ramię w wyciskaniu nad głowę — ta sama funkcja co w regule v_push. Bez Overhead Squat, One-Arm Overhead Kettlebell Squat, Snatch Balance (trzymanie, nie unoszenie)."
      },
      {
        "id": "N6",
        "muscle": "triceps",
        "roles": ["aux"],
        "function": "triceps.elbow_ext",
        "exercises": ["Thruster (hantle)", "Kettlebell Thruster"],
        "zrodlaZastosowania": ["S35", "W1G3-S10"],
        "uwaga": "Ramiona prostują się nad głową w końcowej fazie (S35: „arms are fully extended”; W1G3-S10: „straightening the arms”). Bez Snatch Balance (otwarte w olympic.md)."
      }
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
    },
    {
      "id": "W1G3-S10", "tier": 4,
      "cite": "American Council on Exercise. Exercise Library: Squat to Overhead Press (nr 357, hantle)",
      "url": "https://acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press",
      "miejsce": "Steps — krok 1 i 3",
      "cytaty": [
        "krok 3: „push both legs into the ground to stand up” i „at the same time press the dumbbells overhead by straightening the arms”",
        "krok 1: dłonie zwrócone do siebie, „elbows close to the body”"
      ],
      "uwaga": "strona nie używa nazwy „thruster”, ale opisuje ten sam ruch: wyciskanie jednocześnie ze wstawaniem z przysiadu"
    }
  ]
}
```

## Zdania PL | EN

| Ćwiczenie i mięsień | PL | EN |
|---|---|---|
| Thrustery — przedni akton (główny) | Unosi ramię do przodu. | Raises your arm forward. |
| Thrustery — triceps (pomocniczy) | Pomaga prostować łokieć. | Helps straighten your elbow. |

Istniejące teksty funkcji, bez fazy (nameRules). Uwaga językowa do recenzenta lokalizacji: przy wyciskaniu nad głowę „unosi ramię do przodu” jest
poprawne anatomicznie (zgięcie barku), ale reguła `v_push` ma fazę „, gdy pchasz”, która tu by pomogła — sprawa formatu nameRules (Otwarte).

## Źródła

| id | organizacja | szczebel | miejsce | użycie |
|---|---|---|---|---|
| S35 | CrossFit Essentials „The Thruster” | 4 | Thruster Benefits; Finish Position | N5, N6 |
| W1G3-S10 | ACE Exercise Library „Squat to Overhead Press” | 4 | Steps 1, 3 | N5, N6 |
| S23 | istniejące (Padovan i in. 2025, wyciskanie nad głowę) | 3 | Discussion | funkcja przedniego aktonu w wyciskaniu nad głowę (już w regule v_push) |

Szukane i nie znalezione: badanie EMG albo kinematyki thrustera (PMC, wyszukiwanie 02.11.2026 — wyniki to strony komercyjne i aplikacji, które nie są źródłem). Nazwa organizacji tylko w tym wewnętrznym dokumencie (źródła publicznie anonimowo).

## Otwarte

- [OTWARTE] Czy nameRules dla thrusterów mają mieć fazę „gdy pchasz” (dziś nameRules są bez fazy) — sprawa formatu, do koordynatora.
- [OTWARTE, do koordynatora] Kettlebell Thruster — zmiana przyrządu względem źródeł (sztanga, hantle); w listach N5/N6 z adnotacją.

## Stan

- Zrobione: obie luki thrustera (4 pary) — N5, N6; źródła S35 i W1G3-S10.
- Zostało: nic merytorycznego; format fazy w nameRules.
- Następny krok: przy scalaniu dopisać N5/N6 do `nameRules.reguly`.
- Pułapki: reguła rodziny `squat|front_delt` lub `squat|triceps` objęłaby przysiady nad głową i Snatch Balance (trzymanie, nie unoszenie).
