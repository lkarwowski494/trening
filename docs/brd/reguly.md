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
- Wzór: `RIR = 10 − RPE` dla RPE od 5 do 10 (RIR od 0 do 5); RPE poniżej 5 w skali RIR to „lekko” (RIR 6+), zapisywane jako RPE 4
- Jednostki: RPE [-], RIR [-]
- Granica: RPE ≥ 5 (włącznie) przelicza się na RIR 0–5; RIR powyżej 5 = „lekko”
- Podstawa: S-01, S-02
- Krytyczna: nie
- Uproszczenie: dane zawsze w RPE, RIR to sposób wyświetlenia i wpisu (`lib/state/effort.ts`); granica „lekko” z zapisu audytu kontrolnego 1 (MER2-08).

| ID | RPE [-] | Oczekiwane: RIR [-] | Tolerancja | Rodzaj | Pochodzenie |
|---|---|---|---|---|---|
| RD-02-W1 | 8 | 2 | 0 | typowy | rachunek: 10 − 8 |
| RD-02-W2 | 5 | 5 | 0 | granica | rachunek: 10 − 5; najniższe RPE przeliczane na RIR |
| RD-02-W3 | 4,5 | 6 | 0 | poniżej | S-02: poniżej RPE 5 opisy słowne („lekko”); wartość 6 = RIR_MAX + 1 (pokazywane „6+”) |
| RD-02-W4 | 10 | 0 | 0 | powyżej | rachunek: 10 − 10 |
| RD-02-W5 | 11 | 0 | 0 | błąd | rachunek: wartość poza skalą 1–10 ograniczona do zakresu (RIR 0) |

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
