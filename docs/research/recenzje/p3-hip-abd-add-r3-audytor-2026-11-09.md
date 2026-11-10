# Recenzja niezależna bramki 4 — `hip_abd_add`, runda 3 (różnica po D1 A), 09.11.2026

- Recenzent: audytor (L-047, L-050). Stan: `figury/partia-3` @ `37333dc6` wobec rundy 2 (`d7dd7a84`, skrót 086ae0c86f89). Czysta kopia: `(lokalny katalog roboczy recenzenta, poza repo)`.
- Skrót v2.hip_abd_add: **eddcd1af9d43** (zgodny z oczekiwanym).
- Werdykt: **wyswietlana (4/4)**, bez nowych znalezisk.

## Różnica

1. `lib/figures/v2/poses/hip_abd_add.json`, nakładka, zestawy, `figury-sens` (część rodziny): bez zmian (`git diff --stat d7dd7a84 37333dc6` pusty dla tych plików).
2. `contract.ts:330–334` (D1 A): przy dźwigni z punktem „kostki” ślad = kostka strony `trzyma` (R). Wcześniej był to nieruchomy chwyt dłoni, więc ślad miał 0 cm.
3. `DATA_UI.hip_abd_add`: jawne `lowerFirst: false` w 4 wyjątkach. To ta sama wartość co domyślna rodziny, więc fazy się nie zmieniają (Rozsuwanie/Ściąganie 1 s → Powrót 2 s).

## Sprawdzenie na arkuszach śladu

Arkusze w obu motywach: `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)`.

- **Hip Abduction, Hip Adduction (maszyny):** ruch bez zmian. Ślad = kostka R (`frameAt`: trail = ankleR w u 0, 0,5 i 1). Kostka leży na okręgu dźwigni: 41,63–41,75 cm od osi (12,7; 8,4; 18,8) w każdej klatce kluczowej. Z przodu ślad biegnie poziomo wzdłuż ruchu kostki, 0 zawróceń.
- **Cable Hip Abduction, Cable Hip Adduction:** bez zmian. Ślad przy kostce był już wcześniej; wyjątek toru Cable Hip Adduction (front 4,12 cm) bez zmian.

## Skutek dla backlogu

N-3 z rundy 1 („ślad 0 cm nic nie mówi o torze nogi”) jest **zamknięte** przez D1 A. S-1, S-2, N-1 i N-4 z rundy 1 zostają w backlogu bez zmian.
