# Recenzja niezależna rodziny v2 `plyo` — partia 6, runda 3 (audytor, 10.11.2026)

Bramka 4 (L-047, L-050). Stan zamrożony: `figury/partia-6` @ 77359b5. W pliku póz względem e73f097 zmienione tylko Double Leg Butt Kick i Single Leg Butt Kick (sprawdzone porównaniem). Autor: programista partii 6; recenzent: audytor.

## Werdykt rodziny: **wyswietlana** — 0 × KRYTYCZNE/WYSOKIE; ŚREDNIE S1–S2 i NISKIE N1–N4 (+ `podpora()` bez osi z) do backlogu

## (a) W2 — naprawione
Arkusze `arkusz-slad` wygenerowane samodzielnie: oba Butt Kick × rzut z boku i z przodu, 21 kadrów, ślad = miednica. Liczby z `frameAt` (siatka 1/100):
- Double Leg Butt Kick (obie nogi, u 0,75): kolano 138°, biodro 22° (udo przy pionie), pięta 29 cm za środkiem miednicy i 15 cm niżej, 34 cm od środka miednicy (ok. 25 cm od powierzchni pośladka przy obwodzie miednicy 9,5 cm), kolana 39 cm pod miednicą. Na arkuszu z boku pięty wyrzucone w tył pod pośladki, goleń skierowana w górę; z przodu symetrycznie, bez rozjazdu nóg. Ruch zgodny z nazwą i odróżnialny od Tuck Jump (tam biodro 115°).
- Single Leg Butt Kick (noga wolna L, u 0,70): kolano 139°, biodro 21°, pięta 28 cm za miednicą, 34 cm od niej; noga skacząca R bez zmian. Pięta do pośladka nogą wolną w czasie podskoku — zgodne z nazwą.
- Zestaw ogólny (jump.land, jump.mis.stiff; przy Double także jump.drive) zgodny: wybicie z wyprostem (kolano i biodro ≤ 11°), zamach rąk (dłonie 60 cm nad barkami), lądowanie kolano 90° / biodro 93° (Double), noga podporowa Single bez zmian.

## (b) Miara testu — akceptowalna
Próg „pięta ≤ 30 cm od miednicy” z r2 jest w tym modelu nieosiągalny: zakres czynny kolana w kontrakcie to 141° (`lib/figures/v2/contract.ts`, komentarz przy wyjątku `kneeMax`), a przy 138–140° pięta wychodzi 34–37 cm od środka miednicy. Miara w teście (kolano ≥ 130°, biodro ≤ 45°, pięta.x − miednica.x ≤ −20 cm, odległość ≤ 36 cm, negatyw na pozach r1 i r2) rozróżnia trzy przypadki: r1 (goleń poziomo, kolano 99°), r2 (kolana do klatki, biodro 125°, pięta przed miednicą) i r3 — akceptuję. Odległość liczona do środka miednicy, nie do pośladka, więc 36 cm to ok. 25 cm od powierzchni. W opisie testu warto nazwać to uproszczeniem wynikającym z limitu kolana (NISKIE, bez wpływu na wydanie).

## (c) Regresje — brak
- Pozostałe 25 póz identyczne z e73f097; `v2-validate.mjs` dla 27 póz — wszystkie OK.
- Double: lot ≥ 3 cm (maks. 29 cm), przenikanie 0,0 cm, maks. krok miednicy 4,7 cm na 1/96, lądowanie w miejscu startu. Single: lot maks. 22 cm, krok ≤ 2,7 cm.
- Testy (`--runInBand`): nowe testy W1/W2 z negatywem i `figures-v2-tor` zielone; czerwony nadal ten sam co w r1–r2 (brak elementu nakładki, bo zestawy ogólne nie mają jeszcze wpisu recenzji) — zniknie po przepisaniu wpisów `zestawy`.
- Skróty zestawów i kart bez zmian względem r2; zmienił się tylko skrót v2.plyo.

## ŚREDNIE / NISKIE — bez zmiany klasy
S1 (miednica w locie za kostkami albo przed nimi; Double Butt Kick: 4…30 cm, 3 zawrócenia) i S2 (Star Jump) — ŚREDNIE; N1–N4 i `podpora()` bez osi z — NISKIE. Autor skierował je do backlogu (docs/21).
