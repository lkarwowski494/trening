# BRD Trening — wymagania
Odtworzone z kodu i docs (OP-01). Każde wymaganie ma źródło w repo (decyzja, dokument, kod lub test); wartości liczbowe pochodzą z reguł RD (`reguly.md`), nie z kryteriów.

## Przepływy

### PR-01: Zapis treningu
- P-1, J-01. Kroki: wybiera szablon albo pusty trening; wpisuje i odhacza serie; kończy trening. Kontekst: siłownia lub dom, telefon w ręku.
### PR-02: Przerwa między seriami
- P-1, J-01. Kroki: odhacza serię; odlicza się przerwa; telefon powiadamia (i opcjonalnie zapowiada) o następnej serii. Kontekst: ekran często zablokowany.
### PR-03: Plan tygodnia
- P-1, J-02. Kroki: przypisuje szablony do dni; otwiera kalendarz; w razie potrzeby oznacza deload.
### PR-04: Generator
- P-1, J-02, J-05. Kroki: wybiera cel, miejsce, liczbę dni, długość sesji; ogląda propozycję; zatwierdza albo anuluje.
### PR-05: Postępy
- P-1, J-03. Kroki: otwiera Postępy; ogląda podsumowanie, rekordy, wykresy i Progresję.
### PR-06: Dane
- P-1, J-04. Kroki: tworzy kopię, eksportuje, importuje; aktualizuje aplikację.
### PR-07: Zdrowie i zegarek
- P-1, J-01, J-03. Kroki: włącza zapis i odczyt Zdrowia; używa aplikacji na zegarku podczas treningu.
### PR-08: Ustawienia
- P-1, J-04. Kroki: zmienia język, wygląd, jednostkę; zakupy (ZP-06).
### PR-09: Miejsca i sprzęt
- P-1, J-05. Kroki: definiuje miejsce ze sprzętem; zmienia miejsce w treningu; przegląda propozycje dostosowania.

## Wymagania funkcjonalne

### BR-TRN-001: Trening z szablonu albo pusty, zapisywany na bieżąco
- Przepływ: PR-01
- Dowód potrzeby: J-01 (odtworzone z README.md); kod `components/ActiveWorkout.tsx`
- Ekrany: `app/(tabs)/index.tsx`, `app/pick-template.tsx`, `app/picker.tsx`
- Kryteria akceptacji:
  - Scenariusz: Seria zapisuje się po odhaczeniu
    - Zakładając, że trwa trening z szablonu, a w serii wpisano ciężar i powtórzenia
    - Gdy użytkownik odhacza serię ✓
    - Wtedy seria jest zapisana w trwającym treningu i przetrwa zamknięcie aplikacji
  - Scenariusz: Seria nieodhaczona nie zapisuje się
    - Zakładając, że w serii wpisano wynik, ale nie odhaczono jej
    - Gdy użytkownik kończy trening
    - Wtedy aplikacja ostrzega, że nieodhaczone serie z wpisanymi wynikami nie zostaną zapisane

### BR-TRN-002: Typy serii: rozgrzewka, drop set, do upadku, notatka
- Przepływ: PR-01
- Dowód potrzeby: J-01 (odtworzone z README.md)
- Kryteria akceptacji:
  - Scenariusz: Rozgrzewka poza objętością
    - Zakładając, że w ćwiczeniu jest seria rozgrzewkowa (W) i trzy serie robocze
    - Gdy liczona jest objętość i serie na partię
    - Wtedy seria rozgrzewkowa nie wchodzi do objętości ani serii na partię (RD-04-W3)
  - Scenariusz: Drop set poza e1RM
    - Zakładając, że w ćwiczeniu jest seria typu drop set
    - Gdy liczone są rekordy e1RM
    - Wtedy seria drop set nie daje rekordu e1RM
  - Scenariusz: Długa notatka serii zostaje cała
    - Zakładając, że seria ma notatkę dłuższą niż 300 znaków (np. z importu CSV, do 500 znaków)
    - Gdy użytkownik otwiera „Edytuj notatkę” i zapisuje bez zmian
    - Wtedy notatka ma tę samą długość — import i okna notatki używają jednej stałej `SET_NOTE_MAX` (test `tests/audit-m1-2026-10-27-003-notatka-serii.test.tsx`)

### BR-TRN-003: Pauza treningu
- Przepływ: PR-01
- Dowód potrzeby: J-01 (odtworzone z README.md); kod `lib/state/pause.ts`
- Kryteria akceptacji:
  - Scenariusz: Czas pauzy nie wlicza się
    - Zakładając, że trening w toku jest wstrzymany pozycją „Pauza treningu” w menu „⋯” nagłówka (M3 p2, ZM-02)
    - Gdy upływa czas, a potem użytkownik wznawia trening
    - Wtedy czas trwania treningu nie zawiera czasu pauzy
  - Scenariusz: Odhaczenie serii wznawia trening
    - Zakładając, że trening jest wstrzymany
    - Gdy użytkownik odhacza serię
    - Wtedy pauza się kończy, a trening liczy czas dalej

### BR-TRN-004: Widok „Skupiony” (jedna seria na ekranie) albo lista
- Przepływ: PR-01
- Dowód potrzeby: J-01 (odtworzone z README.md); kod `components/ActiveWorkout.tsx`, ustawienia
- Kryteria akceptacji:
  - Scenariusz: Wybór widoku w ustawieniach
    - Zakładając, że użytkownik wybrał widok „Lista” w ustawieniach
    - Gdy rozpoczyna trening
    - Wtedy ćwiczenia pokazane są jako lista serii; przy widoku „Skupiony” tablica „teraz” z bieżącą serią (BR-TRN-009)
  - Scenariusz: Widok „Lista” bez tablicy
    - Zakładając, że wybrano widok „Lista”
    - Gdy trwa trening z przerwą
    - Wtedy tablicy „teraz” nie ma, a przerwa jest w dolnym pasku (ZM-01: tablica tylko w widoku „Skupiony”)

### BR-TRN-009: Tablica „teraz”: wpis i krok ± na tablicy, „Seria zrobiona” bez wartości
- Przepływ: PR-01 · Reguła: RD-14
- Dowód potrzeby: M3 p2 ZM-01 (docs/design/to-be.md, wzorzec 29 w docs/32); kod `lib/board.ts`, `components/NowBoard.tsx`; testy `tests/m3-p2-board-logic.test.ts`, `tests/m3-p2-board-ui.test.tsx`; **krok ± dla czasu (5 s) i dystansu (50 m / 50 yd) to konwencja robocza [DO USTALENIA: badacz]**, krok ciężaru i powtórzeń jak cicha podpowiedź progresji
- Kryteria akceptacji:
  - Scenariusz: Krok ± ciężaru w miejscu z opisanym sprzętem
    - Zakładając, że bieżąca seria ma ciężar 80 kg, a miejsce treningu ma opisane talerze i sztangę
    - Gdy użytkownik stuka „+” przy ciężarze
    - Wtedy ciężar zmienia się na najbliższy dostępny większy (82,5 kg), a zmiana trafia do danych serii jak wpis w wierszu serii
  - Scenariusz: Wpis liczby na tablicy
    - Zakładając, że na tablicy widać ciężar i powtórzenia bieżącej serii
    - Gdy użytkownik stuka liczbę i wpisuje wartość
    - Wtedy pole otwiera się w tym samym miejscu, a wartość zapisuje się jak przy wpisie w wierszu serii
  - Scenariusz: „Seria zrobiona” bez wartości
    - Zakładając, że bieżąca seria nie ma ciężaru ani podpowiedzi „Poprzednio”
    - Gdy użytkownik stuka „Seria zrobiona”
    - Wtedy seria nie zostaje odhaczona, kursor trafia do pierwszego pustego pola, a telefon wibruje ostrzegawczo (gdy włączone „Wibracje”)
  - Scenariusz: Brak wartości widać jako „—”
    - Zakładając, że seria nie ma wartości
    - Gdy ekran pokazuje ją na tablicy i w wierszu wyniku
    - Wtedy zamiast „0” widać „—” (04-studio-projektowe-010)
  - Scenariusz: Pola serii zależnie od liczby serii
    - Zakładając, że ćwiczenie ma więcej niż 4 serie
    - Gdy tablica pokazuje pola serii
    - Wtedy do 4 serii pola pokazują wynik, 5–12 mieszczą się w 1–3 rzędach, powyżej 12 rząd się przewija (SET_FIELDS)

### BR-TRN-010: Menu „⋯” w nagłówku treningu; „Zakończ” drugorzędny
- Przepływ: PR-01 · PR-09
- Dowód potrzeby: M3 p2 ZM-02 (wzorzec 30 w docs/32); kod `components/ActiveWorkout.tsx`; testy `tests/m3-p2-board-ui.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Nagłówek w jednej linii
    - Zakładając, że trwa trening z nazwą i zegarem
    - Gdy użytkownik widzi nagłówek
    - Wtedy nazwa i czas są w jednej linii, a miejsce, pauza, zapowiedzi głosowe i notatka szablonu są w menu „⋯”
  - Scenariusz: Zakończenie ostrzega o seriach bez wyniku
    - Zakładając, że odhaczono serię bez ciężaru
    - Gdy użytkownik stuka „Zakończ”
    - Wtedy okno pyta o zakończenie i ostrzega o seriach bez wyniku

### BR-TRN-011: Od ekranu treningu do odhaczonej serii najwyżej jedno stuknięcie
- Przepływ: PR-01
- Dowód potrzeby: D-107 (decyzja właściciela 2026-10-23, DEC-07 K9, docs/18); test `tests/dec07-k9-stukniecia.test.tsx` (`MAX_TAPS_TO_FIRST_DONE_SET`)
- Kryteria akceptacji:
  - Scenariusz: Pierwsza seria z wartościami z szablonu
    - Zakładając, że trwa trening z szablonu, a pierwsza seria ma ciężar i powtórzenia z szablonu albo z poprzedniego treningu
    - Gdy użytkownik jest na ekranie treningu i stuka „Seria zrobiona”
    - Wtedy pierwsza seria jest odhaczona po jednym stuknięciu (D-107)

### BR-TRN-005: Zamiana ćwiczenia w trakcie treningu
- Przepływ: PR-01
- Dowód potrzeby: J-01 (odtworzone z README.md); kod `app/swap.tsx`
- Kryteria akceptacji:
  - Scenariusz: Brak sprzętu
    - Zakładając, że w treningu jest ćwiczenie, do którego brakuje sprzętu albo maszyna jest zajęta
    - Gdy użytkownik wybiera zamianę
    - Wtedy aplikacja proponuje zamienniki z powodem zamiany, a po wyborze ćwiczenie w treningu zostaje zamienione z możliwością cofnięcia zamiany (docs/14, pkt 3)

### BR-TRN-006: Porzucony trening: pytanie po 2 h, ciche zakończenie po 6 h
- Przepływ: PR-01 · Reguła: RD-03
- Dowód potrzeby: D-008 (decyzja właściciela 2026-10-19, docs/18); kod `lib/state/finish.ts`
- Kryteria akceptacji:
  - Scenariusz: Pytanie po 2 h
    - Zakładając, że trening w toku ma odhaczoną serię roboczą
    - Gdy od ostatniej aktywności mija 2 godziny
    - Wtedy aplikacja pyta, co zrobić z treningiem (RD-03-W2)
  - Scenariusz: Ciche zakończenie po 6 h
    - Zakładając, że trening w toku ma odhaczoną serię roboczą
    - Gdy od ostatniej aktywności mija 6 godzin
    - Wtedy trening zapisuje się sam z godziną ostatniej serii jako końcem (RD-03-W4)
  - Scenariusz: Sama rozgrzewka czeka na decyzję
    - Zakładając, że odhaczono tylko serie rozgrzewkowe
    - Gdy mija 6 godzin
    - Wtedy trening nie zapisuje się po cichu, tylko czeka na decyzję użytkownika

### BR-TRN-007: Skala wysiłku RPE albo RIR przy serii (opcjonalna)
- Przepływ: PR-01 · Reguła: RD-02
- Dowód potrzeby: J-01 (odtworzone z README.md); docs/research/34-rpe-wysilek.md
- Kryteria akceptacji:
  - Scenariusz: Wpis w skali RIR
    - Zakładając, że w ustawieniach wybrano skalę RIR
    - Gdy użytkownik wpisuje RIR 2
    - Wtedy w danych zapisuje się RPE 8, a ekran pokazuje RIR 2 (RD-02-W1)
  - Scenariusz: Wpis z przedziału 4–6 RIR
    - Zakładając, że wybrano skalę RIR
    - Gdy użytkownik wpisuje RIR 6
    - Wtedy zapisuje się RPE 5 (RD-02-W7)
  - Scenariusz: Wpis „lekko”
    - Zakładając, że wybrano skalę RIR
    - Gdy użytkownik wpisuje RIR 7
    - Wtedy zapisuje się RPE 4 („lekko”), a ekran pokazuje „7+” (RD-02-W9, RD-02-W3)

### BR-TRN-008: Usuwanie serii i ćwiczenia: gest i menu, to samo potwierdzenie
- Przepływ: PR-01
- Dowód potrzeby: D-012 (decyzja właściciela 2026-10-19, docs/32 wzorzec 5); test `tests/audit-m1-028-delete-menus.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Usunięcie serii z menu
    - Zakładając, że trwa trening z ćwiczeniem mającym kilka serii
    - Gdy użytkownik wybiera „Usuń serię” w menu serii
    - Wtedy pojawia się to samo okno potwierdzenia co po geście, a po potwierdzeniu seria znika

### BR-PRZ-001: Timer przerwy z powiadomieniem na koniec
- Przepływ: PR-02
- Dowód potrzeby: J-01 (odtworzone z README.md); kod `lib/timer.ts`
- Kryteria akceptacji:
  - Scenariusz: Koniec przerwy przy zablokowanym ekranie
    - Zakładając, że przerwa trwa, a ekran telefonu jest zablokowany
    - Gdy przerwa dobiega końca
    - Wtedy przychodzi powiadomienie lokalne z dźwiękiem (gdy włączony „Dźwięk na koniec przerwy”); wibracja w aplikacji na wierzchu zależy od „Wibracje”
  - Scenariusz: Zgoda na powiadomienia przy pierwszej przerwie
    - Zakładając, że zgoda na powiadomienia nie jest jeszcze ustalona
    - Gdy zaczyna się pierwsza przerwa
    - Wtedy pod tablicą pojawia się jeden wiersz z prośbą („Powiadamiaj” / „Nie teraz”), a pytanie systemu iOS dopiero po „Powiadamiaj” (M3 p2, ZM-02)
  - Scenariusz: Brak zgody na powiadomienia
    - Zakładając, że zgoda na powiadomienia nie została udzielona
    - Gdy zaczyna się przerwa
    - Wtedy ekran jednorazowo informuje, że przypomnienia i koniec przerwy nie przyjdą, i wskazuje ustawienia iOS

### BR-PRZ-002: Live Activity z odliczaniem przerwy
- Przepływ: PR-02
- Dowód potrzeby: J-01 (odtworzone z README.md); moduł `modules/rest-activity`
- Kryteria akceptacji:
  - Scenariusz: Odliczanie na ekranie blokady
    - Zakładając, że przerwa trwa, a Live Activity jest dostępne
    - Gdy użytkownik blokuje ekran
    - Wtedy ekran blokady pokazuje odliczanie przerwy, które znika po jej końcu

### BR-SZB-001: Własne szablony w folderach i archiwum
- Przepływ: PR-01
- Dowód potrzeby: ZP-01; J-01
- Ekrany: `app/templates.tsx`, `app/template/[id].tsx`
- Kryteria akceptacji:
  - Scenariusz: Szablon tworzy użytkownik
    - Zakładając, że użytkownik jest na ekranie szablonów
    - Gdy dodaje szablon przyciskiem „+”
    - Wtedy szablon zawiera ćwiczenia, serie, zakres powtórzeń i przerwy wpisane przez użytkownika; aplikacja nie dodaje szablonów sama
  - Scenariusz: Usunięcie szablonu z podglądu (ZM-04, W2 a, 21.10.2026)
    - Zakładając, że użytkownik ogląda podgląd własnego szablonu
    - Gdy stuka „Usuń szablon” na dole ekranu
    - Wtedy pojawia się to samo okno potwierdzenia co po geście na liście (z informacją o skutkach dla planu), a po „Usuń” szablon znika; w trybie edycji przycisku nie ma

### BR-PLN-001: Plan tygodnia z kalendarzem
- Przepływ: PR-03
- Dowód potrzeby: J-02; kod `app/plan.tsx`
- Ekrany: `app/(tabs)/history.tsx`
- Kryteria akceptacji:
  - Scenariusz: Szablony przypisane do dni
    - Zakładając, że użytkownik ma szablony
    - Gdy przypisuje je do dni tygodnia w planie
    - Wtedy plan powtarza się co tydzień, a ekran Trening pokazuje dzisiejszy trening z planu
  - Scenariusz: „Planowanie” w nagłówku zakładki Plan (M3 p3, W1 c)
    - Zakładając, że użytkownik jest w zakładce Plan
    - Gdy chce przejść do planowania
    - Wtedy przycisk „Planowanie” jest przy tytule, w tym samym miejscu co na ekranie Trening, i otwiera ekran planu
  - Scenariusz: Postęp tygodnia po zmianie planu w trakcie tygodnia (decyzja właściciela 22.10.2026, wariant A; `lib/plan.planChangedInWeek`, `components/WeekStacks`)
    - Zakładając, że użytkownik zmienił plan tygodnia w środku bieżącego tygodnia (nie w poniedziałek), a poprzedni plan miał treningi
    - Gdy ogląda pasek postępu planu tygodnia na ekranie Trening
    - Wtedy liczby zostają bez zmian (dni minione liczą się wg planu, który wtedy obowiązywał, audyt 0.10 A1; np. „2 z 6”), a pod paskiem stoi dopisek „Plan zmieniony w czw. — wcześniejsze dni wg poprzedniego planu” (dzień zmiany skrótem w języku aplikacji; ten sam tekst w etykiecie VoiceOver); w następnym tygodniu albo bez zmiany planu dopisku nie ma

### BR-PLN-002: Kilka planów z wyborem aktywnego
- Przepływ: PR-03
- Dowód potrzeby: J-02; D-004 (funkcja zostaje w aplikacji); docs/18
- Kryteria akceptacji:
  - Scenariusz: Wybór aktywnego planu
    - Zakładając, że użytkownik ma więcej niż jeden plan
    - Gdy wybiera aktywny plan
    - Wtedy kalendarz i ekran Trening korzystają z planu aktywnego

### BR-PLN-003: Deload: oznaczenie tygodnia i propozycja mniejszej liczby serii
- Przepływ: PR-03 · Reguła: RD-10
- Dowód potrzeby: J-02; docs/research/22-serie-deload-generator.md
- Kryteria akceptacji:
  - Scenariusz: Oznaczenie tygodnia
    - Zakładając, że użytkownik ma plan
    - Gdy oznacza tydzień jako deload („Więcej opcji”)
    - Wtedy przy starcie treningu w tym tygodniu aplikacja proponuje „Mniej serii”, a ciężary i szablon zostają bez zmian
  - Scenariusz: Podpowiedź po kilku tygodniach
    - Zakładając, że użytkownik trenuje kilka tygodni z rzędu bez deloadu
    - Gdy otwiera zakładkę Plan
    - Wtedy aplikacja podpowiada „Zaplanuj deload od …”, nie zmieniając szablonów bez zatwierdzenia

### BR-GEN-001: Generator szablonu i planu tygodnia na polecenie użytkownika
- Przepływ: PR-04 · Reguła: RD-07, RD-08, RD-09, RD-13
- Dowód potrzeby: ZP-01; D-004; docs/24-generator-i-plany.md
- Ekrany: `app/generator.tsx`
- Kryteria akceptacji:
  - Scenariusz: Podgląd przed zapisem
    - Zakładając, że użytkownik wybrał cel, miejsce, liczbę dni i długość sesji
    - Gdy uruchamia generator
    - Wtedy aplikacja pokazuje wynik do przejrzenia i nic nie zapisuje, dopóki użytkownik nie zatwierdzi
  - Scenariusz: Cel „Ogólny” przy małej liczbie dni
    - Zakładając, że użytkownik wybrał cel „Ogólny” i jeden dzień siłowy w tygodniu
    - Gdy generator przygotowuje plan
    - Wtedy pod celem pojawia się uwaga o małej liczbie dni z odniesieniem do zaleceń (docs/research/30-cel-ogolny.md)
  - Scenariusz: Zapis, gdy nie ma aktywnego planu (ZM-03, 21.10.2026)
    - Zakładając, że użytkownik nie ma aktywnego planu i przejrzał wynik generatora
    - Gdy stuka „Zapisz szablony i plan”
    - Wtedy szablony zostają zapisane, plan jest aktywny bez pytania i bez okna „Zapisano”, a aplikacja przechodzi do Planowania z jednym zdaniem „Plan „{nazwa}” jest teraz aktywny.”; zgodę na przypomnienie aplikacja zbiera przy pierwszym zaplanowanym dniu
  - Scenariusz: Zapis, gdy aktywny plan już jest (ZM-03)
    - Zakładając, że użytkownik ma aktywny plan
    - Gdy stuka „Zapisz szablony i plan”
    - Wtedy aplikacja pyta, czy nowy plan ustawić jako aktywny („Tylko zapisz” albo „Ustaw jako aktywny”), i potwierdza zapis oknem „Zapisano”; aktywny plan nie zmienia się bez zgody
  - Scenariusz: Przełącznik trybu generatora (DEC-03 c, 23.10.2026 — odwraca punkt ZM-03)
    - Zakładając, że użytkownik otwiera generator
    - Gdy ogląda ekran
    - Wtedy u góry jest przełącznik „Nowe szablony i plan” / „Plan z moich szablonów” (zaznaczony jest tryb, w którym ekran otwarto); „Plan z moich szablonów” jest też wejściem w Planowaniu

### BR-GEN-002: Plan tygodnia z moich szablonów
- Przepływ: PR-04
- Dowód potrzeby: ZP-01; docs/24-generator-i-plany.md
- Kryteria akceptacji:
  - Scenariusz: Szablony bez zmian
    - Zakładając, że użytkownik ma własne szablony
    - Gdy wybiera „Plan z moich szablonów”
    - Wtedy aplikacja układa plan tygodnia według tych samych reguł co generator, a szablony zostają bez zmian
  - Scenariusz: Zapis jak w generatorze (ZM-03, 21.10.2026)
    - Zakładając, że użytkownik ułożył plan z własnych szablonów
    - Gdy stuka „Zapisz plan”
    - Wtedy bez aktywnego planu plan staje się aktywny bez pytania i bez okna „Zapisano” (zdanie na ekranie Planowanie); z aktywnym planem aplikacja pyta jak w generatorze

### BR-MJS-001: Miejsca i sprzęt: ćwiczenia dobierane do tego, czym użytkownik dysponuje
- Przepływ: PR-09
- Dowód potrzeby: J-05; docs/10-miejsca-i-sprzet.md
- Ekrany: `app/more/locations.tsx`, `app/more/location/[id].tsx`, `app/place-once.tsx`
- Kryteria akceptacji:
  - Scenariusz: Sprzęt w miejscu
    - Zakładając, że użytkownik zdefiniował miejsce ze sprzętem
    - Gdy wybiera miejsce treningu
    - Wtedy lista ćwiczeń i ciężary do wyboru odpowiadają sprzętowi tego miejsca

### BR-MJS-002: Dostosuj do miejsca: propozycje do przejrzenia
- Przepływ: PR-09
- Dowód potrzeby: J-05; D-004; docs/33-dostosowanie-do-miejsca-spec.md
- Ekrany: `app/adapt.tsx`
- Kryteria akceptacji:
  - Scenariusz: Propozycje bez automatycznej zamiany
    - Zakładając, że użytkownik zmienia miejsce na takie, w którym brakuje sprzętu do części ćwiczeń
    - Gdy otwiera się okno „Dostosuj do: …”
    - Wtedy okno pokazuje propozycje zamiany do przejrzenia; „Anuluj” niczego nie zmienia, a zamiana nigdy nie następuje automatycznie

### BR-PST-001: Podsumowanie tygodnia i miesiąca: mapa mięśni i serie na partię
- Przepływ: PR-05 · Reguła: RD-04
- Dowód potrzeby: J-03; README.md
- Kryteria akceptacji:
  - Scenariusz: Serie na partię
    - Zakładając, że w tygodniu wykonano trzy serie robocze wyciskania sztangą leżąc
    - Gdy użytkownik otwiera podsumowanie tygodnia
    - Wtedy partia główna ma 3 serie, a partie pomocnicze po 1,5 (RD-04-W1)

### BR-PST-002: Rekordy i szacowany maksymalny ciężar (e1RM)
- Przepływ: PR-05 · Reguła: RD-01, RD-12
- Dowód potrzeby: J-03; README.md
- Kryteria akceptacji:
  - Scenariusz: e1RM z serii roboczej
    - Zakładając, że ćwiczenie ma serię 100 kg × 5 powtórzeń
    - Gdy aplikacja liczy e1RM
    - Wtedy e1RM wynosi 116,666667 kg (RD-01-W1)
  - Scenariusz: Seria powyżej 10 powtórzeń
    - Zakładając, że ćwiczenie ma serię 50 kg × 12 powtórzeń
    - Gdy aplikacja liczy rekord e1RM
    - Wtedy seria nie daje rekordu e1RM (limit `E1RM_MAX_REPS` = 10)

### BR-PST-003: Porównanie bieżącego okresu z poprzednim (Progresja)
- Przepływ: PR-05
- Dowód potrzeby: J-03; README.md; docs/32 wzorzec 25
- Ekrany: `app/progression.tsx`
- Kryteria akceptacji:
  - Scenariusz: Dwa okresy
    - Zakładając, że w obu okresach są zapisane treningi
    - Gdy użytkownik otwiera Progresję
    - Wtedy widzi objętość, serie i treningi bieżącego okresu obok poprzedniego

### BR-PST-005: Postępy: wykres i rekordy wybranego ćwiczenia na górze, wybór pod nimi
- Przepływ: PR-05
- Dowód potrzeby: J-03; decyzje właściciela 2026-10-21 (ZM-06, M1-026 = DEC-09, docs/design/to-be.md); testy `tests/m3-p3-postepy-historia.test.tsx`
- Ekrany: `app/(tabs)/progress.tsx`
- Kryteria akceptacji:
  - Scenariusz: Wykres i rekordy na górze
    - Zakładając, że użytkownik ma zakończone treningi i nie wybrał ćwiczenia
    - Gdy otwiera Postępy
    - Wtedy na górze widzi wykres i rekordy ostatnio trenowanego ćwiczenia z danymi, pod nimi wybór ćwiczenia, a niżej sesje ćwiczenia i ogólny przegląd (okres do okresu, serie na partię)
  - Scenariusz: Wybór ćwiczenia z danymi albo przez wyszukiwanie
    - Zakładając, że biblioteka ma ćwiczenia bez historii
    - Gdy użytkownik nie wpisał nic w wyszukiwanie
    - Wtedy chipy wyboru pokazują tylko ćwiczenia z danymi, a pozostałe ćwiczenia są dostępne po wpisaniu nazwy; brak wyników to „Nic nie pasuje.”
  - Scenariusz: Bez historii
    - Zakładając, że użytkownik nie ma zakończonego treningu
    - Gdy otwiera Postępy
    - Wtedy widzi pusty stan z motywem graficznym, zdaniem o wykresach i przyciskiem „Zacznij trening”, który prowadzi na ekran Trening (bez wykresu, wyszukiwania i chipów); sekcja „Masa ciała” z wejściem do pomiarów zostaje pod nim

### BR-HIS-001: Usuwanie sesji z historii: gest na liście i przycisk w szczegółach, to samo potwierdzenie
- Przepływ: PR-05
- Dowód potrzeby: decyzja właściciela 2026-10-21 (ZM-04, W2, docs/32 wzorzec 5); testy `tests/swipe-delete.test.tsx`, `tests/m3-p3-postepy-historia.test.tsx`
- Ekrany: `app/history/[id].tsx`
- Kryteria akceptacji:
  - Scenariusz: „Usuń sesję” na dole szczegółów
    - Zakładając, że użytkownik otworzył zapisaną sesję
    - Gdy stuka „Usuń sesję” na dole ekranu
    - Wtedy pojawia się to samo okno [Anuluj, Usuń] co po geście przesunięcia na liście, z dopiskiem o kopii w Apple Health, jeśli sesja ją ma; „Anuluj” zostawia sesję, „Usuń” usuwa ją i wraca do listy
  - Scenariusz: Brak wyniku w serii
    - Zakładając, że seria zapisana w historii nie ma powtórzeń, czasu albo dystansu
    - Gdy użytkownik ogląda sesję
    - Wtedy w odpowiedniej komórce widzi „—”, a nie „0” (04-studio-projektowe-010); eksport CSV bez zmian

### BR-PST-004: Cel serii na partię w tygodniu: automatyczny albo ręczny
- Przepływ: PR-05 · Reguła: RD-11
- Dowód potrzeby: J-03; docs/research/32-serie-na-partie.md
- Kryteria akceptacji:
  - Scenariusz: Cel ręczny
    - Zakładając, że użytkownik ustawił cel ręcznie dla partii
    - Gdy otwiera „Ten tydzień”
    - Wtedy kreska celu dla tej partii pokazuje liczbę z ustawień, a pozostałe partie — wartość automatyczną

### BR-BIB-001: Biblioteka ćwiczeń z krótkimi wskazówkami techniki
- Przepływ: PR-01
- Dowód potrzeby: J-01; docs/research/27-wskazowki-zrodla.md (generowany)
- Ekrany: `app/exercises.tsx`, `app/exercise/[id].tsx`
- Kryteria akceptacji:
  - Scenariusz: Wskazówki w języku aplikacji
    - Zakładając, że ćwiczenie ma wskazówki techniki
    - Gdy użytkownik otwiera ćwiczenie
    - Wtedy sekcje „Ustawienie”, „Ruch”, „Wskazówki” i „Częste błędy” są po polsku lub w języku aplikacji; nazwa ćwiczenia z biblioteki zostaje po angielsku (decyzja 2026-10-19)
  - Scenariusz: Sekcja „Technika” w karcie ćwiczenia jest domyślnie rozwinięta (decyzja właściciela 2026-10-27, wariant B; wyjątek od zamrożenia zakresu 1.0)
    - Zakładając, że ćwiczenie ma wskazówki techniki
    - Gdy użytkownik otwiera kartę ćwiczenia z biblioteki, z historii albo z Postępów (wejście poza treningiem na żywo)
    - Wtedy sekcja „Technika” (wskazówki i rysunek ruchu) jest od razu rozwinięta, a przycisk „Technika” zwija ją i rozwija (stan rozwinięcia czytany przez VoiceOver, etykieta bez zmian); w podglądzie otwieranym w kontekście treningu na żywo sekcja zostaje zwinięta, a „Technika ›” rozwija ją
  - Scenariusz: Rysunek ruchu tylko po recenzji (bramka 4, CLAUDE.md 27.10.2026; decyzja DEC-01 b, 2026-10-27; zapis `docs/research/figury-recenzja.json`, test `tests/figury-recenzja.test.tsx`)
    - Zakładając, że rysunek ćwiczenia nie ma zapisu niezależnej recenzji ruchu i treści karty albo zmienił się po recenzji (inny skrót danych), albo recenzja go ukryła (np. Push Press, Pendlay Row)
    - Gdy użytkownik otwiera sekcję „Technika” tego ćwiczenia
    - Wtedy widzi wskazówki, asekurację i stopkę medyczną bez rysunku; rysunek z aktualną recenzją wyświetla się jak dotąd
  - Scenariusz: Usunięcie własnego ćwiczenia z podglądu (ZM-04, W2 a, 21.10.2026)
    - Zakładając, że użytkownik ogląda podgląd ćwiczenia własnego
    - Gdy stuka „Usuń z biblioteki” na dole ekranu
    - Wtedy pojawia się to samo okno potwierdzenia co po geście na liście, a po „Usuń” ćwiczenie znika z biblioteki (historia zostaje); przy ćwiczeniu wbudowanym przycisku nie ma (decyzja STOP 3, 2026-10-21), a gest na liście działa jak dotąd

### BR-BIB-002: Informacja o asekuracji przy sztandze nad ciałem lub na barkach
- Przepływ: PR-01
- Dowód potrzeby: OG-02; NSCA 2017 Standard 3.2 (docs/research/przeglad-badacza-2026-10-23.md); testy `tests/audit-m1-015-asekuracja.test.tsx`, `tests/audit-m1-031-asekuracja-zakres.test.tsx`, `tests/audit-m1-031-hantle-asekuracja.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Zdanie o asekuracji
    - Zakładając, że ćwiczenie ma w katalogu zalecenie ramion asekuracyjnych
    - Gdy użytkownik otwiera to ćwiczenie
    - Wtedy ekran pokazuje zdanie o asekuracji, a wybór ćwiczenia w miejscu bez ramion asekuracyjnych oznacza je „bez asekuracji w stojakach”
  - Scenariusz: Asekuracja osobą bez stojaków (M1-031, 23.10.2026)
    - Zakładając, że ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą nie przewiduje w katalogu stojaków (np. Skullcrusher (EZ), pullover, wykroki w marszu)
    - Gdy użytkownik otwiera to ćwiczenie
    - Wtedy ekran pokazuje ramkę „Asekuracja” ze zdaniem „zalecana osoba asekurująca”, a wybór ćwiczenia nie dopisuje „bez asekuracji w stojakach”
  - Scenariusz: Zakres listy (M1-031)
    - Zakładając, że ćwiczenie katalogu jest wykonywane ze sztangą lub sztangą EZ
    - Gdy powstaje albo zmienia się wpis katalogu
    - Wtedy ma przypisaną jedną kategorię: „stojaki”, „osoba”, otwarte (ćwiczenia dynamiczne, sztanga na biodrach) albo poza zakresem — inaczej test zatrzymuje zmianę
  - Scenariusz: Asekuracja przy hantlach nad głową lub twarzą (M1-031 cz. 2, DEC-08, 23.10.2026)
    - Zakładając, że ćwiczenie z hantlami przemieszcza ciężar nad twarzą lub nad głową (np. wyciskanie hantli, rozpiętki, pullover, wyciskanie nad głowę)
    - Gdy użytkownik otwiera to ćwiczenie
    - Wtedy ekran pokazuje ramkę „Asekuracja” ze zdaniem „Ćwiczenie z hantlami nad głową lub twarzą: zalecana osoba asekurująca.”; ćwiczenia dynamiczne z hantlem, goblet i hip thrust (hantel) zostają bez ramki [OTWARTE]

### BR-ZDR-001: Opcjonalny zapis zakończonych treningów do Apple Health
- Przepływ: PR-07
- Dowód potrzeby: OG-01, OG-09; docs/28-healthkit-etap0.md; `site/privacy.html`
- Kryteria akceptacji:
  - Scenariusz: Zapis po zgodzie
    - Zakładając, że użytkownik włączył zapis i udzielił zgody systemowej
    - Gdy kończy trening
    - Wtedy w Apple Health powstaje jeden wpis treningu (czas, rodzaj, nazwa, łączna objętość, liczba serii)
  - Scenariusz: Zegarek zapisał ten sam trening
    - Zakładając, że zegarek prowadził sesję treningu i zapisał trening
    - Gdy telefon wykrywa ten sam trening
    - Wtedy aplikacja usuwa własną kopię z Apple Health (tylko wpis, który sama zapisała)

### BR-ZDR-002: Opcjonalny odczyt z Apple Health: kroki, treningi, tętno, aktywna energia
- Przepływ: PR-07
- Dowód potrzeby: OG-01, OG-08; D-004; docs/29-zdrowie-odczyt-spec.md; `site/privacy.html`
- Kryteria akceptacji:
  - Scenariusz: Odczyt po zgodzie
    - Zakładając, że użytkownik włączył odczyt i udzielił zgody
    - Gdy otwiera plan dnia
    - Wtedy dzień pokazuje kroki i inne aktywności, a sesja z treningiem z zegarka — tętno i kcal
  - Scenariusz: Dane tylko wyświetlane
    - Zakładając, że odczyt jest włączony
    - Gdy aplikacja pobiera dane ze Zdrowia
    - Wtedy dane są tylko wyświetlane na telefonie i nigdzie nie są wysyłane

### BR-ZEG-001: Aplikacja na Apple Watch: odhaczanie serii, przerwa, „Cofnij”
- Przepływ: PR-07
- Dowód potrzeby: J-01; docs/35-zegarek-apple.md
- Kryteria akceptacji:
  - Scenariusz: Seria z zegarka
    - Zakładając, że na telefonie trwa trening, a zegarek jest połączony
    - Gdy użytkownik stuka „Seria zrobiona” na zegarku
    - Wtedy seria jest odhaczona w treningu, a zegarek pokazuje odliczanie przerwy
  - Scenariusz: Cofnięcie
    - Zakładając, że seria została odhaczona z zegarka
    - Gdy mija mniej niż 5 sekund i użytkownik stuka „Cofnij”
    - Wtedy odhaczenie jest cofnięte
  - Scenariusz: Potwierdzenie dopiero po zapisie (M1-audytor-generalny-028, 23.10.2026)
    - Zakładając, że telefon jest zablokowany, a zegarek wysyła zdarzenie (zrobione inaczej, pominięcie ćwiczenia, start sesji)
    - Gdy telefon przyjmuje zdarzenie
    - Wtedy zmiana jest zapisana w bazie, zanim zegarek dostanie potwierdzenie; nieudany zapis nie daje potwierdzenia i zegarek wysyła zdarzenie ponownie

### BR-ZEG-002: Zegarek: w trakcie pomiaru serii na czas przycisk główny to „Zakończ serię”
- Przepływ: PR-07
- Dowód potrzeby: ZM-05; docs/32-wzorce-interakcji.md (wzorzec 24); docs/design/design-spec.md §10 wiersz 38
- Kryteria akceptacji:
  - Scenariusz: Pomiar trwa
    - Zakładając, że telefon mierzy stoperem serię na czas, a zegarek jest połączony
    - Gdy zegarek pokazuje tę serię
    - Wtedy przycisk główny nazywa się „Zakończ serię”, jak na telefonie, a jego stuknięcie kończy pomiar i odhacza serię
  - Scenariusz: Brak pomiaru
    - Zakładając, że seria na czas nie jest mierzona albo seria nie jest na czas
    - Gdy zegarek pokazuje tę serię
    - Wtedy przycisk główny nazywa się „Seria zrobiona”

### BR-ZEG-003: Zegarek po ostatnim ćwiczeniu: „Zakończ trening na telefonie”, jeden raz
- Przepływ: PR-07
- Dowód potrzeby: decyzja właściciela 23.10.2026 (docs/18, test na telefonie W2-05, build 1030); `tests/watch-last-rest.test.ts`
- Kryteria akceptacji:
  - Scenariusz: Ostatnia przerwa
    - Zakładając, że zegarek jest połączony, a użytkownik odhaczył ostatnią serię treningu
    - Gdy zegarek pokazuje przerwę po ostatniej serii
    - Wtedy pokazuje odliczanie i jeden komunikat „Zakończ trening na telefonie”; zapowiedź „nic więcej do zrobienia” z telefonu nie jest wyświetlana drugi raz
  - Scenariusz: Po końcu przerwy
    - Zakładając, że przerwa po ostatniej serii się skończyła
    - Gdy zegarek pokazuje ekran bez następnej serii
    - Wtedy widać ten sam komunikat „Zakończ trening na telefonie”, jeden raz

### BR-GLS-001: Zapowiedzi głosowe na początku przerwy, domyślnie wyłączone
- Przepływ: PR-02
- Dowód potrzeby: ZP-07; D-005; docs/36-glos.md
- Kryteria akceptacji:
  - Scenariusz: Domyślnie cisza
    - Zakładając, że nowa instalacja nie zmieniała ustawienia zapowiedzi
    - Gdy zaczyna się przerwa
    - Wtedy aplikacja nic nie mówi
  - Scenariusz: W słuchawkach
    - Zakładając, że użytkownik wybrał „W słuchawkach” i podłączył słuchawki
    - Gdy zaczyna się przerwa po odhaczeniu serii
    - Wtedy telefon zapowiada następne ćwiczenie, ciężar i powtórzenia

### BR-UST-001: Dźwięk na koniec przerwy i wibracje to dwa osobne przełączniki
- Przepływ: PR-08
- Dowód potrzeby: ZM-07 (docs/design/to-be.md); decyzja właściciela 21.10.2026 (docs/18); kod `app/more/settings.tsx`, `lib/haptics.ts`, `components/ActiveWorkout.tsx` (onDone)
- Kryteria akceptacji:
  - Scenariusz: Dwa przełączniki w Ustawieniach
    - Zakładając, że użytkownik otwiera Ustawienia
    - Gdy ogląda sekcję „Trening”
    - Wtedy widzi osobne przełączniki „Dźwięk na koniec przerwy” i „Wibracje”, a dawnego „Dźwięk i wibracja na koniec przerwy” nie ma
  - Scenariusz: Dźwięk tylko od dźwięku, wibracje tylko od wibracji
    - Zakładając, że użytkownik wyłączył „Wibracje”, a „Dźwięk na koniec przerwy” zostawił włączony
    - Gdy kończy się przerwa albo stoper serii
    - Wtedy powiadomienie ma dźwięk, a telefon nie wibruje (ani na końcu przerwy, ani przy ± i ostrzeżeniu na tablicy, ani przy przeciąganiu listy); przy odwrotnym ustawieniu odwrotnie
  - Scenariusz: Krótka wibracja przy odhaczeniu serii
    - Zakładając, że użytkownik ma włączone „Wibracje” (albo brak zapisanego wyboru i włączony „Dźwięk na koniec przerwy”)
    - Gdy odhacza serię przez „Seria zrobiona” na tablicy albo przez ✓ w wierszu serii
    - Wtedy telefon wibruje krótko, tak samo w obu miejscach; przy cofnięciu odhaczenia i przy wyłączonych „Wibracjach” nie wibruje
  - Scenariusz: Aktualizacja nic nie zmienia
    - Zakładając, że dane pochodzą z wersji bez przełącznika „Wibracje” (brak zapisanego wyboru)
    - Gdy aplikacja się uruchamia po aktualizacji
    - Wtedy wibracje zachowują się jak „Dźwięk na koniec przerwy” (jak dotąd), schemat danych i zapis nie są zmieniane, a pierwsze przełączenie dźwięku nie przełącza wibracji
  - Scenariusz: Wybór przetrwa kopię i powrót do starszej wersji
    - Zakładając, że użytkownik zapisał wybór „Wibracje”
    - Gdy eksportuje i importuje kopię albo otwiera dane w starszej wersji, a potem w nowej
    - Wtedy wybór zostaje zachowany (starsza wersja trzyma pole jako nieznane)

### BR-DAN-001: Dane tylko w telefonie, bez konta
- Przepływ: PR-06
- Dowód potrzeby: ZP-05; NFR-PRV-001
- Kryteria akceptacji:
  - Scenariusz: Brak konta
    - Zakładając, że użytkownik instaluje aplikację po raz pierwszy
    - Gdy uruchamia aplikację
    - Wtedy nie ma ekranu logowania, a dane zapisują się w lokalnej bazie na telefonie

### BR-DAN-002: Kopia zapasowa, eksport i import danych
- Przepływ: PR-06
- Dowód potrzeby: J-04; README.md; docs/12-edycja-treningow.md
- Ekrany: `app/more/backup.tsx`
- Kryteria akceptacji:
  - Scenariusz: Kopia i odtworzenie
    - Zakładając, że użytkownik ma historię treningów
    - Gdy tworzy kopię JSON i importuje ją po wyczyszczeniu danych
    - Wtedy historia odtwarza się bez strat
  - Scenariusz: Kopia bezpieczeństwa przed importem
    - Zakładając, że użytkownik ma dane
    - Gdy rozpoczyna import
    - Wtedy aplikacja zapisuje kopię bezpieczeństwa przed zmianą danych
  - Scenariusz: Niepowodzenie zapisu
    - Zakładając, że zapis importowanych danych do bazy się nie udaje
    - Gdy import się kończy
    - Wtedy aplikacja nie pokazuje komunikatu o sukcesie
  - Scenariusz: Baza nie otwiera się przy starcie
    - Zakładając, że aplikacja pokazuje ekran błędu startu, bo baza danych się nie otwiera
    - Gdy użytkownik czyta ekran i stuka „Wyślij dane”
    - Wtedy widzi ostrzeżenie, żeby nie usuwać aplikacji (dane i kopie zniknęłyby razem z nią), a komplet plików bazy (z dziennikiem) trafia do Pliki → aplikacja → Backup → Rescue-… z podaniem tego miejsca; oryginał nie jest zmieniany (decyzja właściciela 27.10.2026; test `tests/audit-m1-2026-10-27-004-ratunek.test.tsx`)

### BR-DAN-003: Aktualizacja aplikacji zachowuje dane
- Przepływ: PR-06
- Dowód potrzeby: J-04; test `tests/audit-m1-002-premigrate.test.ts`; NFR-DAN-001
- Kryteria akceptacji:
  - Scenariusz: Migracja z poprzedniego schematu
    - Zakładając, że zapis pochodzi z poprzedniej wersji aplikacji
    - Gdy użytkownik uruchamia nową wersję
    - Wtedy dane są przeniesione do nowego schematu, a kopia zapisu sprzed migracji istnieje
  - Scenariusz: Błąd kodu migracji na czytelnych danych
    - Zakładając, że po aktualizacji migracja danych rzuca wyjątek na poprawnym zapisie (błąd w kodzie wersji)
    - Gdy aplikacja startuje
    - Wtedy pokazuje ekran błędu startu („Wyślij dane”, „Spróbuj ponownie”, „Napisz do nas”), niczego nie zapisuje ani nie odkłada, a dane w telefonie zostają bajt w bajt do poprawionej wersji; zapis nieczytelny albo o złym kształcie — jak dotąd odłożony z komunikatem (test `tests/audit-m1-2026-10-27-013-wyjatek-migracji.test.tsx`)
  - Scenariusz: Nieudany zapis poza zakładką Trening
    - Zakładając, że telefon nie ma miejsca i zapis danych się nie udaje
    - Gdy użytkownik zapisuje zmianę na dowolnym ekranie (np. edycja sesji z historii, ustawienia)
    - Wtedy od razu widzi okno „Nie udało się zapisać danych” z „Spróbuj ponownie” (jedno na epizod błędu), a zmiana czeka w pamięci na ponowienie (test `tests/audit-m1-2026-10-27-015-blad-zapisu.test.tsx`)

### BR-DAN-005: „Co nowego” po aktualizacji; w pierwszej wersji sklepowej historia pusta
- Przepływ: PR-06
- Dowód potrzeby: J-04; decyzja właściciela 14.10.2026 (docs/18: przy 1.0 czyścimy „Co nowego”); kod `lib/whatsnew.ts`, `components/WhatsNew.tsx`; test `tests/whats-new.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Wersja 1.0 bez historii zmian
    - Zakładając, że historia „Co nowego” jest pusta (pierwsza wersja w App Store)
    - Gdy użytkownik, nowy albo po aktualizacji z wersji testowej, otwiera ekran Trening
    - Wtedy nagłówek nie ma przycisku „Co nowego” ani kropki, a zapisane dane pozostają bez zmian
  - Scenariusz: Kropka po aktualizacji z nowym wpisem
    - Zakładając, że historia ma wpis, którego użytkownik z co najmniej jednym treningiem jeszcze nie otworzył
    - Gdy otwiera ekran Trening
    - Wtedy przycisk „Co nowego” ma kropkę, a po otwarciu panelu kropka znika

### BR-DAN-004: Usuwanie poza treningiem: widoczna droga obok gestu, to samo potwierdzenie
- Przepływ: PR-09, PR-05
- Dowód potrzeby: decyzja właściciela 21.10.2026 (docs/18, M3 ZM-04, W1 b, W2 a); docs/32 wzorzec 5; testy `tests/m3-p5-delete.test.tsx`, `tests/swipe-delete.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Usunięcie pomiaru masy ciała albo gumy bez gestu
    - Zakładając, że lista pomiarów albo gum ma co najmniej jeden wiersz
    - Gdy użytkownik stuka „Edytuj” w nagłówku, a potem przycisk usunięcia przy wierszu
    - Wtedy pojawia się to samo okno [Anuluj, Usuń] co po geście przesunięcia, „Anuluj” nic nie usuwa, a „Usuń” usuwa jeden wiersz
  - Scenariusz: Usunięcie miejsca ze szczegółów
    - Zakładając, że otwarto ekran miejsca, które wolno usunąć (nie główne, gdy są inne)
    - Gdy użytkownik stuka „Usuń miejsce” na dole ekranu
    - Wtedy pojawia się to samo okno co po geście na liście miejsc, a po potwierdzeniu miejsce znika i ekran wraca do listy
  - Scenariusz: Usunięcie serii, ćwiczenia, zamiennika albo zapisanego planu poza treningiem bez gestu (04-studio-projektowe-003)
    - Zakładając, że otwarto edytor szablonu, edycję sesji albo ekran zapisanego planu
    - Gdy użytkownik wybiera „Usuń serię” w menu serii, „Usuń ćwiczenie” w „⋯” ćwiczenia, „Usuń” przy zamienniku albo „Usuń plan” na dole ekranu planu
    - Wtedy pojawia się to samo okno [Anuluj, Usuń] co po geście; ostatnia seria bloku nie jest usuwana, a menu pokazuje to samo wyjaśnienie co gest
  - Scenariusz: Miejsce główne
    - Zakładając, że otwarto ekran miejsca głównego, a istnieją inne miejsca
    - Gdy użytkownik przegląda ekran
    - Wtedy przycisku „Usuń miejsce” nie ma (jak gestu)

### BR-JEZ-001: Interfejs w wielu językach
- Przepływ: PR-08
- Dowód potrzeby: J-04; docs/16-jezyki-i-marka.md; NFR-JEZ-001
- Ekrany: `app/more/language.tsx`
- Kryteria akceptacji:
  - Scenariusz: Język jak w telefonie
    - Zakładając, że użytkownik nie zmieniał języka
    - Gdy uruchamia aplikację
    - Wtedy interfejs jest w języku telefonu, jeśli jest w rejestrze języków, inaczej w angielskim (docs/lokalizacja/jezyki.md)
  - Scenariusz: Zmiana języka
    - Zakładając, że użytkownik wybiera język w ustawieniach
    - Gdy wraca na ekran główny
    - Wtedy teksty zmieniają się bez restartu

### BR-JEZ-002: Wygląd jasny, ciemny albo systemowy
- Przepływ: PR-08
- Dowód potrzeby: docs/16-jezyki-i-marka.md
- Kryteria akceptacji:
  - Scenariusz: Wygląd systemowy
    - Zakładając, że wybrano wygląd systemowy
    - Gdy telefon przełącza się na tryb ciemny
    - Wtedy aplikacja przełącza się na ciemny wygląd
  - Scenariusz: Nowa instalacja startuje w ciemnym wyglądzie (D-120)
    - Zakładając, że aplikację zainstalowano po raz pierwszy
    - Gdy uruchamia się pierwszy raz
    - Wtedy wygląd jest ciemny, a zapisane ustawienie osoby, która już korzysta z aplikacji, zostaje bez zmian (test `tests/domyslny-motyw.test.ts`)

### BR-JEZ-003: System miar metryczny albo imperialny
- Przepływ: PR-08
- Dowód potrzeby: J-01; D-110 (decyzje właściciela 2026-10-20, docs/18); kod `lib/units.ts`; testy `tests/audit-m1-lok07-01-imperial-dist.test.tsx`, `tests/audit-m1-lok07-02-default-system.test.ts`
- Kryteria akceptacji:
  - Scenariusz: Zmiana systemu miar
    - Zakładając, że użytkownik ma zapisane treningi w kg i dystans w metrach
    - Gdy zmienia system miar na imperialny
    - Wtedy ciężar pokazuje się w lb, dystans w mi albo yd, a zapis w danych zostaje w kg i metrach (bez migracji)
  - Scenariusz: Domyślny system nowej instalacji
    - Zakładając, że aplikację zainstalowano po raz pierwszy w telefonie z regionem, który używa miar imperialnych
    - Gdy aplikacja startuje
    - Wtedy system miar jest imperialny; brak danych o regionie daje metryczny, a istniejący użytkownik zostaje przy swoim ustawieniu

### BR-JEZ-004: Teksty zwykłym językiem, bez przypisów i bez oznaczeń pewności
- Przepływ: PR-08
- Dowód potrzeby: ZP-09; D-108, D-109 (decyzje właściciela 2026-10-23 i 2026-10-25, docs/18); `tests/zrodla-wiedzy.test.ts`; `scripts/claims.mjs` (`markerErrors`)
- Kryteria akceptacji:
  - Scenariusz: Reguła z liczbami bez cytatu
    - Zakładając, że użytkownik otwiera objaśnienie reguły (generator, plan, Postępy, Ustawienia)
    - Gdy objaśnienie się wyświetla
    - Wtedy tekst jest napisany zwykłym językiem i nie zawiera nazw źródeł, autorów, organizacji, norm, lat publikacji ani odwołań ogólnych typu „na podstawie badań”
  - Scenariusz: Bez oznaczeń pewności w interfejsie (D-109; zastępuje dawny scenariusz „Uproszczenie nazwane wprost”, ER-03)
    - Zakładając, że reguła jest uproszczeniem albo wyborem aplikacji
    - Gdy użytkownik czyta jej objaśnienie
    - Wtedy tekst nie zawiera oznaczeń „uproszczenie”, „nasz wybór”, „jedno źródło”, „konwencja”; waga twierdzenia jest zapisana tylko w rejestrze twierdzeń (`docs/research/rejestr-twierdzen.json`, pole `rodzaje`)

### BR-ZRO-001: Ekran „Źródła wiedzy” w Ustawieniach
- Status: wycofane 2026-10-25 (D-108): ekran usunięty z aplikacji razem z wpisem w Ustawieniach i scenariuszem E2E; publicznie bez źródeł, źródła tylko w wewnętrznym rejestrze (ZP-09). Wpis zostaje jako ślad decyzji (ER-02); ID nie wraca.

### BR-ZAK-001: Model dostępu zgodny z modelem stałym (M5 S1)
- Przepływ: PR-08 · Reguła: RD-05
- Dowód potrzeby: ZP-06; docs/monetyzacja.md; decyzja właściciela 22.10.2026 (docs/18)
- Kryteria akceptacji:
  - Scenariusz: Zakupy włączone
    - Zakładając, że build ma `PAYWALL.ENABLED` = true
    - Gdy użytkownik nie ma aktywnej subskrypcji ani zakupu dożywotniego
    - Wtedy cała aplikacja działa, a limit dotyczy wyłącznie startu treningu na żywo (historia, edycja, dopisywanie wstecz, kopia i eksport zawsze dostępne)
  - Scenariusz: Limit dni treningowych
    - Zakładając, że zakupy są włączone, a użytkownik jest na darmowym poziomie
    - Gdy w bieżącym miesiącu kalendarzowym ma już tyle dni z ukończonym treningiem na żywo, ile wynosi limit z docs/monetyzacja.md (`PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`), i zaczyna trening w nowym dniu
    - Wtedy start jest zablokowany, a aplikacja pokazuje ekran zakupu
  - Scenariusz: Brak okresu próbnego
    - Zakładając, że użytkownik otwiera ekran zakupu
    - Gdy ogląda plany
    - Wtedy nie ma oferty wprowadzającej ani okresu próbnego, a cena za okres jest najwyraźniejszym elementem planu

### BR-ZAK-002: Dzień treningowy jako jednostka limitu
- Przepływ: PR-08 · Reguła: RD-05, RD-06
- Dowód potrzeby: ZP-06; docs/monetyzacja-badanie-2026-10.md rozdz. 11
- Kryteria akceptacji:
  - Scenariusz: Kilka treningów jednego dnia
    - Zakładając, że użytkownik ukończył dwa treningi na żywo tego samego dnia
    - Gdy sprawdza licznik
    - Wtedy zużył jeden dzień, a kolejny trening tego dnia może zacząć nawet przy wyczerpanym limicie
  - Scenariusz: Co się liczy
    - Zakładając, że użytkownik ma trening wstecz (także z dzisiejszą datą), anulowany, trwający i trening na żywo krótszy niż 7 minut
    - Gdy sprawdza licznik
    - Wtedy żaden z nich nie zużywa dnia i żaden nie jest blokowany; liczy się trening na żywo dłuższy niż 7 minut (bez pauz), zakończony „Zakończ” albo zapisany po 6 godzinach bez aktywności
  - Scenariusz: Usunięcie treningu
    - Zakładając, że użytkownik zużył dzień treningiem na żywo
    - Gdy usuwa ten trening z historii
    - Wtedy dzień nie wraca do limitu, bo dni są zapisane osobno w danych użytkownika i w kopii zapasowej
  - Scenariusz: Trening przez północ
    - Zakładając, że trening zaczął się 31. dnia miesiąca przed północą, a skończył po niej
    - Gdy zaczyna się nowy miesiąc
    - Wtedy trening liczy się do dnia i miesiąca startu, a w nowym miesiącu licznik jest pełny
  - Scenariusz: Licznik na ekranie startu
    - Zakładając, że użytkownik jest na darmowym poziomie
    - Gdy otwiera ekran startu treningu
    - Wtedy widzi, ile darmowych dni treningowych zostało w tym miesiącu
  - Scenariusz: Dni z okresu Pro po wygaśnięciu
    - Zakładając, że użytkownik trenował w Pro, a subskrypcja wygasła, została zwrócona albo cofnięta (sklep nie zwraca już transakcji)
    - Gdy zaczyna trening w tym samym miesiącu
    - Wtedy liczą się tylko dni od chwili, w której aplikacja zobaczyła koniec dostępu (decyzja P3 B, docs/18; test `tests/audit-m1-2026-10-27-002-limit-po-wygasnieciu.test.ts`); po ponownej instalacji aplikacji ta chwila nie jest znana i liczą się wszystkie dni miesiąca

### BR-ZAK-003: Ekran zakupu bez presji
- Przepływ: PR-08
- Dowód potrzeby: ZP-06; OG-05, OG-06; docs/monetyzacja-badanie-2026-10.md rozdz. 11; rejestr twierdzeń T-042, T-043
- Ekrany: `app/paywall.tsx`
- Kryteria akceptacji:
  - Scenariusz: Start ponad limit
    - Zakładając, że użytkownik zaczyna trening po wykorzystaniu darmowych dni
    - Gdy otwiera się ekran zakupu
    - Wtedy widzi pochwałę, informację o autorze (niezależny deweloper, bez reklam, bez zbierania danych) i datę, od której darmowe dni wracają, oraz może dopisać trening wstecz albo zamknąć ekran
  - Scenariusz: Ekran z Ustawień
    - Zakładając, że użytkownik otwiera ekran zakupu z Ustawień
    - Gdy ogląda nagłówek
    - Wtedy czyta, że może trenować darmowo określoną liczbę dni w miesiącu, że Pro zdejmuje limit i że subskrypcję anuluje w ustawieniach Apple ID
  - Scenariusz: Brak samoczynnych okien
    - Zakładając, że użytkownik kończy pierwszy trening
    - Gdy ekran podsumowania się wyświetla
    - Wtedy ekran zakupu nie otwiera się sam
  - Scenariusz: Kolejność planów i plan domyślny
    - Zakładając, że użytkownik bez dostępu otwiera ekran zakupu
    - Gdy ogląda plany
    - Wtedy plany są w kolejności roczny, miesięczny, dożywotni, a zaznaczony jest roczny (decyzja właściciela 27.10.2026, docs/18; test `tests/paywall-kolejnosc-domyslna.test.ts`)
  - Scenariusz: Posiadany plan subskrypcji
    - Zakładając, że użytkownik ma aktywną subskrypcję (miesięczną albo roczną; kupioną sam, z kodu albo z Chmury rodzinnej)
    - Gdy otwiera ekran zakupu
    - Wtedy zamiast oferty widzi stan swojego planu: nagłówek karty „Masz plan: {nazwa planu}” i datę, bez wstępu o darmowych dniach, bez listy planów i bez przycisku „Subskrybuj”; lista planów jest zwinięta pod przyciskiem „Zmień plan” (decyzja właściciela DEC-09 a, 27.10.2026; test `tests/audit-m1-2026-10-27-010-stan-mam-plan.test.tsx`)
  - Scenariusz: Zmiana planu
    - Zakładając, że użytkownik ma aktywną subskrypcję i stuka „Zmień plan”
    - Gdy lista planów się rozwija
    - Wtedy posiadany plan jest oznaczony „Aktualny plan” i nie da się go wybrać ani kupić drugi raz, inny plan subskrypcji kupuje przyciskiem „Przejdź na ten plan” z informacją o automatycznym odnawianiu, dożywotni przyciskiem „Kup na zawsze”; drugie stuknięcie „Zmień plan” i udana zmiana planu zwijają listę
  - Scenariusz: Plan dożywotni
    - Zakładając, że użytkownik ma plan dożywotni (bez aktywnej subskrypcji)
    - Gdy otwiera ekran zakupu
    - Wtedy nagłówek karty to „Masz plan: {nazwa planu}” z dopiskiem „Masz dostęp na zawsze”, bez listy planów i bez „Zmień plan”
  - Scenariusz: Dożywotni przy aktywnej subskrypcji
    - Zakładając, że użytkownik sam płaci za aktywną subskrypcję (nie z Chmury rodzinnej ani z kodu)
    - Gdy rozwija „Zmień plan” i zaznacza plan dożywotni
    - Wtedy przed przyciskiem „Kup na zawsze” czyta, że subskrypcja dalej się odnawia i trzeba ją anulować, żeby nie płacić podwójnie (docs/27 3.11; test `tests/audit-m1-2026-10-27-001-dozywotni-przy-subskrypcji.test.tsx`)

### BR-PRV-001: Zastrzeżenie medyczne widoczne w aplikacji
- Przepływ: PR-01
- Dowód potrzeby: OG-02; `components/MedicalNote.tsx`
- Kryteria akceptacji:
  - Scenariusz: Zdanie na ekranie
    - Zakładając, że użytkownik otwiera ekran z zastrzeżeniem (np. generator, trening)
    - Gdy ekran się wyświetla
    - Wtedy jest zdanie, że aplikacja nie udziela porad medycznych i że przy bólu, urazie lub chorobie należy skonsultować się z lekarzem lub fizjoterapeutą

## Wymagania niefunkcjonalne

### NFR-PRV-001: Brak wywołań sieciowych
- Miara: liczba wywołań sieciowych w kodzie aplikacji. Próg: 0. Metoda: test `tests/public-repo.test.ts` (README.md, ZP-05).
### NFR-DAN-001: Brak utraty danych przy aktualizacji
- Miara: liczba zapisów z wydanych wersji, które po migracji tracą dane. Próg: 0. Metoda: testy `tests/migrate-released.test.ts` na zapisach z wydanych buildów (`tests/fixtures/released/`) i `tests/matrix-migrations.test.tsx`.
### NFR-JEZ-001: Kompletność tłumaczeń
- Miara: liczba kluczy słownika bez tłumaczenia w którymkolwiek języku z `LANGS`. Próg: 0, z jednym nazwanym wyjątkiem (23.10.2026, decyzja właściciela o języku naturalnym): klucze z zestawu `docs/lokalizacja/zestaw-przekladu-2026-10-23.json` czekają na przekład na 33 języki (rodzaj „nowy” — angielski w zastępstwie; „zmieniony” — stare tłumaczenie); po przekładzie zestaw jest pusty i wyjątek znika. Metoda: `npm run check:i18n` oraz `tests/i18n-locales.test.ts`.
### NFR-DOS-001: Skalowanie tekstu systemowego
- Miara: największa obsługiwana skala tekstu systemowego (Dynamic Type) w opisach. Próg: 2 (200%, `TEXT_SCALE_MAX` w `lib/theme.ts`). Metoda: test przeglądu dostępności `tests/matrix-a11y.test.tsx`. Znaki-ikony w tekście (›, ▾, ✓, ✕, ⇄…): próg 1,4 (`GLYPH_SCALE_MAX` w `lib/theme.ts`), ten sam test (T-04, telefon 27.10.2026).
### NFR-WYG-001: Wygląd z jednego modułu tokenów
- Miara: liczba literałów liczbowych `fontSize` i `borderRadius` w kodzie interfejsu poza `lib/theme.ts` i `lib/tokens.ts`; osobno liczba par barw palet (jasna, ciemna, obie „Zwiększ kontrast”) poniżej progu kontrastu (tekst 4,5:1, duży tekst i elementy 3:1, w „Zwiększ kontrast” tekst pomocniczy i akcent 7:1). Próg: literały — nie więcej niż w wykazie `tests/token-baseline.json` (zapadka, docelowo 0 po partiach p2–p5 redesignu M3); pary poniżej progu — 0 z 210. Metoda: testy `tests/m3-token-guard.test.ts`, `tests/m3-contrast.test.ts`, `tests/m3-theme.test.ts` (decyzje STOP E3 z 21.10.2026, docs/18; M1-036, M1-031). Od 22.10.2026 (uwagi właściciela z telefonu, docs/18): nagłówek ekranu zakładki ze wspólnego `TabHeader` (`HEADER` w tokenach), na starcie mała ikonka sztangi po tytule zamiast sylwetki w rogu (nie nachodzi na tekst; ukryta dla VoiceOver), wskaźnik przewijania ukryty na wszystkich przewijanych ekranach (`components/Scroll.tsx`, strażnik S18; docs/32 wzorzec 31); testy `tests/trening-naglowek.test.tsx`, `tests/interaction-guards.test.ts`.
