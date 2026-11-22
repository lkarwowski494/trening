# Pozycjonowanie RepsGoat w App Store — STOP 2 (propozycje po krytyce), 22.11.2026

Rola M5 (widoczność w sklepie), tryb build, sesja AL2. Zakres według decyzji właściciela KO-100 (22.11.2026): wszystkie 33 lokalizacje, zmiany PL i EN
i całej karty od razu z nową wersją, pomiar 8 tygodni po zmianie, bez wydarzenia w sklepie. Nic nie zmieniono w App Store Connect ani w metadanych w repo
(`store/*.json` bez zmian; zapis po wyborze właściciela — E3). Surowe wyniki (z nazwami innych aplikacji) leżą w katalogu przebiegu poza repo.

## Jak badaliśmy (22.11.2026, 09:48–10:30 UTC)

- 7 grup języków (G1–G7 jak 21.10, docs/45), każda ze świeżym kontekstem, ok. 15–29 fraz na lokalizację, łącznie ok. 600 fraz; kontrolnie także IE, AT, CH,
  BE, AR, CO, KZ, HK, CY.
- **Popyt:** podpowiedzi wyszukiwarki App Store danego kraju (publiczny punkt podpowiedzi sklepu z nagłówkiem storefrontu; wynik zależy od kraju —
  sprawdzone: ten sam prefiks w DE, US i PL daje różne listy). To zastępuje zrzuty podpowiedzi z telefonu właściciela (krok właściciela z 21.10 odpada).
- **Wygrywalność:** publiczne API wyszukiwania (limit 200): liczba wyników, pozycja RepsGoat, mediana liczby ocen pierwszej dziesiątki. Wniosek diagnozy:
  wybieramy frazy obecne w podpowiedziach i z niską medianą ocen (aplikacja ma 2 oceny w PL i 0 gdzie indziej). API nie jest wyszukiwarką sklepu 1:1 —
  pozycje to sygnał; według grupy G4 API prawie na pewno pomija pole słów kluczowych, więc mierzy głównie nazwę.
- **Kontrola mechaniczna** (limity Apple: nazwa i podtytuł ≤ 30 znaków, słowa ≤ 100 B, każde słowo > 2 znaki, bez słów z nazwy i podtytułu, bez powtórzeń;
  te same reguły co `tests/store-metadata.test.ts:35-47`): wszystkie 33 lokalizacje przechodzą. Wyłapała w propozycjach grup słowa 2-znakowe
  (EN „pr”, ES „rm”, oraz rozbite złożenia w ja/ko/zh-Hant) — poprawione przed krytyką.
- **Krytyk** (świeży kontekst, bez uzasadnień grup): 8 pól do zmiany, 13 niepewnych; brak marek i nazw innych aplikacji. Zmiany przyjęte w tabeli niżej.

## Ustalenia, które zmieniają sposób pisania pól

1. **Wyszukiwanie nie sprowadza odmian** (cs, hr): obecne „posilovny”, „teretanu” nie dają pozycji na „posilovna”, „teretana”. W nazwie i podtytule — forma,
   którą ludzie wpisują (zwykle mianownik).
2. **Fraza w nazwie działa najlepiej jako ciągła** (EN): na „gym rest timer” w pierwszej trzynastce jest siedem aplikacji z 0–13 ocenami, każda z tą frazą
   w nazwie w tej kolejności; RepsGoat ma te słowa, ale nie obok siebie, i jest poza 200.
3. **Frazy puste w nazwach** (1–10 wyników): cs, sk, hr, sv, da, fi — poz. 1–2 na frazę, której prawie nikt nie wpisuje; no „dagbok for gym” bez podpowiedzi.
4. **Intencja wyników ma znaczenie** (krytyk): fraza z popytem, której pierwsza dziesiątka to inny typ aplikacji (programy ćwiczeń, pilates, timery HIIT,
   kalistenika), odpada — el „ćwiczenia gimnastyczne”, ja „trening z masą ciała”, zh-Hant „timer interwałowy”.
5. **Pola ru działają także w UA** (RepsGoat poz. 40 w UA na frazę z podtytułu ru); **w KZ** lokalizacja ru nie jest widoczna (wyniki po angielsku).
6. **„Kalkulator 1RM”** (de, ja, ko): aplikacja szacuje e1RM z zapisanych serii (`lib/i18n.en.ts:131`, `:572`), nie ma osobnego kalkulatora — w polach
   „szacowanie” (ja 1RM推定, ko 1RM 추정), w de bez „Rechner” (WYD-06, wytyczna 2.3.7).
7. **Zastrzeżenie pomiaru:** EN jest poza 200 nawet na „rest timer”, choć fraza jest w nazwie od 17.11 — indeks nowej nazwy mógł się jeszcze nie ustalić.

## Propozycje po krytyce (33 lokalizacje)

Kategoria: we wszystkich grupach pierwsza dziesiątka fraz głównych to 9–10/10 Health & Fitness. en-AU = en-GB, en-CA = en-US (podpowiedzi AU/CA prawie
identyczne; IE zgodne z GB). sl: tylko repo (App Store Connect odrzucił słoweński 14.10.2026, L-003; `scripts/asc/metadane.mjs:25-27`).

| Lokalizacja | Nazwa (obecna → propozycja) | Podtytuł (obecny → propozycja) | Słowa kluczowe (propozycja) | B |
|---|---|---|---|---|
| pl | dziennik treningowy → **bez zmian** | Plan treningowy na siłownię → **bez zmian** | `siłowy,siłowni,notatnik,notes,stoper,timer,ćwiczenia,hantlami,domu,progres,1RM,gym,log,tracker` | 97 |
| en-US | Gym Log & Rest Timer → **…: Gym Rest Timer & Log** | Gym plan & workout tracker → **Progressive overload tracker** | `workout,lifting,weight,strength,notes,notebook,diary,1rm,rpe,rir,sets,reps,barbell,dumbbell,watch` | 97 |
| en-GB | Gym Log & Rest Timer → **…: Gym Rest Timer & Log** | Gym plan & workout tracker → **Progressive overload tracker** | `workout,lifting,weight,strength,notes,notebook,diary,1rm,rpe,rir,sets,reps,barbell,dumbbell,watch` | 97 |
| en-AU | Gym Log & Rest Timer → **…: Gym Rest Timer & Log** | Gym plan & workout tracker → **Progressive overload tracker** | `workout,lifting,weight,strength,notes,notebook,diary,1rm,rpe,rir,sets,reps,barbell,dumbbell,watch` | 97 |
| en-CA | Gym Log & Rest Timer → **…: Gym Rest Timer & Log** | Gym plan & workout tracker → **Progressive overload tracker** | `workout,lifting,weight,strength,notes,notebook,diary,1rm,rpe,rir,sets,reps,barbell,dumbbell,watch` | 97 |
| cs | deník z posilovny → **…: tréninkový deník** | Série, plány a časovač pauzy → **Silový trénink, časovač pauzy** | `posilovna,posilování,plán,cvičení,činky,gym,tracker,workout,log,rekordy,gumy,doma,RPE,RIR,sety` | 100 |
| sk | denník z posilňovne → **…: tréningový denník** | Série, plány a časovač pauzy → **Silový tréning, časovač pauzy** | `posilňovňa,posilňovanie,plán,cvičenie,činky,gym,tracker,workout,doma,rekordy,gumy,RPE,RIR,log` | 99 |
| hr | dnevnik za teretanu → **…: teretana i trening** | Serije, planovi, tajmer odmora → **Plan treninga i tajmer odmora** | `dnevnik,vježbe,vježbanje,snage,bučice,utezi,gym,tracker,workout,kuće,kod,rekordi,RPE,RIR,gume` | 97 |
| sl | dnevnik vadbe → **bez zmian** | Serije in časovnik počitka → **bez zmian** | `trening,gym,tracker,workout,vaje,moč,uteži,ročke,koledar,rekordi,RPE,RIR,gume,doma,načrt,teža` | 98 |
| hu | edzésnapló → **…: edzésnapló és terv** | Súlyzós edzés és pihenőidő → **Súlyzós edzés és időzítő** | `gym,napló,tracker,timer,otthon,konditerem,súlyzó,ismétlés,rekord,RPE,RIR,e1RM,súlynapló,erő` | 99 |
| ro | jurnal antrenament → **bez zmian** | Sală, serii și cronometru → **Program sală și exerciții** | `acasa,gym,tracker,timer,cronometru,haltere,gantere,forta,repetari,serii,pauza,record,RPE,RIR,e1RM` | 97 |
| uk | щоденник тренувань → **…: тренування в залі** | Зал, підходи, відпочинок → **Щоденник і таймер тренувань** | `трекер,підходи,вправи,гантелі,штанга,силові,RPE,RIR,e1RM` | 94 |
| ru | дневник тренировок → **bez zmian** | Зал, подходы и таймер отдыха → **bez zmian** | `между,счетчик,учет,журнал,силовые,гантели,штанга,RPE,e1RM` | 99 |
| de-DE | Gym-Tagebuch → **bez zmian** | Krafttraining & Pausentimer → **Kraftsport & Pausentimer** | `krafttraining,trainingsprotokoll,trainingsplan,tracker,workout,tracken,hantel,übungen,1rm,rekorde` | 98 |
| nl-NL | gym-logboek → **bez zmian** | Krachttraining & rusttimer → **Trainingsschema & rusttimer** | `krachttraining,workout,tracker,sportschool,oefeningen,halter,schema,log,thuis,gewicht,1rm,rpe,reps` | 98 |
| sv | gymdagbok → **…: Träningslogg** | Träningsdagbok & vilotimer → **Styrketräning & vilotimer** | `gym,träningsdagbok,träningsprogram,logga,träning,workout,tracker,hantel,övningar,rekord,rpe,1rm` | 99 |
| da | styrkedagbog → **…: Træningsdagbog** | Styrketræning & pausetimer → **Træningsprogram & pausetimer** | `gym,styrketræning,træningslog,træning,track,tracker,workout,log,timer,håndvægte,øvelser,1rm` | 97 |
| no | dagbok for gym → **…: Treningsdagbok** | Treningslogg & pausetimer → **Styrketrening & pausetimer** | `treningslogg,trening,gym,tracking,tracker,workout,log,treningsprogram,hjemme,dagbok,øvelser,1rm,rpe` | 100 |
| fi | salipäiväkirja → **…: Treenipäiväkirja** | Voimaharjoittelu & lepoajastin → **Saliohjelma ja lepoajastin** | `salitreeni,sali,treeni,ajastin,ohjelma,kuntosali,voimaharjoittelu,treeniloki,gym,tracker,workout,1rm` | 100 |
| es-ES | diario de gimnasio → **…: registro de entreno** | Rutinas, series y descansos → **Diario de entrenamiento y 1RM** | `gimnasio,gym,rutina,pesas,progreso,descanso,musculación,fuerza,temporizador,mancuernas,watch,series` | 100 |
| es-MX | diario de gym → **…: registro de entreno** | Rutinas, series y descanso → **Diario de gym y temporizador** | `gimnasio,rutina,pesas,progreso,descanso,cronómetro,musculación,ejercicios,fuerza,1rm,watch,plan` | 97 |
| pt-PT | diário de ginásio → **…: registo de treinos** | Séries, cargas e descanso → **Diário de ginásio e descanso** | `musculação,cronómetro,temporizador,séries,pesos,halteres,força,histórico,exercícios,1rm,watch` | 100 |
| pt-BR | diário de academia → **…: registro de treino** | Ficha, séries e descanso → **Diário de academia e descanso** | `musculação,ficha,cronômetro,carga,séries,exercícios,timer,peso,halteres,força,1rm,montar,watch` | 100 |
| fr-FR | journal de muscu → **…: suivi salle de sport** | Séances, séries et repos → **Journal de muscu et repos** | `musculation,carnet,minuteur,haltères,entraînement,programme,charges,historique,séance,1rm,watch` | 98 |
| it | diario allenamento → **…: diario allenamenti** | Palestra, schede e recupero → **Palestra: pesi, serie e timer** | `scheda,pesistica,registro,ripetizioni,massimale,forza,esercizi,manubri,storico,recupero,gym,watch` | 97 |
| tr | spor salonu günlüğü → **…: Antrenman Takibi** | Antrenman, set ve dinlenme → **Spor salonu günlüğü, set, RPE** | `gym,log,workout,tracker,program,ağırlık,dambıl,egzersiz,kas,rekor,1rm,sayaç,şablon,halter` | 95 |
| el | καταγραφή προπόνησης → **…: πρόγραμμα προπόνησης** | Σετ, επαναλήψεις, διαλείμματα → **Καταγραφή, σετ & διαλείμματα** | `gym,tracker,log,workout,γυμναστήριο,βάρη,ημερολόγιο,ασκήσεις` | 93 |
| id | jurnal latihan gym → **…: Latihan Gym & Beban** | Set, repetisi, timer istirahat → **Jurnal angkat, set & istirahat** | `tracker,log,workout,otot,dumbel,catatan,repetisi,timer,rekor,1rm,jadwal,grafik,kekuatan,olahraga` | 96 |
| ms | log latihan gym → **…: Gym Log & Bina Otot** | Set, ulangan & pemasa rehat → **Tracker senaman, pemasa rehat** | `workout,badan,latihan,angkat,berat,timer,planner,jadual,program,kekuatan,rekod,ulangan,set,1rm,gim` | 98 |
| vi | nhật ký tập gym → **…: Tập gym tại phòng** | Ghi set, rep, hẹn giờ nghỉ → **Nhật ký set, rep & lịch tuần** | `giáo án,luyện,thể hình,tăng cơ,sức mạnh,kỷ lục,log,tracker,workout,hẹn giờ,1rm` | 99 |
| ja | 筋トレ記録とタイマー → **…: 筋トレ日誌・ウエイト記録** | 重量・回数・セットをオフラインで管理 → **休憩タイマーと1RM推定・オフライン** | `ジムメモ,ジム日記,ジムログ,ノート,メニュー,RPE,ダンベル,ワークアウト` | 97 |
| ko | 운동 기록과 휴식 타이머 → **…: 헬스 휴식 타이머·운동일지** | 헬스·홈트 세트와 무게를 오프라인으로 → **근력운동 기록·1RM 추정·오프라인** | `운동기록,헬스장,헬스루틴,웨이트,홈트기록,덤벨운동,캘린더,운동일기,RPE` | 98 |
| zh-Hant | 重訓紀錄與休息計時 → **bez zmian** | 離線免帳號，記錄組數、重量與RPE → **bez zmian** | `訓練日誌,健身房,健身課表,健身菜單,運動紀錄,組間休息,啞鈴健身,肌力訓練` | 100 |

Najważniejsze dowody (22.11.2026; „mediana” = mediana ocen pierwszej dziesiątki w kraju):

| Lokalizacja | Dowód |
|---|---|
| pl | „dziennik treningowy” — 1. podpowiedź dla „dziennik t”, poz. 7–10; „plan treningowy na siłownię” — 1. dla „plan t”. Zmiana nazwy bez dowodu przewagi — bez zmian |
| en-* | „gym rest timer” 1. podpowiedź dla „rest t”, mediana 8 (US), 1,5 (GB), 0 (AU, CA); „progressive overload” 2. dla „progressive”, mediana 1–4,5; funkcja: podpowiedź progresji (`lib/i18n.en.ts:195-196`) |
| cs / sk | „tréninkový deník” w podpowiedziach, 134 wyniki, mediana 5; SK 86 wyników, mediana 0 |
| hr | „teretana” 2. podpowiedź dla „teretan”, mediana 0; „plan treninga” 133 wyniki, mediana 0 |
| hu | „edzés terv” 2.–3. podpowiedź, mediana 113; „edzés időzítő” mediana 6 |
| ro / ru | nazwa bez zmian (RO poz. 38, mediana 0; RU poz. 99, 1. podpowiedź); RU podtytuł poz. 6 na „таймер отдыха между подходами” |
| uk | „тренування в залі” 2. podpowiedź już przy „тре”, 62 wyniki, mediana 110 |
| de / nl | nazwy bez zmian (DE poz. 10, AT/CH 17, 1. podpowiedź; NL poz. 53, BE 26); „Kraftsport” 1. podpowiedź, mediana 42 (przy „Krafttraining” ok. 11 tys.) |
| sv / da / no / fi | obecne frazy puste; „träningslogg” mediana 16, „træningsdagbog” 6, „treningsdagbok” 23, „treenipäiväkirja” 51 — wszystkie w podpowiedziach |
| es-ES / es-MX | „registro de entrenamiento” 1. podpowiedź w ES, MX, AR, CO; mediany 2,5–49,5 |
| pt-PT / pt-BR | „registo de treinos” mediana 72,5; „registro de treino” 1. podpowiedź, mediana 171,5 (frazy z „ficha” — mediany tysięcy) |
| fr-FR | „suivi salle de sport” w podpowiedziach, mediana 176,5; „journal de muscu” (dziś poz. 11, bez podpowiedzi) przechodzi do podtytułu |
| it | „diario allenamenti” mediana 1,5 (liczba pojedyncza — ok. 5 tys.) |
| tr | „antrenman takip” 1. podpowiedź dla „antrenman t”, mediana 12; obecna fraza z nazwy (poz. 6) przechodzi do podtytułu |
| el | „πρόγραμμα προπόνησης” poz. 23 (po krytyce zamiast frazy o innej intencji); obecna fraza z nazwy występuje w podpowiedziach tylko jako nazwa innej aplikacji |
| id / ms / vi | „latihan gym” 2. podpowiedź; w MY szukają po angielsku („gym log” 1. dla „gym l”, mediana 26,5); „tập gym tại phòng” 2. dla „tập gym”, mediana 10,5 |
| ja / ko / zh-Hant | „筋トレ記録” — mediana ok. 3,1 tys. (nie do wygrania), „筋トレ日誌” mediana 12,5; „휴식 타이머” mediana 2,5 (RepsGoat poz. 96); „重訓紀錄” 1. podpowiedź w TW (mediana 135,5, HK 21,5, RepsGoat poz. 58) — nazwa bez zmian |

## Decyzje dla właściciela

### KO-110. Nazwa EN (en-US, en-GB, en-AU, en-CA)

| Opcja | Co | Kompromis | Wykonalność |
|---|---|---|---|
| **A (rekomendacja)** | „RepsGoat: Gym Rest Timer & Log” + podtytuł „Progressive overload tracker” | ciągła fraza z popytem i słabą konkurencją; tracimy sąsiedztwo „gym log” (dziś i tak poza 200) | `store/app-store-names.json`, `store/app-store-metadata.json`; testy `tests/store-metadata.test.ts:52-53`, `tests/nazwa-repsgoat.test.ts` do zmiany w tym samym commicie |
| B | nazwa bez zmian, tylko podtytuł i słowa | zero ryzyka dla marki; zostajemy poza 200 na frazach głównych | jw. |
| C | „RepsGoat: Progressive Overload” + podtytuł „Gym log & rest timer” | mediana 1–4,5, ale nazwa mniej mówi, czym aplikacja jest | jw. |

### KO-111. Nazwy pozostałych lokalizacji (człon po „RepsGoat: ”)

| Opcja | Co | Kompromis | Wykonalność |
|---|---|---|---|
| **A (rekomendacja)** | wszystkie zmiany z tabeli (cs, sk, hr, hu, uk, sv, da, no, fi, es-ES, es-MX, pt-PT, pt-BR, fr-FR, it, tr, el, id, ms, vi, ja, ko); bez zmian: pl, ro, ru, de, nl, zh-Hant, sl | zgodne z „wszystko od razu” (KO-100); fr i tr tracą pozycję 6–11 na frazie z obecnej nazwy (przechodzi do podtytułu, który waży mniej) | jw.; `tests/i18n-locales.test.ts` (część przed dwukropkiem = APP_NAME) |
| B | tylko nazwy z frazą pustą (cs, sk, hr, sv, da, no, fi, el); reszta — tylko podtytuł i słowa | mniej ryzyka tam, gdzie jest pozycja; mniej zasięgu na frazach z popytem | jw. |
| C | nazwy bez zmian, tylko podtytuły i słowa | najmniej zmian; frazy puste zostają w polu o największej wadze | jw. |

Niepewne po krytyce (do wyboru przy A, rekomendacja pierwsza): ms „Gym Log & Bina Otot” („budowa mięśni” — cel z generatora, `lib/generator.ts:40`) albo
„Gym Log & Angkat Berat”; vi „Tập gym tại phòng” albo „Tập gym & thể hình” (krytyk: pierwsza zawęża do siłowni, druga szersza, niesprawdzona w API);
hr „teretana i trening” albo „dnevnik treninga” (101 wyników, mediana 0).

### KO-112. Kategoria

| Opcja | Co | Kompromis | Wykonalność |
|---|---|---|---|
| **A (rekomendacja)** | bez zmian: główna Health & Fitness, bez dodatkowej | 9–10/10 aplikacji w wynikach fraz głównych to Health & Fitness; zero ryzyka | stan obecny (docs/45, 21.10) |
| B | dodatkowa Sports | Apple indeksuje też kategorię dodatkową („Your primary category and optional secondary category are indexed”, App Store search); słowo „sport” bez dowodu popytu w badaniu | zmiana w App Store Connect (krok właściciela) |

### KO-113. Podtytuły i słowa kluczowe

| Opcja | Co | Kompromis | Wykonalność |
|---|---|---|---|
| **A (rekomendacja)** | wszystkie podtytuły i słowa z tabeli (po krytyce), przed zapisem przegląd recenzenta lokalizacji (naturalność: cs „sety”, hr, hu, uk, id, pt) | pełne wykorzystanie budżetu fraz z popytem | `store/app-store-metadata.json`; zapis z nową wersją `scripts/asc/metadane.mjs` |
| B | tylko słowa kluczowe, podtytuły bez zmian | mniej tekstów do przeglądu; podtytuł waży więcej niż słowa — tracimy część efektu | jw. |

## Po wyborze (E3–E4, bez zgody na wysyłkę)

E3: zapis wybranych pól w `store/app-store-names.json` i `store/app-store-metadata.json`, przegląd recenzenta lokalizacji, zmiana testów przypiętych do obecnych
wartości (`tests/store-metadata.test.ts:52-53`, `tests/nazwa-repsgoat.test.ts`, `tests/i18n-locales.test.ts` — jeśli zmienia się człon nazwy), wpisy decyzji
w docs/18, `verify:lekkie`, push na gałąź. E4: hipotezy pomiaru (PL bez zmian nazwy, EN i reszta z nazwą) w formacie dziennika wydań, plan narzędzi po wydaniu.
Wysyłka do App Store Connect z najbliższą wersją i scalenie — tylko za osobną zgodą.

## Nie sprawdzono

Wyszukiwarka sklepu 1:1 (tylko API i podpowiedzi); pozycje po zmianie (wymagają wydania); liczby wyszukań (Apple ich nie podaje); osobne frazy fr-CA (sklep CA),
NZ, BY/AM/UZ; języki sklepu KZ według Apple; czy Apple łączy liczbę pojedynczą z mnogą i formy z akcentem i bez; słowa kluczowe na żywo (pole niepubliczne,
podgląd czyta tylko wersję edytowalną — diagnoza, przyczyna 9).

## Koszt

E1: 7 subagentów, ok. 0,94 mln tokenów (+0,15 mln poprawka G7); krytyk ok. 0,12 mln; sesja AL2 łącznie ok. 20–28 USD [OCENA], w pułapie 55 USD.
