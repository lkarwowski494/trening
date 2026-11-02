# Wskazówki techniki — rodzina `strongman` (fala W1, G6)

- Data: 02.11.2026 (część 1, kontynuacja 1 i kontynuacja 2 tego samego dnia)
- Autor: badacz-merytoryczny (agent)
- Zakres: Tire Flip, Atlas Stones, Sandbag Load, Yoke Walk, Log Lift, Keg Load, Jefferson Squat, Circus Bell, Conan's Wheel, Power Stairs
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda: jak w `carry.md`. Wskazówka wchodzi, gdy potwierdzają ją ≥ 2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji. Bez liczb i bez twierdzeń zdrowotnych: kilka przeczytanych źródeł pisze o urazach (np. bicepsa przy oponie i kamieniu, palców przy kamieniu, kostki przy dzwonie), ale tych treści celowo nie przenoszę. Wszystkie strony czytane 02.11.2026 (WebFetch).

**Kontynuacja 1 (02.11.2026) — zmiana po rozstrzygnięciu koordynatora o szczeblach organizacji.** Każdą organizację oceniłem według kryteriów (a) rodzaj organizacji, (b) autor i data albo treść firmowana, (c) bez marketingu i afiliacji (tabela w p. 3). Skutki: EliteFTS, Strength Shop i Fitness Volt spadają do szczebla 5. Doszły źródła BarBend (szczebel 4, artykuły o technice).

**Kontynuacja 2 (02.11.2026) — Cerberus Strength rozstrzygnięty: szczebel 5.** Przeczytałem katalog sklepu (p. 3.1): Cerberus nie sprzedaje kłody, kamieni ani form do kamieni, tylko akcesoria (m.in. nakładki na kłodę, rękawy i pas do kamieni). Warunek „własny rodzaj sprzętu” nie jest spełniony. Wpisy z dawnego p. 2b (`as.grip`, `log.clean`, `log.press`) mają teraz po jednym źródle szczebla 4 i przechodzą do „Otwarte”. Log Lift jest otwarte w całości. Zbadane też: Circus Bell (jedno źródło szczebla 4), Conan's Wheel i Power Stairs (brak źródeł szczebla 4) oraz drugie źródło dla Jefferson Squat i Keg Load (nie znalezione).

## 1. Tabela ćwiczeń

| Ćwiczenie | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Tire Flip | open | częściowe | tylko `tf.push` (8weeksout + BarBend). Bez EliteFTS (szczebel 5) `tf.setup`, `tf.drive` i `tf.mis.arms` mają po jednym źródle szczebla 4; przy `tf.setup` BarBend opisuje rozstaw sumo (patrz „Otwarte”) |
| Atlas Stones | open | częściowe | `as.setup`, `as.lap`, `as.extend` (8weeksout + BarBend). `as.grip` otwarte (Cerberus to szczebel 5). Błędu brak, bo źródła sobie przeczą (patrz „Otwarte”) |
| Sandbag Load | open | częściowe | tylko `sb.lap` (BarBend + Bells of Steel); reszta ma jedno źródło szczebla 4 |
| Yoke Walk | general (`carry`) | gotowe | ustawienie, ruch, wskazówka, błąd (Bells of Steel + BarBend); `yoke.brace` w nowym brzmieniu, bez wdechu; ogólny zestaw do zastąpienia |
| Log Lift | open | otwarte | po zmianie Cerberusa na szczebel 5 każde zdanie ma jedno źródło szczebla 4 (BarBend); zostaje `open` |
| Keg Load | open | otwarte | nie ma dwóch przeczytanych źródeł szczebla 4 o ładowaniu beczki (sprawdzone ponownie w kontynuacji 2) |
| Jefferson Squat | general (`squat`) | otwarte | obecny zestaw tylko częściowo potwierdzony dla tego wariantu (patrz „Otwarte”); jedno źródło szczebla 4, drugiego nie znalazłem |
| Circus Bell | open | otwarte | jedno źródło szczebla 4 (BarBend, przeczytane); drugiego nie znalazłem |
| Conan's Wheel | open | otwarte | brak przeczytanego źródła szczebla 4 o technice |
| Power Stairs | open | otwarte | brak przeczytanego źródła szczebla 4 o technice |

## 2a. JSON do `exercises` (cues.json) — dwa bezwarunkowe źródła szczebla 4 — NIEAKTUALNY — patrz przeliczenie 02.11.2026

```json
{
  "Tire Flip": {
    "setup": [],
    "move": [
      {
        "c": "tf.push",
        "s": [
          ["8wo-tire-flip", "Flip/Push (dłońmi przepchnij oponę na drugą stronę)"],
          ["barbend-strongman-ex", "1. Tire flip (po złapaniu opony na wysokości klatki przepchnij ją z wykroku)"]
        ]
      }
    ],
    "tips": [],
    "mistakes": []
  },
  "Atlas Stones": {
    "setup": [
      {
        "c": "as.setup",
        "s": [
          ["8wo-atlas", "Setup and Stance („straddling directly over the top of the stone”)"],
          ["barbend-atlas", "Step 1 Grip the Stone (środek kamienia między łukami stóp)"]
        ]
      }
    ],
    "move": [
      {
        "c": "as.lap",
        "s": [
          ["8wo-atlas", "Loading the Lap"],
          ["barbend-atlas", "Step 2 Lap the Stone (kamień do bioder, usiądź w tył, kamień na udach)"]
        ]
      },
      {
        "c": "as.extend",
        "s": [
          ["8wo-atlas", "Extension (najpierw biodra w górę, potem wypchnięcie bioder)"],
          ["barbend-atlas", "Step 3 Drive Up to Load the Stone (wstajesz, wypychając biodra do przodu)"]
        ]
      }
    ],
    "tips": [],
    "mistakes": []
  },
  "Sandbag Load": {
    "setup": [],
    "move": [
      {
        "c": "sb.lap",
        "s": [
          ["barbend-sandbag", "Step-By-Step Sandbag Guide, kroki 3–4 (ruch jak w RDL; za kolanami usiądź w tył i przyciągnij worek na uda)"],
          ["bos-sandbag", "lifting („Deadlift the bag into your lap.”; biodra w tył)"]
        ]
      }
    ],
    "tips": [],
    "mistakes": []
  },
  "Yoke Walk": {
    "setup": [
      {
        "c": "yoke.setup",
        "s": [
          ["bos-yoke", "setup („Position the crossbeam on your back.”)"],
          ["barbend-yoke", "Step 1 Get Under the Yoke (barki czworoboczne dociśnięte do belki, góra pleców jako półka)"]
        ]
      }
    ],
    "move": [
      {
        "c": "yoke.brace",
        "s": [
          ["bos-yoke", "Bracing (napięcie brzucha przed startem)"],
          ["barbend-yoke", "Step 1 Form Tip, Step 2 Stand Up (napnij brzuch, potem wstań)"]
        ]
      }
    ],
    "tips": [
      {
        "c": "yoke.steps",
        "s": [
          ["bos-yoke", "Step Length (krótkie kroki)"],
          ["barbend-yoke", "Step 3 Take Small, Quick Steps"]
        ]
      }
    ],
    "mistakes": [
      {
        "c": "yoke.mis.stride",
        "s": [
          ["bos-yoke", "Common Mistakes (zbyt duże kroki)"],
          ["barbend-yoke", "Step 3 Form Tip (długie kroki psują stabilność tułowia i bioder)"]
        ]
      }
    ]
  }
}
```

„Tire Flip”, „Atlas Stones” i „Sandbag Load” są częściowe, więc proponuję je na listę `partial`. „Yoke Walk” jest kompletne.

## 2b. Wpisy warunkowe — WYCOFANE (kontynuacja 2)

Dawny blok opierał się na Cerberus Strength jako szczeblu 4. Po przeczytaniu katalogu (p. 3.1) Cerberus to szczebel 5, więc bloku nie wprowadzać. Zdania `as.grip`, `log.clean` i `log.press` są w „Otwarte”, a ich brzmienia w p. 4 zostają jako materiał na później, gdy znajdzie się drugie źródło szczebla 4.

## 3. Źródła

### 3.1 Ocena organizacji (rozstrzygnięcie koordynatora z 02.11.2026)

| Organizacja | (a) rodzaj | (b) autor/data | (c) marketing | Szczebel |
|---|---|---|---|---|
| 8weeksout | serwis trenera, który prowadzi kurs certyfikujący dla trenerów (strona `8weeksout.com/conditioning-certification/`, czytana 02.11.2026) | artykuły z datą, firmowane | artykuły o technice bez sprzedaży | **4** |
| BarBend | serwis z redakcją; autorzy z kwalifikacjami (CSCS, NASM-CPT) | autor + data aktualizacji; przy kamieniu także recenzent | artykuły o technice (nie recenzje produktów) | **4** |
| Bells of Steel | producent; jarzmo i worki to jego własne produkty (artykuły linkują do własnego jarzma i worków) | treść firmowana, z datą (2022), bez autora | głównie instruktaż, na końcu warstwa sprzedażowa | **4** (tylko jarzmo i worek — własny sprzęt) |
| Cerberus Strength | sklep i marka sprzętu strongman. **Katalog przeczytany 02.11.2026:** kolekcja „Strongman” (https://cerberus-strength.com/collections/strongman, strony 1–4), kolekcja „Strongman Implements” (https://cerberus-strength.com/collections/strongman-equipment — sześć produktów: uprząż, nakładki do martwego ciągu, uchwyty do kamienia Nicol, dwa gryfy, pas do kamieni „Atlas Stone Sling”) i wyszukiwanie „log” (tylko „Strongman Log Pad Set”, czyli nakładki). Kłody, kamieni ani form do kamieni nie ma; są tylko akcesoria do nich | „CERBERUS Media” + podpisany trener + data | treść artykułu bez promocji, ale strona ma banery sklepu | **5**: kłoda i kamień to nie jego własny rodzaj sprzętu. Akcesoria do kamieni (rękawy, pas) nie spełniają warunku, bo artykuły opisują technikę z samym kamieniem i kłodą |
| EliteFTS | producent sprzętu siłowego; opona i kłoda to nie jego sprzęt (nie potwierdzono); brak informacji o recenzji eksperckiej | autor + data | artykuł bez sprzedaży | **5** (dla tych artykułów) |
| Strength Shop | producent/sklep sprzętu strongman | data, bez autora | artykuł o jarzmie zbudowany wokół promocji własnego jarzma i innych produktów („mainly sales-oriented”) | **5** |
| Fitness Volt | serwis fitness; strona bez autora, bez informacji o redakcji ani recenzji | brak autora | — | **5** |
| Gegns Gym (dawniej adres grindergym) | siłownia, strona bez autora | brak | — | **5** (wskazówka praktyki, nie liczy się) |
| USAWA | federacja trójboju ogólnego (all-round), nie szkoli trenerów | autor + data (2012) | bez sprzedaży | **5** — nie spełnia (a); tylko wskazówka |
| Rogue Fitness (strona filmu o kłodzie) | producent kłód (własny sprzęt) | data (2022/2025), bez autora tekstu | — | nie liczy się: strona ma jedno zdanie opisu, technika tylko w filmie (nie przeczytana treść) |
| Gymleco (strona produktu „Conan Wheel”) | producent przyrządu | — | karta produktu: wymiary i opis marketingowy | nie liczy się: brak instrukcji techniki |

### 3.2 Źródła (wszystkie czytane 02.11.2026)

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| elitefts-tire-flip | EliteFTS | C.J. Murphy, Tire Flipping: Tips and Techniques (2006) | https://elitefts.com/blogs/training/tire-flipping-tips-and-techniques | 5 (było 4) | tak |
| elitefts-log-mistakes | EliteFTS | M. Mastell, 9 Log Press Mistakes and How to Fix Them (2015) | https://elitefts.com/blogs/training/9-log-press-mistakes-and-how-to-fix-them | 5 (było 4) | tak |
| 8wo-tire-flip | 8weeksout | Tire Flip Technique (2014) | https://8weeksout.com/2014/06/03/tire-flip-technique/ | 4 | tak |
| 8wo-atlas | 8weeksout | Atlas Stone (2014) | https://8weeksout.com/?p=2853 | 4 | tak |
| cerberus-atlas | Cerberus Strength | Become the Queen/King of the Atlas Stones (S. Bradley, 2023) | https://cerberus-strength.com/blogs/training-tips/become-the-queen-king-of-the-atlas-stones-with-sandra-bradley | 5 (było „4 warunkowo”; katalog bez kamieni) | tak |
| cerberus-log | Cerberus Strength | Log Lifting Tips & Techniques (D. McPherson, 2023) | https://cerberus-strength.com/blogs/training-tips/log-lifting-tips-techniques-with-pro-coach-dale-mcpherson | 5 (było „4 warunkowo”; katalog bez kłody) | tak |
| bos-yoke | Bells of Steel | How to Get Into Strongman: Yoke Walk (2022) | https://www.bellsofsteel.us/blog/gear-education/how-to-get-into-strongman-yoke-walk/ | 4 | tak |
| strengthshop-yoke | Strength Shop | Master the Yoke (2026) | https://strengthshop.eu/blogs/news/master-the-yoke-your-guide-to-yoke-training-for-strongman-athletes | 5 (było 4) | tak |
| barbend-atlas | BarBend | Everything You Need to Know About Hoisting Atlas Stones (M. Gill, akt. M. Dewar 26.06.2024, recenzja ekspercka) | https://barbend.com/strongman-atlas-stone-technique/ | 4 | tak |
| barbend-yoke | BarBend | Get Lean, Get Strong, and Get Fast With the Yoke Walk (M. Dewar, akt. 20.11.2024) | https://barbend.com/yoke-walk/ | 4 | tak |
| barbend-sandbag | BarBend | Why Every Athlete Can Benefit From Sandbag Training (M. Barker), sekcja „Step-By-Step Sandbag Guide” | https://barbend.com/sandbag-training/ | 4 | tak |
| barbend-strongman-ex | BarBend | The 10 Best Strongman Exercises (J. Dickson, recenzja 03.07.2024) | https://barbend.com/best-strongman-exercises/ | 4 (zestawienie ćwiczeń z opisem wykonania, nie recenzja produktów) | tak |
| bos-sandbag | Bells of Steel | How to Get Into Strongman: Filling and Lifting Sandbags (2022) | https://www.bellsofsteel.us/blog/gear-education/how-to-get-into-strongman-filling-and-lifting-sandbags | 4 | tak |
| barbend-jefferson | BarBend | Jefferson Squat – Exercise Guide (A. Barr, akt. 18.06.2025) | https://barbend.com/jefferson-squat | 4 | tak (użyte tylko w „Otwarte”) |
| barbend-circus | BarBend | Get Stronger Single-Handedly: Starting with the Strongman Circus Dumbbell (M. Gill, akt. 28.05.2025) | https://barbend.com/news/get-stronger-single-handedly-starting-strongman-circus-dumbbell/ | 4 (artykuł o technice) | tak (kontynuacja 2; użyte tylko w „Otwarte”) |

Przeczytane, ale niewliczone (szczebel 5 albo bez treści o technice): Fitness Volt „Sandbag Loading” (https://fitnessvolt.com/strongman/training/sandbag-loading), Gegns Gym „Sandbag Carry and Load” (https://gegnsgym.com/?p=90275), USAWA „Jefferson Lift Technique” (https://www.usawa.com/?p=8520), Lift Big Eat Big „Keg Carry” (https://liftbigeatbig.com/?p=6753 — to inne ćwiczenie, noszenie beczki, więc tylko analogia), Breaking Muscle „Must-Have Equipment for Strongman Training” (szczebel 5, bez instrukcji ładowania beczki), Cerberus „Mastering the Art of Sandbag Training” (bez instrukcji techniki), Rogue „How to lift a strongman log” (https://www.roguefitness.com/theindex/video/how-to-lift-a-strongman-log-with-steve-slater — tylko film, jedno zdanie opisu), Gymleco „Conan Wheel” (https://gymleco.com/products/conan-wheel — karta produktu bez techniki).

Nowe organizacje: **BarBend** już jest w `orgs`. **Bells of Steel**: szczebel 4 dla własnego sprzętu (jarzmo, worki), `kind: maker`. **8weeksout**: szczebel 4, `kind: site` (prowadzi kurs certyfikujący trenerów). **Cerberus Strength**: nie dodawać jako organizacji szczebla 4 (kontynuacja 2). EliteFTS i Strength Shop: też nie dodawać.

## 4. Nowe zdania

| id | PL | EN (propozycja) | Źródła | Stan |
|---|---|---|---|---|
| tf.push | Gdy opona stanie wyżej, przepchnij ją rękami na drugą stronę. | Once the tire is up, push it over with your hands. | 8wo-tire-flip, barbend-strongman-ex | do JSON |
| as.setup | Stań nad kamieniem tak, żeby był między stopami. | Stand over the stone so it sits between your feet. | 8wo-atlas, barbend-atlas | do JSON |
| as.lap | Podnieś kamień nad kolana i oprzyj go na udach. | Lift the stone over your knees and rest it on your thighs. | 8wo-atlas, barbend-atlas | do JSON |
| as.extend | Z ud mocno wypchnij biodra i wyprostuj się, unosząc kamień wyżej. | From your lap, drive your hips through and stand up, bringing the stone higher. | 8wo-atlas, barbend-atlas | do JSON |
| as.grip | Obejmij kamień przedramionami i dłońmi i mocno go ściśnij. | Wrap your forearms and hands around the stone and squeeze hard. | 8wo-atlas (cerberus-atlas — szczebel 5) | otwarte (jedno źródło szczebla 4) |
| sb.lap | Cofnij biodra, podnieś worek jak w martwym ciągu i przyciągnij go na uda. | Push your hips back, deadlift the bag and pull it into your lap. | barbend-sandbag, bos-sandbag | do JSON |
| yoke.setup | Wejdź pod jarzmo i oprzyj belkę na górze pleców. | Get under the yoke and set the crossbar on your upper back. | bos-yoke, barbend-yoke | do JSON |
| yoke.brace | **Nowe brzmienie:** Napnij brzuch, zanim wstaniesz z jarzmem. | Brace your core before you stand up with the yoke. | bos-yoke, barbend-yoke | do JSON |
| yoke.steps | Rób krótkie kroki. | Take short steps. | bos-yoke, barbend-yoke | do JSON |
| yoke.mis.stride | **Nowe brzmienie:** Za długie kroki. | Strides too long. | bos-yoke, barbend-yoke | do JSON |
| log.clean | **Nowe brzmienie:** Podnieś kłodę na uda, a potem poprowadź ją blisko tułowia na klatkę. | Bring the log to your lap, then roll it up close to your body onto your chest. | barbend-strongman-ex (cerberus-log — szczebel 5) | otwarte (jedno źródło szczebla 4) |
| log.press | **Nowe brzmienie:** Wypchnij kłodę nad głowę, aż ręce się wyprostują. | Drive the log overhead until your arms are straight. | barbend-strongman-ex (cerberus-log — szczebel 5) | otwarte (jedno źródło szczebla 4) |

Do JSON idzie 9 zdań (wszystkie z p. 2a). `as.grip`, `log.clean` i `log.press` nie idą.

Wycofane z propozycji (zostały po jednym źródle szczebla 4 po obniżeniu EliteFTS i Strength Shop): `tf.setup`, `tf.drive`, `tf.mis.arms`, `log.grip`, `log.mis.elbows`. Brzmienia z części 1 zostają w historii pliku; nie wprowadzać.

**`yoke.brace` a zasada oddechu.** Poprzednie brzmienie („Weź wdech, napnij brzuch i wstań; trzymaj to napięcie przez cały marsz”) zmieniam na „Napnij brzuch, zanim wstaniesz z jarzmem.” Powód: zasada CLAUDE.md dopuszcza tylko proste wskazówki oddechu bez wstrzymywania, a wdech przed napięciem w połączeniu z „trzymaj napięcie przez cały marsz” można odczytać jako wstrzymanie oddechu. BarBend (Step 1–2) mówi tylko o napięciu brzucha, bez oddechu. „Przez cały marsz” było tylko w Bells of Steel, więc też wypada. Jeśli koordynator woli zdanie istniejące, `plank.brace` („Napnij brzuch, żeby tułów był sztywny.”) też ma pokrycie w obu źródłach, ale nie mówi, kiedy się napiąć.

## 5. Otwarte

- **Błędy w zestawie ogólnym — Yoke Walk** (`lib/figures/v2/cue-sets.json`: `ok: ["carry.walk"]`): `carry.walk` mówi „spokojnym, kontrolowanym krokiem”, a przeczytane źródła o jarzmie mówią o krokach krótkich i szybkich (BarBend: „small, choppy steps”). Zestaw ogólny przeczy źródłom; karta własna go zastępuje.
- **Jefferson Squat — zestaw ogólny** (`ok: ["sq.back", "sq.kneesToes"]`, `err: ["sq.mis.kneesIn"]`): zestaw pasuje tylko częściowo. BarBend (Stance/Grip/Ascent) potwierdza klatkę uniesioną i kolana na zewnątrz, ale ustawienie jest inne niż w przysiadzie: stopy po obu stronach sztangi, przednia na wprost, tylna obrócona w bok, chwyt mieszany. Przy obróconej tylnej stopie „kolana w linii palców” (`sq.kneesToes`) nie jest potwierdzone. Źródło mówi „kolana nad kostkami, na zewnątrz”. Kolan zapadających się do środka (`sq.mis.kneesIn`) BarBend nie wymienia. To błąd zestawu w sensie „niepotwierdzony dla tego wariantu” (nie sprzeczny). **Drugie źródło szczebla 4 — szukane ponownie w kontynuacji 2, nie znalezione:** wyszukiwanie w witrynach NASM, ACE, ISSA i NSCA nie dało żadnej strony o tym ćwiczeniu; powerliftingtechnique.com — 403 (i bez oceny organizacji); pozostałe trafienia to serwisy bez redakcji (Fitness Volt, MasterClass, Generation Iron), sklepy i blogi marketingowe (szczebel 5), Garage Gym Reviews (według koordynatora nie liczyć) albo bazy ćwiczeń aplikacji (wykluczone); Mirafit opisuje martwy ciąg Jeffersona (inne ćwiczenie) i daje 403. Propozycja bez zmian: zmienić Jefferson Squat na `open` albo zostawić tylko `sq.back` jako uproszczenie — do decyzji koordynatora.
- **Atlas Stones — błędy**: źródła sobie przeczą. 8weeksout uznaje wkładanie dłoni pod kamień za błąd, a BarBend (Step 1) każe wsunąć dłonie jak najgłębiej pod kamień. Przed ciągnięciem jak w klasycznym/sumo martwym ciągu ostrzega tylko 8weeksout; BarBend zaleca skłon jak w RDL i ostrzega przed nienazwanymi „innymi technikami”, więc tego błędu wprost nie nazywa. Puszczanie kamienia na górze — tylko Cerberus (szczebel 5). Nie ma wspólnego błędu; nie wprowadzać.
- **Atlas Stones — `as.grip`**: tylko 8weeksout (Grip). Cerberus to szczebel 5 (p. 3.1).
- **Tire Flip — rozstaw dłoni i ustawienie**: 8weeksout: dłonie na zewnątrz stóp, klatka oparta o oponę; BarBend: rozstaw sumo, ręce zwisają w dół (dłonie wewnątrz stóp). Sprzeczność na tym samym szczeblu, a części wspólnej („przykucnij szeroko i chwyć spód opony”) nie da się podać bez wyboru wariantu. `tf.drive` i `tf.mis.arms`: tylko 8weeksout (EliteFTS teraz szczebel 5).
- **Sandbag Load — reszta**: ustawienie nad workiem (BarBend; Fitness Volt — szczebel 5), objęcie worka i przyciśnięcie do klatki (Bells of Steel; BarBend opisuje to tylko przy noszeniu worka, czyli analogia), wyprost bioder przy ładowaniu (BarBend; Fitness Volt — szczebel 5). Błąd „podciąganie worka rękami”: Bells of Steel tak; Fitness Volt opisuje ruch „martwy ciąg i wiosłowanie”, czyli raczej przeczy. Każde z tych to jedno źródło szczebla 4.
- **Log Lift — całe ćwiczenie**: Cerberus to szczebel 5 (katalog bez kłody, p. 3.1), więc `log.clean` i `log.press` mają tylko BarBend (`barbend-strongman-ex`); `log.grip` i `log.mis.elbows` — wcześniej tylko EliteFTS albo Cerberus (oba szczebel 5). Szukani producenci kłód z tekstem o technice: Rogue — strona tylko z filmem; Mirafit („Log Press Masterclass”) — 403; Bells of Steel — wyszukiwarka nie pokazała artykułu o kłodzie (nie sprawdzono bezpośrednio na blogu producenta).
- **Keg Load**: brak dwóch przeczytanych źródeł szczebla 4. Bodybuilding.com przekierowuje na sklep i daje 404; strona ATR Training Systems — 404 (to i tak siłownia, szczebel 5); Gegns Gym — szczebel 5; Lift Big Eat Big opisuje noszenie beczki (podniesienie na uda), czyli inne ćwiczenie. Strona EliteFTS „keg loading rotational” w wyszukiwarce pokazała tylko treść dla członków. Ponowne wyszukiwanie (kontynuacja 2) dało głównie rzut beczką (inne ćwiczenie: BarBend „keg toss”, Fitness Volt) i strony siłowni.
- **Circus Bell**: jedno źródło szczebla 4 — `barbend-circus` (sekcje: Setup, Getting It to the Shoulder, The Dip, The Press, Lockout, Lowering the Bell, Common Mistakes). Drugiego nie znalazłem: EliteFTS (dwa artykuły o technice dzwonu) — szczebel 5; Lift Big Eat Big „Mastering The Circus Dumbbell” — szczebel 5; Grinder/Gegns Gym — szczebel 5; producenci (Strength Shop, Rogue, Factory Weights) — w wynikach tylko karty produktów. Bodybuilding.com „circus-bell” — nie sprawdzone (wcześniej domena przekierowywała na sklep). Kandydaci na zdania przy drugim źródle (nie wprowadzać): ustawienie dzwonu na barku z łokciem w górę; przy podsiadzie przenieść ciężar na biodro po drugiej stronie; wyciskać prosto w górę, bez odchodzenia dzwonu na bok; błąd: zbyt szybkie wyjście z podsiadu. BarBend podaje też liczby (ciężar startowy, odsetek ciężaru na biodrze) — nie przenosić.
- **Conan's Wheel**: brak źródła szczebla 4 o technice. BarBend ma tylko relacje z zawodów (wyniki), Gymleco — kartę produktu bez techniki, pozostałe trafienia to siłownia (szczebel 5), dzienniki treningowe EliteFTS i bazy ćwiczeń aplikacji (wykluczone). Trafienia z wyszukiwarki opisują różnie, gdzie leży ciężar (w zgięciu łokci albo na przedramionach), więc nawet ustawienie wymaga źródeł.
- **Power Stairs**: brak źródła szczebla 4 o technice. Trafienia: bazy ćwiczeń aplikacji (wykluczone), Fitness Volt (zamienniki; szczebel 5), strona zawodów i relacje BarBend z wynikami (bez techniki), Bodybuilding.com (nie sprawdzone, wcześniej przekierowanie na sklep).
- **Niedostępne / wykluczone**: NSCA Kinetic Select „Strongman Training” — 403; EliteFTS „Technical Breakdown of the Yoke Walk” i „9 log press mistakes” (adres /education/) — 404; strona z „log clean and press 101” przekierowuje do domeny aplikacji treningowej (wykluczona); grindergym.com przekierowuje na gegnsgym.com (inna nazwa, ta sama siłownia — szczebel 5); Mirafit (worek, kłoda) — 403; powerliftingtechnique.com (Jefferson) — 403; Cerberus „/collections/strongman-implements” — 404 (właściwy adres kolekcji: `/collections/strongman-equipment`, przeczytany); strony baz ćwiczeń aplikacji z wyników wyszukiwania — wykluczone.

## 6. Stan

- Zrobione (02.11.2026): część 1 (Tire Flip, Atlas Stones, Yoke Walk, Log Lift); kontynuacja 1: ponowna ocena organizacji (p. 3.1), BarBend ×4 i Bells of Steel (worek), Sandbag Load (częściowe), Keg Load i Jefferson Squat (otwarte), `yoke.brace` w nowym brzmieniu, błąd Atlas Stones (źródła sobie przeczą); kontynuacja 2: Cerberus rozstrzygnięty na szczebel 5 (przeczytany katalog), więc p. 2b wycofany i Log Lift otwarte; Circus Bell (jedno źródło), Conan's Wheel i Power Stairs (brak źródeł); ponowne szukanie drugiego źródła dla Jefferson Squat i Keg Load (bez wyniku).
- Wynik rodziny: gotowe — Yoke Walk; częściowe — Tire Flip, Atlas Stones, Sandbag Load; otwarte — Log Lift, Keg Load, Jefferson Squat, Circus Bell, Conan's Wheel, Power Stairs.
- Zostało (opcjonalnie, niska szansa): drugi producent z tekstem o technice kłody i dzwonu (blog Bells of Steel bezpośrednio, strony pomocy Rogue); decyzja koordynatora o zestawie ogólnym Jefferson Squat (`open` albo samo `sq.back`).
- Pułapki: ExRx 403, Wayback zablokowane; NSCA Kinetic Select 403; Mirafit i powerliftingtechnique.com 403; EliteFTS, Strength Shop, Fitness Volt, Cerberus, siłownie, USAWA, Lift Big Eat Big — szczebel 5 (nie liczą się); Garage Gym Reviews — według koordynatora nie liczyć; strony baz ćwiczeń aplikacji (np. adresy `*.app`, `*.pages.dev`) — wykluczone; Bells of Steel liczy się tylko dla własnego sprzętu (jarzmo, worki); nie przenosić liczb (wymiarów, długości kroku, ciężarów, serii) ani twierdzeń o urazach.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3) oraz rozstrzygnięcia koordynatora 02.11.2026, w tym: **8weeksout — otwarte (nie liczy się do pary źródeł szczebla 4)**. Kryterium karty z decyzji 02.11.2026. Wynik przeliczenia: STAN-g6-przyciaganie.md, „Stan przeliczenia 02.11.2026” (poprawiony o rozstrzygnięcie o 8weeksout).

### Źródła → szczebel

| Źródło | Szczebel | Dowód (strona, autor/data albo powód) |
|---|---|---|
| `barbend-yoke` (BarBend) | **4** | WebFetch 02.11.2026: „Written by Mike Dewar”, CSCS, magister fizjologii wysiłku; „Last updated on November 20th, 2024” |
| `barbend-atlas` (BarBend) | **4** | aktualizacja M. Dewar 26.06.2024, recenzja ekspercka (sekcja 3.2) |
| `barbend-strongman-ex`, `barbend-sandbag` (BarBend) | nie sprawdzane per strona | bez wpływu (Tire Flip i Sandbag Load bez ustawienia przy każdym szczeblu) |
| `bos-yoke`, `bos-sandbag` (Bells of Steel) | 4 | producent jarzma i worków (własny sprzęt), treść firmowana, data 2022 |
| `8wo-atlas`, `8wo-tire-flip` (8weeksout) | **otwarte — nie liczy się** (było 4, ocena badacza) | rozstrzygnięcie koordynatora 02.11.2026: ocena 8weeksout otwarta; do czasu rozstrzygnięcia nie liczy się do pary |
| Cerberus Strength, EliteFTS, Strength Shop, Fitness Volt (strona bez autora), Gegns Gym, USAWA | 5 | bez zmian (sekcja 3.1) |

### Zdania → stan

| Zdanie | Ćwiczenie | Źródła po przeliczeniu | Stan |
|---|---|---|---|
| `yoke.setup`, `yoke.brace`, `yoke.steps`, `yoke.mis.stride` | Yoke Walk | bos-yoke + barbend-yoke | zostają |
| `as.setup`, `as.lap`, `as.extend` | Atlas Stones | tylko barbend-atlas (8weeksout otwarte) | **spadają** |
| `tf.push` | Tire Flip | tylko barbend-strongman-ex | **spada** |
| `sb.lap` | Sandbag Load | barbend-sandbag + bos-sandbag | zostaje jako materiał; karta bez ustawienia → nie w bloku |

### Karty → stan

| Ćwiczenie | Stan | Powód |
|---|---|---|
| Yoke Walk | własna z błędami | ustawienie + ruch + wskazówka + błąd (Bells of Steel + BarBend) |
| Atlas Stones | **otwarta** (STAN przed rozstrzygnięciem: własna bez błędów) | każde zdanie ma tylko BarBend |
| Tire Flip | **otwarta** (było: częściowe) | tylko ruch, a i ten na jednym źródle |
| Sandbag Load | **otwarta** (było: częściowe) | tylko ruch `sb.lap`, bez ustawienia |
| Log Lift, Keg Load, Jefferson Squat, Circus Bell, Conan's Wheel, Power Stairs | otwarte | bez zmian |

Liczby: przed — gotowe 1, częściowe 3, otwarte 6; po — własne z błędami 1, własne bez błędów 0, otwarte 9. Przy przyszłej ocenie 8weeksout = 4 wraca Atlas Stones (własna bez błędów: `as.setup`, `as.lap`, `as.extend` z bloku 2a).

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

```json
{
  "Yoke Walk": {
    "setup": [
      {"c": "yoke.setup", "s": [["bos-yoke", "setup („Position the crossbeam on your back.”)"], ["barbend-yoke", "Step 1 Get Under the Yoke (barki czworoboczne dociśnięte do belki, góra pleców jako półka)"]]}
    ],
    "move": [
      {"c": "yoke.brace", "s": [["bos-yoke", "Bracing (napięcie brzucha przed startem)"], ["barbend-yoke", "Step 1 Form Tip, Step 2 Stand Up (napnij brzuch, potem wstań)"]]}
    ],
    "tips": [
      {"c": "yoke.steps", "s": [["bos-yoke", "Step Length (krótkie kroki)"], ["barbend-yoke", "Step 3 Take Small, Quick Steps"]]}
    ],
    "mistakes": [
      {"c": "yoke.mis.stride", "s": [["bos-yoke", "Common Mistakes (zbyt duże kroki)"], ["barbend-yoke", "Step 3 Form Tip (długie kroki psują stabilność tułowia i bioder)"]]}
    ]
  }
}
```

Nowe zdania w bloku: `yoke.setup`, `yoke.brace`, `yoke.steps`, `yoke.mis.stride` (4). Organizacji 8weeksout nie dodawać do `orgs` do czasu rozstrzygnięcia.
