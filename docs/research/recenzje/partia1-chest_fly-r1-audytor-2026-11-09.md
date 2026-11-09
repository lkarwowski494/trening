# Recenzja niezależna rodziny figur v2 `chest_fly` — runda r1 (partia 1, linia 1.1), 09.11.2026

Recenzent: audytor (L-047; nie pisał tej rodziny). Autor: programista partii 1 (gałąź `figury/partia-1-chest`, SHA `0b390518`).

## Werdykt rodziny: **do poprawy**

- KRYTYCZNE 0, **WYSOKIE 3**, ŚREDNIE 3, NISKIE 2.
- Ćwiczenia „do poprawy”: Band Chest Fly (W1), Crucifix (W2), Wide-Grip Decline Barbell Pullover (W3). Pozostałe 14 ćwiczeń z rysunkiem bez WYSOKICH.
- Ścieżka jak w calf_raise r1→r2: poprawka danych/UI trzech ćwiczeń albo ich wstrzymanie (`V2_WSTRZYMANE`, decyzja koordynatora) i r2 dla pozostałych 14.
- Wpis `v2.chest_fly` w JSON: werdykt „do poprawy”, **bez `sha`**. K10 (v1 → „zastapiona”) nie dotyczy, bo werdykt to nie „wyswietlana”.

## Metoda

- Czysta kopia: `git archive 0b390518` → `/home/user/rev-p1/chest_fly-r1` (z dowiązanym `node_modules`). W `/home/user/trening` nic nie zmieniałem.
- Arkusze śladu (K4): `arkusz-slad.mjs` dla wszystkich 17 ćwiczeń × 2 widoki (top, side), czyli 34 arkusze, 21 kadrów co 0,05, motyw jasny: `arkusze/slad/`.
  - Motyw ciemny dla 4 ćwiczeń (Chest Fly (hantle), Pec Deck, Cable Fly, Pullover (hantel)) × 2 widoki, czyli 8 arkuszy: `arkusze/slad-dark/`.
  - Kadry kluczowe u = 0 / 0,5 / 1 w pełnej rozdzielczości (1100 px, oba widoki na jednym obrazie, 17 plików): `arkusze/ex/*.png`.
  - Narzędzie do kadrów: kopia `arkusz-slad.mjs` z parametrem `--u` (`scripts/figures/kadry-rev.mjs` tylko w kopii).
- Nakładka: `arkusz-nakladka.mjs --family chest_fly`, 34 arkusze w `arkusze/nakladka/`. Obejrzane w pełnej rozdzielczości: Chest Fly (hantle) top.
- Liczby z `frameAt` / `jointAngles` / `equipColliders` / `gap` (u co 0,1): `/home/user/rev-p1/tools/dump.txt` (skrypt `tools/dump.mjs`). Fazy i statyczność: `tools/cru.mjs`, rekwizyty: `tools/pec.mjs`.
- Testy (K14): `git diff 233c0f25..0b390518 -- tests/`, część dotycząca chest_fly.
- `sha` z `node scripts/zrodla-runtime.mjs --skroty` w kopii (`tools/skroty.json`).

## Znaleziska

| ID | Poziom | Pewność | Realność | Ćwiczenie / widok / u | Miara / dowód | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | realny | Band Chest Fly / top i side / wszystkie u | Guma ma jeden zaczep `x −60, y 138, z 0` (60 cm za plecami, w osi ciała, na wysokości barków) i dwa odcinki do dłoni. W rzucie z góry przy u = 0,5 i 1 oba odcinki przechodzą przez tułów i głowę, w rzucie z boku przez tułów na wysokości barków (`arkusze/ex/Band-Chest-Fly.png`; rekwizyty `band from [-60,138,0] to [45.1,139.5,±63.7]` przy u = 0,5). Autor sam zgłosił, że ćwiczenie jest poza miarą `stykKlatki`. Ten sam typ wady co W2 w calf_raise r1 (pręt przez stopę), oceniony tam jako WYSOKIE. | Zaczep po każdej stronie albo za plecami szerzej niż barki (np. `z ±60–80`), tak żeby guma biegła obok ramion. Do testu rodziny dodać miarę przecięcia odcinka gumy z tułowiem ≥ −1 cm (K7) z przypadkiem negatywnym na obecnych danych. |
| W2 | WYSOKIE | 90% | realny | Crucifix / oba widoki / całe nagranie | Ćwiczenie to utrzymanie: katalog `weight_time` (`lib/catalog.generated.ts:1776`), figury-sens „utrzymanie ramion w bok”, poza nieruchoma (chwyty `0, 145,2, ±82,5` i shElev 90° we wszystkich u). Mimo to `spec.static === false`, bo Crucifix nie jest w `ISOMETRIC` (`lib/figures/v2/poseData.ts:131`; test `tests/figures-v2-data.test.tsx:71` łączy ISOMETRIC tylko z pomiarem `time`, nie z `weight_time`). Skutki w `components/ExerciseFigureV2.tsx:119-123` i `:90`: pod nieruchomym rysunkiem wiersz faz „Unoszenie 1 s · Pauza · Opuszczanie 2 s” z podświetlaniem w pętli i przycisk „Zatrzymaj animację”. Przy ograniczonym ruchu widać dwa identyczne kadry „Pozycja wyjściowa / Pozycja końcowa”. Wynik `phasesFor`: `[Unoszenie 1000, Pauza 500, Opuszczanie 2000, Pauza 500]`. Aplikacja każe więc unosić i opuszczać w tempie 1 s / 2 s ćwiczenie, które jest utrzymaniem na czas — to błędna instrukcja. | Crucifix do `ISOMETRIC` (jedna pozycja, bez faz i pauzy). Test data:71 rozszerzyć na `weight_time` albo dodać jawny wyjątek z datą. Przypadek negatywny: Crucifix bez flagi static oblewa test. |
| W3 | WYSOKIE | 85% | realny | Wide-Grip Decline Barbell Pullover / top / wszystkie u | Chwyty `z ±19` (38 cm, rozstaw barków). To ta sama szerokość co w Front Raise And Pullover i Bent-Arm Barbell Pullover: generator `pull(... lat: 0)`, `scripts/figures/agent-pozy/chest_fly.mjs:78`. Na rzucie z góry dłonie są tuż przy barkach (`arkusze/ex/Wide-Grip-Decline-Barbell-Pullover.png`). Rysunek nie pokazuje cechy, która wyróżnia ten wariant — szerokiego chwytu — więc pokazuje inne ćwiczenie niż w nazwie. | Chwyt wyraźnie szerszy niż barki (np. `z ±30–35`, z `lat` w generatorze), sprawdzić ślad na środku gryfu. Test: rozstaw chwytów w Wide-Grip > rozstaw barków + 15 cm, przypadek negatywny na obecnych danych. |
| S1 | ŚREDNIE | 90% | realny | Pec Deck / top i side / wszystkie u | Jest tylko jedna dźwignia (`dzwignia ... trzyma: "R"`, rekwizyt `pivot from [14,88.8,19]`). Lewa dłoń trzyma powietrze (`arkusze/ex/Pec-Deck.png`, rzut z góry). Prawa dźwignia jako ukośny pręt od punktu 15 cm pod barkiem do dłoni jest czytelna jako ramię maszyny (pytanie autora b). Precedens: delt_raise Ś-4 „druga dźwignia”. | Druga dźwignia `trzyma: "L"` (lustrzany punkt obrotu), tak jak w poprawce delt_raise. Sprawdzić po wejściu 55c9f206. |
| S2 | ŚREDNIE | 85% | realny | Chest Fly (hantle), Incline Chest Fly (hantle) / top (nakładka `flyArmArc`) / u 0–0,95 | Ramię porusza się w płaszczyźnie prostopadłej do tułowia (`x` chwytu stałe −50, shElev 90° stałe). W rzucie z góry ta płaszczyzna jest krawędzią. Łuk ramię–tułów pokazuje przez cały ruch ok. 90° (ćwiartka koła), choć podpis kadru mówi shAbd 90° → 2°, a potem łuk znika. Z kartą nie jest sprzeczny (ramię naprawdę stoi pod kątem prostym do osi ciała), ale nie pokazuje reguły `luk_dloni` (zbliżanie dłoni). To artefakt rzutu poprzecznego — ten sam rodzaj wady co Ś-1 w nakładce delt_raise (`docs/research/recenzje/delt-raise-nakladka-audytor-2026-11-09.md:59`). Dowód: `arkusze/nakladka/Chest-Fly-hantle-top.png`. | Usunąć łuk z rzutu z góry albo rysować go w płaszczyźnie ruchu (rzut od głowy nie istnieje w `views`). Rozważyć strzałkę/łuk drogi dłoni zamiast kąta. Rodzina wtedy bez elementu nakładki, z zapisanym powodem. |
| S3 | ŚREDNIE | 90% | realny | Cable Fly / side i top / u 0 i 1 | Karta własna (K11 spójność) przeczy rysunkowi w trzech punktach. (1) `cfly.setup` „bloczki mniej więcej na wysokości barków” — bloczek ma `y 160`, chwyt przy ramieniu poziomym `y 139,5`, czyli ok. 20 cm wyżej, na wysokości głowy. (2) `cfly.move` „złącz dłonie przed klatką” — przy u = 1 chwyty `z ±17,6` (35 cm między środkami, wyraźna przerwa na rzucie z góry). (3) `fly.posture` „lekkie pochylenie w przód” — `pochylenieTulowia` 0 we wszystkich klatkach, sylwetka pionowa (`arkusze/ex/Cable-Fly.png`). | Bloczek `y ≈ 140`, końcowy kąt ramienia mniejszy (dłonie ≤ ok. 10 cm od siebie), pochylenie tułowia ok. 10–15° w przód. Ta sama uwaga o pochyleniu dotyczy wariantów high-to-low i low-to-high, ale one mają zestaw ogólny bez `fly.posture`, więc tam bez sprzeczności. |
| N1 | NISKIE | 90% | teoretyczny (test) | — / `tests/figures-v2-tor.test.ts` | chest_fly w `LUKOWE` z jednym progiem 46 cm dla wszystkich ćwiczeń i widoków (`PROG_LUK_RODZINY.chest_fly`). Próg policzono z najgorszego pullovera (Δθ ≈ 140°). Dla rozpiętek leżąc, w rzucie, w którym łuku nie widać (top), idealne odchylenie to kilka cm, więc zły tor do ~46 cm przejdzie. Gotowy pomocnik `progLukuRamienia` (r3-Ś1) liczy próg na widok i używa go tylko delt_raise (`tests/figures-v2-tor.test.ts:37`). Wymóg K5: próg z geometrii rodziny. | `progLuku` dla chest_fly przez `progLukuRamienia(dane, widok)` i przypadek negatywny. |
| N2 | NISKIE | 82% | realny | Front Raise And Pullover / zestaw `pullover` / u = 1 | `po.slow` mówi „…tak samo powoli wracaj nad klatkę”. Rysunek (i opis ćwiczenia) wraca do ud: u = 1 gryf `x 4,1, y 87,2`, shElev 28,8°. Nad klatką gryf jest tylko w połowie drogi (u ≈ 0,5). Zdanie nie jest fałszywe, ale niepełne wobec ruchu. | Przy tym ćwiczeniu zestaw bez `po.slow` (`CUE_NOT_IN_FAMILY`) albo wariant zdania „wracaj nad uda”. |

## Odpowiedzi na pytania autora

- (a) u = 0 rozpiętki leżąc: ramię poziomo, hantle na wysokości barków (chwyt `y 61,2` przy barku ~61). Zgodne z regułą `dol_na_wysokosci_barkow` (jedno źródło, „na poziomie barków lub klatki”). Bez uwag.
- (b) Pec Deck: dźwignia jako ukośny pręt jest czytelna jako ramię maszyny, w ciemnym motywie też (`arkusze/slad-dark/Pec-Deck-*.png`). Brakuje drugiej dźwigni (S1). Uwaga dodatkowa, bez znaleziska: figury-sens opisuje pec deck z łokciami na poduszkach, a rysunek pokazuje wersję z uchwytami i prostymi rękami. Zestaw (`fly.control`, `mcp.blades`) nie mówi o łokciach, więc nie ma sprzeczności tekstu.
- (c) Cable Fly stojąc: bloczki są po bokach (`z ±105`) i lekko z tyłu (`x −15`) — to poprawne ustawienie w bramie wyciągu, nie „za plecami”. Wysokość 160 przeczy karcie (S3).
- (d) Crucifix, widok „top” u osoby stojącej: czytelny (ramiona w bok widać w całej długości). Widok z przodu byłby lepszy, ale silnik bierze widoki rodziny — bez znaleziska. Właściwy problem Crucifix to W2.
- (e) Band Chest Fly poza miarą styku: wada widoczna, WYSOKIE (W1).

## Sprawdzone bez znalezisk

- **Ślad toru (K4):** we wszystkich 34 arkuszach ślad leży w chwycie R. Przy jednym przedmiocie (pullover hantlem, sztanga) w środku między chwytami: `trail` = `(R+L)/2`, z = 0. Przy jednej ręce (One-Arm, Single Arm) w chwycie R. Nie widać skoków między kadrami co 0,05.
- **Styki (K7):** najmniejsza szczelina ciało–ławka/oparcie wynosi −0,5 cm (Pec Deck), dla reszty −0,1 do 0,7 cm. `checkFrame` bez uwag. Głowa na ławce (środek głowy `x −72`, koniec ławki `−75`), więc `bp.contact` przy Chest Fly (hantle) jest zgodne z rysunkiem.
- **Zakres stawów (K8):**
  - łokieć w rozpiętkach 11,9–20,3°, zmiana ≤ 8°: zgodne z `fly.elbows` / `lokiec_staly` (≤ 40°, zmiana ≤ 12°);
  - pullover: łokieć 6,5–15° (`po.arms`, próg ≤ 25°), Bent-Arm stale ok. 50°;
  - rozpiętki leżąc: shAbd 90° → 2° (ramię pionowo nad klatką);
  - pullover (hantel): shElev 163° → 60° (koniec nad dolną częścią klatki).
- **Orientacja sprzętu (K6):**
  - hantle w rozpiętkach osią wzdłuż ciała (`axis [1,0,0]`, chwyt neutralny);
  - pullover: hantel pionowo, chwyt za talerz;
  - Crucifix: oś hantla przód–tył z odchyleniem 24° (chwyt nachwytem, akceptowalne);
  - talerze na końcach gryfu;
  - wyciągi: linki od bloczka do uchwytu, bloczki w miejscu właściwym dla wariantu (nisko przy ławce, wysoko w high-to-low, nisko w low-to-high, środek w Single Arm);
  - wolna ręka w Single Arm na biodrze. Wolna ręka w One-Arm Flat Bench odstawiona w bok nad podłogą — nietypowo, ale bez wpływu na ruch (pewność < 80%, bez znaleziska).
- **Ławki:** skos 55° i ujemna −20° z wałkami na nogi — poprawnie. Nogi na podłodze.
- **Fazy / tempo (K15):** `DATA_UI.chest_fly` — Unoszenie/Opuszczanie, `lowerFirst: false`. u = 0 to ramiona szeroko albo ciężar za głową, więc 0 → 1 to faza koncentryczna (1 s), powrót 2 s — kierunek zgodny. Nazwy faz to istniejące teksty („Unoszenie”, „Opuszczanie”, jak w delt_raise). Wyjątek: Crucifix (W2).
- **Błędy animowane:** rodzina nie ma póz błędów (`bledy: []`). `mis.jerk` i `plank.mis.breath` w `bledy_bez_animacji` — `JERK_TEMPO_RODZINY` rozszerzone o chest_fly z przypadkiem negatywnym (`fly.elbows` → false).
- **Nakładka:** `flyArmArc` tylko z reguły `luk_dloni` („ustalone”) i tylko przy kartach z `dfly.move`/`cfly.move`. Reguły „jedno źródło” (`dol_na_wysokosci_barkow`, `pullover_ramie`) bez elementu — poprawnie. Jedyna uwaga to S2.
- **Zestawy ogólne (K12):**
  - `fly` (`fly.elbows`, `fly.control`, `mis.jerk`) przy 8 ćwiczeniach — zgodne z ruchem (łokieć stały ok. 13–20°);
  - Pec Deck (`fly.control`, `mcp.blades`) — zgodny, plecy przy oparciu (szczelina −0,5 cm);
  - Crucifix `raiseSide` (`lat.height`, `front.elbows`, `plank.mis.breath`) — zgodny z utrzymaniem na wysokości barków (shElev 90°, łokieć 10°);
  - `pullover` przy Pullover (hantel) i Wide-Grip zgodny, przy Front Raise And Pullover patrz N2;
  - Bent-Arm (`po.slow`, bez `po.arms`) — poprawnie pominięte `po.arms` przy zgiętych łokciach.
- **Karty własne (K11):** Chest Fly (hantle), Incline Chest Fly (hantle) i Cable Fly mają wpisy „karty”, więc K11 jest spełnione.
  - Spójność z rysunkiem v2: Chest Fly i Incline — `dfly.setup` / `dfly.move` / `fly.elbows` / `bp.contact` / `fly.mis.elbows` zgodne;
  - Cable Fly — S3.
- **Testy (K14), część chest_fly w diffie `233c0f25..0b390518`:**
  - `figures-v2-data` — wyjątek pudełka Crucifix top (uzasadniony, osoba stojąca z góry ma ok. 30 cm głębokości) oraz warunek kierunku z wyjątkiem „kąt stały” dla Crucifix. Uzasadniony, ale utrwala W2: test przyjmuje utrzymanie jako ruch z fazami;
  - `figures-v2-tor` — próg 46 cm, patrz N1;
  - `figures-v2-nakladka-fix4` — `JERK_TEMPO_RODZINY` + chest_fly z negatywem (uzasadnione);
  - `hasTechnique` Pec Deck → Sissy Squat (uzasadnione: rodzina gotowa);
  - `strona-eksport` 183 → 200 (wynika z włączenia rodziny);
  - `skrot-v2-*` przepięte na leg_isolation (uzasadnione).
  - Nie widzę innych poluzowań oczekiwań dotyczących tej rodziny.

## Tabela ćwiczeń

| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Chest Fly (hantle) | wyswietlana | ruch i ślad poprawne; nakładka S2 (backlog) |
| Incline Chest Fly (hantle) | wyswietlana | skos 55°, ramię pionowo na końcu; S2 |
| Decline Dumbbell Fly | wyswietlana | wałki na nogi, szczelina 0,7 cm |
| One-Arm Flat Bench Dumbbell Fly | wyswietlana | ślad R; wolna ręka odstawiona (bez znaleziska) |
| Flat Bench Cable Fly | wyswietlana | niskie bloczki po bokach ławki |
| Incline Cable Fly | wyswietlana | jw. na skosie |
| Cable Fly | wyswietlana | S3 (karta a rysunek), backlog |
| Cable Fly (high to low) | wyswietlana | bloczek 185, dłonie kończą na 107,6 (przed dolną częścią klatki) |
| Cable Fly (low to high) | wyswietlana | bloczek 15, tor w górę 121 → 170 |
| Single Arm Cable Fly | wyswietlana | jedna linka, wolna ręka na biodrze |
| Band Chest Fly | do poprawy | W1 |
| Pec Deck | wyswietlana | S1 (druga dźwignia), backlog |
| Crucifix | do poprawy | W2 |
| Pullover (hantel) | wyswietlana | hantel pionowo, za głowę i nad klatkę |
| Front Raise And Pullover | wyswietlana | N2 (zestaw) |
| Wide-Grip Decline Barbell Pullover | do poprawy | W3 |
| Bent-Arm Barbell Pullover | wyswietlana | łokieć ok. 50° stale |

Bez rysunku (3): Around The Worlds, Machine Pullover, Svend Press — WYJATKI w generatorze (brak źródła ruchu). `liczba` = 20 (z `assignAll()`).
