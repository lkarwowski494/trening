# 45. Widoczność w sklepie (M5) — metadane App Store

Przebieg roli M5 (widoczność w sklepie), gałąź `widocznosc/trening-2026-10-21`, od 21.10.2026. Zakres (ustalony z właścicielem 21.10.2026):
tylko metadane sklepu — nazwa, podtytuł, słowa kluczowe, kategoria, tekst promocyjny, opis — w lokalizacjach App Store; bez zmian w kodzie
i w zakresie funkcji 1.0. Podpisy i kompozycja zrzutów — po scaleniu redesignu M3. Wysyłka do App Store Connect i scalenie do `main` — tylko
za zgodą właściciela. Dokument zastępuje ścieżkę `docs/wydanie/widocznosc.md` z promptu roli (wyjątek nazwany: projekt trzyma dokumenty
numerowane w `docs/`, nowy podkatalog wymagałby zmiany generatora README).

## Stan (21.10.2026)

- E0 zakończony; STOP 1 rozstrzygnięty (decyzja właściciela niżej). Trwa E1: badanie fraz w 7 grupach języków.
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
