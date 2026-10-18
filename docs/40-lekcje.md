# 40. Lekcje po błędach (lessons learnt)

Zasada właściciela 14.10.2026 (CLAUDE.md): po każdym błędzie od razu wpis tutaj — co się stało, przyczyna źródłowa, akcje zapobiegawcze
(mechanizm, nie postanowienie) i ich stan, ocena zakresu: **lokalna** (fix tylko dla tego przypadku) albo **systemowa** (luka w modelu pracy →
propozycja zmiany dla właściciela). Najnowsze na górze. Przed wydaniem przejrzeć otwarte akcje.

Stan akcji: **zrobione** (z commitem/plikiem) · **w toku** · **otwarte**.

## Rejestr ryzyk (otwarte blokują wydanie)

| id | ryzyko | warunek zamknięcia | stan |
|---|---|---|---|
| R-001 | Podpis B (`codesign` z plikami uprawnień) — wysyłka do App Store Connect po eksporcie do pliku nie testowana na prawdziwym buildzie | pierwszy przebieg `testflight.yml` 0.20 zielony + strażnik uprawnień zielony | otwarte |
| R-002 | Zdrowie na telefonie po poprawce podpisu (odczyt i zapis, kolejka zapisu z 0.18) | lista kontrolna właściciela po TestFlight 0.20: włączenie odczytu bez błędu, zaległy trening widoczny w Zdrowiu | otwarte |
| R-003 | Zegarek: zgodność fałszywego telefonu z prawdziwym (kolejność migawka → ack) | lista kontrolna właściciela po TestFlight 0.20: seria odhaczona na zegarku → przerwa z timerem | otwarte |

## L-005 (14.10.2026) — równoległe pełne verify przeciążają maszynę i dają fałszywe porażki
- **Co się stało:** 4–5 agentów naraz uruchamiało `npm run verify` na 4 rdzeniach (obciążenie 15–24): przekroczenia czasu testów, SIGKILL, ubite przebiegi po 30 min; każdy agent ręcznie powtarzał pliki i składał verify z kawałków.
- **Przyczyna źródłowa:** brak koordynacji zasobu wspólnego — każdy agent dostaje polecenie „pełne verify przed pushem”, nikt nie pilnuje, ile ich biegnie naraz.
- **Ocena zakresu: systemowa** (dotyczy każdej pracy równoległej agentów na jednej maszynie).
- **Akcje:**
  1. Kolejka verify: `scratchpad/tools/verify-kolejka.sh` (flock — jeden pełny verify naraz); polecenie dla agentów — **zrobione** (od 14.10, ok. 15:45).
  2. Przy następnym przeglądzie procesu: reguła w CLAUDE.md o kolejce verify przy pracy równoległej — **otwarte**.

## L-004 (14.10.2026) — podgląd zrzutów do sklepu na danych testowych
- **Co się stało:** do akceptacji podpisów pokazałem właścicielowi ramki nałożone na zrzuty z E2E (angielski interfejs, lb, wykres bez danych, plan „wszystkie dni FBW A”, pusta lista szablonów). Właściciel: „to nie są materiały marketingowe”.
- **Przyczyna źródłowa:** pośpiech z pokazaniem czegokolwiek zamiast najpierw ustalenia, co ekrany mają przedstawiać (scenorys) i obejrzenia wyniku własnymi oczami pod kątem odbiorcy; agent przygotował workflow i dane bez przebiegu i bez przeglądu obrazów.
- **Ocena zakresu: systemowa (lekka).** Ta sama luka grozi przy każdym materiale dla odbiorcy zewnętrznego (strona, opis, grafiki).
- **Akcje:**
  1. Materiał dla odbiorcy zewnętrznego: najpierw scenorys/cel do akceptacji, potem wykonanie, potem przegląd koordynatora (obejrzenie wyniku), dopiero potem pokazanie właścicielowi — **zrobione** (stosowane przy zrzutach: scratchpad/scenorys-zrzuty.md).
  2. Zrzuty do sklepu: przebieg dowodowy na symulatorze i przegląd każdego obrazu przed pokazaniem — **w toku** (f020-sklep).

## L-003 (14.10.2026) — słoweński odrzucony przez App Store Connect przy zapisie lokalizacji zakupów

- **Co się stało:** pierwszy zapis lokalizacji (skrypt `scripts/asc/iap-localizations.mjs`, run 38547020658) — 108 z 112 utworzonych,
  4 błędy 409 `UNSUPPORTED_LOCALE_CODE` dla `sl`. Bez skutków dla użytkowników; skrypt poszedł dalej, nic nie usunął.
- **Przyczyna źródłowa:** lista lokalizacji ASC przyjęta ze strony Apple dla metadanych aplikacji; dla zakupów lista jest węższa. Ryzyko było
  zapisane jako „[DO POTWIERDZENIA przy pierwszym apply]”, ale dry-run tego nie sprawdza (ASC nie ma trybu walidacji bez zapisu).
- **Ocena zakresu: lokalna.** Fakt o jednej usłudze Apple; skrypt już izoluje błąd pozycji. Bez zmiany modelu pracy.
- **Akcje:**
  1. `sl` → `ascLocale: null`, testy 4 × 27 — **zrobione** (1940697).
  2. Skrypt zapisu odporny na błąd pojedynczej pozycji (już był) — **zrobione**.

## L-002 (14.10.2026) — błędna informacja dla właściciela: „miejsca jadą z treningiem”

- **Co się stało:** w pytaniu o miejsca (0.19, pytanie 6) podałem właścicielowi, że miejsce przenosi się z treningiem; w kodzie miejsca były
  już przypisane do daty (P7 A). Właściciel podjął decyzję na podstawie fałszywej przesłanki; sprostowane w docs/18.
- **Przyczyna źródłowa:** opis zachowania wzięty z pamięci rozmowy i dokumentów, nie z kodu (zasada „udokumentowane ≠ zaimplementowane”).
- **Ocena zakresu: systemowa.** Ta sama luka (opis z pamięci zamiast z kodu) może dotyczyć każdej decyzji właściciela. Właściciel
  14.10.2026 nie przyjął tego jako osobnej zasady modelu pracy — zostaje praktyką koordynatora (akcja 1).
- **Akcje:**
  1. Reguła: przy pytaniu właściciela o zachowanie istniejącej funkcji opis stanu obecnego sprawdzam w kodzie lub testem (ścieżka pliku
     w uzasadnieniu opcji) — **zrobione** (ten wpis; stosowane w pytaniach od 14.10).

## L-001 (14.10.2026) — TestFlight 0.18 (build 1015) bez uprawnienia do Zdrowia — WYSOKI

- **Co się stało:** właściciel na telefonie: „Pokazuj dane z Apple Health” → „Nie udało się włączyć Apple Health”; zakończony trening
  czeka w kolejce („Czeka na zapis w Apple Health: 1”). Zapis do Zdrowia działał w buildach do 1014.
- **Przyczyna źródłowa:** zmiana podpisu w `testflight.yml` (88a5342, archiwum z `CODE_SIGNING_ALLOWED=NO`, podpis dopiero przy eksporcie)
  usunęła z aplikacji i zegarka `com.apple.developer.healthkit` (dowód: run 38549517589 — .ipa bez klucza; wariant z `codesign` z plikiem
  uprawnień — klucz jest). Ryzyko było zapisane jako „Niepotwierdzone (rozstrzygnie pierwszy build)”, ale:
  - nie było automatycznego sprawdzenia uprawnień w zbudowanym pakiecie — testy sprawdzały plik w projekcie, nie podpisaną aplikację;
  - „sprawdzę po buildzie” było postanowieniem, nie krokiem — nikt tego nie sprawdził przed instalacją u właściciela;
  - zadanie dla właściciela „sprawdź 0.18 na telefonie” było zbiorcze i odłożone, więc błąd wyszedł przy zwykłym używaniu.
- **Ocena zakresu: systemowa** (trzy luki modelu pracy, nie tylko podpis):
  - zmiana procesu budowania sprawdzona tylko testami pliku workflowu, bez przebiegu dowodowego na prawdziwym buildzie przed scaleniem;
  - ryzyko „niepotwierdzone” bez właściciela, terminu i warunku blokującego — znika w dokumencie;
  - sprawdzenie na telefonie po buildzie odłożone na później zamiast jako pierwsze zadanie po instalacji.
  Zmiany modelu pracy przyjęte przez właściciela 14.10.2026: przebieg dowodowy CI, rejestr ryzyk z blokadą, telefon zaraz po buildzie (CLAUDE.md).
- **Akcje:**
  1. Podpis uprawnień przed eksportem (`codesign` z plikami uprawnień) — **w toku** (gałąź f020-podpis-uprawnienia, 8ad01e4; potwierdzi
     pierwszy TestFlight 0.20 na telefonie).
  2. Strażnik w `testflight.yml`: eksport do pliku → `scripts/ci/check-entitlements.sh` (uprawnienia aplikacji i zegarka, `get-task-allow`)
     → dopiero wysyłka; brak uprawnienia zatrzymuje build przed TestFlight. Testy w `tests/public-repo.test.ts`, regres
     w `tests/regress.test.tsx` — **w toku** (ta sama gałąź).
  3. Reguła: każde ryzyko zapisane jako „niepotwierdzone / rozstrzygnie build” dostaje automatyczne sprawdzenie albo konkretny krok
     dla właściciela z datą, zanim build trafi na telefon — **zrobione** (ten wpis + zasada w CLAUDE.md).
  4. Po każdej zmianie sposobu budowania/podpisu: pierwsze zadanie dla właściciela po instalacji to sprawdzenie Zdrowia (włączenie
     odczytu, zakończony trening widoczny w Zdrowiu) i Live Activity — **otwarte** (przy TestFlight 0.20).
  5. Komunikat „Nie udało się zapisać w Apple Health… Sprawdź zgodę” myli, gdy przyczyną jest brak uprawnienia w aplikacji — backlog
     (ŚREDNI, 0.21) — **otwarte**.
