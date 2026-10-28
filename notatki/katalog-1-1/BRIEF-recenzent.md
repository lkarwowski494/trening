# Niezależna ponowna recenzja ruchu i treści karty (bramka 4 + audyt treści, reguła CLAUDE.md z 27.10.2026)

Najpierw przeczytaj /home/user/wt/BRIEF-wspolny.md (pkt 1, 5, 7, 9). Jesteś NIEZALEŻNYM recenzentem: oceniasz rysunek i kartę ćwiczenia tak, jak zobaczy je użytkownik. Nie poprawiasz póz ani kodu.

## Czego NIE czytasz (niezależność)
- opisów poprawek i uzasadnień: README.md w katalogach podglądów, komunikatów commitów gałęzi poprawek, komentarzy w generatorach `scripts/figures/agent-pozy/*.mjs`, linii stanu agentów w docs/przekazanie/README.md, plików docs/54 i podobnych notatek generatora.

## Co czytasz
- Podglądy: `docs/przekazanie/notatki/podglady-1-1/<katalog>/` na `origin/przekazanie-konta` (PNG, `katy-stawow.md`, `manifest.json`, znacznik `PODGLAD-WAZNY.txt`). Pobieraj przez `git -C /home/user/trening show origin/przekazanie-konta:<ścieżka> > /tmp/claude-0/<twoj-katalog>/...` i oglądaj PNG narzędziem Read (pełna rozdzielczość; w razie potrzeby kadruj `convert -crop`). Podgląd bez znacznika ważności lub tabeli kątów → nie recenzujesz go, zgłaszasz brak.
- Metoda: `docs/przekazanie/notatki/53-grafiki-model-pracy.md` (lista kontrolna bramki 4, kroki 1–7) i `docs/przekazanie/notatki/pilotaz/recenzja-n6.md` (oba na origin/przekazanie-konta).
- Pierwotna recenzja rodziny: `docs/przekazanie/notatki/recenzje-1-1/<rodzina>.md` — sprawdź, czy KAŻDE wcześniejsze znalezisko BŁĄD/OK z uwagą zostało usunięte na obrazie i w liczbach, ale oceniaj też od nowa (nowe błędy, regresje).
- Treść karty ćwiczenia z gałęzi z poprawkami (tylko odczyt, przez `git -C /home/user/trening show origin/<gałąź>:<plik>` albo własny worktree odłączony: `git -C /home/user/trening worktree add --detach /home/user/wt/rec-<nazwa> origin/<gałąź>`): opis, wskazówki techniki (data/zrodla/cues.json i pliki katalogu ćwiczeń — znajdź grepem po nazwie), mięśnie/role mięśni, kąty, tempo, wiersze błędów. Możesz wyrenderować dodatkowe widoki istniejących póz skryptem z repo (np. `htmlPodgladu` z `scripts/figures/v2-validate.mjs`), ale NIE przez `agent-pozy/run.mjs --podglad` (generuje pozy od nowa).

## Dla każdego ćwiczenia oceń
A. Ruch (bramka 4): cecha rozpoznawcza zachowana; wskazówki widoczne na obrazie; wiersz błędu różni się od poprawnej tylko tym błędem i jest widoczny w klatce; tabela kątów zgodna z opisem (uwaga: noga „prosta” w tym rigu to ok. 10–18°); sprzęt, podparcia, styk z podłożem, strona ciała, kierunek patrzenia.
B. Treść karty: czy wskazówki, mięśnie, tempo, kąty i wiersze błędów zgadzają się z rysunkiem i ze sobą; czy tekst brzmi naturalnie (jak trener/kolega na siłowni), bez nazw źródeł i marek; czy twierdzenie liczbowe/zdrowotne ma wpis w `docs/research/rejestr-twierdzen.json` (sprawdź grepem; nie rób researchu źródeł — brak wpisu = znalezisko).
Werdykt na ćwiczenie: OK / OK z uwagą / BŁĄD (z opisem: klatka, staw, liczba, co powinno być). Ocena realności i wagi (KRYTYCZNE/WYSOKIE/ŚREDNIE/NISKIE wg CLAUDE.md). Przy BŁĘDZIE: czy któraś reguła automatyczna powinna go była złapać (szczelność reguł).

## Wynik
Plik `recenzje-1-1/ponowne/<nazwa>.md` (tabela: ćwiczenie | ruch | treść | werdykt | szczegóły; na górze podsumowanie i liczby) — wypchnij przez `/home/user/wt/zapisz-stan.sh "(recenzent <nazwa>) …" <plik> docs/przekazanie/notatki/recenzje-1-1/ponowne/<nazwa>.md`. Raport do koordynatora: liczby OK/uwaga/BŁĄD, lista BŁĘDÓW z wagą, rodziny gotowe do statusu „zatwierdzona”.

## Obowiązek renderu wszystkich klatek (koordynator 27.10.2026 ~12:20 UTC, lekcja podglad-klatki — wariant B)
Recenzent ZAWSZE sam renderuje wszystkie klatki ruchu (`htmlPodgladu` z `scripts/figures/v2-validate.mjs` albo `frameAt` na ≥ 12–21 klatkach, każdy pokazywany widok, także wiersze błędów) z póz zapisanych na gałęzi — niezależnie od PNG w katalogu podglądu. PNG z katalogu służy tylko do orientacji. W wyniku zapisz: „render własny: N klatek × widoki”.
