# Przekazanie koordynatora — 23.10.2026, ok. 09:00 UTC

Dla nowej sesji koordynatora (inne konto Claude). Zasady pracy: `CLAUDE.md`; decyzje: `docs/18-przekazanie.md` (wpisy 22–23.10); lekcje i rejestr ryzyk: `docs/40-lekcje.md` (ostatnia L-028).

## Zasady komunikacji z właścicielem (22.10.2026)
- Pisz tylko: (a) gdy potrzebna jego decyzja/akcja — jedno zadanie naraz, krok po kroku; (b) krótki status co 2 h w godz. 7–23 czasu warszawskiego.
- Scalanie PR po zielonym CI robi koordynator sam (doprecyzowanie właściciela 23.10: ogólne „push/scalenie tylko za zgodą” z promptu portfela NIE dotyczy tego projektu). Wydatki (np. przekład przez API) — tylko po zgodzie na kwotę.
- Aktualizacja gałęzi PR: scal `origin/main` lokalnie i przegeneruj `node scripts/test-matrix.mjs --write` + `node scripts/readme.mjs --write` (L-025), nie „Update branch”.
- Kroki dla właściciela w Apple/ASC — zawsze z adresem źródła Apple (L-028, strażnik `tests/kroki-wlasciciela-zrodla.test.ts`).

## Stan main
`52202df` (PR #45–#59 scalone): model M5 S1 (limit 5 dni/mies.), poprawki blokerów audytu M1 partii 1, tłumaczenia po przeglądzie API, workflow `asc-metadane.yml` (opisy sklepu) i `asc-iap-localizations.yml` (apply za zatwierdzeniem release).

## Build na telefonie
TestFlight **1030** (0.20.0, kod `f2b0525`, gałąź `podglad-m5s1c`). Wyniki testu właściciela: artefakt https://claude.ai/artifact/Gxane3nk7YmF2pfAo4Jgut (kolekcja `wyniki`, build `1030`): 10 OK, 10 błąd, 2 pominięte (DA-06, ZD-03).

## Prace w toku (gałęzie; po zakończeniu: PR → zielone CI → scal po kolei)
| Gałąź | Co | Kto |
|---|---|---|
| `naprawa-telefon-1030-a` | ZK-07 awaria przy 1. uruchomieniu po reinstalacji (BLOKER), domyślny motyw ciemny, próg dnia treningowego **7 min** (było 20), „Co nowego” pokazuje 1018, jednostka w CSV | agent programista (ta sesja) |
| `naprawa-telefon-1030-b` | dźwięki/wibracje (ZD-01, W2-04), powiadomienie w trybie skupienia (R-004), zegarek: wibracja końca przerwy, „zakończ na telefonie”, komunikat nie 2×; instrukcja testu dźwięku dla właściciela | agent programista (ta sesja) |
| `naprawa-m1-p2-kod` | partia 2: „Wyślij kopię”, zgody Zdrowia el/pt, kalendarz ≥130%, komunikat „Sklep chwilowo niedostępny” | sesja audytu M1 |
| `naprawa-m1-p2-teksty` | polityka prywatności, kroki właściciela, rejestr ryzyk, strona produktu (limit), forum usunięte z planu | M1 |
| `naprawa-m1-p2-tresci` | asekuracja przy hantlach nad głową (DEC-08), treści 06-002…006 | M1 |
| `naprawa-m1-dec03-generator` | przywrócony przełącznik trybu w generatorze (DEC-03) — E2E `tylko_scenariusze` uruchamia koordynator | M1 |
| `naprawa-m1-dec07-ui` (od p2-kod) | K1 „Pełna wersja”, K3 „Planowanie”, K9; **kolejność planów: miesięczny, roczny, dożywotni + domyślnie miesięczny**; ZK-05 odświeżanie po zakupie, ZK-06 ostrzeżenie o odnawianiu | M1 |
| `naprawa-m1-dec07-teksty` (od p2-teksty) | K2, K4, K5, K6, K7 (2 h/tydz.), K8, K10 | M1 |
| `jezyk-naturalny-zrodla` | polecenie właściciela: tekst bez nazw źródeł, ekran „Źródła wiedzy”; STOP do właściciela: liczba zmian, 10 przykładów, kosztorys przekładu (bez wysyłania!) | agent programista (ta sesja) |
Kolejność scalania: p2-kod i p2-teksty przed dec07-*. Sesja audytu M1: `session_01CutnYQRJmzf8vJjq8wFJEb` (koordynuje swoje gałęzie, raporty wysyła koordynatorowi). Agenci uruchomieni w tej sesji kończą pracę wypchnięciem gałęzi (bez PR) — sprawdź gałęzie na GitHubie i otwórz PR.

## Następne kroki do wydania (plan ~26–27.10 zgłoszenie)
1. Scalić gałęzie wyżej; przegląd tłumaczy nowych/zmienionych zdań (treść krytyczna — rola tłumacz).
2. Kandydat 1.0: przypięta gałąź z main → `e2e-ios.yml` pakiet podstawowy → `testflight.yml` (zatwierdza właściciel: Review deployments → release → Approve). Właściciel: test zmian i ponowienie punktów z błędem z listy (nowy build w polu „Wersja”).
3. Przed App Store: pełny katalog E2E na kandydacie; zrzuty sklepu z podpisami (po K1/K3/K6); `asc-metadane.yml` tryb `zapis` (zatwierdza właściciel); forma grzecznościowa fr/tr (R-010 pkt 2); notatki dla App Review (`store/review-notes.md`), App Privacy, ocena wieku 9+ (kontrola odczytała 4+); zgłoszenie (właściciel).
4. Otwarte: boje wybuchowe bez ostrzeżenia [DO USTALENIA] (brak dostępu do NSCA Essentials); sprzątanie gałęzi (sesja dostaje 403 — właściciel).

## Harmonogramy (claude-code-remote)
W starej sesji działały: przegląd co godzinę `trig_01SafZZY42UAFJa7wGHWNiet` i status co 2 h `trig_019J9wEf44F1wLze9SZE5ypo` — wyłączone 23.10 przy przekazaniu; nowa sesja zakłada własne.

## Dopiski (23.10, ok. 09:00 UTC)
- `naprawa-m1-p2-teksty` gotowa do PR (cdc1486, tests.yml 39924315840 zielony): polityka prywatności bez okresu próbnego, docs/kroki właściciela wg M5 S1, rejestr ryzyk (R-M5-3, R-012, R-009 zamknięte — przy R-009 zastrzeżenie: warunek wymagał przebiegu ręcznego, był z pusha; zdecyduj, czy przyjąć), fora usunięte z planu, strona produktu z limitem. Po scaleniu: `privacy.html` na apps4brew.com publikuje właściciel (osobne repo).
- Do zrobienia przez koordynatora: `nightly.yml` (ok. linii 100) ma starą regułę „3 kolejne nocne pełne przebiegi zielone bez ponowień” — zastąpiona decyzją 21.10 (jeden pełny katalog na standardowym iPhonie); zmiana workflowu z przebiegiem dowodowym.
- Sesja audytu M1 wysyłała raporty do starej sesji koordynatora; od teraz jej raporty są też w pliku `audit/M1-2026-10-21/plan-napraw.json` w jej kontenerze — nowa sesja koordynatora może do niej napisać (send_message, `session_01CutnYQRJmzf8vJjq8wFJEb`), jeśli ma dostęp z tego samego konta; inaczej sprawdzaj gałęzie `naprawa-m1-*` na GitHubie (gotowe = wypchnięte, zielony tests.yml).

## Stan napraw audytu M1 (od sesji audytu, 23.10 ok. 09:00 UTC; plan-napraw.json był tylko w jej kontenerze)
**Gotowe:** scalone M1-040 (1c2adff), M1-028 (b8e0aae), M1-045 (1e6acbb), M1-031 cz. 1 (3375fc5), M1-048 (PR #58, f746a17). `naprawa-m1-p2-teksty` (cdc1486, zielony) — M1-046, 047, 049, 051, 052, 053 — czeka na PR.
**W toku:** `naprawa-m1-p2-kod` — M1-058, 041, 017 (DEC-01), 013 (DEC-05); `naprawa-m1-p2-tresci` — M1-031 cz. 2 (hantle, DEC-08), 032, 034, 035, 036; `naprawa-m1-dec03-generator` — M1-016 (DEC-03 c); `naprawa-m1-dec07-teksty` (od p2-teksty) — M1-023 (K2), 050 (K4), 055 (K5 + reguła forów w `.claude/agents/marketing.md`), 056 (K6), 057 (K7), 012 (K8), 900 (K10).
**Zatwierdzone, nierozpoczęte:** `naprawa-m1-dec07-ui` (od p2-kod po jej zakończeniu) — M1-014 (K1 „Pełna wersja”), 025 (K3 „Planowanie”), 006 (K9 ≤ 1 stuknięcie), kolejność planów miesięczny–roczny–dożywotni z domyślnym miesięcznym, ZK-05 (odświeżanie po zakupie), ZK-06 (ostrzeżenie przy dożywotnim), sprawdzenie „Zarządzaj subskrypcją” w TestFlight. Jeśli sesja audytu wygaśnie — zrób od zera według tej listy. M1-015 (krok importu) → 1.0.1.
**Otwarte:** 33 pozycje P2 → backlog 1.0.1; M1-031: boje wybuchowe [DO USTALENIA], hip thrust [OTWARTE].
**Kolejność scalania:** p2-kod → dec07-ui; p2-teksty → dec07-teksty; reszta niezależna. **Werdykt audytu (a2e04b8):** kurs trafny; 4 blokery naprawione; po E2E i liście „tylko telefon” na kandydacie 1.0 — „gotowe z zastrzeżeniami”.

## `naprawa-telefon-1030-b` — wypchnięta (23.10 ok. 09:10 UTC), pełne verify lokalnie NIE uruchomione → rozstrzyga tests.yml na PR
- Zegarek: po ostatniej serii raz „Zakończ trening na telefonie” (bez dublowania); nowy klucz i18n w 35 jęz. napisany przez programistę → przegląd tłumacza. Zmiany Swift nieuruchomione — sprawdzi watch-sim.yml / E2E (R-006).
- Dźwięk (ZD-01, W2-04): w kodzie bez błędu — sygnał końca przerwy to dźwięk powiadomienia (tryb cichy = tylko wibracja, zgodnie z Apple); głos domyślnie wyłączony i mówi tylko przy aplikacji na wierzchu. R-004: uprawnienie time-sensitive w pakiecie 1030 jest; przyczyna braku baneru to prawdopodobnie ustawienia Skupienia — ryzyko otwarte.
- **Dla właściciela:** instrukcja testu dźwięku/wibracji/Skupienia `docs/47-instrukcja-testu-dzwieku.md` (testy A–F, źródła Apple) — do przejścia na kandydacie 1.0; decyzja „dźwięk w trybie cichym”: A wskazówka „w trybie cichym telefon tylko wibruje” (rekomendacja teraz) / B własny krótki sygnał przy aplikacji na wierzchu (po 1.0, jeśli test D potwierdzi) / C audio w tle (bateria, ryzyko przeglądu). Wibracja zegarka — decyzja po teście F.
