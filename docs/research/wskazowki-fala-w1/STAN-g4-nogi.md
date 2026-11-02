# STAN — fala W1, grupa G4 (nogi i biodra)

Data: 02.11.2026. Koordynator grupy G4 (agent). Gałąź `badania/g4-nogi` od `integracja-1-1` (15abc58). Tylko dane — bez zmian w kodzie, `lib/**`, `data/zrodla/*.json`, testach (polecenie właściciela 02.11.2026). Integruje koordynator linii 1.1.

Status wszystkich plików: **PROPOZYCJA**. Szczeble organizacji wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 (Breaking Muscle, Western SRS, PureGym, sprzedawcy, NFPT „Guest” = 5 itd.) zastosowane we wszystkich plikach poza tabelą źródeł `squat-cz2.md` (tam wszystkie ćwiczenia i tak otwarte — lista ocen do przeniesienia: sekcja „Stan korekty” w `kneeling_hinge.md`).

## Wynik na rodzinę (po korekcie szczebli)

Ćwiczenia rodziny = przypisanie `assignAll()` (lib/figures/v2); „własne” = tryb `own` w `lib/figures/v2/cue-sets.json` (nie badane). Role — luki = wiersze `muscleRoleRows` bez zdania.

| Rodzina | Ćwiczeń | Własne (już były) | Badane | Gotowe wskazówki | Otwarte | Luki ról | Role: propozycje / otwarte | Pliki |
|---|---|---|---|---|---|---|---|---|
| hinge | 32 | 7 | 25 | 7 | 18 | 3 rodzaje (upper_back main/aux, obliques main; 16 ćwiczeń) | 0 / 3 | `hinge-cz1.md`, `hinge-cz2.md`, `role-miesni-fala-w1/hinge.md` |
| squat | 25 | 5 | 20 | 6 | 14 | 7 par (adductors aux, abs aux ×3, obliques aux, front_delt aux, Wall Sit) | 0 / 7 (2 propozycje noRole) | `squat-cz1.md`, `squat-cz2.md`, `role-miesni-fala-w1/squat.md` |
| leg_machine | 8 | 3 | 5 + Hack Squat | 1 (Single Leg Press) | 4 + Hack Squat | 1 (adductors aux, Leg Press — jak squat) | — (w squat.md) | `leg_machine.md` |
| leg_isolation | 14 | 4 | 10 | 5 (1 warunkowo) | 5 | 1 (glutes aux, GHR) | 0 / 1 | `leg_isolation.md`, `role-miesni-fala-w1/leg_isolation.md` |
| hip_bridge | 11 | 3 | 8 | 2 | 6 | 1 (London Bridges, pattern other) | 0 / 1 | `hip_bridge.md`, `role-miesni-fala-w1/hip_bridge.md` |
| glute_floor | 7 | 0 | 7 | 5 | 2 | 2 (glutes aux) | razem z hip_abd_add | `glute_floor.md` |
| hip_abd_add | 8 | 0 | 8 | 1 (Lateral Band Walk) | 7 | 5 (glutes aux ×4, quads aux) | 2 / 5 (dla obu rodzin) | `hip_abd_add.md`, `role-miesni-fala-w1/hip_abd_add.md` |
| calf_raise | 13 | 3 | 10 | 6 | 4 | 0 | — | `calf_raise.md` |
| kneeling_hinge | 2 | 0 | 2 | 0 | 2 | 0 | — | `kneeling_hinge.md` |
| **Razem** | **120** | **25** | **95** | **33** | **62** | | **2 / 17** | |

Nowe zdania: łącznie ok. 110 zaproponowanych przez badaczy (suma raportów przed korektą szczebli; część dotyczy ćwiczeń, które po korekcie są otwarte — w plikach oznaczone jako częściowe). Dokładna lista: sekcja „Nowe zdania” każdego pliku.

### Hack Squat (karta „do poprawy”)
Drugie źródło o maszynie znalezione dla `hack.move`, `lp.heels`, `sq.kneesToes` (+ błąd `sq.mis.kneesIn`); `hack.setup` i `lp.hips` w obecnym brzmieniu nie mają 2 źródeł → propozycje `hack.setup2` (część wspólna szerokości stóp) i `hack.hips` (EN „pad”, nie „seat”; `lp.hips` zostaje przy Leg Press). Po korekcie (NFPT „Guest” = 5) karta wciąż poniżej minimum → **zostaje ukryta**. Wraca do gotowych, jeśli NFPT z biogramem zostanie uznane za szczebel 4. Po integracji wymaga nowej recenzji niezależnej (bramka 4).

## Do decyzji koordynatora linii 1.1 (wpływ na liczby wyżej)
1. **The Prehab Guys** — korekta w `leg_isolation.md` dała 5 (biblioteka w subskrypcji, bez kursów), w innych plikach (glute_floor, hip_abd_add, calf_raise, hip_bridge, leg_machine) liczone jako 4. Ocena graniczna; trzeba ujednolicić — przy 5 spadają m.in. Standing Leg Curl, Standing Cable Leg Curl, część kart glute_floor.
2. **Physitrack** — w `cues.json` → orgs szczebel 4, ale to platforma oprogramowania dla fizjoterapeutów: czy podpada pod „dokumentacja innych aplikacji”? Dotyczy m.in. Stiff-Legged Barbell Deadlift, wersji siedzących wspięć, Reverse Nordic, Cable Squat.
3. **NFPT „by Guest”** (biogram jednej osoby, ta sama data na różnych stronach) — 5 czy 4? Dotyczy Hack Squat, Smith Machine Calf Raise.
4. **Titan Fitness, Set For Set, strona J. Stoppaniego, Robertson Training Systems (certyfikacja?)** — oceny graniczne opisane w plikach.
5. **Breaking Muscle** w `data/zrodla/cues.json` → orgs ma dziś `level: 4` — wg rozstrzygnięcia 5; sprawdzić istniejące karty, w których jest drugim źródłem.
6. **Przeniesienie źródeł między wariantami** (calf: wersja z hantlami → sztanga siedząca) — `calf_raise.md`, sekcja korekty.

## Błędy zestawów ogólnych (`cue-sets.json`) — ważne przy integracji
Przy wielu wariantach przeczytane źródła nie potwierdzają zdań zestawu ogólnego albo im przeczą (szczegóły w „Otwarte” każdego pliku), m.in.: `hab.mis.high` przeczy źródłom przy Clamshell; `sq.down` („cofając biodra”) przeczy przy Double KB Front Squat; `lext.range` (do pełnego wyprostu) vs źródła „bez blokowania kolan”; `calf.move` (rozciągnięcie) niepotwierdzone przy wersjach z podłogi; `mis.roundBack` bez 2 źródeł przy żadnym z 14 wariantów hingeFloor; `lp.move` (platforma) przy Smith Machine Leg Press; zestaw `hingeFloor` nie pasuje do Barbell Hack Squat (to przysiad); `mis.jerk` przy ćwiczeniach z gumą.
Podejrzenie błędnego przypisania rodziny: **London Bridges** (w katalogu zejście rękami po linie, nie mostek biodrowy); **Smith Machine Reverse Calf Raise** (unoszenie palców — inny ruch).

## Role mięśni — wnioski
- `adductors.hip_ext` ma status „uproszczenie” (region = cała grupa, biodro prostuje przywodziciel wielki) — więcej źródeł tego nie zmieni; decyzja produktowa: pokazać uproszczenie albo zdanie prawdziwe dla całej grupy (22 pary).
- Propozycje: `glutes.hip_ext_rot` + reguła po nazwie dla Clamshell; `quads.hip_flex` (uproszczenie) dla Hip Flexion with Band; `exceptions.noRole` dla izometrii skośnych (One-Arm OH KB Squat) i barku (Overhead Squat).
- GHR: pośladek nie „pomaga prostować biodra” (biodro wyprostowane przez cały ruch — McAllister i in. 2014) — propozycja wpisu do `open`.
- Mięśnie utrzymujące w martwym ciągu: brak źródeł szczebla 2–3 (przegląd EMG 2020 ich nie rozstrzyga) — zostaje istniejące [OTWARTE].

## Zostało (następny krok)
- Korekta tabeli źródeł `squat-cz2.md` (lista w `kneeling_hinge.md` → „Stan korekty”).
- Opcjonalnie: drugie źródła dla otwartych (ISSA, NASM, Catalyst, producenci kettlebelli i maszyn); krok S26 (brzuch w przysiadzie przednim) w `role-miesni-fala-w1/squat.md` („Stan”).
- Po decyzjach z listy wyżej — przeliczenie gotowych.

## Pułapki
- ExRx: 403; web.archive.org i archive.ph zablokowane w narzędziu; NSCA (PDF) 403; topendsports poza siecią sesji; muscleandstrength 403.
- Zgadywane adresy BarBend, Breaking Muscle, NASM dają 404 — szukać wyszukiwarką. Prehab Guys: `theprehabguys.com/vimeo-video/<slug>/`.
- Wiele wyników wyszukiwania to strony innych aplikacji — pominięte (nie są źródłem, nazwy nie trafiają do repo).

## Git i verify
- Verify bazy (`npm run verify` na `integracja-1-1` 15abc58, czysta kopia): patrz raport końcowy niżej.
- Commity (lokalnie, wypchnięte po zielonym verify): b747803, 8ba6edb, 23c3a5c, 0976c5d, 10bb308, d2eadfd, 59bb94b, cc06d36, b01940b, c0f9e30, 8a9135e, 21b8b24, 26a4194, 97ad64d + ten plik.
