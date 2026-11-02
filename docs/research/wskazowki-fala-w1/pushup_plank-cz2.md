# pushup_plank (cz. 2: deski, rollouty, pompki plyometryczne) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zasady: wyjątek dla wskazówek techniki (2 niezależne źródła szczebla 4, żadne przeczytane nie przeczy) i uzupełnienie koordynatora
z 02.11.2026 (strony innych aplikacji treningowych nie są źródłem; zdania zestawu ogólnego tylko, gdy przeczytane źródła potwierdzają je dla wariantu).
Wszystkie strony przeczytane narzędziem 02.11.2026; miejsce podane przy każdym odwołaniu. Liczb (powtórzenia, czasy, wysokości skrzyń)
i ostrzeżeń zdrowotnych ze źródeł nie przenoszę.

## Ćwiczenia
| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Ab Wheel | gotowe | Catalyst + Echelon (instrukcja producenta kółka) + Experience Life; PureGym tylko pomocniczo (szczebel jak sieci klubów — Otwarte 9). Zamyka wcześniejsze „otwarte” z docs/33 bez materiałów uczelnianych |
| Plank Shoulder Taps | gotowe | Coach + PFP (fit-pro.com) + SATS (pomocniczo). Zestaw ogólny „plank” (przedramiona) NIE pasuje — podpór na prostych rękach |
| Copenhagen Plank | gotowe (krótka karta) | Catalyst + NFPT + E3 Rehab; bez „łokieć pod barkiem” i „zmień stronę” (nie w 2 źródłach) |
| Renegade Row | gotowe | ACE 355 + BarBend + NFPT; pompka między wiosłowaniami — tylko ACE (Otwarte 4) |
| Rollout (sztanga) | gotowe (krótka karta) | ACE 309 (sztanga) + Catalyst (wprost: kółko albo sztanga z obrotowymi tulejami) |
| Standing Barbell Rollout | otwarte | tylko Catalyst wspomina wersję stojącą jednym zdaniem; reszta to bazy ćwiczeń/aplikacje |
| Barbell Rollout from Bench | otwarte | tylko bazy ćwiczeń i aplikacje; brak źródła szczebla 4 |
| Suspended Fallout | otwarte | tylko bazy ćwiczeń, aplikacje i blogi; strony producenta taśm nie znalazłem |
| Plyo Push-Up | gotowe (krótka karta) | NASM + REP Fitness (producent sprzętu); lądowanie na ugiętych łokciach — tylko NASM (Otwarte 6) |
| Drop Push | otwarte | brak 2 źródeł szczebla 4; jedyne badanie opisuje odwrotną kolejność (z podłogi na skrzynie) |
| Incline Push-Up Depth Jump | otwarte | tylko bazy ćwiczeń i aplikacje |
| Plyo Kettlebell Push-Ups | otwarte | tylko bazy ćwiczeń i aplikacje |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)
```json
{
 "Ab Wheel": {
  "setup": [{"c": "rollout.wheel.setup", "s": [["catalyst-ab-rollout", "opis (kneel, wheel close to the knees, arms straight)"], ["echelon-ab-wheel", "s. 1, AB ROLL — START"], ["explife-ab-rollout", "kroki 1–2; Common mistakes (Bending the arms)"]]}],
  "move": [{"c": "rollout.wheel.move", "s": [["echelon-ab-wheel", "s. 1, AB ROLL — FINISH"], ["catalyst-ab-rollout", "opis (roll out, pull back)"], ["explife-ab-rollout", "kroki 3–5"]]}],
  "tips": [
   {"c": "rollout.range", "s": [["catalyst-ab-rollout", "opis (as straight and close to the ground as possible while maintaining the brace; avoid hyperextension)"], ["explife-ab-rollout", "krok 5; Common mistakes (Rolling too far)"], ["puregym-ab-wheel", "krok 4 (pomocniczo)"]]},
   {"c": "plank.brace", "s": [["catalyst-ab-rollout", "opis (brace the abs hard)"], ["explife-ab-rollout", "Common mistakes (brace your core)"], ["puregym-ab-wheel", "krok 2 (pomocniczo)"]]}
  ],
  "mistakes": [{"c": "rollout.mis.arch", "s": [["catalyst-ab-rollout", "opis (avoid hyperextension of the lower back)"], ["explife-ab-rollout", "Common mistakes (Arching the back)"], ["puregym-ab-wheel", "Tips (pomocniczo)"]]}]
 },
 "Plank Shoulder Taps": {
  "setup": [{"c": "ptap.setup", "s": [["coach-plank-shoulder-tap", "How to (starting position)"], ["sats-plank-shoulder-tap", "opis (pomocniczo)"], ["pfp-tall-plank-shoulder-taps", "Setup (tall plank)"]]}],
  "move": [{"c": "ptap.move", "s": [["coach-plank-shoulder-tap", "How to"], ["pfp-tall-plank-shoulder-taps", "Execution"], ["sats-plank-shoulder-tap", "opis (pomocniczo)"]]}],
  "tips": [
   {"c": "plank.brace", "s": [["pfp-tall-plank-shoulder-taps", "Execution (brace your core)"], ["coach-plank-shoulder-tap", "How to (engage your core and glutes)"]]},
   {"c": "plank.noSag", "s": [["coach-plank-shoulder-tap", "How to (without letting hips drop or lifting them)"], ["sats-plank-shoulder-tap", "opis (flat back, straight line; pomocniczo)"]]}
  ],
  "mistakes": [{"c": "ptap.mis.rock", "s": [["coach-plank-shoulder-tap", "How to; mistakes (hips rocking side to side)"], ["pfp-tall-plank-shoulder-taps", "Coaching points; common mistakes (rotation of the pelvis or rib cage)"], ["sats-plank-shoulder-tap", "opis (hips square; pomocniczo)"]]}]
 },
 "Copenhagen Plank": {
  "setup": [{"c": "cph.setup", "s": [["catalyst-copenhagen-plank", "opis (top leg on a bench, bottom leg under it)"], ["nfpt-copenhagen-plank", "opis ćwiczenia (forearm flat on the floor, top foot on the elevated surface)"], ["e3rehab-copenhagen-plank", "Setup"]]}],
  "move": [{"c": "cph.move", "s": [["catalyst-copenhagen-plank", "opis (lift the hips up until the body is in a straight line; lower leg off the floor)"], ["nfpt-copenhagen-plank", "opis ćwiczenia (bottom leg hovering below the surface)"], ["e3rehab-copenhagen-plank", "Execution"]]}],
  "tips": [],
  "mistakes": [{"c": "cph.mis.line", "s": [["e3rehab-copenhagen-plank", "Common mistakes (body not in a straight line — sagging or piking)"], ["nfpt-copenhagen-plank", "Common errors (lifting the hips too high; straight line)"], ["catalyst-copenhagen-plank", "opis (straight line)"]]}]
 },
 "Renegade Row": {
  "setup": [{"c": "renegade.setup", "s": [["ace-355", "Preparation; Step 1"], ["barbend-renegade-row", "Step 1 — Set Your Base (feet wider than shoulder-width)"], ["nfpt-renegade-row", "Steps, krok 1"]]}],
  "move": [{"c": "renegade.move", "s": [["ace-355", "Steps 3–6"], ["barbend-renegade-row", "Step 2 — Initiate the Row; Step 3 — Control the Eccentric"], ["nfpt-renegade-row", "Steps, kroki 3 i 5"]]}],
  "tips": [{"c": "plank.brace", "s": [["barbend-renegade-row", "Step 1 (brace your core)"], ["nfpt-renegade-row", "Steps, krok 4; Form Cues (brace the abs)"]]}],
  "mistakes": [{"c": "renegade.mis.twist", "s": [["barbend-renegade-row", "Common Mistakes — Twisting Your Body"], ["nfpt-renegade-row", "Common Mistakes (hips and upper body twisting)"], ["nasm-best-abs", "Renegade Row (keep the hips square; pomocniczo)"]]}]
 },
 "Rollout (sztanga)": {
  "setup": [{"c": "rollout.bar.setup", "s": [["ace-309", "Preparation; Step 1"], ["catalyst-ab-rollout", "opis (ab wheel or barbell with rotating sleeves; kneel)"]]}],
  "move": [{"c": "rollout.bar.move", "s": [["ace-309", "Steps 2–4"], ["catalyst-ab-rollout", "opis (roll out, pull back)"]]}],
  "tips": [
   {"c": "rollout.range", "s": [["ace-309", "Step 2 (keep the hips pressed forward and the back straight)"], ["catalyst-ab-rollout", "opis (as close to the ground as possible while maintaining the brace)"]]},
   {"c": "plank.brace", "s": [["ace-309", "Step 3 (hold the trunk in position)"], ["catalyst-ab-rollout", "opis (brace the abs hard)"]]}
  ],
  "mistakes": [{"c": "rollout.mis.arch", "s": [["ace-309", "Step 2 (back straight)"], ["catalyst-ab-rollout", "opis (avoid hyperextension of the lower back)"]]}]
 },
 "Plyo Push-Up": {
  "setup": [{"c": "push.setup", "s": [["nasm-plyometric-push-up", "Setup (hands slightly wider than shoulder-width; head-to-heel line)"], ["repfitness-plyometric", "Explosive Push-Up (standard push-up)"]]}],
  "move": [{"c": "plyo.move", "s": [["nasm-plyometric-push-up", "Step 3"], ["repfitness-plyometric", "Explosive Push-Up (hands leave the surface)"]]}],
  "tips": [{"c": "plank.brace", "s": [["nasm-plyometric-push-up", "Step 2"], ["repfitness-plyometric", "Explosive Push-Up (brace your core)"]]}],
  "mistakes": [{"c": "plank.mis.sag", "s": [["nasm-plyometric-push-up", "Common Mistakes (hips drop)"], ["repfitness-plyometric", "Explosive Push-Up (back arching or sagging on push-off)"]]}]
 }
}
```

## Nowe zdania (id | PL | EN)
Uwaga: identyfikatory `wheel.*` zaproponowane w docs/33 nie trafiły do `lib/cues/text/pl.json`; proponuję nazwy `rollout.*`, bo zdania zakresu i błędu dotyczą też sztangi.

| id | PL | EN |
|---|---|---|
| rollout.wheel.setup | Uklęknij i chwyć kółko oburącz przed kolanami, ręce proste. | Kneel and grip the wheel with both hands in front of your knees, arms straight. |
| rollout.wheel.move | Powoli wytocz kółko do przodu, opuszczając tułów ku podłodze, i wróć do klęku. | Slowly roll the wheel forward, lowering your torso toward the floor, then roll back to kneeling. |
| rollout.bar.setup | Uklęknij przed sztangą i chwyć ją oburącz. | Kneel in front of the bar and grip it with both hands. |
| rollout.bar.move | Wytocz sztangę do przodu, opuszczając tułów ku podłodze, i przyciągnij ją z powrotem. | Roll the bar forward, lowering your torso toward the floor, then pull it back in. |
| rollout.range | Wytaczaj tylko tak daleko, jak dasz radę bez wyginania lędźwi. | Roll out only as far as you can without arching your lower back. |
| rollout.mis.arch | Wygięte w łuk lędźwie przy wytaczaniu. | Lower back arching as you roll out. |
| ptap.setup | Wejdź w podpór na prostych rękach, dłonie pod barkami. | Get into a plank on straight arms, hands under your shoulders. |
| ptap.move | Unieś jedną dłoń, dotknij nią przeciwnego barku i odstaw; zmieniaj ręce. | Lift one hand, tap the opposite shoulder and put it back; alternate hands. |
| ptap.mis.rock | Kołysanie biodrami na boki przy każdym dotknięciu. | Hips rocking side to side with each tap. |
| cph.setup | Połóż się na boku, przedramię na podłodze; górną stopę oprzyj na ławce, dolna noga pod ławką. | Lie on your side, forearm on the floor; rest your top foot on the bench, bottom leg under it. |
| cph.move | Unieś biodra, aż ciało utworzy prostą linię, a dolną nogę oderwij od podłogi; wytrzymaj. | Lift your hips until your body forms a straight line, bottom leg off the floor; hold. |
| cph.mis.line | Biodra opadają albo uciekają za wysoko — ciało wychodzi z linii. | Hips sagging or hiking too high — the body loses its straight line. |
| renegade.setup | Podpór na hantlach ustawionych pod barkami, nogi proste, stopy na szerokość barków lub szerzej. | Plank on dumbbells set under your shoulders, legs straight, feet shoulder-width or wider. |
| renegade.move | Przyciągnij jeden hantel do boku tułowia, odłóż go spokojnie i zmień rękę. | Row one dumbbell to the side of your torso, set it down with control and switch hands. |
| renegade.mis.twist | Skręcanie bioder i tułowia, żeby dźwignąć hantel. | Twisting the hips and torso to heave the dumbbell up. |
| plyo.move | Zejdź w dół jak w pompce i wypchnij się mocno, aż dłonie oderwą się od podłogi. | Lower as in a push-up, then push up hard enough for your hands to leave the floor. |

Zdania istniejące użyte: `plank.brace`, `plank.noSag`, `plank.mis.sag`, `push.setup` (tylko w kontekstach potwierdzonych wyżej).

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)
| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| ace-309 | https://www.acefitness.org/resources/everyone/exercise-library/309/ | ACE (Roll Out, sztanga, #309) | 4 | 02.11.2026 |
| ace-355 | https://www.acefitness.org/resources/everyone/exercise-library/355/renegade-row/ | ACE (Renegade Row, #355) | 4 | 02.11.2026 |
| barbend-renegade-row | https://www.barbend.com/renegade-row/ | BarBend (J. Boly, CSCS; akt. 26.11.2024) | 4 | 02.11.2026 |
| nfpt-renegade-row | https://nfpt.com/how-to-do-the-renegade-row/ | NFPT — National Federation of Professional Trainers (I. Nimblett, 10.08.2025) — NOWA organizacja | 4 | 02.11.2026 |
| nfpt-copenhagen-plank | https://nfpt.com/the-copenhagen-plank-introducing-a-new-challenge-for-adductor-stabilization/ | NFPT (C. Kronemer, 28.08.2025) | 4 | 02.11.2026 |
| catalyst-ab-rollout | https://catalystathletics.com/exercise/135/Ab-Rollout | Catalyst Athletics — biblioteka ćwiczeń (serwis szkoleniowy) — NOWA organizacja | 4 | 02.11.2026 |
| catalyst-copenhagen-plank | https://catalystathletics.com/exercise/565/Copenhagen-Plank | Catalyst Athletics | 4 | 02.11.2026 |
| echelon-ab-wheel | https://cdn.shopify.com/s/files/1/2422/9487/files/ECHELON-AB-WHEEL-EXERCISE-GUIDE.pdf | Echelon Fitness — instrukcja ćwiczeń do kółka (producent sprzętu, PDF 2021, s. 1) — NOWA organizacja | 4 | 02.11.2026 |
| explife-ab-rollout | https://experiencelife.lifetime.life/?p=31209 | Experience Life (magazyn Life Time; M. Fazeli Fard, trenerka; 05.11.2019) — NOWA organizacja | 4 (propozycja) | 02.11.2026 |
| puregym-ab-wheel | https://www.puregym.com/exercises/abs/ab-wheel-rollouts/ | PureGym — biblioteka ćwiczeń sieci klubów, bez autora — NOWA organizacja, tylko pomocniczo | otwarty (Otwarte 9) | 02.11.2026 |
| coach-plank-shoulder-tap | https://www.coachweb.com/core-exercises/8846/plank-shoulder-tap | Coach (N. Harris-Fry, 18.02.2021; autor bez certyfikatu — inaczej niż opis organizacji w `orgs`) | 4 | 02.11.2026 |
| pfp-tall-plank-shoulder-taps | https://fit-pro.com/article-4275-Tall-plank-shoulder-taps.html | Personal Fitness Professional (fit-pro.com, magazyn branżowy trenerów; B. Schiff, fizjoterapeuta; 01.12.2017) — NOWA organizacja | 4 | 02.11.2026 |
| sats-plank-shoulder-tap | https://www.sats.dk/ovelser/plank-with-shoulder-tap | SATS — biblioteka ćwiczeń sieci klubów — NOWA organizacja, tylko pomocniczo | otwarty (Otwarte 9) | 02.11.2026 |
| e3rehab-copenhagen-plank | https://e3rehab.com/how-to-perform-copenhagen-planks/ | E3 Rehab (serwis edukacyjny fizjoterapeutów; 12.05.2024; autor bez podanych kwalifikacji) — NOWA organizacja | 4 (propozycja) | 02.11.2026 |
| nasm-plyometric-push-up | https://www.nasm.org/resource-center/exercise-library/plyometric-push-up | NASM | 4 | 02.11.2026 |
| repfitness-plyometric | https://repfitness.com/blogs/training/best-plyometric-exercises | REP Fitness (producent sprzętu; ekspert C. Trieu, mgr fizjologii wysiłku) — NOWA organizacja | 4 | 02.11.2026 |
| moore-2012 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4738879 | Moore, Tankovich, Riemann, Davies — Int J Exerc Sci 2012;5(4):334–343 (tylko do Otwartych) | 3 | 02.11.2026 |

Istniejące źródło użyte pomocniczo: `nasm-best-abs` (sekcja Renegade Row: biodra ustawione równo; sekcja Ab Wheel Rollout nie opisuje techniki).

## Otwarte (ćwiczenie/zdanie | powód)
1. **Zestawy ogólne — błędy dopasowania (informacja dla koordynatora):** zestaw „plank” (`plank.setup`: przedramiona, łokcie pod barkami) NIE pasuje do Plank Shoulder Taps (podpór na prostych rękach — Coach, SATS, PFP) ani do Copenhagen Plank (`splank.setup` „stopy jedna na drugiej” — tu górna stopa na ławce). Zestaw „pushup” dla Renegade Row: `push.move` (pompka) potwierdza tylko ACE 355; BarBend i NFPT opisują samo wiosłowanie w podporze. `push.mis.partial` dla Plyo Push-Up — żadne przeczytane źródło. Zestawu „rollout” nie ma w `pl.json`.
2. **Copenhagen Plank — „łokieć pod barkiem”, „zmień stronę”:** pierwsze tylko w wynikach wyszukiwarki ze stron aplikacji; NFPT pisze o przedramieniu, Catalyst nie opisuje ręki. Zmiana strony — żadne z trzech źródeł wprost. Do karty nie weszły.
3. **Copenhagen Plank — oparcie górnej nogi (stopa, podudzie, kolano):** źródła różnią się (NFPT, E3 — stopa; Catalyst — „noga” bez wskazania). Zdanie mówi „stopa” (2 źródła). Wariant z kolanem na ławce to inne ćwiczenie (łatwiejsze).
4. **Renegade Row — pompka między wiosłowaniami:** tylko ACE 355 (NASM Best Abs wymienia ją jako progresję). Jeśli animacja pokazuje pompkę, potrzebny drugi opis wersji z pompką. „Łokieć blisko tułowia” — tylko ACE 355 (strona innej aplikacji się nie liczy).
5. **Rollout (sztanga) — chwyt na szerokość barków, ręce proste:** szerokość chwytu tylko ACE 309; ręce proste tylko Catalyst — poza kartą.
6. **Plyo Push-Up — lądowanie na ugiętych łokciach:** NASM (Step 3; Common Mistakes) wprost; drugiego źródła szczebla 4 nie przeczytałem (strony z tym zdaniem w wynikach to aplikacje albo dawały 403). Badanie Moore 2012 (Protocol) każe „złapać się” na ugiętych łokciach, ale w wariancie lądowania na skrzyniach. Kandydat do uzupełnienia — szukać drugiego opisu.
7. **Drop Push, Incline Push-Up Depth Jump, Plyo Kettlebell Push-Ups:** w wynikach tylko bazy ćwiczeń i aplikacje (nie są źródłem wg uzupełnienia briefu); Moore 2012 opisuje ruch z podłogi na skrzynie (odwrotna kolejność niż Drop Push). Bez kart.
8. **Standing Barbell Rollout, Barbell Rollout from Bench, Suspended Fallout:** Catalyst wspomina wersję stojącą tylko jako opcję („kneel or stand”), bez opisu; wersji z ławki i fallout na taśmach — brak źródła szczebla 4 (strony producenta taśm nie znalazłem w wynikach). Analogia do rolloutu z klęku byłaby „uproszczeniem” — nie wpisuję.
9. **Szczebel bibliotek sieci klubów (PureGym, SATS) i E3 Rehab, Experience Life:** strony bez autora albo autor bez podanych kwalifikacji — to samo pytanie co materiały uczelnianych centrów sportu w docs/33 (pyt. 1). Karty Ab Wheel i Plank Shoulder Taps NIE zależą od PureGym/SATS (każde zdanie ma 2 inne źródła), poza `ptap.setup` (dłonie pod barkami: Coach + SATS; PFP mówi tylko „tall plank”) — jeśli SATS nie zostanie uznany za szczebel 4, skrócić do „Wejdź w podpór na prostych rękach.”. Copenhagen Plank zależy od uznania E3 Rehab tylko w `cph.mis.line` (drugie źródło NFPT jest szczebla 4) — bez zależności. Experience Life jest jednym z trzech źródeł Ab Wheel; każde zdanie karty ma też Catalyst + drugie źródło (Echelon albo Experience Life) — `rollout.range` i `rollout.mis.arch` zależą od Experience Life (Echelon tego nie opisuje).
10. **Echelon** — producent sprzętu z własną aplikacją; użyta wyłącznie instrukcja papierowa do kółka (dokumentacja producenta, dozwolona). Do potwierdzenia przez koordynatora.
11. **Twierdzenia zdrowotne i liczby ze źródeł** (ostrzeżenia o lędźwiach, kontuzje barku, liczby serii/sekund, wysokości skrzyń, tempo 2-1-2) — nie przenoszę.
