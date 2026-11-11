# Sesja V: W-10 pełny głęboki audyt całości (kandydat 1.1) — Trening
Koordynator: <ID z wiadomości startowej> (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID; przy wiadomości o zmianie koordynatora pisz do nowego). Gałąź stanu: `koordynacja` (tylko do odczytu).

1. Rola: 07-jakosc w trybie audit (prompt po linii `=== PROMPT ROLI ===` w pierwszej wiadomości; przeczytaj w całości). Biblioteki prompts nie dołączasz. CLAUDE.md ma pierwszeństwo (sekcja „Audyty i wydania”: próg KRYTYCZNE/WYSOKIE, ocena realności, jeden audyt bez pętli; bramka 4 figur i kart).
2. Start: gałąź `audyt/w10-1-1` od `integracja-1-1` @ <SHA z wiadomości startowej> (inny HEAD: zgłoś). `npm ci`. Tożsamość commitów wg CLAUDE.md. Audyt czyta kod; zmienia tylko dokumenty audytu.
3. Kontekst: właściciel 11.11.2026 ~18:45 UTC wybrał wariant A — audyt startuje teraz, równolegle z sesją U (KO-047, wersja 1.1.0, „Co nowego” na `wyd/w08-1-1`). Zmiany U obejrzysz na końcu jako różnicę (krok 4.4), bez drugiego audytu.
4. Zadania (docs/49 W-10, ZB-043; kryterium „gotowe” przy każdym):
   1. Plan audytu: obszary (dane i migracje z testem zapisu b1033, kopia/import, prywatność, bezpieczeństwo i sekrety, dostępność, liczby i twierdzenia merytoryczne, ekrany i przepływy, zegarek, Zdrowie, zakupy, ryzyko odrzucenia przez Apple, figury v2 i karty — bramka 4, lokalizacja po W-03) z podziałem na subagentów niezależnych (soczewki bez wglądu w siebie). Gotowe: plik planu w `docs/audyt-1-1/plan.md`.
   2. Znaleziska: każde z krokami w aplikacji, oceną realności (realny/brzegowy/teoretyczny), wagą (KRYTYCZNE/WYSOKIE/ŚREDNIE/NISKIE) i dowodem (plik:linia, test, zrzut). Gotowe: `docs/audyt-1-1/znaleziska.md` + JSON, jeśli repo ma format (sprawdź poprzednie audyty w docs/).
   3. Weryfikacja: każde KRYTYCZNE i WYSOKIE sprawdzone przez drugiego, niezależnego subagenta (potwierdzone / odrzucone z powodem).
   4. Na końcu: różnica `integracja-1-1`@start..`origin/wyd/w08-1-1` (KO-047, 1.1.0, „Co nowego”) przejrzana tym samym progiem; wynik dopisany.
   5. Push dokumentów (verify:docs); lista KRYTYCZNYCH/WYSOKICH do napraw (W-11) w raporcie do koordynatora; ŚREDNIE/NISKIE do backlogu z wersją (docs/21) przez koordynatora.
5. Zakazy: nie naprawiasz kodu (naprawy W-11 zleca koordynator innej sesji), nie scalasz, nie tworzysz i nie archiwizujesz sesji, nie piszesz na `koordynacja`, nigdy --no-verify ani force-push, bez AskUserQuestion. STOP-y roli → raport do koordynatora.
6. Kontekst i koszt: audyt jest duży — rozkładaj go na subagentów, w kontekście trzymaj tylko podsumowania. Od 30% okna kończysz krok, stan w `docs/audyt-1-1/STAN.md`, push, PRZEKAZANIE (następca dokończy od pliku). Pułap sesji 40 USD, próg STOP 52 USD.
7. Raporty (≤ 10 linii, send_message): po planie (obszary, szacunek czasu); PYTANIE z opcjami i rekomendacją; PRZEKAZANIE/KONIEC: SHA, liczby znalezisk wg wagi, lista KRYTYCZNYCH/WYSOKICH z jednym zdaniem każde.
