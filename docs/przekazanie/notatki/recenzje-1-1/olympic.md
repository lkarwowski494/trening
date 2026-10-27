# Recenzja ruchu 1.1: rodzina olympic (23 ćwiczenia), 27.10.2026

Metoda jak w `core_hang.md` i `plyo.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2). Na siatce u co 0,0125 liczyłem poślizg stóp, odcinki lotu oraz położenie pięty i palców. Uzasadnień generatorów ani opisów commitów nie czytałem.

Walidator: **23/23 OK**. Szczelność reguł automatycznych: **0 z 18 ćwiczeń z błędem (0%)**, w 4 klasach.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Power Clean** | **BŁĄD** | nr 1 |
| **Clean** | **BŁĄD** | nr 1 |
| **Split Clean** | **BŁĄD** | nr 1; nożyce na końcu jak w Split Jerk (uwaga B) |
| **Hang Clean** | **BŁĄD** | nr 1 (start z zawieszenia poprawny: sztanga 72 cm, biodro 34°) |
| **Block Clean** | **BŁĄD** | nr 1, nr 4 |
| **Block Power Clean** | **BŁĄD** | nr 1, nr 4 |
| **Barbell Snatch** | **BŁĄD** | nr 1 |
| **Power Snatch** | **BŁĄD** | nr 1 |
| **Split Snatch** | **BŁĄD** | nr 1; B |
| **Hang Snatch** | **BŁĄD** | nr 1 |
| **Block Snatch** | **BŁĄD** | nr 1, nr 4 |
| **Block Power Snatch** | **BŁĄD** | nr 1, nr 4 |
| **Clean Pull** | **BŁĄD** | nr 2 |
| **Snatch Pull** | **BŁĄD** | nr 2 |
| **Clean Shrug** | **BŁĄD** | nr 3 |
| **Snatch Shrug** | **BŁĄD** | nr 3 |
| Power Jerk | OK z uwagą | ugięcie (kolano 39°), wybicie na palce, wyprost rąk w trakcie zejścia, przyjęcie w półprzysiadzie (miednica 69, łokieć 15°); A |
| Split Jerk | OK z uwagą | uwaga B |
| **Squat Jerk** | **BŁĄD** | nr 1 (sztanga zablokowana nad głową prawie w staniu, potem przysiad) |
| Jerk Dip Squat | OK | sztanga na barkach, ugięcie do kolana 51° i powrót, pięty na podłodze |
| Snatch Balance | OK z uwagą | sztanga z karku nad głowę w trakcie zejścia w przysiad, łokieć 134° → 19°; uwaga C |
| Muscle Snatch | OK z uwagą | bez ugięcia pod sztangą (poprawnie dla tej odmiany), sztanga 76 → 197 cm; A, D |
| **Clean and Jerk** | **BŁĄD** | nr 1; podrzut rusza wprost z przysiadu po zarzucie (u 0,72: kolano 77°, u 0,78 już w powietrzu), bez wstania i ugięcia |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **zarzuty, rwania, Squat Jerk, Clean and Jerk** (14) | faza po wyproście (Power Clean u 0,20–0,79; Snatch u 0,33–0,83) | **Sztanga dochodzi do pozycji końcowej rękami, w staniu na palcach, a przysiad przychodzi dopiero potem.** Power Clean: po wyproście (u = 0,20, kolano 3°) postać stoi do u = 0,79 na samych palcach. Pięty są 21 cm nad podłogą, palce 2,8–5,3 cm, czyli stopy w powietrzu przez ok. 60% ruchu. W tym czasie sztanga jedzie z 91 do 148 cm przy zgiętych łokciach (103° → 146°) i w u = 0,49–0,79 leży na barkach przy kolanach zgiętych 9–13°. Zejście w przysiad (kolano 41° → 77°, w Clean do 124°) następuje dopiero z gotowym „rackiem”. Barbell Snatch: w u = 0,50–0,62 zarwanie do 152 cm (łokieć 127°, ramię 42° za tułowiem) w powietrzu, w u = 0,83 sztanga nad głową (176 cm) przy kolanie 40°, a potem przysiad nad głową, w którym sztanga opada o 37 cm (do 139). Squat Jerk: blokada nad głową w u = 0,63 przy kolanie ok. 30°, potem przysiad. Obraz to „zarwanie + przysiad przedni” albo „rwanie siłowe + przysiad nad głową”. Na arkuszu z boku widać 4–5 klatek „na palcach ze sztangą przy barkach”. | Po wyproście stopy krótko odrywają się albo przesuwają (rozstaw 14 → 16–22 cm jest), a postać natychmiast schodzi pod sztangę. Sztanga dochodzi do barków (nad głowę) dopiero w pozycji przyjęcia: ćwierćprzysiad w odmianach „power”, pełny przysiad albo nożyce w pozostałych. Między wyprostem a przyjęciem kolana się zginają, sztanga nie wznosi się w staniu, a stopy nie wiszą nad podłogą przez większość ruchu. | 80% | realny (każde wyświetlenie, 14 ćwiczeń) | nie: reguły `plecy_neutralne`, `sztanga_blisko` i `nad_glowa` sprawdzają tor i położenie końcowe, ale nie mierzą, przy jakim ugięciu kolan sztanga osiąga barki ani jak długo stopy są w powietrzu |
| 2 | **Clean Pull, Snatch Pull** | u = 1 (pauza) | **Ciąg kończy się sztangą przy obojczykach i zgiętymi łokciami.** W u = 1 sztanga jest na 147 cm (Snatch Pull 152), łokieć 144° (127°), ramię 30–42° za tułowiem, a stopy wiszą 5,3 cm nad podłogą. To zarwanie do barków (high pull), a nie ciąg. | Ciąg kończy się pełnym wyprostem bioder i kolan, wspięciem na palce (palce na podłodze) i wzruszeniem barków przy prostych albo prawie prostych rękach. Sztanga jest wtedy na wysokości bioder albo dolnej części brzucha (ok. 95–110 cm). | 80% | realny | nie |
| 3 | **Clean Shrug, Snatch Shrug** | cały ruch, barki | **Brak wzruszenia barków.** Pole `uniesienieBarkow` nie występuje w żadnej klatce, więc ruch to sam wyprost z zawieszenia do wspięcia na palce (kolano 14° → 3°, biodro 34° → 8°). Na końcu stopy wiszą 2,8 cm nad podłogą. Cecha z nazwy jest niewidoczna. | W u = 1 barki uniesione (`uniesienieBarkow` kilka cm), ręce proste, palce na podłodze. | 70% | realny | nie |
| 4 | **Block Clean, Block Power Clean, Block Snatch, Block Power Snatch** | sprzęt | **Bloków nie ma.** Sprzęt to podłoga, sztanga i słupek stojaka w x = −75 (bez związku z ruchem). W u = 0 sztanga wisi w dłoniach na 52 cm, a talerze (dół ok. 30 cm) nie leżą na niczym, więc to wygląda jak start z zawieszenia poniżej kolan. W fazie powrotu sztanga „odkłada się” w powietrze. | Pod talerzami skrzynie (`skrzynia`, blat ok. 30 cm, po obu stronach), sztanga leży na nich w u = 0. Słupek stojaka zbędny. | 75% | realny | nie: katalog nie wymaga sprzętu „blocks” (`requires`), a `sprzet_rozpoznawczy` go nie zna |

## OK z uwagą (backlog, nie blokuje)

- **A. Palce nad podłogą przy wspięciu.** Przy podbiciu −40…−48° silnik podnosi czubek stopy, a pozy nie obniżają kostki. Palce są 2,8–5,3 cm nad podłogą (Power Jerk, Muscle Snatch, Clean i Snatch Shrug, Pulls). Przy wspięciu na palce czubek stopy zostaje na podłodze. Klatki końcowe z pauzą (Pulls 5,3 cm, Shrugs 2,8 cm) to lewitacja tej samej klasy co Cocoons w n6 (próg R17: 1 cm).
- **B. Nożyce za głębokie i za krótkie** (Split Jerk, Split Clean, Split Snatch, Clean and Jerk). W u = 1 miednica jest na 65 cm, kolano przedniej nogi 84°, tylnej 101°, a kostki w x 30 / −17 (rozstaw 47 cm). Sztanga nad przednią stopą (x 26–30), 19 cm przed miednicą. W nożycach tylna noga jest zwykle prawie prosta (pięta w górze), a rozstaw dłuższy. Tu obraz bliższy wykrokowi. Pewność 65%.
- **C. Sztanga nad głową przed środkiem stopy w pełnym przysiadzie** (Snatch Balance, Barbell / Hang / Block Snatch, Squat Jerk). Sztanga w x 24–25, kostki w x 0 (środek stopy ok. x 5–8). Pewność 60%.
- **D. Muscle Snatch: łokcie do tyłu.** Ramię do 65° za tułowiem (u = 0,56) zamiast łokci w górę i na boki. W rzucie z boku wygląda to jak wiosłowanie. Pewność 55%.
- **E. Animacja wahadłowa.** Faza 1 → 0 odkłada sztangę tym samym torem, z odwróconym „lotem”. To ograniczenie silnika.

## Proponowane reguły

| Reguła | Warunek | Błędy | Pozostałe |
|---|---|---|---|
| `przyjecie_w_ugieciu` | zarzut i rwanie (z wyjątkiem „muscle”): w pierwszej klatce, w której sztanga osiąga ≥ 90% wysokości końcowej, kolano ≥ 30° (power) albo ≥ 60° (pełne, nożyce) | 14 ćwiczeń (kolano 9–13° przy sztandze na barkach) | Power Jerk, Snatch Balance: ok |
| `czas_w_powietrzu` | w podnoszeniu ze sztangą (bez deklaracji skoku) obie stopy nad podłogą (> 1,5 cm) najwyżej przez 15% u | zarzuty i rwania: 40–60% | Jerk Dip Squat 0% |
| `ciag_konczy_sie_wyprostem` | „Pull”: w u = 1 łokieć ≤ 30°, sztanga ≤ 115 cm | Pulls: 144° / 147 cm | — |
| `wzruszenie_widoczne` | „Shrug”: w u = 1 `uniesienieBarkow` ≥ 3 cm | Shrugs: brak pola | — |
| `palce_na_podlodze` (niezmiennik) | gdy pięta jest w górze i stopa nie jest w deklarowanym locie, czubek ≤ 1 cm nad podłożem | A (2,8–5,3 cm) | — |
| `sprzet_z_nazwy` | „Block …”: poza ma podporę pod talerzami w u = 0 | nr 4 | — |

Progi to konwencja rysunku do potwierdzenia przez badacza. Dobrane na tych samych danych, więc to wynik w próbie, a nie dowód szczelności.
