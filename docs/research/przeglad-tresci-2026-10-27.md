# Przegląd treści — naprawy M2, partia 3 (27.10.2026)

Rola 06-tresci (tryb fix), plan napraw M2: M1-audytor-generalny-020 (06-tresci-004, DEC-04 a) i M1-audytor-generalny-021 (06-tresci-002, 06-tresci-003, DEC-05 a).
Źródła otwarte w dniu pracy; cytat sprawdzony na surowym tekście (`curl` + usunięcie znaczników + wyszukanie frazy), najwyżej 1–2 zdania.
Źródła żyją tylko tutaj i w rejestrach w repo (`docs/research/rejestr-twierdzen.json`, `data/zrodla/`); aplikacja ich nie wymienia (decyzja właściciela 25.10.2026).

## T-041 — skala RIR: przedział 4–6 RIR (M1-audytor-generalny-020)

- Źródło: Helms i in. 2016, Strength Cond J 38(4):42–49, pełny tekst https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4961270/fullTextXML
  (= https://pmc.ncbi.nlm.nih.gov/articles/PMC4961270/), odczyt 2026-10-27, szczebel 3 (przegląd narracyjny autorów skali).
- Sekcja INTRODUCTION, opis skali z tabeli 1: „In addition, scores of 5–6 were grouped as 4–6 RIR as it is easier for athletes to give a range of RIR when RIR is greater than 3.”
- Sekcja INCORPORATING THE SCALE INTO PROGRAMMING: „Because the scale has subjective descriptors of effort for values below 5 (1–2 RPE = “little to no effort,” 3–4 RPE = “light effort”)” — opisy słowne dopiero poniżej RPE 5.
- Werdykt dla zachowania sprzed poprawki (RIR 6 → RPE 4 „lekko”): CZĘŚCIOWO — RIR 6 należy w skali do przedziału RPE 5–6, nie do „light effort”.
- Poprawka (DEC-04 a): wpis RIR 0–6; RIR do 5 = 10 − RIR; RIR powyżej 5 do 6 = RPE 5 (najniższe RPE przedziału 4–6 RIR); więcej niż 6 = „lekko” (RPE 4, górna granica „light effort”),
  w skali RIR pokazywane „7+”. Tekst T-041 (`RIR wpisujesz w zakresie 0–{max}; …`) bez zmiany brzmienia — liczby z parametrów `RIR_MAX = 6`, `RPE_LIGHT = 4`, `RPE_RIR_MIN = 5`
  (`lib/state/effort.ts`); para zdań (więcej niż 6 to „lekko”, bo poniżej RPE 5 skala opisuje wysiłek słowami) zgodna ze źródłem.
- Uproszczenie (nazwane w BRD RD-02): w obrębie przedziału 4–6 RIR źródło nie przypisuje dokładnego RPE; aplikacja zapisuje RIR 6 jako RPE 5, więc po zapisie wraca na ekran jako RIR 5.
  Dane zapisane wcześniej (RPE 4 z dawnego „6+”) się nie zmieniają; w skali RIR pokazują się teraz jako „7+”.
- Odrzucone: (B) zostawić RIR 6 → RPE 4 i nazwać to uproszczeniem w tekście — oznaczeń wagi w interfejsie nie używamy (decyzja 23.10.2026), a zachowanie przeczyłoby źródłu.

## Rejestr twierdzeń: teksty dziedzinowe bez wpisu (M1-audytor-generalny-021, 06-tresci-002)

Strażnik (`scripts/claims.mjs`) po decyzjach 23.10 i 25.10 rozpoznawał 0 tekstów — nowy tekst dziedzinowy przechodził bez wpisu. Od 27.10.2026 rozpoznaje też
słownictwo dziedziny (`DOMAIN_WORDS_RE`) i jawną listę kluczy (`DOMAIN_KEYS`); kandydaci bez twierdzenia mają w rejestrze wpis „bezTwierdzenia” z powodem.
Poniżej źródła nowych wpisów T-047–T-059. „Odczyt” = data otwarcia źródła i sprawdzenia cytatu na surowym tekście.

### Źródła przeczytane 27.10.2026

- **Z-A ACSM 2026** (Currier i in., MSSE 58(4), stanowisko — szczebel 2), https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12965823/fullTextXML:
  - tab. 6 (siła): „Frequency: ≥2 sessions/wk Intensity: ≥80% 1RM (dose-response) Type: Eccentric flywheel RT Technique: Full range of motion Volume: 2–3 sets/session Exercise order: Beginning of training session”;
  - tab. 6 (przerost): „Volume: ≥10 sets/wk (dose-response)”;
  - wysiłek: „completion of “near-failure” or a target of 2–3 repetitions in reserve (RIR)” oraz „While training to failure is not obligatory for optimizing results, there is insufficient evidence to quantify exact RIR and perceived exertion targets”;
  - przerost: „RT did not influence hypertrophy performed with low (1 d/wk) versus high (>5 d/wk) frequency when total volume was equated; low (30% 1RM) to high (100% 1RM) loads”;
  - tempo: przerost bez różnicy przy „fast (0.5 s) versus slow (8 s) repetitions”;
  - siła: „Strength is improved by RT, including circuit RT, elastic band RT, home-based RT, and velocity-based RT.”; „strength was enhanced by RT performed with higher frequency (≥2 d/wk, though the upper limit cannot, from our analysis, be undetermined), higher loads (dose-response)”;
  - częstotliwość a siła: „the impact is diminished when volume is equated”.
- **Z-B WHO 2020** (Bull i in., BJSM, PMC7719906 — szczebel 2), https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7719906/fullTextXML:
  „All adults should undertake 150–300 min of moderate-intensity, or 75–150 min of vigorous-intensity physical activity, or some equivalent combination of moderate-intensity and vigorous-intensity aerobic physical activity, per week.”
- **Z-C Sardeli i in. 2018** (Nutrients 10(4):423, przegląd systematyczny z metaanalizą — szczebel 2), https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5946208/fullTextXML:
  „RT reduced 93.5% of CR-induced LBM loss (0.819 kg [0.364 to 1.273]), with similar reduction in FBM and BM, compared with CR.” Zakres: osoby starsze z otyłością.
- **Z-D Physical Activity Guidelines for Americans, 2nd ed. 2018** (wytyczne urzędowe — szczebel 2), https://odphp.health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf, s. 61 PDF:
  „No specific amount of time is recommended for muscle strengthening, but muscle-strengthening exercises should be performed to the point at which it would be difficult to do another repetition.”
- **Z-E Schoenfeld, Ogborn, Krieger 2015** (Sports Med 45:577–585, przegląd systematyczny z metaanalizą — szczebel 2), streszczenie Europe PMC (PMID 25601394):
  „Results indicate that hypertrophic outcomes are similar when training with repetition durations ranging from 0.5 to 8 s.”
- **Z-F Stronger by Science, „How to Squat”** (serwis specjalistyczny — szczebel 4), https://www.strongerbyscience.com/how-to-squat/, sekcja „Foot Angle”:
  „In a “normal” squat for someone near the middle of the anatomical bell curve, that generally means having your toes pointed out 15-20 degrees – not straight ahead, but not turned out a ton.”

Nieotwarte 27.10.2026: NSCA *Basics of Strength and Conditioning Manual* 2012 (nsca.com, PDF — HTTP 403 dla narzędzi agenta); ACSM 2011 (Garber i in.) — odczyt badacza z 21.10.2026 (T-004) nie powtórzony.

### Wpisy

- **T-047** „Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio.” — Z-C (trening siłowy ogranicza utratę masy beztłuszczowej przy deficycie; uproszczenie: badania dotyczą starszych osób z otyłością, tekst mówi ogólnie), Z-B (umiarkowany wysiłek aerobowy); „jedna sesja” = konwencja (T-011).
- **T-048** „Redukcja: trening jak na masę (chroni mięśnie); sesja cardio w planie od {k} dni w tygodniu.” — jak T-047; próg {k} = reguła produktu (T-023, konwencja).
- **T-049** „Dzień po dniu te same główne partie: {list}. Zwykle lepiej z dniem przerwy; …” — to samo twierdzenie co T-004/T-022 (uproszczenie); druga część: Z-A „1 d/wk versus >5 d/wk … when total volume was equated”.
- **T-050** „Siła: bój główny na początku, {s} × {a}–{b} powtórzeń (ciężko, ok. {p}% maksimum i więcej), …” — Z-A tab. 6 (≥80% 1RM, 2–3 serie, początek sesji). Uproszczenie: zakres 4–6 powtórzeń przy ≥80% 1RM to wybór projektu; przelicznik %1RM ↔ powtórzenia nie sprawdzony dziś u źródła [OTWARTE — przelicznik %1RM ↔ powtórzenia, badacz].
- **T-051** „Masa: serie na partię w tygodniu do celu z Ustawień (automatycznie {m}), {a}–{b} powtórzeń …, zwykle {r1}–{r2} powtórzenia w zapasie.” — Z-A (≥10 serii/tydz.; 30–100% 1RM; blisko upadku albo 2–3 RIR); liczby powtórzeń = uproszczenie (jak T-008).
- **T-052** „Siła bez obciążenia zewnętrznego …: ciężkich serii (ok. {p}% maksimum) tu nie zrobisz … Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze.” — Z-A („elastic band RT, home-based RT” poprawiają siłę; „higher loads (dose-response)”).
- **T-053** „Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (RIR); do upadku nie trzeba.” — Z-A (2–3 RIR albo blisko upadku; upadek nieobowiązkowy); jak T-009.
- **T-054** „Palce stóp lekko na zewnątrz — zwykle mniej więcej 15–20°.” — Z-F (15–20° przy zwykłym rozstawie). Drugie źródło szczebla 4 z zapisu badacza 25.10 (NSCA Basics 2012, s. 49: „Point toes out slightly from neutral to 30°”) **nieotwarte** — zasada właściciela (25.10.2026) wymaga dla przedziału kąta 2 zgodnych źródeł szczebla 4. [OTWARTE — drugie źródło przedziału kąta stóp; krok: badacz z dostępem do PDF NSCA albo inne źródło szczebla 4 z liczbą]. Tekst w aplikacji bez zmiany do rozstrzygnięcia (polecenie M2: bez potwierdzenia — bez zmiany). **Aktualizacja 28.10.2026 (pętla 2, M1-audytor-generalny-021): potwierdzone** — drugie źródło szczebla 4 przeczytane: Squat University, „Toes Forward or Angled Out When You Squat?” (squatuniversity.com/2016/06/16/the-great-squat-debate-toes-forward-or-angled-out): „you should perform barbell squats with your feet turned out anywhere from 10-30 degrees”. Część wspólna z Z-F: 15–20° (uproszczenie; różnica w rejestrze). Tekst bez zmiany.
- **T-055** „Poniżej celu serii tygodniowo: {list}. Cel ustawisz w Ustawieniach (automatycznie dolny próg zalecany przy budowie masy); …” — Z-A („Volume: ≥10 sets/wk (dose-response)”); jak T-034.
- **T-056** „Najcięższy ciężar w miejscu dla boju głównego …: Ciężkie serie {a}–{b} powtórzeń (ok. {p}% maksimum) mogą być z nim za lekkie — … rób więcej powtórzeń, bliżej upadku. Siła też wtedy rośnie, ale zwykle mniej …” — Z-A (30–100% 1RM przy seriach blisko upadku; siła — „higher loads (dose-response)”); 4–6 powtórzeń jak T-050.
- **T-057** „Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze … Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika, a w sile maleje.” — Z-A („1 d/wk versus >5 d/wk … equated”; „the impact is diminished when volume is equated”); pełne zestawienie: docs/research/29-jeden-dzien-tygodniowo.md.
- **T-058** „Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne; do upadku nie trzeba.” — Z-D (s. 61), Z-A (upadek nieobowiązkowy); jak T-027.
- **T-059** „{faza} {n} s” (tempo faz animacji: 2 s opuszczanie, 1 s podnoszenie; `lib/figures/v2/anim.ts`) — Z-E i Z-A (podobny przerost przy czasie powtórzenia 0,5–8 s); konkretne 2 s / 1 s = konwencja ilustracji w tym przedziale.

### Kandydaci bez twierdzenia („bezTwierdzenia” w rejestrze)

Teksty, które wzorzec rozpoznaje, ale które nie uczą niczego z dziedziny: pomoc ekranu treningu (oznaczenie serii do upadku), podpowiedź miejsca na danych użytkownika
(„Zwykle w: …”), opis funkcji przesunięcia planu, etykieta liczby dni, opis reguł generatora (dni cardio — wartości produktowe z T-023/T-029) i suma minut z planu (rachunek).

## Źródła zestawów ogólnych i kąta stóp w repo (M1-audytor-generalny-021, 06-tresci-003)

- `data/zrodla/wskazowki-ogolne.json` — przeniesione 27.10.2026 z plików badacza z 25.10.2026 (gałąź przekazanie-konta, `docs/przekazanie/notatki/badania-figury/`:
  wskazowki-cwiczenia-01…08, wskazowki-slownik, wskazowki-slownik-uzupelnienie, katy-oddech): 177 id wskazówek z zestawów ogólnych → ćwiczenie w `data/zrodla/cues.json`
  ze źródłami albo ≥ 2 źródła { adres, miejsce } (miejsce z krótkim cytatem jak u badacza); 538 ćwiczeń z zestawem ogólnym → rodzina i plik badacza
  (z zapisem, dlaczego zestaw nie przeczy ruchowi, gdy badacz go zrobił); kąt stóp → źródła, część wspólna, sprawdzone sprzeczności i stan odczytu.
- Korekta przy przenoszeniu: `carry.noLean` — zapis badacza wskazywał „Farmer's Walk”, a wskazówka ze źródłami jest w `data/zrodla/cues.json` przy „Suitcase Carry”.
- Kontrola: `brakiZrodelOgolnych` w `scripts/zrodla-runtime.mjs` (część `check:zrodla-runtime`, w verify) i `tests/zrodla-pelne-wskazowki-ogolne.test.ts` — wyświetlane id bez wpisu źródła = błąd.
- Kąt stóp (T-054): źródło szczebla 4 przeczytane dziś jedno (Z-F); drugie (NSCA Basics 2012) nieotwarte — [OTWARTE], tekst bez zmiany do rozstrzygnięcia. 28.10.2026: potwierdzone drugim źródłem szczebla 4 (Squat University, 10–30°; wyżej przy T-054).
- Źródła wskazówek w tym pliku czytał badacz 25.10.2026 (część przez narzędzie streszczające stronę); 27.10.2026 nie otwierano ich ponownie poza Z-F.
