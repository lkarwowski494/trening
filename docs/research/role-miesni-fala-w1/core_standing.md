# Role mięśni — fala W1, grupa g1: core w staniu i siadzie (core_standing)

Data: 02.11.2026 · autor: badacz-merytoryczny · tylko zbieranie danych (bez zmian w `data/zrodla/`).

Funkcje (`obliques.rotate`, `obliques.side_bend`, `obliques.antirotation`), źródła S29-g1…S34-g1, metoda i blok JSON — **w `core_floor.md`** (tam też `nameRules` dla ćwiczeń z tej tabeli). Role par: `MUSCLE_LOAD` w `lib/catalog.generated.ts` + `muscles`/`secondaryMuscles` w `docs/research/equipment/catalog.json`; opis ruchu z pola `note` katalogu.

## Pary

| ćwiczenie [pattern] | mięsień | rola | propozycja funkcji | przypisanie | stan |
|---|---|---|---|---|---|
| Russian Twist [core_other] | obliques | main | `obliques.rotate` | nameRules | gotowe |
| Cable Woodchop [core_other] | obliques | main | `obliques.rotate` | nameRules | gotowe |
| Landmine Rotation [core_other] | obliques | main | `obliques.rotate` | nameRules | gotowe |
| Cable Judo Flip [core_other] | obliques | main | `obliques.rotate` | nameRules („rotational pull across the body”) | gotowe |
| Cable Russian Twists [core_other] | obliques | main | `obliques.rotate` | nameRules | gotowe |
| Medicine Ball Full Twist [core_other] | obliques | main | `obliques.rotate` | nameRules („passing a medicine ball with a full rotation”) | gotowe |
| Seated Barbell Twist [core_other] | obliques | main | `obliques.rotate` | nameRules („rotating side to side”) | gotowe |
| Spell Caster [core_other] | obliques | main | `obliques.rotate` | nameRules („rotating the trunk”) | gotowe |
| Pallof Press With Rotation [core_anti_rot] | obliques | main | `obliques.rotate` | nameRules (sprawdzane przed regułą rodziny) | gotowe |
| Side Bend (hantel) [core_other] | obliques | main | `obliques.side_bend` | nameRules | gotowe |
| Barbell Side Bend [core_other] | obliques | main | `obliques.side_bend` | nameRules | gotowe |
| One-Arm High-Pulley Cable Side Bends [core_other] | obliques | main | `obliques.side_bend` | nameRules | gotowe |
| Weighted Ball Side Bend [core_other] | obliques | main | `obliques.side_bend` | nameRules | gotowe |
| Pallof Press [core_anti_rot] | obliques | main | `obliques.antirotation` | reguła core_anti_rot+obliques+main | otwarte (jedno źródło) |
| Pallof Press, Pallof Press With Rotation, Russian Twist, Cable Woodchop, Landmine Rotation, Cable Judo Flip, Cable Russian Twists, Medicine Ball Full Twist, Spell Caster | abs | aux | — | — | otwarte (brak źródła roli prostego w skrętach i oporze przed skrętem) |
| Landmine Rotation | front_delt | aux | — | — | otwarte (ramiona trzymają koniec sztangi; ruch w barku nie wynika z opisu) |
| Spell Caster | front_delt | aux | — | — | otwarte (zamach hantlami w górę — zgięcie barku prawdopodobne, brak opisu ruchu w źródle) |
| Kettlebell Windmill [core_other] | obliques | main | — | — | otwarte (skłon w biodrze z pochyleniem w bok; brak źródła, który ruch tułowia dominuje) |
| Kettlebell Windmill | side_delt | aux | — | — | otwarte (ramię trzymane nad głową — utrzymanie, nie unoszenie w bok) |
| Double Kettlebell Windmill [core_other] | obliques / side_delt / hamstrings | main / aux / aux | — | — | otwarte (jw.; dwugłowe — skłon w biodrze, analogia do hinge) |
| Bent Press [core_other] | obliques / front_delt / triceps / side_delt | main / main / aux / aux | — | — | otwarte (tułów schodzi pod odważnik; ruch barku względem tułowia bez przeczytanego opisu) |
| Kettlebell Figure 8 [core_other] | obliques / lower_back / hamstrings | main / aux / aux | — | — | otwarte (podawanie odważnika między nogami w pozycji skłonu — utrzymanie, analogia do hinge) |

Uwaga: Seated Barbell Twist jest w briefie w tej grupie, choć ćwiczy się na siedząco — zostawiam tutaj.

## Blok JSON

Wszystkie wpisy dla tej grupy są w bloku `core_floor.md` (`nameRules` `obliques.rotate` i `obliques.side_bend`, reguła `core_anti_rot` + `obliques` + `main` → `obliques.antirotation` ze statusem `jedno_zrodlo`). Nic dodatkowego.

## Źródła

Jak w `core_floor.md`: `obliques.rotate` — S3, S16, S18, S29-g1, S31-g1; `obliques.side_bend` — S3, S18, S29-g1, S31-g1; `obliques.antirotation` — S34-g1 (jedno źródło, szczebel 5).

## Otwarte

- [OTWARTE] Skośne przeciw rotacji (Pallof Press) — jedno źródło szczebla 5; szczegóły w `core_floor.md`. Wpis w `open` danych zmienia się z „brak źródła” na „jedno źródło (S34-g1)”.
- [OTWARTE] Prosty brzucha jako pomocniczy w skrętach — żadne przeczytane źródło nie opisuje jego roli (utrzymanie odchylenia w Russian Twist? kontrola miednicy?).
- [OTWARTE] Windmill, Double Windmill, Bent Press, Kettlebell Figure 8 — ruchy złożone (skłon w biodrze + pochylenie/skręt tułowia, ramię nad głową); bez źródła opisującego, co robią w nich skośne, barki i dwugłowe, przypisanie byłoby zgadywaniem.
- [OTWARTE] Barki w Landmine Rotation i Spell Caster — ruch ramion nie wynika jednoznacznie z opisu.

## Stan

- Zrobione: 13 par gotowych (skośne główne: 9 × skręt, 4 × skłon boczny), pozostałe otwarte z powodem.
- Zostało: przeniesienie do danych i przeliczenie generatorem; ewentualnie szukanie źródeł dla ruchów złożonych (windmill, bent press).
- Pułapki: `Pallof Press With Rotation` ma wzorzec `core_anti_rot` — musi trafić do `nameRules` (sprawdzane przed regułą rodziny), inaczej dostałby `antirotation`.
