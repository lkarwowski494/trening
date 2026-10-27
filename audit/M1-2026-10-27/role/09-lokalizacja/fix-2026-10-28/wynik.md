# 09-lokalizacja, tryb fix, partia 3 (28.10.2026)

Kopia robocza: klon /home/user/trening w scratchpadzie agenta (`/tmp/claude-0/-home-user/c425bb2c-a2c9-5faa-871d-a1f8c7d277a6/scratchpad/kopia`), gałąź `naprawy/M2-koordynator-napraw-2026-10-27-p3`, 2 commity na wierzchu d0ae52e. Nic nie wypchnięto. Środowisko ograniczało git do własnego worktree, więc zamiast `git reset --hard` w /home/user/trening użyto `git clone` (ten sam stan gałęzi). Przeniesienie: `git fetch <klon> naprawy/M2-koordynator-napraw-2026-10-27-p3` albo cherry-pick.

## Klasyfikacja (E0)
003: D. 006: D. 007: D. 005: P (decyzja produktowa, zmienia M1-039) — nie wdrożone.

## Commity
| SHA | ID |
|---|---|
| d8efe02 | M1-audytor-generalny-019; 09-lokalizacja-003 |
| c4a5f48 | M1-audytor-generalny-031; 09-lokalizacja-006, 09-lokalizacja-007 (005 otwarte) |

## Dowody (logi w dowody/)
- 003: `tests/i18n-skrot-liczebnik.test.ts` (nowy). Przed: 2 czerwone (sl, uk; po 3 klucze), p019-przed.txt; po: 11/11, p019-po.txt. Poprawka: uk „впр.”, sl „vaj.” w 3 kluczach „… {n} ćw.” (opcja A z raportu). Test dotyczy języków z formami few/two; fi, ko, zh-Hant mają własne poprawne formy.
- 006: `tests/i18n-forma-uk.test.ts` (nowy). Przed: czerwony, 8 trafień (raport podawał 4; dodatkowo „Вибери” x2 w dniach treningowych, „додаси” w opisie celu serii, „твоїм” w opisie planu), p006-przed.txt; po: 2/2. Zamiana na „ви”: Введіть, Виберіть, Оберіть, додасте, вашим.
- 007: `tests/check-i18n-script.test.ts` (nowy, 15 przypadków, skrypt uruchamiany w próbce projektu). Przed (stary skrypt): 8 czerwonych (t("…"), t(`…`), tp/tr w cudzysłowie, i18n.t, klucz z podstawieniem, pismo ru/el/ja/ko/zh-Hant/bg/uk, obce pismo w de), p007-przed.txt; po: 15/15. `scripts/check-i18n.mjs` czyta kod i lib/i18n.en.ts składnią TS (te same 1437 tekstów co wcześniej), podstawienie lub sklejanie w kluczu to błąd, kontrola pisma w lib/locales/*.json. Usunięty test „liter polskich” z `tests/i18n-locales.test.ts`. Terminy i symbole łacinką: `docs/lokalizacja/pismo-wyjatki.json` (ok. 70 wartości, przejrzane: marki, skróty, nazwy sprzętu, symbole dystansu).
- Zestaw związanych testów (10 plików, 1175 testów) zielony: p031-zwiazane.txt. Także `check:i18n`, `check:matrix`, `check:readme`, `tsc --noEmit` bez błędów. Wygenerowane: konteksty.json, macierz, README.
- Nie uruchomiono pełnego `npm run verify` ani pełnego jest (maszyna współdzielona); zostaje koordynatorowi po scaleniu.

## Otwarte
1. 09-lokalizacja-005 (P): symbol masy łacinką (`lib/units.ts:81`; `wu()` użyte w 39 miejscach, także jako wartość logiczna, w CSV i mowie), dystans w ru/uk/bg/sr/el/zh-Hant przez słownik („км”). Opcje: (A) lokalny symbol masy (кг, κιλά) przez słownik — zmienia M1-039 i wymaga rozdzielenia wartości logicznej `wu()` od etykiety w ok. 40 miejscach; (B) symbole SI łacinką wszędzie, także dystans — mała zmiana, mniej naturalna dla cyrylicy. Rekomendacja audytu: A dla cyrylicy i greki, po przeglądzie języka. Wymaga wyboru właściciela. Lista wyjątków pisma tego nie ukrywa.
2. Przegląd `recenzent-lokalizacji` zmienionych tekstów (uk: formy „ви”, uk/sl: skrót) nie odbył się — w tej sesji brak narzędzia subagentów; do uruchomienia przez koordynatora. Zmiany małe i regułowe.
3. Nowych znalezisk brak. Opcja B z 003 (klucze tp() z formami) czeka na następną partię tłumaczeń.
