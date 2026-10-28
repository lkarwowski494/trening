# Słownik terminów treningowych (35 języków)

Plik generowany z `docs/lokalizacja/slownik-terminow.json` (jedno źródło); nie edytuj ręcznie: `UPDATE_I18N=1 npx jest tests/slownik-terminow.test.ts`.

**Zasada pierwsza (właściciel, 25.10.2026): teksty mają być naturalne.** Opieramy się na źródłach naukowych, ale nie pouczamy ludzi jak profesorzy: mówimy tak jak trener albo kolega na siłowni w danym języku, jak w każdej innej aplikacji treningowej. Termin zalecany = potoczny termin siłowni, nie naukowy, chyba że potoczny wprowadza w błąd.

Gdzie użyty: strażnik `tests/slownik-terminow.test.ts` (żaden tekst UI ani wskazówka techniki z pojęciem słownika nie używa terminu zakazanego; wyjątki z powodem w `docs/lokalizacja/slownik-wyjatki.json`), przekład przez API (`scripts/i18n/przeklad-api.mjs` dołącza wpisy języka docelowego i odrzuca tłumaczenia z terminem zakazanym), role `tlumacz` i `recenzent-lokalizacji`.

Pewność: **wysoka** — standardowy termin siłowni, powszechnie znany; nadal bez recenzji native speakera; **srednia** — termin plausibilny, nieweryfikowany przez native speakera; **niska** — wątpliwość: do potwierdzenia przez native speakera (lista w docs/16). Żaden wpis nie przeszedł recenzji native speakera.

## Pojęcia

| id | pojęcie | znaczenie |
|---|---|---|
| `przerwa` | przerwa między seriami | odpoczynek między seriami (timer na koniec przerwy); NIE przerwa w pracy ani w szkole, NIE dzień wolny |
| `przerwa_robocza` | przerwa robocza (po seriach roboczych) | czas odpoczynku po serii roboczej (w odróżnieniu od przerwy po rozgrzewce); nie „przerwa w pracy” |
| `przerwa_po_rozgrzewce` | przerwa po rozgrzewce | odpoczynek po serii rozgrzewkowej |
| `dzien_wolny` | dzień wolny / odpoczynku | dzień bez treningu w planie tygodnia; NIE pauza treningu |
| `pauza_treningu` | pauza treningu | wstrzymanie zegara treningu przyciskiem; to nie jest przerwa między seriami |
| `seria` | seria | jedno podejście: kolejne powtórzenia bez odkładania ciężaru (ang. set) |
| `seria_robocza` | seria robocza | seria właściwa (nie rozgrzewkowa); ang. working set |
| `rozgrzewka` | rozgrzewka / seria rozgrzewkowa | lekkie serie przed seriami roboczymi (oznaczenie W) |
| `powtorzenie` | powtórzenie | jedno pełne wykonanie ruchu w serii (ang. rep) |
| `zakres_powtorzen` | zakres powtórzeń | przedział liczby powtórzeń w serii (np. 8–12); NIE przerwa i NIE zakres ruchu |
| `zakres_ruchu` | zakres ruchu | amplituda ruchu w ćwiczeniu (ang. range of motion); NIE zakres powtórzeń |
| `ciezar` | ciężar | obciążenie podnoszone w serii (kg/lb); NIE masa ciała |
| `masa_ciala` | masa ciała | waga użytkownika (pomiary); także ćwiczenia z masą ciała |
| `dociazenie` | dociążenie | dodatkowy ciężar do masy ciała (pas, kamizelka) |
| `do_upadku` | do upadku | seria wykonywana do niemożności kolejnego powtórzenia (oznaczenie F) |
| `superset` | superset | dwa ćwiczenia wykonywane naprzemiennie bez przerwy |
| `drop_set` | drop set | seria z obniżaniem ciężaru bez przerwy (oznaczenie D) |
| `deload` | deload | tydzień z mniejszą objętością dla regeneracji; NIE redukcja masy ciała |
| `plan` | plan (tygodnia) | przypisanie szablonów do dni tygodnia |
| `szablon` | szablon (treningu) | zapisany zestaw ćwiczeń, serii i zakresów, z którego startuje trening |
| `trening` | trening | jedna sesja treningowa (od startu do zakończenia) |
| `trening_w_toku` | trening w toku | trening rozpoczęty i niezakończony („na żywo”) |
| `trening_wstecz` | trening wstecz | trening dopisany po fakcie z datą z przeszłości |
| `dzien_treningowy` | dzień treningowy | dzień, w którym użytkownik trenował (liczy się do limitu miesięcznego) |
| `rekord` | rekord | najlepszy wynik (PR) w ćwiczeniu |
| `objetosc` | objętość | suma ciężar × powtórzenia (lub liczba serii) w okresie; NIE głośność |
| `skala_wysilku` | skala wysiłku (RPE/RIR) | subiektywna ocena wysiłku w serii; skróty RPE i RIR zostają bez zmian |
| `asekuracja` | asekuracja | zabezpieczenie ćwiczącego: osoba asekurująca (spotter) i ramiona asekuracyjne; NIE ubezpieczenie |
| `technika` | technika | poprawny sposób wykonania ćwiczenia (wskazówki techniki) |
| `cwiczenie` | ćwiczenie | pojedynczy ruch w bibliotece (przysiad, wyciskanie) |
| `cwiczenie_wlasne` | ćwiczenie własne | ćwiczenie dodane przez użytkownika do biblioteki |
| `partia` | partia (mięśniowa) | grupa mięśni trenowana w ćwiczeniu (klatka, plecy…) |
| `sesja` | sesja | zapisany trening w historii |
| `progresja` | progresja | stopniowe zwiększanie obciążenia lub powtórzeń; podpowiedź „↑” |
| `zamiennik` | zamiennik | inne ćwiczenie wykonujące podobny ruch |
| `asysta` | asysta (gumą / maszyną) | odciążenie masy ciała w podciąganiu/dipach (guma, maszyna) |
| `tempo` | tempo (ruchu) | zapis szybkości faz ruchu, np. 3-1-1 |
| `sztanga` | sztanga | długa sztanga (gryf z talerzami) |
| `hantle` | hantle | ręczne ciężarki (para) |
| `maszyna` | maszyna | przyrząd z prowadzeniem ruchu |
| `wyciag` | wyciągi | wyciąg z linką (kabel) |
| `guma_oporowa` | guma oporowa | taśma lub guma do oporu/asysty |
| `talerz` | talerz obciążeniowy | krążek na sztangę |
| `kopia_zapasowa` | kopia zapasowa | plik z danymi treningu do przywrócenia |
| `zacznij_trening` | zacznij trening | przycisk rozpoczęcia treningu |
| `zakoncz_trening` | zakończ trening | przycisk zakończenia treningu |
| `chwyt` | chwyt (sposób trzymania uchwytu, ang. grip) | sposób, w jaki dłoń trzyma uchwyt, drążek albo sztangę; NIE „zaciskanie dłoni”, NIE przytrzymanie czegoś ręką w sensie kontroli |
| `faza_ruchu` | nazwy faz ruchu w animacji (Podciąganie, Opuszczanie, Wypychanie…) | nazwa FAZY ruchu pokazywana w animacji („{faza} {n} s”), rzeczownik odczasownikowy jak siostrzane fazy („Opuszczanie”, „Wypychanie”); NIE nazwa ćwiczenia (podciąganie na drążku) |
| `ramie` | ramię (górna część ręki, nie bark) | górna część ręki między barkiem a łokciem; NIE bark (partia „barki”) i NIE cała ręka |
| `kettlebell` | kettlebell (nie „odważnik”) | kula z uchwytem do ćwiczeń (kettlebell); NIE ogólny „odważnik”, NIE hantla, NIE talerz |
| `ledzwie` | lędźwie (dolna część pleców; ang. lower back) | dolny odcinek pleców nad miednicą; jeden termin we wszystkich wskazówkach, NIE „dolna część pleców” raz tak, raz inaczej, NIE biodra |
| `plan_subskrypcji` | plan (subskrypcji) | wariant płatnej subskrypcji na ekranie zakupu (miesięczny, roczny), nie plan tygodnia |
| `plan_dozywotni` | plan dożywotni | wariant zakupu jednorazowego (dostęp bez terminu) na ekranie zakupu, nie subskrypcja |
| `jednostka_masy_kg` | kg | symbol jednostki masy (kilogram) przy liczbach i w polach; wartość logiczna w danych i CSV zostaje „kg” |
| `jednostka_masy_lb` | lb | symbol jednostki masy (funt) przy liczbach i w polach; wartość logiczna w danych i CSV zostaje „lb” |
| `jednostka_dystansu_mi` | mi | symbol jednostki dystansu (mila) przy liczbach i w polach; skrót nieodmienny (ten sam tekst stoi po ułamkach i jako nagłówek kolumny); wartość logiczna w danych i CSV zostaje „mi” |
| `jednostka_dystansu_yd` | yd | symbol jednostki dystansu (jard) przy liczbach i w polach; skrót nieodmienny (ten sam tekst stoi po ułamkach i jako nagłówek kolumny); wartość logiczna w danych i CSV zostaje „yd” |
| `zegarek` | zegarek | Apple Watch (zegarek połączony z aplikacją); w ja i ko nazwa ze słownictwa Apple, nie zwykły zegarek na rękę |

## Terminy zalecane (rdzeń)

Przerwa między seriami, seria, powtórzenie, zakres powtórzeń, deload — pozostałe pojęcia w pliku JSON.

| język | przerwa | seria | powtórzenie | zakres powtórzeń | deload | do upadku |
|---|---|---|---|---|---|---|
| `pl` | Przerwa | Seria | Powtórzenia | zakres powtórzeń | Deload | Do upadku |
| `en` | Rest | Set | Reps | rep range | Deload | To failure |
| `cs` | Pauza | Série | Opakování | rozsah opakování | Deload | Do selhání |
| `sk` | Pauza | Séria | Opakovania | rozsah opakovaní | Deload | Do zlyhania |
| `hu` | Pihenő | Sorozat | Ismétlés | ismétlési tartomány | Deload | Bukásig |
| `ro` | Pauză | Serie | Repetări | interval de repetări | Descărcare | Până la epuizare |
| `bg` | Почивка | Серия | Повторения | диапазон на повторенията | Разтоварване | До отказ |
| `hr` | Odmor | Serija | Ponavljanja | raspon ponavljanja | Rasterećenje | Do otkaza |
| `sl` | Počitek | Serija | Ponovitve | razpon ponovitev | Razbremenitev | Do odpovedi |
| `sr` | Одмор | Серија | Понављања | опсег понављања | Растерећење | До отказа |
| `lt` | Poilsis | Serija | Kartojimai | pakartojimų intervalas | Iškrova | Iki nesėkmės |
| `lv` | Atpūta | Sērija | Atkārtojumi | atkārtojumu diapazons | Atslodze | Līdz atteicei |
| `et` | Paus | Seeria | Kordused | korduste vahemik | Kergendus | Kuni väsimuseni |
| `uk` | Відпочинок | Підхід | Повторення | діапазон повторень | Розвантаження | До відмови |
| `es` | Descanso | Serie | Repeticiones | rango de repeticiones | Descarga | Al fallo |
| `es-419` | Descanso | Serie | Repeticiones | rango de repeticiones | Descarga | Al fallo |
| `pt` | Descanso | Série | Repetições | gama de repetições | Descarga | Até à falha |
| `pt-BR` | Descanso | Série | Repetições | faixa de repetições | Deload | Até a falha |
| `de` | Pause | Satz | Wiederholungen | Wdh.-Bereich | Deload | Bis zum Versagen |
| `fr` | Repos | Série | Répétitions | plage de rép. | Décharge | Jusqu’à l’échec |
| `it` | Recupero | Serie | Ripetizioni | range di ripetizioni | Scarico | A cedimento |
| `nl` | Rust | Set | Herhalingen | herhalingsbereik | Deload | Tot falen |
| `sv` | Vila | Set | Reps | repsintervall | Deload | Till failure |
| `da` | Hvile | Sæt | Gentagelser | gent.-interval | Deload | Til udmattelse |
| `nb` | Hvile | Sett | Repetisjoner | rep.-område | Deload | Til utmattelse |
| `fi` | Palautus | Sarja | Toistot | toistoalue | Kevennys | Uupumukseen |
| `tr` | Dinlenme | Set | Tekrar | tekrar aralığı | Deload | Tükenişe kadar |
| `el` | Διάλειμμα | Σετ | Επαναλήψεις | εύρος επαναλ. | Αποφόρτιση | Έως αποτυχία |
| `id` | Istirahat | Set | Repetisi | rentang repetisi | Deload | Sampai gagal |
| `ms` | Rehat | Set | Ulangan | julat ulangan | Deload | Hingga gagal |
| `vi` | Nghỉ | Hiệp | Số lần | khoảng lần lặp | Deload | Đến kiệt sức |
| `ru` | Отдых | Подход | Повторения | диапазон повторений | Разгрузка | До отказа |
| `ja` | インターバル | セット | 回数 | レップ範囲 | ディロード | 限界まで |
| `ko` | 휴식 | 세트 | 반복 횟수 | 반복 범위 | 디로드 | 실패 지점까지 |
| `zh-Hant` | 休息 | 組 | 次數 | 次數範圍 | 減載 | 力竭 |

## Terminy zakazane (strażnik)

| język | pojęcie | zakazane | powód |
|---|---|---|---|
| `cs` | `przerwa` | přestávk | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `cs` | `przerwa_robocza` | pracovní pauza | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `cs` | `dzien_wolny` | pauz | „pauza” to przerwa/pauza, nie dzień wolny |
| `cs` | `pauza_treningu` | pauz | „pauza” to przerwa między seriami; pauzę treningu opisuje „pozastavit” |
| `sk` | `przerwa` | prestávk | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `sk` | `przerwa_robocza` | pracovná pauza | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sk` | `dzien_wolny` | pauz | „pauza” to przerwa/pauza, nie dzień wolny |
| `sk` | `pauza_treningu` | pauz | „pauza” to przerwa między seriami; pauzę treningu opisuje „pozastaviť” |
| `hu` | `przerwa` | szünet | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `hu` | `przerwa_robocza` | munkapihenő\|munkaszünet | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `hu` | `plan_dozywotni` | örök(?!ös\|re) | „Örök” znaczy wieczny (poetycko); plan bez terminu to „örökös” |
| `ro` | `przerwa` | recrea[țt]i | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `ro` | `przerwa_robocza` | pauz[ăa] de lucru | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ro` | `dzien_wolny` | pauz | „pauză” to pauza, nie dzień wolny („zi liberă”) |
| `ro` | `pauza_treningu` | pauz | „pauză” to przerwa między seriami; pauza treningu to „întrerupe” |
| `bg` | `przerwa_robocza` | работна почивка | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `hr` | `przerwa` | pauz | „pauza” to pauza treningu, nie przerwa między seriami (odmor) |
| `hr` | `przerwa_robocza` | radni odmor\|radna pauza | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sl` | `przerwa` | odmor | „odmor” znaczy urlop/wakacje; między seriami „počitek” |
| `sl` | `przerwa_robocza` | delovni počitek | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sl` | `plan_subskrypcji` | načrt | „Načrt” to plan tygodnia (zakładka Plan); wariant subskrypcji to „Paket” |
| `sr` | `przerwa` | пауз | „пауза” to pauza treningu, nie przerwa między seriami (одмор) |
| `sr` | `przerwa_robocza` | радни одмор\|радна пауза | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `lt` | `przerwa` | pertrauk | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `lt` | `przerwa_robocza` | darbinis poilsis | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `lv` | `przerwa` | starpbr[īi]\|pārtraukum | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `lv` | `przerwa_robocza` | darba atpūta | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `et` | `przerwa` | vaheaeg\|vahetund | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `et` | `przerwa_robocza` | tööpaus | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `et` | `pauza_treningu` | paus(?!eeri) | „paus” to przerwa między seriami; pauza treningu to „peata” |
| `et` | `plan_subskrypcji` | plaan | „Plaan” to plan tygodnia (zakładka Plan); wariant subskrypcji to „Pakett” |
| `et` | `plan_dozywotni` | igavene | „Igavene” znaczy wieczny (religijnie/poetycko); plan bez terminu to „eluaegne” |
| `uk` | `przerwa` | перерв | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `uk` | `przerwa_robocza` | відпочинок у робочих | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `uk` | `seria` | серія | „серія” to odcinek; podejście to „підхід” |
| `uk` | `zakres_powtorzen` | інтервал | „інтервал” to przerwa/trening interwałowy; zakres to „діапазон” |
| `es` | `przerwa` | receso\|laboral | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `es` | `przerwa_robocza` | descanso (laboral\|de trabajo) | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `es-419` | `przerwa` | receso\|laboral | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `es-419` | `przerwa_robocza` | descanso (laboral\|de trabajo) | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `pt` | `przerwa` | (?<![\p{L}])pausa(?![\p{L}]) | „pausa” to pauza treningu; między seriami „descanso” |
| `pt` | `przerwa_robocza` | descanso de trabalho | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `pt` | `zakres_powtorzen` | intervalo | „intervalo” w siłowni to przerwa między seriami; zakres to „gama” |
| `pt` | `zakres_ruchu` | intervalo | „intervalo” to przerwa; zakres ruchu to „amplitude” |
| `pt-BR` | `przerwa` | (?<![\p{L}])pausa(?![\p{L}]) | „pausa” to pauza treningu; między seriami „descanso” |
| `pt-BR` | `przerwa_robocza` | descanso de trabalho | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `pt-BR` | `zakres_powtorzen` | intervalo | w Brazylii „intervalo” to przerwa między seriami (i przerwa w pracy/szkole); zakres to „faixa” |
| `pt-BR` | `zakres_ruchu` | intervalo | „intervalo” to przerwa; zakres ruchu to „amplitude” |
| `pt-BR` | `deload` | descarga | „descarga” to spłuczka/wyładowanie; w Brazylii mówi się „deload” |
| `de` | `przerwa` | Unterbrechung\|Arbeitspause | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `de` | `przerwa_robocza` | Arbeitspause | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `de` | `pauza_treningu` | Pause | „Pause” to przerwa między seriami; pauzę treningu opisuje „anhalten” |
| `de` | `seria` | Serie | „Serie” to serial/seria produktów; podejście to „Satz” |
| `de` | `zakres_powtorzen` | Intervall | „Intervall” to trening interwałowy; zakres to „Bereich” |
| `fr` | `przerwa` | pause | „pause” to przerwa w pracy; w sali mówi się „repos” |
| `fr` | `przerwa_robocza` | pause de travail | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `fr` | `zakres_powtorzen` | intervalle | „intervalle” bywa przerwą; zakres to „plage”/„fourchette” |
| `it` | `przerwa_robocza` | pausa (di )?lavoro | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `it` | `zakres_powtorzen` | intervall | „intervallo” bywa przerwą; zakres powtórzeń to „range” |
| `it` | `zakres_ruchu` | intervall | „intervallo” bywa przerwą; zakres ruchu to „escursione” |
| `it` | `szablon` | modell | w włoskich siłowniach „scheda” |
| `nl` | `przerwa` | pauze | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `nl` | `przerwa_robocza` | werkpauze | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `nl` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „set” |
| `nl` | `zakres_powtorzen` | interval | „interval” to trening interwałowy; zakres to „bereik” |
| `sv` | `przerwa` | (?<![\p{L}])rast(?![\p{L}]) | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `sv` | `przerwa_robocza` | arbetspaus | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sv` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „set” |
| `da` | `przerwa` | frikvarter | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `da` | `przerwa_robocza` | arbejdspause | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `da` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „sæt” |
| `nb` | `przerwa` | friminutt\|lunsj | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `nb` | `przerwa_robocza` | arbeidspause | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `nb` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „sett” |
| `fi` | `przerwa_robocza` | työtauko | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `tr` | `przerwa` | (?<![\p{L}])mola | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `tr` | `przerwa_robocza` | iş molası\|çalışma molası | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `tr` | `seria` | (?<![\p{L}])seri(?![\p{L}]) | „seri” to seria/szybki; podejście to „set” |
| `el` | `przerwa_robocza` | διάλειμμα εργασίας | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `el` | `plan_subskrypcji` | πρόγραμμ | „Πρόγραμμα” to plan tygodnia (zakładka Plan); wariant subskrypcji to „Πλάνο” |
| `id` | `przerwa` | jeda | „jeda” to pauza (treningu); między seriami „istirahat” |
| `id` | `przerwa_robocza` | istirahat kerja | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `id` | `seria` | (?<![\p{L}])seri(?![\p{L}]) | „seri” to serial; podejście to „set” |
| `ms` | `przerwa` | jeda | „jeda” to pauza (treningu); między seriami „rehat” |
| `ms` | `przerwa_robocza` | rehat kerja | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ms` | `seria` | (?<![\p{L}])siri(?![\p{L}]) | „siri” to serial; podejście to „set” |
| `vi` | `przerwa` | giải lao | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `vi` | `przerwa_robocza` | nghỉ giải lao\|nghỉ làm việc | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ru` | `przerwa` | перерыв | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `ru` | `przerwa_robocza` | рабочий отдых | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ru` | `seria` | серия | „серия” to odcinek/seria produktów; podejście to „подход” |
| `ru` | `zakres_powtorzen` | интервал | „интервал” to przerwa/trening interwałowy; zakres to „диапазон” |
| `ja` | `przerwa` | 休憩 | 休憩 to przerwa w pracy/szkole; na siłowni między seriami mówi się インターバル |
| `ja` | `przerwa_robocza` | 仕事の\|休憩 | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ja` | `przerwa_po_rozgrzewce` | 休憩 | 休憩 to przerwa w pracy/szkole; na siłowni インターバル |
| `ja` | `plan_dozywotni` | 永久版 | „永久版” brzmi jak wersja edycji; zakup jednorazowy to „買い切り” |
| `ja` | `zegarek` | 腕時計 | zwykły zegarek na rękę; dla Apple Watch w aplikacjach treningowych mówi się „ウォッチ” |
| `ko` | `przerwa` | 점심\|휴게 | dotyczy przerwy obiadowej/pokoju socjalnego |
| `ko` | `przerwa_robocza` | 업무 휴식 | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ko` | `szablon` | 템플릿 | w koreańskich siłowniach „루틴” |
| `ko` | `plan_subskrypcji` | 플랜 | „플랜” to plan tygodnia (zakładka Plan); wariant subskrypcji to „요금제” |
| `ko` | `plan_dozywotni` | 영구 | „영구” brzmi jak trwałe/nieodwracalne; zakup bez terminu to „평생 이용” |
| `ko` | `zegarek` | 시계 | zwykły zegar/zegarek; dla Apple Watch w aplikacjach treningowych mówi się „워치” |
| `zh-Hant` | `przerwa_robocza` | 工作休息\|上班 | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `zh-Hant` | `deload` | 減量 | „減量” w tajwańskim żargonie siłowni znaczy odchudzanie (redukcję); deload to „減載” |

## Do potwierdzenia przez native speakera (127)

Pytanie do każdego: czy tak powiedziałby trener albo kolega na siłowni w tym języku? Jeśli nie — jak mówi się naprawdę? (Lista z docs/16.)

| język | pojęcie | obecny termin | wątpliwość |
|---|---|---|---|
| `pl` | `zegarek` | zegarek | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `en` | `zegarek` | watch | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `cs` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `cs` | `zegarek` | hodinky | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sk` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `sk` | `zegarek` | hodinky | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `hu` | `seria` | Sorozat | w siłowniach używa się też „széria”/„szett”; do potwierdzenia przez native speakera |
| `hu` | `asekuracja` | Biztosítás | „biztosítás” bywa ubezpieczeniem — do potwierdzenia |
| `hu` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `hu` | `zegarek` | óra | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ro` | `do_upadku` | Până la epuizare | w siłowniach też „până la cedare”; do potwierdzenia |
| `ro` | `asekuracja` | Siguranță și asigurare | do potwierdzenia przez native speakera |
| `ro` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `ro` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `ro` | `zegarek` | ceas | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `bg` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `bg` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `bg` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `bg` | `jednostka_dystansu_mi` | мили | Skrót nieodmienny „мили” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `bg` | `jednostka_dystansu_yd` | ярд | Skrót nieodmienny „ярд” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `bg` | `zegarek` | часовник | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `hr` | `asekuracja` | Sigurnost i asistencija | do potwierdzenia przez native speakera |
| `hr` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `hr` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `hr` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `hr` | `ledzwie` | donji dio leđa | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `hr` | `zegarek` | sat | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sl` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `sl` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `sl` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `sl` | `ledzwie` | ledveni del hrbta | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `sl` | `zegarek` | ura | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sr` | `asekuracja` | Асистенција и безбедност | do potwierdzenia przez native speakera |
| `sr` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `sr` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `sr` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `sr` | `ledzwie` | donji deo leđa | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `sr` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `sr` | `jednostka_masy_lb` | фнт | Skrót funta w piśmie lokalnym: czy „фнт” jest używany, czy ludzie piszą „lb”? (imperialny rzadko w tym regionie) |
| `sr` | `jednostka_dystansu_mi` | миља | Skrót nieodmienny „миља” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `sr` | `jednostka_dystansu_yd` | јарда | Skrót nieodmienny „јарда” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `sr` | `zegarek` | сат | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `lt` | `zakres_powtorzen` | pakartojimų intervalas | „intervalas” bywa przerwą; w siłowniach też „diapazonas” — do potwierdzenia |
| `lt` | `do_upadku` | Iki nesėkmės | do potwierdzenia przez native speakera |
| `lt` | `asekuracja` | Pagalba ir saugumas | do potwierdzenia przez native speakera |
| `lt` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `lt` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `lt` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `lt` | `ledzwie` | apatinė nugaros dalis | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `lt` | `zegarek` | laikrodis | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `lv` | `seria` | Sērija | „sērija” = seria/odcinek; w siłowniach też „pieeja” — do potwierdzenia |
| `lv` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `lv` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `lv` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `lv` | `ledzwie` | lejasmugura | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `lv` | `zegarek` | pulkstenis | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `et` | `do_upadku` | Kuni väsimuseni | „väsimuseni” = do zmęczenia; do potwierdzenia |
| `et` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `et` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `et` | `ledzwie` | alaselg | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `et` | `zegarek` | käekell | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `uk` | `asekuracja` | Страхування | „страхування” bywa ubezpieczeniem; w siłowniach też „страховка”/„спотінг” — do potwierdzenia |
| `uk` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `uk` | `jednostka_masy_lb` | фнт | Skrót funta w piśmie lokalnym: czy „фнт” jest używany, czy ludzie piszą „lb”? (imperialny rzadko w tym regionie) |
| `uk` | `jednostka_dystansu_mi` | ми | Skrót nieodmienny „ми” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `uk` | `jednostka_dystansu_yd` | ярд | Skrót nieodmienny „ярд” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `uk` | `zegarek` | годинник | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `es` | `zegarek` | reloj | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `es-419` | `zegarek` | reloj | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `pt` | `zakres_powtorzen` | gama de repetições | w Portugalii „intervalo” = przerwa między seriami, więc „gama”; do potwierdzenia przez native speakera |
| `pt` | `szablon` | Modelo | „modelo” jest ogólne; w siłowniach „ficha/plano de treino” — do potwierdzenia |
| `pt` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `pt` | `zegarek` | relógio | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `pt-BR` | `szablon` | Modelo | „modelo” jest ogólne; w siłowniach „ficha” — do potwierdzenia |
| `pt-BR` | `zegarek` | relógio | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `de` | `zegarek` | Uhr | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `fr` | `zegarek` | montre | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `it` | `zakres_powtorzen` | range di ripetizioni | „range” to potoczne w siłowni; „intervallo” bywa przerwą — do potwierdzenia |
| `it` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `it` | `zegarek` | orologio | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `nl` | `zegarek` | horloge | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sv` | `zegarek` | klocka | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `da` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `da` | `ledzwie` | lænd | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `da` | `zegarek` | ur | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `nb` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `nb` | `zegarek` | klokke | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `fi` | `do_upadku` | Uupumukseen | do potwierdzenia przez native speakera |
| `fi` | `zegarek` | kello | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `tr` | `do_upadku` | Tükenişe kadar | do potwierdzenia przez native speakera |
| `tr` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `tr` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `tr` | `zegarek` | saat | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `el` | `do_upadku` | Έως αποτυχία | do potwierdzenia przez native speakera |
| `el` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `el` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `el` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `el` | `ledzwie` | μέση | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `el` | `jednostka_masy_kg` | κιλά | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Grecki: „κιλά” (pełne słowo) czy „kg”? |
| `el` | `zegarek` | ρολόι | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `id` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `id` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `id` | `zegarek` | jam tangan | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ms` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `ms` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `ms` | `ledzwie` | belakang bawah | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `ms` | `zegarek` | jam tangan | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `vi` | `seria` | Hiệp | „hiệp” (też runda w boksie) obok „set” — do potwierdzenia |
| `vi` | `asekuracja` | Hỗ trợ và an toàn | do potwierdzenia przez native speakera |
| `vi` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `vi` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `vi` | `zegarek` | đồng hồ | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ru` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `ru` | `jednostka_masy_lb` | фнт | Skrót funta w piśmie lokalnym: czy „фнт” jest używany, czy ludzie piszą „lb”? (imperialny rzadko w tym regionie) |
| `ru` | `jednostka_dystansu_mi` | ми | Skrót nieodmienny „ми” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `ru` | `jednostka_dystansu_yd` | ярд | Skrót nieodmienny „ярд” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `ru` | `zegarek` | часы | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ja` | `zakres_powtorzen` | レップ範囲 | „レップ” to żargon siłowni; do potwierdzenia |
| `ja` | `szablon` | テンプレート | „テンプレート” vs „メニュー” w siłowniach — do potwierdzenia |
| `ja` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `ja` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `ko` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `ko` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `zh-Hant` | `szablon` | 範本 | „範本” brzmi jak szablon dokumentu; w siłowniach tajwańskich „課表” — do potwierdzenia |
| `zh-Hant` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `zh-Hant` | `ramie` | upper arm | Termin nieustalony: tymczasowo angielskie „upper arm”; native speaker ma wskazać termin na górną część ręki (ramię, nie bark), lista w docs/16. |
| `zh-Hant` | `zegarek` | 手錶 | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
