# Recenzja niezależna rodziny v2 `row` (wiosłowanie), runda r1 — audytor, 09.11.2026

**Werdykt rodziny: do poprawy** (2 × WYSOKIE, 1 × ŚREDNIE, 2 × NISKIE). Recenzent: audytor (nie pisał rodziny; L-047). Autor: programista partii 1.

## Metoda
- SHA autora `c997ca5c` (gałąź figury/partia-1-row), baza `02d5c0c0`, N = 1. Czysta kopia: `git archive c997ca5c` → `/home/user/rev-p1/row-r1` (node_modules dowiązane).
- Arkusze własne (64 PNG): `arkusze/slad/` — 24 (12 ćw. × side, top, motyw jasny), `arkusze/slad-dark/` — 6 (One Arm Row, Chest Supported Row, Bent Over Row (hantle), motyw ciemny), `arkusze/nakladka/` — 34 (`--family row`, z pozami błędów). Powiększenia kadrów: `arkusze/kadry/`.
- `cmp` z arkuszami autora (`/home/user/arkusze-partia-1/row/`): ślady 24/24 bajtowo równe; nakładka 24/34 równe, 10 arkuszy pozy błędu (`*-data-0`) różnych — autor wygenerował je przed zmianą ZLE_BEND 32°→40°; oglądałem własne.
- Liczby z `frameAt`/`jointAngles` (u = 0; 0,25; 0,5; 0,75; 1), styk `gap` z ławką, porównanie `generuj()` (scripts/figures/agent-pozy/row.mjs) z `lib/figures/v2/poses/row.json`, dobór kart `cueIdsOf`/`errorsOf`/`techniquesOf` (jednorazowy test w kopii, usunięty).
- `sha` z `node scripts/zrodla-runtime.mjs --skroty` w kopii.

## Znaleziska

| # | Poziom | Pewność | Realność | Ćwiczenie, widok, kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 90% | realny (każde otwarcie karty) | Chest Supported Row, Lying T-Bar Row; side i top; wszystkie kadry u = 0…1 | Uda leżą poziomo na siedzisku (gap udo–ławka −0,1 cm), tułów 45° głową w dół-przód (front = [−0,7, −0,7]): biodro w **przeproście ok. 37°** (`jointAngles.hip` = −37,4°; kąt między udem [0,99, −0,14] a przedłużeniem tułowia [0,71, −0,71] ≈ 37°, po stronie pleców), kolana 66,9°, stopy na podłodze za siedziskiem. Zakres wyprostu biodra człowieka to ok. 10–30°; trener nie ustawia tak nikogo na ławce skośnej. Plik jest starszy niż generator: `generuj()` daje kostki x = 78,2 (plik 61,1), biegun kolana [−1, −0,2, 0] (plik [1, 0,2, 0]), siedzisko 2 (plik 20) — nogi prawie proste, stopy na podłodze, wyprost biodra ok. 12°. | Odświeżyć obie pozy z generatora (`generuj()`), arkusze śladu i nakładki od nowa; test: wyprost biodra ≤ 20° w każdej klatce (przypadek negatywny: obecne dane −37°). |
| W2 | WYSOKIE | 90% | realny (Chest Supported Row — karta własna z `row.elbowsPast`/`csr.pull`); Seal Row i Lying T-Bar Row — od chwili przyjęcia zestawu ogólnego `row` | element `rowElbowPastBackRef`, side | Element rysuje **pion świata przez bark** (`lib/figures/v2/overlay/row.ts:19`, `shape: 'vertical'`), a reguła i karta mówią „łokcie miną linię pleców”; miara reguły liczy odległość prostopadle do tułowia (`scripts/figures/v2-sens.mjs:274`, `dot(elbow − shoulder, sk.front)`). Przy tułowiu 45° (CSR) łokieć mija pion już ok. u ≈ 0,05 (arkusz `nakladka/Chest-Supported-Row-side.png`), a linię pleców dopiero ok. u ≈ 0,37 (miara: −4,8 cm przy u = 0,25, +4,9 cm przy u = 0,5). Przy tułowiu poziomym (Seal Row, `nakladka/Seal-Row-sztanga-side.png`) pion jest **prostopadły** do pleców: łokieć mija go w stronę stóp przy u ≈ 0,15, a ponad linię pleców wychodzi dopiero przy u = 1 (+7,7 cm). Rysunek uczy innego kryterium niż tekst. | Linia odniesienia równoległa do tułowia przez bark (np. odcinek miednica→bark przedłużony za bark, w rzucie z boku) albo usunięcie elementu. Test: kierunek linii = kierunek tułowia ±5° i chwila przekroczenia linii na rysunku = chwila, w której miara reguły zmienia znak (przypadek negatywny: pion). |
| Ś1 | ŚREDNIE | 95% | realny (brak funkcji, treść nie jest błędna) | Bent Over Row (sztanga), Bent Over Row (hantle), T-Bar Row | Karty mają błąd `mis.roundBack` („Zaokrąglanie pleców, żeby dociągnąć ciężar.”), `generuj()` tworzy dla nich pozę błędu (0→20→40°), a w `row.json` jej nie ma (`errorsOf` puste). Rysunek bez animowanego błędu w trzech głównych ćwiczeniach rodziny, a odmiany ogólne (Reverse Grip, Rear Delt, Smith) go mają. Ten sam problem „plik starszy niż generator” co W1, poza 2 ćwiczeniami wskazanymi przez autora. | Odświeżyć z generatora razem z W1; test: każde ćwiczenie z tekstem błędu w karcie i pozą błędu w generatorze ma ją w pliku (`generuj()` ≡ plik). |
| N1 | NISKIE | 85% | realny | One Arm Row (hantle), top i side, każdy kadr | Ręka podporowa: środek chwytu na samej krawędzi ławki (z = −15 przy szerokości 30 cm, `EQUIP.benchW`), łokieć ręki podporowej zgięty 50,6° i wypchnięty na zewnątrz (biegun łokcia [−0,3, 0,2, −1]) — w rzucie z góry ramię wystaje poza obrys ławki (`kadry/oar-top-u0.png`). Karta: „Oprzyj kolano i dłoń jednej strony na ławce”. | Dłoń z ≈ −8…−10, ręka podporowa prawie prosta (≤ 20°), pod barkiem. |
| N2 | NISKIE | 90% | teoretyczny (dane wewnętrzne) | Seal Row (sztanga) | Wpis `do_przegladu` w `data/zrodla/figury-ograniczenia-silnika.json` (wpisy[10]) nierozstrzygnięty (K2). Autor ma rację, że „granica kontraktu” to błędne uzasadnienie. Wysokość 80 cm jest poprawna: przy u = 0 gryf na 26,1 cm, talerz 22,5 cm, więc talerze 3,6 cm nad podłogą przy prostych rękach (łokieć 12,4°) — tak ustawia się ławkę do tego ćwiczenia. | Zmienić tekst w WYJATKI (`scripts/figures/agent-pozy/row.mjs:73`) na „ławka tak wysoka, by talerze nie dotykały podłogi przy prostych rękach” i rozstrzygnąć wpis. |

## Odpowiedzi na pytania autora
1. CSR / Lying T-Bar Row — obecna poza nie jest poprawna (W1), kierunek „odśwież z generatora”. Uwaga: w generatorze Ś1 też różni plik od generatora (3 kolejne ćwiczenia).
2. One Arm Row — tak, dłoń podporowa na krawędzi i ramię poza obrysem w rzucie z góry (N1, NISKIE).
3. Pary hantli — ślad w chwycie R: Bent Over Row (hantle) i (linki) z = 27 = chwyt R, CSR z = −24 = chwyt R. Oś hantla przy chwycie neutralnym `obrotPrzedramienia` 0: oś [−1, 0,1, 0] (CSR), [−1, −0,2, 0] (One Arm), w rzucie z góry hantle ustawione wzdłuż ruchu — poprawne (K6). Sztangi: nachwyt −75°, Reverse Grip +78° (podchwyt), zgodnie z kartami.
4. Wartości na krawędzi: Barbell Rear Delt Row — łokieć za barkiem 5,5 cm (próg 5); zestaw ogólny `rowBent` nie ma `row.elbowsPast`, element nie jest rysowany, łokcie mocno odwiedzione (79,7° poza płaszczyzną) — pasuje do wiosłowania na tylne aktony; bez znaleziska. Smith — kolano 29,0° (≤ 30°) — bez znaleziska. Smith/Pendlay — łokieć na górze 143,6° / 143,1°: blisko końca czynnego zgięcia (ok. 145–150°), ale wynika z tułowia prawie poziomego (12° / 10°) i sztangi przy dolnej części klatki (0,8 / 0,7 długości tułowia od miednicy); u Smitha tor pionowy (x = 11 stałe) wymusza pochylenie przedramienia 36°. Wygląda ciasno, ale nie jest błędem (pewność < 80%) — bez znaleziska.
5. Seal Row — N2.

## Ruch: przegląd ćwiczeń (K4–K8)
- Bent Over Row (sztanga/hantle/linki), Reverse Grip, Rear Delt, T-Bar: tułów 35° nad poziomem, kolana 25,7°, plecy proste; ślad prosty od wysokości kolan do brzucha (0,4 długości tułowia) — zgodnie z „do brzucha”. T-Bar: łuk dźwigni (oś za osobą, drążek między nogami), łokieć 0° na dole.
- Pendlay: tułów 10°, gryf startuje z 23,2 cm (talerze na podłodze) — zgodnie z „każde powtórzenie od podłogi”; koniec przy dolnej części klatki.
- Smith: tor pionowy, start 25,1 cm, odstęp od goleni 0,1 cm (bez przenikania).
- One Arm Row: tułów 15°, ręka pracująca 17,9°→114,8°, łokieć 18,8 cm za barkiem, hantel wzdłuż boku do talii; tułów bez skrętu.
- Seal Row: leżenie przodem na ławce 80 cm, tułów poziomy, gryf pod barkami, na końcu pod ławką; łokieć na końcu na wysokości linii pleców.
- CSR / Lying T-Bar: ręce i tułów poprawne (łokcie wzdłuż tułowia, 6,7° poza płaszczyzną; łokieć 22 cm za linią barku na końcu), klatka stale na oparciu (gap −0,4 cm); błędne nogi i biodra — W1.
- Zakres łokcia (K8): dół 12,4–18,4° (T-Bar 0°), góra 114,8–143,6°. „Na dole wyprostuj ręce do końca” przy 12–18° zgięcia jest w regule `zakres_lokcia` (≤ 20°, „uproszczenie”, ustalone) — uwaga, nie znalezisko.
- Styki (K7): `checkFrame` bez uwag, ciało (bez dłoni) ≥ −1 cm od ławki co 0,025 (test autora i moje pomiary); goleń klęczącej nogi w One Arm Row 1,2 cm nad ławką — w tolerancji.
- Tempo/fazy (K15): `DATA_UI.row` = Podciąganie/Opuszczanie, `lowerFirst: false`, mierzony łokieć; teksty przez słownik (`lib/i18n.en.ts:783,787`). Błąd animowany tylko tam, gdzie jest tekst błędu (Reverse Grip, Rear Delt, Smith — zestaw `rowBent` z `mis.roundBack`; Pendlay, linki — karta). Odwrotnie — Ś1.
- Ciemny motyw (One Arm Row, CSR, Bent Over Row (hantle)): czytelny, ślad i hantle widoczne.

## Nakładka
- `rowElbowLimb` (zakres_lokcia, ustalone): w rzucie z boku, łuk rośnie z kątem łokcia, zgodny z `row.fullStretch`/`*.pull` — poprawny.
- `rowElbowPastBackRef` — W2.
- Pozy błędu (`*-data-0`): czerwona linia pleców (`backLine`) i znacznik na plecach; element właściwy dla `mis.roundBack`.
- Widok z góry bez elementów — zgodnie z uzasadnieniem autora.

## Zestawy ogólne (K12)
- Barbell Rear Delt Row, Reverse Grip Bent Over Row, Smith Machine Bent Over Row (`rowBent`: pochylenie w biodrach przy lekko ugiętych kolanach, plecy proste, ręce proste na dole; błąd: zaokrąglone plecy) — każde zdanie zgadza się z rysunkiem (tułów 12–35°, kolana ≤ 29°, zgięcie kręgosłupa 0, łokieć ≤ 18,4° na dole, poza błędu obecna). Wyświetlana.
- Seal Row (sztanga), Lying T-Bar Row (`row`: klatka na podporze, łokcie za linię pleców, ręce proste na dole; błąd: szarpanie) — zdania zgodne z ruchem (Seal: tułów na ławce przez cały ruch, łokieć na końcu na wysokości linii pleców; Lying T-Bar: klatka na oparciu, łokieć 22 cm za linią barku). Wyświetlana co do treści. Uwaga: przyjęcie zestawu włącza element W2 — rysunek tych ćwiczeń i tak czeka na poprawę rodziny.

## Karty własne (K11) i wpisy v1 (K10)
- Bez wpisu „karty”: Bent Over Row (sztanga), Bent Over Row (hantle), One Arm Row (hantle), T-Bar Row, Chest Supported Row — treść zgodna z rysunkiem (nachwyt szerzej niż barki: chwyt 46 cm wobec 38 cm barków; „do brzucha” = 0,4 długości tułowia; T-Bar „do tułowia” — odstęp 0,9 cm; One Arm: kolano i dłoń tej samej strony na ławce, ramię za linią tułowia 18,8 cm; CSR: klatka na podporze, łokcie wzdłuż tułowia). Sprzeczności nie widzę. Wyświetlana. (Nogi CSR nie są opisane w karcie — W1 dotyczy tylko rysunku.)
- Wpisy v1 do zmiany na „zastapiona” **dopiero, gdy v2.row będzie „wyswietlana”**: Bent Over Row (sztanga), Bent Over Row (hantle), Pendlay Row, One Arm Row (hantle), T-Bar Row, Chest Supported Row (6).

## Testy (K14) — `git diff 02d5c0c0..c997ca5c -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| tests/figures-v2-mapping.test.ts | lista rodzin ready + `row`, POSE_FAMILIES + `row`, licznik figur + 12 | uzasadnione (podłączenie rodziny), nie poluzowanie |
| tests/figures-v2-nakladka-triceps-olympic.test.tsx | rejestr 7 → 8 rodzin | uzasadnione |
| tests/fixtures/figury-v2-zlote.json | nowe odciski 5 póz (Reverse Grip, Rear Delt, Pendlay, Smith, linki) | uzasadnione: zmiana ZLE_BEND tylko w `bledy[]`; inne odciski bez zmian |
| tests/fixtures/pokrycie-katalogu.json | status planned → ready | uzasadnione |
| tests/figures-v2-row-p1.test.ts | nowy (141 linii), przypadki negatywne dla śladu, kształtu toru, styku, zakresu łokcia | dobry; brakuje testu zgodności plik ≡ generator (W1, Ś1) i kierunku linii elementu wobec miary reguły (W2) |

## Tabela ćwiczeń
| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Bent Over Row (sztanga) | wyswietlana | Ś1 (brak animowanego błędu) |
| Bent Over Row (hantle) | wyswietlana | Ś1 |
| Bent Over Row (linki) | wyswietlana | — |
| Reverse Grip Bent Over Row | wyswietlana | — |
| Barbell Rear Delt Row | wyswietlana | łokieć 5,5 cm — bez elementu, bez znaleziska |
| Pendlay Row | wyswietlana | łokieć 143° na górze — uwaga |
| Smith Machine Bent Over Row | wyswietlana | kolano 29°, łokieć 144° — uwaga |
| One Arm Row (hantle) | wyswietlana | N1 |
| T-Bar Row | wyswietlana | Ś1 |
| Seal Row (sztanga) | do poprawy | W2 (po włączeniu zestawu), N2 |
| Lying T-Bar Row | do poprawy | W1, W2 |
| Chest Supported Row | do poprawy | W1, W2 |
| Meadows Row | bez rysunku | wyjątek w WYJATKI generatora; brak wpisu w `figury-wyjatki.json` (K3) — do uzupełnienia przy poprawie |

Po naprawie W1, W2 (i najlepiej Ś1 — ta sama regeneracja) zmieni się skrót v2.row → runda r2 (różnica + arkusze CSR, Lying T-Bar, Seal Row, 3 ćwiczenia Ś1).
