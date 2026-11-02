# Wskazówki techniki — rodzina sled_throw: sanki i ruchy całego ciała

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3) · druga sesja tego samego dnia: korekta szczebli wg rozstrzygnięcia
koordynatora linii 1.1 z 02.11.2026 (Breaking Muscle = 5; producent = 4 tylko dla własnego rodzaju sprzętu; BarBend = 4 tylko artykuły o technice).

Zakres: Sled Push, Turkish Get Up, Sled Drag (Harness), Backward Drag, Sledgehammer Swings, Bear Crawl Sled Drag,
Sled Forward Drag with Press, Sled Overhead Backward Walk, Spider Crawl (definicje: `docs/research/equipment/catalog.json`,
`lib/figures/v2/poses/sled_throw.json`). Reguła: wyjątek dla wskazówek techniki z CLAUDE.md — zdanie wchodzi, gdy potwierdzają je
2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji. Tylko zbieranie danych — kod, `data/zrodla/*.json` i `lib/**` bez zmian.

> **Przeliczenie 02.11.2026:** statusy w sekcji 1 i blok w sekcji 2 są NIEAKTUALNE — wiążąca jest sekcja „Korekta szczebli — przeliczenie koordynatora 02.11.2026” na końcu pliku.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Sled Push | częściowe | setup, move (`sled.legs`), 2 wskazówki potwierdzone (Rep Fitness + BarBend + EliteFTS + Torque). `sled.extend` cofnięte do Otwartych (drugim źródłem był Breaking Muscle, szczebel 5). Brak błędu z dwoma źródłami (O1). |
| Turkish Get Up | częściowe | setup, move, 2 wskazówki potwierdzone; błąd „ugięta ręka” tylko jako wariant do decyzji koordynatora (O2). Istniejące `tgu.eyes` zastąpione węższym `tgu.eyesLow` (O2a). |
| Backward Drag | częściowe | tylko setup (`sled.backGrip`). `sled.backWalk` cofnięte do Otwartych (drugim źródłem był Breaking Muscle). Brak błędu (O3). |
| Sled Drag (Harness) | otwarte | jedno źródło szczebla 4 (Torque, Harness Pull) + Breaking Muscle (szczebel 5) — O4. |
| Sledgehammer Swings | otwarte | O5. |
| Bear Crawl Sled Drag | otwarte | O6. |
| Sled Forward Drag with Press | otwarte | O7. |
| Sled Overhead Backward Walk | otwarte | O8. |
| Spider Crawl | otwarte | O9. |

## 2. Dane (format `data/zrodla/cues.json`) — NIEAKTUALNY — patrz przeliczenie 02.11.2026

```json
{
  "orgs": {
    "Rep Fitness": {"name": "Rep Fitness — blog Training (producent sanek i sprzętu; autor z NASM-CPT, weryfikacja NASM-CPT)", "level": 4, "kind": "maker"},
    "EliteFTS": {"name": "EliteFTS — artykuły szkoleniowe (producent sanek do ciągnięcia i pchania, autorzy-trenerzy)", "level": 4, "kind": "maker"},
    "Torque Fitness": {"name": "Torque Fitness — Ultimate TANK Training Guide (producent sanek do pchania i ciągnięcia)", "level": 4, "kind": "maker"},
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; szkolenie trenerów podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "StrongFirst": {"name": "StrongFirst — standardy i artykuły szkoły instruktorów kettlebell (strongfirst.com)", "level": 4, "kind": "org"}
  },
  "sources": {
    "ace-388": {"org": "ACE", "title": "Turkish Get-up (#388)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/388/turkish-get-up/", "level": 4},
    "catalyst-481": {"org": "Catalyst Athletics", "title": "Turkish Get-up (#481)", "url": "https://catalystathletics.com/exercise/481/Turkish-Get-up/", "level": 4},
    "sf-sinister": {"org": "StrongFirst", "title": "Sinister — Get-Up Standards", "url": "https://www.strongfirst.com/achieve/sinister/", "level": 4},
    "rep-sled-push": {"org": "Rep Fitness", "title": "Sled Push Technique Guide (2026)", "url": "https://repfitness.com/blogs/training/sled-push-technique", "level": 4},
    "rep-sled-pull": {"org": "Rep Fitness", "title": "3 Techniques to Elevate Your Sled Pull Workouts (J. Dickson, 23.01.2026)", "url": "https://repfitness.com/blogs/training/sled-pull-workout", "level": 4},
    "barbend-sled-push": {"org": "BarBend", "title": "How to Do the Sled Push (M. Dewar, CSCS)", "url": "https://barbend.com/sled-push/", "level": 4},
    "elitefts-shove": {"org": "EliteFTS", "title": "Shove It! Top Pushing Moves (D. Balzarini, 05.07.2011)", "url": "https://elitefts.com/blogs/training/shove-it-top-pushing-moves", "level": 4},
    "elitefts-drag-variations": {"org": "EliteFTS", "title": "Endless Sled Dragging Variations (2011/2020)", "url": "https://elitefts.com/blogs/training/endless-sled-dragging-variations-that-will-dramatically-improve-your-performance", "level": 4},
    "torque-utg-2024": {"org": "Torque Fitness", "title": "Ultimate TANK Training Guide (2024, PDF; kopia u dystrybutora)", "url": "https://cdn.fitshop.co.uk/files/torque/functional_training_and_strongman/TOR-TANKMX/Ultimate_TANK_Training_Guide_2024.pdf", "level": 4}
  },
  "exercises": {
    "Sled Push": {
      "setup": [
        {"c": "sled.pushGrip", "s": [
          ["rep-sled-push", "Choose Your Hand Position (wysokie uchwyty na prostych rękach albo niższe; parafraza)"],
          ["barbend-sled-push", "How to Do the Sled Push, krok 2 („Place the hands about halfway down the sled handles.”)"],
          ["torque-utg-2024", "s. 40, Push, Instructions 1 („Grasp handles with both hands…”)"],
          ["elitefts-shove", "Prowler („…grab the handles, get in a proper forward lean position, and get pushing.”)"]
        ]}
      ],
      "move": [
        {"c": "sled.legs", "s": [
          ["rep-sled-push", "Take Short, Quick Steps („Don't push with your arms since they are not nearly as strong as your legs.”)"],
          ["barbend-sled-push", "krok 3 („…begin aggressively driving forward with your legs.”; odpychanie przodem stopy)"]
        ]}
      ],
      "tips": [
        {"c": "sled.lean", "s": [
          ["rep-sled-push", "Get Low and Lean In (pochylenie ok. 45°; parafraza)"],
          ["barbend-sled-push", "krok 2 (pochylenie w przód, plecy płasko, blisko równolegle do podłoża; parafraza)"],
          ["elitefts-shove", "Prowler („get in a proper forward lean position”)"]
        ]},
        {"c": "hinge.back", "s": [
          ["rep-sled-push", "Get Low and Lean In (plecy płaskie) oraz Avoid These Common Mistakes (bez zaokrąglania lędźwi; parafraza)"],
          ["barbend-sled-push", "krok 2 („…lean forward so your back is flat…” — parafraza w odpowiedzi strony)"]
        ]}
      ],
      "mistakes": []
    },
    "Turkish Get Up": {
      "setup": [
        {"c": "tgu.setup", "s": [
          ["catalyst-481", "opis, zdania 1–2 („Lie on your back and hold a kettlebell or similar straight up in one extended arm.”)"],
          ["ace-388", "ustawienie (na plecach, kolano po stronie ciężaru ugięte, stopa płasko, ciężar prosto nad sobą; parafraza)"]
        ]}
      ],
      "move": [
        {"c": "tgu.move", "s": [
          ["catalyst-481", "opis, zdania 4–11 (podpór na wolnej ręce, wysoki mostek, noga pod siebie do klęku, wstanie, powrót tą samą drogą; parafraza)"],
          ["ace-388", "kroki wstawania i powrotu (dłoń w podłogę, mostek, kolano pod biodra, klęk, wstanie; odwrotnie w dół; parafraza)"]
        ]}
      ],
      "tips": [
        {"c": "tgu.arm", "s": [
          ["catalyst-481", "opis, zdanie 10 („with the weight still stabilized overhead on a straight arm”)"],
          ["ace-388", "ustawienie i krok wstawania („hold it straight overhead”; „Continue to hold the right arm overhead”)"],
          ["sf-sinister", "Get-Up Standards, punkty 3 i 8 („The elbow on the kettlebell side is locked and the shoulder is packed.”)"]
        ]},
        {"c": "tgu.eyesLow", "s": [
          ["catalyst-481", "opis, zdanie 6 („It typically helps to look at the weight throughout the exercise.”)"],
          ["ace-388", "krok mostka („Keeping the eyes on the kettlebell throughout the movement”)"]
        ]}
      ],
      "mistakes": []
    },
    "Backward Drag": {
      "setup": [
        {"c": "sled.backGrip", "s": [
          ["rep-sled-pull", "Backwards Walk („You can hold the rope in your hands…”)"],
          ["elitefts-drag-variations", "Sled Exercises, pozycja 16 („Backward drag with split rope…”) i The Belt (lina z dwoma uchwytami w kształcie Y)"]
        ]}
      ],
      "move": [],
      "tips": [],
      "mistakes": []
    }
  }
}
```

Uwagi do danych:
- Usunięte z danych w tej sesji (korekta szczebli): `sled.extend` w Sled Push i `sled.backWalk` w Backward Drag — w obu drugim źródłem był
  Breaking Muscle (szczebel 5). Zostają w Otwartych z jednym źródłem szczebla 4.
- Rep Fitness i EliteFTS zostają na szczeblu 4: obaj sprzedają własne sanki (Rep: kolekcja sanek podlinkowana z artykułu o ciągnięciu;
  EliteFTS: m.in. Compact Dragging Sled, Push Sled, Prowler — strony produktów w sklepie elitefts.com). Torque Fitness produkuje sanki TANK.
- `hinge.back` przy BarBend: strona zwrócona przez narzędzie jako parafraza („flat back”) — przy przenoszeniu do danych warto sprawdzić
  dokładne brzmienie kroku 2.
- `Turkish Get Up` (`tgu.eyesLow`): ACE i Catalyst — wzrok na ciężarze przez cały ruch; standard StrongFirst wymaga neutralnej szyi od wykroku
  w górę (punkt 9). Część wspólna: wzrok na ciężarze przy podłodze.

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| sled.pushGrip | Stań za sankami i chwyć słupki. | Stand behind the sled and grab the posts. |
| sled.backGrip | Chwyć linę albo pasy sanek w obie ręce. | Hold the sled rope or straps in both hands. |
| tgu.setup | Połóż się na plecach, ciężar w wyprostowanej ręce nad sobą; nogę po tej stronie ugnij, stopa płasko na podłodze. | Lie on your back with the weight held straight up in one arm; bend the leg on that side, foot flat on the floor. |
| tgu.move | Wstawaj etapami: podeprzyj się wolną ręką, unieś biodra, przełóż prostą nogę pod siebie do klęku i wstań. Wracaj tą samą drogą. | Get up in stages: prop on your free hand, lift your hips, sweep the straight leg under you to a kneel and stand up. Go back down the same way. |
| tgu.eyesLow | Dopóki jesteś przy podłodze, patrz na ciężar. | While you're down on the floor, keep your eyes on the weight. |

Zdania przygotowane, ale dziś bez dwóch źródeł (nie do danych): `sled.extend` „Przy każdym kroku wyprostuj do końca nogę, którą się odpychasz.”,
`sled.backWalk` „Odchyl się od sanek i idź tyłem, odpychając się nogami.”.
Wariant do decyzji koordynatora (O2): `tgu.mis.bentArm` „Ręka z ciężarem ugina się w łokciu.” / „The arm holding the weight bends at the elbow.”

Istniejące zdania użyte bez zmian: `sled.lean`, `sled.legs`, `hinge.back`, `tgu.arm`.

## 4. Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| ace-388 | https://www.acefitness.org/resources/everyone/exercise-library/388/turkish-get-up/ | ACE | 4 | cały opis kroków |
| catalyst-481 | https://catalystathletics.com/exercise/481/Turkish-Get-up/ | Catalyst Athletics | 4 | cały opis (11 zdań) |
| sf-sinister | https://www.strongfirst.com/achieve/sinister/ | StrongFirst | 4 | Get-Up Standards, 11 punktów |
| (pomocniczo, ta sama organizacja co ace-388) | https://www.acefitness.org/continuing-education/prosource/november-2015/5686/ace-technique-series-turkish-get-up/ | ACE | 4 | kroki, wskazówki, błędy |
| rep-sled-push | https://repfitness.com/blogs/training/sled-push-technique | Rep Fitness (producent sanek) | 4 | wszystkie sekcje, w tym błędy |
| rep-sled-pull | https://repfitness.com/blogs/training/sled-pull-workout | Rep Fitness | 4 | Backwards Walk, Arm Pull, Hip Drive Pull; autor, data, recenzent |
| barbend-sled-push | https://barbend.com/sled-push/ | BarBend (artykuł o technice) | 4 | How to Do the Sled Push, kroki 1–3; brak sekcji błędów |
| elitefts-shove | https://elitefts.com/blogs/training/shove-it-top-pushing-moves | EliteFTS | 4 | akapit o pchaniu sanek (uchwyty, pochylenie) |
| elitefts-drag-variations | https://elitefts.com/blogs/training/endless-sled-dragging-variations-that-will-dramatically-improve-your-performance | EliteFTS | 4 | lista wariantów, The First Time, The Belt |
| elitefts-backward-pull (dziś jedyne źródło `sled.backWalk`) | https://elitefts.com/blogs/training/backwards-sled-pulls-for-quad-size-and-strength | EliteFTS | 4 | technika i błędy jazdy tyłem |
| torque-utg-2024 | https://cdn.fitshop.co.uk/files/torque/functional_training_and_strongman/TOR-TANKMX/Ultimate_TANK_Training_Guide_2024.pdf | Torque Fitness (dokument producenta na serwerze dystrybutora) | 4 | s. 4 How to Use TANK, s. 6, 38, 40 Push, 42, 44 Chest Press, 46, 50, 52, 54 Rope Pull, 56 Rope Tow, 58 Harness Pull |
| bm-sled-6wk | https://breakingmuscle.com/a-six-week-sled-training-program/ | Breaking Muscle | **5** (rozstrzygnięcie 02.11) | Sled Push, Sled Drag, Backward Sled Walk — nie liczy się do dwóch źródeł |
| (nie liczone) Velites, Sled Push Guide | https://usa.velitessport.com/blogs/hyrox-velites-training-program/sled-push-guide-technique-strategy | sprzedawca odzieży i drobnego sprzętu (nie produkuje sanek) | 5 | 4 błędy: siła w górę/dół, za długie kroki, rozchylone łokcie, wstrzymywanie oddechu |
| (nie liczone) GoodLife, Sled Training 101 | https://blog.goodlifefitness.com/article/sled-training-101 | blog sieci klubów, bez kwalifikacji autora | 5 | Sled Push: chwyt, stopy, wyrównanie, skręcanie bioder jako błąd |
| (nie użyte) BarBend TGU | https://barbend.com/news/doing-turkish-get-ups-wrong/ | BarBend | 4 (?) | błędy TGU — dział „news”; czy to artykuł o technice w rozumieniu rozstrzygnięcia — do sprawdzenia |
| (nie użyte) Greg Robins, 6 błędów TGU | https://ericcressey.com/6-common-turkish-get-up-technique-mistakes/ | blog trenera | 5 | 6 błędów |
| (nie użyte) Seedman, sledgehammer | https://www.advancedhumanperformance.com/blog/master-the-sledgehammer-for-strength-and-performance | firma trenerska | 5 | uchwyt, przesuw ręki, biodra, błędy |
| (nie użyte) Onnit, sledgehammer | https://onnit.com/academy/how-to-develop-power-with-sledgehammer-workouts | producent młotów | 4 | tylko ustawienie stóp i ostrzeżenie o ciężarze młota |

Niedostępne: ExRx (403), NSCA Kinetic Select (403), The Prehab Guys (logowanie), Kettlebell Kings (402), indeks ćwiczeń EliteFTS
(`/education/exercise-index/...`, `/blogs/motivation/...` — 404, m.in. Prowler Forward Drag, Backward Belt Drag, Prowler Bear Crawls,
Ten Prowler Variations), kopia instrukcji Torque na manualmachine.com (403), artykuł EliteFTS o Joe DeFranco (treść ucięta),
strona Invictus o pchaniu sanek (bez treści). Strony aplikacji treningowych i sklepów odzieżowych pominięte zgodnie z zasadami.

## 5. Otwarte

- **O1 Sled Push — błędy i `sled.extend`.**
  - Za długie kroki: wprost w Rep Fitness (błąd) i Velites (błąd), ale Velites ma szczebel 5 (nie produkuje sanek). Brak drugiego szczebla 4.
  - Zbyt mocne zginanie łokci: Torque s. 4 („Keep arms straight as you push. Don't bend at your elbows too much.”) i GoodLife (szczebel 5,
    „avoid buckling at the elbows”). Sprzeczność na szczeblu 4: BarBend krok 3 dopuszcza ugięte ręce jako wariant (więcej pracy nóg),
    Rep Fitness dopuszcza niższy chwyt z przedramionami o słupki. Nie do danych jako błąd.
  - Skręcanie/kołysanie bioder: GoodLife (błąd wprost) i Breaking Muscle („Hips stay level”) — oba szczebel 5.
  - Pchanie rękami, zaokrąglanie lędźwi, unoszenie bioder: tylko Rep Fitness wprost.
  - `sled.extend` (pełny wyprost nogi w każdym kroku): tylko Rep Fitness na szczeblu 4.
- **O2 Turkish Get Up — błędy.** Wariant do decyzji koordynatora: „Ręka z ciężarem ugina się w łokciu.” — błąd wprost w ACE ProSource 5686,
  w StrongFirst jako wymóg standardu (łokieć zablokowany, punkt 3). Zgodnie z zasadą roboczą nie wpisane jako gotowe. Inne: ACE — nadgarstek
  odgięty, pominięcie etapu, pośpiech; BarBend (dział news) — ręka podporowa przy ciele, kolano za blisko dłoni, za krótki krok w tył;
  `mis.jerk` z zestawu ogólnego — StrongFirst „without jerky transitions”, ACE tylko „Don't rush”: nie to samo, poza danymi.
  - **O2a Wzrok** — sprzeczność na szczeblu 4 (opis wyżej); `tgu.eyes` z zestawu ogólnego („przez cały ruch”) do zastąpienia.
  - `tgu.arm` mówi „Kettlebell”, katalog dopuszcza hantel — sprawa produktowa (neutralne zdanie „Ciężar…”, te same trzy źródła).
- **O3 Backward Drag — move, błędy.** `sled.backWalk`: EliteFTS (backward pulls: odchylenie od sanek, praca nóg) + Breaking Muscle (5) →
  jedno źródło szczebla 4. Rep Fitness (Backwards Walk) mówi tylko, że to najwolniejszy, najskuteczniejszy sposób, bez techniki kroku.
  Błędy (nie wiosłuj rękami, bez długich kroków) — tylko EliteFTS. Zestaw ogólny `sled.legs` dla tego wariantu niepotwierdzony.
- **O4 Sled Drag (Harness).** Torque s. 58 Harness Pull: pas na biodrach przypięty do sanek, pochylenie w przód, praca nóg — szczebel 4.
  Drugi opis tylko Breaking Muscle (5). Kandydaci do danych po drugim źródle: `sled.lean`, `sled.legs` i nowe zdanie ustawienia z pasem.
  Zestaw ogólny dla tego wariantu ma dziś jedno źródło szczebla 4 — informacja o błędzie zestawu.
- **O5 Sledgehammer Swings.** Jedyny opis techniki — firma trenerska (szczebel 5); Onnit (producent młotów) tylko ustawienie stóp. W tej sesji
  bez nowych źródeł.
- **O6 Bear Crawl Sled Drag.** EliteFTS wymienia bez techniki; strona „Prowler Bear Crawls” EliteFTS — 404.
- **O7 Sled Forward Drag with Press.** Torque s. 44 Chest Press to odpychanie sanek z miejsca i dobieganie — inne ćwiczenie niż marsz
  z wypchnięciem; EliteFTS — wyciskanie w miejscu albo w wykroku. Brak opisu.
- **O8 Sled Overhead Backward Walk.** Brak przeczytanego opisu w źródłach szczebla 4.
- **O9 Spider Crawl.** Znalezione opisy dotyczą pompki z kolanem do łokcia, nie czołgania z katalogu; bez przenoszenia (analogia).

## 6. Stan

- Zrobione (sesja 1): Sled Push, Turkish Get Up, Backward Drag częściowe; źródła ACE, Catalyst, StrongFirst, Rep Fitness, EliteFTS.
- Zrobione (sesja 2, 02.11.2026): korekta szczebli (Breaking Muscle → 5: wypadły `sled.extend` i `sled.backWalk`); Sled Push dostał drugie
  i trzecie źródło szczebla 4 (BarBend, EliteFTS „Shove It”, Torque) dla chwytu, pracy nóg, pochylenia i pleców; przeczytane strony 0–6,
  36–58 instrukcji Torque; sprawdzone kandydatury błędów dla Sled Push (O1) i TGU (O2, wariant do decyzji). Nowe zdania w danych: 5
  (+2 przygotowane, +1 wariant błędu). Nowe źródła: barbend-sled-push, elitefts-shove, torque-utg-2024; nowa organizacja Torque Fitness.
- Zostało: błędy dla Sled Push, TGU (decyzja koordynatora o wariancie), Backward Drag; move dla Backward Drag; drugie źródło szczebla 4 dla
  Sled Drag (Harness); O5–O9 bez postępu.
- Następny krok: (1) instrukcja Torque s. 59–62 (pozostała część biblioteki ruchów — możliwy backpedal z pasem dla Backward Drag) — plik PDF
  to obrazy, czytać po 2–3 strony; (2) inni producenci sanek z instrukcjami (np. dokumentacja sanek z pasem i liną); (3) dla TGU — artykuły
  StrongFirst o get-upie z listą błędów; (4) dla młota — producenci młotów/opon z instrukcją.
- Pułapki: strony PDF Torque to obrazy (duży koszt kontekstu); indeks ćwiczeń EliteFTS zwraca 404; większość wyników o pchaniu sanek to
  strony zawodów, aplikacji i sklepów odzieżowych (szczebel 5 albo zakazane); BarBend dział „news” — status szczebla niepewny.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3); reguła „błąd = zaprzeczenie standardu” (uzup. 2). Kryterium karty z 02.11.2026: ustawienie + ruch.

| Źródło | Szczebel | Dowód |
|---|---|---|
| ace-388, ACE ProSource 5686 (jedna organizacja), catalyst-481, sf-sinister | 4 | bez zmian; ProSource to publikacja ACE (treść firmowana, 11.2015) |
| rep-sled-push, rep-sled-pull | 4 | producent sanek — materiał o własnym rodzaju sprzętu |
| torque-utg-2024 | 4 | producent sanek TANK — instrukcja własnego sprzętu (kopia u dystrybutora; dokument producenta z tytułem i rokiem) |
| elitefts-shove, elitefts-drag-variations, elitefts-backward-pull | 4 | producent sanek (Prowler, sanki do ciągnięcia) — własny rodzaj sprzętu, artykuły z autorem i datą (bez zmian) |
| barbend-sled-push | 4 | strona (WebFetch 02.11): „Written by Mike Dewar”, biogram „Certified Strength and Conditioning Specialist (CSCS)”, „Last updated on June 28th, 2024”; artykuł techniki. Krok 2: „lean forward so that your spine is parallel to the ground and your lower back is flat” — potwierdza brzmienie `hinge.back` |
| onnit sledgehammer (nieużyte) | **5** (było: 4) | uzup. 3, wiersz Onnit |
| bm-sled-6wk, Velites, GoodLife, Seedman, Robins | 5 | bez zmian |
| BarBend „doing-turkish-get-ups-wrong” (dział news, nieużyte) | bez oceny | nie otwierane — bez wpływu |

| Zdanie (ćwiczenie) | Źródła ≥ 4 po przeliczeniu | Stan |
|---|---|---|
| `sled.pushGrip`, `sled.legs`, `sled.lean`, `hinge.back` (Sled Push) | Rep Fitness + BarBend (+ Torque, EliteFTS) | zostaje |
| `tgu.setup`, `tgu.move`, `tgu.arm`, `tgu.eyesLow` (Turkish Get Up) | Catalyst + ACE (+ StrongFirst dla `tgu.arm`) | zostaje |
| `tgu.mis.bentArm` (Turkish Get Up) | ACE ProSource 5686 (błąd wprost) + StrongFirst pkt 3 (łokieć zablokowany) — **błąd = zaprzeczenie standardu** (ta sama część ciała, to samo kryterium; wymieniony wprost w uzup. 2 STAN pkt 8) | **wchodzi** (było: wariant do decyzji) |
| `sled.backGrip` (Backward Drag) | Rep Fitness + EliteFTS | zostaje jako zdanie — karta bez ruchu |
| Sled Push „zginanie łokci” | Torque vs BarBend/Rep — sprzeczność na szczeblu 4 | nie wchodzi (bez zmian) |

| Karta | Stan przed | Stan po |
|---|---|---|
| Turkish Get Up | częściowe | **własna z błędami** |
| Sled Push | częściowe | **własna bez błędów** |
| Backward Drag | częściowe | **otwarta** (tylko ustawienie; `sled.backWalk` 1 źródło) |
| Sled Drag (Harness), Sledgehammer Swings, Bear Crawl Sled Drag, Sled Forward Drag with Press, Sled Overhead Backward Walk, Spider Crawl | otwarte | otwarte |

Razem sanki (9 ćwiczeń): przed — gotowe 0, częściowe 3, otwarte 6; po — własne z błędami 1, własne bez błędów 1, otwarte 7.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

```json
{
 "orgs": {
  "Rep Fitness": {"name": "Rep Fitness — blog Training (producent sanek i sprzętu; autor z NASM-CPT, weryfikacja NASM-CPT)", "level": 4, "kind": "maker"},
  "EliteFTS": {"name": "EliteFTS — artykuły szkoleniowe (producent sanek do ciągnięcia i pchania, autorzy-trenerzy)", "level": 4, "kind": "maker"},
  "Torque Fitness": {"name": "Torque Fitness — Ultimate TANK Training Guide (producent sanek do pchania i ciągnięcia)", "level": 4, "kind": "maker"},
  "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; szkolenie trenerów podnoszenia ciężarów)", "level": 4, "kind": "site"},
  "StrongFirst": {"name": "StrongFirst — standardy i artykuły szkoły instruktorów kettlebell (strongfirst.com)", "level": 4, "kind": "org"}
 },
 "sources": {
  "ace-388": {"org": "ACE", "title": "Turkish Get-up (#388)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/388/turkish-get-up/", "level": 4},
  "catalyst-481": {"org": "Catalyst Athletics", "title": "Turkish Get-up (#481)", "url": "https://catalystathletics.com/exercise/481/Turkish-Get-up/", "level": 4},
  "sf-sinister": {"org": "StrongFirst", "title": "Sinister — Get-Up Standards", "url": "https://www.strongfirst.com/achieve/sinister/", "level": 4},
  "rep-sled-push": {"org": "Rep Fitness", "title": "Sled Push Technique Guide (2026)", "url": "https://repfitness.com/blogs/training/sled-push-technique", "level": 4},
  "barbend-sled-push": {"org": "BarBend", "title": "How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024)", "url": "https://barbend.com/sled-push/", "level": 4},
  "elitefts-shove": {"org": "EliteFTS", "title": "Shove It! Top Pushing Moves (D. Balzarini, 05.07.2011)", "url": "https://elitefts.com/blogs/training/shove-it-top-pushing-moves", "level": 4},
  "torque-utg-2024": {"org": "Torque Fitness", "title": "Ultimate TANK Training Guide (2024, PDF; kopia u dystrybutora)", "url": "https://cdn.fitshop.co.uk/files/torque/functional_training_and_strongman/TOR-TANKMX/Ultimate_TANK_Training_Guide_2024.pdf", "level": 4},
  "ace-5686-tgu": {"org": "ACE", "title": "ACE Technique Series: Turkish Get-up (ProSource, 11.2015)", "url": "https://www.acefitness.org/continuing-education/prosource/november-2015/5686/ace-technique-series-turkish-get-up/", "level": 4}
 },
 "exercises": {
  "Sled Push": {
   "setup": [
    {"c": "sled.pushGrip", "s": [["rep-sled-push", "Choose Your Hand Position (wysokie uchwyty na prostych rękach albo niższe; parafraza)"], ["barbend-sled-push", "How to Do the Sled Push, krok 2 („Place the hands about halfway down the sled handles.”)"], ["torque-utg-2024", "s. 40, Push, Instructions 1 („Grasp handles with both hands…”)"], ["elitefts-shove", "Prowler („…grab the handles, get in a proper forward lean position, and get pushing.”)"]]}
   ],
   "move": [
    {"c": "sled.legs", "s": [["rep-sled-push", "Take Short, Quick Steps („Don't push with your arms since they are not nearly as strong as your legs.”)"], ["barbend-sled-push", "krok 3 („…begin aggressively driving forward with your legs.”; odpychanie przodem stopy)"]]}
   ],
   "tips": [
    {"c": "sled.lean", "s": [["rep-sled-push", "Get Low and Lean In (pochylenie ok. 45°; parafraza)"], ["barbend-sled-push", "krok 2 (pochylenie w przód, plecy płasko, blisko równolegle do podłoża; parafraza)"], ["elitefts-shove", "Prowler („get in a proper forward lean position”)"]]},
    {"c": "hinge.back", "s": [["rep-sled-push", "Get Low and Lean In (plecy płaskie) oraz Avoid These Common Mistakes (bez zaokrąglania lędźwi; parafraza)"], ["barbend-sled-push", "krok 2 („…lean forward so your back is flat…” — parafraza w odpowiedzi strony)"]]}
   ],
   "mistakes": []
  },
  "Turkish Get Up": {
   "setup": [
    {"c": "tgu.setup", "s": [["catalyst-481", "opis, zdania 1–2 („Lie on your back and hold a kettlebell or similar straight up in one extended arm.”)"], ["ace-388", "ustawienie (na plecach, kolano po stronie ciężaru ugięte, stopa płasko, ciężar prosto nad sobą; parafraza)"]]}
   ],
   "move": [
    {"c": "tgu.move", "s": [["catalyst-481", "opis, zdania 4–11 (podpór na wolnej ręce, wysoki mostek, noga pod siebie do klęku, wstanie, powrót tą samą drogą; parafraza)"], ["ace-388", "kroki wstawania i powrotu (dłoń w podłogę, mostek, kolano pod biodra, klęk, wstanie; odwrotnie w dół; parafraza)"]]}
   ],
   "tips": [
    {"c": "tgu.arm", "s": [["catalyst-481", "opis, zdanie 10 („with the weight still stabilized overhead on a straight arm”)"], ["ace-388", "ustawienie i krok wstawania („hold it straight overhead”; „Continue to hold the right arm overhead”)"], ["sf-sinister", "Get-Up Standards, punkty 3 i 8 („The elbow on the kettlebell side is locked and the shoulder is packed.”)"]]},
    {"c": "tgu.eyesLow", "s": [["catalyst-481", "opis, zdanie 6 („It typically helps to look at the weight throughout the exercise.”)"], ["ace-388", "krok mostka („Keeping the eyes on the kettlebell throughout the movement”)"]]}
   ],
   "mistakes": [
    {"c": "tgu.mis.bentArm", "s": [["ace-5686-tgu", "błędy (ręka z ciężarem ugięta w łokciu — wprost jako błąd)"], ["sf-sinister", "Get-Up Standards, punkt 3 („The elbow on the kettlebell side is locked…”) — błąd = zaprzeczenie standardu"]]}
   ]
  }
 }
}
```

Nowe zdania w bloku (5): `sled.pushGrip`, `tgu.setup`, `tgu.move`, `tgu.eyesLow`, `tgu.mis.bentArm` (PL „Ręka z ciężarem ugina się w łokciu.” / EN „The arm holding the weight bends at the elbow.”).
Wypadło z bloku: `sled.backGrip` (karta Backward Drag otwarta) i źródła `rep-sled-pull`, `elitefts-drag-variations`.

Wątpliwości:
1. `tgu.eyesLow` zastępuje `tgu.eyes` z zestawu ogólnego (O2a) — zmiana zestawu ogólnego należy do koordynatora/programisty.
2. `tgu.arm` mówi o kettlebellu, katalog dopuszcza hantel (O2) — sprawa produktowa, bez zmian.
