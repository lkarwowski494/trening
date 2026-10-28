# E — Dwa podręczniki organizacji szkolącej trenerów: co wnoszą do katalogu ćwiczeń i kart (28.10.2026)

Autor: badacz merytoryczny (agent), tylko odczyt. Podstawa: aplikacja 1.1 w `/home/user/wt/int` (gałąź integracja-1-1), teksty
książek dostarczone przez właściciela (pliki tekstowe w katalogu uploads sesji, **nie** w repo). Strony podaję według numerów
drukowanych widocznych w tekście (spis treści i nagłówki stron); tekst powstał z konwersji, więc możliwe przesunięcie o ±1 stronę
przy podpisach zdjęć. Cytaty: najwyżej 1 zdanie na miejsce. Nazwy organizacji tylko w tym pliku roboczym (poza repo i aplikacją).

- **[ESS]** Haff G.G., Triplett N.T. (red.), *Essentials of Strength Training and Conditioning*, wyd. 4, Human Kinetics / NSCA, ©2016, ISBN 978-1-4925-0162-6.
- **[ST]** Brown L.E. (red.), *Strength Training*, Human Kinetics / NSCA, ©2007, ISBN 978-0-7360-6059-2.

Nie sprawdziłem (brak Bash, więc bez `git show`): notatek koordynatora na gałęzi przekazanie-konta i stanu `origin/main` (1.0) —
widoczność w 1.0 oceniam z dat w docs (wskazówki etapu 1 z 08.10.2026 = przed 1.0) i oznaczam [DO USTALENIA], gdzie to ważne.

---

## Streszczenie (14 punktów)

1. **Szczebel:** [ESS] to **szczebel 3** (książka uznanych autorów, redagowana, z przypisami), **nie** stanowisko organizacji (szczebel 2).
   Wyjątek: tam, gdzie dokument szczebla 2 tej organizacji (Standardy 2017, Standard 3.2) powołuje się na rozdział 15 jako na swoją
   podstawę, regułę daje Standard, a rozdział — szczegóły wykonania (szczebel 3). [ST] to poradnik dla ćwiczących z 2007 r. —
   proponuję **szczebel 4** (jak biblioteki ćwiczeń organizacji szkolących).
2. **Niezależność:** [ESS] i [ST] to **jedna organizacja i jeden wydawca** — razem liczą się jako *jedno* źródło. Nie są też niezależne
   od źródeł tej organizacji, które już mamy w `data/zrodla/cues.json` (podręcznik podstaw z 2012 i artykuł z jej biuletynu dla trenerów).
3. **Wydanie 5** [ESS] już istnieje (©2027, 864 s., technika w rozdz. 16) — mamy wydanie o jedno starsze. To jednak dokładnie ten tekst
   (wyd. 4, s. 350–408), na który powołuje się Standard 3.2 (przypis 7, docs/research/przeglad-badacza-2026-10-23.md:14).
4. **Pokrycie:** 101 z 709 ćwiczeń katalogu (14%) ma w książkach opis tego samego ćwiczenia albo wariantu; jeszcze ok. 24 (3%) — opis
   ćwiczenia podobnego (do potwierdzenia). Z 102 ćwiczeń z własnymi wskazówkami: **48**. Z 538 z „zestawem ogólnym” (wskazówki ogólne dla ruchu, z dopiskiem): **50**.
   Z 69 bez wskazówek: **3** (Tire Flip, Medicine Ball Chest Pass, Spider Crawl) + Log Lift (opis zbliżony).
5. **Zgodność:** dla 15 porównanych ćwiczeń większość naszych wskazówek jest **zgodna** z [ESS] (przysiad, prasa, wypady, plank,
   wznosy bokiem, uginania, pulldown, wiosłowania). Książki zwykle dodają szczegóły ustawienia, chwytu i końca ruchu.
6. **Różnica do rozstrzygnięcia przez audyt (ŚREDNIE):** start skull crushera — u nas „gryf nad czołem”, [ESS] s. 398: nad klatką,
   ramiona pionowo; [ST] s. 200: nad barkami. Biblioteka organizacji szkolącej (szczebel 4) podaje „nad twarzą”. Przy sprzeczności wygrywa wyższy szczebel → do poprawy albo do części wspólnej.
7. **Różnice drobne (NISKIE):** zakres ruchu przy prostowaniu ramion na wyciągu (s. 399: start z przedramionami poziomo, u nas prawie pełne zgięcie);
   położenie sztangi w martwym ciągu (s. 389: „nad przodostopiem, ok. 3 cm od goleni”, u nas „nad środkiem stopy”); głębokość przysiadu („co najmniej do równoległego” u nas vs „do równoległego” w obu książkach).
8. **Stary poradnik przeczy nam w jednym miejscu:** [ST] s. 213, 215, 217 — „kolana nie wychodzą przed palce”. Nasza wskazówka
   `sq.kneesPast` ma badanie (szczebel 3) i serwis specjalistyczny; nowsze [ESS] tej granicy nie powtarza (s. 381: „kolana w linii stóp”). Bez zmiany w aplikacji, z notatką w rejestrze.
9. **Zamyka otwarte pytanie:** asekuracja ćwiczeń dynamicznych (podrzuty, zarzuty, rwania, push press; 25 ze sztangą + 4 z hantlem) —
   [ESS] s. 354–356: tych ćwiczeń **się nie asekuruje**; trzeba umieć bezpiecznie porzucić sztangę i oczyścić miejsce. To kłóci się z dosłownym brzmieniem Standardu 3.2 — opcje w § 6.
10. **Zamiana analogii na opisy własne:** około 50 ćwiczeń z „zestawem ogólnym” ma w książkach własny opis (np. Pec Deck, Chest Dip, Upright Row,
    Stiff-Legged Deadlift, Hip Abduction/Adduction, zarzuty i rwania, wyskoki, rozciąganie). Do statusu „ustalone” potrzeba jeszcze **jednego niezależnego** źródła szczebla 4 (np. biblioteka ćwiczeń innej organizacji).
11. **Uzupełnienie kart niepełnych:** Leg Curl, Leg Extension, Seated Calf Raise (brak „ustawienia”) i Back Extension (podstawa tylko z badań) —
    książki dają brakujące ustawienie maszyny (oś kolana, wałek, podparcie).
12. **Dla recenzji animacji (bramka 4):** [ESS] podaje konkretne pozycje końcowe (RDL do więzadła rzepki i tułów ~poziomo, prasa do ud równoległych
    do platformy, wypad z tylnym kolanem 3–5 cm nad podłogą, push press z ugięciem ≤ ćwierć przysiadu, kettlebell do wysokości oczu itd.) — dobra lista kontrolna kadrów.
13. **Inne użyteczne:** klasyfikacja ćwiczeń (podstawowe/pomocnicze, strukturalne, dynamiczne — s. 444), zasady oddechu i pasa (s. 353–354), rozgrzewka
    i rozciąganie (s. 318–329, 341), bezpieczeństwo plyometrii (s. 481–482), nazewnictwo chwytów (s. 352 — brakuje go w słowniku terminów), a obok katalogu: weryfikacja
    tabeli celów treningowych (tab. 17.9, s. 458) i odstępów między sesjami (s. 447), które w docs są wzięte ze streszczeń.
14. **Rekomendacja:** teraz wariant **E** (zamknięcie pytań otwartych i 4 różnic, ok. 2 h pracy agenta), po wydaniu wariant **B** (analogie,
    karty niepełne i bez wskazówek pokryte przez książki, ok. 5–6 h pracy agenta, równolegle na 2 agentów). Do trwającego audytu dołączyć mapę z § 2 jako listę kontrolną (bez osobnego przejścia
    wszystkich kart). Książki na Dysku w osobnym, prywatnym folderze źródeł (nie „05 Research konkurencji”).

---

## 1. Szczebel źródeł (zadanie 1)

| | [ESS] wyd. 4 (2016) | [ST] (2007) |
|---|---|---|
| Co to jest | podręcznik akademicki, wieloautorski, redaktorzy z doktoratem, każdy rozdział z przypisami; podstawa egzaminu certyfikacyjnego tej organizacji | poradnik dla ćwiczących („Part III … pictures and instructions”), rozdziały ćwiczeń bez przypisów; bibliografia zbiorcza na s. 343 |
| Czy to stanowisko organizacji (szczebel 2)? | **Nie.** Stanowiska tej organizacji to osobne, recenzowane dokumenty w czasopismach (np. stanowisko o ćwiczeniach olimpijskich 2023, `docs/research/25-biblioteka/L4-zrodla.md:40`). Sam rozdział mówi o sobie skromniej: s. 352 — „the techniques presented are simply guidelines that represent the most commonly accepted method of performing the exercises.” | **Nie.** Przedmowa (s. vii) mówi tylko, że treść jest „wspierana” przez organizację. |
| Proponowany szczebel | **3** (książka uznanych autorów) | **4** dla szczegółów techniki (jak biblioteka ćwiczeń organizacji szkolącej); tam, gdzie przeczy [ESS], wygrywa [ESS] (nowszy, wyższy szczebel) |
| Wiek | 10 lat; jest wyd. 5 (©2027). To jednak wydanie cytowane przez Standardy 2017. | 19 lat; część wskazówek przestarzała (kolana a palce, s. 213–218; „nigdy nie wstrzymuj oddechu”, s. 162) |

**Wyjątek szczebla 2.** Standard 3.2 (szczebel 2, przeczytany 23.10.2026) wymaga asekuracji przy wolnych ciężarach na tułowiu lub nad
głową/twarzą i jako źródło podaje rozdział 15 [ESS]. Reguła „kiedy asekurować” jest więc ustalona przez Standard; rozdział daje
procedurę (gdzie stoi asekurujący, jakim chwytem — s. 354–357 i listy przy ćwiczeniach). Szczegóły procedury pozostają szczeblem 3.

**Skutek dla reguły „kilka niezależnych źródeł”:** wskazówka techniki z [ESS] + jedno źródło szczebla 4 *innej* organizacji = 2 niezależne źródła
(jedno wyższego szczebla) → „ustalone” wg wyjątku z 25.10.2026. [ESS] + [ST] + podręcznik podstaw tej samej organizacji (`nsca-basics-2012`)
= **jedno** źródło („jedno źródło”). Uwaga: przy wyciskaniu leżąc już dziś jedno z dwóch źródeł to podręcznik podstaw tej organizacji
(`data/zrodla/cues.json:6699`, `:6786`) — dodanie [ESS] nie zwiększa tam niezależności.

---

## 2. Mapa pokrycia (zadanie 2)

Polecenia: lista katalogu — `Grep '^  "name": '` w `docs/research/equipment/catalog.json` (709 wpisów); status kart —
`Grep '"b":"own"|"b":"general"|"b":"open"'` w `lib/figures/v2/cue-sets.json` (102 / 538 / 69). Dopasowanie ręczne po opisie ruchu.
✓ = to samo ćwiczenie albo wariant (inny sprzęt, jednorącz, siedząc), ~ = podobne, do potwierdzenia w audycie.

### 2.1 [ESS] rozdz. 15 — technika z wolnymi ciężarami i na maszynach (s. 358–407)

| [ESS] | Katalog (status karty) | |
|---|---|---|
| 15.1 Bent-Knee Sit-Up, s. 359 | Sit Up (ogólny) | ✓ |
| 15.2 Abdominal Crunch (pięty na ławce), s. 360 | Crunch (własny) — nasz na podłodze; [ST] s. 232 to wersja na podłodze | ✓ (przez [ST]) |
| 15.3 Abdominal Crunch (Machine), s. 361 | Machine Crunch (ogólny) | ✓ |
| 15.4 Bent-Over Row, s. 362 | Bent Over Row (sztanga) (własny) | ✓ |
| 15.5 One-Arm Dumbbell Row, s. 363 | One Arm Row (hantle) (własny; u nas kolano na ławce jak [ST] s. 193) | ✓ |
| 15.6 Lat Pulldown, s. 364 | Lat Pulldown (własny) | ✓ |
| 15.7 Seated Row (Machine), s. 365 | Machine Row (ogólny) | ✓ |
| 15.8 Low-Pulley Seated Row, s. 366 | Seated Cable Row, Wiosłowanie na linkach (siedząc) (własne) | ✓ ×2 |
| 15.9 Barbell Biceps Curl, s. 367 | Barbell Curl (własny) | ✓ |
| 15.10 Hammer Curl, s. 368 | Hammer Curl (własny) | ✓ |
| 15.11 Standing Calf Raise (Machine), s. 369 | Standing Calf Raise (własny) | ✓ |
| 15.12 Seated Calf Raise (Machine), s. 370 | Seated Calf Raise (własny, niepełny) | ✓ |
| 15.13 Flat Barbell Bench Press (+ hantle), s. 371–372 | Bench Press (sztanga), Bench Press (hantle) (własne) | ✓ ×2 |
| 15.14 Incline Dumbbell Bench Press (+ sztanga), s. 373 | Incline Bench Press (hantle), (sztanga) (własne) | ✓ ×2 |
| 15.15 Flat Dumbbell Fly (+ skos), s. 374 | Chest Fly (hantle) (własny), Incline Chest Fly (hantle) (ogólny) | ✓ ×2 |
| 15.16 Vertical Chest Press, s. 375 | Machine Chest Press (własny) | ✓ |
| 15.17 Pec Deck, s. 376 | Pec Deck (ogólny) | ✓ |
| 15.18 Wrist Curl, 15.19 Wrist Extension, s. 377–378 | Barbell Wrist Curl, Barbell Reverse Wrist Curl (ogólne) | ✓ ×2 |
| 15.20 Hip Sled, s. 379 | Leg Press (własny) | ✓ |
| 15.21 Back Squat, s. 380–381 | Back Squat (własny) | ✓ |
| 15.22 Front Squat, s. 382–383 | Front Squat (własny) | ✓ |
| 15.23 Forward Step Lunge (+ hantle), s. 384–385 | Lunges (sztanga) (ogólny), Lunges (hantle) (własny) | ✓ ×2 |
| 15.24 Step-Up, s. 386–387 | Barbell Step Up (ogólny) | ✓ |
| 15.25 Good Morning, s. 388 | Good Morning (własny) | ✓ |
| 15.26 Deadlift, s. 389 | Deadlift (sztanga) (własny) | ✓ |
| 15.27 Stiff-Leg Deadlift, s. 390 | Stiff-Legged Barbell Deadlift (ogólny, rodzina RDL) | ✓ |
| 15.28 Romanian Deadlift, s. 391 | RDL (sztanga) (własny) | ✓ |
| 15.29 Leg Extension, s. 392 | Leg Extension (własny, niepełny) | ✓ |
| 15.30 Seated Leg Curl, s. 393 | Leg Curl (własny, niepełny; w katalogu „presumably the seated machine”, catalog.json:2705) | ✓ |
| 15.31 Shoulder Press (Machine), s. 394 | Machine Shoulder Press (własny) | ✓ |
| 15.32 Seated Barbell Shoulder Press (+ hantle), s. 395–396 | Seated Barbell Military Press (ogólny), Seated Shoulder Press (hantle) (własny) | ✓ ×2 |
| 15.33 Upright Row, s. 396 | Upright Row (sztanga) (ogólny) | ✓ |
| 15.34 Lateral Shoulder Raise, s. 397 | Lateral Raise (hantle) (własny) | ✓ |
| 15.35 Lying Barbell Triceps Extension, s. 398 | Skullcrusher (sztanga) (ogólny); Skullcrusher (EZ) przez [ST] | ✓ |
| 15.36 Triceps Pushdown, s. 399 | Triceps Pushdown (własny) | ✓ |
| 15.37 Push Press, s. 400–401 | Push Press (własny) | ✓ |
| 15.38 Push Jerk, s. 402–403 | Power Jerk (ogólny) — nazwy bywają używane zamiennie | ~ |
| 15.39 Power Clean (+ z zawieszenia), s. 404–405 | Power Clean (ogólny); Hang Clean przez [ST] s. 262 | ✓ |
| 15.40 Power Snatch (+ z zawieszenia), s. 406–407 | Power Snatch (ogólny); Hang Snatch | ✓ / ~ |

### 2.2 [ESS] rozdz. 16 — inne formy (s. 422–437)

16.1 Front Plank s. 423 → Plank (własny) ✓ · 16.2 Side Plank s. 424 → Side Plank (własny) ✓ · 16.3 Stability Ball Rollout s. 425 → brak
(Ab Wheel to inny sprzęt) · 16.4 Stability Ball Pike s. 426 → brak · 16.5 Stability Ball Jackknife s. 427 → Stability Ball Knee Tuck (ogólny) ✓ ·
16.6 Tire Flip s. 428–429 → Tire Flip (**bez wskazówek**) ✓ · 16.7 Log Clean and Press s. 430–431 → Log Lift (**bez wskazówek**) ~ ·
16.8 Back Squat With Bands s. 432 → Squat with Bands (ogólny) ✓ · 16.9 Two-Arm Kettlebell Swing s. 433 → Kettlebell Swing (własny) ✓ ·
**16.10 „Single-Leg Squat” s. 434 = przysiad bułgarski** (tylna stopa na ławce na wysokości kolana) → Bulgarian Split Squat (hantle) (własny) i (sztanga) (ogólny) ✓ ×2 ·
16.11 Single-Leg RDL s. 435 → Single Leg RDL (hantel) (ogólny) ✓ · 16.12 One-Arm Dumbbell Snatch s. 436–437 → Snatch (hantel) (ogólny) ✓.

### 2.3 [ESS] rozdz. 14 — rozciąganie statyczne i dynamiczne (s. 330–349)

✓: 14.5 Behind-Neck Stretch → Overhead Triceps Stretch · 14.6 Cross Arm in Front of Chest → Cross-Body Shoulder Stretch · 14.11 Supine Knee Flex → One Knee To Chest ·
14.14 Side Quadriceps Stretch → Side-Lying Quad Stretch · 14.15 Sitting Toe Touch → Seated Floor Hamstring Stretch · 14.17 Straddle → The Straddle ·
14.18 Butterfly → Butterfly Stretch · 14.19 Wall Stretch → Wall Calf Stretch · 14.22 Inchworm → Inchworm · 14.23 Lunge Walk → Walking Lunges (wariant bez ciężaru) ·
14.31 Spiderman Crawl → Spider Crawl (**bez wskazówek**; opis w katalogu, catalog.json:25388, zgadza się z s. 349; badanie partii ma tu „jedno źródło”, catalog.json:25391). Wszystkie poza dwoma ostatnimi mają zestaw ogólny.
~: 14.2 → Chin To Chest Stretch (tylko zgięcie) · 14.3 → Chest And Front Of Shoulder Stretch · 14.7 → Overhead Stretch · 14.8 → Seated Rotation Stretch ·
14.10 → Kneeling Hip Flexor Stretch (w książce na stojąco) · 14.12/14.13 → Standing Lateral Stretch · 14.20 → Standing Gastrocnemius Calf Stretch · 14.26 → World's Greatest Stretch (bez skrętu).
Brak w katalogu: 14.1, 14.4, 14.9, 14.16, 14.21, 14.24, 14.25, 14.27–14.30.

### 2.4 [ESS] rozdz. 18 — plyometria (s. 484–519) i rozdz. 19 — szybkość (s. 548–556)

✓: 18.3 Squat Jump → Jump Squat · 18.5 Double-Leg Tuck Jump → Tuck Jump · 18.6 Split Squat Jump → Split Jump · 18.13 Standing Long Jump → Broad Jump ·
18.26 → Single Leg Push-Off · 18.27 → Alternate Leg Push-Off · 18.30 Double-Leg Jump to Box → Box Jump (własny) · 18.33 → Lateral Box Jump · 18.35 → Depth Jump ·
18.42 Chest Pass → Medicine Ball Chest Pass (**bez wskazówek**) · 18.43 Two-Hand Overhead Throw → Standing Two-Arm Overhead Throw.
~: 18.17/18.18 → Front/Lateral Cone Hops · 18.29 → Side to Side Box Shuffle · 18.46 Power Drop → Supine Chest Throw · 18.47 Depth Push-Up → Drop Push.
Rozdz. 19 (A-Skip, Fast Feet, …) — brak odpowiedników w katalogu.

### 2.5 [ST] rozdz. 9–12 — ćwiczenia spoza [ESS] (s. 165–273)

✓ (25): Barbell Shrug s. 165 → Shrugs (sztanga) · Standing Military Press s. 166–167 → Overhead Press (sztanga) · Dumbbell Upright Row s. 171 → Upright Row (hantle) ·
Dumbbell Front Raise s. 174 → Front Raise · Dumbbell Rear Raise s. 175 → Reverse Fly (hantle) · Machine Lateral Raise s. 173 · Pull-Up s. 188–189 → Pull Up ·
Dip s. 196 → Chest Dip · Close-Grip Bench Press s. 198–199 · Lying Triceps Extension (gryf EZ) s. 200–201 → Skullcrusher (EZ) · Machine Triceps Extension s. 203 ·
Dumbbell Biceps Curl s. 204 → Biceps Curl (hantle) · EZ Bar Curl s. 205 · Machine Biceps Curl s. 207 · Dumbbell Reverse Lunge s. 218 → Reverse Lunge ·
Dumbbell Side Lunge s. 219 → Lateral Lunge · Dumbbell Step-Up s. 220 → Step Up · Seated Hip Adduction/Abduction s. 225–226 → Hip Adduction, Hip Abduction ·
Standing Calf Raise na jednej nodze s. 227 → Single Leg Calf Raise · Abdominal Crunch s. 232 → Crunch · Stability Ball Crunch s. 236 · Stability Ball Push-Up s. 239 → Push-Ups With Feet On A Stability Ball ·
Back Extension and Hyperextension s. 250 → Back Extension · Hang Clean s. 262–265.
~: Assisted Chin-Up s. 190 → Chin Up · Assisted Dip s. 197 → Dip Machine · Dumbbell Side Raise „można na linkach” s. 172 → Cable Lateral Raise · High Pull s. 257 → Clean Pull ·
siedzące wspięcia z talerzem s. 227 → Seated Calf Raise (hantle) · Seated Machine Row—Rear Deltoids s. 195 → Reverse Pec Deck · „przysiad z hantlami” s. 215 → Dumbbell Squat · Ankle Touch s. 234 → Alternate Heel Touchers.

### 2.6 Liczby

| Grupa (cue-sets.json) | Liczba w katalogu | Opis w książkach ✓ | ~ |
|---|---|---|---|
| własne wskazówki („own”) | 102 | **48** | 2 (Chin Up, Cable Lateral Raise) |
| zestaw ogólny („general”) | 538 | **50** | ok. 21 |
| bez wskazówek („open”) | 69 | **3** | 1 (Log Lift) |
| **razem** | **709** | **101 (14%)** | **ok. 24 (3%)** |

Podział ✓ według źródła: [ESS] 76 (rozdz. 15: 44, rozdz. 16: 10, rozdz. 14: 11, rozdz. 18: 11), tylko [ST] 25. Ćwiczenia z [ST] objęte też przez [ESS] liczone raz.
Z 22 ćwiczeń „bez wskazówek” etapu 1 (`lib/cues/data.json`, pole `open`) książki opisują: Pec Deck, Chest Dip, Upright Row (hantle), Hip Abduction, Hip Adduction (dziś mają zestaw ogólny).

---

## 3. Co książki dają ponad obecne źródła — 15 ćwiczeń (zadanie 3)

Nasze teksty: `lib/cues/text/pl.json`, źródła: `data/zrodla/cues.json`. „Zgodne” = ta sama treść w [ESS] lub [ST]; „brakuje” = treść z książek,
której nie mamy (do dodania potrzebne drugie, niezależne źródło).

| # | Ćwiczenie | Zgodne | Różnica / sprzeczność | Brakuje u nas (miejsce w książce) |
|---|---|---|---|---|
| 1 | Back Squat | `sq.bar`, `sq.stance`, `sq.kneesToes`, `sq.back`, `sq.mis.heels` — [ESS] s. 380–381; warunki końca ruchu z `sq.depth` (proste plecy, pięty na podłodze) | `sq.depth` „zwykle co najmniej do równoległego ud”; obie książki: *do* równoległego (s. 381; [ST] s. 213, 215). [ESS] s. 381: „Continue flexing the hips and knees until the tops of the thighs are parallel to the floor, the trunk begins to round or flex forward, or the heels rise off the floor.” Część wspólna: „mniej więcej do ud równoległych, dopóki plecy proste i pięty na podłodze”. `sq.kneesPast` vs [ST] — § 5, F2 | sztanga wysoko lub nisko na plecach (s. 380), stały kąt tułowia przy wstawaniu, łokcie wysoko (s. 381), procedura dwóch asekurujących (s. 380–381) |
| 2 | Bench Press (sztanga) | `bp.contact` (pięć punktów podparcia, s. 353, s. 371; [ST] s. 176), `bp.grip` (s. 371), `bp.mis.arch` (s. 371), `bp.control` ([ST] s. 177) | `bp.blades` — w żadnej z książek, ale też nie przeczą | miejsce dotknięcia (s. 371: na wysokości sutków; [ST]: dolna część klatki), oczy pod sztangą na stojakach, przedramiona pionowo (s. 371); kąt ramienia ok. 45° od tułowia ([ST] s. 177) → razem z serwisem specjalistycznym (45–60°) daje część wspólną „ok. 45°” do `bp.elbowsMid` |
| 3 | Deadlift (sztanga) | `dl.grip`, `dl.hipsLow`, `dl.close`, `mis.roundBack` — s. 389 | `dl.feet` „nad środkiem stopy”; s. 389: sztanga ok. 3 cm od goleni, nad przodostopiem. Część wspólna: „tuż przy goleniach”. [ST] s. 222 opisuje ruch inaczej (tułów 45°, najpierw nogi do kolan) — uproszczony poradnik, nie bierzemy | „biodra nie wyprzedzają barków” (s. 389; [ST] s. 222) — dobry kandydat na błąd częsty |
| 4 | RDL (sztanga) | `rdl.move`, `rdl.knees` (s. 391; [ST] s. 221), `rdl.depth` zgodny z [ST] s. 221 („lekkie rozciągnięcie tyłu ud”) | [ESS] s. 391 podaje dalszy koniec: sztanga przy więzadle rzepki, tułów ~poziomo — inny opis końca, nie sprzeczność | sztanga przy udach przez cały ruch, chwyt jak do zarzutu lub rwania (s. 391) |
| 5 | Lat Pulldown | `lpd.thighs`, `lpd.pull`, `lpd.toChest` (s. 364; [ST] s. 191) | — | lekkie odchylenie tułowia bez szarpania (s. 364; [ST] s. 191), chwyt szerzej niż barki |
| 6 | Bent Over Row (sztanga) | `row.hinge`, `row.bbGrip` (s. 362; [ST] s. 192) | `row.bbPull` „do brzucha”; s. 362: dolna część klatki albo górna brzucha; [ST]: środek tułowia — część wspólna „do dolnej części klatki / brzucha” | kąt tułowia (s. 362: tuż nad poziomem; [ST]: prawie poziomo), bez szarpania tułowiem (s. 362), bez pomocy nóg ([ST] s. 192) |
| 7 | One Arm Row (hantle) | `row1.bench` = [ST] s. 193, `row1.pull`, `row1.noTwist` ([ST] s. 193) | [ESS] s. 363 to inny wariant (obie stopy na podłodze, ręka na ławce) | łokieć blisko ciała, hantel do boku tułowia (s. 363) |
| 8 | Lateral Raise (hantle) | `lat.setup`, `lat.elbows` („łokcie i ramiona unoszą się przed przedramionami”, s. 397), `lat.height` (s. 397; [ST] s. 172) | — | bez szarpania i bujania (s. 397), bez ruchu w biodrach ([ST] s. 172) |
| 9 | Skullcrusher (EZ / sztanga) | `skull.depth`, `skull.upperArm` (s. 398; [ST] s. 200–201) | **`skull.setup` „gryf nad czołem”** vs [ESS] s. 398: „Position the bar over the chest with the elbows fully extended and the arms parallel.”; [ST] s. 200: nad barkami. Biblioteka ćwiczeń organizacji szkolącej (#36, przeczytana dziś): „directly above your face”. → F1 | szerokość chwytu ok. 30 cm, łokcie w stronę kolan (s. 398); asekuracja chwytem podchwytem (s. 355, s. 398) |
| 10 | Triceps Pushdown | `tpd.setup`, `tpd.elbows`, `press.noLock` (s. 399; [ST] s. 202) | `tpd.move` „wróć, aż przedramiona zbliżą się do ramion”: [ST] s. 202 zgodny (pełne zgięcie), [ESS] s. 399: start z przedramionami poziomo lub trochę wyżej → F3 | chwyt 15–30 cm, stań tak, by linka wisiała pionowo (s. 399) |
| 11 | Leg Press | `lp.setup` (kolana ~90°, [ST] s. 216), `lp.noLock`, `lp.heels`, `lp.hips`, `sq.kneesToes` — wszystkie w s. 379 | — | koniec ruchu: uda równoległe do platformy (s. 379); stopy na szerokość bioder, palce lekko na zewnątrz |
| 12 | Kettlebell Swing | `kb.move`, `kb.hips`, `hinge.back` (s. 433) | `kb.setup` „stopy na szerokość barków lub szerzej”; s. 433: między szerokością bioder a barków — część wspólna „ok. szerokości barków” | kettlebell do wysokości oczu siłą rozpędu, łokcie proste (s. 433) |
| 13 | Bulgarian Split Squat (hantle) | `bss.setup` (s. 434) | koniec ruchu: u nas „tylne kolano tuż nad podłogą”, s. 434: przednie udo ~poziomo — inny opis, nie sprzeczność | ławka na wysokości kolana (s. 434); z hantlami bez asekurującego, ze sztangą dwóch (s. 434) — potwierdza obecny podział ramki „Asekuracja” |
| 14 | Plank / Side Plank | `plank.setup`, `plank.noSag`, `splank.setup`, `splank.noSag` (s. 423–424; [ST] s. 245–246) | `splank.setup` „stopy jedna na drugiej” — s. 424 dopuszcza też górną stopę przed dolną | — |
| 15 | Standing / Seated Calf Raise | `calf.edge`, `calf.knees` (s. 369: kolana proste, bez blokowania), `calf.move` (s. 369–370) | — | stopy nie skręcają się do środka ani na zewnątrz (s. 369–370), bez odbijania na dole ([ST] s. 227); **ustawienie wspięć siedząc** (wałek na dole ud, s. 370) — dziś brak sekcji „ustawienie” |

**Czy książki podnoszą „jedno źródło” do „ustalone” albo zastępują analogie?**
- Wskazówki techniki: wszystkie nasze własne wskazówki mają już ≥ 2 źródła (zasada etapu 1, `lib/cues/index.ts:7`), więc książki je
  **wzmacniają** (trzecie źródło, wyższy szczebel), a nie podnoszą. Realna zmiana statusu jest w trzech miejscach:
  1. **zestawy ogólne → własne wskazówki** (np. Pec Deck: dziś `fly.control` + `mcp.blades`, czyli przeniesione z rozpiętek i prasy; s. 376 daje własny opis maszyny;
     Chest Dip: dziś `bdip.move` z dipów na ławce; [ST] s. 196 opisuje dipy na poręczach — ramię do poziomu, lekkie pochylenie, ok. 45° od tułowia;
     Stiff-Legged Deadlift: dziś głębokość z RDL; s. 390 — do dotknięcia talerzami podłogi albo utraty neutralnych pleców);
  2. **karty niepełne** (Leg Curl s. 393 + [ST] s. 223; Leg Extension s. 392 + [ST] s. 224; Seated Calf Raise s. 370; Back Extension [ST] s. 250);
  3. **ćwiczenia bez wskazówek**: Tire Flip (s. 428), Log Lift (s. 430, jako log clean and press), Medicine Ball Chest Pass (s. 514; [ST] s. 124–126), Spider Crawl (s. 349).
  We wszystkich trzech potrzebne jest **drugie niezależne źródło szczebla 4** — książki tej samej organizacji liczą się razem jako jedno.
- Przypisanie partii („jedno źródło” w `research.confidence`: 206 ćwiczeń, `Grep '"confidence": "jedno źródło"'` w catalog.json):
  rubryka „Major Muscles Involved” w [ESS] może być drugim źródłem **głównych** mięśni (bez wag 1/0,5/0,25). Ile z 206 jest w mapie z § 2 — [DO USTALENIA] (wymaga skryptu).
  Uwaga na błędy książki: s. 376 wymienia triceps jako główny mięsień przy Pec Deck (ruch jednostawowy w barku) — listy brać krytycznie, nie hurtem.

---

## 4. Inne treści użyteczne dla kart i strony (zadanie 4) — jako źródło reguł, nie tekstów

| Temat | Miejsce | Co daje | Waga w naszej hierarchii |
|---|---|---|---|
| Ćwiczenia podstawowe/pomocnicze, strukturalne, dynamiczne | [ESS] s. 444 | definicje: podstawowe = duże partie, ≥ 2 główne stawy; pomocnicze = jeden staw; bark i kręgosłup liczone jako jeden staw; strukturalne = obciążają kręgosłup; dynamiczne = strukturalne wykonywane szybko | szczebel 3, jedno źródło → kandydat na regułę `pattern`/kolejności w generatorze tylko z drugim źródłem (np. stanowisko ACSM 2009 o kolejności ćwiczeń — [DO USTALENIA], nie sprawdzałem) |
| Kolejność w sesji | [ESS] s. 448–449 | dynamiczne → podstawowe → pomocnicze | jak wyżej |
| Oddech | [ESS] s. 353–354; [ST] s. 162 | wydech przy najtrudniejszym fragmencie ruchu, wdech w fazie łatwiejszej; wstrzymanie oddechu tylko u zaawansowanych w ćwiczeniach strukturalnych, krótko: s. 353 — „This is why the breath-holding phase is—and should be—quite transient, only about 1 to 2 seconds (at most).” [ST] s. 162: „The most important thing to remember is that you should never hold your breath while performing resistance training exercises.” | sprzeczność w obrębie jednej organizacji (2007 vs 2016). Część wspólna: „wydech przy wysiłku, wdech przy opuszczaniu, bez długiego wstrzymywania oddechu”. Nasze `st.breathe`, `plank.mis.breath`, `wall.breath` dotyczą rozciągania i ćwiczeń izometrycznych — zgodne z obiema. Zasady wstrzymywania oddechu (ciśnienie) **nie** do aplikacji (zdrowie → specjalista) |
| Pas | [ESS] s. 354; [ST] s. 155 | pas przy ćwiczeniach obciążających dolny odcinek pleców i ciężarach bliskich maksymalnym; nie przy lekkich i nie przy ćwiczeniach bez obciążenia pleców | jedna organizacja → „jedno źródło”; aplikacja dziś o pasie nie mówi — bez potrzeby |
| Asekuracja — procedura | [ESS] s. 354–357 i listy przy ćwiczeniach | ilu asekurujących, chwyt (mieszany przy podawaniu, podchwyt przy ruchu po łuku), przy hantlach — przedramiona przy nadgarstkach (s. 355), przy pulloverze i wyprostach nad głową — sam hantel; komunikacja i podanie sztangi | szczegóły do Standardu 3.2 (szczebel 2); zamyka „sposób asekuracji hantli” z przeglądu 23.10 (pkt 3) |
| Ćwiczenia dynamiczne | [ESS] s. 354–356: „Power exercises should not be spotted.” | zamiast asekuracji: wolne miejsce, nauka bezpiecznego porzucenia sztangi (przed sobą — odepchnąć/upuścić; za głową — puścić i wyskoczyć w przód) | patrz § 6, F4 |
| Rozgrzewka | [ESS] s. 318–320 | ogólna (ok. 5 min lekkiego wysiłku) + część szczegółowa; zwykle 10–20 min; koniec najwyżej 15 min przed treningiem; schemat RAMP; rozciąganie statyczne w rozgrzewce — dowody niejednoznaczne | szczebel 3, jedno źródło; liczby (5 min, 10–20 min, 15 min) bez drugiego źródła nie do aplikacji |
| Rozciąganie statyczne | [ESS] s. 322, 323, 329 | 15–30 s, do lekkiego dyskomfortu (nie bólu), po ogólnej rozgrzewce; przy bólu, promieniowaniu lub drętwieniu — zmniejszyć | zgodne z `st.tension`, `st.noBounce`; liczba 15–30 s — z drugim źródłem (np. wytyczne ACSM) mogłaby być ustalona, [DO USTALENIA] |
| Rozciąganie dynamiczne | [ESS] s. 341 | 5–10 powtórzeń, zakres stopniowo większy, bez sprężynowania, technika przed zakresem | zgodne z `dyn.control`, `dyn.mis.jerk` (trzecie źródło) |
| Plyometria — bezpieczeństwo | [ESS] s. 481–482 | lądowanie: barki nad kolanami, kolana nad palcami, kolana nie uciekają do środka; podłoże amortyzujące; skrzynie stabilne i nieśliskie; wysokość zeskoku 41–107 cm, ≤ 46 cm przy masie > 100 kg | zgodne z `jump.land`, `jump.mis.stiff`; „kolana nie do środka” przy skokach to kandydat na wskazówkę (z drugim źródłem). Liczby — „jedno źródło”, nie do aplikacji. Zdania o ryzyku kontuzji — nie do aplikacji |
| Nazewnictwo chwytów | [ESS] s. 352 | nachwyt, podchwyt, neutralny, mieszany, hakowy; zamknięty/otwarty; pięć punktów podparcia; sticking point | **konwencja**; w `docs/lokalizacja/slownik-terminow.json` brak terminów chwytów (`Grep 'nachwyt|podchwyt|mieszany'` → 0) — warto dodać dla 35 języków |
| Poza katalogiem | [ESS] tab. 17.9, s. 458; s. 447 | cele treningowe (%1RM i powtórzenia); „co najmniej jeden, najwyżej trzy dni przerwy między sesjami tych samych partii” | w `docs/research/zakresy-powtorzen-cele-2026-10.md:36` liczby są „ze streszczenia wtórnego” — teraz można je sprawdzić u źródła; w `docs/research/23-regeneracja-partii.md:14,31` „Essentials — nieprzeczytane” — tu jest odpowiedź (bez „48 h”) |
| Pozycje do recenzji animacji (bramka 4) | [ESS] s. 362, 364, 366, 379, 381, 385, 386, 388, 391, 396, 397, 398, 400, 433 | kąt tułowia przy wiosłowaniu i skłonach, koniec ruchu w RDL, prasie, przysiadzie, wypadzie, step-upie (skrzynia 30–46 cm), wysokość łokci przy wiosłowaniu pionowym, wznosach i kettlebellu, głębokość ugięcia w push pressie | kąty techniki: z drugim źródłem szczebla 4 → ustalone (wyjątek z 25.10.2026); bez niego — tylko lista kontrolna dla recenzenta, nie tekst |

---

## 5. Znaleziska

| ID | Znalezisko | Waga | Realność | W 1.0 |
|---|---|---|---|---|
| F1 | `skull.setup` („gryf nad czołem”) różni się od [ESS] s. 398 (nad klatką, ramiona pionowo) i [ST] s. 200 (nad barkami); zgodny z biblioteką szczebla 4 (#36 „above your face”). Przy sprzeczności wyższy szczebel wygrywa. Dotyczy Skullcrusher (EZ) (własny) i pośrednio rodziny `triLying`. Kroki: Trening → ćwiczenie Skullcrusher (EZ) → „Technika”. | ŚREDNIE (szczegół ustawienia, nie liczba i nie zdrowie; audyt może uznać za „błędne twierdzenie” → WYSOKIE) | realny | prawdopodobnie tak (etap 1 wskazówek, 08.10.2026) [DO USTALENIA: `git show origin/main:lib/cues/text/pl.json`] |
| F2 | [ST] s. 213, 215, 217–218 zakazuje kolan przed palcami; nasze `sq.kneesPast` mówi, że mogą wyjść. Nasza podstawa: badanie (szczebel 3) + serwis specjalistyczny; nowszy [ESS] s. 381 granicy nie stawia. [ST] s. 215: „Keep the knees over, but not beyond, the toes.” | NISKIE (bez zmiany w aplikacji; dopisać rozbieżność do rejestru) | — | tak |
| F3 | `tpd.move` — koniec powrotu (prawie pełne zgięcie) zgodny z [ST] s. 202, szerszy niż [ESS] s. 399 (przedramiona poziomo). Różnica zakresu, nie bezpieczeństwa. | NISKIE | realny | prawdopodobnie tak [DO USTALENIA] |
| F4 | Ćwiczenia dynamiczne (25 ze sztangą, 4 z hantlem; lista w `docs/research/przeglad-badacza-2026-10-23.md:38,52`) nie mają dziś żadnej informacji o bezpieczeństwie. [ESS] s. 354–356 daje odpowiedź: nie asekurować, nauczyć się porzucić sztangę, oczyścić miejsce. Sprzeczne z dosłownym brzmieniem Standardu 3.2, który cytuje ten rozdział. | ŚREDNIE | realny (użytkownik robi power clean bez informacji) | tak (Push Press w 1.0; docs/18-przekazanie.md:469) |
| F5 | `dl.feet` „nad środkiem stopy” vs [ESS] s. 389 „nad przodostopiem, ok. 3 cm od goleni” — różnica sformułowania; część wspólna „tuż przy goleniach”. | NISKIE | realny | tak |
| F6 | Zestawy ogólne przy Pec Deck, Chest Dip, Dip Machine, Stiff-Legged Deadlift to analogie (wskazówki z innego ćwiczenia); książki mają opisy własne. Treść zestawów nie jest sprzeczna (`bdip.move` „mniej więcej kąt prosty w łokciach” ≈ [ST] s. 196 „ramię poziomo”). | NISKIE (ulepszenie, nie błąd) | — | nie (zestawy ogólne to 1.1) |
| F7 | Test cytatów (`tests/research-quotes.test.ts:13`, `DIR = 'docs/research'`) nie obejmuje `data/zrodla/*.json`. Jeśli cytaty z książek trafią do `data/zrodla/cues.json` (repo publiczne), nic nie pilnuje limitu 1–2 zdań / 300 znaków. | ŚREDNIE (prawa autorskie — zapobiegawczo; dziś brak naruszenia) | brzegowy | nie |
| F8 | [ESS] s. 376 podaje triceps jako główny mięsień przy Pec Deck — błąd albo skrót książki; przy użyciu „Major Muscles Involved” do partii potrzebna ocena, nie przepisywanie. | NISKIE | teoretyczny (dopóki nie użyjemy) | nie |
| F9 | [ST] s. 166–167: wyciskanie stojąc „po łuku wokół głowy, na końcu lekko za głową”; [ESS] s. 395 (siedząc): lekko odchylić głowę, by sztanga minęła twarz. U nas `ohp.tall` „ciężar idzie prosto w górę nad głowę” — zgodne co do kierunku, brakuje „głowa lekko w tył, potem pod sztangę”. | NISKIE | realny | tak |

---

## 6. F4 — ćwiczenia dynamiczne: opcje (decyzja merytoryczna z hierarchii, produktowa — co pokazać)

Stan źródeł: Standard 3.2 (szczebel 2): asekuracja przy wolnych ciężarach nad głową i na tułowiu, bez wyjątku w tekście; cytuje rozdz. 15 [ESS].
[ESS] s. 354: „Power exercises should not be spotted.” (szczebel 3). Stanowisko tej organizacji o ćwiczeniach olimpijskich (2023, szczebel 2) —
**nieprzeczytane**: PDF pod adresem organizacji zwrócił dziś 403, repozytorium uczelni 405 → [DO USTALENIA] (agent z Bash: `curl` + `pdftotext`, jak 23.10).

| Opcja | Co | Zysk | Koszt |
|---|---|---|---|
| A | Zdanie przy ćwiczeniach dynamicznych: „Przy tym ćwiczeniu nikt nie asekuruje — miej wolne miejsce i naucz się bezpiecznie porzucić sztangę.” Podstawa: [ESS] jako szczegół do Standardu, który go cytuje | luka zamknięta jednym zdaniem w 35 językach | agent: badacz ok. 1 h (drugie źródło: np. materiały szkoleniowe federacji podnoszenia ciężarów, szczebel 4) + programista/tłumacz ok. 1–2 h; właściciel: decyzja; 0 zł. Ryzyko: rozbieżność z dosłownym brzmieniem Standardu (trzeba ją nazwać w rejestrze) |
| B | Tylko część wspólna obu źródeł: „Ćwicz w wolnym miejscu; naucz się bezpiecznie porzucić sztangę” — bez zdania o asekuracji | bez konfliktu ze Standardem | jak A; słabsza informacja (nie mówi, że partner tu nie pomoże) |
| C | Zostawić bez zdania do przeczytania stanowiska z 2023 | zero ryzyka sprzeczności | luka zostaje; ok. 1 h agenta później |

**Rekomendacja: B teraz** (po przeczytaniu stanowiska 2023, jeśli da się w tym samym przebiegu), **A**, jeśli stanowisko 2023 albo drugie niezależne źródło mówi wprost o braku asekuracji. To nowa treść — w oknie zamrożenia tylko wtedy, gdy audyt uzna F4 za bloker; inaczej 1.1.x.

---

## 7. Ograniczenia (zadanie 5)

- **Prawo autorskie.** Wolno brać fakty i reguły (kąt, kolejność, punkt końcowy) i pisać je własnymi słowami w naszym układzie (ustawienie / ruch / wskazówki / błędy, 2–4 punkty).
  Nie wolno: przepisywać list kontrolnych (także „parafrazą zdanie po zdaniu w tej samej kolejności”), zdjęć, rysunków ani tabel; nie odrysowywać póz ze zdjęć do grafik
  (zdjęcie wolno obejrzeć dla sprawdzenia pozycji). Obie książki zakazują powielania (strona redakcyjna); [ST] ma usunięte zdjęcia „Due to rights limitations” — tekst też pochodzi z wydania chronionego.
- **Repo publiczne.** W repo tylko: opis bibliograficzny (tytuł, wydanie, ISBN, rozdział, strona) i najwyżej 1 zdanie cytatu na miejsce. Wpisy w `data/zrodla/cues.json`
  → najpierw rozszerzyć strażnika cytatów na `data/zrodla` (F7). Proponowany identyfikator źródła: `ests4-15.21` z miejscem „s. 380–381, Downward Movement Phase”.
- **Źródła publicznie anonimowo.** Aplikacja, strona i sklep nie wymieniają książek ani organizacji; `lib/sources.ts:10` ma już wzorzec nazwy organizacji, więc strażnik
  `tests/zrodla-wiedzy.test.ts` złapie przypadkowe użycie skrótu. Pole „rodzaj źródła” (`CUE_BASIS_KINDS`: org/site/maker/study, `lib/cues/index.ts:25`) nie ma rodzaju „książka” —
  przy wpisie trzeba wybrać „org” albo dodać rodzaj (zmiana kodu i testów) — [DO USTALENIA], czy ten podpis jest gdziekolwiek jeszcze pokazywany.
- **Niezależność i wiek.** Obie książki = jedno źródło; [ST] miejscami przestarzały; jest nowsze wyd. 5 [ESS] (różnic nie znam — [DO USTALENIA]).
- **Przechowywanie — opcje:**
  1. Dysk „Trening App / 05 Research konkurencji” — istnieje, ale to zła kategoria (podręczniki to nie konkurencja) i folder bywa udostępniany agentom do researchu rynku.
  2. **Nowy folder „Trening App / 06 Źródła merytoryczne (prywatne)”**: pliki z wydaniem i ISBN w nazwie, dostęp tylko właściciel; obok dokument „Indeks podręczników” z mapą z § 2 (wolno mieć więcej szczegółów niż w repo). Agenci dostają tekst na czas zadania (jak dziś), bez kopii w repo.
  3. Tylko lokalnie u właściciela + w repo sam opis bibliograficzny — najmniej ryzyka, ale każde zadanie wymaga ponownego wgrania.
  **Rekomendacja: 2.** Koszt: ok. 5 min właściciela, 0 zł.

---

## 8. Opcje wykorzystania (podsumowanie)

| Opcja | Zakres | Zysk | Praca agenta | Czekanie | Czas właściciela | Koszt |
|---|---|---|---|---|---|---|
| **A. Pełne przejście** | wszystkie 101 + 24 ćwiczeń: porównanie każdej wskazówki z książką, wpisy źródeł, drugie źródła tam, gdzie brak | najmocniejsze podstawy kart, lista różnic dla wszystkich rodzin | ok. 10–14 h (4 agentów równolegle → ok. 3–4 h) | CI/verify po wdrożeniu; recenzja lokalizacji zmienionych zdań | decyzje przy różnicach (ok. 15 min) | 0 zł |
| **B. Celowane** | ok. 50 zestawów ogólnych → własne, 4 karty niepełne, 3–4 bez wskazówek, F4; drugie źródło szczebla 4 do każdego | najwięcej nowych kart „własnych” na jednostkę pracy; ważne też dla strony | ok. 5–6 h (2 agentów → ok. 3 h) | jak A, mniej zdań do tłumaczenia | decyzja o F4 | 0 zł |
| **C. Tylko nowe karty strony** | przy tworzeniu każdej nowej karty dla strony: sprawdzenie w książce i dopisanie źródła | zero osobnej pracy, rośnie z czasem | ok. 10 min na kartę | brak | brak | 0 zł |
| **D. Wyd. 5** | kupić wyd. 5 [ESS] i robić A/B na nim | aktualny tekst (rozdz. 16 technika) | jak A/B + 1–2 h na nową mapę | dostawa e-booka | zakup | ok. 90–100 USD [DO USTALENIA cena; wyd. 4 w docs/18-archiwum-do-11.10.md:260 — 89 USD] |
| **E. Minimum teraz** | zamknąć F1–F5 i F9 decyzją z hierarchii, F4 (opcja B z § 6), weryfikacja tab. 17.9 i s. 447 w dwóch dokumentach research, strażnik cytatów (F7) | zamknięte pytania otwarte i różnice przed wydaniem | ok. 2 h badacz + ok. 1 h programista | verify ok. 12 min | decyzja F4 | 0 zł |

**Rekomendacja:** **E** teraz (zamknięcia i różnice — mieszczą się w naprawach, jeśli audyt uzna je za blokery; inaczej pierwsze w 1.1.x),
**B** zaraz po wydaniu, **C** jako stała zasada dla nowych kart strony. A nie jako osobne przejście — mapę z § 2 dać trwającemu audytowi
jako kolumnę listy kontrolnej. D tylko, jeśli właściciel i tak chce aktualnego podręcznika; nie jest potrzebne do E ani B.

---

## 9. Pytania dla trwającego audytu ćwiczeń i grafik / otwarte

- Audyt: F1 (start skull crushera) — czy to błąd do poprawy przed wydaniem; F3, F5, F9 — czy przyjmujemy część wspólną.
- Audyt animacji: pozycje końcowe z § 4 (ostatni wiersz) jako lista kontrolna kadrów dla rodzin przysiad, martwy ciąg/RDL, wiosłowania, wypady, wznosy, push press, swing.
- [OTWARTE] Czy „Hang Clean”, „Hang Snatch”, „Power Jerk” w katalogu to wersje „power” (odbiór w ćwierć-przysiadzie) jak w [ESS] s. 402–407 — od tego zależy dopasowanie.
- [OTWARTE] Stanowisko organizacji o ćwiczeniach olimpijskich (2023): asekuracja i porzucanie sztangi — nieprzeczytane (403/405).
- [DO USTALENIA] Ile ze 206 przypisań partii „jedno źródło” obejmuje mapa z § 2.
- [DO USTALENIA] Widoczność F1, F3 w 1.0 (`git show origin/main:lib/cues/text/pl.json`) i notatki koordynatora (przekazanie-konta) — nie czytałem.
- [DO USTALENIA] Czy podpis „rodzaj źródła” wskazówek jest jeszcze gdzieś pokazywany (dla wyboru rodzaju „książka”).

## Źródła

- [ESS] wyd. 4 i [ST] — teksty od właściciela (miejsca podane przy każdym twierdzeniu).
- Wydanie 5 [ESS]: [Human Kinetics — strona produktu](https://us.humankinetics.com/products/essentials-of-strength-training-and-conditioning-4th-edition-with-hkpropel-access) (odczyt 28.10.2026: „now in its fifth edition”, ©2027, 864 s., technika w rozdz. 16); dodatkowo [katalog biblioteki ECU](https://librarycatalog.ecu.edu/catalog/6728946) (wynik wyszukiwania, nieotwierany).
- Biblioteka ćwiczeń organizacji szkolącej, #36 Lying Barbell Triceps Extensions: [acefitness.org](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) — Step 1, „directly above your face” (odczyt 28.10.2026).
- Stanowisko o ćwiczeniach olimpijskich 2023 — próby odczytu: [PDF organizacji](https://dxpprod.nsca.com/globalassets/about/position-statements/weighlifting-for-sports-performance.pdf) (403), [repozytorium Middlesex](https://repository.mdx.ac.uk/item/124y04) (405) — nieprzeczytane.
