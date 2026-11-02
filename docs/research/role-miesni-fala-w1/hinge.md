# Role mięśni — pattern `hinge` (fala W1)

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Kontekst: `data/zrodla/role-miesni.json` → `open`: „[OTWARTE] Rola mięśni utrzymujących w martwym ciągu i noszeniu (najszersze,
górna część pleców, brzuch, skośne) — bez przeczytanego źródła.” Rola wymaga ≥ 2 niezależnych źródeł szczebla 2–3
(anatomia/biomechanika). Źródła szczebla 4 opisujące tę rolę zapisane niżej tylko jako trop.

## Luki

| Ćwiczenie | Mięsień | Rola | Wynik |
|---|---|---|---|
| Rack Pull, Rack Pull with Bands | upper_back | main | otwarte |
| Deadlift (sztanga), Sumo Deadlift, Trap Bar Deadlift, Axle/Deficit/Clean/Snatch Deadlift, warianty z gumami/łańcuchami | upper_back | aux | otwarte |
| One-Arm Side Deadlift | obliques | main | otwarte |

## Co przeczytano

- **Martín-Fuentes, Oliva-Lozano, Muyor (2020)**, „Electromyographic activity in deadlift exercise and its variants. A systematic review”, PLoS ONE — https://pmc.ncbi.nlm.nih.gov/articles/PMC7046193/ (szczebel 2). Tabela 1: czworoboczny (część środkowa i górna), najszerszy grzbietu i skośny zewnętrzny brzucha są tylko na liście mierzonych mięśni w pojedynczych badaniach (Escamilla i in. 2002; Edington i in. 2018; Iversen i in. 2017); wyniki dla nich nie są podane, nie ma też ich w tabelach 2–5. Przegląd nie opisuje funkcji górnej części pleców ani skośnych w martwym ciągu → **nie rozstrzyga**. (Przeczytano ok. 100 tys. z 107 tys. znaków; ostatni fragment — bibliografia/końcówka — nieprzeczytany.)
- Trop szczebla 4 (nie liczy się do roli): Titan Fitness, „Rack Pulls…” (https://titan.fitness/blogs/workouts/rack-pulls, sekcja Muscles Worked) — rack pull „also work[s] your upper back — specifically your trapezius muscles”; BarBend, „Learn Rack Pulls…” (https://barbend.com/rack-pulls/, sekcja „Trapezius and Back Muscles”) — „Your traps and upper back muscles work to maintain proper back tension during rack pulls.” Zgodne kierunkowo z rolą „utrzymuje napięcie pleców / stabilizuje łopatki”, ale to szczebel 4.
- Skośne przy jednostronnym obciążeniu (One-Arm Side Deadlift): nie znaleziono przeczytanego źródła szczebla 2–3 — to samo [OTWARTE] co „Skośne brzucha w ćwiczeniach przeciw rotacji/przechyleniu”.

## Propozycje reguł

Brak — żadna luka nie ma 2 źródeł szczebla 2–3.

```json
{
  "rules": [],
  "functions": {},
  "sources": {}
}
```

## Otwarte

- `upper_back` w `hinge` (main w Rack Pull, aux w martwych ciągach) — powód: brak przeczytanego źródła szczebla 2–3 o izometrycznej pracy czworobocznego/równoległobocznych w martwym ciągu; przegląd systematyczny z 2020 r. nie podaje wyników dla tych mięśni. Rozstrzygnęłyby: (a) pełny tekst Escamilla i in. 2002 (Med Sci Sports Exerc, sumo vs klasyczny, EMG czworobocznego) albo innego badania EMG z wynikami dla czworobocznego w martwym ciągu lub rack pull; (b) podręcznik biomechaniki/anatomii (szczebel 3) z opisem funkcji stabilizującej łopatki przy trzymaniu ciężaru w opuszczonych rękach. Odwołanie: istniejące [OTWARTE] „Rola mięśni utrzymujących w martwym ciągu…”.
- `obliques` main w One-Arm Side Deadlift — powód: brak źródła szczebla 2–3 (badania EMG ćwiczeń z obciążeniem jednostronnym, np. noszenie walizki/martwy ciąg jednorącz). Odwołanie: te same [OTWARTE] o skośnych.

## Stan

Wyszukiwanie przerwane po jednym przeglądzie (limit kontekstu). Następny krok: PubMed/PMC — „suitcase carry” / „unilateral deadlift” EMG oblique; „deadlift trapezius EMG” (pełny tekst, nie streszczenie).
