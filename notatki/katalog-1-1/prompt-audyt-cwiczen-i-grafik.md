# Niezależny audyt wszystkich ćwiczeń i grafik — Trening (1.0 i 1.1)

Jesteś niezależnym audytorem. Twoje zadanie: zbadać **wszystkie ćwiczenia i wszystkie grafiki ćwiczeń** aplikacji Trening ze wszystkich perspektyw wymienionych niżej, a potem napisać **jeden raport z uwagami i listą zadań**. Niczego nie poprawiasz w kodzie ani w danych. Wszystko, co twierdzisz, musi mieć dowód: plik i linię, pomiar albo przeczytane źródło z adresem.

## 0. Zanim zaczniesz (obowiązkowo)

1. Repozytorium: `lkarwowski494/trening` (publiczne). Przeczytaj `CLAUDE.md` z gałęzi `main` **i** z `integracja-1-1`. Najważniejsze sekcje: „Merytoryczne podstawy”, „Audyty i wydania”, „Treści cudze”, reguła z 27.10.2026 o dogłębnym audycie animacji i kart.
2. Przeczytaj „Mapę sesji” w `docs/przekazanie/README.md` na gałęzi `przekazanie-konta`. Ten audyt jest **tylko do odczytu**.
   - Nie wypychasz niczego na `main`, `integracja-1-1`, `naprawy/M2-*`, `audyt*`, `rodziny-*`, `poprawki-*` ani `backlog-*`.
   - Raport zapisujesz na **własnej gałęzi** `audyt/cwiczenia-grafiki-<RRRR-MM-DD>`, założonej od `main`, tylko z plikami raportu w `docs/audyt-cwiczen/`.
3. Przeczytaj model pracy nad grafikami i listę kontrolną bramki 4: `docs/przekazanie/notatki/53-grafiki-model-pracy.md` (gałąź `przekazanie-konta`). Przeczytaj też istniejące recenzje: `docs/przekazanie/notatki/recenzje-1-1/` i `docs/research/figury-recenzja.json` (main). Nie powtarzaj ich wniosków bez sprawdzenia; wykorzystaj je jako punkt wyjścia i oznacz, co potwierdzasz, a co podważasz.
4. Ograniczenia środowiska: kod nie da się zbudować natywnie na Linuksie. Grafiki oglądasz przez podglądy z generatora (`node scripts/figures/agent-pozy/run.mjs --rodzina <r> --wyjscie <katalog> --podglad`, bez `--zastosuj`; dla rodzin dynamicznych `run-dyn.mjs`) oraz przez kod rysujący. PNG oglądaj w pełnej rozdzielczości. Różnice wizualne potwierdzaj `cmp` albo pomiarem, nie podglądem zmniejszonym.

## 1. Zakres

- **1.0 (main):** wszystko, co użytkownik widzi dziś: katalog ćwiczeń, karty, wskazówki, figury v1 i rodziny v2 o statusie `ready`.
- **1.1 (integracja-1-1):** wszystkie rodziny figur v2 (`lib/figures/v2/families.ts`, pozy `lib/figures/v2/poses/*.json`, rigi), także `planned`, oraz eksport dla strony techniqueatlas (`scripts/strona/*`, decyzja 9a).
- Każde znalezisko oznacz: **widoczne w 1.0: tak/nie** oraz **wersja: 1.0 / 1.1 / obie**.

## 2. Krok 1 — inwentarz (przed oceną)

Zbuduj tabelę wszystkich ćwiczeń: ID, nazwa, rodzina figury, status rodziny, wersja figury (v1/v2/brak/wyjątek), czy ma kartę z wskazówkami, liczba języków z kompletem tekstów, czy ma wpis recenzji ruchu i treści (z datą i aktualnym skrótem), czy jest eksportowane na stronę. Policz rodziny i ćwiczenia. Zapisz `docs/audyt-cwiczen/inwentarz.md`.

**STOP 1 do właściciela:** liczby z inwentarza, plan podziału pracy na agentów i szacunek (czas agenta, przybliżone zużycie tokenów). Pokaż co najmniej dwa warianty głębokości (np. pełny na wszystkich rodzinach albo pełny na `ready` i widocznych w 1.0 plus próbka z `planned`) z rekomendacją. Czekaj na wybór.

## 3. Krok 2 — perspektywy oceny

Każde ćwiczenie i każdą rodzinę oceń w perspektywach poniżej. Pracę dziel na agentów **według rodzin** (grupy powiązanych rodzin, każdy agent ma jasno wypisany zakres plików); nie według perspektyw, chyba że perspektywa jest przekrojowa (oznaczone *).

1. **Ruch i biomechanika (bramka 4).** Cała lista kontrolna z notatki 53, kroki 1–10. Mierz ze współrzędnych SVG, a nie na oko: styki z podłogą i sprzętem, zasięg na sprzęcie, przenikanie, kąty z tabeli kątów, kierunek ruchu `u` od 0 do 1, pętla, części ciała, które znikają, rzędy błędów.
2. **Karta a rysunek.** Opis, wskazówki, mięśnie, kąty, tempo, częste błędy i nazwy faz nie mogą przeczyć figurze ani odwrotnie. Wzorzec błędu z TestFlight: „Deadlift (hantle)” — tor ciężaru przed stopami wbrew wskazówce.
3. **Podstawy merytoryczne.** Każde twierdzenie ma wpis w rejestrze (`docs/research/rejestr-twierdzen.json`, `data/zrodla/*`) i spełnia hierarchię źródeł.
   - Technika: 2 niezależne źródła szczebla 4 o **tym** ćwiczeniu. Analogia to uproszczenie i musi być oznaczona.
   - Liczby i zdrowie: wymagania z wyższych szczebli.
   - Oznaczenia: „konwencja”, „uproszczenie”, „jedno źródło”.
   - Sprawdzaj źródła u źródła, wyrywkowo co najmniej 1 na 5, przez WebFetch strony. Streszczenie wyszukiwarki nie jest źródłem. Cytat w raporcie najwyżej 1–2 zdania z adresem.
4. **Katalog i dane\*.** Duplikaty ćwiczeń (przykład: Standing Gastrocnemius ≈ Wall Calf), błędne nazwy, sprzęt, warianty, scalenia, dobór mięśni, spójność ID między katalogiem, wskazówkami, figurami i kopią danych.
5. **Lokalizacja\*.** Komplet tekstów w 35 językach, naturalność („jak trener albo kolega na siłowni”), słownik terminów, typografia, teksty tylko w PL/EN, zastępczy angielski.
6. **Dostępność\*.** VoiceOver: opis figury i jej faz. „Ogranicz ruch” bez migania. Kontrast i tryb ciemny figur. Największy rozmiar tekstu na karcie. Kolor nie może być jedynym nośnikiem informacji.
7. **Spójność interfejsu\*.** Wzorce z `docs/32-wzorce-interakcji.md`: karta ćwiczenia, sekcja „Technika”, legenda, linia kąta, przyciski.
8. **Strona techniqueatlas\*.** Eksport według decyzji 9a: tylko rodziny `ready` z aktualną recenzją. Anonimowość źródeł, brak marek. Zgodność rysunku i karty na stronie z aplikacją.
9. **Prawa i nazwy\*.** Własne grafiki i teksty, brak skopiowanych zdań, brak nazw innych aplikacji i marek (wytyczne Apple 2.3.7 i 5.2.1).
10. **Bezpieczeństwo i zdrowie.** Brak porad medycznych. Odesłanie do specjalisty przy bólu. Ćwiczenia ryzykowne (nad głową, olimpijskie, plyometria) mają ostrzeżenia zgodne z decyzjami w `docs/18`.
11. **Technika i jakość kodu figur\*.**
    - Generator odtwarza zatwierdzone pliki póz (znany rozjazd na integracji).
    - Złote odciski, pokrycie testami i reguły jakości działają we wszystkich rodzinach.
    - Wydajność animacji, rozmiar plików (limit z `tests/architecture-limits.test.ts`).
    - Strażniki, które mogą przepuszczać błędy, na przykład gdy liczą minimum zamiast profilu.
12. **Użytkownik początkujący.** Czy osoba na siłowni zrozumie z karty i rysunku, jak wykonać ćwiczenie. Co jest niejasne, a co sprzeczne między ćwiczeniami tej samej rodziny.
13. **Ryzyko przeglądu Apple\*.** Treści zdrowotne, twierdzenia, metadane.

## 4. Krok 3 — weryfikacja znalezisk

Każde znalezisko ŚREDNIE lub wyższe sprawdza **drugi, niezależny agent**, który nie zna uzasadnienia pierwszego. Próbuje je obalić: pomiarem, kodem, źródłem. Do raportu trafiają tylko znaleziska potwierdzone. Obalone wypisz w aneksie jednym zdaniem.

Dla każdego znaleziska podaj:
- **ID:** `ACG-NNN`.
- **Ćwiczenie i rodzina.**
- **Perspektywa.**
- **Waga:** KRYTYCZNE, WYSOKIE, ŚREDNIE albo NISKIE, według progu z CLAUDE.md, „Audyty i wydania” pkt 1.
- **Pewność** w %.
- **Realność:** realny, brzegowy albo teoretyczny, z krokami w aplikacji, które do niego prowadzą.
- **Widoczne w 1.0** i **wersja.**
- **Dowód.**

## 5. Krok 4 — raport (`docs/audyt-cwiczen/raport.md`)

1. **Podsumowanie dla właściciela** (najwyżej 15 linii, zwykłym językiem). Czy coś blokuje 1.0. Ile rodzin 1.1 jest gotowych do pokazania. Trzy największe ryzyka.
2. **Tabela rodzin:** status, werdykt ruchu, werdykt treści, liczba znalezisk według wagi, czy może być `ready` lub eksportowana.
3. **Znaleziska według perspektyw** (pełne opisy).
4. **Luki procesu.** Gdzie lista kontrolna, reguły albo strażniki przepuściły błąd. Dla każdej luki podaj mechanizm, który ją zamknie: test, reguła, krok listy. Postanowienie „uważać” nie jest mechanizmem.
5. **Zadania** (`docs/audyt-cwiczen/zadania.md`). Każde zadanie zawiera:
   - **ID** `ACG-T-NNN` i powiązane znaleziska.
   - **Właściciel według Mapy sesji:** 1.0/main to sesja napraw M2, 1.1 to koordynator przeglądów, merytoryka to badacz.
   - **Pliki.**
   - **Kryterium ukończenia:** test czerwony przed zmianą i zielony po, plus recenzja.
   - **Szacunek czasu agenta.**
   - **Zależności.**
   - **Kolejność.**

   Zadania pogrupuj tak, żeby dało się je zlecić agentom równolegle bez wspólnych plików.
6. **Decyzje dla właściciela** (tylko produktowe: zakres, wygląd, koszty, kolejność). Każda decyzja ma co najmniej 2 opcje z kompromisami i rekomendację. Kwestii merytorycznych właściciel nie rozstrzyga — rozstrzyga je hierarchia źródeł.
7. **Otwarte pytania** (czego nie dało się potwierdzić).

Sprawdź raport przed oddaniem:
- Każde znalezisko ma dowód.
- Zgadzają się liczby między inwentarzem, tabelą i znaleziskami.
- Żaden cytat nie ma więcej niż 2 zdania.
- W repo nie ma cudzych treści, sekretów ani danych osobowych.

Zrób commit i wypchnij **wyłącznie** na `audyt/cwiczenia-grafiki-<data>`. Na koniec wyślij skrót (podsumowanie i liczby) do sesji koordynatora przeglądów (`session_01T66VBvPuyAg4fmtCyWDTgh`) i sesji napraw M2 (`session_01T66VBxrAq3PEG32R4ofJh9`) przez `send_message`. Właścicielowi podaj podsumowanie i link do raportu.

## 6. Zasady pracy

- Odpowiedzi do właściciela po polsku, krótko. STOP tylko w punktach wskazanych wyżej albo przy decyzji produktowej.
- Nie zgaduj liczb. Czego nie da się potwierdzić, trafia do otwartych pytań.
- Pełne `npm run verify` nie jest potrzebne (nic nie zmieniasz). Jeśli uruchamiasz testy, rób to pojedynczo i przez blokadę, gdy maszyna jest współdzielona.
- Prywatność: prompt i pliki z prywatnej biblioteki `prompts` nie trafiają do publicznego repo.
