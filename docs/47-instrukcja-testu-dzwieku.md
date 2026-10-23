# 47. Instrukcja testu: dźwięk, wibracja, tryb skupienia, zegarek (build 1030 i kolejne)

Stan: 23.10.2026. Dla właściciela, na telefonie z TestFlight. Ok. 15 minut. Dotyczy punktów listy kontrolnej **ZD-01**, **PR-12**, **W2-04**, **W2-05** i ryzyka **R-004** (docs/40). Nazwy w iOS zależą od wersji systemu — jeśli
któraś jest inna, szukaj podobnej i napisz, jak się nazywa u Ciebie. Wynik wpisz do tabeli na końcu i wyślij agentowi.

## Co wiemy przed testem (żebyś wiedział, czego się spodziewać)

- Dźwięk końca przerwy i końca serii na czas to **dźwięk powiadomienia**, nie odtwarzacz w aplikacji. Apple: tryb cichy „nie dzwoni i nie odtwarza alertów ani efektów dźwiękowych (ale iPhone może wibrować)”. Aplikacje, które grają mimo trybu cichego (np. wideo w Instagramie), używają własnego odtwarzania z kategorią sesji audio „playback”,
  którą Apple opisuje jako grającą także przy włączonym trybie cichym. Aplikacja Trening takiego odtwarzacza dla końca przerwy nie ma (jedyne odtwarzanie to głos). Zapisanej decyzji o dźwięku w trybie cichym dotąd nie było; opcje i rekomendacja: docs/18, wpis z 23.10.2026.
- Wibracja i dźwięk to dwa osobne przełączniki w aplikacji („Dźwięk na koniec przerwy”, „Wibracje”). Wibracja na koniec przerwy przy aplikacji na wierzchu pochodzi z samej aplikacji i **nie zależy od tego, czy powiadomienie się pokazało** —
  dlatego przy trybie skupienia mogła przyjść wibracja bez baneru.
- Powiadomienie jest „pilne” (Time Sensitive); pakiet z buildu 1030 ma to uprawnienie (log CI: `testflight.yml` run 39881352744, „ipa: aplikacja — klucze uprawnień w pakiecie: com.apple.developer.usernotifications.time-sensitive”). Czy przebija **Twój** tryb skupienia, zależy od
  ustawień na telefonie — to sprawdza krok C.
- Głos („Zapowiedzi głosowe”) jest na nowej instalacji **wyłączony** (decyzja DEC-05) i mówi tylko przy aplikacji na wierzchu.

## Przed testem: ustawienia iPhone’a (krok po kroku)

1. **Tryb cichy wyłączony.** Na modelu z przełącznikiem: przełącznik z boku przesunięty do przodu (bez pomarańczowego paska). Na modelu z przyciskiem Action: przytrzymaj przycisk, aż zobaczysz „Dzwonek”. Albo: Ustawienia → Dźwięki i haptyka → Tryb cichy wyłączony.
   Źródło: https://support.apple.com/guide/iphone/silence-iphone-iph81c7fd7d1/ios
2. **Głośność alertów.** Ustawienia → Dźwięki i haptyka. Apple: alarmy, timery, alerty i dźwięki systemowe domyślnie mają głośność dzwonka, ale można je rozdzielić („Dopasuj do głośności dzwonka” wyłączone w sekcji „Alerty i dźwięki systemowe”) — jeśli rozdzieliłeś, ustaw suwak alertów
   wysoko. Włącz też „Haptyka systemowa”. Źródło: https://support.apple.com/guide/iphone/change-sounds-and-vibrations-iph07c867f28/ios
3. **Powiadomienia aplikacji.** Ustawienia → Powiadomienia → Trening: „Zezwalaj na powiadomienia” włączone; „Dźwięki” włączone; **„Powiadomienia pilne”** (Time Sensitive Notifications) włączone; banery włączone. Źródło:
   https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios
4. **W aplikacji.** Więcej → Ustawienia: „Dźwięk na koniec przerwy” włączony, „Wibracje” włączone. Domyślna przerwa ustaw na 30 s (żeby test był krótki). „Zapowiedzi głosowe”: na razie „Wyłączone”.

## Test A. Aplikacja na wierzchu, telefon odblokowany, tryb cichy wyłączony

1. Zacznij trening, odhacz serię (✓). **Oczekiwane:** krótkie lekkie stuknięcie wibracji w momencie ✓ (nie ma osobnego dźwięku przy ✓ — tak jest zaprojektowane).
2. Poczekaj do końca przerwy (30 s). **Oczekiwane:** wibracja (sygnał sukcesu), baner „Przerwa minęła” i dźwięk powiadomienia.
3. Wyłącz w aplikacji „Wibracje”, powtórz: dźwięk bez wibracji. Wyłącz „Dźwięk…”, włącz „Wibracje”: wibracja bez dźwięku. Włącz oba z powrotem.

## Test B. Zablokowany ekran

1. Odhacz serię, od razu zablokuj telefon, połóż go ekranem w dół i czekaj. **Oczekiwane:** na końcu przerwy ekran blokady się zapala, jest baner „Przerwa minęła”, dźwięk i wibracja (z samego powiadomienia).

## Test C. Tryb skupienia (R-004)

1. Ustawienia → Skupienie → wybierz profil (np. „Nie przeszkadzaj”). Sprawdź dwie rzeczy: w „Aplikacje” **nie** dodawaj Trening do dozwolonych oraz włączony przełącznik **„Powiadomienia pilne”** (Time Sensitive Notifications — Apple:
   „allows all apps to send time-sensitive notifications immediately”). Źródło: https://support.apple.com/guide/iphone/allow-or-silence-notifications-for-a-focus-iph21d43af5b/ios
2. Włącz ten profil (Centrum sterowania → Skupienie). Zrób Test B (zablokowany ekran). **Oczekiwane:** baner, dźwięk i wibracja pojawiają się mimo skupienia.
3. Powtórz Test A (aplikacja na wierzchu) w tym samym skupieniu. **Zapisz osobno**, co się stało: baner / dźwięk / wibracja. (Przy R-004 pytanie brzmi, czy brak baneru dotyczył aplikacji na wierzchu, czy zablokowanego ekranu.)
4. Wyłącz „Powiadomienia pilne” w tym profilu skupienia i powtórz Test B. **Oczekiwane:** powiadomienie jest wyciszone (brak baneru i dźwięku) — to potwierdza, że przełącznik działa. Włącz go z powrotem.
5. Opcjonalnie: Ustawienia → Powiadomienia → Trening → wyłącz „Powiadomienia pilne” i powtórz — te same skutki.

## Test D. Tryb cichy (dźwięk)

1. Włącz tryb cichy (krok 1 z „Przed testem”, odwrotnie). Powtórz Test A. **Oczekiwane:** wibracja i baner są, **dźwięku nie ma** — zgodnie z Apple to zachowanie systemu dla powiadomień. Jeśli właśnie tak było przy Twoim teście z Instagramem w tle, to jest przyczyna.
2. Zapisz: czy chciałbyś, żeby aplikacja grała krótki sygnał nawet w trybie cichym (opcja B w docs/18)? To Twoja decyzja produktowa.

## Test E. Głos w słuchawkach (W2-04)

1. Więcej → Ustawienia → „Zapowiedzi głosowe” → „W słuchawkach”. Włóż AirPods (dźwięk idzie do nich). Aplikacja na wierzchu, telefon odblokowany.
2. Odhacz serię. **Oczekiwane:** zapowiedź w słuchawkach (ćwiczenie, ciężar, powtórzenia), muzyka ściszona na czas zdania. Z zablokowanym ekranem **głosu nie będzie** (etap 1: mowa tylko przy aplikacji na wierzchu).
3. Wyjmij słuchawki: przy „W słuchawkach” cisza; przy „Także przez głośnik” mówi telefon (także w trybie cichym).

## Test F. Apple Watch (W2-05)

1. Na zegarku: Ustawienia → Dźwięki i haptyka → „Haptyka” = Domyślna albo Wyraźna (nie Wył.). Źródło:
   https://support.apple.com/guide/watch/adjust-volume-and-haptics-apd62807a9f3/watchos — tryb cichy zegarka wycisza dźwięki, nie wibracje.
2. Zacznij trening na telefonie, otwórz aplikację Trening na zegarku. **Sprawdź zieloną ikonę figurki w rogu** — oznacza trwającą sesję treningu (tylko wtedy aplikacja żyje po opuszczeniu ręki i może wibrować). Zapisz: jest czy nie.
3. Odhacz serię na zegarku, opuść rękę na czas przerwy (30 s). **Oczekiwane:** wibracja na zegarku na koniec przerwy. Zapisz: wibracja była / nie; ikona była / nie.
4. Doprowadź trening do **ostatniej serii**, odhacz ją na zegarku. **Oczekiwane (decyzja 23.10.2026):** odliczanie i **jeden** napis „Zakończ trening na telefonie” (nie dwa razy „nic więcej do zrobienia”); po końcu odliczania ten sam napis, jeden raz.

## Co odesłać

| Test | Baner | Dźwięk | Wibracja | Uwagi (ekran na wierzchu / zablokowany, ikona figurki) |
|---|---|---|---|---|
| A |  |  |  |  |
| B |  |  |  |  |
| C.2 (skupienie, zablokowany) |  |  |  |  |
| C.3 (skupienie, na wierzchu) |  |  |  |  |
| C.4 (bez „pilnych”) |  |  |  |  |
| D (tryb cichy) |  |  |  |  |
| E (głos) | — | — | — |  |
| F.3 (zegarek, koniec przerwy) | — | — |  |  |
| F.4 (zegarek, ostatnia seria) | napis raz? | — | — |  |

## Źródła (przeczytane 23.10.2026)

- Silence iPhone: https://support.apple.com/guide/iphone/silence-iphone-iph81c7fd7d1/ios
- Change iPhone sounds and vibrations: https://support.apple.com/guide/iphone/change-sounds-and-vibrations-iph07c867f28/ios
- Change notification settings on iPhone: https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios
- Allow or silence notifications for a Focus: https://support.apple.com/guide/iphone/allow-or-silence-notifications-for-a-focus-iph21d43af5b/ios
- Adjust volume and haptics on Apple Watch: https://support.apple.com/guide/watch/adjust-volume-and-haptics-apd62807a9f3/watchos
- AVAudioSession.Category.ambient („Screen locking and the Silent switch … silence your audio”): https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/ambient
- AVAudioSession.Category.playback („your app audio continues with the Silent switch set to silent or when the screen locks”): https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback
- UNNotificationInterruptionLevel.timeSensitive („can break through system controls such as Notification Summary and Focus. The user can turn off the ability for time sensitive notification interruptions”): https://developer.apple.com/documentation/usernotifications/unnotificationinterruptionlevel/timesensitive
