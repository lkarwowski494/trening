# 35. Zegarek z Connect IQ (fēnix 8) — wydanie 0.20 „Zegarki i głos”

Stan z 13.10.2026, gałąź `f020-garmin` (od `f018-dostosuj`). Specyfikacja ogólna zegarków: scratchpad analityka (`spec-zegarek.md`, część Garmin, rozdz. 4); protokół wspólny z Apple Watch i głosem: gałąź `f020-protokol` (`lib/watch/*`) — **tu opisany jest tylko wąski widok migawki Connect IQ i jego adapter** (patrz „Dopasowanie do protokołu”).
Nazwy producenta zegarka nie występują w kodzie, tekstach aplikacji ani w komentarzach `lib/`, `modules/`, `plugins/`, `tests/` (CLAUDE.md; strażnik `tests/forbidden-names.test.ts`). Ten dokument i katalog `garmin/` (poza zakresem strażnika) mogą ją nazywać.

## 1. Decyzje właściciela (13.10.2026), na których to stoi
- Właściciel ma **fēnix 8 AMOLED** i komputer z USB; wersje testowe wgrywa sam (instrukcja: `garmin-test-wlasciciela.md`, plik poza repo).
- Zegarek **tylko wyświetla** i odsyła zdarzenia, **bez edycji na zegarku**:
  - na ekranie: bieżące ćwiczenie, „seria X z Y”, ciężar × powtórzenia; od początku przerwy odliczanie z wibracją i gotowy tekst „następne ćwiczenie” z telefonu (ten sam tekst co głos w słuchawkach);
  - zdarzenia: „zrobione według planu”, „zrobione inaczej niż w planie”, „pomiń” (z potwierdzeniem), „cofnij”, a także „koniec przerwy” i powitanie;
  - w przerwie przycisk główny odhacza następną serię (P4-A).
- „Seria zrobiona” = **górny prawy przycisk (START)** (P7 rozstrzygnięte przez właściciela, odwrotnie niż rekomendacja specyfikacji — wbudowana „Siła” używa dolnego prawego).
- Wszystko działa **przyciskami** (dotyk można wyłączyć); dotyk jest tylko dodatkiem: stuknięcie = START, przesunięcie w pionie = przewijanie zapowiedzi, przesunięcia poziome nic nie robią.
- Aktywność „Siła” zapisywana na zegarku (P6-A); bez drugiej kopii w Apple Zdrowiu dzięki regule z 11.10.2026 (A): trening z zegarka nakładający się na sesję jest łączony z sesją.

## 2. Przyciski na fēnix 8

| Przycisk | Akcja |
|---|---|
| START (górny prawy), stuknięcie | seria zrobiona według planu; w przerwie — odhacza następną serię |
| BACK (dolny prawy) | „Cofnij”, gdy trwa okno cofnięcia (5 s po odhaczeniu; podpowiedź na ekranie); w innym razie wyjście z aplikacji (zachowanie systemowe) |
| GÓRA / DÓŁ | przewijanie zapowiedzi, gdy się nie mieści |
| GÓRA przytrzymany (menu) | „Zrobione inaczej niż w planie”, „Pomiń ćwiczenie” (okno „Pominąć ćwiczenie?” — tak/nie), „Cofnij” |

Przypisanie przycisków do akcji systemowych (onSelect / onBack / onMenu / onNextPage) to konwencja Connect IQ; **nie sprawdzone na urządzeniu** — pozycja listy testu właściciela.

## 3. Co zbudowano

### Zegarek (`garmin/`, Monkey C)
- `manifest.xml` (generowany), `monkey.jungle`, ikona, zasoby w językach zegarka (`resources*/strings`).
- `source/Model.mc` — stan i reguły (przejście do przerwy bez łączności, odhaczenie „na ślepo” po dwóch seriach bez odpowiedzi, „Cofnij”, koniec przerwy raz). **Lustro `lib/watch/ciqModel.ts`** (wykonywalna specyfikacja, testowana w Jest).
- `source/Link.mc` — kolejka zdarzeń (po jednym, z ponawianiem, zapisywana w pamięci urządzenia, wygasa po 15 min), `Communications.transmit`.
- `source/MainView.mc`, `MainDelegate.mc` — ekran i przyciski; `Wrap.mc` — zawijanie tekstu (lustro `ciqWrap.ts`); `Haptics.mc`; `Recorder.mc` — aktywność „Siła” (FIT), okrążenie na każdą serię; `Labels.mc`, `Wire.mc` — generowane.
- Testy Monkey C (Run No Evil): `source/tests/*.mc`; pliki „złote” `Fixtures.mc` generuje Jest z modelu TypeScript.

### Telefon
- `lib/watch/ciqWire.ts` — **jedno źródło** kluczy wiadomości, trybów, zdarzeń, progów, etykiet (przez `t()`), mapy języków zegarka, walidacji zdarzeń (`parseCiqEvent`, wejście niezaufane).
- `lib/watch/ciqLink.ts` — łącze: stan urządzeń, wysyłanie migawek (zawsze najnowsza, tylko do połączonych), odbiór zdarzeń; transport natywny wstrzykiwany.
- `modules/ciq-link/` — moduł Expo (Swift) opakowujący Connect IQ Mobile SDK dla iOS: parowanie przez aplikację pomocniczą producenta, wiadomości, kolejka zdarzeń, gdy JS jeszcze nie słucha (obudzenie w tle).
- `plugins/withConnectIq.js` — Info.plist (schemat URL powrotu `trening-ciq`, `gcm-ciq`, tryb tła `bluetooth-central`) i Podfile (pod `ConnectIQ`).
- `app/+native-intent.ts` + `lib/watch/ciqUrl.ts` — adres powrotu z parowania kieruje na „Więcej”, nie na „nie znaleziono”.
- Zgoda na Bluetooth: `NSBluetoothAlwaysUsageDescription` w 35 językach (`locales/*.json`); 8 nowych etykiet zegarka w słownikach (33 + EN) — **tłumaczenia mojego autorstwa, do przeglądu tłumacza** (`do-tlumacza-020g.md`).

- `lib/watch/ciqAdapter.ts` — adapter wspólnego protokołu (`f020-protokol`) ↔ wąska migawka/zdarzenia Connect IQ (typy strukturalne zgodne z `WatchSnapshot`/`WatchEvent` z tej gałęzi w stanie z 13.10.2026; zdarzenie `restEnded` wskazuje serię, która uruchomiła przerwę — adapter bierze ją z migawki telefonu; odhaczenie „na ślepo” → bieżąca seria telefonu).
- Tryb próbny bez telefonu tylko w buildzie debug (`garmin/source/Demo.mc`, DÓŁ na ekranie „brak treningu”) — żeby przetestować przyciski przed gotowym parowaniem.

### Czego NIE ma (celowo)
- **Ekranu „Więcej → Zegarek”** (lista urządzeń, przycisk parowania, stan połączenia) i podłączenia łącza do stanu treningu — to pakiet protokołu (`f020-protokol`). Dostarczono gotowy `createCiqLink` + `ciqStatusName`; ekran woła `link.pair()`, czyta `link.state()`.
- Podłączenia adaptera do łącza (`ciqSnapshotFromProtocol` → `toCiqWire` → `link.send`, `link.onEvent` → `protocolEventFromCiq` → reducer zdarzeń) — to pierwsze zadanie po scaleniu z `f020-protokol` (jedna funkcja „most”, bo ona zna `workoutId`, `rev` i stan przerwy). Pola `paused` i `toFillCount` wspólnego protokołu nie są jeszcze pokazywane na zegarku (pauza — brak trybu w migawce Connect IQ; do decyzji).
- Kompilacji i uruchomienia Monkey C oraz Swift (patrz niżej).

## 4. Protokół Connect IQ (skrót; pełny: `lib/watch/ciqWire.ts`, wygenerowany `garmin/source/Wire.mc`)
Słownik z kluczami 1–2 znakowymi; tylko tekst i liczby całkowite (iOS może dostarczyć je jako Float — zegarek to obsługuje).
- Telefon → zegarek, migawka: `k`=`s`, `v`, `r` (rev), `m` (0 idle, 1 seria, 2 przerwa, 3 koniec), seria: `id`, `bk`, `ti`, `ct`, `ld`, `gr`, `tm`; przerwa: `rs` (sekundy do końca — zegarek liczy od odebrania, bez porównywania zegarów), `cu` (zapowiedź); na wypadek braku łączności: `af` (następna seria), `rt` (przerwa po odhaczeniu), `nc` (zapowiedź po odhaczeniu); `lb` (etykiety w języku aplikacji — po powitaniu).
- Zegarek → telefon, zdarzenie: `k`=`e`, `v`, `t` (`d` zrobione, `x` inaczej, `s` pomiń, `u` cofnij, `r` koniec przerwy, `h` powitanie), `e` (eventId), `b` (baseRev), `id` (seria; puste = „następna otwarta” — odhaczenie na ślepo), `bk`, `a` (sekundy epoki), `c` (klient).
- Idempotencja: powtórzone `eventId` pomija telefon; zdarzenie dla serii, której nie ma, pomija telefon i odsyła migawkę (reguły 2–3 specyfikacji) — **po stronie telefonu, w pakiecie protokołu**.

## 5. Licencja SDK — ustalenia i pytania (13.10.2026)
Przeczytana umowa „Connect IQ SDK License Agreement” (https://developer.garmin.com/connect-iq/sdk/, wersja z 06.10.2026). Cytaty: „…a limited, non-exclusive, personal, revocable, non-assignable, non-sublicensable and non-transferable license to use the Program Materials for the sole purpose of developing and testing Applications.” oraz „You agree not to rent, lease, lend, upload to or host on any website or server, sell, redistribute, or sublicense the Program Materials, in whole or in part…”.

| Pytanie | Co wiem | Decyzja / pytanie |
|---|---|---|
| Czy wolno pobierać SDK w CI (GitHub Actions) i uruchamiać symulator? | Licencja jest „osobista”, tylko do rozwoju i testów; zakaz „upload to or host on any website or server”. Pobieranie SDK Managera wymaga „Accept & Download” (przyjęcie umowy). Czy maszyna CI pobierająca SDK z serwera producenta to „hosting” i czy automat może przyjąć umowę — **umowa tego nie rozstrzyga**. Sam SDK Manager jest programem graficznym; logowanie kontem producenta przy pobieraniu urządzeń — **niesprawdzone**. | **Nie dodano do CI.** Pytanie do badacza (czytanie umowy + wątki forum producenta o CI) i do właściciela (przyjęcie umowy w imieniu projektu). Szkic workflow: `latki-zegarek/garmin-ci-SZKIC.yml` (nie wklejać). |
| Czy wolno dołączyć binarny framework Mobile SDK do aplikacji iOS i rozpowszechniać ją w App Store? | „Companion SDK” istnieje właśnie po to („to enable the development of Applications for third-party platforms”); „Application” to program zbudowany z użyciem składników SDK. Repozytorium SDK **nie zawiera** pliku LICENSE (jest tylko odesłanie do strony); umowa nie mówi wprost o redystrybucji frameworku w aplikacji. | Do badacza. Praktyka producentów aplikacji towarzyszących wskazuje, że to zamierzone użycie, ale **to nie źródło**. Do czasu odpowiedzi framework NIE leży w repozytorium (pobierany przez `pod install` z repozytorium producenta w tagu 1.8.0). |
| Czy nazwa producenta/sprzętu może być w aplikacji? | Umowa: zakaz oświadczeń o powiązaniu/poparciu przez producenta. CLAUDE.md i wytyczne Apple 2.3.7/5.2.1: bez cudzych marek w tekstach. | Aplikacja używa opisów neutralnych („zegarek sportowy”, „aplikacja pomocnicza zegarka”). Nazwa nieunikniona tylko: (a) w sklepie Connect IQ (to sklep producenta), (b) w App Store jako strona aplikacji pomocniczej — otwiera ją SDK (`showCompanionStore`), **bez nazwy w naszym tekście**. Pytanie P9 zamknięte w wariancie A, o ile ekran parowania (pakiet protokołu) nie nazywa aplikacji. |
| Prywatność SDK | Binarka frameworku: brak odwołań do sieci (poza adresem strony sklepu aplikacji pomocniczej), brak `PrivacyInfo.xcprivacy`. To analiza napisów w binarce, **nie dowód**. | „Data Not Collected” — do potwierdzenia przez audytora (SDK nie jest na liście SDK wymagających manifestu — niesprawdzone). Dla audytu: użycie tylko Bluetooth, zero sieci w naszym kodzie (`tests/ciq-native.test.ts`). |
| Czy aplikacja Connect IQ może być darmowa bez opłat? | Spec: opłata roczna i prowizja dotyczą tylko sprzedaży (Merchant Service). | Do badacza; **0 zł zakładane, niepotwierdzone**. Wgrywanie przez USB nie wymaga konta sklepu. |

Dodatkowe uwagi z licencji: nie umieszczamy kluczy ani SDK w repo; klucz deweloperski Connect IQ jest sekretem (`garmin/.gitignore`, `.gitignore`, test `tests/ciq-sources.test.ts`).

## 6. Co sprawdzono lokalnie, a czego nie
- **Zrobione w Jest (Linux):** protokół i walidacja (`ciq-wire`), model zegarka i jego scenariusze (`ciq-model`), zawijanie (`ciq-wrap`), generowanie plików zegarka z jednego źródła (`ciq-gen`), statyczna kontrola kodu Monkey C — stałe, zasoby, nawiasy, zgodność metod z modelem (`ciq-sources`), łącze z atrapą modułu (`ciq-link`), powrót z parowania (`ciq-url`), konfiguracja natywna i zgody w 35 językach (`ciq-native`), `verify:native` (prebuild: Info.plist, Podfile, linkowanie modułu).
- **Składnia Monkey C** sprawdzona parserem z pakietu `@markw65/prettier-plugin-monkeyc` (poza repo; wszystkie pliki `.mc` parsują się). To **nie jest kompilacja**: typy, nazwy API i zasoby sprawdzi dopiero `monkeyc` u właściciela.
- **Nie zrobione (brak SDK, licencja):** kompilacja `monkeyc` dla fēnix 8, testy Run No Evil, symulator, zrzuty ekranu zegarka. Identyfikatory modeli w manifeście (`fenix847mm` potwierdzony w wątkach forum producenta; `fenix843mm`, `fenix851mm`, `fenix8solar47mm`, `fenix8solar51mm`, `fenix8pro47mm` — z pamięci) — przy błędzie „unknown product” usuń pozycję (krok w instrukcji właściciela).
- **Nie zrobione (brak macOS):** kompilacja Swift modułu, `pod install` z podspec producenta (nazwy metod SDK po imporcie do Swift wywnioskowane z nagłówków), prośba o zgodę Bluetooth na urządzeniu, obudzenie aplikacji w tle. Pierwszy przebieg `ios-unsigned.yml` to pierwsza weryfikacja — spodziewana iteracja.

## 7. Ryzyka do sprawdzenia na urządzeniu (E2E właściciela)
1. Czy START/BACK/GÓRA przytrzymany zachowują się jak w tabeli (rozdz. 2) i czy BACK nie wyrzuca z aplikacji w trakcie okna „Cofnij”.
2. Czy zegarek, który zostaje w pozycji „wyjście do tarczy”, po powrocie prosi o migawkę (powitanie) i pokazuje bieżący stan.
3. Opóźnienie od START do głosu w słuchawkach (cel < 2 s) — wymaga trybu tła i obudzenia aplikacji; **tryb audio w tle należy do pakietu głosu**.
4. Czcionki fēnix 8 dla języków spoza łaciny (rosyjski, grecki, japoński, koreański, chiński, wietnamski): brakujące znaki pokażą się jako puste/kratki — język etykiet dostaje się z telefonu, ale nazwa ćwiczenia jest zawsze w języku aplikacji.
5. Zapis „Siła”: czy po zakończeniu treningu w Garmin Connect jest **jedna** aktywność z okrążeniami, a w Apple Zdrowiu **jeden** trening (reguła łączenia z 11.10.2026).
6. Zgoda Bluetooth przy pierwszym parowaniu (nie przy starcie aplikacji) i powrót z aplikacji pomocniczej bez ekranu „nie znaleziono”.
7. Review Apple: `UIBackgroundModes = bluetooth-central` wymaga uzasadnienia w notatkach dla recenzenta („odbieranie potwierdzeń serii z zegarka, gdy telefon jest zablokowany”).

## 8. Pytania do właściciela (opcje i rekomendacja)
1. **CI dla Monkey C** — A) bez CI, testy u właściciela + Jest pilnuje protokołu i statyki (stan obecny); B) CI z pobieraniem SDK po opinii badacza o licencji. Rekomendacja: **A teraz, B po odpowiedzi** — A nie ma ryzyka licencyjnego i protokół jest i tak sprawdzany w Jest przy każdym wypchnięciu.
2. **Numer wersji aplikacji na zegarku** — A) osobny `0.1.0` (obecnie, `CIQ_WATCH_APP_VERSION`); B) taki sam jak aplikacja telefonu (0.20.0) przy wydaniu. Rekomendacja: **B przy wydaniu** (jedna liczba w komunikacie „Zaktualizuj aplikację na zegarku”); zmiana to jedna stała i regeneracja (`UPDATE_CIQ=1`).
3. **Modele** — A) rodzina fēnix 8 (obecnie, 6 identyfikatorów); B) wszystkie z API ≥ 5 z komunikacją i wibracją (P8-A specyfikacji) po sprawdzeniu identyfikatorów w SDK Managerze. Rekomendacja: **A na czas testów, B po pierwszej udanej rundzie**.
4. **Tryb tła Bluetooth** (ryzyko Apple, rozdz. 7 pkt 7) — A) zostaje (potrzebne, by zablokowany telefon mówił); B) wyłączony: zegarek działa, ale telefon w kieszeni milczy do odblokowania. Rekomendacja: **A** z opisem dla recenzenta.
5. **Okno „Cofnij” = 5 s** (stała `CIQ_UNDO_WINDOW_SEC`, specyfikacja: „kilka sekund, np. 5 s” — otwarte do potwierdzenia na zegarku) — zostawić czy zmienić po teście? Rekomendacja: zostawić do pierwszej rundy.
6. **Słowo „Garmin” w sklepie Connect IQ** (opis aplikacji) — niezbędne do wyszukania aplikacji; decyzja przy publikacji w sklepie (nie dotyczy USB).

## 9. Dopasowanie do protokołu (`f020-protokol`)
Gałąź `origin/f020-protokol` w chwili pisania nie była wypchnięta (`git fetch` → „couldn't find remote ref”); zgodność oparto na roboczych plikach agenta protokołu (`lib/watch/protocol.ts`, `snapshot.ts`, `apply.ts`, stan z 13.10.2026) odczytanych bez ich zmieniania. Cienka warstwa `ciqAdapter.ts` tłumaczy oba kierunki; wąska ramka Connect IQ jest świadomie skromniejsza niż wspólny protokół (mała ramka Bluetooth, zegarek nie składa tekstów i nie zna `workoutId`). Po wypchnięciu `f020-protokol`: `git fetch origin f020-protokol`, scalić (spodziewane konflikty tylko w `lib/i18n.en.ts`, `lib/locales/*.json`, `locales/*.json` — dopisane są niezależne klucze), podłączyć adapter i dopisać testy zgodności na plikach „złotych” protokołu.
