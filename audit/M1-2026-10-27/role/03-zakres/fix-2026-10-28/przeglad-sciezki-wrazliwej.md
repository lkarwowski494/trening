# Polecenie przeglądu ścieżki wrażliwej (zakupy) — M1-audytor-generalny-037 część A

Nieodbyty: rola 03 pracowała jako subagent bez narzędzia subagentów. Uruchamia koordynator (nowy subagent, świeży kontekst, bez rozumowania roli 03).

**Wejście dla przeglądającego (tylko to):**
1. `git diff f775eb5c..1a96768a -- components/SubscriptionCard.tsx app/paywall.tsx site/support.html` w kopii roboczej `/home/user/trening/.claude/worktrees/agent-ab9baab932e7ee5e1` (gałąź `worktree-agent-ab9baab932e7ee5e1`).
2. Znalezisko: 02-monetyzacja-002 / 08-programista-005 / 04-studio-projektowe-006 — wiersz „Pełna wersja” w Ustawieniach w stanie darmowym czyta się jak stan, nie jak wejście do zakupu; poprawka: tytuł zależny od stanu („Zobacz plany Pro” bez planu, „Masz plan: {nazwa}” z planem), `planName` przeniesione do `components/SubscriptionCard.tsx`.
3. Zasady wspólne 10–14 (wkleić z promptu roli: zero utraty danych, testy przed kodem, działania zewnętrzne tylko za zgodą, koszty 0 zł, repo publiczne).

**Polecenie:** „Przejrzyj wyłącznie ten diff. Zgłoś tylko P0/P1 (utrata danych, zakup lub przywrócenie zakupu nie do wykonania, błędny stan dostępu, prywatność, sekrety, ryzyko odrzucenia przez Apple) z `plik:linia` i scenariuszem w aplikacji; inaczej napisz „brak uwag”.”

Na co zwrócić uwagę (bez sugerowania wyniku): czy wiersz w każdym stanie (`free`, `full` z planem, `full` bez `active`, plan z Chmury rodzinnej, kod) prowadzi na ekran zakupu z „Przywróć zakupy”; czy re-eksport `planName` z `app/paywall.tsx` nie zmienia zachowania ekranu zakupu.
