# STAN — fala W1, grupa G4 (nogi i biodra)

Data: 02.11.2026. Koordynator grupy G4 (agent). Gałąź `badania/g4-nogi` od `integracja-1-1` (15abc58). Tylko dane — bez zmian w kodzie, `lib/**`, `data/zrodla/*.json`, testach (polecenie właściciela 02.11.2026). Integruje koordynator linii 1.1.

Status wszystkich plików: **PROPOZYCJA**. Szczeble organizacji wg obu rozstrzygnięć koordynatora linii 1.1 z 02.11.2026 (1: Breaking Muscle, Western SRS, PureGym, sprzedawcy, NFPT „Guest” = 5 itd.; 2: Physitrack = 5, The Prehab Guys i Coach = 4 tylko z autorem z kwalifikacjami — oceniane per strona, uczelniane centra sportu bez autora = 5, reguła „błąd = zaprzeczenie standardu”) zastosowane we wszystkich 11 plikach (sekcje „Korekta szczebli” i „Korekta szczebli 2” na początku każdego pliku).

## Wynik na rodzinę (po korekcie szczebli)

Ćwiczenia rodziny = przypisanie `assignAll()` (lib/figures/v2); „własne” = tryb `own` w `lib/figures/v2/cue-sets.json` (nie badane). Role — luki = wiersze `muscleRoleRows` bez zdania.

| Rodzina | Ćwiczeń | Własne (już były) | Badane | Gotowe wskazówki | Otwarte | Luki ról | Role: propozycje / otwarte | Pliki |
|---|---|---|---|---|---|---|---|---|
| hinge | 32 | 7 | 25 | 4 (Single Leg RDL hantel i linki, Cable Pull Through, Clean Deadlift) | 21 | 3 rodzaje (upper_back main/aux, obliques main; 16 ćwiczeń) | 0 / 3 | `hinge-cz1.md`, `hinge-cz2.md`, `role-miesni-fala-w1/hinge.md` |
| squat | 25 | 5 | 20 | 1 (Barbell Hack Squat) | 19 | 7 par (adductors aux, abs aux ×3, obliques aux, front_delt aux, Wall Sit) | 0 / 7 (2 propozycje noRole) | `squat-cz1.md`, `squat-cz2.md`, `role-miesni-fala-w1/squat.md` |
| leg_machine | 8 | 3 | 5 + Hack Squat | 0 | 5 + Hack Squat | 1 (adductors aux, Leg Press — jak squat) | — (w squat.md) | `leg_machine.md` |
| leg_isolation | 14 | 4 | 10 | 1 (Stability Ball Hamstring Curl) | 9 | 1 (glutes aux, GHR) | 0 / 1 | `leg_isolation.md`, `role-miesni-fala-w1/leg_isolation.md` |
| hip_bridge | 11 | 3 | 8 | 1 (Single Leg Glute Bridge) | 7 | 1 (London Bridges, pattern other) | 0 / 1 | `hip_bridge.md`, `role-miesni-fala-w1/hip_bridge.md` |
| glute_floor | 7 | 0 | 7 | 2 (Clamshell, Donkey Kick) | 5 | 2 (glutes aux) | razem z hip_abd_add | `glute_floor.md` |
| hip_abd_add | 8 | 0 | 8 | 1 (Lateral Band Walk) | 7 | 5 (glutes aux ×4, quads aux) | 2 / 5 (dla obu rodzin) | `hip_abd_add.md`, `role-miesni-fala-w1/hip_abd_add.md` |
| calf_raise | 13 | 3 | 10 | 2 (Smith Machine Calf Raise, Band Calf Raise) | 8 | 0 | — | `calf_raise.md` |
| kneeling_hinge | 2 | 0 | 2 | 0 | 2 | 0 | — | `kneeling_hinge.md` |
| **Razem** | **120** | **25** | **95** | **12** | **83** | | **2 / 17** | |

Przebieg liczby gotowych: 33 po zebraniu → po korekcie 1 → **12 po korekcie 2**. Większość otwartych ma zebrane dane częściowe (zdania z 2 źródłami) — brakuje zwykle 1 zdania do minimum albo drugiego źródła szczebla 4 przy ustawieniu.

Nowe zdania: łącznie ok. 110 zaproponowanych przez badaczy (suma raportów przed korektą szczebli; część dotyczy ćwiczeń, które po korekcie są otwarte — w plikach oznaczone jako częściowe). Dokładna lista: sekcja „Nowe zdania” każdego pliku.

### Hack Squat (karta „do poprawy”)
Drugie źródło o maszynie znalezione dla `hack.move`, `lp.heels`, `sq.kneesToes` (+ błąd `sq.mis.kneesIn`); `hack.setup` i `lp.hips` w obecnym brzmieniu nie mają 2 źródeł → propozycje `hack.setup2` (część wspólna szerokości stóp) i `hack.hips` (EN „pad”, nie „seat”; `lp.hips` zostaje przy Leg Press). Po korekcie (NFPT „Guest” = 5) karta wciąż poniżej minimum → **zostaje ukryta**. Wraca do gotowych, jeśli NFPT z biogramem zostanie uznane za szczebel 4. Po integracji wymaga nowej recenzji niezależnej (bramka 4).

## Do decyzji koordynatora linii 1.1 (wpływ na liczby wyżej)
1. **NFPT „by Guest” z ramką autora (R. Bovee, ta sama data na różnych stronach)** — dziś 5. Jeśli biogram = autor → wracają Hack Squat i Single-Leg Leg Extension (i `calf.mis.bounce` przy Smith Machine Calf Raise).
2. **Coach: trener cytowany w artykule dziennikarza** — czy wystarcza? Jeśli tak → wraca m.in. Bodyweight Squat.
3. **`data/zrodla/cues.json` → `orgs`** wymaga zmian przy integracji: Physitrack → 5; Breaking Muscle → 5; Coach i The Prehab Guys — szczebel per strona (autor), nie per organizacja; sprawdzić istniejące karty, w których te źródła są drugim źródłem (np. Standing Calf Raise).
4. Oceny graniczne opisane w plikach: strona J. Stoppaniego (Good Morning off Pins), Set For Set, EliteFTS (=4 w squat-cz2), Robertson Training Systems (certyfikacja), Titan Fitness (=5).
5. **Przeniesienie źródeł między wariantami** (calf: wersja z hantlami → sztanga siedząca) — `calf_raise.md`, sekcja korekty.

## Błędy zestawów ogólnych (`cue-sets.json`) — ważne przy integracji
Przy wielu wariantach przeczytane źródła nie potwierdzają zdań zestawu ogólnego albo im przeczą (szczegóły w „Otwarte” każdego pliku), m.in.: `hab.mis.high` przeczy źródłom przy Clamshell; `sq.down` („cofając biodra”) przeczy przy Double KB Front Squat; `lext.range` (do pełnego wyprostu) vs źródła „bez blokowania kolan”; `calf.move` (rozciągnięcie) niepotwierdzone przy wersjach z podłogi; `mis.roundBack` bez 2 źródeł przy żadnym z 14 wariantów hingeFloor; `lp.move` (platforma) przy Smith Machine Leg Press; zestaw `hingeFloor` nie pasuje do Barbell Hack Squat (to przysiad); `mis.jerk` przy ćwiczeniach z gumą.
Podejrzenie błędnego przypisania rodziny: **London Bridges** (w katalogu zejście rękami po linie, nie mostek biodrowy); **Smith Machine Reverse Calf Raise** (unoszenie palców — inny ruch).

## Role mięśni — wnioski
- `adductors.hip_ext` ma status „uproszczenie” (region = cała grupa, biodro prostuje przywodziciel wielki) — więcej źródeł tego nie zmieni; decyzja produktowa: pokazać uproszczenie albo zdanie prawdziwe dla całej grupy (22 pary).
- Propozycje: `glutes.hip_ext_rot` + reguła po nazwie dla Clamshell; `quads.hip_flex` (uproszczenie) dla Hip Flexion with Band; `exceptions.noRole` dla izometrii skośnych (One-Arm OH KB Squat) i barku (Overhead Squat).
- GHR: pośladek nie „pomaga prostować biodra” (biodro wyprostowane przez cały ruch — McAllister i in. 2014) — propozycja wpisu do `open`.
- Mięśnie utrzymujące w martwym ciągu: brak źródeł szczebla 2–3 (przegląd EMG 2020 ich nie rozstrzyga) — zostaje istniejące [OTWARTE].

## Zostało (następny krok)
- Domknięcie otwartych: przy większości brakuje 1 zdania albo drugiego źródła szczebla 4 z autorem z kwalifikacjami (szukać: ISSA, NASM, ACE, Catalyst, artykuły Coach autorów-trenerów, producenci maszyn — instrukcje własnego sprzętu, szpitale/zdrowie publiczne).
- Opcjonalnie: drugie źródła dla otwartych (ISSA, NASM, Catalyst, producenci kettlebelli i maszyn); krok S26 (brzuch w przysiadzie przednim) w `role-miesni-fala-w1/squat.md` („Stan”).
- Po decyzjach z listy wyżej — przeliczenie gotowych.

## Pułapki
- ExRx: 403; web.archive.org i archive.ph zablokowane w narzędziu; NSCA (PDF) 403; topendsports poza siecią sesji; muscleandstrength 403.
- Zgadywane adresy BarBend, Breaking Muscle, NASM dają 404 — szukać wyszukiwarką. Prehab Guys: `theprehabguys.com/vimeo-video/<slug>/`.
- Wiele wyników wyszukiwania to strony innych aplikacji — pominięte (nie są źródłem, nazwy nie trafiają do repo).

## Git i verify
- Verify bazy (`npm run verify` na `integracja-1-1` 15abc58, czysta kopia, 02.11.2026): **CZERWONE** (EXIT 1, jest 3287 s). Test Suites: 3 failed / 653 passed; Tests: 1 failed / 15905 passed. Porażki: `tests/deload-ui.test.tsx:72` („Dziś” na ekranie treningu… — przekroczony limit 5000 ms) oraz `tests/maestro-flows.test.tsx` i `tests/matrix-dim-langs-routes3.test.tsx` (proces roboczy jest zabity z zewnątrz, SIGTERM; w logu Mark-Compact ok. 2 GB). `jest-ponow`: „1 porażek innych niż przerwanie z zewnątrz — bez ponawiania”. Prawdopodobnie obciążenie maszyny (równolegle jeden jednoplikowy przebieg jest w drugim worktree i 8 badaczy — bez testów), ale nie potwierdzone: zgodnie z briefem bez ponownego uruchamiania.
- `npm run verify:docs` w worktree: pada przed sprawdzeniem — `git merge-base origin/main HEAD` bez wspólnej bazy (klon płytki, także po `git fetch origin main`).
- Push: hak pre-push odmówił (brak znacznika zielonego verify dla bc52101 — L-049). Bez `--no-verify`. **Commity tylko lokalnie w kontenerze** — ryzyko utraty po zamknięciu sesji; do decyzji koordynatora (ponowne verify bazy albo świadomy wyjątek).
- Commity (lokalnie, NIEWYPCHNIĘTE): b747803, 8ba6edb, 23c3a5c, 0976c5d, 10bb308, d2eadfd, 59bb94b, cc06d36, b01940b, c0f9e30, 8a9135e, 21b8b24, 26a4194, 97ad64d 367447c, 2ac8b77, bd989c9 + ten plik.
