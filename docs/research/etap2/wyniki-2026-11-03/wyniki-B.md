# Paczka B (pchanie i triceps) — etap 2 (ZB-033, wariant B 03.11.2026), badacz 03.11.2026

Zasady: tylko 4 serwisy szczebla 5 (R = centrumrespo.pl, F = fabrykasily.pl, S = grupa SFD potreningu.pl + atlas.kulturystyka.pl,
M = maniacmuscle.com); oznaczenie „praktyka”; bez liczb (kąty, tempo, serie) i twierdzeń o zdrowiu z serwisów. Wszystkie źródła = **szczebel 5**,
bez autora z kwalifikacjami. „Komplet – uproszczenie” = baza opisana w serwisach, różnica tylko sprzętu albo jednorącz tego samego ruchu
(do potwierdzenia przez recenzenta). Odczyt przez narzędzie pobierające (model pomocniczy) — cytaty podane przez narzędzie jako dosłowne; recenzent
sprawdza je na stronie; „cytat do sprawdzenia” = streszczenie narzędzia. Id zdań oznaczone „(nowe)” — proponowane, do nadania przez programistę.

| Ćwiczenie | Role | Źródła | Stan | Uwagi |
|---|---|---|---|---|
| Triceps Dip (obow.) | setup, move, mis | R, F, S, M | **komplet (4) — praktyka** | kandydat: Sakowski (szczebel 4) jako dodatkowe źródło ustawienia i ruchu — nie szukano |
| Inverted Row (obow.) | mis | M wprost, R, F (wsparcie) + `["wniosek","inv.setup"]` | **komplet — praktyka** | F opisuje podchwyt (wariant chwytu, nie zmienia błędu) |
| Close Grip Bench Press | mis | F, S, M | **komplet — praktyka** | R ma stronę (wąski chwyt na ławce płaskiej) — nie czytana, zapas |
| Wyciskanie na linkach (stojąc) | mis | M wprost, F (wsparcie) + `["wniosek","cpress.base"]` | **wniosek — praktyka** | R, S brak strony wyciskania linek stojąc |
| Incline Cable Chest Press | setup, move, mis | M (wprost), R, F, S (baza: wyciskanie hantli na ławce skośnej) | **komplet – uproszczenie (do potwierdzenia przez recenzenta)** | wariant sprzętu: linki zamiast hantli, ta sama ławka i ruch |
| Single Arm Cable Chest Press | setup, move, mis | F, M (baza: wyciskanie linek stojąc oburącz) | **2 z 3 – uproszczenie** | jednorącz tego samego ruchu (figura: stojąc, jedna ręka); R, S brak bazy |

### Triceps Dip — **komplet (4), praktyka**
- **R** https://centrumrespo.pl/atlas/pompki-na-poreczach/ (bez autora i daty). Pozycja wyjściowa: „Przejdź do pozycji wysokiej na poręczach przez podskok i wyprostowanie stawów łokciowych lub w dowolny inny sposób.” Ruch: „kontynuuj ruch do momentu, gdy ramiona będą ustawione równolegle do podłoża.”; „wypchnij się do pozycji wyjściowej, prostując stawy łokciowe.” Wskazówki: „Wypychając się do góry, nie wykonuj wyprostu kręgosłupa.”
- **F** https://www.fabrykasily.pl/cwiczenia/na-triceps/pompki-na-triceps-na-poreczach-dips (2019-01-11): „Wykonaj podpór na poręczach, ciało ustawione pionowo.”; „spokojnym, kontrolowanym ruchem opuszczaj ciało”; „Kontroluj ruch podczas trwania ćwiczenia.”
- **S** https://atlas.kulturystyka.pl/ramiona.asp, triceps poz. 9 „Pompki na poręczach”: „Chwytamy poręcze chwytem neutralnym, ręce wyprostowane”; „Przez cały czas trwania ćwiczenia łokcie powinny znajdować się jak najbliżej tułowia.”; „Tempo umiarkowane, bez zrywów i zbyt szybkiego opuszczania.” (polskie znaki przywrócone przez narzędzie)
- **M** https://maniacmuscle.com/triceps-dip/ (poręcze): „Keep the elbows close to your sides rather than flaring out wide.”; „Control the bottom: Don’t drop fast or bounce out of the stretched position.”
- Głębokość: R (ramiona równolegle do podłogi), F i M (łokieć ok. kąta prostego) zgodne; S „od maksymalnego ugięcia”, ale też „nie opuszczać się zbyt nisko” → do zdania tylko część wspólna bez liczby.
- setup (nowe `dip.setup`) PL „Wejdź w podpór na poręczach na prostych rękach, tułów pionowo.” EN „Support yourself on the parallel bars with straight arms, torso upright.” (R, F, S, M; „pionowo” — F, S; R i M nie przeczą)
- move (nowe `dip.move`) PL „Uginając łokcie blisko tułowia, opuść się kontrolowanie, aż ramiona będą mniej więcej równolegle do podłogi; wypchnij się do wyprostu rąk.” EN „Bend your elbows, keeping them close to your body, and lower yourself under control until your upper arms are about parallel to the floor; press back up to straight arms.” (łokcie blisko: S, M; głębokość: R, F, M)
- mis (nowe `dip.mis.drop`) PL „Opadanie i odbijanie się w dolnej pozycji.” EN „Dropping and bouncing at the bottom.” (M wprost; S „bez zrywów i zbyt szybkiego opuszczania”; F „Kontroluj ruch”)
- Dodatkowe — liczby i zdrowie z serwisów pominięte (R serie/powtórzenia, F „w celu uniknięcia urazu”, S „przeciąża stawy barkowe”).

### Inverted Row — błędy: **komplet, praktyka**
- **M** https://maniacmuscle.com/inverted-row/: „Keep a straight plank line: Don’t let the hips sag or the lower back arch excessively.”
- **R** https://centrumrespo.pl/atlas/australian-pull-up/: „Cały czas trzymaj napięte ciało, tak jak przy ćwiczeniu „deska”.”
- **F** https://www.fabrykasily.pl/atlas-cwiczen/plecy/podciaganie-australijskie-podchwytem (2023-05-05, podchwyt): „Zachowaj ciało w pełnym wyproście podczas wykonywania ćwiczenia.”
- mis (nowe `inv.mis.hips`) PL „Opadające biodra — ciało przestaje być w jednej linii.” EN „Hips sagging so your body breaks its straight line.” Źródła: `["wniosek","inv.setup"]` + M, R, F.

### Close Grip Bench Press — błędy: **komplet, praktyka**
- **F** https://www.fabrykasily.pl/atlas-cwiczen/triceps/wyciskanie-sztangi-waskim-chwytem (2023-06-21): „Upewnij się, że podczas ruchu prowadzisz łokcie blisko tułowia”
- **S** https://atlas.kulturystyka.pl/ramiona.asp, triceps poz. 12 (także klatka.asp poz. 9): łokcie „nie poruszają się na boki jak przy wyciskaniu na klatkę” (streszczenie narzędzia — cytat do sprawdzenia)
- **M** https://maniacmuscle.com/barbell-close-grip-bench-press/: „Keep elbows tucked: A moderate tuck helps target the triceps and protects the shoulders.” (część o barkach = zdrowie, pomijam)
- mis (nowe `cgbp.mis.flare`) PL „Łokcie uciekające na boki.” EN „Elbows flaring out to the sides.” (+ `["wniosek","cgbp.elbows"]`)
- „Zbyt wąski chwyt” — S, M wprost; F brak → 2 z 3 (do zdania nie proponuję; S uzasadnia zdrowiem). R zapas: https://centrumrespo.pl/atlas/wyciskanie-sztangi-waskim-chwycie-lawce-plaskiej/ (nie czytana).

### Wyciskanie na linkach (stojąc) — błędy: **wniosek, praktyka**
- **M** https://maniacmuscle.com/standing-cable-chest-press/: „Keep torso tall—no leaning forward, no twisting, no bouncing.”
- **F** https://www.fabrykasily.pl/cwiczenia/dla-kobiet/na-klatke-piersiowa/wyciskanie-stojac-z-wykorzystaniem-wyciagu-lub-bramy (2016-09-07): „Jedną nogą wyjdź naprzód w celu lepszej stabilizacji. Utrzymuj proste plecy.”
- mis (nowe `cpress.mis.lean`) PL „Pochylanie albo skręcanie tułowia przy wypychaniu.” EN „Leaning or twisting your torso as you press.” Źródła: `["wniosek","cpress.base"]` (tułów stabilny) + M wprost, F wsparcie.
- R: brak (w kategorii klatki tylko guma z rotacją tułowia — `single-arm-punches-with-power-band`, dodany ruch → nie wariant). S: brak w klatka.asp; artykuł potreningu.pl (A. Bugorska, 2017) opisuje wyciskanie „na skos” — inny opis, nie liczę.

### Incline Cable Chest Press — **komplet – uproszczenie (wariant sprzętu), do potwierdzenia przez recenzenta**
- **M** (wprost) https://maniacmuscle.com/cable-incline-bench-press/: „Elbows bent, hands near upper-chest line, wrists stacked over forearms, tension on the cables.”; „Drive the handles upward in a smooth arc toward the midline without shrugging.”; „Shoulder elevation steals tension from the pecs and irritates shoulders.”
- **R** (baza, hantle) https://centrumrespo.pl/atlas/wyciskanie-hantli-lawce-skosnej/: „Weź hantle w ręce i połóż się na ławce skośnej na plecach, z wyprostowanymi przed sobą kończynami górnymi.”; „Stawy łokciowe poprowadź bokiem, przedramiona cały czas utrzymuj w pionie.”; błąd „Łopatki wysunięte w przód (protrakcja)”.
- **F** (baza) https://www.fabrykasily.pl/cwiczenia/na-klatke-piersiowa/wyciskanie-sztangielek-na-lawce-dodatniej-incline (2019-08-12): „Łopatki ściągnięte, barki maksymalnie opuszczone, dociśnięte do ławeczki.”; „powolnym ruchem opuść sztangielki w okolicy środkowej części klatki piersiowej”.
- **S** (baza) https://atlas.kulturystyka.pl/klatka.asp poz. 4 (odsyła do poz. 3): „Nie wolno jednak odrywać zbytnio pleców od ławki” (polskie znaki przywrócone).
- Różnica: linki z dolnych wyciągów zamiast hantli; ławka skośna i ruch stawów te same (ocena badacza, figura: ławka skośna + dwa wyciągi).
- setup PL „Połóż się na ławce skośnej między dolnymi wyciągami; uchwyty przy klatce, łopatki ściągnięte.” EN „Lie on an incline bench between two low pulleys; handles by your chest, shoulder blades pulled back.”
- move PL „Wypchnij uchwyty w górę nad klatkę; opuść je powoli do klatki.” EN „Press the handles up over your chest; lower them slowly back to your chest.”
- mis PL „Unoszenie albo wysuwanie barków w przód.” EN „Shrugging or rounding your shoulders forward.” (M, R wprost; F wsparcie)

### Single Arm Cable Chest Press — **2 z 3 – uproszczenie (jednorącz)**
- Baza: wyciskanie linek stojąc oburącz — F i M jak wyżej („Wyciskanie na linkach (stojąc)”); F: „Ustaw wyciągi na wysokości klatki piersiowej.”; „Zrób krok w przód, naciągnij linki wyciągów.”; M: „Position both cable pulleys at roughly mid-chest height”.
- R i S: brak bazy (R tylko guma z rotacją tułowia albo leżąc z mini band; S klatka.asp bez wyciskania linek). M `cable-seated-single-arm-chest-press` — siedząc (inna pozycja ciała), nie liczę.
- Zdania (gdyby recenzent przyjął 2 z 3): setup PL „Stań tyłem do wyciągu, bloczek na wysokości klatki; uchwyt w jednej ręce przy barku, jedna noga z przodu.” move PL „Wypchnij uchwyt przed siebie do wyprostu ręki; wróć powoli.” mis PL „Skręcanie tułowia za ręką.” — status otwarty.
