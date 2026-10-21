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

### BR-TRN-003: Pauza treningu
- Przepływ: PR-01
- Dowód potrzeby: J-01 (odtworzone z README.md); kod `lib/state/pause.ts`
- Kryteria akceptacji:
  - Scenariusz: Czas pauzy nie wlicza się
    - Zakładając, że trening w toku jest wstrzymany przyciskiem „Pauza”
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
    - Wtedy ćwiczenia pokazane są jako lista serii; przy widoku „Skupiony” karta bieżącej serii

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
  - Scenariusz: Wpis „lekko”
    - Zakładając, że wybrano skalę RIR
    - Gdy użytkownik wpisuje RIR 6
    - Wtedy zapisuje się RPE 4 („lekko”), a ekran pokazuje „6+” (RD-02-W3)

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
    - Wtedy przychodzi powiadomienie lokalne z dźwiękiem i wibracją (gdy włączone „Dźwięk i wibracja na koniec przerwy”)
  - Scenariusz: Brak zgody na powiadomienia
    - Zakładając, że zgoda na powiadomienia nie została udzielona
    - Gdy użytkownik otwiera ekran treningu
    - Wtedy ekran informuje, że przypomnienia i koniec przerwy nie przyjdą, i wskazuje ustawienia iOS

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
- Kryteria akceptacji:
  - Scenariusz: Szablony przypisane do dni
    - Zakładając, że użytkownik ma szablony
    - Gdy przypisuje je do dni tygodnia w planie
    - Wtedy plan powtarza się co tydzień, a ekran Trening pokazuje dzisiejszy trening z planu
  - Scenariusz: „Planowanie” w nagłówku zakładki Plan (M3 p3, W1 c)
    - Zakładając, że użytkownik jest w zakładce Plan
    - Gdy chce przejść do planowania
    - Wtedy przycisk „Planowanie” jest przy tytule, w tym samym miejscu co na ekranie Trening, i otwiera ekran planu

### BR-PLN-002: Kilka planów z wyborem aktywnego
- Przepływ: PR-03
- Dowód potrzeby: J-02; D-004 (funkcja zostaje w aplikacji); docs/18
- Kryteria akceptacji:
  - Scenariusz: Wybór aktywnego planu
    - Zakładając, że użytkownik ma więcej niż jeden plan
    - Gdy wybiera aktywny plan
    - Wtedy kalendarz i ekran Trening korzystają z planu aktywnego

### BR-PLN-003: Deload: oznaczenie tygodnia i propozycja mniejszej liczby serii
- Przepływ: PR-03
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
- Przepływ: PR-04
- Dowód potrzeby: ZP-01; D-004; docs/24-generator-i-plany.md
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
  - Scenariusz: Jeden tryb generatora (ZM-03)
    - Zakładając, że użytkownik otwiera generator
    - Gdy ogląda ekran
    - Wtedy generator nie ma przełącznika trybu; „Plan z moich szablonów” jest osobnym wejściem w Planowaniu

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
- Kryteria akceptacji:
  - Scenariusz: Sprzęt w miejscu
    - Zakładając, że użytkownik zdefiniował miejsce ze sprzętem
    - Gdy wybiera miejsce treningu
    - Wtedy lista ćwiczeń i ciężary do wyboru odpowiadają sprzętowi tego miejsca

### BR-MJS-002: Dostosuj do miejsca: propozycje do przejrzenia
- Przepływ: PR-09
- Dowód potrzeby: J-05; D-004; docs/33-dostosowanie-do-miejsca-spec.md
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
- Przepływ: PR-05 · Reguła: RD-01
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
- Kryteria akceptacji:
  - Scenariusz: Dwa okresy
    - Zakładając, że w obu okresach są zapisane treningi
    - Gdy użytkownik otwiera Progresję
    - Wtedy widzi objętość, serie i treningi bieżącego okresu obok poprzedniego

### BR-PST-005: Postępy: wykres i rekordy wybranego ćwiczenia na górze, wybór pod nimi
- Przepływ: PR-05
- Dowód potrzeby: J-03; decyzje właściciela 2026-10-21 (ZM-06, M1-026 = DEC-09, docs/design/to-be.md); testy `tests/m3-p3-postepy-historia.test.tsx`
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
- Przepływ: PR-05
- Dowód potrzeby: J-03; docs/research/32-serie-na-partie.md
- Kryteria akceptacji:
  - Scenariusz: Cel ręczny
    - Zakładając, że użytkownik ustawił cel ręcznie dla partii
    - Gdy otwiera „Ten tydzień”
    - Wtedy kreska celu dla tej partii pokazuje liczbę z ustawień, a pozostałe partie — wartość automatyczną

### BR-BIB-001: Biblioteka ćwiczeń z krótkimi wskazówkami techniki
- Przepływ: PR-01
- Dowód potrzeby: J-01; docs/research/27-wskazowki-zrodla.md (generowany)
- Kryteria akceptacji:
  - Scenariusz: Wskazówki w języku aplikacji
    - Zakładając, że ćwiczenie ma wskazówki techniki
    - Gdy użytkownik otwiera ćwiczenie
    - Wtedy sekcje „Ustawienie”, „Ruch”, „Wskazówki” i „Częste błędy” są po polsku lub w języku aplikacji; nazwa ćwiczenia z biblioteki zostaje po angielsku (decyzja 2026-10-19)
  - Scenariusz: Usunięcie własnego ćwiczenia z podglądu (ZM-04, W2 a, 21.10.2026)
    - Zakładając, że użytkownik ogląda podgląd ćwiczenia własnego
    - Gdy stuka „Usuń z biblioteki” na dole ekranu
    - Wtedy pojawia się to samo okno potwierdzenia co po geście na liście, a po „Usuń” ćwiczenie znika z biblioteki (historia zostaje); przy ćwiczeniu wbudowanym przycisku nie ma (decyzja STOP 3, 2026-10-21), a gest na liście działa jak dotąd

### BR-BIB-002: Informacja o asekuracji przy sztandze nad ciałem lub na barkach
- Przepływ: PR-01
- Dowód potrzeby: OG-02; test `tests/audit-m1-015-asekuracja.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Zdanie o asekuracji
    - Zakładając, że ćwiczenie ma w katalogu zalecenie ramion asekuracyjnych
    - Gdy użytkownik otwiera to ćwiczenie
    - Wtedy ekran pokazuje zdanie o asekuracji, a wybór ćwiczenia w miejscu bez ramion asekuracyjnych oznacza je „bez asekuracji w stojakach”

### BR-ZDR-001: Opcjonalny zapis zakończonych treningów do Apple Health
- Przepływ: PR-07
- Dowód potrzeby: OG-01; docs/28-healthkit-etap0.md; `site/privacy.html`
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
- Dowód potrzeby: OG-01; D-004; docs/29-zdrowie-odczyt-spec.md; `site/privacy.html`
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

### BR-DAN-003: Aktualizacja aplikacji zachowuje dane
- Przepływ: PR-06
- Dowód potrzeby: J-04; test `tests/audit-m1-002-premigrate.test.ts`; NFR-DAN-001
- Kryteria akceptacji:
  - Scenariusz: Migracja z poprzedniego schematu
    - Zakładając, że zapis pochodzi z poprzedniej wersji aplikacji
    - Gdy użytkownik uruchamia nową wersję
    - Wtedy dane są przeniesione do nowego schematu, a kopia zapisu sprzed migracji istnieje

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
  - Scenariusz: Miejsce główne
    - Zakładając, że otwarto ekran miejsca głównego, a istnieją inne miejsca
    - Gdy użytkownik przegląda ekran
    - Wtedy przycisku „Usuń miejsce” nie ma (jak gestu)

### BR-JEZ-001: Interfejs w wielu językach
- Przepływ: PR-08
- Dowód potrzeby: J-04; docs/16-jezyki-i-marka.md; NFR-JEZ-001
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

### BR-JEZ-003: Jednostka ciężaru kg albo lb
- Przepływ: PR-08
- Dowód potrzeby: J-01; OP-02
- Kryteria akceptacji:
  - Scenariusz: Zmiana jednostki
    - Zakładając, że użytkownik ma zapisane treningi w kg
    - Gdy zmienia jednostkę na lb
    - Wtedy wartości pokazują się w lb, a zapis w danych zostaje w kg

### BR-ZAK-001: Model dostępu zgodny z modelem stałym
- Przepływ: PR-08
- Dowód potrzeby: ZP-06; docs/monetyzacja.md
- Kryteria akceptacji:
  - Scenariusz: Zakupy wyłączone w obecnych buildach
    - Zakładając, że build ma `PAYWALL.ENABLED` = false
    - Gdy użytkownik korzysta z aplikacji
    - Wtedy dostęp jest pełny i bez limitu treningów (ekran zakupu wyłączony)
  - Scenariusz: Limit po włączeniu zakupów
    - Zakładając, że zakupy są włączone, a użytkownik nie ma aktywnej subskrypcji ani zakupu dożywotniego
    - Gdy użytkownik rozpoczyna kolejny trening na żywo w miesiącu
    - Wtedy limit i okres próbny wynikają wyłącznie z docs/monetyzacja.md (`PAYWALL.FREE_LIVE_PER_MONTH`, `TRIAL_DAYS`)

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
- Miara: liczba kluczy słownika bez tłumaczenia w którymkolwiek języku z `LANGS`. Próg: 0. Metoda: `npm run check:i18n` oraz `tests/i18n-locales.test.ts`.
### NFR-DOS-001: Skalowanie tekstu systemowego
- Miara: największa obsługiwana skala tekstu systemowego (Dynamic Type) w opisach. Próg: 2 (200%, `TEXT_SCALE_MAX` w `lib/theme.ts`). Metoda: test przeglądu dostępności `tests/matrix-a11y.test.tsx`.
### NFR-WYG-001: Wygląd z jednego modułu tokenów
- Miara: liczba literałów liczbowych `fontSize` i `borderRadius` w kodzie interfejsu poza `lib/theme.ts` i `lib/tokens.ts`; osobno liczba par barw palet (jasna, ciemna, obie „Zwiększ kontrast”) poniżej progu kontrastu (tekst 4,5:1, duży tekst i elementy 3:1, w „Zwiększ kontrast” tekst pomocniczy i akcent 7:1). Próg: literały — nie więcej niż w wykazie `tests/token-baseline.json` (zapadka, docelowo 0 po partiach p2–p5 redesignu M3); pary poniżej progu — 0 z 210. Metoda: testy `tests/m3-token-guard.test.ts`, `tests/m3-contrast.test.ts`, `tests/m3-theme.test.ts` (decyzje STOP E3 z 21.10.2026, docs/18; M1-036, M1-031).
