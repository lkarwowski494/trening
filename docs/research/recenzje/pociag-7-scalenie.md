# Recenzja scalenia pociąg-7 (d44557a2)

- autor: programista sesji I (scalenie d44557a2)
- recenzent: audytor (subagent)
- data: 10.11.2026
- zakres: scalenie `figury/partia-8` @ 213c3f9e (core_standing, sled_throw, strongman) do `integracja-1-1` @ 57406e7f (plyo, core_floor, glute_floor, leg_isolation, lunge); baza 649b0504. Sprawdzone: (1) kompletność wpisów obu stron, (2) zmiana R3-W1 w `lib/figures/v2/draw.ts` i skróty rysunków, (3) recenzja ruchu lunge / Barbell Side Split Squat (bramka 4, L-047, L-050). Jest nie był uruchamiany (tylko lekkie skrypty node).

## Znaleziska

| # | Poziom | Pewność | Realność | Opis | Dowód |
|---|---|---|---|---|---|
| Z1 | ŚREDNIE (blokuje scalenie, nie wydanie) | 99% | realny | Na d44557a2 rodzina lunge (24 ćwiczenia) jest ukryta w aplikacji i na stronie: wpis recenzji ma `sha: f2ff1a209120`, a bieżący skrót to `f6b935560af3` (R3-W1). `lib/figures/data.json` `.v2` nie zawiera `lunge` (u rodzica 57406e7f zawiera). Test `tests/recenzja-wyjatki-1-1.test.ts` (oczekiwana lista `v2` z `'lunge'`) padnie, więc `tests.yml` będzie czerwony. Kroki w aplikacji: dowolne ćwiczenie lunge (np. Walking Lunges) → karta bez rysunku. | `node -e` z `rodzinyZAktualnaRecenzja(recenzja())` → `false 39 f6b935560af3 f2ff1a209120`; `scripts/zrodla-runtime.mjs:99`. Naprawa po tej recenzji: `sha` → `f6b935560af3` + przeliczenie plików generowanych. |
| Z2 | NISKIE (blokuje verify) | 99% | realny (CI) | `docs/55-pokrycie-katalogu.md` jest nieaktualny: kolumna „cel” pokazuje cele sprzed scalenia (527/531/274/570/443/564/498/527), a `pokrycie-cele.json` ma już 526/530/273/569/442/586/520/526. `npm run check:pokrycie` → kod 1. | `node scripts/pokrycie-katalogu.mjs --check` → „docs/55-pokrycie-katalogu.md nieaktualne”; `--write` w kopii roboczej zmienia tylko 8 wierszy tabeli. |
| Z3 | NISKIE (backlog) | 90% | realny, słabo widoczny | Próg R3-W1 `|o[0]| ≥ 1 cm` daje skok gryfu o ok. 1,15 cm w jednym kroku animacji (u ≈ 0,030 → 0,035; zwykły krok to ok. 0,2 cm): gryf stoi w środku, a potem od razu przeskakuje do rzutu środka. To ok. 1–2 px na ekranie. | `lib/figures/v2/draw.ts:426`; pomiar co 0,005 u na `shapesAt(…, 'front')` dla Barbell Side Split Squat: maxJump 1.15 przy u=0.035, zakres x od −21,5 do 0 cm. |

Liczby pewności i realności są według CLAUDE.md, „Audyty i wydania” pkt 6.

## 1. Kompletność wpisów (suma obu stron)

Metoda: wybrałem 38 plików zmienionych po obu stronach (`comm` z `git diff --name-only` baza→rodzic). Pliki tekstowe sprawdziłem liniami: linie dodane przez rodzica, których brak w wyniku, oraz linie usunięte przez rodzica, które wróciły w wyniku. Pliki JSON sprawdziłem strukturalnie, ścieżka po ścieżce: zmiana każdej strony względem bazy musi być obecna w wyniku.

- `lib/figures/v2/families.ts`, `tests/l047-lista-zamrozona.json`, `docs/18-przekazanie.md`, `docs/brd/wymagania.md`, `tests/figury-recenzja-p4b.test.ts`, `tests/zrodla-pelne-cues-a4-core.test.ts`, `tests/strona-eksport-recenzja.test.ts`, `tests/figures-v2-kierunek-u.test.ts`, `tests/figures-v2-zgodnosc-wsteczna.test.ts`: 0 utraconych linii, 0 przywróconych usunięć.
- Sprawdzone strukturalnie i bez strat (0/0, żadnej zmiany tylko po stronie scalenia): `docs/research/figury-recenzja.json`, `lib/figures/v2/reguly-cwiczen.json`, `lib/cues/data.json`, `tests/tor-wyjatki.json` (usunięcie „Plyo Push-Up|side” przez 57406e7f zachowane, „Lunge Pass Through|front” jest).
- `lib/figures/data.json`: jedyna „strata” to `v2[] lunge`. To skutek Z1, a nie błąd sumowania.
- `lib/figures/v2/overlay.ts`: mapa TECHNIQUE ma 39 kluczy, czyli sumę obu stron (36 z integracji + 3 z partii 8). Typ `TechniqueDef` z polem `side` i `parallelGuide` pochodzą z partii 8. `lib/figures/v2/gear.ts`: ta sama poprawka z, plus komentarz R2-W1 z partii 8.
- `docs/research/pokrycie-cele.json` (cele 1.1): 47 liczb, 0 różnic z `node scripts/pokrycie-symulacja.mjs --json`. Spadki względem 57406e7f o 1 (figura.v2, wAplikacji, animowanyBlad, wskazowki.zTekstem, czesteBledyTekst, recenzjaFigur) wynikają ze wstrzymanego Barbell Side Bend (V2_WSTRZYMANE, partia 8) i są wynikiem symulacji.
- `tests/fixtures/pokrycie-katalogu-min.json`: żadne minimum nie spada względem żadnego rodzica (96 liczb). Uwaga: stan „figura v2 w aplikacji” = 502 tylko przypadkiem równa się minimum (−24 lunge ukryta przez Z1, +24 partia 8).
- Liczby w testach wynikają z sumy obu stron:
  - `figures-v2-mapping`: oczekiwane 535 = policzone 535 specyfikacji (`figureSpec` po `assignAll`; core_standing 16, sled_throw 8, strongman 1, lunge 24).
  - `strona-eksport` 526 = 502 + 24 (16 core_standing − 1 wstrzymane + 8 + 1).
  - `gemini` „rodzin: 3” = w docs/51 zostały 3 rodziny „do zrobienia” (cardio, foam_roll, neck).
  - `cel-1-1` c = 73 i pelnaKarta 520 zgadzają się z symulacją.
- Pozostałe kontrole generowane: `check:cues`, `claims`, `decyzje`, `figures`, `zrodla-runtime`, `readme`, `pochodne`, `znaczniki`, `slowniki`, `matrix`, `v2-gen --check` — wszystkie z kodem 0. Wyjątek: `check:pokrycie` (Z2).

## 2. R3-W1 (`draw.ts`) i skróty

- Warunek `view === 'front' && Math.abs(o[0]) >= 1 ? o[0] : 0` (`lib/figures/v2/draw.ts:426`) działa tylko w gałęzi „gryf w poprzek, nie z boku”. `o = proj(c, 'front')`, więc `o[0] = −c[2]` (`draw.ts:28`), czyli rzut boczny środka sztangi. Widok `top` jest bez zmian. Warunek jest poprawny co do kierunku: gryf i talerze idą razem z chwytem. Jedyny skutek uboczny progu opisuje Z3.
- `node scripts/zrodla-runtime.mjs --skroty`: d44557a2 w porównaniu z d44557a2^1 (worktree w scratchpadzie):
  - v1: 0 różnic z 71
  - karty: 0 z 311
  - zestawy: 0 z 339
  - v2: zmienia się tylko `lunge f2ff1a209120 → f6b935560af3`; dochodzą `core_standing ba395c4d26d1`, `sled_throw dade4388eeaa`, `strongman 04b91430146d`.
- Rodziny spoza partii 8 poza lunge nie zmieniły się. Skróty trzech rodzin partii 8 są równe wpisom recenzji (werdykt `wyswietlana`). Poza lunge żaden wpis v1, kart ani zestawów nie jest nieaktualny.

## 3. Recenzja ruchu: lunge / Barbell Side Split Squat (skrót f6b935560af3)

Arkusze ze śladem toru (`scripts/figures/arkusz-slad.mjs`, playwright):
- po R3-W1 (d44557a2):
  - `(scratchpad sesji I, poza repo)/arkusze-lunge/Barbell-Side-Split-Squat-front.png`
  - `(scratchpad sesji I, poza repo)/arkusze-lunge/Barbell-Side-Split-Squat-side.png`
- przed R3-W1 (d44557a2^1):
  - `(scratchpad sesji I, poza repo)/arkusze-lunge-przed/Barbell-Side-Split-Squat-front.png`
- kadry powiększone:
  - `(scratchpad sesji I, poza repo)/crop_front_0.png` (u=0)
  - `(scratchpad sesji I, poza repo)/crop_front_1.png` (u=0,5)
  - `(scratchpad sesji I, poza repo)/crop_przed_u050.png` (przed, u=0,5)

Ocena:
- Widok z przodu: barki schodzą w bok i w dół na nogę pracującą (ok. 21,5 cm w bok). Gryf leży na barkach, dłonie są na gryfie, a środek gryfu w każdym kadrze leży na linii śladu (początek nad środkiem ciała, koniec nad nogą pracującą). Przed R3-W1 gryf stał w środku kadru, a ciało przesuwało się pod nim, więc środek gryfu był ok. 6 cm obok śladu. Zmiana poprawia rysunek.
- Kolano nogi pracującej jest nad stopą, a noga wyprostowana idzie w bok. To zgadza się z kartą (zestaw ogólny `lunge.knee` „Przednie kolano w linii palców stopy.”, `sq.back` „Plecy proste, klatka uniesiona.”, błąd `lunge.mis.kneeIn`; `lib/figures/v2/cue-sets.json`, `lib/cues/text/pl.json`).
- Gryf przecina rzut tułowia na wysokości barków. Tak wygląda sztanga na plecach w rzucie z przodu, ciało nie przechodzi przez sprzęt.
- Talerze prawej strony przechodzą w rzucie przez słupek stojaka. Widok z boku pokazuje, że stojak stoi za ćwiczącym (inna głębokość), więc to nakładanie się rzutów, a nie kolizja.
- Widok z boku: PNG jest identyczny przed i po (`cmp`), czyli bez zmian względem recenzji partii 9 r2.
- Odstęp ciężaru 1,7 cm we wszystkich kadrach.

**Werdykt: `wyswietlana` — skrót f6b935560af3.** Z3 (skok o ok. 1 cm przy progu) jest kosmetyczny i nie zmienia oceny.

## Sprawdzone bez znalezisk

- dane i migracje: brak zmian schematu w scaleniu
- import i kopia: nie dotyczy
- prywatność i sekrety: diff scalenia bez kluczy i identyfikatorów
- dostępność: brak zmian UI
- liczby i twierdzenia merytoryczne: cele i minima zgodne z symulacją
- ryzyko odrzucenia przez Apple: nie dotyczy
