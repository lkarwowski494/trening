# Kroki właściciela: prywatne repo z danymi z App Store Connect (KO-106)

Stan: 22.11.2026. Prowadzi koordynator, krok po kroku (jedno zadanie naraz, bez zbiorczej listy). Cel: dane z App Store Connect (App Analytics, metadane w sprzedaży) trafiają do **prywatnego** repo, a nie do publicznego `trening` ani jego logów.
Czas: ok. 15 minut łącznie. Nie wysyłaj klucza `.p8` na czat ani do żadnego repo.

Źródła (odczyt 22.11.2026): GitHub Docs „Creating a new repository”, „Using secrets in GitHub Actions”, „Manually running a workflow”, „Events that trigger workflows” (schedule), „GitHub Actions billing”, „Actions runner pricing”; Apple „Creating API Keys for App Store Connect API”, „Generating Tokens for API Requests” (developer.apple.com/documentation/appstoreconnectapi/…).

## Krok 1. Prywatne repo (2 min)
GitHub → w prawym górnym rogu „+” → „New repository”. Właściciel: Twoje konto; nazwa robocza `trening-dane` (do potwierdzenia; tylko litery, cyfry, `.`, `-`, `_`); widoczność: **Private**; zaznacz „Add a README file” (potrzebna gałąź domyślna: harmonogram GitHub działa tylko na ostatnim commicie gałęzi domyślnej); „Create repository”.
(GitHub Docs, Creating a new repository: „In the upper-right corner of any page, select …, then click New repository” … „Choose a repository visibility” … „Click Create repository”; Events that trigger workflows, schedule: „Last commit on default branch”.)

## Krok 2. Klucz API App Store Connect (5 min) — wybierz A albo B
Wartość `.p8` Apple pozwala pobrać **jeden raz** („The private key is available for download a single time … Apple doesn’t keep a copy of the private key.”).
- **A (masz zapisany plik `AuthKey_XXXX.p8` z pierwszego klucza „GitHub”):** użyj go; Key ID i Issuer ID są na tej samej stronie.
- **B (nie masz pliku) — rekomendowane także, gdy masz:** nowy klucz tylko dla tego repo, żeby w razie wycieku unieważnić go osobno. App Store Connect → Users and Access → zakładka Integrations → App Store Connect API → karta **Team Keys** → „Generate API Key” albo „+” → nazwa (np. `trening-dane`) → w polu Access rola **Admin** (tylko Admin może utworzyć żądanie raportu; odczyt raportów mają też Finance i Sales and Reports) → Generate → przy nowym kluczu „Download API Key” (jedno pobranie).
  (Apple, Creating API Keys: „To generate team keys, you must have an Admin account”; analytics: „Admin | Request Reports …”.)
- **Key ID:** Users and Access → Integrations → kolumna z identyfikatorami pod „Active”; najedź kursorem → „Copy Key ID”.
- **Issuer ID:** ta sama strona Integrations (Apple: „To get your issuer ID … Select Users and Access. Select the Integrations tab.”).

## Krok 3. Trzy sekrety w prywatnym repo (3 min)
Prywatne repo → Settings → w sekcji „Security” Secrets and variables → Actions → „New repository secret”. Dodaj trzy, nazwy dokładnie takie:
1. `ASC_KEY_ID` — Key ID.
2. `ASC_ISSUER_ID` — Issuer ID.
3. `ASC_KEY_P8` — **cała** zawartość pliku `.p8` (z wierszami `-----BEGIN PRIVATE KEY-----` i `-----END PRIVATE KEY-----`), tak jak w publicznym repo (docs/15 wiersz 342).
(GitHub Docs: „In the Name field, type a name for your secret.” … „Click New repository secret”.)

## Krok 4. Workflow w prywatnym repo (3 min)
Skopiuj plik `scripts/asc/prywatne-repo/asc-dane.yml` z publicznego repo `trening` (gałąź `ci/asc-analityka`) do prywatnego jako `.github/workflows/asc-dane.yml` na gałęzi domyślnej (GitHub → Add file → Create new file → wpisz ścieżkę → wklej → Commit). Koordynator poda dokładny moment i gałąź/SHA (pole `SKRYPTY_REF` w pliku).
Alternatywa: napisz „wgraj za mnie” — koordynator zrobi to, gdy nadasz dostęp agentom do prywatnego repo (Krok 5).

## Krok 5. Dostęp agentów do danych (2 min)
Agenci czytają prywatne repo przez `add_repo`; wymaga ono, aby aplikacja Claude na GitHubie miała dostęp do tego repo: GitHub → Settings → Applications → Claude → Configure → Repository access → dodaj `trening-dane`. **[DO USTALENIA]** czy instalacja obejmuje wybrane repozytoria czy wszystkie — koordynator sprawdzi przy `add_repo` i powie, czy ten krok jest potrzebny.

## Krok 6. Pierwszy przebieg (koordynator prowadzi, 2 min z Twojej strony)
Prywatne repo → Actions → „ASC dane” → „Run workflow” (gałąź domyślna) → zaznacz **zapisz_zadanie** → „Run workflow”. To jedyny zapis w App Store Connect: jedno żądanie raportu ONGOING dla aplikacji (zgoda z 22.11.2026), tworzone tylko gdy żadne nie istnieje. Metadane na żywo zapiszą się od razu; App Analytics Apple wyda po 1–2 dniach. Potem workflow biegnie sam co poniedziałek.

## Ile to kosztuje i co się zdarza
- Prywatne repo: przebiegi liczą się do puli GitHub Free ($12 miesięcznie wliczone; „The included compute usage is expressed as a monetary amount”); Linux 2-core to $0.006 za minutę („Actions runner pricing”). Przebieg ok. 3 minut raz w tygodniu to rząd 10 centów miesięcznie, czyli 0 zł w praktyce; pomiar po pierwszych przebiegach.
- Jeśli harmonogram zostanie wstrzymany: GitHub wyłącza go automatycznie po 60 dniach bez aktywności tylko w repo **publicznych**; w prywatnym tej reguły nie czytałem — co tydzień i tak jest commit z danymi, więc aktywność jest.
- Nic z liczb nie trafia do publicznego repo ani jego logów: skrypty zapisują wyłącznie do katalogu `dane/` prywatnego repo.
