# Stan: programista strony techniqueatlas — start W0 (F-16, S6)

Aktualizacja: 2026-11-02 · Rola: programista · Gałąź strony: `techniqueatlas:claude/start-w0-pin-s6` — scalona fast-forward do main @ 53cc92f 02.11.2026 po zielonym `tests.yml` (run 27) i zgodzie właściciela.

## Zrobione
- **F-16 (podgląd):** commit 53cc92f. `PIN.json` → `integracja-1-1` @ f3f6e16 (zawiera ZB-025 b, a0e06d7; jedyny commit zmieniający `lib/nazwy-en.generated.ts` na integracji: d2002a3). Eksport `npm run dane` przechodzi: wersja 1.0.0, 709 ćwiczeń × 35 języków, 98 figur. Na fba531d 208 z 709 adresów EN byłoby innych (porównanie eksportów, np. `bench-press-dumbbell` → `dumbbell-bench-press`).
- `npm run slugi`: `slugs.lock.json` 709 wpisów. Test `tests/zamrozenie-slugow.test.mjs`: czerwony przed zamrożeniem (0 ≠ 709), zielony po; zmiana nazwy po zamrożeniu = błąd bez wpisu, przekierowanie z wpisem.
- Dwa testy dostosowane do danych z figurami (pusty lock podany jawnie; szablon `{opis}` w `data-labels` figury wyłączony z kontroli).
- `npm test` strony: 99 testów, 98 ok, 0 błędów, 1 pominięty z powodem, kod 0 (lokalnie z `ATLAS_CHROME=/opt/pw-browsers/chromium`, po `npm ci`).

## Otwarte (warunki i decyzje)
1. **Tag 1.1 nie istnieje** (najnowszy `v1.0.1-b1035`). PIN na integracji tylko do podglądu; `indeksowanie` zostaje false. Po tagu: `npm run przypnij -- <skrót> --ref v1.1.0-…`, `npm run dane`, `npm test` (S4).
2. **S6 (ZM-06) zablokowany zakresem:** eksport (`scripts/strona/eksport.mjs`) nie ma pola „pełna”. Liczy je `scripts/pokrycie-katalogu.mjs:38-41,75` (`elementyKarty`: wskazówki + częste błędy tekstem + figura v2 + animowany błąd + role mięśni). Decyzja właściciela: pole w eksporcie aplikacji (część F-20) czy liczenie po stronie strony.
3. **Kolizja ID ZB-031:** na `integracja-1-1` (`docs/zobowiazania.md:46`) ZB-031 = wyciąg z Delaviera (anulowane), na gałęzi roboczej (`:41`) ZB-031 = strona techniqueatlas. Do rozstrzygnięcia przy scaleniu.
5. Znalezisko poboczne (brzegowe): `tests/figura-przegladarka.test.mjs` `withPage` otwiera serwer przed `launch()`; bez przeglądarki proces testu wisi zamiast skończyć się błędem.

## Decyzje właściciela 02.11.2026 (punkt czyszczenia po F-16; do wpisania w docs/18 z polami `[wdrożenie]`, `[wykonalność]` i `npm run verify:docs` w następnej sesji)
- **S6 — pole „pełna” w eksporcie aplikacji (część F-20), wariant A:** `scripts/strona/eksport.mjs` liczy `pelna` tą samą funkcją `elementyKarty` (`scripts/pokrycie-katalogu.mjs:38-41`), strona tylko czyta. Odrzucone: liczenie po stronie strony (rozjazd reguły), strażnik bez pola (fail-closed, odłożenie).
- **Scalenie F-16 do main strony:** tak, po zielonym CI — zrobione (53cc92f).
- **Kolizja ZB-031:** strona dostaje kolejny wolny numer przy scaleniu gałęzi roboczej z integracją; Delavier zostaje ZB-031.
- **Nowa sesja z przekazaniem:** tak, ta archiwizowana.

Wyjątek nazwany: commit 7bacf8b (zobowiązania + ten plik) bez `verify:docs` (zależności repo trening niezainstalowane w tej sesji); kontrola zastępcza: następna sesja uruchamia `npm run verify:docs` przed swoim pierwszym pushem.
