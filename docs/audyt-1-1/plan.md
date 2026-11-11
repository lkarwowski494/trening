# Audyt 1.1 (W-10, ZB-043) — plan

Data: 11.11.2026. Sesja V (rola 07-jakosc, tryb audit). Koordynator: polecenie `docs/koordynacja/polecenia/V.md` @ 36aefbda (gałąź `koordynacja`).

## Tożsamość

- Badany commit: **79117f33** (`integracja-1-1` w chwili polecenia), gałąź audytu `audyt/w10-1-1`.
- `origin/integracja-1-1` w chwili startu: 0fa2f448 — o 2 commity dalej, **same dokumenty** (`docs/` W-03), kod identyczny; zgłoszone koordynatorowi.
- Kod aplikacji = drzewo scalenia 800043f (W-03, e2ee07fc); `tests.yml` zielony dla e2ee07fc (przebieg 43078373167, wg opisu scalenia — do potwierdzenia w raporcie); przebieg na 79117f33 anulowany (zastąpiony przez 0fa2f448).
- Poprzednie wydanie: 1.0.0 build 1033 (`v1.0.0-b1033`, fced34b5; w App Store). Zakres zmian do 1.0: 699 commitów, 289 plików w `app/ lib/ components/`.
- Zmiany sesji U (KO-047: wersja 1.1.0, „Co nowego”, `wyd/w08-1-1`) — na końcu jako różnica, bez drugiego audytu.

## Próg i zasady (CLAUDE.md, „Audyty i wydania”)

- Wydanie blokują tylko **KRYTYCZNE i WYSOKIE** (utrata/zepsucie danych, awaria, funkcja nie do użycia, błędne liczby lub twierdzenia, prywatność/bezpieczeństwo/sekrety/prawa autorskie, bariera dostępności, ryzyko odrzucenia przez Apple). ŚREDNIE i NISKIE → backlog z wersją (docs/21).
- Każde znalezisko: kroki w aplikacji, realność (realny / brzegowy / teoretyczny), waga, dowód (plik:linia, test, komenda z kodem wyjścia).
- Jeden audyt, bez pętli. Audyt nie zmienia kodu; sondy i testy robocze tylko w kopii (worktree w scratchpadzie).
- Bramka 4: każda rodzina figur `ready` i karta ćwiczenia z recenzją niezależną (`autor` ≠ `recenzent`, pole `slad`).
- Mapowanie wag na poziomy roli 07: KRYTYCZNE ≈ P0, WYSOKIE ≈ P1, ŚREDNIE/NISKIE ≈ P2.

## Obszary i podział na subagentów (soczewki niezależne, bez wglądu w siebie)

| Prefiks | Obszar | Soczewka | Pozycje JAK |
|---|---|---|---|
| DAT | dane i migracje (zapis z b1033 → kandydat), trwałość, kopia/eksport/import, aktualizacja z 1.0, cofnięcie do starszego buildu | użytkownik, który traci dane | JAK-01, 08, 16 |
| SEC | prywatność, sekrety (historia od b1033), workflowy CI (pull_request_target, uprawnienia, przypięcie akcji), manifest prywatności, licencje, prawa autorskie | atakujący / repo publiczne | JAK-10, 11 |
| APL | ryzyko odrzucenia przez Apple: zakupy (StoreKit, przywracanie, paywall), Zdrowie (HealthKit), zegarek, uprawnienia i Info.plist, metadane w kodzie | recenzent App Store | JAK-12 (tylko telefon) |
| MER | liczby i twierdzenia merytoryczne: rejestr twierdzeń, generator, progresja, e1RM, deload, teksty dziedzinowe nowe od 1.0 | użytkownik, który dostaje błędną informację | JAK-02, 07 |
| FIG | figury v2 i karty ćwiczeń — bramka 4 (`ready` ↔ recenzja niezależna, `slad`, autor ≠ recenzent), eksport strony | recenzent ruchu | JAK-02 |
| UX | ekrany i przepływy nowe od 1.0, wzorce interakcji (docs/32), dostępność (etykiety, role, VoiceOver w kodzie), katalog przepływów vs Maestro | nowy użytkownik bez instrukcji | JAK-03, 12, 13 |
| LOK | lokalizacja po W-03: kompletność słowników, nazwy lokalne, InfoPlist, długość, zgodność terminów | użytkownik w innym języku | — |
| TST | jakość testów i bramek: stan CI, siła testów (mutacje na kopii w 3 funkcjach ryzyka wysokiego), powtarzalność, deklaracje jakości (JAK-15), E2E i SHA kandydata | sceptyk szukający testu, który nie może paść | JAK-04, 05, 06, 09, 15, 17, 18 |

Koordynator audytu (ta sesja) uruchamia osobno: typecheck, lint, kontrole `check:*` (wynik w `docs/audyt-1-1/dowody/`), czyta CI; pełny Jest — z `tests.yml` (4 części), nie lokalnie (zasada „pełne verify tylko pod flock, gdy nikt nie testuje”).

## Weryfikacja

Każde KRYTYCZNE i WYSOKIE sprawdza drugi, niezależny subagent (dostaje tylko twierdzenie i dowód, nie rozumowanie autora): potwierdzone / odrzucone z powodem / zmiana wagi.

## Wyjście

- `docs/audyt-1-1/znaleziska.md` (+ `znaleziska.json` — poprzednie audyty nie miały formatu JSON; plik prosty, do backlogu).
- `docs/audyt-1-1/07-jakosc-2026-11-11.md` — raport roli 07 z werdyktem.
- Różnica `79117f33..origin/wyd/w08-1-1` dopisana na końcu.

## Szacunek czasu

Agent: ok. 2–3 h (8 audytorów równolegle ok. 1–1,5 h, weryfikacja ok. 30 min, złożenie ok. 30 min). Czeka się na: sesję U (`wyd/w08-1-1`). Czas właściciela: decyzje z sekcji „Decyzje dla właściciela” raportu.
