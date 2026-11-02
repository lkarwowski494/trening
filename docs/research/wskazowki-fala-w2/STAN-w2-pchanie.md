# STAN — G5 „pchanie”, fala W2 (koordynator grupy, 02.11.2026)

Zakres: tylko zbieranie danych (bez zmian w kodzie, `data/`, `lib/`, testach). Gałąź `badania/w2-pchanie` od `integracja-1-1` (2dc54e2c).
Punkt wyjścia: W1 na `badania/g5-pchanie` po przeliczeniu szczebli (c4c060e4, `przeliczenie-szczebli-2026-11-02.md` z sekcją
„Rozstrzygnięcia koordynatora 1.1”). Wszystkie rodziny G5 mają pozy v2 — karta bez błędu nie wchodzi (docs/18, 02.11.2026), więc fala
celowała w karty z co najmniej jednym błędem. Źródłem prawdy są bloki JSON „### Blok do wdrożenia” w plikach (liczby niżej policzone z nich skryptem).

## Wynik — wskazówki

| Rodzina | Pliki | Nowe karty z błędami | Błędy dopisane do kart W1 / repo | Błędy wnioskowane (wpisy) | Otwarte w zakresie |
|---|---|---|---|---|---|
| bench_press | `bench_press-cz1.md`, `-cz2.md`, `-cz3.md` | 7: Decline Bench Press (hantle), Floor Press (sztanga), Floor Press (hantle), Pin Press, Smith Machine Close-Grip Bench Press*, Close-Grip EZ-Bar Press*, Floor Press with Chains (warunkowo) | — | 6 | 15 (m.in. Decline BP sztanga, 3× Smith, Wide-Grip, Reverse Grip, Squeeze, KB Floor Press, Board, Reverse Band, Band/Chain Press, Guillotine, Decline CG to Skull; Close-Grip DB Press warunkowo poza blokiem) |
| pushup_plank | `pushup_plank-cz1.md`, `-cz2.md`, `-cz3.md` | 3: Decline Push Up, Suspended Push-Up, Suspended Fallout | Ab Wheel, Renegade Row (karty częściowe W1) | 5 | ok. 17 (Plyo Push-Up warunkowo poza blokiem — szczebel World Rugby) |
| overhead_press | `overhead_press.md`, `-cz2.md` | 4: Band Shoulder Press, Single Arm Overhead Press (hantel)*, Kettlebell Press, Kettlebell Seated Press* | Landmine Press (W1); Overhead Press (sztanga), Overhead Press (hantle), Seated Shoulder Press (hantle) (karty w repo) | 3 | 9 (zza karku ×2, Bradford, See-Saw, Pike, Handstand, Double KB, KB Arnold, Seated Cable, jammery ×2) |
| chest_fly | `chest_fly-cz1.md`, `-cz2.md` | 3: Incline Chest Fly (hantle), Pullover (hantel), Svend Press (warunkowo; bez póz v2) | Cable Fly (low to high), Band Chest Fly (W1) | 4 | 13 |
| dip | `dip.md` | 1: Chest Dip | — | 0 | 3 (Triceps Dip, Ring Dips, Dip Machine) |
| cable_press | `cable_press.md` | 1: Seated Cable Chest Press* | — | 0 | 2 |
| chest_press_machine | `chest_press_machine.md` | 0 | Machine Chest Press (karta w repo, do decyzji) | 0 | 3 |
| **Razem** | 13 plików | **19** (w tym 3 warunkowe) | **5 kart W1 + 4 karty w repo** | **18** | |

`*` — z oznaczeniem `uproszczenie: wariant sprzętu …` (do potwierdzenia przez recenzenta). Nowe zdania: sekcje „Nowe zdania” w plikach (PL + EN),
ok. 45 w blokach do wdrożenia; zdania wspólne (`push.mis.sag`, `fly.mis.elbows`, `press.mis.lock`, `rollout.mis.bentArms`) — dodać raz.

## Wynik — role mięśni (`docs/research/role-miesni-fala-w2/`)
Gotowe: 0. Propozycja `nameRules` z jednym źródłem: Push Press - Behind the Neck — czworogłowe (`quads.knee_ext`, „jedno źródło”). Otwarte: luki W1
w chest_fly (Bent-Arm Pullover, Around The Worlds, Crucifix), dip (Dip Machine), pushup_plank (prosty brzucha w deskach i rolloutach, anty-rotacja, Mountain
Climbers, Copenhagen), overhead_press (jammery, See-Saw). chest_press_machine i cable_press: 0 luk przy polach domyślnych (wynik z czytania kodu, nie
z uruchomienia — sposób sprawdzenia w `chest_press_machine-cable_press.md`).

## Decyzje dla koordynatora linii 1.1 (szczeble, od których zależą karty)
1. Fitness Volt z autorem z kwalifikacjami w podpisie i datą widoczną na stronie, bez recenzenta → przyjęte 4 (Decline Push Up, Suspended Push-Up,
   Floor Press (sztanga), Decline Bench Press (hantle)); „Dr. Malik” bez nazwiska i certyfikatu → 5 przyjęte w `pushup_plank-cz1`, ale Svend Press
   (chest_fly-cz2) opiera się na nim warunkowo. Data tylko w metadanych → 5 (Close-Grip DB Press, Triceps Dip).
2. NFPT `nfpt-incline-fly` — biogram R. Bovee i data 11.08.2025 (W1 dało 5 za podpis „Guest”) → od tego zależy Incline Chest Fly.
3. Performance Menu (czasopismo Catalyst Athletics, 2007; autor bez certyfikatu) → Floor Press with Chains.
4. World Rugby Passport (federacja sportowa, program bez daty) → Plyo Push-Up.
5. elitefts (artykuł o board press z linkami do własnych desek) — 4 warunkowo; StrongFirst bez widocznej daty → od tego `ohp.mis.sideLean`.
6. GoodLife (sieć klubów, autorka z certyfikatem) — nie wpływa na wynik.
7. Interpretacja Band Bench Press / Chain Press (rysunek: uchwyty, `lib/figures/v2/variants.ts:39–41, 108–109` wg badacza) i Clock Push-Up — bez zmian od W1.

## Sygnały poza zakresem (do sprawdzenia przy integracji)
- `MUSCLE_MIN_LOAD = 0.5` (`lib/figures/v2/muscles.ts:15`), a komentarz `lib/muscleRoles.ts:27` mówi „0,25” — rozjazd opisu z kodem (sprawdzone 02.11.2026).
- Karta w repo „Seated Shoulder Press (hantle)” cytuje `ace-186` przy `ohp.seat`, `ohp.elbowsUnder`, `ohp.fullExt`; badacz W2 podaje, że ACE #186 to
  wyciskanie na maszynie — do potwierdzenia u źródła (nieprzeczytane przez koordynatora grupy), wtedy oznaczenie „wariant sprzętu” albo inne źródło.
- Eleiko „Resources” = 5 po uzupełnieniu 3 — istniejące karty „Wyciskanie na linkach (stojąc)” i „Machine Shoulder Press” do przeliczenia (`cable_press.md`).
- Zestaw ogólny: `ohp.mis.lock` — kolejne źródła (NSCA, ISSA, Catalyst) każą w pełni prostować łokcie; `ohp.mis.shrug` — ISSA podaje odwrotność;
  zestaw `dip` (`bdip.*` z ławki) — po wdrożeniu Chest Dip warto użyć `dip.setup`/`dip.move` dla poręczy; `po.slow` przy Front Raise And Pullover
  i `raiseSide` przy Crucifix — potwierdzone jako niepasujące (bez źródła szczebla ≤ 4).
- `cgbp.mis.flare` pasuje też do istniejącej karty „Close Grip Bench Press” (dziś bez błędów).

## Verify i wypchnięcia
- Pełne `npm run verify` na czystej bazie `integracja-1-1` (2dc54e2c), 02.11.2026: **zielone** (znacznik `pelne`, drzewo 8063b655e26c);
  jest 659/660 plików w pierwszym przebiegu, `tests/maestro-flows.test.tsx` przerwany (pamięć workera) — ponowienie `jest-ponow` zielone (49/49).
- `npm run verify:docs`: przed każdym wypchnięciem zielone; pierwszy przebieg raz czerwony na znanej niestabilności `tests/cues.test.tsx`
  („Jest environment after it has been torn down”, ta sama co w W1) — powtórka zielona.
- Hak pre-push odmawia, gdy w worktree leżą niezatwierdzone pliki — wypychać po zatwierdzeniu wszystkiego.
- Commity: 98db20f6 (bench cz2), 2f374d8a (chest_fly, pushup_plank), 39f8ef72 (overhead_press), 0639b3c (bench cz1), f9153503 (dip, linki, maszyny), runda 2 + STAN — commit z tym plikiem.

## Zostało (następny krok)
- Integracja przez koordynatora 1.1 z niezależną recenzją kart (L-047); recenzent sprawdza zwłaszcza uproszczenia „wariant sprzętu” i błędy wnioskowane.
- Kolejna fala dla otwartych: ćwiczenia z jednym źródłem szczebla 4 (lista w sekcjach „Otwarte” i „Zostało” plików) — szukać drugiego źródła pod
  konkretne zdanie; trop Double Kettlebell Press: Catalyst #855.
- Pułapki: ExRx 403, web.archive.org zablokowane, NASM część adresów 404, Stack 503, elitefts często 404, Titan Fitness 403.
