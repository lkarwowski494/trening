# Wskazówki techniki — fala W2, grupa G3: olympic i thruster

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W2, G3). Zakres: tylko zbieranie danych — bez zmian w kodzie, `data/zrodla/*.json`, `lib/**` i testach.
Podstawa: stan W1 po przeliczeniu szczebli 02.11.2026 (pliki W1 olympic-clean, olympic-snatch, olympic-jerk, thruster — sekcje „Korekta szczebli”
i „Blok do wdrożenia (po przeliczeniu 02.11.2026)”) oraz rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 (IronMind z datą pośrednią = 4,
Torokhtiy artykuł techniki z autorem = 4, Eleiko inspire360 = 5, BarBend z autorem z magisterium z fizjologii wysiłku = 4).
Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md`. Dokumentacji innych aplikacji treningowych nie używałem.

## 1. Ćwiczenia — status po W2

| Klucz (lib/catalog.generated.ts) | Status po W1 | Status po W2 | Co dodano |
|---|---|---|---|
| Jerk Balance (:412) | własna bez błędów | **własna z błędami** | 1 błąd wnioskowany z `olympic.balanceMove`, poparty wprost przez Catalyst #193 (Notes) |
| Clean Shrug (:317) | otwarta | **otwarta** | IronMind (data pośrednia 29.10.2009) = 4 potwierdza tylko ruch (`olympic.shrugTop`); ustawienie nadal 1 źródło — patrz sekcja 5 |
| Snatch Shrug (:318) | otwarta | **otwarta** | drugiego źródła szczebla 4 nie znalazłem; rozbieżność opisu potwierdzona (sekcja 5) |
| Rack Delivery (:413) | otwarta | **otwarta** | tylko Catalyst #544 (jedno źródło); brak pozy w `lib/figures/v2/poses/olympic.json` |
| Clean and Press (:372) | otwarta | **własna z błędami — uproszczenie (do decyzji koordynatora / recenzenta)** | karta złożona z dwóch kart: zarzut ze zwisu z przyjęciem wysoko (W1) + Overhead Press (sztanga) (`data/zrodla/cues.json:3954`); granice w sekcji 2b |

Razem: 2 nowe karty z błędami (Jerk Balance; Clean and Press — warunkowo, jako uproszczenie), 0 bez błędów, 3 otwarte.
Błędy wnioskowane: 1 (`olympic.mis.balanceLean`). Nowe zdania: 1. Szczebla 3 dla Clean and Press nie znalazłem (sekcja 5).

## 2. Uzasadnienia

### 2a. Jerk Balance — błąd

Zdanie ruchu z W1 (`olympic.balanceMove`, Catalyst #193 + BarBend „Exercises to Strengthen Your Jerk”): „…wysuń przednią stopę do pełnego wykroku”.
Zaprzeczenie, które zmienia wykonanie i da się narysować (tułów pochylony, przednia stopa w skróconym wykroku): klatka leci w przód zamiast wejścia
przednią stopą w wykrok. Catalyst #193 (Notes) podaje to wprost jako najczęstszy błąd: „The most common errors in this exercise are diving the chest forward
rather than stepping into the split with the front foot and hips…” (https://catalystathletics.com/exercise/193/Jerk-Balance/, sekcja Notes; przeczytane 02.11.2026).
Para: wniosek z potwierdzonego zdania tego ćwiczenia + jedno źródło szczebla 4 z błędem wprost — reguła (b) briefu.

Nie wnioskowałem: „za dużo ciężaru na przedniej nodze” i „tylna stopa odrywa się od podłogi” — nie są zaprzeczeniem żadnego zdania karty (tylko Catalyst; BarBend,
R. Stefan, akt. 01.07.2024, sekcja „Jerk Balance” — błędów nie podaje, sprawdzone 02.11.2026). Start z pełnego wykroku zamiast skróconego (zaprzeczenie `olympic.balanceSetup`) —
pominięty jako mało pouczający (nie zmienia toru ruchu, zmienia ćwiczenie).

### 2b. Clean and Press — uproszczenie „złożenie dwóch ćwiczeń z kartami”

Szczebel 3 i 4: brak przeczytanego źródła o tym ćwiczeniu (W1: ACE, NASM, ISSA, NSCA, CrossFit, producenci; W2: wyszukiwanie 02.11.2026 dało tylko serwisy
bez autora, strony aplikacji i sklepów — szczebel 5 albo niedopuszczalne). Dlatego propozycja: `uproszczenie: złożenie Hang Clean / Power Clean + Overhead Press (sztanga)`.

Co pokazuje figura (`lib/figures/v2/poses/thruster.json:2118`): start ze zwisu nad kolanami (klatka u=0: pochylenie tułowia 40°, miednica 78,8 przy 89,9 w staniu),
wyprost (u≈0,21), przyjęcie w płytkim przysiadzie (u≈0,41–0,47: miednica 84,4–86,8), wstanie (u≈0,65), wyciskanie bez ugięcia nóg (miednica stała 89,7 do u=1).
To jest zarzut ze zwisu z przyjęciem wysoko + wyciskanie żołnierskie. Karta poniżej odpowiada tej figurze.

Złożenie:
- Ustawienie: `olympic.hangStart` (karta Hang Clean W1: Catalyst #68 + Rogue + BarBend).
- Ruch, część zarzut: `olympic.extend`, `olympic.under` (karta Hang Clean W1), `olympic.catchHigh` (karta Power Clean W1: Catalyst #67 + BarBend + Experience Life).
- Ruch, część wyciskanie: `ohp.move` (karta Overhead Press (sztanga), `data/zrodla/cues.json:3976`).
- Wskazówki: `oly.close` (Hang Clean W1), `ohp.tall` (Overhead Press, `cues.json:3991`).
- Błędy: `olympic.mis.arms`, `mis.barAway` (karta Power Clean W1 — źródła wprost o zarzucie z przyjęciem wysoko).

Granice uproszczenia (do recenzji):
1. Każda faza osobno jest potwierdzona, ale **przejście** (przyjęcie → wstanie → wyciskanie) nie ma źródła; figura pokazuje pełne wstanie przed wyciskaniem — zgodne
   z końcem Power Clean (catalyst-67: wstanie po przyjęciu) i startem Overhead Press (sztanga przy barkach), ale samo połączenie nie jest opisane w żadnym przeczytanym źródle.
2. **Wyciskanie bez nóg**: karta nie ma zdania „wyciskaj samymi rękami, bez ugięcia kolan” — źródła Overhead Press w `cues.json` mówią o prostym tułowiu (`ohp.tall`),
   nie o braku pracy nóg. Bez tego karta nie odróżnia tego ćwiczenia od zarzutu z wyciskaniem z wybiciem (push press) — [OTWARTE], sekcja 5.
3. **Start**: przyjęty zwis (zgodnie z figurą). W wielu opisach nazwa oznacza start z podłogi — wtedy ustawienie powinno pochodzić z Power Clean (`olympic.feet`,
   `olympic.setupBack`), a nie z Hang Clean. Jeśli figura się zmieni, zmienia się ustawienie karty.
4. **Przyjęcie**: wysoko (power) wg figury; wersja z przyjęciem w pełnym przysiadzie wymagałaby `olympic.catchLow` (Hang Clean W1).
5. Z karty Overhead Press NIE wchodzi `ohp.bbSetup` (zdjęcie sztangi ze stojaka — tu sztanga przychodzi z zarzutu) ani `ohp.feet`. Szerokość chwytu nie jest twierdzona
   (zarzut i wyciskanie mogą mieć inny chwyt — źródła tego nie rozstrzygają dla złożenia).
6. Overhead Press (sztanga) w `cues.json:4017` nie ma błędów — wszystkie błędy karty pochodzą z części zarzut.

Jeśli koordynator nie przyjmie uproszczenia „złożenie” — Clean and Press zostaje otwarte (zestaw ogólny `oly`, `lib/figures/v2/cue-sets.json:141`).

## 3. Blok do wdrożenia

Źródła z bloków W1 (po przeliczeniu): `catalyst-193`, `barbend-jerk-exercises` (olympic-jerk), `catalyst-67`, `catalyst-68`, `rogue-hang-squat-clean`, `barbend-hang-clean`,
`barbend-power-clean`, `barbend-clean`, `experiencelife-power-clean` (olympic-clean); `ace-71`, `exrx-DeltoidAnterior/BBMilitaryPress` — istniejące w `data/zrodla/cues.json`.
Nie powtarzam ich definicji — integrator bierze je z tamtych bloków. Nowych źródeł brak.

```json
{
 "exercises": {
  "Jerk Balance": {
   "setup": [
    {"c": "olympic.balanceSetup", "s": [["catalyst-193", "opis (jerk rack position; step about a foot-length back with the front foot into a partial split)"], ["barbend-jerk-exercises", "Jerk Balance (jerk split stance slightly „shorter” than where you'd receive the bar; bar in the front rack)"]]}
   ],
   "move": [
    {"c": "olympic.balanceMove", "s": [["catalyst-193", "opis (dip straight down, drive straight up, punch the bar overhead, step the front foot forward into the full split)"], ["barbend-jerk-exercises", "Jerk Balance (dip and drive from the shortened split; catch overhead while sliding the front leg out)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "olympic.mis.balanceLean", "s": [["wniosek", "olympic.balanceMove"], ["catalyst-193", "Notes (diving the chest forward rather than stepping into the split with the front foot and hips)"]]}
   ]
  },
  "Clean and Press": {
   "setup": [
    {"c": "olympic.hangStart", "s": [["catalyst-68", "akapit Starting hang position (uproszczenie: złożenie — część zarzut ze zwisu)"], ["rogue-hang-squat-clean", "Hang Position (just above the knees, hips back, flat back; uproszczenie: złożenie)"], ["barbend-hang-clean", "FAQ Step 2 (hinge until the bar is past your knees; uproszczenie: złożenie)"]]}
   ],
   "move": [
    {"c": "olympic.extend", "s": [["catalyst-68", "akapit How the lift begins (hips extend forcefully; uproszczenie: złożenie)"], ["barbend-hang-clean", "Step 3 (drive your hips forward; uproszczenie: złożenie)"]]},
    {"c": "olympic.under", "s": [["catalyst-68", "akapit Elbows and rack (spin the elbows around the bar; uproszczenie: złożenie)"], ["barbend-hang-clean", "Step 3–4 (high elbows, front rack; uproszczenie: złożenie)"]]},
    {"c": "olympic.catchHigh", "s": [["catalyst-67", "akapit Receiving (partial squat, stay above parallel; uproszczenie: złożenie — przyjęcie jak w Power Clean)"], ["barbend-power-clean", "Step 5 (legs slightly bent; uproszczenie: złożenie)"], ["experiencelife-power-clean", "4. The Catch (quarter- to half-squat; uproszczenie: złożenie)"]]},
    {"c": "ohp.move", "s": [["ace-71", "opis (uproszczenie: złożenie — część wyciskanie jak Overhead Press (sztanga))"], ["exrx-DeltoidAnterior/BBMilitaryPress", "Execution (uproszczenie: złożenie)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-68", "akapit How the lift begins (bar close to the body; uproszczenie: złożenie)"], ["barbend-hang-clean", "FAQ Step 3 (keeping it close to your body; uproszczenie: złożenie)"]]},
    {"c": "ohp.tall", "s": [["ace-71", "opis (back straight and tall, press directly overhead; uproszczenie: złożenie)"], ["exrx-DeltoidAnterior/BBMilitaryPress", "Execution; Comments (chest high; uproszczenie: złożenie)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-power-clean", "Common Mistakes: Using Your Arms (uproszczenie: złożenie — część zarzut)"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (uproszczenie: złożenie)"]]},
    {"c": "mis.barAway", "s": [["experiencelife-power-clean", "Common Mistakes: Bar drifting away from the body (uproszczenie: złożenie)"], ["barbend-clean", "Common Mistakes: Kicking the Bar (uproszczenie: złożenie)"]]}
   ]
  }
 }
}
```

Jerk Balance: wpis = zdania z bloku W1 po przeliczeniu (`olympic-jerk`, :316–325) + nowy błąd. Clean and Press: wpis cały nowy, warunkowy (uproszczenie).
Dla Clean and Press `barbend-hang-clean` i `barbend-power-clean`/`barbend-clean` to jedna organizacja — w żadnym zdaniu nie liczą się razem; każde zdanie ma ≥ 2 organizacje.

## 4. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| olympic.mis.balanceLean | Pochylanie klatki w przód zamiast wysunięcia przedniej stopy do pełnego wykroku. | Diving your chest forward instead of stepping the front foot out into the full split. |

Istniejące użyte: `oly.close`, `mis.barAway`, `ohp.move`, `ohp.tall` (`lib/cues/text/pl.json:224, 205, 220, 222`); z W1: `olympic.balanceSetup`, `olympic.balanceMove`,
`olympic.hangStart`, `olympic.extend`, `olympic.under`, `olympic.catchHigh`, `olympic.mis.arms`.

## 5. Źródła (przeczytane w W2, 02.11.2026)

| id | adres | organizacja | szczebel i uzasadnienie | co przeczytano |
|---|---|---|---|---|
| catalyst-193 | https://catalystathletics.com/exercise/193/Jerk-Balance/ | Catalyst Athletics | 4 (szczeble-organizacji: biblioteka Catalyst; hasło bez autora i daty — jak wszystkie hasła biblioteki) | opis, Notes (błędy: klatka w przód, ciężar na przedniej nodze), Purpose |
| barbend-jerk-exercises | https://barbend.com/exercises-to-strengthen-jerk | BarBend | 4 (R. Stefan, magisterium z fizjologii wysiłku — rozstrzygnięcie 3 koordynatora; akt. 01.07.2024) | sekcja Jerk Balance: ustawienie, ruch, brak błędów; „Jerk Technique Tips” |
| catalyst-93 | https://www.catalystathletics.com/exercise/93/Clean-Shrug/ | Catalyst Athletics | 4 | start („Standing tall with the bar hanging in your clean grip…”), ruch, Notes (głównie kolana, tułów prawie pionowo), warianty (wysoki zwis, podesty) |
| ironmind-clean-dl-shrug | https://ironmind.com/articles/jim-schmitz-on-the-lifts/Clean-Deadlift-Shrug/ | IronMind | 4 (J. Schmitz, trener kadry olimpijskiej USA; data pośrednia z IronMind News 29.10.2009 — rozstrzygnięcie 1) | start z podłogi („The bar is just grazing your shins…”), proste ręce, wolne tempo („still in slow motion”), błędy (zgięte ręce, okrągłe plecy) |
| catalyst-544 | https://catalystathletics.com/exercise/544/Clean-Rack-Delivery | Catalyst Athletics | 4 | start „scarecrow”, ruch (barki w tył, obrót łokci), błąd (pochylanie klatki do sztangi) |
| eleiko „Hang Clean Shrug – Hip, Barbell” | https://eleiko.inspire360.com/resource/659d94f9ede8c64586056ca7 | Eleiko (inspire360) | **5** (brak autora, daty i podpisu „Eleiko Education” — rozstrzygnięcie 4) | start ze środka ud z pochyleniem, ruch z łokciami w górę (to wysoki ciąg, nie wzruszenie) — nieużyte |

Sprawdzone bez wyniku (W2): Torokhtiy — brak artykułu o jerk balance i clean shrug (tylko listy wideo i strony programów, wyszukiwanie 02.11.2026);
georgiadogs.com „Weightlifting Technique” (2006) — strona bez treści dla narzędzia; invictusfitness.com i barbend.com/?p=29385 — przekierowania na strony główne;
stack.com/?p=270974 — 503; SPRINZ (AUT) slajdy T. Suchomela „Weightlifting Derivatives” — 403; Suchomel, Comfort, Stone 2015 (Sports Med 45:823–829) — pełny tekst niedostępny.
Wyniki dla Clean and Press (fitnessvolt, sweat, masterclass, origym, generationiron, majorfitness, evofitness, muscleandstrength) — szczebel 5 albo strony aplikacji; nieużyte.

## 6. Otwarte

- **Clean Shrug** — IronMind = 4 nie daje karty. Ruch `olympic.shrugTop` (Catalyst #93 + IronMind) — potwierdzony, choć z różnicą tempa (IronMind: wolno, „slow motion”;
  Catalyst: maksymalne przyspieszenie) — część wspólna: pełny wyprost i wzruszenie na końcu. Ustawienie: Catalyst — stanie, sztanga wysoko na udach, lekkie ugięcie kolan i bioder;
  IronMind — z podłogi, sztanga przy piszczelach. To inny start (IronMind opisuje martwy ciąg ze wzruszeniem), więc nie ma części wspólnej dla ustawienia poza chwytem jak do zarzutu
  (Catalyst „clean grip”, IronMind „the same grip you would use if you were going to clean it”). Zdanie tylko o chwycie byłoby trywialne. Szukane: Torokhtiy, BarBend, Rogue (brak hasła),
  Eleiko (5). Sygnał dla figur: Catalyst #93 — ruch „primarily at the knees”, tułów prawie pionowo; figura Clean Shrug (W1: klatka 0 z pochyleniem ok. 23°) może tego nie oddawać — do recenzji ruchu.
- **Snatch Shrug** — tylko Catalyst #92 (szczebel 4); W1: Cissik (5) opisuje zgięcie w biodrach. W2: brak drugiego źródła (Torokhtiy, BarBend — brak hasła; Suchomel — „jump shrug”,
  inne ćwiczenie i tekst niedostępny). Bez zmian.
- **Rack Delivery** — tylko Catalyst #544 (jedno źródło szczebla 4: ustawienie „scarecrow”, obrót łokci, błąd: pochylanie klatki do sztangi). Brak pozy w `lib/figures/v2/poses/olympic.json`
  — nawet przy drugim źródle karta nie ma figury (do decyzji koordynatora: karta bez figury czy figura do zrobienia).
- **Clean and Press** — (1) decyzja koordynatora/recenzenta o uproszczeniu „złożenie” (sekcja 2b); (2) zdanie „wyciskaj samymi rękami, bez pomocy nóg” i błąd „pomaganie sobie
  nogami przy wyciskaniu” — bez przeczytanego źródła (kandydaci: hasło „Press” w bibliotece Catalyst + drugie źródło o wyciskaniu żołnierskim z zakazem pracy nóg); (3) start z podłogi
  czy ze zwisu — nazwa w źródłach szczebla 5 zwykle oznacza start z podłogi, figura — ze zwisu.
- **Jerk Balance** — „za dużo ciężaru na przedniej nodze” i „tylna stopa cały czas na podłodze” — tylko Catalyst #193; nie wchodzą.

## 7. Kolizje id `olympic.powerMove`, `olympic.splitMove`, `olympic.mis.armsEarly`

Wystąpienia w blokach W1 po przeliczeniu 02.11.2026:

| id dziś | brzmienie (W1) | ćwiczenia | propozycja id |
|---|---|---|---|
| olympic.powerMove (rwanie) | „Odepchnij się nogami od podłogi, przy biodrach wyprostuj się dynamicznie i wejdź pod sztangę — złap ją na prostych rękach wyżej niż w przysiadzie równoległym…” | Power Snatch, Block Power Snatch | `snatch.powerMove` |
| olympic.powerMove (podrzut) | „Ugnij kolana, mocno wybij nogami i wypychając sztangę nad głowę, przestaw stopy trochę szerzej…” | Power Jerk | `jerk.powerMove` |
| olympic.splitMove (rwanie) | „Ciągnij jak w rwaniu, potem szybko wejdź pod sztangę w nożyce…” | Split Snatch | `snatch.splitMove` |
| olympic.splitMove (podrzut) | „Ugnij kolana, mocno wybij nogami w górę i wypychając sztangę nad głowę, przeskocz do wykroku…” | Split Jerk, Clean and Jerk | `jerk.splitMove` |
| olympic.mis.armsEarly (rwanie) | „Ciągnięcie rękami, zanim nogi i biodra skończą wyprost.” | Barbell Snatch, Power Snatch, Hang Snatch, Snatch Pull, Block Snatch, Block Power Snatch, Split Snatch | **`olympic.mis.arms`** (istniejące w W1 clean: „Ciągnięcie rękami za wcześnie, zanim nogi i biodra skończą wyprost.” — to samo znaczenie; zamiast nowego id) albo `snatch.mis.armsEarly` |
| olympic.mis.armsEarly (podrzut) | „Wypychanie rękami, zanim nogi skończą wybicie.” | po przeliczeniu — żadne (wypadło z Split Jerk i Power Jerk: Eleiko = 5) | `jerk.mis.armsEarly`, jeśli wróci |

Uwagi: (1) przemianować oba brzmienia, nie jedno — wtedy żadne `olympic.powerMove`/`olympic.splitMove` nie zostaje i nie myli się z drugą rodziną;
(2) połączenie `olympic.mis.armsEarly` (rwanie) z `olympic.mis.arms` (zarzut) wymaga zgody recenzenta lokalizacji (różnica tylko „za wcześnie”) — brzmienie zarzutu pasuje
do obu, a źródła rwania (CrossFit „Early Arm Pull”, Catalyst art. 1904) mówią to samo; (3) w `lib/cues/text/pl.json` nie ma dziś żadnego id z przedrostkiem `jerk.` ani `snatch.`
(Grep 02.11.2026 — 0 trafień), więc nowe id nie kolidują; unikalność potwierdzi `check:cues` przy integracji (rozstrzygnięcie 5 koordynatora).

## 8. Stan

- Zrobione: wszystkie 3 punkty zlecenia. Jerk Balance → własna z błędami; Clean and Press → własna z błędami jako uproszczenie (warunkowo); Clean Shrug, Snatch Shrug, Rack Delivery — otwarte z powodem; kolizje id — propozycja.
- Zostało: decyzja o uproszczeniu Clean and Press; źródło dla „wyciskanie bez nóg”; drugie źródła dla Clean Shrug (ustawienie), Snatch Shrug, Rack Delivery.
- Następny krok: hasło „Press” w bibliotece Catalyst + drugie źródło (Overhead Press bez pracy nóg); dla shrugów — podręcznik NSCA (szczebel 3), gdy dostępny.
- Pułapki: IronMind „Clean Deadlift & Shrug” to inny start i tempo niż Clean Shrug Catalyst; Eleiko „Hang Clean Shrug” to wysoki ciąg (łokcie w górę) i szczebel 5; SPRINZ/AUT — 403.
