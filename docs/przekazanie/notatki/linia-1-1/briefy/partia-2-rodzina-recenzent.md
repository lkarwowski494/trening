# Brief: recenzent niezależny rodziny — partia 2 (linia 1.1), 09.11.2026

Jesteś audytorem (bramka 4, L-047: autor ≠ recenzent; L-050: arkusz ze śladem toru ciężaru). Nie pisałeś tej rodziny i niczego w niej nie poprawiasz — zwracasz znaleziska i werdykty.

## Przygotowanie (stan zamrożony)
`git -C /home/user/trening worktree add --detach <scratchpad>/wt-rec-<rodzina> <SHA>` i pracuj TYLKO tam (`ln -s /home/user/trening/node_modules <wt>/node_modules`). SHA podaje lead. Na końcu `git worktree remove --force`.
Przeczytaj: `CLAUDE.md` (bramka 4, hierarchia źródeł, próg wydania, ocena realności), `docs/przekazanie/notatki/linia-1-1/plan-recenzji-rodzin-v2.md` pkt 3 (K4–K15), wzór raportów: `git show origin/figury/delt_raise:docs/research/recenzje/delt-raise-nakladka-audytor-2026-11-09.md` i `...:delt-raise-zestawy-audytor-2026-11-09.md`, `...:delt-raise-karty-v2-r1.json`.

## Zakres (jedna rodzina, wszystkie ćwiczenia z rysunkiem v2)
1. **Ruch (K4–K8)**: arkusze `node scripts/figures/arkusz-slad.mjs --out <scratchpad>/rec-<rodzina> --key ...` — wygeneruj SAM (nie ufaj arkuszom autora), każde ćwiczenie w każdym widoku, oglądaj PNG w pełnej rozdzielczości (Read). Ślad toru: ciężar/przyrząd; bez ciężaru — miednica (mobilność: ślad tylko tam, gdzie jest ciężar/przyrząd). Liczby z `frameAt` (zakres stawów vs tekst karty/zestawu, styki ≤ 1 cm, orientacja sprzętu, ślad ≤ 3 cm od chwytu). Porównaj z opisem ruchu w źródłach reguł (`data/zrodla/figury-sens.json`, sekcja rodziny) i z kartą/zestawem.
2. **Nakładka techniki** (`lib/figures/v2/overlay/<rodzina>.ts`): tylko reguły „ustalone”, cue = wskazówki obecne na karcie, element tylko w rzucie, w którym ma sens; `node scripts/figures/arkusz-nakladka.mjs` jeśli pomocne.
3. **Zestawy ogólne** przy ćwiczeniach rodziny (`cue-sets.json`, wzorzec `general`): czy każde zdanie zestawu pasuje do ruchu na rysunku (K12).
4. **Karty własne** ćwiczeń rodziny (`own`): treść karty wobec rysunku v2 (K11); wpisy v1 → „zastapiona” (K10).
5. **Testy (K14)**: `git diff origin/integracja-1-1..<SHA> -- tests/` — oceń każde poluzowanie.
6. Skróty: `node scripts/zrodla-runtime.mjs --skroty` w Twoim worktree — wpisz wartości do własnego pliku (nigdy z pamięci, nigdy od autora).

Klasyfikacja: KRYTYCZNE/WYSOKIE (blokują: błędny ruch, ruch sprzeczny z kartą, ciężar w złym miejscu, przenikanie, błędne liczby) / ŚREDNIE / NISKIE; przy każdym — kroki do zobaczenia, ocena realności, miara liczbowa (żeby autor mógł zrobić test odtwarzający).

## Wynik (zapisz w worktree głównym /home/user/trening, NIE commituj — commit robi przepisujący)
- `docs/research/recenzje/partia2-<rodzina>-r<N>-audytor-2026-11-09.md` — raport (krótko, cytaty ze źródeł ≤ 2 zdania).
- `docs/research/recenzje/partia2-<rodzina>-r<N>.json` — wpisy do przeniesienia 1:1: `{"v2": {"<rodzina>": {...}}, "zestawy": {"<ćw>": {...}}, "karty": {"<ćw>": {...}}, "v1_zastapiona": ["<ćw>", ...]}`; pola jak w `docs/research/figury-recenzja.json` (werdykt `wyswietlana`/`do poprawy`, data, stan, autor, recenzent, kto, sha, uwagi; v2 dodatkowo `liczba` = liczba z `assignAll()` (K9) i `slad` — opis arkuszy ze śladem, wymagane przez tests/figures-v2-tor.test.ts; sprawdź format pola w istniejących wpisach v2). `autor` ≠ `recenzent`.
Raport do leada (≤ 30 linii): werdykt rodziny, lista znalezisk z klasą, pliki.
