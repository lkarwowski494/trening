Kontynuacja pracy koordynatora linii 1.1 aplikacji Trening — noc 09/10.11.2026 (start ~19:40 UTC), po /clear. Po polsku.

## TRYB NOCNY (właściciel 09.11.2026 ~19:30 UTC, docs/18 @ 40efb6e7)
- Podejmujesz WSZYSTKIE decyzje tak, jak i tak byś zarekomendował; każdą zapisz w docs/18 z datą i odrzuconymi wariantami (do weta rano). Pytaj właściciela tylko o rzeczy spoza granic niżej.
- Granice: bez scalania do `main`, bez TestFlight / App Store Connect, przekład API tylko w pułapie 30 USD (ZB-057 w docs/zobowiazania.md — licznik aktualizuj po każdym przebiegu), nigdy --no-verify.
- Ty tylko koordynujesz. Pracę (scalenia, poprawki, recenzje, przekłady) zlecasz sesjom chmurowym (`create_session`) albo lokalnym agentom (`Agent`, rola z .claude/agents) — własny kontekst oszczędzaj (krótkie polecenia, wyniki przez raporty, nie czytaj długich plików/logów sam).
- Sesje wykonawcze: limit 30% kontekstu (get_session → external_metadata.context_usage). ≥30% → zapis STAN, push, nowa sesja z pełnym promptem, raport do Ciebie z id nowej sesji. Sprawdzaj je co ok. 1–2 h (`get_session` na każdej, `status_bucket`, `context_usage`); sesja, która przekroczyła 30% i nie przekazała — wyślij jej polecenie przekazania.
- Własny kontekst: gdy sam przekroczysz ok. 30–40%, zapisz przekazanie (ten plik → -noc5.md) i poproś właściciela o /clear albo kontynuuj w nowej sesji.

## Zasady i pułapki (czytaj, gdy potrzebne)
- /home/user/przekazanie-koordynator-1-1-dzien4.md (rola, wnioski dnia), -dzien3.md, -dzien.md (scal-galaz, ręczne scalanie). CLAUDE.md czytaj z /home/user/wt-ci po `git -C /home/user/wt-ci pull --ff-only origin integracja-1-1`.
- Dziennik: /home/user/stan-koord-noc.md (od końca; sekcja „09.11 ~14:30 UTC (dzień 4)” i dalej). Dopisuj krótko.
- Scalanie do integracji: z /home/user/wt-ci `NODE_USE_ENV_PROXY=1 node scripts/scal-galaz.mjs <gałąź>`; przy konflikcie — zleć agentowi `programista` scalenie integracji DO gałęzi (push, zielony tests.yml), potem scal-galaz znowu. Pliki generowane przy konflikcie: wersja GAŁĘZI + generator (README: `node scripts/readme.mjs --write`; docs/19: `node scripts/test-matrix.mjs --write`; docs/55: `node scripts/pokrycie-katalogu.mjs --write`; skróty przekładu: `UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts`) — dziś README straciło markę przez „--ours”. Po scaleniu z lekcją `## L-NNN`: `node scripts/numeruj-lekcje.mjs` (hak pre-push na integracji odmawia nienumerowanych).
- Bramki: integracja po scaleniu KODU → `flock /home/user/verify.lock npm run verify:szybkie` (L-125: verify:lekkie nie uruchamia Jest), wyjątek: drzewo scalenia identyczne z drzewem zielonej gałęzi (`git rev-parse X^{tree}`) → verify:lekkie wystarczy. Commit tylko dokumentów → `npm run verify:docs` BEZ blokady (właściciel 09.11, brief poprawiony). Gałęzie funkcji → verify:lekkie + celowane testy + tests.yml jako bramka Jest (decyzja 08.11). Czekanie na CI: /tmp/claude-0/-home-user/ea179977-3b8b-4102-a74d-e89134020a17/scratchpad/czekaj-ci.sh <gałąź> [sha] (run_in_background, timeout 7200000). Zadania w tle z flock dawaj z timeout ≥ 2 h (domyślne 30 min je zabija).
- core.hooksPath musi być `scripts/hooks` (sprawdź `git -C /home/user/trening config --get core.hooksPath`).

## Decyzje właściciela 09.11 (wszystkie zapisane w docs/18 na integracji)
- Cel 1.1 = wariant C: wszystkie rodziny z danymi póz v2 (~30), pełna karta 457 (dane/cel-1-1-bez-ciezkich scalone).
- Lekcja nachwyt L-123 = A: lista fałszywych przyjaciół w słowniku (`docs/lokalizacja/slownik-terminow.json`) wypełniana przez recenzenta lokalizacji przy każdej partii; tłumacze dodali już pojęcia (B2: wykrok_postawa, przodostopie, slidery; A4b: piesc_punch, sanki_treningowe, podrzut_jerk + rozszerzenia).
- Przyspieszenie = A: skrót per rodzina (scalony ce9595b1), rodziny partiami ~5, 3 sesje chmurowe; verify:docs poza kolejką verify.lock.
- Przekład API partii rodzin do 30 USD łącznie (ZB-057; wydane 0 USD). Limit 9 USD (A4a/A4b/B2/P1, ZB-054) wykorzystany ~7,11 USD.
- RepsGoat scalone do integracji (b99eb7e7, zielone). Otwarte z RepsGoat: grupa subskrypcji w ASC (strona Apple 404 — nie podawać kroków z pamięci), check-urls apps4brew, przekład „Co nowego”, akceptacja słów EN.
- Rezerwacja nazwy RepsGoat w ASC: ZB-056 mówi „nazwa zarezerwowana” — stanu w docs/48 nie sprawdziłem; sprawdź u źródła przed raportem.

## Stan gałęzi (~19:40 UTC)
- `integracja-1-1` @ 40efb6e7 (origin). Ostatni pełny zielony tests.yml: b99eb7e7 (42666950211); po nim scalona gałąź skrótów (ce9595b1, drzewo = e2705d86 zielone 42674797726) + dokumenty — sprawdź tests.yml dla 40efb6e7/aeabf69a.
- Kolejka scaleń: delt_raise → B2 → A4a → A4b → P1 (+ figury/slad-dzwignia, gdy zielona — od razu, bo czekają na nią partie 1–3).
  1. `figury/delt_raise` @ ed295dbc: programista (agent lokalny, worktree /home/user/wt-delt) scala integrację + przelicza skróty nowym algorytmem z dowodem (skrót na 067c8f90 = po scaleniu). Czekaj na jego raport → scal-galaz.
  2. `figury/b2-nogi` @ b4fa5037 zielony 42673747453 (przekład + 35 poprawek lok). Przed scaleniem: wpisy recenzji kart B2 + odsłonięcie (JSON w docs/przekazanie/notatki/linia-1-1/STAN-B2.md na gałęzi; sha `node scripts/zrodla-runtime.mjs --skroty`; plik recenzenta docs/research/recenzje/<partia>-r<N>.json; pełny test-fast — L-125) → zlecić agentowi programista (wt-b2).
  3. `lok/przeklad-a4a` @ d9e2f722 (18 kart wpisy, odsłonięte, test-fast+verify OK) — 13+ za integracją → programista scala integrację do gałęzi, zielony → scal-galaz.
  4. `tekst/a4b-moc-przedramiona` @ ea588092 zielony 42678206245 (przekład + 45 poprawek lok). Przed scaleniem: wpisy „karty” z /tmp/claude-0/-home-user/6270674f-c7ef-4c88-9380-de9952992c05/scratchpad/recenzja-a4b-badacz-r2.md (10 kart wyswietlana; 4 wstrzymane: Clean and Jerk, Depth Jump, Turkish Get Up, Scoop Throw — zostają ukryte, do backlogu z powodem) + odsłonięcie → programista (worktree /home/user/wt-a4b).
  5. `tekst/p1-squat-hinge` @ aca7286b zielony: 13 poprawek lok z /tmp/claude-0/-home-user/35dd0641-0898-52e5-8061-c653bff02acd/scratchpad/recenzja-lok-p1.md (1 BLOK ms slrdl.move „bongkok”) → tłumacz; potem recenzja różnicy squat/hinge po delt (przy skrócie per rodzina: jeśli skrót squat/hinge bez zmian po scaleniu delt — różnicy brak, wpisy zostają) → scalenie OSTATNIE. Otwarte P1: sq.down „cofając biodra” (jedno źródło, klucz wspólny — backlog/zobowiązanie), Hack sq.mis.roundBack, ZB-055.
- Partie rodzin (sesje chmurowe, start ~19:00 UTC, ~1,5 h agenta na rodzinę → tura 1 ok. 7–8 h):
  - P-1 session_01T66VBw2eKcS22XQSJG4qft → `figury/partia-1`: overhead_press, chest_fly, kb_ballistic, calf_raise, row.
  - P-2 session_01T66VBx1RfrSnnQXw6gc6zC → `figury/partia-2`: pushup_plank, hip_bridge, cable_row, mobility_floor, mobility_stand.
  - P-3 session_01T66VBzsqbUGWibKL85ugBA → `figury/partia-3`: glute_floor (zostaje planned — brak mapowania fh.level/clam.noRoll → badacz w turze 2), pulldown (N1 WYSOKIE kolizja Straight Arm, poprawka), shrug (W1–W4 chwyt vs bark, generator), hip_abd_add (recenzja), leg_machine (czeka na D1).
  - Moje decyzje: D1 = A (ślad toru = punkt styku dźwigni, contract.ts:330–332) na osobnej gałęzi `figury/slad-dzwignia` (robi P-3; dowód: skróty rodzin ready bez zmian) → scal od razu, P-1/P-2 dociągają integrację (calf_raise, hip_bridge); B2 leg_isolation też tego dotyczy. D2 = A (EN „Pulling”).
  - Prompt partii (wzór do nowych sesji / tury 2): /tmp/claude-0/-home-user/27e32a69-d781-44c7-87cd-794c0c9df3ce/scratchpad/prompt-partia.txt ({N}, {RODZINY}).
  - Raport końcowy partii → przekład: `tylko_szacuj` → przebieg (bez pytania, do 30 USD, licznik ZB-057) → recenzent-lokalizacji (inny agent) → tłumacz nanosi + słownik → scalenie partii.
- Tura 2 (po raportach tury 1; rodziny wg zysku z `node scripts/pokrycie-symulacja.mjs`): forearm, dip, carry, chest_press_machine, cable_press, back_extension, core_hang, thruster, rotator_cuff, kneeling_hinge (+ glute_floor po badaczu; lunge/leg_isolation idą w B2, core_floor w A4). Sprawdź listę planned w lib/figures/v2/families.ts.

## Nocne zadania koordynatora (kolejno)
1. Odbieraj raporty (ReadNotifications; agenci lokalni — powiadomienia), scalaj w kolejności, decyduj wg rekomendacji (docs/18).
2. Co 1–2 h: get_session 3 partii (context_usage, status), dziennik.
3. ZB-049 `proces/sygnal-nocny` @ 94e6d09e: czerwone kontrola-czasu-testu (niestabilny czas figures-v2-wstrzymane) — zlecić programiście naprawę (podział przypadku albo wyjątek z planem), zielony → scal.
3b. Nocne testy (nightly.yml): hak startu sesji pokazuje 12 czerwonych z rzędu (sygnał od P-2, 09.11 ~19:50) — L-119: zlecić agentowi diagnozę (merge-base --is-ancestor poprawek, naprawa/backlog z ID/„naprawione na gałęzi X”), wynik w raporcie 05:00.
4. ~05:00 UTC raport dla właściciela (co scalone, decyzje do weta, koszty API, pokrycie `node scripts/pokrycie-katalogu.mjs --cel 1.1`, termin 1.1 przeliczony z czasów partii; dotychczasowy szacunek: najwcześniej zgłoszenie ~15–16.11, realnie wydanie ~20–24.11).
5. Rano: STAN-1-1 („Teraz”) i docs/48 kolumna Stan (commit dokumentów na integracji), plan na dzień.
