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

## Odpowiedzi koordynatora linii 1.1 (02.11.2026 ~07:55 PL) — NIE zastosowane jeszcze w plikach rodzin

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
- Eleiko: warunkowo 4 tylko dział edukacji; Experience Life: 4 tylko autor z kwalifikacjami trenerskimi (olympic-clean.md — sprawdzić per strona).
- Kopie instrukcji (ManualsLib) — liczy się tylko dokument producenta o zgodnym numerze/wersji; Inspire, Mikolo, fit-pro.com — wg reguły.
- OTWARTE (nie liczą się): Men's Health, Muscle & Strength, Garage Gym Reviews.

## Zostało (następne kroki — sekcje „Stan” w każdym pliku)

- plyo: 7 ćwiczeń cz2 bez żadnego źródła szczebla 4; drugie źródła dla Lateral Bound, Star Jump, Single Leg Push-Off, Side to Side Box Shuffle; błąd Depth Jump; trop: rozdział o pliometrii w podręczniku NSCA (szczebel 3).
- olympic: Rack Delivery, Clean Shrug, Snatch Shrug, wykrok Split Clean, błędy Jerk Balance i Snatch Balance.
- kb_ballistic: 6 otwartych w cz1, błędy podrzutu, Split Jerk.
- sled_throw: 5 ćwiczeń sanek bez źródeł; błędy rzutów; wersje jednorącz (bez źródeł spoza aplikacji).
- role: skoki w bok/po skosie, sanie, TGU, rwania KB/hantlem.

Pułapki: ExRx 403, web.archive.org zablokowane, nsca.com 403, educ.jmu.edu i bib-bvb.de poza siecią sesji; PDF-y jako obrazy stron są kosztowne w kontekście.

## Commity i weryfikacja

Commity na `badania/g3-moc` (od 0567769, wyłącznie pliki `docs/research/`).
- Pełne `npm run verify` na bazie `integracja-1-1` (15abc58): **zielone** (wyjście 0; dwa pliki przerwane SIGTERM przez maszynę — `maestro-flows`,
  `matrix-dim-langs-routes3` — ponowione przez jest-ponow osobno i zielone); znacznik pełny dla 15abc58.
- `npm run verify:docs` w worktree: 1. przebieg — 1/168 czerwony (`tests/cues.test.tsx`: „środowisko Jest już zamknięte”, jednorazowo; ten plik
  osobno 16/16), 2. przebieg — **zielony 168/168**, znacznik „dokumenty” dla edb53be. Wcześniej trzeba było `git fetch --unshallow origin`
  (płytki klon: brak `git merge-base origin/main HEAD`). Niestabilność zgłoszona koordynatorowi linii 1.1.
- Wypchnięte zwykłym `git push` (bez `--no-verify`): edb53be, potem ten commit.
