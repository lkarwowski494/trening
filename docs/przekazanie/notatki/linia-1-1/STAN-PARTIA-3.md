# Stan partii 3 rodzin figur v2 (figury/partia-3) — 09.11.2026, przekazanie (kontekst sesji > 30%)

Rodziny: pulldown, shrug, hip_abd_add, leg_machine, glute_floor. Gałąź od `origin/integracja-1-1` (aeabf69a), scalona z `figury/slad-dzwignia` (D1 A, 458e5766). Brief partii: prompt startowy sesji partii 3 (koordynator linii 1.1, session_01T66VByJCWCao1Hw3is68Cy).

## Rodziny (wpisy v2 w docs/research/figury-recenzja.json, skróty z `node scripts/zrodla-runtime.mjs --skroty`)
| Rodzina | Stan | Skrót v2 | Recenzje (docs/research/recenzje/) |
|---|---|---|---|
| pulldown | wyswietlana 8/8 | 335199eb4c79 | p3-pulldown-audytor (r1: N1 WYSOKIE), p3-pulldown-r2 (N1 naprawione) |
| shrug | wyswietlana 8/8 | cf2edb2c70fe | p3-shrug-audytor (r1: W1–W4 WYSOKIE), p3-shrug-r2 |
| hip_abd_add | wyswietlana 4/8 (Lateral Band Walk, Monster Walk bez rysunku — backlog) | eddcd1af9d43 (po D1) | p3-hip-abd-add-audytor, -r2, -r3 |
| leg_machine | wyswietlana 6/8 (Calf Press, Smith Machine Leg Press — wyjątki) | 39d2c2b68d32 | p3-leg-machine-audytor |
| glute_floor | planned — brak reguły „ustalone” z przypisanym zdaniem karty (nakładka niemożliwa); badacz w drugiej turze koordynatora | — | — |

Wszystkie recenzje: audytor (subagent), autor ≠ recenzent; ŚREDNIE/NISKIE w docs/21 („Backlog 1.1.x — figury: partia 3”).

## Decyzje (docs/18, 09.11.2026)
- D1 A (koordynator): ślad dźwigni = punkt styku — gałąź `figury/slad-dzwignia` zielona (tests.yml 42693069750), koordynator scalił do integracji lokalnie (55c9f206).
- D2 A (koordynator): EN „Ściąganie” = „Pulling” (+ kontekst tłumaczy; _source.json przeliczony).
- Partia: szrugsy w bez_bramki_ruchu + reguła rece_proste; marsze z gumą bez rysunku; kąt ukryty hip_abd_add.
- Cel 1.1 (wariant A zatwierdzony przez koordynatora do weta): pokrycie-cele.json z symulacji po wstrzymaniu marszów — pelnaKarta 457 → 456, figura.v2 533 → 531; powrót do 457 po poprawce marszów. **Do zrobienia: wpis w docs/18 tej decyzji koordynatora (odrzucone B, pola wdrożenie/test/wykonalność) i ID w backlogu docs/21 z warunkiem powrotu celu.**

## Stan po sesji kontynuacji (09.11.2026 wieczorem)
- Zrobione: test `gemini-polecenia` „czeka na kontrakt” (shrug przestawiona w fixture na „do zrobienia”); scalenie `origin/integracja-1-1` bb1072f3 (delt_raise) i 55c9f206 (ślad dźwigni — już w gałęzi); skróty 12 rodzin v2 oraz wszystkich wpisów kart/zestawów równe wynikowi `--skroty` (bez recenzji różnicy); cel 1.1 z symulacji na wspólnym stanie (pelnaKarta 456, figura.v2 532 — wpis docs/18 i backlog P3-MARSZ); `verify:szybkie` zielone (a0b687d4, 17339 testów).
- Pokrycie (tests/fixtures/pokrycie-katalogu.json): integracja 55c9f206 figura.v2 214, pełna karta 210 → po partii 239 / 234 (pulldown 7/7, shrug 7/8 — Middle Back Shrug bez ról, hip_abd_add 4/8, leg_machine 6/8, glute_floor 0/7).
- Zostało: zielony `tests.yml` na głowie gałęzi, raport do koordynatora; otwarte: glute_floor (badacz), P3-MARSZ (powrót celu 457), „Ściąganie” w innych językach — recenzent lokalizacji.

## Pułapki
- `test-matrix --write` i `readme --write` po każdej zmianie tytułu testu/licznika — inaczej verify pada na końcu (ok. 25 min).
- figury-sens.json ręcznie formatowany — edycje tekstowe, nie json.dump; pokrycie-cele.json: `poza11` w jednej linii.
- Zestaw ogólny bez wpisu „zestawy” → nakładka nie rysuje się (strażnik kazda-rodzina); pole `rodzina` wpisu zestawu = wzorzec z cue-sets.json (`f`), nie rodzina figury.
- Pole `liczba` we wpisie v2 = liczba ćwiczeń rodziny w katalogu (nie z rysunkiem).
- Raporty recenzentów nie mogą zawierać ścieżek /tmp (public-repo SEC2-08).
