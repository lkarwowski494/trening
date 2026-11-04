# Dopisek do planu recenzji rodzin v2 — K16 (szkielet wpisów) i skutek 1A

Dopisek do `plan-recenzji-rodzin-v2.md` (plik planu leży na `integracja-1-1`; ta gałąź go nie zawiera, więc dopisek jest osobno — koordynator wkleja oba bloki poniżej po scaleniu).
Decyzje właściciela 03.11.2026 ~22:00 PL (1A, 2A; wpisy w `docs/18-przekazanie.md`).

## Blok do wklejenia w „Lista kontrolna rodziny”, po K15

- **K16** Zapisy recenzji (krok przepisującego, przed K9–K13): `node scripts/recenzja-szkielet.mjs <rodzina> --out <plik>` wylicza z bieżącego stanu KOMPLET wpisów —
  v2 (`sha`, `liczba` z `assignAll` łącznie z wyjątkami bez rysunku, lista ćwiczeń, pole `slad`), v1 do zmiany na „zastapiona” (K10), karty własne z `kartaSkrot` (K11),
  zestawy ogólne z `zestawSkrot` (K12) — z pustymi polami werdykt/recenzent/uwagi (v2 także `slad`). Recenzent wypełnia szkielet jako własny plik (K13),
  `node scripts/recenzja-szkielet.mjs --sprawdz <plik>` wypisuje braki (brak v1 „zastapiona”, brak karty/zestawu, zła liczba, stary skrót, autor = recenzent, brak śladu) i przy komplecie
  listę kroków generowanych: `zrodla-runtime --write` → `pokrycie-katalogu --write` → `test-matrix --write` → `readme --write` → kontrole i testy bramki.
  Szkielet generuje się po ostatniej zmianie kodu rodziny (skróty są bieżące); zmiana po wygenerowaniu → `--sprawdz` zgłosi „sha … ≠ bieżący”.

## Poprawka do K1 (skutek 1A)

Podłączenie rodziny (`status: 'ready'` w `families.ts`, wpis LOAD i DATA_UI w `poseData.ts`) **nie zmienia już skrótu recenzji innych rodzin** (`scripts/skrot-v2-norm.mjs`):
recenzja różnicy rodzin ready jest potrzebna tylko wtedy, gdy zmienił się kod rysunku (contract/scene/draw, dane póz, rigi, widoki i reszta `families.ts`/`poseData.ts`), a nie od samego podłączenia.
Jednorazowo: zmiana formuły 1A zmieniła `sha` wpisów istniejących rodzin przy rysunku bajtowo równym — zestawienie stare→nowe: `/home/user/stan-1a2a/sha-zmiana.json`; przepisuje agent niebędący autorem po potwierdzeniu audytora (L-047/L-097).
