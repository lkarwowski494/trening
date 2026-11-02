# STAN — grupa G3 „moc i dynamika” (fala W1), 02.11.2026

Koordynator grupy badań treści G3. Zakres: TYLKO zbieranie danych (polecenie właściciela 02.11.2026) — bez zmian w kodzie,
`data/zrodla/*.json`, `lib/**` i testach. Integruje koordynator linii 1.1. Gałąź `badania/g3-moc` od `integracja-1-1` (15abc58).

Rodziny: plyo, olympic, kb_ballistic, sled_throw, thruster — 92 ćwiczenia (`assignAll()`), z czego 3 miały już własne wskazówki
(Kettlebell Swing, Box Jump, Medicine Ball Slam) → 89 do badania. Statusy według szczebli z rozstrzygnięcia koordynatora linii 1.1
z 02.11.2026 (Breaking Muscle 5, free-exercise-db 5, producenci tylko dla własnego sprzętu, Physitrack nieliczony).

## Przeliczenie szczebli 02.11.2026 (uzupełnienia 1–3) — CZĘŚCIOWE

Kryterium karty (decyzje 02.11.2026): zdanie gotowe = ≥ 2 niezależne organizacje szczebla ≤ 4, przeczytane; karta własna = min. 1 zdanie
ustawienia + 1 zdanie ruchu; „z błędami” = + min. 1 błąd; bez ruchu albo bez ustawienia = otwarta. W każdym przeliczonym pliku: sekcja
„Korekta szczebli — przeliczenie koordynatora 02.11.2026” i „### Blok do wdrożenia (po przeliczeniu 02.11.2026)”; starsze bloki oznaczone „NIEAKTUALNY”.

| Rodzina (pliki) | Badane | Własne z błędami | Własne bez błędów | Otwarte | Nowe zdania w bloku | Stan przeliczenia |
|---|---|---|---|---|---|---|
| thruster (thruster.md) | 3 | 2 | 0 | 1 | 5 (+ istniejące `sq.down`, `sq.back`, `sq.mis.heels`, `ohp.tall`) | **zrobione** |
| kb_ballistic (cz1 + cz2) | 16 | 0 | 4 | 12 | 12 (cz1: 6, cz2: 6) | **zrobione** |
| olympic (clean, snatch, jerk) | 25 | 21 | 1 | 3 | 41 (clean 11, snatch 18, jerk 12; + istniejące `oly.close`, `oly.legs`, `mis.barAway`, `pp.legs`) | **zrobione** (szczegóły na końcu pliku) |
| plyo (cz1, cz2) | 27 | — | — | — | — | **zostało** |
| sled_throw (sanki, rzuty) | 18 | — | — | — | — | **zostało** |

Zmiany względem poprzedniej tabeli (wiersze przeliczone):
- thruster: bez zmian (2 gotowe → 2 własne z błędami; Clean and Press otwarte). Experience Life liczy się: autorka z „RKC” w biogramie, data 19.06.2024 (WebFetch).
- kb_ballistic cz1: Kettlebell Clean gotowe → otwarta (Onnit 5 → brak ustawienia); Kettlebell Snatch gotowe → otwarta (Onnit 5, ACE 8250 nieliczony → brak ustawienia i ruchu);
  Snatch (hantel) gotowe → własna bez błędów (`kbb.dbMisArmPull` — przyczyna, nie zaprzeczenie standardu); Double Kettlebell Clean częściowe → własna bez błędów.
  Klucz „Snatch” w bloku poprawiony na „Snatch (hantel)” (`lib/catalog.generated.ts:251`).
- kb_ballistic cz2: oba Push Press gotowe → otwarte (Dangerously Fit bez rozstrzygnięcia → `kbb.rackStart` 1 źródło); oba Jerk częściowe → własne bez błędów
  (bez `kbb.lower`); Clean and Jerk gotowe → otwarta (`kbb.cleanSetup` 1 źródło); Split Jerk bez zmian. Usunięty adres strony aplikacji treningowej z tabeli źródeł.
- Razem kb_ballistic: przed 6 gotowe / 3 częściowe / 7 otwarte → po 0 / 4 / 12.

Zostało do przeliczenia (następna sesja, od tego pliku):
1. olympic-clean.md — Experience Life/Life Time w błędach Power/Hang/Block/Split Clean (sprawdzić autora każdej strony WebFetch-em: wymagane kwalifikacje trenerskie w biogramie);
   IronMind blok (olympic-clean.md:235) → 4 przy autorze z kwalifikacjami: przywrócić `olympic.splitCatch`, `olympic.blockStart`, `olympic.shrugTop` (Split Clean, Block Clean, Clean Shrug);
   Human Kinetics (fragment o zarzucie hantlem) wg autora.
2. olympic-snatch.md — IronMind (Split Snatch, :26) → 4 przy autorze (Schmitz — tak, wg STAN niżej, sprawdzić stronę); Torokhtiy → warunkowo 4 (powrót z nożyc).
3. olympic-jerk.md — przejrzeć źródła wg uzupełnień 2–3 (Coach, ACE 8250 nie dotyczy).
4. plyo-cz1.md — Prehab Guys (Lateral Box Jump, Broad Jump, :37) → 4 tylko artykuł z autorem z kwalifikacjami (WebFetch); NISMAT → 4, Performance Herts/Sussexsport/VHI → 5, karta NHS → 4; Torokhtiy (Weighted Jump Squat).
5. plyo-cz2.md — Physitrack = 5 (:140, blok 2b odrzucony — Lateral Cone Hops, Single-Leg Lateral Hop); BFS, EliteFTS, Human Kinetics „Plyometric Anatomy” (nie liczy się).
6. sled_throw (sanki, rzuty) — Freelap USA, Coach → warunkowo 4 (biogram autora): `mbcp.mis.elbows`, `wb.catch`; WECKMETHOD 5; reguła „błąd = zaprzeczenie standardu” (`tgu.mis.bentArm` liczy się; Sled Push „zginanie łokci” nie).
7. Role mięśni (`role-miesni-fala-w1/`) — przeliczyć tylko pliki oparte na źródłach z listy 5 (Onnit, Physitrack, free-exercise-db, fit-pro.com, Dynamo, sprzedawcy); nie sprawdzone w tej sesji.
8. Na końcu: tabela łączna (wszystkie rodziny) w tym pliku.

Do decyzji koordynatora (nowe z przeliczenia): Dangerously Fit Academy (kb_ballistic-cz2) — brak w `szczeble-organizacji-2026-11-02.md`; RKC jako kwalifikacja trenerska
autorki Experience Life (thruster); ACE 8250 — przedruk dziennikarki z cytowaną trenerką z certyfikatem ACE (kb_ballistic-cz1).

## Wskazówki techniki — `docs/research/wskazowki-fala-w1/` (tabela sprzed przeliczenia 02.11.2026 — dla plyo, olympic, sled_throw nadal jedyna)

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

## Odpowiedzi koordynatora linii 1.1 (02.11.2026 ~07:55 PL) — zastosowane w thruster i kb_ballistic (przeliczenie 02.11.2026); pozostałe rodziny — patrz „Zostało do przeliczenia”

Źródło: wiadomość koordynatora (trafi do `docs/research/szczeble-organizacji-2026-11-02.md` na `badania/lokalne-0211`). Zastosować przy
integracji albo w następnej sesji G3 (limit kontekstu tej sesji). Spodziewane skutki:
1. IronMind → 4 przy autorze o sprawdzalnych kwalifikacjach (Schmitz — tak). Skutek: Split Snatch gotowe bez warunku; w olympic-clean.md
   wracają `olympic.splitCatch`, `olympic.blockStart`, `olympic.shrugTop` (blok 2b) — przeliczyć Split Clean, Block Clean, Clean Shrug.
2. Torokhtiy → warunkowo 4 dla artykułów techniki z autorem; strony sklepu/programów — nie źródło. Przejrzeć wycofane wpisy (rwanie: powrót z nożyc; plyo: Weighted Jump Squat).
3. Physitrack → 5 (potwierdza obecne liczenie; blok 2b w plyo-cz2.md odrzucony).
4. NISMAT → 4 (Lateral Cone Hops: ruch). 5. Performance Herts, Sussexsport, VHI → 5; karta fizjoterapii trustu NHS → 4 (plyo: przeliczyć).
6. Freelap USA, Coach → warunkowo 4 (autor z kwalifikacjami w biogramie + redakcja) — sprawdzić biogramy; zależą `mbcp.mis.elbows`, `wb.catch`.
   ACE 8250 → 4, gdy tekst ACE/eksperta ACE (zależy `kbb.lockout`); WECKMETHOD → 5.
7. Human Kinetics wg autora; „Plyometric Anatomy” nie liczy się do sprawdzenia biogramów; fragment trenera z kwalifikacjami → 4 (Dumbbell Clean).
8. Drugie źródło błędu ze standardu — tylko gdy błąd jest bezpośrednim zaprzeczeniem standardu (ta sama część ciała i kryterium);
   oznaczać „błąd = zaprzeczenie standardu”. Skutek: `tgu.mis.bentArm` (łokieć ugięty vs zablokowany) — liczy się; `kbb.mis.armPull`,
   `kbb.dbMisArmPull` („siła z nóg i bioder”) — nie (przyczyna, nie zaprzeczenie); Sled Push „zginanie łokci” — źródła sobie przeczą, nie liczy się.
Dodatkowo: książki NSCA = 3; kilka publikacji tej samej organizacji = jedno źródło (sprawdzić m.in. Catalyst: artykuły + wideo + Performance Menu
w olympic-snatch.md liczone jako jedna organizacja — tak już jest). Sygnały o zestawach ogólnych i danych katalogu przejmuje koordynator linii 1.1.

### Uzupełnienie 3 (koordynator linii 1.1, 02.11.2026) — też do zastosowania przy integracji
- Sama deklaracja recenzji w polityce serwisu nie daje 4 — liczy się strona z autorem z kwalifikacjami i datą (przy recenzji — nazwany recenzent).
- **Onnit → 5.** Skutek w kb_ballistic-cz1.md: `kbb.cleanSetup` (Onnit + BarBend) i inne zdania z Onnit jako jednym z dwóch źródeł — przeliczyć;
  Kettlebell Clean/Snatch i zdania zarzutu użyte w One-Arm KB Clean and Jerk (kb_ballistic-cz2.md) mogą spaść do „częściowe”.
  (Zastosowane 02.11.2026 — patrz tabela przeliczenia wyżej.)
- Eleiko: warunkowo 4 tylko dział edukacji; Experience Life: 4 tylko autor z kwalifikacjami trenerskimi (olympic-clean.md — sprawdzić per strona).
- Kopie instrukcji (ManualsLib) — liczy się tylko dokument producenta o zgodnym numerze/wersji; Inspire, Mikolo, fit-pro.com — wg reguły.
- OTWARTE (nie liczą się): Men's Health, Muscle & Strength, Garage Gym Reviews.

## Zostało (następne kroki — sekcje „Stan” w każdym pliku)

- Najpierw: dokończyć przeliczenie szczebli (lista „Zostało do przeliczenia” wyżej).
- plyo: 7 ćwiczeń cz2 bez żadnego źródła szczebla 4; drugie źródła dla Lateral Bound, Star Jump, Single Leg Push-Off, Side to Side Box Shuffle; błąd Depth Jump; trop: rozdział o pliometrii w podręczniku NSCA (szczebel 3).
- olympic: Rack Delivery, Clean Shrug, Snatch Shrug, wykrok Split Clean, błędy Jerk Balance i Snatch Balance.
- kb_ballistic: ustawienie dla Kettlebell Clean / KB Snatch / KB Clean and Jerk (drugie źródło szczebla 4 obok BarBend/StrongFirst), 6 otwartych w cz1, błędy podrzutu, Split Jerk.
- sled_throw: 5 ćwiczeń sanek bez źródeł; błędy rzutów; wersje jednorącz (bez źródeł spoza aplikacji).
- role: skoki w bok/po skosie, sanie, TGU, rwania KB/hantlem.

Pułapki: ExRx 403, web.archive.org zablokowane, nsca.com 403, educ.jmu.edu i bib-bvb.de poza siecią sesji; PDF-y jako obrazy stron są kosztowne w kontekście.
Przeliczenie: narzędzie ma tylko Write (pełne nadpisanie pliku) — każdy plik rodziny trzeba przepisać w całości; ok. 2 pliki na sesję w limicie kontekstu.

## Commity i weryfikacja

Commity na `badania/g3-moc` (od 0567769, wyłącznie pliki `docs/research/`).
- Pełne `npm run verify` na bazie `integracja-1-1` (15abc58): **zielone** (wyjście 0; dwa pliki przerwane SIGTERM przez maszynę — `maestro-flows`,
  `matrix-dim-langs-routes3` — ponowione przez jest-ponow osobno i zielone); znacznik pełny dla 15abc58.
- `npm run verify:docs` w worktree: 1. przebieg — 1/168 czerwony (`tests/cues.test.tsx`: „środowisko Jest już zamknięte”, jednorazowo; ten plik
  osobno 16/16), 2. przebieg — **zielony 168/168**, znacznik „dokumenty” dla edb53be. Wcześniej trzeba było `git fetch --unshallow origin`
  (płytki klon: brak `git merge-base origin/main HEAD`). Niestabilność zgłoszona koordynatorowi linii 1.1.
- Wypchnięte zwykłym `git push` (bez `--no-verify`): edb53be, potem ten commit.
- Przeliczenie 02.11.2026: zmiany tylko w kopiach plików w katalogu roboczym koordynatora (scratchpad), bez commitu i bez testów.

## Przeliczenie olympic — wynik (02.11.2026)

Pliki: olympic-clean.md, olympic-snatch.md, olympic-jerk.md — sekcja korekty i „Blok do wdrożenia (po przeliczeniu 02.11.2026)” na końcu; stare bloki „NIEAKTUALNY”.
- clean: przed 5 gotowe / 3 częściowe / 2 otwarte → po 8 własne z błędami / 0 / 2 otwarte (Clean Shrug, Rack Delivery). Coach (power clean) = 5 — autor dziennikarz,
  liczy się autor, nie cytowany trener → spada `olympic.mis.hipsEarly` (Power Clean, Clean), `oly.close` (Block Clean), `olympic.extend` (Block Power Clean). IronMind = 4
  przy dacie pośredniej z IronMind News (Split 06.07.2012, Clean Deadlift & Shrug 29.10.2009) → wraca `olympic.splitCatch`; „Lifting off Blocks” bez daty → `olympic.blockStart` nie wraca.
  Experience Life (Heffernan, CSCS, 20.05.2019) = 4. Block Clean, Block Power Clean, Split Clean: częściowe → własne z błędami.
- snatch: przed 8 gotowe (1 warunkowo) / 1 częściowe / 1 otwarte → po 9 własne z błędami / 0 / 1 otwarta (Snatch Shrug). Split Snatch bez warunku (IronMind 4).
  Torokhtiy (O. Torokhtiy, PhD, 15.10.2026; artykuł techniki, banery sprzedaży obok) = warunkowo 4 → Snatch Balance: 2 nowe błędy (`olympic.mis.slowDrop`,
  `olympic.mis.standEarly`, błąd = zaprzeczenie standardu Catalyst #80) → własna z błędami. Wszystkie strony BarBend mają autora i datę (Trieu, Dewar — tylko magisterium z fizjologii wysiłku: wątpliwość).
- jerk: przed 4 gotowe / 1 częściowe → po 4 własne z błędami / 1 własna bez błędów (Jerk Balance) / 0. Eleiko inspire360 = 5 (brak autora, daty, podpisu „Eleiko Education”)
  → w Split/Power Jerk spadają `pp.legs`, `olympic.feetHands`, `olympic.recover`, `olympic.mis.armsEarly`, `olympic.mis.pressOut`.
- Razem olympic: przed 17 gotowe / 5 częściowe / 3 otwarte → po 21 / 1 / 3.
- Do integracji: kolizja id `olympic.powerMove`, `olympic.splitMove`, `olympic.mis.armsEarly` — inne brzmienie w snatch i jerk.
- Do decyzji koordynatora: data pośrednia IronMind; Torokhtiy przy banerach sprzedaży; BarBend z autorem bez certyfikatu trenerskiego (tylko wykształcenie kierunkowe);
  Eleiko inspire360 jako biblioteka producenta sztang (jak Rogue) zamiast działu edukacji.

## Rozstrzygnięcia koordynatora 1.1 — olympic (02.11.2026)
1. IronMind: data publikacji ustalona pośrednio (wpis IronMind News o tym samym artykule) wystarcza — data identyfikuje publikację. Bez daty i bez wpisu („Lifting off Blocks”) — nie liczy się.
2. Torokhtiy: artykuł techniki z autorem z kwalifikacjami i datą = 4 mimo banerów sprzedaży na stronie (jak dział edukacji Eleiko w uzupełnieniu 3 — liczy się tekst, nie otoczenie); strony sprzedażowe = 5.
3. Magisterium z fizjologii wysiłku = kwalifikacja w rozumieniu reguły „autor z kwalifikacjami” (wykształcenie kierunkowe; jak BSc Sport & Exercise Science) → BarBend Trieu i Dewar = 4.
4. Eleiko na platformie inspire360 = 5 (bez autora i daty); producent liczy się tylko dla dokumentacji własnego sprzętu.
5. Kolizja id `olympic.powerMove`, `olympic.splitMove`, `olympic.mis.armsEarly` (różne brzmienie w rwaniu i podrzucie) — przy integracji programista nadaje osobne id (np. przedrostek `snatch.` / `jerk.`), a strażnik `check:cues` potwierdza unikalność.

## Przeliczenie szczebli 02.11.2026 — ciąg dalszy: plyo, sled_throw, role mięśni (dopisane, poprzednie sekcje bez zmian)

Rozstrzygnięcia koordynatora 02.11.2026 zastosowane: Physitrack = 5; The Prehab Guys warunkowo 4 per strona (autor z kwalifikacjami, data); NISMAT (instytut szpitala
Lenox Hill) i NHS — instytucje medyczne = 4; Freelap USA i Coach warunkowo 4 per autor; ACE 8250 = 5; Torokhtiy warunkowo 4 (artykuł techniki z autorem).
Strony sprawdzone WebFetch 02.11.2026 (dowody w sekcjach „Korekta szczebli” plików).

| Rodzina (pliki) | Badane | Własne z błędami | Własne bez błędów | Otwarte | Nowe zdania w bloku | Stan przeliczenia |
|---|---|---|---|---|---|---|
| plyo (cz1 + cz2) | 27 | 5 | 2 | 20 | 14 (cz1: 12, cz2: 2) | **zrobione** |
| sled_throw (sanki + rzuty) | 18 | 2 | 4 | 12 | 15 (sanki: 5, rzuty: 10) | **zrobione** |

Zmiany względem poprzedniej tabeli:
- plyo cz1: Jump Squat, Tuck Jump, Split Jump, Weighted Jump Squat, Broad Jump gotowe → własne z błędami; Depth Jump częściowe → własna bez błędów (kryterium karty);
  Lateral Box Jump gotowe warunkowo → otwarta (Prehab Guys: strony bez autora → nie liczą się). Broad Jump: drugie źródło błędu zmienione z Prehab Guys na Catalyst #549
  („błąd = zaprzeczenie standardu”). Torokhtiy (O. Torokhtiy, akt. 16.09.2024) → 4: trzecie źródło Weighted Jump Squat; `sq.back` NIE wraca (Catalyst #353 nie mówi o plecach — sprawdzone).
  NHS → 4, ale Star Jump nadal 1 źródło.
- plyo cz2: Alternate Leg Push-Off częściowe → własna bez błędów; Lateral Cone Hops, Dumbbell Seated Box Jump, Front Cone Hops częściowe → otwarte (brak ustawienia);
  blok 2b (Physitrack) odrzucony. NISMAT = 4 utrzymuje `plyo.coneLat.hop` (zdanie poza kartą).
- Razem plyo: przed 5 (+1 warunkowo) gotowe / 4 częściowe / 17 otwarte → po 5 / 2 / 20.
- sled_throw sanki: Turkish Get Up częściowe → własna z błędami (`tgu.mis.bentArm`: ACE ProSource + StrongFirst, błąd = zaprzeczenie standardu); Sled Push częściowe → własna bez błędów
  (BarBend: M. Dewar, CSCS, 28.06.2024); Backward Drag częściowe → otwarta (bez ruchu). Onnit (młot, nieużyte) 4 → 5.
- sled_throw rzuty: Wall Ball gotowe → własna z błędami bez `wb.catch` (Coach: autor bez kwalifikacji → 5); Chest Pass, Backward Throw, Standing Two-Arm Overhead Throw
  częściowe → własne bez błędów; `mbcp.mis.elbows` nie wchodzi (Freelap: brak biogramu i daty → 5).
- Razem sled_throw: przed 1 gotowe / 6 częściowe / 11 otwarte → po 2 / 4 / 12.

Role mięśni (`role-miesni-fala-w1/*.md`, 5 plików) — sprawdzone: żadne zdanie roli nie opiera się na źródle szczebla 5. Źródła: badania szczebla 3 (Geisler, Nagao i Ishii,
Soriano i in., Wu i in., Wade i in., Maddigan i in., St-Onge i in.), ACE, NASM, Catalyst, CrossFit (4), BarBend „Sled Push” (4 — autor CSCS, data 28.06.2024, sprawdzone),
Harvard Health Publishing (instytucja medyczna, nazwany recenzent CSCS — 4), istniejące S1–S23 (OpenStax, TeachMeAnatomy). Plików ról nie zmieniałem (brak korekty).

**Dangerously Fit Academy — ocena wg kryteriów 1–4 (dotyczy kb_ballistic-cz2; pliku nie edytowałem): szczebel 5.** Dowód (WebFetch 02.11.2026):
pkt 1 — firma „functional strength” z akademią kursów (certyfikacja wewnętrzna, akredytacji strona nie podaje) i sprzedawca własnej linii sprzętu („so I decided it was time to
launch my own line of training tools”); założyciel (D. Clay) bez formalnych kwalifikacji na stronie „o nas”. pkt 2 — strona ćwiczenia (double-kettlebell-push-press) bez autora
i daty, tylko stopka „Dangerously Fit Pty Ltd”. pkt 3 — na tej samej stronie „BUY YOUR KETTLEBELL HERE”, „Add to cart”, ceny, przycisk „KETTLEBELL CERTIFICATION”.
Najbliższy precedens: Onnit (uzup. 3: brak dat + sklep na stronie artykułu → 5). Skutek dla kb_ballistic-cz2: bez zmian liczb — oba Push Press już liczone jako otwarte
(„Dangerously Fit bez rozstrzygnięcia”), a `df-kb-jerk` też odpada; do zmiany przy integracji tylko oznaczenie „[OTWARTE]” → „5” w tabeli źródeł cz2.

Strony nieotwierane (wniosek przez analogię): The Prehab Guys „Continuous Lateral Bound” i „Lateral Single Leg Hop With Cone” (ta sama konstrukcja `vimeo-video` co dwie
sprawdzone, bez autora) — bez wpływu na wynik (oba ćwiczenia i tak bez drugiego źródła).

Bez rozstrzygnięcia (nie liczone, bez wpływu na wynik w tym przeliczeniu): BFS (Front Cone Hops — karta i tak bez ustawienia), EliteFTS poza sankami (Kneeling Jump Squat — 1 źródło),
Human Kinetics „Plyometric Anatomy” i Radcliffe (biogramy nieczytane).

Zostało do przeliczenia (bez zmian względem listy wyżej): pkt 1–3 — olympic (clean, snatch, jerk); pkt 8 — tabela łączna wszystkich rodzin (po olympic).
Pliki zmienione w tej sesji (kopie w scratchpad, bez commitu i bez testów): plyo-cz1.md, plyo-cz2.md, sled_throw-sanki.md, sled_throw-rzuty.md (nagłówki starych bloków +
dopisane sekcje), STAN-g3-moc.md (ta sekcja).
