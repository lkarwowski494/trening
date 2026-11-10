# Recenzja niezależna rodziny v2 cable_row — partia 2, runda r1 (audytor, 09.11.2026)

Gałąź `figury/partia-2-cable_row` @ 10fc587d (worktree odłączony, czysty). Autor: programista partii 2; recenzent: audytor (nie pisał rodziny).
Arkusze wygenerowane samodzielnie: `scripts/figures/arkusz-slad.mjs` — 9 ćwiczeń × 2 widoki = 18 arkuszy, wszystkie obejrzane w pełnej rozdzielczości
(kadry u 0; 0,5; 1 dodatkowo w powiększeniu 2:1); `arkusz-nakladka.mjs` dla Seated Cable Row i Face Pull. Liczby z `frameAt` (skrypty w scratchpadzie audytora).
Testy: `figures-v2-nakladka-cable-row`, `figures-v2-tor`, `figures-v2-zgodnosc-wsteczna`, `figures-v2-mapping` — 859/859 zielone.
Skrót `zrodla-runtime --skroty` (to drzewo): v2 cable_row `4bbbeb084cba`; `assignAll()` = 10 (9 z rysunkiem, Sled Row bez rysunku).

## Werdykt rodziny: DO POPRAWY (2 × WYSOKIE)

| ID | Klasa | Pewność | Ćwiczenie / widok | Znalezisko i miara | Realność |
|---|---|---|---|---|---|
| W1 | WYSOKIE | 90% | Seated Cable Row, Wiosłowanie na linkach (siedząc) / z boku | Regresja wady naprawionej w v1 decyzją właściciela 27.10.2026 (pkt 7a, `figury-recenzja.json` v1 „poprawka”: linka ≤ 5° od poziomu; test v1 `tests/figury-recenzja.test.tsx:144`). W v2 bloczek y = 55 cm, uchwyt na starcie y = 84,8 cm: linka **26,4°** od poziomu na starcie (19,1° przy u 0,25; 5,3° na końcu); uchwyt jedzie skośnie w dół o 20 cm na 46 cm drogi. Brak odpowiednika testu dla v2. | realny — każde odtworzenie rysunku |
| W2 | WYSOKIE | 85% | Standing Cable Row (karta własna) / z boku; ta sama dana w Single Arm Cable Row | Karta `scrow.setup`: „Ustaw wyciąg mniej więcej na wysokości klatki”. Rysunek: bloczek y = 100 cm (pas; bark 139,5, miednica 89,5), start z rękami na wysokości barków (uchwyt y 136,5), linka **32,4°** na starcie, uchwyt w dół o 35 cm — ten sam wzór, który v1 nazwał „przyciąganiem z góry”. Single Arm Cable Row (zestaw ogólny, bez zdania o wysokości): identyczna geometria (32,6°, 35 cm) — samodzielnie ŚREDNIE, naprawa razem. | realny |
| S1 | ŚREDNIE | 85% | Face Pull, Cable Rope Rear-Delt Rows / z przodu i z boku | Lina narysowana jako sztywny drążek: końce liny stale na z = ±31 cm (Face Pull) / ±33 cm (Rear-Delt) od u = 0, w x chwytu — ręce rozstawione na 62–66 cm już przy wyprostowanych rękach. Face Pull kończy na wysokości podbródka/szyi: uchwyt y 147,5 vs środek głowy 161,5 (bark 139,5), 12 cm przed barkiem, przedramię poziomo (bez rotacji). Karta „w stronę twarzy” spełniona tylko kierunkowo. | realny |
| S2 | ŚREDNIE | 85% | Leverage High Row / z boku | Oś dźwigni na dole i z przodu (89,6; 47,6), dźwignia rośnie do dłoni — układ maszyny do wiosłowania dolnego; w maszynie do wiosłowania wysokiego oś jest nad i przed ćwiczącym, a uchwyty zwisają. Ruch ćwiczącego (dłonie z góry-przodu do dolnej części klatki, łokcie w tył i w dół) poprawny. Łuk toru 6,3 cm (wyjątek w tor-wyjatki) wynika z tego samego promienia 70 cm przy osi gdziekolwiek — wartość wyjątku nie zależy od poprawki. | realny |
| S3 | ŚREDNIE | 85% | Single Arm Cable Row, Leverage High Row / zestaw ogólny `row` | Zdanie `row.fullStretch`: „Na dole wyprostuj ręce do końca…” — na rysunku wyprost jest z przodu (Single Arm) albo u góry (Leverage High Row), nie „na dole”. Zestaw istniał wcześniej; rysunek v2 czyni rozjazd widocznym (K12). | realny |
| N1 | NISKIE | 90% | Seated Cable Row (`chwyt: drazek`), Standing, Kneeling | `obrotPrzedramienia: 0` (kciuk w górę) przy prostym drążku. Niewidoczne: `wristFlex` = 0 we wszystkich kadrach, dłoń rysowana wzdłuż przedramienia (skeleton.ts:155–160). | teoretyczny (bez widocznej różnicy) |
| N2 | NISKIE | 95% | 7 z 9 ćwiczeń | Wektor `palm` odwraca się o 180° w jednym kroku 0,01 (np. Machine Row u 0,09; Seated u 0,86) — biegun łokcia stały, przedramię przechodzi przez jego kierunek. Niewidoczne z tego samego powodu co N1 (kierunek dłoni zmienia się ≤ 3,1° na krok 0,01). | teoretyczny |

## Sprawdzone bez znalezisk
- (a) `tests/tor-wyjatki.json`: Machine Row 6,1 cm i Leverage High Row 6,3 cm przeliczone niezależnie z kątów dźwigni: Δθ 48,2° / 48,8°, r(1−cos(Δθ/2)) = 6,1 / 6,25 cm; 0 zawróceń; ślad = środek chwytów = koniec dźwigni (0,0 cm). Poprawny ruch, nie maskowanie.
- (b) `DZWIGNIA_BEZ_GLOWY ∋ cable_row`: dźwignia Leverage High Row w u 0 sięga y 115,8 (dolny brzeg głowy ok. 114) — ukrycie z przodu w całym ruchu, bez migotania; złoty odcisk zmieniony tylko dla Leverage High Row (diff fixture: 1 wpis), Machine Row (dźwignia do y 100,3) bez zmian.
- (c) Nakładka: 3 elementy tylko w rzucie z boku, dobór po wskazówkach karty (`techniquesFor`, overlay.ts:60–63): Seated — łuk łokcia 20°→100° (reguła ≥ 70°/≤ 20°) i pion przez miednicę (pochylenie 0 w całym ruchu); Face Pull — łuk 20°→146° i pion przez bark (łokieć 18,2 cm za barkiem, reguła ≥ 5 cm). Odrzucenie `plecy_neutralne` uzasadnione (zgięcie kręgosłupa 0, dublowanie pionu).
- (d) Wpis ograniczenia Seated Cable Row: „kontrakt nie ma rysunku stacji” jest nieaktualny — stacja złożona z ławki (siedzisko 43 cm), skrzyni pod stopy (12 cm) i wyciągu; to poprawne kierunkowo uproszczenie (stopy oparte, kolana lekko ugięte, miednica na siedzisku — styk `seat` w 41/41 kadrach). Rekomendacja: status „przejrzane” z opisem „uproszczenie: ławka płaska, podnóżek jako skrzynia”; wysokość bloczka — patrz W1.
- (e) Lina: obrót 0 = chwyt neutralny — poprawny; geometria liny — S1. Drążek — N1 (niewidoczne).
- (f) Znana wada śladu dźwigni poza dłońmi (contract.ts:330–332) nie dotyczy: obie dźwignie mają `punkt: dlonie`.
- Styki (K7): wymagane styki rodziny — brak wpisu w styki.json; stopy i siedzisko w 41/41 kadrach; Kneeling: kolana 0,86 cm nad podłogą (≤ 1 cm). Błąd chwytu 0,00 cm we wszystkich 9. Odstęp ciężaru min. 3,2 cm (brak przenikania); dźwignia od nóg/tułowia ≥ 1,0 cm.
- Karty własne (K11): Seated/Wiosłowanie (treść zgodna; rysunek — W1), Face Pull (treść zgodna; rysunek — S1), Machine Row (uchwyty na wysokości barków, do tułowia, łokcie w tył — zgodne), Standing (treść zgodna; rysunek — W2).
- Zestawy (K12): Cable Rope Rear-Delt Rows (`faceRow`: łokcie w tył, tułów stabilny — zgodne), Kneeling High Pulley Row (`scr.chest`, `scr.control` — zgodne).
- Testy (K14): `JERK_TEMPO_RODZINY` + cable_row (mis.jerk = tempo, `bledy_bez_animacji` w figury-sens) — uzasadnione; liczniki +9 / 183→192 zgodne z `assignAll`; rejestr nakładek 8 rodzin. Brak poluzowania bez uzasadnienia — ale brak strażnika v2 dla kąta linki (W1).

## v1 → „zastapiona”
Wstrzymane do r2: przy werdykcie v2 „do poprawy” wpisy v1 Seated Cable Row, Wiosłowanie na linkach (siedząc), Face Pull zostają „wyswietlana”.
