# Trening — zasady dla agenta

- Repozytorium jest PUBLICZNE (ADR-031). Nigdy nie commituj sekretów (EXPO_TOKEN, certyfikaty, .p8/.p12, .env) ani danych
  osobowych (UDID, e-mail). Przed commitem sprawdź `git diff --cached`. Logi CI też są publiczne — maskuj UDID jak w `iphone-local.yml`.
- Narzędzia: 0 zł poza opłatą Apple. macOS w GitHub Actions jest darmowy tylko dlatego, że repo jest publiczne. Buildy w chmurze
  Expo to ostateczność (15 buildów iOS/mies. na 3 aplikacje) — używaj `iphone-local.yml` (`eas build --local` + `eas upload`).
- Testy przed kodem. Każdy błąd z audytu dostaje test, który go odtwarza (`tests/regress.test.tsx`, plan w `docs/09-plan-testow.md`).
- Przed commitem: `npm run verify` (typecheck, check:i18n, jest, `expo export --platform ios`, verify:native). Nowe teksty w UI
  przez `t()` i słownik `lib/i18n.en.ts`.
- Liczby (progi, limity, czasy) w jednym miejscu; dokumenty generowane z kodu, nie przepisywane ręcznie (wzór: `gen.mjs --check`).
- Dokumentacja w `docs/` (po polsku): stan prac i decyzje właściciela zapisuj tam, z datą. Specyfikacja w toku: E2 —
  `docs/14-e2-specyfikacja.md` (decyzje: docs/13 A5 i docs/14 pkt 9). Nie zgaduj liczb nieznanego pochodzenia — oznacz jako otwarte.
- Decyzje produktowe należą do właściciela: przedstaw co najmniej dwie opcje z kompromisami i rekomendację.
- Szablony treningów ustawia właściciel — aplikacja ich nie tworzy ani nie zmienia sama (decyzja 03.10.2026, 08:11).
- Natywnego builda nie da się sprawdzić na Linuksie: `ios-unsigned.yml` (kompilacja), `e2e-ios.yml` (Maestro na symulatorze;
  zmiana tylko scenariuszy → `aplikacja_z_przebiegu`), `iphone-local.yml` (instalacja na telefonie). Symulator na `macos-26` bywa wolny —
  awaria przed pierwszym scenariuszem to maszyna; jedno powtórzenie, potem szukaj przyczyny.
- Gałęzie: praca na gałęzi funkcji od `integration/0.9.0`; scalenie do `main` tylko na polecenie właściciela. Nie łącz aktualizacji SDK ze zmianą
  schematu danych w jednym wydaniu.
