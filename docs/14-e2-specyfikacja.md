# 14 Specyfikacja E2 „Zamiana ćwiczenia w trakcie treningu”

Wersja 04.10.2026. Status: **specyfikacja przed implementacją** (zasada projektu: testy przed kodem). Podstawa: decyzje właściciela z 04.10.2026 — [docs/13, A5](13-research-e2-i-sdk.md#a5-decyzje-dla-właściciela-rekomendacja-pierwsza) (blok „04.10.2026 — decyzje właściciela”) — oraz model miejsc i sprzętu z [docs/10](10-miejsca-i-sprzet.md). Kod czytany na gałęzi `upgrade/sdk-57` (commit 26fa739). Numery linii `plik:linia` dotyczą tego commitu.

**Zakres (decyzje 04.10):** W1 „zamień tylko dziś” + W3 zamienniki per miejsce w szablonie (D1 c, D2 a), przycisk ukryty po odhaczeniu wszystkich serii (D3 a), przerwa z planu i własna przerwa zamiennika w szablonie (D4 a), „ten sam ruch, inny przyrząd” (D5 a), zamiana w edytorze historii (D6 b), tabela top-3 do przejrzenia przed wydaniem (D7 a), „Powtórz ostatni” bez zmian (D8 a).

**Wydanie:** osobne wydanie **po scaleniu SDK 57**, nie razem z aktualizacją SDK (docs/13, „W skrócie” pkt 6). Schemat 16 jest jednokierunkowy dla kopii (pkt 2.4) — dlatego aktualizacja SDK powinna być sprawdzona na telefonie, zanim pójdzie zmiana schematu. **Decyzja właściciela 04.10.2026:** SDK 57 scalane bez testu na telefonie; ewentualny problem z HealthKit — poprawka w następnej wersji. Ryzyko: jeśli trzeba będzie wrócić do wersji sprzed schematu 16, kopie zrobione na schemacie 16 nie wczytają się w starszej wersji (pkt 2.4).

---

## 1. Słownik

| Termin | Znaczenie |
|---|---|
| A, B | A — ćwiczenie w bloku przed zamianą (zwykle z pozycji szablonu), B — zamiennik |
| zamiana w miejscu | blok bez odhaczonych serii zmienia ćwiczenie (przypadek 1 z docs/13 A4) |
| podział | blok z częścią odhaczonych serii: A zostaje z odhaczonymi, B dostaje resztę jako nowy blok (przypadek 2) |
| zamiennik per miejsce | wpis w pozycji szablonu „w miejscu Dom zamiast A robię B” (W3) |
| podpowiedź zamiennika | linijka w bloku A po starcie: „Zwykle w: Dom — B. Zamienić?” (nigdy automatycznie) |
| przepięcie (D6) | zamiana w edytorze historii: odhaczone serie bloku przechodzą pod inne ćwiczenie |

## 2. Model danych — schemat 15 → 16

### 2.1 Nowe pola

Typy w `lib/seed.ts` (`TemplateItem` — `lib/seed.ts:77`, `WExercise` — `lib/seed.ts:85`, `SCHEMA_VERSION = 15` — `lib/seed.ts:10`).

| Pole | Typ | Gdzie żyje | Po co |
|---|---|---|---|
| `WExercise.swappedFrom?` | `string` (id ćwiczenia) | trening w toku i historia | linijka „zamiast: …”, „↺ cofnij”, ranking „wcześniej zamieniane”, dobór „Poprzednio” (pkt 3.6) |
| `WExercise.implPinned?` | `true` | trening w toku i historia | przyrząd wybrany ręcznie (D5); `restampUntouched` go nie nadpisuje |
| `WExercise.splitFrom?` | `string` (id bloku A) | **tylko trening w toku** | powiązanie B z A po podziale: liczenie rund supersetu (pkt 3.5) i scalenie przy „cofnij” |
| `WExercise.altSkip?` | `true` | **tylko trening w toku** | podpowiedź zamiennika odrzucona „✕” w tym treningu |
| `TemplateItem.alternates?` | `TemplateAlt[]` | szablon | zamienniki per miejsce (W3) |
| `TemplateAlt` | `{ locationId: string; exerciseId: string; restSec: number \| null; impl?: Impl }` | — | `restSec` null = przerwa pozycji szablonu (D4, decyzja 04.10: wariant a); `impl` — tylko przy odpowiedzi (a) na pytanie P5 |

**Odstępstwo od docs/10 pkt 3.3** (`alternates?: { [locationId]: exerciseId }`): tablica obiektów zamiast mapy, bo (1) zamiennik ma własną przerwę (decyzja D4), (2) klucze-id z importu w mapie trafiają na `Object.prototype` (ta sama klasa błędu co runda 55 — `own()` w `lib/seed.ts`), (3) stała kolejność ułatwia idempotentną migrację. Unikalność `locationId` w obrębie pozycji pilnuje migracja.

`SCHEMA_VERSION = 16` z komentarzem jak przy 15. Pola opcjonalne: blok bez zamiany i szablon bez zamienników wyglądają **bit w bit** jak w schemacie 15.

### 2.2 `migrate()` — sanityzacja (idempotentna)

Miejsca w kodzie: pozycje szablonów `lib/store.ts:230`, bloki treningów `lib/store.ts:252` (wewnątrz `fixWorkout`, `lib/store.ts:249`), usuwanie pozycji z brakującym ćwiczeniem `lib/store.ts:265-266`.

| # | Pole | Reguła |
|---|---|---|
| M1 | `swappedFrom` | `idOf(v)` → tekst; brak / nie-id → `delete`; równe `exerciseId` bloku → `delete`. Istnienia ćwiczenia **nie** sprawdzamy (jak `tplItemId`) — UI znosi brak (pkt 3.8) |
| M2 | `implPinned` | zostaje tylko `=== true` **i** gdy blok ma znany `impl` (po sanityzacji `impl` z `lib/store.ts:252`); inaczej `delete` |
| M3 | `splitFrom` | trening w toku: `idOf` albo `delete`; w historii zawsze `delete` (jak `staleAck`) |
| M4 | `altSkip` | trening w toku: tylko `=== true`; w historii zawsze `delete` |
| M5 | `alternates` | nie-tablica → `delete`; wpisy: `arr()`, `locationId`/`exerciseId` przez `idOf` (brak → wpis odpada), `restSec` jak `it.restSec` (`parseNum`, < 0 → `null`, `min(1800, round)`), `impl` tylko z `IMPLS`, inne klucze usuwane (biała lista jak `fixLocations`); duplikat `locationId` → zostaje pierwszy; `exerciseId === it.exerciseId` bez `impl` → odpada |
| M6 | `alternates` (po filtrze ćwiczeń) | w tym samym kroku co `lib/store.ts:266`: wpis z brakującym albo zarchiwizowanym ćwiczeniem odpada; pusta tablica → `delete` |
| M7 | `alternates` a usunięte miejsce | wpis **zostaje** (jak `Template.locationId` i `Workout.locationId` — komentarz `lib/locations.ts:8-9`); edytor pokazuje „(usunięte miejsce)” (`locationLabel`, `lib/locations.ts:57`) z „✕” |

`finishWorkout` (`lib/store.ts:960`) i `putHistoryWorkout` (`lib/store.ts:989`) usuwają `splitFrom` i `altSkip` tak jak `pre` (historia = to samo, co zwraca migracja — test idempotencji).

### 2.3 Kopia (eksport/import)

- **Eksport:** `buildBackup` (`lib/backup.ts:14`) zapisuje stan 1:1 — nowe pola trafiają do kopii bez zmian w kodzie; `schemaVersion: 16` w kopercie.
- **Import kopii 15 i starszych w wersji 16:** `parseBackup` → `migrate` — pola nie istnieją, nic się nie zmienia.
- **Import kopii 16 w wersji 15:** odrzucony z komunikatem „Plik ma schemat 16, a ta wersja obsługuje do 15. Zaktualizuj aplikację.” (`lib/backup.ts:129-130`; dotyczy też gołego stanu).
- **CSV** (`buildCsv`): bez zmian — kolumna „Exercise Name” to B; Strong nie ma pola na zamianę.
- **Kopia automatyczna po edycji historii** (`onHistoryEdited`, `lib/backup.ts:87`) — bez zmian, obejmuje przepięcia D6.

### 2.4 Co zrobi starsza wersja aplikacji (schemat 15) z danymi 16 — fakty z kodu

- **Kopia z pliku:** odrzucona (wyżej). Nie da się więc „wgrać” danych 16 do 15.
- **Baza na telefonie po powrocie do starszego buildu:** `init` woła `migrate(raw)` bez sprawdzania wersji (`lib/store.ts:99`), a `migrate` nie ma białej listy pól pozycji szablonu (`lib/store.ts:230`) ani bloku (`lib/store.ts:252`) — nowe pola **przetrwają**, schemat zapisze się jako 15, a po ponownej aktualizacji migracja 16 je wyczyści (M1–M7). Skutki uboczne w 15: `restampUntouched` (`lib/store.ts:721`) nadpisze ręczny przyrząd bloku w toku; `deleteExercise` (`lib/store.ts:1108`) zostawi wpis zamiennika z usuniętym ćwiczeniem (16 go usunie — M6). Utraty historii brak.
- **NIEZWERYFIKOWANE:** czy iOS pozwala zainstalować ad hoc starszy build na nowszy (powrót wersji). Niezależnie od odpowiedzi skutki są wyżej i są bezpieczne.

## 3. W1 — „zamień tylko dziś” (trening w toku)

### 3.1 Wejście i arkusz

1. Przycisk **„⇄ zamień”** w akcjach bloku (`components/ActiveWorkout.tsx`, obok „usuń” — linia 317) i w plakietce „brak sprzętu w: Dom” (linia 269; docs/10 pkt 4.3). Opis dla VoiceOver: „Zamień ćwiczenie: {name}” (test C2).
2. **Ukryty**, gdy wszystkie serie bloku są odhaczone (D3 a) oraz w bloku „Usunięte ćwiczenie” (`components/ActiveWorkout.tsx:224-226` — tam tylko „usuń”).
3. Arkusz = nowy ekran-okno `app/swap.tsx?target=active:<blockId>` (wzór okna: `app/picker.tsx`, przycisk „Anuluj” w nagłówku, blokada podwójnego tapnięcia `chosen`):
   - **„Propozycje”** — top-3 z rankingu (pkt 6), każda z linijką „dlaczego”, np. „ten sam ruch · hantle · robione 12×”; dopisek „już w treningu”, gdy B jest w treningu (nie blokuje);
   - **„Ten sam ruch, inny przyrząd”** (D5, pkt 3.7) — tylko gdy są inne przyrządy w miejscu;
   - **„Cała biblioteka”** → `app/picker.tsx?target=swap:active:<blockId>` (czwarty cel obok `active`, `template:`, `edit:` — `app/picker.tsx:26-37`): filtr miejsca jak w `active`, ukryte bieżące ćwiczenie i ćwiczenia o innej metryce; „Utwórz …” tworzy ćwiczenie z metryką A.
4. **„↺ przywróć: A”** na górze arkusza, gdy blok ma `swappedFrom` (to samo co „cofnij”, pkt 3.4).

### 3.2 Zasady zamiany (`swapBlock` w `lib/store.ts`)

Doprecyzowanie tabeli docs/13 A4 (numery jak tam):

| # | Sytuacja | Zachowanie |
|---|---|---|
| 1 | blok bez odhaczonych serii | **w miejscu**: `exerciseId = B`; `swappedFrom = A.swappedFrom ?? A`; `impl = stampImpl(B, loc)`, `implPinned` usunięte; serie **nowe** (nowe id) w tej samej liczbie i tych samych rodzajach; `repMin`/`repMax`, `tplItemId`, `groupId`, `restSec` bez zmian; wartości — `prefillSets` (pkt 3.3) |
| 2 | część serii odhaczona | **podział**: A zostaje z odhaczonymi seriami (bez zmian); B wstawiony tuż pod A z nieodhaczonymi seriami (ta sama liczba i rodzaje, nowe id, wartości z `prefillSets`), `splitFrom = A.id`, `swappedFrom`, `tplItemId`, `groupId`, `restSec`, `repMin`/`repMax` jak A |
| 3 | wszystkie odhaczone | przycisk ukryty (D3 a) |
| 5 | przerwa | **zostaje przerwa bloku** (D4 a; tj. z pozycji szablonu albo „tylko teraz”) — `restSec` nie jest liczone od nowa z `restFor(B)` (`lib/store.ts:437`); wyjątek: przyjęcie zamiennika per miejsce z własną przerwą (pkt 4.3) |
| 8 | B już w treningu | dozwolone; zmienia się numeracja wystąpień `k` innych bloków B — test „Poprzednio” |
| 10 | A→B→C | `swappedFrom` zostaje A (oryginał); C liczony jak B |
| 11 | zmiana miejsca „📍” po zamianie | reguła L5 (`restampUntouched`, `lib/store.ts:721`), z wyjątkiem pkt 3.7.4 |
| 12 | „Zakończ” z pustym B | jak dziś: bloki bez odhaczonych serii nie trafiają do historii (`lib/store.ts:963`) |
| 13 | „Powtórz ostatni” | D8 a: powtarza zrobione bloki A i B (kopiuje `...e`, `lib/store.ts:776`); `swappedFrom`, `tplItemId` zostają; `implPinned` — pkt 3.7.5 |
| 14 | rekordy, objętość | per ćwiczenie, liczone z historii (`recordsFor`, `prMap` — `lib/stats.ts:108`, `:149`) — bez zmian w kodzie |
| 15 | ćwiczenie zarchiwizowane | nigdy nie proponowane; nie ma w bibliotece arkusza poza „Przywróć …” jak w pickerze |

Wartości A **nigdy** nie przechodzą do B (ani wpisane, ani podpowiedziane — docs/10 pkt 4.6). Pod nazwą B linijka „zamiast: A · ostatnio 3×8 @ 80 kg” (ostatnia sesja A, `previousFor`; bez przeliczania).

### 3.3 Wspólne wypełnianie serii (`prefillSets`)

Wydzielić z `startFromTemplate` (`lib/store.ts:741-756`) funkcję używaną przez start z szablonu i zamianę (jedno miejsce bezpiecznika M3):
`prefillSets(ex, kinds: SetKind[], src: {workout, sets} | null, locationId, impl, targetSec)`.
- Serie robocze (`normal`, `failure` → zapisane jako ich rodzaj) dostają `srcSetAt(src, j)` (`lib/store.ts:705`), gdzie `j` = numer serii roboczej w nowym bloku; rozgrzewki i drop sety — puste (jak `hintFor`, rozgrzewka bez podpowiedzi).
- Brak źródła → puste pola (ciężaru startowego pozycji szablonu **nie** bierzemy — to ciężar A); seria czasowa: cel z pozycji szablonu (`targetSec`), gdy metryka B ma czas.
- M3: `prevFromOther(...) && offListAt(...)` → puste ciężar i powtórzenia (`lib/store.ts:654`, `:644`); `markPre` i `stripUnused` jak dziś.
- **Test równoważności:** `startFromTemplate` po wydzieleniu daje identyczny trening na szablonach demonstracyjnych z historią (wzór: `tests/audit-perf-equiv.test.ts`).

### 3.4 Cofnięcie

- „↺ cofnij zamianę” widać, gdy blok ma `swappedFrom` i **żadnej** odhaczonej serii.
- Przypadek 1 (w miejscu): `exerciseId = swappedFrom`, `swappedFrom`/`implPinned` usunięte, `impl` od nowa, serie od nowa przez `prefillSets` (nowe id). `restSec`: gdy blok ma pozycję szablonu — `it.restSec ?? restFor(A)` (jak start), inaczej bez zmian.
- Przypadek 2 (podział, istnieje blok `splitFrom`): serie B dopisane na końcu A jako nowe serie A z `prefillSets` (numeracja serii roboczych liczona dalej od odhaczonych), B znika, `normalizeGroups`. Gdy bloku A już nie ma (usunięty) — jak przypadek 1.
- Gdy któraś seria B ma `edited` — potwierdzenie „Wpisane wartości zamiennika przepadną” (C7).

### 3.5 Superserie — znaleziony błąd do zaprojektowania

docs/13 A4 pkt 4 zakładał, że A z samymi odhaczonymi seriami „nie blokuje przerwy”. To prawda, ale **liczenie rund się rozjeżdża**: `restAfter` liczy rundę bloku po jego **własnych** odhaczonych seriach (`r = work(e).filter(done).length`, `lib/store.ts:863`). Scenariusz: superset [A, C] po 3 serie; A1, C1 odhaczone → zamiana A (podział) → [A(1✓), B(2), C(1✓, 2)]. Odhaczenie B1: `r = 1`, C ma 1 zrobioną, więc nie blokuje, B nie jest ostatni w grupie → `roundRest` — **przerwa w środku rundy 2** (przed C2). Wymaganie:
- w `restAfter` blok i jego łańcuch `splitFrom` (A + B) liczą się jako **jeden członek grupy**: `r` = suma odhaczonych serii roboczych A i B, a A nie wchodzi osobno do `others`;
- `roundRest` (`lib/store.ts:875`) bez zmian (B zostaje ostatni, gdy A był ostatni; przerwa B = przerwa A — D4 a).

### 3.6 „Poprzednio” dla zamiennika

`tplItemId` przechodzi na B, więc „Poprzednio” powinno najpierw znaleźć **B na tej samej pozycji szablonu** („ostatnio w Domu zamiast sztangi: hantle 3×10 @ 22”). Dzisiejszy `selectBlock` (`lib/store.ts:545-559`) tego nie zapewnia:
- `n = 1` (B raz w treningu): pierwsza gałąź (`n > 1`) się nie wykona, a reguła rundy 11 dotyczy tylko sesji tego samego szablonu z blokiem B — wynik zależy od tego, gdzie było ostatnie B;
- pułapka z docs/13 A4.2: B także własną pozycją Y tego szablonu → reguła „pominięta pozycja” (`lib/store.ts:555`) zwraca `null`.

**Reguła:** dla bloku z `swappedFrom` — `byItem(B, tplItemId)` (ostatni blok B z tej pozycji, z filtrem przyrządu 8c), a gdy go brak — `previousBlockFor(B, k, n, undefined, null, impl)` (zwykły dobór bez kontekstu pozycji). Ta sama zmiana w `previousBlockBefore` (`lib/store.ts:537`) i w `prevOfBlock` (`lib/store.ts:835`). Nowy parametr `swapped: boolean`; bloki bez `swappedFrom` — bez zmian (test: wszystkie dotychczasowe testy „Poprzednio” bez zmiany asercji).

### 3.7 D5 — „ten sam ruch, inny przyrząd”

1. **Opcje:** przyrządy z `loadKindsFor(A)` (`lib/equipment.ts:206`) obecne w miejscu (stacja → `electric`, zwykły wyciąg → `cable`, jak `implOf`), bez bieżącego `impl`. Np. RDL (hantle/linki) w Domu właściciela: „hantle” ↔ „stacja”. Bez miejsca — sekcji nie ma.
2. **Wybór:** to samo `exerciseId`, `impl = wybrany`, `implPinned = true`; wartości z `prefillSets` dla tego przyrządu (8c + M3); `swappedFrom` nie powstaje (to nie zmiana ćwiczenia). Dostępne tylko w bloku **bez odhaczonych serii** (inaczej — pytanie P2).
3. **Wymaganie w `lib/equipment.ts`:** dziś `loadsFor` nie patrzy na przyrząd bloku, a `listLocFor` (`lib/store.ts:674`) wyłącza listę miejsca, gdy `impl ≠ implAt` — przypięty blok straciłby „↑ spróbuj X” z listy, M3 i dopisek „nie ma tutaj”. `resolveLoads` (`lib/equipment.ts:242`) dostaje opcjonalny `prefer?: Impl` (tylko rodzaj tego przyrządu), `loadsFor(ex, loc, impl?)`, a `listLocFor` porównuje z przyrządem dostępnym w miejscu dla `prefer`.
4. `restampUntouched` pomija bloki z `implPinned`; **zmiana miejsca „📍”** zdejmuje przypięcie z bloków bez odhaczonych serii i liczy przyrząd od nowa (wybór dotyczył przyrządu w tamtym miejscu).
5. „Powtórz ostatni”: `implPinned` i `impl` zostają, gdy nowy trening ma to samo miejsce i przyrząd jest tam dostępny; inaczej przyrząd od nowa (`stampImpl`, `lib/store.ts:776`) bez przypięcia.

### 3.8 Timery i Live Activity (sprawdzone w kodzie)

- **Stoper serii:** zamiana w miejscu i podział usuwają nieodhaczone serie A (nowe id w B) → ekran woła `dropTimers(goneSetIds)` jak przy „usuń” (`components/ActiveWorkout.tsx:251`); `swapBlock` zwraca `goneSetIds`.
- **Przerwa:** przerwa po odhaczonej serii A trwa dalej (seria zostaje w A; `T.setId`).
- **Podtytuł Live Activity — wynik sprawdzenia „do sprawdzenia” z A4 pkt 7:** podtytuł przerwy zawiera nazwę **następnego** ćwiczenia („A · seria 2” albo „dalej: A” — `restLabels`, `components/ActiveWorkout.tsx:53-61`) i jest **zamrażany na starcie przerwy** (`T.sub = labels.subtitle`, `lib/timer.ts:54`; korekta ±15 s używa `T.sub` — `lib/timer.ts:68`). Po zamianie w trakcie przerwy ekran blokady pokazywałby starą nazwę. Wymaganie: `timer.relabel(subtitle)` — ustawia `T.sub` i woła `LA.update`, gdy trwa przerwa (wzór: `lib/timer.ts:70`); ekran po zamianie liczy `restLabels` dla serii, która uruchomiła przerwę (`findSet(T.setId)`).
- Brak ćwiczenia `swappedFrom` (usunięte i wyczyszczone przez `purgeOrphans`) → bez linijki „zamiast”, „cofnij” ukryte.

## 4. W3 — zamienniki per miejsce w szablonie

### 4.1 Zapis „Zawsze w: Dom”

Warunki pokazania przycisku (wszystkie): trening ma istniejące miejsce; trening ma `templateId`, szablon istnieje; blok ma `tplItemId` z tego szablonu i `item.exerciseId === swappedFrom` (B zastępuje ćwiczenie pozycji); B ≠ `item.exerciseId`.
Gdzie przycisk — pytanie P1 (rekomendacja: w linijce „zamiast: A · [Zawsze w: Dom]” bloku B).
Zapis: w `item.alternates` wpis `{ locationId: w.locationId, exerciseId: B, restSec: null }` — istniejący wpis dla tego miejsca jest **zastępowany** (`restSec` też się zeruje, bo dotyczył innego ćwiczenia). Zapis szablonu w trakcie treningu na wyraźne stuknięcie ma precedens: „Zapamiętaj” przerwę (`rememberRest`, `components/ActiveWorkout.tsx:253`). Decyzja 08:11 („szablony ustawiam sam”) zachowana — nic nie dzieje się bez stuknięcia.

### 4.2 Podpowiedź przy starcie

- Liczona **przy renderze** (nie zapisywana w bloku): blok ma `tplItemId` pozycji szablonu, `e.exerciseId === item.exerciseId` (jeszcze nie zamieniony), brak odhaczonych serii, brak `altSkip`, a `item.alternates` ma wpis dla `w.locationId` z ćwiczeniem widocznym (nie zarchiwizowanym) i **dostępnym w miejscu** (`availability`, `lib/equipment.ts:193`).
- Tekst: „Zwykle w: Dom — B. Zamienić?” z przyciskami „Zamień” i „✕”. Forma „w: Dom” jak „brak sprzętu w: Dom” — nazwy miejsc wpisuje użytkownik, więc bez odmiany („W Dom” byłoby błędne).
- `startFromTemplate` **nie zmienia** bloku (docs/10 pkt 4.3: nigdy automatyczna zamiana); wartości A liczone jak dziś.
- Zmiana „📍” w trakcie: podpowiedź liczy się od nowa dla nowego miejsca (wynika z liczenia przy renderze).
- Ta sama podpowiedź w treningu z „Powtórz ostatni”, jeśli ma szablon i pozycję (spójnie).

### 4.3 Przyjęcie / odrzucenie

- **„Zamień”** = `swapBlock` (przypadek 1) z `restSec = alt.restSec` gdy ustawione, inaczej przerwa bloku bez zmian (D4 a); `impl` = `alt.impl` z `implPinned`, gdy wpis ma przyrząd (P5), inaczej `stampImpl`. „↺ cofnij” jak w pkt 3.4.
- **„✕”** = `altSkip = true` w tym bloku (tylko ten trening; M4).
- „Zapamiętaj” przerwę (`components/ActiveWorkout.tsx:314`) w bloku, który jest zamiennikiem tego miejsca (`alternates[loc].exerciseId === e.exerciseId`): zapis do `alt.restSec` (zamiast do `item.restSec`, którego dziś i tak nie rusza, bo `it.exerciseId !== B`) — wypełnia dopisek właściciela do D4.

### 4.4 Edytor szablonu (`app/template/[id].tsx`)

- Pod polami pozycji (po „przerwa s”, linia 60) lista „Zamienniki”: wiersz „📍 Dom: Bench Press (hantle)”, pole „przerwa s” (`NumInput`, 0–1800 jak pozycja; placeholder = przerwa pozycji albo ćwiczenia), „✕” z potwierdzeniem (C7).
- Wpis z usuniętym miejscem: „(usunięte miejsce): B” + „✕”. Wpis z ćwiczeniem niedostępnym w miejscu: dopisek „brak sprzętu w: Dom”.
- Dodawanie zamiennika z edytora — pytanie P6 (rekomendacja: nie w E2).
- `dupTemplate` (`lib/store.ts:1117`) kopiuje `alternates` (JSON) — test. `deleteExercise` (`lib/store.ts:1108`) usuwa też wpisy z tym ćwiczeniem.

### 4.5 Przypadki brzegowe W3

| Sytuacja | Zachowanie |
|---|---|
| usunięte miejsce | wpis zostaje (M7), podpowiedź nigdy się nie pokaże (`startLocationId` zwraca tylko istniejące miejsca) |
| usunięte / zarchiwizowane ćwiczenie B | wpis znika (`deleteExercise`; M6 przy migracji) |
| to samo ćwiczenie dwa razy w szablonie | zamienniki per pozycja (`tplItemId`) — każda ma swoje; „Zawsze w” zapisuje do pozycji bloku |
| zamiennik = ćwiczenie pozycji | niemożliwy z UI (przycisk ukryty), migracja usuwa (M5); wyjątek: inny przyrząd (P5) |
| B jest też własną pozycją tego szablonu | dozwolone, „już w treningu”; „Poprzednio” wg pkt 3.6 |
| szablon bez miejsca domyślnego | bez znaczenia: klucz to **miejsce treningu** (`w.locationId`), nie `tpl.locationId` |
| zero miejsc | „Zawsze w” i podpowiedzi nie istnieją; wpisy w szablonie zostają (edytor je pokazuje) |
| `impl` | zamiennik dostaje przyrząd wg miejsca (`stampImpl`) albo przypięty z wpisu (P5) |

## 5. D6 — zamiana w edytorze historii (przepięcie serii)

Inny sens niż w treningu: **poprawka pomyłki** „zapisałem serie pod złym ćwiczeniem” (jak „Transfer Exercise Data” w Strong). Działa w szkicu (`lib/edit.ts`), zapis jednym ruchem przez `putHistoryWorkout`, „Anuluj” wszystko cofa.

### 5.1 Zasady

| # | Reguła |
|---|---|
| H1 | Wejście: „⇄ zamień” w `EditBlock` obok „usuń” (`app/history/edit/[id].tsx:132`); ten sam arkusz `app/swap.tsx?target=edit:<klucz>:<blockId>`, ranking z miejscem szkicu (`d.w.locationId`), biblioteka przez `picker?target=swap:edit:<klucz>:<blockId>` |
| H2 | Przepinany jest **cały blok** (pytanie P3): `exerciseId = B`, serie i ich wartości bez zmian (A-002: wpisanych wartości nie zmieniamy); `groupId`, `tplItemId`, `restSec`, `repMin`/`repMax` bez zmian |
| H3 | Tylko ta sama metryka (`metric`) — inaczej pola serii nie pasują; blok „Usunięte ćwiczenie” (brak metryki) — cała biblioteka bez filtra metryki |
| H4 | Ciężar przy zmianie masa ciała ↔ ciężar (`weight` ↔ `addKg`) — pytanie P4 |
| H5 | `impl = stampImpl(B, d.w.locationId)` — jak dodanie ćwiczenia w edytorze (`draftAddExercise`, `lib/edit.ts:171-177`); `implPinned` usunięte. Zmiana samego przyrządu w historii — pytanie P5b |
| H6 | `swappedFrom`: gdy był — zostaje; gdy nie było, a blok ma `tplItemId` — `swappedFrom = A`; gdy B równe `swappedFrom` — usunięte (powrót do oryginału) |
| H7 | Wartości wstawione przez aplikację (trening wstecz; `d.prefilled`) i nieruszone: `refill(d, at, false, blok)` (`lib/edit.ts:139`) liczy je od nowa z historii **B** sprzed daty; wpisane ręcznie zostają. Edycja zapisanego treningu ma `prefilled` puste → nic się nie przelicza |
| H8 | „↺ przywróć: A” w arkuszu, gdy `exerciseId` różni się od tego z otwarcia szkicu (`origEx[blockId]` w szkicu) |
| H9 | Superset: bez zmian (w historii nie ma przerw); `normalizeGroups` jak dziś |
| H10 | B już w tym treningu: dozwolone; numeracja wystąpień się zmienia (test „Poprzednio” następnej sesji) |
| H11 | A zarchiwizowane: przepięcie dozwolone (typowa poprawka); po zapisie `purgeOrphans` usuwa A, gdy nie ma innej historii |

### 5.2 Skutki (sprawdzone w kodzie)

- **Rekordy:** nie są zapisywane — `recordsFor`/`prMap` (`lib/stats.ts:108`, `:149`) liczą je z historii i cache odświeża `histRev` po `save` w `putHistoryWorkout`. Po przepięciu mogą zmienić się oznaczenia PR **także w późniejszych sesjach** A i B — zamierzone, test.
- **„Poprzednio”, Postępy, objętość tygodnia, partie mięśniowe:** liczone z historii — przeliczają się same (`exIndex`, `lib/store.ts:463`).
- **Apple Health:** zapis do Zdrowia zawiera tylko trening jako całość — typ (siłowy funkcjonalny, gdy **wszystkie** ćwiczenia to masa ciała, inaczej tradycyjny), start, koniec i metadane: nazwa, `VolumeKg`, `Sets` (`lib/health.ts:40-46`); bez listy ćwiczeń. Edycje historii **nie są wysyłane** (`onHistoryEdited`, `lib/backup.ts:87`; docs/12), a edytor pokazuje „Zmiany nie trafiają do Apple Health.” (`app/history/edit/[id].tsx:60,65`). Przepięcie nie zmienia tego zachowania; jedyna możliwa rozbieżność (objętość i typ treningu w Zdrowiu) jest ta sama co przy każdej edycji.
- **Kopia automatyczna:** jak po każdej edycji (`onHistoryEdited`).
- **Cofnięcie po zapisie:** ponowna edycja i przepięcie z powrotem (H6/H8).

## 6. Ranking propozycji (`lib/swap.ts`, czysta funkcja)

`swapCandidates(exId, ctx: { locationId?: string; showAll: boolean; inWorkout: ReadonlySet<string>; before?: number }): SwapCandidate[]`, gdzie `SwapCandidate = { exId; score; reasons: Reason[]; available: boolean; inWorkout: boolean }`. `before` — dla edytora historii (liczniki tylko z sesji sprzed daty).

**Kandydaci:** ćwiczenia widoczne (`visibleExercises`), bez bieżącego, z tą samą metryką; przy miejscu i `showAll = false` — tylko dostępne (`availability`); do propozycji tylko te z **podobieństwem** (wspólny wzorzec ruchu poza `isolation`/`other` albo wspólny mięsień główny) — bonusy historii tylko porządkują.

| Kryterium (wagi z docs/13 A4) | Punkty |
|---|---|
| ten sam `pattern` z katalogu (`isolation`/`other` — tylko przy wspólnym mięśniu głównym) | +3 |
| wspólny mięsień główny (`muscles`); ten sam pierwszy | +3; +1 |
| ta sama partia (`group`) | +1 |
| wspólne mięśnie pomocnicze | +1 za każdy, maks. 2 |
| wcześniej zamieniane z tego ćwiczenia (bloki historii z `swappedFrom === A`) | +4 |
| ćwiczenie z historią u użytkownika (`workoutsWith(id).length > 0`, `lib/store.ts:466`) | +1 |

Remis: liczba sesji z ćwiczeniem, potem nazwa (`exName`, `localeCompare` w języku interfejsu). Ćwiczenia własne bez `pattern` — tylko mięśnie i partia. Wagi i liczba propozycji w jednej stałej `SWAP_WEIGHTS` / `SWAP_TOP = 3` w `lib/swap.ts`. **Wagi nie mają źródła** w badaniach ani w danych — to propozycja z A4 do zweryfikowania tabelą D7 (pytanie P7).

Licznik „wcześniej zamieniane”: `memoHist` po historii (mapa A → B → liczba); przy 1000 treningów — pomiar w `npm run perf` (F4).

### 6.1 Tabela D7 — jedno źródło prawdy

- Test-generator `tests/swap-top3.test.ts` buduje tabelę **z prawdziwej funkcji** `swapCandidates` (zero ręcznie przepisanych liczb) dla stałej listy ok. 12 ćwiczeń: Bench Press (sztanga), Incline Bench Press (sztanga), Overhead Press (sztanga), Lat Pulldown, Seated Cable Row, Bent Over Row (sztanga), Back Squat, Deadlift (sztanga), Leg Press, Leg Extension, Leg Curl, Triceps Pushdown, Face Pull, RDL (hantle/linki) (ostatnie — dla kolumny D5).
- Miejsca: **Dom właściciela** = `userHome()` (`tests/locations-fixtures.ts:14`, opis w docs/10 „Dom użytkownika”) i **Pełna siłownia** = `presetEquipment('gym')`; biblioteka z `seedState('pl')`, pusta historia (bonusy historii osobnym testem).
- Kolumny: ćwiczenie | Dom: top-3 (punkty, uzasadnienie) | Dom: inny przyrząd (D5) | Pełna siłownia: top-3.
- Wynik w pliku `docs/14a-e2-top3.md`; `UPDATE_TOP3=1 npx jest tests/swap-top3.test.ts` go zapisuje, zwykły `npm test` porównuje i pada przy różnicy (wzór: `gen.mjs --check`, `tests/locations-catalog.test.ts:16`). Zmiana wag = nowa tabela w tym samym commicie, a właściciel przegląda diff.

## 7. Plan testów (przed kodem)

Nazwy testów po polsku, opisują zachowanie (konwencja `tests/decisions-0310.test.tsx`). Dane: `fresh()`, `withDemoTemplates()`, `userHome()`, `addWorkout()` z `tests/helpers.ts`.

**`tests/swap-logic.test.ts`** (logika, bez ekranu)
1. „zamiana w miejscu: B dostaje tyle samo serii tych samych rodzajów, zakres powtórzeń, tplItemId, groupId i przerwę bloku; impl od nowa; żadna wartość A w B”.
2. „zamiana w miejscu: wartości z historii B wg 8c; 32 kg z siłowni nie trafia do pól w Domu (M3)”.
3. „podział: A tylko z odhaczonymi seriami, B tuż pod A z resztą, splitFrom = A”.
4. „superset A1 C1 → podział A: B1 nie odpala przerwy w środku rundy; C2 odpala przerwę rundy” (pkt 3.5) + odhaczanie poza kolejnością (regresja rund 72/75).
5. „cofnij: w miejscu wraca A z wartościami A; po podziale serie wracają do A, B znika; A→B→C→cofnij = A; po usunięciu A — jak w miejscu”.
6. „Poprzednio zamiennika: najpierw B z tej samej pozycji szablonu; B także własną pozycją szablonu — nie null; B dwa razy w treningu” (pkt 3.6).
7. „prefillSets: start z szablonu identyczny przed i po wydzieleniu” (równoważność, szablony demonstracyjne z historią).
8. „D5: przyrząd przypięty — restampUntouched go nie rusza; „📍” zdejmuje przypięcie z bloku bez serii; lista ciężarów, ↑ i M3 wg przypiętego przyrządu (loadsFor z prefer)”.
9. „Powtórz ostatni po zamianie: A i B z seriami, swappedFrom zostaje; implPinned tylko w tym samym miejscu”.
10. „bez miejsc: zamiana działa bez filtra i bez impl; zero miejsc = bez pól impl/implPinned”.
11. Ranking: właściwość fast-check (`fc.assert`, jak `tests/invariants.test.ts`) „żaden kandydat nie jest bieżącym ćwiczeniem; ta sama metryka; przy filtrze — wszystkie dostępne w miejscu; wynik deterministyczny”; „bonus wcześniej zamieniane”; „ćwiczenia własne bez wzorca”; „isolation tylko przy wspólnym mięśniu”.

**`tests/swap-top3.test.ts`** — tabela D7 (pkt 6.1).

**`tests/swap-alternates.test.ts(x)`** (W3)
12. „Zawsze w: Dom zapisuje wpis w pozycji bloku (to samo ćwiczenie dwa razy w szablonie — właściwa pozycja); zastępuje wpis tego miejsca”.
13. „start w Domu: podpowiedź, blok bez zmian (nigdy automatycznie); start w Siłowni: brak podpowiedzi; „📍” na Dom w trakcie — podpowiedź się pojawia”.
14. „Zamień z podpowiedzi: przerwa z wpisu, a pusta — przerwa bloku; ✕ chowa podpowiedź do końca treningu”.
15. „Zapamiętaj przerwę w bloku-zamienniku zapisuje alt.restSec, nie item.restSec”.
16. „usunięte ćwiczenie B → wpis znika; usunięte miejsce → wpis zostaje, edytor pokazuje (usunięte miejsce); dupTemplate kopiuje wpisy”.
17. Edytor szablonu (RNTL): lista „📍 Dom: B”, pole przerwy, „✕” z potwierdzeniem (dopisać do testu `C7`).

**`tests/swap-history.test.tsx`** (D6)
18. „przepięcie bloku A → B: serie i wartości bez zmian, impl wg miejsca szkicu, swappedFrom wg H6; Anuluj nic nie zmienia”.
19. „po zapisie: rekordy A i B (także PR późniejszej sesji), Poprzednio następnego treningu, objętość tygodnia przeliczone”.
20. „trening wstecz: wartości wstawione przez aplikację liczą się od nowa z historii B, wpisane ręcznie zostają”.
21. „Apple Health nie jest wołane przy zapisie przepięcia; uwaga w edytorze jak dziś”.
22. „tylko ta sama metryka; blok usuniętego ćwiczenia — cała biblioteka”; reguła P4 po decyzji.

**`tests/swap-schema16.test.ts`** (migracja i kopie)
23. „M1–M7: śmieci z importu w swappedFrom/implPinned/splitFrom/altSkip/alternates — poprawione albo usunięte; historia bez splitFrom i altSkip”.
24. „migrate idempotentne” — rozszerzyć generatory w `tests/migrate-idem.test.ts` (`wexArb`: `swappedFrom`, `implPinned`, `splitFrom`, `altSkip`; `tplArb`: `alternates`) zamiast nowego testu.
25. „eksport → import 1:1 z nowymi polami; restart w trakcie treningu po podziale (klucz „live”) zachowuje splitFrom; kopia 16 odrzucona przez wersję 15 (symulacja SCHEMA_VERSION)”.
26. Niezmienniki: dodać akcje „zamień”/„cofnij” do generatora akcji w `tests/invariants.test.ts` (superset po podziale, brak pustych bloków w historii).

**UI (RNTL) `tests/swap-ui.test.tsx`:** przycisk ukryty po odhaczeniu wszystkich serii (D3) i w bloku usuniętego ćwiczenia; „⇄” przy plakietce braku sprzętu; arkusz: top-3, „już w treningu”, „Cała biblioteka” z filtrem; linijka „zamiast: …”; stoper usuwanej serii zatrzymany, przerwa trwa, `timer.relabel` po zamianie w przerwie; EN bez polskich tekstów (C6).

**Maestro `.maestro/07-zamiana.yaml`** (wzór `06-miejsca.yaml`, dopisać do `config.yaml`; aplikacja po angielsku; `extendedWaitUntil` z `timeout: 60000` na starcie i 30000 dalej — symulator na `macos-26` jest wolny; nawiasy w selektorach `id` poprzedzone `\\(` — pilnuje `tests/maestro-selectors.test.ts`):
1. More → Settings → Training places → + Add place → Home; zaznacz ławkę regulowaną i hantle.
2. Empty workout → + Add exercise → Show all → „Bench Press \\(barbell\\)”.
3. Widać „missing …” → „⇄ swap” → wśród propozycji „Bench Press \\(dumbbells\\)” → wybierz.
4. Nazwa B, linijka „instead of: Bench Press (barbell)”, ta sama liczba serii.
5. „↺ undo swap” → wraca A → zamień ponownie.
6. Drugie ćwiczenie z 3 seriami, odhacz 1 → zamień → A z 1 odhaczoną, pod nim B z 2.
7. Odhacz serię B → Finish → w historii oba ćwiczenia z właściwymi seriami → Edit → „⇄” przy A → przepnij → Save → historia pokazuje nowe ćwiczenie.
8. Zrzuty ekranu jak w innych scenariuszach. (W3 w E2E — pytanie, czy warto: wymaga szablonu z subflow `szablon-testowy.yaml` i miejsca; rekomendacja: krok 9 tylko „Always at: Home” + ponowny start z szablonu i widoczna podpowiedź.)

**Istniejące testy do zmiany:** literał schematu 15 → 16: `tests/audit-r72-b.test.ts:79`, `tests/decisions-0310.test.tsx:199`, `:203`, `:211`, `tests/locations-model.test.ts:24`, `:36`, `tests/regress.test.tsx:1427`. Test C2/C3 w `tests/ux.test.tsx:44` — nowy przycisk „⇄” na liście przycisków z ikoną. Pozostałe asercje „Poprzednio”, przerw i migracji nie powinny się zmienić (pola opcjonalne, nowe gałęzie tylko dla bloków z `swappedFrom`/`splitFrom`/`implPinned`) — jeśli się zmieniają, to błąd.

## 8. Kolejność wdrożenia i szacunek

| Sesja | Zakres | Szacunek |
|---|---|---|
| 1 | `lib/swap.ts` (ranking), `tests/swap-top3.test.ts` + `docs/14a-e2-top3.md` — **tabela do przejrzenia od razu** (D7 może zmienić wagi przed UI) | 1 |
| 2 | `prefillSets`, `swapBlock`/`undoSwap`, `splitFrom` w `restAfter`, „Poprzednio” zamiennika, schemat 16 (pola W1), testy 1–7, 9–11, 23–25 | 1–1,5 |
| 3 | UI W1: `app/swap.tsx`, cel `swap:` w pickerze, „⇄”, „zamiast”, „cofnij”, timery i `timer.relabel`, i18n PL/EN (`check:i18n`) | 1 |
| 4 | Maestro 07 + niezależny audyt W1 | 0,5–1 |
| **W1 razem** | | **3,5–4,5** (docs/13: 3–4; +0,5 na pkt 3.5 i 3.6) |
| 5 | D5: `implPinned`, `loadsFor(…, prefer)`, `listLocFor`, sekcja w arkuszu, test 8 | 0,5–1 |
| 6–7 | W3: `alternates` (migracja M5–M7, `deleteExercise`, `dupTemplate`), „Zawsze w”, podpowiedź, „✕”, przerwa zamiennika, edytor szablonu, testy 12–17 | 2–3 |
| 8 | D6: przepięcie w szkicu (`draftSwapExercise`), H1–H11, testy 18–22, krok 7 Maestro | 1–1,5 |
| **Razem** | | **7–10 sesji** |

**Uzasadnienie D6 (1–1,5):** arkusz, ranking i cel pickera są już z W1; szkic, przeliczanie wartości (`refill`), zapis (`putHistoryWorkout`) i odświeżenie rekordów/„Poprzednio” istnieją (docs/12) — nowa logika to jedna funkcja przepięcia z regułami H2–H8. Koszt jest w testach skutków (rekordy w późniejszych sesjach, trening wstecz, Zdrowie) i w decyzji P4; bez timerów i superserii, więc taniej niż W1.

Dokumentacja po wdrożeniu: sekcja „Implementacja E2” w docs/10, wiersz w docs/09 (warstwa A i B), wynik tabeli D7 z datą przeglądu właściciela.

## 9. Otwarte pytania do właściciela

> **04.10.2026 — odpowiedzi właściciela:** **P1 (a)** — „Zawsze w: <Miejsce>” w linijce bloku po zamianie; **P2 — wariant (b) w brzmieniu
> właściciela:** „Po prostu zastępujesz na nowe ćwiczenie z pustymi seriami wykonanymi nawet jeżeli już jakaś jest zrobiona” —
> interpretacja (do potwierdzenia przy implementacji): zmiana przyrządu działa jak zamiana ćwiczenia — odhaczone serie zostają w bloku
> ze starym przyrządem, nowy blok (nowy przyrząd) dostaje pozostałe serie jako nieodhaczone, wartości jak przy zamianie (W1, przypadek 2);
> **P3 (a)** — w historii cały blok; **P4 (a)** — przenieść do pola B; **P5a (a)** — „Zawsze w” także dla przyrządu (`TemplateAlt.impl`);
> **P5b (a)** — poprawka samego przyrządu w edytorze historii, w E2; **P6 (a)** — dodawanie zamienników tylko z treningu;
> **P7 (a)** — 3 propozycje, wagi startowe z A4, ocena na tabeli D7 przed wydaniem.

> **04.10.2026 (popołudnie) — decyzje właściciela po przeglądzie tabeli D7 i backlogu:**
> - **D7:** remis w rankingu rozstrzyga najpierw **ten sam sprzęt** co oryginał (potem sesje, nazwa). Do tego w arkuszu opcja **„Inne”** — rozwijana lista ćwiczeń przefiltrowana po partii mięśniowej; filtry da się zdjąć i wybrać dowolne istniejące ćwiczenie. Wdrożone: `lib/swap.ts` (sortowanie), `app/swap.tsx` („Inne ▾”: etykiety „klatka ✕”, „📍 Dom ✕”, szukajka; zastępuje „Cała biblioteka”), tabela D7 przeliczona.
> - **Wymagania sprzętowe / filtr miejsca:** zamiast edycji wymagań — **miejsce jako filtr-etykieta, którą łatwo zdjąć** („jak label w JIRA”), także w wyborze ćwiczenia. Wdrożone: `app/picker.tsx` — „📍 Dom ✕” / „+ 📍 Dom” zamiast przełącznika „Pokaż wszystkie” (wybór zapamiętany jak dotąd).
> - **Q-024 (objętość stacji ×1/×2):** odłożone — właściciel: najpierw **pełny katalog ćwiczeń** (pozyskany z zewnętrznego źródła, każde ćwiczenie sprawdzone pod kątem sprzętu, np. Cable Fly bywa na jedną stronę); dziś katalog jest za słaby, żeby rozstrzygać ×2 per ćwiczenie. Nowy temat: katalog ćwiczeń (źródło, licencja, mapowanie na sprzęt) — plan do przygotowania.

**P1. Gdzie przycisk „Zawsze w: Dom” (W3)?**
- (a) **W linijce bloku po zamianie: „zamiast: A · [Zawsze w: Dom]”** (rekomendacja) — zamiana zostaje jednym stuknięciem, „na stałe” to drugie, świadome; widać, co zapisujesz. Minus: o jedno stuknięcie więcej niż „trzeci przycisk”.
- (b) Przełącznik „Zapamiętaj dla: Dom” w arkuszu przed wyborem zamiennika — wszystko w jednym miejscu. Minus: łatwo zostawić włączony i zapisać zamiennik niechcący; arkusz bardziej zatłoczony.

**P2. „Inny przyrząd” (D5), gdy w bloku są już odhaczone serie?**
- (a) **Tylko przed pierwszą serią** (rekomendacja) — prosto; brak dwóch bloków tego samego ćwiczenia w jednym treningu, które zmieniają dobór „Poprzednio” następnej sesji (dopasowanie blok↔blok, runda 10). Minus: zmiana przyrządu w połowie ćwiczenia niemożliwa (zostaje „+ Dodaj ćwiczenie”).
- (b) Podział jak przy zamianie ćwiczenia — pełna elastyczność. Minus: więcej przypadków i testów (+0,5 sesji), dwa bloki RDL w historii.

**P3. Przepięcie w historii (D6): cały blok czy wybrane serie?**
- (a) **Cały blok** (rekomendacja) — typowa pomyłka to całe ćwiczenie pod złą nazwą; jedna akcja.
- (b) Wybór serii (np. „trzecia seria to był skos”) — rzadszy przypadek, wymaga zaznaczania serii i podziału bloku w szkicu (+0,5–1 sesji).

**P4. Przepięcie masa ciała ↔ ciężar (np. Pull Up ↔ Lat Pulldown) — co z wpisanym ciężarem?**
- (a) **Przenieść do pola właściwego B** (jak wpis w polu — `writeLoad`); ujemna asysta przy ćwiczeniu z ciężarem → pole puste i ostrzeżenie „Serie bez ciężaru” przy zapisie (rekomendacja) — poprawka ma sens tylko wtedy, gdy liczby liczą się dla B (rekordy, „Poprzednio”).
- (b) Zostawić wartości w dotychczasowym polu — historia pokazuje je (`shownLoad`), ale **nie liczą się** do rekordów ani podpowiedzi B (`setLoad`, reguła rundy 83b); zero ryzyka zmiany wpisu. Minus: poprawka połowiczna.
- (c) Nie pozwalać na przepięcie między masą ciała a ciężarem.

**P5. Przyrząd w zamiennikach i w historii.**
- P5a — czy „Zawsze w: Dom” ma działać też dla „tego samego ćwiczenia innym przyrządem” (np. „RDL w Domu zawsze na stacji”, pole `TemplateAlt.impl`)? (a) **tak** (rekomendacja: dokładnie znane ryzyko E1 — RDL w domu zapisuje się jako hantle — rozwiązane na stałe; +0,25 sesji) · (b) nie, przyrząd wybierany ręcznie przy każdym treningu.
- P5b — czy w edytorze historii można poprawić **sam przyrząd** bloku (dawne treningi RDL zapisane jako hantle)? (a) **tak** (rekomendacja: ta sama sekcja arkusza, poprawia dobór „Poprzednio” 8c; +0,25 sesji) · (b) nie w E2.

**P6. Dodawanie zamiennika w edytorze szablonu.**
- (a) **Nie w E2** — zamienniki powstają tylko z treningu („Zawsze w”), w edytorze: podgląd, przerwa, usuwanie (rekomendacja: mniej ekranów, szacunek W3 się trzyma).
- (b) „+ zamiennik” w edytorze (wybór miejsca + picker) — można przygotować szablon przed pierwszym treningiem w nowym miejscu. Minus: +0,5 sesji, nowy cel pickera.

**P7. Wagi rankingu i liczba propozycji — liczby bez źródła.**
Wagi (+3/+3/+1/+1/+4/+1) i „3–4 propozycje” pochodzą z propozycji w docs/13 A4, **nie z badań ani danych**.
- (a) **Start z tymi wagami i 3 propozycjami; ocena wyłącznie na tabeli D7** (Dom + Pełna siłownia) przed wydaniem, korekty wag w tym samym commicie co tabela (rekomendacja).
- (b) 4 propozycje — większa szansa trafienia, dłuższy arkusz na 320 pt (test C4/zrzuty).

## 10. Implementacja — stan prac (gałąź `feature/e2-swap`)

Gałąź od `integration/0.9.0` (SDK 57 scalone). **04.10.2026:** do gałęzi wciągnięte też 5 commitów `upgrade/sdk-57` (3be9533…db613bf: ten dokument,
odpowiedzi P1–P7, poprawka zakładek js-tabs), których scalenie do `integration/0.9.0` (b37399a, z 97303e1) nie objęło — bez nich specyfikacji nie było na gałęzi.

| Data | Etap | Co zrobione | Testy / CI | Otwarte |
|---|---|---|---|---|
| 04.10.2026 | W1 sesja 1 | `lib/swap.ts`: ranking (`swapCandidates`, `SWAP_WEIGHTS`, `SWAP_TOP = 3`), linijka „dlaczego” (`reasonText`), D5 `implsAt`/`otherImpls`; tabela D7 `docs/14a-e2-top3.md` generowana testem | `tests/swap-top3.test.ts`, test 11 (`tests/swap-logic.test.ts`) | przegląd tabeli D7 przez właściciela (P7) |
| 04.10.2026 | W1 sesja 2 | `prefillSets` (wspólne z `startFromTemplate`), `swapBlock` / `undoSwap` / `canUndoSwap`, łańcuch `splitFrom` w `restAfter`, „Poprzednio” zamiennika (`swapped` w `previousBlockFor/Before`, `prevOfActiveBlock`), schemat 16 (M1–M4) | testy 1–7, 9–10 (`swap-logic`), 23–25 (`swap-schema16`), 24 (`migrate-idem`), 26 (`invariants`: stały krok podział/zamiana/cofnięcie w każdym przebiegu + losowe akcje); 5 plików z literałem schematu 15 → 16 | — |
| 04.10.2026 | W1 sesja 3 | UI: „⇄ zamień” w akcjach bloku i „⇄” przy plakietce braku sprzętu, arkusz `app/swap.tsx` (propozycje, „już w treningu”, „↺ przywróć”, „Cała biblioteka”), cel pickera `swap:active:<blok>`, linijka „zamiast: A · ostatnio …”, „↺ cofnij” z potwierdzeniem (C7), `timer.relabel` + `afterSwap` (stoper usuniętej serii stop, przerwa trwa, nowy podpis Live Activity), PL/EN | `tests/swap-ui.test.tsx` (5), C2/C3 bez zmian; Maestro `.maestro/07-zamiana.yaml` (kroki 1–6 z pkt 7; krok 7 — D6) | E2E na symulatorze — wynik niżej |
| 04.10.2026 | D5 | `swapImpl` (to samo ćwiczenie, przyrząd przypięty `implPinned`, bez `swappedFrom`; blok z odhaczonymi seriami — podział wg interpretacji P2), `loadsFor(…, prefer)` / `offListAt` / `progressionFor` z `pinnedImpl`, `listLocFor` dla przypiętego przyrządu, `restampUntouched` omija przypięte (dopóki przyrząd jest w miejscu), „📍” zdejmuje przypięcie z bloków bez serii, „Powtórz ostatni” zachowuje przypięcie tylko w tym samym miejscu; sekcja arkusza „Ten sam ruch, inny przyrząd”, nazwa przyrządu w opisie bloku | test 8 + P2 + część testu 9 (`swap-logic`), 2 testy UI | P2 — interpretacja wdrożona; kod nie pokazał problemu (podział tego samego ćwiczenia: „Poprzednio” nowego bloku numerowane od początku bloku, jak na ekranie) |
| 04.10.2026 | W3 | `TemplateItem.alternates` (`TemplateAlt` z własną przerwą i opcjonalnym przyrządem — P5a), migracja M5–M7, `deleteExercise` usuwa wpisy, `dupTemplate` kopiuje; `canRememberAlt` / `rememberAlt` („Zawsze w: <Miejsce>” w linijce bloku — P1 a; także dla samego przyrządu — linijka „przyrząd: …”), `altHint` (liczona przy renderze, nigdy automatycznie), `acceptAlt` (przerwa wpisu albo bloku — D4 a; przyrząd wpisu przypinany), `skipAlt` (✕), `rememberRest` (⏱ „Zapamiętaj” w bloku-zamienniku → `alt.restSec`); edytor szablonu: „Zamienniki” (📍 miejsce: ćwiczenie [— przyrząd], przerwa, ✕ z potwierdzeniem, „(usunięte miejsce)”, „brak sprzętu w: …”; bez dodawania — P6 a) | testy 12–17 (`tests/swap-alternates.test.tsx`), M5–M7, generator `alternates` w `migrate-idem`; Maestro 07 — część W3 (Always at Home + podpowiedź przy ponownym starcie) | E2E po W3 — wynik niżej |
| 04.10.2026 | D6 | `draftSwapExercise` (cały blok — P3 a; H2–H7; masa ciała ↔ ciężar do pola B, ujemna asysta → puste — P4 a), `swapTargetOk` (H3), `canRestoreExercise` / `draftRestoreExercise` (H8, `Draft.origEx`), `draftImplChoices` / `draftSetImpl` (sam przyrząd — P5b a: w miejscu szkicu `implsAt`, bez miejsca — z rodzajów ciężaru); arkusz `app/swap.tsx?target=edit:<klucz>:<blok>` (ranking z miejscem szkicu i licznikami sprzed daty, `parseSwapTarget` w `lib/swap.ts`), picker `swap:edit:…`, „⇄ zamień” w `EditBlock` | testy 18–22 + P5b (`tests/swap-history.test.tsx`); Maestro 07 krok 7 | — |

Decyzje implementacyjne (bez wpływu na zachowanie opisane wyżej; do wglądu):
- `SwapCandidate` ma dodatkowe pole `sessions` (liczba sesji z ćwiczeniem) — remis w rankingu i „robione 12×” w linijce „dlaczego”.
- „Cała biblioteka” zastępuje arkusz pickerem (`router.replace`), więc wybór w pickerze wraca prosto do treningu (jeden „wstecz”).
- Zamiana na ćwiczenie równe oryginałowi (`swappedFrom`) usuwa `swappedFrom` (to powrót, nie zamiana); „cofnij” jest ukryte także, gdy oryginał jest zarchiwizowany (usunięty z biblioteki w trakcie treningu).
- Cel czasu pozycji szablonu przy zamianie trafia do serii poza rozgrzewką (jak w „Powtórz ostatni”); przy cofnięciu do A w miejscu — także ciężar startowy pozycji (gdy A nie ma historii), jak przy starcie.

### Audyt różnicy E2 (04.10.2026, niezależny subagent; `feature/e2-swap` względem 51bfbcd)

Wynik: **0 wysokich, 2 średnie, 2 niskie** — wszystkie naprawione, każde z testem odtwarzającym (czerwony przed poprawką).
- **M1** (D6): trening wstecz z szablonu — po przepięciu na B, które jest też własną pozycją szablonu, serie B puste. `previousBlockBefore` nie dostawał `swapped` z `lib/edit.ts` (reguła pkt 3.6 martwa w edytorze). Poprawka: `prefillSrc` przekazuje `!!e.swappedFrom`. Test: `tests/swap-history.test.tsx` „M1: …”.
- **M2** (D6): „↺ przywróć: A” przy zarchiwizowanym A nic nie robiło (`swapTargetOk` odrzuca archiwum). Poprawka: przywrócenie dopuszcza zarchiwizowany oryginał (H11). Test „M2: …”.
- **L1** (W1): po A→B w miejscu i B→C z podziałem „cofnij” C scalało z blokiem B, choć linijka mówi „zamiast: A”. Poprawka: scalenie z blokiem podziału tylko, gdy to oryginał; inaczej cofnięcie w miejscu do A. Test: `tests/swap-logic.test.ts` „L1: …”.
- **L2** (P5b): trening wstecz — wstrzymanie ciężaru spoza listy (M3) liczone wg domyślnego przyrządu zamiast wybranego ręcznie. Poprawka: `offListAt(…, pinnedImpl(e))` w `prefillFor`. Test „L2: …”.
- ~~Drobiazg: picker z celem `swap:edit` nie pokazuje „Przywróć …” dla zarchiwizowanych ćwiczeń~~ — 04.10.2026 (backlog przed testem): pokazuje, jak `swap:active` (tylko ta sama miara); test `tests/backlog-0410.test.tsx`.


### E2E na symulatorze i build na trening 05.10.2026

GOTOWE DO BUILDU: 409d768352bd32e7788a845352bb5e52a83d19f4 — E2E run 37304786066 7/7, audyt: 0 wysokich / 0 średnich (05.10.2026, 12:35 UTC)

*Zakres:* jak 0f45b27 + wybór wyglądu, domyślnie jasna Kreda (decyzja właściciela 05.10 po instalacji; docs/16). Audyt 0ac7b2b..409d768:
0 wysokich, 0 średnich, 3 niskie (opisane w docs/09).

*Poprzednio (zastąpione 05.10.2026, 12:35 UTC):* `GOTOWE DO BUILDU: 0f45b27fed4064035a441dc53632d74841d38b36 — E2E run 37289333861 7/7, audyt: 0 wysokich / 2 średnich (naprawione) (05.10.2026, 10:05 UTC)`

*Zakres:* jak 8f0f935 + uwagi właściciela 05.10: poranny wpis usunięty, moduły schowane, bez nazw innych aplikacji, „Miejsca i sprzęt”
w Więcej (E2E run 37281443063 7/7 na cb6755b), 16 języków (docs/16), styl marki „Kreda” (docs/16). Audyty: 8f0f935..ac5d764
(0/1/4) i ac5d764..cd60eec (0/1/5) — docs/09. Późniejsze commity do 694ceb1 zmieniają tylko docs/15.

*Poprzednio (zastąpione 05.10.2026, 10:05 UTC):* `GOTOWE DO BUILDU: 8f0f93593a823580a1981c89d4b88c67cc46cc07 — E2E run 37268636855 7/7, audyt: 0 wysokich / 1 średnich (naprawione) (05.10.2026, 06:35 UTC)`

*Zakres:* jak 4cc004b + decyzja właściciela 05.10 „1.a” (nowy sprzęt dopisany raz do miejsc z presetu siłowni) i „2. ok” (ranking przy remisie).

*Poprzednio (zastąpione 05.10.2026, 06:35 UTC):* `GOTOWE DO BUILDU: 4cc004b29d37a9acb2b09452052d77c1f20fefd1 — E2E run 37237348581 7/7, audyt: 0 wysokich / 2 średnich (1 naprawiony, 1 opisany — decyzja właściciela) (04.10.2026, 22:10 UTC)`

*Zakres:* pełna baza ćwiczeń (854; decyzja właściciela „dodawaj resztę”), Q-024, listy wirtualizowane. Aplikacja w E2E zbudowana w run 37226412840 (02ba448) — kod aplikacji bez zmian do 4cc004b (od tego czasu tylko scenariusze Maestro, przepływ E2E, testy i dokumentacja).

*Poprzednio (zastąpione 04.10.2026, 22:10 UTC — pełna baza):* `GOTOWE DO BUILDU: fe5ca7655d11dc79f16fa19da0ac185ce5898d39 — E2E run 37222826222 7/7, audyt: 0 wysokich / 0 średnich (04.10.2026, 19:05 UTC)`

*Poprzednio (zastąpione 04.10.2026, 19:05 UTC — Q-024 „×2 dla dwóch linek”; audyt kodu 62d418e..398da2f: w części Q-024 bez wysokich i średnich):* `GOTOWE DO BUILDU: 62d418eb075f5f5784b88b9838d1575d1b4d360d — E2E run 37221502818 7/7, audyt: 0 wysokich / 1 średnich (naprawione) (04.10.2026, 18:35 UTC)`

*Poprzednio (zastąpione 04.10.2026, 18:35 UTC — katalog 270 ćwiczeń: krok 1 i krok b, poprawki audytów katalogu, E2E: limit sterownika XCTest):* `GOTOWE DO BUILDU: 01f2bee15b78f97e2fe90632b064a268b66f4912 — E2E run 37210063301 7/7, audyt: 0 wysokich / 2 średnich (naprawione) (04.10.2026, 16:05 UTC)`

*Poprzednio (zastąpione 04.10.2026, 16:05 UTC — Q-026, decyzje D7 i filtry-etykiety z poprawkami audytu):* `GOTOWE DO BUILDU: ddff68253c6f045f6ac321ee042e19fc0913bb32 — E2E run 37202832692 7/7, audyt: 0 wysokich / 2 średnich (naprawione) (04.10.2026, 13:40 UTC)`

*Poprzednio (zastąpione 04.10.2026, 13:40 UTC — backlog bez decyzji: „Przywróć …” w pickerze edytora historii, opcja testów navTimers):* `GOTOWE DO BUILDU: bbcf1af3467de11121229c64bf0231df6d14517c — E2E run 37198696767 7/7, audyt: 0 wysokich / 2 średnich (naprawione) (04.10.2026, 11:47 UTC)`

Kod aplikacji = c9e2101 (aplikacja symulatora z przebiegu 37190915402); późniejsze commity zmieniają tylko `.maestro/`,
`.github/workflows/e2e-ios.yml`, `scripts/ci/` i testy. Build ad hoc: gałąź `build/trening-0510` = bbcf1af.

| Przebieg | Commit | Wynik | Przyczyna / poprawka |
|---|---|---|---|
| 37189853451 | 0951d1e (W1) | 6/7 | 03 „Kolejność” — jak niżej |
| 37190915402 | c9e2101 | 5/7 | 03 i 07 (część W3) |
| 37193129280 | 6e47a65 | 5/7 | diagnostyka: `scripts/ci/maestro-failures.py` — nieudane polecenie w logu |
| 37194374128 | f1ef685 | 5/7 | 07: hipoteza „ekran przewinięty” odrzucona (przewijanie w górę też nie znalazło „Start”) |
| 37195812733 | 9a2c8a9 | 5/7 | zrzuty kroków dekodowane z logu (base64) — artefakty nieosiągalne z sesji (proxy) |
| 37197114478 | 4f81ba4 | 6/7 | 03 naprawione: od E2 bloki są wyższe („⇄ swap”), „Reorder exercises” zatrzymywał się pod paskiem zakładek i stuknięcie trafiało w zakładkę More → `centerElement: true` |
| 37198696767 | bbcf1af | **7/7** | 07 naprawione: pod tytułem okna „Cancel workout?” są dwa przyciski „Cancel workout” (okno i przycisk w tle po przewinięciu) — selektor trafiał w ten w tle → przycisk okna wskazany między „Back” a opisem w tle |

Wniosek dla aplikacji (niezmienione, do rozważenia): treść ekranu treningu przewija się pod paskiem zakładek — na telefonie
nie przeszkadza (użytkownik przewija dalej), ale dolne przyciski są tuż nad paskiem.
