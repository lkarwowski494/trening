# STAN — fala W2, grupa G2 mobilność (02.11.2026)

Koordynator G2 fali W2 (sesja badań). Gałąź `badania/w2-mobilnosc` od `integracja-1-1` (2dc54e2). Tylko dane badań — bez zmian w kodzie,
`data/zrodla/*.json`, `lib/**` i testach. Integruje koordynator linii 1.1. Stan wejściowy: gałąź `badania/g2-mobilnosc`, plik
`docs/research/wskazowki-fala-w1/przeliczenie-2026-11-02.md` (ma pierwszeństwo przed resztą W1).

## Zakres i metoda

- Rodziny (`assignAll()`, bez zmian względem W1): mobility_stand 36, mobility_floor 22, foam_roll 10, rotator_cuff 8 = 76.
- Pozy figur v2 (`lib/figures/v2/poses/`): rotator_cuff 7 (bez Cuban Press), mobility_floor 9, mobility_stand 8 — w tych ćwiczeniach karta wchodzi dopiero z błędem
  (docs/18, 02.11.2026), więc błędy miały tam pierwszeństwo.
- 8 badaczy (`badacz-merytoryczny`) równolegle, każdy własny plik; zasady źródeł z briefu 02.11 (szczeble wg `szczeble-organizacji-2026-11-02.md`, gałąź `badania/lokalne-0211`;
  ustawienie i ruch: 2 × szczebel 4 albo 1 × szczebel 3 „jedno źródło”; „uproszczenie: wariant sprzętu”; błędy ze źródeł albo wnioskowane z potwierdzonego zdania).
- Bloki JSON: dla ćwiczeń, którym tylko dopisano błędy albo brakującą sekcję, blok zawiera wyłącznie te klucze — integrator scala z blokiem W1
  (późniejszy plik wygrywa w obrębie klucza; patrz uwagi w każdym pliku, gdzie W2 zastępuje zdanie W1).

## Pliki (kolejność czytania przy integracji: najpierw W1 wg jej STAN, potem te)

| Rodzina | Pliki W2 |
|---|---|
| foam_roll | `foam_roll.md` |
| rotator_cuff | `rotator_cuff.md`; role: `../role-miesni-fala-w2/rotator_cuff.md` |
| mobility_floor | `mobility_floor-bledy-gotowych.md`, `mobility_floor-nogi-tulow.md`, `mobility_floor-reszta.md`; role: `../role-miesni-fala-w2/mobility_floor.md` |
| mobility_stand | `mobility_stand-bledy-gotowych.md`, `mobility_stand-statyczne.md`, `mobility_stand-dynamiczne-a.md`, `mobility_stand-dynamiczne-b.md` |

## Wynik na rodzinę

„Warunkowo” = gotowe, jeśli koordynator przyjmie szczebel źródła albo uproszczenie wskazane w pliku (lista niżej); inaczej wraca do stanu z nawiasu.

| Rodzina | Ćw. | W1 (got./cz./otw.) | **W2 (got. / warunkowo / cz. / otw.)** | Nowe karty własne (z błędami / bez) | Błędy: źródła / wnioskowane | Nowe zdania | Role |
|---|---|---|---|---|---|---|---|
| foam_roll | 10 | 9 / 0 / 1 | **9 / 1 / 0 / 0** | 1 warunkowo (Peroneals-SMR, z błędem) | 4 ćw. (`onKnee`) / 4 | 5 | nie dotyczy |
| rotator_cuff | 8 | 3 / 0 / 5 | **6 / 1 / 0 / 1** | 3 + 1 warunkowo (wszystkie z błędami) | 3 / 9 | 6 | Cuban Press: 2 pary dalej otwarte; nowe znalezisko (niżej) |
| mobility_floor | 22 | 10 / 4 / 8 | **15 / 1 / 1 / 5** | 5 + 1 warunkowo (z błędami: 5) | 1 / 14 | 15 | Downward Facing Balance — bez roli (potwierdzone) |
| mobility_stand | 36 | 15 / 3 / 18 | **20 / 2 / 2 / 12** | 5 + 2 warunkowo (z błędami: 5 + 2) | 12 / 16 | 28 | nie dotyczy |
| **razem** | **76** | **37 / 7 / 32** | **50 / 5 / 3 / 18** | **14 + 5 warunkowo** | **20 / 43** | **54** | |

Karty gotowe po W1, które dostały błędy (tylko klucz `mistakes`): foam_roll 8 z 9 (Foot-SMR bez sensownego zaprzeczenia), rotator_cuff 3 z 3,
mobility_floor 8 z 10 (Supine Figure-Four i Supine Spinal Twist — bez nowego; Spinal Twist i Butterfly mają błąd ze źródeł z W1), mobility_stand 13 z 15
(One Knee To Chest, Standing Elevated Quad — kandydaci mają po jednym źródle). **Wszystkie ćwiczenia z pozami v2, które mają kartę, mają teraz co najmniej jeden błąd.**

Szczegóły stanów:
- foam_roll: Peroneals-SMR warunkowo (uproszczenie: wariant Calves-SMR + nowe zdanie `foam_roll.per.turn`). Przywrócone drugim źródłem szczebla 4: `smr.tender` (Calves, Piriformis),
  `foam_roll.angle` (Calves), `foam_roll.pir.lean` (słabsze — do oceny recenzenta). Dalej otwarte: `foam_roll.angle` (Hamstrings, Iliotibial), `foam_roll.ub.arms`.
- rotator_cuff: gotowe nowe — Band Pull Apart (nowe `pullHold` zamiast `pullSetup`), External Rotation (linki), Cable Internal Rotation (uproszczenie: wariant sprzętu);
  warunkowo — Cuban Press (Fitness Volt); otwarte — Reverse Flyes With External Rotation (jedno źródło, postać różni się od rysunku).
- mobility_floor: gotowe nowe — Seated Calf, Seated Floor Hamstring, Supine Hamstring, IT Band and Glute, Upper Back; warunkowo — Seated Rotation (Mayo/MFMER u szpitala);
  częściowe — Middle Back (katalog: stojąc, źródła: siedząc); otwarte — Runner's Stretch, Intermediate Groin, Side Lying Groin, Kneeling Forearm, Downward Facing Balance.
- mobility_stand: gotowe nowe — Standing Chest (postać wg figury v2, nie aliasu katalogu), Standing Lateral, Standing Biceps, Inchworm, Torso Rotation;
  warunkowo — Wall Lat (Parkview), Leg Swings (Front-to-Back) (wariant D-H); częściowe — Shoulder Circles (wskazówka `bothWays` potwierdzona, ustawienie jedno źródło),
  World's Greatest Stretch (formalnie setup+move, ale bez skrętu — rekomendacja badacza: traktować jako częściowe, nie wdrażać);
  otwarte — Standing Toe Touches, Standing Pelvic Tilt, Round The World, Chest Stretch on Stability Ball, Leg Swings (Side-to-Side), Groiners, Dynamic Chest,
  Dynamic Back, Knee Circles, Hip Circles (Prone), Iron Crosses, Lying Leg Crossover Swings.

## Do rozstrzygnięcia przez koordynatora linii 1.1

1. **Szczeble** (od nich zależą stany „warunkowo”): Parkview (szpital → 4 z firmowania wg uzupełnienia 2, a przeliczenie W1 zostawiło 5) — Wall Lat;
   Mayo/MFMER w bibliotece szpitala (korekta W1: 5) — Seated Rotation; Fitness Volt bez nazwanego recenzenta (uzupełnienie 3: wiersz „najlepiej z recenzentem” vs reguła ogólna) — Cuban Press;
   USMC TECOM z autorem i datą (nieomówione) — Hip Circles (Prone), Lying Leg Crossover Swings, Knee Circles (każde ma jedno źródło); blog ACE z autorką RYT-200 — wskazówka IT Band.
2. **Role — możliwe błędne twierdzenie (ocena wg progu: potencjalnie WYSOKIE, do sprawdzenia, czy ten tekst jest dziś widoczny w aplikacji):** reguła wzorca `isolation` + rear_delt + main
   (`data/zrodla/role-miesni.json:941–950`) daje Cuban Press opis „Odciąga ramię do tyłu”, a ruch to rotacja zewnętrzna. Rekomendacja badacza: wyjątek „bez opisu” dla tej pary (`role-miesni-fala-w2/rotator_cuff.md`, opcja B).
3. **Rysunek vs karta:** Supine Hamstring Stretch — figura v2 pokazuje wariant z dłońmi za udem, katalog i karta — pas na stopie (rekomendacja: poprawić figurę; alternatywa w pliku, p. 5.1);
   Standing Chest Stretch — karta wg figury (ręce splecione za plecami), alias katalogu „Elbows Back” szczebla 5.
4. **Postać / przypisanie rodziny** (decyzje produktowe, nie dane): Groiners (katalog: wskok obunóż; źródła szpitalne: przejście do wykroku), Round The World, Middle Back, Side Lying Groin,
   Kneeling Forearm (kierunek), Downward Facing Balance (równowaga, nie rozciąganie), Iron Crosses / Hip Circles (Prone) / Lying Leg Crossover Swings (leżenie/klęk w `mobility_stand`), Knee Circles (dłonie).
5. **Te same karty:** Standing Chest, Standing Biceps i Chest And Front Of Shoulder mają teraz prawie to samo ustawienie i ruch.
6. **Niezależność:** HSS i Mass General (programy barku) = jedno źródło; WebMD „trunk rotation” = kopia ACE #106 (nieliczona).
7. **Drobne w kodzie (do notatki):** komentarz `WYJATKI_OPISU` w `scripts/figures/agent-pozy/rotator_cuff.mjs:74` twierdzi, że brak tekstu `rot.mis.elbowAway`, a tekst jest (`lib/cues/text/pl.json:282`).
8. Format uproszczenia w polu `s` (`["uproszczenie", "…"]` — propozycja badacza foam_roll) — integrator dopasuje do konwencji `cues.json`.
9. Nowe zdania PL/EN (54) — rejestr twierdzeń (`claims.mjs --stub`) i recenzja lokalizacji przy integracji. Błędy wnioskowane wymagają recenzji niezależnej (autor ≠ recenzent).

## Verify i wypchnięcie

- Pełne `npm run verify` na czystej bazie 2dc54e2 — wynik: patrz raport końcowy (uzupełniany po zakończeniu).
- Commity w worktree: 56448d4c, 1f5d4edb, 5d4ee9a8, c5d2a765, fe65e298, 639ab772, 02bb9234, 109696e8 (+ ten plik).

## Następny krok

Koordynator linii 1.1: rozstrzygnięcia z pkt 1–2, potem integracja W1+W2 wg kolejności plików. Dalsze szukanie dla otwartych (18) ma sens dopiero po decyzjach o postaci (pkt 4);
reszta (Toe Touches, Pelvic Tilt, Leg Swings Side, Dynamic Chest/Back, Runner's, Intermediate Groin) — trzy tury szukania (W1 ×2, W2) bez drugiego źródła szczebla ≤ 4.

## Pułapki

Jak W1 (ExRx, mayoclinic.org, marines.mil, BYU — 403; web.archive.org zablokowane), a dodatkowo: PMC — reCAPTCHA, Europe PMC — 500, OhioHealth — 403, Emory PDF — 404, UCSF PDF — 403;
PDF-y szpitali przez WebFetch nieczytelne — czytać plik zapisany przez narzędzie; wyszukiwarka biblioteki ACE nie filtruje po haśle.
