# STAN — grupa G3 „moc i dynamika” (fala W1), 02.11.2026

Koordynator grupy badań treści G3. Zakres: TYLKO zbieranie danych (polecenie właściciela 02.11.2026) — bez zmian w kodzie,
`data/zrodla/*.json`, `lib/**` i testach. Integruje koordynator linii 1.1. Gałąź `badania/g3-moc` od `integracja-1-1` (15abc58).

Rodziny: plyo, olympic, kb_ballistic, sled_throw, thruster — 92 ćwiczenia (`assignAll()`), z czego 3 miały już własne wskazówki
(Kettlebell Swing, Box Jump, Medicine Ball Slam) → 89 do badania. Statusy według szczebli z rozstrzygnięcia koordynatora linii 1.1
z 02.11.2026 (Breaking Muscle 5, free-exercise-db 5, producenci tylko dla własnego sprzętu, Physitrack nieliczony).

## Wskazówki techniki — `docs/research/wskazowki-fala-w1/`

| Rodzina | Plik(i) | Ćwiczeń | Gotowe | Częściowe | Otwarte | Uwagi |
|---|---|---|---|---|---|---|
| plyo | plyo-cz1.md, plyo-cz2.md | 27 | 5 (+1 warunkowo: Lateral Box Jump) | 4 | 17 | Physitrack uznany → Lateral Cone Hops gotowe, Single-Leg Lateral Hop częściowe (blok 2b w cz2); BFS → Front Cone Hops częściowe |
| olympic | olympic-clean.md, olympic-snatch.md, olympic-jerk.md | 25 | 17 (w tym Split Snatch warunkowo: IronMind) | 5 | 3 | otwarte: Clean Shrug, Rack Delivery, Snatch Shrug |
| kb_ballistic | kb_ballistic-cz1.md, kb_ballistic-cz2.md | 16 | 6 | 3 | 7 | Clean and Jerk jednorącz — „ta sama faza” (zdania zarzutu z cz1) do decyzji |
| sled_throw | sled_throw-sanki.md, sled_throw-rzuty.md | 18 | 1 (Wall Ball) | 6 | 11 | źródła szczebla 4 skąpe; kolejne przejścia dawały coraz mniej |
| thruster | thruster.md | 3 | 2 | 0 | 1 | Clean and Press — brak strony szczebla 4 |
| **Razem** | | **89** | **31 (+1 warunkowo)** | **18** | **39** | |

Nowe zdania: ok. 130 propozycji PL+EN łącznie (liczba z raportów badaczy, niepoliczona automatycznie; część warunkowa albo
wycofana po korekcie szczebli — wiążące są sekcje „Nowe zdania” i bloki JSON w plikach). Dumbbell Seated Box Jump: ustalenia
ACG-015 wykorzystane; ACG-015 liczył free-exercise-db jako drugie źródło — po rozstrzygnięciu 02.11 setup/move mają 1 źródło (plyo-cz2.md).

## Role mięśni — `docs/research/role-miesni-fala-w1/`

| Rodzina | Plik | Gotowe pary | Otwarte | Uwagi |
|---|---|---|---|---|
| olympic | olympic.md (reguły N1–N8, źródła S29–S35 + W1G3-S6…S11) | N3 front_delt (6 rwań), N4 upper_back (15 par), N7/N8 podrzut (3 pary), quads/glutes w podrzutach | Snatch Balance, Jerk Dip Squat, Sumo High Pull | N4 = dwa badania szczebla 3, jedno czytane w streszczeniu PubMed — do potwierdzenia |
| kb_ballistic | kb_ballistic.md | v_push quads/glutes (N1/N2), triceps C&J | front_delt/upper_back w rwaniu KB/hantlem | |
| thruster | thruster.md | N5/N6 front_delt + triceps (4 pary) | Clean and Press upper_back | Kettlebell Thruster dopisany z adnotacją (źródła o sztandze/hantlach) |
| plyo | plyo.md | 55 par (quads 19, glutes 18, calves 18) | ok. 26 par (skoki w bok/po skosie, odwodziciele/przywodziciele, dwugłowe w Butt Kick/Box Skip, Kneeling Jump Squat) | |
| sled_throw | sled_throw.md | Sled Push quads+calves, Wall Ball quads+glutes (4 pary) | sanie przodem/tyłem/na czworakach, TGU, nad głową, Spider Crawl, lats w rzutach leżąc | |

Wszystkie gotowe pary — na istniejących funkcjach (ustalone/dwa_zrodla) przez `nameRules` (jawne listy); reguł rodziny „other”
nie dodano (objęłyby niepowiązane ćwiczenia). Nowych funkcji brak. Numery źródeł S29–S35 i W1G3-S* do uzgodnienia przy scalaniu.

## Do decyzji koordynatora linii 1.1 (wysłane 02.11.2026 zbiorczo)

1. Szczeble: IronMind (rozbieżność: rwanie liczy warunkowo, zarzut nie), Torokhtiy (propozycja 5), Physitrack, NISMAT (propozycja 4),
   Performance Herts, karta NHS, Sussexsport (5), VHI (5), Freelap USA, magazyn Coach, ACE — przedruk w dziale prasowym (8250),
   WECKMETHOD, Dangerously Fit (granicznie kryterium c), BFS, EliteFTS (skok z klęku), Human Kinetics („Plyometric Anatomy”, fragment o zarzucie hantlem).
2. Reguła: czy wymóg standardu („łokieć zablokowany”) w drugim źródle liczy się jako drugie źródło błędu (TGU, KB Snatch, rwanie hantlem, Sled Push).
3. Uproszczenia „bazowy ruch” w wariantach olimpijskich (blok, zwis, power) i „ta sama faza” w KB Clean and Jerk; skok przodem jako drugie źródło dla Lateral Box Jump.
4. Role: Push Press i Push Press - Behind the Neck (spoza G3) dopisane do N1; brak fazy („gdy się wybijasz”) w nameRules wymaga zmiany kodu (decyzja właściciela).

## Sygnały o błędach w danych i zestawach ogólnych (szczegóły w „Otwarte” plików)

- Jerk Dip Squat: zestaw ogólny ma `pp.legs` (wybicie), a w tym ćwiczeniu wybicia nie ma (2 źródła) — rekomendacja badacza: usunąć (wysoka waga — błędne twierdzenie w aplikacji).
- `oly.back`, `oly.mis` — bez potwierdzenia w przeczytanych źródłach zarzutu i rwania; `pp.dip` („tułów napięty”) vs źródła „tułów pionowo”.
- `tgu.arm` mówi o kettlebellu (katalog dopuszcza hantel); `mis.jerk` w TGU bez 2 źródeł; `tgu.eyes` — sprzeczność źródeł, propozycja `tgu.eyesLow`.
- Swing jednorącz: zestaw ogólny ma źródła tylko dla oburącz; Sumo High Pull używa zdań o sztandze; Sled Drag (Harness) `sled.lean`/`sled.legs` — 1 źródło.
- Wall Ball: widok z przodu (`lib/figures/v2/families.ts`) uzasadniony błędem „kolana do środka”, którego żadne z 3 źródeł nie podaje.
- Medicine Ball Slam (istniejący wpis): Coach 2021 przeczy opisowi ACE o pochyleniu w biodrach — do przejrzenia przy recenzji rodziny.
- Katalog: Kettlebell Thruster ma `equipment: "hantle"`/`per_dumbbell`; Depth Jump w katalogu = wskok na drugą skrzynię, źródła = wyskok z podłogi;
  Bench Jump — przeskok czy wskok (definicja niejasna); Muscle Snatch upper_back i One-Arm KB C&J front_delt jako główne — źródła przeczą.
- `muscleLoadOf` (`lib/seed.ts`) pomija regiony ≥ 0,5 przy pustych `muscles`/`secondaryMuscles` → Medicine Ball Slam i 6 innych rzutów bez wierszy mięśni.

## Zostało (następne kroki — sekcje „Stan” w każdym pliku)

- plyo: 7 ćwiczeń cz2 bez żadnego źródła szczebla 4; drugie źródła dla Lateral Bound, Star Jump, Single Leg Push-Off, Side to Side Box Shuffle; błąd Depth Jump; trop: rozdział o pliometrii w podręczniku NSCA (szczebel 3).
- olympic: Rack Delivery, Clean Shrug, Snatch Shrug, wykrok Split Clean, błędy Jerk Balance i Snatch Balance.
- kb_ballistic: 6 otwartych w cz1, błędy podrzutu, Split Jerk.
- sled_throw: 5 ćwiczeń sanek bez źródeł; błędy rzutów; wersje jednorącz (bez źródeł spoza aplikacji).
- role: skoki w bok/po skosie, sanie, TGU, rwania KB/hantlem.

Pułapki: ExRx 403, web.archive.org zablokowane, nsca.com 403, educ.jmu.edu i bib-bvb.de poza siecią sesji; PDF-y jako obrazy stron są kosztowne w kontekście.

## Commity i weryfikacja

Commity lokalne na `badania/g3-moc` (od 0567769 do b977d72, sam katalog docs/research). Wynik verify bazy i SHA wypchnięcia — niżej.
