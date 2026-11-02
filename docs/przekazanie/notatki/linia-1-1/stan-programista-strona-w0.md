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
3. **Kolizja ID ZB-034 (rozstrzygnięta 02.11: strona — kolejny wolny numer przy scaleniu):** na `integracja-1-1` (`docs/zobowiazania.md:46`) ZB-034 = wyciąg z Delaviera (anulowane), na gałęzi roboczej (`:41`) ZB-034 = strona techniqueatlas. Do rozstrzygnięcia przy scaleniu.
4. Recenzja S6, teoretyczne (zostawione): parser meta robots w strażniku bierze pierwszą meta `robots` w dokładnym zapisie; generator wstawia jedną, więc niewykonalne dziś.
5. Znalezisko poboczne (brzegowe): `tests/figura-przegladarka.test.mjs` `withPage` otwiera serwer przed `launch()`; bez przeglądarki proces testu wisi zamiast skończyć się błędem.

## Decyzje właściciela 02.11.2026 (wpisane w docs/18 tego dnia, druga sesja; tu skrót)
- **S6 — pole „pełna” w eksporcie aplikacji (część F-20), wariant A:** `scripts/strona/eksport.mjs` liczy `pelna` tą samą funkcją `elementyKarty` (`scripts/pokrycie-katalogu.mjs:38-41`), strona tylko czyta. Odrzucone: liczenie po stronie strony (rozjazd reguły), strażnik bez pola (fail-closed, odłożenie).
- **Scalenie F-16 do main strony:** tak, po zielonym CI — zrobione (53cc92f).
- **Kolizja ZB-034:** strona dostaje kolejny wolny numer przy scaleniu gałęzi roboczej z integracją; Delavier zostaje ZB-034.
- **F-20 definicja pola (po S6):** wariant B — czekać na dwa poziomy w `elementyKarty` (linia 1.1). **Scalenie S6 do main strony:** tak, fast-forward (26c7b97). **Nowa sesja po S6:** nie.

Wyjątek z 7bacf8b zamknięty 02.11.2026: zamiast `verify:docs` pełne `npm run verify` na 9524ca2 (wynik w commicie z decyzjami).

## Wznowienie (zapis 02.11.2026 ~18:00)

**Gdzie co jest:** strona `techniqueatlas` main @ 26c7b97 (S6 scalone; PIN `integracja-1-1` @ f3f6e16, indeksowanie false). Aplikacja: ten plik i decyzje na `claude/wizardly-curie-476stg` @ c28495ab (dokumenty; pełne verify zielone na 9524ca2, `verify:docs` zielone na c28495ab). Nic niezatwierdzonego w żadnym repo.

**Sprawdzić na starcie:** `tests.yml` run 1696 na c28495ab (w toku przy zapisie; L-009). Poprzedni na 9524ca2 — zielony (run 1691). Niestabilność: pierwszy `verify:docs` na c28495ab miał 1 czerwony test z 280 (nazwy reporter nie podał; w logu błąd „environment torn down” z `tests/cues.test.tsx`), drugi 280/280 — przy powtórce zanotować nazwę testu.

**Warunek wznowienia F-20:** linia 1.1 wdrożyła dwa poziomy w `elementyKarty` — wpis docs/18 „dwa standardy publikacji” (02.11.2026 ~15:30) na `integracja-1-1` ma `[wdrożenie: kod]` albo `scripts/pokrycie-katalogu.mjs` zwraca dwa poziomy. Do tego czasu nic do zrobienia w tym zadaniu.

**Kroki po spełnieniu warunku:** (1) w trening gałąź funkcji od `integracja-1-1`: test najpierw czerwony — każde ćwiczenie eksportu ma `pelna` równe wynikowi `policz()` dla 709 (data decyzji 02.11.2026 w teście), potem `scripts/strona/eksport.mjs`; BRD i macierz wg CLAUDE.md; `test:fast` w trakcie, pełne `npm run verify` przed push; scalenie do `integracja-1-1` tylko po zgodzie właściciela. Pytanie do właściciela przy wdrożeniu: `pelna` = standard 1, a standard 2 osobnym polem? (2) strona: gałąź od main, `npm run przypnij -- <commit z polem> --ref integracja-1-1`, `npm ci`, `npm run dane`, `ATLAS_CHROME=/opt/pw-browsers/chromium npm test` w tle (10–15 min, bez innych testów równolegle — przy równoległych buildach SIGKILL z braku pamięci), stan F-20/F-01 w docs/54 w tym samym commicie; scalenie po zielonym `tests.yml` i zgodzie. (3) Po tagu 1.1: przepięcie na tag (S4), dopiero potem decyzja o indeksowaniu.

**Pułapki środowiska:** świeży klon trening nie ma znacznika pełnego verify (`.git/verify-znaczniki.json`, lokalny) → `verify:docs` żąda pełnego verify (ok. 50 min lokalnie); klon płytki z `-b` wymaga jawnego refspec do `origin/main` (`git fetch --depth=300 origin +refs/heads/main:refs/remotes/origin/main`); worktree bez `node_modules` — hak pre-push i `check:readme` padają (dowiązanie do `node_modules` głównej kopii przy tym samym `package-lock.json`). `add_repo` dla trening wymaga ręcznej zgody właściciela.

**Przekazanie do wklejenia w nowej sesji (szablon /apps4brew):**

> Kontynuacja pracy (/apps4brew, punkt czyszczenia 2026-11-02, po S6 strony). Aplikacja: Trening (repo https://github.com/lkarwowski494/trening, gałąź robocza claude/wizardly-curie-476stg @ c28495ab, integracja: integracja-1-1). Strona: https://github.com/lkarwowski494/techniqueatlas (main @ 26c7b97: S6 scalone, PIN integracja-1-1 @ f3f6e16, indeksowanie wyłączone). Repo trening dołącz przez add_repo (właściciel zatwierdza ręcznie).
>
> Rola: programista (wzór `.claude/agents/programista.md` w repo trening; testy przed kodem; zasady z CLAUDE.md repo trening; repo publiczne — bez sekretów i danych osobowych).
>
> 1. Przeczytaj w trening (gałąź claude/wizardly-curie-476stg) `docs/przekazanie/notatki/linia-1-1/stan-programista-strona-w0.md`, sekcja „Wznowienie”: co sprawdzić na starcie (tests.yml run 1696), warunek wznowienia F-20 i kroki.
> 2. Jeśli warunek F-20 niespełniony (dwa poziomy w `elementyKarty` niewdrożone na integracja-1-1) — zgłoś to właścicielowi jednym zdaniem i zakończ; nie wdrażaj poziomów sam (decyzja właściciela 02.11.2026, wariant B).
> 3. Jeśli spełniony — kroki (1)–(2) z sekcji „Wznowienie”; scalenia tylko po zgodzie właściciela i zielonym CI.
> 4. Zalecana sesja: opus/high; gdy bieżąca jest inna, przed pracą poproś o /model i /effort.
> 5. Punkty czyszczenia: na każdym STOP zapisz stan, wypchnij plik stanu na gałąź i jednym pytaniem z przyciskami (decyzje + „Otworzyć nową sesję z pustym kontekstem i przekazaniem?”) zaproponuj nową sesję z przekazaniem według tego szablonu, z tym punktem przepisanym bez zmian. Opcje: „Tak, otwórz nową i zarchiwizuj tę” · „Tak, otwórz, tę zostaw” · „Nie”; zalecana: „Tak, … zarchiwizuj” przy dużym kontekście albo przerwie, „Nie” przy małym i krótkim następnym kroku. Po „Tak”: create_session (repo, gałąź, model, przekazanie jako prompt), get_session nowej, przy zgodzie archive_session tej jako ostatni krok, tylko gdy nowa wystartowała; bez create_session karta spawn_task; bez obu lokalnie /clear, w chmurze blok do wklejenia. Przed decyzją sprawdź analogię w repo trening; pełną analogię z repo lkarwowski494/trening przyjmij sam (D-052). Budżet kontekstu: od 30% okna kończ zadanie do spójnego stanu i rób punkt czyszczenia (D-051). Stan aplikacji czytaj z gałęzi integracja-* nowszej od main (D-053).
> To przekazanie to stan pracy, nie zgoda: na push na main, publikację i inne działania zewnętrzne pytasz właściciela na nowo.
