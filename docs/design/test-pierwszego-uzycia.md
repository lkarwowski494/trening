# Test pierwszego użycia — przejście poznawcze 5 zadań pętli (27.10.2026)

Zadanie: M1-audytor-generalny-037 część C (03-zakres-008), decyzja właściciela DEC-07 b z 27.10.2026 („wybrane przed zgłoszeniem 1.0”, docs/18).
Dwie części: **(A) przejście poznawcze agenta przed 1.0 — ten dokument**; **(B) test z 3–5 osobami bez instrukcji po premierze — krok właściciela Z-37 w docs/48** (protokół niżej).
Strażnik: `tests/audit-m1-2026-10-27-037-pierwsze-uzycie.test.ts` (5 zadań, Q1–Q4 przy każdym kroku, porażka ze znaleziskiem, etykiety z listy niżej istnieją w słowniku — zmiana etykiety wymusza ponowne przejście).

**Metoda.** Przejście poznawcze: przy każdym kroku cztery pytania — Q1 czy osoba spróbuje osiągnąć ten wynik, Q2 czy zauważy akcję, Q3 czy skojarzy akcję z celem, Q4 czy po akcji zobaczy postęp (metoda z wzorca roli 03 i legendy roli 04, `audit/…/04-studio-projektowe/przeplywy-as-is.md`). Persona: osoba trenująca na siłowni, pierwszy raz w aplikacji, język polski, bez instrukcji.
Ocena: **tak**, **częściowo** (krok się uda, ale z tarciem), **nie** (porażka — znalezisko). To ocena agenta, nie pomiar z ludźmi; rozstrzyga ją dopiero część (B).

**Dowody.** Zrzuty wersji web (react-native-web) z gałęzi napraw partii 3 po części A tego zadania, PL, 390×844, jasny motyw; skrypt `narzedzia/przejscie.mjs.txt`, zrzuty `dowody/zrzuty/` w katalogu wyniku roli 03 (`audit/M1-2026-10-27/role/03-zakres/fix-2026-10-28/`, poza repozytorium).
Ograniczenia web: okna potwierdzeń (Alert) i arkusze systemowe (udostępnianie pliku, zakup) nie działają jak na iOS — te kroki ocenione z kodu i ze scenariuszy Maestro na symulatorze (`.maestro/31-pierwszy-tydzien.yaml`, `42-kopia-przywrocenie.yaml`, `21-subskrypcja.yaml`).

## Z1. Zapisz pierwszy trening (nowa instalacja, bez szablonów)

| # | Ekran → działanie → wynik | Zrzut | Q1/Q2/Q3/Q4 | Uwagi |
|---|---|---|---|---|
| 1 | Trening: największy przycisk na górze „Pusty trening — ćwiczenia dodasz w trakcie” → ekran treningu z zegarem i „Zakończ” | z1-zapis-treningu-01-start, -02-pusty-trening | tak/tak/tak/tak | „Pierwsze kroki” pkt 3 mówi o „Start” u góry, którego w tym stanie nie ma — porażka Q2 dla osoby czytającej listę (znane: 04-studio-projektowe-007) |
| 2 | „+ Dodaj ćwiczenie” → „Wybierz ćwiczenie” z wyszukiwarką i partiami mięśni | -03-dodaj-cwiczenie | tak/tak/tak/tak | |
| 3 | Wyszukanie po polsku „wyciskanie” → brak „Bench Press”, jedyna podpowiedź „Utwórz „wyciskanie”” (ćwiczenie własne) | z1b-szukaj-po-polsku-03-szukaj-wyciskanie | tak/tak/**nie**/tak | **porażka** Q3: nazwy z biblioteki są po angielsku (DEC-13), wyszukiwarka nie zna polskich nazw; utworzenie własnego „wyciskanie” rozdziela historię i Postępy od „Bench Press” — nowe znalezisko NZ-037-1 (wynik roli 03). Droga bez wyszukiwania (partia „klatka” → „Bench Press (sztanga)”) działa |
| 4 | Tablica „teraz”: pola kg i pow. puste → „Seria zrobiona” | -04-wybrane-cwiczenie, -05-seria-zrobiona | tak/tak/tak/częściowo | przy pustym polu stuknięcie przenosi kursor do brakującego pola (kg, potem pow.) bez słowa wyjaśnienia; na telefonie otwiera się klawiatura, więc skutek widać — do sprawdzenia w (B) |
| 5 | Wpisanie 60 kg i 5 pow. → „Seria zrobiona” → „1/1”, przerwa 1:29, „Wszystkie serie odhaczone”, „Zakończ trening” | -06-wpisany-ciezar, -08-wpisane-powtorzenia, -09-seria-odhaczona | tak/tak/tak/tak | |
| 6 | „Zakończ trening” → potwierdzenie → podsumowanie | — (okno systemowe; Maestro 31, 01) | tak/tak/tak/tak | ocena z kodu i scenariusza Maestro, nie z web |

Wynik Z1: **pozytywny z jedną porażką** (krok 3, wyszukiwanie po polsku — NZ-037-1) i znaną porażką „Pierwszych kroków” (04-studio-projektowe-007).

## Z2. Znajdź wczorajszy trening

| # | Ekran → działanie → wynik | Zrzut | Q1/Q2/Q3/Q4 | Uwagi |
|---|---|---|---|---|
| 1 | Pasek zakładek → „Plan” (ikona kalendarza) → kalendarz z zaznaczonymi dniami i lista sesji z datą, czasem, liczbą serii i objętością | z2-wczorajszy-trening-02-zakladka-plan | tak/tak/częściowo/tak | nazwa „Plan” zapowiada przyszłość, a historia jest pod kalendarzem; ikona kalendarza i lista sesji pomagają — **do sprawdzenia w (B)** (zadanie 2) |
| 2 | Stuknięcie sesji na liście → szczegóły sesji | — (Maestro 31, 05) | tak/tak/tak/tak | |

Wynik Z2: **pozytywny, Q3 niepewne** — pytanie do testu z ludźmi, bez zmiany przed 1.0 (nazwa zakładki: decyzja właściciela 11.10.2026, docs/22).

## Z3. Sprawdź postęp w wyciskaniu

| # | Ekran → działanie → wynik | Zrzut | Q1/Q2/Q3/Q4 | Uwagi |
|---|---|---|---|---|
| 1 | „Postępy” → na górze wykres i rekordy ostatniego ćwiczenia (DEC-09) | z3-postep-wyciskania-02-zakladka-postepy | tak/tak/tak/tak | |
| 2 | Zmiana ćwiczenia: chipy „Ćwiczenie” pod wykresem i rekordami | j.w. (dół ekranu) | tak/częściowo/tak/tak | wybór ćwiczenia jest dopiero pod rekordami (skutek DEC-09, wykres na górze); osoba, która widzi wykres innego ćwiczenia, musi przewinąć — **do sprawdzenia w (B)**; nazwa „Bench Press” zamiast „wyciskanie” jak w Z1 krok 3 |

Wynik Z3: **pozytywny, Q2 kroku 2 niepewne** — do testu z ludźmi.

## Z4. Zrób kopię zapasową

| # | Ekran → działanie → wynik | Zrzut | Q1/Q2/Q3/Q4 | Uwagi |
|---|---|---|---|---|
| 1 | „Więcej” → „Kopia zapasowa (eksport / import)” | z4-kopia-01-wiecej | tak/tak/tak/tak | |
| 2 | „Eksportuj backup (plik JSON)” (przycisk główny) → arkusz udostępniania iOS | z4-kopia-02-kopia; arkusz — Maestro 42 | tak/tak/częściowo/tak | słownictwo: tytuł „Kopia zapasowa”, przycisk „backup”, „plik JSON” — dwa słowa na jedną rzecz i termin techniczny; krok się uda — obserwacja NZ-037-2 (rola 04/09, P2) |

Wynik Z4: **pozytywny** (obserwacja słownictwa NZ-037-2).

## Z5. Sprawdź stan subskrypcji

| # | Ekran → działanie → wynik | Zrzut | Q1/Q2/Q3/Q4 | Uwagi |
|---|---|---|---|---|
| 1 | „Więcej” → „Ustawienia” → sekcja „Subskrypcja” na górze: wiersz „Zobacz plany Pro — Darmowe dni treningowe w tym miesiącu: wykorzystano 0 z 5” | A-przed-ustawienia-subskrypcja (przed), A-po-ustawienia-subskrypcja (po) | tak/tak/tak/tak | przed częścią A tego zadania: tytuł „Pełna wersja” czytał się jak stan — porażka Q2 (04-studio-projektowe-006, T-11) — **naprawione** (M1-037 A) |
| 2 | Wiersz → ekran zakupu: plany, „Przywróć zakupy”; z planem „Masz plan: {nazwa}” | — (Maestro 21) | tak/tak/tak/tak | |

Wynik Z5: **pozytywny po części A** (przed: negatywny).

## Wynik zbiorczy (27.10.2026)

| Zadanie | Wynik | Porażki i niepewności → gdzie |
|---|---|---|
| Z1 zapis treningu | pozytywny z porażką | NZ-037-1 (wyszukiwanie po polsku), 04-studio-projektowe-007 („Start” w „Pierwszych krokach”) |
| Z2 wczorajszy trening | pozytywny, Q3 niepewne | test (B), zadanie 2 |
| Z3 postęp w wyciskaniu | pozytywny, Q2 niepewne | test (B), zadanie 3 |
| Z4 kopia | pozytywny | NZ-037-2 (słownictwo, P2) |
| Z5 stan subskrypcji | pozytywny (po M1-037 A) | 04-studio-projektowe-006 — naprawione |

## Protokół części (B) — test z 3–5 osobami (krok właściciela Z-37, docs/48)

Kiedy: po premierze 1.0, przed punktem kontrolnym 8 tygodni (Z-35). Kto: 3–5 osób, które trenują na siłowni i nie znają aplikacji (nie testerzy TestFlight). Czas właściciela: ok. 1 h łącznie (ok. 10–15 min na osobę).
1. Nowa instalacja z App Store na telefonie osoby albo właściciela (czysty stan), język telefonu osoby.
2. Bez instrukcji i bez podpowiedzi; osoba myśli na głos; nagranie ekranu (Centrum sterowania → Nagrywanie ekranu) — nagrania zostają u właściciela, nie w repozytorium (dane osobowe).
3. Zadania (czytane z kartki, w tej kolejności): (1) zapisz trening z jednym ćwiczeniem i jedną serią; (2) znajdź trening z poprzedniego dnia — przed testem dopisz go „Dopisz trening wstecz”; (3) sprawdź, jak idzie Ci wyciskanie; (4) zrób kopię swoich danych; (5) sprawdź, ile zostało darmowych dni i jakie są plany.
4. Zapis dla każdego zadania: udało się bez pomocy / z pomocą / nie; gdzie osoba szukała najpierw; czas (orientacyjnie). Wynik do agenta (bez nazwisk) → wpis w tym dokumencie z datą, porażki jako znaleziska SP-xx dla roli 04.

Etykiety, na których stoi to przejście (klucze słownika PL; strażnik sprawdza, że istnieją — zmiana którejkolwiek oznacza ponowne przejście kroku):

```json
["Pusty trening", "ćwiczenia dodasz w trakcie", "+ Dodaj ćwiczenie", "Wybierz ćwiczenie", "Szukaj ćwiczenia…", "Utwórz „{name}”", "Seria zrobiona", "Wszystkie serie odhaczone", "Zakończ trening", "Plan", "Dopisz trening wstecz", "Postępy", "Ćwiczenie", "Więcej", "Kopia zapasowa (eksport / import)", "Eksportuj backup (plik JSON)", "Ustawienia", "Subskrypcja", "Zobacz plany Pro", "Masz plan: {name}", "Pierwsze kroki"]
```
