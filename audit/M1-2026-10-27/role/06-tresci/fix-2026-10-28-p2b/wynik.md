# 06-tresci · fix · pętla 2 (część b) — wynik

Data: 2026-10-28 · Rola: 06-tresci (subagent, recenzja niezależna) · Gałąź: naprawy/M2-koordynator-napraw-2026-10-28-p1 (baza 6935d54), bez push, bez workflowów.

## Commity
- **f67c438** [M1-audytor-generalny-038; 03-zakres-601]. Usunięcie zdań zrobił koordynator M2, recenzję rola 06.
- **ab54392** [M1-audytor-generalny-021; 06-tresci-003]. T-054 potwierdzone, tekst w aplikacji bez zmian.

## A — 038 (decyzja 1a 2a)
- Werdykty kart po usunięciu zdań: Pistol Squat, Deadlift (hantle), Lunges (hantle), Walking Lunges i Reverse Lunge mają werdykt **wyswietlana**. Zestaw Decline Close-Grip Bench To Skull Crusher też ma werdykt **wyswietlana**. Hack Squat zostaje **do poprawy**. Pozostałe zdania są spójne, nic błędnego nie zostało. Ponowny odczyt 28.10: NASM single-leg-squat i kettlebell-deadlift oraz ACE #6. ACE #363 dało dziś 403; strona była zatwierdzona wcześniej.
- Skróty v1 zaktualizowane (Pistol Squat, Lunges (hantle), Walking Lunges, Deadlift (hantle)). Dane figur się nie zmieniły.
- Decyzja 2a: uwaga o ExRx jest tylko w polu `uwagi` wpisu recenzji. W aplikacji nie ma nic.
- **Rzecz poza zakresem koordynatora.** Po usunięciu zdań `check:zrodla-runtime` był czerwony: zestawy ogólne wykroków brały źródła `lunge.knee` i `lunge.mis.kneeIn` z karty Lunges (hantle). W `data/zrodla/wskazowki-ogolne.json` przepiąłem je na Bulgarian Split Squat (hantle). Ta karta ma obie wskazówki z bezpośrednimi źródłami.
- **Zmieniony test.** `tests/karty-recenzja.test.tsx` przypinał skull crusher jako „do poprawy”. Zmieniłem go w tym samym commicie (CLAUDE.md: decyzja, która odwraca stan pilnowany testem). Przypadek ekranu „zestaw bez recenzji” sprawdza teraz Lateral Lunge.
- Testy przed: dowody koordynatora `dowody/M2/p2/038-1a-testy.txt`, 2 czerwone. Po: 127/127 (`dowody/jest-038-po.txt`). `check:pochodne` zielone.

## B — 021 (T-054, kąt stóp)
- Drugie źródło (szczebel 4): Squat University, „Toes Forward or Angled Out When You Squat?” (A. Horschig), https://squatuniversity.com/2016/06/16/the-great-squat-debate-toes-forward-or-angled-out. Cytat: „you should perform barbell squats with your feet turned out anywhere from 10-30 degrees”. Odczyt 2026-10-28 przez curl, cytat sprawdzony dosłownie.
- SBS ponownie, dosłownie: „toes pointed out 15-20 degrees”. Część wspólna to 15–20°, żadne przeczytane źródło nie przeczy. Rodzaj: uproszczenie. NSCA nieotwarte: adres PDF prowadzi na stronę błędu.
- Zmiany: rejestr T-054 (`--rehash`), katy w `wskazowki-ogolne.json`, docs/research/przeglad-tresci, docs/18 „5b” → `[wdrożenie: kod] [test: tests/zrodla-pelne-wskazowki-ogolne.test.ts]`. Test stanu „otwarte” zmieniony. Wzorzec nazwy w `lib/sources.ts` dodany dla strażnika anonimowości (plik używany tylko w testach). Macierz w docs/19 odświeżona.
- Testy: 41/41 (`dowody/jest-021-po.txt`), końcowo 141/141 (`dowody/jest-koncowe.txt`). check:claims, check:decyzje i check:pochodne zielone. Odczyt źródeł: `dowody/odczyt-021.txt`.

## Otwarte i uwagi
- Zestawy ogólne wykroków nadal pokazują `lunge.knee` (zgodnie z wcześniejszą recenzją zestawów; dopisek „ogólne”). Źródło to przysiad bułgarski, czyli ten sam wzorzec ruchu.
- Przegląd ścieżek wrażliwych nie dotyczy zmian (brak danych użytkownika i workflowów).
