# Role mięśni — fala W2, core_floor: 9 otwartych par z W1 (02.11.2026)

Autor: badacz merytoryczny (agent). Status: PROPOZYCJA — bez zmian w `data/zrodla/role-miesni.json`.
Punkt wyjścia: W1 `role-miesni-fala-w1/core_floor.md` (tabela „Pary core_floor”, sekcja „Otwarte”). Funkcje i źródła anatomiczne (S3, S16, S17, S18, S29-g1, S32-g1…) — jak w W1; tu tylko nowe źródła i przypisania.
Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` (Fitness Volt, Healthline, BarBend — warunkowo 4: konkretna strona z autorem z kwalifikacjami i datą). Strony przeczytane WebFetch 02.11.2026.

## Pary

| wiersz (ćwiczenie, mięsień, rola) | proponowana funkcja / reguła | źródła (miejsce, szczebel) | status |
|---|---|---|---|
| Scissor Kick, abs, main | `abs.antilordosis`; `nameRules` {muscle: abs, roles: [main], exercises: ["Scissor Kick"]} i usunięcie wpisu z `exceptions.noRole` (`data/zrodla/role-miesni.json:1107–1111`; powód wyjątku „tułów nieruchomy — zgięcie tułowia nie opisuje ruchu” nie dotyczy funkcji antylordozy) | funkcja: S17 + S32-g1 (W1, `dwa_zrodla`). Że ćwiczenie wymaga utrzymania lędźwi przy podłodze, gdy pracują nogi: fv-scissor-kicks (ustawienie krok 3 „Tilt your pelvis, press your lower back into the floor, and brace your core.”; wskazówka o odrywaniu lędźwi; 4) i healthline-scissor-kicks (krok 2 „Engage your core by pressing your lower back into the mat and tucking your pelvis.”; „Make sure your back is not arching.”; 4) | `dwa_zrodla` (funkcja ma 2 źródła; dwa niezależne opisy techniki wiążą pracę brzucha w tym ćwiczeniu z utrzymaniem miednicy i lędźwi) |
| Alternate Heel Touchers, abs, aux | `abs.trunk_flex` (tekst aux „Pomaga zginać tułów”); `nameRules` {abs, [aux], ["Alternate Heel Touchers"]} | funkcja: istniejące źródła `abs.trunk_flex` w rejestrze. Ruch: barbend-heel-touches krok 2 („Engage your abs and lift your upper back, shoulders, and head off the floor.”; 4) i fv-heel-touchers krok 1 („Engage your core and lift your shoulders slightly off the ground.”; 4) | `uproszczenie` — barki unosi się raz i trzyma w górze, a funkcja opisuje zgięcie jako ruch; zostaje w danych bez tekstu, chyba że koordynator uzna utrzymanie zgięcia za „pomaga zginać tułów” |
| Bird Dog, obliques, main | `obliques.antirotation` (reguła core_anti_rot+obliques+main, z W1) | Nowe: fv-pallof-press (M. Magnante, ACE-certified, opubl. 08.11.2019, akt. 11.07.2026; sekcja mięśni: skośne „Contribute torque that opposes the cable or band pulling the trunk into rotation.”; 4). Dotyczy wyciskania Pallofa, nie bird doga. Catalyst Athletics (Pallof Press, 4) — „resist the rotation”, ale bez nazwy mięśnia → nie liczy się. S34-g1 — 5 | `jedno_zrodlo` dla funkcji (poprawa: teraz źródło szczebla 4 zamiast 5). Dla Bird Dog — analogia do Pallofa, nadal otwarte |
| Bird Dog, abs, aux | — | brak przeczytanego źródła roli | otwarte |
| Dead Bug, obliques, aux | `obliques.antilordosis` | bez nowych źródeł (W1: tylko ruch — odchylenie miednicy) | otwarte (uproszczenie) |
| Hollow Hold, obliques, aux | jw. | jw. | otwarte (uproszczenie) |
| Dragon Flag, obliques, aux | jw. | jw. | otwarte (uproszczenie) |
| Side Jackknife, abs, aux | — | bez źródła techniki szczebla 4 (wskazówki W1: otwarte) | otwarte |
| Stomach Vacuum, obliques, main | — | bez zmian: ćwiczenie dotyczy mięśnia poprzecznego; region „skośne” go zastępuje — decyzja katalogowa (W1) | otwarte |

## Blok do wklejenia (format role-miesni.json)

```json
{
  "nameRules": [
    { "muscle": "abs", "roles": ["main"], "function": "abs.antilordosis", "exercises": ["Scissor Kick"],
      "uwaga": "W2 02.11.2026: technika (Fitness Volt, Healthline) — lędźwie dociśnięte, miednica podwinięta, gdy pracują nogi; usunąć Scissor Kick z exceptions.noRole" },
    { "muscle": "abs", "roles": ["aux"], "function": "abs.trunk_flex", "exercises": ["Alternate Heel Touchers"],
      "pewnosc": "uproszczenie — utrzymanie uniesionych barków opisane funkcją zgięcia; w danych bez tekstu" }
  ],
  "functions": {
    "obliques.antirotation": {
      "uwaga": "W2 02.11.2026: + fv-pallof-press (szczebel 4, wyciskanie Pallofa) — nadal jedno źródło szczebla 2–4; S34-g1 szczebel 5",
      "zrodla": ["S34-g1", "fv-pallof-press"], "status": "jedno_zrodlo"
    }
  },
  "sources": [
    { "id": "fv-pallof-press", "tier": 4,
      "cite": "Magnante M. (ACE-certified). Pallof Press: Muscles Worked, Form, and Variations. Fitness Volt, 08.11.2019, akt. 11.07.2026",
      "url": "https://fitnessvolt.com/pallof-press/", "miejsce": "sekcja mięśni pracujących — Obliques",
      "cytaty": ["„Contribute torque that opposes the cable or band pulling the trunk into rotation.”"] },
    { "id": "fv-scissor-kicks", "tier": 4,
      "cite": "Dale P. Scissor Kicks. Fitness Volt, 25.03.2023, akt. 11.08.2024",
      "url": "https://fitnessvolt.com/scissor-kicks/", "miejsce": "How to — ustawienie, krok 3",
      "cytaty": ["„Tilt your pelvis, press your lower back into the floor, and brace your core.”"] },
    { "id": "healthline-scissor-kicks", "tier": 4,
      "cite": "Lindberg S., rec. Bubnis D. (M.S., NASM-CPT). Scissor kicks. Healthline, 01.05.2019",
      "url": "https://www.healthline.com/health/scissor-kicks", "miejsce": "instrukcja, krok 2",
      "cytaty": ["„Engage your core by pressing your lower back into the mat and tucking your pelvis.”"] }
  ]
}
```

## Źródła

| id | adres | szczebel (uzasadnienie) |
|---|---|---|
| fv-pallof-press | https://fitnessvolt.com/pallof-press/ | 4 warunkowo spełnione: autor w podpisie z kwalifikacją (ACE-certified), daty publikacji i aktualizacji; recenzent tylko „Editorial Team” (nienazwany); brak ujawnienia afiliacji na stronie |
| fv-scissor-kicks | https://fitnessvolt.com/scissor-kicks/ | 4: P. Dale, biogram z kwalifikacjami trenerskimi, daty; bez recenzenta |
| healthline-scissor-kicks | https://www.healthline.com/health/scissor-kicks | 4: nazwany recenzent z kwalifikacjami (NASM-CPT), data |
| barbend-heel-touches, fv-heel-touchers | jak w `wskazowki-fala-w2/core_floor-2.md`, p. 4 | 4 |
| Catalyst Athletics, Pallof Press | https://catalystathletics-org.catalystathletics.com/exercise/526/Pallof-Press/ | 4 (biblioteka firmowana przez Catalyst Athletics), ale nie nazywa mięśnia — nie liczy się do funkcji |

## Otwarte

- [OTWARTE] `obliques.antirotation`: drugie źródło szczebla 2–4 (podręcznik kinezjologii, badanie EMG nazywające funkcję); dla Bird Dog dodatkowo źródło, że w tym ćwiczeniu tułów opiera się skrętowi.
- [OTWARTE] Skośne pomocnicze przeciw wyprostowi (Dead Bug, Hollow Hold, Dragon Flag) i prosty brzucha w Bird Dog i Side Jackknife — w W2 bez nowych źródeł.
- [DO DECYZJI KOORDYNATORA] Alternate Heel Touchers / abs aux: czy utrzymanie uniesionych barków liczyć jako „pomaga zginać tułów” (wtedy `dwa_zrodla` z tekstem), czy zostawić uproszczenie bez tekstu.
- Stomach Vacuum — decyzja katalogowa (region), jak w W1.
- Liczby `pairs` przelicza generator przy wdrożeniu.

## Stan

- Zrobione: 9 par przejrzanych; 1 para gotowa (Scissor Kick abs main, `dwa_zrodla`), 1 uproszczenie (Heel Touchers abs aux), 1 funkcja wzmocniona do źródła szczebla 4 (nadal jedno źródło), 6 otwartych.
- Następny krok: źródło naukowe dla skośnych przeciw rotacji (pełne teksty prac EMG o wyciskaniu Pallofa / bird dogu).
- Pułapki: strony Fitness Volt różnią się podpisem — każdą sprawdzać osobno; Catalyst nie nazywa mięśni.
