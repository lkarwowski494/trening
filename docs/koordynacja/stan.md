# Koordynacja Trening (linia 1.1) — stan (aktualizacja 2026-11-10 05:30 UTC)

Migracja na M9 (D-056) z koordynatora bez roli: session_01T66VByJCWCao1Hw3is68Cy. Dawne pliki stanu: `docs/koordynacja/archiwum/` (dziennik nocy, przekazania noc4/noc5, diagnoza nocnych testów) — źródło szczegółów.

## Mandat (przepisuj bez zmian; zmienia go tylko właściciel)
- Tryb decyzji: analogia (tryb nocny) — od 2026-11-09 ~19:30 UTC, słowa (docs/18:346 na integracja-1-1): „koordynator podejmuje wszystkie decyzje zgodnie z tym, co i tak by zarekomendował (zapis każdej w docs/18 z datą i odrzuconymi wariantami, do weta rano); prace zleca innym sesjom/agentom, sam tylko koordynuje; sesje wykonawcze nie przekraczają 30% limitu kontekstu”. Rano właściciel może przywrócić tryb „właściciel” — [DO USTALENIA] po raporcie 05:00.
- Repo portfela do analogii (odczyt): brak użytych tej nocy (decyzje wg rekomendacji); dostępne: lkarwowski494/techniqueatlas.
- Zgody trwałe:
  - przekład API partii rodzin 1.1 do 30 USD łącznie (właściciel 09.11.2026, ZB-057 w docs/zobowiazania.md; wydane 0 USD);
  - scalanie gałęzi do `integracja-1-1` po zielonym tests.yml (scripts/scal-galaz.mjs) — model pracy z CLAUDE.md;
  - zmiany workflowów: koordynator scala sam po przebiegu dowodowym (CLAUDE.md, właściciel 21.10.2026).
- Zawsze za zgodą: push i scalenie na `main`, App Store Connect, TestFlight, publikacja, usuwanie gałęzi i danych, force-push, koszty stałe, wiadomości do ludzi, koszt API ponad pułap; nigdy --no-verify.
- Pułapy kosztu: API przekładu 30 USD (ZB-057). Pułap kosztu sesji i doby: [DO USTALENIA] (nieustalony; noc 09/10.11 ≈ 340 USD równowartości w limicie subskrypcji; limit tygodniowy konta allowed_warning, reset 2026-11-15 16:00 UTC).
- Koordynator aktywny: session_01T66VBw1AX38pLShXPH7rmy (od 2026-11-10 05:20 UTC; poprzednik session_01T66VByJCWCao1Hw3is68Cy). Rola M9 niezłożona z biblioteki: add_repo lkarwowski494/prompts odrzucony przez klasyfikator 05:16 — prośba do właściciela; do zgody bez nowych sesji podrzędnych (tylko odbiory, scalenia, zlecenia istniejącym sesjom).
- Środowisko: environment_id env_016cjV5XopwCaywxTR2x8qwp, model claude-opus-5-5, wysiłek medium, permission_mode auto; repo sesji: lkarwowski494/trening, techniqueatlas, prompts.
- Gałąź robocza: `integracja-1-1` (scalanie: `NODE_USE_ENV_PROXY=1 node scripts/scal-galaz.mjs <gałąź>`); gałąź stanu: `koordynacja` (nigdy nie scalana).

## Teraz
- Integracja `dfaeeef` (zielona, 42760295218): + pociąg-3 (figury/partia-1, Jest 5 części + sekwencer, KO-012). Pokrycie sprzed pociągu-3: pełna karta 252/455, figura v2 257/531 (po pociągu-3 — do odczytu z symulacji).
- P-4: thruster r2 czysty → po nim `scal/pociag-4` = integracja dfaeeef + figury/partia-4 + figury/partia-2 @ 7a09818f + wpis docs/18 o zmianie CI (KO-012); zlecone 05:28.
- P-5: kontekst ~32% (> 30%) — polecono STAN-AGENTA.md i raport końcowy; następca wymaga nowej sesji → zablokowane do zgody właściciela na add_repo prompts (rola M9).

## Sesje
| Litera | ID | Rola, tryb | Gałąź @ SHA | Kontekst % | Koszt USD | Stan |
|---|---|---|---|---|---|---|
| P-4 | session_01T66VByqWgLJQQccrmCXLmn | programista partii 4 (tura 2): dip, chest_press_machine, cable_press, back_extension, thruster | figury/partia-4 @ 3bcd294c (tests.yml 42759957551 zielony) | 17 (05:16) | 17 | aktywna: thruster → pociąg-4 |
| P-5 | session_01T66VByZrLpWxNF8yF3gpgu | programista partii 5: forearm, carry, core_hang, rotator_cuff, kneeling_hinge (+glute_floor) | figury/partia-5 | 32 (05:16) | 56 | kończy: STAN-AGENTA.md + raport (05:18); następca po zgodzie właściciela |
| P-2 | session_01T66VBvdsMU66FhsPJWpG8J | lead partii 2 | figury/partia-2 @ 7a09818f | 30 | 26 | zakończona (raport końcowy) → do archiwizacji po scaleniu |
| P-1 | session_01T66VBx7QqXRjB2JpVi4Kww | lead partii 1 | figury/partia-1 @ 9d6f35b3 — scalona (pociąg-3, dfaeeef) | 31 | 17 | zakończona → do archiwizacji |
| — | session_01T66VBzk52zTw31SRXRs8To | lead partii 3 | scalona f7c2e0ed | 22 | 1 | zakończona, scalona → do archiwizacji |
| — | starsze sesje partii (przekazane): P-1 …VBw2eKcS22XQSJG4qft, …VBzsYzRKDwnh7aast4Y, …VBxNaAEefAUfCL8vLG1; P-2 …VBx1RfrSnnQXw6gc6zC, …VBydWMy3Mvkq6ew7xAZ; P-3 …VBzsqbUGWibKL85ugBA; P-4 …VBz37fikLrafFxEbBYK | — | — | — | patrz koszty.md | przekazane → do archiwizacji |

Koszty sesji: get_session każdej przed archiwizacją → koszty.md.

## Plan 24 h (UTC, 10.11)
| Kiedy | Co | Kto | Zależy od | Od właściciela |
|---|---|---|---|---|
| 05:25 | pociąg-3 scalony (dfaeeef) | koordynator | — | — |
| 06:00–09:00 | pociąg-4: partia-4 (z thrusterem) + partia-2 + wpis docs/18 CI → CI → scalenie | P-4 | thruster | — |
| 10:00–12:00 | raporty końcowe P-4, P-5 → scalenia (pociąg) | P-4, P-5 | — | — |
| od ~12:00 | tura 3 (~10 rodzin: core_standing, core_floor, cardio, plyo, sled_throw, strongman, neck, foam_roll, glute_floor, reszta lunge/leg_isolation) — liczba sesji wg decyzji C | nowe sesje partii (wzór: polecenia/prompt-p5.md) | decyzja C | decyzja C |
| po turze 3 | przekład nowych tekstów (ZB-057), recenzja lokalizacji zbiorcza, zadania przed 1.1 (niżej), audyt, E2E | — | — | Approve TF |
| 14:00 | linia dzienna | koordynator | — | — |

## Czeka na właściciela (raport 05:00 w czacie poprzednika)
- A. Nocne testy: 12 czerwonych — poprawki CI tylko na integracji, noc biegnie na `main`. Rekomendacja: PR z samymi poprawkami CI na `main` (58d36cc3, fbfe6211, 2fe8bc89, 983d44e8, 944d4e00) po przebiegu dowodowym; B: czekać na 1.1; C: ręczny dispatch na integracji. Szczegóły: archiwum/nocne-diagnoza.md.
- B. Reguła „każda rodzina ma nakładkę” — 2 wyjątki (mobility_floor, kneeling_hinge). Rekomendacja A: wyjątki + badacz w turze 3; B: zmiana reguły.
- C. Tempo vs limit tygodniowy (reset 15.11 16:00): rekomendacja A: tura 3 w 2 sesjach; B: 3–4 sesje.
- D. Model scaleń „pociąg” (gałąź zbiorcza od integracji, kilka gałęzi, jeden przebieg CI). Rekomendacja: przyjąć.
- Weto decyzji nocnych: decyzje.md (KO-001…KO-014) + wpisy docs/18 z 09–10.11.
- Rezerwacja nazwy RepsGoat w ASC: w docs/48 nie znaleziono wpisu — [DO USTALENIA], sprawdzić u źródła.

## Zadania przed wydaniem 1.1 (nowe tej nocy)
Straight Raises on Incline Bench (delt: kolana do tyłu, siedzisko przenika 6 cm) — poprawka pozy + recenzja; fidr.move (Front Incline DB Raise) → cel +1; dług ROZJAZDY_POZA_ZAKRESEM (tests/figury-generator-odtwarza.test.ts); recenzja lokalizacji zbiorcza (nachwyt sv/da/nb/ru/vi/nl, „Ściąganie”, lv kettlebell); badacz: lokcie_pod_dlonmi w środku toru ohp, glute_floor, pewność reguł mobility_floor/kneeling_hinge; silnik: punkty dźwigni barki/uda (calf), gear.ts obrót dzwonu (kb); P3-MARSZ; PP-W1 (Plyo).

## Przypomnienia
- kontrola 05:48 (trig_01CT9juz5s4czi8ps7pbthwy), linia 14:00 (trig_012jZbxFGm92mJXokNSoFwij), linia 05:00 11.11 (trig_01A25uUmLKjihGZ24ESTLauB).

## Pule numerów decyzji
- Decyzje aplikacji: wpisy datowane w docs/18 (bez numerów D-NNN). KO następny: KO-015. Lekcje: `## L-NNN` nadaje koordynator przy scaleniu (`node scripts/numeruj-lekcje.mjs`).

## Dziennik
| UTC | Sesja | Zdarzenie z dowodem | Następny krok |
|---|---|---|---|
| 2026-11-09 19:30–2026-11-10 05:00 | koordynator …VByJCWCao1Hw3is68Cy | noc: archiwum/dziennik-noc-2026-11-09.md (scalenia z run ID) | — |
| 2026-11-10 03:15 | integracja | 1d6352ba wypchnięta (P1; tests.yml 42747238449 na gałęzi pociąg-2) | — |
| 2026-11-10 05:15 | koordynator | migracja na M9: gałąź `koordynacja` | przekazanie następcy M9 |
| 2026-11-10 05:20 | koordynator …VBw1AX38pLShXPH7rmy | przejęcie; „PRZEJĄŁEM” do poprzednika; P-4, P-5 poinformowane; add_repo prompts odrzucony | prośba do właściciela |
| 2026-11-10 05:25 | integracja | scal/pociag-3 c1ffb654 → dfaeeef (tests.yml 42760295218 zielony; drzewo = c1ffb654, verify:lekkie) | pociąg-4 (P-4) |
