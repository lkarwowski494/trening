Polecenie dla roli `recenzent-lokalizacji` (nieodbyte w sesji 02-monetyzacja fix p2 — sesja działała jako subagent bez narzędzia do uruchamiania subagentów; tłumaczenia wykonała sama sesja według `.claude/agents/tlumacz.md`).

Repo: kopia robocza 02-monetyzacja p2 (commit z treścią „[M1-audytor-generalny-010; 02-monetyzacja-001, 02-monetyzacja-504]”), baza naprawy/M2-koordynator-napraw-2026-10-27-p2 (82f6310).

Przejrzyj nowe teksty UI we wszystkich słownikach `lib/locales/*.json` (32 pliki; nakładka pt-BR ma tylko pierwszy klucz, es-419 żadnego — tekst jak w es):
1. „Masz plan: {name}” (EN „Your plan: {name}”) — nagłówek karty stanu na ekranie zakupu „Pełna wersja”, gdy osoba ma aktywny plan; {name} to nazwa planu (EN: „Training is part of my week”, „Still finding my rhythm”, „Training is my life”).
2. „Przejdź na ten plan” (EN „Switch to this plan”) — główny przycisk po rozwinięciu „Zmień plan”, kupuje inną subskrypcję zamiast posiadanej (Apple pokazuje arkusz zmiany planu). Musi brzmieć inaczej niż „Zmień plan” w danym języku (przełącznik listy).

Sprawdź: naturalność (tak powiedziałaby aplikacja albo kolega w tym języku), spójność z istniejącymi „Zmień plan”, „Aktualny plan”, „Subskrybuj”, „Kup na zawsze” (ten sam termin planu: plan/formule/abonnement/pakett/tilaus/csomag/paket/요금제/gói/方案), formę grzecznościową jak w „Masz pełną wersję” danego słownika, typografię (fr: spacja nierozdzielająca przed „:”; zh: „：”), długość przy 320 pt.
Wynik: lista poprawek (plik, klucz, obecnie, proponowane, powód) albo „brak uwag”; nie poprawiaj sam. Poprawki nanosi koordynator albo sesja 02 przed scaleniem.
