# Recenzja niezależna hip_bridge — partia 2, runda r2 (audytor, 09.11.2026)

Stan: `figury/partia-2` @ 8b4f6cab, różnica `2cff6e31..8b4f6cab` (poprawki programisty innego niż autor rodziny). Worktree odłączony, arkusze własne.

**Werdykt rodziny: wyswietlana** (9 ćwiczeń); Machine Hip Thrust wstrzymany (`V2_WSTRZYMANE`, `lib/figures/v2/figure.ts`) do poprawki danych i ponownego śladu dźwigni po `figury/slad-dzwignia`.

- **Rysunek**: pozy bez zmian (`git diff ddb6cbae 8b4f6cab -- lib/figures/v2/poses/` pusty); arkusze `arkusz-slad.mjs` 10/10 bajtowo równe r1 (HTML i PNG, `cmp`).
- **Skrót** (`zrodla-runtime --skroty`, policzony samodzielnie): v2 hip_bridge `0d9b2af823b2` (zgodny z autorem; zmiana z `76ab2ca8939b` tylko przez wstrzymanie). Skróty kart i zestawów bez zmian względem r1.
- **K14 (każda zmiana testów)**: `figures-v2-data.test.tsx` — `spineMid` w punktach miary, 7 wyjątków `ht.mis.arch` usunięte: zaostrzenie, OK. Zapadki listy wstrzymanych w 4 testach (+Machine Hip Thrust) i cele pokrycia −1 (`figura.v2`, `figura.wAplikacji`, `animowanyBlad`, `wskazowki.zTekstem`, `czesteBledyTekst`, `pelnaKarta`, `recenzjaFigur`; `figura.zDanymiV2` bez zmian) — skutek wstrzymania jednego ćwiczenia, nie poluzowanie. NISKIE: przypadek negatywny w `figures-v2-hip-bridge-r1.test.ts` porównuje pozę samą ze sobą (miara 0) — nie odtwarza danych sprzed poprawki.
- **Test czerwony na 8b4f6cab** (pewność 100%, uruchomiony `jest --runInBand`): `tests/strona-eksport.test.ts:165` oczekuje `n = 193`, jest 192 — zapadka eksportu nie przeliczona po wstrzymaniu (Machine Hip Thrust wypada z figur; `figureSpec` w teście pomija `V2_WSTRZYMANE`, `:34`). Do poprawy przed scaleniem (193 → 192). Drugi czerwony w tym pliku (`pelna` ≠ `policz()`) — mechanizm z r1: zniknie po wpisie v2 recenzji i odświeżeniu `lib/figures/data.json`.
- Otwarte z r1 (backlog, nie blokują): ŚREDNIE Frog Pump, NISKIE Single Leg Glute Bridge, NISKIE gryf −1,6 cm. Komentarz `overlay/hip_bridge.ts:7` poprawiony zgodnie z r1.
- Plik wpisów: `docs/research/recenzje/partia2-hip_bridge-r2.json` (Machine Hip Thrust — zestaw „do poprawy”: nie wyświetlany przy wstrzymanej figurze; v1 Glute Bridge, Hip Thrust (sztanga), Hip Thrust (hantel) → zastapiona).
