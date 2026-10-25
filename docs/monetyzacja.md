# Monetyzacja — model stały (jedno miejsce)

Stan: 22.10.2026 (dopisek 1.0: 25.10.2026 — okno „Uczciwe zasady” i karta po imporcie, niżej). Model **M5 S1** (decyzja właściciela 22.10.2026, docs/18; badanie: `docs/monetyzacja-badanie-2026-10.md` rozdz. 10–11) jest **stały**: cała aplikacja darmowa do 5 dni treningowych w miesiącu,
Pro (subskrypcja miesięczna, roczna albo dostęp dożywotni) zdejmuje limit, bez okresu próbnego. Żadna naprawa ani decyzja nie zmienia ceny, limitu ani podziału darmowe/płatne (cena roczna 6,99 USD — 20.10.2026).
Ten dokument jest jedynym miejscem, w którym zapisane są kwoty i liczby modelu. Inne dokumenty (docs/15, docs/18, docs/27) opisują historię decyzji i odsyłają tutaj; zgodność z kodem pilnuje `tests/audit-m1-045-store-description.test.ts`
(stałe w kodzie: `FAKE_PRICES` i `PLN_PRICES` w `lib/store-fake.ts`, `PAYWALL.FREE_TRAINING_DAYS_PER_MONTH` w `lib/access.ts`, plik `store/Trening.storekit`).

## Model

| plan | cena bazowa (USD; GBP jak USD, EUR — niżej) | rodzaj |
|---|---|---|
| miesięczna | 0,99 | subskrypcja odnawiana automatycznie |
| roczna | 6,99 | subskrypcja odnawiana automatycznie |
| dożywotnia | 14,99 | zakup jednorazowy (non-consumable) |

- **Okres próbny:** **Bez okresu próbnego** i bez ofert wprowadzających (usunięte 22.10.2026: dawne 14 dni, `TRIAL_DAYS`, przypomnienie o końcu próby i wnioskowanie próby na iOS 16.4–17.1 — M1-011/M1-017/M1-041a). Ryzyko R-M5-3 (docs/40): oferty w App Store Connect usuwa właściciel, zamyka kontrola ASC.
- **Darmowy poziom:** **5 dni treningowych** w miesiącu kalendarzowym (`PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`). Dzień treningowy = data startu (wg strefy treningu) z co najmniej jednym ukończonym treningiem **na żywo trwającym ponad 20 minut** (`MIN_LIVE_MINUTES_FOR_DAY`, czas bez pauz jak w historii; „Zakończ” albo zapis po 6 h bez aktywności).
  Kolejny trening tego samego dnia nie zużywa limitu i zawsze wolno go zacząć. Trening wstecz (także z dzisiejszą datą), import, edycja, anulowany, trwający i krótszy niż 20 minut nie zużywają dnia i nigdy nie są blokowane. Blokada dotyczy tylko startu treningu w nowym dniu ponad limit; dane (historia, edycja, dopisywanie wstecz, kopia, eksport) zawsze dostępne.
  Dni są **zapisane osobno w stanie aplikacji** (`State.liveDays`, w kopii zapasowej; zapis przy ukończeniu sesji; migracja uzupełnia je z historii) — usunięcie treningu nie zwraca dnia (R-M5-1 zamknięte decyzją 22.10.2026). Po wygaśnięciu Pro liczą się dni od chwili wygaśnięcia (P3 B). Ryzyka przyjęte bez naprawy: zmiana daty w telefonie (R-M5-2), ręczne wpisy omijające limit (R-M5-4), ponowna instalacja/drugie urządzenie bez kopii (R-M5-5).
- **Chmura rodzinna (Family Sharing):** TAK dla subskrypcji i dostępu dożywotniego (11.10.2026). Włączenie jest nieodwracalne — Apple: „once you turn on Family Sharing for an In-App Purchases in App Store Connect, you can't turn it off” (developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/turn-on-family-sharing-for-in-app-purchases, odczyt 23.10.2026); włączone dla trzech produktów — kontrola ASC 39822823188 (22.10.2026).
- **Euro (21.10.2026, decyzja właściciela):** subskrypcja roczna **7,99 €** — przeliczenie Apple z ceny bazowej w USD (z VAT), bez ręcznej korekty w ~20 krajach strefy euro; odrzucone: ręcznie 6,99 € (zbyt dużo kliknięć). GBP roczna 6,99 £ (sprawdzone 21.10). Miesięczna w euro: 0,99 € (sprawdzone przez właściciela 21.10). Dożywotnia w euro: 17,99 € (przeliczenie Apple, jedna kwota w 21 krajach strefy euro) — potwierdzone kontrolą ASC 39822823188 (22.10.2026).
- **Ceny lokalne (Polska):** miesięczna 4,99 zł, roczna 19,99 zł, dożywotnia 59,99 zł — ustawione ręcznie w App Store Connect (14.10.2026, docs/18; 20.10.2026: „PL bez zmian”). Pozostałe kraje przelicza Apple z ceny bazowej.
  Ceny w App Store Connect ustawia właściciel (instrukcja: `kroki-wlasciciela.md`, K-CENA).
- **Kody ofertowe Apple** (offer codes) na darmową subskrypcję: decyzja 09.10.2026 (wariant A), szczegóły wdrożenia: docs/27.
- **Zasada cenowa (09.10.2026):** cena w kraju = lokalny próg zakupu impulsowego, nie przeliczenie kursowe — dotyczy ręcznych korekt cen lokalnych w App Store Connect.

## 1.0: informacja o modelu — okno „Uczciwe zasady” i karta po imporcie (decyzja właściciela 25.10.2026)

Model, ceny i limit bez zmian. Dochodzą dwa miejsca, w których użytkownik w stanie `free` dowiaduje się o planach Pro, zanim dojdzie do limitu (do tej pory ekran zakupu pokazywał się dopiero przy starcie treningu ponad limit i z Ustawień). Żadnej nowej trasy w `app/`; kod: `lib/fairrules.ts`, `components/FairRulesSheet.tsx`, `components/ImportProCard.tsx`.

- **Okno „Uczciwe zasady”** (na podsumowaniu świeżo zakończonego treningu, `app/history/[id].tsx`): **raz**, gdy spełnione są wszystkie warunki — `PAYWALL.ENABLED`, poziom dostępu `free` (stan niepewny bez zapamiętanego wyniku nie liczy się), trening zakończony jest treningiem **na żywo** (`Workout.live`), flaga `State.seenFairRulesManifest` nie jest ustawiona. Zawartość: tytuł, trzy krótkie zdania (wszystkie funkcje działają od pierwszego dnia; dni darmowe z `PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`; Pro zdejmuje limit — subskrypcja albo zakup jednorazowy), przycisk główny „Super, trenuję dalej!” (zamyka) i drugorzędny „Zobacz plany Pro ›” (zamyka i otwiera ekran zakupu). Każde zamknięcie (także „Anuluj” w nagłówku) ustawia flagę. Bez listy planów i bez kwot (kwoty pokazuje ekran zakupu, ze sklepu). Wzorzec okien (docs/32, wzorzec 1): „Anuluj” po lewej w nagłówku; strzałka „›” przy przycisku przechodzącym na inny ekran (wzorzec 17) zamiast „→” ze specyfikacji — wybrano zgodność ze wzorcem.
- **Flaga** `seenFairRulesManifest` (tylko `true`, pole opcjonalne stanu, bez zmiany `SCHEMA_VERSION`; migracja usuwa wartości inne niż `true`; stare kopie bez pola = okno jeszcze nie pokazane). Jest w kopii zapasowej. Użytkownik, który pierwszy trening zrobił w stanie `full`, a później przeszedł na `free`, zobaczy okno po pierwszym kolejnym treningu na żywo (warunek „≥ 1 ukończony trening na żywo”, nie „dokładnie pierwszy”).
- **Karta po imporcie CSV** (`app/more/import.tsx`): po udanym imporcie z co najmniej jednym nowym treningiem, tylko `free` przy włączonym `PAYWALL`: nagłówek „Historia jest już w telefonie”, jedno zdanie (historia, rekordy i wykresy zawsze dostępne, także bez internetu; dni darmowe; Pro zdejmuje limit, także jednorazowo) i przycisk „Zobacz plany Pro ›” do ekranu zakupu. Karta znika po wyborze kolejnego pliku. Import przywracający kopię JSON (własne dane użytkownika) karty nie ma — to nie przenosiny z innej aplikacji.
- **Import CSV nie zużywa darmowych dni** (spełnione od 22.10.2026: dni zapisywane osobno w `State.liveDays` tylko przy ukończeniu treningu na żywo; test `CSV-07` w `tests/monetyzacja-csv.test.ts`).
- **Rozszerzony import CSV** (`lib/csvparse.ts`, układ `generic` obok dwóch dotychczasowych): rozpoznanie po aliasach nagłówków (`CSV_ALIASES`, jedno miejsce; wymagane kolumny daty i ćwiczenia, reszta opcjonalna), separator `,` `;` albo tabulator, BOM, pola w cudzysłowach, ciężar w kg albo lb po nagłówku (lb → kg tą samą funkcją co pozostałe układy), typy serii z kolumny albo litery W/D/F w numerze serii, czas treningu z kolumny (sekundy, `HH:MM:ss`, `1h 12m`) albo z końca − startu, trening = dzień przy braku kolumny z nazwą, superserie z kolumny grupy, RIR → RPE = 10 − RIR (jak skala wysiłku w Ustawieniach, Zourdos i in., JSCR 2016), dystans w jednostce z nagłówka (km, mi) albo metry, formaty daty: ISO (także ze strefą), `DD.MM.RRRR`, `D Mon RRRR[, GG:MM]`; daty z ukośnikami są dwuznaczne i wiersz jest pomijany (widoczny w podglądzie jako „Pominięte wiersze”). Ćwiczenia spoza katalogu powstają jako własne. Wszystkie gwarancje bezpieczeństwa danych bez zmian (komentarz na górze `lib/csvimport.ts`). Listy aliasów pochodzą ze specyfikacji właściciela z 24.10.2026 — **nie sprawdzono ich z dokumentacją producentów** (otwarte, docs/21).

### Otwarte pytania (nie twierdzenia w aplikacji)

Liczby i twierdzenia z dokumentu właściciela „Monetyzacja Trening” (24.10.2026), których w repozytorium nie ma ze źródłem — **nie wchodzą do tekstów aplikacji**, dopóki nie zostaną potwierdzone (CLAUDE.md, zasada źródeł):
1. „65–75% nowych pobrań w kategorii fitness nie dociera do 6 dni treningowych w pierwszym miesiącu” — brak źródła.
2. „28 dzienników treningowych na rynku”, „6 115 recenzji z 10 aplikacji”, „22% opinii o pieniądzach, średnia 2,85★”, „skargi na próbę, która sama pobiera opłatę: 1,26★” — dane badania konkurencji; materiały są na Dysku (folder „05 Research konkurencji”), w repozytorium tylko wnioski (`docs/monetyzacja-badanie-2026-10.md`); do sprawdzenia, które liczby tam są.
3. „Ponad 85% użytkowników odrzuca śledzenie (ATT)”, „eCPM po ATT”, „konwersja z ~1,9% do ~0,35–0,55%” — brak źródła w repozytorium; odrzucenie reklam opiera się na rachunku z badania (rozdz. 10–11) i na argumentach architektonicznych (brak SDK reklamowego: `tests/public-repo.test.ts`, „Data Not Collected”).
4. „Cena poniżej espresso” w tekstach **aplikacji** — DEC-24 dopuszcza porównanie na stronie; opis w sklepie ma je z przypisem (źródło MIMIT, `docs/research/espresso-mimit-2026-10.md`). W oknie i karcie nie użyto, bo w aplikacji nie ma miejsca na przypis ze źródłem. **Pytanie do właściciela:** (A) bez porównania w aplikacji — rekomendacja; (B) krótkie porównanie z linkiem „Skąd ta cena?” do strony ze źródłem.
5. Twierdzenia porównawcze z dokumentu („ułamek ceny innych aplikacji”, „bez ukrytych prób, które same pobierają opłatę”) — przeredagowane na zdania o naszej aplikacji (bez porównań; wytyczne Apple 2.3.7, zasada nazw innych firm).

### Opcja właściciela, nie decyzja: Faza 2 cen

Dokument z 24.10.2026 proponuje po zebraniu pierwszych ocen (150–200) podniesienie **samego** planu dożywotniego w App Store Connect (bez zmiany kodu, bo ceny pochodzą ze StoreKit), przy zachowaniu miesięcznego i rocznego. **To nie jest decyzja** — model i ceny pozostają jak w tabeli wyżej; termin i kwotę ustala właściciel po 8-tygodniowym punkcie kontrolnym (bramka W0). Przeciwwaga: każda zmiana ceny wymaga ponownej kontroli ASC (`store/asc-kontrola.json`) i aktualizacji tej tabeli.

### Odrzucony wariant: reklamy (rachunek z dokumentu 24.10.2026)

Wariant „wszystko za darmo + reklamy, Pro bez reklam” odrzucony na podstawie rachunku w badaniu (rozdz. 10–11): przychód netto niższy od M5 S1 w każdym scenariuszu pobrań (według dokumentu o 32–44% w wariancie łagodnym), a ponadto trzy przeszkody architektoniczne — Live Activity, zegarek i zapowiedzi głosowe nie dają odsłon reklam; aplikacja działa offline bez konta, więc reklamy można wyłączyć blokadą sieci; SDK reklamowe łamie `tests/public-repo.test.ts`, wymaga okien zgody i niszczy deklarację „Data Not Collected”. Wyliczenia procentowe pochodzą z dokumentu właściciela (arkusz nie jest w repozytorium).

## Ceny w App Store Connect — oczekiwane (kontrola)

Stan: 21.10.2026 (właściciel). Te kwoty czyta kontrola `store/asc-kontrola.json` (workflow „ASC kontrola ustawień”, tylko odczyt); zgodność tabeli z plikiem pilnuje `tests/asc-kontrola.test.ts`.
Roczna w euro 7,99 € i dożywotnia 17,99 € to przeliczenie Apple z ceny bazowej (decyzje właściciela 21.10.2026), miesięczna 0,99 €; funty jak USD (0,99 / 6,99 / 14,99 £) — stan potwierdzony kontrolą ASC 21.10.2026.

| plan | USA (USD) | Polska (PLN) | strefa euro (EUR) | Wielka Brytania (GBP) |
|---|---|---|---|---|
| miesięczna | 0,99 | 4,99 | 0,99 | 0,99 |
| roczna | 6,99 | 19,99 | 7,99 | 6,99 |
| dożywotnia | 14,99 | 59,99 | 17,99 | 14,99 |

## Stan wdrożenia w kodzie

Zakupy są włączone: `PAYWALL.ENABLED = true` (`lib/access.ts`; w Jest przełącznik jest domyślnie wyłączony w `tests/setup.js`, testy dostępu włączają go jawnie). Ekran zakupu pokazuje się tylko przy starcie treningu ponad limit
i z Ustawień → „Subskrypcja”; na ekranie startu licznik „Pozostało X z 5 darmowych dni treningowych w tym miesiącu”. Plany (nazwy robocze, do przeglądu właściciela): roczny „Training is part of my week”, miesięczny „Still finding my rhythm”, dożywotni „Training is my life”.
Build E2E (sztuczny sklep) ma limit 0 dni (`E2E_FREE_TRAINING_DAYS`), żeby pierwszy start po wygaśnięciu dostępu otwierał ekran zakupu.

## Bramka W0 — opłacalność (21.10.2026)

Bramkę przeprowadziła rola 02 (moduł „opłacalność”) 21.10.2026 na prośbę właściciela; zastępuje wcześniejszy zapis „brak” (K-P4-3). Raport i dane źródłowe (oceny konkurentów, ceny, kursy) są poza repozytorium, w katalogu przebiegu M3 u właściciela.

- **Próg:** 500 USD netto/rok globalnie (po prowizji i VAT; decyzja właściciela 21.10.2026). Koszty pieniężne aplikacji: 0 USD (opłata Apple Developer to koszt portfela).
- **Uwaga 22.10.2026:** poniższy wynik dotyczy modelu z 19.10.2026 (14 dni próby, 4 treningi). Dla M5 S1 rachunek badania (rozdz. 10) daje wynik normalny ok. 471 USD/rok, czyli poniżej progu 500 USD; model wybrany przez właściciela świadomie (decyzja 22.10.2026).
- **Wynik (sam iOS, model stały):** pesymistyczny ok. 4 USD · normalny ok. **570 USD** · optymistyczny ok. 23 tys. USD/rok → werdykt **wydać**, ale tuż nad progiem. Wynik normalny przeliczony niezależnie przez weryfikatora (zgodny).
- **Wrażliwość:** spadek o 25% jednego z głównych założeń (instalacje na ocenę, udział nowej aplikacji w ocenach kategorii, konwersja pobranie → płacący) daje ok. 427 USD („przerobić”). Instalacje na ocenę to założenie bez benchmarku (rozrzut 10×); konwersja z jednego raportu branżowego (szczebel 4) — oznaczenie „jedno źródło”.
- **Prowizja:** liczona 15% (Small Business Program; zgłoszenie złożone 14.10.2026, docs/18). Przy 30% wynik normalny ok. 469 USD. Potwierdzenie przyjęcia przez Apple — krok właściciela.
- **Punkt kontrolny (decyzja właściciela 21.10.2026):** po 8 tygodniach od premiery w App Store Connect (Analityka): **≥ ok. 310 pobrań miesięcznie** albo tempo **≥ 75 płacących rocznie**. Poniżej — przegląd modelu dotarcia i zakresu (nie cen; model stały). Ten sam termin co decyzja o Androidzie (DEC-26).

## Historia (nieaktualne kwoty)

Wcześniejsze ceny i okresy (29 zł/rok, 3 miesiące, 1 miesiąc, 5,99 / 4,99 / 21,99 / 29,99 USD i inne) zostały zastąpione; są w docs/15 (bloki historii) i docs/18 (wpisy z datą). Nie obowiązują.
