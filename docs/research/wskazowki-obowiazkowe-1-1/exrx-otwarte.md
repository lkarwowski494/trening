# Wskazówki techniki — fala „obowiązkowe 1.1”, 8 otwartych ćwiczeń przez ExRx.net (2026-11)

- Data: 02.11.2026; autor: badacz-merytoryczny (agent). Status: **PROPOZYCJA**. Sekcje 0–5 — stan przed odczytem (bez kart); stan aktualny po stronach ExRx od właściciela — sekcja 6 na końcu pliku.
- Zakres (brief koordynatora 1.1): Lying Cable Curl; Lying Close-Grip Bar Curl On High Pulley; Lying Supine Dumbbell Curl; Standing Concentration Curl;
  Standing Inner-Biceps Curl; Full Range-Of-Motion Lat Pulldown; Cable Incline Triceps Extension; Kneeling Cable Triceps Extension.
  Wide-Grip Pulldown Behind The Neck — poza zakresem (decyzja właściciela 02.11.2026: ukrycie).
- Kontekst otwarcia: `ramiona-ciagi.md` (sekcja 1, wiersze 40–45) i `triceps.md` (sekcja 1, wiersze 23 i 28).

## 0. Wynik dostępu do ExRx (powód braku kart)

Planowana droga: kopie archiwalne ExRx w Wayback Machine (precedens `docs/research/27-wskazowki-zrodla.md:14,25`).
Wynik 02.11.2026 w tej sesji — narzędzie WebFetch odmawia samej domeny archiwum, zanim wyśle zapytanie:

| Adres próbowany | Wynik |
|---|---|
| `https://web.archive.org/web/2025/https://exrx.net/Lists/ExList/ArmWt` | „Claude Code is unable to fetch from web.archive.org” |
| `https://web.archive.org/web/2024/https://exrx.net/WeightExercises/Biceps/CBLyingCurl` | to samo (blokada domeny, nie brak migawki — rok bez znaczenia) |
| `http://archive.org/wait/web/2025/https://exrx.net/Lists/Directory` (błędny adres próbny) | HTTP 404 |

Wniosek: w tej sesji archiwum jest zablokowane na poziomie uprawnień narzędzia (to nie jest „brak migawki”). Nie próbowałem innych dróg
do tych samych treści (inne archiwa, kopie w pamięci podręcznej wyszukiwarek, inne hosty archive.org, nagłówki) — zgodnie z briefem
i z docs/18 (02.11.2026, ok. 17:20: „obejście zablokowane przez uprawnienia sesji — nie obchodzimy”). Bezpośrednio exrx.net — nie
próbowałem (wg briefu 403).

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan | Droga | Powód |
|---|---|---|---|
| Lying Cable Curl | otwarte | — | strona ExRx nieprzeczytana (archiwum zablokowane); wcześniejsze przebiegi — tylko szczebel 5 |
| Lying Close-Grip Bar Curl On High Pulley | otwarte | — | jw.; ustawienie inne niż wersja bazowa (droga 3 niedostępna — `ramiona-ciagi.md` w. 41) |
| Lying Supine Dumbbell Curl | otwarte | — | jw. |
| Standing Concentration Curl | otwarte | — | jw.; bez podparcia uda — inne ustawienie niż Concentration Curl (droga 3 niedostępna) |
| Standing Inner-Biceps Curl | otwarte | — | jw.; poza ExRx żadnego opisu szczebla ≤ 4 w dwóch falach |
| Full Range-Of-Motion Lat Pulldown | otwarte | — | nie ustaliłem, jaki wariant ExRx tak nazywa (strona nieprzeczytana); figura: dwa uchwyty z rozstawionych bloczków (`lib/figures/v2/poses/pulldown.json`, wpis „Full Range-Of-Motion Lat Pulldown”, `dwa: true` — wg `ramiona-ciagi.md` w. 45) |
| Cable Incline Triceps Extension | otwarte | — | strona nieprzeczytana; figura: wyciąg wysoko za głową, lina, ławka 55° (`triceps.md` pyt. 3 i 6) |
| Kneeling Cable Triceps Extension | otwarte | — | strona nieprzeczytana; ustawienie (klęk, łokcie na ławce) inne niż w bazie — droga 3 niedostępna (`triceps.md` w. 28) |

Razem 8: **karty 0, częściowe 0, otwarte 8**. Drogi 1–4: 0.

## 2. Blok do wdrożenia

Brak — nie wpisuję zdań bez przeczytanego źródła.

```json
{"_tryb": "dopisz", "exercises": {}, "sources": {}, "orgs": {}}
```

## 3. Nowe zdania PL + EN

Brak.

## 4. Źródła

Żadne nie przeczytane w tej sesji. Strony ExRx do odczytu (adresy docelowe do sprawdzenia — nie potwierdzone; poza `CBLyingCurl`
nazwy ścieżek nieznane, trzeba je znaleźć w katalogu `https://exrx.net/Lists/Directory` → „Upper Arms”, „Back”):
listy `exrx.net/Lists/ExList/ArmWt` (biceps, triceps) i `exrx.net/Lists/ExList/BackWt` (najszerszy grzbietu).

## 5. Pytania dla koordynatora

1. **[DO DECYZJI] Dostęp do Wayback Machine.** Domena `web.archive.org` jest zablokowana dla WebFetch w tej sesji agenta (sekcja 0). Opcje:
   (a) koordynator albo właściciel odblokowuje domenę w uprawnieniach sesji (`.claude/settings.json` / ustawienia narzędzia — zmiana konfiguracji
   należy do właściciela, agent jej nie zmienia) i zleca ponownie to samo zadanie; (b) odczyt stron ExRx w innym narzędziu przez człowieka/koordynatora
   z zapisem adresu migawki i miejsca (Preparation/Execution/Comments), a badacz tylko ocenia treść; (c) bez ExRx — 8 ćwiczeń wraca do właściciela
   z opcjami (docs/18, 02.11.2026: „po wyczerpaniu dróg źródeł — wraca do właściciela z opcjami”). Rekomendacja: (a) — precedens projektu (docs/research/27:14) już przyjął Wayback.
2. **Para źródeł także po odczycie ExRx.** ExRx to jedno źródło szczebla 4. Dla 6 z 8 ćwiczeń droga 3 jest niedostępna (inne ustawienie niż wersja bazowa — wiersze tabeli), więc
   sam ExRx da najwyżej zdanie „jedno źródło szczebla 4”, czyli **za mało na kartę** (CLAUDE.md: 2 źródła szczebla 4 albo 1 szczebla 3). Realne drugie źródło: wyciągi z książek NSCA
   z Dysku (szczebel 3 — wtedy ExRx tylko potwierdza „żadne nie przeczy”). Proszę o decyzję, czy ExRx ma sens bez równoległego przeglądu wyciągów NSCA.
3. **Full ROM Lat Pulldown i Cable Incline Triceps Extension — zgodność z figurą** sprawdzić dopiero po odczycie strony ExRx (pytania 8 w `ramiona-ciagi.md` i 6 w `triceps.md` — bez zmian).

## Stan agenta

Zrobione: próba dostępu do ExRx przez Wayback (zablokowane przez narzędzie), plik wyniku. Zostało: wszystko z zakresu po decyzji z pytania 1.
Następny krok: po odblokowaniu — katalog `Lists/Directory` → listy ArmWt/BackWt → strony 8 ćwiczeń; przy źródle adres migawki z datą i sekcja.
Pułapki: komunikat „unable to fetch from web.archive.org” to blokada domeny, nie brak migawki — zmiana roku nic nie da; nie szukać innych luster (docs/18, 02.11.2026).

## 6. Strony ExRx od właściciela (02.11.2026)

Druga sesja badacza, 02.11.2026. Źródło: tekst 7 stron ExRx skopiowany przez właściciela z jego przeglądarki (odczyt 02.11.2026); kopia leży poza repo
(scratchpad koordynatora) i **nie trafia do repo** — cudza treść; w repo tylko wnioski i cytaty ≤ 2 zdań. exrx.net ani archiwów nie otwierałem.
Reguła zastosowana (wg briefu koordynatora, właściciel 02.11.2026 — wyjątek ExRx: rzadka odmiana dobrze opisanego ruchu, ustawienie i ruch z jednego przeczytanego źródła szczebla 4 = ExRx,
gdy żadne nie przeczy; „jedno źródło” + recenzja niezależna; błędy jak dotąd). **Uwaga:** w `CLAUDE.md` tego worktree (`/home/user/wt-obow/CLAUDE.md`, sekcja „Merytoryczne podstawy”)
tej reguły jeszcze nie ma (szukane „ExRx” — brak trafień). Żadna z propozycji niżej nie opiera się wyłącznie na tym wyjątku — każda ma drugie źródło albo drogę 3 z bazą dwóch źródeł — więc wyniki stoją także bez niego.

Pozycja figury sprawdzona w `lib/figures/v2/poses/<rodzina>.json` (współrzędne x — przód/tył, y — wysokość; klatka u = 0 → u = 1).

### 6.1 Tabela: ćwiczenie → strona ExRx

| Ćwiczenie | Strona ExRx | Pasuje? | Dlaczego (ExRx vs figura) | Wynik |
|---|---|---|---|---|
| Standing Concentration Curl | Brachialis/DBConcentrationCurl | **nie** | ExRx: siedząc na ławce, tył ramienia oparty o wewnętrzną stronę uda (Preparation). Figura (`curl.json:9037`): stoi, tułów pochylony 45° (`pochylenieTulowia: 45`, l. 9060), bez ławki w `sprzet` — ramię bez podparcia. Inne podparcie ramienia = inne ustawienie, nie wariant sprzętu | otwarte |
| Cable Incline Triceps Extension | Triceps/CBTriExt (+ CBStandingTricepsExtensionRope) | **częściowo** — ruch w stawach ten sam, ustawienie nie | ExRx CBTriExt: łokcie nad głową, drążek za szyją, prostowanie do pionu i opuszczanie za szyję (Execution); stoi albo siedzi „with back support” (Preparation); wersja z liną: plecami do wyciągu (Preparation). Figura (`triceps.json:5794`): ławka 55° (l. 5808), tułów odchylony 35° (l. 5828), lina, wyciąg wysoko z tyłu (x −120, y 200, l. 5813–5814); dłonie od tyłu głowy (−47,7; 137) do pionu nad barkiem (−19,1; 156) — to prostowanie nad głową. ExRx nie opisuje ławki skośnej ani górnego bloczka (wersja z liną: „low pulley”; CBTriExt bloczka nie podaje) | **karta warunkowa — droga 3** (baza: istniejąca karta Cable Overhead Extension = ExRx CBTriExt + ACE #74; „uproszczenie: oparcie skośne”) — decyzja recenzenta |
| Kneeling Cable Triceps Extension | Triceps/CBBentoverTriExt | **nie** | ExRx: wykrok, tułów pochylony w dół, drążek za szyją, prostowanie przedramion w przód (Preparation, Execution). Figura (`triceps.json:10175`): **klęk z tułowiem pionowo** (`pochylenieTulowia: 0` we wszystkich klatkach, l. 10210–10478), dłonie od tyłu głowy (−22,2; 118,2) do pozycji nad głową (8,6; 161,4) — to prostowanie nad głową, nie w przód; ławka w `sprzet` (x 130, l. 10194–10199) leży ok. 100 jednostek przed miednicą (x 0) — figura się o nią nie opiera | patrz wiersz niżej |
| Kneeling Cable Triceps Extension | Triceps/CBTriExt (+ CBStandingTricepsExtensionRope) | **częściowo** — ruch rąk ten sam, podparcie inne | jak figura wyżej: tułów pionowo, łokcie nad głową, wyciąg z tyłu (x −75, y 155, lina) — ten sam ruch w łokciu i barku co ExRx CBTriExt; różni się podparcie (klęk zamiast „stand or sit”) | **karta warunkowa — droga 3** („uproszczenie: klęk zamiast stania”) — decyzja recenzenta; **[OTWARTE — figura]** opis w `triceps.md` w. 28 („łokcie na ławce”) nie zgadza się z figurą (pyt. 6.5.2) |
| Lying Cable Curl | Biceps/CBCurl | nie | ExRx: stojąc blisko dolnego bloczka (Preparation) — nie leżąc; daje tylko ruch w łokciu, nie ustawienie | otwarte |
| Lying Close-Grip Bar Curl On High Pulley | Biceps/CBCurl | nie | ExRx: dolny bloczek, stojąc; ćwiczenie — górny bloczek, leżąc | otwarte |
| Lying Supine Dumbbell Curl | Biceps/DBAlternatingCurl (tytuł w treści „Dumbbell Alternating Curl”) | nie | ExRx: stojąc, hantle przy bokach (Preparation) — nie leżąc na plecach | otwarte |
| Standing Inner-Biceps Curl | Biceps/DBAlternatingCurl | nie | ExRx: łokcie przy bokach (Execution); figura (`curl.json:3377`): dłonie szeroko (z ±31, l. 3437/3450), biegun łokcia na zewnątrz i w tył (l. 3439–3443) — uginanie z ramionami odwiedzionymi, inne ułożenie ramienia | otwarte |
| Full Range-Of-Motion Lat Pulldown | — (żadna z 7 stron nie dotyczy ściągania) | nie dotyczy | — | otwarte |
| Cable Lying Triceps Extension (już w `triceps.md`) | Triceps/CBLyingTriExt | **tak** | ExRx: leżąc na ławce, drążek wąsko nachwytem nad twarzą na prostych rękach; opuszczanie zginaniem łokci, przy głowie łokcie lekko w tył, wyprost (Preparation, Execution); Comments: drążek można oprzeć o koniec ławki przy głowie — zgodne z figurą (`triceps.json:5066`: tułów −90°, wyciąg nisko za głową x −115, y 58 wg `triceps.md` w. 47) | karta wzmocniona: droga 1 (Catalyst #903 + ExRx) zamiast drogi 3 |

Bilans 8 ćwiczeń z zakresu: **karty warunkowe 2** (Cable Incline, Kneeling — obie droga 3 z decyzją recenzenta), **otwarte 6** (Standing Concentration Curl, Lying Cable Curl,
Lying Close-Grip Bar Curl On High Pulley, Lying Supine Dumbbell Curl, Standing Inner-Biceps Curl, Full Range-Of-Motion Lat Pulldown). Drogi: 1 — 0, 2 — 0, 3 — 2, 4 — 0.
Poza zakresem: Cable Lying Triceps Extension z `triceps.md` przechodzi z drogi 3 na drogę 1.

### 6.2 Czym ruch się różni od wersji bazowej (do potwierdzenia przez recenzenta — nie rozstrzygam sam)

Opis stawów to mój rachunek geometryczny z danych figury (wniosek), nie cytat.

- **Cable Incline vs Cable Overhead Extension** (ExRx CBTriExt, siedząc z oparciem): ruchomy staw ten sam (łokieć), ramiona nad głową, przedramię wędruje za ramię.
  Różnice: (1) oparcie odchylone 35° od pionu — przy ramieniu pionowym w przestrzeni zgięcie barku względem tułowia ok. 145° zamiast ok. 180° (ten sam rodzaj różnicy co w Incline Barbell, `triceps.md` w. 48–51);
  (2) górny bloczek z tyłu ciągnie dłonie głównie w tył, nie w dół — ExRx w Comments każe „pozwolić linie ciągnąć ramię w tył, by utrzymać pełne zgięcie barku”, więc kierunek jest zbliżony, ale wysokości bloczka ExRx nie potwierdza.
  Kąt 55° nadal bez źródła (`triceps.md` pyt. 3). Zdania nie podają kąta ani wysokości bloczka.
- **Kneeling vs Cable Overhead Extension**: ramiona, łokcie i tułów (pionowo) ustawione tak samo jak na stojąco; różni się tylko podparcie (kolana zamiast stóp). Wniosek: ruch w stawach ramienia się nie różni.
  Dotyczy figury w obecnym kształcie; jeśli zamierzony jest wariant z łokciami opartymi na ławce i prostowaniem w przód, ta propozycja nie obowiązuje (pyt. 6.5.2).

### 6.3 Blok do wdrożenia

`_tryb: dopisz` jak W2. Źródła `exrx-Triceps/CBTriExt`, `exrx-Triceps/CBStandingTricepsExtensionRope`, `exrx-Biceps/CBCurl` już są w `data/zrodla/cues.json` (l. 1220–1233, 793–798; wpisy z adresem Wayback) —
przy integracji dopisać do nich odczyt 02.11.2026 przez kopię właściciela (pole odczytu wg uznania koordynatora); nowy wpis tylko `exrx-Triceps/CBLyingTriExt`.
Oba ćwiczenia z pozami v2 — każda karta ma błąd (docs/18:147). Wpis „Cable Lying Triceps Extension” **zastępuje** wpis z bloku `triceps.md` (te same zdania, inne źródła i brak „uproszczenia” przy ustawieniu i ruchu).

```json
{
  "_tryb": "dopisz",
  "exercises": {
    "Cable Incline Triceps Extension": {
      "_warunek": "recenzent drogi 3 (oparcie skośne, górny bloczek) — sekcja 6.2",
      "setup": [{"c": "tri.coteInc.setup", "uproszczenie": "oparcie skośne zamiast siedziska z oparciem", "s": [["exrx-Triceps/CBTriExt", "Preparation (sit on bench or seat with back support; cable bar behind neck; elbows overhead)"], ["exrx-Triceps/CBStandingTricepsExtensionRope", "Preparation (face away from pulley; ends of rope behind head; elbows upward over head)"], ["ace-74", "Step 2 (elbows pointing up; wariant: hantel)"]]}],
      "move": [{"c": "cote.move", "uproszczenie": "oparcie skośne", "s": [["exrx-Triceps/CBTriExt", "Execution"], ["ace-74", "Step 2; Step 3 (wariant: hantel)"]]}],
      "tips": [
        {"c": "ote.upperArm", "uproszczenie": "oparcie skośne", "s": [["exrx-Triceps/CBTriExt", "Execution (elbows remaining overhead)"], ["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.oteElbows", "s": [["wniosek", "ote.upperArm"], ["exrx-Triceps/CBTriExt", "Execution (elbows remaining overhead) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Kneeling Cable Triceps Extension": {
      "_warunek": "recenzent drogi 3 (klęk zamiast stania) + pyt. 6.5.2 (czy figura pokazuje zamierzony wariant)",
      "setup": [{"c": "tri.coteKneel.setup", "uproszczenie": "klęk zamiast stania", "s": [["exrx-Triceps/CBTriExt", "Preparation (stand or sit; cable bar behind neck; elbows overhead)"], ["exrx-Triceps/CBStandingTricepsExtensionRope", "Preparation (face away from pulley; ends of rope behind head; elbows upward over head)"], ["ace-74", "Step 2 (elbows pointing up; wariant: hantel)"]]}],
      "move": [{"c": "cote.move", "uproszczenie": "klęk zamiast stania", "s": [["exrx-Triceps/CBTriExt", "Execution"], ["ace-74", "Step 2; Step 3 (wariant: hantel)"]]}],
      "tips": [
        {"c": "ote.upperArm", "uproszczenie": "klęk zamiast stania", "s": [["exrx-Triceps/CBTriExt", "Execution (elbows remaining overhead)"], ["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.oteElbows", "s": [["wniosek", "ote.upperArm"], ["exrx-Triceps/CBTriExt", "Execution (elbows remaining overhead) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Cable Lying Triceps Extension": {
      "_uwaga": "zastępuje wpis z bloku triceps.md (droga 1 zamiast 3)",
      "setup": [{"c": "tri.skullCb.setup", "s": [["exrx-Triceps/CBLyingTriExt", "Preparation (lie on bench; with arms extended, bar over face)"], ["catalyst-903", "Description; Variations (low cable)"]]}],
      "move": [{"c": "tri.skullCb.move", "s": [["exrx-Triceps/CBLyingTriExt", "Execution (lower bar by bending elbow … extend arm)"], ["catalyst-903", "Description; Variations (low cable)"]]}],
      "tips": [
        {"c": "skull.upperArm", "s": [["exrx-Triceps/CBLyingTriExt", "Execution (elbows move slightly back just enough to clear the head, then return)"], ["ace-36", "Final Tip (upper arms vertical; wariant: sztanga)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "uproszczenie": "wariant sprzętu wyciąg", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides)"], ["ace-36", "Final Tip — błąd = zaprzeczenie standardu"]]}
      ]
    }
  },
  "sources": {
    "exrx-Triceps/CBLyingTriExt": {"org": "ExRx.net", "title": "Cable Lying Triceps Extension", "url": "https://exrx.net/WeightExercises/Triceps/CBLyingTriExt", "level": 4, "odczyt": "02.11.2026 — kopia tekstu strony przez właściciela (bez migawki archiwum)"}
  },
  "orgs": {}
}
```

Uwagi do bloku:
- `skull.upperArm` w Cable Lying: ExRx mówi o lekkim cofnięciu łokci przy głowie — zgodne z „prawie nieruchome, mniej więcej pionowo” (ten sam zestaw źródeł co w Skullcrusher (EZ), `data/zrodla/cues.json:7289–7298`, tam z ExRx BBLyingTriExt).
- Wąski chwyt nachwytem: ExRx CBLyingTriExt podaje go wprost, ACE #36 i istniejące `skull.setup` — dla sztangi. Nie dopisuję do zdania (figura: sprawdzić szerokość chwytu — recenzent); gdyby koordynator chciał, `skull.setup` („chwyć gryf wąsko nachwytem…”) ma teraz bezpośrednie źródło dla wyciągu, ale mówi „gryf” i „nad czołem” (ExRx: „over face”) — nie przenoszę.
- Cable Incline i Kneeling nie dostają `press.noLock` ani `ote.elbowsIn` z karty bazowej — mniej zdań, mniej uproszczeń; dopisanie możliwe w integracji tymi samymi źródłami co w Cable Overhead Extension.

### 6.4 Nowe zdania PL + EN

Id sprawdzone w `lib/cues/text/pl.json` (brak `tri.coteInc.*`, `tri.coteKneel.*`, `tri.mis.oteElbows`; `cote.move`, `ote.upperArm` istnieją — l. 57, 230). Własne słowa, bez liczb, bez nazw źródeł.

| Id | PL | EN (propozycja) |
|---|---|---|
| tri.coteInc.setup | Usiądź na ławce z oparciem, plecami do wyciągu; lina za głową, łokcie skierowane w górę. | Sit on a bench with back support, facing away from the cable; rope behind your head, elbows pointing up. |
| tri.coteKneel.setup | Uklęknij plecami do wyciągu; lina za głową, łokcie skierowane w górę. | Kneel facing away from the cable; rope behind your head, elbows pointing up. |
| tri.mis.oteElbows | Łokcie opadają w przód, zamiast zostać nad głową. | Elbows dropping forward instead of staying overhead. |

Kontrola sformułowań:
- „plecami do wyciągu” — ExRx wersja z liną, Preparation („face away from pulley”); figury: wyciąg z tyłu (x −120 i x −75).
- „ławka z oparciem” — ExRx CBTriExt, Preparation („back support”); słowo „skośna” pominięte — kąt skosu figury (55°) nie ma źródła, a zdanie prawdziwe jest i bez niego.
- „Uklęknij” — tylko figura i nazwa ćwiczenia (uproszczenie z 6.2); bez „tułów prosto” — żadne przeczytane źródło tego nie mówi dla klęku.
- Bez wysokości bloczka: ExRx z liną — dolny, figury — górny/średni; część wspólna: nie podawać.
- `tri.mis.oteElbows` — zaprzeczenie `ote.upperArm` („łokcie nad głową”) i ExRx „elbows remaining overhead”; recenzent ocenia, czy nie pokrywa się z błędem zestawu ogólnego (docs/18, 02.11.2026, grupa ramiona-ciągi pkt 4).

### 6.5 Zdania z `triceps.md`, które zyskują źródło

| Ćwiczenie (`triceps.md`) | Zdanie | Co daje ExRx | Wynik |
|---|---|---|---|
| Cable Lying Triceps Extension | `tri.skullCb.setup`, `tri.skullCb.move` | CBLyingTriExt opisuje wprost wersję z wyciągiem leżąc (Preparation, Execution) — drugie, bezpośrednie źródło obok Catalyst #903 | „uproszczenie” przy ustawieniu i ruchu znika; karta drogą 1 |
| Cable Lying Triceps Extension | `skull.upperArm` | CBLyingTriExt, Execution — bezpośrednio dla wyciągu | źródło bezpośrednie zamiast ISSA (hantle) |
| Band Skull Crusher | `tri.skullBand.setup`, `.move` | pośrednio: CBLyingTriExt potwierdza, że „wyciąg leżąc” to opisany wariant — łańcuch uproszczeń skraca się do jednego ogniwa (guma ↔ wyciąg), nie zdejmuje go | nadal karta warunkowa (recenzent) |
| Band Overhead Triceps Extension | `tri.bandOte.setup` | nie — ExRx z liną opisuje wyciąg, nie gumę pod stopami; ustawienie stóp w wykroku (ExRx „feet staggered”) to inny opór niż guma pod oboma stopami | bez zmian |
| Cable Overhead Extension (karta w aplikacji) | `cote.setup`, `cote.move`, `ote.upperArm` | ta sama treść co wpisy z Wayback (`data/zrodla/cues.json:7864–7921`) — odczyt 02.11.2026 potwierdza, że strona nadal tak mówi | bez zmian treści |

Cytaty (≤ 2 zdania na źródło, miejsce w nawiasie):
- CBLyingTriExt (Preparation): „Lie on bench and grasp bar with narrow overhand grip. With arms extended, position bar over face.”
- CBTriExt (Preparation, zdanie 1): „Stand or sit on bench or seat with back support just below shoulders.”
- CBStandingTricepsExtensionRope (Preparation, zdanie 3): „Face away from pulley with feet staggered.”
- CBBentoverTriExt (Execution, zdanie 1): „Extend forearms forward until elbows are straight.”
- DBConcentrationCurl (Preparation, zdania 1 i 3): „Sit on bench. … Place back of upper arm to inner thigh.”
- CBCurl (Preparation): „Grasp low pulley cable bar with shoulder width underhand grip. Stand close to pulley.”
- Dumbbell Alternating Curl (Preparation): „Position two dumbbells to sides, palms facing in, arms straight.”

### 6.6 Źródła (sekcja 6)

Wszystkie: ExRx.net, szczebel 4 (`szczeble-organizacji-2026-11-02.md` — ExRx bez zmian), odczyt 02.11.2026 przez kopię tekstu właściciela; jedna organizacja = jedno źródło niezależnie od liczby stron.

| Id | Adres | Miejsce | Użyte |
|---|---|---|---|
| exrx-Triceps/CBLyingTriExt (nowy) | https://exrx.net/WeightExercises/Triceps/CBLyingTriExt | Preparation, Execution, Comments | Cable Lying |
| exrx-Triceps/CBTriExt (istnieje) | https://exrx.net/WeightExercises/Triceps/CBTriExt | Preparation, Execution, Comments | Cable Incline, Kneeling |
| exrx-Triceps/CBStandingTricepsExtensionRope (istnieje) | https://exrx.net/WeightExercises/Triceps/CBStandingTricepsExtensionRope | Preparation, Comments | Cable Incline, Kneeling |
| exrx-Triceps/CBBentoverTriExt | https://exrx.net/WeightExercises/Triceps/CBBentoverTriExt | Preparation, Execution | nieużyte (nie pasuje do figury Kneeling) — nie dopisywać do `data/` |
| exrx-Brachialis/DBConcentrationCurl | https://exrx.net/WeightExercises/Brachialis/DBConcentrationCurl | Preparation | nieużyte (wersja siedząc) — może posłużyć przyszłej karcie siedzącego Concentration Curl (brak karty w `data/zrodla/cues.json`) |
| exrx-Biceps/CBCurl (istnieje) | https://exrx.net/WeightExercises/Biceps/CBCurl | Preparation | nieużyte |
| Dumbbell Alternating Curl | adres wg briefu: `/Biceps/DBAlternatingCurl`; właściciel zapisał `/Biceps/DBCurl` — w treści tytuł „Dumbbell Alternating Curl”; adresu nie sprawdzałem. Istniejący wpis `exrx-Biceps/DBCurl` (`data/zrodla/cues.json:800`) ma tę samą treść Preparation w kartach curl — prawdopodobnie ta sama strona [OTWARTE] | Preparation, Execution | nieużyte |

### 6.7 Pytania dla koordynatora (sekcja 6)

1. **[DO DECYZJI] Droga 3 dla Cable Incline i Kneeling** — oparcie skośne i klęk to zmiana podparcia, nie sprzętu. Precedensy: `triceps.md` przyjął skos ławki jako drogę 3 (Incline Barbell); docs/18 (02.11.2026, mieszane pkt 4) odrzucił Triceps Dip ← Chest Dip z powodu innego kąta tułowia.
   W Kneeling tułów jest pionowo jak na stojąco (różnica tylko w podparciu nóg); w Cable Incline tułów odchylony 35° (inny stały kąt barku). Rekomendacja: Kneeling — dopuścić; Cable Incline — dopuścić tylko z potwierdzeniem recenzenta, że inny kąt barku nie zmienia zdań (zdania nie mówią o kącie).
2. **[OTWARTE — figura] Kneeling Cable Triceps Extension** — `triceps.md` w. 28 opisuje „klęk, łokcie na ławce”, a figura pokazuje klęk z tułowiem pionowo i prostowanie nad głową; ławka w `sprzet` (`triceps.json:10194–10199`) stoi poza zasięgiem. Który wariant jest zamierzony? Jeśli z łokciami na ławce i prostowaniem w przód — karta z 6.3 nie pasuje, a ExRx Bent-over też nie (wykrok bez podparcia) → ćwiczenie otwarte, a figura do poprawy albo usunięcia ławki — decyzja recenzenta figur.
3. **[OTWARTE — figura] Cable Incline** — kąt 55° i górny bloczek bez źródła (bez zmian względem `triceps.md` pyt. 3 i 6); zdania tego nie podają, ale recenzent toru ruchu powinien to wiedzieć.
4. **Reguła ExRx w CLAUDE.md** — w `/home/user/wt-obow/CLAUDE.md` brak wzmianki (stan 02.11.2026). Propozycje wyżej jej nie potrzebują; gdyby jednak wejście „jedno źródło ExRx” miało dotyczyć innych ćwiczeń, reguła musi najpierw trafić do CLAUDE.md.
5. Sześć ćwiczeń nadal bez źródła (lista w 6.1) → wg docs/18 (02.11.2026 ~17:20) dalsze drogi: wyciągi z książek NSCA z Dysku; po ich wyczerpaniu — do właściciela z opcjami.

### Stan agenta (sesja 2)

Zrobione: ocena 7 stron ExRx od właściciela wobec figur 8 ćwiczeń i kart z `triceps.md`; sekcja 6. Zostało: 6 ćwiczeń bez źródła (6.1); decyzje 6.7 pkt 1–2.
Pułapki: opis Kneeling w `triceps.md` nie zgadza się z figurą — sprawdzać `pochylenieTulowia` i położenie ławki, nie nazwę; kopia stron ExRx nie może trafić do repo.
