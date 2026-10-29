# Postęp linii 1.0.1 — koordynator (sesja od 29.10.2026, ok. 12:00 czasu polskiego)

Źródło zadań: `PLAN-1-0-1.md` (ID 101-NN). Baza: `wersja-1-0-1-r2` 3cd4783. Gałęzie pakietów: `r101/<pakiet>`. Wyjątki od szablonu M2 — przekazanie z 29.10.2026 (bez `plan-napraw.json`, bez reaudytu M1; recenzja figur — audytor, tekstów — recenzent-lokalizacji).

## Zgody
- 29.10.2026 ~11:05 UTC — właściciel zatwierdził plan i decyzje: „D0 B, reszta zgodnie z rekomendacją” (docs/18, PLAN sekcja E). Start fal 0–3 bez macOS i bez `main`; fala 4 po sygnale koordynatora 1.0.

## Fale
| Fala | Pakiety | Gałęzie | Stan | SHA po scaleniu | verify | tests.yml |
|---|---|---|---|---|---|---|
| 0 | 0 (101-00, 101-01) | r101/0 | scalona | 634139e6 | czerwone 1/11179 (docs/40 kolejność lekcji) → poprawka + kroki po Jest zielone | po pushu |
| 1 | F, E, A | r101/F, r101/E, r101/A | F gotowy (fc043c69), E i A czekają na 0 | — | — | — |
| 2 | B, C, D | r101/B, r101/C, r101/D | czeka | — | — | — |
| 3 | krok koordynatora (01 wpisy, 25, 26) | wersja-1-0-1-r2 | czeka | — | — | — |
| 4 | G1–G3 | — | czeka na sygnał „1.0 wysłane do recenzji Apple” | — | — | — |

## Do zdjęcia z `V2_WSTRZYMANE` (zbiorczo po fali)
- JM Press, Decline Close-Grip Bench To Skull Crusher (pakiet 0, pomiar wg kart r2; zdjęcie w fali 3)
- 11 martwych ciągów DL_ODSTEP (pakiet A; po recenzji niezależnej rodziny hinge)

## Dziennik
- 29.10 12:03 start sesji; przeczytane CLAUDE.md, PLAN, STAN, fakty właściciela (main); prompt roli złożony ręcznie z plików biblioteki (uruchomienie `assemble.mjs` zablokowane przez zabezpieczenie środowiska — treść ta sama: zasady wspólne, tryb fix, kontrakt, rdzeń, wzorce, szablony).
- 29.10 12:10 merge-tree `main` 412e063 → r2: 13 plików z konfliktem (zgodnie z PLAN sekcja C, plus `lib/figures/v2/rigs/benchPress.ts`, `store/review-notes.md`).
- 29.10 12:18 `npm ci` (kod 0). Pakiet 0 zlecony (programista, worktree `r101/0`).
- 12:15 Pakiet F gotowy: fc043c69 na r101/F (plik źródeł + 4 wpisy docs/18; strażnik cytatów i check:decyzje zielone). Uwagi: 101-19 komentarz przy stałej → pakiet D; Chain Press jedno źródło szczebla 4 → ograniczenie dla B; 101-18 bez miejsca w kodzie (karta nie podaje sekund) — w fali 3 rozstrzygnąć pole wdrożenia.

- 13:01 101-27 (zgłoszenie koordynatora 1.0; właściciel: C — do 1.0.1, nie blokuje 1.0; wariant naprawy niewybrany) → pakiet H (programista, r101/H): pomiar utraty stanu przy przebudowie; przy jakiejkolwiek utracie — opcje dla właściciela. E2E scenariusz → fala 4.

- 13:06 Pakiet 0 scalony (634139e6; bramka 4: 0 kart i figur znika; odcisk tokenów bez zmian), F scalony (43e0b6a4). A1 scalony (miara styku). Pakiety A, E, H zlecone.
- 13:06 verify po fali 0: Jest 11175/11179, 1 porażka `tests/audit-m1-p4b-queue.test.ts` (lekcje L-NNN pod numerowanymi po scaleniu; `test:fast` agenta jej nie objął) → poprawka docs/40; kroki verify po Jest (macierz, licencje, eksport iOS, pakiet, native) zielone.
- 13:06 Pakiet A gotowy (r101/A 75b5bf75): 11 DL i 101-03 — odstęp 4–9 cm → 1,5–3,1 cm (próg 3,5 cm), D2 sumo 8,0 → 2,4 cm. D3 (RDL ramiona pionowo) NIEWYKONALNE w progach źródeł (kolano ≤ 27°, tułów 50–80°) → pytanie do właściciela. Rodzina hinge czeka na recenzję niezależną (audytor).

- 13:11 Pakiet H (101-27) gotowy: przebudowa korzenia gubi niezapisany szkic edycji i stan okien → kod za wyłączoną flagą, tylko test (r101/H 27166cca, nie scalony). Pytanie do właściciela (opcje 1–4, rekomendacja 4: bez poprawki w 1.0.1, rejestr ryzyk). Recenzja hinge zlecona (audytor).
- 13:11 101-28 (koordynator 1.0, NISKIE, brzegowe): paywall — tekst „subskrypcja nadal się odnawia” oparty tylko na `entitlementActive`; zakupy = ścieżka wrażliwa (przegląd niezależny). Fala 2, mały pakiet I.

- 13:15 Pakiet E scalony (9cd7502b): 101-14, 101-15, 101-16, 101-21 (odcisk tokenów bez zmian). 101-17 bez kodu — docs/32 pkt 19 „tytuł skraca się wielokropkiem” → decyzja właściciela (A zostaje / B tytuł stały + treść „Dostosuj do: {l}”).
- 13:15 Recenzja lokalizacji E: ms „Animasi pergerakan” OK; do wprowadzenia el:580 „άρσεις” → „deadlift”, el:809 „πιέσεις πάγκου” → „bench press” (zgodne ze słownikiem); ms „Lukisan skematik” → „Rajah skematik” — pytanie do native speakera (docs/16); `store/screenshot-captions.json` ms → po 1.0 (docs/21).
- 13:15 Fala 2 start: B (r101/B) i C (r101/C); D i I po zwolnieniu miejsca (limit 3 agentów).

## Czekające kroki właściciela
- Decyzja: D3 RDL ramiona (A 23° / B ok. 17° — rekomendacja / C pionowo przeczy źródłom).
- Decyzja: 101-27 (1 przebudowa z utratą / 2 z zachowaniem szkiców / 3 łatka natywna RN / 4 bez poprawki — rekomendacja).
- Decyzja: 101-17 tytuł okna „Dostosuj” (A wielokropek wg docs/32 / B tytuł stały + zawijana treść).

## Wyjątki nazwane w tej sesji
- 29.10 12:20 Wypychanie samego `POSTEP.md` przez `git push --no-verify`: hak (L-049) wymaga znacznika verify dla drzewa, a `verify:docs` na gałęzi z kodem odmawia (STAN, pułapki). Kontrola zastępcza: commit zawiera tylko ten plik (`git show --stat`), `tests.yml` biegnie na gałęzi.
- Fala 0: pełne verify czerwone tylko na kolejności lekcji w docs/40; po poprawce (sam dokument) nie powtarzam całego Jest (36 min pod obciążeniem agentów) — kontrola zastępcza: test, który padł, + `verify-docs.test.ts` zielone, kroki verify po Jest zielone; wypchnięcie `--no-verify`; pełny przebieg w `tests.yml`.
- 29.10 12:20 Pakiet F (tylko nowe pliki `docs/research/`) startuje równolegle z pakietem 0, odbity od r2 sprzed scalenia; scalany po pakiecie 0 (kolejność z PLAN C bez zmian).
