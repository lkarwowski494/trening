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
