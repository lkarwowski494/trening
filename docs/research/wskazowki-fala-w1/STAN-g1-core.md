# Stan grupy G1 (core i tułów) — zbieranie danych, 02.11.2026

Gałąź `badania/g1-core` (od `integracja-1-1` @ 15abc58). Tylko pliki w `docs/research/wskazowki-fala-w1/` i `docs/research/role-miesni-fala-w1/`;
kod, `data/zrodla/`, `lib/` i testy bez zmian (polecenie właściciela 02.11.2026). Integracja — koordynator linii 1.1.

Szczeble źródeł wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 i jego uzupełnień 2 i 3 (zastosowane we wszystkich plikach; sekcje „Korekta szczebli 02.11.2026”, „… uzupełnienie 2” i „… uzupełnienie 3”). Po uzupełnieniu 3: Cable Woodchop 4 zdania, Kettlebell Windmill 6, Double Kettlebell Windmill 6, Reverse Hyperextension 3 (liczba gotowych ćwiczeń bez zmian).
Zdania, które straciły drugie źródło, są w plikach jako „kandydaci wstrzymani” / „otwarte” — z treścią i miejscami, nie do wdrożenia.

## Wynik na rodzinę — wskazówki techniki

Zakres: ćwiczenia bez własnych wskazówek (tryb ≠ own w `lib/figures/v2/cue-sets.json`). Przypisanie do rodzin: `assignAll()` z `lib/figures/v2`.

| Rodzina | Ćwiczeń | Miały własne | Badane | Gotowe | w tym warunkowo | Otwarte | Pliki |
|---|---|---|---|---|---|---|---|
| core_floor | 44 | 4 | 40 | 10 | 1 (Decline Crunch) | 30 | core_floor-1/2/3.md |
| core_standing | 19 | 2 | 17 | 4 | — | 13 | core_standing-1/2.md |
| core_hang | 4 | 0 | 4 | 2 | — | 2 | core_hang.md |
| back_extension | 4 | 1 | 3 | 2 | — | 1 | back_extension.md |
| neck | 5 | 0 | 5 | 2 | — | 3 | neck.md |
| **razem** | **76** | **7** | **69** | **20** | 1 | **49** | |

Gotowe (pierwszy blok JSON każdego pliku): Cable Crunch, Hollow Hold, Superman, Decline Crunch*, GHD Sit Up, V-Up, Bicycle Crunch, Machine Crunch,
Decline Reverse Crunch, Cable Reverse Crunch, Suspended Reverse Crunch; Cable Woodchop, Kettlebell Windmill, Side Bend (hantel), Double Kettlebell Windmill;
Hanging Leg Raise, Hanging Knee Raise; Reverse Hyperextension, Lower Back Curl; Isometric Neck Exercise - Sides, Isometric Neck Exercise - Front And Back (tylko przód) (* warunkowo).

Nowe zdania w gotowych kartach: **31** (id spoza `lib/cues/text/pl.json`, liczone z pierwszych bloków JSON), PL + propozycja EN w plikach.
Kandydaci (zdania z jednym źródłem, wstrzymani) — dodatkowo w plikach.

## Wynik na rodzinę — role mięśni

Zakres: 69 wierszy bez zdania roli (`muscleRoleRows`) w czterech rodzinach + 5 ćwiczeń szyi. Udziały główny/pomocniczy sprawdzone wyliczeniem aplikacji
(kontrola koordynatora w `role-miesni-fala-w1/core_floor.md`).

| Rodzina | Pary bez roli | Gotowe | Otwarte | Uwagi |
|---|---|---|---|---|
| core_floor | 27 | 18 | 9 | w tym podniesienie `abs.antilordosis` do dwóch źródeł (przegląd 2024 — zdanie ze wstępu) |
| core_standing | 37 | 13 | 24 | propozycja rozdzielenia `obliques.rotate_bend` na skręt i skłon boczny |
| core_hang | 4 | 3 | 1 | L-Sit — wyjątek noRole zostaje |
| back_extension | 1 | 1 | 0 | Lower Back Curl przez nameRules |
| neck | 5 | 3 (propozycja) | 2 (izometrie → noRole) | **decyzja właściciela A/B** (szyja dziś celowo bez opisu) |

Skośne w ćwiczeniach przeciw rotacji: nadal otwarte (jedno źródło, szczebel 5).

## Do decyzji (zebrane z plików)

Właściciel (produkt):
1. Szyja — opisy mięśni z jawnej listy ćwiczeń (A, rekomendacja badacza) czy bez opisu (B) — `role-miesni-fala-w1/neck.md`.
2. Toes to Bar — wariant ścisły czy z wymachem (od tego zależą zdania zestawu ogólnego) — `core_hang.md`.
3. Medicine Ball Full Twist — w źródłach ćwiczenie w parze; katalog bez partnera — `core_standing-1.md` (analityk).
4. Weighted Ball Side Bend — w źródłach leżenie bokiem na piłce; przypisany zestaw stojący — `core_standing-2.md`.

Koordynator linii / audytor (szczeble i reguła wariantu):
- dwa różne szpitale NHS = dwie organizacje? (od tego zależy `neck.isoFront.press`); karta „Front And Back” tylko z przodem; RelayHealth na stronie kliniki (logo w obrazku — nieodczytane); `core_standing.windmill.mis.elbow` — czy dwa źródła szczebla 4 z samym standardem („ręka prosta”) wystarczą bez źródła podającego błąd wprost; Experience Life na stronie windmilla (rola „coach at Life Time” bez certyfikatu na tej stronie — od tego zależy 6 vs 3 zdania Kettlebell Windmill i 6 vs 2 Double Kettlebell Windmill), ujednolicenie id zdań windmilla między core_standing-1 i -2; TeachMeAnatomy (cały rejestr ról — przy szczeblu 5 `lower_back.spine_ext` zostaje z jednym źródłem),
  Institute of Motion (firmowanie przez adres — Cable Woodchop), seria artykułów TRX (Suspended Reverse Crunch),
  Intermountain Health, platforma fizjoterapeutyczna obecna w `orgs` (nie liczona);
- wariant czy analogia: Decline Crunch, Decline/Cable Reverse Crunch, Double Kettlebell Windmill (karta bez zdania o drugim kettlebellu);
- Bicycle Crunch bez zdania ruchu — tryb own czy general; nowe brzmienie `core_standing.windmill.setup` (wymaga `claims.mjs --stub/--rehash`).

Możliwe błędy zestawów ogólnych (zdania bez potwierdzenia dla ćwiczenia, przypisane dziś): opisane w sekcjach „otwarte” każdego pliku — m.in. `mis.jerk`
przy ćwiczeniach bez obciążenia, `db.*` przy Scissor Kick, `cobra.*` przy Lower Back Curl, `llc.control`/`mis.jerk` przy Reverse Hyperextension na maszynie,
`pallof.noTwist` przy Pallofie z obrotem, `chop.close` przy Cable Woodchop, `bext.noArch` przy Weighted Ball Hyperextension.

## Pułapki dla integracji i kolejnej fali

- ExRx — 403; web.archive.org — zablokowane w narzędziu; JMU „Every Move Counts” — 503; Cal Poly Pomona — 404; UQ — 403.
- Wyszukiwarka zwraca głównie strony aplikacji treningowych (nie są źródłem).
- Nazwy z `tests/forbidden-names.json` występujące w plikach `docs/` (lista nie obejmuje `docs/`): klucz katalogu „Bosu Ball…”, producenci TRX, Technogym, Bowflex,
  Eleiko, Speediance. Przy przenoszeniu do `data/zrodla/` sprawdzić listę (Speediance — oceniony jako źródło niewystarczające, nie przenosić).
- ACE #331 — miejsce cytatu w `data/zrodla/cues-zestawy.json` do poprawy (strona bez numerowanych kroków) — `core_floor-2.md`.
- Id źródeł ról mięśni: robocze `S29-g1`… — wdrażający nada kolejne wolne numery.

## Następny krok

Kolejna fala (opcjonalnie): drugie źródło szczebla 4 dla zdań wstrzymanych — wskazówki w sekcjach „Stan” plików (Catalyst Athletics, ACE, NASM, ISSA,
artykuły BarBend o technice). Integracja gotowych bloków JSON — koordynator linii 1.1 (BRD, rejestr twierdzeń, tłumacz, recenzent lokalizacji, recenzja niezależna).

## Verify i wypchnięcia

- Pełne `npm run verify` bazy (`integracja-1-1` @ 15abc58, czysta kopia): **czerwone z przyczyn maszyny** — Jest 653/656 plików zielonych; 2 pliki przerwane
  sygnałem SIGTERM (`tests/maestro-flows.test.tsx`, `tests/matrix-dim-langs-routes3.test.tsx`), 1 przekroczenie limitu 5 s w haku pod obciążeniem
  (`tests/figures-v2-ui.test.tsx`). Wszystkie trzy uruchomione osobno (`--runInBand`): zielone (29/29 i 49/49 testów). Znacznik pełnego verify nie powstał.
- `verify:docs` względem `origin/integracja-1-1` (14 dokumentów): zielone (104/104 testów; pierwsze uruchomienie — chwilowy limit czasu w `tests/cues.test.tsx`,
  plik osobno zielony 16/16, powtórka zielona). Względem `origin/main` skrypt odsyła do pełnego verify (gałąź integracji ma kod, brak znacznika pełnego).
- Gałąź zawiera wyłącznie pliki `docs/research/` (sprawdzone `git diff --name-only origin/integracja-1-1...HEAD`).
- Wypchnięcie: `--no-verify` na podstawie wyjątku właściciela dla `badania/*` (docs/18-przekazanie.md, wpis 02.11.2026 „6 sesji badań treści w chmurze… zgoda
  na `--no-verify` wyłącznie dla gałęzi `badania/*` jako zapas”) — po próbie zwykłego wypchnięcia. SHA — w raporcie końcowym sesji.
