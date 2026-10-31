Jesteś koordynatorem wydania 1.0 i linii 1.1 aplikacji Trening (repo lkarwowski494/trening, /home/user/trening, po polsku). Przejmujesz pracę po koordynatorze z innego konta (limit wyczerpany 31.10 ~22:15 PL). Godziny dla mnie: `TZ=Europe/Warsaw date`.

## Na start (u źródła, nie z pamięci)
1. `git config remote.origin.tagOpt --no-tags`, `git fetch --no-tags origin` (jeśli lokalnie jest tag v1.0.1-b1035 → `git tag -d`).
2. Przeczytaj w całości: `origin/koordynator/stan-1-0:docs/przekazanie/notatki/linia-1-1/STAN-koordynator-1-0.md` (stan koordynatora, ostatnie sekcje najważniejsze); z origin/integracja-1-1: CLAUDE.md (różni się od main), `docs/przekazanie/notatki/linia-1-1/STAN-1-1.md`; z origin/main: docs/48 (kolumna „Stan”), docs/zobowiazania.md (Aktywne), docs/fakty-wlasciciela.md. STAN-1-1 przeczytaj też z gałęzi `slownik/faza-pauza-wip` i `acg/fale-napraw` (tam są najnowsze sekcje „Teraz” / „Weryfikacja ACG”).
3. ReadNotifications. Sprawdź sesje poprzedniego konta (get_session): session_01T66VBxtTk5PaUMPE3kVWo7 (A: fale ACG, ACG-007), session_01T66VBwYbswGyfQ4Q56yzhf (B: słownik, średnie UI) — mogą być niedostępne z tego konta; wtedy opieraj się wyłącznie na gałęziach.

## Stan na 31.10 ~22:15 PL (sprawdź u źródła: git ls-remote, tests.yml)
- 1.0: w recenzji Apple (build 1033). Nic nie dodajemy do 1.0. Przypomnienia planu B ZB-022: 03.11 i 05.11.
- `integracja-1-1` = 6b3d23d5.
- `acg/fale-napraw` @ 6330c721 (= da5177b2 + ACG-007 92c1feef + STAN; pełne verify 92c1feef zielone, 15787 testów) — tests.yml dla 6330c721 NIE sprawdzony. Zielony → FF integracji: `git push --no-verify origin 6330c721:refs/heads/integracja-1-1` (wyjątek nazwany: znacznik verify w innym kontenerze, ten sam SHA ma zielony tests.yml) — wpisz wyjątek w STAN-1-1.
- `slownik/faza-pauza-wip` @ aba31409 — wypchnięte z --no-verify, verify NIEDOKOŃCZONE (= słownik faza_pauza, średnie UI 49 tłumaczeń, scalenie fal da5177b2). Najpierw scal do niej `origin/acg/fale-napraw` 6330c721 (dochodzi ACG-007), potem jedno pełne verify → push na `slownik/faza-pauza` → tests.yml → FF integracji.
- ACG-007 (Glute Bridge) ZROBIONE na acg/fale-napraw (92c1feef, recenzja audytora wyswietlana sha 51c837437b08).
- `audyt/cwiczenia-grafiki-p5` @ b16f61c5 (verify zielone) — scalić z `audyt/cwiczenia-grafiki-2026-10-31`.
- DECYZJA WŁAŚCICIELA 31.10.2026 ~22:07 PL: rozmiar docs/18 — wariant A (archiwizacja starszych wpisów do `docs/18-archiwum-do-DD.MM.md`, wzór istniejącego docs/18-archiwum-do-11.10.md; check:decyzje i testy czytają też archiwa; liczba wpisów przed = po, dziś 490; wpisy z wdrożeniem otwarte/odłożone zostają; test przypadku gałęzi długo żyjącej wg L-080). Zapisz w docs/18 + zaktualizuj lekcję o ENOBUFS w docs/40. Zrobić PO scaleniu B do integracji (konflikty w docs/18).

## Kolejka (po kolei)
1. FF fal (6330c721) → scalenie fal do słownika + verify + FF słownika → archiwizacja docs/18 (decyzja A).
2. 17 średnich uwag dla wskazówek spoza ACG-003; 10 pytań do native speakera (docs/lokalizacja/srednie-2026-10-31/); 9 odłożonych.
3. Dalej z STAN koordynatora: recenzje 4 rodzin v2, nazwy EN ZB-025 + ZB-023, K1/K2 ZB-027, przyspieszenie CI ZB-029.

## Sposób pracy
- Max 2 sesje wykonawcze naraz (create_session, source_revision = gałąź startowa, clone_depth 400, permission_mode auto). Każda dostaje samodzielny prompt: pułapki niżej, raporty do Ciebie przez send_message, częste pushe, pełne verify od razu na starcie (znacznik żyje w kontenerze), ustalenia agentów od razu do repo, przed krokiem > 15 min krótki raport ze stanem niewypchniętym.
- Pułapki: core.hooksPath WZGLĘDNIE (`scripts/hooks`); `npm ci` w każdym worktree; pełne verify ~30 min, NODE_OPTIONS=--max-old-space-size=3584, jedno naraz, zatrzymywać po PID; fetch bez tagów; wpis docs/18 wymaga [wdrożenie] i [wykonalność]; dwie gałęzie scalaj tak, żeby nie robić dwóch pełnych verify (najpierw scalenie, potem jedno verify); integrację przesuwa tylko koordynator (FF po zielonym tests.yml); nic na main.
- Swój stan zapisuj na bieżąco w `docs/przekazanie/notatki/linia-1-1/STAN-koordynator-1-0.md` na gałęzi `koordynator/stan-1-0` (push z --no-verify jako wyjątek nazwany, jeśli brak node_modules) — nie tylko w scratchpadzie.
- Odzywaj się do mnie tylko, gdy coś jest po mojej stronie albo zadanie się skończyło. Zacznij od krótkiego raportu (2–4 zdania: co sprawdziłeś u źródła, na co czekamy, co po mojej stronie).
