# BRD Trening — reguły dziedzinowe (RD) z wektorami testowymi
Wektory są uruchamiane na prawdziwych funkcjach aplikacji w `tests/audit-m1-044-brd.test.ts`. Pochodzenie wektora: rachunek (z metodą) albo decyzja. Reguły nie są krytyczne w rozumieniu CLAUDE.md (brak źródła szczebla 1–3 dla całości reguły); uproszczenia są nazwane.

## Reguły

### RD-01: Szacowany maksymalny ciężar (e1RM, wzór Epleya)
- Wzór: `e1RM = ciężar × (1 + powtórzenia / 30)`; dla jednego powtórzenia `e1RM = ciężar`; wynik zaokrąglony do 1e-6
- Jednostki: ciężar [kg], powtórzenia [-], e1RM [kg]
- Granica: powtórzenia ≥ 1 i ciężar > 0 (włącznie); poza granicą wynik 0 (brak e1RM)
- Podstawa: rachunek (wzór w `lib/stats.ts`, funkcja `e1rm`; opis i zastrzeżenia: docs/research/masa-ciala-e1rm-2026-10.md)
- Krytyczna: nie
- Uproszczenie: rekord e1RM tylko z serii do 10 powtórzeń (`E1RM_MAX_REPS`) i bez drop setów; wzór szacuje 1RM z serii do 10 powtórzeń, ćwiczenia z masą ciała tą samą regułą (docs/research/masa-ciala-e1rm-2026-10.md).

| ID | Ciężar [kg] | Powtórzenia [-] | Oczekiwane: e1RM [kg] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|
| RD-01-W1 | 100 | 5 | 116,666667 | 0,000001 | typowy | rachunek: 100 × (1 + 5/30) |
| RD-01-W2 | 100 | 1 | 100 | 0 | granica | rachunek: jedno powtórzenie = ciężar |
| RD-01-W3 | 100 | 0 | 0 | 0 | poniżej | rachunek: poza granicą powtórzenia ≥ 1 |
| RD-01-W4 | 100 | 10 | 133,333333 | 0,000001 | powyżej | rachunek: 100 × (1 + 10/30) |
| RD-01-W5 | -5 | 5 | 0 | 0 | błąd | rachunek: ciężar ≤ 0 daje 0 |

### RD-02: Skala RIR a RPE
- Wzór: wyświetlanie `RIR = 10 − RPE` dla RPE od 5 do 10 (RIR od 0 do 5); RPE poniżej 5 w skali RIR to „lekko” (RIR 7+). Wpis: RIR od 0 do 5 → `RPE = 10 − RIR`; RIR powyżej 5 do 6 → RPE 5; RIR powyżej 6 → RPE 4 („lekko”)
- Jednostki: RPE [-], RIR [-]
- Granica: RPE ≥ 5 (włącznie) przelicza się na RIR 0–5; wpis RIR ≤ 6 (włącznie) przelicza się na RPE 5–10; RIR powyżej 6 = „lekko”
- Podstawa: S-01, S-02, S-04
- Krytyczna: nie
- Uproszczenie: dane zawsze w RPE, RIR to sposób wyświetlenia i wpisu (`lib/state/effort.ts`). Źródło grupuje 4–6 RIR przy RPE 5–6 (S-04), więc RIR 6 zapisuje się jako najniższe RPE tego przedziału (5) i wraca na ekran jako RIR 5; granica „lekko” od RIR 7 — M1-audytor-generalny-020 (DEC-04 a, 27.10.2026). Dane zapisane wcześniej (RPE 4) się nie zmieniają.

| ID | RPE [-] | Oczekiwane: RIR [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|
| RD-02-W1 | 8 | 2 | 0 | typowy | rachunek: 10 − 8 |
| RD-02-W2 | 5 | 5 | 0 | granica | rachunek: 10 − 5; najniższe RPE przeliczane na RIR |
| RD-02-W3 | 4,5 | 7 | 0 | poniżej | S-02: poniżej RPE 5 opisy słowne („lekko”); wartość 7 = RIR_MAX + 1 (pokazywane „7+”) |
| RD-02-W4 | 10 | 0 | 0 | powyżej | rachunek: 10 − 10 |
| RD-02-W5 | 11 | 0 | 0 | błąd | rachunek: wartość poza skalą 1–10 ograniczona do zakresu (RIR 0) |

| ID | RIR [-] | Oczekiwane: RPE [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|
| RD-02-W6 | 2 | 8 | 0 | typowy | rachunek: 10 − 2 |
| RD-02-W7 | 6 | 5 | 0 | granica | S-04: 4–6 RIR w przedziale RPE 5–6; RIR 6 = najniższe RPE przedziału |
| RD-02-W8 | 5,5 | 5 | 0 | poniżej | S-04: przedział 4–6 RIR; RPE nie schodzi poniżej 5 |
| RD-02-W9 | 7 | 4 | 0 | powyżej | S-02: więcej niż 6 RIR = „lekko” (RPE 4, górna granica „light effort”) |
| RD-02-W10 | -3 | 10 | 0 | błąd | rachunek: wartość ujemna ograniczona do RPE 10 (RIR 0) |

### RD-03: Porzucony trening w toku
- Wzór: pytanie, gdy `bezczynność ≥ 2 h`; ciche zakończenie, gdy `bezczynność ≥ 6 h` (bezczynność = czas od ostatniej odhaczonej serii lub startu)
- Jednostki: bezczynność [h], pytanie [-] (1 = pytanie zadane), zakończenie [-] (1 = trening zapisany po cichu)
- Granica: 2 h włącznie dla pytania; 6 h włącznie dla zakończenia
- Podstawa: D-008 (decyzja właściciela 2026-10-19: liczby zostają); liczby jako parametr produktowy, nie wynik badań (OP-04)
- Krytyczna: nie
- Uproszczenie: sama rozgrzewka (bez serii roboczej) po 6 h nie kończy treningu po cichu — czeka na decyzję (`lib/state/finish.ts`).

| ID | Bezczynność [h] | Oczekiwane: pytanie [-] | Oczekiwane: zakończenie [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|
| RD-03-W1 | 1 | 0 | 0 | 0 | typowy | D-008: poniżej 2 h bez pytania |
| RD-03-W2 | 2 | 1 | 0 | 0 | granica | D-008: 2 h włącznie |
| RD-03-W3 | 1,99 | 0 | 0 | 0 | poniżej | D-008: tuż poniżej 2 h |
| RD-03-W4 | 3 | 1 | 0 | 0 | powyżej | D-008: między 2 h a 6 h tylko pytanie |
| RD-03-W5 | 6 | 1 | 1 | 0 | granica | D-008: 6 h włącznie |
| RD-03-W6 | 5,99 | 1 | 0 | 0 | poniżej | D-008: tuż poniżej 6 h trening nie kończy się sam |
| RD-03-W7 | -1 | 1 | 0 | 0 | błąd | D-008: godzina ostatniej serii z przyszłości jest niewiarygodna — aplikacja pyta od razu, ale nie zapisuje sama (`lib/state/finish.ts`, T6) |

### RD-04: Serie na partię mięśniową
- Wzór: seria robocza liczy się jako 1 dla partii głównej ćwiczenia i 0,5 dla każdej partii pomocniczej; serie rozgrzewkowe nie są liczone
- Jednostki: serie robocze [-], serie na partię [-]
- Granica: brak
- Podstawa: S-03
- Krytyczna: nie
- Uproszczenie: waga 0,5 dla partii pomocniczej to uproszczenie (przypisanie partii: docs/research/24-przypisanie-partii.md); S-03 wskazuje liczenie „fractional” jako najlepiej opisujące dane, bez rozstrzygania wagi.

| ID | Serie robocze [-] | Serie rozgrzewkowe [-] | Oczekiwane: partia główna [-] | Oczekiwane: partia pomocnicza [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|---|
| RD-04-W1 | 3 | 0 | 3 | 1,5 | 0 | typowy | rachunek: 3 × 1 i 3 × 0,5 |
| RD-04-W2 | 0 | 0 | 0 | 0 | 0 | granica | rachunek: brak serii |
| RD-04-W3 | 3 | 2 | 3 | 1,5 | 0 | typowy | rachunek: rozgrzewka nie wchodzi do liczenia |
| RD-04-W4 | 1 | 0 | 1 | 0,5 | 0 | typowy | rachunek: 1 × 1 i 1 × 0,5 |

| ID | Serie robocze [-] | Ćwiczenie usunięte z biblioteki [-] | Oczekiwane: partia główna [-] | Oczekiwane: partia pomocnicza [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|---|
| RD-04-W5 | 3 | 1 | 0 | 0 | 0 | błąd | rachunek: seria ćwiczenia, którego nie ma w bibliotece (1 = usunięte), nie ma przypisanych partii, więc nie wchodzi do liczenia; dopisane 2026-10-28 (01-odkrywanie-009) |

### RD-05: Limit dni treningowych w stanie darmowym
- Wzór: start nowego treningu na żywo jest dozwolony, gdy `dni zużyte < limit` albo dziś już jest dniem treningowym; `zostało = max(0, limit − dni zużyte)`; limit = 5 dni w miesiącu kalendarzowym (D-101). Dzień zużyty: RD-06
- Jednostki: dni zużyte [-] (różne dni bieżącego miesiąca z ukończonym treningiem na żywo), dziś dzień treningowy [-] (1 = tak), wpisy uszkodzone [-], start dozwolony [-] (1 = tak), zostało [-]
- Granica: 5 dni zużytych (włącznie: od 5 start w nowym dniu jest zablokowany)
- Podstawa: D-101 (parametr produktowy, nie wynik badań); kod `lib/access.ts` (`PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`, `canStartLive`)
- Krytyczna: nie
- Uproszczenie: wpis dnia bez poprawnej chwili startu jest pomijany (nie zużywa dnia); pełny dostęp (Pro) nie ma limitu.

| ID | Dni zużyte [-] | Dziś dzień treningowy [-] | Wpisy uszkodzone [-] | Oczekiwane: start dozwolony [-] | Oczekiwane: zostało [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|---|---|
| RD-05-W1 | 2 | 0 | 0 | 1 | 3 | 0 | typowy | D-101: 2 < 5; 5 − 2 |
| RD-05-W2 | 5 | 0 | 0 | 0 | 0 | 0 | granica | D-101: 5 dni wykorzystane, nowy dzień zablokowany |
| RD-05-W3 | 4 | 0 | 0 | 1 | 1 | 0 | poniżej | D-101: 4 < 5; 5 − 4 |
| RD-05-W4 | 6 | 0 | 0 | 0 | 0 | 0 | powyżej | rachunek: więcej dni niż limit (np. przywrócona kopia z innego telefonu); zostało nie spada poniżej 0 |
| RD-05-W5 | 5 | 1 | 0 | 1 | 0 | 0 | typowy | D-101: kolejny trening tego samego dnia nie zużywa limitu i zawsze wolno go zacząć |
| RD-05-W6 | 0 | 0 | 5 | 1 | 5 | 0 | błąd | rachunek: wpisy bez poprawnej chwili startu nie są dniami |

### RD-06: Dzień treningowy: trening na żywo dłuższy niż 7 minut
- Wzór: ukończony trening na żywo zużywa dzień limitu, gdy `czas bez pauz > 7 min` (D-102)
- Jednostki: czas treningu bez pauz [min], dzień zużyty [-] (1 = tak)
- Granica: 7 min (wyłącznie: dokładnie 7 min nie zużywa dnia)
- Podstawa: D-102 (parametr produktowy; zmiana z 20 min na 7 min po teście na telefonie); kod `lib/access.ts` (`MIN_LIVE_MINUTES_FOR_DAY`, `qualifiesForDay`)
- Krytyczna: nie

| ID | Czas bez pauz [min] | Oczekiwane: dzień zużyty [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|
| RD-06-W1 | 45 | 1 | 0 | typowy | D-102: 45 > 7 |
| RD-06-W2 | 7 | 0 | 0 | granica | D-102: „dłużej niż 7 minut”, 7 nie wystarcza |
| RD-06-W3 | 6,5 | 0 | 0 | poniżej | D-102: 6,5 < 7 |
| RD-06-W4 | 7,5 | 1 | 0 | powyżej | D-102: 7,5 > 7 |
| RD-06-W5 | -5 | 0 | 0 | błąd | rachunek: czas ujemny (np. zegar cofnięty) nie zużywa dnia |

### RD-07: Zakresy powtórzeń w generatorze według roli ćwiczenia
- Wzór: zakres powtórzeń `[od, do]` = bój główny przy celu „Siła” 4–6 (ok. ≥ 80% 1RM), ćwiczenia dodatkowe przy „Sile” 6–10, cele masa, redukcja i ogólny na siłowni 8–12, w domu i bez obciążenia zewnętrznego 12–20
- Jednostki: powtórzenia [-]
- Granica: brak
- Podstawa: S-05 (≥ 80% 1RM dla siły), S-13 (przyrost mięśni przy 30–100% 1RM), S-14 (8–12 powtórzeń); zakresy 6–10 i 12–20 — uproszczenie (rejestr twierdzeń T-008, T-026, T-050, T-051); kod `lib/genconst.ts` (`REPS`, `HEAVY_PCT`); docs/24-generator-i-plany.md
- Krytyczna: nie
- Uproszczenie: przelicznik %1RM ↔ liczba powtórzeń (4–6 przy ≥ 80% 1RM) to wybór projektu, niesprawdzony u źródła [DO USTALENIA] (OP-06); zakres dla początkujących przy celu „Siła” [DO USTALENIA] (OP-07).

| ID | Rola ćwiczenia [-] | Oczekiwane: od [-] | Oczekiwane: do [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|
| RD-07-W1 | heavy | 4 | 6 | 0 | typowy | S-05 i T-050: bój główny przy „Sile”, ciężko (uproszczenie) |
| RD-07-W2 | strength | 6 | 10 | 0 | typowy | S-13: przyrost przy 30–100% 1RM; 6–10 dla ćwiczeń dodatkowych przy „Sile” — uproszczenie (T-008) |
| RD-07-W3 | gym | 8 | 12 | 0 | typowy | S-14: 8–12 powtórzeń (T-026) |
| RD-07-W4 | home | 12 | 20 | 0 | typowy | S-13: 30–100% 1RM; 12–20 w domu i bez obciążenia — uproszczenie (T-026) |
| RD-07-W5 | nieznana | — | — | 0 | błąd | rachunek: rola spoza listy nie ma zakresu |

### RD-08: Przerwy między seriami w generatorze i domyślna przerwa
- Wzór: przerwa = 180 s po boju głównym przy „Sile”, 120 s po wielostawowych (i dodatkowych przy „Sile”), 90 s po jednostawowych i core; domyślna przerwa ćwiczenia bez własnej przerwy 90 s
- Jednostki: przerwa [s]
- Granica: brak
- Podstawa: S-07 (przerwy 2–3 min przy ciężkich seriach), S-08 (niewielka korzyść przerw dłuższych niż 60 s); rejestr twierdzeń T-010, T-028 (uproszczenie, źródła rozbieżne); kod `lib/generator.ts` (`REST`), `lib/seed.ts` (`DEFAULT_REST`)
- Krytyczna: nie
- Uproszczenie: wartości 180 / 120 / 90 s to część wspólna rozbieżnych źródeł; domyślne 90 s to ta sama wartość co po jednostawowych (konwencja w przedziale S-08).

| ID | Rola ćwiczenia [-] | Oczekiwane: przerwa [s] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|
| RD-08-W1 | heavy | 180 | 0 | typowy | S-07: 2–3 min przy ciężkich seriach (górna granica) |
| RD-08-W2 | multi | 120 | 0 | typowy | S-07: 2 min (dolna granica) |
| RD-08-W3 | iso | 90 | 0 | typowy | S-08: powyżej 60 s (uproszczenie) |
| RD-08-W4 | domyślna | 90 | 0 | typowy | S-08: powyżej 60 s; konwencja jak po jednostawowych |
| RD-08-W5 | nieznana | — | 0 | błąd | rachunek: rola spoza listy nie ma przerwy |

### RD-09: Budżet serii z czasu sesji w generatorze
- Wzór: `serie = floor((minuty − 10) × 60 / (40 + średnia przerwa))`; średnia przerwa: cel „Siła” 150 s (średnio 180 i 120), cele masa, redukcja i ogólny 105 s (średnio 120 i 90)
- Jednostki: minuty [min], serie [-], średnia przerwa [s]
- Granica: brak
- Podstawa: rachunek (docs/24-generator-i-plany.md, wiersz „Czas sesji”; średnie z RD-08); 10 min rozgrzewki i 40 s serii — uproszczenie bez źródła, tak nazwane w rejestrze twierdzeń (T-007); kod `lib/generator.ts` (`setsBudget`, `AVG_REST`)
- Krytyczna: nie
- Uproszczenie: czas sesji wybiera się tylko z listy 45, 60, 90 min (`GEN_MINUTES`), więc czasu krótszego niż rozgrzewka nie da się wpisać; wektor błędnych danych pominięty (uwaga kontroli, OP-08).

| ID | Cel [-] | Minuty [min] | Oczekiwane: serie [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|
| RD-09-W1 | strength | 60 | 15 | 0 | typowy | rachunek: floor(50 × 60 / 190) = floor(15,79) |
| RD-09-W2 | hypertrophy | 60 | 20 | 0 | typowy | rachunek: floor(50 × 60 / 145) = floor(20,69) |
| RD-09-W3 | strength | 45 | 11 | 0 | typowy | rachunek: floor(35 × 60 / 190) = floor(11,05) |
| RD-09-W4 | hypertrophy | 90 | 33 | 0 | typowy | rachunek: floor(80 × 60 / 145) = floor(33,10) |
| RD-09-W5 | general | 45 | 14 | 0 | typowy | rachunek: floor(35 × 60 / 145) = floor(14,48) |

### RD-10: Podpowiedź deloadu po kilku tygodniach treningu
- Wzór: podpowiedź „Zaplanuj deload”, gdy tygodnie treningu z rzędu ≥ 4 (dolna granica „zwykle co 4–6 tygodni”); tydzień bez treningu albo oznaczony jako deload przerywa serię; bieżący tydzień bez treningu nie przerywa (liczenie od poprzedniego)
- Jednostki: tygodnie z rzędu [tydz.], treningi z przyszłości [-], podpowiedź [-] (1 = tak)
- Granica: 4 tygodnie (włącznie)
- Podstawa: S-09 (praktyka trenerów: średnio ok. 5,6 tygodnia; jedno źródło, jeden zespół), D-114; kod `lib/deload.ts` (`DELOAD_EVERY`, `deloadHint`); docs/research/22-serie-deload-generator.md sekcja 2
- Krytyczna: nie
- Uproszczenie: opis praktyki, nie wynik badań; bez wyzwalaczy z danych (spadek e1RM, wzrost RPE); podpowiedź nie zmienia szablonów (ZP-01).

| ID | Tygodnie z rzędu [tydz.] | Treningi z przyszłości [-] | Oczekiwane: podpowiedź [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|
| RD-10-W1 | 5 | 0 | 1 | 0 | typowy | S-09, D-114: 5 ≥ 4 |
| RD-10-W2 | 4 | 0 | 1 | 0 | granica | D-114: dolna granica 4 tygodni |
| RD-10-W3 | 3 | 0 | 0 | 0 | poniżej | D-114: 3 < 4 |
| RD-10-W4 | 8 | 0 | 1 | 0 | powyżej | S-09: ponad górną granicę praktyki nadal podpowiedź |
| RD-10-W5 | 0 | 5 | 0 | 0 | błąd | rachunek: treningi z datą w przyszłości (np. zły zegar) nie tworzą serii tygodni |

### RD-11: Cel serii na partię w tygodniu
- Wzór: cel partii = cel ręczny z Ustawień ograniczony do `[1, 40]` i zaokrąglony do całości, a bez celu ręcznego — automatycznie 10 serii
- Jednostki: cel ręczny [serie], cel [serie]
- Granica: 1 i 40 serii (granice pola w interfejsie, ochrona przed pomyłką wpisu, nie zalecenie)
- Podstawa: S-06 (≥ 10 serii na partię w tygodniu przy budowie masy); rejestr twierdzeń T-032, T-034, T-055; granice pola 1–40 — konwencja interfejsu (`lib/setParts.ts`, komentarz przy `SETS_GOAL_MIN`); kod `lib/stats.ts` (`WEEKLY_SETS_MARK`, `setsGoal`)
- Krytyczna: nie
- Uproszczenie: serie partii pomocniczej liczą się po 0,5 (RD-04).

| ID | Cel ręczny [serie] | Oczekiwane: cel [serie] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|
| RD-11-W1 | — | 10 | 0 | typowy | S-06: automatycznie dolny próg ≥ 10 serii |
| RD-11-W2 | 14 | 14 | 0 | typowy | rachunek: cel ręczny w granicach |
| RD-11-W3 | 1 | 1 | 0 | granica | rachunek: dolna granica pola |
| RD-11-W4 | 0 | 1 | 0 | poniżej | rachunek: poniżej granicy → 1 |
| RD-11-W5 | 41 | 40 | 0 | powyżej | rachunek: powyżej granicy → 40 |
| RD-11-W6 | -5 | 1 | 0 | błąd | rachunek: wartość ujemna → 1 |

### RD-12: Udział masy ciała w e1RM ćwiczeń z masą ciała
- Wzór: `ciężar do e1RM = udział × masa ciała + dociążenie`; udział: podciąganie (nachwyt, podchwyt, chwyt neutralny) 1, pompki 0,64; inne ćwiczenia z masą ciała — brak e1RM; dalej e1RM jak RD-01
- Jednostki: masa ciała [kg], dociążenie [kg], powtórzenia [-], e1RM [kg]
- Granica: brak
- Podstawa: S-10 (podciąganie: masa ciała plus dociążenie), S-11 (pompki: 62,6–65,1% masy ciała); D-118; rachunek RD-01; kod `lib/stats.ts` (`BW_SHARE`, `liftedLoad`); docs/research/masa-ciala-e1rm-2026-10.md
- Krytyczna: nie
- Uproszczenie: 0,64 to wartość w przedziale S-11; przy podciąganiu cała masa ciała, choć dłonie i część przedramion nie są unoszone.

| ID | Ćwiczenie [-] | Masa ciała [kg] | Dociążenie [kg] | Powtórzenia [-] | Oczekiwane: e1RM [kg] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|---|---|
| RD-12-W1 | Pull Up | 80 | 0 | 5 | 93,333333 | 0,000001 | typowy | rachunek: 1 × 80 × (1 + 5/30) |
| RD-12-W2 | Push Up | 80 | 0 | 10 | 68,266667 | 0,000001 | typowy | rachunek: 0,64 × 80 × (1 + 10/30) |
| RD-12-W3 | Pull Up | 80 | 10 | 3 | 99 | 0,000001 | typowy | rachunek: (80 + 10) × (1 + 3/30) |
| RD-12-W4 | Chest Dip | 80 | 0 | 8 | 0 | 0 | typowy | S-10, S-11: brak udziału ze źródła → bez e1RM |
| RD-12-W5 | Pull Up | — | 0 | 5 | 0 | 0 | błąd | rachunek: brak pomiaru masy ciała → bez e1RM |

### RD-13: Ostrzeżenie: te same główne partie dzień po dniu
- Wzór: para dni `(d, d + 1)` daje ostrzeżenie, gdy partie główne ćwiczeń obu dni (trening zrobiony albo czekający szablon z planu) mają część wspólną; sprawdzane w oknie powrotu do rutyny `RETURN_DAYS` = 10 dni od wybranego dnia (D-115)
- Jednostki: odstęp [dni], wspólna partia [-] (1 = tak), szablon usunięty [-] (1 = tak), ostrzeżenia [-]
- Granica: brak
- Podstawa: S-12 (zalecenie 48 h między sesjami z tą samą partią — cytat z drugiej ręki, oryginał nieprzeczytany); rejestr twierdzeń T-004, T-022, T-049 (uproszczenie); D-115; kod `lib/plan.ts` (`backToBack`, `RETURN_DAYS`); docs/research/23-regeneracja-partii.md
- Krytyczna: nie
- Uproszczenie: ostrzeżenie, nie blokada — przy tej samej objętości tygodnia dzień po dniu nie szkodzi (docs/research/23, R3).

| ID | Odstęp [dni] | Wspólna partia [-] | Szablon usunięty [-] | Oczekiwane: ostrzeżenia [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|---|
| RD-13-W1 | 1 | 1 | 0 | 1 | 0 | typowy | rachunek: dzień po dniu z tą samą partią |
| RD-13-W2 | 1 | 0 | 0 | 0 | 0 | typowy | rachunek: dzień po dniu, różne partie |
| RD-13-W3 | 2 | 1 | 0 | 0 | 0 | typowy | rachunek: dzień przerwy między sesjami |
| RD-13-W4 | 1 | 1 | 1 | 0 | 0 | błąd | rachunek: szablon z planu usunięty — brak partii, brak ostrzeżenia |

### RD-14: Krok ± na tablicy „teraz”
- Wzór: ciężar bez opisanego sprzętu w miejscu — sztanga i masa ciała ± 2,5 kg (± 5 lb), hantle i ćwiczenia jednostronne ± 1 kg (± 2,5 lb); z opisanym sprzętem — sąsiedni dostępny ciężar; czas ± 5 s; dystans ± 50 m (± 50 yd); powtórzenia ± 1; „−” od pustej wartości nic nie robi
- Jednostki: wartość [kg; s; m], kierunek [-] (1 = „+”, −1 = „−”), wynik [kg; s; m]
- Granica: brak
- Podstawa: D-122 (ZM-01: wpis i ± na tablicy); krok ciężaru jak cicha podpowiedź progresji (rejestr twierdzeń T-039: krok to wybór aplikacji, nie wynik badań); kroki czasu i dystansu — konwencja robocza bez źródła [DO USTALENIA] (OP-05); kod `lib/board.ts` (`stepOf`, `BOARD_STEPS`)
- Krytyczna: nie

| ID | Pole [-] | Wartość [kg; s; m] | Kierunek [-] | Oczekiwane: wynik [kg; s; m] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|---|
| RD-14-W1 | sztanga | 60 | 1 | 62,5 | 0 | typowy | D-122, T-039: + 2,5 kg |
| RD-14-W2 | hantle | 20 | 1 | 21 | 0 | typowy | D-122, T-039: + 1 kg |
| RD-14-W3 | masa ciała | 0 | 1 | 2,5 | 0 | typowy | D-122: dociążenie + 2,5 kg |
| RD-14-W4 | czas | 30 | 1 | 35 | 0 | typowy | D-122: + 5 s (konwencja, OP-05) |
| RD-14-W5 | dystans | 100 | 1 | 150 | 0 | typowy | D-122: + 50 m (konwencja, OP-05) |
| RD-14-W6 | sztanga | — | -1 | — | 0 | błąd | D-122: „−” od pustej wartości nic nie robi |

### RD-15: Strażnik progresji: kierunek partii tydzień do tygodnia
- Wzór: dla ćwiczenia powtórzonego w obu tygodniach `tonaż na sesję = Σ serie robocze × powtórzenia × ciężar / liczba sesji`; kierunek partii: „więcej”, gdy tonaż bieżący > poprzedni, „tyle samo” przy równości po zaokrągleniu do liczby na ekranie, „mniej”, gdy mniejszy; spadek tonażu przy wzroście ciężaru roboczego = „więcej”; bez treningu w tygodniu porównawczym = „nowe”
- Jednostki: ciężar [kg], serie [-], kierunek [-] (`up` = więcej, `same` = tyle samo, `down` = mniej, `new` = nowe)
- Granica: tonaż bieżący równy poprzedniemu (po zaokrągleniu) = „tyle samo”
- Podstawa: rachunek (tonaż); reguły porównania — konwencje produktu z decyzji D-113, bez progów procentowych; kod `lib/guard.ts` (`progressGuard`)
- Krytyczna: nie
- Uproszczenie: tylko kierunek, bez oceny „za mało / za dużo”; tydzień deloadu bez oceny.

| ID | Ciężar poprzedni [kg] | Serie poprzednie [-] | Ciężar bieżący [kg] | Serie bieżące [-] | Oczekiwane: kierunek [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|---|---|---|
| RD-15-W1 | 100 | 3 | 110 | 3 | up | 0 | typowy | rachunek: 3 × 5 × 110 = 1650 > 1500 |
| RD-15-W2 | 100 | 3 | 100 | 3 | same | 0 | granica | rachunek: 1500 = 1500 |
| RD-15-W3 | 100 | 3 | 90 | 3 | down | 0 | poniżej | rachunek: 1350 < 1500 |
| RD-15-W4 | 100 | 3 | 105 | 3 | up | 0 | powyżej | rachunek: 1575 > 1500 |
| RD-15-W5 | 100 | 3 | 110 | 2 | up | 0 | typowy | D-113: tonaż 1100 < 1500, ale ciężar roboczy 110 > 100 = progres |
| RD-15-W6 | — | 0 | 100 | 3 | new | 0 | błąd | D-113: brak treningu w tygodniu porównawczym → „nowe” |
