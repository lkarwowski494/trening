# Notatki dla recenzenta App Store (App Review Information → Notes) — wersja 1.0 z 27.10.2026

Finalna wersja na wydanie 1.0 (docs/48 pkt 2; do wklejenia po akceptacji właściciela). Ścieżki i etykiety sprawdzone 27.10.2026 w kodzie `main` 4b77c9f (1.0.0, build w TestFlight):
zakładka Trening „Inny trening” (`components/StartPanel.tsx`), „Dopisz trening wstecz” w zakładce Plan (`app/(tabs)/history.tsx`), karta „Subskrypcja” na górze Ustawień
(`components/SubscriptionCard.tsx`, tylko przy `PAYWALL.ENABLED = true` — w 1.0 włączone), okno „Pierwszy trening za Tobą!” na podsumowaniu sesji (`app/history/[id].tsx`, `lib/fairrules.ts`:
trening na żywo, poziom `free`, raz), sekcja „Technika” na karcie ćwiczenia (`components/ExerciseCues.tsx`; rysunek v2 — animowany, z mięśniami — dla rodzin ze statusem `ready` w `lib/figures/v2/families.ts`:
przysiad, wyciskanie leżąc, zawias biodrowy; prostsza figura v1 dla ćwiczeń z `lib/figures/data.json`; pełna biblioteka w 1.1), zegarek (`lib/watch/labels.ts`, `targets/watch-app/WorkoutController.swift`:
„Seria zrobiona”, „Cofnij”, sesja treningu i zapis do Zdrowia bez duplikatu), „Wyczyść wszystkie dane” z kopią przed czyszczeniem (`app/more/settings.tsx`), powiadomienie `timeSensitive` (`lib/timer.ts`).
Próg dnia treningowego 7 min z `lib/access.ts` (`MIN_LIVE_MINUTES_FOR_DAY`), limit 5 dni z `PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`. Test: `tests/store-review-notes.test.ts`
(limit pola, teksty przycisków z `lib/i18n.en.ts`, liczby, stany domyślne i rodziny rysunków z kodu, brak danych osobowych).

Do App Store Connect wkleja się **wersję angielską**; wersja polska jest dla właściciela. Bez danych osobowych: aplikacja nie ma konta, więc nie ma
loginu ani hasła do podania („Sign-in required” wyłączone). Pola „Contact Information” (imię, telefon, e-mail recenzji) właściciel wypełnia sam
w App Store Connect — nie w repo.

Warianty zależą od `PAYWALL.ENABLED` w buildzie wysyłanym do recenzji (decyzja D-1 = P, 14.10.2026 — zakupy od 1.0; w `main` 4b77c9f `ENABLED: true`):
- **`PAYWALL.ENABLED = true`** — wklejamy całość i dodajemy notatkę subskrypcji (blok trzeci) do każdej z dwóch subskrypcji;
- **`PAYWALL.ENABLED = false`** — usuwamy akapit „IN-APP PURCHASES” i **nie** dodajemy produktów do zgłoszenia (2.1(b)).

**Warunki przed wklejeniem:**
- [x] ścieżki i nazwy przycisków w kodzie buildu 1.0 (27.10.2026, wyżej); na telefonie sprawdza je lista z `docs/49-testflight-1-0.md`;
- [ ] skrzynka support@apps4brew.com działa (docs/41 E4) — inaczej usunąć akapit CONTACT;
- [ ] brak ofert wprowadzających w App Store Connect w obu subskrypcjach (ryzyko R-M5-3, docs/40; zamyka kontrola ASC, `asc-kontrola.yml`).

Źródła: pole Notes „can contain up to 4000 bytes” (developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/,
odczyt 14.10.2026); notatka subskrypcji „Required if the subscription offers introductory pricing”
(developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/, odczyt 14.10.2026) — od M5 S1 bez ofert wprowadzających
notatka nie jest wymagana, zostaje krótki opis drogi do ekranu zakupu.

## English (do wklejenia)

```text
Thank you for reviewing Trening.

NO ACCOUNT, NO SERVER
- No sign-in and no backend. Everything is stored on the device; the app makes no network requests of its own. No demo account is needed.
- To see data quickly: on the Workout tab tap "Other workout", add an exercise and tick a set; or on the Plan tab tap "Log a past workout".

IN-APP PURCHASES (one subscription group "Full version": monthly and yearly auto-renewable subscriptions plus a one-time lifetime unlock; no introductory offers or free trials)
- More > Settings, section "Subscription" > "Full version" opens the purchase screen at any time; it also opens when a workout is started after the free limit is used. It shows the price and period from the App Store, "Restore purchases", "Redeem code", and links to the Privacy Policy and the Terms of Use (Apple's standard EULA).
- Free tier: the whole app is free for up to 5 training days per calendar month. A training day is a day with at least one finished live workout longer than 7 minutes (several workouts on one day count once), so the limit cannot be reached in a short review session; use Settings as above. History, backup, export and logging past workouts always work.
- After the first finished live workout (free tier only, shown once) a window "First workout done!" explains the model. "See Pro plans ›" opens the purchase screen, "Awesome, keep training!" closes it, "Why this price? See the espresso index." opens a page on our website.
- Family Sharing is enabled for all three products.
- Ongoing value (Guideline 3.1.2(a)): the app is actively developed and updated regularly, and every new feature is included in the subscription. Users who prefer a single payment can choose the lifetime unlock.

EXERCISES AND DRAWINGS
- More > Exercises, tap an exercise (e.g. Back Squat), then "Technique": setup, movement, tips and common mistakes. Many exercises also show a simple movement drawing generated on the device; squat, bench press and deadlift variations are animated and highlight the main muscles. The section ends with a note that the app gives no medical advice.

BACKUP, IMPORT, ERASE
- More > Backup: "Export history to CSV" and "Import history from a CSV file". Import shows a preview and never removes existing data. To try it: export to CSV, then import the same file.
- More > Settings, bottom: "Erase all data" asks for confirmation and first saves a backup file in Files.

APPLE HEALTH (optional, off by default)
- More > Settings > "Save finished workouts to Apple Health": after the permission sheet, each finished workout is written to Health.
- More > Settings > "Show data from Apple Health": read-only (steps, workouts, heart rate, active energy) in the Plan day panel and session details; never stored or sent. The simulator has no Health data.

APPLE WATCH (companion app, optional)
- Shows the workout started on the iPhone (exercise, set, weight, reps); "Set done" and "Undo" work on the watch, and the rest countdown ends with a haptic. With Health saving on, the watch runs a workout session (heart rate, active energy) and the workout is saved to Health once. Without a workout on the phone the watch shows "Start a workout on your phone".

VOICE ANNOUNCEMENTS (optional, off by default)
- More > Settings > "Voice announcements": at the start of a rest the next exercise is announced with on-device iOS speech.

REST TIMER
- The rest countdown also appears on the Lock Screen as a Live Activity. The end-of-rest notification is local and time-sensitive. No push notifications.

CONTACT
- Support: support@apps4brew.com (also "Write to us" in More > About).
```

## Polski (dla właściciela — to samo znaczenie)

```text
Dziękujemy za recenzję aplikacji Trening.

BEZ KONTA I BEZ SERWERA
- Bez logowania i bez zaplecza. Wszystko zostaje na urządzeniu; aplikacja sama nie wykonuje połączeń sieciowych. Konto demonstracyjne nie jest potrzebne.
- Żeby szybko zobaczyć dane: w zakładce Trening „Inny trening”, dodaj ćwiczenie i odhacz serię; albo w zakładce Plan „Dopisz trening wstecz”.

ZAKUPY W APLIKACJI (grupa subskrypcji „Pełna wersja”: miesięczna i roczna odnawiane automatycznie oraz jednorazowy dostęp dożywotni; bez ofert wprowadzających i okresów próbnych)
- Więcej → Ustawienia, sekcja „Subskrypcja” → „Pełna wersja” otwiera ekran zakupu w każdej chwili; otwiera się też przy starcie treningu po wykorzystaniu darmowego limitu. Pokazuje cenę i okres z App Store, „Przywróć zakupy”, „Zrealizuj kod” i linki do polityki prywatności oraz warunków (standardowa licencja Apple).
- Bez zakupu cała aplikacja jest darmowa do 5 dni treningowych w miesiącu kalendarzowym. Dzień treningowy to dzień z co najmniej jednym ukończonym treningiem na żywo dłuższym niż 7 minut (kilka treningów jednego dnia liczy się raz), więc limitu nie da się osiągnąć w krótkiej recenzji; ekran zakupu jak wyżej, z Ustawień. Historia, kopia, eksport i dopisywanie treningów wstecz działają zawsze.
- Po pierwszym ukończonym treningu na żywo (tylko w wersji darmowej, raz) okno „Pierwszy trening za Tobą!” tłumaczy model. „Zobacz plany Pro ›” otwiera ekran zakupu, „Super, trenuję dalej!” zamyka okno, „Skąd ta cena? Poznaj indeks espresso.” otwiera stronę na naszej witrynie.
- Chmura rodzinna włączona we wszystkich trzech produktach.
- Stała wartość subskrypcji (wytyczna 3.1.2(a)): aplikacja jest rozwijana i regularnie aktualizowana, a każda nowa funkcja wchodzi w skład subskrypcji. Kto woli jedną płatność, wybiera dostęp dożywotni.

ĆWICZENIA I RYSUNKI
- Więcej → Ćwiczenia, stuknij ćwiczenie (np. Back Squat), potem „Technika”: ustawienie, ruch, wskazówki i częste błędy. Wiele ćwiczeń ma też prosty rysunek ruchu rysowany przez aplikację na urządzeniu; odmiany przysiadu, wyciskania leżąc i martwego ciągu są animowane i wyróżniają mięśnie główne. Sekcja kończy się zdaniem, że aplikacja nie udziela porad medycznych.

KOPIA, IMPORT, CZYSZCZENIE
- Więcej → Kopia zapasowa: „Eksportuj historię do CSV” i „Importuj historię z pliku CSV”. Import pokazuje podgląd i nigdy nie usuwa obecnych danych. Żeby wypróbować: eksport do CSV, potem import tego samego pliku.
- Więcej → Ustawienia, na dole: „Wyczyść wszystkie dane” pyta o potwierdzenie i najpierw zapisuje plik kopii w Plikach.

APPLE HEALTH (opcjonalnie, domyślnie wyłączone)
- Więcej → Ustawienia → „Zapisuj zakończone treningi do Apple Health”: po zgodzie każdy zakończony trening trafia do Zdrowia.
- Więcej → Ustawienia → „Pokazuj dane z Apple Health”: tylko odczyt (kroki, treningi, tętno, energia aktywna) w panelu dnia w Planie i w szczegółach sesji; nie jest zapisywany ani wysyłany. Symulator nie ma danych Zdrowia.

APPLE WATCH (aplikacja towarzysząca, opcjonalnie)
- Pokazuje trening rozpoczęty na iPhonie (ćwiczenie, seria, ciężar, powtórzenia); „Seria zrobiona” i „Cofnij” działają na zegarku, a odliczanie przerwy kończy wibracja. Przy włączonym zapisie do Zdrowia zegarek prowadzi sesję treningu (tętno, energia aktywna), a trening trafia do Zdrowia raz. Bez treningu na telefonie zegarek pokazuje „Zacznij trening na telefonie”.

ZAPOWIEDZI GŁOSOWE (opcjonalnie, domyślnie wyłączone)
- Więcej → Ustawienia → „Zapowiedzi głosowe”: na początku przerwy aplikacja zapowiada następne ćwiczenie syntezatorem mowy iOS na urządzeniu.

PRZERWA
- Odliczanie przerwy jest też na ekranie blokady jako Live Activity. Powiadomienie o końcu przerwy jest lokalne, z poziomem pilnym (time-sensitive). Bez powiadomień push.

KONTAKT
- Wsparcie: support@apps4brew.com (także „Napisz do nas” w Więcej → O aplikacji).
```

## Notatka do każdej subskrypcji (Subscription → App Review Information → Review Notes; opcjonalna — bez ofert wprowadzających)

```text
Auto-renewable subscription without introductory offers. Purchase screen: More > Settings > Subscription > Full version (any time), or when starting a workout after the 5 free training days of the month are used. Ongoing value: no monthly limit and all features added in regular updates; a one-time lifetime unlock is offered as an alternative.
```
