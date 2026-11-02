# pushup_plank (cz. 2: deski, rollouty, pompki plyometryczne) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zasady: wyjątek dla wskazówek techniki (2 niezależne źródła szczebla 4, żadne przeczytane nie przeczy) i uzupełnienie koordynatora
z 02.11.2026 (strony innych aplikacji treningowych nie są źródłem; zdania zestawu ogólnego tylko, gdy przeczytane źródła potwierdzają je dla wariantu).
Wszystkie strony przeczytane narzędziem 02.11.2026; miejsce podane przy każdym odwołaniu. Liczb (powtórzenia, czasy, wysokości skrzyń)
i ostrzeżeń zdrowotnych ze źródeł nie przenoszę.
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — patrz „Korekta szczebli”, „Korekta 2 szczebli” i
„Korekta szczebli — uzupełnienie 3” na końcu. Źródła szczebla 5 usunięte z list `s` w bloku JSON (nie liczą się do dwóch źródeł).

## Ćwiczenia
| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Ab Wheel | częściowe (bez błędu) | po uzupełnieniu 3: Experience Life → 5 (autorka bez podanych kwalifikacji trenerskich); ustawienie i ruch — Catalyst + Echelon; `rollout.range`, `plank.brace`, `rollout.mis.arch` — tylko Catalyst → Otwarte |
| Plank Shoulder Taps | otwarte | Coach → 5 (uzupełnienie 2), fit-pro.com → 5 (uzupełnienie 3); brak źródła szczebla 4 |
| Copenhagen Plank | otwarte | po korekcie tylko Catalyst (NFPT bez biogramu z kwalifikacjami → 5; E3 Rehab → 5) |
| Renegade Row | częściowe (bez błędu) | ACE 355 + BarBend: ustawienie i ruch; błąd i `plank.brace` — po korekcie tylko BarBend (NFPT → 5) |
| Rollout (sztanga) | gotowe (krótka karta) | ACE 309 (sztanga) + Catalyst (wprost: kółko albo sztanga z obrotowymi tulejami) |
| Standing Barbell Rollout | otwarte | tylko Catalyst wspomina wersję stojącą jednym zdaniem; reszta to bazy ćwiczeń/aplikacje |
| Barbell Rollout from Bench | otwarte | tylko bazy ćwiczeń i aplikacje; brak źródła szczebla 4 |
| Suspended Fallout | otwarte | tylko bazy ćwiczeń, aplikacje i blogi; strony producenta taśm nie znalazłem |
| Plyo Push-Up | otwarte | po korekcie tylko NASM (REP Fitness — producent, ale pompka bez sprzętu nie jest jego rodzajem sprzętu → 5) |
| Drop Push | otwarte | brak 2 źródeł szczebla 4; jedyne badanie opisuje odwrotną kolejność (z podłogi na skrzynie) |
| Incline Push-Up Depth Jump | otwarte | tylko bazy ćwiczeń i aplikacje |
| Plyo Kettlebell Push-Ups | otwarte | tylko bazy ćwiczeń i aplikacje |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)
„Ab Wheel” i „Renegade Row” — wpisy częściowe (bez błędu; karty częściowe kwalifikują się wg odpowiedzi koordynatora 1.1 z 02.11.2026).
Wpis „Plank Shoulder Taps” usunięty (otwarte po uzupełnieniach 2 i 3).

```json
{
 "Ab Wheel": {
  "setup": [{"c": "rollout.wheel.setup", "s": [["catalyst-ab-rollout", "opis (kneel, wheel close to the knees, arms straight)"], ["echelon-ab-wheel", "s. 1, AB ROLL — START"]]}],
  "move": [{"c": "rollout.wheel.move", "s": [["echelon-ab-wheel", "s. 1, AB ROLL — FINISH"], ["catalyst-ab-rollout", "opis (roll out, pull back)"]]}],
  "tips": [],
  "mistakes": []
 },
 "Renegade Row": {
  "setup": [{"c": "renegade.setup", "s": [["ace-355", "Preparation; Step 1"], ["barbend-renegade-row", "Step 1 — Set Your Base (feet wider than shoulder-width)"]]}],
  "move": [{"c": "renegade.move", "s": [["ace-355", "Steps 3–6"], ["barbend-renegade-row", "Step 2 — Initiate the Row; Step 3 — Control the Eccentric"]]}],
  "tips": [],
  "mistakes": []
 },
 "Rollout (sztanga)": {
  "setup": [{"c": "rollout.bar.setup", "s": [["ace-309", "Preparation; Step 1"], ["catalyst-ab-rollout", "opis (ab wheel or barbell with rotating sleeves; kneel)"]]}],
  "move": [{"c": "rollout.bar.move", "s": [["ace-309", "Steps 2–4"], ["catalyst-ab-rollout", "opis (roll out, pull back)"]]}],
  "tips": [
   {"c": "rollout.range", "s": [["ace-309", "Step 2 (keep the hips pressed forward and the back straight)"], ["catalyst-ab-rollout", "opis (as close to the ground as possible while maintaining the brace)"]]},
   {"c": "plank.brace", "s": [["ace-309", "Step 3 (hold the trunk in position)"], ["catalyst-ab-rollout", "opis (brace the abs hard)"]]}
  ],
  "mistakes": [{"c": "rollout.mis.arch", "s": [["ace-309", "Step 2 (back straight)"], ["catalyst-ab-rollout", "opis (avoid hyperextension of the lower back)"]]}]
 }
}
```

## Nowe zdania (id | PL | EN)
Uwaga: identyfikatory `wheel.*` zaproponowane w docs/33 nie trafiły do `lib/cues/text/pl.json`; proponuję nazwy `rollout.*`, bo zdania zakresu i błędu dotyczą też sztangi.
Zdania oznaczone „(nieużyte)” nie występują w bloku JSON — propozycje do czasu znalezienia drugiego źródła szczebla 4.

| id | PL | EN |
|---|---|---|
| rollout.wheel.setup | Uklęknij i chwyć kółko oburącz przed kolanami, ręce proste. | Kneel and grip the wheel with both hands in front of your knees, arms straight. |
| rollout.wheel.move | Powoli wytocz kółko do przodu, opuszczając tułów ku podłodze, i wróć do klęku. | Slowly roll the wheel forward, lowering your torso toward the floor, then roll back to kneeling. |
| rollout.bar.setup | Uklęknij przed sztangą i chwyć ją oburącz. | Kneel in front of the bar and grip it with both hands. |
| rollout.bar.move | Wytocz sztangę do przodu, opuszczając tułów ku podłodze, i przyciągnij ją z powrotem. | Roll the bar forward, lowering your torso toward the floor, then pull it back in. |
| rollout.range | Wytaczaj tylko tak daleko, jak dasz radę bez wyginania lędźwi. | Roll out only as far as you can without arching your lower back. |
| rollout.mis.arch | Wygięte w łuk lędźwie przy wytaczaniu. | Lower back arching as you roll out. |
| ptap.setup (nieużyte) | Wejdź w podpór na prostych rękach. | Get into a plank on straight arms. |
| ptap.move (nieużyte) | Unieś jedną dłoń, dotknij nią przeciwnego barku i odstaw; zmieniaj ręce. | Lift one hand, tap the opposite shoulder and put it back; alternate hands. |
| ptap.mis.rock (nieużyte) | Kołysanie biodrami na boki przy każdym dotknięciu. | Hips rocking side to side with each tap. |
| cph.setup (nieużyte) | Połóż się na boku, przedramię na podłodze; górną stopę oprzyj na ławce, dolna noga pod ławką. | Lie on your side, forearm on the floor; rest your top foot on the bench, bottom leg under it. |
| cph.move (nieużyte) | Unieś biodra, aż ciało utworzy prostą linię, a dolną nogę oderwij od podłogi; wytrzymaj. | Lift your hips until your body forms a straight line, bottom leg off the floor; hold. |
| cph.mis.line (nieużyte) | Biodra opadają albo uciekają za wysoko — ciało wychodzi z linii. | Hips sagging or hiking too high — the body loses its straight line. |
| renegade.setup | Podpór na hantlach ustawionych pod barkami, nogi proste, stopy na szerokość barków lub szerzej. | Plank on dumbbells set under your shoulders, legs straight, feet shoulder-width or wider. |
| renegade.move | Przyciągnij jeden hantel do boku tułowia, odłóż go spokojnie i zmień rękę. | Row one dumbbell to the side of your torso, set it down with control and switch hands. |
| renegade.mis.twist (nieużyte) | Skręcanie bioder i tułowia, żeby dźwignąć hantel. | Twisting the hips and torso to heave the dumbbell up. |
| plyo.move (nieużyte) | Zejdź w dół jak w pompce i wypchnij się mocno, aż dłonie oderwą się od podłogi. | Lower as in a push-up, then push up hard enough for your hands to leave the floor. |

Zdania istniejące użyte: `plank.brace` (tylko Rollout (sztanga)). Nieużyte: `plank.noSag`, `plank.mis.sag`, `push.setup`.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)
| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| ace-309 | https://www.acefitness.org/resources/everyone/exercise-library/309/ | ACE (Roll Out, sztanga, #309) | 4 | 02.11.2026 |
| ace-355 | https://www.acefitness.org/resources/everyone/exercise-library/355/renegade-row/ | ACE (Renegade Row, #355) | 4 | 02.11.2026 |
| barbend-renegade-row | https://www.barbend.com/renegade-row/ | BarBend (artykuł o technice; J. Boly, CSCS; akt. 26.11.2024) | 4 | 02.11.2026 |
| nfpt-renegade-row | https://nfpt.com/how-to-do-the-renegade-row/ | NFPT (I. Nimblett, 10.08.2025; brak biogramu z kwalifikacjami na stronie) | 5 | 02.11.2026 |
| nfpt-copenhagen-plank | https://nfpt.com/the-copenhagen-plank-introducing-a-new-challenge-for-adductor-stabilization/ | NFPT (C. Kronemer, 28.08.2025; brak biogramu z kwalifikacjami na stronie) | 5 | 02.11.2026 |
| catalyst-ab-rollout | https://catalystathletics.com/exercise/135/Ab-Rollout | Catalyst Athletics — biblioteka ćwiczeń | 4 | 02.11.2026 |
| catalyst-copenhagen-plank | https://catalystathletics.com/exercise/565/Copenhagen-Plank | Catalyst Athletics | 4 | 02.11.2026 |
| echelon-ab-wheel | https://cdn.shopify.com/s/files/1/2422/9487/files/ECHELON-AB-WHEEL-EXERCISE-GUIDE.pdf | Echelon Fitness — instrukcja ćwiczeń do własnego kółka (producent, PDF 2021, s. 1) | 4 | 02.11.2026 |
| explife-ab-rollout | https://experiencelife.lifetime.life/?p=31209 | Experience Life (wydawca Life Time; M. Fazeli Fard — w biogramie „senior editor and Alpha Strong coach at Life Time”, bez nazwanych kwalifikacji/certyfikatów trenerskich; 05.11.2019) | 5 (uzupełnienie 3) | 02.11.2026 |
| puregym-ab-wheel | https://www.puregym.com/exercises/abs/ab-wheel-rollouts/ | PureGym — biblioteka ćwiczeń sieci klubów, bez autora | 5 | 02.11.2026 |
| coach-plank-shoulder-tap | https://www.coachweb.com/core-exercises/8846/plank-shoulder-tap | Coach (magazyn; N. Harris-Fry, dziennikarz, 18.02.2021) | 5 (uzupełnienie 2) | 02.11.2026 |
| pfp-tall-plank-shoulder-taps | https://fit-pro.com/article-4275-Tall-plank-shoulder-taps.html | Personal Fitness Professional (fit-pro.com; B. Schiff, fizjoterapeuta; 01.12.2017) | 5 (uzupełnienie 3: fit-pro.com = 5) | 02.11.2026 |
| sats-plank-shoulder-tap | https://www.sats.dk/ovelser/plank-with-shoulder-tap | SATS — biblioteka ćwiczeń sieci klubów | 5 | 02.11.2026 |
| e3rehab-copenhagen-plank | https://e3rehab.com/how-to-perform-copenhagen-planks/ | E3 Rehab (autor „Marc” bez kwalifikacji, 12.05.2024; strona sprzedaje programy) | 5 | 02.11.2026 |
| nasm-plyometric-push-up | https://www.nasm.org/resource-center/exercise-library/plyometric-push-up | NASM | 4 | 02.11.2026 |
| repfitness-plyometric | https://repfitness.com/blogs/training/best-plyometric-exercises | REP Fitness (producent sprzętu; pompka plyometryczna nie wymaga jego sprzętu — blog poza własnym rodzajem sprzętu) | 5 | 02.11.2026 |
| moore-2012 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4738879 | Moore, Tankovich, Riemann, Davies — Int J Exerc Sci 2012;5(4):334–343 (tylko do Otwartych) | 3 | 02.11.2026 |

Istniejące źródło użyte pomocniczo: `nasm-best-abs` (sekcja Renegade Row: biodra ustawione równo; sekcja Ab Wheel Rollout nie opisuje techniki).

## Otwarte (ćwiczenie/zdanie | powód)
1. **Zestawy ogólne — błędy dopasowania (informacja dla koordynatora):** zestaw „plank” (`plank.setup`: przedramiona, łokcie pod barkami) NIE pasuje do Plank Shoulder Taps (podpór na prostych rękach — Coach, SATS, PFP) ani do Copenhagen Plank (`splank.setup` „stopy jedna na drugiej” — tu górna stopa na ławce). Zestaw „pushup” dla Renegade Row: `push.move` (pompka) potwierdza tylko ACE 355; BarBend i NFPT opisują samo wiosłowanie w podporze. `push.mis.partial` dla Plyo Push-Up — żadne przeczytane źródło. Zestawu „rollout” nie ma w `pl.json`.
2. **Copenhagen Plank — `cph.setup`, `cph.move`, `cph.mis.line` (wycofane z bloku 02.11.2026):** po korekcie tylko 1 źródło szczebla 4 — Catalyst (opis: górna noga na ławce, dolna pod nią; uniesienie bioder do prostej linii). NFPT (opis ćwiczenia; Common errors) i E3 Rehab (Setup; Execution; Common mistakes) → szczebel 5. Potrzebne drugie źródło szczebla 4.
3. **Copenhagen Plank — „łokieć pod barkiem”, „zmień stronę”, oparcie górnej nogi:** pierwsze tylko w wynikach wyszukiwarki ze stron aplikacji; NFPT pisze o przedramieniu, Catalyst nie opisuje ręki. Zmiana strony — żadne z trzech źródeł wprost. Oparcie: NFPT, E3 — stopa; Catalyst — „noga” bez wskazania. Wariant z kolanem na ławce to inne ćwiczenie (łatwiejsze).
4. **Renegade Row — `plank.brace`, `renegade.mis.twist` (wycofane z bloku 02.11.2026):** po korekcie tylko BarBend (Step 1 „brace your core”; Common Mistakes — Twisting Your Body); NFPT → szczebel 5. Do `renegade.mis.twist` NASM Best Abs (szczebel 4, sekcja Renegade Row: biodra ustawione równo) był użyty tylko pomocniczo — recenzent może uznać go za drugie źródło (zdanie w formie wskazówki, nie błędu); bez tej decyzji błąd zostaje otwarty.
5. **Renegade Row — pompka między wiosłowaniami:** tylko ACE 355 (NASM Best Abs wymienia ją jako progresję). Jeśli animacja pokazuje pompkę, potrzebny drugi opis wersji z pompką. „Łokieć blisko tułowia” — tylko ACE 355 (strona innej aplikacji się nie liczy).
6. **Plank Shoulder Taps — cała karta (`ptap.setup`, `ptap.move`, `ptap.mis.rock`, `plank.brace`, `plank.noSag`):** po uzupełnieniach 2 i 3 brak źródła szczebla 4 (Coach → 5, PFP/fit-pro.com → 5, SATS → 5). Miejsca: Coach „How to; mistakes”, PFP „Setup; Execution; Coaching points”.
7. **Rollout (sztanga) — chwyt na szerokość barków, ręce proste:** szerokość chwytu tylko ACE 309; ręce proste tylko Catalyst — poza kartą.
8. **Plyo Push-Up — `push.setup`, `plyo.move`, `plank.brace`, `plank.mis.sag` (wycofane z bloku 02.11.2026):** po korekcie tylko NASM (Setup; Step 2–3; Common Mistakes „hips drop”); REP Fitness → szczebel 5 (blog producenta o ćwiczeniu bez jego sprzętu).
9. **Plyo Push-Up — lądowanie na ugiętych łokciach:** NASM (Step 3; Common Mistakes) wprost; drugiego źródła szczebla 4 nie przeczytałem (strony z tym zdaniem w wynikach to aplikacje albo dawały 403). Badanie Moore 2012 (Protocol) każe „złapać się” na ugiętych łokciach, ale w wariancie lądowania na skrzyniach. Kandydat do uzupełnienia — szukać drugiego opisu.
10. **Drop Push, Incline Push-Up Depth Jump, Plyo Kettlebell Push-Ups:** w wynikach tylko bazy ćwiczeń i aplikacje (nie są źródłem wg uzupełnienia briefu); Moore 2012 opisuje ruch z podłogi na skrzynie (odwrotna kolejność niż Drop Push). Bez kart.
11. **Standing Barbell Rollout, Barbell Rollout from Bench, Suspended Fallout:** Catalyst wspomina wersję stojącą tylko jako opcję („kneel or stand”), bez opisu; wersji z ławki i fallout na taśmach — brak źródła szczebla 4 (strony producenta taśm nie znalazłem w wynikach). Analogia do rolloutu z klęku byłaby „uproszczeniem” — nie wpisuję.
12. **Echelon** — producent sprzętu z własną aplikacją; użyta wyłącznie instrukcja papierowa do własnego kółka (dokumentacja producenta dla własnego rodzaju sprzętu, nie dokumentacja aplikacji).
13. **Twierdzenia zdrowotne i liczby ze źródeł** (ostrzeżenia o lędźwiach, kontuzje barku, liczby serii/sekund, wysokości skrzyń, tempo 2-1-2) — nie przenoszę.
14. **Ab Wheel — `rollout.range`, `plank.brace`, `rollout.mis.arch` (wycofane z bloku w uzupełnieniu 3):** tylko Catalyst (opis: „as straight and close to the ground as possible while maintaining the brace”; „brace the abs hard”; „avoid hyperextension of the lower back”); Experience Life (krok 5; Common mistakes) → 5. Echelon (s. 1) nie podaje zakresu ani błędów. Uwaga: dla Rollout (sztanga) te same zdania mają ACE 309 + Catalyst — przeniesienie ACE 309 (sztanga) na kółko byłoby analogią. Jeśli koordynator uzna „Alpha Strong coach at Life Time” za kwalifikację trenerską, Experience Life wraca do 4 i Ab Wheel do „gotowe”.

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria (a) organizacja szkoląca / serwis z redakcją i recenzją ekspercką /
producent własnego rodzaju sprzętu; (b) autor i data albo treść firmowana; (c) nie afiliacja ani marketing). Autor, data i charakter stron
sprawdzone przez WebFetch 02.11.2026 (NFPT ×2, E3 Rehab, Experience Life); bez nowych badań treści.

Źródła:
- nfpt-renegade-row, nfpt-copenhagen-plank (NFPT): 4 → 5 — na stronach autor i data, ale bez biogramu z kwalifikacjami (strona autora 404).
- puregym-ab-wheel: „otwarty” → 5 (rozstrzygnięcie: sieci siłowni).
- sats-plank-shoulder-tap: „otwarty” → 5 (sieć klubów, bez autora).
- e3rehab-copenhagen-plank (E3 Rehab): 4 (propozycja) → 5 — autor bez kwalifikacji, strona sprzedaje programy.
- explife-ab-rollout (Experience Life): 4 (propozycja) → 4 — magazyn z redakcją, autorka (starsza redaktorka, trenerka) i data; artykuł bez promocji produktów (tylko odnośniki wydawcy). (Zmienione w uzupełnieniu 3 — niżej.)
- repfitness-plyometric (REP Fitness): 4 → 5 — producent liczy się tylko dla własnego rodzaju sprzętu; pompka bez sprzętu.
- catalyst-ab-rollout, catalyst-copenhagen-plank: 4 → 4 (rozstrzygnięcie).
- barbend-renegade-row: 4 → 4 (artykuł o technice).
- echelon-ab-wheel: 4 → 4 (instrukcja do własnego kółka).
- coach-plank-shoulder-tap, pfp-tall-plank-shoulder-taps: 4 → 4 (magazyny z redakcją, autor i data). (Zmienione w uzupełnieniach 2 i 3.)
- ace-309, ace-355, nasm-plyometric-push-up: 4 → 4. moore-2012: 3 → 3.

Ćwiczenia:
- Ab Wheel: gotowe → gotowe (usunięte odwołania do PureGym). (Zmienione w uzupełnieniu 3.)
- Plank Shoulder Taps: gotowe → gotowe (usunięte SATS; `ptap.setup` skrócone; `plank.noSag` wycofane). (Zmienione w uzupełnieniu 2.)
- Copenhagen Plank: gotowe → otwarte.
- Renegade Row: gotowe → częściowe (bez błędu; `plank.brace` i `renegade.mis.twist` wycofane).
- Rollout (sztanga): gotowe → gotowe.
- Plyo Push-Up: gotowe → otwarte.
- Pozostałe 6 ćwiczeń: otwarte → otwarte.

## Korekta 2 szczebli (koordynator grupy, 02.11.2026, uzupełnienie 2 rozstrzygnięcia koordynatora linii 1.1)
- Coach (magazyn) — warunkowo 4 tylko z autorem z kwalifikacjami. `coach-plank-shoulder-tap`: autor N. Harris-Fry, opisany jako dziennikarz od 2015, bez certyfikatów; technika bez przypisanego eksperta (WebFetch 02.11.2026) → **5**.
- Skutek: **Plank Shoulder Taps: gotowe → otwarte** (zostaje tylko PFP fit-pro.com); wpis w bloku JSON usunięty w uzupełnieniu 3.
- The Prehab Guys — warunkowo 4 (artykuł z autorem z kwalifikacjami); użyte strony bez autora → 5 bez zmian.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1 (Experience Life: 4 tylko z autorem z kwalifikacjami trenerskimi; fit-pro.com: 5).
Experience Life sprawdzone WebFetch 02.11.2026: podpis „By Maggie Fazeli Fard | Experience Life”, 05.11.2019; biogram: „senior editor and
Alpha Strong coach at Life Time” — rola trenerska w sieci klubów, ale bez nazwanych kwalifikacji ani certyfikatu → potraktowane jako brak kwalifikacji.

Źródła:
- explife-ab-rollout: 4 → 5.
- pfp-tall-plank-shoulder-taps (fit-pro.com): 4 → 5.

Ćwiczenia:
- Ab Wheel: gotowe → częściowe (ustawienie + ruch: Catalyst + Echelon; `rollout.range`, `plank.brace`, `rollout.mis.arch` → Otwarte 14).
- Plank Shoulder Taps: otwarte → otwarte (0 źródeł szczebla 4); nieważny wpis usunięty z bloku JSON.
- Rollout (sztanga), Renegade Row: bez zmian (gotowe / częściowe; ACE, Catalyst, BarBend nieobjęte uzupełnieniem 3).
