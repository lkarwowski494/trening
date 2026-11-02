# Role mięśni — rodzina `squat`, część 1 (fala W2)

- Data: 02.11.2026
- Status: PROPOZYCJA
- Autor: badacz-merytoryczny (fala W2)

Zakres: luki z pliku W1 `role-w1/squat.md` (gałąź badania/g4-nogi) dotyczące ćwiczeń z `squat-cz1.md`. Luki Back Squat, Leg Press
(adductors aux), Front Squat (abs aux) i Wall Sit — poza tą częścią. W W2 nie przeczytano nowych źródeł anatomicznych ani EMG
(limit kontekstu; pierwszeństwo miały karty techniki), więc żadna luka nie dostaje reguły `nameRules` — powody jak w W1.

| ćwiczenie | region | rola | proponowana funkcja / reguła `nameRules` | źródła | status |
|---|---|---|---|---|---|
| Zercher Squat | abs | aux | brak — `abs.antilordosis` ma status `jedno_zrodlo`, `abs.trunk_flex` nie opisuje ruchu (tułów się nie zgina) | brak przeczytanego źródła roli brzucha w przysiadzie z ciężarem z przodu (`role-miesni.json` → `withoutRole.kombinacje`) | otwarte |
| Double Kettlebell Front Squat | abs | aux | jak wyżej | jak wyżej | otwarte |
| One-Arm Overhead Kettlebell Squat | obliques | aux | brak — `obliques.rotate_bend` nie opisuje ruchu; potrzebna funkcja „utrzymuje tułów prosto przy ciężarze z jednej strony” | brak przeczytanego źródła; kandydat S27 (chód z ciężarem z jednej strony) to analogia, nie przysiad | otwarte (propozycja W1: `exceptions.noRole`) |
| Overhead Squat | front_delt | aux | brak — `front_delt.shoulder_flex` nie opisuje ruchu (ramię nieruchomo nad głową) | brak przeczytanego źródła EMG naramiennego przedniego w przysiadzie nad głową | otwarte (propozycja W1: `exceptions.noRole`) |

## Otwarte

- abs aux w przysiadach z ciężarem z przodu: ≥ 2 źródła szczebla 2–3 (przegląd EMG) — następny krok: S26 z `role-miesni.json` (czy obejmuje przysiad przedni).
- obliques aux i front_delt aux: nowe funkcje utrzymania pozycji wymagają źródeł; do tego czasu — wpisy `exceptions.noRole` z W1 (decyzja koordynatora).
