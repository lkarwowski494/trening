# 06-tresci · fix · M1-audytor-generalny-038 (03-zakres-601) — wynik

Data: 2026-10-28 · Rola: 06-tresci (tryb fix, subagent; recenzja niezależna — nie pisałem treści kart) · Gałąź: naprawy/M2-koordynator-napraw-2026-10-28-p1 (baza f8a7806), bez push.

## Skrót (do 25 linii)
- Commit **6935d54** → M1-audytor-generalny-038; 03-zakres-601 (DEC-10 a): recenzja + strażnik + rejestr (`docs/research/figury-recenzja.json`, sekcje „karty” i „zestawy”).
- Testy przed: `tests/karty-recenzja.test.tsx` 8/13 czerwone (brak wpisów i mechanizmu) — `dowody/jest-przed.txt`; po: 14/14 — `dowody/jest-po.txt`; związane 142/142 i 224/225 (1 pominięty) — `dowody/jest-zwiazane-3.txt`, `dowody/jest-zwiazane-4.txt`; `test:fast` 989/990 (`dowody/test-fast-2.txt`), jedyny czerwony test poprawiony przed commitem — końcowo 19/19 (`dowody/jest-po-koncowe.txt`); typecheck, lint (0 błędów), check:claims, check:zrodla-runtime, check:cues, check:figures, check:decyzje, kontrola-brd, check:readme, macierz (bez testu: 0), check:pochodne — zielone.
- Karty własne zrecenzowane: 52 (31 z listy + 15 „zastąpionych” v2 + Pendlay Row, Push Press, Reverse Lunge + Pistol Squat, Lunges (hantle), Walking Lunges): **46 wyświetlana / 6 do poprawy** (Hack Squat, Pistol Squat, Lunges (hantle), Walking Lunges, Reverse Lunge, Deadlift (hantle)). Pozostałe 50 kart przechodzi wpisem v1 „wyswietlana” z 27–28.10.
- Zestawy ogólne przy figurach v2 (70): **69 wyświetlana / 1 do poprawy** (Decline Close-Grip Bench To Skull Crusher). Lateral Lunge, Cossack Squat, Barbell Side Split Squat, Smith Machine Pistol Squat, Single-Leg High Box Squat — w 1.0 niewidoczne (rodzina planned), poza runtime do czasu recenzji.
- Strażnik: `scripts/zrodla-runtime.mjs` (kartaSkrot, zestawSkrot, cardReviewed, buildCues → listy `hidden` i `general`); karta bez aktualnej recenzji wypada z `lib/cues/data.json` (z figurą v1), zestaw — z listy `general`, ekran go nie pokazuje (`components/ExerciseCues.tsx`, `lib/figures/v2/ui.ts`). Mutacja `sumo.kneesOut` ukrywa Sumo Deadlift i 4 warianty sumo (test).
- Przekazania do 08 (przegląd kodu przy scaleniu): zmiany w skrypcie, `lib/cues/index.ts`, `ExerciseCues.tsx`, `ui.ts` i 9 testach zależnych od liczby kart w runtime — kod napisałem ja (jak w fix p3 z 27.10), nie rola 08.
- Przekazania treści (koordynator; potem nowa recenzja innym agentem): Pistol — usunąć `sq.mis.kneesIn` albo nowe `pistol.mis.kneeIn` „Kolano nogi podporowej uciekające do środka.”; Deadlift (hantle) — `dbdl.lower` „Odkładaj ciężar tak samo: biodra w tył, kolana się uginają, plecy proste.” (albo usunąć `dl.lower`); 3 wykroki — usunąć `lunge.knee` i `lunge.mis.kneeIn` albo drugie źródło; Hack Squat — drugie źródło o hack squat (badacz); skull crusher — usunąć `skull.upperArm` z zestawu. Tłumacz: EN `lp.hips` „seat” → „backrest/pad” (Hack Squat).
- Otwarte: ExRx niedostępne 28.10 (403, archiwum zrywa połączenie) — w 19 kartach „wyświetlana” część wskazówek ma dziś jedno przeczytane źródło + ExRx z rejestru (oznaczone w uwagach wpisu); decyzja: opcje niżej. Strażnik „analogia” (pkt 4 wejścia): nie wdrożony — bez strukturalnego znacznika daje fałszywe alarmy (`dowody/sonda-analogie.txt`).
- Przegląd ścieżek wrażliwych: nie dotyczy (bez migracji, kopii, zakupów, workflowów). Statusu „zweryfikowane” nie nadaję.

## ETAP 0 — środowisko i klasyfikacja
- Linux, Node 22, git; brak symulatora i przeglądarki (zmiana ekranu sprawdzona testem renderu, bez zrzutów). Repo publiczne.
- Sieć 28.10.2026: acefitness.org, nasm.org, strongerbyscience.com, eleiko, concept2, hss.edu, nordictrack, lifefitness, Europe PMC (pełne teksty PMC), PDF z instituteofmotion i NSCA Coach — 200; **exrx.net 403, web.archive.org zrywa połączenie** (także WebFetch), PDF NSCA Basics 403, repozytorium mdx.ac.uk 405; dwa artykuły PMC (PMC8057707, PMC4732391) odczytane narzędziem WebFetch („z odczytu narzędziem, niesprawdzony dosłownie”). Indeks odczytów: `dowody/odczyt-zrodel-2026-10-28.json`.
- Klasyfikacja: **M** (rozstrzyga hierarchia źródeł; decyzja DEC-10 a już podjęta). Prompt roli każe kod oddać roli 08; poprzednia sesja 06 (fix p3, 27.10) zmieniała `scripts/zrodla-runtime.mjs` sama — tu też, z prośbą o przegląd 08.

## Metoda recenzji
- Dla każdej karty: zdania z `lib/cues/data.json` + teksty `lib/cues/text/pl.json` (zrzut: `dowody/karty-zakres.txt`, `dowody/karty-zakres-2.txt`), źródła z `data/zrodla/cues.json` pobrane dziś (`narzedzia/pobierz.py`), tekst strony czytany w całości (strony bibliotek) albo fragment wokół miejsca z rejestru (artykuły, przewodniki — `grep` na surowym tekście).
- Kryteria (CLAUDE.md, wyjątek dla wskazówek techniki 25.10): ustawienie, ruch, błędy zgodne z 2 niezależnymi źródłami szczebla 4 (albo badaniami); źródło o innym ćwiczeniu („ta sama zasada”, „ten sam wzorzec” przy innym ćwiczeniu) = analogia, nie liczy się (docs/research/27-wskazowki-zrodla.md:15); wariant (sprzęt, pozycja: sztanga/hantle, siedząc/stojąc) liczy się.
- Zestawy ogólne: czy każde zdanie zestawu pasuje do ruchu wariantu figury v2 (parametry wariantu w `dowody/v2-wyswietlane.json`); teksty i ich źródła jak na kartach-wzorcach (`data/zrodla/wskazowki-ogolne.json`).
- Zapis (L-047 A): każdy wpis ma `stan` „zrecenzowana niezależnie…”, `autor` (agenci badacz/programista wg historii git — commity 80e91c7, 34124c1) ≠ `recenzent` (06-tresci, subagent, 28.10.2026), `sha` z `node scripts/zrodla-runtime.mjs --skroty`.

## Werdykty „do poprawy” (ukryte przez strażnik) i przekazania
| Karta / zestaw | Wada | Poprawka (brzmienie PL + źródła) |
|---|---|---|
| Hack Squat | każde z 5 zdań: jedno źródło o tym ćwiczeniu (ExRx, dziś nieczytelne) + prasa nóg bez znacznika „analogia” — poniżej minimum 2 źródeł | brzmienie bez zmian; badacz: drugie przeczytane źródło o hack squat dla hack.setup, hack.move, lp.heels, lp.hips, sq.kneesToes; tłumacz: EN lp.hips „seat” → „backrest/pad” tylko w kontekście Hack Squat (Leg Press ma siedzisko) |
| Pistol Squat | sq.mis.kneesIn „Kolana zapadające się do środka.” — liczba mnoga przy przysiadzie na jednej nodze (źródło: „Allowing the planted knee to cave inward”, nasm.org single-leg-squat, Common Mistakes) | A (bez tłumaczenia): usunąć sq.mis.kneesIn z „mistakes” — pistol.knee już to mówi. B: nowe pistol.mis.kneeIn „Kolano nogi podporowej uciekające do środka.” (NASM jw.; ExRx BWSingleLegSquat Comments — do ponownego odczytu) |
| Lunges (hantle), Walking Lunges, Reverse Lunge | lunge.knee i lunge.mis.kneeIn: ExRx (dziś nieczytelne) + przysiad bułgarski („ten sam wzorzec” — analogia); przeczytane strony wykroków (ACE lunge #363, forward lunge #8 i #94, reverse lunge #319, walking lunges #139) nie mówią o ustawieniu kolana | A (bez tłumaczenia): usunąć oba zdania z trzech kart. B: drugie przeczytane źródło o wykroku z ustawieniem kolana (badacz). Potem nowa recenzja karty i figury v1 (skrót obejmuje wskazówki) |
| Deadlift (hantle) | dl.lower „Odkładaj **sztangę** tak samo…” na karcie z hantlami | nowe dbdl.lower „Odkładaj ciężar tak samo: biodra w tył, kolana się uginają, plecy proste.” — NASM kettlebell-deadlift Step 4 „Hinge at the hips to lower the kettlebell back to the ground with control, maintaining a neutral spine throughout the descent.”; ACE deadlift #6 „shifting the weight back into the hips and keep the back straight while allowing the knees to bend” (33 przekłady); albo bez tłumaczenia: usunąć dl.lower |
| Decline Close-Grip Bench To Skull Crusher (zestaw) | skull.upperArm „Ramiona prawie nieruchome…” przeczy części wyciskania (figura v2 pokazuje wyciskanie na ławce ujemnej) | usunąć skull.upperArm z `ok` w cue-sets.json (zostaje cgbp.elbows, mis.jerk) |

Dla wykroków, Pistol Squat i Deadlift (hantle) wariant A to samo usunięcie zdania — kilka minut koordynatora, bez tłumacza; potem nowa recenzja innym agentem (L-047).

## Otwarte (decyzja) — ExRx nieczytelne 28.10.2026
19 kart „wyświetlana” ma wskazówki, których drugie źródło w rejestrze to ExRx (czytane przez badacza 25.10 przez archiwum): Back Squat, Bench Press (hantle), Cable Fly, Chest Fly (hantle), Close Grip Bench Press, Crunch, Deadlift (sztanga), Front Squat, Good Morning, Incline Bench Press (sztanga), Inverted Row, Pendlay Row, Przysiad z pasem (linki), Push Press, RDL (hantle/linki), Reverse Fly (hantle), Reverse Pec Deck, Sumo Deadlift, Trap Bar Deadlift. Treść zgodna z drugim, przeczytanym dziś źródłem; nie znalazłem sprzeczności.
- (A) zostawić „wyświetlana” z uwagą w wpisie; ponowny odczyt ExRx przy dostępie (krok: sesja z działającym archiwum albo właściciel otwiera 1 stronę) — koszt 0, ryzyko: wskazówka stoi dziś na jednym sprawdzonym źródle. **Rekomendacja.**
- (B) „do poprawy” dla 19 kart do czasu odczytu — ukrywa technikę m.in. przysiadu i martwego ciągu w 1.0; zmiana: werdykt w 19 wpisach + `--write`.
Przysiad z pasem (linki): jedyne źródło o tym ćwiczeniu to ExRx; drugie to przysiad bez obciążenia (wariant) — przy ponownym odczycie potwierdzić.

## Pkt 4 wejścia — strażnik „jedno źródło o ćwiczeniu bez znacznika analogia”
Nie wdrożony. Sonda (`dowody/sonda-analogie.txt`): reguła po tekście miejsca daje 28 trafień, w większości warianty dozwolone (sztanga/hantle, maszyna/hantle), a nie łapie Hack Squat hack.move/lp.heels/lp.hips (brak frazy w miejscu). Tanio i bez fałszywych alarmów da się to zrobić dopiero ze strukturalnym polem w `data/zrodla/cues.json` (np. trzeci element odwołania: „wariant” | „analogia”) — zadanie dla badacza, potem test „≥ 2 organizacje bez analogii”.

## Nowe znaleziska (bez naprawy)
- 06-tresci-601a (P2, informacja o źródle): strona nasm.org close-grip-bench-press ma w „Common Mistakes” tekst z martwego ciągu (błąd wydawcy); karta jej nie cytuje.
- 06-tresci-601b (P2, realny): bp.control „bez odbijania od klatki” w zestawach Floor Press ×4 i Board Press — sztanga nie dochodzi do klatki; nie przeczy, ale nie trafia (lepiej: łokcie/deska).
- 06-tresci-601c (P2): Pendlay Row — karta opisuje wiosłowanie w opadzie, bez cechy ćwiczenia (start z podłogi co powtórzenie); figura już ukryta.
- 06-tresci-601d (P2): rejestr źródeł opiera 304 odwołania wskazówek na jednym serwisie dostępnym tylko przez archiwum — dziś nieczytelny; ryzyko powtórzy się przy każdej recenzji.

## Kontrola dowodów i sekretów
Wynik: `dowody/sprawdz-raport.txt`.

## Pełna tabela recenzji
### Karty własne (52)

| Ćwiczenie | Werdykt | Skrót | Uwagi |
|---|---|---|---|
| Back Extension | wyswietlana | 22159fe935b0 | 2 badania (szczebel 3) przeczytane: kąt w biodrach ok. 90°, plecy proste, bez wyginania w łuk, tempo kontrolowane — zgodne. Źródło z Western Norway odczytane narzędziem (PMC zwraca 500 dla curl), niesprawdzone dosłownie. |
| Back Squat | wyswietlana | ff6723e03326 | Sztanga na górze pleców, rozstaw, zejście biodra+kolana, kolana nad palcami, kolana mogą wyjść przed palce (badanie 3 + przewodnik), głębokość, plecy proste — przeczytane źródła. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (sq.mis.heels ma jedno przeczytane źródło — przysiad bez obciążenia, ten sam ruch). |
| Bench Press (hantle) | wyswietlana | 4d57041596ac | Ustawienie, kontakt z ławką, ruch, łopatki, bez odbijania, bez wyginania — przeczytane biblioteki (hantle; hantle z taśmą — wariant). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (dbp.setup „hantle na udach”). |
| Bench Press (sztanga) | wyswietlana | 2c1ccee149b9 | Kontakt z ławką, chwyt nieco szerzej niż barki, ruch, łopatki, kontrola, błąd wyginania — 2–3 przeczytane źródła o tym ćwiczeniu. |
| Bieg | wyswietlana | 4c5c3054eae8 | Przegląd (szczebel 2) i badanie (3) + biblioteka (4): krótszy krok, mniej podskakiwania, stopa pod ciałem ogranicza hamowanie — zgodne; brak liczb na karcie. |
| Box Jump | wyswietlana | b65594ec1c22 | 2 biblioteki (4) o tym ćwiczeniu: ustawienie, wybicie, miękkie lądowanie, dobór wysokości, błąd „sztywne nogi” — zgodne. |
| Burpees | wyswietlana | 0c4b5839c096 | Biblioteka (4) i badanie (3) o tym ćwiczeniu: wyskok do podporu i powrót z wyskokiem — zgodne (wariant z pompką i z BOSU nie przeczy). |
| Cable Fly | wyswietlana | 8c26991ac3f6 | Bloczki ok. na wysokości barków, łuk, powolny powrót — 2 przeczytane źródła. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (fly.elbows „stały kąt”, fly.posture). |
| Chest Fly (hantle) | wyswietlana | 3ff26778cc1d | Ustawienie i łuk zgodne z przeczytanym źródłem o tym ćwiczeniu (kontakt głowy, barków, pośladków i stóp — wprost). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu. |
| Close Grip Bench Press | wyswietlana | 57a1d18a5bfb | Chwyt na szerokość barków lub węziej, łokcie przy tułowiu, kontakt z ławką — 2 przeczytane biblioteki. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (cgbp.elbows). Uwaga o źródle: sekcja „Common Mistakes” tej strony biblioteki opisuje martwy ciąg (błąd wydawcy) — karta jej nie cytuje. |
| Crunch | wyswietlana | 13fab3d037f1 | Ustawienie, ruch żebra→miednica, lędźwie na podłodze, rozluźniona szyja — wprost w przeczytanym źródle o tym ćwiczeniu. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu. |
| Deadlift (hantle) | do poprawy | 1404a1a1de66 | Błąd treści: dl.lower „Odkładaj sztangę tak samo…” na karcie martwego ciągu z hantlami (ciężarem są hantle/kettlebell). Pozostałe zdania zgodne z przeczytanymi źródłami (kettlebell i sztanga — warianty). |
| Deadlift (sztanga) | wyswietlana | ad643e5b486d | Ustawienie, chwyt, wyprost bioder i kolan, odkładanie, plecy neutralne, sztanga blisko — 2 przeczytane biblioteki (4) o tym ćwiczeniu. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (mis.barAway i dl.hipsLow mają dziś jedno przeczytane źródło). |
| Diamond Push Up | wyswietlana | 585afa11ece2 | 2 badania (3): dłonie pod mostkiem, kciuki i palce wskazujące stykają się, ciało sztywne — zgodne. Drugie źródło odczytane narzędziem (PMC 500 dla curl). |
| Farmer's Walk | wyswietlana | db13ea14b2b8 | Ciężar w każdej ręce przy biodrach, spokojny krok, wyprostowana postawa — 2 przeczytane źródła (biblioteka; artykuł edukacyjny s. 52). |
| Front Squat | wyswietlana | 16faee14bd32 | Sztanga/hantle z przodu barków, łokcie wysoko, kolana nad palcami, głębokość, pięty na podłodze — 2 przeczytane biblioteki (warianty z hantlami). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu. |
| Goblet Squat | wyswietlana | 09d0d7c6238b | Ciężar pionowo przy klatce, rozstaw, głębokość, ciężar blisko — 2 przeczytane biblioteki o tym ćwiczeniu. |
| Good Morning | wyswietlana | 67a1aae7bf72 | Sztanga na górze pleców, zawias z lekko ugiętymi kolanami, plecy neutralne, błędy — przeczytana biblioteka o tym ćwiczeniu. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (gm.depth „nie dalej niż poziomo”, gm.light „zacznij od lekkiego”). |
| Hack Squat | do poprawy | 88c73f16703e | Podstawa: każde z 5 zdań ma jedno źródło o tym ćwiczeniu (ExRx — niedostępne 28.10) i drugie o innym ćwiczeniu (prasa nóg: „prasa — ta sama zasada”) bez znacznika „analogia”; wg docs/research/27 (MER2-04) analogia nie liczy się do minimum 2 źródeł. Treść kierunkowo poprawna, karta pokazana jako własna (bez dopisku „ogólne”). Też EN lp.hips „seat” — maszyna nie ma siedziska (PL „od oparcia” dobrze). |
| Incline Bench Press (hantle) | wyswietlana | 099c10f1fed3 | Ustawienie, ruch do boków górnej części klatki, łopatki, bez odbijania, bez wyginania — 2 przeczytane biblioteki o tym ćwiczeniu. |
| Incline Bench Press (sztanga) | wyswietlana | 0e1a412280aa | Ławka skośna, plecy i stopy oparte, chwyt, sztanga do górnej części klatki, łopatki, kontrola — przeczytana biblioteka o tym ćwiczeniu + hantle (wariant). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu. |
| Incline Walk (bieżnia) | wyswietlana | 16bfb963e0f0 | Poręcze najwyżej do równowagi, bez odchylania — badania (3) i 2 producenci (4); postawa wyprostowana — zgodne. |
| Inverted Row | wyswietlana | 07b9b0286935 | Przyciąganie z łokciami przy tułowiu, sztywny tułów, łopatki ściągnięte — zgodne z przeczytanym źródłem (wiosłowanie w zawieszeniu, wariant). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu („ciało proste od głowy do pięt”). |
| Leg Curl | wyswietlana | f9681b034104 | Pięty do pośladków, uda i biodra nieruchomo, ruch płynny — 2 biblioteki (maszyna siedząc; wariant leżąc z linką). |
| Leg Extension | wyswietlana | 438254c7031a | Zakres od ok. 90° do wyprostu i kontrolowane tempo — 2 badania (3) przeczytane. |
| Lunges (hantle) | do poprawy | a87fb41d2c40 | Podstawa lunge.knee i lunge.mis.kneeIn: jedno źródło o tym ćwiczeniu (ExRx — niedostępne 28.10) + przysiad bułgarski (inne ćwiczenie, „ten sam wzorzec” — analogia, nie liczy się do minimum wg docs/research/27). Przeczytane dziś strony wykroków (biblioteka: lunge, forward lunge) nie mówią o ustawieniu kolana. Pozostałe zdania zgodne. |
| Machine Shoulder Press | wyswietlana | 524d02513230 | Siedzisko z uchwytami na wysokości barków, wyprost bez blokowania, stopy na podłodze — wprost w przeczytanym źródle o tym ćwiczeniu; drugie (hantle siedząc) zgodne. |
| Medicine Ball Slam | wyswietlana | cbe93cfddf5e | Piłka nad głowę i rzut w podłogę, plecy proste, napięty brzuch — biblioteka (4) i protokół (3) przeczytane. |
| Nordic Curl | wyswietlana | 5d7a0e22f41d | Kostki przytrzymane, pochylanie jak najwolniej, biodra wyprostowane, łapanie się dłońmi — 3 badania (3) przeczytane, zgodne. |
| Pallof Press | wyswietlana | ff78fc52665f | Bokiem do wyciągu ok. na wysokości klatki, wypchnięcie i powrót, bez obrotu tułowia — 2 przeczytane źródła. Repozytorium uczelni zwraca 405 (nieodczytane); „napnij brzuch” — wprost tylko „tułów bez ruchu” w przeczytanym źródle. |
| Pendlay Row | wyswietlana | 60840343dff9 | Treść karty = wiosłowanie sztangą w opadzie (przeczytane źródło); nie przeczy ćwiczeniu, ale nie opisuje jego cechy (start z podłogi przy każdym powtórzeniu) — uwaga P2, figura nadal ukryta (wpis v1). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (wg rejestru „Also known as Pendlay Row”). |
| Pistol Squat | do poprawy | 5e349987aef5 | Błąd sq.mis.kneesIn „Kolana zapadające się do środka.” — liczba mnoga przy przysiadzie na jednej nodze (źródło: „planted knee cave inward”). Pozostałe zdania zgodne z przeczytanym źródłem o tym ćwiczeniu; ExRx niedostępne 28.10. |
| Preacher Curl | wyswietlana | 558e35a77598 | 2 badania (3) z ustawieniem jak na modlitewniku: pacha przy krawędzi, pełny zakres, wolniejsze opuszczanie — zgodne (ustawienia testowe, oznaczone w rejestrze jako słabsze). |
| Przysiad z pasem (linki) | wyswietlana | 6350cd00d8b8 | Wzorzec przysiadu (przeczytana biblioteka: przysiad bez obciążenia — ten sam ruch, inny opór). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (jedyne źródło o przysiadzie z pasem) — uwaga: przy ponownym odczycie potwierdzić. |
| Push Press | wyswietlana | 177f63f42449 | Sztanga z przodu barków, krótkie ugięcie, wybicie z nóg i bioder, wyciśnięcie nad głowę — przeczytane źródło o tym ćwiczeniu. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu („ugięcie krótkie”). Figura nadal ukryta (wpis v1). |
| RDL (hantle/linki) | wyswietlana | 534a2ce0ca45 | Hantle w opuszczonych rękach, zawias, kolana lekko ugięte, głębokość — przeczytana biblioteka o tym ćwiczeniu + wersja ze sztangą. ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (hantle przed udami). |
| RDL (sztanga) | wyswietlana | d847e65c8952 | Ustawienie, zawias z kolanami lekko ugiętymi, sztanga blisko, głębokość do rozciągnięcia tyłu ud, błędy — 2 przeczytane biblioteki o tym ćwiczeniu. |
| Reverse Crunch | wyswietlana | 27f3e7db0c98 | Ruch prowadzi miednica, bez wymachu nóg, powolne opuszczanie — 2 przeczytane źródła, cytaty dosłownie. |
| Reverse Fly (hantle) | wyswietlana | 3ec9d2eb3305 | Ramiona bokiem do wysokości barków, w linii uszu, łokcie lekko ugięte — przeczytane źródło (z oparciem klatki). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu („tułów prawie poziomo”, „stały kąt”). |
| Reverse Lunge | do poprawy | 32c16e144a0c | Jak Lunges (hantle): lunge.knee i lunge.mis.kneeIn bez drugiego źródła o tym ćwiczeniu (analogia). Przeczytane źródło o wykroku w tył (wersja ze sztangą) potwierdza ustawienie, ruch i tułów; ExRx niedostępne. Figura już ukryta (wpis v1). |
| Reverse Pec Deck | wyswietlana | eccc70534217 | Ruch w bok i w tył, łokcie na wysokości barków — przeczytane źródła o tym samym ruchu (hantle z oparciem, linki). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu (maszyna). |
| Rower | wyswietlana | ec0871745e47 | Siodełko: lekko ugięte kolano w dolnym położeniu, przednia część stopy na pedale — 2 przeczytane źródła (producent, szpital) + przegląd (2). |
| Russian Twist | wyswietlana | 9408bbfb2743 | Odchylenie z prostymi plecami, obrót prowadzony barkami, bez rzucania ciężarem — biblioteka o tym ćwiczeniu; drugie źródło to wersje na BOSU i piłce (warianty). |
| Seated Calf Raise | wyswietlana | 391a8cab9dab | Pełny zakres ze wspięciem i opuszczeniem pięt, tempo kontrolowane — 2 badania (3) i biblioteka (4). |
| Side Plank | wyswietlana | 0aa0fee88efa | Łokieć pod barkiem, prosta linia, biodra bez opadania i skrętu, błąd łokcia — wprost w przeczytanym źródle; drugie (wersja na BOSU) zgodne. |
| Straight Arm Pulldown | wyswietlana | 2e38186de1a0 | Wyciąg wysoko, proste ręce, drążek w stronę ud — 2 przeczytane źródła. |
| Suitcase Carry | wyswietlana | cdf5c579c5c0 | Ciężar w jednej ręce przy biodrze, spokojny krok, bez przechylania — 3 przeczytane źródła. |
| Sumo Deadlift | wyswietlana | dc3cb6f44f71 | Szeroko: stopy na zewnątrz dłoni, kolana w linii palców, chwyt pod barkami, kolana na zewnątrz przy starcie, plecy proste przy opuszczaniu — przeczytany przewodnik (4). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu. „Klatka wysoko” (sumo.lift) i „sztanga blisko nóg” — przewodnik mówi o wyprostowanej postawie i przyciąganiu sztangi do goleni; brzmienie zgodne kierunkowo. |
| Trap Bar Deadlift | wyswietlana | 7abba2a68eee | Stanie w ramie sztangi (badanie, abstrakt), wyprost bioder i kolan, plecy neutralne (biblioteka — martwy ciąg, wariant). ExRx niedostępne 28.10.2026 (HTTP 403, kopia w archiwum — zerwane połączenie): te wskazówki potwierdzone dziś drugim przeczytanym źródłem; ExRx do ponownego odczytu („uchwyty po bokach”, barki nad sztangą). |
| Walking Lunges | do poprawy | c098c24121f4 | Jak Lunges (hantle): lunge.knee i lunge.mis.kneeIn bez drugiego źródła o tym ćwiczeniu (analogia: przysiad bułgarski). Uwaga N3 (raport 1.1): figura wraca krokiem w tył, a tekst lunge.walk mówi o kroku drugą nogą — przybliżenie bez napisu. |
| Wall Sit | wyswietlana | 42b2ec360132 | Plecy o ścianę, tułów wyprostowany, głębokość reguluje trudność, oddech normalny — badania (3) przeczytane; „breathe normally” odczytane dosłownie (wcześniej „do potwierdzenia”). |
| Wyciskanie na linkach (stojąc) | wyswietlana | 08c8964e60ab | Bloczki na wysokości klatki/barków, tyłem do wyciągu, wyprost i powrót, stopy w podłogę i napięty brzuch — 2 przeczytane źródła. |

### Zestawy ogólne przy figurach v2 (70)

| Ćwiczenie | Wzorzec | Werdykt | Skrót | Uwagi |
|---|---|---|---|---|
| Axle Deadlift | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); |
| Band Bench Press | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); |
| Band Good Morning | rdl | wyswietlana | 543dd4716326 | zgodne (figura v2: hinge); |
| Band Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Barbell Guillotine Bench Press | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); |
| Barbell Hack Squat | hingeFloor | wyswietlana | e76670c9126d | zgodne (figura v2: squat); |
| Bench Press with Chains | bench | wyswietlana | 0d587fba1aaa | zgodne (figura v2: bench_press); bp.elbowsMid bez tekstu PL — ekran go pomija; dodanie tekstu zmieni skrót (nowa recenzja). |
| Board Press | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); bp.control „od klatki” — sztanga dochodzi do deski; nie przeczy, uwaga P2. |
| Bodyweight Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Box Squat | squat | wyswietlana | e4a4960f2f21 | zgodne (figura v2: squat); |
| Box Squat with Bands | squat | wyswietlana | a748f9e63acb | zgodne (figura v2: squat); |
| Box Squat with Chains | squat | wyswietlana | a748f9e63acb | zgodne (figura v2: squat); |
| Cable Deadlift | hingeFloor | wyswietlana | 2c27f1bbb44b | zgodne (figura v2: hinge); |
| Cable Pull Through | rdl | wyswietlana | 2097ba8dea72 | zgodne (figura v2: hinge); |
| Cable Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Chain Press | bench | wyswietlana | 0d587fba1aaa | zgodne (figura v2: bench_press); bp.elbowsMid bez tekstu PL — ekran go pomija; dodanie tekstu zmieni skrót (nowa recenzja). |
| Clean Deadlift | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); |
| Close-Grip Dumbbell Press | bench | wyswietlana | d21d1506d7ab | zgodne (figura v2: bench_press); |
| Close-Grip EZ-Bar Press | bench | wyswietlana | d21d1506d7ab | zgodne (figura v2: bench_press); |
| Deadlift with Bands | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); |
| Deadlift with Chains | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); |
| Decline Bench Press | bench | wyswietlana | cd5b2598cc3d | zgodne (figura v2: bench_press); bp.elbowsMid bez tekstu PL — ekran go pomija; dodanie tekstu zmieni skrót (nowa recenzja). |
| Decline Bench Press (hantle) | bench | wyswietlana | cd5b2598cc3d | zgodne (figura v2: bench_press); bp.elbowsMid bez tekstu PL — ekran go pomija; dodanie tekstu zmieni skrót (nowa recenzja). |
| Decline Close-Grip Bench To Skull Crusher | triLying | do poprawy | 24e329241ebc | Przypisanie przeczy części ruchu: skull.upperArm „Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie” przy ćwiczeniu łączącym wyciskanie wąsko (ramiona się ruszają) z francuskim; figura v2 pokazuje wyciskanie na ławce ujemnej. |
| Deficit Deadlift | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); |
| Dip Belt Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Double Kettlebell Front Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Dumbbell Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Floor Press (hantle) | bench | wyswietlana | 99942cfac127 | zgodne (figura v2: bench_press); bp.control „bez odbijania od klatki” — przy wyciskaniu z podłogi ciężar zwykle nie dochodzi do klatki; nie przeczy, uwaga P2 (lepiej: bez odbijania łokci od podłogi). |
| Floor Press (sztanga) | bench | wyswietlana | 99942cfac127 | zgodne (figura v2: bench_press); jak Floor Press (hantle) — uwaga P2 do bp.control. |
| Floor Press with Chains | bench | wyswietlana | 99942cfac127 | zgodne (figura v2: bench_press); jak Floor Press (hantle) — uwaga P2 do bp.control. |
| Good Morning off Pins | rdl | wyswietlana | 543dd4716326 | zgodne (figura v2: hinge); |
| JM Press | bench | wyswietlana | d7fe41300e57 | zgodne (figura v2: bench_press); |
| Landmine Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Leverage Deadlift | hingeFloor | wyswietlana | 2c27f1bbb44b | zgodne (figura v2: hinge); |
| One Arm Dumbbell Bench Press | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); |
| One-Arm Kettlebell Floor Press | bench | wyswietlana | 99942cfac127 | zgodne (figura v2: bench_press); jak Floor Press (hantle) — uwaga P2 do bp.control. |
| One-Arm Overhead Kettlebell Squat | squat | wyswietlana | fb2f06dff2f5 | zgodne (figura v2: squat); |
| One-Arm Side Deadlift | hingeFloor | wyswietlana | 2c27f1bbb44b | zgodne (figura v2: hinge); |
| Overhead Squat | squat | wyswietlana | 304e0fc5babd | zgodne (figura v2: squat); |
| Pin Press | bench | wyswietlana | 60b4ee8e613d | zgodne (figura v2: bench_press); |
| Rack Pull | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); dl.lift przy starcie z kołków nad kolanami — wyprost bioder i kolan nadal trafny. |
| Rack Pull with Bands | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); jak Rack Pull. |
| Reverse Band Bench Press | bench | wyswietlana | 0d587fba1aaa | zgodne (figura v2: bench_press); bp.elbowsMid bez tekstu PL — ekran go pomija; dodanie tekstu zmieni skrót (nowa recenzja). |
| Reverse Band Box Squat | squat | wyswietlana | a748f9e63acb | zgodne (figura v2: squat); |
| Reverse Band Deadlift | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); |
| Reverse Band Power Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Reverse Band Sumo Deadlift | hingeFloor | wyswietlana | 546c36e8b01b | zgodne (figura v2: hinge); |
| Reverse Grip Bench Press | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); |
| Rickshaw Deadlift | hingeFloor | wyswietlana | 2359888b8b37 | zgodne (figura v2: hinge); |
| Single Arm RDL (hantel/linka) | rdl | wyswietlana | 41f335bcb706 | zgodne (figura v2: hinge); |
| Single Leg RDL (hantel) | rdl | wyswietlana | 2097ba8dea72 | zgodne (figura v2: hinge); |
| Single Leg RDL (linki) | rdl | wyswietlana | 2097ba8dea72 | zgodne (figura v2: hinge); |
| Smith Machine Bench Press | bench | wyswietlana | 0d587fba1aaa | zgodne (figura v2: bench_press); bp.elbowsMid bez tekstu PL — ekran go pomija; dodanie tekstu zmieni skrót (nowa recenzja). |
| Smith Machine Close-Grip Bench Press | bench | wyswietlana | d21d1506d7ab | zgodne (figura v2: bench_press); |
| Smith Machine Decline Press | bench | wyswietlana | cd5b2598cc3d | zgodne (figura v2: bench_press); bp.elbowsMid bez tekstu PL — ekran go pomija; dodanie tekstu zmieni skrót (nowa recenzja). |
| Smith Machine Incline Press | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); |
| Smith Machine Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Smith Machine Stiff-Legged Deadlift | rdl | wyswietlana | 75d054771e9d | zgodne (figura v2: hinge); |
| Snatch Deadlift | hingeFloor | wyswietlana | da6e441d2361 | zgodne (figura v2: hinge); |
| Squat with Bands | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Squat with Chains | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
| Squeeze Press (hantle) | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); |
| Stiff-Legged Barbell Deadlift | rdl | wyswietlana | 75d054771e9d | zgodne (figura v2: hinge); |
| Sumo Deadlift (kettlebell) | hingeFloor | wyswietlana | 14d0fb5c349f | zgodne (figura v2: hinge); |
| Sumo Deadlift with Bands | hingeFloor | wyswietlana | 546c36e8b01b | zgodne (figura v2: hinge); |
| Sumo Deadlift with Chains | hingeFloor | wyswietlana | 546c36e8b01b | zgodne (figura v2: hinge); |
| Sumo Squat (hantel) | squat | wyswietlana | e1034221ea32 | zgodne (figura v2: squat); |
| Wide-Grip Barbell Bench Press | bench | wyswietlana | acd851225cdc | zgodne (figura v2: bench_press); |
| Zercher Squat | squat | wyswietlana | 9358e2eddadc | zgodne (figura v2: squat); |
