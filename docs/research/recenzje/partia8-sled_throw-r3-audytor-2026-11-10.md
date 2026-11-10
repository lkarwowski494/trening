# Partia 8 — sled_throw, recenzja niezależna r3 różnicy scalenia (audytor, 10.11.2026)

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusz ze śladem toru). Stan: e005c411 (scalenie gałęzi sled_throw/strongman 58232ce7 z core_standing), odłączony worktree recenzenta; różnica względem r2 (58232ce7). Recenzent nie pisał rodziny, scalenia ani zmian core_standing.

**Werdykt sled_throw: wyświetlana** (0 × KRYTYCZNE/WYSOKIE/ŚREDNIE). **Strongman: wpisy r1 obowiązują** (skrót v2 bez zmian, 04b91430146d).

## Zakres różnicy w lib/figures/v2/
- `poses/sled_throw.json`, `overlay/sled_throw.ts`, karty i zestawy — bez zmian.
- `contract.ts` (gałąź „ciężar w dłoniach”): piłka lekarska — ślad = środek piłki (props `ball`), dodano landmine. Jedyna zmiana wpływająca na rysunek sled_throw.
- `gear.ts` (środek sztangi w z przy `podazaZaChwytem`) i `draw.ts` (gryf wokół o[0]) — dotyczą tylko sztangi; żadne ćwiczenie sled_throw nie ma sztangi (sprzęt: podłoga, piłka lekarska, ściana, sanie, pas). Bez wpływu.
- `overlay.ts` (`d.side` w prowadnicy równoległej) — nakładka sled_throw nie używa `parallel` ani `side`. Bez wpływu.

## Ślad piłki — pomiar (frameAt, u co 0,01) i arkusze
Arkusze `arkusz-slad.mjs` wygenerowane samodzielnie dla 6 ćwiczeń z piłką, każdy widok (7 arkuszy: 6 × side + Wall Ball front), PNG 2100 px obejrzane w pełnej rozdzielczości: ślad przechodzi przez środek piłki w każdym kadrze, piłka w dłoniach, bez przenikania.
- Ślad − środek piłki: 0,00 cm we wszystkich 6 ćwiczeniach; piłka obecna w każdej klatce.
- Środek piłki − chwyt: oburącz 11,0 cm (= promień, dłonie na powierzchni), One-Arm 10,0 cm (piłka na dłoni, przesunięcie r − 1).
- Ślad − środek chwytów: oburącz ≤ 0,2 cm (ślad praktycznie bez zmian względem r2); One-Arm — ślad przeniesiony z chwytu R na środek piłki (10 cm wyżej, stałe przesunięcie).
- Najniższy punkt piłki nad podłogą ≥ 20,2 cm; `checkFrame`: 0 kolizji.
- Kształt toru (miara figures-v2-tor, 25 próbek, side): Slam 43,0/1, One-Arm 43,0/1, Standing Two-Arm 23,5/0, Backward 66,8/1, Scoop 12,2/1, Wall Ball 15,8/2 — **wszystkie zgodne z `tests/tor-wyjatki.json`** (przesunięcie One-Arm jest translacją, kształt się nie zmienia).
- Wall Ball front: piłka zasłania twarz w u ≈ 0,65–0,8 (piłka przed twarzą w rzucie z przodu) — zgodne z ruchem, nie przenikanie (ten sam stan co r1/r2).

## K14 — testy
- `tests/figures-v2-sled-throw-tor.test.ts`: było „ślad ≤ 3 cm od chwytu”; jest „piłka w każdej klatce”, „ślad ≤ 3 cm od środka piłki” i „środek piłki ≤ promień + 3 cm od chwytu (dłoni trzymającej)”. Zgodne z kontraktem (contract.ts: ślad piłki lekarskiej = środek piłki; gear.ts: dłonie na powierzchni piłki, promień ± 3 cm). To nie poluzowanie: test nadal wiąże piłkę z dłonią (zmierzone 10–11 cm przy progu 14 cm) i dodaje warunek obecności piłki. Przypadek negatywny (miednica > 9 cm od dłoni) bez zmian.
- `tests/gemini-polecenia.test.ts`: test limitu polecenia dostaje fixture z core_standing oznaczoną „do zrobienia” (po scaleniu rodzina jest gotowa i nie miałaby polecenia) — zachowuje stan wejściowy testu; asercje (POMINIĘTE + UWAGA, limit 30000) bez zmian. Nie poluzowanie.
- Testy uruchomione (--runInBand): figures-v2-tor, figures-v2-sled-throw-tor, figures-v2-sled-throw, gemini-polecenia — 276/276 zielone.

## Stan z r2
- N1 (`slam_plecy` bez mapowania hinge.back) — bez zmian, w backlogu (pytanie do badacza w nagłówku overlay/sled_throw.ts); nie blokuje.
- P8-ST-1 (Wall Ball, głębokość dna) — w docs/21, bez zmian.

## Skróty (`node scripts/zrodla-runtime.mjs --skroty`, policzone samodzielnie na e005c411)
v2 sled_throw e936d3d6c19d → **dade4388eeaa** (zmiana wynika z contract.ts; potwierdzona powyżej). Bez zmian względem r2: v2 strongman 04b91430146d; karty Medicine Ball Slam cbe93cfddf5e, Standing Two-Arm Overhead Throw 85de3b2b60b3, Backward Medicine Ball Throw 871996234a76, Wall Ball 6f2a286d08b6, Sled Push ef9ee9fdcec0; zestawy One-Arm Medicine Ball Slam ad4e223d4754, Medicine Ball Scoop Throw 12ca0a03ffbe, Sled Drag (Harness) 6fc414841b18. `assignAll()`: sled_throw 19.
