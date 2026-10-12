# 35 — Zasady Apple dla odczytu danych z Apple Zdrowie (wydanie 0.16)

Badacz merytoryczny, 12.10.2026. Wszystkie źródła to dokumentacja Apple (szczebel 4 — jedyny właściwy dla zasad sklepu), przeczytane
12.10.2026. Kontekst: decyzje 11.10.2026 (docs/18-przekazanie.md, pkt 9) — odczyt aktywności, kroków, tętna i kcal tylko na bieżąco,
bez zapisu do danych aplikacji i kopii. Dziś `app.json`: NSHealthShareUsageDescription = „Trening nie odczytuje danych zdrowotnych…”.

## Wnioski

1. **Wytyczna 5.1.3 (aktualny tekst)** — cztery punkty; dla nas istotne (i) i (ii):
   - (i) danych z HealthKit nie wolno używać ani ujawniać stronom trzecim do reklamy, marketingu ani eksploracji danych; ostatnie zdanie:
     trzeba ujawnić, jakie konkretnie dane zdrowotne aplikacja „zbiera z urządzenia”;
   - (ii) zakaz zapisywania fałszywych/niedokładnych danych do HealthKit **i zakaz przechowywania danych zdrowotnych w iCloud** —
     potwierdza decyzję „bez zapisu do kopii” (kopia może trafić do iCloud Drive);
   - (iii)–(iv) dotyczą badań na ludziach — nie dotyczy nas.
   Powiązane: 5.1.2(vi) (zakaz marketingu/eksploracji danych z HealthKit), 2.5.1 (HealthKit tylko do celów zdrowia i fitnessu, integracja
   z aplikacją Zdrowie; integrację **wskazać w opisie aplikacji**), 5.1.1(iii) (prosić tylko o dane potrzebne do funkcji).
2. **Tekst NSHealthShareUsageDescription** — klucz wymagany, gdy aplikacja czyta dane z HealthKit; brak opisów powoduje awarię przy prośbie
   o zgodę. Wymogi Apple dla każdego opisu uprawnień: niepusty, < 4000 bajtów, „accurate, meaningful, and specific”, zwykle jedno pełne
   zdanie, **zlokalizowany dla każdego obsługiwanego języka**. HIG HealthKit: kilka zwięzłych zdań — po co dane i jaka korzyść dla
   użytkownika. **Obecny tekst („nie odczytuje”) stanie się nieprawdziwy po włączeniu odczytu — musi zostać zmieniony we wszystkich
   językach w tym samym wydaniu** (inaczej opis nie jest „accurate”). Treść powinna wymieniać, co czytamy i po co (np. treningi, kroki,
   aktywne kcal, tętno — do pokazania w kalendarzu i szczegółach sesji) — konkretne brzmienie to praca dla tłumacza/analityka.
3. **Etykieta App Privacy („Data Not Collected”)** — definicja Apple: „collect” = przesłanie danych poza urządzenie w sposób, który daje
   deweloperowi lub partnerom dostęp dłuższy niż potrzebny do obsługi żądania w czasie rzeczywistym; dane przetwarzane wyłącznie na urządzeniu
   nie są „zbierane” i nie trzeba ich deklarować. **Wniosek: sam lokalny odczyt z HealthKit bez wysyłania nie zmienia odpowiedzi
   „No, we do not collect data from this app”.** Zastrzeżenia:
   - jeśli cokolwiek pochodnego trafi poza urządzenie do dewelopera (analityka, raporty awarii z danymi, serwer) — trzeba zadeklarować
     (Apple: „If you derive anything from that data and send it off device, the resulting data should be considered separately.”);
   - eksport/kopia wysyłane przez użytkownika do jego własnego miejsca (Pliki, iCloud Drive) — definicja mówi o dostępie *dewelopera*,
     więc to nie jest „collect” — **nasze odczytanie definicji, Apple nie omawia wprost** [OTWARTE, niskie ryzyko]; i tak kopia nie może
     zawierać danych zdrowotnych z powodu 5.1.3(ii);
   - odpowiedzi w formularzu publikuje się w App Store Connect przyciskiem Publish; deweloper odpowiada za ich aktualność.
4. **Polityka prywatności** — każda aplikacja musi mieć link do polityki w App Store Connect i w aplikacji (5.1.1(i)); dokumentacja HealthKit:
   polityka wymagana dla każdej aplikacji używającej HealthKit (mamy ją już z powodu zapisu treningów). Polityka musi określać, jakie dane
   aplikacja zbiera, jak i do czego, oraz zasady przechowywania/usuwania i cofania zgody. Rekomendacja (interpretacja 5.1.3(i) „disclose the
   specific health data”): w `docs/privacy.html` wymienić typy danych **czytanych** i **zapisywanych** w Zdrowiu, że zostają na urządzeniu,
   nie trafiają do kopii ani do dewelopera, oraz jak cofnąć zgodę (Ustawienia iOS → Zdrowie). Zmiana *adresu URL* polityki wchodzi dopiero
   z nową wersją aplikacji (App Store Connect Help); polityka musi być zaktualizowana najpóźniej razem z wydaniem 0.16.
5. **Zachowanie zgód (ważne dla UI)** — aplikacja nie wie, czy użytkownik odmówił odczytu; odmowa wygląda jak brak danych. UI nie może więc
   twierdzić „brak zgody” — tylko „brak danych z Apple Zdrowie” z odesłaniem do ustawień. HIG: prosić o zgodę wtedy, gdy jest potrzebna
   (nie przy starcie), zgodami zarządzać wyłącznie przez ustawienia systemu (bez własnych ekranów, które je udają).

## Źródła (dokumentacja Apple, szczebel 4)

- App Review Guidelines — https://developer.apple.com/app-store/review/guidelines/
  - 5.1.3(ii): „Apps must not write false or inaccurate data into HealthKit or any other medical research or health management apps, and may
    not store personal health information in iCloud.”
  - 5.1.3(i), ostatnie zdanie: „You must disclose the specific health data that you are collecting from the device.”
  - 2.5.1: „Apps should use APIs and frameworks for their intended purposes and indicate that integration in their app description.”
  - 5.1.1(iii): „Apps should only request access to data relevant to the core functionality of the app…”
  - 5.1.1(i): „All apps must include a link to their privacy policy in the App Store Connect metadata field and within the app in an easily
    accessible manner.”
- NSHealthShareUsageDescription — https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthshareusagedescription
  (Important): „This key is required if your app uses APIs that access the someone's health data.”
- Requesting access to protected resources — https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources
  (wymogi opisu): „The purpose string provides a description that's accurate, meaningful, and specific about why the app needs to access the
  protected resource.”; „Adhere to these requirements for every purpose string in your app, including localized purpose strings.”
- HealthKit, Protecting user privacy — https://developer.apple.com/documentation/healthkit/protecting-user-privacy: „You must also provide a
  privacy policy for any app that uses the HealthKit framework.”; „To prevent possible information leaks, an app isn't aware when the user
  denies permission to read data.”
- HealthKit, Authorizing access to health data — https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data:
  „…you don't need to request permission for all data types at once.”
- Human Interface Guidelines, HealthKit — https://developer.apple.com/design/human-interface-guidelines/healthkit: „Write a few succinct
  sentences that explain why you need the information and how people can benefit from sharing it with your app.”; „Request access to health
  data only when you need it.”
- App Privacy Details — https://developer.apple.com/app-store/app-privacy-details/ (sekcja „Data collection” i „Additional guidance”):
  „"Collect" refers to transmitting data off the device in a way that allows you and/or your third-party partners to access it for a period
  longer than what is necessary to service the transmitted request in real time.”; „Data that is processed only on device is not "collected"
  and does not need to be disclosed in your answers.”
- App Store Connect Help, Manage app privacy — https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/:
  „You're responsible for keeping your responses accurate and up to date.”; o URL polityki: „Any changes to the URLs releases with your next
  app version.”

Uwaga o liczbie źródeł: zasady sklepu ma tylko Apple — „kilka niezależnych źródeł” nie ma tu zastosowania; każdy wniosek oparty na
co najmniej dwóch dokumentach Apple tam, gdzie to możliwe (polityka: 5.1.1 + Protecting user privacy + HIG; opis uprawnień: klucz + Requesting
access + HIG). Pojedynczy dokument: definicja „collect” (App Privacy Details) — ale to dokument definiujący, nadrzędny dla etykiety.

## Otwarte pytania

- [OTWARTE, niskie] Czy eksport wywołany przez użytkownika do jego własnego iCloud Drive/Plików jest „collect” — Apple nie omawia; z definicji
  wynika, że nie (brak dostępu dewelopera). Bez znaczenia, jeśli kopia/eksport nie zawierają danych z Health (5.1.3(ii)).
- [OTWARTE] Czy pokazanie danych z Health w widżecie/aktywności na ekranie blokady wymaga dodatkowych zastrzeżeń — dokumentacja przeczytana
  w tym researchu tego nie dotyczy; sprawdzić, jeśli widżet ma pokazywać dane z Health.
- [OTWARTE] Brzmienie nowego opisu NSHealthShareUsageDescription w 35 językach — do przygotowania (tłumacz), wymogi wyżej.
