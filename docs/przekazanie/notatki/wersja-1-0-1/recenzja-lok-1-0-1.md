# Recenzja lokalizacji 1.0.1 (gałąź wersja-1-0-1-r2, diff 43b0d25..HEAD)

Strażniki: `npx jest tests/slownik-terminow.test.ts tests/lokalizacja-1-0-1.test.ts` — 129/129 zielone.
Placeholdery ({n}, {lista}, {a}–{b}) we wszystkich zmienionych tekstach bez zmian. fr: NBSP przed „:” i „;” w nowych kartach jest ( ). tr: apostrof ’ zgodny z resztą pliku.
Kontekst: karty ćwiczeń (lib/cues/text, błąd `rdl.mis.knees` pokazywany przy animacji błędu kneesBent — lib/figures/v2/errors.ts:42), FairRulesSheet (components/FairRulesSheet.tsx:34–36), DayPanel (components/DayPanel.tsx:161), generator (app/generator.tsx:66), legenda figury (components/ExerciseFigureV2.tsx:101), import (app/more/import.tsx:55), zakładka Trening (app/(tabs)/_layout.tsx:51).

## BLOKUJĄCE (brzmi źle / błąd sensu)

| język | klucz | jest | proponowane | powód | pewność |
|---|---|---|---|---|---|
| ro | rdl.mis.knees | Îndoirea prea mult a genunchilor, până când mișcarea devine genuflexiune. | Îndoirea exagerată a genunchilor, până când mișcarea devine o genuflexiune. | b — „îndoirea prea mult a…” jest niegramatyczne (przysłówek po rzeczowniku z dopełniaczem); spójnie z `bp.mis.arch` „Arcuirea exagerată…” | średnia |

## DROBNE

### Karty: bp.elbowsMid / rdl.mis.knees

| język | klucz | jest | proponowane | powód | pewność |
|---|---|---|---|---|---|
| fr | rdl.mis.knees | Fléchir trop les genoux, au point de transformer le mouvement en squat. | Trop fléchir les genoux, au point de transformer le mouvement en squat. | b — „trop” przed bezokolicznikiem, tak mówi się naturalnie | wysoka |
| fr | bp.elbowsMid | Placez les coudes à mi-chemin : ni collés au corps, ni très écartés. | Gardez les coudes à mi-chemin : ni collés au corps ni trop écartés. | b — „trop” (za bardzo), nie „très” (bardzo); „ni… ni” bez przecinka (NBSP zostaje) | wysoka |
| es (i es-419 — dziedziczy, brak nakładki) | rdl.mis.knees | Flexionar demasiado las rodillas, hasta que el movimiento se convierte en una sentadilla. | Flexionar demasiado las rodillas, hasta convertir el movimiento en una sentadilla. | b — po „hasta que” naturalny byłby subjuntivo; krótsza forma z bezokolicznikiem omija problem | średnia |
| tr | rdl.mis.knees | Dizleri çok fazla bükmek — hareket squat’a dönüşür. | Dizleri o kadar çok bükmek ki hareket squat’a dönüşür. | b — mieszane zdanie (bezokolicznik + zdanie orzekające); „o kadar… ki” to naturalny skutek | średnia |
| tr | bp.elbowsMid | Dirsekleri ortada tutun — ne gövdeye yapışık ne de geniş açık. | Dirseklerinizi ortada tutun — ne gövdenize yapışık ne de yanlara fazla açık. | b — „geniş açık” brzmi obco; forma „siz” jak w `bp.blades` („Kürek kemiklerinizi”) | średnia |
| ja | bp.elbowsMid | 肘は真ん中あたりに保ちます — 体に付けすぎず、広げすぎません。 | 肘は体に付けすぎず、開きすぎず、中間くらいに保ちます。 | b — o łokciach na siłowni mówi się 開く (nie 広げる); jedno zdanie bez myślnika | do sprawdzenia przez native speakera |
| zh-Hant | bp.elbowsMid | 手肘放在中間 — 不要夾得貼住身體，也不要張得太開。 | 手肘保持在中間 — 不要緊貼身體，也不要張得太開。 | b — „夾得貼住” niezgrabne | średnia |
| ro | bp.elbowsMid | Ține coatele la mijloc — nici lipite de corp, nici foarte departe. | Ține coatele la mijloc — nici lipite de corp, nici prea depărtate. | b — „foarte departe” (bardzo daleko — od czego?); „prea” = za bardzo | średnia |
| fi | rdl.mis.knees | Polvien koukistaminen liikaa, jolloin liikkeestä tulee kyykky. | Polvien liiallinen koukistaminen, jolloin liikkeestä tulee kyykky. | b — szyk; spójnie z `bp.mis.arch` „Alaselän liiallinen notkistaminen” | średnia |
| de | bp.elbowsMid | Halte die Ellbogen in der Mitte — weder eng an den Körper geklebt noch weit abgespreizt. | Halte die Ellbogen irgendwo dazwischen — weder eng am Körper noch weit abgespreizt. | b — „in der Mitte” niejasne (w środku czego?); EN ma „somewhere in the middle” | średnia |
| cs | bp.elbowsMid | Lokty drž někde uprostřed — ne přilepené k tělu, ani široko od sebe. | Lokty drž někde uprostřed — ani přilepené k tělu, ani moc daleko od těla. | b — para „ani… ani”; „od sebe” = od siebie nawzajem, chodzi o tułów | średnia |
| sk | bp.elbowsMid | Lakte drž niekde uprostred — nie prilepené k telu ani široko od seba. | Lakte drž niekde uprostred — ani prilepené k telu, ani príliš od tela. | b — jak cs | średnia |
| bg | bp.elbowsMid | Лактите — по средата: нито залепени за тялото, нито широко разперени. | Дръж лактите по средата — нито залепени за тялото, нито широко разперени. | b/d — myślnik + dwukropek w jednym krótkim zdaniu; czasownik jak w `bp.blades` („дръж”) | średnia |
| uk | bp.elbowsMid | Лікті тримай десь посередині — не притиснуті до корпусу й не розведені широко. | Лікті тримай десь посередині — не притиснутими до корпусу й не розведеними широко. | b — po „тримай” orzecznik w narzędniku (jak ru „прижатыми”) | do sprawdzenia przez native speakera |
| hu | bp.elbowsMid | A könyököd tartsd középen — ne tapadjon a testedhez, és ne legyen szélesen kifelé. | A könyököd tartsd középen — ne szorítsd a testedhez, és ne is nyisd ki túlságosan. | b — „ne legyen szélesen kifelé” brzmi obco | do sprawdzenia przez native speakera |
| da | bp.elbowsMid | Hold albuerne et sted midt imellem — hverken klistret til siden eller langt ude. | Hold albuerne et sted midt imellem — hverken klistret ind til kroppen eller langt ude til siden. | b — „til siden” (do boku) nie pasuje do „przyklejone” | średnia |
| ms | bp.elbowsMid | Letakkan siku di tengah-tengah — jangan melekat pada badan dan jangan terlalu luas. | Letakkan siku di tengah-tengah — jangan rapat pada badan dan jangan terlalu kembang. | b — „terlalu luas” (za obszerny) nie mówi się o łokciach | do sprawdzenia przez native speakera |
| it | bp.elbowsMid | Tieni i gomiti a metà strada: né incollati al busto né larghi. | Tieni i gomiti a metà strada: né incollati al busto né troppo larghi. | b — EN/PL „szeroko na boki”; „troppo” jak w innych wskazówkach | wysoka |
| pt | rdl.mis.knees | Fletir demasiado os joelhos, até o movimento virar um agachamento. | Fletir demasiado os joelhos, até o movimento se tornar um agachamento. | c — „virar” w tym znaczeniu bardziej brazylijskie (pt-BR zostaje z „virar”) | do sprawdzenia przez native speakera |

Bez uwag (naturalne, termin przysiadu spójny z `rdl.knees`): ko, vi, sr, pt-BR, id, nl, nb, sv, ru, hr, sl, lt, lv, et, el (oba klucze); ja i zh-Hant `rdl.mis.knees`; pozostałe drugie klucze języków z tabeli. pt-BR: forma „você” (Mantenha) spójna z `bp.blades`.

### Zmienione EN źródłowe — czy przekłady nadal pasują
Przekłady powstały z polskiego, więc zmiana EN nie zepsuła sensu w żadnym języku. Przegląd:

| język | klucz | jest | proponowane | powód | pewność |
|---|---|---|---|---|---|
| el | Chcesz częściej? Pro zdejmuje limit… | Θέλετε πιο συχνά; Με το Pro δεν υπάρχει όριο: … | Θέλετε να προπονείστε πιο συχνά; Με το Pro δεν υπάρχει όριο: … | b — samo „chcecie częściej” bez czasownika; nowe EN mówi „train more often” | średnia |
| bg / fr / hr / nb / ro / ru / sl / vi / ja | Chcesz częściej? … | „Chcesz więcej?” (Искате повече? / Envie de plus ? / Želite više? / Vil du ha mer? / Vreți mai mult? / Хотите больше? / Želite več? / Muốn tập nhiều hơn? / もっと使いたいですか？) | „Chcesz trenować częściej?”: Искате ли да тренирате по-често? / Envie de vous entraîner plus souvent ? / Želite trenirati češće? / Vil du trene oftere? / Vreți să vă antrenați mai des? / Хотите тренироваться чаще? / Želite trenirati pogosteje? / Muốn tập thường xuyên hơn? / もっとトレーニングしたいですか？ | b — zrozumiałe obok „Trenuj {n} dni w miesiącu za darmo”, ale EN i PL mówią o częstości; ja „使いたい” = „korzystać z aplikacji”, nie trenować | średnia (ja: do sprawdzenia przez native speakera) |
| ja | Super, trenuję dalej! | いいね、続けてトレーニング！ | よし、トレーニングを続けます！ | b — EN zmieniono na 1. osobę („I'll keep training”); „いいね” brzmi jak polubienie | do sprawdzenia przez native speakera |
| ja / ko / zh-Hant | Ogólny (dla zdrowia i sprawności): … | 一般（健康と体力のため）：… / 일반(건강과 체력): … / 一般體能（為了健康與體能）：… | 健康・体力：… / 건강·체력: … / 健康體能：… | b/e — początek notatki ma powtarzać nazwę celu z przełącznika (Siła:, Masa:, Redukcja:), a przełącznik w ja/ko/zh-Hant to 健康・体力 / 건강·체력 / 健康體能; w zh-Hant dodatkowo 體能 jest dwa razy | średnia |
| en (dla koordynatora, nie tłumacza) | Ogólny | przełącznik „General fitness”, notatka „General (for health and fitness): …” | albo przełącznik „General”, albo notatka „General fitness (for health): …” | b — w EN nazwa celu na przełączniku i w notatce się różni; w PL obie to „Ogólny” | średnia |

Bez uwag: „Wyczyść miejsce” — wszystkie języki odróżniają „zdjęcie miejsca z dni” od „Usuń miejsce” (np. de Ort entfernen / Ort löschen, ja 外す / 削除, sv Rensa / Radera). „Mięśnie pomocnicze”, przerwy wielo-/jednostawowe, „pomocnicza = {h}” — w przekładach są zwykłe terminy siłowni (Hilfsmuskeln, Músculos auxiliares, 補助筋, Mehrgelenk-/Isolationsübungen). „Super, trenuję dalej!” w pozostałych językach jest już w 1. osobie albo neutralnie.

### Priorytet 3
| język | klucz | jest | proponowane | powód | pewność |
|---|---|---|---|---|---|
| el | Zaimportowane treningi, rekordy i wykresy… Pro zdejmuje limit, także jednorazowo na zawsze. | … — με το Pro δεν υπάρχει όριο, ακόμη και με εφάπαξ αγορά για πάντα. | … — με το Pro δεν υπάρχει όριο, και με εφάπαξ αγορά για πάντα. | b/f — „ακόμη και” = „nawet”, a PL ma tylko „także” (dodaje zaskoczenie, którego nie ma w oryginale); poprzednie „και” było właściwe | średnia |
| id | Ćwiczenia dopasowane do Twoich: {n} | Gerakan yang cocok dengan gerakan Anda: {n} | Gerakan yang sudah ada di daftar Anda: {n} | b — „gerakan… gerakan” powtórzone; obok stoi „Gerakan baru: {n}”, więc para „już na liście / nowe” czyta się od razu | do sprawdzenia przez native speakera |
| es-419 | Trening (zakładka) | Entrenamiento | bez zmiany słowa; sprawdzić zrzut 320 pt przy tekście 125% | e — najdłuższa etykieta zakładki we wszystkich językach (13 znaków, następne mają 11). TabLabel zmniejsza tekst (adjustsFontSizeToFit, TAB_LABEL_MIN_SCALE), więc nie zostanie ucięty, ale może wyjść mniejszy od sąsiednich | średnia |

Bez uwag: de „Apple Account” — 5 kluczy + store/app-store-metadata.json:98 („deines Apple Accounts”) zgodnie z obecnym niemieckim nazewnictwem Apple; w de.json nie zostało ani jedno „Apple-Account”/„Apple-ID”. el „Με το Pro δεν υπάρχει όριο” w pozostałych 2 kluczach naturalne. es-419: 3 nowe zdania pomocy zgodne z etykietami efektywnymi (Planificación, Configurar plan, Progresión, Empezar, Otro entrenamiento; „u «Otro…»” poprawnie), nie zostało żadne „entreno”.

## Nowe terminy do słownika (dopisuje koordynator z testem)
1. `wyciskanie/łokcie — „otwarte/rozłożone łokcie”` (flared elbows): ja 開く (nie 広げる), fr écartés z „trop”. Powód: ten sam opis wróci przy innych wyciskaniach (7 zestawów), więc warto go ujednolicić.
2. `przysiad` jako nazwa ruchu we wskazówkach (opcjonalnie): obecnie spójny w każdym języku (el κάθισμα, zh-Hant 深蹲, lt pritūpimas, vi/tr/id/ms/fr/it/nl squat). Wpis by tę spójność utrwalił.

## Pytania do native speakerów
- ja: łokcie przy wyciskaniu — „肘を開きすぎない” czy „肘を広げすぎない”?
- ja: przycisk zamykający — „よし、トレーニングを続けます！” czy „いいね、続けてトレーニング！”?
- ja: „もっとトレーニングしたいですか？” czy „もっと使いたいですか？” po zdaniu o limicie dni?
- uk: „тримай лікті не притиснутими…” (narzędnik) czy „не притиснуті…” (mianownik)?
- hu: „ne is nyisd ki túlságosan” czy „ne legyen szélesen kifelé” o łokciach?
- ms: o łokciach — „jangan terlalu kembang” czy „jangan terlalu luas”?
- pt (PT): „até o movimento se tornar” czy „até o movimento virar”?
- id: na podglądzie importu — „Gerakan yang sudah ada di daftar Anda: {n}” czy „Gerakan yang cocok dengan gerakan Anda: {n}”?

Podsumowanie: przeczytane ok. 400 tekstów (68 nowych zdań kart + ok. 330 przekładów zmienionych kluczy UI, store i zakładek); 1 poprawka BLOKUJĄCA + 27 DROBNYCH (w tym 1 zbiorcza dla 9 języków i 1 dla koordynatora EN); 8 pytań do native speakerów.
