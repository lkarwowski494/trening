# Stan audytu ćwiczeń i grafik (31.10.2026)

Gałąź: `audyt/cwiczenia-grafiki-2026-10-31` od `origin/integracja-1-1` @ 46a8f1cc. Tylko pliki `docs/audyt-cwiczen/`.

## Zrobione
- Partia 1 — inwentarz: `inwentarz.md` (709 ćwiczeń, 43 rodziny) — 97ba0144.
- Partia 2 — 4 rodziny `ready` (98 figur): `rodziny-ready.md`, `lista.md` (100 wierszy) — d817fb19.
- Raport i zadania dla partii 1–2: `raport.md`, `zadania.md` — commit z tym plikiem.
- Znaleziska ŚREDNIE+ (ACG-001…003) czekają na weryfikację niezależnego agenta (zleca koordynator).

## Następne partie (kolejność z aktualizacji koordynatora)
3. Widoczne w 1.0 poza 4 rodzinami: 97 kart własnych (w tym 4 ukryte w 1.1 przez nieaktualne wpisy v1: Bent Over Row ×2, T-Bar Row, Skullcrusher (EZ); Hack Squat „do poprawy”), 67 figur v1 (52 nie „zastąpionych”), karta a figura v1.
4. Rodziny `planned` z danymi v2 według liczby ćwiczeń: core_floor 44, delt_raise 38, curl 36, mobility_stand 36, triceps 32, pushup_plank 30, plyo 28, olympic 25, lunge 24, overhead_press 23, … (tabela w `inwentarz.md`). Na rodzinę: `jakosc-raport` (dziś 0 naruszeń), pomiary styku i toru jak w partii 2, karta a rysunek, zestaw pasuje tak/nie.
5. Reszta katalogu: 467 zestawów ogólnych bez recenzji (ocena dopasowania), 69 ćwiczeń bez wskazówek, rodziny bez danych (cardio, foam_roll, neck).

## Jak podjąć
- `cd /home/user/trening && git fetch origin audyt/cwiczenia-grafiki-2026-10-31 && git worktree add /home/user/audyt-acg origin/audyt/cwiczenia-grafiki-2026-10-31 && ln -s /home/user/trening/node_modules /home/user/audyt-acg/node_modules`.
- Pomiary: moduły TS ładowane przez `ts.transpileModule` (wzór `scripts/strona/ts-loader.mjs`); `figureSpec`/`frameAt`/`shapesAt`/`jointAngles`. Rodziny `planned` mają dane w `lib/figures/v2/poses/<rodzina>.json`, ale `poseData.ts` ładuje tylko pull_up — do pomiarów użyć `keyframeFrame` z `contract.ts` na danych pliku albo `scripts/figures/v2-validate.mjs --podglad`.
- Porównanie ze stanem zrecenzowanym: drugie drzewo na e796c7ed (`wersja-1-0-1-r2`).
