# docs/33 — Dostosowanie treningu do miejsca (specyfikacja, 13.10.2026)

Źródło: analityk produktu 13.10.2026 (czytał gałąź wydanie-0.14 — przed wdrożeniem sprawdzić na gałęzi bazowej: swapBlock, setActiveLocation, restampUntouched, planOverrides, numer schematu).

## Decyzje właściciela (13.10.2026, wariant C = A + B, „najlepsze dla użytkowników”)
- Termin: od razu, przed głębokim audytem i App Store (App Store może się opóźnić).
- P0 A: 0.18 = A (bez zmiany schematu, zaraz po 0.17); 0.19 = A4 (miejsce jednorazowe) + B (wyjątek w planie) — jedno podniesienie schematu; potem przenosiny do Apps4Brew → głęboki audyt → 0.20 (naprawy) → App Store.
- P1 A: miejsce jednorazowe = ukryte miejsce z flagą `Location.oneOff?: true` (schemat, 0.19); historia zachowuje nazwę i sprzęt; „Zapisz jako miejsce” zdejmuje flagę.
- P2 A: po zmianie „📍” na miejsce z brakami okno „Dostosuj do: X” otwiera się SAMO (tylko propozycje do przejrzenia; „Anuluj” nic nie zmienia). Dodatkowo wiersz „N ćwiczeń bez sprzętu · Dostosuj” pod chipem (do ponownego otwarcia, i przy starcie z miejscem z brakami).
- P3 A: dwa bloki z tą samą propozycją → drugi dostaje następną z rankingu (dopisek przy wierszu). Reguła produktowa.
- P4 A: dzień z miejscem w planie → po starcie okno z zaznaczonymi propozycjami i jednym „Zastosuj”; nigdy automatyczna zamiana.
- P5 A: cofanie tylko „Cofnij zamianę” na bloku + sekcja „Wraca z planu” po powrocie do miejsca; bez zbiorczego „Cofnij dostosowanie”.
- P6 B: wyjątek w planie jako ZAKRES dat od–do (np. Hotel pt–nd), nie tylko jeden dzień.
- P7 A: miejsce zostaje przy dacie przy przesunięciu treningu (opisuje, gdzie użytkownik jest).

## Słownik
- Ćwiczenie z planu = `swappedFrom ?? exerciseId` (ranking i przywracanie zawsze od niego).
- Blok do dostosowania: ćwiczenie niedostępne w miejscu (`availability(...).ok === false`), ≥1 nieodhaczona seria, nie pominięty, nie „Usunięte ćwiczenie”.
- Blok do przywrócenia: ma `swappedFrom`, ćwiczenie z planu dostępne w nowym miejscu, brak odhaczonych serii, `canUndoSwap`.

## A — „Dostosuj do miejsca” (0.18, bez schematu)
1. Start jak dziś. „📍 X ▾” → wybór miejsca → `setActiveLocation` (L5) → przy ≥1 bloku do dostosowania/przywrócenia okno otwiera się samo (P2 A) + wiersz pod chipem.
2. Okno `app/adapt.tsx` (wzór swap/picker; zamykanie wg katalogu wzorców — „Anuluj” po lewej; „Zastosuj (n)” po prawej). Stała linijka: „Zamiany tylko w tym treningu — szablon i plan bez zmian.”
3. Wiersz na blok w kolejności treningu: „A → B”, linijka „dlaczego” (`reasonText`), dopiski. Domyślny wybór: (a) zamiennik per miejsce z szablonu (W3 `alternates`), (b) pierwsza propozycja `swapCandidates(z planu, {locationId, showAll:false})` z regułą P3, (c) brak → „Bez zmian”.
4. Stuknięcie wiersza → istniejący arkusz `swap.tsx` z celem `adapt:<blockId>` (zwraca wybór, nie zapisuje): top-3, „Ten sam ruch, inny przyrząd”, biblioteka, + „Bez zmian”, „Pomiń dziś”. Jeden arkusz zamiany w aplikacji.
5. Sekcja „Wraca z planu”: „B → A”, domyślnie zaznaczone.
6. „Zastosuj” → `adaptActive(choices)` w lib/state/swap.ts: w pamięci kolejno swapBlock/swapImpl/undoSwap/skipExercise, jeden zapis; potem afterSwap/relabelRest; ogłoszenie VoiceOver „Zamieniono N ćwiczeń”.
7. Po zastosowaniu bloki jak po W1 („zamiast: A …”, „Cofnij zamianę”, „Zawsze w: X” tylko dla zapisanego miejsca).

## A4 — miejsce jednorazowe (0.19, schemat)
W arkuszu „📍” pozycja „Inne miejsce (tylko dziś)…” → szybka lista sprzętu (presety Hotel / Tylko masa ciała / Dom + grupy sprzętu, bez ciężarów — [DO WYJAŚNIENIA]) → „Użyj”, nazwa (domyślnie „Tylko dziś”), przełącznik „Zapisz jako miejsce”. `oneOff` wykluczone z list miejsc, `startLocationId`, generatora, edytora szablonu, „Zawsze w”. Migracja (fixLocations), idempotencja, kopia.

## B — miejsce na zakres dni w planie (0.19, schemat)
Plan → dzień → „Więcej opcji” → „📍 Miejsce na te dni” → miejsce (+ „Inne miejsce…”) i zakres od–do (P6 B). Dni pokazują „📍 Hotel”; „Usuń miejsce” przywraca domyślne. Start w tych dniach (każda droga startu) bierze miejsce dnia przed miejscem szablonu, potem okno A z zaznaczonymi propozycjami (P4 A). Przypomnienie rano: „Dziś: FBW A · Hotel”, przeliczane po zmianie. Przesunięcie treningu: miejsce zostaje przy dacie (P7 A); `resetDay` nie usuwa miejsca. Dane: `State.planPlaces?: Record<data, locationId>` (osobno od planOverrides) + `SavedPlan.places?`; migracja (idOf, klucze-daty, bez __proto__), kopia, podniesienie schematu (jedno z A4).

## Stany brzegowe (skrót)
Brak zamiennika → „Bez zmian” domyślnie, „Pomiń dziś”/biblioteka. Częściowo odhaczony → podział (W1 przypadek 2); w pełni odhaczone poza listą. Superserie → groupId zachowany, test rund. Siłownia→Hotel→Siłownia → „Wraca z planu”. Hotel→Dom → ranking od ćwiczenia z planu. „Poprzednio”/rekordy/progresja — bez zmian logiki (M3, prevFromOther). Usunięte miejsce → jak M7. Deload → kolejność: pytanie deload, potem okno. Generator bez zmian. „Zapisz zmiany w szablonie” nie pojawia się z powodu zamian. Restart z otwartym oknem → nic nie zastosowano. Zero miejsc → brak 📍 (A4 przy zerze miejsc [DO WYJAŚNIENIA]). Arkusz 📍 przy >3 miejscach (HIG maks. 4 przyciski) [DO WYJAŚNIENIA].

## Merytoryczne podstawy
Brak nowych reguł doboru: ranking i wagi `lib/swap.ts` bez źródła — „uproszczenie, decyzja P7 a”. Zakres powtórzeń/przerwa zostają z bloku (D4 a); przeniesienie reguły „w domu 12–20” tylko po potwierdzeniu badacza. Brak przeliczeń ciężaru A→B. Preset „Hotel” — założenie produktowe „do potwierdzenia” (docs/10 sekcja 5).

## Testy (docs/20)
Logika (adaptCandidates, adaptActive atomowe, B: plannedPlace/zakres/przesunięcia/tidy/usunięcia), ekran (wiersz, okno, cel adapt:, panel dnia, Inne miejsce), scenariusz „z życia” (plan Pn/Śr/Sb; w piątek Hotel pt–nd; sobota: przypomnienie z „Hotel” → start → okno → 1 bez zamiennika (Pomiń), 1 ręcznie → Zastosuj → restart → koniec → brak „Zapisz zmiany w szablonie”; poniedziałek: siłownia, szablon oryginalny), macierz (trasa adapt, wymiar typu wyboru), niezmienniki (szablony i plan nie zmieniają się po adaptActive), dane (migrate, kopia, stary build), języki/wygląd (35, motywy, najdłuższe nazwy), regresja W1/W3/D5, E2E Maestro (📍 → okno → Zastosuj → „zamiast:”; B w scenariuszu planu).

## Szacunek pracy agenta
A ok. 1,5–2 dni; A4 +1 dzień; B (z zakresem) ok. 2–2,5 dnia. Czekanie: E2E na macOS, TestFlight.

## Stan wdrożenia — etap 1 (logika, bez ekranów; gałąź `f018-dostosuj`, 13.10.2026)
Zrobione w `lib/` (bez zmiany `SCHEMA_VERSION` = 18; UI po złożeniu 0.17):
- `lib/adapt.ts` (czyste funkcje nad stanem, bez zapisu): `adaptCandidates(workout, locationId)` → wiersze `AdaptRow` do okna „Dostosuj do: X” (definicja ze „Słownika”,
  kolejność treningu; domyślny wybór: W3 `alternates` → pierwsza z `swapCandidates` od ćwiczenia z planu → „Bez zmian”); `restoreCandidates(workout, locationId)` → wiersze
  `RestoreRow` sekcji „Wraca z planu”; typ `AdaptChoice` (`swap` | `impl` | `skip` | `restore`, stała `ADAPT_KINDS`).
- `adaptActive(choices)` w `lib/state/swap.ts` (eksport przez `lib/store.ts`): w pamięci kolejno swapBlock / swapImpl / undoSwap / skipExercise (rdzenie bez zapisu),
  jeden zapis; wynik `{ goneSetIds, skippedSetIds, swapped, restored, skipped }` (ekran: `afterSwap([...goneSetIds, ...skippedSetIds])`, komunikat „Zamieniono N ćwiczeń”).
  Wszystko albo nic: nieprawidłowy wybór (brak bloku, ten sam blok dwa razy, odrzucona zamiana, „Pomiń” już pominiętego) cofa całość i zwraca `null`.
  Szablony i plan nie są dotykane.

Doprecyzowania przyjęte przy implementacji (do przejrzenia przez właściciela przy UI):
1. Zamiennik z szablonu (W3) zajmuje ćwiczenie przed rankingiem; reguła P3 A dotyczy propozycji z rankingu (kolejność treningu). Dwa zamienniki z szablonu o tym samym ćwiczeniu zostają (właściciel ustawił je jawnie).
2. P3 A, gdy rankingu zabraknie na „następną”: wiersz powtarza propozycję i jest oznaczony `duplicate` (dopisek), zamiast „Bez zmian” — użytkownik może zmienić.
3. Blok, który może wrócić do planu (`restoreCandidates`), nie trafia na listę dostosowań, nawet gdy jego bieżące ćwiczenie jest niedostępne.
4. Pominięty blok nie jest ani dostosowywany, ani przywracany. Blok z odhaczonymi seriami, którego ćwiczenie z planu jest znów dostępne, a bieżące nie — lista dostosowań (ranking od planu, bez samego ćwiczenia z planu; brak „powrotu” — `canUndoSwap` wymaga zera odhaczonych serii).
5. Ćwiczenie z planu usunięte (archiwum) — ranking od ćwiczenia bieżącego; blok nie wraca (brak do czego).
