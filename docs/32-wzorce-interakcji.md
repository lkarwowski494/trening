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
Przesunięcie w lewo → „Usuń” → okno [Anuluj, Usuń (destructive)]; VoiceOver: akcja „Usuń …”. Jeden komponent `components/SwipeRow.tsx`. Okno z wyjaśnieniem blokady ma jedyny przycisk „OK”. Wyjątki: „Usuń odznaczone” w edytorze ciężarów, „✕” zakresu powtórzeń.

### 6. Potwierdzanie akcji — S5
`lib/confirm.ts`: `confirm({ title, message, action, destructive, … })`, `cancelButton()` („Anuluj”), `backToEditButton()` („Wróć do edycji”), `okButton()`. Ręczne `style: 'cancel'` zakazane. HIG Alerts: „Always use the title “Cancel” for a button that cancels an alert’s action.”
Wyjątek nazwany: prośba o zgodę na powiadomienia ma „Nie teraz” (odroczenie pytania, nie anulowanie akcji; `lib/planReminder.ts`). Styl `destructive` dla usunięcia, odrzucenia, „Wyczyść”, „Importuj”, „Zastąp”, „Wyłącz” plan.

### 7. Cofanie — S9
„Cofnij” = odwrócenie ostatniej zmiany (zamiana ćwiczenia: „↺ cofnij” w bloku i „↺ cofnij zamianę: {nazwa}” w oknie zamiany — to samo potwierdzenie). „Przywróć” = odzyskanie usuniętego, zarchiwizowanego albo pominiętego obiektu.

### 8. Edycja na żądanie
Ekran szczegółów: tytuł nagłówka = rodzaj obiektu, H1 = nazwa, obok „Edytuj” z etykietą „Edytuj X” (szablon, ćwiczenie, sesja). Bez zmian.

### 9. Wybór z listy — S6 (częściowo)
1 z 2–4 → `Segmented` (naprawiono: tryb generatora, Tydzień/Miesiąc w podsumowaniu); 1 z wielu krótkich → chipy (`selected`); długa lista / wyszukiwanie → okno modalne z „Anuluj” (wzorzec 1);
kontekstowy wybór ≤ 3 opcje + Anuluj → arkusz akcji. Stan wybrania zawsze przez `accessibilityState.selected` (nie w etykiecie) — import CSV dostał `selected` na wierszach.

### 10. Wpisywanie liczb — S7
`NumInput` (przecinek wg języka, klawiatura numeryczna, przycięcie do limitu). Przerwa: zawsze pole z etykietą „… (s)”; przerwa w treningu — okno z wpisem „Przerwa (s)” (zostaje: ma „Zapamiętaj”). Daty: `DateField` (wzorzec 22).

### 11. Przełączniki i ustawienia — S6
Boolean w formularzu → `SwitchRow` (naprawiono „Asysta gumą”). Wybór wielokrotny chipami → `Chip toggle` (rola „switch”; naprawiono partie mięśni). 1 z 2–4 → `Segmented`.

### 12. Start treningu
Wszystkie drogi przez `lib/start.ts`. Przy treningu w toku „Start” z podglądu szablonu i z panelu dnia: ten sam przycisk (wyszarzony) i to samo okno (`workoutInProgressNotice`): „Trening w toku” / „Najpierw zakończ albo odrzuć bieżący trening.” (słowo jak przycisk „Odrzuć trening”).

### 13. Zakończenie i odrzucenie treningu
„Zakończ” → pytanie z liczbami [Anuluj, Zakończ]; „Odrzuć trening” → [Anuluj, Odrzuć trening (destructive)].

### 14. Komunikaty o błędach i sukcesie — S8
- Rutynowy sukces — widoczna zmiana bez okna; sukces bez widocznego wyniku (import, generator) — Alert z liczbami.
- Błąd akcji — Alert, którego **tytuł mówi, co się nie udało** („Nie udało się wyeksportować kopii”, „… zaimportować pliku”, „… dokończyć zakupu” itd.); zakaz tytułu „Nie udało się” bez dopowiedzenia.
- Komunikat w treści ogłasza VoiceOver (`lib/announce.ts`: `announce`, `useAnnounce`); `accessibilityLiveRegion` zakazane (w React Native działa tylko na Androidzie). HIG Feedback: „Make sure all feedback is accessible.”
- Informacja przy starcie nie blokuje (HIG Alerts: „Avoid showing an alert when your app starts.”): autozapis porzuconego treningu to wiersz „Trening zapisał się sam” na ekranie Trening (`lib/notices.ts`), znika po stuknięciu.
  Wyjątek: pytanie „Niezapisane zmiany” przy odzyskiwaniu szkicu po zamknięciu aplikacji (wymaga decyzji, nie jest informacją).

### 15. Puste stany i „nie ma takiego …” — S10
Cała lista pusta → `Empty` (z akcją, jeśli jest); podsekcja → `Muted` (np. „Z szablonu” w treningu wstecz, gdzie zawsze jest też „Pusty trening”). „Nie ma takiego …” / „Brak sesji.” → `Missing` (`components/ui.tsx`: `Empty` + przycisk „Wróć”).

### 16. Długie akcje
Eksport/import kopii, import CSV: `Btn loading` — wskaźnik w przycisku, przycisk nieaktywny, `accessibilityState busy`. HIG Buttons: „Configure a button to display an activity indicator when you need to provide feedback about an action that doesn’t instantly complete.”

### 17. Przejścia w aplikacji i linki
Przejście w aplikacji → rola `button` (`Item`, `Btn nav`, blokada podwójnego tapnięcia). Rola `link` zakazana (S14). Strony zewnętrzne: `Btn` z podpowiedzią „Otwiera stronę w przeglądarce.” Pole dotyku ≥ 44 pt.
Przycisk, który **przechodzi na inny ekran**, ma po tytule „›” (np. „Technika ›” przy ćwiczeniu — dawniej „ⓘ Technika”; ⓘ ma od 14.10.2026 wyłącznie znaczenie wzorca 26: rozwija tekst w miejscu).

### 18. Przyciski główne i drugorzędne
`Btn`: `primary` (jedna główna akcja ekranu), `default`, `ghost`, `danger`. Wyjątki nazwane: duży Start (`StartPanel`) i karta „teraz” (decyzja „Tuleja” 07.10.2026).

### 19. Nagłówki ekranów
Zakładki — własne H1; stos — tytuł w nagłówku (ekrany pod Więcej bez H1); szczegóły: tytuł = rodzaj, H1 = nazwa. Ekran zakupu **bez** H1 powtarzającego tytuł. Przyciski w nagłówku: tylko wzorce 1, 3, 4.

### 20. Rozwijanie i zwijanie — S11
Znaki ▸/▾ (zakaz ⌃ ⌄ ▴), `accessibilityState.expanded` (`Btn expanded`, `Item expanded`), etykieta VoiceOver stała (np. „Więcej opcji”, „Cele partii”). Menu otwierające arkusz („📍 Dom ▾”) to nie rozwijanie.

### 21. Wyszukiwanie — S15
`SearchField` (`components/ui.tsx`): „Szukaj {czego}…”, przycisk czyszczenia (`clearButtonMode`), limit 80 znaków, bez autokorekty; autoFocus tylko w oknach wyboru. HIG Text fields: „Display a Clear button in the trailing end of a text field to help people erase their input.”

### 22. Formaty liczb, dat i czasu — S7, S12
Liczby: `fmtNum`/`fmtW`/`fmtVol`. Przerwa: `fmtSec` (zawsze, także w treningu: „45 s”); czas trwania: `fmtDur`. Daty: dzień z miesiącem słownie („pon., 12 paź”) — `fmtDayKey`/`fmtDate`/`lib/calendar.ts` (`fmtDayMonth`, `fmtWeekdayDayMonth`, `weekdayLabels` …);
formatowanie dat tylko w `lib/state/time.ts`, `lib/calendar.ts`, `lib/period.ts`. Pole daty: `DateField` (RRRR-MM-DD ze strzałkami ‹ ›) w całej aplikacji. Nagłówki kolumn serii: „#”, ciężar, „Pow.”, „m”, „sek.” (wpis) / „Czas” (wartość sformatowana), „RPE”, „Guma”, „Przerwa”.

### 23. Etykiety VoiceOver i role — S13, S14
Każdy `Pressable` ma `accessibilityLanguage = lang()` (albo `accessible={false}`); przyciski — `button`; przełączniki — `switch` + `checked`; wybór — `selected`; rozwijanie — `expanded`; usuwanie — akcja dostępności; nagłówki — `header`.

### 24. Seria „do uzupełnienia” i prośba przed „Zakończ” (0.20, decyzja właściciela 13.10.2026)
Seria odhaczona na zegarku jako „zrobione inaczej niż w planie” ma w wierszu napis „do uzupełnienia” (słowem, nie samym kolorem) i przycisk „Gotowe”. „Zakończ” z takimi seriami pyta najpierw: tytuł „Serie do uzupełnienia”, przyciski
[Anuluj, Zakończ mimo to] — „Anuluj” wraca do treningu (wzorzec 6; jedyny przycisk potwierdzający to akcja, nie „Tak”). Rekord liczy się dopiero po uzupełnieniu. Zegarek ma te same etykiety co telefon („Seria zrobiona”, „Pomiń”,
„Anuluj”, „Cofnij”); „Pomiń” pyta o potwierdzenie na zegarku (decyzja 8), a przycisk i gest wywołują zawsze akcję główną ekranu. Szczegóły: docs/35.

### 26. Teksty objaśniające pod ⓘ — S17 (decyzje właściciela 14.10.2026)
Ekrany mają być lekkie: **objaśnienia i źródła** chowają się pod ikoną ⓘ przy nagłówku (treść i oznaczenia „jedno źródło” / „uproszczenie” bez zmian — tylko przeniesione), a na wierzchu zostaje krótka linia albo nic.
- **Jeden komponent:** `components/InfoTip.tsx` (`InfoTip`, `InfoButton` + `InfoBox` + `useInfoOpen`). Nagłówki podpinają go przez parametr `info` + `infoId` w `SectionTitle`, `H2`, `Field`, `SwitchRow`; krótką linię (`Muted`) owija `InfoTip` wprost. Okrąg „i” rysowany widokiem (24 pt, obrys `muted`, po rozwinięciu `accent`), nie znak U+24D8.
- **Zachowanie:** rozwinięcie **w miejscu** pod nagłówkiem (ramka `surface2`, zaokrąglenie 10); drugie stuknięcie zwija; **stan nie jest zapamiętywany** (każde wejście na ekran zaczyna od zwiniętego); nic nie rozwija się samo.
- **Pole dotyku** ≥ 44 pt (24 pt + `hitSlop` 10 z każdej strony). Na wąskim ekranie (320 pt) nagłówek i ⓘ zawijają się razem (`flexWrap`), kółko się nie ściska.
- **VoiceOver:** rola `button`, `accessibilityState.expanded`, etykieta stała „Więcej informacji: {nagłówek}” (także po rozwinięciu), podpowiedź „Pokazuje objaśnienie pod nagłówkiem.”, język aplikacji; rozwinięty tekst jest **następnym elementem**; bez automatycznego ogłaszania.
- **Dynamic Type:** rozwinięty tekst bez `numberOfLines`, rośnie do `TEXT_SCALE_MAX`; znak „i” do 1,3. Uproszczenie (nazwane): przy 200% długie złożenia (de, nl, sv, da, nb, fi) łamią się w środku wyrazu, jak w każdym tekście iOS (test: wyraz mieści się w dwóch wierszach).
- **Zostaje na wierzchu (nigdy pod ⓘ):** warunki subskrypcji, zastrzeżenia zdrowotne (`MedicalNote`), ostrzeżenia o utracie danych (np. „Serie bez wyniku nie zostaną zapisane.”, „Kopie automatyczne znikają razem z aplikacją…”), błędy i stany zapisu, prywatność, puste stany. Lista wyjątków z powodem: `LONG_OK` w `tests/interaction-guards.test.ts`.
- **Instrukcje gestów** (typ serii, notatka, przesunięcie w lewo, ⇅ SS, ≡) **nie stoją na ekranach** — są w Przewodniku (`lib/guide.ts`).
- **Strażnik lekkości (S17):** widoczny tekst pomocniczy (`<Muted>`, `detail=`) ma najwyżej **100 znaków** (polskie źródło) poza listą wyjątków z powodem; ekrany Trening i Postępy mają wyjątek tymczasowy (`PENDING_FILES`) do czasu wdrożenia tam ⓘ.
- Nowy ekran z objaśnieniem: tekst pod ⓘ, krótka linia na wierzchu (jeśli potrzebna), `infoId` unikalny na ekranie (testID `info-{id}` i `info-text-{id}`; scenariusz Maestro 52).

## Strażniki (S1–S17)
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
| S17 | ⓘ: jeden komponent (etykieta, rola, `expanded`, pole 44 pt), teksty przeniesione tylko jako `info=`, widoczny tekst pomocniczy ≤ 100 znaków poza listą wyjątków z powodem, gesty tylko w Przewodniku | j.w. + `tests/info-tip.test.tsx`, `tests/matrix-i18n.test.tsx` (szerokość 320 pt), `.maestro/52-objasnienia-info.yaml` | jest (wyjątek tymczasowy: ekrany Trening / Postępy) |

## Słownik terminów
Anuluj (rezygnacja; okna i potwierdzenia) · Wróć (strzałka, przycisk „nie ma takiego …”) · Wróć do edycji (tylko odrzucanie zmian) · Zamknij (tylko panel „Co nowego”) · Cofnij (ostatnia zmiana) · Przywróć (usunięte / zarchiwizowane / pominięte) ·
Odrzuć trening (porzucenie treningu; nie „anuluj trening”) · Dodaj {obiekt} (etykieta „+”) · Nie udało się {co} (błąd z nazwą akcji).
