# Raport DIF — różnica 79117f33..origin/wyd/w08-1-1 (83baf759), 11.11.2026

## Zakres i pokrycie
Przeczytano: git diff --stat (102 pliki), pełne diffy lib/whatsnew.ts, lib/i18n.en.ts, lib/figures/v2/{anim.ts, rodziny/cable_row.ts, rodziny/hip_abd_add.ts}, app.json, package.json, package-lock.json (tylko wersja), site/privacy.html, store/app-store-metadata.json, store/asc-kontrola-oczekiwane.json, docs/research/figury-recenzja.json, recenzja ko047-przyciaganie-r1-audytor-2026-11-11.md, docs/18 (KO-047), docs/49 (W-08, W-22), tests/release-1.1.0.test.tsx.
Próbka przekładu: de, ja, ru, es, tr (2 nowe punkty + faza) — sens zachowany. Komplet kluczy: 33 słowniki + nakładki es-419/pt-BR (dziedziczą z es/pt przez lib/locales/index.ts:13).
Nie czytano: docs/lokalizacja/raport-przekladu-*/ (34 pliki), szacunek.json, docs/19, README (pliki generowane).

## Znaleziska
### DIF-01 — punkt „Co nowego” o nazwach lokalnych uogólnia: nazwa w języku użytkownika jest tylko przy 277 z 708 ćwiczeń
Waga: ŚREDNIE (nie blokuje). Realność: realny (każdy użytkownik nie-EN otwierający kartę ćwiczenia spoza listy).
Kroki: język np. de → biblioteka → karta ćwiczenia spoza listy NAZWY_LOKALNE → pod nazwą angielską brak nazwy niemieckiej, choć „Co nowego” mówi „Auf der Übungskarte steht darunter der Name in deiner Sprache”.
Dowód: lib/whatsnew.ts:27 (punkt tylko gdy lang() !== 'en'); lib/i18n.ts:155-161 exLocal → undefined bez wpisu; lib/nazwy-lokalne.generated.ts: każdy z 34 języków ma 277 wpisów (node, policzone), katalog 708 (docs/55:12).
Propozycja: „…przy wielu ćwiczeniach pod nazwą widać nazwę w Twoim języku…” (+ przekład 2 zdań w 33 językach, recenzja lokalizacji). Test: tests/release-1.1.0.test.tsx — nowe brzmienie PL_1_1[2].

### DIF-02 — tests/whats-new.test.tsx: test ekranu przekracza 5000 ms pod obciążeniem
Waga: NISKIE. Przebieg z 3 plikami (--maxWorkers=2, maszyna dzielona z innymi audytorami): 1 failed / 29 passed, EXIT 1 („Exceeded timeout of 5000 ms”, tests/whats-new.test.tsx:41). Powtórka samego pliku: 14/14, EXIT 0. jest-ponow w test:fast ponawia takie przypadki; w tests.yml warto podnieść limit tego testu.

## Do sprawdzenia
- „Nowe i dopracowane wskazówki techniki, m.in. dla barków, ćwiczeń mocy i mobilności” — przeniesione z 1.0.1, nie weryfikowano zakresu kart (pokrywa inny audytor W-10?).
- site/privacy.html: „Obowiązuje od 21 października 2026 r. (wersja aplikacji 1.1.0)” — data wcześniejsza niż wydanie 1.1; treść o danych bez zmian (diff = tylko znacznik wersji), więc brak nieprawdy, najwyżej kosmetyka.

## Co działa dobrze
- Twierdzenia „Co nowego” zgodne z kodem: rysunki 528/708 = 74,6% (docs/55:16,30) i rodziny maszyn, linek, kb_ballistic, plyo, core_*, mobility_* mają status 'ready' (lib/figures/v2/families.ts) → „większość” prawdziwe; nazwy biblioteki EN (lib/i18n.ts:144), wyszukiwanie po nazwie lokalnej (app/picker.tsx:31,33,68; app/swap.tsx; lib/swap.ts:54); najlepszy głos (lib/voice.ts:86-92); „Zacznij pierwszy trening” i tablica (components/StartPanel.tsx:32, components/FirstBoard.tsx:31); nazwa przez appName(). Brak nazw innych marek. Brak obietnic funkcji nieobecnych.
- Limity sklepu: słowa kluczowe max 100 B (en-US, cs, uk, es-MX = 100), podtytuł max 30 znaków (hr, fi, id = 30), żaden nie przekracza; zmienione sk 98 B/28, hr 94 B/30, sl 95 B/26; opis ≤ 4000, promo ≤ 170. Pole whatsNew w store/app-store-metadata.json jeszcze nie istnieje (znane, W-22 w docs/49:67 „otwarte”) — limit 4000 nie do policzenia; tekst PL in-app ok. 400 znaków.
- KO-047: zmiana tylko etykiety fazy (3 pliki lib/figures), recenzja niezależna: autor „programista sesji U” ≠ recenzent „audytor”, pole slad obecne w obu wpisach (figury-recenzja.json cable_row, hip_abd_add), dowód skrótów i test odwrotny w raporcie recenzji. Etykieta = decyzja językowa recenzenta lokalizacji (docs/18:426, 434), kierunek u 0→1 = wysiłek zgodny z ruchem. Testy: ko047-przyciaganie + figures-v2-tor + l047-recenzja-niezalezna: 215/215, EXIT 0.
- Wersja: app.json, package.json, package-lock.json (oba pola) = 1.1.0; numer buildu ustawia testflight.yml:109-118 (BUILD_BASE + run number), wpis bez build — zgodnie z procesem. Brak zmian schematu/migracji (żaden plik store/types/migracji w diff; lib/app/components: 39 plików, głównie słowniki).
- tests/release-1.1.0.test.tsx, tests/nazwa-repsgoat.test.ts: zielone; whats-new zielony po powtórce (DIF-02).

## Nie sprawdzono
- Wygląd wpisu na urządzeniu / długość w UI w 34 językach (symulator) — krok: E2E scenariusz Co nowego na gałęzi.
- Pełna treść 34 raportów przekładu; języki poza próbką 5.
