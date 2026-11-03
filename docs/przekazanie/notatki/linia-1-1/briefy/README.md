# Briefy zleceń (linia 1.1)

Reguła L-095-A (właściciel 03.11.2026): brief, który zleca pracę na gałęzi `badania/*`, podaje w tym samym wierszu skrót SHA jej głowy z `git log -1 --format=%h origin/badania/<x>`,
np. `origin/badania/g2-mobilnosc@10d8150a` — stan zadań bierzemy z gałęzi, nie z dokumentu planu. Strażnik: `tests/briefy-badania-sha.test.ts`
(zakres: wszystkie `*.md` w tym katalogu; briefy sprzed reguły — wyjątki z powodem w `tests/briefy-badania-wyjatki.json`).
