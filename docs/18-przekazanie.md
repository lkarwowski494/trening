# 18. Przekazanie pracy do nowego czatu (06.10.2026, ok. 08:30 UTC)

Stan prac 06.10.2026. Przeniesienie do nowego czatu odwołane (właściciel 06.10: „Musimy zostać tutaj” — zwykły czat nie ma narzędzi
sesji Claude Code); plik zostaje jako punkt startowy na wypadek nowej sesji Claude Code. Nowa sesja zaczyna od tego pliku,
potem `CLAUDE.md`, docs/14 (E2), docs/15 (App Store / TestFlight), docs/17 (szablon jak trening), docs/09 (dziennik testów).

## Gałęzie i kod

- Praca: `feature/e2-swap` (od `integration/0.9.0`). Ostatni commit kodu: `e795731` (uniqueIds); `e900b61` — poprawka scenariusza E2E 04.
- `npm run verify` na `70481ce`: 1156 testów — OK.
- E2E (Maestro, `e2e-ios.yml`) na `70481ce`: przebieg nr 56 (run 37434083110) — 7/7 zielony (06.10, 08:57 UTC); linia GOTOWE w docs/14 przesunięta.
- GOTOWE DO BUILDU w docs/14: `e900b61` (06.10, 18:40 UTC; E2E run 37506280153 10/10). Wcześniej `70481ce` (06.10). `integration/0.9.0` i **`main`** zawierają całą wersję 0.9.0 (polecenie właściciela 06.10:
  „Cała wersja na main”, wykonane 06.10 ok. 09:15 UTC). Scalenie z `main` dołączyło do `CLAUDE.md` zasadę „Merytoryczne podstawy”
  (04.10, wcześniej tylko na `main`) — obowiązuje: hierarchia źródeł, właściciel nie rozstrzyga kwestii merytorycznych.
- Schemat danych: SCHEMA_VERSION 17 (TemplateItem.rows). SDK bez zmian w tym wydaniu.

## Zrobione 06.10.2026

- Postępy: objętość per partia (ten tydzień vs poprzedni), jak serie per partia.
- Stopka w „Więcej”: tylko numer wersji, małym drukiem (decyzja właściciela).
- `tests/scenario-full.test.tsx` — scenariusz od świeżej instalacji do czyszczenia i przywrócenia z kopii (16 kroków).
- Przegląd spójności, partie 1–3 (szczegóły i testy: docs/09, `tests/xcheck-0610*.test.tsx`).
- CI: `testflight.yml` (narzędzia Apple, bez EAS) — sekrety sprawdzane na początku, identyfikatory klucza poza logami.
- Właściciel 06.10: sekrety `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` są już dodane w GitHubie (nie weryfikowane przez agenta —
  pierwszy krok `testflight.yml` sprawdza ich obecność).

## Kroki właściciela przed pierwszym TestFlight (docs/15)

1. Rekord aplikacji w App Store Connect (identyfikator pakietu z `app.json`).
2. Klucz API z rolą **Admin** (App Manager nie utworzy certyfikatu dystrybucyjnego).
3. Po scaleniu do `main`: Actions → „TestFlight (testy wewnętrzne)” → Run workflow; po pierwszym przebiegu sprawdzić listę certyfikatów.

## Odpowiedź w sprawie Expo (06.10)

EAS (chmura Expo) nie jest potrzebny: repozytorium publiczne → darmowy macOS w Actions; `testflight.yml` buduje i wysyła narzędziami Apple.
Biblioteka Expo w aplikacji zostaje. Propozycja (decyzja właściciela otwarta): A — usunąć `iphone-eas.yml`, `iphone-local.yml`, `eas.json`
i skrypty EAS po pierwszym udanym TestFlight (rekomendacja); B — zostawić jako zapas do 01.11.2026. Zmiana `CLAUDE.md` tylko za zgodą właściciela.

## Otwarte decyzje właściciela (pierwsza opcja = rekomendacja agenta)

1. Potwierdzanie usunięcia serii (dziś trzy różne reguły): A pytać tylko o serię odhaczoną / z wartościami — wszędzie; B bez pytania + „Cofnij”; C zawsze pytać.
2. Notatka/RPE w wierszach szablonu: A bez; B notatka przy wierszu.
3. Zamiana ćwiczenia w szablonie: A „⇄ zamień” z zachowaniem serii i supersetu; B usuń + dodaj (jak dziś).
4. Miejsce w treningu wstecz: A wybór miejsca + 📍 w szczegółach sesji; B miejsce główne (jak dziś).
5. Kolejność i superset w edytorze historii: A bez; B dodać.
6. Smith: A osobny rodzaj ciężaru (gryf + talerze); B lista jak maszyna.
7. Presety kettli: A bez (zasada „tylko zweryfikowane modele”); B „typowy zestaw”.
8. Jednostka w CSV: A kolumna z jednostką na końcu; B nagłówek „Weight (kg/lb)”.
9. Uśpiony kod (przypomnienie o ważeniu, moduły, poranki): A usunąć; B zostawić.
10. Scenariusze E2E 08–10 (wiersze szablonu, język + wygląd, gumy; ok. +10 min przebiegu): A dodać; B nie.

Inne otwarte: rekordy per poziom gumy oporowej; zakresy powtórzeń wg celu treningowego (odłożone); presety stacji o niepełnych danych;
„Powtórz ostatni” a zamienione ćwiczenie (swappedFrom) — do zbadania przed propozycją.

## Decyzje właściciela po przekazaniu

- 06.10.2026: etykiety supersetów po 26 grupach zaczynają się od „A” — **zostaje** (wariant A: „nikt nie robi 27 supersetów”);
  test `tests/matrix-logic.test.tsx` (`groupLabels`) sprawdza zakres A–Z.
- 06.10.2026: scenariusze E2E 08–10 (wiersze serii w szablonie, język + wygląd, gumy) — **wdrażać** (wariant A).
- 06.10.2026: nazwa aplikacji (decyzje z sesji „Nazwa aplikacji treningowej”, 05.10, potwierdzone przez właściciela 06.10) — **najpierw nazwa,
  potem pierwszy TestFlight** (wariant B). Gryf bez talerzy = ciężary nieznane (wariant A, wdrożone f59d36e).
- 06.10.2026: testy przy każdym wypchnięciu — **wariant A**: `tests.yml` (verify na każdej gałęzi), E2E samo na `main` i `integration/**`.
- 06.10.2026: krój pisma dla bg/sr/uk — **wariant A**: IBM Plex Sans (Archivo nie ma cyrylicy); hiszpańska zakładka — **wariant A**: „Entreno”.
- 06.10.2026: cel przychodu ~2000 zł/mies., model 30 dni za darmo + jednorazowa płatność (rachunek w docs/15).
- 06.10.2026: powtórzone identyfikatory w imporcie — **wariant A**: przy wczytaniu powtórzony id dostaje nowy (`uniqueIds` w `migrate`), nic nie ginie.
- 06.10.2026: import treningu z niemożliwą datą (np. 30.02) — **wariant A**: zostaje jak jest (wczytuje się z najbliższą prawdziwą datą, bez ostrzeżenia).
- 06.10.2026: model płatności — **subskrypcja roczna odnawiana automatycznie, 29 zł/rok, miesiąc za darmo** (wariant A; zastępuje jednorazową płatność; docs/15).
- 06.10.2026: **bez darmowych użytkowników** — od pierwszej wersji 30 dni za darmo, potem subskrypcja roczna (odwołuje „wcześniejsi za darmo” z 05.10).
- 06.10.2026: **status tradera (DSA) od pierwszego dnia**; subskrypcja roczna 29 zł, najpierw **90 dni za darmo**, później 30 dni dla nowych (docs/15).
- 06.10.2026: po wygaśnięciu subskrypcji — nowe treningi zablokowane, historia/kopia/eksport działają zawsze (potwierdzone).
- 06.10.2026: scalenie 0.9.0 do `main` — **wariant B**: po zielonym E2E na `integration/0.9.0` (run 37512398240, `7c0781b`), potem pierwszy TestFlight.
- 06.10.2026: E2E na `integration/0.9.0` zielone 10/10 (run 37512398240, `7c0781b`); 07.10.2026 na polecenie właściciela („B”) `integration/0.9.0` i `main` przesunięte (fast-forward). Następny krok: TestFlight (kroki właściciela wyżej).
- 07.10.2026: pierwszy TestFlight — `testflight.yml` run 37581132769 na `main` (`5a8bcc5`) zielony: archiwum podpisane kluczem API (Admin), wysyłka do App Store Connect OK (ok. 18 min). Grupa wewnętrzna „Testy” utworzona przez właściciela.
- 07.10.2026: właściciel — aplikacja z TestFlight zainstalowana na iPhonie i uruchamia się.
- 07.10.2026: wygląd — **kierunek B · Tuleja** (talerze zawodnicze, Tektur + IBM Plex Mono, nowa ikona); docs/16, docs/21 pkt 6. Zakres wdrożenia do ustalenia.
- 07.10.2026: zakres nowego wyglądu — **B: wszystko naraz** (ikona, kolory, kroje, talerze „co nałożyć”, widok skupiony na serii); krój tekstu **A: mieszany** (Tektur nagłówki i duże liczby, IBM Plex Mono dane, IBM Plex Sans tekst); domyślny wygląd **A: jasny**. Widok skupiony z przełącznikiem w ustawieniach (docs/21 pkt 3), domyślnie skupiony — założenie agenta do potwierdzenia na TestFlight.
- 07.10.2026: cel właściciela — przed udostępnieniem testerom zewnętrznym przejść na nowy wygląd (Tuleja). Build 1001 (stary wygląd) **zostaje w przeglądzie Apple** (wariant A); grupa „Koledzy” bez testerów i bez linku do czasu nowego buildu.
- 07.10.2026: polecenie właściciela — po zielonym E2E nowego wyglądu przenieść zmiany na `main` (przez `integration/0.9.0`) i uruchomić TestFlight (build 1002 dla grupy „Koledzy”).
- 07.10.2026: języki — **wariant B**: dodać de, fr, it, nl, sv, da, nb, fi, tr, el (10; razem 26). Kolejność: najpierw build 1002 (nowy wygląd) dla „Kolegów”, języki w następnym buildzie.
- 07.10.2026: talerze „co nałożyć” **zostają** (właściciel: „najpierw zobaczę, jak się spisuje”). Następny pakiet (build 1004): karta „teraz” z grafiką dla każdego sprzętu na podstawie wartości serii (stos maszyny/wyciągu — „stos na X”, guma — kolor i poziom, hantle — para, itd.), **2** notatka ćwiczenia na karcie, **3** przerwa w karcie z podglądem następnej serii.
- 07.10.2026: właściciel — testerzy zewnętrzni („Koledzy”) dostaną **build 1004** (nowy wygląd + 10 języków + grafika sprzętu na karcie, notatka, przerwa w karcie); 1002 i 1003 nie idą osobno do TestFlight. Jedno E2E na końcowym commicie, potem `main` i TestFlight.
- 07.10.2026: właściciel — w ustawieniach zostaje wybór „Widok treningu: Skupiony / Lista”, żeby sprawdzić u kolegów, który lepiej podchodzi; **jedyna różnica to karta** — w widoku „Lista” bez dopisku z talerzami (dokładnie jak w poprzednich wersjach, w nowym motywie). Opis pod przełącznikiem zmienia się z wyborem.
- 07.10.2026: E2E (run 37611882320) pokazało, że w widoku skupionym talerze pojawiające się po wpisaniu ciężaru powiększają kartę i spychają wiersz serii pod klawiaturę. Opcje: **A** karta trzyma miejsce na grafikę przyrządu (niewidoczne, gdy wartość pusta — stała wysokość podczas wpisywania; koszt: puste miejsce na karcie, nowy build i pełne E2E), B grafika odświeżana dopiero po schowaniu klawiatury, C wysłać build bez poprawki. Właściciel: **A**.
- 07.10.2026: po aktualizacji 1001 → 1002 z TestFlight ekran startowy pokazywał przez ułamek sekundy stare logo „Kreda” (nagranie właściciela, 16:36). Porównanie: obraz na nagraniu = ekran startowy buildu 1001 (tło `#F2F0EB` + stara ikona); build 1002 generowany od zera (`expo prebuild --clean`) z nową ikoną. Przyczyna: iOS trzyma zapisany ekran startowy po aktualizacji — restart telefonu nie pomógł, ponowna instalacja z TestFlight pomogła. Nowi testerzy (pierwsza instalacja) tego nie zobaczą. Otwarte: czy zmieniać nazwę obrazka ekranu startowego w kolejnych wersjach, gdy zmienia się grafika (żeby aktualizacja nie pokazywała starej) — do decyzji przy następnej zmianie ekranu startowego.
- 07.10.2026 (ok. 16:50): Apple nie przyjmuje drugiego buildu do beta review, gdy inny czeka — właściciel wybrał wariant A: build 1001 wygaszony (Expire), build 1002 dodany do grupy „Koledzy” i wysłany do review (What to Test: prośba o wybór widoku Skupiony / Lista). Odrzucone: B — czekać na zatwierdzenie 1001.
- 07.10.2026 (wieczór), decyzje właściciela:
  - **Kalorie:** odczyt aktywnych kcal z Apple Health w oknie treningu (wariant A; bez własnego szacunku z MET — odrzucone B szacunek z Compendium 2024 i C nic). **Ocena wysiłku treningu** (`workoutEffortScore`, iOS 18+) — zgoda; przeliczenie RPE → ocena **[OTWARTE]** do sprawdzenia w źródłach. Oba w osobnym wydaniu „Health” (aktualizacja `@kingstinct/react-native-healthkit` 8 → 16) **po** pozostałych funkcjach.
  - **Czcionka:** IBM Plex Sans Bold zamiast Tektur (porównanie 5 krojów na karcie „teraz”; odrzucone: Tektur, Plex Mono — za szeroka, Inter i Barlow Condensed — nowe pliki). Zakres: wszystkie nagłówki i duże liczby (jedno miejsce `F` w `lib/theme.ts`).
  - **Usuwanie:** przesunięcie w lewo + potwierdzenie **wszędzie** (także serie w treningu; odrzucone „Cofnij” bez potwierdzenia); dotychczasowe przyciski „Usuń” **znikają**; VoiceOver — akcja „Usuń”.
  - **Kolejność:** czcionka → usuwanie gestem → kalendarz w Historii → „Pomiń ćwiczenie dziś” → przyciski przerwy na ekranie blokady → foldery szablonów → widżet; import Strong/Hevy, gdy będą pliki (właściciel: Strong, kolega: Hevy; do testów tylko zanonimizowany plik — repo publiczne). Wszystko poza „Health” w następnej wersji.
- 07.10.2026 (ok. 18:15): właściciel — „Wdrażaj wszystko, o czym wspominałeś, oprócz Health”: w następnej wersji także przyciski przerwy na ekranie blokady (Live Activity, iOS 17+) i widżet na ekran główny, mimo ryzyk natywnych (rejestracja App Intent w module, App Group dla widżetu — może wymagać jednorazowego kroku w Apple Developer). Odrzucone: A (natywne w osobnym kroku), C (natywne w osobnym wydaniu).
- 07.10.2026 (ok. 19:45): właściciel — „Skoro nie możesz przetestować, to wszystkie takie elementy wypychamy do oddzielnego buildu jak z Health,
  wrzucamy w backlog i dodamy później. Elementy testowane po twojej stronie idą w najbliższą wersję”. Zasada: w najbliższej wersji tylko to, co
  sprawdzają testy automatyczne agenta (jest, macierz, E2E Maestro na symulatorze). **Odłożone** (docs/21, „Wydanie natywne”): przyciski przerwy
  na ekranie blokady (commit 2e08c84) i widżet na ekran główny (df53ab9) — cofnięte na `feature/e2-swap` commitem odwracającym; kod zostaje
  w historii gałęzi, powrót = `git revert` tego commitu. Uchyla decyzję z 18:15 w tej części.
- 07.10.2026 (ok. 20:10): kolor akcentu w istniejącym liczniku przerwy na ekranie blokady (Tuleja zamiast pomarańczu „Kredy”, commity 9f15a05
  i 446d5bc) — **zostaje w najbliższej wersji** (wariant A: sama wartość koloru w istniejącym elemencie, sprawdzana testem konfiguracji;
  odrzucone B: cofnięcie do wydania natywnego). Pliki Strong/Hevy do importu — właściciel postara się dostarczyć 08.10.
- 07.10.2026 (ok. 21:00): import ze Strong/Hevy — **odłożony** („Po prostu zignorujmy ten import na razie”). Plik Stronga właściciela przejrzany
  (format zapisany w docs/21, 4b), kopia robocza usunięta, nic z niego w repo. Otwarte do czasu powrotu: jednostka (CSV bez kg/lb) i sposób
  dopasowania ćwiczeń (opcje A/B/C w rozmowie 07.10).
- 08.10.2026: wydanie pakietu (czcionka, usuwanie gestem, kalendarz, „Pomiń dziś”, foldery; E2E 12/12, run 37669619362) — **wstrzymane** (wariant B:
  dołożyć kolejne funkcje do tej wersji; odrzucone A: wydanie od razu). Gałąź `feature/e2-swap` bez scalenia do `main`.
- 08.10.2026: do tej wersji — **A pauza treningu, B podsumowanie tygodnia/miesiąca, C mapa mięśni** (wszystkie trzy). Otwarte: czy pauza odejmuje czas trwania.
- 08.10.2026: pauza treningu **odejmuje się od czasu trwania** (historia, podsumowanie, eksport) — decyzja właściciela; odrzucone: czas „od startu do końca”.
- 08.10.2026: pauza w **Apple Health już w tej wersji** — wariant A: start w Zdrowiu przesunięty o sumę pauz (czas trwania jak w aplikacji, koniec prawdziwy). Powód: biblioteka 8.7.2 zapisuje HKWorkout bez zdarzeń pauzy (`workoutEvents: nil` w ReactNativeHealthkit.swift), a Apple liczy czas aktywny tylko ze zdarzeń pauzy/wznowienia (dokumentacja HKWorkout init…workoutEvents). Odrzucone B: łatka natywna na bibliotekę (niesprawdzalna po stronie agenta). Pauzy zapisywane jako przedziały [od, do] (`Workout.pauses`), żeby wydanie Health mogło zapisać prawdziwe zdarzenia.
- 08.10.2026: **wydanie wstrzymane**; do tej wersji dochodzi pakiet C (pole RIR, znacznik serii tygodniowo na partię ze źródłem, ręczny tydzień deload) — bez pracy właściciela. Wydanie natywne, wydanie Health i import Strong/Hevy → **backlog bez priorytetu** (docs/21). Zasada rozmowy: na „co dalej” backlog bez priorytetu tylko zbiorczo, bez nazw (CLAUDE.md).
- 08.10.2026: do backlogu bez priorytetu — nagrywanie siebie i ocena AI poprawności ruchu; układanie treningów według preferencji i celu (docs/21, z otwartymi pytaniami).
- 08.10.2026: właściciel — „szablony tworzę ja, ale możemy dodać opcję, która pozwala wygenerować szablon i plan tygodniowy przy pewnych założeniach”
  (np. hipertrofia, dom, 3× w tygodniu; hipertrofia + spalanie, 4 sesje: 3 siłowe + 1 cardio). „Wszystkie potwierdzone badaniami.” Deload: „fajnie,
  jakby automatycznie przeliczał szablony i sugerował w kalendarzu, kiedy włączyć”. Zlecony przegląd źródeł: serie na partię dla siły, masy i redukcji;
  deload; zasady generatora (docs/research/22). Reguła z 03.10 uzupełniona o wyjątek (CLAUDE.md).
- 08.10.2026: **priorytet** — kalendarz z planowaniem treningów (docs/21, „Priorytet”). Warianty do decyzji przedstawione właścicielowi.
- 08.10.2026: kalendarz — **1A**: zakładka Historia → Kalendarz (miesiąc: odbyte + zaplanowane + deload, niżej lista sesji), na ekranie treningu „Dziś: …”
  i podgląd tygodnia. **2A**: stały plan tygodnia + zmiany pojedynczych dni, z zastrzeżeniem właściciela: przesunięcie treningu ma dwa tryby —
  (a) przesunięcie planu o 1 dzień: następne treningi przesuwają się tylko tak daleko, jak wymagają konflikty (przykład: dziś FBW A, jutro FBW B,
  potem przerwa → A na jutro, B na pojutrze, nic więcej), (b) przesunięcie tylko tego treningu — nigdy na dzień z innym treningiem bez wyraźnego
  polecenia. Do tego regeneracja grup mięśniowych: sugestie zmian w tym tygodniu z jak najmniejszą liczbą zmian, by po 7–10 dniach wrócić do
  pierwotnej rutyny (reguła regeneracji — przegląd źródeł w toku, docs/research/23). Przypomnienia (pyt. 3) — bez odpowiedzi.
- 08.10.2026: propozycje z regeneracją partii wdrożone (K3, `5d63427`) — reguły z docs/research/23 jako nazwane uproszczenie (dzień przerwy między
  sesjami z tymi samymi głównymi partiami; dzień po dniu — ostrzeżenie, nie blokada; najpierw zachować liczbę sesji; powrót do rutyny w 10 dni).
- 08.10.2026: **„Co nowego”** — przycisk „i” w lewym górnym rogu ekranu Trening rozwija sekcję (wzór: Organizer). Decyzje właściciela: tylko ekran
  Trening (odrzucone: każda zakładka); „i” + kropka po aktualizacji, nic nie wyskakuje samo (odrzucone: karta jak w Organizerze, „i” bez oznaczeń);
  bieżąca wersja na górze, starsze zwinięte (odrzucone: tylko bieżąca). Wpisy w `lib/whatsnew.ts`; numer buildu dopisuje się przy wydaniu.
- 08.10.2026 (ok. 10:00 UTC): decyzje właściciela — **deload A+B**: podpowiedź w kalendarzu „zwykle co 4–6 tyg.” jako praktyka trenerów (S5, jeden
  zespół — oznaczone), oraz po oznaczeniu tygodnia deload propozycja szablonów z ~40–50% mniej serii, ciężar bez zmian, do zatwierdzenia (odrzucone:
  tylko B, tylko A, nic; automatyczne wyzwalacze z danych odpadają — brak walidacji, docs/research/22). **Generator A (pełny)**: szablony z ćwiczeniami
  z katalogu dostępnymi w miejscu, serie, zakres powtórzeń, RIR, przerwy + plan tygodnia, do przejrzenia przed zapisem (odrzucone: B szkielet).
  **Kolejność:** deload, potem generator. **Przypomnienia:** rano w dniu treningu, jedno lokalne powiadomienie (odrzucone: wybrana godzina, brak).
- 08.10.2026: deload B — **przy starcie treningu** (pytanie: mniej serii / pełny), szablony bez zmian (odrzucone: kopie szablonów na tydzień); **około
  połowy serii roboczych** (ceil(n/2), cięcie 33–50%) (odrzucone: wybór przy każdym starcie). Wdrożone `f32f3c1`. Przypomnienie: `1f0c264`, godzina 8:00
  — wybór agenta dla „rano”, **[OTWARTE] do potwierdzenia**.
- 08.10.2026: generator — wejście z ekranu Szablony i z Planu tygodnia (odrzucone: tylko jedno z nich); założenia: cel, miejsce, sesje/tydz. **i czas
  sesji** (przeliczenie minut na serie = nazwane uproszczenie, bez źródła); istniejący plan: właściciel — „zastąpić, ale z łatwym przywróceniem
  poprzedniego: aktywny plan i wybór, który ma obowiązywać” → **kilka zapisanych planów tygodnia, jeden aktywny** (powrót do starej rutyny po
  okresie przejściowym). Cardio w generatorze: „umiarkowane” z licznikiem minut — bez „na czczo” i „strefy 2” (źródła ich nie potwierdzają,
  docs/research/22 sekcja 4; właściciel poinformowany). Projekt: docs/24.
- 08.10.2026: **przewodnik po funkcjach — wariant A** (tematy z krokami i „Pokaż”; odrzucone: podpowiedzi na ekranach, karuzela na start); pokazywany
  nowym („Pierwsze kroki”) i po aktualizacji („Co nowego”), zawsze w Więcej (odrzucone: tylko w Więcej). Kolejność dalej: RIR → wydanie → rejestr decyzji.
- 08.10.2026: przypomnienie o treningu z planu **o 8:00** (odrzucone: 7:00, 9:00); **wersja 0.10.0** dla tego wydania (odrzucone: 0.9.0 z nowym buildem).
  RIR = 10 − RPE: drugie niezależne źródło znalezione (Bastos i in. 2024) — skala zostaje.
- 08.10.2026: rejestr decyzji na Google Drive („03 Rejestr decyzji (ADR) — Trening App”) uzupełniony o ADR-037–042 (kalendarz i plany, regeneracja,
  serie i RIR, deload, generator, zakres wydania 0.10.0) ze źródłami i odrzuconymi alternatywami.
- 08.10.2026: do backlogu bez priorytetu — znajomi i wyzwania w grupie („tablica wyników”), pomysł: grupa jak w Organizerze; wszystko do decyzji
  później (właściciel: „na razie zapisujemy pomysł, żeby go odkopać, gdy będzie czas”); otwarte pytania w docs/21.
- 08.10.2026: ekran startowy — **dashboard tygodnia (wariant A)**: karta „Dziś” z paskiem tygodnia, 3 kafelki z poprzednim tygodniem, ostatni trening,
  szablony (odrzucone: B minimalny, C pełny z mapą i rekordami); nowa osoba — **lista „Pierwsze kroki”** (odrzucone: jedna karta powitalna).
- 08.10.2026: czcionka na karcie aktywnego ćwiczenia „nadal nie ta” — przyczyna: na telefonie jest TestFlight build 1004 z `main` (f435c8c,
  Tektur); IBM Plex Sans Bold jest tylko na `feature/e2-swap` i trafi na telefon z 0.10.0. Timery na karcie celowo w IBM Plex Mono.
- 08.10.2026: kolejność — **A: najpierw wydanie 0.10.0 (po zielonym E2E), potem wstrzymanie nowych funkcji i głęboki audyt** (logika i liczby
  w `lib/`, sens funkcji i źródła, spójność ekranów i komunikatów, dane i migracje, tłumaczenia; każdy błąd z testem regresji).
  Odrzucone: B audyt przed wydaniem (dłużej na starej wersji), C krótki audyt nowości przed wydaniem.
- 08.10.2026: **audyt 0.10.0** (polecenie właściciela: „super głęboki audyt wszystkich możliwych warstw”, w tym spójność logik) wykonany na
  d2a1e85 przez 10 niezależnych audytorów; raport `docs/25-audyt-0.10.md` (ok. 95 problemów w grupach A–N, opcje i rekomendacje),
  raporty źródłowe `docs/audyt-0.10/`. Czcionka na karcie „teraz” w 0.10.0 zgodna z decyzją (dwa niezależne pomiary). Do decyzji
  właściciela: wydanie 0.10.0 przed czy po partii napraw; decyzje w grupach (lista w docs/25). E2E 0.10.0 (run 37793333239) czeka na
  maszynę macOS — GitHub od 14:32 UTC anuluje przebieg bez przydzielenia maszyny („capacity constraints”, macOS arm64); ponawiane od razu
  po każdym anulowaniu (polecenie właściciela).
- 08.10.2026 (po audycie, decyzje właściciela): **naprawiamy wszystko, co audyt znalazł**, potem audyt kontrolny („później terminujesz
  audyt”); wydanie 0.10.0 dopiero po naprawach (odrzucone: wydanie d2a1e85 od razu, partia 1 przed wydaniem). Pozostałe decyzje z docs/25 —
  **rekomendacje hurtem**; osobno pytam tylko o rzeczy nieodwracalne lub zewnętrzne.
  - **Plan wstecz (A1): wariant B — historia planów** (dzień liczony wg planu, który wtedy obowiązywał). To zmiana schematu danych —
    dozwolona w tym wydaniu, bo nie ma w nim aktualizacji SDK (expo ~57.0.26 jak na `main`). Odrzucone: A (data „od”), C (bez „opuszczony”).
  - **e1RM w ćwiczeniach z masą ciała (E1): wariant B — opcjonalna masa ciała w Ustawieniach**; e1RM z (masa ± dociążenie/pomoc), pokazane
    np. „126,7 kg (masa ciała + 46,7)”; bez masy ciała — bez e1RM (jak A). Właściciel pytał o „masę ciała jako niewiadomą”: nie da się,
    bo wzór Epleya mnoży cały ciężar przez (1 + r/30) — wynik nie jest „masą ciała + X” (wyjaśnione w rozmowie). Zmienia decyzję Q-001
    („e1RM z samego dociążenia”). Ułamek masy ciała dla danego ćwiczenia (np. pompki) tylko ze źródłami — bez źródła brak e1RM.
  - **Workflowy EAS (M4): usunąć `iphone-eas.yml` i `iphone-local.yml`**; instalacja przez `testflight.yml`; sekrety EXPO_TOKEN
    i ASC_API_KEY_P8 kasuje właściciel w ustawieniach repo. Odrzucone: utwardzenie i pozostawienie.
  - E2E d2a1e85 (run 37793333239) dostało maszynę przy 11. próbie (ok. 17:50 UTC) — wynik jako punkt odniesienia; wydanie po naprawach i nowym E2E.
- 08.10.2026 (ok. 20:20): **zasada właściciela na czas jego nieobecności** — agent decyduje sam: zawsze opcja rekomendowana, z wyjątkiem: gdy
  opcja nierekomendowana jest ogólnie lepsza, a odradzana była tylko z powodu nakładu pracy — wtedy ta lepsza („nie boimy się ilości pracy,
  jeżeli niesie to coś dobrego”). Wszystko ma być spójne, intuicyjne i przejść najgorliwszy audyt. Przegląd decyzji z ostatnich 4 godzin
  pod tym kątem (zmiany względem „rekomendacji hurtem” z docs/25):
  - **B1:** zmiany pojedynczych dni zapisywane razem z planem i przywracane przy jego ponownej aktywacji (obietnica „wrócisz jednym
    przyciskiem” prawdziwa); wcześniej: tylko tekst ostrzeżenia.
  - **B2 → wariant A:** „Nowy plan” jako osobny wpis edytowany przed aktywacją, oryginał zachowuje nazwę, plan bez nazwy z datą; wcześniej: B (minimum).
  - **A5 → dopasowanie po szablonie:** dzień „zrobiony” tylko, gdy zrobiono zaplanowany trening; inny trening = „Zrobiony inny trening: …”,
    zaplanowany czeka na przesunięcie; jedna funkcja stanu dnia wszędzie; wcześniej: B (sama nazwa faktycznej sesji).
  - **A10 (UX-13) → wariant A:** panel dnia z maks. 3 głównymi akcjami + „Więcej opcji” i przewinięcie; wcześniej: B (samo przewinięcie).
  - **E4 → wariant A:** źródła dla przypisania partii mięśniowych ćwiczeń bazowych (osobne zadanie badawcze); do tego czasu dopisek
    „uproszczenie” (B) jako stan przejściowy.
  - **H5 → A+B:** „Zapisz jako szablon” w szczegółach sesji oraz pytanie po treningu z szablonu „Zaktualizować szablon?” tylko na polecenie
    użytkownika i tylko gdy skład się różni (zgodne z zasadą 03.10: aplikacja nie zmienia szablonów sama).
  - **J3 / DAT-07 → wariant B:** dzień i tydzień treningu liczone ze strefy czasowej zapisanej przy starcie treningu (podróże); wcześniej: A (tylko opis).
  - **M1:** nocne porażki zgłaszane automatycznie (zgłoszenie w repozytorium); wcześniej tylko lista gałęzi.
  - **UX-16 → pełny A**, **LOG-09 → A** (biblioteka przejrzana przez właściciela przed punktami w zamianie).
  - Bez zmian, bo rekomendacja jest lepsza merytorycznie, a nie tylko tańsza: C1 (A), F3 (B — mniej szumu), LIVE-10 (B), PERF-03 (A —
    wariant B z treningami jako osobnymi wierszami SQLite groziłby utratą danych przy cofnięciu do starszego buildu z TestFlight), NAT-03 (A).
  - Nie zmieniam decyzji spoza okna 4 godzin i działań nieodwracalnych: N1 (dane w historii repo) zostaje jak 06.10 (A — bez przepisywania historii).
- 08.10.2026 (ok. 21:20): właściciel — „mamy trochę za szeroką bibliotekę ćwiczeń, a przynajmniej nie jestem przekonany, czy są poprawnie
  pomapowane — zrób głęboki research i potwierdź każde z nich”. Uruchomione 6 badań (części L1–L6, razem 854 ćwiczenia): prawdziwość i nazwa,
  sprzęt, wzorzec, metryka i sposób liczenia ciężaru, partie główne/pomocnicze ze źródłami, rekomendacja zakresu (zostaje / niszowe / scalić /
  usunąć). Wyniki: docs/research/25-biblioteka/. Decyzja o zakresie wg zasady z 20:20 (opcja lepsza mimo nakładu pracy); treningi i szablony
  z ćwiczeniami spoza nowego zakresu nie tracą danych (archiwum).
- 08.10.2026 (ok. 21:30): właściciel — „łatwo edytować któreś ćwiczenie, bo wchodząc w nie od razu mamy możliwość edycji; edycja powinna być
  wywołana na żądanie, nie przez samo wejście — łatwo o missclick”. Decyzja (zasada z 20:20): **ekran ćwiczenia najpierw do podglądu**
  (nazwa, partie, sprzęt, sposób logowania, przerwy, notatka, historia i postępy), **„Edytuj” otwiera edycję na szkicu z „Anuluj” / „Zapisz”**
  — ten sam wzór co edycja sesji w historii (spójność); nowe ćwiczenie („+ Nowe”) od razu w edycji. Ten sam wzór także dla **szablonu**
  (podgląd „jak trening” ze „Start”, zmiany dopiero po „Edytuj”) — to samo ryzyko przypadkowej zmiany, a szablon otwiera się najczęściej.
  Ekrany konfiguracji (miejsca, gumy, ustawienia, plan tygodnia) zostają edytowalne od razu — wchodzi się do nich, żeby coś zmienić.
  Odrzucone: przytrzymanie, by edytować (niewidoczne), osobny ekran bez szkicu (zmiany zapisywane od razu — to samo ryzyko).
- 08.10.2026 (ok. 21:35): właściciel — „po wykonaniu wszystkiego, co zaplanowałeś po wznowieniu, możesz wdrożyć nową wersję ze wszystkimi
  poprawkami na produkcję”. **Zgoda z góry na scalenie do `main` i build TestFlight** po: falach napraw 1–2, researchu biblioteki i grafik
  (wdrożonych), pełnym verify, zielonym E2E i audycie kontrolnym z naprawionymi znaleziskami. Dodanie buildu do grupy testerów zewnętrznych
  i wysłanie do beta review robi właściciel w App Store Connect.
- 08.10.2026 (ok. 21:45): właściciel — po wydaniu 1 **kolejny pełny audyt, poprawki i kolejne wydanie** (ta sama droga: verify, E2E,
  scalenie do `main`, TestFlight); gdy audyt nic nie znajdzie — stop po audycie i raport.
- 08.10.2026 (ok. 21:50): właściciel — „nic nie ograniczaj, ale wznawiaj pracę zawsze po resecie limitu Claude, bez płatnego dodatku”.
  Wdrożone: strażnik co godzinę (Routine „Wznawianie pracy po limicie”) sprawdza, czy sekwencja trwa, i wznawia ją po przerwie; płatnych
  dodatków nie włączam (to ustawienie konta właściciela). Strażnik wyłączany po zakończeniu sekwencji.
- 08.10.2026 (ok. 23:50): **grafiki i wskazówki techniki** (pytanie właściciela o grafiki/animacje na karcie ćwiczenia; research
  docs/research/26). Decyzja wg zasady z 20:20: **wariant A etapami** — (1) własne wskazówki tekstowe dla 125 ćwiczeń bazowych z ≥2
  przeczytanymi źródłami (też jako opis dla VoiceOver), (2–3) własne figury SVG (szkielet z kątami stawów, 2–3 klatki i krótka pętla, przy
  „Ogranicz ruch” klatki statyczne, kolory motywu, wszystko w paczce, offline). Odrzucone: zdjęcia free-exercise-db (najpewniej z
  Bodybuilding.com — brak praw, wizerunek modeli, błędy merytoryczne), wger (niewiarygodne licencje pojedynczych obrazów), Everkinetic
  (CC BY-SA: tylko ~50 ze 125, obcy styl, nierozstrzygnięty DRM w App Store), płatne/API (0 zł, brak sieci), sam tekst (mniej pomocny).
  Nazwy ćwiczeń z katalogu zostają (fakty, nie utwór); opis free-exercise-db jako „domeny publicznej” w catalog-notes do poprawy.
- 09.10.2026 (ok. 00:10): **zakres biblioteki ćwiczeń** — research L1–L6 zakończony (854 ćwiczenia; docs/research/25-biblioteka/L1…L6.json
  i *-zrodla.md; raporty: L1 100, L2 138, L3 mobilność, L4 168, L5 165, L6). Decyzja wg zasady z 20:20 — **wariant B** (rekomendacja wszystkich
  części): ZOSTAJE — widoczne domyślnie na liście i w wyborze ćwiczenia; NISZOWE — w katalogu, poza listą domyślną (wyszukiwanie i „Pokaż
  wszystkie”); SCALIĆ — wpis znika, treningi, szablony, rekordy i plan przechodzą na ćwiczenie docelowe (migracja, jak LIB_MUSCLE_FIXES,
  idempotentna); USUNĄĆ — znika z biblioteki, a ćwiczenie użyte w treningu lub szablonie zostaje u użytkownika jako jego własne (nic nie ginie);
  POPRAWIĆ — partie, wagi, sprzęt, wzorzec, metryka i nazwy wg rekordów (zmiana nazwy przez klucz katalogu `libKey`, wyniki wstecz bez zmian — E2).
  Odrzucone: A — samo usunięcie niszowych (traci się ćwiczenia, które ktoś realnie robi; ukrycie daje ten sam porządek bez straty); C — tylko
  etykiety bez zmian zakresu (lista zostaje za szeroka — problem zgłoszony przez właściciela).
  Rozstrzygnięcia pytań otwartych: merytoryczne — wg hierarchii źródeł (rekomendacje researchu tam, gdzie oparte na przeczytanych źródłach;
  przy sprzecznych badaniach tego samego szczebla zostaje stan dzisiejszy z oznaczeniem, np. dwugłowe w przysiadzie bułgarskim, Q-L4-3);
  produktowe — rekomendacje: warianty z gumami/łańcuchami i Rack Pull osobno jako niszowe (inny sens zapisanego ciężaru — Q-L4-1),
  Stiff-Legged Deadlift osobno jako niszowe (Q-L4-2), strongman w katalogu jako niszowe (Q-L4-7), pompki `bandAssistable` false wszędzie (L5 Q2),
  ćwiczenia za karkiem niszowe (L5 Q4), przedramiona w grupie „biceps” do czasu porządkowania sekcji (L1 Q1, L2 Q4), scalanie wariantów
  różniących się tylko chwytem/pozycją (L1 Q3, L2 Q6, L5 Q1) — nigdy jednorącz z oburącz. **Lepsze mimo pracy:** brakujący sprzęt w słowniku
  (circus bell, maszyna do dipów — poręcze `dip.bars` już były — i ściana; L5 Q7) i metryka ciężar + dystans dla spacerów farmera (schemat 18 jest w tym wydaniu, bez
  aktualizacji SDK). Otwarte (bez zmian w tym wydaniu): tryb liczenia ciężaru ćwiczeń jednonóż (Q-L4-4 — zmiana zmienia sens dawnych wpisów;
  osobna decyzja z migracją), regiony dla mięśni spoza mapy (zębaty przedni, piszczelowy przedni — L2 Q2/Q5: do czasu dodania regionu bez
  partii głównej, z oznaczeniem). Rejestr decyzji na Dysku — wpis zbiorczy po wdrożeniu.
- 09.10.2026 (ok. 01:30): **K1 — „Przerwa” i „Pauza” w 25 językach** (audyt 0.10, A11-01) — wariant B zamiast rekomendowanego A (zasada
  z 20:20: B ogólnie lepszy). Tam, gdzie „pauza” to zwykłe słowo siłowni na odpoczynek między seriami, zostaje ono dla przerwy, a zatrzymanie
  zegara treningu dostaje czasownik jak w iOS: cs/sk „Pozastavit/Pozastaviť”, ro „Întrerupe”, et „Peata”, de „Anhalten”; da/nb przerwa
  „hvile”, fi „palautus”, sl „počitek”, tr pauza „duraklatma”. Odrzucone: A — wszędzie nowe słowo dla przerwy (obce na siłowni). Test:
  w każdym języku teksty o przerwie mają termin przerwy i nie mają terminu pauzy (i odwrotnie). Otwarte: potwierdzenie przez rodzimego
  użytkownika terminów cs, sk, ro, et, de i „hvile” (da, nb). Przy scaleniu: filtr „Podstawowe” z katalogu dostał podział etykieta/podpowiedź
  VoiceOver jak pozostałe filtry (A11-18).
- 09.10.2026 (ok. 02:30): **wskazówki techniki, etap 1** scalone (82 ćwiczenia bazowe, każde zdanie ≥ 2 przeczytane źródła z różnych
  organizacji — ACE, ExRx, NASM, Stronger by Science, Concept2, badania; docs/research/27, generowany z `lib/cues/data.json`, `check:cues`
  w verify). 42 ćwiczenia bazowe bez wskazówek (jedno źródło, sprzeczne lub za mało wspólnych wskazówek) — lista otwarta z powodami w
  docs/research/27. Źródła NSCA/ACSM są płatne: **nie kupujemy** (zasada właściciela: 0 zł poza Apple) — etap 1 stoi na szczeblu 4 z co
  najmniej dwiema niezależnymi organizacjami, co jest oznaczone w dokumencie; brakujące uzupełniamy darmowymi źródłami szczebla 2–3, gdy
  się znajdą. Odrzucone: zakup podręczników (koszt), jedno źródło (reguła właściciela z 08.10). Sekcja „Technika” na ekranie ćwiczenia
  domyślnie zwinięta, z odesłaniem do lekarza lub fizjoterapeuty przy bólu.
- 09.10.2026 (ok. 03:30): **figury ruchu, etap 2–3** scalone — własne figury SVG dla 71 ćwiczeń (szkielet z kątów stawów, 1–3 pozycje, pętla
  z pauzą, „Ogranicz ruch” → statyczne pozycje, kolory z motywu, bez sieci; `lib/figures`, docs/research/28 generowany, `check:figures` w verify).
  Każda poza sprawdzana testem geometrii względem zdania wskazówki etapu 1; kąty bez źródła oznaczone jako uproszczenie ilustracyjne, podpis
  „Rysunek schematyczny — pozycje orientacyjne.”. Granice zakresu stawów w testach: CDC Normal Joint ROM (Soucie i in. 2011), Dill i in. 2014,
  Anderton i in. 2012 (granice testowe, nie treść w aplikacji). Odrzucone: ręczny SVG na ćwiczenie (nie da się automatycznie sprawdzić),
  zdjęcia/wideo (licencje, rozmiar). Otwarte: 11 ćwiczeń bez figury (ruch w płaszczyźnie poziomej, skręt, zgięcie kręgosłupa, skok i in. —
  wymaga rozszerzenia modelu), scenariusz Maestro dla sekcji „Technika”.
- 09.10.2026 (ok. 06:10): właściciel — **źródła płatne (NSCA/ACSM): wariant A** — zostajemy przy darmowych źródłach (≥ 2 niezależne
  organizacje), bez zakupu podręczników (ceny 09.10: NSCA Exercise Technique Manual e-book 67 USD, Essentials 89 USD, ACSM Resources for the
  Personal Trainer ok. 90 USD; e-booki w VitalSource — agent nie ma do nich dostępu). Odrzucone: B zakup, C wypożyczenie biblioteczne (czas
  właściciela). Właściciel — **prawa autorskie jako element obowiązkowy przed upublicznieniem aplikacji**: skrócenie długich cytatów w
  `docs/research`, sprawdzenie podobieństwa treści aplikacji do źródeł, tylko własne grafiki, licencje zależności — punkt 8 w docs/15.
- 09.10.2026 (ok. 06:30): właściciel — **polskie atlasy ćwiczeń (fabrykasily.pl/atlas-cwiczen, atlas.kulturystyka.pl, centrumrespo.pl/atlas): wariant B —
  pomijamy.** Ocena: szczebel 5 (praktyka trenerów, bez bibliografii, „wszelkie prawa zastrzeżone”; kulturystyka.pl — zdjęcia z exrx.net,
  tabele regeneracji bez źródeł). Odrzucone: A (źródło pomocnicze szczebla 5 do nazw i kontroli kompletności), C (licencja na zdjęcia/filmy —
  koszt, zależność). Nie używamy ich treści, zdjęć ani filmów.
- 09.10.2026 (ok. 06:45): właściciel — **treści i nazwy innych firm:** (1) B — research konkurencji na Dysk, w repo tylko wnioski (zasada
  w CLAUDE.md „Treści cudze i nazwy innych firm”); prośba o czystą historię gita (D) — agent przedstawił koszty, termin do potwierdzenia;
  (2) B — nazwy innych aplikacji w komentarzach kodu zastąpione neutralnymi opisami; (3) A — ViShape SmartGym w presetach → nazwa
  ogólna; (4) zakaz nazw innych aplikacji w metadanych App Store. Szczegóły i kolejność: docs/15 punkt 8.
- 09.10.2026 (ok. 07:00): właściciel — **czysta historia gita: TAK, termin A** — po wydaniu 1 na TestFlight, przed upublicznieniem w App
  Store (zmiana decyzji z 06.10 dla N1). Zakres: research konkurencji (`docs/research/kb/`, długie cytaty w plikach źródeł) i dane osobowe
  z N1 (docs/25). Kolejność: (1) research na Dysk („Trening App / 05 Research konkurencji”), w repo wnioski z linkami; (2) pełna kopia
  zapasowa repozytorium (bundle) poza GitHubem; (3) git-filter-repo na wszystkich gałęziach i tagach; (4) przepisanie odwołań do commitów
  w docs wg mapy stary → nowy; (5) sprawdzenie: żaden commit nie zawiera usuniętych plików ani danych osobowych, verify zielone; (6) push
  `--force` gałęzi i tagów, gdy żaden agent nie pracuje; (7) prośba do wsparcia GitHuba o usunięcie starych commitów z pamięci podręcznej.
  Ograniczenie (świadome): kopie i forki zrobione wcześniej przez innych zostają poza naszą kontrolą.
- 09.10.2026 (ok. 09:00): właściciel — **zasady audytów i wydań: wariant A z poprawką** (bez limitu czasu, „na spokojnie”) — zapis w
  CLAUDE.md „Audyty i wydania”. Odrzucone: B (sam limit czasu — ryzyko puszczenia poważnego błędu), C (bez dużych audytów). Skutek dla
  bieżącej sekwencji: audyt kontrolny 1 pełny (pierwsze wydanie po dużych zmianach), wydanie 1 wstrzymują tylko krytyczne i wysokie;
  audyt 2 po wydaniu — wydanie 2 tylko przy blokerach, średnie i niskie do backlogu z wersją, potem koniec sekwencji.
- 09.10.2026 (ok. 09:30): właściciel — **szacowanie czasu**: estymacje zakładają pracę agenta, nie człowieka (zapis w CLAUDE.md); zaktualizowany tekst instrukcji konta przekazany właścicielowi do wklejenia.
- 09.10.2026 (ok. 12:30): właściciel — **zamrożenie funkcji do wydania w App Store**: „warto się zatrzymać z funkcjonalnościami i poprzez
  kolejne audyty dojść do wersji, która będzie mogła być wydana w App Store do subskrypcji”. Od wydania 1 (0.10.0) żadnych nowych funkcji
  poza subskrypcją (docs/15: ceny, okres próbny, limit 4 treningów, kody ofertowe) i wymogami App Store; pomysły → backlog bez priorytetu.
  Droga do App Store — **decyzja właściciela 09.10.2026 (ok. 12:40)**: po wydaniu 1 jedna paczka — cały backlog znalezisk z audytów
  (ŚREDNIE i NISKIE z docs/25, obie wersje: 0.10.1 i „przed App Store”) + funkcje wymagane do subskrypcji (docs/15) + wymogi App Store;
  dopiero potem pełny głęboki audyt, naprawy blokerów, TestFlight, App Store. Odrzucone: A (backlog tylko liczby/dane), B (osobne 0.10.1 z
  audytem zmian). Doprecyzowanie właściciela (ok. 12:45): „cały backlog istniejących funkcji. Nie dokładamy nowych. Jedyny wyjątek to
  funkcje wymagane do wdrożenia do App Store przed umożliwieniem subskrypcji”. Pozycje z backlogu bez priorytetu (docs/21) — podział
  na poprawki istniejących funkcji (w paczce) i nowe funkcje (poza) do akceptacji właściciela przed startem paczki.
- 09.10.2026 (ok. 13:55): **WYDANIE 1 — 0.10.0, build 1004** (testflight.yml run 37923937786 na `main` ee637da; kod aplikacji = 476f0a7 po
  E2E 37917317288 17/17). Poprzednia próba (run 37921922549, numer 1003) padła na brak pamięci Node w testach na macOS — poprawka
  `NODE_OPTIONS=--max-old-space-size=3072` w testflight.yml; 1003 nie trafił do App Store Connect. Uwaga: wpis z 07.10 o „buildzie 1004”
  dla „Kolegów” dotyczył planu, którego build nie powstał — numer 1004 to teraz 0.10.0. Kroki właściciela: grupa zewnętrzna „Koledzy”,
  przegląd beta, GitHub Pages (`main` / `/docs`). Audyt 2 zastąpiony pełnym audytem przed App Store (decyzja 09.10 ~12:40).
- 09.10.2026 (ok. 14:25): właściciel testuje build 1004 — **błąd B1:** po „Ukryj” (zachęta do planu tygodnia na karcie „Dziś”) nie ma
  „Pokaż/Odkryj” — przycisk „Plan tygodnia” znika z ekranu głównego na stałe (`components/TodayPlan.tsx`, `planHintHidden`; jedyna droga
  do planu: zakładka Kalendarz); pasek tygodnia pokazuje tylko skróty dni, bez dat (właściciel: „zniknęły daty”). Do paczki przed App Store.
- 09.10.2026 (ok. 14:25): właściciel — **wygląd: zestaw pełny (B)** motywu z ikony (gryf + talerze IWF) w aplikacji: 1) postęp tygodnia jako
  ładowana sztanga — **liczba talerzy = liczba dni treningowych w planie** (bez planu: wg treningów w tygodniu); 2) puste stany z grafiką gryfu;
  3) czterokolorowy pasek-akcent; 4) ikony zakładek w geometrii talerzy; 5) animacja „dokładania talerza” przy rekordzie (z ograniczeniem
  ruchu — obraz statyczny); 6) kalendarz: dni z treningiem jako talerze. Warunki: kolor nigdy jedyną informacją (daltonizm), czerwień
  talerza odróżniona od czerwieni „Usuń”. Dopracowanie istniejących ekranów — w paczce przed App Store (zamrożenie: nie nowa funkcja).
- 09.10.2026 (ok. 14:45): zgłoszenie „nie da się zrobić planu z własnych szablonów” — właściciel sam usunął jedyny szablon; testy
  (plan-own-templates, 5/5 na f8f59e7) potwierdzają, że nowe, folderowe i generowane szablony są w edytorze planu i na liście startu.
  Znalezisko UX (ŚREDNIE): przy braku szablonów edytor planu i panel dnia w Kalendarzu nie mają „+ Nowy szablon”. Wybór wg zasady z 20:20:
  **B** — „+ Nowy szablon” w edytorze planu i panelu dnia, po „Zapisz” szablon trafia od razu na ten dzień (odrzucone A: bez przypisania,
  C: sam komunikat). Do paczki przed App Store.
- 09.10.2026 (ok. 14:55): właściciel — **„Plan z moich szablonów” (B)**, wyjątek od zamrożenia („na granicy nowej funkcji, łata lukę”):
  wybór własnych szablonów i liczby dni → rozkład na tydzień wg reguł generatora (te same, ze źródłami) → podgląd → zatwierdzenie. Odrzucone:
  A (tylko widoczna droga do ręcznego edytora), C (A teraz, B po App Store). W tej samej paczce: „Pierwsze kroki” przy pustym szablonie —
  komunikat „dodaj ćwiczenia do szablonu …” zamiast „Najpierw utwórz szablon”; „+ Nowy szablon” w edytorze planu i panelu dnia (B, wyżej).
- 09.10.2026 (ok. 15:20): właściciel — **ekran główny: układ B „najpierw trening”** (makiety: https://claude.ai/artifact/7CetSMVFxjPDbQU4KLDsp8):
  duży przycisk startu zależny od sytuacji (z planem „Start: <dzisiejszy>”, bez planu następny szablon albo „Pusty trening”); „Inny trening”
  jako arkusz (inny z planu, powtórz ostatni, z szablonu, pusty); kafelki tygodnia; karta Planowania (nowy szablon, plan z moich szablonów,
  generator) — zwinięta do wiersza przy planie, rozwinięta i wyżej bez planu; Ustawienia tylko w „Więcej”. **Karta „Ten tydzień” (sztanga
  postępu + pasek dni z datami i talerzami) tylko przy aktywnym planie** (wariant 1; odrzucone 2: w karcie planu). Odrzucone A (trzy sekcje).
  „Powtórz ostatni” w arkuszu (jak na makiecie).
  Doprecyzowanie właściciela (ok. 15:30): karta „Dziś” z paskiem tygodnia i „Następne: …” zostaje na górze, a sekcja „Ten tydzień” z kafelkami
  zostaje; sztanga postępu trafia do „Ten tydzień” (tylko przy planie); duży przycisk startu i „Inny trening” przy karcie „Dziś”.
- 09.10.2026 (ok. 16:20): właściciel — sekcja „Ostatni trening” na środku ekranu głównego niepotrzebna → usunięta z ekranu głównego w układzie B
  (ostatni trening widać w arkuszu „Inny trening” → „Powtórz ostatni” z nazwą i datą oraz w Historii/Kalendarzu). Odrzucone: przeniesienie
  na dół ekranu.
- 09.10.2026 (ok. 15:40): właściciel — **wariant B: wersja pośrednia 0.11 na TestFlight** przed subskrypcją: poprawki z audytu kontrolnego
  (ŚREDNIE/NISKIE), układ B ekranu głównego i pełny zestaw motywu z ikony, „Plan z moich szablonów”, B1. Przed buildem: audyt zmian
  od 0.10.0 + lista kontrolna (CLAUDE.md „Audyty i wydania” pkt 4), verify, E2E. Potem: subskrypcja + wymogi App Store → pełny audyt →
  App Store. Odrzucone A (jedna wersja ze wszystkim). Licencje open source: zostają w „O aplikacji” (wymóg licencji MIT/BSD).
- 09.10.2026 (ok. 17:00): właściciel po zrzutach motywu — **korekta**: (1) pasek tygodnia i kalendarz: pod dniem z wykonanym treningiem
  mała kolorowa ikona jak ikona aplikacji (gryf z talerzami), dzień zaplanowany niewykonany — sama obwódka tej ikony; kolory talerzy nie
  kodują już serii ani kolejności (odrzucone: kolor = serie względem średniej, kolor po kolei); (2) zamiast sztangi postępu — N stosów
  talerzy obok siebie (N = dni w planie tygodnia), stos wypełniony kolorami = trening wykonany, obwódka = niewykonany, plus procent wykonania
  planu tygodnia; (3) usunięty czterokolorowy pasek nad kartą „Dziś” (nic nie znaczy).
- 09.10.2026 (ok. 17:10): właściciel — **usunąć przypomnienie o odnowieniu podpisu (T-053) i całą drogę instalacji z komputera**; instalacja
  tylko przez TestFlight (A). Powód: nazwa innej aplikacji w tekstach aplikacji (ryzyko odrzucenia przez Apple, zasada z 09.10). Odrzucone B:
  neutralny opis. `ios-unsigned.yml` zostaje jako sprawdzenie kompilacji (bez instrukcji instalacji).
- 09.10.2026 (ok. 17:25): właściciel — **do wersji 0.11 (wyjątek od zamrożenia zakresu, „marka jest ważna od początku”)**: (3) krótka animacja
  przy starcie aplikacji — talerze wsuwają się na gryf i układają w ikonę („jak intro Netflixa”); (5) Podsumowanie miesiąca: tygodnie jako
  rząd stosów (pełny = plan tygodnia wykonany, obwódka = niepełny). (6) zrzuty App Store w motywie — przy przygotowaniu sklepu (paczka przed
  App Store). Backlog: serie w treningu jako talerze, większa grafika talerzy w widoku skupionym, rekordy jako rosnący stos.
- 09.10.2026 (ok. 18:00): właściciel — **numerowanie wersji, wariant A**: do App Store 0.x (0.11.0, 0.12.0… z nowościami; 0.11.1… tylko
  poprawki), premiera w App Store = 1.0.0, potem 1.x (2.0.0 tylko przy dużej zmianie, np. konta/synchronizacja). Build rośnie zawsze
  (testflight.yml, BUILD_BASE + numer przebiegu). Każde wydanie: tag gita `v<wersja>-b<build>`, w „O aplikacji” „<wersja> (<build>)”
  (lib/version.ts, EXPO_PUBLIC_BUILD_NUMBER z CI), wpis „Co nowego” na wersję, wiersz w tabeli wydań (docs/09). Odrzucone: B (wersja
  z datą), C (kolejne liczby). Stopki commitów z adresem sesji — zostają (decyzja właściciela).
- 09.10.2026 (wieczór): właściciel po zrzutach motywu v2 (ikona dnia, stosy z % planu, miesiąc jako stosy, bez paska) — **akceptacja, wdrażać**
  do 0.11 (scalone w feature/e2-swap: 7126b7d). Na ekranie 375 pt tekst procentu przechodzi pod stosy — zgłoszone przy zrzutach, właściciel bez uwag.
- 09.10.2026 (wieczór): właściciel — **do 0.11 jako wyjątek od zamrożenia zakresu**: (1) **ikona dnia odpoczynku: filiżanka espresso** (wariant B;
  odrzucone: A — pusto, C — sam gryf bez talerzy, rekomendacja C). Tylko przy aktywnym planie, w dzień bez treningu w planie; bez planu — nic.
  Własny rysunek, bez tekstu i bez nawiązań do ceny w aplikacji. „Kosmetyka — najwyżej zmienimy przed App Store” (do przeglądu w paczce sklepu).
  (2) **generator: wybór dni treningowych (wariant B)** — 7 przycisków pon–nd zamiast liczby sesji, wstępnie zaznaczona propozycja
  generatora (bestDays); liczba zaznaczonych = liczba sesji; przydział treningów do wybranych dni minimalizuje pary dzień po dniu, istniejące
  ostrzeżenie „pairs”; to samo w „Planie z moich szablonów”. Odrzucone: A (bez zmian, przesuwanie w edytorze), C (przełącznik auto/wybiorę).
  Stan TestFlight: buildy 1001–1003 wygasły, 1004 (0.10.0) czeka na zatwierdzenie Apple.
- 09.10.2026 (wieczór): właściciel po klatkach — **akceptacja intro** (talerze wsuwają się na gryf, ok. 1 s, tapnięcie pomija, „Ogranicz ruch” bez
  animacji; ekran startowy = sam gryf). Jednorazowy stary ekran startowy po aktualizacji — informacja w „What to Test”.
- 09.10.2026 (wieczór): właściciel po zrzutach — **filiżanka: pełna sylwetka (B) i w całym kalendarzu (1)** — akceptacja. **Generator: 1–6 dni
  treningowych dla każdego celu** (dotąd siła/masa 2–6, redukcja 3–6); poza zakresem — komunikat (A, akceptacja); zmiana celu → propozycja
  generatora (akceptacja). Przy 1 dniu (zwłaszcza masa) — ostrzeżenie, że to mało skuteczne i w praktyce raczej utrzymanie: **treść
  merytoryczna do potwierdzenia źródłami** (hierarchia z CLAUDE.md; dotychczasowy research 22: przy masie częstotliwość obojętna przy równej
  objętości — ACSM 2026, Pelland 2026; ograniczeniem 1 dnia jest objętość tygodniowa). Bez potwierdzenia „utrzymania” w źródłach — tylko
  istniejące ostrzeżenia („rzadziej niż 2 dni”, „poniżej 10 serii”). Redukcja przy 1–2 dniach — rozstrzygnięcie w raporcie wdrożenia (opcje).
- 09.10.2026 (wieczór): właściciel — **generator: najpierw dni, potem cel (B) + czwarty cel „Ogólny”** (ogólnorozwojowy). Wszystkie cele
  aktywne przy każdej liczbie dni; przy zbyt małej liczbie dni krótka uwaga pod celem (treść wg źródeł — research 29). Odrzucone: A (cele
  wyszarzone poniżej minimum — blokuje, minima bez źródeł), C (jak dotąd: cel → dni). Parametry celu „Ogólny” wg źródeł (WHO 2020, ACSM)
  przed wdrożeniem. Termin: 0.11 (wyjątek; „Ok” na rekomendację — do potwierdzenia, jeśli właściciel wolał paczkę przed App Store).
- 09.10.2026 (wieczór): właściciel — **cel „Ogólny”: wszystkie wybrane dni siłowe (1–6) + przełącznik „Dni cardio w planie” (B)**, domyślnie
  wyłączony; po włączeniu dni powyżej 3 = cardio (dla 1–3 dni przełącznika nie ma). „Nie blokujmy 4–5 sesji siłowych” — przy 4+ dniach podział
  góra/dół jak przy masie, parametry „ogólne”. Odrzucone: A (bez przełącznika), C (domyślnie cardio przy 4–6). „Ok” przyjęte także dla
  rekomendacji: **2 serie** (źródła 2–3), **bez rozciągania i równowagi** (jedno źródło / tylko 65+; pytanie o wiek → backlog). Podstawa:
  szkic research „Ogólny” (WHO 2020, PAG 2018, ACSM 2011/2026) → docs/research/30 przy wdrożeniu. Przy masie 1 dzień: źródła nie potwierdzają
  „utrzymania” (ACSM 2026: przy równej liczbie serii przyrost podobny) — uwaga mówi o trudności zmieszczenia 10 serii w jednej sesji.
- 09.10.2026 (wieczór): właściciel — **redukcja przy 1–2 dniach: same dni siłowe, cardio poza planem (A)** — akceptacja rozstrzygnięcia agenta
  (research 29, sekcja 3; próg CUT_CARDIO_FROM = 3). Odrzucone: B (1 siłowy + 1 cardio — partie raz w tygodniu, bez źródła), C (cardio po sesji).
- 09.10.2026 (wieczór): właściciel — **nowe języki po 0.11, przed App Store**: grupa 1 — portugalski brazylijski (pt-BR; obecny pt = pt-PT)
  i hiszpański Ameryki Łacińskiej (es-419); grupa 2 — japoński, koreański, chiński tradycyjny (krój pisma CJK, łamanie wierszy, testy
  szerokości); azerski (az). Ukraiński już jest. Do sprawdzenia przed wdrożeniem (otwarte): czy iOS ma azerski jako język systemu i czy App
  Store Connect pozwala na opis sklepu po azersku; pokrycie znaków w IBM Plex Sans (ə). Chiński uproszczony odłożony (rejestracja ICP w Chinach).
  Rosyjski — TAK (właściciel, 09.10 wieczór; sprzedaż w Rosji przez App Store niedostępna od 2022 — zasięg przez kraje, gdzie rosyjski jest używany). Interpretacja „1, 2” = grupy z odpowiedzi z 09.10 — do potwierdzenia.
- 09.10.2026 (wieczór): właściciel — do paczki języków przed App Store dochodzą też **indonezyjski, malajski, wietnamski, uzbecki, kazachski**.
  Otwarte przed wdrożeniem: krój IBM Plex Sans — znaki wietnamskie i kazachskie (cyrylica rozszerzona); czy iOS ma uzbecki i kazachski jako
  język systemu i czy App Store Connect pozwala na opis sklepu w tych językach. **Arabski — osobne wydanie** (pismo od prawej: lustrzany układ,
  osobne testy i E2E), po App Store 1.0; zakres i termin — decyzja właściciela później.
- 09.10.2026 (wieczór): właściciel — **języki wdrażane po kolei: od najsensowniejszych i najłatwiejszych do najtrudniejszych / najmniej
  opłacalnych**. Propozycja kolejności (do potwierdzenia): fala 1 pt-BR, es-419; fala 2 id, ms, vi; fala 3 ru; fala 4 ja, ko, zh-Hant;
  fala 5 kk, uz, az; arabski osobnym wydaniem po 1.0.
- 09.10.2026 (wieczór): właściciel — **„nie kombinujmy”: 0.11 bez nowych języków. Wszystkie nowe języki oprócz arabskiego — w kolejnej wersji
  (po 0.11); arabski — w wersji jeszcze następnej.** Kolejność fal wewnątrz wersji jak wyżej.
- 09.10.2026 (wieczór): właściciel — **język trudniejszy niż zakładano** (np. nie jest językiem systemu iOS, brak opisu w App Store Connect,
  krój bez znaków wymagający większej pracy) → odłożony do wydania z arabskim (z zapisanym powodem).
- 09.10.2026 (wieczór): właściciel — **Android: na pewno dopiero po App Store; najpierw ocena sensu na podstawie wyników z App Store.**
  Szacunek (09.10): ok. 5–8 dni pracy agenta (build/CI, Health Connect, zamiennik Live Activity, zachowanie systemu, testy, audyt);
  czekanie: zamknięty test Google Play (wg wiedzy z 09.10: 12 testerów przez 14 dni — do sprawdzenia), przeglądy Google; koszt konta
  Google Play ok. 25 USD jednorazowo (wyjątek od zasady 0 zł — decyzja właściciela przy starcie prac). Przy wdrażaniu subskrypcji
  preferowana biblioteka obsługująca iOS i Androida (żeby nie przerabiać później) — bez zmiany zakresu iOS.
