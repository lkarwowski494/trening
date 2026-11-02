# chest_fly (cz. 2: pullovery i inne) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zasada: wskazówka techniki ustalona, gdy zgadzają się ≥ 2 niezależne źródła szczebla 4 i żadne przeczytane nie przeczy
(CLAUDE.md, wyjątek z 25.10.2026). Każde źródło przeczytane 02.11.2026 (WebFetch); ExRx (403) i web.archive.org (zablokowane)
niedostępne; strony innych aplikacji treningowych pominięte (uzupełnienie briefu). Cytaty — tylko wskazanie miejsca.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Pullover (hantel) | gotowe | 4 źródła (ACE, producent sprzętu, 2 serwisy). Zdania z zestawu ogólnego `po.arms` i `mis.jerk` NIE wchodzą (patrz Otwarte); `po.slow` zastąpione `po.lower`. |
| Machine Pullover | otwarte | Przeczytana tylko instrukcja jednego producenta; konstrukcje maszyn się różnią (oś obrotu przy barku albo przy łokciu — wynik wyszukiwania, niepotwierdzony). |
| Bent-Arm Barbell Pullover | otwarte | Brak 2 przeczytanych źródeł szczebla 4 (strony 403/404 albo aplikacje). |
| Wide-Grip Decline Barbell Pullover | otwarte | Brak przeczytanych źródeł dla wariantu; analogia do pullovera z hantlem byłaby „uproszczeniem” (inny sprzęt, ławka w dół). |
| Front Raise And Pullover | otwarte | Brak 2 przeczytanych źródeł szczebla 4. Uwaga: z wyników wyszukiwania (niepotwierdzone) ruch zaczyna się ze sztangą na udach — wtedy `po.slow` („wracaj nad klatkę”) z obecnego zestawu nie pasuje. |
| Svend Press | gotowe | 2 źródła (BarBend, magazyn Oxygen); karta krótka. |
| Around The Worlds | otwarte | Znalezione tylko strony aplikacji i serwisy niskiej jakości. |
| Crucifix | otwarte | To utrzymanie ciężarów w bok na prostych rękach (izometria, tradycja strongmanów), nie wznosy. Przeczytane 1 źródło; drugi znaleziony serwis tego samego autora (niezależność brak). Obecny zestaw `raiseSide` (`lat.height` „Unoś…”, `plank.mis.breath`) nie jest potwierdzony dla tego ćwiczenia. |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

```json
{
 "Pullover (hantel)": {
  "setup": [
   {"c": "po.dbSetup", "s": [
    ["repfitness-db-pullover", "How to do dumbbell pullovers (dumbbell stood on end, top cupped with both hands, pressed up; feet on floor; base version across the bench, lying along it as alternative)"],
    ["barbend-db-pullover", "Step 1 — The Set-Up (lie face up, feet planted, one end of the dumbbell held with both hands over the chest)"],
    ["breakingmuscle-db-pullover", "Step 1 (head, shoulder blades, glutes on the bench, both feet on the floor); Step 2 (dumbbell held with both hands above the upper chest)"]
   ]}
  ],
  "move": [
   {"c": "po.move", "s": [
    ["ace-37", "Instructions (arms straight above the chest, lowered back over the head, then brought back to the start)"],
    ["repfitness-db-pullover", "How to do dumbbell pullovers (lower behind the head to a lat stretch, pull back up over the head)"],
    ["barbend-db-pullover", "Step 2 — Reach Backwards; Step 3 — Raise the Load and Repeat"],
    ["breakingmuscle-db-pullover", "Steps 2–4 (lower with control to the deepest tolerated stretch, reverse the same arc until the upper arms are vertical)"]
   ]}
  ],
  "tips": [
   {"c": "front.elbows", "s": [
    ["barbend-db-pullover", "Step 1–3 (elbows slightly bent through all phases)"],
    ["breakingmuscle-db-pullover", "Mistakes and form tips (slight, consistent bend; elbows do not bend and straighten)"],
    ["ace-37", "Instructions (keep the elbows straight — wariant „proste” z tego samego zdania)"]
   ]},
   {"c": "po.lower", "s": [
    ["ace-37", "Instructions (slowly lower the arms back over the head)"],
    ["repfitness-db-pullover", "How to do dumbbell pullovers (lower slowly; until a full lat stretch)"],
    ["barbend-db-pullover", "Step 2 (only as far as comfortable, until a stretch in chest and lats); Mistakes — Forcing Your Range of Motion"],
    ["breakingmuscle-db-pullover", "Step 3 (lower with control to the deepest stretch you can tolerate)"]
   ]}
  ],
  "mistakes": [
   {"c": "po.mis.hips", "s": [
    ["barbend-db-pullover", "Common Mistakes — Shooting the Hips off the Bench"],
    ["breakingmuscle-db-pullover", "Common Mistakes — Losing Contact with the Bench (hips rising / back arching)"]
   ]}
  ]
 },
 "Svend Press": {
  "setup": [
   {"c": "svend.setup", "s": [
    ["barbend-svend-press", "How to — Step 1: Pinch the Plates (stand tall, two small plates pinched together with both hands against the chest)"],
    ["oxygen-svend-press", "Instructions (two small plates pressed together between the palms at chest height)"]
   ]}
  ],
  "move": [
   {"c": "svend.move", "s": [
    ["barbend-svend-press", "How to — Step 2: Press Upwards and Inwards (keep squeezing, extend the arms straight out, slightly upward)"],
    ["oxygen-svend-press", "Instructions (extend the arms, push the plates straight out from the chest, lower slowly back to the start)"]
   ]}
  ],
  "tips": [
   {"c": "svend.squeeze", "s": [
    ["barbend-svend-press", "Step 2 (keep the plates squeezed together); Common Mistakes — Not Squeezing the Plates"],
    ["oxygen-svend-press", "Instructions (plates pressed together between the palms through the move)"]
   ]}
  ],
  "mistakes": [
   {"c": "svend.mis.fast", "s": [
    ["barbend-svend-press", "Common Mistakes — Rushing the Reps"],
    ["oxygen-svend-press", "Instructions (slow reps)"]
   ]}
  ]
 }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| po.dbSetup | Połóż się plecami na ławce (wzdłuż albo w poprzek), stopy na podłodze; chwyć hantel oburącz za jeden koniec i trzymaj go nad klatką. | Lie back on a bench (along or across it), feet on the floor; hold one end of the dumbbell with both hands above your chest. |
| po.move | Opuść hantel łukiem za głowę, aż poczujesz rozciągnięcie; wróć tym samym łukiem nad klatkę. | Lower the dumbbell in an arc behind your head until you feel a stretch; bring it back over your chest along the same arc. |
| po.lower | Opuszczaj ciężar powoli i tylko do wyraźnego rozciągnięcia — nie dalej na siłę. | Lower the weight slowly and only until you feel a clear stretch — don't force it further. |
| po.mis.hips | Odrywanie bioder od ławki. | Lifting the hips off the bench. |
| svend.setup | Stań prosto i ściśnij dwa małe talerze między dłońmi przy klatce. | Stand tall and squeeze two small plates between your palms at your chest. |
| svend.move | Wypchnij talerze prosto przed siebie do wyprostu rąk, potem powoli wróć do klatki. | Press the plates straight out in front of you until your arms are extended, then slowly bring them back to your chest. |
| svend.squeeze | Ściskaj talerze dłońmi przez cały ruch. | Keep squeezing the plates together throughout the move. |
| svend.mis.fast | Za szybkie powtórzenia. | Rushing the reps. |

Istniejące zdanie użyte: `front.elbows` („Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch.”) — pasuje do pullovera:
źródła różnią się (ACE: proste; trzy pozostałe: lekko ugięte), część wspólna = proste lub lekko ugięte, stały kąt.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| ace-37 | https://www.acefitness.org/resources/everyone/exercise-library/37/lying-pullovers/ | ACE (istniejąca) | 4 | 02.11.2026 |
| repfitness-db-pullover | https://repfitness.com/blogs/guides/how-to-do-dumbbell-pullovers | REP Fitness — poradniki producenta sprzętu (nowa org., kind: maker) | 4 | 02.11.2026 |
| barbend-db-pullover | https://barbend.com/dumbbell-pullover/ | BarBend (istniejąca) | 4 | 02.11.2026 |
| breakingmuscle-db-pullover | https://breakingmuscle.com/dumbbell-pullover/ | Breaking Muscle (istniejąca; autor DPT, CSCS) | 4 | 02.11.2026 |
| barbend-svend-press | https://barbend.com/svend-press/ | BarBend (istniejąca) | 4 | 02.11.2026 |
| oxygen-svend-press | https://www.oxygenmag.com/training-tips-for-women/exercises-by-bodypart-for-women/shoulder-exercises-for-women/svend-press-11797/ | Oxygen Magazine — magazyn fitness (nowa org., kind: site; bez autora na stronie) | 4 | 02.11.2026 |

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Pullover (hantel) / `po.arms` („Ręce proste przez cały ruch”) | Przeczy mu BarBend (Step 1–3), Breaking Muscle (form tips) i REP Fitness (lekkie ugięcie); zastąpione `front.elbows`. |
| Pullover (hantel) / `po.slow` | Druga część („tak samo powoli wracaj”) wprost tylko w ACE; zastąpione `po.lower`. |
| Pullover (hantel) / `mis.jerk` | Żadne przeczytane źródło nie wymienia szarpania jako błędu (mówią „powoli”, „z kontrolą”) — nie wpisane. |
| Pullover (hantel) / błąd „zginanie i prostowanie łokci (ruch jak wyprost na triceps)” | Breaking Muscle wprost; drugie źródło to strona sieci siłowni (gymnation.com, „Personal Trainer Notes”, FAQ) — szczebel do oceny (4 czy 5). Po uznaniu za szczebel 4 → nowe zdanie `po.mis.elbows`. |
| Pullover (hantel) / oddech (wdech przy opuszczaniu, wydech przy powrocie) | Tylko 1 źródło (gymnation.com, kroki 4 i 6). |
| Machine Pullover | Przeczytana instrukcja Life Fitness Pro Series SU60 (manualsdir.com, s. 22: siedzisko tak, by oś obrotu była na linii barków; łokcie na podkładkach; nie pchać drążka dłońmi; powolny powrót) — 1 źródło; druga próba (Panatta) 403. |
| Bent-Arm Barbell Pullover | Strony z instrukcją niedostępne (bodybuilding.com 404, muscleandstrength.com 403) albo strony aplikacji. |
| Wide-Grip Decline Barbell Pullover | Brak źródeł dla wariantu. |
| Front Raise And Pullover | Brak źródeł szczebla 4 (wyniki: aplikacje, agregatory, muscleandstrength.com 403). Sprawdzić przebieg (start ze sztangą na udach?) przed doborem zdań. |
| Around The Worlds | Brak źródeł szczebla 4. |
| Crucifix | Breaking Muscle (L. Christopher, sekcje „Variations”, „Start Light”): ciężary trzymane w bok na wyprostowanych rękach, przy większym ciężarze najwyżej lekkie ugięcie łokci. Drugie źródło tego samego autora (legendarystrength.com) — nie niezależne. Obecny zestaw (`lat.height`, `front.elbows`, `plank.mis.breath`) — niepotwierdzony; ćwiczenie to utrzymanie, nie wznosy. |
| Svend Press / ustawienie łokci (ramiona poziomo) i blokowanie łokci na końcu | Łokcie poziomo tylko Oxygen; „fully locked out” tylko BarBend — nie wpisane. |
| BarBend i Breaking Muscle — niezależność | Repo traktuje je jako niezależne (wiersz Pendlay Row); przy pullowerze reguły i tak mają też ACE albo REP Fitness, poza `po.mis.hips` (tylko te dwa). Do sprawdzenia, czy nie należą do tego samego wydawcy. |
