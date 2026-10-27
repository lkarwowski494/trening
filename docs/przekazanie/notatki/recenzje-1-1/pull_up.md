# Recenzja ruchu 1.1: rodzina pull_up (11 ćwiczeń), 27.10.2026

Metoda jak w `dip.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2, reguły sensu z `v2-sens.mjs → regulyDla`).

Walidator: **11/11 OK**. Szczelność reguł automatycznych: **0 z 3 błędów (0%)**.

Cechy wspólne rodziny: drążek y 230 (x 0), barki w x −18 przez cały ruch. Podciąganie: bark 169 → 221, łokieć 14° → 142°, środek głowy na górze 243 (broda ok. 233,5, czyli nad drążkiem; reguła `broda_nad_drazkiem` z marginesem 2 cm).

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Pull Up | OK z uwagą | nachwyt ±22, łokcie na boki (odwiedzenie do 49°); uwaga E |
| Chin Up | OK z uwagą | podchwyt ±15, łokcie bliżej (27°); E |
| Neutral Grip Pull Up | OK z uwagą | E; trajektoria identyczna z Chin Up (chwyt ±15) |
| Mixed Grip Chin | OK z uwagą | E |
| One Arm Chin-Up | OK z uwagą | wolna ręka przy boku (chwyt L z ciałem, 43 cm od osi drążka); E |
| Gorilla Chin/Crunch | OK z uwagą | podciąganie + kolana do klatki (biodro 11° → 70°, kolano 29° → 110°); E |
| Gironda Sternum Chins | OK z uwagą | start pod drążkiem (bark x 0), odchylenie tułowia 0 → −40°, kręgosłup −20° (wyprost), ale mostek nie dochodzi do drążka (uwaga F) |
| Side To Side Chins | OK z uwagą | przesunięcie w bok tylko w jedną stronę (uwaga G) |
| **Wide-Grip Rear Pull-Up** | **BŁĄD** | podciąganie przodem zamiast za kark (nr 1) |
| **Scapular Pull-Up** | **BŁĄD** | brak ruchu łopatek, ruchem są kolana (nr 2) |
| **Dead Hang** | **BŁĄD** | ćwiczenie izometryczne, a kolana zginają się do 52° (nr 3) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Wide-Grip Rear Pull-Up** | u = 0,5 → 1, głowa względem drążka | **Narysowane jest podciąganie przodem (broda nad drążkiem), nie za kark.** Drążek leży w x 0, y 245. W u = 1 środek głowy jest w (−18; 258), a postać patrzy w +x. Drążek jest więc 18 cm przed środkiem głowy (ok. 8,5 cm przed twarzą) i 13 cm niżej, czyli przed brodą i szyją. W rzucie z boku głowa wychodzi nad drążek z tyłu, a w rzucie z przodu nad drążkiem widać twarz. Szeroki chwyt (±35) i łokcie na boki (odwiedzenie do 69°) są poprawne. | Wariant „rear” / za kark: głowa lekko w przód, drążek kończy za głową, przy karku. Środek głowy w x ≥ +10 względem drążka na górze (drążek za potylicą), tułów pionowo. | 85% | realny | nie: `broda_nad_drazkiem` sprawdza tylko wysokość brody, a żadna reguła nie wiąże nazwy „Rear” z położeniem głowy względem drążka |
| 2 | **Scapular Pull-Up** | cały ruch, barki i kolana | **Nie ma ruchu łopatek. Jedyny widoczny ruch to zginanie kolan**, czyli wygląda jak uginanie nóg w zwisie. `uniesienieBarkow` = 0 we wszystkich klatkach, a miednica unosi się o 1 cm (119 → 120). Kolano zgina się 12° → 51°, biodro 4° → 19°, łokieć 12° → 20°. Wskazówka: „Zacznij ruch od ściągnięcia łopatek w dół”. Kontrakt pozwala na `uniesienieBarkow` od −3 do +6 cm (`EXT_ROM.shrug`). | Ręce proste przez cały ruch (łokieć ≤ 10°), nogi nieruchome. Ruch to obniżenie łopatek: barki z uniesienia (+4…+6 cm, zwis bierny) do obniżenia (−3 cm), a ciało unosi się o ok. 5–8 cm bez zginania łokci. | 85% | nie: `rece_proste_caly_ruch` (łokieć ≤ 25°) przechodzi, `nogi_nieruchome` mierzy tylko x kostki względem miednicy (zmiana 3 cm ≤ 4), a nie ma reguły „barki się obniżają” |
| 3 | **Dead Hang** | cały ruch, kolana | **Ćwiczenie izometryczne (`izometryczne('pull_up','Dead Hang')` = true), a postać rytmicznie podkurcza nogi.** Kolano 12° → 38° → 52°, biodro 4° → 24°, kostki unoszą się o 9 cm (y 37 → 46), a łokieć zgina się 12° → 23°. Wiersz błędu `pu.noSwing` pokazuje to samo plus stopy w przód, więc poza poprawna wygląda jak łagodniejsza wersja błędu. | Poza statyczna: zwis na prostych rękach, nogi swobodnie w dół. Animacja może mieć jedną klatkę albo minimalny ruch (np. barki z obniżenia do biernego zwisu). Jedynym ruchem w podglądzie powinien być błąd. | 80% | realny | nie: jak w nr 2 (`nogi_nieruchome` nie mierzy y kostki ani kąta kolana), a dla pozy izometrycznej nie ma reguły „brak ruchu poza błędem” |

## OK z uwagą (backlog, nie blokuje)

- **E. Zwis ze środkiem ciężkości 18 cm za drążkiem** (9 ćwiczeń; wyjątek: Gironda, która startuje z barkami pod drążkiem).
  W dolnym zwisie barki, miednica i stopy leżą w x −18…−22 przy chwycie w x 0, więc ramiona są pochylone o ok. 16° od pionu. W bezruchu ciało wisi środkiem ciężkości pod chwytem. Odchylenie za drążek jest naturalne dopiero w górnej fazie, kiedy broda omija drążek.
  Na obrazie z boku widać to jako „zwis ukosem”, najmocniej w Dead Hang i Scapular Pull-Up. Propozycja: w u = 0 barki pod chwytem (x ≈ 0), cofanie do x ≈ −10…−15 w górnej fazie. Pewność 70%.
- **F. Gironda Sternum Chins:** odchylenie tułowia i wyprost kręgosłupa są rozpoznawalne, ale w u = 1 bark leży w y 206 przy drążku 230, a mostek ok. 20–25 cm pod drążkiem (łokieć 126°). Nazwa i istota ćwiczenia to mostek do drążka. Pewność 65%.
- **G. Side To Side Chins:** miednica i głowa przesuwają się w bok o 10 cm (z 0 → 10) tylko w jedną stronę. Przy animacji wahadłowej (0 → 1 → 0) nie ma przejścia do drugiej ręki, więc „side to side” wygląda jak „do jednej strony”. Pewność 60%.

## Proponowane reguły

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `izometryczne_bez_ruchu` | poza z `izometryczne` = true: max zmiana kąta każdego stawu w pozie poprawnej ≤ 5°, a ruch tylko w wierszu błędu | Dead Hang (kolano 40°) | ćwiczenia izometryczne z innych rodzin do sprawdzenia |
| `nogi_nieruchome` + y | dołożyć do reguły zmianę y kostki względem miednicy (≤ 4 cm) i kąt kolana (zmiana ≤ 10°) | Dead Hang 9 cm / 40°, Scapular 9 cm / 39° | Pull Up, Chin Up: 0 cm / 0° |
| `barki_obnizaja` | Scapular Pull-Up (i inne ćwiczenia z wskazówką „ściągnij łopatki w dół” jako ruchem głównym): `uniesienieBarkow` maleje o ≥ 4 cm między u = 0 i u = 1 | Scapular (0 cm) | — |
| `za_kark_glowa_przed_drazkiem` | ćwiczenia z „Rear”/„Behind Neck” w nazwie (podciąganie, ściąganie): w u = 1 środek głowy ≥ 8 cm przed drążkiem (x głowy − x drążka) | Rear Pull-Up −18 cm | Behind Neck Press (overhead_press) ma sztangę za głową: x −13 |
