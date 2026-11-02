# chest_fly (cz. 2: pullovery i inne) — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Podstawa: CLAUDE.md „Merytoryczne podstawy” i „Wyjątek dla wskazówek techniki”; szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md`
(rozstrzygnięcia + uzupełnienia 1–3) i przeliczenia szczebli fali W1 (sekcja „Rozstrzygnięcia koordynatora 1.1” — nadrzędna).
Wejście: wyniki W1 `chest_fly-cz2.md` (gałąź `badania/g5-pchanie`). Strony czytane 02.11.2026 przez WebFetch; cytaty tylko jako
wskazanie miejsca (najwyżej 1 zdanie). Strony aplikacji treningowych i agregatorów z wyników wyszukiwania pominięte (nie są źródłem).

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Pullover (hantel) | **gotowe** (ustawienie + ruch + 2 błędy) | Przeliczenie W1: REP Fitness = 5, karta spadła do „otwartej” (brak ustawienia z 2 źródłami). Sprawdzone 02.11.2026: ACE 37 opisuje ustawienie (leżenie tyłem na ławce, stopy na podłodze, ręce nad klatką) → nowe zdanie `po.benchSetup` = ACE + BarBend. Zastępuje `po.dbSetup` z W1 (część „wzdłuż albo w poprzek” i chwyt jednego hantla za koniec stały tylko na REP Fitness/BarBend). Uwaga: ACE pokazuje wariant z hantlem w każdej ręce — zdanie nie mówi o chwycie, więc się z nim zgadza. Błędy: 2 wnioskowane (`po.mis.force` z `po.lower`, wsparte błędem w BarBend; `po.mis.elbows` z `front.elbows`). Karta zastępuje zestaw ogólny (`po.arms`, `po.slow`, `mis.jerk` — nadal niepotwierdzone, patrz W1). |
| Svend Press | **gotowe warunkowo** (ustawienie + ruch + 2 błędy ze źródeł) | Drugie źródło: Fitness Volt (autor „Dr. Malik, an MD and fitness expert”, data publikacji i aktualizacji, bez recenzenta). Szczebel 4 **warunkowo** wg uzup. 3 (autor z kwalifikacjami w podpisie i data) — kwalifikacja medyczna, nie trenerska, pełne nazwisko niepodane → **do potwierdzenia przez koordynatora**; przy ocenie 5 ćwiczenie wraca do „otwarte”. Ćwiczenie nie ma póz v2 (`cue-sets.json`: `open`) — karta bez rysunku. |
| Machine Pullover | otwarte | Przeliczenie W1: 0 źródeł (kopia instrukcji Life Fitness nieutożsamiona). Wyszukiwanie 02.11.2026 nie dało instrukcji producenta z opisem ćwiczenia (tylko poradniki aplikacji, strona sklepu Panatta z opisem regulacji). |
| Bent-Arm Barbell Pullover | otwarte | Trafienia: biblioteki aplikacji, Physitrack (5), strona prywatna trenerki (5), bodybuilding.com (W1: 404). Analogia do pullovera z hantlem niedozwolona jako wariant sprzętu — inny chwyt (sztanga) i stałe, wyraźne ugięcie łokci zmieniają wykonanie. Zestaw ogólny `po.slow` + `mis.jerk` niepotwierdzony. |
| Wide-Grip Decline Barbell Pullover | otwarte | Brak źródeł wariantu; inny kąt ławki (w dół) i chwyt — bez analogii. Zestaw ogólny (`po.arms`, `po.slow`, `mis.jerk`) niepotwierdzony; `po.arms` przeczy źródłom pullovera z hantlem (W1). |
| Front Raise And Pullover | otwarte | Wszystkie trafienia to biblioteki aplikacji i agregatory (szczebel 5 / nie źródło). Sygnał `po.slow` potwierdzony jako problem: w opisach z wyników wyszukiwania (nieprzeczytane jako źródło) przebieg kończy się powrotem sztangi **na uda**, a w jednym wariancie zaczyna się na stojąco — „wracaj nad klatkę” z `po.slow` do tego nie pasuje. Do zestawu ogólnego: usunąć `po.slow` i `po.arms` (wniosek dla koordynatora, nie zmiana danych). |
| Around The Worlds | otwarte | Trafienia: aplikacje, Fitness Volt (jedna strona — nawet przy szczeblu 4 brak drugiego źródła), agregatory. Brak 2 źródeł szczebla 4 ani źródła szczebla 3. |
| Crucifix | otwarte | Przeczytane: USAWA „Crucifix Primer” (szczebel 5 — patrz Źródła) opisuje **bój federacji** (opuszczanie hantli z góry do poziomu, ręce w łokciach zablokowane, pięty razem, można się odchylać), a nie utrzymanie na czas jak w zawodach strongman; Breaking Muscle (W1, 5). Oba szczebla 5 i różne ćwiczenia. Sygnał `raiseSide` potwierdzony jako problem: `lat.height` („Unoś…”) opisuje wznos, a ćwiczenie to utrzymanie ramion w bok (metric `weight_time`); `plank.mis.breath` nie ma źródła dla tego ćwiczenia. |

### Blok do wdrożenia

```json
{
 "Pullover (hantel)": {
  "setup": [
   {"c": "po.benchSetup", "s": [
    ["ace-37", "Instructions (lie face up on a bench, feet resting on the floor; arms extended over the chest)"],
    ["barbend-db-pullover", "Step 1 — The Set-Up (lie face up, feet planted, dumbbell held over the chest)"]
   ]}
  ],
  "move": [
   {"c": "po.move", "s": [
    ["ace-37", "Instructions (arms lowered back over the head, then pulled back up to the start)"],
    ["barbend-db-pullover", "Step 2 — Reach Backwards; Step 3 — Raise the Load and Repeat"]
   ]}
  ],
  "tips": [
   {"c": "front.elbows", "s": [
    ["ace-37", "Instructions (keeping the elbows straight)"],
    ["barbend-db-pullover", "Step 1–3 (elbows slightly bent through all phases)"]
   ]},
   {"c": "po.lower", "s": [
    ["ace-37", "Instructions (slowly stretch the arms overhead)"],
    ["barbend-db-pullover", "Step 2 (only as far as comfortable, to a stretch in chest and lats)"]
   ]}
  ],
  "mistakes": [
   {"c": "po.mis.force", "s": [
    ["wniosek", "po.lower"],
    ["barbend-db-pullover", "Common Mistakes — Forcing Your Range of Motion"]
   ]},
   {"c": "po.mis.elbows", "s": [
    ["wniosek", "front.elbows"]
   ]}
  ]
 },
 "Svend Press": {
  "setup": [
   {"c": "svend.setup", "s": [
    ["barbend-svend-press", "Step 1 — Pinch the Plates (stand tall, two plates pinched together with both hands)"],
    ["fitnessvolt-svend-press", "How to (stand, plates pressed together in front of the middle of the chest)"]
   ]}
  ],
  "move": [
   {"c": "svend.move", "s": [
    ["barbend-svend-press", "Step 2 — Press Upwards and Inwards (extend the arms straight out, plates kept pressed together)"],
    ["fitnessvolt-svend-press", "How to (push away until the arms are straight out in front; return slow and controlled)"]
   ]}
  ],
  "tips": [
   {"c": "svend.squeeze", "s": [
    ["barbend-svend-press", "Step 2; Common Mistakes — Not Squeezing the Plates"],
    ["fitnessvolt-svend-press", "Tips (press the plates together throughout the set)"]
   ]}
  ],
  "mistakes": [
   {"c": "svend.mis.loose", "s": [
    ["barbend-svend-press", "Common Mistakes — Not Squeezing the Plates"],
    ["fitnessvolt-svend-press", "Tips (press the plates together throughout the set) — błąd = zaprzeczenie standardu"]
   ]},
   {"c": "svend.mis.fast", "s": [
    ["barbend-svend-press", "Common Mistakes — Rushing the Reps"],
    ["fitnessvolt-svend-press", "Tips (slow tempo; lifters often rush through the movement)"]
   ]}
  ]
 }
}
```

Uwagi do bloku:
- `po.mis.force` ma też źródło wprost (BarBend, błąd), ale bez drugiego niezależnego — dlatego podstawą jest wniosek z `po.lower`.
- `po.mis.elbows` — da się pokazać na rysunku (łokcie zginają się przy opuszczaniu i prostują przy powrocie — ruch jak wyprost na triceps).
  W W1 ten sam błąd miał tylko źródła szczebla 5 (Breaking Muscle, gymnation) — tu wyłącznie jako wniosek z `front.elbows`.
- Svend Press: przed wpisem do `data/` koordynator rozstrzyga szczebel `fitnessvolt-svend-press` (wyżej). Ruch: BarBend „straight out and
  slightly up”, Fitness Volt „parallel to the floor” — część wspólna „przed siebie”, kierunek w górę/poziomo nie wpisany.
  Blokowanie łokci: BarBend „completely locked out”, Fitness Volt tylko „straight” — nie wpisane (jak W1).

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| po.benchSetup | Połóż się plecami na ławce, stopy na podłodze; trzymaj hantel nad klatką. | Lie back on a bench, feet on the floor; hold the dumbbell above your chest. |
| po.move (z W1, bez zmian) | Opuść hantel łukiem za głowę, aż poczujesz rozciągnięcie; wróć tym samym łukiem nad klatkę. | Lower the dumbbell in an arc behind your head until you feel a stretch; bring it back over your chest along the same arc. |
| po.lower (z W1, bez zmian) | Opuszczaj ciężar powoli i tylko do wyraźnego rozciągnięcia — nie dalej na siłę. | Lower the weight slowly and only until you feel a clear stretch — don't force it further. |
| po.mis.force | Ciągnięcie ciężaru za głowę na siłę, dalej niż wygodne rozciągnięcie. | Forcing the weight further behind your head than a comfortable stretch. |
| po.mis.elbows | Zginanie i prostowanie łokci w trakcie ruchu — jak przy wyproście na triceps. | Bending and straightening your elbows during the rep, like a triceps extension. |
| svend.setup | Stań prosto, ściśnij dwa talerze między dłońmi i trzymaj je przed klatką. | Stand tall, squeeze two plates between your palms and hold them in front of your chest. |
| svend.move | Wypchnij talerze przed siebie do wyprostu rąk, potem powoli wróć nimi do klatki. | Press the plates out in front of you until your arms are straight, then slowly bring them back to your chest. |
| svend.squeeze | Ściskaj talerze dłońmi przez cały ruch. | Keep squeezing the plates together the whole time. |
| svend.mis.loose | Luźne trzymanie talerzy zamiast mocnego ściskania. | Just holding the plates instead of squeezing them hard. |
| svend.mis.fast | Za szybkie powtórzenia. | Rushing the reps. |

Istniejące użyte: `front.elbows` („Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch.”) — część wspólna ACE (proste)
i BarBend (lekko ugięte). Nieużyte `po.dbSetup` z W1 — zastąpione `po.benchSetup`. Sprawdzone w `lib/cues/text/pl.json`: brak istniejących
zdań pasujących dosłownie do błędów pullovera i Svend Press (`st.mis.force` dotyczy rozciągania statycznego, `smr.mis.fast` — rolowania).

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| ace-37 (istniejące) | https://www.acefitness.org/resources/everyone/exercise-library/37/lying-pullovers/ | ACE | 4 — organizacja certyfikująca trenerów; treść firmowana „© The American Council on Exercise” (bez autora i daty — kryterium 2: jawne firmowanie przez organizację z pkt 1) | Instructions (ustawienie: „Lie face up on a bench with the feet resting comfortably on the floor”; ruch; łokcie proste) |
| barbend-db-pullover (z W1) | https://barbend.com/dumbbell-pullover/ | BarBend | 4 — artykuł techniki; Mike Dewar, CSCS; aktualizacja Alex Polish, 26.11.2024 (przeliczenie W1, wiersz 35) | Step 1–3; Common Mistakes — Forcing Your Range of Motion |
| barbend-svend-press (z W1) | https://barbend.com/svend-press/ | BarBend | 4 — artykuł techniki; Ben Pollack, Ph.D.; aktualizacja Alex Polish (NASM-CNC, ACE-CPT), 25.11.2024; bez oznaczenia „Expert Verified” | Step 1 — Pinch the Plates; Step 2 — Press Upwards and Inwards; Common Mistakes — Not Squeezing the Plates, Rushing the Reps |
| fitnessvolt-svend-press (nowe) | https://fitnessvolt.com/svend-press/ | Fitness Volt | **4 warunkowo — do potwierdzenia**: autor „Dr. Malik, an MD and fitness expert” (kwalifikacja w podpisie, bez pełnego nazwiska i bez certyfikatu trenerskiego), opubl. 01.04.2019, akt. 11.08.2024, bez nazwanego recenzenta (uzup. 3: „najlepiej z recenzentem”) | How to (ustawienie, ruch, powrót „slow and controlled”); Tips (ściskanie przez całą serię; wolne tempo, „rush through the movement”) |
| usawa-crucifix (nieużyte) | https://usawa.com/?p=26035 | USAWA (federacja) | 5 — Eric Todd, rekordzista USAWA w tym boju, bez kwalifikacji trenerskich; 17.07.2015; opisuje przepisy boju federacji, nie utrzymanie strongman | cały artykuł (przepisy boju i porównanie ze strongman) |

Nie źródło / nieprzeczytane: acibademinternational.com (strona szpitala — 404 w narzędziu, nieprzeczytana); nasm.org/exercise-library/dumbbell-pullover (404);
trafienia z bibliotek aplikacji i agregatorów (pominięte z zasady).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Svend Press — cała karta | zależy od szczebla `fitnessvolt-svend-press` (koordynator); przy 5 → otwarte, zostaje tylko BarBend |
| Pullover (hantel) / `po.mis.hips` | nadal tylko BarBend; strona szpitala Acibadem (z wyników: bracing tułowia) — 404, nieprzeczytana. Uwaga: w wariancie w poprzek ławki biodra są celowo niżej — błąd zależy od ustawienia |
| Pullover (hantel) / oddech | brak źródła szczebla ≤ 4 |
| Pullover (hantel) / chwyt jednego hantla za koniec oburącz | tylko BarBend (ACE: hantel w każdej ręce) — nie wpisane do zdania ustawienia |
| Machine Pullover | brak instrukcji producenta z opisem ćwiczenia; konstrukcje maszyn różne |
| Bent-Arm Barbell Pullover | brak 2 źródeł szczebla 4; analogia niedozwolona (inny chwyt i kąt łokci) |
| Wide-Grip Decline Barbell Pullover | brak źródeł; inny kąt ławki |
| Front Raise And Pullover | brak źródeł; przebieg niepewny (start na stojąco czy w leżeniu ze sztangą na udach) |
| Around The Worlds | jedno możliwe źródło (Fitness Volt, nieocenione), brak drugiego |
| Crucifix | dwa różne ćwiczenia pod tą nazwą (bój USAWA vs utrzymanie strongman); źródła szczebla 5. Najpierw ustalić, które ćwiczenie jest w katalogu (metric `weight_time` → utrzymanie) |
| Zestawy ogólne (wniosek dla koordynatora) | `Crucifix`: `lat.height` i `plank.mis.breath` nie pasują / bez źródła; `Front Raise And Pullover`: `po.slow` nie pasuje (powrót na uda); `Wide-Grip Decline`, `Front Raise And Pullover`: `po.arms` przeczy źródłom pullovera; `mis.jerk` przy pullowerach — bez źródła (W1) |

## Podsumowanie

- Ćwiczeń zbadanych: 8 (w tym przeliczenie Pullover (hantel)).
- Nowe karty z błędami: 2 (Pullover (hantel) — gotowe; Svend Press — gotowe warunkowo, szczebel drugiego źródła do potwierdzenia); bez błędów: 0.
- Błędy wnioskowane: 2 (`po.mis.force`, `po.mis.elbows`); błędy ze źródeł: 2 (Svend Press).
- Otwarte: 6 ćwiczeń (Machine Pullover, Bent-Arm Barbell Pullover, Wide-Grip Decline Barbell Pullover, Front Raise And Pullover, Around The Worlds, Crucifix).
- Nowe zdania: 8 (`po.benchSetup`, `po.mis.force`, `po.mis.elbows`, `svend.setup`, `svend.move`, `svend.squeeze`, `svend.mis.loose`, `svend.mis.fast`) + 2 z W1 bez zmian (`po.move`, `po.lower`).
- Role mięśni: osobny plik `docs/research/role-miesni-fala-w2/chest_fly-cz2.md` (0 gotowych, 4 otwarte).
