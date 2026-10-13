# 22. Przepływy użytkownika i nawigacja — audyt UX (11.10.2026)

Wynik zadania z `docs/prompty/audyt-ux-przeplywy.md` (punkt 8 listy właściciela). **To propozycja do decyzji właściciela — bez zmian w kodzie.**
Stan kodu: gałąź `feature/e2-swap` (0.12.0, niewydana), 11.10.2026. Wszystko poniżej sprawdzone w plikach ekranów (ścieżki w nawiasach);
czego nie dało się potwierdzić w kodzie — oznaczone **[DO WYJAŚNIENIA]**. Liczby i reguły merytoryczne (np. jak estymować pozostałe treningi
tygodnia) — **[DO WYJAŚNIENIA — badacz]**, nie zgadywane.

Źródła: `app/**`, `components/**`, `lib/home.ts`, `lib/guide.ts`, `lib/start.ts`, scenariusze `.maestro/01–18`, `tests/scenario-*`, `docs/18`
(decyzje 11.10: pkt 4–7), `docs/21` (roadmapa, „Przed App Store”), `docs/18-archiwum-do-11.10.md` (układ B ekranu głównego, 09.10).

Liczenie stuknięć: od ekranu, na którym użytkownik jest (zwykle zakładka Trening po uruchomieniu), bez wpisywania liczb na klawiaturze
(„+ wpis”) i bez przewijania; gest przesunięcia liczy się jako 1; okno potwierdzenia jako 1.

---

## 0. Stan dziś w skrócie

- **5 zakładek** (`app/(tabs)/_layout.tsx`): Trening (`index.tsx`), Szablony (`templates.tsx`), Ćwiczenia (`exercises.tsx`), Kalendarz (`history.tsx`,
  trasa nadal `/history`), Więcej (`more.tsx`). Na zakładce Trening plakietka z resztą przerwy.
- **Stos nad zakładkami** (`app/_layout.tsx`): `picker` i `swap` (modalne), `template/[id]`, `plan`, `generator`, `guide`, `reorder`, `exercise/[id]`,
  `history/[id]`, `history/add`, `history/edit/[id]`, `more/{bands,progress,settings,bodymass,about,licenses,backup,language,locations,location/[id]}`.
- **Ekran główny (Trening) bez treningu w toku** (`app/(tabs)/index.tsx`, kolejność od góry): nagłówek z „i” (Co nowego) → banery danych → karta
  „Dziś” (`components/TodayPlan.tsx`: tytuł dnia, przycisk „Plan tygodnia”, pasek pon–nd, „Następne: …”, zachęta do planu) → duży przycisk startu
  i „Inny trening” (`components/StartPanel.tsx`) → karta Planowanie rozwinięta (tylko bez planu; `components/PlanningCard.tsx`) → „Pierwsze kroki”
  (tylko nowa osoba; `components/Dashboard.tsx`) → „Ten tydzień” (3 kafelki + stosy talerzy przy planie) → wiersz „Plan: nazwa · N dni · następny …
  Planowanie ›” (tylko przy planie) → nagłówek „Zacznij z szablonu” i lista szablonów z przyciskiem „Start” przy każdym.
- **Ekran główny w trakcie treningu**: cały ekran to `components/ActiveWorkout.tsx` (widok skupiony z kartą „teraz” albo lista — Ustawienia).

---

## 1. Krok 1 — przepływy użytkownika

Legenda częstości: **D** codziennie / w każdym treningu, **T** co tydzień, **R** rzadko, **1** raz. „NOWY” = wynika z decyzji właściciela
(docs/18, 11.10) albo z roadmapy, dziś brak w kodzie. Kolumna „Stuknięć” — dziś.

### (a) Trening na siłowni — liczy się minimum stuknięć i rozpraszaczy

| ID | Cel użytkownika | Częstość | Punkt wejścia dziś | Kroki dziś (stuknięć) | Ekrany po drodze | Gdzie się kończy | Stany i uwagi |
|---|---|---|---|---|---|---|---|
| A1 | Zacząć dzisiejszy trening z planu | D | Trening → duży przycisk „Start: X” (`StartPanel`, reguła `lib/home.ts mainStart`) | 1 (+1 w tygodniu deload: pytanie „Mniej serii / Pełny”) | Trening | ekran treningu (ta sama zakładka) | bez planu: „Start: następny szablon po ostatnim” (rotacja A→B→C); brak szablonów: „Pusty trening”; w toku: „Wróć do treningu”; pusty szablon — przycisk pomija go |
| A2 | Zacząć inny trening niż proponowany | D/T | „Inny trening” → arkusz: Inny z planu / Powtórz ostatni / Z szablonu / Pusty | 2; „Z szablonu” = 2 + zakładka Szablony + szablon + „Start” = **4** | Trening → (Szablony → Szablon) | ekran treningu | „Z szablonu” wyrzuca z arkusza do listy bez przycisków Start — trzeba wejść w podgląd |
| A3 | Zacząć konkretny szablon z listy na dole ekranu | D | lista „Zacznij z szablonu” → „Start” przy szablonie | 1 (po przewinięciu) | Trening | ekran treningu | **właściciel: lista znika (krok 3)** — po zmianie ten cel musi obsłużyć arkusz „Inny trening” |
| A4 | Zacząć z podglądu szablonu | T | Szablony → szablon → „Start” (`app/template/[id].tsx`, `goHome` zamyka stos) | 3 | Szablony → Szablon → Trening | ekran treningu | w toku innego treningu: przycisk „Trening w toku” → okno |
| A5 | Zacząć z dnia w Kalendarzu | R | Kalendarz → dzień dziś → „Start” (`components/DayPanel.tsx`) | 3 | Kalendarz → Trening | ekran treningu | tylko dzień dzisiejszy z zaplanowanym, niezrobionym szablonem |
| A6 | Zrobić serię (wartości z podpowiedzi „Poprzednio” / szablonu są wstawione) | D | widok skupiony: duży „Seria zrobiona”; lista: ✓ w wierszu | **1** | ekran treningu | przerwa startuje sama | VoiceOver: dwa przyciski o różnych etykietach; wąski ekran: układ zwarty |
| A7 | Zrobić serię z innymi wartościami | D | pole ciężaru → wpis → pole powtórzeń → wpis → ✓ (karta nie przyjmuje wpisu — „Wartości zmienisz w wierszu poniżej”) | **3 + wpis** (2 pola + ✓) | ekran treningu | przerwa | NOWY (decyzja 6, kaskada w dół): wartość z serii 1 przechodzi do kolejnych — od serii 2 zwykle wraca do 1 stuknięcia |
| A8 | Seria na czas (plank) | D | karta: „▶ Start” → koniec sam po celu albo „Zakończ serię” w dolnym pasku; „Odhacz bez pomiaru” | 1–2 | ekran treningu | przerwa | wiersz: ▶ przy serii |
| A9 | Skrócić/wydłużyć/pominąć przerwę | D | panel przerwy (w karcie albo dolny pasek): −15 / +15 / Pomiń | 1 | ekran treningu | — | poza zakładką Trening: plakietka na zakładce; po czasie powiadomienie |
| A10 | Zmienić przerwę ćwiczenia | R | „⏱ 1:30” → okno z wpisem → „Tylko teraz” / „Zapamiętaj” | 2 + wpis | ekran treningu | — | — |
| A11 | Dodać ćwiczenie w trakcie | T | „+ Dodaj ćwiczenie” → `picker` (szukaj / partia / filtr miejsca) → pozycja | 2 (+ wpis szukania) | Trening → Wybór ćwiczenia (modal) | ekran treningu | brak w bibliotece: „Utwórz „…”” |
| A12 | Zamienić ćwiczenie tylko dziś | T | „⇄ zamień” w stopce bloku → arkusz `swap` (ranking) → pozycja | 2 | Trening → Zamień (modal) | ekran treningu | „↺ cofnij” 1 (+1, gdy wpisane wartości); „Zawsze w: Miejsce” zapamiętuje; drugi „⇄” przy plakietce „brak sprzętu”, trzeci „Zamień” przy podpowiedzi „Zwykle w: …” |
| A13 | Pominąć ćwiczenie dziś | T | „Pomiń dziś” | 1 (+1 przy trwającym stoperze) | ekran treningu | blok zwinięty, „Przywróć” | — |
| A14 | Zmienić kolejność ćwiczeń | R | „≡ Kolejność” (dół listy) → przeciągnij → „Gotowe” | 2 + gest | Trening → Kolejność ćwiczeń | ekran treningu | — |
| A15 | Typ serii (W/D/F) albo notatka serii | T | numer serii → arkusz systemowy → pozycja | 2 (notatka 3 + wpis) | ekran treningu | — | opisane w tekście pod listą |
| A16 | Usunąć serię / ćwiczenie | T | przesunięcie w lewo → potwierdzenie | 1 gest + 1 | ekran treningu | — | ostatniej serii bloku nie da się usunąć |
| A17 | Superset | R | „⇅ SS” / „✂ SS” | 1 | ekran treningu | — | — |
| A18 | Pauza / wznowienie treningu | T | „⏸ Pauza” / „▶ Wznów” pod nazwą | 1 | ekran treningu | — | odhaczenie serii wznawia |
| A19 | Zmienić miejsce tej sesji | R | „📍 Dom ▾” → arkusz | 2 | ekran treningu | — | tylko gdy są miejsca |
| A20 | Technika ćwiczenia w trakcie | R | „ⓘ Technika” w stopce bloku → `exercise/[id]?cues=1` → Wróć | 2 | Trening → Ćwiczenie | ekran treningu | — |
| A21 | Notatka do treningu | T | pole na dole listy | 1 + wpis | ekran treningu | — | — |
| A22 | Zakończyć i zapisać | D | „Zakończ” (góra) / „Zakończ trening” (karta, gdy wszystko odhaczone) / „Zakończ trening i zapisz” (dół) → okno „Zakończyć trening?” → zapis | **2** + 0–2 okna (rekordy; „Zaktualizować szablon?”) | Trening → Sesja (`history/[id]` na stosie) | ekran sesji; „Wróć” → ekran główny | **3 przyciski tego samego celu na jednym ekranie**; NOWY (decyzja 7): podsumowanie rekordów bez grafiki |
| A23 | Odrzucić trening | R | „Odrzuć trening” (dół) → potwierdzenie | 2 | ekran treningu | ekran główny | — |
| A24 | Wrócić do treningu z innej zakładki | D | zakładka Trening (plakietka przerwy) | 1 | — | ekran treningu | z podglądu szablonu tego treningu: „Wróć do treningu” |
| A25 | Porzucony trening (bez serii > 2 h) | R | okno przy otwarciu: Kontynuuj / Zakończ i zapisz / Odrzuć; po 6 h zapis sam + komunikat | 1 | — | — | sprawdzone: `ActiveWorkout.askStale`, `app/_layout.tsx autoSaved` |
| A26 | NOWY — trening zrobiony dzień wcześniej (decyzja 4, wariant A) | T | bez nowego wejścia: po zakończeniu jedna linijka informacji; „Cofnij” w panelu dnia | 0 (+1 cofnięcie) | Trening → Sesja; Kalendarz → dzień | — | nie ma w kodzie |

**Stany wspólne (a):** pierwszy raz — zamiast karty „Dziś” jest „Pierwsze kroki” (brak planu i treningów); pusto (brak szablonów) — duży
przycisk „Pusty trening”; bez planu — duży przycisk z rotacją szablonów; w trakcie treningu — Start z innych miejsc blokowany oknem „Trening
w toku” (`DayPanel`, `template/[id]`); offline — aplikacja w całości lokalna, brak różnicy; inny język — wszystkie teksty przez `t()`
(35 języków); ciemny wygląd — kolory z `useTheme`; VoiceOver — etykiety na przyciskach startu, serii, przerwy; nagłówki kolumn ukryte.

### (b) Planowanie — plan tygodnia, szablony, generator

| ID | Cel | Częstość | Punkt wejścia dziś | Stuknięć | Ekrany | Koniec | Stany i uwagi |
|---|---|---|---|---|---|---|---|
| B1 | Utworzyć szablon | R/1 | Szablony → „+ Nowy” → edytor („+ Dodaj ćwiczenie” → picker → pozycja, ×n; wiersze serii) → „Zapisz” (`app/template/[id].tsx`) | 2 + 2n + 1 | Szablony → Nowy szablon → Wybór ćwiczenia | podgląd szablonu | inne wejścia (ten sam ekran): karta Planowanie, „Pierwsze kroki”, wiersz dnia w Planie, panel dnia, pusty stan „Plan z moich szablonów” — **6 wejść** |
| B2 | Zmienić szablon | R | Szablony → szablon → „Edytuj” → … → „Zapisz” | 4+ | Szablony → Szablon | podgląd | z karty „Dziś”: link „Szablon jest pusty — dodaj ćwiczenia” |
| B3 | Duplikuj / Archiwizuj / folder / usuń szablon | R | podgląd: „Duplikuj”, „Archiwizuj”; edytor: „Folder”; lista: gest | 2–3 | Szablony → Szablon | — | archiwum zwinięte na dole listy |
| B4 | Ustawić plan tygodnia ręcznie | 1/R | Trening → „Plan tygodnia” (karta Dziś) → wiersz dnia → chip szablonu (×n) (`app/plan.tsx`) | 1 + 2n | Trening → Plan tygodnia | ekran planu (bez „Zapisz” — zmiany od razu) | inne wejścia: Kalendarz → „Plan tygodnia”, „Pierwsze kroki”, okna „Zapisano” generatora; pierwszy dzień — prośba o zgodę na powiadomienia |
| B5 | Nazwać plan | R | Plan tygodnia → pole „Nazwa planu” | 2 + wpis | Plan | — | — |
| B6 | Drugi plan i przełączanie | R | Plan → „+ Nowy plan” → edycja kopii (`/plan?id=…`) → „Ustaw jako aktywny” → potwierdzenie | 4+ | Plan → Inny plan | ekran planu | „Inne plany” na górze ekranu, nad dniami; limit `SAVED_PLANS_MAX` |
| B7 | Wrócić do poprzedniego planu | R | Plan → „Ustaw jako aktywny” przy planie → potwierdzenie | 3 | Plan | — | zmiany dni wracają z planem |
| B8 | NOWY — wyłączyć wszystkie plany (decyzja 5, wariant A) | R | dziś **nie ma**: jedyna droga to 7 × (dzień → „Wolne”) = 14 stuknięć | 14 → po zmianie 2–3 (ikona przy planie → potwierdzenie) | Plan | pusty kalendarz | nie ma w kodzie |
| B9 | Wygenerować szablony i plan | 1/R | Szablony → „Wygeneruj szablony i plan” → dni / cel / miejsce / czas → „Zapisz szablony i plan” → „Ustawić jako aktywny?” → „Zapisano” (`app/generator.tsx`) | 3 + ustawienia + 2 okna | Szablony → Generator | okno „Zapisano”: Pokaż szablony / Plan tygodnia / OK | inne wejścia: Plan, karta Planowanie, „Pierwsze kroki”, Przewodnik, chip w generatorze — **6 wejść**; „Zastąpić poprzednio wygenerowane?” gdy nieużywane |
| B10 | Plan z moich szablonów | 1/R | karta Planowanie → wybór szablonów, dni → „Zapisz plan” → pytanie → „Zapisano” (`components/OwnPlan.tsx`) | 3 + wybór + 2 okna | Trening → Generator (tryb „own”) | jak B9 | inne wejścia: Plan, „Pierwsze kroki”, chip w generatorze |
| B11 | Przesunąć albo pominąć zaplanowany trening | T | Kalendarz → dzień → „Przesuń albo pomiń” → „Zastosuj” przy pozycji (`DayPanel`, `MoveList`) | 4 | Kalendarz | panel dnia | miniony dzień: „Przesuń plan od dziś”; w toku treningu — bez przesuwania |
| B12 | Inny trening w tym dniu / dodać trening w dzień wolny | T | Kalendarz → dzień → „Inny trening” / „Dodaj trening” → chip szablonu | 4 | Kalendarz | panel dnia | „+ Nowy szablon” z przypisaniem do dnia |
| B13 | Wolne w dniu / przywrócić z planu | R | panel dnia: w liście „Przesuń albo pomiń” → „Wolne w tym dniu”; „Więcej opcji” → „Przywróć z planu” | 4–5 | Kalendarz | — | — |
| B14 | Oznaczyć tydzień deload | R | (1) Kalendarz → podpowiedź „Zaplanuj deload od …” = 2; (2) Kalendarz → dzień → „Więcej opcji” → „Oznacz tydzień jako deload” = 4; (3) Więcej → Postępy → chip „Tydzień deload” = 3 | 2–4 | Kalendarz / Postępy | — | **3 miejsca** tej samej akcji; Przewodnik „Deload” kieruje do Postępów |
| B15 | Zobaczyć, co dalej w planie | D | karta „Dziś”: pasek tygodnia + „Następne: …”; wiersz „Plan: … · następny: …” | 0 | Trening | — | **ta sama informacja „następny” dwa razy na jednym ekranie** |
| B16 | Przypomnienie rano | D | automatyczne (`components/PlanReminderSync.tsx`); Ustawienia → przełącznik | 0 | — | — | brak zgody: tekst i „Otwórz Ustawienia iOS” w Ustawieniach |

### (c) Postęp i statystyki

| ID | Cel | Częstość | Punkt wejścia dziś | Stuknięć | Ekrany | Koniec | Stany i uwagi |
|---|---|---|---|---|---|---|---|
| C1 | Ile zrobiłem w tym tygodniu | D | „Ten tydzień”: Treningi / Serie / Czas z „poprz.”; przy planie stosy „60% planu (3 z 5)” (`components/Dashboard.tsx WeekStats`, `WeekStacks`) | 0 | Trening | — | brak przed pierwszym treningiem; kafelki jako jeden przycisk → Postępy (1) |
| C2 | Podsumowanie tygodnia / miesiąca z poprzednim | T | Więcej → Postępy → „Podsumowanie” (chipy Tydzień/Miesiąc, strzałki wstecz) (`components/PeriodSummary.tsx`) | 2 (z kafelków 1) | Więcej → Postępy | — | miesiąc: rząd stosów tygodni; mapa mięśni (`MuscleMap`); rekordy okresu |
| C3 | Serie i objętość per partia vs poprzedni tydzień | T | Postępy (pod wykresami tygodniowymi) (`app/more/progress.tsx MuscleCompare`) | 2 + przewinięcie | Postępy | — | kreska `WEEKLY_SETS_MARK`; tylko bieżący vs poprzedni, bez wyboru tygodnia |
| C4 | Wykres i rekordy ćwiczenia | T/R | (1) Więcej → Postępy → szukaj → chip = 4; (2) Ćwiczenia → ćwiczenie → „Postępy” = 3 | 3–4 | Postępy / Ćwiczenia → Ćwiczenie → Postępy | — | ten sam ekran z parametrem `?ex=` |
| C5 | Przejrzeć zapisaną sesję | T | Kalendarz → sesja z listy (albo dzień → „Zrobione: X ›”) | 2–3 | Kalendarz → Sesja | — | z ćwiczenia: „Ostatnie treningi” → sesja |
| C6 | Poprawić zapisaną sesję | R | Kalendarz → sesja → „Edytuj” → … → „Zapisz zmiany” (`app/history/edit/[id].tsx`) | 4+ | Kalendarz → Sesja → Edycja sesji | ekran sesji | gest cofnięcia wyłączony (szkic); „⇄ zamień” w edytorze |
| C7 | Dopisać trening wstecz | R | Kalendarz → „+ Dodaj trening wstecz” → termin + szablon/pusty → edytor → „Zapisz zmiany” (`app/history/add.tsx`) | 4+ | Kalendarz → Trening wstecz → Edycja sesji | Kalendarz | z dnia: „Zapisz trening z tego dnia” (data i szablon z planu) |
| C8 | Usunąć sesję | R | lista: gest → potwierdzenie | 2 | Kalendarz | — | ostrzeżenie o kopii w Apple Health |
| C9 | Zapisać sesję jako szablon | R | Sesja → „Zapisz jako szablon” → podgląd nowego szablonu | 3 | Kalendarz → Sesja → Szablon | podgląd szablonu | — |
| C10 | Masa ciała (dla e1RM ćwiczeń z masą ciała) | T | Więcej → Ustawienia → „Masa ciała” → wpis → „Zapisz pomiar” (`app/more/bodymass.tsx`) | 4 + wpis | Więcej → Ustawienia → Masa ciała | — | drugie wejście: Postępy ćwiczenia BW → „Masa ciała — pomiary”; nie ma jej w Postępach ogólnych |
| C11 | NOWY — Progresja (tydzień vs poprzedni z estymacją, miesiąc vs miesiąc, partie z postępem) | T | — | — | — | — | dziś tylko „poprz.” w kafelkach i w Podsumowaniu (same wykonane, bez estymacji); porównanie per partia tylko serie/objętość bieżący vs poprzedni tydzień |

### (d) Dane i ustawienia

| ID | Cel | Częstość | Punkt wejścia dziś | Stuknięć | Ekrany | Koniec | Stany i uwagi |
|---|---|---|---|---|---|---|---|
| D1 | Język | 1 | Więcej → Ustawienia → Język → pozycja (`app/more/language.tsx`, wraca samo) | 4 | Więcej → Ustawienia → Język | Ustawienia | — |
| D2 | Wygląd, jednostka, domyślna przerwa, dźwięk, ekran włączony, RPE/RIR, podpowiedź progresji, zachęta do planu | 1 | Więcej → Ustawienia → kontrolka (`app/more/settings.tsx`) | 3 | Więcej → Ustawienia | — | 4 sekcje: Ogólne, Trening, Dane i kopie, Powiadomienia, Dane w telefonie |
| D3 | Widok treningu: skupiony / lista | 1 | Ustawienia → „Widok treningu” | 3 | — | — | — |
| D4 | Miejsce i sprzęt | 1/R | Więcej → „Miejsca i sprzęt” → „+ Dodaj miejsce” → preset → ekran miejsca (`app/more/locations.tsx`, `location/[id].tsx`) | 4 | Więcej → Miejsca → Miejsce | ekran miejsca | inne wejścia: Ustawienia, „Pierwsze kroki”, generator („+ Dodaj miejsce”) — 4 wejścia |
| D5 | Gumy oporowe | R | Miejsce → „Gumy…” → `/more/bands` (dodawanie, kolor, usuwanie) | 5 | … → Miejsce → Gumy | — | jedyne wejście (potwierdzone grep) — głęboko schowane, ale to jest rzadka czynność |
| D6 | Kopia zapasowa: eksport JSON, CSV, import | R | Więcej → „Kopia zapasowa (eksport / import)” → przycisk (`app/more/backup.tsx`) | 3 (+ okno przy imporcie) | Więcej → Kopia zapasowa | — | automatyczna kopia — przełącznik w Ustawieniach (inna sekcja) |
| D7 | Apple Health, powiadomienia | 1 | Ustawienia → przełączniki / „Sprawdź zgodę na powiadomienia” | 3 | — | — | — |
| D8 | Wyczyść wszystkie dane | R | Ustawienia → „Wyczyść wszystkie dane” → potwierdzenie | 4 | — | — | — |
| D9 | Biblioteka ćwiczeń: przeglądać, szukać, nowe, edycja, usuwanie, przywracanie, filtr „Podstawowe” | R | Ćwiczenia → (szukaj) → ćwiczenie → „Edytuj” → „Zapisz” (`app/(tabs)/exercises.tsx`, `app/exercise/[id].tsx`) | 2–4 | Ćwiczenia → Ćwiczenie | — | podgląd: Technika, partie, przerwy, „Ostatnie treningi” (→ sesja), „Postępy” |
| D10 | Przewodnik | 1/R | Więcej → Przewodnik → temat → „Pokaż” (`app/guide.tsx`, treść `lib/guide.ts`) | 3 | Więcej → Przewodnik → ekran tematu | ekran z tematu | inne wejścia: „Pierwsze kroki” („Przewodnik” i „Jak to działa”), „Co nowego” |
| D11 | Co nowego | R | Trening → „i” → sekcja rozwijana | 1 | Trening | — | kropka po aktualizacji (tylko gdy są treningi) |
| D12 | O aplikacji, licencje, wersja | R | Więcej → „O aplikacji” → „Licencje open source” | 2–3 | — | — | wersja też małym drukiem na dole „Więcej” |
| D13 | NOWY — import historii z CSV popularnych dzienników (docs/21 „Przed App Store”) | 1 | — | — | — | — | naturalne miejsce: Kopia zapasowa; przy pierwszym uruchomieniu — **[DO WYJAŚNIENIA]** (decyzja produktowa, pytanie P6) |

### (e) Pierwsze uruchomienie

| ID | Cel | Częstość | Punkt wejścia dziś | Stuknięć | Ekrany | Koniec | Stany i uwagi |
|---|---|---|---|---|---|---|---|
| E1 | Zrozumieć, od czego zacząć | 1 | zimny start: animacja ikony (`components/Intro.tsx`, do pominięcia stuknięciem) → zakładka Trening z „Pierwsze kroki” (`Dashboard.tsx FirstSteps`): 1 „Utwórz pierwszy szablon albo wygeneruj” (+ Nowy szablon / Wygeneruj szablony i plan); 2 „Ustaw plan tygodnia” (Plan tygodnia / Plan z moich szablonów; przy pustym szablonie „Dodaj ćwiczenia”); 3 „Opcjonalnie: miejsce i sprzęt”; 4 „Pierwszy trening: „Start” przy szablonie niżej albo „Pusty trening”” + „Jak to działa” | 0 (karta) | Trening | — | karta znika po pierwszym zakończonym treningu; **krok 4 odsyła do listy, która ma zniknąć (krok 3 właściciela)**; „Dziś” i Planowanie ukryte, gdy widać kroki |
| E2 | Najszybsza droga do pierwszego treningu bez planu | 1 | duży przycisk „Pusty trening” (brak szablonów) → „+ Dodaj ćwiczenie” → picker → pozycja → wpis → ✓ → „Zakończ” → okno | 1 + (2 na ćwiczenie) + … | Trening → Wybór ćwiczenia → Trening → Sesja | ekran sesji | — |
| E3 | Zgoda na powiadomienia | 1 | przy pierwszym treningu (`timer.ensurePermission`) i pierwszym dniu w planie (`askReminderPermission`) | 1 (okno systemowe) | — | — | odmowa: Ustawienia → „Otwórz Ustawienia iOS” |
| E4 | Dane z nowszej wersji / błąd startu / nieczytelne dane | R | ekran zamiast aplikacji („Wyślij dane”, „Spróbuj ponownie”); baner na ekranie Trening („Wyślij kopię”, „Ukryj komunikat”) | 1–2 | — | — | `app/_layout.tsx`, `index.tsx DataBanners` |
| E5 | Odzyskanie niezapisanego szkicu po zamknięciu aplikacji | R | okno „Niezapisane zmiany” → „Wróć do edycji” / „Odrzuć zmiany” | 1 | → edytor | — | `app/_layout.tsx askRestored` |
| E6 | Po aktualizacji: co się zmieniło | R | kropka na „i” → „Co nowego” → „Przewodnik po funkcjach” | 1–2 | Trening → Przewodnik | — | — |

**Razem: 61 przepływów** (a: 26, b: 16, c: 11, d: 13, e: 6), w tym **6 NOWYCH** (A26, B8, C11, D13 oraz A7-kaskada i A22-podsumowanie jako
zmiany istniejących).

---

## 2. Krok 2 — mapa ekranów i odnośników dziś

### 2.1 Tabela: ekran → elementy nawigacyjne → dokąd

| Ekran (plik) | Element | Dokąd / co robi | Uwagi |
|---|---|---|---|
| **Trening** (`app/(tabs)/index.tsx`) | „i” (`WhatsNew.tsx`) | rozwija „Co nowego”; w środku „Przewodnik po funkcjach” → `/guide` | |
| | banery danych | ponowny zapis / okno kopii | tylko przy błędzie |
| | karta „Dziś” → „Plan tygodnia” (`TodayPlan.tsx`) | `/plan` | **właściciel: znika, zastąpi go „Planowanie” przy nazwie planu** |
| | karta „Dziś” → dzień w pasku | `/history?day=…` (Kalendarz, panel dnia) | zmienia zakładkę |
| | karta „Dziś” → „Szablon jest pusty — dodaj ćwiczenia” | `/template/[id]?edit=1` | tylko pusty szablon |
| | karta „Dziś” → „Ukryj” (zachęta) | chowa tekst | bez planu |
| | duży przycisk startu (`StartPanel.tsx`) | start szablonu / pusty / „Wróć do treningu” | |
| | „Inny trening” → arkusz | Inny z planu (start), Powtórz ostatni (start), **Z szablonu → `/templates` (zakładka)**, Pusty trening (start) | „Z szablonu” nie startuje — zmienia zakładkę |
| | karta Planowanie (bez planu) (`PlanningCard.tsx`) | „+ Nowy szablon” → `/template/new?edit=1&new=1`; „Plan z moich szablonów” → `/generator?mode=own`; „Wygeneruj szablony i plan” → `/generator` | |
| | „Pierwsze kroki” (`Dashboard.tsx FirstSteps`) | „Przewodnik” → `/guide`; „+ Nowy szablon”; „Wygeneruj szablony i plan”; „Plan tygodnia” → `/plan`; „Plan z moich szablonów”; „Dodaj ćwiczenia” → edytor; „Puste szablony: n” → `/templates`; „Miejsca i sprzęt” → `/more/locations`; „Jak to działa” → `/guide?topic=workout` | 9 przycisków; te same cele co karta Planowanie |
| | „Ten tydzień” — 3 kafelki (jeden przycisk) | `/more/progress` | przy planie stosy talerzy (bez akcji) |
| | wiersz „Plan: … Planowanie ›” (przy planie) | rozwija te same 3 akcje co karta Planowanie | |
| | „Zacznij z szablonu” — lista: wiersz | `/template/[id]` | **właściciel: znika** |
| | — przycisk „Start” przy wierszu | start szablonu | **duplikat** dużego przycisku i arkusza |
| **Trening w toku** (`components/ActiveWorkout.tsx`) | „Zakończ” (nagłówek) | okno → zapis → `/history/[id]` | |
| | karta „teraz”: „Seria zrobiona” / „▶ Start” / „Odhacz bez pomiaru” / „Zakończ trening” (gdy nic nie zostało) | odhaczenie / stoper / zapis | |
| | „📍 miejsce ▾” | arkusz miejsc | |
| | „⏸ Pauza / ▶ Wznów” | — | |
| | blok: numer serii → arkusz typu/notatki; pola; ▶; guma; ✓ | — | |
| | stopka bloku: „+ seria”, „+ rozgrzewka”, „+ drop set”, „⏱ przerwa”, „⇅ SS”/„✂ SS”, „ⓘ Technika” → `/exercise/[id]?cues=1`, „⇄ zamień” → `/swap`, „Pomiń dziś” | | do 8 przycisków w stopce każdego bloku |
| | przy bloku: „↺ cofnij”, „Zawsze w: …”, „Zamień” (podpowiedź), „⇄” (brak sprzętu), „Przywróć” (pominięty) | | **trzy wejścia do zamiany** w jednym bloku |
| | „+ Dodaj ćwiczenie” → `/picker?target=active`; „≡ Kolejność” → `/reorder?target=active` | | |
| | notatka; „Zakończ trening i zapisz”; „Odrzuć trening” | | **drugi/trzeci przycisk zakończenia** |
| | dolny pasek: „Zakończ serię” / „−15 +15 Pomiń” | | |
| **Szablony** (`app/(tabs)/templates.tsx`) | „+ Nowy” → edytor; „Wygeneruj szablony i plan” → `/generator`; wiersz → `/template/[id]`; gest → usuń; „Archiwum (n)” | | |
| **Szablon — podgląd** (`app/template/[id].tsx`) | „Edytuj”; „Start” (zamyka stos, → Trening) / „Wróć do treningu” / „Trening w toku” (okno); „ⓘ Technika”; „Duplikuj” (replace); „Archiwizuj / Przywróć z archiwum” | | |
| **Szablon — edycja** | nagłówek „Anuluj” / „Zapisz” (`DraftHeader.tsx`); „+ Nowy folder”; „≡ Kolejność” → `/reorder`; „+ Dodaj ćwiczenie” → `/picker`; wiersze serii; zamienniki | | po „Zapisz” z `assign` — przypisanie do dnia planu |
| **Ćwiczenia** (`app/(tabs)/exercises.tsx`) | „+ Nowe” → edytor; szukaj; chip zakresu „Podstawowe / Wszystkie”; wiersz → `/exercise/[id]`; „Przywróć „…”” (zarchiwizowane przy szukaniu); „Utwórz „…”” (pusty wynik); gest → usuń | | |
| **Ćwiczenie — podgląd** (`app/exercise/[id].tsx`) | „Edytuj”; Technika (rozwijana, figura); „Ostatnie treningi” → `/history/[id]`; „Postępy” → `/more/progress?ex=` | | |
| **Kalendarz** (`app/(tabs)/history.tsx`) | „Plan tygodnia” → `/plan`; „+ Dodaj trening wstecz” → `/history/add`; podpowiedź deload („Zaplanuj deload od …”, „Nie teraz”, „Zdejmij oznaczenie”); kalendarz miesiąca (‹ ›, dzień → panel); zachęta do planu + „Ukryj”; „Pokaż wszystkie”; wiersz sesji → `/history/[id]`; gest → usuń | | zakładka łączy historię i planowanie |
| **Panel dnia** (`components/DayPanel.tsx`) | „Zrobione: X ›” → sesja; „Start”; „Przesuń albo pomiń” → lista z „Zastosuj” i „Więcej możliwości”; „Inny trening” / „Dodaj trening” → chipy + „+ Nowy szablon”; „Zapisz trening z tego dnia” → `/history/add?date=&tpl=`; „Więcej opcji” → „Przywróć z planu”, „Oznacz tydzień jako deload”; „Szablon jest pusty — dodaj ćwiczenia” | | najwyżej 3 główne akcje (UX-13) |
| **Sesja** (`app/history/[id].tsx`) | „Edytuj” → `/history/edit/[id]`; „Zapisz jako szablon” → `/template/[id]` | | karta rekordów `RecordPlates` (decyzja 7: znika) |
| **Edycja sesji** (`app/history/edit/[id].tsx`) | nagłówek „Wróć” / „Zapisz zmiany”; „+ Dodaj ćwiczenie” → `/picker`; „⇄ zamień” → `/swap`; wiersze | | |
| **Trening wstecz** (`app/history/add.tsx`) | termin; szablon → `/history/edit/[klucz]` (replace); „Pusty trening”; Archiwum | | |
| **Plan tygodnia** (`app/plan.tsx`) | nazwa; „+ Nowy plan” → `/plan?id=`; „Wygeneruj szablony i plan”; „Plan z moich szablonów”; „Inne plany”: wiersz → `/plan?id=`, „Ustaw jako aktywny”, gest; 7 wierszy dni → chipy + „Wolne” + „+ Nowy szablon” | | **z ekranu planu nie da się przejść do listy szablonów ani do podglądu szablonu** (tylko utworzyć nowy) — wymóg właściciela krok 1 niespełniony |
| **Generator** (`app/generator.tsx`, `OwnPlan.tsx`) | chipy trybu; „+ Dodaj miejsce” → `/more/locations`; „Zapisz szablony i plan” / „Zapisz plan” → okna; okno „Zapisano”: „Pokaż szablony” (dismissAll → `/templates`), „Plan tygodnia” (`usePlanReturn`), „OK” | | |
| **Przewodnik** (`app/guide.tsx`) | 10 tematów → „Pokaż” → `/`, `/templates`, `/history`, `/generator`, `/more/progress`, `/more/locations`, `/more/backup` | | kroki opisują nazwy przycisków — część nieaktualna (niżej) |
| **Więcej** (`app/(tabs)/more.tsx`) | Przewodnik; Postępy; Miejsca i sprzęt; Kopia zapasowa; Ustawienia; O aplikacji | | |
| **Postępy** (`app/more/progress.tsx`) | Podsumowanie (Tydzień/Miesiąc, ‹ ›, chip „Tydzień deload”); wykresy; partie; szukaj → chip ćwiczenia → widok ćwiczenia (chip ✕ wraca); „Masa ciała — pomiary” → `/more/bodymass` | | |
| **Ustawienia** (`app/more/settings.tsx`) | Język → `/more/language`; Miejsca i sprzęt → `/more/locations`; Masa ciała → `/more/bodymass`; przełączniki; „Otwórz Ustawienia iOS”; „Sprawdź zgodę”; „Wyczyść wszystkie dane” | | |
| **Miejsca** / **Miejsce** / **Gumy** / **Kopia zapasowa** / **O aplikacji** / **Licencje** / **Język** / **Masa ciała** | jak w 1(d) | | |
| Modale: **Wybór ćwiczenia** (`picker.tsx`), **Zamień ćwiczenie** (`swap.tsx`), **Kolejność** (`reorder.tsx`) | „Anuluj”/„Wróć”/„Gotowe” w nagłówku; pozycja → powrót | | |

### 2.2 Problemy

**Duplikaty (ten sam cel z kilku elementów na jednym ekranie lub w jednym przepływie)**

1. **Start tego samego szablonu — do 4 dróg na ekranie Trening**: duży przycisk, arkusz „Inny trening” (Inny z planu / Z szablonu), „Start” przy
   wierszu listy „Zacznij z szablonu”, a do tego podgląd szablonu. Właściciel usuwa listę (krok 3) — wtedy arkusz musi dawać start bez wchodzenia
   w zakładkę Szablony (dziś „Z szablonu” = +2 stuknięcia).
2. **Planowanie — ta sama trójka akcji (+ Nowy szablon / Plan z moich szablonów / Wygeneruj) w 3 miejscach** ekranu głównego zależnie od stanu
   (karta Planowanie, wiersz „Planowanie ›”, „Pierwsze kroki”) oraz w Szablonach, Planie tygodnia i generatorze. „Wygeneruj szablony i plan” ma
   **6 wejść**, „+ Nowy szablon” **6**, „Plan z moich szablonów” **4**, „Plan tygodnia” **4** (karta Dziś, Kalendarz, Pierwsze kroki, okna „Zapisano”).
3. **„Następny trening” pokazany dwa razy na ekranie głównym**: w karcie „Dziś” („Następne: jutro — Upper B · …”) i w wierszu „Plan: … · następny:
   jutro Upper B”.
4. **Zakończenie treningu — 3 przyciski** na ekranie treningu („Zakończ” u góry, „Zakończ trening” w karcie po ostatniej serii, „Zakończ trening
   i zapisz” u dołu).
5. **Zamiana ćwiczenia — 3 wejścia w jednym bloku** („⇄ zamień” w stopce, „⇄” przy „brak sprzętu”, „Zamień” przy podpowiedzi „Zwykle w: …”). Każde ma
   inny powód, ale dla użytkownika to jedna czynność.
6. **Oznaczenie deload — 3 miejsca** (podpowiedź w Kalendarzu, „Więcej opcji” w panelu dnia, chip w Postępach); Przewodnik odsyła do Postępów.
7. **„Miejsca i sprzęt” — 4 wejścia** (Więcej, Ustawienia, Pierwsze kroki, generator). **„Masa ciała”** w Ustawieniach (sekcja „Trening”) i w Postępach
   ćwiczenia — a nie w Postępach ogólnych, gdzie użytkownik szuka pomiarów.
8. **Przewodnik — 4 wejścia** (Więcej, „Pierwsze kroki” ×2, „Co nowego”).

**Ślepe zaułki i niespójne powroty**

9. **Plan tygodnia → szablony**: z ekranu planu nie da się przejść do listy ani podglądu szablonu — tylko „+ Nowy szablon”. Wymóg właściciela
   (krok 1: „z planowania da się przejść do szablonów”) **dziś niespełniony**.
10. **Arkusz „Inny trening” → „Z szablonu”** zmienia zakładkę na Szablony (lista bez przycisków Start) — użytkownik traci kontekst „chcę zacząć”.
11. **Po „Zakończ”** aplikacja wypycha ekran Sesji na stos nad zakładką Trening, a potem do 2 okien (rekordy, „Zaktualizować szablon?”). „Wróć” prowadzi
    na ekran główny — poprawnie, ale użytkownik nie wybiera, czy chce oglądać sesję.
12. **Ekran główny jest długi**: przy planie i historii to 7 bloków (nagłówek, Dziś, start, Ten tydzień, wiersz Planowanie, nagłówek „Zacznij
    z szablonu”, lista) — na iPhone SE lista szablonów jest poza ekranem (stąd „Start przy szablonie niżej” w Pierwszych krokach).
13. **Zakładka „Kalendarz” łączy dwie rzeczy**: historię sesji (lista, usuwanie, trening wstecz) i planowanie (plan tygodnia, przesuwanie, deload).
    Jednocześnie pasek tygodnia z planem jest też na ekranie Trening, a stuknięcie dnia przerzuca do Kalendarza.

**Elementy, których nie użyto w żadnym przepływie z kroku 1**

14. `_sitemap`, `+not-found` (techniczne, nie dla użytkownika). Przełącznik „Zachęta do planu tygodnia” w Ustawieniach — służy tylko do cofnięcia
    „Ukryj”; po zmianach z kroku 3 (nazwa planu i „Planowanie” na stałe nad kalendarzem) zachęta i przełącznik mogą zniknąć.
15. Wiersz „Planowanie ›” przy planie — jedyne, co daje ponad kartę „Dziś”, to te same 3 akcje; po kroku 1 właściciela („Planowanie” przy nazwie
    planu) staje się zbędny.

**Niespójne nazwy tego samego miejsca / przyciski robiące co innego, niż sugeruje nazwa**

16. **„Inny trening” znaczy dwie różne rzeczy**: na ekranie Trening — arkusz sposobów startu; w panelu dnia (Kalendarz) — przypisanie innego szablonu
    do dnia planu.
17. **„Dodaj trening” (panel dnia = wpis do planu) vs „+ Dodaj trening wstecz” (Kalendarz = wpis do historii)** — podobne nazwy, przeciwny skutek.
18. **„Plan tygodnia” / „Planowanie” / „Plan: nazwa”** — trzy etykiety jednego miejsca na jednym ekranie (karta Dziś, wiersz, karta).
19. **Zakładka „Kalendarz”, ale trasa `/history`, tytuły „Sesja”, „Edycja sesji”, „Trening wstecz”** — dla użytkownika niewidoczne poza przewodnikiem;
    w kodzie i testach E2E nadal „history”.
20. **„Postępy” (Więcej) vs „Ten tydzień” (ekran główny) vs „Podsumowanie” (nagłówek w Postępach)** — kafelki prowadzą do „Postępów”, ale pierwsza
    sekcja nazywa się „Podsumowanie”; nowa sekcja „Progresja” (krok 3) dołoży czwartą nazwę, jeśli nie uporządkować.
21. **„Z szablonu”** w arkuszu sugeruje wybór szablonu, a otwiera zakładkę Szablony (patrz 10).
22. **Teksty nieaktualne po układzie B**: „Pierwsze kroki” krok 4 („„Start” przy szablonie niżej”), Przewodnik „Trening i serie” krok 1 („stuknij
    „Start” przy szablonie albo „Pusty trening””) — po kroku 3 właściciela listy nie będzie; Przewodnik „Plan tygodnia i Kalendarz” krok 1 („W Kalendarzu
    „Plan tygodnia””) — po kroku 1 wejście będzie na ekranie Trening. Test `tests/guide.test.tsx` pilnuje zgodności nazw przycisków — zmiany wymuszą
    aktualizację kroków.
23. **Ikona „i” w nagłówku** — „Co nowego”; w iOS „i” zwykle znaczy „informacje/o aplikacji”. Nazwa w VoiceOver poprawna, znak mylący. (NISKIE)

---

## 3. Krok 3 — wymagania właściciela (11.10.2026) w propozycji

Wymagania 1–5 z promptu są wspólne dla obu wariantów z kroku 4 (różnią się zakładkami, nie ekranem głównym). Ekran Trening po zmianach:

1. **Nagłówek planu nad kalendarzem**: „Plan: <nazwa>” (bez planu: „Bez planu tygodnia”) i obok przycisk **„Planowanie ›”** → ekran planu (dzisiejsze
   `/plan`). Przycisk „Plan tygodnia” z karty „Dziś” znika; wiersz „Plan: … Planowanie ›” pod „Ten tydzień” znika (jego treść wchodzi do nagłówka).
   **Przejście z planowania do szablonów** (wymóg): na ekranie planu, w wierszu dnia obok chipów, pozycja „Szablony ›” (lista z podglądem), a w nagłówku
   ekranu planu przycisk „Szablony” — rekomendacja: **oba** (wiersz dnia = kontekst „co to za szablon”, nagłówek = „zarządzaj szablonami”). Dziś nie ma
   żadnego (problem 9).
2. **Kalendarz tygodnia (pasek pon–nd) jak dziś**, pod nim duży przycisk „następny trening” i „Inny trening” — bez zmian (`StartPanel`).
3. **„Zacznij z szablonu” znika**; arkusz „Inny trening” dostaje w miejscu „Z szablonu (n szablonów)” **listę szablonów ze Startem** (foldery jak
   dziś, bez zarchiwizowanych) — start konkretnego szablonu: 2 stuknięcia (dziś 1 z listy po przewinięciu albo 4 przez „Z szablonu”). Arkusz może
   stać się pełnoekranowym arkuszem przewijanym (modal), bo lista bywa długa (foldery „Wygenerowane”). Pozycje arkusza: Inny z planu · Powtórz
   ostatni · Pusty trening · nagłówek „Z szablonu” i lista.
4. **„Ten tydzień” zostaje; statystyka wykonania tygodnia (stosy „60% planu (3 z 5)”) od razu pod nią** — dziś już tak jest (`WeekStats`: kafelki, potem
   `WeekStacks`). Zakres „tylko ten tydzień”: treningi, serie robocze, objętość, czas treningów (dziś 3 kafelki bez objętości — dodać 4.), sylwetka
   ciała z partiami (dziś tylko w Postępach → Podsumowanie — przenieść jako mały rysunek), pilnowanie liczby serii: wykonane + estymowane vs cel na jednej
   osi (dziś: `MuscleCompare` w Postępach pokazuje tylko wykonane vs poprzedni tydzień z kreską `WEEKLY_SETS_MARK`; estymacja — **[DO WYJAŚNIENIA —
   badacz]**: co liczyć jako „estymowane” — serie z szablonów zaplanowanych na resztę tygodnia (arytmetyka, bez twierdzeń) czy coś więcej).
   Propozycja: kafelki pozostają jednym przyciskiem → szczegóły „Ten tydzień” (nowy ekran albo sekcja w Postępach z filtrem „ten tydzień”).
5. **Nowa sekcja „Progresja” pod „Ten tydzień”** — na ekranie głównym 2–3 kafelki, stuknięcie → ekran „Progresja” (nowy, w stosie):
   - kafelek 1 „Tydzień vs poprzedni”: objętość (wykonane + zaplanowane) ze strzałką i %; kafelek 2 „Poprzedni vs 2 tyg. temu” (wykonanie); kafelek 3
     „Miesiąc vs miesiąc”;
   - ekran szczegółów: trzy porównania, w każdym sylwetka z zaznaczonymi partiami z progresją, potem per partia **najpierw objętość**, potem serie
     (jak w `MuscleCompare`, z dwoma słupkami); przełącznik „z estymacją / tylko wykonane”;
   - **co dodatkowo pokazać** (propozycja, bez twierdzeń dziedzinowych): e1RM głównych ćwiczeń (najlepszy w okresie vs poprzedni — istnieje `recordsFor`),
     liczba rekordów w okresie (jest w `PeriodSummary`), liczba dni treningowych i regularność (dni z planu zrobione / zaplanowane — `weekProgress`),
     deload w porównywanym tygodniu (oznaczenie, jak „D” na wykresach);
   - **co przenieść ze szczegółowego „Ten tydzień”/Postępów**: „Serie per partia — ten tydzień vs poprzedni” i „Objętość per partia” (dziś w Postępach)
     stają się sekcją Progresji; w Postępach zostają wykresy 8 tygodni, Podsumowanie okresu (z przewijaniem wstecz) i wykresy ćwiczeń;
   - **[DO WYJAŚNIENIA — badacz]**: (a) estymacja pozostałych treningów tygodnia — z serii i ciężarów szablonu, z „Poprzednio”, czy ze średniej ostatnich
     wykonań tego szablonu; (b) co znaczy „progresja partii” (wzrost objętości o ile %; czy ciężar/e1RM liczy się osobno); (c) czy porównywać tydzień
     deload z normalnym (oznaczyć, nie porównywać?). Bez odpowiedzi kafelki pokazują tylko surowe liczby „wykonane + zaplanowane” bez oceny.

---

## 4. Krok 4 — propozycja architektury

Wspólne założenia obu wariantów: każdy element nawigacyjny wynika z przepływu z kroku 1; duplikaty z 2.2 usunięte (lista pkt 4.3); ekran główny
wg kroku 3; nazwy ujednolicone (4.4).

### 4.1 Wariant A — „4 zakładki: Trening · Plan · Postępy · Więcej” (rekomendacja)

| Zakładka | Zawartość | Przepływy |
|---|---|---|
| **Trening** | nagłówek planu + „Planowanie ›”, pasek tygodnia, duży start + „Inny trening” (z listą szablonów), „Ten tydzień” (4 kafelki + stosy + mała sylwetka → szczegóły), „Progresja” (kafelki → szczegóły); w toku — ekran treningu | A1–A26, B15, C1, C11, E1–E6 |
| **Plan** (dziś Kalendarz) | kalendarz miesiąca z planem i historią, panel dnia, lista sesji dnia/miesiąca, „+ Dodaj trening wstecz”, podpowiedź deload; ekran „Planowanie” (`/plan`) w stosie z wejściem w nagłówku zakładki i z ekranu Trening; z planu → Szablony | B4–B14, C5–C9 |
| **Postępy** (nowa zakładka, dziś Więcej → Postępy) | Podsumowanie okresu, Progresja (ten sam ekran co z kafelków), wykresy tygodniowe, ćwiczenia (wykres, rekordy), masa ciała | C2–C4, C10, C11 |
| **Więcej** | Szablony, Ćwiczenia (biblioteka), Miejsca i sprzęt, Kopia zapasowa (+ import CSV), Ustawienia, Przewodnik, O aplikacji | B1–B3, D1–D13 |

- **Kompromisy**: Szablony i Ćwiczenia schodzą o poziom niżej (Więcej → Szablony = 2 stuknięcia zamiast 1). Uzasadnienie: edycja szablonu i biblioteki
  to czynności **rzadkie** (B1–B3, D9), a start szablonu idzie przez arkusz na Treningu (2 stuknięcia). Postępy awansują, bo właściciel dokłada
  Progresję i „Ten tydzień” — trzy wejścia do statystyk (kafelki, Progresja, Więcej → Postępy) bez własnej zakładki byłyby czwartym duplikatem.
- **Dla obecnych użytkowników (TestFlight, 0.11)**: dwie zakładki znikają z paska, Szablony/Ćwiczenia pod Więcej — wpis „Co nowego” i pozycje na
  górze listy Więcej. Zmiana nawyku średnia (lekcja z docs/11: przeprojektowania zbierają 1–2★ — stąd wdrożenie krokami, 4.5).
- **Ryzyka**: dostępność — mniej zakładek = krótsze etykiety VoiceOver „zakładka, i z 4”; małe ekrany — 4 zakładki mieszczą się lepiej niż 5 (dziś
  na 320 pt etykiety 5 zakładek są ciasne w długich językach); 35 języków — „Postępy”/„Plan” to krótkie słowa, sprawdzić `tests/matrix-i18n`
  (etykiety zakładek na 320 pt); ciemny wygląd — bez zmian (tokeny z `useTheme`).
- **Testy**: `.maestro` 05, 06, 07, 08, 09, 10, 14, 15, 16, 17, 18 używają literałów „Start from a template”, „Templates, tab.*”, „More, tab.*”,
  „Calendar, tab.*” — do zmiany w **11 z 18 scenariuszy** (nowe literały: „Plan, tab”, „Progress, tab”, „More → Templates”); `TAB_COUNT` w
  `_layout.tsx`, `TAB_ROUTES` w `guide.tsx`, `tests/a11y-routes.ts`, macierz ekranów (`npm run check:matrix`, docs/19) — nowe ekrany „Progresja”
  i „Ten tydzień — szczegóły” wymagają testów ekranowych, logiki (`lib/progression.ts` — nowy), scenariuszowych, i18n (35 języków) i E2E.

### 4.2 Wariant B — „5 zakładek jak dziś, uporządkowane: Trening · Szablony · Ćwiczenia · Plan · Więcej”

- Zmiany tylko wewnątrz ekranów: ekran główny wg kroku 3 (nazwa planu + „Planowanie”, arkusz z listą szablonów, „Ten tydzień”, „Progresja”);
  Kalendarz → nazwa **„Plan”** (historia zostaje w nim jak dziś); Postępy nadal pod Więcej, ale kafelki i Progresja na ekranie głównym prowadzą do
  nich bezpośrednio; z ekranu planu wejście do Szablonów (zakładka).
- **Plusy**: minimalna zmiana nawyku; E2E — tylko literały ekranu głównego (01, 05–10, 14, 18 używają „Start from a template”) i nazwy zakładki
  Kalendarz (13); macierz testów — tylko nowe sekcje.
- **Minusy**: Szablony i Ćwiczenia zajmują 2 z 5 miejsc na pasku dla czynności rzadkich (B1–B3, D9: „raz / rzadko”), a statystyki (codziennie:
  C1, co tydzień: C2, C11) zostają 2 poziomy niżej; Progresja na ekranie głównym i Postępy w Więcej to dwa wejścia do tego samego (duplikat 20
  zostaje); 5 etykiet na 320 pt w długich językach (dziś ciasno).
- **Ryzyka**: jak A, ale mniejsze; dostępność bez zmian.

### 4.3 Co znika / co zostaje (oba warianty) — każdy element musi mieć przepływ

| Element | Decyzja | Przepływ, który go uzasadnia |
|---|---|---|
| Lista „Zacznij z szablonu” na ekranie głównym | **znika** (krok 3) | A3 → arkusz (A2) |
| „Plan tygodnia” na karcie „Dziś”; wiersz „Plan: … Planowanie ›” | **znikają** (krok 1) | zastępuje je nagłówek planu + „Planowanie ›” (B4, B15) |
| Karta Planowanie bez planu (3 akcje) | **znika**; bez planu nagłówek „Bez planu tygodnia · Planowanie ›”, a ekran planu zawiera „+ Nowy szablon / Plan z moich szablonów / Wygeneruj” (jak dziś) | B4, B9, B10 — jedno miejsce |
| „Pierwsze kroki” | zostaje, ale **3 kroki zamiast 4** z jednym przyciskiem każdy: 1 „Szablony” (→ Planowanie, gdzie są Nowy / Wygeneruj / Z moich), 2 „Plan tygodnia” (→ Planowanie), 3 „Pierwszy trening” (→ „Jak to działa”); „Miejsca i sprzęt” jako zdanie z odnośnikiem; usunąć duplikaty przycisków Planowania | E1 |
| 3 przyciski zakończenia treningu | **zostaje „Zakończ” w nagłówku i w karcie po ostatniej serii**; dolny „Zakończ trening i zapisz” znika (dół listy = „Odrzuć” i notatka) — **[DO WYJAŚNIENIA]** z E2E 01 (szuka „Finish workout and save”?) | A22 |
| 3 wejścia zamiany w bloku | **jedno „⇄ zamień”** w stopce; plakietka „brak sprzętu” i podpowiedź „Zwykle w: …” tylko jako tekst z tym samym arkuszem po stuknięciu w tekst | A12 |
| Deload w 3 miejscach | zostaje podpowiedź w Planie (kalendarz) i „Więcej opcji” dnia; **chip w Postępach znika** (Postępy pokazują oznaczenie, nie zmieniają) — Przewodnik „Deload” → Plan | B14 |
| „Masa ciała” | wejście w **Postępach** (sekcja „Masa ciała”) zamiast w Ustawieniach; link z e1RM BW zostaje | C10 |
| „Miejsca i sprzęt” w Ustawieniach | **znika** (zostaje w Więcej, generatorze i Pierwszych krokach) | D4 |
| „Przewodnik” w „Pierwszych krokach” ×2 | **jeden** („Jak to działa” przy kroku 3) | D10 |
| Przełącznik „Zachęta do planu” + teksty zachęty | **znikają** (nagłówek „Bez planu tygodnia · Planowanie ›” jest stałą zachętą) | 2.2 pkt 14 |
| „Inny trening” w panelu dnia | **zmiana nazwy** → „Zmień szablon” / „Dodaj do planu” | 2.2 pkt 16 |
| „+ Dodaj trening wstecz” | zostaje; w panelu dnia „Zapisz trening z tego dnia” → „Dopisz trening wstecz” (ta sama nazwa) | C7 |
| Przycisk „Start” w panelu dnia (dziś) | zostaje (A5) | |
| „Z szablonu” w arkuszu | **lista szablonów ze Startem w arkuszu** | A2, A3 |

### 4.4 Nazwy (ujednolicenie; propozycje tekstów, neutralne)

- Miejsce planowania: **„Planowanie”** (ekran `/plan`, tytuł nagłówka i przycisk); w nim sekcje „Plan tygodnia” (dni), „Inne plany”, „Szablony” (link),
  „Nowy szablon / Plan z moich szablonów / Wygeneruj szablony i plan”.
- Zakładka historii i kalendarza: **„Plan”** (A i B) — kalendarz z planem i historią; tytuły ekranów „Sesja”, „Edycja sesji” zostają.
- Statystyki: **„Postępy”** jako nazwa zakładki/ekranu; sekcje: „Ten tydzień”, „Progresja”, „Podsumowanie okresu”, „Ćwiczenia”, „Masa ciała”.
- Arkusz startu: „Inny trening” zostaje na ekranie głównym; w panelu dnia inne nazwy (4.3).
- Ikona „i” → ikona „dzwonek/aktualizacje” albo tekst „Nowości” — NISKIE, do decyzji przy nowym wyglądzie (docs/21 pkt 6).

### 4.5 Przepływy przed/po (najważniejsze; wariant A — wariant B różni się tylko tam, gdzie zaznaczono)

| ID | Dziś | Po | Uwagi |
|---|---|---|---|
| A1 | 1 | 1 | bez zmian |
| A2 „Z szablonu” | 4 | **2** (arkusz → Start przy szablonie) | B: tak samo |
| A3 | 1 (po przewinięciu) | 2 | lista znika; +1 stuknięcie, ale bez przewijania długiego ekranu |
| A7 | 3 + wpis | 1–3 + wpis (kaskada, decyzja 6) | |
| A22 | 2 + 0–2 okna | 2 + 1 okno (rekordy w jednym podsumowaniu, decyzja 7; „Zaktualizować szablon?” zostaje) | |
| B1 | 2 + 2n + 1 | A: 3 + 2n + 1 (Więcej → Szablony); B: bez zmian; z Planowania: 2 + 2n + 1 | |
| B4 | 1 + 2n | 1 + 2n („Planowanie ›” z nagłówka) | |
| B8 NOWY | 14 | 2–3 | ikona przy planie + potwierdzenie |
| B9 | 3 + … (6 wejść) | 2 + … (Planowanie → Wygeneruj; 2 wejścia: Planowanie, Pierwsze kroki) | |
| B11 | 4 | 4 | zakładka Plan zamiast Kalendarz |
| B14 | 2–4 (3 miejsca) | 2–4 (2 miejsca) | |
| C1 szczegóły | 1 (→ Postępy ogólne) | 1 (→ „Ten tydzień — szczegóły”) | |
| C2 | 2 | A: **1** (zakładka Postępy); B: 2 | |
| C4 z Ćwiczeń | 3 | A: 4 (Więcej → Ćwiczenia → ćwiczenie → Postępy) albo 2 z Postępów (szukaj → chip); B: 3 | |
| C10 | 4 + wpis | A: 2 + wpis (Postępy → Masa ciała); B: 3 + wpis | |
| C11 NOWY | — | 0 (kafelki) / 1 (szczegóły) | |
| D4 | 2 (Więcej) | 2 | |
| D9 | 1–4 | A: 2–5 (Więcej → Ćwiczenia); B: bez zmian | czynność rzadka |

### 4.6 Kolejność wdrożenia (małe kroki, każdy osobno testowalny i wydawalny)

1. **Ekran główny — nagłówek planu i „Planowanie ›”, usunięcie „Plan tygodnia” z karty „Dziś” i wiersza „Planowanie ›”** (krok 1 właściciela).
   Testy: `tests/audit-0.10-plan-ui`, `matrix-ui`, scenariusze `.maestro/13`, `18` (literał „Weekly plan” z Kalendarza zostaje, z ekranu głównego
   przez „Planning”). Mały.
2. **Ekran planu: wejście do szablonów** („Szablony ›” w wierszu dnia i w nagłówku) — domyka wymóg 1. Mały.
3. **Arkusz „Inny trening” z listą szablonów ze Startem; usunięcie listy „Zacznij z szablonu”** (krok 3). Testy: `lib/home.ts otherStarts`,
   `StartPanel`, 9 scenariuszy Maestro z „Start from a template” (zmiana na „Other workout” → „Start: X”), `tests/guide.test.tsx` (krok Przewodnika
   i „Pierwsze kroki” krok 4). Średni — głównie E2E.
4. **„Ten tydzień”: 4. kafelek „Objętość”, mała sylwetka, ekran szczegółów „Ten tydzień”** z przeniesieniem „Serie/Objętość per partia” z Postępów;
   estymacja serii do końca tygodnia — tylko gdy badacz potwierdzi regułę (do tego czasu „wykonane vs cel”). Średni.
5. **„Progresja”**: `lib/progression.ts` (porównania tydzień/tydzień, miesiąc/miesiąc z estymacją jako arytmetyką z szablonów — **po decyzji badacza**),
   kafelki, ekran szczegółów z sylwetką per partia. Duży; pełen zakres testów z docs/20.
6. **Porządki wewnątrz ekranów** (4.3): jeden przycisk zakończenia na dole mniej, jedno wejście zamiany, deload bez chipa w Postępach, nazwy w panelu
   dnia, „Pierwsze kroki” 3 kroki, „Miejsca” poza Ustawieniami, przełącznik zachęty usunięty. Każdy punkt osobny commit; małe.
7. **Decyzje 4–7 właściciela** (trening zrobiony wcześniej, wyłączenie planów, kaskada serii, podsumowanie rekordów) — wg docs/18, po scaleniu
   `refactor-store`; niezależne od zakładek.
8. **Zmiana zakładek (wariant A)**: Kalendarz → „Plan”, nowa zakładka „Postępy”, Szablony i Ćwiczenia pod „Więcej”. `TAB_COUNT`, `TAB_ROUTES`,
   `tests/a11y-routes.ts`, 11 scenariuszy Maestro, matrix-i18n (etykiety na 320 pt w 35 językach), wpis „Co nowego”. Osobne wydanie TestFlight, po
   krokach 1–6, żeby w jednym wydaniu nie łączyć nowych sekcji i nowych zakładek.

Szacunek pracy agenta (zasada 09.10): kroki 1–3 i 6 — ok. 1 dzień każdy z pełnym zakresem testów (docs/20) i E2E; krok 4 — 1–2 dni; krok 5 —
2–3 dni po decyzjach badacza; krok 8 — 1–2 dni (większość to E2E i i18n). Czekanie: przebiegi E2E na macOS (po każdym kroku), decyzje właściciela
(pytania niżej), odpowiedzi badacza (krok 5).

---

## 5. Lista [DO WYJAŚNIENIA]

1. **[DO WYJAŚNIENIA — badacz]** Estymacja pozostałych treningów tygodnia (krok 3 pkt 4–5): z czego liczyć objętość i serie niezrobionych jeszcze
   treningów z planu (szablon / „Poprzednio” / średnia ostatnich wykonań) i czy to w ogóle ma podstawy, czy tylko „arytmetyka z szablonu” nazwana
   wprost.
2. **[DO WYJAŚNIENIA — badacz]** Definicja „progresji partii” (próg wzrostu objętości/serii; rola e1RM); jak traktować tydzień deload w porównaniach.
3. Dolny przycisk „Zakończ trening i zapisz” (usunięcie w 4.3): żaden scenariusz `.maestro` go nie używa (sprawdzone grep), ale **20 plików
   testów jednostkowych** (`tests/audit-journey-*`, `audit-0.10-live`, `audit-records-*` i in.) szuka tego tekstu — usunięcie to zmiana w 20 testach.
   **[DO WYJAŚNIENIA]**: czy to argument za wariantem B w pytaniu P3 (zostawić w widoku „Lista”).
4. **[DO WYJAŚNIENIA]** Limit długości etykiet 4 vs 5 zakładek na 320 pt w 35 językach — `tests/matrix-i18n` istnieje, ale nie uruchamiano go w tej sesji
   (maszyna współdzielona).
5. **[DO WYJAŚNIENIA]** Czy makiety układu B (artefakt z 09.10, docs/18-archiwum) przewidywały coś dla „Z szablonu” w arkuszu poza przejściem do
   zakładki — artefakt nieotwierany w tej sesji.

## 6. Pytania do właściciela (pojedynczo, z opcjami)

**P1. Liczba zakładek.** A) 4 zakładki: Trening · Plan · Postępy · Więcej (Szablony i Ćwiczenia pod Więcej) — rekomendacja; B) 5 jak dziś z nazwą
„Plan” zamiast „Kalendarz” i Postępami pod Więcej; C) 5: Trening · Plan · Postępy · Szablony · Więcej (Ćwiczenia pod Więcej, bo to biblioteka).
Kompromis: A najkrótsze drogi do codziennych rzeczy, największa zmiana nawyku; B bez zmiany nawyku, statystyki dalej głęboko; C pośrednie.

**P2. Arkusz „Inny trening” z listą szablonów.** A) lista w arkuszu od dołu (przewijana, foldery) — rekomendacja; B) „Z szablonu” otwiera osobny
pełnoekranowy wybór ze Startem (modal jak „Wybierz ćwiczenie”). Kompromis: A o 1 stuknięcie krócej, B czytelniejsze przy wielu szablonach.

**P3. Dolny przycisk „Zakończ trening i zapisz”.** A) usunąć (zostaje „Zakończ” w nagłówku i w karcie po ostatniej serii) — rekomendacja;
B) zostawić dla widoku „Lista” (bez karty), usunąć w widoku skupionym. Kompromis: B chroni użytkowników listy, którzy kończą od dołu.

**P4. „Pierwsze kroki”.** A) 3 kroki, każdy z jednym przyciskiem prowadzącym do Planowania/Przewodnika — rekomendacja; B) zostawić 4 kroki
i 9 przycisków, tylko poprawić tekst kroku 4. Kompromis: A mniej duplikatów, B mniej pracy.

**P5. Masa ciała.** A) wejście w Postępach (sekcja), link z Ustawień znika — rekomendacja; B) zostaje w Ustawieniach i dochodzi w Postępach
(duplikat). 

**P6. Import CSV z innych dzienników (docs/21 „Przed App Store”).** A) tylko w Kopii zapasowej — rekomendacja na start; B) także krok
w „Pierwszych krokach” („Masz historię z innej aplikacji?”). Kompromis: B pomaga przesiadce (największa bariera wg raportów), ale dokłada krok nowej
osobie bez historii.

**P7. Kolejność wdrożenia.** A) kroki 1–6 (ekran główny i porządki) → decyzje 4–7 → zmiana zakładek jako osobne wydanie — rekomendacja;
B) zakładki od razu w pierwszym kroku (jedno większe wydanie). Kompromis: A dwa wydania TestFlight, mniejsze ryzyko; B szybciej, ale jedno wydanie
z większą zmianą nawyku i więcej E2E naraz.

**P8. Progresja — estymacja.** A) do czasu odpowiedzi badacza pokazywać tylko „wykonane” i „zaplanowane” jako dwie liczby bez sumowania;
B) od razu sumować serie i objętość z szablonów (nazwane „uproszczenie: z szablonu”). Kompromis: A zgodne z zasadą merytoryczną, B szybciej
pokazuje to, czego chce właściciel.

---

## Zasada: zamykanie okien (13.10.2026) — pierwszy wzorzec zasady „to samo działa tak samo”

**Zasada (właściciel, 13.10.2026):** akcje i elementy tego samego typu działają w całej aplikacji tak samo; katalog wzorców: **`docs/32-wzorce-interakcji.md`**. Zamykanie okien to jej pierwszy przypadek:
**każdy ekran wysuwany z dołu / okno modalne (presentation modal, formSheet, sheet, transparentModal; arkusze i `<Modal>` w komponentach) ma widoczny, spójny przycisk zamknięcia w nagłówku** — decyzja 1A
(13.10.2026): **„Anuluj” po lewej** (HIG Sheets, jak edytory na szkicu), ten sam komponent i `testID` `close-modal`, rola „przycisk” dla VoiceOver; gest w dół działa dalej jako dodatek.
Alert systemowy (`Alert.alert`) i inline'owa sekcja „Co nowego” (rozwijana karta, własne „Zamknij”) zasady nie dotyczą.

**Implementacja:** `components/CloseButton.tsx` — `CloseButton`, `useCloseHeader(onClose?)` (opcje nagłówka), `useDismiss()`; rysuje `HeaderButton` z `components/DraftHeader.tsx` (pole 44 pt, limit powiększenia).
Etykieta: istniejące `t('Anuluj')`. **Strażnik:** `tests/close-button-guard.test.tsx` (skan layoutów i źródeł + render każdego okna w PL/EN, jasny/ciemny motyw).

### Wykaz okien (stan przed → po)

| Okno | Plik / sposób | Przed | Po |
|---|---|---|---|
| Wybór ćwiczenia | `app/picker.tsx`, trasa `picker` (modal) | „Anuluj” po prawej (własny kod) | „Anuluj” po lewej (wspólny komponent; blokada podwójnego tapnięcia zachowana) |
| Zamiana ćwiczenia | `app/swap.tsx`, trasa `swap` (modal), także stan „nie da się zamienić” | „Anuluj” po prawej (własny kod) | „Anuluj” po lewej |
| Wybór szablonu | `app/pick-template.tsx`, trasa `pick-template` (modal) | „Anuluj” po prawej (własny kod) | „Anuluj” po lewej |
| Ekran zakupu | `app/paywall.tsx`, trasa `paywall` (modal) | reason=settings: brak przycisku (tylko gest); limit/first: „Nie teraz” na dole | „Anuluj” w nagłówku zawsze; „Nie teraz” (limit, first) zostaje na dole; usunięty zdublowany H1 |
| Arkusz „Inny trening” | `components/StartPanel.tsx`, `<Modal>` od dołu | tło jako ukryty „Zamknij” + „Anuluj” na dole | „Anuluj” po lewej w nagłówku arkusza (tytuł pośrodku); dolny „Anuluj” usunięty; tło zamyka dotykiem, ale nie jest przyciskiem dla VoiceOver |
| Pozostałe trasy | `presentation` nie występuje w innych layoutach ani komponentach | — | strażnik wykrywa każde nowe |

**Przypadki (opis):**
- *Okna wyboru bez zmian do zapisania* (picker, swap, pick-template): „Anuluj” (nie „Zamknij”) — jedna etykieta we wszystkich oknach, po lewej jak w edytorach i HIG Sheets.
- *Ekran zakupu — wymóg Apple:* zamknięcie nie może być ukryte ani mylące. „Anuluj” jest zawsze widoczne w nagłówku, w standardowym miejscu; „Nie teraz” prowadzi w to samo miejsce (wstecz), więc nie jest pułapką.
- *Okna z Zapisz/Anuluj* (edycja sesji, szablonu, ćwiczenia — `DraftHeader`) to zwykłe karty: „Anuluj” po lewej / „Zapisz” po prawej już były spójne z tą zasadą.
