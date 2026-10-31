# Decyzja 2 — liczby celu pokrycia katalogu 1.1 (do decyzji właściciela, 31.10.2026)

Kontekst: wariant A (cele per wersja) przyjęty 28.10.2026; decyzja 1 = A (30.10.2026). Cel 1.1 w `docs/research/pokrycie-cele.json` jest dziś „startowy” (stan z 28.10.2026, przed bramką recenzji) i ma status „do potwierdzenia”.
Liczby policzone z repo po scaleniu `wersja-1-0-1-r2` → `integracja-1-1` (licznik `scripts/pokrycie-katalogu.mjs`, fixture `tests/fixtures/pokrycie-katalogu.json`, pole `dobre`).
Kolumny „po recenzji 3/4 rodzin” to symulacja: wpis recenzji v2 z bieżącym skrótem dla rodzin, licznik uruchomiony, pliki przywrócone (nic nie zapisane w repo).

| Metryka | Dziś | Po recenzji ruchu squat+bench+hinge | + pull_up | Cel startowy 28.10 |
|---|---:|---:|---:|---:|
| figura v2 w aplikacji | 0 | 87 | 98 | 98 |
| figura w aplikacji (v2 albo v1) | 52 | 139 | 147 | 151 |
| animowany błąd | 0 | 82 | 92 | 92 |
| pełna karta | 0 | 14 | 17 | 17 |
| wskazówki (własne lub zestaw ogólny) | 97 | 167 | 167 | 640 |
| częste błędy (tekst) | 36 | 106 | 106 | 557 |
| własne wskazówki / z częstymi błędami | 97 / 36 | 97 / 36 | 97 / 36 | 102 / 43 |
| komplet tekstów karty (każdy z 35 języków) | 525 | 525 | 527 | 671 (pl, en); 525 (33 pozostałe) |

Skąd różnica 167 → 640: zestaw ogólny jest pokazywany tylko z recenzją treści (bramka 4) — zestawów ogólnych jest 538 (`lib/figures/v2/cue-sets.json`, `b: general`), wpisów recenzji 71 (`docs/research/figury-recenzja.json`, sekcja `zestawy`, wszystkie „wyswietlana”).
Pull_up: 0/13 po recenzji 1.1 (4 WYSOKIE: pu.partial, lpd.fullStretch w 5 zestawach, Gironda; `origin/przekazanie-konta:docs/przekazanie/notatki/recenzje-1-1/ponowne/recenzja-1-1-pull_up.md`).

## Opcje

**A (rekomendacja) — cel = stan startowy 28.10 (odzyskać wszystko, co było przed bramką recenzji), bez nowych rodzin.**
Figura v2 98, w aplikacji 151, animowany błąd 92, pełna karta 17, wskazówki 640, częste błędy 557, własne 102/43, komplet kart 671 w pl/en i w 33 językach.
Wymaga: recenzja ruchu 4 rodzin (decyzja 3), poprawki pull_up (4 WYSOKIE), recenzja treści ok. 467 zestawów ogólnych, 5 nowych kart własnych, przekład ok. 146 kart × 33 języki.
Wykonalność: wszystkie elementy mają gotowy wzorzec w repo (recenzje 1.1 i 1.0.1, przekład przez API) — **wykonalne**; niewiadoma: ile zestawów ogólnych odpadnie w recenzji treści (wtedy cel w tej metryce nieosiągnięty i właściciel decyduje przy bramce, docs/39).
Kompromis: największa wartość dla użytkownika (sekcja „Technika” przy ok. 640 ćwiczeniach zamiast 97) przy najdłuższej pracy agentów — liczba recenzji treści dominuje.

**B — cel = to, co odblokuje sama recenzja ruchu 4 rodzin** (kolumna „+ pull_up”): 98 / 147 / 92 / 17 / 167 / 106 / 97·36 / 527.
Wymaga: decyzja 3 + poprawki pull_up. Wykonalność: **wykonalne**, najmniejsze ryzyko terminu.
Kompromis: 1.1 nie rozszerza wskazówek (zostaje 167), choć tekst 538 zestawów jest już napisany i przetłumaczony w PL/EN.

**C — A + nowe rodziny z gotowymi danymi póz** (np. lunge 24, overhead_press 21, row 12 — kolumna „Dane v2 (niewłączone)” w `docs/55-pokrycie-katalogu.md`): figura v2 ok. 155.
Wymaga dodatkowo: status `ready`, reguły sensu, recenzja ruchu ze śladem (L-050) dla każdej rodziny. Wykonalność: **niesprawdzona** (żadna rodzina z danych nie przeszła jeszcze bramki 4; pull_up 0/13).
Kompromis: więcej rysunków, ale wydłuża 1.1, na którą czekają poprawki 1.0.1 (np. 14 ćwiczeń bez sekcji „Technika”, docs/18 31.10.2026).

Rekomendacja: **A** — cel startowy jest już zapisany i spójny z zapadką; nowe rodziny (C) jako cel 1.2. Przy A warto rozdzielić w docs/39 bramkę: liczby rysunków (twarde) i zestawy ogólne (twarde z wyjątkiem pozycji odrzuconych w recenzji treści, z listą).

Czas (szacunek, nie pomiar): praca agentów (A) — recenzje ruchu 4 rodzin ok. 1 fala (4 agenty równolegle), poprawki pull_up 1 agent + recenzja, recenzje treści 467 zestawów 3–4 fale, przekład 1 przebieg API + recenzent lokalizacji. Czeka się na: E2E, CI. Czas właściciela: tylko ta decyzja i decyzja 3.
