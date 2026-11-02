# chest_press_machine i cable_press — role mięśni, fala W2 (badacz-merytoryczny, 02.11.2026)

Cel: czy `muscleRoleRows` (lib/muscleRoles.ts:55) zwraca w tych rodzinach wiersze z `role: null`. Ustalone przez czytanie kodu i danych
(testów nie uruchamiałem — zakaz w briefie). Repo: gałąź `badania/w2-pchanie`.

## Jak liczony jest wiersz (dowód z kodu)

- Wiersze: regiony z `muscleLoadOf(e)` o udziale `>= MUSCLE_MIN_LOAD` (lib/muscleRoles.ts:57); `MUSCLE_MIN_LOAD = 0.5`
  (lib/figures/v2/muscles.ts:15). Regiony 0,25 NIE dają wiersza (komentarz w lib/muscleRoles.ts:27 mówi „0,25”, wartość w kodzie 0,5 — rozjazd
  komentarza, bez wpływu na wynik).
- `muscleLoadOf` (lib/seed.ts:153–161): region spoza pól `muscles`/`secondaryMuscles` z udziałem ≥ 0,5 wypada, < 0,5 zostaje z udziałem
  z katalogu; mięsień z pól podnosi swój najmocniejszy region do 1 (główny) albo 0,5 (pomocniczy).
- Rola: pierwsza pasująca reguła `nameRules` → `rules` (pattern, mięsień, rola) (lib/muscleRoles.ts:31–44); `role` ≠ null tylko, gdy funkcja
  ma `show` i tekst dla wariantu wzorca (lib/muscleRoles.ts:61). `noRegions` = tylko `neck` (scripts/zrodla-runtime.mjs:147).

## Ćwiczenia rodzin (przypisanie: lib/figures/v2/families.ts:110–113, pierwsza pasująca reguła)

| Ćwiczenie | Rodzina | pattern (catalog.generated.ts) | udział z katalogu | pola domyślne (P / S) | wiersze ≥ 0,5 |
|---|---|---|---|---|---|
| Machine Chest Press | chest_press_machine | h_push (:19) | chest 1, triceps 0,5, front_delt 0,5 (:734) | klatka / triceps (seed.ts:204) | chest 1, triceps 0,5 (front_delt wypada — „barki” spoza pól) |
| Leverage Incline Chest Press | chest_press_machine | h_push (:291) | chest 1, front_delt 0,5, triceps 0,5 (:1006) | klatka / barki, triceps (:1682) | chest, front_delt, triceps |
| Leverage Decline Chest Press | chest_press_machine | h_push (:290) | chest 1, triceps 0,5, front_delt 0,25 (:1005) | klatka / triceps (:1681) | chest, triceps |
| Machine Shoulder Press | chest_press_machine | v_push (:55) | front_delt 1, side_delt 0,5, triceps 0,5 (:770) | barki / triceps (seed.ts:206) | front_delt, side_delt, triceps |
| Smith Machine Shoulder Press | chest_press_machine | v_push (:172) | front_delt 1, triceps 0,5, side_delt 0,5 (:887) | barki / triceps (:1563) | front_delt, triceps, side_delt |
| Wyciskanie na linkach (stojąc) | cable_press | h_push (:20) | chest 1, triceps 0,5, front_delt 0,5, abs 0,25 (:735) | klatka / triceps (seed.ts:204) | chest, triceps |
| Single Arm Cable Chest Press | cable_press | h_push (:144) | chest 1, triceps 0,5, front_delt 0,5, obliques 0,25 (:859) | klatka / triceps (:1535) | chest, triceps |
| Seated Cable Chest Press | cable_press | h_push (:292) | chest 1, triceps 0,5, front_delt 0,5 (:1007) | klatka / triceps, barki (:1683) | chest, triceps, front_delt |
| Incline Cable Chest Press | cable_press | h_push (:293) | chest 1, front_delt 0,5, triceps 0,5 (:1008) | klatka / barki, triceps (:1684) | chest, front_delt, triceps |

Poza rodzinami: Seated Cable Shoulder Press (v_push, :359) — reguła `cable_press` wymaga h_push (families.ts:112), a nazwa nie zawiera
„machine shoulder press” (:113) → inna rodzina; nie sprawdzałem.

## Reguły dla tych wierszy (data/zrodla/role-miesni.json)

| pattern | mięsień | role | funkcja | status funkcji | tekst w runtime (lib/muscleRoles/data.json) |
|---|---|---|---|---|---|
| h_push | chest | main, aux | chest.shoulder_flex_add (:567–578) | ustalone (:306–325) | main i aux z wariantem h_push |
| h_push | triceps | main, aux | triceps.elbow_ext (:580–589) | ustalone (:387–406) | main i aux h_push/v_push |
| h_push | front_delt | main, aux | front_delt.shoulder_flex (:591–600) | ustalone (:326–345) | main i aux h_push/v_push |
| v_push | front_delt | main, aux | front_delt.shoulder_flex (:613–622) | ustalone | j.w. |
| v_push | side_delt | main, aux | side_delt.shoulder_abd (:624–633) | ustalone (:347–365) | main i aux v_push |
| v_push | triceps | main, aux | triceps.elbow_ext (:635–644) | ustalone | j.w. |

`exceptions.noRole` i `nameRules` nie zawierają żadnego z tych ćwiczeń (przeszukane nazwy „Machine”, „Cable”, „Leverage”: trafienia tylko
w nameRules shrugów i Cable Wrist Curl, role-miesni.json:1502–1520).

## Wynik

**Przy polach domyślnych: brak luk.** Każdy wiersz (udział ≥ 0,5) w 9 ćwiczeniach ma regułę z funkcją `ustalone` i tekstem dla wariantu
wzorca → `role` niepuste. Regiony bez reguły (abs 0,25 przy Wyciskaniu na linkach (stojąc), obliques 0,25 przy Single Arm Cable Chest Press,
front_delt 0,25 przy Leverage Decline) nie dają wiersza.

**Przypadek brzegowy (zmiana pól przez użytkownika):** gdy użytkownik doda „core” do mięśni głównych lub pomocniczych:
- Wyciskanie na linkach (stojąc): abs podniesione do 0,5/1 → wiersz abs bez reguły h_push → `role: null`.
- Single Arm Cable Chest Press: obliques (jedyny region „core” w mapie) → 0,5/1 → `role: null`.
Leverage Decline z dodanymi „barkami” — front_delt 0,5 ma regułę h_push → bez luki. Ocena realności: brzegowy (wymaga ręcznej zmiany pól);
skutek: wiersz bez zdania roli — zachowanie zgodne z zasadą „brak reguły → null, aplikacja nie zgaduje” (role-miesni.json:17).

## Propozycje nameRules

Brak. Funkcje docelowe dla przypadków brzegowych:
- abs w wyciskaniu stojąc → `abs.antilordosis` ma status `jedno_zrodlo` (role-miesni.json:266–284) — nameRule nie dałby wyświetlanego zdania.
- obliques w wyciskaniu jednorącz → funkcja „opór przed skrętem tułowia” nie istnieje w katalogu funkcji; `obliques.rotate_bend`
  („Pomaga skręcać i pochylać tułów”) opisywałby ruch, którego w ćwiczeniu nie ma — nie proponuję (ta sama luka co Single-Arm Push-Up
  w `pushup_plank-cz1.md` tej fali).

## Otwarte

| pozycja | powód / jak sprawdzić |
|---|---|
| Potwierdzenie wyniku uruchomieniem | wynik z czytania kodu; sprawdzenie: test z `muscleRoleRows({lib: true, libKey: k})` dla 9 kluczy z tabeli — oczekiwane wszystkie `role` niepuste; oraz z `secondaryMuscles: ['triceps', 'core']` dla 2 kluczy brzegowych — oczekiwany jeden wiersz `role: null` |
| Funkcja obliques „opór przed skrętem” (Single Arm Cable Chest Press, Single-Arm Push-Up) | brak przeczytanego źródła, które nazywa tę funkcję mięśni skośnych (W1, W2 cz1) |
| `abs.antilordosis` → status wyświetlany | drugie źródło wprost (otwarte w `pushup_plank-cz2.md` tej fali); Cugliari 2017 (PMC5384053) sprawdzony 02.11.2026 — nie nazywa funkcji |
| Komentarz lib/muscleRoles.ts:27 („0,25”) vs `MUSCLE_MIN_LOAD = 0.5` | rozjazd opisu z kodem — do programisty (nie zmieniam kodu) |

## Podsumowanie

Ćwiczeń sprawdzonych: 9 (chest_press_machine 5, cable_press 4). Luki przy polach domyślnych: 0. Przypadki brzegowe: 2 (po ręcznym dodaniu
„core”). Role gotowe (nowe nameRules): 0. Otwarte: 4. Nowe zdania: 0. Nowe źródła: 0.
