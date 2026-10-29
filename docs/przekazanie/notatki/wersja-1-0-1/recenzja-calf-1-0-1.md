# Recenzja niezależna (bramka 4, L-047) — Standing Calf Raise, bike.foot, przekłady calf.edge — 1.0.1

Gałąź r2/cues-en, worktree /home/user/trening/.claude/worktrees/agent-a0f8a2ae7f8f99d3a, HEAD 94fc074, zakres `git diff fec3d5f 94fc074`.
Recenzent: audytor (sesja 1.0.1, niezależny; nie pisał treści). Data: 29.10.2026.

## Werdykt

- Karta Standing Calf Raise, treść PL (podstawa skrótu): **ZATWIERDZONE**.
- `calf.edge` EN: **DO POPRAWY** (ŚREDNIE, tania poprawka jednego zdania). Zdanie przekracza próg podobieństwa z docs/09 sekcja G wobec The Prehab Guys.
- `bike.foot` EN: **ZATWIERDZONE**.
- Przekłady `calf.edge` (de, es, fr, ja, ru): **ZATWIERDZONE**. Sens się zgadza.
- Uwaga techniczna: podany w zleceniu skrót d783d55dc834 jest nieaktualny. Szczegóły i gotowe wpisy niżej.

## Znaleziska

| # | Poziom | Pewność | Obszar | Opis | Kroki w aplikacji | Realność | Dowód |
|---|---|---|---|---|---|---|---|
| 1 | WYSOKIE (gdy wpis trafi do repo bez poprawki) | 99% | dane/wyświetlanie (bramka 4) | Wpis ze skrótem d783d55dc834 nie przywróci karty ani figury. d783d55dc834 to stary skrót v1 (figura + stary tekst PL). Bieżące skróty: karty = ba118e804b14, v1 = 9f988839b4bf. Jeśli dopiszemy tylko „karty” z poprawnym skrótem, wskazówki wrócą, ale figura v1 zostanie ukryta, bo `buildFigures` wymaga też aktualnego `v1.sha` (scripts/zrodla-runtime.mjs: `ok = … e.sha === figuraSkrot(...) && card(...)`). | Katalog → Standing Calf Raise → szczegóły: bez animacji (dziś bez animacji i bez wskazówek: lib/cues/data.json `hidden` = ["Standing Calf Raise","Hack Squat"], lib/figures/data.json `open` zawiera Standing Calf Raise) | realny | Symulacja `buildFigures`/`buildCues` (scratchpad sim.mjs): sam wpis „karty” → figura false, wskazówki widoczne; „karty” + v1 9f988839b4bf → figura true. `figuraSkrot` ze starym PL = d783d55dc834, z nowym = 9f988839b4bf. `git diff fec3d5f 94fc074 -- data/zrodla` puste, więc figura się nie zmieniła i nowy skrót v1 wynika tylko ze zmiany tekstu PL. |
| 2 | ŚREDNIE | 90% | treści własne (podobieństwo do źródeł) | `calf.edge` EN „Stand on the edge of the platform with the balls of your feet, heels hanging off.” wobec The Prehab Guys (Heel Raise – Off Step, HOW: „…with the balls of your feet on the edge of the box…”, źródło `prehab-heel-raise-off-step` w data/zrodla/cues.json): najdłuższy wspólny ciąg 6 słów, 3 wspólne 5-gramy. Próg docs/09 G pkt 4: ≥ 2 wspólne 5-gramy → przeredagować (pomiar (b) obejmuje wszystkie pobrane źródła, a 34 zdania z F3 poprawiono także z tego powodu). Wpis w docs/21 twierdzi, że zdanie ominęło nakładanie się z Prehab Guys, a usunęło tylko ciąg 8 słów. Poprzednie EN „Put the balls of your feet on the edge…” też przekraczało próg. | Karta (EN) → Ustawienie | realny (tekst widoczny), ale to reguła projektu, a nie naruszenie praw (zwrot instruktażowy) | Liczone skryptem z normalizacją z docs/09 (scratchpad ng.py) na tekstach przeczytanych dziś. Propozycja zgodna z progiem: „Stand on the platform edge on the front of your feet, heels hanging off.” (Prehab 3/0, NASM 3/0, Physitrack 2/0) albo „Put your forefoot on the edge of the platform so your heels hang free.” (Prehab 5/1). Sens bez zmian, więc przekłady nie wymagają poprawek. |

Poza zakresem diffu (do backlogu, NISKIE, pewność 90%): `calf.step` EN „Stand with the balls of your feet on a stable step…” wobec źródła cytowanego przy nim (Prehab Guys): 7 słów i 3 wspólne 5-gramy, czyli powyżej progu w pomiarze (a). Zmiana jest sprzed tej gałęzi. Nie blokuje wydania.

## (1) Standing Calf Raise — treść karty

Karta: setup `calf.edge`, move `calf.move`, tips `calf.knees` i `calf.pause`, mistakes `calf.mis.partial`. Ćwiczenie: maszyna (`calf_machine`, lib/catalog.generated.ts:106).

- `calf.edge` PL „Stań przednią częścią stóp na krawędzi podestu, pięty poza krawędzią.” Zgodne z NASM Leg Press Calf Raise, Step 1 (przeczytane dziś): „only your forefeet on the platform and your heels extending beyond the edge”. To inne ćwiczenie (prasa siedząc), ale to samo ustawienie stopy na platformie, czyli analogia. Potwierdzają to 2 przeczytane dziś źródła szczebla 4 dla wersji na stopniu: Prehab Guys („balls of your feet on the edge of the box, and your heels off the box”) i Physitrack („heels are off the edge of the step”). ExRx LVStandingCalfRaise (bezpośrednie źródło dla maszyny) jest dziś nie do odczytania: exrx.net zwraca stronę wyzwania JS, a web.archive.org zrywa połączenie. To samo zdarzało się we wcześniejszych recenzjach. „Podest” pasuje do podestu maszyny i do figury v1 (recenzja 27.10: „przednia część stopy na podwyższeniu”). Zmiana z „Oprzyj … na podwyższeniu” na „Stań … na krawędzi podestu” jest dokładniejsza: mówi wprost, że stoi się na krawędzi.
- `calf.move` „Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek.” Zgodne z NASM (Step 3, FAQ: pełny zakres zgięcia podeszwowego i grzbietowego, rozciągnięcie) i ACE #51 (unoszenie pięt).
- `calf.knees` „Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych.” Zgodne z ACE („Keep a slight bend in knees”), Prehab Guys i Physitrack (kolana proste).
- `calf.pause` „Zatrzymaj się chwilę na górze i opuszczaj powoli.” Zgodne z ACE („Pause at the top… slowly roll the heels back down”) i NASM Step 4 („with control”).
- `calf.mis.partial` „Skrócony zakres — bez pełnego wspięcia i opuszczenia.” Zgodne z NASM Common Mistakes („Not achieving full range of motion”).
- Spójność karty: ustawienie „pięty poza krawędzią” pasuje do ruchu „opuść pięty… rozciągnięcie”. Brak sprzeczności i brak twierdzeń o zdrowiu lub liczb.
- `node scripts/claims.mjs --check`: rejestr zgodny. `node scripts/zrodla-runtime.mjs --check`: zgodne.

## (2) bike.foot EN „Pedal with the front part of your foot.”

- Concept2 Setting Up the BikeErg (przeczytane dziś): „With the ball of your foot on the pedal…”. HSS (przeczytane dziś): środek pedału „right in line with the ball of your foot”. „Front part of your foot” to zwykłe określenie przedniej części stopy (ball of the foot), więc sens się zgadza. Usunięcie „just behind the toes” niczego nie psuje, a nawet mniej zawęża. PL „Na pedale opieraj przednią część stopy.” bez zmian, zgodne.
- Podobieństwo: Concept2 3 słowa / 0 pięciogramów, HSS 3/0, pozostałe ≤ 2/0, czyli poniżej progu. tests/cues-podobienstwo.test.ts zaktualizowany spójnie (NOWE.bike.foot = nowy tekst, styl: jedno zdanie, kropka, bez cyfr). docs/09 tabela G wiersz 2 też zaktualizowany.

## (3) Przekłady calf.edge — próbka

- de „Stell dich mit den Fußballen auf die Kante der Plattform, die Fersen hängen frei.” poprawne, naturalne.
- es „Colócate con la parte delantera de los pies en el borde de la plataforma, con los talones fuera.” poprawne.
- fr „Placez-vous avec l’avant des pieds sur le bord de la plateforme, talons dans le vide.” poprawne, forma „vous” spójna z resztą karty fr.
- ja 「足の母指球を台の縁に乗せて立ち、かかとは縁の外に出します。」 poprawne (母指球 = ball of foot, 台 = podest, 立ち = stań).
- ru «Встань на край платформы подушечками стоп, пятки свисают.» poprawne, forma „ty” spójna z kartą ru.

## Gotowe wpisy do docs/research/figury-recenzja.json

Sekcja `karty` (nowy klucz):

```json
"Standing Calf Raise": {
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "stan": "zrecenzowana niezależnie (bramka 4, treść karty: ustawienie, ruch, wskazówki, błędy wobec źródeł przeczytanych 29.10.2026)",
 "autor": "tlumacz r2/cues-en",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "kto": "audytor — recenzja niezależna treści karty (L-047, bramka 4), 29.10.2026, po zmianie calf.edge (podest)",
 "sha": "ba118e804b14",
 "uwagi": "calf.edge (stań przednią częścią stóp na krawędzi podestu, pięty poza krawędzią): NASM Leg Press Calf Raise Step 1 (to samo ustawienie stopy, inne ćwiczenie — analogia) oraz Prehab Guys i Physitrack (wersja na stopniu), przeczytane 29.10.2026; ExRx LVStandingCalfRaise niedostępne (exrx.net — wyzwanie JS, web.archive.org zrywa połączenie), do ponownego odczytu. calf.move, calf.knees, calf.pause, calf.mis.partial: NASM i ACE #51 przeczytane — zgodne. Karta spójna, bez liczb i twierdzeń o zdrowiu."
}
```

Sekcja `v1`, istniejący wpis „Standing Calf Raise”: zmienić `sha` z `d783d55dc834` na `9f988839b4bf`. Figura jest bez zmian (`data/zrodla` bez różnic w diffie), skrót zmienia się tylko przez tekst PL `calf.edge`. Bez tego figura zostaje w `open` (znalezisko 1). Proponowany dopisek do `uwagi`: „Skrót odświeżony 29.10.2026 po zmianie tekstu calf.edge (figura bez zmian; treść karty: wpis w »karty«, recenzja audytora 1.0.1).”

Potem: `node scripts/zrodla-runtime.mjs --write` i sprawdzenie, że Standing Calf Raise nie jest już w `hidden` (lib/cues/data.json) ani w `open` (lib/figures/data.json). Testy: tests/karty-recenzja.test.tsx, tests/figury-recenzja.test.tsx.

## Sprawdzone obszary bez znalezisk

- Sens merytoryczny wszystkich 5 wskazówek karty wobec przeczytanych źródeł.
- bike.foot EN: sens i podobieństwo.
- Przekłady calf.edge de/es/fr/ja/ru. Przejrzane też pozostałe 27 w diffie (bez błędów sensu; „platforma/pijakan/bệ/平台” spójne).
- Rejestr twierdzeń (check:claims zgodny), zrodla-runtime --check zgodny.
- Prywatność/sekrety w diffie: brak.
- Źródła publicznie anonimowo: teksty UI nie wymieniają źródeł.
