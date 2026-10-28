# Recenzja niezależna — Step Up (figura v1) po drugiej poprawce, 28.10.2026

Bramka 4 (zasada właściciela z 27.10.2026). Recenzent nie jest autorem figury. Recenzja tylko do odczytu, worktree na commicie `31ad7c05` (gałąź `naprawy/M2-po-decyzjach-figury`).

## Metoda
- Dane: `lib/figures/data.json` (plik runtime). Figura jest identyczna z `data/zrodla/figures.json`. Geometria: `lib/figures/geom.ts`, skompilowany bez zmian do CJS.
- Pozy pośrednie liczone przez `poseBetween` co 0,05 (prześwit: co 0,0025). Środek ciężkości liczę z tego samego podziału mas segmentów co poprzednia recenzja. Liczę go też z hantlami: 20%, 25% i 30% masy ciała, rozłożone po połowie na `hand` i `hand2`. Do tego punkt zatrzymania (capture point, x + v/ω) przy tempie animacji: przejście 1100 ms z wygładzeniem kosinusowym, 1 j. = 1,75 cm.
- Arkusze rysowałem sam (`recenzja-stepup-2/StepUp2-sheet.png`): zielony znacznik to środek ciężkości bez obciążenia, pomarańczowy z hantlami 25%, niebieskie kreski to pięta i palce stopy na skrzyni. Kadr w pełnej rozdzielczości: `StepUp2-mid-end-k0.2375.png`.
- Pomiary: `recenzja-stepup-2/pomiary/` (`gesto-step-up.txt`, `srodek-ciezkosci-i-punkt-zatrzymania.txt`, `przeswit-skrzynia.txt`). Skrypty: `recenzja-stepup-2/skrypty/`. Wymagają `r/geom.cjs` obok siebie (`tsc --module commonjs` z `lib/figures/geom.ts`).
- Testy: `npx jest tests/figury-podparcie.test.ts tests/figures --maxWorkers=1` dają 12 zestawów i 215 testów, wszystkie zielone.

## Werdykt
**OK (wyświetlana).** Wada WYSOKIE z poprzedniej recenzji (upadek w tył) jest usunięta. Zostały dwie uwagi NISKIE, kosmetyczne, do backlogu z wersją (proponuję 1.0.1). Nie blokują wydania.

## Wada WYSOKIE z poprzedniej recenzji — stan po poprawce
| k (start → w trakcie) | tylna stopa, najniższy punkt nad podłogą | śr. ciężkości x bez obc. / z hantlami 25% | za piętą stopy na skrzyni (x = −2) | punkt zatrzymania bez / 25% |
|---|---|---|---|---|
| 0,00 | 0,0 (stoi) | −4,8 / −5,8 | podpora z dwóch stóp, środek nad tylną stopą | — |
| 0,05 | 0,7 | −4,6 / −5,7 | 2,6 / 3,7 | −4,1 / −5,5 |
| 0,10 | 1,4 (styk ≤ 1,5) | −4,4 / −5,6 | 2,4 / 3,6 | −3,5 / −5,1 |
| 0,15 | 2,2 (w powietrzu) | −4,2 / −5,5 | 2,2 / 3,5 | −2,9 / −4,7 |
| 0,25 | 3,8 | −3,7 / −5,1 | 1,7 / 3,1 | −1,6 / −3,6 |
| 0,40 | 6,8 | −2,6 / −4,2 | 0,6 / 2,2 | 0,5 / −1,9 |
| 0,50 | 9,0 | −1,7 / −3,5 | nad stopą / 1,5 | 2,0 / −0,6 |
| 0,70 | 14,2 | 0,4 / −1,8 | nad stopą / nad stopą | 4,6 / 1,9 |
| 1,00 (w trakcie) | 23,6 | 4,2 / 1,3 | nad stopą | — |

- **Oderwanie tylnej stopy (autor podaje k ≈ 0,05).** Przy k = 0,05 pięta tylnej stopy jest 1,7 j. nad podłogą, a palce 0,7 j., czyli stopa wspina się na palce. Palce mają styk (≤ 1,5 j.) do k ≈ 0,10, a stopa jest w powietrzu (> 2 j.) od k ≈ 0,15. W tej chwili środek ciężkości bez obciążenia jest 2,2 j. (ok. 4 cm) za piętą stopy na skrzyni i przesuwa się w przód. Przy tempie animacji punkt zatrzymania jest 0,9 j. za piętą i dochodzi do niej przy k ≈ 0,25. Fizycznie to krótkie odbicie z palców tylnej nogi i przejście ciężaru na nogę ze skrzyni, nie upadek. Poprzednio było 6,5–7,4 j. za piętą do k ≈ 0,7, a środek ciężkości cofał się. Ta różnica mieści się w niepewności modelu mas, który jest przybliżony o ±1–2 j. Karta nie zabrania odbicia tylną nogą (`stepup.move`: „wejdź, prostując tę nogę”). Ocena: dopuszczalne, **bez znaleziska**.
- **Z hantlami** środek ciężkości w chwili oderwania jest 3,5 j. za piętą, czyli 1 j. ponad tolerancję autora (2,5 j.). Wynika to jednak z rysunku rąk (uwaga NISKIE nr 1): ręce idą wzdłuż pochylonego tułowia, więc hantle wiszą za biodrem. Przy rękach zwisających pionowo pod barkiem (x ≈ −3,2 przy k = 0,15, na rysunku −9) środek ciężkości z obciążeniem 25% wyszedłby ok. 2,0 j. za piętą, czyli w tolerancji. Nie zgłaszam tego jako osobnego błędu ruchu.
- **Biodro** rośnie monotonicznie: y 52,2 → 72,6 → 80,0. Biodro x: −8,7 → −4,4 → 1,0. Nie cofa się (dawniej cofało się w pierwszej ćwiartce).
- **Tułów:** start 7,8° od pionu, „w trakcie” 30,5° od pionu, koniec pionowo. Zgodne z notatką autora („ok. 30°”).
- **Stopa na skrzyni** nie ślizga się: pięta (−2; 26) i palce (12; 26) są stałe we wszystkich pozach (kotwica). Przez cały ruch stoi całą stopą na blacie [−2; 32], zgodnie z `stepup.move` („Postaw całą stopę”).
- **Po zejściu z mid na end** środek ciężkości jest stale nad stopą na skrzyni (1,3–4,2 j., także z hantlami).
- **Schodzenie** (pętla ping-pong) przechodzi tę samą drogę wstecz. Tylna stopa ma styk palcami przy k ≤ 0,10 przejścia start ← w trakcie, a środek ciężkości jest wtedy 2,4–2,6 j. za piętą. To miękkie postawienie palców za skrzynią, nie spadanie.
- **Kąty:** brak wyjścia poza `rom.side` w żadnej pozie co 0,05. Największe zgięcie grzbietowe nogi na skrzyni wynosi 37,4° na starcie, przy granicy 37°, w tolerancji 0,5° walidatora. Kolano jest wtedy 4,2 j. przed palcami.
- **Przenikanie:** osie segmentów nie wchodzą ani w skrzynię, ani w podłogę (0,0 w każdej pozie). Prześwit tylnych palców od ściany skrzyni na starcie wynosi 2,6 j.

## Karta a figura (`lunge.torso` usunięte z pozy „w trakcie”)
- Step Up ma w `lib/cues/data.json` setup `stepup.setup`, move `stepup.move` oraz tips `lunge.torso` i `stepup.knee`. Pozycja „mistakes” jest pusta.
- `lunge.torso` w pl brzmi „Plecy proste przez cały ruch.”, a w en „Keep your back straight throughout.”. Sprawdziłem wszystkie 34 języki w `lib/cues/text/*.json` (`es-419` nie ma własnego wpisu). Każdy mówi o prostych plecach (np. de „Rücken … gerade”, fr „dos droit”, ru „спину прямой”). Żaden nie mówi o tułowiu pionowym, wyprostowanym ani „upright”. Proste plecy przy pochyleniu 30° nie przeczą figurze: tułów jest jednym prostym odcinkiem.
- `stepup.setup` („hantle w opuszczonych rękach”) i `stepup.knee` („kolano w linii palców”) nie przeczą figurze. Mięśnie (`lib/seed.ts:207`: czworogłowe, pośladki) są bez zmian i są wiarygodne.
- Opis figury w `docs/research/28-figury.md` jest zgodny z danymi: „w trakcie” ma tylko `stepup.move`.
- **Wniosek:** usunięcie sprawdzenia `lunge.torso` w pozie „w trakcie” jest poprawne, karta nie przeczy figurze.

## Uwagi NISKIE (backlog z wersją, nie blokują)
| # | poziom | pewność | realność | opis | dowód |
|---|---|---|---|---|---|
| 1 | NISKIE | 90% | realny (każda animacja Step Up) | Ręce z hantlami biegną wzdłuż pochylonego tułowia (`sh: 0`). W pozie „w trakcie” hantla jest 19 j. za barkiem i za biodrem (dłoń x −8,4, bark x 10,8), a ramię odchylone 30° w tył od pionu. Swobodnie trzymane hantle zwisają pionowo pod barkiem. Wygląda to na zamach rąk w tył. To kosmetyka, technika nóg i tułowia jest poprawna. Naprawa: `sh` ≈ (90 − t) w pozach z pochyleniem, tj. ok. 8° na starcie i ok. 30° „w trakcie”. Przy okazji zmaleje wynik z hantlami w regule jednej podpory. | `pomiary/gesto-step-up.txt` (pozycja „mid”: hand(−8,4; 65,7), shoulder(10,8; 98,4)); `StepUp2-sheet.png`, kadry „start->mid k=1” i „mid->end k=0.25” (szara hantla za biodrem) |
| 2 | NISKIE | 85% | realny, ułamek sekundy | Przy przenoszeniu nogi (w trakcie → koniec, k ≈ 0,24) palce tylnej stopy mijają przednią krawędź blatu o 0,9 j. w osi. Przy grubości kreski 4,5 j. rysunek nachodzi na róg skrzyni o ok. 1,3 j. W kadrze jest to prawie całkiem zasłonięte stopą bliższą, więc wada jest ledwo widoczna. Poprzednio prześwit wynosił ok. 4 j. | `pomiary/przeswit-skrzynia.txt`, `StepUp2-mid-end-k0.2375.png` |

## Uwagi procesowe (nie dotyczą użytkownika)
- `srodekCiezkosci` w `tests/helpers/figury-podparcie.ts` pomija hantle (komentarz w kodzie to mówi). Dla figur z `db`/`kb` w dłoniach reguła jednej podpory jest więc łagodniejsza niż rzeczywistość. Po naprawie uwagi nr 1 warto liczyć z obciążeniem, np. 25% masy w dłoniach dla figur z `db`. Nie blokuje.
- Wpis w `docs/research/figury-recenzja.json` ma stan „do recenzji niezależnej”. Po tej recenzji koordynator może go zmienić (werdykt „wyswietlana”, stan „recenzja niezależna 28.10.2026 OK”, uwagi NISKIE 1–2 z wersją w `docs/21`).

## Czego nie sprawdziłem
Obrazu na symulatorze (Linux). Geometria jest ta sama co w `poseBetween`, a rysunek odtwarzałem z `shapes`. Źródeł zdań karty, bo karta się nie zmieniła. Innych figur.
