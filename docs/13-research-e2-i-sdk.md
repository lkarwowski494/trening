# 13 Research: E2 „Zamiana ćwiczenia w trakcie treningu” i T-051 „Aktualizacja Expo SDK”

Stan na 03.10.2026. Kod czytany z `/home/claude/trening-wt-integration`, gałąź `integration/0.9.0` (commit df83a34). Nie zmieniałem żadnych plików w repozytorium. Twierdzenia o świecie zewnętrznym mają źródło (lista na końcu, numery w nawiasach [n]). Wszystko, czego nie dało się potwierdzić, jest oznaczone jako **NIEZWERYFIKOWANE**.

---

## W skrócie (dla właściciela)

1. **Zamianę ćwiczenia (E2) ma 10 na 10 badanych aplikacji.** Prawie wszystkie robią to tak samo: „⋯ → Zamień”, na górze 3–5 podobnych ćwiczeń, niżej cała biblioteka. Domyślnie zamiana dotyczy **tylko dzisiejszego treningu**. Część aplikacji pyta przy końcu treningu, czy zapisać ją też w szablonie.
2. **Rekomendacja dla E2 (wariant W1):** zamiana tylko na dziś.
   - Serie już odhaczone zostają przy starym ćwiczeniu (to prawdziwa historia), a nowe ćwiczenie dostaje pozostałe serie.
   - Ciężary nie są przeliczane między ćwiczeniami (dokument 10, pkt 4.6). Wartości przychodzą z historii nowego ćwiczenia według reguły 8c.
   - Propozycje są dobierane z tego, co jest w miejscu treningu, według wzorca ruchu i mięśni. Pierwsze miejsce dostają ćwiczenia, na które już kiedyś zamieniałeś.
   - Zamienniki zapisane w szablonie dla każdego miejsca (W3) to osobny, późniejszy krok, jeśli wybierzesz decyzję 2a.
3. **Expo: stan jest inny niż w opisie zadania.** Aktualna stabilna wersja to **SDK 57** (30.06.2026, React Native 0.86). SDK 58 jest w becie od 15.09.2026. SDK 54 i 55 są już starsze, a SDK 54 dostaje poprawki tylko do wydania SDK 58 [3][4][5].
4. **Apple od 28.04.2026 przyjmuje do App Store Connect (także do TestFlight) tylko aplikacje zbudowane w Xcode 26** — potwierdzone [6][7]. Nasze SDK 52 buduje się w Xcode 16.2, więc **TestFlight jest zablokowany**. Instalacja „ad hoc” na Twoim iPhonie dalej działa.
5. **Rekomendacja dla T-051:** cel **SDK 57**, przejście po jednej wersji na osobnej gałęzi (zalecenie Expo [8]), z punktem kontrolnym na SDK 54. Już SDK 54 odblokowuje TestFlight.
   - SDK 56 i 57 wymagają Xcode 26.4+, którego darmowa maszyna `macos-15` nie ma. Workflowy trzeba przenieść na `macos-26` [9][10].
   - **Stan realizacji (03.10.2026):** M1 = SDK 54 sprawdzony w CI na macOS (B9); SDK 55 → 56 → 57 zrobione na gałęzi `upgrade/sdk-57` i sprawdzone na Linuksie, natywny build SDK 57 na `macos-26` sprawdzony w CI — `ios-unsigned`, build lokalny EAS i E2E 6/6 (B10, „Wyniki CI”); zostaje test na telefonie i scalenie.
6. **Kolejność:** najpierw T-051, a w tym czasie podejmujesz decyzje do E2. Potem implementacja E2 na nowym SDK.
   - **Szacunek:** T-051 to 4–6 sesji, E2 (W1) to 3–4 sesje.
   - Nie łączyć w jednym wydaniu aktualizacji SDK ze zmianą schematu danych — wtedy powrót do poprzedniej wersji aplikacji zostaje bezpieczny.

---

# Część A — E2: zamiana ćwiczenia w trakcie treningu

## A1. Jak robią to inni

Źródło: baza wiedzy `docs/research/kb/*.json` (pole `log_replace_exercise`, ze źródłami) plus świeże sprawdzenie Liftosaur i StrengthLog (03.10.2026).

| Aplikacja | Wejście | Propozycje | Dziś / na stałe | Odhaczone serie, ciężary | Źródło |
|---|---|---|---|---|---|
| Strong | menu ćwiczenia „⋯ → Replace” (też na zegarku od 6.1.0) | brak opisanych propozycji (zwykła biblioteka) | po treningu z szablonu pyta: „Update Template / Update Values Only / Keep Original” | nieopisane; skarga: zamiana gubi notatki ćwiczenia; osobna funkcja „Transfer Exercise Data” przenosi historię zapisaną pod złym ćwiczeniem | [11][12] |
| Hevy | „⋯ → Replace Exercise” z biblioteki | w Hevy Trainer 4 sugerowane alternatywy | w Trainerze wybór: tylko ta sesja / na stałe | nieopisane | [13] |
| Fitbod | przesunięcie w lewo → Replace | sortowanie: najlepsze zamienniki / najczęściej / najrzadziej / nigdy niewykonywane; filtry: Twój sprzęt, bez sprzętu, ten sam / inny sprzęt | zamiana wpływa na algorytm jako preferencja | — | [14] |
| Alpha Progression | Replace | lista podobnych (np. inny sprzęt, gdy maszyna zajęta) albo wyszukiwanie | na końcu treningu pytanie: zastosować w planie czy tylko dziś | cele zachowane, gdzie się da | [15] |
| Liftosaur | koło zębate → Swap Exercise | zakładki „Ad-hoc” i „From Program”; sekcja „Recent” = 5 ostatnich zamian **dla tego ćwiczenia**; ćwiczenia już obecne w treningu wyszarzone | „A swap changes this workout only. The program stays as it was.” | „Sets you already completed keep their numbers”; nowe ciężary liczone z historii nowego ćwiczenia (seria najbliższa celem powtórzeń) albo z 1RM / domyślnego ciężaru | [16] |
| StrengthLog | przesunięcie → „change” | „w prawie każdym przypadku kilka alternatyw”, plus pełna lista | — | ciężary zostają z pierwszego ćwiczenia, dopóki nie pobierzesz ich z historii albo nie ustawisz 1RM nowego (sami przyznają, że to kłopot) | [17] |
| JEFIT | „⋯ → Swap Exercise” | od 17.0.9 (VI 2026) podpowiedzi uwzględniające kontuzje; plan adaptacyjny trzyma ten sam wzorzec ruchu | — | — | [18] |
| Boostcamp | ikona zamiany | alternatywy trenera albo dowolne ćwiczenie | pyta: tylko dziś / przyszłe treningi (recenzja: „zapisz na przyszłość” działa w połowie przypadków) | ciężary przechodzą na zamiennik | [19] |
| SmartGym | „Alternative exercise” (7.4) | najbardziej podobne, przefiltrowane listą sprzętu z rutyny; od 7.6 wyszukiwanie | alternatywa = tylko ta sesja; „Edit → Replace Exercise” = na stałe | — | [20] |
| Caliber | z treningu albo szablonu (płatne) | lista filtrowana mięśniem głównym, od 5.14 sortowana popularnością | po treningu pytanie o zapis w szablonie | — | [21] |

### Wnioski

- **Wejście:** zawsze z menu ćwiczenia, jednym-dwoma stuknięciami. U nas dodatkowo naturalne miejsce to plakietka „brak sprzętu w: Dom”, gdzie dokument 10 (pkt 4.3) już przewiduje przycisk „Zamień”.
- **Propozycje:**
  - kryteria: ten sam mięsień główny (Caliber), ten sam wzorzec ruchu (JEFIT), dostępny sprzęt (Fitbod, SmartGym), historia użytkownika (Fitbod „most logged”, Liftosaur „Recent”);
  - zawsze jest też droga do pełnej biblioteki.
- **Zakres:** domyślnie **tylko dziś** (Liftosaur, SmartGym, Hevy). „Na stałe” jest albo osobną akcją, albo pytaniem na końcu treningu (Strong, Alpha, Caliber, Boostcamp). Boostcamp pokazuje, że „zapisz na przyszłość” bywa zawodne.
- **Ciężary:** najlepiej robi to Liftosaur — wartości z historii **nowego** ćwiczenia. StrengthLog przenosi ciężary 1:1 i sam przyznaje, że to problem. To zgadza się z naszą zasadą „bez przeliczania między wariantami”.
- **Odhaczone serie:** tylko Liftosaur opisuje wprost: zostają.
- **Superserie i przerwy:** nikt nie opisuje szczegółów. U nas trzeba to zaprojektować samodzielnie.

## A2. Jak to pasuje do naszego modelu (stan kodu)

- **Blok ćwiczenia** `WExercise` (`lib/seed.ts:85`) ma pola:
  - `id`, `exerciseId`, `restSec`, `repMin`, `repMax`, `groupId` (superseria), `sets`;
  - `tplItemId` (pozycja szablonu, z której powstał blok);
  - `impl` (przyrząd — decyzja 8c, schemat 15).
- **Wybór ćwiczenia** (`app/picker.tsx`):
  - ma tryby `active`, `template:<id>` i `edit:<klucz>`;
  - już filtruje po miejscu (`availability`, przełącznik „Pokaż wszystkie” zapamiętany w `settings.pickerShowAll`);
  - tryb zamiany to czwarty cel, np. `swap:<blockId>`.
- **„Poprzednio” i wstępne wartości** (`previousBlockFor(exId, k, n, tplItemId, tplId, impl)`, `lib/store.ts:499`):
  - reguła 8c: ostatni raz **tym samym przyrządem** (albo nieznanym), gdziekolwiek;
  - dobór bloku po pozycji szablonu (`tplItemId`), potem po numerze wystąpienia `k`;
  - bezpiecznik M3 (`prevFromOther` + `offListAt`): ciężar „spoza listy” z innego, znanego miejsca albo innym, znanym przyrządem nie trafia do pól.
- **Start z szablonu** (`startFromTemplate`, `lib/store.ts:703`) pokazuje wzorzec wypełniania serii z „Poprzednio” z bezpiecznikiem M3. Zamiana powinna użyć **tej samej** logiki. Dziś jest wpisana w środek funkcji, więc trzeba ją wydzielić.
- **Przyrząd bloku:** `stampImpl(e, locationId)` liczy przyrząd w miejscu. `setActiveLocation` i `locationEquipChanged` przeliczają przyrząd tylko w blokach bez odhaczonych serii (reguła L5). Zamiana dziedziczy to za darmo.
- **Podpowiedź „↑ spróbuj X”** (`progressionFor(ex, repMax, prev, listLocFor(e, loc))`) działa per ćwiczenie i miejsce, więc po zamianie liczy się od nowa dla zamiennika.
- **Superserie:** `restAfter` liczy rundy po liczbie zrobionych serii roboczych każdego członka grupy. `normalizeGroups` pilnuje spójności grup. Dokument 10 już postanowił: „przy zamianie zachować `groupId` i `tplItemId`”.
- **Timery** trzymają `setId`, nie indeksy:
  - przy usuwaniu bloku ekran zatrzymuje stoper i przerwę tego bloku (`dropTimers`) — zamiana musi zrobić to samo dla serii, które znikają;
  - podtytuł Live Activity powstaje w `lib/timer.ts` — **do sprawdzenia** przy wdrożeniu, czy po zamianie nie pokazuje starej nazwy.
- **Historia:** przy zapisie i migracji (`migrate`, `lib/store.ts:252`) w zakończonych treningach zostają tylko odhaczone serie, a bloki bez nich znikają. Pusty blok po zamianie sam się więc nie zapisze.
- **Szablony** `TemplateItem` nie mają dziś zamienników. Dokument 10 (pkt 3.3) planuje `TemplateItem.alternates?: { [locationId]: exerciseId }` na E2.
  - Decyzja 2 (jeden szablon z zamiennikami vs osobne szablony dom/siłownia) jest **wciąż otwarta**.
  - Od decyzji 03.10, 08:11 („szablony ustawiam sam”) aplikacja nie może sama zmieniać szablonów.
- **Edytor historii** (`lib/edit.ts`) ma `draftAddExercise` i `draftRemoveExercise`. Zamiany w nim nie ma i w E2 nie jest konieczna (patrz decyzja D6).
- **„Powtórz ostatni”** kopiuje to, co faktycznie zrobiono, czyli po zamianie powtórzy zamiennik — zgodnie z zasadą z rundy 2.
- **Znane ryzyko E1:** „Przyrząd wybiera miejsce, nie użytkownik” — np. RDL w domu z hantlami i ViShape zawsze zapisze się jako hantle. Dokument 10 odkłada wybór przyrządu per blok właśnie do E2.

## A3. Trzy warianty

### W1 — „Zamień tylko dziś” (rekomendowany na teraz)

**Jak działa (dla użytkownika):**
1. W bloku ćwiczenia jest przycisk „⇄ zamień”. Ten sam przycisk pojawia się przy plakietce „brak sprzętu w: Dom”.
2. Otwiera się arkusz:
   - na górze 3–4 propozycje, każda z jedną linijką „dlaczego”, np. „ten sam ruch · hantle · robione 12×”;
   - przycisk „Cała biblioteka” prowadzi do obecnego wyboru ćwiczenia z filtrem miejsca.
3. Po wyborze:
   - **Nic jeszcze nie odhaczone:** blok zmienia ćwiczenie w miejscu. Ta sama liczba serii, ten sam zakres powtórzeń. Wartości z historii zamiennika według reguły 8c, z bezpiecznikiem M3.
   - **Część serii odhaczona:** stare ćwiczenie zostaje z odhaczonymi seriami. Tuż pod nim pojawia się zamiennik z pozostałymi seriami.
4. Pod nazwą zamiennika widać linijkę: „zamiast: Bench Press (sztanga) · ostatnio 3×8 @ 80 kg” (pkt 4.6 dokumentu 10 — kontekst, bez przeliczania).
5. Dopóki w zamienniku nic nie odhaczono, jest „↺ cofnij zamianę”.
6. Szablon zostaje bez zmian. Następny start z szablonu znowu pokaże oryginał.

**Plusy:**
- zgodne z większością aplikacji i z decyzją 08:11 (aplikacja nie zmienia szablonów);
- nie wymaga decyzji 2;
- mało nowych danych.

**Minusy:**
- jeśli w domu zawsze zamieniasz to samo, robisz to przy każdym treningu. Łagodzi to ranking „ostatnio zamieniane na” (jak „Recent” w Liftosaur).

### W2 — W1 + pytanie przy „Zakończ”: „Zapisać zamianę w szablonie?”

Na wzór Strong, Alpha i Caliber: przy końcu treningu z szablonu, w którym była zamiana, pytanie „Zastąp w szablonie: A → B” / „Zostaw szablon”.

- **Plusy:** jedna stała zmiana bez wchodzenia do edytora; użytkownik sam decyduje, więc nie łamie decyzji 08:11.
- **Minusy:**
  - zmiana na stałe dotyczy szablonu we wszystkich miejscach. To jest właśnie problem „Legs — dom / siłownia” z decyzji 2.
  - dodatkowe okno przy „Zakończ”, gdzie już jest kilka ostrzeżeń.
  - Boostcamp ma z tym błędy w praktyce [19].

### W3 — W1 + zamienniki per miejsce w szablonie (`TemplateItem.alternates`)

Przy zamianie trzeci przycisk: „Zawsze w: Dom”. Zapisuje „w miejscu Dom zamiast A robię B” w pozycji szablonu.

Przy następnym starcie z szablonu w Domu blok A pokazuje podpowiedź „W Domu zwykle: B — zamienić?” (jedno stuknięcie). **Nigdy nie zamienia sam** — pkt 4.3 dokumentu 10: „Nigdy automatyczna zamiana”. W edytorze szablonu przy pozycji widać „Dom: B”, z możliwością usunięcia.

- **Plusy:** rozwiązuje decyzję 2 wariantem (a): jeden szablon zamiast dwóch, bez dublowania edycji. Pasuje do już zaprojektowanego pola `alternates`.
- **Minusy:**
  - nowe pole w szablonie, czyli schemat 16, migracja i kopie;
  - edytor szablonu do rozbudowy;
  - wymaga Twojej decyzji 2;
  - więcej przypadków brzegowych: usunięte miejsce, usunięte ćwiczenie, to samo ćwiczenie dwa razy w szablonie.

### Porównanie

| | W1 | W2 | W3 |
|---|---|---|---|
| Wysiłek (sesje) | 3–4 | +1 | +2–3 |
| Zmiana schematu | opcjonalnie (pole w bloku) | jak W1 | tak (schemat 16) |
| Wymaga decyzji 2 | nie | nie (ale ją komplikuje) | tak, wariant (a) |
| Zgodność z „szablony ustawiam sam” | pełna | pełna (pyta) | pełna (zapis tylko na Twoje stuknięcie) |
| Ryzyko błędów | niskie | średnie | średnie |

**Rekomendacja:** W1 teraz. W3 jako „E2b”, jeśli w decyzji 2 wybierzesz (a). W2 tylko wtedy, gdy zostajesz przy osobnych szablonach dom/siłownia i chcesz łatwo przepisywać jeden z nich.

## A4. Szczegóły rekomendowanego W1 (do implementacji)

### Dane

1. **`WExercise.swappedFrom?: string`** — id ćwiczenia, które zastąpiono (tylko w bloku-zamienniku). Służy do:
   - linijki „zamiast: …”;
   - „cofnij zamianę”;
   - rankingu „ostatnio zamieniane na” — liczony z historii: bloki z `swappedFrom === A`. Dlatego warto, żeby pole trafiało do zapisanego treningu.

   `migrate()` musi je czyścić tak jak `impl`: tylko niepusty tekst id, inaczej `delete`. Sam `migrate` nie wycina nieznanych pól bloku, ale ich też nie sprawdza.
2. **`tplItemId` i `groupId`** przechodzą na zamiennik (decyzja z dokumentu 10).
   - Skutek dla „Poprzednio”: `previousBlockFor(B, …, tplItemId, tplId, impl)` najpierw znajdzie ostatni raz, gdy **B było zamiennikiem na tej samej pozycji szablonu**. Tego się chce: „ostatnio w Domu zamiast sztangi robiłem hantle 3×10 @ 22”.
   - **Pułapka (do testu):** jeśli B występuje w tym samym szablonie także jako własna pozycja Y, reguła z rund 11/13 w `selectBlock` może zwrócić `null`. Sesja tego szablonu bez pozycji X, a wszystkie jej pozycje wciąż są w szablonie — wtedy zamiennik byłby bez „Poprzednio”. Rozwiązanie do wyboru przy implementacji: dla bloku z `swappedFrom` nie przekazywać `tplId` do reguły „pominięta pozycja” (wtedy fallback do zwykłego doboru).
3. **`impl` zamiennika** = `stampImpl(B, locationId)`.
4. **Opcjonalnie (decyzja D5): przyrząd wybrany ręcznie.** Ćwiczenia z kilkoma źródłami obciążenia (RDL hantle|wyciąg, Goblet hantel|kettle, T-Bar sztanga|maszyna — `loadKindsFor`) mogą w tym samym arkuszu dostać pozycję „Ten sam ruch, inny przyrząd: linki”.
   - Potrzebna flaga `implPinned?: true`, żeby `restampUntouched` jej nie nadpisał.
   - Rozwiązuje ryzyko z E1 i jest wprost odłożone do E2 w dokumencie 10.

### Schemat

- Samo `swappedFrom` jest polem opcjonalnym, które starsza wersja aplikacji zignoruje. Projekt podnosił jednak schemat przy każdym nowym polu (14 → 15 dla `impl`).
- Rekomendacja: **schemat 16 dopiero z W3** (`alternates` w szablonie). W1 bez podnoszenia schematu, z sanityzacją pola i testem eksport → import.
- To decyzja techniczna. Jeśli wolisz trzymać konwencję „każde pole = nowy schemat”, wystarczy jedno słowo.

### Ranking propozycji (czysta funkcja, np. `lib/swap.ts`)

**Kandydaci:**
- widoczne ćwiczenia bez bieżącego;
- tylko z tym samym „rodzajem wyniku” (`metric`: ciężar+powtórzenia / czas / dystans — plank nie podpowie przysiadu);
- domyślnie tylko dostępne w miejscu (`availability`), z przełącznikiem „Pokaż wszystkie” jak w wyborze.

**Punkty** (wagi do strojenia; pierwsza propozycja):

| Kryterium | Punkty |
|---|---|
| ten sam wzorzec ruchu z katalogu (`pattern`: h_push, v_pull, squat, hinge…) | +3 |
| wzorzec `isolation` / `other` | liczy się tylko przy zgodnym mięśniu głównym (inaczej uginanie ramion = wznosy bokiem) |
| wspólny mięsień główny (`muscles`) | +3, a ten sam pierwszy mięsień +1 |
| ta sama partia (`group`) | +1 |
| wspólne mięśnie pomocnicze | +1 za każdy, maks. 2 |
| wcześniej zamieniane z tego ćwiczenia (`swappedFrom` w historii — „Recent” Liftosaur) | +4 |
| ćwiczenie z historią u Ciebie (Fitbod „most logged”) | +1 |

- **Remis:** liczba sesji z ćwiczeniem, potem nazwa.
- **Ćwiczenia własne** (bez `pattern`) — tylko mięśnie i partia.
- **Pokazujemy 3–4 najlepsze.** Ćwiczenia już obecne w treningu dostają dopisek „już w treningu” (Liftosaur je wyszarza) — nie blokujemy.

**Test akceptacyjny rankingu:** tabela „ćwiczenie → oczekiwane top-3” dla ok. 10 typowych przypadków, w Twoim Domu i w Pełnej siłowni, przejrzana przez Ciebie (patrz decyzja D7). Przykłady:
- Bench Press (sztanga) w Domu → Bench Press (hantle), Push Up, …
- Lat Pulldown w Domu → podciąganie na drążku, …

### Zasady zachowania (przypadki brzegowe)

| # | Sytuacja | Zachowanie |
|---|---|---|
| 1 | Blok bez odhaczonych serii | zamiana w miejscu: nowe `exerciseId`, `impl` od nowa, ta sama liczba serii i rodzaje (rozgrzewka zostaje rozgrzewką), `repMin`/`repMax` bez zmian; wartości z historii B jak przy starcie z szablonu (wspólna, wydzielona funkcja + M3 + `markPre`); **wartości A nie przechodzą** (ani wpisane ręcznie, ani podpowiedziane — inne ćwiczenie, pkt 4.6) |
| 2 | Część serii odhaczona | „podział”: A zostaje tylko z odhaczonymi seriami; B wstawione tuż pod A z seriami nieodhaczonymi (min. 1), wartości jak w 1 |
| 3 | Wszystkie serie odhaczone | zamiana dodaje B pod A z jedną serią (albo przycisk ukryty — decyzja D3) |
| 4 | Superseria | B dziedziczy `groupId`; A z samymi odhaczonymi seriami zostaje w grupie. Analiza `restAfter`: blok bez nieodhaczonych serii nie blokuje przerwy ani zamknięcia rundy, ale **musi to pokryć test** (A1-B1-A2 → podział A → przerwa po rundzie, odhaczanie poza kolejnością) |
| 5 | Przerwa: `restSec` | zostaje przerwa bloku (z pozycji szablonu albo ustawiona „tylko teraz”). Alternatywa: przerwa zapamiętana dla B (`restFor(B)`) — decyzja D4 |
| 6 | Trwa stoper serii nieodhaczonej, która znika | zatrzymać jak przy „usuń” (`dropTimers`); trwająca przerwa po odhaczonej serii A trwa dalej (seria zostaje w A) |
| 7 | Live Activity | po zamianie odświeżyć podtytuł, jeśli zawiera nazwę ćwiczenia (**do sprawdzenia** w `lib/timer.ts`) |
| 8 | B już jest w treningu | dozwolone, dopisek w propozycjach; zmienia się numeracja wystąpień `k` innych bloków B → test „Poprzednio” dla obu |
| 9 | Cofnięcie | „↺ cofnij zamianę”, dopóki B nie ma odhaczonych serii: w przypadku 1 → blok wraca do A (wartości liczone od nowa); w przypadku 2 → serie B wracają do bloku A nad nim (scalenie), B znika |
| 10 | Zamiana zamiennika (A→B→C) | C dostaje `swappedFrom = A` (oryginał z szablonu), żeby „cofnij” i ranking wskazywały pozycję szablonu |
| 11 | Zmiana miejsca „📍” po zamianie | istniejąca reguła L5: B bez odhaczonych serii dostaje przyrząd od nowa |
| 12 | „Zakończ” z pustym B | jak dziś: blok bez odhaczonych serii nie trafia do historii |
| 13 | „Powtórz ostatni” | powtarza to, co zrobiono (B; przy podziale także A z jego seriami — zgodne z rundą 2, ale może dziwić → decyzja D8) |
| 14 | Rekordy, objętość, Apple Health | per ćwiczenie, bez zmian w kodzie |
| 15 | Ćwiczenie usunięte (zarchiwizowane) w trakcie | nie proponować; blok „Usunięte ćwiczenie” ma tylko „usuń” |

## A5. Decyzje dla właściciela (rekomendacja pierwsza)

| # | Pytanie | Opcje |
|---|---|---|
| D1 | Zakres E2 | **(a) W1 teraz, W3 później** · (b) W1+W2 · (c) od razu W1+W3 |
| D2 | Decyzja 2 z dokumentu 10 (jeden szablon + zamienniki per miejsce vs osobne szablony dom/siłownia) | (a) jeden szablon + zamienniki (potrzebne do W3) · (b) osobne szablony, W3 niepotrzebne. **Bez tej decyzji tylko W1** |
| D3 | Zamiana, gdy wszystkie serie odhaczone | **(a) przycisk ukryty** (to już nie zamiana, tylko „+ ćwiczenie”) · (b) dodaje zamiennik z 1 serią |
| D4 | Przerwa po zamianie | **(a) zostaje przerwa z planu / bloku** · (b) przerwa zapamiętana dla nowego ćwiczenia |
| D5 | „Ten sam ruch, inny przyrząd” w tym samym arkuszu (RDL hantle ↔ linki itp.) | **(a) tak** (rozwiązuje znane ryzyko E1, +0,5–1 sesji) · (b) później |
| D6 | Zamiana w edytorze historii | **(a) nie w E2** — tam to poprawka pomyłki („zapisałem pod złym ćwiczeniem”), czyli przeniesienie odhaczonych serii; osobna funkcja jak „Transfer Exercise Data” w Strong · (b) tak |
| D7 | Przejrzenie tabeli „top-3 propozycji” dla ok. 10 ćwiczeń w Twoim Domu i Pełnej siłowni przed wydaniem | **(a) tak** · (b) nie |
| D8 | „Powtórz ostatni” po podziale bloku | **(a) jak dziś — powtarza wszystko, co zrobiono** · (b) pomija niepełny blok A, gdy jest jego zamiennik |

> **04.10.2026 — decyzje właściciela:** **D1 (c)** — od razu W1 + W3 (zamienniki per miejsce w szablonie, schemat 16);
> **D2 (a)** — jeden szablon + zamienniki per miejsce (to także decyzja 2 z dokumentu 10); **D3 (a)** — przycisk ukryty, gdy wszystkie
> serie odhaczone; **D4 (a) z dopiskiem** — „przerwa z planu, ale użytkownik powinien mieć zawsze możliwość zmiany przerwy w szablonie
> dla danego ćwiczenia”; **D5 (a)** — „ten sam ruch, inny przyrząd” w E2; **D6 (b)** — zamiana także w edytorze historii, w E2;
> **D7 (a)** — tabela top-3 propozycji do przejrzenia przed wydaniem; **D8 (a)** — „Powtórz ostatni” powtarza wszystko, co zrobiono.
>
> Skutki dla planu (do rozpisania przed implementacją):
> - D1 (c) + D2 (a): zakres rośnie z 3–4 do ok. 5–7 sesji (A3, „Porównanie”: W3 +2–3); schemat 16 z migracją i kopiami —
>   zgodnie z B/„Kolejność” osobne wydanie po scaleniu SDK 57, nie razem z aktualizacją SDK.
> - D4: dziś edytor szablonu ma już pole „przerwa s” przy każdej pozycji (`app/template/[id].tsx`, `TemplateItem.restSec`; puste =
>   przerwa z ćwiczenia), więc dla W1 wymaganie jest spełnione. **Otwarte (W3):** czy zamiennik per miejsce („Dom: B”) ma własne
>   pole przerwy — (a) tak, opcjonalne, puste = przerwa pozycji; (b) nie, zawsze przerwa pozycji. Do decyzji właściciela.
> - D6 (b): w edytorze historii zamiana = przeniesienie serii zapisanych pod złym ćwiczeniem (inne zasady niż w trakcie treningu:
>   przenosi odhaczone serie, wpływa na rekordy, „Poprzednio” i statystyki) — wymaga własnej specyfikacji i testów przed kodem.

## A6. Plan wdrożenia i testów (W1)

**Kroki:**

1. **`lib/swap.ts`** — czyste funkcje:
   - `swapCandidates(ex, ctx)` zwraca ranking z uzasadnieniem;
   - `swapBlock(ei, exId, opts)` w `lib/store.ts` obsługuje przypadki 1/2/9/10;
   - `undoSwap(blockId)`.
2. **Wydzielenie** z `startFromTemplate` funkcji `prefillSets(ex, n, kinds, prev, locationId, impl)` — wspólnej dla startu i zamiany (jedno miejsce reguły M3).
3. **`migrate`:** sanityzacja `swappedFrom` (i `implPinned`, jeśli D5a).
4. **UI:**
   - przycisk „⇄ zamień” w `ActiveWorkout.tsx`, także przy plakietce braku sprzętu;
   - arkusz propozycji;
   - tryb `swap:<blockId>` w `app/picker.tsx` (filtr miejsca jak w `active`);
   - linijka „zamiast: …”, „↺ cofnij zamianę”;
   - i18n PL/EN (`check:i18n`).
5. **Dokumentacja:** sekcja „Implementacja E2” w `docs/10-miejsca-i-sprzet.md`, wiersz w `docs/09-plan-testow.md`.

**Testy jednostkowe** (`tests/swap.test.ts(x)`, jest + RNTL):
- **ranking:**
  - właściwość fast-check „żaden kandydat nie jest bieżącym ćwiczeniem; wszystkie mają ten sam rodzaj wyniku; przy filtrze — wszystkie dostępne w miejscu”;
  - tabela top-3 (D7);
  - bonus „ostatnio zamieniane”;
  - ćwiczenia własne bez wzorca;
- **zamiana w miejscu:** liczba i rodzaje serii, `repMin`/`repMax`, `impl` od nowa, wartości z historii B (8c), bezpiecznik M3 (32 kg z siłowni nie trafia do pól w Domu), żadna wartość A w B;
- **podział:** A ma tylko odhaczone serie, B pod A z resztą, `tplItemId`/`groupId` zachowane;
- **superseria:** przerwa po rundzie i odhaczanie poza kolejnością po podziale (regresja rund 72 i 75);
- **timery:** stoper usuwanej serii zatrzymany, przerwa trwa;
- **cofnięcie:** w miejscu i scalenie po podziale; A→B→C→cofnij;
- **„Poprzednio”:**
  - B jako zamiennik na tej samej pozycji szablonu w kolejnej sesji;
  - pułapka „B też własną pozycją szablonu” (pkt A4.2);
  - duplikat B w treningu;
- **trwałość:** `migrate` idempotentne z `swappedFrom`, eksport → import, restart w trakcie treningu (klucz „live”);
- **bez miejsc:** zamiana działa, bez filtra i bez `impl` (bit w bit jak dziś poza nową funkcją).

**Maestro E2E — nowy scenariusz `.maestro/07-zamiana.yaml`** (wzór: `06-miejsca.yaml`; pamiętać o lekcji z commita 1fba61a — nawiasy w id escapować `\(`):
1. Ustawienia → Miejsca → dodaj „Dom” (ławka regulowana, hantle; bez sztangi) jako główne.
2. Start pustego treningu → „+ Dodaj ćwiczenie” → „Pokaż wszystkie” → „Bench Press (sztanga)”.
3. Sprawdź plakietkę „brak sprzętu w: Dom” → stuknij „⇄ zamień” → wśród propozycji widać „Bench Press (hantle)” → wybierz.
4. Sprawdź: nazwa „Bench Press (hantle)”, linijka „zamiast: Bench Press (sztanga)”, ta sama liczba serii.
5. „↺ cofnij zamianę” → wraca „Bench Press (sztanga)” → zamień ponownie.
6. Dodaj drugie ćwiczenie z 3 seriami, odhacz 1 serię → zamień → sprawdź: oryginał z 1 odhaczoną serią, pod nim zamiennik z 2 seriami.
7. Odhacz serię zamiennika → „Zakończ” → w historii oba ćwiczenia z właściwymi seriami.
8. Zrzuty ekranu jak w innych scenariuszach.

**Szacunek W1: 3–4 sesje.**
- 1: logika, ranking i testy jednostkowe;
- 2: UI, tryb wyboru, i18n i testy ekranu;
- 3: E2E i niezależny audyt;
- (+0,5–1) D5 „inny przyrząd”.

W3 to dodatkowe 2–3 sesje.

---

# Część B — T-051: aktualizacja Expo SDK

## B1. Fakty (sprawdzone 03.10.2026)

| Fakt | Stan | Źródło |
|---|---|---|
| Wymóg Apple | od **28.04.2026** wysyłka do App Store Connect tylko z **Xcode 26+** i SDK iOS 26 (dotyczy też TestFlight, bo idzie przez App Store Connect) | [6][7] |
| Nowszy wymóg (Xcode 27) | **nie ogłoszony** na stronie Apple. Wzorzec z lat poprzednich sugeruje kwiecień 2027 — **NIEZWERYFIKOWANE** | [6] |
| Stanowisko Expo wobec wymogu | SDK 54 i 55: domyślny obraz EAS z Xcode 26, „no action required”. SDK ≤53: można wymusić obraz z Xcode 26, ale „not all SDK versions will be compatible”, zalecają co najmniej SDK 54 | [7] |
| Wersje SDK (tabela Expo) | 54 → RN 0.81 / React 19.1 / Xcode 16.1+; 55 → RN 0.83 / React 19.2 / Xcode **26.2+**; 56 → RN 0.85 / React 19.2 / Xcode **26.4+** / iOS **16.4+**; 57 → RN 0.86 / React 19.2.3 / Xcode **26.4+** / iOS 16.4+ / Node 22.13+ | [3] |
| Daty wydań | 55: 25.02.2026; 56: 21.05.2026; 57: **30.06.2026** (stabilne, najnowsze); 58: **beta od 15.09.2026** (RN 0.88 RC, iOS 27, Xcode 27, cykl życia UIScene domyślnie) | [2][4][5][22] |
| Okres wsparcia SDK | „około roku”; SDK 54 dostaje krytyczne poprawki do wydania następnego SDK (IX/X 2026). SDK 52 (XI 2024) jest więc poza wsparciem — wniosek z tej reguły | [4] |
| Nowa architektura | SDK 53 włączył ją domyślnie (z React 19). SDK 54 to **ostatnie** z obsługą starej architektury. W SDK 55 starą usunięto, a opcję `newArchEnabled` wycięto z app.json | [23][24][2] |
| Biblioteki natywne w starym stylu | RN 0.82+: „We will keep the interop layers in the codebase for the foreseeable future” — moduły „mostkowe” dalej działają przez warstwę zgodności, bez daty usunięcia | [25] |
| Zalecana ścieżka Expo | „We recommend upgrading SDK versions incrementally, one at a time”; kroki: `npm install expo@^N`, `npx expo install --fix`, `npx expo-doctor`; przy CNG skasować `ios/` | [8] |
| Obrazy EAS (chmura) | `sdk-55` = macos-sequoia-15.6-xcode-26.2; `sdk-56` = macos-tahoe-26.4-xcode-26.4; `sdk-57` = `latest` = macos-tahoe-26.5-xcode-26.6; `sdk-58` = Xcode 27.0. `sdk-54` = macos-sequoia-15.6-xcode-26.0 (dopisane 03.10.2026 przy realizacji, B9) | [26][7] |
| Darmowe maszyny GitHub: `macos-15` (obraz 20260907) | Xcode 16.0–16.4 (domyślny 16.4) **oraz 26.0.1, 26.1.1, 26.2, 26.3** — brak 26.4+ | [9] |
| `macos-26` (obraz 20260907; etykieta `macos-latest`) | Xcode 26.0.1 … 26.4.1, 26.5, **26.6 (domyślny)**; symulatory iOS 26.2/26.4/26.5 (iPhone 17, brak iPhone 16); CocoaPods 1.17.0, Fastlane 2.239.0, xcbeautify 3.2.1 | [10][27] |
| `macos-14` | wycofywany: od 06.07.2026, całkowicie nieobsługiwany od 02.11.2026 (nas nie dotyczy — używamy `macos-15`) | [28] |
| Koszt | „GitHub Actions usage is free for … public repositories that use standard GitHub-hosted runners” — także macOS | [29] |

**Co z tego wynika dla nas:**
- **TestFlight:** nie da się wysłać buildu z SDK 52, bo buduje się w Xcode 16.2.
- **Instalacja ad hoc** (workflow `iphone-local.yml`, `iphone-eas.yml`) nie idzie przez App Store Connect, więc dalej działa na Xcode 16.2. To nie jest blokada Twoich testów na telefonie.
- **Zależność od obrazu `macos-15`:** ma on dziś Xcode 16.2, ale nie ma gwarancji, jak długo — **NIEZWERYFIKOWANE**. README obrazów mówi „only one major version of Xcode will be supported per macOS version”, a `macos-15` ma jednocześnie 16.x i 26.x.

## B2. Który SDK docelowo

| Cel | Za | Przeciw |
|---|---|---|
| 54 | najmniejszy skok; buduje się na `macos-15` z Xcode 26.x; odblokowuje TestFlight | wsparcie kończy się przy wydaniu SDK 58 (tygodnie) — następna aktualizacja zaraz |
| 55 | Xcode 26.2/26.3 jest na `macos-15` (nie trzeba zmieniać maszyny) | ok. 7 miesięcy; i tak kolejny skok wkrótce |
| **57** | **najnowsze stabilne**, wsparcie do ok. VI 2027; Expo deklaruje 56 → 57 jako zmianę bez przełomowych różnic | trzeba przejść na `macos-26` (Xcode 26.4+); iOS minimum 16.4; więcej skoków |
| 58 | najdłuższe wsparcie | **beta** (RN 0.88 RC) — nie na produkcję; Xcode 27, nowy cykl życia (SceneDelegate) |

**Rekomendacja: SDK 57**, po jednej wersji (52 → 53 → 54 → 55 → 56 → 57) na gałęzi `upgrade/sdk-57`, z punktem kontrolnym **M1 = SDK 54**. Na M1 zrób pełną weryfikację i pierwszy upload do TestFlight. Jeśli zabraknie czasu, można się na M1 zatrzymać i mieć działający TestFlight.

SDK 58 dopiero po wydaniu stabilnym i 1–2 poprawkach (osobne zadanie: Xcode 27 + UIScene).

## B3. Inwentarz zależności (`package.json`) i zgodność z SDK 57

Wersje docelowe z `bundledNativeModules.json` pakietu `expo@57.0.26` (porównane z 52.0.49 / 54.0.37 / 55.0.31) — sprawdzone pobraniem paczek z npm 03.10.2026.

| Pakiet | Teraz | SDK 57 | Ocena | Uwagi |
|---|---|---|---|---|
| expo | ~52.0.0 | ~57.0.x | podbicie | od SDK 55 pakiety Expo mają numer = SDK (np. `^57.0.0`) [2] |
| react-native | 0.76.9 | 0.86.x | **przełomowe** (pośrednio) | RN 0.82+: tylko nowa architektura; u nas `newArchEnabled: true` już jest, więc sam przełącznik nas nie dotyczy. Usunąć klucz z app.json przy SDK 55 [2] |
| react / react-dom | 18.3.1 | 19.2.3 | **przełomowe** | React 19: `react-test-renderer` przestarzały [30]; typy `@types/react` 19 zaostrzają kilka rzeczy (np. `useRef` wymaga argumentu). W naszym kodzie nie znalazłem `defaultProps`, `propTypes`, `useRef()` bez argumentu ani głębokich importów `react-native/Libraries` (grep) |
| expo-sqlite | ~15.1.0 | ~57.0.3 | podbicie | używamy `openDatabaseAsync`, `deleteDatabaseAsync`, `defaultDatabaseDirectory`, `SQLiteDatabase` — wszystkie są w 57.0.3 (sprawdzone w paczce). SDK 56: zmiana typu bloba na `ArrayBuffer` — nie używamy blobów [1] |
| expo-file-system | ~18.0.0 | ~57.0.7 | **przełomowe API** | od SDK 54 domyślny import to nowe API, a stare funkcje (`readAsStringAsync`, `writeAsStringAsync`, `deleteAsync`, `getInfoAsync`, `makeDirectoryAsync`, `readDirectoryAsync`) **„will throw in runtime”** (sprawdzone w `legacyWarnings.d.ts` 57.0.7). Stare API jest dalej pod `expo-file-system/legacy` (w 57 też). Minimalna poprawka: 3 importy (`lib/store.ts`, `lib/backup.ts`, `lib/signing.ts`) + mock w `tests/setup.js` na `expo-file-system/legacy`. Przepisanie na `File`/`Directory` — osobno, później [31][1] |
| expo-notifications | ~0.29.0 | ~57.0.21 | podbicie | `SchedulableTriggerInputTypes` (DATE, TIME_INTERVAL, WEEKLY) są w 57. SDK 55 usunął pole `notification` z app.json — nie używamy (mamy wtyczkę z `color`) [2] |
| expo-router | ~4.0.0 | ~57.0.24 | **przełomowe** (4 → 6 → 55 → 57) | SDK 56: router nie zależy już od React Navigation (jest codemod) [1]; u nas brak importów `@react-navigation/*` w kodzie (grep) — `@react-navigation/native` można usunąć z zależności. SDK 55: `reset` → `resetOnFocus` (nie używamy — **do sprawdzenia grepem przy wdrożeniu**). Wymaga `@testing-library/react-native >= 13.2.0` (peer) |
| @react-navigation/native | ^7.0.0 | — | usunąć przy 56 | nieużywany bezpośrednio |
| expo-crypto | ~14.0.2 | ~57.0.3 | podbicie | `randomUUID` jest |
| react-native-svg | 15.8.0 | 15.15.4 | podbicie | wykres w `components/Chart.tsx`; peer bez ograniczeń |
| react-native-screens | ~4.4.0 | ~4.26.0 | podbicie | — |
| react-native-safe-area-context | 4.12.0 | ~5.7.0 | podbicie główne | używamy `SafeAreaView` z tej paczki (5 ekranów) — w 5.x jest; **sprawdzić wizualnie** na symulatorze |
| expo-asset, -constants, -document-picker, -font, -haptics, -keep-awake, -linking, -localization, -sharing, -status-bar | ~11–17 | ~57.x | podbicie | użycie proste; `npx expo install --fix` |
| @kingstinct/react-native-healthkit | ^8.7.2 | — (poza Expo) | **ryzykowne** | 8.7.2 (VI 2025) to ostatnia wersja bez Nitro — moduł „mostkowy” (`RCT_EXTERN_MODULE`, sprawdzone w paczce). Na RN 0.86 działa tylko przez warstwę zgodności [25]; kompilacja w Xcode 26.4+/Swift 6 — **NIEZWERYFIKOWANE**. Powód przypięcia („v12+ wymaga RN 0.79 + Nitro”) **znika** od SDK 54: najnowsza 16.0.0 (18.09.2026) wymaga `react >=19`, `react-native >=0.79`, `react-native-nitro-modules >=0.35`. Uwaga: API v16 jest inne — `requestAuthorization(obiekt)` zamiast `(read, write)`, `saveWorkoutSample(typ, ilości, start, end, totals, metadata)` zamiast `(typ, ilości, start, {end, metadata})`, `isHealthDataAvailable()` synchroniczne (sprawdzone w typach 16.0.0). `lib/health.ts` ma własny typ `HK`, więc **skompiluje się, ale zadziała źle** — przy zmianie wersji przepisać `lib/health.ts` i mock w testach |
| @bacons/apple-targets | ^4.0.7 | 4.0.7 albo 5.0.0 | podbicie / do sprawdzenia | README 4.0.7 i 5.0.0: „requires … Xcode 16 … and Expo SDK +53” — dziś na SDK 52 jesteśmy formalnie poza zakresem, aktualizacja to naprawia. 5.0.0 (17.07.2026) zależy od `@expo/prebuild-config ~55.0.6`; lista zmian 5.0 — **NIEZWERYFIKOWANE** (brak dostępu do repo). Plan: zostać na 4.0.7 do SDK 57, potem osobno spróbować 5.0.0 |
| modules/rest-activity (własny Swift) | — | — | prawdopodobnie bez zmian | Expo Modules API (`Module`, `AsyncFunction`), ActivityKit słabo linkowany; podspec `ios 15.1`, `swift_version 5.9`. Kompilacja w Xcode 26.x — **do potwierdzenia buildem**. SDK 56+: minimum aplikacji iOS 16.4 (widżet 16.2 — rozszerzenie może mieć niższe; **sprawdzić**, czy prebuild nie podnosi) |
| targets/rest-widget | — | — | do sprawdzenia | SwiftUI/WidgetKit; SDK 57: tryb scen opcjonalny, SDK 58: domyślny — nas dotyczy dopiero przy 58 [4][22] |
| plugins/withoutPushEntitlement.js | — | — | bez zmian | `withEntitlementsPlist` z `expo/config-plugins` — stabilne API |
| jest-expo | ~52.0.6 | ~57.0.5 | podbicie | dalej Jest 29 i `react-test-renderer` 19.2.3; nowy peer `@react-native/jest-preset ^0.86.3` |
| @testing-library/react-native | ^12.9.0 | **^13.3** | podbicie | 13.x działa z React 19 i `react-test-renderer`; 14.x wymaga już `test-renderer` (inny silnik) — nie teraz. Wymaganie expo-router 57: ≥13.2 |
| @types/react | ~18.3.12 | ~19.x | **przełomowe dla typecheck** | spodziewane poprawki typów |
| react-test-renderer | ^18.3.1 | 19.2.3 | podbicie | ostrzeżenia o przestarzałości w testach [30] |
| react-native-web, @expo/metro-runtime | 0.19 / ~4.0 | 0.21 / ~57.0 | podbicie | eksport web w `npm run verify` |
| typescript | ^5.3.3 | ~5.x (wg szablonu SDK) | do sprawdzenia | — |
| app.json `splash` (klucz główny) | — | — | do sprawdzenia | od SDK 52 zalecana wtyczka `expo-splash-screen`; czy SDK 57 dalej czyta klucz główny — **NIEZWERYFIKOWANE**, sprawdzi `expo-doctor` |
| eas.json `image: macos-sequoia-15.3-xcode-16.2` | — | `sdk-57` / `latest` | zmiana | tylko dla buildów w chmurze Expo |
| eas-cli 24.8.0 (workflowy) | — | ? | do sprawdzenia | zgodność z SDK 57 — **NIEZWERYFIKOWANE**; podbić, jeśli `expo-doctor` lub build zgłosi |

## B4. Ścieżka aktualizacji

Wszystko na gałęzi `upgrade/sdk-57` od `integration/0.9.0` (albo od `main` po scaleniu 0.9.0). `main` zostaje na SDK 52, dopóki wszystko nie przejdzie.

**Każdy skok (N = 53, 54, 55, 56, 57):**
1. `npm install expo@^N.0.0 && npx expo install --fix && npx expo-doctor`.
2. Poprawki kodu i testów z listy niżej.
3. `npm run verify` — typecheck, i18n, jest, eksport iOS, `verify:native`. Na Linuksie, bez kosztów.
4. Commit „SDK N: …” — każdy skok to osobny punkt powrotu.

**Zmiany znane z góry:**
- **53:** React 19 + `@types/react` 19, RNTL 13, `react-test-renderer` 19, expo-router 5 (ostrzeżenia).
- **54 (M1):**
  - `expo-file-system/legacy` w 3 plikach i w mocku;
  - expo-router 6;
  - `react-native-safe-area-context` 5;
  - pierwszy build natywny z **Xcode 26.x** na `macos-15` (np. 26.2 lub 26.3).
- **55:** usunąć `newArchEnabled`; nowe numery pakietów; sprawdzić, czy healthkit 8.7.2 dalej się kompiluje i działa (zapis treningu do Zdrowia na telefonie).
- **56:**
  - przejście workflowów na `macos-26` i Xcode ≥26.4;
  - minimum iOS 16.4 (sprawdzić wersję iOS na Twoim telefonie — przy iOS 26 bez problemu);
  - codemod routera / usunięcie `@react-navigation/native`;
  - `expo/fetch` jako globalny `fetch` (nie używamy `fetch` — grep).
- **57:** wg Expo bez zmian przełomowych względem 56 [4].
- **Po 57 (osobno, opcjonalnie):** healthkit 16 (Nitro) z przepisaniem `lib/health.ts`; `@bacons/apple-targets` 5.0.0; przepisanie plików na nowe API `File`/`Directory`.

**Nowa architektura:** u nas jest włączona od dawna (`newArchEnabled: true` na RN 0.76), więc zalecenie Expo „nie łączyć aktualizacji SDK z włączaniem nowej architektury” [24] jest spełnione. Jedyne realne ryzyko to biblioteki w starym stylu (healthkit 8.7.2, ewentualnie zależności apple-targets), które działają przez warstwę zgodności.

## B5. Co trzeba zmienić w CI

| Plik | SDK 54–55 | SDK 56–57 |
|---|---|---|
| `ios-unsigned.yml` | krok „Select Xcode 16.2” → „Select Xcode 26.3” (albo 26.2) na `macos-15` | `runs-on: macos-26`; Xcode 26.6 (domyślny, jak obraz EAS `sdk-57`) lub jawnie `Xcode_26.4.1`; komunikat błędu z listą dostępnych zostaje |
| `e2e-ios.yml` | Xcode 26.x; **usunąć** krok pobierania środowiska iOS 18.2 (obraz ma symulatory 26.x) | `macos-26`; wyszukiwanie urządzenia `"iPhone 16 ("` → `"iPhone 17 ("` (fallback „pierwszy iPhone” już jest); bez pobierania środowisk |
| `iphone-local.yml` (`eas build --local`) | Xcode 26.x | `macos-26` + Xcode 26.6; build lokalny używa Xcode maszyny, nie obrazu z eas.json (**NIEZWERYFIKOWANE** w dokumentacji, zgodne z zasadą działania „--local”) |
| `iphone-eas.yml` | komentarz o TestFlight do aktualizacji | j.w. |
| `eas.json` | `"image": "latest"` albo nazwa obrazu SDK 54 (**do sprawdzenia** na stronie obrazów) | `"image": "sdk-57"` (alias) — buildy w chmurze Expo (limit 15/mies.) |
| Wersja Node | 22 (bez zmian; SDK 57 wymaga 22.13+, eas.json ma 22.22.2) | j.w. |
| TestFlight | nowa ścieżka wysyłki: `eas submit` (limity darmowego planu EAS dla Submit — **NIEZWERYFIKOWANE**) albo darmowo z GitHub Actions: `xcrun altool` / Fastlane `pilot` z kluczem ASC API (sekrety już są: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_API_KEY_P8`) | j.w. |

Zgodnie z Twoją zasadą „nie płacić za narzędzia”:
- maszyny macOS w publicznym repo są darmowe [29];
- buildy w chmurze Expo zużywają limit 15/mies. (wspólny dla 3 aplikacji), dlatego weryfikację robić **wyłącznie** przez `iphone-local.yml` i `ios-unsigned.yml`.

Przed włączeniem wysyłki do TestFlight (nowe uprawnienia, nowe kroki z sekretami) trzeba zrobić audyt logów i artefaktów publicznego repo (Twoja reguła z preferencji).

## B6. Jak sprawdzić za darmo

1. **Na każdym skoku (Linux, bez kosztów):** `npm run verify` — 875 testów jest + typecheck + i18n + eksport + `verify:native`.
2. **Na M1 (SDK 54) i na końcu (SDK 57), na darmowych maszynach macOS:**
   - `ios-unsigned.yml` — kompilacja całości: aplikacja, widżet, healthkit, `rest-activity`; kontrola binarki, bundla i `.appex`;
   - `e2e-ios.yml` — 6 scenariuszy Maestro na symulatorze;
   - `iphone-local.yml` z `wyslij = nie` — podpisany build ad hoc bez wysyłki;
   - `iphone-local.yml` z `wyslij = tak` — link instalacji na iPhonie (`eas upload` nie zużywa limitu buildów).
3. **Test na telefonie** (lista kontrolna):
   - start i dane z poprzedniej wersji (ta sama baza SQLite, ten sam schemat 15);
   - trening z szablonu;
   - przerwa i Live Activity / Dynamic Island;
   - powiadomienie po przerwie w tle;
   - zapis do Zdrowia;
   - eksport i import kopii (pliki — nowy import `legacy`);
   - automatyczna kopia w Plikach;
   - widżet.
4. **Na M1:** pierwszy upload do TestFlight (ścieżka wg B5).

## B7. Ryzyka i wycofanie

| Ryzyko | Prawdopodobieństwo | Skutek | Co robimy |
|---|---|---|---|
| Testy RNTL/React 19 (ostrzeżenia, inne zachowanie `act`, typy) | wysokie | dużo drobnych poprawek testów | RNTL 13 (nie 14); poprawki w skoku 53 |
| `expo-file-system` — pominięty import starego API | średnie | **wyjątek w czasie działania** (kopie, import, podpis) | grep po wszystkich importach + test na telefonie: eksport, import, kopia automatyczna |
| healthkit 8.7.2 nie kompiluje się lub nie działa na RN 0.83+/Xcode 26.4 | średnie (**NIEZWERYFIKOWANE**) | brak zapisu do Zdrowia albo błąd buildu | plan B: v16 + Nitro + przepisanie `lib/health.ts` (ok. 1 sesja) |
| `@bacons/apple-targets` 4.0.7 z prebuild SDK 55+ | niskie–średnie | brak widżetu w IPA (kontrola `.appex` w workflowie to wykryje) | 5.0.0 albo poprawka konfiguracji |
| Zmiana zachowania expo-router (4 → 57) | średnie | nawigacja: typy tras, okna (`picker`, `reorder`) | E2E 6 scenariuszy + przejście ręczne |
| `macos-15` traci Xcode 16.2 przed końcem T-051 | nieznane | `main` przestaje się budować | gałąź z SDK ≥54 to i tak rozwiązanie |
| Minimum iOS 16.4 (SDK 56+) | niskie | aplikacja nie zainstaluje się na starszym iOS | sprawdzić wersję iOS telefonu |

**Wycofanie:**
- Gałąź z commitem na każdy skok. `main` bez zmian do pełnej weryfikacji.
- **Dane:** sama aktualizacja SDK nie zmienia naszego schematu (15) ani miejsca bazy (`Library/SQLite`). Instalacja z powrotem wersji na SDK 52 zachowa dane.
- **Warunek:** w tym samym wydaniu nie może być zmiany schematu, np. E2 z nowym polem, bo kopia z nowszym schematem nie wczyta się w starszej aplikacji (dokument 10). Dlatego **T-051 i E2 w osobnych wydaniach**.

## B8. Szacunek i kolejność

**T-051 do SDK 57: 4–6 sesji.**

| Etap | Sesje |
|---|---|
| 52 → 54 (React 19, RNTL 13, pliki, router; pierwszy build Xcode 26; E2E; telefon) | ok. 2 |
| 55 | 0,5–1 |
| 56–57 (`macos-26`, router bez React Navigation, iOS 16.4) | 1–1,5 |
| Ścieżka TestFlight + audyt publicznych logów | 0,5–1 |
| Opcjonalnie healthkit 16 | +1 |

**Kolejność — rekomendacja:**
1. **Najpierw T-051 (do M1 = SDK 54, potem 57).** Nie wymaga Twoich decyzji, a odblokowuje TestFlight. Usuwa zależność od Xcode 16.2 na obrazie, który w każdej chwili może się zmienić. E2 (czysty TypeScript, bez kodu natywnego) będzie od razu pisane i testowane na React 19 / RNTL 13, więc testy nie będą poprawiane dwa razy.
2. **Równolegle:** podejmujesz decyzje D1–D8 (i decyzję 2 z dokumentu 10).
3. **Potem E2 (W1)** w osobnym wydaniu. Ewentualnie W3, jeśli D2 = (a).

**Kiedy odwrócić kolejność:** jeśli zamiana ćwiczenia jest Ci pilnie potrzebna na telefonie, a TestFlight nie. E2 da się zrobić na SDK 52 i zainstalować ad hoc. Koszt: konflikty w `package-lock.json` i testach przy późniejszym scaleniu oraz ryzyko, że `macos-15` straci Xcode 16.2.

## B9. Stan realizacji T-051 (03.10.2026) — M1 = SDK 54 osiągnięty na gałęzi

Gałąź `upgrade/sdk-57` (od `integration/0.9.0`, dd4a7cd), bez wypychania. Każdy krok to osobny commit:

| Krok | Commit | Co |
|---|---|---|
| SDK 53 | 77c1664 | expo 53.0.27, RN 0.79.6, React 19.0, expo-router 5.1, RNTL 13.3.3, jest-expo 53, `@types/react` 19.0 |
| SDK 54 | ca20f6e | expo 54.0.37, RN 0.81.5, React 19.1, expo-router 6.0, expo-file-system 19 (`/legacy`), safe-area-context 5.6, screens 4.16 |
| CI Xcode 26 | commit „CI: Xcode 26…” (po ca20f6e) | workflowy na najnowszy Xcode 26.x, obraz EAS `sdk-54`, dokumentacja |

**Wyniki na każdym kroku (Linux):** `tsc` 0 błędów, `check:i18n` OK, Jest 922/922 (po kroku CI 923 — nowy test workflowów),
`gen.mjs --check` OK, `verify:native` OK (prebuild: aplikacja iOS 15.1, widżet 16.2, nowa architektura, na SDK 54 prekompilowany
React Native — `RCT_USE_PREBUILT_RNCORE`), `expo export --platform ios` OK. `expo-doctor`: SDK 53 — 18/18; SDK 54 — 17/18 (wyjątek niżej).
`npm ls` bez błędów peer: healthkit 8.7.2 ma peer `react`/`react-native` „*”, apple-targets 4.0.7 — `expo >=52`, więc żadnych ostrzeżeń.

**Odstępstwa od planu B4 i ich powody:**
1. **Pomocnik testów `tests/app.tsx` (SDK 53), bez zmiany żadnej asercji:**
   - przed każdym `renderApp` odmontowanie poprzedniego drzewa (`await cleanupAsync()`). Z React 19 (RNTL 13 domyślnie z równoległym
     korzeniem) drugi „start aplikacji” w jednym teście odświeżał stare drzewo, które czytało wyzerowany store („store not initialised”,
     6 testów audit-r82b, a pełny przebieg potrafił się zapętlić);
   - odtworzone zachowanie `renderRouter` z expo-router 4: przy każdej zmianie stanu nawigacji `jest.runOnlyPendingTimers()`. W expo-router 4
     robił to sam `renderRouter` (`subscribeToRootState`), w 5 to usunięto. Bez tego zegar testów biegł inaczej niż przy pisaniu testów
     (R69-09: komunikat po 500 ms; edit-history: blokada podwójnego „Edytuj” 1 s), a asercje „czegoś nie ma” mogłyby przechodzić na pusto.
     Pomocnik używa wewnętrznej ścieżki `expo-router/build/global-state/router-store` i rzuca jawny błąd, gdy jej zabraknie — **do sprawdzenia
     przy SDK 55+**.
2. **`package-lock.json` na SDK 53 wygenerowany od nowa** — npm 10 przy aktualizacji starej blokady zgłaszał ERESOLVE na opcjonalnych
   peerach expo-router 5 (`react-native-reanimated`, `react-server-dom-webpack`). Od zera rozwiązuje się bez `--legacy-peer-deps`
   i bez instalowania tych pakietów. Na SDK 54 blokada zaktualizowana już przyrostowo.
3. **Dwie jawne zależności na SDK 54** (npm na SDK 54 nie podnosi tych pakietów do `node_modules`, także przy świeżej blokadzie):
   - `@expo/prebuild-config ~54.0.9` — `@bacons/apple-targets` 4.0.7 robi `require('@expo/prebuild-config/build/plugins/icons/AssetContents')`
     bez deklarowania zależności; bez tego `expo config`, prebuild i expo-doctor kończą się MODULE_NOT_FOUND. **expo-doctor zgłasza to jako
     „should not be installed directly” — świadomy wyjątek** (ta sama wersja co w `@expo/cli`). Usunąć przy przejściu na apple-targets 5.0.0,
     który deklaruje tę zależność sam (`~55.0.6`), albo przy podbiciu SDK podbić razem z nim;
   - `babel-preset-expo ~54.0.10` (dev) — wskazuje go `babel.config.js`; bez tego Jest: „Cannot find module 'babel-preset-expo'”.
4. **Kod poza listą z B4:** jawny typ `(v?: string) =>` w 3 przyciskach `Alert.prompt` (RN 0.81 zmienił typ `AlertButton.onPress` na unię
   z wariantem login/hasło — TS7006). Zachowanie bez zmian.
5. **Atrapa `expo-file-system` w testach:** stare API pod `expo-file-system/legacy` (kod i 8 plików testów), a główne wejście rzuca przy
   każdym użyciu — pominięty import starego API wywali test (w aplikacji rzuciłby dopiero na telefonie).
6. **`expo export` do katalogu tymczasowego poza projektem** — Expo 53/54 odmawia („--output-dir must be a subdirectory of the project”);
   sprawdzane jak w `npm run verify`: `.expo/verify-export` (w `.gitignore`) i usunięte po sprawdzeniu.
7. **CI:**
   - `ios-unsigned.yml`, `e2e-ios.yml`, `iphone-local.yml`: krok „Select Xcode 26.x” = `bash scripts/ci/select-xcode.sh 26` — najnowszy
     zainstalowany Xcode 26.x (bez dowiązań i bet), wypisuje wybór, przy braku błąd z listą. README obrazu `macos-15` (20260907, sprawdzone
     03.10.2026): 26.0.1, 26.1.1, 26.2, **26.3** (wybrany) — SDK iOS 26.2, symulatory iOS 26.2 z iPhone 16 i 17;
   - buildy na urządzenie (`ios-unsigned.yml`, `iphone-local.yml`): `scripts/ci/ensure-ios-platform.sh` — pobiera platformę iOS tylko,
     gdy brakuje wersji zgodnej z SDK wybranego Xcode (zwykle nic nie pobiera); `e2e-ios.yml` — krok pobierania iOS 18.2 usunięty;
   - `e2e-ios.yml`: symulator z wersji iOS zgodnej z SDK (fallback: cała lista), kolejność iPhone 16 → iPhone 17 → dowolny iPhone;
     przy okazji poprawka `|| true` — stary krok z `-eo pipefail` kończył się błędem, gdy nie było „iPhone 16”;
   - `eas.json`: `"image": "sdk-54"` — alias sprawdzony na stronie infrastruktury EAS 03.10.2026: `macos-sequoia-15.6-xcode-26.0`
     (Xcode 26.0, spełnia wymóg App Store Connect);
   - test `R58`/`T-051 CI` w `tests/regress.test.tsx`: workflowy, kolejność kroków, obraz EAS i działanie `select-xcode.sh` na sztucznym `/Applications`.

**Czego nie dało się sprawdzić na Linuksie (zrobi CI na macOS):**
- kompilacja Swift: `modules/rest-activity`, widżet `targets/rest-widget`, `@kingstinct/react-native-healthkit` 8.7.2 (moduł „mostkowy”,
  `RCT_EXTERN_MODULE`) w Xcode 26.3 z prekompilowanym React Native 0.81 i nową architekturą (warstwa zgodności);
- `pod install` (CocoaPods z obrazu), podpis ad hoc, zawartość IPA (`.appex`, uprawnienia HealthKit);
- E2E Maestro na symulatorze iOS 26.2; zachowanie na telefonie (lista z B6, pkt 3).

**Ryzyka buildu iOS (kolejność sprawdzania):**
1. healthkit 8.7.2 z prekompilowanym RN (`RCT_USE_PREBUILT_RNCORE=1`) — jeśli kompilacja padnie na nagłówkach React, plan B bez zmiany
   biblioteki: `expo-build-properties` z `ios.buildReactNativeFromSource: true` (dłuższy build); plan C: healthkit 16 + Nitro (B3).
2. Swift 6 / Xcode 26 ostrzega lub błęduje na `@available`/ActivityKit w module i widżecie — podspec ma `swift_version 5.9`, więc tryb
   Swift 5 zostaje; do potwierdzenia logiem.
3. `@bacons/apple-targets` 4.0.7 z prebuild SDK 54 — `verify:native` przechodzi (cel widżetu w projekcie), ale `.appex` w IPA potwierdzi
   dopiero `ios-unsigned.yml`.
4. Wewnętrzna ścieżka routera w pomocniku testów (punkt 1) — tylko testy, nie aplikacja.

**Następne kroki (wykonane przed SDK 55):** na gałęzi przeszły `ios-unsigned.yml` (kompilacja Swift — moduł, widżet, healthkit 8.7.2 —
w Xcode 26.3), `e2e-ios.yml` (Maestro 6/6 na iPhone 16 / iOS 26.2) i podpisany build lokalny EAS (`iphone-local.yml`). Dalej: B10.

## B10. Stan realizacji T-051 (03.10.2026) — SDK 55 → 56 → 57 na gałęzi

| Krok | Commit | Co |
|---|---|---|
| SDK 55 | 0afe6be | expo 55.0.31, RN 0.83.10, React 19.2.0, expo-router 55, bez `newArchEnabled`; obraz EAS `sdk-55` |
| SDK 56 | a3899bf | expo 56.0.23, RN 0.85.3, React 19.2.3, expo-router 56 (bez React Navigation), TypeScript 6, iOS 16.4, splash we wtyczce, CI na `macos-26` |
| SDK 57 | 860be24 | expo 57.0.26, RN 0.86.3, `@bacons/apple-targets` 5.0.0 zamiast jawnego `@expo/prebuild-config`, obraz EAS `sdk-57` |
| Dokumentacja | commit „Docs: T-051 SDK 57…” (po 860be24) | README, docs/09, docs/13 |

**Wyniki na każdym kroku (Linux):** `tsc` 0 błędów, `check:i18n` OK, Jest 923/923 (74 pliki; na SDK 57 także z wyczyszczoną pamięcią
podręczną), `gen.mjs --check` OK, `verify:native` OK, `expo export --platform ios` OK, `npm ci` od zera OK.
`expo-doctor`: SDK 55 — 19/20, SDK 56 — 20/22, **SDK 57 — 21/21**. Prebuild na SDK 56–57: aplikacja iOS 16.4, widżet 16.2,
prekompilowany React Native, uprawnienia tylko HealthKit.

**Co zmieniło się poza listą z B4 i dlaczego:**
1. **Jawne `react-native-reanimated`, `react-native-worklets`, `react-native-gesture-handler` (od SDK 56, wersje z SDK: 57 → 4.5.1 /
   0.10.1 / ~2.32.0).** expo-router 56+ zależy od `react-native-drawer-layout`, który ma *nieopcjonalne* peery reanimated
   i gesture-handler. npm instaluje je sam — w najnowszych wersjach (reanimated 4.7.1 wymaga RN 0.86–0.88), co dawało ERESOLVE albo
   wersje niezgodne z SDK. Autolinking Expo idzie też po nieopcjonalnych peerach, więc te moduły i tak trafiają do buildu natywnego;
   przypięcie do wersji SDK jest jedyną bezpieczną opcją. W bundlu JS ich nie ma (sprawdzone mapą źródeł) — aplikacja ich nie importuje.
2. **`@expo/prebuild-config`:** na SDK 55–56 jawny (`~55.0.6`, `~56.0.0`) jak na SDK 54. Na SDK 57 **`@bacons/apple-targets` 5.0.0**
   (deklaruje tę zależność sam) i usunięcie jawnej paczki — expo-doctor 21/21. Ocena 5.0.0 z pełnego diffu paczek (lista zmian na
   GitHubie dalej niedostępna): pliki entitlements z `expo-target.config` generowane do `ios/.targets/` (nasz widżet nie ma obiektu
   `entitlements` — bez znaczenia), podspec ExtensionStorage iOS 16.4 (= minimum aplikacji od SDK 56; dlatego nie wcześniej),
   deklaracja zależności. Prebuild z 4.0.7 i 5.0.0 porównany: pliki `ios/` identyczne, `project.pbxproj` identyczny po znormalizowaniu
   identyfikatorów. 5.0.0 trzyma własną kopię `@expo/prebuild-config` 55 (używa z niej tylko pomocnika ikon `AssetContents`).
3. **Splash (SDK 56):** schemat app.json odrzuca główny klucz `splash`. Przeniesiony do wtyczki `expo-splash-screen` z opcjami, które
   odtwarzają to, co prebuild SDK 55 robił z kluczem głównym (`enableFullScreenImage_legacy`, `imageWidth` 200, `contain`, tło
   `#12151c`) — storyboard i zasoby jak wcześniej. Expo nazywa tę flagę przejściową: przy jej usunięciu zwykły splash (ikona 200 pt
   na środku) — zmiana wyglądu do decyzji.
4. **TypeScript 6 (SDK 56):** `tsconfig.json` ma `"types": ["jest", "node"]` — TS 6 nie dołącza już wszystkich `@types/*` (tysiące błędów
   „Cannot find name 'jest'” w testach). `@types/node` jest zależnością pośrednią (z Jesta), jak wcześniej.
5. **Kod:** ikona zakładki przyjmuje `ColorValue` (kopia zakładek w expo-router 56 ma węższy typ); `RestActivity.podspec` iOS 16.4
   (zalecenie Expo dla własnych modułów w SDK 56). Widżet zostaje na 16.2 — rozszerzenie może mieć niższe minimum niż aplikacja,
   a wspólny `RestTimerAttributes.swift` ma `@available(iOS 16.2)`.
6. **Jest:** `standard-navigation` w `transformIgnorePatterns` (ESM w nowej zależności routera; jak w domyślnym wzorcu jest-expo 56).
   `tests/smoke.test.tsx` z limitem 30 s: przy zimnej pamięci podręcznej (CI) pierwsze `renderRouter` kompiluje w treści testu ekrany
   i kopię React Navigation z `expo-router/src` — 5,3 s na 2 rdzeniach, ponad domyślne 5 s; asercja bez zmian.
7. **`package-lock.json` od nowa na SDK 56 i 57** — przyrostowa aktualizacja kończyła się ERESOLVE (SDK 57: stary jest-expo 56
   z peerem `@react-native/jest-preset` 0.85) albo zostawiała `@expo/config-plugins` tylko w zagnieżdżonych katalogach (SDK 56;
   wtyczka healthkit 8.7.2 robi `require('@expo/config-plugins')` bez deklaracji). Świeża blokada podnosi go do korzenia.
8. **Wtyczki dopisane przez `expo install --fix`:** `expo-sharing` (SDK 55) i `expo-status-bar` (SDK 56) — bez opcji nic nie robią
   (sprawdzone w źródłach); zostają, żeby `expo install --fix` nie dopisywał ich przy każdym podbiciu.
9. **CI (SDK 56):** `runs-on: macos-26` w `ios-unsigned.yml`, `e2e-ios.yml`, `iphone-local.yml`. `select-xcode.sh` bez zmian w logice —
   na obrazie `macos-26` 20260907 (Xcode 26.0.1 … 26.4.1, 26.5, 26.6; dowiązania `Xcode_26.6.0.app`, `Xcode_26.4.app`, `Xcode.app`)
   wybiera **26.6** (SDK iOS 26.5; nowy przypadek w teście T-051 CI). `ensure-ios-platform.sh` dalej warunkowy (obraz ma iOS 26.5).
   E2E: symulator z iOS zgodnego z SDK, kolejność **iPhone 17** → iPhone 16 → dowolny iPhone (macos-26 nie ma iPhone 16).
   `eas.json`: obraz = `sdk-<numer SDK>`; test T-051 CI porównuje go z zainstalowanym `expo`, więc podbicie SDK bez obrazu nie przejdzie.
10. **eas-cli zostaje 24.8.0.** Wydany 24.09.2026, prawie 3 miesiące po SDK 57; 24.9.0 i 24.10.0 (02.10.2026) mają te same biblioteki
    konfiguracji (`@expo/config` 55.0.10, `@expo/config-plugins` 55.0.7) i zmiany dotyczące symulatorów w chmurze, `eas update`
    i SDK 58 (lista zmian sprawdzona). Obejścia (EXPO_NO_CAPABILITY_SYNC, `asc-capabilities.cjs`, `device-url.cjs`,
    `configure-credentials.exp`, test symulujący prompty) dotyczą wersji eas-cli, nie SDK — bez zmian.

**Sprawdzone, bez zmian w kodzie:** brak `reset` w opcjach ekranów (SDK 55: `resetOnFocus`), brak pola `notification` w app.json,
brak `fetch` w aplikacji (SDK 56: `expo/fetch` jako globalny `fetch`; `fetch` jest tylko w skrypcie Node `scripts/eas/asc-capabilities.cjs`),
brak kolumn BLOB w SQLite (tylko tekstowe kv), `expo-file-system/legacy` dalej w paczce 57, wewnętrzna ścieżka
`expo-router/build/global-state/router-store` z `navigationRef` w routerze 57 (pomocnik `tests/app.tsx`), etykiety zakładek
„{label}, tab, {i} of {n}” w kopii React Navigation w routerze (selektory Maestro). SDK 57 według changelogu bez zmian przełomowych
względem 56 [4]; regresja pamięci Hermes V1 z SDK 56 (expo/expo#46519) naprawiona od expo 57.0.9 / RN 0.86.2 — jesteśmy na 57.0.26 / 0.86.3.

**Czego nie dało się sprawdzić na Linuksie (zrobi CI na `macos-26`):**
- kompilacja w Xcode 26.6: healthkit 8.7.2 (moduł „mostkowy”) na RN 0.86 przez warstwę zgodności, reanimated 4.5 / worklets 0.10
  (nowe w buildzie), `rest-activity` z podspec 16.4, widżet z apple-targets 5.0.0, ExtensionStorage 16.4, `pod install` z CocoaPods 1.17;
- E2E Maestro na iPhone 17 / iOS 26.5 — inny rozmiar ekranu niż iPhone 16 (402×874 vs 393×852 pt), możliwe drobne różnice w przewijaniu;
- build lokalny EAS (`iphone-local.yml`) na `macos-26` i instalacja na telefonie (lista z B6, pkt 3), w tym splash i Live Activity.

**Wyniki CI na `macos-26` (03.10.2026, Xcode 26.6):**

| Workflow | Przebieg | Commit | Wynik |
|---|---|---|---|
| `ios-unsigned.yml` | 37142743600 | 49d4207 | OK — kompilacja Swift: healthkit 8.7.2 na RN 0.86, reanimated/worklets, `rest-activity` 16.4, widżet z apple-targets 5.0.0 |
| `iphone-local.yml` (`wyslij = nie`) | 37142745929 | 49d4207 | OK — podpisany build lokalny EAS (profil `adhoc`), IPA z profilem i rozszerzeniem widżetu |
| `e2e-ios.yml` | 37142744844 | 49d4207 | OK — 6/6 |
| `e2e-ios.yml` | 37145871451 | 97f8a20 | 4/6 — 2 scenariusze padły na czekaniu, ekran był poprawny; start aplikacji do 103 s, stuknięcie do 16 s |
| `e2e-ios.yml` | 37148240242 | 8e9fc92 | 5/6 — „Miejsca treningu i filtr ćwiczeń”: powrót na górę długiej listy sprzętu nie zmieścił się w 30 s |
| `e2e-ios.yml` (aplikacja z 37145871451) | 37149375860 | 97303e1 | OK — 6/6 w 16 min 39 s |
| `iphone-local.yml` (`wyslij = tak`) | 37182282200 (04.10.2026) | 97303e1 | OK — IPA 10,5 MB (z rozszerzeniem `RestWidget.appex`), `eas upload` dał link do instalacji |

**Limity czasu w Maestro (8e9fc92, 97303e1):** `extendedWaitUntil` 10 → 30 s i 20 → 60 s, `scrollUntilVisible` 30 → 90 s.
Ten sam kod przechodził 6/6 i padał na czekaniu, więc przyczyną jest prędkość symulatora iPhone 17 na `macos-26`, nie aplikacja
(w przebiegu 37145871451 zrzut z nieudanego kroku pokazał właściwy ekran). Asercje bez zmian — wydłużone jest tylko oczekiwanie. Koszt: wolniejsze
wykrycie rzeczywistego braku elementu (do 90 s zamiast 30 s na krok). Te same dwa commity przeniesione na `integration/0.9.0`
(9e0d751, 37d6437). **Niewyjaśnione:** czy symulator jest wolny zawsze, czy tylko na części maszyn `macos-26` — do obserwacji przy
kolejnych przebiegach (czas „6/6 Flows Passed in …” w logu).

**Ryzyka i plan B:**
1. healthkit 8.7.2 nie skompiluje się na RN 0.86 → `expo-build-properties` z `ios.buildReactNativeFromSource: true`, a jeśli to
   nie pomoże — healthkit 16 (Nitro) z przepisaniem `lib/health.ts` (B3).
2. reanimated/worklets wydłużą build albo zgłoszą błąd w Xcode 26.6 → to wersje wskazane przez SDK 57 (`bundledNativeModules`),
   więc mało prawdopodobne; wyłączenie ich z autolinkingu (`react-native.config.js`) możliwe, bo JS ich nie importuje.
3. Xcode 27: aplikacje zbudowane z SDK iOS 27 muszą używać cyklu życia UIScene; SDK 57 ma to opcjonalnie
   (`expo-build-properties` `ios.enableSceneSupport`, od expo 57.0.23), SDK 58 domyślnie [4][22]. Dziś nas nie dotyczy:
   `select-xcode.sh` bierze tylko 26.x, obraz EAS `sdk-57` ma Xcode 26.6. Gdy GitHub/Apple przejdą na Xcode 27 — osobne zadanie.
4. Wycofanie: każdy krok ma osobny commit (B10, tabela); dane bez zmian schematu (B7).

**Następne kroki:** ~~`ios-unsigned.yml` → `e2e-ios.yml` → `iphone-local.yml` (`wyslij = nie`, potem `tak`)~~ (wyniki wyżej),
teraz test na telefonie (B6) i scalenie.

---

## Niezweryfikowane / otwarte (zebrane)

- Działanie healthkit 8.7.2 oraz `modules/rest-activity` (Live Activity) na telefonie — kompilacja w Xcode 26.6 / RN 0.86 potwierdzona w CI (B10, „Wyniki CI”); E2E na symulatorze ich nie obejmuje, więc zostaje test na telefonie (B6).
- Lista zmian `@bacons/apple-targets` 5.0.0 (brak dostępu do repo przez API) — przejście na 5.0.0 oparte na diffie paczek (B10, pkt 2).
- ~~Obraz EAS dla SDK 54~~ — sprawdzone 03.10.2026: alias `sdk-54` = `macos-sequoia-15.6-xcode-26.0` (B9).
- ~~Zgodność eas-cli 24.8.0 z SDK 57~~ — wersja z 24.09.2026, nowsze bez zmian dla naszego przepływu (B10, pkt 10); potwierdzi build lokalny. Limity darmowego EAS Submit — otwarte.
- ~~Czy SDK 57 dalej obsługuje główny klucz `splash`~~ — nie (od SDK 56 schemat go odrzuca); przeniesiony do wtyczki `expo-splash-screen` (B10, pkt 3).
- Jak długo `macos-15` będzie miał Xcode 16.2.
- Termin przyszłego wymogu Xcode 27 w App Store Connect (nieogłoszony).
- Czy SDK 58 wyszło jako stabilne w ostatnich dniach (dziennik zmian Expo pokazuje 03.10.2026 tylko betę z 15.09; beta miała trwać 3–4 tygodnie).
- Szczegóły zamiany w Strong/Hevy (co dzieje się z odhaczonymi seriami) — ich pomoc tego nie opisuje.

## Źródła

1. Expo SDK 56 — changelog: https://expo.dev/changelog/sdk-56
2. Expo SDK 55 — changelog: https://expo.dev/changelog/sdk-55
3. Expo SDK reference (tabela wersji): https://docs.expo.dev/versions/latest/
4. Expo SDK 57 — changelog: https://expo.dev/changelog/sdk-57
5. Expo changelog (lista wpisów, beta SDK 58 15.09.2026): https://expo.dev/changelog
6. Apple — SDK minimum requirements: https://developer.apple.com/news/upcoming-requirements/
7. Expo blog — App Store Connect minimum SDK requirements update: https://expo.dev/blog/app-store-connect-minimum-sdk-26
8. Expo docs — Upgrading Expo SDK walkthrough: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
9. GitHub runner images — macOS 15 arm64 README: https://raw.githubusercontent.com/actions/runner-images/main/images/macos/macos-15-arm64-Readme.md
10. GitHub runner images — macOS 26 arm64 README: https://raw.githubusercontent.com/actions/runner-images/main/images/macos/macos-26-arm64-Readme.md
11. Strong — Update template: https://help.strongapp.io/article/177-update-template
12. Strong — Apple Watch / merge data: https://help.strongapp.io/article/224-workout-on-apple-watch · https://help.strongapp.io/article/209-how-do-i-merge-data-between-two-exercises · https://apps.apple.com/us/app/strong-workout-tracker-gym-log/id464254577
13. Hevy: https://www.hevyapp.com/features/exercise-programming-options/ · https://www.hevyapp.com/features/workout-plan-generator/ · https://www.hevyapp.com/community-updates/july-26/
14. Fitbod: https://help.fitbod.me/hc/en-us/articles/360006335593-Editing-Workouts-in-Fitbod · https://help.fitbod.me/hc/en-us/articles/43489509474455-How-does-Fitbod-choose-which-exercises-to-give-me
15. Alpha Progression: https://alphaprogression.com/en/blog/alpha-progression-guide · https://apps.apple.com/us/app/alpha-progression/id1462277793
16. Liftosaur — Changing Today's Workout: https://www.liftosaur.com/features/changing-a-workout (sprawdzone 03.10.2026)
17. StrengthLog — Similar Exercises: https://help.strengthlog.com/help-article/similar-exercises/ (sprawdzone 03.10.2026)
18. JEFIT: https://www.jefit.com/blog/upcoming-enhancements-revamped-workout-tab-and-improved-exercise-screens · https://www.jefit.com/blog/adaptive-mesocycle-training-jefits-smarter-way-to-progress
19. Boostcamp: https://www.boostcamp.app/blogs/tips-and-tricks-to-using-boostcamp-app · https://www.garagegymreviews.com/boostcamp-review · https://apps.apple.com/us/app/boostcamp-workout-programs/id1529354455
20. SmartGym: https://smartgymapp.com/releases/smartgym-7-4 · https://smartgymapp.com/releases/smartgym-7-6 · https://help.smartgymapp.com/article/136-different-equipment-lists
21. Caliber: https://feedback.caliberstrong.com/announcements/caliber-304-exercise-substitution-improvements · https://caliberstrong.freshdesk.com/support/solutions/articles/48001257776-caliber-app-user-guide
22. Expo SDK 58 Beta: https://expo.dev/changelog/sdk-58-beta
23. Expo SDK 53 (React 19, nowa architektura domyślnie): https://expo.dev/changelog/sdk-53 · https://expo.dev/blog/out-with-the-old-in-with-the-new-architecture
24. Expo blog — How to upgrade to Expo SDK 54: https://expo.dev/blog/expo-sdk-upgrade-guide
25. React Native New Architecture WG — dyskusja #309 (warstwy zgodności w 0.82+): https://github.com/reactwg/react-native-new-architecture/discussions/309
26. EAS Build — infrastruktura i obrazy: https://docs.expo.dev/build-reference/infrastructure/
27. GitHub runner images — README (etykiety, `macos-latest` = macOS 26, polityka Xcode): https://raw.githubusercontent.com/actions/runner-images/main/README.md
28. Wycofanie macOS 14: https://github.com/actions/runner-images/issues/13518
29. GitHub — How use of GitHub Actions is measured: https://docs.github.com/en/billing/concepts/product-billing/github-actions
30. React 19 Upgrade Guide (`react-test-renderer` przestarzały): https://react.dev/blog/2024/04/25/react-19-upgrade-guide
31. Expo blog — Expo File System upgrade in SDK 54: https://expo.dev/blog/expo-file-system

Dane z npm (wersje i zależności pakietów: `expo`, `expo-file-system`, `expo-sqlite`, `expo-notifications`, `expo-router`, `jest-expo`, `@testing-library/react-native`, `@kingstinct/react-native-healthkit` 8.7.2 i 16.0.0, `@bacons/apple-targets` 4.0.7 i 5.0.0) — pobrane `npm view` / `npm pack` 03.10.2026 z https://registry.npmjs.org.

### B11. Audyt aktualizacji 52 → 57 (03.10.2026)

Niezależny audyt różnicy dd4a7cd..49d4207: **0 wysokich, 1 średni, 5 niskich**.
- ŚREDNI (naprawiony): od SDK 56 w aplikacji jest `expo-splash-screen` (przeniesienie `splash` do wtyczki), a expo-router chowa ekran powitalny dopiero, gdy zamontuje się nawigator. Ekran błędu startu („Nie udało się otworzyć danych”) nie ma nawigatora, więc zostałby pod logo. `app/_layout.tsx` chowa ekran powitalny przy błędzie startu; test `tests/splash-start-error.test.tsx` (mock bazy `global.__dbOpenFail`).
- NISKIE: HealthKit 8.7.2 na RN 0.86 w działaniu — do sprawdzenia na telefonie (E2E tego nie obejmuje); `tests/app.tsx` przy każdej nawigacji uruchamia oczekujące timery (jak expo-router 4 — nie wykryje błędów „timer wciąż czeka po nawigacji”); ~~`Tabs` z `expo-router` przestarzałe w 57 (docelowo `expo-router/js-tabs`)~~ — zrobione 04.10.2026: import z `expo-router/js-tabs` (ten sam komponent, test w `tests/regress.test.tsx`); minimum iOS 16.4 (zamierzone); nieaktualne zdanie w B9 o niewypchniętej gałęzi (gałąź jest na GitHubie).
- Bez zmian: położenie bazy SQLite i migracja do Library/SQLite, schemat 15, format kopii, uprawnienia i teksty HealthKit, identyfikatory pakietów, wygląd ekranu powitalnego.

