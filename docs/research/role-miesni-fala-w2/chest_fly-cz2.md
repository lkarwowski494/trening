# chest_fly (cz. 2) — role mięśni, fala W2 (badacz-merytoryczny, 02.11.2026)

Wejście: pozycje otwarte z W1 (`role-miesni-fala-w1/chest_fly.md`, gałąź `badania/g5-pchanie`): Bent-Arm Barbell Pullover (chest),
Around The Worlds (front_delt), Crucifix (front_delt, upper_back). Wariant A: tylko reguły po nazwie `nameRules` z istniejącymi funkcjami
z `data/zrodla/role-miesni.json`. Strony czytane 02.11.2026 (WebFetch).

## Propozycje nameRules (x — ćwiczenie, m — mięsień, o — rola, f — funkcja)

Brak. Żadna z luk nie ma przeczytanego źródła, które podaje pasującą funkcję wprost.

## Sprawdzone źródła

| id | adres | szczebel | miejsce | wynik |
|---|---|---|---|---|
| S7 (istniejące) | https://teachmeanatomy.info/upper-limb/muscles/pectoral-region/ | 4 (O. Jones, akt. 06.11.2025) | Pectoralis Major — Function | przywodzenie i rotacja wewnętrzna, zgięcie (część obojczykowa); **brak** prostowania ramienia przez część mostkowo-żebrową |
| S1 (istniejące) | https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs | 3 | ryc. 11.24 (opis), tab. 11.8 | piersiowy większy — bez zgięcia/prostowania w tekście; czworoboczny — unoszenie, ściąganie, obrót łopatki; naramienny — główny odwodziciel |

## Otwarte (ćwiczenie/mięsień | powód)

| ćwiczenie/mięsień | powód |
|---|---|
| Bent-Arm Barbell Pullover / chest@0.5 | potrzebna funkcja „sprowadza ramię znad głowy” (prostowanie zgiętego ramienia przez część mostkowo-żebrową); S7 i S1 jej nie podają, `chest.shoulder_flex_add` nie opisuje tego ruchu. Nowa funkcja wymaga 2 źródeł anatomii — nie znalezione w tej fali |
| Around The Worlds / front_delt@0.5 | ruch to łuk ramion w leżeniu od bioder za głowę (z wyników wyszukiwania; brak przeczytanego źródła techniki — wskazówki tego ćwiczenia też otwarte). Bez ustalonego przebiegu nie da się dobrać funkcji |
| Crucifix / front_delt@0.5 | utrzymanie ramion w bok: funkcja `front_delt.shoulder_flex` („unosić ramię do przodu”) nie pasuje; S1 mówi o naramiennym jako całości jako odwodzicielu, ale funkcja `side_delt.shoulder_abd` należy do innego obszaru (`region: side_delt`) — przypisanie jej do front_delt byłoby uproszczeniem bez źródła dla tego ćwiczenia. Do tego brak funkcji utrzymania (opcje A/B/C w W1) |
| Crucifix / upper_back@0.5 | rola czworobocznego przy utrzymaniu odwiedzenia (unoszenie barków vs obrót łopatki) — S1 wymienia obie czynności czworobocznego, ale żadne przeczytane źródło nie wiąże ich z tym ćwiczeniem. Dodatkowo nazwa obejmuje dwa różne ćwiczenia (bój USAWA i utrzymanie strongman — patrz plik wskazówek) |

## Podsumowanie

- Luki ról: 4 (z W1); role gotowe: 0; otwarte: 4; nowe nameRules: 0; nowe zdania: 0.
