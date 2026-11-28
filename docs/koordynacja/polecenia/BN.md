# Sesja BN: oficjalne plakietki App Store na stronie — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (ta sesja jest utworzona przez koordynatora na polecenie właściciela; raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID).

Słowa właściciela (28.11 ~09:00 UTC): „Chce ta plakietke.”; po próbie wgrania paczki (ZIP > 25 MB): „Pogubie sie. Musisz to zrobic sam”. Właściciel (przedstawiciel konta dewelopera) zaakceptował 28.11 licencję „App Store Marketing Artwork License Agreement” i pobrał paczkę — Ty pobierasz te same oficjalne pliki w jego imieniu (KO-139).

1. Rola: 08-programista w trybie build (prompt roli niżej po linii `=== PROMPT ROLI ===`).
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/plakietka-apple` od `strona/integracja-start` (najnowsza głowa). Zasady i stan kodu: docs/teksty/plakietka-app-store.md (KO-138). Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>).
3. Zadania:
   1. Pobierz OFICJALNE czarne plakietki „Download on the App Store” w formacie SVG dla 35 języków strony (lista kodów w docs/teksty/plakietka-app-store.md), wyłącznie ze źródeł Apple: strona https://developer.apple.com/app-store/marketing/guidelines/ (paczka po licencji) albo Apple Marketing Tools (https://toolbox.marketingtools.apple.com/app-store/ — generator plakietek per język). Przeczytaj zasady w dniu pracy; zapisz w docs adres źródła każdego pliku i datę. Zero modyfikacji plików (bez zmiany kolorów, tekstu, ramki). Dla języka bez plakietki Apple (np. sr) — angielska plakietka (decyzja do weta). Zapisz jako assets/plakietka/<kod>.svg.
   2. Testy (z recenzji BL, ŚREDNIE): przy appStoreId ustawionym i istniejącym pliku — w ramce <img> z pliku, height ≥ 40, alt; linia znaków Apple tylko wtedy; bez pliku — link tekstowy, bez linii. Test, że pliki plakietek są niezmienione (suma kontrolna zapisana przy pobraniu). appStoreId w config.json zostaje PUSTE (ustawiamy przy publikacji).
   3. Push, tests.yml zielony; zrzut ramki z plakietką (pl, en, ciemny motyw) w pomiary/plakietka/ — sprawdź kontrast czarnej plakietki na ciemnym tle (zasady Apple o tle).
4. Zakazy: bez plakietek nieoficjalnych/przerysowanych; nie scalasz, nie otwierasz PR, nie tworzysz sesji, nigdy --no-verify ani force-push, bez AskUserQuestion. Jeśli pobranie wymaga logowania albo zgody, której nie da się udzielić bez konta — PYTANIE do koordynatora.
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Od 30% kontekstu: STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 8 USD.
7. PRZEKAZANIE do koordynatora przez send_message (≤ 10 linii).
