# Recenzja niezależna rodziny v2 `kb_ballistic`, runda r4. Audytor, 10.11.2026

**Werdykt rodziny: wyswietlana** (0 × KRYTYCZNE, 0 × WYSOKIE, 2 × ŚREDNIE — przeniesione z r3, 4 × NISKIE). Recenzent: audytor. Nie pisałem tej rodziny ani poprawek (L-047). Autor: programista partii 1.

## Metoda
- SHA `3e8656e` (figury/partia-1), N = 4. Czysta kopia `git archive 3e8656e` → `/home/user/rev-p1/kb_ballistic-r4` (node_modules jako dowiązanie). Rodzina jest `planned`, więc **tylko w kopii** ustawiłem `status: 'ready'` w `lib/figures/v2/families.ts:42`. Skróty: `node scripts/zrodla-runtime.mjs --skroty` w kopii.
- Do porównania z r3: druga kopia `b7cb1dcd` → `/home/user/rev-p1/kb-b7c` (też `ready` tylko w kopii). Zmieniło się 12 z 16 póz. Bez zmian: Bottoms-Up, Double Kettlebell Push Press, Double Kettlebell Jerk, One-Arm Kettlebell Push Press, One-Arm Kettlebell Jerk. Swing: tylko kolana (xy ≤ 2,4 cm, z ≤ 3,5 cm). One-Arm Swings: tylko z (rozstaw). `overlay/kb_ballistic.ts` i `gear.ts` bez zmian.
- Arkusze (56 PNG, `/home/user/rev-p1/kb_ballistic-r4/arkusze/`):
  - `slad/` 16 ćwiczeń, side, jasny; `slad-dark/` Kettlebell Snatch, Snatch (hantel), Kettlebell Clean, Double Kettlebell Snatch;
  - `slad48a/` (u 0–0,5) i `slad48b/` (u 0,5–1), kadry co 1/48: Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel), Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, One-Arm Kettlebell Clean and Jerk;
  - `slad48a-dark/`, `slad48b-dark/` co 1/48: Kettlebell Snatch, Snatch (hantel);
  - `nakladka/` 18 arkuszy.
- W pełnej rozdzielczości obejrzałem: `slad48a/` i `slad48b/Snatch-hantel-side.png`, `slad48a/` i `slad48b/Kettlebell-Snatch-side.png`, `slad48b-dark/Kettlebell-Snatch-side.png`, `slad48b/Kettlebell-Clean-side.png`, `slad/Kettlebell-Swing-side.png`, `slad/One-Arm-Kettlebell-Split-Jerk-side.png`, `slad/One-Arm-Kettlebell-Clean-and-Jerk-side.png`, `nakladka/Kettlebell-Sumo-High-Pull-side-data-0.png`.
- Liczby policzyłem własnymi skryptami w `/home/user/rev-p1/tools-r4/` (poza repo), na `frameAt` (spec, jak w aplikacji), `jointAngles`, `odstepCiezaru`, `equipColliders`, co 1/48 i 1/96: `v.mjs` (prędkość śladu, stosunki, kąty, odstęp), `pen.mjs` (przenikanie dzwonu/hantla w każdą część ciała), `bb.mjs` (dzwon–dzwon), `z.mjs` (rozstaw w osi z), `cmp.mjs` (różnica póz r3 → r4), `slad48.mjs` (arkusz co 1/48).
- Testy w kopii (z `ready`): `figures-v2-kb-ballistic-p1` + `figury-mobilnosc-reguly` 123/123; `figury-recenzja-p4a` + `figures-v2-tor` 262/262 (p4a „wzdluz_gora” zielony po N2-r3).
- Czas: rwanie, Clean and Jerk i wyciskania to pętla jednokierunkowa, `ONE_WAY.repMs` = 1500 ms (`lib/figures/v2/anim.ts:17`), więc 1/48 u = ok. 31 ms (r3 podał 52 ms, to była pomyłka: 2500 ms to cała pętla z pauzami). Zarzuty i swing to wahadło z łagodnym startem (`uAt`, podnoszenie 1000 ms), więc czas 1/48 u zmienia się w cyklu; stosunek sąsiednich kadrów prawie nie zależy od tego wygładzenia.

## Ciągłość rwań (warunek koordynatora, pole `ciaglosc_rwan`)
**Szarpnięcia nie ma.** Nie widać przestoju z ponownym przyspieszeniem ani dociskania łokcia po zatrzymaniu. Obejrzane arkusze co 1/48, u = 0–1, w obu motywach dla Kettlebell Snatch i Snatch (hantel). Double Kettlebell Snatch tylko w jasnym.

Prędkość śladu w cm na 1/48 (własny pomiar `v.mjs`, cały cykl, nie tylko po wyproście bioder):

| Ćwiczenie | Przebieg prędkości (cm/48) | Maks. stosunek sąsiednich kadrów (cały cykl) | r3 |
|---|---|---|---|
| Kettlebell Snatch | 3,9–4,2 (zamach) → 3,0 przy wyproście (u = 0,229) → 4,0–4,8 (u 0,25–0,54) → 4,0–3,7 → 3,0 → 2,3 do u = 1 | **1,4** (u = 0,146) | 1,7 przez 11 kadrów, potem ×4 i ×5 |
| Double Kettlebell Snatch | 2,6 (u 0–0,125) → 5,1–5,6 → 4,3–3,6 → 4,4–5,2 → 4,7–4,1 → 3,1 → 2,4 | **1,9** (u = 0,146, przed wyprostem bioder); po wyproście ≤ 1,2 | ×2,3 i ×5,6 |
| Snatch (hantel) | 7,1 → 5,8 → 7,9 (u = 0,229) → 4,6 → 4,0 → 2,4–2,7 (u 0,29–0,42) → 3,5 → 4,1 → 5,7 → 5,0 → 3,8 → 2,9 | **1,7** (u = 0,25 i 0,29) | 2,3 przez 14 kadrów, potem ×3 |
| Kettlebell Clean | 2,9–3,2 → 1,9 → 2,1 (u 0,33–0,56) → 1,8 → 1,4 → 1,0 | **1,4** | 1,0 przez 12 kadrów, potem ×3 |
| Double Kettlebell Clean | 2,1 → 3,0–4,2 → 2,8 → 4,6 → 3,1 → 2,2 → 1,9 → 1,4 → 1,0 | **1,6** | ×2,2 |
| Dumbbell Clean | 4,2 → 3,4 → 1,8–1,6 (u 0,10–0,25, przed wyprostem) → 2,5 → 1,4–2,2 → 1,0 | **1,9** (u = 0,104, przed wyprostem); po wyproście ≤ 1,4 | ×3 |
| One-Arm Kettlebell Clean and Jerk | 5,4–5,9 → 4,0–5,2 → 6,2–7,7 → 5,6 → 3,1 (rack) → 3,8 → 2,5 → 1,7 → 2,5 | **1,8** (u = 0,375, wejście w rack) | ×1,8–3,2 |
| Bottoms-Up (bez zmian) | 1,7 → 2,4–3,0 → 1,7 → 2,5–3,0 → 2,2 → 1,0 → 0,2 (stoi w racku, prostuje nogi) | 1,5; potem 1,0 → 0,3 (×3,1) — zatrzymanie w racku, bez ponownego przyspieszenia | — |

- Miara: większa / max(mniejsza, 0,3), liczona, gdy większa > 1,5 cm. Moje maksima mieszczą się w deklaracji autora (1,16–1,79 po wyproście). Dwa wyższe stosunki (1,9) są w zamachu, przed wyprostem bioder, i nadal są < 2,2.
- **Dociskanie łokcia nad głową po zatrzymaniu: brak.** Łokieć prostuje się do 9° w ostatnich ok. 5 kadrach, a ciężar wciąż jedzie w górę: Kettlebell Snatch 2,3 cm/48, Snatch (hantel) 2,9, Double 2,4. Zatrzymanie przypada dopiero w u = 1, na pauzie pętli.
- Snatch (hantel), u = 0,29–0,42: hantel zwalnia po wyproście bioder do 2,4–2,7 cm/48 (ok. 0,8 m/s) i potem stopniowo przyspiesza do 5,7 w ok. 9 kadrach (ok. 0,28 s, sąsiednie ×1,1–1,3). Na `slad48a/Snatch-hantel-side.png` hantel jedzie w górę równo, bez widocznego postoju. To wysoki ciąg ręką („poprowadź hantel w górę” na karcie), nie szarpnięcie. **Bez zgłoszenia** (pewność < 80%, że to wada).
- Przeskok położenia śladu: maks. 7,9 cm/48 (Snatch (hantel)), poniżej zaostrzonego progu testu 9 cm.

## Weryfikacja poprawek r3
| Znalezisko r3 | Pomiar r4 | Stan |
|---|---|---|
| W1-r3 szarpnięcie (7 ćw.) | tabela wyżej; stosunki ≤ 1,9 w całym cyklu, bez pełzania i bez skoku ×3–5 | **zamknięte** |
| W2-r3 start Snatch (hantel) | test p1 (tułów ≥ 25°, hantel ≤ 9 cm przed kostką, bark nie za hantlem) zielony; łokieć przed wyprostem maks. 12,1° (u = 0,063); arkusz `slad48a/Snatch-hantel-side.png` u = 0: biodra z tyłu, plecy proste, hantel przy stopach | **zamknięte** |
| N1-r3 (R6) | zapadka 9 → 2 (Sumo 3,6 cm, Clean and Jerk 6,8 cm — lądowanie przedniej stopy); rozstaw w z stały (kostki 40 cm, biodra 17 cm) | częściowo; reszta NISKIE → backlog (opis zapadki uzasadniony) |
| N2-r3 test p4a | punkt odniesienia Snatch (hantel), test zielony | zamknięte |
| N3-r3 tor-wyjatki | pomiary z 10.11, opis Snatch (hantel) poprawiony | zamknięte (resztka w N3-r4) |
| Ś1-r3, Ś2-r3, N4-r3 | nie ruszane (autor: backlog) | ocena niżej |

## Znaleziska

| # | Poziom | Pewność | Realność | Ćwiczenie, widok, kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| Ś1-r3 (bez zmian) | ŚREDNIE | 90% | realny (każde powtórzenie, ok. 2–3 klatki ekranu) | Kettlebell Clean u = 0,833–0,854; Double Kettlebell Clean u = 0,854; One-Arm Kettlebell Clean and Jerk u = 0,29–0,333; side | Środek dzwonu skacze o 13,9 / 14,4 / 18,8 cm na 1/48 przy przewrocie do racka (`v.mjs`, kolumna vbell). Ślad jest ciągły. Na `slad48b/Kettlebell-Clean-side.png` widać przejście u = 0,833 → 0,854: dzwon przed dłonią → dzwon w racku. Przyczyna to silnik (`gear.ts`, `resolveBells`), plik bez zmian od r3. | Backlog 1.1 (silnik): obrót dzwonu wokół dłoni rozłożony na kilka kadrów; test skoku środka ciężaru. **Nieblokujące.** To błąd wyglądu sprzętu przez ok. 50 ms. Ruch, liczby i tekst są poprawne, funkcja działa, więc nie spełnia żadnej kategorii progu WYSOKIE. |
| Ś2-r3 (bez zmian) | ŚREDNIE | 85% | realny | Bottoms-Up Clean From The Hang Position, side, u = 0,06–0,5 | Poza bajt w bajt jak w r3: łokieć 30,5° przy biodrze 58°, 61° przy 37°; odstęp 16–18 cm. Zestaw `oly` („Na starcie plecy proste, klatka do góry.”) nie przeczy rysunkowi. Ćwiczenie nie ma karty własnej, która mówiłaby „ręka po biodrach”. | Backlog 1.1 (tym samym ciągiem co W1-r3, albo wyjątek z powodem od badacza). **Nieblokujące**: brak sprzeczności z tekstem w aplikacji, wariant z zawisu. |
| N4-r3 (bez zmian, doprecyzowanie) | NISKIE | 90% | realny, niewidoczny w side | Kettlebell Clean u = 0,563 (−1,3 cm), Double Kettlebell Clean u = 0,573 (−1,1), One-Arm Kettlebell Clean and Jerk u = 0,26 (−1,3) | Dzwon wchodzi w **górę prawego uda** (przy stawie biodrowym), nie w tułów, jak zapisała r3 (`pen.mjs`: trunk ≥ 0,5 cm). W r3 było −1,2 / −1,2 / −1,3. | Backlog 1.1, razem z Ś1-r3. **Nieblokujące.** |
| N1-r4 (nowe) | NISKIE | 90% | realny, niewidoczny w side | Snatch (hantel), side, u = 0,25–0,29 (najgłębiej u = 0,260) | Głowa hantla wchodzi w prawe udo na **−1,4 cm** (`pen.mjs`; arkusz: odstęp −1,1 / −1,3 / −0,4 cm). W r3 było +2,2 cm. Skutek węższego rozstawu (18 cm) i kolan w zawisie (warunek 3). Na `slad48a/Snatch-hantel-side.png` hantel leży na udzie w rzucie, więc przenikania nie widać. | Hantel o 1,5–2 cm dalej od uda w z albo kolano prawe minimalnie szerzej w u 0,22–0,30. Test: `pen` uda ≥ −0,3 cm dla rwań i zarzutów. Backlog 1.1. |
| N2-r4 (sprzed r4) | NISKIE | 95% | teoretyczny (jedyny widok side; z niewidoczne) | Double Kettlebell Snatch u ≈ 0–0,27 (25/96 kadrów), Double Kettlebell Clean (28/96) | Dwa kettlebelle zlewają się w jeden: środki w tym samym punkcie (z = ±0,1 cm), przenikanie −18,9 cm, dłonie 6 cm od siebie (`bb.mjs`, u = 0,188). Tak samo było w r3 (−18,9 / −19,0). W rzucie z boku dwa dzwony i tak się pokrywają. | Przy dodaniu widoku przodu: dzwony rozsunięte (dłonie ok. szerokość bioder), test dzwon–dzwon ≥ 0. Backlog. |
| N3-r4 | NISKIE | 90% | teoretyczny (dane testu) | `tests/tor-wyjatki.json`, wpis „Dumbbell Clean\|side” | Opis „zarzut kettlebella: ciężar cofa się między nogi” przy zarzucie hantli. Na rysunku hantle są po bokach ud (test p1 „Dumbbell Clean … nie dalej niż 25 cm przed kostką”). | Poprawić opis przy najbliższej zmianie pliku. |

**Bez zgłoszenia** (pewność < 80%, do badacza):
- Rwania i Clean and Jerk stoją na palcach przez długi odcinek: Snatch (hantel) u ≈ 0,35–0,9, Split Jerk u = 0,15–0,8. Było tak już w r3, karta tego nie zabrania.
- Swing: biodro otwiera się stopniowo razem z wznoszeniem dzwonu (biodro 50° przy dzwonie na wysokości kolan). Poza ta sama co przyjęta w r1–r3.
- Snatch (hantel): zwolnienie i stopniowe przyspieszenie po wyproście bioder (sekcja „Ciągłość rwań”).

## Ocena nieblokowania (warunek 2)
- **Ś1-r3** — ŚREDNIE, może iść do backlogu. To krótki (ok. 50 ms) błąd orientacji dzwonu. Tor, liczby i tekst są poprawne, funkcja działa, nie ma zagrożenia dla danych, prywatności ani dostępności. Naprawa wymaga zmiany silnika wspólnego dla rodzin, a zamrożenie zakresu przemawia za backlogiem.
- **Ś2-r3** — ŚREDNIE, może iść do backlogu. Nie ma sprzeczności z tekstem widocznym w aplikacji, a wariant z zawisu dopuszcza wolniejszy ciąg. Jeśli badacz uzna ciąg ręką za błąd techniki pokazywany jako wzór, poziom wraca do oceny.
- **N4-r3** — NISKIE, może iść do backlogu. W jedynym widoku przenikania nie widać (−1,3 cm w udo przy biodrze).

## Stały rozstaw i kolana (warunek 3)
Rozstaw kostek w z wynosi 40 cm (± 20) przez cały cykl, biodra 17 cm, kolana 28,6–49,4 cm (na zewnątrz w zawisie). Odstęp ciężaru od części ciała, minimum w cyklu co 1/96 (`pen.mjs`):

| Ćwiczenie | uda | podudzia | tułów |
|---|---|---|---|
| Kettlebell Swing | 5,9 | 7,2 | 12,6 |
| One-Arm Kettlebell Swings | 1,4 (r3: 0,3) | 2,3 | 13,3 |
| Kettlebell Snatch | −0,0 (u = 0,083, styk) | 4,1 | 6,6 |
| Double Kettlebell Snatch | 1,7 | 5,2 | 7,5 |
| Snatch (hantel) | **−1,4** (N1-r4) | 1,8 | 9,5 |
| Kettlebell Clean | −1,3 (N4-r3) | 4,1 | 0,6 |
| Double Kettlebell Clean | −1,1 (N4-r3) | 5,2 | 0,7 |
| Dumbbell Clean | 0,3 | 4,5 | 8,1 |
| Clean and Jerk | −1,3 (N4-r3) | 3,7 | 0,5 |
| Bottoms-Up | 0,3 | 1,8 | 10,9 |
| Sumo High Pull | 6,7 | 15,2 | 3,6 |

Wzrokowo (arkusze side, oba motywy): w zamachu dzwon przechodzi między udami bez nachodzenia kolan na tor. W rzucie z boku dzwon przykrywa udo, co przy tym widoku jest naturalne. Jedyne nowe przenikanie to N1-r4.

## Uwagi do testów (K14, `git diff 43e2833..3e8656e -- tests/`, pliki rodziny)
| Zmiana | Ocena |
|---|---|
| nowa miara W1-r3 `ratioPoWyprosci` ≤ 2,2 z przypadkiem negatywnym na `kb-ballistic-przed-w1r3.json` i kontrolą Power Snatch | uzasadnione, zaostrzenie. Luka: miara pomija kadry ≤ 2 cm i fazę przed wyprostem bioder. Mój pomiar całego cyklu też daje ≤ 1,9, więc dziś bez skutku |
| skok śladu rwań ≤ 9 cm na 1/48 (`SKOK_RWANIA_48`) | uzasadnione, zaostrzenie względem 48 cm (r3 Uwagi) |
| W2-r3: tułów ≥ 25°, hantel ≤ 9 cm przed kostką (było ≤ `toeFwd`), łokieć ≤ 15° | uzasadnione, zaostrzenie (zamyka uwagę r3 o poluzowaniu progu startu) |
| p4a „wzdluz_gora”: odniesienie Snatch (hantel) zamiast Kettlebell Clean | uzasadnione (N2-r3) |
| R6 zapadka `kb_ballistic` max 4 → 2 z opisem | uzasadnione, zaostrzenie |
| p4a/odciski: nowe skróty 7 + 8 póz z datą i powodem | uzasadnione (zmiana celowa) |
| tor-wyjatki: pomiary 10.11 | uzasadnione; resztka opisu w N3-r4 |

## Nakładka (K9)
`overlay/kb_ballistic.ts` bez zmian. 18 arkuszy (`arkusze/nakladka/`). Pozy Swing, One-Arm Swings i Sumo zmieniły się tylko w stopach i kolanach. `Kettlebell-Sumo-High-Pull-side-data-0.png`: linia pleców (`kbBackRef`) leży w płaszczyźnie ruchu, a poza błędu „zaokrąglone plecy” koloruje plecy. Bez znalezisk.

## Karty własne (K11) i zestawy ogólne (K12)
- **Kettlebell Clean** (kbb.bellSetup, kbb.cleanMove, kbb.rack, kb.hips, kbb.mis.armPull, kbb.mis.cast): rysunek zgodny. Łokieć ≤ 10° do wyprostu bioder, potem ciężar w górę blisko ciała (odstęp ≤ 4 cm w ciągu) i rack przy barku (chwyt 9 cm pod barkiem, łokieć 132°). „Postaw kettlebell przed stopami” to ustawienie przed pierwszym powtórzeniem; animacja pokazuje cykl od zamachu, tak samo jak przyjęty Swing. Wpis „karty”.
- **Kettlebell Snatch** (kbb.bellSetup, kbb.snatchMove, kbb.punch, kbb.mis.bang): „jednym ruchem nad głowę” zgodne (stosunek ≤ 1,4, bez przestoju). Wypchnięcie pięści przy twarzy też zgodne: przewrót u ≈ 0,73, łokieć do 9° w u = 1. Wpis „karty”.
- **Double Kettlebell Snatch** (kbb.dblStance, kbb.dblSnatchMove, kbb.mis.bang): stopy szerzej niż biodra (kostki 40 cm, biodra 17 cm), zamach między nogami, jeden ruch nad głowę. Zgodne. Wpis „karty”. N2-r4 (zlane dzwony) jest niewidoczny w side i nie przeczy tekstowi.
- **Snatch (hantel)** i **Double Kettlebell Clean**: sprzeczność z r3 (W1-r3, W2-r3) ustąpiła. Potwierdzam zgodność wpisem „karty” (skrót bez zmian).
- **Double Kettlebell Push Press**, **One-Arm Kettlebell Push Press** (kbb.rackStart(Dbl), kbpp.move, pp.legs, kbpp.mis.rebend): rysunek bez zmian od r3. Jedno ugięcie kolan (maks. 32° / 34°), potem wyprost nóg i ramion do 10–17°, bez drugiego ugięcia. Start w racku (chwyt 8,9 cm pod barkiem). Zgodne. Wpisy „karty”.
- **Zestaw `oly`** („Na starcie plecy proste, klatka do góry.”) przy **Dumbbell Clean** i **One-Arm Kettlebell Clean and Jerk**: start z prostymi plecami, tułów pochylony, klatka nie zapada się (`slad/…`, u = 0). Zgodne. Wpisy „zestawy” (skrót `20c8125fdfa2`).
- Zestawy z ważnymi wpisami i niezmienionym skrótem (One-Arm Swings, Bottoms-Up, One-Arm Jerk, Split Jerk, Sumo): bez nowych wpisów. Wpisy „zestawy” Push Press (`4baa1c1dba94`) są nieaktualne, bo zestaw zastąpiła karta własna. Koordynator zdejmuje je z `zestawy_zmienione` po przepisaniu kart.
- **K10**: v1 Kettlebell Swing (`a7fcbadd5b3f`) → `zastapiona` (rodzina v2 wyswietlana).

## Tabela ćwiczeń
| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Kettlebell Swing | wyswietlana | ruch jak r1–r3 (kolana ≤ 2,4 cm) |
| One-Arm Kettlebell Swings | wyswietlana | R6 0; udo 1,4 cm |
| Kettlebell Clean | wyswietlana | W1-r3 zamknięte; Ś1-r3, N4-r3 → backlog |
| Double Kettlebell Clean | wyswietlana | W1-r3 zamknięte; Ś1-r3, N4-r3, N2-r4 → backlog |
| Dumbbell Clean | wyswietlana | W1-r3 zamknięte |
| Bottoms-Up Clean From The Hang Position | wyswietlana | Ś2-r3 → backlog |
| Kettlebell Snatch | wyswietlana | W1-r3 zamknięte |
| Double Kettlebell Snatch | wyswietlana | W1-r3 zamknięte; N2-r4 |
| Snatch (hantel) | wyswietlana | W1-r3, W2-r3 zamknięte; N1-r4 |
| Double Kettlebell Push Press | wyswietlana | bez zmian |
| Double Kettlebell Jerk | wyswietlana | bez zmian |
| One-Arm Kettlebell Push Press | wyswietlana | bez zmian |
| One-Arm Kettlebell Jerk | wyswietlana | bez zmian |
| One-Arm Kettlebell Split Jerk | wyswietlana | lądowanie bez poślizgu (R6 0) |
| Kettlebell Sumo High Pull | wyswietlana | R6 3,6 cm (zapadka, BRZEGOWE) |
| One-Arm Kettlebell Clean and Jerk | wyswietlana | Ś1-r3, N4-r3; R6 6,8 cm (zapadka) |
| Kettlebell Pirate Ships | bez rysunku | bez zmian |

## Obszary bez znalezisk
Ciągłość i tempo rwań oraz zarzutów, start Snatch (hantel), ślad w chwycie (test p1 ≤ 3 cm), przeskok śladu (≤ 7,9 cm/48), DATA_UI (fazy, jednokierunkowe), motyw ciemny, nakładka, orientacja hantla, rozstaw stóp (R6 w 14 z 16), karty własne i zestawy (zgodne z rysunkiem).
