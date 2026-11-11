# Recenzja niezależna kb_ballistic r5 (MER-01) — 11.11.2026

- data: 2026-11-11
- rodzina: v2 `kb_ballistic` (16 ćwiczeń z rysunkiem; liczba assignAll 17 bez zmian względem r4)
- sha recenzowany: commit c2ba7123 (baza a280bd37); skrót rodziny a271df03d983 (było 97edf91fc18d, r4)
- autor: programista (sesja X)
- recenzent: audytor (czyste kopie: `git worktree` c2ba7123 w /home/user/rev-mer01, a280bd37 w /home/user/rev-base; usunięte po recenzji)
- werdykt: **wyswietlana**

## Znaleziska

Brak znalezisk KRYTYCZNE/WYSOKIE/ŚREDNIE/NISKIE z pewnością > 80%.

Otwarte [DO USTALENIA] (nie znalezisko): odtwarzacz strony (`assets/figura-strona.js` w osobnym repo techniqueatlas, docs/18 05.11.2026) — w tym repo nie ma kodu, który
renderuje licznik faz na stronie; dostęp do repo strony w tej sesji zablokowany (HTTP 403). Nie sprawdzono, czy strona czyta `untimed` per faza, czy tylko przy jednej fazie
(pętla jednokierunkowa, marsz). Najgorszy przypadek: strona dalej pokazuje „Podnoszenie 1 s” dla wahadeł (stan sprzed poprawki, `ms` zostaje w eksporcie) — brak regresji,
ale MER-01 na stronie niewdrożone. Do sprawdzenia w repo strony przed przepięciem PIN.json.

## Dowody

1. Ruch identyczny — skrypt w scratchpadzie (`ruch.mjs`, ts-loader repo), dla 16 ćwiczeń: frameAt + shapesAt (z mięśniami) + contactShapes + guideShapes + overlayShapes,
   u = 0..1 co 1/48, każdy widok (wszystkie `side`), poza poprawna i każdy błąd z doboru (2 błędy danych: KB Sumo High Pull, One-Arm KB Swings — bez tempa), trailFor, loopOf/loopSpan/staticPositions/boxFor;
   przebieg czasu uAt/oneWayAt co 33 ms przez 8 s; phaseIndexAt co 33 ms. md5 przed = po dla 16/16 ćwiczeń (ruch, czas, indeks fazy); md5 zbiorczy obu: c6fc60185ef9cc5939d9fe1282196030.
2. Licznik — phasesFor: 7 wahadeł `[Podnoszenie untimed, Pauza, Opuszczanie untimed, Pauza]`, ms bez zmian (1000/500/2000/500); 9 jednokierunkowych: identyczne jak w bazie
   (`[Podnoszenie, untimed]`). Render komponentu (tymczasowy test Jest w kopii, usunięty; bramka otwarta jak tests/figure-gate-open.ts): 7/7 licznik „Podnoszenie · | Pauza · | Opuszczanie”,
   bez cyfr i „ s”; EN „Lifting · | Pause · | Lowering”; podświetlenie (semibold) w 40 próbkach co 99 ms = „Podnoszenie”, gdy u rośnie, „Opuszczanie”, gdy u maleje — 7/7;
   negatyw Bench Press: „Opuszczanie 2 s · | Pauza · | Wypychanie 1 s”; Clean Pull / Snatch Pull: phasesFor z ms 1000/2000 bez `untimed`. Wynik: 11/11 zielone.
   `components/ExerciseFigureV2.tsx:122` — gałąź `p.untimed ? t(p.name)`; etykieta VoiceOver obrazu (:85–89) nie zawiera faz ani sekund.
3. Eksport — `scripts/strona/eksport.mjs:136` przenosi `untimed` per faza; tests/strona-eksport.test.ts + tests/figures-v2-kb-ballistic-p1.test.ts na c2ba7123: 156/156 zielone.
   Odtwarzacz strony: [DO USTALENIA] (wyżej).
4. Skróty — `node scripts/zrodla-runtime.mjs --skroty` w obu kopiach: v2.kb_ballistic 97edf91fc18d → a271df03d983; v1 71/71, v2 39/40 pozostałe, karty 311/311, zestawy 339/339 bez zmian.
   `lib/figures/data.json` na c2ba7123 zdejmuje kb_ballistic z listy `v2` (bramka 4 fail-closed do wpisu tej recenzji) — oczekiwane.
5. Merytorycznie — brak sekund usuwa liczbę, nie dodaje twierdzenia (nazwy faz „Podnoszenie/Opuszczanie/Pauza” są już w rejestrze/słowniku). T-059 (`docs/research/rejestr-twierdzen.json`) zawężony
   do ruchów niebalistycznych — zgodny z kodem; `node scripts/claims.mjs --check`: rejestr zgodny. BRD (`docs/brd/wymagania.md`, „Wahadło balistyczne bez sekund”) zgodny z kodem;
   `node scripts/kontrola-brd.mjs docs/brd`: 0 błędów; `node scripts/decyzje.mjs --check`: zielone (wpis docs/18 z testem z datą 11.11.2026).
   Uwaga (bez znaleziska): animacja nadal biegnie 1 s w górę / 2 s w dół (TEMPO) — liczby nie są pokazywane, więc nie są twierdzeniem; tempo ilustracyjne jak dotąd.

## slad

Ruch, tor ciężaru (trailFor) i przebieg czasu animacji bez zmian (md5 16/16 równe, u co 1/48) — arkusze śladu toru z r4 (arkusz-slad 16 ćw. side, kadry co 1/48, arkusz-nakladka --family) pozostają aktualne; nowych arkuszy nie generowano.

## Dopisek autora (programista, sesja X) — po recenzji

Commit c2ba7123 został przed wypchnięciem poprawiony (a1d4b1ae): oznaczenie `untimed` przeniesione z `phasesFor` (`figure.ts`, limit rozmiaru pliku 20 KB, `tests/architecture-limits.test.ts`) do opcjonalnego parametru `phasesOf` (`anim.ts`). Skrót wyniku rysunku rodziny po tej zmianie: a271df03d983 — identyczny z recenzowanym (skrót liczy fazy, przebieg czasu i kształty klatek każdego ćwiczenia; `scripts/skrot-v2-wynik.mjs`), więc wynik recenzji obejmuje stan a1d4b1ae. Wpis poniżej przepisany 1:1 z raportu recenzenta.
