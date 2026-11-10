# Stan partii 2 (linia 1.1) — pushup_plank, hip_bridge, cable_row, mobility_floor, mobility_stand

Aktualizacja: 10.11.2026 ~00:45 UTC (sesja session_01T66VBydWMy3Mvkq6ew7xAZ, przekazanie przy kontekście ~28%) (przekazanie sesji leada partii przy kontekście 29,5%; poprzednia sesja: session_01T66VBx1RfrSnnQXw6gc6zC).
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

## Stan rodzin (10.11.2026 ~00:00 UTC, przekazanie z sesji session_01T66VBydWMy3Mvkq6ew7xAZ)
| Rodzina | Gałąź / SHA | Recenzja | Stan |
|---|---|---|---|
| hip_bridge | `figury/partia-2` @ 47141c11 | r3 wyswietlana, sha 8c56e365b9d3 (`partia2-hip_bridge-r3*`); Machine Hip Thrust wstrzymany (WYSOKIE r1 — prowadnica przez miednicę, nowy ślad dźwigni tego nie usuwa) | zrobione |
| cable_row | `figury/partia-2` | r2 wyswietlana (sha 4376c0e6b911); zestawy Single Arm i Leverage High r3 wyswietlana (e8bcb0ee335b) po poprawce row.fullStretch 0f069d93 | zrobione |
| pushup_plank | `figury/partia-2-pushup_plank` @ 355e8d2c (wypchnięta; autor b2231f90, r1 8e3be484, poprawki W1–W3 d9f1bc22 — inny programista, test `tests/figures-v2-pushup-plank-poprawki-r1.test.ts`) | r1 do poprawy (`partia2-pushup_plank-r1*`); skrót po poprawkach def6b97fe124 | NASTĘPNY KROK: r2 audytorem (różnica 8e3be484..d9f1bc22, arkusze Push Up/Mountain Climbers/Plyo/Shoulder Taps i wszystkie z prostymi nogami; ryzyka: Plyo krótki lot u 0,8–0,95, Single-Arm stopy 28 cm, sag zsuwa stopy 1–2 cm) → wpisy 1:1 → scalenie do partia-2 |
| mobility_floor | `figury/partia-2-mobility_floor` @ 8e98f323 (wypchnięta) | r1 do poprawy (`partia2-mobility_floor-r1*`, sha 0c88b49248f1): W1 Child's Pose ręce wzdłuż tułowia zamiast wyciągniętych przed siebie; Ś1 Side-Lying Quad rotacja ~59°, Ś2 Butterfly łokcie 6 cm od ud, N1–N3 (N3: MOB-F1 uzupełnić o n.hingeFlat i element `ref`) | NASTĘPNY KROK: poprawka W1 (programista nie-autor, test chwyt przed barkiem) → r2 → wpisy (4 zestawy wyswietlana, karty 4 wyswietlana + Child's Pose) → scalenie; nakładka pusta — wyjątek A (docs/18, MOB-F1, strażnik S20 z wyjątkiem) |
| mobility_stand | — | — | do zrobienia (bez ról mięśni, ślad tylko z przyrządem) |

## Następne kroki
1. pushup_plank: r2 → przepisanie wpisów 1:1 (v2, zestawy 9, karty Push Up/Plank/Mountain Climbers, v1 → zastapiona: Push Up, Incline Push Up, Plank, Mountain Climbers) → scalenie do `figury/partia-2`.
2. mobility_floor: po r1 (poprawki, jeśli WYSOKIE) → wpisy → scalenie do `figury/partia-2`.
3. mobility_stand (autor → r1 → poprawki → r2 → wpisy).
4. Przed każdym pushem partia-2: dociągnij origin/integracja-1-1; verify:szybkie (albo lekkie + testy celowane, gdy koordynator prosi o szybki SHA); push; zielony tests.yml; SHA do koordynatora (scala sam).
5. Raport końcowy do koordynatora.

## Pułapki tej sesji
- Maszyna 4 rdzenie: verify:szybkie + 2 programistów → load 15, testy padają na limicie czasu (squat-hinge, wstrzymane) i Jest agentów wisi. Najwyżej 1 programista w czasie verify.
- `figure.ts` ≤ 20 KB: przy wpisach V2_WSTRZYMANE skracaj komentarze.
- Scalając wpisy figury-recenzja.json — scalanie jako JSON (3-way po kluczach), kolejność v2 zmienia test recenzja-wyjatki-1-1.
- Cele 1.1 (`pokrycie-cele.json`) = wynik `node scripts/pokrycie-symulacja.mjs --json` (pole cel); docs/55 przeliczaj PO zmianie celów.

## Otwarte / do koordynatora
- Nowe teksty UI: brak (fazy z istniejących PhaseName) — przekład 0 zł.
- Cele pokrycia 1.1 obniżone o 1 (Machine Hip Thrust wstrzymany) w `docs/research/pokrycie-cele.json` (commit 8b4f6cab) — zgłoszone.
- Zestawy Single Arm Cable Row i Leverage High Row „do poprawy” (zdanie row.fullStretch, plik wspólny cueSets.ts) — wymaga decyzji koordynatora (plik wspólny).

- Pliki recenzenta, które audytor zapisuje w /home/user/trening, brudzą kopię roboczą przy verify — przenieś je do worktree rodziny (albo tymczasowo `.git/info/exclude`) przed verify.
- Koordynator scala partia-2 do integracji sam po SHA z zielonym tests.yml (47141c11 zielony, przebieg 42721902625 — zgłoszony).
- Gałęzie rodzin od 7dc265fb nie mają poprawek z partia-2: figure.ts < 20 KB przeniesiony ręcznie; przy scaleniu do partia-2 konflikty jak przy cable_row (rejestr nakładek, LOAD, mapping, strona-eksport n, gemini, recenzja-wyjatki, cele = symulacja).
