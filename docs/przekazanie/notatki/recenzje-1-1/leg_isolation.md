# Recenzja ruchu 1.1: rodzina leg_isolation (8 ćwiczeń), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, liczby z silnika v2, kierunek zgięcia kolana, środek ciężkości jak w `leg_machine.md`).

Walidator: **8/8 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Leg Extension | OK | Siedzisko z oparciem, wałek dźwigni przy kostce (oś przy kolanie (50,6; 48)). Kolano 90° → 11°, udo nieruchome, jak w `lext.range` (wyprost do końca, powrót do ok. 90°) |
| Single-Leg Leg Extension | OK | Jak wyżej, prawa noga; lewa stopa na podłodze, kolano 90° |
| Leg Curl | OK | Siedząc: kolano 11° → 100°, pięta pod siedzisko (kostka x 90,9 → 43,4), udo i biodro nieruchome (`lcurl.still`) |
| Lying Leg Curl | OK | Leżenie przodem na ławce, kolano przy jej końcu (x −42), wałek nad piętą. Kolano 3° → 100°, pięta w stronę pośladków (`llc.move`), biodro stałe 8°. Dłonie na ławce przed głową |
| Standing Leg Curl | OK z uwagą | Ruch poprawny: stoi na lewej nodze, udo R pionowo i nieruchomo, kolano 9° → 95°, środek ciężkości nad stopą (x 7,8–9,0 przy stopie −13,2…18,7). Uwaga A |
| Standing Cable Leg Curl | OK | Postawa prosta, linka z dołu z przodu do kostki R (opór przy zginaniu), kolano 9° → 95°, udo pionowo, dłonie na biodrach |
| **Seated Band Hamstring Curl** | **BŁĄD** | Guma nie stawia oporu (nr 1) |
| Slider Hamstring Curl | OK z uwagą | Leżenie tyłem, pięty na ślizgaczach. Nogi wysuwają się do wyprostu (kolano 100° → 12°, kostka x 51,5 → 80,8) i wracają. Uwaga B |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Seated Band Hamstring Curl** | wszystkie klatki: guma | **Guma nie stawia oporu, bo łączy dwie kostki, które poruszają się razem.** Sprzęt: `guma`, `mocowanie: "kostki"`, czyli pętla od kostki R do kostki L. Obie nogi zginają się jednakowo (kolano 10° → 91°, kostki x 72,7 → 43,0 przy z = ±10), więc guma ma stale 20 cm i nie rozciąga się. Opis sprzętu w `gear.ts` (`guma.ref`) wymaga: „ruch ćwiczenia ma rozciągać gumę”. Na podglądzie to krótka przerywana kreska między stopami, z której nie widać, skąd bierze się opór. Ruch ciała jest poprawny: siad na skrzyni, tułów pionowo, pięty sunące pod skrzynię. | Guma zaczepiona z przodu (słupek, nogi stojaka, katalog: `recommended: rack`) na wysokości kostek, biegnąca do pięt. Rozciąga się, gdy pięty idą pod siedzisko. Model `guma` nie ma dziś trybu „zaczep → kostki” (tylko „zaczep → dłonie”), więc potrzebny jest nowy tryb sprzętu albo jawny wyjątek z powodem. | 80% | realny | nie: walidator nie sprawdza, czy długość gumy zmienia się w ruchu |

## OK z uwagą (backlog, nie blokuje)

- **A. Standing Leg Curl: maszyny nie widać, a dłonie są w powietrzu.** Sprzęt to `dzwignia` przy kolanie: na podglądzie ciemny pręt wzdłuż goleni, bez ramy, poduszki pod udo i uchwytów. Tułów pochylony o 24°, dłonie przed klatką (44,3; 105,5) nie dotykają niczego. Równowaga jest zachowana (inaczej niż w `leg_machine.md` nr 1–3), więc to uwaga, a nie błąd. Ta sama klasa co Machine Glute Kickback (`glute_floor.md` nr 1) i Belt Squat (`leg_machine.md`, uwaga A). Pewność 65%.
- **B. Slider Hamstring Curl: biodra nie trzymają mostka.** Miednica stoi przez cały ruch na y = 19,9. W pozycji zgiętej (u = 0) leży 12 cm pod linią bark–kolano (biodro zgięte 28°). Przy wyproście (u = 1) jest ok. 10 cm nad linią bark–pięta (biodro −16°). Wskazówka `gb.move` z zestawu ćwiczenia mówi: „Unieś biodra… aż barki, biodra i kolana utworzą linię”. W wariancie ze ślizgaczami biodra zwykle są najwyżej w pozycji zgiętej (linia bark–biodro–kolano) i mogą lekko opaść przy wyproście. Tu jest odwrotnie. Pewność 55%.
