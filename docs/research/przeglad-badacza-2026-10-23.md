# Przegląd badacza — 23.10.2026: zakres ramki „Asekuracja” (M1-031 / 06-tresci-001)

Zlecenie: naprawa M1-audytor-generalny-031 (audyt M1 z 21.10.2026, znalezisko 06-tresci-001, rodzaj M — rozstrzygają źródła).
Problem: ramka „Asekuracja” była tylko przy 29 ze 137 ćwiczeń katalogu ze sztangą lub sztangą EZ; źródło obejmuje więcej.
Hierarchia: CLAUDE.md („Hierarchia źródeł dla treningu i zdrowia”). Stan kodu: `origin/main` f2b0525.

## Źródło (przeczytane dziś, surowy tekst)

NSCA Strength and Conditioning Professional Standards and Guidelines, Strength Cond J 39(6), grudzień 2017 — szczebel 2 (stanowisko organizacji naukowej),
https://www.nsca.com/globalassets/education/nsca_strength_and_conditioning_professional_standards_and_guidelines.pdf
(`curl` → HTTP 200, 24 strony, `pdftotext`, odczyt 23.10.2026).

- s. 11, **Standard 3.2**: „In conjunction with appropriate safety equipment (e.g., power racks), attentive spotting must be provided for participants performing activities in which free weights are supported on the trunk or moved over the head/face (7,14).”
- Przypis 7 tego standardu: Caulfield S, Berninger D. „Exercise technique for free weight and machine training”. W: NSCA's Essentials of Strength Training and Conditioning, wyd. 4, 2016, s. 350–408 — **nieprzeczytany** (podręcznik płatny, brak dostępu w dniu pracy).

Werdykt: reguła „sztanga na tułowiu albo przemieszczana nad głową lub twarzą → sprzęt asekuracyjny i osoba asekurująca” jest **ustalona** (jedno źródło szczebla 2 z twierdzeniem wprost, wyjątek z CLAUDE.md). Przeniesienie standardu dla programów prowadzonych przez trenerów na trening samodzielny to **uproszczenie** (jak w przeglądzie z 21.10.2026).

## Zakres w katalogu (137 ćwiczeń ze sztangą/EZ)

Kryterium wprost ze Standardu 3.2: sztanga oparta na tułowiu (plecy, przód barków, łokcie przy tułowiu) albo przemieszczana nad głową lub twarzą. Pełna lista z kategorią każdego ćwiczenia jest w teście `tests/audit-m1-031-asekuracja-zakres.test.tsx` (strażnik: nowe ćwiczenie ze sztangą bez kategorii zatrzymuje test).

### Wariant „stojaki” (zdanie dotychczasowe: stojaki z ramionami asekuracyjnymi oraz osoba asekurująca) — 43

29 dotychczasowych bez zmian oraz 14 dodanych: Overhead Press (sztanga), Seated Barbell Military Press, Standing Barbell Press Behind Neck, Bradford Press (nad głową); Overhead Squat (nad głową, ćwiczenie siłowe, nie dynamiczne); Calf Raise (sztanga), Kneeling Squat, Barbell Side Split Squat, Bulgarian Split Squat (sztanga), Elevated Back Lunge, Barbell Side Bend, Good Morning off Pins (sztanga na plecach); Barbell Incline Shoulder Raise, Pin Press (leżąc, sztanga nad twarzą).

### Wariant „osoba asekurująca” (nowe zdanie, bez stojaków) — 15

Skullcrusher (EZ), Skullcrusher (sztanga), Decline EZ Bar Triceps Extension, Incline Barbell Triceps Extension, Lying Close-Grip Barbell Triceps Extension Behind The Head, Bent-Arm Barbell Pullover, Wide-Grip Decline Barbell Pullover, Front Raise And Pullover, Press Sit-Up (leżąc, sztanga nad twarzą); Overhead Triceps Extension (EZ), Standing Overhead Barbell Triceps Extension, Barbell Front Raise to Overhead (nad głową); Barbell Walking Lunge, Barbell Step Up, Seated Barbell Twist (sztanga na plecach).

Podział na warianty to **konwencja projektu**, nie twierdzenie źródła: Standard 3.2 wymaga „appropriate safety equipment (e.g., power racks)” i asekuracji osobą, ale nie mówi, przy którym ćwiczeniu stojak jest właściwym sprzętem. Wariant „stojaki” dostały ćwiczenia, przy których katalog już przewiduje stojaki (`rack` albo stanowisko z ławką i wspornikami) i które wykonuje się w miejscu; wariant „osoba” — pozostałe (katalog nie przewiduje stojaków albo ćwiczący od nich odchodzi). Zdanie „zalecana osoba asekurująca” pomija sprzęt — **uproszczenie** kierunkowo zgodne ze źródłem (osoba asekurująca jest wymagana zawsze).

### Poza zakresem

Sztanga trzymana w dłoniach poniżej barków (martwe ciągi, wiosłowania, uginania, szrugsy, wspięcia z sztangą na kolanach, hack squat, Jefferson squat), koniec sztangi w landminie (sztanga nie jest swobodnym ciężarem nad głową) — 52 ćwiczenia. Ćwiczenia na maszynie Smitha bez zmian: Standard 3.2 dotyczy wolnych ciężarów (przegląd z 21.10.2026).

## Otwarte pytania [DO USTALENIA]

1. **Ćwiczenia dynamiczne** (Push Press, podrzuty, rwania, zarzuty, Clean and Press, Snatch Balance, Jerk Balance, Rack Delivery, wyskoki ze sztangą — 25 ćwiczeń): Standard 3.2 dosłownie je obejmuje (sztanga nad głową albo na przodzie barków), ale sposób asekuracji takich ćwiczeń (czy osoba asekurująca, czy wypuszczenie sztangi) opisuje przypis 7 — nieprzeczytany. Opracowania wtórne (strony do nauki do egzaminu) podają, że ćwiczeń dynamicznych się nie asekuruje — szczebel 5, nie liczy się. Do czasu przeczytania przypisu 7 aplikacja nie pokazuje przy nich zdania (nie wymyślamy procedury, której źródło nie daje). Krok: badacz z dostępem do NSCA Essentials (wyd. 4 lub 5), rozdział o technice ćwiczeń z wolnymi ciężarami, część o asekuracji.
2. **Sztanga na biodrach** (Hip Thrust (sztanga), Glute Bridge (sztanga)): czy „supported on the trunk” obejmuje miednicę — źródło nie definiuje; bez zmiany.
3. **Hantle nad twarzą lub głową** — rozstrzygnięte 23.10.2026 decyzją właściciela DEC-08 (a), zob. sekcja „Hantle: zakres DEC-08” niżej. Pozostają otwarte: sposób asekuracji hantli (przypis 7 — nieprzeczytany), hantle przy tułowiu, ćwiczenia dynamiczne z hantlem, kettlebell.
4. Drugie niezależne źródło dla listy — niepotrzebne do ustalenia (szczebel 2, twierdzenie wprost), ale przypis 7 rozstrzygnąłby pkt 1 i 3.

## Hantle: zakres DEC-08 (M1-031 cz. 2, 23.10.2026)

Decyzja właściciela DEC-08 (a), 23.10.2026: ostrzeżenie o asekuracji także przy ćwiczeniach z hantlami nad głową lub twarzą. Podstawa: ten sam Standard 3.2 (s. 11, odczyt 23.10.2026 — `pdftotext`, tekst „free weights are supported on the trunk or moved over the head/face”); tekst nie rozróżnia sztangi i hantli, a hantle są wolnym ciężarem — reguła **ustalona** (jedno źródło szczebla 2 z twierdzeniem wprost, wyjątek z CLAUDE.md). W tekście Standardu nie ma słowa „dumbbell”; objęcie hantli wynika z pojęcia „free weights”, nie z osobnego zapisu.

Zakres w katalogu (105 ćwiczeń z `loadSource: dumbbell`), kryterium jak dla sztangi: hantle przemieszczane nad twarzą (leżąc, na skosie) lub nad głową — **27 ćwiczeń**: wyciskania (płasko, skos, głową w dół, z podłogi, wąski chwyt, „squeeze”, jednorącz), rozpiętki (płasko, skos, głową w dół, jednorącz), pullover, skullcrushery i wyprosty ramion leżąc lub nad głową, Tate Press, wyciskania nad głowę (stojąc, siedząc, Arnold, jednorącz, See-Saw, Cuban), Front Raise to Overhead, Dumbbell Incline Shoulder Raise, Around The Worlds. Pełna lista z kategorią każdego ze 105 ćwiczeń jest w teście `tests/audit-m1-031-hantle-asekuracja.test.tsx` (strażnik nowych ćwiczeń). Granica „nad twarzą / nad głową” dla poszczególnych ćwiczeń to **konwencja projektu** (źródło jej nie definiuje).

Zdanie: „Ćwiczenie z hantlami nad głową lub twarzą: zalecana osoba asekurująca.” — bez stojaków (hantli nie zakłada się na ramiona asekuracyjne; to **uproszczenie** — Standard wymaga też „appropriate safety equipment”, zdanie je pomija, jak w wariancie „osoba” dla sztangi; T-045).

### Otwarte [OTWARTE] / [DO USTALENIA] — bez ramki
- Ćwiczenia dynamiczne z hantlem (Snatch (hantel), Dumbbell Clean, Thruster (hantle), Dumbbell Seated Box Jump) — jak boje ze sztangą: sposób asekuracji w przypisie 7 (nieprzeczytany), właściciel nie ma dostępu do NSCA Essentials (DEC-08).
- Hantel oparty o tułów (Goblet Squat) — „supported on the trunk”; poza zakresem DEC-08 (nad głową/twarzą); do decyzji po przeczytaniu źródła.
- Hip Thrust (hantel) — jak sztanga na biodrach: czy „trunk” obejmuje miednicę, źródło nie definiuje.
- Overhead Carry (hantle) — przenoszenie nad głową: Standard mówi „moved over the head/face”, ale asekuracja przenoszenia nie ma opisu w przeczytanym tekście.
- Kettlebell nad głową (np. Turkish Get Up, Bent Press): także „free weights”, ale poza zakresem DEC-08 (tylko hantle); bez ramki.
