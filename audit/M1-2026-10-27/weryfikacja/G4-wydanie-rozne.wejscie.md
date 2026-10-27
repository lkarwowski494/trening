### 10-wydanie-001 · Do recenzji można wybrać build 1031 z błędnymi figurami; procedura nie wskazuje numeru buildu ani SHA, dziennik wydań nie ma wiersza 1031
- Pozycja listy kontrolnej: WYD-02
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: P
- Dowód: tag `v1.0.0-b1031` stoi na 001ecf28, a kandydat 025a50b9 jest 32 commity dalej i zmienia 8 plików figur (`dowody/tagi.txt`); oba buildy mają wersję 1.0.0. Krok Z-26 mówi tylko „wybór buildu 1.0 z TestFlight” (`docs/48-zgloszenie-1-0.md:94`), bez numeru i SHA. Dziennik wydań kończy się na 1030 (`docs/09-plan-testow.md:213`), wiersza `v1.0.0-b1031` brak (grep: 0). Uwagi T-xx z telefonu dotyczą 1031, nie kandydata.
- Wzorzec lub źródło: zasada roli 7 („Wysyłasz tylko sprawdzony kandydat: SHA z werdyktu 07, warunki wysyłki spełnione, wpis w dzienniku”); `docs/42-plan-wydania-1.0.md` W1-07.
- Kroki w aplikacji: App Store Connect → wersja 1.0 → Build „+”: lista pokazuje 1031 (i kolejny build po 025a50b9). Wybór 1031 wysyła do recenzji i do użytkowników figury z błędami opisanymi w L-042 (tor ciężaru przed stopami, kolano w RDL).

- Test akceptacyjny: `docs/48` Z-26 zawiera numer i SHA; `docs/09` ma wiersze 1031 i nowego buildu; przy Z-29 numer buildu w ASC = tag na SHA zatwierdzonym przez audyt.


### 04-studio-projektowe-003 · Decyzje właściciela o interfejsie zapisane bez testu-strażnika i bez weryfikacji wdrożenia; testy pilnują stanu sprzed decyzji
- Pozycja listy kontrolnej: SP-13
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: (1) decyzja 23.10 o kolejności planów (docs/18-przekazanie.md, wpis "ekran Pełna wersja — kolejność planów miesięczny, roczny, dożywotni") i DEC-07 K3 (ten sam plik, karty P2) były przypisane gałęzi `naprawa-m1-dec07-ui` (`docs/przekazanie-koordynatora-2026-10-23.md:26`), ale scalona gałąź zawiera tylko K9, DEC-05 i DEC-01 (`git log 99563b1e^2`, `dowody/decyzje-kod.txt`); (2) test `tests/m5s1-bez-proby.test.ts:86` utrwala kolejność sprzed decyzji 23.10 (roczny pierwszy), a `tests/m3-p2-start.test.tsx:31` utrwala "Planowanie" nad tytułem, sprzeczne z K3 — testy są zielone, więc nic nie sygnalizuje rozjazdu; (3) "podgląd liczb po przytrzymaniu — 1.0.1" (DEC-01 a, 23.10) nie ma wpisu w backlogu `docs/21-roadmapa-offline.md` (grep: 0 trafień). Kolejność planów wykrył właściciel na telefonie, a 27.10 zmienił decyzję — przypadek zamknięty, mechanizm nie.
- Wzorzec lub źródło: CLAUDE.md, „Lekcje po błędach” (akcja ma być mechanizmem, nie postanowieniem) i zasada „Model pracy po L-001”; zasada wspólna 2 (dowód zamiast deklaracji).
- Kroki w aplikacji: nie dotyczy (proces); skutek dla użytkownika: interfejs inny niż zatwierdzony przez właściciela (005).
- Ocena zakresu: **systemowa** — ta sama luka może wrócić przy każdej decyzji o wyglądzie lub tekście. Opcje: (a) rejestr decyzji UI w pliku danych (ID decyzji → test lub wyjątek z powodem), strażnik w verify sprawdza, że każda decyzja z docs/18 oznaczona `[UI]` ma test, a zmiana decyzji wymusza zmianę testu z tym ID — pewne, koszt S–M; (b) krok listy kontrolnej koordynatora przy scalaniu gałęzi napraw: „każda decyzja przypisana gałęzi ma commit i test” — tańsze, zależne od pamięci koordynatora; Rekomendacja: (a).
- Test akceptacyjny: strażnik wykrywa decyzję `[UI]` bez testu (czerwony na próbce), a K3 i podgląd 1.0.1 mają test albo wpis w backlogu z wersją.


### 06-tresci-004 · RIR 6 zapisywany jako „lekko” (RPE 4), choć źródło grupuje 4–6 RIR przy RPE 5–6
- Pozycja listy kontrolnej: TRE-02 (CZĘŚCIOWO), para zdań TRE-08
- Poziom: P2
- Realność: brzegowy (użytkownik skali RIR wpisuje 6 lub więcej) · Pewność: wysoka
- Rodzaj: M
- Dowód: `lib/state/effort.ts:18` (`RIR_MAX = 5, RPE_LIGHT = 4`); tekst `lib/i18n.en.ts:840` uzasadnia: więcej niż 5 RIR to “lekko”, “bo poniżej RPE 5 skala opisuje wysiłek słowami”. Źródło (Helms i in. 2016, PMC4961270, odczyt 27.10.2026): “scores of 5–6 were grouped as 4–6 RIR” oraz opisy słowne dopiero dla RPE 1–4. RIR 6 należy więc w źródle do przedziału RPE 5–6, nie do “light effort”; wniosek drugiej części zdania nie wynika z pierwszej.
- Wzorzec lub źródło: Helms i in. 2016, Strength Cond J 38(4), tabela skali RIR–RPE.
- Kroki w aplikacji: Ustawienia → skala RIR → seria → wpis 6 → zapis jako RPE 4, wyświetlane „6+”.

- Test akceptacyjny: wektor RD-02 dla RIR 6 → RPE 5; tekst T-041 po `--rehash` z przeglądem badacza.


### 12-niezawodnosc-003 · „Napisz do nas” z ekranu błędu startu nie dołącza kodu diagnostycznego ani treści błędu
- Pozycja listy kontrolnej: NIE-06
- Poziom: P2
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: przycisk woła `openSupportMail('feedback')` bez parametrów (`components/StartError.tsx:32`); treść wiadomości to tylko stopka wersja/iOS/język (`lib/support.ts:19-21`); kod etapu startu (`diag`) jest tylko do zaznaczenia na ekranie (`components/StartError.tsx:28`) (dowody/grep-ekran-awaryjny-i-kopie.txt).
- Wzorzec lub źródło: NIE-06 i wzorzec roli (właściciel dowiaduje się o awarii przed recenzjami); bez Maca e-mail od użytkownika jest głównym źródłem sygnału po premierze (D-3).
- Kroki w aplikacji: start kończy się ekranem awaryjnym → „Napisz do nas” → e-mail bez etapu startu i treści błędu; właściciel nie wie, czy padło `init`, czy pierwszy ekran.

- Test akceptacyjny: test `buildSupportMailto` z `diag` i komunikatem: treść zawiera kod i komunikat, nie zawiera danych treningowych; test ekranu `start-error` → `Linking.openURL` z kodem w treści.


### 08-programista-001 · „Zarządzaj subskrypcją” otwiera stronę App Store zamiast arkusza StoreKit; w TestFlight i piaskownicy nie widać zakupów testowych
- Pozycja listy kontrolnej: brak pozycji DEV (wymiar „testy na właściwym poziomie”; atrapa zastępuje działanie biblioteki)
- Poziom: P2
- Realność: realny (każdy tester TestFlight i recenzent Apple w piaskownicy) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód:
  - `lib/store-native.ts:126` „await m.deepLinkToSubscriptions()”.
  - W `expo-iap` 5.8.1 funkcja na iOS woła `deepLinkToSubscriptionsIOS`, czyli `node_modules/expo-iap/src/modules/ios.ts:379` „Linking.openURL('https://apps.apple.com/account/subscriptions')”.
  - Biblioteka ma też arkusz systemowy `showManageSubscriptionsIOS` (`node_modules/expo-iap/src/modules/ios.ts:186`), który w OpenIAP 3.6.0 woła `AppStore.showManageSubscriptions(in: scene)`.
  - Komentarz kontraktu `lib/store-adapter.ts:44` „Systemowy arkusz zarządzania subskrypcją” nie zgadza się z działaniem biblioteki, a test sprawdza tylko licznik wywołań na atrapie (`tests/subscription-ui.test.tsx:85`).
  - Pełny zapis: `dowody/zarzadzaj-subskrypcja.txt`. Objaw z telefonu (T-11): w TestFlight otwiera się lista produkcyjna bez zakupów testowych. Sprawdzenie tego w TestFlight było zaplanowane 23.10 i nie zostało wykonane (`docs/przekazanie-koordynatora-2026-10-23.md:48`).
- Wzorzec lub źródło: Apple, „showManageSubscriptions(in:)” (odczyt 27.10.2026, `dowody/apple-showmanagesubscriptions.txt`): „Use this function to display the manage subscriptions sheet within your app.” oraz „Test the managing subscriptions functionality in the sandbox environment and StoreKit testing in Xcode.”
- Kroki w aplikacji: kup subskrypcję w TestFlight → Ustawienia → Pełna wersja → „Zarządzaj subskrypcją”. Otwiera się App Store (konto produkcyjne), subskrypcji testowej nie ma i nie da się jej anulować ani zmienić z aplikacji. W wersji ze sklepu użytkownik opuszcza aplikację. Czy strona pokazuje wtedy prawdziwą subskrypcję, sprawdzimy dopiero po wydaniu [DO USTALENIA].

- Test akceptacyjny: test kontraktu na makiecie `expo-iap` sprawdza, że `manageSubscriptions` woła `showManageSubscriptionsIOS`, a nie `deepLinkToSubscriptions`, i że po powrocie są odświeżane uprawnienia; na telefonie w TestFlight arkusz pokazuje subskrypcję testową.


### 02-monetyzacja-505 · „Zarządzaj subskrypcją” otwiera stronę App Store, a nie systemowy arkusz (docs/27 3.10); w TestFlight pokazuje produkcyjną listę bez zakupów testowych
- Pozycja listy kontrolnej: MON-11
- Poziom: P2
- Realność: realny w TestFlight (obserwacja właściciela); w produkcji działa, ale wyprowadza z aplikacji · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: `lib/store-native.ts:126` woła `deepLinkToSubscriptions()`, które w expo-iap 5.8.1 na iOS robi `Linking.openURL('https://apps.apple.com/account/subscriptions')` (`node_modules/expo-iap/src/modules/ios.ts:378-379`). Natywne `AppStore.showManageSubscriptions(in:)` istnieje w openiap (wywołanie `showManageSubscriptionsIOS`), ale nie jest używane. Komentarz interfejsu obiecuje arkusz (`lib/store-adapter.ts:44`), a spec go wymaga (`docs/27-subskrypcja-spec.md:165`). Dowód biblioteki: (dowody/biblioteka-expo-iap-openiap.txt).
- Wzorzec lub źródło: strona subskrypcji Apple (27.10.2026): "You can use the showManageSubscriptions(in:) method to let them manage their subscription within your app."
- Kroki w aplikacji: TestFlight, po zakupie → „Zarządzaj subskrypcją” → Safari/App Store z kontem produkcyjnym → brak subskrypcji testowej; tester nie anuluje jej z aplikacji.

- Test akceptacyjny: tests/store-native-contract: `manageSubscriptions` woła `showManageSubscriptionsIOS`; krok telefonu: arkusz pokazuje subskrypcję piaskownicy.


