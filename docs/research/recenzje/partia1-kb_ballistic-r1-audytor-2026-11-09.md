# Recenzja niezależna rodziny v2 `kb_ballistic` (kettlebell: swing, zarzut, rwanie, podrzut, wyciskanie z nóg), runda r1. Audytor, 09.11.2026

**Werdykt rodziny: do poprawy** (1 × WYSOKIE, 1 × ŚREDNIE, 4 × NISKIE). Recenzent: audytor. Nie pisałem tej rodziny (L-047). Autor: programista partii 1 (figury/partia-1).

## Metoda
- SHA autora `208a8740` (gałąź figury/partia-1), baza `dfae8739`, N = 1. Czysta kopia: `git archive 208a8740` → `/home/user/rev-p1/kb_ballistic-r1` (node_modules jako dowiązanie).
- Arkusze własne (39 PNG). `arkusze/slad/`: 16 (16 ćwiczeń × side, motyw jasny), każdy obejrzany w pełnej rozdzielczości. `arkusze/slad-dark/`: 5 (Kettlebell Swing, Bottoms-Up, Split Jerk, Sumo High Pull, Kettlebell Snatch, motyw ciemny); w pełni obejrzany Bottoms-Up. `arkusze/nakladka/`: 18 (`--family kb_ballistic`, w tym 2 pozy błędu). Powiększenia: `arkusze/kadry/plecy-porownanie.png` (poza poprawna i poza błędu mis.roundBack).
- `cmp` z arkuszami autora (`/home/user/arkusze-partia-1/kb_ballistic/slad/`): 16 z 16 ślady bajtowo równe.
- Liczby z `frameAt` / `jointAngles` (u co 0,1), położenie chwytu, barku, miednicy i kostki, ślad `info.trail`, `measuredJoint`, `phasesFor`, `cueSelection`, `overlayShapes`, przemieszczenie punktów w pozie błędu. Liczyłem jednorazowymi testami w kopii (usunięte). Porównanie ze Split Jerk z rodziny olympic.
- `sha` z `node scripts/zrodla-runtime.mjs --skroty`, uruchomionego w kopii.

## Znaleziska

| # | Poziom | Pewność | Realność | Ćwiczenie, widok, kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 90% | realny (każde otwarcie karty) | Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel), One-Arm Kettlebell Clean and Jerk; side; u = 0 i u = 0,15–0,6 | **Start:** w u = 0 ciężar wisi 30 cm przed kostkami (chwyt x = 30,4, y = 42,3; kostka x = 0). Nie przechodzi między nogami. Dla porównania swing w tej samej rodzinie: chwyt x = −7,4 (za linią kostek). **Tor:** ciężar odjeżdża od ciała na prawie prostej ręce. Zarzut: odstęp 34–39 cm w u = 0,35–0,6, łokieć 19° w u = 0,4, dłoń 37 cm przed barkiem. Rwanie: odstęp 51–53 cm w u = 0,35–0,45, dłoń 57 cm przed barkiem na wysokości barku (ręka prawie poziomo), potem łuk nad głowę. Clean and Jerk: odstęp 37 cm w u = 0,2–0,25, ręka poziomo. Arkusze: `slad/Kettlebell-Clean-side.png`, `slad/Kettlebell-Snatch-side.png`, `slad/Snatch-hantel-side.png`, `slad/One-Arm-Kettlebell-Clean-and-Jerk-side.png`. Rysunek pokazuje szeroki łuk („zarzucanie” ciężaru), czyli błąd opisany w oly.mis („odjeżdża od ciała”). Jest też sprzeczny z kartami. Double Kettlebell Clean: „żeby oba kettlebelle przeszły między nogami”, „zamach … jak przy swingu; po wyproście bioder przyciągnij je blisko ciała”. Snatch (hantel): „Postaw hantel między stopami; zejdź jak do martwego ciągu”, a na rysunku hantel wisi 42 cm nad podłogą, 30 cm przed stopami. | Start zarzutu i rwania kettlebella jak dół swingu (ręce cofnięte, chwyt za linią kostek, jak `swing` W[0] psi −145). Po wyproście bioder łokieć zgina się wcześnie i ciężar jedzie blisko tułowia (odstęp w ciągu ok. ≤ 15 cm, liczba do potwierdzenia przez badacza). Rwanie: tor wysokiego ciągu, potem wypchnięcie nad głowę. Snatch (hantel): start z hantlem na podłodze między stopami. Dumbbell Clean: ciąg blisko ciała. Test (K5): chwyt w u = 0 za linią kostek (kettlebell), maks. odstęp w ciągu ≤ próg; przypadek negatywny: obecne dane (30,4 cm; 39 / 53 cm). Wyjątki toru tych 7 ćwiczeń zmierzyć od nowa. |
| Ś1 | ŚREDNIE | 95% | brzegowy (zestaw ogólny `oly` nie ma jeszcze wpisu „zestawy”, więc dziś się nie pokazuje; problem pojawi się po jego przyjęciu) | Kettlebell Clean, Dumbbell Clean, Bottoms-Up Clean, Kettlebell Snatch, Double Kettlebell Snatch, One-Arm Kettlebell Clean and Jerk, Kettlebell Sumo High Pull | Zestaw `oly` mówi o sztandze przy kettlebellu i hantlu: oly.close „Sztanga blisko ciała przez cały ciąg”, oly.legs „…sztangę wybijają nogi i biodra”, oly.mis „Sztanga odjeżdża od ciała…”. Sumo High Pull: oly.close tak samo. Ponadto sumo.kneesOut ma `CUE_REQUIRES` z warunkiem `family === 'hinge'` (`lib/figures/v2/cueSets.ts:50`), więc w kb_ballistic wypadnie z karty. | Zestaw dla kettlebella i hantla z neutralnym słowem („ciężar”, „kettlebell”), np. nowe id przez badacza i tłumacza. Do tego czasu bez wpisu „zestawy” dla tych 7 ćwiczeń. |
| N1 | NISKIE | 90% | realny | Double Kettlebell Jerk (karta własna), One-Arm Kettlebell Jerk; side; u = 1 | Karta: „…od razu zejdź pod nie drugim ugięciem na prostych rękach i wstań”, „Zablokuj łokcie … w drugim ugięciu — dopiero potem wstań”. Pętla jednokierunkowa kończy się w drugim ugięciu (kolano 27,1°, biodro 19,3°, u = 1) i przeskakuje do racka. Wstania z ciężarem nad głową nie ma. To ta sama konwencja co olympic (przechwyt jako koniec), ale tu karta mówi o wstaniu wprost. | Dodać klatkę „wstanie z ciężarem nad głową” na końcu (jak Push Press: kolana 0°, łokieć ≤ 20°). |
| N2 | NISKIE | 85% | realny | Kettlebell Sumo High Pull; side; u = 0,18–0,56 i 0,8–1 | Klatki kluczowe 0,178 → 0,559: przez 40% czasu ciężar rośnie tylko z 69 do 84 cm i ruch wygląda na zatrzymany w pół zawiasu. Łokieć zgina się do 59° przy biodrze jeszcze w 32° (ręce ciągną przed końcem wyprostu bioder). Ślad ma drgania poziome 3–4 cm (x: 17,7 → 20,0 → 17,2 → 20,4 → 18,2), stąd 4 zawrócenia. | Wyrównać czasy klatek (wyprost bioder, potem ciąg rąk), wygładzić x chwytu. Wyjątek toru po poprawce zmierzyć od nowa. |
| N3 | NISKIE | 90% | teoretyczny (testy) | tests/figures-v2-kb-ballistic-p1.test.ts | (a) `pp_ugiecie` wyklucza Push Press ×2 (`PODRZUT.filter(k => !/Push Press/.test(k))`) bez powodu, a reguła ma cue `pp.dip`. Dane i tak ją spełniają (35,1° / 32,6°). (b) Brak testu miejsca i toru dla zarzutu i rwania (start między nogami, odstęp w ciągu). Test sprawdza tylko pozę końcową (rack / nad głową), co przepuściło W1 (K5). | (a) Usunąć wykluczenie. (b) Test z W1. |
| N4 | NISKIE | 90% | teoretyczny (dane wewnętrzne, K3) | Kettlebell Pirate Ships | Bez rysunku: jest tylko w `WYJATKI` generatora i jako „otwarte” w figury-sens.json, bez wpisu w `data/zrodla/figury-wyjatki.json` (0 trafień). | Wpis z powodem w figury-wyjatki.json albo potwierdzenie koordynatora, że „otwarte” wystarcza (jak Smith Machine Reverse Calf Raise). |

## Odpowiedzi na pytania autora i zlecenia
1. **Pętla jednokierunkowa (9 ćwiczeń):** właściwa. Wahadło odtwarzałoby ruch wstecz (wspięcie na palce i wyprost przy opuszczaniu ciężaru), co jest błędne. W kettlebellu ciężar wraca inną drogą (z góry do racka albo do zamachu między nogami), więc „Podnoszenie” jako jedna faza i przeskok do u = 0 to ta sama konwencja co olympic. Uwaga: koniec w przechwycie bez wstania (N1). W rwaniu figura kończy w ugięciu kolan 28,3° i biodra 25,4° (u = 1) po wspięciu na palce (kostka w górę o 12 cm, u = 0,5–0,8). To wzorzec przechwytu ze sztangą; w rwaniu kettlebella zwykle kończy się na prostych nogach. Pewność < 80%, więc nie zgłaszam tego jako znaleziska. Do sprawdzenia przez badacza przy poprawce W1.
2. **kbHipLimb a linia pleców:** tak, odcinek tułowia rysuje się dwa razy. `kbBackRefLine` biegnie od miednicy do barku z przedłużeniem za bark, `kbHipLimbLine` od barku przez miednicę z przedłużeniem w dół, do tego łuk w biodrze. Linie nakładają się na siebie, więc na arkuszu wyglądają jak jedna. Łuk i kąt niosą inną informację niż linia pleców. Bez znaleziska; można skrócić linię `kbHipLimb` do odcinka miednica → udo.
3. **Split Jerk, wyprost łokcia:** nie ma opóźnienia. Od u = 0,5 do 0,8 ciężar stoi na wysokości ok. 191–194 cm, a miednica opada ze 104,8 do 68,2 cm i łokieć prostuje się z 93° do 9°. Zawodnik schodzi pod ciężar, a blokada przychodzi z lądowaniem w wykroku, czyli poprawnie. Nogi w u = 1: przód 79,6°, tył 96,4°. W olympic Split Jerk (zrecenzowany) jest 84° / 111°.
4. **Orientacja kettlebella:** rączka w dłoni we wszystkich klatkach (ślad ≤ 3 cm od chwytu, test p1). W racku dzwon leży przed klatką wzdłuż przedramienia. Nad głową dzwon jest za przedramieniem. Bottoms-Up od u ≈ 0,75 jest dnem do góry nad dłonią, przedramię pionowo (oba motywy). Przechwyt bez uderzenia w przedramię jest w Bottoms-Up i w podrzutach. W zarzucie i rwaniu obrót przy racku wynika z szerokiego łuku (W1).
5. **mis.roundBack (miara 15°):** miara jest uzasadniona. W pozie błędu przesuwa się środek kręgosłupa (`spineMid`): 5,3 cm (One-Arm Swings, u = 0,5) i 5,2 cm (Sumo, u = 0,2). Punkty z testu (miednica, głowa, kolano, kostka, łokieć) zmieniają się < 3 cm. Na arkuszu (`kadry/plecy-porownanie.png`) sylwetka różni się słabo; błąd widać głównie po czerwonym znaczniku i linii pleców. W swingu jednorącz zgięcie 26° przypada na u ≈ 0,50–0,59, a w u = 0 wynosi 0, choć komentarz generatora mówi „narasta w dole ruchu”. Treść błędu („…żeby dociągnąć ciężar”) pasuje do środka zamachu. Bez znaleziska; prościej byłoby dodać `spineMid` do miary 3 cm.
6. **Wyjątki toru (16):** przyjmuję Kettlebell Swing (45,5 cm, łuk wokół barków), One-Arm Swings (40,8), Bottoms-Up (7,7 cm, 3 zawrócenia: łagodne S przy obrocie dnem do góry, tor blisko ciała, odstęp ≤ 20 cm), Push Press ×2 (18,4), Jerk ×2 (21,6 / 21,5), Split Jerk (12,0): ciężar z racka musi obejść głowę. Sumo High Pull (3,9): przyjmuję warunkowo, do wygładzenia (N2). **Nie przyjmuję** Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel), One-Arm Kettlebell Clean and Jerk: ich łuk to wada W1, nie cecha ruchu. Do zmierzenia po poprawce.

## Zestawy ogólne (K12)
- One-Arm Kettlebell Swings (`kbSwing`: kb.move, kb.hips, hinge.back, mis.roundBack): zgodne. Ciężar między nogami w u = 0 (chwyt x = −5,3), biodro 84° → 5°, kręgosłup 0°, błąd animowany. **wyswietlana**.
- Double Kettlebell Push Press, One-Arm Kettlebell Push Press (`pushPress`: pp.dip, pp.legs, ohp.mis.lock): ugięcie kolan 35,1° / 32,6° przy biodrze ok. 27–29° (tułów prawie pionowo), wybicie z nóg na palce, potem ręce. Koniec: kolana 0°, łokieć 10,6°. **wyswietlana**.
- One-Arm Kettlebell Split Jerk (`pushPress`: pp.legs): zgodne. **wyswietlana**.
- One-Arm Kettlebell Jerk: wpis „zestawy” już jest, sha zgodne z `--skroty` (cb9bd7c3e35d). Bez zmian.
- `oly` (Kettlebell Clean, Dumbbell Clean, Bottoms-Up, Kettlebell Snatch, Double Kettlebell Snatch, Clean and Jerk) i Sumo High Pull: **do poprawy** (Ś1; dla zarzutów i rwań także W1). Bez wpisu.

## Karty (K10, K11)
- Kettlebell Swing (karta własna bez wpisu „karty”, K11): kb.setup, kb.move, kb.hips, hinge.back zgodne z rysunkiem. Ciężar między nogami w dole (chwyt 7,4 cm za kostkami), wyprost bioder 86° → 5°, kolana 45° → 0°, dłonie 11 cm nad barkiem na górze, kręgosłup prosty. **wyswietlana** (sha aa1b9306d7dd).
- Istniejące wpisy „karty”: Double Kettlebell Clean 9741b4eba017, Snatch (hantel) 4324b03aab39, Double Kettlebell Jerk 15a14aabe7a5. Wszystkie zgodne z `--skroty`. Treść kart jest poprawna; sprzeczny jest rysunek (W1 dla dwóch pierwszych, N1 dla Jerk).
- K10: wpis v1 Kettlebell Swing („wyswietlana”, a7fcbadd5b3f) → `zastapiona` w chwili wyświetlenia v2 (runda r2).

## Uwagi do testów (K14, diff dfae8739..208a8740 -- tests/)
| Zmiana | Ocena |
|---|---|
| figures-v2-data: pominięcie 9 ćwiczeń jednokierunkowych w teście faz (sprawdza je p1) | uzasadnione |
| figures-v2-data: staw mierzony z `joints` (biodro albo kolano), nie `joints[0]`; zakres ≥ 15° zamiast kierunku | uzasadnione (podrzut: kolano) |
| figures-v2-data: `ZAOKRAGLONE_PLECY_KB` (≥ 15° zgięcia kręgosłupa zamiast ≥ 3 cm) | uzasadnione, wąskie (rodzina + cue), z przypadkiem negatywnym; `spineMid` i tak przesuwa się o > 5 cm |
| tor-wyjatki.json +16 | 9 przyjętych, 7 odrzuconych (pkt 6) |
| figures-v2-kb-ballistic-p1: wykluczenie Push Press z `pp_ugiecie` | nieuzasadnione (N3a) |
| figures-v2-kb-ballistic-p1: brak testu toru zarzutu i rwania | luka K5 (N3b, W1) |
| mapping, nakladka-triceps-olympic, strona-eksport: listy i liczby (+kb_ballistic, 211) | uzasadnione |
| nakladka-fix4: Single Leg Calf Raise na liście „odciętych” | uzasadnione (reguła „analogia”, rodzina calf_raise) |

## Tabela ćwiczeń
| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Kettlebell Swing | wyswietlana | Biodro 86° → 5°, kolano 45° → 0°, ciężar między nogami; nakładka kbBackRef + kbHipLimb |
| One-Arm Kettlebell Swings | wyswietlana | Jak wyżej; wolna ręka z przodu w górze (u = 1 dłoń 24 cm nad barkiem) to uwaga, nie znalezisko |
| Kettlebell Clean | do poprawy | W1 |
| Double Kettlebell Clean | do poprawy | W1 (sprzeczne z kartą własną) |
| Dumbbell Clean | do poprawy | W1 (odstęp 30–32 cm) |
| Bottoms-Up Clean From The Hang Position | wyswietlana | Tor blisko ciała, dnem do góry od u ≈ 0,75; zestaw Ś1 |
| Kettlebell Snatch | do poprawy | W1 |
| Double Kettlebell Snatch | do poprawy | W1 |
| Snatch (hantel) | do poprawy | W1 (start sprzeczny z kartą własną) |
| Double Kettlebell Push Press | wyswietlana | |
| Double Kettlebell Jerk | wyswietlana | N1 |
| One-Arm Kettlebell Push Press | wyswietlana | |
| One-Arm Kettlebell Jerk | wyswietlana | N1 |
| One-Arm Kettlebell Split Jerk | wyswietlana | Blokada łokcia z lądowaniem, poprawnie |
| Kettlebell Sumo High Pull | wyswietlana | N2; zestaw Ś1 |
| One-Arm Kettlebell Clean and Jerk | do poprawy | W1 (część zarzutu, odstęp 37 cm) |
| Kettlebell Pirate Ships | bez rysunku | N4 |

## Obszary bez znalezisk
Ślad w chwycie (`trzyma`, dwa ciężary: test p1 i arkusze) • brak skoków toru > 18 cm • przenikanie ciężaru w nogi (najmniejszy odstęp 0,3 cm, Bottoms-Up u = 0) • zakresy swingu wobec reguł „ustalone” • nakładka tylko z reguł „ustalone” (plecy, wyprost_swing), w płaszczyźnie ruchu • DATA_UI i nazwy faz (istniejący tekst „Podnoszenie”, K15) • push press i podrzuty (ugięcie, wyprost, blokada) • sha istniejących wpisów „karty” i „zestawy” rodziny zgodne z `--skroty` • motyw ciemny (Bottoms-Up).
