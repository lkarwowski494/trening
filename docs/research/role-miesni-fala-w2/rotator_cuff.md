# Role mięśni — rodzina `rotator_cuff` (fala W2, 02.11.2026)

Badacz merytoryczny. Wejście: plik ról W1 rodziny, `lib/muscleRoles.ts` (`muscleRoleRows`, linie 55–63: wiersze z udziałem `>= MUSCLE_MIN_LOAD`),
`lib/figures/v2/muscles.ts:15` (`MUSCLE_MIN_LOAD = 0.5`), `lib/catalog.generated.ts` (MUSCLE_LOAD, linie 888–890, 1108, 1112, 1118–1120; `pattern`
linie 173–175, 393, 397, 403–405), `data/zrodla/role-miesni.json` (funkcje, reguły po wzorcu, `nameRules`). Nic w kodzie ani danych nie zmieniam.

## 1. Pokrycie wierszy `muscleRoleRows` po W1

Wiersze pokazywane (udział ≥ 0,5). „Rola po W1” = reguła wzorca już w danych albo `nameRule` zaproponowany w W1.

| Ćwiczenie | Mięsień (udział) | Rola po W1 | Stan |
|---|---|---|---|
| External Rotation (linki) | rear_delt (0,5 aux) | nameRule → `rear_delt.shoulder_er` (W1) | ma rolę |
| External Rotation (hantel) | rear_delt (0,5 aux) | nameRule → `rear_delt.shoulder_er` (W1) | ma rolę |
| External Rotation with Band | rear_delt (0,5 aux) | nameRule → `rear_delt.shoulder_er` (W1) | ma rolę |
| Internal Rotation with Band | front_delt (0,5 aux) | nameRule → `front_delt.shoulder_ir` (W1) | ma rolę |
| Cable Internal Rotation | front_delt (0,5 aux) | nameRule → `front_delt.shoulder_ir` (W1) | ma rolę |
| Band Pull Apart | rear_delt (1 main) | reguła `isolation` + rear_delt + main → `rear_delt.shoulder_ext` (`role-miesni.json:941–950`) | ma rolę |
| Band Pull Apart | upper_back (0,5 aux) | nameRule → `upper_back.scap_retract` (W1) | ma rolę |
| Reverse Flyes With External Rotation | rear_delt (1 main) | reguła jak wyżej → `rear_delt.shoulder_ext` | ma rolę |
| Reverse Flyes With External Rotation | upper_back (0,5 aux) | nameRule → `upper_back.scap_retract` (W1) | ma rolę |
| Cuban Press | rear_delt (1 main) | reguła jak wyżej → `rear_delt.shoulder_ext` | ma rolę — **tekst nie pasuje** (pkt 2c) |
| Cuban Press | side_delt (0,5 aux) | nameRule → `side_delt.shoulder_abd` (W1) | ma rolę |
| Cuban Press | front_delt (0,5 aux) | — | [OTWARTE] (pkt 2a) |
| Cuban Press | upper_back (0,5 aux) | — | [OTWARTE] (pkt 2b) |

Wiersze z udziałem 0,25 (upper_back w rotacjach zewnętrznych, chest w wewnętrznych, side_delt w Reverse Flyes With External Rotation) nie są
pokazywane (`muscleRoleRows` filtruje `w >= MUSCLE_MIN_LOAD`) — ról nie dotyczy. Wszystkie wiersze rodziny poza dwoma parami Cuban Press mają rolę po W1
(pod warunkiem wklejenia nameRules z W1).

## 2. Cuban Press — pary otwarte

Ruch (potwierdzony w pliku wskazówek W2, `cubanRow` / `cubanRotate` / `cubanPressUp`): uniesienie łokci bokiem do poziomu (łokcie 90°), obrót ramion na zewnątrz
do pozycji „bramki” bez opuszczania łokci, wyciśnięcie nad głowę. Źródła ćwiczenia: BarBend (Lubinsky, 17.06.2024 — „the three heads of the delt are used”, bez
podziału na fazy, cytowane w W1 jako S34) i Fitness Volt (Dale; szczebel sporny — patrz plik wskazówek, Otwarte 1).

a. **[OTWARTE] front_delt (aux).** Istniejąca funkcja `front_delt.shoulder_flex` („Pomaga unosić ramię do przodu”) nie opisuje ruchu: w żadnej fazie ramię nie idzie
   do przodu (unoszenie bokiem, obrót, wyciskanie z ramionami w bok). `front_delt.shoulder_ir` (W1) — wprost sprzeczne (Cuban Press to rotacja zewnętrzna).
   Przedni akton może pomagać przy wyciskaniu nad głowę (uniesienie ramienia powyżej poziomu), ale nie znalazłem przeczytanego źródła, które przypisuje mu pracę
   w tym ćwiczeniu albo w tej fazie. Przeszukano: BarBend, Fitness Volt (Cuban Press), strony Catalyst, ACE, IMG Academy (bez treści). Propozycja: wpis
   w `withoutRole` / `pominiete` z powodem „brak funkcji opisującej ruch; brak źródła o fazie” — wiersz bez opisu (stan obecny).
b. **[OTWARTE] upper_back (aux).** Łopatka unosi się i obraca ku górze (wiosłowanie pionowe do poziomu, wyciskanie). `upper_back.scap_retract` („ściąga łopatki do siebie”)
   i `upper_back.scap_elevate` („Pomaga unosić barki”, tylko szrugsy) nie pasują — drugie wręcz kłóci się z techniką (wskazówka `cubanBlades`: łopatki w dół przed
   startem; unoszenie barków bywa podawane jako błąd). Nowa funkcja „obrót łopatki ku górze” wymagałaby źródeł anatomicznych (czworoboczny górny i dolny, zębaty
   przedni) i źródła o ćwiczeniu — w tej sesji nieszukane do końca (limit kontekstu). Propozycja: bez opisu do czasu takiej funkcji; trop: S1 (OpenStax, mięśnie
   łopatki), Ekstrom 2003 (S33 W1).
c. **[OTWARTE] rear_delt (main) — niedopasowany tekst.** Reguła `isolation` + rear_delt + main (`role-miesni.json:941–950`) daje Cuban Press tekst
   `rear_delt.shoulder_ext` („Odciąga ramię do tyłu”). W Cuban Press tylny akton nie wykonuje wyprostu ani odwodzenia poziomego; pracuje przy odwiedzeniu z rotacją
   zewnętrzną (W1: `rear_delt.shoulder_er` — S1, S6, S29 „assist in external rotation”). W1 uznał tę parę za „bez zmian” — moim zdaniem tekst opisuje inny ruch
   (błędne twierdzenie dziedzinowe = próg wydania). Opcje dla koordynatora: (A) nameRule rear_delt + main → `rear_delt.shoulder_er` dla Cuban Press — ale tekst „main”
   („Obraca ramię na zewnątrz”) przypisałby tylnemu aktonowi rolę głównego rotatora, a źródła mówią „assist” (główne: podgrzebieniowy, obły mniejszy — BarBend
   krok 2 „technically known as the infraspinatus”); (B) wyjątek „bez opisu” dla tej pary — rekomendacja B do czasu źródła, które opisuje pracę tylnego aktonu
   w tym ćwiczeniu. Sprawdzić też, czy udział `rear_delt: 1` (L2, „jedno źródło”, `catalog.generated.ts:2502`) jest właściwy — to pytanie do biblioteki L2, nie do ról.

## 3. Pozostałe uwagi

- `rear_delt.shoulder_ext` dla Band Pull Apart i Reverse Flyes With External Rotation: odwodzenie poziome w leżeniu przodem / w staniu z gumą — „odciąga ramię do tyłu”
  jest zgodne kierunkowo (pole `ruch` funkcji: „wyprost (także poziomy) i rotacja zewnętrzna”) — bez zmian.
- Brak nowych źródeł ani funkcji w tym pliku; źródła ćwiczeń — plik wskazówek W2 rodziny (`w2g2-rc-*`).
