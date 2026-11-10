# Recenzja niezależna rodziny v2 `row` (wiosłowanie), runda r3 — audytor, 09.11.2026

**Werdykt rodziny: wyswietlana** (0 × KRYTYCZNE, 0 × WYSOKIE, 0 × ŚREDNIE, 1 × NISKIE — pozostałość N1-r2, backlog). W1-r2 (stopy w Chest Supported Row i Lying T-Bar Row) — zamknięte. Recenzent: audytor (nie pisał rodziny ani poprawek; L-047). Autor: programista partii 1.

## Metoda
- SHA autora `0b390518` (gałąź figury/partia-1, commit lokalny — nowszy od `origin/figury/partia-1` 6e4335a0), baza r2 `f1ed0f2d`, N = 3. Czysta kopia: `git archive 0b390518` → `/home/user/rev-p1/row-r3` (node_modules dowiązane). W repo nic nie zmieniane.
- Zmiany w danych rodziny między r2 a r3: w `lib/figures/v2/poses/row.json` różnią się **tylko** Chest Supported Row i Lying T-Bar Row (porównanie pole po polu); w generatorze `row.mjs` jedno wywołanie `stopyNaPalcach(L)` po `lezyPrzodem`; w `gora.mjs` nowa funkcja (STOPA_LEZY_PODBICIE −75, STOPA_LEZY_ODSUN 2).
- Arkusze własne (100 PNG, `arkusze/` w kopii r3): `slad/` 24 (12 ćw. × side, top, jasny), `slad-dark/` 6 (CSR, Lying T-Bar Row, Seal Row × side, top), `nakladka/` 40 (`--family row`, z pozami błędu), powiększenia `kadry/` (stopa CSR jasny, stopy obu ćwiczeń ciemny, kadr u = 0).
- Kontrola „reszta bez zmian”: arkusze r2 nie istniały na dysku, więc wygenerowałem te same 64 arkusze (slad + nakladka) w czystej kopii `f1ed0f2d` (`/home/user/rev-p1/row-r2`). `cmp`: 56 bajtowo równe; różne tylko 8 — CSR i Lying T-Bar Row, side i top, w slad i nakladka. Ruch, nakładka i pozy błędu pozostałych 10 ćwiczeń są identyczne z r2 mimo scaleń integracji (delt_raise, ślad dźwigni bb1072f3) i innych rodzin.
- Liczby z `frameAt` / `jointAngles` / `checkFrame` (u = 0; 0,25; 0,5; 0,75; 1; jednorazowy test w kopii, usunięty po pomiarze).
- Testy w kopii (`--runInBand`): figures-v2-row-p1, figury-generator-odtwarza, figury-rozszerzenia-gora, figury-backlog-r2 — 73/73 zielone. figures-v2-zgodnosc-wsteczna — 21 czerwonych, w tym row/CSR i row/Lying T-Bar Row (uwaga T1).
- `sha` z `node scripts/zrodla-runtime.mjs --skroty` w kopii: v2.row `94a4a8448fe9`; zestawy i karty — bez zmian względem r2 (te same skróty, sprawdzone programowo).

## Ocena W1-r2 (Chest Supported Row, Lying T-Bar Row) — przyjęte
| Miara (prawa noga; lewa taka sama) | u = 0 … 1 (stałe) | Ocena |
|---|---|---|
| palce / pięta nad podłogą | 0,3 cm / 24,5 cm | na palcach, pięty w górze, bez przenikania podłogi |
| `jointAngles.ankle` | −25,3° | zgięcie podeszwowe ok. 25° (zakres człowieka ok. 40–50°) |
| kąt goleń (kolano→kostka) – stopa (pięta→palce) | 64,6° | stopa skierowana ku przodowi goleni (ku podłodze), nie od osoby |
| kolano R / L | 25,2° / 25,2° | lekkie ugięcie; na arkuszu pięty idą ku pośladkom (właściwy kierunek zgięcia u leżącego przodem) |
| biodro | −9,8° | bez przeprostu (r2: −9,4°) |
| `checkFrame` | puste | brak kolizji ciało–ławka–sprzęt |

Na arkuszach side (jasny i ciemny, `kadry/Chest-Supported-Row-stopa.png`, `kadry/dark-stopy.png`) stopa stoi czubkiem na podłodze, piętą do góry, tak jak przy wiosłowaniu leżąc na ławce skośnej. Pozycja nóg jest stała w całym ruchu (bez drgań śladu). Tułów, ręce (łokieć 15° → 120,7°), linia pleców `rowBackLineRef` (side; brak w top) i dźwignia Lying T-Bar Row bez zmian względem r2. W rzucie z góry nogi proste, bez artefaktu nakładki.
Lying T-Bar Row: ślad dźwigni oceniony w stanie bez poprawki 55c9f206 (jeszcze nie w gałęzi) — różnica przyjdzie osobno, nie wchodzi do tego werdyktu.

Test W1-r2 (`tests/figures-v2-row-p1.test.ts`): miara „stopa względem przodu goleni ≤ 60°” + palce przy podłodze + pięta ≥ 10 cm wyżej, negatyw na stopie płasko (> 60°). Dobry — liczy kierunek z bieguna kolana, więc łapie odwrócenie, którego `jointAngles.ankle` (kąt bez znaku) nie łapał. Obejmuje też Spider Curl ×2 (curl), czyli uwagę poza zakresem z r2.

## Znaleziska
| # | Poziom | Pewność | Realność | Ćwiczenie, widok, kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| N1-r2 | NISKIE | 85% | realny | One Arm Row (hantle), side, każdy kadr | łokieć ręki podporowej 47,5° (bez zmian od r2; arkusze bajtowo równe r2) | backlog, jak w r2: ręka podporowa prawie prosta (≤ 20°) |

Brak nowych znalezisk w ruchu, nakładce, zestawach i kartach.

## Uwagi do testów (K14) — `git diff f1ed0f2d..0b390518 -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| tests/figures-v2-row-p1.test.ts | +test W1-r2 (z negatywem), obejmuje row i curl | zaostrzenie, uzasadnione |
| pozostałe 34 pliki | testy innych rodzin partii (calf_raise, chest_fly, delt_raise, kb_ballistic, overhead_press) i listy rodzin | bez poluzowań dotyczących row |
| **T1** tests/fixtures/figury-v2-zlote.json | odciski `row/Chest Supported Row` i `row/Lying T-Bar Row` **nie przeliczone** po zmianie póz (w 0b390518 nadal wartości z f1ed0f2d: 316e414f…) — `figures-v2-zgodnosc-wsteczna` czerwony dla obu (oraz Spider Curl ×2, 2 calf_raise, 10 kb_ballistic, 5 overhead_press — razem 21) | nie wada rysunku i nie wchodzi do progu wydania; zablokuje `tests.yml`/`scal-galaz`. Do zrobienia przez autora: przeliczyć odciski tych póz i dopisać w nagłówku testu „Zmiana celowa 09.11.2026 (row W1-r2: CSR, Lying T-Bar Row; curl: Spider Curl ×2)”. Wspólne z innymi rodzinami partii — dla koordynatora. |

## Zestawy ogólne (K12) i karty (K11)
Skróty z `--skroty` w kopii identyczne z r2 (zestawy: 7c6bbc8acd1f, 9b80c8ad4ad1 ×2, 5ed172b545db ×2; karty: 60840343dff9, dc20a50e5e65, 3d8664a2b089, 79fb2a8a54e6, e8abcaf3ccea). Zdania nie mówią o nogach ani stopach (`csr.chest`, `csr.pull`, `row.elbowsPast`, `row.fullStretch`), a górna część ruchu jest taka sama jak w r2 — werdykty „wyswietlana” potwierdzone. Uwagi „rysunek czeka na W1-r2” w wpisach CSR (karta) i Lying T-Bar Row (zestaw) zaktualizowane.

## Wpisy v1 (K10) — v2.row „wyswietlana”, więc do zmiany na „zastapiona” (09.11.2026)
Bent Over Row (sztanga) `c68db590960f`, Bent Over Row (hantle) `5a447a42e01b`, Pendlay Row `74a518fe67a5`, One Arm Row (hantle) `9998036bd3a9`, T-Bar Row `91f7e0300067`, Chest Supported Row `ee1ec9a77fde` (skróty v1 z `--skroty` w kopii; dziś wszystkie „wyswietlana”). Wzór dopisku w `uwagi`: „| 09.11.2026: zastąpiona rysunkiem v2 (row r3, audytor; partia 1).”

## Tabela ćwiczeń
| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Bent Over Row (sztanga) | wyswietlana | bez zmian od r2 |
| Bent Over Row (hantle) | wyswietlana | bez zmian od r2 |
| Bent Over Row (linki) | wyswietlana | bez zmian od r2 |
| Reverse Grip Bent Over Row | wyswietlana | bez zmian od r2 |
| Barbell Rear Delt Row | wyswietlana | bez zmian od r2 |
| Pendlay Row | wyswietlana | bez zmian od r2 |
| Smith Machine Bent Over Row | wyswietlana | bez zmian od r2 |
| One Arm Row (hantle) | wyswietlana | N1-r2 (NISKIE, backlog) |
| T-Bar Row | wyswietlana | bez zmian od r2 |
| Seal Row (sztanga) | wyswietlana | bez zmian od r2 |
| Lying T-Bar Row | wyswietlana | W1-r2 zamknięte; ślad dźwigni bez 55c9f206 |
| Chest Supported Row | wyswietlana | W1-r2 zamknięte |
| Meadows Row | bez rysunku | nadal brak wpisu w `data/zrodla/figury-wyjatki.json` (K3, uwaga z r1) |

Liczba ćwiczeń rodziny z `assignAll()`: 13 (12 z rysunkiem).
