# Brief: pilotaż toru ruchu — rodzina curl (AUTOR) — programista, worktree /home/user/wt-curl, gałąź figury/curl (od origin/integracja-1-1)
Najpierw wspólne zasady: docs/przekazanie/notatki/linia-1-1/briefy/programista-wspolny.md (zastąp ścieżkę worktree swoją).
Plan i miejsca w kodzie: docs/przekazanie/notatki/linia-1-1/plan-tor-ruchu-2026-11-02.md (sekcje 1, 3, 4, 6 i decyzje koordynatora). Bramki: origin/przekazanie-konta docs/przekazanie/notatki/53-grafiki-model-pracy.md (git show).
Zadanie (autor, NIE recenzent — recenzję zleca koordynator innemu agentowi, L-047):
1. Generator `scripts/figures/agent-pozy/curl.mjs` (wzór pull_up.mjs) dla 36 ćwiczeń rodziny; sens w data/zrodla/figury-sens.json; podgląd `run.mjs --rodzina curl --podglad --log <twój>.jsonl`; walidacja v2-validate/v2-sens; `--zastosuj` → lib/figures/v2/poses/curl.json.
2. R3: rozszerz tests/figury-styk.test.ts (styk ciężar–ciało) na curl (i ogólnie rodziny z ciężarem, jeśli tanio).
3. NIE podłączaj statusu ready / LOAD / DATA_UI (families.ts, poseData.ts) — R1: podłącza koordynator partią po recenzji. NIE commituj plików generowanych (lib/cues/data.json, lib/figures/data.json, fixture pokrycia, docs/55).
4. Przygotuj arkusze dla recenzenta: `node scripts/figures/arkusz-slad.mjs --out <kat w scratchpadzie poza repo> --key "…"` dla wszystkich 36; lista ścieżek w raporcie. Nie dołączaj uzasadnień dla recenzenta.
5. Miary pilotażu (sekcja 3): czas, % kontekstu, wyjątki toru z powodem, odsetek zaliczonych za 1. razem.
6. Nowe nazwy faz → t() + i18n (zgłoś do tłumacza w raporcie). Pełne verify (flock -x), push gałęzi.
Uwaga: dysk ~0,9 GB — arkusze PNG trzymaj małe, usuń po recenzji.
