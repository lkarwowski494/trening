# 36. Głos w słuchawkach (0.20 „Zegarki i głos”)

Telefon mówi zapowiedź następnego ćwiczenia na początku przerwy. Część wspólna wydania 0.20 razem z zegarkami (docs/35). Decyzje właściciela z 13.10.2026 (docs/18) mają pierwszeństwo przed wcześniejszym szkicem analityka.

## 1. Decyzje właściciela (13.10.2026)

1. Zapowiedź **na początku przerwy** (zaraz po odhaczeniu serii): ćwiczenie, ciężar i liczba powtórzeń — **bez talerzy** (każda siłownia ma inne).
2. **Koniec przerwy — osobny krótki sygnał** (nie mowa).
3. Przy rekordzie w odhaczonej serii — zapowiedź rekordu.
4. **Mówi telefon.** Słuchawki tylko mówią; przyciski słuchawek i gesty głową odrzucone; Siri odpuszczone.
5. **Głośnik telefonu jako przełącznik w Ustawieniach, domyślnie wyłączony** — bez słuchawek cisza.
6. Muzyka **ściszana na czas zdania**.

## 2. Co i kiedy mówi (lib/voice.ts — cała logika, czysta i testowana)

**Tekst** to ta sama funkcja, co podpis przerwy na ekranie, Live Activity i migawka zegarka — `restCue` (lib/live.ts):
„dalej: Bench Press (sztanga), 80 kg, 8 powtórzeń” (inne ćwiczenie) albo „Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń” (ta sama seria bloku / superset). Pole puste albo 0 jest pomijane (nie zgadujemy liczby);
masa ciała: „masa ciała” / „+10 kg”; seria na czas: „45 s”; po ostatniej serii „nic więcej do zrobienia”. Jednostki w jednostce aplikacji (kg/lb), liczba mnoga powtórzeń przez `tp`, 35 języków.

**Dwie wersje jednego tekstu (14.10.2026, zgłoszenie tłumacza):** syntezator literuje skróty („el-be”), więc `restCue` zwraca `text` (ekran, Live Activity, powiadomienie, zegarek — skrót kg/lb)
i `speech` (głos i VoiceOver — pełna odmieniona nazwa: „80 kilogramów”, „1 pound”, „62,5 kilograma”). Obie składa ta sama funkcja (`buildCue`), różni je tylko jednostka ciężaru (`spokenUnit`).
Liczba mnoga całkowitych: `tp()` (klucze „kilogram|kilogramy|kilogramów”, „funt|funty|funtów”); ułamek ma w wielu językach własną formę (reguły CLDR, v ≠ 0), stąd osobne klucze „kilograma” / „funta”;
fr i pt-BR czytają ułamek poniżej 2 w liczbie pojedynczej (CLDR: one = i 0..1). Uproszczenie: hr, sr, lv mają „one” także dla ułamków kończących się na 1 (62,1) — tu forma „other”.
Ta sama zasada dla dystansu i czasu (14.10.2026): `spokenMeters` („400 metrów”, „1 metr”, ułamek „12,5 metra” — osobny klucz „metra”, fr i pt-BR poniżej 2 w liczbie pojedynczej) i `spokenDuration`
(„45 sekund”, „1 minuta 30 sekund”, „25 minut”, „1 godzina 5 minut” zamiast „45 s” i zegarowego „25:00”, które syntezator czyta jak skrót albo godzinę; liczby całkowite przez `tp()`, klucze „metr|metry|metrów”, „metra”,
„sekunda|sekundy|sekund”, „godzina|godziny|godzin”, minuty — istniejący klucz „minuta|minuty|minut”). Etykieta serii w głosie bez liter typu, które syntezator literuje: „rozgrzewka” (zamiast „seria W”),
„seria 3, drop set” (zamiast „3D”), „seria 2, do upadku” (zamiast „2F”; istniejące klucze). Ekran, Live Activity, powiadomienie i zegarek bez zmian („45 s”, „25:00”, „2F”).
Pozostałe znaki w głosie: „·” między nazwą a serią i „+”/„−” przed dociążeniem (symbole, nie skróty) — do sprawdzenia na telefonie w E2E.
Tłumaczenia 8 kluczy jednostek (kilogram, funt, ich ułamki, metr, ułamek metra, sekunda, godzina) — do przeglądu tłumacza.
Przy rekordzie przed zapowiedzią „Nowy rekord!” (ta sama detekcja co plakietka PR; serie „do uzupełnienia” z zegarka rekordu nie mają — docs/35 rozdz. 5).

**Kiedy** (`voicePolicy`, pierwsza pasująca reguła):

| # | Warunek | Wynik |
|---|---|---|
| 1 | „Dźwięk i wibracja” wyłączone w Ustawieniach | cisza (wspólny wyłącznik dźwięków przerwy) |
| 2 | aplikacja w tle / nieaktywna | cisza (etap 1, rozdz. 5) |
| 3 | brak słuchawek i przełącznik „Głos także przez głośnik” wyłączony | cisza |
| 4 | VoiceOver włączony | `announce()` — głos i tempo VoiceOvera użytkownika, bez własnej syntezy równolegle |
| 5 | słuchawki (przewodowe, Bluetooth, USB) | mowa |
| 6 | głośnik telefonu z włączonym przełącznikiem | mowa |

Zapowiedź startuje tylko przy **faktycznym starcie przerwy** (`lib/setFlow.ts startRest`): środek rundy supersetu (bez przerwy) i odhaczenie po końcu przerwy (opóźnione zdarzenie z zegarka) — cisza. Każde odhaczenie — z telefonu,
z zegarka, po ponownym pomiarze — idzie tą samą drogą. **Cofnięcie odhaczenia przerywa mowę.** Nowa zapowiedź przerywa poprzednią (szybkie kolejne odhaczenia: mówi tylko aktualna). Błąd modułu audio nigdy nie psuje przerwy ani odhaczenia.
Koniec przerwy: dotychczasowe powiadomienie lokalne (dźwięk + wibracja, działa także w tle); osobnego dźwięku modułu głosu nie dokładamy, żeby nie dublować sygnału.

## 3. Ustawienia (Więcej → Ustawienia → Trening)

- „Głos także przez głośnik telefonu” (przełącznik, domyślnie wyłączony; pole `Settings.voiceSpeaker`, zapisywane tylko `true`, bez zmiany schematu) z opisem: w słuchawkach zapowiedź jest zawsze (gdy dźwięk włączony), przez głośnik tylko po włączeniu.
- „Posłuchaj przykładu” — przykładowa zapowiedź w języku i jednostce aplikacji.
- Gdy telefon nie ma głosu dla języka aplikacji: wskazówka z instrukcją pobrania głosu w ustawieniach iOS (Dostępność → Treści mówione → Głosy). Wg listy Apple głosów może nie być m.in. dla serbskiego, łotewskiego i estońskiego — **do sprawdzenia na urządzeniu**.

## 4. Moduł natywny (`modules/voice-cue`, Swift)

Wzór: `modules/rest-activity`. Funkcje: `isSupported`, `hasVoice(język)`, `headphonesConnected()`, `speak(tekst, język)` (obietnica: wypowiedziano do końca), `stop()`. Mowa AVSpeechSynthesizer, offline.

- **Sesja dźwięku:** kategoria `playback`, tryb `spokenAudio`, opcje `duckOthers` + `interruptSpokenAudioAndMixWithOthers`; po zdaniu `setActive(false, .notifyOthersOnDeactivation)` → muzyka wraca do pełnej głośności, podcast/audiobook
  zatrzymany wraca. Twardy limit ściszania 20 s (Apple: „Set this option on a temporary basis only. Don’t use it to duck the audio of other apps for more than a few seconds.” — developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/duckothers,
  przeczytane 13.10.2026).
- **Wyciszony telefon:** `playback` gra przy przełączniku Dzwonek/Cisza („your app audio continues with the Silent switch set to silent” — …/avaudiosession/category-swift.struct/playback, przeczytane 13.10.2026).
  Wg dokumentacji expo-speech ta biblioteka przy trybie cichym milczy (docs.expo.dev/versions/latest/sdk/speech — cytat ze specyfikacji analityka, nie czytany ponownie), dlatego **własny moduł zamiast zależności**.
  Skutek uboczny: przy włączonym przełączniku głośnika telefon mówi także w trybie cichym (iOS nie udostępnia stanu przełącznika). Opcje i rekomendacja: rozdz. 6, pytanie 2.
- **Słuchawki:** `headphones`, `bluetoothA2DP`, `bluetoothLE`, `bluetoothHFP`, `usbAudio` w bieżącej trasie. Głośnik, AirPlay, HDMI i samochód to nie słuchawki.
- Nie kompiluje się na Linuksie: kompilację sprawdza `ios-unsigned.yml`; `verify:native` sprawdza linkowanie modułu i brak `UIBackgroundModes`; `tests/voice-native.test.ts` pilnuje decyzji w źródle Swift.

## 5. Decyzja: etap 1 bez trybu audio w tle

Mowa tylko przy aplikacji na wierzchu. Powody: (a) `verify:native` celowo zabrania `UIBackgroundModes` (dodanie trybu `audio` to zmiana polityki, nie szczegół), (b) wytyczna App Review 2.5.4 dopuszcza usługi w tle do ich zamierzonych celów
(odtwarzanie dźwięku wymienione) — ocena ryzyka dla okazjonalnej mowy w trakcie treningu to zadanie **badacza** (otwarte), (c) telefon w kieszeni z włączoną opcją „Ekran włączony podczas treningu” (domyślnie włączona) jest cały czas
na wierzchu, więc główny scenariusz (zegarek + słuchawki) działa; zablokowany ekran = cisza, a koniec przerwy daje powiadomienie. Etap 2 (tryb `audio`, start mowy z tła po zdarzeniu z zegarka) — po teście na telefonie właściciela
i opinii badacza; kosztuje 1–2 dni.

## 6. Pytania otwarte (do właściciela, z opcjami i rekomendacją)

1. **Osobny wyłącznik głosu w słuchawkach?** Dziś zapowiedź w słuchawkach jest zawsze, gdy włączone „Dźwięk i wibracja”. A (rekomendacja po decyzji z 13.10): bez osobnego wyłącznika — mniej ustawień, a kto nie chce, wyłącza dźwięk;
   B: przełącznik „Głos w słuchawkach” (domyślnie włączony). Plus A: zgodne z decyzją; minus A: kto chce ciszy tylko w głosie, traci też sygnał końca przerwy.
2. **Przełącznik głośnika a tryb cichy:** A (wdrożone): przy włączonym przełączniku mówi także w trybie cichym (użytkownik sam włączył głos); B: milczeć na głośniku w trybie cichym — iOS nie pokazuje stanu przełącznika, wymaga obejścia
   (odtworzenie cichego dźwięku i pomiar), niepewne; C: kategoria `ambient` na głośniku (szanuje tryb cichy, ale bez ściszania muzyki). Rekomendacja: A.
3. **Znak oddzielający części zapowiedzi:** przecinki (dziś, czytane naturalnie) vs. kropki; do oceny przy teście ze słuchawkami (35 języków: w japońskim/chińskim warto „、”).
4. **Etap 2 (tryb `audio` w tle)** — kiedy: rekomendacja po teście etapu 1 na telefonie właściciela.

## 7. Testy (docs/20)

`tests/voice.test.ts` (polityka: wszystkie 32 kombinacje; tekst i rekord; trasa dźwięku; integracja z odhaczeniem z telefonu i z zegarka; cofnięcie; ustawienie w danych), `tests/voice-module.test.ts` (most na atrapie modułu Expo),
`tests/voice-native.test.ts` (źródło Swift), `tests/voice-ui.test.tsx` (Ustawienia: przełącznik, przykład, brak głosu, EN), `tests/watch-cue.test.ts` (tekst zapowiedzi, 35 języków). E2E Maestro: dźwięku na symulatorze nie słychać —
scenariusz tylko na przełączniku w Ustawieniach (do dopisania razem z klientami zegarków). Ręcznie na telefonie właściciela: AirPods + muzyka (ściszenie i powrót), podcast (pauza i wznowienie), tryb cichy, odłączenie słuchawek w trakcie,
rozmowa, VoiceOver, język bez głosu.
