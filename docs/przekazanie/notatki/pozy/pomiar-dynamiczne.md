# Pomiar: pozy ruchów dynamicznych (gałąź pozy-dynamiczne), 26.10.2026

Rodziny: plyo (28), olympic (25), kb_ballistic (17), sled_throw (19), strongman (10) = 99 ćwiczeń.

| rodzina | poz w danych | wyjątki | 1. przebieg całej rodziny (zaliczone/próby) | deklaracja „dynamiczne” | uwagi |
|---|---|---|---|---|---|
| plyo | 27 | 1 (Kneeling Jump Squat; 7 bocznych odblokowanych polem przesuniecieBoczne, 26.10.2026) | 8/26 | cała rodzina | błąd bj.mis.stiff (Box Jump) i jump.mis.stiff (bez tekstu w pl.json: sprawdzony próbnie, nierysowany) |
| olympic | 23 | 2 (Rack Delivery, Jerk Balance — otwarte) | 1/16 | cała rodzina | oly.mis bez tekstu: nierysowany; sq.mis.heels (Snatch Balance) do wygenerowania (brak grupy błędu w danych) |
| kb_ballistic | 16 | 1 (Pirate Ships — otwarte) | 3/14 | tylko One-Arm Kettlebell Clean and Jerk | błąd mis.roundBack narysowany (One-Arm Swings, Sumo High Pull) |
| sled_throw | 8 | 11 (10 otwartych + Turkish Get Up) | 3/8 | tylko Backward Medicine Ball Throw | błąd sq.mis.kneesIn narysowany (Wall Ball) |
| strongman | 1 (Yoke Walk) | 9 (8 otwartych + Jefferson Squat) | 0/2 | brak | |

Razem: 68 póz, 31 wyjątków. Pomiar „za 1. razem” = pierwszy przebieg generatora całej rodziny po napisaniu (nie liczy wcześniejszych prób pojedynczych ćwiczeń).

## Kontrakt: czy obsługuje lot i przechwyt?

- Lot: tak (styk z podłogą liczony z geometrii, nie wymagany w rodzinach dynamicznych; reguły sensu `lot` i `amortyzacja_ladowania` już istnieją; pozy kończą się amortyzacją po lądowaniu — wariant A).
- Reguła „nic nie wisi” (jakosc-r2) dotyczy tylko core_floor — rodzin dynamicznych nie obejmuje.
- Ciągłość: NIE. Limit 6 cm na 1/48 ruchu to droga najszybszego punktu ≤ 288 cm na cały ruch (przy 12 klatkach kluczowych i interpolacji liniowej).
  Pomiar generatorów (droga najszybszego punktu na cały ruch): skok z zamachem rąk 420–590 cm (Depth Jump 593), zarzut/rwanie z przechwytem 300–420 cm (Clean and Jerk 417),
  Backward Medicine Ball Throw 328 cm, One-Arm Kettlebell Clean and Jerk 260 cm przy tempie 7,8 cm na 1/48.
  Rozszerzenie minimalne: `CONTRACT.maxJumpDynamic` = 16 cm na 1/48, włączane deklaracją `dynamiczne` (z powodem) w `data/zrodla/figury-sens.json` (`v2-sens.dynamiczne` → `ctx.dynamic`);
  rodziny bez deklaracji bez zmian (testy: `tests/figury-dynamiczne.test.ts` — zgodność wsteczna na wszystkich rodzinach spoza listy, deklaracja z powodem, pozy zapisane przechodzą waliduj, limit jest naprawdę potrzebny).
  Najszybsza zaliczona poza: 13,5 cm na 1/48 (Depth Jump), typowo 10–12; limit 16 nadal łapie „teleport” (odwrócony staw: 20–60 cm).
- Reguła sensu `rece_przed_wyprostem_bioder`: najgłębsze zgięcie biodra liczone przed wyprostem (zarzut z zawisu i rwanie kończą się głębiej niż zaczynają); test czerwony na starym kodzie.

## Ograniczenia modelu odkryte w pracy (do decyzji koordynatora)

1. ROZWIĄZANE (wariant A, 83e69f7): Przesunięcie boczne ciała niewyrażalne: `miednica.z` nie przesuwa stawów biodrowych i barków (skeleton ustawia je w z = ±8,5 / ±19). Dotknięte: 7 ćwiczeń plyo (Lateral Cone Hops, Side Hop-Sprint, Side Standing Long Jump, Lateral Bound, Single-Leg Lateral Hop, Lateral Box Jump, Side to Side Box Shuffle). Opcje: (A) rozszerzyć model o przesunięcie boczne korzenia (zmiana silnika, zgodna wstecz), (B) zostawić wyjątki. Rekomendacja: A, jeśli ćwiczenia boczne mają mieć animację.
2. Kettlebell: tryb dzwonu stały w całym ruchu (`dol` / `wzdluz` / `tyl`), więc zarzut i rwanie używają `wzdluz`; rack z `tyl` koliduje z udami w fazie zawisu.
3. Turkish Get Up i Jefferson Squat: wyjątki z powodem w generatorach (zakres wyprostu biodra −17° przy podporze ręką o zasięgu 64 cm; sztanga między udami wymaga ≥ 10,8 cm odstępu od osi uda).
4. Błędy bez tekstu w pl.json (jump.mis.stiff, oly.mis, ohp.mis.lock) nie są rysowane (reguła `etykieta_bledu`); generatory mają gotowe rzędy błędów, sprawdzone próbnie (`POZY_TEKSTY_BLEDOW=wszystkie`), do włączenia po wdrożeniu tekstów.

## Czas

Ok. 4 h zegarowych (w tym restart kontenera, kolejka testów wspólna z innymi agentami i dwa przeglądy podglądów).
