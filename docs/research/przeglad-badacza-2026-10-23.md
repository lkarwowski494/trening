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
3. **Hantle nad twarzą lub głową** (wyciskanie hantli, rozpiętki, wyciskanie nad głowę): Standard 3.2 mówi o „free weights”, więc dosłownie obejmuje też hantle; sposób asekuracji hantli opisuje przypis 7 — nieprzeczytany. Rozszerzenie na hantle to też nowa grupa ćwiczeń poza zakresem znaleziska (sztanga/EZ) — do decyzji po przeczytaniu źródła.
4. Drugie niezależne źródło dla listy — niepotrzebne do ustalenia (szczebel 2, twierdzenie wprost), ale przypis 7 rozstrzygnąłby pkt 1 i 3.
