# 26 — Grafiki, animacje i wskazówki techniki ćwiczeń (research 08.10.2026)

Raport źródłowy (bez zmian treści). Decyzja: docs/18 (08.10.2026).

# Grafiki, animacje i wskazówki techniki na karcie ćwiczenia — research (08.10.2026)

Pytanie właściciela (08.10.2026): „Czy są gdzieś dostępne wskazówki i grafiki dla każdego ćwiczenia, jak wygląda poprawny wzorzec ruchu? Lub animacje? To byłoby dobre na karcie ćwiczenia.”

Stan: research zakończony, repozytorium nie było zmieniane. Pliki pobrane do sprawdzenia leżą w scratchpadzie (`dl/`), skrypty dopasowań w `scripts/`.
To nie jest porada prawna: przy opcjach z cudzymi materiałami ryzyko prawne trzeba traktować jako realne.

## 1. Najważniejsze ustalenia

1. **free-exercise-db (źródło naszego pola `fedb`) — zdjęcia i opisy najpewniej pochodzą z Bodybuilding.com, a nie z domeny publicznej.**
   - **Nazwy:** 870 z 876 nazw fedb występuje dosłownie w zrzucie wyszukiwarki ćwiczeń Bodybuilding.com z 2020 r. (repozytorium `Bipinoli/scraping_body_building_data`, skrypt pobiera `https://www.bodybuilding.com/exercises/finder/…`). Pasują nawet nietypowe nazwy, np. „Pullups” i „Barbell Bench Press - Medium Grip”.
   - **Pola danych:** zestaw pól (force, level, mechanic, equipment, mięśnie) odpowiada polom stron Bodybuilding.com („Main Muscle Worked, Other Muscles, Equipment, Mechanics Type, Level, Sport, Force”, gist `nhomble/0efa413180471a0d5b21`).
   - **Licencja:** Unlicense opisuje tylko oddanie praw przez autora repozytorium. Nie może przenieść praw, których autor nie miał.
   - **Pytania o pochodzenie zdjęć:** pytania w obu repozytoriach zostały bez odpowiedzi: yuhonas #2 (zamknięte bez komentarza), #12 i #13, wrkout #305 i #308.
   - **Warunki Bodybuilding.com:** „Bodybuilding.com does not grant to you … any right to use, reproduce, copy, modify, transmit, display, publish, sell or resell, redistribute, license, create derivative works, any of the Content … whether or not for profit.” (https://shop.bodybuilding.com/policies/terms-of-service, sekcja 5).
   - **Wizerunek:** zdjęcia przedstawiają rozpoznawalnych modeli, więc dochodzi prawo do wizerunku (art. 81 ust. 1 pr. aut.).
   - **Wniosek:** **nie używać zdjęć ani opisów z fedb.** Nazwy i fakty (partie, sprzęt) to nie utwór (art. 1 ust. 2¹ pr. aut.), więc dotychczasowe użycie fedb jako listy kontrolnej jest w porządku. Wpis „domena publiczna” w `docs/research/equipment/catalog-notes.md` warto jednak poprawić.
2. **wger — licencje CC są przypisane do każdej pozycji, ale zgłaszają je użytkownicy i nie są wiarygodne.**
   - Przykłady: zdjęcie oznaczone autorem „Athlean-X” to kadr z filmu tego kanału, a „Workout Guru” to komercyjny render 3D.
   - 100 z 379 obrazów nie ma autora, 42 są wygenerowane przez AI, styl jest mieszany.
3. **Everkinetic — jedyny spójny zbiór rysunków na licencji CC BY-SA.**
   - Rysunki liniowe z pozycją początkową i końcową.
   - Licencja wymaga uznania autorstwa i udostępniania na tych samych warunkach (ShareAlike).
   - Jest też nierozstrzygnięty problem DRM w App Store (pkt 4).
   - Pokrywa tylko ok. 50 ze 125 ćwiczeń bazowych, a styl odbiega od stylu aplikacji.
4. **Źródła płatne i działające przez API** (Gym visual / ExerciseDB, MuscleWiki) odpadają z dwóch powodów: reguła 0 zł oraz obietnica „brak sieci” w polityce prywatności.
5. **Tekst wskazówek z darmowych zbiorów ma błędy merytoryczne.**
   - Przykład: fedb uczy, że kolano za linią palców w przysiadzie to „błąd”. Badania tego nie popierają (pkt 6).
   - Wskazówki trzeba napisać samodzielnie, parafrazując fakty z kilku przeczytanych źródeł. Fakty i metody nie są chronione (art. 1 ust. 2¹ pr. aut.).

## 2. Tabela źródeł

| Źródło | Licencja tekstu (cytat, URL) | Licencja mediów (cytat, URL) | Obowiązki w aplikacji iOS | Pokrycie naszego katalogu | Format i rozmiar | Jakość i styl | Werdykt |
|---|---|---|---|---|---|---|---|
| **yuhonas/free-exercise-db** | Unlicense („This is free and unencumbered software released into the public domain”, `LICENSE.md` w repo https://github.com/yuhonas/free-exercise-db). Tekst najpewniej pochodzi z Bodybuilding.com (jw.) | Ta sama Unlicense, ale pochodzenie zdjęć jest nieustalone. Dowody wskazują na Bodybuilding.com, którego warunki zabraniają kopiowania (cytat w pkt 1). README podaje tylko: „Ollie Jennings for the original dataset at exercises.json”. Repozytorium wrkout/exercises.json ma pierwszy commit „initial push of open dataset” (22.08.2020) bez podania źródła | Formalnie żadnych. Faktycznie ryzyko naruszenia praw autorskich i wizerunku | Zdjęcia ma 581 z 584 ćwiczeń z polem `fedb`. Bazowe 125: ok. 105–115 dopasowań po nazwie, część przybliżona | 1746 JPG (2 na ćwiczenie), łącznie 98,7 MB, mediana 55 KB, zwykle 850×567. Dla 125 bazowych ok. 14 MB | Profesjonalne zdjęcia z siłowni. Opisy zawierają błędy (pkt 6) | **Nie używać** (ani zdjęć, ani tekstu) |
| **wrkout/exercises.json** (źródło fedb) | Unlicense (`LICENSE.md`). README odsyła do płatnego wrkout.xyz | jw., bez wskazania pochodzenia | jw. | jw. | jw. | jw. | **Nie używać** |
| **wger** (https://wger.de, API `/api/v2/`) | README: „Exercise/Ingredient Data: Creative Commons (see individual entries)”. Wpisy w API: CC-BY-SA 4: 766, CC-BY-SA 3: 132, CC0: 21 (z 919) | Licencja dla każdego obrazu: CC-BY-SA 4 (291) / CC-BY-SA 3 (88). 100 obrazów bez autora, 42 oznaczone `is_ai_generated`. Przykłady fałszywych licencji: „Mentzer Pulldown” — autor „Athlean-X” (kadr z filmu), „Barbell Full Squat” — „Workout Guru” (komercyjny render 3D, źródło workoutguru.fit) | Uznanie autorstwa każdego obrazu (autor, licencja, link) i ShareAlike dla przeróbek. Do tego problem DRM z pkt 4 | Obrazy ma 277 z 919 ćwiczeń, wideo 46 (78 filmów). Bazowe 125: ok. 85 dopasowań po nazwie, z wieloma fałszywymi trafieniami. Cały katalog: ok. 59 dopasowań ścisłych | PNG/JPG 7–290 KB. Wideo HEVC 1080p, np. 34 MB za 10 s | Styl mieszany: rysunek liniowy, zdjęcie, 3D, AI. Niespójne | **Nie jako zbiór.** Ewentualnie pojedyncze pliki Everkinetic (niżej) |
| **everkinetic/data** (https://github.com/everkinetic/data) | `LICENSE.md`: „Attribution-ShareAlike 4.0 International”. README: „Open data project based on http://everkinetic.com created by Greg Priday” | Ta sama CC BY-SA 4.0 w repozytorium. Na Wikimedia Commons (wgrane w 2010): `Source=http://everkinetic.com/`, `Author=Everkinetic`, `{{cc-by-sa-3.0}}` (np. File:Bicep-curl-2.png) | Uznanie autorstwa: twórca, informacja o licencji z linkiem, wskazanie zmian (3(a)(1)). ShareAlike dla przeróbek (3(b)), np. przekolorowania. Zakaz środków technicznych ograniczających odbiorców (2(a)(5)(C)) — pkt 4 | 293 ćwiczenia. Bazowe 125: ok. 50. Cały katalog: ok. 100 (dopasowanie przybliżone) | 537 SVG, mediana 20 KB, 10,6 MB. SVG są autośledzone, białe wypełnienie, ciężkie ścieżki. PNG 24 MB | Spójna kreska, zawsze ta sama muskularna sylwetka mężczyzny. Pozycja początkowa i końcowa („relaxation/tension”). Nazwy powielają nazewnictwo Bodybuilding.com, więc pochodzenie wzorów jest nieznane (pytanie otwarte). Porównanie 2 par z obecnymi zdjęciami fedb: pozy różne, nie widać kalki | **Prawnie używalne z obowiązkami, ale niepełne i obce stylem.** Ryzyko: DRM, ShareAlike |
| **hasaneyldrm/exercises-dataset** | MIT dla „code, tooling, dataset structure, and instruction text/translations” (`LICENSE`). Pochodzenie tekstu niepewne: identyfikatory mediów jak w ExerciseDB | „It DOES NOT cover the exercise media … That media is © Gym visual … included here with the rights holder's written permission … Cloning this repository does not grant you any license to the media; obtain your own from Gym visual.” (`LICENSE`, `NOTICE.md`) | Media: osobna licencja od Gym visual (płatna) | 1324 ćwiczenia | GIF 180×180 | Spójne rendery 3D | **Media wykluczone** (płatne). Tekst niepewny — nie używać |
| **Wikimedia Commons** | — | Licencja dla każdego pliku. Wyszukiwanie „everkinetic” w przestrzeni File: daje 1089 trafień, głównie kopie Everkinetic na CC-BY-SA-3.0 | Uznanie autorstwa i ShareAlike dla każdego pliku | Jak Everkinetic | PNG ok. 16 KB | jw. | Nic ponad Everkinetic |
| **Gym visual** (https://gymvisual.com/content/3-terms-and-conditions-of-use) | — | Płatna licencja „N-CRFL”: „you pay for the Media only once…”. Cennik w sklepie, np. „$6 per 1 video after 5 items in cart”. Redystrybucja wymaga „separate written consent” | — | — | — | — | **Wykluczone (0 zł)** |
| **ExerciseDB / AscendAPI** (https://exercisedb.dev) | Warunki na Notion — nie dało się ich przeczytać (strona wymaga JS) | Strona główna: „1,500 exercises with GIFs. No sign-up, no API key — just call the endpoint directly” (tylko przez API) | — | — | — | — | **Wykluczone:** wymaga sieci, pochodzenie GIF-ów niejasne. Warunki nieprzeczytane — pytanie otwarte |
| **MuscleWiki API** (https://api.musclewiki.com/pricing.md, /api-terms) | Plany „$10 per month” … „$199.99 per month”; darmowy tylko „Playground” | „You may NOT download, export, copy, store, or otherwise retrieve MuscleWiki videos, thumbnails, or bodymap images”, „Permanent storage or long-term caching of any media is prohibited.” | — | — | — | — | **Wykluczone** (płatne, wymaga sieci, zakaz przechowywania) |
| **ACE Exercise Library** (ok. 330 ćwiczeń) | „No portion of the Site may be reproduced, duplicated, copied … for any commercial purpose without the express prior written consent of ACE.” Także „All content … text, graphics, photographs … is the property of ACE” (https://acefitness.org/legal/terms-of-use) | jw. | Nie kopiować. Wolno czytać jako źródło faktów i cytować z podaniem źródła | — | — | Dobre opisy kroków | **Źródło do czytania (szczebel 4), nie do kopiowania** |
| **ExRx.net** | Nie udało się przeczytać (HTTP 403 dla WebFetch i curl) | — | — | — | — | — | Pytanie otwarte; traktować jako chronione |
| **NSCA Exercise Technique Manual, ACSM** | Książki i materiały chronione prawem autorskim (wydawca Human Kinetics / ACSM). Warunków nie czytano, bo nie są publicznie dostępne | — | Parafraza faktów z cytowaniem źródła jest dopuszczalna (pkt 5) | — | — | Szczebel 2–3 | **Źródło merytoryczne** (do zakupu lub biblioteki — koszt!) |

Pokrycie liczono skryptami `scripts/match2.py` (wzorce dla 125 bazowych) i `scripts/match3.py` (dopasowanie przybliżone dla 854). Wyniki są przybliżone, z fałszywymi trafieniami (np. „Air Bike” w fedb to ćwiczenie na brzuch, a nie rower). Przed jakimkolwiek użyciem trzeba je przejrzeć ręcznie.

## 3. Co wynika z prawa (czytane źródła)

- **Ochrona formy, nie pomysłu.** Art. 1 ust. 2¹ ustawy o prawie autorskim (tekst jednolity Dz.U. 2025 poz. 24, pobrany z api.sejm.gov.pl): „Ochroną objęty może być wyłącznie sposób wyrażenia; nie są objęte ochroną odkrycia, idee, procedury, metody i zasady działania oraz koncepcje matematyczne.” Tak samo stanowią WCT art. 2 („Copyright protection extends to expressions and not to ideas, procedures, methods of operation…”, https://www.wipo.int/wipolex/en/text/295166) oraz 17 U.S.C. §102(b) (https://www.law.cornell.edu/uscode/text/17/102).
  → Wzorzec ruchu (np. „łopatki ściągnięte, sztanga do środka klatki”) to metoda, więc można go opisać własnymi słowami.
  → Konkretny rysunek lub zdjęcie to utwór.
- **Utwór zależny (opracowanie).** Art. 2 ust. 2: „Rozporządzanie i korzystanie z opracowania zależy od zezwolenia twórcy utworu pierwotnego (prawo zależne)”.
  → Odrysowanie (kalka, trasowanie) cudzego zdjęcia lub rysunku i przerobienie go na SVG to opracowanie, które wymaga zgody autora.
  → Własny rysunek pozy według opisu słownego, kątów ze stawów z literatury albo własnego zdjęcia lub nagrania właściciela — nie wymaga.
  → Postępowanie konserwatywne: nie rysować „na podstawie” jednego konkretnego cudzego obrazu, nawet bez kalki, jeśli kadr, kąt i szczegóły są rozpoznawalnie te same.
- **Wizerunek.** Art. 81 ust. 1: „Rozpowszechnianie wizerunku wymaga zezwolenia osoby na nim przedstawionej”. Dotyczy zdjęć fedb i każdego zdjęcia z modelem.
- **Prawo cytatu (art. 29)** obejmuje cytat „w zakresie uzasadnionym celami cytatu, takimi jak wyjaśnianie … nauczanie”. Nie nadaje się do masowego kopiowania obrazów do biblioteki ćwiczeń.

## 4. CC BY-SA w aplikacji iOS — co trzeba by spełnić

Źródło: tekst CC BY-SA 4.0 (`LICENSE.md` w everkinetic/data) i FAQ CC (https://creativecommons.org/faq/).

- **Uznanie autorstwa (3(a)(1)):** twórca, informacja o licencji z linkiem, wskazanie zmian. Wg 3(a)(2) można to zrobić „in any reasonable manner based on the medium”, np. ekran „Źródła grafik” z listą i linkami. W aplikacji bez sieci link to tylko tekst adresu.
- **ShareAlike (3(b)):** każda przeróbka (przekolorowanie pod motyw jasny i ciemny, uproszczenie, animacja) musi być na CC BY-SA. Nasze repozytorium jest publiczne, więc wymaga to tylko oznaczenia plików graficznych licencją, a nie zmiany licencji całej aplikacji. FAQ CC: „CC licenses do not require the collection or the compilation itself to be made available under an SA license”.
- **DRM (2(a)(5)(C) i 3(b)(3)):** licencja zakazuje stosowania „Effective Technological Measures” ograniczających odbiorców.
  - App Store szyfruje aplikacje (FairPlay).
  - FAQ CC: nie wolno wrzucać pliku do serwisu, który nakłada DRM. Jeśli jednak plik jest dostępny bez DRM gdzie indziej, a odbiorca używa aplikacji z DRM, „you have not violated the license”.
  - Praktyka innych (OEFEN, https://github.com/Baroknolia/oefen-exercise-art): publiczne repozytorium z grafikami jako „escape hatch” dla dystrybucji w App Store.
  - Nasze publiczne repozytorium dawałoby taki sam równoległy dostęp bez DRM. **Nie jest to jednak rozstrzygnięte prawnie — ryzyko średnie, pytanie otwarte.**

## 5. Wymóg offline

- Polityka prywatności (`docs/privacy.html`): „Aplikacja nie łączy się z internetem”.
- Każda opcja z pobieraniem w trakcie działania (wger API, ExerciseDB, MuscleWiki, linki do wideo otwierane w aplikacji) łamie tę obietnicę. Wymagałaby zmiany polityki i odpowiedzi w App Store Privacy, a MuscleWiki wręcz zabrania przechowywania.
- Wszystkie grafiki muszą być w paczce aplikacji.
- **Szacunek rozmiaru** (dodatek do paczki):

  | Wariant | Rozmiar |
  |---|---|
  | Zdjęcia fedb dla 125 ćwiczeń | ok. 14 MB |
  | Zdjęcia fedb dla 854 ćwiczeń | ok. 95 MB |
  | Everkinetic SVG (ok. 50 ćwiczeń × 2) | ok. 2 MB |
  | Własne figury parametryczne | ok. 0,05–0,3 MB (szacunek, pkt 7) |

## 6. Jakość instrukcji z darmowych zbiorów — kontrola wyrywkowa (fedb, 125 bazowych)

| Ćwiczenie (fedb) | Co mówi fedb | Źródło porównawcze (przeczytane) | Ocena |
|---|---|---|---|
| Barbell Squat | „If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.” | Fry, Smith, Schilling 2003, JSCR 17(4):629–33, PMID 14636100: „appropriate joint loading during this exercise may require the knees to move slightly past the toes”. Escamilla i in. 2023, MSSE, PMID 37057713: kolano przed palcami (przysiad przy ścianie) → większe obciążenie stawu rzepkowo-udowego. ACE (https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/): „knees remain aligned over the second toe” | **Błąd.** Zależność to kompromis kolano/biodro, a nie „błąd techniki” (szczebel 3, dwa niezależne zespoły) |
| Pushups | „place your hands about 36 inches apart” (ok. 91 cm) | ACE push-up (/41/push-up/): „hands shoulder-width apart” | **Błąd lub nietypowo** (rozstaw szerszy niż typowy) |
| Standing Military Press | Pozycja startowa nad głową, potem „Hold at about shoulder level…” w tym samym kroku | — | **Sprzeczny opis** |
| Romanian Deadlift | Pierwsze powtórzenie zaczyna od podłogi („Put a barbell … on the ground”) | ACE i NSCA nieprzeczytane dla RDL — pytanie otwarte | Wątpliwe |
| Pullups | „bring your torso back around 30 degrees … creating a curvature on your lower back” | Brak przeczytanego źródła | Liczba bez źródła |
| Bench Press, Deadlift, Bent Over Row, Lying Leg Curls, Plank, Hip Thrust | Ogólnie poprawne kierunkowo; Row: „keep the head up” | ACE bent-over row — przerwano odczyt (otwarte) | Do weryfikacji |

**Wniosek:** tekstu fedb nie można przejąć — ani prawnie, ani merytorycznie. Instrukcje Everkinetic (`steps`) są krótkie, na CC BY-SA i też nieweryfikowane.

## 7. Własne ilustracje i animacje — wykonalność

- **Technika:** figura parametryczna (szkielet: tułów, głowa, ramię, przedramię, udo, podudzie; kończyny jako zaokrąglone ścieżki SVG) w `react-native-svg`, którego aplikacja już używa (`components/MuscleMap.tsx`, 2,9 KB kodu).
  - Każde ćwiczenie to 2–3 klatki kluczowe zapisane jako kąty stawów w JSON (ok. 100–300 B na klatkę) plus przyrząd z biblioteki elementów.
  - Elementy przyrządów: ławka, sztanga, hantel, drążek, wyciąg. Część można wziąć z `EquipVisual.tsx`.
  - Rozmiar: 125 × 3 × 0,3 KB ≈ 0,1 MB plus kod rysujący. Kolory z motywu (jasny i ciemny), co daje spójność ze stylem aplikacji.
- **Animacja:** interpolacja kątów między klatkami, np. pętla 2–3 s.
  - **Ograniczanie ruchu (Reduce Motion):** `AccessibilityInfo.isReduceMotionEnabled()` → zamiast pętli dwie statyczne klatki obok siebie („start” → „koniec”) i przycisk odtwarzania.
- **VoiceOver:** `accessibilityRole="image"` i etykieta z opisem pozycji początkowej i końcowej (te same zdania co wskazówki), podobnie jak opis w MuscleMap.
- **Narzędzia za 0 zł:** prosty edytor póz jako ekran deweloperski albo strona HTML (suwaki kątów, podgląd, eksport JSON), Inkscape do elementów sprzętu, testy jednostkowe.
  - Przykładowe testy: kąty w zakresie anatomicznym, każde ćwiczenie bazowe ma pozy, migawki SVG.
- **Nakład (szacunek, nie pomiar):**

  | Zadanie | Szacunek |
  |---|---|
  | Szkielet, renderer, edytor, testy | ok. 3–5 dni pracy agenta |
  | Pozy | ok. 20–40 min na ćwiczenie, ok. 50–80 h dla 125 |
  | Weryfikacja | kontrola pozy przez niezależnego recenzenta wobec ≥2 źródeł opisu (wg CLAUDE.md) |

  Wiele ćwiczeń dzieli pozy (warianty hantle/sztanga), co zmniejsza pracę.
- **Ograniczenia:**
  - Rysunek schematyczny gorzej pokazuje szczegóły: chwyt, ustawienie łopatek, rotację.
  - Ujęcie z boku nie pokazuje koślawienia kolan, więc część ćwiczeń wymaga widoku z przodu.
  - Ćwiczenia kardio i rozciągania lepiej obsłużyć samym tekstem albo pominąć.
- **Legalne wzory:**
  - opisy słowne i kąty stawów z literatury (fakty);
  - własne zdjęcia lub nagrania właściciela albo testera za zgodą (wizerunek, art. 81 — zgoda na piśmie, zdjęcia tylko jako wzór, nie w aplikacji);
  - wspólna wiedza o pozycji („tułów ok. równolegle do podłogi”).
  - **Nie** odrysowywać ani wiernie odtwarzać konkretnych cudzych zdjęć i rysunków (fedb, ACE, ExRx, Gym visual), także Everkinetic bez spełnienia BY-SA.

## 8. Wskazówki tekstowe (dotyczy każdej opcji)

- **Treść:** 3–5 krótkich wskazówek na ćwiczenie: ustawienie, ruch, częsty błąd. Pisane własnymi słowami.
- **Źródła:** każda wskazówka z ≥2 niezależnych, przeczytanych źródeł (szczebel 2–3: przeglądy, stanowiska, podręczniki NSCA/ACSM; szczebel 4: ACE tylko jako uzupełnienie). Przy jednym źródle oznaczenie „jedno źródło”.
- **Bez porad medycznych:** stopka „Ból lub uraz — skonsultuj się ze specjalistą”.
- **Języki:** 125 × ok. 4 zdania × 26 języków to duża praca tłumaczeniowa (przez `t()` / słownik). Do decyzji: najpierw PL/EN, a pozostałe języki dostają wskazówki później albo z oznaczeniem.
- **Koszt źródeł:** NSCA „Exercise Technique Manual” i podręcznik ACSM są płatne, co stoi w konflikcie z regułą 0 zł. Alternatywy za darmo: abstrakty i artykuły open access (PubMed/PMC), strony ACE do czytania. Pytanie otwarte: czy wystarczą do ≥2 źródeł na każdą wskazówkę.

## 9. Opcje dla właściciela

| | Opis | Nakład | Ryzyko prawne | Ryzyko jakości | Rozmiar |
|---|---|---|---|---|---|
| **A** | Własne figury SVG (2–3 klatki + pętla, statyczne przy Ograniczaniu ruchu) dla 125 bazowych + własne wskazówki tekstowe ze źródłami | Duży: ok. 3–5 dni szkielet + 50–80 h pozy + wskazówki i tłumaczenia | **Niskie** (własny utwór) | Średnie: schematyczność; wymaga recenzji póz | ok. 0,1–0,3 MB |
| **B** | Rysunki Everkinetic (CC BY-SA) tam, gdzie są (ok. 50 ze 125), + ekran „Źródła grafik” + publiczny katalog grafik w repo + własne wskazówki | Średni | **Średnie:** DRM w App Store nierozstrzygnięty, ShareAlike dla przeróbek, nieznane wzory Everkinetic | Wysokie: 60% bez grafiki, inny styl (muskularny mężczyzna, czarna kreska) | ok. 1–2 MB |
| **C** | Tylko wskazówki tekstowe ze źródłami (bez grafik) | Mały–średni | Niskie | Niskie (tekst weryfikowalny), ale mniej pomocne wizualnie | ~0 |
| **D** | C teraz, potem A etapami (najpierw ok. 20–30 najczęstszych ćwiczeń z szablonów), z Everkinetic jako tymczasowym wyjątkiem — **niezalecane** | Rozłożony | Niskie przy C+A | Niskie–średnie | rośnie stopniowo |

**Rekomendacja: A, wdrażane etapami (C → A).**
- **Etap 1:** wskazówki tekstowe dla 125 bazowych (PL/EN, źródła ≥2) — dają wartość od razu i są podstawą opisów dla VoiceOver.
- **Etap 2:** szkielet i figury dla najczęstszych ćwiczeń.
- **Etap 3:** reszta bazowych. 854 ćwiczenia pełnej bazy bez grafiki (tylko tekst albo nic) do osobnej decyzji.

Uzasadnienie:
- Opcja A jest ogólnie lepsza: spójna ze stylem aplikacji, offline, mała, dostępna (VoiceOver, Ograniczanie ruchu) i bez cudzych praw.
- B jest szybsza, ale niepełna, obca stylem i niesie realne ryzyko prawne (DRM, ShareAlike, niejasne wzory).
- Zdjęcia fedb, wger i płatne źródła odpadają.

## 10. Pytania otwarte

1. Pochodzenie wzorów rysunków Everkinetic (nazwy jak w Bodybuilding.com). Strona everkinetic.com nie została przeczytana.
2. Czy publiczne repozytorium wystarcza wobec zakazu DRM (CC BY-SA 2(a)(5)(C)) przy dystrybucji przez App Store. Rozstrzyga tylko prawnik albo licencjodawca (zgoda pisemna Everkinetic usunęłaby ryzyko).
3. Warunki ExerciseDB/AscendAPI i ExRx — nieprzeczytane (Notion bez JS, 403).
4. Prawidłowe RDL (start z góry) i wiosłowanie (pozycja głowy) — źródła szczebla 2–3 nieprzeczytane.
5. Darmowy dostęp do źródeł szczebla 2 (NSCA/ACSM) dla wskazówek. Zakup książki łamie regułę 0 zł — decyzja właściciela.
6. Wskazówki w 26 językach od razu czy etapami.
7. Pełny katalog (854) bez grafik i wskazówek — akceptowalne?
8. Korekta wpisu „domena publiczna” przy free-exercise-db w `docs/research/equipment/catalog-notes.md`: nazwy są OK, ale nie twierdzić, że zdjęcia i opisy są w domenie publicznej.
9. Decyzję merytoryczną (np. „kolano za palcami nie jest błędem”) zapisać w rejestrze decyzji na Google Drive przy wdrażaniu wskazówek.
