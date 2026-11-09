# Recenzja różnicy: delt_raise z podłączeniem, 3a431da2 a b75b159d (audytor, 09.11.2026)

L-047: recenzent nie jest autorem (autor poprawki: programista delt_raise; zmiany 9cf56729/3a431da2 — przekład, wpis recenzji, dane runtime).

## Werdykt
Stan podłączony 3a431da2 jest pod względem rysunku **bajtowo równy** stanowi zrecenzowanemu (b75b159d z tym samym podłączeniem). Wpis v2 `delt_raise` może mieć `sha: b882c034cdce`. Znalezisk KRYTYCZNYCH, WYSOKICH ani ŚREDNICH: **brak**.

## Metoda
- Czysta kopia gałęzi figury/delt_raise @ 3a431da2. Podłączenie jak w fc16b55c: families.ts `delt_raise` status `ready`, poseData.ts `LOAD.delt_raise = require('./poses/delt_raise.json')`. DATA_UI.delt_raise już był w pliku.
- Kopie `git archive`: A = b75b159d + to samo podłączenie, B = 3a431da2 + podłączenie; A2 = A z data.json z B. `diff -r lib/figures/v2` A/B: identyczne.
- `git diff b75b159d 3a431da2`: lib/figures/v2, components, app, scripts, lib/cues, lib/locales/pl.json i tests/fixtures (w tym złote figury-v2-zlote.json) bez różnic. Różnice w kodzie i danych: lib/figures/data.json (tylko lista `v2`: dopisane `delt_raise`), 33 pliki lib/locales/*.json (4 klucze: Bokiem, Przodem, Naprzemiennie, „Pozycje na rysunku: {lista}”), tests/recenzja-wyjatki-1-1.test.ts (oczekiwana lista).

## Wyniki
- `node scripts/zrodla-runtime.mjs --skroty`: delt_raise = **b882c034cdce** w wt-deltrev, w A i w B (pliki ze skrótami A i B są bajtowo równe — wszystkie v1/v2/karty/zestawy). Przy podłączeniu zgadza się 7 pozostałych rodzin z wpisami (squat b62f05ccc077, bench_press 3228d2db19d2, hinge 99bcd84b31c2, pull_up 236301a48766, curl bae16e242470, olympic c21b4af3feb5, triceps b6c6c320ef1c). Podłączenie zmienia więc tylko skrót delt_raise (normalizacja families/poseData; doborRodziny liczy dobór po kartach dopiero przy figureSpec ≠ null).
- md5 rysunku (skrypt pomiarowy audytora: shapesAt z mięśniami i bez, styki, znaczki, trailFor (ślad), każdy błąd (errorsOf), guideShapes/overlayShapes z kart i z aplikacji, onDrawingCues (VoiceOver), staticPositions/Labels, loopOf/loopSpan, phasesFor, czas co 100 ms przez 4 s): A a B — **216/216 ćwiczeń z rysunkiem równych** (8 rodzin, w tym 31 delt_raise), 493 bez rysunku — po obu stronach tak samo. A2 a B: też 216/216. Lista `v2` w data.json nie zmienia nakładki ani doboru w wersji z aplikacji.
- Car Drivers (B): ruch 398de39a413a, ślad 83706410c605, czas 9fd645e43106, nakładka 200edc9c0c76, tech [] — jak w recenzji.
- Bez rysunku w delt_raise (7, jak dotąd): Barbell/Dumbbell/Smith Incline Shoulder Raise, Kettlebell Halo (+ with Overhead Extension), One-Arm Incline Lateral Raise, Sled Reverse Flye.
- Arkusze PNG nie liczone ponownie: kod rysunku, pliki póz i złote dane są bajtowo te same, a md5 kształtów i śladu jest równy, więc arkusze z recenzji 09.11.2026 obowiązują.

## Pola do zmiany we wpisie docs/research/figury-recenzja.json → v2.delt_raise
- `sha`: `4ebe9a6c45a9` → `b882c034cdce`
- `kto` (dopisek na końcu): „; recenzja różnicy 09.11.2026 (audytor): skrót przeliczony przy podłączeniu (families.ts ready, poseData.ts LOAD) na figury/delt_raise @ 3a431da2 — b882c034cdce, ten sam w b75b159d z podłączeniem; 4ebe9a6c45a9 liczono bez podłączenia (doborRodziny pomija dobór, gdy figureSpec = null)”
- `uwagi` (dopisek): „Recenzja różnicy 09.11.2026: 3a431da2 a b75b159d (oba z podłączeniem) — lib/figures/v2, components, scripts, złote dane bez zmian; md5 ruchu, śladu, błędów, nakładki, VoiceOver, statycznych i czasu 216/216 równe (31 delt_raise); różnice tylko w przekładzie 4 kluczy UI i liście v2 w data.json.”
- `slad`, `werdykt`, `cwiczenia`, `liczba` (38): bez zmian. W tym samym commicie podłączenie (families.ts, poseData.ts) i przeliczenie data.json (`node scripts/zrodla-runtime.mjs --write`). Uwaga: wpis z b882c034cdce bez podłączenia byłby nieaktualny (bez podłączenia skrót = 4ebe9a6c45a9) — rodzina zniknęłaby z listy v2; dlatego wpis i podłączenie razem.

## Uwagi do procesu
- `--skroty` i skrypt md5 to lekkie polecenia (~3 s); kolejka verify.lock była zajęta przez 4 przebiegi verify:lekkie/test-fast innych sesji, więc te polecenia uruchomiłem bez blokady. jest nie był uruchamiany.
- Repo nietknięte: nic nie zostało zcommitowane ani wypchnięte; worktree usunięty.
