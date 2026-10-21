# Notatki dla recenzenta App Store (App Review Information → Notes) — wersja 21.10.2026

Szkic do akceptacji właściciela (docs/41-droga-do-app-store.md, pozycje A5 i B5). Odświeżenie M8 (21.10.2026) wersji z 14.10.2026 (gałąź `f020-sklep`):
okres próbny 14 dni (`TRIAL_DAYS`, decyzja 19.10.2026) zamiast miesiąca; zapowiedzi głosowe domyślnie wyłączone po instalacji (`VOICE_NEW_INSTALL`, DEC-05)
i nowe etykiety ustawienia; kalkulator talerzy usunięty 19.10.2026 — nie występuje w notatkach. Test: `tests/store-review-notes.test.ts`
(limit pola, teksty przycisków z `lib/i18n.en.ts`, liczby i stany domyślne z kodu, brak danych osobowych).

Do App Store Connect wkleja się **wersję angielską**; wersja polska jest dla właściciela. Bez danych osobowych: aplikacja nie ma konta, więc nie ma
loginu ani hasła do podania („Sign-in required” wyłączone). Pola „Contact Information” (imię, telefon, e-mail recenzji) właściciel wypełnia sam
w App Store Connect — nie w repo.

Warianty zależą od `PAYWALL.ENABLED` w buildzie wysyłanym do recenzji (decyzja D-1 = P, 14.10.2026 — zakupy od 1.0):
- **`PAYWALL.ENABLED = true`** — wklejamy całość i dodajemy notatkę subskrypcji (blok trzeci) do każdej z dwóch subskrypcji;
- **`PAYWALL.ENABLED = false`** — usuwamy akapit „IN-APP PURCHASES” i **nie** dodajemy produktów do zgłoszenia (2.1(b)).

**Warunki przed wklejeniem** (agent na buildzie 1.0, po redesignie M3 — ścieżki ekranów mogą się zmienić; test pilnuje tylko etykiet):
- [ ] ścieżki i nazwy przycisków na buildzie do recenzji (Settings → „Subscription” widoczne tylko przy `PAYWALL.ENABLED = true`);
- [ ] skrzynka support@apps4brew.com działa (docs/41 E4) — inaczej usunąć akapit CONTACT;
- [ ] oferta wprowadzająca w App Store Connect = 2 tygodnie w obu subskrypcjach (docs/43 K-011).

Źródła: pole Notes „can contain up to 4000 bytes” (developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/,
odczyt 14.10.2026); notatka subskrypcji „Required if the subscription offers introductory pricing”
(developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/, odczyt 14.10.2026).

## English (do wklejenia)

```text
Thank you for reviewing Trening.

NO ACCOUNT, NO SERVER
- The app has no sign-in and no backend. Everything is stored on the device; the app makes no network requests of its own. No demo account is needed.
- To see the app with data quickly: on the Workout tab tap "Other workout", add an exercise and tick a set; or use "Log a past workout" to add a session in the past.

IN-APP PURCHASES (one subscription group "Full version": monthly and yearly auto-renewable subscriptions with a 14-day free introductory offer, plus a one-time lifetime unlock)
- Where to find them: More > Settings, section "Subscription" > "Full version". The purchase screen also opens once after the first finished workout.
- The purchase screen shows the price and period from the App Store, "Restore purchases", "Redeem code", and links to the Privacy Policy and the Terms of Use (Apple's standard EULA).
- Without an active purchase, after the 14-day free period the app still allows 4 live workouts per calendar month; history, backup and export always work.
- Family Sharing is enabled for all three products.

APPLE HEALTH (optional, off by default)
- More > Settings > "Save finished workouts to Apple Health": after the permission sheet, each finished workout is written to Health.
- More > Settings > "Show data from Apple Health": read-only (steps, workouts, heart rate, active energy), shown in the Plan day panel and in session details. Read data is never stored by the app.
- The simulator has no Health data, so the read view is empty there.

APPLE WATCH (companion app, optional)
- The watch app shows the current workout started on the iPhone: exercise, set, weight and reps, and the rest countdown with a haptic at the end.
- To test: install the app on an iPhone paired with an Apple Watch, start a workout on the iPhone, and open Trening on the watch. Without a workout on the phone the watch shows "Start a workout on your phone".
- The watch runs a workout session (heart rate and active energy with permission) and saves the finished strength workout to Apple Health.

VOICE ANNOUNCEMENTS (optional, off by default)
- More > Settings > "Voice announcements": "Off", "In headphones" or "Also through the speaker". At the start of a rest the app announces the next exercise using on-device iOS speech synthesis. "Listen to an example" plays a sample.

REST TIMER
- The rest countdown also appears on the Lock Screen as a Live Activity. The end-of-rest notification is a local, time-sensitive notification so it can be delivered during a Focus; users can change this in iOS Settings. The app does not use push notifications.

CONTACT
- Support: support@apps4brew.com (also "Write to us" in More > About).
```

## Polski (dla właściciela — to samo znaczenie)

```text
Dziękujemy za recenzję aplikacji Trening.

BEZ KONTA I BEZ SERWERA
- Aplikacja nie ma logowania ani zaplecza. Wszystko zostaje na urządzeniu; aplikacja sama nie wykonuje żadnych połączeń sieciowych. Konto demonstracyjne nie jest potrzebne.
- Żeby szybko zobaczyć dane: w zakładce Trening „Inny trening”, dodaj ćwiczenie i odhacz serię; albo „Dopisz trening wstecz”.

ZAKUPY W APLIKACJI (grupa subskrypcji „Pełna wersja”: miesięczna i roczna odnawiane automatycznie z ofertą wprowadzającą 14 dni za darmo oraz jednorazowy dostęp dożywotni)
- Gdzie: Więcej → Ustawienia, sekcja „Subskrypcja” → „Pełna wersja”. Ekran zakupu otwiera się też raz po pierwszym zakończonym treningu.
- Ekran zakupu pokazuje cenę i okres z App Store, „Przywróć zakupy”, „Zrealizuj kod” i linki do polityki prywatności oraz warunków (standardowa licencja Apple).
- Bez zakupu, po 14 dniach okresu próbnego, aplikacja pozwala na 4 treningi na żywo w miesiącu kalendarzowym; historia, kopia i eksport działają zawsze.
- Chmura rodzinna włączona we wszystkich trzech produktach.

APPLE HEALTH (opcjonalnie, domyślnie wyłączone)
- Więcej → Ustawienia → „Zapisuj zakończone treningi do Apple Health”: po zgodzie każdy zakończony trening trafia do Zdrowia.
- Więcej → Ustawienia → „Pokazuj dane z Apple Health”: tylko odczyt (kroki, treningi, tętno, energia aktywna) w panelu dnia w Planie i w szczegółach sesji. Odczytanych danych aplikacja nie zapisuje.
- Symulator nie ma danych Zdrowia, więc widok odczytu jest tam pusty.

APPLE WATCH (aplikacja towarzysząca, opcjonalnie)
- Zegarek pokazuje bieżący trening rozpoczęty na iPhonie: ćwiczenie, serię, ciężar i powtórzenia, odliczanie przerwy z wibracją na końcu.
- Test: iPhone sparowany z Apple Watch, trening rozpoczęty na iPhonie, Trening otwarty na zegarku. Bez treningu na telefonie zegarek pokazuje „Zacznij trening na telefonie”.
- Zegarek prowadzi sesję treningu (tętno i energia aktywna za zgodą) i zapisuje zakończony trening siłowy w Apple Health.

ZAPOWIEDZI GŁOSOWE (opcjonalnie, domyślnie wyłączone)
- Więcej → Ustawienia → „Zapowiedzi głosowe”: „Wyłączone”, „W słuchawkach” albo „Także przez głośnik”. Na początku przerwy aplikacja zapowiada następne ćwiczenie syntezatorem mowy iOS na urządzeniu. „Posłuchaj przykładu” odtwarza próbkę.

PRZERWA
- Odliczanie przerwy jest też widoczne na ekranie blokady jako Live Activity. Powiadomienie o końcu przerwy jest lokalne, z poziomem pilnym (time-sensitive), żeby dotarło także w trybie skupienia; użytkownik zmieni to w ustawieniach iOS. Aplikacja nie używa powiadomień push.

KONTAKT
- Wsparcie: support@apps4brew.com (także „Napisz do nas” w Więcej → O aplikacji).
```

## Notatka do każdej subskrypcji (Subscription → App Review Information → Review Notes; wymagana przy ofercie wprowadzającej)

```text
14-day free introductory offer for new subscribers. Purchase screen: More > Settings > Subscription > Full version.
```
