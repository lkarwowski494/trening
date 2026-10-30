# Reguły sensu figur 1.1 — przegląd źródeł (badacz-merytoryczny, 30.10.2026)

Zakres: 3 reguły oznaczone w recenzjach 1.1 (29.10) jako źle sformułowane. Definicje: `origin/przekazanie-konta:docs/przekazanie/notatki/badania-figury/reguly-sensu-r2.json` (l. 347, 421). Recenzje: `docs/przekazanie/notatki/recenzje-1-1/ponowne/recenzja-1-1-bench_press.md` (sekcja „Pary reguł sensu”, l. 40–61) i `recenzja-1-1-hinge.md` (tabela wyjątków, l. 104–110). Bez zmian w repo, bez commitów (wariant A, 30.10).

Szczeble wg CLAUDE.md: 1 rachunek, 2 przeglądy/stanowiska, 3 badania/książki, 4 serwisy specjalistyczne i dokumentacja producentów sprzętu/aplikacji, 5 opinie trenerów.

Niedostępne 30.10 (nie liczę ich jako przeczytanych dziś): NSCA Basics PDF (403), ExRx (Cloudflare, 403), muscleandstrength (403), bodybuilding.com (404), Kettlebell Kings (402). Cytaty NSCA biorę z wcześniejszych notatek repo (r2 z 26.10, r4) i oznaczam „przeczytane w r2/r4, nie ponownie”.

---

## 1. `przedramie_pod_sztanga` (bench_press: `_lawka`, `_czesciowy`, `_podloga`)

### Źródła

| # | Źródło, miejsce | Co mówi (cytat ≤ 2 zdania) | Szczebel | Faza ruchu |
|---|---|---|---|---|
| S1 | Faigenbaum, Westcott, *Youth Strength Training* (Human Kinetics), fragment: https://us.humankinetics.com/blogs/excerpt/a-step-by-step-guide-for-a-proper-bench-press (przeczytane 30.10) | „In the bottom position the forearms should be perpendicular to the floor.” | 3 (książka) | **dół** |
| S2 | NSCA, *Basics of Strength and Conditioning Manual* (2012), s. 53–55; wg `reguly-sensu-r4.md` l. 17: „Wrists should be in line with elbows, and forearms perpendicular to the ground” (s. 54); błąd: „the forearms should not go wider than perpendicular to the ground” (s. 55, hantle skos) | przeczytane w r2/r4 (26.10), nie ponownie | 2 (organizacja naukowa; podręcznik, nie stanowisko — traktuję ostrożnie jako 2/3) | opis pozycji; docs/18 (26.10) odczytuje jako **dolną pozycję** |
| S3 | Stronger by Science, *How to Bench*, https://www.strongerbyscience.com/how-to-bench/ (przeczytane 30.10), sekcja 3 Biomechanics → Elbow Extension | przy sztandze: „you'll still want to flare your elbows to get them back under the bar by the midrange of the press.”; sekcja 2 Ascent: „At the start of the press, your elbows will naturally be tucked a bit since you're touching low on your chest.” | 4 | **środek ruchu: łokcie mogą być przed gryfem**, wracają pod gryf w połowie wyciskania |
| S3b | ta sama sekcja, akapit o **hantlach** | „the weight needs to stay more-or-less right over your elbow the whole time.” — uzasadnienie dotyczy sił bocznych (hantle bliżej siebie niż łokcie → wyprost łokci, dalej → rozpiętki), czyli płaszczyzny czołowej | 4 | cały ruch, tylko hantle, tylko oś boczna |
| S4 | Mausehund i in., JSCR 2022, Results/Kinematics s. 2691 (wg `wyciskanie-geometria.md`, nie czytane ponownie) | kąt przedramienia na dole: szeroki chwyt 12,5°, średni −0,8°, wąski −8,5° / −16,5° | 3 | dół; najpewniej płaszczyzna czołowa (zależność od szerokości chwytu) |
| — | ACE #5 Chest Press (https://acefitness.org/resources/everyone/exercise-library/5/chest-press), NASM Barbell Bench Press (https://www.nasm.org/resource-center/exercise-library/barbell-bench-press), przeczytane 30.10 | brak twierdzenia o przedramieniu | — | nie liczą się |
| — | Larsen i in. 2021, https://pmc.ncbi.nlm.nih.gov/articles/PMC7862765/ (przeczytane 30.10) | podaje kąty wyprostu łokcia w zdarzeniach toru (rys. 3), nie położenie łokcia względem gryfu | — | nie rozstrzyga |

### Wnioski

1. **Przedramię pionowo w dolnej pozycji — ustalone** (S1 szczebel 3 + S2 szczebel 2/3, dwie niezależne organizacje; zgodne z decyzją właściciela 26.10, docs/18 main l. 571).
2. **„Przez cały ruch” dla sztangi — brak źródła, a S3 mu przeczy:** na początku wyciskania łokcie są schowane (przed gryfem w stronę stóp) i wracają pod gryf w połowie ruchu. Rachunek recenzenta (bench_press.md l. 61) potwierdza to geometrycznie dla toru od barków do klatki. Wniosek: 14/14 par to zakres pomiaru reguły, nie błąd rysunku — **zgadzam się z recenzentem**.
3. **Hantle, cały ruch:** jedyne źródło (S3b, szczebel 4) mówi o osi bocznej (z), nie o osi x (głowa–stopy), którą mierzy reguła → dla osi x **[OTWARTE]**; dla osi z „cały ruch, hantle” = **jedno źródło** (S3b) + NSCA s. 55 (błąd „dłonie szerzej niż łokcie”, hantle skos, przeczytane w r4) → kandydat, nie do wdrożenia bez ponownego przeczytania NSCA.
4. **Próg:** żadne źródło nie podaje liczby. 10 cm przy przedramieniu z dłonią 26,5–33 cm ≈ 18–22° od pionu; docs/18 (26.10) pisze „±10°”. To niespójność w zapisie konwencji (nie kwestia źródeł). Dane S4 (rzeczywiste odchylenie na dole do ok. 16,5° w płaszczyźnie czołowej) nie przeczą tolerancji rzędu 15–20° — to analogia między płaszczyznami, więc **uproszczenie**.
5. **Floor press (`_podloga`) i Board/Pin (`_czesciowy`):** żadne przeczytane źródło nie opisuje przedramienia w tych wariantach; przeniesienie reguły z ławki = **uproszczenie (analogia)**. Dla `_czesciowy` „dół” = punkt zatrzymania (deska/bolce), nie klatka.

### Proponowane brzmienie

```
"przedramie_pod_sztanga": {
  "typ": "lokiec_pod_chwytem",
  "grupa": "przedramie",
  "zakres_u": [0.9, 1.0],            // tylko dolna pozycja (w _czesciowy: punkt zatrzymania)
  "parametry": {"osie": ["x"], "max_cm": 10},
  "zrodlo": "Faigenbaum i Westcott, Youth Strength Training (fragment HK, „In the bottom position…”); NSCA Basics s. 53–55 (r2/r4); SBS How to Bench §3 Elbow Extension — łokcie wracają pod gryf w połowie ruchu (dlatego bez środka ruchu)",
  "liczba": "konwencja (10 cm ≈ 18–22° od pionu przy przedramieniu 26,5–33 cm); _podloga i _czesciowy — uproszczenie (analogia do ławki)",
  "pewnosc": "ustalone (pion na dole); próg — konwencja"
}
```
Do poprawienia przy okazji (koordynator/programista): zapis w docs/18 „±10°” albo próg reguły — jedno z nich, żeby konwencja była jedna; rekomenduję zostawić 10 cm i opisać go jako ok. 18–22°, bo wtedy z 14 par zostaje tylko One-Arm Kettlebell Floor Press (11,4 cm na dole) — do kalibracji rysunku.

### Odrzucone alternatywy
- „Cały ruch, próg 12 cm” (druga propozycja recenzenta) — liczba bez źródła, a S3 mówi, że w środku ruchu łokieć bywa przed gryfem; podniesienie progu ukryłoby kierunek, nie odtworzyło go.
- „Cały ruch dla hantli w osi x” na podstawie S3b — cytat dotyczy osi bocznej; nadinterpretacja.
- „±10° na dole” jako próg kątowy — przy danych z recenzji odrzuca 12–18° w Decline/Board/Pin/Floor, a liczba 10° też nie ma źródła; nie jest „bardziej źródłowa” niż 10 cm.

---

## 2. `ciezar_przy_nogach` — Smith Machine Stiff-Legged Deadlift

### Źródła (przeczytane 30.10)

| # | Źródło, miejsce | Cytat | Szczebel |
|---|---|---|---|
| M1 | Fitbod (dokumentacja aplikacji), https://fitbod.me/exercises/smith-machine-stiff-legged-deadlift, „Instructions for Proper Form”, kroki 1, 2, 5 | „Position your feet roughly shoulder width-apart, or slightly wider, behind the bar.” … „Keep the bar 1-2 inches away from your shins” | 4 |
| M2 | REP Fitness (producent sprzętu), https://repfitness.com/blogs/guides/smith-machine-deadlift, sekcja „Smith Machine RDL” | „the bar as close to your legs as possible” (RDL do połowy goleni); artykuł zaleca maszynę z prawie pionową prowadnicą, a przy pochylonej — dobranie ustawienia stóp tak, by sztanga była blisko ciała (parafraza) | 4 |
| M3 | TuffWraps (blog marki sprzętu), https://tuffwraps.com/blogs/news/smith-machine-deadlifts, „Smith Machine Deadlifts vs. Barbell Deadlifts” i „Common Mistakes” | „Smith machines have a fixed bar path so you must follow its track”; „If the bar is too far from your shins, it forces you to lean forward excessively when lifting.” | 5 (tylko wskazówka) |
| — | Planfit, https://planfit.ai/en/exercise/smith-machine-stiff-leg-deadlift | nic o odległości od nóg ani ustawieniu stóp względem gryfu | nie liczy się |
| — | Reguła dla wolnej sztangi (r2): NSCA Basics s. 51–52, ACE #317, SBS — przeczytane 26.10 | sztanga blisko nóg przez cały ruch | 2/4 |

### Wnioski
1. **Reguła „ciężar blisko nóg” ma zastosowanie także na maszynie Smitha — ustalone dla techniki** (M1 + M2: 2 niezależne źródła szczebla 4, zgodne; M3 kierunkowo zgodne). Prowadnica ustala tor gryfu, ale nie jego położenie względem nóg — to ustala **ustawienie stóp** (M1: stopy za gryfem; M2: dobór ustawienia przy pochylonej prowadnicy).
2. **Ustawienie stóp względem gryfu:** M1 „behind the bar”, gryf przy goleniach na starcie i 1–2 cale (2,5–5 cm) od nich w ruchu — **jedno źródło** co do liczby; kierunek „stopy tak, żeby gryf był tuż przed nogami” — 2 źródła.
3. **Rachunek (własny, szczebel 1, jakościowy):** przy pionowej prowadnicy x gryfu jest stały, a przód nóg na wysokości gryfu przesuwa się, gdy biodra idą w tył. Odstęp w środku ruchu zależy więc od miejsca prowadnicy względem stóp. Przekroczenie 16,1 vs 15 cm (1,1 cm) wskazuje na **ustawienie stóp w rysunku**, nie na złą regułę. Ilościowo nie liczyłem (zależy od wymiarów rigu) → jeśli po przestawieniu stóp minimum maksymalnego odstępu nadal > 15 cm, to jest to ograniczenie geometrii prowadnicy i wtedy tolerancja jest konwencją.
4. **Werdykt recenzenta „zła reguła dla Smitha” — nie potwierdzam.** Źródła mówią wprost, że na Smithcie gryf ma być blisko nóg.

### Proponowane brzmienie
Bez nowej reguły. `ciezar_przy_nogach` zostaje dla Smith Machine Stiff-Legged Deadlift w obecnym brzmieniu (`max_cm` 15, `tylko_ponizej_barkow`), z dopisanym źródłem: „Smith: Fitbod Smith SLDL kroki 1, 2, 5; REP Fitness Smith Machine Deadlift Guide, sekcja RDL (przeczytane 30.10)”. Działanie: poprawić rysunek — stopy względem prowadnicy tak, żeby gryf był tuż przed goleniami/udami (start przy goleniach). Dopiero gdy pomiar po poprawce pokaże, że geometria pionowej prowadnicy nie pozwala zejść ≤ 15 cm, rozważyć parametr `max_cm` dla prowadnicy jako **konwencję** (wartość z pomiaru rigu, opisana jako konwencja).

### Odrzucone alternatywy
- Wyjątek stały z powodem „szyna pionowa” — przeczy M1/M2 (blisko nóg także na Smithcie); utrwaliłby błąd rysunku.
- Reguła `bez_szyny` (wyłączenie maszyn z reguły) — jw.
- Zastąpienie regułą „tor pionowy” — dla Smitha spełniona z definicji (prowadnica), więc nic nie sprawdza.

---

## 3. `ciezar_przy_nogach` — Sumo Deadlift (kettlebell)

### Źródła (przeczytane 30.10)

| # | Źródło, miejsce | Cytat | Szczebel |
|---|---|---|---|
| K1 | The Prehab Guys, https://theprehabguys.com/vimeo-video/sumo-deadlift-kettlebell/, „HOW” i „COMPENSATION” | „Place a kettlebell on the ground underneath you in between your legs.” „Make sure your arms are on the inside of your knees, not out like a normal deadlift.” | 4 (biblioteka ćwiczeń firmy fizjoterapeutycznej) |
| K2 | Trainwell (aplikacja), https://www.trainwell.net/exercises/kettlebell-sumo-deadlift, „Step-by-step instructions”, kroki 2 i 5 | „Position the kettlebell between your feet.”; podnoszenie „keeping your arms straight” | 4 |
| K3 | NASM, Kettlebell Deadlift (rozstaw na szerokość bioder, nie sumo), https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift, Step 1 | kettlebell „positioned on the ground between your feet” | 4 (biblioteka organizacji szkolącej trenerów); dla sumo — analogia |
| — | Body-Solid (https://bodysolid.com/exercises/article/71/...) | strona bez instrukcji | nie liczy się |

Wyniki wyszukiwarki sugerowały spór „ciężar w linii pięt vs śródstopia” — tych stron nie przeczytałem (402/brak), więc nie biorę tego jako źródła → **[OTWARTE]**.

### Wnioski
1. **Kettlebell między stopami / pod ciałem na starcie — ustalone dla techniki** (K1 + K2 zgodne, 2 niezależne źródła szczebla 4; K3 to samo dla rozstawu wąskiego).
2. **Ręce wewnątrz kolan (proste ramiona)** — ręce wewnątrz kolan: **jedno źródło** (K1); proste ramiona: K2 (+ ogólna reguła martwego ciągu).
3. **Tor ciężaru:** K1 i K2 mówią tylko „w górę” (bez „pionowo”). Tor pionowy nad podstawą (między stopami w płaszczyźnie strzałkowej) to wniosek z równowagi (rachunek jakościowy: ciężar poza podstawą podparcia wymusza przechył) → **uproszczenie**, kierunkowo zgodne z regułą dla sztangi (gryf nad środkiem stopy, r2).
4. **Dlaczego obecna reguła jest zła tu:** `ciezar_blisko_nog` mierzy odstęp od osi nóg w płaszczyźnie strzałkowej (przód nóg). Przy szerokim rozstawie i ciężarze między nogami ciężar jest **pod tułowiem między udami**, a nie przed nimi — pomiar odstępu od przodu nóg nie opisuje tego ćwiczenia. Zgadzam się z recenzentem.

### Proponowane brzmienie
```
"ciezar_miedzy_stopami": {
  "typ": "ciezar_nad_podstawa",          // nowy typ do zaprogramowania (decyzja programisty)
  "grupa": "tor",
  "zakres_u": [0.0, 1.0],
  "parametry": {
    "strzalkowo": "x ciężaru między piętą a palcami stóp (w obrysie stóp)",
    "czolowo": "z ciężaru między stopami (|z − środek stóp| ≤ połowa rozstawu stóp)"
  },
  "zrodlo": "Prehab Guys Sumo Deadlift – Kettlebell (HOW); Trainwell Kettlebell Sumo Deadlift kroki 2 i 5; NASM Kettlebell Deadlift Step 1 (analogia, rozstaw wąski) — przeczytane 30.10",
  "liczba": "uproszczenie (granice = obrys stóp; tor pionowy z równowagi, nie ze źródła wprost)",
  "pewnosc": "ustalone (między stopami); tor — uproszczenie"
}
```
Przypisanie: tylko Sumo Deadlift (kettlebell) zamiast `ciezar_przy_nogach` (zestaw `_sumo` dzieli się: sztangowe sumo zostają przy `ciezar_przy_nogach`, bo gryf jest przed nogami). Opcjonalnie, osobno: `rece_wewnatrz_kolan` (z dłoni między kolanami na dole) — **jedno źródło** (K1), więc nie jako reguła blokująca bez drugiego źródła.

### Odrzucone alternatywy
- Wyjątek stały z powodem — pomija test toru zamiast sprawdzać właściwą cechę ćwiczenia.
- „Ciężar w linii pięt” albo „nad śródstopiem” jako próg — nieprzeczytane źródła, spór → [OTWARTE]; obrys stóp obejmuje oba warianty.
- Zostawienie `ciezar_przy_nogach` ze zwiększonym progiem — mierzy złą cechę (przód nóg), liczba bez źródła.

---

## Otwarte pytania [OTWARTE]
1. Czy NSCA Basics s. 53–55 opisuje pion przedramienia tylko w dole, czy w całym opuszczaniu — ponownie przeczytać PDF (30.10 serwer zwraca 403); dziś opieram się na notatkach r2/r4.
2. Hantle: przedramię w osi x w środku ruchu — brak źródła (SBS mówi o osi bocznej).
3. Floor press i Board/Pin press — brak źródła o przedramieniu dla tych wariantów (dziś: analogia).
4. Kettlebell sumo: ciężar w linii pięt czy śródstopia — źródła sporne, nieprzeczytane.
5. Smith SLDL: czy po przestawieniu stóp w rigu da się zejść ≤ 15 cm przy pionowej prowadnicy (pomiar programisty/rysownika, nie źródło).
6. Spójność zapisu konwencji „±10°” (docs/18, 26.10) z progiem 10 cm w regule.

Uwaga: wszystko powyżej dotyczy reguł kontroli rysunków (figur), nie tekstów w aplikacji; teksty bez nazw źródeł (zasada 25.10). Brak twierdzeń o zdrowiu.
