# Stan partii 2 (linia 1.1) — pushup_plank, hip_bridge, cable_row, mobility_floor, mobility_stand

Aktualizacja: 09.11.2026 ~22:40 UTC (sesja session_01T66VBydWMy3Mvkq6ew7xAZ); poprzednio ~21:10 UTC (przekazanie sesji leada partii przy kontekście 29,5%; poprzednia sesja: session_01T66VBx1RfrSnnQXw6gc6zC).
Koordynator linii: session_01T66VByJCWCao1Hw3is68Cy (raporty przez send_message).
Briefy: `briefy/partia-2-rodzina-programista.md` (autor rodziny), `briefy/partia-2-rodzina-recenzent.md` (audytor).

## Model pracy partii (sprawdzony na 2 rodzinach)
Lead nie pisze rodziny ani nie recenzuje. Kolejno: (1) programista-autor (subagent `programista`) we własnym worktree → SHA;
(2) audytor (subagent `audytor`) na zamrożonym SHA w worktree odłączonym → pliki `docs/research/recenzje/partia2-<rodzina>-r<N>*.md/json`;
(3) poprawki WYSOKIE — inny programista (nie autor) z testem odtwarzającym; ŚREDNIE/NISKIE → backlog docs/21;
(4) r2 tym samym audytorem (różnica, cmp arkuszy, skrót własny); (5) lead przepisuje 1:1 do `docs/research/figury-recenzja.json`
(v2, zestawy, karty, v1 → zastapiona; wpis „do poprawy” wymaga pola `poprawka` — test karty-recenzja), test `recenzja-wyjatki-1-1` (lista rodzin), pochodne.
Pułapki: pliki recenzenta zapisuj w worktree, którego dotyczą (inaczej brudzą znacznik verify innej gałęzi); `figure.ts` ma limit 20 KB (architecture-limits);
BRD bez liczb czasu bez odwołania (test M1-022); w docs/ bez adresów e-mail (public-repo); włączenie zawsze rusza testy: mapping, strona-eksport (n),
nakladka-triceps-olympic (rejestr), skrot-v2-wynik (regex nakładek), gemini-polecenia (liczba rodzin planned).
Pomiar czasu: autor rodziny Ś ok. 40–90 min, recenzja r1 10–14 min, poprawki 15–20 min, r2 4–5 min, przepisanie + verify:szybkie ok. 40 min (verify ~25 min).

## Stan rodzin (09.11.2026 ~22:40 UTC, sesja session_01T66VBydWMy3Mvkq6ew7xAZ)
| Rodzina | Gałąź / SHA | Recenzja | Stan |
|---|---|---|---|
| hip_bridge | `figury/partia-2` @ 3a80c913 | r2 wyswietlana (sha 0d9b2af823b2); po scaleniu slad-dzwignia skrót 8c56e365b9d3 → recenzja różnicy r3 (audytor) w toku | rodzina ukryta do wpisu r3 |
| cable_row | scalona do `figury/partia-2` (77676562) | r2 wyswietlana, sha 4376c0e6b911 (bez zmian po scaleniach) | zrobione |
| pushup_plank | `figury/partia-2-pushup_plank` (worktree scratchpad/wt-pushup_plank, od 7dc265fb) | — | autor w toku |
| mobility_floor | `figury/partia-2-mobility_floor` @ 7fe3c0e6 (od 7dc265fb) | — | autor niedokończony: nakładka pusta (wyjątek A, koordynator 09.11, docs/18, MOB-F1); brak: testy strona-eksport (pelna==policz, 8 ćw.), gemini 31→30, skrot-v2-wynik, fix4, cel-1-1; pomiar Cat-Cow (ruch ledwo widoczny), K4–K8, lista v1 → nowy programista |
| mobility_stand | — | — | do zrobienia |

## Następne kroki
1. Wpis r3 hip_bridge 1:1 z `docs/research/recenzje/partia2-hip_bridge-r3.json` → verify:szybkie → push `figury/partia-2` → tests.yml.
2. Poprawka cueSets row.fullStretch (zgoda koordynatora 09.11: CUE_REQUIRES/CUE_NOT_IN_FAMILY dla Single Arm Cable Row i Leverage High Row; osobny commit, test regresji, wpis docs/18; sha → koordynator dla P-1) + recenzja zestawów; Leverage High Row oś u góry → backlog docs/21 z ID.
3. mobility_floor dokończenie (nowy programista), pushup_plank → recenzje → scalenie do partia-2 (konflikty: overlay.ts, poseData.ts, mapping, nakladka-triceps-olympic, skrot-v2-wynik, strona-eksport n, gemini, recenzja-wyjatki, cel 1.1 = symulacja).
4. mobility_stand; raport końcowy.

## Pułapki tej sesji
- Maszyna 4 rdzenie: verify:szybkie + 2 programistów → load 15, testy padają na limicie czasu (squat-hinge, wstrzymane) i Jest agentów wisi. Najwyżej 1 programista w czasie verify.
- `figure.ts` ≤ 20 KB: przy wpisach V2_WSTRZYMANE skracaj komentarze.
- Scalając wpisy figury-recenzja.json — scalanie jako JSON (3-way po kluczach), kolejność v2 zmienia test recenzja-wyjatki-1-1.
- Cele 1.1 (`pokrycie-cele.json`) = wynik `node scripts/pokrycie-symulacja.mjs --json` (pole cel); docs/55 przeliczaj PO zmianie celów.

## Otwarte / do koordynatora
- Nowe teksty UI: brak (fazy z istniejących PhaseName) — przekład 0 zł.
- Cele pokrycia 1.1 obniżone o 1 (Machine Hip Thrust wstrzymany) w `docs/research/pokrycie-cele.json` (commit 8b4f6cab) — zgłoszone.
- Zestawy Single Arm Cable Row i Leverage High Row „do poprawy” (zdanie row.fullStretch, plik wspólny cueSets.ts) — wymaga decyzji koordynatora (plik wspólny).
