# chest_fly (cz. 2: pullovery i inne) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zasada: wskazówka techniki ustalona, gdy zgadzają się ≥ 2 niezależne źródła szczebla 4 i żadne przeczytane nie przeczy
(CLAUDE.md, wyjątek z 25.10.2026). Każde źródło przeczytane 02.11.2026 (WebFetch); ExRx (403) i web.archive.org (zablokowane)
niedostępne; strony innych aplikacji treningowych pominięte (uzupełnienie briefu). Cytaty — tylko wskazanie miejsca.
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — patrz „Korekta szczebli” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Pullover (hantel) | częściowe (bez błędu) | 3 źródła szczebla 4 (ACE, REP Fitness — producent hantli i ławek, BarBend); Breaking Muscle (szczebel 5, nie niezależny od BarBend) usunięty. Błąd `po.mis.hips` — po korekcie tylko BarBend. Zdania z zestawu ogólnego `po.arms` i `mis.jerk` NIE wchodzą (patrz Otwarte); `po.slow` zastąpione `po.lower`. |
| Machine Pullover | otwarte | Przeczytana tylko instrukcja jednego producenta; konstrukcje maszyn się różnią (oś obrotu przy barku albo przy łokciu — wynik wyszukiwania, niepotwierdzony). |
| Bent-Arm Barbell Pullover | otwarte | Brak 2 przeczytanych źródeł szczebla 4 (strony 403/404 albo aplikacje). |
| Wide-Grip Decline Barbell Pullover | otwarte | Brak przeczytanych źródeł dla wariantu; analogia do pullovera z hantlem byłaby „uproszczeniem” (inny sprzęt, ławka w dół). |
| Front Raise And Pullover | otwarte | Brak 2 przeczytanych źródeł szczebla 4. Uwaga: z wyników wyszukiwania (niepotwierdzone) ruch zaczyna się ze sztangą na udach — wtedy `po.slow` („wracaj nad klatkę”) z obecnego zestawu nie pasuje. |
| Svend Press | otwarte | Po korekcie tylko BarBend (magazyn Oxygen → szczebel 5: bez autora i daty). |
| Around The Worlds | otwarte | Znalezione tylko strony aplikacji i serwisy niskiej jakości. |
| Crucifix | otwarte | To utrzymanie ciężarów w bok na prostych rękach (izometria, tradycja strongmanów), nie wznosy. Przeczytane 1 źródło (szczebla 5); drugi znaleziony serwis tego samego autora (niezależność brak). Obecny zestaw `raiseSide` (`lat.height` „Unoś…”, `plank.mis.breath`) nie jest potwierdzony dla tego ćwiczenia. |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

```json
{
 "Pullover (hantel)": {
  "setup": [
   {"c": "po.dbSetup", "s": [
    ["repfitness-db-pullover", "How to do dumbbell pullovers (dumbbell stood on end, top cupped with both hands, pressed up; feet on floor; base version across the bench, lying along it as alternative)"],
    ["barbend-db-pullover", "Step 1 — The Set-Up (lie face up, feet planted, one end of the dumbbell held with both hands over the chest)"]
   ]}
  ],
  "move": [
   {"c": "po.move", "s": [
    ["ace-37", "Instructions (arms straight above the chest, lowered back over the head, then brought back to the start)"],
    ["repfitness-db-pullover", "How to do dumbbell pullovers (lower behind the head to a lat stretch, pull back up over the head)"],
    ["barbend-db-pullover", "Step 2 — Reach Backwards; Step 3 — Raise the Load and Repeat"]
   ]}
  ],
  "tips": [
   {"c": "front.elbows", "s": [
    ["barbend-db-pullover", "Step 1–3 (elbows slightly bent through all phases)"],
    ["repfitness-db-pullover", "How to do dumbbell pullovers (arms nearly straight, only a little elbow bend)"],
    ["ace-37", "Instructions (keep the elbows straight — wariant „proste” z tego samego zdania)"]
   ]},
   {"c": "po.lower", "s": [
    ["ace-37", "Instructions (slowly lower the arms back over the head)"],
    ["repfitness-db-pullover", "How to do dumbbell pullovers (lower slowly; until a full lat stretch)"],
    ["barbend-db-pullover", "Step 2 (only as far as comfortable, until a stretch in chest and lats); Mistakes — Forcing Your Range of Motion"]
   ]}
  ],
  "mistakes": []
 }
}
```

## Nowe zdania (id | PL | EN)

Zdania oznaczone „(nieużyte)” po korekcie z 02.11.2026 nie występują w bloku JSON — propozycje do czasu znalezienia drugiego źródła szczebla 4.

| id | PL | EN |
|---|---|---|
| po.dbSetup | Połóż się plecami na ławce (wzdłuż albo w poprzek), stopy na podłodze; chwyć hantel oburącz za jeden koniec i trzymaj go nad klatką. | Lie back on a bench (along or across it), feet on the floor; hold one end of the dumbbell with both hands above your chest. |
| po.move | Opuść hantel łukiem za głowę, aż poczujesz rozciągnięcie; wróć tym samym łukiem nad klatkę. | Lower the dumbbell in an arc behind your head until you feel a stretch; bring it back over your chest along the same arc. |
| po.lower | Opuszczaj ciężar powoli i tylko do wyraźnego rozciągnięcia — nie dalej na siłę. | Lower the weight slowly and only until you feel a clear stretch — don't force it further. |
| po.mis.hips (nieużyte) | Odrywanie bioder od ławki. | Lifting the hips off the bench. |
| svend.setup (nieużyte) | Stań prosto i ściśnij dwa małe talerze między dłońmi przy klatce. | Stand tall and squeeze two small plates between your palms at your chest. |
| svend.move (nieużyte) | Wypchnij talerze prosto przed siebie do wyprostu rąk, potem powoli wróć do klatki. | Press the plates straight out in front of you until your arms are extended, then slowly bring them back to your chest. |
| svend.squeeze (nieużyte) | Ściskaj talerze dłońmi przez cały ruch. | Keep squeezing the plates together throughout the move. |
| svend.mis.fast (nieużyte) | Za szybkie powtórzenia. | Rushing the reps. |

Istniejące zdanie użyte: `front.elbows` („Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch.”) — pasuje do pullovera:
źródła różnią się (ACE: proste; BarBend i REP Fitness: lekko ugięte), część wspólna = proste lub lekko ugięte, stały kąt.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| ace-37 | https://www.acefitness.org/resources/everyone/exercise-library/37/lying-pullovers/ | ACE (istniejąca) | 4 | 02.11.2026 |
| repfitness-db-pullover | https://repfitness.com/blogs/guides/how-to-do-dumbbell-pullovers | REP Fitness — poradnik producenta hantli i ławek (własny rodzaj sprzętu; J. Sanchez, 12.11.2024 / 03.08.2026; nowa org., kind: maker) | 4 | 02.11.2026 |
| barbend-db-pullover | https://barbend.com/dumbbell-pullover/ | BarBend (istniejąca; artykuł o technice) | 4 | 02.11.2026 |
| breakingmuscle-db-pullover | https://breakingmuscle.com/dumbbell-pullover/ | Breaking Muscle (istniejąca; autor DPT, CSCS; nigdy niezależny od BarBend) | 5 | 02.11.2026 |
| barbend-svend-press | https://barbend.com/svend-press/ | BarBend (istniejąca; artykuł o technice) | 4 | 02.11.2026 |
| oxygen-svend-press | https://www.oxygenmag.com/training-tips-for-women/exercises-by-bodypart-for-women/shoulder-exercises-for-women/svend-press-11797/ | Oxygen Magazine — magazyn fitness (bez autora i daty na stronie; 02.11.2026 strona przekierowuje do logowania) | 5 | 02.11.2026 |

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Pullover (hantel) / `po.mis.hips` (wycofane z bloku 02.11.2026) | po korekcie tylko BarBend (Common Mistakes — Shooting the Hips off the Bench); Breaking Muscle (Common Mistakes — Losing Contact with the Bench) → szczebel 5 i ten sam właściciel co BarBend. Potrzebne drugie niezależne źródło szczebla 4. |
| Pullover (hantel) / `po.arms` („Ręce proste przez cały ruch”) | Przeczy mu BarBend (Step 1–3), Breaking Muscle (form tips) i REP Fitness (lekkie ugięcie); zastąpione `front.elbows`. |
| Pullover (hantel) / `po.slow` | Druga część („tak samo powoli wracaj”) wprost tylko w ACE; zastąpione `po.lower`. |
| Pullover (hantel) / `mis.jerk` | Żadne przeczytane źródło nie wymienia szarpania jako błędu (mówią „powoli”, „z kontrolą”) — nie wpisane. |
| Pullover (hantel) / błąd „zginanie i prostowanie łokci (ruch jak wyprost na triceps)” | Breaking Muscle (szczebel 5) i strona sieci siłowni (gymnation.com, „Personal Trainer Notes”, FAQ; sieci siłowni — szczebel 5) — brak źródła szczebla 4. |
| Pullover (hantel) / oddech (wdech przy opuszczaniu, wydech przy powrocie) | Tylko 1 źródło (gymnation.com, kroki 4 i 6; szczebel 5). |
| Machine Pullover | Przeczytana instrukcja Life Fitness Pro Series SU60 (manualsdir.com, s. 22: siedzisko tak, by oś obrotu była na linii barków; łokcie na podkładkach; nie pchać drążka dłońmi; powolny powrót) — 1 źródło (szczebel 4, kopia instrukcji producenta); druga próba (Panatta) 403. |
| Bent-Arm Barbell Pullover | Strony z instrukcją niedostępne (bodybuilding.com 404, muscleandstrength.com 403 — i tak szczebel otwarty wg rozstrzygnięcia) albo strony aplikacji. |
| Wide-Grip Decline Barbell Pullover | Brak źródeł dla wariantu. |
| Front Raise And Pullover | Brak źródeł szczebla 4 (wyniki: aplikacje, agregatory, muscleandstrength.com 403). Sprawdzić przebieg (start ze sztangą na udach?) przed doborem zdań. |
| Around The Worlds | Brak źródeł szczebla 4. |
| Crucifix | Breaking Muscle (szczebel 5; L. Christopher, sekcje „Variations”, „Start Light”): ciężary trzymane w bok na wyprostowanych rękach, przy większym ciężarze najwyżej lekkie ugięcie łokci. Drugie źródło tego samego autora (legendarystrength.com) — nie niezależne. Obecny zestaw (`lat.height`, `front.elbows`, `plank.mis.breath`) — niepotwierdzony; ćwiczenie to utrzymanie, nie wznosy. |
| Svend Press — `svend.setup`, `svend.move`, `svend.squeeze`, `svend.mis.fast` (wycofane z bloku 02.11.2026) | po korekcie tylko BarBend (How to — Step 1–2; Common Mistakes — Not Squeezing the Plates, Rushing the Reps); Oxygen → szczebel 5. Potrzebne drugie źródło szczebla 4. |
| Svend Press / ustawienie łokci (ramiona poziomo) i blokowanie łokci na końcu | Łokcie poziomo tylko Oxygen; „fully locked out” tylko BarBend — nie wpisane. |

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria (a)(b)(c); BarBend i Breaking Muscle — jeden właściciel).
Strony REP Fitness i Oxygen sprawdzone ponownie przez WebFetch 02.11.2026 (autor, data, charakter); bez nowych badań treści.
Przy REP Fitness odczytano miejsce o lekkim ugięciu łokci (wcześniej opisane w „Otwarte”) i dopisano je jako źródło `front.elbows`.

Źródła:
- breakingmuscle-db-pullover (Breaking Muscle): 4 → 5 (rozstrzygnięcie; nigdy niezależny od BarBend); usunięty z list `s`.
- oxygen-svend-press (Oxygen Magazine): 4 → 5 — brak autora i daty, brak recenzji eksperckiej; strona przekierowuje do logowania (nie da się ponownie sprawdzić).
- gymnation.com (tylko w „Otwarte”): do oceny → 5 (sieci siłowni).
- repfitness-db-pullover (REP Fitness): 4 → 4 — producent hantli i ławek (własny rodzaj sprzętu dla pullovera z hantlem), autor i data.
- barbend-db-pullover, barbend-svend-press: 4 → 4 (artykuły o technice).
- ace-37: 4 → 4.

Ćwiczenia:
- Pullover (hantel): gotowe → częściowe (bez błędu; `po.mis.hips` wycofane).
- Svend Press: gotowe → otwarte.
- Pozostałe 6 ćwiczeń: otwarte → otwarte.
