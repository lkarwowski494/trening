# Notatki dla recenzenta App Store (App Review Information → Notes) — wersja 1.0 z 26.10.2026

Finalna wersja na wydanie 1.0 (docs/48 pkt 2; zatwierdzona do wklejenia po akceptacji właściciela). Ścieżki i etykiety zgodne z kodem gałęzi `integracja-2026-10-26b`; próg dnia treningowego 7 min z `lib/access.ts` (`MIN_LIVE_MINUTES_FOR_DAY`), limit 5 dni z `PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`. Test: `tests/store-review-notes.test.ts`
(limit pola, teksty przycisków z `lib/i18n.en.ts`, liczby i stany domyślne z kodu, brak danych osobowych).
Sekcja „Ćwiczenia i rysunki” i opis zegarka (ZB-016, 29.10.2026) sprawdzone w kodzie gałęzi: rysunki `lib/figures/v2/figure.ts` (`V2_WSTRZYMANE` — od 1.0.1, 29.10.2026, puste: martwe ciągi z podłogi wróciły po recenzji niezależnej, więc zdanie o rysunkach wymienia martwy ciąg — 101-25), `families.ts` (status `ready`), zegarek `lib/watch/labels.ts`, `targets/watch-app/WorkoutController.swift`.

Do App Store Connect wkleja się **wersję angielską**; wersja polska jest dla właściciela. Bez danych osobowych: aplikacja nie ma konta, więc nie ma
loginu ani hasła do podania („Sign-in required” wyłączone). Pola „Contact Information” (imię, telefon, e-mail recenzji) właściciel wypełnia sam
w App Store Connect — nie w repo.

Warianty zależą od `PAYWALL.ENABLED` w buildzie wysyłanym do recenzji (decyzja D-1 = P, 14.10.2026 — zakupy od 1.0):
- **`PAYWALL.ENABLED = true`** — wklejamy całość i dodajemy notatkę subskrypcji (blok trzeci) do każdej z dwóch subskrypcji;
- **`PAYWALL.ENABLED = false`** — usuwamy akapit „IN-APP PURCHASES” i **nie** dodajemy produktów do zgłoszenia (2.1(b)).

**Warunki przed wklejeniem** (agent na buildzie 1.0, po redesignie M3 — ścieżki ekranów mogą się zmienić; test pilnuje tylko etykiet):
- [ ] ścieżki i nazwy przycisków na buildzie do recenzji (Settings → „Subscription” widoczne tylko przy `PAYWALL.ENABLED = true`) — sprawdza lista z `docs/49-testflight-1-0.md`;
- [ ] skrzynka support@apps4brew.com działa (docs/41 E4) — inaczej usunąć akapit CONTACT;
- [ ] brak ofert wprowadzających w App Store Connect w obu subskrypcjach (ryzyko R-M5-3, docs/40; zamyka kontrola ASC).

Źródła: pole Notes „can contain up to 4000 bytes” (developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/,
odczyt 14.10.2026); notatka subskrypcji „Required if the subscription offers introductory pricing”
(developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/, odczyt 14.10.2026) — od M5 S1 bez ofert wprowadzających
notatka nie jest wymagana, zostaje krótki opis drogi do ekranu zakupu.

## English (do wklejenia)

```text
Thank you for reviewing Trening.

NO ACCOUNT, NO SERVER
- No sign-in and no backend. Everything is stored on the device; the app makes no network requests of its own. No demo account is needed.
- To see data quickly: on the Workout tab tap "Other workout", add an exercise and tick a set; or use "Log a past workout" to add a session in the past.

IN-APP PURCHASES (one subscription group "Full version": monthly and yearly auto-renewable subscriptions plus a one-time lifetime unlock; no introductory offers or free trials)
- Where to find them: More > Settings, section "Subscription" > "See Pro plans" (after a purchase the row reads "Your plan: monthly", "Your plan: yearly" or "Your plan: lifetime"). The purchase screen opens from there at any time, and also when a workout is started after the free limit is used. It shows the price and period from the App Store, "Restore purchases", "Redeem code", and links to the Privacy Policy and the Terms of Use (Apple's standard EULA).
- Free tier: the whole app is free for up to 5 training days per calendar month. A training day is a day with at least one finished live workout longer than 7 minutes (several workouts on the same day count as one day). The limit cannot be reached in a short review session, so use Settings as above. History, backup, export and logging past workouts always work.
- After the first finished live workout (free tier only, shown once) a window "First workout done!" explains the model. "See Pro plans ›" opens the purchase screen, "Awesome, I'll keep training!" closes the window, and a link "Why this price? See the espresso index." opens a page on our website.
- Family Sharing is enabled for all three products.
- Ongoing value (Guideline 3.1.2(a)): the app is actively developed and updated regularly, and every new feature is included in the subscription. Users who prefer a single payment can choose the one-time lifetime unlock instead.

EXERCISES AND DRAWINGS
- More > Exercises, tap an exercise (e.g. Back Squat): the "Technique" section has setup, movement, tips and common mistakes. Many exercises show a simple movement drawing made on the device; squat, bench press and deadlift variations (e.g. Sumo Deadlift) are animated and mark the main muscles. A note says the app does not give medical advice.

BACKUP, IMPORT, ERASE
- More > Backup: "Export history to CSV" and "Import history from a CSV file". Import shows a preview before anything is saved and never removes existing data. To try it: export, then import the same file.
- More > Settings, bottom: "Erase all data" asks for confirmation and first saves the current data as a backup file in Files.

APPLE HEALTH (optional, off by default)
- More > Settings > "Save finished workouts to Apple Health": after the permission sheet, each finished workout is written to Health.
- More > Settings > "Show data from Apple Health": read-only (steps, workouts, heart rate, active energy), shown in the Plan day panel and in session details. Read data is never stored by the app or sent anywhere.
- The simulator has no Health data.

APPLE WATCH (companion app, optional)
- Shows the workout started on the iPhone (exercise, set, weight, reps); "Set done" and "Undo" (5 seconds) work on the watch, and the rest countdown ends with a haptic. The watch runs a workout session (heart rate, active energy); with Health saving on, the workout is saved to Health once. Without a workout on the phone it shows "Start a workout on your phone". The iPhone app is fully usable without a watch.

VOICE ANNOUNCEMENTS (optional, off by default)
- More > Settings > "Voice announcements". At the start of a rest the app announces the next exercise using on-device iOS speech synthesis.

REST TIMER
- The rest countdown also appears on the Lock Screen as a Live Activity. The end-of-rest notification is a local, time-sensitive notification. The app does not use push notifications.

CONTACT
- Support: support@apps4brew.com (also "Write to us" in More > About).
```

## Polski (dla właściciela — to samo znaczenie)

```text
Dziękujemy za recenzję aplikacji Trening.

BEZ KONTA I BEZ SERWERA
- Aplikacja nie ma logowania ani zaplecza. Wszystko zostaje na urządzeniu; aplikacja sama nie wykonuje żadnych połączeń sieciowych. Konto demonstracyjne nie jest potrzebne (logowanie wyłączone).
- Żeby szybko zobaczyć dane: w zakładce Trening „Inny trening”, dodaj ćwiczenie i odhacz serię; albo „Dopisz trening wstecz”.

ZAKUPY W APLIKACJI (grupa subskrypcji „Pełna wersja”: miesięczna i roczna odnawiane automatycznie oraz jednorazowy dostęp dożywotni; bez ofert wprowadzających i okresów próbnych)
- Gdzie: Więcej → Ustawienia, sekcja „Subskrypcja” → „Zobacz plany Pro” (po zakupie wiersz „Masz plan: miesięczny”, „Masz plan: roczny” albo „Masz plan: dożywotni”). Ekran zakupu otwiera się stamtąd w każdej chwili, a także przy starcie treningu po wykorzystaniu darmowych dni. Pokazuje cenę i okres z App Store, „Przywróć zakupy”, „Zrealizuj kod” i linki do polityki prywatności oraz warunków (standardowa licencja Apple).
- Bez zakupu cała aplikacja jest darmowa do 5 dni treningowych w miesiącu kalendarzowym. Dzień treningowy to dzień z co najmniej jednym ukończonym treningiem na żywo dłuższym niż 7 minut (kilka treningów tego samego dnia to jeden dzień). Limit wymaga pięciu takich dni, więc nie da się go osiągnąć w krótkiej recenzji; ekran zakupu jest dostępny z Ustawień. Historia, kopia, eksport i dopisywanie treningów wstecz działają zawsze, z zakupem i bez.
- Po pierwszym ukończonym treningu na żywo (tylko w wersji darmowej, raz) krótkie okno „Pierwszy trening za Tobą!” tłumaczy model prostymi słowami. „Zobacz plany Pro ›” otwiera ekran zakupu, „Super, trenuję dalej!” zamyka okno, a link „Skąd ta cena? Poznaj indeks espresso.” otwiera stronę na naszej witrynie.
- Chmura rodzinna włączona we wszystkich trzech produktach.
- Stała wartość subskrypcji (wytyczna 3.1.2(a)): aplikacja jest rozwijana i regularnie aktualizowana, a każda nowa funkcja wchodzi w skład subskrypcji. Kto woli jedną płatność, wybiera jednorazowy dostęp dożywotni.

ĆWICZENIA I RYSUNKI
- Więcej → Ćwiczenia, stuknij ćwiczenie (np. Back Squat): sekcja „Technika” zawiera ustawienie, ruch, wskazówki i częste błędy. Wiele ćwiczeń ma prosty rysunek ruchu rysowany na urządzeniu; odmiany przysiadu, wyciskania leżąc i martwego ciągu (np. Sumo Deadlift) są animowane i oznaczają mięśnie główne. Notka przypomina, że aplikacja nie udziela porad medycznych.

KOPIA, IMPORT, CZYSZCZENIE
- Więcej → Kopia zapasowa: „Eksportuj historię do CSV” i „Importuj historię z pliku CSV”. Import pokazuje podgląd przed zapisem i nigdy nie usuwa obecnych danych. Żeby wypróbować: najpierw eksport historii do CSV, potem import tego samego pliku.
- Więcej → Ustawienia, na dole: „Wyczyść wszystkie dane” pyta o potwierdzenie i najpierw zapisuje obecne dane jako plik kopii w Plikach.

APPLE HEALTH (opcjonalnie, domyślnie wyłączone)
- Więcej → Ustawienia → „Zapisuj zakończone treningi do Apple Health”: po zgodzie każdy zakończony trening trafia do Zdrowia.
- Więcej → Ustawienia → „Pokazuj dane z Apple Health”: tylko odczyt (kroki, treningi, tętno, energia aktywna) w panelu dnia w Planie i w szczegółach sesji. Odczytanych danych aplikacja nie zapisuje ani nie wysyła.
- Symulator nie ma danych Zdrowia, więc widok odczytu jest tam pusty.

APPLE WATCH (aplikacja towarzysząca, opcjonalnie)
- Pokazuje trening rozpoczęty na iPhonie (ćwiczenie, seria, ciężar, powtórzenia); „Seria zrobiona” i „Cofnij” (5 s) działają na zegarku, a odliczanie przerwy kończy wibracja. Zegarek prowadzi sesję treningu (tętno, energia aktywna); przy włączonym zapisie do Zdrowia trening trafia do Zdrowia raz. Bez treningu na telefonie pokazuje „Zacznij trening na telefonie”. Aplikacja na iPhone’a działa w pełni bez zegarka.

ZAPOWIEDZI GŁOSOWE (opcjonalnie, domyślnie wyłączone)
- Więcej → Ustawienia → „Zapowiedzi głosowe”. Na początku przerwy aplikacja zapowiada następne ćwiczenie syntezatorem mowy iOS na urządzeniu.

PRZERWA
- Odliczanie przerwy jest też widoczne na ekranie blokady jako Live Activity. Powiadomienie o końcu przerwy jest lokalne, z poziomem pilnym (time-sensitive). Aplikacja nie używa powiadomień push.

KONTAKT
- Wsparcie: support@apps4brew.com (także „Napisz do nas” w Więcej → O aplikacji).
```

## Notatka do każdej subskrypcji (Subscription → App Review Information → Review Notes; opcjonalna — bez ofert wprowadzających)

```text
Auto-renewable subscription without introductory offers. Purchase screen: More > Settings > Subscription > See Pro plans (any time), or when starting a workout after the 5 free training days of the month are used. Ongoing value: no monthly limit and all features added in regular updates; a one-time lifetime unlock is offered as an alternative.
```
