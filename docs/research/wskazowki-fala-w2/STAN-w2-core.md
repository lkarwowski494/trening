# Stan grupy G1 (core) — fala W2, zbieranie danych, 02.11.2026

Gałąź `badania/w2-core` od `integracja-1-1` @ 2dc54e2. Tylko pliki w `docs/research/wskazowki-fala-w2/` i `docs/research/role-miesni-fala-w2/`;
kod, `data/zrodla/`, `lib/` i testy bez zmian. Punkt wyjścia: wyniki W1 z gałęzi `badania/g1-core` @ 9faaab2 (po uzupełnieniach szczebli 2 i 3).
Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` (gałąź `badania/lokalne-0211`). Fitness Volt, BarBend, Healthline, NFPT liczone jako 4 tylko
przy stronie z autorem z kwalifikacjami i datą (przy Fitness Volt bez nazwanego recenzenta — pytanie 1 niżej).

Uwaga integracyjna: rodziny core_floor, core_standing, core_hang, back_extension mają pozy v2 — karta własna wchodzi tylko z ≥ 1 błędem (docs/18, 02.11.2026).
Dlatego „gotowe” niżej = ustawienie + ruch + ≥ 1 błąd; w tej fali nie ma kart częściowych do wdrożenia poza dwiema kartami bez ustawienia (core_floor-3).

## Wynik na rodzinę — wskazówki

| Rodzina | Zbadanych w W2 | Nowe karty własne (z błędami) | Błędy dopisane do kart W1 | Błędy wnioskowane | Otwarte | Nowe zdania | Pliki |
|---|---|---|---|---|---|---|---|
| core_floor | 39 | 7 (Sit Up, Stability Ball Crunch*, Alternate Heel Touchers, Scissor Kick, Cross-Body Crunch*, Tuck Crunch, Stomach Vacuum*) + 2 bez ustawienia (Crunch - Hands Overhead, Crunch - Legs On Exercise Ball) | 11 kart (Cable Crunch, Superman, Hollow Hold, GHD Sit Up, V-Up, Bicycle Crunch, Machine Crunch, Decline Crunch*, Decline/Cable/Suspended* Reverse Crunch) | 5 | 20 | 28 | core_floor-1..4.md |
| core_standing | 14 | 5 (Barbell Side Bend, Pallof Press With Rotation, Cable Russian Twists, Landmine Rotation, Kettlebell Figure 8) | 1 (Side Bend) | 6 | 8 | 11 | core_standing-cz1/cz2.md |
| core_hang | 4 | 2 (Toes to Bar — wersja ścisła, L-Sit) | 0 (HLR, HKR miały błąd) | 2 | 0 | 7 razem z back_extension i neck | core_hang.md |
| back_extension | 3 | 0 | 2 karty (Reverse Hyperextension +1, Lower Back Curl +2) | 1 | 1 (Weighted Ball Hyperextension) | ↑ | back_extension.md |
| neck | 5 | 0 | 0 (izometrie miały błąd) | 0 | 3 (Lying Neck Extension/Flexion z talerzem, Neck Harness Extension) | ↑ | neck.md |
| **razem** | **65** | **14** (+2 bez ustawienia) | **14 kart** | **14** | **32** | **46** | |

\* warunkowo — warunek w pliku rodziny (szczebel strony albo „wariant czy analogia”).

## Wynik na rodzinę — role mięśni

| Rodzina | Gotowe / propozycje | Otwarte | Plik |
|---|---|---|---|
| core_floor | 1 gotowe (Scissor Kick abs → `abs.antilordosis`, usunięcie z `noRole`), 1 uproszczenie (Heel Touchers abs aux) | 7 (Bird Dog ×2, skośne aux w Dead Bug/Hollow Hold/Dragon Flag, Side Jackknife, Stomach Vacuum) | role-miesni-fala-w2/core_floor.md |
| core_standing | 10 (skośne przeciw rotacji — 2 badania szczebla 3: McGill 1991, Ng i in. 2001; prosty brzucha aux — propozycja funkcji `abs.brace`) | 14 (barki Landmine/Spell Caster, windmille, Bent Press, Figure 8) | role-miesni-fala-w2/core_standing.md (+ sekcja 6 w core_standing-cz2.md) |
| core_hang | 2 nowe (przedramiona w HLR/HKR → `forearms.grip`); L-Sit zostaje w `noRole` | 0 | role-miesni-fala-w2/core_hang.md |
| back_extension | 1 (Reverse Hyperextension — zdanie bez fazy „gdy się prostujesz”) | 0 (pytanie o wariant zdania w danych) | role-miesni-fala-w2/back_extension.md |
| neck | wariant A: 3 ćwiczenia z rolą przez `nameRules` (`neck.flex`/`neck.ext`, 2 źródła szczebla 3), 2 izometrie → `noRole` z powodem | — | role-miesni-fala-w2/neck.md |

Szyja — wdrożenie wymaga kodu, nie tylko JSON: `scripts/zrodla-runtime.mjs:147` (`noRegions: ['neck']`), `lib/muscleRoles.ts:32` (odcięcie szyi przed `nameRules`),
testy `tests/muscle-roles.test.ts:83, 107, 127–131, 151`, `REGION_MUSCLE.neck = null` — szczegóły w `role-miesni-fala-w2/neck.md` (wg badacza, nie sprawdzone przez koordynatora grupy).

## Do decyzji koordynatora linii 1.1 (zebrane z plików)

1. Fitness Volt bez nazwanego recenzenta — czy autor z kwalifikacjami + data wystarczają (od tego zależą: Barbell Side Bend, Cable Russian Twists, Landmine Rotation, Kettlebell Figure 8, Cross-Body Crunch, Tuck Crunch, Alternate Heel Touchers, Scissor Kick).
2. BarBend z podpisem „Certified Personal Trainer” bez organizacji (Landmine Rotation); NFPT — kwalifikacje autorki przeczytane na stronie ACE i jej powiązanie z ACE (Stability Ball Crunch); FIG (L-Sit); Speediance „4 warunkowo” (Pallof z obrotem).
3. Wariant czy analogia: Stomach Vacuum (karta szpitala o izometrii poprzecznego), Tuck Crunch (ACE #243/#52), Cross-Body Crunch bez zdania o skręcie (A — wchodzi / B — częściowa), dwie karty bez ustawienia (core_floor-3), Reverse Hyperextension bez `rhyp.setup`.
4. TRX „plank alignment” jako drugie źródło `plank.mis.sag` (Suspended Reverse Crunch) — ten sam blog co W1.
5. Funkcja `abs.brace` (nowa) i rozszerzenie reguły `core_anti_rot` + skośne na Bird Dog (core_floor).
6. Figury do sprawdzenia przy recenzji ruchu: Sit Up (bez mocnego zaokrąglenia i zaczepionych stóp), Hanging Leg Raise (zakres — Catalyst #45 opisuje do drążka), Tuck Crunch (uda pionowo), Stomach Vacuum (brak własnej pozy; karta zakłada leżenie), Scissor Kick (`note` katalogu mówi „crossed”, figura i źródła — góra–dół).
7. Przypisania zestawów ogólnych do sprawdzenia: `mis.jerk` przy ćwiczeniach bez obciążenia (7 z 9 w core_floor-3, Scissor Kick), `crunch.neck`/`crunch.lowBack` przy Heel Touchers; Weighted Ball Side Bend i Bosu Ball Cable Crunch With Side Bends — źródła opisują pozycje leżące/klęczne (rodzina core_standing wątpliwa); Spell Caster — opisy sprzeczne.

Produktowe (dla właściciela, bez zmian względem W1): Medicine Ball Full Twist (ćwiczenie w parze), Weighted Ball Side Bend (pozycja).

## Pułapki

- Miejsca cytatów przepisane z W1 bez ponownego otwarcia strony (GHD Sit Up — Catalyst/CrossFit; back_extension — ACE #64, Catalyst #529, StayWell, Les Mills; ExRx przy wariantach brzuszka — 403): przed wpisem do `data/zrodla/cues.json` otworzyć ponownie.
- Blokady sieci: ExRx 403, web.archive.org, educ.jmu.edu (jedyny trop szczebla 4 dla Oblique Crunches).
- PDF abstraktu ISB 2005 (role core_standing, R3) zawiera adres e-mail autorki — nie przenoszony do repo.
- Każde nowe zdanie: `node scripts/claims.mjs --stub`, przegląd, `--rehash`; tłumacz + recenzent lokalizacji; recenzja niezależna (autor ≠ recenzent).
- Role dla 9 ćwiczeń z core_floor-4: wiersze bez roli tych ćwiczeń są w liście W1 (role/core_floor.md) — nowych par brak (niesprawdzone uruchomieniem `muscleRoleRows`).

## Otwarte do kolejnej fali

32 ćwiczenia otwarte (powody w plikach rodzin) — głównie brak drugiego źródła szczebla 4 albo jedno źródło (Fitness Volt): Lying Leg Raise, Dragon Flag, Toe Touchers,
Stability Ball Knee Tuck, Standing Rope Crunch, Cable Seated Crunch, Oblique Crunches - On The Floor, Janda Sit-Up, Frog Sit-Ups, Decline Oblique Crunch,
Kneeling Cable Crunch With Alternating Oblique Twists, Leg Pull-In, Butt-Ups, Seated Flat Bench Leg Pull-In, Side Jackknife, Otis-Up, Cocoons,
Smith Machine Hip Raise, Press Sit-Up, Weighted Sit-Ups - With Bands; Seated Barbell Twist, Medicine Ball Full Twist, Bent Press, One-Arm High-Pulley Cable Side Bends,
Weighted Ball Side Bend, Cable Judo Flip, Bosu Ball Cable Crunch With Side Bends, Spell Caster; Weighted Ball Hyperextension; Lying Neck Extension, Lying Neck Flexion, Neck Harness Extension.

## Verify i wypchnięcia

- Pełne `npm run verify` bazy (`integracja-1-1` @ 2dc54e2, czysta kopia, 4 rdzenie): **zielone**, wyjście 0; Jest 659/660 plików w pierwszym przebiegu,
  `tests/maestro-flows.test.tsx` przerwany SIGTERM i ponowiony przez `jest-ponow` osobno — 49/49; znacznik pełnego verify zapisany (drzewo 8063b655e26c).
- `npm run verify:docs` (H1 — względem commitu z pełnym verify 2dc54e2): zielone, 104/104 testów; pierwsze uruchomienie z jawnym ref `origin/integracja-1-1` — 1 test czerwony z limitu czasu, 4 pliki osobno (`--runInBand`) zielone, powtórka zielona. Znacznik `dokumenty` zapisany.
- Wypchnięcie bez `--no-verify`: c4950a3 (wszystkie badania + STAN). Ten wpis — commit następny po c4950a3 na `badania/w2-core`.
- Pułapka: kontener ma płytki klon — `verify:docs` z domyślnym ref pada na `git merge-base origin/main` (brak wspólnego przodka); przed nim `git fetch --deepen=2000 origin main integracja-1-1`. Z jawnym ref znacznik dla haka nie powstaje (`scripts/verify-docs.mjs:103`).
