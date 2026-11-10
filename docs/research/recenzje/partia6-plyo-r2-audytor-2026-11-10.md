# Recenzja niezależna rodziny v2 `plyo` — partia 6, runda 2 (audytor, 10.11.2026)

Bramka 4 (L-047, L-050). Stan zamrożony: `figury/partia-6` @ e73f097 (poprawki r1 w generatorze `scripts/figures/agent-pozy/plyo.mjs`; w pliku póz zmienione tylko Broad Jump, Double Leg Butt Kick i Single Leg Butt Kick — sprawdzone porównaniem z dff0a3f). Autor: programista partii 6; recenzent: audytor.

## Werdykt rodziny: **do poprawy** (W2 nadal WYSOKIE, w nowej postaci). W1 naprawione.

## Metoda
Arkusze `arkusz-slad` wygenerowane samodzielnie dla 3 zmienionych ćwiczeń × 2 rzuty (side, front), 21 kadrów co 0,05, ślad = miednica; liczby z `frameAt` (siatka 1/100); `v2-validate.mjs` dla 27 póz — wszystkie OK; testy `figures-v2-plyo` i `figures-v2-tor` (`--runInBand`).

## W1 Broad Jump — naprawione
Chwyt − bark w osi x: +11 cm (u 0) → −25 cm (u 0,10) → −21 cm (u 0,15), potem wymach w przód (+61 cm, u 0,45). Na arkuszu dłonie za biodrami w ugięciu, bez przenikania (walidator OK). Lot 130 cm w przód, lądowanie bez zmian (kolano 90°, biodro 93°), maks. krok miednicy 3,9 cm na 1/96. Karta zgodna z rysunkiem w całości.

## W2 Double Leg Butt Kick, Single Leg Butt Kick — nadal WYSOKIE (nowa postać)
Poprawka spełnia literę mojej miary z r1 (kolano ≥ 120°, pięta–miednica ≤ 30 cm), ale nie ruch: **miara z r1 była niepełna** — nie ograniczała zgięcia biodra ani położenia pięty, więc ten sam wynik daje skok z kolanami do klatki.
- Double Leg Butt Kick, u 0,75: kolano 139°, **biodro 125°**, kolana 26 cm **nad** miednicą, pięta 16 cm **przed** miednicą — na arkuszu to skok „kolana do klatki”, głębszy niż sam Tuck Jump (biodro 115°, kolana 7 cm nad miednicą). Przy biodrze ≤ 45° kolano w locie najwyżej 59°.
- Single Leg Butt Kick, noga wolna, u 0,68: kolano 142°, biodro 107°, kolano 13 cm nad miednicą — wymach kolana w przód (jak w skipie A), nie pięta do pośladka. Przy biodrze ≤ 45° kolano maks. 112°, pięta 47 cm od miednicy.
- Realność: realny (każde otwarcie ćwiczenia). Ćwiczenie pokazuje inny ruch niż nazwa i myli się z Tuck Jump.
- **Miara do testu odtwarzającego (zastępuje miarę z r1):** w locie co najmniej jeden kadr, w którym na tej samej nodze naraz: kolano ≥ 120°, zgięcie biodra ≤ 45° (udo blisko pionu), pięta ≤ 30 cm od miednicy i pięta nie przed miednicą (pięta.x − miednica.x ≤ 0). Negatyw: pozy e73f097 (biodro 125° / 107°, pięta 16 / 8 cm przed miednicą) muszą oblać.

## ŚREDNIE i NISKIE z r1 — bez zmiany klasy
S1 (miednica w locie za kostkami) i S2 (Star Jump) bez zmian; Double Leg Butt Kick ma teraz w locie 4 zawrócenia śladu w poziomie (−28…8 cm) — mieści się w S1. N1–N4 bez zmian. N5: opis wyjątku toru Weighted Jump Squat poprawiony („ślad = sztanga na barkach”); `podpora()` bez osi z — bez zmian (NISKIE).

## Nic nie zepsute
- Pozostałe 24 pozy identyczne z dff0a3f; skróty zestawów i kart własnych bez zmian względem r1 (zmienił się tylko skrót v2.plyo).
- Lądowanie wszystkich trzech: kolano 90° / biodro 93° (Double, Broad), noga podporowa Single bez zmian; przenikanie 0,0 cm; lot ≥ 22 cm.
- Testy: nowe testy W1/W2 z negatywem zielone; czerwony nadal ten sam co w r1 (Double Leg Butt Kick bez elementu nakładki, bo zestawy ogólne nie mają jeszcze wpisu recenzji) — zniknie po przepisaniu wpisów `zestawy`.

## Zestawy ogólne (19) i karta Broad Jump
19 zestawów — „wyswietlana”, treść i skróty bez zmian (przy obu Butt Kick tekst zestawu poprawny, wadą jest rysunek). Karta Broad Jump — „wyswietlana” (W1 naprawione). Pozostałe karty własne bez nowego wpisu.
