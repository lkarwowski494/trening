# Trening — natywna aplikacja treningowa (Expo / React Native)

Dziennik treningu siłowego na iPhone'a: szablony i trening z kartą bieżącej serii, przerwy z powiadomieniem i Live Activity,
supersety, typy serii, zamiana ćwiczenia w trakcie, plan tygodnia z Kalendarzem, generator szablonów i planu (na polecenie
użytkownika), deload, postępy z wykresami, rekordami, mapą mięśni i podsumowaniem tygodnia/miesiąca, miejsca i sprzęt,
26 języków, kg/lb, kopia zapasowa JSON i eksport CSV, opcjonalny zapis treningów do Apple Health.
Dane wyłącznie lokalnie w telefonie (SQLite); aplikacja nie łączy się z siecią.

Stan prac, decyzje właściciela i dokumentacja: `docs/` (po polsku) — przekazanie i decyzje `docs/18`, plan testów `docs/09`,
definicja ukończenia `docs/20`, roadmapa `docs/21`, ostatni audyt `docs/25`. Zasady pracy: `CLAUDE.md`.
Model danych: stan z `schemaVersion` (`lib/seed.ts`), migracje w `migrate()` (`lib/store.ts`); backup to koperta
`{ format: 'trening-backup', schemaVersion, exportedAt, state }`.

## Struktura
```
app/            ekrany (expo-router): (tabs)/ Trening · Szablony · Ćwiczenia · Kalendarz · Więcej
components/     ActiveWorkout (trening w toku), ui (przyciski, pola), kalendarz, dashboard, wykresy, mapa mięśni
lib/            logika: store (stan + SQLite), plan, generator, stats, timer, backup, i18n (+ i18n.en.ts, locales/)
modules/, targets/   Live Activity przerwy (Swift)
tests/          testy Jest (macierz: docs/19, `npm run check:matrix`)
.maestro/       scenariusze E2E (Maestro, symulator iPhone)
.github/workflows/testflight.yml   build i wysyłka do TestFlight narzędziami Apple (droga instalacji)
.github/workflows/e2e-ios.yml      E2E na symulatorze (ręcznie; samo po wypchnięciu na main i integration/**)
.github/workflows/tests.yml        testy przy każdym wypchnięciu
.github/workflows/nightly.yml, tests-tz.yml   noc: losowe sekwencje, mutacje, E2E na małym ekranie; strefy czasowe
.github/workflows/ios-unsigned.yml kompilacja .ipa bez podpisu (sprawdzenie kodu natywnego)
```

## Instalacja na iPhonie — TestFlight
Od 06.10.2026 (docs/15): **Actions → „TestFlight (testy wewnętrzne)” → Run workflow** (gałąź w „Use workflow from”).
Workflow uruchamia testy, buduje i podpisuje aplikację wyłącznie narzędziami Apple (klucz App Store Connect API z sekretów
`ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`) i wysyła ją do App Store Connect. Numer buildu: 1000 + numer przebiegu
(baza w zmiennej repozytorium `BUILD_BASE`, domyślnie 1000). Build pojawia się w aplikacji TestFlight po przetworzeniu
przez Apple. Testerzy zewnętrzni dostają build po przeglądzie Apple (beta review).
Buildy przez Expo (EAS) i instalacja „ad hoc” zostały usunięte 08.10.2026 (decyzja właściciela po audycie — docs/18).

Repozytorium jest **publiczne** (ADR-031): logi, podsumowania i artefakty przebiegów widzi każdy. Workflowy mają uprawnienia
tylko do odczytu, nie uruchamiają się dla obcych zmian (brak `pull_request`), artefakty trzymane są 1 dzień.
Darmowe maszyny GitHuba (także macOS) wynikają z tego, że repozytorium jest publiczne.

## Praca nad kodem
```
npm ci                      # dokładnie te wersje, co w CI (package-lock.json)
npm run verify              # typy, tłumaczenia, testy, macierz testów, eksport bundla, kontrola konfiguracji natywnej
```
Natywnego builda nie da się sprawdzić na Linuksie: kompilacja — `ios-unsigned.yml`, scenariusze na symulatorze — `e2e-ios.yml`,
telefon — TestFlight. Expo Go z App Store nie obsługuje SDK 57 (projekt jest na Expo SDK 57, React Native 0.86).
Jeśli `npm install` zgłosi konflikt wersji: `npx expo install --fix` (nie twórz nowego projektu przez `create-expo-app@latest`).

## Zapas bez płatnego konta — .ipa bez podpisu i Sideloadly
**Actions → iOS unsigned IPA → Run workflow**, artefakt `Trening-unsigned-ipa`; instalacja przez Sideloadly z osobnym,
darmowym Apple ID (podpis ważny 7 dni, Tryb dewelopera w iPhonie). Przed usunięciem aplikacji wyeksportuj kopię
(Więcej → Backup) — kopie automatyczne znikają razem z aplikacją.

## Import danych
Więcej → Backup → Importuj (plik JSON z tej aplikacji lub z dawnej wersji webowej). Przed importem i przed „Wyczyść wszystkie dane”
aplikacja zawsze zapisuje kopię bezpieczeństwa w tym samym katalogu.
