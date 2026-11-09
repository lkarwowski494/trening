# Recenzja niezależna różnicy r3 — rodzina v2 `hip_bridge` (linia 1.1, partia 2), audytor, 09.11.2026

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusz ze śladem toru). Recenzja tylko RÓŻNICY: scalenie `figury/slad-dzwignia` (integracja 55c9f206) w commicie 3a80c913.

**Werdykt rodziny: wyswietlana** (9 ćwiczeń, rysunek bajtowo bez zmian). Machine Hip Thrust nadal wstrzymany: nowy ślad nie usuwa WYSOKIEGO z r1.

## Metoda
- Worktree odłączone: PRZED = 1be8ce3a (rodzic pierwszy 3a80c913 według `git rev-parse 3a80c913^1`; SHA 7d4af5f5 z briefu nie istnieje w repo), PO = 3a80c913.
- Różnica w kodzie: `lib/figures/v2/contract.ts:330-334` — dźwignia z `punkt` poza dłońmi: ślad = kostka (podeszwy/kostki) albo miednica (miednica); wcześniej chwyt dłoni. Pozy `lib/figures/v2/poses/hip_bridge.json` bez zmian.
- `node scripts/figures/arkusz-slad.mjs --out <katalog> --key …` w obu worktree dla 10 ćwiczeń z rysunkiem (lista z wpisu v2.hip_bridge minus London Bridges), widok boczny, 21 kadrów co 0,05.
- `cmp` PNG i HTML przed/po; arkusz, który się różni: porównanie elementów SVG bez elementów śladu (kolor śladu #2A7248, podpis „odstęp”) i oględziny PNG 2100×900 oraz powiększenia kadrów u = 0 i u = 1.
- `npx jest --runInBand tests/figures-v2-slad-dzwignia.test.ts` w PO: 3/3 zielone (ślad Machine Hip Thrust = miednica w u = 0; 0,25; 0,5; 0,75; 1; odległość < 1e-6 cm).
- Skrót: `node scripts/zrodla-runtime.mjs --skroty`: PRZED hip_bridge = 0d9b2af823b2, PO hip_bridge = **8c56e365b9d3**.

## cmp
- Bajtowo równe (HTML i PNG), 9 z 10: Glute Bridge, Glute Bridge (sztanga), Frog Pump, Single Leg Glute Bridge, Hip Thrust (sztanga), Hip Thrust (hantel), Single Leg Hip Thrust, Smith Machine Hip Thrust, Stability Ball Hip Bridge.
- Różni się 1 z 10: **Machine Hip Thrust** (wstrzymany). Po usunięciu elementów śladu pozostałe 1079 elementów SVG są identyczne przed i po, czyli ruch postaci i sprzęt bez zmian. Zmieniły się tylko ślad i podpis odstępu: PRZED −4,7 → −0,7 cm (ślad = chwyt dłoni R), PO stałe −11,9 cm (ślad = środek miednicy, wewnątrz kapsuły miednicy).

## Ocena śladu Machine Hip Thrust (bez zdejmowania wstrzymania)
- Ślad leży dokładnie w punkcie mocowania prowadnicy (`gear.ts:286`: `punkt: 'miednica'` → `to = pelvis`; rysowana podkładka `slidePad` w tym punkcie): 0 cm od rysowanego styku dźwigni, więc kryterium ≤ 3 cm jest spełnione. Na arkuszu ślad biegnie wzdłuż prowadnicy (kąt 73,5°) od u = 0 do u = 1, a wcześniej szedł obok niej, za dłonią. Kierunkowo poprawnie: maszyna obciąża biodra, nie dłonie.
- **WYSOKIE z r1 bez zmian (nierozwiązane):** geometria prowadnicy jest identyczna (x −8,1, y 25,3, **z 0**, długość 34,4). Prowadnica leży w płaszczyźnie środkowej ciała i od u ≈ 0,45 jej dolny odcinek wystaje spod tułowia, czyli przechodzi przez ciało (na PO widać to w kadrach u = 0,50–1,00). Nowy ślad tylko to uwidacznia: punkt styku = środek miednicy, czyli 11,9 cm w głąb ciała zamiast na przedniej powierzchni bioder, gdzie w maszynie leży poduszka. Poprawka danych z r1 jest nadal potrzebna: punkt styku/poduszka na powierzchni bioder albo prowadnica poza ciałem (z ≠ 0). Wstrzymanie w `V2_WSTRZYMANE` zostaje. Realność: realny, gdyby ćwiczenie zostało odblokowane (Karta ćwiczenia → animacja); dziś niewidoczny dla użytkownika.

## Znaleziska różnicy r3
Brak nowych znalezisk KRYTYCZNE, WYSOKIE, ŚREDNIE ani NISKIE (pewność > 80%). Otwarte z r1 i r2 bez zmian, nie blokują: ŚREDNIE Frog Pump, NISKIE Single Leg Glute Bridge (wolna noga zgięta 30,8°), NISKIE gryf −1,6 cm w u = 0, NISKIE przypadek negatywny w `figures-v2-hip-bridge-r1.test.ts`. WYSOKIE Machine Hip Thrust (r1) zostaje otwarte przy wstrzymaniu.

## Sprawdzone bez znalezisk
Ruch postaci w 10 arkuszach (9 bajtowo równych, 1 identyczny poza śladem), ślad w punkcie styku (wszystkie), test `figures-v2-slad-dzwignia` (zielony), skrót v2. Dane i migracje, import i kopia, prywatność, dostępność, ryzyko odrzucenia przez Apple: różnica ich nie dotyczy (zmienia tylko obliczenie śladu w silniku rysunku).
