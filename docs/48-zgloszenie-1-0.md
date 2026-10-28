# 48. Zgłoszenie wersji 1.0 do App Store — szkic kompletu (stan 25.10.2026)

Szkic przygotowany na polecenie właściciela (25.10.2026, plan na noc): po zakończeniu prac w toku (grafiki ćwiczeń, monetyzacja w 1.0, przekład 33 języków)
ma zostać tylko uzupełnienie i kliknięcia właściciela. **Niczego nie wysłano do Apple**, nie zmieniono plików w `store/` ani testów — poniższe teksty to propozycje do decyzji.
Dokument nie powtarza kwot ani zasad modelu płatności: tylko `docs/monetyzacja.md`. Poprzednie plany: `docs/41` (droga do sklepu), `docs/42` (plan wydania), `docs/45-formalnosci-asc.md`, `docs/45-widocznosc-w-sklepie.md`;
ten plik je porządkuje na dzień zgłoszenia i uzupełnia o pozycje, których tam nie było (patrz „Nowe względem docs/41” niżej).

Wszystkie adresy Apple w tym dokumencie zostały **przeczytane 25.10.2026** (zasada L-028: krok dla właściciela ma źródło sprawdzone u źródła, nie z pamięci).
Gdzie dokumentacja Apple czegoś nie mówi, jest to napisane wprost i oznaczone **[OTWARTE]**.

## Decyzje właściciela (25.10.2026, po przeczytaniu szkicu)

| # | Decyzja | Skutek |
|---|---|---|
| D1 | Pełny audyt przed App Store obowiązuje (CLAUDE.md) | Z-03 zostaje; audyt obejmuje całość, nie tylko zmiany po audycie M1 |
| D2 | Zrzuty wgrywa skrypt z workflow; wyjątek od L-001 jak przy przekładzie (workflow tylko ręczny: scalenie, potem przebieg dowodowy, przy porażce cofnięcie) | gotowe: `.github/workflows/asc-zrzuty.yml`, `scripts/asc/zrzuty.mjs`, `tests/asc-zrzuty.test.ts` — **apply nieuruchomiony**; pierwszy przebieg po scaleniu to dry-run (Z-16) |
| D3 | 10 ekranów, karta ćwiczenia z grafiką jako drugi | pkt 5, ekran `cwiczenie` (po wejściu grafik) |
| D4 | Opis z trzema wyróżnikami (grafiki, sprawdzone wskazówki, import); PL i EN do akceptacji właściciela; wchodzi, gdy funkcje są w kodzie | pkt 6; brzmienie zdań o pokryciu dopiero po sprawdzeniu w kodzie |
| D5 | „Data Not Collected” | pkt 3, wariant B tylko jako zapas |
| D6 | Deklaracja wyrobu medycznego: „No” | Z-22 |
| D7 | Zrzuty dla wszystkich lokalizacji | Z-16: wszystkie 33 lokalizacje z `store/app-store-names.json` (bez `sl`, L-003; języki bg, et, lt, lv, sr nie mają lokalizacji w sklepie) |

**Uwaga o interfejsie Apple (odczyt 25.10.2026):** dokumentacja App Store Connect API oznacza `appScreenshotSets` i `appScreenshots` jako **przestarzałe**; zrzuty zarządza się przez App Asset Library
(<https://developer.apple.com/documentation/appstoreconnectapi/app-asset-library>, <https://developer.apple.com/documentation/appstoreconnectapi/uploading-and-managing-image-assets>,
<https://developer.apple.com/documentation/appstoreconnectapi/placing-assets-on-your-app-store-surfaces>). Skrypt używa nowego interfejsu: obraz wgrywany raz do biblioteki, potem „placement” na lokalizacji wersji i jedno żądanie kolejności.
Grupę urządzeń wybiera z danych referencyjnych API na podstawie dokładnych wymiarów pliku. **[OTWARTE]**: nazwy pól danych referencyjnych (`featureId`, `groupLimits`) skrypt czyta zgodnie z dokumentacją, ale
bez sieci nie sprawdziłem ich na prawdziwej odpowiedzi — rozstrzygnie pierwszy przebieg **dry-run** (tylko odczyt, bezpieczny) i ewentualna poprawka przed `apply`.
Skrypt nie usuwa: grupa, która ma już zrzuty, jest pomijana (zmiana zrzutów w gotowej lokalizacji — ręcznie w App Store Connect).

## 0. Stan wyjściowy i zależności

- `main` (928d0ff, 25.10.2026): `tests.yml` zielony. Wersja aplikacji w `app.json`: 0.20.0 (wersja 1.0.0 dopiero w kroku Z-05).
- W toku na innych gałęziach (stan z `docs/18`, wpisy 25.10.2026; grafiki ćwiczeń dla całej biblioteki przeniesione do 1.1 — 26.10.2026): monetyzacja w 1.0 (gałąź `monetyzacja-1-0`: okno „Uczciwe zasady”, karta po imporcie, rozszerzony import CSV),
  słownik terminów i przekład 33 języków przez API, przywrócony przełącznik trybu w generatorze (DEC-03), ostrzeżenie o asekuracji przy hantlach nad głową (DEC-08), partia 2 audytu (m.in. polityka prywatności bez okresu próbnego).
  **Zamrożenie zakresu 1.0 jest przesunięte** (decyzja 25.10.2026), nowy termin zgłoszenia — do ustalenia po tych pracach.
- Są już gotowe narzędzia: `asc-metadane.yml` (nazwy, podtytuły, słowa kluczowe, opisy, teksty promocyjne, adresy — 33 lokalizacje), `asc-iap-localizations.yml` (lokalizacje zakupów), `asc-kontrola.yml` (tylko odczyt: ceny, oferty,
  rodzina, kategoria, adresy), `store-screenshots.yml` (zrzuty iPhone z symulatora, ramki i podpisy), `watch-sim.yml` (zrzuty zegarka), `testflight.yml` (build i wysyłka).
  Skrypt wgrywający zrzuty (`asc-zrzuty.yml`) powstał 25.10.2026 po decyzji D2 — patrz „Decyzje właściciela” i pkt 5.
- Rozbieżność w starych dokumentach: `docs/41` (A7, E1) mówi o buildzie 1.0 z nowego repo Apps4Brew, a decyzja D7 z 21.10.2026 (`docs/46`) mówi, że przeniesienie następuje **po wydaniu 1.0 w App Store**.
  Ten dokument zakłada D7: zgłoszenie idzie ze starego repo (`lkarwowski494/trening`). `docs/41` trafia na Dysk przy przenosinach (D1), więc nie poprawiam go teraz.

### Nowe względem docs/41 (znalezione przy czytaniu dokumentacji Apple 25.10.2026)

1. **Deklaracja wyrobu medycznego (Regulated Medical Device)** — aplikacje w kategorii Health & Fitness dostępne w UE/EOG, Wielkiej Brytanii lub USA muszą zadeklarować, czy są regulowanym wyrobem medycznym (krok Z-22; odpowiedź: **Nie**).
2. **Etykiety dostępności (Accessibility Nutrition Labels)** — na razie dobrowolne; można je opublikować dopiero dla urządzenia, które ma wersję dostępną w sklepie, czyli **po wydaniu** (krok Z-33).
3. **Rozmiary zrzutów** — Apple dodał akceptowane rozmiary 1260 × 2736 (duży ekran) oraz sekcję iPhone Duo (wymóg dopiero od kwietnia 2027, dla SDK iOS 27.1 — nie dotyczy 1.0); ustalone rozmiary 1206 × 2622 i 1320 × 2868 nadal obowiązują.
4. **Cena aplikacji** — przed zgłoszeniem trzeba ustawić cenę aplikacji (darmowa) w „Pricing and Availability”; płatne treści wymagają przyjęcia Paid Apps Agreement (Z-14).

## 1. Lista kontrolna zgłoszenia krok po kroku

Podział: **automat** = workflow GitHub Actions (uruchamia agent lub właściciel jednym kliknięciem „Run workflow”, zatwierdzenie środowiska `release` zawsze klika właściciel),
**agent** = praca w repo, **właściciel** = czynność w App Store Connect / na telefonie. Czasy: „agent” = praca agenta; „czekanie” = CI i Apple; „właściciel” = jego czas (CLAUDE.md).
Właściciela prowadzimy po jednym kroku, nie zbiorczą listą (CLAUDE.md); poniższa tabela to mapa, nie instrukcja do jednorazowego przeczytania.

### Faza A — gotowy produkt i dowody (bez App Store Connect)

| # | Krok | Kto | Zależy od | Czas | Uwagi |
|---|---|---|---|---|---|
| Z-01 | Zakres 1.0 zamknięty i scalony do `main` (monetyzacja, przekład, DEC-03, DEC-08, partia 2 audytu; nowe grafiki ćwiczeń przeniesione do 1.1 — docs/18, 26.10.2026) | agent + właściciel (scalenie PR) | prace w toku | zależy od prac | po scaleniu zakres znów zamrożony (CLAUDE.md, audyty pkt 3) |
| Z-02 | Ostatni przegląd treści krytycznej po przekładzie (zamyka R-010, pkt 7) | agent (rola tłumacz / badacz) | przekład 33 języków | 1–2 h agenta | musi być **po** ostatniej zmianie tekstów |
| Z-03 | Audyt zmian od audytu M1 (decyzja D1 niżej) | agent (audytor) | Z-01 | 2–4 h agenta | próg: tylko KRYTYCZNE i WYSOKIE blokują |
| Z-04 | `npm run verify` zielony na commicie wydania (`tests.yml`) | automat | Z-01 | CI ok. 25 min | dziś `main` zielony |
| Z-05 | Wersja 1.0.0 w `app.json`, „Co nowego” wyczyszczone, wiersz w dzienniku wydań docs/09 | agent | Z-01 | 0,5–1 h | pole „What's New” nie dotyczy pierwszej wersji (Apple, pkt 8) |
| Z-06 | **Jeden pełny katalog E2E** na standardowym iPhonie zielony (jedno ponowienie scenariusza dozwolone) — bramka App Store | automat | Z-05 | CI ok. 1,5 h | **dziś czerwony**: nocne przebiegi pełne na `main` padły 23, 24 i 25.10 (gałąź `naprawa-nocne-2026-10-25` w toku); do ustalenia, czy to błąd aplikacji, czy skryptów (CLAUDE.md) |
| Z-07 | Build 1.0 na TestFlight: `testflight.yml` (numer buildu = 1000 + numer przebiegu) | automat; właściciel zatwierdza środowisko `release` | Z-04, Z-06 | CI ok. 1,5 h | strażnik uprawnień, manifest prywatności i mapa źródeł są krokami przebiegu |
| Z-08 | Lista kontrolna z telefonu (`docs/39`, ok. 15–20 min) + R-004, R-013, R-014 (pkt 7) | właściciel | Z-07 | 20–30 min | od razu po buildzie (CLAUDE.md, model po L-001, pkt 3) |
| Z-09 | Zakup w piaskownicy: każdy plan, przywrócenie, tryb samolotowy, zwrot, Chmura rodzinna (docs/39 US-13) | właściciel | Z-07 | 30–45 min | Apple: aplikacja z TestFlight sama działa w środowisku testowym, **bez** osobnego konta Sandbox (strona 1 poniżej); konto Sandbox służy tylko do scenariuszy specjalnych |
| Z-10 | `asc-kontrola.yml` zielone (ceny, brak ofert wprowadzających, rodzina, kategoria, adresy) | automat | — | CI kilka minut | zamyka R-M5-3 przy każdym zgłoszeniu; uruchomić tuż przed Z-26 |
| Z-10a | Adresy z aplikacji i z `store/app-store-urls.json` (prywatność, wsparcie, espresso, EULA, marketing) zwracają 200, a treść stron na apps4brew.com = `site/`, w tym znacznik wersji: workflow „Sprawdzenie adresów (ręcznie)” (`check-urls.yml`, skrypt `scripts/check-urls.mjs`). Po zmianie `site/` najpierw eksport do repo strony (`scripts/site/eksport-apps4brew.mjs`), push w apps4brew-www, potem ten krok | automat (agent uruchamia) | Z-05 | kilka minut | zamyka ryzyko R-017 (docs/40); **nie** w `npm run verify` (verify działa offline); uruchomić po każdej zmianie `site/` i tuż przed Z-26 |
| Z-10b | **Ceny planu miesięcznego we wszystkich krajach wobec porównania z espresso** (02-monetyzacja-506, DEC-07 b 27.10.2026): App Store Connect → Subskrypcje → plan miesięczny → „Subscription Prices” → „View all prices” (nazwy pól [DO USTALENIA] przy pierwszym przejściu) → zrzut albo eksport listy do scratchpadu koordynatora (nie do repo); agent przelicza każdą cenę na EUR (kurs referencyjny EBC z dnia, data w zapisie) i porównuje z **1,51 €** (górna granica przedziału z przypisu opisu) | właściciel (eksport, ok. 5 min) + agent (porównanie) | Z-10 | ok. 5 min właściciela, 0,5 h agenta | wynik z datą w `docs/research/espresso-mimit-2026-10.md`: wszystkie ≤ 1,51 € albo lista krajów do korekty (inny punkt cenowy albo zdanie z przypisem usunięte w lokalizacji tego kraju — decyzja właściciela); rozszerzenie `asc-kontrola` o wszystkie terytoria — 1.0.x (docs/21) |

Strony Apple dla Z-09: <https://developer.apple.com/help/app-store-connect/test-a-beta-version/testing-subscriptions-and-in-app-purchases-in-testflight/> („Apps downloaded from TestFlight will automatically operate in a sandbox environment.”, odczyt 25.10.2026).

### Faza B — App Store Connect (kroki właściciela, każdy z adresem Apple)

Wszystkie kroki w <https://appstoreconnect.apple.com> → Apps → Trening. Rola potrzebna do większości: Account Holder, Admin lub App Manager (strony poniżej).

| # | Krok | Kto | Strona Apple (odczyt 25.10.2026) | Czas właściciela |
|---|---|---|---|---|
| Z-11 | Umowy: Paid Apps Agreement przyjęta, dane bankowe i podatkowe uzupełnione (bez tego aplikacja może być tylko darmowa, a zakupy nie ruszą) | właściciel | <https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements/> oraz <https://developer.apple.com/help/app-store-connect/manage-app-pricing/set-a-price/> („your membership Account Holder will need to accept the Paid Apps Agreement”) | 5 min (sprawdzenie; zapewne zrobione przy zakupach 14.10.2026) |
| Z-12 | Small Business Program: potwierdzenie przyjęcia zgłoszenia z 14.10.2026 (prowizja w `docs/monetyzacja.md`) | właściciel | <https://developer.apple.com/app-store/small-business-program/> | 3 min |
| Z-13 | Wersja 1.0 w stanie „Prepare for Submission” istnieje (pasek boczny → wersja iOS); numer wersji = 1.0 | właściciel | <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/> („Version Number”); dla późniejszych wersji: <https://developer.apple.com/help/app-store-connect/update-your-app/create-a-new-version/> | 2 min |
| Z-14 | **Metadane przez workflow**: GitHub → Actions → „ASC metadane sklepu” → tryb `podglad`, potem `zapis` → „Review deployments → release → Approve” | automat + właściciel (zatwierdzenie) | procedura: `docs/15`, „Wgranie opisów i nazw do App Store Connect”; limity pól: <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/> (opis 4000 znaków, tekst promocyjny 170, słowa kluczowe 100 bajtów) | 5 min |
| Z-15 | Ręcznie w polach, których workflow nie wypełnia: **Copyright** („2026 …”, imię i nazwisko sprzedawcy; nie wpisujemy do repo), Marketing URL (opcjonalny) | właściciel | to samo (wiersz „Copyright”: „This property is required”) | 2 min |
| Z-16 | **Zrzuty ekranu** — wgranie do każdej lokalizacji (iPhone + Apple Watch), po akceptacji zestawu (pkt 5; warunki i kroki koordynatora: pkt 5 ppkt 6 — EN zaakceptowane, przekłady zrecenzowane, decyzja o podpisie pierwszego ekranu) | automat: `asc-zrzuty.yml` (dry-run, potem apply za `release`); właściciel zatwierdza | <https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/> | 5 min (zatwierdzenie `release`); ręcznie tylko zamiana zrzutów w lokalizacji, która już je ma |
| Z-17 | **Prywatność aplikacji**: „No, we do not collect data from this app” → Publish (uzasadnienie i ryzyko: pkt 3) | właściciel (wpisane 14.10.2026; zweryfikować, że opublikowane) | <https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/> | 3 min |
| Z-18 | **Adres polityki prywatności** i adres wsparcia (z `store/app-store-urls.json`); strony muszą być opublikowane w wersji zgodnej z 1.0 | właściciel + agent | ta sama strona co Z-17 („Entering privacy policy information”) oraz Support URL w platform-version-information | 3 min; agent sprawdza treść `site/privacy.html` (test `audit-m1-013`) |
| Z-19 | **Ocena wieku**: kwestionariusz (pkt 4), wynik oczekiwany 9+, „Age Categories and Override” = Not Applicable | właściciel | <https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/> | 5 min |
| Z-20 | Kategoria główna Health & Fitness; brak kategorii dodatkowej (`docs/45-widocznosc`) | właściciel (wpisane) | App Information; pola wymagane: <https://developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/> | 1 min |
| Z-21 | **Cena aplikacji: darmowa**; dostępność (kraje) | właściciel | <https://developer.apple.com/help/app-store-connect/manage-app-pricing/set-a-price/> (cena przed zgłoszeniem) oraz <https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store/> | 5 min |
| Z-22 | **Regulated Medical Device**: „Declare Regulated Medical Device” → **No** (aplikacja nie jest wyrobem medycznym; Apple: jeśli aplikacja „doesn’t provide any health or medical features, or access health data to support non-health features, you should select No” — nasza aplikacja korzysta ze Zdrowia, ale nie diagnozuje i nie leczy; patrz uwaga niżej) | właściciel (Account Holder lub Admin) | <https://developer.apple.com/help/app-store-connect/manage-app-information/declare-regulated-medical-device-status/> | 3 min |
| Z-23 | Status tradera (DSA) — zweryfikowany przez Apple 20.10.2026 (docs/18); sprawdzić, że stan nadal „zweryfikowany” | właściciel | <https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/> | 2 min |
| Z-24 | **Zakupy**: dla każdego z trzech produktów komplet (lokalizacje 33 języków — workflow `asc-iap-localizations.yml` tryb `apply`, zrzut ekranu do przeglądu, notatka subskrypcji z `store/review-notes.md`); produkty w stanie gotowym do zgłoszenia | automat + właściciel | <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase/> i <https://developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/> (sekcje In-App Purchase / Auto-renewable subscription information) | 10 min |
| Z-25 | **App Review Information**: kontakt (imię, telefon w formacie międzynarodowym, e-mail — tylko w App Store Connect), Sign-in required **wyłączone**, Notes = wersja EN (pkt 2, limit 4000 bajtów) | właściciel wkleja, agent przygotowuje tekst | <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/> (sekcja „App Review information”) | 5 min |
| Z-25b | **Bramka wydania (agent)**: `npm run check:release` = kod 0 na commicie kandydata — wyjątek anonimizacji pusty (R-015) i rejestr ryzyk docs/40 bez otwartych pozycji (każda zamknięta z dowodem, zaakceptowana, odroczona decyzją właściciela z datą albo „sprawdzenie po wydaniu”; M1-audytor-generalny-012); kod 1 = zgłoszenia nie robić | agent | `scripts/ci/blokada-wydania.mjs` | 1 min |
| Z-25a | **Wygaszenie starszych buildów 1.0 w TestFlight** (M1-audytor-generalny-008): TestFlight → iOS → build 1031 i 1032 (oraz każdy inny 1.0 poza kandydatem) → „Expire Build”; wtedy w Z-26 nie da się wybrać złego buildu | właściciel | <https://developer.apple.com/help/app-store-connect/test-a-beta-version/manage-builds/> | 2 min |
| Z-26 | **Build do wersji** — Kandydat: build — · SHA — (przed zgłoszeniem agent wpisuje numer z tagu `v1.0.0-bNNNN` na SHA zatwierdzonym w reaudycie M1 i ten sam wiersz w docs/09; test `tests/audit-m1-2026-10-27-008-build-do-zgloszenia.test.ts`): pasek boczny → wersja → sekcja Build → „+” → wybór buildu **o tym numerze** z TestFlight → Done → Save; jeśli „Missing Compliance”, odpowiedzi eksportowe (w aplikacji `ITSAppUsesNonExemptEncryption = false`, pytanie nie powinno się pojawić) | właściciel | <https://developer.apple.com/help/app-store-connect/manage-builds/choose-a-build-to-submit/> | 2 min |
| Z-27 | **Opcja wydania: ręcznie** („Manual” — po akceptacji status „Pending Developer Release”; D-5 A) | właściciel | <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/> (wiersz „Version Release Settings”) | 1 min |
| Z-28 | **Zakupy w tym samym zgłoszeniu co wersja**: pierwsza subskrypcja i pierwszy zakup jednorazowy muszą iść z nową wersją aplikacji; subskrypcje razem z grupą | właściciel | <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase/> („must be submitted with a new app version”) | w Z-29 |
| Z-29 | **„Add for Review” → wybór: nowe zgłoszenie → dodanie produktów → „Submit for Review”** | właściciel | <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/> | 10 min |

Uwagi do kroków:
- **Z-22:** dokumentacja Apple mówi, że deklarację składają aplikacje w kategorii Health & Fitness lub Medical albo z odpowiedzią „frequent” w polu Medical or Treatment Information; zdanie o „No” dotyczy aplikacji bez funkcji zdrowotnych albo korzystających ze zdrowia dla funkcji niezdrowotnych.
  Nasza aplikacja ma funkcje treningowe (kategoria Health & Fitness) i nie rości sobie diagnozowania ani leczenia (odsyła do lekarza; 1.4.1 dotyczy aplikacji diagnostycznych); wybór **No** jest więc właściwy,
  ale to **deklaracja prawna właściciela** — jeśli chcesz, agent zbierze przed klikiem kryteria z tej strony (certyfikaty, rejestracje) i potwierdzi, że żadne nie zachodzi. **[Do akceptacji właściciela]**
- **Z-25 (kontakt recenzenta):** Apple wymaga imienia, e-maila i telefonu; nie wpisujemy ich do repozytorium publicznego (CLAUDE.md).
- **B7 (zegarek a zakupy):** Apple: „In-App Purchases and subscriptions aren't supported on Apple Watch. To submit an Apple Watch app version, remove all in-app purchases and subscriptions from the submission.” Nasz zegarek jest częścią aplikacji iOS
  (jedna wersja iOS ze zgłoszonym zegarkiem), więc spodziewamy się, że zakupy w zgłoszeniu wersji iOS są poprawne — **[OTWARTE]**: dokumentacja nie rozstrzyga wprost przypadku aplikacji towarzyszącej; rozstrzygnie zachowanie Z-29 (komunikat błędu przy dodawaniu).
  Jeśli ASC zgłosi konflikt, plan awaryjny: zgłosić wersję iOS (zegarek jako część paczki) tak, jak w opisie powyżej, a przy odrzuceniu — pytanie w Resolution Center; nie zmieniamy architektury zegarka na zgadywanie. Wpis do rejestru ryzyk — pkt 7.

### Faza C — po zgłoszeniu

| # | Krok | Kto | Uwagi |
|---|---|---|---|
| Z-30 | Recenzja Apple; odpowiedzi w sekcji App Review (Resolution Center) | Apple; agent przygotowuje odpowiedź, właściciel wysyła | czas recenzji **[OTWARTE]** (docs/41 F2 — brak źródła); status zgłoszenia: <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/overview-of-submitting-for-review/> |
| Z-31 | Po akceptacji: ten sam build z TestFlight na telefonie, lista docs/39 (ok. 15–20 min), potem **„Release this version”** w dniu, w którym gotowe są wpisy w społecznościach (docs/42 pkt 2) | właściciel | wada → wiadomość do agenta z numerem punktu; „Release” czeka |
| Z-32 | Po wydaniu: sprawdzenie, że aplikacja instaluje się z App Store; tag `v1.0.0-b<numer>` założony przez właściciela w GitHubie (sesja nie wypycha tagów); wiersz „Wydanie” w docs/09 i wpis w docs/18; przeniesienie do Apps4Brew (D7, `docs/46`) | właściciel + agent | tag w tym samym commicie co wiersz dziennika wydań |
| Z-33 | Etykiety dostępności (opcjonalne, dobrowolne na dziś) — dopiero po wydaniu | właściciel | <https://developer.apple.com/help/app-store-connect/manage-app-accessibility/manage-accessibility-nutrition-labels/> („You can only publish support for devices that have a live version on the App Store.”); lista funkcji i odpowiedzi — osobne zadanie agenta po audycie VoiceOver/Larger Text (nie zgadujemy) |
| Z-36 | Po wydaniu, pierwszy dzień: ekran zakupu w wersji z App Store (polskie konto, bez piaskownicy) pokazuje 4,99 zł / 19,99 zł / 59,99 zł, jak arkusz Apple — zamyka ryzyko R-WAL (docs/40, `docs/waluta-ekranu-zakupu-1031.md`) | właściciel (telefon, 2 min) | USD przy sklepie PL w produkcji = WYSOKIE |
| Z-34 | Pierwsza aktualizacja (1.0.1): wydanie stopniowe 7 dni | właściciel | <https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/> (docs/42 pkt 3) |
| Z-37 | **Test pierwszego użycia z 3–5 osobami bez instrukcji** (03-zakres-008, DEC-07 b 27.10.2026; część B — część A, przejście poznawcze agenta, zrobiona przed 1.0): nowa instalacja, 5 zadań pętli z kartki, nagranie ekranu u właściciela (nie w repo); protokół i miejsce na wynik: `docs/design/test-pierwszego-uzycia.md` | właściciel (ok. 1 h łącznie); agent opracowuje wynik | Z-32 | ok. 1 h właściciela | przed punktem kontrolnym Z-35; porażki → znaleziska SP dla roli 04; pytania otwarte z części A: nazwa zakładki „Plan” dla historii, wybór ćwiczenia w Postępach pod wykresem |
| Z-35 | Punkt kontrolny 8 tygodni po premierze (próg pobrań/płacących w `docs/monetyzacja.md`, „Bramka W0”) | agent przygotowuje dane, właściciel decyduje | ten sam termin co decyzja o Androidzie (DEC-26) |

### Szacunek czasu

- **Agent:** Z-02 1–2 h, Z-03 2–4 h, Z-05 do 1 h, finalizacja notatek recenzenta i opisu z testami ok. 1,5 h, skrypt wgrywania zrzutów (jeśli D2 = skrypt) 2–3 h, przegląd każdego obrazu zrzutów ok. 1 h. Razem ok. 9–13 h pracy agenta, z równoległością krócej.
- **Czekanie:** CI (verify ok. 25 min, pełny katalog E2E ok. 1,5 h, build TestFlight ok. 1,5 h, zrzuty 35 języków ok. 2 h zegarowo), kolejka maszyn macOS u GitHuba (ponawiamy przebiegi bez maszyny), **przegląd Apple (czas nieznany)**.
- **Właściciel:** telefon po buildzie 45–75 min (lista + zakupy), App Store Connect łącznie ok. 1–1,5 h w kilku podejściach, decyzje D1–D7 ok. 30 min.

## 2. Notatki dla App Review (EN) — szkic do pola Notes

Źródła: pole Notes „can contain up to 4000 bytes. You can write notes in any language.” (platform-version-information, odczyt 25.10.2026); wytyczna 2.1(a): wersja ma być kompletna, z działającymi adresami i bez tekstów zastępczych, a konto demo podaje się tylko
dla aplikacji z logowaniem; 2.1(b): zakupy mają być „complete, up-to-date, visible to the reviewer and functional”, a nieosiągalne pozycje trzeba wyjaśnić w notatkach (<https://developer.apple.com/app-store/review/guidelines/>, odczyt 25.10.2026).
Podstawą jest `store/review-notes.md` (wersja 23.10.2026); poniżej wersja na 1.0. Ścieżki ekranów **potwierdzić na buildzie 1.0** (po grafikach i monetyzacji — agent, krok finalizacji); dopiero wtedy tekst trafia do `store/review-notes.md` razem z poprawieniem
testu `tests/store-review-notes.test.ts` (zdanie o wersjach 0.11–0.20 przestaje pasować do pierwszego wydania).

Co się zmieniło względem wersji z 23.10.2026:
- **Limit 5 dni nie do pokazania w czasie recenzji:** dzień treningowy to trening na żywo trwający ponad 7 minut (`MIN_LIVE_MINUTES_FOR_DAY` w `lib/access.ts`; zmiana z 23.10.2026), więc recenzent nie dojdzie do blokady w krótkiej sesji. Notatka mówi o tym wprost i wskazuje drogę do ekranu zakupu z Ustawień
  (żadnej ukrytej funkcji do jego wywołania nie dodajemy — wytyczna 2.5.19 zabrania ukrytych funkcji).
- Dodany akapit o imporcie i eksporcie CSV (ścieżka z tekstów aplikacji: Więcej → Kopia zapasowa → „Importuj historię z pliku CSV”); recenzent nie ma pliku, więc podajemy sposób: eksport, potem import tego samego pliku.
- Usunięte zdanie „od wersji 0.11 do 0.20”; w 1.0 stała wartość subskrypcji (3.1.2(a)) opiera się na regularnych aktualizacjach i alternatywie jednorazowej. Czy dodać konkretne zapowiedzi — decyzja produktowa, nie zgadujemy.
- **Bez twierdzenia „Apple testuje zakupy w piaskownicy”:** w przeczytanej dokumentacji nie ma takiego zdania dla przeglądu (jest dla TestFlight), więc go nie wpisujemy.
- Okno „Uczciwe zasady” (po pierwszym treningu na żywo) i grafiki ćwiczeń: **do dopisania po scaleniu** — ścieżki z kodu gałęzi, nie z pamięci.

```text
Thank you for reviewing Trening.

NO ACCOUNT, NO SERVER
- The app has no sign-in and no backend. Everything is stored on the device; the app makes no network requests of its own. No demo account is needed (Sign-in required is off).
- To see the app with data quickly: on the Workout tab tap "Other workout", add an exercise and tick a set; or use "Log a past workout" to add a session in the past.

IN-APP PURCHASES (one subscription group "Full version": monthly and yearly auto-renewable subscriptions plus a one-time lifetime unlock; no introductory offers or free trials)
- Where to find them: More > Settings, section "Subscription" > "See Pro plans" (after a purchase the row reads "Your plan: monthly", "Your plan: yearly" or "Your plan: lifetime"). The purchase screen opens from there at any time, and also when a workout is started after the free limit is used. It shows the price and period from the App Store, "Restore purchases", "Redeem code", and links to the Privacy Policy and the Terms of Use (Apple's standard EULA).
- Free tier: the whole app is free for up to 5 training days per calendar month. A training day is a day with at least one finished live workout longer than 7 minutes (several workouts on the same day count as one day). Because of this rule the limit cannot be reached within a short review session; the purchase screen is therefore reachable from Settings as described above. History, backup, export and logging past workouts always work, with or without a purchase.
- Family Sharing is enabled for all three products.
- Ongoing value (Guideline 3.1.2(a)): the app is actively developed and updated regularly, and every new feature is included in the subscription. Users who prefer a single payment can choose the one-time lifetime unlock instead.

IMPORT AND EXPORT
- More > Backup: "Export history to CSV" and "Import history from a CSV file". Import shows a preview before anything is saved and never removes existing data. To try it: export your history to CSV first, then import the same file.

APPLE HEALTH (optional, off by default)
- More > Settings > "Save finished workouts to Apple Health": after the permission sheet, each finished workout is written to Health.
- More > Settings > "Show data from Apple Health": read-only (steps, workouts, heart rate, active energy), shown in the Plan day panel and in session details. Read data is never stored by the app or sent anywhere.
- The simulator has no Health data, so the read view is empty there.

APPLE WATCH (companion app, optional)
- The watch app shows the current workout started on the iPhone: exercise, set, weight and reps, and the rest countdown with a haptic at the end. The iPhone app is fully usable without a watch.
- To test: an iPhone paired with an Apple Watch, start a workout on the iPhone and open Trening on the watch. Without a workout on the phone the watch shows "Start a workout on your phone".

VOICE ANNOUNCEMENTS (optional, off by default)
- More > Settings > "Voice announcements". At the start of a rest the app announces the next exercise using on-device iOS speech synthesis.

REST TIMER
- The rest countdown also appears on the Lock Screen as a Live Activity. The end-of-rest notification is a local, time-sensitive notification. The app does not use push notifications.

CONTACT
- Support: support@apps4brew.com (also "Write to us" in More > About).
```

Rozmiar: 3280 bajtów (limit 4000); po dopisaniu akapitów o grafikach i oknie „Uczciwe zasady” zostaje ok. 700 bajtów zapasu.
Warunki wklejenia (z `store/review-notes.md`, bez zmian): skrzynka support@apps4brew.com działa (docs/41 E4 — DSA zweryfikowane 20.10.2026, **działanie skrzynki sprawdzić**), brak ofert wprowadzających w obu subskrypcjach (kontrola ASC, Z-10).
**Pole załącznika** do notatek (zrzut ekranu lub nagranie ekranu zakupu): **[OTWARTE]** — przeczytana strona platform-version-information go nie opisuje; sprawdzić w interfejsie przy Z-25. Nie zakładamy, że jest.

## 3. App Privacy — „Data Not Collected”?

**Wniosek: tak, odpowiedź „Data Not Collected” (w interfejsie: „No, we do not collect data from this app”) jest zgodna z kodem na `main` 928d0ff i z definicją Apple.** Ryzyko pozostaje w jednym miejscu (wiadomość do wsparcia) — opis niżej.

**Definicja Apple** (<https://developer.apple.com/app-store/app-privacy-details/>, odczyt 25.10.2026): „‘Collect’ refers to transmitting data off the device in a way that allows you and/or your third-party partners to access it for a period longer than what is necessary to service the transmitted request in real time.”;
„Data that is processed only on device is not ‘collected’ and does not need to be disclosed in your answers.”; „You are not responsible for disclosing data collected by Apple.”

**Sprawdzenie w kodzie (25.10.2026, `main` 928d0ff):**

| Obszar | Co sprawdzono | Wynik |
|---|---|---|
| Połączenia sieciowe | wyszukanie `fetch(`, `XMLHttpRequest`, `WebSocket`, `axios` w `lib/`, `app/`, `components/`, `modules/`; `URLSession` i widoków WWW w kodzie Swift (`targets/`, `modules/`) | **brak** |
| Analityka, reklamy, awarie, atrybucja | lista `dependencies` w `package.json` (30 pakietów: Expo, React Native, HealthKit, `expo-iap`, bez SDK analityki, reklam, raportów awarii ani atrybucji) | **brak** |
| Powiadomienia | tylko lokalne; uprawnienie `aps-environment` jest usuwane wtyczką `plugins/withoutPushEntitlement.js`; Live Activity prosi o `pushType: nil` (`modules/rest-activity`) | brak push, brak tokenów |
| Zdrowie (HealthKit) | odczyt i zapis wyłącznie na urządzeniu; opis uprawnienia w `app.json` mówi, że dane nie są wysyłane ani zapisywane w kopii; `docs/29` | lokalnie |
| Zegarek | WatchConnectivity: telefon ↔ zegarek na tym samym koncie Apple, bez serwera | lokalnie |
| Głos | syntezator mowy iOS na urządzeniu (`modules/voice-cue`) | lokalnie |
| Zakupy | `expo-iap` (StoreKit): dane zakupu przetwarza Apple | „data collected by Apple” — nie deklarujemy |
| Linki zewnętrzne | `Linking.openURL`: poczta (`lib/support.ts`), polityka i warunki na ekranie zakupu, strony źródeł — otwierają Safari lub Pocztę, aplikacja niczego nie przesyła | brak transferu przez aplikację |
| Manifest prywatności | `app.json` → `ios.privacyManifests`: `NSPrivacyTracking = false`, brak domen śledzących, `NSPrivacyCollectedDataTypes = []`, 4 kategorie API z powodami (test `tests/privacy-manifest.test.ts`) | zgodny z odpowiedzią |
| Kopie zapasowe i eksport | pliki JSON/CSV w Plikach na telefonie, udostępnianie arkuszem systemowym wybranym przez użytkownika; aplikacja nie używa interfejsów iCloud (wyszukanie `iCloud`, `CloudKit` w kodzie: brak poza tekstami podpowiedzi) | brak transferu przez aplikację |

**Jedyne miejsce ryzyka — „Napisz do nas” / „Poproś o nową funkcję”** (`lib/support.ts`): otwiera Pocztę z gotową wiadomością do wsparcia i stopką techniczną (wersja z numerem buildu, system, język), którą użytkownik widzi i może edytować przed wysłaniem.
Decyzja właściciela STOP 2, Q9 A (21.10.2026, `docs/45-formalnosci-asc.md`): zostaje „Data Not Collected” — wiadomość pisze i wysyła użytkownik w swojej aplikacji Poczta, dobrowolnie i rzadko, poza główną funkcją. Apple wymienia wśród warunków wyjątku „Optional disclosure”,
że dane są podane „in your app’s interface”; tu wiadomość powstaje w Poczcie, więc recenzent mógłby uznać etykietę za niepełną. **Odwrócenie jest tanie:** Apple pisze, że odpowiedzi można zmienić w dowolnej chwili i nie trzeba do tego nowej wersji
(„You may update your answers at any time, and you do not need to submit an app update in order to change your answers.”). Wariant zapasowy (B): Contact Info → Email Address oraz User Content → Customer Support, cel: App Functionality, bez śledzenia.
Rekomendacja: A teraz, B tylko jeśli Apple zakwestionuje. Do rejestru ryzyk — pkt 7 (R-N2).

Dodatkowo (5.1.3 w wytycznych): „Apps must not write false or inaccurate data into HealthKit … and may not store personal health information in iCloud”. Aplikacja nie korzysta z iCloud, zapisuje do Zdrowia tylko zakończone treningi (`docs/28`);
kopia iCloud całego iPhone'a robiona przez system nie jest zapisem aplikacji. Polityka prywatności (`site/privacy.html`) opisuje zegarek, głos i wiadomości do wsparcia; wersja strony musi być ≥ wersji aplikacji (test `audit-m1-013`).

## 4. Ocena wieku (kwestionariusz Apple 2025/2026)

Źródła (odczyt 25.10.2026): kwestionariusz i kroki — <https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/>; kategorie i wartości —
<https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/>. Oczekiwane odpowiedzi w repo: `store/asc-odpowiedzi.json` (test `tests/store-asc-odpowiedzi.test.ts`). **Wynik: 9+** (jedyny powód: „Health and wellness topics”).

| Pytanie Apple | Proponowana odpowiedź | Uzasadnienie (definicja Apple → aplikacja) |
|---|---|---|
| Parental Controls (kontrola rodzicielska w aplikacji) | nie | aplikacja nie ma narzędzi ograniczania treści ani zakupów |
| Age Assurance (potwierdzanie wieku) | nie | brak konta, brak weryfikacji wieku, brak Declared Age Range |
| Unrestricted Web Access | nie | brak przeglądarki w aplikacji; linki otwierają Safari (wartość 16+ dotyczy dostępu do dowolnych stron w aplikacji) |
| User-Generated Content | nie | treści użytkownika (szablony, notatki) zostają na urządzeniu, nie są rozpowszechniane |
| Messaging and Chat / Social Media | nie / nie | brak komunikacji między użytkownikami i kanału społecznościowego |
| Advertising | nie | brak reklam |
| Profanity or Crude Humor; Horror/Fear; Alcohol, Tobacco, Drugs | brak | — |
| Medical or Treatment Information | **brak** | definicja: „diagnoses or guidance around the management of medical conditions … medication guidance, emergency medical care, or treatment information”; aplikacja nie diagnozuje i nie leczy, przy bólu odsyła do lekarza; „frequent” oznaczałoby 16+ i deklarację wyrobu medycznego |
| **Health or Wellness Topics** | **tak** | definicja: „self-care or lifestyle recommendations … calorie tracking, dieting advice, or exercise recommendations” — plan treningowy, wskazówki techniki, generator planu; to jedyny punkt podnoszący ocenę do 9+ |
| Mature or Suggestive Themes; Sexual Content or Nudity; Graphic Sexual Content | brak | rysunki ćwiczeń są schematyczne (figury), bez nagości — **sprawdzić na gotowych grafikach** (Z-03) |
| Cartoon/Fantasy Violence; Realistic Violence; Guns or Other Weapons | brak | — |
| Gambling; Simulated Gambling; Loot Boxes | brak / brak / nie | zakupy to subskrypcje i dostęp na zawsze, bez losowych nagród |
| Contests | brak | definicja obejmuje zawody między użytkownikami (nagrody, rankingi, „achievement of personal goals” w rywalizacji); aplikacja ma własne rekordy i cele, ale nie ma rywalizacji z innymi — odpowiedź „brak” |
| Age Categories and Override | Not Applicable | brak kategorii Kids; własna umowa licencyjna z limitem wieku nie istnieje (standardowa licencja Apple) |

Wynik regionalny liczy Apple (m.in. Brazylia, Korea): dla „Health and wellness topics” tabele regionalne dają Brazylia A10 i Korea „All” — do obejrzenia na stronie App Information po zapisaniu; zmiana nie wymaga naszej decyzji.
Klucze w `store/asc-odpowiedzi.json` odpowiadają nazwom kategorii ze strony Apple (kontrola rodzicielska, potwierdzanie wieku, dostęp do sieci, treści użytkowników, komunikatory, media społecznościowe, reklamy, tematy zdrowotne itd.); Apple zastrzega, że ocena może zależeć od wersji systemu (iOS 26 i nowsze vs starsze).

## 5. Zrzuty ekranu

**Rozmiary** (Apple, <https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/>, odczyt 25.10.2026): co najmniej 1, najwyżej 10 zrzutów na rozmiar urządzenia i język, formaty .jpeg/.jpg/.png, **bez kanału alfa i przezroczystości**.

| Urządzenie | Wymagane? | Rozmiary (pionowo) | Nasz zestaw |
|---|---|---|---|
| iPhone z Dynamic Island, „medium display” (iPhone 17 Pro, 17, 16 Pro…) | **tak** (min. 1 zrzut) | 1206 × 2622 lub 1179 × 2556 | 1206 × 2622 (iPhone 17 Pro) |
| iPhone z Dynamic Island, „large display” (17 Pro Max, Air, 16 Plus…) | zalecany: „If screenshots with the accepted sizes aren't provided, scaled screenshots … are used” | 1320 × 2868, 1290 × 2796 lub 1260 × 2736 | 1320 × 2868 (iPhone 17 Pro Max) |
| iPad | **nie** (`supportsTablet: false` w `app.json`) | — | — |
| Apple Watch | **tak** („Required for Apple Watch apps”; ten sam rozmiar we wszystkich lokalizacjach) | jeden z: 422 × 514, 410 × 502, 416 × 496 (Series 10/11/12), 396 × 484, 368 × 448, 312 × 390 | 416 × 496 (Series 10/11) |
| iPhone Duo | od kwietnia 2027 dla SDK iOS 27.1 | — | nie dotyczy 1.0 |

Apple: „If your app’s user interface is consistent across multiple device sizes and localizations, you only need to provide screenshots for the highest required resolution. App Store Connect automatically scales them down.” — wystarczy więc komplet „large”;
komplet „medium” zostaje opcją, jeśli przegląd pokaże przeskalowanie gorsze od oryginału.

**Ekrany (scenorys 9 ekranów z 14.10.2026, ciemny wygląd, podpisy w `store/screenshot-captions.json`):** `trening`, `postepy-cwiczenia`, `straznik`, `plan`, `dostosuj`, `progresja`, `historia`, `szablony`, `import`.

**Po wejściu grafik ćwiczeń zrzuty mają je pokazywać.** Propozycja (decyzja D3):
- nowy ekran `cwiczenie` — karta ćwiczenia (`app/exercise/[id].tsx`, łącze `trening://exercise/<id>`) z rysunkiem ruchu i wskazówkami techniki, dla jednego flagowego ćwiczenia z danych pokazowych; miejsce: **drugi** (zaraz po ekranie treningu);
- ekran `trening` — jeśli grafika pojawi się w widoku bieżącego ćwiczenia, zrobić zrzut tak, aby było ją widać;
- podpisy nowego ekranu (PL / EN, do 40 znaków): „Rysunki ruchu i wskazówki techniki” (34) / „Movement drawings and technique cues” (36) — **propozycje**; nie obiecują rysunków „przy każdym” ćwiczeniu, dopóki nie potwierdzi tego liczba z kodu;
- razem 10 ekranów (maksimum na rozmiar), więc nowy zrzut zajmuje ostatnie wolne miejsce; wariant bez dokładania — zamiana najsłabszego z dziewięciu.
- Zrzut nie może zawierać nazw innych aplikacji, cen ani twierdzeń merytorycznych (wytyczne 2.3.7, `store/screenshot-captions.json`); obudowy urządzeń Apple są zakazane w repo (decyzja D-6).

**Jak wygenerować automatycznie** (mechanizm już istnieje, docs/41 pkt C):
1. `store-screenshots.yml` (Run workflow): `jezyki: all` (35 języków), `wyglad: dark`; zadanie `dane` tworzy zmyślone dane, `build` buduje aplikację Release na symulator, `zrzuty` (6,9″ i 6,3″) otwiera ekrany łączem `trening://…`, a akcje (przewinięcie, stuknięcie, wybór pliku CSV) robi Maestro z `scripts/ci/maestro-sklep/`, `ramki` składa podpis i obwódkę (`scripts/ci/store-frames.sh`). Wynik: artefakty `sklep-zrzuty-ramki` (3 dni).
2. Zegarek: `watch-sim.yml`, wejście `jezyki_zrzutow: all` (416 × 496).
3. Zrzut ekranu zakupu do przeglądu (osobny obraz dla każdego produktu): `store-screenshots.yml` z wejściem `zrzut_zakupu_z_przebiegu` (aplikacja E2E ze sztucznym sklepem) albo zrzut z telefonu po zakupie w piaskownicy.
4. Przegląd **każdego** obrazu przez agenta (lekcja L-004 w `docs/40`: zrzuty do sklepu sprawdzamy na obrazach, nie na logach), potem akceptacja zestawu przez właściciela (15 min).
5. **Wgranie (D2, zrobione):** workflow `asc-zrzuty.yml` (Run workflow): wejścia `zrzuty_z_przebiegu` (numer przebiegu `store-screenshots.yml`, artefakt `sklep-zrzuty-ramki`), `rozmiar` (6.9 domyślnie), `zegarek_z_przebiegu` (opcjonalnie, `watch-sim.yml`, artefakt `zegarek-zrzuty`), `tryb` (`dry-run` domyślnie, `apply` za środowiskiem `release`).
   Te same sekrety ASC co `asc-metadane.yml`, żadnych nowych. Wyjątek od L-001 (25.10.2026): po scaleniu pierwszy przebieg to `dry-run`, przy porażce cofnięcie. Angielski zestaw trafia do czterech lokalizacji angielskich (jeden obraz w bibliotece, cztery placementy).
   **Lokalizacja bez własnych zrzutów (rozstrzygnięte 28.10.2026, M1-037 D):** Apple: „When you add a language to your app, screenshots and the properties for the new language default to those of the primary language, except for the description and keywords.” (<https://developer.apple.com/help/app-store-connect/manage-app-information/localize-app-information/>, odczyt 28.10.2026). Język podstawowy aplikacji to polski (docs/15), więc lokalizacja bez własnego zestawu pokaże **polskie** podpisy — dlatego zestaw dla każdej z 32 lokalizacji (33 z `store/app-store-names.json` bez `sl`, L-003).
6. **Podpisy we wszystkich językach (M1-037 D, DEC-07 b 27.10.2026):** `store/screenshot-captions.json` ma podpisy 9 ekranów dla 29 języków aplikacji ze sklepem (PL zaakceptowane 14.10.2026, EN zaakceptowane 28.10.2026 (decyzja 10a), 27 języków — przekład agenta 28.10.2026); strażnik `tests/audit-m1-2026-10-27-037-podpisy-zrzutow.test.ts` (komplet, ≤ 40 znaków, bez cen, znaki w czcionce ramek). **Warunki przed Z-16:** (a) ~~akceptacja EN przez właściciela~~ — zrobione 28.10.2026 (decyzja 10a); (b) recenzja 27 przekładów (rola `recenzent-lokalizacji`, poprawki — tłumacz) i status języka „zrecenzowane DD.MM.RRRR”; (c) ~~decyzja o podpisie pierwszego ekranu~~ — zrobione 28.10.2026 (decyzja 10a, opcja b: „Szybki zapis serii, także z zegarka”; przekład na 27 języków do recenzji). **Kroki koordynatora (macOS, ręcznie, jeden naraz):** `store-screenshots.yml` z `jezyki: all`, `wyglad: dark` (ok. 2 h zegarowo, artefakt `sklep-zrzuty-ramki` 3 dni) → `watch-sim.yml` z `jezyki_zrzutow: all` → przegląd każdego obrazu przez agenta (L-004; m.in. czy podpis mieści się w ramce w każdym języku) → akceptacja zestawu przez właściciela → `asc-zrzuty.yml` `dry-run` (tabela: każda z 32 lokalizacji „wgraj” dla iPhone’a i zegarka) → `apply` za środowiskiem `release`.

Znane ograniczenia zrzutów (docs/41): porównanie miesiąca liczy dni 1–N bieżącego miesiąca (zrzut z początku miesiąca bywa słaby — robić po 10. dniu miesiąca); nazwy szablonów w innych językach niż PL są po angielsku (dane użytkownika).

## 6. Opis i słowa kluczowe

**Stan w repo** (`store/app-store-metadata.json`, 33 lokalizacje; test `tests/store-metadata.test.ts` i `tests/audit-m1-045-store-description.test.ts` pilnują zgodności z kodem, liczby języków i braku nazw innych aplikacji):
podtytuł PL „Serie i przerwy. Bez konta”, EN „Workout tracker. No account.” (decyzja STOP 2 M5, 21.10.2026); słowa kluczowe w granicy 100 bajtów (limit Apple: „up to 100 bytes”, pola nie powielają nazwy aplikacji i nie zawierają nazw innych aplikacji);
tekst promocyjny z limitem 170 znaków; opis zawiera: szablony, widok „Skupiony”/„Lista”, timer przerw, Apple Watch, zapowiedzi głosowe, „Dostosuj do miejsca”, generator, odczyt i zapis Apple Health, kopię i eksport JSON/CSV, import CSV, 35 języków, model „darmowe do 5 dni treningowych w miesiącu” i przypis o espresso (bez kwot).

**Nowe wyróżniki 1.0**, których opis jeszcze nie mówi (po zakończeniu prac w toku; korekta 26.10.2026 po audycie 1.0: bez odwołań do źródeł — decyzja „całkiem anonimowo” z 25.10.2026 — i bez rysunków dla pełnej biblioteki, które przechodzą do 1.1, wybór C z 26.10.2026):
1. rozszerzony import historii z plików CSV (rozpoznawanie układu pliku, podgląd przed zapisem, brak nadpisywania) oraz karta po imporcie;
2. okno „Uczciwe zasady” po pierwszym treningu na żywo (to funkcja aplikacji, w sklepie wystarczy zdanie o modelu, które już jest).
Opis ćwiczeń zostaje bez zmian („Biblioteka ćwiczeń z krótkimi wskazówkami techniki”); o rysunkach ruchu w opisie nie wspominamy, dopóki nie obejmą całej biblioteki (1.1).

**Propozycja zmian (do decyzji D4; bez nazw innych aplikacji — wytyczna 2.3.7; liczby tylko z kodu, np. liczba ćwiczeń z `libraryCount` jako stała pilnowana testem, jak `LANGS.length`):**

| Pole | PL | EN |
|---|---|---|
| Punkt „POSTĘPY / PROGRESS” | bez zmian (zob. wyżej) | bez zmian |
| Punkt „TWOJE DANE / YOUR DATA”, zamiast „Import z kopii i z plików CSV popularnych dzienników treningowych” | • Import z kopii i z plików CSV: aplikacja rozpoznaje układ pliku, pokazuje podgląd przed zapisem i niczego nie nadpisuje | • Import from a backup and from CSV files: the app recognises the file layout, shows a preview before saving and never overwrites anything |
| Tekst promocyjny (≤ 170 znaków; PL 123, EN 121) | Własne szablony, timer przerw i wskazówki techniki. Offline, bez konta i reklam. Za darmo do 5 dni treningowych w miesiącu. | Your own templates, a rest timer and technique cues. Offline, no account, no ads. Free for up to 5 training days a month. |
| Podtytuł | bez zmian (decyzja 21.10.2026) | bez zmian |
| Słowa kluczowe | bez zmian (rekomendacja): dobór oparty na badaniu `docs/45-widocznosc-w-sklepie.md`; nowe wyróżniki nie mają mierzalnego popytu na frazy, a pomiar zrobi punkt 8 tygodni po premierze | bez zmian |

Uwagi: (a) zdania o rysunkach ruchu wolno wpisać dopiero, gdy obejmą całą bibliotekę (1.1); zdań o źródłach nie wpisujemy w ogóle (decyzja 25.10.2026); (b) tekst promocyjny można zmieniać bez nowej wersji (Apple: „without requiring an updated submission”) —
nadaje się więc do poprawek po premierze; (c) po zmianie opisu trzeba zaktualizować dokładne asercje w `tests/audit-m1-045-store-description.test.ts` i `tests/store-metadata.test.ts` oraz przetłumaczyć nowe zdania na 31 pozostałych lokalizacji (rola tłumacz, recenzent lokalizacji, słownik terminów) — ok. 1,5–2 h agenta;
(d) wpis do ASC: `asc-metadane.yml` tryb `podglad` → `zapis` (Z-14).

## 7. Otwarte ryzyka z docs/40 i co je zamyka

Stan z `docs/40-lekcje.md` na `main` 928d0ff (25.10.2026). **Otwarte ryzyko blokuje wydanie** (zasada L-001, pkt 2); „odroczone decyzją właściciela z datą” jest dozwolone (docs/42 pkt 1).
Dowody poniżej sprawdziłem w dziennikach przebiegów GitHub Actions (odczyt 25.10.2026) i **proponuję** zamknięcie — samą zmianę wpisu w `docs/40` robi koordynator.

| id | co | co zamyka | stan dowodów |
|---|---|---|---|
| R-004 | powiadomienia pilne w trybie skupienia (blokuje 1.0) | automat: strażnik uprawnień w `testflight.yml` (spełniony — build 1030, przebieg 39881352744); **telefon**: docs/47 Test C (profil skupienia bez powiadomień → koniec przerwy daje baner; Ustawienia iOS → Trening → Powiadomienia → „Powiadomienia pilne”) | **wymaga właściciela** (Z-08). Jeśli baner nadal nie przychodzi: decyzja z datą, że 1.0 wychodzi z tym zachowaniem (opis: wibracja i dźwięk działają, baner zależy od ustawień iOS), albo diagnoza dalsza |
| R-005 | strażnik pętli awarii a szybkie `stopApp` → `launchApp` | pakiet podstawowy E2E zielony po scaleniu partii 1 **i** brak ekranu awaryjnego w nocnym pełnym przebiegu | pakiet podstawowy zielony na `integracja-2026-10-25` (przebieg 40210326891; przebieg na `main` 928d0ff w chwili sprawdzenia jeszcze trwał); **nocne przebiegi pełne czerwone 3 noce** — nie wiadomo, czy któryś padł przez ekran awaryjny; sprawdzi agent w logach przy Z-06 |
| R-006 | testy Swift zegarka (`WatchStoreTests`) nieuruchamiane | zielony krok „Testy logiki zegarka (XCTest)” w `watch-sim.yml` | **spełnione**: `watch-sim.yml` 39380918348 (`audyt-m1`, 20.10.2026) i 39692269068 (redesign, 21.10.2026) zielone; `testflight.yml` 39881352744 (main, f2b0525) wykonał te same testy w kroku „Logika zegarka” (log: `testPersistenceKeepsQueueFromOlderShape` i `testPersistenceRoundTripKeepsCurrentShape` passed). Do zamknięcia wpisu; przed 1.0 powtórzyć na commicie wydania (Z-07 robi to samo) |
| R-008 | mapa źródeł JS w `xcodebuild archive` | krok „Mapa źródeł JS” zielony, artefakt `mapy-zrodel-b<N>`; po pierwszym wydaniu test symbolikacji | **spełnione w części (a)**: `testflight.yml` 39881352744 — krok „Mapa źródeł JS” zielony, artefakt `mapy-zrodel-b1030` wysłany. Część (b) „po pierwszym wydaniu” wykonuje się dopiero po Z-32 (mapa przy tagu, `npx metro-symbolicate` na celowym błędzie) — wpis do zamknięcia warunkowo albo rozbić na dwa |
| R-010 | treść krytyczna w 34 językach | decyzja 21.10.2026: zamyka **przegląd wykonany przez Claude** z listą sprawdzonych zdań; kolumna „drugi przegląd” w `docs/16` i pkt (2)–(3) wpisu | przegląd API z 22.10.2026 był przed przekładem 33 języków i nowymi wskazówkami z grafik, więc **trzeba go powtórzyć po przekładzie** (Z-02); fr „vous” i tr „siz” (pkt 2) potwierdza test zgodności z rejestrem `docs/16` |
| R-013 | ikona zegarka (częściowo spełnione) | wysyłka zielona (spełnione: build 1027, 1030); **ikona widoczna na zegarku** | **wymaga właściciela z zegarkiem** (Z-08; D-7: pożyczony zegarek) |
| R-014 | „Pogrubiony tekst” z krojem systemowym | telefon: Ustawienia → Dostępność → Wyświetlanie i rozmiar tekstu → Pogrubiony tekst; treść i przyciski grubsze | **wymaga właściciela** (Z-08, 2 min) |
| R-M5-1…5 | model M5 S1 | zamknięte lub zaakceptowane 22–23.10.2026 | bez akcji; R-M5-3 sprawdza ponownie Z-10 |

**Proponowane nowe wpisy do rejestru** (zasada L-001, pkt 2: ryzyko „niepotwierdzone / rozstrzygnie zgłoszenie” ma warunek zamknięcia):

| id (propozycja) | ryzyko | warunek zamknięcia |
|---|---|---|
| R-N1 | zakupy w zgłoszeniu wersji iOS z zegarkiem w paczce (zdanie Apple o zakupach i Apple Watch dotyczy zgłoszenia wersji zegarka) | Z-29: ASC przyjmuje zgłoszenie z trzema produktami bez błędu; jeśli nie — pytanie do Apple i decyzja właściciela |
| R-N2 | etykieta „Data Not Collected” a wiadomość do wsparcia z Poczty (pkt 3) | recenzja Apple nie kwestionuje etykiety; w razie zakwestionowania — wariant B bez nowej wersji |
| R-N3 | pełny katalog E2E czerwony w nocy (3 noce) przed bramką App Store | Z-06 zielony na commicie wydania |

**Otwarte akcje z lekcji** (docs/40: „otwarte” przy akcjach, nie w rejestrze ryzyk — koordynator ma je przejrzeć przed wydaniem, CLAUDE.md): `day()` z `new Date()` w pozostałych testach (niska częstość), ciemny motyw w nocnym E2E rzeczywiście ciemny,
szybki przebieg scenariuszy 33 i 34 przy zmianie scenariusza lub etykiety, mechanizm „What to Test → scenariusz Maestro”, stałe identyfikatory zamiast tekstów w scenariuszach, reguła kolejki verify przy pracy równoległej. Żadna nie blokuje formalnie; część (ponawianie, tryb ścisły) jest zastąpiona decyzją z 21.10.2026 i wymaga oznaczenia jako nieaktualna.

## 8. Decyzje do podjęcia przez właściciela

Każda z co najmniej dwiema opcjami; agent nie rozstrzygał żadnej z nich.

| # | Decyzja | Opcje i kompromisy | Rekomendacja |
|---|---|---|---|
| D1 | Audyt przed zgłoszeniem (zakres po audycie M1 urósł: grafiki, monetyzacja, przekład) | A: audyt zmian od audytu M1 + stała lista (dane, migracje, prywatność), tylko KRYTYCZNE i WYSOKIE blokują, bez pętli — 2–4 h agenta; B: bez nowego audytu, polegamy na testach i E2E — szybciej, ale grafiki (treści z twierdzeniami o mięśniach, torze ruchu, błędach) i import CSV (dane użytkownika) nie miałyby niezależnego przeglądu | A |
| D2 (rozstrzygnięte, patrz wyżej) | Wgrywanie zrzutów do App Store Connect | A: ręcznie — bez nowego kodu, ale kilkaset plików (33 lokalizacje × zestaw iPhone + zegarek) i ryzyko pomyłek; B: skrypt + workflow `asc-zrzuty.yml` (podgląd / zapis za `release`) — 2–3 h agenta, nowy workflow zmieniający ASC, potrzebne zastosowanie wyjątku od L-001 z 25.10.2026 albo przebieg dowodowy przed scaleniem; C: ręcznie tylko PL i EN, reszta po premierze — najmniej pracy, ale lokalizacje bez zrzutów mogą nie przejść walidacji **[OTWARTE]** | B |
| D3 | Zestaw zrzutów po wejściu grafik | A: 10 ekranów — dodać `cwiczenie` jako drugi (maksimum Apple); B: zamienić najsłabszy z dziewięciu na `cwiczenie`; C: bez zmian (grafiki nie są widoczne w sklepie, tracimy wyróżnik z decyzji 25.10.2026) | A |
| D4 | Zakres zmian opisu i tekstu promocyjnego (pkt 6) | A: propozycja z tabeli (rysunki, źródła, import) po potwierdzeniu pokrycia w kodzie; B: tylko tekst promocyjny (zmienialny bez nowej wersji), opis bez zmian do 1.0.1; C: bez zmian — opis mówi „krótkie wskazówki”, nie sprzedaje najmocniejszego wyróżnika | A |
| D5 | Etykieta prywatności | A: „Data Not Collected” (decyzja 21.10.2026), wariant B zapasowy; B: od razu zadeklarować e-mail i wsparcie — bezpieczniej wobec definicji „collect”, ale etykieta mniej atrakcyjna i niezgodna z hasłem „bez zbierania danych” | A (odwracalne bez nowej wersji) |
| D6 | Deklaracja wyrobu medycznego (Z-22) | A: „No” po krótkim sprawdzeniu kryteriów przez agenta (pkt Z-22); B: najpierw konsultacja prawna — czas i koszt właściciela, brak przesłanek, że aplikacja jest wyrobem medycznym (nie diagnozuje, nie leczy, odsyła do lekarza) | A |
| D7 | Lokalizacje zrzutów | A: wszystkie 33 lokalizacje z nazwą (CI ok. 2 h zegarowo); B: PL i EN na start, reszta w 1.0.1 | A |

## 9. Przeczytane strony Apple (25.10.2026)

- Screenshot specifications — <https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/>
- Platform version information (Notes, Keywords, Support URL, Copyright, Version Release Settings, What’s New) — <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/>
- Required, localizable, and editable properties — <https://developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/>
- App privacy details — <https://developer.apple.com/app-store/app-privacy-details/>; Manage app privacy — <https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/>
- Set an app age rating; Age ratings values and definitions — adresy w pkt 4
- Declare regulated medical device status — <https://developer.apple.com/help/app-store-connect/manage-app-information/declare-regulated-medical-device-status/>
- Set a price — <https://developer.apple.com/help/app-store-connect/manage-app-pricing/set-a-price/>
- Submit an app — <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/>; Overview of submitting for review — <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/overview-of-submitting-for-review/>
- Submit an In-App Purchase — <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase/>
- Choose a build to submit — <https://developer.apple.com/help/app-store-connect/manage-builds/choose-a-build-to-submit/>
- Testing subscriptions and In-App Purchases in TestFlight — adres w Fazie A; Overview of testing in sandbox — <https://developer.apple.com/help/app-store-connect/test-in-app-purchases/overview-of-testing-in-sandbox/>
- Release a version update in phases — <https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/>
- Overview of Accessibility Nutrition Labels; Manage Accessibility Nutrition Labels — <https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels/>, <https://developer.apple.com/help/app-store-connect/manage-app-accessibility/manage-accessibility-nutrition-labels/>
- App Review Guidelines (1.4.1, 2.1, 2.3.3, 2.3.7, 2.5.1, 3.1.1, 3.1.2, 5.1.3) — <https://developer.apple.com/app-store/review/guidelines/>

Nieprzeczytane: pole **Content Rights** (nie znalazłem jego strony pomocy pod żadnym sprawdzonym adresem) i kategoria podatkowa aplikacji (strona istnieje: <https://developer.apple.com/help/app-store-connect/manage-app-information/set-a-tax-category/>, ale jej treści nie czytałem).
Odpowiedzi wpisuje właściciel w interfejsie; punkt wyjścia: aplikacja zawiera tylko własne teksty i grafiki, bez cudzych treści (`CLAUDE.md`, „Treści cudze”). Agent czyta obie strony przy Z-21 **[OTWARTE]**.
