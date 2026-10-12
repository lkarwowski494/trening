# 26. Prośba o ocenę w sklepie — specyfikacja (11.10.2026)

Status: **projekt do decyzji właściciela, bez kodu.** Dotyczy pozycji „Przed App Store” w `docs/21-roadmapa-offline.md` (otwarte: moment i odstęp).
Cytaty ≤ 2 zdania, czytane 11.10.2026 (treść stron Apple pobrana z publicznych danych JSON stron dokumentacji).

## 1. Podstawy (przeczytane źródła)

| Fakt | Źródło i miejsce | Cytat |
|---|---|---|
| Limit: 3 wyświetlenia w 365 dniach; system decyduje, nie aplikacja | Apple, `RequestReviewAction` (StoreKit), sekcja Discussion — https://developer.apple.com/documentation/storekit/requestreviewaction | „If the person hasn’t rated or reviewed your app on this device, StoreKit displays the ratings and review request a maximum of three times within a 365-day period.” |
| Prośba może nie pokazać okna; nie z przycisku | j.w. i `SKStoreReviewController.requestReview(in:)` (Discussion, Note) | „Because this API may not present an alert, don’t call it in response to a button tap or other user action.” |
| Po ocenie: tylko nowa wersja i > 365 dni | j.w. | „…if the app version is new, and if more than 365 days have passed since the person’s previous review.” |
| Dev: okno zawsze; TestFlight: brak efektu | `SKStoreReviewController.requestReview(in:)`, „Test review requests” | „…this method has no effect in apps that you distribute for beta testing using TestFlight.” |
| Kiedy pytać | Apple HIG „Ratings and reviews” (Best practices) — https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews | „Ask for a rating only after people have demonstrated engagement with your app or game.” oraz „Look for natural breaks or stopping points…” |
| Czego unikać | HIG j.w. | „Avoid interrupting people while they're performing a task or playing a game.” oraz „Consider allowing at least a week or two between requests, prompting again after people demonstrate additional engagement…” (także: nie przy pierwszym uruchomieniu/onboardingu) |
| Własne okna oceny zakazane | App Review Guidelines 5.6.1 — https://developer.apple.com/app-store/review/guidelines/#5.6.1 | „Use the provided API to prompt users to review your app… and we will disallow custom review prompts.” |
| Zakaz wymuszania oceny | App Review Guidelines 3.2.2(x) — ta sama strona | „Apps must not force users to rate the app, review the app, download other apps, or other store-related actions in order to access functionality, content, or use of the app.” (wstęp do sekcji 3: zakaz manipulowania opiniami, „incentivized… feedback”) |
| Biblioteka `expo-store-review` | Expo SDK, StoreReview — https://docs.expo.dev/versions/latest/sdk/storereview/ | `isAvailableAsync()`: „On iOS, it will resolve to `true` unless the app is distributed through TestFlight.”; „Don't call `StoreReview.requestReview()` from a button”; „Don't spam the user.” |

Uwagi:
- `SKStoreReviewController.requestReview(in:)` jest oznaczone jako przestarzałe od iOS 18 (następca: `AppStore.requestReview(in:)` / `RequestReviewAction`). Czy `expo-store-review` w SDK 57 woła nowe API — **[OTWARTE]**, sprawdzić w kodzie modułu przy wdrożeniu (nie zmienia zasad).
- Strona Expo (odczytany fragment) nie mówi wprost, czy moduł wymaga własnego buildu (jest „Included in Expo Go”); to moduł z kodem natywnym → dodanie go zmienia binarkę (pkt 4) — **[OTWARTE]**: potwierdzić w repozytorium modułu. Dokładne znaczenie `hasAction()` (obietnica `true`, gdy `requestReview()` jest możliwe) — odczytany opis ucięty, **[OTWARTE]**.
- Wniosek z limitu: system sam ogranicza do 3/rok i może nic nie pokazać, więc **aplikacja nie wie, czy okno się pokazało** — nie zakładamy „pokazano” i nie sterujemy UI po prośbie. Własnego okna „Czy lubisz aplikację?” przed systemowym nie robimy (5.6.1: „custom review prompts”); wstępne pytanie filtrujące (prośba tylko do zadowolonych) — **odrzucone** jako ryzyko wobec 5.6.1 i zasad dot. manipulowania opiniami.

## 2. Zasady twarde (niezależne od wariantu)

1. Nigdy w trakcie treningu (trening w toku, przerwa, edycja serii) — HIG „interrupting”.
2. Nigdy przy pierwszym uruchomieniu/onboardingu ani przed pierwszym ukończonym treningiem — HIG.
3. Nigdy przy błędzie, limicie/blokadzie subskrypcji (docs/15), w trakcie kopii/importu ani po wyniku negatywnym (nieudany zapis/import).
4. Nigdy w zamian za nagrodę ani warunek dostępu do funkcji (3.2.2, 5.6.1); żadnych odblokowań „za ocenę”.
5. Nigdy z przycisku, który wywołuje okno systemowe (Apple: „don’t call… in response to a button tap”). Stały link „Oceń w App Store” otwierający stronę sklepu (bez okna systemowego) to osobna decyzja produktowa (pytanie 4).
6. Brak okna w TestFlight to oczekiwane zachowanie; w trybie dev okno pokazuje się zawsze.

## 3. Warianty momentu

Wspólna bramka (czysta funkcja `shouldAskReview`): zasady twarde + minimalne zaangażowanie + odstęp od ostatniej prośby + limit na wersję. Wyzwalacz sprawdzany **tylko po zakończeniu treningu, na ekranie podsumowania/Start** (naturalna przerwa), nigdy w trakcie.

### Wariant A — po ukończonym treningu z nowym rekordem
- Plus: pozytywny moment (HIG: „significant task”); rekord liczy już `lib`.
- Minus: rekordy rzadkie u zaawansowanych, częste u początkujących — nierówna ekspozycja; kto nie ma rekordów, nie zostanie zapytany.
- Wymaga progu zaangażowania N — **decyzja właściciela, brak źródła.**

### Wariant B — po N-tym ukończonym treningu
- Plus: prosty, przewidywalny, niezależny od wyniku; zgodny z HIG („number of tasks they complete”).
- Minus: nie wiemy, czy chwila jest pozytywna (np. trening bez progresu).
- **N: decyzja właściciela** (HIG nie podaje liczby).

### Wariant C — po pozytywnym podsumowaniu tygodnia (plan zrealizowany)
- Plus: najlepiej wiąże się z poczuciem sukcesu i regularnością; naturalna przerwa.
- Minus: najrzadszy; wymaga definicji „pozytywnego” (próg realizacji planu — **decyzja właściciela**); sprawdzanie przy otwarciu aplikacji, nie w trakcie treningu.

### Odstęp (wspólny)
- Źródło: HIG „co najmniej tydzień lub dwa” między prośbami i ponowna prośba po dodatkowym zaangażowaniu; system i tak daje maks. 3/365 dni.
- Opcja 1: min. 14 dni, max 1 na wersję aplikacji.
- Opcja 2: min. 30 dni, max 1 na wersję (ostrożniej; mniej wyświetleń z puli 3).
- Konkretne liczby (14/30) — **decyzja produktowa właściciela**; źródło daje tylko dolną granicę „tydzień–dwa”.

### Rekomendacja
Wariant **B z bramką pozytywną z A**: po ≥ N-tym ukończonym treningu **i** gdy właśnie zakończony trening ma nowy rekord (brak rekordu → czekać do następnego treningu); odstęp **14 dni**, **max 1 na wersję**. Uzasadnienie: B daje pokrycie wszystkich użytkowników, rekord dodaje pozytywny kontekst; C odłożyć (rzadki, wymaga definicji sukcesu). N = 5 to **hipoteza bez źródła — do decyzji właściciela.**

## 4. Dane i natywny build

- **Schemat danych:** potrzebne pole „kiedy ostatnio prosiliśmy / w której wersji”. Rekomendacja: **opcjonalne pole w `Settings`, zapisywane dopiero po pierwszej prośbie** (wzór: `planReminder?: false` w `lib/seed.ts`) — **bez podnoszenia `SCHEMA_VERSION`** (18); starsze wersje je ignorują. Zastrzeżenie: Settings jest częścią stanu, więc trafia do kopii/eksportu i wraca po imporcie (zaleta: po przywróceniu nie pytamy od razu ponownie; wada: dane „prośby” w kopii). `migrate` powinno znormalizować pole (zła/przyszła data → brak pola). Alternatywa: osobny klucz poza stanem (poza kopią, bez wpływu na migracje) — czy w repo jest do tego gotowa warstwa: **[OTWARTE]**, sprawdzić `lib/store.ts`.
- **Natywny build:** `expo-store-review` zawiera kod natywny → po dodaniu zależności potrzebna nowa binarka (`testflight.yml`), nie wystarczy aplikacja z przebiegu dla zmiany samych scenariuszy. Zgodnie z CLAUDE.md **nie łączyć w jednym wydaniu z podbiciem SDK ani ze zmianą schematu**: dodanie biblioteki + opcjonalne pole bez zmiany `SCHEMA_VERSION` jest dopuszczalne. Wersja zgodna z SDK 57 (`npx expo install expo-store-review`, zakres `~57.x`) — numer **[OTWARTE]**. Brak nowych uprawnień; opis prywatności bez zmian (nie zbieramy danych).
- Pełny efekt widoczny dopiero po publikacji w App Store (TestFlight bez okna); wcześniej sprawdzenie na buildzie developerskim/symulatorze (tam okno zawsze).

## 5. Testy (wg docs/20)

| # | Rodzaj | Zakres |
|---|---|---|
| 1 | Logika | `shouldAskReview(stan, teraz)`: liczba treningów poniżej/na/powyżej N; rekord tak/nie; odstęp (dzień przed/równo/po progu); max na wersję; trening w toku → nie; blokada subskrypcji/błąd → nie; brak danych → nie; zły lub przyszły czas (zegar cofnięty) → nie; pierwszy trening → nie |
| 2 | Ekran | po ukończeniu treningu przy spełnionych warunkach mock `requestReview` wywołany raz, po powrocie na podsumowanie/Start; w trakcie treningu nigdy; brak własnego okna oceny |
| 3 | Scenariusz | N treningów z restartem aplikacji w trakcie → prośba raz; kolejny trening w odstępie → brak; po odstępie → jest; nowa wersja → znów dozwolone |
| 4 | Macierz | wymiary: rekord tak/nie × kg/lb (iteracja po stałych z `lib/`); `isAvailableAsync=false` (TestFlight) → cicho nic, bez błędu; `hasAction=false` |
| 5 | Niezmienniki | w losowych sekwencjach akcji: `requestReview` nigdy przy aktywnym treningu, nigdy częściej niż odstęp, nigdy > 1 na wersję |
| 6 | Dane | zapis → restart → to samo pole; eksport → import zgodnie z decyzją; `migrate` idempotentne i odporne na złe dane; asercja `SCHEMA_VERSION` bez zmian |
| 7 | Języki i wygląd | brak nowych tekstów w UI (okno systemowe) → `check:i18n` bez zmian; przy linku w Ustawieniach (pyt. 4) — `t()` i 24 pliki |
| 8 | Regresja | każdy błąd znaleziony przy wdrożeniu |
| 9 | E2E Maestro | pominięte z powodem do zapisu w docs/09: okno systemowe nie występuje w TestFlight i jest poza kontrolą Maestro; zastępują rodzaje 2–3 z mockiem |

Mock: `jest.mock('expo-store-review')` (`requestReview`, `isAvailableAsync`, `hasAction`). Czas wstrzykiwany do funkcji (bez `Date.now()` w środku).

## 6. Pytania do właściciela (pojedynczo)

1. **Moment.** (A) po treningu z rekordem; (B) po N-tym treningu; (C) po udanym tygodniu planu; (B+A) N-ty trening i rekord w ostatnim treningu. Kompromisy w pkt 3. **Rekomendacja: B+A.**
2. **Próg N** ukończonych treningów przed pierwszą prośbą: 3 / 5 / 10 (brak źródła). **Rekomendacja: 5.**
3. **Odstęp i limit:** 14 dni + max 1 na wersję, albo 30 dni + max 1 na wersję. **Rekomendacja: 14 dni, 1 na wersję.**
4. **Stały link „Oceń w App Store”** w Ustawieniach (otwiera stronę sklepu, bez okna): tak / nie. Plus: chętny oceni w dowolnej chwili; minus: dodatkowy element UI i teksty w 26 językach. **Rekomendacja: nie w tym wydaniu**, wrócić po publikacji.
5. **Gdzie trzymać datę ostatniej prośby:** opcjonalne pole w ustawieniach (idzie do kopii, bez zmiany schematu) albo osobny klucz poza kopią. **Rekomendacja: pole w ustawieniach**, chyba że `lib/store.ts` ma prosty osobny magazyn.
