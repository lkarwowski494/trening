# 39. Lista kontrolna wydania dla właściciela (generowana — nie edytować ręcznie)

Wygenerowano z `tests/przeplywy.json` (`node scripts/flows-catalog.mjs --write`). To jedyne rzeczy, których nie sprawdzi żaden automat (symulator CI, Maestro, Jest) — wymagają prawdziwego telefonu
albo Ciebie. Wszystko inne robią scenariusze Maestro (`docs/37`) przy każdym wydaniu. Kolejność dowolna; całość na jednym telefonie z TestFlight to ok. 15–20 minut.

Zasada: odhacz każdy punkt dla wersji, którą wypuszczasz; wada → wiadomość do agenta z numerem punktu (np. „PR-12”). Punkty wersji 0.20 obowiązują od jej wydania.

## Przerwanie, tło, błędne i skrajne dane

- [ ] **PR-12** Zablokowany ekran w przerwie, powiadomienie o końcu przerwy, Live Activity i wibracja
  - Co zrobić i czego oczekiwać: Przerwa 2:00 → zablokuj ekran → w 2:00 baner, dźwięk i wibracja; Live Activity pokazuje odliczanie i znika po końcu; odblokuj: licznik zgodny; zmień przerwę w trakcie — Live Activity się zmienia.
  - Dlaczego nie automat: Maestro nie blokuje ekranu, baner powiadomień, ekran blokady i Dynamic Island są poza aplikacją; wibracja i dźwięk niewidoczne dla testu.
  - Pokrycie zastępcze w Jest: `tests/e2e-102-reminder.test.tsx`, `tests/timer-logic.test.ts`, `tests/audit-final-timer.test.tsx`

## Ustawienia, uprawnienia, zakupy

- [ ] **US-08** Zapis zakończonych treningów do Apple Health (zgoda systemowa)
  - Co zrobić i czego oczekiwać: Włącz zapis → zezwól w arkuszu → zrób krótki trening → Zdrowie → Przeglądaj → Aktywność → Trening siłowy: jest jeden wpis z czasem treningu. Odmów zgody: aplikacja pokazuje komunikat, przełącznik zostaje wyłączony.
  - Dlaczego nie automat: Arkusz zgody HealthKit to okno systemowe, a Zdrowie na symulatorze CI nie ma aplikacji do podglądu zapisanych danych; zgody nie da się nadać z Maestro.
  - Pokrycie zastępcze w Jest: `tests/health-use.test.tsx`, `tests/healthkit-contract.test.ts`, `tests/health-permissions.test.ts`
- [ ] **US-10** Odczyt Apple Health z prawdziwymi danymi (kroki, tętno, kcal, trening z zegarka)
  - Co zrobić i czego oczekiwać: Na iPhonie z zegarkiem: włącz odczyt, zezwól; dzień z aktywnością w Planie pokazuje kroki i inne aktywności; sesja z treningiem z zegarka pokazuje tętno i kcal; wyłącz odczyt — linie znikają.
  - Dlaczego nie automat: Symulator CI nie ma danych Zdrowia (kroków, tętna, zegarka) ani sterowania nimi, a arkusz zgody jest oknem systemowym (docs/29 pkt 7).
  - Pokrycie zastępcze w Jest: `tests/health-read-ui.test.tsx`, `tests/health-scenario.test.tsx`, `tests/health-query.test.ts`
- [ ] **US-13** Prawdziwy zakup w piaskownicy Apple: każdy plan, przywrócenie, zwrot, Chmura rodzinna, limit dni
  - Co zrobić i czego oczekiwać: Model M5 S1 (docs/monetyzacja.md), sześć scenariuszy: (1) kup każdy plan → arkusz Apple pokazuje cenę planu i brak oferty wprowadzającej, po zakupie „Masz pełną wersję” (dożywotni: „Masz dostęp na zawsze”); (2) usuń i zainstaluj ponownie → „Przywróć zakupy” przywraca dostęp; (3) tryb samolotowy po zakupie → dostęp zostaje; (4) zwrot w piaskownicy → dostęp znika po odświeżeniu; (5) Chmura rodzinna: drugie konto z rodziny ma dostęp; (6) bez zakupu po wykorzystaniu darmowego limitu dni treningowych w miesiącu → start treningu w nowym dniu otwiera ekran zakupu, historia i kopia dostępne.
  - Dlaczego nie automat: Okna zakupu Apple i konto piaskownicy są poza kontrolą Maestro; build E2E ma sztuczny sklep (EXPO_PUBLIC_STORE_FAKE), więc nie sprawdza prawdziwego StoreKit.
  - Pokrycie zastępcze w Jest: `tests/store-adapter.test.ts`, `tests/subscription-ui.test.tsx`, `tests/subscription-invariants.test.ts`, `tests/entitlement.test.ts`
- [ ] **US-15** „Napisz do nas” (poczta) i prośba o ocenę w App Store
  - Co zrobić i czego oczekiwać: Stuknij „Napisz do nas” — otwiera się wiadomość z adresem wsparcia i wersją; ocena: tylko w wydaniu App Store.
  - Dlaczego nie automat: Okno poczty i systemowa prośba o ocenę to okna systemowe, nieobecne w TestFlight/na symulatorze CI.
  - Pokrycie zastępcze w Jest: `tests/support-mail.test.tsx`, `tests/review-run.test.tsx`, `tests/review.test.ts`

## Kopia, eksport, import, czyszczenie danych

- [ ] **DA-02** Eksport kopii (JSON) i historii (CSV) przez arkusz udostępniania
  - Co zrobić i czego oczekiwać: Eksportuj backup → Zapisz w Plikach; potem (wg DA-04) „Wyczyść dane” i import tego pliku: dane identyczne. CSV otwiera się w Plikach/Numbers z kolumnami i właściwą jednostką.
  - Dlaczego nie automat: Arkusz udostępniania i Pliki to okna systemowe (UIActivityViewController), poza kontrolą Maestro.
  - Pokrycie zastępcze w Jest: `tests/audit-io-flows.test.tsx`, `tests/audit-io-more.test.tsx`, `tests/roundtrip.test.ts`
- [ ] **DA-06** Import historii z pliku CSV popularnego dziennika: podgląd, dopisanie bez usuwania danych
  - Co zrobić i czego oczekiwać: Wyeksportuj CSV z innej aplikacji na iPhone’a, wybierz w „Importuj historię z pliku CSV”: podgląd liczb, import, powtórny import nie dubluje.
  - Dlaczego nie automat: Plik CSV trzeba wskazać w systemowym oknie wyboru plików, a na symulatorze CI nie ma pliku CSV innego dziennika.
  - Pokrycie zastępcze w Jest: `tests/csv-import-ui.test.tsx`, `tests/csv-import-logic.test.ts`, `tests/backlog-0.10.1-dane-ui.test.tsx`, `tests/monetyzacja-csv.test.ts`
- [ ] **DA-08** Karta „Historia jest już w telefonie” po udanym imporcie CSV w stanie darmowym, przycisk do ekranu zakupu
  - Co zrobić i czego oczekiwać: Na iPhonie w stanie darmowym zaimportuj plik CSV: pod komunikatem sukcesu jest karta; „Zobacz plany Pro ›” otwiera ekran zakupu.
  - Dlaczego nie automat: Plik CSV trzeba wskazać w systemowym oknie wyboru plików, a na symulatorze CI nie ma pliku CSV do wskazania (jak DA-06).
  - Pokrycie zastępcze w Jest: `tests/monetyzacja-ui.test.tsx`, `tests/monetyzacja-csv.test.ts`

## Po aktualizacji z poprzedniej wersji

- [ ] **AK-05** Aktualizacja z TestFlight na prawdziwym telefonie (dane z poprzedniego buildu)
  - Co zrobić i czego oczekiwać: Na własnym telefonie: stary build → TestFlight Zaktualizuj → otwórz: historia i szablony na miejscu, plan, trening w toku (jeśli był), ikona i nazwa poprawne, „Co nowego” pokazuje wersję.
  - Dlaczego nie automat: Instalacja z TestFlight na prawdziwym urządzeniu (podpis, ikona, rozszerzenie Live Activity, dane w prawdziwej bazie) nie istnieje na symulatorze CI.
  - Pokrycie zastępcze w Jest: `tests/maestro-zycie.test.tsx`, `tests/migrate-idem.test.ts`, `tests/places-migrate.test.ts`

## Funkcje systemowe (powiadomienia, widżet, Zdrowie, sklep)

- [ ] **ZD-01** Wibracja na koniec przerwy i stopera serii; osobne przełączniki „Dźwięk na koniec przerwy” i „Wibracje”
  - Co zrobić i czego oczekiwać: Z włączonymi „Dźwięk na koniec przerwy” i „Wibracje” poczekaj do końca przerwy (wibracja i sygnał); wyłącz „Wibracje” — sygnał bez wibracji; wyłącz „Dźwięk na koniec przerwy” — bez sygnału, a wibracja zależy już tylko od „Wibracje”.
  - Dlaczego nie automat: Silnik haptyczny nie istnieje na symulatorze, a Maestro go nie czyta.
  - Pokrycie zastępcze w Jest: `tests/timer-logic.test.ts`, `tests/e2e-102-reminder.test.tsx`, `tests/m3-p5d-haptics.test.ts`, `tests/m3-p5d-haptics-done.test.tsx`
- [ ] **ZD-02** Instalacja z TestFlight na prawdziwym telefonie: pierwsze uruchomienie, ikona, nazwa, animacja startowa
  - Co zrobić i czego oczekiwać: Po instalacji: ikona i nazwa poprawne, animacja startowa krótka (stuknięcie pomija), „Pierwsze kroki”, brak komunikatu o błędzie danych.
  - Dlaczego nie automat: Podpis, ikona, ekran startowy i środowisko prawdziwego urządzenia istnieją dopiero w buildzie z TestFlight.
  - Pokrycie zastępcze w Jest: `tests/intro.test.tsx`, `tests/smoke.test.tsx`
- [ ] **ZD-03** Powiększony tekst systemowy, VoiceOver na żywo i „Ogranicz ruch”
  - Co zrobić i czego oczekiwać: Największy rozmiar tekstu: trening, plan i ustawienia czytelne bez ucięć; VoiceOver: przejdź start → seria → zakończenie; „Ogranicz ruch”: animacja startowa i figury ćwiczeń nie migają.
  - Dlaczego nie automat: Maestro nie przestawia ustawień dostępności systemu.
  - Pokrycie zastępcze w Jest: `tests/tabs-a11y.test.tsx`, `tests/matrix-a11y.test.tsx`

## Wersja 0.20 (zegarek i głos) — projekt

- [ ] **W2-04** Głos na żywo: zapowiedź następnego ćwiczenia w AirPods, ściszanie muzyki, tryb cichy *(od 0.20)*
  - Co zrobić i czego oczekiwać: AirPods + muzyka: odhacz serię → zapowiedź w słuchawkach, muzyka ściszona i wraca; bez słuchawek cisza; przełącznik głośnika: mówi telefon; tryb cichy; odłączenie słuchawek w trakcie; podcast pauzuje i wznawia.
  - Dlaczego nie automat: Mowa AVSpeechSynthesizer i trasa dźwięku (słuchawki, ściszanie) nie są słyszalne ani mierzalne na symulatorze CI.
- [ ] **W2-05** Apple Watch i drugi zegarek (Connect IQ) na prawdziwych zegarkach: parowanie, odliczanie, wibracja, „Połącz z telefonem” *(od 0.20)*
  - Co zrobić i czego oczekiwać: Wg docs/35 (lista ręczna wydania 0.20): parowanie, pierwsza seria z zegarka, przerwa z wibracją, zasięg w kieszeni, „Cofnij”, „Pomiń”.
  - Dlaczego nie automat: Zegarek, WatchConnectivity i Connect IQ nie istnieją na symulatorze iPhone’a w CI; Apple Watch bywa tylko wirtualny, zegarek Connect IQ tylko fizyczny.

Razem punktów: **14**.
