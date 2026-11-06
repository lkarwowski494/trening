# Rozmowa o monetyzacji, marketingu i ASO — stan na przerwę (02.11.2026, ~22:45 PL)

Sesja `rozmowa/monetyzacja-marketing` (gałąź od `integracja-1-1`, tylko dokumenty; scala koordynator linii 1.1). Właściciel zarządził przerwę; ten plik pozwala wznowić rozmowę.

## Zapisane decyzje (źródło prawdy — nie ten plik)
- docs/18-przekazanie.md, wpis 02.11.2026 ~21:30 PL: tekst promocyjny „cała aplikacja w Twoim języku” przy 1.0.1 (wariant A) → ZB-035 w `docs/zobowiazania.md`; termin poprawiony 06.11.2026 na 1.1 (1.0.1 wchodzi do 1.1, decyzja 31.10.2026).
- docs/18, 06.11.2026: po wydaniu 1.0 (05.11) czekamy na dane organiczne — bez wpisów w społecznościach, reklam i zmian metadanych do ZB-012/ZB-013 (A); pierwsze pobrania głównie od znajomych z linku.
- docs/fakty-wlasciciela.md: zegarek fēnix 8 AMOLED (źródło: tag `archiwum/f020-garmin`).

## Ocena raportu o konkurencji (Dysk, „Analiza Konkurencji Aplikacji Treningowych iOS”, 02.11.2026, dwie kopie)
Raport Gemini; opinia, nie źródło. Błędy o nas: ceny PL (jest 4,99 / 19,99 / 59,99 zł — docs/monetyzacja.md:22), „zegarek tylko na symulatorze” (testy na urządzeniu — fakty właściciela), „brak lokalizacji sl w App Store” (jest — store/app-store-metadata.json; brak tylko bg, et, lt, lv, sr — docs/45:26).
Stosujemy już: limit dni bez próby, „Co nowego” we wszystkich językach (wydawca.md:12, scripts/asc/metadane.mjs:142), nazwa „Trening” w PL/HR/NO (store/app-store-names.json), lokalne frazy, test zegarka. Częściowo: słowa kluczowe dodatkowych lokalizacji (pomiar H-53), „bez konta” w podtytule PL/EN (zrzuty zaczynają się od pętli treningu — kolejność oceni H-52). Nie stosujemy i nie powinniśmy: porównań z konkurencją (Apple 2.3.7). Niesprawdzone: liczby rynkowe, „zero wywołań sieciowych”, „1 078 komunikatów”.

## Otwarte (bez decyzji, „zdecydujemy później”)
- Garmin — termin rozstrzygnięty później: właściciel 03.11.2026 ~21:20 PL, Garmin do 1.2 (ZB-040); punkt niżej zostaje jako tło.
- **Garmin — wznowienie gałęzi** `archiwum/f020-garmin` (4 commity, 158 plików: aplikacja Connect IQ, moduł iOS, zgoda Bluetooth w 35 językach; nieskompilowane, bez ekranu parowania, bez testu na zegarku). Szacunek (ocena agenta, nie pomiar): ok. 2–4 dni pracy agenta w rundach; kalendarz 2–4 tygodnie (testy właściciela na zegarku, przegląd sklepu Connect IQ — czas otwarty, opłaty „0 zł zakładane, niepotwierdzone”). Opcje: A — decyzja przy punkcie kontrolnym ZB-013 (rekomendacja), B — równolegle z 1.1.
- **Garmin w App Store** (przeczytane 02.11.2026: Apple 2.3.7, 2.3.10, 5.2.1, 5.2.2; developer.garmin.com/brand-guidelines/connect-iq — plakietka Connect IQ tylko dla aplikacji w sklepie Connect IQ, bez marki Garmin w ikonie bez zgody; dopuszczalne brzmienie zdania o zgodności — otwarte, zapytać Garmina). Opcje: A — jedno rzeczowe zdanie w opisie, bez marki w nazwie/podtytule/słowach kluczowych/ikonie (rekomendacja), B — także „garmin” w słowach kluczowych (ryzyko 2.3.7). Przy wydaniu: nazwany wyjątek w CLAUDE.md (dziś ogólny zakaz nazw firm w opisie; decyzja 13.10.2026 w docs/18:40 przewiduje „Garmin” w opisie po wydaniu z Garminem).

## Powiązane: JarAtlas (ta sama rozmowa)
Decyzja `2026-11-02-jaratlas-model-grup` (tablica JarAtlas), plan Z0 w `jaratlas-www/docs/WZNOWIENIE.md`, lista literatury `jaratlas-www/docs/tresci/L1-literatura-2026-11-02.md`; indeks książki w repo `prywatne/indeksy/`.
