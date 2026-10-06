# Trening — zasady dla agenta

- Repozytorium jest PUBLICZNE (ADR-031). Nigdy nie commituj sekretów (EXPO_TOKEN, certyfikaty, .p8/.p12, .env) ani danych
  osobowych (UDID, e-mail). Przed commitem sprawdź `git diff --cached`. Logi CI też są publiczne — maskuj UDID jak w `iphone-local.yml`.
- Narzędzia: 0 zł poza opłatą Apple. macOS w GitHub Actions jest darmowy tylko dlatego, że repo jest publiczne. Buildy w chmurze
  Expo to ostateczność (15 buildów iOS/mies. na 3 aplikacje) — używaj `iphone-local.yml` (`eas build --local` + `eas upload`).
- Testy przed kodem. Każdy błąd z audytu dostaje test, który go odtwarza (`tests/regress.test.tsx`, plan w `docs/09-plan-testow.md`).
- Macierz testów (polecenie właściciela 06.10.2026): każdy ekran, element UI, komunikat, funkcja `lib/` i wartość wymiaru ma test;
  `npm run check:matrix` (część verify) blokuje braki, `docs/19-macierz-testow.md` generuje `node scripts/test-matrix.mjs --write`.
  Przy każdej zmianie: nowe zachowanie → test scenariuszowy/macierzowy, nie tylko wzmianka tekstu. Wyjątki tylko z powodem (`tests/matrix-exceptions.json`).
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

## Merytoryczne podstawy (zasada właściciela z 4 października 2026, obowiązuje we wszystkich jego aplikacjach)

Wszystko, czego aplikacja uczy albo co twierdzi (treść, liczby, zalecenia, reguły i mechaniki oparte na wiedzy dziedzinowej), musi mieć merytoryczne podstawy. Ta zasada ma pierwszeństwo przed domyślnym sposobem pracy.

- Każde twierdzenie ma **przeczytane** źródło (adres i cytat albo dokładne wskazanie miejsca). Streszczenie z wyszukiwarki nie jest źródłem. Czego nie da się potwierdzić, trafia do otwartych pytań, nie do aplikacji.
- Źródła według hierarchii poniżej; przy sprzeczności wygrywa wyższy szczebel. Przy sprzeczności na tym samym szczeblu podaj część wspólną (przedział, „zwykle”) i pokaż różnicę.
- Właściciel nie jest ekspertem dziedzinowym i **nie rozstrzyga kwestii merytorycznych**: rozstrzyga je ta hierarchia. Właściciela pytaj o sprawy produktowe (zakres, funkcje, wygląd, koszty, kolejność prac), zawsze z co najmniej dwiema opcjami, kompromisami i rekomendacją.
- Każdą decyzję merytoryczną zapisz w rejestrze projektu (dokumentacja na Google Drive) z uzasadnieniem i odrzuconymi alternatywami, żeby dało się ją sprawdzić i cofnąć. Właściciel może każdą zawetować.
- Uproszczenie jest dozwolone, gdy kierunkowo zgadza się z wyższymi szczeblami i jest nazwane uproszczeniem.

### Hierarchia źródeł dla treningu i zdrowia

1. Rachunek i wzory z publikacji źródłowych (np. e1RM Epley, objętość), sprawdzone niezależnie.
2. Przeglądy systematyczne i metaanalizy oraz stanowiska organizacji naukowych (np. ACSM, NSCA, ISSN).
3. Pojedyncze badania z recenzowanych czasopism (najlepiej RCT) i książki uznanych autorów (np. Helms i in. „The Muscle and Strength Pyramids”, Israetel i in. „Scientific Principles of Hypertrophy Training”, Zatsiorsky i Kraemer „Science and Practice of Strength Training”).
4. Uznane serwisy specjalistyczne (np. Stronger by Science) oraz dokumentacja producentów sprzętu i aplikacji.
5. Praktyka i opinie trenerów tylko jako wskazówka, wyraźnie oznaczona.

Aplikacja nie udziela porad medycznych; tam, gdzie chodzi o zdrowie (ból, kontuzje, choroby), odsyła do specjalisty.

Dokumentacja projektu: Google Drive, folder „Trening App” (m.in. 03 Rejestr decyzji, 04 Backlog).
