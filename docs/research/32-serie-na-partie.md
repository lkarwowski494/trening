# 32. Czy kreska tygodniowych serii powinna zależeć od wielkości partii? (12.10.2026)

Pytanie właściciela (12.10.2026): czy domyślny („automatyczny”) tygodniowy cel serii na partię powinien być większy dla dużych partii
(uda, plecy, klatka) niż dla małych (biceps, triceps, łydki, barki boczne)?

## Odpowiedź w skrócie

Nie — według przeczytanych źródeł szczebla 2 nie ma podstaw do różnych progów dla dużych i małych partii. Stanowisko ACSM 2026 wprost
zaznacza, że dostępne badania nie porównywały różnych regionów ciała ani partii, a metaanaliza Schoenfeld i in. 2017 nie znalazła różnicy
w zależności dawka–odpowiedź między górą i dołem ciała. Jedyna widoczna w danych „różnica między partiami” (triceps potrzebował > 20 serii
w przeglądzie Baz-Valle 2022) jej autorzy tłumaczą sposobem liczenia — triceps dostaje dużo serii pośrednich z ćwiczeń wielostawowych —
a Pelland i in. (2024/2026) pokazują, że dane najlepiej opisuje liczenie serii pośrednich po 0,5, co aplikacja już robi. Pewność: umiarkowana
co do braku podstaw do różnicowania (dwa niezależne źródła S2 + S3 zgodne kierunkowo), niska co do tego, czy jakaś różnica między partiami
w ogóle istnieje — tego nikt nie zbadał bezpośrednio (**[OTWARTE]**).

## Stan w aplikacji (sprawdzony w kodzie, 12.10.2026)

- `lib/stats.ts`: `WEEKLY_SETS_MARK = 10` — jedna kreska dla wszystkich partii (Postępy, generator, przewodnik).
- `setsByMuscle` liczy serie robocze: partia główna ćwiczenia (`muscles`) = 1, pomocnicza (`secondaryMuscles`) = 0,5 (generator: `SECONDARY_SHARE = 0.5`).
  Poziom 0,25 („stabilizacja”) z `MUSCLE_LOAD` (lib/catalog.generated.ts) służy tylko mapie mięśni (`muscleLoadOf` w lib/seed.ts) — **nie** wchodzi do serii.
- Partie aplikacji są zbiorcze: „plecy” = najszerszy + górna część pleców + prostowniki, „barki” = przedni + boczny + tylny akton (`MUSCLE_REGIONS`).
- Zatem praca pośrednia jest już uwzględniona metodą „fractional” (Pelland, niżej) — to ważne dla odpowiedzi w pkt 3.

## Źródła

Oznaczenia: **PT** = przeczytany pełny tekst, **A** = przeczytane streszczenie. Szczeble jak w CLAUDE.md.

| # | Źródło | Szczebel | Co mówi o różnicach między partiami (cytat ≤ 1 zdanie) | Adres | Miejsce |
|---|---|---|---|---|---|
| 1 | ACSM 2026, Currier i in., MSSE 58(4) (PT) | S2 | „The available evidence did not compare distinct body regions or muscle groups.” Zalecenie objętości jedno: „higher volume (≥10 sets/muscle group/wk)”. | https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/ | Discussion, akapit o ograniczeniach; Results → Hypertrophy → „Improving hypertrophy” |
| 2 | Schoenfeld, Ogborn, Krieger 2017, J Sports Sci 35(11) (PT, kopia autorska) | S2 | „There was no significant interaction between weekly set volume and gender (P = 0.55), body half (P = 0.28) or age (P = 0.66).” | https://doi.org/10.1080/02640414.2016.1210197 (czytane z kopii: paulogentil.com/pdf/…) | Results → „Interactions”, s. 7; Discussion s. 8 (P = 0,30, wbrew Rønnestad 2007) |
| 3 | Pelland, Remmert, Robinson, Hinson, Zourdos — preprint SportRxiv 2024 (PT), wersja opublikowana Sports Med 2026 (A) | S2 | „Fractional counted indirect sets as half a set (indirect × 0.5 + direct)”; metoda „fractional” najlepiej pasowała do danych (Bayes Factor: „strong” wobec „total”, „very strong” wobec „direct”). | https://sportrxiv.org/index.php/server/preprint/view/460 ; https://doi.org/10.1007/s40279-025-02344-w | 2.4 (definicje), 4.4 i rys. 3 (porównanie metod), tab. 1A (bezpośrednie/pośrednie per mięsień) |
| 3a | jw. — moderatory | S2 | Moderatory nachylenia dawka–odpowiedź „not often influenced by other variables”, tylko do stawiania hipotez. | jw. | 5.4, ostatni akapit; 4.6.3 |
| 4 | Baz-Valle i in. 2022, J Hum Kinet 81 (PT) | S2 (mała próba) | Jedyny przegląd z analizą per mięsień: udo i biceps bez efektu > 20 serii, triceps — tak; autorzy: „volume from multi-joint exercises also counted for the triceps brachii training volume”. | https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/ | Results (osobno: quadriceps, biceps, triceps); Conclusions; Discussion (triceps jako synergista) |
| 5 | Rønnestad i in. 2007, JSCR 21(1), RCT, 21 niewytrenowanych mężczyzn, 11 tyg. (A) | S3 | 3 serie > 1 seria dla nóg (siła i przekrój uda), dla góry ciała bez różnicy (mierzony tylko czworoboczny). | PMID 17313291, https://doi.org/10.1519/00124278-200702000-00028 | streszczenie |
| 6 | Mannarino i in. 2021, JSCR 35(10), RCT wewnątrzosobniczy, n = 10 (A) | S3 | „Single-joint BC exercise resulted in higher hypertrophy of elbow flexors (11.06%) than the DR (5.16%).” | PMID 31268995, https://doi.org/10.1519/jsc.0000000000003234 | streszczenie |
| 7 | Gentil i in. 2013, APNM 38(3), RCT, niewytrenowani (A) | S3 | Dodanie uginania ramion do ściągania drążka „resulted in no additional benefits in terms of muscle size or strength gains”. | PMID 23537028, https://doi.org/10.1139/apnm-2012-0176 | streszczenie |
| 8 | Kubo i in. 2019, Eur J Appl Physiol, RCT (A) | S3 | Przysiad: rosną prostowniki kolana, przywodziciele i pośladkowy wielki; „that of rectus femoris and hamstring muscles did not change in either group”. | PMID 31230110, https://doi.org/10.1007/s00421-019-04181-y | streszczenie |
| 9 | Renaissance Periodization — „Training Volume Landmarks” i przewodniki per mięsień (biceps, czworogłowe) | **S5** (praktyka) | Liczby per mięsień to „averages based on our experience working with lots of clients and our own training”; liczą tylko serie bezpośrednie, obniżając je o pracę pośrednią. | https://rpstrength.com/training-volume-landmarks-muscle-growth/ ; https://rpstrength.com/bicep-training-tips-hypertrophy ; https://rpstrength.com/expert-advice/quad-training-tips-hypertrophy | tabela „common values” w każdym przewodniku |

Uwagi do źródeł:
- (1) i (2) to różne zespoły (McMaster/ACSM vs Lehman College); ACSM 2026 jako przegląd przeglądów obejmuje m.in. (2), więc niezależność częściowa.
- (2) w wynikach podaje P = 0,28, w dyskusji P = 0,30 dla tej samej interakcji — rozbieżność w samym artykule, wniosek („brak różnicy”) ten sam.
- (3) to ten sam zespół co przyjęta już w aplikacji reguła 0,5 (docs/research/22, „jedno źródło”). Przeczytano pełny tekst preprintu v1 (wrzesień 2024);
  wersja opublikowana — tylko streszczenie (zgodne z preprintem co do metody „fractional”).
- (4) przedział ufności dla tricepsu w kopii czytanej przez narzędzie stracił znak; Pelland (3) cytuje go jako −0,88 do −0,11 — wniosek „korzyść > 20 serii dla tricepsu” stoi.
- (5) dotyczy osób niewytrenowanych, górę ciała mierzono tylko na mięśniu czworobocznym; wyższy szczebel (2) zbadał tę samą kwestię i różnicy nie znalazł → wygrywa (2).
- (9) to praktyka jednej organizacji. Co ciekawe, w jej tabelach biceps ma **wyższe** liczby (MEV 8–10, MRV 20–26) niż czworogłowe (MEV 4–6, MRV 14–18; jednostki tabeli
  dla ud niepodane wprost) — czyli kierunek odwrotny do intuicji „duża partia = więcej serii”. Nie wchodzi do aplikacji (S5, jedno źródło, metoda liczenia inna niż nasza).
- Nieprzeczytane: książki Helms i in. „The Muscle and Strength Pyramids” i Israetel i in. „Scientific Principles of Hypertrophy Training” (brak dostępu do tekstu),
  podręcznik NSCA, pełny tekst Wernbom 2007 (Sports Med; streszczenie nie porównuje tempa przyrostu udo vs zginacze łokcia), materiały uzupełniające Pelland (OSF)
  z wykresami poszczególnych moderatorów. Prace Barbalho/Gentil z lat 2018–2020 pominięte — część ma „expression of concern” (Sports 2026) albo była kwestionowana
  (Vigotsky i in., wykluczenie w Pelland 2.1).

## Wnioski merytoryczne

1. **Różnicowanie dawki według partii lub wielkości mięśnia (pkt 1 zlecenia).** Żadne przeczytane źródło S2 nie podaje innych progów dla różnych partii.
   ACSM 2026 (1) mówi wprost, że tego nie porównywano; Schoenfeld 2017 (2) sprawdził górę vs dół ciała — bez różnicy. Pelland (3) nie raportuje
   różnic, a moderatory traktuje jako hipotezy (czy wśród nich była partia — **[OTWARTE]**, wykresy tylko na OSF). Jedyny przegląd per mięsień (4) różnicę
   dla tricepsu sam tłumaczy liczeniem serii z ćwiczeń wielostawowych. **Wniosek: brak podstaw do różnych kresek — potwierdzone kierunkowo (S2 ×2, różne zespoły).**
2. **Badania S3 i książki (pkt 2).** Jedno RCT (5) sugeruje silniejszą odpowiedź nóg na więcej serii u niewytrenowanych, ale wyższy szczebel (2) tego nie potwierdził.
   Liczby per partia w praktyce trenerskiej (9) to doświadczenie, nie dane (S5), i liczą tylko serie bezpośrednie. Książek Helmsa i Israetela nie przeczytano — **[OTWARTE]**.
3. **Wielkość mięśnia czy praca pośrednia (pkt 3).** Przeczytane źródła wskazują na pracę pośrednią, nie na wielkość: (4) tłumaczy wynik tricepsu udziałem
   w wyciskaniach; (3) pokazuje, że seria pośrednia daje ok. połowę bodźca („close to half the effect”, 5.1), co zgadza się z RCT (6): wiosłowanie dało
   bicepsowi ok. połowę przyrostu z uginania (5,16% vs 11,06%). Gentil 2013 (7) — u niewytrenowanych dodanie uginania nic nie dało, więc praca pośrednia bywa
   wystarczająca; (6) i (7) różnią się co do wielkości efektu, część wspólna: **seria pośrednia liczy się, ale zwykle mniej niż bezpośrednia**.
   Kubo 2019 (8) pokazuje, że udział zależy od mechaniki ćwiczenia (przysiad nie rozwija dwugłowych uda ani prostego uda), nie od rozmiaru partii — to sprawa
   przypisania partii pomocniczych do ćwiczeń (docs/research/24), nie progu.
4. **Wpływ na aplikację.** Ponieważ aplikacja liczy już partie pomocnicze po 0,5, „automatyczna” praca pośrednia, którą małe partie (biceps, triceps,
   przednie barki) dostają z ćwiczeń wielostawowych, jest wliczona do kreski 10 — niezależnie od tego, czy użytkownik ma osobne ćwiczenia na te partie.
   Podnoszenie progu dla dużych partii albo obniżanie dla małych nie ma oparcia w żadnym przeczytanym źródle S1–S3.

## Opcje dla aplikacji

| Opcja | Opis | Za | Przeciw |
|---|---|---|---|
| **A (rekomendowana)** | Zostaje jednolite 10 serii na partię, serie pomocnicze po 0,5 (bez zmian w kodzie). Ewentualnie jedno zdanie wyjaśnienia przy kresce w Postępach: „próg ten sam dla każdej partii; serie pomocnicze z ćwiczeń wielostawowych liczą się po 0,5” (decyzja produktowa właściciela). | Zgodne z S2 (ACSM 2026, Schoenfeld 2017, Pelland); zero pracy w kodzie i testach; nie wprowadza liczb bez źródła. | Nie odpowiada intuicji „duże partie potrzebują więcej” — trzeba to wyjaśnić tekstem, jeśli użytkownicy pytają. |
| B | Różne progi per partia (np. wyższy dla ud, pleców, klatki; niższy dla ramion, łydek). | Zgodne z intuicją. | **Brak źródła S1–S3** — każda liczba byłaby zgadywaniem (zakazane przez CLAUDE.md); jedyna praktyka (S5) idzie w odwrotnym kierunku. Niedopuszczalne do aplikacji. |
| C | Jednolite 10, ale dokładniejsze liczenie pracy pośredniej (np. poziom 0,25 z `MUSCLE_LOAD` w seriach albo liczenie per akton zamiast partii zbiorczej). | Bliżej mechaniki ćwiczeń. | Pelland badał tylko 0 / 0,5 / 1 — waga 0,25 nie ma źródła (**[OTWARTE]**); progi źródeł dotyczą „muscle group”, nie aktonów; dużo pracy (testy macierzowe, docs) bez przewagi merytorycznej. |

**Rekomendacja: A.** Rozstrzygnięcie merytoryczne według hierarchii: dwa niezależne źródła S2 (ACSM 2026, Schoenfeld 2017) nie dają podstaw do różnicowania,
a jedyna obserwowana różnica (triceps, Baz-Valle 2022) wynika z liczenia serii pośrednich, które aplikacja już uwzględnia metodą 0,5 (Pelland — jedno źródło, nazwane
uproszczenie, wzmocnione kierunkowo przez RCT Mannarino 2021). Czy dodać zdanie wyjaśnienia (A z dopiskiem) — decyzja produktowa właściciela.

## Otwarte pytania

- **[OTWARTE]** Czy zależność dawka–odpowiedź różni się między konkretnymi mięśniami — brak badań porównujących (ACSM 2026); przy nowym przeglądzie wrócić.
- **[OTWARTE]** Czy Pelland i in. testowali partię / region ciała jako moderator — wyniki moderatorów tylko na OSF (https://osf.io/6z3xu), nieprzeczytane.
- **[OTWARTE]** Waga serii pośredniej inna niż 0,5 (np. 0,25 dla stabilizacji, różna per ćwiczenie) — Pelland 5.1: „future research may wish to investigate factors
  influencing the stimulus from indirect sets”.
- **[OTWARTE]** Zalecenia per partia w książkach Helms i in. oraz Israetel i in. — nieprzeczytane.
- Obserwacja (nie twierdzenie merytoryczne, do oceny przez analityka): partie zbiorcze „barki” i „plecy” mogą osiągnąć kreskę dzięki jednemu aktonowi
  (np. przednie barki z wyciskań po 0,5), gdy inny (barki boczne) nie dostaje serii. Źródła liczą „per muscle group” bez definicji grup — czy rozbijać partie, to pytanie produktowe.

Decyzję (opcja A/B/C) zapisać w rejestrze decyzji na Dysku („Trening App / 03 Rejestr decyzji”) z odrzuconymi alternatywami.

## Wdrożenie (decyzje właściciela 12.10.2026)

Właściciel wybrał wariant z celem na partię (A rozszerzone): automat = jedna liczba ze źródeł, własna liczba na życzenie, rozbicie barków i pleców w statystykach serii.

- **Cel serii na partię w tygodniu** (Ustawienia → „Cel serii na partię w tygodniu”): przy każdej części „Automatycznie” (`WEEKLY_SETS_MARK` = 10, lib/stats.ts — jedno źródło liczby)
  albo „Ręcznie” (własna liczba całkowita 1–40, `SETS_GOAL_MIN/MAX` w lib/setParts.ts — granice pola w interfejsie, **nie zalecenie**). Zapis: opcjonalne `Settings.weeklySetGoals`
  (tylko odstępstwa), bez zmiany `SCHEMA_VERSION`; `migrate` zachowuje znane części i liczby (przycięte do granic), resztę odrzuca; kopia i import przechodzą przez `migrate`.
  Kreski w „Ten tydzień”, Postępach i Progresji (tydzień) mierzą do celu swojej części; miesiąc bez kresek (jak dotąd). Generator i jego uwagi dalej używają automatu (`WEEKLY_SETS_MARK`) — bez zmian.
- **Pół serii** (lib/stats.ts `setsByMuscle`/`setsByPart`): partia główna ćwiczenia = 1, pomocnicza = 0,5; poziom 0,25 z `MUSCLE_LOAD` nie wchodzi do serii. Zdanie przy kresce w Postępach, Progresji i „Ten tydzień”
  nazywa to uproszczeniem i podaje źródło (Pelland i in. 2026 — jedno źródło, tak jak w komentarzu przy `WEEKLY_SETS_MARK`).
- **Rozbicie tylko w statystykach serii** (lib/setParts.ts): barki → przód / bok / tył (`front_delt`, `side_delt`, `rear_delt`), plecy → góra pleców / najszersze / prostowniki grzbietu
  (`upper_back`, `lats`, `lower_back`) + wiersze „barki — bez rozbicia” i „plecy — bez rozbicia”. Objętość, mapa mięśni, podsumowanie okresu, generator i regeneracja zostają na partiach zbiorczych.
  **Reguła przypisania (do akceptacji właściciela):** partia zbiorcza ćwiczenia (główna 1 / pomocnicza 0,5, jak dotąd) przekazuje serie tym swoim regionom z katalogu (`muscleLoadOf`, czyli `MUSCLE_LOAD`
  z poprawką o pola ćwiczenia), które mają najwyższy poziom obciążenia w tej partii; każdy taki region dostaje pełny udział (wiosłowanie: najszersze 1 i góra pleców 1; wyciskanie nad głową: przód 1, bok nic).
  Ćwiczenie bez regionów dla danej partii (własne, bez klucza katalogu) → wiersz „bez rozbicia”. Test danych: wszystkie 285 ćwiczeń katalogu z barkami lub plecami są rozbite (0 w „bez rozbicia”).
  Konsekwencja: suma części barków / pleców może przekroczyć wartość partii zbiorczej (dwa regiony na tym samym poziomie liczą się oba) — zamierzone, jak dwie partie główne jednego ćwiczenia.
- **Otwarte (bez zmian):** czy dawka–odpowiedź różni się między mięśniami; waga serii pośredniej inna niż 0,5; brak źródła na osobne cele dla regionów (cel domyślny dla każdej części = 10, jak dla partii).

