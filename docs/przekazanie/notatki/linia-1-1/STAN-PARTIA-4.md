# Stan partii 4 rodzin figur v2 (figury/partia-4)

Rodziny: dip, chest_press_machine, cable_press, back_extension, thruster. Gałąź od `origin/integracja-1-1` @ e97bd17b (09.11.2026).
Lead: session_01T66VBz37fikLrafFxEbBYK; koordynator: session_01T66VByJCWCao1Hw3is68Cy.
Briefy: `briefy/partia-4-autor.md` (programista rodziny, własny worktree i gałąź `figury/partia-4-<rodzina>`), `briefy/partia-4-recenzent.md` (audytor ≠ autor).

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą; pełna karta): chest_press_machine +5 (z 5), dip +5 (z 5), cable_press +4 (z 4), back_extension +3 (z 4), thruster +3 (z 3).

Stan 10.11.2026 ~05:00 UTC (przekazanie sesji — kontekst leada 31%). `figury/partia-4` zawiera scalone rodziny dip, chest_press_machine, cable_press, back_extension i thruster (wpisy recenzji 1:1; thruster 10.11.2026 po r2); pełna karta (pokrycie-katalogu) 210 → 224; cel 1.1 (pokrycie-cele.json) = symulacja: pelnaKarta 456 (−1 za ławkę dipów).

| Rodzina | Stan | Skrót v2 | Recenzje (docs/research/recenzje/) |
|---|---|---|---|
| dip | wyswietlana 4/5 (Triceps Dips (ławka) w V2_WSTRZYMANE — P4-DIP-1, limit shSag; zestaw Dip Machine do poprawy — P4-DIP-2, decyzja koordynatora A) | eec289f04568 | partia4-dip-r1..r4 |
| chest_press_machine | wyswietlana 5/5 (zestaw Smith do poprawy — P4-CPM-1); v1 Machine Chest Press → zastapiona | a254d112c317 | partia4-chest_press_machine-r1, -r2 |
| cable_press | wyswietlana 4/4 | c79df483b2da | partia4-cable_press-r1, -r2 |
| back_extension | wyswietlana 3/4 (Weighted Ball Hyperextension bez pozy — P4-BEXT-3) | 014b427fa2f2 | partia4-back_extension-r1, -r2 |
| thruster | wyswietlana 3/3 (r2 audytora, 10.11.2026; poprawki W1–W3 na `figury/partia-4-thruster` @ 0ee59a94, `dynamiczne` dla rodziny w figury-sens.json — decyzja koordynatora A; backlog P4-THR-1..4) | 00dc790a18f6 (karty Thruster (hantle) 6606839c306f, Kettlebell Thruster 175baa530c3a; zestaw Clean and Press 84f205b001d6) | partia4-thruster-r1, -r2 |

Następne kroki (nowa sesja): (1) dociągnąć `origin/integracja-1-1` (c9346795 lub nowsza) do `figury/partia-4` — pliki generowane przeliczyć, figury-recenzja.json scalać jako JSON, docs/18/docs/21 suma, cel = symulacja; (2) `npm run verify:szybkie`, push, zielony `tests.yml`; (3) thruster — ZROBIONE 10.11.2026 (poprawki, r2, przepisanie, scalenie); dawny opis: poprawki (szkic parametrów w raporcie programisty: sProf zejście 0,3–0,36, wejście 0,6–0,7, gProf szczyt 8/11, K_DOL=124, AL_DOL=30, P_GORA=−5, GORA_DX=5) → r2 audytora → przepisanie → scalenie; (4) raport końcowy do koordynatora. Przekład: nowych tekstów UI brak → 0 USD.
Zmiana testu wspólnego toru (`progDzwigni`, chest_press_machine) oceniona przez audytora jako nie-poluzowanie (r1 cpm); przy scaleniu z partią 1 (wyjątek toru ohp) — suma. `figures-v2-mapping`: dolna granica sumy effort rodzin planned 100 → 90 (spadek po włączeniu rodzin; do weta koordynatora).

Model pracy: autor (programista) → audytor r1 → poprawki innego programisty → r2… → przepisanie 1:1 → scalenie gałęzi rodzin do figury/partia-4 (konflikty w listach wspólnych: overlay.ts, poseData.ts, families, mapping, strona-eksport n, gemini, skrot-v2-wynik, rejestr nakładek, W_ZAKRESIE, pliki generowane — suma) → cel = symulacja → verify:szybkie → push → tests.yml.
Pułapki: figure.ts ≤ 20 KB (wstrzymania); autorzy nie oglądali wszystkich arkuszy — recenzja znajdowała dłonie poza podporą (testy „podpory” z negatywem w każdej rodzinie); 4 rdzenie — najwyżej 3–4 agenty.
