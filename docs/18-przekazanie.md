# 18. Przekazanie — stan bieżący (od 11.10.2026)

Krótki stan dla nowej sesji. Historia decyzji 06.10–11.10.2026 (pełne zapisy z uzasadnieniami): **docs/18-archiwum-do-11.10.md** — nie edytować,
nowe decyzje dopisywać tutaj (sekcja „Decyzje”), z datą. Kolejność czytania: `CLAUDE.md` → ten plik → docs/21 (roadmapa, „Przed App Store”,
backlog) → docs/15 (App Store, ceny) → docs/09 (dziennik testów; stare rundy w docs/09-archiwum-do-0.11.md).

## Gałęzie i wydania
- `main` = **0.12.0**, build **1008** (TestFlight, 12.10.2026; PR #1–#3), tag `v0.12.0-b1008` (zakłada właściciel). Build 1006 i 1007 nie powstały:
  przebiegi padły na testach przed wysłaniem (poniedziałkowy scenariusz E2E 05; brak pamięci w teście języków × trasy) — tag `v0.12.0-b1006` zostaje (decyzja 12.10, B).
  Wcześniej 0.11.0 / build 1005 (10.10), 0.10.0 / build 1004 (09.10).
- `feature/e2-swap` = **0.12.0** (72be439): języki fal 1–4 (razem 35), nowy ekran Trening, Progresja, „zrobiony wcześniej”, podsumowanie rekordów,
  podział store.ts. Verify 237/237 plików, E2E pełny build zielony (run 38174381455, 11.10.2026). **PR #1 do `main`** — scala właściciel (12.10.2026:
  sesja agenta nie może wypchnąć do `main` ani sama rozszerzyć uprawnień — blokada bezpieczeństwa), potem `testflight.yml` na `main` i tag `v0.12.0`.
- `wydanie-0.13` (12.10.2026): 0.12.0 + `zakladki-4` (4 zakładki, masa ciała w Postępach) + `import-csv` + `strona-www` + `opis-app-store` + specyfikacje
  docs/26 (prośba o ocenę), docs/27 (subskrypcja), docs/28 (Apple Zdrowie etap 0). Gałęzie źródłowe zostają na GitHubie jako kopie.

## W toku (11.10.2026) — lista tematów właściciela, przerabiana po kolei
1. Ocena realności znalezisk — **zrobione** (CLAUDE.md, „Audyty i wydania” pkt 6).
2. Sposób pracy (wariant B — wszystko naraz): agenci-role z modelem per rola (`.claude/agents/`), research sprawdzonych promptów (pkt 3),
   odchudzenie docs (09 i 18 — archiwa), szybki cykl testów w trakcie pracy, podział `store.ts`.
3. Research promptów znanych osób/organizacji (tylko przeczytane źródła).
4. Trening zrobiony dzień wcześniej: jutro dzień wolny, reszta bez zmian; cel tygodnia liczy trening do tygodnia, z którego pochodzi.
5. Dezaktywacja wszystkich planów (pusty kalendarz), nadal najwyżej jeden aktywny.
6. Autouzupełnianie kolejnych serii po wpisie w pierwszej.
7. Podsumowanie rekordów po treningu (ćwiczenie + statystyki ze strzałką; bez sztangi z czerwonym talerzem).
8. Przepływy użytkownika → nawigacja, ekran główny, „Progresja” (tydzień/miesiąc), porządek przycisków; prompt do audytu UX.
9. Apple Zdrowie: treningi z zegarka, inne aktywności jako cardio, kroki w planie tygodnia.
10. Baza ćwiczeń: wskazówki i animacje (ExRx — brak API/licencji; MuscleWiki — płatne API i serwer).
11. Nazwa wydawcy Apps4Brew. 12. Strona internetowa. 13. Ryzyko FitNotes.

**Import CSV (11.10.2026, gałąź agenta, bez pusha):** formatA + formatB zrobione (docs/21, „Import CSV z popularnych dzienników”), Hevy [OTWARTE]. Ekran `more/import`,
logika `lib/csvparse.ts`/`lib/csvimport.ts`, testy `csv-import-logic`/`csv-import-ui`, 31 słowników (26 kluczy; do sprawdzenia przez native speakera). E2E Maestro — pominięty (docs/09).

## Otwarte ryzyka
- E2E-105: zgubione znaki przy szybkim wpisie masy ciała na wolnym symulatorze — do sprawdzenia na telefonie (docs/25).
- Scenariusz E2E 04 „Plank ze stoperem” (w backlogu „05”) — zgubione znaki po zimnym starcie; poprawka jak w 15 zrobiona 12.10.2026 (Q-029, gałąź f014-bledy; do potwierdzenia w E2E na symulatorze).
- Interpreter Maestro w Jest (tests/maestro-flows) liczy czas od zegara maszyny: uruchomiony po ok. 22:00 UTC przekracza północ i scenariusz 05 („This week: deload”) pada —
  to artefakt pory dnia, nie błąd (z `TZ=America/Los_Angeles` albo wcześniej w ciągu dnia przechodzi).

## Decyzje (od 11.10.2026)
- 11.10.2026: raporty rynkowe — wnioski w docs/research/raporty-rynkowe-2026-10.md; import CSV i prośba o ocenę → „Przed App Store” (A+A).
- 11.10.2026: ocena realności znalezisk (A) — CLAUDE.md.
- 11.10.2026: usprawnienie pracy — wariant B (wszystko naraz, przed nowymi funkcjami); docs/09 i docs/18 dostały archiwa.
- 11.10.2026: **trening zrobiony wcześniej (pkt 4) — wariant A**: trening szablonem X w dniu bez X w planie → jeśli najbliższy dzień treningowy
  w planie ma X, ten dzień „zrobiony wcześniej” (w kalendarzu wolny z ✓), liczy się do celu SWOJEGO tygodnia, reszta planu bez zmian; po zakończeniu
  jedna linijka informacji, „Cofnij” w panelu dnia. Sprawdzić sąsiednie reguły: poranne przypomnienie, „Przesuń plan”/propozycje, stosy miesiąca
  i postęp tygodnia, deload. Odrzucone: B (pytanie po treningu — dodatkowe stuknięcie), C (tylko ręcznie). Wdrożenie po scaleniu refactor-store.
- 11.10.2026: **wyłączenie wszystkich planów (pkt 5) — wariant A z potwierdzeniem**: ikona przy każdym planie na liście (aktywny — wypełniona);
  pusta → „Ustaw jako aktywny” (z oknem jak dziś), wypełniona → okno „Wyłączyć plan? Kalendarz od dziś będzie pusty” i wyłączenie (plan do
  „Inne plany” z nazwą i zmianami dni; minione dni w historii; poranne przypomnienia wyłączone). Oba kierunki zawsze z potwierdzeniem
  (właściciel: „żeby ludzie nie rozwalali sobie misclickiem planu”). Najwyżej jeden aktywny. Odrzucone: B (osobny przycisk „Wyłącz plan”).
- 11.10.2026: **autouzupełnianie serii (pkt 6) — wariant A (kaskada w dół)**: wartość wpisana w serii N przechodzi do kolejnych serii tego samego
  rodzaju (robocze/rozgrzewka osobno) tylko tam, gdzie pole jest puste albo ma jeszcze poprzednią wartość z serii N; nigdy nie nadpisuje serii
  odhaczonej ani wartości wpisanej ręcznie. Edytor szablonu i trening. Odrzucone: B (kopiowanie tylko przy „+ Seria”), C (przycisk „Do wszystkich”).
- 11.10.2026: **podsumowanie rekordów (pkt 7) — wariant A, bez grafiki**: dla każdego ćwiczenia z rekordem nazwa, tylko pobite statystyki ze
  strzałką ↑ i przyrostem względem poprzedniego rekordu (np. „↑ e1RM 112,5 kg (+2,5 kg)”) oraz najlepsza seria dnia; sztanga z talerzami
  (components/RecordPlates.tsx) usunięta z karty. Odrzucone: B (pełny zestaw statystyk).
- 11.10.2026: **Apple Zdrowie (pkt 9)** — (1) etapami (A): etap 1 — aktywności i kroki z Health tylko do odczytu w kalendarzu i tygodniu (bez liczenia
  do celów); etap 2 — dopasowanie treningu z zegarka do sesji; etap 3 — aktywności jako cardio i cel kroków po researchu badacza (WHO 2020, MET,
  kroki — źródła, nie zgadujemy). (2) Dane z Health czytane na bieżąco, NIE zapisywane w danych aplikacji ani w kopii (A): Apple 5.1.3
  (zakaz przechowywania danych zdrowotnych w iCloud — kopia trafia do Plików/iCloud Drive), bez zmiany schematu (aktualizacja biblioteki
  healthkit 8 → 16 bez migracji). Do zmiany: opis NSHealthShareUsageDescription (dziś „nie odczytuje”), site/privacy.html, formularz prywatności
  App Store. Odrzucone: B (jedno wydanie), B (import do historii).
- 11.10.2026: **trening z zegarka (pkt 9, etap 2) — A**: trening siłowy w Health pokrywający się czasowo z sesją → łączenie automatyczne (tętno,
  aktywne kcal w szczegółach sesji), aplikacja nie zapisuje własnej kopii do Health; gdy zegarek zsynchronizuje się później — przy następnym
  otwarciu usuwa swoją kopię (własny wpis). Odrzucone: B (dwa zapisy, podwójne kcal), C (pytanie po każdym treningu).
- 11.10.2026: **baza ćwiczeń (pkt 10) — A**: rozbudowa własnych wskazówek techniki (dziś 82) i figur ruchu (dziś 71; 854 ćwiczenia w bibliotece)
  partiami — pierwsza ~50 z filtra „Podstawowe”, potem najczęściej używane; każda partia: badacz (źródła) → tłumacz (35 języków); dopracowanie
  animacji (więcej póz, płynniejszy ruch). ExRx tylko jako źródło do czytania (szczebel 4, teza o rekomendacji ACSM niepotwierdzona).
  Odrzucone: B (płatne API z filmami — koszt, serwer, brak offline), C (otwarte zbiory zdjęć — do ewentualnego uzupełnienia po sprawdzeniu licencji).
- 11.10.2026: **Apps4Brew (pkt 11) — A**: marka od teraz (strona, polityka prywatności, stopka, materiały); w App Store sprzedawcą imię
  i nazwisko właściciela do czasu ewentualnej spółki (Apple: konto indywidualne/JDG — nazwisko; nazwa firmy tylko dla osoby prawnej z D-U-N-S,
  „We do not accept DBAs… trade names”, developer.apple.com/programs/enroll, przeczytane 11.10.2026). Domeny apps4brew.com i .app wolne
  (RDAP 404, 11.10.2026). [OTWARTE]: znaki towarowe (EUIPO, UPRP), przeniesienie aplikacji na konto firmowe, koszty spółki. Domena — decyzja
  właściciela po cenach (.com ok. 11 USD/rok, .app ok. 15 USD/rok — porkbun.com, 11.10.2026).
- 11.10.2026: **nawigacja (docs/22, P1) — wariant A: 4 zakładki Trening · Plan · Postępy · Więcej** (Szablony i Ćwiczenia pod Więcej).
  Kolejność wdrożenia wg docs/22: ekran główny i porządki → decyzje 4–7 → zmiana zakładek osobnym wydaniem. Pozostałe pytania P2–P8 — do przejścia.
- 11.10.2026: **domena** — zgoda właściciela na zakup (niewielki wydatek poza Apple); rekomendacja agenta: `apps4brew.com` (najbardziej
  rozpoznawalna końcówka, 11,08 USD/rok w porkbun.com 11.10.2026); `.app` tylko jako opcjonalna ochrona marki. Zakup — właściciel (konto, płatność).
- 11.10.2026: **strona internetowa (pkt 12) — A**: jedna prosta strona Apps4Brew na GitHub Pages (docs/): opis i zrzuty, link do App Store,
  polityka prywatności, „Pomoc” (kontakt + FAQ), PL/EN; domena apps4brew.com podpinana po zakupie (właściciel — w przyszłym tygodniu).
  [OTWARTE]: adres kontaktu wsparcia (nie e-mail prywatny w publicznym repo — np. skrzynka w domenie po zakupie). Odrzucone: B (inny hosting), C (minimum).
- 11.10.2026: **FitNotes (pkt 13) — A**: raport Gemini mylił się (FitNotes jest na iOS — App Store, 11.10.2026); poprawiona notatka
  docs/research/raporty-rynkowe-2026-10.md, pozycjonowanie na różnicach (bez nazw konkurentów), import CSV z FitNotes dopisany do „Przed App Store”.
  Korekta agenta: darmowy poziom to 4 treningi/miesiąc (docs/15, 09.10) — nie „bez limitu”, jak błędnie podał agent w rozmowie.
- 11.10.2026: **aplikacja na Apple Watch — A jako priorytet po wejściu do App Store**: etap 1 — dodatek do telefonu (bieżąca seria,
  odhaczanie, przerwa, sesja treningowa z tętnem/kcal, WatchConnectivity; dane trzyma telefon), etap 2 — ewentualnie samodzielna. Natywny Swift
  (osobny target), test na zegarku właściciela. Odrzucone: B (przed App Store), C (tylko dane z Health).
- 11.10.2026: **cennik zmieniony** (docs/15): roczna 6,99 USD (PL 19,99 zł bez zmian), dożywotnio 21,99 USD / 59,99 zł; miesięczna bez zmian;
  Family Sharing — tak. EUR/GBP jak USD — potwierdzone.
- 11.10.2026: **docs/22 P2 — B**: „Z szablonu” w arkuszu „Inny trening” otwiera osobny pełnoekranowy wybór szablonu ze „Startem” (jak „Wybierz
  ćwiczenie”); czytelniejsze przy wielu szablonach (+1 stuknięcie). Odrzucone: A (lista w arkuszu).
- 11.10.2026: **docs/22 P3 — A**: dolny „Zakończ trening i zapisz” usunięty; zostaje „Zakończ” w nagłówku i w karcie po ostatniej serii
  (w widoku „Lista” tylko nagłówek — świadomie, mimo przewijania). Koszt: ~20 testów szuka tego tekstu. Odrzucone: B (zostawić w widoku „Lista”).
- 11.10.2026: **podział lib/store.ts scalony** (gałąź refactor-store): fasada 6 KB + 25 modułów w lib/state/ (bez cykli, to samo API 247 nazw);
  verify 4701/4702 (1 pominięty) po scaleniu. E2E z pełnym buildem — w toku.
- 11.10.2026: **docs/22 P4 — A**: „Pierwsze kroki” — 3 kroki, każdy z jednym przyciskiem (Planowanie / Przewodnik). Odrzucone: B (4 kroki, 9 przycisków).
- 11.10.2026: **docs/22 P5 — A**: masa ciała jako sekcja w zakładce Postępy (wykres + dodanie pomiaru); link z Ustawień znika. Odrzucone: B (oba miejsca).
- 11.10.2026: **docs/22 P6 — B**: import CSV z innych dzienników w Kopii zapasowej ORAZ jako pomijalny krok w „Pierwszych krokach”
  („Masz historię z innej aplikacji?”) — „Pierwsze kroki” mają wtedy 4 kroki (3 z P4 + import). Odrzucone: A (tylko Kopia zapasowa).
- 11.10.2026: **docs/22 P7 — A z wyjątkiem (decyzja właściciela)**: dwa wydania — (1) ekran główny i porządki (P2–P4, P6, „Ten tydzień”,
  „Progresja”) + decyzje 4–7; (2) 4 zakładki + masa ciała w Postępach (P5). Wyjątek od zasad wydania (tylko te wydania): wydanie (1) bez nowego
  wpisu „Co nowego” (jeden wspólny wpis w (2), tłumaczony raz na 35 języków; „What to Test” PL/EN), zamiast audytu zmian tylko stała lista
  kontrolna (dane i migracje — podział store.ts, prywatność, sekrety, logi); **pełny audyt wstrzymany** także po wydaniu (2) — do polecenia
  właściciela. Apple Zdrowie (pkt 9) — osobne wydanie (biblioteka natywna). Odrzucone: B (jedno wydanie), A bez wyjątku, A bez kontroli.
- 11.10.2026: **docs/22 P8 — B (właściciel)**: Progresja tygodnia = wykonane + zaplanowane z szablonów na pozostałe dni (rachunek z planu
  użytkownika, nie twierdzenie merytoryczne — szczebel 1, bez badacza); na wykresie dwa kolory i podziałka, podpis „wykonane”/„zaplanowane”.
  Domyślnie (agent): seria w szablonie bez ciężaru/powtórzeń → wartości z „Poprzednio” (ostatnie wykonanie tego wiersza szablonu); bez nich —
  liczy się do serii, nie do objętości, kafelek z „+?”. Odrzucone: A (dwie liczby bez sumy).
  Wszystkie pytania P1–P8 z docs/22 rozstrzygnięte.
- 11.10.2026: **okienko rekordów po „Zakończ” — usunięte (A)**: po zakończeniu treningu od razu ekran podsumowania z nową kartą rekordów
  (bez „OK”). Odrzucone: B (okienko w nowym formacie — dubel informacji).
- 11.10.2026: **pozostałe problemy audytu nawigacji (docs/22, 2.2) — A, pakietem wg propozycji z docs/22 4.3/4.4**, w wydaniu 1 (osobny agent
  po scaleniu 4 gałęzi): jedno „⇄ zamień” (pkt 5), deload bez chipa w Postępach (6), „Miejsca i sprzęt” znika z Ustawień (7), Przewodnik raz
  w „Pierwszych krokach” (8), przełącznik „Zachęta do planu” znika (14), „Inny trening” w panelu dnia → „Zmień szablon”/„Dodaj do planu” (16),
  „Dopisz trening wstecz” jako jedna nazwa (17). Osobno do decyzji: pkt 11 (okno „Zaktualizować szablon?” i stos po „Zakończ”), pkt 23 (ikona „i”).
- 11.10.2026: **8A** okno „Zaktualizować szablon?” po „Zakończ” → przycisk „Zapisz zmiany w szablonie” na ekranie podsumowania (tylko gdy były
  zmiany), bez wyskakującego okna. **9A** ikona „Co nowego”: iskierki ✦ zamiast „i” (kropka bez zmian). **10A** Progresja miesiąc do miesiąca:
  bieżący miesiąc do dziś vs te same dni poprzedniego miesiąca. Rozstrzygnięte przez agenta wg decyzji właściciela (do pakietu porządków):
  „Ten tydzień” bez „poprz.” w kafelkach, tytuł ekranu planu „Planowanie”, przełącznik „Zachęta do planu” znika, „Miejsca i sprzęt” jako zdanie
  z odnośnikiem w „Pierwszych krokach”, martwy kod (home.planSummary, dashboard.emptyTemplates) usunięty.
- 11.10.2026: **1A** przycisk „Zapisz zmiany w szablonie” tylko zaraz po treningu (stan w pamięci, bez zmiany schematu). **2A** jedno wydanie
  TestFlight 0.12.0: języki fal 1–4 + nowy ekran (wydanie 1) — bez osobnego wpisu „Co nowego” o nowym ekranie, lista kontrolna zamiast audytu.
  Do backlogu (bez blokowania wydania): przegląd tłumaczeń przez native speakerów — „Progresja” (el, tr, ko, ja, zh-Hant, vi, de), „Sylwetka”
  (it, vi, zh-Hant), hu „A {day} napra”, ja „先に完了”, ko „만들기”/„생성”.
- 11.10.2026: **wydanie 2 — cztery zakładki i masa ciała w Postępach (docs/22 wariant A; P1, P5 A) — zrobione na gałęzi `worktree-agent-a8b35c1e8d37ffe2c`
  (od `feature/e2-swap`, niewypchnięta; scalenie i E2E na symulatorze — główna sesja).** Zakładki: **Trening · Plan** (dawny Kalendarz) **· Postępy** (nowa,
  z „Progresją”, podsumowaniem, wykresami, ćwiczeniami i sekcją „Masa ciała”) **· Więcej** (Szablony i Ćwiczenia na górze listy jako ekrany stosu `/templates`,
  `/exercises`). Z Ustawień znikła „Masa ciała”; `app/more/progress.tsx` → `app/(tabs)/progress.tsx`. Bez zmiany schematu danych. Przepływy w stuknięciach
  (od zakładki Trening): Postępy 2 → **1**; masa ciała (Więcej → Ustawienia → Masa ciała) 3 → **2** (Postępy → „Masa ciała — pomiary”); Szablony i Ćwiczenia
  1 → **2** (Więcej → …); Plan 1 → 1; start „Z szablonu” bez zmian (2); Planowanie → Szablony → wraca do planu (stos). Żadna funkcja nie zniknęła
  (tests/tabs-four.test.tsx sprawdza każdą drogę). Wpis „Co nowego” 2026-10-11 (3 punkty, 35 języków), teksty: „Plan” + 7 zmienionych (35 języków).
  **Do akceptacji właściciela** (najmniej inwazyjne wybory agenta): (1) „Postępy” z ekranu ćwiczenia przełącza na zakładkę (zamyka stos, „Back” nie wraca do
  ćwiczenia — jak „Pokaż” w Przewodniku); alt.: osobny ekran stosu dla wykresu ćwiczenia; (2) masa ciała w Postępach = ostatni pomiar + wykres + przycisk
  do istniejącego ekranu pomiarów (dodawanie i lista tam); alt.: formularz w Postępach; (3) treść Postępów renderuje się tylko przy aktywnej zakładce, więc szukanie
  i wybrane ćwiczenie znikają po wyjściu z zakładki (nie liczy wykresów w tle przy wpisach serii); (4) teksty z „Kalendarzem” (Przewodnik, komunikaty) zostały —
  kalendarz jest w zakładce Plan; zmiana ~15 tekstów × 35 języków poza zakresem; (5) ekrany Szablony/Ćwiczenia mają tytuł tylko w nagłówku stosu (liczba
  ćwiczeń jako sama liczba obok „+ Nowe”); (6) wpis „Co nowego” jest osobnym niewydanym wpisem nad 0.12.0 (też niewydanym) — przy nadawaniu numerów wersji
  rozdzielić albo scalić; (7) tłumaczenia „Plan” i nowych zdań (en/de/… 35 języków) do przeglądu native speakerów razem z backlogiem; (8) E2E Maestro: nowy
  `19-zakladki`, zmienione 01, 05, 08, 13–17 i podprzepływ `szablon-testowy` — sprawdzone interpreterem w Jest, wymagają przebiegu na symulatorze
  (ryzyka: 14 — wejście przez „Planning”, 15 — masa ciała w Postępach, 16/17 — Więcej → „Exercises”).
  Testy: 111 powiązanych plików (w tym nowy tests/tabs-four.test.tsx, interpreter Maestro dla 19 scenariuszy) — 3187 zielonych, 2 pominięte; `tsc` czysty,
  `check:i18n`, `check:matrix` (1904 pozycji, bez testu: 0) OK. Pełnego `verify` (expo export, verify:native) nie uruchamiano — główna sesja.
- 11.10.2026 (ok. 23:30): **TestFlight 0.12.0 — A**: po zielonym E2E 18/18, verify i liście kontrolnej scalenie do `main` i `testflight.yml` w nocy.
  12.10.2026: scalenie zablokowane przez zabezpieczenie sesji (wypchnięcie do `main` = wdrożenie produkcyjne); właściciel wybrał B (reguła uprawnień) —
  agent nie może sam dopisać reguły (blokada „samomodyfikacji”); zamiast tego **PR #1**, scala właściciel.
- 11.10.2026: **hasło „w cenie espresso lub taniej”** — wyjątek od warunku źródeł (docs/15, sekcja metadanych pkt 4); wstawiane razem z blokiem cenowym.
- 11.10.2026 (ok. 23:45, „wszystko wg rekomendacji”): (1) wskazówki ćwiczeń, partia 1 — badacz (A), adresy od Gemini jako punkt startu; (2) **0.13.0 =
  4 zakładki + import CSV + strona www** (A); (3) import formatu bez godzin — dzień z istniejącym treningiem pomijany (A); (4) import: kg/lb z Ustawień,
  nowe ćwiczenie przy braku dopasowania, 12:00 przy braku godziny — zaakceptowane; (5) **prośba o ocenę** (docs/26): po N-tym treningu z rekordem (B+A),
  N = 5 (decyzja produktowa, bez źródła), odstęp 14 dni, max 1 na wersję, bez linku w Ustawieniach, data w polu ustawień; (6) **nazwa w App Store — A**:
  „Trening: dziennik siłowni” / „Training: Gym Log & Rest Timer” (docs/15).
- 11.10.2026: **kolejność wydań natywnych — A** (docs/28): (1) sama aktualizacja `@kingstinct/react-native-healthkit` 8 → 16, zapis do Zdrowia jak dziś;
  (2) Apple Zdrowie etapy 1–2 (odczyt); (3) subskrypcja StoreKit (docs/27: najpierw pole „trening na żywo” i logika limitu za wyłączoną flagą, potem
  biblioteka i ekran zakupu). Odrzucone: B (biblioteka razem z etapem 1), C (Zdrowie i StoreKit w jednym wydaniu).
- 11.10.2026: **Gemini (subskrypcja właściciela) — wniosek z prób** (wskazówki techniki, partia 1): Deep Research czyta strony, ale znajduje mało
  (43/50 „brak źródeł”); bez Deep Research podaje zmyślone cytaty i adresy (sprawdzone: ACE nr 42 to inne ćwiczenie, cytat ACE nr 183 nie występuje);
  w trybie „tylko adresy” ok. 6 trafnych stron ACE/NASM na 50, źródło innego serwisu podpisane jako ExRx (weighttraining.guide), analogie jako źródła.
  Wniosek: Gemini do researchu rynku, opinii i przeglądu tłumaczeń; cytaty i źródła merytoryczne — zawsze badacz (WebFetch + weryfikacja).
  Zadania pasujące do Gemini agent zgłasza właścicielowi z gotowym promptem (CLAUDE.md).
- 12.10.2026: 0.12.0 — A: osobny build dziś (poprawka scenariusza 05, PR, Merge + Run workflow + tag ręcznie, build 1007; tag v0.12.0-b1006 do usunięcia); automatyzacja (TestFlight + tag po scaleniu do main) — A, wklejana przez właściciela w PR 0.13.0 (agent nie może zmieniać procesu wydań — blokada „Production Deploy”).
- 12.10.2026: komunikacja — A: agent pisze tylko, gdy potrzebna decyzja/kliknięcie właściciela, przy niepowodzeniu ze skutkami albo na końcu etapu; bez bieżących komunikatów o postępie.
- 12.10.2026: tag v0.12.0-b1006 zostaje (B) — build 1006 nie powstał (TestFlight 38207286308 padł na teście przed wysłaniem do Apple); właściwy build 0.12.0 = 1007.
- 12.10.2026: cel serii na partię/tydzień — funkcja A (Ustawienia: per partia Automatycznie/Ręcznie; paski mierzą do celu), wydanie 0.14.0; research „serie wg wielkości partii” — badacz, bez Gemini (docs/research/32).
- 12.10.2026: research serii wg partii (docs/research/32): automatycznie 10 dla każdej partii (hierarchia: ACSM 2026, Schoenfeld 2017). Produkt 0.14.0: (1) A — zdanie przy kresce 10 serii w Postępach, że ćwiczenia pomocnicze liczą się za pół serii; (2) B — w statystykach barki na przód/bok/tył, plecy na górę/najszersze.
- 12.10.2026: audyt zmian 0.13.0 — 1 WYSOKIE (import CSV: ćwiczenia z masą ciała w `weight` zamiast `addKg` → błędne rekordy/e1RM; naprawa przed wydaniem). Backlog 0.14.0: ŚREDNIE — formatB bez godziny pokazuje szacowany czas (12:00, serie×90 s) jak dane; NISKIE — teksty „Kalendarz”/„zakładka Szablony” po zmianie zakładek; Postępy gubią wybrane ćwiczenie po powrocie. Uwagi: dystans formatA jako metry [OTWARTE] — sprawdzić na prawdziwym pliku; kontakt na support.html przed App Store.
- 12.10.2026: backlog — A: 0.14.0 = porządek statusów + małe błędy (Q-004, Q-012…Q-016, Q-026, Q-029) + znaleziska audytu 0.13 (ŚREDNIE/NISKIE) + T-057 + cel serii na partię (1A, 2B) + partia 2 wskazówek; natywne: 0.15 Health biblioteka, 0.16 Health odczyt, 0.17 subskrypcja + prośba o ocenę. T-052 (wymiana klucza ASC) — pilne, właściciel.
- 12.10.2026: rozbicie barków/pleców w statystykach serii — wycofane (A, decyzja zastępuje 2B): cele i kreski tylko na całe partie (10 wg źródeł), cel ręczny na partię i zdanie o pół serii zostają; zamyka bloker WYSOKIE z audytu 0.14.
- 12.10.2026: monetyzacja — B: na start subskrypcja (docs/27, wydanie 0.17), z możliwością późniejszego przejścia na model darmowy. Wymaganie: płatne funkcje zależą od jednego przełącznika w jednym module (przejście na darmowe = zmiana jednej wartości + wydanie). Odrzucone na teraz (właściciel dalej rozważa): jednorazowy pakiet dożywotni; model całkowicie darmowy (napiwki w aplikacji, wersja pod marką klubu, partnerzy z kodami zniżkowymi — na stronie WWW, sprzęt przed suplementami); budowa pod sprzedaż aplikacji. [OTWARTE przed 0.17, badacz]: zasady Apple wycofania subskrypcji przy istniejących subskrybentach.
- 12.10.2026: E2E 0.13.0 i 0.14.0 — scenariusz 07 padał (linijka podpowiedzi zamiennika pod paskiem stanu, Maestro stukał w pasek); poprawka scenariusza (przesunięcie listy przed stuknięciem, wzór scenariusza 13), błąd scenariusza, nie aplikacji.
- 12.10.2026: droga do App Store — C: kolejność bez zmian (0.15/0.16 Zdrowie, 0.17 subskrypcja + prośba o ocenę, potem pierwsza publikacja); przygotowania do sklepu (audyt historii git, prawa autorskie, elementy właściciela, instrukcja App Store Connect, zrzuty, opis) równolegle. Odrzucone: A (subskrypcja zaraz po 0.14, Zdrowie po starcie), B (start za darmo po 0.14).
- 12.10.2026: nazwy producentów w tytułach źródeł wskazówek (lib/cues/data.json; wyjątki w tests/forbidden-names.json) — A: zostają (UI pokazuje tylko rodzaj źródła); odrzucone B (ogólne opisy źródeł).
- 12.10.2026: audyt przed App Store (raport: znaleziska F1–F6): F1 (dane właściciela w historii git) — B: przepisanie historii tuż przed App Store (agent przygotowuje, właściciel wykonuje force-push i prośbę do GitHub Support o PR #1–3); odrzucone A (zaraz po 0.13/0.14), C (zostawić). F2 — A: strony index/support/privacy z osobnego katalogu przez GitHub Actions (Pages), research konkurencji docs/research/kb → Dysk (wykonanie decyzji B z 09.10); odrzucone B (gh-pages), C (cały docs/). F3 — A: jednorazowe sprawdzenie podobieństwa lib/cues do źródeł, wynik w docs/09; odrzucone B (stały test). F4 — A: Secret scanning + Push protection, usunięcie starych sekretów EAS, unieważnienie tokenu Expo, środowisko „release” z zatwierdzeniem; odrzucone B (tylko scanning).
