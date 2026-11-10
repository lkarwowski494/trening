# Recenzja niezależna rodziny v2 `core_hang` — partia 5, runda r2 (audytor, 10.11.2026)

Bramka 4 (L-047, L-050). Stan zamrożony: `figury/partia-5-core_hang` @ 2db4b57 (test 04245f0, poprawka 2db4b57; baza r1 5b7f62f), worktree odłączony. Autor poprawki: programista (subagent, inny niż autor rodziny); recenzent: audytor (subagent). Niczego nie poprawiałem.

**Werdykt rodziny: `wyswietlana`.** Ś1 z r1 naprawione; nowych znalezisk KRYTYCZNYCH/WYSOKICH/ŚREDNICH brak. N1 i N2 z r1 bez zmian (NISKIE, backlog).

## Różnica 5b7f62f..2db4b57
- `lib/figures/v2/poses/core_hang.json`: w 3 ćwiczeniach dopisany `{rodzaj: slupek, x: 0, h: 235}` (drążek y 230 + 5, jak pull_up). Klatki bez zmian (różnica tylko w `sprzet`).
- `scripts/figures/agent-pozy/core_hang.mjs`: ten sam słupek w generatorze (`h: Y_DRAZEK + 5`) — plik danych i generator zgodne.
- K14 `tests/`: nowy `figures-v2-core-hang-slupek.test.ts` (3 ćwiczenia, słupek na osi drążka, h = y + 5, podłoga) — dopisanie, bez poluzowań.

## Ś1 — sprawdzenie na arkuszach (wygenerowane przez audytora z 2db4b57, pełna rozdzielczość)
- `arkusz-slad.mjs`, 3 × side, 21 kadrów: słupek widoczny od podłogi do 5 cm nad drążkiem w każdym kadrze; dłonie na szczycie słupka; postać już nie „wisi w powietrzu”. Kadr u = 1 powiększony (HKR, T2B).
- Toes to Bar u = 1: stopy przy górze słupka (palec y 236, słupek do 235), nogi rysowane przed słupkiem (słupek w warstwie tła, `draw.ts:237`).
- Kolizje: słupki stoją w z = ±64 (pryzmat 62–66, `colliders.ts:86`); ciało najdalej z = 25 (dłonie), stopy z 6–10 — odstęp ≥ 37 cm, brak przenikania. Testy `--runInBand`: core-hang-slupek, nakładka core_hang, figures-v2-tor, figures-v2-styk — 231/231.
- Uwaga bez wagi (nie znalezisko): drążek ma długość 120 (końce z ±60), słupki zaczynają się w z 62 — 2 cm przerwy; widoczne tylko w rzucie z przodu, którego rodzina nie ma (`views: ['side']`). pull_up ma 128. Do ujednolicenia przy ewentualnym rzucie z przodu.
- `arkusz-nakladka.mjs --family core_hang`: łuk biodra HKR bez zmian, słupek nie zasłania elementu.

## Skróty (`node scripts/zrodla-runtime.mjs --skroty` w worktree recenzenta @ 2db4b57)
core_hang `43a33ada7ec7` (r1 @ 5b7f62f: `d5d8a4524dbe` — zmiana wynika z sprzętu w pozach); Hanging Leg Raise `063d8f4c9283`, Hanging Knee Raise `ac21253c514f`, Toes to Bar `369a88554933` — bez zmian wobec 5b7f62f. Zgodne z wartościami podanymi przez programistę.

Ruch, liczby z `frameAt`, karty, nakładka, zestawy, v1 — bez zmian wobec r1 (klatki identyczne); ustalenia r1 obowiązują (`partia5-core_hang-r1-audytor-2026-11-10.md`).

Arkusze (poza repo): `scratchpad/rec-core_hang-r2/`.
