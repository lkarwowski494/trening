# Notatki dla recenzenta App Store (App Review Information → Notes) — szkic 14.10.2026

Szkic agenta do akceptacji właściciela (docs/41-droga-do-app-store.md, pozycja A5). Do App Store Connect wkleja się **wersję angielską**
(recenzenci Apple czytają po angielsku); wersja polska jest dla właściciela. Bez danych osobowych: aplikacja nie ma konta, więc nie ma loginu
ani hasła do podania. Pola „Contact Information” (imię, telefon, e-mail recenzji) właściciel wypełnia sam w App Store Connect — nie w repo.

Warianty zależą od decyzji o płatnościach w pierwszym wydaniu (docs/41, decyzja D-1):
- **wariant P (płatna, `PAYWALL.ENABLED = true`)** — wklejamy całość;
- **wariant F (start za darmo, `PAYWALL.ENABLED = false`)** — usuwamy akapit „In-app purchases” i **nie** dodajemy produktów zakupu do zgłoszenia
  (wytyczne 2.1(b): skonfigurowane zakupy, których nie da się znaleźć w aplikacji, wymagają wyjaśnienia — prościej ich nie zgłaszać).

Wpisanie: przez App Store Connect API (koordynator, jak `scripts/asc/`) albo ręcznie przez właściciela. **Warunek:** skrzynka support@apps4brew.com musi działać
(Google Workspace — po weryfikacji DSA, docs/41 E4), zanim notatki trafią do zgłoszenia — inaczej usunąć akapit CONTACT.

Nazwy przycisków poniżej to teksty z `lib/i18n.en.ts` (aplikacja startuje w języku telefonu; recenzent zwykle ma angielski).
Przed wklejeniem: sprawdzić ścieżki na buildzie, który idzie do recenzji (agent, przy A5), i długość pola w App Store Connect.

## English (do wklejenia)

```text
Thank you for reviewing Trening.

NO ACCOUNT, NO SERVER
- The app has no sign-in and no backend. Everything is stored on the device; the app makes no network requests of its own. No demo account is needed.
- To see the app with data quickly: open the Workout tab, tap "Other workout", add an exercise and tick a set; or use Plan > "Log a past workout" to add a session in the past.

IN-APP PURCHASES (one subscription group "Full version": monthly and yearly auto-renewable subscriptions with a one-month free introductory offer, plus a one-time lifetime unlock)
- Where to find them: More > Settings, section "Subscription" > "Full version". The purchase screen also opens once after the first finished workout.
- The purchase screen shows the price and period from the App Store, "Restore purchases", "Redeem code", and links to the Privacy Policy and the Terms of Use (Apple's standard EULA).
- Without an active purchase, after the free month the app still allows 4 live workouts per calendar month; history, backup and export always work.
- Family Sharing is enabled for all three products.

APPLE HEALTH (optional, off by default)
- More > Settings > "Save finished workouts to Apple Health": after the permission sheet, each finished workout is written to Health.
- More > Settings > "Show data from Apple Health": read-only (steps, workouts, heart rate, active energy), shown in the Plan day panel and in session details. Read data is never stored by the app.
- The simulator has no Health data, so the read view is empty there; on a device with Health data the Plan day shows steps and other activities.

APPLE WATCH (companion app, optional)
- The watch app only shows the current workout started on the iPhone: exercise, set, weight and reps, and the rest countdown with a haptic at the end. Buttons: set done, done differently, skip.
- To test: install the app on an iPhone paired with an Apple Watch, start a workout on the iPhone, and open Trening on the watch. Without a workout on the phone the watch shows "Start a workout on your phone".
- The watch runs a workout session (heart rate and active energy with permission) and saves the finished strength workout to Apple Health.

VOICE CUES (optional)
- During rest the app announces the next exercise through headphones (on-device iOS speech synthesis). More > Settings > "Voice also through the phone speaker" and "Listen to an example".

CONTACT
- Support: support@apps4brew.com (also linked in More > About > "Write to us").
```

## Polski (dla właściciela — to samo znaczenie)

```text
Dziękujemy za recenzję aplikacji Trening.

BEZ KONTA I BEZ SERWERA
- Aplikacja nie ma logowania ani zaplecza. Wszystko zostaje na urządzeniu; aplikacja sama nie wykonuje żadnych połączeń sieciowych. Konto demonstracyjne nie jest potrzebne.
- Żeby szybko zobaczyć dane: zakładka Trening → „Inny trening”, dodaj ćwiczenie i odhacz serię; albo Plan → „Dopisz trening wstecz”.

ZAKUPY W APLIKACJI (grupa subskrypcji „Pełna wersja”: miesięczna i roczna odnawiane automatycznie z darmowym pierwszym miesiącem oraz jednorazowy dostęp dożywotni)
- Gdzie: Więcej → Ustawienia, sekcja „Subskrypcja” → „Pełna wersja”. Ekran zakupu otwiera się też raz po pierwszym zakończonym treningu.
- Ekran zakupu pokazuje cenę i okres z App Store, „Przywróć zakupy”, „Zrealizuj kod” i linki do polityki prywatności oraz warunków (standardowa licencja Apple).
- Bez zakupu, po darmowym miesiącu, aplikacja pozwala na 4 treningi na żywo w miesiącu kalendarzowym; historia, kopia i eksport działają zawsze.
- Chmura rodzinna włączona we wszystkich trzech produktach.

APPLE HEALTH (opcjonalnie, domyślnie wyłączone)
- Więcej → Ustawienia → „Zapisuj zakończone treningi do Apple Health”: po zgodzie każdy zakończony trening trafia do Zdrowia.
- Więcej → Ustawienia → „Pokazuj dane z Apple Health”: tylko odczyt (kroki, treningi, tętno, energia aktywna) w panelu dnia w Planie i w szczegółach sesji. Odczytanych danych aplikacja nie zapisuje.
- Symulator nie ma danych Zdrowia, więc widok odczytu jest tam pusty.

APPLE WATCH (aplikacja towarzysząca, opcjonalnie)
- Zegarek tylko pokazuje bieżący trening rozpoczęty na iPhonie: ćwiczenie, serię, ciężar i powtórzenia, odliczanie przerwy z wibracją na końcu. Przyciski: seria zrobiona, zrobione inaczej, pomiń.
- Test: iPhone sparowany z Apple Watch, trening rozpoczęty na iPhonie, Trening otwarty na zegarku. Bez treningu na telefonie zegarek pokazuje „Zacznij trening na telefonie”.
- Zegarek prowadzi sesję treningu (tętno i energia aktywna za zgodą) i zapisuje zakończony trening siłowy w Apple Health.

ZAPOWIEDZI GŁOSOWE (opcjonalnie)
- W przerwie aplikacja zapowiada następne ćwiczenie w słuchawkach (syntezator mowy iOS na urządzeniu). Więcej → Ustawienia → „Głos także przez głośnik telefonu” i „Posłuchaj przykładu”.

KONTAKT
- Wsparcie: support@apps4brew.com (także Więcej → O aplikacji → „Napisz do nas”).
```

## Do sprawdzenia przed wklejeniem (agent, na buildzie do recenzji)

- [ ] Ścieżki i nazwy przycisków (Settings → „Subscription” widoczne tylko przy `PAYWALL.ENABLED = true`; „Log a past workout”, „Other workout”, teksty zegarka).
- [ ] Tekst zegarka bez telefonu („Start a workout on your phone”) — zgodny z `lib/watchLabels.ts` w buildzie.
- [ ] Limit 4 treningów i darmowy miesiąc — zgodne z `lib/access.ts` (`FREE_LIVE_PER_MONTH`) i ofertą w App Store Connect.
- [x] Długość pola „Notes”: „The Notes field can contain up to 4000 bytes” (developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/, przeczytane 14.10.2026); tekst EN ma ok. 2500 bajtów.
- [ ] Każda subskrypcja ma też własne „Review Notes” — wymagane, gdy subskrypcja ma ofertę wprowadzającą („Required if the subscription offers introductory pricing”, developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/); propozycja: „Free one-month introductory offer for new subscribers. Purchase screen: More > Settings > Full version.”
