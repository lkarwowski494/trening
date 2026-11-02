# pushup_plank (cz. 1, pompki) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zasada: wyjątek dla wskazówek techniki z CLAUDE.md (2 niezależne źródła szczebla 4, żadne przeczytane nie przeczy).
Wszystkie źródła przeczytane przez WebFetch 02.11.2026. ExRx (403) i web.archive.org (zablokowane) niedostępne.
Strony aplikacji treningowych pominięte (uzupełnienie briefu). Zdania zestawu ogólnego „pushup” wpisane tylko tam,
gdzie przeczytane źródła wariantu je potwierdzają — rozbieżności w „Otwarte”.
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — patrz sekcja „Korekta szczebli” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Decline Push Up | otwarte | po korekcie szczebli każde zdanie ma tylko NASM (The Prehab Guys i PureGym → szczebel 5) |
| Push-Up Wide | otwarte | po korekcie każde zdanie ma tylko Healthline (PureGym → 5); błąd — i tak tylko 1 źródło |
| Close-Grip Push-Up | otwarte | po korekcie tylko Men's Health (weighttraining.guide → 5) |
| Incline Push-Up Close-Grip | otwarte | tylko 1 przeczytane źródło wprost obejmujące wariant (i to szczebla 5) |
| Incline Push-Up Reverse Grip | otwarte | brak dostępnego źródła szczebla 4 |
| Single-Arm Push-Up | otwarte | źródła się różnią (dłoń pod barkiem / pod mostkiem), brak 2 źródeł szczebla 4 |
| Push Up to Side Plank | otwarte | po korekcie oba źródła szczebla 5 (The Prehab Guys, Topend Sports) |
| Suspended Push-Up | otwarte | po korekcie tylko TRX (Eleiko → 5: brak autora i daty, producent uchwytów do taśm niepotwierdzony) |
| Push-Ups With Feet On A Stability Ball | otwarte | brak 2 źródeł; strona ACE opisuje inny wariant (dłonie na piłce) |
| Clock Push-Up | otwarte | źródła opisują różne ćwiczenia pod tą nazwą |
| Isometric Wipers | otwarte | po korekcie oba źródła szczebla 5 (weighttraining.guide, Fitness Volt) |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

Po korekcie szczebli z 02.11.2026 żadne ćwiczenie tej części nie ma zdania z 2 niezależnymi źródłami szczebla 4 — blok pusty.
Wycofane zdania z miejscami w źródłach szczebla 4 są w „Otwarte” (do ewentualnego uzupełnienia drugim źródłem).

```json
{}
```

## Nowe zdania (id | PL | EN)

Po korekcie żadne z poniższych zdań nie jest użyte w bloku JSON — zostają jako propozycje do czasu znalezienia drugiego źródła szczebla 4.

| id | PL | EN |
|---|---|---|
| dpush.setup | Dłonie na podłodze, stopy na ławce albo stopniu; ciało proste od głowy do pięt. | Hands on the floor, feet on a bench or step; body straight from head to heels. |
| wpush.setup | Dłonie wyraźnie szerzej niż barki, palce w przód albo lekko na zewnątrz; ciało proste od głowy do pięt. | Hands clearly wider than your shoulders, fingers forward or slightly turned out; body straight from head to heels. |
| wpush.move | Opuść klatkę w stronę podłogi, łokcie idą na boki; wypchnij się z powrotem do wyprostu rąk. | Lower your chest toward the floor, elbows going out to the sides; push back up until your arms are straight. |
| cpush.setup | Dłonie pod barkami albo trochę węziej; ciało proste od głowy do pięt. | Hands under your shoulders or slightly narrower; body straight from head to heels. |
| cpush.move | Opuść klatkę do podłogi, łokcie blisko tułowia; wypchnij się do wyprostu rąk. | Lower your chest to the floor with elbows close to your body; push up until your arms are straight. |
| pspl.setup | Zacznij w pozycji do pompki, ciężar na dłoniach i palcach stóp. | Start in a push-up position, weight on your hands and toes. |
| pspl.move | Zrób pompkę, a przy wypychaniu przenieś ciężar na jedną rękę, obróć tułów bokiem i unieś drugą rękę do sufitu; wróć i powtórz na drugą stronę. | Do a push-up; as you press up, shift onto one hand, turn your body sideways and reach the other arm to the ceiling; come back and repeat to the other side. |
| spush.setup | Chwyć uchwyty taśm, ręce wyprostowane przed klatką, dłonie na szerokość barków; przejdź stopami tak, żeby ciało było pod skosem i proste. | Hold the strap handles with straight arms in front of your chest, hands shoulder-width apart; walk your feet until your body is at an angle and straight. |
| spush.move | Opuść klatkę w stronę uchwytów, zginając łokcie; wypchnij się z powrotem do wyprostu rąk. | Lower your chest toward the handles by bending your elbows; push back up until your arms are straight. |
| iwip.setup | Pozycja do pompki: dłonie szerzej niż barki, ciało proste, ciężar na dłoniach i palcach stóp. | Push-up position: hands wider than your shoulders, body straight, weight on your hands and toes. |
| iwip.move | Opuść się nisko jak w pompce i — bez wypychania w górę — przesuwaj ciało raz do jednej, raz do drugiej ręki, klatka blisko podłogi. | Lower yourself as in a push-up and, without pressing back up, shift your body toward one hand, then the other, chest close to the floor. |
| push.elbows45 | Łokcie mniej więcej pod kątem 45° do tułowia — nie rozkładaj ich na boki. | Elbows at roughly 45° to your body — don't let them go out to the sides. |
| push.mis.sag | Biodra opadają — ciało przestaje być proste. | Hips sagging — the body stops being straight. |
| push.mis.flare | Łokcie rozjeżdżają się szeroko na boki. | Elbows flaring wide to the sides. |

Uwaga do `push.elbows45`: przedział kąta — po korekcie 2 zgodne źródła szczebla 4 (NASM decline, TRX), żadne przeczytane nie przeczy,
ale w różnych ćwiczeniach (pompka na podwyższeniu, pompka na taśmach) — dla żadnego z nich osobno nie ma dwóch źródeł.
(Men's Health dla wąskich pompek każe trzymać łokcie „practically glued” — inny wariant.)
`spush.setup` — TRX każe iść stopami „toward the anchor point”, Eleiko „back”; obie strony opisują to samo (odejście stopami tak, by ciało się pochyliło),
dlatego zdanie nie podaje kierunku.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| nasm-decline-push-up | https://www.nasm.org/resource-center/exercise-library/decline-push-up | NASM | 4 | 02.11.2026 |
| prehab-decline-push-up | https://theprehabguys.com/vimeo-video/decline-push-up/ | The Prehab Guys (firma z programami płatnymi i aplikacją; strona bez autora i bez podanych kwalifikacji; daty 22.03.2020 / 19.08.2021) | 5 | 02.11.2026 |
| puregym-decline-push-ups | https://www.puregym.com/exercises/chest/press-up/decline-push-ups/ | PureGym (sieć siłowni, bez autora) | 5 | 02.11.2026 |
| puregym-wide-grip-push-ups | https://www.puregym.com/exercises/chest/press-up/wide-grip-push-ups/ | PureGym | 5 | 02.11.2026 |
| healthline-wide-pushups | https://www.healthline.com/health/exercise-fitness/wide-pushups | Healthline (serwis zdrowotny z polityką redakcyjną; autorka E. Cronkleton, recenzja D. Bubnis, M.S., NASM-CPT; 29.07.2019) | 4 | 02.11.2026 |
| wtg-close-grip-push-up | https://weighttraining.guide/exercises/close-grip-push-up | weighttraining.guide (serwis jednego autora, E. Lord; 28.11.2016 / 12.10.2023; bez redakcji ani recenzji eksperckiej) | 5 | 02.11.2026 |
| mh-close-grip-push-up | https://www.yahoo.com/news/fix-close-grip-pushups-one-164000134.html | Men's Health (magazyn z redakcją; E. Samuel, C.S.C.S.; B. Williams, NASM; przedruk z 11.06.2024 — oryginał na menshealth.com.au zwraca „Access Denied”) | 4 | 02.11.2026 |
| prehab-push-up-tall-side-plank | https://theprehabguys.com/vimeo-video/push-up-to-tall-side-plank/ | The Prehab Guys | 5 | 02.11.2026 |
| topend-push-up-rotation | https://www.topendsports.com/fitness/technique/push-up-with-rotation.htm | Topend Sports (serwis komercyjny z treściami afiliacyjnymi; strona bez autora i daty) | 5 | 02.11.2026 |
| trx-push-up | https://www.trxtraining.com/blogs/news/trx-push-up | TRX (producent taśm do treningu w podwieszeniu — własny rodzaj sprzętu; autor „Tristan Z.”, 26.11.2023; tekst instruktażowy z reklamą produktów) | 4 | 02.11.2026 |
| eleiko-65942180 | https://eleiko.inspire360.com/resource/65942180a3414e08d603e3c2 | Eleiko („Push-Ups - Suspension Handles”; bez autora i daty; nie potwierdziłem, że Eleiko produkuje uchwyty do taśm) | 5 | 02.11.2026 |
| wtg-isometric-wiper | https://weighttraining.guide/exercises/isometric-wiper | weighttraining.guide | 5 | 02.11.2026 |
| fitnessvolt-isometric-wiper | https://fitnessvolt.com/isometric-wiper/ | Fitness Volt (autor „Dr. Malik”, MD bez potwierdzenia; 22.04.2019 / 11.08.2024; brak recenzji eksperckiej) | 5 | 02.11.2026 |

Nazwa „TRX” to marka producenta — tylko w rejestrze źródeł, nie w tekstach aplikacji.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Decline Push Up — `dpush.setup`, `push.move`, `push.rigid`, `push.mis.sag` (wycofane z bloku 02.11.2026) | tylko 1 źródło szczebla 4: NASM (`nasm-decline-push-up`: Step 1–2; Step 3–4; Common Mistakes „Allowing hips to sag”). Drugie źródło (The Prehab Guys, sekcje HOW i COMPENSATION) → szczebel 5. |
| Decline Push Up — `plank.brace`, `push.elbows45`, `push.mis.flare` (wycofane z bloku 02.11.2026) | tylko NASM (Step 2 „Engage your core”; Step 3 łokcie ok. 45°; Common Mistakes „Elbows flaring too wide”); PureGym → szczebel 5. |
| Decline Push Up — szerokość dłoni (`push.setup` z zestawu ogólnego) | źródła się różnią: NASM „trochę szerzej niż barki”, Prehab Guys „pod barkami”; `dpush.setup` celowo bez szerokości, `push.setup` usunięte z karty. |
| Decline Push Up — wysokość podparcia stóp / „za wysoko = pompka w staniu na rękach” | liczby (6–12 cali) i progresja tylko w FAQ NASM; drugie źródło spoza dopuszczonych — nie wpisano. |
| Decline Push Up — `push.mis.partial` (zestaw ogólny) | żadne przeczytane źródło wariantu nie podaje skracania ruchu jako błędu; NASM (Step 4) radzi nie blokować łokci na górze, co kłóci się z „bez wyprostu na górze” — usunięte z karty. |
| Zestaw ogólny `push.mis.partial` — uwaga ogólna | ten sam konflikt dotyczy też innych wariantów: NASM (decline), TRX („without locking your elbows”) i ACE #63 („fully extended, but not locked”) mówią o pełnym wyproście bez blokowania łokci; zdanie „bez wyprostu na górze” warto przejrzeć (czy „wyprost” nie jest czytany jako „blokada”). |
| Push-Up Wide — `wpush.setup`, `wpush.move`, `push.rigid`, `plank.brace` (wycofane z bloku 02.11.2026) | tylko 1 źródło szczebla 4: Healthline (How-to, krok 1–5; Form tips). PureGym → szczebel 5. |
| Push-Up Wide — błąd | tylko Healthline wprost (biodra nie opadają / nie unoszą się). Zestaw ogólny miał `push.mis.partial` i `plank.mis.sag` — niepotwierdzone (lędźwie w łuk — brak w źródłach). |
| Close-Grip Push-Up — `cpush.setup`, `cpush.move`, `push.rigid`, `push.mis.flare` (wycofane z bloku 02.11.2026) | tylko 1 źródło szczebla 4: Men's Health (ustawienie dłoni „just narrower than shoulder-width”; opuszczanie bez rozchylania łokci; sztywny tułów). weighttraining.guide → szczebel 5. |
| Close-Grip Push-Up — `plank.brace`, `push.mis.partial` (zestaw ogólny) | `plank.brace`: tylko Men's Health; `push.mis.partial`: brak w obu źródłach → nie wpisane. |
| Close-Grip Push-Up — dłonie stykające się („romb”) jako błąd | tylko Men's Health; weighttraining.guide traktuje romb jako trudniejszy wariant, nie błąd — źródła się różnią. |
| Incline Push-Up Close-Grip | wprost obejmuje go tylko weighttraining.guide (szczebel 5; Tips: dłonie na krawędzi podwyższenia jako łatwiejsza wersja); strony NASM/PureGym dla wariantu — 404, bodybuilding.com przekierowuje do sklepu, strony aplikacji wykluczone. Złożenie kart „Incline Push Up” i „Close-Grip Push-Up” byłoby analogią. Zestaw ogólny niepotwierdzony. |
| Incline Push-Up Reverse Grip | jedyne konkretne źródło (muscleandstrength.com) — 403 (i szczebel otwarty wg rozstrzygnięcia); reszta wyników to aplikacje albo fora. Zestaw ogólny niepotwierdzony. Wyniki wspominają obciążenie nadgarstków — twierdzenie o zdrowiu, poza zakresem wskazówek. |
| Single-Arm Push-Up | dostępne strony to blogi trenerów (szczebel 5) i aplikacje; ustawienie dłoni sporne (pod barkiem / pod środkiem klatki / pod mostkiem), szeroko rozstawione stopy powtarzają się, ale bez 2 źródeł szczebla 4. Zestaw ogólny (`plank.brace`, `push.rigid`, `plank.mis.sag`) niepotwierdzony. |
| Push Up to Side Plank — `pspl.setup`, `pspl.move` (wycofane z bloku 02.11.2026) | oba źródła szczebla 5 (The Prehab Guys: HOW; Topend Sports: Technique, krok 1–5) — brak źródła szczebla 4. |
| Push Up to Side Plank — `splank.noSag`, `push.rigid`, `plank.mis.sag` (zestaw ogólny) | biodra nie opadają — tylko Prehab Guys (COMPENSATION); Topend Sports nie mówi o biodrach; „biodra nie skręcają się w przód ani w tył” — żadne źródło. Nie wpisane. |
| Suspended Push-Up — `spush.setup`, `spush.move`, `push.rigid`, `plank.brace`, `push.elbows45` (wycofane z bloku 02.11.2026) | tylko 1 źródło szczebla 4: TRX (Step 3–6; Step 7–9; Form Cues). Eleiko (strona bez autora i daty, producent uchwytów niepotwierdzony) → szczebel 5. Do ponownej oceny, gdyby potwierdzić, że Eleiko produkuje sprzęt do treningu w podwieszeniu albo szkoli trenerów. |
| Suspended Push-Up — błąd; `push.mis.partial`, `plank.mis.sag` (zestaw ogólny) | Eleiko nie ma sekcji błędów; TRX tylko jako „avoid” w opisie (nadgarstki, kołysanie) — po jednym źródle. Długość/wysokość taśm i „im dalej stopy, tym trudniej” — tylko TRX. |
| Push-Ups With Feet On A Stability Ball | ACE #63 „Stability Ball Push Up” opisuje inny wariant (brzuch/dłonie przy piłce, stopy na podłodze) — nie pasuje. ISSA wspomina pozycję „feet elevated on the stability ball” tylko przy innym ćwiczeniu. elitefts — 404, arkusz uczelni (PDF) nieczytelny, reszta to aplikacje. Zestaw ogólny niepotwierdzony. |
| Clock Push-Up | pod tą nazwą źródła opisują dwa różne ćwiczenia: Physitrack („Push-up on clock face”: po pompce dotykanie podłogi jedną ręką na 12, 3, 6, 9) vs. strony aplikacji (przestawianie obu dłoni w koło między pompkami). Najpierw ustalić definicję ćwiczenia w katalogu (opis bazy źródłowej katalogu), potem szukać źródeł. |
| Isometric Wipers — `iwip.setup`, `iwip.move`, `push.rigid` (wycofane z bloku 02.11.2026) | oba źródła szczebla 5 (weighttraining.guide: Starting position, Execution; Fitness Volt: kroki 1–3). |
| Isometric Wipers — błąd; `plank.brace`, `plank.mis.sag` (zestaw ogólny) | „odbijanie się z boku na bok” — tylko Fitness Volt; `plank.brace` — tylko Fitness Volt (napięty brzuch); `plank.mis.sag` — żadne. |

## Stan

Zakończone w całości (11/11 ćwiczeń przejrzanych). Nic nie zostało w tej części; pułapki: ExRx 403, web.archive.org zablokowane,
bodybuilding.com przekierowuje do sklepu (404), muscleandstrength.com 403, menshealth.com.au „Access Denied” (użyty przedruk).

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (szczebel 4 wymaga naraz: (a) organizacja szkoląca trenerów, serwis z redakcją
i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor i data albo treść jawnie firmowana; (c) nie recenzja afiliacyjna ani marketing).
Autor, data i charakter stron sprawdzone ponownie przez WebFetch 02.11.2026 (bez nowych badań treści).

Źródła:
- prehab-decline-push-up, prehab-push-up-tall-side-plank (The Prehab Guys): 4 → 5 — (a) niespełnione: firma z płatnymi programami i aplikacją, strona bez autora i bez podanych kwalifikacji, brak opisu recenzji.
- puregym-decline-push-ups, puregym-wide-grip-push-ups: 4 → 5 — wprost w rozstrzygnięciu (sieci siłowni).
- healthline-wide-pushups: 4 → 4 (bez zmiany) — serwis z polityką redakcyjną i recenzją eksperta (NASM-CPT), autor i data.
- wtg-close-grip-push-up, wtg-isometric-wiper (weighttraining.guide): 4 → 5 — (a) niespełnione: serwis jednego autora, bez redakcji i recenzji eksperckiej.
- mh-close-grip-push-up (Men's Health, przedruk): 4 → 4 (bez zmiany) — magazyn z redakcją, autor C.S.C.S., data; przedruk w serwisie partnerskim.
- topend-push-up-rotation (Topend Sports): 4 → 5 — brak autora i daty na stronie, serwis z treściami afiliacyjnymi.
- trx-push-up (TRX): 4 → 4 (bez zmiany) — producent własnego rodzaju sprzętu (taśmy), autor i data; obok tekstu reklama produktów, ale treść instruktażowa.
- eleiko-65942180 (Eleiko): 4 → 5 — brak autora i daty; nie potwierdziłem, że uchwyty do taśm to sprzęt Eleiko (producent liczy się tylko dla własnego sprzętu).
- fitnessvolt-isometric-wiper (Fitness Volt): 4 → 5 — brak recenzji eksperckiej, kwalifikacje autora niepotwierdzone.
- nasm-decline-push-up: 4 → 4 (bez zmiany).

Ćwiczenia:
- Decline Push Up: gotowe → otwarte.
- Push-Up Wide: częściowe → otwarte.
- Close-Grip Push-Up: gotowe → otwarte.
- Push Up to Side Plank: częściowe → otwarte.
- Suspended Push-Up: częściowe → otwarte.
- Isometric Wipers: częściowe → otwarte.
- Pozostałe (Incline Push-Up Close-Grip, Incline Push-Up Reverse Grip, Single-Arm Push-Up, Push-Ups With Feet On A Stability Ball, Clock Push-Up): otwarte → otwarte.
- Blok JSON: 6 wpisów → 0; wszystkie wycofane zdania przeniesione do „Otwarte” z jedynym pozostałym źródłem szczebla 4 i miejscem.
