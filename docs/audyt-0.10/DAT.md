# Audyt 0.10.0 — dane i migracje (DAT)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

Audyt robiłem na **d2a1e85**. Najpierw czytałem kopię tego commitu wyeksportowaną do katalogu roboczego. Gdy koordynator przełączył worktree, sprawdziłem `git rev-parse` i `diff -rq lib` — kod jest identyczny, więc żadne znalezisko nie pochodzi ze starego kodu.

- **Typy stanu** (`lib/seed.ts:73-106`):
  - 27 pól najwyższego poziomu (w tym `saveSeq`, którego nie ma w typie);
  - 18 pól `Settings`;
  - 15 typów zagnieżdżonych: Exercise, Band, Template, TemplateItem, TemplateAlt, TRow, Workout, WExercise, WSet, Morning, Location, LocEquip, SavedPlan, weekPlan, TimerState.
- **Dla każdego pola sprawdziłem**: kto je zapisuje, jak `migrate` (`lib/store.ts:216-348`) je czyści (biała lista, przepuszczenie albo przycięcie) i czy nieznane pola z nowszej wersji przetrwają.
- **Testy robocze** (w worktree, nic nie commitowałem):
  - `tests/zz-audit-dat-roundtrip.test.ts` — bogaty stan z wszystkimi polami opcjonalnymi z 08.10, budowany przez API aplikacji: eksport → import, restart, 2× migrate, zrzut do pliku;
  - `tests/zz-audit-dat-fuzz.test.ts` — 3000 przypadków fast-check na polach z 08.10 (plan, zapisane plany, zmiany dni, deload, przewodnik, pauzy, foldery i archiwum, effortScale, planReminder, śmieci `fc.anything`);
  - `tests/zz-audit-dat-compat.test.ts` — zgodność z buildem 1004;
  - `tests/zz-audit-dat-tz.test.ts` — uruchomiony w 4 strefach: Warsaw, Los_Angeles, Auckland, Kolkata;
  - `tests/zz-audit-dat-probes.test.ts` — sondy P1–P10.
- **Zgodność wersji, dwukierunkowo**: wyeksportowałem f435c8c (build 1004) do `scratchpad/dat/old`. Bogaty stan wygenerowałem API starej wersji, wczytałem go nową wersją, a dane nowej wersji wczytałem buildem 1004 — zarówno ze startu z bazy, jak i z pliku kopii.
- **Istniejące testy** (`matrix-migrations`: drabina 1..17 i prawdziwe zapisy; `migrate-idem`): 20/20 przechodzi na d2a1e85.
- **Przegląd kodu**:
  - trwałość: `init`, `persistRun`, kolejka zapisów, klucze state/live/recovery/state_corrupt, `flush` przy wyjściu do tła w `app/_layout.tsx:33`;
  - eksport i import: `lib/backup.ts`, `app/more/backup.tsx`;
  - Zdrowie: `lib/health.ts`;
  - edycja historii: `lib/edit.ts`;
  - plan: `lib/plan.ts`, generator;
  - 14 akcji niszczących w UI;
  - wszystkie zapisy pól stanu w `app/` i `components/` — każdy woła `save()` albo `touchDraft()`.

## Znaleziska

### DAT-01 — Plan tygodnia nie ma daty obowiązywania: minione dni są liczone wg bieżącego planu
- **Waga:** WYSOKA
- **Dowód (POTWIERDZONE, `zz-audit-dat-probes` P3/P4/P5):**
  - P4: plan ustawiony pierwszy raz 8.10 (poniedziałek = szablon). `dayStatus` zwraca `missed` dla 2025-01-06, 2026-06-01 i 2026-10-05, czyli także dla dni sprzed powstania planu i sprzed instalacji.
  - P5: „Ustaw jako aktywny” na planie z wolnym poniedziałkiem zmienia status 28.09 z `missed` na `rest`, a wtorek 29.09 staje się `missed`.
  - P3: dzień ręcznie ustawiony jako „Wolne” 3.08 po dowolnej zmianie planu 8.10 przechodzi z `rest` na `missed`, bo `tidy()` kasuje zmiany dni starsze niż 60 dni.
  - Kod: `lib/plan.ts:33-36` (`plannedOn` = bieżący `weekPlan`), `:112-117`, `:108`, `:71`; widok: `components/HistoryCalendar.tsx:38` (`missed = plan && key < today`, bez dolnej granicy) i `components/TodayPlan.tsx:23`.
- **Skutek:** zaraz po ustawieniu pierwszego planu Kalendarz pokazuje każdy wcześniejszy poniedziałek, aż do najstarszego miesiąca, jako „opuszczony: X”. To samo czyta VoiceOver. Zmiana aktywnego planu przepisuje przeszłość kalendarza.
- **Propozycja — decyzja właściciela:**
  - **A:** `weekPlan.since` (data ustawienia lub aktywacji, pole opcjonalne bez podbicia schematu). Przed `since` nie ma planu; dane bez pola dostają `since` = dzień migracji. Mała zmiana, ale przeszłość po zmianie planu nadal nie pokazuje starego planu.
  - **B:** historia odcinków `[{from, days}]` dopisywana przy `setWeekDay` i `activatePlan`; dzień liczony wg odcinka, który go obejmuje. Wierna przeszłość, ale więcej kodu i danych.
  - **C:** nie pokazywać „opuszczony” dla przeszłości wcale (tylko „zrobione”). Najprościej, ale traci się informację.
  - **Rekomendacja:** A, plus `tidy` bez kasowania dni ≥ `since`.
- **Test regresji:** nowy plan → miniony poniedziałek ma status `rest`; `activatePlan` nie zmienia statusu dni sprzed aktywacji; zmiana dnia sprzed 70 dni przetrwa `setWeekDay`.

### DAT-02 — Generator „Ustaw jako aktywny” bez ostrzeżenia kasuje przyszłe zmiany dni, a obietnica „wrócisz jednym przyciskiem” nie przywraca ich
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE, P9):**
  - Zmiany `{14.10: szablon B, 19.10: wolne}`, potem `saveGenerated(…, true)` i ponowna aktywacja starego planu → `planOverrides` jest `undefined`. 14.10 wraca do „wolne”, a 19.10 do szablonu A.
  - `app/generator.tsx:25-28`: komunikat „Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.” nie liczy zmian dni (`futureChanges`).
  - Ekran `app/plan.tsx:24-25` liczy je i ostrzega.
  - `lib/generator.ts:114` → `lib/plan.ts:71` kasuje. To niezgodne z docs/24 sekcja 1 („komunikat mówi to przed potwierdzeniem”).
- **Propozycja:**
  - **A:** ten sam dopisek z liczbą zmian co w `app/plan.tsx`.
  - **B:** przy dezaktywacji zapisywać zmiany dni w `SavedPlan.overrides` i przywracać je przy ponownej aktywacji — wtedy obietnica „jednym przyciskiem” jest prawdziwa.
  - **Rekomendacja:** A teraz, B jako decyzja właściciela.
- **Test regresji:** generator-ui — przy przyszłej zmianie dnia okno pokazuje jej liczbę (wariant A) albo zmiany dni po powrocie są równe tym sprzed zmiany (wariant B).

### DAT-03 — Limit 50 zapisanych planów tylko w `migrate`: 51. (najnowszy) plan cicho znika po restarcie
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE, P1):** 51× „Zapisz kopię jako nowy plan”, restart → 51 → 50 planów, brakuje „Kopia 51”.
  - `lib/store.ts:338` (`slice(0, 50)` zostawia najstarsze);
  - `lib/plan.ts:62,76` i `app/plan.tsx:42` nie mają limitu; generator też dopisuje plany.
- **Propozycja:**
  - **A:** limit w UI, spójny z `migrate` (przycisk nieaktywny przy 50, komunikat w generatorze).
  - **B:** podnieść limit w `migrate` albo zostawiać najnowsze.
  - **Rekomendacja:** A.
- **Test regresji:** 51. kopia niemożliwa w UI albo restart zachowuje wszystkie plany.

### DAT-04 — Nieudany zapis do Apple Health jest cichy i nigdy nie jest ponawiany
- **Waga:** ŚREDNIA
- **Dowód (Z KODU):**
  - `lib/health.ts:51,56` zwraca `'failed'`;
  - `lib/health.ts:59` i `lib/backup.ts:84` ignorują wynik;
  - `saveWorkout` nie ma innego wywołującego (grep). Treningów z `healthUUID === null` nic nie przegląda, ustawienia nie pokazują błędu.
  - Zabicie aplikacji między „Zakończ” a zapisem do Zdrowia też kończy się brakiem treningu w Zdrowiu.
- **Propozycja:**
  - **A:** przy starcie i powrocie z tła ponawiać zakończone treningi bez `healthUUID` od chwili włączenia synchronizacji. Potrzebne pole `healthSince`, żeby nie dosyłać starej historii; `HKMetadataKeySyncIdentifier = w.id` jest już ustawiony (`lib/health.ts:49`, komentarz T4b o odrzucaniu duplikatów).
  - **B:** licznik „N treningów nie trafiło do Zdrowia — ponów” w Ustawieniach.
  - **Rekomendacja:** A z prostym B.
- **Test regresji:** pierwszy `saveWorkoutSample` rzuca błąd → po powrocie na pierwszy plan `healthUUID` jest ustawione i nie ma drugiego zapisu.

### DAT-05 — Dane nowszej wersji w starszym buildzie: brak bariery, schemat zapisywany w dół, ustawienia spoza białej listy giną
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE):**
  - Build 1004 (f435c8c) uruchomiony na danych d2a1e85 i przy imporcie pliku d2a1e85: kopia przyjęta bez ostrzeżenia (oba mają schemat 17, bo pola z 08.10 dodano bez podbicia). Różnice to dokładnie `settings.effortScale: "rir" → undefined` i `settings.planReminder: false → undefined`. Reszta (pauzy, foldery, archiwum, plany, zmiany dni, deload) przetrwała.
  - P10 w nowej wersji: baza ze schematem 18 i polem `settings.newIn18` → start bez komunikatu, w bazie zapisuje się schemat 17, pole znika.
  - P7: nieznane pole w `settings` znika, a na najwyższym poziomie i w treningu zostaje.
  - Przyczyna: `lib/store.ts:313-327` (biała lista ustawień), `:101` i `:346` (brak bariery, schemat w dół). Podobne białe listy: TRow `:907`, TemplateAlt `:211`, LocEquip `:188`, SavedPlan i weekPlan `:332-337`.
  - TestFlight pozwala zainstalować starszy build. testflight.apple.com: „Tap either the Versions tab or Build Groups tab, then tap and install the build you want to test. The build you choose will replace what's currently installed.” Czy dane aplikacji zostają, ta strona nie mówi — docs/14 pkt 2.4 oznacza to jako NIEZWERYFIKOWANE.
  - docs/14 pkt 2.4 („nowe pola przetrwają”) nie obejmuje ustawień.
- **Skutek:** po powrocie do starszego buildu i z powrotem skala RIR wraca na RPE, a wyłączone przypomnienia o planie włączają się znowu. Przy przyszłym podbiciu schematu jednorazowe migracje kluczowane numerem schematu mogłyby się wykonać drugi raz.
- **Propozycja:**
  - **A:** `migrate` zachowuje nieznane klucze ustawień (bez `__proto__`, `constructor`, `prototype`) i nie obniża `schemaVersion`.
  - **B:** `init` przy schemacie wyższym niż obsługiwany pokazuje ekran „Dane z nowszej wersji — zaktualizuj” z eksportem surowego zapisu i niczego nie zapisuje.
  - **Rekomendacja:** A + B. Builda 1004 to nie naprawi — warto uprzedzić testerów, żeby nie instalowali starszych buildów i nie importowali nowszych kopii.
- **Test regresji:** jak P7 i P10 — nieznane ustawienie przetrwa restart; baza ze schematem 18 nie zostaje nadpisana.

### DAT-06 — `migrate` nie jest idempotentne dla nazw planów; obcięcie może przeciąć emoji
- **Waga:** NISKA
- **Dowód (POTWIERDZONE):**
  - Fuzz: 40 na 3000 przypadków nieidempotentnych. Wszystkie dotyczą `weekPlan.name` albo `savedPlans[].name` z obcięciem na spacji; poza tym brak wyjątków i innych niezgodności.
  - P2, przez UI: nazwa planu z 40 znaków, potem `saveCopyAs(t('Kopia: {name}'))` zapisuje `"Kopia: AAA… "` ze spacją na końcu, a po restarcie nazwa jest inna.
  - P2b: `setPlanName('A'×39+'💪')` zostawia samotny surogat `\ud83d`.
  - Kod: `lib/store.ts:333,337` i `lib/plan.ts:55` robią `trim().slice(0,40)`; dla porównania `cleanFolder` robi slice, a potem trim.
  - Narusza docs/20 rodzaj 6 („migrate idempotentne”). `tests/migrate-idem.test.ts` nie obejmuje pól z 08.10.
- **Propozycja:** w obu miejscach `clampName(n.replace(/\s+/g,' ').trim(), 40)`.
- **Test regresji:** rozszerzyć generator w `migrate-idem` o weekPlan, savedPlans, planOverrides, deloadWeeks, guideSeen, whatsNewSeen, pauses, pausedAt, folder, archived, effortScale i planReminder.

### DAT-07 — Dzień i tydzień treningu zależą od bieżącej strefy telefonu; zapisane klucze dat — nie
- **Waga:** NISKA
- **Dowód (POTWIERDZONE, `zz-audit-dat-tz`):** trening w niedzielę 11.10 o 23:30 czasu polskiego:
  - w Warszawie: dzień 2026-10-11, tydzień od 2026-10-05;
  - w Auckland i Kolkacie: dzień 2026-10-12, tydzień od 2026-10-12. Niedziela 11.10 dostaje status „missed”, poniedziałek 12.10 „done”, a tydzień deload oznaczony w Polsce (`2026-10-05`) przestaje obejmować ten trening;
  - zmiana czasu jest obsłużona poprawnie: 25.10 01:30 CEST → 2026-10-25.
  - Kod: `lib/plan.ts:22`, `lib/store.ts:1284`.
- **Propozycja:**
  - **A:** zostawić i opisać w docs (rzadki przypadek).
  - **B:** opcjonalne pole `Workout.tzOffsetMin` zapisywane przy starcie; klucze dnia i tygodnia liczone z tego przesunięcia.
  - **Rekomendacja:** A, chyba że właściciel często podróżuje.
- **Test regresji (dla B):** trening zapisany w Warszawie i czytany w Auckland ma dzień 2026-10-11.

### DAT-08 — Import z powtórzonym id: miejsce i zapisany plan znikają w całości, inaczej niż reszta encji
- **Waga:** NISKA
- **Dowód (POTWIERDZONE, P6):**
  - Dwa miejsca o tym samym id → zostaje tylko „Siłownia”; „Dom” znika razem ze sprzętem i ciężarami.
  - Dwa zapisane plany o id `p` → zostaje tylko pierwszy.
  - Powtórzone ćwiczenie w tym samym pliku dostaje id `~2` — tak działa decyzja z 06.10 (wariant A, „nic nie ginie”).
  - Kod: `lib/store.ts:183` (`seen` → `continue`), `:336`.
- **Propozycja:** dla miejsc i zapisanych planów ta sama reguła `~n` co w `uniqueIds`.
- **Test regresji:** dwa miejsca, drugie z id `<id>~2`, `mainLocationId` bez zmian.

### DAT-09 — Usunięcie sesji z historii nie mówi, że kopia w Apple Health zostaje
- **Waga:** NISKA
- **Dowód (Z KODU):** `app/(tabs)/history.tsx:36` — „Usunąć tę sesję z historii?” bez wzmianki o Zdrowiu. Edytor przy `healthUUID` mówi „Zmiany nie trafiają do Apple Health.” (`app/history/edit/[id].tsx:67`), a `deleteWorkout` (`lib/store.ts:1316`) nie dotyka Zdrowia.
- **Propozycja:** dopisek w oknie potwierdzenia, gdy sesja ma `healthUUID`.
- **Test regresji:** okno usuwania sesji z `healthUUID` zawiera ten tekst.

## Sprawdzone i w porządku

- **Bogaty stan** (wszystkie pola opcjonalne, w tym pauzy, pauza w toku, „Pomiń dziś”, podział po zamianie, foldery, archiwum, plany, zmiany dni, deload, RIR, planReminder, miejsca, wiersze serii, zamienniki): eksport → import, restart i 2× migrate dają 0 różnic.
- **Build 1004 → d2a1e85:** 0 różnic przy starcie z bazy i przy imporcie pliku. Dane 08.10 przeszły przez 1004 bez zapisu i wróciły do d2a1e85 z 0 różnic.
- **`migrate`** nie rzucił wyjątku w 3000 przypadkach fuzzu. Istniejące testy migracji: 20/20.
- **Trwałość:**
  - zapisy idą po kolei;
  - stan i trening w toku mają osobne klucze z numerem zapisu;
  - pierwszy zapis po starcie jest zawsze pełny (`fullDirty = true`), więc losowe id ćwiczeń z katalogu trafiają na dysk, zanim coś się do nich odwoła;
  - zapisane id są stabilne; uwagi w testach o „losowych id” dotyczą tylko ćwiczeń dopisywanych przez migrację i szablonów demo w testach;
  - nieczytelny zapis jest odkładany, nie nadpisywany;
  - zapis wymuszany przy wyjściu do tła;
  - jeden zapisujący (widżet nie ma wspólnego magazynu).
- **Import:** zastępuje dane i UI to mówi; kopia bezpieczeństwa obejmuje trening w toku i nieczytelny zapis; plik z wyższym schematem jest odrzucany z komunikatem; zatrucie prototypu jest pokryte istniejącym fuzzem.
- **Zdrowie:** start = start + suma pauz, koniec prawdziwy — zgodnie z decyzją z docs/18 (08.10).
- **Zmiana czasu:** klucze dat liczone arytmetyką kalendarzową; edytor odrzuca nieistniejące godziny.
- **Akcje niszczące:** wszystkie 14 w UI mają potwierdzenie; import i czyszczenie danych robią kopię bezpieczeństwa.

Pliki robocze: `<worktree audytora, poza repo>/tests/zz-audit-dat-{roundtrip,fuzz,compat,tz,probes}.test.ts`. Kopia buildu 1004 i zrzuty danych: `<scratchpad sesji audytu, poza repo>/dat/{old,out}`.

