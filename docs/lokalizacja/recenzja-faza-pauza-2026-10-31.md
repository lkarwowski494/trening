# Recenzja lokalizacji: faza animacji „Pauza” i „Podciąganie” (31.10.2026)

- autor: tlumacz
- recenzent: recenzent-lokalizacji
- data: 31.10.2026
- gałąź: slownik/faza-pauza (zmiany niezacommitowane)
- zakres: klucz „Pauza” (cs, sk, ro, et, de), klucz „Podciąganie” (ro, bg, lv), pojęcie `faza_pauza` (wszystkie języki), zmiany `faza_ruchu` (ro, bg, lv), wyjątek „pauza” w `slownik-wyjatki.json`
- kontekst: `components/ExerciseFigureV2.tsx:113` — linia faz pod animacją, zawijana (`flexWrap`), np. „Opuszczanie 2 s · Pauza · Wypychanie 1 s”. „Pauza” stoi bez sekund, występuje dwa razy w pętli (`lib/figures/v2/anim.ts:59`: na dole i na górze ruchu). Pod linią jest przycisk „Zatrzymaj animację” / „Wznów animację”. „Podciąganie” to faza tylko rodziny `pull_up` (`lib/figures/v2/poseData.ts:60`: drążek, kółka, lina; ciało podciąga się samo), w parze z „Opuszczanie”.
- testy: `npx jest tests/slownik-terminow.test.ts tests/audit-0.10-lang.test.ts` — 300/300 zaliczone.

## Uwagi

| język | klucz | obecne | ocena | propozycja | powód | waga |
|---|---|---|---|---|---|---|
| cs | Pauza | Výdrž | OK | — | Trenerzy mówią „výdrž dole”. Nie myli się z przerwą („Pauza”) ani z przyciskiem („Pozastavit animaci”). Rzeczownik pasuje do faz siostrzanych (Spouštění, Tlak). | — |
| sk | Pauza | Výdrž | OK | — | Jak w cs. Ma oparcie w przerwie „Pauza” i przycisku „Pozastaviť animáciu”. | — |
| de | Pauza | Halten | OK | — | „Absenken 2 s · Halten · Drücken 1 s” to forma jak w fazach siostrzanych (bezokolicznik użyty jako rzeczownik). Zgadza się ze wskazówkami („Halte oben kurz inne”). Przycisk „Animation anhalten” jest wyraźnie inny. | — |
| et | Pauza | Hoidmine | OK (do sprawdzenia przez native speakera) | — | Forma na -mine jak Langetamine i Surumine; wskazówki techniki używają „hoia”. Pytanie poniżej. | niska |
| ro | Pauza | Menținere | OK (do sprawdzenia przez native speakera) | ewentualnie inna forma rzeczownikowa | Zgadza się ze wskazówkami („menține…”) i formą faz siostrzanych (Coborâre, Împingere). Ryzyko: w fitnessie „menținere” znaczy też „utrzymanie” (faza utrzymania wagi albo formy), choć w linii faz raczej się nie pomyli. „Pauză” blokuje K1, „Oprire” brzmi jak przycisk stop, więc rozsądnej alternatywy nie ma. | niska |
| ro | Zatrzymaj animację (poza zakresem zmiany) | Pune animația pe pauză | poprawka (do decyzji) | „Oprește animația” | Przycisk w tej samej karcie używa „pauză”, a w ro „Pauză” znaczy przerwę między seriami (K1). Test K1 tego nie łapie, bo polski klucz nie zawiera „pauz”. Ten sam problem, który zmiana usuwa z fazy, zostaje w przycisku tuż pod nią. | średnia |
| ro | Podciąganie | Tragere în sus | OK | — | Rzeczownik odczasownikowy jak Coborâre i Împingere; trzy słowa, ale linia się zawija (siostrzana „Ridicare în picioare” też ma trzy). Zakaz „Tracțiune” jest spójny z powodem, choć fr „Traction” i it „Trazione” zostały, a to też nazwy ćwiczenia. Konsekwencja do odnotowania, nie poprawka. | — |
| ro | słownik `faza_ruchu`, wzorzec zakazany | `^\s*tracțiun[ei]?\s*$` | poprawka | `^\s*tra[cç]?[țţ]iun[ei]?\s*$` albo prościej `^\s*trac[țţ]iun[ei]?\s*$` | Wzorzec łapie tylko ț (przecinek pod literą). Tekst z ţ (cedylla, częsty w przekładzie maszynowym i starszych klawiaturach) go omija. | niska |
| bg | Podciąganie | Издърпване | do sprawdzenia przez native speakera | „Набиране” (powrót) albo zostaje | Faza dotyczy tylko podciągania na drążku. W bg ten ruch to „набиране (се)”: na siłowni powiedzą „Набиране 1 с · Пауза · Спускане 2 с”. „Издърпване” kojarzy się raczej z przyciąganiem uchwytu (wyciąg, wiosłowanie). To, że „Набиране” jest też nazwą ćwiczenia, nie przeszkadza: ru „Подтягивание” i uk „Підтягування” zostały identyczne z nazwą ćwiczenia. | średnia |
| lv | Podciąganie | Pievilkšana | poprawka (do sprawdzenia przez native speakera) | „Pievilkšanās” (powrót) | Ciało podciąga się samo, a na to łotewski ma formę zwrotną: „pievilkties” → „pievilkšanās”. Forma niezwrotna „pievilkšana” znaczy przyciąganie czegoś do siebie, więc w podciąganiu na drążku brzmi nienaturalnie. Faza siostrzana „Piecelšanās” też jest zwrotna. Tożsamość z nazwą ćwiczenia to nie błąd (por. ru, uk). | średnia |
| ja | Pauza (słownik `faza_pauza`, bez zmiany tekstu) | 一時停止 | do sprawdzenia przez native speakera | 「キープ」 | 一時停止 to słowo przycisku odtwarzacza, takie samo jak w przycisku pod linią (アニメーションを一時停止). To ten sam problem, który zmiana usuwa w cs, sk i de. Na siłowni mówi się „ボトムで2秒キープ”. Pewność `niska` w słowniku jest trafna. | niska |
| ko | Pauza (słownik, bez zmiany) | 일시정지 | do sprawdzenia przez native speakera | „버티기” albo „멈춤” | Jak w ja: to samo słowo co przycisk (애니메이션 일시정지). Trener powie „2초 버티기” albo „멈춤”. | niska |
| vi | Pauza (słownik, bez zmiany) | Tạm dừng | do sprawdzenia przez native speakera | „Giữ” | To samo słowo co przycisk (Tạm dừng hoạt ảnh). W wietnamskim fitnessie zatrzymanie w pozycji to „giữ” („giữ 2 giây”). | niska |
| hu | Pauza (słownik) | Szünet | OK | — | Przerwa to Pihenő, więc się nie myli. Uwaga: ten sam słownik zakazuje „szünet” dla przerwy (znaczy przerwę w pracy), ale jako pauza w tempie jest naturalne. | — |
| fi | Pauza (słownik) | Tauko | OK | — | Przerwa to Palautus. Potocznie „tauko” bywa też przerwą między seriami, ale w linii faz nie ma ryzyka. | — |
| sl | Pauza (słownik) | Premor | OK (pytanie tłumacza zostaje) | — | Przerwa to Počitek, więc się nie myli; uwaga tłumacza („Pavza”) to słuszne pytanie do native speakera. | — |
| tr, el, id, ms, zh-Hant, bg, ru, uk, sr, hr, lt, lv, es, es-419, pt, pt-BR, fr, it, nl, sv, da, nb, en | Pauza (słownik) | wartości z `faza_pauza` | OK | — | Wszystkie zgadzają się z obecnymi tekstami. Przerwa w każdym z tych języków to inne słowo (Dinlenme, Διάλειμμα, Istirahat/Rehat, 休息, Почивка, Отдых, Відпочинок, Одмор, Odmor, Poilsis, Atpūta, Descanso, Repos, Recupero, Rust, Vila, Hvile, Rest). es-419 i pt-BR nie mają nakładki dla tego klucza, więc dziedziczą „Pausa”, co jest poprawne regionalnie. fr bez znaków wymagających spacji. | — |
| wszystkie | słownik `faza_pauza`, wzorce zakazane | `pauz`, `paus`, `pause`, `pozastav`, `întrerup`, `oprire`, `peat`, `anhalt\|angehalten`, `pausa\b`, `på pause` i inne | OK | — | `wykrywaj` `^\s*pauza\s*$` dotyczy tylko kluczy „Pauza” i „pauza”, a „pauza” (status zegara) wyłącza wyjątek `*`. Krótkie rdzenie nie trafią więc w inne teksty. Powody są trafne: K1 dla rdzeni przerwy w cs, sk, ro, et, de; czasownik albo przycisk dla reszty. Wyjątek `*` dla „pauza” jest poprawny, a test sprawdza, że status zegara dalej pilnuje `pauza_treningu`. | — |
| wszystkie | długość i obcięcie | — | OK | — | Linia faz ma `flexWrap`, a każda faza jest osobnym tekstem. Najdłuższe nowe teksty („Tragere în sus 1 s ·”, „Hoidmine ·”) przy powiększonym tekście na 320 pt zawiną się na granicy fazy, a nie w środku słowa. | — |

## Nowe terminy do słownika

- Brak nowych pojęć. Do rozważenia przy następnym przeglądzie: pojęcie „przycisk animacji” (`Zatrzymaj animację`) z zakazem „pauză” w ro, z tego samego powodu co K1 (uwaga ro wyżej).

## Pytania do native speakerów

1. ro: Która nazwa krótkiego zatrzymania w pozycji w linii faz „Tragere în sus 1 s · … · Coborâre 2 s” brzmi naturalniej: „Menținere” czy inna forma rzeczownikowa?
2. et: W linii faz „Langetamine 2 s · … · Surumine 1 s” lepiej brzmi „Hoidmine” czy „Seisak”?
3. bg: Fazę wchodzenia w górę przy podciąganiu na drążku trener nazwie „Набиране” czy „Издърпване”?
4. lv: Fazę podciągania ciała na drążku lepiej nazwać „Pievilkšanās” (zwrotna) czy „Pievilkšana”?
5. ja: Zatrzymanie w pozycji w linii faz lepiej nazwać 「キープ」 czy 「一時停止」?
6. ko: Lepiej „버티기” czy „일시정지”?
7. vi: Lepiej „Giữ” czy „Tạm dừng”?

## Podsumowanie

Przeczytane: 41 tekstów (5 nowych „Pauza”, 3 nowe „Podciąganie”, 33 wpisy `faza_pauza` innych języków/terminy zalecane). Poprawki: 4 (lv „Podciąganie”, bg „Podciąganie” do sprawdzenia, ro przycisk animacji poza zakresem, ro wzorzec ţ). Pytania: 7.
