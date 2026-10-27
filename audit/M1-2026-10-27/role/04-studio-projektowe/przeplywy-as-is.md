# Przepływy AS IS — Trening 1.0 (build 1031, commit 025a50b9) — rola 04, audyt M1 27.10.2026

Obraz aplikacji: eksport Expo web (react-native-web) z danymi przykładowymi projektu (`scripts/screens/seed.test.ts`), zrzuty Playwright 390 pt; sonda „Dynamic Type” w scratchpadzie (narzedzia/sonda-dynamic-type). Ograniczenia web: krój zastępczy dla SF Pro, kontrolki web, `Alert` i `ActionSheetIOS` nie działają (kroki z oknami systemowymi opisane z kodu), brak gestów natywnych. Zrzuty kroków: `zrzuty/as-is/`.

Kontekst główny (E0b): siłownia albo dom, telefon na ławce lub w dłoni między seriami, spojrzenie 2–5 s, często spocone dłonie, hałas (muzyka), jasne światło hali albo półmrok domu; sesja 45–90 min, kilkadziesiąt zapisów serii. Ręce zajęte przy sztandze, oczy wolne między seriami — przepływ nie jest „bez patrzenia” (moduł oczy-zajęte stosowany częściowo: zasada 6, ręce zajęte).

Legenda przejścia poznawczego: Q1 próbuje właściwego celu, Q2 zauważa akcję, Q3 kojarzy akcję z celem, Q4 widzi postęp. „wzorzec platformy” = krok z wzorców iOS, przejście skrócone.

## P1. Pierwsze uruchomienie → pierwszy trening (nowa osoba, raz)
| # | Ekran → działanie → wynik | Zrzut | Q1–Q4 | Tarcie |
|---|---|---|---|---|
| 1 | Intro ok. 1 s → ekran Trening: „Pusty trening”, „Inny trening”, karta „Pierwsze kroki” | as-is-p1-01-pierwsze-uruchomienie.png | tak/tak/tak/tak | — |
| 2 | „Pierwsze kroki”, krok 1 „Utwórz pierwszy szablon albo wygeneruj…” → przycisk „Planowanie” | j.w. | tak/tak/**nie**/tak | **porażka** Q3: cel „utworzyć szablon”, przycisk nazywa inne miejsce (Planowanie); kroki 1 i 2 mają ten sam przycisk (04-studio-projektowe-007, heurystyka 2) |
| 3 | Krok 3 „duży przycisk „Start” u góry” — na ekranie nie ma „Start” (jest „Pusty trening”) | j.w. | tak/**nie**/tak/tak | **porażka** Q2 (tekst wskazuje element, którego nie ma w tym stanie; heurystyka 1) |
| 4 | „Pusty trening” (1 stuknięcie) → trening w toku: „+ Dodaj ćwiczenie”, notatka, „Odrzuć trening” | as-is-p1-02-pusty-trening.png | tak/tak/tak/tak | — |
| 5 | „+ Dodaj ćwiczenie” → wybór ćwiczenia (wyszukiwanie, filtr miejsca) → ćwiczenie w treningu | (okno modalne, wzorzec platformy) | tak/tak/tak/tak | wpis nazwy (pole), 1 decyzja |
| 6 | Wpis ciężaru i powtórzeń na tablicy (± albo stuknięcie liczby) → „Seria zrobiona” → przerwa | as-is-p3-01-seria-zrobiona.png | tak/tak/tak/tak | — |

Koszt (najkrótsza ścieżka bez szablonu): 6 kroków, ok. 6–8 stuknięć, 1 pole (wyszukiwanie) + 2 liczby, 2 decyzje (sposób startu, ćwiczenie), 3 zmiany ekranu, 0 rzeczy do zapamiętania. Ślepy zaułek: brak.

## P2. Start zaplanowanego treningu (stały użytkownik, kilka razy w tygodniu)
| # | Ekran → działanie → wynik | Zrzut | Q1–Q4 | Tarcie |
|---|---|---|---|---|
| 1 | Trening: pasek tygodnia, tablica „Dziś”, przycisk „Start: {szablon}” z dopiskiem dnia | as-is-p2-01-start-plan.png | tak/tak/tak/tak | „Planowanie” stoi nad tytułem, a w zakładce Plan w linii tytułu (04-studio-projektowe-005) |
| 2 | „Start: …” (1 stuknięcie) → tablica „teraz” z pierwszą serią | as-is-p2-03-po-starcie.png | tak/tak/tak/tak | — |
| 2' | albo „Inny trening” → arkusz (Inny z planu, Powtórz ostatni, Z szablonu, Pusty) | as-is-p2-02-inny-trening.png | wzorzec platformy | — |

Koszt: 1 krok, 1 stuknięcie, 0 pól, 0–1 decyzja. Wzór najlepszych spełniony (akcja główna pełnej szerokości, 60 pt).

## P3. Zapis serii w trakcie (główna praca, kilkadziesiąt razy na sesję, ręce zajęte)
| # | Ekran → działanie → wynik | Zrzut | Q1–Q4 | Tarcie |
|---|---|---|---|---|
| 1 | Tablica „teraz”: nazwa wersalikami, „seria n z m”, ciężar × powtórzenia z podpowiedzi, ±, pola serii | as-is-p2-03-po-starcie.png | tak/tak/tak/tak | — |
| 2 | „Seria zrobiona” (1 stuknięcie, 60 pt, pełna szerokość) → tablica przewraca się na zegar przerwy (ruch respektuje „Ogranicz ruch”, `components/BoardFace.tsx:28`), „Następna: …”, −15/+15, „Pomiń” | as-is-p3-01-seria-zrobiona.png | tak/tak/tak/tak | — |
| 3 | Koniec przerwy: dźwięk (wg przełącznika) + wibracja (wg przełącznika), powiadomienie pilne, Live Activity, zegarek | (tylko telefon) | — | lekkie stuknięcie przy ✓ niewdrożone (do decyzji właściciela, docs/32 wz. 29) |

Koszt: 1 krok, 1 stuknięcie (DEC-07 K9, test `tests/dec07-k9-stukniecia.test.tsx`), 0 pól przy zgodności z planem; przy zmianie ciężaru +1–3 stuknięcia ±. Cele: ± 44 pt, główny 60 pt; w tabeli serii pod tablicą w układzie wąskim przycisk stopera i pole RPE mają 40 pt szerokości (04-studio-projektowe-004).

## P4. Zakończenie treningu
„Zakończ” (nagłówek, drugorzędny) → okno [Anuluj, Zakończ] z liczbami → ekran podsumowania z rekordami. Koszt: 2 stuknięcia, 1 decyzja. Wzorzec platformy (okno systemowe, `lib/confirm.ts`). Brak tarcia w kodzie; okna nie da się obejrzeć w web.

## P5. Przegląd postępów
Zakładka Postępy (1 stuknięcie) → wykres i rekordy wybranego ćwiczenia na górze (DEC-09), chipy ćwiczeń z danymi, strażnik progresji, masa ciała. Pusty stan: zdanie + „Zacznij trening” + wejście do pomiarów masy ciała (ZM-06). Zrzut: `zrzuty/ark-390-dark.png` (kolumny 4–5). Koszt 1 stuknięcie; brak tarcia.

## P6. Plan tygodnia (generator albo własne szablony)
Trening → „Planowanie” (nagłówek) → ekran planu → generator (tryb „Nowe szablony i plan” / „Plan z moich szablonów”, przywrócony decyzją DEC-03 c) → dni, cel, miejsce, czas → podgląd → „Zapisz szablony i plan”. Koszt: ok. 6–9 stuknięć, 4 decyzje, 0 pól tekstowych. Przejście skrócone (chipy i przełączniki — wzorce platformy). Zrzut generatora: `zrzuty/ark-390-dark.png` (kolumna 5, rząd 2).

## P7. Zakup Pro i sprawdzenie stanu subskrypcji (ustawienia, dane, zakupy)
| # | Ekran → działanie → wynik | Zrzut | Q1–Q4 | Tarcie |
|---|---|---|---|---|
| 1 | Więcej → Ustawienia → sekcja „Subskrypcja”: wiersz „Pełna wersja” z podpisem o wykorzystanych dniach | as-is-p6-01-wiecej-ustawienia.png | tak/**nie**/tak/tak | **porażka** Q2 (T-11): tytuł wiersza czyta się jak stan, nie jak akcja (04-studio-projektowe-006) |
| 2 | Ekran „Pełna wersja”: nagłówek o 5 darmowych dniach, 3 plany (roczny domyślny), „Subskrybuj” | ../ark-paywall.png (kolumna 1) | tak/tak/tak/tak | ceny w USD przy koncie PL w TestFlight — „Do sprawdzenia” |
| 3 | Zakup w arkuszu Apple → powrót: karta „Masz pełną wersję / Dostęp do {data}” na górze, pod nią dalej nagłówek o darmowych dniach, lista planów z zaznaczonym posiadanym planem i „Subskrybuj” | ../pw-po-zakupie-rocznym-390-dark.png | tak/tak/tak/**nie** | **porażka** Q4: po zakupie ekran nie mówi, który plan jest aktywny, i dalej sprzedaje ten sam plan (04-studio-projektowe-001) |

Koszt do zakupu: 4 kroki, 4–5 stuknięć (+ arkusz Apple), 1 decyzja. Wejście automatyczne przy limicie: przy starcie treningu ponad 5 dni (decyzja 22.10 A).

## P8. Usunięcie sesji (rzadko, dane użytkownika)
Plan → wiersz sesji → ekran sesji → „Usuń sesję” na dole → okno [Anuluj, Usuń] (z dopiskiem o kopii w Zdrowiu); alternatywa: przesunięcie w lewo na liście → to samo okno. Koszt 3–4 stuknięcia, 1 decyzja; zgodne z W2 i wz. 5 (`tests/swipe-delete.test.tsx` zielony, dowody/strazniki-jest.txt).

## Podsumowanie kosztów
| Przepływ | Kroki | Stuknięcia | Pola | Decyzje | Porażki |
|---|---|---|---|---|---|
| P1 pierwszy trening | 6 | 6–8 | 1 + 2 liczby | 2 | 2 (Pierwsze kroki) |
| P2 start z planu | 1 | 1 | 0 | 0–1 | 0 |
| P3 zapis serii | 1 | 1 | 0 | 0 | 0 |
| P4 zakończenie | 2 | 2 | 0 | 1 | 0 |
| P5 postępy | 1 | 1 | 0 | 0–1 | 0 |
| P6 plan tygodnia | 6–9 | 6–9 | 0 | 4 | 0 (nie sprawdzono na urządzeniu) |
| P7 zakup / stan | 4 | 4–5 | 0 | 1 | 2 (T-11) |
| P8 usunięcie sesji | 3–4 | 3–4 | 0 | 1 | 0 |
