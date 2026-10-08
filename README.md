# Trening — natywna apka treningowa (Expo / React Native)

Tracker treningów w stylu Strong: szablony, serie (kg per hantel, powtórzenia, guma, +kg), timer przerw
z powiadomieniem na zablokowanym ekranie, historia, postępy, poranny wpis (BB/sen/waga), backup JSON.
Dane trzymane lokalnie w telefonie (SQLite). Od 0.1.1 (ADR-013) każda encja ma UUID, `ownerId`,
`createdAt`/`updatedAt`, a stan ma `schemaVersion` (dziś 16 — E2, docs/14) i rejestr modułów w ustawieniach.
Od 0.2.0: każde ćwiczenie ma typ metryki (ciężar+powtórzenia / powtórzenia / czas / dystans+czas / ciężar+czas),
ćwiczenia na czas mają wbudowany stoper serii z automatycznym odhaczeniem, opcjonalne RPE przy serii
(Ustawienia), a trening ma `loggedBy` i `sessionMode` oraz szkielet encji Feedback / NextSessionInstructions (ADR-016).
Od 0.2.1: typy serii W/D/F (tapnięcie w numer serii), przerwa zapamiętywana w ćwiczeniu (robocza i po rozgrzewce),
tryb liczenia ciężaru per ćwiczenie (per hantel ×2 / łącznie / jednostronne), gotowość z porannego wpisu w nagłówku
treningu, eksport CSV w układzie kolumn Strong (Więcej → Backup) i timery odtwarzane po zabiciu aplikacji.
Od 0.3.0: Postępy z wykresami (max ciężar / e1RM Epley / objętość / czas / dystans per sesja, objętość i serie
tygodniowo), rekordy per ćwiczenie i oznaczanie PR w trakcie treningu, w podsumowaniu po zakończeniu i w historii
(`lib/stats.ts`, `components/Chart.tsx`, react-native-svg).
Od 0.4.0: supersety (`groupId` na ćwiczeniu w treningu i szablonie; przerwa dopiero po ostatnim ćwiczeniu grupy),
partie mięśniowe główne/pomocnicze per ćwiczenie i serie tygodniowo per partia (1 / 0,5) w Postępach.
Od 0.5.0: ćwiczenia z masą ciała mają pole ±kg (plus = dociążenie, minus = asysta). Gumy od P-001 (02.10.2026) mają tylko
kolor i poziom 1–7 — bez kg; wybór gumy nie zmienia ±kg (dawne pole kg ze starych kopii odpada przy imporcie, T-055). Od rundy 75 (schemat 13) masa ciała nie wchodzi do objętości ani rekordu: rekord to suma
powtórzeń bez asysty, a objętość liczy się tylko z dociążenia. Od audytu 0.10 (08.10.2026) e1RM tych ćwiczeń liczy się tylko z opcjonalną
masą ciała w Ustawieniach (Epley na udziale masy ciała ± kg; udział ze źródeł — podciąganie, pompki: docs/research/masa-ciala-e1rm-2026-10.md).
Od rundy 75: podpowiedź progresji (↑ w nagłówku ćwiczenia), kopia automatyczna po treningu (Pliki → Na moim iPhonie →
Trening → Backup), przypomnienie o wadze w poniedziałek, pasek postępu sesji; baza w Library/SQLite (poza Plikami).
Od 0.9.0 (Q-019): przed importem i przed „Wyczyść wszystkie dane” zawsze kopia bezpieczeństwa w tym samym katalogu
(`trening-przed-importem-…`, `trening-przed-czyszczeniem-…`, osobno 10 najnowszych) — pomyłkę cofa import tej kopii.
Gdy przy starcie nie dało się odczytać zapisu, ta kopia niesie też jego surowy tekst (pole `recovery`, do ręcznego odzysku).
Od 0.6.0: opcjonalny zapis zakończonych treningów do Apple Health (Ustawienia; `lib/health.ts`,
@kingstinct/react-native-healthkit 8.x z config pluginem). Działa tylko w buildzie IPA / dev buildzie (bez modułu
natywnego, np. w testach, przełącznik pokazuje komunikat). Uwaga przy Sideloadly: HealthKit wymaga entitlementu
com.apple.developer.healthkit — darmowe Apple ID (Personal Team) go obsługuje, ale trzeba to potwierdzić na telefonie.
Od 0.7.0: timer przerwy i stoper serii na ekranie blokady / w Dynamic Island (Live Activity, iOS 16.2+):
lokalny moduł Expo `modules/rest-activity` (Swift, ActivityKit) + rozszerzenie widgetu `targets/rest-widget`
(SwiftUI, przez @bacons/apple-targets). Kod Swift NIE był kompilowany w środowisku, w którym powstał (brak Xcode) —
pierwszy build w GitHub Actions może wymagać poprawek; bez modułu natywnego (testy) jest null i timer działa jak w 0.6.
Przy Sideloadly rozszerzenie widgetu dostaje własny profil — jeśli instalacja odmówi, w Sideloadly zaznacz
„Remove app extensions” (stracisz tylko Live Activity).
Od 0.7.1: apka czyta datę wygaśnięcia profilu z `embedded.mobileprovision`; przy ≤2 dniach pokazuje baner na ekranie
Trening, w „Więcej” datę ważności, a dzień przed wygaśnięciem (18:00) wysyła lokalne przypomnienie o backupie i odnowieniu.
Od 0.8.0: polski i angielski (Ustawienia → Język: jak w telefonie / Polski / English) oraz kg/lb (dane zawsze w kg,
funty tylko przy wyświetlaniu). Teksty w `lib/i18n.ts` + słownik `lib/i18n.en.ts` (kluczem jest polski tekst);
`npm run check:i18n` wyłapuje teksty bez tłumaczenia. Nazwy ćwiczeń z biblioteki tłumaczy `exName()`, nazwy własne
zostają bez zmian. Przegląd „działa bez sieci i konta” (T-039) naprawił: pola liczbowe przyjmują przecinek/kropkę
(12,5 kg), przełączniki „Dźwięk i wibracja” i „Ekran włączony” wreszcie działają, „dziś” liczone w strefie telefonu
(nie UTC), usunięte uprawnienie Push (aps-environment — niepotrzebne do powiadomień lokalnych, a darmowe Apple ID go
nie podpisze; `plugins/withoutPushEntitlement.js`) i nieużywany tryb audio w tle; build w GitHub Actions wpisuje
uprawnienia (HealthKit) do binarki podpisem ad-hoc, żeby Sideloadly mógł je przenieść.
Backup to koperta `{ format: 'trening-backup', schemaVersion, exportedAt, state }`; import przyjmuje też
goły stan z wersji webowej v0.3 i z natywnej 0.1.0 — `migrate()` dopisuje brakujące pola.

## Struktura
```
app/            ekrany (expo-router): (tabs)/ Trening · Szablony · Ćwiczenia · Historia · Więcej
components/     ActiveWorkout (trening w toku + timer), ui (przyciski, pola)
lib/seed.ts     model danych + biblioteka ćwiczeń (125 pierwszych + katalog docs/research/equipment/catalog.json — razem 854) + gumy (bez szablonów — użytkownik ustawia je sam, decyzja 03.10.2026; szablony testowe: tests/fixtures/demo-templates.ts)
lib/store.ts    stan aplikacji + zapis do SQLite + logika treningu (previous, autofill, objętość)
lib/timer.ts    timer przerw + lokalne powiadomienia
lib/backup.ts   eksport/import JSON + CSV
lib/i18n.ts     języki PL/EN (t, tp, exName) + lib/i18n.en.ts słownik
lib/units.ts    kg/lb (zapis w kg)
scripts/check-i18n.mjs  kontrola kompletności tłumaczeń
.github/workflows/iphone-local.yml   droga główna: podpisany build ad hoc na macOS w GitHub Actions + link instalacji (bez limitu Expo)
.github/workflows/iphone-eas.yml     rejestracja urządzenia, konfiguracja podpisu, build w chmurze Expo (ostateczność)
.github/workflows/e2e-ios.yml        testy E2E Maestro na symulatorze iPhone
.github/workflows/ios-unsigned.yml   budowanie .ipa bez podpisu (zapas dla Sideloadly, bez płatnego konta)
```

## Droga główna (od 03.10.2026) — build lokalny „ad hoc” w GitHub Actions (płatne konto Apple Developer)
Repozytorium: `lkarwowski494/trening` — publiczne od 03.10.2026 (ADR-031), bez licencji: kod do wglądu, wszystkie prawa
zastrzeżone. Logi, podsumowania i artefakty przebiegów Actions widzi każdy: workflow maskuje UDID, a link rejestracji
nowego urządzenia na publicznym repo nie powstaje (patrz runbook na Drive: „Rejestracja nowego urządzenia”).
Build robi darmowa maszyna macOS w GitHub Actions — workflow **iPhone (lokalnie, bez limitu Expo)**
(`iphone-local.yml`: `eas build --local` z tymi samymi certyfikatami i profilami z EAS, potem `eas upload`, który daje
link do instalacji). Nie zużywa limitu buildów Expo (15 buildów iOS/mies. w darmowym planie, wspólne dla 3 aplikacji).
Build w chmurze Expo (workflow **iPhone (EAS)**, akcja `build`) to ostateczność — decyzja 03.10.2026. Workflow
**iPhone (EAS)** zostaje potrzebny do jednorazowej konfiguracji podpisu (niżej). Instalacja z linku na iPhonie, ważna
ok. roku, bez kabla i Sideloadly.
Od T-051 aplikacja jest na **Expo SDK 57** (React Native 0.86, React 19.2; minimum iOS 16.4) i wszystkie buildy idą przez
**Xcode 26**, którego od 28.04.2026 wymaga App Store Connect (także TestFlight). SDK 56+ wymaga Xcode 26.4+, więc workflowy
na macOS (`ios-unsigned.yml`, `e2e-ios.yml`, `iphone-local.yml`) działają na maszynie `macos-26` i wybierają najnowszy
zainstalowany Xcode 26.x (`scripts/ci/select-xcode.sh`; obraz 20260907: 26.6, SDK iOS 26.5; E2E na symulatorze iPhone 17).
Build w chmurze Expo używa obrazu `sdk-57` z `eas.json` (Xcode 26.6). Xcode 27 nie jest wybierany (aplikacje z SDK iOS 27
wymagają cyklu życia UIScene — osobne zadanie razem z SDK 58). Sama wysyłka do TestFlight to osobny, jeszcze niewłączony
krok (docs/13, B5).

Jednorazowo:
1. **App Store Connect → Users and Access → Integrations → App Store Connect API → Team Keys → +**:
   nazwa `EAS`, dostęp **Admin**. Pobierz plik `.p8` (tylko raz!), zanotuj **Key ID** i **Issuer ID**.
2. **developer.apple.com/account → Membership details**: zanotuj **Team ID** (10 znaków).
3. **expo.dev** (darmowe konto) → Account settings → **Access tokens → Create token**: zanotuj token.
4. GitHub → repozytorium → **Settings → Secrets and variables → Actions → New repository secret** (5 sekretów):
   `EXPO_TOKEN`, `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_API_KEY_P8` (cała treść pliku .p8, razem z liniami BEGIN/END).
5. **Actions → iPhone (EAS) → Run workflow → akcja `zarejestruj-iphone`**. W podsumowaniu przebiegu jest link —
   otwórz go na iPhonie w Safari i zainstaluj profil (Ustawienia → Pobrano profil). Na publicznym repozytorium ta akcja
   kończy się błędem (link rejestracji byłby widoczny dla wszystkich); iPhone właściciela jest już zarejestrowany,
   sposób na kolejne urządzenie — T-061.
6. **Run workflow → akcja `konfiguruj-podpis`** (certyfikat dystrybucyjny + profile dla aplikacji i widżetu).
7. iPhone: **Ustawienia → Prywatność i ochrona → Tryb dewelopera** (wymagany też dla instalacji ad hoc).

Każda nowa wersja: **Actions → iPhone (lokalnie, bez limitu Expo) → Run workflow** (gałąź w polu „Use workflow from”,
`wyslij` = tak): testy, build na maszynie `macos-26`, `eas upload`. Link „Install” jest w podsumowaniu przebiegu —
otwórz go w Safari na iPhonie. `wyslij` = nie: tylko sprawdzenie, czy podpisany build przechodzi. Gdy build lokalny
zawiedzie: **iPhone (EAS) → akcja `build`** (chmura Expo, zużywa limit; link także na expo.dev → Projects → trening → Builds).
Nowe urządzenie: T-061 (punkt 5) — `iphone-local.yml` używa profilu, który już jest, i nowych urządzeń nie dopisuje.
Odnowienie podpisu (ok. raz w roku; data w zakładce Więcej w ostatnich 30 dniach, baner 2 dni przed): backup, potem build
i instalacja z linku — dane zostają. Otwarte pytanie (do sprawdzenia przy pierwszym odnowieniu): czy po wygaśnięciu
certyfikatu dystrybucyjnego trzeba najpierw powtórzyć `konfiguruj-podpis`.

Testy na symulatorze: **Actions → E2E iOS (symulator) → Run workflow** (ręcznie przed wydaniem; scenariusze w `.maestro/`,
zrzuty ekranu w artefakcie `e2e-ios`). Drogi z Kroków 2–3 (bez podpisu + Sideloadly) zostają jako zapas.

## Krok 0 — narzędzia (raz)
1. Node.js LTS (20+): https://nodejs.org
2. Git + konto GitHub (darmowe): https://github.com
3. Windows: iTunes **i** iCloud w wersjach ze strony Apple (instalatory „web”, nie z Microsoft Store — wersje ze Store najpierw odinstaluj); na Macu niepotrzebne
4. Sideloadly: https://sideloadly.io
5. Osobne, darmowe Apple ID tylko do podpisywania (nie główne konto)

## Krok 1 — uruchom projekt na komputerze
```
npm ci                      # dokładnie te wersje, co w chmurze (package-lock.json)
npm run typecheck           # TypeScript, powinno przejść bez błędów
npm run verify              # typy, tłumaczenia, testy (1000+), eksport bundla, kontrola konfiguracji natywnej
```
Uwaga (stan na 10.2026): Expo Go z App Store obsługuje tylko najnowsze SDK, a starszej wersji nie da się
zainstalować na fizycznym iPhonie — projektu na SDK 57 NIE otworzysz w Expo Go z App Store („Project is incompatible
with this version of Expo Go”; Expo Go dla SDK 57 czekało w 10.2026 na zatwierdzenie Apple, dostępne tylko przez `eas go`).
Pętla rozwoju to: zmiana → `npm run verify` → build lokalny z linkiem instalacji (Droga główna); Kroki 2–3
(IPA bez podpisu + Sideloadly) to zapas. Szybszą pętlę dałby dev client (`expo-dev-client` + build) — decyzja na później.

## Krok 2 (zapas, darmowe Apple ID) — zbuduj .ipa bez podpisu (GitHub Actions)
1. Utwórz puste repozytorium na github.com (New repository, bez README), a w folderze projektu:
   ```
   git config --global user.name "Łukasz"          # raz, przy świeżo zainstalowanym Gicie
   git config --global user.email "twoj@mail"
   git init
   git add .
   git commit -m "Trening 0.8.4"
   git branch -M main
   git remote add origin https://github.com/<twoj-login>/trening.git
   git push -u origin main
   ```
   Repozytorium publiczne ma darmowe standardowe maszyny GitHuba (także macOS) bez limitu minut; prywatne zużywa
   miesięczny limit 2000 min, a minuta macOS liczy się ×10 (incydent 02/03.10.2026 — ADR-031).
2. Zakładka **Actions** → workflow **iOS unsigned IPA** → **Run workflow** (workflow pojawia się po wypchnięciu na `main`)
3. Po ~30–45 min pobierz artefakt `Trening-unsigned-ipa` (zip z plikiem `Trening-unsigned.ipa`). Zachowaj plik .ipa
   u siebie — artefakty na GitHubie wygasają, a ten sam plik posłuży do odnawiania podpisu co 7 dni.
4. Gdy przebieg się nie uda: w przebiegu jest artefakt z logiem kompilacji — wklej Claude'owi błąd z końca logu.

## Krok 3 (zapas, darmowe Apple ID) — zainstaluj na iPhonie (Sideloadly)
1. Podepnij iPhone kablem, na telefonie „Ufaj temu komputerowi"
2. Sideloadly: przeciągnij `Trening-unsigned.ipa`, wpisz Apple ID (to osobne), **Start**.
   Zawsze to samo Apple ID i NIE zaznaczaj „Change Bundle ID” — inne ID instaluje drugą, pustą aplikację obok
   (dane zostają tylko przy instalacji „na” tę samą).
3. iPhone (iOS 16+): Ustawienia → Prywatność i ochrona → **Tryb dewelopera** → włącz, uruchom ponownie telefon
   i potwierdź „Włącz”. Przełącznik pojawia się dopiero po pierwszej instalacji z Sideloadly. Bez tego aplikacja
   pokaże „Developer Mode Required” i się nie uruchomi.
4. iPhone: Ustawienia → Ogólne → VPN i zarządzanie urządzeniem → zaufaj profilowi dewelopera (raz)
5. Co 7 dni: podepnij telefon → Sideloadly → Start (2 minuty; dane w apce zostają).
   Kopie automatyczne (Pliki → Trening → Backup) znikają razem z aplikacją — przed jej usunięciem wyeksportuj backup.
   W Sideloadly jest też odświeżanie przez Wi‑Fi, gdy komputer i telefon są w jednej sieci.

## Krok 4 (kiedyś) — App Store
Ten sam kod. Potrzebne: Apple Developer Program ($99/rok), `npm i -g eas-cli`, `eas build -p ios`,
`eas submit -p ios`, ikona 1024×1024 (podmień `assets/icon.png`), screeny, strona z polityką prywatności.

## Praca z Claude Code
Otwórz folder projektu w Claude Code i mów, co zmienić — np. „dodaj wykres objętości w Postępach",
„zrób superserie", „przenieś przycisk Zakończ wyżej". Po każdej zmianie: `npm run typecheck`,
`npm run verify`, a gdy jesteś zadowolony — commit, push i build lokalny z linkiem instalacji (Droga główna; Kroki 2–3 — zapas) (Expo Go z App Store nie obsługuje SDK 57 — patrz Krok 1).
Jeśli `npm install` zgłosi konflikt wersji: `npx expo install --fix` dopasowuje pakiety do SDK 57 z `package.json`
(nie twórz nowego projektu przez `create-expo-app@latest` — dałby najnowsze SDK, niezgodne z tym kodem).

## Import danych z wersji webowej
W apce webowej: Więcej → Backup → „Pobierz plik backupu". Plik JSON wyślij sobie (AirDrop/iCloud/Mail)
i w natywnej apce: Więcej → Backup → Importuj.
