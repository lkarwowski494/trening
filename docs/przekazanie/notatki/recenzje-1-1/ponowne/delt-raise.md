# Ponowna recenzja ruchu i karty — delt_raise, 2 ćwiczenia przerysowane (recenzent delt-raise, 27.10.2026)

Gałąź `origin/poprawki-delt-raise` @ bbb5f341 (tests.yml zielony 40494243015). Podgląd `podglady-1-1/poprawki-delt-raise/`:
`PODGLAD-WAZNY.txt` i `katy-stawow.md` są. Podgląd ma 3 klatki na widok (wg `klatki_u` pozy jest ich 9), więc dorenderowałem
13 klatek (u = 0…1 co 1/12, widok z boku i z przodu) przez `keyframeFrame`/`dataShapes` z `lib/figures/v2/poses/delt_raise.json`.
Współrzędne niżej w cm, y = wysokość nad podłogą. Podstawa: `badania/sprzecznosci-tekst-rysunek.md` pkt 1.

**Wynik: 2 ćwiczenia — OK 0, OK z uwagą 2, BŁĄD 0.** Brak blokerów (KRYTYCZNE/WYSOKIE). Wcześniejsze znaleziska B2 (partia-1)
i uwaga D (delt_raise.md) są usunięte.

| ćwiczenie | ruch | treść | werdykt | szczegóły |
|---|---|---|---|---|
| Straight Raises on Incline Bench | zgodny ze źródłem: leżenie przodem, sztanga zwisa, unoszenie do poziomu | zgodna (`front.elbows`, `lat.height`) | **OK z uwagą** | łokieć zgięty o 28–31° przez cały ruch (NISKIE) |
| Front Incline Dumbbell Raise | zgodny: siad plecami do oparcia 60°, hantle od zwisu do nieco ponad barki | zgodna | **OK z uwagą** | z przodu hantle odchodzą na boki w połowie ruchu, a w u = 1 wyglądają jak przy wyciskaniu (NISKIE) |

## Straight Raises on Incline Bench — OK z uwagą

**Ruch (bramka 4)**
- Pozycja: tułów przodem do oparcia (`front` = (−0,7; −0,7), oparcie 45° leży ok. 13 cm przed osią tułowia). Klatka piersiowa leży na oparciu.
  Biodra są na siedzisku, uda poziomo do tyłu (biodro −37°, wyjątek `hipMin −45` z powodem), podudzia w dół, stopy na podłodze.
  Głowa i barki wystają ponad górną krawędź oparcia, więc ręce wiszą swobodnie. Cecha rozpoznawcza jest zachowana.
- **Ryzyko „pochylenie nad oparciem” z boku:** na klatkach 0–1 osoba leży klatką na oparciu, a górna krawędź oparcia wypada
  na górze klatki piersiowej. Uda leżą na siedzisku, nie stoją za ławką. Nie czytam tego jako przewieszenia przez oparcie.
  Ryzyko nie potwierdziło się.
- u = 0: chwyt (−26,3; 25,5) leży pionowo pod barkiem (x barku −26,3). Ramię odchyla się o 14° w stronę nóg, przedramię o 14° ku głowie.
  Reguła badacza (przedramię ≤ 15° od pionu) przechodzi na styk: 14°.
- **Sztanga w u = 0 przy podłodze:** środek sztangi jest na y = 25,5. Talerz kończy się kilka centymetrów nad podłogą
  (na obrazie ok. 3 px przy podłodze, bez przenikania). Pasuje to do źródła („pick the barbell up from the floor”). Sztanga przechodzi
  ok. 6–7 cm przed przednią nogą ławki, a talerz zasłania ją tylko w rzucie z boku. Bez znaleziska.
- u = 1: chwyt y = 87,4, bark y = 87,5, czyli ręce poziomo przed głową. To zgadza się ze źródłem (Motra) i z `lat.height`.
  Łokieć jest w u = 1 o 8 cm niżej niż bark i dłoń (y 79,5), więc mieści się w regule `lokcie_na_wysokosci_barkow_u1` (±12 cm),
  choć ta reguła nie jest przypisana do tego wariantu.
- Zgięcie barku 30,5° → 120,2°: przyrost 90°, reguła `ramie_unosi_sie` (≥ 45°) spełniona. Odwiedzenie ≤ 3°. Widok z przodu: sztanga od kolan do barków, symetrycznie.
- **Uwaga (NISKIE, realny — widać na każdej klatce):** kąt łokcia wynosi 28,1–30,6° przez cały ruch. Na klatkach u = 0,08–0,5
  zgięcie łokcia wyraźnie widać. Źródło mówi „keeping your arms straight / extended”, a nazwa to „Straight Raises”.
  Tabela kątów jest zgodna z obrazem. Kąt mieści się w konwencji rodziny (`lokiec_staly`: ≤ 40°, zmiana ≤ 12°)
  i w tekście „proste lub lekko ugięte”. Mimo to 30° to wyraźne ugięcie, a nie lekkie. Dla porównania prosta noga w tym rigu
  ma ok. 10–18°, a Front Incline ma 14–18°. Propozycja: łokieć ok. 12–18°. Szczelność: próg 40° w `lokiec_staly` jest za luźny
  dla ćwiczeń ze słowem „straight” albo z „arms straight” w źródle. Można dodać próg, np. ≤ 20° dla wariantu
  (to by była **konwencja**). Nie blokuje wydania.
- Wiersze błędów: brak. `mis.jerk` jest w `bledy_bez_animacji` z powodem, więc słusznie się go nie rysuje.

**Treść karty**
- `front.elbows` („Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch.”): stały kąt jest spełniony
  (zmiana 2,5°). Granicę „lekko” omawia uwaga wyżej.
- `lat.height` („Unoś mniej więcej do wysokości barków.”): dłonie dokładnie na wysokości barków w u = 1. Sprzeczność B2 jest usunięta.
- `mis.jerk`: tekst naturalny, ogólny.
- Teksty brzmią naturalnie, nie ma w nich nazw źródeł ani marek. Nie ma twierdzeń liczbowych ani zdrowotnych, więc wpis w rejestrze
  twierdzeń nie jest wymagany. W `rejestr-twierdzen.json` nie ma wpisu dla tych wskazówek, co jest zgodne z regułą
  (brak źródła i brak nazwanej wagi w tekście).
- Mięśnie (`front_delt 1, upper_back 0.5, side_delt 0.25`): kierunkowo pasują do unoszenia przodem w leżeniu przodem.
  Nie sprawdzałem źródeł (poza zakresem).
- Uwaga poza progiem: karta z zestawu ogólnego nie ma zdania o ustawieniu („połóż się przodem na ławce skośnej”).
  Pozycję pokazuje tylko rysunek. To możliwe przy zestawie ogólnym, ale warto rozważyć w backlogu.

## Front Incline Dumbbell Raise — OK z uwagą

**Ruch**
- Pozycja: siad plecami do oparcia 60° (tułów 30° od pionu, `front` (0,9; 0,5)), biodro 51,6°, kolano 81°, stopy płasko na podłodze.
  Głowa leży przy górnej krawędzi oparcia. Zgadza się z opisem źródła (30–60°, głowa na oparciu, nogi na podłodze) i z notatką
  katalogu („Seated back-down”).
- u = 0: ramię 3° od pionu, **przedramię 16° od pionu** (do przodu), łokieć 14°. Hantla wisi przy biodrze, obok siedziska
  (y 34,2 przy siedzisku na 43; 14 cm za miednicą w osi x). Ryzyko „przedramię ~18°” się potwierdza (16° w u = 0, 24° w u = 0,08),
  ale to naturalnie wiszące, lekko ugięte ramię. Mieści się w „lekko ugięte” i nie wygląda na błąd. „Od ud” rysunek pokazuje jako
  zwis obok bioder. Przy oparciu odchylonym o 30° ręce wiszące pionowo wypadają właśnie tam. Bez znaleziska.
- u = 1: chwyt 10 cm nad barkiem, przedramię 16° nad poziomem. Zgadza się ze źródłem („slightly above your shoulders”)
  i z `lat.height` w granicy reguły badacza ±15 cm. Łokieć jest 1 cm nad barkiem.
- Zgięcie barku −26,6° → 62° (względem tułowia; przyrost 89°), więc reguła `ramie_unosi_sie_skos` (≥ 20°) jest spełniona.
  Łokieć 14–18,5°, zmiana 4,5°, więc stały kąt jest zachowany.
- **Uwaga (NISKIE, realny w widoku z przodu):** odwiedzenie rośnie do 11° w połowie ruchu i wraca do 0° w u = 1. Hantle odchodzą
  na boki o ok. 14 cm (z = 25 → 33 → 19 cm), a na klatkach z przodu u = 0,33–0,67 dłonie są wyraźnie szerzej niż barki.
  W u = 1 z przodu hantle są na wysokości uszu, przy głowie (skrót perspektywy), co przypomina start wyciskania nad głowę.
  Widok z boku rozstrzyga ruch, więc to nie jest błąd techniki. Propozycja: stała szerokość dłoni (odwiedzenie ≤ 3°).
  Szczelność: nie ma reguły „tor dłoni w płaszczyźnie strzałkowej” dla unoszenia przodem. Możliwa konwencja: |Δz dłoni| ≤ 8 cm.
- Usunięta uwaga D z `delt_raise.md` (biodro −37°, wyjątek zakresu): pozycja jest teraz siedząca, biodro 51,6°, a wyjątek przeszedł
  do Straight Raises (z powodem).
- Status merytoryczny: badacz oznaczył identyfikację tej odmiany jako jedno źródło szczebla 4 **[OTWARTE]**. Rysunek idzie za opisem
  źródła i notatką katalogu. Test `figury-jakosc` też oznacza „Front Incline [OTWARTE]”. Nie jest to błąd rysunku,
  tylko otwarte drugie źródło do zamknięcia przez badacza.

**Treść karty** — `front.elbows`, `lat.height` i `mis.jerk` zgadzają się z rysunkiem (uzasadnienie wyżej). Teksty są naturalne, bez nazw źródeł.
Nie są potrzebne wpisy w rejestrze twierdzeń. Mięśnie (`front_delt 1, side_delt 0.25, chest 0.25`) kierunkowo pasują.

## Szczelność reguł (podsumowanie)
- `lokcie_na_wysokosci_barkow_u1` nie jest przypisana do obu wariantów (`warianty` w `figury-sens.json`). Wysokość pilnuje
  `DLON_NA_WYSOKOSCI_BARKOW` w `figury-jakosc`. Oba ćwiczenia spełniają też regułę łokcia (−8 cm i +1 cm).
- Propozycje (NISKIE, konwencje): próg łokcia ≤ 20° dla „straight”; tor dłoni bez odchodzenia na boki w unoszeniu przodem.

## Gotowość
Rodzina delt_raise (te 2 ćwiczenia): **może dostać status „zatwierdzona”**. Obie uwagi są NISKIE i idą do backlogu 1.1.
Front Incline zostaje [OTWARTE] tylko w części drugiego źródła identyfikacji (badacz).
Upright Row (S1) w tej rodzinie nie był w zakresie tej recenzji.
