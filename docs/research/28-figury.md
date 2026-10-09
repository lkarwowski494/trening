# 28 — Figury ruchu (generowane)

AUTOMATYCZNIE WYGENEROWANE przez `scripts/figures/gen.mjs` z `lib/figures/data.json`, `lib/cues/data.json` i `lib/cues/text/pl.json` — nie edytować ręcznie.
Sprawdzanie: `node scripts/figures/gen.mjs --check` (część `npm run verify`); geometria póz i zakres stawów: `tests/figures.test.tsx`.

Decyzja właściciela: docs/18, 08.10.2026 (ok. 23:50) — wariant A etapami; etap 2–3 = własne figury SVG (szkielet z kątami stawów, 2–3 pozycje, krótka pętla; przy „Ogranicz ruch” pozycje statycznie). Research: docs/research/26 pkt 7; wskazówki etapu 1: docs/research/27.

## Zasady

- Figura powstaje tylko dla ćwiczenia, które ma wskazówki etapu 1; opis dla VoiceOver to zdania „Ruch” z tych wskazówek.
- Każda poza ma co najmniej jedno sprawdzenie powiązane ze zdaniem wskazówki (np. „uda równolegle do podłogi” → odcinek biodro–kolano poziomo ± tolerancja). Test liczy geometrię i sprawdza, że poza spełnia każde z nich.
- Kąty, których żadne zdanie nie podaje (pochylenie tułowia, długość kroku, kąt ławki…), są **uproszczeniem ilustracyjnym** — rysunek nie twierdzi, że to jedyna poprawna wartość. Przy ćwiczeniu podana jest uwaga, co jest ilustracyjne.
- Proporcje ciała i przyrządów są schematyczne (uproszczenie ilustracyjne), wszystkie w jednym module `lib/figures/geom.ts`.
- „Rzut ręki” (armProj): ręka odwiedziona w bok (szeroki chwyt, łokcie na boki) w widoku z boku wygląda na krótszą — kąty ręki są wtedy kątami rzutu, nie stawu, i nie podlegają sprawdzeniu zakresu.
- Animacja: pozy pośrednie z interpolacji kątów; „druga podpora” (level) obraca figurę wokół kotwicy, żeby np. dłonie przy pompkach nie schodziły pod podłogę.
- Bez twierdzeń medycznych; rysunek jest w sekcji „Technika” razem ze stopką odsyłającą do lekarza lub fizjoterapeuty.
- Rysunki własne, z kątów i opisów słownych (bez odrysowywania cudzych zdjęć i rysunków — docs/research/26 pkt 3).

## Granice zakresu stawów (test)

Granice testowe kątów stawów (tests/figures.test.tsx): żadna poza nie przekracza średniego zakresu ruchu dorosłych z danych referencyjnych. To nie jest treść pokazywana w aplikacji. Widok z boku: zgięcie dodatnie, wyprost ujemny; widok z przodu: odwiedzenie.

| Widok | Staw | Min | Max | Źródło |
|---|---|---|---|---|
| z boku | zgięcie biodra | -17° | 133° | CDC Normal Joint ROM Study (Soucie i in., Haemophilia 2011;17:500–7), wiek 20–44: wyprost biodra 18,1° (K) / 17,4° (M), zgięcie 133,8° / 130,4° — https://archive.cdc.gov/www_cdc_gov/ncbddd/jointrom/index.html |
| z boku | zgięcie kolana | 0° | 141° | CDC Normal Joint ROM Study, wiek 20–44: zgięcie kolana 141,9° (K) / 137,7° (M); wyprost do 0° (bez przeprostu na rysunku) |
| z boku | zgięcie grzbietowe stopy | -60° | 37° | zgięcie podeszwowe: CDC Normal Joint ROM Study, wiek 20–44: 62,1° (K) / 54,6° (M); zgięcie grzbietowe pod obciążeniem: Dill i in., J Athl Train 2014;49(6):723–32, test wykrocznej (WBL) — grupa z ograniczeniem 38,91 ± 3,48°, grupa w normie 50,84 ± 5,16° (https://pmc.ncbi.nlm.nih.gov/articles/PMC4264643) |
| z boku | zgięcie barku | -53° | 171° | zgięcie barku: CDC Normal Joint ROM Study, wiek 20–44: 172,0° (K) / 168,8° (M); wyprost: Anderton, Newton Ede, Holt, Orthop Proc 2012;94-B(SUPP_XXXIX):127 — średnia z podręczników i PubMed 54° (zakres 28–80°) |
| z boku | zgięcie łokcia | 0° | 149° | CDC Normal Joint ROM Study, wiek 20–44: zgięcie łokcia 150,0° (K) / 144,6° (M); wyprost do 0° (bez przeprostu na rysunku) |
| z przodu | odwiedzenie ramienia | 0° | 170° | Anderton, Newton Ede, Holt 2012 — odwiedzenie barku średnio 171° (zakres 117–189°) |
| z przodu | zgięcie łokcia | 0° | 149° | jak wyżej (CDC, zgięcie łokcia) |
| z przodu | odwiedzenie uda | 0° | 10° | granica techniczna — tylko rozstaw stóp w widoku z przodu (kąt ilustracyjny, bez twierdzenia) |
| z przodu | uniesienie barków (jedn. rysunku) | 0° | 10° | granica techniczna — uniesienie barków w jednostkach rysunku (ilustracyjne) |

## Ćwiczenia z figurą (71)

### Back Squat

Widok: z boku; kotwica: przód stopy; rzut ręki (kąty ręki = rzut); przyrządy: plate.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh -35, el -150, ap 0.6, fp 0.6
  - bark – biodro – kostka w jednej linii (±6°) ← `sq.down`: „Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami.”
- **pozycja końcowa** — t 48, hip 132, knee 126, sh -35, el -150, ap 0.6, fp 0.6
  - odcinek biodro–kolano: 0° do poziomu (±10°) ← `sq.depth`: „Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud.”
  - pięta tuż nad poziomem 0 (do 1) ← `sq.mis.heels`: „Odrywanie pięt od podłogi.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Front Squat

Widok: z boku; kotwica: przód stopy; przyrządy: plate.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 90, el 148
  - bark – biodro – kostka w jednej linii (±6°) ← `sq.down`: „Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami.”
  - odcinek bark–łokieć: 0° do poziomu (±12°) ← `fsq.rack`: „Sztanga oparta z przodu barków, łokcie wysoko, ramiona mniej więcej poziomo.”
- **pozycja końcowa** — t 62, hip 118, knee 126, sh 118, el 148
  - odcinek biodro–kolano: 0° do poziomu (±10°) ← `sq.depth`: „Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud.”
  - odcinek bark–łokieć: 0° do poziomu (±12°) ← `fsq.rack`: „Sztanga oparta z przodu barków, łokcie wysoko, ramiona mniej więcej poziomo.”
  - pięta tuż nad poziomem 0 (do 1) ← `sq.mis.heels`: „Odrywanie pięt od podłogi.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Goblet Squat

Widok: z boku; kotwica: przód stopy; przyrządy: db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 25, el 140
  - bark – biodro – kostka w jednej linii (±6°) ← `gob.move`: „Zejdź w przysiad z uniesioną klatką i ciężarem przy klatce; wstań, wypychając podłogę stopami.”
- **pozycja końcowa** — t 58, hip 122, knee 126, sh 12, el 135
  - odcinek biodro–kolano: 0° do poziomu (±10°) ← `sq.depth`: „Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Przysiad z pasem (linki)

Widok: z boku; kotwica: przód stopy; przyrządy: cable.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 50, el 20
  - bark – biodro – kostka w jednej linii (±6°) ← `sq.down`: „Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami.”
- **pozycja końcowa** — t 64, hip 116, knee 126, sh 60, el 20
  - odcinek biodro–kolano: 0° do poziomu (±10°) ← `sq.depth`: „Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud.”
  - pięta tuż nad poziomem 0 (do 1) ← `sq.mis.heels`: „Odrywanie pięt od podłogi.”
- Uproszczenie ilustracyjne: pozostałe kąty. Linka od bloczka przy podłodze do pasa na biodrach; ręce przed sobą do równowagi (uproszczenie — wskazówki nie mówią o rękach).

### Pistol Squat

Widok: z boku; kotwica: przód stopy; przyrządy: brak.

- **pozycja wyjściowa** — t 90, hip 0/85, knee 0/0, sh 90, el 0, ft 0/65
  - zgięcie kolana (dalsza strona): 0° (±8°) ← `pistol.setup`: „Stań na jednej nodze, drugą wyprostuj w przód nad podłogą; ręce przed sobą do równowagi.”
  - pięta (dalsza strona) wyżej niż poziom 0 ← `pistol.setup`: „Stań na jednej nodze, drugą wyprostuj w przód nad podłogą; ręce przed sobą do równowagi.”
- **pozycja końcowa** — t 46, hip 118/106, knee 110/0, sh 110, el 0, ft 0/42
  - zgięcie kolana (dalsza strona): 0° (±8°) ← `pistol.setup`: „Stań na jednej nodze, drugą wyprostuj w przód nad podłogą; ręce przed sobą do równowagi.”
  - pięta (dalsza strona) wyżej niż poziom 0 ← `pistol.setup`: „Stań na jednej nodze, drugą wyprostuj w przód nad podłogą; ręce przed sobą do równowagi.”
  - pięta tuż nad poziomem 0 (do 1) ← `pistol.move`: „Zejdź w przysiad na nodze podporowej tak nisko, jak kontrolujesz ruch; wstań do pełnego wyprostu.”
- Uproszczenie ilustracyjne: pozostałe kąty. Głębokość „tak nisko, jak kontrolujesz” — pokazana pozycja głęboka jest ilustracyjna.

### Deadlift (sztanga)

Widok: z boku; kotwica: przód stopy; przyrządy: plate.

- **pozycja wyjściowa** — t 40, hip 130, knee 101, sh 47, el 0
  - bark w pionie nad/pod: dłoń (±4) ← `dl.hipsLow`: „Na starcie barki mniej więcej nad sztangą, ręce proste.”
  - dłoń tuż nad poziomem 13 (do 2) ← `dl.feet`: „Stopy pod sztangą, mniej więcej na szerokość bioder do barków; sztanga tuż przy piszczelach, nad środkiem stopy.”
  - zgięcie łokcia: 0° (±3°) ← `dl.hipsLow`: „Na starcie barki mniej więcej nad sztangą, ręce proste.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 0, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `dl.lift`: „Podnoś, prostując jednocześnie biodra i kolana; na górze stań prosto, z biodrami w przód.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Trap Bar Deadlift

Widok: z boku; kotwica: przód stopy; przyrządy: plate, grip.

- **pozycja wyjściowa** — t 42, hip 127, knee 93, sh 46, el 0
  - bark w pionie nad/pod: dłoń (±5) ← `dl.hipsLow`: „Na starcie barki mniej więcej nad sztangą, ręce proste.”
  - zgięcie łokcia: 0° (±3°) ← `dl.hipsLow`: „Na starcie barki mniej więcej nad sztangą, ręce proste.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 0, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `tb.lift`: „Podnoś, prostując jednocześnie biodra i kolana, aż staniesz prosto.”
- Uproszczenie ilustracyjne: pozostałe kąty. Rama sztangi widziana z boku jako talerz przy dłoniach; uchwyty mniej więcej nad środkiem stopy (uproszczenie).

### Deadlift (hantle)

Widok: z boku; kotwica: przód stopy; przyrządy: db, db.

- **pozycja wyjściowa** — t 50, hip 131, knee 127, sh 33, el 0
  - dłoń tuż nad poziomem 5 (do 6) ← `dbdl.setup`: „Stań na szerokość bioder z ciężarem przy nogach; pochyl się w biodrach z prostymi plecami i chwyć go.”
  - zgięcie łokcia: 0° (±3°) ← `dbdl.setup`: „Stań na szerokość bioder z ciężarem przy nogach; pochyl się w biodrach z prostymi plecami i chwyć go.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 0, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `dbdl.hips`: „Wstając, wypychaj biodra w przód aż do pełnego wyprostu.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### RDL (sztanga)

Widok: z boku; kotwica: przód stopy; przyrządy: plate.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 5, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `rdl.setup`: „Stań prosto ze sztangą przy udach, stopy na szerokość bioder do barków, chwyt na szerokość barków lub trochę szerzej.”
  - zgięcie łokcia: 0° (±3°) ← `rdl.setup`: „Stań prosto ze sztangą przy udach, stopy na szerokość bioder do barków, chwyt na szerokość barków lub trochę szerzej.”
- **pozycja końcowa** — t 25, hip 100, knee 18, sh 67, el 0
  - zgięcie kolana: 15° (±12°) ← `rdl.knees`: „Kolana tylko lekko ugięte — to nie przysiad.”
  - dłoń w pionie nad/pod: kostka (±9) ← `dl.close`: „Prowadź sztangę blisko nóg przez cały ruch.”
  - zgięcie łokcia: 0° (±3°) ← `rdl.move`: „Cofaj biodra i prowadź sztangę w dół blisko nóg, kolana lekko ugięte; wróć, wypychając biodra w przód.”
- Uproszczenie ilustracyjne: pozostałe kąty. Głębokość „dopóki czujesz rozciąganie tyłu ud przy prostych plecach” — pochylenie tułowia na rysunku jest ilustracyjne.

### RDL (hantle/linki)

Widok: z boku; kotwica: przód stopy; na wzór: RDL (sztanga); przyrządy: db, db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 5, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `rdl.dbSetup`: „Stań prosto z hantlami przed udami lub po bokach, stopy na szerokość bioder.”
  - zgięcie łokcia: 0° (±3°) ← `rdl.dbSetup`: „Stań prosto z hantlami przed udami lub po bokach, stopy na szerokość bioder.”
- **pozycja końcowa** — t 25, hip 100, knee 18, sh 67, el 0
  - zgięcie kolana: 15° (±12°) ← `rdl.knees`: „Kolana tylko lekko ugięte — to nie przysiad.”
  - dłoń w pionie nad/pod: kostka (±9) ← `rdl.dbMove`: „Cofaj biodra i opuszczaj ciężar blisko nóg, kolana lekko ugięte; wróć, wypychając biodra w przód.”
  - zgięcie łokcia: 0° (±3°) ← `rdl.dbMove`: „Cofaj biodra i opuszczaj ciężar blisko nóg, kolana lekko ugięte; wróć, wypychając biodra w przód.”
- Uproszczenie ilustracyjne: pozostałe kąty. Głębokość „dopóki czujesz rozciąganie tyłu ud przy prostych plecach” — pochylenie tułowia na rysunku jest ilustracyjne.

### Good Morning

Widok: z boku; kotwica: przód stopy; rzut ręki (kąty ręki = rzut); przyrządy: plate.

- **pozycja wyjściowa** — t 85, hip 12, knee 12, sh -35, el -150, ap 0.6, fp 0.6
  - zgięcie kolana: 12° (±10°) ← `gm.setup`: „Sztanga na górze pleców, stopy na szerokość bioder, kolana lekko ugięte.”
- **pozycja końcowa** — t 15, hip 96, knee 18, sh -35, el -150, ap 0.6, fp 0.6
  - odcinek biodro–bark: 10° do poziomu (±10°) ← `gm.depth`: „Schodź tylko do łagodnego rozciągnięcia tyłu ud — nie dalej niż do poziomu tułowia.”
  - zgięcie kolana: 15° (±10°) ← `gm.setup`: „Sztanga na górze pleców, stopy na szerokość bioder, kolana lekko ugięte.”
- Uproszczenie ilustracyjne: pozostałe kąty. Kolana lekko ugięte, tułów schodzi najwyżej do poziomu (zdanie gm.depth) — dokładny kąt ilustracyjny.

### Kettlebell Swing

Widok: z boku; kotwica: przód stopy; przyrządy: kb.

- **pozycja wyjściowa** — t 30, hip 108, knee 45, sh 35, el 0
  - kolano przed: dłoń ← `kb.move`: „Cofnij biodra, przepuszczając kettlebell między nogami, potem energicznie wypchnij biodra w przód — kettlebell unosi się przed tobą.”
  - pięta przed: biodro ← `kb.move`: „Cofnij biodra, przepuszczając kettlebell między nogami, potem energicznie wypchnij biodra w przód — kettlebell unosi się przed tobą.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 90, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `kb.move`: „Cofnij biodra, przepuszczając kettlebell między nogami, potem energicznie wypchnij biodra w przód — kettlebell unosi się przed tobą.”
- Uproszczenie ilustracyjne: pozostałe kąty. Wysokość kettlebella na górze (ok. barków) ilustracyjna — wskazówki mówią „unosi się przed tobą”.

### Bench Press (sztanga)

Widok: z boku; kotwica: biodro; rzut ręki (kąty ręki = rzut); przyrządy: rect, line, line, plate.

- **pozycja wyjściowa** — t 180, sh 90, el 0, hip -3, knee 95
  - zgięcie łokcia: 0° (±4°) ← `bp.move`: „Opuść sztangę kontrolowanie do klatki, potem wypchnij ją w górę do wyprostu rąk.”
  - odcinek bark–dłoń: 90° do poziomu (±8°) ← `bp.move`: „Opuść sztangę kontrolowanie do klatki, potem wypchnij ją w górę do wyprostu rąk.”
  - pięta tuż nad poziomem 0 (do 1) ← `bp.contact`: „Głowa, barki i pośladki na ławce, stopy pewnie na podłodze.”
- **pozycja końcowa** — t 180, sh -52, el 141, ap 0.65, hip -3, knee 95
  - dłoń przy: biodro + [22, 8] w układzie tułowia (≤ 5) ← `bp.move`: „Opuść sztangę kontrolowanie do klatki, potem wypchnij ją w górę do wyprostu rąk.”
  - pięta tuż nad poziomem 0 (do 1) ← `bp.contact`: „Głowa, barki i pośladki na ławce, stopy pewnie na podłodze.”
- Uproszczenie ilustracyjne: pozostałe kąty. Łokcie odwiedzone w bok — z boku ramię wygląda na krótsze (rzut, nie kąt stawu). Wskazówki nie podają kąta łokci względem tułowia.

### Bench Press (hantle)

Widok: z boku; kotwica: biodro; na wzór: Bench Press (sztanga); rzut ręki (kąty ręki = rzut); przyrządy: rect, line, line, db, db.

- **pozycja wyjściowa** — t 180, sh 90, el 0, hip -3, knee 95
  - zgięcie łokcia: 0° (±4°) ← `dbp.move`: „Wypchnij hantle w górę do wyprostu rąk; opuść je powoli do boków klatki.”
  - odcinek bark–dłoń: 90° do poziomu (±8°) ← `dbp.move`: „Wypchnij hantle w górę do wyprostu rąk; opuść je powoli do boków klatki.”
  - pięta tuż nad poziomem 0 (do 1) ← `bp.contact`: „Głowa, barki i pośladki na ławce, stopy pewnie na podłodze.”
- **pozycja końcowa** — t 180, sh -52, el 141, ap 0.65, hip -3, knee 95
  - dłoń przy: biodro + [22, 8] w układzie tułowia (≤ 5) ← `dbp.move`: „Wypchnij hantle w górę do wyprostu rąk; opuść je powoli do boków klatki.”
  - pięta tuż nad poziomem 0 (do 1) ← `bp.contact`: „Głowa, barki i pośladki na ławce, stopy pewnie na podłodze.”
- Uproszczenie ilustracyjne: pozostałe kąty. Łokcie odwiedzone w bok — z boku ramię wygląda na krótsze (rzut, nie kąt stawu). Wskazówki nie podają kąta łokci względem tułowia.

### Close Grip Bench Press

Widok: z boku; kotwica: biodro; na wzór: Bench Press (sztanga); rzut ręki (kąty ręki = rzut); przyrządy: rect, line, line, plate.

- **pozycja wyjściowa** — t 180, sh 90, el 0, hip -3, knee 95
  - zgięcie łokcia: 0° (±4°) ← `cgbp.move`: „Opuść sztangę do klatki z łokciami blisko tułowia; wypchnij ją do wyprostu rąk.”
  - odcinek bark–dłoń: 90° do poziomu (±8°) ← `cgbp.move`: „Opuść sztangę do klatki z łokciami blisko tułowia; wypchnij ją do wyprostu rąk.”
  - pięta tuż nad poziomem 0 (do 1) ← `bp.contact`: „Głowa, barki i pośladki na ławce, stopy pewnie na podłodze.”
- **pozycja końcowa** — t 180, sh -46, el 140, ap 0.9, hip -3, knee 95
  - dłoń przy: biodro + [20, 8] w układzie tułowia (≤ 5) ← `cgbp.move`: „Opuść sztangę do klatki z łokciami blisko tułowia; wypchnij ją do wyprostu rąk.”
  - pięta tuż nad poziomem 0 (do 1) ← `bp.contact`: „Głowa, barki i pośladki na ławce, stopy pewnie na podłodze.”
- Uproszczenie ilustracyjne: pozostałe kąty. Łokcie blisko tułowia — ramię prawie w płaszczyźnie rysunku (mniejszy skrót rzutu niż przy zwykłym wyciskaniu).

### Incline Bench Press (sztanga)

Widok: z boku; kotwica: biodro; rzut ręki (kąty ręki = rzut); przyrządy: rect, line, line, line, plate.

- **pozycja wyjściowa** — t 145, sh 125, el 0, hip 33, knee 90
  - zgięcie łokcia: 0° (±4°) ← `ibp.move`: „Opuść sztangę do górnej części klatki, potem wypchnij ją w górę do wyprostu rąk.”
  - odcinek bark–dłoń: 90° do poziomu (±8°) ← `ibp.move`: „Opuść sztangę do górnej części klatki, potem wypchnij ją w górę do wyprostu rąk.”
  - pięta tuż nad poziomem 0 (do 1) ← `ibp.setup`: „Połóż się na ławce skośnej: plecy i pośladki oparte, stopy na podłodze.”
- **pozycja końcowa** — t 145, sh -28, el 148, ap 0.65, hip 33, knee 90
  - dłoń przy: biodro + [26, 8] w układzie tułowia (≤ 6) ← `ibp.move`: „Opuść sztangę do górnej części klatki, potem wypchnij ją w górę do wyprostu rąk.”
  - pięta tuż nad poziomem 0 (do 1) ← `ibp.setup`: „Połóż się na ławce skośnej: plecy i pośladki oparte, stopy na podłodze.”
- Uproszczenie ilustracyjne: pozostałe kąty. Nachylenie oparcia ilustracyjne (wskazówki nie podają kąta ławki); łokcie w bok — rzut ramienia krótszy.

### Incline Bench Press (hantle)

Widok: z boku; kotwica: biodro; na wzór: Incline Bench Press (sztanga); rzut ręki (kąty ręki = rzut); przyrządy: rect, line, line, line, db, db.

- **pozycja wyjściowa** — t 145, sh 125, el 0, hip 33, knee 90
  - zgięcie łokcia: 0° (±4°) ← `ibp.dbMove`: „Wypchnij hantle w górę nad barki do wyprostu rąk; opuść je powoli do boków górnej części klatki.”
  - odcinek bark–dłoń: 90° do poziomu (±8°) ← `ibp.dbMove`: „Wypchnij hantle w górę nad barki do wyprostu rąk; opuść je powoli do boków górnej części klatki.”
  - pięta tuż nad poziomem 0 (do 1) ← `ibp.dbSetup`: „Usiądź na ławce skośnej z hantlami na udach, połóż się i ustaw hantle przy barkach.”
- **pozycja końcowa** — t 145, sh -28, el 148, ap 0.65, hip 33, knee 90
  - dłoń przy: biodro + [26, 8] w układzie tułowia (≤ 6) ← `ibp.dbMove`: „Wypchnij hantle w górę nad barki do wyprostu rąk; opuść je powoli do boków górnej części klatki.”
  - pięta tuż nad poziomem 0 (do 1) ← `ibp.dbSetup`: „Usiądź na ławce skośnej z hantlami na udach, połóż się i ustaw hantle przy barkach.”
- Uproszczenie ilustracyjne: pozostałe kąty. Nachylenie oparcia ilustracyjne (wskazówki nie podają kąta ławki); łokcie w bok — rzut ramienia krótszy.

### Machine Chest Press

Widok: z boku; kotwica: biodro; rzut ręki (kąty ręki = rzut); przyrządy: rect, line, line, grip.

- **pozycja wyjściowa** — t 90, sh -52, el 138, ap 0.7, hip 88, knee 90
  - dłoń przy: biodro + [21, 10] w układzie tułowia (≤ 6) ← `mcp.seat`: „Ustaw siedzisko tak, by uchwyty były na wysokości środka klatki; plecy oparte, stopy na podłodze.”
- **pozycja końcowa** — t 90, sh 80, el 5, hip 88, knee 90
  - zgięcie łokcia: 5° (±6°) ← `press.noLock`: „Prostuj ręce do końca, ale bez gwałtownego blokowania łokci.”
  - odcinek bark–dłoń: 0° do poziomu (±15°) ← `mcp.move`: „Wypchnij uchwyty przed siebie do wyprostu rąk; wracaj powoli.”
- Uproszczenie ilustracyjne: pozostałe kąty. Uchwyty maszyny jako punkt przy dłoniach; rama maszyny pominięta (uproszczenie).

### Push Up

Widok: z boku; kotwica: przód stopy; druga podpora: dłoń; przyrządy: brak.

- **pozycja wyjściowa** — t 20, hip 0, knee 0, ft -75, sh 70, el 0
  - bark – biodro – kostka w jednej linii (±5°) ← `push.setup`: „Dłonie na podłodze na szerokość barków lub trochę szerzej, ciało proste od głowy do pięt.”
  - zgięcie łokcia: 0° (±4°) ← `push.move`: „Opuść klatkę prawie do podłogi, zginając łokcie; wypchnij się do wyprostu rąk.”
  - dłoń tuż nad poziomem 0 (do 3) ← `push.setup`: „Dłonie na podłodze na szerokość barków lub trochę szerzej, ciało proste od głowy do pięt.”
- **pozycja końcowa** — t 1, hip 0, knee 0, ft -94, sh -25, el 137
  - bark – biodro – kostka w jednej linii (±5°) ← `push.rigid`: „Tułów sztywny — biodra nie opadają i nie unoszą się.”
  - bark tuż nad poziomem 0 (do 14) ← `push.move`: „Opuść klatkę prawie do podłogi, zginając łokcie; wypchnij się do wyprostu rąk.”
- Uproszczenie ilustracyjne: pozostałe kąty. Dłonie pod barkami na górze; rozstaw dłoni (szerokość barków) niewidoczny z boku.

### Incline Push Up

Widok: z boku; kotwica: przód stopy; druga podpora: dłoń; przyrządy: rect.

- **pozycja wyjściowa** — t 49, hip 0, knee 0, ft -43, sh 39, el 0
  - bark – biodro – kostka w jednej linii (±5°) ← `ipush.setup`: „Oprzyj dłonie o krawędź ławki lub stabilnego podwyższenia, trochę szerzej niż barki; stopy cofnięte, ciało proste.”
  - zgięcie łokcia: 0° (±4°) ← `ipush.move`: „Opuść klatkę do krawędzi podwyższenia, potem wypchnij się do wyprostu rąk.”
  - dłoń tuż nad poziomem 30 (do 3) ← `ipush.setup`: „Oprzyj dłonie o krawędź ławki lub stabilnego podwyższenia, trochę szerzej niż barki; stopy cofnięte, ciało proste.”
- **pozycja końcowa** — t 23, hip 0, knee 0, ft -72, sh -44, el 76
  - bark – biodro – kostka w jednej linii (±5°) ← `push.rigid`: „Tułów sztywny — biodra nie opadają i nie unoszą się.”
  - bark tuż nad poziomem 30 (do 14) ← `ipush.move`: „Opuść klatkę do krawędzi podwyższenia, potem wypchnij się do wyprostu rąk.”
- Uproszczenie ilustracyjne: pozostałe kąty. Wysokość podwyższenia ilustracyjna (zdanie ipush.height: im wyżej, tym łatwiej).

### Overhead Press (sztanga)

Widok: z boku; kotwica: przód stopy; rzut ręki (kąty ręki = rzut); przyrządy: plate.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 29, el 148, ap 0.75, fp 0.75
  - dłoń przy: bark + [-1, 7] w układzie tułowia (≤ 5) ← `ohp.bbSetup`: „Zdejmij sztangę ze stojaka na wysokości barków; chwyt na szerokość barków lub trochę szerzej, sztanga przy przedniej części barków.”
  - bark – biodro – kostka w jednej linii (±6°) ← `ohp.tall`: „Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę.”
- **pozycja końcowa** — t 95, hip -5, knee 0, sh 171, el 0
  - zgięcie łokcia: 0° (±4°) ← `ohp.move`: „Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków.”
  - dłoń w pionie nad/pod: bark (±6) ← `ohp.tall`: „Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę.”
- Uproszczenie ilustracyjne: pozostałe kąty. Chwyt szerzej niż barki — ramię w rzucie z boku krótsze; tor sztangi omija głowę (uproszczenie: linia prosta).

### Overhead Press (hantle)

Widok: z boku; kotwica: przód stopy; rzut ręki (kąty ręki = rzut); przyrządy: db, db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 32, el 148, ap 0.75, fp 0.75
  - dłoń przy: bark + [3, 6] w układzie tułowia (≤ 5) ← `ohp.dbSetup`: „Hantle przy barkach, łokcie pod nadgarstkami.”
  - łokieć w pionie nad/pod: dłoń (±3) ← `ohp.elbowsUnder`: „Łokcie pod nadgarstkami przez cały ruch.”
- **pozycja końcowa** — t 95, hip -5, knee 0, sh 171, el 0
  - zgięcie łokcia: 0° (±4°) ← `ohp.move`: „Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków.”
  - dłoń w pionie nad/pod: bark (±6) ← `ohp.tall`: „Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Seated Shoulder Press (hantle)

Widok: z boku; kotwica: biodro; rzut ręki (kąty ręki = rzut); przyrządy: rect, line, line, db, db.

- **pozycja wyjściowa** — t 95, sh 25, el 148, ap 0.75, hip 83, knee 90
  - dłoń przy: biodro + [33, 6] w układzie tułowia (≤ 6) ← `ohp.seat`: „Usiądź z plecami opartymi o oparcie, stopy mocno na podłodze; hantle przy barkach.”
  - łokieć w pionie nad/pod: dłoń (±4) ← `ohp.elbowsUnder`: „Łokcie pod nadgarstkami przez cały ruch.”
  - pięta tuż nad poziomem 0 (do 1) ← `ohp.seat`: „Usiądź z plecami opartymi o oparcie, stopy mocno na podłodze; hantle przy barkach.”
- **pozycja końcowa** — t 95, sh 165, el 3, hip 83, knee 90
  - zgięcie łokcia: 3° (±4°) ← `ohp.fullExt`: „Na górze wyprostuj ręce, bez gwałtownego blokowania łokci.”
  - pięta tuż nad poziomem 0 (do 1) ← `ohp.seat`: „Usiądź z plecami opartymi o oparcie, stopy mocno na podłodze; hantle przy barkach.”
- Uproszczenie ilustracyjne: pozostałe kąty. Oparcie lekko odchylone (ilustracyjnie); hantle przy barkach, łokcie pod nadgarstkami.

### Push Press

Widok: z boku; kotwica: przód stopy; rzut ręki (kąty ręki = rzut); przyrządy: plate.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 29, el 148, ap 0.75, fp 0.75
  - dłoń przy: bark + [-1, 7] w układzie tułowia (≤ 5) ← `pp.setup`: „Sztanga przy przedniej części barków, chwyt mniej więcej na szerokość barków lub trochę szerzej, stopy na szerokość bioder.”
- **w trakcie** — t 90, hip 15, knee 25, sh 29, el 148, ap 0.75, fp 0.75, ft 0
  - odcinek biodro–bark: 90° do poziomu (±5°) ← `pp.dip`: „Ugięcie krótkie, z tułowiem pionowo i napiętym.”
  - zgięcie kolana: 20° (±15°) ← `pp.move`: „Krótko ugnij kolana, a potem dynamicznie wyprostuj nogi i biodra, wypychając sztangę nad głowę do wyprostu rąk.”
- **pozycja końcowa** — t 95, hip -5, knee 0, sh 171, el 0
  - zgięcie łokcia: 0° (±4°) ← `pp.move`: „Krótko ugnij kolana, a potem dynamicznie wyprostuj nogi i biodra, wypychając sztangę nad głowę do wyprostu rąk.”
  - bark – biodro – kostka w jednej linii (±6°) ← `pp.legs`: „Siła wybicia idzie z nóg i bioder — ręce kończą ruch.”
- Uproszczenie ilustracyjne: pozostałe kąty. Ugięcie nóg krótkie — głębokość ilustracyjna.

### Wyciskanie nad głowę (linki)

Widok: z boku; kotwica: przód stopy; rzut ręki (kąty ręki = rzut); przyrządy: cable, grip.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 32, el 148, ap 0.75, fp 0.75
  - łokieć w pionie nad/pod: dłoń (±3) ← `cohp.setup`: „Stań lub usiądź między dolnymi bloczkami; uchwyty przy barkach, łokcie w dół, nadgarstki nad łokciami.”
  - dłoń przy: bark + [3, 6] w układzie tułowia (≤ 5) ← `cohp.setup`: „Stań lub usiądź między dolnymi bloczkami; uchwyty przy barkach, łokcie w dół, nadgarstki nad łokciami.”
- **pozycja końcowa** — t 95, hip -5, knee 0, sh 171, el 0
  - zgięcie łokcia: 0° (±4°) ← `ohp.move`: „Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków.”
  - dłoń w pionie nad/pod: bark (±6) ← `ohp.tall`: „Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę.”
- Uproszczenie ilustracyjne: pozostałe kąty. Bloczki dolne widziane z boku jako jeden punkt za stopami (uproszczenie).

### Bent Over Row (sztanga)

Widok: z boku; kotwica: przód stopy; przyrządy: plate.

- **pozycja wyjściowa** — t 30, hip 95, knee 20, sh 60, el 0
  - zgięcie łokcia: 0° (±4°) ← `row.fullStretch`: „Na dole wyprostuj ręce do końca, barki swobodnie w dół.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- **pozycja końcowa** — t 30, hip 95, knee 20, sh -40, el 109
  - dłoń przy: biodro + [9, 7] w układzie tułowia (≤ 6) ← `row.bbPull`: „Przyciągnij sztangę do dolnej części brzucha, potem opuść ją do pełnego wyprostu rąk.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- Uproszczenie ilustracyjne: pozostałe kąty. Pochylenie tułowia ilustracyjne — wskazówki mówią tylko „pochyl tułów w biodrach, plecy proste”.

### Bent Over Row (hantle)

Widok: z boku; kotwica: przód stopy; na wzór: Bent Over Row (sztanga); przyrządy: db, db.

- **pozycja wyjściowa** — t 30, hip 95, knee 20, sh 60, el 0
  - zgięcie łokcia: 0° (±4°) ← `row.fullStretch`: „Na dole wyprostuj ręce do końca, barki swobodnie w dół.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- **pozycja końcowa** — t 30, hip 95, knee 20, sh -40, el 109
  - dłoń przy: biodro + [9, 7] w układzie tułowia (≤ 6) ← `row.dbPull`: „Przyciągnij hantle do dolnej części brzucha, potem opuść je do pełnego wyprostu rąk.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- Uproszczenie ilustracyjne: pozostałe kąty. Pochylenie tułowia ilustracyjne — wskazówki mówią tylko „pochyl tułów w biodrach, plecy proste”.

### Pendlay Row

Widok: z boku; kotwica: przód stopy; na wzór: Bent Over Row (sztanga); przyrządy: plate.

- **pozycja wyjściowa** — t 30, hip 95, knee 20, sh 60, el 0
  - zgięcie łokcia: 0° (±4°) ← `row.fullStretch`: „Na dole wyprostuj ręce do końca, barki swobodnie w dół.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- **pozycja końcowa** — t 30, hip 95, knee 20, sh -40, el 109
  - dłoń przy: biodro + [9, 7] w układzie tułowia (≤ 6) ← `row.bbPull`: „Przyciągnij sztangę do dolnej części brzucha, potem opuść ją do pełnego wyprostu rąk.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- Uproszczenie ilustracyjne: pozostałe kąty. Ta sama figura co wiosłowanie sztangą w opadzie — wskazówki etapu 1 dla obu ćwiczeń są takie same (cechy Pendlaya, np. start z podłogi, nie wynikają z nich).

### T-Bar Row

Widok: z boku; kotwica: przód stopy; na wzór: Bent Over Row (sztanga); przyrządy: rod, plate.

- **pozycja wyjściowa** — t 30, hip 95, knee 20, sh 60, el 0
  - zgięcie łokcia: 0° (±4°) ← `row.fullStretch`: „Na dole wyprostuj ręce do końca, barki swobodnie w dół.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- **pozycja końcowa** — t 30, hip 95, knee 20, sh -40, el 109
  - dłoń przy: biodro + [9, 7] w układzie tułowia (≤ 6) ← `tbar.pull`: „Przyciągnij uchwyty do tułowia, potem opuść do pełnego wyprostu rąk.”
  - zgięcie kolana: 20° (±15°) ← `row.hinge`: „Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste.”
- Uproszczenie ilustracyjne: pozostałe kąty. Gryf zaczepiony przy podłodze za ćwiczącym (dźwignia); pochylenie tułowia ilustracyjne.

### One Arm Row (hantle)

Widok: z boku; kotwica: przód stopy; przyrządy: rect, line, line, db.

- **pozycja wyjściowa** — t 5, hip 93/87, knee 15/78, ft 0/-40, sh 85/119, el 0
  - odcinek biodro–bark: 0° do poziomu (±12°) ← `row1.bench`: „Oprzyj kolano i dłoń jednej strony na ławce; tułów mniej więcej równolegle do podłogi, plecy proste.”
  - zgięcie łokcia: 0° (±4°) ← `row.fullStretch`: „Na dole wyprostuj ręce do końca, barki swobodnie w dół.”
  - kolano (dalsza strona) tuż nad poziomem 24 (do 5) ← `row1.bench`: „Oprzyj kolano i dłoń jednej strony na ławce; tułów mniej więcej równolegle do podłogi, plecy proste.”
- **pozycja końcowa** — t 5, hip 93/87, knee 15/78, ft 0/-40, sh -44/119, el 101/0
  - łokieć za linią pleców ← `row1.top`: „Ciągnij, aż ramię minie linię tułowia.”
  - dłoń przy: biodro + [6, 4] w układzie tułowia (≤ 7) ← `row1.pull`: „Ciągnij hantel w górę wzdłuż boku, łokciem w tył; opuść do pełnego wyprostu ręki.”
  - odcinek biodro–bark: 0° do poziomu (±12°) ← `row1.bench`: „Oprzyj kolano i dłoń jednej strony na ławce; tułów mniej więcej równolegle do podłogi, plecy proste.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Chest Supported Row

Widok: z boku; kotwica: przód stopy; przyrządy: line, line, db.

- **pozycja wyjściowa** — t 40, hip 76, knee 25, sh 50, el 0
  - zgięcie łokcia: 0° (±4°) ← `row.fullStretch`: „Na dole wyprostuj ręce do końca, barki swobodnie w dół.”
  - odcinek bark–dłoń: 90° do poziomu (±8°) ← `csr.pull`: „Ciągnij łokcie w tył wzdłuż tułowia, potem wyprostuj ręce do końca.”
- **pozycja końcowa** — t 40, hip 76, knee 25, sh -50, el 133
  - łokieć za linią pleców ← `row.elbowsPast`: „Ciągnij, aż łokcie miną linię pleców.”
- Uproszczenie ilustracyjne: pozostałe kąty. Kąt oparcia i ciężar (hantle albo uchwyty maszyny) ilustracyjne; klatka przez cały ruch na podporze.

### Seated Cable Row

Widok: z boku; kotwica: biodro; przyrządy: rect, line, cable, grip.

- **pozycja wyjściowa** — t 90, sh 88, el 0, hip 95, knee 21, ft 109
  - zgięcie łokcia: 0° (±4°) ← `scr.pull`: „Przyciągnij uchwyt do brzucha, łokcie blisko tułowia; wróć do wyprostu rąk.”
  - zgięcie kolana: 20° (±15°) ← `scr.sit`: „Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane.”
  - odcinek biodro–bark: 90° do poziomu (±10°) ← `scr.sit`: „Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane.”
- **pozycja końcowa** — t 90, sh -38, el 111, hip 95, knee 21, ft 109
  - dłoń przy: biodro + [10, 8] w układzie tułowia (≤ 6) ← `scr.pull`: „Przyciągnij uchwyt do brzucha, łokcie blisko tułowia; wróć do wyprostu rąk.”
  - odcinek biodro–bark: 90° do poziomu (±10°) ← `scr.sit`: „Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane.”
- Uproszczenie ilustracyjne: pozostałe kąty. Siedzisko i podnóżek uproszczone; linka poziomo od bloczka na wysokości uchwytu.

### Wiosłowanie na linkach (siedząc)

Widok: z boku; kotwica: biodro; na wzór: Seated Cable Row; przyrządy: rect, line, cable, grip.

- **pozycja wyjściowa** — t 90, sh 88, el 0, hip 95, knee 21, ft 109
  - zgięcie łokcia: 0° (±4°) ← `scr.pull`: „Przyciągnij uchwyt do brzucha, łokcie blisko tułowia; wróć do wyprostu rąk.”
  - zgięcie kolana: 20° (±15°) ← `scr.sit`: „Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane.”
  - odcinek biodro–bark: 90° do poziomu (±10°) ← `scr.sit`: „Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane.”
- **pozycja końcowa** — t 90, sh -38, el 111, hip 95, knee 21, ft 109
  - dłoń przy: biodro + [10, 8] w układzie tułowia (≤ 6) ← `scr.pull`: „Przyciągnij uchwyt do brzucha, łokcie blisko tułowia; wróć do wyprostu rąk.”
  - odcinek biodro–bark: 90° do poziomu (±10°) ← `scr.sit`: „Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane.”
- Uproszczenie ilustracyjne: pozostałe kąty. Siedzisko i podnóżek uproszczone; linka poziomo od bloczka na wysokości uchwytu.

### Face Pull

Widok: z boku; kotwica: przód stopy; rzut ręki (kąty ręki = rzut); przyrządy: cable, grip.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 94, el 0
  - zgięcie łokcia: 0° (±4°) ← `fp.move`: „Przyciągnij linę w stronę twarzy; wróć do wyprostu rąk.”
  - odcinek biodro–bark: 90° do poziomu (±6°) ← `fp.chest`: „Tułów stabilny i wyprostowany.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh -12, el 160, ap 0.45
  - łokieć za linią pleców ← `fp.elbowsBack`: „Prowadź ruch łokciami — cofaj je w tył.”
  - dłoń przy: głowa + [-2, 9] w układzie tułowia (≤ 6) ← `fp.move`: „Przyciągnij linę w stronę twarzy; wróć do wyprostu rąk.”
  - odcinek biodro–bark: 90° do poziomu (±6°) ← `fp.chest`: „Tułów stabilny i wyprostowany.”
- Uproszczenie ilustracyjne: pozostałe kąty. Łokcie wysoko i na boki — z boku ramię wygląda na krótkie (rzut).

### Lat Pulldown

Widok: z boku; kotwica: biodro; rzut ręki (kąty ręki = rzut); przyrządy: rect, line, rect, cable, rod.

- **pozycja wyjściowa** — t 100, sh 160, el 0, hip 78, knee 90
  - zgięcie łokcia: 0° (±4°) ← `lpd.fullStretch`: „Na górze wyprostuj ręce do końca.”
- **pozycja końcowa** — t 100, sh -108, el 180, ap 0.55, hip 78, knee 90
  - dłoń przy: biodro + [27, 9] w układzie tułowia (≤ 6) ← `lpd.toChest`: „Ściągaj do górnej części klatki — nie dalej.”
- Uproszczenie ilustracyjne: pozostałe kąty. Chwyt szeroki — ramię w rzucie krótsze; lekkie odchylenie tułowia ilustracyjne.

### Pull Up

Widok: z boku; kotwica: dłoń; rzut ręki (kąty ręki = rzut); przyrządy: bar.

- **pozycja wyjściowa** — t 99, hip 9, knee 10, sh 171, el 0, ap 0.85
  - zgięcie łokcia: 0° (±4°) ← `pu.grip`: „Chwyć drążek nachwytem, trochę szerzej niż barki, i zawiśnij na prostych rękach.”
- **pozycja końcowa** — t 89, hip 10, knee 20, sh 10, el 154, ap 0.85
  - głowa (-4) wyżej niż dłoń ← `pu.pull`: „Podciągnij się, aż broda znajdzie się nad drążkiem; opuść się do pełnego wyprostu rąk.”
  - odcinek bark–łokieć: 90° do poziomu (±30°) ← `pu.elbowsDown`: „Prowadź łokcie w dół, do boków tułowia.”
- Uproszczenie ilustracyjne: pozostałe kąty. Chwyt szerzej niż barki — ramię w rzucie krótsze; ugięcie kolan ilustracyjne.

### Chin Up

Widok: z boku; kotwica: dłoń; przyrządy: bar.

- **pozycja wyjściowa** — t 99, hip 9, knee 10, sh 171, el 0
  - zgięcie łokcia: 0° (±4°) ← `cu.grip`: „Chwyć drążek podchwytem (dłonie do siebie), na szerokość barków, i zawiśnij na prostych rękach.”
- **pozycja końcowa** — t 88, hip 10, knee 20, sh 31, el 148, ap 1
  - głowa (-4) wyżej niż dłoń ← `cu.pull`: „Podciągaj się, ściągając łokcie w dół do boków; opuść się do pełnego wyprostu rąk.”
  - odcinek bark–łokieć: 90° do poziomu (±30°) ← `cu.pull`: „Podciągaj się, ściągając łokcie w dół do boków; opuść się do pełnego wyprostu rąk.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Neutral Grip Pull Up

Widok: z boku; kotwica: dłoń; przyrządy: bar.

- **pozycja wyjściowa** — t 99, hip 9, knee 10, sh 171, el 0
  - zgięcie łokcia: 0° (±4°) ← `npu.hang`: „Chwyć uchwyty pełnym chwytem (kciuk dookoła) i zawiśnij na prostych rękach.”
- **pozycja końcowa** — t 88, hip 10, knee 20, sh 31, el 148, ap 1
  - głowa (-4) wyżej niż dłoń ← `pu.pull`: „Podciągnij się, aż broda znajdzie się nad drążkiem; opuść się do pełnego wyprostu rąk.”
  - odcinek bark–łokieć: 90° do poziomu (±30°) ← `pu.elbowsDown`: „Prowadź łokcie w dół, do boków tułowia.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Lunges (hantle)

Widok: z boku; kotwica: przód stopy (dalsza strona); przyrządy: db, db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `lunge.dbSetup`: „Stań prosto, stopy na szerokość bioder, hantle w opuszczonych rękach.”
- **pozycja końcowa** — t 90, hip 80/-3, knee 110/102, ft 0/-80, sh 0, el 0
  - kolano (dalsza strona) tuż nad poziomem 0 (do 8) ← `lunge.fwd`: „Zrób krok w przód i opuść się, aż tylne kolano będzie tuż nad podłogą; odepchnij się przednią nogą do pozycji wyjściowej.”
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
  - pięta tuż nad poziomem 0 (do 1) ← `lunge.fwd`: „Zrób krok w przód i opuść się, aż tylne kolano będzie tuż nad podłogą; odepchnij się przednią nogą do pozycji wyjściowej.”
- Uproszczenie ilustracyjne: pozostałe kąty. Długość kroku i ustawienie przedniego podudzia ilustracyjne; z boku nie widać ustawienia kolana w linii palców (widok z przodu).

### Walking Lunges

Widok: z boku; kotwica: przód stopy (dalsza strona); na wzór: Lunges (hantle); przyrządy: db, db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `lunge.dbSetup`: „Stań prosto, stopy na szerokość bioder, hantle w opuszczonych rękach.”
- **pozycja końcowa** — t 90, hip 80/-3, knee 110/102, ft 0/-80, sh 0, el 0
  - kolano (dalsza strona) tuż nad poziomem 0 (do 8) ← `lunge.walk`: „Krok w przód, opuść się, aż tylne kolano będzie tuż nad podłogą; wstań na przedniej nodze i od razu zrób krok drugą.”
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
  - pięta tuż nad poziomem 0 (do 1) ← `lunge.walk`: „Krok w przód, opuść się, aż tylne kolano będzie tuż nad podłogą; wstań na przedniej nodze i od razu zrób krok drugą.”
- Uproszczenie ilustracyjne: pozostałe kąty. Jeden krok pętli; kolejny krok drugą nogą wygląda tak samo (lustrzanie). Długość kroku ilustracyjna.

### Reverse Lunge

Widok: z boku; kotwica: przód stopy; w pozach pośrednich figura unosi się nad podłogę (stopa obraca się wokół kostki — uproszczenie); przyrządy: brak.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0
  - bark – biodro – kostka w jednej linii (±6°) ← `lunge.stand`: „Stań prosto, stopy mniej więcej na szerokość bioder.”
- **w trakcie** — t 90, hip 12/-12, knee 12/75, ft 0/-117, sh 0, el 0
  - przód stopy (dalsza strona) wyżej niż poziom 0 ← `lunge.back`: „Zrób krok w tył i opuść się, aż tylne kolano będzie tuż nad podłogą; wróć, odpychając się przednią nogą.”
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
- **pozycja końcowa** — t 90, hip 80/-3, knee 110/102, ft 0/-80, sh 0, el 0
  - kolano (dalsza strona) tuż nad poziomem 0 (do 8) ← `lunge.back`: „Zrób krok w tył i opuść się, aż tylne kolano będzie tuż nad podłogą; wróć, odpychając się przednią nogą.”
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
  - pięta tuż nad poziomem 0 (do 1) ← `lunge.back`: „Zrób krok w tył i opuść się, aż tylne kolano będzie tuż nad podłogą; wróć, odpychając się przednią nogą.”
- Uproszczenie ilustracyjne: pozostałe kąty. Przednia stopa zostaje w miejscu, tylna noga cofa się (pozycja „w trakcie” = krok w tył); długość kroku ilustracyjna.

### Bulgarian Split Squat (hantle)

Widok: z boku; kotwica: przód stopy; przyrządy: rect, line, line, db, db.

- **pozycja wyjściowa** — t 90, hip 24/5, knee 10/99, ft 0/209, sh 0, el 0
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
  - kostka (dalsza strona) tuż nad poziomem 24 (do 6) ← `bss.setup`: „Stań tyłem do ławki i oprzyj na niej grzbiet tylnej stopy; przednia stopa wysunięta.”
- **pozycja końcowa** — t 90, hip 89/-16, knee 96/140, ft 0/209, sh 0, el 0
  - kolano (dalsza strona) tuż nad poziomem 0 (do 8) ← `bss.move`: „Opuść się, uginając przednie kolano i biodro, aż tylne kolano będzie tuż nad podłogą; wstań, odpychając się przednią nogą.”
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
  - kostka (dalsza strona) tuż nad poziomem 24 (do 6) ← `bss.setup`: „Stań tyłem do ławki i oprzyj na niej grzbiet tylnej stopy; przednia stopa wysunięta.”
- Uproszczenie ilustracyjne: pozostałe kąty. Długość ustawienia nóg i wysokość ławki ilustracyjne.

### Step Up

Widok: z boku; kotwica: przód stopy; przyrządy: rect, db, db.

- **pozycja wyjściowa** — t 90, hip 90/12, knee 110/13, ft 0/0, sh 0, el 0
  - pięta tuż nad poziomem 26 (do 1) ← `stepup.move`: „Postaw całą stopę na podwyższeniu i wejdź, prostując tę nogę; zejdź kontrolowanie tą samą drogą.”
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
- **pozycja końcowa** — t 90, hip 0/60, knee 0/90, ft 0/-20, sh 0, el 0
  - zgięcie kolana: 0° (±5°) ← `stepup.move`: „Postaw całą stopę na podwyższeniu i wejdź, prostując tę nogę; zejdź kontrolowanie tą samą drogą.”
  - odcinek biodro–bark: 90° do poziomu (±8°) ← `lunge.torso`: „Tułów wyprostowany przez cały ruch.”
- Uproszczenie ilustracyjne: pozostałe kąty. Wysokość skrzyni ilustracyjna; druga noga w pozycji końcowej uniesiona obok (uproszczenie).

### Hip Thrust (sztanga)

Widok: z boku; kotwica: przód stopy; przyrządy: rect, line, line, plate.

- **pozycja wyjściowa** — t 150, hip 70, knee 135, ft 0, sh 40, el 20
  - pięta tuż nad poziomem 0 (do 1) ← `ht.setup`: „Oprzyj górną część pleców o krawędź ławki, sztangę połóż na biodrach (najlepiej na podkładce); stopy płasko, kolana ugięte.”
  - bark tuż nad poziomem 24 (do 6) ← `ht.setup`: „Oprzyj górną część pleców o krawędź ławki, sztangę połóż na biodrach (najlepiej na podkładce); stopy płasko, kolana ugięte.”
- **pozycja końcowa** — t 180, hip -4, knee 114, ft 0, sh 12, el 0
  - bark – biodro – kolano w jednej linii (±8°) ← `ht.move`: „Unieś biodra do pełnego wyprostu; opuść je kontrolowanie.”
  - pięta tuż nad poziomem 0 (do 1) ← `ht.setup`: „Oprzyj górną część pleców o krawędź ławki, sztangę połóż na biodrach (najlepiej na podkładce); stopy płasko, kolana ugięte.”
- Uproszczenie ilustracyjne: pozostałe kąty. Ułożenie dłoni na sztandze i kąt kolan w górnej pozycji ilustracyjne.

### Hip Thrust (hantel)

Widok: z boku; kotwica: przód stopy; na wzór: Hip Thrust (sztanga); przyrządy: rect, line, line, db.

- **pozycja wyjściowa** — t 150, hip 70, knee 135, ft 0, sh 40, el 20
  - pięta tuż nad poziomem 0 (do 1) ← `ht.dbSetup`: „Oprzyj górną część pleców o ławkę, stopy płasko na podłodze, hantel na biodrach przytrzymany dłońmi.”
  - bark tuż nad poziomem 24 (do 6) ← `ht.dbSetup`: „Oprzyj górną część pleców o ławkę, stopy płasko na podłodze, hantel na biodrach przytrzymany dłońmi.”
- **pozycja końcowa** — t 180, hip -4, knee 114, ft 0, sh 12, el 0
  - bark – biodro – kolano w jednej linii (±8°) ← `ht.move`: „Unieś biodra do pełnego wyprostu; opuść je kontrolowanie.”
  - pięta tuż nad poziomem 0 (do 1) ← `ht.dbSetup`: „Oprzyj górną część pleców o ławkę, stopy płasko na podłodze, hantel na biodrach przytrzymany dłońmi.”
- Uproszczenie ilustracyjne: pozostałe kąty. Ułożenie dłoni na sztandze i kąt kolan w górnej pozycji ilustracyjne.

### Glute Bridge

Widok: z boku; kotwica: przód stopy; przyrządy: brak.

- **pozycja wyjściowa** — t 180, hip 50, knee 108, ft 0, sh -6, el 0
  - pięta tuż nad poziomem 0 (do 1) ← `gb.setup`: „Połóż się na plecach, kolana ugięte, stopy płasko na podłodze na szerokość bioder.”
  - biodro tuż nad poziomem 0 (do 8) ← `gb.setup`: „Połóż się na plecach, kolana ugięte, stopy płasko na podłodze na szerokość bioder.”
- **pozycja końcowa** — t 203, hip 0, knee 93, ft 0, sh -29, el 0
  - bark – biodro – kolano w jednej linii (±8°) ← `gb.move`: „Unieś biodra, napinając pośladki, aż barki, biodra i kolana utworzą linię; opuść powoli.”
  - pięta tuż nad poziomem 0 (do 1) ← `gb.heels`: „Dociskaj stopy, zwłaszcza pięty, do podłogi.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Biceps Curl (hantle)

Widok: z boku; kotwica: przód stopy; przyrządy: db, db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0
  - zgięcie łokcia: 0° (±4°) ← `curl.dbSetup`: „Stań lub usiądź prosto, hantle w opuszczonych rękach, łokcie przy bokach.”
  - odcinek bark–łokieć: 90° do poziomu (±10°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 10, el 140
  - zgięcie łokcia: 140° (±12°) ← `curl.dbMove`: „Zginaj łokieć, obracając dłoń w stronę barku; opuść hantel do pełnego wyprostu ręki.”
  - odcinek bark–łokieć: 90° do poziomu (±15°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- Uproszczenie ilustracyjne: pozostałe kąty. Wysokość dłoni na górze ilustracyjna (zgięcie łokcia ok. 140°); obrót dłoni niewidoczny na schemacie.

### Barbell Curl

Widok: z boku; kotwica: przód stopy; przyrządy: plate.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0
  - zgięcie łokcia: 0° (±4°) ← `curl.bbGrip`: „Chwyć sztangę podchwytem, mniej więcej na szerokość barków; ręce wyprostowane.”
  - odcinek bark–łokieć: 90° do poziomu (±10°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 14, el 148
  - odcinek łokieć–dłoń: 90° do poziomu (±20°) ← `curl.bbMove`: „Zginaj łokcie, aż przedramiona będą pionowo; opuść sztangę do pełnego wyprostu rąk.”
  - odcinek bark–łokieć: 90° do poziomu (±15°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- Uproszczenie ilustracyjne: pozostałe kąty. „Przedramiona pionowo” przy łokciach przy bokach — z zakresem zgięcia łokcia przedramię jest tylko mniej więcej pionowe (ok. 20°).

### EZ Bar Curl

Widok: z boku; kotwica: przód stopy; na wzór: Barbell Curl; przyrządy: plate.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0
  - zgięcie łokcia: 0° (±4°) ← `curl.ezGrip`: „Chwyć gryf łamany podchwytem, mniej więcej na szerokość barków; ręce wyprostowane.”
  - odcinek bark–łokieć: 90° do poziomu (±10°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 14, el 148
  - odcinek łokieć–dłoń: 90° do poziomu (±20°) ← `curl.bbMove`: „Zginaj łokcie, aż przedramiona będą pionowo; opuść sztangę do pełnego wyprostu rąk.”
  - odcinek bark–łokieć: 90° do poziomu (±15°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- Uproszczenie ilustracyjne: pozostałe kąty. „Przedramiona pionowo” przy łokciach przy bokach — z zakresem zgięcia łokcia przedramię jest tylko mniej więcej pionowe (ok. 20°).

### Hammer Curl

Widok: z boku; kotwica: przód stopy; przyrządy: db, db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0
  - zgięcie łokcia: 0° (±4°) ← `curl.hammerMove`: „Zginaj łokieć, kciukiem w stronę barku, aż przedramię będzie pionowo; opuść do pełnego wyprostu.”
  - odcinek bark–łokieć: 90° do poziomu (±10°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 14, el 148
  - odcinek łokieć–dłoń: 90° do poziomu (±20°) ← `curl.hammerMove`: „Zginaj łokieć, kciukiem w stronę barku, aż przedramię będzie pionowo; opuść do pełnego wyprostu.”
  - odcinek bark–łokieć: 90° do poziomu (±15°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Cable Curl

Widok: z boku; kotwica: przód stopy; przyrządy: cable, grip.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 5, el 0
  - zgięcie łokcia: 0° (±4°) ← `curl.cableSetup`: „Chwyć uchwyt dolnego wyciągu podchwytem, ręce wyprostowane w dół.”
  - odcinek bark–łokieć: 90° do poziomu (±10°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 12, el 140
  - zgięcie łokcia: 140° (±12°) ← `curl.cableMove`: „Zginaj łokcie, przyciągając uchwyt w stronę barków; wróć do pełnego wyprostu rąk.”
  - odcinek bark–łokieć: 90° do poziomu (±15°) ← `curl.elbows`: „Łokcie zostają przy bokach — pracuje przedramię, nie ramię.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Triceps Pushdown

Widok: z boku; kotwica: przód stopy; przyrządy: cable, grip.

- **pozycja wyjściowa** — t 84, hip 6, knee 0, sh 6, el 125
  - odcinek bark–łokieć: 90° do poziomu (±12°) ← `tpd.elbows`: „Łokcie przy bokach — pracują przedramiona, nie barki.”
  - zgięcie łokcia: 125° (±25°) ← `tpd.move`: „Prostuj łokcie, wypychając uchwyt w dół; wróć, aż przedramiona zbliżą się do ramion.”
- **pozycja końcowa** — t 84, hip 6, knee 0, sh 6, el 5
  - zgięcie łokcia: 5° (±6°) ← `press.noLock`: „Prostuj ręce do końca, ale bez gwałtownego blokowania łokci.”
  - odcinek bark–łokieć: 90° do poziomu (±12°) ← `tpd.elbows`: „Łokcie przy bokach — pracują przedramiona, nie barki.”
- Uproszczenie ilustracyjne: pozostałe kąty. Lekkie pochylenie tułowia i ugięcie łokci na górze ilustracyjne.

### Overhead Triceps Extension (hantel)

Widok: z boku; kotwica: przód stopy; przyrządy: db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 165, el 0
  - zgięcie łokcia: 0° (±4°) ← `ote.setup`: „Chwyć hantel oburącz i wypchnij go nad głowę na wyprostowanych rękach.”
  - odcinek bark–łokieć: 90° do poziomu (±20°) ← `ote.upperArm`: „Ramiona nieruchomo, łokcie nad głową — pracują przedramiona.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 165, el 130
  - zgięcie łokcia: 130° (±20°) ← `ote.move`: „Zginaj łokcie, opuszczając hantel za głowę; wyprostuj ręce nad głową.”
  - odcinek bark–łokieć: 90° do poziomu (±20°) ← `ote.upperArm`: „Ramiona nieruchomo, łokcie nad głową — pracują przedramiona.”
- Uproszczenie ilustracyjne: pozostałe kąty. Ramiona nieruchomo nad głową; głębokość opuszczenia za głowę ilustracyjna.

### Cable Overhead Extension

Widok: z boku; kotwica: przód stopy; przyrządy: cable, grip.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 165, el 130
  - odcinek bark–łokieć: 90° do poziomu (±20°) ← `cote.setup`: „Uchwyt wyciągu za głową, łokcie skierowane w górę nad głową.”
  - zgięcie łokcia: 130° (±20°) ← `cote.move`: „Prostuj łokcie, wypychając uchwyt nad głowę; opuść go za głowę, zginając łokcie.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 165, el 3
  - zgięcie łokcia: 3° (±6°) ← `press.noLock`: „Prostuj ręce do końca, ale bez gwałtownego blokowania łokci.”
  - odcinek bark–łokieć: 90° do poziomu (±20°) ← `ote.upperArm`: „Ramiona nieruchomo, łokcie nad głową — pracują przedramiona.”
- Uproszczenie ilustracyjne: pozostałe kąty. Bloczek dolny za plecami (ustawienie ilustracyjne); ćwiczący stoi tyłem do wyciągu.

### Skullcrusher (EZ)

Widok: z boku; kotwica: biodro; przyrządy: rect, line, line, plate.

- **pozycja wyjściowa** — t 180, sh 100, el 0, hip -3, knee 95
  - zgięcie łokcia: 0° (±4°) ← `skull.setup`: „Połóż się na ławce, chwyć gryf wąsko nachwytem i trzymaj go nad czołem na prostych rękach.”
  - odcinek bark–łokieć: 90° do poziomu (±15°) ← `skull.upperArm`: „Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie.”
- **pozycja końcowa** — t 180, sh 100, el 105, hip -3, knee 95
  - dłoń przy: głowa + [0, 10] w układzie tułowia (≤ 12) ← `skull.depth`: „Opuszczaj, aż gryf będzie tuż nad czołem albo ramiona zaczną uciekać w tył.”
  - odcinek bark–łokieć: 90° do poziomu (±15°) ← `skull.upperArm`: „Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Triceps Dips (ławka)

Widok: z boku; kotwica: dłoń; przyrządy: rect, line, line.

- **pozycja wyjściowa** — t 88, hip 71, knee 15, ft 44, sh -29, el 0
  - zgięcie łokcia: 0° (±4°) ← `bdip.setup`: „Oprzyj dłonie o krawędź ławki za sobą, ręce proste, nogi wysunięte w przód.”
  - pięta tuż nad poziomem 0 (do 4) ← `bdip.setup`: „Oprzyj dłonie o krawędź ławki za sobą, ręce proste, nogi wysunięte w przód.”
- **pozycja końcowa** — t 105, hip 55, knee 0, ft 93, sh -52, el 90
  - zgięcie łokcia: 90° (±12°) ← `bdip.move`: „Opuść się, zginając łokcie, do lekkiego rozciągnięcia (mniej więcej kąt prosty w łokciach); wypchnij się do wyprostu.”
  - pięta tuż nad poziomem 0 (do 4) ← `bdip.setup`: „Oprzyj dłonie o krawędź ławki za sobą, ręce proste, nogi wysunięte w przód.”
- Uproszczenie ilustracyjne: pozostałe kąty. Nogi wyprostowane w przód, pięty na podłodze (wariant średni z bdip.easier).

### Lateral Raise (hantle)

Widok: z przodu; kotwica: kostka; przyrządy: db, db.

- **pozycja wyjściowa** — hip 3, sh 10, el 15
  - zgięcie łokcia: 15° (±10°) ← `lat.setup`: „Stań z hantlami przy udach, łokcie lekko ugięte, tułów stabilny.”
- **pozycja końcowa** — hip 3, sh 90, el 15
  - odcinek bark–dłoń: 0° do poziomu (±12°) ← `lat.height`: „Unoś mniej więcej do wysokości barków.”
  - łokieć (+0.5) wyżej niż dłoń ← `lat.elbows`: „Łokcie lekko ugięte i prowadzą ruch — są na wysokości dłoni lub wyżej.”
  - zgięcie łokcia: 15° (±10°) ← `lat.setup`: „Stań z hantlami przy udach, łokcie lekko ugięte, tułów stabilny.”
- Uproszczenie ilustracyjne: pozostałe kąty. Widok z przodu. Wysokość „mniej więcej do barków”; ugięcie łokci ilustracyjne.

### Cable Lateral Raise

Widok: z przodu; kotwica: kostka; przyrządy: cable, grip.

- **pozycja wyjściowa** — hip 3, sh 12/4, el 15/0
  - zgięcie łokcia: 15° (±10°) ← `clat.setup`: „Złap uchwyt dolnego wyciągu, łokieć lekko ugięty, tułów stabilny.”
- **pozycja końcowa** — hip 3, sh 90/4, el 15/0
  - odcinek bark–dłoń: 0° do poziomu (±12°) ← `lat.height`: „Unoś mniej więcej do wysokości barków.”
  - łokieć (+0.5) wyżej niż dłoń ← `lat.elbows`: „Łokcie lekko ugięte i prowadzą ruch — są na wysokości dłoni lub wyżej.”
- Uproszczenie ilustracyjne: pozostałe kąty. Widok z przodu; linka od dolnego bloczka po drugiej stronie ciała. Druga ręka swobodnie (w praktyce trzyma się wyciągu).

### Front Raise

Widok: z boku; kotwica: przód stopy; przyrządy: db, db.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 5, el 5
  - zgięcie łokcia: 5° (±10°) ← `front.elbows`: „Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 90, el 5
  - odcinek bark–dłoń: 0° do poziomu (±12°) ← `lat.height`: „Unoś mniej więcej do wysokości barków.”
  - zgięcie łokcia: 5° (±10°) ← `front.elbows`: „Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch.”
- Uproszczenie ilustracyjne: pozostałe kąty.

### Shrugs (sztanga)

Widok: z przodu; kotwica: kostka; przyrządy: rod.

- **pozycja wyjściowa** — hip 3, sh 4, el 0, elev 0
  - zgięcie łokcia: 0° (±3°) ← `shrug.setup`: „Stań prosto z ciężarem w opuszczonych, prostych rękach.”
- **pozycja końcowa** — hip 3, sh 4, el 0, elev 5
  - uniesienie barków (jedn. rysunku): 5° (±5°) ← `shrug.move`: „Unieś barki w górę, potem powoli je opuść.”
  - zgięcie łokcia: 0° (±3°) ← `shrug.tall`: „Tułów prosto i nieruchomo — pracują tylko barki.”
- Uproszczenie ilustracyjne: pozostałe kąty. Widok z przodu; wysokość uniesienia barków ilustracyjna („tak wysoko, jak się da”).

### Shrugs (hantle)

Widok: z przodu; kotwica: kostka; na wzór: Shrugs (sztanga); przyrządy: db, db.

- **pozycja wyjściowa** — hip 3, sh 4, el 0, elev 0
  - zgięcie łokcia: 0° (±3°) ← `shrug.setup`: „Stań prosto z ciężarem w opuszczonych, prostych rękach.”
- **pozycja końcowa** — hip 3, sh 4, el 0, elev 5
  - uniesienie barków (jedn. rysunku): 5° (±5°) ← `shrug.move`: „Unieś barki w górę, potem powoli je opuść.”
  - zgięcie łokcia: 0° (±3°) ← `shrug.tall`: „Tułów prosto i nieruchomo — pracują tylko barki.”
- Uproszczenie ilustracyjne: pozostałe kąty. Widok z przodu; wysokość uniesienia barków ilustracyjna („tak wysoko, jak się da”).

### Standing Calf Raise

Widok: z boku; kotwica: przód stopy; przyrządy: rect.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0, ft 20
  - przód stopy wyżej niż pięta ← `calf.move`: „Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek.”
  - zgięcie kolana: 0° (±10°) ← `calf.knees`: „Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 0, el 0, ft -35
  - pięta wyżej niż przód stopy ← `calf.move`: „Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek.”
  - zgięcie kolana: 0° (±10°) ← `calf.knees`: „Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych.”
- Uproszczenie ilustracyjne: pozostałe kąty. Przednia część stopy na podwyższeniu, pięty poza krawędzią; zakres ruchu w stawie skokowym ilustracyjny.

### Łydki na stopniu

Widok: z boku; kotwica: przód stopy; na wzór: Standing Calf Raise; przyrządy: rect.

- **pozycja wyjściowa** — t 90, hip 0, knee 0, sh 0, el 0, ft 20
  - przód stopy wyżej niż pięta ← `calf.move`: „Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek.”
  - zgięcie kolana: 0° (±10°) ← `calf.knees`: „Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych.”
  - przód stopy tuż nad poziomem 10 (do 3) ← `calf.step`: „Stań przednią częścią stóp na stabilnym stopniu, pięty poza krawędzią; przytrzymaj się czegoś dla równowagi.”
- **pozycja końcowa** — t 90, hip 0, knee 0, sh 0, el 0, ft -35
  - pięta wyżej niż przód stopy ← `calf.move`: „Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek.”
  - zgięcie kolana: 0° (±10°) ← `calf.knees`: „Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych.”
  - przód stopy tuż nad poziomem 10 (do 3) ← `calf.step`: „Stań przednią częścią stóp na stabilnym stopniu, pięty poza krawędzią; przytrzymaj się czegoś dla równowagi.”
- Uproszczenie ilustracyjne: pozostałe kąty. Przednia część stopy na stopniu, pięty poza krawędzią; podparcie dłonią pominięte (uproszczenie).

### Leg Press

Widok: z boku; kotwica: biodro; przyrządy: line, line, line, plank.

- **pozycja wyjściowa** — t 130, hip 90, knee 5, ft 135, sh 0, el 0
  - zgięcie kolana: 5° (±6°) ← `lp.noLock`: „Na górze nie blokuj kolan w przeproście.”
- **pozycja końcowa** — t 130, hip 132, knee 73, ft 135, sh 0, el 0
  - zgięcie kolana: 95° (±30°) ← `lp.move`: „Wypchnij platformę, prostując biodra i kolana; opuść ją powoli, uginając nogi.”
- Uproszczenie ilustracyjne: pozostałe kąty. Kąt oparcia i prowadnicy (45°) ilustracyjny; platforma przesuwa się wzdłuż prowadnicy. Stopy płasko na platformie (lp.heels).

### Calf Press (leg press)

Widok: z boku; kotwica: biodro; przyrządy: line, line, line, plank.

- **pozycja wyjściowa** — t 130, hip 90, knee 0, ft 150, sh 0, el 0
  - zgięcie kolana: 0° (±8°) ← `calf.press`: „Usiądź na prasie, oprzyj przednią część stóp na dolnej krawędzi platformy, pięty poza nią; nogi wyprostowane.”
  - zgięcie grzbietowe stopy: 15° (±10°) ← `calf.pressMove`: „Wypychaj platformę palcami jak najdalej, potem pozwól piętom wrócić, aż poczujesz rozciągnięcie łydek.”
- **pozycja końcowa** — t 130, hip 90, knee 0, ft 105, sh 0, el 0
  - zgięcie kolana: 0° (±8°) ← `calf.knees`: „Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych.”
  - zgięcie grzbietowe stopy: -30° (±10°) ← `calf.pressMove`: „Wypychaj platformę palcami jak najdalej, potem pozwól piętom wrócić, aż poczujesz rozciągnięcie łydek.”
- Uproszczenie ilustracyjne: pozostałe kąty. Nogi proste, ruch tylko w stawach skokowych; platforma przesuwa się wzdłuż prowadnicy. Zakres ruchu stopy ilustracyjny.

### Lying Leg Curl

Widok: z boku; kotwica: biodro; przyrządy: rect, line, line, grip.

- **pozycja wyjściowa** — t 0, hip 0, knee 0, ft 230, sh 150, el 30
  - zgięcie biodra: 0° (±8°) ← `llc.hips`: „Biodra przyciśnięte do ławki — bez wyginania pleców.”
  - zgięcie kolana: 0° (±5°) ← `llc.setup`: „Połóż się przodem; kolana na wysokości osi maszyny, wałek nad piętami na dolnej części łydek.”
- **pozycja końcowa** — t 0, hip 0, knee 110, ft 120, sh 150, el 30
  - zgięcie biodra: 0° (±8°) ← `llc.hips`: „Biodra przyciśnięte do ławki — bez wyginania pleców.”
  - zgięcie kolana: 110° (±25°) ← `llc.move`: „Zegnij kolana, przyciągając wałek w stronę pośladków; opuść go powoli.”
- Uproszczenie ilustracyjne: pozostałe kąty. Wałek na dolnej części łydek; końcowe zgięcie kolan ilustracyjne. Rama maszyny pominięta.

### Plank

Widok: z boku; kotwica: przód stopy; przyrządy: brak.

- **pozycja wyjściowa** — t 7, hip 0, knee 0, ft -88, sh 83, el 90
  - łokieć w pionie nad/pod: bark (±3) ← `plank.setup`: „Oprzyj się na przedramionach, łokcie dokładnie pod barkami, nogi wyprostowane.”
  - bark – biodro – kostka w jednej linii (±5°) ← `plank.move`: „Unieś tułów i trzymaj ciało w jednej linii od głowy do pięt; oddychaj normalnie.”
- Uproszczenie ilustracyjne: pozostałe kąty. Pozycja statyczna — jedna klatka, bez animacji.

### Dead Bug

Widok: z boku; kotwica: biodro; przyrządy: brak.

- **pozycja wyjściowa** — t 180, hip 90, knee 90, ft 60, sh 90, el 0
  - zgięcie biodra: 90° (±8°) ← `db.setup`: „Połóż się na plecach, ręce wyprostowane w górę, biodra i kolana ugięte pod kątem prostym.”
  - zgięcie kolana: 90° (±8°) ← `db.setup`: „Połóż się na plecach, ręce wyprostowane w górę, biodra i kolana ugięte pod kątem prostym.”
  - odcinek bark–dłoń: 90° do poziomu (±8°) ← `db.setup`: „Połóż się na plecach, ręce wyprostowane w górę, biodra i kolana ugięte pod kątem prostym.”
- **pozycja końcowa** — t 180, hip 90/15, knee 90/5, ft 60/100, sh 165/90, el 0
  - dłoń wyżej niż poziom 1 ← `db.move`: „Powoli opuść przeciwną rękę i nogę w stronę podłogi, nie kładąc ich; wróć i zmień strony.”
  - pięta (dalsza strona) wyżej niż poziom 0 ← `db.move`: „Powoli opuść przeciwną rękę i nogę w stronę podłogi, nie kładąc ich; wróć i zmień strony.”
  - zgięcie biodra: 90° (±8°) ← `db.move`: „Powoli opuść przeciwną rękę i nogę w stronę podłogi, nie kładąc ich; wróć i zmień strony.”
- Uproszczenie ilustracyjne: pozostałe kąty. Ręka bliższa i dalsza noga (przeciwne strony); dalsza noga szara. Jak nisko opuszczać — ilustracyjnie, bez dotykania podłogi.

### Bird Dog

Widok: z boku; kotwica: kolano; przyrządy: brak.

- **pozycja wyjściowa** — t 17, hip 72, knee 90, ft 210, sh 73, el 0
  - dłoń w pionie nad/pod: bark (±8) ← `bd.setup`: „Klęk podparty: dłonie pod barkami, kolana pod biodrami, plecy neutralnie.”
  - kolano w pionie nad/pod: biodro (±6) ← `bd.setup`: „Klęk podparty: dłonie pod barkami, kolana pod biodrami, plecy neutralnie.”
  - odcinek biodro–bark: 0° do poziomu (±18°) ← `bd.level`: „Biodra i barki równolegle do podłogi — bez skręcania tułowia.”
- **pozycja końcowa** — t 17, hip 72/-16, knee 90/0, ft 210/-119, sh 163/73, el 0
  - odcinek bark–dłoń: 0° do poziomu (±12°) ← `bd.move`: „Unieś jednocześnie przeciwną rękę i nogę do linii tułowia; wróć i zmień strony.”
  - dłoń przed: bark ← `bd.move`: „Unieś jednocześnie przeciwną rękę i nogę do linii tułowia; wróć i zmień strony.”
  - odcinek biodro–kostka (dalsza strona): 0° do poziomu (±12°) ← `bd.move`: „Unieś jednocześnie przeciwną rękę i nogę do linii tułowia; wróć i zmień strony.”
  - biodro przed: kostka (dalsza strona) ← `bd.move`: „Unieś jednocześnie przeciwną rękę i nogę do linii tułowia; wróć i zmień strony.”
  - odcinek biodro–bark: 0° do poziomu (±18°) ← `bd.level`: „Biodra i barki równolegle do podłogi — bez skręcania tułowia.”
- Uproszczenie ilustracyjne: pozostałe kąty. Bliższa ręka i dalsza noga (przeciwne strony). Ręce są dłuższe od ud, więc na schemacie tułów jest lekko uniesiony z przodu (uproszczenie proporcji).

### Mountain Climbers

Widok: z boku; kotwica: dłoń; przyrządy: brak.

- **pozycja wyjściowa** — t 20, hip 61/0, knee 114/0, ft -94/-75, sh 72, el 0
  - zgięcie kolana (dalsza strona): 0° (±8°) ← `mc.straight`: „Przy każdej zmianie wyprostuj tylną nogę do końca.”
  - dłoń w pionie nad/pod: bark (±6) ← `mc.setup`: „Podpór na prostych rękach, dłonie pod barkami lub trochę przed nimi; jedna noga ugięta pod klatką, druga wyprostowana w tył.”
- **pozycja końcowa** — t 20, hip 0/61, knee 0/114, ft -75/-94, sh 72, el 0
  - zgięcie kolana: 0° (±8°) ← `mc.straight`: „Przy każdej zmianie wyprostuj tylną nogę do końca.”
  - dłoń w pionie nad/pod: bark (±6) ← `mc.setup`: „Podpór na prostych rękach, dłonie pod barkami lub trochę przed nimi; jedna noga ugięta pod klatką, druga wyprostowana w tył.”
- Uproszczenie ilustracyjne: pozostałe kąty. Dwie pozycje: nogi zamieniają się miejscami. Tempo ilustracyjne (animacja wolniejsza niż ćwiczenie).

### Rowing Machine

Widok: z boku; kotwica: pięta; przyrządy: line, rect, cable, grip.

- **pozycja wyjściowa** — t 65, hip 132, knee 93, ft 50, sh 60, el 0
  - odcinek kolano–kostka: 90° do poziomu (±15°) ← `erg.setup`: „Zapnij stopy; w pozycji wyjściowej ręce proste, tułów pochylony w biodrach, piszczele mniej więcej pionowo.”
  - zgięcie łokcia: 0° (±4°) ← `erg.setup`: „Zapnij stopy; w pozycji wyjściowej ręce proste, tułów pochylony w biodrach, piszczele mniej więcej pionowo.”
- **w trakcie** — t 65, hip 116, knee 9, ft 50, sh 88, el 0
  - zgięcie kolana: 3° (±8°) ← `erg.drive`: „Pociągnięcie: najpierw nogi, potem odchylenie tułowia, na końcu ręce.”
  - zgięcie łokcia: 0° (±4°) ← `erg.drive`: „Pociągnięcie: najpierw nogi, potem odchylenie tułowia, na końcu ręce.”
- **pozycja końcowa** — t 105, hip 72, knee 1, ft 50, sh -42, el 130
  - zgięcie kolana: 3° (±8°) ← `erg.finish`: „Na końcu pociągnięcia nogi proste, tułów lekko odchylony, uchwyt tuż pod żebrami.”
  - odcinek biodro–bark: 75° do poziomu (±12°) ← `erg.finish`: „Na końcu pociągnięcia nogi proste, tułów lekko odchylony, uchwyt tuż pod żebrami.”
  - dłoń przy: biodro + [16, 8] w układzie tułowia (≤ 6) ← `erg.finish`: „Na końcu pociągnięcia nogi proste, tułów lekko odchylony, uchwyt tuż pod żebrami.”
- Uproszczenie ilustracyjne: pozostałe kąty. Trzy pozycje: wyjściowa, po pracy nóg, koniec pociągnięcia; powrót w odwrotnej kolejności (erg.recovery). Pochylenie tułowia ilustracyjne.

## Bez figury — lista otwarta (11)

| Ćwiczenie | Powód |
|---|---|
| Inverted Row | Pięty są osią obrotu, a drążek stoi w miejscu — w szkielecie bez grubości tułowia klatka nie dochodzi do drążka bez przesuwania stóp; rysunek wymagałby modelu grubości klatki. Do zrobienia z rozszerzonym modelem. |
| Sumo Deadlift | Różnica względem martwego ciągu klasycznego (szerokie ustawienie stóp, kolana na zewnątrz) jest widoczna tylko z przodu, a ruch bioder i kolan — tylko z boku; jeden widok 2D pokazałby zwykły martwy ciąg. Potrzebny widok z przodu dla kończyn dolnych. |
| Hack Squat | Ruch po prowadnicy maszyny z oparciem pod stałym kątem — wymaga modelu prowadnicy (biodro i barki przesuwają się wzdłuż oparcia); bez niego rysunek byłby zwykłym przysiadem. |
| Chest Fly (hantle) | Ruch w płaszczyźnie poziomej (odwodzenie poziome ramion) — z boku i z przodu ramię tylko się skraca; potrzebny widok z góry albo 3D. |
| Cable Fly | Ruch w płaszczyźnie poziomej (przywodzenie poziome ramion) — z boku i z przodu niewidoczny; potrzebny widok z góry albo 3D. |
| Reverse Fly (hantle) | Odwodzenie poziome ramion w opadzie tułowia — z boku ramię tylko się skraca; potrzebny widok z góry albo 3D. |
| Reverse Pec Deck | Odwodzenie poziome ramion siedząc — ruch w płaszczyźnie poziomej, niewidoczny w widoku z boku ani z przodu. |
| Russian Twist | Ruch to skręt tułowia — szkielet 2D nie ma obrotu wokół osi kręgosłupa. |
| Crunch | Ruch to zgięcie kręgosłupa (unoszenie łopatek przy lędźwiach na podłodze) — tułów w modelu jest sztywnym odcinkiem; rysunek pokazałby zgięcie w biodrach, czyli inne ćwiczenie. |
| Side Plank | Pozycja w płaszczyźnie czołowej (odwiedzenie, zgięcie boczne) — model widoku z boku liczy zgięcie i wyprost, więc kąty byłyby źle nazwane; potrzebny widok z przodu dla całego ciała w podporze. |
| Box Jump | Skok — tor lotu i lądowanie nie dają się uczciwie pokazać 2–3 pozycjami w pętli tam i z powrotem (powrót wyglądałby jak skok w tył). |

Poza tym bez figury: 42 ćwiczeń bazowych bez wskazówek etapu 1 (docs/research/27, lista otwarta) — figura czeka na wskazówki.
