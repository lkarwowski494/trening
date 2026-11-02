# Role mięśni — grupa G3, rodzina `olympic` (fala W1)

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3; kontynuacja tego samego dnia — N4, odwołania do N7/N8)
Zakres: luki „brak reguły” z briefu koordynatora dla ćwiczeń rodziny figur `olympic` (podrzuty, rwania, zarzuty, wybicia).
Tylko zbieranie danych: kod, `data/zrodla/*.json`, `lib/**` i testy bez zmian. Propozycje w formacie `data/zrodla/role-miesni.json`.

Ten plik opisuje też **reguły wspólne** dla kilku rodzin (nameRules N1–N4); `kb_ballistic.md` i `thruster.md` się do nich odwołują. Reguły N5–N6
(thrustery) są w `thruster.md`, N7–N8 (ramiona w podrzucie, także Clean and Jerk) — w `kb_ballistic.md`.

Szczeble źródeł według rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): ACE i Catalyst Athletics = 4; badania z czasopism recenzowanych = 3.
Wpisy tego pliku się nie zmieniają.

## Ustalenia o zakresie reguł (dlaczego nameRules, a nie reguły rodziny)

Sprawdzone w `docs/research/equipment/catalog.json` (wyszukiwanie wieloliniowe po `pattern` + regionie ≥ 0,5):

- `hinge|upper_back` (≥ 0,5) ma też martwe ciągi i strongman (Deadlift, Sumo/Trap Bar/Axle/Deficit Deadlift, Rack Pull, Atlas Stones, Keg Load, Tire Flip, Sandbag Load i odmiany z gumami/łańcuchami). Tam górna część pleców trzyma łopatki, a nie unosi barki — reguła rodziny dałaby fałszywe zdanie. Poza tym w `withoutRole` ta kombinacja już jest otwarta. → **bez reguły rodziny**; zarzuty i rwania sztangą → nameRules N4.
- `hinge|front_delt` (≥ 0,5): wyłącznie rwania i podrzuty (sztanga, hantel, kettlebell). Źródło przebiegu ruchu mam dla rwania sztangą (N3) i podrzutu (N8) → **nameRules** (lista), reszta otwarta.
- `v_push|quads` i `v_push|glutes`: poza wybiciami/podrzutami są tu Landmine Linear Jammer, Single-Arm Linear Jammer, Log Lift, Circus Bell — dla nich nie mam przeczytanego źródła → **nameRules** tylko dla wyciskania z wybiciem i podrzutów.
- `squat|front_delt` (aux): też Overhead Squat i One-Arm Overhead Kettlebell Squat (trzymanie ciężaru nad głową, bez unoszenia ramienia) → reguła rodziny dałaby fałszywe zdanie.

## Tabela luk (rodzina olympic)

| Luka (pattern\|region\|rola) | Ćwiczenia | Wynik | Uzasadnienie |
|---|---|---|---|
| v_push\|quads\|main | Power Jerk, Split Jerk, Squat Jerk | **gotowe** → N1 `quads.knee_ext` | S30 + S33 (wybicie z nóg: prostowanie kolan i bioder) |
| v_push\|glutes\|aux | Power Jerk, Split Jerk, Squat Jerk | **gotowe** → N2 `glutes.hip_ext` | S30 + S33 |
| v_push\|glutes\|main | Clean and Press | **gotowe** → N2 `glutes.hip_ext` | S29 (pośladki prostują biodro w zarzucie) + S34 (wypchnięcie bioder do przodu) |
| hinge\|front_delt\|aux | Barbell Snatch, Block Snatch, Block Power Snatch, Hang Snatch, Power Snatch, Split Snatch | **gotowe** → N3 `front_delt.shoulder_flex` | funkcja: S1, S6 (ustalone); przebieg w rwaniu: S31 (zgięcie barku od 2. ciągu do podsiadu, wtedy pracuje mięsień naramienny) |
| hinge\|front_delt\|aux | Muscle Snatch | otwarte | ramię idzie nad głowę jak w rwaniu, ale S31 badał rwanie z podsiadem; przeniesienie = analogia (uproszczenie) |
| hinge\|front_delt\|aux | Clean and Jerk | **gotowe** → N8 `front_delt.shoulder_flex` (kb_ballistic.md) | S33 (ACE) + W1G3-S11 (Catalyst Athletics): ramiona wypychają ciężar nad głowę; S30: napęd z nóg, więc rola tylko pomocnicza |
| hinge\|triceps\|aux | Clean and Jerk, One-Arm Kettlebell Clean and Jerk | **gotowe** → N7 `triceps.elbow_ext` (kb_ballistic.md) | S33 („punching both arms straight into the air”) + W1G3-S11 („punch the elbows into a secure overhead position”) |
| hinge\|upper_back\|aux | Power Clean, Clean, Hang Clean, Block Clean, Block Power Clean, Split Clean, Clean Pull, Clean and Jerk, Barbell Snatch, Hang Snatch, Block Snatch, Block Power Snatch, Power Snatch, Split Snatch, Snatch Pull (15) | **gotowe** → N4 `upper_back.scap_elevate` | dwa niezależne badania szczebla 3: S29 (Niemcy; „wzruszenie” rozpoczyna mięsień czworoboczny; wyższa aktywność w ciągach) i W1G3-S6 (Japonia; w 2. ciągu zarzutu mięsień czworoboczny unosi łopatkę i ciągnie sztangę). Rola pomocnicza zgodna z S29: przy łapanych bojach powyżej ok. 70% 1RM czworoboczny „nie jest głównym” |
| hinge\|upper_back\|aux | Clean Deadlift, Snatch Deadlift | otwarte (świadomie pominięte) | ruch kończy się bez 2. ciągu; W1G3-S6: w 1. ciągu i w przejściu czworoboczny „utrzymuje położenie łopatki” — to nie „unosi barki”; funkcja trzymania łopatek nie istnieje w danych |
| hinge\|upper_back\|main | Muscle Snatch | otwarte | 2. ciąg ten sam co w rwaniu, ale rola **główna** sprzeczna z S29 (w bojach łapanych czworoboczny nie jest głównym, poza lekkimi ciężarami); do decyzji: zmiana udziału w katalogu albo zdanie pomocnicze — sprawa danych katalogu |
| hinge\|side_delt\|aux | Muscle Snatch | otwarte | uniesienie łokci w bok przy ciągnięciu wysokim — znalazłem tylko porównania do wiosłowania w pionie (analogia = uproszczenie) i strony komercyjne |
| squat\|front_delt\|aux | Snatch Balance | otwarte | S30: „The snatch balance is mechanically similar to the squat jerk exercise” — to analogia; brak źródła ruchu w barku |
| squat\|abs\|aux | Jerk Dip Squat | otwarte | brak funkcji: `abs.antilordosis` ma status jedno_zrodlo; S29 nazywa mięsień prosty brzucha „trunk stabilizing” tylko w zarzucie |
| v_push\|upper_back\|aux | Clean and Press | otwarte | S34 (zarzut kettlebell) nie opisuje unoszenia barków; S29 i W1G3-S6 badały zarzut sztangą — przeniesienie na kettlebell = analogia |

## Propozycje (format role-miesni.json)

Nowych `functions` brak — wszystkie cztery reguły używają istniejących funkcji (`quads.knee_ext`, `glutes.hip_ext`, `front_delt.shoulder_flex` — ustalone; `upper_back.scap_elevate` — dwa_zrodla, dziś tylko szrugsy). nameRules nie dokładają fazy (wariant „_”), więc zdanie kończy się na czasowniku.

Uwaga do N4: funkcja `upper_back.scap_elevate` ma w `uwaga` zdanie „Tylko ćwiczenia z jawnej listy nameRules (szrugsy)” — przy scalaniu N4 trzeba je zmienić na „szrugsy oraz zarzuty i rwania sztangą (2. ciąg)”. W nameRules jest już reguła `upper_back` z rolą `main` (szrugsy, w tym Clean Shrug i Snatch Shrug); N4 to osobna reguła z rolą `aux` i inną listą — nazwy się nie powtarzają.

```json
{
  "nameRules": {
    "reguly": [
      {
        "id": "N1",
        "muscle": "quads",
        "roles": ["main", "aux"],
        "function": "quads.knee_ext",
        "exercises": [
          "Power Jerk", "Split Jerk", "Squat Jerk",
          "Double Kettlebell Push Press", "Double Kettlebell Jerk",
          "One-Arm Kettlebell Push Press", "One-Arm Kettlebell Jerk", "One-Arm Kettlebell Split Jerk",
          "Push Press", "Push Press - Behind the Neck"
        ],
        "zrodlaZastosowania": ["S30", "S33", "S32"],
        "uwaga": "Wybicie z nóg w podrzucie i wyciskaniu z wybiciem: ugięcie i wyprost kolan (S30 push press i jerk; S32/S33). Push Press i Push Press - Behind the Neck spoza G3 — dopisane, bo S30 i S32 opisują dokładnie wyciskanie z wybiciem; koordynator może je wyjąć. Bez: Landmine/Single-Arm Linear Jammer, Log Lift, Circus Bell (brak przeczytanego źródła).",
        "pominiete": {
          "Landmine Linear Jammer": "brak przeczytanego źródła przebiegu ruchu",
          "Single-Arm Linear Jammer": "brak przeczytanego źródła przebiegu ruchu",
          "Log Lift": "brak przeczytanego źródła przebiegu ruchu",
          "Circus Bell": "brak przeczytanego źródła przebiegu ruchu"
        }
      },
      {
        "id": "N2",
        "muscle": "glutes",
        "roles": ["main", "aux"],
        "function": "glutes.hip_ext",
        "exercises": [
          "Power Jerk", "Split Jerk", "Squat Jerk",
          "One-Arm Kettlebell Split Jerk",
          "Clean and Press"
        ],
        "zrodlaZastosowania": ["S30", "S33", "S29", "S34"],
        "uwaga": "Podrzut: wyprost bioder w fazie wybicia (S30, S33). Clean and Press: wyprost biodra w zarzucie (S29: pośladek wielki prostuje biodro, kończąc ciąg) i wypchnięcie bioder przy wyciskaniu (S34). Bez: Log Lift, Circus Bell."
      },
      {
        "id": "N3",
        "muscle": "front_delt",
        "roles": ["aux"],
        "function": "front_delt.shoulder_flex",
        "exercises": [
          "Barbell Snatch", "Block Snatch", "Block Power Snatch",
          "Hang Snatch", "Power Snatch", "Split Snatch"
        ],
        "zrodlaZastosowania": ["S31", "S1", "S6"],
        "uwaga": "Funkcja ustalona (S1, S6, S22, S23). Przebieg ruchu w rwaniu: kąt zgięcia barku rośnie od początku 2. ciągu do końca podsiadu; po połowie zakresu pracuje mięsień naramienny (S31, 4 zawodników — dowód słaby, ale wprost). Odmiany power/split/z bloków/z zawieszenia mają ten sam tor ramion nad głowę; różnią się startem i odbiorem. Bez: Muscle Snatch, rwania hantlem i kettlebell (otwarte). Clean and Jerk — osobna reguła N8 (kb_ballistic.md); przy scalaniu można dopisać go tutaj."
      },
      {
        "id": "N4",
        "muscle": "upper_back",
        "roles": ["aux"],
        "function": "upper_back.scap_elevate",
        "exercises": [
          "Power Clean", "Clean", "Hang Clean", "Block Clean", "Block Power Clean", "Split Clean",
          "Clean Pull", "Clean and Jerk",
          "Barbell Snatch", "Hang Snatch", "Block Snatch", "Block Power Snatch", "Power Snatch", "Split Snatch",
          "Snatch Pull"
        ],
        "zrodlaZastosowania": ["S29", "W1G3-S6", "S1", "S5"],
        "uwaga": "Drugi ciąg zarzutu i rwania sztangą: mięsień czworoboczny rozpoczyna „wzruszenie” (S29, hang power clean/snatch i ciągi) i w 2. ciągu unosi łopatkę, ciągnąc sztangę (W1G3-S6, power clean, 20 trenujących). Dwa niezależne zespoły, szczebel 3. Rola tylko pomocnicza: S29 — przy bojach łapanych powyżej ok. 70% 1RM czworoboczny nie jest głównym. Odmiany z bloków, z zawieszenia, split i power mają ten sam 2. ciąg; różnią się startem i odbiorem.",
        "pominiete": {
          "Clean Deadlift": "bez 2. ciągu — czworoboczny trzyma łopatki (W1G3-S6: 1. ciąg), nie unosi barków",
          "Snatch Deadlift": "bez 2. ciągu — jw.",
          "Muscle Snatch": "w katalogu rola główna; S29: w bojach łapanych czworoboczny nie jest głównym — rozbieżność z danymi katalogu, otwarte",
          "Kettlebell Clean": "kettlebell/hantel — badania dotyczą sztangi; otwarte (kb_ballistic.md)",
          "Kettlebell Snatch": "jw.",
          "Double Kettlebell Clean": "jw.",
          "Double Kettlebell Snatch": "jw."
        }
      }
    ]
  },
  "sources": [
    {
      "id": "S29", "tier": 3,
      "cite": "Geisler S i in. Effects of Expertise on Muscle Activity during the Hang Power Clean and Hang Power Snatch Compared to Snatch and Clean Pulls – An Explorative Analysis. J Sports Sci Med 2023;22(4):778–789",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10690512/",
      "miejsce": "Introduction; Discussion",
      "cytaty": [
        "„Given that the function of the VL and GM muscles is knee and hip extension, respectively”",
        "„A particular function of the TZ muscle is to initiate the shrug motion.”",
        "Discussion: „Except at lower intensities (<70% 1RM), the TZ does not appear to be a primary contributor to weightlifting movements that require the barbell to be caught.”"
      ]
    },
    {
      "id": "W1G3-S6", "tier": 3,
      "cite": "Nagao H, Ishii Y. Characteristics of the Shrug Motion and Trapezius Muscle Activity During the Power Clean. J Strength Cond Res 2021;35(12):3288–3295. doi:10.1519/JSC.0000000000003355",
      "url": "https://pubmed.ncbi.nlm.nih.gov/31453932/",
      "miejsce": "Abstract (przeczytane streszczenie w PubMed; pełny tekst za opłatą)",
      "cytaty": [
        "2. ciąg: „the TZ was aggressively contracted to elevate the scapula and pull the barbell” (fragment zdania)",
        "„Trapezius muscle activity appears to work to maintain scapular position, especially in the first pull and transition phases.”"
      ],
      "uwaga": "Brak sprzeczności z S29: trzymanie łopatki dotyczy 1. ciągu i przejścia, unoszenie — 2. ciągu. Dlatego bez Clean/Snatch Deadlift."
    },
    {
      "id": "S30", "tier": 3,
      "cite": "Soriano MA, Suchomel TJ, Comfort P. Weightlifting Overhead Pressing Derivatives: A Review of the Literature. Sports Med 2019;49(6):867–885 (przegląd narracyjny — liczony jako szczebel 3, nie systematyczny)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6548056",
      "miejsce": "Introduction; The Push Press; The Jerk",
      "cytaty": [
        "push press: „a very rapid propulsion phase via extension of the hips and knees”",
        "jerk: „accelerates the bar vertically via extension of the hips, knees and ankles”"
      ]
    },
    {
      "id": "S31", "tier": 3,
      "cite": "Wu W-L i in. Muscle activation and three-dimensional kinematics of upper extremity in snatch weight lifting. ISBS Conference Proceedings 2008, s. 461 (streszczenie konferencyjne, n = 4)",
      "url": "https://ojs.ub.uni-konstanz.de/cpa/article/view/1888/1757",
      "miejsce": "Results; Discussion",
      "cytaty": [
        "„there was a significant increase in the shoulder flexion angle from the beginning of the 2nd pull to the end of the turnover phase”",
        "„After the half way point of the shoulder full flexion, the contracting muscle is the deltoid.”"
      ]
    },
    {
      "id": "S32", "tier": 4,
      "cite": "American Council on Exercise. Exercise Library: Double Push-press (kettlebell)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/384/double-push-press/",
      "miejsce": "Steps (opis wykonania)",
      "cytaty": [
        "„bend the knees to dip slightly at the hips before explosively pushing both feet into the floor and snapping the hips forward”"
      ]
    },
    {
      "id": "S33", "tier": 4,
      "cite": "American Council on Exercise. Exercise Library: Push-jerk (kettlebell)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/",
      "miejsce": "Steps (opis wykonania)",
      "cytaty": [
        "„bend the knees slightly to dip at the hips before explosively pushing both feet into the floor”",
        "„while punching both arms straight into the air”"
      ]
    },
    {
      "id": "S34", "tier": 4,
      "cite": "American Council on Exercise. Exercise Library: Clean and Press (kettlebell)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/383/clean-and-press/",
      "miejsce": "Steps (opis wykonania)",
      "cytaty": [
        "„Drive the hips forward to swing the kettlebell forward”",
        "„explosively push the feet into the floor, and snap the hips forward”"
      ]
    }
  ]
}
```

Uwaga do formatu: pola `id`, `zrodlaZastosowania` i `pominiete` przy N1 są propozycją (dziś nameRules mają tylko `muscle`, `roles`, `function`, `exercises`, opcjonalnie `pominiete`). Numery S29–S35 i W1G3-S… mogą kolidować z innymi falami — koordynator nadaje ostateczne przy scalaniu. Klucze ćwiczeń przepisane z `catalog.json` (pole `name`; lista N4 sprawdzona wyszukiwaniem `pattern: hinge` + `upper_back` ≥ 0,5 w tym pliku 02.11.2026).

## Zdania PL | EN (wynik dla ćwiczeń)

Nowych zdań nie ma — reguły używają istniejących tekstów funkcji (bez fazy, bo nameRules):

| Ćwiczenie i mięsień | PL | EN |
|---|---|---|
| Power/Split/Squat Jerk — czworogłowe (główny) | Prostuje kolano. | Straightens your knee. |
| KB Push Press/Jerk — czworogłowe (pomocniczy) | Pomaga prostować kolano. | Helps straighten your knee. |
| Power/Split/Squat Jerk — pośladki (pomocniczy) | Pomaga prostować biodro. | Helps straighten your hip. |
| Clean and Press — pośladki (główny) | Prostuje biodro. | Straightens your hip. |
| Rwania sztangą, Clean and Jerk — przedni akton (pomocniczy) | Pomaga unosić ramię do przodu. | Helps raise your arm forward. |
| Clean and Jerk — triceps (pomocniczy) | Pomaga prostować łokieć. | Helps straighten your elbow. |
| Zarzuty i rwania sztangą, ciągi — górna część pleców (pomocniczy) | Pomaga unosić barki. | Helps raise your shoulders. |

Pytanie do koordynatora/produktu (nie merytoryczne): w regułach rodziny `v_push` zdania mają fazę „, gdy pchasz”; nameRules jej nie mają. Jeśli fraza z fazą ma być spójna z resztą wyciskań, potrzebne jest pole `phase` w nameRules (zmiana `lib/muscleRoles.ts`) — poza zakresem tej fali. Przy N4 faza byłaby szczególnie pomocna („…, gdy wybijasz sztangę w górę”), bo barki unoszą się tylko w 2. ciągu.

## Źródła przeczytane (02.11.2026)

| id | organizacja / autorzy | szczebel | miejsce |
|---|---|---|---|
| S29 | Geisler i in., J Sports Sci Med 2023 (PMC10690512) | 3 | Introduction; Discussion |
| W1G3-S6 | Nagao i Ishii, J Strength Cond Res 2021 (PubMed 31453932) | 3 | Abstract |
| S30 | Soriano, Suchomel, Comfort, Sports Med 2019 (PMC6548056) | 3 (przegląd narracyjny) | Introduction; The Push Press; The Jerk; Table 2 |
| S31 | Wu i in., ISBS 2008, s. 461 | 3 (streszczenie konferencyjne) | Results; Discussion |
| S32 | ACE Exercise Library — Double Push-press | 4 | Steps |
| S33 | ACE Exercise Library — Push-jerk | 4 | Steps |
| S34 | ACE Exercise Library — Clean and Press | 4 | Steps |
| W1G3-S11 | Catalyst Athletics — Jerk / Split Jerk (wpis w kb_ballistic.md) | 4 | opis wykonania |
| S1, S5, S6 | istniejące (OpenStax, TeachMeAnatomy) | 3, 4 | jak w role-miesni.json |

Sprawdzone i **nie użyte**: przegląd Suchomel i in. 2015 (Sports Med) — przekierowanie do logowania; prezentacja SPRINZ/AUT i praca dyplomowa o rwaniu kettlebell (ACU) — 403. Strony komercyjne i strony innych aplikacji nie są źródłem (polecenie koordynatora 02.11.2026). Badanie Nagao i Ishii — poprzednio niedostępne, w tej sesji przeczytane streszczenie w PubMed (W1G3-S6).

## Otwarte

- [OTWARTE] Muscle Snatch `upper_back` **main**: S29 mówi, że w bojach łapanych czworoboczny nie jest głównym (poza lekkimi ciężarami) — rozbieżność z udziałem 1 w katalogu. Do koordynatora: albo udział 0,5 (rola pomocnicza, wtedy N4), albo zostaje bez opisu.
- [OTWARTE] Clean Deadlift, Snatch Deadlift `upper_back` aux: czworoboczny trzyma łopatki (W1G3-S6, 1. ciąg); funkcji „trzyma łopatki” nie ma w danych — bez opisu.
- [OTWARTE] Muscle Snatch (`front_delt` aux, `side_delt` aux): ciągnięcie wysokie bez podsiadu — brak źródła; porównanie do wiosłowania w pionie to analogia (uproszczenie, nie wyświetlane).
- [OTWARTE] Snatch Balance `front_delt` aux: tylko analogia do podrzutu z przysiadem (S30).
- [OTWARTE] Jerk Dip Squat `abs` aux: brak funkcji o statusie ≥ dwa_zrodla dla mięśnia prostego brzucha poza zginaniem tułowia.
- [OTWARTE] Clean and Press `upper_back` aux: zarzut kettlebell — badania (S29, W1G3-S6) dotyczą sztangi; przeniesienie = analogia.
- [OTWARTE] Log Lift, Circus Bell, Linear Jammer (`v_push` quads/glutes) — spoza G3, ale bez reguły rodziny zostają bez opisu; potrzebne źródła przebiegu ruchu.

## Stan

- Zrobione: luki rodziny olympic przejrzane; 4 nameRules (N1–N4) z istniejącymi funkcjami; źródła S29–S34 i W1G3-S6. Druga sesja (02.11.2026): N4 — 15 par `hinge|upper_back|aux` w zarzutach i rwaniach sztangą; Clean and Jerk przedni akton i triceps → N8/N7 (kb_ballistic.md, źródło W1G3-S11).
- Zostało: Muscle Snatch (rozbieżność rola główna; przedni i boczny akton), martwe ciągi zarzutowe/rwaniowe (funkcja trzymania), Snatch Balance, Jerk Dip Squat, Clean and Press (górna część pleców).
- Następny krok: przy scalaniu — dopisać N1–N8 do `nameRules.reguly`, zmienić `uwaga` funkcji `upper_back.scap_elevate`, przeliczyć liczby (`tests/muscle-roles.test.ts`), nadać ostateczne numery źródeł.
- Pułapki: reguła rodziny `hinge|upper_back` albo `squat|front_delt` objęłaby martwe ciągi i przysiady nad głową (fałszywe zdania); nameRules nie mają fazy; nie rozszerzać N4 na kettlebell/hantle bez źródła.
