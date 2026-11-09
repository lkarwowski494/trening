# Recenzja różnicy 7 rodzin po nakładce delt_raise (09.11.2026, audytor)

L-047: recenzent ≠ autor (autor: programista delt_raise — commity 64ebbbd4, d18d02fc, a421cb8a i wcześniejsze na delt-wlaczenie-wip). Repo i wt-delt nietknięte; porównanie na kopiach `git archive` w scratchpadzie (node_modules jako dowiązanie do wt-delt).
Zakres: delt-wlaczenie-wip @ a421cb8a vs origin/figury/delt_raise @ 3a431da2.

## Werdykt na rodzinę

| Rodzina | sha we wpisie → nowe (`--skroty` na a421cb8a) | Werdykt | md5 równe (z rysunkiem) |
|---|---|---|---|
| squat | b62f05ccc077 → d353775e81c6 | wyświetlana bez zmian — tylko skrót | 25/25 |
| bench_press | 3228d2db19d2 → 23df2cba043a | wyświetlana bez zmian — tylko skrót | 30/30 |
| hinge | 99bcd84b31c2 → aabd692e8c42 | wyświetlana bez zmian — tylko skrót | 32/32 |
| pull_up | 236301a48766 → dbe9125c8303 | wyświetlana bez zmian — tylko skrót | 11/11 (13, 2 bez rysunku) |
| curl | bae16e242470 → c21cd0a16aee | wyświetlana bez zmian — tylko skrót | 34/34 (36, 2 bez rysunku) |
| olympic | c21b4af3feb5 → c8c5aa1bbfc0 | wyświetlana bez zmian — tylko skrót | 24/24 (25, 1 bez rysunku) |
| triceps | b6c6c320ef1c → 0d96e3066cfb | wyświetlana bez zmian — tylko skrót | 29/29 (32, 3 bez rysunku) |

Razem 185/185. Znalezisk KRYTYCZNYCH/WYSOKICH/ŚREDNICH: brak. Pełna recenzja ze śladem (L-050) niepotrzebna — ruch i ślad bajtowo te same, arkusze poprzednich recenzji obowiązują.
`--skroty` w wt-delt (drzewo = a421cb8a) daje plik bajtowo równy kopii a421cb8a (`cmp` OK); skróty z tabeli zlecenia potwierdzone.

## Dowody

1. `git diff --stat 3a431da2 a421cb8a -- lib/figures/v2 components scripts app lib/locales tests/fixtures/figury-v2-zlote.json`: zmienione tylko lib/figures/v2/families.ts (delt_raise → ready), overlay.ts (+import i wpis `delt_raise`), overlay/delt_raise.ts (nowy), poseData.ts (+LOAD delt_raise), reguly-cwiczen.json (+klucz `delt_raise`; pozostałe klucze identyczne — porównanie JSON). components/, app/, scripts/, lib/locales i złote dane figury-v2-zlote.json: bez różnic. Id nowych elementów (deltArmElevationFront/Side, deltShoulderLevelRef) nie występują w innych rodzinach, a wpis jest ostatni w TECHNIQUE, więc `techniqueDef` dla dotychczasowych id zwraca to samo.
2. lib/cues/data.json: różni się tylko lista `general` (+Cable Seated Lateral Raise, Machine Lateral Raise, Y Raise (hantle) — delt_raise). lib/figures/data.json: `v2` = ["delt_raise"] (zob. uwaga A).
3. md5 (skrypt (ścieżka lokalna) kopia w scratchpadzie: shapesAt z mięśniami i bez, contactShapes, badgesFor, trailFor, każdy błąd errorsOf, guideShapes/overlayShapes z kart i z aplikacji, onDrawingCues z kart i z aplikacji, staticPositions/Labels, loopOf/loopSpan, phasesFor, czas co 100 ms przez 4 s):
   - 3a431da2 vs a421cb8a „jak jest”: pola stat, czas, ruch, slad, nakl, dobor, vo, tech równe we wszystkich 185; różne tylko naklApp/voApp/tApp (squat 23, bench 21, hinge 25, pull_up 3, curl 29, olympic 13, triceps 26) — bo w a421cb8a lista v2 w data.json nie zawiera 7 rodzin (np. Back Squat: tApp ['squatKneeLimb'] → []).
   - 3a431da2 vs kopia a421cb8a z nowymi sha 7 rodzin we wpisach + `node scripts/zrodla-runtime.mjs --write` („k-sym”): data.json v2 = 8 rodzin, lib/cues/data.json bajtowo jak w a421cb8a, **wszystkie pola równe 185/185** (także nakładka i VoiceOver w wersji z aplikacji). Skróty po zmianie wpisów bez zmian (wpis nie wchodzi do skrótu).
4. Przyczyna zmiany skrótów (przy kolejnym dokładaniu plików do kopii 3a431da2): sam overlay.ts + overlay/delt_raise.ts zmienia skrót tylko triceps (b6c6c320ef1c → 27423a7b87c3); dopiero reguly-cwiczen.json zmienia wszystkie 7 na wartości końcowe; poseData.ts i families.ts nie zmieniają skrótów 7 rodzin (normalizacja). Zob. uwaga B.
5. Testy (kopia k-sym, pod flock (ścieżka lokalna)): tests/figury-recenzja.test.tsx, tests/figures-v2-zgodnosc-wsteczna.test.ts, tests/figures-v2-nakladka-fix4.test.tsx — 667 zielonych, 3 czerwone, 1 pominięty. Żaden czerwony nie dotyczy 7 rodzin; „rodzina v2 ready ⇒ bieżący skrót” zielony (przy nowych sha). Te same 3 warunki sprawdziłem węzłem na kopii a421cb8a bez zmian (techniquesOf, shownFigureSpec, wpis v1) — wynik ten sam, więc są czerwone już na gałęzi (zob. uwaga D).

## Uwagi bez progu (dla koordynatora)

A. a421cb8a ma w lib/figures/data.json `"v2": ["delt_raise"]` — fail-closed przy nieaktualnych skrótach. **Scalenie w tym stanie ukryłoby 7 rodzin w aplikacji.** W tym samym commicie co nowe sha: `node scripts/zrodla-runtime.mjs --write` i sprawdzenie, że v2 ma 8 rodzin (symulacja k-sym: tak). Verify i tak to blokuje (figury-recenzja.test.tsx).
B. Opis zlecenia przypisuje zmianę skrótów overlay.ts; faktycznie główną przyczyną jest reguly-cwiczen.json (w V2_WSPOLNE, nienormalizowany per rodzina — każdy nowy klucz rodziny unieważnia skróty wszystkich). Dodatkowo `bezObcychNakladek` (scripts/skrot-v2-norm.mjs:32-36) nie jest neutralna dla rodziny stojącej przed nowym wpisem: dla triceps zostaje przecinek „triceps: TRICEPS_TECHNIQUE, }”. Skutek tylko proceduralny (zbędna recenzja różnicy przy każdej nowej rodzinie), bez wpływu na użytkownika — NISKIE, do backlogu procesu, nie do tej gałęzi.
C. Skróty ważne dla drzewa a421cb8a; każda zmiana pliku z V2_WSPOLNE (w tym reguly-cwiczen.json przy następnej rodzinie) znów je unieważni — przeliczyć `--skroty` tuż przed zapisem.

D. Trzy czerwone testy z delt_raise, nie z 7 rodzin (do programisty przed verify):
   - tests/figures-v2-nakladka-fix4.test.tsx:77-78 — `NIE_RYSUJE = ['Machine Lateral Raise', 'Cable Seated Lateral Raise']`, a po wpisach „zestawy” z d18d02fc aplikacja rysuje u nich deltArmElevationFront + deltShoulderLevelRef. Zgodne z recenzją nakładki (docs/research/recenzje/delt-raise-nakladka-audytor-2026-11-09.md:34 — element był już na arkuszu, aplikacja go wstrzymywała tylko do recenzji zestawu). Do zmiany jest test, nie rysunek.
   - tests/figury-recenzja.test.tsx:60 — wpis v1 „Lateral Raise (hantle)” ma werdykt `wyswietlana`, a figura v2 jest teraz rysowana; wpis v1 powinien dostać `zastapiona` (tak jak w innych rodzinach po przejściu na v2).
   - tests/figury-recenzja.test.tsx:105-107 (ACG-002) — wzorzec plików rodzinnych nie zawiera `overlay/delt_raise.ts`; skrót rodziny i tak go liczy (`plikNakladki`), więc do zmiany jest tylko wzorzec w teście.

## Teksty do wpisów v2 w docs/research/figury-recenzja.json

Dla każdej z 7 rodzin: `sha` → nowe z tabeli; `data`, `autor`, `recenzent` (audytor), `werdykt`, `slad`, `cwiczenia`, `liczba` bez zmian.

Dopisek do `kto` (wspólny, na końcu, po „; ”):
„recenzja różnicy 09.11.2026 (audytor, nakładka delt_raise): delt-wlaczenie-wip @ a421cb8a względem figury/delt_raise @ 3a431da2 (kopie git archive) — skrót przeliczony z <STARY> na <NOWY>”

Dopisek do `uwagi` (na końcu):
„Recenzja różnicy 09.11.2026 (audytor, nakładka delt_raise): zmiana w plikach wspólnych tylko przez dodanie rodziny delt_raise (reguly-cwiczen.json — nowy klucz, overlay.ts — import i wpis DELT_RAISE_TECHNIQUE, families.ts/poseData.ts — podłączenie); components, scripts i złote dane bez zmian; md5 ruchu, śladu, błędów, nakładki (z kart i z aplikacji), VoiceOver, pozycji statycznych i czasu równe <N>/<N> po przeliczeniu data.json. Bez znalezisk dla rodziny.”

Podstawienia:
- squat: STARY b62f05ccc077, NOWY d353775e81c6, N 25
- bench_press: 3228d2db19d2 → 23df2cba043a, N 30
- hinge: 99bcd84b31c2 → aabd692e8c42, N 32
- pull_up: 236301a48766 → dbe9125c8303, N 11 (2 bez rysunku)
- curl: bae16e242470 → c21cd0a16aee, N 34 (2 bez rysunku)
- olympic: c21b4af3feb5 → c8c5aa1bbfc0, N 24 (1 bez rysunku)
- triceps: b6c6c320ef1c → 0d96e3066cfb, N 29 (3 bez rysunku)

## Obszary sprawdzone bez znalezisk
Dane i migracje (brak dotyku danych użytkownika); import/kopia (nie dotyczy); prywatność i sekrety (brak w diffie); dostępność (VoiceOver 7 rodzin równy po przeliczeniu data.json); liczby i twierdzenia (nakładka delt_raise bez liczb; 7 rodzin bez zmian); ryzyko Apple (brak).
