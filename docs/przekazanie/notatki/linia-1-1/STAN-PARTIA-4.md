# Stan partii 4 rodzin figur v2 (figury/partia-4)

Rodziny: dip, chest_press_machine, cable_press, back_extension, thruster. Gałąź od `origin/integracja-1-1` @ e97bd17b (09.11.2026).
Lead: session_01T66VBz37fikLrafFxEbBYK; koordynator: session_01T66VByJCWCao1Hw3is68Cy.
Briefy: `briefy/partia-4-autor.md` (programista rodziny, własny worktree i gałąź `figury/partia-4-<rodzina>`), `briefy/partia-4-recenzent.md` (audytor ≠ autor).

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą; pełna karta): chest_press_machine +5 (z 5), dip +5 (z 5), cable_press +4 (z 4), back_extension +3 (z 4), thruster +3 (z 3).

Stan 10.11.2026 ~03:30 UTC (gałęzie rodzin lokalnie, worktree w scratchpadzie sesji `wt-<rodzina>`; po restarcie kontenera worktree przetrwały):

| Rodzina | Gałąź @ SHA | Recenzja | Stan / następny krok |
|---|---|---|---|
| dip | figury/partia-4-dip @ e720a87c | r1–r4 (`partia4-dip-r*`); r4 wyswietlana 4/5, sha eec289f04568 | ławka w V2_WSTRZYMANE (W5, limit shSag; P4-DIP-1, decyzja koordynatora w docs/18), zestaw Dip Machine do poprawy (W3 wariant A, P4-DIP-2), cel 1.1 pelnaKarta 456; przepisanie wpisów r4 1:1 w toku |
| chest_press_machine | figury/partia-4-chest_press_machine @ e039882 | r1 do poprawy (W1 Decline, W2 MSP, Ś1) → poprawki e039882 | r2 audytora w toku; zestaw Smith (ohp.seat) do poprawy → backlog; zmiana testu toru progDzwigni (osobny commit przy scaleniu, suma z partią 1) |
| cable_press | figury/partia-4-cable_press @ 1b6e2ee4 | r2 wyswietlana, sha c79df483b2da (`partia4-cable_press-r2*`) | przepisanie wpisów 1:1; NISKIE z r1 → backlog |
| back_extension | figury/partia-4-back_extension (niezacommitowane) | — | autor w toku |
| thruster | figury/partia-4-thruster (niezacommitowane) | — | autor w toku |

Model pracy: autor (programista) → audytor r1 → poprawki innego programisty → r2… → przepisanie 1:1 → scalenie gałęzi rodzin do figury/partia-4 (konflikty w listach wspólnych: overlay.ts, poseData.ts, families, mapping, strona-eksport n, gemini, skrot-v2-wynik, rejestr nakładek, W_ZAKRESIE, pliki generowane — suma) → cel = symulacja → verify:szybkie → push → tests.yml.
Pułapki: figure.ts ≤ 20 KB (wstrzymania); autorzy nie oglądali wszystkich arkuszy — recenzja znajdowała dłonie poza podporą (testy „podpory” z negatywem w każdej rodzinie); 4 rdzenie — najwyżej 3–4 agenty.
