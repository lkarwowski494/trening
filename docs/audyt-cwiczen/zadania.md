# Zadania z audytu ćwiczeń i grafik (31.10.2026, partie 1–2)

Grupy bez wspólnych plików, do zlecenia równolegle.

| ID | Znaleziska | Właściciel (Mapa sesji) | Pliki | Kryterium ukończenia | Czas agenta | Zależności | Kolejność |
|---|---|---|---|---|---|---|---|
| ACG-T-001 | — (D-1 a) | koordynator przeglądów 1.1 → audytor niezależny | `docs/research/figury-recenzja.json` (wpisy v2 squat, bench_press, hinge) | arkusze ze śladem dla 25 zmienionych (lista w `lista.md`) + 62 potwierdzone odciskiem; nowe skróty; `tests/figury-recenzja.test.tsx` zielony, `lib/figures/data.json` `v2` = 3 rodziny | 2–3 h | ACG-T-002 najlepiej przed (żeby skrót objął pełny zestaw plików) | 2 |
| ACG-T-002 | ACG-002 | programista (1.1) | `scripts/zrodla-runtime.mjs`, `scripts/strona/recenzja-figur.mjs`, nowy test w `tests/` | test liczy domknięcie importów figury i czerwieni się przy pliku spoza skrótu (czerwony przed, zielony po); parytet aplikacja–strona zachowany | 1–2 h | — | 1 |
| ACG-T-003 | ACG-001, ACG-004 | badacz (treść) + programista (dane) | `lib/figures/v2/cue-sets.json` (pull_up), `data/zrodla/cues-zestawy.json`, `lib/cues/text/pl.json`/`en.json`, `docs/research/rejestr-twierdzen.json` | test: w rodzinie pull_up żaden zestaw nie zawiera `lpd.*` ani zdań o „uchwytach” przy drążku (czerwony przed); recenzja treści zestawów pull_up (autor ≠ recenzent) | 1–2 h | — | 1 |
| ACG-T-004 | — | koordynator przeglądów 1.1 → audytor niezależny | `docs/research/figury-recenzja.json` (wpis v2 pull_up), `docs/research/figury-recenzja.json` „zestawy” | pierwsza recenzja ruchu pull_up (11 figur, arkusz ze śladem, L-050) + recenzja zestawów; pull_up w `lib/figures/data.json` `v2` | 2 h | ACG-T-003, ACG-T-005 | 3 |
| ACG-T-005 | ACG-005 | programista figur | `lib/figures/v2/poses/pull_up.json` (Side To Side Chins) albo oznaczenie „uproszczenie” w BRD | test geometrii: przesunięcie w obie strony w jednej pętli (albo wpis uproszczenia z testem) | 1 h | — | 1 |
| ACG-T-006 | ACG-003 | tłumacz → recenzent lokalizacji | `lib/cues/text/<33 języki>.json` (52 id) | strażnik: wszystkie zdania ćwiczeń z celu 1.1 w 35 językach (czerwony przed); recenzja lokalizacji | 2–3 h | D-2 | 1 |
| ACG-T-007 | L-C, L-D | programista (1.1) | `lib/figures/v2/cueSets.ts` (`cueTextGaps`), `tests/` | strażnik języków dla celu wydania; test „ready ⇒ wpis v2 albo jawne oczekiwanie” | 1 h | — | 1 |
| ACG-T-008 | OP-1, OP-2, OP-3 | badacz | `docs/research/` (notatka) | 2 źródła szczebla 4 na ćwiczenie, wynik wpisany do rejestru; ewentualna poprawka → nowe zadanie | 1–2 h | — | 1 |
| ACG-T-009 | — | następna sesja audytu | `docs/audyt-cwiczen/` | partie 3–5 (`STAN.md`) | 6–10 h | — | 4 |
