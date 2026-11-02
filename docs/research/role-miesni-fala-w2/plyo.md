# Role mięśni — rodzina plyo, fala W2 (grupa G3 „moc”)

Data: 02.11.2026 · Autor: badacz-merytoryczny (W2, G3) · Tylko zbieranie danych — bez zmian w kodzie, `data/zrodla/*.json` i testach.
Stan W1 (55 par gotowych: skoki w górę/w przód) — bez ponownego badania.

## Jak liczone są wiersze (z katalogu, bez zgadywania)

Wiersz (ćwiczenie × mięsień) istnieje, gdy po `muscleLoadOf` (`lib/seed.ts:153–162`) udział ≥ 0,5 (`MUSCLE_MIN_LOAD`, filtr w
`lib/muscleRoles.ts:57`). Ważne: `muscleLoadOf` **usuwa** region z udziałem ≥ 0,5, jeśli jego partia (`REGION_MUSCLE`, `lib/seed.ts:148`) nie jest
w partiach głównych/pomocniczych ćwiczenia (`lib/seed.ts:157`; partie z wiersza `CATALOG_LIB_EXTRA` w `lib/catalog.generated.ts`). Odwodziciele
to partia „pośladki”. Udziały: `lib/catalog.generated.ts:1255–1295`; partie: `lib/catalog.generated.ts:1931–1971`.

Skutek względem listy otwartych z W1: **Double Leg Butt Kick i Box Skip nie mają wiersza dwugłowych** (udział 0,5, ale „dwugłowe” poza partiami
— `lib/catalog.generated.ts:1939, 1953`), więc nie ma czego opisywać. Wiersz dwugłowych ma tylko Single Leg Butt Kick (`:1940`).

## Tabela wierszy po W2

| Ćwiczenie | Wiersze (region rola) | Status po W2 |
|---|---|---|
| Side Standing Long Jump | quads main, glutes aux, calves aux | quads, calves → **gotowe warunkowo** (N-W2-1, N-W2-2); glutes otwarte |
| Lateral Box Jump | quads main, glutes aux, calves aux | j.w. |
| Lateral Cone Hops | quads main, calves aux, glutes aux | j.w. |
| Alternate Leg Diagonal Bound | quads main, glutes aux, calves aux | j.w. |
| Side to Side Box Shuffle | quads main, calves aux | quads, calves → gotowe warunkowo |
| Side Hop-Sprint | quads main, calves aux | quads, calves → gotowe warunkowo |
| Single-Leg Lateral Hop | quads main, calves aux, abductors aux | quads, calves → gotowe warunkowo; abductors otwarte (jedno źródło) |
| Lateral Bound | glutes main, quads aux, adductors aux, abductors aux | quads → gotowe warunkowo; glutes, adductors otwarte; abductors otwarte (jedno źródło) |
| Kneeling Jump Squat | glutes main, quads aux, hamstrings aux | otwarte (bez nowego źródła) |
| Single Leg Butt Kick | hamstrings aux | otwarte — jedno źródło szczebla 4 (W2G3-S3) |
| Double Leg Butt Kick, Box Skip | (brak wiersza dwugłowych) | nie dotyczy |

Razem: 27 wierszy; gotowe warunkowo 15 (quads 8, calves 7); otwarte 12 (glutes 5, abductors 2, adductors 1, Kneeling Jump Squat 3, Butt Kick 1).

„Warunkowo” = dwa niezależne źródła szczebla 3 o wybiciu w bok (krok w bok na różne odległości; zwrot w bok z biegu), nie o tym konkretnym
ćwiczeniu. Przeniesienie z wybicia w bok na skoki w bok uznaję za ten sam mechanizm (tak jak W1 przeniosła box jump na tuck jump); recenzent może
uznać je za analogię → wtedy „uproszczenie”, nie wyświetlane. Drugie źródło (W2G3-S2) to materiały konferencyjne — jeśli recenzent obniży je
poniżej szczebla 3, zostaje „jedno źródło”.

## Propozycje `nameRules` (format `data/zrodla/role-miesni.json`)

```json
[
  {
    "id": "N-W2-1",
    "muscle": "quads",
    "roles": ["main", "aux"],
    "function": "quads.knee_ext",
    "zrodla": ["W2G3-S1", "W2G3-S2", "S2", "S12"],
    "uzasadnienie": "wybicie w bok = wyprost kolana (Inaba 2013: momenty i praca prostowników biodra, kolana i stawu skokowego; Suzuki 2011: prostowniki kolana generują energię w podporze)",
    "exercises": [
      "Side Standing Long Jump", "Lateral Box Jump", "Lateral Cone Hops", "Alternate Leg Diagonal Bound",
      "Side to Side Box Shuffle", "Side Hop-Sprint", "Single-Leg Lateral Hop", "Lateral Bound"
    ]
  },
  {
    "id": "N-W2-2",
    "muscle": "calves",
    "roles": ["main", "aux"],
    "function": "calves.plantar_flex",
    "zrodla": ["W2G3-S1", "W2G3-S2", "S2", "S15"],
    "uzasadnienie": "wybicie w bok = zgięcie podeszwowe stopy (Inaba 2013: praca w stawie skokowym; Suzuki 2011: zginacze podeszwowe generują energię w podporze)",
    "exercises": [
      "Side Standing Long Jump", "Lateral Box Jump", "Lateral Cone Hops", "Alternate Leg Diagonal Bound",
      "Side to Side Box Shuffle", "Side Hop-Sprint", "Single-Leg Lateral Hop"
    ],
    "pominiete": { "Lateral Bound": "łydki 0,25 — brak wiersza" }
  }
]
```

Uwaga integracyjna: N-W2-1/N-W2-2 można dopisać do list reguł W1 (`quads.knee_ext`, `calves.plantar_flex`) zamiast tworzyć nowe — wtedy usunąć
te nazwy z `pominiete` w regule W1 i dopisać źródła W2G3-S1/S2. Zdania jak w W1 (wariant „_”): „Prostuje kolano.”, „Pomaga unosić piętę.”

## Źródła

| id | adres | autorzy / organizacja | szczebel | miejsce i cytat |
|---|---|---|---|---|
| W2G3-S1 | https://pubmed.ncbi.nlm.nih.gov/22923416/ | Inaba Y, Yoshioka S, Iida Y, Hay DC, Fukashiro S (Univ. of Tokyo). A biomechanical study of side steps at different distances. J Appl Biomech 2013;29(3):336–45 | 3 (recenzowane badanie) | Abstract: „Extension torques and work done at hip, knee, and ankle joints contributed substantially”; o odwiedzeniu: „The main roles of hip abduction torque and work were to accelerate the center of mass laterally” (i utrzymanie tułowia, bez dużej mocy napędowej) |
| W2G3-S2 | https://ojs.ub.uni-konstanz.de/cpa/article/view/4897/4540 | Suzuki Y, Ae M, Takenaka S, Fujii N (Univ. of Tsukuba). Kinetics of the support leg joints in the side step cutting technique. ISBS 2011, Portuguese Journal of Sport Sciences 11 (Suppl. 2), s. 563 | 3 (materiały konferencyjne ISBS w suplemencie czasopisma; do oceny recenzenta) | Streszczenie, s. 563: „The negative and positive powers exerted by the ankle plantar flexors and knee extensors absorbed and generated the mechanical energy during the support phase in the cutting motion. The hip seemed not to generate great energy but to control the body posture, especially in directions 60° and 90°.” |
| W2G3-S3 | https://www.healthline.com/health/exercise-fitness/butt-kicks | autorka A. Marcin; recenzent D. Bubnis, M.S., NASM-CPT; data 24.07.2019 | 4 warunkowo (nazwany recenzent z kwalifikacjami i data — reguła ogólna z `szczeble`, uzupełnienie dot. serwisów z recenzją) | krok 2: „Slowly bring your right heel to your buttocks by contracting your hamstring muscle.” |
| S2, S12, S15 | jak w `data/zrodla/role-miesni.json` | anatomia | jak w pliku | funkcje quads.knee_ext, calves.plantar_flex |

Niezależność S1/S2: różne zespoły i uczelnie (Tokio vs Tsukuba).

## Otwarte

- [OTWARTE] **glutes (hip_ext) w skokach w bok** (5 wierszy: Side Standing Long Jump, Lateral Box Jump, Lateral Cone Hops, Alternate Leg Diagonal
  Bound — aux; Lateral Bound — main): sprzeczność na szczeblu 3 — W2G3-S1: praca prostowników biodra znaczna; W2G3-S2: biodro przy zwrocie 60–90°
  głównie kontroluje postawę. Część wspólna nie daje zdania „prostuje biodro” → bez opisu.
- [OTWARTE] **abductors (hip_abd) — Single-Leg Lateral Hop, Lateral Bound**: jedno źródło (W2G3-S1: odwiedzenie przyspiesza środek ciężkości w bok).
  Badanie EMG (pośladkowy średni ok. 85% MVIC w skoku w bok V2 — tylko streszczenie z wyszukiwarki, nieprzeczytane) mówi o aktywności, nie o ruchu.
  Do tego zdanie „Pomaga odsuwać nogę w bok” przy nodze podporowej opisuje ruch słabo (to miednica odsuwa się od stopy) — sprawa tekstu dla tłumacza.
- [OTWARTE] **adductors — Lateral Bound**: brak przeczytanego źródła.
- [OTWARTE] **Kneeling Jump Squat** (3 wiersze): brak opisu ruchu; nie szukane ponownie w W2 (W1: dwie sesje).
- [OTWARTE] **Single Leg Butt Kick, hamstrings aux** (`hamstrings.knee_flex`): jedno źródło szczebla 4 (W2G3-S3); pozostałe wyniki to strony aplikacji
  i serwisy bez autora (szczebel 5, nie liczą się).
- Szukane bez wyniku: badanie pracy mięśni przy ciągnięciu sań tyłem (praca magisterska Massey 2019 — EMG bez nazw mięśni w streszczeniu) —
  dotyczy `sled_throw.md`.

## Stan

Zrobione: liczenie wierszy plyo z katalogu; quads/calves skoków w bok (gotowe warunkowo); Butt Kick (jedno źródło).
Zostało: glutes/abductors/adductors w skokach w bok, Kneeling Jump Squat.
Następny krok: recenzent ocenia przeniesienie (wybicie w bok → skoki w bok) i szczebel W2G3-S2; pełny tekst Inaba 2013 (J Appl Biomech) — czy
„side step” to skok z odbicia jednonóż, i czy podaje rozkład pracy biodro/kolano/staw skokowy.
Pułapki: PDF z ISBS otwiera się tylko jako plik (WebFetch zwraca binaria, czytać przez Read z `pages`).
