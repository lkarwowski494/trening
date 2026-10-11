# 18. Przekazanie — stan bieżący (od 11.10.2026)

Krótki stan dla nowej sesji. Historia decyzji 06.10–11.10.2026 (pełne zapisy z uzasadnieniami): **docs/18-archiwum-do-11.10.md** — nie edytować,
nowe decyzje dopisywać tutaj (sekcja „Decyzje”), z datą. Kolejność czytania: `CLAUDE.md` → ten plik → docs/21 (roadmapa, „Przed App Store”,
backlog) → docs/15 (App Store, ceny) → docs/09 (dziennik testów; stare rundy w docs/09-archiwum-do-0.11.md).

## Gałęzie i wydania
- `main` = **0.11.0**, build **1005** (TestFlight, 10.10.2026), commit 0d71775, tag `v0.11.0-b1005` (tag zakłada właściciel w GitHubie —
  sesja agenta nie może wypychać tagów, decyzja 10.10 wariant A). Wcześniej 0.10.0 / build 1004 (09.10).
- `feature/e2-swap` = **0.12.0** (niewydana): języki fal 1–4 (pt-BR, es-419, id, ms, vi, ru, ja, ko, zh-Hant; razem 35), wpis „Co nowego” 0.12.
  E2E z językami zielone (run 38035814445); E2E dla 0.12.0 w toku. **Audyt 0.12 wstrzymany** (polecenie właściciela 11.10).
- `refactor-store` (w toku, 11.10): podział `lib/store.ts` na moduły bez zmiany działania — decyzja właściciela 11.10, wariant B.

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

## Otwarte ryzyka
- E2E-105: zgubione znaki przy szybkim wpisie masy ciała na wolnym symulatorze — do sprawdzenia na telefonie (docs/25).
- Scenariusz E2E 05 (Plank) — zgubione znaki po zimnym starcie; poprawka jak w 15 (backlog).

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
  healthkit 8 → 16 bez migracji). Do zmiany: opis NSHealthShareUsageDescription (dziś „nie odczytuje”), docs/privacy.html, formularz prywatności
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
