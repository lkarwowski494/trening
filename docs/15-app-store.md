# 15. Publikacja w App Store — decyzje i plan (stan 05.10.2026)

## Decyzje właściciela

Rozmowa 05.10.2026, rano: „Chciałbym móc opublikować to w Apple Store” i odpowiedzi na pytania.

- **Publikacja:** „Jeszcze nie publikujemy, zastanowimy się nad tym za chwilę” — **nic nie jest wysyłane** do App Store Connect.
- **Wysyłka (gdy przyjdzie czas):** GitHub Actions i klucz App Store Connect API (.p8).
  - Build na darmowym macOS, jak `iphone-local.yml`. Wysyłka przez `xcrun altool`.
  - Klucz tylko jako sekret GitHub, nigdy w repo (CLAUDE.md, ADR-031). Bez `eas submit`: limitów darmowego planu dla Submit nie sprawdzono.
- **Polityka prywatności:** GitHub Pages z tego repozytorium (`docs/`).
  - Treść: brak zbierania danych, wszystko lokalnie na telefonie, HealthKit tylko zapis zakończonych treningów.
- **Cena:** „Darmowa na start” (05.10.2026) — bez reklam i zakupów; w App Store Connect deklaracja „nie jestem traderem” (DSA), bez publicznego adresu.
- **Płatności później, wcześniejsi użytkownicy za darmo** (właściciel 05.10.2026: „Później najwyżej wprowadzimy płatności, ale tym, co już mają, to zostawimy darmową”).
  Kierunek (do decyzji, gdy przyjdzie czas): aplikacja dalej darmowa do pobrania, wersja Pro jako zakup w aplikacji;
  kto pobrał przed wersją płatną, ma Pro bez opłaty — StoreKit 2 `AppTransaction.originalAppVersion` (Apple podaje numer
  **buildu** z pierwszego pobrania, nie wersję marketingową). Wymóg już dziś: numery buildów tylko rosną i są zapisywane
  (EAS `appVersionSource: remote` + `autoIncrement`). Płatna wersja = status tradera (DSA: adres i telefon publicznie) i PIT.
- **Okres próbny dla nowych** (właściciel 05.10.2026: „Nowi użytkownicy powinni dostać 30 dni za darmo. Może nawet 60”;
  wcześniejsi — darmowo do końca, „chyba że zrezygnuje z darmowej subskrypcji, a później zdecyduje się wrócić”). Ustalenia:
  - Aplikacja płatna przy pobraniu nie może mieć okresu próbnego w App Store — okres próbny wymaga darmowego pobrania i zakupu w aplikacji.
  - Subskrypcja: darmowy okres próbny Apple ma stałe długości (m.in. 1 miesiąc, 2 miesiące — nie „30/60 dni”); zmienia się go w App Store Connect bez nowej wersji.
  - Jednorazowy zakup „Pro” + okres próbny liczony przez aplikację: dokładnie 30/60 dni (wytyczne Apple 3.1.1 dopuszczają darmowy zakup „trial”).
  - Wcześniejsi użytkownicy: dostęp przypisany do konta Apple (pierwsze pobranie przed wersją płatną) nie ma czego „anulować”, więc
    warunku „zrezygnuje i wróci” nie da się wiarygodnie sprawdzić (usunięcia aplikacji iOS nie zgłasza). Otwarte: zostawić dostęp na zawsze.
  - **Decyzja właściciela 05.10.2026:** „Ci, co teraz pobiorą, będą mieli za darmo. A jak wprowadzimy płatności, to subskrypcja
    będzie płatna po 30 dniach.” → wcześniejsi użytkownicy: dostęp na zawsze (konto Apple, `originalAppVersion` < pierwszy płatny build);
    nowi: subskrypcja z darmowym okresem próbnym **1 miesiąc** (najbliższa „30 dniom” długość w App Store Connect).
  - **Zakres (właściciel 05.10.2026):** „Cała aplikacja stanie się płatna po jakimś czasie” — po okresie próbnym bez subskrypcji
    aplikacja zablokowana (bez wersji „darmowa + Pro”).
  - **Po próbie bez subskrypcji (właściciel 05.10.2026: „Wybieram 1”):** treningi zablokowane, ale kopia zapasowa i eksport danych działają.
  - Otwarte: ceny
    (miesięczna/roczna), data wprowadzenia płatności, Small Business Program (prowizja 15%).
  Konto: Apple Developer jako osoba fizyczna (Individual) — firma niepotrzebna.
- **Nazwa:** otwarta. Propozycja „Trening” — do sprawdzenia w sklepie.

## Zmiany w aplikacji już zrobione pod publikację

- **Poranny wpis usunięty z aplikacji** (decyzja 05.10.2026: „Nie wszyscy mają czym to mierzyć”, wariant „usunąć z aplikacji”).
  - Zniknęły: ekran `more/morning`, pozycje na ekranie głównym i w Więcej, dopisek „BB · sen” w nagłówku treningu i przypomnienie o wadze.
  - Przypomnienie zaplanowane przez starszą wersję jest odwoływane przy starcie.
  - Zapisane wpisy (`State.mornings`) **zostają** w danych i w kopii — możliwy powrót.
  - Przy okazji znika nazwa „Body Battery” (znak towarowy Garmina), która przy recenzji Apple byłaby ryzykiem.
  - Podpowiedź notatki treningu: „np. samopoczucie, ból, sprzęt”.
  - Testy: `tests/morning-removed.test.tsx`.

## Do zrobienia przed pierwszą wysyłką (otwarte)

1. **Twoja reguła publikacji:** audyt całej historii git przed publikacją.
   - Klucze, tokeny, .env, .p8, certyfikaty.
   - Adresy e-mail w commitach.
   - Ustawienia workflow: zgoda na przebiegi z cudzych zmian, brak sekretów dla forków.
   - Logi i artefakty przebiegów.
   - Wyniki — przed włączeniem wysyłki.
2. **App Store Connect (właściciel, w przeglądarce):**
   - rekord aplikacji (bundle `pl.lukasz.trening`), nazwa, kategoria (Health & Fitness), ocena wieku;
   - App Privacy: „Data Not Collected”, do potwierdzenia;
   - klucz API (rola **Admin** — przegląd CI 06.10: podpis w chmurze przy eksporcie wymaga uprawnień do certyfikatów dystrybucyjnych) → sekrety repo.
3. **Profil „App Store”:** certyfikat dystrybucyjny i profil App Store w EAS credentials. Dziś jest tylko ad hoc.
4. **`ITSAppUsesNonExemptEncryption: false`** w `app.json` (aplikacja nie używa własnego szyfrowania). Do potwierdzenia przy audycie.
5. **Zrzuty ekranu** (6,9″ i 6,5″) z symulatora — Maestro `takeScreenshot` albo `scripts/screens`. Opis PL/EN.
6. **Strona polityki prywatności i wsparcia** na GitHub Pages.
7. **Elementy specyficzne dla właściciela do przejrzenia** przed sklepem: presety ViShape, teksty o „domu właściciela” w podpowiedziach, dane demo.

## Model płatności — ponowna analiza (05.10.2026)

Po researchu skarg (docs/research/skargi-uzytkownikow-2026-10.md: płatności to skarga nr 1, najostrzej oceniane odbieranie darmowych
funkcji i ściana płatności po rejestracji; częsta prośba o jednorazowy zakup) właściciel: „Tak, rozważmy alternatywy”.
Wcześniejsza decyzja (subskrypcja, miesiąc próby, potem blokada treningów; eksport danych zawsze) — do potwierdzenia albo zmiany.

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| A. Subskrypcja + blokada po próbie (obecna decyzja) | miesiąc za darmo, potem bez subskrypcji tylko eksport | stały przychód; prosta zasada | dokładnie to, za co konkurencja zbiera najgorsze oceny |
| B. Jednorazowy zakup po próbie | 30 dni za darmo (liczy aplikacja), potem jednorazowo „pełna wersja” | ludzie to lubią; Chmura rodzinna Apple | przychód jednorazowy; kolejne zarobki tylko z nowych użytkowników |
| C. Darmowe podstawy na zawsze + płatne Pro | zapis treningów, szablony, historia — zawsze za darmo; Pro: np. postępy/wykresy, wiele miejsc i sprzętu, presety stacji, Apple Health | najlepsze opinie, szeroki zasięg; nikt nie traci tego, co miał | trzeba z góry dobrze wybrać, co jest w Pro (późniejsze przenoszenie = skarga nr 1) |
| D. C + wybór: subskrypcja albo dożywotnio | Pro miesięcznie/rocznie albo raz na zawsze | wybór dla obu typów klientów; częsty model w kategorii | więcej produktów do utrzymania w App Store Connect |
| E. Darmowa + „napiwek” | wszystko za darmo, dobrowolne wsparcie | zero skarg na płatności | mały przychód |

Rekomendacja (do decyzji właściciela): **D** — darmowe podstawy na zawsze, Pro jako subskrypcja albo zakup dożywotni; wcześniejsi
użytkownicy — Pro za darmo (jak w decyzji wyżej). Eksport danych zawsze darmowy.

**Decyzja właściciela 05.10.2026: „B: jednorazowy zakup po próbie”.** Zastępuje subskrypcję (wyżej): 30 dni całości za darmo (liczy aplikacja —
wytyczne Apple 3.1.1 dopuszczają darmowy zakup „trial”), potem jednorazowy zakup pełnej wersji. Bez zakupu: treningi zablokowane,
kopia i eksport danych działają (decyzja „Wybieram 1” zostaje). Wcześniejsi użytkownicy (pobrani przed płatnościami): pełna wersja za darmo.
Otwarte: cena, data wprowadzenia, Chmura rodzinna (Family Sharing) — tak/nie.

**Uzupełnienie decyzji (właściciel 05.10.2026):** „Wersja offline do jednorazowego wykupienia po wypróbowaniu. Jeżeli kiedyś dodamy funkcjonalności
online, to będą to dodatkowo płatne funkcje.” Ustalenia:
- Wszystko, co działa bez sieci, należy do zakupu jednorazowego — **na zawsze**; nic z tej części nie przechodzi później do płatnych funkcji online
  (odbieranie funkcji to skarga nr 1 w researchu).
- Funkcje online (np. synchronizacja między urządzeniami, trener, współdzielenie) — osobny produkt; ze względu na koszty serwera zwykle subskrypcja.
  Apple pozwala łączyć zakup jednorazowy i subskrypcję w jednej aplikacji.
- Otwarte: czy wcześniejsi użytkownicy dostają funkcje online za darmo; koszty serwera — przed wdrożeniem sprawdzić darmowe limity (zasada: 0 zł poza Apple).

## Limit Expo na buildy lokalne (06.10.2026)
Przebieg `iphone-local.yml` 37422172177: build lokalny OK, ale `eas upload` odrzucony — „This account has used its local builds from the free plan
this month, which will reset in 25 days (on Sun Nov 01 2026)”. Darmowy plan Expo liczy też buildy lokalne wysłane przez `eas upload`
(wcześniej zakładano, że tylko buildy w chmurze — docs/13). Link instalacyjny przez Expo niedostępny do 01.11.2026.
Do decyzji właściciela: TestFlight (testy wewnętrzne — bez recenzji Apple) albo instalacja pliku .ipa z komputera Mac; płatny plan Expo — nie (0 zł).

## TestFlight — testy wewnętrzne (decyzja właściciela 06.10.2026: „TestFlight — testy wewnętrzne”)
Workflow `.github/workflows/testflight.yml`: build i podpis tylko narzędziami Apple (xcodebuild z kluczem App Store Connect API, podpis
automatyczny), wysyłka do App Store Connect; bez Expo/EAS i ich limitów. Numer buildu 1000 + numer przebiegu (rośnie).
`ITSAppUsesNonExemptEncryption: false` w `app.json` (aplikacja nie używa szyfrowania poza systemowym — bez pytania przy każdym buildzie).

**Kroki właściciela (przeglądarka, ~30 min):**
1. App Store Connect → Apps → „+” → New App: platforma iOS, nazwa (np. „Trening” — jeśli zajęta, inna), język główny Polski,
   Bundle ID `pl.lukasz.trening` (jeśli nie ma go na liście: developer.apple.com → Identifiers → „+” → App ID z tym identyfikatorem), SKU dowolne.
2. Users and Access → Integrations → App Store Connect API → „+”: nazwa „GitHub”, dostęp **Admin** (podpis w chmurze przy eksporcie — z rolą App Manager zwykle błąd „Cloud signing permission error”) → pobierz plik `AuthKey_XXXX.p8`
   (do pobrania tylko raz), zanotuj Key ID i Issuer ID.
3. GitHub → repozytorium → Settings → Secrets and variables → Actions → New repository secret: `ASC_KEY_ID`, `ASC_ISSUER_ID`,
   `ASC_KEY_P8` (cała treść pliku .p8). Pliku nie wysyłać nigdzie indziej (ani na czat).
4. App Store Connect → aplikacja → TestFlight → Internal Testing → „+” grupa → dodaj siebie. Na iPhonie aplikacja TestFlight (App Store).

**Przed pierwszą wysyłką:** audyt historii repozytorium wg reguły właściciela (wynik w tej sekcji).

### Audyt repozytorium przed pierwszą wysyłką (06.10.2026, niezależny subagent, tylko odczyt)
Zakres: 168 commitów ze wszystkich gałęzi, wiadomości, tagi, 289 plików z historii, workflowy.
- **Czysto:** brak kluczy prywatnych, certyfikatów, .p8/.p12/.mobileprovision/.env w całej historii; brak tokenów; brak prawdziwych UDID;
  autorzy commitów — tylko adresy noreply; workflowy tylko `workflow_dispatch`, `contents: read`, bez `pull_request(_target)` (forki bez sekretów);
  sekrety nie są wypisywane; brak logów CI w repo.
- **WYSOKIE (sprawdzone):** stare przebiegi `iphone-eas.yml` sprzed maskowania UDID — lista przebiegów tego workflow jest pusta (0), nie ma czego usuwać.
- **ŚREDNIE:** (1) `iphone-eas.yml`/`iphone-local.yml` — sekrety ustawione dla całego workflow (dostępne podczas `npm ci`/testów) — do przeniesienia
  do pojedynczych kroków (otwarte; workflowy i tak nieużywane do 01.11 — limit Expo); (2) `testflight.yml` — klucz na dysku dopiero przed archiwum
  (naprawione); (3) `tests/fixtures/web03-backup.json` zawierał wagę ciała i wpisy z 02.10.2026 — właściciel: „Tak — zamień na zmyślone” (06.10): poranny wpis fikcyjny, daty przesunięte o 300 dni; stare wartości zostają w historii git (przepisanie historii — nie).
- **NISKIE:** `ios-unsigned.yml` artefakty 1 dzień (naprawione); `.gitignore` dla `.env*`, `*.p8`, `*.p12`, `*.mobileprovision`, `*.cer` (naprawione);
  `appleTeamId` w `app.json` — Apple nie traktuje go jako sekretu (zostaje); Maestro instalowany bez przypiętej wersji (bez sekretów — zostaje).
- Do sprawdzenia przez właściciela: GitHub → Settings → Actions → General → „Fork pull request workflows” — wymagane zatwierdzenie.
