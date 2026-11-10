# Koordynacja Trening (linia 1.1) — stan (aktualizacja 2026-11-10 05:15 UTC)

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
- Koordynator aktywny: session_01T66VByJCWCao1Hw3is68Cy (do przekazania 2026-11-10 ~05:20 UTC)
- Środowisko: environment_id env_016cjV5XopwCaywxTR2x8qwp, model claude-opus-5-5, wysiłek medium, permission_mode auto; repo sesji: lkarwowski494/trening, techniqueatlas, prompts.
- Gałąź robocza: `integracja-1-1` (scalanie: `NODE_USE_ENV_PROXY=1 node scripts/scal-galaz.mjs <gałąź>`); gałąź stanu: `koordynacja` (nigdy nie scalana).

## Teraz
- Integracja `1d6352ba` (zielona): delt_raise, slad-dzwignia, generator-odtwarza, A4a, partia-2 (tura 1), partia-3, B2, A4b, P1. Pokrycie: pełna karta 252/455, figura v2 257/531.
- Blokada CI: Jest część 3 > 20 min. Gałąź `scal/pociag-3` (= figury/partia-1 + Jest 5 części + własny sekwencer, zmiana workflowu) — robi ją agent lokalny poprzednika (kontener poprzednika, wynik tylko na gałęzi): naprawy gemini-polecenia (dokładny zbiór) i figury-recenzja (podział przypadku), potem przebieg dowodowy. Następca: sprawdź tests.yml na head `origin/scal/pociag-3`; zielony → scal-galaz (zmiana workflowu = przebieg dowodowy na gotowym produkcie, KO-012); czerwony/brak postępu > 1 h → zleć sesję (rola 08) z tym opisem.
- Potem scalić: `figury/partia-2` 7a09818f (koniec partii 2; CI na 4 częściach może paść limitem → dociągnąć integrację po pociągu-3), `figury/partia-4` (gdy lead zgłosi zielony), `figury/partia-5` (gdy zgłosi).
- Raport 05:00 wysłany właścicielowi w czacie poprzednika (4 decyzje do właściciela niżej).

## Sesje
| Litera | ID | Rola, tryb | Gałąź @ SHA | Kontekst % | Koszt USD | Stan |
|---|---|---|---|---|---|---|
| P-4 | session_01T66VByqWgLJQQccrmCXLmn | programista partii 4 (tura 2): dip, chest_press_machine, cable_press, back_extension, thruster | figury/partia-4 @ 3bcd294c; figury/partia-4-thruster @ 110bb399 | 14 (03:40) | 6 | aktywna: dociąga integrację, thruster r2 (KO-010) |
| P-5 | session_01T66VByZrLpWxNF8yF3gpgu | programista partii 5: forearm, carry, core_hang, rotator_cuff, kneeling_hinge (+glute_floor) | figury/partia-5 (niewypchnięta 03:40) | 29 (03:40) | 46 | aktywna; polecenie przekazania przy 30% wysłane — oczekiwany następca |
| P-2 | session_01T66VBvdsMU66FhsPJWpG8J | lead partii 2 | figury/partia-2 @ 7a09818f | 30 | 26 | zakończona (raport końcowy) → do archiwizacji po scaleniu |
| P-1 | session_01T66VBx7QqXRjB2JpVi4Kww | lead partii 1 | figury/partia-1 @ 9d6f35b3 | 31 | 17 | zakończona → do archiwizacji po scaleniu pociągu-3 |
| — | session_01T66VBzk52zTw31SRXRs8To | lead partii 3 | scalona f7c2e0ed | 22 | 1 | zakończona, scalona → do archiwizacji |
| — | starsze sesje partii (przekazane): P-1 …VBw2eKcS22XQSJG4qft, …VBzsYzRKDwnh7aast4Y, …VBxNaAEefAUfCL8vLG1; P-2 …VBx1RfrSnnQXw6gc6zC, …VBydWMy3Mvkq6ew7xAZ; P-3 …VBzsqbUGWibKL85ugBA; P-4 …VBz37fikLrafFxEbBYK | — | — | — | patrz koszty.md | przekazane → do archiwizacji |

Koszty sesji: get_session każdej przed archiwizacją → koszty.md.

## Plan 24 h (UTC, 10.11)
| Kiedy | Co | Kto | Zależy od | Od właściciela |
|---|---|---|---|---|
| 05:30–07:00 | odbiór pociągu-3 (CI 5 części + partia-1) → scalenie | koordynator / sesja 08 przy czerwonym | tests.yml scal/pociag-3 | — |
| 07:00–09:00 | partia-2: dociągnięcie integracji (sesja), CI, scalenie | nowa sesja 08 | pociąg-3 scalony | — |
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
- brak oczekujących tej sesji (05:15). Następca tworzy: kontrola, linia 14:00, linia 05:00.

## Pule numerów decyzji
- Decyzje aplikacji: wpisy datowane w docs/18 (bez numerów D-NNN). KO następny: KO-015. Lekcje: `## L-NNN` nadaje koordynator przy scaleniu (`node scripts/numeruj-lekcje.mjs`).

## Dziennik
| UTC | Sesja | Zdarzenie z dowodem | Następny krok |
|---|---|---|---|
| 2026-11-09 19:30–2026-11-10 05:00 | koordynator …VByJCWCao1Hw3is68Cy | noc: archiwum/dziennik-noc-2026-11-09.md (scalenia z run ID) | — |
| 2026-11-10 03:15 | integracja | 1d6352ba wypchnięta (P1; tests.yml 42747238449 na gałęzi pociąg-2) | — |
| 2026-11-10 05:15 | koordynator | migracja na M9: gałąź `koordynacja` | przekazanie następcy M9 |
