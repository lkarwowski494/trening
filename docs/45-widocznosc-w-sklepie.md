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
| notes treningowy | 0 | mały ruch — kandydat do zamiany w słowach kluczowych (pytanie do właściciela) |
| plan treningowy | 6 (m.in. „na siłownię”, „w domu”) | duży ruch; „w domu” wspiera nazwę bez „siłowni” |
| gym log | ok. 10 (fraza na 1. miejscu) | potwierdza nazwę EN |
| workout tracker | ok. 10 (fraza na 1. miejscu) | potwierdza podtytuł EN |
| rest timer | ok. 10 | potwierdza nazwę EN |
| gym diary | 5 | słabszy; „diary” w słowach en-GB zostaje jako fraza drugiego planu |
| workout log | ok. 9 | „workout” i „log” pokryte nazwą i podtytułem |

Otwarte: zamiana „notes” → „domu” w słowach kluczowych PL (do decyzji właściciela). **[DO USTALENIA]** czy sklep łączy słowa z nazwy i słów kluczowych
w jedną frazę („plan” + „treningowy”) — ocena pośrednio przy H-51.
