# Propozycje TO BE — rola 04, audyt M1 27.10.2026

Opisują przepływy, nie wygląd (wygląd w trybie build, zasada wspólna 15). Koszt TO BE to szacunek do potwierdzenia po wdrożeniu. Zmiany zakresu — rola 03; zmian danych żadna propozycja nie wymaga.

## T1. P7 — stan po zakupie na ekranie „Pełna wersja” (04-studio-projektowe-001, T-11)
Nowa sekwencja (subskrybent): Ustawienia → „Pełna wersja” → karta „Twój plan: {nazwa planu}” + „Odnawia się {data}” (albo „Dostęp do {data}”, „Kod”, „Chmura rodzinna”) + „Zarządzaj subskrypcją”; nagłówek o 5 darmowych dniach i lista ofert znikają; niżej jeden przycisk „Zmień plan” rozwijający listę z oznaczeniem „Twój plan” (bez „Subskrybuj” przy posiadanym planie) i z planem dożywotnim.

| Miara | AS IS | TO BE |
|---|---|---|
| Kroki do odpowiedzi „jaki mam plan?” | 3 + odczyt dwóch sprzecznych komunikatów | 3, jedna karta |
| Decyzje na ekranie subskrybenta | 1 (wybór planu, którego nie potrzebuje) | 0 (zmiana planu na żądanie) |
| Przejście poznawcze krok 3 | porażka Q4 | tak/tak/tak/tak |

Wzorce: U11 (niewidoczny stan → widoczny status), U12 (wszystkie opcje naraz → stopniowo), U15. Zysk: subskrybent widzi, za co płaci; mniejsze ryzyko pytania do wsparcia. Ryzyko: plan roczny→miesięczny wymaga dalej ścieżki (zostaje pod „Zmień plan”). Dane: bez zmian. Wysiłek: S (ekran `app/paywall.tsx`, 35 języków: 3–4 nowe teksty).
Opcje: (a) karta „Twój plan” + „Zmień plan” (rekomendacja); (b) lista zostaje, przy posiadanym planie etykieta „Twój plan” i przycisk nieaktywny, nagłówek zależny od stanu — mniej zmian, ekran dalej długi; (c) zostawić — subskrybent widzi ofertę jak osoba bez zakupu.

## T2. P1 — „Pierwsze kroki” (04-studio-projektowe-007)
Nowa sekwencja: krok 1 „Utwórz pierwszy szablon albo wygeneruj szablony i plan” → przycisk o nazwie celu (np. „Szablony i plan”) prowadzący do tego samego miejsca; krok 2 bez zmian („Planowanie”); krok 3 tekst zależny od stanu („Pusty trening” bez szablonu, „Start” z planem); zdanie o miejscach jako wiersz z „›” (wzorzec 17).

| Miara | AS IS | TO BE |
|---|---|---|
| Porażki przejścia poznawczego | 2 (krok 1 Q3, krok 3 Q2) | 0 |
| Stuknięcia | bez zmian | bez zmian |

Wzorce: U15, heurystyki 1 i 2. Ryzyko: nowe teksty w 35 językach. Wysiłek: S. Opcje: (a) poprawić etykiety i tekst kroku 3 (rekomendacja); (b) zostawić — nowa osoba dostaje sprzeczną wskazówkę w pierwszej minucie.

## T3. P2 — „Planowanie” w linii tytułu na ekranie Trening (04-studio-projektowe-005, DEC-07 K3)
Nowa sekwencja: tytuł „Trening” + ikonka sztangi, po prawej w tej samej linii „Planowanie” (jak w zakładce Plan, `TabHeader row`). Koszt bez zmian (1 stuknięcie); ekran niższy o jedną linię, zgodność wzorca 19 c. Ryzyko: przy największym tekście tytuł i przycisk muszą się zawijać (test 320 pt + duży tekst). Wysiłek: S, test `tests/m3-p2-start.test.tsx` do zmiany (dziś pilnuje stanu sprzed decyzji). Opcje: (a) wdrożyć K3 (rekomendacja, decyzja już podjęta); (b) zostawić i zapisać zmianę decyzji K3.

## T4. Kolejność ćwiczeń bez przeciągania (04-studio-projektowe-009)
Nowa sekwencja: na ekranie Kolejność przy wierszu przyciski „w górę / w dół” widoczne w trybie bez czytnika (albo menu wiersza „Przesuń wyżej / niżej”). Koszt: przesunięcie o 1 pozycję = 1 stuknięcie zamiast przeciągnięcia. Wzorzec: HIG Gestures (gest nie jedyną drogą). Ryzyko: gęstszy wiersz. Wysiłek: S–M. Opcje: (a) przyciski strzałek przy wierszu; (b) menu wiersza; (c) zostawić (VoiceOver ma akcje). Rekomendacja: (b) — nie zagęszcza widoku.

## T5. Sprawdzenie dużego tekstu jako krok procesu (04-studio-projektowe-002)
Nie zmienia przepływu użytkownika; propozycja mechanizmu w raporcie (Decyzje dla właściciela, D3).
