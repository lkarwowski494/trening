# Sesja O: gotowość startu strony techniqueatlas po wydaniu 1.1 — kroki w docs/49 (dokumenty) — Trening
Koordynator: session_01T66VBxZrKCwRyMgDwdWZ2N. Raporty, PYTANIE i PRZEKAZANIE przez `mcp__claude-code-remote__send_message` z `session_id` = to ID (ToolSearch; nie ListAgents). Gałąź `koordynacja` tylko do odczytu.

1. Rola: 08-programista build (tu tylko dokumenty i odczyt). Prompt roli w pierwszej wiadomości po `=== PROMPT ROLI ===`. Pierwszeństwo ma CLAUDE.md (zwłaszcza bramka 4 figur i strona, źródła publicznie anonimowo, „Stan kroków u źródła”, „Wykonalność opcji”).
2. Start: gałąź `docs/strona-start-1-1` od `origin/integracja-1-1` @ 5721a16e (inny HEAD: zgłoś). `git fetch --unshallow`, `npm ci`. Repo strony `lkarwowski494/techniqueatlas` tylko do odczytu: `add_repo` z dostępem `read` (jeśli odrzucone — klon `--depth 50` przez git proxy; jeśli i to nie działa — PYTANIE).
3. Zgoda/cel (właściciel 2026-11-11 ~07:05 UTC: „A: sprawdź teraz”): strona startuje po wydaniu 1.1 (docs/18 02.11.2026 W0; ZB-017, ZB-034 w docs/zobowiazania.md; docs/49 W-35). Cel: termin startu z dowodem i lista kroków, żeby strona mogła ruszyć w dniu wydania 1.1.
4. Zadania:
   1. Stan repo strony u źródła: gałąź main (SHA), ostatnie przebiegi CI (actions_list), `npm test` strony lokalnie (wynik do pliku; sprzątanie katalogów tymczasowych — lekcja ZB-050), PIN eksportu (dziś `integracja-1-1` @ f3f6e16 wg ZB-034 — sprawdź), `slugs.lock.json`, sposób publikacji (hosting, domena, workflow — przeczytaj pliki, nie zgaduj).
   2. Różnica między PIN-em a aktualną integracją 5721a16e: eksport `scripts/strona/eksport.mjs` na 5721a16e — liczba ćwiczeń `ready`/`pelna`, parytet z `slugs.lock.json` (709?), co się zmieni po przepięciu na tag 1.1 (ZB-017: tylko rodziny `ready` z aktualną recenzją; test `tests/strona-eksport-recenzja.test.ts`).
   3. Dopisz do `docs/49-wydanie-1-1.md` sekcję „Start strony techniqueatlas” z krokami S-01… (Krok | Kto | Zależy od | Czas agenta | Czas właściciela | Stan z datą i dowodem), w tym: przepięcie PIN na tag 1.1, eksport i parytet, budowa, przegląd, **publikacja tylko za zgodą właściciela** (działanie zewnętrzne), indeksowanie. Każdy krok z plik:linia albo przeczytaną stroną (wykonalność) albo „wykonalność niesprawdzona”. ZB-017 w W-35 bez zmian treści decyzji.
   4. `npm run verify:docs` kod 0 (wynik do pliku), commit, push.
   Gotowe: sekcja w docs/49 na gałęzi, raport z terminem w postaci „start = dzień wydania 1.1 + X h agenta + Y min właściciela” i listą blokerów.
5. Zakazy: żadnych zmian w repo techniqueatlas (tylko odczyt; zmiany potrzebne na stronie → lista w raporcie jako przyszłe zadanie); nie publikujesz niczego; nie scalasz; nie tworzysz/archiwizujesz sesji; nie piszesz na `koordynacja`; nigdy --no-verify ani force-push; bez AskUserQuestion. Nazw innych firm/aplikacji nie wpisujesz do repo.
6. Kontekst i koszt: od 30% okna — PRZEKAZANIE. Pułap 15 USD.
7. Raport (≤ 10 linii): termin, blokery, SHA, plik wyniku verify:docs.
