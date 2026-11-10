# Recenzja niezależna rodziny forearm — partia 5, runda r1 (audytor, 10.11.2026)

Stan zamrożony: gałąź `figury/partia-5` @ `f0e4c57` (worktree odłączony), baza K14 `13a3eb7`. Autor: programista (subagent, sesja session_01T66VByZrLpWxNF8yF3gpgu). Recenzent: audytor (subagent), nie pisał rodziny.
Arkusze: `scripts/figures/arkusz-slad.mjs` — 11 ćwiczeń × side, 21 kadrów; `arkusz-nakladka.mjs` — 4 ćwiczenia + pozy błędu. Liczby z `frameAt` (sonda Jest, usunięta). Skróty: `node scripts/zrodla-runtime.mjs --skroty` w worktree recenzenta: v2.forearm `3adcb03ac869`; `liczba` = 13 (`assignAll()`, w tym Wrist Roller i Plate Pinch bez rysunku). Inne rodziny: skróty bez zmian względem 13a3eb7.

**Werdykt rodziny: do poprawy** (W1 WYSOKIE).

## Znaleziska

| # | Klasa | Pewność | Ćwiczenie | Opis i miara | Realność |
|---|---|---|---|---|---|
| W1 | WYSOKIE | 90% | Behind-the-Back Barbell Wrist Curl | Dłoń zwrócona do ciała: `palm` = [1,0; −0,1; −0,2] (przód = +x). Zgięcie −30° → +50° przesuwa sztangę **8,9 cm ku ciału** (x −21,3 → −12,4) i tylko 1,7 cm w górę (y 80,2 → 81,9); odstęp od ciała 10,7 → 1,8 cm. Źródła w repo (`docs/research/etap2/wyniki-2026-11-03/wyniki-uzup-1a.json`): WTG — „grasp the barbell using a shoulder-width pronated (overhand) grip” stojąc tyłem do stojaka (dłonie do tyłu); kasmaker — „curl your wrists so it travels up and slightly back”. Kierunek ruchu jest odwrotny do źródeł, a zestaw (wr.range: „zegnij nadgarstek w górę”) nie pasuje do rysunku. Poprawka ramienia 22° → 28° w tył leczy objaw (styk z udem), nie przyczynę. Komentarz w generatorze (`forearm.mjs:73` „dłoń zgina się do tyłu”) przeczy wektorowi (`+ sin(n)·0,978` w x = do przodu). Test odtwarzający: `dot(palm, front) < 0` i `grip.x(u=1) < grip.x(u=0)`. Uwaga dla poprawki: przy dobrym chwycie wyprost na starcie (−30°) zbliży sztangę do pośladków — sprawdzić odstęp w u = 0. | realny (każde otwarcie karty) |
| S1 | ŚREDNIE | 85% | Reverse Plate Curls | Talerz w rzucie z boku zawsze pionowy (`lib/figures/v2/draw.ts:476`; obręcz w płaszczyźnie YZ — `colliders.ts:180`), a przedramię obraca się o 104° (z 66° w dół do 38° w górę) przy zgięciu nadgarstka 0 i stałym obrocie −70°. Przy sztywnym chwycie talerz musiałby obracać się razem z dłońmi (u = 0,5: przedramię poziomo, talerz pionowo, nachwyt na pionowej obręczy). Środek talerza jest w chwycie (ślad poprawny). Ograniczenie silnika; do decyzji: backlog albo K3. Odpowiedź na pytanie (4): pasek czytelny jako talerz, orientacja niespójna z chwytem. | realny, ale mało widoczny (cienki pasek) |
| S2 | ŚREDNIE | 85% | 7 uginań siedząc | wr.range: „Opuść ciężar tak nisko, jak pozwala nadgarstek” — dół ruchu −32° (uginanie) / +40° (odwrotne); limit silnika nadgarstka −65 / +75 (`skeleton.ts:36`). Kierunek zgodny, zakres ≥ 50° spełniony (84° / 88°), ale dolne położenie to ok. połowa zakresu stawu (jak W4 curl: tekst o końcu zakresu vs liczba). | realny |
| S3 | ŚREDNIE | 85% | Dumbbell Lying Pronation / Supination | Nazwa „Lying” (leżąc), rysunek na siedząco (łokieć przy kolanie) — znana analogia (`figury-sens.json` otwarte_czesciowo), ale widoczna sprzeczność z nazwą; brak wyjątku K3. Obrót czytelny (oś hantla „\\” → „I” → „/”, roll +70 → −70, łokieć 75,7° stały), kierunki zgodne z nazwami (pronacja: dłoń w górę → w dół). Oba ćwiczenia to ta sama pętla wahadła — różnią się tylko pozycją startową. Odpowiedź na pytanie (3). | realny |
| N1 | NISKIE | 90% | 7 uginań siedząc | Łokieć w 3D z boku uda: z 30,4 vs udo z 8,5–13,8; odległość przedramię–oś uda 15–22 cm (suma promieni ok. 13). W jedynym rzucie (side) przedramię leży na udzie, łokieć „nie pływa” (≤ 0,8 cm). Ważne dopiero przy rzucie z przodu. | teoretyczny dla UI |
| N2 | NISKIE | 85% | 7 uginań (poza błędu wr.mis.lift) | Błąd „przedramiona odrywają się od podparcia”: łokieć przesuwa się 9,2 cm do przodu i **opada** 3,5 cm (y 62,2 → 58,7), uchwyt wyżej o 7,7 cm — czyta się jako uniesienie przodu przedramienia, nie oderwanie łokcia. | realny, czytelność |

## Pytania autora
1. Behind-the-Back — W1 (dłoń ku ciału jest błędem). Styk: obecnie min. 1,8 cm (test `figury-forearm-ruch` ≥ 1 cm).
2. Reverse (sztanga, hantle, one-arm): dłoń w dół (`palm` y = −1,0), +40° → −48°, wyprost unosi ciężar 9,7 cm — **zgodne**.
3. Pronation/Supination — S3.
4. Talerz — S1. Podparcie: łokieć nieruchomy (≤ 0,8 cm, kąt 116,9–117,1°); ciężar w dłoni: ślad w chwycie we wszystkich 11 (0 cm).

## Nakładka (`lib/figures/v2/overlay/forearm.ts`)
`forearmWristLimb` (nadgarstek_zakres, „ustalone (kierunek)”, cue wr.range — na karcie 8 uginań; łuk = measuredAngle ±1°, tylko side) i `forearmElbowPlumb` (lokiec_przy_tulowiu, curl.elbows — tylko Reverse Plate Curls; błąd curl.mis.elbows koloruje pion) — zgodne z zasadami. Nowy `case 'wristFlex'` w `limbTriple` (`overlay.ts:77`) używany tylko przez forearm; skróty innych rodzin bez zmian. Przy Behind-the-Back łuk pokazuje poprawny kąt, ale ruch jest błędny (W1).

## Zestawy (K12)
7 uginań + Reverse Plate Curls — zgodne z rysunkiem (wpisy „wyswietlana”, One-Arm Dumbbell Reverse Wrist Curl odświeżony, sha `8b1a50266007` bez zmian). Behind-the-Back — „do poprawy” (W1). Pronation/Supination — zestaw „open”, bez wpisu. Karty własne: brak (`lib/cues/data.json`); v1: brak wpisów.

## K14 — `git diff 13a3eb7..f0e4c57 -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-data | staw mierzony per ćwiczenie (FOREARM_JOINT); kierunek malejący dla Reverse Wrist Curl i Pronation | zgodne z danymi i anatomią (wyprost, pronacja +70 → −70); nie poluzowanie |
| figures-v2-zgodnosc-wsteczna + zlote.json | odciski 8 póz | zmienione tylko 8 wpisów forearm/* (7 uginań + Behind-the-Back); uzasadnione |
| tor-wyjatki.json | Reverse Plate Curls\|side | łuk: r 33,0 cm, Δθ 99,3° → r(1−cos 49,7°) = 11,6 cm, autor 12,7 cm — spójne; przyjęte |
| figury-generator-odtwarza | forearm z ROZJAZDY do W_ZAKRESIE | zaostrzenie |
| mapping, nakladka-triceps-olympic, skrot-v2-wynik, strona-eksport | liczby/listy +forearm (11, 243) | zgodne z rysunkiem (11 z 13) |
| figury-forearm-ruch (nowy) | styk ≤ próg, zakres ≥ 50°, odstęp Behind-the-Back ≥ 1 cm | próg zakresu z reguły; brak testu kierunku (W1) |
| nakladka-forearm (nowy) | 23 testy — przechodzą | bez uwag |

## Sprawdzone bez znalezisk
Orientacja hantli (oś poprzeczna przy pod- i nachwycie, K6), wyciąg (kierunek linki), łokieć i tułów nieruchomo w uginaniach, Reverse Plate Curls (łokieć 23,7° → 123° — reguła lokiec_zgina_sie ≤ 30 / ≥ 100; łokieć ≤ 2,7 cm od pionu barku), przenikanie ciężaru (test przechodzi), teksty faz przez DATA_UI.
