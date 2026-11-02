# Stan: programista strony techniqueatlas — start W0 (F-16, S6)

Aktualizacja: 2026-11-02 (druga sesja) · Rola: programista · Strona: `techniqueatlas` main @ 26c7b97 (S6, gałąź `claude/s6-pelna`, fast-forward po zielonym `tests.yml` run 30 i zgodzie właściciela); wcześniej 53cc92f (F-16).

## Zrobione
- **F-16 (podgląd):** commit 53cc92f. `PIN.json` → `integracja-1-1` @ f3f6e16 (zawiera ZB-025 b, a0e06d7; jedyny commit zmieniający `lib/nazwy-en.generated.ts` na integracji: d2002a3). Eksport `npm run dane` przechodzi: wersja 1.0.0, 709 ćwiczeń × 35 języków, 98 figur. Na fba531d 208 z 709 adresów EN byłoby innych (porównanie eksportów, np. `bench-press-dumbbell` → `dumbbell-bench-press`).
- `npm run slugi`: `slugs.lock.json` 709 wpisów. Test `tests/zamrozenie-slugow.test.mjs`: czerwony przed zamrożeniem (0 ≠ 709), zielony po; zmiana nazwy po zamrożeniu = błąd bez wpisu, przekierowanie z wpisem.
- Dwa testy dostosowane do danych z figurami (pusty lock podany jawnie; szablon `{opis}` w `data-labels` figury wyłączony z kontroli).
- `npm test` strony: 99 testów, 98 ok, 0 błędów, 1 pominięty z powodem, kod 0 (lokalnie z `ATLAS_CHROME=/opt/pw-browsers/chromium`, po `npm ci`).

- **S6 / ZM-06 (strona, 26c7b97):** `src/pages.mjs` indeksuje ćwiczenie tylko przy `pelna === true` i własnych wskazówkach kompletnych w języku (brak pola = noindex); `checkIndexingRule` (`src/straznicy.mjs`) sprawdza zbudowane strony niezależnie (flaga albo meta robots) i przerywa build przy indeksowaniu; eksport bez pola = warunek startu niespełniony. Usunięty warunek figur 709/709 i `start-wyjatki.json`. Testy czerwone najpierw (2 × AssertionError: ćwiczenia z własnymi wskazówkami bez pola były indeksowane). Recenzja niezależna: testy hreflang/jezyki-podglad zakładały indeksowane back-squat → testowe wejście `build({ zmianaDanych })`; mutacja „strażnik dostaje pages: []” przeżywała → test raportu indeksowanych ćwiczeń (łapie). Lokalnie `npm test`: 102 testy, 101 ok, 0 błędów, 1 pominięty z powodem, kod 0; `tests.yml` run 30 zielony.
- Repo trening: pełne `npm run verify` na 9524ca2 (zamiast `verify:docs`, bo świeży klon nie ma znacznika pełnego verify — H1 niedostępne); wynik w commicie z decyzjami.

## Otwarte (warunki i decyzje)
1. **Tag 1.1 nie istnieje** (najnowszy `v1.0.1-b1035`). PIN na integracji tylko do podglądu; `indeksowanie` zostaje false. Po tagu: `npm run przypnij -- <skrót> --ref v1.1.0-…`, `npm run dane`, `npm test` (S4).
2. **F-20 „pole pełna” czeka na linię 1.1** (decyzja właściciela 02.11.2026, wariant B): najpierw dwa poziomy w `elementyKarty` (wpis „dwa standardy publikacji” w docs/18, ~15:30), potem `scripts/strona/eksport.mjs` dodaje `pelna` (test: pole zgodne z `policz()` dla 709), przepięcie PIN strony na commit z polem, `npm run dane`, `npm test`. Do ustalenia przy wdrożeniu: czy `pelna` = standard 1, a standard 2 osobnym polem.
3. **Kolizja ID ZB-031 (rozstrzygnięta 02.11: strona — kolejny wolny numer przy scaleniu):** na `integracja-1-1` (`docs/zobowiazania.md:46`) ZB-031 = wyciąg z Delaviera (anulowane), na gałęzi roboczej (`:41`) ZB-031 = strona techniqueatlas. Do rozstrzygnięcia przy scaleniu.
4. Recenzja S6, teoretyczne (zostawione): parser meta robots w strażniku bierze pierwszą meta `robots` w dokładnym zapisie; generator wstawia jedną, więc niewykonalne dziś.
5. Znalezisko poboczne (brzegowe): `tests/figura-przegladarka.test.mjs` `withPage` otwiera serwer przed `launch()`; bez przeglądarki proces testu wisi zamiast skończyć się błędem.

## Decyzje właściciela 02.11.2026 (wpisane w docs/18 tego dnia, druga sesja; tu skrót)
- **S6 — pole „pełna” w eksporcie aplikacji (część F-20), wariant A:** `scripts/strona/eksport.mjs` liczy `pelna` tą samą funkcją `elementyKarty` (`scripts/pokrycie-katalogu.mjs:38-41`), strona tylko czyta. Odrzucone: liczenie po stronie strony (rozjazd reguły), strażnik bez pola (fail-closed, odłożenie).
- **Scalenie F-16 do main strony:** tak, po zielonym CI — zrobione (53cc92f).
- **Kolizja ZB-031:** strona dostaje kolejny wolny numer przy scaleniu gałęzi roboczej z integracją; Delavier zostaje ZB-031.
- **F-20 definicja pola (po S6):** wariant B — czekać na dwa poziomy w `elementyKarty` (linia 1.1). **Scalenie S6 do main strony:** tak, fast-forward (26c7b97). **Nowa sesja po S6:** nie.

Wyjątek z 7bacf8b zamknięty 02.11.2026: zamiast `verify:docs` pełne `npm run verify` na 9524ca2 (wynik w commicie z decyzjami).
