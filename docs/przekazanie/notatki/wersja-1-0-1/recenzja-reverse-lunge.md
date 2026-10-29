# Recenzja niezależna bramki 4 — Reverse Lunge (figura v1), wersja 1.0.1

Recenzent: audytor (sesja 1.0.1, niezależny; nie autor poprawki). Data: 29.10.2026.
Przedmiot: worktree `/home/user/trening/.claude/worktrees/agent-a39d21d1dfa53edf7`, gałąź `r2/reverse-lunge`, HEAD 85a7ce3, zmiany `git diff aef5d8b 85a7ce3` (`data/zrodla/figures.json` → Reverse Lunge mid / mid2 / end, notatka; testy `tests/figury-podparcie.test.ts`).
Kryterium: decyzja właściciela z 29.10.2026 (stopa unosi się pionowo → cofa się w powietrzu → staje na palcach za ciałem → opuszczenie). Karta `lib/cues/data.json` „Reverse Lunge”: lunge.stand, lunge.back („Zrób krok w tył i opuść się, aż tylne kolano będzie tuż nad podłogą; wróć, odpychając się przednią nogą”), lunge.torso („Plecy proste przez cały ruch”).

## Werdykt: ZATWIERDZONE

Brak znalezisk KRYTYCZNYCH, WYSOKICH i ŚREDNICH. Dwa NISKIE (backlog, nie blokują). Figura nie przeczy karcie i jest czytelnym wykrokiem w tył.

## Metoda

- Geometria z modułu aplikacji: `lib/figures/geom.ts` z worktree (identyczny z kopią skryptów recenzji; `diff` bez różnic). Skrypty: `/tmp/claude-0/-home-user-trening/22a5d54a-fd35-5956-8784-cf11c89aac0b/scratchpad/aud-rl/` (`m.mjs`, `drag.mjs`, `rom.mjs`, `com.mjs`; kopie skryptów z `scratchpad/aud` przestawione na ten worktree), 101 póz na przejście (rom, ślizg), co 0,05 (podparcie, środek ciężkości — jak walidator).
- Styk = punkt ≤ 1,5 j. nad podłogą (LIM.contact). Ślizg: odległość punktu w styku od jego położenia w najbliższej pozie kluczowej, w której ten punkt też jest w styku (`slizg` w `tests/figury-podparcie.test.ts:313-321`); dodatkowo surowo, wobec sąsiednich póz kluczowych (`drag.mjs`).
- Podgląd: `/tmp/claude-0/-home-user-trening/22a5d54a-fd35-5956-8784-cf11c89aac0b/scratchpad/reverse-lunge/podglad/podglad.png` (klatki, pozy pośrednie 0,25/0,5/0,75, arkusz śladu toru), oceniony w pełnej rozdzielczości 1500×1515; kadry zgodne z pomiarem punktów z HEAD (np. mid: tylne kolano przed przednim, mid2: palce na podłodze, end: tylne kolano 6,3 j.).
- `npx jest tests/figures.test.tsx tests/figury-podparcie.test.ts tests/figury-recenzja.test.tsx` — 116/116 zielone (drzewo czyste).

## Pomiary

| Kryterium | Wynik | Ocena |
|---|---|---|
| Przednia stopa (toe, heel) | 0,00 j. przesunięcia w całym ruchu | OK |
| Tylna stopa przy oderwaniu (start→mid) | palce: x 0 → −0,8 j. zanim wzniosą się > 1,5 j. (k≈0,5); pięta 0,5 j. | OK (≤ 2) |
| Tylne palce po lądowaniu (mid2→end) | lądowanie x −43,8; w styku −44,9 … −42,0; maks. 1,8 j. od miejsca lądowania (1,1 w tył, potem do przodu) | OK (≤ 2) |
| Tylne palce tuż przed lądowaniem | wchodzą w pas ≤ 1,5 j. przy x −40,1 (k≈0,91), 3,7 j. przed miejscem lądowania, opadając z 1,5 do 0,8 j.; wobec najbliższej pozy kluczowej w styku (end, −42,0) 1,9 j. | w granicy metody; uwaga poniżej |
| Pionowe uniesienie (decyzja 29.10) | kostka tylnej nogi: start x −11,0 → mid −9,5 (Δ 1,5 j.); stopa w mid: palce 8,5 j., pięta 12,6 j. nad podłogą (niewysoko, ok. 15–22 cm) | OK |
| Cofnięcie w powietrzu (mid→mid2) | palce x −0,1 → −43,8 monotonicznie, wysokość 8,5 → 0,8 j. | OK |
| Opuszczenie dopiero po postawieniu stopy | biodro: 54,0 (start) → 53,1 (mid) → 46,4 (mid2, lądowanie) → 31,0 (end); spadek przy stopie w powietrzu 4,6–5,3 j. (LIM.hipDrop 7) | OK |
| Jedna podpora (mid) | środek ciężkości x −1,5 nad stopą [−14; 0]; w całym odcinku ze stopą > 2 j. w granicy ± 2,5 j. (maks. −15,9 przy k=0,80) | OK (`jednaPodpora` = []) |
| Podparcie | `podparcieMiary` = [] | OK |
| Wejście pod podłogę | najgłębiej 0,20 j. (palce tylnej stopy, start→mid k=0,10–0,15), pod kreską podłogi; LIM.penetration 1 | OK |
| Zakres stawów (rom, wszystkie pozy pośrednie) | biodro −8,0…77,5 [−17; 133]; kolano 0…110,1 [0; 141]; kostka 0…35,7 [−60; 37]; biodro2 −6,8…28,9; kolano2 0…110,4; kostka2 0…34,8; ręce 0 | wszystko w zakresie (w r1 biodro2 −20° poza −17°) |
| Karta: krok w tył | tylne palce 42,0 j. za przednimi (28 j. za przednią piętą; ok. 0,42 wzrostu) | czytelny krok |
| Karta: tylne kolano tuż nad podłogą | end: kolano2 6,3 j. (ok. 11 cm) | OK |
| Karta: plecy proste / stań prosto | tułów 86,9–91,0° (start 90°) | OK |
| Pozycja dolna | tylne udo pionowo (biodro −20,5 / kolano −17,1), tylna goleń prawie poziomo, pięta w górze (stopa na palcach); przednie udo prawie poziomo, przednie kolano 3,6 j. przed palcami | typowy wykrok „90/90”; karta Reverse Lunge nie ma wskazówki o kolanie względem palców |

Uwaga do opisu autora: „palce tylnej stopy 36–37 j. za przednimi” — w HEAD zmierzyłem 42,0 j. (end) i 43,8 j. (mid2). Niezależnie od tego krok jest czytelny; rozbieżność dotyczy tylko opisu, nie danych.

## Znaleziska

| # | Poziom | Pewność | Figura | Opis | Kroki w aplikacji | Realność | Dowód |
|---|---|---|---|---|---|---|---|
| 1 | NISKIE | 85% | Reverse Lunge | „Wysokie kolano” w mid: przy pionowym uniesieniu stopy tylne kolano wychodzi 15,6 j. (ok. 27 cm) przed przednie kolano (x 10,1 wobec −5,5), udo w 29° zgięcia, kolano 80°. W kadrze mid i przejściach do niego szara noga wygląda przez chwilę jak uniesienie kolana w marszu, potem stopa zawraca w tył. Przy prawdziwym kroku w tył kolano zwykle nie wychodzi tak daleko przed nogę podporową. Wynika z decyzji o pionowym uniesieniu (kostka nad miejscem startu, test ≤ 3 j.), nie przeczy karcie, ruch pozostaje czytelny. Możliwa poprawka w backlogu: mniejsze zgięcie biodra w mid (np. 15–20°) przy dopuszczeniu kostki 3–5 j. za miejscem startu. | Reverse Lunge → Technika → animacja (po zatwierdzeniu) | realny (każde wyświetlenie), kosmetyczny | `data/zrodla/figures.json` Reverse Lunge mid: hip [−8, 28.9], knee [4.2, 79.9]; `m.mjs`: KEY mid knee=(−5.5,28.4) knee2=(10.1,31.1); podglad.png kadr „KLATKA mid” |
| 2 | NISKIE | 80%+ | Reverse Lunge | Płaskie lądowanie: ostatnie ok. 3,7 j. drogi tylnych palców przebiegają 0,8–1,5 j. nad podłogą (opadanie 1,5 → 0,8 j., czyli kąt podejścia ok. 11°), więc na telefonie palce przez chwilę „muskają” kreskę podłogi tuż przed postawieniem. Mierzone metodą strażnika (najbliższa poza kluczowa w styku) 1,9 j. — w granicy 2 j.; mierzone wobec samego mid2 — 3,7 j. Dodatkowo palce w mid2 stoją 0,8 j. nad podłogą, w end 0,0. | jak wyżej | realny, ledwo widoczny | `m.mjs`: mid>mid2 0.90 toe2=(−39.7,1.6), 0.95 (−41.7,1.2), 1.00 (−43.8,0.8); `drag.mjs new "Reverse Lunge"`: toe2 3,73 przy k=0,91 |

Uwagi poniżej progu (bez wpisu): środek ciężkości przy k=0,85 przejścia mid→mid2 wychodzi 0,2 j. poza tolerancję ± 2,5 j. stopy podporowej, ale stopa jest wtedy 1,97 j. nad podłogą (poniżej progu „w powietrzu” 2 j.), a 1 klatkę później palce dotykają — kontrolowane przeniesienie ciężaru do tyłu przy lądowaniu, zgodne z wykrokiem w tył; palce tylnej stopy 0,2 j. pod podłogą przy oderwaniu (niewidoczne pod kreską); ping-pong pokazuje powrót tym samym torem (odepchnięcie przednią nogą, stopa wraca w powietrzu — zgodne z „wróć, odpychając się przednią nogą”).

## Sprawdzone obszary bez znalezisk

- Ślizg przedniej stopy (0 j.) i tylnej stopy przy oderwaniu i po lądowaniu (≤ 2 j.).
- Zakres wszystkich stawów obu stron we wszystkich pozach pośrednich wobec `rom` (wada z rundy 1 — wyprost biodra −20° — usunięta: min −6,8°).
- Wejście pod podłogę (0,2 j. < 1 j.), podparcie, jedna podpora, opadanie biodra przy stopie w powietrzu.
- Zgodność z decyzją właściciela 29.10.2026 (pionowe uniesienie, cofnięcie w powietrzu, postawienie na palcach, dopiero potem opuszczenie) i z kartą (krok w tył, kolano tuż nad podłogą, plecy proste, stanie prosto).
- Notatka figury opisuje faktyczny ruch; testy odwrócone z `test.failing` na `test` (ślizg, rom) i nowy test decyzji — zielone.
- Skrót: `node scripts/zrodla-runtime.mjs --skroty` w worktree → v1 „Reverse Lunge”: `658463b371c2` (zgodny z wpisem w `docs/research/figury-recenzja.json`).
- Prywatność/dane/Apple: zmiana dotyczy tylko danych rysunku, dokumentów i testów; bez wpływu na dane użytkownika i migracje.

## Gotowy wpis do sekcji `v1` w `docs/research/figury-recenzja.json` (zastępuje obecny wpis „Reverse Lunge”)

```json
"Reverse Lunge": {
  "rodzina": "lunge",
  "werdykt": "wyswietlana",
  "data": "2026-10-29",
  "kto": "audytor (sesja 1.0.1, niezależny) — recenzja bramki 4 (L-047, L-050) poprawki wg decyzji właściciela 29.10.2026: podgląd klatek i póz pośrednich, arkusz śladu toru, pomiar z lib/figures/geom.ts (101 póz na przejście), zakres stawów wobec rom we wszystkich pozach, podparcie i jedna podpora, karta lib/cues (lunge.stand, lunge.back, lunge.torso); raport recenzja-reverse-lunge.md",
  "sha": "658463b371c2",
  "uwagi": "Ruch uproszczony wg decyzji właściciela 29.10.2026 (bez zamachu łukiem): tylna stopa unosi się prawie pionowo (kostka 1,5 j. od miejsca startu, palce 8,5 j. nad podłogą), cofa się w powietrzu i staje na palcach 42–44 j. za przednimi, dopiero potem opuszczenie do wykroku (tylne kolano 6,3 j. nad podłogą, tułów 87–91°). Przednia stopa w miejscu (0 j.), tylne palce przy oderwaniu i po lądowaniu ≤ 2 j. od pozy kluczowej, wszystkie stawy w zakresie (wyprost biodra tylnej nogi min. −6,8°), wejście pod podłogę 0,2 j., podparcie i jedna podpora spełnione; zgodne z kartą. NISKIE (backlog): w pozycji „w trakcie 1” tylne kolano wychodzi ok. 16 j. przed przednie („wysokie kolano”, skutek pionowego uniesienia); palce przed lądowaniem przez ok. 3,7 j. drogi 0,8–1,5 j. nad podłogą (płaskie podejście).",
  "autor": "programista r2/reverse-lunge",
  "recenzent": "audytor (sesja 1.0.1, niezależny)",
  "slad": "arkusz PNG klatek kluczowych (start, w trakcie 1, w trakcie 2, koniec), póz pośrednich (0,25 / 0,5 / 0,75) i nałożonego śladu toru punktów (L-050) oraz pomiar punktów stóp, biodra, środka ciężkości i zakresu stawów z modułu geometrii aplikacji — sesja recenzji 1.0.1, Reverse Lunge po decyzji 29.10.2026",
  "poprzedniWerdykt": "ukryta",
  "poprzedniaRecenzja": "2026-10-29",
  "stan": "zrecenzowana niezależnie (bramka 4, L-047, L-050), wersja 1.0.1, 29.10.2026"
}
```

Uwaga dla koordynatora: w 1.0 figura jest ukryta — ten wpis odblokowuje ją dopiero w 1.0.1. Po wpisie trzeba przegenerować `lib/figures/data.json` (generator przepuszcza figurę przy werdykcie „wyswietlana” i aktualnym skrócie) i uruchomić pełne verify; skrót liczony dla HEAD 85a7ce3 — każda późniejsza zmiana figury albo wskazówek Reverse Lunge unieważnia tę recenzję.
