# Recenzja niezależna bramki 4 — rodzina v2 `shrug` (partia 3), 09.11.2026

- Recenzent: audytor (L-047: nie pisał tych zmian). Autor: programista partii 3 (`figury/partia-3` @ 9f487b42).
- Kopia: `git archive 9f487b42` → `(lokalny katalog roboczy recenzenta, poza repo)` (node_modules jako dowiązanie). Pliki w `/tmp` nie trafiają do repo.
- Skróty sprawdzone w czystej kopii (`node scripts/zrodla-runtime.mjs --skroty`): v2.shrug **c0c99f20bb15**; karta Shrugs (sztanga) i (hantle) **5e140bf234c0**; zestaw shrug (Smith, Calf-Machine) **193c74683067**; Middle Back Shrug **ae52305bc674**; karty Shrugs (linki) 2a27c76a6ad6, Barbell Shrug Behind The Back e5d7a98886ed, Leverage Shrug 2e70f293d7f6.
- Obejrzane: arkusze ze śladem toru `ark/` (light) i `ark-dark/` (dark), 8 ćwiczeń × front i side, 21 kadrów (u co 0,05); arkusze nakładki `nak/` (16 PNG); powiększenia `crop/szt-f-cmp.png`, `crop/h-cmp.png`, `crop/elb.png`. Pomiary geometrii z `frameAt` (bark, łokieć, chwyt, odstęp) i `measuredAngle`.

## Werdykt rodziny: **do_poprawy**

Wspólna przyczyna W1–W4: w `lib/figures/v2/poses/shrug.json` punkt chwytu nie przesuwa się razem z barkiem. Bark unosi się o 6 cm, a chwyt w ćwiczeniach stojących o 8,3–8,6 cm. W maszynach chwyt stoi w miejscu w osi x. W wariantach z hantlami i za plecami chwyt dodatkowo odjeżdża w bok albo do tyłu. Silnik dopasowuje rękę przez zgięcie łokcia albo odwiedzenie ramienia, więc rysunek pokazuje ruch rąk, a karta mówi „pracują tylko barki”. Żadna reguła z `figury-sens.json` (rodziny.shrug) nie sprawdza prostego łokcia ani stałego kąta ramienia, dlatego testy tego nie złapały. Proponowana naprawa (decyzja należy do autora): chwyt(u) = chwyt(0) + przesunięcie barku(u). Do tego reguła „ręce proste” (zmiana kąta łokcia i ramienia ≤ konwencja) z cue `shrug.setup` / `shrug.mis.elbows`.

## Znaleziska (od najpoważniejszego)

| ID | Waga | Pewność | Ćwiczenie | Rzut, kadr | Opis | Realność | Dowód |
|---|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | Leverage Shrug, Calf-Machine Shoulder Shrug | side, u=0…1 (najlepiej u=1) | Łokcie wyraźnie ugięte: 32° przy u=0, 45° przy u=1. Uchwyt unosi się o 8,5 cm przy uniesieniu barku o 6 cm, więc ręce ciągną. Karta Leverage Shrug ma wskazówkę „Ręce proste” (`shrug.setup`) i błąd „Uginanie łokci — ciężar ciągną ręce zamiast barków” (`shrug.mis.elbows`). Rysunek pokazuje dokładnie ten błąd jako ruch poprawny. | realny (każde otwarcie karty) | `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)` (3. kadr); poses/shrug.json chwyt [4,78.5→87,26] |
| W2 | WYSOKIE | 95% | Smith Machine Behind the Back Shrug | side, u=0…1 | Łokcie ugięte 21° → 38°, łokieć wystaje do tyłu, ręce ciągną gryf (chwyt +8,5 cm, bark +6 cm). Zestaw ogólny `shrug.tall` mówi „Tułów prosto i nieruchomo — pracują tylko barki”. | realny | `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)` (4. kadr) |
| W3 | WYSOKIE | 90% | Barbell Shrug Behind The Back | side, u=0,5…1 | Gryf odjeżdża od tyłu ud po skosie w tył i w górę: odstęp 5,6 cm przy u=0, 10,8 przy u=0,5 i 16,1 cm przy u=1. Ramię przechodzi z 14° na 21° za pion, tułów odchyla się 4,5° w tył, łokieć zgina się 3° → 14°. Karta: „sztangę trzymaj nachwytem za udami, ręce proste” (`shrug.setupBehind`). Źródło karty (barbend-db-shrug) opisuje gryf oparty o tył nóg. Rysunek wygląda jak unoszenie ramion w tył, a nie szrugs. | realny | `(lokalny katalog roboczy recenzenta, poza repo)` (ślad po skosie, podpisy odstępu) |
| W4 | WYSOKIE | 90% | Shrugs (hantle) | front, u=0,6…1 | Hantle odchodzą na boki. Chwyt z=28,2 → 35,7 cm, więc odwiedzenie ramienia rośnie z 8° do 15°, a odstęp od ud z 3,2 do 11,5 cm. Łokieć zgina się 4° → 13°, ślad biegnie po skosie na zewnątrz. Karta: „Unieś barki w górę”, „pracują tylko barki”. Reguła `barki_w_gore` opiera się na ACE #72: „raise the shoulders directly upwards to the ears”. | realny | `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)` (u=0 vs u=1) |
| W5 | ŚREDNIE | 85% | Shrugs (sztanga), Shrugs (linki) (oraz tło W3/W4) | side, u=0,5…1 | Łokieć zgina się 4° → 13,5°, a gryf odsuwa się od ud do przodu (1,4 → 4,7 cm; linki 4,1 → 7,2 cm). Tułów odchyla się w tył 0° → −4,5°. To mieści się w konwencji `tulow_prosto` (≤ 5°), ale kierunek jest przeciwny do ExRx DBShrug („standing upright or very slightly bent over”), a karta mówi „nieruchomo”. Widoczne słabo. | realny | `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)` (1.–2. kadr) |
| W6 | ŚREDNIE | 85% | Calf-Machine Shoulder Shrug | side i front, wszystkie | Rysunek jest identyczny z Leverage Shrug (uchwyt przy biodrze), brak poduszek na barkach. Nazwa ćwiczenia sugeruje ruch barków pod poduszkami maszyny do łydek. Ograniczenie silnika jest zapisane jako `do_przegladu` w `data/zrodla/figury-ograniczenia-silnika.json` bez wersji. Teksty zestawu (`shrug.move`, `shrug.tall`, `mis.jerk`) nie przeczą rysunkowi. | realny | `(lokalny katalog roboczy recenzenta, poza repo)` |
| W7 | NISKIE | 90% | Leverage Shrug, Calf-Machine Shoulder Shrug | front | Sprzęt `dzwignia` ma `trzyma: "R"`: rysowany jest jeden uchwyt, lewa dłoń trzyma powietrze. W rzucie z przodu dźwignię widać tylko jako punkt. Podpis „odstęp −8,5 cm” na arkuszu to artefakt miary (`odstep-ciezaru.mjs`: dla `slide` brak kolidera, więc miara bierze odcinek między dłońmi przez ciało), a nie widoczne przenikanie. | realny (kosmetyka) | `(lokalny katalog roboczy recenzenta, poza repo)` |

Uwagi bez znaleziska (pewność < 80% albo brak przeczytanego źródła):
- Shrugs (linki): bloczek ok. 55 cm przed stopami, linka ok. 42° od pionu, więc ciągnie także do przodu. Zwykle stoi się bliżej bloczka, ale nie sprawdziłem tego w przeczytanym źródle.
- Middle Back Shrug: łokcie stale ugięte ok. 42°, bez zmiany w ruchu. Opisu wykonania nikt nie przeczytał (`figury-sens.json` → `otwarte_czesciowo`). Ruch łopatek jest poprawny: bark przesuwa się prostopadle do tułowia od klatki, z wysunięcia 5 cm do cofnięcia 4 cm. Leżenie przodem na ławce skośnej 45°, klatka na oparciu, przenikania nie widać.
- Arkusz nakładki podpisuje `shrug 0…6°`, a aplikacja używa jednostki `cm` (`MEASURE_UNIT`, `measuredAngle` zwraca `unit: 'cm'`). To narzędzie recenzji, nie aplikacja.

## Nakładka (`lib/figures/v2/overlay/shrug.ts`, rejestr w `overlay.ts`)

Jeden element `shrugShoulderUpRef`: pion w górę od barku, tylko w rzucie z przodu. Reguła `barki_w_gore` ma pewność „ustalone (kierunek)”. Cue `shrug.move` / `shrug.high` występują na kartach Shrugs (sztanga, hantle, linki), Barbell Behind, Leverage, a w zestawie Smith i Calf jest `shrug.move`. Middle Back Shrug nie ma tych wskazówek i elementu nie dostaje (`nak/cwiczenia.json`). Bark porusza się dokładnie po linii, element nie nachodzi na głowę i nie ma artefaktów (`(lokalny katalog roboczy recenzenta, poza repo)`). Pominięcia są zasadne: `tulow_prosto` (pion leżałby na sylwetce), `bez_rolowania` (jedno źródło), `lopatki_sciagaja_sie` (konwencja). Nakładka nie maskuje W1–W4, bo dotyczy barku, nie rąk. **Bez zastrzeżeń.**

## Prezentacja (`poseData.ts` DATA_UI.shrug)

- Fazy: Unoszenie 1000 ms, pauza, Opuszczanie 2000 ms, pauza (`phasesFor`). Zgadza się z „potem powoli je opuść”. u=0 to dół, u=1 to góra.
- Pomiar: `shrug` 0 → 3 → 6 cm, linia widoczna we wszystkich 7 szrugsach stojących.
- Middle Back Shrug: fazy „Ściąganie / Powrót” w tej samej kolejności co u, pomiar `protract` 5 → 0,5 → −4 cm. Ujemna wartość pokazuje się jako „barki do tyłu” (`ui.ts:120`).
- Drobiazg: wpis `shrug` stoi nadal pod komentarzem „Rodziny z danymi, jeszcze niepodłączone (status planned)”. To nieaktualny komentarz, bez wpływu na UI.
- **Bez zastrzeżeń.**

## Karty

- **Shrugs (sztanga), Shrugs (hantle)** (5e140bf234c0): `shrug.setup`, `shrug.move`, `shrug.high`, `shrug.tall`, bez błędów. Źródła: ACE #72/#75 i ExRx BBShrug/DBShrug, po 2 na każdą wskazówkę (szczebel 4, wyjątek wskazówek techniki). Treść jest poprawna, karty mogą być wyświetlane. Rysunek v2 przeczy jej w W4 (hantle) i słabiej w W5 (sztanga). Karta zostaje przy rysunku v1, dopóki v2 nie przejdzie recenzji, więc wpisów v1 nie należy jeszcze przestawiać na „zastapiona”.
- **Shrugs (linki)**: spójna z rysunkiem poza W5 (ŚREDNIE).
- **Barbell Shrug Behind The Back**: rysunek przeczy wskazówce `shrug.setupBehind` (W3).
- **Leverage Shrug**: rysunek pokazuje błąd `shrug.mis.elbows` z tej karty (W1).
- Treść tych trzech kart bez zmian, poprawić trzeba rysunek.

## Zestawy ogólne

- **Smith Machine Behind the Back Shrug, Calf-Machine Shoulder Shrug** — zestaw `shrug` (`shrug.move`, `shrug.tall`, `mis.jerk`; 193c74683067). Przypisanie jest trafne, teksty pl i en są zgodne i naturalne. Rysunek przeczy `shrug.tall` (W1, W2), a dla Calf brakuje sprzętu (W6).
- **Middle Back Shrug** — zestaw `row` (`csr.chest` „Oprzyj klatkę o podporę…”, `scr.chest` „Na końcu ruchu… łopatki ściągnięte w tył”, `mis.jerk`; ae52305bc674). Zestaw wiosłowania z podparciem klatki pasuje do szrugsa leżąc przodem: klatka na oparciu i ściąganie łopatek to cały ruch, bez zginania łokci w tekstach. Rysunek się zgadza. „Klatka do przodu” przy klatce na oparciu brzmi nieco dziwnie, ale nie przeczy rysunkowi (NISKIE, bez wpisu).

## Sprawdzone obszary bez znalezisk

- Skróty: wszystkie zgodne z oczekiwanymi.
- Nakładka: element, cue, reguła, rzut, pominięcia.
- Prezentacja: fazy, tempo, jednostka cm, wyjątek Middle Back Shrug.
- Przypisanie zestawów.
- Teksty pl i en wskazówek szrugsów.
- Zasłanianie gryfu za plecami w rzucie z przodu jest poprawne.
- Odstęp hantli i gryfu od ud jest dodatni, przenikania brak.
- Motyw ciemny: sylwetka, sprzęt i ślad są czytelne.
- Middle Back Shrug: ławka, kierunek ruchu łopatek.
- Prywatność, sekrety, dane i migracje: zmiana nie dotyka danych użytkownika.
