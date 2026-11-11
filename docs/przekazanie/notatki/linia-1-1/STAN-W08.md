# STAN-W08 — sesja U (programista: KO-047, W-03 zamknięcie, W-08)

Gałąź `wyd/w08-1-1` od `integracja-1-1` @ 0fa2f448; scalona integracja 59b75b5e (5c7db3c1). Nie scalone do integracji (robi koordynator).

## Zrobione (11.11.2026)
1. KO-047 „Przyciąganie” (b4be0f13): PhaseName, cable_row, Hip Adduction / Cable Hip Adduction; EN „Pulling”; 33 języki z brzmieniem „Ściąganie”; test `tests/ko047-przyciaganie.test.ts` (czerwony → zielony). Recenzja różnicy figur przez audytora (7f535164): skróty cable_row d413c8bb3429, hip_abd_add a81c1d024cfe.
2. W-03 w docs/49 — zrobione (dowód tests.yml 43078373167); lekcja L-130 jest w docs/40.
3. W-08 (f4667d77, 0025fbb1 + poprawki recenzji): wersja 1.1.0, wpis „Co nowego” 2026-11-11 zastępuje 1.0.1 (decyzja docs/18, przyjęta do weta przez koordynatora), wiersz docs/09, znacznik wersji w site/privacy.html; przekład API run 43094081312 (szac. 1,46 USD; dowodowy 43093618070 ok. 0,04 USD), recenzja `docs/research/recenzje/w08-co-nowego-recenzent-2026-11-11.json`.

## Zostało
- `whatsNew` 34 lokalizacji w `store/app-store-metadata.json` (W-22; koordynator przekazał sesji U) — nie zrobione; propozycja: tekst generowany z wpisu w `lib/whatsnew.ts` i słowników (nie przepisywany ręcznie).
- Decyzja poza przekładem (recenzja W-08, pole `otwarte` 2): przywodzenie nogi z ogólnym „ciągnięciem” (ru „Тяга”, de „Ziehen”) brzmi nienaturalnie; naturalnie wymaga osobnej fazy (np. „Zsuwanie”, ru „Сведение”) — koordynator/właściciel.
- Pytanie pt/pt-BR „Puxada” → docs/49 W-03 (nie blokuje).

## Pułapki
- `test:fast` przy zmianie słowników wybiera ok. 178 plików (> 30 min) — w tle z limitem 2 h albo testy celowane.
- Zmiana nazwy fazy w `DATA_UI` zmienia skrót recenzji rodziny (scripts/skrot-v2-wynik.mjs) → rodzina znika z `lib/figures/data.json` do recenzji niezależnej.
- Artefakty przekładu: hosty sa17 i sa19 dopuszczone 11.11.2026 20:17.
