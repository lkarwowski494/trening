# Stan audytu ćwiczeń i grafik (31.10.2026)

Gałąź: `audyt/cwiczenia-grafiki-2026-10-31` od `origin/integracja-1-1` @ 46a8f1cc (scalona z 1c683be przed partią 3). Tylko pliki `docs/audyt-cwiczen/`.

## Zrobione
- Partia 1 — inwentarz: `inwentarz.md` (709 ćwiczeń, 43 rodziny) — 97ba0144.
- Partia 2 — 4 rodziny `ready` (98 figur): `rodziny-ready.md`, `lista.md` (100 wierszy) — d817fb19.
- Raport i zadania dla partii 1–2: `raport.md`, `zadania.md` — commit z tym plikiem.
- Znaleziska ŚREDNIE+ (ACG-001…003) — weryfikacja niezależna: `weryfikacja-2026-10-31.md` na gałęzi `audyt/weryfikacja-2026-10-31` (4ec92dd).
- Partia 3 — karty własne i figury v1 (31.10.2026, stan 1.1 @ 1c683be i build 1.0 `v1.0.0-b1033`): `lista-partia3.md` (102 wiersze), raport sekcja 8, zadania ACG-T-010…011. Liczby z kodu: karty pokazywane 101 (1.0) / 97 (1.1); figury v1 widoczne 53 / 52, sprawdzonych 56 (+2 wersje 1.0 zmienionych); 15 „zastąpionych” niewidocznych. Znaleziska: ACG-006 Skullcrusher (EZ) ŚREDNIE (widoczne w 1.0, do weryfikacji niezależnej), ACG-007 Glute Bridge NISKIE. Nowych OP brak.

## Następne partie (kolejność z aktualizacji koordynatora) — dalej: partia 4
3. ~~Widoczne w 1.0 poza 4 rodzinami~~ — zrobione (wyżej). Niesprawdzone w partii 3: pełne czytanie źródeł kart (sprawdzona struktura ≥ 2 organizacje i 1 źródło wyrywkowo), treść przekładów poza liczbami, mięśnie w kartach, arkusze ze śladem toru dla figur v1 (L-050 dotyczy recenzji, nie audytu).
4. Rodziny `planned` z danymi v2 według liczby ćwiczeń: core_floor 44, delt_raise 38, curl 36, mobility_stand 36, triceps 32, pushup_plank 30, plyo 28, olympic 25, lunge 24, overhead_press 23, … (tabela w `inwentarz.md`). Na rodzinę: `jakosc-raport` (dziś 0 naruszeń), pomiary styku i toru jak w partii 2, karta a rysunek, zestaw pasuje tak/nie.
5. Reszta katalogu: 467 zestawów ogólnych bez recenzji (ocena dopasowania), 69 ćwiczeń bez wskazówek, rodziny bez danych (cardio, foam_roll, neck).

## Jak podjąć
- `cd /home/user/trening && git fetch origin audyt/cwiczenia-grafiki-2026-10-31 && git worktree add /home/user/audyt-acg origin/audyt/cwiczenia-grafiki-2026-10-31 && ln -s /home/user/trening/node_modules /home/user/audyt-acg/node_modules`.
- Pomiary: moduły TS ładowane przez `ts.transpileModule` (wzór `scripts/strona/ts-loader.mjs`); `figureSpec`/`frameAt`/`shapesAt`/`jointAngles`. Rodziny `planned` mają dane w `lib/figures/v2/poses/<rodzina>.json`, ale `poseData.ts` ładuje tylko pull_up — do pomiarów użyć `keyframeFrame` z `contract.ts` na danych pliku albo `scripts/figures/v2-validate.mjs --podglad`.
- Porównanie ze stanem zrecenzowanym: drugie drzewo na e796c7ed (`wersja-1-0-1-r2`).
- Partia 3 (powtórzenie pomiarów): drzewo 1.0 przez `git archive v1.0.0-b1033 lib data scripts components docs/research` do katalogu tymczasowego + kopia `scripts/strona/ts-loader.mjs` (w 1.0 go nie ma); widoczność jak `components/ExerciseCues.tsx:45`; arkusze PNG rysowane z `figureFrames` (bez rsvg/playwright — PIL).
