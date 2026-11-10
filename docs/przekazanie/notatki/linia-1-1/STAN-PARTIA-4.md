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

## chest_press_machine (faza autora, 09/10.11.2026)

Zrobione (commit na gałęzi figury/partia-4-chest_press_machine): włączenie (families ready, LOAD, DATA_UI Wypychanie/Opuszczanie, łokieć), nakładka (4 elementy), próg toru łuku dźwigni z geometrii w `tests/figures-v2-tor.test.ts`,
test scenariuszowy `tests/figures-v2-nakladka-chest-press-machine.test.tsx`, pochodne i BRD. Zysk: +5 z 5 (symulacja bez zmian po włączeniu, pełna karta dopiero po recenzji).
Czerwone (dozwolone, brak wpisów recenzji): figury-recenzja (wpis v2), karty-recenzja (zestawy ogólne Incline/Decline/Smith); strona-eksport `pelna` ×2 (Machine Chest Press, Machine Shoulder Press: eksport a policz() — do zazielenienia po wpisach recenzji, do sprawdzenia).
Do recenzenta: v1 „Machine Chest Press” → zastapiona (K10); karty własne (K11): Machine Chest Press, Machine Shoulder Press; zestawy (K12): Incline, Decline (machinePress), Smith (ohp).
Pułapka: nowy plik testu musi być w indeksie git, inaczej `test-matrix` go nie widzi (isTracked).
