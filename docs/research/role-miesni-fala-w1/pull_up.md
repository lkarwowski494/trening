# Role mięśni — rodzina `pull_up` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: luki (podświetlony region bez zdania) w rodzinie `pull_up`; tu też **wspólne reguły** dla wzorca `v_pull` (używane przez `pulldown.md`).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1 (`data/zrodla/role-miesni.json`).

## 1. Dlaczego dziś bez opisu: `v_pull` × `upper_back`

Reguła `v_pull` × `upper_back` (main, aux) → `upper_back.scap_down_retract` już istnieje (`rules`, `pairs: 17`), ale funkcja ma `status: "uproszczenie"`
(funkcje mięśni potwierdzone anatomią S1, S5; brakowało przeczytanego źródła, że w podciąganiu/ściąganiu drążka łopatki rzeczywiście schodzą w dół i do siebie).
Decyzja właściciela z 26.10.2026 (`meta.decyzjaWlasciciela`) pokazuje tylko `ustalone`/`dwa_zrodla` — stąd luka we wszystkich ćwiczeniach `v_pull`.

### Wynik: brakujące źródła znalezione i przeczytane (02.11.2026)

| Źródło | Szczebel | Ćwiczenie | Co mówi (miejsce) |
|---|---|---|---|
| S24 Di Fonza i in. 2026 (istniejące) | 3 | podciąganie (warianty chwytu) | rozdz. 3.6: chwyt nachwytem wiązał się z wyższą aktywnością EMG dolnej części czworobocznego (za Youdas i in.); mięśnie łopatki pracują głównie w początkowej fazie ruchu |
| S29 Prinold, Bull 2016 (nowe) | 3 | podciąganie przodem, szeroko, podchwytem | Results: zakres pro-/retrakcji łopatki 22°/10°/17°; Discussion: „More ScT retraction towards the top of the front pull-up” |
| S33 ACE Pull Ups #191 (nowe w tym pliku; to samo co `ace-191` w cues.json) | 4 | podciąganie | Step 1: obniż i ściągnij łopatki („pull shoulders back and down”) i utrzymaj przez całe ćwiczenie |
| S34 ACE Chin Ups #190 (= `ace-190`) | 4 | podciąganie podchwytem | Step 1 (to samo polecenie; zapis w cues.json „Chin Up”, nie czytane ponownie 02.11 — patrz uwaga) |
| S35 ACE Seated Lat Pulldown #158 (= `ace-158`) | 4 | ściąganie drążka | Step 1: „depress and retract your scapulae”; Step 2: ruch zaczyna się od obniżenia łopatek |
| S36 NASM Pull Up (= `nasm-pull-up`) | 4 | podciąganie | Step 2: obniż łopatki; Step 3: „Pull your body upward by retracting your shoulder blades and driving your elbows downward”; lista mięśni: m.in. równoległoboczne, środkowa część czworobocznego, tylny akton naramiennego |

Funkcje anatomiczne (bez zmian): S5 — środkowe włókna czworobocznego ściągają łopatkę do tyłu, dolne obniżają; równoległoboczne ściągają łopatkę; S1 tab. 11.8 — czworoboczny „pulls shoulder blades together”.

**Wniosek:** dwa niezależne źródła szczebla 3 (S24, S29) i dwie organizacje szczebla 4 (ACE, NASM) wprost wiążą ściąganie łopatek w dół i do siebie
z podciąganiem/ściąganiem drążka. Brak źródła przeczącego. Zastrzeżenie (nie zmienia zdania): S29 — przy szerokim chwycie zakres retrakcji najmniejszy (10°).
**Propozycja:** `upper_back.scap_down_retract` → `status: "dwa_zrodla"`, `pewnosc: "dwa źródła szczebla 3 (S24, S29) + ACE, NASM"`,
`zrodla: ["S1","S5","S24","S29","S33","S35","S36"]`, usunąć pole `uproszczenie` (przenieść do `uwaga`: „przy szerokim chwycie mniejszy zakres retrakcji — S29”). Zdanie bez zmian:
PL „Pomaga ściągać łopatki w dół i do siebie, gdy przyciągasz.” / EN „Helps draw your shoulder blades down and together as you pull.” (main: „Ściąga łopatki w dół i do siebie, gdy przyciągasz.”).
Reguła istniejąca — nic nie dopisywać. Zamyka luki `upper_back` (aux) w: Pull Up, Chin Up, Neutral Grip Pull Up, Mixed Grip Chin, Side To Side Chins, One Arm Chin-Up, Muscle Up,
Wide-Grip Rear Pull-Up, Rope Climb, oraz (main) Gironda Sternum Chins; w `pulldown` — patrz `pulldown.md`.

Uwagi: Rope Climb (wspinaczka po linie) dostaje zdanie przez regułę rodziny `v_pull`, tak jak już dziś najszersze i biceps — źródła dotyczą podciągania; to rozszerzenie rodzinne jak w pozostałych regułach `v_pull`
(do decyzji koordynatora, czy dopisać `exceptions.noRole` dla Rope Climb `upper_back`; rekomendacja: zostawić — ruch ramion ten sam).
S34 (ACE #190) nie był czytany ponownie w tej sesji — liczę go tylko jako zapis z cues.json; wniosek nie zależy od niego.

## 2. Nowa reguła wspólna: `v_pull` × `rear_delt`

| Źródło | Szczebel | Miejsce |
|---|---|---|
| S24 Di Fonza i in. 2026 | 3 | rozdz. 3.1 i tab. 1: wariant zza karku — większa aktywność tylnego aktonu naramiennego i bicepsa (za Sperandei i in. 2009) |
| S36 NASM Pull Up | 4 | lista mięśni: „Posterior Deltoid” |
| S6 (funkcja) | 4 | tylne włókna: wyprost i rotacja zewnętrzna |

Funkcja `rear_delt.shoulder_ext` ma już `status: "dwa_zrodla"`. Propozycja reguły (wstawić po regule `v_pull` × `forearms`):

```json
{ "pattern": "v_pull", "muscle": "rear_delt", "roles": ["main", "aux"], "function": "rear_delt.shoulder_ext", "phase": true,
  "zrodla_reguly": ["S24 rozdz. 3.1", "S36"] }
```

Zdanie: „Pomaga odciągać ramię do tyłu, gdy przyciągasz.” / „Helps draw your arm back as you pull.” Zamyka: Wide-Grip Rear Pull-Up (wariant zza karku — S24 opisuje ściąganie zza karku, podciąganie zza karku = wariant tego samego ruchu) i Wide-Grip Pulldown Behind The Neck.

## 3. Pozostałe luki w `pull_up`

| Ćwiczenie | Region (udział) | Wynik | Uzasadnienie |
|---|---|---|---|
| Dead Hang (`other`) | forearms (1) | **gotowe — nameRule** | S31 Sepehri Rahnama i in. 2025 (szcz. 3), rozdz. 2.3.3: zwis na drążku nachwytem jako miara wytrzymałości chwytu; S32 Exel i in. 2026 (szcz. 3; wariant: zwis na palcach na listwie), rozdz. 2.3: zginacze palców jako mięśnie wykonujące zwis; funkcja `forearms.grip` (S1, S9) ma `dwa_zrodla`. „Zaciska dłoń na uchwycie” opisuje utrzymanie, nie ruch — pasuje do ćwiczenia na czas. |
| Dead Hang | lats (0,5) | bez opisu | zwis bierny; „ściąga ramię w dół” nie opisuje zwisu; brak źródła roli najszerszego w zwisie (S32 nie mierzył najszerszego). Wzorzec `other` nie ma reguł — nic dopisywać nie trzeba. |
| Muscle Up | triceps (0,5) | **jedno źródło** — nie pokazywać | S30 Walker i in. 2023 (szcz. 3), Introduction: faza wypychania zaczyna się od zgiętego łokcia, potem zawodnik prostuje łokieć; tricepsy i piersiowe pracują głównie w tej fazie. Drugiego źródła o muscle-upie nie znalazłem (strona NASM „muscle-up” 404; badania poręczy = analogia). Propozycja do danych (bez wyświetlania): nameRule triceps aux → `triceps.elbow_ext` z `pewnosc: "jedno źródło"` — wymaga pola statusu w nameRule albo zostawić bez wpisu; rekomendacja: zostawić bez wpisu do czasu drugiego źródła. |
| Muscle Up | chest (0,5) | bez opisu | S30 wymienia piersiowy w fazie wypychania, ale rola piersiowego jako pomocniczego w wyciskaniu pionowym jest dziś świadomie bez opisu (`withoutRole.kombinacje`: „chest pomocniczy w v_push”) — spójnie bez opisu. |
| One Arm Chin-Up | abs (0,5) | otwarte | brak przeczytanego źródła roli brzucha (stabilizacja przeciw skrętowi) w podciąganiu jednorącz. |
| Scapular Pull-Up (`isolation`) | upper_back (1), lats (0,5), forearms (0,5) | otwarte | nie znalazłem przeczytanego źródła opisującego to ćwiczenie z nazwy (wyszukiwanie w serwisach ACE, NASM, NSCA, PMC); ACE #191 krok 1 opisuje ten sam ruch łopatek jako start podciągania — to analogia, nie liczy się. Kandydat po znalezieniu 2 źródeł: nameRule `upper_back` main → `upper_back.scap_down_retract`, `forearms` aux → `forearms.grip`. |
| Gorilla Chin/Crunch (`core_flexion`) | lats (1), biceps (0,5), forearms (0,5) | otwarte | brak przeczytanego źródła (ExRx — 403 wg koordynatora). Kandydat: nameRule lats → `lats.shoulder_ext_add`, biceps → `biceps.elbow_flex`, forearms → `forearms.grip` (część podciągania), po dwóch źródłach. |

### Propozycja nameRule (Dead Hang)

```json
{
  "muscle": "forearms",
  "roles": ["main"],
  "function": "forearms.grip",
  "exercises": ["Dead Hang"],
  "zrodla_reguly": ["S31 rozdz. 2.3.3", "S32 rozdz. 2.3 (wariant: zwis na palcach)"]
}
```

Uwaga techniczna: w `lib/muscleRoles.ts` (`matchRole`) nameRules sprawdzane są przed regułami i przed warunkiem `metric === 'time'`, więc zwis (ćwiczenie na czas, wzorzec `other`) dostanie zdanie z nameRule. Test macierzy powinien to objąć.

## 4. Nowe źródła (do `sources` w role-miesni.json)

| id | Szczebel | Cytowanie | URL | Czytane |
|---|---|---|---|---|
| S29 | 3 | Prinold JAI, Bull AMJ. Scapula kinematics of pull-up techniques: Avoiding impingement risk with training changes. J Sci Med Sport 2016 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4916995/ | 02.11.2026 (Results, Discussion) |
| S30 | 3 | Walker CW, Bruenger AJ, Tucker WS, Lee HR. Comparison of Muscle Activity During a Ring Muscle Up and a Bar Muscle Up. Int J Exerc Sci 2023;16(1):1451–1460 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10824315/ | 02.11.2026 (Introduction) |
| S31 | 3 | Sepehri Rahnama H i in. Comparative Effects of Core Versus Forearm Training on Pull-Up Repetition Performance in Physically Inactive Males. Sports (Basel) 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12736907/ | 02.11.2026 (2.3.3, Discussion) |
| S32 | 3 | Exel J i in. Upper-Body Neuromechanical Coordination Strategies During Fatiguing Sustained Dead Hangs in Climbers. Eur J Sport Sci 2026;26(6):e70197 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13240036/ | 02.11.2026 (1, 2.2, 2.3) |
| S33 | 4 | ACE Exercise Library: Pull Ups (#191) | https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/ | 02.11.2026 (Step 1) |
| S34 | 4 | ACE Exercise Library: Chin Ups (#190) | https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/ | nie w tej sesji (zapis z cues.json) |
| S35 | 4 | ACE Exercise Library: Seated Lat Pulldown (#158) | https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/ | 02.11.2026 (Step 1, Step 2) |
| S36 | 4 | NASM Exercise Library: Pull Up | https://www.nasm.org/resource-center/exercise-library/pull-up | 02.11.2026 (Step 2, Step 3, lista mięśni) |

Organizacje ACE i NASM są już w `data/zrodla/cues.json` (`orgs`) jako szczebel 4. Nowe zdania: brak (wszystkie zdania z istniejących funkcji).

## 5. Otwarte

- [OTWARTE] Muscle Up — triceps: drugie źródło o fazie wypychania (jest jedno: S30).
- [OTWARTE] One Arm Chin-Up — abs: rola brzucha w podciąganiu jednorącz.
- [OTWARTE] Scapular Pull-Up — źródła opisujące ćwiczenie z nazwy (2 niezależne).
- [OTWARTE] Gorilla Chin/Crunch — źródła opisu ćwiczenia (ExRx niedostępny).
- [OTWARTE] Rope Climb — czy reguły rodziny `v_pull` (najszersze, biceps, górna część pleców) mają obejmować wspinaczkę po linie bez osobnego źródła (decyzja koordynatora; dotyczy też już pokazywanych zdań).

## 6. Stan

Zrobione: wszystkie luki z listy dla `pull_up`, `pulldown`, `shrug`. Pułapki: ExRx 403 (koordynator), strona NASM „muscle-up” 404; dokumentacja innych aplikacji nie jest źródłem.
