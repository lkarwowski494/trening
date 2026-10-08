# Audyt 0.10.0 — spójność między funkcjami (X)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

Wszystko sprawdzone na d2a1e85. Na początku drzewo robocze stało na f435c8c, ale koordynator to przełączył, a `diff -rq lib` potwierdził, że przeczytany kod to dokładnie d2a1e85.

**Przeczytany kod:** `lib/plan.ts`, `dashboard.ts`, `period.ts`, `planReminder.ts`, `generator.ts`, `deload*.ts`, `start.ts`, `guide.ts`, `whatsnew.ts`, `musclemap.ts`, `stats.ts`, `calendar.ts`, `locations.ts`, `backup.ts` (fragmenty), `edit.ts` (zapis szkicu) oraz `store.ts` (migracja planu, start/zakończenie, pauzy, usuwanie, foldery).
**Przeczytane ekrany:** TodayPlan, DayPanel, Dashboard, PeriodSummary, HistoryCalendar, DeloadHint, WhatsNew, PlanReminderSync, `plan.tsx`, `generator.tsx`, `guide.tsx`, index, history, templates, `template/[id]`, progress, settings.

**Macierz ENCJA × OPERACJA × ZALEŻNE:**
- 19 encji: ćwiczenie biblioteczne i własne, szablon, folder/archiwum, „Wygenerowane”, aktywny plan, zapisane plany, zmiany dni, „Pomiń dziś”, miejsce, sprzęt, gumy, trening w toku, historia, rodzaje serii i RPE/RIR, ustawienia, deload, pauzy, przypomnienia, „Co nowego” i przewodnik.
- 14 operacji, około 95 sprawdzonych komórek.

**Te same wielkości w różnych miejscach:**
- serie w tygodniu — 6 miejsc, plus 3 miejsca z seriami na partię;
- czas trwania z pauzami — 9 miejsc;
- liczba treningów w tygodniu — 3 miejsca;
- statusy dni (zrobione / zaplanowane / opuszczone) — 4 widoki;
- liczba rekordów — 5 miejsc.

**Testy robocze:** 24 scenariusze, wszystkie uruchomione przez jslot. Pliki w drzewie robocznym, nie do commitu:
- `tests/zz-audit-x-plan.test.ts` (X1–X9)
- `tests/zz-audit-x-ui.test.tsx` (U1–U5)
- `tests/zz-audit-x-qty.test.ts` (Q1–Q7)
- `tests/zz-audit-x-misc.test.ts` (M1–M3)

## Znaleziska

### X-01 — Panel dnia w Kalendarzu nie wie, że trening już zrobiono (ani że trwa)
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (U1, U2).
  - Kod: `components/DayPanel.tsx:24,42–49`. Tekst i przyciski zależą tylko od `plannedOn` i `past`, a nie od `dayStatus` ani `getState().active`.
  - U1: plan pon. = Upper A, trening w pon. zrobiony. Komórka kalendarza ma etykietę „5 października 2026, 1 sesja”, a panel pokazuje „Opuszczony: Upper A” z przyciskami „Przenieś na dziś” i „Propozycje”.
  - U2: dziś zrobione. Karta „Dziś” mówi „Dziś: Upper A · zrobione” i nie ma Startu. Panel dnia mówi „Zaplanowany: Upper A” i ma „Start”, „Przesuń plan o 1 dzień” oraz „Przesuń tylko ten trening”.
  - Z kodu: przy treningu w toku Start jest ukryty, ale przesuwanie zostaje.
- **Skutek:** sprzeczne komunikaty. „Przenieś na dziś”, przesunięcie albo propozycja dla zrobionego treningu planuje go drugi raz.
- **Naprawa:** panel bierze status z `dayStatus` (jak kalendarz i pasek tygodnia). Dla „zrobione” pokazuje „Zrobione: …”, link do sesji i bez akcji przesuwania. Dzień z treningiem w toku — bez przesuwania.
- **Test regresji:** U1 i U2 jako asercje, w panelu, pasku tygodnia i komórce kalendarza ten sam status.

### X-02 — Plan nie ma historii: plan i jego zmiany działają wstecz
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (X3, X4, M3).
  - Kod: `lib/plan.ts:33` — `plannedOn` dla każdej daty, także przeszłej, bierze bieżący `weekPlan`. `lib/plan.ts:112` — `dayStatus` daje „missed” każdemu wcześniejszemu dniowi.
  - X3: plan ustawiony w czwartek, a pon. i śr. tego tygodnia są „missed”. Kafelek pokazuje „0 / 2”. `dayStatus('2025-10-06')` i `dayStatus('2020-01-06')` też dają „missed”, czyli szare kropki na wszystkich dawnych miesiącach.
  - X4: aktywacja innego planu w środę przepisuje przeszłość. Przed: `06:rest, 07:missed:A`. Po: `06:missed:B, 07:rest`.
  - M3: jawne „wolne” sprzed ponad 60 dni znika przy dowolnej zmianie planu (`tidy`, `plan.ts:108`), a dzień wraca jako „missed”.
  - Istniejący test `tests/dashboard.test.tsx` („pasek tygodnia”) utrwala opuszczony poniedziałek przy planie ustawionym w czwartek.
- **Skutek:** każdy nowy plan „oskarża” o opuszczenie treningów sprzed swojego istnienia. Zmiana planu zmienia historię i licznik „zrobione / zaplanowane”.
- **Opcje dla właściciela:**
  - **A.** Historia planów: odcinki `{od, dni}` przy `setWeekDay` i `activatePlan`; dzień liczony wg planu, który wtedy obowiązywał; bez kasowania przeszłych zmian dni. Pełna zgodność, ale zmiana schematu.
  - **B.** Jedna data `weekPlan.since` (ostatnia zmiana planu); dni przed nią bez statusu „opuszczony”. Tanie i bez fałszywych „opuszczonych”, ale po edycji planu wcześniejsze opuszczenia znikają.
  - **C.** Bez zmian.
  - **Rekomendacja: B.**
- **Test regresji:** X3, X4 i M3 jako asercje (dzień sprzed planu ≠ „missed”).

### X-03 — Zmiana nazwy ćwiczenia z biblioteki zmienia obliczenia wstecz i generator
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (M2).
  - Kod: `lib/store.ts:504` — `blockMult` sprawdza `own(CABLES, ex.name)`. `lib/generator.ts:69` — `LIB_BASE_NAMES.has(e.name)`. Nazwę biblioteki można edytować (`app/exercise/[id].tsx:21`).
  - „Cable Fly” na stacji (`impl: 'electric'`), 20 kg × 10: po zmianie nazwy objętość treningu spada z 400 na 200. Rekord sumy 400 → 200, objętość tygodnia 400 → 200.
  - Po zmianie nazwy „Back Squat” na „Przysiad” generator bierze na pierwsze miejsce Front Squat zamiast Back Squat.
  - To samo dotyczy `libExtraRevOf` w `lib/swap.ts:73` i odświeżania katalogu w `migrate`.
- **Skutek:** błędna objętość i rekordy historycznych sesji na stacji (decyzja Q-024 „×2 dla dwóch linek”) po samej zmianie nazwy.
- **Naprawa (techniczna):** trwały klucz katalogu (np. `libKey` = nazwa kanoniczna) zapisany przy tworzeniu i migracji. Wszystkie reguły po kluczu, nazwa tylko do wyświetlania. Alternatywa produktowa: blokada zmiany nazwy biblioteki i pole „nazwa własna”. **Rekomendacja:** klucz.
- **Test regresji:** M2 — po zmianie nazwy objętość, rekord i wynik generatora bez zmian.

### X-04 — „Zrobione” = dowolna sesja tego dnia, nie zaplanowany trening
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (M1).
  - Kod: `lib/plan.ts:112`.
  - Plan na czwartek: Upper A; zrobiony „Legs — dom”. `dayStatus` = done z templateId Upper A, karta „Dziś: Upper A · zrobione”, kafelek „1 / 1”, brak przypomnienia.
  - Lista szablonów nie pokazuje przy Upper A „ostatnio …”, bo liczy po `templateId`.
  - Licznik w kafelku liczy sesje, a nie zaplanowane dni, więc możliwe jest np. „2 / 3” przy jednym zrobionym dniu z planu.
- **Skutek:** zaplanowany trening po cichu „zaliczony” i znika z planowania.
- **Opcje:**
  - **A.** „Zrobione” tylko dla sesji z tego szablonu, a inny trening oznaczony osobno.
  - **B.** Zostaje „dzień z treningiem = zrobione”, ale karta, pasek i panel pokazują nazwę faktycznie zrobionej sesji, a panel proponuje przeniesienie niezrobionego treningu z planu.
  - **C.** Bez zmian.
  - **Rekomendacja: B** (najmniej zmian, prawdziwa etykieta).

### X-05 — `hasPlan()` jest prawdą bez żadnego planu (zostały zmiany dni)
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (X2, U5).
  - Kod: `lib/plan.ts:30` — wystarczy dowolny klucz w `planOverrides`, także `null` albo martwe id.
  - Scenariusz: „Wolne w tym dniu”, potem wyczyszczenie planu. Stan: `weekPlan` undefined, zmiany `{"2026-10-09":null}`, `hasPlan` = true.
  - Na ekranie: „Dziś wolne” zamiast „Bez planu tygodnia”, kafelek „1 / 0”, ukryta podpowiedź „Ustaw plan tygodnia…”, „Pierwsze kroki” ma odhaczony krok 2.
  - X2b: to samo po usunięciu szablonów planu.
  - `futureChanges` liczy takie puste zmiany w oknie aktywacji.
- **Naprawa:** `hasPlan` = żywy szablon w `weekPlan` albo w zmianie dnia od dziś. `setWeekDay` i usuwanie szablonu sprzątają zmiany równe nowej bazie lub z martwym id.
- **Test regresji:** X2 i U5.

### X-06 — Usunięcie lub archiwizacja szablonu z planu: po cichu, z martwymi odwołaniami
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (X1, Q5) i Z KODU.
  - Kod: `lib/store.ts:1493` (`deleteTemplate` tylko filtruje listę), `app/(tabs)/templates.tsx:14` (komunikat z samą nazwą), `app/template/[id].tsx:57` (Archiwizuj bez potwierdzenia).
  - X1: po usunięciu A jego id zostaje w `weekPlan.days`, `savedPlans` i `planOverrides`, a dni stają się wolne.
  - Q5: aktywacja zapisanego planu z usuniętym szablonem daje aktywny plan z martwym id.
  - Z kodu: `setDay` porównuje z `baseOn`, które dla zarchiwizowanej bazy daje null. Jawne „wolne” jest wtedy usuwane, a po przywróceniu szablonu dzień wraca do treningu.
- **Skutek:** plan, przypomnienia i zapisane plany tracą dni bez ostrzeżenia.
- **Opcje:**
  - **A.** Potwierdzenie z listą użycia („jest w planie: pon., czw.; dni staną się wolne”) dla usuwania i archiwizacji, plus sprzątanie martwych id.
  - **B.** Blokada usunięcia szablonu będącego w planie.
  - **C.** Plan pokazuje „(usunięty szablon)”.
  - **Rekomendacja: A.**

### X-07 — Generator „Ustaw jako aktywny” kasuje zmiany dni od dziś bez komunikatu
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (Q3).
  - Kod: `app/generator.tsx:25`.
  - Dwie przyszłe zmiany (`futureChanges` = 2) po `saveGenerated(..., true)` znikają (`planOverrides` undefined).
  - Ekran planu ostrzega (`app/plan.tsx`, `activate`), a docs/24 §1 mówi „komunikat mówi to przed potwierdzeniem”.
  - Oba okna obiecują „Obecny plan zostanie zapisany w »Inne plany«”, a pusty plan bez nazwy nie jest zapisywany (`lib/plan.ts:69`).
- **Naprawa:** ten sam tekst co na ekranie planu (liczba zmian), a obietnica zapisu tylko przy niepustym planie.
- **Test regresji:** okno generatora zawiera liczbę zmian.

### X-08 — Liczba rekordów tego samego treningu różni się między ekranami
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (X8).
  - Kod: `lib/dashboard.ts:27` (`workoutPRs(w).length`, czyli wpisy) wobec `components/ActiveWorkout.tsx:92` (`nPR` = suma `details`).
  - Seria 120 × 5 po 100 × 5 daje dwa rekordy („objętość treningu: 600 kg”, „e1RM 140 kg”).
  - „Ostatni trening” pokazuje „1 rekord”, okno po zakończeniu „Nowe rekordy: 2”.
- **Opcje:**
  - **A.** Kafelek liczy jak okno po zakończeniu (decyzja T13: „liczba rekordów, nie serii”).
  - **B.** Okno liczy wpisy.
  - **Rekomendacja: A**, przy okazji zaktualizować asercję w `tests/dashboard.test.tsx`.

### X-09 — „Przenieś na dziś” + „Zamień miejscami” wysyła dzisiejszy trening w przeszłość
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (U4).
  - Kod: `components/DayPanel.tsx:31–36`, `lib/plan.ts:105`.
  - Po zamianie poniedziałek (przeszły) dostaje dzisiejszy B ze statusem „missed”, czyli dzisiejszy trening przepada.
  - `suggest()` celowo nie proponuje zamiany dla dni przeszłych (`lib/plan.ts:183`); dla tego samego dnia daje tylko move/shift/skip.
- **Naprawa:** dla dnia z przeszłości przy konflikcie zamiast „Zamień miejscami” zaproponować „Przesuń plan od dziś” albo „Propozycje”.
- **Uwaga:** istniejący test w `tests/plan-calendar-ui.test.tsx` utrwala obecne zachowanie.

### X-10 — Pusty szablon w planie: Start z karty „Dziś” i panelu dnia daje pusty trening
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (X7, U3).
  - Kod: `components/TodayPlan.tsx:31`, `DayPanel.tsx:44` — bez sprawdzenia `items.length`. Lista na ekranie głównym chowa Start dla pustych szablonów (`app/(tabs)/index.tsx:56`).
  - Pusty szablon powstaje po usunięciu jego ćwiczeń albo gdy szablon zaplanowano przed dodaniem ćwiczeń.
  - Karta „Dziś” ma przycisk „Start zaplanowanego treningu: Upper A”, lista szablonów go nie ma; Start tworzy trening „Upper A” z 0 ćwiczeń.
  - Przypomnienie „Dziś: …” też jest planowane.
- **Naprawa:** jak na liście — bez Startu i z tekstem „Szablon jest pusty — dodaj ćwiczenia”; bez przypomnienia.
- **Test regresji:** U3.

### X-11 — Przypomnienie z planu nigdy nie prosi o zgodę na powiadomienia
- **Waga:** ŚREDNIA
- **Dowód:** Z KODU.
  - `ensurePermission` jest wołane tylko przy wejściu w trening (`ActiveWorkout.tsx:40`), przy włączaniu przełącznika (domyślnie włączony, więc nikt go nie włącza) i przy przycisku „Sprawdź zgodę” (`settings.tsx:43–44`).
  - Ustawienie planu (`plan.ts`, `PlanReminderSync`) zgody nie prosi.
  - „Pierwsze kroki” (krok 2) i karta „Dziś” obiecują przypomnienie zaraz po ustawieniu planu.
  - iOS bez zgody nie pokazuje powiadomień — tego nie da się sprawdzić na Linuksie; do potwierdzenia na telefonie.
- **Opcje:**
  - **A.** Prośba o zgodę przy pierwszym dniu w planie.
  - **B.** Tylko przycisk „Włącz powiadomienia” na ekranie planu.
  - **Rekomendacja: A.**

### X-12 — Klucz synchronizacji przypomnień nie zależy od języka
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (X5).
  - Kod: `lib/planReminder.ts:30–34`.
  - Po zmianie języka klucz jest identyczny, więc zaplanowane „Dziś: Upper A” zostaje po polsku do pierwszego otwarcia aplikacji następnego dnia.
- **Naprawa:** dodać `settings.language` do klucza.
- **Test regresji:** X5.

### X-13 — Okno deload liczy „serie robocze” bez drop setów, reszta aplikacji z nimi
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (X9).
  - Kod: `lib/start.ts:8` wobec `store.ts:877` i `isWorking`.
  - Upper A z jednym drop setem: lista pokazuje „30 serii”, okno „18 zamiast 29 serii roboczych”, a kafelki i Postępy liczą drop sety jako robocze.
- **Naprawa:** w oknie dopisać „(bez rozgrzewek i drop setów)” albo liczyć jednolicie. Logika cięcia bez zmian.

### X-14 — Generator tworzy plany o identycznych nazwach; zapisanych planów nie da się przemianować
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (Q4).
  - Dwa razy „Masa, 3× w tygodniu”; szablony dostają „(2)”, plany nie.
  - `renamePlan` nie jest używane w interfejsie, a docs/24 §1 wymienia „zmianę nazwy”.
- **Naprawa:** unikalne nazwy w `addPlan` i zmiana nazwy w „Inne plany”.

### X-15 — Ćwiczenie spoza biblioteki (z importu): różne liczby serii w różnych miejscach
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (Q1).
  - Ten sam trening: kafelek, podsumowanie, wykres w Postępach i „Ostatni trening” pokazują 4 serie.
  - Lista Historii (`history.tsx:36`) i zapis do Zdrowia (`health.ts`, pole `Sets`) pokazują 5, bo nie pomijają bloku bez ćwiczenia.
- **Naprawa:** jeden pomocnik `workingSets(w)` wszędzie.

### X-16 — „Powtórz ostatni” w tygodniu deload nie pyta o mniej serii
- **Waga:** NISKA
- **Dowód:** Z KODU. `store.ts:928` (`repeatLast`) omija `lib/start.ts`; pozostałe 4 drogi startu pytają.
- **Opcje:**
  - **A.** Pytać też tutaj.
  - **B.** Zostawić, bo to powtórzenie, a nie start z szablonu, i opisać.
  - **Rekomendacja: A.**

## Sprawdzone i w porządku
- **Czas z pauzami:** jedna funkcja `workoutDurSec` w liście i szczegółach Historii, treningu w toku, podsumowaniu, kafelku, „Ostatnim treningu”, CSV i edytorze. Zdrowie ma przesunięty start, zgodnie z decyzją z 08.10. Edycja daty przesuwa pauzy.
- **Serie na partię:** mapa mięśni = „Serie per partia” = znacznik ≥10 (`setsByMuscle`). Generator liczy tak samo (główna 1, pomocnicza 0,5).
- **Treningi w tygodniu:** kafelek, podsumowanie i Postępy liczą to samo (start w [pon, następny pon)).
- **Zmiana jednostki:** cache statystyk ma jednostkę w kluczu.
- **Przypomnienia:** odświeżają się po zmianie nazwy, usunięciu lub archiwizacji szablonu, zmianie planu i dni, aktywacji, treningu dziś i wyłączeniu przełącznika.
- **Start treningu:** nie nadpisuje treningu w toku — karta „Dziś” tylko bez treningu, panel dnia i edytor szablonu mają blokadę.
- **Pytanie deload:** wspólne dla wszystkich startów z szablonu.
- **Usunięcie ćwiczenia:** sprząta pozycje i zamienniki szablonów; historia, rekordy, Postępy i mapa korzystają z ćwiczenia w archiwum.
- **Miejsca i gumy:** usunięcie miejsca lub gumy zgodne z decyzjami („(usunięte miejsce)”, gumy wycinane z nieodhaczonych serii treningu w toku).
- **Archiwum szablonów:** pomijane wszędzie (lista, plan, wybór w panelu, `plannedOn`).
- **Generator:** unikalne nazwy szablonów (także wobec archiwum); pary „dzień po dniu” zgodne z ostrzeżeniami planu.
- **Edycja i usuwanie historii:** przeliczają rekordy, kafelki, „Ostatni trening”, statusy dni i serię tygodni deload.
- **RPE/RIR:** zapis w RPE, wyświetlanie w wybranej skali; CSV ma kolumnę „RPE” z RPE.
- **Przewodnik i „Co nowego”:** ścieżki „Pokaż” istnieją i nie wymagają stanu; jedyny link w „Co nowego” prowadzi do przewodnika.
- **Apple Health:** brak aktualizacji przy edycji historii to udokumentowana decyzja (docs/12).
- **Odrzucone:** wyścig synchronizacji przypomnień nie dał się odtworzyć atrapą, więc nie jest zgłaszany.

