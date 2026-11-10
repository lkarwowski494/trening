# Recenzja niezależna rundy 2 — pulldown (partia 3), 09.11.2026

Recenzent: audytor (L-047: autor — programista partii 3). Zakres: różnica a9c220be → d7dd7a84 (poprawka N1). Czysta kopia: `git archive d7dd7a84` → (lokalny katalog roboczy recenzenta, poza repo) Jest nie był uruchamiany (polecenie koordynatora).

## Werdykt rodziny: wyswietlana (8/8)

N1 (WYSOKIE, runda 1) — **naprawione**.

| Sprawdzenie | Wynik |
|---|---|
| Zmiana w danych | tylko pole `x` wyciągu w Straight Arm Pulldown: 62 → 88 (generator: `Math.round(S0[0] + re + 12)`) |
| Pozostałe 7 ćwiczeń, `kontrakt`, `rodzina` | bajtowo te same co w a9c220be (porównanie JSON) |
| Kolumna a drążek | ściana kolumny x 83 (towerW 10); skrajny chwyt x 76,2 przy u 0,375 (201 próbek) — odstęp ok. 6,8 cm w każdym kadrze |
| Linka | od bloczka (88, 215, 0) do środka drążka; nie przecina kolumny ani ciała; w górze łuku prawie pionowo przy ścianie kolumny, przy dole ukośnie — sensownie |
| Rzut z przodu | kolumna za postacią, drążek przed kolumną, bez przenikania |
| Ruch | bez zmian: łuk prostych rąk, shElev 143° → 27°, łokieć ≤ 20° |
| Tor (`ksztaltToru`, 25 próbek) | side 31,63 cm / 1 zawrócenie; front 0 / 0 — wyjątek „31,6 cm” **potwierdzony**, liczba aktualna |
| Generator | `odtwarzanie-poz.mjs pulldown` — brak rozjazdów, pozy ważne |
| Skrót v2.pulldown | 335199eb4c79 (zgodny z oczekiwanym) |

Arkusze: (lokalny katalog roboczy recenzenta, poza repo){side,front}.png, (lokalny katalog roboczy recenzenta, poza repo)…, kadr powiększony (lokalny katalog roboczy recenzenta, poza repo), nakładka (lokalny katalog roboczy recenzenta, poza repo) (16 arkuszy).

## Backlog (z rundy 1, nie blokują)

N2, N3 (Wide-Grip Behind The Neck), N4 (wałki ud), N5 (EN „Pulling back” → „Pulling”, decyzja koordynatora, wdrożenie osobno) — ŚREDNIE; N6, N7 — NISKIE.

## Uwaga procesowa (poza progiem produktu)

U-1: wzorzec `tests/fixtures/figury-v2-zlote.json` (ostatnia zmiana f546a93b, sprzed poprawki) ma stary odcisk `pulldown/Straight Arm Pulldown` (linia 2151) oraz klucze `hip_abd_add/Lateral Band Walk` i `/Monster Walk` (1455, 1459). `tests/figures-v2-zgodnosc-wsteczna.test.ts:105–107` porównuje odciski i zbiory kluczy wszystkich póz — spodziewany czerwony `tests.yml`, dopóki wzorzec nie zostanie świadomie odtworzony (`ZLOTE_ZAPISZ=1`) z wpisem zmiany celowej w nagłówku testu. Pewność ok. 90% (wniosek z kodu testu, bez uruchomienia Jest).
