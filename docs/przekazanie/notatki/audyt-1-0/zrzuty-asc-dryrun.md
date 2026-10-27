# asc-zrzuty.yml — dry-run (27.10.2026, agent „zrzuty 1.0”)

Przebieg 40498673936 (zrzuty-1-0 @ 4b4b7ff6), `tryb: dry-run`, `zrzuty_z_przebiegu: 40487178778` (store-screenshots pl,en, artefakt sklep-zrzuty-ramki), `rozmiar: 6.9`,
`zegarek_z_przebiegu: 40477377838` (watch-sim, 35 języków, PNG bez alfy). Wynik: **zielony, „wgraj 2, pomiń 41”; nic nie zapisano** (zadanie `zapis` pominięte, bez środowiska release).

- iPhone pl (pl, IPHONE_DYNAMIC_ISLAND_LARGE_PROFILE): 10 zrzutów — **wgraj**. Brak błędów alfa/wymiarów.
- Zegarek pl (WATCH_SERIES_10_PROFILE): 6 zrzutów (stary zestaw ze stanem „paused”; po poprawce 5) — **wgraj**.
- iPhone en (en-US, en-GB, en-AU, en-CA) i zegarek w 31 językach: **pomiń — brak lokalizacji wersji w ASC** (najpierw workflow „ASC metadane sklepu”, Z-14: w ASC jest tylko lokalizacja pl).
- bg, et, lt, lv, sl, sr: pomiń — sklep nie ma tej lokalizacji (docs/45).
- Wniosek: zanim `apply` ma sens dla pozostałych lokalizacji, właściciel wykonuje Z-14 (metadane wszystkich lokalizacji); wtedy ten sam dry-run pokaże „wgraj” dla każdej.
