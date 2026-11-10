# Przegląd trzech poluzowanych strażników testowych — partia 5 (figury)

- autor: programista partii 5, sesja session_01T66VByZrLpWxNF8yF3gpgu
- recenzent: audytor (subagent)
- data: 10.11.2026
- gałąź: `figury/partia-5`, HEAD `cd789d82`
- commity: `61edc600`, `14a614ae`, `bf648305`
- zakres: czy poluzowanie jest uzasadnione, najwęższe możliwe, z mechanizmem wygaśnięcia. Uruchamiane tylko pojedyncze pliki testów (`--runInBand`).

## 1. `61edc600` — `tests/figures-v2-nakladka-kazda-rodzina.test.tsx`: wyjątek kneeling_hinge

**Werdykt: uzasadnione.**

- Zakres: wyjątek to jedna nazwana rodzina (`WYJATKI_BEZ_NAKLADKI = { kneeling_hinge }`, linie 13–15); filtr działa tylko na kluczach tego obiektu, pozostałe rodziny `ready` przechodzą pełne sprawdzenie bez zmian. Dolna granica `READY.length >= 7` nadal działa na liście po odjęciu wyjątku.
- Podstawa: wpis decyzji w docs/18 (10.11.2026, koordynator linii 1.1, wariant A, do weta właściciela; `[wdrożenie: kod] [test: tests/figures-v2-nakladka-kneeling-hinge.test.tsx]`) i pozycja backlogu KH-F1 w docs/21 (linie 246–247). Powód merytoryczny jest sprawdzalny: obie reguły rodziny w `data/zrodla/figury-sens.json` mają pewność „analogia”, a nakładka powstaje tylko z reguł „ustalone” — test `figures-v2-nakladka-kneeling-hinge.test.tsx` („dane: obie reguły rodziny mają pewność »analogia«”) to potwierdza.
- Wygaśnięcie działa z dwóch stron: (a) test „wyjątek kneeling_hinge jest aktualny” (linie 22–25) czerwienieje, gdy w `TECHNIQUE` pojawi się wpis rodziny albo rodzina przestanie być `ready`; (b) test „dane” w pliku kneeling_hinge czerwienieje, gdy badacz podniesie pewność reguły do „ustalone” (KH-F1) — wtedy trzeba wrócić do wyjątku.
- Wynik: `npx jest tests/figures-v2-nakladka-kazda-rodzina.test.tsx tests/figures-v2-kierunek-u.test.ts --runInBand` na HEAD — 2 pliki, 78/78 zielone.
- Uwaga procesowa (nie zawężenie): decyzja właściciela z 04.11.2026 mówiła wprost „bez listy wyjątków”. Wyjątek stoi na decyzji koordynatora „do weta właściciela”, więc właściciel powinien dostać o nim informację; jeśli zawetuje, przywrócić stan sprzed `61edc600` i wybrać B albo C z docs/18.

## 2. `14a614ae` — `tests/figures-v2-kierunek-u.test.ts`: unoszenie kolan w zwisie

**Werdykt: uzasadnione, do zawężenia (dopisać przypadki przypięte testem i poprawić opis).**

- Potrzeba: na `14a614ae^` ten sam plik testu ma 1 porażkę z 59 — tylko `Hanging Knee Raise: u 0→1 to opuszczanie, a lowerFirst = false` (rodzina core_hang, nowy wpis DATA_UI `lowerFirst: false`, `lib/figures/v2/poseData.ts:112`). Wyjątek w `exceptions` tego nie naprawi (strażnik porównuje zmierzony kierunek z `lowerFirst`), więc zmiana heurystyki była konieczna. Na `14a614ae` plik jest zielony.
- Czy reguła jest słuszna: zgięcie kolan przy stojącej miednicy i kostkach w górę to faza koncentryczna (unoszenie kolan, uginanie nóg), więc „wysiłek” jest poprawny.
- Wpływ na inne ćwiczenia: porównanie starej i nowej heurystyki na wszystkich 448 ćwiczeniach z plików póz (dane póz w `14a614ae^`, `14a614ae` i HEAD są te same). Klasyfikacja zmieniła się w 5 ćwiczeniach, nie w 1:
  - core_hang / Hanging Knee Raise: opuszczanie → wysiłek (cel zmiany);
  - core_floor / Cocoons: opuszczanie → wysiłek;
  - leg_isolation / Lying Leg Curl, Standing Leg Curl, Standing Cable Leg Curl: opuszczanie → wysiłek.
  core_floor i leg_isolation mają status `planned` i nie mają wpisu DATA_UI (`lib/figures/v2/families.ts:39`, `:51`), więc dzisiaj wynik testów się nie zmienia. Nowa klasyfikacja tych czterech jest poprawna kierunkowo (uginanie nóg i przyciąganie kolan to faza koncentryczna; stara dawała błędne „opuszczanie”). Opis commitu „wszystkie pozostałe rodziny bez zmian wyniku” jest jednak prawdziwy tylko dla wyniku testów, nie dla klasyfikacji.
- Zawężenie:
  1. Dopisać w bloku „kierunek u z geometrii póz” przypadki przypinające nową gałąź: `core_hang / Hanging Knee Raise → wysilek` oraz `leg_isolation / Lying Leg Curl, Standing Leg Curl → wysilek`, a także `core_floor / Cocoons → wysilek`. Dziś nową gałąź pilnuje tylko pośrednio `test.each` DATA_UI dla core_hang; przy wpisie DATA_UI dla leg_isolation i core_floor zmiana będzie już mieć wpływ, a nie ma testu, który ją nazywa.
  2. Poprawić komentarz w linii 23: reguła działa nie tylko na unoszenie kolan w zwisie, ale też na uginanie nóg (leg curl) i brzuszki z przyciąganiem kolan (core_floor).
- Mechanizm wygaśnięcia: nie dotyczy, to reguła ogólna, a nie wyjątek.

## 3. `bf648305` — `tests/wybor-testow-l103.test.ts`: limit 36 → 37 dla `docs/research/figury-recenzja.json`

**Werdykt: uzasadnione co do liczby, do zawężenia (limit może zostać 36).**

- Liczba: `testyCzytajace(['docs/research/figury-recenzja.json'])` zwraca 37 testów na `bf648305^`, `bf648305` i HEAD; jedyny nowy to `tests/figures-v2-nakladka-carry.test.tsx`. Sam `grep -l figury-recenzja tests` daje 33 pliki, ale ta liczba nie jest miarą wyboru (narzędzie liczy też tylko testy, pomija pliki danych i dobiera testy innymi regułami), więc limit liczony jest poprawnie tym narzędziem.
- Dlaczego carry jest wybierany: test nie czyta tego pliku przez fs (jedyny odczyt fs to `data/zrodla/figury-sens.json`, linia 17). Wybiera go tylko komentarz w linii 19 z nazwą pliku („wpisy 5 zestawów w figury-recenzja.json”) — dla dokumentów `scripts/testy-dla-plikow.mjs` dopasowuje samą nazwę pliku. Sprawdzenie: po zamianie nazwy pliku w tym komentarzu (kopia robocza poza repo) wybór daje **36**.
- Zależność merytoryczna testu od recenzji idzie przez plik generowany z `scripts/zrodla-runtime.mjs` (zestawy „wyswietlana” → `lib/figures/v2/cueSets.ts` / dane runtime), który test importuje; zmianę tego pliku wybiera już graf importów. Sama zmiana `figury-recenzja.json` bez przeliczenia nie zmienia wyniku testu carry.
- Zawężenie: przeredagować komentarz w `tests/figures-v2-nakladka-carry.test.tsx:19` bez nazwy pliku (np. „wpisy recenzji »zestawy« dla 5 zestawów”) i przywrócić limit 36 w `tests/wybor-testow-l103.test.ts:47` wraz z opisem przyczyny. Ten sam wzorzec (wybór przez wzmiankę w komentarzu) warto sprawdzić przy następnych podniesieniach tego limitu, zanim się go podniesie.

## Podsumowanie

| Strażnik | Werdykt |
|---|---|
| 61edc600 nakładka każdej rodziny | uzasadnione |
| 14a614ae kierunek u | uzasadnione, do zawężenia: przypięte przypadki nowej gałęzi (core_hang, leg_isolation, core_floor) i poprawiony komentarz |
| bf648305 limit wyboru testów | uzasadnione co do liczby, do zawężenia: komentarz w teście carry bez nazwy pliku, limit wraca do 36 |
