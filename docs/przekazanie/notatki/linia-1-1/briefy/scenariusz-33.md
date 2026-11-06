# Brief: scenariusz 33 (L-091 akcja 1) — programista, worktree /home/user/wt-s33, gałąź e2e/s33-stare-nazwy (od origin/integracja-1-1)
Najpierw wspólne zasady: docs/przekazanie/notatki/linia-1-1/briefy/programista-wspolny.md (zastąp ścieżkę worktree swoją).
Problem (docs/40 L-091): `.maestro/33-aktualizacja-przygotuj.yaml:17` używa wspólnego `subflows/szablon-testowy.yaml`, który od d2002a32 szuka nowych nazw EN („Dumbbell Bench Press, dumbbells”, linia ~50); 33 biegnie na STAREJ aplikacji (plik wydania v1.0.1-b1035), gdzie nazwa to „Bench Press (Dumbbell)”. 34 pada kaskadowo.
Zadanie:
1. Test najpierw: w Jest odtwórz rozjazd — selektory tekstu w 33 i w podprzepływach, które 33 uruchamia, muszą pasować do nazw z wersji z pliku wydania (nazwy z tagu/commitu v1.0.1-b1035 — `git show <tag>:<plik>` zapisane jako mały fixture albo odczytane w teście; tag pobierz `git fetch origin tag v1.0.1-b1035 --no-tags` jeśli trzeba). Test ma paść na obecnym stanie.
2. Naprawa — wybierz i uzasadnij w raporcie: (a) alternatywa regex „nowa|stara” w selektorach (precedens: 33:25 „Weight unit|Measurement system”), albo (b) osobny podprzepływ ze starymi nazwami tylko dla 33. Wzorzec z precedensu (a) preferowany, jeśli nie psuje innych scenariuszy.
3. L-091: akcja (1) w docs/40 → stan; akcja (2) (usunięcie po następnym pliku wydania) — wpis w docs/zobowiazania.md (Aktywne, ID kolejne wolne, warunek „następne wydanie TestFlight”).
4. Pełne verify z flock -x, push gałęzi. Przebieg dowodowy E2E zleca koordynator (`tylko_scenariusze: "33 34"`); nie uruchamiaj workflowów sam.
Raport: SHA, verify, wybór a/b z powodem.
