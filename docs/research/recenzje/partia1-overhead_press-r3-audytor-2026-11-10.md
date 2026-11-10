# Recenzja niezależna — rodzina v2 `overhead_press`, runda r3 (audytor, 10.11.2026)

**Werdykt rodziny: wyswietlana** (bez KRYTYCZNYCH i WYSOKICH). Ćwiczenia: 21 × wyswietlana, 2 bez rysunku (Bradford Press, Handstand Push Up).
Znaleziska: KRYTYCZNE 0, WYSOKIE 0, ŚREDNIE 1, NISKIE 3. Recenzent nie jest autorem (autor: programista partii 1; L-047).

## Metoda
- SHA `d35ce6c4` (figury/partia-1; scalenie poprawek r2 `c161a50b`, commit autora `681dc474`). Czysta kopia `git archive` w `/home/user/rev-p1/overhead_press-r3` (node_modules — dowiązanie).
- **Status w kopii:** rodzina jest `planned`; w KOPII (nie w repo) ustawiłem `status: 'ready'` dla `overhead_press` w `lib/figures/v2/families.ts:32` i dopiero wtedy uruchomiłem `node scripts/zrodla-runtime.mjs --skroty` (wynik: `/home/user/rev-p1/skroty-ohp-r3.json`) oraz testy pojedynczych plików.
- Arkusze: `arkusz-slad.mjs` — 21 ćwiczeń × side + front, motyw jasny (42 PNG, `arkusze/slad/`); ciemny dla 6 ćwiczeń (12 PNG, `arkusze/slad-dark/`: OHP sztanga, Kettlebell Press, Seated Barbell Military Press, Push Press, Double Kettlebell Press, See-Saw); `arkusz-nakladka.mjs --family overhead_press` (44 PNG, `arkusze/nakladka/`). Powiększenia (`--cols 3`, wycinki 3×): OHP sztanga, Seated Barbell Military Press, Kettlebell Press (side, u 0 / 0,05 / 0,5 / 0,6 / 1) — `/home/user/rev-p1/tools-ohp-r3/*.png`.
- Liczby: `frameAt` co 0,1 i co 1/24 (chwyt i łokieć względem środka barków, położenie w świecie, pochylenie tułowia barki–miednica, shSag/shAbd, łokieć), miara toru jak w `tests/figures-v2-tor.test.ts` (25 klatek) — skrypty `/home/user/rev-p1/tools-ohp-r3/m.mjs`, `sum.mjs`; geometria reguły łokcia — `xMinPodLokciem` z generatora przy mMax 7,5 / 9 / 9,9 cm.
- Testy w kopii (status ready, `--runInBand`): `figures-v2-ohp-p1` + `figures-v2-tor` → 236/236 zielonych; `figury-sens-pokrycie` + `figury-sens-r4-r5` + `figures-v2-data` → 44/44.
- `liczba` = 23 (`assignAll()`, w tym 2 bez rysunku).

## Znaleziska

| ID | Poziom | Pewność | Realność | Ćwiczenia / widok / kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| Ś1-r3 | ŚREDNIE | 85% | realny (każde powtórzenie, widok z boku) | Seated Shoulder Press (hantle), Seated Barbell Military Press, Seated Cable Shoulder Press, Kettlebell Seated Press; side, u ≈ 0,2–0,7 | Siedząc tor bez zmian od r2: odchylenie 12,6 cm (KB 10,5), chwyt 22,7 cm przed barkami na y 30,6, gryf ok. 14 cm od twarzy (`/home/user/rev-p1/tools-ohp-r3/seated-zoom.png`). Geometria autora potwierdzona: `xMinPodLokciem(30, 7)` = 22,5 / 21 / 20 cm przy mMax 7,5 / 9 / 9,9 — pełne wykorzystanie progu reguły (10 cm) daje tylko ok. 2,5 cm. Rysunek spełnia wszystkie reguły „ustalone”; odchyłka od typowego toru (gryf blisko brody) wynika z reguły łokcia w modelu ze sztywnym barkiem i nieruchomą głową. Karta KB Seated: „Wypchnij kettlebell prosto nad głowę” (kbp.move) — tylko punkt końcowy, nie sprzeczność wprost. | Backlog (1.2) po decyzji badacza w (d): reguła łokcia w środku ruchu tylko w osi z albo tylko na dole i na górze, albo w modelu uniesienie łopatek / cofnięcie głowy. Do tego czasu wyjątki w `tor-wyjatki.json` do przyjęcia; zmienić w nich zdanie „recenzent r2 uznał wyjątek… za nieuzasadniony… zostaje do decyzji koordynatora” na stan po r3. |
| N1-r3 | NISKIE | 95% | teoretyczny (dokument) | docs/18 (wpis 10.11.2026) i opis w generatorze | „Odchył do ok. −11°” — pomiar (25 klatek): −12,4° (OHP sztanga, hantle, linki, Band, Single Arm), −13,6° (See-Saw), −11,8° (Push Press), −10,5° (KB stojące). Zapas do granicy reguły −15° to 1,4° (See-Saw); test pilnuje granicy, więc brak ryzyka dla użytkownika. | Poprawić liczby w docs/18 (najlepiej z pomiaru w teście). |
| N2-r3 | NISKIE | 95% | teoretyczny (test) | `tests/figures-v2-ohp-p1.test.ts:112` (K6, przypadek negatywny osi hantla) | `keyframeFrame(stara, i)` dostaje indeks klatki jako `u` (sygnatura `keyframeFrame(d, u)`, `lib/figures/v2/contract.ts:313`): dla i ≥ 1 wszystkie klatki to u ≥ 1 (ostatnia klatka albo lustro przy `cykl_lustro`), więc negatyw sprawdza w praktyce dwie pozy. Uwaga autora trafna; linia bez zmian w r2. Nowe testy r2 (N2, W1-r2, W2-r2) używają poprawnie `klatki[i].u`. | `keyframeFrame(stara, stara.klatki[i].u)`. |
| N3-r3 | NISKIE | 85% | realny, mało widoczny | Kettlebell Press, Double Kettlebell Press, Kettlebell Seated Press; side i front, u = 0 | Rack po W2-r2: łokieć 16,6 cm przed i 24 cm pod barkiem, zgięcie barku 34,8° (było 23,2 cm / 52°), rączka 16,9 cm przed / 9 cm nad barkiem; z przodu dłonie |z| 30 — na zewnątrz linii barków (|z| 19), łokcie przy bokach (`arkusze/slad/Double-Kettlebell-Press-front.png` u 0; `/home/user/rev-p1/tools-ohp-r3/kb-zoom.png`). Typowy rack ma pięść przed obojczykiem bliżej środka klatki. Zgodne z kartą „przy barku, łokieć blisko żeber” w stopniu wystarczającym — W2-r2 zamykam jako WYSOKIE. | Backlog: tryb dzwonu na zewnętrznej stronie przedramienia w `gear.ts` (plik wspólny), potem rack węższy, zgięcie barku ≤ ok. 25°. |

## Odpowiedzi na pytania zlecenia
**(a) Odchył tułowia.** Wygląda jak poprawne wyciskanie z lekkim odchyleniem dla ominięcia twarzy, nie „leżenie w tył”: tułów sztywny (bez wygięcia lędźwi — zgodne z błędem karty `ohp.mis.arch`, który rysunek nie pokazuje), nogi proste, odchył narasta od u 0,1, szczyt u 0,5–0,6 (−12,2…−12,4°), na górze tułów pionowo i ciężar nad barkami (pion przez bark w nakładce). Mieści się w regule `tulow_wysoko` (−15…10°, „ustalone”). Obejrzane: side u 0–0,6 i 1 w powiększeniu (OHP sztanga, KB Press), oba motywy (`slad-dark`). Liczba w docs/18 zaniżona (N1-r3).
**(b) Tor w świecie.** Tak — zamyka W1-r2 dla 9 stojących: tor side 2,8 cm (KB 3,0; Push Press 2,7), chwyt w świecie x 13,3 → 14,3 → 12,1 → 6,4 cm (u 0 / 0,2 / 0,5 / 1). To droga (b) z mojej propozycji r2 („odchył tułowia… tor względem podłogi pionowy”). Względem ciała gryf nadal ok. 14 cm od twarzy (u 0,4: chwyt 22,6 cm przed barkami) — skutek reguły łokcia, patrz (d).
**(c) Wyjątki siedzące.** Do przyjęcia jako ŚREDNIE (Ś1-r3), nie WYSOKIE: konflikt geometryczny sprawdzony (`xMinPodLokciem`), rysunek spełnia reguły „ustalone”, karty siedzące nie twierdzą „prosto w górę” (poza punktem końcowym `kbp.move`). Rozstrzygnięcie zależy od (d). Zmieniam ocenę z r2 (12,5 cm „błąd ruchu”), bo autor wykazał, że bez zmiany reguły albo modelu nie da się tego zrobić, a odchyłka nie przeczy żadnej regule ustalonej.
**(d) Reguła `lokcie_pod_dlonmi`.** Wskazuję do przeglądu badacza (rozstrzyga koordynator/badacz): źródło (NSCA Basics s. 42–43 „łokcie pod dłońmi przez cały ruch”) opisuje ciało z ruchomą łopatką i głową; w modelu ze sztywnym barkiem próg 10 cm w osi x w środku ruchu wymusza chwyt ≥ 20 cm przed barkami na wysokości czoła przy każdym realnym rozstawie (|z| 26). Pytania do badacza: czy w środku ruchu reguła dotyczy osi z (widok z przodu), czy tylko pozycji startowej i końcowej; czy uproszczenie wymaga uniesienia łopatek / cofnięcia głowy w modelu.
**W2-r2 po poprawce:** nie WYSOKIE — patrz N3-r3. Twierdzenia autora o niewykonalności ≤ 25° bez `gear.ts` nie sprawdzałem przeszukaniem siatki (wykonalność niesprawdzona); przyjmuję jako backlog.
**Test `:112`:** błąd potwierdzony — N2-r3.

## Zamknięte z r2
W1-r2 (stojące — droga przez tor w świecie; siedzące → Ś1-r3), W2-r2 (→ N3-r3), N1 (K15 oczekuje dokładnie `mis.jerk` w 3 ćwiczeniach landmine — zgodnie z moją propozycją), N2 (negatyw zza karku na danych, `klatki[i].u`), N3 (Push Press - Behind the Neck: tor 2,5 cm, 0 zawr.). Bez zmian, nie zgłaszam ponownie: Ś3-r1 (poprzeczny odcinek landmine w widoku z przodu).

## Tabela ćwiczeń

| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Overhead Press (sztanga) | wyswietlana | tor 2,8 cm, odchył −12,4° |
| Overhead Press (hantle) | wyswietlana | jw.; oś hantla poprzecznie |
| Band Shoulder Press | wyswietlana | jw. |
| Wyciskanie nad głowę (linki) | wyswietlana | jw.; linki z dolnych bloczków |
| Single Arm Overhead Press (hantel) | wyswietlana | jw. |
| See-Saw Press (Alternating Side Press) | wyswietlana | tor 1,2 cm; odchył −13,6° (średnia rąk); wyjątek 2 zawr. uzasadniony |
| Push Press | wyswietlana | tor 2,7 cm, 1 zawr. (było 12,2 / 3) |
| Push Press - Behind the Neck | wyswietlana | N3 zamknięte |
| Kettlebell Press | wyswietlana | tor 3,0 cm; rack N3-r3 |
| Double Kettlebell Press | wyswietlana | jw. |
| Kettlebell Seated Press | wyswietlana | Ś1-r3 (10,5 cm, wyjątek), N3-r3 |
| Seated Shoulder Press (hantle) | wyswietlana | Ś1-r3 (12,6 cm, wyjątek) |
| Seated Barbell Military Press | wyswietlana | Ś1-r3 |
| Seated Cable Shoulder Press | wyswietlana | Ś1-r3 |
| Arnold Press, Kettlebell Arnold Press | wyswietlana | 9,6 cm, 0 zawr. — cecha, wyjątek uzasadniony |
| Standing Barbell Press Behind Neck | wyswietlana | tor 2,5 cm |
| Landmine Press, Landmine Linear Jammer, Single-Arm Linear Jammer | wyswietlana | bez zmian od r2 |
| Pike Push Up | wyswietlana | bez zmian |
| Bradford Press, Handstand Push Up | bez rysunku | — |

## Nakładka
Elementy z reguł „ustalone” (pion przez bark, kąt łokcia) w płaszczyźnie ruchu; pion przez bark rysowany w świecie — przy odchyle pokazuje ciężar nad barkami na górze (`arkusze/nakladka/Overhead-Press-sztanga-side.png`, u 1). Bez artefaktu w rzucie z przodu. Bez znalezisk.

## Zestawy ogólne (K12)
- wyswietlana (nowe w r3): Double Kettlebell Press, See-Saw Press (`ohp.move`, `ohp.tall`, `ohp.elbowsUnder` — tor w świecie pionowy, łokieć–chwyt ≤ 7,4 cm, tułów w regule).
- potwierdzenie (skrót bez zmian od r2, w repo brak wpisu): Standing Barbell Press Behind Neck, Seated Cable Shoulder Press (`ohp.move`, `ohp.fullExt` zgodne; Ś1-r3 dotyczy rysunku, nie zdań), Push Press - Behind the Neck.
- w repo, skrót bez zmian: Landmine Press, Landmine Linear Jammer, Single-Arm Linear Jammer, Pike Push Up, Kettlebell Arnold Press.

## Karty własne bez wpisu „karty” (K11)
- wyswietlana: Overhead Press (sztanga) (`ohp.bbSetup`, `ohp.move`, `ohp.tall`, `ohp.feet`), Overhead Press (hantle) (`ohp.dbSetup`, `ohp.move`, `ohp.tall`, `ohp.elbowsUnder`), Wyciskanie nad głowę (linki) (`cohp.setup`, `ohp.move`, `ohp.elbowsUnder`, `ohp.tall`), Seated Shoulder Press (hantle) (jak w r2, skrót bez zmian).
- Karty z wpisem (Kettlebell Press, Kettlebell Seated Press, Seated Barbell Military Press, Band Shoulder Press, Single Arm, Push Press, Arnold) — skróty bez zmian; rysunek już im nie przeczy (`ohp.mis.arch` nie jest pokazany: tułów sztywny).

## K10 — wpisy v1
Overhead Press (sztanga), Overhead Press (hantle), Seated Shoulder Press (hantle), Push Press → `zastapiona` (skróty v1 z `--skroty` w JSON).

## Testy (K14) — `git diff de89b808..c161a50b -- tests/` (commit autora `681dc474`)
| Zmiana | Ocena |
|---|---|
| K15: zamiast 0 błędów — dokładnie `['mis.jerk']` dla 3 ćwiczeń landmine | poluzowanie uzasadnione (N1-r2), ściśle wyliczone |
| KB: `m.y >= 12` → łokieć ≤ 18 cm, zgięcie barku ≤ 38° + negatyw na danych sprzed poprawki | zaostrzenie |
| W1-r2: tor side ≤ 4 cm w 9 stojących + pochylenie w −15…10° w każdej klatce; negatyw > 8 cm | uzasadnione; drobiazg: zmienna `kor` w `tor()` nieużywana |
| Siedzące: tor 4–13 cm + wymagany wpis w `tor-wyjatki.json` | poluzowanie (7 nowych wyjątków toru) — uzasadnione warunkowo (Ś1-r3); Arnold ×2 i See-Saw uzasadnione |
| N2 i N3 — negatywy na danych | uzasadnione |
Inne pliki w diffie zakresu (kb_ballistic, chest_fly, mapping, data) — spoza rodziny, nie oceniam.

## Czas pracy
Ok. 35 min agenta (23:40–00:20 UTC).
