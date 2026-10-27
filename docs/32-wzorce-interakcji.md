# 32. Wzorce interakcji — akcje tego samego typu działają tak samo (13.10.2026)

**Zasada (właściciel, 13.10.2026):** akcje i elementy tego samego typu działają w całej aplikacji tak samo — sposób wywołania, miejsce, wygląd, etykieta, potwierdzenie,
informacja zwrotna, VoiceOver. Ten katalog jest źródłem prawdy; nowa funkcja najpierw sprawdza tu wzorzec, a dopiero potem go tworzy. Wzorce pilnują testy-strażniki
(`tests/interaction-guards.test.ts` — S2–S17, `tests/close-button-guard.test.tsx` — S1, `tests/swipe-delete.test.tsx` — usuwanie).
Podstawa: audyt spójności z 13.10.2026 (28 niespójności N1–N28; decyzje właściciela „wszystko A” z tego samego dnia), wytyczne Apple HIG (strony: Sheets, Modality, Alerts,
Toolbars, Action sheets, Toggles, Text fields, Feedback, Buttons, Undo and redo). Cytaty — najwyżej 2 zdania, z adresem: https://developer.apple.com/design/human-interface-guidelines/…

## Decyzje właściciela (13.10.2026)
1. **Zamykanie okien:** „Anuluj” po LEWEJ w nagłówku wszystkich okien wysuwanych z dołu (także gdy nie ma czego zapisać) — jak edytory na szkicu (Anuluj lewo / Zapisz prawo) i HIG Sheets.
2. **Rezygnacja w oknach potwierdzeń:** zawsze „Anuluj”; jedyny wyjątek „Wróć do edycji” przy odrzucaniu zmian (jedna stała, `lib/confirm.ts`).
3. **Dodawanie na listach:** „+” w nagłówku ekranu, wszędzie tak samo (jeden komponent, etykieta VoiceOver „Dodaj …”).
4. **Edycja:** model jak dziś — szkic z „Anuluj / Zapisz” w nagłówku dla szablonu, ćwiczenia i sesji; reszta (miejsca, gumy, plan, ustawienia) zapisuje od razu (patrz wzorzec 3).
5. **Powrót:** strzałka z napisem „Wróć”, jak dziś (ujednolicone tam, gdzie odstawało).
6. Naprawić wszystkie niespójności N1–N28 w wydaniu 0.17 i dodać strażniki.
7. (poza tą zmianą) generator dokładający ćwiczenia do celu — osobna zmiana po 0.17 (docs/21, backlog).
8. **Przerwanie pomiaru serii (13.10.2026, wariant A):** pominięcie ćwiczenia pyta o potwierdzenie (`confirmSkipTimedSet`), zamiana ćwiczenia — zwykła i w oknie „Dostosuj do miejsca” — nie pyta. Zamierzona różnica: zamiana to celowy wybór innego ćwiczenia, pominięcie łatwo wybrać przypadkiem. Odrzucone B: pytanie także przy zamianie.

9. **Redesign M3 (21.10.2026, STOP 2 i STOP E3; docs/18, wpisy z 21.10.2026):** zatwierdzone W1 (a) przyciski w nagłówku — wzorzec 19, W2 (a) „Usuń {obiekt}” na dole szczegółów — wzorzec 5, W3 (a) nazwa ćwiczenia na tablicy wersalikami — wzorzec 28; przepływy ZM-01…07 (`docs/design/to-be.md`) zmieniają wzorce 3, 5, 14, 15, 18, 19, 24 i dodają 29–30. Kod i strażniki dostosowuje rola 08 w partiach M3 (`docs/design/design-spec.md` §10); do tego czasu kod działa według stanu sprzed 21.10.2026.
10. **Turkus jako drugi akcent informacyjny (DEC-07 K2, właściciel 23.10.2026, wariant a; M1-023):** turkus (token `band` w `docs/design/tokeny.ts`: jasny `#0F6469`, ciemny `#5FC3C9`) zostaje bez zmian do 1.0 jako **drugi akcent informacyjny** obok głównego akcentu (granat/krem). Dziś służy do informacji: oznaczenia rekordów (PR), znaczniki serii łączonych, paski postępu, odliczanie przerwy i plakietki serii; nie służy do przycisków głównych ani stanów (zrobione, błąd, mniej mają własne tokeny `done`, `danger`, `less`). Porządek użycia turkusu w całej aplikacji — w 1.0.x. Odrzucone: usunięcie turkusu przed 1.0 (ryzyko regresji wyglądu tuż po redesignie M3).

## Katalog wzorców

### 1. Zamykanie okna (arkusz, okno modalne) — S1
- **Wzorzec:** „Anuluj” po lewej w nagłówku (`components/CloseButton.tsx`: `CloseButton`, `useCloseHeader`, `useDismiss`), testID `close-modal`, `HeaderButton` (pole 44 pt, limit powiększenia tekstu). Gest w dół zostaje dodatkowo.
- **Miejsca:** `picker`, `swap`, `pick-template`, `paywall` (trasy `presentation: 'modal'`), arkusz „Inny trening” (`components/StartPanel.tsx`, `<Modal>`: „Anuluj” z lewej, tytuł pośrodku; dawny dolny „Anuluj” usunięty).
  Ekran zakupu: przycisk jest w nagłówku zawsze, „Nie teraz” (limit, pierwszy trening) zostaje na dole tam, gdzie był — oba prowadzą w to samo miejsce, zamknięcie nie jest ukryte ani mylące.
- **Poza wzorcem (nie okna):** panel „Co nowego” (rozwijana karta, własne „Zamknij”), `Alert`/`Alert.prompt` (własne przyciski), `ActionSheetIOS` (systemowe „Anuluj”).

### 2. Powrót
Strzałka systemowa z podpisem „Wróć” (`headerBackTitle`), gest od krawędzi. Szkice (wzorzec 3) mają „Anuluj” zamiast strzałki. Ekrany „nie ma takiego …” pokazują `Missing` (wzorzec 15) z przyciskiem „Wróć” —
bez własnego `headerLeft` (dawne „Wróć” w nagłówku edycji sesji usunięte; strzałka systemowa zostaje).

### 3. Zapis i anulowanie edycji — S3
- **Szkic (szablon, ćwiczenie, sesja / trening wstecz):** podgląd → „Edytuj” → nagłówek `DraftHeader`: „Anuluj” (lewo) i „Zapisz” (prawo, pogrubione), gest cofania wyłączony; etykiety VoiceOver nazywają obiekt
  („Anuluj edycję szablonu” / „Zapisz szablon”, ćwiczenia, **sesji**). Zapis **tylko w nagłówku** — bez drugiego przycisku na dole (usunięto „Zapisz zmiany” z edycji sesji). „Anuluj” ze zmianami pyta „Odrzucić zmiany?” [Wróć do edycji, Odrzuć zmiany].
- **Zapis od razu:** konfiguracja — miejsca, gumy, plan tygodnia i zapisane plany, ustawienia. Pole zapisuje się po zmianie; nie ma przycisku „Zapisz”. Formularze z jednym zatwierdzeniem (pomiar masy ciała, generator, plan z moich szablonów) mają przycisk akcji w treści.
- Reguła wyboru: szkic dla obiektów, których zmiana działa wstecz albo na trening; zapis od razu dla konfiguracji. (Odrzucona alternatywa: szkic także dla miejsca.)

### 4. Dodawanie elementu — S4
- **Wzorzec:** „+” w prawym górnym rogu nagłówka (`components/AddButton.tsx`: `AddButton`, `useAddHeader`, testID `add-button`), etykieta VoiceOver „Dodaj {obiekt}”: **Dodaj szablon / ćwiczenie / miejsce / gumę / plan**. Blokada podwójnego tapnięcia w komponencie.
  Zachowanie po stuknięciu zależy od obiektu (edytor nowego szkicu; lista presetów miejsc w treści; guma dodana od razu), ale wywołanie jest wszędzie takie samo. „Dodaj plan” znika przy pełnej liście planów.
- **Zostaje na dole listy** dodawanie do edytowanego obiektu: „+ Dodaj ćwiczenie” (trening, szablon, sesja), serie, talerze.

### 5. Usuwanie — `tests/swipe-delete.test.tsx`
Przesunięcie w lewo → „Usuń” → okno [Anuluj, Usuń (destructive)]; VoiceOver: akcja „Usuń …”. Jeden komponent `components/SwipeRow.tsx`. **Zmiana 19.10.2026 (DEC-12, M1-028; zastępuje decyzję z 07.10.2026 „bez usuwania z menu”):** gest zostaje, ale w treningu jest też widoczna alternatywa — „Usuń serię” w menu serii (arkusz po stuknięciu numeru serii) i „Usuń ćwiczenie” w menu ćwiczenia („⋯” w nagłówku, etykieta „Opcje ćwiczenia: {nazwa}”); oba prowadzą do tego samego okna potwierdzenia co gest (`confirmDelete` w `components/SwipeRow.tsx`), ostatnia seria bloku pokazuje to samo wyjaśnienie (`lastSetBlock`). Test: `tests/audit-m1-028-delete-menus.test.tsx`. Okno z wyjaśnieniem blokady ma jedyny przycisk „OK”.
**Zmiana 21.10.2026 (M3 ZM-04, W2 wariant a; docs/18; zamyka „poza treningiem — otwarte”):** gest zostaje jako skrót (DEC-12), a każde usuwanie poza treningiem ma widoczną drogę bez gestu:
- **ekrany szczegółów** (sesja, szablon, ćwiczenie własne, miejsce inne niż główne; czy także ćwiczenie wbudowane, które gest dziś usuwa z biblioteki — `[DO USTALENIA]`, `docs/design/design-spec.md` §10): przycisk `Btn danger` „Usuń {obiekt}” na dole ekranu, jedyny przycisk destrukcyjny ekranu, oddzielony od innych akcji odstępem grupy (24 pt) → to samo okno co gest (`confirmDelete`, [Anuluj, Usuń]); etykieta jak akcja gestu (np. „Usuń sesję”, „Usuń szablon”, „Usuń z biblioteki”), w trybie podglądu, nie w szkicu;
- **listy bez ekranu szczegółów** (pomiary masy ciała, gumy): „Edytuj” w nagłówku (wzorzec 19) → tryb usuwania jak listy iOS (przy wierszu przycisk usunięcia z etykietą „Usuń {obiekt}: {nazwa}”, „Gotowe” kończy tryb) → to samo okno;
- **edytory poza treningiem (04-studio-projektowe-003, 21.10.2026):** jak w treningu (DEC-12) — „Usuń serię” w menu serii i „Usuń ćwiczenie” w „⋯” ćwiczenia (`components/ExMenuButton.tsx`) w edytorze szablonu i w edycji sesji; zamiennik w szablonie ma przycisk „Usuń” (etykieta „Usuń zamiennik: …”); zapisany plan (`/plan?id=`) ma na dole przycisk „Usuń plan” (DeleteButton) — wszystko prowadzi do tego samego okna co gest. Test: `tests/swipe-delete.test.tsx` („droga bez gestu”).
- **bez zmian:** talerze i ciężary w edytorze miejsca mają już widoczne „Usuń odznaczone” (wyjątek wyżej); miejsce główne i ostatnia seria bloku — bez usuwania, jak dotąd. Odrzucone: „Usuń” w menu „⋯” nagłówka szczegółów (W2 b). Wyjątki: „Usuń odznaczone” w edytorze ciężarów, „✕” zakresu powtórzeń.

### 6. Potwierdzanie akcji — S5
`lib/confirm.ts`: `confirm({ title, message, action, destructive, … })`, `cancelButton()` („Anuluj”), `backToEditButton()` („Wróć do edycji”), `okButton()`. Ręczne `style: 'cancel'` zakazane. HIG Alerts: „Always use the title “Cancel” for a button that cancels an alert’s action.”
Wyjątek nazwany: prośba o zgodę na powiadomienia ma „Nie teraz” (odroczenie pytania, nie anulowanie akcji; `lib/planReminder.ts`). Styl `destructive` dla usunięcia, odrzucenia, „Wyczyść”, „Importuj”, „Zastąp”, „Wyłącz” plan.

### 7. Cofanie — S9
„Cofnij” = odwrócenie ostatniej zmiany (zamiana ćwiczenia: „↺ cofnij” w bloku i „↺ cofnij zamianę: {nazwa}” w oknie zamiany — to samo potwierdzenie). „Przywróć” = odzyskanie usuniętego, zarchiwizowanego albo pominiętego obiektu.

### 8. Edycja na żądanie
Ekran szczegółów: tytuł nagłówka = rodzaj obiektu, H1 = nazwa, obok „Edytuj” z etykietą „Edytuj X” (szablon, ćwiczenie, sesja). Bez zmian.

### 9. Wybór z listy — S6 (częściowo)
1 z 2–4 → `Segmented` (naprawiono: tryb generatora, Tydzień/Miesiąc w podsumowaniu); 1 z wielu krótkich → chipy (`selected`); długa lista / wyszukiwanie → okno modalne z „Anuluj” (wzorzec 1);
kontekstowy wybór ≤ 3 opcje + Anuluj → arkusz akcji (np. „⋯” przy wierszu ekranu Kolejność: „Przesuń wyżej / niżej” — przyciskowa alternatywa przeciągania, M1-audytor-generalny-026, 27.10.2026; test `tests/audit-m1-026-kolejnosc-menu.test.tsx`). Stan wybrania zawsze przez `accessibilityState.selected` (nie w etykiecie) — import CSV dostał `selected` na wierszach.

### 10. Wpisywanie liczb — S7
`NumInput` (przecinek wg języka, klawiatura numeryczna, przycięcie do limitu). Przerwa: zawsze pole z etykietą „… (s)”; przerwa w treningu — okno z wpisem „Przerwa (s)” (zostaje: ma „Zapamiętaj”). Daty: `DateField` (wzorzec 22).

### 11. Przełączniki i ustawienia — S6
Boolean w formularzu → `SwitchRow` (naprawiono „Asysta gumą”). Wybór wielokrotny chipami → `Chip toggle` (rola „switch”; naprawiono partie mięśni). 1 z 2–4 → `Segmented`.

### 12. Start treningu
Wszystkie drogi przez `lib/start.ts`. Przy treningu w toku „Start” z podglądu szablonu i z panelu dnia: ten sam przycisk (wyszarzony) i to samo okno (`workoutInProgressNotice`): „Trening w toku” / „Najpierw zakończ albo odrzuć bieżący trening.” (słowo jak przycisk „Odrzuć trening”).

### 13. Zakończenie i odrzucenie treningu
„Zakończ” → pytanie z liczbami [Anuluj, Zakończ]; „Odrzuć trening” → [Anuluj, Odrzuć trening (destructive)].

### 14. Komunikaty o błędach i sukcesie — S8
- Rutynowy sukces — widoczna zmiana bez okna; sukces bez widocznego wyniku (import) — Alert z liczbami. **Generator (M3 ZM-03, 21.10.2026):** po „Zapisz szablony i plan” bez okien — przejście do Planowania z jednym zdaniem potwierdzenia na ekranie (ogłaszanym przez `announce`); pytanie o zastąpienie aktywnego planu zostaje (decyzja z konsekwencją, wzorzec 6).
- Błąd akcji — Alert, którego **tytuł mówi, co się nie udało** („Nie udało się wyeksportować kopii”, „… zaimportować pliku”, „… dokończyć zakupu” itd.); zakaz tytułu „Nie udało się” bez dopowiedzenia.
- Komunikat w treści ogłasza VoiceOver (`lib/announce.ts`: `announce`, `useAnnounce`); `accessibilityLiveRegion` zakazane (w React Native działa tylko na Androidzie). HIG Feedback: „Make sure all feedback is accessible.”
- Informacja przy starcie nie blokuje (HIG Alerts: „Avoid showing an alert when your app starts.”): autozapis porzuconego treningu to wiersz „Trening zapisał się sam” na ekranie Trening (`lib/notices.ts`), znika po stuknięciu.
  Wyjątek: pytanie „Niezapisane zmiany” przy odzyskiwaniu szkicu po zamknięciu aplikacji (wymaga decyzji, nie jest informacją).

### 15. Puste stany i „nie ma takiego …” — S10
Cała lista pusta → `Empty` (z akcją, jeśli jest; od M3 z grafiką motywu A2 — gryf z talerzami, dekoracja ukryta dla VoiceOver i przy „Zwiększ kontrast”); Postępy bez historii: sam pusty stan z akcją „Zacznij trening” (ZM-06, 21.10.2026); podsekcja → `Muted` (np. „Z szablonu” w treningu wstecz, gdzie zawsze jest też „Pusty trening”). „Nie ma takiego …” / „Brak sesji.” → `Missing` (`components/ui.tsx`: `Empty` + przycisk „Wróć”).

### 16. Długie akcje
Eksport/import kopii, import CSV: `Btn loading` — wskaźnik w przycisku, przycisk nieaktywny, `accessibilityState busy`. HIG Buttons: „Configure a button to display an activity indicator when you need to provide feedback about an action that doesn’t instantly complete.”

### 17. Przejścia w aplikacji i linki
Przejście w aplikacji → rola `button` (`Item`, `Btn nav`, blokada podwójnego tapnięcia). Rola `link` zakazana (S14). Strony zewnętrzne: `Btn` z podpowiedzią „Otwiera stronę w przeglądarce.” Pole dotyku ≥ 44 pt.
Przycisk, który **przechodzi na inny ekran**, ma po tytule „›” (np. „Technika ›” przy ćwiczeniu — dawniej „ⓘ Technika”; ⓘ ma od 14.10.2026 wyłącznie znaczenie wzorca 26: rozwija tekst w miejscu).

### 18. Przyciski główne i drugorzędne
`Btn`: `primary` (jedna główna akcja ekranu), `default`, `ghost`, `danger`. Wyjątki nazwane: duży Start (`StartPanel`) i karta „teraz” (decyzja „Tuleja” 07.10.2026) — od M3 **tablica „teraz”** (element firmowy, wzorzec 29) z przyciskiem głównym „Seria zrobiona” pod nią.
**M3 ZM-02 (21.10.2026):** na ekranie treningu główną akcją jest seria; „Zakończ” jest przyciskiem drugorzędnym w nagłówku (wzorzec 30), nie najmocniejszym akcentem ekranu. Przycisk główny = barwy `accent` + `accentInk` w obu motywach (w ciemnym jasny).

### 19. Nagłówki ekranów
Zakładki — własne H1; stos — tytuł w nagłówku (ekrany pod Więcej bez H1); szczegóły: tytuł = rodzaj, H1 = nazwa. Ekran zakupu **bez** H1 powtarzającego tytuł. Przyciski w nagłówku: tylko wzorce 1, 3, 4 oraz **wyjątki nazwane z M3 (W1 wariant a, 21.10.2026; docs/18)** — każdy jako jeden wspólny komponent z `HeaderButton` (44 pt, limit powiększenia), dopuszczony przez strażnik S2:
(a) trening w toku: „⋯” (menu treningu: miejsce, pauza, głos, notatka szablonu; etykieta „Opcje treningu”) i „Zakończ” (wzorzec 30);
(b) listy z trybem usuwania bez ekranu szczegółów: „Edytuj” / „Gotowe” (wzorzec 5), obok „+” (wzorzec 4) — w trybie edycji „+” znika;
(c) ekran Trening bez treningu w toku: „Planowanie” (przejście do planu, etykieta „Planowanie”; zastępuje przycisk pod nagłówkiem planu) — **w linii tytułu po prawej, jak w zakładce Plan** (DEC-07 K3 a, 23.10.2026; wdrożone 27.10.2026, M1-audytor-generalny-024; test `tests/m3-p2-start.test.tsx`); przy wąskim ekranie i dużym tekście wiersz tytułu się zawija i przycisk przechodzi pod tytuł.
Odrzucone: „Planowanie” w treści (W1 b). Szczegóły: tytuł środkowy skraca się wielokropkiem, przyciski nie (limit powiększenia przycisków jak dziś w `HeaderButton`: 1,4).

### 20. Rozwijanie i zwijanie — S11
Znaki ▸/▾ (zakaz ⌃ ⌄ ▴), `accessibilityState.expanded` (`Btn expanded`, `Item expanded`), etykieta VoiceOver stała (np. „Więcej opcji”, „Cele partii”). Menu otwierające arkusz („📍 Dom ▾”) to nie rozwijanie.
Stan domyślny sekcji „Technika” w karcie ćwiczenia (decyzja właściciela 27.10.2026, wariant B): rozwinięta; zwinięta w podglądzie otwieranym w kontekście treningu na żywo (`?cues=0`), „Technika ›” (`?cues=1`) rozwija. Przycisk sekcji zwija i rozwija w obu przypadkach.

### 21. Wyszukiwanie — S15
`SearchField` (`components/ui.tsx`): „Szukaj {czego}…”, przycisk czyszczenia (`clearButtonMode`), limit 80 znaków, bez autokorekty; autoFocus tylko w oknach wyboru. HIG Text fields: „Display a Clear button in the trailing end of a text field to help people erase their input.”

### 22. Formaty liczb, dat i czasu — S7, S12
Liczby: `fmtNum`/`fmtW`/`fmtVol`. Przerwa: `fmtSec` (zawsze, także w treningu: „45 s”); czas trwania: `fmtDur`. Daty: dzień z miesiącem słownie („pon., 12 paź”) — `fmtDayKey`/`fmtDate`/`lib/calendar.ts` (`fmtDayMonth`, `fmtWeekdayDayMonth`, `weekdayLabels` …);
formatowanie dat tylko w `lib/state/time.ts`, `lib/calendar.ts`, `lib/period.ts`. Pole daty: `DateField` (RRRR-MM-DD ze strzałkami ‹ ›) w całej aplikacji. Nagłówki kolumn serii: „#”, ciężar, „Pow.”, „m”, „sek.” (wpis) / „Czas” (wartość sformatowana), „RPE”, „Guma”, „Przerwa”.

### 23. Etykiety VoiceOver i role — S13, S14
Każdy `Pressable` ma `accessibilityLanguage = lang()` (albo `accessible={false}`); przyciski — `button`; przełączniki — `switch` + `checked`; wybór — `selected`; rozwijanie — `expanded`; usuwanie — akcja dostępności; nagłówki — `header`.

### 24. Seria „do uzupełnienia” i prośba przed „Zakończ” (0.20, decyzja właściciela 13.10.2026)
Seria odhaczona na zegarku jako „zrobione inaczej niż w planie” ma w wierszu napis „do uzupełnienia” (słowem, nie samym kolorem) i przycisk „Gotowe”. „Zakończ” z takimi seriami pyta najpierw: tytuł „Serie do uzupełnienia”, przyciski
[Anuluj, Zakończ mimo to] — „Anuluj” wraca do treningu (wzorzec 6; jedyny przycisk potwierdzający to akcja, nie „Tak”). Rekord liczy się dopiero po uzupełnieniu. Zegarek ma te same etykiety co telefon (M3 ZM-05, 21.10.2026: w trakcie pomiaru serii na czas jedna nazwa „Zakończ serię” na tablicy, w dolnym pasku, w VoiceOver i na zegarku; po pomiarze „Seria zrobiona”; „Seria zrobiona”, „Pomiń”,
„Anuluj”, „Cofnij”); „Pomiń” pyta o potwierdzenie na zegarku (decyzja 8), a przycisk i gest wywołują zawsze akcję główną ekranu. Szczegóły: docs/35.

### 25. Wykres „okres vs okres” — dwa słupki na partię (decyzja właściciela 14.10.2026, uwagi z testu na telefonie)
**Wzorzec:** wyżej okres 1 (np. ten tydzień), niżej okres 2 (np. poprzedni tydzień), na jednej osi (max z obu słupków i kreski celu); przy każdym słupku nazwa okresu słowami z próbką (okres 1 — pełny kolor, okres 2 — szary z prążkami: okresów nie odróżnia
sam kolor) i liczba po prawej (zawija się przy wąskim ekranie i dużej czcionce); okres 2 równy zeru ma tor i znacznik zera, a gdy cały okres jest pusty — opis „0 (brak danych)”. VoiceOver: „partia: okres 1 X, okres 2 Y”, potem cel i „co najmniej”.
Komponenty: `HatchBar`, `PeriodLine`, `prevText` w `components/ProgressBars.tsx`; użyte w Postępach (`MuscleCompare`: serie i objętość per partia) i w Progresji (`MuscleRows` z `showPrev`). Ekran Trening nie ma już pasków partii — pokazuje sylwetkę z kierunkiem zmiany (wzorzec 26); paski serii z celem są tylko w Postępach. Testy: `tests/period-bars.test.tsx`.
Sekcja „Progresja” (trzy kafelki) jest tylko w Postępach — z ekranu Trening usunięta 14.10.2026.

### 26. Strażnik progresji — kierunek partii, cel serii, sylwetka (decyzje właściciela 14.10.2026; implementacja: `lib/guard.ts`, `components/Guard.tsx`, `components/GuardSection.tsx`)
**Dwie osobne odpowiedzi na partię.** (1) Cel serii: wykonane + zaplanowane na resztę tygodnia wobec celu (ręcznego albo automatycznego); „poniżej celu” tylko po całym planie, partia bez serii i planu to „bez serii”.
(2) Kierunek względem poprzedniego tygodnia: więcej / tyle samo / mniej, bez progów procentowych i bez oceny; kolory neutralne (bez „za mało / za dużo / ryzyko”).
**Miara kierunku:** tonaż średnio na sesję ćwiczenia, tylko ćwiczenia powtórzone w obu tygodniach (reszta wykluczona z obu i wymieniona jako „Pominięte”); tonaż spadł, a ciężar roboczy wzrósł → progres;
„tyle samo” = ta sama liczba na ekranie (`volOut`). Tydzień deloadu: bez oceny; tydzień po deloadzie: wobec ostatniego tygodnia bez deloadu, z podaną datą. Pierwszy tydzień: „nowe”.
**Każdy stan ma znak, słowo i wzór** (nie tylko kolor): ▲ więcej (akcent) · = tyle samo (przygaszony) · ▼ mniej (pomarańcz `less` z kreskowaniem 45°) · ? bez porównania (kropkowanie) · ○ bez serii (obrys przerywany) · + nowe (kropki) · deload (poziome paski).
**Ekran Trening:** sylwetka + legenda (zawija się) + najwyżej dwa zdania + jeden przycisk „Szczegóły w Postępach ›” (≥ 44 pt, podpowiedź „Otwiera Postępy.”); żadnej listy pasków ani serii pośrednich.
**Postępy → „Strażnik progresji”:** grupy od problemów (poniżej celu — największa luka pierwsza, mniej, bez porównania, tyle samo, nowe, więcej), wiersze rozwijane wzorcem 20 (▸/▾, `expanded`, po wyjściu zwinięte), pasek serii do 2× cel z „»”, serie pośrednie tylko tu.
**VoiceOver:** sylwetka to obraz z etykietą stanów („Ten tydzień wobec poprzedniego: więcej — …; tyle samo — …; mniej — …; bez porównania — …”); legenda ukryta; wiersz czyta słowo stanu zamiast znaku. Testy: `tests/guard.test.ts`, `tests/guard-ui.test.tsx`, scenariusz Maestro `52-straznik-progresji.yaml`.

### 27. Teksty objaśniające pod ⓘ — S17 (decyzje właściciela 14.10.2026)
Ekrany mają być lekkie: **objaśnienia i źródła** chowają się pod ikoną ⓘ przy nagłówku (treść i oznaczenia „jedno źródło” / „uproszczenie” bez zmian — tylko przeniesione), a na wierzchu zostaje krótka linia albo nic.
- **Jeden komponent:** `components/InfoTip.tsx` (`InfoTip`, `InfoButton` + `InfoBox` + `useInfoOpen`). Nagłówki podpinają go przez parametr `info` + `infoId` w `SectionTitle`, `H2`, `Field`, `SwitchRow`; krótką linię (`Muted`) owija `InfoTip` wprost. Okrąg „i” rysowany widokiem (24 pt, obrys `muted`, po rozwinięciu `accent`), nie znak U+24D8.
- **Zachowanie:** rozwinięcie **w miejscu** pod nagłówkiem (ramka `surface2`, zaokrąglenie 10); drugie stuknięcie zwija; **stan nie jest zapamiętywany** (każde wejście na ekran zaczyna od zwiniętego); nic nie rozwija się samo.
- **Pole dotyku** ≥ 44 pt (24 pt + `hitSlop` 10 z każdej strony). Na wąskim ekranie (320 pt) nagłówek i ⓘ zawijają się razem (`flexWrap`), kółko się nie ściska.
- **VoiceOver:** rola `button`, `accessibilityState.expanded`, etykieta stała „Więcej informacji: {nagłówek}” (także po rozwinięciu), podpowiedź „Pokazuje objaśnienie pod nagłówkiem.”, język aplikacji; rozwinięty tekst jest **następnym elementem**; bez automatycznego ogłaszania.
- **Dynamic Type:** rozwinięty tekst bez `numberOfLines`, rośnie do `TEXT_SCALE_MAX`; znak „i” do 1,3. Uproszczenie (nazwane): przy 200% długie złożenia (de, nl, sv, da, nb, fi) łamią się w środku wyrazu, jak w każdym tekście iOS (test: wyraz mieści się w dwóch wierszach).
- **Zostaje na wierzchu (nigdy pod ⓘ):** warunki subskrypcji, zastrzeżenia zdrowotne (`MedicalNote`), ostrzeżenia o utracie danych (np. „Serie bez wyniku nie zostaną zapisane.”, „Kopie automatyczne znikają razem z aplikacją…”), błędy i stany zapisu, prywatność, puste stany. Lista wyjątków z powodem: `LONG_OK` w `tests/interaction-guards.test.ts`.
- **Instrukcje gestów** (typ serii, notatka, przesunięcie w lewo, ⇅ SS, ≡) **nie stoją na ekranach** — są w Przewodniku (`lib/guide.ts`).
- **Strażnik lekkości (S17):** widoczny tekst pomocniczy (`<Muted>`, `detail=`) ma najwyżej **100 znaków** (polskie źródło) poza listą wyjątków z powodem.
- Nowy ekran z objaśnieniem: tekst pod ⓘ, krótka linia na wierzchu (jeśli potrzebna), `infoId` unikalny na ekranie (testID `info-{id}` i `info-text-{id}`; scenariusz Maestro 52).

### 28. Wersaliki i ciągi „A · B · C” (decyzja właściciela 20.10.2026, audyt M1-063, DEC-17 wariant a)
- **Wersaliki tylko w nagłówkach grup** (`SectionTitle`, tytuł grupy w strażniku progresji). W treści, przyciskach, etykietach wierszy i komunikatach tekst pisany normalnie. Wersaliki robi `upper()` / `upperText()` z regułami języka (A11-02), nigdy `textTransform: 'uppercase'` poza `upperText()` w `components/ui.tsx`.
- **Wyjątki z powodem:** (1) `components/TodayPlan.tsx` — nagłówek bloku „Dziś” i skróty dni tygodnia w pasku (etykiety kolumn, nie zdania); (2) `components/GuardSection.tsx` — tytuł grupy (nagłówek grupy); (3) `lib/state/sets.ts` `shortBand` — jedna litera koloru gumy, nie tekst; (4) **M3 W3 wariant a (21.10.2026, docs/18):** nazwa ćwiczenia na tablicy „teraz” i nagłówek „Dziś: …” na tablicy startu — jak nazwisko na tablicy podejść (przepisy IWF 3.3.6.15), przez `upperText()` (rozstrzelenie 4%, rola `boardName` w tokenach); przy dużym tekście nazwa łamie się na dwa wiersze, nie ucina. Odrzucone: nazwa na tablicy zwykłą pisownią (W3 b). Nowe użycie wymaga zmiany tej decyzji i wpisu tutaj.
- **„·” (kropka środkowa) tylko dla metadanych o stałej kolejności** (np. licencja · źródło w ekranie Licencje), czytanych jak etykiety. Zdania, powody i wartości zmiennej kolejności lub liczby elementów oddzielamy zwykłym zdaniem, przecinkiem albo osobną linią.
- **Odrzucone:** wariant B — limit dwóch elementów w liniach pomocniczych ekranu treningu (zmieniałby układ ekranu treningu przed redesignem wyglądu).
- **Stan kodu:** istniejące ciągi z `join(' · ')` o zmiennej kolejności (np. linie pomocnicze `app/swap.tsx`, `app/adapt.tsx`, `components/ActiveWorkout.tsx`) nie były przeglądane pod tym kątem — **[OTWARTE]** przegląd przy redesignie wyglądu; nowy kod stosuje regułę od 20.10.2026.
- **Strażnik wersalików:** `tests/audit-m1-063-caps-separators.test.ts` (lista miejsc z `upperText()` / `upper()` i brak `textTransform: 'uppercase'`).

### 29. Tablica „teraz” — wynik serii, ±, haptyka (M3 ZM-01, ZM-05, ZM-07; decyzje 21.10.2026, docs/18)
- **Wpis na tablicy:** ciężar i powtórzenia (albo czas / dystans) z podpowiedzi albo puste „—”. Stuknięcie liczby otwiera wpis (`NumInput`, wzorzec 10); obok liczby przyciski ± o krok sprzętu (okrągłe, 44 pt, etykiety „Zwiększ ciężar o {krok}” / „Zmniejsz ciężar o {krok}”, jednostka z `wu()`/`distUnit()`). Reguła kroku ± — sprawa merytoryczna (badacz), nie wzorzec.
- **„Seria zrobiona” bez wartości** nie odhacza serii: kursor przechodzi do pustego pola, bez okna; haptyka ostrzegawcza i ogłoszenie VoiceOver (`announce`). Sesje zapisane wcześniej z pustymi seriami zostają bez zmian.
- **Pola serii** (zrobiona — wypełnienie, bieżąca — ramka, czekająca — kontur, rozgrzewka — kontur kreskowany; stan niesie kształt, nie sam kolor) **nie są celem dotyku** (decyzja STOP E3): serię poprawia się w wierszu serii / menu serii (wzorzec 5). Do 4 pól z wynikiem, 5–12 w 1–3 rzędach, powyżej 12 przewijany rząd.
- **VoiceOver:** tablica to jeden element z opisem danych („{ćwiczenie}, seria 3 z 4, 80 kilogramów razy 6. Serie: 2 z 4 zrobione”; w przerwie zegar i następna seria) — tekst w `docs/design/design-spec.md` §2.
- **Haptyka i dźwięk (ZM-07):** dwa przełączniki w Ustawieniach — „Dźwięk na koniec przerwy” i „Wibracje”; każda haptyka zależy tylko od „Wibracje”, każdy dźwięk tylko od „Dźwięk…”. Zdarzenia: ✓ — lekkie stuknięcie; ± — „tick” (selection); „Seria zrobiona” bez wyniku — ostrzegawcza; koniec przerwy — sukces + dźwięk; usunięcie, zakończenie, błąd — bez haptyki (okno systemowe). Mapa: `HAPTICS` w tokenach. Wdrożenie (p5d, 21.10.2026): `Settings.haptics` (pole opcjonalne, bez zmiany schematu; brak pola = wibracje za `sound`, jedno miejsce reguły: `hapticsEnabled` w `lib/haptics.ts`); wibracje słuchają go w `lib/timer.ts` (koniec przerwy i stopera serii), na tablicy (± i ostrzegawcza) i w `DragList`; pierwsze przełączenie „Dźwięku” przy braku pola utrwala dotychczasowy stan „Wibracji”. Lekkie stuknięcie przy ✓ nie jest jeszcze zaimplementowane (do decyzji właściciela, także z zegarka).
- **Seria na czas:** jedna nazwa „Zakończ serię” w trakcie pomiaru (wzorzec 24).

### 30. Nagłówek treningu i prośba o zgodę na powiadomienia (M3 ZM-02, 21.10.2026, docs/18)
- Nagłówek w jednej linii: nazwa i czas treningu; po prawej „⋯” (miejsce, pauza, głos, notatka szablonu) i „Zakończ” (wzorzec 19 a). Nad tablicą najwyżej 3–4 elementy.
- Prośba o zgodę na powiadomienia przy **pierwszej przerwie**, wierszem pod tablicą („Przerwa trwa — powiadomić na koniec?”), nie w nagłówku; po odmowie komunikat raz, potem tylko w Ustawieniach. Przycisk odroczenia „Nie teraz” (wyjątek nazwany wzorca 6).
- Menu „⋯” to arkusz akcji z „Anuluj” (wzorzec 9, S16 — lista z powodem, jeśli przekroczy 3 opcje + Anuluj).

### 31. Nagłówek ekranu zakładki i wskaźnik przewijania (właściciel 22.10.2026, docs/18)
- Nagłówek Trening / Plan / Postępy / Więcej to wspólny `TabHeader` (`HEADER` w tokenach): ten sam odstęp pod bezpiecznym obszarem i pod tytułem; zmiana odstępu — w jednym miejscu.
- Ikonka dekoracyjna przy tytule (Trening: mała sztanga po napisie) stoi w wierszu tytułu, nie nad nim; ukryta dla VoiceOver, etykieta nagłówka bez zmian.
- Przewijanie: `ScrollView`, `FlatList` i `SectionList` tylko z `components/Scroll.tsx`; wskaźnik przewijania (pionowy i poziomy) ukryty na wszystkich ekranach — nie ma „kreski” przy krawędzi w treści.

## Strażniki (S1–S18)
| # | Strażnik | Plik | Stan |
|---|---|---|---|
| S1 | okno modalne / arkusz ma „Anuluj” w nagłówku (render każdego okna, PL/EN, jasny/ciemny) | `tests/close-button-guard.test.tsx` | jest |
| S2 | `headerLeft`/`headerRight` tylko przez DraftHeader / CloseButton / AddButton | `tests/interaction-guards.test.ts` | jest |
| S3 | edytory na szkicu: `cancelLabel` + `saveLabel`, bez zapisu na dole | j.w. | jest |
| S4 | ekrany list: `useAddHeader`, zakaz „+ Nowy / + Nowe / + Guma / + Dodaj miejsce” | j.w. | jest |
| S5 | `style: 'cancel'` tylko w `lib/confirm.ts`; zakaz „Nie”/„Wróć” jako przycisków | j.w. | jest |
| S6 | Switch / Segmented / Chip toggle w miejscach naprawionych | j.w. | częściowo — reguła „1 z 2–4 → Segmented” jest semantyczna, skan łapie tylko wskazane miejsca |
| S7 | przerwa przez `fmtSec`, etykiety „(s)” | j.w. | jest |
| S8 | zakaz `accessibilityLiveRegion`, zakaz ogólnego „Nie udało się”, brak Alertu przy starcie | j.w. | jest |
| S9 | słownik terminów (brak „anuluj bieżący trening”, „↺ przywróć” dla zamiany, pierwszej osoby) | j.w. | jest |
| S10 | „nie ma takiego …” przez `Missing`, pusta lista masy ciała przez `Empty` | j.w. | jest |
| S11 | zakaz ⌃⌄▴; ▸/▾ z `expanded` | j.w. | jest |
| S12 | formatery dat tylko w `time.ts` / `calendar.ts` / `period.ts`; zakaz `month: 'numeric'` | j.w. | jest |
| S13 | każdy `Pressable` ma `accessibilityLanguage` | j.w. | jest |
| S14 | zakaz roli „link”; komponenty wspólne mają 44 pt | j.w. | częściowo — Jest nie liczy układu, więc rozmiaru dotyku nie mierzymy; pilnujemy komponentów wspólnych |
| S15 | pola wyszukiwania tylko przez `SearchField` | j.w. | jest |
| S16 | arkusze akcji: wyjątki z powodem | j.w. | jest (wyjątki: lista miejsc użytkownika ma zmienną długość; rodzaje serii to 4 + notatka + Anuluj — dwupoziomowy arkusz wydłużyłby najczęstszą akcję treningu) |
| S17 | ⓘ: jeden komponent (etykieta, rola, `expanded`, pole 44 pt), teksty przeniesione tylko jako `info=`, widoczny tekst pomocniczy ≤ 100 znaków poza listą wyjątków z powodem, gesty tylko w Przewodniku | j.w. + `tests/info-tip.test.tsx`, `tests/matrix-i18n.test.tsx` (szerokość 320 pt), `.maestro/53-objasnienia-info.yaml` | jest |
| S18 | przewijanie: ScrollView/FlatList/SectionList tylko z `components/Scroll.tsx` (wskaźnik ukryty), brak `persistentScrollbar`/`flashScrollIndicators` | `tests/interaction-guards.test.ts`, `tests/trening-naglowek.test.tsx` | jest |

## Słownik terminów
Anuluj (rezygnacja; okna i potwierdzenia) · Wróć (strzałka, przycisk „nie ma takiego …”) · Wróć do edycji (tylko odrzucanie zmian) · Zamknij (tylko panel „Co nowego”) · Cofnij (ostatnia zmiana) · Przywróć (usunięte / zarchiwizowane / pominięte) ·
Odrzuć trening (porzucenie treningu; nie „anuluj trening”) · Dodaj {obiekt} (etykieta „+”) · Nie udało się {co} (błąd z nazwą akcji).
