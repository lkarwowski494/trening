# Stan partii 2 (linia 1.1) — pushup_plank, hip_bridge, cable_row, mobility_floor, mobility_stand

Aktualizacja: 10.11.2026 ~04:30 UTC (sesja session_01T66VBvdsMU66FhsPJWpG8J, przekazanie przy kontekście ~28%); wcześniej 00:45 UTC (session_01T66VBydWMy3Mvkq6ew7xAZ) (przekazanie sesji leada partii przy kontekście 29,5%; poprzednia sesja: session_01T66VBx1RfrSnnQXw6gc6zC).
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

## Stan rodzin (10.11.2026 ~03:40 UTC, sesja session_01T66VBvdsMU66FhsPJWpG8J)
Wszystkie 5 rodzin zrecenzowane niezależnie i scalone do `figury/partia-2` (gałęzie rodzin też scalone; lokalnie — po pushu partia-2 są w jej historii).
| Rodzina | Recenzja (pliki `docs/research/recenzje/partia2-<rodzina>-r*`) | Stan |
|---|---|---|
| hip_bridge | r3 wyswietlana 8c56e365b9d3 (Machine Hip Thrust wstrzymany) | zrobione |
| cable_row | r2 wyswietlana 4376c0e6b911 | zrobione |
| pushup_plank | r3 wyswietlana ec660bfe52fa (różnica 816a480c: wiersze błędu plank.mis.sag pod strażnik p2-r3); Plyo Push-Up wstrzymany (V2_WSTRZYMANE, PP-W1, koordynator 10.11.2026 B) | zrobione |
| mobility_floor | r2 wyswietlana a80c9c3d7928 (W1 Child's Pose ręce przed sobą; nakładka pusta — wyjątek A, także w figures-v2-nakladka-kazda-rodzina) | zrobione |
| mobility_stand | r2 wyswietlana 8ebfcea965c8 (W1 Soleus ściana; nakładka standLateralPlumb, decyzja sb.plane w docs/18) | zrobione |

## Następne kroki
1. Decyzje koordynatora 10.11.2026 wdrożone: P1 = B (Plyo do V2_WSTRZYMANE, 5a5be01d; UWAGA do potwierdzenia przez koordynatora: strażnik r4-W1 w figures-v2-delt-raise-p4 pomija klucze z V2_WSTRZYMANE + test, że poza nim jest dokładnie Plyo bez rysunku), P2 = A (R3 akceptuje ręce przed sobą — źródła karty mobility_floor.t.child.reach: ACE #227 krok 2, CT Children's HEP, WebMD/ColumbiaDoctors; 885bb07c).
2. Jeśli `verify:szybkie` na 4966049c (lub nowszym) zielony → push → zielony tests.yml → raport końcowy do koordynatora. Jeśli czerwony — poprawki jak wyżej (zmiana pozy = recenzja różnicy).
3. Raport końcowy: 5 rodzin włączonych i zrecenzowanych; pełnych kart (pokrycie-katalogu) 239 → 279; cele 1.1 = symulacja (pelnaKarta 461); nowe teksty UI: brak, przekład 0 zł; backlog: PP-S1, PP-S2, PP-N1, PP-W1, MOB-F1–F3, MOB-S1–S2.

## Pułapki tej sesji
- Integracja przynosi nowe strażniki (p2-r3, p2-r4, delt-raise-p4, mobilnosc-reguly) — po każdym dociągnięciu pełne verify:szybkie; zmiana pozy = nowy skrót = recenzja różnicy.
- Skrypty pomocnicze leada w scratchpadzie (giną z kontenerem): przepisanie wpisów r→figury-recenzja.json (v2 nadpisz, zestawy/karty dopisz, v1_zastapiona → werdykt zastapiona + kto „nie recenzowana jako v1…”, usuń uwagi/stan); scalenie figury-recenzja.json jako 3-way po kluczach sekcji.
- Pole `stan` wpisu v2 musi zaczynać się od „zrecenzowana niezależnie” (l047).
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

## mobility_stand — faza AUTOR (10.11.2026, programista; bez wpisów recenzji)
Zrobione: rodzina `ready` (families.ts), LOAD + DATA_UI (poseData.ts; fazy nieużywane — wszystkie 8 ćwiczeń to ISOMETRIC; hideAngle dla 5 ćwiczeń górą ciała, kolano mierzone w 3 łydkowych), nakładka `overlay/mobility_stand.ts` (jeden element: pion od miednicy, tylko Standing Lateral Stretch z przodu, reguła sklon_boczny_statyczny / cue sb.plane),
`data/zrodla/figury-sens.json` mobility_stand: dopisane `wskazowki_na_reguly["sb.plane"] = ["sklon_boczny_statyczny"]` (reguła ma to cue w danych; brakowało wpisu odwrotnego — DO POTWIERDZENIA przez leada), test `tests/figures-v2-nakladka-mobility-stand.test.tsx`, testy dostosowane (mapping, nakladka-triceps-olympic rejestr 11 rodzin, skrot-v2-wynik regex, strona-eksport n=240), BRD, pochodne (macierz, pokrycie-katalogu, README).
Zostało (po recenzji, robi lead): wpisy v2 / zestawy (Standing Chest, Standing Gastrocnemius, Standing Lateral) / karty własne (Chin To Chest, Side Neck, Overhead Triceps, Wall Calf, Soleus) w figury-recenzja.json, potem `node scripts/zrodla-runtime.mjs --write` (dopiero wtedy powstaje wpis mobility_stand w reguly-cwiczen.json i element nakładki zaczyna się rysować przez techniquesOf), pokrycie-katalogu, macierz, README.
Czerwone do czasu wpisów: figury-recenzja (v2 ready), strona-eksport `pelna` (6 ćwiczeń z kartami własnymi/gcalf), oraz `figures-v2-nakladka-kazda-rodzina` (mobility_stand: element wybiera się przez zestaw ogólny Standing Lateral Stretch → dopiero po wpisie „zestawy”; NIE jest na liście dozwolonych czerwonych — do decyzji leada).
Pułapki: figury-generator-odtwarza ma wyjątek dla Standing Gastrocnemius (ACG-013, plik póz ma stopień; generator nie) — bez zmian; w arkuszach rodzina statyczna = 21 identycznych klatek (do oglądu użyj jednej klatki).
