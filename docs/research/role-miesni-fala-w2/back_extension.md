# Role mięśni — rodzina back_extension, fala W2, 02.11.2026

Tylko zbieranie danych. W1 (`role-miesni-fala-w1/back_extension.md`): Lower Back Curl → `lower_back.spine_ext` przez `nameRules` (blok w W1 `core_floor.md`) — bez zmian.
W2 sprawdziło pozostałe dwa ćwiczenia rodziny (udziały: `lib/catalog.generated.ts:985, 1065`; wzorzec `hinge` — linie 270, 350).

## 1. Pary

| wiersz (ćwiczenie, mięsień) | dziś (reguła rodziny `hinge`, faza „gdy się prostujesz”) | propozycja | źródła | status |
|---|---|---|---|---|
| Reverse Hyperextension, glutes (1) | „Prostuje biodro, gdy się prostujesz.” | **`nameRules` → `glutes.hip_ext` bez fazy: „Prostuje biodro.”** | funkcja bez zmian (istniejące źródła `glutes.hip_ext`); zmiana dotyczy tylko fazy — opis ruchu: catalyst-529 („Support the trunk and let the legs hang straight down.”), ace-64 (unoszenie nóg) — W1 | do decyzji koordynatora (korekta brzmienia, bez nowego twierdzenia) |
| Reverse Hyperextension, hamstrings (1) | jw. | **`nameRules` → `hamstrings.hip_ext` bez fazy: „Prostuje biodro.”** | jw. | jw. |
| Reverse Hyperextension, lower_back (0,5) | „Pomaga prostować plecy i trzymać je prosto.” | bez zmian | — | [OTWARTE] uwaga niżej |
| Weighted Ball Hyperextension, lower_back (1), glutes (0,5) | reguły `hinge` z fazą | bez zmian — tułów unosi się nad piłką, faza „gdy się prostujesz” pasuje | — | bez zmian |
| Lower Back Curl, lower_back (1) | — | W1 (nameRules `lower_back.spine_ext`) | W1 | bez zmian |

Powód propozycji: faza rodziny `hinge` („gdy się prostujesz” / „as you straighten up”, `data/zrodla/role-miesni.json:28–31`) opisuje prostowanie tułowia.
W reverse hyper tułów leży nieruchomo na podporze, a biodro prostuje się przez unoszenie nóg w tył (W1: Catalyst #529, ACE #64). Zdanie z fazą jest
więc mylące dla tego ćwiczenia; reguła po nazwie daje to samo zdanie bez fazy (`lib/muscleRoles.ts:35` — nameRules → wariant „_”, sprawdzane przed regułami rodziny).

## 2. Blok do wdrożenia (`nameRules.reguly`, dopisać)

```json
[
  {"muscle": "glutes", "roles": ["main"], "function": "glutes.hip_ext", "exercises": ["Reverse Hyperextension"]},
  {"muscle": "hamstrings", "roles": ["main"], "function": "hamstrings.hip_ext", "exercises": ["Reverse Hyperextension"]}
]
```

Wynik: „Prostuje biodro.” (`glutes.hip_ext` i `hamstrings.hip_ext`, tekst `main` — `data/zrodla/role-miesni.json:55, 75`). Test: Reverse Hyperextension, glutes →
„Prostuje biodro.” (bez „gdy się prostujesz”). Czy wariant `_` istnieje w danych runtime dla funkcji z fazą — sprawdzić w `lib/muscleRoles/data.json`
(generator `scripts/zrodla-runtime.mjs`); jeśli nie, wdrożenie wymaga też wariantu bez fazy w generatorze — [OTWARTE] dla programisty.

## 3. Otwarte

1. **Reverse Hyperextension, lower_back (0,5)** — Catalyst #529 (W1) każe napinać brzuch i pośladki, „to prevent excessive lumbar hyperextension” — prostowniki raczej utrzymują
   ustawienie niż prostują plecy. Zdanie „Pomaga prostować plecy i trzymać je prosto” częściowo pasuje („trzymać prosto”). Brak przeczytanego źródła o roli prostowników
   w tym ćwiczeniu → nie proponuję zmiany ani wyjątku; sygnał dla koordynatora.
2. Szczebel TeachMeAnatomy (S10) dla `lower_back.spine_ext` — z W1, do decyzji koordynatora linii.
