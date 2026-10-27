# Start niezależnej sesji audytu M1 przed zgłoszeniem 1.0 (decyzja właściciela 27.10.2026 ~11:20 UTC)

## Decyzja właściciela
Po buildzie TestFlight 1.0 (naprawa animacji, „Technika”, Z-02, notatki, zrzuty) i po przeglądzie właściciela na telefonie (docs/49):
1. **głęboki audyt M1 w osobnej, niezależnej sesji** (rola M1-audytor-generalny z biblioteki `lkarwowski494/prompts`, wariant **głęboki**);
2. **jeden przebieg napraw**: znaleziska z audytu + uwagi z telefonu razem (M2 / koordynator);
3. **reaudit** (M1 tryb reaudit) → gotowość do wydania.
Nazwany wyjątek od CLAUDE.md „jeden audyt na wydanie, bez pętli” (Audyty pkt 2) dla 1.0 — świadomie, polecenie właściciela. Próg blokady bez zmian: KRYTYCZNE i WYSOKIE.

## Zamrożenie i charakter audytu (doprecyzowanie właściciela 27.10 ~11:30 UTC)
- Audyt jak na **gotowej aplikacji**: sprawdza, czy wszystko działa i jest zgodne z założeniami (BRD `docs/brd/`, decyzje docs/18 i docs/decyzje, CLAUDE.md, docs/48, docs/32 wzorce, rejestr twierdzeń). Nie jest częścią budowy.
- **Nic się nie zmienia w trakcie audytu**: przedmiot audytu = dokładnie ten commit, z którego jest build TestFlight testowany przez właściciela na telefonie. Od startu audytu do raportu: żadnych pushy do `main`, żadnych scaleń PR 1.0, żadnych nowych buildów 1.0. Audytor niczego nie naprawia (M1: pliki śledzone nietknięte).
- Praca nad 1.1 trwa tylko na osobnych gałęziach (nie dotyka `main` ani buildu 1.0).
- Naprawy dopiero po raporcie, jednym przebiegiem (audyt + uwagi z telefonu), potem reaudit na nowym commicie.

## Jak uruchomić (koordynator)
- Kiedy: po zakończeniu przeglądu z telefonu (właściciel zgłosi). Commit audytu = SHA buildu TestFlight na `main`.
- Sesja: `create_session` w tym samym środowisku, repo `lkarwowski494/trening` @ <SHA buildu>, model opus, wysiłek high (pole `sesja` roli M1).
- Prompt: `node tools/assemble.mjs M1-audytor-generalny --tryb audit --plik m1-audit.md` z klonu `lkarwowski494/prompts` (stan 97ec212) + nagłówek kontekstu niżej.

## Nagłówek kontekstu dla sesji M1 (dołączyć przed promptem)
- Aplikacja: Trening (iOS, Expo/TS), repo publiczne — w raportach w repo nie wypisuj identyfikatorów, UDID, e-maili ani sekretów.
- Commit: <SHA buildu 1.0 na main>. Wariant: **głęboki** (polecenie właściciela) — STOP 1 z planem i kosztem i tak przedstaw właścicielowi.
- Bramka opłacalności: wynik istnieje (docs/monetyzacja.md, próg 500 USD netto/rok; werdykt budować) — E0a jako odświeżenie, nie od zera.
- Poprzedni pełny audyt: 26.10.2026 (trzy obszary + Z-02; 0 KRYTYCZNYCH; naprawy w main); audyt M1 21–22.10 (DEC-01…27, docs/18). Uwagi z telefonu właściciela: <ścieżka po przeglądzie>.
- Środowisko: Linux bez Xcode; maszyna współdzielona — ciężkie operacje po jednej, testy jednym wątkiem; natywne sprawdzenia przez workflowy (`ios-unsigned.yml`, `e2e-ios.yml`) tylko jeśli plan to przewiduje.
- Wyjście: katalog przebiegu K i raport końcowy wypchnij na gałąź `audyt-m1-1-0-<data>` (tylko pliki audytu, poza drzewem aplikacji, np. `audit/`), bo kontener jest ulotny; pliki śledzone aplikacji nietknięte.
- Niezależność: nie czytaj gałęzi `przekazanie-konta` (notatki koordynatora i uzasadnienia napraw) poza listą uwag z telefonu.
- Szczególny nacisk (koordynator 27.10, po teście telefonu): **zgodność kodu z KAŻDĄ decyzją właściciela w docs/18** — na telefonie znaleziono decyzję z 23.10 (kolejność planów na ekranie zakupu, domyślny plan) zapisaną, ale nigdy niewdrożoną. Uwagi z telefonu: docs/przekazanie/notatki/telefon-1-0-checklista.md i linie „TELEFON” w docs/przekazanie/README.md (gałąź przekazanie-konta; wolno przeczytać tylko te pozycje).
