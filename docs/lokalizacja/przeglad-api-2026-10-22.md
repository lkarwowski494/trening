# Przegląd tłumaczeń przez API — decyzje (22.10.2026)

Wejście: raport przeglądu przez API (model Opus, batch z 22.10.2026, kod `main` 19fac7b; 34 języki × 399 zdań). Raport jest opinią modelu — każda propozycja oceniona osobno (naturalność, zgodność z EN/PL, terminologia z docs/16, spójność ze słownikiem języka). Krytycznych: 0. Kody decyzji: **P** = przyjęte, **I** = zmienione inaczej (własne brzmienie), **O** = odrzucone. Uwagi „niskie” przyjęto tylko oczywiście trafne (literówki, gramatyka, niespójna terminologia), resztę odrzucono zbiorczo. Klucz = polski tekst (skrócony) albo identyfikator wskazówki `lib/cues/text`.

Pierwotna ocena zakresu: *lokalna* (słowniki tłumaczeń; teksty źródłowe PL/EN bez zmian).

## Podsumowanie liczbowe

| język | średnie P / I / O | niskie P / I / O | dodatkowe zmiany spójności |
|---|---|---|---|
| bg | 10 / 0 / 1 | 1 / 0 / 0 | 1 |
| cs | 2 / 0 / 2 | 2 / 0 / 0 | 0 |
| da | 2 / 1 / 0 | 3 / 0 / 0 | 0 |
| de | 0 / 0 / 0 | 2 / 0 / 0 | 0 |
| el | 3 / 0 / 1 | 4 / 1 / 0 | 0 |
| es | 4 / 0 / 0 | 4 / 2 / 0 | 1 |
| es-419 | 5 / 1 / 0 | 2 / 0 / 0 | 0 |
| et | 3 / 0 / 1 | 2 / 0 / 2 | 0 |
| fi | 5 / 0 / 0 | 5 / 0 / 0 | 0 |
| fr | 4 / 0 / 0 | 1 / 0 / 0 | 0 |
| hr | 4 / 0 / 0 | 6 / 0 / 0 | 2 |
| hu | 6 / 0 / 0 | 2 / 1 / 0 | 0 |
| id | 3 / 0 / 0 | 3 / 0 / 0 | 1 |
| it | 4 / 0 / 0 | 2 / 1 / 0 | 1 |
| ja | 2 / 0 / 0 | 1 / 0 / 2 | 0 |
| ko | 3 / 0 / 0 | 3 / 0 / 0 | 1 |
| lt | 4 / 0 / 0 | 2 / 0 / 0 | 0 |
| lv | 2 / 0 / 0 | 5 / 0 / 0 | 0 |
| ms | 2 / 1 / 0 | 2 / 0 / 0 | 0 |
| nb | 1 / 1 / 0 | 5 / 0 / 0 | 0 |
| nl | 1 / 0 / 0 | 2 / 0 / 0 | 2 |
| pt | 4 / 1 / 0 | 1 / 0 / 1 | 3 |
| pt-BR | 3 / 2 / 1 | 2 / 1 / 2 | 0 |
| ro | 2 / 0 / 0 | 3 / 0 / 0 | 0 |
| ru | 2 / 1 / 0 | 2 / 1 / 4 | 0 |
| sk | 4 / 0 / 1 | 10 / 0 / 0 | 2 |
| sl | 7 / 0 / 1 | 2 / 0 / 0 | 0 |
| sr | 8 / 1 / 0 | 2 / 1 / 7 | 0 |
| sv | 4 / 0 / 4 | 4 / 1 / 1 | 0 |
| tr | 3 / 3 / 3 | 1 / 0 / 2 | 0 |
| uk | 1 / 2 / 2 | 8 / 0 / 0 | 0 |
| vi | 2 / 0 / 0 | 4 / 0 / 0 | 0 |
| zh-Hant | 16 / 0 / 0 | 4 / 0 / 0 | 3 |
| **razem** | **126 / 14 / 17** | **102 / 9 / 21** | **17** |

Uwagi dla `es-419` i `pt-BR` dotyczące tekstu dziedziczonego z `es`/`pt` liczą się raz w języku bazowym i raz w wariancie (oznaczone „wspólne z …”); zmiana jest zapisana w jednym pliku.

## Uwagi do tekstu angielskiego (bez zmian — decyzja koordynatora)

Źródło EN nie było zmieniane (zmiana wymaga przeglądu twierdzeń). Uwagi modelu do `lib/i18n.en.ts` (5 średnich, 5 niskich):

1. Zdanie o asekuracji sztangi („safety equipment is recommended — a rack with safety arms, plus a spotter”): „safety equipment” nie obejmuje osoby; propozycja „spotting is recommended”. Dotyczy treści bezpieczeństwa — do decyzji, wymaga wpisu w rejestrze twierdzeń, jeśli zmieniamy.
2. „The app closed unexpectedly during the last launches” — niezgrabne; propozycja „…the last few times it was opened”.
3. „Remove place” / „Remove place: {a} – {b}” (przyciski „Wyczyść miejsce”) — propozycja „Clear place”, bo „Remove” myli się z „Delete place”. Uwaga: PL „Wyczyść” (czyszczenie przypisania) a EN „Remove”; warto sprawdzić spójność z pozostałymi językami, które tłumaczą z PL.
4. Wskazówka `calf.edge`: pominięte „podwyższenie”; propozycja „…on a raised surface, heels hanging off the edge”.
5. (niskie) Prosty apostrof `'` zamiast typograficznego `’` w „We're proud of you!”, „You've trained hard…” i `carry.noLean` (`don't`).
6. (niskie) `bike.foot`: „just behind the toes” nie ma w źródle PL; propozycja „Keep the front part of your foot on the pedal.”
7. (niskie) `lp.hips`: „seat” → „backrest” (PL „oparcie”).

## Uwagi ogólne i otwarte (do decyzji koordynatora / native speakera)

- **Liczba w tekstach z `{n}` dni (limit 5).** Uwagi o „až {n} dní” (cs), „{n} utilisés” (fr) itp. wynikają z odmiany zależnej od liczby. Odrzucono dla cs/bg (n = 5 — jedno miejsce w kodzie, `FREE_TRAINING_DAYS_PER_MONTH`); gdyby limit zmieniono na 2–4, formy słowiańskie trzeba przejrzeć (albo użyć `tp()`).
- **Jednostki w ru (kg/lb/yd).** Model proponuje cyrylicę w etykietach „metryczny/imperialny”; w całej aplikacji symbole jednostek są łacińskie, więc zostawiono (rozjazd z UI). Lokalizacja symboli jednostek byłaby osobną zmianą.
- **Cudzysłowy w sr.** Zapis mieszany (64 × „…”, 37 × „…“); model zgłosił 8 uwag niskich o normalizację — odrzucone (osobna, mechaniczna decyzja).
- **sl, pytania w 1. osobie** (docs/16): „Počitek poteka — obvestiti ob koncu?” bez zmian do czasu decyzji native speakera.
- **ms „Seting” vs iOS „Tetapan”**: ujednolicono według słownika (25 użyć „Seting”); do sprawdzenia przez native speakera zgodność z iOS.
- **uk „домовленість” vs „умовність”** (konwencja): 6 vs 2 użycia; nie normalizowano.
- **Przyjęte z oznaczeniem „do sprawdzenia przez native speakera”:** da (nordic.catch), el (rcrunch.hips „ταλαντεύεις”), hu (carry.walk, „távolságig vagy ideig”), ko („Jesteśmy z Ciebie dumni!” bez zaimka), nb („imperisk”), sr (zdanie o asekuracji — „асистенција”), pt/es (nowe nazewnictwo „position stand”: „tomada de posição”, „posicionamiento”), tr (odrzucone „squat kafesi” — czy „raf” zostaje), uk (nazwy „страхування”, „Голосові підказки”), et („inglise” vs „imperiaalne”).
- **Terminologia „position stand”** ujednolicona w zdaniach z ACSM: bg „становище”, es/es-419 „posicionamiento”, pt „tomada de posição”, pt-BR „posicionamento”, id „pernyataan sikap”, it „position stand”, ko „입장문”, nb „posisjonserklæring”. Języki, których model nie flagował (np. cs, sk), bez zmian.

## Decyzje szczegółowe (średnie i przyjęte/zmienione niskie)

### bg

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Progresja: gdy zrobisz górę zakresu … | śr. | P | „становище” to utarty odpowiednik „position stand”; ujednolicono też w dwóch pozostałych zdaniach z ACSM |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | jak wyżej |
| Trenuj {n} dni w miesiącu za darmo. … | śr. | O | słownik konsekwentnie używa „откажете/откажи” dla subskrypcji; zmiana rozbiłaby spójność |
| Usuń plan | śr. | P | spójnie z resztą przycisków usuwania („Изтриване на…”); to samo w „Usuń plan: {name}” i „Usuń pomiar” |
| Wyczyść miejsce | śr. | P | spójnie z „Премахване на диска” itd. |
| Wyczyść miejsce: {a} – {b} | śr. | P | jak wyżej |
| cu.grip | śr. | P | czasownik zamiast rzeczownika |
| llc.hips | śr. | P | ławka = пейка |
| nordic.catch | śr. | P | jaśniej oddaje „hamować” |
| npu.hang | śr. | P | czasownik zamiast rzeczownika |
| pu.grip | śr. | P | czasownik zamiast rzeczownika |
| rear.arms | nis. | P | dłonie, nie nadgarstki |
| Kreska w „Ten tydzień” i w Postępach… | — | P (spójność) | spójnie z przyjętą zmianą |

### cs

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Bez zakupu: do {n} dni treningowych … | śr. | O | {n} = 5 (jedno miejsce w kodzie): „až 5 tréninkových dní” jest poprawne; uwaga o n=2–4 teoretyczna |
| Dotknij etykiety serii, by zmienić t… | śr. | P | spójnie z „přejetím doleva” w innych zdaniach |
| Trenuj {n} dni w miesiącu za darmo. … | śr. | O | jak wyżej (n = 5) |
| dbp.setup | śr. | P | dokładniej: hantle przy bokach klatki |
| Zapowiedzi działają, gdy włączony je… | nis. | P | zgoda rodzaju (Zvuk – zapnutý) |
| bike.foot | nis. | P | bez dodatku spoza źródła; termin jak w innych wskazówkach |

### da

| klucz | waga | decyzja | powód |
|---|---|---|---|
| {left} {n} z {limit} darmowych dni t… | śr. | P | naturalny szyk |
| Na koniec „Zakończ” w nagłówku (albo… | śr. | P | dodany czasownik |
| nordic.catch | śr. | I | „tag fra” znaczy „odbij się”, „grib fat” – „chwyć”; sens to „podeprzyj się dłońmi” (do sprawdzenia przez native speakera) |
| {app} tworzy niezależny deweloper: b… | nis. | P | naturalniejsze |
| Dotknij etykiety serii, by zmienić t… | nis. | P | cudzysłowy jak w reszcie słownika |
| Gumy usuniesz po „Edytuj” w nagłówku… | nis. | P | jednoznaczniej |

### de

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Pomiary masy ciała („Masa ciała — po… | nis. | P | poprawne złożenie z -s- |
| lp.hips | nis. | P | „Lehne” jak w lp.setup |

### el

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Dotknij etykiety serii, by zmienić t… | śr. | P | rejestr grzecznościowy jak w reszcie ekranów |
| Powiadamiaj | śr. | O | EN „Notify me” – forma „Ειδοποίησέ με” zgodna ze źródłem |
| Rozgrzewki: {d} z {n} zrobione | śr. | P | zgoda liczby; serie rozgrzewkowe |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | spójnie z „μυϊκή ομάδα” |
| Serie: {d} z {n} zrobione | nis. | P | zgoda liczby |
| Zapowiedzi działają, gdy włączony je… | nis. | P | poprawny rodzaj |
| cfly.move | nis. | P | jaśniej |
| rcrunch.hips | nis. | I | „αιωρώ” = zawiesić; dla „wymachiwać” trafniejsze „ταλαντεύω” (do sprawdzenia przez native speakera) |
| rear.move | nis. | P | ramiona opuszcza się, nie całe ciało |

### es

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Asekuracja | śr. | P | unika anglicyzmu, spójnie z pt („Auxílio e segurança”); dotyczy też es-419 |
| Progresja: gdy zrobisz górę zakresu … | śr. | P | „posicionamiento” = position stand; ujednolicono też w zdaniu „Kreska w…” |
| Rozgrzewki: {d} z {n} zrobione | śr. | P | zgoda rodzaju |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | jak wyżej |
| Ćwiczenie ze sztangą na tułowiu lub … | nis. | P | jak w nagłówku; „persona que te asista” |
| Na koniec „Zakończ” w nagłówku (albo… | nis. | P | dodany czasownik |
| bp.grip | nis. | I | „más abierta” odnosiło się do sztangi; krótszy zapis niż propozycja |
| cgbp.grip | nis. | P | jak wyżej |
| curl.cableSetup | nis. | P | powtórzenie |
| pu.grip | nis. | I | jak w bp.grip |
| Kreska w „Ten tydzień” i w Postępach… | — | P (spójność) | spójnie z przyjętą zmianą |

### es-419

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Ćwiczenie ze sztangą na tułowiu lub … | śr. | P (wspólne) | wspólne z es (tekst dziedziczony): wspólne z es (tekst dziedziczony); bez „(spotter)”, spójnie z es |
| Progresja: gdy zrobisz górę zakresu … | śr. | P (wspólne) | wspólne z es (tekst dziedziczony): wspólne z es |
| Rozgrzewki: {d} z {n} zrobione | śr. | P (wspólne) | wspólne z es (tekst dziedziczony): wspólne z es |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P (wspólne) | wspólne z es (tekst dziedziczony): wspólne z es |
| Stuknij liczbę na tablicy i wpisz ci… | śr. | P | zmiana w bazie es – dotyczy obu |
| W tym miesiącu ciężko trenujesz i wy… | śr. | I | pretérito naturalny w es-419; es (Hiszpania) bez zmian |
| Przerwa. Pozostały czas: {t}. Cała p… | nis. | P | zmiana w bazie es |
| curl.cableSetup | nis. | P (wspólne) | wspólne z es (tekst dziedziczony): wspólne z es (inna wersja: „Sujeta”) |

### et

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Ćwiczenie ze sztangą na tułowiu lub … | śr. | P | „kehatüvi” jak w całej aplikacji |
| Stuknij liczbę na tablicy i wpisz ci… | śr. | P | naturalniej |
| bss.setup | śr. | O | „pöid” jest poprawne (grzbiet stopy); proponowane „pöia pealne” niegramatyczne |
| kb.move | śr. | P | kettlebell się unosi, nie leci |
| imperialny (lb, mi, yd) | nis. | O | „inglise” to potoczna nazwa miar anglosaskich; brak pewności co do „imperiaalne” (do sprawdzenia przez native speakera) |
| lista serii przewijana | nis. | P | naturalniej |
| Tygodnie treningu z rzędu bez deload… | nis. | P | jeden termin na deload |
| mis.jerk | nis. | O | oba warianty poprawne |

### fi

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Automatyczna kopia po każdym trening… | śr. | P | iOS fi: Tiedostot → Omassa iPhonessa |
| Krok zmiany (np. +2,5 kg) to konwenc… | śr. | P | „konventio” jak w pozostałych zdaniach |
| Stuknij liczbę na tablicy i wpisz ci… | śr. | P | naturalniej |
| nordic.catch | śr. | P | naturalniejsze |
| rcrunch.move | śr. | P | „Kierrä” = obróć; ruch to zwijanie |
| Ćwiczenie ze sztangą na tułowiu lub … | nis. | P | literówka |
| Gumy usuniesz po „Edytuj” w nagłówku… | nis. | P | spójnie z „näkymä” |
| Miejsce usuniesz przyciskiem „Usuń m… | nis. | P | spójnie z „näkymä” |
| Stanowisko ACSM 2026: przy co najmni… | nis. | P | szyk i „volyymi” jak w innych zdaniach |
| bdip.range | nis. | P | partitiivi po „käyttää” |

### fr

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Darmowe dni treningowe w tym miesiąc… | śr. | P | uzgodnienie przy n = 0 i 1 |
| Plan zmieniony w {day} — wcześniejsz… | śr. | P | „programme” jak w „Supprimer le programme” |
| Rozgrzewki: {d} z {n} zrobione | śr. | P | liczba mnoga i uzgodnienie |
| Serie: {d} z {n} zrobione | śr. | P | uzgodnienie przy d = 0 i 1 |
| Na koniec „Zakończ” w nagłówku (albo… | nis. | P | dodany czasownik, „en-tête” jak gdzie indziej |

### hr

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Rozgrzewki: {d} z {n} zrobione | śr. | P | jednoznaczne |
| Serie: {d} z {n} zrobione | śr. | P | jednoznaczne |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „mišićna skupina” jak w innych zdaniach |
| Zapowiedzi działają, gdy włączony je… | śr. | P | poprawny rodzaj |
| {left} {n} z {limit} darmowych dni t… | nis. | P | standard |
| Darmowe dni treningowe w tym miesiąc… | nis. | P | standard |
| Progresja: gdy zrobisz górę zakresu … | nis. | P | dodano „raspon” |
| Usuń plan | nis. | P | spójnie z „Obriši”; zmieniono też „Izbriši plan: {name}” i „Izbriši mjerenje” |
| db.move | nis. | P | powtórzenie czasownika |
| pallof.move | nis. | P | gramatyka |
| Usuń plan: {name} | — | P (spójność) | spójnie z „Obriši plan” |
| Usuń pomiar: {v}, {d} | — | P (spójność) | spójnie z „Obriši” |

### hu

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Asekuracja | śr. | P | jeden termin „biztosítás” jak w zdaniu o sztandze |
| {app} tworzy niezależny deweloper: b… | śr. | P | „eddzen” – poprawna forma grzecznościowa |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „izomcsoport” jak w innych zdaniach |
| Trenuj {n} dni w miesiącu za darmo. … | śr. | P | jak wyżej |
| W tym miesiącu ciężko trenujesz i wy… | śr. | P | czas przeszły (EN: „You’ve trained…”) |
| bp.control | śr. | P | „visszapattanni” = odbijać |
| bss.setup | nis. | P | nienaturalne „az első talp elöl” |
| carry.walk | nis. | I | paralelna konstrukcja -ig/-ig (do sprawdzenia przez native speakera) |
| scr.control | nis. | P | podmiot jak w źródle |

### id

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Nazwa pod ikoną i opis zgody Zdrowia… | śr. | P | „Anda” – jak w reszcie słownika (82 vs 3 „kamu”) |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „Pernyataan sikap” = position stand; ujednolicono w pozostałych zdaniach z ACSM |
| Kreska w „Ten tydzień” i w Postępach… | — | P (spójność) | spójnie z przyjętą zmianą |
| bj.setup | śr. | P | naturalniej |
| Gumy usuniesz po „Edytuj” w nagłówku… | nis. | P | jednoznacznie |
| Przerwa. Pozostały czas: {t}. Cała p… | nis. | P | jednoznaczne w VoiceOver |
| row1.noTwist | nis. | P | zachowuje sens „podrzucić” |

### it

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Na koniec „Zakończ” w nagłówku (albo… | śr. | P | dodany czasownik |
| Progresja: gdy zrobisz górę zakresu … | śr. | P | „position stand” jak w zdaniu o ACSM, „incremento” jak w zdaniu o kroku |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | spójnie; „fa crescere i muscoli” |
| Kreska w „Ten tydzień” i w Postępach… | — | P (spójność) | spójnie z przyjętą zmianą |
| lp.noLock | śr. | P | zachowano „w przeproście” |
| Dotknij etykiety serii, by zmienić t… | nis. | P | cudzysłowy «» jak w reszcie słownika |
| W tym miesiącu ciężko trenujesz i wy… | nis. | I | czas dokonany z propozycji wymusza rodzaj (allenato/a); wersja bez rodzaju |
| sq.depth | nis. | P | naturalniej |

### ja

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Każda główna partia co najmniej {n} … | śr. | P | „ボリューム” jak w innych tekstach |
| Krok zmiany (np. +2,5 kg) to konwenc… | śr. | P | „慣例” jak w innych tekstach |
| Progresja: gdy zrobisz górę zakresu … | nis. | P | nazwa ekranu „プログレッション” |
| Rozgrzewki: {d} z {n} zrobione | nis. | O | „件” to ogólny licznik, zrozumiały; odrzucone jako subiektywne |
| Serie: {d} z {n} zrobione | nis. | O | jak wyżej |

### ko

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Jesteśmy z Ciebie dumni! | śr. | P | brak zaimka „당신” w reszcie aplikacji (do sprawdzenia przez native speakera) |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „입장문” jak w zdaniu o progresji; ujednolicono też w zdaniu „Kreska…” |
| Kreska w „Ten tydzień” i w Postępach… | — | P (spójność) | spójnie z przyjętą zmianą |
| W tym miesiącu ciężko trenujesz i wy… | śr. | P | jednolity rejestr -습니다 |
| Ćwiczenie ze sztangą na tułowiu lub … | nis. | P | sprzęt i osoba |
| Progresja: gdy zrobisz górę zakresu … | nis. | P | naturalny szyk |
| erg.recovery | nis. | P | poprawna forma |

### lt

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Na koniec „Zakończ” w nagłówku (albo… | śr. | P | dodany czasownik |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „raumenų grupei” jak w innych zdaniach |
| Zapowiedzi działają, gdy włączony je… | śr. | P | poprawny rodzaj |
| push.rigid | śr. | P | naturalniej |
| lp.hips | nis. | P | oparcie = atlošas |
| wall.breath | nis. | P | utarte wyrażenie |

### lv

| klucz | waga | decyzja | powód |
|---|---|---|---|
| erg.drive | śr. | P | „Vilkums” – termin spójny z resztą cues (scr.chest); „Vēziens” = zamach |
| erg.finish | śr. | P | jak wyżej |
| Każda główna partia co najmniej {n} … | nis. | P | jaśniej „tiek ieskaitīta kā” |
| Na koniec „Zakończ” w nagłówku (albo… | nis. | P | dodany czasownik |
| db.back | nis. | P | wskazuje, co ma się nie wyginać |
| pallof.noTwist | nis. | P | „trose” = linka, jak w innych wskazówkach |
| pallof.setup | nis. | P | „trīsis” = wyciąg, „trose” = linka, jak w innych wskazówkach |

### ms

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Gumy usuniesz po „Edytuj” w nagłówku… | śr. | I | „getah” to termin używany w całym słowniku dla gum; zmieniono tylko „skrinnya” |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „volum” jak w innych zdaniach |
| Zapowiedzi działają, gdy włączony je… | śr. | P | „Seting” jak w pozostałych tekstach (25 vs 3); iOS ms używa „Tetapan” – do sprawdzenia przez native speakera |
| lista serii przewijana | nis. | P | standardowy termin „tatal” |
| Przerwa. Pozostały czas: {t}. Cała p… | nis. | P | jednoznaczne w VoiceOver |

### nb

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Gumy usuniesz po „Edytuj” w nagłówku… | śr. | I | „skjermen deres” dwuznaczne; sformułowanie bliższe nazwie ekranu „Strikker” |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „posisjonserklæring” jak w innym zdaniu |
| imperialny (lb, mi, yd) | nis. | P | „imperisk” – naturalna forma przymiotnika (do sprawdzenia przez native speakera) |
| Trening to część mojego tygodnia | nis. | P | „uken min” jak w reszcie słownika |
| mcp.blades | nis. | P | jednoznaczne |
| stepup.knee | nis. | P | naturalniej |
| wall.setup | nis. | P | naturalniej |

### nl

| klucz | waga | decyzja | powód |
|---|---|---|---|
| cfly.move | śr. | P | dokładniej oddaje „do rozłożenia rąk” |
| Dotknij etykiety serii, by zmienić t… | nis. | P | pojedyncze cudzysłowy ‘ ’ jak w większości słownika |
| Usuń plan | nis. | P | tryb rozkazujący „Verwijder …” jak w pozostałych przyciskach; to samo w „Usuń plan: {name}” i „Usuń pomiar” |
| Usuń plan: {name} | — | P (spójność) | spójnie z „Verwijder plan” |
| Usuń pomiar: {v}, {d} | — | P (spójność) | spójnie z „Verwijder …” |

### pt

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Płacisz raz i masz na zawsze. | śr. | I | propozycja z „ele” bez odniesienia; wersja z „acesso” |
| Progresja: gdy zrobisz górę zakresu … | śr. | P | „tomadas de posição” = position stand; „incremento” jak w zdaniu o kroku |
| Rozgrzewki: {d} z {n} zrobione | śr. | P | zgoda liczby; serie rozgrzewkowe |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | jak wyżej |
| Usuń plan | śr. | P | „Apagar” jak w pozostałych przyciskach; to samo w „Usuń plan: {name}” i „Usuń pomiar” |
| Usuń plan: {name} | — | P (spójność) | spójnie z „Apagar plano” |
| Usuń pomiar: {v}, {d} | — | P (spójność) | spójnie z „Apagar …” |
| + {n} {w} | nis. | O | „+ mais N” brzmi w pt naturalnie; „+ {n} {w}” jest identyczne z kluczem PL (test macierzy zabrania) |
| lat.elbows | nis. | P | kalka z angielskiego |
| Kreska w „Ten tydzień” i w Postępach… | — | P (spójność) | spójnie z przyjętą zmianą |

### pt-BR

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Ćwiczenie ze sztangą na tułowiu lub … | śr. | O | wspólny tekst z pt; „segurança” jest wyjaśnione po myślniku (rack i osoba), spójnie z nagłówkiem |
| Płacisz raz i masz na zawsze. | śr. | P | dwuznaczne „fica para sempre” |
| Progresja: gdy zrobisz górę zakresu … | śr. | P | „posicionamento” (pt-BR) i „incremento” |
| Rozgrzewki: {d} z {n} zrobione | śr. | P (wspólne) | wspólne z pt (tekst dziedziczony): wspólne z pt (zmiana w bazie) |
| Stanowisko ACSM 2026: przy co najmni… | śr. | I | wariant brazylijski „posicionamento” (nadpisanie); „promove” zamiast „dá” |
| + {n} {w} | nis. | O | jak w pt |
| Dotknij etykiety serii, by zmienić t… | nis. | I | „tira ele” zbyt potoczne; zachowano «» (zapis przeważający) |
| Menu ⋯ w nagłówku: „Pauza treningu” … | nis. | O | «» to przeważający zapis w słowniku pt/pt-BR (62 vs 19 w nakładce); uwaga nietrafna |
| Na koniec „Zakończ” w nagłówku (albo… | nis. | P | dodany czasownik |
| lat.elbows | nis. | P | jasne „conduzindo o movimento” |
| Kreska w „Ten tydzień” i w Postępach… | — | I | wariant brazylijski „posicionamento” (nadpisanie) |

### ro

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Asekuracja | śr. | P | unika anglicyzmu, spójnie z „asigurarea” w zdaniu; dotyczy tylko nagłówka |
| Progresja: gdy zrobisz górę zakresu … | śr. | P | rejestr grzecznościowy dla tekstu poza wskazówkami |
| Na koniec „Zakończ” w nagłówku (albo… | nis. | P | dodany czasownik |
| Propozycja według Twoich założeń — p… | nis. | P | naturalniej niż „ipotezele” |
| lpd.pull | nis. | P | „przed twarzą” |

### ru

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Płacisz co miesiąc i kończysz, kiedy… | śr. | P | naturalniej |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | poprawny rząd |
| Zapowiedzi działają, gdy włączony je… | śr. | I | słownik nazywa funkcję „Голосовые подсказки”; zmieniono tylko rodzaj (включён) |
| {n} yd | nis. | O | „ярд” jest oznaczeniem jednostki w rosyjskim (jak „км”, „м”); zapis bez kropki |
| imperialny (lb, mi, yd) | nis. | O | etykiety odpowiadają symbolom jednostek wyświetlanym w aplikacji (kg/lb/yd); zmiana rozjechałaby się z UI – sprawa ogólna, do decyzji koordynatora |
| Krok zmiany (np. +2,5 kg) to konwenc… | nis. | O | jak wyżej (w całej aplikacji jednostki są łacińskie) |
| metryczny (kg, km, m) | nis. | O | jak wyżej |
| Na koniec „Zakończ” w nagłówku (albo… | nis. | P | „тренировка” zamiast „сессия” |
| Progresja: gdy zrobisz górę zakresu … | nis. | P | naturalna kolokacja |
| rcrunch.hips | nis. | I | „не делай махов” rzadkie; „маховых движений” naturalniejsze |

### sk

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Usuń ćwiczenie | śr. | P | „Vymazať” – tak w pozostałych przyciskach; zmieniono też wariant „: {name}” |
| Usuń ćwiczenie: {name} | — | P (spójność) | spójnie z „Vymazať cvik” |
| Usuń plan | śr. | P | spójnie z „Vymazať” |
| Usuń plan: {name} | — | P (spójność) | spójnie z „Vymazať plán” |
| Usuń serię | śr. | P | spójnie z „Vymazať sériu {n}” |
| z {s} | śr. | O | tekst „z {s}” jest identyczny z kluczem PL (test macierzy zabrania); „celkom” = „łącznie” jak w cs/et – znaczenie akceptowalne |
| Zapowiedzi działają, gdy włączony je… | śr. | P | zgoda rodzaju |
| Aplikacja zamknęła się nieoczekiwani… | nis. | P | „ukončila” jak w iOS |
| Rozgrzewki: {d} z {n} zrobione | nis. | P | licznik dotyczy serii rozgrzewkowych |
| bj.move | nis. | P | naturalniej niż „podrepni” |
| bp.mis.arch | nis. | P | nominalny opis błędu, „sedacie svaly” jak w innych zdaniach |
| cpress.base | nis. | P | „spevni brucho” jak w innych zdaniach |
| curl.mis.elbows | nis. | P | opisy błędów są nominalne |
| ibp.setup | nis. | P | „sedacie svaly” jak w innych zdaniach |
| llc.move | nis. | P | jak wyżej |
| mis.barAway | nis. | P | opisy błędów są opisowe, nie w 2. osobie |
| wall.setup | nis. | P | literówka „Oprí” |

### sl

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Krok zmiany (np. +2,5 kg) to konwenc… | śr. | P | „konvencija” jak w innych tekstach |
| Na koniec „Zakończ” w nagłówku (albo… | śr. | P | dodany czasownik |
| Przerwa trwa — powiadomić na koniec? | śr. | O | forma pytania w sl jest otwarta (docs/16 – „Izbrišem vajo?” vs „Želite…?”); bez rozstrzygnięcia native speakera nie zmieniamy |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „volumen” jak w 12 innych tekstach |
| W tym miesiącu ciężko trenujesz i wy… | śr. | P | czas przeszły |
| Zapowiedzi działają, gdy włączony je… | śr. | P | zgoda rodzaju |
| curl.mis.elbows | śr. | P | opisy błędów są nominalne |
| mis.barAway | śr. | P | jak wyżej |
| Dotknij etykiety serii, by zmienić t… | nis. | P | »« przeważa w słowniku (72 vs 30) |
| Rozgrzewki: {d} z {n} zrobione | nis. | P | serie rozgrzewkowe |

### sr

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Ćwiczenie ze sztangą na tułowiu lub … | śr. | I | spójnie z nagłówkiem „Асистенција и безбедност” (do sprawdzenia przez native speakera) |
| „Archiwizuj” w podglądzie chowa szab… | śr. | P | „можете га обрисати” (cudzysłowy bez zmian) |
| Nie masz szablonów z ćwiczeniami. Ut… | śr. | P | dopełniacz po przeczeniu (cudzysłowy bez zmian) |
| Plan zmieniony w {day} — wcześniejsz… | śr. | P | „ранији” = wcześniejszy |
| Płacisz co miesiąc i kończysz, kiedy… | śr. | P | naturalniej w kontekście subskrypcji |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „мишићна група”, „волумен” jak w innych tekstach |
| Trenuj {n} dni w miesiącu za darmo. … | śr. | P | składnia; „Apple ID” jak w źródle |
| W tym miesiącu ciężko trenujesz i wy… | śr. | P | czas dokonany |
| pallof.move | śr. | P | poprawne znaczenie „aż do” |
| Gumy usuniesz po „Edytuj” w nagłówku… | nis. | O | typografia cudzysłowów w sr jest mieszana (64 ” vs 37 “); normalizacja do osobnej decyzji |
| Menu ⋯ w nagłówku: „Pauza treningu” … | nis. | O | jak wyżej |
| Miejsce usuniesz przyciskiem „Usuń m… | nis. | O | jak wyżej |
| Na koniec „Zakończ” w nagłówku (albo… | nis. | I | dodany czasownik; cudzysłowy bez zmian |
| Pomiary masy ciała („Masa ciała — po… | nis. | O | jak wyżej |
| Stuknij liczbę na tablicy i wpisz ci… | nis. | O | jak wyżej |
| Więcej → Ustawienia: „Dźwięk na koni… | nis. | O | jak wyżej |
| Zapowiedzi działają, gdy włączony je… | nis. | O | jak wyżej |
| curl.mis.elbows | nis. | P | opisy błędów są nominalne |
| mis.barAway | nis. | P | jak wyżej |

### sv

| klucz | waga | decyzja | powód |
|---|---|---|---|
| {left} {n} z {limit} darmowych dni t… | śr. | P | naturalny szyk |
| Bez zakupu: do {n} dni treningowych … | śr. | P | „säkerhetskopia” jak w innych tekstach |
| Dotknij etykiety serii, by zmienić t… | śr. | O | „reps” przeważa w słowniku (5 vs 3); oba poprawne |
| Nie masz szablonów z ćwiczeniami. Ut… | śr. | O | zdanie zgodne z etykietą przycisku „Skapa mallar och plan”; propozycja rozjechałaby się z UI |
| Tygodnie treningu z rzędu bez deload… | śr. | P | poprawna składnia |
| Usuń ćwiczenie | śr. | O | „Ta bort” (usunięcie z listy/edytora) i „Radera” (usunięcie danych) są używane świadomie |
| Usuń serię | śr. | O | jak wyżej |
| kb.move | śr. | P | wyprost bioder, nie zgięcie |
| {app} tworzy niezależny deweloper: b… | nis. | P | idiomatyczniej |
| Gumy usuniesz po „Edytuj” w nagłówku… | nis. | I | jednoznaczne odniesienie do ekranu gum |
| Menu ⋯ w nagłówku: „Pauza treningu” … | nis. | O | „längden” oddaje „czas trwania”; propozycja „passets tid” gorsza |
| Plan zmieniony w {day} — wcześniejsz… | nis. | P | czas przeszły |
| Zmniejsz powtórzenia o 1 | nis. | P | spójnie z sąsiednimi etykietami |
| Zwiększ powtórzenia o 1 | nis. | P | jak wyżej |

### tr

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Asekuracja | śr. | I | jednoznaczne: osoba asekurująca i zabezpieczenia; bez anglicyzmu w nawiasie |
| Ćwiczenie ze sztangą na tułowiu lub … | śr. | I | poprawiono powtórzenie „hareket… hareket”; „raf” zostaje |
| bez asekuracji w stojakach | śr. | O | „raf” jest powszechnym określeniem stojaka w tureckich siłowniach; zmiana na „squat kafesi” (do sprawdzenia przez native speakera) |
| „Archiwizuj” w podglądzie chowa szab… | śr. | P | „onay istenir” zamiast trybu rozkazującego |
| Progresja: gdy zrobisz górę zakresu … | śr. | O | „gelenek” użyte w 5 tekstach, „yaygın uygulama” w żadnym; uwaga nietrafna |
| Propozycja według Twoich założeń — p… | śr. | O | jak wyżej |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „kas grubu” jak w innych zdaniach |
| W tym miesiącu ciężko trenujesz i wy… | śr. | P | „Aferin” brzmi protekcjonalnie |
| Zapowiedzi działają, gdy włączony je… | śr. | I | słownik nazywa funkcję „Sesli bildirimler”; zmieniono „Bildirimler” (powiadomienia) |
| Gumy usuniesz po „Edytuj” w nagłówku… | nis. | P | jednoznaczne odniesienie do ekranu gum |
| ohp.bbSetup | nis. | O | jak przy zdaniu 2 (raf) |
| sq.bar | nis. | O | jak przy zdaniu 2 (raf) |

### uk

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Asekuracja | śr. | O | „страхування” spójne z „страхувальні упори” w słowniku; propozycja „страховка” potoczna (do sprawdzenia przez native speakera) |
| Progresja: gdy zrobisz górę zakresu … | śr. | I | dodano „діапазону”; „домовленість” zostaje (6 użyć vs 2 „умовність”) |
| Propozycja według Twoich założeń — p… | śr. | O | „домовленість” przeważa w słowniku (6 vs 2); normalizacja terminu to decyzja dla native speakera |
| Stanowisko ACSM 2026: przy co najmni… | śr. | P | „м’язова група” jak w innych zdaniach |
| Zapowiedzi działają, gdy włączony je… | śr. | I | słownik nazywa funkcję „Голосові підказки”; etykieta ustawienia zmieniona razem z pozycjami 6 i 9 |
| {app} tworzy niezależny deweloper: b… | nis. | P | zgoda rodzaju |
| Dźwięk na koniec przerwy | nis. | P | eufonia |
| Przerwa. Pozostały czas: {t}. Cała p… | nis. | P | naturalniej, odniesienie do przerwy |
| Rozgrzewki: {d} z {n} zrobione | nis. | P | serie rozgrzewkowe |
| Więcej → Ustawienia: „Dźwięk na koni… | nis. | P | spójnie z etykietą ustawienia |
| dl.grip | nis. | P | brak rzeczownika |
| push.rigid | nis. | P | spójna konstrukcja bezosobowa |
| sq.depth | nis. | P | naturalniej |

### vi

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Gumy usuniesz po „Edytuj” w nagłówku… | śr. | P | nazwany ekran i forma czynna |
| dl.grip | śr. | P | zrozumiały opis chwytu mieszanego |
| calf.edge | nis. | P | naturalniej |
| calf.step | nis. | P | spójnie z calf.edge |
| llc.hips | nis. | P | uzupełniono „do ławki” |
| walk.rails | nis. | P | naturalniejszy zwrot |

### zh-Hant

| klucz | waga | decyzja | powód |
|---|---|---|---|
| Plan zmieniony w {day} — wcześniejsz… | śr. | P | jednoznaczne „依先前的計畫” |
| Zmniejsz powtórzenia o 1 | śr. | P | spójnie z „重量減少 {n}” |
| Zwiększ powtórzenia o 1 | śr. | P | spójnie z „重量增加 {n}” |
| bd.range | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| bext.noArch | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| bp.mis.arch | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| db.back | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| gb.noArch | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| hinge.back | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| ht.mis.arch | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| ht.rigid | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| llc.hips | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| lp.hips | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| mis.roundBack | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| plank.mis.sag | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| rt.back | śr. | P | jednoznaczny termin: 反弓 = przeprost lędźwi, 圓背 = zaokrąglenie pleców |
| Dane w telefonie nie zostały zmienio… | nis. | P | pauza „ — ” ze spacjami przeważa w słowniku (129 vs 11) |
| Usuń z biblioteki | nis. | P | „動作庫” = biblioteka ćwiczeń; ujednolicono też trzy pokrewne teksty |
| Usuń z biblioteki: {name} | — | P (spójność) | spójnie z „從動作庫刪除” |
| Dawne nazwy w bibliotece | — | P (spójność) | „資料庫” = baza danych |
| Nazwy ćwiczeń z biblioteki są po ang… | — | P (spójność) | „資料庫” = baza danych |
| calf.edge | nis. | P | uzupełniono „na podwyższeniu” |
| nordic.setup | nis. | P | „滾輪” = kółka; chodzi o wałki/poduszki |

