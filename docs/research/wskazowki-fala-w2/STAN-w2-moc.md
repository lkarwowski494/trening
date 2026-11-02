# STAN — grupa G3 „moc” (fala W2), 02.11.2026

Koordynator grupy badań treści G3, fala W2. Zakres: TYLKO zbieranie danych — bez zmian w kodzie, `data/zrodla/*.json`, `lib/**` i testach.
Integruje koordynator linii 1.1. Gałąź `badania/w2-moc` od `integracja-1-1` (2dc54e2). Punkt wyjścia: pliki W1 z `badania/g3-moc` po commicie
e40da11 („przeliczenie szczebli”) — w każdym pliku W1 liczy się „Blok do wdrożenia (po przeliczeniu 02.11.2026)”.

Rodziny: plyo, olympic, kb_ballistic, sled_throw, thruster — 92 ćwiczenia (`assignAll()`), 3 z kartą wcześniej (Kettlebell Swing, Box Jump,
Medicine Ball Slam) → 89. Wszystkie pięć rodzin ma pozy figur v2 (`lib/figures/v2/poses/*.json`), więc karta własna wchodzi tylko z min. 1 błędem
(decyzja 02.11.2026 w docs/18) — dlatego W2 dopisała błędy (wnioskowane i ze źródeł) do wszystkich kart „bez błędów” z W1.

## Wynik na rodzinę (po W1 + W2)

| Rodzina | Ćw. | Po W1 (z błędami / bez / otwarte) | Po W2 (z błędami / warunkowe poza blokiem / otwarte) | Nowe karty z błędami w W2 | Błędy wnioskowane (wpisy) | Plik W2 |
|---|---|---|---|---|---|---|
| olympic | 25 | 21 / 1 / 3 | 22 / 0 / 3 | 1 (Jerk Balance: z „bez błędów”) | 1 | olympic-thruster.md |
| thruster | 3 | 2 / 0 / 1 | 3 / 0 / 0 | 1 (Clean and Press — uproszczenie „złożenie dwóch ćwiczeń”, do recenzji) | 0 | olympic-thruster.md |
| kb_ballistic | 16 | 0 / 4 / 12 | 11 / 1 (Dumbbell Clean — szczebel REP Fitness) / 4 | 11 (4 z „bez błędów”, 7 z otwartych) | 20 | kb_ballistic.md |
| plyo | 27 | 5 / 2 / 20 | 12 / 1 (Box Skip — szczebel Radcliffe) / 14 | 7 (2 z „bez błędów”, 5 z otwartych; Front Cone Hops warunkowo) | 6 | plyo-a.md, plyo-b.md |
| sled_throw | 18 | 2 / 4 / 12 | 10 / 0 / 8 | 8 (4 z „bez błędów”, 4 z otwartych) | 8 | sled_throw-sanki.md, sled_throw-rzuty.md |
| **Razem** | **89** | **30 / 11 / 48** | **58 / 2 / 29** | **28** | **35** | |

Kart „własna bez błędów” po W2: 0. Nowe zdania w blokach: ok. 42 (olympic 1, kb 12, plyo A 11, plyo B 2, sanki 8, rzuty 8) + 8 w blokach
warunkowych (kb 5, plyo B 3) — liczby z raportów badaczy; wiążące są sekcje „Nowe zdania” w plikach. Bloki JSON sprawdzone skryptem: parsują się,
klucze = klucze katalogu (`lib/catalog.generated.ts`), każda karta w bloku ma min. 1 błąd.

Karty oparte na uproszczeniu albo jednym źródle (do recenzji niezależnej, L-047): Clean and Press (złożenie), Backward Drag i Bear Crawl Sled Drag
(wariant), One-Arm Kettlebell Swings, Double Kettlebell Snatch (wariant), One-Arm Kettlebell Clean and Jerk („ta sama faza” z W1),
Single-Leg Lateral Hop i Lateral Bound (jedno źródło szczebla 3 — test w metodach badania), Supine Chest Throw (jedno źródło szczebla 3),
Front Cone Hops (ustawienie wprost tylko w jednym źródle), Depth Jump (`plyo.depth.mis.jumpOff` — do oceny).

## Role mięśni — `docs/research/role-miesni-fala-w2/`

63 wiersze policzone z katalogu (nie z list W1): 16 gotowych (15 warunkowo), 47 otwartych. Gotowe: skoki w bok — czworogłowe 8, łydki 7
(dwa badania szczebla 3: Inaba i in. 2013, Suzuki i in. 2011 — warunek: ISBS jako szczebel 3 i przeniesienie z wybicia w bok); Clean and Press
górna część pleców (reguła N4, katalog: sztanga). Pliki: plyo.md, olympic.md, kb_ballistic.md, sled_throw.md (thruster bez zmian).
Wiersze z list W1, których w katalogu NIE MA (`muscleLoadOf`, `lib/seed.ts:157`): dwugłowe w Double Leg Butt Kick i Box Skip, pośladki w Bear Crawl
Sled Drag, górna część pleców i triceps w Snatch Balance, dwugłowe i czworogłowe w Kettlebell Sumo High Pull, przedni akton w Spider Crawl.
Standing Two-Arm Overhead Throw ma puste partie (`lib/catalog.generated.ts:1811`) → 0 wierszy (sygnał danych katalogu).

## Do decyzji koordynatora linii 1.1

1. Szczeble: REP Fitness (producent hantli, autor NASM-CPT, data; koszyk na stronie) — od tego Dumbbell Clean; Radcliffe „High-Powered Plyometrics”
   (książka uznanego autora = 3? — od tego Box Skip); T. Howley (Human Kinetics, magisterium z fizjologii wysiłku → 4 przyjęte w plyo-b.md);
   program SHRED Uniwersytetu w Calgary (Single-Leg Lateral Hop, błąd „kolano do środka”); materiały konferencyjne ISBS jako szczebel 3 (role);
   elitefts-eight-drag (autor bez kwalifikacji na stronie, przyjęte 4 wg precedensu W1 — sanki).
2. Uproszczenia do recenzji — lista wyżej. Clean and Press: brak zdania „wyciskaj bez pomocy nóg” (nie odróżnia od push press) i start (podłoga
   czy zwis jak na figurze) — [OTWARTE] w olympic-thruster.md §2b.
3. Kolizje id: propozycja `snatch.powerMove`, `jerk.powerMove`, `snatch.splitMove`, `jerk.splitMove`; `olympic.mis.armsEarly` połączyć z
   `olympic.mis.arms` (do recenzji lokalizacji) albo `snatch.mis.armsEarly` (olympic-thruster.md §7).
4. Źródła książkowe w blokach oznaczone `kind: "site"` (brak `book` w `CUE_BASIS_KINDS`, `lib/cues/index.ts:25`) — do zmiany przy integracji wg decyzji 02.11.
   Cytaty z fragmentów Human Kinetics czytane przez WebFetch (streszczenie strony) — brzmienie do sprawdzenia przed wpisem.

## Sygnały dla figur i katalogu (przejmuje koordynator linii 1.1)

- Clean Shrug: wg Catalyst ruch głównie z kolan przy prawie pionowym tułowiu, figura — pochylenie ok. 23°.
- Medicine Ball Scoop Throw: katalog = rzut spod nóg z wyskokiem nad głową w tył (jak Backward Medicine Ball Throw + wyskok — możliwy duplikat);
  końcowa poza `scoop` (`scripts/figures/agent-pozy/sled_throw.mjs:58`, `psi: 40`) vs `tyl` (`psi: 78`) — sprawdzić przy recenzji ruchu.
- Rack Delivery: brak pozy w `poses/olympic.json` (nawet z drugim źródłem karta bez figury).
- Spider Crawl: katalog (ręce ugięte do 90°, bez przemieszczania) ≠ ACE #247 (marsz na prostych rękach) — ustalić ruch.
- One-Arm Medicine Ball Slam: inny ruch niż Medicine Ball Slam (wykrok, tor ukośny, rotacja) — nie wariant.
- Dumbbell Seated Box Jump: siad i start bez zamachu to inny ruch niż Box Jump — nie wariant.
- `mbcp.catch` ma 2 źródła szczebla 4, ale rysunek nie pokazuje łapania — poza blokiem.
- Medicine Ball Slam (istniejący wpis): nic nie przeczy (ISSA „Overhead Slam” zgodny z `slam.move`).

## Zostało (następny krok)

Otwarte 29 + 2 warunkowe; szczegóły w sekcjach „Otwarte” i „Stan” plików rodzin. Najlepsze tropy:
- plyo: oficjalna kopia FIFA 11+ (skoki jednonóż w bok — drugie źródło Lateral Bound i błąd kolana; kopia kliniki > 10 MB nie pobrała się);
  artykuł eksperta ACE nr 5869 („Lateral Bounds”, autor z certyfikatami ACSM/ACE, data) — możliwe drugie źródło Lateral Bound; podręcznik NSCA (rozdział pliometrii).
- kb_ballistic: One-Arm Kettlebell Split Jerk (tylko ACE 385), Sumo High Pull, Bottoms-Up Clean, Pirate Ships; `kbb.lower` i `kbb.lockout` w KB Snatch — po 1 źródle.
- sled_throw: Sled Drag (Harness) (Torque s. 58 — drugie źródło), Sledgehammer Swings (STACK — 503, ponowić), Human Kinetics „Overhead Medicine Ball Slam Rotation”
  (One-Arm Slam), NSCA „Tests of Core Muscle Power” (403; rzuty leżąc).
- olympic: Snatch Shrug, Clean Shrug (ustawienie), Rack Delivery — po jednym źródle; Bench Jump i Frog Hops (plyo) — czekają na definicję ruchu.
- role: pośladki w skokach w bok (sprzeczność szczebla 3), sanie, TGU (pełny tekst badania 2019), Spider Crawl, rzuty leżąc (lats).

Pułapki: ExRx 403, web.archive.org zablokowane, nsca.com 403, Body-Solid usunięte, S&C Northeastern 410, CHOP 403; PDF Torque w rozkładówkach
(strona drukowana = 2 × strona PDF − 2); WebFetch na Human Kinetics zwraca streszczenie zamiast dosłownego tekstu.

## Commity i weryfikacja

- Pełne `npm run verify` na bazie `integracja-1-1` (2dc54e2): **zielone** (wyjście 0; 15 941 testów zaliczonych, 3 pominięte; znacznik pełny dla 2dc54e2).
- `npm run verify:docs` przed każdym wypchnięciem — uruchamiane w czystym, osobnym worktree na tym samym commicie (pliki badaczy w toku jako
  nieśledzone blokowały zapis znacznika w worktree badań): zielone dla d3e1a64a, 09f59603, 1d1fec8d (24–45 s).
- Commity (wyłącznie `docs/research/`): 3e02a39 role, d3e1a64a olympic-thruster, 09f59603 sanki, e54924c6 nagłówki bloków, 5c51850c kb_ballistic,
  12c9ab14 plyo A, 7e9f1def plyo B, 1d1fec8d rzuty; potem ten plik. Wypchnięte zwykłym `git push` (bez `--no-verify`).
