# Recenzja niezależna — rodzina v2 `overhead_press`, runda r2 (audytor, 09.11.2026)

**Werdykt rodziny: do poprawy** (2 × WYSOKIE). Ćwiczenia: 8 × wyświetlana, 13 × do poprawy, 2 bez rysunku (Bradford Press, Handstand Push Up).
Znaleziska: KRYTYCZNE 0, WYSOKIE 2, ŚREDNIE 0, NISKIE 3. Recenzent nie jest autorem (autor: programista partii 1; L-047).

## Metoda
- SHA autora `3044df5` (figury/partia-1; poprawki r1 `b8890ff` + typ Collider `3044df5`; zawiera scalenie śladu dźwigni `55c9f206` — sprawdzone `git merge-base --is-ancestor`). Czysta kopia `git archive` w `/home/user/rev-p1/overhead_press-r2` (node_modules — dowiązanie).
- **Status w kopii:** rodzina jest `planned`, więc w KOPII (nie w repo) ustawiłem `status: 'ready'` dla `overhead_press` w `lib/figures/v2/families.ts:32` i dopiero wtedy uruchomiłem `node scripts/zrodla-runtime.mjs --skroty` (v2.overhead_press = `1034a881059b` — nie wpisany, bo werdykt „do poprawy”) oraz testy pojedynczych plików.
- Arkusze: `arkusz-slad.mjs` — 21 ćwiczeń × side + front, motyw jasny (42 PNG, `arkusze/slad/`), ciemny dla 6 ćwiczeń (12 PNG, `arkusze/slad-dark/`: OHP sztanga, Kettlebell Press, zza karku, Landmine Press, Arnold, Push Press); `arkusz-nakladka.mjs --family overhead_press` (44 PNG, `arkusze/nakladka/`). Kadry u = 0 / 0,5 / 1 wycięte bez zmniejszania (OHP sztanga side także u = 0,05/0,10/0,15/0,30).
- Liczby: `frameAt` + `jointAngles` co 0,1 (chwyt i łokieć względem środka barków, shSag/shAbd, łokieć), `gap` ciężar–głowa (głowa: kula r 9,5 cm w (0; +22) względem barków), miara toru z `tests/figures-v2-tor.test.ts` (`ksztaltToru`, 25 klatek).
- Testy w kopii (status ready): `npx jest --runInBand tests/figures-v2-tor.test.ts tests/figures-v2-ohp-p1.test.ts` → 229 zielonych, 2 czerwone (tor — 16 przypadków; K15 — Landmine Press, N1 niżej).
- `liczba` = 23 (`assignAll()`, w tym 2 bez rysunku).

## Znaleziska

| ID | Poziom | Pewność | Realność | Ćwiczenia / widok / kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1-r2 | WYSOKIE | 85% | realny (każde powtórzenie, widok z boku) | 13 ćwiczeń z `wyciskanie()`: Overhead Press (sztanga), (hantle), Seated Shoulder Press (hantle), Push Press, Wyciskanie nad głowę (linki), Single Arm OHP (hantel), Seated Barbell Military Press, See-Saw Press, Band Shoulder Press, Seated Cable Shoulder Press, Kettlebell Press, Kettlebell Seated Press, Double Kettlebell Press; side, u ≈ 0,1–0,8 | Dół poprawiony (chwyt 13,3 cm przed / 9 cm nad barkami, sztanga–tułów 5,0 cm), ale w drodze w górę chwyt **odjeżdża od twarzy**: x względem barków 13,3 (u 0) → 19,9 (0,2) → 22,7 (0,4) → 22,5 (0,5) → 17,3 (0,75) → 6,4 cm (1). Gryf–głowa: 7,5 / 8,9 / 13,2 / 15,4 / 19,9 cm (u 0 / 0,2 / 0,4 / 0,5 / 0,7). Tor side: 12,5–12,6 cm odchylenia (kettlebell 10,3; Push Press 12,2 i 3 zawrócenia). Na kadrze u = 0,50 ramię poziomo przed sobą, gryf nad czołem daleko przed twarzą (`arkusze/slad/Overhead-Press-sztanga-side.png`, wycinek `/home/user/rev-p1/skr/ohp-side-key.png`). Przyczyna w kodzie: `scripts/figures/agent-pozy/overhead_press.mjs` — `hxRel = max(lerp…, xMinPodLokciem(yy, dz) + 0,25)`: bez dopasowania tor szedłby pionowo (x 12 do y 48), wymóg „łokieć ≤ 7,5 cm od chwytu w poziomie” przy łokciach prawie wprost do przodu (shAbd 17–18°) wypycha chwyt do przodu. Karty mówią: „ciężar idzie prosto w górę nad głowę” (ohp.tall — karty OHP sztanga, hantle, linki, Band; zestawy Double KB, See-Saw), „Wypchnij kettlebell prosto nad głowę” (kbp.move). r1 W1 obejmował też ten fragment („do u ≈ 0,75 ciężar idzie 21–22 cm przed twarzą”) — poprawiony tylko dół. | Tor przy twarzy: chwyt do wysokości czubka głowy (y ≈ 31 cm) ≤ ok. 13–14 cm przed barkami (głowa r 9,5 + gryf 1,6 → wystarczy ok. 11–12 cm), potem cofanie nad barki. Wykonalność niesprawdzona; możliwe drogi: (a) łokcie wychodzą lekko na boki po minięciu brody (shAbd rośnie), przedramię w widoku z przodu odchylone w granicy reguły ≤ 10 cm; (b) lekki odchył tułowia w tył na dole i „wejście pod sztangę” na górze (tor względem podłogi pionowy). Test: tor side ≤ 4 cm (albo wyjątek z progiem ≤ ok. 5 cm i powodem „broda”), chwyt ≤ 14 cm przed barkami dla y ≤ 31 cm, przypadek negatywny = dziś (22,7 cm). |
| W2-r2 | WYSOKIE | 85% | realny (pozycja startowa każdego powtórzenia) | Kettlebell Press, Kettlebell Seated Press, Double Kettlebell Press; side i front, u = 0 (i dół każdego powtórzenia) | Pozycja „rack”: łokieć 23,2 cm przed środkiem barków i 18,2 cm pod nim, zgięcie barku 52° (r1: łokieć 23,4 cm — **bez zmiany**); rączka 16,5 cm przed / 14 cm nad barkami (wysokość ust; dół głowy na +12,5), dzwon w widoku z boku na twarzy, z przodu na wysokości ucha (`arkusze/slad/Kettlebell-Press-side.png`, `Double-Kettlebell-Press-front.png`, `arkusze/slad-dark/Kettlebell-Press-side.png`, u = 0,00). Karty: „Kettlebell przy barku, łokieć blisko żeber” (kbp.setup), „…opuść go z powrotem do barku, ściągając łokieć do żeber” (kbp.move). Test autora utrwala start wysoko (`m.y >= 12`, „dzwon za rączką niżej przenika ramię”). Część W1 z r1 („łokieć 23 cm przed barkiem wobec «łokieć blisko żeber»”) niezamknięta. | Rack niżej (rączka przy górze klatki / obojczyku, ok. 0–6 cm nad barkiem), ramię blisko pionu (zgięcie barku ≤ ok. 25°), łokieć przy tułowiu; przenikanie dzwonu z ramieniem rozwiązać ułożeniem dzwonu na zewnętrznej stronie przedramienia (opcja `dzwon` w sprzęcie — wykonalność niesprawdzona), nie podnoszeniem chwytu. Test: odstęp łokieć–tułów na dole ≤ ok. 4 cm, zgięcie barku ≤ 25°; negatyw = dziś. |
| N1 | NISKIE | 90% | teoretyczny (test; użytkownik nie widzi) | `tests/figures-v2-ohp-p1.test.ts:201` (K15) | Przy statusie `ready` test pada: Landmine Press ma 1 błąd animowany (tempo `mis.jerk` z zestawu ogólnego `press`, `lib/figures/v2/ui.ts:52`), a test oczekuje 0. Zestaw Landmine Press bez zmian od r1, więc stan trwa od podłączenia. Przy przejściu rodziny na `ready` hak/CI to zatrzyma. | Dopuścić w K15 błędy tempa z zestawu (jak jest dla danych) albo wyłączyć `mis.jerk` dla Landmine Press — decyzja autora; przypadek negatywny zostaje. |
| N2 | NISKIE | 90% | teoretyczny (test) | `tests/figures-v2-ohp-p1.test.ts` — Ś2 zza karku | „Przypadek negatywny” liczy stałą: `expect([k, 8 - Math.min(...xs) > 10, 8 <= 0])` — nie przesuwa danych ani klatki, więc nie dowodzi, że miara na torze potrafi paść. | Negatyw na danych: tor z `xTop` 8 (stan sprzed poprawki) przez tę samą funkcję miary. |
| N3 | NISKIE | 85% | realny, mało widoczny | Push Press - Behind the Neck; side, u ≈ 0,1–0,4 (ugięcie) | Tor side 4,9 cm i 2 zawrócenia (próg 4 cm / 1): w ugięciu środek gryfu (`info.load`) idzie 1,6 cm w przód (−13,0 → −11,4 cm względem barków) i wraca; po podłączeniu strażnik toru odrzuci przypadek. | Ugięcie pionowo (gryf w tym samym x) albo wyjątek z powodem „ugięcie nóg”. |

Bez zmian od r1, nie zgłaszam ponownie: Ś3 (poprzeczny odcinek gryfu landmine w widoku z przodu — nadal widoczny, `arkusze/slad/Landmine-Press-front.png` u = 0,5 / 1; zgłoszenie silnika), N1-r1 (pętla K7 pomija dla zza karku wszystkie części ciała — w diffie tylko dopisane testy).
Zamknięte z r1: **Ś1** (`ohp.seat` usunięte z Seated Cable Shoulder Press — `cue-sets.json`, test), **Ś2** (zza karku: x chwytu −13,0 → −9,0 cm, rozrzut 4,0 cm, szczyt za barkami; tor side 2,5 cm), **W1 w części „dół ruchu”** dla sztangi, hantli, linek i gumy (chwyt 13,3/9 cm, sztanga–tułów 5,0 cm, łokieć–chwyt ≤ 7,7 cm w całym ruchu).

## Łuk ok. 12,5 cm w widoku side — ocena (do decyzji koordynatora)
**Błąd ruchu, nie cecha — wyjątek w `tests/tor-wyjatki.json` z powodem „sztanga omija twarz” nieuzasadniony.**
- Miara z `frameAt` (OHP sztanga): odchylenie 12,5 cm, 1 zawrócenie; szczyt wybrzuszenia u ≈ 0,4 (chwyt 22,7 cm przed barkami na y 30,6 — czubek głowy jest na y 31,5); przy u = 0,5 gryf jest już nad głową i nadal 22,5 cm przed barkami.
- Geometria omijania twarzy: prosta od startu (13,3; 9) do szczytu (6,4; 63) na wysokości środka głowy (y 22) ma x = 11,6 cm, czyli mija kulę głowy (r 9,5) o ok. 0,5 cm przy promieniu gryfu 1,6 cm. Omijanie twarzy tłumaczy więc najwyżej kilka cm odchylenia, nie 12,5; rzeczywisty odstęp gryf–głowa w szczycie łuku to 13–15 cm.
- Kształt jest skutkiem wymogu „łokieć pod chwytem” przy łokciach skierowanych prawie wprost do przodu (W1-r2), a nie toru ciężaru w ćwiczeniu; karty uczą „prosto w górę”.
- Po poprawce W1-r2, jeśli zostanie odchylenie ok. 4–6 cm od omijania brody, wyjątek z takim powodem i pomiarem uznam za uzasadniony.
- Arnold Press / Kettlebell Arnold Press (9,6 cm, 0 zawróceń) — inny kształt: brak wybrzuszenia poza punkt startu (start przed twarzą, x 22 cm, cofanie nad barki przy końcu z obrotem); to cecha ćwiczenia — wyjątek z powodem uzasadniony.

## Tabela ćwiczeń

| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Overhead Press (sztanga) | do poprawy | W1-r2; dół poprawny |
| Overhead Press (hantle) | do poprawy | W1-r2; oś hantla poprzecznie (−80°) |
| Seated Shoulder Press (hantle) | do poprawy | W1-r2; ławka bez przenikania |
| Push Press | do poprawy | W1-r2 (12,2 cm, 3 zawr.); ugięcie kolan poprawne |
| Wyciskanie nad głowę (linki) | do poprawy | W1-r2; linki z dolnych bloczków po bokach |
| Single Arm Overhead Press (hantel) | do poprawy | W1-r2 |
| Seated Barbell Military Press | do poprawy | W1-r2 |
| See-Saw Press (Alternating Side Press) | do poprawy | W1-r2; przeciwfaza poprawna |
| Band Shoulder Press | do poprawy | W1-r2 |
| Seated Cable Shoulder Press | do poprawy | W1-r2 (Ś1 zamknięte) |
| Kettlebell Press | do poprawy | W1-r2, W2-r2 |
| Kettlebell Seated Press | do poprawy | W1-r2, W2-r2 |
| Double Kettlebell Press | do poprawy | W1-r2, W2-r2 |
| Arnold Press | wyswietlana | bez zmian od r1; łuk 9,6 cm — cecha (wyjątek z powodem) |
| Kettlebell Arnold Press | wyswietlana | jak Arnold |
| Standing Barbell Press Behind Neck | wyswietlana | Ś2 zamknięte: tor 2,5 cm, gryf–głowa ≥ 1,9 cm |
| Push Press - Behind the Neck | wyswietlana | N3 (4,9 cm w ugięciu) |
| Landmine Press | wyswietlana | ślad na końcu dźwigni po 55c9f206 — łuk wokół zaczepu, 1,7 cm; Ś3 bez zmian |
| Landmine Linear Jammer | wyswietlana | jw., 1,7 cm |
| Single-Arm Linear Jammer | wyswietlana | jw., 1,3 cm |
| Pike Push Up | wyswietlana | dane bez zmian od r1 |
| Bradford Press, Handstand Push Up | bez rysunku | — |

## Nakładka
Elementy z reguł „ustalone” (pion przez bark z boku, pion pod nadgarstkiem, kąt łokcia) w płaszczyźnie ruchu, bez artefaktu w rzucie z przodu; element łokcia przesunął się z nową pozą (u = 0: 148°, u = 0,5: 96°, u = 1: 11°) i pokazuje poprawne miejsce (`arkusze/nakladka/Overhead-Press-sztanga-side.png`, `Kettlebell-Press-front.png`). Bez znalezisk; po poprawce W1-r2/W2-r2 obejrzeć ponownie `ohpElbowsUnderRef`.

## Zestawy ogólne (K12)
- wyswietlana (nowe w r2): Standing Barbell Press Behind Neck (`ohp.tall` zgodne po Ś2), Seated Cable Shoulder Press (`ohp.move`, `ohp.fullExt` — zgodne; sam rysunek do poprawy W1-r2), Push Press - Behind the Neck (potwierdzenie, skrót bez zmian).
- bez zmian od r1 (wpisy w repo, skrót się zgadza): Landmine Press, Landmine Linear Jammer, Single-Arm Linear Jammer, Pike Push Up, Kettlebell Arnold Press.
- do poprawy (bez wpisu): See-Saw Press i Double Kettlebell Press (`ohp.tall` „prosto w górę” przeczy W1-r2).

## Karty własne bez wpisu „karty” (K11)
- Seated Shoulder Press (hantle): wyswietlana (`ohp.seat`, `ohp.move`, `ohp.elbowsUnder` ≤ 8 cm, `ohp.fullExt` — zgodne z rysunkiem).
- Overhead Press (sztanga), Overhead Press (hantle), Wyciskanie nad głowę (linki): do poprawy rysunku (W1-r2: `ohp.tall` „prosto w górę”), bez wpisu.
- Karty z wpisem (Kettlebell Press, Kettlebell Seated Press, Band Shoulder Press i in.) — tekst poprawny, rysunek przeczy (W2-r2/W1-r2); naprawa po stronie rysunku.

## Testy (K14) — `git diff b8890ff^..3044df5 -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-ohp-p1.test.ts | +7 testów (W1 dół, sztanga–tułów, łokieć–chwyt ≤ 8, kettlebell, negatyw x0 22, Ś2, Ś1); `3044df5`: zawężenie typu `prism` | uzasadnione; luki: brak miary toru w środku ruchu (W1-r2 — łapie go dopiero strażnik toru po podłączeniu), test kettlebell utrwala `y >= 12` (W2-r2), negatyw Ś2 na stałej (N2) |
| figures-v2-tor.test.ts | ZESTAW pomija dźwignię z punktem poza dłońmi | spoza rodziny (55c9f206), uzasadnione — pilnuje `figures-v2-slad-dzwignia.test.ts` |
| figures-v2-fala-wspolna-2.test.ts | Leg Press: ślad = kostka (było: brak) | spoza rodziny, zaostrzenie |
| figures-v2-chest-fly-p1, data, zgodnosc-wsteczna, figury-v2-zlote.json, pokrycie-katalogu.json i in. | chest_fly r1, Crucifix | spoza rodziny (scalenie) — nie oceniam |
Poluzowań oczekiwań w części overhead_press brak.

## Czas pracy
Ok. 25 min agenta (22:58–23:25 UTC).
