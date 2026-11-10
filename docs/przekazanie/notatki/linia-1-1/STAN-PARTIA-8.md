# Stan partii 8 (linia 1.1, tura 3) — core_standing (16), sled_throw (8), strongman (1)

Aktualizacja: 10.11.2026 ~13:45 UTC (sesja E, session_01T66VBvTx4J3wo4LsZx4yjb; przekazanie przy kontekście ~31%). Koordynator: session_01T66VBvauzmGEDCSRshqWXa.
Gałąź `figury/partia-8` (od b66ecfa2); gałęzie rodzin (wypchnięte): `figury/partia-8-core_standing`, `figury/partia-8-sled_strongman` — NIE są jeszcze scalone do `figury/partia-8`.
Briefy: `briefy/partia-8-autor.md`, `briefy/partia-8-recenzent.md`. Model: autor (subagent programista) → audytor r1 → poprawki (inny programista) → r2 → przepisanie 1:1 do figury-recenzja.json.
KO-022 (podział poseData.ts per rodzina) zrobiony w tej sesji (`scal/posedata-podzial` 24b461e3, scalony przez koordynatora: integracja 038efefc). Obie gałęzie rodzin mają go scalonego lokalnie (pliki `lib/figures/v2/rodziny/<rodzina>.ts`).

## Stan rodzin
| Rodzina | Gałąź / głowa | Recenzja (docs/research/recenzje/partia8-*) | Stan |
|---|---|---|---|
| core_standing | partia-8-core_standing, d3e22931 (+ ewentualnie commit poprawki R2-W1 — sprawdź `git log`) | r1 do poprawy (W1–W5), r2 do poprawy: zostaje R2-W1 Landmine Rotation (sztanga 20 cm i ślad na osi z = 0, dłonie z ±19 cm; gear.ts:106 zeruje z przy podazaZaChwytem) | poprawka R2-W1 była w toku (subagent) → potem r3 różnicy; jeśli poprawka zmienia skróty innych rodzin → wstrzymać Landmine Rotation (V2_WSTRZYMANE) jako decyzja do weta |
| sled_throw | partia-8-sled_strongman, 58232ce7 | r1 do poprawy (W1 Backward MBT — naprawione 91e0c006); r2 wyswietlana (skrót v2 e936d3d6c19d; karty i zestawy: partia8-sled_throw-r2.json) | gotowa do przepisania |
| strongman | partia-8-sled_strongman, 58232ce7 | r1 wyswietlana (skrót v2 04b91430146d) | gotowa do przepisania |

## Decyzje do weta (wpisy w docs/18 na gałęziach rodzin)
- KO-027: Barbell Side Bend → V2_WSTRZYMANE (silnik bez pochylenia gryfu w płaszczyźnie czołowej), cel 1.1 −1 — przyjęte do weta przez koordynatora.
- Pusta nakładka strongman — nazwany wyjątek jak mobility_floor (reguły „analogia”), strażniki kazda-rodzina, mobility-floor, interaction-guards S20.
- Jarzmo Yoke Walk rysowane sztangą — uproszczenie w figury-ograniczenia-silnika.json.

## Następne kroki
1. core_standing: wynik poprawki R2-W1 → recenzja r3 (różnica, audytor) → przepisanie wpisów 1:1 z r3/r2 json (v2, zestawy, karty) do `docs/research/figury-recenzja.json`.
2. sled_throw + strongman: przepisanie 1:1 — sled z `partia8-sled_throw-r2.json`, strongman z `partia8-strongman-r1.json` (r2 potwierdziła: skróty strongman bez zmian).
3. Scalenie do `figury/partia-8`: obie gałęzie rodzin + `origin/integracja-1-1`. KONFLIKT do rozstrzygnięcia: `lib/figures/v2/contract.ts` — core_standing (ślad = środek piłki z props `ball`, + landmine) vs sled_throw (ślad = środek chwytów). Rekomendacja: wersja core_standing; zmienia skrót v2 sled_throw → recenzja różnicy scalenia (audytor) na scalonym SHA. Listy w testach (mapping, strona-eksport n, gemini-polecenia, skrot-v2-wynik regex, tor-wyjatki, nakladka-triceps-olympic) — suma obu stron, liczniki z uruchomienia. `gemini-polecenia` był czerwony na gałęzi core (rodzin 15 vs 14) — przeliczyć po scaleniu. Cele 1.1 = `pokrycie-symulacja --json`.
4. verify:szybkie (pod obciążeniem ~45 min, limit 2 h) → push → tests.yml zielony → PRZEKAZANIE do koordynatora.
5. Przekład: nowe teksty UI brak (fazy z istniejących PhaseName) — szacunek 0 zł.

## Pułapki
- Pliki recenzentów trzymane poza repo do przepisania (tu skopiowane do docs/research/recenzje, żeby nie zginęły z kontenerem).
- Test L-080 w skrot-v2-wynik po KO-022: nowy plik rodziny wymaga `git add -A` (naprawione na podziale).
- Maszyna 4 rdzenie: verify + 2 agentów → load 9–12; test-fast 119 plików ~42 min.
