# STAN-W-METADANE — sesja W (wydawca, metadane sklepu 1.1 pod RepsGoat)

Gałąź `wyd/w-metadane-1-1` od `integracja-1-1` @ 0fa2f448 (koordynator: przesunięcie z 79117f33 to same dokumenty). Bez wysyłki do App Store Connect, bez workflowów wysyłki.

## Zrobione (11.11.2026)
1. Słowa kluczowe EN: „offline” i „repgoat” już w en-US/GB/AU/CA (c959049); z pliku 100/99/99/100 B; wpis decyzji 19:03 w docs/18 + test z datą (48122b20).
2. „Trening” w `store/app-store-metadata.json`: grep `(?<![/\w])Trening(?![\w/])` przed = 0, po = 0 trafień jako nazwa; „trening*” występuje tylko jako zwykłe słowo (pl, hr, sl, no — np. „Treningslogg”, „styrketrening”) i w ścieżce `apps4brew.com/trening/privacy.html` → bez zmiany. Poza zakresem: `store/iap-localizations.json` `wpisaneRecznie` (stara nazwa grupy subskrypcji w ASC, krok właściciela; znane w STAN-W04-REPSGOAT.md:16).
3. ZB-056, 31 języków — recenzja: `docs/research/recenzje/w-metadane-sklep-recenzent-2026-11-11.md`; test `tests/nazwa-repsgoat.test.ts`; decyzja w docs/18 (11.11.2026, wydawca W). Przekład API: 0 USD (nie był potrzebny).
4. W-22 w docs/49: „metadane w repo gotowe, czeka na podgląd różnic i zatwierdzenie właściciela”.

## Tabela 31 języków
| Lokalizacja | Wynik | Powód |
|---|---|---|
| hr | zmienione: podtytuł „Serije, planovi, tajmer odmora” | słownik zakazuje „pauz” (ŚREDNIE) |
| sl | zmienione: podtytuł „Serije in časovnik počitka” | słownik zakazuje „odmor” (ŚREDNIE); „fitnes” zamiast „telovadnica” — pytanie do native speakera |
| sk | zmienione: słowa bez „váha”, „šablóny”, z „posilňovanie” (98 B) | „váha” = waga łazienkowa (ŚREDNIE) |
| cs, uk, ru, da, fi | bez zmian | poprawki NISKIE → backlog 1.1.x (zamrożenie zakresu) |
| pt-BR | bez zmian | „treino” nie wraca — analogia do PL/EN 09.11.2026 |
| no, ms | bez zmian | OK; pytania do native speakera (nazwa no, „pemasa” ms) |
| en-GB, en-AU, en-CA | bez zmian | OK; „Gym” w nazwie i podtytule jak en-US (decyzja 09.11.2026) |
| hu, ro, es-ES, es-MX, pt-PT, de-DE, fr-FR, it, nl-NL, sv, tr, el, id, vi, ja, ko, zh-Hant | bez zmian | OK w recenzji; limity i duplikaty czyste |

## Otwarte
- Luka strażnika: `tests/slownik-terminow.test.ts` nie czyta `store/` (dlatego hr/sl przeszły) — programista, poza zamrożeniem.
- Zakaz sk „váha” w słowach sklepu do słownika — tłumacz.
- 4 pytania do native speakerów (hr, sl, no, ms).

## Następny krok
Koordynator: `asc-metadane.yml` tryb `podglad` (różnice), potem zatwierdzenie `release` przez właściciela (W-22).
