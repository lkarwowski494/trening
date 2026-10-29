# 49. TestFlight 1.0 — „What to Test” i lista „tylko telefon” (przygotowane 26.10.2026)

Lista na build wydania 1.0. Rzeczy, których nie sprawdzi E2E na symulatorze (docs/39, otwarte ryzyka R-004 i R-014 z docs/40). Wady zgłaszaj numerem punktu (np. „T-07”).
Czas: ok. 15–20 min bez zakupów; zakupy w piaskownicy dodatkowo ok. 10–15 min. Kolejność dowolna, ale zakupy (T-10) rób po reszcie.

## „What to Test” (pole w TestFlight, PL, krótko)

```text
Wersja 1.0. Sprawdź na telefonie: (1) przerwa z zablokowanym ekranem — baner, wibracja, Live Activity w języku aplikacji; (2) tryb skupienia — czy koniec przerwy daje baner; (3) „Pogrubiony tekst” w iOS — czy tekst w aplikacji robi się grubszy; (4) Zdrowie: zapis i odczyt; (5) zegarek; (6) zakup w piaskownicy każdego planu, „Przywróć zakupy”, tryb samolotowy; (7) okno „Pierwszy trening za Tobą!” i link „indeks espresso”; (8) Więcej → Ustawienia → „Wyczyść wszystkie dane”; (9) figury ćwiczeń ze sztangą (talerze). Wadę zgłoś zrzutem ekranu przez TestFlight.
```

## Lista kontrolna

Sprawdzenia:

- [ ] **T-01 Instalacja (ZD-02, AK-05).** Zaktualizuj z poprzedniego buildu (albo zainstaluj): ikona i nazwa poprawne, animacja startowa krótka, w nagłówku ekranu Trening nie ma przycisku „Co nowego” ✦ (1.0: historia wyczyszczona, decyzja 14.10.2026), historia i szablony na miejscu, brak komunikatu o błędzie danych.
- [ ] **T-02 Ekran blokady w języku aplikacji (PR-12, PR-17).** Zacznij trening, odhacz serię (przerwa 2:00), zablokuj ekran: odliczanie w Live Activity, w 2:00 baner, dźwięk i wibracja. Telefon po polsku, aplikacja Więcej → Język → English: etykieta „Rest”, nie „Przerwa”. Zmień język na Deutsch, zablokuj ponownie: „Pause”. Zmień przerwę w trakcie: Live Activity się zmienia.
- [ ] **T-03 Powiadomienia pilne (R-004).** Ustawienia iOS → Trening → Powiadomienia: jest „Powiadomienia pilne”. Włącz tryb skupienia, który wycisza Trening, zacznij przerwę 1 min, zablokuj ekran: koniec przerwy daje baner (wibracja bez banera = wada; opis diagnozy: docs/47, Test C). Wynik wpisz przy R-004.
- [ ] **T-04 „Pogrubiony tekst” (R-014).** Ustawienia iOS → Dostępność → Rozmiar wyświetlania i tekstu → Pogrubiony tekst. Wróć do aplikacji (zrestartuj ją): treść, przyciski i nagłówki mają być wyraźnie grubsze niż bez opcji. Gdy bez różnicy — wada (przesunięcie wagi w `font()`). Przy okazji największy rozmiar tekstu: trening, plan i ustawienia bez ucięć (ZD-03), także ekran Trening w dniu bez treningu w planie — stan „dziś bez treningu”: ikona startu kolejnego treningu w całości widoczna (M1-audytor-generalny-011).
- [ ] **T-05 Zdrowie, zapis (US-08).** Więcej → Ustawienia → „Zapisuj zakończone treningi do Apple Health”: zezwól w arkuszu, zrób krótki trening, Zdrowie → Przeglądaj → Aktywność → Trening siłowy: jeden wpis. Odmowa zgody: komunikat, przełącznik zostaje wyłączony.
- [ ] **T-06 Zdrowie, odczyt (US-10).** „Pokazuj dane z Apple Health”, zezwól: dzień z aktywnością w Planie pokazuje kroki itd.; sesja z treningiem z zegarka pokazuje tętno i kcal; wyłącz odczyt: linie znikają.
- [ ] **T-07 Zegarek (W2-05).** Trening na iPhonie: zegarek pokazuje ćwiczenie, serię, ciężar i powtórzenia; odliczanie przerwy z wibracją na końcu; bez treningu na telefonie „Zacznij trening na telefonie”.
- [ ] **T-08 Okno „Pierwszy trening za Tobą!” i link espresso.** Konto bez zakupu, pierwszy trening na żywo do końca (> 7 min): po podsumowaniu pojawia się okno (raz). „Skąd ta cena? Poznaj indeks espresso.” otwiera stronę w przeglądarce i strona się ładuje; „Zobacz plany Pro ›” otwiera ekran zakupu; „Super, trenuję dalej!” zamyka okno. Okno nie wraca po kolejnym treningu.
- [ ] **T-09 „Wyczyść wszystkie dane”.** Najpierw Więcej → Kopia zapasowa → eksport kopii (zapas). Potem Ustawienia, dół: „Wyczyść wszystkie dane” → potwierdzenie: ćwiczenia, szablony i historia znikają, ustawienia wracają do domyślnych, w Plikach → Trening → Backup jest nowy plik kopii. Zaimportuj ten plik: dane wracają.
- [ ] **T-10 Figury ze sztangą (talerze).** Otwórz ćwiczenie ze sztangą w treningu i w bibliotece: figura ma gryf i talerze, proporcje i kolory czytelne w trybie jasnym i ciemnym; z „Ogranicz ruch” nic nie miga.
- [ ] **T-11 Zakup w piaskownicy (US-13), konto testowe Apple.** (a) Dla każdego z trzech planów (miesięczny, roczny, dożywotni): arkusz Apple pokazuje właściwą cenę i brak oferty próbnej; po zakupie wiersz Więcej → Ustawienia → Subskrypcja ma tytuł „Masz plan: miesięczny” / „Masz plan: roczny” z podpisem „Dostęp do {data}” albo „Masz plan: dożywotni” z „Masz dostęp na zawsze”. Zakup kolejnego planu wymaga odnowy konta testowego albo osobnego konta. (b) Usuń aplikację, zainstaluj ponownie, „Przywróć zakupy”: dostęp wraca. (c) Tryb samolotowy po zakupie: dostęp zostaje. (d) Bez zakupu: Więcej → Ustawienia → Subskrypcja → „Zobacz plany Pro” otwiera ekran zakupu z linkami do polityki i warunków, „Zrealizuj kod” otwiera okno Apple.
- [ ] **T-12 Kopia i CSV (DA-02, DA-06).** Eksport kopii i CSV przez arkusz udostępniania do Plików; import tej samej kopii: dane identyczne. Import CSV: podgląd, dopisanie bez usuwania; w stanie darmowym karta „Historia jest już w telefonie” z „Zobacz plany Pro ›”.
- [ ] **T-13 Głos (W2-04).** AirPods + muzyka: odhacz serię, zapowiedź następnego ćwiczenia w słuchawkach, muzyka ściszona i wraca; bez słuchawek cisza.
- [ ] **T-14 „Napisz do nas” (US-15).** Otwiera wiadomość z adresem wsparcia i wersją 1.0.
- [ ] **T-15 Szybkie zamknięcie po starcie (R-005).** Usuń aplikację i zainstaluj build z TestFlight, otwórz ją, od razu wyjdź i zamknij ją z przełącznika aplikacji, otwórz ponownie (dwa razy pod rząd): bez ekranu „Coś poszło nie tak”, dane i ustawienia są.
- [ ] **T-16 Ikona na zegarku (R-013).** Na Apple Watch po instalacji z TestFlight: ikona Treningu na siatce aplikacji (nie pusty krążek) i nazwa w aplikacji Watch na iPhonie.

Po sprawdzeniu: zamknij R-005 (razem z pełnym katalogiem E2E na tym SHA) i R-013 w docs/40 (wynik z datą) albo zgłoś wadę. R-RES (kopia ratunkowa) nie ma kroku na telefonie — zamknięte 29.10.2026 przebiegiem na symulatorze (docs/40, run 40858680407). Otwarte ryzyko blokuje wydanie do App Store.

## Metadane en-GB, en-AU, en-CA (przegląd 26.10.2026)

Wersja (`store/app-store-metadata.json`) i nazwy (`app-store-names.json`) kompletne dla wszystkich trzech: nazwa 30 znaków, podtytuł 28, słowa kluczowe 99–100 B, tekst promocyjny 143, opis ok. 3258 (en-AU = en-GB, en-CA = en-US — decyzja 21.10.2026, pilnuje `tests/store-metadata.test.ts`); adresy wspólne (`app-store-urls.json`); zrzuty obejmują en-* (`scripts/asc/zrzuty.mjs`); „What's New” przy pierwszej wersji nie jest wgrywane. Braki: (1) `store/iap-localizations.json` ma tylko en-US i pl — en-GB/AU/CA nie mają nazw i opisów zakupów (ASC zwykle używa lokalizacji głównej; do potwierdzenia przy wgraniu zakupów, niewymagane przez skrypt); (2) podpisy zrzutów EN mają status „propozycja” (nie „zaakceptowane”) — wymagana akceptacja właściciela przed zrzutami.
