# Stan partii 2 (linia 1.1) — pushup_plank, hip_bridge, cable_row, mobility_floor, mobility_stand

Aktualizacja: 09.11.2026 ~21:10 UTC (przekazanie sesji leada partii przy kontekście 29,5%; poprzednia sesja: session_01T66VBx1RfrSnnQXw6gc6zC).
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

## Stan rodzin
| Rodzina | Gałąź / SHA | Recenzja | Wpisy | Stan |
|---|---|---|---|---|
| hip_bridge | `figury/partia-2` @ 50c7b17b (autor ddb6cbae/4572d987, poprawki 8b4f6cab, wpisy 93e7cde9) | r1 do poprawy (1 WYSOKIE), r2 wyswietlana (`partia2-hip_bridge-r2*`) | v2 sha 0d9b2af823b2, 9 ćw.; Machine Hip Thrust w V2_WSTRZYMANE | zrobione; verify:szybkie zielone (10122) |
| cable_row | `figury/partia-2-cable_row` @ d1b21532 (wypchnięta; autor 10fc587d, poprawki 4fbf144e, wpisy 57dbf7c5) | r1 do poprawy (2 WYSOKIE: kąt linki), r2 wyswietlana (`partia2-cable_row-r2*`) | v2 sha 4376c0e6b911, 9 ćw. | zrobione; verify:lekkie zielone; DO SCALENIA do partia-2 |
| pushup_plank | — | — | — | do zrobienia od zera (próba autora przerwana przy przekazaniu, zmiany odrzucone) |
| mobility_floor | — | — | — | do zrobienia (bez ról mięśni — docs/18 04.11.2026 (4) B) |
| mobility_stand | — | — | — | do zrobienia (j.w.) |

## Następne kroki (kolejność)
1. Scal `origin/figury/partia-2-cable_row` do `figury/partia-2` (konflikty: rejestr overlay.ts, poseData LOAD/DATA_UI, families.ts, testy mapping/strona-eksport n/nakladka-triceps-olympic/skrot-v2-wynik/gemini/recenzja-wyjatki — suma obu rodzin; figury-recenzja.json — suma wpisów; pliki generowane — przelicz generatorami). strona-eksport n = 192 + 9 = 201 (sprawdź testem).
2. Dociągnij `origin/integracja-1-1` (zawiera figury/slad-dzwignia 55c9f206 — ślad maszyn = punkt styku dźwigni — oraz delt_raise i nową symulację pokrycia: karty „do poprawy” się nie liczą). Sprawdź `git merge-base --is-ancestor 55c9f206 origin/integracja-1-1`. Po scaleniu `node scripts/zrodla-runtime.mjs --skroty`: jeśli skróty hip_bridge/cable_row się zmienią — recenzja różnicy (audytor; arkusze przed/po, cmp) i nowe wpisy; przy okazji ślad Machine Hip Thrust (wstrzymany) i decyzja o poprawce prowadnicy (backlog docs/21, sekcja hip_bridge r1).
3. verify:szybkie → push `figury/partia-2` → zielony tests.yml.
4. pushup_plank (30 ćw.; 6 bez pozy — nie dorabiać, lista do leada/koordynatora; rollouty), potem mobility_floor, mobility_stand — wg modelu wyżej; 2 programistów naraz max.
5. Raport końcowy do koordynatora (SHA, tests.yml, per rodzina, pliki recenzji, sha wpisów, szacunek przekładu — dotąd 0 nowych tekstów UI, otwarte pytania).

## Otwarte / do koordynatora
- Nowe teksty UI: brak (fazy z istniejących PhaseName) — przekład 0 zł.
- Cele pokrycia 1.1 obniżone o 1 (Machine Hip Thrust wstrzymany) w `docs/research/pokrycie-cele.json` (commit 8b4f6cab) — zgłoszone.
- Zestawy Single Arm Cable Row i Leverage High Row „do poprawy” (zdanie row.fullStretch, plik wspólny cueSets.ts) — wymaga decyzji koordynatora (plik wspólny).
