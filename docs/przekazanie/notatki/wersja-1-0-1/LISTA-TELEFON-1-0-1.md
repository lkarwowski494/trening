# Lista telefonu — build TestFlight 1.0.1 (31.10.2026)

Test buildu 1.0.1 na telefonie — ok. 5 min. Źródło: docs/21, lista kontrolna 1. TestFlight 1.0.1. Ścieżki sprawdzone w kodzie 31.10.2026 (app/(tabs)/more.tsx, app/adapt.tsx, app/more/backup.tsx, app/more/settings.tsx).

Na start: TestFlight → Trening → zainstaluj build 1.0.1 (numer podam po wysyłce).

1. Rysunki ćwiczeń przywrócone w 1.0.1 (2 min)
   Więcej → Ćwiczenia → stuknij „Filtr: podstawowe ćwiczenia”, żeby pokazać wszystkie → w polu wyszukiwania wpisz kolejno:
   „Deadlift”, „Close Grip Bench Press”, „Zercher Squat”, „JM Press” → otwórz ćwiczenie → Technika.
   Sprawdź: rysunek się rusza, ciężar w dłoniach (Zercher — w zgięciach łokci), nic nie przenika przez ławkę ani nogi.
   Wynik: OK albo zrzut ekranu z tym, co wygląda źle.

2. Okno „Dostosuj do miejsca” (2 min; potrzebne 2 miejsca, np. „Pełna siłownia” i „Hotel”)
   Trening → Pusty trening → + Dodaj ćwiczenie → Bench Press (sztanga) → „⋯” (Opcje treningu) → Miejsce treningu → wybierz Hotel.
   Okno otwiera się samo. Sprawdź: tytuł „Dostosuj do miejsca” w całości, pod nim wiersz „Dostosuj do: Hotel” (nieucięty). Stuknij „Anuluj”.
   Wynik: OK albo zrzut.

3. Import CSV — rok przy obu datach (1 min; tylko jeśli masz plik CSV z treningami z 2025 i 2026)
   Więcej → Kopia zapasowa (eksport / import) → Importuj historię z pliku CSV → Wybierz plik CSV.
   W podglądzie „Zakres dat: … – …” obie daty mają rok. Nie stukaj „Importuj” — wyjdź przyciskiem wstecz.
   Bez takiego pliku krok pomiń (E2E sprawdza go na symulatorze).

4. (usunięty 31.10.2026, decyzja właściciela ~08:10) R-101-28 — anulowana subskrypcja → brak ostrzeżenia przy „Kup na zawsze”: brak konta piaskownicy bez planu, krok przechodzi do testu 1.1 (docs/40, rejestr ryzyk).
