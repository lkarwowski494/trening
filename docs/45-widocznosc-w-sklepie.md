# 45. Widoczność w sklepie (M5) — metadane App Store

Przebieg roli M5 (widoczność w sklepie), gałąź `widocznosc/trening-2026-10-21`, od 21.10.2026. Zakres (ustalony z właścicielem 21.10.2026):
tylko metadane sklepu — nazwa, podtytuł, słowa kluczowe, kategoria, tekst promocyjny, opis — w lokalizacjach App Store; bez zmian w kodzie
i w zakresie funkcji 1.0. Podpisy i kompozycja zrzutów — po scaleniu redesignu M3. Wysyłka do App Store Connect i scalenie do `main` — tylko
za zgodą właściciela. Dokument zastępuje ścieżkę `docs/wydanie/widocznosc.md` z promptu roli (wyjątek nazwany: projekt trzyma dokumenty
numerowane w `docs/`, nowy podkatalog wymagałby zmiany generatora README).

## Stan (21.10.2026)

- E0–E3 zakończone: frazy w 7 grupach języków, krytyka, przegląd tłumacza, decyzje STOP 2; pola zapisane w `store/app-store-names.json` (nazwy)
  i `store/app-store-metadata.json` (podtytuł, słowa kluczowe) — jedno źródło, test `tests/store-metadata.test.ts`. Kategoria dodatkowa: brak.
  Zrzuty, tekst promocyjny i opis — po M3. Nic nie wysłano do App Store Connect.
- Surowe dane badania (wyniki wyszukiwania, recenzje, nazwy innych aplikacji) leżą poza repozytorium (katalog przebiegu), docelowo na Dysku
  właściciela („05 Research konkurencji”); tutaj tylko wnioski bez nazw innych aplikacji (wytyczne Apple 2.3.7, CLAUDE.md).

## Pokrycie storefrontów — przed zmianami

Źródło: App Store Connect Help, „App Store localizations” (developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations),
odczyt 21.10.2026; policzone skryptem `storefronty.mjs` (moduł roli 10) dla 31 lokalizacji z `store/app-store-names.json`.

- 175 storefrontów: lokalizacja strony w języku domyślnym — 171; tylko w języku dodatkowym — 3 (Australia i Nowa Zelandia: domyślny English (Australia);
  Chiny: Simplified Chinese); brak — 1 (Kanada: English (Canada), dodatkowy French (Canada)).
- English (U.K.) jest językiem domyślnym m.in. w Polsce, Czechach, Słowacji i na Ukrainie; język lokalny jest tam tylko dodatkowy. Lokalizacja en-GB
  jest więc stroną domyślną w większości krajów, a en-US jej nie zastępuje.
- Języki aplikacji bez lokalizacji w App Store: bg, et, lt, lv, sr — użytkownicy widzą stronę w języku domyślnym storefrontu (zwykle en-GB).
- **[DO USTALENIA]** czy słowa kluczowe języka dodatkowego (np. Polish w Polsce) liczą się w wyszukiwaniu danego storefrontu — Apple tego nie opisuje;
  rozstrzygnie pomiar (wyświetlenia z wyszukiwania w storefroncie przed i po zmianie).

## Plan przebiegu (STOP 1)

| Grupa | Lokalizacje App Store |
|---|---|
| G1 | pl, en-US, en-GB (+ en-AU, en-CA jako kopie) |
| G2 | cs, sk, hr, sl |
| G3 | hu, ro, uk, ru |
| G4 | de-DE, nl-NL, sv, da, no, fi |
| G5 | es-ES, es-MX, pt-PT, pt-BR, fr-FR, it |
| G6 | tr, el, id, ms, vi |
| G7 | ja, ko, zh-Hant |

- Frazy z badania każdego języka (wyniki wyszukiwania App Store w kraju, recenzje), nie z przekładu; potem krytyk ze świeżym kontekstem.
- Szacunek: ok. 1,2–2,5 mln tokenów, 0 zł (bez płatnych narzędzi i API). Czas właściciela: STOP 2 ok. 20–30 min, podpowiedzi wyszukiwarki ok. 15 min.

## Decyzje

- 21.10.2026 (właściciel, STOP 1 M5, przekazane przez koordynatora): zakres — **wszystkie 31 lokalizacji** („Wszystkie 31 lokalizacji (Recommended)”).
  Odrzucone: tylko PL/EN + Europa Środkowa; PL/EN + mniejsze rynki.
- 21.10.2026 (właściciel, STOP 1 M5, przekazane przez koordynatora): **nowe lokalizacje strony English (Australia) i English (Canada)** jako kopie
  en-GB / en-US („Dodać (Recommended)”) — 3 storefronty więcej z językiem domyślnym. Odrzucone: bez nowych lokalizacji; French (Canada) i Simplified
  Chinese (wymagałyby tłumaczenia, aplikacja nie ma zh-Hans).
- 21.10.2026 (właściciel, STOP 1 M5, przekazane przez koordynatora): **podpowiedzi wyszukiwarki z telefonu — tak** („Tak, ok. 15 min (Recommended)”):
  lista ok. 10 fraz PL/EN z instrukcją po STOP 2. Odrzucone: ocena ruchu tylko liczbą wyników.

- 21.10.2026 (właściciel, STOP 2 M5, przekazane przez koordynatora): **nazwa PL „Trening: dziennik treningowy”** („Trening: dziennik treningowy (Recommended)”).
  Odrzucone: bez zmian „Trening: dziennik siłowni” (fraza bez podpowiedzi wyszukiwarki, zawęża do siłowni).
- 21.10.2026 (właściciel, STOP 2 M5, przekazane przez koordynatora): **podtytuły PL „Serie i przerwy. Bez konta”, EN „Workout tracker. No account.”** —
  zastępują D-4 z 14.10.2026 (docs/41). Odrzucone: D-4 bez zmian; D-4 z poprawką EN „Clean workout log. No account.” (oba D-4 powtarzały słowo z nazwy).
- 21.10.2026 (właściciel, STOP 2 M5, przekazane przez koordynatora): **zmiana części nazwy po dwukropku w ro, nl-NL, da, no, es-MX, it, el, ms** — po przeglądzie
  tłumacza (da: „styrkedagbog” zamiast „dagbog til gym”; hr „dnevnik za teretanu” dopisane z przeglądu tłumacza — koordynator 21.10). Odrzucone: tylko el, ms, es-MX; bez zmian nazw.
- 21.10.2026 (właściciel, STOP 2 M5, przekazane przez koordynatora): **podtytuły i słowa kluczowe we wszystkich lokalizacjach wg rekomendacji**, pola
  niepewne po przeglądzie tłumacza. Odrzucone: tylko PL/EN przed 1.0.
- 21.10.2026 (właściciel, STOP końcowy M5, przekazane przez koordynatora): **kategoria dodatkowa — brak** („Brak (Recommended)”); główna Health & Fitness
  bez zmian. Odrzucone: Sports (pojedyncze wyniki, ryzyko nietrafnej kategorii). Rosja — poza zakresem 1.0 (koordynator).
- 21.10.2026 (właściciel, STOP końcowy M5, przekazane przez koordynatora): **nazwa hr „Trening: dnevnik za teretanu”** („Tak (Recommended)”). Odrzucone: bez zmian.
- 21.10.2026 (właściciel, STOP końcowy M5, przekazane przez koordynatora): **progi hipotez H-51 ≥ 50%, H-52 ≥ 30%, H-53 ≥ 40%, ocena 26.12.2026**
  („Przyjąć (Recommended)”). Odrzucone: bez progów (sam odczyt metryk).
- 21.10.2026 (właściciel, STOP końcowy M5, przekazane przez koordynatora): **PR do `main` teraz, wpis do App Store Connect razem z wersją 1.0**
  („PR do main teraz, wpis do ASC z 1.0 (Recommended)”); PR otwiera i scala koordynator. Odrzucone: osobna wersja tylko z metadanymi; scalenie po M3.

## Pokrycie storefrontów — po zmianach (21.10.2026)

`storefronty.mjs` dla 33 lokalizacji (z en-AU i en-CA): język domyślny w **174 ze 175** storefrontów (przed: 171); brak tylko Chin (Simplified Chinese —
odrzucone na STOP 1). Australia, Nowa Zelandia i Kanada mają teraz stronę w języku domyślnym.

## Metoda i kontrola (bez danych konkurencji)

- Frazy: wyniki wyszukiwania App Store w kraju (iTunes Search API, pola nazwy, liczby ocen, kategoria), recenzje, podpowiedzi wyszukiwarki; odczyt
  21.10.2026. Ocena: trafność wobec głównej pracy, sygnał ruchu, konkurencja (liczby ocen pierwszej dziesiątki). Bez płatnych narzędzi.
- Kontrola: limity i reguły (`sprawdz-wydanie.mjs metadane` z modułu roli 10: kod 0; reguła „each greater than two characters” — App Store Connect Help,
  Platform version information, odczyt 21.10.2026, także dla CJK), krytyk ze świeżym kontekstem (zakazane słowa, twierdzenia bez pokrycia — m.in. usunięte
  „smartwatch” w ko i zh-Hant, bo aplikacja działa tylko z Apple Watch), przegląd językowy roli tłumacz.
- **[DO USTALENIA]** czy słowa kluczowe języka dodatkowego (np. pl w Polsce) liczą się w wyszukiwaniu storefrontu i czy sklep łączy odmiany i złożenia — pomiar.
- Do potwierdzenia przez native speakera: nazwy da i hr, podtytuł sl (dla sl brak sygnału ruchu w wyszukiwarce).

## Raport końcowy (E4, 21.10.2026)

**Podsumowanie.** Pokrycie storefrontów językiem domyślnym: 171 → 174 ze 175 (nowe en-AU, en-CA). Przed: podtytuł i słowa kluczowe tylko PL/EN (projekt);
po: 33 lokalizacje z nazwą, podtytułem i słowami kluczowymi z badania fraz w swoim języku, po krytyce i przeglądzie tłumacza; 10 nazw zmienionych
(pl, ro, nl-NL, da, no, es-MX, it, el, ms, hr). Kategoria główna bez zmian. Zużycie subagentów: ok. 1,3 mln tokenów (szacunek całości 1,2–2,5 mln; bez koordynacji M5), 0 zł.

**Hipotezy pomiaru** (format modułu pomiaru prywatnego; ocena 26.12.2026, ok. 8 tygodni od premiery 1.0 — ten sam punkt kontrolny co bramka W0).
Progi: **decyzja właściciela 21.10.2026** (STOP końcowy; propozycja M5 bez benchmarku — [OCENA]); minimalne próby: propozycja M5; oczekiwane n z punktu kontrolnego W0 (ok. 310 pobrań/mies.).

| H | Metryka (App Analytics) | Próg (decyzja 21.10.2026) | Zastępnik przy pustej komórce |
|---|---|---|---|
| H-51 | pobrania pierwszorazowe z „App Store Search” ÷ wszystkie pobrania pierwszorazowe | ≥ 50% | wyświetlenia z wyszukiwania w tygodniu |
| H-52 | pobrania ÷ odsłony strony z „App Store Search” (konwersja z wyszukiwania) | ≥ 30% | pobrania z wyszukiwania w tygodniu |
| H-53 | pobrania z wyszukiwania ÷ wszystkie pobrania w storefrontach z językiem lokalnym tylko dodatkowym (POL, CZE, SVK, UKR, DNK, NOR, FIN, TUR, GRC, IDN, MYS, VNM) | ≥ 40% | wyświetlenia z wyszukiwania w POL |

H-53 rozstrzyga **[DO USTALENIA]** z pokrycia: czy słowa kluczowe języka dodatkowego działają w wyszukiwaniu storefrontu.

**Plan po wydaniu** (moduł widoczności roli 10; każde działanie za osobną zgodą):
- strony niestandardowe (do 70) — warunek startu: kanał z własnym ruchem (społeczności z planu marketingu) albo druga praca aplikacji (np. trening w domu);
- testy strony (do 3 wersji, do 90 dni) — warunek: ruch, przy którym App Store Connect szacuje zakończenie testu w horyzoncie; przy małym ruchu najpierw zrzuty i tekst;
- wydarzenia w aplikacji — tylko prawdziwe i ograniczone w czasie (np. duża aktualizacja); nie codzienne zadania ani promocje cen.

**Kroki właściciela** (przez koordynatora): (1)–(2) kategoria i progi — rozstrzygnięte 21.10.2026; (3) zrzuty podpowiedzi wyszukiwarki
(10 fraz, instrukcja wysłana 21.10); (4) wpis pól do App Store Connect z wersją 1.0 (zgoda 21.10.2026; wpisuje koordynator/właściciel przy kroku ASC); scalenie do `main` — PR koordynatora; (5) native speaker dla nazw da, hr
i podtytułu sl, jeśli dostępny.

**Nie sprawdzono:** liczby wyszukań (bez płatnych narzędzi); podpowiedzi wyszukiwarki tylko z nieoficjalnego punktu (zrzuty z telefonu w toku);
indeksowanie języka dodatkowego, odmian i złożeń (pomiar); sl — brak sygnału ruchu; podpisy i kolejność zrzutów — po M3 (założenie kolejności w katalogu przebiegu).

**Kontrola dowodów i sekretów:** pliki grup przeszły `sprawdz-raport.mjs` (kod 0); metadane `sprawdz-wydanie.mjs metadane` (kod 0); strażnik nazw innych
aplikacji (`tests/forbidden-names.test.ts`) i test publicznego repo zielone; surowe dane konkurencji tylko w katalogu przebiegu poza gitem (do przeniesienia na Dysk).

## Podpowiedzi wyszukiwarki z telefonu właściciela (21.10.2026, storefront Polska)

Zrzuty listy podpowiedzi App Store dla 10 fraz (właściciel, ok. 17:58–18:00 czasu PL; przekazane przez koordynatora; zrzuty poza repo). Liczba podpowiedzi
to sygnał ruchu, nie liczba wyszukań.

| Fraza | Podpowiedzi | Wniosek |
|---|---|---|
| dziennik treningowy | 3 (fraza na 1. miejscu, 2 nazwy aplikacji) | ruch jest, mała konkurencja — potwierdza nazwę PL |
| dziennik siłowni | 0 (bez „ł”: tylko sama fraza) | bardzo mały ruch — potwierdza odejście od dawnej nazwy |
| timer przerw | 0 | mały ruch; „przerwy” zostaje w podtytule jako opis pracy |
| notes treningowy | 0 | mały ruch — „notes” zamienione na „domu” (decyzja 21.10.2026) |
| plan treningowy | 6 (m.in. „na siłownię”, „w domu”) | duży ruch; „w domu” wspiera nazwę bez „siłowni” |
| gym log | ok. 10 (fraza na 1. miejscu) | potwierdza nazwę EN |
| workout tracker | ok. 10 (fraza na 1. miejscu) | potwierdza podtytuł EN |
| rest timer | ok. 10 | potwierdza nazwę EN |
| gym diary | 5 | słabszy; „diary” w słowach en-GB zostaje jako fraza drugiego planu |
| workout log | ok. 9 | „workout” i „log” pokryte nazwą i podtytułem |

Decyzja właściciela 21.10.2026 (przekazane przez koordynatora, „Zgoda na zmianę”): w słowach kluczowych PL „notes” → „domu” (fraza „plan treningowy w domu”). Odrzucone: bez zmian. **[DO USTALENIA]** czy sklep łączy słowa z nazwy i słów kluczowych
w jedną frazę („plan” + „treningowy”) — ocena pośrednio przy H-51.

## Opisy i teksty promocyjne w 33 lokalizacjach (22.10.2026, po redesignie M3)

- Jedno źródło: `store/app-store-metadata.json` (pola `description`, `promotionalText`); docs/15 już nie powtarza tekstów. Testy: `tests/store-metadata.test.ts`
  (każda lokalizacja: limity 4000 / 170, linki Warunków i Polityki prywatności, liczby z kodu — 35 języków, 14 dni, 4 treningi; przypis espresso; bez kwot poza
  przypisem; bez nazw marek; en-AU = en-GB, en-CA = en-US), `tests/audit-m1-045-store-description.test.ts` (PL/EN: funkcje i nazwy widoków zgodne z kodem po M3).
- Zgodność z kodem po M3 (kontrola 22.10.2026): nazwy „Widok treningu: Skupiony / Lista”, „Dostosuj do miejsca”, „Gumy”; dodane automatyczna kopia po treningu,
  osobne dźwięk i wibracje; brak wywołań sieciowych w `app/`, `lib/`, `components/` (twierdzenie „bez konta, bez reklam, bez śledzenia” zgodne).
- Blok subskrypcji zostaje — decyzja D-1 z 14.10.2026 (docs/18: płatności od 1.0; potwierdził koordynator 22.10.2026). **Warunek:** opis jest prawdziwy dopiero
  z `PAYWALL.ENABLED = true` (dziś `false`, `lib/access.ts`) — włączenie i test w piaskownicy to osobne zadanie koordynatora przed wydaniem. Tekst promocyjny bez
  wzmianki o 14 dniach (prawdziwy w obu stanach).
- Linki Warunków (standardowa umowa licencyjna Apple) i Polityki prywatności w opisie — zabezpieczenie przy subskrypcjach (nie przeczytałem wymogu wprost
  w wytycznych z 21.10.2026; koszt zerowy).
- Zdanie medyczne we wszystkich językach = tekst ze słownika aplikacji („Aplikacja nie udziela porad medycznych…”), już przetłumaczony i przejrzany.
- Tłumaczenia: 6 grup (rola tłumacz), potem 3 przeglądy spójności (rejestr wg docs/16, lokalne nazwy aplikacji iOS, nazwy funkcji ze słownika, naturalność).
  Poprawione m.in. rejestr formalny hu, ro, pt-PT. **Do sprawdzenia przez native speakera (jeśli dostępny):** ton formalny hu i ro, nazwa „prowincji”
  w przypisie (hu, ja, ko, zh-Hant), „Apple Health” zamiast lokalnej nazwy aplikacji Zdrowie (otwarte w docs/16), nazwy aplikacji Pliki w tr, el, id, ms, vi.

## Model płatności M5 S1 w opisach (22.10.2026)

- Decyzja właściciela 22.10.2026 (model M5 S1; kontrakt: `docs/monetyzacja-badanie-2026-10.md` rozdz. 11 i wpis w docs/18 — gałąź `monetyzacja-badanie-2026-10-22`,
  przekazane przez koordynatora): aplikacja darmowa bez okresu próbnego, **do 5 dni treningowych w miesiącu**, Pro bez limitu (miesięczna, roczna, dożywotni), ceny bez zmian.
- Opisy i teksty promocyjne w 33 lokalizacjach: blok cenowy „Za darmo do 5 dni treningowych w miesiącu. Pro znosi limit…”, bez okresu próbnego (14 dni) i bez
  „4 treningów na żywo”; tekst promocyjny mówi o 5 darmowych dniach. Porównanie planu miesięcznego z espresso zostaje — cena miesięczna bez zmian
  (0,99 USD / 4,99 zł / 0,99 € / 0,99 £; kontrola ASC 21.10.2026), więc twierdzenie nadal prawdziwe (docs/research/espresso-mimit-2026-10.md).
- Ujawnienia w opisie bez zmian: odnawianie automatyczne, anulowanie w ustawieniach konta Apple, aktualne ceny w App Store, Chmura rodzinna, linki Warunków
  i Polityki prywatności. Wytyczna 3.1.2(a) (odczyt 21.10.2026) dotyczy dopuszczalnych subskrypcji (stała wartość, okres ≥ 7 dni, wszystkie urządzenia), nie treści opisu.
- **Warunek prawdziwości:** opis zgadza się z aplikacją dopiero po scaleniu kodu M5 S1 (`PAYWALL.ENABLED = true`, `FREE_TRAINING_DAYS_PER_MONTH = 5`; inny agent)
  i usunięciu ofert wprowadzających w App Store Connect (krok właściciela, kontrakt rozdz. 11). Test `tests/store-metadata.test.ts` sprawdza zgodność liczby 5 ze stałą w kodzie, gdy ta już istnieje.
- Tłumaczenia bloku i tekstu promocyjnego (3 grupy, rola tłumacz, 22.10.2026) — do sprawdzenia przez native speakera: odmiana „Pro” (fi, hr, ru, tr), odpowiednik
  „dnia treningowego” (ja, ko, zh-Hant, sl, fi), „dopisywanie treningów wstecz” podane opisowo zamiast nazwy przycisku „Dopisz trening wstecz” (wszystkie poza pl/en),
  skrócone teksty promocyjne fr-FR („pub”) i el.

## Odświeżenie przed 1.0, 28.10.2026

Zlecenie koordynatora po decyzji właściciela 28.10.2026 ~21:55 UTC (wariant A): opis i tekst promocyjny wersji 1.0 mają pokazywać największą nowość —
animowane rysunki ruchu i rozwiniętą sekcję „Technika” na karcie ćwiczenia (drugi zrzut pokaże kartę z rysunkiem). Zastępuje uwagę (a) z docs/48 pkt 6
(„o rysunkach ruchu w opisie nie wspominamy, dopóki nie obejmą całej biblioteki”) — tekst nie obiecuje rysunku przy każdym ćwiczeniu. Gałąź `metadane-1-0`.

**Liczba z kodu** (main `b3697068`): w bibliotece 709 ćwiczeń; rysunek ma 140, animowany 138 (figury v2: 87 w rodzinach przysiad, wyciskanie leżąc,
martwy ciąg — 1 statyczny; figury v1 z ≥ 2 klatkami: 52). Po PR #84 (JM Press i Decline Close-Grip Bench To Skull Crusher bez rysunku w 1.0; main `5d79c3a4`) — 136 animowanych.
Tekst mówi „ponad 100 ćwiczeń”; test `tests/store-metadata.test.ts` liczy z kodu (v2 przez `shownFigureSpec`, gdy istnieje) i pilnuje, że liczba > 100
i < całej biblioteki. Rysunek v2 pokazuje mięśnie zawsze, częsty błąd w 82 z 87 — stąd „a zwykle i częsty błąd” (test: ≥ 80%).

**Zmiany w opisie (33 lokalizacje):**
- nowa sekcja TECHNIKA / TECHNIQUE po sekcji TRENING (3 punkty: rysunki przy ponad 100 ćwiczeniach z pauzą animacji; sekcja „Technika”: ustawienie, ruch,
  wskazówki, częste błędy — nazwy z interfejsu; przy wielu odmianach przysiadu, wyciskania leżąc i martwego ciągu — pracujące mięśnie i zwykle częsty błąd);
  punkt „Biblioteka ćwiczeń z krótkimi wskazówkami techniki” usunięty (zastąpiony sekcją);
- zgodność z kodem: w POSTĘPACH dopisany „Strażnik progresji” (funkcja z interfejsu i z trzeciego zrzutu, wcześniej nieopisana); import CSV — „z podglądem
  przed zapisem” (tekst ustawień importu w aplikacji);
- uk, ru, ko: usunięta nazwa wzoru e1RM w nawiasie (nazwisko autora wzoru = nazwa źródła; zasada „źródła publicznie anonimowo” 25.10.2026; wzorzec
  `lib/sources.ts` łapie tylko łacinkę, więc test sklepu sprawdza też cyrylicę i hangul);
- skróty istniejących zdań bez zmiany sensu w fr-FR, el, it, ro, es-ES, es-MX (początek zdania o finansowaniu rozwoju bez zmian — test `store-review-notes`) — po dodaniu sekcji przekraczały limit 4000 znaków (ujawnienia cenowe
  i zdanie medyczne bez zmian).

**Tekst promocyjny:** pierwsze zdanie zaczyna się od rysunków ruchu i wskazówek techniki (PL „Animowane rysunki ruchu, wskazówki techniki, własne szablony
i timer przerw. …”); 5 darmowych dni bez zmian. Plan tygodnia i wykresy wypadły z tekstu promocyjnego (zostają w opisie i na zrzutach).

**Słowa kluczowe i podtytuły — bez zmian** (decyzja nocna agenta, do weta właściciela rano). Uzasadnienie: zlecenie dopuszcza frazę o technice/rysunkach
tylko na podstawie fraz z badania M5; katalog przebiegu z surowymi frazami nie jest w repozytorium ani na tej maszynie, a w tym dokumencie nie ma żadnej
frazy o technice ani rysunkach — brak danych dla każdego języka. Odrzucone: (a) dopisać „technika”/„form”/„technique” kosztem najsłabszej frazy
bez danych o ruchu — zgadywanie wbrew metodzie M5 i progom H-51…53; (b) zmienić tylko PL/EN na podstawie intuicji — to samo ryzyko, a pomiar H-51 i tak
oceni obecny dobór 26.12.2026. Do rozważenia po premierze: fraza o technice w badaniu M5 przy pierwszym przeglądzie (tekst promocyjny i opis można
zmieniać, słowa kluczowe tylko z nową wersją).

**Tłumaczenia:** PL i EN — agent; 31 pozostałych — przekład agenta z terminami z `docs/lokalizacja/slownik-terminow.json` i nazwami z interfejsu
(`lib/locales`), przegląd roli recenzent lokalizacji w niezależnej sesji (28.10.2026): 21 uwag, naniesione 16 (m.in. es „casi siempre” → „normalmente” — przesada;
fr „résultat à relire”, „Résumé” jak w interfejsie; it, no, ru, uk, de, id, fi, sl, ms, vi, ro — naturalność; EN „this week vs. last week”);
odrzucone 5: EN „animated drawings of the movement” / „exercise drawings” (interfejs i podpis zrzutu mówią „Movement drawing(s)”), ms „ilustrasi”
(interfejs ms: „Lukisan pergerakan”), el „Animation της κίνησης” (zapożyczenie; obecna wersja poprawna). **Do sprawdzenia przez native speakera:**
sl „aktivne mišice”, ms „lukisan” / „kesilapan lazim”, fi „muunnelmissa” / „lihasryhmittäin”, el „σχέδια με κινούμενη εικόνα” i nazwy ćwiczeń
(καθίσματα, πιέσεις πάγκου, άρσεις θανάτου), vi „bench press”, ro „împins la piept”; skrócone zdania w fr-FR, el, it, ro, es-ES, es-MX.
