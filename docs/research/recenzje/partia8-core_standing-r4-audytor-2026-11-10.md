# Recenzja niezależna r4 (różnicy) — rodzina v2 `core_standing` (partia 8), 10.11.2026

Recenzent: audytor (sesja r4; nie pisał rodziny ani poprawek). Zakres: poprawka R3-W1 (`git show e005c411`: `lib/figures/v2/draw.ts`, test R3-W1) oraz scalenia między r3 (9abbba74) a e005c411 (sled_throw/strongman, integracja-1-1). SHA: e005c411 (figury/partia-8).
Skrót v2 (`node scripts/zrodla-runtime.mjs --skroty`, liczony przez recenzenta @ e005c411): `ba395c4d26d1` (r3: `a08a92274da8`). `assignAll()`: 19 (16 z rysunkiem; Barbell Side Bend nadal wstrzymany, P8-CS-1).

**Werdykt rodziny: wyświetlana** — brak znalezisk KRYTYCZNYCH, WYSOKICH, ŚREDNICH i NISKICH.

## R3-W1 — stan: usunięte
- `draw.ts:427–428`: linia `bar` i talerze w rzucie z przodu wokół `o[0]` (rzut środka sztangi) zamiast osi ciała.
- Miara recenzenta (`shapesAt`, 21 klatek co 0,05, front i side): środek linii `bar` = rzut środka chwytów, maks. 0,00 cm (u = 0: linia 9,1…29,1 cm, środek chwytów 19,1 cm); talerzy brak (`plates: false`); `info.load` = środek chwytów (0,00 cm). Ruch w bok z przodu do 19,1 cm — test dotyka przypadku.
- Arkusze `arkusz-slad.mjs` front i side wygenerowane samodzielnie, obejrzane w pełnej rozdzielczości (front u = 0 i u = 0,5 powiększone): poprzeczka przy dłoniach w każdej klatce, rzut z boku bez zmian względem r3.
- Przenikanie: gryf (c ± 10 cm) i dźwignia landmine bez kolizji z tułowiem, miednicą, nogami i głową (najmniejszy odstęp 15,4 cm i 17,3 cm); `checkFrame` bez zgłoszeń. Odcinek `bar` zachodzi na ostatnie ok. 7 cm przedramienia (u = 0,15) — strefa dłoni trzymającej, bez klasy.
- Test R3-W1 czerwony na 150679da (przed poprawką), zielony na e005c411.

## Kod wspólny i scalenie
- `--skroty` @ e005c411 vs @ 150679da: jedyna różnica `v2.core_standing`. Skróty sled_throw (`dade4388eeaa`) i strongman (`04b91430146d`) liczone osobno — bez zmian.
- `git diff 9abbba74 e005c411 -- lib/figures/v2/` (bez plików sled_throw/strongman): contract.ts — tylko komentarz; reguly-cwiczen.json — zmienione tylko klucze sled_throw i strongman; families.ts, overlay.ts, rodziny/index.ts, poseData.ts — rejestracja nowych rodzin i komentarz. Rysunku core_standing nie zmienia nic poza draw.ts.

## Testy (K14)
- Nowy test R3-W1 sprawdza narysowany kształt (`shapesAt`, id `bar` i `plate`), nie tylko dane. Poluzowań dotyczących core_standing brak: wyjątek toru „Landmine Rotation|front” — zmiana tylko przecinka; zmiana fixture w gemini-polecenia (core_standing „do zrobienia”) i testy sled_throw/strongman — w zakresie drugiego audytora.
- `npx jest tests/figury-core-standing-poprawki-r1.test.ts tests/figures-v2-tor.test.ts --runInBand`: 214/214 zielone.

## Zestawy i karty
Skróty @ e005c411 równe r3 dla wszystkich 9 zestawów i 5 kart — wpisy potwierdzone. Zestaw Landmine Rotation: „wyświetlana” (R3-W1 usunięte). Zestaw Barbell Side Bend: bez zmian „do poprawy” (figura wstrzymana, P8-CS-1).
