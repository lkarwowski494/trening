# 45. Widoczność w sklepie (M5) — metadane App Store

Przebieg roli M5 (widoczność w sklepie), gałąź `widocznosc/trening-2026-10-21`, od 21.10.2026. Zakres (ustalony z właścicielem 21.10.2026):
tylko metadane sklepu — nazwa, podtytuł, słowa kluczowe, kategoria, tekst promocyjny, opis — w lokalizacjach App Store; bez zmian w kodzie
i w zakresie funkcji 1.0. Podpisy i kompozycja zrzutów — po scaleniu redesignu M3. Wysyłka do App Store Connect i scalenie do `main` — tylko
za zgodą właściciela. Dokument zastępuje ścieżkę `docs/wydanie/widocznosc.md` z promptu roli (wyjątek nazwany: projekt trzyma dokumenty
numerowane w `docs/`, nowy podkatalog wymagałby zmiany generatora README).

## Stan (21.10.2026)

- E0 zakończony; STOP 1 rozstrzygnięty (decyzja właściciela niżej). E1 (frazy, 7 grup) i E2 (scalenie, kontrola mechaniczna, krytyka) zakończone;
  STOP 2 — propozycje pól niżej czekają na wybór właściciela. Zrzuty i opis — po M3.
- Surowe dane badania (wyniki wyszukiwania, recenzje, nazwy innych aplikacji) leżą poza repozytorium (katalog przebiegu), docelowo na Dysku
  właściciela („05 Research konkurencji”); tutaj tylko wnioski bez nazw innych aplikacji (wytyczne Apple 2.3.7, CLAUDE.md).

## Pokrycie storefrontów — przed zmianami

Źródło: App Store Connect Help, „App Store localizations” (developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations),
odczyt 21.10.2026; policzone skryptem `storefronty.mjs` (moduł roli 10) dla 31 lokalizacji z `store/app-store-names.json`.

- 175 storefrontów: lokalizacja strony w języku domyślnym — 171; tylko w języku dodatkowym — 3 (Australia i Nowa Zelandia: domyślny English (Australia);
  Chiny: Simplified Chinese); brak — 1 (Kanada: English (Canada), dodatkowy French (Canada)).
- English (U.K.) jest językiem domyślnym m.in. w Polsce, Czechach, Słowacji i na Ukrainie; język lokalny jest tam tylko dodatkowy. Lokalizacja en-GB
  jest więc stroną domyślną w większości krajów, a en-US jej nie zastępuje.
- Języki aplikacji bez lokalizacji w App Store: bg, et, lt, lv, sr — użytkownicy widzą stronę w języku domyślnym storefrontu (zwykle en-GB).
- **[DO USTALENIA]** czy słowa kluczowe języka dodatkowego (np. Polish w Polsce) liczą się w wyszukiwaniu danego storefrontu — Apple tego nie opisuje;
  rozstrzygnie pomiar (wyświetlenia z wyszukiwania w storefroncie przed i po zmianie).

## Plan przebiegu (STOP 1)

| Grupa | Lokalizacje App Store |
|---|---|
| G1 | pl, en-US, en-GB (+ en-AU, en-CA jako kopie) |
| G2 | cs, sk, hr, sl |
| G3 | hu, ro, uk, ru |
| G4 | de-DE, nl-NL, sv, da, no, fi |
| G5 | es-ES, es-MX, pt-PT, pt-BR, fr-FR, it |
| G6 | tr, el, id, ms, vi |
| G7 | ja, ko, zh-Hant |

- Frazy z badania każdego języka (wyniki wyszukiwania App Store w kraju, recenzje), nie z przekładu; potem krytyk ze świeżym kontekstem.
- Szacunek: ok. 1,2–2,5 mln tokenów, 0 zł (bez płatnych narzędzi i API). Czas właściciela: STOP 2 ok. 20–30 min, podpowiedzi wyszukiwarki ok. 15 min.

## Decyzje

- 21.10.2026 (właściciel, STOP 1 M5, przekazane przez koordynatora): zakres — **wszystkie 31 lokalizacji** („Wszystkie 31 lokalizacji (Recommended)”).
  Odrzucone: tylko PL/EN + Europa Środkowa; PL/EN + mniejsze rynki.
- 21.10.2026 (właściciel, STOP 1 M5, przekazane przez koordynatora): **nowe lokalizacje strony English (Australia) i English (Canada)** jako kopie
  en-GB / en-US („Dodać (Recommended)”) — 3 storefronty więcej z językiem domyślnym. Odrzucone: bez nowych lokalizacji; French (Canada) i Simplified
  Chinese (wymagałyby tłumaczenia, aplikacja nie ma zh-Hans).
- 21.10.2026 (właściciel, STOP 1 M5, przekazane przez koordynatora): **podpowiedzi wyszukiwarki z telefonu — tak** („Tak, ok. 15 min (Recommended)”):
  lista ok. 10 fraz PL/EN z instrukcją po STOP 2. Odrzucone: ocena ruchu tylko liczbą wyników.

## Propozycje pól po krytyce (STOP 2, 21.10.2026)

Rekomendacje z badania fraz (7 grup) po krytyce ze świeżym kontekstem; kontrola `sprawdz-wydanie.mjs metadane` (limity 30/30/100 B, terminy > 2 znaki, powtórzenia z nazwą): kod 0. Surowe frazy i źródła — poza repo (katalog przebiegu, docelowo Dysk). Nic nie trafiło do App Store Connect.

| Lokalizacja | Nazwa obecna | Nazwa (rekomendacja) | Podtytuł (rekomendacja) | Słowa kluczowe (rekomendacja) | B |
|---|---|---|---|---|---|
| pl | Trening: dziennik siłowni | Trening: dziennik treningowy | Serie i przerwy. Bez konta | `siłownia,plan,timer,ćwiczenia,notes,stoper,progres,hantle,sztanga,rekordy,1RM,offline,gumy` | 92 |
| en-US | Training: Gym Log & Rest Timer | bez zmian | Workout tracker. No account. | `lifting,strength,exercise,journal,planner,routine,barbell,dumbbell,sets,reps,1RM,RPE,RIR,bands,watch` | 100 |
| en-GB | Training: Gym Log & Rest Timer | bez zmian | Workout tracker. No account. | `weights,lifting,strength,exercise,diary,journal,planner,routine,barbell,sets,reps,1RM,RPE,RIR,watch` | 99 |
| en-AU | — (nowa lokalizacja) | Training: Gym Log & Rest Timer | Workout tracker. No account. | `weights,lifting,strength,exercise,diary,journal,planner,routine,barbell,sets,reps,1RM,RPE,RIR,watch` | 99 |
| en-CA | — (nowa lokalizacja) | Training: Gym Log & Rest Timer | Workout tracker. No account. | `lifting,strength,exercise,journal,planner,routine,barbell,dumbbell,sets,reps,1RM,RPE,RIR,bands,watch` | 100 |
| cs | Trénink: deník z posilovny | bez zmian | Série, plány a časovač pauzy | `cvičení,silový,činky,šablony,kalendář,rekordy,RPE,RIR,gumy,odpočinek,historie,doma,posilovna` | 100 |
| sk | Tréning: denník z posilňovne | bez zmian | Série, plány a časovač pauzy | `cvičenie,silový,činky,šablóny,kalendár,rekordy,RPE,RIR,gumy,odpočinok,história,doma,váha` | 97 |
| hr | Trening: dnevnik teretane | bez zmian | Serije, planovi, tajmer pauze | `vježbe,vježbanje,snaga,utezi,bučice,kalendar,rekordi,RPE,RIR,gume,povijest,kuće,predlošci` | 94 |
| sl | Trening: dnevnik vadbe | bez zmian | Fitnes, serije, časovnik | `vaje,telovadnica,moč,uteži,ročke,koledar,rekordi,RPE,RIR,gume,zgodovina,doma,predloge,načrt` | 95 |
| hu | Training: edzésnapló | bez zmian | Súlyzós edzés és pihenőidő | `konditerem,erősítő,edzésterv,sorozat,ismétlés,rekord,időzítő,otthon,RPE,RIR,e1RM,offline` | 97 |
| ro | Training: jurnal de sală | Training: jurnal antrenament | Sală, serii și cronometru | `musculatie,forta,haltere,gantere,exercitii,repetari,pauza,timer,record,RPE,RIR,e1RM,acasa` | 89 |
| uk | Training: щоденник тренувань | bez zmian | Зал, підходи, відпочинок | `вправи,силові,план,гантелі,штанга,повтори,таймер,RPE,RIR` | 98 |
| ru | Training: дневник тренировок | bez zmian | Зал, подходы и таймер отдыха | `упражнения,силовые,план,гантели,штанга,вес,дома,RPE,RIR` | 96 |
| de-DE | Training: Gym-Tagebuch | bez zmian | Krafttraining & Pausentimer | `workout,tracker,trainingsplan,hantel,übungen,satzpause,gewicht,rekorde,rpe,rir,e1rm,offline,serien` | 99 |
| nl-NL | Training: gymlogboek | Training: gym-logboek | Krachttraining & rusttimer | `workout,tracker,trainingsschema,trainingslogboek,sportschool,halter,oefeningen,records,rpe,e1rm,reps` | 100 |
| sv | Träning: gymdagbok | bez zmian | Träningsdagbok & vilotimer | `styrketräning,träningslogg,träningsschema,gym,workout,tracker,hantlar,övningar,rekord,rpe,reps` | 98 |
| da | Træning: fitnessdagbog | Træning: dagbog til gym | Styrketræning & pausetimer | `træningsdagbog,træningslog,træningsprogram,workout,tracker,håndvægte,øvelser,rekorder,rpe,reps` | 100 |
| no | Trening: gymdagbok | Trening: dagbok for gym | Treningslogg & pausetimer | `styrketrening,treningsdagbok,treningsprogram,workout,tracker,manualer,øvelser,rekorder,rpe,reps` | 96 |
| fi | Treeni: salipäiväkirja | bez zmian | Voimaharjoittelu & lepoajastin | `treenipäiväkirja,salitreeni,treenilogi,workout,tracker,käsipaino,toisto,paino,ennätys,rpe,reps` | 98 |
| es-ES | Training: diario de gimnasio | bez zmian | Rutinas, series y descansos | `musculación,pesas,fuerza,temporizador,entrenamiento,registro,gym,repeticiones,historial,watch` | 94 |
| es-MX | Training: diario de gimnasio | Training: diario de gym | Rutinas, series y descanso | `gimnasio,bitácora,pesas,musculación,entrenamiento,ejercicios,registro,temporizador,historial,watch` | 100 |
| pt-PT | Treino: diário de ginásio | bez zmian | Séries, cargas e descanso | `musculação,registo,temporizador,cronómetro,força,pesos,halteres,histórico,exercícios,watch` | 96 |
| pt-BR | Treino: diário de academia | bez zmian | Ficha, séries e descanso | `musculação,cronômetro,registro,carga,exercícios,timer,peso,halteres,histórico,força,watch` | 95 |
| fr-FR | Training: journal de muscu | bez zmian | Séances, séries et repos | `musculation,carnet,suivi,minuteur,entraînement,programme,charges,historique,haltères,watch,chrono` | 99 |
| it | Training: diario palestra | Training: diario allenamento | Palestra, schede e recupero | `pesi,registro,serie,ripetizioni,massimale,forza,esercizi,storico,gym,timer,watch` | 80 |
| tr | Training: spor salonu günlüğü | bez zmian | Antrenman, set ve dinlenme | `tekrar,sayaç,ağırlık,kuvvet,takip,program,egzersiz,kas,rekor,şablon,grafik,zamanlayıcı,gym` | 97 |
| el | Training: ημερολόγιο βαρών | Training: καταγραφή προπόνησης | Σετ, επαναλήψεις, διαλείμματα | `γυμναστήριο,βάρη,ασκήσεις,πρόγραμμα,ημερολόγιο,gym,workout` | 100 |
| id | Training: jurnal latihan gym | bez zmian | Set, repetisi, timer istirahat | `catatan,angkat,beban,kekuatan,program,jadwal,riwayat,rekor,rutinitas,otot,grafik,berat` | 86 |
| ms | Training: log latihan gim | Training: log latihan gym | Set, ulangan & pemasa rehat | `gim,senaman,catatan,beban,angkat,jadual,program,sejarah,otot,kekuatan,rekod,carta` | 81 |
| vi | Training: nhật ký tập gym | bez zmian | Ghi set, rep, hẹn giờ nghỉ | `thể hình,lịch tập,giáo án,bài tập,sức mạnh,cơ bắp,theo dõi,kỷ lục` | 89 |
| ja | Training: 筋トレ記録とタイマー | bez zmian | 重量・回数・セットをオフラインで管理 | `ジムメニュー,ワークアウト,トレーニングログ,グラフ,1RM,RPE,ダンベル` | 93 |
| ko | Training: 운동 기록과 휴식 타이머 | bez zmian | 헬스·홈트 세트와 무게를 오프라인으로 | `운동일지,헬스장,헬스루틴,웨이트,그래프,캘린더,워치앱,운동일기,1RM` | 92 |
| zh-Hant | Training: 重訓紀錄與休息計時 | bez zmian | 離線免帳號，記錄組數、重量與RPE | `健身房,健身日誌,健身計畫,訓練課表,訓練日曆,訓練筆記,肌力訓練,手錶計時` | 100 |

Wariant z podtytułem z decyzji D-4 (14.10.2026), do wyboru na STOP 2:

| Lokalizacja | Nazwa | Podtytuł D-4 | Słowa kluczowe | B |
|---|---|---|---|---|
| pl#D4 | Trening: dziennik siłowni | Przejrzysty dziennik bez konta | `siłownia,treningowy,plan,timer,przerwy,serie,ćwiczenia,stoper,notes,progres,hantle,sztanga,rekordy` | 100 |
| en-US#D4 | Training: Gym Log & Rest Timer | Clean gym log. No account. | `workout,tracker,lifting,strength,exercise,journal,planner,routine,barbell,sets,reps,1RM,RPE,bands` | 97 |
| en-GB#D4 | Training: Gym Log & Rest Timer | Clean gym log. No account. | `workout,tracker,weights,lifting,strength,exercise,diary,journal,routine,sets,reps,1RM,RPE,bands` | 95 |
