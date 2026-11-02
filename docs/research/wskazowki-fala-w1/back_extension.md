# Wskazówki techniki — rodzina back_extension (fala W1, 02.11.2026)

Tylko zbieranie danych (polecenie właściciela 02.11.2026). Metoda: docs/research/27 i 33 (≥ 2 przeczytane źródła szczebla 4 z różnych
organizacji; wariant opisany w miejscu odwołania; inne ćwiczenie = analogia). Wzór: „Back Extension” w `data/zrodla/cues.json`.
Bez twierdzeń o zdrowiu kręgosłupa (część źródeł je zawiera — nie przenosimy ich).

Szczeble wg rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): szczebel 4 = naraz (a) organizacja szkoląca/certyfikująca trenerów,
serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu, (b) autor z datą albo treść jawnie firmowana,
(c) nie recenzja afiliacyjna ani marketing; WebMD Ignite (StayWell) = 4 tylko materiał placówki medycznej z datą. Ocena każdego źródła — p. 4.
**Uzupełnienie 3 (02.11.2026):** Barbell Logic warunkowo 4 tylko dla strony z autorem z kwalifikacjami i datą — strona reverse hyper ich nie ma → 5 (sekcja na końcu).

## 1. Podsumowanie

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Reverse Hyperextension | gotowe | 3 (move 1, tips 2) | po uzupełnieniu 3 Barbell Logic = 5 → `rhyp.setup` wstrzymane (tylko Catalyst); `rhyp.move` — Catalyst + ACE (wariant); sprzeczność wysokość/tempo wyjaśniona wariantem — p. 5 |
| Weighted Ball Hyperextension | otwarte | 0 | jedno źródło szczebla 4 (Gaiam); HKU CSE = 5; Gaiam i HKU sprzeczne co do łuku lędźwi |
| Lower Back Curl | gotowe (krótka karta) | 2 (move 1, tips 1) | StayWell/OU Health + Les Mills (oba warianty: unoszenie samej klatki w leżeniu przodem) |

Zestaw ogólny dziś:
- Reverse Hyperextension (`f: hipExt`, ok `bext.noArch`, `llc.control`; err `mis.jerk`) — **NIE potwierdzony; prawdopodobny błąd zestawu
  ogólnego** dla wersji na maszynie (katalog: `requires: reverse_hyper`, `plate_loaded_machine`): Catalyst (4) i Barbell Logic (od uzupełnienia 3 — 5)
  każą unosić nogi wymachem i opuszczać je swobodnie (grawitacja / wymach), co przeczy `llc.control` i `mis.jerk`. `bext.noArch` — tylko
  Catalyst (napięty brzuch i pośladki „to prevent excessive lumbar hyperextension”); Barbell Logic mówi o „full back extension” — otwarte.
- Weighted Ball Hyperextension (`f: backExt`, ok `bext.noArch`; err `mis.jerk`) — nie potwierdzony; Gaiam (4) każe na górze wygiąć lędźwie
  („arching low back”), HKU (5) — ciało w linii prostej, bez unoszenia za wysoko. `bext.noArch` — **możliwy błąd albo sprzeczność**, p. 5.
- Lower Back Curl (`f: cobra`, ok `cobra.hips`, `cobra.control`; err `cobra.mis`) — nie potwierdzony: żadne z dwóch źródeł nie mówi
  wprost o biodrach na podłodze ani o powolnym opuszczaniu; „nie za wysoko” — tylko Les Mills. `cobra.*` pochodzi z innego ćwiczenia
  (wypychanie tułowia rękami — analogia). Zastąpić zdaniami z p. 2.

## 2. Blok do `exercises` (tylko gotowe, po uzupełnieniu 3 z 02.11.2026)

```json
{
  "Reverse Hyperextension": {
    "setup": [],
    "move": [
      {"c": "rhyp.move", "s": [
        ["catalyst-529", "opis ćwiczenia (unieś nogi w górę, potem pozwól im opaść; „Let the legs swing back down and forward as far as your setup will allow.”)"],
        ["ace-64", "kroki 2–3 (wariant: na piłce, dłonie na podłodze; uniesienie nóg i opuszczenie; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "rhyp.legsTogether", "s": [
        ["ace-64", "krok 2 (wariant: na piłce, dłonie na podłodze; „Press and hold your legs together so they move at the same time.”)"],
        ["catalyst-529", "opis ćwiczenia („Keep the feet close to each other”)"]
      ]},
      {"c": "plank.brace", "s": [
        ["ace-64", "krok 2 (wariant: na piłce; napnij mięśnie brzucha, żeby usztywnić tułów; parafraza)"],
        ["catalyst-529", "opis ćwiczenia („…keeping the abs and glutes tight to prevent excessive lumbar hyperextension.”)"]
      ]}
    ],
    "mistakes": []
  },
  "Lower Back Curl": {
    "setup": [],
    "move": [
      {"c": "lbc.move", "s": [
        ["staywell-ou-prone", "krok 3 (wariant: ręce wzdłuż tułowia odciągane w tył; „Slowly raise your chest off the floor, gently pulling your arms behind you.”)"],
        ["lesmills-prone-cobra", "kroki wykonania (wariant: utrzymanie pozycji, kciuki w górę; „Lift your chest just off the floor – you don't need to raise it super high”)"]
      ]}
    ],
    "tips": [
      {"c": "lbc.neck", "s": [
        ["staywell-ou-prone", "krok 3 („Keep your neck straight and your ears in line with your shoulders.”)"],
        ["lesmills-prone-cobra", "kroki wykonania („Keep your chin gently tucked so that your neck is long”)"]
      ]}
    ],
    "mistakes": []
  }
}
```

Uwaga dla recenzenta (Lower Back Curl): oba źródła opisują warianty (StayWell — ćwiczenie dla pacjentów z poduszką pod biodrami,
Les Mills — wytrzymanie w pozycji); do zdań wzięto tylko część wspólną z opisem katalogu (`docs/research/25-biblioteka/L6.json`:
w leżeniu przodem unosi się klatka). Liczby powtórzeń i czasu trzymania z obu źródeł — nie przenoszone.

Uwaga dla recenzenta (Reverse Hyperextension, `rhyp.move`): od uzupełnienia 3 drugim źródłem jest ACE #64 (wariant na piłce, wolno i do wysokości bioder),
pierwszym Catalyst (maszyna, wymach). Zdanie „Unieś nogi w tył i w górę, potem je opuść.” jest częścią wspólną (bez tempa i wysokości) — p. 5.

### Kandydaci wstrzymani — nie do wdrożenia (uzupełnienie 3; brak 2 źródeł szczebla 4)

```json
{
  "Reverse Hyperextension": {
    "setup": [{"c": "rhyp.setup", "s": [
      ["catalyst-529", "opis ćwiczenia („Support the trunk and let the legs hang straight down.”)"],
      ["barbell-logic-rh", "część o ustawieniu („Your hips will hang off the pad.”) — szczebel 5 od uzupełnienia 3"]
    ]}],
    "move": [{"c": "rhyp.move", "s": [
      ["barbell-logic-rh", "część o wykonaniu („To begin the movement, swing your legs up.”) — szczebel 5; zdanie i tak gotowe przez Catalyst + ACE"]
    ]}]
  }
}
```

## 3. Nowe zdania

| id | PL | EN | stan |
|---|---|---|---|
| rhyp.legsTogether | Trzymaj nogi razem — unoś je i opuszczaj jednocześnie. | Keep your legs together — raise and lower them at the same time. | gotowe (sesja 1) |
| rhyp.setup | Połóż się tułowiem na podporze tak, żeby nogi swobodnie zwisały w dół. | Lie with your torso on the pad so your legs hang freely down. | **wstrzymane** (uzupełnienie 3: tylko Catalyst; Barbell Logic = 5) |
| rhyp.move | Unieś nogi w tył i w górę, potem je opuść. | Raise your legs back and up, then lower them. | gotowe (Catalyst + ACE #64 wariant) |
| lbc.move | Leżąc na brzuchu, unieś klatkę nieco nad podłogę, potem połóż się z powrotem. | Lying on your stomach, lift your chest just off the floor, then lie back down. | gotowe |
| lbc.neck | Szyja prosto, w przedłużeniu tułowia — nie zadzieraj głowy. | Keep your neck straight, in line with your body — don't crane your head up. | gotowe |
| ballExt.setup | Połóż się brzuchem na piłce, palce stóp oparte o podłogę. | Lie with your stomach on the ball, toes on the floor. | otwarte (tylko Gaiam = 4; HKU = 5) |
| ballExt.move | Unieś tułów nad piłką, potem wróć w dół. | Lift your torso up off the ball, then lower back down. | otwarte (jw.) |

`plank.brace` — istniejące („Napnij brzuch, żeby tułów był sztywny.”). Sprawdzone istniejące: `bext.move`, `bext.noArch`, `cobra.*` — nie pasują
wprost (inna pozycja albo brak 2 źródeł). Do `lbc.neck`: w `pl.json` nie ma zdania o ustawieniu szyi (szukano „szyj”, „głow”, „broda”).

## 4. Źródła i ocena szczebla

| id | adres | organizacja | szczebel | ocena (a)–(c) |
|---|---|---|---|---|
| ace-64 | https://www.acefitness.org/resources/everyone/exercise-library/64/stability-ball-reverse-extensions/ (#64; czytane 02.11.2026) | ACE | 4 | certyfikuje trenerów; firmowane |
| catalyst-529 | https://catalystathletics.com/exercise/529/Reverse-Hyper/ (czytane 02.11.2026 przez mail.catalystathletics.com) | Catalyst Athletics | 4 | lista koordynatora |
| barbell-logic-rh | https://barbell-logic.com/the-reverse-hyper/ („The Reverse Hyper – Why & How to Use…”, części o ustawieniu i wykonaniu; czytane 02.11.2026) | Barbell Logic | **5** (było 4) | uzupełnienie 3: Barbell Logic warunkowo 4 tylko per strona z autorem z kwalifikacjami i datą; WebFetch 02.11.2026 — brak autora, biogramu, daty i recenzenta (daty na stronie dotyczą tylko innych wpisów w „More Content”). (a) certyfikacja trenerów przez organizację nie wystarcza |
| staywell-ou-prone | https://library.ouhealth.com/Library/HealthSheets/3,S,90683 („Prone Multifidus Activation (Strength)”, kroki 1–4; czytane 02.11.2026) | StayWell (WebMD Ignite) w bibliotece OU Health | 4 | materiał placówki medycznej (OU Health) z datą („Date Last Reviewed: 1/1/2025”), recenzenci medyczni podani |
| lesmills-prone-cobra | https://www.lesmills.com/uk/articles/prone-cobra (C. Baird, 18.12.2017; czytane 02.11.2026) | Les Mills | 4 | (a) szkoli i certyfikuje instruktorów — https://www.lesmills.com/uk/instructors/initial-training (czytane 02.11.2026); (b) autor i data; (c) artykuł o technice |
| gaiam-ball-guide | https://cdn.shopify.com/s/files/1/1728/2157/files/05-62103_GA_WELL_CoreBackStabilityBall_GUIDE.pdf („Core & Back Stability Ball Exercise Guide”, s. 2: Back Extension, Hip Extension; ©2016; czytane 02.11.2026) | Gaiam (producent piłek) | 4 | producent własnego rodzaju sprzętu (piłka); firmowane; instrukcja do produktu (uzupełnienie 3: dokument producenta pobrany z jego CDN, nie kopia u strony trzeciej) |
| hku-cse-lowerback | https://www.cse.hku.hk/document/exercises-SHSC-LowerBack.pdf (s. 2: Stability Ball Back Extension; czytane 02.11.2026) | Centre for Sports and Exercise, Uniwersytet w Hongkongu | 5 | (a) niespełnione — ośrodek sportowy uczelni; na stronie głównej (https://cse.hku.hk/, czytane 02.11.2026) brak szkolenia ani certyfikacji trenerów; materiał bez autora i daty |

Przeczytane, nie użyte: NASM „Floor Prone Cobra” (https://www.nasm.org/resource-center/exercise-library/floor-prone-cobra — wypychanie
tułowia rękami, rozciąganie: inne ćwiczenie, analogia); strona produktu Strength Shop „Reverse Hyper” (bez opisu techniki; sklep — 5);
manuals.plus (instrukcja Dynasty) i blog Mirafit — 403.

## 5. Otwarte

- **Reverse Hyperextension — `rhyp.setup` (od uzupełnienia 3):** podpora pod tułowiem, nogi zwisają — tylko Catalyst (4); Barbell Logic = 5. Szukać drugiego źródła
  szczebla 4 opisującego maszynę reverse hyper (ISSA/NFPT/BarBend z autorem; producent maszyny — instrukcja dla własnej maszyny).
- **Reverse Hyperextension — wysokość i tempo:** sprzeczność z sesji 1 (ACE vs Catalyst) wyjaśnia wariant: wersje na piłce (ACE #64;
  Gaiam „Hip Extension”: „slowly lift straight legs upward to hip height”) — wolno i do wysokości bioder/linii tułowia; wersje na maszynie
  (Catalyst; Barbell Logic — od uzupełnienia 3 szczebel 5) — wymach, „as high as possible” / „full height”, opuszczanie swobodne. Katalog ma wersję na maszynie, ale
  szczebel 4 nie rozstrzyga, która wysokość jest właściwa dla maszyny — liczby i wysokość poza kartą. **Zdania `llc.control` i `mis.jerk` z zestawu ogólnego —
  do usunięcia dla tej maszyny (przeczą Catalyst; Barbell Logic tylko kierunkowo, szczebel 5); `bext.noArch` — tylko Catalyst.** Twierdzenia Catalyst o odciążeniu pleców — nie przenoszone (zdrowie).
- **Reverse Hyperextension — „trzymaj uchwyty”, „biodra poza krawędzią”, pasy na stopy** — tylko Barbell Logic (5).
- **Weighted Ball Hyperextension** — Gaiam (4): brzuch na piłce, palce na podłodze, dłonie za głową, uniesienie głowy i barków z wygięciem
  lędźwi, 1–2 s, powoli w dół; HKU (5): stopy o ścianę, ciało do linii prostej, „Sitting up too far will put unnecessary strain on your lower back.”
  (twierdzenie zdrowotne — nie przenoszone). Brak drugiego źródła szczebla 4; wysokość/łuk — sprzeczne. Ciężar (talerz) — żadne źródło.
  Kandydaci: inni producenci piłek (instrukcje), ACE/ISSA/NFPT.
- **Lower Back Curl** — ręce: StayWell wzdłuż tułowia, Les Mills kciuki w górę (różne) — poza kartą; napięte pośladki, łopatki ściągnięte —
  tylko Les Mills; biodra na podłodze, powolne opuszczanie — żadne wprost.

## 6. Stan (aktualny, 02.11.2026, po uzupełnieniu 3)

- Zrobione: Reverse Hyperextension (po uzupełnieniu 3: 3 zdania — `rhyp.move`, `rhyp.legsTogether`, `plank.brace`; `rhyp.setup` wstrzymane), Lower Back Curl (2 zdania;
  `lbc.move`, `lbc.neck`; źródła staywell-ou-prone, lesmills-prone-cobra), ocena szczebli wg koordynatora (p. 4).
- Zostało: Weighted Ball Hyperextension (drugie źródło szczebla 4 i rozstrzygnięcie łuku); drugie źródło szczebla 4 dla `rhyp.setup`; wysokość nóg na maszynie reverse hyper.
- Następny krok: ISSA/NFPT/BarBend (artykuły o technice) — „stability ball back extension”, „reverse hyper”; instrukcje producentów maszyn reverse hyper (oryginał producenta, nie kopia) i piłek.
- Pułapki: Westside „Reverse Hyper Fundamentals” — 404; manuals.plus i Mirafit — 403; ExRx 403; PDF-y przez WebFetch są binarne, ale
  zapisany plik czyta narzędzie Read (tak HKU i Gaiam).


## Korekta szczebli — uzupełnienie 2 (02.11.2026)

Dopisał koordynator grupy G1 na podstawie ustaleń badaczy (sekcja 6 w `wskazowki-fala-w1/core_floor-2.md`).
Bez zmian stanu. StayWell w bibliotece OU Health (placówka ochrony zdrowia) — szczebel 4, jak w ocenie z drugiej sesji; Lower Back Curl gotowe (2 zdania). HKU CSE — szczebel 5.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: uzupełnienie 3 rozstrzygnięcia koordynatora linii 1.1 (02.11.2026) — Barbell Logic warunkowo 4 per strona (autor z kwalifikacjami + data); sama certyfikacja
trenerów przez organizację nie wystarcza. Strona https://barbell-logic.com/the-reverse-hyper/ przeczytana ponownie (WebFetch 02.11.2026): bez autora, biogramu, daty i recenzenta.

| źródło | przed | po | powód |
|---|---|---|---|
| barbell-logic-rh | 4 | **5** | brak autora z kwalifikacjami i daty na stronie |
| gaiam-ball-guide | 4 | 4 | instrukcja producenta do własnej piłki, z jego serwera (nie kopia) |
| pozostałe (ACE, Catalyst, StayWell/OU Health, Les Mills, HKU) | bez zmian | bez zmian | nie należą do kategorii z uzupełnienia 3 |

| ćwiczenie / zdanie | przed | po | powód |
|---|---|---|---|
| Reverse Hyperextension | gotowe, 4 zdania | gotowe, **3** zdania | — |
| `rhyp.setup` | Catalyst + Barbell Logic | **wstrzymane** (tylko Catalyst) | obniżone |
| `rhyp.move` | Catalyst + Barbell Logic + ACE #64 | Catalyst + ACE #64 (wariant: piłka) | nadal 2 źródła |
| `rhyp.legsTogether`, `plank.brace` | ACE + Catalyst | bez zmian | — |
| Lower Back Curl | gotowe, 2 | gotowe, 2 | — |

Skutek: gotowe 2 → 2 ćwiczenia; zdań 6 → 5.
