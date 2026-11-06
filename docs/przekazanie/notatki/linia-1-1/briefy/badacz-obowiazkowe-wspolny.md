# Fala „obowiązkowe 1.1” — wspólny brief badaczy (koordynator 1.1, 02.11.2026)

## Cel
Właściciel 02.11.2026 (docs/18): 58 ćwiczeń jest obowiązkowych w wersji 1.1 na poziomie „Pełna karta” = wskazówki (ustawienie + przebieg ruchu) + role mięśni + rysunek v2.
Lista: `/home/user/wt-obow/docs/research/pokrycie-1-1-obowiazkowe.json`. Twoja część — w briefie indywidualnym.
Te ćwiczenia to LUKI po falach W1 i W2: zwykłe szukanie dwóch źródeł szczebla 4 już tam zawiodło. Nie powtarzaj tego samego szukania — użyj dróg, które dopuściły nowe decyzje (niżej).

## Zasady (przeczytaj u źródła, nie z tego streszczenia)
- `/home/user/wt-obow/CLAUDE.md` — sekcja „Merytoryczne podstawy” (hierarchia, wyjątek dla wskazówek techniki, w tym reguła z 02.11.2026 o jednym źródle szczebla 3 i wariancie sprzętu).
- `/home/user/wt-obow/docs/18-przekazanie.md` linie 134–150 (minimalna karta = ustawienie + ruch; szczeble organizacji, uzupełnienia 2 i 3; karty częściowe; wyciągi z książek; błędy wnioskowane „Czego unikać”).
- Szczeble serwisów: `.../kontekst-obow/lokalne-0211/docs/research/szczeble-organizacji-2026-11-02.md`.

## Drogi do karty (w kolejności preferencji)
1. Dwa niezależne źródła szczebla ≤ 4 (różne organizacje), każde przeczytane — WebFetch strony, cytat ≤ 2 zdań albo dokładne miejsce.
2. Jedno przeczytane źródło szczebla 3 (książka uznanego autora, recenzowany artykuł z opisem techniki), żadne przeczytane nie przeczy → oznaczenie „jedno źródło”.
3. Wariant sprzętu tego samego ruchu (hantle/sztanga/linka/guma, skos ławki tylko gdy ruch w stawach ten sam) → źródła wersji bazowej jako „uproszczenie”; napisz wprost, czym ruch się różni albo że nie różni — potwierdzi to recenzent niezależny (nie Ty).
4. Zdanie warunkowe (źródło „warunkowo 4” per strona: NFPT, BarBend, Fitness Volt, Healthline z recenzentem…) — sprawdź warunek na konkretnej stronie (autor z kwalifikacjami, data, strona opisu ćwiczenia) i zapisz wynik; nie rozstrzygaj sam, gdy warunek niejasny — wpisz do pytań dla koordynatora.
Częste błędy: dwa źródła albo błąd wnioskowany (zaprzeczenie potwierdzonego zdania ustawienia/ruchu, oznacz `["wniosek", "<id>"]`); błąd nie jest wymagany do karty.
Niedozwolone: free-exercise-db, Physitrack, Onnit, dokumentacja innych aplikacji treningowych (szczebel 5 / wykluczone), streszczenie wyszukiwarki jako źródło.

## Najpierw przeczytaj, co już jest
Kopie plików fal W1 i W2 (tylko do odczytu): (kopie ze scratchpadu dawnej sesji — nieaktualne; czytaj pliki wprost z gałęzi `origin/<gałąź>` przez `git show`) `<gałąź>/docs/research/...`
(`wskazowki-fala-w1/`, `wskazowki-fala-w2/`, `role-miesni-fala-w*/`, `STAN-*.md`). Dla każdego ćwiczenia: co W1/W2 znalazły, które zdania istnieją (id), dlaczego zostało otwarte.
Istniejące zdania i karty w aplikacji: `/home/user/wt-obow/lib/cues/data.json`, teksty `lib/cues/text/pl.json` i `en.json`, źródła `data/zrodla/cues.json`. Reużywaj istniejących id zdań, gdy sens ten sam.

## Wynik
- Plik w `/home/user/wt-obow/docs/research/wskazowki-obowiazkowe-1-1/<twoja-grupa>.md` w formacie plików fali W2 (wzór: `.../kontekst-obow/w2-ramiona/docs/research/wskazowki-fala-w2/triceps.md`):
  (1) tabela ćwiczeń ze stanem (karta / częściowa / otwarta + powód, droga 1–4), (2) „Blok do wdrożenia” (JSON, `_tryb: dopisz` jak W2), (3) nowe zdania PL + EN (zwykłym językiem trenera, nie profesora; bez nazw źródeł w tekście), (4) źródła z adresem, szczeblem, datą odczytu i miejscem, (5) pytania dla koordynatora.
- Status pliku: PROPOZYCJA. Nie zmieniaj nic w `lib/`, `data/`, testach ani innych plikach — tylko swój plik (i ewentualnie plik ról, jeśli brief indywidualny go wymienia).
- Repozytorium jest publiczne: cytat ze strony najwyżej 1–2 zdania; bez danych osobowych; nazw innych aplikacji nie wpisuj.
- Bez git, bez npm. Koordynator zatwierdzi pliki sam.

## Limit kontekstu
Pilnuj ok. 30–35% okna. Powyżej ok. 30% domknij bieżące ćwiczenie, zapisz plik wyniku (stan częściowy jest OK) i dopisz na końcu sekcję „Stan agenta” (zrobione, zostało, następny krok, pułapki). W raporcie końcowym podaj: liczba kart / częściowych / otwartych, drogi 1–4 ile razy, pytania dla koordynatora, ścieżkę pliku.
