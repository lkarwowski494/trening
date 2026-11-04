# Plan recenzji rodzin figur v2 — linia 1.1

Data: 03.11.2026. Autor: agent planujący (zlecenie koordynatora 1.1). Źródło zakresu: decyzja właściciela 03.11.2026 ~19:10 PL, wariant A
(`docs/18-przekazanie.md:216`): 1.1 = pełna karta (wskazówki + role mięśni + rysunek v2 po recenzji ruchu ze śladem toru) dla wszystkich ćwiczeń
z warstwą tekstową; ćwiczenia bez rysunku z założenia i bez kompletu źródeł → 1.2.

Stan bazowy: `integracja-1-1`, ready 4/43 rodzin (`lib/figures/v2/families.ts:27-29,35`); rodzina `curl` podłączona i zrecenzowana na gałęzi
`figury/curl-wspolne` @ cf5e04a8 (worktree `/home/user/wt-curl-b`, `lib/figures/v2/families.ts` +1 linia, `poseData.ts` +2), w kolejce verify.

## 1. Definicje (plik:linia)

- **Pełna karta (standard 1.1):** wskazówki (ustawienie + ruch; własne albo zrecenzowany zestaw ogólny) + role mięśni + rysunek v2 —
  decyzja 02.11.2026 `docs/18-przekazanie.md:154`, zawężona dla 1.1 w `:216`. Elementy liczy jedna funkcja `elementyKarty`
  (`scripts/pokrycie-katalogu.mjs:36-39`); uwaga: ta funkcja nadal liczy też częste błędy i animowany błąd (definicja Z3 z 31.10) — dla standardu
  „pełna karta” z 02.11 trzeba osobnej flagi bez tych dwóch elementów (otwarte → koordynator, ZB/backlog).
- **Wskazówki w kodzie:** `cueSelection` (`lib/figures/v2/cueSets.ts:26-32`): `own` = karta własna z `lib/cues/data.json` (źródła:
  `data/zrodla/cues.json`), `general` = zestaw ogólny wzorca (`lib/figures/v2/cue-sets.json`), `open` = bez tekstu. Na karcie zestaw ogólny
  liczy się tylko z wpisem recenzji „zestawy” i przy rysowanej figurze (`scripts/pokrycie-katalogu.mjs:73`).
- **Warstwa tekstowa (w tym planie):** ćwiczenie ma komplet źródeł na ustawienie i ruch wg zasad z 02–03.11 — wszystko poza stanami „brak” i „2 z 3”
  w `/home/user/etap2/stan-koncowy-0311.json` (poza repo; streszczenie `docs/research/etap2/wyniki-2026-11-03/STAN-POKRYCIA-0311.md`:
  708 ćw., komplet 377 + zestaw 48 + etap 2 50 + uproszczenie 20 + książka 18 = **513**; „2 z 3” 37; brak 158). Plik pochodzi z 09:00;
  rundy popołudniowe (`/home/user/etap2/wyniki-{r2a,r2b,r2c,2z3-calosc,p5a,p5b,p6,etap3,uz2a,uz2b}.*`, decyzje `docs/18-przekazanie.md:202,210-211`)
  jeszcze nie są wliczone — liczby niżej to **dolna granica**, przeliczyć przed każdą falą (pkt 5).
- **Bez rysunku z założenia:** `data/zrodla/figury-wyjatki.json` — rodziny `cardio`, `foam_roll`, `neck` + 46 ćwiczeń (m.in. Zottman ×2, W8).

## 2. Rodziny — stan i kolejka (malejąco wg ćwiczeń z warstwą tekstową i rysunkiem)

Liczby: jednorazowy skrypt `policz()` (`scripts/pokrycie-katalogu.mjs`) na `integracja-1-1` + `stan-koncowy-0311.json` (skrypty
skrypty pomocnicze poza repo). Kolumny: **ćw.** = przypisane (`assignAll`, `lib/figures/v2/families.ts:160`); **tekst** = z warstwą
tekstową, bez wyjątków rysunku; **bez póz** = z tekstem, ale bez wpisu w `poses/<rodzina>.json` (autor musi dorobić pozę); **bez ról** = z tekstem,
bez ról mięśni (`muscleRoleRows`); **2z3 / brak** = luka źródeł (→ 1.2, chyba że rundy popołudniowe ją domkną); **wyj.** = wyjątki rysunku;
**ryzyka** = cechy z danych póz, które w curl dały znaleziska (pary hantli / dwie linki → ślad W1b; `obrotPrzedramienia` → oś hantla H1;
`trzyma` → ślad jednorącz; przybliżenie z `sprzet`), `ogr.` = wpisy `do_przegladu` w `data/zrodla/figury-ograniczenia-silnika.json`.

| Rodzina | Status | ćw. | tekst | bez póz | bez ról | 2z3 | brak | wyj. | Dane | Ryzyka (pary / obrót / trzyma) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| hinge | ready | 32 | 32 | 0 | 0 | 0 | 0 | 0 | rig | — |
| bench_press | ready | 30 | 30 | 0 | 0 | 0 | 0 | 0 | rig | — |
| squat | ready | 25 | 25 | 0 | 1 | 0 | 0 | 0 | rig | — |
| pull_up | ready | 13 | 12 | 1 | 2 | 0 | 1 | 0 | pozy (11) | 0/0/1 |
| curl | gałąź (zrecenz.) | 36 | 31 | 0 | 0 | 1 | 4 | 2 (Zottman, W8) | pozy (34) | 12/32/7 |
| triceps | planned | 32 | 28 | 0 | 0 | 1 | 3 | 0 | pozy (29) | 5/12/7 |
| delt_raise | planned | 38 | 23 | 2 | 0 | 4 | 11 | 0 | pozy (30) | 13/17/8 |
| olympic | planned | 25 | 22 | 1 | 1 | 0 | 3 | 0 | pozy (23) | 0/0/0 |
| core_floor | planned | 44 | 21 | 7 | 7 | 1 | 21 | 1 | pozy (21) | 0/0/0 |
| pushup_plank | planned | 30 | 19 | 6 | 6 | 2 | 8 | 2 | pozy (17) | 0/0/0 |
| overhead_press | planned | 23 | 18 | 1 | 0 | 1 | 4 | 0 | pozy (21) | 5/21/10 |
| plyo | planned | 28 | 18 | 0 | **18** | 0 | 10 | 0 | pozy (27) | 1/0/0 |
| lunge | planned | 24 | 13 | 0 | 0 | 7 | 4 | 0 | pozy (24) | 5/0/3 |
| kb_ballistic | planned | 17 | 13 | 0 | 0 | 1 | 3 | 0 | pozy (16) | 0/0/14 |
| row | planned | 13 | 12 | 0 | 0 | 0 | 1 | 0 | pozy (12) | 3/12/3, ogr. 1 |
| chest_fly | planned | 20 | 12 | 1 | 0 | 2 | 6 | 0 | pozy (17) | 10/10/3 |
| leg_isolation | planned | 14 | 11 | 5 | 0 | 3 | 0 | 0 | pozy (8) | 0/0/8 |
| calf_raise | planned | 13 | 11 | 0 | 0 | 0 | 2 | 0 | pozy (12) | 2/0/5 |
| sled_throw | planned | 19 | 11 | 6 | 10 | 2 | 6 | 0 | pozy (8) | 0/0/1 |
| core_standing | planned | 19 | 10 | 1 | **10** | 1 | 8 | 0 | pozy (16) | 1/0/11 |
| mobility_floor | planned | 22 | 9 | 0 | **9** | 0 | 6 | 13 | pozy (9) | ogr. 2 |
| hip_bridge | planned | 11 | 8 | 0 | 0 | 1 | 2 | 0 | pozy (10) | 1/0/1 |
| mobility_stand | planned | 36 | 8 | 0 | **8** | 0 | 14 | 28 | pozy (8) | ogr. 1 |
| forearm | planned | 13 | 8 | 1 | 1 | 1 | 3 | 1 | pozy (11) | 2/11/4 |
| cable_row | planned | 10 | 7 | 0 | 0 | 0 | 3 | 0 | pozy (9) | 0/9/3, ogr. 1 |
| pulldown | planned | 7 | 7 | 0 | 0 | 0 | 0 | 0 | pozy (8) | 1/8/1, ogr. 1 |
| shrug | planned | 8 | 7 | 0 | 0 | 0 | 1 | 0 | pozy (8) | 2/2/2, ogr. 2 |
| rotator_cuff | planned | 8 | 7 | 1 | 5 | 0 | 1 | 0 | pozy (7) | 1/5/3 |
| carry | planned | 7 | 5 | 0 | 1 | 1 | 1 | 0 | pozy (7) | 3/0/2 |
| glute_floor | planned | 7 | 5 | 0 | 0 | 1 | 1 | 0 | pozy (7) | 0/0/2, ogr. 1 |
| hip_abd_add | planned | 8 | 5 | 1 | 0 | 1 | 2 | 0 | pozy (6) | 0/0/4, ogr. 2 |
| dip | planned | 5 | 4 | 0 | 0 | 1 | 0 | 0 | pozy (5) | 0/0/2 |
| core_hang | planned | 4 | 4 | 1 | 1 | 0 | 0 | 0 | pozy (3) | — |
| strongman | planned | 10 | 4 | 3 | 1 | 0 | 6 | 0 | pozy (1) | — |
| thruster | planned | 3 | 3 | 0 | 0 | 0 | 0 | 0 | pozy (3) | 1/0/1 |
| cable_press | planned | 4 | 3 | 0 | 0 | 1 | 0 | 0 | pozy (4) | 3/4/1 |
| leg_machine | planned | 8 | 2 | 0 | 0 | 1 | 4 | 1 | pozy (6) | 0/0/6, ogr. 1 |
| chest_press_machine | planned | 5 | 2 | 0 | 0 | 1 | 2 | 0 | pozy (5) | 0/5/4, ogr. 1 |
| back_extension | planned | 4 | 1 | 0 | 0 | 0 | 3 | 0 | pozy (3) | — |
| kneeling_hinge | planned | 2 | 0 | — | — | 0 | 2 | 0 | pozy (1) | → 1.2 (brak tekstu) |
| cardio, foam_roll, neck | wyjątek | 31 | 0 | — | — | 2 | 12 | 31 | brak | bez rysunku z założenia |
| **Razem** | | **708** | **471** | **38** | **81** | **37** | **158** | **77** | | |

Wnioski z tabeli:
- Do zrecenzowania w 1.1: **34 rodziny planned, 341 ćwiczeń** z tekstem (471 − 99 ready − 31 curl). Wszystkie mają dane póz (żadna nie wymaga nowego rigu).
- **38 ćwiczeń bez pozy** (najwięcej: core_floor 7, pushup_plank 6, sled_throw 6, leg_isolation 5, strongman 3) — autor dorabia pozy przed recenzją.
- **81 ćwiczeń bez ról mięśni**, w tym całe plyo (18), core_standing (10), mobility_floor (9), mobility_stand (8), sled_throw (10 z 11).
  To osobny tor (dane `muscleRoleRows`, źródła — badacz), nie praca autora figur. Otwarte → koordynator: czy pełna karta mobilności (rozciąganie)
  wymaga ról mięśni, czy rola „rozciągany” / wyjątek z powodem — decyzja właściciela (produktowa), nie zgadywać.
- Ryzyko wspólnego kodu (pary, obrót przedramienia): triceps, delt_raise, overhead_press, chest_fly, row, cable_row, pulldown, forearm, cable_press —
  poprawki W1b/H1 z gałęzi `figury/curl-wspolne` już zmieniły ich pozy w złotych odciskach (61 póz w 12 rodzinach, `/home/user/stan-curl2/STAN-AGENTA.md`),
  więc recenzent tych rodzin ogląda stan PO scaleniu curl-wspolne, nie wcześniejsze arkusze.

## 3. Lekcje z przebiegu curl (żeby nie wracać 3 razy)

Przebieg curl (02–03.11): ruch r1 → r2 → r3 (`/home/user/arkusze-curl/recenzja-r3.md`: 30 wyświetlanych / 4 do poprawy, H1), partia wspólna B r1
(`/home/user/stan-curl2/recenzja-ruchu-B.md`: W1b WYSOKIE, 12 do poprawy) → B r2 (34 × wyświetlana), karty B + 2 dopiski
(`/home/user/stan-curl2/recenzja-kart-B.md`), przepisanie B4 z dwoma powrotami czerwonych testów. Razem ok. 6 rund recenzji i 3 powroty
do przepisania. Przyczyny powrotów i mechanizm na przyszłość:

| # | Co wróciło w curl | Przyczyna | Punkt listy kontrolnej |
|---|---|---|---|
| 1 | Recenzja A (sha rodziny niepodłączonej), potem podłączenie zmieniło sha → runda B | `families.ts` i `poseData.ts` są w `V2_WSPOLNE` (`scripts/zrodla-runtime.mjs:97`) — podłączenie zmienia skrót **każdej** rodziny ready | K1 |
| 2 | W1b: ślad przy dwóch osobnych ciężarach w osi ciała (12 ćw.) | arkusz z przodu oglądany tylko dla kilku ćwiczeń; próg toru sprawdzał kształt, nie miejsce | K4, K5 |
| 3 | H1: hantel zawsze poprzecznie przy chwycie młotkowym | `draw.ts` ignorował `obrotPrzedramienia` | K6 |
| 4 | `liczba` w v2 = 34, test chce 36 | test liczy `assignAll()` (`tests/figury-recenzja.test.tsx:59-63`), także ćwiczenia bez rysunku (Zottman ×2) | K9 |
| 5 | 5 wpisów v1 „wyswietlana” → muszą być „zastapiona” | po podłączeniu `shownFigureSpec` daje v2; test nie dopuszcza v1 „wyswietlana” | K10 |
| 6 | Po „zastapiona” 5 kart własnych bez wpisu „karty” | karta własna przechodziła dotąd na wpisie v1 (`tests/karty-recenzja.test.tsx:43`) | K11 |
| 7 | 27 zestawów ogólnych bez wpisu „zestawy” | recenzja kart ruszyła dopiero po rysunku | K12 |
| 8 | Osłabione testy przy podłączeniu (pętla zawężona do pull_up, B1) | autor dostosował testy, nikt nie czytał `git diff -- tests/` | K14 |
| 9 | Próg łuku 30 cm przepuszczał zły tor (C1) | próg bez geometrii rodziny i bez przypadku negatywnego | K5 |
| 10 | Wyjątek Zottman (W8) decydowany w trakcie recenzji | rysunek nie umiał pokazać ruchu; decyzja właściciela dopiero po recenzji | K3 |

### Lista kontrolna rodziny (autor przed oddaniem; recenzenci odhaczają w zapisie)

Przed startem (koordynator):
- **K0** Partia tekstowa rodziny (karty własne w `data/zrodla/cues.json`, przegląd L-047) jest scalona do `integracja-1-1` **przed** recenzją kart —
  inaczej recenzja kart wraca po każdej partii. Brief zawiera `git log -1` gałęzi bazowej (L-095, `docs/18-przekazanie.md:194`).
- **K1** Recenzja tylko na stanie podłączonym: autor na swojej gałęzi ustawia `status: 'ready'` (`families.ts`), `LOAD` i `DATA_UI` (`poseData.ts:13,58`),
  generuje dane (`node scripts/zrodla-runtime.mjs --write`, `v2-gen --write`, pokrycie, macierz, README) i oddaje SHA końcowe. Czerwone wolno tylko:
  `figury-recenzja`, `karty-recenzja`, `recenzja-wyjatki-1-1`, `zrodla-runtime` (skróty). Ta sama runda obejmuje **recenzję różnicy rodzin ready**
  (złote odciski rigów i póz ready bajtowo równe + arkusze `roznica`, `cmp`).
- **K2** Każde ćwiczenie z tekstem ma pozę (kolumna „bez póz” = 0) i role mięśni (albo zapisany wyjątek); wpisy `do_przegladu` z
  `figury-ograniczenia-silnika.json` dla rodziny rozstrzygnięte.
- **K3** Ćwiczenia, których rysunek nie pokaże poprawnie, zgłoszone **przed** recenzją jako wyjątek z powodem (`figury-wyjatki.json`, decyzja właściciela,
  gdy usuwa rysunek — `[usuwa]` w docs/18).

Ruch (autor sprawdza, recenzent ruchu potwierdza):
- **K4** Arkusze `arkusz-slad.mjs` dla **każdego** ćwiczenia w **każdym** widoku rodziny (`views`), oglądane w pełnej rozdzielczości; widoki bajtowo równe
  poprzedniej rundzie — `cmp`, z listą. Ślad: sztanga/gryf = środek gryfu; para hantli / dwie linki = chwyt R (W1b, `contract.ts` na curl-wspolne);
  `trzyma` = chwyt tej ręki; jeden uchwyt = środek uchwytu; bez ciężaru = miednica.
- **K5** Test toru (`tests/figures-v2-tor.test.ts`): próg kształtu z geometrii rodziny (np. łuk r·(1−cos(Δθ/2)) + dryf + 2 cm), warunek miejsca
  (ślad ≤ 3 cm od właściwego chwytu) i promienia, każdy z przypadkiem negatywnym; przy `trzyma` porównanie tylko z `grips[trzyma]` (T1, NISKIE z curl).
- **K6** Orientacja sprzętu: oś hantla z `obrotPrzedramienia` (H1), talerze na końcach gryfu (W2), kettlebell/linka/dźwignia — w widoku z przodu i z boku.
- **K7** Styki między klatkami kluczowymi (u co 0,05, nie tylko w kadrach 0/0,25/…): wnikanie w ławkę/podpórkę ≤ 1 cm (N4 z curl: do 1,8 cm).
- **K8** Zakres stawu na końcach ruchu zgodny z tekstem karty (W4: „pełny wyprost” przy 16° zgięcia) — liczby z `frameAt`, nie z oka.

Zapisy recenzji (przepisujący, nie autor):
- **K9** `v2.<rodzina>.liczba` = liczba z `assignAll()` (z ćwiczeniami bez rysunku), `slad` opisuje arkusze, `autor` ≠ `recenzent` (L-047).
- **K10** Wpisy v1 ćwiczeń rodziny, które teraz rysują v2 → `zastapiona`.
- **K11** Każda karta własna rodziny z rysunkiem v2 ma wpis „karty” (`kartaSkrot`).
- **K12** Każdy zestaw ogólny z rysunkiem ma wpis „zestawy” z oceną dopasowania zdania do ruchu (np. curl.elbows pominięte przy łokciu w ruchu); id
  wskazówek przeczące ruchowi → `CUE_REQUIRES` / `CUE_NOT_IN_FAMILY` (`lib/figures/v2/cueSets.ts:46-62`).
- **K13** Recenzent zapisuje własny plik `docs/research/recenzje/<partia>-r<N>.json` ze skrótami policzonymi samodzielnie (`--skroty`);
  przepisujący przenosi 1:1 (`docs/18-przekazanie.md:197`); lista zamrożona strażnika (`:209`).
- **K14** Recenzent kart czyta `git diff <baza>..HEAD -- tests/` i ocenia każde poluzowanie (wzór tabeli B w recenzji kart curl).
- **K15** Teksty nowe w UI (nazwy faz `DATA_UI`) przez `t()` i `lib/i18n.en.ts`; błąd animowany tylko tam, gdzie jest tekst błędu; błędy tempa
  (`mis.jerk`) z jawną listą wyjątków.

Cel: **2 rundy na rodzinę** (r1 + r2 po poprawkach); trzecia tylko przy znalezisku WYSOKIM w kodzie wspólnym (wtedy fala wspólna, pkt 4).

## 4. Fale

Zasady:
- 2 rodziny na falę, każda w swoim worktree i na swojej gałęzi (`figury/<rodzina>`); pliki własne rodziny: `poses/<rodzina>.json`,
  `scripts/figures/agent-pozy/<rodzina>.mjs`, testy rodziny. **Pliki wspólne** (`contract.ts`, `scene.ts`, `draw.ts` i reszta `V2_WSPOLNE`) zmienia
  tylko fala wspólna (FW), osobna gałąź, jeden autor; każda FW = recenzja różnicy wszystkich rodzin ready + rodzin w toku.
- Podłączenie (`families.ts`, `poseData.ts`) też jest w `V2_WSPOLNE`: dwie rodziny fali konfliktują tylko w tych dwóch liniach — scala koordynator
  (`node scripts/scal-galaz.mjs`), druga gałąź po rebase dostaje recenzję różnicy (nie pełną).
- Role w fali X+Y: autor X = programista A, autor Y = programista B; recenzent ruchu = audytor R1 (obie rodziny albo po jednym, zależnie od rozmiaru);
  recenzent kart = audytor R2 (≠ R1, ≠ autorzy); **przepisujący X = programista B, przepisujący Y = programista A** (krzyżowo, nie-autor; L-047).
- Start fali N+1 równolegle z recenzją fali N (autorzy wolni, gdy recenzenci pracują); verify jedno naraz (kolejka `flock`).

| Fala | Rodziny (tekst) | Uwagi do briefu |
|---|---|---|
| F0 | curl (31) — scalenie `figury/curl-wspolne` | w toku; daje W1b/H1/C1 wszystkim rodzinom |
| F1 | triceps (28) + delt_raise (23) | najwięcej par hantli i obrotu przedramienia — pierwsze sprawdzenie W1b/H1 poza curl; delt_raise: 2 pozy do dorobienia |
| F2 | olympic (22) + core_floor (21) | olympic: ruch wielofazowy (wysiłek 6); core_floor: 7 póz i 7 ról do uzupełnienia |
| F3 | pushup_plank (19) + overhead_press (18) | pushup_plank: 6 póz, 6 ról, rollouty po W1/W2; overhead_press: 21 póz z obrotem, wyjątek nad głową (`overheadException.ts`) |
| F4 | lunge (13) + kb_ballistic (13) | lunge: 7 w „2 z 3” — może urosnąć po rundach popołudniowych; kb_ballistic: 14 z `trzyma` |
| F5 | row (12) + chest_fly (12) | widoki z góry (`top`); chest_fly 10 par hantli; row: ograniczenie silnika 1 |
| F6 | calf_raise (11) + leg_isolation (11) | leg_isolation: 5 póz; maszyny z `trzyma` |
| F7 | plyo (18) + sled_throw (11) | **warunek startu: role mięśni** (plyo 18/18, sled_throw 10/11 bez ról) i wyniki plyometrii r2; cykliczne/jednokierunkowe pętle |
| F8 | core_standing (10) + hip_bridge (8) | core_standing: role 10/10 do uzupełnienia |
| F9 | forearm (8) + cable_row (7) | obrót przedramienia (11 i 9) |
| F10 | pulldown (7) + shrug (7) | ograniczenia silnika 1 + 2 |
| F11 | rotator_cuff (7) + carry (5) | rotator_cuff: 5 bez ról |
| F12 | glute_floor (5) + hip_abd_add (5) | ograniczenia 1 + 2 (przesunięcie boczne miednicy — prawdopodobnie nieaktualne) |
| F13 | dip (4) + core_hang (4) | |
| F14 | strongman (4) + thruster (3) | strongman: 3 pozy do dorobienia (dziś 1 w pliku) |
| F15 | cable_press (3) + leg_machine (2) | leg_machine bez głowy na dźwigni (`DZWIGNIA_BEZ_GLOWY`) |
| F16 | chest_press_machine (2) + back_extension (1) | |
| F17 | mobility_floor (9) + mobility_stand (8) | **warunek startu: decyzja o rolach mięśni przy rozciąganiu** (0/17) |
| FW | fala wspólna (na żądanie) | po znalezisku WYSOKIM w kodzie wspólnym; zbiera poprawki z 1–2 fal naraz |

Wariant do decyzji koordynatora (wykonalność: `scripts/zrodla-runtime.mjs:98-103`, mechanizm `V2_POZA_SKROTEM` istnieje):
- **A (rekomendacja na F1–F2):** bez zmian w skrócie; każda fala robi recenzję różnicy rodzin ready (koszt rośnie: przy 10 rodzinach ready ok. 20 arkuszy + odciski).
- **B (do rozważenia po F2):** status rodziny i wpis `LOAD` poza skrótem rysunku (podłączenie nie zmienia rysunku innych rodzin) — strażnik, że zmiana
  `families.ts`/`poseData.ts` nie zmienia odcisków innych rodzin, + test „gałąź z wcześniejszymi zmianami” (L-080). Zysk: brak recenzji różnicy po samym
  podłączeniu; koszt: zmiana strażnika bramki 4. Kryterium: przejść na B, gdy recenzja różnicy w fali przekroczy ok. 1 h agenta.
- Opcjonalnie F13–F16 (14 ćwiczeń razem) jako 2 fale po 4 rodziny — mniej przebiegów verify; ryzyko: jedna wada blokuje 4 rodziny.

## 5. Szacunek czasu

Czas pracy agenta na rodzinę (z założeniem 2 rund; przeliczyć po F1–F3, jak w `docs/18-przekazanie.md:216`):

| Rozmiar (tekst) | Autor (pozy, generator, podłączenie, arkusze, poprawki r1) | Ruch r1+r2 | Karty | Przepisanie | Razem agent |
|---|---|---|---|---|---|
| D ≥ 18 | 3–5 h | 2–3 h | 1–1,5 h | 0,5–1 h | 7–10 h |
| Ś 8–13 | 2–3 h | 1–1,5 h | 0,5–1 h | 0,5 h | 4–6 h |
| M ≤ 7 | 1–1,5 h | 0,5–1 h | 0,5 h | 0,25 h | 2,5–3 h |

Czekanie (nie praca agenta): na falę 2 pełne verify (autor przed recenzją + po przepisaniu) po ok. 55–60 min lokalnie, kolejka bywa 2–3 h,
plus `tests.yml` w CI 22–40 min przed `scal-galaz.mjs`. Agenci w fali uruchamiają pojedyncze pliki testów `--runInBand`.

Suma 34 rodzin (D: 7 — triceps, delt_raise, olympic, core_floor, pushup_plank, overhead_press, plyo; Ś: 12; M: 15): ok. 49–70 + 48–72 + 38–45
= **ok. 135–190 h pracy agentów** (w fali równolegle 4–5 agentów), oraz ok. 36–108 h czekania na verify (18 fal × 2 verify × 1–3 h).
Przy nakładaniu fal (autorzy fali N+1 podczas recenzji fali N) — ok. **1 fala na dzień kalendarzowy → ok. 3–3,5 tygodnia** (górna część
szacunku 2–4 tyg. z docs/18). Wąskie gardło: kolejka verify, nie praca agentów. Po F3 koordynator przelicza tempo i daje właścicielowi nowy termin.

Czas właściciela: decyzje wyjątków K3 (ćwiczenia bez rysunku), decyzja o rolach mięśni przy rozciąganiu (przed F17), ewentualnie wariant B skrótu (jeśli
koordynator uzna go za zmianę modelu pracy).

## 6. Otwarte

- Liczby tekstu po rundach popołudniowych 03.11 (r2, 2 z 3, p5/p6, etap 3) — przeliczyć skryptem przed F1 i aktualizować kolejność fal.
- Flaga „pełna karta 1.1” bez częstych błędów i animowanego błędu w `scripts/pokrycie-katalogu.mjs` (dziś liczy Z3).
- Role mięśni: 81 ćwiczeń (tor badacza); mobilność — decyzja właściciela.
- 38 ćwiczeń z tekstem bez pozy — dorobić w falach (autor) albo wyjątek z powodem.
