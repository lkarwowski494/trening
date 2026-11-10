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
| `faza_pauza` | pauza — faza animacji ruchu („Pauza” w linii faz) | nazwa FAZY animacji ruchu w karcie ćwiczenia („Opuszczanie 2 s · Pauza · Wypychanie 1 s”): zatrzymanie w pozycji, rzeczownik jak siostrzane fazy; NIE przycisk wstrzymania (to pojęcie pauza_treningu) |
| `seria` | seria | jedno podejście: kolejne powtórzenia bez odkładania ciężaru (ang. set) |
| `seria_robocza` | seria robocza | seria właściwa (nie rozgrzewkowa); ang. working set |
| `rozgrzewka` | rozgrzewka / seria rozgrzewkowa | lekkie serie przed seriami roboczymi (oznaczenie W) |
| `powtorzenie` | powtórzenie | jedno pełne wykonanie ruchu w serii (ang. rep) |
| `zakres_powtorzen` | zakres powtórzeń | przedział liczby powtórzeń w serii (np. 8–12); NIE przerwa i NIE zakres ruchu |
| `zakres_ruchu` | zakres ruchu | amplituda ruchu w ćwiczeniu (ang. range of motion); NIE zakres powtórzeń |
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
| `lokcie_otwarte` | łokcie otwarte na boki | łokcie rozstawione szeroko od tułowia przy wyciskaniu (flared elbows); przeciwieństwo łokci przyklejonych do tułowia |
| `lokcie_waskie` | łokcie wąsko (przy tułowiu) | łokcie trzymane blisko tułowia, np. przy wąskim wyciskaniu (elbows in); przeciwieństwo łokci otwartych na boki. Dosłowne „wąsko” z polskiego bywa kalką; języki bez wpisu: pytanie do native speakerów w docs/16 (1.0.1) |
| `pozycja_posrednia` | pozycja pośrednia (podpis środkowej klatki rysunku) | podpis środkowych klatek rysunku ćwiczenia w całej aplikacji: przy trzech pozycjach „Pozycja pośrednia” (bez numeru), przy czterech „Pozycja pośrednia 1/2” (decyzja 29.10.2026), spójny z „Pozycja wyjściowa/końcowa”; NIE „w trakcie / w toku” (słowo statusu) |
| `animacja_ruchu` | animacja ruchu (podpis rysunku ćwiczenia) | ruchomy rysunek techniki ćwiczenia; w ms termin marketingowy „Animasi pergerakan” (jak w opisie sklepu), w el NIE „κινούμενα σχέδια” (kreskówki) |
| `przysiad` | przysiad | ćwiczenie przysiad (squat); w el zostaje angielska nazwa używana na siłowni |
| `wyciskanie_lezac` | wyciskanie leżąc | ćwiczenie wyciskanie leżąc (bench press); w el zostaje angielska nazwa używana na siłowni |
| `martwy_ciag` | martwy ciąg | ćwiczenie martwy ciąg (deadlift); w el zostaje angielska nazwa używana na siłowni |
| `telefon_es419` | telefon (urządzenie użytkownika) | telefon użytkownika; w es-419 potocznie „celular” (jak w aplikacji na telefonie), w es zostaje „teléfono” |
| `rysunek_zdanie` | rysunek (w zdaniu pod rysunkiem ćwiczenia: „Rysunek pokazuje ruch w jedną stronę…”) | rysunek techniki ćwiczenia w zdaniu opisującym, co pokazuje (recenzja lokalizacji 02.11.2026, pull_up C); słowo ma być takie samo jak w pozostałych podpisach rysunku w tym języku; w ms „Animasi” (rysunek jest animowany, jak w opisie sklepu), nie „lukisan” (obraz malowany) |
| `nastepne_powtorzenie` | następne powtórzenie (w zdaniu pod rysunkiem ćwiczenia: „w kolejnym powtórzeniu…”) | kolejne powtórzenie w tej samej serii (nie „następnym razem”, nie „następna liczba”); recenzja lokalizacji 02.11.2026, pull_up C |
| `nozyce` | nożyce (pozycja split w dwuboju) | jedna nazwa pozycji split w rwaniu, zarzucie i podrzucie (jedna stopa w przód, druga w tył); „wykrok” to osobne ćwiczenie (lunge) i nie opisuje pozycji przyjęcia sztangi. Dotyczy wskazówek dwuboju; pozostałe 33 języki wg przekładu z PL/EN (do potwierdzenia przez native speakerów) |
| `rack_kettlebell` | kettlebelle oparte przy barkach (pozycja rack) | pozycja kettlebelli (lub hantli) przy barkach i klatce; jedno brzmienie w całej partii siły i mocy: po polsku „oparte przy barkach”, bez obcego „pozycja rack” ani „w pozycji przy barku”; po angielsku „racked” |
| `szerokosc_stop` | stopy na szerokość bioder do barków | zakres szerokości ustawienia stóp: jedna forma we wszystkich wskazówkach („na szerokość bioder do barków”, jak w gob.stance i dl.feet); po angielsku „hip- to shoulder-width” |
| `core_en` | napnij tułów / brzuch (core) | napięcie tułowia przed ruchem; po angielsku na siłowni „core” (nie podręcznikowe „trunk”). Dotyczy wskazówek techniki; pozostałe języki wg przekładu z PL/EN |
| `jak_do_en` | jak do … (kalka „like for a …”) | polskie „jak do wyskoku / do przysiadu / do martwego ciągu” po angielsku to „like a squat”, „set up like a deadlift”, „jumping stance” — nie kalka „like for a …” |
| `ciezar` | ciężar | obciążenie podnoszone w serii (kg/lb); NIE masa ciała |
| `tasma_rozciaganie` | taśma (do rozciągania) | taśma lub pasek do rozciągania, ręcznik; NIE pas obciążeniowy (w aplikacji „pas” to sprzęt). Dotyczy wskazówek mobilności; pozostałe 33 języki wg przekładu z PL/EN (do uzupełnienia po recenzji native speakerów) |
| `krazenia` | krążenia (stawów) | ruch koliste w stawie (stopa, ramiona, nadgarstki), tak jak mówi się na sali: „krążenia”; NIE „zataczanie kół” |
| `podwijanie_miednicy` | podwijanie miednicy | cofanie miednicy pod siebie (zaokrąglenie dołu pleców); potocznie „podwijać miednicę”, jak w hang.ribs |
| `biodra` | biodra (część ciała; staw biodrowy) | biodra jako miejsce ruchu (wyprost, cofnięcie bioder, szerokość stóp „na szerokość bioder”); w ru/uk „бёдра”/„стегна” znaczą uda, w el „γοφοί” to potoczne „boki”; tam używamy „таз”/„таз”/„ισχία” (a szerokość stóp: „ширина таза”, „άνοιγμα λεκάνης”), jak w pozostałych wskazówkach tych języków |
| `uchwyt` | uchwyt (część sprzętu, ang. handle) | element, który trzymasz w dłoni na wyciągu, gumie albo sankach (ang. handle); NIE chwyt (sposób trzymania), NIE pięść, NIE nadgarstek |
| `nachwyt` | nachwyt (dłonie od góry, ang. overhand) | chwyt z dłońmi skierowanymi w dół; potoczna nazwa jak w innych kartach (martwy ciąg, podciąganie), bez terminu z podręcznika |
| `uda` | uda (część ciała) | uda jako miejsce przy którym zawisa ciężar (przed udami, przy udach, do ud); NIE nogi ani stopy |
| `funkcja_aplikacji` | funkcja aplikacji | funkcja (feature) aplikacji, np. opis kafelka Przewodnik „Co gdzie jest i jak działa”; NIE funkcja matematyczna |
| `lawka_skosna_glowa_w_dol` | ławka skośna głową w dół (ang. decline bench) | ławka z głową niżej niż biodra (decline bench); NIE ławka skośna głową w górę (incline), NIE ławka płaska |
| `tasmy_podwieszane` | taśmy do podwieszania | taśmy do ćwiczeń w podwieszeniu (sprzęt, na którym się ćwiczy: Suspended Push-Up); NIE taśma do rozciągania, NIE guma oporowa. Pozostałe 33 języki wg przekładu z PL/EN (do uzupełnienia po recenzji native speakerów) |
| `gwaltowne_blokowanie_lokci` | gwałtowne blokowanie łokci | błąd przy wyciskaniu: łokcie zatrzaskiwane w wyproście (wyprost sam w sobie jest celem ruchu); NIE „prostowanie rąk do końca”. Spójne z ohp.mis.lock i press.noLock. Pozostałe 33 języki wg przekładu z PL/EN |
| `miniguma` | miniguma | mała zamknięta guma zakładana na nogi (nad kolana albo na kostki) — nie długa guma z uchwytami (guma_oporowa obejmuje każdą gumę); recenzja lokalizacji A2, 08.11.2026 |
| `blokowanie_kolan_przeprost` | blokowanie kolan w przeproście | błąd albo wskazówka na prasie do nóg: blokowanie kolan w przeproście na górze; pełny wyprost sam nie jest błędem (recenzja lokalizacji A2, 08.11.2026; ta sama logika co gwałtowne blokowanie łokci z A1) |
| `lopatki_w_dol_i_do_tylu` | łopatki w dół i do tyłu | stała kolejność wskazówki o ustawieniu łopatek (ściągnięcie w dół i do tyłu); jedno brzmienie ułatwia przekład na 33 języki — recenzja lokalizacji A3, 09.11.2026 |
| `przodem_do_wyciagu` | stań przodem/bokiem do wyciągu | ustawienie przy wyciągu (linka, bloczek) — nie „maszyna”, bo maszyna z prowadnicą to w aplikacji osobny rodzaj sprzętu (pojęcia maszyna i wyciag); recenzja lokalizacji A3, 09.11.2026 |
| `wykrok_postawa` | stań w wykroku (jedna stopa z przodu, druga z tyłu) | pozycja wykroczna: jedna stopa z przodu, druga z tyłu (split stance) — NIE rozkrok na boki; recenzja lokalizacji B2, 09.11.2026 (decyzja właściciela 09.11.2026, L-123 wariant A: lista fałszywych przyjaciół) |
| `przodostopie` | oparta na palcach / przodostopie (ball of the foot) | oparcie stopy na przodostopiu (palce i śródstopie) — NIE cała podeszwa; recenzja lokalizacji B2, 09.11.2026 (decyzja właściciela 09.11.2026, L-123 wariant A: lista fałszywych przyjaciół) |
| `slidery` | ślizgacze (krążki ślizgowe pod pięty) | krążki ślizgowe pod pięty w ćwiczeniu na ślizgaczach — nie zjeżdżalnia ani część techniczna; recenzja lokalizacji B2, 09.11.2026 (decyzja właściciela 09.11.2026, L-123 wariant A: lista fałszywych przyjaciół) |
| `cofnij_biodra_zawias` | cofnij biodro/biodra | zawias biodrowy (ruch bioder w tył); w aplikacji „wypychając biodra w przód” to ruch swingu, a „wypchnij” to wyciskanie ciężaru nad głowę — recenzja lokalizacji A4a, 09.11.2026 |
| `lower_yourself_back_down` | wróć / opuść się | EN „lower back down” czyta się jak „lower back” (lędźwie, pojęcie ledzwie) — recenzja lokalizacji A4a, 09.11.2026 |
| `podloga_nie_podloze` | podłoga | we wskazówkach o lędźwiach odrywających się od podłoża mówimy „podłoga” (jak w pozostałych zdaniach partii) — recenzja lokalizacji A4a, 09.11.2026; inne użycia „podłoża” (miękkie podłoże, odpychanie się od podłoża) zostają |
| `pilka_gimnastyczna` | piłka gimnastyczna | duża piłka do ćwiczeń (stability ball) — przy pierwszym wspomnieniu na karcie z określeniem, bo gołe „piłka” to w aplikacji zwykle piłka lekarska (karty rzutów) — recenzja lokalizacji A4a, 09.11.2026; rozszerzone o ja, ko, it, es, es-419 — recenzja lokalizacji A4a, 09.11.2026: nazwa sprzętu w interfejsie (it „fitball”, es-419 „pelota de estabilidad”) i we wskazówkach ma być identyczna; w it samo „palla” po pierwszym wspomnieniu jest dopuszczalne |
| `pozycja_pompki` | podpór jak do pompki | pozycja wyjściowa jak do pompki (ręce wyprostowane, ciało w linii) w kartach suspRevCrunch i burpee; NIE deska na przedramionach (plank) — recenzja lokalizacji A4a, 09.11.2026; zakaz działa tylko przy polskim tekście z „podpór jak do pompki”, więc nie dotyka kart plank |
| `wyciag_gorny` | górny wyciąg | górny wyciąg (linka u góry), para do dolnego wyciągu (ja „ローケーブル” w kartach clat, cohp) — recenzja lokalizacji A4a, 09.11.2026 |

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
| `pl` | `nozyce` | wykrok | pozycja split w dwuboju to „nożyce”; „wykrok” to osobne ćwiczenie (lunge) i myli się z pozycją przyjęcia sztangi |
| `pl` | `rack_kettlebell` | pozycj\w*\s+rack\|(?<![\p{L}])rack(?![\p{L}])\|w\s+pozycji\s+przy\s+barku | pozycję kettlebelli opisuj jednym brzmieniem „oparte przy barkach” (bez „pozycja rack” i „w pozycji przy barku”) |
| `pl` | `szerokosc_stop` | między\s+szerokością\|mniej\s+więcej\s+od\s+szerokości\|bioder\s+a\s+barków\|do\s+szerokości\s+barków | zakres szerokości stóp zapisuj jedną formą „na szerokość bioder do barków” |
| `pl` | `ciezar` | (?<![\p{L}])(przenieś\|przenoś\|przenosz\w*\|przeniesienie)\s+ciężar\w*(?![\p{L}])\|ciężar\w*\s+ciała | w aplikacji „ciężar” to obciążenie na sztandze/hantlach, nie masa ciała; przeniesienie masy ciała opisz innym słowem (np. „pochyl się do ściany”) |
| `pl` | `tasma_rozciaganie` | (?<![\p{L}])pas(a\|em\|ie\|y\|ów)?(?![\p{L}]) | w aplikacji „pas” to pas obciążeniowy; do rozciągania mówi się „taśma” |
| `pl` | `krazenia` | zataczaj\|(?<![\p{L}])koła(?![\p{L}]) | na sali mówi się „krążenia / krąż”, nie „zataczaj koła” |
| `pl` | `podwijanie_miednicy` | odchylani\w*\s+miednicy\|tyłopochyl | język podręcznika; w siłowni mówi się „podwijać miednicę” |
| `pl` | `gwaltowne_blokowanie_lokci` | (?<!wałtowne )blokowanie łokci | samo „blokowanie łokci” czyta się jak „nie prostuj rąk do końca”; błędem jest gwałtowne zatrzaśnięcie |
| `pl` | `miniguma` | mał(a\|ą\|ej) gum | ten sam sprzęt miał w partii A2 dwie nazwy; jedna nazwa: miniguma |
| `pl` | `blokowanie_kolan_przeprost` | blokow\w* kolan\w* w pełnym wyproście | pełny wyprost nie jest błędem — błędem jest blokowanie w przeproście |
| `pl` | `lopatki_w_dol_i_do_tylu` | do tyłu i w dół | w partii A3 pojawiły się obie kolejności; jedno brzmienie: w dół i do tyłu |
| `pl` | `przodem_do_wyciagu` | przodem do maszyny | w zdaniu o wyciągu „maszyna” myli się z maszyną z prowadnicą (osobny sprzęt) |
| `pl` | `cofnij_biodra_zawias` | wypchn\w* biodr\w* w tył | „wypchnij” myli się z wyciskaniem i ruchem swingu; zawias to „cofnij biodra” |
| `pl` | `podloga_nie_podloze` | odryw\w* się od podłoża | „podłoże” brzmi jak instrukcja; w zdaniach o odrywaniu się od podłogi — „podłoga” |
| `en` | `nozyce` | (?<![\p{L}])lunge | pozycja przyjęcia sztangi w dwuboju to „split”; „lunge” to osobne ćwiczenie |
| `en` | `szerokosc_stop` | between\s+hip(-\|\s)(and\|to)?\s*shoulder\|somewhere\s+between\|hip\s+and\s+shoulder\s+width | zakres szerokości stóp zapisuj jedną formą „hip- to shoulder-width”, jak w gob.stance i dl.feet |
| `en` | `core_en` | (?<![\p{L}])trunk(?![\p{L}]) | „trunk” brzmi podręcznikowo; na siłowni mówi się „core” |
| `en` | `jak_do_en` | like\s+for\s+(a\|an\|the)\s | kalka z polskiego „jak do …”; rodzimy mówca mówi „like a squat”, „set up like a deadlift” |
| `en` | `ciezar` | (?<![\p{L}])shift(ing)?\s+(your\s+)?weight(?![\p{L}]) | w aplikacji „weight” to obciążenie, nie masa ciała; przeniesienie masy ciała opisz ruchem („lean toward the wall”) |
| `en` | `tasma_rozciaganie` | (?<![\p{L}])(belt\|sash)s?(?![\p{L}]) | „belt” to pas obciążeniowy; do rozciągania „strap” |
| `en` | `podwijanie_miednicy` | posterior\s+pelvic\s+tilt\|tilt(ing)?\s+(your\s+)?pelvis\s+back | język podręcznika; potocznie „tuck your pelvis” |
| `en` | `gwaltowne_blokowanie_lokci` | locking out (the \|your )?elbows | w EN „lockout” to cel wyciskania; błędem jest gwałtowne zatrzaśnięcie (snapping into lockout) |
| `en` | `lopatki_w_dol_i_do_tylu` | shoulder blades back and down | jedno brzmienie jak w PL: down and back (recenzja lokalizacji A3) |
| `en` | `przodem_do_wyciagu` | facing the machine | jak w PL: przy wyciągu „stack” albo „cable”, nie „machine” |
| `en` | `lower_yourself_back_down` | lower back (down\|up)(?![\p{L}]) | zderza się z terminem „lower back” (lędźwie) |
| `cs` | `przerwa` | přestávk | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `cs` | `przerwa_robocza` | pracovní pauza | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `cs` | `dzien_wolny` | pauz | „pauza” to przerwa/pauza, nie dzień wolny |
| `cs` | `pauza_treningu` | pauz | „pauza” to przerwa między seriami; pauzę treningu opisuje „pozastavit” |
| `cs` | `faza_pauza` | pauz | rdzeń przerwy między seriami (decyzja K1, 09.10.2026) — w tej samej karcie myliłby fazę z przerwą |
| `cs` | `faza_pauza` | pozastav | czasownik/przycisk wstrzymania, a faza to zatrzymanie w pozycji |
| `cs` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `sk` | `przerwa` | prestávk | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `sk` | `przerwa_robocza` | pracovná pauza | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sk` | `dzien_wolny` | pauz | „pauza” to przerwa/pauza, nie dzień wolny |
| `sk` | `pauza_treningu` | pauz | „pauza” to przerwa między seriami; pauzę treningu opisuje „pozastaviť” |
| `sk` | `faza_pauza` | pauz | rdzeń przerwy między seriami (decyzja K1, 09.10.2026) — w tej samej karcie myliłby fazę z przerwą |
| `sk` | `faza_pauza` | pozastav | czasownik/przycisk wstrzymania, a faza to zatrzymanie w pozycji |
| `sk` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `hu` | `przerwa` | szünet | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `hu` | `przerwa_robocza` | munkapihenő\|munkaszünet | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `hu` | `faza_pauza` | szüneteltet | to polecenie przycisku pauzy treningu, a faza jest rzeczownikiem |
| `hu` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `hu` | `plan_dozywotni` | örök(?!ös\|re) | „Örök” znaczy wieczny (poetycko); plan bez terminu to „örökös” |
| `hu` | `rysunek_zdanie` | (?<![\p{L}])ábra | w pozostałych podpisach rysunku ćwiczenia plik hu używa „rajz”; „ábra” to wykres / rycina w publikacji |
| `hu` | `wykrok_postawa` | terpesz | „terpesz” to rozkrok na boki (szeroka postawa: sumo, swing), nie pozycja z jedną stopą z przodu |
| `ro` | `przerwa` | recrea[țt]i | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `ro` | `przerwa_robocza` | pauz[ăa] de lucru | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ro` | `dzien_wolny` | pauz | „pauză” to pauza, nie dzień wolny („zi liberă”) |
| `ro` | `pauza_treningu` | pauz | „pauză” to przerwa między seriami; pauza treningu to „întrerupe” |
| `ro` | `faza_pauza` | pauz | rdzeń przerwy między seriami (decyzja K1, 09.10.2026) — w tej samej karcie myliłby fazę z przerwą |
| `ro` | `faza_pauza` | întrerup | czasownik/przycisk przerwania, a faza to zatrzymanie w pozycji |
| `ro` | `faza_pauza` | oprire | brzmi jak przycisk stop, a nie zatrzymanie w pozycji |
| `ro` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `ro` | `faza_ruchu` | ^\s*trac[țţ]iun[ei]?\s*$ | „tracțiuni” to w ro nazwa ćwiczenia (podciąganie na drążku); faza animacji to rzeczownik odczasownikowy jak Coborâre, Împingere (przegląd API 31.10.2026) |
| `ro` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `ro` | `slidery` | glisoar | „glisor” to część techniczna (suwak, prowadnica), nie krążek ślizgowy |
| `bg` | `przerwa_robocza` | работна почивка | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `bg` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `bg` | `nachwyt` | пронир | podręcznikowe; w pozostałych kartach jest „прав хват” |
| `hr` | `przerwa` | pauz | „pauza” to pauza treningu, nie przerwa między seriami (odmor) |
| `hr` | `przerwa_robocza` | radni odmor\|radna pauza | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `hr` | `faza_pauza` | pauziraj | tryb rozkazujący to przycisk, a faza jest rzeczownikiem |
| `hr` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `hr` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `sl` | `przerwa` | odmor | „odmor” znaczy urlop/wakacje; między seriami „počitek” |
| `sl` | `przerwa_robocza` | delovni počitek | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sl` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `sl` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `sl` | `plan_subskrypcji` | načrt | „Načrt” to plan tygodnia (zakładka Plan); wariant subskrypcji to „Paket” |
| `sr` | `przerwa` | пауз | „пауза” to pauza treningu, nie przerwa między seriami (одмор) |
| `sr` | `przerwa_robocza` | радни одмор\|радна пауза | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sr` | `faza_pauza` | паузирај | tryb rozkazujący to przycisk, a faza jest rzeczownikiem |
| `sr` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `sr` | `kettlebell` | kettlebell | serbski tekst jest cyrylicą; w kartach jest „кетлбел”, nie łacinka |
| `lt` | `przerwa` | pertrauk | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `lt` | `przerwa_robocza` | darbinis poilsis | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `lt` | `faza_pauza` | pristabd | czasownik/przycisk wstrzymania, a faza jest rzeczownikiem |
| `lt` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `lt` | `rysunek_zdanie` | brėžin | w pozostałych podpisach rysunku ćwiczenia plik lt używa „piešinys”; „brėžinys” to rysunek techniczny / kreślarski |
| `lv` | `przerwa` | starpbr[īi]\|pārtraukum | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `lv` | `przerwa_robocza` | darba atpūta | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `lv` | `faza_pauza` | aptur | czasownik/przycisk zatrzymania, a faza jest rzeczownikiem |
| `lv` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `lv` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `et` | `przerwa` | vaheaeg\|vahetund | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `et` | `przerwa_robocza` | tööpaus | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `et` | `pauza_treningu` | paus(?!eeri) | „paus” to przerwa między seriami; pauza treningu to „peata” |
| `et` | `faza_pauza` | paus | rdzeń przerwy między seriami (decyzja K1, 09.10.2026) — w tej samej karcie myliłby fazę z przerwą |
| `et` | `faza_pauza` | peat | czasownik/przycisk zatrzymania, a faza to zatrzymanie w pozycji |
| `et` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `et` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `et` | `plan_subskrypcji` | plaan | „Plaan” to plan tygodnia (zakładka Plan); wariant subskrypcji to „Pakett” |
| `et` | `plan_dozywotni` | igavene | „Igavene” znaczy wieczny (religijnie/poetycko); plan bez terminu to „eluaegne” |
| `uk` | `przerwa` | перерв | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `uk` | `przerwa_robocza` | відпочинок у робочих | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `uk` | `faza_pauza` | призупин | czasownik/przycisk wstrzymania, a faza jest rzeczownikiem |
| `uk` | `seria` | серія | „серія” to odcinek; podejście to „підхід” |
| `uk` | `zakres_powtorzen` | інтервал | „інтервал” to przerwa/trening interwałowy; zakres to „діапазон” |
| `uk` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `uk` | `biodra` | (?<![\p{L}])стег(на\|он\|нами\|нах\|нам)(?![\p{L}]) | „стегна” to uda; biodra/miednicę w ruchu nazywaj „таз” (jak w pozostałych wskazówkach) |
| `uk` | `uda` | (?<![\p{L}])(перед\|до\|біля) ног(ами\|ам\|и\|ою\|і)?(?![\p{L}])\|біля ніг | „ноги” to nogi aż do stóp; uda to „стегна” (jak w front.setup, lat.setup) |
| `es` | `przerwa` | receso\|laboral | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `es` | `przerwa_robocza` | descanso (laboral\|de trabajo) | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `es` | `faza_pauza` | pausar | bezokolicznik to przycisk, a faza jest rzeczownikiem |
| `es` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `es` | `lokcie_waskie` | codos juntos | „juntos” = łokcie stykają się ze sobą; chodzi o łokcie przy tułowiu (cerrados) |
| `es` | `pozycja_pompki` | plancha | „plancha” to deska na przedramionach (plank), nie podpór jak do pompki; karta ma w setupie „posición de flexión” |
| `es-419` | `przerwa` | receso\|laboral | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `es-419` | `przerwa_robocza` | descanso (laboral\|de trabajo) | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `es-419` | `trening` | entrenos?(?![\p{L}]) | „entreno” to hiszpańskie (Hiszpania) potoczne skrócenie; w Ameryce Łacińskiej mówi się „entrenamiento” |
| `es-419` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `es-419` | `lokcie_waskie` | codos juntos | „juntos” = łokcie stykają się ze sobą; chodzi o łokcie przy tułowiu (cerrados) |
| `es-419` | `telefon_es419` | teléfono | w Ameryce Łacińskiej mówi się „celular”; „teléfono” brzmi jak wariant z Hiszpanii i rozjeżdża się z resztą aplikacji (101 G2, 29.10.2026) |
| `es-419` | `uchwyt` | (?<![\p{L}])maneral(es)?(?![\p{L}]) | jedno słowo w całym pliku: uchwyt wyciągu to „agarre”, nie „maneral” (decyzja koordynatora 04.11.2026); „mangos” zostaje tylko przy sankach (sled.pushGrip) |
| `pt` | `przerwa` | (?<![\p{L}])pausa(?![\p{L}]) | „pausa” to pauza treningu; między seriami „descanso” |
| `pt` | `przerwa_robocza` | descanso de trabalho | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `pt` | `faza_pauza` | pausar | bezokolicznik to przycisk, a faza jest rzeczownikiem |
| `pt` | `zakres_powtorzen` | intervalo | „intervalo” w siłowni to przerwa między seriami; zakres to „gama” |
| `pt` | `zakres_ruchu` | intervalo | „intervalo” to przerwa; zakres ruchu to „amplitude” |
| `pt` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `pt` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `pt` | `lokcie_waskie` | cotovelos juntos | „juntos” = łokcie stykają się ze sobą; chodzi o łokcie przy tułowiu (fechados) |
| `pt` | `uchwyt` | (?<![\p{L}])punhos?(?![\p{L}]) | „punho” to pięść albo mankiet (w pt-BR nadgarstek), nie uchwyt wyciągu; uchwyt to „pega” |
| `pt` | `pozycja_pompki` | prancha | „prancha” to deska (plank), nie podpór jak do pompki; karta ma w setupie „posição de flexão” |
| `pt-BR` | `przerwa` | (?<![\p{L}])pausa(?![\p{L}]) | „pausa” to pauza treningu; między seriami „descanso” |
| `pt-BR` | `przerwa_robocza` | descanso de trabalho | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `pt-BR` | `zakres_powtorzen` | intervalo | w Brazylii „intervalo” to przerwa między seriami (i przerwa w pracy/szkole); zakres to „faixa” |
| `pt-BR` | `zakres_ruchu` | intervalo | „intervalo” to przerwa; zakres ruchu to „amplitude” |
| `pt-BR` | `deload` | descarga | „descarga” to spłuczka/wyładowanie; w Brazylii mówi się „deload” |
| `pt-BR` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `pt-BR` | `lokcie_waskie` | cotovelos juntos | „juntos” = łokcie stykają się ze sobą; chodzi o łokcie przy tułowiu (fechados) |
| `pt-BR` | `pozycja_pompki` | prancha | „prancha” to deska (plank), nie podpór jak do pompki; karta ma w setupie „posição de flexão” |
| `de` | `przerwa` | Unterbrechung\|Arbeitspause | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `de` | `przerwa_robocza` | Arbeitspause | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `de` | `pauza_treningu` | Pause | „Pause” to przerwa między seriami; pauzę treningu opisuje „anhalten” |
| `de` | `faza_pauza` | pause | rdzeń przerwy między seriami (decyzja K1, 09.10.2026) — w tej samej karcie myliłby fazę z przerwą |
| `de` | `faza_pauza` | anhalt\|angehalten | czasownik/przycisk „anhalten”, a faza to zatrzymanie w pozycji |
| `de` | `seria` | Serie | „Serie” to serial/seria produktów; podejście to „Satz” |
| `de` | `zakres_powtorzen` | Intervall | „Intervall” to trening interwałowy; zakres to „Bereich” |
| `de` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `fr` | `przerwa` | pause | „pause” to przerwa w pracy; w sali mówi się „repos” |
| `fr` | `przerwa_robocza` | pause de travail | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `fr` | `faza_pauza` | mettre en pause | polecenie przycisku, a faza jest rzeczownikiem |
| `fr` | `zakres_powtorzen` | intervalle | „intervalle” bywa przerwą; zakres to „plage”/„fourchette” |
| `fr` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `fr` | `lokcie_otwarte` | très écartés | „très” znaczy „bardzo”; chodzi o „za bardzo” (trop écartés) |
| `it` | `przerwa_robocza` | pausa (di )?lavoro | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `it` | `faza_pauza` | metti in pausa | polecenie przycisku, a faza jest rzeczownikiem |
| `it` | `zakres_powtorzen` | intervall | „intervallo” bywa przerwą; zakres powtórzeń to „range” |
| `it` | `zakres_ruchu` | intervall | „intervallo” bywa przerwą; zakres ruchu to „escursione” |
| `it` | `szablon` | modell | w włoskich siłowniach „scheda” |
| `it` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `it` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `nl` | `przerwa` | pauze | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `nl` | `przerwa_robocza` | werkpauze | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `nl` | `faza_pauza` | pauzeren | bezokolicznik to przycisk, a faza jest rzeczownikiem |
| `nl` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „set” |
| `nl` | `zakres_powtorzen` | interval | „interval” to trening interwałowy; zakres to „bereik” |
| `nl` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `nl` | `wykrok_postawa` | spreidstand | „spreidstand” to stopy rozstawione na boki, nie pozycja z jedną stopą z przodu |
| `sv` | `przerwa` | (?<![\p{L}])rast(?![\p{L}]) | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `sv` | `przerwa_robocza` | arbetspaus | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `sv` | `faza_pauza` | pausa | bezokolicznik/polecenie przycisku, a faza jest rzeczownikiem |
| `sv` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „set” |
| `sv` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `sv` | `rysunek_zdanie` | (?<![\p{L}])bild | w pozostałych podpisach rysunku ćwiczenia plik sv używa „teckning”; „bild” to dowolny obraz lub zdjęcie, nie rysunek |
| `sv` | `nachwyt` | (?<![\p{L}])övergrep | fałszywy przyjaciel: znaczy nadużycie lub napaść, nie chwyt; poprawnie „överhandsgrepp” (recenzja lokalizacji 09.11.2026) |
| `sv` | `przodostopie` | fotblad | „fotblad” to cała podeszwa, a chodzi o oparcie na przodostopiu |
| `da` | `przerwa` | frikvarter | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `da` | `przerwa_robocza` | arbejdspause | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `da` | `faza_pauza` | på pause | zwrot przycisku wstrzymania, a faza jest rzeczownikiem |
| `da` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „sæt” |
| `da` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `da` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `da` | `nachwyt` | (?<![\p{L}])overgreb | fałszywy przyjaciel: znaczy nadużycie lub napaść, nie chwyt; poprawnie „overhåndsgreb” (recenzja lokalizacji 09.11.2026) |
| `nb` | `przerwa` | friminutt\|lunsj | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `nb` | `przerwa_robocza` | arbeidspause | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `nb` | `faza_pauza` | på pause | zwrot przycisku wstrzymania, a faza jest rzeczownikiem |
| `nb` | `seria` | (?<![\p{L}])serie(?![\p{L}]) | „serie” to serial; podejście to „sett” |
| `nb` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `nb` | `nachwyt` | (?<![\p{L}])overgrep | fałszywy przyjaciel: znaczy nadużycie lub napaść, nie chwyt; poprawnie „overhåndsgrep” (recenzja lokalizacji 09.11.2026) |
| `fi` | `przerwa_robocza` | työtauko | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `fi` | `faza_pauza` | keskeytä | tryb rozkazujący to przycisk przerwania, a faza jest rzeczownikiem |
| `fi` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `tr` | `przerwa` | (?<![\p{L}])mola | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `tr` | `przerwa_robocza` | iş molası\|çalışma molası | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `tr` | `faza_pauza` | duraklat | tryb rozkazujący to przycisk, a faza jest rzeczownikiem |
| `tr` | `seria` | (?<![\p{L}])seri(?![\p{L}]) | „seri” to seria/szybki; podejście to „set” |
| `tr` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `tr` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `tr` | `lawka_skosna_glowa_w_dol` | (?<!ters )(?<![\p{L}])eğimli sehpa | samo „eğimli sehpa” to też ławka skośna głową w górę (incline); przy głowie w dół ma być „ters eğimli sehpa” (recenzja T1b, 05.11.2026) |
| `el` | `przerwa_robocza` | διάλειμμα εργασίας | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `el` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `el` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `el` | `plan_subskrypcji` | πρόγραμμ | „Πρόγραμμα” to plan tygodnia (zakładka Plan); wariant subskrypcji to „Πλάνο” |
| `el` | `animacja_ruchu` | κινούμενα σχέδια | „κινούμενα σχέδια” znaczy kreskówki / film animowany, nie rysunek ruchu ćwiczenia |
| `el` | `wyciskanie_lezac` | πιέσεις\s+πάγκου | „πιέσεις πάγκου” to kalka; w el zalecane bench press, tak mówi się na siłowni |
| `el` | `martwy_ciag` | (?<![\p{L}])(άρσεις\|νεκρή\s+άρση)(?![\p{L}]) | „άρσεις” to ogólne podnoszenia, „νεκρή άρση” to kalka; w el zalecane deadlift |
| `el` | `biodra` | (?<![\p{L}])γοφ(οί\|ούς\|ών\|οίς)(?![\p{L}]) | „γοφοί” to potoczne „boki”; biodra w ruchu nazywaj „ισχία”, szerokość stóp „άνοιγμα λεκάνης” (jak w pozostałych wskazówkach) |
| `id` | `przerwa` | jeda | „jeda” to pauza (treningu); między seriami „istirahat” |
| `id` | `przerwa_robocza` | istirahat kerja | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `id` | `seria` | (?<![\p{L}])seri(?![\p{L}]) | „seri” to serial; podejście to „set” |
| `id` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `id` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `id` | `pozycja_posrednia` | sedang berjalan | słowo statusu („w toku”), z numerem czyta się jak stan zadania, nie jak pozycja rysunku |
| `id` | `nachwyt` | (?<![\p{L}])overhand(?![\p{L}]) | w pozostałych kartach jest „genggaman atas”, nie angielskie „overhand” |
| `ms` | `przerwa` | jeda | „jeda” to pauza (treningu); między seriami „rehat” |
| `ms` | `przerwa_robocza` | rehat kerja | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ms` | `seria` | (?<![\p{L}])siri(?![\p{L}]) | „siri” to serial; podejście to „set” |
| `ms` | `chwyt` | (?<![\p{L}])grips?(?![\p{L}]) | chwyt na uchwycie nazywaj rodzimym słowem używanym w pozostałych wskazówkach tego języka, bez angielskiego „grip” |
| `ms` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `ms` | `pozycja_posrednia` | sedang berjalan | słowo statusu („w toku”), z numerem czyta się jak stan zadania, nie jak pozycja rysunku |
| `ms` | `animacja_ruchu` | lukisan pergerakan | termin marketingowy w opisie sklepu to „animasi pergerakan”; „lukisan” to obraz malowany, nie animacja |
| `ms` | `rysunek_zdanie` | lukisan | rysunek techniki jest animowany; w opisie sklepu i podpisie „Animasi pergerakan”; „lukisan” to obraz malowany, nie animacja |
| `ms` | `funkcja_aplikacji` | (?<![\p{L}])fungsi(?![\p{L}]) | „fungsi” to funkcja matematyczna/techniczna; funkcja aplikacji to „ciri” (czasownik „berfungsi” = działa jest poprawny) |
| `ms` | `slidery` | pelungsur | „pelungsur” to przede wszystkim zjeżdżalnia (plac zabaw), nie krążek ślizgowy |
| `vi` | `przerwa` | giải lao | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `vi` | `przerwa_robocza` | nghỉ giải lao\|nghỉ làm việc | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `vi` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `vi` | `pozycja_posrednia` | đang diễn ra | słowo statusu („w toku”), z numerem czyta się jak stan zadania, nie jak pozycja rysunku |
| `vi` | `rysunek_zdanie` | hình vẽ | w pozostałych podpisach rysunku ćwiczenia plik vi używa „hình minh họa” |
| `ru` | `przerwa` | перерыв | znaczy przerwę w pracy/szkole, nie odpoczynek między seriami |
| `ru` | `przerwa_robocza` | рабочий отдых | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ru` | `seria` | серия | „серия” to odcinek/seria produktów; podejście to „подход” |
| `ru` | `zakres_powtorzen` | интервал | „интервал” to przerwa/trening interwałowy; zakres to „диапазон” |
| `ru` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `ru` | `pozycja_posrednia` | в процессе | słowo statusu („w toku”), z numerem czyta się jak stan zadania, nie jak pozycja rysunku |
| `ru` | `biodra` | (?<![\p{L}])(бёдр\p{L}*\|бёдер)(?![\p{L}]) | „бёдра” to uda; biodra/miednicę w ruchu nazywaj „таз” (jak w pozostałych wskazówkach) |
| `ru` | `uda` | (?<![\p{L}])(перед\|к\|у) ног(ами\|ам\|и\|ой\|е)?(?![\p{L}]) | „ноги” to nogi aż do stóp; uda to „бёдра” (jak w front.setup, lat.setup) |
| `ru` | `lawka_skosna_glowa_w_dol` | наклонн\p{L}*\s+скамь | „наклонная скамья” to też ławka skośna głową w górę (incline); ławka głową w dół to „скамья с обратным наклоном” (recenzja T1b, 05.11.2026) |
| `ja` | `przerwa` | 休憩 | 休憩 to przerwa w pracy/szkole; na siłowni między seriami mówi się インターバル |
| `ja` | `przerwa_robocza` | 仕事の\|休憩 | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ja` | `przerwa_po_rozgrzewce` | 休憩 | 休憩 to przerwa w pracy/szkole; na siłowni インターバル |
| `ja` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `ja` | `plan_dozywotni` | 永久版 | „永久版” brzmi jak wersja edycji; zakup jednorazowy to „買い切り” |
| `ja` | `zegarek` | 腕時計 | zwykły zegarek na rękę; dla Apple Watch w aplikacjach treningowych mówi się „ウォッチ” |
| `ja` | `lokcie_otwarte` | 肘を広げ | o łokciach przy wyciskaniu mówi się 開く (otwierać), nie 広げる (rozkładać) |
| `ja` | `lokcie_waskie` | 肘を狭く | kalka z „wąsko”; na siłowni mówi się 肘を締める |
| `ja` | `rysunek_zdanie` | イラスト | w pozostałych podpisach rysunku ćwiczenia plik ja używa „図”; „イラスト” to ilustracja (ozdobna), nie rysunek techniki |
| `ja` | `nachwyt` | オーバーハンド | w pozostałych kartach jest „順手”, nie katakanowe „オーバーハンドグリップ” |
| `ja` | `wyciag_gorny` | 上のケーブル | nienaturalne w siłowni; para do istniejącego „ローケーブル” to „ハイケーブル” |
| `ko` | `przerwa` | 점심\|휴게 | dotyczy przerwy obiadowej/pokoju socjalnego |
| `ko` | `przerwa_robocza` | 업무 휴식 | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `ko` | `szablon` | 템플릿 | w koreańskich siłowniach „루틴” |
| `ko` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `ko` | `plan_subskrypcji` | 플랜 | „플랜” to plan tygodnia (zakładka Plan); wariant subskrypcji to „요금제” |
| `ko` | `plan_dozywotni` | 영구 | „영구” brzmi jak trwałe/nieodwracalne; zakup bez terminu to „평생 이용” |
| `ko` | `zegarek` | 시계 | zwykły zegar/zegarek; dla Apple Watch w aplikacjach treningowych mówi się „워치” |
| `ko` | `nastepne_powtorzenie` | 다음 횟수 | „횟수” to liczba razy (dosłownie „następna liczba”), nie kolejne powtórzenie; w słowniku powtórzenie to „반복” |
| `zh-Hant` | `przerwa_robocza` | 工作休息\|上班 | kalka „robocza” = „w pracy”: znaczy przerwę w pracy; chodzi o przerwę po seriach roboczych |
| `zh-Hant` | `deload` | 減量 | „減量” w tajwańskim żargonie siłowni znaczy odchudzanie (redukcję); deload to „減載” |
| `zh-Hant` | `ramie` | (?<![\p{L}])upper arms?(?![\p{L}]) | Zostało angielskie „upper arm” z placeholdera słownika (przekład API 09.11.2026: vi preacher.arms, rotator_cuff.cubanRotate); użyj terminu zalecanego dla tego języka. |
| `zh-Hant` | `pozycja_posrednia` | 進行中 | słowo statusu („w toku”), z numerem czyta się jak stan zadania, nie jak pozycja rysunku |
| `zh-Hant` | `pozycja_pompki` | 撐體 | „撐體姿勢” zmienia termin w obrębie karty; setup i burpee mają „伏地挺身姿勢” |

## Do potwierdzenia przez native speakera (156)

Pytanie do każdego: czy tak powiedziałby trener albo kolega na siłowni w tym języku? Jeśli nie — jak mówi się naprawdę? (Lista z docs/16.)

| język | pojęcie | obecny termin | wątpliwość |
|---|---|---|---|
| `pl` | `zegarek` | zegarek | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `en` | `zegarek` | watch | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `cs` | `ramie` | nadloktí | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `cs` | `zegarek` | hodinky | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `cs` | `lokcie_waskie` | lokty úzko | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `cs` | `pozycja_posrednia` | Mezipoloha | „Mezipoloha” czy „Střední poloha”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `cs` | `lawka_skosna_glowa_w_dol` | lavice s negativním sklonem | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): lavice s negativním sklonem czy lavice se sklonem hlavou dolů |
| `sk` | `ramie` | nadlaktie | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `sk` | `zegarek` | hodinky | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sk` | `lokcie_waskie` | lakte úzko | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `sk` | `pozycja_posrednia` | Medzipoloha | „Medzipoloha” czy „Stredná poloha”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `sk` | `lawka_skosna_glowa_w_dol` | lavička s negatívnym sklonom | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): lavička s negatívnym sklonom czy lavička so sklonom hlavou nadol |
| `hu` | `seria` | Sorozat | w siłowniach używa się też „széria”/„szett”; do potwierdzenia przez native speakera |
| `hu` | `asekuracja` | Biztosítás | „biztosítás” bywa ubezpieczeniem — do potwierdzenia |
| `hu` | `ramie` | felkar | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `hu` | `zegarek` | óra | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `hu` | `lokcie_waskie` | szűk könyök | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `hu` | `pozycja_posrednia` | Köztes helyzet | Szyk numeru: „Köztes helyzet 1” czy „1. köztes helyzet”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `hu` | `lawka_skosna_glowa_w_dol` | negatív pad | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): negatív pad czy lefelé lejtő pad |
| `hu` | `wykrok_postawa` | kitöréses állás | do native speakera: „kitöréses állás” albo „lépőállás” |
| `ro` | `do_upadku` | Până la epuizare | w siłowniach też „până la cedare”; do potwierdzenia |
| `ro` | `asekuracja` | Siguranță și asigurare | do potwierdzenia przez native speakera |
| `ro` | `ramie` | braț | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `ro` | `zegarek` | ceas | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ro` | `lawka_skosna_glowa_w_dol` | bancă înclinată cu capul în jos | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): brak potwierdzonego terminu siłowni |
| `bg` | `ramie` | мишница | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `bg` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `bg` | `jednostka_dystansu_mi` | мили | Skrót nieodmienny „мили” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `bg` | `jednostka_dystansu_yd` | ярд | Skrót nieodmienny „ярд” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `bg` | `zegarek` | часовник | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `bg` | `lawka_skosna_glowa_w_dol` | наклонена пейка с главата надолу | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): brak potwierdzonego terminu siłowni |
| `hr` | `asekuracja` | Sigurnost i asistencija | do potwierdzenia przez native speakera |
| `hr` | `ramie` | nadlaktica | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `hr` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `hr` | `ledzwie` | donji dio leđa | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `hr` | `zegarek` | sat | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `hr` | `lokcie_waskie` | laktove usko | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `hr` | `lawka_skosna_glowa_w_dol` | kosa klupa | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): kosa klupa glavom prema dolje czy negativna klupa |
| `sl` | `faza_pauza` | Premor | Tłumacz (31.10.2026) proponuje „Pavza” — „premor” bliższy przerwie/odpoczynkowi niż zatrzymaniu w ruchu; przegląd API tego nie zgłosił. Do sprawdzenia przez native speakera; bez zmiany. |
| `sl` | `ramie` | nadlaket | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `sl` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `sl` | `ledzwie` | ledveni del hrbta | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `sl` | `zegarek` | ura | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sl` | `lokcie_waskie` | komolce ozko | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `sl` | `lawka_skosna_glowa_w_dol` | klop, nagnjena navzdol | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): brak potwierdzonego terminu siłowni |
| `sr` | `asekuracja` | Асистенција и безбедност | do potwierdzenia przez native speakera |
| `sr` | `ramie` | надлактица | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `sr` | `ledzwie` | donji deo leđa | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `sr` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `sr` | `jednostka_masy_lb` | фнт | Skrót funta w piśmie lokalnym: czy „фнт” jest używany, czy ludzie piszą „lb”? (imperialny rzadko w tym regionie) |
| `sr` | `jednostka_dystansu_mi` | миља | Skrót nieodmienny „миља” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `sr` | `jednostka_dystansu_yd` | јарда | Skrót nieodmienny „јарда” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `sr` | `zegarek` | сат | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sr` | `lokcie_waskie` | лактове уско | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `sr` | `pozycja_posrednia` | Међуположај | „Међуположај” czy „Средњи положај”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `sr` | `lawka_skosna_glowa_w_dol` | коса клупа | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): коса клупа главом надоле czy негативна клупа |
| `lt` | `zakres_powtorzen` | pakartojimų intervalas | „intervalas” bywa przerwą; w siłowniach też „diapazonas” — do potwierdzenia |
| `lt` | `do_upadku` | Iki nesėkmės | do potwierdzenia przez native speakera |
| `lt` | `asekuracja` | Pagalba ir saugumas | do potwierdzenia przez native speakera |
| `lt` | `ramie` | žastas | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `lt` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). Odmiana jak w pliku: kettlebell'as, kettlebell'ą, kettlebell'ai (z apostrofem). |
| `lt` | `ledzwie` | apatinė nugaros dalis | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `lt` | `zegarek` | laikrodis | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `lt` | `lokcie_waskie` | alkūnes siaurai | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `lt` | `lawka_skosna_glowa_w_dol` | suolas, pasvirusio galva žemyn | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): brak potwierdzonego terminu siłowni |
| `lv` | `seria` | Sērija | „sērija” = seria/odcinek; w siłowniach też „pieeja” — do potwierdzenia |
| `lv` | `ramie` | augšdelms | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `lv` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). Odmiana jak w pliku: kettlebells, kettlebellu, kettlebelli. |
| `lv` | `ledzwie` | lejasmugura | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `lv` | `zegarek` | pulkstenis | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `lv` | `lokcie_waskie` | elkoņus šauri | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `lv` | `lawka_skosna_glowa_w_dol` | sols ar slīpumu uz leju | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): brak potwierdzonego terminu siłowni |
| `et` | `do_upadku` | Kuni väsimuseni | „väsimuseni” = do zmęczenia; do potwierdzenia |
| `et` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `et` | `ledzwie` | alaselg | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `et` | `zegarek` | käekell | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `et` | `lawka_skosna_glowa_w_dol` | allapoole kaldu pink | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): allapoole kaldu pink czy negatiivne pink |
| `uk` | `asekuracja` | Страхування | „страхування” bywa ubezpieczeniem; w siłowniach też „страховка”/„спотінг” — do potwierdzenia |
| `uk` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `uk` | `jednostka_masy_lb` | фнт | Skrót funta w piśmie lokalnym: czy „фнт” jest używany, czy ludzie piszą „lb”? (imperialny rzadko w tym regionie) |
| `uk` | `jednostka_dystansu_mi` | ми | Skrót nieodmienny „ми” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `uk` | `jednostka_dystansu_yd` | ярд | Skrót nieodmienny „ярд” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `uk` | `zegarek` | годинник | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `uk` | `lokcie_waskie` | лікті вузько | O łokciach w wąskim wyciskaniu i prostowaniu: „держи локти узко / тримай лікті вузько” czy „локти собраны, не разводи / лікті зібрані, не розводь”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `uk` | `lawka_skosna_glowa_w_dol` | лава зі зворотним нахилом | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): лава зі зворотним нахилом (do potwierdzenia) |
| `es` | `zegarek` | reloj | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `es-419` | `zegarek` | reloj | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `es-419` | `pilka_gimnastyczna` | pelota de estabilidad | do potwierdzenia przez native speakera: interfejs ma „pelota de estabilidad” (kalka z angielskiego) — czy w Ameryce Łacińskiej naturalniejsze jest „pelota de ejercicio” albo „pelota suiza”? Zmiana wymaga zmiany także etykiety sprzętu w UI |
| `pt` | `zakres_powtorzen` | gama de repetições | w Portugalii „intervalo” = przerwa między seriami, więc „gama”; do potwierdzenia przez native speakera |
| `pt` | `szablon` | Modelo | „modelo” jest ogólne; w siłowniach „ficha/plano de treino” — do potwierdzenia |
| `pt` | `chwyt` | pega | do sprawdzenia przez native speakera: czy „pega” to potoczny termin siłowni (recenzja P2, 04.11.2026); dotąd tymczasowo angielskie „grip” |
| `pt` | `zegarek` | relógio | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `pt-BR` | `szablon` | Modelo | „modelo” jest ogólne; w siłowniach „ficha” — do potwierdzenia |
| `pt-BR` | `zegarek` | relógio | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `de` | `zegarek` | Uhr | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `fr` | `zegarek` | montre | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `it` | `zakres_powtorzen` | range di ripetizioni | „range” to potoczne w siłowni; „intervallo” bywa przerwą — do potwierdzenia |
| `it` | `zegarek` | orologio | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `nl` | `zegarek` | horloge | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `nl` | `lawka_skosna_glowa_w_dol` | declinebank | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): declinebank czy afhellende bank |
| `nl` | `wykrok_postawa` | lunge-houding | do native speakera: „lunge-houding” albo „uitvalspas-houding” |
| `sv` | `zegarek` | klocka | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `sv` | `lawka_skosna_glowa_w_dol` | lutande bänk | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): lutande bänk z dopiskiem o głowie czy declinebänk |
| `da` | `ledzwie` | lænd | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `da` | `zegarek` | ur | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `da` | `lawka_skosna_glowa_w_dol` | skråbænk | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): skråbænk czy decline-bænk |
| `nb` | `zegarek` | klokke | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `nb` | `lawka_skosna_glowa_w_dol` | skråbenk | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): skråbenk czy declinebenk |
| `fi` | `do_upadku` | Uupumukseen | do potwierdzenia przez native speakera |
| `fi` | `zegarek` | kello | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `fi` | `lokcie_waskie` | kyynärpäät kapeasti | Dosłowne „wąsko” (kalka z polskiego) czy „łokcie przy sobie/zebrane”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `fi` | `lawka_skosna_glowa_w_dol` | alaviistopenkki | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): alaviistopenkki czy laskeva penkki |
| `tr` | `do_upadku` | Tükenişe kadar | do potwierdzenia przez native speakera |
| `tr` | `ramie` | üst kol | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `tr` | `zegarek` | saat | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `el` | `do_upadku` | Έως αποτυχία | do potwierdzenia przez native speakera |
| `el` | `chwyt` | λαβή | do sprawdzenia przez native speakera: czy „λαβή” to potoczny termin siłowni (recenzja P2, 04.11.2026); dotąd tymczasowo angielskie „grip” |
| `el` | `ramie` | βραχίονας | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `el` | `kettlebell` | kettlebell | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `el` | `ledzwie` | μέση | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `el` | `jednostka_masy_kg` | κιλά | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Grecki: „κιλά” (pełne słowo) czy „kg”? |
| `el` | `zegarek` | ρολόι | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `el` | `lawka_skosna_glowa_w_dol` | αρνητικός πάγκος | do potwierdzenia przez native speakera (recenzja T1b, 05.11.2026): αρνητικός πάγκος czy πάγκος με κλίση προς τα κάτω |
| `id` | `ramie` | lengan atas | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `id` | `zegarek` | jam tangan | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ms` | `ramie` | lengan atas | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `ms` | `ledzwie` | belakang bawah | Termin zaproponowany bez recenzji native speakera; do potwierdzenia (lista w docs/16). |
| `ms` | `zegarek` | jam tangan | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `vi` | `faza_pauza` | Tạm dừng | Tạm dừng to zarazem polecenie przycisku; w tempie ćwiczenia dopuszczalne („tạm dừng ở dưới”) — do sprawdzenia przez native speakera. |
| `vi` | `seria` | Hiệp | „hiệp” (też runda w boksie) obok „set” — do potwierdzenia |
| `vi` | `asekuracja` | Hỗ trợ và an toàn | do potwierdzenia przez native speakera |
| `vi` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `vi` | `ramie` | cánh tay trên | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `vi` | `zegarek` | đồng hồ | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ru` | `jednostka_masy_kg` | кг | Symbol masy w piśmie lokalnym (decyzja właściciela 10a, 28.10.2026; zmienia M1-039): czy tak piszą ludzie na siłowni w tym języku? Czy „кг” jest właściwym skrótem? |
| `ru` | `jednostka_masy_lb` | фнт | Skrót funta w piśmie lokalnym: czy „фнт” jest używany, czy ludzie piszą „lb”? (imperialny rzadko w tym regionie) |
| `ru` | `jednostka_dystansu_mi` | ми | Skrót nieodmienny „ми” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „mi”? (recenzja lokalizacji 28.10.2026) |
| `ru` | `jednostka_dystansu_yd` | ярд | Skrót nieodmienny „ярд” (jak w tekstach ekranu: ten sam tekst stoi po ułamkach i jako nagłówek kolumny): czy tak piszą ludzie w tym regionie, czy zostaje „yd”? (recenzja lokalizacji 28.10.2026) |
| `ru` | `zegarek` | часы | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `ru` | `lokcie_waskie` | локти узко | O łokciach w wąskim wyciskaniu i prostowaniu: „держи локти узко / тримай лікті вузько” czy „локти собраны, не разводи / лікті зібрані, не розводь”? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `ja` | `faza_pauza` | 一時停止 | Brzmi trochę jak przycisk odtwarzacza; trenerzy mówią też 「静止」/「ポーズ」. Do sprawdzenia przez native speakera. |
| `ja` | `zakres_powtorzen` | レップ範囲 | „レップ” to żargon siłowni; do potwierdzenia |
| `ja` | `szablon` | テンプレート | „テンプレート” vs „メニュー” w siłowniach — do potwierdzenia |
| `ja` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `ja` | `ramie` | 上腕 | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `ja` | `pozycja_posrednia` | 途中の姿勢 | „途中の姿勢1” czy „途中の姿勢 1” (ze spacją)? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `ja` | `nastepne_powtorzenie` | 次の1回 | do potwierdzenia przez native speakera: „次の1回では” czy „次のレップでは”; „次の回” czyta się jak „następnym razem”, więc go unikamy |
| `ko` | `faza_pauza` | 일시정지 | 일시정지 to przycisk odtwarzacza; tłumacz i przegląd API (niska) proponują 멈춤 (rzeczownik tempa). Uwaga niska — bez zmiany do polecenia. |
| `ko` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `ko` | `ramie` | 위팔 | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `zh-Hant` | `szablon` | 範本 | „範本” brzmi jak szablon dokumentu; w siłowniach tajwańskich „課表” — do potwierdzenia |
| `zh-Hant` | `chwyt` | grip | Termin nieustalony: tymczasowo angielskie „grip”; native speaker ma wskazać potoczny termin siłowni (chwyt dłoni na uchwycie, nie „trzymanie dłoni zaciśniętej”), lista w docs/16. |
| `zh-Hant` | `ramie` | 上臂 | Termin wzięty z tekstów przekładu API (09.11.2026; recenzja lokalizacji): angielskie „upper arm” było tylko placeholderem i jest zakazane; do potwierdzenia przez native speakera. |
| `zh-Hant` | `zegarek` | 手錶 | Termin pomocniczy w słowniku (tekst podpisu zrzutu o zegarku); do sprawdzenia przez native speakera, czy tak mówi się o Apple Watch. |
| `zh-Hant` | `pozycja_posrednia` | 中間姿勢 | „中間姿勢 1” czy „中間姿勢1” (spacja)? Do sprawdzenia przez native speakera (docs/16, 1.0.1). |
| `zh-Hant` | `nastepne_powtorzenie` | 下一下 | do potwierdzenia przez native speakera (TW): „下一下” (kolejne powtórzenie, „下” liczy powtórzenia) czy „下一次” (może znaczyć „następnym razem”); zakazu „下一次” nie ustawiamy do czasu odpowiedzi |
