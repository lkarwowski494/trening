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

Po sprawdzeniu: zamknij R-005 (razem z pełnym katalogiem E2E na tym SHA) i R-013 w docs/40 (wynik z datą) albo zgłoś wadę. R-RES (kopia ratunkowa) nie ma kroku na telefonie — zamknięte 29.10.2026 przebiegiem na symulatorze (docs/40, run 40862280973). Otwarte ryzyko blokuje wydanie do App Store.

## Metadane en-GB, en-AU, en-CA (przegląd 26.10.2026)

Wersja (`store/app-store-metadata.json`) i nazwy (`app-store-names.json`) kompletne dla wszystkich trzech: nazwa 30 znaków, podtytuł 28, słowa kluczowe 99–100 B, tekst promocyjny 143, opis ok. 3258 (en-AU = en-GB, en-CA = en-US — decyzja 21.10.2026, pilnuje `tests/store-metadata.test.ts`); adresy wspólne (`app-store-urls.json`); zrzuty obejmują en-* (`scripts/asc/zrzuty.mjs`); „What's New” przy pierwszej wersji nie jest wgrywane. Braki: (1) `store/iap-localizations.json` ma tylko en-US i pl — en-GB/AU/CA nie mają nazw i opisów zakupów (ASC zwykle używa lokalizacji głównej; do potwierdzenia przy wgraniu zakupów, niewymagane przez skrypt); (2) podpisy zrzutów EN mają status „propozycja” (nie „zaakceptowane”) — wymagana akceptacja właściciela przed zrzutami.

## Kandydat 1.0 — tylko zmiany od ostatnich testów właściciela (29.10.2026)

Zasada właściciela 29.10.2026 (docs/18): na telefonie i zegarku tylko to, co zmieniło się od jego ostatniego testu (telefon: build 1032, `025a50b`; zegarek: build 1030, `f2b0525`). Diff liczony do `naprawy/M2-hinge-szczelina` (bd2233b4, PR #89) — **powtórzyć na ostatecznym SHA kandydata**; zmiana w obszarach niżej dodaje punkt. Bez zmian od 1032: `targets/`, `modules/`, `plugins/`, `assets/`, `app.json`, `lib/timer.ts`, `lib/voice.ts`, `lib/haptics.ts`, `lib/health*.ts`, `lib/watch/*`; schemat danych 19.

Do sprawdzenia, w tej kolejności (ok. 45–60 min):
1. **Aktualizacja z 1032** (T-01; 2 min) — „Zaktualizuj” w TestFlight, bez usuwania; dane na miejscu, bez błędu danych. Powód: start aplikacji (`lib/state/boot.ts`, `app/_layout.tsx`), `AppText` w całej aplikacji.
2. **Duży tekst** (Z-08, T-04; 8 min) — „Większe rozmiary”, suwak w połowie i na maksimum: ekran Trening w dniu bez treningu, zakładki, Plan, Ustawienia, ekran zakupu, trening w toku (tablica, stoper, RPE); nic nie ucięte. Powód: L-051, 07519d09, a215ec9a, 644c4989, 791d5ab1, b37746aa, 6729c14a, 0311996e, 6577aa6d.
3. **Rysunki** (T-10; 3 min) — martwy ciąg ze sztangą bez rysunku, „Technika” z tekstem; Rack Pull i JM Press bez rysunku i bez pustego „Technika ›”; Smith Machine Bench Press — gryf pionowo; Sumo Deadlift, Step Up, Lunges — tor bez dziwnych łuków. Powód: 9883ada1, dc296f9f, c5bed3b0, 8521780b, 11f342a8, 7243bda8, 31ad7c05.
4. **Zegarek** (T-07, W2-05, T-16, R-013; 8–10 min) — ikona Treningu na siatce (nie pusty krążek) i nazwa w aplikacji Watch; seria odhaczona na zegarku widoczna na telefonie; w przerwie po ostatnim ćwiczeniu raz „Zakończ trening na telefonie”; wibracja na koniec przerwy przy opuszczonej ręce (Test F z docs/47). Powód: c8346e35, 22fb470e, przekłady etykiet; R-013 otwarte.
5. **Zakupy w piaskownicy** (T-11, US-13, Z-09; 15–25 min) — „Zobacz plany Pro”, zakup planu (cena, brak oferty próbnej), „Masz plan: …” z datą, „Zmień plan” zwinięte, „Zarządzaj subskrypcją” — arkusz Apple w aplikacji i osobny element VoiceOver, uwaga przed zakupem dożywotniego przy aktywnej subskrypcji, tryb samolotowy po ponownym uruchomieniu — dostęp zostaje. Powód: 72338f01, 1a96768a, 5bbc84ad, f775eb5c, ee43b827, a90cabae, dbfa3cd4, 8c12be9e, 71a0e416.
6. **Ponowna instalacja i szybkie zamknięcie** (T-15, R-005; 5–7 min) — eksport kopii, usunięcie, instalacja z TestFlight, otwarcie i natychmiastowe zamknięcie dwa razy (bez „Coś poszło nie tak”), „Przywróć zakupy”, import kopii. Powód: R-005, c85b71b2, 8f3fb6fe.
7. **Warunkowo: odliczanie przerwy na ekranie blokady w języku aplikacji** (PR-17, T-02; 1 min) — tylko jeśli nie sprawdzone na 1032 (brak zapisu w docs/18); en „Rest”, de „Pause”. Powód: 168fc797.

Pominięte (bez zmian kodu od ostatniego testu): T-03 i PR-12 (tryb skupienia, ekran blokady; R-004 zamknięte na 1032), T-04 „Pogrubiony tekst” (R-014 zamknięte na 1032), T-05/T-06 Zdrowie, T-09 „Wyczyść wszystkie dane”, T-12 kopia i CSV, T-13 i ZD-01 głos i dźwięk, T-14 „Napisz do nas”, T-08 okno „Pierwszy trening” (konto właściciela już z subskrypcją; pokrywa E2E 56), ZD-02 instalacja, ZD-03 VoiceOver poza ekranem zakupu. Zwrot i Chmura rodzinna w Z-09 pominięte (decyzja właściciela 29.10.2026, A; docs/18).
