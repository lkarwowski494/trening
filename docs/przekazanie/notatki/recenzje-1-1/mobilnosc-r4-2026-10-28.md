# Recenzja ruchu (bramka 4): mobility_stand i mobility_floor, runda 4

Gałąź rodziny-mobilnosc @ f540dfba (worktree /home/user/wt/rodziny-mobilnosc, bez zmian w repo).
Podgląd r4 wygenerowałem tym samym mechanizmem co r2/r3 (`scripts/figures/agent-pozy/run.mjs --rodzina <r> --podglad`, bez `--zastosuj`) do
/tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/mob-r4/.
Ważność (krok 6): oba katalogi mają PODGLAD-WAZNY.txt, `zgodnosc_manifestu: []`, tabelę kątów (katy-stawow.md i `katy_stawow`), klatki na obrazie = klatki_u.
Podgląd = to, co trafi do aplikacji: pozy w poze.json są identyczne bajt w bajt z lib/figures/v2/poses/mobility_{stand,floor}.json (17/17).
Pomiary styku liczyłem z kolizorów silnika (`bodyColliders`, 49 chwil u) i ze współrzędnych ścieżek SVG w HTML podglądu (y w cm, podłoga y=0).

## Werdykty

| Ćwiczenie | Werdykt |
|---|---|
| Chin To Chest Stretch | zatwierdzone |
| Side Neck Stretch | zatwierdzone |
| Overhead Triceps Stretch | zatwierdzone (przybliżenie zachowuje cechę: łokieć 30 cm nad barkiem, dłoń za karkiem) |
| Standing Chest Stretch | zatwierdzone |
| Standing Gastrocnemius Calf Stretch | zatwierdzone (obraz = Wall Calf Stretch, `cmp` identyczne; uwaga poniżej progu w sekcji „Poniżej progu”) |
| Wall Calf Stretch | zatwierdzone |
| Standing Soleus And Achilles Stretch | do poprawy: 1 znalezisko (krok 5, kąty) |
| Standing Lateral Stretch | zatwierdzone |
| The Straddle | zatwierdzone |
| Seated Calf Stretch | zatwierdzone |
| Seated Floor Hamstring Stretch | zatwierdzone |
| Butterfly Stretch | zatwierdzone |
| Child's Pose | zatwierdzone |
| Kneeling Hip Flexor Stretch | zatwierdzone |
| Supine Hamstring Stretch | zatwierdzone |
| Side-Lying Quad Stretch | do poprawy: 1 znalezisko (krok 2, styk) |
| Cat-Cow | zatwierdzone (uwaga NISKIE: kolana przesuwają się 1,6 cm) |
| Inchworm | wyjątek (poprawnie: brak pozy, brak figury v1/v2, powód w figury-wyjatki.json i WYJATKI) |

## Znaleziska

| # | Waga | Pewność | Ćwiczenie | Krok | Opis i dowód | Kroki w aplikacji | Realność |
|---|---|---|---|---|---|---|---|
| 1 | ŚREDNIE | 95% | Side-Lying Quad Stretch | 2 (styk) | Ciało leżące na boku wisi nad podłogą. Miednica, tułów i głowa mają środek na y = 23 cm. Odstęp od podłogi według kolizorów: miednica/tułów/głowa 13,5 cm, udo dolnej nogi 5,9 cm. Według SVG (widok z boku, u=0 i u=1): dolna krawędź tułowia (#13294B, ścieżka 11) 4,2 cm, spodenki 4,6 cm, dolne udo 5,3 cm, głowa (ścieżka 16) 14,4 cm nad podłogą. Podłogi dotykają tylko dolny bark i ramię (−0,5 cm). Pod głową nic nie ma: do dłoni zostaje 2,8 cm. Przy 1,5 px/cm to ok. 7 px przerwy pod biodrem i ok. 22 px pod głową; widać to na Side-Lying-Quad-Stretch-light.png. Dodatkowo stopa dolnej nogi w widoku z boku zamienia się w punkt (ścieżka 18 ma zerowy rozmiar: x 82,6..82,6, y 8..8). Noga kończy się bez stopy. | Rodzina jest teraz „planned”, więc tego nie widać. Po nałożeniu: Biblioteka → Side-Lying Quad Stretch → rysunek (widok z boku). | realny (każde otwarcie ćwiczenia po włączeniu rodziny) |
| 2 | ŚREDNIE | 85% | Standing Soleus And Achilles Stretch | 5 (kąty) | Tylne kolano jest zgięte o 58°, przednie o 37°, zgięcie grzbietowe tylnej kostki to 36°. Ręce na biodrach, tułów pionowo, brak ściany. Źródło przypisane regule (`obie_kolana_lekko`: ACE #152 krok 4, „slightly flex (bend) the back knee”) mówi o lekkim zgięciu. 58° nie jest lekkim zgięciem. Reguła ma tylko dolny próg (≥ 10°), bez górnego, więc walidator to przepuszcza. Obraz przypomina częściowy przysiad wykroczny. Odróżnia go tylko pięta tylnej nogi na podłodze (zmierzone y = 0), a przy tej skali to słabo widać. | jak wyżej, po nałożeniu rodziny | realny |
| 3 | NISKIE | 90% | Cat-Cow | 2 (styk) | Kolana (punkty podparcia) przesuwają się po podłodze o 1,6 cm między klatkami: miednica i kolano x 13,9 → 12,3 → 12,9. Golenie i stopy przesuwają się razem z nimi. Dłonie stoją. Przy 1,5 px/cm to ok. 2 px, na granicy widoczności. | jak wyżej | brzegowy (backlog) |

Waga według CLAUDE.md („Audyty i wydania”): to nie są blokery wydania (nie ma utraty danych, liczby podanej użytkownikowi ani prywatności), tylko nietrafiony rysunek. W bramce 4 „do poprawy” blokuje nałożenie tych dwóch póz.

## Poniżej progu pewności (nie zgłaszam jako znalezisko)
- Standing Gastrocnemius Calf Stretch: katalog (docs/research/25-biblioteka/L3.json, notatka S17) i `recommended: box` opisują piętę na stopniu i palce w górę. Rysunek to poza przy ścianie, identyczna z Wall Calf Stretch (przybliżenie zgłoszone w PRZYBLIZENIA). Cecha „stojące rozciąganie łydki z prostym kolanem” zostaje, więc według kroku 1 nie jest to jednoznacznie wyjątek. Do rozważenia: w karcie ćwiczenia jest skrzynia, a na rysunku ściana. Pewność, że to błąd: ok. 60%.
- Butterfly Stretch: pięty są 2 cm od siebie, palce 18,8 cm (stopy w V, podeszwy stykają się tylko przy piętach). W widoku z boku (jedyny widok rodziny) tego nie widać.
- Wall Calf: tylna kostka ma 32° zgięcia grzbietowego przy prostym kolanie. To górna część zakresu, ale mieści się w EXT_ROM (37°).

## Lista kontrolna, krok po kroku
1. Przybliżenia (5 w obu manifestach): wszystkie zachowują cechę rozpoznawczą (patrz uwaga o Gastrocnemius). Inchworm jest wyjątkiem: nie ma go w poses/mobility_stand.json, w VARIANTS, w lib/figures/data.json ani w lib/cues/data.json, więc `figureSpec` i `figureByKey` zwracają null. Powód jest w data/zrodla/figury-wyjatki.json:21 (ta sama treść co WYJATKI w mobility_stand.mjs:78). Fazy „Dłonie do stóp” i „Marsz w podpór” usunięte z kodu i słowników. frames.max wrócił do 12, DYN bez mobility_stand.
2. Styki zmierzone dla wszystkich 17 póz. Stopy stojących: 0,1 cm. Pięty tylnych nóg (Wall Calf, Gastroc, Soleus): y = 0. Dłonie przy ścianie: −0,3 cm (styk). Siady: miednica 0,1 cm. Leżenie na plecach: tułów i głowa 0,1 cm. Child's Pose: czoło 0,9 cm (SVG), golenie 1,0 cm, grzbiety stóp −1,4 cm. Kneeling HF: tylne kolano (udo) 0,3 cm. Cat-Cow: dłonie −1,3 cm, kolana (udo) 1,2 cm. Wyjątki to znalezisko 1 i NISKIE 3.
3. Rzędy błędów: żadna poza nie ma rzędu błędu. st.mis.force i dyn.mis.jerk są w `bledy_bez_animacji` z powodem. Podglądy mają tylko wiersz „poza poprawna”.
4. Reguły r3 (R1–R8, tests/figury-mobilnosc-reguly.test.ts) i pokrycie: `npx jest` na obu plikach przechodzi, 17/17 testów. Reguły biegną na wszystkich pozach rodziny.
5. Tabela kątów porównana z regułami i źródłami. Zgodne poza znaleziskiem 2. Przykłady: Overhead Triceps bark 169°, łokieć 146°; Kneeling HF tylne biodro −16° (wyprost); Supine Hamstring biodro 92°, kolano 9°; Child's Pose kolano 152°, biodro 139°.
6. PODGLAD-WAZNY.txt jest w obu katalogach, zgodność manifestu pusta, tabela kątów jest.
7. `node scripts/figures/jakosc-raport.mjs`: 537 póz, 0 trafień w mobility. Jedno trafienie spoza zakresu: Wall Sit (rig squat) `klatki_rozne`. Nie oceniałem go, prawdopodobnie to fałszywy alarm dla izometrii; do sprawdzenia przez właściciela rodziny squat.

## Luki listy kontrolnej i reguł
- Brak reguły styku dla leżenia na boku. `lezenie_miednica` (≤ 15 cm) dotyczy tylko leżenia na plecach, a reguły R1–R8 nie sprawdzają podłogi. Side-Lying Quad przeszedł bramki 2–3 z miednicą 13,5 cm nad podłogą. Propozycja: w kroku 2 dopisać wprost „każda poza leżąca lub siedząca: zmierz odstęp miednicy, tułowia i głowy od podłogi”. Mechanizm: reguła sensu „ciało leży” (odstęp miednicy i tułowia od podłogi ≤ 2 cm według kolizorów) dla ćwiczeń z „Lying” lub „Supine” w nazwie albo z trunkRoll ≈ ±90°.
- Reguły „lekko” bez górnego progu (`obie_kolana_lekko` ma tylko min 10°). Słowo „slightly” ze źródła nie ma odpowiednika w walidatorze. Propozycja: przy wskazówce „lekko” reguła ma też max (konwencja, np. ≤ 30°).
- Kolizor stopy (`foot`: pięta i palce +3,5 cm w y) zakłada podeszwę w dół. Dla stopy grzbietem do podłogi (Child's Pose) daje fałszywe 3,4 cm odstępu, więc krok 2 trzeba wtedy mierzyć z SVG. Warto to zapisać w kroku 2.
- Rzut stopy w osi widoku daje w widoku z boku ścieżkę zerowego rozmiaru (znika stopa). Żadna bramka tego nie wykrywa. Propozycja: reguła jakości „część ciała widoczna” (pole rzutu stopy > 0 w widokach rodziny).
- Notatka 53 nie mówi, jak zbudować podgląd do recenzji bez nakładania. Trzeba było to wyczytać z kodu run.mjs (`--podglad` bez `--zastosuj`, katalog `--wyjscie`). Warto to dopisać.
