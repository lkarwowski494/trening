# Stan partii 4 rodzin figur v2 (figury/partia-4)

Rodziny: dip, chest_press_machine, cable_press, back_extension, thruster. Gałąź od `origin/integracja-1-1` @ e97bd17b (09.11.2026).
Lead: session_01T66VBz37fikLrafFxEbBYK; koordynator: session_01T66VByJCWCao1Hw3is68Cy.
Briefy: `briefy/partia-4-autor.md` (programista rodziny, własny worktree i gałąź `figury/partia-4-<rodzina>`), `briefy/partia-4-recenzent.md` (audytor ≠ autor).

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą; pełna karta): chest_press_machine +5 (z 5), dip +5 (z 5), cable_press +4 (z 4), back_extension +3 (z 4), thruster +3 (z 3).

| Rodzina | Stan | Skrót v2 | Recenzje |
|---|---|---|---|
| dip | autor w toku | — | — |
| chest_press_machine | autor w toku | — | — |
| cable_press | czeka | — | — |
| back_extension | czeka | — | — |
| thruster | czeka | — | — |

## thruster (autor, 10.11.2026)
- Zrobione: commit `thruster:` na gałęzi figury/partia-4-thruster — włączenie (ready, LOAD, DATA_UI „Podnoszenie”), pętla jednokierunkowa, nakładka (thrusterBackRef, thrusterBarCloseRef tylko Clean and Press), testy `tests/figures-v2-thruster.test.tsx`, BRD, pochodne.
- Zostało: wpisy recenzji v2/karty/zestawy (przepisuje po recenzji niezależnej); zestaw ogólny Clean and Press (oly.back, oly.close, ohp.tall) — element nakładki rysuje się dopiero po wpisie „zestawy”; v1 → zastapiona: brak wpisów v1 dla tych ćwiczeń.
- Pułapki: `test-matrix --write` widzi tylko pliki w indeksie git (najpierw `git add`); strona-eksport „pelna” będzie czerwone dla Thruster (hantle) i Kettlebell Thruster do czasu wpisu recenzji (policz() liczy z prawdziwego pliku recenzji, test z zapisem zastępczym).
