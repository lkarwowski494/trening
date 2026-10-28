# Ponowny audyt: Odkrywanie i BRD — Trening (iOS, watchOS) — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony — zgodny z poleceniem) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Środowisko: Linux 6.18, Node v22.22.0, git; sieć przez proxy (strona Apple, apps4brew.com — działają); MCP GitHub tylko odczyt; brak macOS, symulatora i telefonu. Prompt roli przeczytany do końca (ostatni nagłówek: «Kontrola dowodów i sekretów przed oddaniem raportu»). Repo publiczne: raport bez e-maili, UDID, sekretów i nazw innych firm (rejestrator domeny zamaskowany).

## Podsumowanie

Naprawy z obszaru roli działają na 2385e75: ekran zakupu ma stan «Masz plan: …» i uwagę przed dożywotnim (kod, BR, test), ryzyko waluty jest w rejestrze z warunkiem zamknięcia po wydaniu, decyzje mają strażnik `check:decyzje` (341 wpisów, kod 0), BRD jest aktualny i pełny mechanicznie (kontrola-brd: 7 plików, 75 BR, 15 RD, 85 wektorów, 0 błędów; wektory w `tests/wektory/brd.json` zgodne z eksportem). Dwie pozycje zostają otwarte, obie bez blokady 1.0 progiem CLAUDE.md: (1) polityka prywatności pod adresem z aplikacji nadal stara — poprawka jest tylko w `site/`, eksport na stronę marki nie zrobiony (M1-017); (2) T-04 — strażnik i scenariusz 58 są, ale stan z dużą ikoną startu sprawdzi dopiero telefon (M1-011). Nowe znaleziska: 2 × P2 (BRD bez dwóch zmian zachowania z różnicy; lista kontrolna wydania nieaktualna wobec scenariusza 58). P0 = 0, P1 = 0.

| ID | Źródło (M1) | Wynik | Dowód (2385e75) |
|---|---|---|---|
| 01-odkrywanie-002 | M1-001 (z M1-010) | zweryfikowane | `app/paywall.tsx:59` (paysSub: kupione sam i z kodu, bez Chmury rodzinnej), `app/paywall.tsx:110` (uwaga przed «Kup na zawsze»), `app/paywall.tsx:86` (tytuł «Masz plan: …»), `app/paywall.tsx:94` («Zmień plan»); BR-ZAK-003 scenariusze `docs/brd/wymagania.md:812` i `docs/brd/wymagania.md:828`; dowody/jest-audit-m1-2026-10-27-001-dozywotni-przy-subskrypcji.txt (5/5, kod 0), dowody/jest-audit-m1-2026-10-27-010-stan-mam-plan.txt (10/10, kod 0), dowody/jest-paywall-kolejnosc-domyslna.txt (4/4) |
| 01-odkrywanie-001 | M1-007 | zweryfikowane (zakres M1-007); sam defekt waluty — nie sprawdzono (telefon) | R-WAL w rejestrze ryzyk `docs/40-lekcje.md:35` z warunkiem i stanem «sprawdzenie po wydaniu»; krok Z-36 `docs/48-zgloszenie-1-0.md:119`; bramka przepuszcza tylko taki stan `scripts/ci/blokada-wydania.mjs:35`; dowody/jest-audit-m1-2026-10-27-007-waluta-ryzyko.txt (2/2, kod 0) |
| 01-odkrywanie-007 | M1-009 | zweryfikowane | `npm run check:decyzje` → 341 wpisów, kod 0 (dowody/check-decyzje.txt); w `verify` i `verify:docs` (`scripts/verify-docs.mjs:67`); dowody/jest-decyzje-straznik.txt (21/21); decyzje 28.10 z polem wdrożenia, np. `docs/18-przekazanie.md:614` |
| 01-odkrywanie-003 | M1-011 | nadal otwarte (część «telefon») | `lib/theme.ts:37` (GLYPH_SCALE_MAX 1,4), NFR-DOS z progiem znaków-ikon `docs/brd/wymagania.md:852`; dowody/jest-matrix-a11y.txt (32/32); scenariusz 58 zielony w przebiegu e2e-ios 40624070610 (gałąź p2-ax5, 4c73243; odczyt MCP 28.10) — na 2385e75 pakiet podstawowy 40657526205 zielony, ale bez scenariusza 58; stan «dziś bez treningu» z dużą ikoną startu niepokryty (raport M2) → krok telefonu ZD-03 |
| 01-odkrywanie-008 | M1-017 | nadal otwarte (publikacja) | repo: `site/privacy.html:89` poprawione, dowody/jest-audit-m1-2026-10-27-017-polityka-poczta.txt (2/2); strona pod `lib/products.ts:29` nadal ze starymi odbiorcami i «po przeniesieniu» (dowody/strony-opublikowane.txt, odczyt 28.10); R-017 oznaczone jako zamknięte `docs/40-lekcje.md:34`, choć warunek «po każdej zmianie site/ powtórzyć» nie jest spełniony |
| 01-odkrywanie-004 | M1-022 | zweryfikowane | 25 BR w `docs/brd/wymagania-uzupelnienie.md`; strażnik tras i funkcji w dowody/jest-audit-m1-2026-10-27-022-brd-aktualny.txt (10/10); nowa trasa od bazy: brak (jedyny nowy plik kodu `lib/rescue.ts` ma BR-DAN-002 «Baza nie otwiera się») |
| 01-odkrywanie-005 | M1-022 | zweryfikowane | RD-05…RD-15 z wektorami na kodzie: dowody/jest-audit-m1-044-brd.txt (24/24, kod 0); 7 wektorów przeliczonych niezależnie — zgodne (dowody/wektory-rachunek.txt) |
| 01-odkrywanie-006 | M1-022 | zweryfikowane | BR-ZRO-001 wycofane, BR-JEZ-003/004 aktualne, errata ER-01…ER-11 (`docs/brd/errata.md`); testy 022 (10/10) |
| 01-odkrywanie-009 | M1-022 | zweryfikowane | RD-04-W5 rodzaju «błąd»; kontrola-brd bez uwagi dla RD-04 (dowody/kontrola-brd.txt) |
| 01-odkrywanie-010 | M1-022 | zweryfikowane | OG-01…OG-10 z S-15…S-24; 4 cytaty dosłownie na surowym tekście wytycznych z 28.10, «Last Updated: October 16, 2026» (dowody/apple-cytaty-odczyt.txt) |
| 01-odkrywanie-011 | M1-022 | zweryfikowane | OP-05, (D-102), D-123; test liczb w 022 zielony |
| 01-odkrywanie-601 | nowe | otwarte (P2) | BRD bez dwóch zmian zachowania z różnicy: kod diagnostyczny w wiadomości z ekranu błędu startu i odświeżenie dostępu po «Zarządzaj subskrypcją» |
| 01-odkrywanie-602 | nowe | otwarte (P2) | `docs/39-lista-kontrolna-wydania.md:71` twierdzi, że Maestro nie ustawi rozmiaru tekstu, a scenariusz 58 robi to wejściem `rozmiar_tekstu` |

Liczby nowych znalezisk: P0 = 0, P1 = 0, P2 = 2. Znane znaleziska 01-odkrywanie-012 i -013 (z naprawy) bez zmian: OP-08 i OP-09 w `docs/brd/README.md`, jedyna UWAGA kontroli (RD-09 bez wektora błędu) — nie zgłaszam ponownie (D-043).

Otwarte poza main (tylko wypis): 9a eksport figur strony (gałąź naprawy/M2-po-decyzjach-eksport-figur), propozycje A/B w lekcjach L-047 i L-048 (docs/40), backlog 1.0.1 w docs/21.

## Przegląd różnicy 025a50b..2385e75 (obszar roli)

`git diff --stat 025a50b..2385e75 -- docs/brd README.md store site`: 11 plików, +1274/−99 (docs/brd 7, README, `site/privacy.html`, `site/support.html`, `store/screenshot-captions.json`). Zmiany zachowania z całej różnicy (118 commitów) kontra BRD:

| Zmiana (commit) | BR / RD w BRD | Wynik |
|---|---|---|
| Stan «Masz plan: …», «Zmień plan», «Przejdź na ten plan», uwaga przed dożywotnim także z kodu (72338f0, a90caba, dbfa3cd, 5bbc84a) | BR-ZAK-003 (5 scenariuszy), OG-06 | ok |
| Wiersz Ustawienia → Subskrypcja (1a96768) | BR-ZAK-003 «Wiersz w Ustawieniach» | ok |
| Limit po wygaśnięciu Pro, P3 B (8c12be9) | BR-ZAK-002 «Dni z okresu Pro po wygaśnięciu», RD-05/06 | ok |
| «Zarządzaj subskrypcją» — arkusz w aplikacji i odświeżenie dostępu (f775eb5) | brak scenariusza | → 601 |
| Symbol masy lokalnie w cyrylicy i grece (5ca7577, decyzja 10a) | BR-JEZ-003 «Symbol jednostki w piśmie lokalnym» | ok; kod `lib/units.ts` (etykieta osobno od wartości logicznej) |
| Figury: bramka 4, ukryte Push Press / Pendlay Row / Reverse Lunge, reguła podparcia (562798d, 7243bda, a969ac8) | BR-BIB-001 (dwa scenariusze) | ok; tolerancje 10 j. / 7 j. to geometria walidatora rysunku, nie reguła dziedzinowa |
| Ratunek: ostrzeżenie i kopia plików bazy (451862d, `lib/rescue.ts`) | BR-DAN-002 «Baza nie otwiera się przy starcie» | ok |
| Wyjątek migracji → ekran błędu (8f3fb6f) | BR-DAN-003 «Błąd kodu migracji» | ok |
| Kod diagnostyczny w wiadomości «Napisz do nas» z ekranu błędu, bez treści błędu (dbc9f3b, 0311996, decyzja 7a) | BR-KON-002 tylko z Więcej → O aplikacji | → 601 |
| Okno nieudanego zapisu na bieżącym ekranie (ca84668) | BR-DAN-003 «Nieudany zapis poza zakładką Trening» | ok |
| Notatka serii jedna stała (e66902b) | BR-TRN «notatka dłuższa niż 300 znaków» | ok |
| RIR 6 → RPE 5 (7fb4f1a) | RD-02 | ok (wektory zielone) |
| Kolejność «Przesuń wyżej / niżej» (e73df05), «Planowanie» w linii tytułu, Pierwsze kroki, pasek tygodnia | BR-TRN-012, BR-PLN, BR-POM-001 | ok |
| Najwyżej jedno okno na podsumowaniu (a2300a1) | BR-ZAK-007 | ok |
| Znaki-ikony GLYPH_SCALE_MAX (644c498) | NFR-DOS | ok |

Obietnice w różnicy: pierwszy podpis zrzutu «Szybki zapis serii, także z zegarka» (decyzja 10a) — pokryty BR-ZEG-001..003; `site/support.html` opisuje nową ścieżkę Ustawienia → Subskrypcja → «Masz plan: …» zgodnie z `components/SubscriptionCard.tsx:19` (strona opublikowana nadal stara — w 008). Podpis «Gotowe szablony albo własne» bez zmian od audytu — nadal w «Do sprawdzenia» (rola 10).

Intencja decyzji 28.10 (docs/18) w kodzie: 1A × DEC-09 a (`components/SubscriptionCard.tsx:12`), 5a (`app/paywall.tsx:59`), 7a (`components/StartError.tsx:37`), 10a (`lib/units.ts`), 2a i figury (BR-BIB-001, `tests/figury-podparcie.test.ts` w verify) — zgodne.

## Kurs i macierz śladu

Linii bazowej nie ustalam od nowa (tryb reaudit). Względem linii z 27.10 (`role/01-odkrywanie/linia-bazowa-e0b.txt`): LB-PR5 (zakup: stan posiadania) — teraz pokryte w kodzie i BR-ZAK-003; LB-OG3/LB-OG4 — OG-04…OG-10 z cytatami; «dostępność: największy tekst» — częściowo (003). Żadna praca ani założenie głównego przepływu nie zostało obalone (ODK-14–16 bez zmian). Macierz śladu: wiersze z luką «→ 004/005/006/010/011» z raportu 27.10 mają teraz BR albo RD; nowe luki tylko w 601. Decyzja: (a) fix punktowy; rekomendacja (a) — build od nowa niepotrzebny.

## Stosowalność listy kontrolnej (reaudit)

| Pozycja | Status | Wynik |
|---|---|---|
| ODK-01 | dotyczy | 601 (dwie zmiany bez scenariusza); próbka regresji: uprawnienia z `app.json` mają BR (dowody/proba-regresji.txt) |
| ODK-02 | dotyczy | 008 nadal otwarte (strona); obietnica «dane nigdzie niewysyłane»: 0 wywołań sieci w `app/ components/ lib/` (dowody/proba-regresji.txt) |
| ODK-03 | dotyczy | ok — kontrola-brd 0 błędów, każdy BR ze scenariuszem i «Wtedy» |
| ODK-04 | dotyczy | ok (005 zweryfikowane) |
| ODK-05 | dotyczy | ok; rachunek niezależny 7 wektorów; RD-09 bez wektora błędu — znane (012/OP-08) |
| ODK-06 | dotyczy | ok; próbka S-18, S-19, S-20, S-23 dosłownie 28.10; OP-03 (S przeniesione bez ponownego odczytu) nadal otwarte — znane |
| ODK-07 | dotyczy | ok; cena i zakres tylko przez decyzje |
| ODK-08 | dotyczy | ok (010 zweryfikowane) |
| ODK-09 | dotyczy | ok (0 nieznanych odwołań) |
| ODK-10 | dotyczy | bez zmian od 27.10; dostępność → 003 |
| ODK-11 | dotyczy | ok (011 zweryfikowane) |
| ODK-12 | dotyczy | ok — 0 e-maili, telefonów, UDID w `docs/brd` i `docs/research` (próbka regresji) |
| ODK-13 | dotyczy | 601 (BRD nie zaktualizowany w tym samym commicie dla dwóch zmian); errata jest |
| ODK-14–16 | dotyczy | bez zmian względem linii z 27.10 |

Próbka regresji (trzy pozycje spoza zmienionych plików, `app.json` i `store/app-store-metadata.json` bez zmian od bazy): ODK-01 (uprawnienia → BR), ODK-02 (offline / bez wysyłki), ODK-12 (dane osobowe) — bez regresji; dowody/proba-regresji.txt (wynik bez regresji)

## Znaleziska (szczegóły)

### 01-odkrywanie-601 · BRD nie opisuje dwóch zmian zachowania z napraw: kodu diagnostycznego w wiadomości z ekranu błędu i odświeżenia dostępu po «Zarządzaj subskrypcją»
- Pozycja listy kontrolnej: ODK-01 (z ODK-13)
- Poziom: P2 (skutek tylko w dokumentacji; kod, decyzja i testy są)
- Realność: brzegowy (następna rola zmieni zachowanie bez kryterium; treść wychodzi z telefonu tylko wiadomością, którą użytkownik widzi przed wysłaniem) · Pewność: wysoka
- Rodzaj: D
- Dowód: `components/StartError.tsx:37` przekazuje kod diagnostyczny do `openSupportMail` (decyzja 7a, `docs/18-przekazanie.md:616`; test `tests/audit-m1-2026-10-27-032-kod-diagnostyczny.test.tsx`); BR-KON-002 (`docs/brd/wymagania-uzupelnienie.md:264`) opisuje tylko wejście z Więcej → O aplikacji i stopkę (wersja, iOS, język), a BR-DAN-003 (`docs/brd/wymagania.md:642`) tylko wymienia przycisk. `app/paywall.tsx:91` — «Zarządzaj subskrypcją» odświeża dostęp po zamknięciu arkusza (M1-016, f775eb5); żaden BR-ZAK nie ma tego scenariusza (grep «Zarządzaj subskrypcją» w `docs/brd`: 0 trafień).
- Mechanizm: strażnik 022 sprawdza trasy i listę funkcji z audytu 27.10, nie zmiany zachowania w późniejszych commitach; `git log 025a50b..2385e75 -- docs/brd` nie ma commitu z dbc9f3b, 0311996 ani f775eb5.
- Powraca: tak — ta sama klasa co 01-odkrywanie-004 (zmiana bez BR w tym samym commicie, CLAUDE.md «BRD»)
- Wzorzec lub źródło: CLAUDE.md, «BRD»: nowa funkcja albo zmiana zachowania = aktualizacja BRD w tym samym commicie.
- Kroki w aplikacji: ekran błędu startu → «Napisz do nas» (wiadomość z kodem etapu); Ustawienia → Subskrypcja → «Zarządzaj subskrypcją» → zamknięcie arkusza.
- Opcje: (A) dwa scenariusze (BR-KON-002 «Z ekranu błędu startu: kod diagnostyczny, bez treści błędu (D/7a)», BR-ZAK-006 «Zarządzaj subskrypcją») z polem «Test:» — ok. 15 min agenta, `verify:docs`; (B) A + strażnik: commit zmieniający `app/` lub `components/` z ID zadania naprawy bez zmiany `docs/brd` daje ostrzeżenie w haku — mechanizm, ale fałszywe alarmy przy zmianach czysto wizualnych. Rekomendacja: A przed 1.0 (same dokumenty), B do decyzji przy lekcji.
- Test akceptacyjny: kontrola-brd 0 błędów; grep «kod diagnostyczny» i «Zarządzaj subskrypcją» w `docs/brd` w aktywnym BR ze scenariuszem i testem.
- Status: otwarte

### 01-odkrywanie-602 · Lista kontrolna wydania mówi, że E2E nie ustawi rozmiaru tekstu, choć scenariusz 58 to robi
- Pozycja listy kontrolnej: ODK-13 (obszar 07/10: lista telefonu)
- Poziom: P2
- Realność: brzegowy (właściciel albo wydawca może uznać ZD-03 za jedyne sprawdzenie dużego tekstu albo odwrotnie — przecenić scenariusz 58, który nie pokrywa stanu «dziś bez treningu») · Pewność: wysoka
- Rodzaj: D
- Dowód: `docs/39-lista-kontrolna-wydania.md:71` (ZD-03): Maestro «nie ustawi rozmiaru tekstu systemu»; tymczasem `.github/workflows/e2e-ios.yml:60` ma wejście `rozmiar_tekstu`, a `.maestro/58-duzy-tekst.yaml` (276e988) robi zrzuty ekranu Trening przy największym tekście (przebieg 40624070610 zielony). Zdanie istniało w bazie; nieaktualne stało się przez naprawę M1-011.
- Mechanizm: naprawa dodała scenariusz bez zmiany opisu pokrycia zastępczego na liście telefonu.
- Powraca: nie
- Wzorzec lub źródło: CLAUDE.md, «Katalog przepływów» (E2E zastępuje ręczne testy; poza nimi tylko lista «tylko telefon»).
- Kroki w aplikacji: brak (dokument wydania).
- Opcje: (A) ZD-03: scenariusz 58 pokrywa ekran Trening z treningiem; telefon sprawdza stan «dziś bez treningu», plan i ustawienia; (B) dodać do scenariusza 58 stan bez treningu i zawęzić ZD-03 do VoiceOver i «Ogranicz ruch». Rekomendacja: A teraz, B w 1.0.1.
- Test akceptacyjny: ZD-03 odsyła do scenariusza 58 i nazywa, czego on nie pokrywa.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- Waluta (001): przyczyna i zachowanie w produkcji — tylko telefon po wydaniu (Z-36, R-WAL).
- Duży tekst (003): stan «dziś bez treningu» — telefon (ZD-03).
- Polityka na stronie marki (008): po eksporcie `scripts/site/eksport-apps4brew.mjs` i pushu w repo strony — `check-urls.yml` (Z-10a) i ponowne zamknięcie R-017 z dowodem; publikacja wymaga zgody właściciela.

## Kontrola dowodów i sekretów

`git status --porcelain` na początku i na końcu: puste (dowody/git-status-start.txt, dowody/git-status-koniec.txt) — pliki śledzone nietknięte; nic nie commitowano ani nie wypychano. Worktree sond utworzony i usunięty (`git worktree remove`, kod 0); wszystkie sondy były odczytem plików i testami w drzewie na 2385e75. Testy uruchamiane pojedynczo z `--maxWorkers=1`. Wynik `sprawdz-raport.mjs --rola 01-odkrywanie`: dowody/sprawdz-raport.txt (kod 0) Treść stron (Apple, strona marki) traktowana jako dane; poleceń w niej nie zauważono. W raporcie i dowodach brak e-maili, UDID, sekretów i nazw innych firm (rejestrator i dostawca poczty zamaskowani).

Nie sprawdzono: ścieżki w działającej aplikacji (zakup w piaskownicy, duży tekst na urządzeniu) — brak macOS/telefonu; Dysk Google («Trening App») — niedostępny.
