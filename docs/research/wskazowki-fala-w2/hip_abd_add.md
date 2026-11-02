# Wskazówki techniki — rodzina `hip_abd_add` (fala W2, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny (fala W2)
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Podstawa: wyniki W1 (gałąź badania/g4-nogi, plik `docs/research/wskazowki-fala-w1/hip_abd_add.md`) po przeliczeniu szczebli
(plik `przeliczenie-szczebli-2026-11-02.md`, sekcja `hip_abd_add.md`) i szczeble wg `szczeble-organizacji-2026-11-02.md`
(gałąź badania/lokalne-0211, rozstrzygnięcie + uzupełnienia 1–3). Rodzina ma pozy v2 (`lib/figures/v2/poses/hip_abd_add.json`) →
karta tylko z ≥ 1 błędem (docs/18:147). Żadne ćwiczenie rodziny nie ma trybu `own` w `lib/figures/v2/cue-sets.json` (linie 25, 98–99, 264–265, 268, 331, 386).

## Ćwiczenia

| Ćwiczenie | poza v2 | stan po W2 | co dodano w W2 | brak |
|---|---|---|---|---|
| Lateral Band Walk | tak | **gotowe z błędem** | 3 błędy: 2 wnioskowane (`bw.mis.straight` ← `bw.squat`, `bw.mis.narrow` ← `bw.tension`), 1 ze źródeł (`bw.mis.sway`: NASM wprost + ACE 6315 „błąd = zaprzeczenie standardu”) | — |
| Band Hip Adduction | nie (rodzina z pozami) | **gotowe z błędem** (uproszczenie: wariant sprzętu) | błąd wnioskowany `hadd.mis.short` ← `hadd.move` | wskazówki (`fp.chest` — tylko ACE 104) |
| Cable Hip Adduction | tak | **gotowe z błędem** (uproszczenie: wariant sprzętu) | ustawienie + ruch: ACE 104 (wyciąg) + ISSA (guma, wariant sprzętu — lustro rozumowania W1 dla Band Hip Adduction); błąd `hadd.mis.short` | wskazówki |
| Hip Abduction (maszyna) | tak | otwarte | szukano oryginału instrukcji producenta i drugiego producenta — bez wyniku (niżej) | 2 źródła szczebla 4 |
| Hip Adduction (maszyna) | tak | otwarte | jak wyżej | 2 źródła szczebla 4 |
| Cable Hip Abduction | tak | otwarte | Catalyst 778 (guma, szczebel 4) — jedno źródło | drugie źródło szczebla 4 |
| Monster Walk | tak | otwarte | ustalono ruch figury (krok w przód i na zewnątrz); Catalyst 500 — jedno źródło szczebla 4 opisujące ten ruch | drugie źródło szczebla 4; miejsce gumy (niżej) |
| Hip Flexion with Band | nie | otwarte | bez nowych źródeł (limit kontekstu) | 2 źródła z jawnym kierunkiem ruchu |

Uwagi do figur (dla koordynatora, nie zmieniają kart):
- Monster Walk: figura (`hip_abd_add.json:1791–2114`) pokazuje gumę przy kostkach (`"mocowanie": "kostki"`, :1803) i krok nogą prowadzącą w przód i na zewnątrz
  (kostka R z [0, 7, 14] do [26, 7, 28]), a Lateral Band Walk (`:1427–1750`) — czysty krok w bok (kostka R z z = 14 do z = 40).
  Zatem karta Monster Walk ma opisywać marsz w przód „po skosie”, nie chód w bok z ACE 6315 (ACE nazywa „Monster Walks” chód w bok — ta strona nie pasuje do figury tego klucza).
  Catalyst 500 zakłada minigumę tuż pod kolanami — figura ma ją przy kostkach; do rozstrzygnięcia przy domknięciu karty (zdanie o gumie nie może przeczyć figurze).
- Cable Hip Adduction: figura kończy ruch w linii środka ciała, nieco przed nogą podporową (kostka R [9.8, 8.6, 0], noga podporowa z = −10;
  `hip_abd_add.json:1370–1387`); zdanie `hadd.move` („przed nogę podporową”) i ACE 104 („directly in front of the left foot”) — zgodne kierunkowo,
  figura nie przekracza linii nogi podporowej. Do oceny w recenzji ruchu (bramka 4), nie blokuje tekstu.

### Blok do wdrożenia

```json
{
  "Lateral Band Walk": {
    "setup": [
      {"c": "bw.setup", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — minigumę „just above your knees (or lower…)”, stopy na szerokość bioder"],
        ["ace-pro-5043", "Lateral Band Walks — „Place a band of appropriate resistance around the shins, above the ankles.”"],
        ["ace-pro-6315", "Monster Walks (chód w bok) — „Place the Versa Loop just above the knee.”"]
      ]}
    ],
    "move": [
      {"c": "bw.move", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „sidestep in one direction with slow and controlled steps”"],
        ["ace-pro-6315", "Monster Walks — „Laterally walk to the right, with the right leg initiating the step.”"]
      ]}
    ],
    "tips": [
      {"c": "bw.squat", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — kolana ugięte, pozycja atletyczna („almost a squat”)"],
        ["ace-pro-6315", "Monster Walks — „keep a soft bend at the knees”"]
      ]},
      {"c": "bw.tension", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — stopy co najmniej na szerokość bioder, by utrzymać opór gumy"],
        ["ace-pro-6315", "Monster Walks — „Maintain resistance with the band”"]
      ]}
    ],
    "mistakes": [
      {"c": "bw.mis.straight", "s": [["wniosek", "bw.squat"]]},
      {"c": "bw.mis.narrow", "s": [["wniosek", "bw.tension"]]},
      {"c": "bw.mis.sway", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „Keep your core tight so that your upper body does not sway.”"],
        ["ace-pro-6315", "Monster Walks — „Begin in an upright, athletic stance…” (błąd = zaprzeczenie standardu)"]
      ]}
    ]
  },
  "Band Hip Adduction": {
    "setup": [
      {"c": "hadd.setup", "s": [
        ["issa-gracilis", "Standing thigh adduction with a resistance band — „Stand with one end of the band around the ankle and the other around a stationary object.”"],
        ["ace-104", "Standing Hip Adduction (wyciąg; uproszczenie: wariant sprzętu) — „Position the cuff just above the ankle on the right foot”, bokiem do maszyny"]
      ]}
    ],
    "move": [
      {"c": "hadd.move", "s": [
        ["issa-gracilis", "Standing thigh adduction with a resistance band — „pulling the leg closer to the body's midline”, potem powrót"],
        ["ace-104", "Standing Hip Adduction (wyciąg; uproszczenie: wariant sprzętu) — „When the right foot is directly in front of the left foot, pause…”, potem powolny powrót"]
      ]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "hadd.mis.short", "s": [["wniosek", "hadd.move"]]}
    ]
  },
  "Cable Hip Adduction": {
    "setup": [
      {"c": "hadd.setup", "s": [
        ["ace-104", "Standing Hip Adduction — „Place a cable pulley at the lowest position with a cuff attachment.”; mankiet nad kostką"],
        ["issa-gracilis", "Standing thigh adduction with a resistance band (uproszczenie: wariant sprzętu guma) — guma na kostce, drugi koniec przy stałym punkcie"]
      ]}
    ],
    "move": [
      {"c": "hadd.move", "s": [
        ["ace-104", "Standing Hip Adduction — stopa do środka, aż znajdzie się „directly in front of the left foot”, potem powolny powrót"],
        ["issa-gracilis", "Standing thigh adduction with a resistance band (uproszczenie: wariant sprzętu guma) — „pulling the leg closer to the body's midline”"]
      ]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "hadd.mis.short", "s": [["wniosek", "hadd.move"]]}
    ]
  }
}
```

Uproszczenie (Band/Cable Hip Adduction): **wariant sprzętu `Standing Hip Adduction`** — guma zaczepiona z boku na wysokości kostki i niski wyciąg
z mankietem ciągną nogę w tę samą stronę (na zewnątrz), a ruch to ta sama droga stopy do linii środka ciała i powrót; różni się tylko przebieg oporu.
Tak samo W1 potraktował Band Hip Adduction (ISSA + ACE 104 jako wariant: wyciąg); W2 stosuje to symetrycznie do Cable Hip Adduction.

Uwaga do `hadd.mis.short`: błąd wnioskowany o skróconym zakresie jest blisko granicy „ogólnego” — zostawiam, bo dotyczy konkretnego punktu końcowego
tego ruchu (stopa przed nogą podporową, ACE 104) i da się go pokazać na rysunku (stopa zatrzymana z boku). Jeśli koordynator uzna go za zbyt ogólny,
Band/Cable Hip Adduction wracają do „częściowe” (ustawienie + ruch, bez wejścia — docs/18:147). Lepszy kandydat — „tułów przechyla się w bok” (zaprzeczenie `fp.chest`) —
wymaga drugiego źródła do `fp.chest` (dziś tylko ACE 104; Prehab — 5).

Uwaga do zestawu ogólnego: karty powyżej zastępują `mis.jerk` z zestawów (`cue-sets.json:25, 99, 331`); żadne przeczytane źródło nie opisuje szarpania przy tych ćwiczeniach.

## Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| bw.mis.straight | Prostujesz nogi w czasie marszu i wychodzisz z przysiadu. | Straightening your legs as you walk and coming out of the squat. | wniosek z `bw.squat` (przysiad trzymany przez cały marsz); widać na rysunku (kolana proste) |
| bw.mis.narrow | Stopy schodzą się za blisko i guma luźnieje. | Letting your feet come too close together so the band goes slack. | wniosek z `bw.tension`; NASM: stopy co najmniej na szerokość bioder, by guma stawiała opór |
| bw.mis.sway | Tułów buja się na boki przy każdym kroku. | Swaying your upper body side to side with each step. | NASM wprost; ACE 6315 „upright, athletic stance” (błąd = zaprzeczenie standardu) |
| hadd.mis.short | Noga zatrzymuje się w pół drogi, zanim dojdzie przed nogę podporową. | Stopping halfway before your foot gets in front of your standing leg. | wniosek z `hadd.move` (punkt końcowy: ACE 104 „directly in front of the left foot”) |

Zdania z W1 (propozycje, jeszcze nie w `lib/cues/text/pl.json`): `bw.setup`, `bw.move`, `bw.tension`, `hadd.setup`, `hadd.move` — treść w pliku W1.
Zdanie istniejące: `bw.squat` (`lib/cues/text/pl.json:31`).

## Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| nasm-blog-active-recovery | https://www.nasm.org/resource-center/blog/active-recovery | NASM | Kinsey Cave, MPH, NASM Master Instructor & Master Trainer; 24.07.2025, aktualizacja 24.01.2026 (przeczytane 02.11.2026, sekcja „Lateral Band Walk”) | 4 — organizacja szkoląca trenerów, autor z kwalifikacjami, data na stronie |
| ace-pro-5043 | https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/ | ACE | Elizabeth Kovar, 22.09.2014 (sekcja „Lateral Band Walks”) | 4 — jak wyżej |
| ace-pro-6315 | https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/ | ACE | Elizabeth Kovar, 01.03.2017 (sekcja „Monster Walks” = chód w bok) | 4 — ta sama organizacja co ace-pro-5043 (liczone jako jedno źródło) |
| ace-104 | https://www.acefitness.org/resources/everyone/exercise-library/104/standing-hip-adduction/ | ACE | biblioteka ćwiczeń ACE (przeczytane 02.11.2026, akapit instrukcji) | 4 — biblioteka organizacji szkolącej trenerów |
| issa-gracilis | https://www.issaonline.com/blogs/strength/gracilis-muscle-pain-causes-stretches-strength-exercises | ISSA | firmowane „ISSA”, 05.02.2024 (sekcja „Standing thigh adduction with a resistance band”) | 4 — ISSA = 4 (docs/18:135) |
| catalyst-778 | https://catalystathletics.com/exercise/778/Standing-Banded-Hip-Abduction/ | Catalyst Athletics | biblioteka firmowana przez Catalyst Athletics, Inc., bez autora hasła | 4 — Catalyst = 4 (szczeble-organizacji, wiersz Catalyst; docs/18:135); tylko w „Otwarte” |
| catalyst-500 | https://www.catalystathletics.com/exercise/500/Monster-Walk/ | Catalyst Athletics | jak wyżej | 4 — tylko w „Otwarte” |

Przeczytane, nie liczone (szczebel 5 albo nie źródło): healthanswers.pfizer.com „Hip Abductor Machine” — brak autora, recenzenta i daty → 5;
redefiningstrength.com „Mini Band Monster Walks” — brak autora i kwalifikacji na stronie → 5; adres artykułu Livestrong o Monster Walk
przekierowuje do serwisu aplikacji treningowej → nie źródło; ACE 155 „Standing Hip Abduction” — strona bez instrukcji (tylko metadane).

```json
{
  "ace-104": {"org": "ACE", "title": "ACE Exercise Library: Standing Hip Adduction", "url": "https://www.acefitness.org/resources/everyone/exercise-library/104/standing-hip-adduction/", "level": 4},
  "issa-gracilis": {"org": "ISSA", "title": "ISSA: Gracilis Muscle Pain — Causes, Stretches, Strength Exercises (05.02.2024)", "url": "https://www.issaonline.com/blogs/strength/gracilis-muscle-pain-causes-stretches-strength-exercises", "level": 4}
}
```
(Wpisy `nasm-blog-active-recovery`, `ace-pro-5043`, `ace-pro-6315` — w pliku W1; nie powtarzam.)

## Otwarte

- **Hip Abduction / Hip Adduction (maszyna)** — oryginału instrukcji Life Fitness Pro Series (SL55/SL60) nie znalazłem: wyniki wyszukiwania
  wskazują tylko kopie (manualsdir, manualsarea, manuals.online), a support.lifefitness.com ma dla serii Axiom tylko instrukcję montażu
  (wynik wyszukiwania, strona nieprzeczytana — W1: 403). Drugi producent: Matrix (VS/G3/G7-S74/S75), Cybex (11181, 13180), Hoist — dostępne tylko
  kopie w serwisach z instrukcjami (nieutożsamione), wg wyników wyszukiwania bez kroków ćwiczenia; nie liczą się (uzupełnienie 3).
  Organizacje szczebla 4 (NASM, ACE, ISSA) — brak opisu maszyny w wynikach. Rozstrzygnie: instrukcja producenta pobrana z jego domeny albo
  strona organizacji szczebla 4 z opisem siedzącego odwodzenia/przywodzenia na maszynie.
- **Cable Hip Abduction** — jedno źródło szczebla 4: Catalyst 778 (guma; uproszczenie: wariant sprzętu): „Stand with a band around one ankle and anchored
  to the opposite side.”, „Lift the banded leg out to the side … while maintaining tension and control in the support side hip.” OncoLink (Penn Medicine, „Standing Hip Abduction –
  Gluteus Medius”) — 403 (dwa adresy); byłby kandydatem szczebla 4 (szpital, uzupełnienie 2). Rozstrzygnie: druga strona szczebla 4 (np. OncoLink z innego dostępu).
- **Monster Walk** — ruch figury: marsz w przód z krokiem na zewnątrz (wyżej). Jedno źródło szczebla 4: Catalyst 500 (miniguma tuż pod kolanami; „Bend the knees and hinge
  at the hips to get into an athletic stance…”; krok w przód „by first bringing it in to the other foot, and then back out”). ACE 6315 opisuje inny ruch (chód w bok) — nie liczy się.
  Rozstrzygnie: druga strona szczebla 4 z marszem w przód/skos oraz zgodność miejsca gumy z figurą (figura: kostki; Catalyst: pod kolanami).
  Proponowane zdanie ruchu (po domknięciu): `mw.move` „Idź do przodu krokami w skos — każda stopa w przód i trochę na zewnątrz.” / „Walk forward with wide diagonal steps — each foot forward and slightly out.”;
  zdanie o gumie — dopiero po ustaleniu miejsca.
- **Hip Flexion with Band** — bez zmian względem W1 (brak jawnego kierunku ruchu w źródłach szczebla 4); nie badane ponownie w W2 (limit kontekstu).
- **MyMichigan Health „Hip Strength Exercises” (PDF) i University of Melbourne CHESM „Hip adductor exercises”** — 403; kandydaci szczebla 4
  (system ochrony zdrowia, uczelnia) dla przywodzenia/odwodzenia na stojąco z gumą i dla `fp.chest`.
- **`fp.chest` przy Band/Cable Hip Adduction** — tylko ACE 104 („Keep the back straight”); bez drugiego źródła zdanie i błąd „tułów przechyla się” nie wchodzą.
