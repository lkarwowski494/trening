# Recenzja niezależna r1 — rodzina v2 `mobility_stand` (partia 2, linia 1.1), 10.11.2026

Recenzent: audytor (sesja r1); nie pisał rodziny, kart ani zestawów (L-047). Stan: `figury/partia-2-mobility_stand` @ c0672ee (od partia-2 @ 109b23c4), odłączony worktree. Skrót rigu v2 (`node scripts/zrodla-runtime.mjs --skroty`): `b163704bf6c6`; `assignAll()` → 36 ćwiczeń rodziny (8 z rysunkiem, 28 bez).

**Werdykt rodziny: do poprawy** (1 × WYSOKIE). Zestawy ogólne 3/3 i karty własne 5/5: wyświetlana. Wpisy do przepisania: `partia2-mobility_stand-r1.json`.

## Metoda
- `arkusz-slad.mjs`: 8 ćwiczeń × side i front = 16 arkuszy (21 kadrów co 0,05), wygenerowane od nowa; `cmp` z arkuszami przerwanego przebiegu — bajtowo identyczne. Kadry u = 0,5 w skali 900 px, obejrzane w pełnej rozdzielczości. `arkusz-nakladka.mjs` dla Standing Lateral Stretch.
- Liczby z `frameAt` (u = 0/0,5/1): kąty kolan, łokci, tułowia i głowy, styki (kapsuły ciała vs podłoga/stopień/ściana), `checkFrame`, przenikanie ciało–ciało.
- Ślad: wszystkie 8 to pozycje statyczne (ISOMETRIC), ruch szkieletu 0 cm; bez ciężaru i przyrządu — brak śladu (decyzja 04.11.2026 (4) B).

## Znaleziska

| ID | Poziom | Pewność | Ćwiczenie | Miara | Realność |
|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | Standing Soleus And Achilles Stretch | props tylko podłoga (brak ściany); chwyt (−9; 92; ±24), łokcie 96° = dłonie na biodrach. Karta `mobility_stand.s.wallCalfSet`: „Oprzyj dłonie o ścianę i cofnij jedną nogę”. Źródło w komentarzu generatora (ACE #152 krok 4) to ten sam stretch przy ścianie; „dłonie na biodrach” nie ma źródła | realny — każdy, kto otworzy ćwiczenie, widzi kartę i rysunek obok siebie |
| Ś1 | ŚREDNIE | 85% | Overhead Triceps Stretch | dłoń R za szyją (y 144; bark y 139,5) wobec „opuść dłoń na środek pleców”; ręka L zwisa wobec „Drugą ręką lekko dociśnij łokieć”. Przybliżenie nazwane w `PRZYBLIZENIA` (limit barku 171°), dla użytkownika niewidoczne; istota pozycji (łokieć 30 cm nad barkiem, zgięty 146°) widoczna | realny, kierunkowo zgodny — backlog |
| N1 | NISKIE | 90% | Standing Gastrocnemius Calf Stretch | na stopniu tylko palce tylnej stopy: 4,1 cm (x −21,2…−17,1), śródstopie ok. 3 cm za krawędzią. Reszta zgodna z gcalf: pięta 3,3 cm poniżej krawędzi, kolano 0°, kąt podudzie–stopa 53,3° (Wall Calf 58,5°), dłonie na ścianie −0,3 cm | realny, kosmetyczny |
| N2 | NISKIE | 95% | Standing Gastrocnemius Calf Stretch | `scripts/figures/agent-pozy/mobility_stand.mjs:81,91` — generator rysuje wariant bez stopnia i `PRZYBLIZENIA` twierdzi, że stopień „nie jest rysowany”, a dane (ACG-013) i aplikacja (`frameAt`) mają stopień. Rozjazd pilnowany przez `ROZJAZDY_POZA_ZAKRESEM` w `tests/figury-generator-odtwarza.test.ts:26` | teoretyczny dla użytkownika (aplikacja rysuje z danych); komentarz mylący |

Poprawka W1 (test odtwarzający): ściana jak w Wall Calf Stretch (x 75) w `props`, dłonie/przedramiona na ścianie (odstęp ≤ 1 cm), kolana jak teraz (tylne 10–30°), pięty na podłodze.

## Sprawdzone bez znalezisk
- **Ruch i liczby:** Chin To Chest (głowa 45°, tułów 0°), Side Neck (przechył głowy 25° ≥ 20°, barki nieuniesione), Standing Chest (łokcie 22° ≤ 25°, łokcie 15,8 cm za barkami, tułów 2°), Wall Calf (tylne kolano 7,9° ≤ 15°, przednie 41,9° ≥ 15°, pięty na podłodze), Standing Lateral (przechył 20° ≥ 15°, w przód 0°). Podeszwy y = 0; stopa–stopień −0,3 cm; przedramię–ściana −0,3 cm; ramię–głowa 0,2 cm (Lateral), przedramię–głowa −0,1 cm (Triceps); `checkFrame` 0 błędów; przenikanie tylko między segmentami sąsiednimi (stawy).
- **Czytelność:** oba widoki pokazywane obok siebie (`components/ExerciseFigureV2.tsx:93–106`), więc Side Neck z boku i Standing Chest z przodu (ręce za plecami) bez przedmiotu pozy to nie wada — przedmiot widać w drugim widoku. W Gastrocnemius z przodu stopień rysowany za przednią stopą — poprawna głębia.
- **Nakładka:** `standLateralPlumb` — pion od miednicy, tylko front, 1 linia, bez tekstu; reguła `sklon_boczny_statyczny` „ustalone”, cue `sb.plane` obecny w zestawie Standing Lateral Stretch. Dopisek `wskazowki_na_reguly["sb.plane"] = ["sklon_boczny_statyczny"]` to odwrotność pola `cue` tej reguły; dla ćwiczeń z wpisem `warianty` reguły i tak wyznacza `warianty` (`scripts/figures/v2-sens.mjs:30`), runtime `reguly-cwiczen.json` ma tę regułę tylko dla Standing Lateral Stretch — nie nowa treść merytoryczna. Reguły „jedno źródło” (bez_skretu, glowa_do_klatki, lokiec_nad_barkiem, obie_kolana_lekko, rece_proste_za_plecami) słusznie bez elementu.
- **Zestawy (K12):** Standing Chest (stretch), Standing Gastrocnemius (gcalf, z N1), Standing Lateral (sb.plane + stretch) — każde zdanie pasuje do rysunku.
- **Karty (K11):** Chin To Chest, Side Neck, Wall Calf — zgodne. Overhead Triceps i Soleus — treść karty zgodna ze źródłem, rozjazd po stronie rysunku (Ś1, W1); karty zostają „wyswietlana” (ten sam skrót co wpis 02.11.2026), rysunek blokuje werdykt v2. V1: żadne z 8 nie ma wpisu v1 → `v1_zastapiona` puste.
- **Testy (K14):** `git diff 109b23c4..c0672ee -- tests/` — tylko liczby i listy po włączeniu rodziny (mapping +8, rejestr 11 rodzin, regex pliku nakładki, eksport 240) i nowy test nakładki; bez poluzowań. Symulacja w worktree recenzji (wpisy z tego pliku, v2 tymczasowo „wyswietlana”, `zrodla-runtime --write`): `figury-recenzja`, `figures-v2-nakladka-kazda-rodzina`, `strona-eksport` — 96/96 zielone (1 pominięty); `l047-recenzja-niezalezna` 10/10, `figures-v2-tor`, `karty-recenzja` zielone — czerwone na c0672ee to tylko brak wpisów.
- **Mięśnie:** brak ról (04.11.2026 (4) B). **Liczby i twierdzenia, prywatność:** bez nazw źródeł w tekstach, bez nowych liczb w UI.
