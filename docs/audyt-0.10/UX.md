# Audyt 0.10.0 — sens produktu i przepływy (UX)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Mapa funkcji i wejść

Kod: d2a1e85. Worktree był najpierw na złym commicie, ale wszystko czytałem i uruchamiałem z d2a1e85 (archiwum, potem worktree przełączony przez koordynatora). Do sprawdzenia napisałem dwa testy robocze:
- <worktree audytora, poza repo>/tests/zz-audit-ux-a.test.tsx
- <worktree audytora, poza repo>/tests/zz-audit-ux-b.test.tsx

Oba przechodzą. Nie są w gicie i nie należy ich commitować. Zrzuty tekstów ekranów są w `scratchpad/ux-audit/out/`. Własne zrzuty web (SE 320×568 i std 375×812, stany „nowa osoba” i „z planem”) są w `scratchpad/ux-audit/shots/`, obok zrzutów koordynatora.

**Start treningu (8 wejść)**
- Na ekranie Trening:
  - karta „Dziś” → Start: `startTemplate`, z pytaniem o deload;
  - lista „Zacznij z szablonu” → Start: to samo;
  - „Powtórz ostatni” (`repeatLast`) **bez pytania o deload**;
  - „Pusty trening”.
- Edytor szablonu → Start (`startTemplate`).
- Panel dnia w Kalendarzu → Start (tylko dziś).
- Przypomnienie o 8:00: tylko otwiera aplikację.
- Kalendarz → „+ Dodaj trening wstecz”.

**Planowanie**
- Plan tygodnia, 4 wejścia: przycisk w Kalendarzu, karta „Dziś” bez planu, Pierwsze kroki (krok 2), powrót z generatora.
- Panel dnia, 7 akcji: Start, Przesuń plan o 1 dzień, Przesuń tylko ten trening / Przenieś na dziś, Inny/Dodaj trening, Wolne w tym dniu, Przywróć z planu, Propozycje.
- Inne plany: Zapisz kopię, Ustaw jako aktywny, usuwanie gestem.

**Generator** — 3 wejścia: Szablony, Plan tygodnia, Pierwsze kroki (+ „Pokaż” w przewodniku).

**Deload**
- Podpowiedź w Kalendarzu: tylko następny tydzień, po ≥4 tygodniach treningu z rzędu.
- Przełącznik w Postępy → Podsumowanie: tylko bieżący i przeszłe tygodnie.
- Pytanie przy Start.

**Pomoc** — trzy nakładające się elementy (zgodnie z decyzją 08.10):
- Pierwsze kroki: tylko na ekranie Trening.
- Przewodnik, 8 tematów: Więcej, Pierwsze kroki, Co nowego.
- Co nowego („i”): tylko na ekranie Trening.

**Historia i edycja**
- Lista w Kalendarzu → Sesja → Edytuj.
- „Ostatni trening” na ekranie Trening → Sesja.
- Po zakończeniu treningu → Sesja.
- Trening wstecz.

**Postępy** — Więcej → Postępy; ekran ćwiczenia → Postępy. Kafelki tygodnia nie prowadzą do Postępów.

**Miejsca** — Więcej („Miejsca i sprzęt”), Ustawienia („Miejsca treningu”), 📍 w treningu, miejsce domyślne szablonu, chipy generatora (bez możliwości dodania miejsca). Gumy: tylko z ekranu miejsca.

**Kopia** — Więcej → Backup; Ustawienia (kopia automatyczna, „Wyczyść”); komunikaty o błędzie zapisu na ekranie Trening.

**Ustawienia** — ok. 15 pozycji: język, wygląd, jednostki, widok treningu, przerwa, dźwięk, ekran włączony, RPE/RIR, miejsca, podpowiedź progresji, Apple Health, kopia automatyczna, przypomnienie, zgoda na powiadomienia, wyczyść dane. Nie są przeładowane.

**Pokrycie**
- Wyrenderowane w jest:
  - ekran Trening w 5 stanach: nowa osoba, po generatorze, z planem, tydzień deload, zrobiony inny trening;
  - Co nowego, Przewodnik, Generator, Plan tygodnia;
  - Kalendarz z panelem dnia: dzień opuszczony, dzień przeszły zrobiony, dziś zrobione, dzień przyszły;
  - Propozycje, Szablony (usuwanie gestem).
- Web: ekran Trening, Kalendarz z panelem dnia, Plan tygodnia, Generator, Przewodnik, Ustawienia.
- Tylko z kodu i zrzutów koordynatora: zamiana, wybór ćwiczenia, kolejność, ekran ćwiczenia, gumy, język, backup, miejsca, szczegóły, edycja i dodawanie sesji.

## Znaleziska

### UX-01 — Panel dnia mówi „Opuszczony” albo „Zaplanowany” o dniu, w którym trening się odbył
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (test J9, J5).
  - Poniedziałek: plan Upper A i odbyty Upper A, w kalendarzu kółko wypełnione. Panel dnia mówi „Opuszczony: Upper A” i proponuje „Przenieś na dziś”.
  - Dziś: Upper B zrobiony. Panel pokazuje „Zaplanowany: Upper B”, przycisk Start i „Przesuń plan o 1 dzień”. Kliknięcie daje komunikat „Plan przesunięty: Upper B → pt.”.
  - Plan na dziś to Upper A, a zrobiony był trening Legs. Karta pokazuje „Dziś: Upper A · zrobione”.
  - Przyczyna: `DayPanel` liczy stan z `plannedOn` + „przeszłość”, a nie z `dayStatus`. `dayStatus` uznaje za „zrobione” dowolny trening tego dnia.
- **Skutek:** Trzy widoki (kalendarz, panel, karta „Dziś”) mówią o tym samym dniu co innego. Panel zachęca do przesunięcia albo powtórzenia treningu, który już się odbył.
- **Opcje:**
  - **A** — jeden stan dnia wszędzie. Panel dnia z odbytym treningiem pokazuje „Zrobione: <nazwa sesji>” z linkiem do sesji, bez Start i bez przesuwania. Karta „Dziś” pokazuje nazwę faktycznie zrobionej sesji. Koszt: mały.
  - **B** — A, a do tego dopasowanie po szablonie: inny trening = „zrobione (inny)”, a zaplanowany zostaje do przesunięcia. Koszt: średni, więcej stanów.
  - **Rekomendacja:** A teraz; B do decyzji właściciela.

### UX-02 — Plan obowiązuje wstecz, bez daty początku i bez historii zmian
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (J1, test B: A/B/C).
  - Nowa osoba generuje plan w czwartek. Na karcie „Dziś” od razu widzi „pon. opuszczony: FBW A, śr. opuszczony: FBW B”.
  - Wrzesień ma 13 dni „opuszczonych”, 03.03.2025 też jest „opuszczony”.
  - Zmiana aktywnego planu przepisuje przeszłość: 15.09 zmienia się z „wolne” na „opuszczony: Legs — siłownia”.
  - `tidy()` po 60 dniach kasuje zmiany dni. Przeniesiony i zrobiony trening (01.07 → 02.07) wraca jako „opuszczony” 01.07.
  - Nie ma sposobu, żeby zawiesić plan (urlop, choroba) — zostaje tylko ustawianie „Wolne” dzień po dniu.
- **Skutek:** Fałszywe, demotywujące „opuszczone” od pierwszego dnia i w całej historii kalendarza. Kalendarz nie pokazuje tego, co było planowane wtedy.
- **Opcje:**
  - **A** — plan z datą „obowiązuje od” i wersjami planu w czasie. Zmiana schematu danych, czyli osobne wydanie bez aktualizacji SDK (CLAUDE.md).
  - **B** — bez zmiany schematu: „opuszczony” tylko od daty pierwszego treningu albo ustawienia planu i tylko w ostatnich ~7 dniach. Starsze dni pokazują wyłącznie odbyte treningi. Koszt: mały.
  - **C** — dodatkowo „Przerwa w planie od–do”.
  - **Rekomendacja:** B teraz; A i C do decyzji właściciela przy wydaniu ze zmianą danych.
- Pokrywa się z obszarem audytora logiki.

### UX-03 — Opuszczony dzień: „Przenieś na dziś” → „Zamień miejscami” wrzuca dzisiejszy trening w przeszłość
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (J2). Sytuacja: wczoraj Upper A opuszczony, dziś Upper B, jutro wolne. Po „Przenieś na dziś” i „Zamień miejscami”:
  - wczoraj: „Opuszczony: Upper B · zmiana planu”,
  - dziś: Upper A,
  - jutro: puste.
  - Istniejący test `tests/plan-calendar-ui.test.tsx` utrwala to zachowanie.
  - Dla dnia przeszłego nie ma „Przesuń plan o 1 dzień” (tryb (a) właściciela: A dziś, B jutro), nie ma „Wolne” i nie ma „Dodaj trening wstecz z tego dnia”.
  - „Pomiń ten trening” w Propozycjach zwykle wypada poza pokazane 3 propozycje (sortowanie po liczbie wypadających treningów).
- **Skutek:** Najczęstszy przypadek („wczoraj nie dałem rady”) kończy się zgubieniem dzisiejszego treningu. Właściwy wynik daje tylko schowane „Propozycje”.
- **Opcje:**
  - **A** — dla dnia przeszłego „Przesuń plan od dziś” (łańcuch do pierwszego wolnego dnia, jak tryb (a)). „Zamień miejscami” tylko między dniami przyszłymi. Do tego „Oznacz jako wolne” i „Zapisz trening z tego dnia” (trening wstecz z datą). Koszt: mały.
  - **B** — przy konflikcie z dniem przeszłym zamiast „Zamień miejscami” odesłać do „Propozycje”. Koszt: najmniejszy, więcej kroków.
  - **Rekomendacja:** A — wprost realizuje decyzję 2A.

### UX-04 — Tymczasowy plan i powrót do starego (wprost wskazany przypadek właściciela) — mylące nazwy i utrata zmian dni
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (J8, J10, test D) i Z KODU.
  - Ścieżka ręczna: „Zapisz kopię jako nowy plan” → edycja aktywnego → powrót. Oryginalna rutyna jest teraz aktywna pod nazwą „Kopia: Mój plan”, a tymczasowy plan leży w „Inne plany” jako „Poprzedni plan”. Nazwy są odwrócone.
  - Ten sam nienazwany plan nazywa się raz „Mój plan”, raz „Poprzedni plan”. Kolejne cykle tworzą kilka wpisów „Poprzedni plan”.
  - Generator z „Ustaw jako aktywny” kasuje zmiany pojedynczych dni od dziś. Okno mówi tylko „wrócisz do niego jednym przyciskiem”, a docs/24 wymaga uprzedzenia o tym przed potwierdzeniem. Po powrocie zmiany nie wracają.
  - Dwukrotne generowanie daje dwa plany „Masa, 3× w tygodniu”.
  - Zapisanych planów nie da się edytować ani przemianować (`renamePlan` nie jest używane w UI; docs/24 przewiduje „zmianę nazwy”).
- **Opcje:**
  - **A** — „Nowy plan” jako osobny wpis, który się edytuje i potem aktywuje. Oryginał zachowuje nazwę, plan bez nazwy dostaje datę („Plan do 8.10”). Zmiany dni zapisują się razem z planem i wracają przy powrocie. Koszt: średni.
  - **B** — minimum: okno generatora uprzedza o zmianach dni (jak Plan tygodnia), „Zapisz kopię” pyta o nazwę, zmiana nazwy w „Inne plany”. Koszt: mały.
  - **Rekomendacja:** B w najbliższej poprawce; A do decyzji właściciela.

### UX-05 — Przypomnienie z planu planuje się bez zgody na powiadomienia
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (J7): ustawienie dnia w planie przy braku zgody → `requestPermissionsAsync` 0 razy, `getPermissionsAsync` 0 razy, zaplanowane 1 powiadomienie.
- **Opis:**
  - O zgodę aplikacja prosi dopiero przy pierwszym treningu albo przy przełączniku off→on.
  - Krok 2 Pierwszych kroków obiecuje „dostaniesz przypomnienie”.
  - Komunikat „Sprawdź zgodę na powiadomienia” mówi tylko o końcu przerwy.
  - Przełącznik w Ustawieniach pokazuje „włączone” także przy odmowie zgody.
  - Horyzont to 7 dni (`PLAN_REMINDER_DAYS`) — osoba, która nie otworzy aplikacji przez tydzień, przestaje dostawać przypomnienia, czyli właśnie wtedy, gdy byłyby potrzebne. To ocena z kodu.
- **Opcje:**
  - **A** — prośba o zgodę przy pierwszym ustawieniu planu, z wyjaśnieniem; stan zgody przy przełączniku; tekst „Sprawdź zgodę” obejmuje oba rodzaje powiadomień; horyzont ok. 28 dni (1 dziennie, daleko od limitu 64 w iOS). Koszt: mały.
  - **B** — zostawić zgodę przy pierwszym treningu i dopisać to w kroku 2 i przy przełączniku.
  - **Rekomendacja:** A.

### UX-06 — Deload: obejście przez „Powtórz ostatni”, oznaczanie tygodnia rozrzucone po aplikacji
- **Waga:** ŚREDNIA
- **Dowód:**
  - POTWIERDZONE (J6): tydzień deload → „Powtórz ostatni” startuje z 4 seriami bez pytania. Decyzja 08.10 B mówi o pytaniu „przy starcie treningu”.
  - Z KODU:
    - Kalendarz pozwala oznaczyć tylko następny tydzień i dopiero po ≥4 tygodniach z rzędu.
    - Postępy pozwalają oznaczyć tylko bieżący i przeszłe tygodnie (strzałka w przód wyłączona).
    - Dowolnego przyszłego tygodnia nie da się zaplanować.
    - Podpowiedź nie ma „Nie teraz” — wisi na stałe nad kalendarzem (zrzut SE).
    - Ekran Trening i karta „Dziś” nie pokazują, że trwa tydzień deload.
- **Opcje:**
  - **A** — „Powtórz ostatni” pyta tak samo jak Start; na karcie „Dziś” napis „Tydzień deload”; „Oznacz tydzień jako deload” w panelu dnia dla dowolnego tygodnia; „Nie teraz” przy podpowiedzi. Koszt: mały–średni.
  - **B** — tylko poprawka „Powtórz ostatni” i napis na karcie.
  - **Rekomendacja:** B od razu, reszta z A do decyzji właściciela.

### UX-07 — Usunięcie albo archiwizacja szablonu z planu po cichu zamienia dni na wolne
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (J4, test F).
  - Okno usuwania pokazuje tylko „Usunąć szablon? / Upper A”. Po usunięciu poniedziałek i czwartek stają się „Wolne”, dzisiejszy trening znika z karty „Dziś”, a przypomnienia się kasują.
  - Archiwizacja ostatniego szablonu z planu daje `hasPlan()=false`, czyli karta pokazuje „Bez planu tygodnia”.
  - Archiwizowanie starego splitu to typowe użycie folderów i archiwum.
- **Opcje:**
  - **A** — potwierdzenie wymienia dni planu („Używany w planie: pon., czw. — te dni będą wolne”) i oferuje „Zamień w planie na…”. Koszt: mały.
  - **B** — blokada usunięcia szablonu z aktywnego planu. Koszt: mały, ale irytujące.
  - **Rekomendacja:** A.

### UX-08 — „Podgląd tygodnia” bez nazw treningów; nigdzie nie widać „co jutro”
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (zrzut SE, J1).
  - Pasek na karcie „Dziś” to same kółka i kropki; nazwy treningów ma tylko etykieta VoiceOver.
  - Komórki kalendarza też mają tylko kropki.
  - Pasek to bieżący tydzień pon.–nd., a nie 7 dni naprzód — w niedzielę nie pokazuje nic przyszłego. Wpis „Co nowego” obiecuje „podgląd 7 dni”.
  - Funkcja `upcoming()` w `lib/plan.ts` nie jest nigdzie używana.
  - Przy „Dziś wolne” brak informacji o następnym treningu.
  - Tapnięcie paska otwiera Kalendarz bez zaznaczonego dnia.
- **Opcje:**
  - **A** — pod paskiem 2–3 najbliższe treningi z nazwą („Jutro: Upper A · sob.: Legs”, użyć `upcoming()`); tapnięcie dnia otwiera ten dzień w Kalendarzu. Koszt: mały.
  - **B** — skrót nazwy w kółku. Słabe przy „Upper A/B”.
  - **C** — tylko poprawić tekst „Co nowego”.
  - **Rekomendacja:** A + poprawka tekstu.

### UX-09 — „Pokaż” w Przewodniku wkłada na stos drugi zestaw zakładek; Przewodnik pomija ważne funkcje
- **Waga:** ŚREDNIA
- **Dowód:**
  - POTWIERDZONE: stan routera po Przewodnik → „Trening i serie” → Pokaż to `__root: [(tabs), guide, (tabs)]`.
  - `(tabs)` ma `headerShown:false`, więc nie ma przycisku wstecz.
  - Dotyczy 4 z 8 tematów (trasy `/`, `/templates`, `/history`).
  - Temat „Deload” → Pokaż otwiera kalendarz, który zwykle nie ma żadnego elementu deload.
  - Przewodnik nie opisuje zamiany ćwiczenia (⇄), edycji sesji ani treningu wstecz, „Pomiń dziś”, supersetów.
- **Opcje:**
  - **A** — dla zakładek zamknąć stos i przejść do istniejącej zakładki (jak `goHome` w edytorze szablonu), test stosu nawigacji, dopisać 2–3 tematy. Koszt: mały.
  - **B** — przy zakładkach sam opis, bez „Pokaż”.
  - **Rekomendacja:** A.

### UX-10 — Generator: brak miejsca = plan na pełną siłownię, ponowne generowanie mnoży szablony, wskazówki giną po zapisie
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (J1, test D) i Z KODU.
  - Świeża instalacja nie ma miejsc. Generator pokazuje tylko „Bez ograniczeń sprzętu” i proponuje Back Squat, sztangę, Lat Pulldown. Nie ma przejścia do dodania miejsca, a Pierwsze kroki nie mają kroku „Miejsce i sprzęt”.
  - Drugie generowanie daje „FBW A (2)”, „FBW B (2)” obok starych szablonów i drugi plan o tej samej nazwie.
  - Opis wysiłku (1–3 powtórzenia w zapasie, RIR) i zasada progresji są tylko w podglądzie — szablon po zapisie ich nie ma.
  - Po zapisie aplikacja przechodzi na Plan tygodnia bez potwierdzenia, co i gdzie zapisano.
  - Domyślne ustawienia (masa, 3×, 60 min) dają ostrzeżenie „Poniżej 10 serii: biceps, triceps, dwugłowe, pośladki” — merytoryka należy do MER.
- **Opcje:**
  - **A** — chip „+ Dodaj miejsce” z wyjaśnieniem; przy ponownym generowaniu pytanie „Zastąpić poprzednio wygenerowane, nieużywane szablony?”; nazwa planu z miejscem i datą; jedna linijka opisu wysiłku w szablonie; potwierdzenie z linkiem do folderu. Koszt: mały–średni.
  - **B** — tylko komunikat o braku miejsc i unikalne nazwy planów.
  - **Rekomendacja:** A, zaczynając od miejsca i ponownego generowania.

### UX-11 — Brak „Zaktualizuj szablon” i „Zapisz jako szablon”
- **Waga:** ŚREDNIA
- **Dowód:** Z KODU: brak takich funkcji. W docs/11 to pozycja „mała zmiana, duża wygoda”, w badaniu skarg pkt D3 i życzenie nr 4.
- **Opis:**
  - Zmiany z treningu (dodane i zamienione ćwiczenia, liczba serii) nie mają jak trafić do szablonu.
  - „Pusty trening”, polecany nowym osobom w Pierwszych krokach, nie zamieni się w szablon.
  - Decyzja z 03.10 wyklucza zmiany robione samoczynnie przez aplikację, ale nie wyklucza zmiany na wyraźne polecenie użytkownika.
- **Opcje:**
  - **A** — po treningu z szablonu, gdy skład się różni: „Zaktualizować szablon? / Tylko ten raz”, do tego B.
  - **B** — „Zapisz jako szablon” w szczegółach sesji, bez żadnych okien.
  - **C** — bez zmian.
  - **Rekomendacja:** B (zero okien, zgodne z zasadą); A opcjonalnie. Decyzja właściciela.

### UX-12 — Pierwsze kroki: ta sama instrukcja 3 razy, odwołanie do przycisku poza ekranem, krok 2 prowadzi do pustego planu
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (J1, zrzut SE).
  - Krok 1, krok 3 i pusty stan pod spodem powtarzają „utwórz szablon („+ Nowy szablon” niżej) albo pusty trening”.
  - Na SE karta wypełnia cały ekran, a „+ Nowy szablon” jest poza nim. Głównym przyciskiem kroku 1 jest generator, choć ma być opcją, a nie domyślną drogą.
  - Krok 2 jest dostępny bez szablonów, więc otwiera plan z samymi „Wolne” ×7.
  - Krok 3 nigdy nie dostaje ✓.
  - Jednostka zawsze startuje jako kg, także dla en-US.
  - Nowa osoba widzi w „Co nowego” zmiany względem wersji, których nie znała.
- **Opcje:**
  - **A** — krok 3 jako jedno zdanie z linkiem do tematu „Trening i serie”; ukryć pusty stan, gdy widać Pierwsze kroki; w kroku 1 dwa równorzędne przyciski („+ Nowy szablon”, „Wygeneruj”); krok 2 nieaktywny bez szablonu; opcjonalny krok „Miejsce i sprzęt”.
  - **B** — tylko przycisk „+ Nowy szablon” w karcie.
  - **Rekomendacja:** A.

### UX-13 — Panel dnia: za dużo przycisków, a na małym ekranie jest poza widokiem
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE.
  - Zrzut SE 320×568: po tapnięciu dnia widać tylko jego datę, wszystkie akcje są niżej.
  - 5–7 przycisków; „Propozycje” powielają przesuń, przenieś i pomiń.
  - Na std się mieści.
- **Opcje:**
  - **A** — po tapnięciu przewinąć do panelu; 3 główne akcje i „Więcej opcji”.
  - **B** — tylko przewinięcie.
  - **Rekomendacja:** B teraz; układ z A do decyzji właściciela.

### UX-14 — Nazewnictwo i oznaczenia niespójne
- **Waga:** NISKA
- **Dowód:** Z KODU i zrzuty.
  - Komunikat po automatycznym zapisie mówi „Znajdziesz go w Historii”, a takiej zakładki już nie ma.
  - Zakładka Kalendarz ma ikonę wykresu.
  - Ta sama pozycja nazywa się „Miejsca i sprzęt” i „Miejsca treningu”.
  - Generator: „Generator planu”, „Generator szablonów i planu” i „Wygeneruj szablony i plan”.
  - Karta: „DZIŚ / Dziś: Upper B”.
  - „Mój plan”, „Poprzedni plan” i „Kopia: Mój plan” dla tego samego planu.
  - Nazwy z generatora („FBW A”, „Wygenerowane”, „Masa, 3× w tygodniu”) zostają po polsku po zmianie języka.
  - Czarny pierścień oznacza „dziś” na pasku, a „wybrany dzień” w kalendarzu. Dziś z zaplanowanym treningiem wygląda w kalendarzu jak każdy inny zaplanowany dzień.
- **Opcje:**
  - **A** — jedna lista poprawek tekstów i ikon.
  - **B** — bez zmian.
  - **Rekomendacja:** A.
- Pokrywa się z obszarami UI i i18n.

### UX-15 — Ekran Plan tygodnia źle się skaluje
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zrzut).
  - 7 dni × (1 + liczba szablonów) chipów, bez podziału na foldery: 35 chipów przy 4 szablonach, ponad 70 po dwóch generowaniach.
  - „Wygeneruj”, „Zapisz kopię” i „Inne plany” są na samym dole.
- **Opcje:**
  - **A** — 7 wierszy „poniedziałek — Upper A ›” z wyborem szablonu w folderach; „Inne plany” na górze.
  - **B** — zostawić chipy, „Inne plany” przenieść wyżej.
  - **Rekomendacja:** A.

### UX-16 — Drobne niespójności przepływów
- **Waga:** NISKA
- **Dowód:** Z KODU i zrzuty.
  - Bez planu: stała zachęta na karcie „Dziś” i w Kalendarzu, bez możliwości ukrycia — dla kogoś, kto tylko loguje treningi.
  - Lista sesji pod kalendarzem nie idzie za oglądanym miesiącem.
  - Kafelki „Ten tydzień” nie prowadzą do Postępów (te same definicje).
  - „Powtórz ostatni (Upper A)” stoi obok karty „Dziś: Upper B”, czyli wbrew planowi.
  - Trening wstecz pokazuje też szablony z archiwum.
- **Opcje:**
  - **A** — „Ukryj” przy zachęcie; lista filtrowana miesiącem; kafelki → Postępy; przy planie „Powtórz ostatni” niżej albo schowany.
  - **B** — bez zmian.
  - **Rekomendacja:** A, wybiórczo.

## Sprawdzone i w porządku

**Decyzje z docs/18 wdrożone zgodnie z ustaleniami, bez odrzuconych wariantów:**
- Kalendarz (decyzja 1A) w miejscu Historii: miesiąc z odbytymi, zaplanowanymi i deload, niżej lista sesji.
- Dwa tryby przesuwania (decyzja 2A):
  - łańcuch tylko do pierwszego wolnego dnia — przykład właściciela FBW A/B sprawdzony w J9;
  - konflikt nigdy nie rozstrzyga się bez zgody.
- Propozycje z regeneracją, oznaczone jako uproszczenie; powrót w 10 dni.
- Dashboard w wariancie A.
- Pierwsze kroki zamiast jednej karty powitalnej; znikają po pierwszym treningu.
- Co nowego:
  - tylko na ekranie Trening;
  - kropka tylko po aktualizacji i tylko u osób z historią;
  - nic nie wyskakuje samo;
  - starsze wersje zwinięte.
- Przewodnik (wariant A) z trzema wejściami.
- Deload A+B:
  - podpowiedź opisana jako praktyka trenerów;
  - pytanie przy Start w 4 z 5 wejść;
  - szablon bez zmian, bez kopii szablonów.
- Generator A:
  - wejście z Szablonów i z Planu tygodnia;
  - cel, miejsce, sesje i czas;
  - podgląd przed zapisem;
  - folder „Wygenerowane”, plan obok innych, pytanie o aktywację;
  - cardio umiarkowane z licznikiem minut, bez „na czczo” i „strefy 2”.
- Przypomnienie: jedno, o 8:00; pomija dzień zrobiony lub trwający; wyłączane w Ustawieniach.
- Kilka planów z jednym aktywnym; „Ustaw jako aktywny” na ekranie planu uprzedza o liczbie usuwanych zmian dni.
- Wersja 0.10.0.
- Funkcje odłożone decyzją z 07.10 (19:45) są nieobecne w UI. Licznik przerwy na ekranie blokady jest bez przycisków.
- „Widok treningu: Skupiony / Lista” — opis zmienia się z wyborem.
- Stopka w Więcej.

**Przepływy działające poprawnie:**
- Codzienny trening z planu: przypomnienie → ekran Trening → Start = 2 tapnięcia.
- Pusty nowy szablon znika po wyjściu z edytora.
- Poprawka ostatniego treningu: „Ostatni trening” → Sesja → Edytuj.
- Trening wstecz zmienia „opuszczony” na „zrobione”.
- Przywrócenie szablonu z archiwum przywraca dni planu.
- Pola planu przechodzą przez `migrate` i kopię.
- Ustawienia nie są przeładowane.
- Przy podróży miejsce zmienia się w nagłówku treningu, a zamienniki „Zawsze w: …” zapisują się tylko na polecenie.

**Uwaga procesowa:** otwarte decyzje 2–10 z listy z 06.10 w docs/18 nadal czekają na odpowiedź właściciela. To nie jest odstępstwo od decyzji, tylko zaległość.

Pliki z dowodami:
- testy robocze: `tests/zz-audit-ux-a.test.tsx`, `tests/zz-audit-ux-b.test.tsx` (w worktree, poza gitem);
- wyniki: `<scratchpad sesji audytu, poza repo>/ux-audit/out/`;
- zrzuty: `<scratchpad sesji audytu, poza repo>/ux-audit/shots/`.
