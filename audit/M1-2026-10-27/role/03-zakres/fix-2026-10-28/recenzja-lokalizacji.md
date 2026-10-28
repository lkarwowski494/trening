# Recenzja lokalizacji — „Zobacz plany Pro” i podpisy zrzutów App Store (28.10.2026)

Rola: recenzent-lokalizacji. Gałąź: naprawy/M2-koordynator-napraw-2026-10-27-p3. Niczego nie poprawiano; poprawki wprowadza `tlumacz`.

## 1. Klucz „Zobacz plany Pro” (33 słowniki + nakładki)

Wynik: **bez poprawek.** We wszystkich 32 słownikach tekst jest identyczny z istniejącą etykietą „Zobacz plany Pro ›” bez strzałki
(np. de „Pro-Pläne ansehen”, fr „Voir les formules Pro”, ja „Pro プランを見る”). pt-BR ma własny wpis („Ver planos Pro”, zgodny z „Ver planos Pro ›”);
es-419 nie ma wpisu w nakładce i dziedziczy es „Ver planes Pro” — poprawne dla Ameryki Łacińskiej. Długość mieści się w wierszu Ustawień (najdłuższy: hu 27 zn.).
Uwaga poboczna (bez zmiany tutaj, bo łamałaby zgodność z etykietą ›): et „Pro pakette” — w estońskim zwykle z łącznikiem „Pro-pakette”; zmieniać tylko razem w obu kluczach.

## 2. Podpisy zrzutów (store/screenshot-captions.json, 27 języków × 9)

Kontrola automatyczna: limit 40 znaków — wszystkie mieszczą się; terminy zakazane ze słownika — brak trafień (skrypt na `slownik-terminow.json`);
`npx jest tests/slownik-terminow.test.ts` — 109/109 zielone; fr spacja nierozdzielająca przed „?” jest (U+00A0); nazwy funkcji zgodne z aplikacją
(Strażnik progresji, Szablony, Plan tygodnia w każdym języku); brak nazw innych aplikacji, cen i twierdzeń merytorycznych.

| Język | Podpis | Obecnie | Proponowane | Powód | Pewność |
|---|---|---|---|---|---|
| it | historia | Tutta la cronologia, senza account e ads | Cronologia senza account né pubblicità | (b) angielskie „ads” zamiast „pubblicità” (aplikacja używa „pubblicità”); po „senza” — „né”; 38 zn. | wysoka |
| ru | szablony | Готовые шаблоны или ваши собственные | Готовые шаблоны или свои | (b) „ваши собственные” ciężkie; „свои” — jak mówi się na siłowni; 24 zn. | wysoka |
| ru | plan | План на неделю — сами или с помощью | План на неделю — сами или с нашей помощью | (b) „с помощью” urwane (czyją?); 40 zn. — na limicie, alternatywa „План недели — сами или с нашей помощью” (38) | wysoka |
| fi | plan | Viikkosuunnitelma itse tai avullamme | Viikkosuunnitelma: itse tai avullamme | (d) brak separatora — czyta się jak jedno zdanie bez sensu; 37 zn. | wysoka |
| ro | trening | Antrenamentele rămân pe telefonul dvs. | Antrenamentele rămân în telefon | (b) skrót „dvs.” w haśle reklamowym brzmi urzędowo; bez zaimka rejestr formalny zostaje; 31 zn. | średnia |
| ro | straznik | Paznic de progres pentru săptămâna dvs. | Paznicul de progres îți urmărește săptămâna → raczej: Paznicul de progres urmărește săptămâna | (b) j.w. „dvs.”, brak czasownika; wersja bez zaimka (37 zn.) zachowuje rejestr | średnia |
| ro | szablony | Șabloane gata făcute sau ale dvs. | Șabloane gata făcute sau proprii | (b) j.w.; 32 zn. | średnia |
| hr | szablony | Gotovi predlošci ili vaši vlastiti | Gotovi predlošci ili vlastiti | (b) „vaši vlastiti” — podwojenie; 29 zn. | średnia |
| tr | szablony | Hazır şablonlar ya da kendinizinkiler | Hazır ya da kendi şablonlarınız | (b) „kendinizinkiler” ciężkie, nienaturalne w haśle; 31 zn. | średnia |
| vi | straznik | Giám sát tiến bộ theo dõi tuần của bạn | Giám sát tiến bộ cho tuần của bạn | (b) „giám sát … theo dõi” = „monitor monitoruje” (tautologia); 33 zn. | średnia |
| fr | postepy-cwiczenia | Chaque record et progrès en graphique | Records et progrès sur un graphique | (b) „en graphique” niezręczne; 35 zn. | średnia |
| de | import | Verlauf aus anderem Tagebuch übernehmen | Verlauf aus einer anderen App übernehmen | (b) samo „Tagebuch” = pamiętnik; po niemiecku „Trainingstagebuch” albo „App”; 39 zn.; bez nazw aplikacji | średnia |
| ko | import | 다른 운동 기록에서 가져오기 | 다른 앱의 운동 기록 가져오기 | (b) „z innych zapisów treningu” niejasne skąd; „앱” używane w aplikacji (40×); 14 zn. | średnia |
| es, es-419 | plan | Plan semanal, solo o con nuestra ayuda | Plan semanal: por tu cuenta o con ayuda | (b) „solo” dwuznaczne (sam / tylko); 39 zn. | do sprawdzenia przez native speakera |
| de | plan | Wochenplan — selbst oder mit Hilfe | Wochenplan: selbst gebaut oder mit Hilfe | (b) samo „selbst” urwane; 40 zn. | do sprawdzenia przez native speakera |
| fr | plan | Plan de la semaine, seul ou aidé | Planifiez seul ou avec notre aide | (b) „seul ou aidé” sztywne i rodzajowe; 33 zn.; nazwa „Plan de la semaine” i tak na zrzucie | do sprawdzenia przez native speakera |
| ja | szablony | 既製のテンプレートか自分で作成 | テンプレートを選ぶか、自分で作る | (b) „既製” książkowe; 16 zn. | do sprawdzenia przez native speakera |
| vi | trening | Buổi tập của bạn nằm trên điện thoại | Dữ liệu tập luyện ở ngay trên điện thoại | (b) „nằm” (leży) brzmi dosłownie; 39 zn. | do sprawdzenia przez native speakera |

Bez uwag (naturalne, zwięzłe, zgodne z aplikacją): cs, sk, hu, uk, pt, pt-BR, nl, sv, da, nb, el, id, ms, zh-Hant oraz pozostałe podpisy wymienionych języków.
pt-BR i es-419 bez słów europejskich („celular”, brak „telemóvel/móvil”). de „Handy” w haśle jest naturalne, choć ekrany mówią „Telefon” — zostawić.

## Nowe terminy do słownika
- `telefon` (marketing i ekrany): es „teléfono” (aplikacja 19×; es-ES potocznie „móvil” — pytanie niżej), es-419/pt-BR „celular”, pt „telemóvel”. Powód: słowo pojawia się w haśle o prywatności na zrzucie i w ekranach — jedno brzmienie na język.
- `historia` (treningów): it „cronologia”, ms „sejarah”, de „Verlauf”, fr „historique” — dziś ustalone tylko w aplikacji, nie w słowniku.

## Pytania do native speakerów
1. es (Hiszpania): w haśle „Tu entreno se queda en tu teléfono” — „teléfono” czy „móvil”?
2. es: „solo o con nuestra ayuda” — czytasz „sam” czy „tylko”; lepiej „por tu cuenta”?
3. de: „Wochenplan — selbst oder mit Hilfe” czy „selbst gebaut oder mit Hilfe”?
4. fr: „Plan de la semaine, seul ou aidé” czy „Planifiez seul ou avec notre aide”?
5. ja: „既製のテンプレートか自分で作成” czy „テンプレートを選ぶか、自分で作る”?
6. vi: „Buổi tập của bạn nằm trên điện thoại” czy „Dữ liệu tập luyện ở ngay trên điện thoại”?
7. et: „Pro pakette” czy „Pro-pakette” (w obu kluczach)?

Podsumowanie: przeczytano 276 tekstów (33 × „Zobacz plany Pro” + 243 podpisy), 18 poprawek (13 pewnych/średnich, 5 do native speakera), 7 pytań.
