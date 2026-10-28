# Reaudyt: Wydanie i sklepy — Trening (iOS) — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony, sprawdzony na starcie) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Środowisko: Linux x86_64, Node v22.22.0, git (klon płytki, historia przed bazą niedostępna); sieć przez proxy działa (strony Apple, apps4brew.com); MCP GitHub tylko odczyt; brak macOS/Xcode/symulatora, brak dostępu do App Store Connect. Sondy w osobnym worktree (2385e75), `node_modules` dowiązane z drzewa głównego; testy pojedynczo z `--maxWorkers=1`.

## Podsumowanie

Mechanizmy z napraw M2 działają na 2385e75: ekran zakupu przy aktywnym planie chowa wstęp i plany, a uwaga o odnawianej subskrypcji pokazuje się przed zakupem dożywotniego (M1-001); krok Z-26 ma pole kandydata z numerem i SHA, a dziennik wydań ma wiersze 1031 i 1032 (M1-008); `check:decyzje` jest w verify (M1-009); `check:release` sprawdza rejestr ryzyk i jest w liście zgłoszenia (M1-012); docs/42 nie ma już znaczników [DO PRZECZYTANIA], cytaty Apple zgadzają się ze stronami odczytanymi dziś, a podpisy zrzutów są dla 29 języków (M1-037). Do zgłoszenia 1.0 wciąż brakuje kroków, które z założenia zależą od nowego buildu. Bramka wydania odpowiada dziś kodem 1: 6 ryzyk bez rozliczenia (`dowody/check-release.txt`). Opublikowane strony prywatności i wsparcia różnią się od `site/` (`dowody/check-urls.txt`, kod 1), więc M1-017 jest nadal otwarte. Nie ma tagu ani buildu na 2385e75, a pełny katalog E2E na tym commicie nie biegł. Podpisy w 27 językach mają status „propozycja”. Nowe znaleziska to dwie pozycje P2. Pierwsza to regresja po zmianie wiersza w Ustawieniach: notatki dla App Review i lista z telefonu dalej prowadzą do „Full version” / „Masz pełną wersję” (601). Druga to martwy link Apple w nowym kroku Z-25a (602).

| Pozycja M1 | ID roli | Wynik | Dowód |
|---|---|---|---|
| M1-001 | 10-wydanie-002 | zweryfikowane | `app/paywall.tsx:110` uwaga przed przyciskiem zakupu; wstęp i plany ukryte przy aktywnym planie (`app/paywall.tsx:78`, `app/paywall.tsx:95`); test 5/5 (`dowody/jest-001-powtorki.txt`; pierwszy przebieg na zimnej pamięci podręcznej 2 czerwone po 25 s, `dowody/jest-001-dozywotni-przy-subskrypcji.txt`), test stanu „Masz plan” 10/10 (`dowody/jest-010-stan-mam-plan.txt`) |
| M1-008 | 10-wydanie-001 | zweryfikowane (procedura); build kandydata jeszcze nie istnieje | `docs/48-zgloszenie-1-0.md:97` pole „Kandydat: build — · SHA —”, `docs/48-zgloszenie-1-0.md:96` wygaszenie 1031/1032; test 3/3 (`dowody/jest-008-build-do-zgloszenia.txt`); tagi i przebiegi: `dowody/ci-odczyt.txt` |
| M1-009 | 10-wydanie-006 | zweryfikowane | `npm run check:decyzje` kod 0, 341 wpisów (`dowody/check-decyzje.txt`); w `verify` i `verify:docs`; test 21/21 (`dowody/jest-decyzje-straznik.txt`) |
| M1-012 | 10-wydanie-003 | zweryfikowane (bramka); rozliczenie rejestru nadal otwarte | `scripts/ci/blokada-wydania.mjs:32`; `check:release` kod 1: R-005, R-004, R-010, R-013, R-014, R-RES (`dowody/check-release.txt`); R-010 bez wpisu o przeglądzie z 28.10 (`docs/40-lekcje.md:22`); test 4/4 (`dowody/jest-012-rejestr-ryzyk-bramka.txt`) |
| M1-037 (cz. 004) | 10-wydanie-004 | zweryfikowane w repo; warunek (b) przed Z-16 otwarty | podpisy 29 języków, test 34/34 (`dowody/jest-037-podpisy-zrzutow.txt`); 27 języków ma status „propozycja” (`store/screenshot-captions.json:6`); dziedziczenie z języka podstawowego potwierdzone dziś (`dowody/apple-odczyt.txt`) |
| M1-037 (cz. 005) | 10-wydanie-005 | zweryfikowane | `docs/42-plan-wydania-1.0.md:49` i `docs/42-plan-wydania-1.0.md:52` z adresami i cytatami, zgodnymi z tekstem stron z dziś (`dowody/apple-odczyt.txt`); test 12/12 (`dowody/jest-037-dokumenty-wydania.txt`) |
| M1-017 | (01-odkrywanie-008) | nadal otwarte (publikacja) | `site/privacy.html:89` poprawione, test 2/2 (`dowody/jest-017-polityka-poczta.txt`); strony na apps4brew.com mają starą treść (4 wystąpienia nazwy rejestratora), `check-urls.mjs` kod 1 (`dowody/check-urls.txt`, `dowody/adresy.txt`) |

Nowe znaleziska:

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 10-wydanie-601 | P2 | D | Notatki dla App Review i lista z telefonu prowadzą do „Full version” / „Masz pełną wersję”, których w tym miejscu już nie ma (regresja po M1-037 A i 1A) | otwarte |
| 10-wydanie-602 | P2 | D | Krok Z-25a (wygaszenie starych buildów) odsyła do nieistniejącej strony Apple | otwarte |

Liczby nowych: P0 = 0, P1 = 0, P2 = 2. Ostatni nagłówek promptu roli: „## Kontrola dowodów i sekretów przed oddaniem raportu”.

## Gotowość zgłoszenia 1.0 po scaleniu (przegląd różnicy 025a50b..2385e75)

Zmienione pliki w obszarze roli: docs/09, docs/15, docs/39, docs/40, docs/41, docs/42, docs/48, `scripts/ci/blokada-wydania.mjs`, `site/privacy.html`, `site/support.html`, `store/screenshot-captions.json`, `.github/workflows/e2e-ios.yml` (nowe wejście `rozmiar_tekstu`, bez sekretów). `app.json`, `store/app-store-metadata.json`, `store/app-store-names.json`, `store/asc-odpowiedzi.json` i `store/review-notes.md` się nie zmieniły (`dowody/jest-regresja.txt`). Z tego powodu metadane 33 lokalizacji, odpowiedzi na formularze i szyfrowanie mają ten sam wynik co w audycie.

| Bramka (CLAUDE.md / docs/48) | Stan na 2385e75 | Dowód |
|---|---|---|
| Pakiet podstawowy E2E | zielony: 40657526205 (push 2385e75) | `dowody/ci-odczyt.txt` |
| Pełny katalog E2E na standardowym iPhonie (Z-06) | nie biegł na 2385e75; ostatni zielony 40423153424 na 001ecf28. Uwaga w Z-06 „dziś czerwony” pochodzi z 25.10 i jest nieaktualna (`docs/48-zgloszenie-1-0.md:64`) | `dowody/ci-odczyt.txt` |
| Audyt (Z-03) | ten reaudyt (pętla 1) | — |
| Build kandydata (Z-07) i numer do Z-26 | brak przebiegu `testflight.yml` i tagu na 2385e75; następny numer = BUILD_BASE + numer przebiegu (przy braku innych przebiegów 1033); pole Z-26 puste do wpisania przez agenta | `dowody/ci-odczyt.txt`, `docs/48-zgloszenie-1-0.md:97` |
| Telefon (Z-08) | nie sprawdzono (brak buildu); R-004, R-013 i R-014 czekają na ten krok | `dowody/check-release.txt` |
| `check:release` (Z-25b) | kod 1: 6 ryzyk blokujących | `dowody/check-release.txt` |
| Adresy i treść stron (Z-10a) | kod 1: privacy i support na żywo ≠ `site/` | `dowody/check-urls.txt` |
| Metadane 33 lokalizacji | bez zmian od audytu (wynik skryptu z audytu: kod 0); testy sklepu zielone | `dowody/jest-regresja.txt` |
| Zrzuty (Z-16) | podpisy 29 języków w repo; 27 bez recenzji lokalizacji; obrazów nie ma (wymagają macOS) | `store/screenshot-captions.json:6` |
| Polityka prywatności: repo vs opublikowana | rozjazd (M1-017) | `dowody/adresy.txt` |
| Ukryte figury (Reverse Lunge, Push Press, Pendlay Row) w materiałach sklepu | brak wzmianek w `store/` i danych zrzutów | grep: 0 trafień |

Otwarte poza main (tylko wypisuję, to nie są znaleziska): 9a eksport figur strony (gałąź `naprawy/M2-po-decyzjach-eksport-figur`); propozycje A/B w L-047 i L-048 (docs/40); backlog 1.0.1 w docs/21.

## Szczegóły weryfikacji

- **M1-001.** Uwagę dostaje każda subskrypcja opłacana przez osobę, także z kodu promocyjnego, ale nie z Chmury rodzinnej (`app/paywall.tsx:59`, decyzja 5a). Gdy plan jest aktywny, wstęp o darmowych dniach i stopka o limicie są ukryte (`app/paywall.tsx:78`, `app/paywall.tsx:116`). Plany są zwinięte pod „Zmień plan” (`app/paywall.tsx:94`), a karta stanu nazywa plan (`components/SubscriptionCard.tsx:12`). To zamyka obie części 10-wydanie-002. Pierwszy przebieg testu (zimna transformacja, 25 s) miał 2 czerwone, kolejne trzy były zielone po ok. 4,5 s. Uznaję to za obciążenie maszyny, nie za błąd aplikacji. Jeśli powtórzy się w CI, należy to opisać jako niestabilny test.
- **M1-008.** Test wymusza, żeby wpisany numer w Z-26 był w dzienniku z tym samym SHA. Kandydat jeszcze nie istnieje, więc dziś pole jest „—”. Zgodnie z procedurą wypełnia się je po buildzie, przed Z-26.
- **M1-012.** `check:release` przepuszcza tylko ryzyka zamknięte, zaakceptowane, „odroczone decyzją właściciela DD.MM.RRRR” albo „sprawdzenie po wydaniu”. Bramka blokuje poprawnie. Rozliczenie rejestru (test akceptacyjny: „stan z datą i dowodem”) jest niepełne w dwóch miejscach. R-010 nie ma wpisu o przeglądzie API z 28.10 (batch opisany w docs/16), choć decyzja 1a go wykonała. R-014 (`docs/40-lekcje.md:26`) ma stan `otwarte (21.10.2026)` bez odniesienia do wyniku z telefonu z 27.10. Pole wdrożenia decyzji 1a (`docs/18-przekazanie.md:610`) dalej wskazuje `otwarte → M1-audytor-generalny-006`, choć M2 podaje 006 jako naprawione. Status nadal otwarte dotyczy tylko tej części. Część ryzyk (R-004, R-013, R-014, R-005, R-RES) zamyka się dopiero buildem kandydata i telefonem, więc stan otwarte jest dziś prawdziwy.
- **M1-037.** W docs/42 pkt 2 i 5 każda z czterech fraz kontrolnych występuje w tekście stron Apple pobranych dziś (`dowody/apple-odczyt.txt`). Dla podpisów zrzutów żaden skrypt ramek ani wgrywania nie sprawdza statusu „zrecenzowane” (grep: 0 trafień w `scripts/ci` i workflowach zrzutów). Warunek (b) pilnuje tylko lista w docs/48 pkt 5 ppkt 6 i zatwierdzenie `release` przez właściciela.
- **M1-017.** Treść w repo jest poprawna. Brakuje eksportu do repo strony i publikacji (krok Z-10a, opisany w docs/48), a mechanizm `check-urls.mjs` ten rozjazd wykrywa. Opublikowana polityka wymienia nadmiarowego odbiorcę, czyli nie zaniża danych. Poziom bez zmian (P2). Zgłoszenia nie robić, dopóki Z-10a nie da kodu 0.

## Próbka regresji (3 pozycje spoza zmienionych plików)

| Pozycja | Wynik | Dowód |
|---|---|---|
| WYD-01 poświadczenia | ok: w drzewie 5 trafień skryptu, wszystkie to nazwy zmiennych i atrapa testowa, pliki bez zmian od bazy. W 118 commitach zakresu 0 kluczy i tokenów, 0 plików kluczy, brak `pull_request_target`. Historii przed bazą nie sprawdzono (klon płytki), wynik pełnej historii jest w audycie 27.10 | `dowody/sekrety.txt`, `dowody/sekrety-zakres.txt` |
| WYD-09 manifest prywatności | ok: `app.json` bez zmian, `tests/privacy-manifest.test.ts` zielony; brak nowej sieci i zależności w kodzie aplikacji | `dowody/jest-regresja.txt`, `dowody/siec-zaleznosci.txt` |
| WYD-10 formularze (szyfrowanie, wiek, DSA) | ok: `app.json:64` `ITSAppUsesNonExemptEncryption` false, `tests/store-asc-odpowiedzi.test.ts` zielony | `dowody/jest-regresja.txt` |

## Znaleziska

### 10-wydanie-601 · Notatki dla App Review i lista z telefonu prowadzą do „Full version” / „Masz pełną wersję”, których w tym miejscu już nie ma
- Pozycja listy kontrolnej: WYD-11
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: wiersz w Ustawieniach ma teraz w stanie darmowym tytuł „Zobacz plany Pro”, a po zakupie „Masz plan: …”: `components/SubscriptionCard.tsx:19` „v.level === 'full' ? (a ? ownedPlanTitle(a.plan) : t('Pełna wersja')) : t('Zobacz plany Pro')”. Notatka EN do wklejenia dalej podaje starą ścieżkę: `store/review-notes.md:34` „More > Settings, section "Subscription" > "Full version"”. To samo jest w notatce subskrypcji (`store/review-notes.md:105`), w bloku PL (`store/review-notes.md:73`) i w kopii w `docs/48-zgloszenie-1-0.md:153`.
- Dowód (lista z telefonu): oczekuje po zakupie starego tytułu: `docs/49-testflight-1-0.md:26` „po zakupie „Masz pełną wersję”. Strona wsparcia i docs/39 zostały poprawione w tych samych naprawach (`site/support.html`, docs/39 US-13).
- Mechanizm: zmiany 1a96768 i 5bbc84a (M1-037 A, 1A) poprawiły UI, stronę wsparcia i docs/39, a pominęły `store/review-notes.md` i docs/49. Strażnik `tests/store-review-notes.test.ts` sprawdza tylko, czy cytowany tekst istnieje w słowniku EN. „Full version” istnieje, bo to nazwa grupy subskrypcji i tytuł zapasowy, więc test przechodzi. `grep -n "Full version" store/review-notes.md docs/48-zgloszenie-1-0.md` → 4 trafienia ścieżki (34, 105, 48:153, oraz nazwa grupy 33).
- Powraca: tak, ta sama klasa co 10-wydanie-006 (zmiana UI bez aktualizacji tekstów zależnych); trwała kontrola: test ścieżki w notatkach względem tytułu wiersza w stanie darmowym.
- Wzorzec lub źródło: App Review Guidelines 2.1 i 2.3.1(b) (notatki wyjaśniają, nie wprowadzają w błąd; odczyt w audycie 27.10.2026); zasada roli 9.
- Kroki w aplikacji: recenzent na czystym urządzeniu: Więcej → Ustawienia → sekcja „Subscription” → widzi wiersz „See Pro plans”, a notatka każe szukać „Full version”. Wiersz jest jedyny w sekcji, więc pewnie go znajdzie, dlatego P2, nie P1. Właściciel przy T-11 zobaczy „Masz plan: …” i może zgłosić fałszywą usterkę.
- Opcje: (a) poprawić trzy miejsca w `store/review-notes.md`, kopię w docs/48 i T-11 w docs/49 na „See Pro plans” / „Your plan: …” oraz dodać do testu notatek warunek, że ścieżka zakupu zawiera tytuł wiersza w stanie darmowym z `components/SubscriptionCard.tsx`. Ok. 20 min agenta, zamyka klasę błędu. (b) Poprawić same teksty bez testu. 5 min, ale błąd może wrócić. Rekomendacja: (a), przed Z-25 (wklejenie notatek).
- Test akceptacyjny: test notatek jest czerwony na obecnym `store/review-notes.md` i zielony po poprawce; `grep "Settings > Subscription > Full version"` → 0; docs/49 T-11 zgodny z `ownedPlanTitle`.
- Status: otwarte

### 10-wydanie-602 · Krok Z-25a (wygaszenie starych buildów) odsyła do nieistniejącej strony Apple
- Pozycja listy kontrolnej: WYD-13
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `docs/48-zgloszenie-1-0.md:96` podaje adres `…/test-a-beta-version/manage-builds/`. Dziś ta strona ma tytuł `Page Not Found - Apple Developer`, a właściwa instrukcja jest na stronie `Stop testing a build` (`…/test-a-beta-version/stop-testing-a-build/`): `Click Expire Build.` (`dowody/apple-odczyt.txt`, odczyt 28.10.2026). To jedyny martwy adres z 33 adresów Apple w docs/48 i docs/42 (`dowody/linki-apple.txt`).
- Mechanizm: krok dopisany w M2 (8c2c77b) z adresem bez odczytu strony. Test M1-008 sprawdza tylko obecność kroku.
- Powraca: nie
- Wzorzec lub źródło: zasada roli 1 (reguły sklepu z adresem, cytatem i datą odczytu).
- Kroki w aplikacji: brak; właściciel przy Z-25a otwiera link i trafia na stronę błędu (CLAUDE.md: właściciela prowadzimy krok po kroku).
- Opcje: (a) podmienić adres i dopisać cytat „Click Expire Build.” z datą (2 min agenta). (b) Dodatkowo test, że adresy Apple w docs/48 i docs/42 nie prowadzą do „Page Not Found”, w `check-urls.mjs`, bo ten skrypt i tak działa z siecią (ok. 0,5 h). Rekomendacja: (a) teraz, (b) do backlogu 1.0.1.
- Test akceptacyjny: adres w Z-25a zwraca stronę z tytułem „Stop testing a build” i zawiera „Expire Build”.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- Pozycje „Do sprawdzenia” z audytu 27.10 (waluta T-11, etykieta przy e-mailu do wsparcia, manifest zegarka, ATS) są bez zmian w kodzie. Nowa jest tylko zmiana treści e-maila ze `StartError` (decyzja 7a, sam kod diagnostyczny), która zmniejsza dane w wiadomości. Etykieta „Data Not Collected” bez zmian.
- Ponowny przebieg `testflight.yml` (run_attempt 2) ma ten sam numer przebiegu, więc i ten sam numer buildu, a ASC go odrzuci (ograniczenie istniało już wcześniej, przy porażce wysyłki trzeba nowego przebiegu). Nie sprawdzałem, czy docs/48 to opisuje.

## Co działa dobrze i należy zachować

- Bramka `check:release` czyta rejestr ryzyk zamiast pamięci, a `check-urls.mjs` od razu wykrył rozjazd opublikowanych stron.
- Strona wsparcia zaktualizowana razem ze zmianą UI; cytaty Apple w docs/42 i docs/48 pkt 5 dosłownie zgodne ze stronami z dziś.

## Decyzje dla właściciela

1. **601:** (a) poprawka tekstów plus test ścieżki w notatkach (rekomendacja) albo (b) same teksty. Przed wklejeniem notatek (Z-25).
2. **Kolejność do zgłoszenia** (bez decyzji, informacja): eksport `site/` do repo strony i Z-10a, recenzja 27 przekładów podpisów, pełny katalog E2E na kandydacie (Z-06), build (Z-07), telefon (Z-08) i rozliczenie R-004/R-013/R-014/R-005/R-RES, uzupełnienie R-010 o przegląd z 28.10, `check:release` = 0, wpis numeru i SHA w Z-26.

Nie sprawdzono (krok właściciela albo macOS): stan pól w App Store Connect, obrazy zrzutów, `.ipa` kandydata, telefon, pełna historia git (klon płytki).

## Kontrola dowodów i sekretów

Wynik `node /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/10-wydanie --rola 10-wydanie` w `dowody/sprawdz-raport.txt`. Poświadczeń w raporcie i dowodach nie ma: trafienia skryptu sekretów są zamaskowane, ścieżka worktree zastąpiona `<wt>`. `git status --porcelain` w /home/user/trening po pracy: `dowody/git-status.txt`.
