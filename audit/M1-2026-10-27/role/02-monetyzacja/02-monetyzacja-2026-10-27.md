# Audyt: Monetyzacja — Trening — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 (HEAD odłączony, sprawdzony na starcie) · Tryb: audit (wariant głęboki M1) · Moduły: storekit-expo, cena-i-rachunek, audyt-paywalla
Środowisko: Linux (uname: x86_64), Node v22.22.0, git; sieć przez proxy działa (App Store, developer.apple.com, NBP, Sejm; fora Apple blokują curl weryfikacją przeglądarki). Bez macOS, Xcode, symulatora i telefonu; `gh` bez ważnego tokenu (nie był potrzebny). Repozytorium publiczne (CLAUDE.md, ADR-031). Expo web nie uruchamiany (ekran zakupu zależy od modułu natywnego; obserwacje z telefonu właściciela T-11 zastępują zrzut). Pełnych testów, buildu i instalacji nie powtarzano (wyniki E0 w `audit/M1-2026-10-27/wspolne/`); uruchomiono 8 plików Jest obszaru.

## Podsumowanie

Kod płatności jest w dobrym stanie: dostęp liczony z bieżących uprawnień StoreKit, pamięć podręczna tylko do pracy offline, nasłuch od startu, przywracanie przez `AppStore.sync`, jedna bramka na wszystkich drogach startu treningu, dane nigdy nie są zakładnikiem, ceny wyłącznie z `displayPrice`. Wektory modułu `storekit-expo` przechodzą na funkcjach z `lib/access.ts` (17/17, jedno zamierzone odstępstwo: 7 dni karencji offline z decyzji P6 A), a 8 plików testów obszaru: 290/290. Nie znalazłem P0 ani P1. Rozjazd waluty z T-11 nie ma źródła w kodzie (cena to niezmieniony `Product.displayPrice`), pasuje do opisanej wady środowiska TestFlight; ryzyko produkcyjne oceniam jako niskie, ale wymaga jednego sprawdzenia na buildzie z App Store (decyzja 1). Pięć znalezisk P2: ekran zakupu nie rozpoznaje posiadanego planu (T-11), wiersz „Pełna wersja” w Ustawieniach czyta się jak stan, decyzja z 23.10 zapisana jako wdrożona bez wdrożenia i bez strażnika (mechanizm), nieaktualny rachunek i zapis prowizji, oraz brak miary skarg na limit w punkcie kontrolnym.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 02-monetyzacja-001 | P2 | D | Po zakupie ekran zakupu nadal zachęca do subskrypcji i nie nazywa posiadanego planu | otwarte |
| 02-monetyzacja-002 | P2 | D | Wiersz „Pełna wersja” w Ustawieniach (stan darmowy) wygląda jak stan, nie jak wejście do zakupu | otwarte |
| 02-monetyzacja-003 | P2 | P | Decyzja właściciela z 23.10 zapisana jako wdrożona, choć kod i test-strażnik mówiły co innego; brak mechanizmu decyzja → kod → test | otwarte |
| 02-monetyzacja-004 | P2 | M | Rachunek i bramka W0 w docs mają nieaktualne dane wejściowe (kurs, prowizja, liczba płatności w roku) | otwarte |
| 02-monetyzacja-005 | P2 | P | Punkt kontrolny po 8 tygodniach nie mierzy skarg na limit głównej pracy, a rynek PL ocenia głównie hojność darmowej wersji | otwarte |

## Linia bazowa i założenia

Linia bazowa E0b zapisana przed lekturą `docs/monetyzacja.md` i kodu płatności: `dowody/linia-bazowa-e0b.txt` (2026-10-27). Dane: `dowody/rynek-ceny-pl.txt` (5 dzienników treningu siłowego w sklepie PL, nazwy zanonimizowane K1–K5), `dowody/rynek-recenzje-pl.txt` (90 recenzji PL o cenie i płatnej wersji), `dowody/apple-zrodla-2026-10-27.txt` (wytyczne „Last Updated: October 16, 2026”, strona subskrypcji, StoreKit).

Wymiary pokrycia:
- **Modele vs rodzaj wartości:** wartość stała (historia rośnie z każdym treningiem; aktualizacje treści); subskrypcja dopuszczalna wg 3.1.2(a), ale wartość „usługowa” jest skromna (bez chmury), więc potrzebna opcja jednorazowa — jest (dożywotni). Bez opłat / napiwek: odrzucone decyzją 12.10 i 22.10 (badanie z rachunkiem); reklamy odrzucone z rachunkiem (docs/monetyzacja.md). Wynik: zgodne z linią bazową.
- **Za co się płaci i skargi:** w PL wszyscy konkurenci freemium; rejestrowanie treningów zwykle darmowe bez limitu (K1, K4), płatne: limit rutyn, analityka, własne ćwiczenia, RIR, motywy. Skargi: „one big paywall” (K3, 1★, 23.10.2026), „Bez opłacenia aplikacja jest goła” (K5, 1★), dożywotni „zbyt drogi” (K1, K2). Trening limituje główną pracę (5 dni treningowych/mies.), ale jest 4–7× tańszy (PL 4,99 / 19,99 / 59,99 zł vs mediana ok. 18–22 / 105–125 / 400–430 zł). Wynik: rozbieżność kierunku → 02-monetyzacja-005 (P2, decyzja już podjęta, brak tylko miary).
- **Okres próbny i oferty:** brak okresu próbnego (M5 S1); limit dni w miesiącu to limit użyć, nie okres próbny 3.1.1 (nie liczy się od instalacji). Oferty wprowadzające usunięte w App Store Connect — R-M5-3 zamknięte kontrolą ASC (docs/40). Wynik: zgodne.
- **Trwałość zakupu:** wektory zielone (`dowody/wektory-dostep.txt`); telefon 27.10 (build 1031): przywracanie po reinstalacji i offline OK. Family Sharing obsłużone (`lib/store-native.ts:48`). Wynik: zgodne.
- **Ceny w regionach i podatki:** VAT 23% przeczytany dziś (art. 146ef), kurs NBP 3,9542 (209/A/NBP/2026), prowizja 15% (Small Business Program przyjęty 26.10, `docs/18-przekazanie.md:591`). Rachunek → sekcja „Rachunek”; nieaktualne wejścia → 02-monetyzacja-004.
- **Etyka:** brak pilności, „najpopularniejszy”, zawstydzania; „Nie teraz” i „Anuluj”/„Zamknij”; wgląd i eksport zawsze; ocena aplikacji nie odblokowuje niczego. Drobny brak ostrzeżenia przed zakupem dożywotniego przy aktywnej subskrypcji → 02-monetyzacja-001.
- **Miejsce ekranu zakupu:** start ponad limit, Ustawienia, okno „Uczciwe zasady” raz po pierwszym treningu na żywo, karta po imporcie CSV; nie w trakcie treningu. Główna praca widoczna przed zakupem (5 dni). Wynik: zgodne.
- **Próg i lejek:** bramka W0 (21.10, dopisek 23.10) — wynik normalny ok. 471 USD przy 15% < 500 USD, model wybrany świadomie (22.10); tej roli nie liczę ponownie (polecenie M1). Wynik: rozstrzygnięte decyzją.
- **Prywatność i koszt narzędzi:** `expo-iap` 5.8.1 przypięte (`package.json:43`), bez usługi IAPKit (komentarz i test w `lib/store-native.ts:8`), bez SDK analityki; "Data Not Collected". Wynik: zgodne.

Soczewki (osobno, po kolei): (a) oszczędny użytkownik — widzi 5 dni za darmo i ceny ze sklepu, ale w TestFlight cena na liście i w arkuszu różniła się walutą (T-11; Do sprawdzenia 1); (b) pasjonat po roku, nowy telefon — zakup wraca z transakcji, dni limitu i dane wracają z kopii (R-M5-5 przyjęte); (c) recenzent App Store — ujawnienia 3.1.2(c) komplet (nazwa, cena odnowienia z okresem jako największy element, automatyczne odnawianie, Warunki, Prywatność, przywracanie); po zakupie ekran dalej mówi „Subskrybuj” (001); (d) analityk konkurencji — cena to przewaga, ciasna darmowa wersja to ryzyko ocen (005).

Wzorzec najlepszych w klasie: rejestrowanie darmowe, płatna głębia, Pro mies./rok/dożywotni, ceny z `displayPrice`, przywracanie i zarządzanie w aplikacji, stan z transakcji, posiadany plan nazwany. Trening spełnia wszystko poza „posiadany plan nazwany” (001) i darmowym rejestrowaniem bez limitu (świadoma decyzja; 005).

Rejestr założeń: `docs/zalozenia.md` nie istnieje w repo — proponowana hipoteza do zapisu w docs/monetyzacja.md: H-1 „w PL ocena aplikacji zależy bardziej od hojności darmowej wersji niż od ceny Pro” (status: hipoteza, z próbki recenzji; zależne: punkt kontrolny W0).

## Mapa bramek

Źródło stanu wszędzie: `refreshEntitlements` → adapter → `Transaction.currentEntitlements` (przez `getAvailablePurchases({ onlyIncludeActiveItemsIOS: true })`) + status karencji; pamięć podręczna `kv.access` w SQLite tylko dla stanu `unknown`. Grep: `dowody/grep-bramki.txt`.

| Miejsce (plik:linia) | Rodzaj | Co chroni albo zmienia | Źródło stanu | Przepływ / płatna funkcja | Uwagi → ID |
|---|---|---|---|---|---|
| `lib/store-native.ts:70` | odczyt stanu | uprawnienia aktywne | StoreKit currentEntitlements | wszystkie | niezweryfikowana transakcja = wyjątek → `unknown`; MON-02 ok |
| `lib/store-native.ts:77` | odczyt stanu | karencja płatności (P7 A) | subscriptionStatusIOS | subskrybent w karencji | MON-08 ok |
| `lib/entitlement.ts:63` | zmiana stanu | błąd odczytu → `null` (`unknown`), nigdy `free` | adapter | wszystkie | MON-08 ok |
| `lib/entitlement.ts:47` | zmiana stanu (pamięć) | ostatni znany wynik w `kv` | wynik sklepu | offline | poza kopią (słusznie); MON-02 ok |
| `lib/entitlement.ts:71` | nasłuch | zdarzenia transakcji od startu (`app/_layout.tsx:42` woła `initEntitlements`) | purchaseUpdatedListener (openiap: Transaction.updates) | Ask to Buy, kod, inne urządzenie | MON-04 ok; zwroty pomijane przez nasłuch biblioteki, łapane przy powrocie z tła |
| `lib/store-native.ts:100` | zmiana stanu | `finishTransaction` po zakupie, potem odczyt uprawnień | requestPurchase | zakup | kolejność finish → odczyt bezpieczna (zakończone transakcje zostają w currentEntitlements); MON-04 ok |
| `lib/entitlement.ts:108` | bramka | start treningu na żywo ponad limit → `/paywall?reason=limit` | `accessNow` (jeden magazyn) | GUARDED_STARTS | MON-06 ok |
| `lib/start.ts:64` | bramka | start z szablonu (lista, podgląd, Kalendarz, panel startu, pick-template, DayPanel) | j.w. | template, calendar | MON-06 ok |
| `lib/start.ts:70` | bramka | „Powtórz ostatni” | j.w. | repeatLast | MON-06 ok |
| `lib/start.ts:75` | bramka | „Pusty trening” | j.w. | empty | MON-06 ok |
| `lib/watch/link.ts:61` | — (sprawdzone, brak drogi) | zegarek tylko odbija zdarzenia trwającego treningu | — | zegarek | nie startuje treningu; MON-06 ok |
| `app/paywall.tsx:95` | przywracanie | "Przywróć zakupy" → `AppStore.sync` + odczyt (`lib/store-native.ts:114`) | StoreKit | ekran zakupu (z Ustawień przez wiersz "Pełna wersja") | "none" daje komunikat; MON-03 ok |
| `app/paywall.tsx:96` | zmiana stanu | kod ofertowy (P8 A) → odświeżenie | StoreKit | kody | ok |
| `app/paywall.tsx:73` | zarządzanie | `showManageSubscriptions(in:)` (openiap 3.6.0) | — | subskrybent | Do sprawdzenia 2 |
| `app/paywall.tsx:76` | ekran zakupu | lista planów ukryta tylko przy dożywotnim | `view.active` | po zakupie subskrypcji | 02-monetyzacja-001 |
| `components/SubscriptionCard.tsx:16` | odczyt stanu | wiersz w Ustawieniach | `useAccess` | Ustawienia | 02-monetyzacja-002 |
| `components/StartPanel.tsx:67` | odczyt stanu | licznik pozostałych dni | `useAccess` | ekran Trening | ok |
| `lib/fairrules.ts:11` | odczyt stanu | okno "Uczciwe zasady" i karta po imporcie tylko dla pewnego `free` | `accessNow` | po treningu, po imporcie | ok |
| `lib/review-run.ts:29` | odczyt stanu | prośba o ocenę nie przy wyczerpanym limicie | `nextStartBlocked` | podsumowanie | ok, ocena niczego nie odblokowuje |
| `lib/state/finish.ts:114` | zmiana licznika | zapis dnia treningowego przy ukończeniu treningu na żywo > 7 min | stan aplikacji (`liveDays`, w kopii) | limit | MON-09 ok |
| `lib/store-adapter.ts:56` | wybór adaptera | sztuczny sklep tylko przy `EXPO_PUBLIC_STORE_FAKE=1` | env | build E2E | MON-12 ok (test `tests/store-adapter.test.ts`) |

Płatna funkcja z kontraktu (docs/monetyzacja.md): tylko „start treningu na żywo w nowym dniu ponad 5 dni w miesiącu”. Każda droga UI do tego startu ma wiersz bramki; brak dróg przez link głęboki, widżet (`targets/rest-widget` — tylko przerwa), powiadomienie ani zegarek.

## Rachunek

Polecenie M1: bramki opłacalności nie liczę ponownie (MON-18 rozstrzygnięte decyzją 22.10 i dopiskiem DEC-07 K8). Sprawdziłem dane wejściowe (MON-17): `dowody/rachunek.txt`.

| Wielkość | Wartość dziś | Źródło (odczyt 2026-10-27) | W repo |
|---|---|---|---|
| VAT PL | 23% | ustawa o VAT, Dz.U. 2026 poz. 1263, art. 146ef ust. 1 pkt 1 (pdftotext) | 23% — zgodne |
| Prowizja | 15% (SBP przyjęty 26.10.2026) | `docs/18-przekazanie.md:591`; developer.apple.com/app-store/small-business-program | 15%, ale docs/monetyzacja.md nadal "Potwierdzenie przyjęcia przez Apple — krok właściciela" (004) |
| Kurs USD/PLN | 3,9542 (209/A/NBP/2026, 27.10) | api.nbp.pl | 3,8886 z 22.10 (004) |

Wpływ na jedną płatność (wzór modułu: cena / 1,23 × 0,85; `node docs/monetyzacja/rachunek.mjs`, exit 0): miesięczna 4,99 zł → 3,45 zł (ok. 0,87 USD); roczna 19,99 zł → 13,81 zł (ok. 3,49 USD); dożywotnia 59,99 zł → 41,46 zł (ok. 10,49 USD). Miesięczna przez 12 opłaconych okresów: ok. 41,40 zł/rok — skrypt pokazuje 3,45 zł „rocznie”, bo `rachunek.json` nie ma `platnosci_w_roku` (004). Porównanie z rynkiem PL: Trening jest 4–7× tańszy w każdym planie (`dowody/rynek-ceny-pl.txt`). Lejek: brak danych App Analytics (aplikacji nie ma w sklepie) — [DO USTALENIA] po premierze.

## Pokrycie (co sprawdzono, czego nie)

| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| `lib/access.ts` (cały), `lib/entitlement.ts` (cały), `lib/store-native.ts`, `lib/store-adapter.ts`, `lib/store-fake.ts`, `lib/products.ts` | tak, przeczytane w całości | wektory: `dowody/wektory-dostep.txt` |
| `app/paywall.tsx` (cały), `components/SubscriptionCard.tsx`, `lib/fairrules.ts`, `lib/start.ts` | tak | czytanie kodu |
| Drogi startu: `components/StartPanel.tsx`, `components/DayPanel.tsx`, `app/pick-template.tsx`, `app/template/[id].tsx`, `lib/watch/link.ts`, `lib/state/start.ts`, `lib/state/finish.ts` | tak (wywołania strażnika i zapis dni) | `dowody/grep-bramki.txt` |
| `components/FairRulesSheet.tsx`, `components/ImportProCard.tsx` | częściowo (przyciski, warunki pokazania) | czytanie kodu |
| Biblioteka: expo-iap 5.8.1 (JS, moduł iOS) i openiap 3.6.0 (Swift: displayPrice, currentEntitlements, Transaction.updates, sync, showManageSubscriptions) | tak, wybrane funkcje | `dowody/t11-waluta.txt` |
| Testy obszaru (8 plików Jest) | uruchomione | `dowody/jest-monetyzacja.txt` (290/290) |
| Decyzje właściciela (docs/18, docs/monetyzacja.md, docs/27 nagłówek, docs/40 R-M5) | tak | `dowody/docs18-decyzje-grep.txt`, `dowody/decyzja-kolejnosc-planow.txt` |
| Rynek PL (5 konkurentów, ceny, 90 recenzji) i źródła Apple | tak | `dowody/rynek-ceny-pl.txt`, `dowody/rynek-recenzje-pl.txt`, `dowody/apple-zrodla-2026-10-27.txt` |
| Zrzut ekranu zakupu | nie — brak symulatora; Expo web nie obsłuży modułu natywnego; zastępczo obserwacje T-11 | — |
| Zakup, zwrot, Family Sharing, tryb samolotowy na urządzeniu | nie (tylko telefon) — wyniki właściciela z 27.10 dla reinstalacji i offline przyjęte jako dowód | krok właściciela w „Do sprawdzenia” |
| Teksty ekranu zakupu w 35 językach | nie (DEV-12, rola 09) | — |
| Metadane zakupów i opis w App Store Connect | nie (rola 10, ODK-02) | — |
| Dysk Google właściciela (badanie konkurencji) | nie — niedostępny w tej sesji | — |

`git status --porcelain` na starcie i na końcu: puste (`dowody/git-status-start.txt`, `dowody/git-status-koniec.txt`) — pliki śledzone nietknięte.

## Kontrola dowodów i sekretów

`node audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 02-monetyzacja` — wynik w `dowody/sprawdz-raport.txt` (ostatni przebieg: kod 0, „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 02-monetyzacja”). Raport i dowody bez e-maili, UDID, sekretów i nazw innych aplikacji (konkurenci jako K1–K5 z numerem w sklepie).

## Stosowalność listy kontrolnej

| Pozycja | Status | Wynik |
|---|---|---|
| MON-01 | dotyczy | ok: subskrypcje mies./rok (grupa), dożywotni Non-Consumable (`lib/products.ts:13`); bez okresu próbnego; limit dni w miesiącu to limit użyć. Wartość stała 3.1.2(a): aktualizacje + opcja jednorazowa |
| MON-02 | dotyczy | ok: wektory „ponowna instalacja”, „Chmura rodzinna”; telefon 27.10 OK |
| MON-03 | dotyczy | ok: `lib/entitlement.ts:125` nadaje dostęp tylko z listy sklepu; wektor "przywracanie bez zakupu" → free + komunikat |
| MON-04 | dotyczy | ok: nasłuch od startu; finish przed odczytem bezpieczny w StoreKit 2 |
| MON-05 | dotyczy | ok: jeden magazyn (`useSyncExternalStore`), test „po zakupie karta i licznik bez restartu” w `tests/subscription-ui.test.tsx` |
| MON-06 | dotyczy | ok (mapa bramek) |
| MON-07 | dotyczy | ok: `ALWAYS_AVAILABLE` (`lib/access.ts:246`), bramka tylko na starcie; ekran limitu daje "Dopisz trening wstecz" (`app/paywall.tsx:104`). Poprawność eksportu: ARCH-10/11 (nie moje) |
| MON-08 | dotyczy; rozstrzygnięte decyzją P6 A (12.10, 7 dni karencji offline) | ok; odstępstwo od wektora modułu zamierzone |
| MON-09 | dotyczy; ryzyka R-M5-2, R-M5-4, R-M5-5 przyjęte decyzją 22.10 | ok: `lib/access.ts:239` warunek `used < limit` lub dziś już dzień treningowy; licznik monotoniczny (`liveDays`) |
| MON-10 | dotyczy | ujawnienia komplet przed zakupem; po zakupie ekran myli stan → 02-monetyzacja-001; waluta T-11 → Do sprawdzenia 1 |
| MON-11 | dotyczy | bez ciemnych wzorców; ostrzeżenie o podwójnej płatności dopiero po zakupie dożywotniego → 02-monetyzacja-001; wiersz Ustawień → 02-monetyzacja-002 (wygląd: SP-09, rola 04) |
| MON-12 | dotyczy | ok w kodzie (jedno źródło ID i liczb, sztuczny sklep tylko E2E); rozjazd zapisu decyzji z kodem → 02-monetyzacja-003 |
| MON-13 | nie dotyczy | aplikacji nie było w App Store; nikt nie zapłacił w produkcji (testerzy w piaskownicy) |
| MON-14 | dotyczy | ok: ADR = docs/30 (P10 A), bez usługi zewnętrznej, „Data Not Collected” (inwentarz: ARCH-16) |
| MON-15 | dotyczy | ok: testy MON-02/-03/-07/-08 w `tests/access.test.ts`, `tests/entitlement.test.ts`, `tests/subscription-ui.test.tsx`; telefon 27.10 (build 1031) z wynikiem |
| MON-16 | dotyczy; model rozstrzygnięty decyzją 22.10 (M5 S1) i 13.10 (przegląd darmowego poziomu po 8 tygodniach) | brak miary → 02-monetyzacja-005 |
| MON-17 | dotyczy | 02-monetyzacja-004 |
| MON-18 | rozstrzygnięte decyzją (bramka 21.10 + DEC-07 K8 23.10; model świadomie poniżej progu, 22.10) | nie liczone ponownie (polecenie M1); prowizja 15% teraz potwierdzona, więc obowiązuje wariant 471 USD, nie 388 USD |

### Zgodność kodu z decyzjami właściciela (obszar monetyzacji)

| Decyzja (data, miejsce) | Kod (plik:linia) | Test-strażnik | Wynik |
|---|---|---|---|
| Model M5 S1: limit 5 dni treningowych, bez próby, Pro mies./rok/dożywotni (22.10, `docs/18-przekazanie.md:441`) | `lib/access.ts:25`, `lib/products.ts:13` | `tests/access.test.ts`, `tests/m5s1-bez-proby.test.ts` | zgodne |
| Ekran zakupu tylko ponad limit i w Ustawieniach + licznik na ekranie startu (22.10, `docs/18-przekazanie.md:442`) | `lib/entitlement.ts:112`, `components/StartPanel.tsx:67` | `tests/subscription-ui.test.tsx` | zgodne (rozszerzone decyzją 25.10) |
| Nagłówek ekranu z limitem (22.10 B) i nazwy planów (22.10 C) | `app/paywall.tsx:66`, `app/paywall.tsx:24` | `tests/subscription-ui.test.tsx`, `tests/subscription-i18n.test.ts` | zgodne |
| Tekst ekranu przy limicie, wariant B (22.10, `docs/18-przekazanie.md:444`) | `app/paywall.tsx:63` | `tests/subscription-i18n.test.ts` | zgodne |
| Dzień = trening na żywo > 20 min, potem 7 min (22.10 i 23.10, `docs/18-przekazanie.md:445`) | `lib/access.ts:31` | `tests/m5s1-dni-zapis.test.ts` | zgodne |
| Dopisanie i import nie zużywają dnia; usunięcie nie zwraca (22.10) | `lib/state/finish.ts:114` | `tests/m5s1-dni-zapis.test.ts`, `tests/monetyzacja-csv.test.ts` | zgodne |
| Limit tylko się luzuje; `expo-iap` przypięte 5.8.1 (22.10) | `package.json:43` | `tests/limity-wydan.json` przez `tests/m5s1-dni-zapis.test.ts`; `tests/store-adapter.test.ts` | zgodne |
| Prośba o ocenę po 3. treningu (22.10) | `lib/review.ts:14` | `tests/review.test.ts` | zgodne |
| P3 B, P6 A — 7 dni offline (12.10, docs/27) | `lib/access.ts:26`, `lib/access.ts:27` | `tests/access.test.ts`, `tests/entitlement.test.ts` | zgodne |
| P7 A karencja płatności | `lib/store-native.ts:77` | `tests/audit-m1-012-status.test.ts` | zgodne |
| P8 A kody ofertowe | `app/paywall.tsx:96` | `tests/subscription-ui.test.tsx` | zgodne |
| P9 A standardowa licencja Apple | `lib/products.ts:41` | `tests/legal-links.test.tsx` | zgodne |
| Family Sharing TAK (11.10 / 14.10) | `lib/store-native.ts:48` | `tests/store-adapter.test.ts` | zgodne |
| Jeden przełącznik `PAYWALL.ENABLED`, płatności od 1.0 (12.10, 14.10 D-1) | `lib/access.ts:24` | `tests/access.test.ts` | zgodne |
| DEC-07 K1 jedna nazwa „Pełna wersja” (23.10, `docs/18-przekazanie.md:470`) | `app/_layout.tsx:119` | `tests/subscription-ui.test.tsx` | zgodne |
| Okno „Uczciwe zasady”, karta po imporcie, link „indeks espresso” (25.10, `docs/18-przekazanie.md:515`) | `lib/fairrules.ts:17`, `lib/products.ts:33` | `tests/monetyzacja-ui.test.tsx`, `tests/check-urls.test.ts` | zgodne |
| Kolejność planów mies., rok, dożywotni; domyślnie miesięczny (23.10, `docs/18-przekazanie.md:481`) | `lib/products.ts:19` ma kolejność roczny pierwszy | `tests/subscription-ui.test.tsx` pilnuje kolejności przeciwnej | nie wdrożono; decyzja zastąpiona 27.10 (kod zostaje) — nie znalezisko; mechanizm → 02-monetyzacja-003 |
| Kolejność roczny, miesięczny, dożywotni; domyślnie roczny (27.10 ok. 17:00, polecenie M1; jeszcze nie w docs/18) | `lib/products.ts:19`, `app/paywall.tsx:36` | `tests/subscription-ui.test.tsx` (kolejność i zaznaczenie) | zgodne; brak wpisu w docs/18 → 02-monetyzacja-003 |
| Small Business Program przyjęty (26.10, `docs/18-przekazanie.md:591`) | `docs/monetyzacja.md:80` nadal "krok właściciela" | brak | rozjazd dokumentu → 02-monetyzacja-004 |

## Znaleziska (szczegóły)

### 02-monetyzacja-001 · Po zakupie ekran zakupu nadal zachęca do subskrypcji i nie nazywa posiadanego planu
- Pozycja listy kontrolnej: MON-11
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: `app/paywall.tsx:66` nagłówek "Trenuj {n} dni w miesiącu za darmo…" pokazywany zawsze poza `reason=limit`, także subskrybentowi; `app/paywall.tsx:76` lista planów i przycisk ukryte tylko przy dożywotnim; `app/paywall.tsx:88` przycisk "Subskrybuj" także dla zaznaczonego, już posiadanego planu; `app/paywall.tsx:69` karta mówi tylko "Masz pełną wersję" i datę (`app/paywall.tsx:71`), bez nazwy planu; ostrzeżenie o podwójnej płatności (`app/paywall.tsx:72`) dopiero po zakupie dożywotniego, nie przed. Potwierdzone na telefonie (T-11, build 1031).
- Wzorzec lub źródło: wytyczne 5.6 (odczyt 2026-10-27, `dowody/apple-zrodla-2026-10-27.txt`): aplikacja nie powinna „trick them into making unwanted purchases”; 3.1.2(b): „should not be able to inadvertently subscribe to multiple variations of the same thing” (w grupie chroni to Apple; dożywotni + subskrypcja to dwie rzeczy).
- Kroki w aplikacji: kup plan miesięczny → ekran przewija się na górę, karta „Masz pełną wersję, Dostęp do …”, pod nią dalej „Trenuj 5 dni za darmo”, lista planów z zaznaczonym rocznym i „Subskrybuj”. Subskrybent, który chce „na zawsze”, kupuje dożywotni i dopiero potem widzi, że subskrypcja dalej się odnawia.
- Opcje: (a) w stanie posiadanej subskrypcji: nagłówek „Masz plan {nazwa planu}”, ukryty wstęp o darmowych dniach, posiadany plan oznaczony „Twój plan” bez przycisku, przy dożywotnim przed zakupem zdanie „Subskrypcję anulujesz osobno w ustawieniach konta Apple” — ok. 1 h pracy agenta + teksty w 35 językach (rola 09) i wygląd (rola 04); (b) tylko nazwa planu w karcie i wstęp ukryty — 20 min, zostaje „Subskrybuj” przy posiadanym planie; Rekomendacja: (a), w 1.0 jeśli właściciel otwiera build 1.0 dla poprawek i tak (wyjątek grafik 27.10), inaczej 1.0.1 — P2 nie blokuje wydania.
- Test akceptacyjny: test ekranu: po zakupie miesięcznego nie ma tekstu o darmowych dniach, posiadany plan nie ma przycisku zakupu, karta nazywa plan; przy aktywnej subskrypcji przed „Kup na zawsze” widać zdanie o osobnym anulowaniu; scenariusz Maestro ze sztucznym sklepem.
- Status: otwarte

### 02-monetyzacja-002 · Wiersz „Pełna wersja” w Ustawieniach (stan darmowy) wygląda jak stan, nie jak wejście do zakupu
- Pozycja listy kontrolnej: MON-11 (wygląd i brzmienie: SP-09, rola 04 — zgłaszam sam, raportów innych ról nie czytam)
- Poziom: P2
- Realność: realny · Pewność: średnia
- Rodzaj: D (defekt)
- Dowód: `components/SubscriptionCard.tsx:16` tytuł wiersza to nazwa produktu „Pełna wersja”, podtytuł (`components/SubscriptionCard.tsx:13`) to licznik wykorzystanych dni; wiersz ma rolę przycisku i znak „›”, ale tytuł czyta się jak opis posiadanego stanu (obserwacja właściciela, T-11, 27.10).
- Wzorzec lub źródło: strona subskrypcji Apple (odczyt 2026-10-27): ekran ma dawać „A way for current subscribers to sign in or restore purchases”; wejście do zakupu i przywracania musi być rozpoznawalne. Katalog wzorców `docs/32-wzorce-interakcji.md` (wzorzec przejść).
- Kroki w aplikacji: Więcej → Ustawienia → sekcja „Subskrypcja” → wiersz „Pełna wersja / Darmowe dni treningowe w tym miesiącu: wykorzystano 2 z 5”.
- Opcje: (a) w stanie `free` tytuł działaniem, np. „Zobacz plany Pro” (jak w oknie „Uczciwe zasady”), stan w podtytule; (b) zostawić tytuł, dodać podpis „Plany i przywracanie zakupów”; Rekomendacja: (a) — spójne z istniejącym „Zobacz plany Pro ›”; decyzja brzmienia: rola 04 / właściciel.
- Test akceptacyjny: test ekranu Ustawień w stanie `free` i `full`: tytuł w `free` jest wezwaniem do działania, w `full` nazywa plan; tłumaczenia w słowniku.
- Status: otwarte

### 02-monetyzacja-003 · Decyzja właściciela z 23.10 zapisana jako wdrożona, choć kod i test-strażnik mówiły co innego; brak mechanizmu decyzja → kod → test
- Pozycja listy kontrolnej: MON-12
- Poziom: P2
- Realność: realny (zdarzyło się: rozjazd wyszedł dopiero na telefonie 27.10) · Pewność: wysoka
- Rodzaj: P (decyzja produktowa — model pracy)
- Dowód: `docs/18-przekazanie.md:481` (23.10) zapisuje kolejność „miesięczny, roczny, dożywotni” i domyślnie miesięczny z dopiskiem „Wdrożenie: gałąź naprawa-m1-dec07-ui”; scalenie tej gałęzi (99563b1e) zmieniło tylko README, docs/19 i test K9; `PLAN_ORDER` ostatnio zmieniony w 737010cf (M5 S1, 22.10); `tests/subscription-ui.test.tsx:43` przez cały ten czas wymagał kolejności przeciwnej do decyzji — `dowody/decyzja-kolejnosc-planow.txt`. Decyzja z 27.10 (kod zostaje) nie ma jeszcze wpisu w docs/18, więc dziennik decyzji nadal przeczy kodowi.
- Wzorzec lub źródło: CLAUDE.md, lekcje po błędach: akcja ma być mechanizmem (test, strażnik w CI), nie postanowieniem; model pracy L-001 pkt 2 (rejestr z warunkiem zamknięcia).
- Kroki w aplikacji: właściciel podejmuje decyzję o wyglądzie ekranu → wpis „Wdrożenie: gałąź X” → gałąź scalona bez zmiany → TestFlight pokazuje stary układ → właściciel odkrywa rozjazd na telefonie.
- Opcje: (a) wpis decyzji z polem „strażnik: <plik testu>” i skrypt w `verify:docs` sprawdzający, że każdy wpis z polem `kod` wskazuje istniejący test, który zmienił się w commicie wdrożenia (ok. 1–2 h agenta; koszt: dyscyplina zapisu); (b) krok listy kontrolnej koordynatora przy scalaniu: dla każdej decyzji z dnia pokaż diff kodu albo „nie wdrożono” (15 min na scalenie; mechanizm ludzki, słabszy); (c) bez zmian; Rekomendacja: (a) plus natychmiast wpis 27.10 w docs/18 z odwołaniem do `tests/subscription-ui.test.tsx`. Ocena zakresu: systemowa (ta sama luka dotyczy każdej decyzji UI zapisanej w docs/18) → lekcja w docs/40.
- Test akceptacyjny: skrypt odrzuca wpis decyzji z polem `kod` bez wskazanego testu; wpis 27.10 w docs/18 wskazuje test kolejności i domyślnego planu; wpis 23.10 oznaczony „zastąpione 27.10”.
- Status: otwarte

### 02-monetyzacja-004 · Rachunek i bramka W0 w docs mają nieaktualne dane wejściowe (kurs, prowizja, liczba płatności w roku)
- Pozycja listy kontrolnej: MON-17
- Poziom: P2
- Realność: realny (dokument) · Pewność: wysoka
- Rodzaj: M (stawki i reguły)
- Dowód: `docs/monetyzacja/rachunek.json` (data 2026-10-22): kurs 3,8886 (dziś 3,9542, 209/A/NBP/2026), produkt „3 mies.” odrzucony decyzją 22.10, brak `platnosci_w_roku` — skrypt liczy miesięczną jako 3,45 zł rocznie (`dowody/rachunek.txt`); `docs/monetyzacja.md:80` „Potwierdzenie przyjęcia przez Apple — krok właściciela”, a `docs/18-przekazanie.md:591` notuje „Z-12 Small Business Program przyjęty” (26.10).
- Wzorzec lub źródło: zasada roli 5 (liczby z danych wejściowych ze źródłem i datą); moduł `cena-i-rachunek` (`platnosci_w_roku` ze źródłem).
- Kroki w aplikacji: brak (dokument) — wpływ na decyzję w punkcie kontrolnym po 8 tygodniach (wariant 471 vs 388 USD).
- Opcje: (a) odświeżyć `rachunek.json` (kurs z datą, usunąć 3 mies., `platnosci_w_roku` ze źródłem albo [ZAŁOŻENIE]) i zdanie o SBP w docs/monetyzacja.md — ok. 20 min agenta; (b) zostawić do punktu kontrolnego; Rekomendacja: (a), commit tylko z dokumentami (`verify:docs`).
- Test akceptacyjny: `node docs/monetyzacja/rachunek.mjs docs/monetyzacja/rachunek.json` exit 0 z datą bieżącą; docs/monetyzacja.md mówi „SBP przyjęty 26.10.2026, prowizja 15%”.
- Status: otwarte

### 02-monetyzacja-005 · Punkt kontrolny po 8 tygodniach nie mierzy skarg na limit głównej pracy, a rynek PL ocenia głównie hojność darmowej wersji
- Pozycja listy kontrolnej: MON-16
- Poziom: P2
- Realność: brzegowy (hipoteza H-1 z próbki recenzji) · Pewność: średnia
- Rodzaj: P (model, podział)
- Dowód: `docs/monetyzacja.md:81` punkt kontrolny mierzy pobrania i płacących; model limituje rejestrowanie (`lib/access.ts:25`), a u konkurentów K1 i K4 rejestrowanie jest darmowe bez limitu i chwalone w recenzjach; skargi "one big paywall" (K3, 1★, 23.10.2026) i "Bez opłacenia aplikacja jest goła" (K5, 1★) — `dowody/rynek-recenzje-pl.txt`, `dowody/rynek-ceny-pl.txt`. Decyzja 13.10 (`docs/18-przekazanie.md:196`) już przewiduje przegląd darmowego poziomu po 8 tygodniach — brakuje tylko miary.
- Wzorzec lub źródło: linia bazowa E0b pkt 2–3 (`dowody/linia-bazowa-e0b.txt`).
- Kroki w aplikacji: użytkownik w PL zużywa 5 dni w 2–3 tygodnie (3 treningi/tydzień) i trafia na ekran zakupu; ocena w sklepie zależy od jego odbioru.
- Opcje: (a) dopisać do punktu kontrolnego dwie miary: udział ocen ≤ 3★ wspominających limit lub opłatę oraz odsetek użytkowników, którzy po pierwszej blokadzie wracają w kolejnym miesiącu (App Analytics: retencja) — koszt: 10 min ręcznego przeglądu recenzji w punkcie kontrolnym; (b) bez zmian — model stały; Rekomendacja: (a); zmiana limitu tylko decyzją właściciela po danych.
- Test akceptacyjny: sekcja „Punkt kontrolny” w docs/monetyzacja.md wymienia obie miary z progiem przeglądu.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

1. **T-11: waluta na liście (USD) vs arkusz Apple (PLN).** Ustalenia (`dowody/t11-waluta.txt`): kod pokazuje niezmienione `Product.displayPrice` StoreKit (`lib/store-native.ts:54`, openiap 3.6.0 przekazuje `product.displayPrice`); sztuczny sklep nie był użyty (był arkusz Apple). Dokumentacja Apple (szczebel 1, dziś): displayPrice bierze walutę ze storefrontu urządzenia; TestFlight zawsze działa w piaskownicy. Wątek forum Apple (sierpień 2026, szczebel 5, odczyt narzędziem) i odpowiedź wsparcia biblioteki płatności (11.03.2026, szczebel 4–5) opisują identyczny objaw jako wadę TestFlight/piaskownicy, w produkcji ceny lokalne. Brakuje: obserwacji na buildzie z App Store. Krok właściciela (5 min, w dniu wydania, bez zakupu): telefon z kontem PL, aplikacja z App Store (nie TestFlight) → Ustawienia → Subskrypcja → ekran zakupu: oczekiwane "4,99 zł/miesiąc", "19,99 zł/rok", "59,99 zł jednorazowo". Opcjonalnie wcześniej: konto testowe piaskownicy z regionem Polska (Ustawienia → Programista → Konto testowe), wylogowanie i ponowne zalogowanie — jeśli lista pokaże zł, potwierdza przyczynę środowiskową.
2. **„Zarządzaj subskrypcją” w TestFlight otwiera listę produkcyjną.** Kod woła `AppStore.showManageSubscriptions(in:)` (openiap 3.6.0, `OpenIapModule.swift` wiersz 1229 w kopii z tagu 3.6.0), zgodnie z zaleceniem Apple; zachowanie w TestFlight to cecha piaskownicy [OCENA]. Krok właściciela po wydaniu: w buildzie z App Store po zakupie „Zarządzaj subskrypcją” pokazuje subskrypcję Treningu.
3. **Zwrot w trakcie działania aplikacji.** Nasłuch biblioteki pomija transakcje z datą cofnięcia (openiap 3.6.0, `Transaction.updates`), więc dostęp znika dopiero przy powrocie aplikacji z tła albo starcie (`app/_layout.tsx:55`). Strata właściciela, bez szkody dla użytkownika; nie zgłaszam jako znaleziska. Krok (opcjonalny): zwrot w piaskownicy przy otwartej aplikacji → po przejściu do tła i powrocie stan „free”.
4. **Recenzent Apple spoza USA** mógłby zobaczyć ten sam rozjazd waluty co testerka (recenzja też działa w piaskownicy) [OCENA bez źródła]. Brak dowodu, że prowadzi to do odrzucenia; w notatkach dla recenzenta (rola 10) można dodać zdanie, że ceny pochodzą wyłącznie z `displayPrice`.

## Co działa dobrze i należy zachować

- Czysta logika dostępu w `lib/access.ts` bez StoreKit i bez zegara w środku — wektory działają w Node bez makiet (`dowody/wektory-dostep.txt`).
- Błąd sklepu nigdy nie daje `free` (`lib/entitlement.ts:63`); niezweryfikowana transakcja unieważnia odczyt zamiast go częściowo przyjmować.
- Jedna bramka startu dla pięciu dróg (`lib/entitlement.ts:108`), trening w toku nigdy nieprzerywany, dane zawsze dostępne, "Dopisz trening wstecz" na ekranie limitu.
- Dni limitu zapisane osobno i monotonicznie, import i wpisy wstecz ich nie zużywają — uczciwe wobec użytkownika i odporne na „usuń trening”.
- Ceny wyłącznie z App Store; test pilnuje braku kwot w kodzie ekranów; sztuczny sklep zamknięty za zmienną tylko w E2E.
- Ton ekranu limitu (pochwała, jawna data powrotu dni, „Nie teraz”) i okno „Uczciwe zasady” — wzorzec uczciwego freemium, zgodny z pochwałami „nie jest nachalna” u konkurencji.
- Ceny 4–7× niższe od rynku PL i opcja dożywotnia — odpowiedź na najczęstszą skargę płacących u konkurencji.

## Decyzje dla właściciela

1. **T-11, waluta (przed wydaniem).** (A) Wydać bez zmian w kodzie; w dniu wydania 5-minutowe sprawdzenie ekranu zakupu na buildzie z App Store z kontem PL (Do sprawdzenia 1); gdy pokaże USD — wstrzymać sprzedaż w ASC i zgłosić błąd do Apple (kod nie ma czego naprawić). Kompromis: ryzyko widoczne dopiero po premierze, ale objaw z TestFlight ma znaną przyczynę środowiskową. (B) Przed wysyłką test z kontem piaskownicy z regionem PL (ok. 10 min telefonu) — jeśli pokaże zł, mamy potwierdzenie przed recenzją; jeśli USD, nie rozstrzyga (wada piaskownicy). (C) Dodać w kodzie ukrywanie cen, gdy waluta produktu różni się od storefrontu — odrzucam: według zgłoszeń sam storefront w TestFlight bywa błędny, więc strażnik nie zadziała, a dodaje ryzyko „brak cen” w produkcji. Rekomendacja: A, z B jako tanim dodatkiem. Czas agenta: 0; właściciela: 5–15 min.
2. **02-monetyzacja-001 (stan po zakupie):** naprawa w 1.0 (ok. 1 h agenta + przegląd tekstów 35 języków) albo w 1.0.1 (P2 nie blokuje). Rekomendacja: w 1.0 tylko, jeśli build 1.0 i tak jest przebudowywany (wyjątek z 27.10 dla sekcji „Technika”); inaczej 1.0.1.
3. **02-monetyzacja-003 (mechanizm decyzji):** opcje (a) strażnik w `verify:docs`, (b) krok koordynatora przy scalaniu, (c) bez zmian. Rekomendacja: (a) + wpis 27.10 w docs/18 teraz. To zmiana modelu pracy — lekcja w docs/40 z oceną „systemowa”.
4. **02-monetyzacja-005 (miara w punkcie kontrolnym):** (a) dopisać dwie miary, (b) bez zmian. Rekomendacja: (a).

Czas: naprawy 001–005 to ok. 3–4 h pracy agenta łącznie (równolegle: 001+002 jeden agent, 003–005 drugi); czekanie: verify (~12 min), E2E podstawowy, przegląd tłumaczeń; właściciel: 4 decyzje (ok. 10 min) i 5–15 min na telefonie (decyzja 1).

## Proponowane polecenie naprawy

`node tools/assemble.mjs 02-monetyzacja --tryb fix --zadania MON-11,MON-12,MON-16,MON-17` (znaleziska 02-monetyzacja-001…005; wygląd i brzmienie 001/002 do roli 04, teksty 35 języków do roli 09; 003 jako lekcja i strażnik u koordynatora).

`git status --porcelain` na końcu: puste (`dowody/git-status-koniec.txt`).
