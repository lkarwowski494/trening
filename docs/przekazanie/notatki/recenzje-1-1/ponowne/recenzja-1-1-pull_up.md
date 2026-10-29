# Recenzja 1.1 rodziny pull_up: bramka 4, ślad toru (L-050), treść kart (29.10.2026)

Recenzent: agent recenzent ruchu i treści (sesja niezależna, L-047). Nie pisałem póz, kart ani zestawów. Nie czytałem opisów poprawek.
Kod: `integracja-1-1` @ 15e3ab45 (`/home/user/wt/rec-1-1`, tylko odczyt). Pozy: `lib/figures/v2/poses/pull_up.json` (11 ćwiczeń). Skrót v2 rodziny teraz: `8d1be8eeb9d1`. Ćwiczeń w rodzinie: 13 (Muscle Up i Rope Climb nie mają pozy, więc nie mają figury).

**Render własny: 13 klatek (u = 0…1 co 1/12) × 2 widoki (bok, przód) × wszystkie wiersze (poza poprawna i każdy wiersz błędu), 11 ćwiczeń, razem 21 wierszy, 546 kadrów.** Silnik v2 z repo (`loadV2`, `keyframeFrame`, `dataShapes`, `trailShapes`), rasteryzacja resvg. Na każdym kadrze jest nałożony cały ślad silnika (`info.trail`, czyli miednica, bo drążek stoi w miejscu), mój ślad środka głowy (czerwony), ślad środka barków (niebieski) i pion drążka (zielony, w widoku z boku). Arkusze: `slad-1-1-pull_up/<ćwiczenie>-slad.png`, liczby z każdej klatki: `slad-1-1-pull_up/metryki.json`, skrypt: `slad-1-1-pull_up/render-recenzenta.mjs`.
Walidator (`waliduj`): 11/11 OK. Reguły sensu z `tests/sens-wyjatki-1-1.json`: brak par z tej rodziny (0 z 38). `tests/tor-wyjatki.json`: brak wpisów.

## Podsumowanie

| Werdykt (ćwiczenie: ruch, ślad i treść razem) | Liczba | Ćwiczenia |
|---|---|---|
| OK | 2 | Gorilla Chin/Crunch, Scapular Pull-Up |
| OK z uwagą | 1 | Dead Hang |
| BŁĄD | 8 | Pull Up, Chin Up, Neutral Grip Pull Up (wiersz błędu `pu.partial`); Gironda Sternum Chins (ruch); Mixed Grip Chin, One Arm Chin-Up, Side To Side Chins, Wide-Grip Rear Pull-Up (treść zestawu) |

Ślad toru: 11/11 bez wybrzuszeń. Ślad miednicy jest prostą (odchylenie 0,0 cm, 0 zawróceń, z wyjątkiem Side To Side z przodu: 2,5 cm, 0 zawróceń). Ślad głowy: Gironda z boku 1,4 cm, Wide-Grip Rear z boku 3,3 cm. Oba łuki wynikają z odchylenia głowy i są zamierzone.

Trzy BŁĘDY to tanie poprawki danych, które powtarzają się w kilku ćwiczeniach:
- **B1 (WYSOKIE):** wiersz błędu `pu.partial` pokazuje inny błąd niż jego podpis (3 ćwiczenia).
- **B2 (WYSOKIE):** w zestawie ogólnym jest wskazówka „Na górze wyprostuj ręce do końca”, a w podciąganiu jest odwrotnie (5 zestawów).
- **B3 (WYSOKIE):** Gironda nie dochodzi mostkiem do drążka.
- **B4 (ŚREDNIE):** Neutral Grip Pull Up nie różni się rysunkiem od Chin Up i ma drążek zamiast uchwytów.

Wcześniejsze błędy 1–3 z `recenzje-1-1/pull_up.md` (Rear za kark, Scapular bez ruchu łopatek, Dead Hang z ruchem nóg) są **usunięte** na obrazie i w liczbach. Uwagi E, F i G zostały: F urosła do BŁĘDU (B3), E i G są dalej uwagami.

## Tabela

| Ćwiczenie | Ruch | Ślad | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|---|
| Pull Up | OK z uwagą E | OK (miednica pion 51,3 cm, 0,0 cm) | karta własna OK | **BŁĄD B1** | Nachwyt ±22 cm (barki ±19, czyli „trochę szerzej niż barki”, zgodnie z `pu.grip`). Łokieć 14° → 143°, środek głowy na górze 242,5 przy drążku 230 (broda nad drążkiem). Wiersz `pu.partial`: zobacz B1. |
| Chin Up | OK z uwagą E, H | OK (jak Pull Up) | karta własna OK z uwagą I | **BŁĄD B1** | Chwyt ±15 cm. Podchwytu nie widać (H). Karta mówi „na szerokość barków”, a na rysunku chwyt ma 30 cm przy barkach 38 cm (I). |
| Neutral Grip Pull Up | **BŁĄD B4** | OK | karta własna: B4 (uchwyty) | **BŁĄD B1, B4** | Pozy i błędy są bajt w bajt równe Chin Up (sprawdzone porównaniem JSON). Opis w B4. |
| Mixed Grip Chin | OK z uwagą E, H | OK | zestaw vpull: **B2** | **BŁĄD B2** | Chwyt ±20 cm, chwytu mieszanego nie widać (H). Wiersz `pu.noSwing`: kolana 29° → 59°, stopy 20 cm w przód, widoczne. |
| One Arm Chin-Up | OK z uwagą E, J | OK | zestaw vpull: **B2** | **BŁĄD B2** | Ręka R na drążku (z +15), ręka L luźno przy pasie (łokieć 103,5°, rusza się z ciałem). J: miednica w z 0, czyli 15 cm obok jedynego chwytu przez cały ruch. |
| Gironda Sternum Chins | **BŁĄD B3** | OK (miednica 54,4 cm, 0,0 cm; głowa łuk 1,4 cm) | zestaw vpull: **B2** | **BŁĄD B3, B2** | Opis w B3. |
| Side To Side Chins | OK z uwagą G | OK (przód: 2,5 cm, 0 zawr.) | zestaw vpull bez `pu.elbowsDown`: **B2** | **BŁĄD B2** | G: przesunięcie w bok 0 → 10 cm tylko do jednej ręki, pętla bez lustra (brak `petla: cykl_lustro`). |
| Wide-Grip Rear Pull-Up | OK (poprawione) | OK (głowa łuk 3,3 cm z boku, zamierzony) | zestaw vpull: **B2** | **BŁĄD B2** | Za kark: w u = 1 środek głowy x +17,7 przy drążku x 0 (drążek za głową, przy karku), głowa pochylona 35°, chwyt ±35, tułów ok. 3° od pionu. Drążek na 245, stopy nad podłogą. |
| Dead Hang | OK (poprawione) | statyczne (brak śladu, zgodnie z `ISOMETRIC`) | zestaw `npu.hang`: uwaga K | **OK z uwagą** | Poza statyczna: łokieć 7°, kolano 14°, barki uniesione 4 cm (zwis bierny), ciało pod drążkiem (x 0). Jedynym ruchem jest wiersz `pu.noSwing` (kolano do 54°, stopy 20 cm w przód). K: tekst mówi „uchwyty”, a na rysunku jest drążek (NISKIE). |
| Gorilla Chin/Crunch | OK z uwagą E | OK | zestaw `hanging` OK | **OK** | Podciąganie razem z podciąganiem kolan (biodro 11° → 70°, kolano 29° → 110°). Brak wiersza błędu, bo `hang.noSwing` nie ma reguły (OTWARTE w `figury-sens.json`); karta pokazuje tylko tekst błędu. |
| Scapular Pull-Up | OK (poprawione) | OK (miednica 8,0 cm w pionie) | zestaw `pu.shoulders` OK | **OK** | Ręce proste przez cały ruch (łokieć 7,3°), nogi nieruchome (kolano 14,3°), barki z uniesienia +5 do obniżenia −3 cm, ciało w górę o 8 cm, pod drążkiem. |

## Znaleziska BŁĄD

| # | Ćwiczenia | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Waga, realność | Reguła łapie? |
|---|---|---|---|---|---|---|
| B1 | Pull Up, Chin Up, Neutral Grip Pull Up | wiersz `pu.partial`, u = 0 i u = 1 | Podpis błędu (PL/EN): „Skracanie ruchu — bez wyprostu rąk na dole.” Na rysunku dół jest poprawny: delta w u = 0 wynosi 0, łokieć 14° (pełny wyprost). Skrócony jest za to ruch na górze: miednica −16 cm w u = 1, łokieć 121° zamiast 143°, środek głowy 226,5 przy drążku 230, czyli broda ok. 14 cm pod drążkiem. Wiersz pokazuje „nie dociąga do drążka”, czyli inny błąd niż ten w podpisie, a dół wygląda jak w pozie poprawnej. | Delta w dolnej klatce: u = 0 miednica +8…+10 cm, łokieć ≥ 40° (ręce nie prostują się na dole), góra bez zmian. Druga możliwość: zmienić tekst błędu na skracanie u góry, ale tekst ma źródła („until your arms are…”), więc poprawia się rysunek. | **WYSOKIE** (wiersz błędu uczy czego innego, niż mówi podpis), realny: każdy, kto otworzy kartę Pull Up | **nie.** `blad-sens` wymaga tylko, żeby błąd łamał grupę `pelna_amplituda`. Łamie ją `broda_nad_drazkiem`, a nie `dol_rece_proste` (cue `pu.partial`). Propozycja: błąd z cue X musi łamać regułę z tym samym `cue` (tu `dol_rece_proste`), a nie dowolną regułę grupy. |
| B2 | zestaw ogólny `vpull` w 5 ćwiczeniach na drążku: Gironda, Mixed Grip Chin, One Arm Chin-Up (skrót zestawu 547428c66304), Side To Side Chins, Wide-Grip Rear Pull-Up (ff168b83d6cb) | tekst `lpd.fullStretch` | „Na górze wyprostuj ręce do końca.” / „At the top, straighten your arms fully.” Ta wskazówka pochodzi ze ściągania drążka wyciągu, gdzie górna pozycja to ręce w górze. W podciąganiu „na górze” znaczy broda nad drążkiem, czyli łokcie zgięte (na rysunku 126–145°). Tekst przeczy rysunkowi i ruchowi. | Dla zestawów na drążku: „Na dole wyprostuj ręce do końca” albo wskazówka `npu.hang` / druga część `pu.pull` („opuść się do pełnego wyprostu rąk”), bez `lpd.fullStretch`. | **WYSOKIE** (błędna instrukcja), realny | nie, bo przypisanie zestawu do wzorca nie zależy od sprzętu (wyciąg czy drążek). Propozycja: test, że zestaw ćwiczenia z rodziny pull_up nie zawiera wskazówek `lpd.*` zależnych od pozycji. |
| B3 | Gironda Sternum Chins | u = 1, bark i łokieć | Cechą rozpoznawczą jest mostek do drążka. W u = 1 bark (środek) leży na y 205,6 przy drążku 230, a mostek ok. 30 cm pod drążkiem. Łokieć ma 126°, mniej niż na górze zwykłego podciągania (143°). Tułów odchylony −40°, kręgosłup −20°, nogi w przód: odchylenie jest rozpoznawalne, ale ruch kończy się w połowie. | W u = 1 mostek (ok. 10–15 cm pod barkiem) przy drążku: bark y ≈ 235–240, łokieć ≥ 140°, odchylenie tułowia jak teraz. | **WYSOKIE** wg bramki 4 (brak cechy rozpoznawczej, rysunek uczy niepełnego powtórzenia), realny. Pewność 80% | nie: `broda_nad_drazkiem` jest pominięta, a dla nazwy „Sternum” brak reguły. Propozycja: `mostek_do_drazka`, czyli u = 1 i odległość punktu mostka od drążka ≤ 5 cm. |
| B4 | Neutral Grip Pull Up | całe ćwiczenie, sprzęt i dłonie | Pozy są identyczne z Chin Up (`klatki` i `bledy` równe bajt w bajt): prosty drążek, dłonie 30 cm od siebie. Silnik nie rysuje orientacji dłoni (`draw.ts`: dłoń to kapsuła nadgarstek → chwyt, `palm` nie jest używane). Żadna poza rodziny nie podaje też `obrotPrzedramienia`. Chwytu neutralnego (dłonie do siebie) nie da się więc zobaczyć. Na prostym drążku nie jest on możliwy, a karta (`npu.hang`) mówi „Chwyć uchwyty”. Użytkownik widzi podciąganie podchwytem na wąskim drążku. **Różnica chwytu nie jest widoczna** (pytanie z analizy). | Uchwyty równoległe (dwa krótkie drążki wzdłuż osi x) albo przynajmniej chwyt prostopadły do drążka. Do czasu zmiany kontraktu: ćwiczenie w `V2_WSTRZYMANE` (karta bez rysunku). | **ŚREDNIE**: ruch tułowia i łokci jest zgodny z chwytem neutralnym, ale cechy rozpoznawczej nie widać, a sprzęt przeczy karcie. Realny | nie: brak reguły „sprzęt z karty” (uchwyty) i brak wymogu różnicy rysunków dla różnych ćwiczeń. Propozycja: strażnik „dwa ćwiczenia z identycznymi pozami”, który wymaga wyjątku z powodem. |

## OK z uwagą (backlog, nie blokuje)

- **E** (z pierwszej recenzji, bez zmian): w Pull Up, Chin Up, Neutral, Mixed, One Arm, Side To Side i Gorilla barki i miednica leżą w x −18 przy chwycie w x 0 od dolnego zwisu (ramię ok. 16° od pionu). Odchylenie jest naturalne na górze, a w zwisie mniej. Scapular, Dead Hang i Wide-Grip Rear są już pod drążkiem (x 0 / +4,5). NISKIE.
- **G** Side To Side: ruch tylko do jednej strony. Do poprawy trybem `petla: cykl_lustro`. NISKIE.
- **H** (ograniczenie silnika): podchwyt, nachwyt i chwyt mieszany są niewidoczne we wszystkich ćwiczeniach, bo rysunek dłoni nie ma orientacji. Ćwiczenia różnią się tylko szerokością chwytu. Brak wpisu w `data/zrodla/figury-ograniczenia-silnika.json`; trzeba go dopisać (krok (d) z backlogu figur r2). NISKIE (karty opisują chwyt słowami).
- **I** Chin Up: karta „na szerokość barków”, rysunek 30 cm przy barkach 38 cm. Do poprawy chwytem ±19. NISKIE.
- **J** One Arm Chin-Up: ciało 15 cm obok jedynej ręki (z) przez cały ruch. W rzeczywistości ciało przesuwa się pod rękę. NISKIE.
- **K** Dead Hang (zestaw) i Neutral (karta): `npu.hang` mówi „uchwyty”. Przy drążku lepiej mówić „drążek”. NISKIE.
- **Szczelność strażnika toru (L-050):** `tests/figures-v2-tor.test.ts` mierzy `info.load`, czyli w pull_up stojący drążek (długość śladu 0, odchylenie zawsze 0). Rysowany ślad (`trailFor`) to `info.trail` (miednica). W tej rodzinie strażnik jest więc ślepy. Propozycja: mierzyć `info.trail ?? info.load`, tak jak `trailShapes`. Dziś wynik i tak jest dobry (moje pomiary wyżej).

## Treść: rejestr twierdzeń, naturalność

Teksty wskazówek tej rodziny (`pu.*`, `cu.*`, `npu.hang`, `lpd.fullStretch`, `hang.*`) nie podają liczb ani twierdzeń zdrowotnych i nie nazywają swojej wagi, więc nie wymagają wpisu w `rejestr-twierdzen.json` (grep: brak wpisów, brak wymogu). Bez nazw źródeł i marek w tekstach UI. Brzmienie jest naturalne („Bez bujania i wymachów nogami”, „Prowadź łokcie w dół, do boków tułowia”). Jedynym błędem merytorycznym tekstu jest B2. Karty własne Pull Up, Chin Up i Neutral przechodzą dziś przez wpisy v1 „wyswietlana” (skróty v1 zgodne: d3fe671da49d, c551131b4f68, 130597855e6d). Ich teksty są poprawne. Problemem jest rysunek błędu (B1).

## Do wpisów

- **Figura rodziny v2 (`v2.pull_up`): „do poprawy”, nie „wyswietlana”.** B1 dotyczy ćwiczenia wiodącego (Pull Up). Po poprawce B1 (delta `pu.partial` w u = 0 w 3 pozach) i B3 (Gironda u = 1) oraz po decyzji o B4 (poprawka albo `V2_WSTRZYMANE` dla Neutral Grip Pull Up) wystarczy krótka recenzja tych 4 ćwiczeń.
  - Opcja szybsza: B1 i B3 poprawić, Neutral do `V2_WSTRZYMANE`, wtedy wpis rodziny.
  - Opcja dokładniejsza: dodać uchwyty równoległe do kontraktu.
- **Zestawy ogólne „wyswietlana”:** Dead Hang (198c682fe9a7, z uwagą K), Gorilla Chin/Crunch (5faeb3667bc1), Scapular Pull-Up (5441980854c1). Te trzy można od razu usunąć z `zestawy_bez_wpisu`, ale pokażą się dopiero razem z figurą rodziny (`GENERAL_SHOWN` wymaga figureSpec; ekran pokazuje zestaw przy figurze v2).
- **Zestawy „do poprawy” (B2):** Gironda Sternum Chins, Mixed Grip Chin, One Arm Chin-Up, Side To Side Chins, Wide-Grip Rear Pull-Up.
- **Wyświetlane po poprawce B1 (ruch bez innych blokerów):** Pull Up, Chin Up, Mixed Grip Chin, One Arm Chin-Up, Side To Side Chins, Wide-Grip Rear Pull-Up, Dead Hang, Gorilla Chin/Crunch, Scapular Pull-Up. **Do poprawy (ruch):** Gironda Sternum Chins (B3), Neutral Grip Pull Up (B4), wiersz `pu.partial` w Pull Up, Chin Up i Neutral (B1).

### Propozycja pól wpisu v2 (po poprawkach, do potwierdzenia skrótem po zmianie póz)

```json
"pull_up": {
  "werdykt": "do poprawy",
  "data": "2026-10-29",
  "kto": "recenzja niezależna 1.1 ruchu, śladu toru i treści (agent recenzent, 29.10.2026)",
  "sha": "8d1be8eeb9d1",
  "liczba": 13,
  "stan": "zrecenzowana niezależnie (bramka 4, L-047, L-050): 2 OK, 1 OK z uwagą, 8 BŁĄD (B1 wiersz pu.partial, B2 tekst lpd.fullStretch w zestawach na drążku, B3 Gironda, B4 Neutral = Chin Up)",
  "autor": "generator póz pull_up (agent; poses/pull_up.json)",
  "recenzent": "agent recenzent ruchu i treści (sesja niezależna 29.10.2026; nie tworzył póz ani tekstów)",
  "slad": "docs/przekazanie/notatki/recenzje-1-1/ponowne/slad-1-1-pull_up/*-slad.png — 11 arkuszy, 13 klatek u 0…1 × bok i przód × poza poprawna i każdy wiersz błędu, ślad info.trail (miednica) + głowa + barki; metryki.json"
}
```

Po poprawkach: `werdykt` „wyswietlana”, nowy `sha` z `node scripts/zrodla-runtime.mjs --skroty`, usunięcie `pull_up` z `tests/recenzja-wyjatki-1-1.json` (v2) i z `zestawy_bez_wpisu` tych zestawów, które dostaną wpis.
