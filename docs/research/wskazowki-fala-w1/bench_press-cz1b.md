# bench_press (cz. 1b) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Kontynuacja `bench_press-cz1.md` (ten sam zestaw zasad; id źródeł i zdań poprzednika użyte bez dublowania). Zasady: CLAUDE.md
„Merytoryczne podstawy” i „Wyjątek dla wskazówek techniki”, brief fali W1 z uzupełnieniem i „Rozstrzygnięciem szczebli źródeł”
koordynatora (02.11.2026). Wszystkie strony przeczytane narzędziem WebFetch 02.11.2026. Strony innych aplikacji treningowych odrzucone
(nie wymieniane z nazwy). Szczeble po „Uzupełnieniu 3” — patrz sekcja na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| One Arm Dumbbell Bench Press | gotowe | NASM (biblioteka ćwiczeń) + BarBend (artykuł o technice, autor CSCS); krótka karta |
| Wide-Grip Barbell Bench Press | otwarte | po uzupełnieniu 3 jedno źródło szczebla 4 (Fitness Volt, autor NFPT-CPT, 10.05.2021); reszta szczebla 5 |
| Reverse Grip Bench Press | otwarte | chwyt — Healthline (4, potwierdzone w uzupełnieniu 3) + Stoppani (szczebel do oceny); ruch i błąd — źródła się różnią albo tylko 1 |
| Squeeze Press (hantle) | otwarte | po uzupełnieniu 3 Mikolo = 5 (blog; hantli w ofercie nie ma); zostaje tylko BarBend |
| One-Arm Kettlebell Floor Press | otwarte | strona producenta kettli niedostępna (HTTP 402); BarBend opisuje tylko wersję oburącz („nearly identical” dla kettli) — analogia |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

Tylko „gotowe”. Bloki częściowe ćwiczeń otwartych — w sekcji „Otwarte”.

```json
{
  "One Arm Dumbbell Bench Press": {
    "setup": [
      {"c": "bench.oneArm.setup", "s": [
        ["nasm-single-arm-dumbbell-chest-press", "Step 1 (lie on a flat bench; feet flat on the floor); Step 2 (one dumbbell at chest level)"],
        ["barbend-single-arm-dumbbell-bench-press", "Step 1: Set Up (feet flat on the floor; flat bench; dumbbell in one hand)"]
      ]}
    ],
    "move": [
      {"c": "bench.oneArm.move", "s": [
        ["nasm-single-arm-dumbbell-chest-press", "Step 3 (press with control); Step 4 (return under control to chest level; finish all reps before switching arms)"],
        ["barbend-single-arm-dumbbell-bench-press", "Step 3: Lower and Press (control the dumbbell down… push back up)"]
      ]}
    ],
    "tips": [
      {"c": "bench.oneArm.brace", "s": [
        ["nasm-single-arm-dumbbell-chest-press", "Step 2 (brace your core to resist rotation)"],
        ["barbend-single-arm-dumbbell-bench-press", "Step 2: Get Tight (the dumbbell will try to twist you off the bench); Step 3 (keep your hips from twisting)"]
      ]}
    ],
    "mistakes": [
      {"c": "bench.oneArm.mis.twist", "s": [
        ["nasm-single-arm-dumbbell-chest-press", "Common Mistakes (weight that causes excessive rotation; not bracing the core)"],
        ["barbend-single-arm-dumbbell-bench-press", "Step 2: Get Tight (losing tension lets you rotate off the bench); FAQ (too much weight if you need your free hand to stay on the bench)"]
      ]}
    ]
  }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| bench.oneArm.setup | Połóż się na płaskiej ławce z jednym hantlem przy klatce, stopy płasko na podłodze. | Lie on a flat bench with one dumbbell by your chest, feet flat on the floor. |
| bench.oneArm.move | Wypchnij hantel w górę, potem opuść go powoli do wysokości klatki; zrób całą serię jedną ręką i zmień stronę. | Press the dumbbell up, then lower it slowly to chest level; finish the set on one arm, then switch. |
| bench.oneArm.brace | Napnij brzuch i nie daj się obrócić — tułów i biodra zostają na ławce nieruchomo. | Brace your abs and don't let the weight twist you — keep your torso and hips still on the bench. |
| bench.oneArm.mis.twist | Tułów i biodra skręcają się za hantlem — za luźny brzuch albo za duży ciężar. | Torso and hips twisting with the dumbbell — abs too loose or the weight too heavy. |
| bench.squeeze.setup (nieużyte) | Połóż się na ławce z hantlami nad klatką, dłonie zwrócone do siebie, hantle stykają się bokami. | Lie on the bench with the dumbbells over your chest, palms facing each other, the weights touching. |
| bench.squeeze.move (nieużyte) | Opuść złączone hantle w stronę klatki, potem wypchnij je z powrotem w górę, nie rozłączając ich. | Lower the dumbbells together toward your chest, then press them back up without letting them separate. |
| bench.squeeze.hold (nieużyte) | Dociskaj hantle do siebie przez cały ruch. | Keep squeezing the dumbbells together the whole time. |
| bench.squeeze.mis.apart (nieużyte) | Hantle się rozjeżdżają, a łokcie uciekają na boki. | Dumbbells drifting apart and elbows flaring out. |

Uwagi:
- `bench.oneArm.move` celowo bez „do wyprostu”: NASM — bez blokowania łokcia (Step 3), BarBend — „full extension” (Step 3).
  Dolny punkt: NASM „chest level”, BarBend „upper arm roughly parallel to the floor” — zgodne kierunkowo, zdanie mówi „do wysokości klatki”.
- `bench.squeeze.move` — „w stronę klatki”: BarBend każe dotknąć klatki (Step 4 i błąd „Not touching your chest”), Mikolo — tuż nad klatką;
  zdanie podaje część wspólną. Zakończenie ruchu (wyprost lub nie) — źródła milczą albo się różnią, dlatego pominięte.
- Istniejące `dbp.setup` (siad z hantlami na udach) — pasuje do Squeeze Press tylko w BarBend Step 1 i Mikolo („curl the dumbbells up to your knees”),
  ale tekst `dbp.setup` mówi „hantle przy bokach klatki”, co przeczy pozycji złączonych hantli nad klatką — nie użyte.
- `bp.contact`, `bp.blades` dla One Arm: tylko BarBend (pięć punktów podparcia; łopatki w tył i w dół), NASM nie wymienia — nie użyte.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| nasm-single-arm-dumbbell-chest-press | https://www.nasm.org/resource-center/exercise-library/single-arm-dumbbell-chest-press | NASM (org już w rejestrze; treść firmowana) | 4 | 02.11.2026 |
| barbend-single-arm-dumbbell-bench-press | https://barbend.com/single-arm-dumbbell-bench-press/ | BarBend, artykuł o technice; autor Mike Dewar (CSCS), aktualizacja Eric Bugera (CSCS) 03.06.2025 | 4 | 02.11.2026 |
| barbend-hex-press | https://barbend.com/hex-press/ | BarBend, artykuł o technice; autor Jake Dickson (NASM-CPT, USAW-L2), aktualizacja 20.06.2024 | 4 | 02.11.2026 |
| mikolo-squeeze-press | https://gym-mikolo.com/blogs/home-gym/squeeze-more-gains-from-your-chest-with-the-dumbbell-squeeze-press | Mikolo Fitness — blog, bez autora i daty, strona z promocjami produktów | 5 (uzupełnienie 3: blog Mikolo = 5; hantli w ofercie nie ma) | 02.11.2026 (tylko do Otwartych) |
| healthline-reverse-grip-bench-press | https://www.healthline.com/health/fitness/reverse-grip-bench-press | Healthline; podpis: autor Tyler Read, BSc, CPT; recenzent Daniel Bubnis, M.S., NASM-CPT; 09.08.2021 | 4 (uzupełnienie 3: recenzent nazwany, autor z kwalifikacjami, data) | 02.11.2026 |
| stoppani-reverse-grip-bench-press | https://jimstoppani.com/training/reverse-grip-bench-press | strona autorska Jima Stoppaniego (PhD), aktualizacja 31.08.2026 | 4 albo 5 — do oceny (strona jednego autora, bez redakcji; poza zakresem uzupełnienia 3) | 02.11.2026 |
| fitnessvolt-wide-grip-bench-press | https://fitnessvolt.com/wide-grip-bench-press/ | Fitness Volt; podpis „By Andrew Peloquin NFPT-CPT”, 10.05.2021 (bez recenzenta) | 4 (uzupełnienie 3: autor z kwalifikacjami i data) | 02.11.2026 |

Przeczytane, ale szczebel 5 wg rozstrzygnięcia koordynatora (nie liczą się): gymnation.com (sieć siłowni; wide grip),
generationiron.com (autor bez kwalifikacji; wide grip), shop.bodybuilding.com „how wide should your bench press grip be” (autor bez
kwalifikacji). barbell-logic.com „Bench Press Grip Tips” — tylko ogólnie o szerokości chwytu, bez wskazówki do użycia.
Przeczytane i odrzucone: ACE „Offset Single-arm Chest Press” (inne ćwiczenie — barki poza ławką, biodra w górze);
barbend.com/reverse-grip-bench-press/ (treść o chwytach ogólnie, kroki jak w zwykłym wyciskaniu, bez specyfiki podchwytu).
Niedostępne: kettlebellkings.com (HTTP 402), barbend.com/wide-grip-bench-press/ i /kettlebell-floor-press/ (404),
elitefts (404), weighttraining.guide (404), bodybuilding.com/exercises/* (404 po przekierowaniu).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| One Arm Dumbbell Bench Press — łokieć ok. 45° | tylko NASM (Step 2); BarBend nie podaje kąta |
| One Arm Dumbbell Bench Press — druga ręka wyprostowana w górę | tylko BarBend (Step 1, Step 3) |
| One Arm Dumbbell Bench Press — wyprost na górze | źródła się różnią: NASM bez blokowania łokcia, BarBend „full extension” |
| Wide-Grip Barbell Bench Press — całe ćwiczenie | jedno źródło szczebla 4: Fitness Volt (autor NFPT-CPT, 10.05.2021 — potwierdzone w uzupełnieniu 3). Kandydackie zdania (nie do aplikacji): chwyt `bench.wide.grip` „Chwyć sztangę wyraźnie szerzej niż do zwykłego wyciskania.” / „Grip the bar clearly wider than for a regular bench press.” [fitnessvolt-wide-grip-bench-press krok 1 (slide your hands 3–5 inches outward); poza tym tylko źródła szczebla 5]; błąd „odbijanie sztangi od klatki” — tylko gymnation (5) i generationiron (5). Sprzeczności: dolny punkt (Fitness Volt — zatrzymaj przed dotknięciem; inne — do klatki), wyprost (Fitness Volt i Generation Iron — bez blokowania; GymNation — pełny wyprost). Potrzebne drugie źródło szczebla 4 |
| Wide-Grip — `bp.grip` z zestawu ogólnego („nieco szerzej niż barki”) | nie pasuje do wariantu szerokiego — Fitness Volt i bodybuilding.com: wyraźnie szerzej niż chwyt zwykły; zestaw ogólny dla tego ćwiczenia jest mylący |
| Reverse Grip Bench Press — całe ćwiczenie | brak błędu z 2 źródeł. Częściowo potwierdzone: chwyt `bench.reverse.grip` „Chwyć sztangę podchwytem — dłonie zwrócone do ciebie, nieco szerzej niż barki.” / „Take an underhand grip — palms facing you, a bit wider than your shoulders.” [healthline-reverse-grip-bench-press krok 2 (wider than shoulder width, palms facing you); stoppani-reverse-grip-bench-press krok 3 (slightly wider than shoulder-width)] — ważne tylko, jeśli Stoppani = 4 |
| Reverse Grip — zdejmowanie sztangi | źródła się różnią: Stoppani — zdejmij nachwytem i dopiero na klatce zmień chwyt (krok 1–2); Healthline — zdejmij już podchwytem (krok 3) |
| Reverse Grip — dolny punkt | źródła się różnią: Stoppani — poniżej dolnej części klatki, przy górze brzucha, nie na wysokość sutków (krok 5); Healthline — w dół i w tył w stronę mostka (krok 4). `bp.move` („do klatki”) niepotwierdzone dla tego wariantu |
| Reverse Grip — błędy | tylko po 1 źródle: Healthline — odbijanie sztangi, ześlizg chwytu (asekuracja, ograniczniki); Stoppani — opuszczanie jak w zwykłym wyciskaniu, wyciskanie pionowo zamiast łukiem, chwyt bez kciuka przy nauce |
| Reverse Grip — łokcie przy tułowiu | tylko Stoppani (krok 7); bodybuilding.com (5) się nie liczy |
| Squeeze Press (hantle) — całe ćwiczenie | uzupełnienie 3: Mikolo = 5 → zostaje tylko BarBend (`barbend-hex-press`). Kandydaci `bench.squeeze.setup` [BarBend Step 1–2; Mikolo How-to], `bench.squeeze.move` [BarBend Step 4–5; Mikolo How-to], `bench.squeeze.hold` [BarBend Step 3; Mikolo „Don't Lose the Squeeze”], `bench.squeeze.mis.apart` [BarBend Common Hex Press Mistakes; Mikolo „Don't Lose the Squeeze; Chest Up, Elbows In”]. Potrzebne drugie źródło szczebla 4 |
| One-Arm Kettlebell Floor Press — całe ćwiczenie | brak źródła dla wersji jednorącz z kettlem. BarBend (`barbend-floor-press`, „How to Do the Floor Press”) mówi, że kroki są „nearly identical” z kettlami, ale opisuje wersję oburącz — użycie byłoby analogią. Strona producenta kettli (kettlebellkings.com) — HTTP 402. Wyniki wyszukiwania to głównie strony aplikacji (odrzucone) |

## Stan

- Zrobione: wszystkie 5 ćwiczeń zbadane (po uzupełnieniu 3: One Arm DB — gotowe; Wide-Grip, Reverse Grip, Squeeze Press, KB Floor Press — otwarte).
- Następny krok (jeśli koordynator zechce domknąć otwarte): Wide-Grip — drugi artykuł o technice szerokiego chwytu u organizacji
  szkolącej (ISSA, NFPT z autorem) albo w Catalyst Athletics; Reverse Grip — drugie źródło szczebla 4 pod konkretny błąd („bouncing”,
  „bar slipping”) albo ocena Stoppaniego; Squeeze Press — drugie źródło szczebla 4; KB Floor Press — producenci kettli (inne niż kettlebellkings.com), ISSA, StrongFirst.
- Pułapki: kettlebellkings.com zwraca 402; wiele adresów BarBend z nazwą ćwiczenia daje 404 (szukać przez wyszukiwarkę); strony
  z bazą ćwiczeń bodybuilding.com przekierowują na 404.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1 (Mikolo: blog 5, hantli w ofercie nie ma; Healthline z nazwanym recenzentem
i Fitness Volt — warunkowo 4 per strona: autor z kwalifikacjami i data). Podpisy stron sprawdzone WebFetch 02.11.2026.

Źródła:
- mikolo-squeeze-press: „4 do oceny” → 5; usunięte z bloku JSON.
- healthline-reverse-grip-bench-press: 4 → 4 (potwierdzone: „Medically reviewed by Daniel Bubnis, M.S., NASM-CPT, NASE Level II-CSS — Written by Tyler Read, BSc, CPT on August 9, 2021”).
- fitnessvolt-wide-grip-bench-press: „do oceny” → 4 (autor Andrew Peloquin, NFPT-CPT; opublikowane 10.05.2021).

Ćwiczenia:
- Squeeze Press (hantle): gotowe warunkowo → otwarte (zostaje tylko BarBend); wpis usunięty z bloku JSON, zdania `bench.squeeze.*` jako kandydaci.
- Wide-Grip Barbell Bench Press: otwarte → otwarte (teraz 1 źródło szczebla 4).
- Reverse Grip Bench Press: otwarte → otwarte (Healthline potwierdzone jako 4; nadal brak błędu z 2 źródeł, Stoppani do oceny).
- One Arm Dumbbell Bench Press, One-Arm Kettlebell Floor Press: bez zmian.
