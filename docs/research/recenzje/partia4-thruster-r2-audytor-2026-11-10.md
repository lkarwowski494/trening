# Recenzja niezależna rodziny v2 `thruster` — runda 2 (partia 4, linia 1.1), 10.11.2026

Recenzent: audytor (nie jest autorem rodziny ani wykonawcą poprawek; L-047). Stan: `figury/partia-4-thruster` @ 0ee59a94 (poprawki 93b86d7c, 50988529, 0ee59a94; baza rundy 110bb399).
Arkusze ze śladem toru (L-050) wygenerowane samodzielnie (`arkusz-slad.mjs`, 3 ćwiczenia × rzut z boku, 21 kadrów co 0,05) — bajtowo identyczne z arkuszami koordynatora (`cmp`);
dodatkowo `arkusz-nakladka.mjs --family thruster` (pozy błędów). Liczby z `frameAt` / `keyframeFrame` (siatka 1/480), walidator `v2-validate.mjs` (OK dla 3 ćwiczeń).
Skróty: `node scripts/zrodla-runtime.mjs --skroty` w worktree gałęzi: v2 thruster **00dc790a18f6**; karty Thruster (hantle) 6606839c306f, Kettlebell Thruster 175baa530c3a; zestaw Clean and Press 84f205b001d6.
Arkusz z przodu nie był potrzebny: rodzina ma tylko rzut z boku (aplikacja i strona go nie pokazują), więc N2 (łokcie) zostaje niewidoczne.

**Werdykt rodziny: wyświetlana** (0 × KRYTYCZNE, 0 × WYSOKIE). Werdykt per ćwiczenie: Thruster (hantle) — wyświetlana; Kettlebell Thruster — wyświetlana; Clean and Press — wyświetlana.

## Znaleziska r1 — stan

| # | r1 | Stan r2 | Dowód (arkusz + liczby) |
|---|---|---|---|
| W1 | koniec wyciskania przed głową | **naprawione** | Thruster (hantle) i Kettlebell Thruster: najwyższy chwyt u = 0,727 (kadr 8/11; arkusz kadry 0,70–0,75): chwyt 7,3 cm przed środkiem barków, 2,0 cm od kostki (próg r1: ≤ 10 / ≤ 5), łokieć 11,2°, kolano 2,9°. Clean and Press u = 1 (kadr 1,00): 8,5 cm / 2,0 cm, łokieć 20,3°. Na arkuszach ciężar nad czubkiem głowy, nad środkiem stopy. |
| W2 | przysiad nad równoległym | **naprawione** | najniższe udo u = 0,365 (kadry 0,35–0,40): udo 8,1° poniżej poziomu (r1: +20,4°), oba thrustery; pięty płasko. |
| W3 | brak powrotu na barki | **naprawione** | kadry 0,80–1,00: ciężar schodzi z blokady przed twarzą do racka; chwyt u = 1 = chwyt u = 0 (0,0 cm), pętla zamknięta, bez skoku przy przejściu 1 → 0 (pauzy 500 + 500 ms w racku). |
| N1 | brak testów W1–W3 | naprawione | `tests/figures-v2-thruster.test.tsx:56–75` (W1–W3 + negatyw na pozach 110bb399 — fixture zgodny 1:1 z `git show 110bb399:lib/figures/v2/poses/thruster.json`); 922 testy zielone (`--runInBand`: thruster, tor, dynamiczne, delt-raise-p4, zgodnosc-wsteczna). |
| N2 | Clean and Press łokcie w bok | bez zmian (NISKIE, teoretyczne) | łokieć 28 cm (rack) i 25,7 cm (u = 0,727) od barku w osi z; tylko rzut z boku — niewidoczne. |

## Ciągłość (warunek koordynatora, decyzja A — limit 16 cm dla rodziny dynamicznej)

Maks. krok punktu na 1/48 ruchu (wszystkie stawy i ciężar, siatka 1/480): Thruster (hantle) **10,3 cm**, Kettlebell Thruster **10,7 cm** (chwyt, u ≈ 0,375–0,54 — wstawanie z wyciskaniem), miednica 5,5 cm, głowa 6,8 cm; Clean and Press **5,1 cm**. Wszystko < 16 cm; walidator OK.
Ogląd arkuszy: brak szarpnięcia, skoku sylwetki, przeskoku łokcia czy ciężaru — kolejne kadry zmieniają się stopniowo (największa zmiana między kadrami 0,45 → 0,50: hantle od brody do poziomu czoła, z wyprostem nóg). Na dole przysiadu prędkość zmienia się szybko (chwyt 3,2 → 10,3 cm na 1/48 w kadrze kluczowym 4): wygląda jak dynamiczne wybicie z dołu, zgodne z charakterem thrustera, nie jak skok. **Bez znaleziska.**

## Nowe znaleziska (żadne nie blokuje)

| # | Klasa | Pewność | Ćwiczenia | Co | Dowód | Realność |
|---|---|---|---|---|---|---|
| N3 | NISKIE | 90% | Clean and Press | Deklaracja `dynamiczne["*"]` obejmuje też Clean and Press, choć jego maks. krok to 5,1 cm (mieści się w 6 cm) — limit 16 cm luzuje strażnika ciągłości bez potrzeby. Istnieje mechanizm deklaracji pojedynczych ćwiczeń (`tests/figury-dynamiczne.test.ts:19`, `DYN_POJEDYNCZE`). | `data/zrodla/figury-sens.json` (thruster.dynamiczne) | teoretyczny (dziś bez skutku; dotyczy przyszłej regresji) |
| N4 | NISKIE | 85% | Thruster (hantle), Kettlebell Thruster | Strażnik kształtu toru wyłączony wyjątkami (`tests/tor-wyjatki.json`, 2 wpisy): przy pętli zamkniętej miara odchylenia daje 0, więc kształt toru nie ma automatycznej ochrony (pilnuje tylko W1 koniec i W3 powrót). Ślad obejrzany ręcznie: poprawny. | `tests/figures-v2-tor.test.ts:21–25` (cięciwa = 0 przy pętli zamkniętej) | teoretyczny |
| N5 | NISKIE | 85% | Thruster (hantle), Kettlebell Thruster | Pozycje statyczne: blokada nad głową (u = 8/11) ma podpis „Pozycja końcowa”, a powtórzenie kończy się w racku (karta: „potem opuść z powrotem do barków”). Faza ma jedną nazwę „Podnoszenie” na całą pętlę (także zejście i opuszczanie), przebieg 1,5 s (`ONE_WAY.repMs`) — ta sama konwencja co olympic, czas niewyświetlany. | `lib/figures/v2/anim.ts:32–33`; `phasesFor` → `[{name:"Podnoszenie", untimed}]` | brzegowy (widać przy „Ogranicz ruch”) |

## Punkt 4 briefu — zmiany poza plikami rodziny (`git diff 110bb399..0ee59a94`)
- `figury-sens.json`: `dynamiczne["*"]` — zgodne z decyzją koordynatora (docs/18, 10.11.2026), istniejący mechanizm; test `figury-dynamiczne.test.ts` pilnuje, że rodziny spoza listy (dip, overhead_press, squat) mają dalej 6 cm i `maxJump` = 6. Uwaga N3. `nad_glowa.tylko_u1: false` — tylko w sekcji thruster (pozostałe 3 wystąpienia `true` bez zmian); konieczne, bo u = 1 to rack; luz rekompensuje nowy test W1 (miejsce i wysokość blokady). Nie poluzowanie.
- `anim.ts` ONE_WAY_STATIC: wymagane przez strażnik „pozycje statyczne parami różne” (u = 0 i u = 1 to ta sama poza); nie poluzowanie (uwaga N5 o podpisie).
- `tor-wyjatki.json`: +3 wpisy z powodem (Split Snatch tylko przeniesiony — tekst bez zmian). Strażnik „lista tylko maleje” sprawdza, że każdy wyjątek nadal przekracza próg — spełnione. Wyjątki zasadne ruchowo (pętla zamknięta; Clean and Press omija twarz, 15,9 cm od środka głowy do osi gryfu w u = 0,64). Uwaga N4.
- `figures-v2-delt-raise-p4` 53 → 56: 3 ćwiczenia jednokierunkowe thruster — liczba zgodna z danymi; test teraz sprawdza też thrustery (zaostrzenie zakresu).
- `gemini-polecenia` 33 → 32: thruster ma pozy w danych, więc nie dostaje polecenia póz — licznik stanu, nie próg.
- Złote `figury-v2-zgodnosc-wsteczna`: zmienione tylko 3 odciski `thruster/*` (diff jednego bloku), opis zmiany w nagłówku testu.
- `oly.mis` Clean and Press: poza błędu jak w r1 zaokrągla plecy (odchylenie środka kręgosłupa od linii miednica–kark do 5,9 cm), teraz dodatkowo pochyla tułów (+7°) i odsuwa sztangę do 5,5 cm od poprawnego toru — zgodne z tekstem „Sztanga odjeżdża od ciała albo plecy się zaokrąglają”; widoczne na arkuszu nakładki (kadry 0,10–0,40).

## Zgodność z kartą (każde zdanie)
- Thruster (hantle): thruster.dbSetup (hantle przy barkach, stopy 24 cm) ✓; thruster.move ✓ (W1–W3); sq.down ✓ (biodra i kolana razem, pięty płasko); thruster.depth ✓ (−8,1°); sq.back ✓ (tułów 24° na dole, plecy proste); thruster.fullExt ✓ (kolano 2,9°, łokieć 11,2°, biodro wyprostowane — tułów odchylony ok. 6°, w granicach „lekko”); błąd sq.mis.heels ✓ (pięta do 8,3 cm w u = 0,35, poprawna poza ≤ 2 cm).
- Kettlebell Thruster: thruster.kbSetup ✓ (dzwon z tyłu na przedramieniu); thruster.move, thruster.depth, thruster.fullExt ✓ jw.; ohp.tall ✓ (ciężar nad głową nad stopą; tor z łagodnym łukiem do 8 cm przed twarz); sq.mis.heels ✓. Dzwon nie przenika głowy (ok. 2 cm luzu, u = 0,88).
- Clean and Press (zestaw oly): oly.back ✓; oly.close ✓ (sztanga 3,9–9,7 cm od nóg/tułowia poniżej barków); ohp.tall ✓ (po W1); oly.mis ✓.
- Dłonie na ciężarze: odległość chwytu od ciężaru 0,00 cm w każdej klatce siatki 1/480 (wszystkie 3); ciężar nie przechodzi przez głowę ani twarz (hantle ≥ 28 cm od środka głowy do uchwytu; sztanga min. 15,9 cm do osi gryfu).

## Sprawdzone bez znalezisk
K4 ruch (3 arkusze), K5 testy W1–W3 z negatywem, K6 orientacja sprzętu (bez zmian od r1), K9 `assignAll()` = 3, K10 brak wpisów v1, K11 karty, K12 zestaw, K14 testy (bez poluzowań; uwagi N3–N4), nakładka (`thrusterBackRef`, `thrusterBarCloseRef` — bez zmian).
