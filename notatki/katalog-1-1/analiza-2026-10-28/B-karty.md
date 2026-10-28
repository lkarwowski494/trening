# B — Karty ćwiczeń: treść i forma (analiza 28.10.2026, tylko odczyt)

Zakres: aplikacja 1.1 (`/home/user/wt/int`, gałąź `integracja-1-1`, HEAD `55ba40c`), porównanie z `origin/main` (1.0, `96c24258`), strona `/home/user/ext/techniqueatlas` (PIN: `integracja-1-1` `bd7e62f`, 502 commity za HEAD). Niczego nie zmieniałem w repozytoriach. Dane pomocnicze (sonda jest, eksport strony) leżą wyłącznie w scratchpadzie sesji.

## Streszczenie (14 punktów)

1. **WYSOKIE: 1.1 nie ma bramki 4 dla treści kart, którą main dostał 28.10.** Bramka obejmuje `generalCuesReviewed`, listę `hidden` i `docs/research/figury-recenzja.json`. W 1.1 wracają przez to treści, które main już wycofał: karta Hack Squat (w main „do poprawy”) i 5 usuniętych zdań. Jedno z nich to **„Odkładaj sztangę…” na karcie Deadlift (hantle)**, czyli zgłoszenie z TestFlight. Do tego wracają 3 figury v1 ukryte w main i 8 zestawów ogólnych z rodziny pull_up bez recenzji (BK-01).
2. **WYSOKIE: eksport strony nie przepuszcza tekstów przez bramkę.** Figury przepuszcza tylko po recenzji (w 1.1 eksportuje 0 figur, bo brak pliku recenzji), ale **wszystkie 639 bloków wskazówek** (102 własne i 537 ogólnych) trafiają na strony ćwiczeń. W tym są zestawy dla 459 ćwiczeń, których aplikacja nie pokazuje, bo ich rodzina nie jest `ready` (BK-02).
3. **WYSOKIE, widoczne w 1.0: RDL ma odwrócony opis błędu.** Pod „Częste błędy” i w wierszu „Częsty błąd:” przy figurze błędu (kolana ugięte jak w przysiadzie) stoi „Kolana tylko lekko ugięte — to nie przysiad.”, czyli opis poprawnej techniki (BK-03).
4. **WYSOKIE (strona), w aplikacji jeszcze niewidoczne:** 9 ćwiczeń z kettlebellem lub hantlem dostaje zestaw „oly” z „sztangą” („Sztanga blisko ciała…”, „sztangę wybijają nogi”) (BK-04).
5. Pokrycie aplikacji 1.1: sekcję „Technika” ma **180 z 709 ćwiczeń (25%)**: 102 karty własne i 78 zestawów ogólnych przy figurze v2. Pozostałych **529 nie ma żadnej wskazówki techniki**. W 1.0 jest to ok. 171 (101 własnych bez Hack Squat i 70 zrecenzowanych zestawów).
6. Karty własne są niepełne: **59/102 nie ma „Częstych błędów”**, 17 jest na liście `partial`. Leg Extension nie ma ustawienia, Rower ma tylko ustawienie, Burpees tylko ruch.
7. Zestawy ogólne są płytkie: **182 z 538 mają jako jedyny błąd ogólne „Szarpanie i rzucanie ciężarem…”** (`mis.jerk`), w tym 31 ćwiczeń bez ciężaru (brzuszki, unoszenie nóg, dipy). W 30 zestawach wskazówka i błąd mówią to samo (BK-05).
8. Forma zestawów ogólnych: zdania ustawienia i ruchu lądują pod nagłówkiem „Wskazówki”, bo zestaw ma tylko `ok`/`err`. Przykłady: Cable Squat dostaje opis ruchu przysiadu, Decline Push Up ustawienie pompki. Widoczne w 1.0 (BK-06).
9. Lokalizacja: **53 z 360 zdań (nowe z 27.10) nie ma w 33 językach.** Aplikacja pokazuje wtedy angielski: w 1.1 dotyczy to 8 widocznych kart. Strona w DE ma **574 z 2225 zdań po angielsku w 222 ćwiczeniach**, wbrew zasadzie z `pages.mjs:2` „bez zastępczych tekstów” (BK-07).
10. Aplikacja i strona się rozjeżdżają (BK-08, BK-09):
    - Strona **nie pokazuje „Asekuracji”**, choć eksport ma pole `recommended`.
    - Strona nie ma linii kąta, zdania o kącie stóp 15–20° ani znaczków ✓/✕.
    - Strona rozcina technikę blokiem mięśni (Ustawienie, Ruch → mięśnie → Wskazówki, Błędy).
    - Strona ma za to „Zamienniki” i „Potrzebny sprzęt”, których karta w aplikacji nie ma.
11. Styl (NISKIE, widoczne w 1.0):
    - „kontrolowanie” jako przysłówek w 3 zdaniach (`bp.move`, `ht.move`, `stepup.move`).
    - Wtrącenie „(neutralne)” w zdaniu używanym przy 48 ćwiczeniach.
    - Dwa rejestry EN: 6 zdań z „do not” i 96 ze średnikiem, obok 55 z myślnikiem i „don’t”.
    - Mieszana forma błędów: 14 rzeczowników odczasownikowych i 16 opisów.
    - „step back a step or two” (`sq.bar`).
12. Oznaczenia wagi są dla użytkownika prawie niewidoczne. Jedyny sygnał to „Ogólne wskazówki dla tego ruchu” (nie mówi, że zdania nie dotyczą tego ćwiczenia wprost). Tempo „Opuszczanie 2 s · Pauza · Wstawanie 1 s” nie ma etykiety „przykładowe”, a „Pauza” jest konwencją. Liczby na karcie (15–20°, sekundy) nie mają wpisów w `rejestr-twierdzen.json`: `check:claims` ich nie widzi (BK-12).
13. Dostępność jest dobra i ma testy: etykiety, `accessibilityLanguage`, 44 pt, zatrzymanie animacji, „Ogranicz ruch”, kontrast palety ≥ 3:1 w 4 motywach. Luki (NISKIE):
    - Etykieta VoiceOver figury v2 to sama nazwa ćwiczenia, a v1 opisywała ruch.
    - Utracony styk (zielony/czerwony) jest oznaczony tylko kolorem (BK-13).
14. Rekomendacja kolejności:
    - (1) Scalić bramkę 4 z main do 1.1 i dopisać recenzje różnic.
    - (2) Ten sam warunek w eksporcie strony, a do tego „Asekuracja” na stronie.
    - (3) Poprawić RDL, zestaw oly i `mis.jerk`.
    - (4) Kampania pokrycia: zrecenzowane zestawy ogólne także bez figury i własne karty dla najczęściej używanych ćwiczeń.
    - (5) Redakcja stylu ze strażnikiem w testach.

## Metoda i polecenia

- Stan kart na ćwiczenie (1.1): sonda jest poza repo uruchomiona na kodzie aplikacji. Polecenie: `npx jest --rootDir /home/user/wt/int --roots <scratch>/jt --testMatch '**/jt/*.test.ts' --maxWorkers=1`. Plik wyników to `stan-int.json` w scratchpadzie. Liczy rodzinę, `figureSpec`, `cueSelection` i kartę własną dla 709 kluczy.
- Eksport strony: `node scripts/strona/eksport.mjs --out <scratch>/eks --langs pl,en,de,es,ja` (wynik: 709 ćwiczeń, `figury.json` = `{}`).
- main: `git show origin/main:lib/cues/data.json`, `…:docs/research/figury-recenzja.json`, `…:lib/figures/data.json`, `…:lib/figures/v2/cue-sets.json`, porównane skryptem node.
- Próbka tekstów: 48 kart własnych (PL+EN w całości) i 40 zestawów ogólnych, po jednym z każdej rodziny (PL+EN). Z 3 innych języków (DE, ES, JA) wyrywkowo 12 identyfikatorów, sprawdzone kettlebell i słownik terminów.
- Pełnego jest i expo export nie uruchamiałem.

---

## 1. Budowa karty w aplikacji

### 1.1 Sekcje, źródło danych, warunek ukrycia

Ekran `app/exercise/[id].tsx` → `Preview` (l. 65–98). Kolejność jak na ekranie:

| # | Sekcja (etykieta) | Komponent:linia | Dane | Kiedy jej nie ma |
|---|---|---|---|---|
| 1 | Nazwa + „Edytuj” | `[id].tsx:71` | `exName` (nazwa EN poza PL, DEC-13) | — |
| 2 | **„Technika”** (zwinięta, chyba że `?cues=1`) | `ExerciseCues.tsx:36–53` | karta własna `lib/cues/data.json` (`cuesFor`, `lib/cues/index.ts:62`) albo zestaw ogólny `lib/figures/v2/cue-sets.json` (`cueSelection`, `cueSets.ts:26`) | brak karty własnej **i** brak figury v2 (`ExerciseCues.tsx:35`). W 1.1 zestaw ogólny tylko przy figurze v2 (`:33`), **bez** warunku recenzji; w main dodatkowo `generalCuesReviewed(key)` (`origin/main:components/ExerciseCues.tsx:33`, `origin/main:lib/cues/index.ts:71`) |
| 2a | „Asekuracja” (widać też po zwinięciu) | `ExerciseCues.tsx:29,42,63–71` | `needsSafety/needsSpotter/needsSpotterDb` (`lib/equipment`, katalog `recommended`) | ćwiczenie bez zalecenia; rejestr T-040/044/045 |
| 2b | Figura v2: 2 widoki, animacja, „Pozycja wyjściowa/końcowa” przy „Ogranicz ruch” | `ExerciseFigureV2.tsx:86–103` | `figureSpec` (`lib/figures/v2/figure.ts:30`) | rodzina nie `ready` (`figure.ts:33`). W 1.1 `ready` mają 4 rodziny: squat, bench_press, hinge, pull_up (`families.ts:27–35`); w main 3 |
| 2b′ | Figura v1 (gdy brak v2) | `ExerciseCues.tsx:44`, `ExerciseFigure.tsx` | `lib/figures/data.json` (71 w 1.1, 68 w main) | brak wpisu v1. W main wpis istnieje tylko po recenzji v1 (`scripts/zrodla-runtime.mjs`), w 1.1 bramki nie ma |
| 2c | Licznik faz z tempem | `ExerciseFigureV2.tsx:104–109` | `TEMPO` (`anim.ts:7`: 2 s / 1 s / pauza 0,5 s) | figura statyczna |
| 2d | „Kąt na rysunku: …” | `:110`, `ui.ts measureLine` | pomiar z pozy | `angleLineShown` |
| 2e | Legenda „Mięśnie główne / pomocnicze”, „Dobór mięśni: przybliżony” | `:111–117`, `ui.ts:47` | `muscleLoad` katalogu, `confidence` | brak danych; „przybliżony” przy 114/709 (w 1.1 widoczne przy 21 z 98 figur v2) |
| 2f | Znaczki ✓/✕ + tekst po dotknięciu | `:44–48,118` | wskazówki ćwiczenia (`badgesFor`, `ui.ts`) | — |
| 2g | „Palce stóp lekko na zewnątrz — zwykle mniej więcej 15–20°.” | `:119`, `ui.ts:55` | stała w kodzie; źródła tylko w main `data/zrodla/wskazowki-ogolne.json` (l. 3935–3947), w 1.1 pliku nie ma | rodzina inna niż squat albo bez błędu „kolana do środka” |
| 2h | „Zatrzymaj animację”, „Pokaż częsty błąd” + wiersz „Częsty błąd: …” | `:120–145` | `errorsOf` (`ui.ts`), `errors.ts` | brak błędów pozy |
| 2i | „Rysunek schematyczny — pozycje orientacyjne.” | `:146` | — | — |
| 2j | „Ogólne wskazówki dla tego ruchu” | `ExerciseCues.tsx:45`, `cueSets.ts:35` | tryb `general` | karta własna |
| 2k | Ustawienie / Ruch / Wskazówki / Częste błędy | `ExerciseCues.tsx:46–49` | jw. Zestaw ogólny ma tylko „Wskazówki” i „Częste błędy” | pusta sekcja znika |
| 2l | Stopka medyczna | `:50` | — | — |
| 3 | Partia, Sprzęt, Dawne nazwy, Co logujesz (ⓘ), Jak liczyć ciężar, Przerwy | `[id].tsx:73–79` | `seed`, katalog | — |
| 4 | „Partie główne (1 seria)”, „pomocnicze (0,5 serii)”, linijka o mięśniu spoza mapy | `:80–82` | `e.muscles` (grupy: „nogi”, „core”…) | — |
| 5 | „Obciążenie partii (z katalogu)” ●●●/●●/● | `:83` | `muscleLoadOf` (regiony, także stabilizacja) | brak `muscleLoad` |
| 6 | „Co robią mięśnie”: mapa i zdania ról | `MuscleRoles.tsx:16–34` | `lib/muscleRoles` (`data/zrodla/role-miesni*.json`) | ćwiczenie własne; mięsień bez pewnej roli → sama barwa |
| 7 | Asysta gumą, Tempo (użytkownika), Notatki, Ostatnie treningi, Postępy, Usuń | `:85–95` | dane użytkownika | — |

Zamienników na karcie nie ma: są tylko w arkuszu zamiany w treningu. Strona je ma (eksport `ALTERNATIVES = 3`).

Uwaga o formie: **mięśnie są na ekranie w 4 postaciach i 2 słownikach**:
- legenda figury (regiony: „czworogłowe”, „barki — przód”),
- partie główne i pomocnicze (grupy: „nogi”, „core”),
- ●●● (regiony, ze „stabilizacją”),
- mapa z rolami.

Na karcie Back Squat jest to ten sam fakt pokazany trzy razy różnymi słowami (ŚREDNIE, forma, widoczne w 1.0).

### 1.2 Pokrycie liczbowe (1.1, sonda)

| Stan | Liczba |
|---|---|
| ćwiczeń | 709 |
| karta własna | 102: 20 z figurą v2, 53 z figurą v1, **29 bez figury** |
| figura v2 widoczna | 98 (squat 25, bench 30, hinge 32, pull_up 11) |
| zestaw ogólny widoczny (z figurą v2) | 78 (w main zrecenzowanych 70: squat/bench/hinge) |
| **z sekcją „Technika”** | **180** |
| **bez żadnej wskazówki** | **529** |
| zestaw ogólny przygotowany, ale ukryty (rodzina `planned`) | 460 |
| `open` (brak 2 zgodnych źródeł) | 69 |
| karty własne z sekcją: ustawienie / ruch / wskazówki / błędy | 93 / 96 / 100 / **43** |

Rodziny o największym udziale ćwiczeń bez techniki w aplikacji: core_floor 44, delt_raise 38, curl 36, mobility_stand 36, triceps 32, pushup_plank 30, plyo 28, olympic 25.

### 1.3 Czego karta nie ma w porównaniu z dobrymi atlasami

| Element atlasu | Stan w karcie | Uwagi / koszt podstaw |
|---|---|---|
| Ustawienie krok po kroku | 1–2 zdania, bez numeracji; w zestawach ogólnych brak sekcji | źródła są (setup ma 93 kart) |
| Przebieg ruchu | jest (96 kart); w zestawach ogólnych wymieszany ze wskazówkami | — |
| Oddech | tylko rozciąganie (`st.breathe`, 56 ćw.), plank i wall sit; przy bojach siłowych **świadomie brak** (`anim.ts:4–5`: źródła sprzeczne) | wg CLAUDE.md wystarczą 2 zgodne źródła szczebla 4 bez wstrzymywania oddechu. Ryzyko: część źródeł zaleca bracing/Valsalvę przy ciężkich bojach, więc trzeba podać część wspólną |
| Zakres ruchu | częściowo we wskazówkach (`sq.depth`, `rdl.depth`, `skull.depthFree`) | — |
| Wersja łatwiejsza / trudniejsza | jednostkowo (`pistol.assist`, `wall` w Wall Sit, Box Jump „zacznij od niskiej skrzyni”) | relacje progresji w katalogu nie istnieją; to wymaga researchu |
| Typowe błędy z obrazem | tylko figury v2 z pozą błędu (98 ćwiczeń w 1.1) | — |
| Dla kogo / poziom trudności | brak pola w katalogu (`docs/research/equipment/catalog.json` ma `confidence`, `pattern`, bez poziomu); jest tylko `niche` | poziom z jednej biblioteki to „jedno źródło” albo konwencja |
| Przeciwwskazania ogólne + odesłanie do specjalisty | tylko ogólna stopka medyczna | wg CLAUDE.md bez porad medycznych; da się dodać najwyżej ostrożne zdania szczebla 2 z odesłaniem |
| Sprzęt potrzebny (konkretny) | aplikacja pokazuje kategorię („sztanga”); `requires` katalogu (np. ławka + stojaki) pokazuje tylko strona | dane już są, bez nowych twierdzeń |
| Mięśnie główne / pomocnicze / stabilizujące | są, aż w 4 postaciach | — |
| Programowanie (serie, powtórzenia) | brak na karcie (jest w generatorze planu, `docs/research/zakresy-powtorzen-cele-2026-10.md`) | zakresy dotyczą celu treningu, nie ćwiczenia, więc na karcie najwyżej odesłanie |
| Zamienniki | brak na karcie (jest w treningu i na stronie) | tanie, kod `swapScore` już jest |

---

## 2. Jakość tekstów

Próbka: 48 kart własnych i 40 zestawów ogólnych (PL+EN), z 33 rodzin; DE/ES/JA wyrywkowo.

Ogólnie: PL brzmi w większości jak trener („Kolana idą w linii palców stóp — nie zapadają się do środka.”, „Ląduj miękko, na ugiętych kolanach.”). Długość jest dobra: mediana PL to 65 znaków, p90 100, maks. 132 (`kb.move`, `kb.setup`). Zdań-duplikatów o różnych id nie ma, a każde id jest używane.

| ID | Znalezisko | Dowód | Waga | Realność | 1.0 |
|---|---|---|---|---|---|
| BK-03 | RDL: pod „Częste błędy” i w wierszu figury błędu „Kolana tylko lekko ugięte — to nie przysiad.”, a figura pokazuje kolana ugięte jak w przysiadzie. Treść błędu jest opisem poprawnej techniki. | `lib/figures/v2/errors.ts:40` (`kneesBent` ← `rdl.knees`); karty RDL (sztanga) i RDL (hantle/linki) w `mistakes`; recenzja main 28.10 dała „wyswietlana” | WYSOKIE (tekst przeczy rysunkowi), pewność 75% | realny: karta RDL → Technika → „Pokaż częsty błąd” | tak |
| BK-04 | Zestaw `oly` przy 9 ćwiczeniach kettlebell/hantel (Kettlebell Snatch, Kettlebell Clean, Dumbbell Clean, Snatch (hantel), One-Arm Kettlebell Clean and Jerk…) mówi o „sztandze” (`oly.close`, `oly.legs`, `oly.mis`). | sonda na `cue-sets.json` i eksporcie (`loadSource` ≠ barbell) | WYSOKIE na stronie (błędne twierdzenie publicznie); w aplikacji niewidoczne (kb_ballistic `planned`) | realny po starcie strony | nie |
| BK-05 | `mis.jerk` „Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu.” przy 184 ćwiczeniach, w 182 jako jedyny błąd. Przy 31 ćwiczeniach bez ciężaru (Bicycle Crunch, Sit Up, Lying Leg Raise, Ring Dips…) „ciężarem” nie pasuje. W 30 zestawach wskazówka powtarza błąd (Hip Adduction: „Ruch płynny… bez szarpania” + „Szarpanie…”). | sonda | ŚREDNIE (ogólnik, analogia bez oznaczenia) | realny na stronie; w aplikacji 1.1 przy 5 zestawach bench (z ciężarem, zdanie pasuje) | częściowo |
| BK-06 | Zestaw ogólny wkłada zdania ustawienia i ruchu do „Wskazówek”: Cable Squat, Belt Squat Machine, Wall Ball (`sq.move`), Decline Push Up (`pushup.setup`), Single Leg Glute Bridge (ruch). Karta własna ma 4 sekcje, ogólna 2. | `ExerciseCues.tsx:33` (`[['tips', sel.ok], ['mistakes', sel.err]]`) | ŚREDNIE (forma, spójność) | realny | tak (squat/hinge/bench) |
| BK-14 | Polecenie zamiast opisu błędu pod „Częste błędy”: `pu.noSwing` „Bez bujania i wymachów nogami.” w 7 zestawach pull_up (Dead Hang, Gironda…). | `cue-sets.json` | NISKIE | realny | nie (pull_up `ready` dopiero w 1.1) |
| BK-15 | Karta Deadlift (hantle) w 1.1: „Odkładaj sztangę tak samo…” (`dl.lower`); Pistol Squat: „Kolana zapadające się do środka.” przy jednej nodze; Lunges ×3: analogia z przysiadu bułgarskiego. W main usunięte (decyzja 1a, `f67c4382`), w 1.1 wracają. | porównanie `lib/cues/data.json` int ↔ main | WYSOKIE (część BK-01) | realny | nie (naprawione w 1.0) |
| BK-16 | Hack Squat EN `lp.hips` „pelvis lifts off the **seat**”: maszyna nie ma siedziska (PL „od oparcia” jest dobrze). Karta w 1.1 widoczna, w main ukryta. | `lib/cues/text/en.json` `lp.hips`; recenzja main | NISKIE | realny | nie |
| BK-17 | „kontrolowanie” jako przysłówek (zamiast „pod kontrolą”) w `bp.move`, `ht.move`, `stepup.move` | `lib/cues/text/pl.json` | NISKIE (do recenzenta lokalizacji) | realny | tak |
| BK-18 | Wtrącenie „Plecy proste (neutralne)” / „straight (neutral)” w `hinge.back` (48 ćwiczeń) i `bd.setup`: dwa terminy naraz, styl podręcznika | jw. | NISKIE | realny | tak |
| BK-19 | Dwa rejestry EN: 6 zdań „do not” (`pallof.noTwist`, `rcrunch.hips`, `run.stride`, `sapd.arms`, `walk.rails`, `wall.breath`) i 96 ze średnikiem, obok 55 z „—” i 22 z „don’t”. Karty Bieg, Pallof, Wall Sit, Straight Arm Pulldown brzmią inaczej niż reszta. | `en.json` | NISKIE | realny | tak |
| BK-20 | Drobne: `sq.bar` EN „step back a step or two”; `rpd.move` PL „Rozciągnij ręce w bok” (raczej „rozłóż”); `wall.*` „(mniejszy kąt w kolanach)” w nawiasie; forma błędów mieszana (14 „Zaokrąglanie…”, 16 „Sztanga odjeżdża…”). | `pl.json`, `en.json` | NISKIE | realny | tak |
| BK-21 | DE `mis.jerk` „Das Gewicht reißen oder schwingen, statt kontrolliert zu bewegen.”: brak dopełnienia („es … zu bewegen”). [DO USTALENIA: native] | `de.json` | NISKIE | realny | tak |
| BK-22 | Wskazówki pod złym zasięgiem, zgłoszone wcześniej i nadal otwarte: `hab.hips` „pracuje tylko noga” przy Hip Adduction (maszyna, obie nogi); `mb.legs` przy slamie (usunięte w 1.1, w main nie). Wysokość w Upright Row poprawiona w 1.1 (`ur.height`). | `wskazowki-2026-10-27.md` (notatki), `cue-sets.json` | NISKIE | realny | częściowo |

Zgodność z rysunkiem: trzy przypadki z `sprzecznosci-tekst-rysunek.md` dotyczą rodzin `planned` (delt_raise, lunge), więc w 1.1 karta pokazuje tekst bez figury v2. Bulgarian Split Squat ma kartę własną, która mówi o grzbiecie stopy, a w v2 lunge rysunek pokazuje palce. Decyzja A albo B jest nadal otwarta; po `ready` lunge będzie widoczna sprzeczność. Do tego RDL (BK-03) w 1.0.

Oznaczenia wagi:
- Uproszczenie, konwencja i jedno źródło nie mają w UI etykiet (decyzja właściciela 23.10, `[id].tsx:51–52`).
- Czytelnik widzi tylko trzy sygnały: „Ogólne wskazówki dla tego ruchu” (EN „General tips for this movement”), „Dobór mięśni: przybliżony” i „Rysunek schematyczny — pozycje orientacyjne.”.
- Pierwsze zdanie nie mówi, że wskazówki pochodzą z ćwiczenia pokrewnego, czyli że to analogia.
- Tempo w licznikach faz wygląda jak zalecenie, a jest ilustracją. „Pauza” (`HOLD_MS`) to konwencja bez źródła (`anim.ts:4`).
- Ocena: ŚREDNIE (BK-12), realny, widoczne w 1.0.

---

## 3. Pokrycie podstawami

| Miara | Wynik | Polecenie / plik |
|---|---|---|
| Odwołania w kartach własnych | 465 odwołań (102 karty); każde ma ≥ 2 organizacje | `data/zrodla/cues.json` (231 źródeł) |
| …z tego z adnotacją „ta sama zasada” (analogia z pokrewnego ćwiczenia) | **12**: Chin Up ×2, Biceps Curl, Hammer Curl, Hack Squat ×2, Incline Bench Press (sztanga), Bench Press (hantle), Face Pull ×4 (ACE High Row) | grep `analog|ta sama zasada` |
| Nowe zdania zestawów (27.10) | 54, wszystkie z ≥ 2 źródłami, status `wdrozony` | `data/zrodla/cues-zestawy.json` |
| Źródła zestawów ogólnych (przypisanie zdania do ćwiczenia-analogii) i kąt stóp 15–20° | **w 1.1 brak pliku**; w main `data/zrodla/wskazowki-ogolne.json` (M1-audytor-generalny-021) | `git show origin/main:data/zrodla/wskazowki-ogolne.json` |
| Ćwiczenia tylko z zestawem ogólnym (analogia) | 538 przygotowanych, 78 widocznych w 1.1 (70 zrecenzowanych w main) | sonda |
| Ćwiczenia z kartą własną | 102 (14%) | jw. |
| „Jedno źródło” w wskazówkach | 0 deklarowanych. Faktycznie, wg kryterium recenzenta main 28.10 (MER2-04: analogia nie liczy się do minimum), poniżej minimum mogą być też wpisy z analogią poza Hack Squat. **[DO USTALENIA]** dla audytu: recenzja main ukryła Hack Squat, ale przepuściła Chin Up, Incline BP i Face Pull z analogią. | `docs/research/figury-recenzja.json` (main) |
| Wpisy w `rejestr-twierdzen.json` związane z kartą | 3 z 46 (T-040, T-044, T-045: asekuracja) | `node -e` na rejestrze |

Wniosek: wskazówki techniki mają podstawy w `data/zrodla/*`, a nie w rejestrze twierdzeń, i jest to zgodne z projektem. **Luka mechanizmu:** liczby wyświetlane na karcie poza zdaniami wskazówek nie są w żadnym rejestrze objętym `check:claims`. Chodzi o „15–20°” (`ExerciseFigureV2.tsx:119`), sekundy faz (`anim.ts:7`) i ewentualnie szablon „Kąt na rysunku”. Zmiana brzmienia albo liczby przejdzie przez kontrolę bez przeglądu (ŚREDNIE, część BK-12).

---

## 4. Spójność aplikacja ↔ strona

Eksport: `scripts/strona/eksport.mjs:131–154`; render: `techniqueatlas/src/pages.mjs:164–195`.

| Element | Aplikacja | Strona | Rozjazd |
|---|---|---|---|
| Kiedy są wskazówki ogólne | tylko przy figurze v2 (`ExerciseCues.tsx:33`), w main dodatkowo po recenzji | **zawsze**, gdy `mode=general` (`eksport.mjs:138`, `pages.mjs:167,183–184`): 537 ćwiczeń | **BK-02 WYSOKIE** |
| Bramka treści | main: `hidden` + `general`; 1.1: brak | brak (figury są bramkowane: `recenzja-figur.mjs`, w 1.1 → 0 figur) | BK-02 |
| Kolejność | figura → dopisek → Ustawienie, Ruch, Wskazówki, Błędy → stopka; mięśnie w figurze i niżej | figura → dopisek → Ustawienie, Ruch → **mięśnie (sylwetka, listy, role)** → Wskazówki, Błędy → Sprzęt potrzebny → Zamienniki → stopka | BK-09 ŚREDNIE |
| Nagłówek „Technika” | jest (przycisk) | eksportowany (`labels.ui.technique`), nieużyty | NISKIE |
| Asekuracja | jest (3 warianty, `ExerciseCues.tsx:68`) | **brak** (`recommended` w eksporcie, nieużyte w `pages.mjs`) | BK-08 ŚREDNIE; przed startem strony traktować jak blokujące (tania naprawa, treść bezpieczeństwa) |
| Linia kąta, kąt stóp 15–20°, znaczki ✓/✕, tekst znaczka | są | brak | NISKIE / ŚREDNIE (15–20° to wskazówka techniki) |
| Figura v1 (53 karty własne) | jest | brak (eksport zna tylko v2) | ŚREDNIE (strona uboższa przy kartach z figurą) |
| Mięśnie | 4 postacie (zob. 1.1) | regiony: główne ≥ 1, pomocnicze 0,5–1, sylwetka, role, „przybliżony” | strona spójniejsza |
| Zamienniki, potrzebny sprzęt | brak na karcie | są | aplikacja uboższa |
| Brak tłumaczenia | angielski (`cueText`, `lib/cues/index.ts:53`) | angielski (`eksport.mjs:93`); `cuesWithoutText` = 0, więc strażnik `build.mjs:52` nic nie widzi | **BK-07 ŚREDNIE** (DE: 574/2225 zdań EN w 222 ćw.) |
| Nazwy ćwiczeń | EN poza PL | EN poza PL, `lang="en"` | zgodne |
| Indeksowanie | — | tylko karty własne kompletne (D1) | zgodne z zamiarem |

Strona nie jest dziś publiczna (`config.json` `indeksowanie: false`, Pages wyłączone, `README.md:5`), więc BK-02, BK-04 i BK-08 to ryzyka startu, a nie błędy w obiegu.

---

## 5. Dostępność karty (kod i testy)

| Punkt | Stan | Dowód |
|---|---|---|
| Nagłówek „Technika”: rola przycisku, `expanded` | ok | `ExerciseCues.tsx:38` |
| Teksty: `accessibilityLanguage`, punkty bez „•” w etykiecie | ok | `:48`; `tests/audit-0.10-lang-ui.test.tsx` |
| Figura: jeden obraz, kontrolki osobno | ok | `ExerciseFigureV2.tsx:88`; `tests/figures-v2-ui.test.tsx:62` |
| Opis figury v2 | **tylko „Rysunek ruchu: {nazwa}”**; v1 podawała opis ruchu (`figures.test.tsx.snap.ios:14`). Fazy, mięśnie i błąd są czytane osobno jako tekst, więc informacja nie ginie, ale obraz nic nie mówi | BK-13 NISKIE |
| Zatrzymanie animacji, „Ogranicz ruch” → pozycje statyczne z podpisami | ok (WCAG 2.2.2) | `:63,93–102,121–126` |
| Znaczki: 44 × 44 pt z etykietą „Wskazówka/Częsty błąd: …” | ok | `:45–47` |
| Kolor jako jedyny nośnik | bieżąca faza: kolor + pogrubienie (ok); legenda: kwadrat + tekst (ok); przełącznik błędu: tekst się zmienia (ok); **utracony styk: tylko zielony/czerwony** (`contacts.ts:71–79`), ale obok jest ✕ i wiersz „Częsty błąd” | NISKIE |
| Kontrast palety figury ≥ 3:1 (jasny, ciemny, HC) | ok, z testem | `tests/figures-v2-engine.test.ts:136` |
| Duży tekst | `maxFontSizeMultiplier = TEXT_SCALE.text = 2` (200%, DEC-10); wysokość figury stała 110–200 pt | `lib/tokens.ts:125` |
| Podpowiedź „Ustawienie, ruch, wskazówki i częste błędy.” także przy zestawie ogólnym, który ma 2 sekcje | NISKIE | `ExerciseCues.tsx:38` |
| Mapa mięśni: odcienie i podpis; tekst w wierszach „Partie…” i w rolach | ok | `MuscleRoles.tsx:24` |
| Strona: skaner axe (S8) i `aria-label` pozycji | ok wg README strony | `README.md:59` |

---

## 6. Znaleziska przekrojowe (bramka i integracja)

**BK-01 (WYSOKIE, realny, 1.0: nie): 1.1 nie ma bramki 4 treści kart.**
- Brak `generalCuesReviewed`, listy `hidden`/`general` w `lib/cues/data.json` i pliku `docs/research/figury-recenzja.json`. Brak też testów `tests/karty-recenzja.test.tsx` i `tests/figury-recenzja.test.tsx` (`ls` → brak).
- Main ma je od `6935d547` i `f67c4382` (28.10). 191 commitów main nie ma w 1.1 (`git log HEAD..origin/main | wc -l`).
- Skutki w 1.1:
  - Hack Squat jest widoczny.
  - Wraca 5 usuniętych zdań (BK-15).
  - Zestaw Decline Close-Grip Bench To Skull Crusher ma znów `skull.upperArm`.
  - Widoczne są 3 figury v1 ukryte w main (Push Press, Pendlay Row, Reverse Lunge).
  - pull_up ma status `ready` i 8 zestawów ogólnych bez wpisu recenzji.
  - 17 zestawów zmienionych w 1.1 (`ur.height`, `skull.depthFree`, `wm.arm`, `hab.hips`, `mb.legs`…) nie ma recenzji.
- Ryzyko scalania: `lib/cues/data.json` i `lib/figures/data.json` to pliki generowane. Przy konflikcie trzeba je wygenerować od nowa (`scripts/zrodla-runtime.mjs`), a nie wybierać jednej strony konfliktu. Po scaleniu skróty (`sha`) zmienionych kart i zestawów się nie zgodzą, więc bramka je ukryje. To bezpieczne, ale zmniejszy pokrycie 1.1, dopóki recenzja nie dopisze wpisów.

---

## 7. Katalog opcji ulepszeń

Koszt: czas pracy agenta / czekanie / czas właściciela / pieniądze. Treść dziedzinowa zawsze wymaga przeczytanych źródeł wg hierarchii (badacz) i **niezależnej recenzji** (rola 06-tresci, autor ≠ recenzent, L-047). Doliczam to w każdej opcji. Narzędzia: 0 zł; przekład przez API to tokeny, rzędu kilku USD [DO USTALENIA].

### O1. Bramka treści w 1.1 (BK-01)
| Opcja | Co | Zysk | Koszt | |
|---|---|---|---|---|
| A | Scalić main → integracja-1-1 teraz; wygenerować dane od nowa; recenzja niezależna różnic 1.1 (pull_up: rodzina i 8 zestawów, 17 zmienionych zestawów, 20 zmienionych figur v1) | jeden mechanizm, 1.1 nie cofa napraw 1.0 | agent 3–5 h (scalenie, regeneracja, konflikty) + recenzja 2–3 h; verify ok. 12 min + CI; właściciel: polecenie scalenia (5 min) | **rekomendacja** |
| B | Przenieść same commity bramki (cherry-pick `6935d547`, `f67c4382` i zależności) | mniejszy zakres scalenia | agent 2–4 h, ryzyko pominięcia zależności (`wskazowki-ogolne.json`, testy); i tak trzeba później scalić całość | |
| C | Zablokować wydanie 1.1 do pełnego scalenia, bez pracy teraz | zero pracy teraz | ryzyko, że rodziny 1.1 dalej powstają bez bramki, a koszt rośnie | |

### O2. Bramka i zakres tekstów na stronie (BK-02, BK-04, BK-07)
| Opcja | Co | Zysk | Koszt | |
|---|---|---|---|---|
| A | Eksport = aplikacja: karta własna spoza `hidden` oraz zestaw ogólny tylko z `generalCuesReviewed` **i** figurą v2; jedna funkcja „model karty” w `lib/` używana przez ekran i eksport, plus test równości | strona nie pokaże niczego, czego nie ma w aplikacji | agent 3–4 h; właściciel: nic | **rekomendacja na start strony** |
| B | Eksport zrecenzowanych zestawów ogólnych także bez figury (strona bogatsza niż aplikacja) | ok. 460 stron z treścią | recenzja ok. 460 przypisań (zob. O3-A) | po O3-A |
| C | Na start tylko karty własne (102) | najmniejsze ryzyko | strona uboga; reszta stron z samymi mięśniami | |
| + | Brakujące tłumaczenie: eksport pomija zdanie i liczy je w `missing` (strona `noindex`), zamiast podstawiać EN | zgodność z `pages.mjs:2` | agent 0,5 h | razem z A |

### O3. Pokrycie: 529 ćwiczeń bez techniki
| Opcja | Co | Zysk | Koszt | |
|---|---|---|---|---|
| A | Zmiana zasady 25.10 (wariant A): zrecenzowany zestaw ogólny pokazywany **także bez figury**; najpierw naprawić BK-04 i BK-05 | +ok. 460 kart, szybko | recenzja niezależna 460 przypisań i 65 zestawów (grupowo, wzorem main: 70 w jednej sesji) ok. 8–12 h agenta, poprawki 3–5 h; właściciel: decyzja produktowa (10 min) | **rekomendacja** |
| B | Czekać, aż rodziny staną się `ready` (figura i tekst razem) | spójność z figurą | zależy od 30+ rodzin, tygodnie; strona i aplikacja długo puste | |
| C | Własne karty (4 sekcje, 2 źródła na zdanie) dla N najczęściej używanych ćwiczeń bez karty (np. 30) | jakość najwyższa | research ok. 0,5–0,8 h na ćwiczenie i recenzja ok. 0,2 h → 20–30 h dla 30 ćwiczeń | **rekomendacja równolegle**, kolejność wg popularności |

### O4. Kompletność kart własnych (59 bez błędów, 17 partial)
| Opcja | Co | Koszt | |
|---|---|---|---|
| A | Research „Częstych błędów” dla 59 kart (2 źródła o tym ćwiczeniu) i braków w 17 partial | 25–35 h + recenzja 5 h | **rekomendacja**, partiami po 10 |
| B | Zostawić; puste sekcje i tak znikają | 0 | karta słabsza od atlasów |

### O5. Styl i terminy (BK-17 do BK-21)
| Opcja | Co | Koszt | |
|---|---|---|---|
| A | Jedna redakcja PL/EN wszystkich 360 zdań przez recenzenta lokalizacji z krótkim przewodnikiem stylu (tryb rozkazujący we wskazówkach, opis błędu jako rzeczownik odczasownikowy, „lędźwie”, bez nawiasów, „don’t”, myślnik zamiast średnika); potem przekład 33 języków przez API i recenzja | agent 4–6 h + przekład 1–2 h + kilka USD; zmiana brzmienia = ponowna recenzja treści (sha) | **rekomendacja** |
| B | Poprawić tylko id z tego raportu (ok. 12) | agent 1 h | |
| C (dodatek) | Strażnik w testach: wzorce zakazane (`kontrolowanie`, `(neutral`, `\bdo not\b`, błąd zaczynający się od „Bez/Nie”) | agent 1 h | **rekomendacja razem z A** (mechanizm, nie postanowienie) |

### O6. Błędy pod złym nagłówkiem i figura błędu (BK-03, BK-14)
| Opcja | Co | Koszt | |
|---|---|---|---|
| A | Nowe id błędów opisujących błąd (np. RDL: „Uginanie kolan jak w przysiadzie.”); `rdl.knees` zostaje wskazówką; `pu.noSwing` → wersja opisowa | badacz 1 h (źródła są te same), recenzja 0,5 h, przekład | **rekomendacja**; to bloker 1.0.x |
| B | Osobne pole „podpis błędu figury” niezależne od listy | agent 2 h, dwa teksty do utrzymania | |

### O7. Ogólny błąd `mis.jerk` (BK-05)
| Opcja | Co | Koszt | |
|---|---|---|---|
| A | Dwa warianty: z ciężarem („Szarpanie ciężarem…”) i bez ciężaru („Ruch z rozpędu zamiast pracy mięśni”); dobór po `loadSource`; usunąć duplikaty wskazówka/błąd | badacz 1–2 h, recenzja 1 h, przekład | **rekomendacja** |
| B | Błędy właściwe dla rodziny (researchowane, np. brzuszki: ciągnięcie głowy rękami) | 10–15 h | etap po A |
| C | Usunąć `mis.jerk` tam, gdzie jest jedynym błędem | 0,5 h; 182 karty bez błędów | |

### O8. Nowe sekcje karty
| Sekcja | Opcja A (rekomendowana) | Opcja B | Koszt A |
|---|---|---|---|
| Potrzebny sprzęt | pokazać `requires` (jak strona) | zostać przy kategorii | agent 1–2 h; bez nowych twierdzeń |
| Zamienniki | 3 zamienniki z `swapScore` na karcie (jak strona) | tylko w treningu | agent 2 h |
| Oddech | tylko przy rodzinach, gdzie 2 źródła szczebla 4 zgadzają się bez wstrzymywania oddechu (rozciąganie, mobilność, cardio, plank); bojów nie ruszać | wszystkie ćwiczenia | badacz 3–5 h + recenzja |
| Łatwiej / trudniej | linki do istniejących ćwiczeń katalogu, tylko z udokumentowaną relacją progresji (np. pompka na podwyższeniu → pompka) | tekstowe progresje | research 8–12 h + recenzja; właściciel: decyzja (zakres) |
| Poziom / dla kogo | **nie teraz**: brak źródeł szczebla ≥ 3 na poziom ćwiczenia; jedna biblioteka = „jedno źródło” | konwencja („podstawowe” = nie `niche`) z nazwaniem konwencji | B: agent 1 h, właściciel: decyzja |
| Przeciwwskazania | zostać przy stopce (bez porad medycznych) | zdania szczebla 2 z odesłaniem przy kilku wzorcach (nad głową, plyometria) | B: badacz 4–6 h, ryzyko Apple 1.4.1 |
| Programowanie | odesłanie do generatora planu, bez liczb na karcie | zakresy na karcie | A: agent 0,5 h |

### O9. Oznaczenia wagi dla użytkownika (BK-12)
| Opcja | Co | Koszt | |
|---|---|---|---|
| A | Dopisek „Ogólne wskazówki dla tego ruchu” z ⓘ (wzorzec 26/27 z docs/32): „Wskazówki wspólne dla ruchów tego typu — nie opisane osobno dla tego ćwiczenia”; przy licznikach faz „Tempo przykładowe” | agent 1–2 h, 35 języków; właściciel: decyzja (zgodność z 23.10) | **rekomendacja** |
| B | Zmienić samo brzmienie, bez ⓘ | 0,5 h | |
| + | Liczby z karty (15–20°, sekundy faz) do `rejestr-twierdzen.json` albo rozszerzenie `check:claims` o te stałe | agent 1–2 h | **rekomendacja** (luka mechanizmu) |

### O10. Kolejność i forma sekcji (BK-06, BK-09, mięśnie ×4)
| Opcja | Co | Koszt | |
|---|---|---|---|
| A | Jeden model karty dla ekranu i strony: Ustawienie → Ruch → Wskazówki → Częste błędy → Mięśnie (jedna lista regionów: główne, pomocnicze, stabilizujące + mapa i role) → Sprzęt → Zamienniki; w zestawie ogólnym zdania mają przypisaną sekcję (`setup/move/tips`), a nie wszystko w `ok` | spójność, krótszy ekran | agent 6–10 h, migracja `cue-sets.json`, testy, E2E (selektory Maestro), właściciel: decyzja wyglądu (10 min) | **rekomendacja** |
| B | Tylko strona dopasowana do aplikacji (bez zmian w aplikacji) | agent 1–2 h | |

### O11. Dostępność (BK-13)
| Opcja | Co | Koszt | |
|---|---|---|---|
| A | Etykieta figury v2: „Rysunek ruchu: {nazwa}. {pierwsze zdanie ruchu}”; utracony styk dodatkowo ✕ | agent 1–2 h | **rekomendacja** |
| B | Zostawić (tekst pod figurą niesie treść) | 0 | |

---

## 8. Pytania do trwającego audytu „wszystkich ćwiczeń i grafik”

1. RDL: czy `rdl.knees` pod „Częste błędy” i w figurze błędu to błąd treści (BK-03)? Potwierdzić i zgłosić jako 1.0.x.
2. Jednolite kryterium analogii: Hack Squat ukryty, a Chin Up, Incline BP, Bench (hantle), Face Pull (ACE High Row) i Biceps/Hammer Curl z „ta sama zasada” przepuszczone. Które spełniają minimum 2 źródeł o tym ćwiczeniu?
3. Zestawy ogólne rodzin `planned`, które eksport już wystawia na stronę (BK-02): w szczególności `oly` przy kettlebell (BK-04), `mis.jerk` bez ciężaru, `hab.hips` przy przywodzeniu na maszynie.
4. Recenzja pull_up (rodzina i zestawy) przed 1.1.
5. Bulgarian Split Squat: wariant A albo B z `sprzecznosci-tekst-rysunek.md`, zanim lunge dostanie `ready`.
6. Front Incline Dumbbell Raise: drugie źródło pozycji (otwarte).

## 9. [DO USTALENIA]

- Czy skróty recenzji main (squat, bench, hinge) zgodzą się z rigami 1.1 po scaleniu. Jeśli nie, strona 1.1 dostanie 0 figur, dopóki recenzja nie zostanie powtórzona.
- Poprawność DE `mis.jerk` (native).
- Koszt przekładu API (USD) dla 53 zdań × 33 języki.
- Nie oglądałem renderów (PNG) kart ani strony. Kolejność i treść oceniłem z kodu i eksportu JSON.
