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
| D-107 | od ekranu treningu do odhaczonej serii najwyżej 1 stuknięcie (DEC-07 K9) | 2026-10-23 | docs/18 (wpis „DEC-07 — karty P2”) |
| D-108 | publicznie bez źródeł, nawet ogólnie; ekran „Źródła” w Ustawieniach usunięty | 2026-10-25 | docs/18 (wpis „całkiem anonimowo”) |
| D-109 | oznaczenia pewności („uproszczenie”, „nasz wybór”, „jedno źródło”, „konwencja”) poza tekstami interfejsu | 2026-10-23 | docs/18 (druga decyzja z 23.10.2026) |
| D-110 | system miar metryczny albo imperialny jednym ustawieniem (DEC-28); domyślny z regionu telefonu (DEC-29) | 2026-10-20 | docs/18 |
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
| OP-03 | [DO USTALENIA] Źródła S-01…S-03 przeniesiono z zapisów badacza w `docs/research` bez ponownego odczytu; daty odczytu są z tamtych dokumentów | badacz | RD-01…RD-04 |
| OP-04 | [DO USTALENIA] Wektory RD-03 i RD-04 sprawdzają zachowanie kodu; uzasadnienie liczb 2 h i 6 h to decyzja produktowa (D-008), a nie wynik badań | właściciel | RD-03 |
