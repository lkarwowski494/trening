# 04 Studio Projektowe — fix, pętla 2 (28.10.2026) — wynik

**Commit:** `ee43b82` → M1-audytor-generalny-039; 04-studio-projektowe-601 (gałąź naprawy/M2-koordynator-napraw-2026-10-28-p1, bez push).
**Wdrożono:** DEC-11 a — karta `paywall-owned` bez `accessible` (app/paywall.tsx:84), nagłówek karty ma rolę header i własny język wymowy (app/paywall.tsx:88), przycisk „Zarządzaj subskrypcją” osobnym elementem (app/paywall.tsx:93).
**Testy przed/po:**
- strażnik S19 (tests/interaction-guards.test.ts:281, skan AST app/ i components/): przed czerwony, jedno trafienie `app/paywall.tsx:84 "paywall-owned"` (dowody/test-przed-s19.txt); po 43/43 zielone (dowody/test-po-s19.txt).
- tests/voiceover-grupa-przycisk.test.tsx (render: miesięczna, dożywotni + odnawiająca się subskrypcja, EN): przed 3/3 czerwone, `Expected: not true` / `Received: "paywall-owned"` (dowody/test-przed.txt); po 3/3 zielone (dowody/test-po.txt).
- Symulacja Maestro na drzewie dostępności (tests/maestro-flows.test.tsx, scenariusz 21): przed czerwona, „tapOn "Manage subscription" — Nie znaleziono elementu”, bo karta była jedną etykietą (dowody/maestro-21-przed.txt); po zielona (dowody/maestro-21-po.txt).
- test:fast 106/106, typecheck, lint, check:i18n, check:decyzje, kontrola-brd: kod 0 (dowody/test-fast.txt, dowody/typecheck.txt, dowody/kontrole.txt).
**Scenariusz Maestro:** .maestro/21-subskrypcja.yaml:95. Po zakupie stuka „Manage subscription”, potem sprawdza, że karta „Your plan: yearly” nadal jest widoczna i nie ma komunikatu „An internet connection is needed.”. Przebieg E2E `tylko_scenariusze` (21) uruchamia koordynator.
**Przekazania:** do 08 (programista): ten sam mechanizm pilnuje teraz S19 w całym UI, a komponent z `onPress` przekazany jako dziecko skan widzi tylko po atrybucie w miejscu użycia (docs/32, wiersz S19). Do 07 (jakość/E2E): przebieg `tylko_scenariusze: 21`; dodatkowo przegląd ścieżki wrażliwej (zakupy) nie odbył się, polecenie jest w przeglad-sciezki-wrazliwej.md.
**Otwarte:** zrzuty przed/po nie dotyczą, bo wygląd się nie zmienia (zmiana dotyczy tylko drzewa dostępności); status „zweryfikowane” nadaje reaudit.
**Krok właściciela (VoiceOver na telefonie, ok. 2 min):** TestFlight z aktywną subskrypcją → Więcej → Ustawienia → „Masz plan: …” → VoiceOver: przesuwaj w prawo po karcie. Każdy z elementów „Masz plan: …” (nagłówek), „Dostęp do …” i „Zarządzaj subskrypcją, przycisk” ma być czytany osobno, a stuknięcie dwukrotne na przycisku ma otworzyć arkusz subskrypcji Apple.

## Dowody (pełne)

| ID | Test | Przed | Po | Commit |
|---|---|---|---|---|
| 04-studio-projektowe-601 / M1-audytor-generalny-039 | S19 w tests/interaction-guards.test.ts | czerwony: dowody/test-przed-s19.txt, dowody/s19-skan-przed.txt | zielony: dowody/test-po-s19.txt | ee43b82 |
| j.w. | tests/voiceover-grupa-przycisk.test.tsx | 3 czerwone: dowody/test-przed.txt | 3 zielone: dowody/test-po.txt | ee43b82 |
| j.w. | scenariusz 21 w tests/maestro-flows.test.tsx | czerwony: dowody/maestro-21-przed.txt | zielony: dowody/maestro-21-po.txt | ee43b82 |

- Przebiegi „przed” zrobiłem na `app/paywall.tsx` z HEAD `e6114d1`, z już zmienionymi testami i scenariuszem; po przebiegu przywróciłem plik z poprawką.
- Wyszukanie ponowne mechanizmu: S19 na całym `app/` i `components/` przed poprawką znalazł jedno miejsce (`app/paywall.tsx:84`), a po niej żadnego. Innych wystąpień nie było.
- Zmienione dokumenty:
  - docs/32: wzorzec 23 i wiersz S19;
  - docs/brd/wymagania.md: scenariusz „Zarządzanie subskrypcją z VoiceOver” w BR-ZAK-003;
  - docs/18: DEC-11 zmienione na `[wdrożenie: kod] [test: tests/voiceover-grupa-przycisk.test.tsx]`;
  - tests/przeplywy.json: krok i znacznik „Manage subscription”;
  - pliki generowane: README, docs/19, docs/37 (macierz po commicie bez zmian).
- Diff: dowody/diff-ee43b82.patch

## Nowe znaleziska (bez naprawy)
- **Obserwacja procesu, nie aplikacji.** Hak `afterEach` z `jest.useRealTimers()` wewnątrz `describe` biegnie przed sprzątaniem drzewa przez bibliotekę testową, a wtedy przebieg Jest zawiesza się bez komunikatu. Kosztowało to kilka przebiegów, a jeden osierocony proces Jest pracował ok. 35 min na wspólnej maszynie. W teście hak przeniosłem na najwyższy poziom, z komentarzem. Propozycja dla 07: strażnik, który zabrania `useRealTimers` w `afterEach` wewnątrz `describe` w testach renderujących.
- Nazwa pliku `tests/audit-m1-039-ru-units.test.ts` nosi w nagłówku ID „M1-audytor-generalny-039”, a to ID należy teraz do tego zadania. Do wyjaśnienia przez koordynatora: kolizja numeracji.

## Kontrola raportu
Wynik `node narzedzia/sprawdz-raport.mjs wynik.md /home/user/trening`: zobacz dowody/sprawdz-raport.txt
