# 16. Języki i styl marki

## Języki (decyzja właściciela 05.10.2026)

*Decyzja:* aplikacja w językach krajów Europy Środkowo-Wschodniej, „każdy kraj swój język”, plus hiszpański i portugalski
(„Pełna lista plus portugalski i hiszpański”). Kontrola jakości: „Tłumaczenie + niezależna recenzja AI”.

Języki (16): pl, en, cs, sk, hu, ro, bg, hr, sl, sr, lt, lv, et, uk, es, pt.

| Kod | Wariant / zapis | Rejestr (wg iOS danego języka) |
|---|---|---|
| sr | serbski, **cyrylica**, ekawica | polecenia „Додирните”, przyciski „Сачувај” |
| pt | **pt-PT** (Portugalia) | formalnie, bez „você”; „ecrã”, „telemóvel” |
| es | **es-ES** (Hiszpania) | „tú”, „Ajustes”, „OK” jako Gotowe |
| hr, sl, cs, sk, bg, lt, lv, ro, hu, uk | standard | formalny jak w iOS |
| et | standard | „sina” (jak Apple w iOS po estońsku) |

*Jak to działa (jedno źródło prawdy):*
- Klucz = polski tekst. Lista tekstów do przetłumaczenia generowana z kodu: `lib/locales/_source.json`
  (`UPDATE_I18N=1 npx jest tests/i18n-locales.test.ts`).
- Słowniki: `lib/locales/<kod>.json`. Brak klucza → angielski. Liczba mnoga wg CLDR: `lib/plural.ts`.
- Opisy uprawnień iOS (HealthKit) w danym języku: `locales/<kod>.json` + `app.json` (`CFBundleLocalizations`, `locales`).
- Test `tests/i18n-locales.test.ts` pilnuje: komplet kluczy, te same `{parametry}`, liczba form liczby mnogiej,
  brak polskich liter (przeciek nieprzetłumaczonego tekstu), zgodność `app.json` z listą języków.
- Nazwy ćwiczeń z biblioteki: po polsku tylko w języku polskim, w pozostałych po angielsku (tłumaczenie nazw biblioteki — otwarte; po researchu biblioteki 09.10.2026 jest ich 709).

*Proces (05.10.2026):* 14 tłumaczeń (osobny agent AI na język, wytyczne: rejestr iOS, terminy siłowni, długość ≤ ~130% EN),
potem 14 niezależnych recenzji (inny agent, bez dostępu do notatek tłumacza). Recenzje zmieniły 5–36 wpisów na język
(hu 36, sk 20, bg 20, sr 17, pt 16, sl 15, hr 14, uk 14, lv 14, lt 13, ro 12, cs 8, et 6, es 5).

*Otwarte (do rozstrzygnięcia przez native speakera; nie zgadujemy):*
- „do upadku/failure”: et „kuni väsimuseni”, lt „iki nesėkmės”, hu „bukásig”, ro „până la epuizare”.
- „core”: et „kere”, lt „liemuo”, bg „кор”.
- Obciążenie dodatkowe: pt „lastro”, ro „lest”.
- cs: „široký sval zádový” vs „latissimus”; „Smith stroj” vs „Multipress”.
- sr: nazwa aplikacji Pliki („Датотеке”), „Торањ (згибови + дипс)”.
- sl: pytania w 1. osobie („Izbrišem vajo?”) vs „Želite …?”.
- lv: forma „zero” liczby mnogiej (teraz mianownik l.mn., np. „vingrinājumi”; alternatywa dopełniacz „vingrinājumu”).
- Nazwy ćwiczeń z biblioteki w językach innych niż pl/en.
- Opis w App Store w każdym języku — przy publikacji (docs/15).

### Języki — wariant B (decyzja właściciela 07.10.2026)

*Decyzja:* „Idziemy w B” — dodać de, fr, it, nl, sv, da, nb (bokmål), fi, tr, el (razem 26). Kolejność: najpierw build 1002 (nowy wygląd), języki w buildzie 1003.

| Kod | Rejestr (wg iOS danego języka) | Nazwa aplikacji | Zakładka „Trening” |
|---|---|---|---|
| de | du | Training | Training |
| fr | vous; spacja nierozdzielająca przed ? ! : ; i w « » | Training | Séance |
| it | tu | Training | Allenamento |
| nl | je/jij | Training | Training |
| sv | du | Träning | Träning |
| da | du | Træning | Træning |
| nb | du | Trening | Trening |
| fi | sinä; bez końcówek fleksyjnych przy {parametrach} | Treeni | Treeni |
| tr | siz; bez przyrostków przy {parametrach} | Training | Antrenman |
| el | jak Apple; „;” jako znak zapytania | Training | Προπόνηση |

Nazwa aplikacji wg reguły z 05.10 (lokalne słowo, gdy podobne do „Trening”, inaczej „Training”). Liczba mnoga: dwie formy; fr „one” = 0 i 1.
Kroje: IBM Plex Sans 400/600/700 ma litery wszystkich 26 języków, w tym greckie — test `matrix-i18n`. IBM Plex Mono (liczby, czasy) ma łacinę, cyrylicę i cyfry, ale **nie ma liter greckich** (sprostowanie 09.10.2026, audyt 0.10 A11-11; wcześniej ten akapit twierdził inaczej): litery greckie w tekście krojem mono dostają krój Plex Sans (`components/ui.tsx` `monoSafe`), a słowa przy liczbach (np. „poprz.”) są krojem tekstu — test `audit-0.10-lang-ui` (ekrany w el) i `matrix-i18n`. Nazwy w App Store: `store/app-store-names.json` (App Store: „no” = nb).

*Proces (07.10.2026):* jak 05.10 — 10 tłumaczeń (osobny agent na język), potem 10 niezależnych recenzji (inny agent, bez notatek tłumacza).
Recenzje zmieniły: el 46, fi 40, tr 38, nl 36, nb 24, sv 20, de 18, fr 13, da 10, it 10 wpisów. Najważniejsze: tr „yedek” było i kopią, i zamiennikiem
→ „Alternatif”; nl „enkelbanden” (więzadła) → „enkelstraps”; el „στο {l}” tylko dla rodzaju nijakiego → „σε: {l}”; fr „principaux” → „principal”
(miejsce główne); da „arbejdspause” (przerwa w pracy) → „Pause, arbejdssæt”; fi „Apin” → „sovelluksen”.

*Otwarte (do native speakera; nie zgadujemy):*
- „Apple Health” czy nazwa aplikacji Zdrowie w języku (de „Health”, fr „Santé”, it „Salute”, el „Υγεία”, fi „Terveys”, nl „Gezondheid”) — dziś mieszane w części języków.
- „do upadku/failure”: sv „till failure”, da/nb „til udmattelse”, nl „tot falen”, fi „uupumukseen”.
- „Jak w telefonie”: de „Wie System” vs „Automatisch”, it „Come il sistema” vs „Automatico”, el „Ρύθμιση τηλεφώνου” (17 znaków).
- fr „core” → „gainage” (filtr) vs „sangle abdominale” (partia mięśniowa); it „cadenza” dla tempa; nl cudzysłowy “…” vs ‘…’; nl/tr nazwy maszyn mieszane EN/lokalne.
- fi „Kumoa” (Anuluj) vs „Peru” (Cofnij); da/nb „roningsmaskine/roingsmaskin” (maszyna) obok „romaskine/romaskin” (ergometr).

### Fala 1 nowych języków: pt-BR i es-419 (decyzja właściciela 09.10.2026 wieczór, docs/18; wdrożenie 09.10.2026 na gałęzi feat-jezyki-w1, po wydaniu 0.11)

*Sprawdzenia przed falami (09.10.2026, strony Apple przeczytane):* lista „System Language” (apple.com/ios/feature-availability) ma
Portuguese (Brazil) i Spanish (Latin America); lista lokalizacji App Store Connect (developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations)
ma Portuguese (Brazil) i **Spanish (Mexico)** — nie ma „Latin America”, więc opis sklepu dla es-419 idzie do lokalizacji es-MX. Kroje IBM Plex Sans/Mono mają wszystkie
znaki pt/es (cmap). Kazachski (brak lokalizacji App Store Connect), uzbecki i azerski (nie są językami systemu iOS ani lokalizacjami App Store Connect) —
**odłożone do wydania z arabskim** (zasada właściciela z 09.10: język trudniejszy niż zakładano → odłożony, z powodem).

*Rozwiązanie (wariant B — słownik różnic):* `lib/locales/pt-BR.json` i `es-419.json` (oraz `lib/cues/text/…`) zawierają tylko teksty, które w wariancie
brzmią inaczej niż w języku bazowym (pt = pt-PT, es = es-ES); słownik wariantu = bazowy + nakładka (`lib/locales/index.ts`, `lib/cues/index.ts`). Odrzucony
wariant A (pełne osobne słowniki): podwójna praca przy każdym nowym tekście i rozjazd poprawek między pt/pt-BR, es/es-419. Ryzyko B: nowy tekst dodany tylko
do bazowego słownika dziedziczy wersję europejską — pilnuje go test `tests/i18n-variants.test.ts` (słowa i formy typowe dla odmiany europejskiej zabronione
w wariancie: pt-BR bez „ecrã”, „ficheiro”, „telemóvel”, „registar”, „Definições”, „ginásio”, „tu”-form („podes”, „tens”, „teu”), „está a + bezokolicznik”,
enklizy w poleceniach; es-419 bez „vosotros”, „-áis/-éis”, „ordenador”, „móvil”, „Ajustes”, „pulsa”, „añadir” (Apple es-MX: „Agregar”), „entreno”,
„copia de seguridad” (Apple es-MX: „respaldo”), „esterilla”, „gemelos”, „comba”, „introduce” (LatAm: „ingresa”)).

| Kod | Rejestr | Nazwy aplikacji iOS w tekstach (Apple Support pt-br / es-mx) | Nazwa aplikacji |
|---|---|---|---|
| pt-BR | „você”, polecenia w trybie łączącym („Toque”, „Escolha”, „Salve”), proklityka | Ajustes, Arquivos, app Saúde | Treino (jak pt) |
| es-419 | „tú” (jak Apple es-MX: „Ve a Configuración”) | Configuración, Archivos, app Salud | Training (jak es) |

Słownictwo treningowe pt-BR: academia, anilhas, pegada/pegador, esteira, barra fixa, mesa flexora, cadeira extensora, panturrilhas, quadril, deload, backup.
es-419: equipo (sprzęt), caminadora, pantorrillas, colchoneta, cuerda para saltar, respaldo. Nazwy ćwiczeń z biblioteki — jak w innych językach: po angielsku.

*Wybór języka „Jak w telefonie” (`resolveLang`, CLDR):* pt + region BR albo sam „pt” (CLDR likelySubtags: pt → pt_Latn_BR) → pt-BR; pt-PT i regiony
dziedziczące po pt_PT (AO, MZ, CV, CH, LU…) → pt. es + region z listy CLDR parentLocales `es_419` (`ES_419_REGIONS`: 419, MX, AR, CO, CL, PE, US, PR…) →
es-419; es-ES, sam „es” (CLDR: es → es_Latn_ES) i pozostałe (GQ, PH, IC…) → es. Liczba mnoga: pt-BR jak fr („one” = 0 i 1; CLDR plurals.xml: pt i = 0..1,
pt_PT osobno i = 1), es-419 jak es. Ustawienie języka zapisane jako „pt-BR”/„es-419” — bez zmiany schematu danych (sanitizer przyjmuje każdy kod z `LANGS`;
starsza wersja aplikacji po imporcie takiej kopii wraca do „Jak w telefonie”).

*Otwarte:* (1) czy iOS przy języku bez regionu (np. „Español” + region Meksyk) zwraca w `Locale.preferredLanguages` tag z regionem (es-MX) — niepotwierdzone,
do sprawdzenia na symulatorze (test e2e); (2) iOS-owa lista języków w Ustawieniach → Aplikacja → Język: lokalizacje `pt` (treść pt-PT) i `pt-BR` — czy iOS
pokaże „pt” jako „Português (Portugal)” — sprawdzić na buildzie; ewentualnie przemianować folder lokalizacji na pt-PT (bez zmiany kodu języka w danych);
(3) widżet przerwy wybiera etykiety po dwóch pierwszych literach języka telefonu (`RestLiveActivity.swift`) — dla pt-BR/es-419 bierze pt/es (te same słowa
„Descanso”/„Série”, więc bez skutków); (4) teksty czytane przez native speakera (pt-BR, es-419) przed App Store.

### Fala 2 nowych języków: indonezyjski (id), malajski (ms), wietnamski (vi) (decyzja właściciela 09.10.2026 wieczór, docs/18; wdrożenie 09.10.2026 na gałęzi feat-jezyki-w2, po wydaniu 0.11)

*Sprawdzenia (09.10.2026, te same strony Apple co przy fali 1):* id, ms i vi są na liście „System Language” iOS i na liście lokalizacji App Store Connect
(Indonesian, Malay, Vietnamese); IBM Plex Sans 400/600/700 i Plex Mono mają wszystkie znaki (także wietnamskie z dwoma znakami nad literą: ấ ẫ ệ ộ…).
Żaden z trzech języków nie wymagał zmiany kroju ani układu, więc żaden nie jest odłożony (zasada właściciela z 09.10: trudniejszy niż zakładano → odłożony
do wydania z arabskim). Uzbecki i kazachski z tej samej decyzji — **odłożone do wydania z arabskim** (powody w sekcji „Fala 1”: uz nie jest językiem
systemu iOS ani lokalizacją App Store Connect; kk nie ma lokalizacji App Store Connect).

*Rozwiązanie:* pełne słowniki (nie warianty): `lib/locales/{id,ms,vi}.json` (1345 tekstów UI, komplet z `_source.json`) i `lib/cues/text/{id,ms,vi}.json`
(265 zdań wskazówek techniki); `locales/{id,ms,vi}.json` (nazwa pod ikoną, opisy uprawnień Zdrowia), `app.json`, widżet przerwy (UPDATE_WIDGET),
`store/app-store-names.json`. Nazwy ćwiczeń z biblioteki — po angielsku jak w innych językach (`exName`). Nazwa aplikacji: **Training** (reguła z 05.10:
lokalne słowo — id/ms „Latihan”, vi „Luyện tập” — nie jest podobne do „Trening”). Tłumaczenie: agent (własne sformułowania, bez nazw innych aplikacji);
**bez recenzji native speakera** — otwarte.

| Kod | Rejestr | Terminy (trening / ćwiczenie / seria / powtórzenia / przerwa / pauza / szablon / guma) | Nazwy iOS w tekstach |
|---|---|---|---|
| id | „Anda”, polecenia bez „-lah” („Ketuk”, „Pilih”, „Simpan”) | latihan / gerakan / set / repetisi (skrót „rep”) / istirahat / jeda / templat / karet | Pengaturan, File, app Kesehatan |
| ms | „anda”, „Ketik” | latihan / senaman / set / ulangan / rehat / jeda / templat / getah | Seting, Fail, app Kesihatan |
| vi | „bạn”, uprzejme „hãy” w poleceniach | buổi tập (zakładka „Tập”) / bài tập / hiệp / lần (lặp) / nghỉ / tạm dừng / mẫu / dây kháng lực | Cài đặt, Tệp, ứng dụng Sức khỏe |

Słownictwo sprzętu: id barbel, dumbel, pelat, bangku, matras, katrol; ms barbel, dumbel, plat, bangku, tikar, takal; vi tạ đòn, tạ đơn, bánh tạ, ghế, thảm,
ròng rọc, máy chạy bộ; „do upadku” — id/ms „sampai/hingga gagal”, vi „đến kiệt sức”. Terminy siłowni bez tłumaczenia jak w innych językach (drop set,
superset, deload, kettlebell, leg press…). Test `tests/i18n-wave2.test.ts` pilnuje słownictwa: id i ms nie mieszają się (id bez „Seting/Padam/telefon/
senaman/getah”, ms bez „Pengaturan/Hapus/ponsel/gerakan/karet”), vi „set” tylko w „drop set”/„superset”.

*Wybór języka „Jak w telefonie” (`resolveLang`):* kod języka telefonu id / ms / vi z dowolnym regionem (ms-MY, ms-SG, ms-BN…); przestarzałe kody
`in` → id i `zsm` → ms (CLDR languageAlias — zgodnie z `Intl.getCanonicalLocales`, sprawdzone testem). Liczba mnoga: jedna forma („other”, CLDR
plurals.xml; `Intl.PluralRules` dla id/ms/vi ma tylko „other”). Liczby i daty z Intl: przecinek dziesiętny id-ID i vi-VN, **kropka w ms-MY** (CLDR);
skrót miesiąca id „Mar” (Maret) to forma CLDR. Godzina ms-MY w formacie 12-godzinnym („6:40 PTG”) — z regionu, jak w telefonie.

*Wietnamski — wysokość wierszy (ograniczenie, sprawdzenie na Linuksie):* zmierzone z plików kroju (tablice glyf/hhea, test w `tests/i18n-wave2.test.ts`):
małe litery z dwoma znakami nad literą (ấ, ể, ộ) mieszczą się w ascent kroju (1,025 em); **wielkie** (Ấ, Ệ, Ỗ) wystają ponad ascent o 4–11 % em
(Plex Sans 400: 1,061 em, 700: 1,127 em). iOS liczy wiersz z ascent + descent = 1,3 em i rysuje glif poza ramką wiersza, więc w zwykłym tekście nic nie
znika; najgorszy styk (Bold, „Ấ” pod literą z ogonkiem w wierszu wyżej) ≤ 0,04 em. Teksty z jawnym `lineHeight` mają ≥ 1,28 em (poza cyframi). Wielkie
litery z dwoma znakami są w wietnamskim rzadkie (początek zdania). Tego nie da się potwierdzić na Linuksie — **otwarte: zrzut z symulatora iOS w języku vi
(e2e-ios)**; zrzuty web (Chromium, scratchpad `jezyki-w2-zrzuty`) nie pokazały ucięć. Opcje, gdyby symulator pokazał ucięcie: (A) nic nie zmieniać
(rekomendacja do czasu zrzutu), (B) `lineHeight` 1,4 em dla vi w tekstach jednowierszowych z `numberOfLines`/`adjustsFontSizeToFit`.

*Otwarte:* (1) teksty czytane przez native speakerów (id, ms, vi) przed App Store; (2) zrzut z symulatora iOS w języku vi (wysokość wierszy, etykiety
zakładek 320 pt); (3) opisy w App Store (część po dwukropku w nazwie, podtytuł, opis, słowa kluczowe) po indonezyjsku, malajsku i wietnamsku — do napisania
i przejrzenia przy ASO; (4) pole liczbowe przy ms (kropka dziesiętna) — zachowanie jak en, potwierdzić na telefonie z regionem Malezja.

### Fala 3 nowych języków: rosyjski (ru) (decyzja właściciela 09.10.2026 wieczór, docs/18; wdrożenie 09.10.2026 na gałęzi feat-jezyki-w3, po wydaniu 0.11)

*Sprawdzenia (09.10.2026, te same strony Apple co przy fali 1):* rosyjski jest na liście „System Language” iOS (Russian) i na liście lokalizacji
App Store Connect (Russian); IBM Plex Sans 400/600/700 i Plex Mono 500 mają cały alfabet rosyjski z „ё/Ё” oraz «» i № (cmap — test
`tests/i18n-wave3.test.ts`, „wygląd”). Język nie wymagał zmiany kroju ani układu — **nie jest odłożony** (zasada właściciela z 09.10).
Uwaga z docs/18 („sprzedaż w Rosji przez App Store niedostępna od 2022”) nie ma w repozytorium przeczytanego źródła — **niepotwierdzone**;
dostępność w krajach sprawdzić w App Store Connect (Pricing and Availability) przy publikacji. Rosyjski interfejs służy też użytkownikom
z innych krajów (telefon ru-KZ, ru-BY, ru-UA, ru-KG…).

*Rozwiązanie:* pełny słownik (nie wariant): `lib/locales/ru.json` (1345 tekstów UI, komplet z `_source.json`) i `lib/cues/text/ru.json` (265 zdań
wskazówek techniki); `locales/ru.json` (nazwa pod ikoną, opisy uprawnień Zdrowia), `app.json`, widżet przerwy (UPDATE_WIDGET: „Training — Отдых”,
etykiety „Отдых”/„Подход”), `store/app-store-names.json` („Training: дневник тренировок”). Nazwy ćwiczeń z biblioteki — po angielsku jak w innych
językach (`exName`). Nazwa aplikacji: **Training** (reguła z 05.10: „Тренировка” nie jest podobne do „Trening” — tak samo jak uk „Тренування”).
Tłumaczenie: agent (własne sformułowania, bez nazw innych aplikacji); **bez recenzji native speakera** — otwarte. `ru` dopisany na końcu `LANGS`
(lista w Ustawieniach → Język; kolejność jak dotąd = kolejność fal).

| Kod | Rejestr | Terminy (trening / ćwiczenie / seria / powtórzenia / przerwa / pauza / szablon / guma / do upadku / deload) | Nazwy iOS w tekstach |
|---|---|---|---|
| ru | interfejs „вы” (jak iOS: „Коснитесь”, „Выберите”, „Сохранить”); wskazówki techniki „ты” (głos trenera — jak uk) | тренировка / упражнение / подход / повторения (skrót „повт.”) / отдых / пауза / шаблон / резинка / до отказа / разгрузка (разгрузочная неделя) | Настройки, Файлы, приложение «Здоровье» |

Słownictwo sprzętu (jak na rosyjskojęzycznych siłowniach): штанга, гантели, гриф (EZ-гриф, трэп-гриф, Т-гриф), блин, гиря, скамья (горизонтальная,
наклонная, скамья Скотта), блок / кроссовер, тренажёр Смита, жим ногами, римский стул, турник, брусья, силовая рама, фитбол, медбол, коврик;
cele generatora: Сила / Масса / Похудение / Общая форма; „FBW” → „Full Body” (tak piszą rosyjskojęzyczne plany). Bez tłumaczenia (jak w innych
językach): дроп-сет, суперсет, кардио, e1RM, RPE/RIR, GHD, landmine, reverse hyper. Jednostki cyrylicą (с, мин, ч, м, км, макс.) — test K3 (`audit-0.10-lang`,
lista LOCAL + ru); typografia: cudzysłowy «…».

*Rosyjski ≠ ukraiński (test `tests/i18n-wave3.test.ts`):* w tekstach ru nie ma liter і ї є ґ ani apostrofu ’, w uk — ы э ъ ё; listy wyrazów wyłącznie
ukraińskich (або, вправа, тиждень, вага, тренування, щоб, лише…) i wyłącznie rosyjskich (или, упражнение, неделя, вес, отдых, подход, чтобы…) są
rozłączne między słownikami (każdy wyraz z listy naprawdę występuje w swoim języku — lista nie jest martwa); teksty z ≥ 3 wyrazami identyczne
w ru i uk < 2 % (dziś 7 wpisów, np. „пара: {a} ({r}); одна гантель: {b} ({r1})”); żadne zdanie wskazówek ru nie jest identyczne z uk. Seria to
„подход” (nie kalka „серия”/„сет”).

*Wybór języka „Jak w telefonie” (`resolveLang`):* kod języka telefonu `ru` z dowolnym regionem (ru-RU, ru-KZ, ru-UA, ru-BY, ru-KG, ru-MD) → ru;
`uk` z dowolnym regionem → uk (język telefonu decyduje, nie region — telefon ukraiński zostaje po ukraińsku, telefon po rosyjsku na Ukrainie jest
po rosyjsku). Białoruski i kazachski (nie są językami aplikacji) → angielski jak dotąd. Daty i liczby z regionu telefonu (ru-KZ, ru-UA…), przy
wymuszonym rosyjskim na telefonie w innym języku — ru-RU; przecinek dziesiętny (CLDR). Liczba mnoga: dla liczb całkowitych jak uk —
one / few / many (CLDR plurals.xml: ru jak uk; „other” tylko dla ułamków, w aplikacji ułamek → ostatnia forma — uproszczenie z `lib/plural.ts`,
tp() dostaje tylko liczby całkowite); każdy wpis ma trzy różne formy („подход / подхода / подходов”).

*Otwarte:* (1) tekst czytany przez native speakera przed App Store; (2) zrzut z symulatora iOS w języku ru (etykiety zakładek 320 pt —
„Упражнения”, „Тренировка”; zrzuty web w scratchpad `jezyki-w3-zrzuty` bez uciętych tekstów); (3) opis w App Store po rosyjsku (część po dwukropku
w nazwie, podtytuł, opis, słowa kluczowe) — do napisania i przejrzenia przy ASO; (4) dostępność w krajach (patrz wyżej) — App Store Connect.

### Fala 4 nowych języków: japoński (ja), koreański (ko), chiński tradycyjny (zh-Hant) (decyzja właściciela 09.10.2026 wieczór, docs/18; wdrożenie 09.10.2026 na gałęzi feat-jezyki-w4b, po wydaniu 0.11)

*Sprawdzenia (09.10.2026, te same strony Apple co przy fali 1):* japoński, koreański i chiński tradycyjny są na liście „System Language” iOS (Japanese,
Korean, Chinese, Traditional (Taiwan) i (Hong Kong)) i na liście lokalizacji App Store Connect (Japanese, Korean, Chinese (Traditional)). IBM Plex Sans
i Mono **nie mają** kana, kanji ani hangula (cmap — test `tests/i18n-wave4.test.ts`, „wygląd”). Żaden z trzech języków nie wymagał przebudowy kroju ani
układu (wariant A niżej) — **żaden nie jest odłożony** (zasada właściciela z 09.10). Chiński uproszczony — poza falą (telefon zh-Hans → angielski).

*Krój — co robi iOS ze znakiem spoza kroju przy jawnym `fontFamily` (źródła przeczytane 09.10.2026):*
- React Native 0.86 rysuje tekst na iOS przez TextKit: `NSTextStorage` + `NSLayoutManager` (kod w `node_modules/react-native/ReactCommon/react/renderer/
  textlayoutmanager/platform/ios/…/RCTTextLayoutManager.mm`, `Libraries/Text/Text/RCTTextShadowView.mm`).
- Apple, `NSMutableAttributedString.fixAttributes(in:)` (developer.apple.com/documentation/foundation/nsmutableattributedstring/fixattributes(in:)):
  „assigns default fonts to characters with illegal fonts for their scripts and otherwise corrects font attribute assignments” — `NSTextStorage` robi to sama
  (`fixesAttributesLazily`: „The system’s concrete subclass overrides this property”).
- Apple, `CTFontCopyDefaultCascadeListForLanguages` (developer.apple.com/documentation/coretext/ctfontcopydefaultcascadelistforlanguages(_:_:)):
  „When the original font used for text layout and rendering does not support a certain Unicode character from the provided text, the system follows this
  list to pick a fallback font that includes the character. The font alternatives in the cascade list match the original font’s style, weight, and width.”
- Wniosek: przy `fontFamily: IBMPlexSans_600SemiBold` znak 日/한 dostaje krój zastępczy systemu (per znak) o tej samej grubości; łacina i cyfry zostają w Plex.
  Którego kroju CJK użyje iOS (Hiragino Sans / Apple SD Gothic Neo / PingFang) — wybiera lista kaskadowa wg języków preferowanych telefonu; **na
  symulatorze niesprawdzone** (otwarte niżej).

| Wariant | Co | Rozmiar | Kompromisy |
|---|---|---|---|
| **A (wdrożony, rekomendacja)** | IBM Plex bez zmian; pismo CJK krojem zastępczym iOS per znak | 0 MB, 0 zmian w `lib/theme.ts` (tylko stała `FALLBACK_SCRIPTS` do testów) | grubość zachowana (Apple, wyżej); cyfry, timery i łacina dalej w Plex (spójność marki, cyfry Plex Mono w liczbach); ryzyko: kształty znaków Han wg języka telefonu (np. chiński w aplikacji na telefonie po japońsku → możliwe japońskie kształty; przy „Jak w telefonie” język telefonu = język aplikacji, więc problem dotyczy tylko języka wymuszonego), wiersz z dwoma krojami (inne metryki) |
| B (krój systemowy dla ja/ko/zh-Hant) | `fontFamily` wyłączony dla tych języków | 0 MB | **nie da się z jednego miejsca:** `F.*` użyte w 133 miejscach (`grep "F\.\w"` w app/components/lib), a aplikacja celowo nie ustawia `fontWeight` („grubość wybiera rodzina”, `lib/theme.ts`) — bez `fontFamily` nagłówki i półgrube teksty stałyby się zwykłe, chyba że każde miejsce dostanie `fontWeight` (przebudowa 133 miejsc); `F` jest też w 4 stylach na poziomie modułu (zmiana języka wymagałaby restartu). Odmiana B2 — nazwane kroje systemowe przez getter `F` (Hiragino Sans W3/W6, Apple SD Gothic Neo Regular/SemiBold/Bold): lista Apple „System Fonts” (developer.apple.com/fonts/system-fonts/) oznacza Hiragino Sans W3–W8 i Apple SD Gothic Neo jako „iOS system font”, ale **PingFang TC jako „iOS downloadable”** — dla zh-Hant nie ma pewnego kroju do nazwania |
| C (IBM Plex Sans JP/KR/TC) | dołączyć kroje Plex CJK (OFL 1.1 — `@expo-google-fonts/ibm-plex-sans-jp` 0.4.2: „MIT AND OFL-1.1”, plik LICENSE_FONT) | JP 400/600/700: 3 × ≈ 2,38 MB = 7,1 MB; KR: 3 × ≈ 2,8 MB = 8,5 MB; TC — brak w `@expo-google-fonts` (npm 404), pliki tylko z repozytorium IBM (niesprawdzone) | +15,6 MB i więcej do aplikacji (dziś 5 plików krojów w aplikacji: 0,93 MB); ta sama przebudowa co B (krój zależny od języka); spójny wygląd z marką i pewne kształty znaków (krój JP ma japońskie, KR koreańskie) |

Rekomendacja i wdrożenie: **A** — bez kosztu i bez przebudowy, zgodne z dokumentacją Apple; C dopiero, jeśli zrzut z symulatora pokaże zły krój lub grubość
(decyzja właściciela — produktowa: rozmiar aplikacji vs wygląd). B odrzucone jako „z jednego miejsca” — wymaga przebudowy większej niż C.

*Łamanie wierszy bez spacji:* własny kod nie dzieli tekstów po spacjach (`grep split(` — tylko dane, nie teksty UI); `glue()` (NBSP przy liczbach) działa
tylko przy spacji, więc w CJK nic nie zmienia. Testy szerokości w `tests/matrix-i18n.test.tsx` („żaden wyraz nie szerszy niż wiersz”) dzieliły po spacjach —
zdanie japońskie/chińskie byłoby jednym „wyrazem”. Teraz `units()`: bez pisma CJK — dokładnie jak dotąd (po spacjach, test kontrolny); ja/zh — złamanie
między znakami (Unicode UAX #14, sekcja 5.1, klasa ID: „lines can ordinarily break before and after and between pairs of ideographic characters”, także
hiragana i katakana poza małymi znakami) z zakazami: bez złamania przed znakiem zamykającym/nonstarterem (、。」）・ ー, małe kana, 々 — UAX #14: NS i CJ,
traktowane ściśle) i po otwierającym (「（); ciąg łaciński (RPE, e1RM, {n}) — całość; koreański — po spacjach (ostrzej niż iOS: UAX #14 domyślnie traktuje
sylaby hangul jak ID, a React Native ma `lineBreakStrategyIOS` domyślnie „none” — reactnative.dev/docs/text); szerokość znaku CJK bez glifu w Plex = 1 em
(dotąd 0,6 em). Interpunkcja końcowa: 。？！： = . ? ! : (test `punctMismatch`).

*Rozwiązanie:* pełne słowniki `lib/locales/{ja,ko,zh-Hant}.json` (1345 tekstów UI) i `lib/cues/text/{ja,ko,zh-Hant}.json` (265 zdań wskazówek);
`locales/{ja,ko,zh-Hant}.json` (nazwa pod ikoną, opisy uprawnień Zdrowia), `app.json`, widżet przerwy (UPDATE_WIDGET; `RestLiveActivity.swift` wybiera
zh-Hant dla zh-Hant-*/zh-TW/zh-HK/zh-MO, inny chiński → angielski), `store/app-store-names.json` (lokalizacje ja, ko, zh-Hant). Nazwy ćwiczeń z biblioteki —
po angielsku jak w innych językach (`exName`). Nazwa aplikacji: **Training** (トレーニング, 트레이닝, 訓練 — inne pismo, niepodobne do „Trening”). Nazwy języków
na liście jak w iOS: 日本語, 한국어, 繁體中文. Tłumaczenie: agent (własne sformułowania, bez nazw innych aplikacji); **bez recenzji native speakera** — otwarte.

| Kod | Rejestr | Terminy (trening / ćwiczenie / seria / powtórzenia / przerwa / pauza / szablon / guma / do upadku / deload / redukcja) | Nazwy iOS w tekstach |
|---|---|---|---|
| ja | grzeczny styl です/ます w zdaniach (UI i wskazówki; częste błędy jako „…こと。”), przyciski krótkie (保存, 削除, キャンセル) | トレーニング / 種目 / セット / 回数 (回) / 休憩 / 一時停止 / テンプレート / バンド / 限界まで / ディロード / 減量 | 設定, 「ファイル」 (このiPhone内), ヘルスケア |
| ko | styl grzecznościowy: -니다 w zdaniach, -세요 w poleceniach, pytania -까요? | 운동 / 종목 / 세트 / 반복 횟수 (회) / 휴식 / 일시정지 / 루틴 / 밴드 / 실패 지점까지 / 디로드 / 감량 | 설정, 파일 앱 (나의 iPhone), 건강 앱 |
| zh-Hant | Tajwan: „你”, znaki tradycyjne, słownictwo iOS tajwańskie (設定, 檔案, 資料, 儲存) | 訓練 / 動作 / 組 / 次數 (下) / 休息 / 暫停 / 範本 / 彈力帶 / 力竭 / 減量 (減量週) / 減脂 | 設定, 「檔案」 (我的 iPhone), 「健康」 App |

Słownictwo sprzętu: ja バーベル, ダンベル, プレート, ベンチ, ケーブル, ケトルベル, スミスマシン, パワーラック, 懸垂バー; ko 바벨, 덤벨, 원판, 벤치, 케이블, 케틀벨,
스미스 머신, 파워 랙, 철봉; zh-Hant 槓鈴, 啞鈴, 槓片, 訓練椅, 滑輪, 壺鈴, 史密斯機, 深蹲架, 單槓. Cele generatora: ja 筋力 / 筋肥大 / 減量 / 健康・体力; ko 근력 /
근비대 / 감량 / 건강·체력; zh-Hant 肌力 / 增肌 / 減脂 / 健康體能 (zh-Hant: „減量” = deload, więc redukcja to „減脂” — test). Liczby: kropka dziesiętna
(CLDR ja-JP, ko-KR, zh-Hant-TW); jednostki ja 秒/分/時間 i km/m, ko 초/분/시간 i km/m, zh-Hant 秒/分鐘/小時 i 公里/公尺. Cudzysłowy: ja i zh-Hant 「…」, ko ‘…’.
Liczba mnoga: jedna forma „other” (CLDR plurals.xml; `Intl.PluralRules` dla ja/ko/zh-Hant ma tylko „other”); wyraz liczony jak licznik: ja セット/回/日,
ko 세트/회/일, zh-Hant 組/下/天/個動作 (aplikacja wstawia liczbę ze spacją: „3 セット”).

*Wybór języka „Jak w telefonie” (`resolveLang`):* ja-* i ko-* z dowolnym regionem; chiński — pismo Hant (zh-Hant-TW, zh-Hant-HK, zh-Hant-MO) albo region
TW/HK/MO bez zapisu pisma (zh-TW, zh-HK — CLDR likelySubtags: zh_TW → zh_Hant_TW, zh_HK → zh_Hant_HK) → zh-Hant; zh-Hans-*, zh-CN, zh-SG i samo „zh” (CLDR:
zh → zh_Hans_CN) → angielski. Daty i liczby z regionu telefonu (zh-Hant-HK → daty hongkońskie), przy wymuszonym języku — ja-JP, ko-KR, zh-Hant-TW (także na
telefonie zh-Hans-CN — `locale()` porównuje pismo, nie tylko „zh”). Ustawienie zapisane jako „ja”/„ko”/„zh-Hant” — bez zmiany schematu danych.

*Otwarte:* (1) teksty czytane przez native speakerów (ja, ko, zh-Hant) przed App Store; (2) zrzut z symulatora iOS w ja, ko, zh-Hant (krój zastępczy:
który krój, grubość nagłówków i liczb, wysokość wierszy z mieszanym krojem, łamanie wierszy, etykiety zakładek 320 pt) — zrzuty web (Chromium na Linuksie
z krojem WenQuanYi Zen Hei jako zastępczym, scratchpad `jezyki-w4-zrzuty`) tylko orientacyjne; (3) kształty znaków Han przy wymuszonym języku innym niż
język telefonu (np. zh-Hant na telefonie ja) — React Native nie przekazuje języka tekstu do TextKit; (4) koreański: iOS przy `lineBreakStrategyIOS`
„none” łamie między sylabami — opcje: zostawić (rekomendacja do zrzutu) albo „hangul-word” (wymaga właściwości na każdym `Text` — przebudowa, jak B);
(5) opisy w App Store (część po dwukropku w nazwie, podtytuł, opis, słowa kluczowe) po japońsku, koreańsku i chińsku — do przejrzenia przy ASO;
(6) chiński uproszczony (zh-Hans) — osobna decyzja produktowa.

## Nazwa aplikacji (decyzja właściciela 05.10.2026)

*Pod ikoną* (`APP_NAME` w `lib/i18n.ts`, jedno źródło prawdy; `locales/<kod>.json` musi się zgadzać — test `tests/i18n-locales.test.ts`):
słowo lokalne tam, gdzie jest podobne do „Trening” (to samo co tytuł zakładki), w pozostałych „Training”.

| Nazwa | Języki |
|---|---|
| Trening | pl, hr, sl |
| Тренинг | sr |
| Trénink / Tréning | cs / sk |
| Treening / Treniņš / Treniruotė | et / lv / lt |
| Treino | pt |
| Training | en, es, ro, hu, bg, uk, id, ms, vi (fala 2, 09.10.2026) |

Przebieg decyzji: odrzucone „Forma” (w App Store jest już „Forma: Workout Tracker Gym Log”), „Simple Workout Tracker”
(22 znaki — ucięte pod ikoną; jest już „Simple Workout Tracker: Gym”), „Workout” (nazwa aplikacji Apple na Apple Watch),
„Seria”, „Hantel” (właściciel wybrał „Trening”). lt i pt najpierw „Training”, potem właściciel: „Treino i Treniruotė też jest ok”.
sr: cyrylica jak cały interfejs (nie łacinka „Trening”).

*W App Store* (`store/app-store-names.json`, max 30 znaków, wytyczna Apple 2.3.7): „<nazwa>: <opis>”, opis = dziennik siłowni.
App Store Connect nie ma lokalizacji bg, sr, lt, lv, et (lista: developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations);
w tych krajach sklep pokazuje English (U.K.) — „Training: Gym Log & Rest Timer”, Serbia także chorwacką. Pod ikoną zostaje nazwa lokalna
(wariant A, właściciel 05.10.2026). Odrzucony wariant B: „Training” pod ikoną w tych 5 językach. Ryzyko: wytyczna 2.3.8 (nazwa w sklepie
i pod ikoną „similar”) — wspólny rdzeń; jeśli recenzja zakwestionuje, zmiana jednej linii w `APP_NAME`.

*Otwarte:* opisy w App Store (część po dwukropku) czytane przez native speakera; unikalność nazw (rezerwacja w App Store Connect);
znaki towarowe (nie sprawdzone); ~~nazwa widżetu „Trening — przerwa” tylko po polsku~~ — 06.10.2026: widżet w 16 językach (`<kod>.lproj/InfoPlist.strings` i `RestLabels.swift` generowane z APP_NAME i słowników, `tests/widget-i18n.test.ts`); czy folder w Plikach
przyjmuje nazwę zlokalizowaną (sprawdzić na buildzie — teksty ścieżki zakładają, że tak).

## Styl marki

*Decyzja właściciela 07.10.2026:* „Podoba mi się grafika B” → **kierunek B · Tuleja** (docs/21 pkt 6, makiety: https://claude.ai/artifact/VcG5ESWeNsPEVYiFA1kEru):
kolory talerzy zawodniczych (IWF) zawsze z liczbą na talerzu, Tektur + IBM Plex Mono, ikona — koniec sztangi z talerzami z boku.
Zastępuje Kredę (05.10). Zakres (07.10.2026): **wszystko naraz** (B) — ikona z wariantami iOS, kolory, kroje, talerze „co nałożyć na stronę”, widok
skupiony na bieżącej serii (przełącznik Ustawienia → Widok treningu, domyślnie skupiony); krój **mieszany** (A): IBM Plex Sans tekst, Tektur nagłówki i duże
liczby, IBM Plex Mono dane; domyślny wygląd **jasny** (A). Wdrożenie: `lib/theme.ts`, `lib/plates.ts`, `components/PlateBar.tsx`, `assets/brand/icon*.svg`
(`node scripts/brand/icon.mjs`), testy `tests/brand-tuleja.test.tsx`, `tests/tuleja.test.tsx`, `tests/matrix-tuleja.test.tsx`; docs/09.
Opis Kredy niżej zostaje jako historia decyzji.
*Zmiana 07.10.2026 wieczór (decyzja właściciela, docs/18):* nagłówki i duże liczby — IBM Plex Sans Bold zamiast Tektur; pakiet `@expo-google-fonts/tektur` usunięty.

*Decyzja właściciela 05.10.2026:* „Podoba mi się kreda.” → **kierunek A · Kreda**. Tryb ciemny: „Kreda + ciemna wersja” (05.10.2026) — w trybie ciemnym grafitowe tło, kredowy tekst, ten sam pomarańcz.

Właściciel: „Grafika wydaje się defaultowa … Co możemy zrobić, żeby mieć swój własny brand style?” → wybrał „3 kierunki do wyboru”.

| Kierunek | Kolory | Pismo | Charakter |
|---|---|---|---|
| A · Kreda | #F2F0EB tło, #1E1F22 tekst, #E8590C akcent | Archivo + IBM Plex Mono | jasny, spokojny, „zeszyt trenera” |
| B · Stal | #0F1216 tło, #1A1F26 karty, #C6F432 postęp, #5B8DEF informacja | Space Grotesk + JetBrains Mono | ciemny, techniczny |
| C · Tablica wyników | #FFFFFF, #0B0C0E, #1739D6 akcent, #FFB800 rekord | Barlow Condensed + Barlow | sportowy, wąskie duże cyfry |

Każdy kierunek: ikona aplikacji, ikony zakładek SVG zamiast emoji, ten sam ekran treningu. Fonty z Google Fonts (licencja OFL — 0 zł).
*Wdrożenie (05.10.2026):*
- Kolory i kroje w jednym module `lib/theme.ts` (`BRAND`, `light`, `dark`, `F`, `FONT_FILES`).
- Pomarańcz marki #E8590C na jasnym tle ma kontrast 3,3:1 — za mało dla tekstu (WCAG 4,5). W jasnym motywie akcent #C2410C, w ciemnym #FF8A3D;
  czysty #E8590C zostaje w ikonie aplikacji i kolorze powiadomień. Test kontrastu: `tests/ux.test.tsx` C5.
- Kroje ładowane przy starcie (`app/_layout.tsx`); błąd lub brak odpowiedzi w 3 s → krój systemowy, start nie czeka dłużej.
- Timery i duże liczby — IBM Plex Mono; tekst, nagłówki i wąskie pola liczbowe — Archivo z cyframi tabelarycznymi
  (audyt cd60eec: mono, 0,6 em na znak, ucinało „102,5” w polu ciężaru 56 pt).
- Ikony zakładek: `components/TabIcon.tsx` (SVG). Ikona aplikacji: źródło `assets/brand/icon.svg` → `node scripts/brand/icon.mjs` → `assets/icon.png`.
- Ekran startowy i Live Activity (przerwa) w kolorach Kredy.
- Testy: `tests/brand-kreda.test.tsx`.
- **Wybór wyglądu (decyzja właściciela 05.10.2026, po instalacji — zrzut „Nie ma wyglądu kredy”, telefon w trybie ciemnym):**
  „Wybór motywu, domyślnie jasna Kreda”. Ustawienia → Wygląd: Jasny (domyślnie, także dla dotychczasowych danych) / Ciemny / Jak w telefonie.
  `settings.theme`, `applyTheme` w `lib/theme.ts` (`Appearance.setColorScheme` — alerty, klawiatura i pasek stanu też). Ekran startowy kredowy
  (#F2F0EB) — pasuje do domyślnego wyglądu. Testy: `tests/theme-choice.test.tsx`.
