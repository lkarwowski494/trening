# Recenzja niezależna zmian testów W-02 (audytor, 11.11.2026)

- autor zmian: programista L2
- recenzent: audytor
- zakres: git diff 8e0aa08f..1eaa8fe834099fdca15be891ccafb4f675754c81 -- tests/ (12 plików)
- pytanie: czy któraś zmiana osłabia test (usunięta asercja, .skip, poluzowany próg/zapadka, oczekiwanie dopasowane do wyniku bez związku z zamierzoną zmianą, test niezdolny do porażki)
- metoda: git diff (także --word-diff), odczyt pełnych testów, danych i recenzji w02-*; bez uruchamiania Jest

## Znaleziska

| # | Plik:linia | Co osłabione | Scenariusz przepuszczenia błędu | Poziom | Pewność |
|---|---|---|---|---|---|
| — | — | brak znalezisk powyżej progu 80% | — | — | — |

W całym diffie nie ma .skip, .only, usuniętych expect ani zamiany równości na nierówność. Wszystkie zmienione oczekiwania pozostały ścisłe (toBe, toEqual na pełnej liście).

## Werdykt per plik

- tests/cel-1-1-bez-ciezkich.test.ts: sprawdzone, brak. Powrót do toContain dla Front Incline Dumbbell Raise na liście „do poprawy” odpowiada stanowi sprzed 95d280af i decyzji KO-042 (docs/18-przekazanie.md:419); docs/research/figury-recenzja.json ma werdykt „do poprawy”. pelnaKarta 522 = 520 (przed W-02) + 2 (Standing i Seated Calf Raise) — zgodne z obiema zamierzonymi zmianami. r.a i rozbicie.a = 0, spójne z kartą „do poprawy”.
- tests/figures-v2-delt-raise-w02.test.ts: sprawdzone, brak. Asercja werdyktu (≠ „wyswietlana”) zastąpiona asercją skutku w runtime: lib/cues/data.json nie ma karty w exercises, a ma ją w hidden (sprawdzone: false, true). Werdykt pilnuje cel-1-1 (toContain „do poprawy”), więc nic nie ginie. Lista języków z LANGS (lib/i18n.ts:22) zamiast listingu katalogu, asercja liczby 33 zostaje.
- tests/figures-v2-nakladka-fix4.test.tsx: sprawdzone, brak. Usunięcie Standing Calf Raise z listy odciętych potwierdza recenzja calf, sekcja „Uzupełnienie” (element calfKneeStraightRef rysowany, werdykt wyswietlana). Lista porównywana toEqual — nadal pada przy każdej różnicy.
- tests/figures-v2-slad-dzwignia.test.ts: sprawdzone, brak. Test wzmocniony: sprawdza pole punkt dźwigni z danych, ślad w punkcie poduszki i negatyw (ślad > 10 cm od miednicy i kostki). Uwaga bez zgłoszenia: oczekiwany punkt liczy ta sama funkcja produkcyjna leverBodyFrom (lib/figures/v2/gear.ts:33), tak jak wcześniej f.sk.pelvis pochodził z tego samego szkieletu; geometrię samej poduszki pilnuje wzorzec złoty.
- tests/figures-v2-zgodnosc-wsteczna.test.ts i tests/fixtures/figury-v2-zlote.json: sprawdzone, brak. Zmienione dokładnie 3 wpisy (delt_raise/Straight Raises on Incline Bench, calf_raise/Standing Calf Raise, calf_raise/Seated Calf Raise) — zgodnie z recenzjami w02-delt_raise i w02-calf_raise; komentarz opisuje zmianę celową.
- tests/figury-rozszerzenia-gora.test.ts: sprawdzone, brak. Próbka z danych zastąpiona próbką syntetyczną (głęboka kopia przez poza(), linia 22), bo realna poza ma teraz nogi proste (recenzja delt_raise). Asercje bez zmian (linia 88): bez deklaracji musi paść błąd zakresu biodra, z deklaracją — brak błędu. Test nadal może paść, gdy granica biodra albo deklaracja przestanie działać.
- tests/fixtures/pokrycie-katalogu-min.json: sprawdzone, brak. Obniżone o 1 tylko: wskazowki.wlasne 309, wlasneZBledami 197, zTekstem 566, czesteBledyTekst 439, pelnaKarta 446 — dokładnie do wartości sprzed 0ebc2378 i dokładnie do bieżących liczb z tests/fixtures/pokrycie-katalogu.json (309, 197, 309+257=566, 439, 446), każde z wpisem w obnizenia (powód KO-042, data 11.11.2026). Rekordy bez zmian. Minima języków 633 zostają (bieżące 633 po ukryciu karty).
- tests/fixtures/pokrycie-katalogu.json: sprawdzone, brak. Migawka liczona: −1 karta własna/pełna w delt_raise i ogółem, +1 bezTekstu, języki 632 → 633 bez braków — skutki ukrycia karty.
- tests/store-review-notes.test.ts: sprawdzone, brak. Lista V2_WSTRZYMANE bez obu wspięć — zgodnie z recenzją calf (oba wyswietlana); równość pełnej listy.
- tests/strona-eksport-recenzja.test.ts: sprawdzone, brak. Ta sama lista oraz nowa asercja pozytywna: oba wspięcia są w figurach strony (wzmocnienie).
- tests/strona-eksport.test.ts: sprawdzone, brak. 526 → 528 = +2 wspięcia. Dopisanie zestawu 2026-11-11-w02 do OCZEKUJE i 779 → 778 w stałej: suma oczekiwanej długości słownika en bez zmian (fidr.move przechodzi ze stałej do OCZEKUJE); dla de/ja/cs/es/zh-Hant brak musi równać się dokładnie OCZEKUJE, a zestaw w02 zawiera wyłącznie fidr.move (asercja w figures-v2-delt-raise-w02). Dopuszcza tylko brak fidr.move — zgodnie z KO-042.

## Weryfikacja listy autora

Pozycje 1–4, 7, 8, 10–12 potwierdzone w testach i danych jak wyżej. Pozycje 5, 6, 9 — zmiany poza tests/ (poza zakresem; w tests/ brak zmian dla tych testów, co potwierdza git diff --stat).

## Dopisek autora zmian (programista L2, 11.11.2026) — poza zakresem tej recenzji

Po recenzji (diff do 1eaa8fe8) pełny przebieg `verify:szybkie` pokazał, że nowa asercja pozytywna w `tests/strona-eksport-recenzja.test.ts` (wspięcia z dźwignią trafiają do figur strony) padała z powodu ustawienia testu: eksport rysuje tylko rodziny z przekazanego zapisu recenzji, a ten zawierał squat, bench_press i hinge. Poprawka: zapis recenzji testu dostaje też calf_raise z bieżącym skrótem; asercje bez zmian. Recenzent tej poprawki nie oglądał.
