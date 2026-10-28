# Plan reaudytu M1 — Trening — 2026-10-28 (pętla 1)
Commit badany: 2385e75 (main, PR #79, HEAD odłączony) · Baza: 025a50b (audyt M1 27.10.2026) · Tryb: reaudit · Zakres: wariant A właściciela 28.10.2026 („Ok a”) — 37 zadań planu + cała różnica 025a50b..2385e75 (277 plików, 118 commitów).
Subagenci: narzędzie Agent, najwyżej 4 naraz (maszyna współdzielona; testy `--maxWorkers=1`, pełne testy tylko rola 07).

## E0
- `git status --porcelain` na starcie: pusty (K w .git/info/exclude). Plan: `sprawdz-plan.mjs` kod 0 (37 zadań, 8 decyzji, 0 bez wyboru); `reaudyty` brak → pętla 1.
- Statusy: 35 × naprawione-do-weryfikacji (w tym 006 po przeglądzie API, a38ce270), 2 × zatwierdzone z blokadą (033 — odłożone decyzją 4a na 8 tygodni po premierze; 036 — DEC-08 a, dane po premierze) → tylko wypisane.
- Nowe znaleziska M2 (M2-koordynator-napraw-001/002/003) naprawione po decyzjach 5a/7a/6a → sprawdza rola-właściciel (02, 12, 04).

## Pliki → role (różnica 025a50b..2385e75, grupy wg ścieżek)
| Grupa plików | Liczba | Role |
|---|---|---|
| tests, .maestro, .github, scripts (check:bundle C, check:pochodne, decyzje.mjs, blokada-wydania) | 120 | 07 |
| lib/locales, i18n, słownik terminów, cues/text (165 poprawek API, symbol masy) | 55 | 09 |
| components, app (ekran zakupu, tablica „×”, Pierwsze kroki, kolejność, pasek tygodnia) | 33 | 04 (02 dla paywall) |
| lib/figures, data/zrodla, rejestr twierdzeń, figury-recenzja (reguły podparcia, klatki v1) | 11 | 06 |
| lib (units/wu(), board, calendar, live, stats) | 11 | 08 |
| lib/backup, state, csvcore, rescue, store | 9 | 05, 12 |
| store, site, docs/41/42/48, polityka | 8 | 10 |
| docs/brd | 7 | 01, 03 |
| paywall, access, entitlement, SubscriptionCard, support | 5 | 02 |

## Role (wszystkie 12 mają zadania albo zmienione pliki)
| Rola | Zadania do weryfikacji | Przegląd różnicy | Tokeny (od–do) |
|---|---|---|---|
| 01 | 022 | docs/brd | 0,15–0,3 mln |
| 02 | 001, 002, 010, 016 (+M2-001, 1A×DEC-09 a); 036 wypisane | paywall, entitlement | 0,2–0,4 |
| 03 | 037 | zakres, podpisy zrzutów | 0,15–0,3 |
| 04 | 011, 024–029 (+M2-003) | ekrany i komponenty | 0,25–0,45 |
| 05 | 003, 014, 015, 035 | warstwa danych | 0,2–0,4 |
| 06 | 005, 020, 021 | figury v1 + reguły podparcia, cues, rejestr | 0,25–0,45 |
| 07 | 009, 012, 023, 034 | testy, CI, check:bundle, check:pochodne; pełne testy (jedyna) | 0,25–0,5 |
| 08 | 030 | wu() vs etykieta (~40 miejsc), lib | 0,2–0,4 |
| 09 | 006, 019, 031 | 165 poprawek, symbol masy | 0,25–0,45 |
| 10 | 007, 008, 017 | store, site, docs wydania | 0,15–0,3 |
| 11 | 018; 033 wypisane | — | 0,1–0,2 |
| 12 | 004, 013, 032 (+M2-002) | rescue, boot | 0,15–0,3 |
| weryfikacja przeciwna (regresje P0/P1) | 0–3 grupy | | 0–0,7 |
| M1 (E0, scalanie, raport) | | | 0,3–0,5 |
| **Razem** | | | **2,6–5,6 mln** (próg STOP wyjątkowego 1,5 × 5,6 = 8,4 mln) |

Partie: 1 — 02, 05, 06, 12 (P1 i dane); 2 — 04, 08, 09, 10; 3 — 07 (sama: pełne testy), 01, 03, 11.
Czas agenta: ok. 1,5–2 h (3 partie × 20–30 min + scalanie). Czeka się: nic zewnętrznego (bez CI macOS; E2E tylko z istniejących przebiegów). Czas właściciela: ta odpowiedź + STOP 2.

## Poza zakresem / niesprawdzalne tu
- Telefon (Zdrowie, zegarek, zakup sandbox, ekran blokady), symulator iOS — Linux; dowody E2E tylko z przebiegów CI w historii.
- 9a (eksport figur strony) na gałęzi naprawy/M2-po-decyzjach-eksport-figur od integracja-1-1, nie w main — poza commitem badanym; wypisane jako otwarte.
- Propozycje A/B w L-047, L-048 — decyzje właściciela, tylko wypisane.

## Odstępstwo od procedury (zasada 7)
Uruchomienie `tools/assemble.mjs` z klonu biblioteki zablokowane przez zasady uprawnień sesji (kod z zewnętrznego repo). Zastępstwo: prompty ról składam własnym skryptem w scratchpadzie z tych samych plików (kolejność i podstawienia jak w assemble.mjs, przeczytanym w całości); kontrole `sprawdz-plan.mjs` / `sprawdz-raport.mjs` to kopie z szablonów promptu w scratchpadzie (nie w repo).

## Decyzja (STOP 1)
(a) 12 ról jak wyżej, 2,6–5,6 mln tokenów, ok. 1,5–2 h (rekomendacja: pełna realizacja wariantu A, każda zmiana ma niezależne spojrzenie roli-właściciela) · (b) 7 ról (02, 04, 05, 06, 09, 10, 12 — P1, dane, pieniądze, treści, UI), zadania P2 ról 01, 03, 07, 08, 11 sprawdza M1 sam po testach M2: 1,6–3,3 mln, ok. 1–1,5 h; słabsza niezależność i brak przeglądu CI/check:bundle/check:pochodne przez 07 oraz wu() przez 08 · (c) zmiany właściciela.
