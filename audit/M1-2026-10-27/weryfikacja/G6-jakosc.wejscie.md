### 07-jakosc-001 · Bramka wydania R-015 nie istnieje w żadnym kroku wydania, choć rejestr i skrypt twierdzą, że tak
- Pozycja listy kontrolnej: JAK-17
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D
- Dowód: nagłówek skryptu `scripts/ci/blokada-wydania.mjs:5` deklaruje uruchamianie w testflight.yml i na liście wydawcy; warunek zamknięcia R-015 w `docs/40-lekcje.md:32` mówi to samo. `grep -rln "blokada-wydania|openExceptions|check:release"` w `.github`, `scripts`, `.claude`, docs/39 i docs/48 zwraca tylko sam skrypt i `package.json` (dowody/check-release-podpiecie.txt); build TestFlight uruchamia `npm run verify` (`.github/workflows/testflight.yml:97`), które celowo nie zawiera `check:release` (strażnik `tests/blokada-wydania.test.ts` pilnuje tylko, że NIE jest w verify).
- Wzorzec lub źródło: lista kontrolna JAK-17 (nazwana siatka bezpieczeństwa nie istnieje = fałszywa pewność); CLAUDE.md, model po L-001 pkt 2.
- Kroki w aplikacji: zmiana tekstu dziedzinowego z kluczem „zmieniony” w zestawie przekładu przed wydaniem → verify zielone (wyjątek dozwolony) → TestFlight bez blokady → w 33 językach w aplikacji wracają nazwy źródeł (zasada „źródła publicznie anonimowo”). Dziś wyjątek jest pusty (dowody/check-release.txt), więc skutek jest tylko przyszły.

- Test akceptacyjny: test workflowu sprawdza krok `npm run check:release` w zadaniu przed budową; przebieg dowodowy `testflight.yml` z `bez_wysylki` na gałęzi z celowo dodanym wpisem „zmieniony” kończy się błędem w bramce.


### 07-jakosc-002 · Rejestr ryzyk ma 7 otwartych pozycji i nieaktualne stany, a bramka wydania go nie czyta
- Pozycja listy kontrolnej: JAK-16
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: w `docs/40-lekcje.md:16` (R-005), `docs/40-lekcje.md:17` (R-004), `docs/40-lekcje.md:18` (R-006), `docs/40-lekcje.md:20` (R-008), `docs/40-lekcje.md:22` (R-010, blokuje App Store), `docs/40-lekcje.md:25` (R-013 częściowo), `docs/40-lekcje.md:26` (R-014) stan otwarte. Jednocześnie `docs/48-zgloszenie-1-0.md:304` uznaje R-006 za spełnione; telefon 27.10 potwierdził warunki R-004 (pilne w trybie skupienia) i R-014 (pogrubiony tekst); krok mapy źródeł JS był zielony w przebiegu 40435246644 (warunek (a) R-008). CLAUDE.md: otwarte ryzyko blokuje wydanie; jedyny automat rejestru to R-015 (07-jakosc-001).
- Wzorzec lub źródło: CLAUDE.md, model po L-001 pkt 2 (rejestr z blokadą); moduł wydanie, pkt 10.
- Kroki w aplikacji: nie dotyczy interfejsu — ryzyko procesu wydania: build idzie do App Store, gdy rejestr pokazuje R-010 (treść krytyczna w 34 językach bez drugiego przeglądu po przekładzie z 26.10) jako otwarte, albo wydanie stoi na ryzykach faktycznie zamkniętych.

- Test akceptacyjny: dodanie wiersza ze stanem „otwarte” do rejestru czerwieni test-strażnik; bieżący rejestr ma każdy wiersz zamknięty z dowodem albo z decyzją właściciela (data).


### 07-jakosc-003 · Subskrybent widzi na ekranie zakupu ofertę darmowych dni i „Subskrybuj” dla posiadanego planu; ten stan nie ma kryterium ani testu
- Pozycja listy kontrolnej: JAK-03 (usterka ekranu: rola 02/04, kod: rola 08)
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: w `app/paywall.tsx:66` nagłówek o darmowych dniach zależy tylko od wejścia z limitu, nie od aktywnego dostępu; lista planów i przycisk zakupu znikają tylko przy dożywotnim (`app/paywall.tsx:79`); karta posiadania nie nazywa planu (`app/paywall.tsx:69`). Testy sprawdzają obecność karty (`tests/subscription-ui.test.tsx:83`), ale żaden nie sprawdza braku nagłówka ani przycisku dla posiadanego planu; BR-ZAK-003 nie ma scenariusza dla aktywnej subskrypcji (`docs/brd/wymagania.md:686`); dowody/t11-stan-posiadania.txt; telefon 27.10 (T-11, build 1031) potwierdził skutek.
- Wzorzec lub źródło: JAK-03; CLAUDE.md (każdy błąd dostaje test odtwarzający; nowe zachowanie = test scenariuszowy).
- Kroki w aplikacji: kup subskrypcję miesięczną → Ustawienia → Subskrypcja → ekran zakupu: wstęp „5 dni za darmo”, lista planów, „Subskrybuj” także dla miesięcznego; karta mówi tylko „Masz pełną wersję, dostęp do …”.

- Test akceptacyjny: test ekranu z uprawnieniem `monthly` — brak `paywall-headline`, plan `monthly` oznaczony jako aktualny bez przycisku zakupu, karta podaje nazwę planu; czerwony na 025a50b9.


### 07-jakosc-004 · Przy największym tekście ekran Trening ucina ikony (T-04), a test zastępczy pozycji ZD-03 przechodzi
- Pozycja listy kontrolnej: JAK-13 (usterka dostępności: rola 04, SP-06/SP-07)
- Poziom: P1
- Realność: realny · Pewność: wysoka (obserwacja z telefonu właściciela; przyczynę w kodzie wskazuje commit 644c4989 na gałęzi naprawy-1-0, nieczytany w szczegółach)
- Rodzaj: D
- Dowód: lista „tylko telefon” ZD-03 (`docs/39-lista-kontrolna-wydania.md:70`) — wynik 27.10, build 1031: przy największym tekście ucięta większość ikon. Zastępniki ZD-03 to testy Jest (`tests/matrix-a11y.test.tsx`), które sprawdzają limity powiększenia tylko dla przycisków i zdań powyżej 25 znaków; znaki-ikony nie są objęte. Na 025a50b9 brak testu odtwarzającego T-04.
- Wzorzec lub źródło: moduł e2e-mobilne, „Dostępność: co sprawdza które narzędzie” (rozmiar, ucięcie i Dynamic Type tylko na urządzeniu); skala skutków: bariera dostępności = S2.
- Kroki w aplikacji: Ustawienia iOS → Dostępność → Większe rozmiary tekstu, suwak do końca → Trening: duża szara ikona startu kolejnego treningu i inne ikony ucięte.

- Test akceptacyjny: strażnik czerwony na 025a50b9 (znak-ikona bez limitu), zielony po poprawce; ZD-03 na telefonie z datą i buildem.


### 10-wydanie-003 · Rejestr ryzyk nierozliczony: 7 pozycji „otwarte” mimo dowodów z 26–27.10, formalnie blokuje zgłoszenie
- Pozycja listy kontrolnej: WYD-02 (warunki wysyłki rozliczone)
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: CLAUDE.md (model pracy po L-001, pkt 2): otwarte ryzyko blokuje wydanie. W rejestrze R-004, R-005, R-006, R-008, R-010, R-013, R-014 mają stan otwarte albo częściowo (`dowody/rejestr-ryzyk.txt`); przegląd Z-02 wykonano 26.10 (docs/18), a uwagi z telefonu z 27.10 (powiadomienie pilne w trybie skupienia, zegarek, pogrubiony tekst: OK) nie są wpisane do rejestru. R-010 wprost: `docs/40-lekcje.md:22` „blokuje wydanie w App Store, nie blokuje TestFlight”.
- Wzorzec lub źródło: CLAUDE.md, model pracy po L-001, pkt 2; `docs/42-plan-wydania-1.0.md` W1-01.
- Kroki w aplikacji: brak (proces); skutek: zgłoszenie z otwartymi ryzykami łamie bramkę projektu albo zgłoszenie stoi bez potrzeby.

- Test akceptacyjny: w `docs/40` żadna pozycja „otwarte” bez decyzji o odroczeniu z datą w dniu Z-29.


