# STAN-C — paczka C (etap 2, ZB-033 wariant B), badacz 03.11.2026

Zakres: 59 ćwiczeń paczki C bez `zestaw_ogolny` (87 − 28). **Badanie skończone: 59 z 59.**

Runda 1 (wyniki-C.md/.json): 12 — Hip Abduction, Nordic Curl, Sissy Squat, Seated Calf Raise, Łydki na stopniu (błędy), Donkey Calf Raise (brak), Smith Machine Reverse Calf Raise (brak), Sumo Deadlift (błędy), Leg Curl, Leg Extension, Lying Leg Curl (błędy), Step Up (błędy).
Runda 2 (wyniki-C-czesc2.md/.json): 16 — Curtsy Lunge, Pistol Squat, Wall Sit, Leg Curl (hantel), Reverse Nordic, Standing Leg Curl, Standing Cable Leg Curl, Single Leg Press, Smith Machine Leg Press / Pendulum Squat / Belt Squat Machine / Lying Machine Squat (brak), Cossack Squat, Barbell Side Split Squat, Single-Leg High Box Squat (brak), Smith Machine Pistol Squat (brak).
Runda 3 (wyniki-C-czesc3.md/.json, zgodne): poprawka Curtsy (wniosek z ruchu nie wynika → 2 z 3) + 31 — Crossover Reverse Lunge (2 z 3), Elevated Back Lunge (2 z 3), Lunge Pass Through (brak), Slider Reverse Lunge (brak), Split Squat (linki) (2 z 3 upr.), Suspended Split Squat (setup komplet, move komplet-upr.), Cable Hip Abduction (2 z 3; F≈S kopia), Monster Walk (brak), Hip Flexion with Band (brak), Frog Pump (2 z 3), London Bridges (brak), Stability Ball Hip Bridge (move komplet-upr., setup 1 z 3), Machine Glute Kickback (move 2 z 3, setup otwarte), Prone Flutter Kicks, Kneeling Squat, Seated Good Mornings, Kneeling Jump Squat (brak), plyo 14 (brak — M nie ma plyometrii).

ZOSTAŁO (następny agent, krótkie zadanie): scalić wyniki-C.json + wyniki-C-czesc2.json + wyniki-C-czesc3.json → docs/research/etap2/wyniki-2026-11-03/wyniki-C-calosc.json. Uwaga przy scalaniu: wpis „Curtsy Lunge” z czesc3 ma `poprawka_czesci_2: true` — zastępuje tylko pole `stan` wpisu z czesc2 (zdania z czesc2 zostają). Agent rundy 3 nie scalił z powodu limitu kontekstu.

Ustalenia o serwisach (na przyszłość):
- Respo: `https://centrumrespo.pl/atlas/?s=<fraza>&type=atlas`. Błędy w Respo często każą wstrzymać oddech — nie do zdań.
- Fabryka Siły: listy https://fabrykasily.pl/cwiczenia/dwuglowe-uda, /czworoglowe-uda, /na-lydki. F ma powtarzalny wzorzec redakcyjny („Unikaj gwałtownych ruchów powodujących zanik napięcia…”) i co najmniej jeden tekst ≈ kopia atlas.kulturystyka (F18 ≈ S14).
- SFD: atlas.kulturystyka.pl/nogi.asp; potreningu.pl przez WebSearch z `allowed_domains`.
- maniacmuscle: `?s=<fraza>`; brak łydek, tibialis, reverse nordic, pendulum, belt squat, cable hip abduction, monster walk, slider, plyometrii.
- Reguła „wariant sprzętu” (koordynator 03.11): tylko zmiana sprzętu przy tym samym ruchu stawów; NIE liczba nóg, pozycja ciała, kierunek, zakres.
