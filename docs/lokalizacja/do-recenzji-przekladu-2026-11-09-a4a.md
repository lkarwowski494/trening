# Do recenzji przez native speakerów: partia A4a (core i moc), 09.11.2026

Źródło: recenzja lokalizacji partii A4a (wewnętrzna, bez native speakera), poprawki naniesione na gałęzi `lok/przeklad-a4a`. Pytanie kontrolne do każdego zdania: czy tak powiedziałby trener albo kolega na siłowni w tym języku?

## Japoński (priorytet: 15 zdań pisanych ręcznie)

- `core_floor.mis.ballPos`: „ボールに寝る位置が低すぎたり後ろすぎたりして、背中の中央がボールの頂点に乗っていないこと。” Jedno zdanie z przyczyną i skutkiem czy dwa krótkie zdania z „こと”?
- `core_floor.mis.headUp`: „顔を上げてしまうこと。” Czy przy ćwiczeniu na brzuchu mówi się „顔を上げる”, czy „頭を上げる”?
- `core_floor.ballSetup`: „…足を少しずつ前に出しながら、背中の中央がボールに乗るように仰向けになります。” Czy naturalne?
- `core_floor.ccSetup`: „ハイケーブル” (para do „ローケーブル” w innych kartach) zamiast „上のケーブル”.
- `core_floor.mis.neckPull` (nowe brzmienie, głowa wysunięta do przodu): „腹筋で肩を浮かせずに、頭を前に突き出してしまうこと。”
- `core_standing.windmill.knees`: „脚はほぼまっすぐに保ちます。膝は軽く曲げる程度にします。” Dwa zdania czy jedno: „脚はほぼまっすぐ、膝は軽く曲げる程度に保ちます。”?
- `core_floor.mis.situpFeet`: „脚を振って反動をつけ、足が床から浮いてしまうこと。”

## Hiszpański (Ameryka Łacińska, es-419)

- Piłka gimnastyczna: interfejs ma „pelota de estabilidad” (kalka z angielskiego). Czy w Ameryce Łacińskiej naturalniejsze jest „pelota de ejercicio” albo „pelota suiza”? Zmiana wymaga też zmiany etykiety sprzętu w UI (wpis słownika `pilka_gimnastyczna`, pewność niska).
- Pompka: es-419 ma „posición de lagartija” (Meksyk) w `suspRevCrunch`, a burpee (z bazy es) „flexión”. Czy „lagartija” jest zrozumiałe w całej Ameryce Łacińskiej, czy lepiej „flexión (de brazos)”?
- `core_floor.mis.neckPull`: tekst z bazy es („Adelantar la cabeza en vez de levantar los hombros con el abdomen.”), bez nakładki es-419. Czy brzmi naturalnie?

## Rosyjski (rejestr opisów błędów)

- Opisy błędów w partii przepisano na rzeczowniki odczasownikowe („Задирание головы.”, „Тяга каната руками вместо скручивания корпуса.”, „Выдвигание головы вперёд вместо подъёма плеч животом.”), jak w istniejących kartach. Czy to naturalny rejestr, czy trener powie raczej „Задираешь голову”?
- `core_standing.windmill.dblMove` (poprawiony błąd: ciężar na nogę, nie na rękę): „Отведи таз назад со стороны верхней руки, перенеси вес тела на ногу с этой стороны, а нижнюю руку веди вниз по внутренней стороне ноги.”

## Chiński tradycyjny (zh-Hant)

- Pozycja pompki: „伏地挺身姿勢” (setup, burpee i `suspRevCrunch.move`) zamiast „撐體姿勢”. Czy naturalne?
- `core_standing.figure8.setup`: „膝蓋彎曲” zamiast „微彎” (kettlebell przechodzi między nogami). Czy dobra siła wyrazu?
- `core_floor.mis.neckPull`: „頭往前伸，而不是用腹部把肩膀抬起來。”

## Koreański

- `core_floor.ballMove`: „상체를 말아 올려 등 윗부분이 볼에서 떨어지게 한 뒤 천천히 내려오세요.” Jedno zdanie zamiast dwóch z powtórzeniem „내려오”.
- `core_floor.mis.ballPos` kończy się „…있지 않음.” (jak `calf.mis.partial`). Czy styl zgodny z opisami błędów w aplikacji?
- `core_floor.mis.neckPull`: „복근으로 어깨를 들지 않고 고개를 앞으로 내미는 것.”

## Pozostałe języki (zmiana zdania `core_floor.mis.neckPull`, bez recenzji)

Zdanie zmieniło znaczenie z „ciągnąć szyją” na „wysuwać głowę do przodu zamiast unosić barki brzuchem” (cs i ro miały wcześniej „ciągnąć za szyję”). Teksty 33 języków w raporcie koordynatora; do sprawdzenia w pierwszej kolejności: cs, ro, tr (poprzednio inne znaczenie).
