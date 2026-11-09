# Recenzja niezależna rodziny v2 `row` (wiosłowanie), runda r2 — audytor, 09.11.2026

**Werdykt rodziny: do poprawy** (1 × WYSOKIE — nowe, wprowadzone poprawką W1; 1 × NISKIE — pozostałość N1). Poprawki r1 W2, Ś1, N2 — przyjęte; W1 (biodro) — przyjęte co do biodra, ale ta sama zmiana odwróciła stopy (W1-r2). Recenzent: audytor (nie pisał rodziny ani poprawek; L-047). Autor: programista partii 1.

## Metoda
- SHA autora `f1ed0f2d` (gałąź figury/partia-1-row), baza r1 `c997ca5c`, N = 2. Czysta kopia: `git archive f1ed0f2d` → `/home/user/rev-p1/row-r2` (node_modules dowiązane). W repo nic nie zmieniane.
- Arkusze własne (78 PNG): `arkusze/slad/` 24 (12 ćw. × side, top, jasny), `arkusze/slad-dark/` 14 (7 ćw.: Bent Over Row (sztanga), (hantle), One Arm Row, T-Bar Row, Seal Row, Lying T-Bar Row, Chest Supported Row × side, top, ciemny), `arkusze/nakladka/` 40 (`--family row`, z pozami błędu). Powiększenia: `arkusze/kadry/`.
- `cmp` z arkuszami r1 (`/home/user/rev-p1/row-r1/arkusze`): ślad — 18/24 bajtowo równe, różne tylko CSR, Lying T-Bar Row, One Arm Row (zmienione pozy); nakładka — różne CSR, Lying T-Bar, One Arm, Seal Row (side: nowy element; top: tylko nazwa elementu w nagłówku, bez rysunku), nowe 6 arkuszy pozy błędu (Bent Over Row sztanga/hantle, T-Bar Row). Zmienione arkusze obejrzane w pełnej rozdzielczości, oba motywy.
- Liczby z `frameAt`/`jointAngles` (u = 0; 0,25; 0,5; 0,75; 1), wektor stopy (palce − pięta) wobec przodu goleni, `gap` ciało–ławka, `checkFrame` (skrypt jednorazowy w kopii `.rev/`).
- Testy w kopii (`--runInBand`): figures-v2-row-p1, figury-rozszerzenia-gora, figury-backlog-r2, figury-generator-odtwarza — 72/72 zielone.
- `sha` z `node scripts/zrodla-runtime.mjs --skroty` w kopii: v2.row `b0533da52c44`; zestawy i karty — **bez zmian względem r1** (te same skróty).

## Znaleziska

| # | Poziom | Pewność | Realność | Ćwiczenie, widok, kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1-r2 | WYSOKIE | 90% | realny (każde otwarcie karty) | Chest Supported Row, Lying T-Bar Row; side (i top), wszystkie kadry u = 0…1 | Stopy skierowane **do tyłu względem kolan**: biegun kolana [−1, −0,2, 0] (rzepka ku głowie i podłodze), przód ciała [−0,71, −0,71], a stopa płasko na podłodze palcami w +x (pięta [72,2, 0], palce [97,2, 0]; `podbicie` 0). Iloczyn stopa·przód = −0,71 (Bent Over Row: +0,56; Seal Row: +0,64). Rzeczywiste zgięcie podeszwowe względem przodu goleni ≈ 119° (goleń [0,87, −0,49]); zakres człowieka ok. 40–50°. `jointAngles.ankle` = −59,9° nie wychwytuje tego, bo liczy kąt bez znaku (`lib/figures/v2/skeleton.ts`, `ankleDors = 90 − acos(…)`), więc walidator i testy przepuszczają. Na rysunku: nogi proste w desce, a but stoi płasko piętą przy goleni i palcami od osoby (`arkusze/kadry/csr-stopa.png`, `kadry/csr-side-0.png`). W r1 stopa była zgodna z kolanem (biegun [1, 0,2, 0]); odwrócenie kolana w W1 odwróciło sens stopy. | Stopy na palcach, pięty w górze: `podbicie` ok. −70…−85° (palce w dół), zgięcie podeszwowe względem goleni ≤ ok. 50°; arkusze od nowa. Test: w każdej klatce (palce − pięta)·(przód goleni w płaszczyźnie strzałkowej) ≥ cos 60° — przypadek negatywny: obecne dane (≈ 119°). Ten sam wzór stopy ma Spider Curl (rodzina curl, już wyświetlana — poza zakresem, uwaga dla koordynatora niżej). |
| N1-r2 | NISKIE | 85% | realny | One Arm Row (hantle), side, każdy kadr | Dłoń podporowa poprawiona (z = −9, ramię w obrysie ławki w rzucie z góry — `kadry/One-Arm-Row-hantle-top-u0.png`), ale łokieć ręki podporowej nadal zgięty **47,5°** (r1: 50,6°; zalecenie r1 ≤ 20°). Karta: „Oprzyj kolano i dłoń jednej strony na ławce” — ręka podporowa zwykle prawie prosta. | Ręka podporowa prawie prosta (łokieć ≤ 20°), dłoń pod barkiem; backlog, nie blokuje. |

## Poprawki r1 — ocena
- **W1 (biodro)**: przyjęte. Biodro −9,4° w każdej klatce CSR i Lying T-Bar Row (było −37,4°), kolana 6,8°, plik ≡ `generuj()` (test generator-odtwarza, row w zakresie). Seal Row −10,6° (poza bez zmian). Wyjątki hipMin row usunięte z `figury-sens.json` — zgodnie z danymi. Skutek uboczny: W1-r2 (stopy).
- **Ś1**: przyjęte. Pozy błędu `mis.roundBack` w Bent Over Row (sztanga), (hantle), T-Bar Row — zaokrąglenie widoczne od u = 0, czerwona linia pleców i znacznik na plecach (`nakladka/*-side-data-0.png`), ślad bez skoków.
- **W2**: przyjęte. `rowBackLineRef` = odcinek miednica → bark przedłużony za bark, tylko side, tylko CSR / Lying T-Bar / Seal. Na arkuszach linia biegnie wzdłuż tułowia (CSR 45°, Seal poziomo), łokieć mija ją od strony pleców: CSR ok. u ≈ 0,4, Seal dopiero przy końcu (u ≈ 0,9–1) — zgodnie z miarą reguły `lokiec_za_tulowiem` (test: kierunek ±5°, chwila przekroczenia ±0,05, negatyw z pionem). Zgodne z kartą („łokcie miną linię pleców”). W rzucie z góry brak elementu (bez artefaktu).
- **N1**: częściowo — N1-r2.
- **N2**: przyjęte. Uzasadnienie 80 cm w `PRZYBLIZENIA` poprawne, wpis `do_przegladu` usunięty.

## Ruch: przegląd ćwiczeń (K4–K8)
- Bez zmian względem r1 (arkusze bajtowo równe): Bent Over Row (sztanga/hantle/linki), Reverse Grip, Rear Delt, Pendlay, Smith, T-Bar Row, Seal Row — ocena r1 aktualna.
- CSR / Lying T-Bar Row: tułów 45° na oparciu (gap tułów–oparcie 2,0 cm, ramię 1,3 cm przy u = 0; bez przenikania, `checkFrame` puste), ręce bez zmian (łokieć 15° → 120,7°, łokcie wzdłuż tułowia), dźwignia Lying T-Bar bez zmian. Nogi proste w desce, biodro −9,4° — poprawne; stopy — W1-r2. W rzucie z góry ławka zasłonięta przez tułów (tak jak w r1).
- One Arm Row: ręka pracująca bez zmian (17,9° → 114,8°), ślad w chwycie R; podporowa — N1-r2.
- Ciemny motyw: czytelny (ślad, hantle, dźwignia, stopy).

## Zestawy ogólne (K12) i karty (K11)
Skróty zestawów i kart z `--skroty` w kopii są identyczne z r1 (zestawy: 7c6bbc8acd1f, 9b80c8ad4ad1 ×2, 5ed172b545db ×2; karty: 60840343dff9, dc20a50e5e65, 3d8664a2b089, 79fb2a8a54e6, e8abcaf3ccea). Ponownie porównane z rysunkiem r2: zdania nie opisują stóp ani nóg, a górna część ciała się nie zmieniła; teraz animowany błąd `mis.roundBack` w Bent Over Row ×2 i T-Bar Row zgadza się z tekstem karty (Ś1 zamknięte). Werdykty r1 potwierdzone — wyświetlana co do treści; rysunek CSR i Lying T-Bar Row czeka na W1-r2.

## Wpisy v1 (K10)
Do zmiany na „zastapiona” **dopiero, gdy v2.row będzie „wyswietlana”**: Bent Over Row (sztanga), Bent Over Row (hantle), Pendlay Row, One Arm Row (hantle), T-Bar Row, Chest Supported Row (6). Teraz bez zmian.

## Testy (K14) — `git diff c997ca5c..f1ed0f2d -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| tests/fixtures/figury-v2-zlote.json | 6 odcisków, wszystkie `row/*` (Bent Over Row ×2, One Arm, T-Bar, Lying T-Bar, CSR); Seal Row, curl, shrug bez zmian; w `lib/figures/v2/poses/` zmieniony tylko `row.json` | uzasadnione — żadna poza innej rodziny się nie zmieniła |
| tests/figury-generator-odtwarza.test.ts | row usunięty z rozjazdów, dodany do `W_ZAKRESIE` | zaostrzenie (plik ≡ generator) |
| tests/figury-rozszerzenia-gora.test.ts | deklaracje hipMin 7 → 5 (bez CSR, Lying T-Bar), te dwa w `bezDeklaracji`; próba odrzucenia na pozie Middle Back Shrug (biodro −37°) przemianowanej na Bent Over Row | uzasadnione: zgodne z usunięciem wyjątków z danych; przypadek negatywny zachowany (poza bez deklaracji odrzucona, z deklaracją przechodzi — zielone). Uwaga: komentarz mówi, że Spider Curl ma nogi proste (−9°), a jego deklaracja hipMin −45 zostaje — martwa deklaracja, nie poluzowanie row |
| tests/figury-backlog-r2.test.ts F4 | pomija pozy z `obrotTulowia` 180 | uzasadnione (leżenie przodem to nie opad; nadal ≥ 8 póz i wymóg opisu). Uwaga: „kolano za piętą” w CSR jest częściowo skutkiem odwróconej stopy (W1-r2) — po naprawie warto sprawdzić, czy pominięcie nadal potrzebne |
| tests/figures-v2-row-p1.test.ts | negatyw ławki 3 → 6 cm + nowy pozytyw `worst(0) ≥ −1`; nowe testy W1 (biodro ≤ 20°, negatyw starej pozy), W2 (kierunek linii, chwila przekroczenia, negatyw pionu); nazwa elementu | 3 → 6 cm uzasadnione (tułów 2,0 cm nad oparciem w nowej pozie; dodany pozytyw); nowe testy dobre. Brak: test kierunku stopy względem kolana (W1-r2) |

## Uwaga poza zakresem (dla koordynatora)
Spider Curl (rodzina curl, `wyswietlana` od 08.11.2026) ma identyczne nogi: biegun kolana −x, stopa `podbicie` 0 palcami w +x — stopa·przód = −0,71, zgięcie podeszwowe ≈ 119° (pomiar w kopii f1ed0f2d). To ta sama wada co W1-r2, w rodzinie już wyświetlanej; do oceny osobnym zgłoszeniem (nie wchodzi do werdyktu row).

## Tabela ćwiczeń
| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Bent Over Row (sztanga) | wyswietlana | Ś1 zamknięte (poza błędu) |
| Bent Over Row (hantle) | wyswietlana | Ś1 zamknięte |
| Bent Over Row (linki) | wyswietlana | bez zmian |
| Reverse Grip Bent Over Row | wyswietlana | bez zmian |
| Barbell Rear Delt Row | wyswietlana | bez zmian |
| Pendlay Row | wyswietlana | bez zmian |
| Smith Machine Bent Over Row | wyswietlana | bez zmian |
| One Arm Row (hantle) | wyswietlana | N1-r2 (łokieć podporowy 47,5°) |
| T-Bar Row | wyswietlana | Ś1 zamknięte |
| Seal Row (sztanga) | wyswietlana | W2 i N2 zamknięte |
| Lying T-Bar Row | do poprawy | W1-r2 (stopy) |
| Chest Supported Row | do poprawy | W1-r2 (stopy) |
| Meadows Row | bez rysunku | nadal brak wpisu w `data/zrodla/figury-wyjatki.json` (K3, uwaga z r1) |

Po naprawie W1-r2 zmieni się skrót v2.row → runda r3 (zakres: CSR i Lying T-Bar Row, oba widoki, oba motywy, nakładka tych dwóch).
