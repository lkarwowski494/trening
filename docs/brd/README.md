# BRD: Trening — katalog spełnianych wymagań [odtworzony z kodu i docs]
Stan: odtworzenie z kodu i dokumentów (nie wywiad) · Aktualizacja: 2026-10-28 (M1-audytor-generalny-022) · Hierarchia źródeł: CLAUDE.md projektu (szczeble 1–5)

Ten BRD **opisuje, co aplikacja spełnia dziś** (wersja 1.0.0: 0.20.0 + naprawy audytu M1 z 19.10.2026 i audytu 1.0 z 27.10.2026), odtworzone z kodu (`app/`, `components/`, `lib/`), dokumentów w `docs/` i testów. **Bez ocen wartości**: nie mówi, czy funkcja jest potrzebna ani dobra; mówi, co robi i skąd to wiadomo (decyzja, dokument, test). Funkcje bez zapisanego dowodu wartości (generator, odczyt Zdrowia, kilka planów, Dostosuj do miejsca) zostają w aplikacji (decyzja właściciela 19.10.2026, DEC-04 = D-004) i są tu opisane jako spełniane wymagania.

**Reguła aktualizacji (CLAUDE.md):** nowa funkcja lub zmiana zachowania = aktualizacja tego BRD w tym samym commicie (wymaganie BR, a przy liczeniu według wiedzy dziedzinowej — reguła RD z wektorami). Kontrola mechaniczna: `scripts/kontrola-brd.mjs` (`node scripts/kontrola-brd.mjs docs/brd`), pilnowana testem `tests/audit-m1-044-brd.test.ts`.

## Spis

| plik | zawartość |
|---|---|
| `README.md` | stan, spis, granica aplikacji, decyzje, blokery wydania, otwarte pytania |
| `odkrywanie.md` | prace J, persona P, zasady produktu ZP, ograniczenia OG |
| `wymagania.md` | przepływy PR, wymagania funkcjonalne BR i niefunkcjonalne NFR |
| `wymagania-uzupelnienie.md` | wymagania dopisane 2026-10-28 dla funkcji bez BR (PR-10…PR-12); osobny plik, bo `wymagania.md` przekracza ok. 20 KB |
| `reguly.md` | reguły dziedzinowe RD z wektorami testowymi |
| `zrodla.md` | źródła S (przeniesione z zapisów w `docs/research`) |
| `errata.md` | errata ER: sprzeczności i korekty BRD z datą i statusem |

Wektory reguł RD (`RD-nn-Wn`) są sprawdzane w kodzie testem `tests/audit-m1-044-brd.test.ts` (wejścia i oczekiwane wartości z tabel w `reguly.md` uruchamiane na prawdziwych funkcjach aplikacji).

## Granica aplikacji (decyzja właściciela 19.10.2026, DEC-03 = D-003)

Aplikacja jest dziennikiem treningu siłowego i cardio. **Poza zakresem:** dieta, sen, suplementy oraz relacja trener–podopieczny. Istniejące pola modelu danych spoza zakresu (np. `State.mornings` z usuniętego wpisu porannego, docs/15) zostają bez migracji. Funkcje online (synchronizacja, konto, współdzielenie) nie istnieją: aplikacja nie wykonuje wywołań sieciowych (ZP-05, NFR-PRV-001).

## Decyzje, do których BRD się odwołuje

Oznaczenia `D-nnn` to numery decyzji z audytu M1 (DEC-nn), zapisanych w `docs/18-przekazanie.md` z datą; BRD tylko się do nich odwołuje (nie jest rejestrem decyzji).

| ID | decyzja | data | gdzie |
|---|---|---|---|
| D-003 | granica aplikacji: dieta, sen, suplementy, trener–podopieczny poza zakresem | 2026-10-19 | docs/18 |
| D-004 | funkcje bez zapisanego dowodu wartości zostają w aplikacji | 2026-10-19 | docs/18 |
| D-005 | zapowiedzi głosowe domyślnie wyłączone (audyt: DEC-05) | 2026-10-20 | docs/18, docs/36 |
| D-006 | kalkulator talerzy usunięty (razem z paskiem talerzy) | 2026-10-19 | docs/18 |
| D-008 | porzucony trening: przypomnienie po 2 h, ciche zakończenie po 6 h; liczby zostają | 2026-10-19 | docs/18; kod `lib/state/finish.ts` (`STALE_ASK_MS`, `STALE_AUTO_MS`) |
| D-012 | usuwanie serii i ćwiczenia także z menu (obok gestu) | 2026-10-19 | docs/18, docs/32 |
| D-101 | model M5 S1: cała aplikacja darmowa do 5 dni treningowych w miesiącu; trening wstecz, import i edycja poza limitem; usunięcie treningu nie zwraca dnia | 2026-10-22 | docs/18, docs/monetyzacja.md |
| D-102 | próg dnia treningowego: trening na żywo dłuższy niż 7 minut bez pauz (zmiana z 20 minut z 22.10.2026) | 2026-10-23 | docs/18 (test na telefonie, build 1030) |
| D-103 | monetyzacja w 1.0: okno „Uczciwe zasady” po pierwszym treningu na żywo (raz, tylko stan darmowy), rozszerzony import CSV, karta po imporcie | 2026-10-25 | docs/18, docs/monetyzacja.md |
| D-104 | prośba o ocenę: po N-tym ukończonym treningu z nowym rekordem, odstęp 14 dni, najwyżej raz na wersję (11.10.2026); N = 3 (22.10.2026) | 2026-10-11, 2026-10-22 | docs/18, docs/26 |
| D-105 | „Poproś o nową funkcję” obok „Napisz do nas”; link na podsumowaniu co N-ty trening, N = 10 (liczba produktowa), nigdy razem z prośbą o ocenę | 2026-10-14 | docs/18, docs/34 |
| D-106 | „Napisz do nas”: wiadomość z poczty użytkownika na adres wsparcia, temat i stopka techniczna | 2026-10-13 | docs/18 |
| D-107 | od ekranu treningu do odhaczonej serii najwyżej 1 stuknięcie (DEC-07 K9) | 2026-10-23 | docs/18 (wpis „DEC-07 — karty P2”) |
| D-108 | publicznie bez źródeł, nawet ogólnie; ekran „Źródła” w Ustawieniach usunięty | 2026-10-25 | docs/18 (wpis „całkiem anonimowo”) |
| D-109 | oznaczenia pewności („uproszczenie”, „nasz wybór”, „jedno źródło”, „konwencja”) poza tekstami interfejsu | 2026-10-23 | docs/18 (druga decyzja z 23.10.2026) |
| D-110 | system miar metryczny albo imperialny jednym ustawieniem (DEC-28); domyślny z regionu telefonu (DEC-29) | 2026-10-20 | docs/18 |
| D-111 | przypomnienie o treningu z planu: jedno lokalne powiadomienie rano w dniu treningu, godzina 8:00 | 2026-10-08 | docs/18-archiwum-do-11.10.md, `lib/planReminder.ts` |
| D-112 | trening „zrobiony wcześniej” (wariant A): najbliższy dzień planu z tym szablonem oznaczony jako zrobiony, liczy się do swojego tygodnia | 2026-10-11 | docs/18 |
| D-113 | „Strażnik progresji”: specyfikacja (kierunek tygodnia do tygodnia, cel serii po całym planie) i nazwa w aplikacji; 19.10.2026: z 0 kg do ciężaru = progres | 2026-10-14 | docs/18, `lib/guard.ts` |
| D-114 | deload A: podpowiedź w kalendarzu „zwykle co 4–6 tygodni”, opis praktyki trenerów, bez wyzwalaczy z danych | 2026-10-08 | docs/18-archiwum-do-11.10.md, `lib/deload.ts` |
| D-115 | sugestie zmian w tygodniu z regeneracją partii; powrót do rutyny po 7–10 dniach (`RETURN_DAYS` = 10) | 2026-10-08 | docs/research/23-regeneracja-partii.md, `lib/plan.ts` |
| D-116 | „Zapisz zmiany w szablonie” na podsumowaniu zamiast okna po „Zakończ” (8A), tylko zaraz po treningu (1A) | 2026-10-11 | docs/18 |
| D-117 | „Pierwsze kroki”: 3 kroki, każdy z jednym przyciskiem (Planowanie / Przewodnik) | 2026-10-11 | docs/18 (docs/22 P4 A) |
| D-118 | masa ciała z datą do e1RM ćwiczeń z masą ciała (wariant B, 08.10.2026); sekcja w Postępach (P5 A, 11.10.2026) | 2026-10-08, 2026-10-11 | docs/18, docs/research/masa-ciala-e1rm-2026-10.md |
| D-122 | ZM-01: wynik serii wpisywany na tablicy „teraz” z ±, „Seria zrobiona” bez wartości przenosi do pola | 2026-10-21 | docs/18 (STOP 2 przebiegu M3), docs/design/to-be.md |
| D-123 | zegarek: okno „Cofnij” po odhaczeniu serii 5 s | 2026-10-14 | docs/18 (pytania z nocy), `lib/watch/protocol.ts` (`WATCH.UNDO_SEC`) |
| D-120 | domyślny wygląd nowej instalacji: ciemny | 2026-10-23 | docs/18 (naprawa-telefon-1030-a) |

Numery od D-101 nadaje ten BRD wpisom z `docs/18-przekazanie.md`, które nie mają numeru DEC-nn z audytu M1 z 19.10.2026 (żeby nie mylić ich z D-003…D-012); rejestrem decyzji pozostaje docs/18.


## Blokery wydania

- BR-DAN-001: obietnica prywatności i danych tylko w telefonie. BR-DAN-002, BR-DAN-003: utrata lub zepsucie danych użytkownika.
- BR-TRN-001, BR-TRN-006: główny przepływ zapisu treningu i ochrona treningu w toku.
- BR-PRV-001: zastrzeżenie medyczne (reguła krytyczna ze strony treści).
- NFR-PRV-001: brak wywołań sieciowych.

Rejestr ryzyk i blokad wydania: `docs/40-lekcje.md`; plan wydania: `docs/42-plan-wydania-1.0.md`.

## Otwarte pytania

| ID | Pytanie | Rozstrzyga | Dotyczy |
|---|---|---|---|
| OP-01 | [DO USTALENIA] BRD odtworzono z kodu i docs; dowód potrzeby każdej funkcji to wskazanie jej źródła w repo (decyzja, dokument), nie badanie użytkowników; badanie wartości funkcji jest poza tym dokumentem | właściciel | wszystkie BR |
| OP-02 | Zamknięte 2026-10-28 (ER-01): system miar metryczny/imperialny (D-110) jest wdrożony; BR-JEZ-003 opisuje stan po wdrożeniu | — | BR-JEZ-003 |
| OP-03 | [DO USTALENIA] Źródła S-01…S-03 i S-05…S-14 przeniesiono z zapisów badacza w `docs/research` bez ponownego odczytu; daty odczytu są z tamtych dokumentów (S-05, S-06, S-13: 2026-10-27; S-12 to cytat z drugiej ręki) | badacz | RD-01…RD-04, RD-07…RD-13 |
| OP-04 | [DO USTALENIA] Wektory RD-03 i RD-04 sprawdzają zachowanie kodu; uzasadnienie liczb 2 h i 6 h to decyzja produktowa (D-008), a nie wynik badań | właściciel | RD-03 |
| OP-05 | [DO USTALENIA] Kroki ± na tablicy dla czasu (5 s) i dystansu (50 m / 50 yd) to konwencja robocza bez źródła (`BOARD_STEPS` w `lib/board.ts`); krok ciężaru — wybór aplikacji (T-039) | badacz | RD-14, BR-TRN-009 |
| OP-06 | [DO USTALENIA] Przelicznik %1RM ↔ liczba powtórzeń: zakres 4–6 przy ≥ 80% 1RM (T-050) niesprawdzony u źródła | badacz | RD-07 |
| OP-07 | [DO USTALENIA] Cel „Siła” daje bój główny 4–6 powtórzeń każdemu, bez pytania o staż; starsze stanowisko (ACSM 2009, docs/research/zakresy-powtorzen-cele-2026-10.md, wiersz A09) podaje dla początkujących 8–12 RM, nowsze (A26) ≥ 80% 1RM bez rozróżnienia — A26 nieprzeczytane w audycie 27.10.2026 | badacz (rozstrzyga hierarchia) | RD-07, BR-GEN-001 |
| OP-09 | [DO USTALENIA] Czy pliki kopii (automatycznej i bezpieczeństwa) w folderze aplikacji, objęte kopią urządzenia w iCloud, podpadają pod wytyczną 5.1.3(ii) (OG-09); historia treningów to dane wpisane przez użytkownika, odczyt Zdrowia nie jest zapisywany | rola 10 (sklep) i 05 (architektura) | OG-09, BR-DAN-009 |
| OP-08 | [DO USTALENIA] `setsBudget` dla czasu sesji krótszego niż 10 min daje liczbę ujemną; przez interfejs niedostępne (czas tylko z listy 45, 60, 90 min) — teoretyczne, bez wektora błędnych danych w RD-09 | rola 08 (kod) | RD-09 |
