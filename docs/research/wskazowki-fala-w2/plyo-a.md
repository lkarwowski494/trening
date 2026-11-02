# Wskazówki techniki — rodzina plyo, część A (fala W2, G3)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W2, G3, plyo — część A). Zadanie: tylko zbieranie danych — nic nie trafia do
`data/zrodla/cues.json` ani `lib/`; integruje koordynator linii 1.1. Stan wyjściowy: pliki W1 `plyo-cz1.md` i `plyo-cz2.md`, sekcje
„Korekta szczebli — przeliczenie koordynatora 02.11.2026” (tylko te sekcje są wiążące).

Metoda: wyjątek dla wskazówek techniki (CLAUDE.md) — ustawienie i ruch: 2 niezależne źródła szczebla 4 albo 1 szczebla 3; błędy: 2 źródła
szczebla ≤ 4, reguła „błąd = zaprzeczenie standardu” (uzup. 2 pliku szczebli) albo błąd wnioskowany `["wniosek", "<id zdania>"]`.
Liczby ze źródeł (wysokości pachołków i płotków, odległości, czasy, serie) i twierdzenia o zdrowiu pominięte. Strony innych aplikacji
treningowych odrzucone bez zapisu nazw.

## 1. Ćwiczenia — stan po W2

| Klucz | Stan po W1 (przeliczenie) | Stan po W2 | Co dodano |
|---|---|---|---|
| Depth Jump | własna bez błędów | **własna z błędami** | 2 błędy wnioskowane: `plyo.depth.mis.jumpOff` (z `plyo.depthStep`; do oceny recenzenta — patrz §2), `plyo.depth.mis.pause` (z `plyo.depthRebound`; też Catalyst #551 + Louder 2015 jako „błąd = zaprzeczenie standardu”) |
| Alternate Leg Push-Off | własna bez błędów | **własna z błędami** | 1 błąd wnioskowany `plyo.altPushoff.mis.noSwitch` (z `plyo.altPushoff.move`; ACE #246 + inSPORTline podają standard) |
| Lateral Cone Hops | otwarta (tylko ruch) | **własna z błędami** | ustawienie `plyo.coneLat.stand` (ACE #120 + PEP); ruch `plyo.coneLat.hop` (+ PEP jako 3. źródło); `jump.land` (ACE + PEP); błąd `jump.mis.stiff` (ACE + PEP, „błąd = zaprzeczenie standardu”) |
| Front Cone Hops | otwarta (brak ustawienia) | **własna z błędami — warunkowo** | ruch `plyo.coneFwd.hop1` (ACE #118 + PEP); ustawienie `plyo.coneFwd.stand` — ACE wprost, PEP tylko pośrednio; `jump.land` (ACE + PEP); błąd `jump.mis.stiff` (ACE + PEP wprost) |
| Single-Leg Lateral Hop | otwarta | **własna z błędami — jedno źródło (szczebel 3)** | ustawienie `plyo.slLatHop.stand` i ruch `plyo.slLatHop.hop` — Greisberg i in. 2019 (opis „side hop test” w metodach); uproszczenie: linia zamiast pachołka; błąd wnioskowany `plyo.mis.twoFeetLand` |
| Lateral Bound | otwarta | **własna z błędami — jedno źródło (szczebel 3)** | ustawienie `plyo.latBound.setup` i ruch `plyo.latBound.move` — Waldhelm i in. 2022 (opis „lateral bound test” w metodach); uproszczenie: pojedynczy skok testu = jedno powtórzenie ćwiczenia; błąd wnioskowany `plyo.mis.twoFeetLand` |
| Lateral Box Jump | otwarta (tylko ISSA) | otwarta | drugiego źródła szczebla 4 nie znaleziono (§6) |
| Dumbbell Seated Box Jump | otwarta | otwarta | nadal tylko Catalyst #552 dla siadu; źródła Box Jump nie wystarczą (§6) |
| Star Jump | otwarta (NHS = 1 źródło) | otwarta | brak drugiego źródła (§6) |
| Bench Jump | otwarta | otwarta | najpierw definicja ruchu (decyzja analityka, W1) — nie szukano ponownie |
| Frog Hops | otwarta | otwarta | nie szukano ponownie (limit kontekstu; W1 — same strony szczebla 5) |
| Kneeling Jump Squat | otwarta | otwarta | badania z opisem skoku z klęku nie znalazłem (1 wyszukiwanie) |

Tuck Jump — gotowe po W1, pominięte zgodnie z poleceniem.

## 2. Uzasadnienia

**Depth Jump — błędy wnioskowane.**
- `plyo.depth.mis.jumpOff` = zaprzeczenie `plyo.depthStep` („Zejdź ze skrzyni krokiem w przód”). Zmienia wykonanie (podskok podnosi wysokość spadku),
  rysunek: figura wybijająca się w górę z krawędzi skrzyni. **Do oceny recenzenta:** ISSA (plyo guide, 05.02.2024) pisze potocznie „Jump off a box” —
  ta sama różnica, co przy `plyo.depthStep` w W1 (rozstrzygnięta na rzecz kroku: Catalyst #551, Louder i in. 2015 — szczebel 3, inSPORTline). Jeśli
  recenzent uzna, że zdanie ISSA przeczy błędowi — wycofać; karta zostaje z błędem `plyo.depth.mis.pause`.
- `plyo.depth.mis.pause` = zaprzeczenie `plyo.depthRebound`. Standard wprost: Catalyst #551 („Arrest the downward motion as quickly as possible and drive
  straight back up…”) i Louder i in. 2015 (Methods: polecenie „as quick as possible”). Ta sama faza i kryterium (czas kontaktu) → też „błąd = zaprzeczenie standardu”.

**Alternate Leg Push-Off.** `plyo.altPushoff.mis.noSwitch` = zaprzeczenie `plyo.altPushoff.move`. Standard wprost: ACE #246 Step 3 („as you are in the air
quickly swing your left leg forward and your right leg back”) i inSPORTline s. 3 (ALTERNATING PUSH-OFF, Action). Bez zmiany nóg to inny ruch (push-off jednonóż);
rysunek: ta sama stopa wraca na skrzynię. `jump.mis.stiff` nadal tylko ACE (Step 4: „Avoid locking out your knees or quads on your landing…”) — nie wpisane.

**Lateral Cone Hops.** Nowe źródło szczebla 4: program PEP (Santa Monica Sports Medicine Research Foundation; dokument firmowany, udostępniony przez UC Davis Health),
sekcja III A: „Stand with a 2" cone to your left.”; „Hop to the left over the cone softly landing on the balls of your feet land bending at the knee.”
- `plyo.coneLat.stand`: ACE #120 Step 1 (stań kilka cali na lewo od pierwszego pachołka) + PEP III A. ACE ma rząd pachołków, PEP i NISMAT jeden — zdanie bez rzędu.
- `plyo.coneLat.hop` (W1: ACE + NISMAT „Jump with both feet sideways over the cone, then back.”) — PEP III A jako trzecie źródło.
- `jump.land`: ACE #120 Step 5 + PEP III A (oraz wstęp sekcji III: lądowanie miękkie, „with a bent knee and a bent hip”).
- `jump.mis.stiff`: ACE #120 Step 5 („Avoid locking your knees or quads on your landing…”) + PEP III A (standard: lądowanie z ugięciem kolan) — „błąd = zaprzeczenie standardu”.

**Front Cone Hops.** PEP III B „Forward/Backward Hops over cone”: „Hop over the cone softly landing on the balls of your feet and bending at the knee.”;
„Be careful not to snap your knee back to straighten it.” PEP to wariant przód–tył nad jednym pachołkiem; ACE #118 — w przód nad rzędem.
- `plyo.coneFwd.hop1`: ACE #118 Step 3 („explode forward and upwards … over the top of the first cone”) + PEP III B. Bez rzędu (W1 `plyo.coneFwd.hop` stało na BFS — bez szczebla).
- `plyo.coneFwd.stand`: ACE #118 Step 1 („Stand 6" behind the first cone…”) wprost; PEP ustawienia nie opisuje (wynika tylko z polecenia skoku w przód nad pachołkiem).
  **Warunkowo** — bez uznania wynikania karta otwarta.
- `jump.land`: ACE #118 Step 5 + PEP III B. `jump.mis.stiff`: ACE #118 Step 5 (bez blokowania kolan — odczyt W1) + PEP III B (błąd wprost).

**Single-Leg Lateral Hop.** Greisberg i in. 2019 (J Am Acad Orthop Surg Glob Res Rev, recenzowane; szczebel 3), Methods, „Side Hop (SH) Test”: badany
„stands on one foot, adjacent to a line on the ground” i skacze „back and forth across that line on the tested leg only” (tempo i limit powtórzeń pominięte).
Uproszczenie: linia zamiast pachołka (ten sam ruch — skok jednonóż w bok i z powrotem; przeszkoda zmienia tylko wysokość). PEP III A wspomina tylko „Progress
to Single leg hops” — za mało, by liczyć. Błąd `plyo.mis.twoFeetLand` = zaprzeczenie `plyo.slLatHop.hop` („cały czas na tej samej nodze”); rysunek: obie stopy na ziemi.

**Lateral Bound.** Waldhelm i in. 2022 (Int J Sports Phys Ther 17(3):466–473; szczebel 3), Methods: badany ma „jump from the starting position on one leg”
w bok nad niskim płotkiem i „land on the target with the opposite leg”. Uproszczenie: test to pojedynczy skok; ćwiczenie powtarza go w obie strony. Wysokość płotka
pominięta — zdanie bez płotka. Błąd `plyo.mis.twoFeetLand` = zaprzeczenie `plyo.latBound.move` („wyląduj na drugiej [nodze]”).

## 3. Blok

### Blok do wdrożenia

Źródła z W1 użyte bez zmian (definicje w blokach W1): `catalyst-551`, `pmc-4723169`, `insportline-qt1005`, `ace-246`, org `inSPORTline`, `Catalyst Athletics`,
`Louder, Bressel, Bressel (Utah State University)`. Karty Depth Jump i Alternate Leg Push-Off = zdania z bloków W1 po przeliczeniu + nowe błędy.

```json
{
 "orgs": {
  "Santa Monica Sports Medicine Research Foundation": {"name": "Santa Monica Sports Medicine Research Foundation — program PEP (dokument firmowany; kopia udostępniona przez UC Davis Health)", "level": 4, "kind": "medical"},
  "NISMAT": {"name": "Nicholas Institute of Sports Medicine and Athletic Trauma (Lenox Hill Hospital) — opisy ćwiczeń firmowane przez instytut", "level": 4, "kind": "medical"},
  "Greisberg i in. (JAAOS Glob Res Rev 2019)": {"name": "Greisberg, Gould, Vosseller, Greisberg, Bandasak, Dolar, Ahmad — badanie, J Am Acad Orthop Surg Glob Res Rev 2019 (użyty tylko opis wykonania testu)", "level": 3, "kind": "study"},
  "Waldhelm i in. (IJSPT 2022)": {"name": "Waldhelm, Allen, Grand, Bopp, Foster, Muckridge, Schwarz — badanie, Int J Sports Phys Ther 2022 (użyty tylko opis wykonania testu)", "level": 3, "kind": "study"}
 },
 "sources": {
  "ace-118": {"org": "ACE", "title": "Forward Cone Jumps (#118)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/", "level": 4},
  "ace-120": {"org": "ACE", "title": "Lateral Cone Jumps (#120)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/", "level": 4},
  "pep-program": {"org": "Santa Monica Sports Medicine Research Foundation", "title": "The PEP Program: Prevent injury and Enhance Performance — Section III: Plyometrics", "url": "https://health.ucdavis.edu/media-resources/sports-medicine/documents/pdfs/pep-program.pdf", "level": 4},
  "nismat-lat-jump-cone": {"org": "NISMAT", "title": "Lateral jump over cone (26.05.2020)", "url": "https://nismat.org/2020/05/26/lateral-jump-over-cone/", "level": 4},
  "pmc-6365302": {"org": "Greisberg i in. (JAAOS Glob Res Rev 2019)", "title": "Performance Function Tests in Assessing Ankle Fitness (2019)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6365302/", "level": 3},
  "pmc-8975571": {"org": "Waldhelm i in. (IJSPT 2022)", "title": "Reliability and Differences Between Sexes in Landing Mechanics when Performing the Lateral Bound Test (IJSPT 2022;17(3):466–473)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8975571/", "level": 3}
 },
 "exercises": {
  "Depth Jump": {
   "setup": [
    {"c": "plyo.depthStep", "s": [["catalyst-551", "Instructions (stand at the front edge of a box … step off)"], ["pmc-4723169", "Methods (subjects were asked to step forward off the box)"], ["insportline-qt1005", "s. 3, SQUAT DEPTH JUMP, Action (Step off the box)"]]}
   ],
   "move": [
    {"c": "plyo.depthRebound", "s": [["catalyst-551", "Instructions (land on the balls of both feet … drive straight back up)"], ["pmc-4723169", "Methods (subsequent vertical jump; cues: as high / as quick as possible)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "plyo.depth.mis.jumpOff", "s": [["wniosek", "plyo.depthStep"]]},
    {"c": "plyo.depth.mis.pause", "s": [["wniosek", "plyo.depthRebound"], ["catalyst-551", "Instructions (arrest the downward motion as quickly as possible) — błąd = zaprzeczenie standardu"], ["pmc-4723169", "Methods (cue: as quick as possible) — błąd = zaprzeczenie standardu"]]}
   ]
  },
  "Alternate Leg Push-Off": {
   "setup": [
    {"c": "plyo.pushoff.setup", "s": [["ace-246", "Step 1"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Start"]]}
   ],
   "move": [
    {"c": "plyo.altPushoff.move", "s": [["ace-246", "Step 2–3"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Action"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "plyo.altPushoff.mis.noSwitch", "s": [["wniosek", "plyo.altPushoff.move"], ["ace-246", "Step 3 (swing legs in the air; lead foot lands on the box) — błąd = zaprzeczenie standardu"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF, Action — błąd = zaprzeczenie standardu"]]}
   ]
  },
  "Lateral Cone Hops": {
   "setup": [
    {"c": "plyo.coneLat.stand", "s": [["ace-120", "Step 1 (stand a few inches to the left of the first cone)"], ["pep-program", "Section III A, Instruction (stand with a cone to your left)"]]}
   ],
   "move": [
    {"c": "plyo.coneLat.hop", "s": [["ace-120", "Step 3 (jump sideways and up over the first cone)"], ["nismat-lat-jump-cone", "opis (jump with both feet sideways over the cone, then back)"], ["pep-program", "Section III A, Instruction (hop to the left over the cone … repeat hopping to the right)"]]}
   ],
   "tips": [
    {"c": "jump.land", "s": [["ace-120", "Step 5 (land softly; avoid locking your knees)"], ["pep-program", "Section III A (softly landing … bending at the knee); wstęp sekcji III (landing must be soft)"]]}
   ],
   "mistakes": [
    {"c": "jump.mis.stiff", "s": [["ace-120", "Step 5 (avoid locking your knees or quads on your landing)"], ["pep-program", "Section III A (land bending at the knee) — błąd = zaprzeczenie standardu"]]}
   ]
  },
  "Front Cone Hops": {
   "setup": [
    {"c": "plyo.coneFwd.stand", "s": [["ace-118", "Step 1 (stand behind the first cone)"], ["pep-program", "Section III B (hop over the cone — ustawienie przodem wynika z polecenia; WARUNKOWO, do oceny recenzenta)"]]}
   ],
   "move": [
    {"c": "plyo.coneFwd.hop1", "s": [["ace-118", "Step 3 (explode forward and upwards … over the top of the first cone)"], ["pep-program", "Section III B, Instruction (hop over the cone … then hop backwards)"]]}
   ],
   "tips": [
    {"c": "jump.land", "s": [["ace-118", "Step 5 (land softly and quietly)"], ["pep-program", "Section III B (softly landing … bending at the knee)"]]}
   ],
   "mistakes": [
    {"c": "jump.mis.stiff", "s": [["ace-118", "Step 5 (avoid locking the knees on landing)"], ["pep-program", "Section III B (be careful not to snap your knee back to straighten it)"]]}
   ]
  },
  "Single-Leg Lateral Hop": {
   "setup": [
    {"c": "plyo.slLatHop.stand", "s": [["pmc-6365302", "Methods, Side Hop (SH) Test (stands on one foot, adjacent to a line) — jedno źródło (szczebel 3); uproszczenie: linia zamiast pachołka"]]}
   ],
   "move": [
    {"c": "plyo.slLatHop.hop", "s": [["pmc-6365302", "Methods, Side Hop (SH) Test (hops back and forth across that line on the tested leg only) — jedno źródło (szczebel 3)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "plyo.mis.twoFeetLand", "s": [["wniosek", "plyo.slLatHop.hop"]]}
   ]
  },
  "Lateral Bound": {
   "setup": [
    {"c": "plyo.latBound.setup", "s": [["pmc-8975571", "Methods, Lateral Bound Test (jump from the starting position on one leg) — jedno źródło (szczebel 3)"]]}
   ],
   "move": [
    {"c": "plyo.latBound.move", "s": [["pmc-8975571", "Methods, Lateral Bound Test (jump laterally … land on the target with the opposite leg) — jedno źródło (szczebel 3); uproszczenie: pojedynczy skok testu"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "plyo.mis.twoFeetLand", "s": [["wniosek", "plyo.latBound.move"]]}
   ]
  }
 }
}
```

Uwaga: `plyo.coneLat.hop` (W1, nowe zdanie, ACE + NISMAT) trafia do danych dopiero teraz — wcześniej karta była otwarta. Przy odrzuceniu warunku Front Cone Hops
usunąć cały wpis (ustawienie z jednego źródła). Przy wycofaniu `plyo.depth.mis.jumpOff` Depth Jump zostaje „własna z błędami” (drugi błąd).

## 4. Nowe zdania

| Id | PL | EN (propozycja) |
|---|---|---|
| plyo.depth.mis.jumpOff | Podskok w górę ze skrzyni zamiast zwykłego kroku w przód. | Jumping up off the box instead of simply stepping forward. |
| plyo.depth.mis.pause | Zatrzymanie się po lądowaniu zamiast od razu odbić się w górę. | Pausing after landing instead of springing straight back up. |
| plyo.altPushoff.mis.noSwitch | Brak zmiany nóg w powietrzu — na skrzynię wraca ta sama stopa. | Not switching legs in the air — the same foot lands back on the box. |
| plyo.coneLat.stand | Stań bokiem tuż obok pachołka. | Stand side-on, right next to the cone. |
| plyo.coneFwd.stand | Stań tuż za pachołkiem, przodem do niego. | Stand just behind the cone, facing it. |
| plyo.coneFwd.hop1 | Przeskakuj obunóż w przód nad pachołkiem. | Jump forward over the cone, off both feet. |
| plyo.slLatHop.stand | Stań na jednej nodze tuż obok linii albo pachołka. | Stand on one leg right next to a line or cone. |
| plyo.slLatHop.hop | Skacz w bok i z powrotem nad linią albo pachołkiem, cały czas na tej samej nodze. | Hop sideways back and forth over the line or cone, staying on the same leg. |
| plyo.latBound.setup | Stań na jednej nodze. | Stand on one leg. |
| plyo.latBound.move | Wybij się w bok z tej nogi i wyląduj na drugiej. | Push off sideways from that leg and land on the other one. |
| plyo.mis.twoFeetLand | Lądowanie na obu stopach zamiast na jednej nodze. | Landing on both feet instead of on one leg. |

Zdania z W1 użyte bez zmian: `plyo.depthStep`, `plyo.depthRebound`, `plyo.pushoff.setup`, `plyo.altPushoff.move`, `plyo.coneLat.hop` (nowe w W1 — jeszcze nie w
`lib/cues/text`); istniejące: `jump.land`, `jump.mis.stiff`. Każde nowe zdanie wymaga wpisu w rejestrze twierdzeń i przeglądu tłumacza / recenzenta lokalizacji.

## 5. Źródła (przeczytane 02.11.2026)

| Id | Adres | Organizacja | Szczebel — uzasadnienie | Co przeczytano |
|---|---|---|---|---|
| pep-program | https://health.ucdavis.edu/media-resources/sports-medicine/documents/pdfs/pep-program.pdf | Santa Monica Sports Medicine Research Foundation (kopia na serwerze UC Davis Health) | 4 — fundacja badawcza medycyny sportowej, dokument firmowany w nagłówku; udostępnia system ochrony zdrowia (uzup. 2: instytucje medyczne, firmowanie wystarcza). Autora osobowego i daty brak | s. 1 nagłówek; s. 2 wstęp sekcji III; s. 3 III A (Lateral Hops over Cone), III B (Forward/Backward Hops), III C (Single Leg hops), III E (Scissors Jump) |
| ace-118 | https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/ | ACE | 4 (rozstrzygnięcie) | Step 1, 3, 5 |
| ace-120 | https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ | ACE | 4 | Step 1–8, uwaga końcowa |
| ace-246 | https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/ | ACE | 4 | Step 1–5 (ponownie 02.11; brak działu błędów) |
| catalyst-551 | https://catalystathletics.com/exercise/551/Depth-Jump/ | Catalyst Athletics | 4 | Instructions (ponownie 02.11; brak działu błędów) |
| nismat-lat-jump-cone | https://nismat.org/2020/05/26/lateral-jump-over-cone/amp/ | NISMAT (Lenox Hill) | 4 — instytucja medyczna, nazwa w nagłówku i stopce; wpis z konta instytutu, data w adresie | pełny opis (3 zdania) |
| pmc-6365302 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6365302/ | Greisberg i in. 2019 | 3 — recenzowane badanie; użyty tylko opis wykonania | Methods, „Side Hop (SH) Test” |
| pmc-8975571 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8975571/ | Waldhelm i in. 2022 | 3 — recenzowane badanie; użyty tylko opis wykonania | Methods, „Lateral Bound Test”; Introduction (koślawienie kolana — twierdzenie o zdrowiu, nieużyte) |
| kuhs-ankle-testing (nieużyte) | https://www.kansashealthsystem.com/-/media/project/website/pdfs-for-download/pt-protocols/functional-testing-protocolankle.pdf | University of Kansas Health System | 4 (instytucja medyczna) | s. 1–2: tylko formularz (Side Hop Test, kolumna „Dynamic Valgus” = rzepka przyśrodkowo od palucha); brak opisu wykonania |
| hk-lacrosse-lateral-bound (nieużyte) | https://us.humankinetics.com/blogs/excerpt/lateral-bound-into-rotational-shot-put-throw | Human Kinetics, „Strength Training for Lacrosse” (fragment przypisany J. Holdsworth, E. R. Smith Jr.) | nieocenione — biogramów nie czytano | wariant z rzutem piłką lekarską; nie mówi wprost o lądowaniu na jednej nodze |
| oxygenmag-seated-box-jump (nieużyte) | https://www.oxygenmag.com/training-tips-for-women/seated-box-jumps-11952/ | Oxygen (magazyn) | 5 — bez autora (data 12.05.2016) | siad na niższej skrzyni przodem do wyższej, zamach rąk, wskok |

Odrzucone / niedostępne: strony innych aplikacji treningowych (także serwis z dziennikiem treningów opisujący lateral bound) i platforma ćwiczeń dla pacjentów
(uzup. 2: 5); sklepy i serwisy bez autora; EliteFTS „seated box jumps” (404); kopia FIFA 11+ na stronie kliniki (plik > 10 MB — nieprzeczytany); centra rekreacji uczelni (5).

## 6. Otwarte

- [OTWARTE] **Lateral Box Jump** — ustawienie i ruch nadal tylko ISSA. Szukane: wyszukiwarka (wyniki: strony aplikacji, platforma dla pacjentów, centrum rekreacji uczelni,
  strony Prehab Guys bez autora), badania z opisem wykonania — brak. Następny krok: podręcznik NSCA (rozdział pliometrii, „box drills”).
- [OTWARTE] **Dumbbell Seated Box Jump** — siad przodem do skrzyni: tylko Catalyst #552 (4) + magazyn bez autora (5). Źródła Box Jump nie wystarczą: ustawienie (siad) i start
  bez kontrruchu różnią się od skoku ze stania — to nie wariant sprzętu. Sposób trzymania hantla — żadne źródło.
- [OTWARTE] **Star Jump** — tylko trust NHS (4, inny wariant lądowania); strona Royal Navy — siły zbrojne bez autora (wg uzup. 2, wiersz agencji bez autora → 5).
- [OTWARTE] **Single-Leg Lateral Hop / Lateral Bound — kolano do środka** (`sq.mis.kneesIn`): formularz szpitala (Kansas — „Dynamic Valgus” oceniane w Side Hop Test) i Waldhelm 2022
  (tylko jako wynik pomiaru i w kontekście ryzyka urazu) — brak drugiego źródła z poleceniem dla ćwiczącego; Prehab Guys = 5.
- [OTWARTE] **Single-Leg Lateral Hop, Lateral Bound — lądowanie miękkie / sztywne nogi** — żadne przeczytane źródło tych ćwiczeń.
- [OTWARTE] **Alternate Leg Push-Off — `jump.mis.stiff`** — tylko ACE.
- [OTWARTE] **Depth Jump — `plyo.depth.mis.jumpOff`** a ISSA („Jump off a box”) — do oceny recenzenta.
- [OTWARTE] **Front Cone Hops — ustawienie** — PEP tylko pośrednio.
- [OTWARTE] **Bench Jump** (definicja — analityk), **Frog Hops**, **Kneeling Jump Squat** — bez źródeł; w W2 jedno wyszukiwanie dla Kneeling Jump Squat (badania „kneeling jump”) bez wyniku.
- [OTWARTE] **FIFA 11+** (F-MARC) — „lateral jumps” (jednonóż w bok na drugą nogę, kolano nie do środka) mogłyby dać drugie źródło dla Lateral Bound i błąd kolana; oficjalnej,
  czytelnej kopii nie otwarto (plik kliniki > 10 MB; pozostałe kopie — serwisy z plikami użytkowników).

## 7. Stan

- Zrobione: Depth Jump, Alternate Leg Push-Off (błędy); Lateral Cone Hops, Front Cone Hops (warunkowo), Single-Leg Lateral Hop, Lateral Bound → karty z błędami;
  Lateral Box Jump, Dumbbell Seated Box Jump, Star Jump, Kneeling Jump Squat — szukane, otwarte.
- Zostało: Frog Hops i Bench Jump (nie szukane w W2); drugie źródła dla Lateral Box Jump, Star Jump, Seated Box Jump; FIFA 11+ (oficjalna kopia — może zamknąć kilka luk).
- Następny krok: oficjalny podręcznik FIFA 11+ (strona FIFA lub uczelni/szpitala, plik < 10 MB), potem fragmenty NSCA u wydawcy.
- Pułapki: duże PDF-y (> 10 MB) WebFetch odrzuca; PDF-y z obrazami — narzędzie Read ze stronami (po 1–3); human kinetics `canada.` przekierowuje — używać `us.`.
