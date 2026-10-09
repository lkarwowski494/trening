# 29. Jeden trening w tygodniu — co mówią źródła (09.10.2026)

Zlecenie (decyzja właściciela 09.10.2026 wieczór, docs/18): generator planu ma obsługiwać 1–6 dni treningowych dla każdego celu; przy 1 dniu
(zwłaszcza masa) właściciel chciał ostrzeżenia, że to „mało skuteczne i w praktyce raczej utrzymanie” — **treść do potwierdzenia źródłami**
(właściciel nie rozstrzyga kwestii merytorycznych). Pytanie badawcze: czy aplikacja może twierdzić, że 1 trening siłowy w tygodniu (sesja
45/60/90 min) to dla masy albo siły „raczej utrzymanie” albo „wyraźnie wolniejsze postępy” — i z jakimi zastrzeżeniami.

Metoda jak w docs/research/22: teksty pobrane samodzielnie z Europe PMC (REST API: streszczenia i pełne teksty XML), nie fragmenty z wyszukiwarki.
**PT** = przeczytany pełny tekst, **A** = przeczytane streszczenie. Szczebel z CLAUDE.md: S2 przeglądy systematyczne / metaanalizy / stanowiska,
S3 pojedyncze badania i przeglądy narracyjne uznanych autorów. Cytaty — najwyżej 1–2 zdania (tests/research-quotes.test.ts).

## 1. Źródła i co faktycznie mówią

| # | Źródło | Szczebel | Co mówi o 1 dniu w tygodniu |
|---|---|---|---|
| a | ACSM 2026 (Currier i in., MSSE 58(4), PMC12965823) | S2, PT | Masa: przy równej objętości tygodniowej 1 dzień ≈ ponad 5 dni (cytat 3a). Siła: częstotliwość pomaga, ale przy równej objętości wpływ maleje (3b); zalecenie dla siły ≥ 2 sesje/tydz. (docs/22, 7b). „Minimalne dawki” dają istotne przyrosty (3c). |
| b | Schoenfeld, Grgic, Krieger 2019, J Sports Sci (PMID 30558493, 10.1080/02640414.2018.1555906) | S2, A | Masa: przy równej objętości brak różnicy (także u wytrenowanych); bez wyrównania objętości przewaga częstszego treningu, ale różnica między 1 a 3+ dniami „modest” (3d). |
| c | Schoenfeld, Ogborn, Krieger 2016, Sports Med (PMID 27102172) | S2, A | Wcześniej: 2×/tydz. > 1× (3e) — **zastąpione** przez (b) przy większej liczbie badań (ten sam zespół; ACSM 2026 cytuje oba). |
| d | Grgic i in. 2018, Sports Med (PMID 29470825, 10.1007/s40279-018-0872-x) | S2, A | Siła: efekt rośnie z częstotliwością — ES 0,74 / 0,82 / 0,93 / 1,08 dla 1 / 2 / 3 / 4+ razy (3f); przy równej objętości bez istotnej różnicy; efekt „primarily driven by training volume” (3g); głównie osoby niewytrenowane. |
| e | Ralston i in. 2018, Sports Med Open (PMC6081873) | S2, A | Siła: przy równej objętości 1 dzień ≈ ≥ 3 dni (3h); ogółem tylko trend na korzyść częstszego; górna część ciała — przewaga ≥ 3 dni nad 1. |
| f | Pelland i in. 2026, Sports Med (PMID 41343037) | S2, A | Masa: wpływ częstotliwości zgodny z pomijalnym; siła rośnie z częstotliwością, z malejącym zyskiem (docs/22, 7c). |
| g | Iversen, Norum, Schoenfeld, Fimland 2021, Sports Med (PMC8449772) | S3 (przegląd narracyjny), PT | Objętość tygodniowa ważniejsza niż częstotliwość; 1 dzień daje podobne efekty przy tej samej objętości (3i), ale w praktyce więcej dni = więcej serii = zwykle więcej siły (3j). Utrzymanie: niewielkie dawki (np. 1 krótka sesja/tydz.) utrzymują siłę i masę u młodszych przez okres badań (do 32 tyg.) (3k). |
| h | Spiering, Mujika, Sharp, Foulis 2021, JSCR (PMID 33629972) | S3 (przegląd narracyjny), A | **Utrzymanie po okresie treningu**: siła i masa (u młodszych) utrzymane do 32 tyg. przy 1 sesji/tydz. i 1 serii na ćwiczenie, gdy ciężar zachowany; u starszych masa może wymagać 2 sesji (3l). |
| i | Bickel, Cross, Bamman 2011, MSSE (PMID 21131862) | S3 (RCT), A | Po 16 tyg. treningu 3×/tydz.: 32 tyg. 1×/tydz. (1/3 albo 1/9 dawki) — u młodych utrzymany przerost, a przy 1/3 dawki **dodatkowy** przerost włókien (3m); u starszych masa nie utrzymana. |

Niezależność: (b), (c), (d) — jeden zespół (Schoenfeld/Grgic/Krieger); (g) współautor Schoenfeld. Niezależne grupy: ACSM (Currier/Phillips),
Ralston (Szkocja/USA), Pelland/Zourdos, Spiering (USA, wojsko), Bickel/Bamman (UAB). Wnioski o utrzymaniu w (g) i (h) opierają się głównie na
tych samych badaniach pierwotnych (Bickel 2011; Graves 1988 — czytany tylko jako opis w (g)), więc dla „utrzymania” niezależnych badań
pierwotnych jest mało.

## 2. Wnioski

| Twierdzenie | Status | Podstawa |
|---|---|---|
| „1 trening w tygodniu to w praktyce raczej utrzymanie” (masa, siła) | **NIE potwierdzone — nie wchodzi do aplikacji** | 1×/tydz. daje przyrosty: siła ES 0,74 (d), masa przy równej objętości jak przy częstszym (a, b, f); w RCT (i) 1×/tydz. u młodych dał nawet dodatkowy przerost. Utrzymanie (g, h, i) dotyczy osób **po** okresie treningu i mówi, że 1 sesja **wystarcza co najmniej** do utrzymania — nie, że daje tylko utrzymanie. |
| „Wyraźnie wolniejsze postępy” | **NIE potwierdzone** w słowie „wyraźnie” | Różnica 1 vs 3+ dni bez wyrównania objętości „modest” (b); przy sile ogółem tylko trend (e) albo umiarkowana różnica ES (d). |
| Przy 1 dniu postępy zwykle trochę mniejsze niż przy częstszym treningu | **potwierdzone kierunkowo** (część wspólna) | (b) bez wyrównania objętości przewaga częstszego, „modest”; (d) ES rośnie z częstotliwością; (e) trend; (f) siła rośnie z częstotliwością; (a) siła ≥ 2 sesje. „Trochę” = część wspólna (b) „modest”, (e) brak istotnej różnicy ogółem. |
| Głównie dlatego, że w jednej sesji mieści się mniej serii | **potwierdzone** (2 zespoły + przegląd) | (d) „primarily driven by training volume”; (g) 3j; (b) przy równej objętości brak różnicy. W generatorze dodatkowo: budżet serii z czasu sesji (uproszczenie z docs/22) — 1 sesja = budżet 1 sesji na tydzień. |
| Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika | **potwierdzone** | (a) 3a — 1 vs > 5 dni; (b) 3d; (f); (g) 3i. |
| … a w sile maleje | **potwierdzone kierunkowo** (rozbieżność, część wspólna) | (a) 3b „diminished”; (d) i (e) — przy równej objętości bez istotnej różnicy; (f) — siła rośnie z częstotliwością. Część wspólna: „maleje” (nie „znika”). |
| Gdy już trenujesz, 1 sesja/tydz. z utrzymanym ciężarem zwykle wystarcza do utrzymania siły i masy przez kilka miesięcy | potwierdzone kierunkowo, **ograniczona niezależność** (2 przeglądy narracyjne na tych samych RCT; u starszych masa — nie) | (g), (h), (i). **Nie wchodzi do aplikacji**: generator planuje trening na postęp, a nie okres utrzymania; zdanie wymagałoby rozróżnienia wieku i stażu, którego aplikacja nie zna. Do backlogu jako ewentualna treść na przerwę w treningu. |
| Początkujący vs zaawansowani | **otwarte** | (d) i (e) głównie osoby niewytrenowane; (b) brak różnic także u wytrenowanych (podgrupa). Brak przeczytanego źródła, które pozwala dla 1 dnia rozróżnić tekst wg stażu — aplikacja nie rozróżnia. |
| Ile serii na partię mieści się w jednej sesji, zanim przestają działać („limit serii na sesję”) | **otwarte** — nie przeczytano przeglądu; aplikacja nic o tym nie twierdzi | — |

### Tekst ostrzeżenia w aplikacji (kind „oneday”) — uproszczenie, nazwane
„Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze niż częstszy trening — głównie dlatego, że w jednej sesji mieści się mniej
serii. Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika, a w sile maleje.”

- Uproszczenie: „zwykle trochę mniejsze” łączy wyniki dla masy (b) i siły (d, e) bez liczb; „głównie” = (d) „primarily”. Bez słowa „utrzymanie”.
- Kiedy: gdy w planie jest dokładnie 1 dzień z treningiem siłowym — przy każdym celu (tekst mówi o masie i sile ogólnie, nie o celu) i w „Planie
  z moich szablonów” (wspólne ostrzeżenia `loadWarnings`). Obok zostają istniejące: „Rzadziej niż 2 dni w tygodniu” (R1: WHO 2020, ACSM 2026 — siła)
  i „Poniżej 10 serii tygodniowo” (masa, redukcja; R2) — przy 1 dniu pojawiają się zwykle obie (budżet jednej sesji < 10 serii na każdą partię).

## 3. Redukcja przy 1–2 dniach

Dotąd redukcja = n − 1 sesji siłowych + 1 cardio (od 3 dni). Źródła z docs/22: trening siłowy chroni masę beztłuszczową w deficycie (Sardeli 2018,
Donnelly 2009, Helms 2015); cardio — WHO 2020: co najmniej 150–300 min umiarkowanego wysiłku tygodniowo, liczy się każdy odcinek (7f); R8 — cardio
w osobne dni (Schumann 2022, Petré 2021); R1 — każda główna partia ≥ 2 dni (WHO 7a).

| Opcja | Opis | Kompromisy | Nowe twierdzenia |
|---|---|---|---|
| **A (wdrożona)** | 1–2 dni: tylko trening siłowy; cardio poza planem — tekst z istniejącym zaleceniem WHO (WHO_MODERATE / WHO_VIGOROUS). Od 3 dni bez zmian (n − 1 siłowych + 1 cardio). Próg = MIN_DAYS + CARDIO_SESSIONS (z istniejących stałych). | + przy 2 dniach plan spełnia R1 (każda partia 2 dni), cardio nie zabiera jedynego/drugiego dnia siłowego; + zgodne z R8 (cardio osobno); − cardio nie ma dnia w kalendarzu (tylko tekst). | brak — tylko istniejące (ochrona mięśni, WHO). Próg „od 3 dni” = konwencja wynikająca z R1. |
| B | 2 dni = 1 siłowy + 1 cardio; 1 dzień = siłowy | + jak dotąd (n − 1 + 1); − przy 2 dniach każda partia 1×/tydz. — plan generatora łamie własną regułę R1 (ostrzeżenie „rzadziej” przy każdej partii); − redukcja bez potwierdzonej objętości (docs/22 [OTWARTE]) dostaje połowę mniej treningu siłowego. | trzeba by uzasadnić, że cardio ważniejsze niż 2. dzień siłowy — brak przeczytanego źródła. |
| C | cardio na końcu sesji siłowej | + cardio w planie przy każdej liczbie dni; − sprzeczne z R8 (osobne sesje; Petré 2021 — osłabienie siły nóg w tej samej sesji u wytrenowanych); − dłuższa sesja niż wybrany czas. | wymaga nowej reguły o kolejności i długości — brak źródeł. |

Rekomendacja i wdrożenie: **A** — najmniej nowych niepotwierdzonych twierdzeń, plan 2-dniowy spełnia R1.

## 4. Jedna sesja FBW (1 dzień) — skład

Istniejące FBW A nie ma żadnego ćwiczenia z dwugłowymi uda jako partią główną ani pomocniczą (zawias jest w FBW B), więc przy 1 dniu brakowałoby
partii. Dla 1 dnia osobna sesja „FBW” (klucz `fbw`): przysiad, wyciskanie poziome, wiosłowanie, martwy ciąg, wyciskanie nad głowę, przyciąganie
pionowe, potem jednostawowe (biceps, triceps, barki, klatka, dwugłowe, łydki) i core — kolejność = priorytet przy krótszej sesji (R7). Pierwsze trzy
= minimum z (g): „one leg pressing exercise …, one upper-body pulling exercise … and one upper-body pushing exercise” (jedno źródło — konwencja).
Budżet czasu bez zmian (`setsBudget`): przy 45 min (3–4 ćwiczenia) część partii pracuje tylko pomocniczo albo wcale — pokazują to istniejące
ostrzeżenia („Brak ćwiczeń na…”, „Rzadziej niż…”, „Poniżej…”), nie są ukrywane.

## 5. Cytaty (1–2 zdania)
- **3a ACSM 2026**, sekcja Hypertrophy: „RT did not influence hypertrophy performed with low (1 d/wk) versus high (>5 d/wk) frequency when total volume was equated”.
- **3b ACSM 2026**, Discussion: „RT frequency was found to impact strength; however, there was insufficient evidence to conclude a dose-response relationship, and the impact is diminished when volume is equated”.
- **3c ACSM 2026**: „Research on RTx reveals that “minimal doses” of RT are able to bring about substantial strength, hypertrophy, and physical functional gains”.
- **3d Schoenfeld 2019**, streszczenie: „Meta-regression analysis of non-volume-equated studies showed a significant effect favoring higher frequencies, although the overall difference in magnitude of effect between frequencies of 1 and 3+ days per week was modest.”
- **3e Schoenfeld 2016**, streszczenie: „frequencies of training twice a week promote superior hypertrophic outcomes to once a week”.
- **3f Grgic 2018**, streszczenie: „Effect sizes increased in magnitude from 0.74, 0.82, 0.93, and 1.08 for training 1, 2, 3, and 4+ times per week, respectively.”
- **3g Grgic 2018**: „these effects seem to be primarily driven by training volume because when the volume is equated, there was no significant effect of RT frequency on muscular strength gains”.
- **3h Ralston 2018**, streszczenie: „Volume-equated pre- to post-intervention strength gain was similar when LF was compared to HF”.
- **3i Iversen 2021**, „Training Frequency and Volume”: „training a muscle 1 day per week appears to induce similar strength gains as training ≥ 3 times per week if the total training volume is the same”.
- **3j Iversen 2021**: „in real-life situations, a higher training frequency allows for a higher training volume and therefore often results in greater strength gains”.
- **3k Iversen 2021**, „Maintenance”: „younger adults can probably maintain muscle mass and strength by training with as little as one brief session per week, while older adults probably need somewhat more weekly volume”.
- **3l Spiering 2021**, streszczenie: „Strength and muscle size (at least in younger populations) can be maintained for up to 32 weeks with as little as 1 session of strength training per week and 1 set per exercise, as long as exercise intensity (relative load) is maintained”.
- **3m Bickel 2011**, streszczenie: „Both maintenance prescriptions preserved phase 1 muscle hypertrophy in the young but not the old. In fact, the one-third maintenance dose led to additional myofiber hypertrophy in the young.”
- **3n Iversen 2021**, streszczenie: „perform a minimum of one leg pressing exercise (e.g. squats), one upper-body pulling exercise (e.g. pull-up) and one upper-body pushing exercise (e.g. bench press)”.

## 6. Nie przeczytane / otwarte
- Graves i in. 1988 (utrzymanie siły prostowników kolana przy 1×/tydz.) — tylko opis w (g).
- Pełne teksty (b), (d), (e), (f), (h) — tylko streszczenia; liczby szczegółowe tylko z (a), (g) (PT) i streszczeń (d).
- Różnice wg stażu dla 1 dnia; limit serii na partię w jednej sesji — otwarte (sekcja 2).
