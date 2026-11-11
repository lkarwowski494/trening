# Recenzja lokalizacji: podtytuły i słowa kluczowe App Store 1.1 („RepsGoat: …”), 31 lokalizacji

- Data: 11.11.2026 · autor tekstów: przekład z 21.10.2026 (docs/45) + zmiana nazwy c959049 · recenzent: agent `recenzent-lokalizacji` (niezależny, ≠ tłumacz i ≠ wydawca W; L-047) · nałożenie: wydawca W (sesja W, gałąź `wyd/w-metadane-1-1`).
- Wejście: `store/app-store-names.json` (`names`), `store/app-store-metadata.json` (`subtitle`, `keywords`), słownik `docs/lokalizacja/slownik-terminow.json`, napisy aplikacji `lib/locales/*.json`. Zakres: wszystkie lokalizacje poza `pl` i `en-US`.
- Kontrola mechaniczna wydawcy przed recenzją (python, 11.11.2026): podtytuł ≤ 30 znaków i słowa ≤ 100 B we wszystkich 31; brak słów kluczowych równych słowu nazwy/podtytułu (poza „Gym” w nazwie i podtytule en-GB/AU/CA — jak en-US, decyzja 09.11.2026); brak marek innych firm.

## Wynik: 23 OK, 8 poprawek (0 BLOK, 3 ŚREDNIE, 5 NISKIE)

| Lokalizacja | Ocena | Waga | Propozycja | Uzasadnienie (recenzent) | Stan |
|---|---|---|---|---|---|
| hr | poprawka | ŚREDNIE | podtytuł „Serije, planovi, tajmer odmora” (30 zn.) | słownik zakazuje „pauz” w hr (pauza treningu, nie przerwa między seriami); aplikacja: „Odmor” | nałożone |
| sl | poprawka | ŚREDNIE | podtytuł „Serije in časovnik počitka” (26 zn.); słowa: „telovadnica” → „fitnes” | słownik zakazuje „odmor” w sl (urlop); aplikacja: „Počitek”; „telovadnica” = sala szkolna (pewność średnia) | podtytuł nałożony; „fitnes” — pytanie do native speakera, bez zmiany |
| sk | poprawka | ŚREDNIE | słowa „cvičenie,silový,činky,posilňovanie,kalendár,rekordy,RPE,RIR,gumy,odpočinok,posilňovňa,doma” (98 B) | „váha” = masa ciała/waga łazienkowa (ruch z odchudzania); „posilňovanie” to słowo z siłowni | nałożone |
| cs | poprawka | NISKIE | słowa: „šablony”, „RIR” → „posilování” (100 B) | potoczna nazwa treningu z ciężarami | backlog |
| uk | poprawka | NISKIE | „повторення” → „спортзал” (96 B) | częstsze wyszukiwanie; „підходи” w podtytule | backlog |
| ru | poprawka | NISKIE | „повторения” → „спортзал” (93 B) | jak uk | backlog |
| da | poprawka | NISKIE | „træningslog” → „fitness” (95 B) | powtarza „træningsdagbog”; „fitness” = siłownia po duńsku | backlog |
| fi | poprawka | NISKIE | podtytuł „Salitreeni & palautusajastin” (28 zn.) | „Voimaharjoittelu” brzmi podręcznikowo | backlog |
| en-GB, en-AU, en-CA, hu, ro, es-ES, es-MX, pt-PT, pt-BR, de-DE, fr-FR, it, nl-NL, sv, no, tr, el, id, ms, vi, ja, ko, zh-Hant | OK | – | – | brzmienie naturalne, terminy zgodne ze słownikiem, bez marek i literówek | bez zmian |

## Sprawy otwarte
- pt-BR „treino” zniknęło z nazwy razem z „Treino:” — wariant B (bez zmiany, jak PL/EN 09.11.2026) wybrany przez analogię, docs/18 11.11.2026.
- Pytania do native speakerów: hr „tajmer” czy „mjerač odmora”; sl „fitnes” czy „telovadnica”; no nazwa „dagbok for gym” czy „treningsdagbok”; ms „pemasa rehat” czy „timer rehat”.
- Luka zakresu strażnika: `tests/slownik-terminow.test.ts` nie czyta `store/app-store-metadata.json`, dlatego „pauze” (hr) i „odmora” (sl) w podtytułach przeszły bez sygnału. Propozycja: rozszerzyć test o `subtitle` i `keywords` sklepu (programista; poza zamrożonym zakresem sesji W).
- Proponowany zakaz w słowniku: sk „váha” w słowach kluczowych sklepu.
