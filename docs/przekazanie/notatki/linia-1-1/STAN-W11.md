# Stan W-11 (sesja X, 11–12.11.2026) — naprawy po audycie W-10 + W-22

Gałąź: `naprawy/w11-1-1` od `integracja-1-1` @ a280bd37. Rola 08-programista, tryb fix.

## Zrobione (SHA)
- MER-01: a1d4b1ae (7 wahadeł kb_ballistic bez sekund, aplikacja i eksport strony; test czerwony 3 → zielony 3), 871886b1 (recenzja niezależna r5 audytora: wyswietlana, ruch 16/16 md5 równe; skrót a271df03d983).
- DIF-01 (PL/EN + test + zestaw przekładu): bf69a9b5.
- W-22: bccd857b (wpisy „Co nowego” w `lib/whatsnew-wpisy.ts`, strukturalnie), 9259012d (`scripts/store-whatsnew.mjs`, `check:whatsnew-sklep` w verify).
- Zadanie 4: 41246615 (19 znalezisk do docs/21; UX-01 w docs/39 ZD-03).
- Poprawki po verify:szybkie (BRD bez liczb w scenariuszu, pochodne 19 kroków, R-015 otwarty): 819559d5 (tests.yml 43125339813 czerwony — drugi strażnik stanu R-015).
- a1d74955: test W-05 (`tests/blokada-wydania-stan-2026-11-11.test.ts`) zależny od zestawu przekładu; lekcja L-NNN w docs/40 (systemowa, opcje A/B, rekomendacja B); verify:szybkie kod 0 (18897 zielonych), wypchnięte 01:27 UTC — tests.yml w toku (sprawdza koordynator).

## Otwarte
1. **DIF-01 — przekład 33 języków** (KO-053): przebieg `przeklad-tlumaczen.yml` 43117339440 (success, Opus), artefakt 13899680861 „raport-przekladu” (19 238 B) na hoście productionresultssa14.blob.core.windows.net — poza listą dozwolonych; czeka na zgodę właściciela. Artefaktu nie pobierać innymi drogami. Przebieg dowodowy bg: 43116902121 (0,043 USD, przyjęty).
   Po zgodzie: pobierz artefakt (MCP `download_workflow_run_artifact`), rozpakuj do `docs/lokalizacja/raport-przekladu-2026-11-11-dif01-nazwy-lokalne/`, przejrzyj, `node scripts/i18n/przeklad-api.mjs --zastosuj docs/lokalizacja/raport-przekladu-2026-11-11-dif01-nazwy-lokalne --zestaw docs/lokalizacja/zestaw-przekladu-2026-11-11-dif01-nazwy-lokalne.json` (sprawdź składnię w nagłówku skryptu), opróżnij listę `klucze` zestawu (status „przełożony …”), zamknij R-015 w docs/40 i odwróć test `tests/blokada-wydania.test.ts` (11.11.2026) na stan zamknięty, `node scripts/store-whatsnew.mjs --write` (whatsNew 33 lokalizacji), recenzja `recenzent-lokalizacji` (zapis w docs/research/recenzje/), verify:szybkie, push, tests.yml.
   Do tego czasu `npm run check:release` = 1 (R-015) — wydania nie robić.
2. Odtwarzacz strony techniqueatlas: czy czyta `untimed` przy fazach wahadła (MER-01 na stronie) — [DO USTALENIA], repo bez dostępu w sesji X.

## Pułapki
- `lib/figures/v2/figure.ts` blisko limitu 20 KB (`tests/architecture-limits.test.ts`).
- Każda zmiana zestawu przekładu z rodzajem „zmieniony” otwiera R-015 (test `tests/blokada-wydania.test.ts`).
