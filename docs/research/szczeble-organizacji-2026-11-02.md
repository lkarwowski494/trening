# Szczeble organizacji zaproponowanych przez badaczy wskazówek techniki (02.11.2026)

Cel: jedna miara dla wszystkich sesji. Hierarchia i „Wyjątek dla wskazówek techniki” — CLAUDE.md, „Merytoryczne podstawy”
(do „2 niezależnych źródeł” liczy się tylko szczebel 4 i wyżej; szczebel 5 to wskazówka, nie liczy się).
Strony „o nas” czytane przez WebFetch 02.11.2026. Narzędzie zwraca streszczenie; cytaty niżej to zdania, które narzędzie podało
jako dosłowne — przed wpisem do rejestru warto otworzyć 2–3 losowo (jak docs/research/33, „Ryzyka” pkt 5).
Strony innych aplikacji treningowych nie są źródłem (decyzja koordynatora 02.11.2026).

## Kryteria (stosowane jednolicie)

Szczebel 4 wymaga łącznie:
1. **Kto pisze** — jedno z: organizacja szkoląca/certyfikująca trenerów (precedens ACE, NASM, NSCA Coach — docs/research/27, tabela
   „Organizacje i szczeble”); serwis specjalistyczny prowadzony przez osoby o sprawdzalnych kwalifikacjach albo z redakcją i recenzją
   ekspercką (precedens ExRx, Stronger by Science); producent sprzętu — **tylko** dokumentacja i instrukcje własnego rodzaju sprzętu
   (precedens Concept2, Eleiko, Life Fitness, NordicTrack); instytucja medyczna/wydawca materiałów dla pacjentów z deklarowaną recenzją
   kliniczną (precedens HSS).
2. **Odpowiedzialność za treść** — autor z datą albo treść jawnie firmowana przez organizację spełniającą pkt 1.
3. **Nie handlowa w danym miejscu** — recenzje i zestawienia produktów z linkami afiliacyjnymi nie są źródłem techniki; materiały
   marketingowe sieci siłowni — szczebel 5.
4. **Gościnne artykuły** — liczą się tylko, gdy wydawca deklaruje kontrolę redakcyjną, a autor ma podane kwalifikacje w biogramie;
   inaczej szczebel 5.

Szczebel 5: treść bez autora, bez daty i bez wskazania, kto ją przygotował i z jakimi kwalifikacjami; marketing; społeczność bez redakcji.
Odrzucona: nie da się ustalić pochodzenia treści albo zależność od innego źródła czyni ją kopią.
Niezależność: dwa serwisy tego samego właściciela = jedno źródło.

## Rozstrzygnięcia

| Organizacja | Szczebel | Uzasadnienie | Przeczytana strona (adres, miejsce) |
|---|---|---|---|
| ISSA (issaonline.com) | 4 | Organizacja szkoląca i certyfikująca trenerów od 1988 (CPT; egzamin z akredytacją NCCA w opcji nadzorowanej) — ten sam typ co ACE/NASM. Warunek: artykuł z autorem i datą albo firmowany „ISSA”; blog ma niespójne biogramy (część autorów tylko z funkcją firmową). | https://www.issaonline.com/about-issa/ — „a global fitness and wellness education provider founded in 1988”; blog: https://www.issaonline.com/blog/ (podpisy autorów, daty, brak opisu recenzji) |
| Catalyst Athletics (biblioteka ćwiczeń) | 4 | Serwis specjalistyczny podnoszenia ciężarów; założyciel Greg Everett — trener międzynarodowy USA Weightlifting, autor książek; biblioteka firmowana przez Catalyst Athletics, Inc. (bez autora i daty przy haśle). Najmocniejszy dla bojów olimpijskich i ćwiczeń pomocniczych. | https://www.catalystathletics.com/about/ (sekcje o założycielach); https://www.catalystathletics.com/exercises/ (kategorie, prawa autorskie) |
| free-exercise-db (otwarty katalog) | 5 — zmiana względem precedensu ACG-010 (tam: 4) | Brak autorów, dat, kwalifikacji i redakcji; repozytorium to przebudowa zbioru exercises.json (O. Jennings), którego README nie podaje pochodzenia opisów; projekt rozwijany przez społeczność. Nie spełnia pkt 1–2. Zależność: decyzja 08.10.2026 (docs/18-archiwum-do-11.10.md:216) uznała zdjęcia za „najpewniej z Bodybuilding.com” — dla tekstów niepotwierdzone (patrz otwarte pyt. 1). Niezależnie od szczebla: nasz katalog bierze z niego nazwy (pole `fedb`), więc przy ćwiczeniu z `fedb` liczy się najwyżej jako jedno źródło (docs/research/acg-010-015-technika-2026-10-31.md:4). | https://github.com/yuhonas/free-exercise-db (README: „restructured the data and built a simple frontend to it”, „Special Thanks”); https://github.com/wrkout/exercises.json (README: zbiór tworzony przez społeczność, brak źródła opisów) |
| Western University, Sport and Recreation Services (przewodnik po sprzęcie) | 5 | Instrukcje sprzętu uczelnianego centrum rekreacji bez autora, daty i wskazania, kto je przygotował; nie jest to katedra kinezjologii ani organizacja szkoląca. Rozstrzyga pytanie otwarte z docs/research/33 („Otwarte pytania” pkt 1) na 5; to samo kryterium dotyczy HKU CSE i Sussexsport (nieczytane w tej sesji — do potwierdzenia przy ich stronach). | https://uwo.ca/campusrec/orientation/equipment_guides/legs.html (nagłówek „Sport and Recreation Services – Western University”, stopka; brak autora i daty) |
| NFPT (artykuły, także gościnne) | 4 warunkowo | Organizacja certyfikująca trenerów od 1988, akredytacja NCCA — typ ACE/NASM. Blog przyjmuje teksty gościnne (preferowani trenerzy z certyfikatem NFPT, też inni trenerzy i eksperci); wydawca redaguje teksty. Liczy się artykuł z autorem, datą i kwalifikacjami w biogramie; bez kwalifikacji — 5. | https://www.nfpt.com/about-nfpt — „NFPT is accredited by the National Commission for Certifying Agencies (NCCA)”; https://nfpt.com/become-a-partner/write-for-the-nfpt-blog/ — „We prefer that the trainers who write for the blog be NFPT certified.” |
| BarBend | 4 warunkowo (artykuły techniki), recenzje produktów — nie źródło | Serwis z redakcją, siecią ekspertów (CSCS, NASM, PhD, RD), datami aktualizacji i oznaczeniem „Expert Verified”; jednocześnie wiele recenzji ma linki afiliacyjne. Liczy się artykuł o technice z autorem i datą (najlepiej „Expert Verified”); zestawienia i recenzje sprzętu — nie. Ten sam właściciel co Breaking Muscle. | https://barbend.com/about/ (sekcje zespół, Expert Network); https://barbend.com/editorial-policy/ — „Content that is Expert Verified is indicated at the top of each corresponding article.” |
| Bodylastics (producent taśm) | 4 tylko dla ćwiczeń z taśmami (zakotwiczenie, chwyt, ustawienie taśmy); inne — 5 | Producent i sprzedawca taśm oporowych; materiały wideo tworzone we własnym zakresie, bez nazwisk instruktorów. Zgodnie z precedensem producentów (Concept2, Life Fitness) liczy się dokumentacja własnego rodzaju sprzętu. | https://www.bodylastics.com/about-us/ (historia firmy, „Bodylastics started filming follow-along workouts”) |
| Hoist Fitness (producent maszyn) | 4 tylko dla instrukcji własnych maszyn (ustawienie maszyny, przebieg ruchu na niej); inne — 5 | Producent sprzętu siłowego od 1977 z własną fabryką. Dokumentacja maszyny Hoist opisuje maszynę Hoist — przy maszynie innego producenta to wariant/analogia wg docs/research/27 (wiersz o analogii). | https://www.hoistfitness.com/pages/about (historia: Coast Health Studio 1977, fabryka 1980) |
| WebMD Ignite | 4 warunkowo | Wydawca materiałów edukacyjnych dla pacjentów, sprzedawanych systemom ochrony zdrowia (np. UMass Memorial Health), z deklaracją recenzji klinicznej — typ jak HSS (precedens 4). Słabość: recenzenci nienazwani, firma jest też agencją marketingową; liczy się tylko materiał publikowany przez placówkę medyczną z datą. Rozstrzyga docs/research/33, „Otwarte pytania” pkt 2 (część WebMD Ignite). | https://www.webmdignite.com/about-us — „All 25,000+ health education pieces meet rigorous standards ensuring accuracy and accessibility.” |
| Human Kinetics (fragmenty książek u wydawcy) | 3, gdy autorem jest organizacja naukowo-szkoleniowa (np. NSCA) albo uznany autor naukowy; inaczej ocena autora (zwykle 4 albo 5) | Szczebel wynika z autora książki, nie z wydawcy. Wydawca jest akademicki (od 1974, dział czasopism naukowych i podręczników), więc fragment u wydawcy z podanym tytułem, autorem i wydaniem jest przeczytanym źródłem książki. Spójne z propozycją 3 dla NSCA ETM (docs/research/33, tabela organizacji). | https://us.humankinetics.com/pages/about-human-kinetics (opis firmy, Journals Division, Academic Division) |
| Muscle & Strength | [OTWARTE] | Strona „o nas” i strona główna zwracają 403 — szczebla nie ustalam. | https://www.muscleandstrength.com/about-us (403, 02.11.2026) |
| PureGym | 5 | Sieć siłowni (ponad 700 klubów); przewodniki ćwiczeń bez autorów, dat i opisu recenzji, tylko ogólne „top tips from our qualified trainers” — materiał marketingowy. | https://www.puregym.com/about-us/; https://www.puregym.com/exercises/ (brak autora i daty) |
| Garage Gym Reviews | [OTWARTE] | Strony „o nas” i główna zwracają 404 w narzędziu — nieprzeczytane. Charakter serwisu z recenzjami sprzętu wymagałby co najmniej warunków jak BarBend, ale bez przeczytanej strony szczebla nie ustalam. | https://www.garagegymreviews.com/about-us (404, 02.11.2026) |
| Breaking Muscle | 5; nigdy niezależne od BarBend | Według własnej strony od 2021 r. należy do BarBend; treści od społeczności trenerów (ok. 2000 autorów), brak opisu weryfikacji faktów. Nawet artykuł z dobrym autorem nie może być „drugim źródłem” obok BarBend. | https://breakingmuscle.com/about-us/ (sekcje historia i współpracownicy: założenie 2011, zakup przez BarBend 2021) |

## Wpływ na precedensy

- **ACG-010** (docs/research/acg-010-015-technika-2026-10-31.md:3–4) liczył free-exercise-db jako szczebel 4. Po tym rozstrzygnięciu to
  szczebel 5 — wskazówki ACG-010/015 potrzebują dwóch innych źródeł szczebla 4. Zgłaszam koordynatorowi; nie zmieniam tamtego pliku.
- **docs/research/33**: Western SRS → 5 (pyt. 1, część Western); WebMD Ignite → 4 warunkowo (pyt. 2, część WebMD). Wpisy w
  `data/zrodla/cues.json` (sekcja braków: Pec Deck, Cable Kickback, Cable Crunch, Hanging Knee Raise, Upright Row) zależą od tego —
  aktualizacja należy do sesji wskazówek.
- Producenci: doprecyzowanie, że szczebel 4 dotyczy tylko własnego rodzaju sprzętu, jest zgodne z dotychczasowym użyciem (Concept2 —
  ergometr, NordicTrack — bieżnia).

## Otwarte pytania

1. **[OTWARTE] Pochodzenie tekstów free-exercise-db / exercises.json.** README obu repozytoriów nie podaje źródła opisów. Próba porównania
   z biblioteką Bodybuilding.com nieudana (adres przekierowuje do sklepu, web.archive.org zablokowany dla narzędzia). Jeśli teksty są kopią
   innego serwisu — źródło odrzucone (kopia, nie niezależne źródło); do tego czasu szczebel 5.
2. **[OTWARTE] Muscle & Strength i Garage Gym Reviews** — przeczytać stronę „o nas” w środowisku z dostępem (403/404 w narzędziu).
3. **[OTWARTE] HKU CSE i Sussexsport** — to samo kryterium co Western (brak autora i daty → 5), ale ich stron w tej sesji nie czytałem.
4. **[OTWARTE] Niezależność organizacji certyfikujących** (ISSA, NFPT i inne) — nie sprawdzałem powiązań właścicielskich; przy parze ISSA + NFPT
   jako jedynych dwóch źródłach sprawdzić właściciela (stopka NFPT wskazuje „Summit Professional Education”).
