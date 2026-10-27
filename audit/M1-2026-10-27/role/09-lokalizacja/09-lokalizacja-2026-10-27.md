# Audyt: Lokalizacja — Trening (iOS) — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 (HEAD odłączony, sprawdzony na starcie) · Tryb: audit (wariant GŁĘBOKI, M1) · Środowisko: Linux x86_64, Node v22.22.0, ICU 77.1 / CLDR 47; TypeScript i Playwright z projektu, Chromium w `/opt/pw-browsers`; Expo web (eksport w kopii roboczej w scratchpadzie) działa; brak macOS/Xcode/symulatora/telefonu — zachowanie na iOS (Hermes, Dynamic Type, StoreKit) nie uruchomione.

## Podsumowanie

Mechanizm i18n jest dojrzały: 35 języków spójnych w `LANGS`, `CFBundleLocalizations`, `locales` (nazwa pod ikoną, opisy zgód Zdrowia), słownikach aplikacji, widżetu i zegarka; kontrola mechaniczna 1710 kluczy × 34 słowniki dała 0 braków, 0 sierot, 0 rozjazdów parametrów i liczby form; skan kodu składnią TypeScript — 0 kluczy bez wpisu, brak tekstów na sztywno w głównym przepływie; pseudolokalizacja na zrzutach nie ujawniła tekstu omijającego słownik. Najważniejsze ryzyko to nie kod, tylko proces: treść krytyczna (zdanie medyczne, asekuracja, 306 zdań wskazówek techniki) w 33 językach nie ma zamkniętego przeglądu po ostatnich zmianach — R-010 jest otwarte i według CLAUDE.md blokuje wydanie w App Store. Drugie ryzyko to obserwacja z telefonu: ceny planów na ekranie zakupu w USD przy arkuszu Apple w PLN (T-11) — kod bierze cenę wyłącznie z App Store, przyczyna [DO USTALENIA] po stronie StoreKit/biblioteki. Do decyzji właściciela: sposób zamknięcia R-010 przed zgłoszeniem oraz czy jednostki masy mają być pisane lokalnym pismem.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 09-lokalizacja-001 | P1 | P | Treść krytyczna w 33 językach bez zamkniętego przeglądu po ostatnich zmianach (R-010 otwarte) | otwarte |
| 09-lokalizacja-002 | P1 | D | Ekran zakupu pokazuje ceny w USD, a arkusz Apple pobiera PLN (T-11) | otwarte |
| 09-lokalizacja-003 | P1 | D | Panel startu po ukraińsku i słoweńsku pokazuje złą formę liczby ćwiczeń („4 вправ”, „4 vaj”) | otwarte |
| 09-lokalizacja-004 | P1 | D | Przy największym tekście ekran Trening ucina ikony, w tym ikonę startu kolejnego treningu (T-04) | otwarte |
| 09-lokalizacja-005 | P2 | D | Masa zawsze „kg”/„lb” łacinką, a dystans i czas w piśmie języka („5 км”, „80 kg”) | otwarte |
| 09-lokalizacja-006 | P2 | D | Ukraiński miesza formę „ти” z zapisaną formą grzecznościową na ekranach | otwarte |
| 09-lokalizacja-007 | P2 | D | Walidator `check:i18n` widzi tylko `t('…')` w apostrofach i jeden słownik; test „polskich liter” zamiast kontroli pisma | otwarte |
| 09-lokalizacja-008 | P2 | D | Etykieta „PR:” w szczegółach treningu wpisana na sztywno | otwarte |

## Linia bazowa i założenia

Linię bazową zbudowałem przed czytaniem `docs/lokalizacja/jezyki.md`, z kodu i z dowodów zewnętrznych. Soczewki przeszedłem sam, po kolei (polecenie M1: bez subagentów).

**Rynki i języki.** Rynek główny: Polska (polecenie M1), potem szeroko; polityka „szeroka” (D-026) — 35 lokalizacji ze wzorców bez dowodu rynku, w zamian kontrole (a)–(e). Konkurencja w sklepie PL odczytana dziś (dowody/konkurencja-jezyki.txt, `itunes.apple.com/lookup`, 27.10.2026): dwie popularne aplikacje dziennika treningu mają 16 i 11 kodów języków; obie mają chiński uproszczony, jedna arabski i hindi. Trening ma 35 języków, w tym wszystkie języki obu wzorców poza zh-Hans, ar, hi, ca. Brak zh-Hans wynika z decyzji (komentarz `lib/i18n.ts`, fala 4: „chiński uproszczony odłożony”), ar/hi poza listą 35 wzorców — przy „szerokiej” to nie jest „brak”. Wynik: zestaw zgodny z polityką; kontrola (c) — opis w sklepie dla języków ASC — w rejestrze (`docs/lokalizacja/jezyki.md`), sprawdza rola 10; (d) zrzuty w najdłuższym języku — wykonane tu w Expo web (fr = najdłuższy, dowody/dlugosc-jezykow.txt); (e) przekład partiami — zapisany (`docs/lokalizacja/zestaw-przekladu-*.json`, puste listy oczekujących); (a) treść krytyczna — patrz 09-lokalizacja-001; (b) klasyfikacje lokalne — nazwy sprzętu zostają angielskie w 33 językach (DEC-13), co jest opisem ogólnym zgodnym z (b).

**Miejsca tekstu.** Ekrany, alerty, błędy: przez `t()` (skan: dowody/kod.txt, 18 trafień „na sztywno” — wszystkie poza jednym to panel testowy E2E, kody kolorów, notatka techniczna w pliku awaryjnym albo symbol jednostki; wyjątek: 09-lokalizacja-008). Powiadomienia: tekst powstaje przy planowaniu, ale klucz synchronizacji zawiera `lang()` (`lib/planReminder.ts:51`), a zmiana języka w aplikacji przelicza powiadomienia i Live Activity (`app/more/language.tsx:14`). Widżet i zegarek: 35 katalogów `.lproj` w każdym celu, generowane testami. Nazwa pod ikoną i zgody Zdrowia: `locales` 35 plików (`app.json:130`). Eksport CSV: nagłówki stałe (zgodność formatu) — nie oceniam jako błąd. Ekran awaryjny: tekst przez `t()` od startu modułu (`lib/i18n.ts:150`).

**Gramatyka.** Liczba mnoga: ręczne reguły `lib/plural.ts` (wzorzec „czego nie przywracać”), ale rozstrzygnięte decyzją M1-042 ze strażnikiem; moja sonda: 0 rozbieżności z `Intl.PluralRules` dla liczb całkowitych 0–1000 w 35 językach (pt 0 → other jest poprawne dla pt-PT), rozbieżności tylko dla ułamków (dowody/liczba-mnoga.txt) — aplikacja nie wywołuje `tp()` z ułamkiem (wszystkie 36 wywołań to liczniki całkowite). Sklejanie: 36 miejsc łączy całe zdania albo elementy listy separatorem „ · ” — akceptowalne; jedyna realna usterka gramatyczna z próbki: 09-lokalizacja-003.

**Formaty.** Liczby i daty przez `toLocaleString(locale())` (`lib/units.ts:75`, `lib/state/time.ts:42`); serbski wymuszony na cyrylicę; pierwszy dzień tygodnia w kalendarzu z regionu telefonu (`lib/calendar.ts:16`, M1-065), w statystykach od poniedziałku (decyzja); system miar z `measurementSystem` telefonu (DEC-29). Usterka: 09-lokalizacja-005.

**Układ.** Najdłuższy język fr (+16% znaków względem PL), dla krótkich tekstów lt/el/fr (+22–24%). Zrzuty 320 pt: pl, fr, uk, pseudo — patrz Pokrycie. Kroje: Barlow Condensed z jawnym przełączeniem na krój systemowy dla greki, cyrylicy i CJK (`lib/theme.ts:119`), pilnowane testami. RTL: brak języka RTL w zestawie — nie dotyczy.

**Dostępność.** Etykiety VoiceOver przez `t()`, `accessibilityLanguage` szeroko używany, nazwy ćwiczeń z biblioteki czytane głosem angielskim (M1-038).

**Mechanizm.** `resolveLang` (`lib/i18n.ts:47`): obsługiwany język → ten, inny → angielski; łańcuch: słownik języka → angielski → polski (`lib/i18n.ts:99`), nigdy surowy klucz (kluczem jest tekst PL). Wybór per aplikacja: `CFBundleLocalizations` (`app.json:24`) plus własny wybór w aplikacji; rozjazd zgód Zdrowia i nazwy pod ikoną rozstrzygnięty DEC-18 (wiersz ze skrótem do ustawień iOS, `app/more/language.tsx:21`). Dane jako kody: wartości domenowe zapisane po polsku, tłumaczone przy wyświetlaniu.

**Proces.** Kontekst dla tłumacza: `docs/lokalizacja/konteksty.json`; glosariusz: `docs/lokalizacja/slownik-terminow.json` ze strażnikiem; oznaczenie tłumaczenia maszynowego: kolumna „tłumaczenie: agent AI” w rejestrze; drugi przegląd AI: przegląd przez API 22.10.2026; przegląd człowieka: zastąpiony decyzją właściciela (K-P4-2, 20.10.2026 i 21.10.2026) przeglądem Claude.

**Treści i audio.** Nazwy ćwiczeń z biblioteki po angielsku poza PL (DEC-13); wskazówki techniki w 35 językach (`lib/cues/text`); zapowiedzi głosowe w języku aplikacji z komunikatem o braku głosu.

**Soczewki.** (1) Użytkownik drugiego rynku bez znajomości polskiego — teksty kompletne, zastępczy angielski, nie polski (0 braków); ryzyko w treści krytycznej (001). (2) Telefon po angielsku w Polsce — daty z regionu telefonu przy zgodnym języku (`lib/i18n.ts:90`), jednostki z `measurementSystem`; bez usterek. (3) Tłumacz bez ekranu — klucze skrótowe („{n} ćw.”) bez opisu, że skrót ma ominąć odmianę, dały 003. (4) VoiceOver w drugim języku — etykiety w słownikach, w pseudolokalizacji tylko symbole „kg”, „RPE” bez nawiasów (dowody/zrzuty-raport.json.txt).

**Wzorzec najlepszych.** Fakty platformy ze wzorców roli (odczyt 18.10.2026) nie wymagały ponownego odczytu dla SDK projektu poza RTL (nie dotyczy). Wniosek dla aplikacji: zakres języków szerszy niż u obu wzorców; braki jakości są w procesie przeglądu, nie w mechanizmie.

**Rejestr założeń.** `docs/zalozenia.md` nie istnieje w repo — brak propozycji zmian statusu.

## Pokrycie (co sprawdzono, czego nie)

| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| Słowniki `lib/locales/*.json` (33 + 2 nakładki), `lib/i18n.en.ts` przez `_source.json` | tak, całość | dowody/slowniki.txt (braki, sieroty, parametry, formy, liczby, pismo, tekst jak EN) |
| Kod `app/`, `components/`, `lib/` (214 plików) | tak, skan AST | dowody/kod.txt |
| Liczba mnoga `lib/plural.ts` vs CLDR | tak | dowody/liczba-mnoga.txt |
| `app.json` (lokalizacje, `locales`, plugin), `locales/*.json` | tak | odczyt; test `tests/i18n-locales.test.ts` |
| Widżet i zegarek `targets/*/*.lproj` | tak (obecność 35 + przykład uk) | odczyt |
| Powiadomienia, Live Activity, zmiana języka | tak (kod) | `lib/planReminder.ts:51`, `app/more/language.tsx:14` |
| Formaty liczb, dat, jednostek | tak (kod, grep) | 09-lokalizacja-005 |
| Jakość języka: ekrany zakup, limit, Trening, ustawienia; de, cs, uk, nb, hr (nb, hr wylosowane) + pl/en | tak, próbka 275 kluczy × 7 języków, drugi przegląd AI w tym samym kontekście (nie świeży) | dowody/probka-jakosci.txt |
| Zrzuty 320 pt w pl, fr (najdłuższy), uk, pseudo (podmieniony `de.json`) + en 375 pt; ekrany Trening, zakup, limit, ustawienia, Więcej | tak, Expo web | zrzuty/ (21 PNG), dowody/zrzuty-raport.json.txt |
| Największy tekst (Dynamic Type), Hermes, StoreKit, VoiceOver na urządzeniu | nie — brak iOS | kroki w „Do sprawdzenia” |
| Treść wskazówek techniki w 33 językach (sens) | nie — tylko stan przeglądu z rejestru | 09-lokalizacja-001; sens przekładu to TRE-08 (rola 06) |
| Opis w sklepie, kody ASC | nie — rola 10 | — |
| Dysk Google (rejestr decyzji) | nie sprawdzono — niedostępny w sesji | — |

## Kontrola dowodów i sekretów

Wynik `node audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 09-lokalizacja`: dowody/sprawdz-raport.txt (kod wyjścia 0 przy oddaniu). `git status --porcelain` w `/home/user/trening` przed i po pracy: pusty (pliki śledzone nietknięte; katalog `audit/` jest w `.git/info/exclude`). Kopia robocza do zrzutów: `git worktree` w scratchpadzie, usunięta po pracy. W raporcie i dowodach brak e-maili, UDID, sekretów i nazw innych aplikacji (konkurencja opisana jako „aplikacja A/B”).

## Stosowalność listy kontrolnej

| Pozycja | Status (dotyczy / nie dotyczy + powód / decyzja D-xx) | Wynik (ok / znalezisko ID / nie sprawdzono + powód) |
|---|---|---|
| LOK-01 | dotyczy (polityka „szeroka”, D-026) | ok — 35 języków = rejestr = `LANGS`; kontrole (a)–(e): (a) patrz 09-lokalizacja-001 |
| LOK-02 | dotyczy; rozjazd wyboru w aplikacji i zgód iOS — decyzja DEC-18 | ok — `app.json:24`, `app.json:61`, `app.json:130`; RTL nie dotyczy (brak języka RTL) |
| LOK-03 | dotyczy | 09-lokalizacja-008 (P2); poza tym ok (dowody/kod.txt, pseudo na zrzutach) |
| LOK-04 | dotyczy | ok — 0 braków, 0 sierot, 0 kluczy z kodu bez wpisu; klucze dynamiczne (65) mają strażnika R39-02 |
| LOK-05 | dotyczy; ręczne reguły — decyzja M1-042 | 09-lokalizacja-003 (P1); reguły zgodne z CLDR dla liczb całkowitych |
| LOK-06 | dotyczy | ok — parametry 0 rozjazdów; liczby: rozjazdy tylko z zapisu słownego („jedno powtórzenie”) albo klasyfikatorów ja/ko |
| LOK-07 | dotyczy; ceny → MON-10 (rola 02, zgłoszone tu z ID) | 09-lokalizacja-002 (P1, MON-10), 09-lokalizacja-005 (P2) |
| LOK-08 | dotyczy; skalowanie w języku źródłowym → SP-07 (rola 04, zgłoszone tu z ID) | 09-lokalizacja-004 (P1, SP-07, obserwacja z telefonu); 320 pt w fr/uk/pl: ok na web |
| LOK-09 | dotyczy | ok — `lib/i18n.ts:47`, `lib/i18n.ts:99`; dane jako kody |
| LOK-10 | dotyczy; przegląd człowieka zastąpiony decyzją (K-P4-2, 20/21.10.2026) przeglądem Claude | 09-lokalizacja-001 (P1) |
| LOK-11 | dotyczy | 09-lokalizacja-006 (P2); reszta próbki — „Do sprawdzenia” |
| LOK-12 | dotyczy | ok — etykiety przez `t()`; na urządzeniu nie sprawdzono (brak iOS) |
| LOK-13 | dotyczy | ok — powiadomienia, Live Activity, widżet, zegarek w języku użytkownika |
| LOK-14 | dotyczy | ok w kodzie (`lib/theme.ts:119`); glify na urządzeniu nie sprawdzone |
| LOK-15 | dotyczy | 09-lokalizacja-007 (P2); automatyczna kontrola słowników jest (testy Jest w verify) |

## Znaleziska (szczegóły)

### 09-lokalizacja-001 · Treść krytyczna w 33 językach bez zamkniętego przeglądu po ostatnich zmianach (R-010 otwarte)
- Pozycja listy kontrolnej: LOK-10
- Poziom: P1 (blokuje wydanie w App Store przez otwarte ryzyko R-010, CLAUDE.md „Rejestr ryzyk z blokadą”; nie blokuje TestFlight)
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: `docs/40-lekcje.md:22` — R-010 „blokuje wydanie w App Store, nie blokuje TestFlight”, status „otwarte”; `docs/48-zgloszenie-1-0.md:306` — przegląd z 22.10 „trzeba go powtórzyć po przekładzie”; `docs/16-jezyki-i-marka.md:272` — piąty klucz asekuracji to „własne tłumaczenie agenta w 31 słownikach”, do przeglądu tłumacza; tabela tamże: kolumna „drugi przegląd wskazówek” = „niewykonany” w każdym języku; commit f781b5e6 (26.10) zmienił 4 zdania wskazówek w 32 plikach po przeglądzie API. Kontroli (a) polityki „szerokiej” (przekład zwrotny na polski w świeżej sesji) nie znalazłem w repo (`grep -i "przekład zwrotny"` w docs/tests/scripts: 0 trafień).
- Wzorzec lub źródło: zasada roli 3 („Przekład twierdzenia to nowe twierdzenie”); decyzja właściciela 21.10.2026 (docs/18): R-010 zamyka przegląd Claude z listą sprawdzonych zdań.
- Kroki w aplikacji: telefon w np. czeskim → ćwiczenie → Technika: wskazówki i zdanie o asekuracji w przekładzie bez zapisanego przeglądu po ostatniej zmianie.
- Opcje: (A) Z-02 teraz: przegląd Claude w świeżym kontekście 4 zmienionych zdań + 5. klucza asekuracji + zdania medycznego we wszystkich 33 językach, z listą zdań i wpisem w docs/16 i docs/40 — ok. 1–2 h agenta, bez kosztu API poza przeglądem; (B) pełny powtórny przegląd 399 zdań przez API — pewniejszy, koszt kredytów i ok. 1 h czekania na batch; (C) decyzja właściciela, że 1.0 idzie w części języków bez przeglądu (wariant R-010 pkt 1) — szybciej, ryzyko błędnej wskazówki bezpieczeństwa. Rekomendacja: A, a B tylko gdy A znajdzie zmianę sensu w więcej niż jednym zdaniu.
- Test akceptacyjny: wpis w docs/16 „drugi przegląd” z datą i SHA dla każdego języka; R-010 „zamknięte” w docs/40; test, który porównuje skrót tekstu krytycznego z ostatnim przeglądem i czerwieni się po zmianie bez przeglądu.
- Status: otwarte

### 09-lokalizacja-002 · Ekran zakupu pokazuje ceny w USD, a arkusz Apple pobiera PLN (T-11)
- Pozycja listy kontrolnej: LOK-07 (ceny → MON-10, rola 02)
- Poziom: P1 (użytkownik w PL widzi inną kwotę i walutę niż płaci — myli w przepływie zakupu; ryzyko wytycznej 3.1.2 o jasnej cenie)
- Realność: realny · Pewność: wysoka co do objawu (obserwacja właściciela, build 1031, konto testerki w PL, wszystkie 3 plany); przyczyna [DO USTALENIA]
- Rodzaj: D
- Dowód: kod bierze cenę tylko ze sklepu — `lib/store-native.ts:54` („typeof x.displayPrice !== 'string'”); widoczne kwoty 0.99 / 6.99 / 14.99 są identyczne z cenami testowymi `lib/store-fake.ts:12` („monthly: '$0.99', yearly: '$6.99', lifetime: '$14.99'”) i z plikiem `store/Trening.storekit`, ale build TestFlight odrzuca sztuczny sklep (`.github/workflows/testflight.yml:102`), a arkusz zakupu działał natywnie — więc kwoty przyszły z `displayPrice` StoreKit/biblioteki (expo-iap 5.8.1, OpenIAP apple 3.6.0) w innej walucie niż arkusz. Kodu natywnego biblioteki 3.6.0 nie było w `node_modules` — nie sprawdzono.
- Wzorzec lub źródło: zasada roli 6 („ceny tylko ze sklepu (MON-10)”); obserwacja T-11 z polecenia M1.
- Kroki w aplikacji: konto Apple w PL, TestFlight → Ustawienia → Subskrypcja → lista planów: „$0.99/miesiąc”; „Subskrybuj” → arkusz Apple: „4,99 zł”.
- Opcje: (A) rola 02 ustala przyczynę na urządzeniu (zalogować `displayPrice`, `currencyCode`, `Storefront.current` w buildzie testowym) i naprawia u źródła — pewne, wymaga buildu; (B) dodatkowo strażnik w aplikacji: gdy waluta produktu ≠ waluta storefrontu, nie pokazywać kwoty, tylko „Cena w arkuszu Apple” — chroni przed powtórką, ale ukrywa cenę. Rekomendacja: A; B tylko jeśli przyczyna leży w sandboxie TestFlight i nie dotyczy produkcji, z zapisem w rejestrze ryzyk.
- Test akceptacyjny: na telefonie z kontem PL lista planów pokazuje te same kwoty i walutę co arkusz Apple (krok właściciela po buildzie); test jednostkowy adaptera z produktem w PLN.
- Status: otwarte

### 09-lokalizacja-003 · Panel startu po ukraińsku i słoweńsku pokazuje złą formę liczby ćwiczeń („4 вправ”, „4 vaj”)
- Pozycja listy kontrolnej: LOK-05
- Poziom: P1 (zła forma w głównym przepływie — próg z listy kontrolnej)
- Realność: realny (szablon z 1–4 ćwiczeniami) · Pewność: wysoka
- Rodzaj: D
- Dowód: `components/StartPanel.tsx:27` — „sub: t('dziś w planie · {n} ćw.', { n: m.tpl.items.length })”; źródło używa skrótu „ćw.”, żeby ominąć odmianę, a przekład rozwinął go do dopełniacza liczby mnogiej: `lib/locales/uk.json:321` „сьогодні в плані · {n} вправ” (poprawnie: 1 вправа, 2–4 вправи), `lib/locales/sl.json:321` „danes v načrtu · {n} vaj” (1 vaja, 2 vaji, 3–4 vaje); to samo w kluczach `lib/locales/uk.json:659`, `lib/locales/uk.json:1336`, `lib/locales/sl.json:659`, `lib/locales/sl.json:1336`. Pozostałe 31 języków zachowały skrót (sonda: dowody/probka-jakosci.txt i zapytanie w scratchpadzie; uk sam klucz „ćw.” = „впр.”).
- Wzorzec lub źródło: zasada roli 5 (liczba mnoga w mechanizmie); CLDR uk/sl (wiersze „Ukrainian”, „Slovenian”: one/few/many, one/two/few/other).
- Kroki w aplikacji: język ukraiński → zakładka Trening bez treningu w toku, plan z szablonem 2–4 ćwiczeń → podpis przycisku startu „… · 3 вправ”.
- Opcje: (A) w uk i sl przywrócić skrót („впр.”, „vaj.”) — jedna zmiana słownika; (B) przebudować klucz na `tp()` z formami — poprawne we wszystkich językach, więcej kluczy do przekładu. Rekomendacja: A teraz, B przy następnej partii tłumaczeń; plus opis w `konteksty.json`, że skrót ma ominąć odmianę.
- Test akceptacyjny: test, który dla każdego klucza ze skrótem po `{n}` w źródle sprawdza, że przekład w językach z formą few/many też ma skrót albo jest kluczem liczebnikowym; render panelu w uk z n = 3.
- Status: otwarte

### 09-lokalizacja-004 · Przy największym tekście ekran Trening ucina ikony, w tym ikonę startu kolejnego treningu (T-04)
- Pozycja listy kontrolnej: SP-07 (rola 04; LOK-08 odsyła skalowanie w języku źródłowym do SP-07)
- Poziom: P1 (ucięta akcja w głównym przepływie przy ustawieniu dostępności)
- Realność: realny (ustawienie „Większe rozmiary dostępności”) · Pewność: wysoka co do objawu (obserwacja właściciela, build 1031); przyczyna w układzie [DO USTALENIA]
- Rodzaj: D
- Dowód: obserwacja T-04 z polecenia M1 (pogrubiony tekst bez problemu). Na web nie da się odtworzyć Dynamic Type; zrzuty 320 pt w pl, fr, uk bez ucięć (dowody/zrzuty-raport.json.txt), więc problem dotyczy skali tekstu, nie długości przekładu.
- Wzorzec lub źródło: zasada roli 7 (najpierw układ, zgłoszenie do 04).
- Kroki w aplikacji: Ustawienia iOS → Dostępność → Większy tekst → największy → zakładka Trening.
- Opcje: (A) rola 04: ikony w kontenerach o stałej wielkości poza skalą tekstu albo przejście na układ pionowy przy dużej skali; (B) obniżyć `maxFontSizeMultiplier` na tym ekranie — szybkie, gorsze dla dostępności. Rekomendacja: A.
- Test akceptacyjny: scenariusz Maestro z największym rozmiarem tekstu i zrzut ekranu Trening bez uciętych ikon (krok właściciela albo E2E iOS).
- Status: otwarte

### 09-lokalizacja-005 · Masa zawsze „kg”/„lb” łacinką, a dystans i czas w piśmie języka („5 км”, „80 kg”)
- Pozycja listy kontrolnej: LOK-07
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `lib/units.ts:81` — `fmtW` dokleja symbol bez słownika („fmtNum(wOut(kg), unit === 'lb' ? 1 : 2)”, potem `${s} ${unit}`); dystans przez słownik: `lib/locales/ru.json:29` „"{n} km": "{n} км"”, tak samo uk, bg, sr (км), el (χλμ), zh-Hant (公里). Ten sam ekran treningu cardio i siłowego pokazuje dwa pisma jednostek. Decyzja M1-039 ustaliła „jeden zapis jednostki w całym języku” tylko dla masy.
- Wzorzec lub źródło: zasada roli 6; M1-039 (`tests/audit-m1-039-ru-units.test.ts`).
- Kroki w aplikacji: język rosyjski → trening z serią siłową i cardio z dystansem → „80 kg” obok „5 км”.
- Opcje: (A) symbol masy przez słownik (`t('{n} kg')`) — lokalne „кг”, „κιλά”/„kg” według glosariusza; zmienia M1-039; (B) zostawić łacinkę i zapisać w glosariuszu, że wszystkie symbole SI są łacinką (dystans też „km”) — spójne, mniej naturalne dla ru/uk/bg/sr. Rekomendacja: A dla cyrylicy i greki, ja/ko bez zmian (tam „kg” jest zwyczajowe) — do potwierdzenia przeglądem języka.
- Test akceptacyjny: test spójności: w każdym języku symbol masy i dystansu w tym samym piśmie.
- Status: otwarte

### 09-lokalizacja-006 · Ukraiński miesza formę „ти” z zapisaną formą grzecznościową na ekranach
- Pozycja listy kontrolnej: LOK-11
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: rejestr formy `docs/16-jezyki-i-marka.md:15` — uk „formalny jak w iOS (ekrany, komunikaty, zdanie medyczne i bezpieczeństwa)”; w słowniku forma „ти”: `lib/locales/uk.json:230` („вправи додаси під час тренування”), `lib/locales/uk.json:1381` („Введи кількість секунд від 0 до {n}.”), `lib/locales/uk.json:1398`, `lib/locales/uk.json:1404`; obok 57 tekstów w formie „ви” (sonda w scratchpadzie, heurystyka po czasownikach i zaimkach).
- Wzorzec lub źródło: rejestr formy w docs/16; zasada „teksty naturalne” (CLAUDE.md, 25.10.2026).
- Kroki w aplikacji: język ukraiński → Inny trening → „Pusty trening — вправи додаси…”; edycja przerwy z błędną wartością.
- Opcje: (A) ujednolicić 4 teksty do „ви” i dodać heurystyczny test formy dla uk (oraz fr/tr z R-010) — tanie; (B) przegląd formy we wszystkich słownikach z formą grzecznościową — pełniejsze, partia tłumaczeń. Rekomendacja: A teraz, B przy partii z 001.
- Test akceptacyjny: test formy dla uk bez trafień „ти” poza `lib/cues`.
- Status: otwarte

### 09-lokalizacja-007 · Walidator `check:i18n` widzi tylko `t('…')` w apostrofach i jeden słownik; test „polskich liter” zamiast kontroli pisma
- Pozycja listy kontrolnej: LOK-15
- Poziom: P2
- Realność: brzegowy (dziś 0 wywołań `t("…")`/`t(\`…\`)` i 0 braków — dowody/kod.txt) · Pewność: wysoka
- Rodzaj: D
- Dowód: `scripts/check-i18n.mjs:19` — wzorzec tylko z apostrofem („used.set(unq(m[1]), f)”), słownik tylko EN; `tests/i18n-locales.test.ts:44` — „const PL_ONLY = l === 'lt'” (test liter polskich w obcych słownikach). Oba wzorce są na liście „czego nie przywracać” tej roli. Kompletność pozostałych słowników pilnuje `tests/i18n-locales.test.ts` (z `_source.json`), więc luka dotyczy tylko kluczy w innym zapisie niż apostrof.
- Wzorzec lub źródło: wzorce roli, „Czego nie przywracać”.
- Kroki w aplikacji: brak dziś; przyszły tekst `t("…")` bez wpisu pokaże polski tekst w 34 językach, a verify przejdzie.
- Opcje: (A) skan AST (jak dowody/kod.mjs.txt) w `check:i18n` + kontrola pisma języka (cyrylica, greka, CJK) zamiast liter polskich; (B) zostawić i dopisać regułę lint zakazującą `t()` bez apostrofu — tańsze, wąskie. Rekomendacja: A.
- Test akceptacyjny: `check:i18n` czerwony dla `t("Nowy tekst")` bez wpisu i dla słownika ru z tekstem łacinką.
- Status: otwarte

### 09-lokalizacja-008 · Etykieta „PR:” w szczegółach treningu wpisana na sztywno
- Pozycja listy kontrolnej: LOK-03
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `app/history/[id].tsx:74` — „PR: {prs.get(s.id)!.map(k => t(k)).join(', ')}”; w słowniku istnieje klucz „Rekord: {list}” (fr „Record : {list}” z francuską spacją przed dwukropkiem, ja „記録: {list}”), którego ten wiersz nie używa.
- Wzorzec lub źródło: LOK-03.
- Kroki w aplikacji: Historia → trening z rekordem → przy serii „PR: …” zamiast przekładu.
- Opcje: (A) `t('Rekord: {list}', …)` — spójne z resztą; (B) `t('PR') + ': '` — zachowuje skrót, ale skleja. Rekomendacja: A.
- Test akceptacyjny: render szczegółów treningu w fr pokazuje „Record : …”.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- Próbka jakości (drugi przegląd AI w tym samym kontekście, nie świeży; dowody/probka-jakosci.txt): uk raz „Параметри iOS”, raz „налаштуваннях iOS” i „програма”/„застосунок” dla aplikacji; uk i hr etykieta przycisku w trybie rozkazującym („Перевірте дозвіл…”, „Provjerite dopuštenje…”) obok bezokolicznika („Відкрити Параметри iOS”); en „Buy forever” brzmi nienaturalnie. Pytanie do człowieka znającego język albo do recenzenta lokalizacji (rola recenzent-lokalizacji).
- Paywall po zakupie (T-11 część 2: wstęp „5 dni za darmo” i lista planów przy posiadanym planie, stan bez nazwy planu) oraz „Pełna wersja” w Ustawieniach jako stan, nie przycisk — obszar ról 02 i 04, nie lokalizacji.
- Hermes: `toLocaleString`/`toLocaleDateString` z tagiem języka i `Intl.Collator` — w Jest działają (ICU Node), na urządzeniu nie sprawdzono. Krok: zrzut ekranu Historia i Postępy po rosyjsku i japońsku na telefonie.
- Glify: Barlow Condensed + przełączenie na krój systemowy — sprawdzone testami, nie na urządzeniu. Krok: zrzut nagłówka ćwiczenia po grecku, wietnamsku i koreańsku.
- VoiceOver w drugim języku (uk, de): język wymowy etykiet — krok właściciela z listy „tylko telefon”.
- Język systemu spoza listy (np. arabski) → angielski: z kodu (`lib/i18n.ts:47`), zrzutem nie potwierdzone (przeglądarka w sondzie miała en-US).

## Co działa dobrze i należy zachować

- Jedno źródło języków (`LANGS`) spięte testami z `app.json`, `locales/`, rejestrem, `.lproj` widżetu i zegarka, nazwami w sklepie.
- Klucz = polski tekst i łańcuch słownik → EN → PL: brak surowych kluczy i pustych tekstów w żadnym języku.
- Klucz synchronizacji powiadomień zawiera język; zmiana języka przelicza powiadomienia i Live Activity.
- Jawne przełączenie kroju dla greki, cyrylicy i CJK zamiast liczenia na zastępstwo systemu.
- Wielkie litery zależne od języka (`upper()` dla el, tr) i `accessibilityLanguage` dla nazw ćwiczeń.
- Pseudolokalizacja w buildzie deweloperskim i wynik zrzutów: brak tekstu omijającego słownik na ekranach Trening, zakup, limit, ustawienia, Więcej.

## Decyzje dla właściciela

1. **Zamknięcie R-010 przed zgłoszeniem 1.0 (09-lokalizacja-001).** A: przegląd Claude tylko zmienionych zdań krytycznych w 33 językach (ok. 1–2 h agenta); B: pełny powtórny przegląd 399 zdań przez API (koszt kredytów, ok. 1 h czekania); C: wydanie części języków bez przeglądu (szybciej, ryzyko błędnej wskazówki bezpieczeństwa). Rekomendacja: A.
2. **Pismo jednostek masy (09-lokalizacja-005).** A: lokalne symbole w cyrylicy i grece (zmiana M1-039); B: wszystkie symbole łacinką, także dystans. Rekomendacja: A.
3. **Ceny w USD (09-lokalizacja-002)** — bez decyzji produktowej, ale potrzebny krok właściciela: build z logiem `displayPrice`/waluty i odczyt na telefonie testerki (rola 02 przygotuje instrukcję).

## Proponowane polecenie naprawy

`node tools/assemble.mjs 09-lokalizacja --tryb fix --zadania 09-lokalizacja-001,09-lokalizacja-003,09-lokalizacja-005,09-lokalizacja-006,09-lokalizacja-007,09-lokalizacja-008`

09-lokalizacja-002 → rola 02 (MON-10), 09-lokalizacja-004 → rola 04 (SP-07). Czas: ok. 3–4 h pracy agenta łącznie (001 wariant A 1–2 h, reszta po 15–45 min), czekanie: verify ok. 12 min, przegląd API tylko przy wariancie B; czas właściciela: decyzje 1–2, telefon dla 002 i 004.

`git status --porcelain` (repo `/home/user/trening`, przy oddaniu): pusty.
