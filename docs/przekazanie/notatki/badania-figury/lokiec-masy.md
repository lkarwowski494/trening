# Bramki jakości póz grafik: odwiedzenie łokcia i masy segmentów (badacz, 26.10.2026)

Dotyczy: `scripts/figures/v2-jakosc.mjs` (gałąź origin/jakosc-r2, wersja 1.1). Skryptu nie widziałem: nie ma go w tym drzewie roboczym. Wnioski odnoszę do liczb podanych w zleceniu.
Bramka dotyczy rysunku, a nie tekstu w aplikacji. Decyzja „przy sporze bez liczby w aplikacji” obowiązuje dalej: żadna z poniższych liczb nie trafia do tekstów.

## 1. Odwiedzenie łokcia (pompki, wiosłowanie odwrócone)

### Co mówią przeczytane źródła

| # | Źródło (szczebel) | Miejsce | Co mówi | Liczba |
|---|---|---|---|---|
| S1 | NASM, Push Up (4) — https://www.nasm.org/resource-center/exercise-library/push-up | Step 3: Execute/Drive; Common Mistakes | „Keep your elbows at approximately 45 degrees from your body.”; błąd: „Elbows flaring too wide…” | ok. 45° (pompka standardowa) |
| S2 | ACE, Push Up #41 (4) — https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/ | Step 3; Step 5 | „Allow your elbows to flare outwards during the lowering phase.”; wariant: „keep your elbows close to your sides during the downward phase” | brak |
| S3 | Suprak i in. 2013, J Athl Train 48(5):826–835, PMC3867095 (3; n=16) — https://pmc.ncbi.nlm.nih.gov/articles/PMC3867095/ | Results: Shoulder Elevation; Methods | Ustawienie dowolne: uniesienie ramienia średnio 53,6° ± 1,6°; ramię przy boku: 35,5° ± 4,9°; cel „90°”: osiągnięte 64,8° ± 0,7°. Kąt 3D ramienia względem klatki (Euler: płaszczyzna uniesienia, potem uniesienie), średnia z fazy koncentrycznej (łokieć 105°→35°), a nie wartość w dolnym punkcie. Dłonie „slightly wider than shoulder width”. | 54° / 36° / 65° (inna miara) |
| S4 | Contreras i in. 2012, Strength Cond J 34(5):41–46 (3, przegląd narracyjny) — https://bretcontreras.com/wp-content/uploads/The-Biomechanics-of-the-Push-up-Implications-for-Resistance-Training-Programs.pdf | s. 42–43 | Szerokości: „wide base (150% shoulder width), normal base (shoulder width), and narrow base (50% shoulder width)”. „Contrary to popular belief, when the hands are placed in a very narrow position, it tends to encourage flaring of the elbows, orienting movement into the transverse plane.” | brak |
| S5 | Intziegianni i in. 2026, Muscles, PMC13029269 (3) — https://pmc.ncbi.nlm.nih.gov/articles/PMC13029269/ | 2.3; 4. Discussion | Pompka standardowa: nadgarstki w linii łokci. Diamentowa: łokcie „close to their torso” (polecenie w protokole). Szeroka: „the elbow flares outwards, placing the humerus in greater abduction” (opis jakościowy). Kątów nie mierzono. | brak |
| S6 | Marcolin i in. 2015, J Athl Train, PMC4732391 (3) — https://pmc.ncbi.nlm.nih.gov/articles/PMC4732391/ | Testing Procedures | Standardowa: dłonie na szerokość akromionów; szeroka: rozstaw 2×; wąska: dłonie razem pod mostkiem. Kątów ramienia brak. | brak |
| S7 | ACE, TRX Back Row #84 (4) — https://www.acefitness.org/resources/everyone/exercise-library/84/trx-reg-back-row/ | Step 3; Step 5 | „Your elbows should move towards your sides and remain close to your body.”; wariant: „raising the elbows to shoulder height” | brak (wariant ≈ 90°) |

Szukałem pomiaru kąta ramię–tułów w dolnym punkcie dla każdego rozstawu dłoni (PubMed/Europe PMC, wyszukiwarka). Nie znalazłem przeczytanego źródła z liczbami. Praca Gait & Posture 2020 o rozstawie 50/100 cm (S0966636220303313) jest płatna (403) i jej nie przeczytałem.

### Wnioski

- **Pompka standardowa: spór na szczeblu 4.** NASM podaje ok. 45°, ACE pozwala na „flare” albo trzyma łokcie przy bokach. Wspólne jest to, że łokieć nie wychodzi prosto w bok (90°). Pomiar 3D (S3) daje przy dowolnym ustawieniu średnio ok. 54°, ale to inna miara (uniesienie względem klatki, uśredniane w fazie) i jedno badanie. Status: **konwencja**, przedział zgodny ze źródłami to ok. 0–45°. Próg ≤ 30° jest ostrzejszy niż NASM i nie ma oparcia.
- **Wąska i diamentowa: brak liczb i sprzeczność kierunkowa.** S5 każe trzymać łokcie przy tułowiu, a S4 (przegląd) zauważa, że bardzo wąski rozstaw sprzyja rozchodzeniu się łokci. Progi ≤ 22° / ≤ 25° to **konwencja bez źródła**. Twierdzenie, że diamentowa ma mniejsze odwiedzenie niż standardowa, jest **[OTWARTE]**.
- **Szeroka: kierunek potwierdzony, liczby brak.** Większe odwiedzenie niż w standardowej opisują S4 i S5 (jakościowo, szczebel 3). Próg ≤ 70° to **konwencja**. Niczemu nie przeczy (próba 90° w S3 dała średnio 65°).
- **Wiosłowanie odwrócone: niespójność wewnętrzna.** Tekst w aplikacji (`inv.pull`: „łokcie blisko tułowia”, ExRx + ACE) i S7 mówią „blisko tułowia”. Próg ≤ 60° dopuszcza rysunek, który przeczy własnej wskazówce. Wariant z łokciami na wysokości barków (S7, Step 5) to inne ćwiczenie i aplikacja go nie uczy.

### Rzut z przodu a kąt 3D (rachunek)

- Wzór arcsin(boczne wysunięcie łokcia / długość ramienia) daje kąt 3D między ramieniem a płaszczyzną strzałkową ciała. Nie jest to kąt w rzucie, ale tylko pod warunkiem, że mianownikiem jest **prawdziwa długość 3D** ramienia. Jeśli skrypt dzieli przez długość ramienia **widoczną w rzucie**, kąt wychodzi zawyżony i trzeba to poprawić.
- Trenerskie „45° od tułowia” to kąt ramię–tułów widziany z góry: φ = atan(boczne / wzdłuż tułowia). Oba kąty są równe tylko wtedy, gdy ramię leży równolegle do podłogi. Gdy łokieć jest wyżej niż bark (typowo w dolnym punkcie), arcsin daje **mniej** niż φ. Bramka z przodu jest więc łagodniejsza od kąta trenerskiego. Kierunek wynika z rachunku, wielkość zależy od pozy.
- Kąty uniesienia z S3 (względem osi klatki) nie są żadnym z tych dwóch kątów. Nie przenosić ich bezpośrednio na progi.
- Uwaga: z S5 (nadgarstek pod łokciem) i S4/S6 (szerokości) wynika, że boczne wysunięcie łokcia ≈ (rozstaw dłoni − rozstaw stawów barkowych) / 2. Kąt rysunku można więc **wyliczyć z geometrii postaci**, zamiast ustalać go na sztywno. Pionowe przedramię opiera się na jednym źródle (S5).

### Rekomendowane progi (wszystkie oznaczone „konwencja”, nie „ustalone”)

| Wariant | Teraz | Rekomendacja | Uzasadnienie |
|---|---|---|---|
| Pompka standardowa | ≤ 30° | **≤ 45°** (konwencja, spór S1/S2) | górna granica części wspólnej; 30° wyklucza rysunek zgodny z NASM |
| Wąska | ≤ 22° | **≤ 45°**, jak standardowa (konwencja) | brak liczb, sprzeczny kierunek (S4 vs S5); ostrzejszego progu nie da się uczciwie uzasadnić |
| Diamentowa | ≤ 25° | **≤ 45°**, jak standardowa (konwencja) | jw. |
| Szeroka | ≤ 70° | **≤ 70°** (konwencja) oraz zalecane **> progu łokcia wyliczonego dla standardowej** albo kąt z geometrii rozstawu 150–200% | kierunek „szerzej = większe odwiedzenie” potwierdzają S4 i S5; liczby brak |
| Wiosłowanie odwrócone | ≤ 60° | **≤ 45°** (konwencja), spójnie z wskazówką „łokcie blisko tułowia” | tekst aplikacji + S7 |

Lepsza opcja (do decyzji koordynatora/właściciela): zamiast stałych kątów sprawdzać rysunek pod kątem zgodności z własną geometrią: łokieć nad nadgarstkiem (S5), rozstaw dłoni 100 / 150 / 50% według S4. Wtedy kąt wynika z rachunku, a nie z pamięci.

## 2. Masy segmentów i położenie środka masy

Odczytane z reprodukcji tabel (oryginałów Dempster 1955 / Winter Tab. 4.1 / de Leva 1996 nie przeczytałem: DTIC i Elsevier 403, kopia uczelniana 503).

**A. Dempster w opracowaniu Wintera.** Plik danych BMClab (Duarte, UFABC), który cytuje Winter 2009: https://raw.githubusercontent.com/BMClab/BMC/master/data/BSP_DempsterWinter.txt (wiersze tabeli). Masa = ułamek masy ciała, ŚM = ułamek długości od końca bliższego.

| Segment (końce) | Masa | ŚM od bliższego |
|---|---|---|
| dłoń (nadgarstek–MCP3) | 0,006 | 0,506 |
| przedramię (łokieć–wyrostek rylcowaty) | 0,016 | 0,430 |
| ramię (bark–łokieć) | 0,028 | 0,436 |
| przedramię+dłoń | 0,022 | 0,682 |
| cała kończyna górna | 0,050 | 0,530 |
| stopa | 0,0145 | 0,50 |
| podudzie (kolano–kostka) | 0,0465 | 0,433 |
| udo (krętarz–kolano) | 0,100 | 0,433 |
| głowa+szyja (C7/T1–ucho) | 0,081 | 1,000 |
| tułów (krętarz–bark) | 0,497 | 0,50 |
| HAT (głowa, ramiona, tułów) | 0,678 | 0,626 |
| cała kończyna dolna | 0,161 | 0,447 |

Suma: 0,081 + 0,497 + 2·(0,050 + 0,161) = 1,000.

**B. de Leva 1996 (J Biomech 29(9):1223–1230)** w reprodukcji: Adolphe i in. 2017, Mechanics and Mechanical Engineering 21(3), **Table 1, s. 488**: https://kdm.p.lodz.pl/sites/k13/files/manual/articles/2017/3/21_3_4.pdf. Masa w % (K / M), ŚM w % długości od końca bliższego (K / M).

| Segment (końce) | Masa K / M | ŚM K / M |
|---|---|---|
| głowa (VERT–CERV) | 6,68 / 6,94 | wg tabeli 58,94 / 59,76 (odczyt niepewny) |
| tułów (CERV–MIDH) | 42,57 / 43,46 | 41,51 / 44,86 |
| ramię (SJC–EJC) | 2,55 / 2,71 | 57,54 / 57,72 |
| przedramię (EJC–WJC) | 1,38 / 1,62 | 45,59 / 45,74 |
| dłoń (WJC–MET3) | 0,56 / 0,61 | 74,74 / 79,00 |
| udo (HJC–KJC) | 14,78 / 14,16 | 36,12 / 40,95 |
| podudzie (KJC–LMAL) | 4,81 / 4,33 | 44,16 / 44,59 |
| stopa (HEEL–TTIP) | 1,29 / 1,37 | 40,14 / 44,15 |

Suma M: 6,94 + 43,46 + 2·(2,71 + 1,62 + 0,61 + 14,16 + 4,33 + 1,37) = 100,0.

**Status.** Dwa niezależne zbiory danych (zwłoki, Dempster; skanowanie promieniowaniem gamma, Zatsiorsky/de Leva) zgadzają się co do mas kończyny górnej i podudzia/stopy z dokładnością ok. 0,1–0,3 punktu procentowego. Dla tych segmentów wartości są **ustalone**. Udo, tułów i głowa różnią się, bo **inaczej zdefiniowano końce segmentów** (krętarz vs środek stawu biodrowego, inny podział tułowia). To nie jest sprzeczność. Różni się też ŚM ramienia (0,436 vs 0,577 od barku), zależnie od definicji osi i populacji. Wniosek: **jeden zestaw w całości, bez mieszania mas z jednej tabeli i położeń ŚM z drugiej**. Dla bramki rysunku obie tabele są wystarczające. Zestaw A ma jedną wartość na obie płcie, co jest prostsze.

Do sprawdzenia przez programistę: czy liczby w `v2-jakosc.mjs` odpowiadają w całości jednemu z zestawów A/B (skryptu nie widziałem).

## Otwarte pytania
- [OTWARTE] Zmierzony kąt ramię–tułów w dolnym punkcie pompki przy rozstawie 50/100/150% (np. Gait & Posture 2020, S0966636220303313 — niedostępne).
- [OTWARTE] Czy w pompce diamentowej łokcie są bliżej tułowia niż w standardowej (S5 vs S4).
- [OTWARTE] Oryginały: Dempster 1955 (WADC TR 55-159), Winter Tab. 4.1, de Leva 1996 Tab. 4 — warto potwierdzić u źródła przy okazji. Reprodukcje są spójne między sobą.
