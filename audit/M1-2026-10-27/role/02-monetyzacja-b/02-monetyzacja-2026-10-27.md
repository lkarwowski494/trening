# Audyt: Monetyzacja (drugi niezależny przebieg, wariant głęboki) — Trening — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: audit · Rola: 02-monetyzacja (przebieg „b”, znaleziska od 501) · Moduły: storekit-expo, cena-i-rachunek, audyt-paywalla
Środowisko: Linux (Node v22.22.0, git, sieć przez pośrednika: działa), Playwright 1.63.0 dostępny, brak macOS/Xcode/symulatora i telefonu; workflowów nie uruchamiano. Dowód: (dowody/e0-srodowisko.txt).

## Podsumowanie

Kod płatności jest w dobrym stanie u podstaw: dostęp liczony z bieżących uprawnień sklepu, błąd odczytu nie zamienia płacącego w darmowego, przywracanie czyta transakcje, dane nigdy nie są za zaporą, jeden strażnik na wszystkich drogach startu. Najpoważniejsze ryzyko na dziś to **T-11: lista planów w USD, a arkusz Apple pobiera PLN**. Kod pokazuje dokładnie `displayPrice` ze StoreKit, więc przyczyna leży najpewniej w środowisku piaskownicy TestFlight. Ryzyka produkcyjnego nie da się jednak wykluczyć z Linuksa. Ryzyko nie jest wpisane w rejestr ryzyk (docs/40), a lista kontrolna telefonu nie porównuje ceny z listy z ceną w arkuszu. Odtworzenie w sondzie pokazało też dwa błędy kodu: **decyzja P3 B (dni z okresu Pro nie liczą się do limitu po wygaśnięciu) w produkcji nie działa**, bo sklep nie zwraca wygasłych subskrypcji, a testy sprawdzają ją na kształcie danych, którego natywny adapter nie wytwarza. Druga sprawa: **subskrybent kupujący dożywotni nie dostaje przed zakupem ostrzeżenia o podwójnej płatności**, które przewiduje specyfikacja docs/27. Decyzje dla właściciela: sposób zamknięcia T-11 przed wydaniem, naprawa P3 B oraz ostrzeżenie przed dożywotnim przed 1.0 albo po nim.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 02-monetyzacja-501 | P1 | D | Po wygaśnięciu albo cofnięciu Pro dni treningowe z okresu Pro zużywają darmowy limit (P3 B nie działa z prawdziwym sklepem) | otwarte |
| 02-monetyzacja-502 | P1 | M | T-11: cena na liście planów (USD) różna od ceny w arkuszu Apple (PLN); przyczyna niewyjaśniona, ryzyka nie ma w rejestrze, a lista telefonu tego nie sprawdza | otwarte |
| 02-monetyzacja-503 | P1 | D | Subskrybent wybierający plan dożywotni nie widzi przed zakupem, że subskrypcja dalej się odnawia (podwójna płatność; wymóg docs/27 3.11 bez wdrożenia) | otwarte |
| 02-monetyzacja-504 | P2 | D | Płacący widzi „5 dni za darmo”, pełną ofertę i „Subskrybuj” przy posiadanym planie; stan nie nazywa planu; „Dostęp do {data}” przy odnawianej subskrypcji wygląda jak koniec; w Ustawieniach brak „Chmury rodzinnej” | otwarte |
| 02-monetyzacja-505 | P2 | D | „Zarządzaj subskrypcją” otwiera stronę App Store, a nie systemowy arkusz (docs/27 3.10); w TestFlight pokazuje produkcyjną listę bez zakupów testowych | otwarte |
| 02-monetyzacja-506 | P2 | P | Porównanie „jak jedno espresso” w opisie (33 lokalizacje) nie jest sprawdzone dla wszystkich krajów sprzedaży; decyzja o Ukrainie z 13.10 bez wdrożenia i bez zamknięcia | otwarte |
| 02-monetyzacja-507 | P2 | P | Decyzja właściciela zapisana bez testu-strażnika i bez sprawdzenia wdrożenia (kolejność planów 23.10; P3 B; „limit tylko się luzuje” bez progu minut) — luka systemowa | otwarte |

## Mapa bramek

Każde miejsce, które czyta albo zmienia uprawnienie (potwierdzone lekturą kodu; sygnały grep: dowody/mapa-bramek-grep.txt).

| Miejsce (plik:linia) | Rodzaj | Co chroni albo zmienia | Źródło stanu | Przepływ / płatna funkcja | Uwagi → ID |
|---|---|---|---|---|---|
| `lib/store-native.ts:69-83` | odczyt stanu | uprawnienia z `getAvailablePurchases({onlyIncludeActiveItemsIOS:true})` (= currentEntitlements) + karencja z `subscriptionStatusIOS` | StoreKit | wszystkie | wygasłe nie wracają (openiap filtruje) → 501 |
| `lib/entitlement.ts:60-66` | odczyt stanu | odświeżenie; błąd → `null` (unknown), nigdy free | adapter | start, powrót z tła, zdarzenie | ok |
| `lib/entitlement.ts:46-51` | zmiana stanu (pamięć) | ostatni znany wynik w kv `access` (poza kopią) | wynik sklepu | offline | ok (P6 A) |
| `lib/entitlement.ts:68-73`, `app/_layout.tsx:42`, `app/_layout.tsx:55` | nasłuch | nasłuch transakcji od startu, odświeżenie przy powrocie z tła | StoreKit `purchaseUpdatedListener` | inne urządzenie, Ask to Buy, kod, rodzina, zwrot | ok |
| `lib/store-native.ts:95-108`, `lib/entitlement.ts:121-123` | zmiana stanu (zakup) | `requestPurchase` → `finishTransaction` → odczyt uprawnień | StoreKit | ekran zakupu | dostęp liczony z currentEntitlements (zawiera zakończone), kolejność bez skutku dla dostępu |
| `lib/store-native.ts:113-116`, `lib/entitlement.ts:125-127` | przywracanie | `restorePurchases` (sync) + odczyt; brak = "none", błąd = "error" | StoreKit | ekran zakupu (`app/paywall.tsx:95`) | ok (sonda S3) |
| `lib/store-native.ts:125`, `app/paywall.tsx:96` | zmiana stanu (kod) | arkusz realizacji kodu, potem odświeżenie | StoreKit | ekran zakupu | ok |
| `lib/store-native.ts:126`, `app/paywall.tsx:73` | ekran zakupu | "Zarządzaj subskrypcją" | URL App Store | ekran zakupu | 505 |
| `lib/access.ts:112-132` | odczyt stanu (czysty) | full / free / unknown (+ karencja offline 7 dni) | uprawnienia + pamięć | wszystkie | ok |
| `lib/access.ts:135-143`, `lib/access.ts:176` | bramka (limit) | P3 B: starty sprzed wygaśnięcia nie liczą się | uprawnienia (wymaga wygasłego wpisu) | start treningu na żywo | 501 |
| `lib/access.ts:232-241` | bramka (limit) | `used < limit` albo dziś już dzień treningowy | `State.liveDays` | start treningu na żywo | warunek poprawny (MON-09) |
| `lib/entitlement.ts:108-113` | bramka | jedyny strażnik startu → `/paywall?reason=limit` | `accessNow` | wszystkie drogi startu | ok |
| `lib/start.ts:64`, `lib/start.ts:70`, `lib/start.ts:75` | bramka | start z szablonu (ekran Trening, Dziś, panel dnia, podgląd szablonu, wybór szablonu, deload), "Powtórz ostatni", "Pusty trening" | strażnik | jedyne miejsca ustawiające `active` przez `lib/state/start.ts` | ok; zegarek nie startuje treningu, linki głębokie nie mają trasy startu |
| `lib/state/finish.ts:90-93`, `lib/state/finish.ts:114` | zmiana stanu (licznik) | zapis dnia przy ukończeniu treningu na żywo > 7 min | stan aplikacji (w kopii) | koniec treningu | ok; import, wstecz, anulowany nie zapisują |
| `components/StartPanel.tsx:67` | odczyt stanu | licznik "Zostały X z 5" tylko `free` i nie `silent` | `useAccess` | ekran Trening | ok |
| `app/paywall.tsx:42`, `app/paywall.tsx:68-90` | ekran zakupu | karta posiadania, lista planów, CTA | `useAccess` + `getProducts` | Ustawienia, limit, okno, karta importu | 503, 504 |
| `components/SubscriptionCard.tsx:11-16` | odczyt stanu / wejście | wiersz "Pełna wersja" w Ustawieniach | `useAccess` | Ustawienia | 504 |
| `lib/fairrules.ts:11-14`, `components/ImportProCard.tsx:17`, `components/FairRulesSheet.tsx:20` | odczyt stanu / wejście | okno "Uczciwe zasady" i karta po imporcie tylko dla pewnego `free` | `accessNow` | po treningu, po imporcie | ok |
| `lib/entitlement.ts:117` | odczyt stanu | prośba o ocenę wstrzymana, gdy limit wyczerpany | `accessNow` | podsumowanie | ok |
| `lib/entitlement.ts:21` | konfiguracja | build E2E: sztuczny sklep, limit 0 | zmienna `EXPO_PUBLIC_STORE_FAKE` | tylko e2e-ios.yml | strażnik w testflight.yml; ok (MON-12) |

Płatna funkcja z kontraktu (docs/monetyzacja.md): wyłącznie start treningu na żywo w nowym dniu ponad 5 dni w miesiącu. Każda droga ma bramkę. Historia, edycja, dopisywanie wstecz, kopia, eksport i import są bez bramki (`lib/access.ts:246-249`).

## Rachunek

- Bramka W0 nie była liczona: polecenie (zasada 20, MON-18) przyjmuje wynik z docs/monetyzacja.md. M5 S1 daje normalnie ok. 471 USD/rok przy prowizji 15% i ok. 388 USD przy 30%. Oba wyniki są poniżej progu 500 USD, a model właściciel wybrał świadomie 22.10.2026. Prowizja 15%: Small Business Program przyjęty 26.10.2026 (`docs/18-przekazanie.md:591`).
- **T-11 jako rachunek** (kurs NBP 209/A/NBP/2026 z 27.10.2026: USD 3,9542 zł, EUR 4,4056 zł; dowody/kursy-nbp.txt). Lista w USD przeliczona na zł vs kwota w arkuszu: miesięczny 0,99 USD ≈ 3,91 zł vs 4,99 zł (lista **o ok. 22% taniej** niż pobranie); roczny 6,99 USD ≈ 27,64 zł vs 19,99 zł; dożywotni 14,99 USD ≈ 59,27 zł vs 59,99 zł. Rozjazd ma oba kierunki. Ten, który szkodzi użytkownikowi, dotyczy planu miesięcznego.
- **Espresso:** 4,99 zł / 4,4056 ≈ 1,13 €, czyli w przedziale 1,06–1,51 € z przypisu. Strefa euro 0,99 € leży poniżej przedziału. Pozostałych krajów nie sprawdzono (506).
- Ceny konkurencji w PL (odczyt 27.10.2026, dowody/e0b-linia-bazowa-rynek.txt): miesięczny ok. 12–23 zł, roczny ok. 74–140 zł, dożywotni ok. 400–490 zł. Trening (4,99 / 19,99 / 59,99 zł) kosztuje ułamek tego. MON-17 bez znaleziska: kwoty modelu mają źródło (ASC, decyzje z datą).

## Linia bazowa i założenia

Zapisana przed lekturą docs/monetyzacja.md i kodu płatności: dowody/e0b-linia-bazowa-rynek.txt (rynek PL, 6 konkurentów anonimowo z trackId, recenzje pl/us z datą, wytyczne Apple czytane 27.10.2026, „Last Updated: October 16, 2026”). Na tej podstawie najlepszy w klasie offline'owy dziennik siłowy bez konta wygląda tak:
1. Freemium, w którym darmowa część wykonuje główną pracę. Recenzje chwalą darmową wersję, która „ma wszystko”, a skarżą się na twardą zaporę i na cofanie funkcji z darmowej wersji.
2. Subskrypcja i dożywotni obok siebie (4 z 5 konkurentów z subskrypcją ma dożywotni; prośba o niego w recenzji 5★).
3. Limit liczony użyciami, nie czasem od instalacji (3.1.1).
4. Ceny tylko z produktu sklepu, w walucie storefrontu. Strona subskrypcji Apple: „Full renewal price, shown clearly and prominently, and localized in available currencies”.
5. Stan po zakupie nazywa posiadany plan i nie proponuje drugiej wersji tego samego (3.1.2(b)).
6. Dostęp z transakcji sklepu; dane nigdy za zaporą.

**Porównanie:** punkty 2, 3, 4 (w kodzie), 6 i 1 są zgodne. W punkcie 1 limit dotyczy treningu na żywo, ale dopisywanie wstecz zawsze działa, więc główna praca nie jest zablokowana (decyzja 22.10.2026 i polecenie: model optymalny = M5 S1). Punkt 5 jest niezgodny (504, 503). Punkt 4 jest niezgodny na telefonie testerki (502).

**Wymiary pokrycia:**
- Modele (także darmowy, napiwek, płatny): rozstrzygnięte decyzją 22.10.2026 (M5 S1; badanie docs/monetyzacja-badanie-2026-10.md). Rodzaj wartości jest stały; ciągłą wartość subskrypcji opis sklepu deklaruje rozwojem, a roadmapa jest w docs/21. Bez znaleziska.
- Za co się płaci i skargi płacących: linia bazowa (R, 27.10.2026); płatna jest tylko liczba dni z treningiem na żywo. WTP: limit dni to WTP-1 (płatne odpowiedniki u konkurencji: limity szablonów i funkcji), dane są WTP-0 i są darmowe. Funkcji WTP-X w części płatnej brak.
- Okres próbny i oferty: brak (M5 S1); kontrola ASC (R-M5-3 zamknięte) według docs/40, przebiegu nie odtwarzano.
- Trwałość zakupu: sonda S3 (wektory) ok. Family Sharing: aktywne i cofnięte ok, ale cofnięcie i wygaśnięcie uruchamiają 501. Zwrot ok. Brak sieci: karencja 7 dni (P6 A).
- Ceny w regionach i podatki: 502 (waluta), 506 (espresso w krajach); VAT i prowizja tylko z dokumentu (bramka nieliczona).
- Etyka: sprawdzone (bez fałszywej pilności, bez zawstydzania, zamknięcie widoczne, „Nie teraz”, dane dostępne); 503 to brak ostrzeżenia o podwójnej płatności.
- Miejsce ekranu zakupu: limit, Ustawienia, okno raz po treningu, karta po imporcie. Każde z dowodem w mapie bramek, a główna praca jest widoczna przed zakupem.
- Próg i lejek: rozstrzygnięte decyzją (W0, punkt kontrolny po 8 tygodniach).
- Prywatność narzędzi: expo-iap 5.8.1 bez IAPKit (`lib/store-native.ts:5-10`, strażnik tests/store-adapter.test.ts), "Data Not Collected". Bez znaleziska.

**Soczewki (po kolei, bez subagentów):** (1) Oszczędny użytkownik: widzi „5 dni za darmo” i cenę, ale na telefonie testerki inną niż w arkuszu (502). (2) Pasjonat po roku, który zmienia telefon: dostęp wraca sam z currentEntitlements. Po anulowaniu subskrypcji w połowie miesiąca od razu dostaje blokadę zamiast obiecanego P3 B (501). (3) Recenzent App Store z 3.1 i 5.6: ujawnienia są komplet. Słabe punkty: zakup dożywotni przy subskrypcji bez uprzedzenia (503) i „Subskrybuj” przy posiadanym planie (504). (4) Analityk konkurencji: ceny kilkukrotnie niższe od rynku, dożywotni obecny jak u liderów; espresso to wyróżnik, ale niesprawdzony we wszystkich krajach (506).

**Rejestr założeń:** docs/zalozenia.md nie istnieje (sprawdzone, brak). Nie proponuję zmian statusów.

## Pokrycie (co sprawdzono, czego nie)

| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| Adapter natywny, sztuczny, interfejs (`lib/store-native.ts`, `lib/store-fake.ts`, `lib/store-adapter.ts`) | tak, w całości | lektura; dowody/biblioteka-expo-iap-openiap.txt |
| Logika dostępu i limitu (`lib/access.ts`, `lib/entitlement.ts`, `lib/state/finish.ts` zapis dni, `lib/start.ts`) | tak | lektura + sonda: dowody/sonda-dostep-ekran.txt |
| Ekran zakupu, karta Ustawień, okno „Uczciwe zasady”, karta importu, licznik | tak (kod + render w Jest) | sonda S2; lektura |
| Biblioteka expo-iap 5.8.1 (JS) i openiap 3.6.0 (Swift) — displayPrice, filtr wygasłych, zarządzanie subskrypcją, przywracanie | tak (kod źródłowy) | dowody/biblioteka-expo-iap-openiap.txt |
| Dokumentacja Apple (displayPrice, Storefront, sandbox/TestFlight, 3.1.2(b), strona subskrypcji) | tak, 27.10.2026 | dowody/apple-zrodla-2026-10-27.txt, dowody/e0b-linia-bazowa-rynek.txt |
| Decyzje właściciela w docs/18 (oba pliki) i spec docs/27 w obszarze monetyzacji | tak | dowody/decyzje-docs18.txt, dowody/decyzja-kolejnosc-23-10.txt |
| Rynek i recenzje (storefront PL, recenzje pl/us) | tak | dowody/e0b-linia-bazowa-rynek.txt |
| Zakupy na urządzeniu, piaskownica, StoreKit Testing w Xcode | **nie sprawdzono** (brak macOS i telefonu) | kroki właściciela w 502 i w „Do sprawdzenia” |
| Ustawienia App Store Connect (ceny we wszystkich krajach, karencja 16 dni, Family Sharing) | **nie sprawdzono** (brak dostępu do ASC; przebiegów `asc-kontrola.yml` nie uruchamiano) | według docs/monetyzacja.md i docs/40 |
| Dysk Google właściciela (badanie konkurencji, arkusz rachunku) | **nie sprawdzono** (niedostępny w tej sesji) | — |
| Uwaga T-04 (ikony przy największym tekście) | poza obszarem roli (rola 04/07) | — |

## Kontrola dowodów i sekretów

Wynik `node /home/user/trening/audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs <raport> /home/user/trening /home/user/trening/audit/M1-2026-10-27/role/02-monetyzacja-b --rola 02-monetyzacja`: dowody/sprawdz-raport.txt (kod 0). Raport i dowody bez e-maili, UDID, sekretów i nazw innych aplikacji (konkurenci tylko jako trackId). `git status --porcelain` na początku i na końcu jest pusty (dowody/e0-srodowisko.txt, dowody/git-status-koniec.txt). Sondy powstały wyłącznie w worktree w scratchpadzie.

## Stosowalność listy kontrolnej

| Pozycja | Status | Wynik |
|---|---|---|
| MON-01 | dotyczy | ok: subskrypcje odnawiane + Non-Consumable, bez okresu próbnego; limit liczony użyciami (dni z treningiem), nie czasem od instalacji |
| MON-02 | dotyczy | ok: dostęp z currentEntitlements, kv tylko jako pamięć; sonda S3 „ponowna instalacja” daje full; Family Sharing źródło `family` |
| MON-03 | dotyczy | ok: „Przywróć zakupy” na ekranie zakupu (z Ustawień przez wiersz „Pełna wersja”); bez zakupu → „none” (sonda S3) |
| MON-04 | dotyczy | ok: nasłuch od startu (`lib/entitlement.ts:71`), dostęp z currentEntitlements |
| MON-05 | dotyczy | ok: jeden magazyn (`useSyncExternalStore`), test subscription-ui „wygasły dostęp po zdarzeniu transakcji” |
| MON-06 | dotyczy | ok: wszystkie drogi startu przez `guardLiveStart` (mapa bramek) |
| MON-07 | dotyczy | ok: historia, wstecz, kopia, eksport bez bramki (`lib/access.ts:246-249`) |
| MON-08 | dotyczy | ok: błąd = unknown, karencja offline 7 dni (decyzja P6 A; wektor modułu „wygasła, offline” różni się decyzją, nie błędem) |
| MON-09 | dotyczy | znalezisko 02-monetyzacja-501 (P3 B); warunek `&&`/`\|\|` ok, licznik trwały i nie maleje po usunięciu, ponowna instalacja rozstrzygnięta (R-M5-5) |
| MON-10 | dotyczy | znaleziska 02-monetyzacja-502, 02-monetyzacja-503; ujawnienia (okres, odnawianie, cena z `displayPrice`, przywracanie, linki) obecne |
| MON-11 | dotyczy | znaleziska 02-monetyzacja-504, 02-monetyzacja-505; brak czarnych wzorców |
| MON-12 | dotyczy | ok: ID w `lib/products.ts`, sztuczny sklep tylko przy `EXPO_PUBLIC_STORE_FAKE` (strażnik testflight.yml), jeden ekran zakupu |
| MON-13 | nie dotyczy | przed wydaniem w sklepie nie ma nabywców ze sklepu; testerzy w piaskownicy (docs/27 3.12) |
| MON-14 | dotyczy | ok: expo-iap bez usługi zewnętrznej (P10 A, docs/30), strażnik IAPKit |
| MON-15 | dotyczy | znalezisko 02-monetyzacja-507 (P3 B testowane na nierealnym kształcie); MON-02/03/07/08 mają testy |
| MON-16 | rozstrzygnięte decyzją 22.10.2026 (M5 S1) | kierunek zgodny z linią bazową (dopisywanie wstecz zostawia główną pracę darmową) |
| MON-17 | dotyczy | znalezisko 02-monetyzacja-506 (espresso w krajach); kwoty modelu mają źródło |
| MON-18 | rozstrzygnięte decyzją (W0 21.10 + DEC-07 K8 23.10; polecenie M1) | nie liczone w tej roli |
| SP-09 (cudza, rola 04) | dotyczy | wiersz „Pełna wersja” i karta posiadania: w 02-monetyzacja-504 |

**Zgodność kodu z decyzjami właściciela (docs/18-*.md; docs/decyzje.md nie istnieje):**

| Decyzja (data, miejsce) | Kod (plik:linia) | Test-strażnik | Wynik |
|---|---|---|---|
| 12.10 jeden przełącznik płatności (`docs/18-przekazanie.md:169`) | `lib/access.ts:24` | tests/m5s1-dni-treningowe.test.ts (ENABLED w źródle) | zgodne |
| 12.10 expo-iap; 22.10 wersja przypięta 5.8.1 (`docs/18-przekazanie.md:445`) | package.json (5.8.1) | `tests/m5s1-dni-zapis.test.ts:173` | zgodne |
| 12.10 P3 B (`docs/18-przekazanie.md:176`) | `lib/access.ts:26`, `lib/access.ts:135-143` | tests/m5s1-dni-treningowe.test.ts (10b), `tests/entitlement.test.ts:121` — oba z wygasłym wpisem na liście | **niezgodne w produkcji** → 501, 507 |
| 12.10 P6 A offline 7 dni | `lib/access.ts:27`, `lib/access.ts:103` | tests/entitlement.test.ts | zgodne |
| 12.10 Family Sharing TAK | `lib/store-native.ts:48`, `app/paywall.tsx:70` | tests/subscription-ui.test.tsx (rodzina), tests/asc-kontrola.test.ts | zgodne w kodzie; ASC nie sprawdzono; docs/27 3.9 (Ustawienia) częściowo → 504 |
| 12.10 P7 A karencja (ASC) | `lib/store-native.ts:69-83` | tests/audit-m1-012-status.test.ts | kod zgodny; ustawienie ASC nie sprawdzono |
| 12.10 P8 A kody | `app/paywall.tsx:96` | tests/subscription-ui.test.tsx | zgodne |
| 12.10 P9 A standardowa licencja | `lib/products.ts:41` | tests/store-adapter.test.ts | zgodne |
| 12.10 spec docs/27 przyjęta "zgodnie z rekomendacją" (`docs/18-przekazanie.md:177`): ostrzeżenie przed dożywotnim przy subskrypcji (`docs/27-subskrypcja-spec.md:183`) | `app/paywall.tsx:72` (tylko po zakupie) | brak | **bez wdrożenia** → 503 |
| j.w.: zarządzanie przez systemowy arkusz (`docs/27-subskrypcja-spec.md:165`) | `lib/store-native.ts:126` (URL) | brak | **niezgodne** → 505 |
| 13.10 Ukraina: niższy punkt cenowy (`docs/18-przekazanie.md:179`) | ASC (poza kodem); `store/asc-kontrola.json:10` nie obejmuje UKR | brak | **bez wdrożenia/zamknięcia** → 506 |
| 14.10 D-1 płatności od 1.0 (`docs/18-przekazanie.md:270`) | `lib/access.ts:24` | tests/m5s1-dni-treningowe.test.ts | zgodne |
| 20–21.10 ceny 0,99/6,99/14,99 USD, PL 4,99/19,99/59,99, EUR 0,99/7,99/17,99 | `store/asc-kontrola.json:20-24` (kontrola), kod bez kwot | tests/asc-kontrola.test.ts, tests/prices-decision.test.ts | zgodne po stronie repo; ASC według docs (przebieg 39822823188, nie odtwarzano) |
| 21.10 opis bez kwot + espresso z przypisem (`docs/18-przekazanie.md:397`) | store/app-store-metadata.json | tests/audit-m1-045-store-description.test.ts | tekst zgodny; kraje niesprawdzone → 506 |
| 22.10 M5 S1: 5 dni, bez próby, wstecz poza limitem (`docs/18-przekazanie.md:441`) | `lib/access.ts:25`, `lib/state/finish.ts:91` | tests/m5s1-*.test.ts | zgodne |
| 22.10 (A) ekran zakupu tylko przy limicie i w Ustawieniach; 25.10 okno + karta (`docs/18-przekazanie.md:515`) | `lib/entitlement.ts:112`, `components/SubscriptionCard.tsx:16`, `components/FairRulesSheet.tsx:20`, `components/ImportProCard.tsx:22` | tests/entitlement.test.ts, tests/monetyzacja-ui.test.tsx, .maestro/56 | zgodne |
| 22.10 (B) nagłówek ekranu ofert (`docs/18-przekazanie.md:442`) | `app/paywall.tsx:66` | tests/subscription-ui.test.tsx | zgodne; pokazywany także płacącym (decyzja tego nie rozstrzyga) → 504 |
| 22.10 (C) nazwy planów | `app/paywall.tsx:24` | `tests/m5s1-bez-proby.test.ts:83` | zgodne |
| 22.10 prośba o ocenę po 3. treningu (`docs/18-przekazanie.md:443`) | `lib/review.ts:14` | tests (review) | zgodne |
| 22.10 tekst limitu wariant B (`docs/18-przekazanie.md:444`) | `app/paywall.tsx:62-65` | tests/subscription-ui.test.tsx | zgodne |
| 22.10 (2)(3)(4)(5) dopisanie nie zużywa, usunięcie nie zwraca, "limit tylko się luzuje", licznik bez zdania (`docs/18-przekazanie.md:445`) | `lib/state/finish.ts:90-93`, `components/StartPanel.tsx:67` | tests/m5s1-dni-zapis.test.ts, tests/limity-wydan.json (tylko dni i ALWAYS_AVAILABLE) | zgodne; strażnik "luzowania" bez progu minut i P3 → 507 |
| 23.10 próg 7 min (`docs/18-przekazanie.md:484`) | `lib/access.ts:31` | tests/m5s1-dni-zapis.test.ts | zgodne |
| 23.10 DEC-07 K1 nazwa "Pełna wersja" (`docs/18-przekazanie.md:470`) | `app/_layout.tsx:119` | tests/subscription-ui.test.tsx | zgodne |
| 23.10 kolejność mies./rok/dożyw., domyślnie mies. (`docs/18-przekazanie.md:481`) | `lib/products.ts:19`, `app/paywall.tsx:36` (roczny) | `tests/m5s1-bez-proby.test.ts:86` pilnował **starego** stanu | nigdy niewdrożona; zastąpiona 27.10 (nie znalezisko) → mechanizm 507 |
| 27.10 kolejność zostaje jak w kodzie (polecenie M1) | `lib/products.ts:19`, `app/paywall.tsx:36` | `tests/m5s1-bez-proby.test.ts:86`, `tests/store-adapter.test.ts:34` | zgodne (zapis w docs/18 jeszcze brak — commit sprzed decyzji) |
| 25.10 okno, karta, link espresso (`docs/18-przekazanie.md:535`) | `lib/fairrules.ts:11-14`, `lib/products.ts:33` | tests/monetyzacja-ui.test.tsx | zgodne |

## Znaleziska (szczegóły)

### 02-monetyzacja-501 · Po wygaśnięciu albo cofnięciu Pro dni treningowe z okresu Pro zużywają darmowy limit (P3 B nie działa z prawdziwym sklepem)
- Pozycja listy kontrolnej: MON-09
- Poziom: P1
- Realność: realny (każdy, kto anuluje subskrypcję, trenował w Pro co najmniej 5 dni w miesiącu wygaśnięcia, a potem chce trenować dalej za darmo; to samo przy cofnięciu z Chmury rodzinnej i przy zwrocie) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: P3 B wymaga, żeby wygasłe uprawnienie było na liście: `freeSince` liczy start okresu darmowego z końca uprawnień przekazanych w liście (`lib/access.ts:135-143`, użyte w `lib/access.ts:238`). Natywny adapter czyta `getAvailablePurchases({ onlyIncludeActiveItemsIOS: true })` (`lib/store-native.ts:70`), a openiap 3.6.0 przy tej opcji pomija transakcje z datą wygaśnięcia w przeszłości. Zwrotów i cofnięć nie ma w currentEntitlements. Po wygaśnięciu lista jest więc pusta, `freeSince` = null i liczą się wszystkie dni miesiąca. Sonda (dowody/sonda-dostep-ekran.txt, exit 0): "pusta lista (kształt natywny) -> allowed=false used=7" oraz "lista z wygasłym (kształt sztucznego sklepu) -> allowed=true used=0"; adapter natywny z makietą expo-iap: "level=free used=7 allowed=false". Testy decyzji podają wygasły wpis wprost (`tests/entitlement.test.ts:123`, test 10b w tests/m5s1-dni-treningowe.test.ts). Sztuczny sklep zachowuje wygasłe wpisy, więc E2E (scenariusz 21, panel "expire access") też tego nie widzi. Kod biblioteki: (dowody/biblioteka-expo-iap-openiap.txt).
- Wzorzec lub źródło: decyzja właściciela 12.10.2026 P3 B (`docs/18-przekazanie.md:176`); docs/monetyzacja.md: "Po wygaśnięciu Pro liczą się dni od chwili wygaśnięcia (P3 B)". Apple, currentEntitlements: "Products that the App Store has refunded or revoked don’t appear" (cytat z modułu storekit-expo).
- Kroki w aplikacji: kup miesięczny 1.11 → trenuj na żywo 8 dni → anuluj, subskrypcja wygasa 20.11 → 21.11 „Start” w nowym dniu → ekran „Jesteśmy z Ciebie dumni! … wykorzystujesz wszystkie darmowe dni treningowe (5)” zamiast startu. Licznik na ekranie Trening pokazuje 0 z 5. Tekst pochwały mówi o darmowych dniach, które w rzeczywistości były dniami Pro.
- Opcje: (a) zapamiętać koniec ostatniego uprawnienia (pamięć `access` już ma `expiresAt`, przy przejściu full → free zapisać `freeSince`) i podawać go do `canStartLive` — tanie, lokalne, działa offline; kompromis: po ponownej instalacji w tym samym miesiącu pamięci nie ma (brzegowe). (b) Czytać `Transaction.all` / `getAvailablePurchases({ onlyIncludeActiveItemsIOS: false })` tylko do wyznaczenia daty ostatniego wygaśnięcia — dokładne także po reinstalacji; kompromis: więcej kodu w adapterze, nowy wektor testów. (c) Zmienić decyzję na P3 A (liczyć wszystkie dni) — wtedy zmienić tekst ekranu limitu; kompromis: gorzej dla byłego płacącego. Rekomendacja: (a) przed 1.0 (mała zmiana, dotyczy obietnicy wobec płacących); (b) w 1.0.x, jeśli właściciel chce odporności na reinstalację.
- Test akceptacyjny: adapter natywny z makietą expo-iap, która nie zwraca wygasłej subskrypcji (dokładnie jak openiap): 7 dni treningu w Pro przed wygaśnięciem, 0 po → start w nowym dniu dozwolony, licznik 5 z 5. Test P3 B w tests/m5s1-dni-treningowe.test.ts i tests/entitlement.test.ts działa na kształcie z adaptera natywnego, nie na liście z wygasłym wpisem. To samo dla cofnięcia z rodziny i zwrotu.
- Status: otwarte

### 02-monetyzacja-502 · T-11: cena na liście planów (USD) różna od ceny w arkuszu Apple (PLN); przyczyna niewyjaśniona, ryzyka nie ma w rejestrze, a lista telefonu tego nie sprawdza
- Pozycja listy kontrolnej: MON-10
- Poziom: P1 (otwarte, niepotwierdzone ryzyko wprowadzenia w błąd przy płatności; według CLAUDE.md otwarte ryzyko blokuje wydanie; gdyby wystąpiło w produkcji, byłoby P0)
- Realność: realny w TestFlight (obserwacja właściciela, build 1031, konto testerki PL, wszystkie 3 plany); w produkcji brzegowy — [DO USTALENIA] · Pewność: wysoka co do braku zamknięcia ryzyka; średnia co do przyczyny
- Rodzaj: M (zachowanie StoreKit i sklepu)
- Dowód: aplikacja pokazuje wyłącznie `displayPrice` ze StoreKit (`lib/store-native.ts:52-57`, `app/paywall.tsx:29-31`). openiap 3.6.0 bierze go z `StoreKit.Product.products(for:)` bez przeliczeń i bez pamięci podręcznej między wejściami na ekran (dowody/biblioteka-expo-iap-openiap.txt). Sztuczny sklep (ceny w USD, `lib/store-fake.ts:12`) jest wykluczony: arkusz Apple się pokazał, a testflight.yml przerywa build ze zmienną sztucznego sklepu. Apple, Product.displayPrice: "The storefront that the user’s device is connected to determines the locale." Sandbox: "Apps that you download from TestFlight always run in the sandbox environment" oraz "you see the Apple In-App Purchases appropriate to the region assigned to your Sandbox Apple Account" (dowody/apple-zrodla-2026-10-27.txt). Najbardziej prawdopodobna przyczyna: na telefonie zalogowane jest konto Sandbox (Ustawienia → Programista) z regionem USA, które decyduje o storefroncie pobranych produktów, a arkusz zakupu przypisuje zakup kontu produkcyjnemu PL. To hipoteza; z Linuksa jej nie potwierdzę. Kwoty: lista miesięczna 0,99 USD ≈ 3,91 zł, pobranie 4,99 zł (sekcja "Rachunek"). W rejestrze ryzyk brak wpisu (`docs/40-lekcje.md:9`); lista telefonu sprawdza tylko cenę w arkuszu (`docs/49-testflight-1-0.md:26`).
- Wzorzec lub źródło: developer.apple.com/app-store/subscriptions/ (27.10.2026): "Full renewal price, shown clearly and prominently, and localized in available currencies"; 5.6: "trick them into making unwanted purchases".
- Kroki w aplikacji: TestFlight, konto PL → Ustawienia → Subskrypcja → „Pełna wersja” → lista „$0.99/miesiąc”… → „Subskrybuj” → arkusz 4,99 zł.
- Opcje: (a) Zamknąć przed zgłoszeniem krokiem właściciela (ok. 10 min): na telefonie testerki Ustawienia → Programista → konto Sandbox: wylogować (albo w App Store Connect → Sandbox ustawić region Polska, wylogować i zalogować ponownie); wymusić zamknięcie aplikacji i otworzyć ekran zakupu. Oczekiwane: lista w zł równa kwotom arkusza. Jeśli lista nadal jest w USD bez żadnego konta Sandbox, wstrzymać wydanie i badać dalej (zgłoszenie do Apple, (b)). Kompromis: wymaga telefonu, ale rozstrzyga przyczynę. (b) Dodać w kodzie zabezpieczenie: przed pokazaniem cen porównać `getStorefront()` (kod kraju) z walutą produktu i przy niezgodności pokazać „Ceny są niedostępne — spróbuj ponownie” zamiast kwot; kompromis: nowy kod w zamrożeniu zakresu, ryzyko fałszywych blokad. (c) Wydać i sprawdzić od razu po publikacji na produkcyjnej instalacji (ekran zakupu vs ceny zakupów na stronie sklepu w PL), bez wcześniejszego zamknięcia; kompromis: ryzyko trafia do pierwszych płacących. Rekomendacja: (a) + wpis R-0xx w rejestrze ryzyk z warunkiem zamknięcia „lista = arkusz w PLN na telefonie bez konta Sandbox” + nowy punkt T-11(e) w docs/49: „cena na liście planów = cena w arkuszu, ta sama waluta”.
- Test akceptacyjny: zapis z datą i buildem: telefon z kontem PL bez konta Sandbox, lista 4,99 / 19,99 / 59,99 zł = arkusz. Wpis w rejestrze ryzyk zamknięty tym dowodem. Punkt listy kontrolnej dopisany.
- Status: otwarte

### 02-monetyzacja-503 · Subskrybent wybierający plan dożywotni nie widzi przed zakupem, że subskrypcja dalej się odnawia (podwójna płatność; wymóg docs/27 3.11 bez wdrożenia)
- Pozycja listy kontrolnej: MON-10
- Poziom: P1
- Realność: brzegowy (subskrybent, który przechodzi na dożywotni — typowa ścieżka „podoba mi się, kupię na zawsze”; skutek pieniężny dotyczy użytkownika) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: przy aktywnej subskrypcji ekran pokazuje pełną listę planów (`app/paywall.tsx:76`) z "Kup na zawsze" dla dożywotniego (`app/paywall.tsx:32`), a uwaga o odnawianiu pojawia się dopiero po zakupie dożywotniego (`app/paywall.tsx:72`). Spec przyjęta 12.10: "Na ekranie zakupu przy aktywnej subskrypcji ta sama uwaga przed zakupem." (`docs/27-subskrypcja-spec.md:183`). Sonda S2 (dowody/sonda-dostep-ekran.txt): "ostrzeżenie o odnawiającej się subskrypcji PRZED zakupem=false"; po zakupie w sklepie są monthly i lifetime.
- Wzorzec lub źródło: 3.1.2(b) (odczyt 27.10.2026): "should not be able to inadvertently subscribe to multiple variations of the same thing"; zasada roli 6 („Uczciwie albo wcale”).
- Kroki w aplikacji: aktywny miesięczny → Ustawienia → „Pełna wersja” → zaznacz „Trening to moje życie” → „Kup na zawsze” → arkusz Apple → zapłacone; subskrypcja odnawia się dalej.
- Opcje: (a) przy aktywnej subskrypcji i zaznaczonym dożywotnim pokazać nad przyciskiem zdanie z docs/27 + „Zarządzaj subskrypcją” (tekst już jest w słowniku); kompromis: drobna zmiana UI w zamrożeniu (naprawa blokera). (b) Okno potwierdzenia przed `purchasePlan('lifetime')` przy aktywnej subskrypcji; kompromis: dodatkowe stuknięcie, wzorzec okien z docs/32. Rekomendacja: (a).
- Test akceptacyjny: render ekranu z aktywną subskrypcją (także z Chmury rodzinnej i z kodu — wtedy bez sugestii „anuluj”, jeśli nie płaci sam) i zaznaczonym dożywotnim → widoczne zdanie przed zakupem (PL, EN, VoiceOver).
- Status: otwarte

### 02-monetyzacja-504 · Płacący widzi „5 dni za darmo”, pełną ofertę i „Subskrybuj” przy posiadanym planie; stan nie nazywa planu; „Dostęp do {data}” przy odnawianej subskrypcji wygląda jak koniec; w Ustawieniach brak „Chmury rodzinnej”
- Pozycja listy kontrolnej: MON-11 (+ SP-09 roli 04 dla brzmienia i wyglądu)
- Poziom: P2
- Realność: realny (każdy płacący subskrybent, który otworzy ekran z Ustawień — obserwacja właściciela T-11) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: nagłówek ofertowy nie zależy od stanu (`app/paywall.tsx:66`). Lista planów i CTA są ukryte tylko dla dożywotniego (`app/paywall.tsx:76`). Domyślny wybór to roczny (`app/paywall.tsx:36`), więc rocznemu subskrybentowi ekran proponuje "Subskrybuj" na jego własnym planie. Karta posiadania pokazuje "Masz pełną wersję" i datę końca okresu (`app/paywall.tsx:69-71`) bez nazwy planu. Wiersz w Ustawieniach ma tytuł "Pełna wersja" niezależnie od stanu (`components/SubscriptionCard.tsx:16`) i nie mówi o rodzinie (wymóg w `docs/27-subskrypcja-spec.md:158`). Sonda S2: nagłówek "Trenuj 5 dni w miesiącu za darmo…" przy aktywnej miesięcznej, plan-yearly/monthly/lifetime = true, "Subskrybuj" = true, nazwa planu w karcie = false; roczna aktywna → zaznaczony yearly + "Subskrybuj". Apple nie pobierze drugi raz za ten sam plan, ale ekran wygląda tak, jakby zakup się nie udał.
- Wzorzec lub źródło: 3.1.2(b) (odczyt 27.10.2026, j.w.); linia bazowa pkt 5.
- Kroki w aplikacji: kup roczny → Ustawienia → „Pełna wersja” → nagłówek o darmowych dniach, „Masz pełną wersję / Dostęp do 27.10.2027”, poniżej zaznaczony roczny i „Subskrybuj”.
- Opcje: (a) Stan płacący: nagłówek „Masz Pro: {nazwa planu}” + „Odnawia się {data}” (subskrypcja) / „z Chmury rodzinnej” / „z kodu do {data}”; lista planów zwinięta pod „Zmień plan” bez zaznaczonego posiadanego planu, posiadany oznaczony „Twój plan”; w Ustawieniach podtytuł z nazwą planu i rodziną. (b) Minimalnie przed 1.0: ukryć nagłówek ofertowy i listę przy aktywnym uprawnieniu, zostawić kartę + „Zarządzaj subskrypcją”; zmianę planu oddać do arkusza Apple. Rekomendacja: (b) przed 1.0, jeśli właściciel uzna to za konieczne; inaczej (a) w 1.0.x z projektem roli 04.
- Test akceptacyjny: render z aktywną miesięczną, roczną, rodzinną i z kodu: brak nagłówka „za darmo”, nazwa posiadanego planu widoczna, przy posiadanym planie brak „Subskrybuj”; Ustawienia pokazują plan i źródło.
- Status: otwarte

### 02-monetyzacja-505 · „Zarządzaj subskrypcją” otwiera stronę App Store, a nie systemowy arkusz (docs/27 3.10); w TestFlight pokazuje produkcyjną listę bez zakupów testowych
- Pozycja listy kontrolnej: MON-11
- Poziom: P2
- Realność: realny w TestFlight (obserwacja właściciela); w produkcji działa, ale wyprowadza z aplikacji · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: `lib/store-native.ts:126` woła `deepLinkToSubscriptions()`, które w expo-iap 5.8.1 na iOS robi `Linking.openURL('https://apps.apple.com/account/subscriptions')` (`node_modules/expo-iap/src/modules/ios.ts:378-379`). Natywne `AppStore.showManageSubscriptions(in:)` istnieje w openiap (wywołanie `showManageSubscriptionsIOS`), ale nie jest używane. Komentarz interfejsu obiecuje arkusz (`lib/store-adapter.ts:44`), a spec go wymaga (`docs/27-subskrypcja-spec.md:165`). Dowód biblioteki: (dowody/biblioteka-expo-iap-openiap.txt).
- Wzorzec lub źródło: strona subskrypcji Apple (27.10.2026): "You can use the showManageSubscriptions(in:) method to let them manage their subscription within your app."
- Kroki w aplikacji: TestFlight, po zakupie → „Zarządzaj subskrypcją” → Safari/App Store z kontem produkcyjnym → brak subskrypcji testowej; tester nie anuluje jej z aplikacji.
- Opcje: (a) Użyć `showManageSubscriptionsIOS` z expo-iap (arkusz w aplikacji, działa w piaskownicy), z linkiem jako zapasem przy błędzie; kompromis: zmiana adaptera i kontraktu testowego. (b) Zostawić link i poprawić komentarz oraz docs/27; testerom podać drogę przez Ustawienia → Programista → konto Sandbox; kompromis: słabsza zgodność z zaleceniem Apple. Rekomendacja: (a) w 1.0.x (produkcja działa), (b) od razu (dokumenty).
- Test akceptacyjny: tests/store-native-contract: `manageSubscriptions` woła `showManageSubscriptionsIOS`; krok telefonu: arkusz pokazuje subskrypcję piaskownicy.
- Status: otwarte

### 02-monetyzacja-506 · Porównanie „jak jedno espresso” w opisie (33 lokalizacje) nie jest sprawdzone dla wszystkich krajów sprzedaży; decyzja o Ukrainie z 13.10 bez wdrożenia i bez zamknięcia
- Pozycja listy kontrolnej: MON-17
- Poziom: P2
- Realność: brzegowy (równoważniki Apple dla 0,99 USD w większości krajów leżą w okolicy 1 €; nie sprawdzono, czy gdzieś wyraźnie przekraczają 1,51 €) · Pewność: wysoka co do braku sprawdzenia
- Rodzaj: P (decyzja produktowa)
- Dowód: opis sklepu we wszystkich lokalizacjach: "plan miesięczny w cenie porównywalnej z jednym espresso w barze*" z przypisem o cenach we Włoszech 1,06–1,51 € (store/app-store-metadata.json). Warunek otwarty w źródle: `docs/research/espresso-mimit-2026-10.md:19` ("ceny planu miesięcznego we wszystkich krajach … do sprawdzenia"). Kontrola ASC obejmuje 8 terytoriów i strefę euro (`store/asc-kontrola.json:10`). Decyzja 13.10 o Ukrainie (`docs/18-przekazanie.md:179`) jest wciąż "[OTWARTE]" w `docs/15-app-store.md:135` i nie ma jej w kontroli. Dostępność: wszystkie kraje poza Chinami (`docs/18-przekazanie.md:591`). Rachunek PL: 4,99 zł ≈ 1,13 € (dowody/kursy-nbp.txt).
- Wzorzec lub źródło: 2.3.1 i zasada 2 wspólna (dowód zamiast deklaracji); CLAUDE.md „Nie zgaduj liczb”.
- Kroki w aplikacji: n/d (opis sklepu); czytelnik w kraju, w którym 0,99 USD to wyraźnie więcej niż 1,51 €, dostaje nieprawdziwe porównanie.
- Opcje: (a) Właściciel eksportuje z App Store Connect ceny planu miesięcznego we wszystkich krajach (Pricing → View all prices, ok. 5 min); agent porówna je z 1,51 € i wskaże kraje do korekty albo do usunięcia zdania w danej lokalizacji. (b) Rozszerzyć `asc-kontrola` o wszystkie terytoria i próg (≤ 1,51 € po kursie); kompromis: zmiana workflowu, przebieg dowodowy. (c) Formalnie zamknąć decyzję UA z 13.10 jako zastąpioną brzmieniem „porównywalnej” z 21.10. Rekomendacja: (a) przed zgłoszeniem + (c); (b) w 1.0.x.
- Test akceptacyjny: zapis w docs/research z datą: lista krajów z ceną miesięczną w EUR, wszystkie ≤ 1,51 € albo wskazane korekty; decyzja UA ze statusem w docs/18.
- Status: otwarte

### 02-monetyzacja-507 · Decyzja właściciela zapisana bez testu-strażnika i bez sprawdzenia wdrożenia (kolejność planów 23.10; P3 B; „limit tylko się luzuje” bez progu minut) — luka systemowa
- Pozycja listy kontrolnej: MON-15
- Poziom: P2
- Realność: realny (trzy przypadki w jednym obszarze w ciągu tygodnia) · Pewność: wysoka
- Rodzaj: P (model pracy)
- Dowód: (1) Decyzja 23.10 (`docs/18-przekazanie.md:481`) ma dopisek "Wdrożenie: gałąź naprawa-m1-dec07-ui". Scalona gałąź zawierała tylko test K9 i niczego nie zmieniła w kolejności planów. Test z 22.10 nadal przypinał stary stan (`tests/m5s1-bez-proby.test.ts:86`, `tests/store-adapter.test.ts:34`) i przechodził. Rozjazd wykrył dopiero właściciel na telefonie 27.10 (dowody/decyzja-kolejnosc-23-10.txt). (2) Strażniki P3 B przechodzą na danych, których natywny adapter nie wytwarza (501). (3) Strażnik "limit tylko się luzuje" (tests/limity-wydan.json, decyzja `docs/18-przekazanie.md:445`) obejmuje liczbę dni i ALWAYS_AVAILABLE. Nie obejmuje progu minut (`lib/access.ts:31`; zmiana 20 → 7 min zaostrzyła limit) ani P3 (`lib/access.ts:26`).
- Wzorzec lub źródło: CLAUDE.md „Lekcje po błędach” (akcja ma być mechanizmem) i ocena zakresu: **systemowa**.
- Kroki w aplikacji: n/d (proces).
- Opcje: (a) Każdy wpis decyzji w docs/18 z polem „strażnik: plik testu / nazwa testu” albo „bez strażnika: powód”; test `tests/decyzje-straznik.test.ts` sprawdza, że wskazany plik istnieje i zawiera nazwę testu; decyzja zmieniająca zachowanie bez strażnika = czerwony verify. Kompromis: dyscyplina zapisu, ok. 1 h agenta na wsteczne uzupełnienie obszaru monetyzacji. (b) Przy decyzji, która odwraca stan pilnowany testem, agent najpierw zmienia ten test na nowy stan (czerwony), dopiero potem kod; reguła w CLAUDE.md + krok listy koordynatora przy scalaniu („czy decyzje z docs/18 tej gałęzi mają zmieniony test”). Kompromis: bez automatu. (c) Rozszerzyć tests/limity-wydan.json o `MIN_LIVE_MINUTES_FOR_DAY` (może tylko rosnąć) i `COUNT_FULL_STARTS_IN_EXPIRY_MONTH` (tylko false). Rekomendacja: (a) + (c); lekcja w docs/40 dla przypadku kolejności planów (właściciel trafił na rozjazd).
- Test akceptacyjny: strażnik decyzji czerwony na wpisie bez pola „strażnik”; limity-wydan zawiera próg minut i P3.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- **Przyczyna T-11** (502): hipoteza o koncie Sandbox z regionem USA. Brakuje stanu Ustawienia → Programista na telefonie testerki i wyniku kroku (a).
- **Zakupy na urządzeniu w docs/48 Z-09: zwrot i Chmura rodzinna.** Uwagi właściciela obejmują zakup, dożywotni, przywracanie i offline, ale nie zwrot ani rodzinę. Krok: zwrot w piaskownicy (Ustawienia → Programista → konto Sandbox → historia zakupów / zwrot) → po powrocie do aplikacji stan free; drugi członek rodziny testowej → „Dostęp z Chmury rodzinnej”, po usunięciu z rodziny → free. Oczekiwane według kodu: oba działają (sonda S3), ale przy tym trafia 501.
- **Ustawienia ASC:** karencja 16 dni (P7 A), ceny we wszystkich krajach (506), Family Sharing na trzech produktach. Brakuje dostępu do ASC i przebiegu `asc-kontrola.yml` z dzisiejszego SHA.
- **StoreKit offline po ponownej instalacji:** czy `currentEntitlements` bez sieci po świeżej instalacji zwraca pustą listę (wtedy stan free zapisany jako pewny) czy błąd. Nie da się tego sprawdzić bez urządzenia. Właściciel potwierdził „przywracanie po reinstalacji i offline OK”, ale nie rozdzielił kolejności (najpierw sieć, potem offline).

## Co działa dobrze i należy zachować

- Błąd odczytu sklepu = `unknown`, nigdy `free`. Pomocnicze zapytanie o karencję nie unieważnia zakupów (`lib/store-native.ts:62-83`).
- Jeden strażnik na wszystkich drogach startu; dane, wstecz, kopia i eksport zawsze dostępne, a „limit tylko się luzuje” jest zapisany testem.
- Ceny wyłącznie z `displayPrice`, bez kwot w kodzie i słownikach. Bez sieci ekran nie zgaduje cen.
- Dni treningowe zapisane osobno (usunięcie nie zwalnia dnia), strefa startu, trening przez północ, kolejny trening tego samego dnia — z testami.
- Brak usług zewnętrznych w ścieżce zakupu (strażnik IAPKit), sztuczny sklep odcięty od TestFlight strażnikiem w workflowie.
- Ceny kilkukrotnie niższe od rynku PL i dożywotni obok subskrypcji — zgodnie z tym, za co chwalą płacący w kategorii.

## Decyzje dla właściciela

1. **T-11 przed zgłoszeniem (502).** (a) Krok na telefonie testerki (ok. 10 min): wylogować konto Sandbox i porównać listę z arkuszem; wynik zamyka nowy wpis w rejestrze ryzyk. (b) Dodać w kodzie blokadę cen przy niezgodnej walucie (nowy kod w zamrożeniu). (c) Wydać i sprawdzić od razu po publikacji. **Rekomendacja: (a).**
2. **P3 B (501).** (a) Poprawka przed 1.0 z pamięcią daty wygaśnięcia. (b) Poprawka w 1.0.x, a do tego czasu P3 A (zmiana decyzji). (c) Pełny odczyt historii transakcji w 1.0.x. **Rekomendacja: (a)** — dotyczy obietnicy wobec płacących, zmiana mała i czysta.
3. **Dożywotni przy subskrypcji (503).** (a) Zdanie ostrzegawcze przed zakupem w 1.0. (b) Okno potwierdzenia. (c) Po 1.0. **Rekomendacja: (a)** — tekst już istnieje w słowniku.
4. **Stan płacącego (504).** (a) Pełny projekt stanu „Masz Pro: {plan}” w 1.0.x (rola 04). (b) Minimum w 1.0: bez nagłówka „za darmo” i bez listy przy aktywnym uprawnieniu. **Rekomendacja: (b), jeśli 1.0 i tak wymaga nowego buildu; inaczej (a).**
5. **Espresso we wszystkich krajach (506):** eksport cen z ASC (5 min właściciela) przed zgłoszeniem oraz formalne zamknięcie decyzji o Ukrainie. **Rekomendacja: tak.**
6. **Mechanizm decyzji (507):** (a) pole „strażnik” przy każdej decyzji + test; (b) reguła i krok listy bez automatu. **Rekomendacja: (a)** + rozszerzenie limity-wydan.json.

Czas: praca agenta przy 501 + 503 + 504(b) ok. 2–3 h z testami; 505(a) ok. 1 h; 507 ok. 1–2 h. Czekanie: verify ok. 12 min, E2E pakiet podstawowy, nowy build TestFlight. Czas właściciela: krok T-11 ok. 10 min, eksport cen ok. 5 min, decyzje 1–6 ok. 15 min.

## Proponowane polecenie naprawy

`node tools/assemble.mjs 02-monetyzacja --tryb fix --zadania 02-monetyzacja-501,02-monetyzacja-503,02-monetyzacja-504,02-monetyzacja-505,02-monetyzacja-507` (po decyzjach 2–4 i 6). Wygląd stanu płacącego (504a) przekazać roli 04, a 502 i 506 zamyka właściciel krokami z sekcji decyzji.

Na końcu: `git status --porcelain` → pusty (dowody/git-status-koniec.txt).
