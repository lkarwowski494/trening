# Plan prac do 1.1 (koordynator, 27.10.2026 ~06:10 UTC)

Legenda: **TERAZ** = można zacząć bez ryzyka przeróbki (to, od czego zależy, już się nie zmieni) · **PO X** = czeka na X · czasy = praca agenta (szacunek), osobno czekanie i czas właściciela.

## Ścieżka 1 — 1.0 do App Store
| ID | Zadanie | Zależy od | Start | Agent | Stan |
|---|---|---|---|---|---|
| A1 | Lista z telefonu T-01–T-14 + zakupy sandbox; zamknięcie R-004, R-014 | build w TestFlight | TERAZ (właściciel) | — | czeka na właściciela (45–75 min) |
| A2 | Z-02 przegląd treści po przekładzie (R-010) | teksty 1.0 zamrożone | TERAZ | 1–2 h | w toku |
| A3 | Notatki App Review 1.0 (ścieżki z kodu main), PR | main 1.0 | TERAZ | 1,5 h | w toku |
| A4 | Zrzuty (store-screenshots, watch-sim), przegląd obrazów, dry-run asc-zrzuty | main 1.0 | TERAZ | 3–4 h + ~2 h CI | w toku |
| A5 | asc-kontrola (odczyt) | — | TERAZ | 0,2 h | w toku |
| A6 | Akceptacja podpisów EN i opisu PL/EN, metadane `zapis`, zrzuty `apply` za release | A4 | PO A4 | — | właściciel ~20 min |
| A7 | Kroki ASC Z-11–Z-29 (+ znaki towarowe) | A1, A6 | PO A1 | — | właściciel 1–1,5 h |
| A8 | Naprawy, jeśli A1 znajdzie wadę (nowy build) | A1 | PO A1 | ? | — |
| A9 | 1.0.1: main → wersja-1-0-1 | main 1.0 | TERAZ (tani merge, powtórzy się, jeśli A8 zmieni main) | 1 h | w toku |

## Ścieżka 2 — grafiki 1.1 (wariant A: recenzja każdej rodziny = bramka)
| ID | Zadanie | Zależy od | Start | Agent | Stan |
|---|---|---|---|---|---|
| G1 | Poprawki n6 (Cocoons, Decline) + R17 + podglądy n7 | — | TERAZ | 2 h | w toku (jakosc-r2) |
| G1r | Recenzja n7 (niezależna) | G1 | PO G1 | 0,5 h | — |
| G2 | Recenzje rodzin z pozami: partia 1 góra (8), 2 dół (9), 3 wyciągi/maszyny + rigi squat/bench/hinge (7), 4 dynamiczne (9), reszta: shrug, forearm, rotator_cuff | pozy rodziny bez zmian | TERAZ (pozy w danych stoją) | ~1–2 h/partia | partie 1–4 w toku |
| G3 | Poprawki po recenzji — per rodzina, potem ponowna recenzja tylko zmienionych | G2 danej rodziny | PO G2 rodziny | 0,5–1 h/rodzina | — |
| G4a | Nowe rodziny: mobility_stand, mobility_floor, foam_roll, neck (rigi + pozy) | — | TERAZ | 10–15 h | w toku (rodziny-mobilnosc) |
| G4b | Luki w istniejących rodzinach (~120 ćw.: core_floor 21/44, pushup_plank 17/30, sled_throw 8/19, strongman 1/10, …) | G2 tej rodziny (błąd systemowy rigu poprawiamy przed dokładaniem) | PO G2 rodziny | 10–20 h | — |
| G5 | Wyjątki bez animacji (cardio, bez istoty ruchu) w teście pokrycia | lista z G4 | PO G4 | 1 h | — |
| G6 | Scalenia do integracja-1-1 (jakosc-r2, rodziny-mobilnosc, poprawki G3/G4b) + regeneracja docs/51, macierzy, README, odcisków | G3/G4 | PO | 2–3 h na rundę | — |
| G7a | Kontekst ekranu w przekładzie API + konteksty dla 145 kluczy (L-041 wariant B) | — | TERAZ | 3–4 h | w toku (przeklad-kontekst) |
| G7b | Przekład nowych tekstów 1.1 przez API (≤ 6 USD) + recenzent lokalizacji; potem JEDEN plik pytań pt-BR dla native speakera (decyzja 27.10; inne języki bez native speakera — otwarte, nie blokują) | G7a, teksty G4/G3 zamrożone | PO | 2–3 h + ~1–2 USD | — |
| G8 | Definicja ukończenia: BRD, rejestr twierdzeń, macierz, Maestro 57 na próbce rodzin, budżet klatek, VoiceOver/„Ogranicz ruch” | G6 | PO G6 (częściowo TERAZ dla gotowych rodzin) | 3–5 h | — |

## Ścieżka 3 — techniqueatlas
| ID | Zadanie | Zależy od | Start | Stan |
|---|---|---|---|---|
| S1 | PIN na integracja-1-1 (role mięśni), CI strony, PR | eksport `roles` | TERAZ | w toku |
| S2 | PIN na SHA wydania 1.1, noindex off, domena (właściciel), check-urls | wydanie 1.1 | PO 1.1 | — |

## Wydanie 1.1
W1 audyt zmian od 1.0 (2–4 h) → W2 naprawy blokerów → W3 wersja 1.1.0 + pełny E2E (~1,5 h) → W4 TestFlight (~1,5 h) → W5 telefon (właściciel ~20 min) → W6 App Store (po 1.0 wydanym). Zamrożenie zakresu od W1.

## Razem (szacunek)
Agent ~50–70 h (przy 7–10 agentach równolegle ~2–3 dni zegarowo). Czekanie: CI/E2E/kolejka macOS, recenzja Apple ×2. Właściciel ~3–4 h (głównie 1.0).
