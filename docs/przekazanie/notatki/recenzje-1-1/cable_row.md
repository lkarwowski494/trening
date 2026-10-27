# Recenzja ruchu 1.1: rodzina cable_row (9 ćwiczeń), 27.10.2026

Recenzent niezależny (bramka wydania 1.1, decyzja właściciela 27.10.2026, wariant A). Oceniam pozy z `origin/integracja-1-1` @ 4e5a7f95, plik `lib/figures/v2/poses/cable_row.json`. Uzasadnień generatorów ani opisów commitów z pozami nie czytałem.

Metoda jak w `pilotaz/recenzja-n6.md` i `dip.md`:

- Podgląd z zapisanych póz rysowałem funkcją `htmlPodgladu` z `v2-validate.mjs`: każda klatka kluczowa, rzut z boku i z przodu.
- PNG w pełnej rozdzielczości. Każde podejrzenie sprawdziłem stawami i kątami policzonymi silnikiem v2 (`keyframeFrame`, `jointAngles`) w u = 0 / 0,25 / 0,5 / 0,75 / 1.
- Ruch porównywałem ze wskazówkami ćwiczenia (`lib/cues`, `cue-sets.json`).
- Współrzędne: x w przód, y w górę, z w prawo osoby, w cm.

Uwaga o zakresie: rodzina ma w `families.ts` status `planned`, więc `figureSpec` zwraca dziś null i aplikacja tych póz nie wyświetla. Oceniam dane, które 1.1 ma włączyć.

Walidator (`waliduj` na każdej pozie): **9/9 OK**. Szczelność reguł automatycznych: **0 z 3 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Seated Cable Row** | **BŁĄD** | siedzi w powietrzu, bez siedziska i podnóżka (nr 1) |
| **Wiosłowanie na linkach (siedząc)** | **BŁĄD** | ta sama poza co Seated Cable Row (nr 1) |
| **Cable Rope Rear-Delt Rows** | **BŁĄD** | siedzi w powietrzu (nr 1); bloczek nisko (uwaga A) |
| Standing Cable Row | OK z uwagą | tułów pionowo, chwyt (wysokość barku) → biodro, łokieć 19° → 100°; uwaga A |
| Single Arm Cable Row | OK z uwagą | jak Standing, pracuje prawa ręka, lewa dłoń na biodrze; uwaga A |
| Face Pull | OK | bloczek y 150 (≥ wysokość barków, zgodnie z `fp.setup`), lina do twarzy, łokcie wysoko i na boki |
| Machine Row | OK z uwagą | dźwignia o stałym promieniu (70 cm), łokieć 18° → 123°; uwaga B |
| Leverage High Row | OK z uwagą | chwyt z góry (y 116) do klatki (y 81), łokcie szeroko (z 42–45); uwaga B |
| Kneeling High Pulley Row | OK | klęk obunóż, bloczek y 190, drążek z góry do klatki, tułów pionowo |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Seated Cable Row, Wiosłowanie na linkach (siedząc), Cable Rope Rear-Delt Rows** | wszystkie klatki: sprzęt, miednica, nogi | **Postać siedzi w powietrzu.** Sprzęt to tylko `podloga` i `wyciag` (bloczek x 132, y 55). Środek miednicy stoi w y = 52,8, a pod nim nie ma niczego aż do podłogi (y = 0). To ta sama wysokość miednicy co w Machine Row, gdzie leży na siedzisku `lawka` top 43, więc poza jest „siadem na krześle” z usuniętym krzesłem. Stopy stoją płasko na podłodze (pięta y 0, x 48), kolana zgięte 81°, biodro 82°. Wskazówka `scr.sit` wyświetlana przy ćwiczeniu mówi: „Usiądź, oprzyj stopy, kolana lekko ugięte”. Na rysunku nie ma podnóżka, o który można oprzeć stopy, a kolana są zgięte pod kątem prostym, nie lekko. Ruch rąk jest poprawny: chwyt (74,5; 99,8) → (26; 64,8), łokieć 19° → 100°, łokieć za tułowiem (x −2,8), odwiedzenie 7–29°. | Siedzisko (`lawka`, płaskie, top ok. 40–45 cm) pod miednicą i podnóżek przed stopami (np. `skrzynia` pochylona albo pionowa płyta przy bloczku), stopy oparte o podnóżek, kolana ok. 15–30° zgięcia. Bloczek na wysokości podnóżka. Wiosłowanie rope rear-delt: to samo siedzisko. | 90% | realny (każde wyświetlenie po włączeniu rodziny) | nie: brak reguły „miednica podparta” (siedzenie bez siedziska). R17 z n6 (styk z podłożem) też by nie złapała, bo stopy dotykają podłogi |

## OK z uwagą (backlog, nie blokuje)

- **A. Linka nie leży w linii przedramienia w u = 0** (Seated, Wiosłowanie siedząc, Rear-Delt, Standing, Single Arm). Na starcie ręce są poziomo na wysokości barków (bark sagitalnie 91–92°), a bloczek jest niżej: linka schodzi od dłoni pod kątem ok. 38° (Seated: chwyt y 99,8, bloczek y 55) i ok. 30° (Standing: chwyt ok. y 135, bloczek y 100).
  Dłoń jedzie w trakcie ruchu w dół (Seated: −35 cm na 48 cm drogi w tył), a nie wzdłuż linki. W praktyce przy wyprostowanych rękach dłonie leżą mniej więcej na linii linki, na wysokości brzucha. W Rear-Delt bloczek y 55 przy dłoniach na wysokości barków: zwykle ustawia się go na wysokości klatki. Pewność 65%.
- **B. Maszyny wiosłujące (Machine Row, Leverage High Row) mają oparcie za plecami (`lawka` kat 80) i nie mają podpórki pod klatkę.** Ciężar ciągnie tułów do przodu, więc w tych maszynach osoba opiera klatkę o podpórkę z przodu. Oparcie z tyłu sugeruje odchylanie się. Rysunek jest schematyczny (kontrakt `dzwignia`), więc nie liczę tego jako błędu. Pewność 60%.
  Machine Row: łokcie w połowie ruchu odchodzą na zewnątrz (z 44,8 w u = 0,5) i wracają (31 w u = 1). Przy wskazówce „łokcie blisko tułowia” (z rodzinnego `row`) mogłyby iść bliżej, ok. z 25–30.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `miednica_podparta` (niezmiennik) | gdy biodro zgięte ≥ 45° i kolano ≥ 45° przy tułowiu ≤ 30° od pionu (poza siedząca), pod środkiem miednicy ≤ 12 cm niżej musi leżeć powierzchnia sprzętu (`lawka`, `skrzynia`, `pilka_gimnastyczna`) albo podłoga | 3 pozy: pod miednicą 52,8 cm pustki | Machine Row, Leverage High Row: siedzisko 43, miednica 52,8, bez alarmu; Kneeling, Standing, Face Pull: poza nie jest siedząca |
