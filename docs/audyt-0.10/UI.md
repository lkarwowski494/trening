# Audyt 0.10.0 — spójność interakcji (UI)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

Audytowałem commit **d2a1e85**. Worktree startował na złym commicie f435c8c, więc najpierw czytałem kod z `git archive d2a1e85`. Po przełączeniu przez koordynatora sprawdziłem: `diff` = 0 różnic. Testy pomocnicze uruchamiałem już w worktree na d2a1e85.

**Co przejrzałem:**
- **Ekrany i komponenty:** wszystkie 24 ekrany `app/` + 2 layouty, 21 komponentów, `lib/start.ts`, `lib/guide.ts`, `lib/theme.ts`, `lib/plan.ts` (aktywacja), `lib/locations.ts` (usuwanie, gumy), `LoadEditor` + `lib/loads.fillRange`.
- **Inwentarz akcji:**
  - 16 wywołań `SwipeRow`;
  - 42 okna `Alert.alert` / `Alert.prompt` / `ActionSheet`;
  - 97 `Btn`, 33 `Item`, 35 `Chip`, 51 pól tekstowych;
  - 70 wywołań nawigacji.
- **Kroje:** przegląd AST każdego `<Text>`/`SvgText` w `app/` i `components/` pod kątem `fontFamily` spoza tokenów `F`. Kolory zaszyte w kodzie: grep.
- **Zrzuty:** pl/dark/light, se/std (home z kartą „teraz”, szablony, edytor szablonu, kalendarz, edycja sesji, miejsce, ustawienia).

**Testy pomocnicze (wszystkie zielone, tylko dla dowodów):**
`tests/zz-audit-ui-a.test.tsx` … `zz-audit-ui-e.test.tsx` w worktree audytora (poza repo). Wyniki przytaczam jako POTWIERDZONE.

## Znaleziska

### UI-01 — Edytor ciężarów: przycisk „Usuń odznaczone” i „Wypełnij” usuwają bez potwierdzenia
- **Waga:** WYSOKA. To sprzeczność z decyzją 07.10 („przyciski Usuń znikają, potwierdzenie wszędzie”).
- **Dowód:** POTWIERDZONE (UI-A).
  - Miejsce „hotel”, lista hantli 2,5…25. Odznaczenie 5 kg → `Usuń odznaczone` (`components/LoadEditor.tsx:70`) usuwa 5 kg, okien: 0.
  - Potem `Wypełnij` 10–16 co 2 (`LoadEditor.tsx:63-65`, `lib/loads.ts:53-57`) zostawia listę `10, 12, 14, 16`. Ciężary 2,5; 7,5; 17,5…25 zniknęły, okien: 0.
  - Dla porównania preset modelu pyta „Zastąpić wpisane ciężary?” (`LoadEditor.tsx:47-49`).
  - Test regresji „bez przycisków Usuń” (`tests/swipe-delete.test.tsx:90`) porównuje dokładny tekst `'Usuń'`, więc tego przycisku (ani „Usuń gumy…”) nie łapie.
- **Skutek:** chcąc dopisać cięższe hantle zakresem, użytkownik po cichu traci całą wcześniej wpisaną listę (np. z presetu).
- **Opcje „Wypełnij” (decyzja właściciela):**
  - A — zakres **dopisuje** do listy, nic nie znika;
  - B — zostaje zastępowanie, ale z oknem jak przy presecie: „Znikną ciężary: n”.
  - Rekomendacja: A (nigdy nie traci danych). Uwaga: test `tests/locations-loads.test.ts:43` dziś utrwala zastępowanie.
- **Opcje „Usuń odznaczone”:**
  - A — usunąć przycisk (odznaczone i tak się nie liczą);
  - B — zostawić z potwierdzeniem `destructive` i zapisać wyjątek w docs/18 (chipów nie da się przesunąć).
  - Rekomendacja: B.
- **Test regresji:**
  - „Wypełnij” na niepustej liście zachowuje stare wartości (A) albo pokazuje okno (B);
  - „Usuń odznaczone” pyta;
  - w `swipe-delete` zamienić dopasowanie na `/^Usuń/` i sprawdzić ekran miejsca z odznaczonym ciężarem.

### UI-02 — Generator „Ustaw jako aktywny” kasuje zmiany pojedynczych dni bez słowa
- **Waga:** WYSOKA (utrata zmian w kalendarzu, niespójność z ekranem Plan).
- **Dowód:** POTWIERDZONE (UI-N).
  - Przed: 1 zmiana dnia od dziś (`2026-10-11`).
  - Okno generatora (`app/generator.tsx:25-29`): „Szablony trafią do folderu „Wygenerowane”. Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.”
  - Po „Ustaw jako aktywny”: `planOverrides = null`, czyli zmiana zniknęła. Wywołanie `saveGenerated → addPlan → activatePlan`, `lib/plan.ts:71`.
  - Ta sama operacja z ekranu Plan (`app/plan.tsx:25`) mówi: „Zmiany pojedynczych dni od dziś zostaną usunięte: {n}.”
- **Skutek:** użytkownik traci ręczne przesunięcia w kalendarzu. Obietnica „wrócisz jednym przyciskiem” ich nie przywraca.
- **Propozycja:** wspólny tekst potwierdzenia dla obu ścieżek, z liczbą `futureChanges()`. Dla spójności z `plan.tsx` przycisk „Ustaw jako aktywny” w stylu `destructive`, gdy n > 0.
- **Test:** okno generatora zawiera liczbę zmian, gdy są; brak tej linii, gdy ich nie ma.

### UI-03 — Tydzień deload: „Powtórz ostatni” startuje pełny trening bez pytania
- **Waga:** WYSOKA (błędne zachowanie w typowej ścieżce, sprzeczne z obietnicą na ekranie). Obszar przecina się z UX/LOG.
- **Dowód:** POTWIERDZONE (UI-I).
  - W tygodniu deload „Start” pokazuje okno „Tydzień deload” [Anuluj, Pełny trening, Mniej serii] (`lib/start.ts:17-24`).
  - „Powtórz ostatni” (`app/(tabs)/index.tsx:58` → `store.repeatLast`, `lib/store.ts:928`): okien 0, 29 serii roboczych = pełny szablon.
  - Teksty obiecują pytanie przy każdym starcie: `DeloadHint.tsx:27` i `PeriodSummary.tsx:46` — „Przy starcie treningu zaproponuję mniej serii”.
- **Opcje:**
  - A — `repeatLast` przechodzi przez to samo pytanie (cięcie `deloadKeep` na blok);
  - B — zostawić i dopisać w tekstach, że „Powtórz ostatni” powtarza dokładnie.
  - Rekomendacja: A.
- **Test:** w tygodniu deload „Powtórz ostatni” pokazuje to samo okno, a „Mniej serii” tnie serie.

### UI-04 — „Pokaż” w Przewodniku kładzie drugi zestaw zakładek na stos
- **Waga:** ŚREDNIA.
- **Dowód:** POTWIERDZONE (UI-K).
  - Więcej → Przewodnik → Szablony → „Pokaż” (`app/guide.tsx:30`, `router.push(g.route)`).
  - Na stosie: `(tabs)`, Przewodnik, `(tabs)` — dwa `(tabs)`. „Wróć” nie zdejmuje nowego zestawu.
  - Dotyczy 4 z 8 tematów, kierujących do zakładek: `'/'`, `'/templates'`, `'/history'` ×2 (`lib/guide.ts`).
  - Problem znany z rundy 28 (`components/leave.ts`).
- **Skutek:** nowa osoba z „Pierwszych kroków” ląduje w zagnieżdżonych zakładkach. Mogą się zamontować dwa ekrany treningu.
- **Propozycja:** dla tras-zakładek `router.dismissAll(); router.navigate(route)`, jak `goHome` w `template/[id].tsx`.
- **Test:** po „Pokaż” dokładnie jeden `(tabs)` na stosie.

### UI-05 — Nazwy: wyjście bez zakończenia edycji gubi nazwę szablonu i ćwiczenia, nazwa planu ma inną semantykę
- **Waga:** ŚREDNIA.
- **Dowód:** POTWIERDZONE w RNTL (UI-E, UI-H, UI-D).
  - Wpisanie pustej nazwy i „Wróć”:
    - szablon `""`, a po ponownym starcie migracja ustawia `„Nowy szablon”` — stara nazwa „Upper A” przepada (`lib/store.ts:269`);
    - ćwiczenie `""`, po starcie „Nowe ćwiczenie” (`store.ts:228`);
    - miejsce wraca do „Dom” (efekt przy odmontowaniu, `app/more/location/[id].tsx:23`).
  - Lista szablonów pokazuje wiersz bez tytułu („Usuń szablon: ”).
  - Nazwa planu (`app/plan.tsx:30`, `defaultValue` + tylko `onEndEditing`): po wpisaniu „Redukcja jesień” `planName()` nadal = „Rutyna”. „Zapisz kopię jako nowy plan” (`plan.tsx:42`) zapisuje „Kopia: Rutyna”, bo przy `keyboardShouldPersistTaps` tapnięcie nie kończy edycji.
  - Gumy: dwa edytory koloru z różnymi zasadami. `/more/bands` przycina i przywraca pusty; `BandLevels` w miejscu (`location/[id].tsx:67`, `lib/locations.ts:64`) zapisuje surowy tekst, także pusty.
  - Zastrzeżenie: RNTL nie odpala `onEndEditing` przy zdejmowaniu ekranu. Czy iOS je wyśle przy cofnięciu, nie da się sprawdzić na Linuksie, ale kod miejsca i komentarz w `store.ts:228` traktują to jako realny przypadek.
- **Propozycja:** jedno pole nazwy (hook `useNameField`) z zatwierdzeniem przy odmontowaniu i przywróceniem poprzedniej nazwy, dla szablonu, ćwiczenia, koloru gumy (oba miejsca) i planu. Nazwa planu sterowana, zapis przy każdej zmianie jak inne nazwy.
- **Test:** dla każdego pola: wpisz `''` → wyjdź → poprzednia nazwa (także po restarcie); plan: wpisz → „Zapisz kopię” → „Kopia: ‹nowa›”.

### UI-06 — Okna potwierdzeń nie mówią o skutkach w sposób spójny
- **Waga:** ŚREDNIA.
- **Dowód:**
  - **Szablon** (POTWIERDZONE, UI-B i UI-J): okno to tylko „Usunąć szablon?” + nazwa (`app/(tabs)/templates.tsx:14`). Dzieje się tak także, gdy szablon jest w aktywnym planie, w „Innych planach” albo trwa z niego trening. Po usunięciu dzień planu trzyma id nieistniejącego szablonu, a `hasPlan()` zwraca false. Dla porównania usunięcie ćwiczenia wymienia skutki („Zniknie z list i szablonów. W trwającym treningu zostanie oznaczone jako usunięte.”), podobnie guma (`bands.tsx:21`).
  - **Miejsce** (Z KODU, `app/more/locations.tsx:19-20`): `used` sprawdza historię i szablony, ale nie trening w toku. Guma i ćwiczenie go wymieniają.
  - **„Wyczyść wszystkie dane”** (`settings.tsx:49`): nie wspomina, że kasuje też trening w toku (`resetAll`). Import (`backup.tsx:19`) mówi „(także trening w toku)”.
- **Propozycja:** jeden wzór wiadomości: obiekt + skutki (plan / inne plany / trening w toku / historia).
- **Test:** macierz okien — dla każdego obiektu w użyciu wiadomość zawiera właściwy skutek.
- **Uwaga dla X:** nieaktualne id szablonu w planie.

### UI-07 — „Ostatnia seria” ma trzy różne zasady; wiersze bez usuwania nie dają żadnej informacji
- **Waga:** ŚREDNIA.
- **Dowód:** POTWIERDZONE (UI-C).
  - Akcje „Usuń serię” przy jednej serii: trening `[]` (`ActiveWorkout.tsx:352`, `disabled`), szablon `[]` (`template/[id].tsx:121`), edycja historii `["Usuń serię 1 — Back Squat"]` (`history/edit/[id].tsx:114`).
  - W edycji historii po usunięciu: „Bez serii — ćwiczenie nie zostanie zapisane.”
  - Wiersze bez gestu (ostatnia seria, miejsce główne, `locations.tsx:20`) nie mają ani podpowiedzi, ani informacji, dlaczego gest nie działa.
  - Opis gestu jest tylko w pomocy edytora szablonu (`template/[id].tsx:79`). Brak go w pomocy treningu (`ActiveWorkout.tsx:162`) i edycji historii (`edit:76`).
- **Opcje:**
  - A — wszędzie nie da się usunąć ostatniej serii (także w historii);
  - B — wszędzie da się (z komunikatem, że ćwiczenie zniknie).
  - Rekomendacja: A, plus w `SwipeRow` powód blokady (np. okno „To ostatnia seria — usuń ćwiczenie przesunięciem nagłówka”).
- **Test:** macierz trzech edytorów serii z tą samą regułą; wiersz zablokowany pokazuje powód.

### UI-08 — Przyciski nawigacji (`Btn`) bez blokady podwójnego tapnięcia — w przeciwieństwie do `Item`
- **Waga:** ŚREDNIA.
- **Dowód:** POTWIERDZONE (UI-M).
  - Podwójne „+ Dodaj ćwiczenie” w treningu → stos: `(tabs)`, Wybierz ćwiczenie, Wybierz ćwiczenie.
  - Podwójne „Plan tygodnia” w Kalendarzu → dwa ekrany planu.
  - Wiersz `Item` (z `useOnce`) otwiera jeden.
  - Bez blokady jest ok. 20 przycisków, m.in. `ActiveWorkout.tsx:159` (+ Dodaj ćwiczenie, ≡ Kolejność), „⇄ zamień”, `history.tsx:25,27`, `templates.tsx:19`, `plan.tsx:41`, `template/[id].tsx:57,78`, `history/edit:74,134`, `exercise/[id]:40`, `Dashboard.tsx:54-57`, `TodayPlan.tsx:32`, `WhatsNew.tsx:47`, `guide.tsx:30`, `location/[id]:69`.
- **Skutek:** dwa wybory ćwiczeń jeden na drugim → po wyborze użytkownik wraca do drugiego i może dodać ćwiczenie podwójnie.
- **Propozycja:** `Btn` z wbudowanym `useOnce` (albo prop `nav`) dla przycisków, które przechodzą dalej.
- **Test:** podwójne tapnięcie każdego przycisku nawigacji → jeden ekran.

### UI-09 — Zaszyty kolor tekstu „Usuń” pod wierszem: w ciemnym motywie kontrast 2,77:1
- **Waga:** ŚREDNIA. Główny kontrast należy do A11; tu chodzi o kolor zaszyty poza tokenami.
- **Dowód:** Z KODU + rachunek.
  - `components/SwipeRow.tsx:61` `color: '#FFFFFF'` na `t.danger`.
  - Ciemny `#ec7a72` (`lib/theme.ts:11`): 2,77:1. Jasny: 6,54:1.
  - Brak tokenu `dangerInk` (jest `accentInk`).
  - Ciemne tło `#121316` na `#ec7a72` dałoby 6,72:1.
- **Propozycja:** token `dangerInk` (jasny `#fff`, ciemny `#121316`).
- **Test:** kontrast jak w C5 (`tests/ux`) dla obu motywów.

### UI-10 — Karta „teraz”: jednostka doklejona na końcu („20 × 8 kg”, „20 × 45s kg”)
- **Waga:** ŚREDNIA. Obszar przecina się z LIVE.
- **Dowód:** POTWIERDZONE (UI-L).
  - Ciężar + czas: etykieta „Teraz: 20 × 45s kg”.
  - Ciężar + powtórzenia: duża liczba „100 × 5” + „ kg” (`ActiveWorkout.tsx:415,425`). Na zrzucie `pl-dark-se-home.png`: „20 × — kg”.
  - Reszta aplikacji: `setSummary` „20×8” albo „20kg×45s” (`store.ts:690-698`), czyli jednostka przy ciężarze.
- **Skutek:** „8 kg” / „45s kg” czyta się jak jednostka powtórzeń lub czasu.
- **Propozycja:** jednostka zaraz po ciężarze („20 kg × 8”) — także w etykiecie VoiceOver.
- **Test:** etykiety karty dla metryk `weight_reps` i `weight_time`.

### UI-11 — Kroje poza kartą: dane bez `fontFamily`
- **Waga:** NISKA.
- **Dowód:**
  - POTWIERDZONE (UI-L): kolumna „Poprzednio” w wierszu serii treningu („100×5”, „—”) ma krój systemowy (`ActiveWorkout.tsx:357`). Te same dane na karcie („ostatnio 100×5”) i w edytorze szablonu są w IBM Plex Sans; w szczegółach sesji — w Plex Mono.
  - Z KODU: plakietka przerwy na zakładce (`(tabs)/_layout.tsx:29`, `tabBarBadgeStyle` bez `fontFamily`).
  - Pozostałe `<Text>` bez kroju to znaki-ikony (›, ▶, ✓, ≡, ▸) i ekran błędu startu — celowo.
  - Brak `fontWeight` i śladów Tektur w kodzie.
- **Propozycja:** `Muted` / `NUM_FONT` dla „Poprzednio”; `fontFamily: F.semibold` w plakietce.
- **Test:** test AST — każdy nadrzędny `<Text>` z danymi ma `fontFamily` z `F` (skrypt audytu do przeniesienia).

### UI-12 — Terminologia i nazwy wejść/ekranów
- **Waga:** NISKA.
- **Dowód (Z KODU):**
  - **Nazwy wejść i nagłówków:**
    - „Miejsca i sprzęt” (`more.tsx:21`) vs „Miejsca treningu” (`settings.tsx:35`, nagłówek `_layout.tsx:66`);
    - przycisk „Wygeneruj szablony i plan” vs nagłówek „Generator planu” (`_layout.tsx:54`) vs przewodnik „Generator szablonów i planu”;
    - „Backup” vs „Kopia zapasowa” (przewodnik);
    - „Usuń gumy…” prowadzi do ekranu „Gumy”, gdzie się też dodaje i edytuje (to jedyne wejście, `location/[id].tsx:69`).
  - **Odwołanie do starej zakładki:** komunikat autozapisu „Znajdziesz go w Historii.” (`_layout.tsx:26`) — zakładka nazywa się „Kalendarz”.
  - **Ta sama akcja, różne słowa:**
    - „Anuluj trening” vs „Odrzuć trening”;
    - „Zakończ” / „Zakończ trening” / „Zakończ trening i zapisz”;
    - cofnięcie zamiany: „↺ cofnij” w bloku vs „↺ przywróć: A” w arkuszu;
    - „trening w toku” / „trwający” / „bieżący”;
    - kopie: „X (kopia)” (szablon, miejsce) vs „Kopia: X” (plan).
  - **Przyciski dodawania:** „+ Nowy”, „+ Nowe”, „+ Dodaj miejsce”, „+ Guma”, „+ talerz”, „+ seria”.
  - **Nagłówki kolumn:** trening i edycja „Pow.”, „m”, „sek.”, „Guma” vs szczegóły sesji „pow.”, „dystans”, „czas”, „guma” (`history/[id].tsx:27`).
  - **Etykiety przerwy:** „Domyślna przerwa (sekundy)”, „Przerwa robocza (s)”, „przerwa s”, „Przerwa (sekundy)”.
- **Propozycja:** słownik terminów w docs + test macierzy na pary (wejście ↔ nagłówek).

### UI-13 — Formaty czasu, dat i liczby serii
- **Waga:** NISKA.
- **Dowód:**
  - **Czas treningu:** „1:00:00” (lista, szczegóły, Podsumowanie) vs „1 h” (kafelek, `Dashboard.tsx:21`) vs „60” min (edycja).
  - **Przerwa:** „150 s” (karta szablonu, zrzut `pl-light-std-tpl.png`) vs „2:30” (trening, generator, historia); `fmtSec` „45s” bez spacji.
  - **Daty:** „pon., 5 paź” (`fmtDate`), „pon., 12.10” (`DayPanel`/`DeloadHint`), „8.10.2026” (`WhatsNew`), „8 października 2026” (kalendarz), wpis ISO.
  - **Liczba serii** (POTWIERDZONE, UI-G): szablon 1 rozgrzewka + 3 serie: Trening „5 serii” (bez rozgrzewek), Kolejność „4 serie” (z rozgrzewką, `reorder.tsx:19`), edytor „3 serie · 1 rozgrz.”. Edycja historii też liczy z rozgrzewkami („4 serie”, zrzut `histEdit`).
- **Propozycja:** jeden formater czasu trwania / przerwy i jedna funkcja liczby serii roboczych (`tplWorkSets`/`isWorking`) w Kolejności i edycji.
- **Test:** UI-G jako test regresji.

### UI-14 — Konwencje okien dialogowych
- **Waga:** NISKA.
- **Dowód (Z KODU):**
  - **Przycisk rezygnacji:**
    - „Nie” — `SwipeRow:39` (styl `cancel` = pogrubiony), `backup:19`, `settings:49`, `LoadEditor:49`, `ActiveWorkout:191,363` (bez stylu);
    - „Wróć” — edycja historii, kończenie treningu;
    - „Anuluj” — plan, generator, `DayPanel`, deload, monity.
  - **Brak stylu `destructive` przy nieodwracalnych:** „Ukryj komunikat” (kasuje wskaźnik kopii, `index.tsx:35`, `store.ts:398`), „Ustaw” (usuwa zmiany dni, `plan.tsx:26`).
  - **Tytuły:** ogólne „Na pewno?” (reset) vs konkretne pytania gdzie indziej.
  - **„Usunąć serię?”:** wiadomość to nazwa ćwiczenia (szablon, historia) albo „Seria jest już odhaczona.” / nic (trening).
  - **„Anuluj” w nagłówku:** po prawej w modalach `picker`/`swap`, po lewej w edycji historii.
- **Propozycja:** jedna funkcja `confirm(title, msg, {destructive})` z „Anuluj” w stylu `cancel`.
- **Test:** macierz okien sprawdza słowo i styl rezygnacji.

### UI-15 — Puste stany, nagłówki sekcji, znaki rozwijania
- **Waga:** NISKA.
- **Dowód:**
  - POTWIERDZONE (UI-F): same zarchiwizowane szablony → Trening mówi „Nie masz jeszcze szablonów…”, a zakładka Szablony nie pokazuje pustego stanu (tylko „▸ Archiwum (4)”, `templates.tsx:21`).
  - Z KODU:
    - Plan i `DayPanel`: „Nie masz jeszcze szablonów.” bez akcji;
    - `Empty` vs `Muted` dla pustych stanów;
    - nagłówki grup ćwiczeń (`Muted` 12) vs foldery (`SectionTitle`);
    - rozwijanie ▸/▾ wszędzie, ale ▾/▴ w arkuszu zamiany i podwójny znak („Inne ▾” + ikona ▾, `swap.tsx:135`);
    - „Trening wstecz” pokazuje zarchiwizowane szablony (`history/add.tsx:24`), reszta je ukrywa.
- **Propozycja:** wspólny komponent pustego stanu z akcją, `SectionTitle` dla grup, ▸/▾ wszędzie. Dla archiwalnych w „Trening wstecz” decyzja właściciela: A — ukryć, B — pokazać pod „Archiwum”. Rekomendacja: B.

### UI-16 — Drobne niespójności edycji i walidacji
- **Waga:** NISKA.
- **Dowód (Z KODU):**
  - Limit powtórzeń: 1000 tylko w edycji historii (`edit:118`); trening bez górnej granicy, szablon tnie dopiero przy wczytaniu (`fixRows`).
  - Błędna wartość w monicie przerwy (`ActiveWorkout:377`) i pusta nazwa folderu (`template/[id].tsx:55`) są ignorowane po cichu.
  - „✕ Usuń zakres powtórzeń” bez potwierdzenia — to raczej czyszczenie pola, do zaakceptowania jako wyjątek.
- **Propozycja:** wspólne limity z jednego miejsca; komunikat przy odrzuconym wpisie.

### UI-17 — Mechanika `SwipeRow`
- **Waga:** NISKA.
- **Dowód (Z KODU):**
  - `useMemo(..., [title, message, onDelete])` (`SwipeRow.tsx:52`), a `onDelete` jest wszędzie funkcją inline. Każdy render rodzica tworzy nowy `PanResponder`; przerysowanie w trakcie gestu (np. co minutę w treningu, `ActiveWorkout.tsx:99`) zeruje `dx`.
  - Można odsłonić kilka wierszy naraz.
  - Tapnięcie odsłoniętego wiersza wykonuje jego akcję zamiast go zamknąć (iOS zamyka).
- **Propozycja:** `onDelete` przez ref; jeden otwarty wiersz w kontekście; tapnięcie zamyka.
- **Test:** zmiana `onDelete` w trakcie ruchu nie resetuje przesunięcia.

### UI-18 — Co jest zablokowane w trakcie treningu: różna informacja
- **Waga:** NISKA.
- **Dowód (Z KODU):**
  - Edytor szablonu: „Trening w toku” + okno „Najpierw zakończ albo anuluj…”.
  - `DayPanel` chowa „Start” bez wyjaśnienia (`DayPanel.tsx:44`).
  - Dozwolone bez ostrzeżeń o treningu: usunięcie jego szablonu, reset danych, usunięcie miejsca (UI-06).
- **Propozycja:** w `DayPanel` zamiast chowania — wyszarzony „Start” z dopiskiem „Trening w toku”.

## Sprawdzone i w porządku

- **Usuwanie gestem — 16 miejsc.** Szablon (także archiwum), sesja, ćwiczenie z biblioteki, guma, miejsce, plan z „Innych planów”, pozycja, seria i zamiennik w szablonie, talerz, ćwiczenie i seria w edycji historii, ćwiczenie / usunięte / pominięte ćwiczenie i seria w treningu. Wszędzie ten sam komponent, tytuł-pytanie, [Nie, Usuń (destructive)] i akcja VoiceOver „Usuń …” na głównym elemencie wiersza. Brak „− seria” i „Usuń” w menu serii (ActionSheet). Szczegóły sesji bez przycisku usuwania. Brak „Cofnij” (zgodnie z decyzją).
- **Nie-usunięcia (świadome, odwracalne przełączniki):** „Pomiń dziś”/„Przywróć”, oznaczenie deload, „Wolne w tym dniu”/„Przywróć z planu”, „Archiwizuj”. Foldery nie mają usuwania — znikają, gdy są puste. „Anuluj trening” i „Wyczyść wszystkie dane” to akcje, nie wiersze; obie z potwierdzeniem.
- **Edycja historii:** szkic z „Anuluj”/„Zapisz”, pytanie przy zmianach, gest cofania wyłączony. Pola liczbowe (`NumInput`) zapisują przy każdym znaku i przyjmują przecinek. kg/lb przez `wField`/`wInKeep` we wszystkich trzech edytorach serii.
- **Cudzysłowy:** „…” konsekwentnie, brak "…" i “…”.
- **Przewodnik:** kroki odpowiadają nazwom przycisków (PL i EN, 13 odwołań).
- **Start treningu przy treningu w toku:** zablokowany na każdej drodze (Trening, Dziś, `DayPanel`, edytor szablonu).
- **Kolory:** poza UI-09 brak zaszytych kolorów; wykresy SVG używają `F.regular`.

**Odpowiedź na pytanie właściciela o krój na karcie „teraz”:** na d2a1e85 wszystko na karcie jest w IBM Plex — nic w kroju systemowym, nic w Tektur (POTWIERDZONE, UI-L, z dziedziczeniem zagnieżdżonych `<Text>`):

| Element karty | Krój | Rozmiar |
|---|---|---|
| Nazwa ćwiczenia / „dalej: …” | Plex Sans Bold | 20 |
| „seria 1 z 2” | Plex Sans SemiBold | 14 |
| Duża liczba „100 × 5” (`adjustsFontSizeToFit`) | Plex Sans Bold | 64 |
| Zagnieżdżone „ kg” (skaluje się razem z liczbą) | Plex Sans SemiBold | 18 |
| Notatka, „ostatnio …”, przypis | Plex Sans Regular | — |
| Podpisy grafiki sprzętu | Plex Sans SemiBold | 12 |
| Liczby na talerzach, stosie, stacji | Plex Mono SemiBold | — |
| Odliczanie przerwy | Plex Mono SemiBold | 34 |
| Pierścień serii na czas | Plex Mono SemiBold | — |
| „−15 / +15 / Pomiń” | Plex Sans SemiBold | — |
| „Seria zrobiona” / „Zakończ trening” | Plex Sans Bold | 19 |

To zgadza się z decyzją (nagłówki i duże liczby — Plex Sans Bold, timery — Plex Mono). Na telefonie jest build 1004 z `main` f435c8c, gdzie `F.heavy = Tektur_700Bold`, a `F.display = Tektur_800ExtraBold` (`git show f435c8c:lib/theme.ts`). Nagłówek, duża liczba i przycisk są tam w Tektur — to właśnie widzi właściciel.

Drobiazg: `F.monoBold` to w rzeczywistości SemiBold 600 (tylko nazwa tokenu).

Jedna rzecz do sprawdzenia na telefonie (niesprawdzalna na Linuksie): kroje ładują się z limitem 3 s (`app/_layout.tsx:17`). Po przekroczeniu aplikacja startuje w kroju systemowym.

Uwaga dla koordynatora: pliki `tests/zz-audit-ui-*.test.tsx` w worktree są tylko dowodami, nie do commita.

