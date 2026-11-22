# Stan sesji AL (rola M5, widoczność w sklepie) — przekazanie 22.11.2026 ~09:50 UTC

Gałąź `aso/pozycjonowanie-1-2` (od integracja-1-1 @ 3332dc62). Koordynator: session_01BM51odgG7NSW2dnk3ZgwQ4 (raporty przez send_message).

## Zrobione
- 8b9c3f8a — STOP 1: `docs/wydanie/pozycjonowanie-stop1.md` (stan wyjściowy, pokrycie 174/175, pytania P-a…P-c), fakty TikTok i T0 w `docs/fakty-wlasciciela.md`.
- 1f93f31b + ten commit — `docs/wydanie/diagnoza-ruch-poza-pl.md` (przyczyny „ruch tylko z PL”, dane potrzebne z API, wynik podglądu asc-metadane).

## Decyzje właściciela (przez koordynatora, KO-100, 22.11 ~09:30 UTC)
- P-a „Wszystko od razu”: zmiany PL i EN teraz (z nową wersją — wysyłka nie nasza); pomiar 8 tygodni po zmianie zamiast 23.12.
- Wydarzenie: rezygnacja. Języki: wszystkie 33 lokalizacje. Pomiar: automat przez API (sesja AM, nie AL).
- Właściciel 22.11 ~09:50: dane do analiz z ASC przez API, nie od niego.
- Koordynator 09:41: diagnoza przyjęta; start E1–E4 dla 33 lokalizacji, grupy jak 21.10 (docs/45 „Plan przebiegu”), krytyka, propozycje → STOP 2.
  Pułap sesji 60 USD (STOP 78). Zapis do ASC — NIE.

## Następny krok (nowa sesja)
E1: jeden subagent na grupę G1–G7 (docs/45), równolegle. Polecenie grupy: wzór z promptu roli M5 („Polecenie dla grupy języków”) plus wniosek diagnozy:
frazy realnie wyszukiwane i wygrywalne przy 0 ocenach w kraju (długi ogon; liczba wyników API 30–150 i niska mediana ocen pierwszej dziesiątki), osobno
nazwa (człon po „RepsGoat: ”, ≤ 30 znaków całość) / podtytuł (≤ 30) / słowa kluczowe (≤ 100 B, bez słów z nazwy, podtytułu, kategorii). Unikać fraz z 1–10
wynikami (puste) i z medianą tysięcy ocen. Źródło: `itunes.apple.com/search?term=…&country=…&entity=software&limit=200` (pozycja, liczba wyników, userRatingCount).
Potem E2 scalenie + krytyk (świeży subagent), STOP 2 do koordynatora.

## Sesja AL2 (22.11.2026, ~10:50 UTC) — STOP 2
- E1 zrobione: 7 grup równolegle (09:48–10:06 UTC), ok. 600 fraz; popyt z publicznych podpowiedzi wyszukiwarki App Store per kraj (nagłówek storefrontu).
- E2: kontrola mechaniczna (słowa > 2 znaki — poprawka ja/ko/zh-Hant, EN „pr”, ES „rm”), krytyk (8 do zmiany, 13 niepewnych — przyjęte).
- STOP 2: `docs/wydanie/pozycjonowanie-stop2.md`, decyzje KO-106…KO-109 czekają na właściciela (przez koordynatora).
- Następny krok po odpowiedzi: E3 — wpis wybranych pól do `store/app-store-names.json` i `store/app-store-metadata.json` (wartości w tabeli STOP 2),
  recenzent lokalizacji, testy przypięte do wartości (`tests/store-metadata.test.ts:52-53`, `tests/nazwa-repsgoat.test.ts`, `tests/i18n-locales.test.ts`),
  docs/18, `verify:lekkie`; potem E4 (hipotezy, raport). Katalog przebiegu (scratchpad AL2) nie przetrwa nowej sesji — tabela STOP 2 jest kompletna.

## Pułapki
- `verify:docs`: najpierw `git fetch --unshallow origin` (merge-base z origin/main); uruchamiać `NODE_NO_WARNINGS=1 NODE_USE_ENV_PROXY=1 npm run verify:docs`
  — bez NODE_NO_WARNINGS ostrzeżenie proxy daje fałszywe porażki Jest (11 testów); bez proxy baza H1 nie znajduje zielonego tests.yml. `npm ci` przed verify.
- Push dopiero po znaczniku verify:docs (hak pre-push); zielony tests.yml bazy gałęzi potrzebny do H1.
- Słoweński: w repo jest, w ASC nie (LOCALE_MAP sl: null, L-003) — propozycje sl tylko w repo.
- Nazwy innych aplikacji i surowe wyniki — tylko w katalogu przebiegu poza repo (scratchpad poprzedniej sesji nie przetrwa; nowa sesja zbiera od nowa).
- Podgląd asc-metadane nie czyta wersji w sprzedaży (READY_FOR_SALE) — słów kluczowych na żywo nie znamy.

## Koszt
Sesja AL do przekazania: ok. 12–15 USD [OCENA]. Szacunek E1–E4 dla 33 lokalizacji: 1,3–2,4 mln tokenów, ok. 30–55 USD [OCENA].
