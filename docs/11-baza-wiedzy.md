# Baza wiedzy funkcji — Trening vs 10 aplikacji (wnioski)

Stan: 02.10.2026. Dane: `docs/research/kb/<aplikacja>.json` (jedno źródło prawdy; format `SCHEMA.md`), z nich generowane `matrix.csv` i strona „Baza wiedzy” (`python3 scripts/kb/build.py`). Nasza kolumna powstała **z kodu**, nie z dokumentacji (lekcja 2).
Strona z całą bazą (opis działania i źródła w każdej komórce): artefakt „Baza wiedzy funkcji”, https://claude.ai/artifact/2R1cP4dA3zmvZC9wLHj5mF (prywatny). Opisy działania w bazie są po angielsku (tak je zebrali badacze).
Aplikacje: Strong, Hevy, Fitbod, Alpha Progression, Liftosaur, StrengthLog, JEFIT, Boostcamp, SmartGym, Caliber. 83 funkcje ze wspólnej listy + funkcje spoza listy znalezione u poszczególnych aplikacji (razem 187 wierszy).

**Jak czytać:** ✓ jest · $ płatne · ◐ częściowo · ✗ brak · ? nie udało się ustalić · puste = nie sprawdzano. Funkcje „spoza listy” były sprawdzane tylko w aplikacji, w której je znaleziono — puste pole tam **nie znaczy „brak”**. Dlatego nie wyciągam z nich wniosków „tylko my to mamy”, poza miejscami, gdzie badacze opisali to wprost w funkcji z listy.

Źródła: każda komórka ma linki (help center, strona producenta, App Store, recenzje). Reddit był niedostępny — skargi pochodzą z forów producentów, tablic zgłoszeń i recenzji w App Store.

## 1. Czego nam brakuje, a ma co najmniej połowa innych (liczba = ile z 10 aplikacji ma; ◐ = 0,5)

| Funkcja | Inni | U nas | Uwagi do naszego kontekstu |
|---|---|---|---|
| Zamiana ćwiczenia w trakcie treningu | 10 | ✗ (tylko usuń + dodaj na końcu) | łączy się z P-003 (etap E2); wzorzec Hevy/Boostcamp: „tylko dziś / na stałe” |
| Edycja zakończonego treningu, dodanie treningu wstecz | 9 | ✗ (tylko podgląd i usunięcie) | ważne przy prawdziwym używaniu (zapomniany trening, literówka po zapisie) |
| Podsumowanie po treningu | 9,5 | ◐ (szczegóły sesji + okno rekordów) | Liftosaur/Alpha: czas, objętość, serie na partię, rekordy, porównanie z poprzednim |
| Kalendarz / serie dni | 8,5 | ✗ | widok miesiąca w Historii; serie tygodni zamiast dni (mniej presji) |
| Filmy/animacje ćwiczeń | 8,5 | ✗ | kosztowne (licencje/produkcja); alternatywa: link do zewnętrznego wideo |
| Filtr sprzętu w bibliotece | 8,5 | ✗ | P-003 |
| Kalkulator talerzy | 8 | ✗ | P-003 etap E3 (talerze z miejsca) |
| Obwody ciała | 8 | ✗ | moduł Ciało (H2); waga już jest w porannym wpisie |
| Mapa mięśni | 8 | ✗ | mamy dane (mięśnie główne/pomocnicze, serie na partię) — brak tylko obrazka |
| Kalkulator rozgrzewki | 7,5 | ✗ | P-003 E3 |
| Aplikacja na zegarek | 7 | ✗ | duży koszt; u innych najczęstsze źródło skarg (synchronizacja) |
| Dostępne ciężary / ćwiczenia wg sprzętu / miejsca | 7 / 7 / 5 | ◐ / ✗ / ✗ | P-003 |
| Widżety na ekran główny | 6 | ✗ | tani dodatek (mamy już rozszerzenie widżetu dla Live Activity) |
| Udostępnianie treningu/szablonu, feed | 10 / 10 / 5 | ✗ | wymaga serwera — poza H1 (ADR-025) |
| Synchronizacja/konto | 10 | ◐ (kopie JSON w Plikach) | świadomie: bez konta (H1); E-H2-1/2 |
| Apple Health | 10 | ◐ (tylko zapis treningu) | odczyt masy ciała / snu mógłby zasilić poranny wpis |
| Programy wielotygodniowe, periodyzacja, generator, AI | 8,5 / 6,5 / 7,5 / 5 | ✗ | świadomie poza zakresem loggera (A-002, ADR-017); u nas rolę planu pełni trener (E-TR) |

## 2. Co robimy dobrze albo inaczej (na podstawie funkcji z listy)

- **Działanie offline bez konta**: pełne. U innych 4× ✓, 6× częściowo; większość wymaga konta (Strong, Hevy, Fitbod, StrengthLog, JEFIT, Boostcamp, Caliber).
- **Porzucony trening**: pytanie po 2 h, cichy zapis po 6 h, koniec = ostatnia seria. Pełne rozwiązanie mają tylko Fitbod (auto-zapis po 3 h pauzy) i Liftosaur (przypomnienie). JEFIT potrafi zapisać „trening” trwający 70 h — skargi.
- **Gotowość (poranny wpis BB/sen)**: nikt nie ma porannego wpisu. Liftosaur czyta sen z Health, StrengthLog ma ocenę snu po treningu.
- **Dostępność (VoiceOver, duża czcionka)**: mamy etykiety VoiceOver na wszystkich przyciskach i polach serii. U innych niewiele wiadomo: większość nie deklaruje dostępności w App Store, a Liftosaur ma własny suwak rozmiaru tekstu 12–24, co jest lepsze niż nasz limit powiększenia (1,3–1,4×) w gęstych miejscach. Przewaga prawdopodobna, ale nie udowodniona.
- **Podpowiedź progresji**: cicha, wyłączalna, nigdy nie zmienia wpisów. Strong i Caliber nie mają żadnej. Reguły progresji za darmo mają Liftosaur i StrengthLog; Fitbod, Alpha, JEFIT i Hevy mają je w płatnej wersji albo w generatorze; Boostcamp i SmartGym częściowo.
- **Live Activity**: mamy. Strong dodał w 08.2026, Caliber nie ma; u Liftosaur płatne.

## 3. Pomysły warte przejęcia (spoza listy)

- **Pytanie po treningu z szablonu**: „zaktualizować szablon / tylko ciężary / zostaw” (Strong, Alpha, Caliber, Hevy; SmartGym: zmiana ćwiczenia we wszystkich szablonach). Mała zmiana, duża wygoda.
- **„Ostatnio” pod polem serii + przycisk „jak ostatnio”** (Caliber). Mamy kolumnę „Poprzednio”.
- **Wybór źródła „Poprzednio”**: dowolny trening vs ten sam szablon (Hevy, Alpha). Ważne przy miejscach: dom vs siłownia.
- **Notatka przypięta do ćwiczenia, pokazywana w każdym treningu** (Strong, Alpha). U nas notatka ćwiczenia nie jest widoczna w treningu.
- **Wykluczenie treningu z rekordów/statystyk** (Strong „Start history from”, Caliber, SmartGym), np. trening z kontuzją.
- **Połączenie historii dwóch ćwiczeń** (Strong „Transfer Exercise Data”). Przyda się przy duplikatach z katalogu (P-003, decyzja 5).
- **Raporty okresowe** (tydzień/miesiąc/rok) — 4 aplikacje.
- **Łącznik dla ChatGPT/Claude (MCP)** — Caliber, Liftosaur, Hevy. Ciekawe dla trenera i dla A-006 (ADR-017).
- **Działanie z ekranu blokady** (SmartGym, Liftosaur, Hevy: odhaczenie serii z Live Activity).

## 4. Lekcje ze skarg użytkowników

1. Zegarek to główne źródło skarg wszędzie: synchronizacja, duplikaty, bateria. Jeśli robić, to niezależny (jak SmartGym) albo wcale.
2. Przeprojektowania psują nawyki (StrengthLog 9.0, Liftosaur 2026, Boostcamp): fale ocen 1–2★. Zmiany UI wprowadzać stopniowo.
3. Paywall na podstawach (statystyki, superserie, zamiana ćwiczeń — Caliber, SmartGym, Fitbod bez darmowej wersji) zbiera skargi; płatne dodatki (zegarek, raporty) mniej.
4. Wymuszona społeczność (feed Hevy, którego nie da się wyłączyć) to skarga. U nas moduły ukrywalne — zgodne.
5. Regenerowanie treningu kasuje edycje (Fitbod). Logger nie może niczego zmieniać za plecami (A-002).
6. Brak eksportu i importu: Strong nie importuje nawet własnego CSV, Boostcamp nie ma eksportu. Import CSV ze Strong ma Hevy (i częściowo inni) — mamy to w backlogu jako T-031.

## 5. Propozycja kolejności (do decyzji)

1. P-001, P-002 (zgłoszenia z telefonu) i dalsze uwagi z weekendu.
2. **Edycja zakończonego treningu + dodanie wstecz** (9/10 aplikacji ma; ryzyko utraty danych bez tego).
3. **P-003 E1** (miejsca, sprzęt, ciężary, filtr, podpowiedź z dostępnych ciężarów) → **E2 zamiana ćwiczenia** (10/10) → E3 kalkulatory.
4. Drobne o dużej wartości: pytanie „zaktualizować szablon?”, podsumowanie po treningu, kalendarz w Historii, notatka przypięta do ćwiczenia, widżet.
5. Później: obwody i zdjęcia (moduł Ciało), mapa mięśni, odczyt z Apple Health, import Strong/Hevy (T-031), raporty.
6. Świadomie nie teraz: social, sync/konto, programy/AI/generator, zegarek.

## 6. Weryfikacja
Niezależny przegląd 02.10.2026: wszystkie liczby z tabeli w pkt 1 zgadzają się z danymi; nasza kolumna zgodna z kodem w 12 sprawdzonych funkcjach. Poprawione po przeglądzie: opis podpowiedzi progresji (Liftosaur, StrengthLog), dostępność, JEFIT wśród aplikacji z kontem, SmartGym/Hevy w pomysłach, nagłówek pkt 1.
