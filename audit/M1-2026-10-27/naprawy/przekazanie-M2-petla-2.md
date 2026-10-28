# Przekazanie do M2 — naprawy, pętla 2 (od koordynatora M2 pętli 1, 28.10.2026)

Właściciel 28.10.2026: „1. Zgodnie z rekomendacją” (lekcje L-047 i L-048 w docs/40 — opcja A), potem „Stop. Przekaż to do M2 naprawy pętla 2”. Wdrożenie przerwane przed pierwszym commitem (nic nie wypchnięto); wykonać w pętli 2, razem ze znaleziskami ponownego audytu M1.

## Zadania
1. **L-047 A — recenzja niezależna obowiązkowa** (figury, karty ćwiczeń, teksty merytoryczne): strażnik testowy na docs/research/figury-recenzja.json — wpis z werdyktem „wyswietlana” i `data` ≥ 2026-10-28 musi mieć `stan` „zrecenzowana niezależnie…” oraz jawne pola `autor` ≠ `recenzent` (uzupełnić w wpisach z 28.10 na podstawie pola `kto`); „do recenzji niezależnej” przy „wyswietlana” = błąd. Jedno zdanie w CLAUDE.md (sekcja „Animacje i karty ćwiczeń — audyt dogłębny”): wykonawca poprawki nie recenzuje własnej pracy — koordynator zleca recenzję innemu agentowi przed statusem „naprawione” (figury, karty, teksty z rejestru twierdzeń); strażnik: <nazwa testu> (L-047, właściciel 28.10.2026). W L-047 akcja 3 → „opcja A wybrana 28.10.2026 — zrobione (commit)”.
2. **L-048 A — `npm run check:slowniki`**: jedna lista strażników jakości słowników (matrix-i18n, i18n-wave*, i18n-variants, A11N-03 fr z audit-k1-bl-mer — wydzielić do szybkiego pliku albo `-t`, skroty-przekladu, slownik-terminow, i18n-locales, audit-m1-029-kropka-srodkowa, units-label, check:i18n), `--maxWorkers=1`; `check:pochodne` uruchamia go warunkowo, gdy wypychane zmiany dotykają lib/locales/, lib/cues/text/, lib/i18n.en.ts, store/, docs/lokalizacja/. Zmierzyć czas. W L-048 akcja 2 → „opcja A wybrana 28.10.2026 — zrobione (commit)”.
3. Wpis decyzji w docs/18 (28.10.2026, właściciel: L-047 A, L-048 A) z polami [wdrożenie: kod] [test: …], test z datą 28.10.2026.

## Kontekst
- Pkt 2 odpowiedzi właściciela („ok”): eksport figur strony (9a) zostaje na gałęzi naprawy/M2-po-decyzjach-eksport-figur (od integracja-1-1) do scalenia z linią 1.1.
- Pkt 3 („wieczorem”): kroki na telefonie — przypomnienie dla sesji koordynatora M2 pętli 1 na 28.10.2026 18:00 (Warszawa).
- main = 2385e75 (PR #79); ponowny audyt M1 w sesji session_01T66VBwCYNzrLzzcMFyJkDR.
