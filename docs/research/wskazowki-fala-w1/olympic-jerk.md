# Wskazówki techniki — rodzina olympic: podrzut (jerk)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3).
Zakres: Split Jerk, Power Jerk, Squat Jerk, Jerk Dip Squat, Jerk Balance (dziś zestaw ogólny „pushPress” albo brak w `lib/figures/v2/cue-sets.json`).
Status: tylko zebrane dane (polecenie właściciela 02.11.2026) — nic nie jest wdrożone. Metoda jak w docs/research/27 i 33: każde zdanie
w danym ćwiczeniu ma ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji; zdania własne, część wspólna źródeł; bez liczb i twierdzeń o zdrowiu.

Dostęp: ExRx (403) i web.archive.org nie były używane; strona uczelniana z kartą CSCCa (educ.jmu.edu) — host niedostępny w tej sesji;
strona uczelniana Wellesley — 403. Strony aplikacji treningowych pominięto (nie są źródłem). Strona sklepu/szkoleń trenera olimpijskiego
(seminaria, programy) przeczytana, ale zakwalifikowana jako szczebel 5 — nie liczy się (patrz „Otwarte”).

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Split Jerk | gotowe | 3 organizacje (Catalyst, Eleiko, CrossFit); 2 zdania istniejące nie pasują słowo w słowo (pp.setup — szerokość chwytu bez źródła; pp.dip — patrz nowe olympic.dip); pp.legs pasuje |
| Power Jerk | gotowe | Eleiko ma stronę „Push Jerk – Barbell” — wariant nazwy (Catalyst: nazwy power/push jerk bywają używane zamiennie; różnica — czy stopy się przestawiają); CrossFit: power jerk = stopy z szerokości bioder na szerokość barków |
| Squat Jerk | gotowe | 2 organizacje (Catalyst, CrossFit); pp.legs tylko 1 źródło — nie wpisane |
| Jerk Dip Squat | otwarte | tylko 1 organizacja (Catalyst); UWAGA: dzisiejszy zestaw ogólny zawiera pp.legs („siła wybicia…”), a źródło mówi wprost, że w tym ćwiczeniu nie ma wybicia — patrz „Otwarte” |
| Jerk Balance | otwarte | tylko 1 organizacja (Catalyst); inne znalezione opisy to blogi trenerów (szczebel 5) albo serwisy, których nie przeczytano |

## 2. Dane (propozycja)

```json
{
  "sources": {
    "catalyst-60": {"org": "Catalyst Athletics", "title": "Split Jerk (Exercise Library #60)", "url": "https://catalystathletics.com/exercise/60/Split-Jerk", "level": 4},
    "catalyst-72": {"org": "Catalyst Athletics", "title": "Power Jerk (Exercise Library #72)", "url": "https://catalystathletics.com/exercise/72/Power-Jerk/", "level": 4},
    "catalyst-75": {"org": "Catalyst Athletics", "title": "Squat Jerk (Exercise Library #75)", "url": "https://catalystathletics.com/exercise/75/Squat-Jerk/", "level": 4},
    "catalyst-193": {"org": "Catalyst Athletics", "title": "Jerk Balance (Exercise Library #193)", "url": "https://catalystathletics.com/exercise/193/Jerk-Balance/", "level": 4},
    "catalyst-194": {"org": "Catalyst Athletics", "title": "Jerk Dip Squat (Exercise Library #194)", "url": "https://catalystathletics.com/exercise/194/Jerk-Dip-Squat/", "level": 4},
    "eleiko-659c5689": {"org": "Eleiko", "title": "Split Jerk – Barbell", "url": "https://eleiko.inspire360.com/resource/659c5689126db289c70119d6", "level": 4},
    "eleiko-659c5377": {"org": "Eleiko", "title": "Push Jerk – Barbell", "url": "https://eleiko.inspire360.com/resource/659c5377bb34667a190b10a0", "level": 4},
    "crossfit-jerk": {"org": "CrossFit", "title": "Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)", "url": "https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk", "level": 4}
  },
  "orgs": {
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (G. Everett, szkolenie trenerów podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "CrossFit": {"name": "CrossFit — Essentials (materiały edukacyjne organizacji szkolącej trenerów)", "level": 4, "kind": "org"}
  },
  "exercises": {
    "Split Jerk": {
      "setup": [
        {"c": "olympic.jerkSetup", "s": [["catalyst-60", "opis (heels approximately hip-width; jerk rack position)"], ["eleiko-659c5689", "Start Position (jumping stance)"], ["crossfit-jerk", "Split Jerk — setup (jumping/jerk position, hip-width; shelf of the shoulders)"]]}
      ],
      "move": [
        {"c": "olympic.splitMove", "s": [["catalyst-60", "opis (dip, drive, push the bar up, move the feet into the split, punch the elbows)"], ["eleiko-659c5689", "Procedure (dip, extend, press while dropping under, catch with arms straight in split stance)"], ["crossfit-jerk", "Split Jerk — receive (punches body into a lunge)"]]}
      ],
      "tips": [
        {"c": "olympic.dip", "s": [["catalyst-60", "opis (bending at the knees only with the trunk vertical)"], ["crossfit-jerk", "Split Jerk — dip (straight, smooth, and short)"]]},
        {"c": "pp.legs", "s": [["catalyst-60", "opis (drive with the legs; as you finish the extension of the legs, push with the arms)"], ["eleiko-659c5689", "Coaching Key (initiate with your legs)"]]},
        {"c": "olympic.feetHands", "s": [["eleiko-659c5689", "Coaching Key (feet and hands finish at the same time)"], ["catalyst-60", "opis (move the feet into the split as you punch the elbows)"]]},
        {"c": "olympic.recover", "s": [["catalyst-60", "opis (recover to standing with the bar still overhead)"], ["eleiko-659c5689", "Procedure (stand tall, then lower)"]]}
      ],
      "mistakes": [
        {"c": "olympic.mis.forward", "s": [["crossfit-jerk", "Common Faults — Fault #2 (drives the barbell out front)"], ["catalyst-60", "opis (drive straight back up)"]]},
        {"c": "olympic.mis.armsEarly", "s": [["eleiko-659c5689", "Coaching Key (no pushing with the arms until the hips are fully extended)"], ["catalyst-60", "opis (arms only as the legs finish extending)"]]},
        {"c": "olympic.mis.pressOut", "s": [["crossfit-jerk", "Common Faults — Fault #1 (presses the bar out)"], ["eleiko-659c5689", "Procedure (catch it overhead with your arms straight)"]]}
      ]
    },
    "Power Jerk": {
      "setup": [
        {"c": "olympic.jerkSetup", "s": [["catalyst-72", "opis (heels hip-width; jerk rack position)"], ["eleiko-659c5377", "Start Position (wariant nazwy: push jerk)"], ["crossfit-jerk", "Push (Power) Jerk — feet from hip width"]]}
      ],
      "move": [
        {"c": "olympic.powerMove", "s": [["catalyst-72", "opis (feet into squat stance; partial squat above parallel)"], ["crossfit-jerk", "Push (Power) Jerk — feet hip→shoulder width; parallel or above parallel squat"], ["eleiko-659c5377", "Procedure (drop under, catch with arms straight; wariant nazwy)"]]}
      ],
      "tips": [
        {"c": "olympic.dip", "s": [["catalyst-72", "opis (knees only, trunk vertical)"], ["crossfit-jerk", "dip — opis wspólny dla stylów (straight, smooth, short)"]]},
        {"c": "pp.legs", "s": [["catalyst-72", "opis (drive with the legs; arms as the legs finish)"], ["eleiko-659c5377", "Coaching Key (initiate with your legs)"]]},
        {"c": "olympic.feetHands", "s": [["eleiko-659c5377", "Coaching Key (feet and hands finish at the same time)"], ["catalyst-72", "opis (move the feet as you punch the elbows)"]]},
        {"c": "olympic.recover", "s": [["catalyst-72", "opis (recover to standing with the bar still overhead)"], ["eleiko-659c5377", "Procedure (stand tall, then lower)"]]}
      ],
      "mistakes": [
        {"c": "olympic.mis.forward", "s": [["crossfit-jerk", "Common Faults — Fault #2"], ["catalyst-72", "opis (drive straight back up)"]]},
        {"c": "olympic.mis.armsEarly", "s": [["eleiko-659c5377", "Coaching Key"], ["catalyst-72", "opis (arms as the legs finish)"]]},
        {"c": "olympic.mis.pressOut", "s": [["crossfit-jerk", "Common Faults — Fault #1"], ["eleiko-659c5377", "Procedure (catch it overhead with your arms straight)"]]}
      ]
    },
    "Squat Jerk": {
      "setup": [
        {"c": "olympic.jerkSetup", "s": [["catalyst-75", "opis (heels hip-width; jerk rack position)"], ["crossfit-jerk", "setup — jumping/jerk position, hip-width (opis wspólny dla stylów)"]]}
      ],
      "move": [
        {"c": "olympic.squatMove", "s": [["catalyst-75", "opis (punch the elbows overhead, drive yourself down into a squat; recover with the bar overhead)"], ["crossfit-jerk", "Squat Jerk — receive (full-depth squat) and recovery (overhead squat)"]]}
      ],
      "tips": [
        {"c": "olympic.dip", "s": [["catalyst-75", "opis (knees only, trunk vertical)"], ["crossfit-jerk", "dip — opis wspólny dla stylów"]]},
        {"c": "olympic.recover", "s": [["catalyst-75", "opis (recover into a standing position with the bar overhead)"], ["crossfit-jerk", "Squat Jerk — recovery (overhead squat)"]]}
      ],
      "mistakes": [
        {"c": "olympic.mis.forward", "s": [["crossfit-jerk", "Common Faults — Fault #2 (wspólne dla stylów)"], ["catalyst-75", "opis (drive straight back up)"]]}
      ]
    }
  }
}
```

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| olympic.jerkSetup | Sztanga oparta z przodu barków, stopy jak do wyskoku — mniej więcej na szerokość bioder. | Bar resting on the front of your shoulders, feet set like for a jump — about hip-width. |
| olympic.splitMove | Ugnij kolana, mocno wybij nogami w górę i wypychając sztangę nad głowę, przeskocz do wykroku; złap ją na prostych rękach. | Dip at the knees, drive hard up with your legs and, as you push the bar overhead, jump your feet into a split; catch it on straight arms. |
| olympic.powerMove | Ugnij kolana, mocno wybij nogami i wypychając sztangę nad głowę, przestaw stopy trochę szerzej; złap ją na prostych rękach w płytkim przysiadzie, nie niżej niż do równoległego ud. | Dip at the knees, drive hard with your legs and, as you push the bar overhead, move your feet a bit wider; catch it on straight arms in a partial squat, no lower than thighs parallel. |
| olympic.squatMove | Ugnij kolana, mocno wybij nogami i wypychając sztangę nad głowę, zejdź pod nią do pełnego przysiadu; złap ją na prostych rękach i wstań. | Dip at the knees, drive hard with your legs and, as you push the bar overhead, drop under it into a full squat; catch it on straight arms and stand up. |
| olympic.dip | Ugięcie krótkie i proste — uginasz kolana, tułów zostaje pionowo. | Keep the dip short and straight — bend the knees, torso stays upright. |
| olympic.feetHands | Stopy lądują w tej samej chwili, w której ręce prostują się nad głową. | Your feet land at the same moment your arms lock out overhead. |
| olympic.recover | Wstań ze sztangą wciąż nad głową i dopiero wtedy ją opuść. | Stand up with the bar still overhead, and only then lower it. |
| olympic.mis.forward | Wybijanie sztangi w przód zamiast prosto w górę. | Driving the bar forward instead of straight up. |
| olympic.mis.armsEarly | Wypychanie rękami, zanim nogi skończą wybicie. | Pushing with the arms before the legs finish the drive. |
| olympic.mis.pressOut | Łapanie sztangi na ugiętych rękach i dociskanie jej do góry. | Catching the bar on bent arms and pressing it out. |

Istniejące zdanie użyte: `pp.legs` (pasuje słowo w słowo do Split Jerk i Power Jerk). Nie użyte: `pp.setup` (szerokość chwytu bez źródła
dla podrzutu), `pp.dip` („tułów napięty” — w źródłach o podrzucie tylko Catalyst; zastąpione `olympic.dip`), `ohp.*`, `fsq.*` (inne ćwiczenia).

## 4. Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| catalyst-60 | https://catalystathletics.com/exercise/60/Split-Jerk | Catalyst Athletics (nowa) | 4 | cały opis (stopy, pozycja sztangi, ugięcie, wybicie, wykrok, powrót), Notes, Variations |
| catalyst-72 | https://catalystathletics.com/exercise/72/Power-Jerk/ | Catalyst Athletics | 4 | cały opis + Notes (power vs push jerk; głębokość powyżej równoległości) |
| catalyst-75 | https://catalystathletics.com/exercise/75/Squat-Jerk/ | Catalyst Athletics | 4 | cały opis + Notes |
| catalyst-193 | https://catalystathletics.com/exercise/193/Jerk-Balance/ | Catalyst Athletics | 4 | opis, Notes (najczęstsze błędy), Purpose |
| catalyst-194 | https://catalystathletics.com/exercise/194/Jerk-Dip-Squat/ | Catalyst Athletics | 4 | opis, Notes („strictly about strength and position—it does not involve a drive”), Purpose |
| eleiko-659c5689 | https://eleiko.inspire360.com/resource/659c5689126db289c70119d6 | Eleiko (istniejąca) | 4 | Start Position, Procedure, Coaching Key („The feet and hands finish at the same time.”) |
| eleiko-659c5377 | https://eleiko.inspire360.com/resource/659c5377bb34667a190b10a0 | Eleiko | 4 | Start Position, Procedure, Coaching Key |
| crossfit-jerk | https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk | CrossFit (nowa) | 4 | opisy stylów push/power, split, squat; Common Faults #1 („The lifter presses the bar out to complete the lift.”) i #2 („The lifter drives the barbell out front.”) |

Uwaga do org „CrossFit”: organizacja szkoląca trenerów, nie aplikacja — zgodne z wyjątkiem dla wskazówek techniki; w aplikacji i tak bez nazw.

## 5. Otwarte

- **Jerk Dip Squat** — tylko Catalyst. Do tego **dzisiejszy zestaw ogólny jest merytorycznie sprzeczny ze źródłem**: zawiera `pp.legs`
  („Siła wybicia idzie z nóg i bioder — ręce kończą ruch”), a catalyst-194, Notes, mówi, że w tym ćwiczeniu nie ma wybicia ani szybkości.
  Rekomendacja dla koordynatora: usunąć `pp.legs` z zestawu „Jerk Dip Squat” (błędne twierdzenie → wg progu wydania WYSOKIE). `pp.dip`
  („ugięcie krótkie, tułów napięty”) — źródło mówi o kontrolowanym zejściu; zgodne kierunkowo, ale tylko 1 źródło.
- **Jerk Balance** — tylko Catalyst (ustawienie w częściowym wykroku, wykrok przednią nogą, tylna stopa cały czas na podłodze; błąd:
  „diving the chest forward rather than stepping into the split”). Drugie źródło szczebla 4 nie znalezione (opisy znalezione przez wyszukiwarkę
  — blogi trenerów i serwisy, nieprzeczytane albo szczebel 5).
- **Squat Jerk — `pp.legs`**: tylko Catalyst wprost (CrossFit mówi o „aggressive, vertical drive”, bez kolejności nogi → ręce). Dzisiejszy
  zestaw ogólny ma `pp.dip` i `pp.legs` — przy przejściu na własne wskazówki oba wypadają (zastąpione `olympic.dip`).
- **Split Jerk — powrót z wykroku** (najpierw przednia stopa pół kroku w tył, potem tylna): tylko CrossFit — nie wpisane.
- **Split Jerk — błędy z poradnika trenera** (płytkie ugięcie, nierówny wykrok, za wąskie ustawienie): store.torokhtiy.com/blogs/exercises/split-jerk-exercise,
  „4 Common Split Jerk Mistakes” — strona szkoleń i programów trenera, zakwalifikowana jako szczebel 5; bez drugiego źródła szczebla 4.
- **Power Jerk — Eleiko „Push Jerk”**: liczone jako wariant nazwy; jeśli audytor uzna push jerk (stopy bez ruchu) za inne ćwiczenie, Power Jerk
  i tak ma 2 organizacje (Catalyst, CrossFit) dla `olympic.jerkSetup`, `olympic.powerMove`, `olympic.dip`, `olympic.mis.forward`; wtedy
  `pp.legs`, `olympic.feetHands`, `olympic.recover`, `olympic.mis.armsEarly`, `olympic.mis.pressOut` mają tylko 1 źródło.
- Karta CSCCa „Split Jerk” (educ.jmu.edu) — host niedostępny w sesji; do sprawdzenia przy kolejnej okazji jako możliwe drugie źródło dla Jerk Balance/powrotu.

## 6. Stan

- Zrobione: 5 ćwiczeń przejrzanych; 3 gotowe (Split, Power, Squat Jerk), 2 otwarte (Jerk Dip Squat, Jerk Balance); 10 nowych zdań; 8 nowych źródeł, 2 nowe orgs.
- Zostało: drugie źródło dla Jerk Dip Squat i Jerk Balance; decyzja o usunięciu `pp.legs` z zestawu ogólnego „Jerk Dip Squat”.
- Pułapki: ExRx/Wayback niedostępne; Catalyst ma różne numery stron — #62 to „Hang Snatch”, nie podrzut.
