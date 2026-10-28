# Recenzja lokalizacji: 52 nowe wskazówki techniki PL/EN (27.10.2026)

Recenzent lokalizacji, gałąź `teksty-wskazowek-1-1`, tylko odczyt. Lista: `docs/lokalizacja/zestaw-przekladu-2026-10-27-wskazowki.json` (52 id). Treść jest zgodna z `lib/cues/text/pl.json` i `en.json` (bez rozbieżności).
Kontekst: karta ćwiczenia → „Technika” → punkty w sekcjach „Wskazówki” i „Częste błędy” (`components/ExerciseCues.tsx`, styl callout, tekst się zawija). Wiersz pod animacją: „Częsty błąd: {opis}” (`components/ExerciseFigureV2.tsx:138`). Ćwiczenia dla każdego id ustalono z `lib/figures/v2/cue-sets.json`.
Testów jest/npm nie uruchamiałem (maszyna przeciążona). Ręcznie: żadnych terminów zakazanych PL/EN ze słownika; nazwy źródeł i marek nie występują („kettlebell” to nazwa sprzętu, używana już w PL).
PL to zdania ze źródeł: przy PL proponuję tylko zmiany brzmienia, sens bez zmian.

## Poprawki

| id | język | jest | proponowane | powód | pewność |
|---|---|---|---|---|---|
| ro.back | EN | Hips forward, back flat — don't let your lower back sag. | Hips extended, back flat — don’t let your lower back sag. | (b)(f) Przy kółku „hips forward” można odczytać jako „przesuń biodra do przodu, w stronę kółka”, a to nie to samo co „biodra wypchnięte” (biodra wyprostowane, bez zgięcia). Do tego apostrof (d). | średnia; pytanie do native speakera niżej |
| ro.back | PL | Biodra wypchnięte, plecy proste — nie zapadaj się w dolnej części pleców. | Biodra wypchnięte, plecy proste — nie zapadaj się w lędźwiach. | (b) Aplikacja w tym samym zestawie mówi „lędźwie” (`plank.mis.sag` w wierszu błędu przy tych samych ćwiczeniach, `db.back`). Zdanie wychodzi krótsze i brzmi jak na siłowni. | wysoka |
| cc.ribs | EN | Curl your torso, drawing your ribs down — your hips stay put. | Crunch down, pulling your ribs toward your hips — keep your hips still. | (b) „drawing your ribs down” brzmi jak podręcznik, a „crunch” i „ribs toward your hips” to zwykła wskazówka przy brzuszkach na wyciągu i maszynie. Sens bez zmian: żebra w dół, biodra nieruchomo. Uwaga: przy Machine Crunch (w siadzie) „down” też pasuje. | średnia; pytanie niżej |
| hang.ribs | EN | Ribs down, torso still — curl your pelvis up. | Ribs down, torso still — curl your hips up. | (b) Na siłowni „curl your hips up” mówi się częściej niż „pelvis”. | średnia |
| skull.depthFree | EN | Lower until your hands are just above your forehead or your upper arms start drifting back. | Lower until your hands are just above your forehead — or stop sooner if your upper arms start drifting back. | (b)(f) W obecnym zdaniu „or” jest niejasne: nie wiadomo, który warunek obowiązuje. Sens to „zatrzymaj się przy tym, co nastąpi pierwsze”. Długość podobna. | średnia |
| skull.depthFree | PL | Opuszczaj, aż dłonie będą tuż nad czołem albo ramiona zaczną uciekać w tył. | bez zmian (opcjonalnie: „…tuż nad czołem — albo wcześniej, jeśli ramiona zaczną uciekać w tył.”) | (f) Ta sama niejasność „albo”, choć po polsku mniej razi. Decyzja po stronie badacza, bo zmiana dotyka sensu. | do sprawdzenia przez badacza |
| ur.height | EN | Lead with your elbows — raise them to about shoulder height, hands staying close to your body. | Bring your elbows up to about shoulder height, keeping your hands close to your body. | (b) Konstrukcja „hands staying close” jest niezgrabna. (e) Te same 7 ćwiczeń pokazuje obok `ur.elbows` („Elbows lead the movement…”), więc „Lead with your elbows” powtarza się w dwóch sąsiednich punktach. | wysoka (brzmienie); usunięcie powtórzenia — średnia |
| ur.height | PL | Prowadź łokciami — unoś je mniej więcej do wysokości barków, dłonie blisko ciała. | Unoś łokcie mniej więcej do wysokości barków, dłonie blisko ciała. | (e) To samo powtórzenie, bo obok stoi `ur.elbows` „Łokcie prowadzą ruch…”. Sens bez zmian. | średnia (zgoda badacza) |
| vup.back | EN | Lower back neither arched nor rounded. | Don’t arch or round your lower back. | (b) „neither… nor” to język pisany, a trener powie to w formie polecenia. | wysoka |
| vup.back | PL | Dolna część pleców bez wyginania i bez garbienia się. | Nie wyginaj lędźwi w łuk i nie garb się. | (b) Obecne zdanie jest opisowe i ciężkie. „Lędźwie” jak w innych wskazówkach. | wysoka |
| oly.legs | EN | Arms stay straight for a long time — your legs and hips drive the bar. | Keep your arms straight as long as you can — your legs and hips drive the bar. | (b) Dosłowna kalka „długo proste”. „for a long time” brzmi nienaturalnie. | wysoka |
| oly.legs | PL | Ręce długo proste — sztangę wybijają nogi i biodra. | Ręce proste jak najdłużej — sztangę wybijają nogi i biodra. | (b) „długo proste” czyta się jak „długie i proste”. | wysoka |
| sled.legs | PL | Pchaj nogami — odpychaj się od podłoża krok po kroku. | Pracuj nogami — odpychaj się od podłoża przy każdym kroku. | (b)(f) Idiom „krok po kroku” znaczy „stopniowo”. Do tego „pchaj” nie pasuje do Sled Drag i Backward Drag (sanie się ciągnie). | wysoka |
| sled.legs | EN | Push with your legs — drive off the ground step by step. | Drive with your legs — push hard off the ground with every step. | (b)(f) Ten sam idiom („step by step” = „stopniowo”). „Push” nie pasuje do ćwiczeń z ciągnięciem. | wysoka |
| sled.lean | EN | Lean forward slightly, torso stiff. | Lean forward slightly and keep your torso tight. | (b) Na siłowni mówi się „tight” albo „braced”, a „stiff” sugeruje sztywność ciała, np. przy kontuzji. | średnia |
| bw.squat | EN | Drop into a light squat and hold it for the whole walk. | Sink into a slight squat and hold it for the whole walk. | (b) „light squat” to kalka: po angielsku „light” odnosi się do ciężaru, a głębokość to „slight” albo „shallow”. | wysoka |
| bw.squat | PL | Zejdź do lekkiego przysiadu i utrzymuj go przez cały marsz. | Zejdź do lekkiego przysiadu i trzymaj go przez cały marsz. | (b) „trzymaj” jest bardziej mówione niż „utrzymuj”. Drobiazg. | średnia |
| sb.plane | PL | Pochylaj się tylko w bok — bez skrętu i bez pochylania w przód. | Skłaniaj się tylko w bok — bez skrętu i bez pochylania w przód. | (b) Powtórzenie „pochylaj / pochylania”. „Skłon w bok” to zwykła nazwa ruchu. | wysoka |
| halo.close | PL | Prowadź kettlebell tuż wokół głowy. | Prowadź kettlebell wokół głowy, tuż przy niej. | (b) „tuż wokół” to niezręczne połączenie. | wysoka |
| chop.close | EN | Keep the weight close to your body, head and chest over your hips. | Keep the weight close to your body, with your head and chest over your hips. | (b) Bez „with” zdanie czyta się jak wyliczanka: „close to your body, head and chest”. | wysoka |
| wm.arm | EN | Arm with the weight straight, over your shoulder. | Keep your top arm straight, with the weight over your shoulder. | (b) „Arm with the weight” jest niezgrabne. Przy Double Kettlebell Windmill obie ręce trzymają ciężar, a „top arm” pasuje do sąsiedniego `wm.eyes` („top hand”). | średnia |
| wm.arm | PL | Ręka z ciężarem prosta, nad barkiem. | Górna ręka z ciężarem prosta, nad barkiem. | (f) Przy Double Kettlebell Windmill ciężar jest w obu rękach. „Górna” pasuje do `wm.eyes` („Patrz na górną dłoń”). | średnia (zgoda badacza) |
| tgu.eyes | EN | Eyes on the kettlebell the whole movement. | Keep your eyes on the kettlebell the whole time. | (b) Konstrukcja „the whole movement” bez „through” jest niegramatyczna. | wysoka |
| jump.drive | EN | Jump by extending your hips, knees and ankles, with an arm swing. | Swing your arms and drive through your hips, knees and ankles. | (b) „Jump by extending…” to opis z podręcznika. „Drive through” to język trenera. Sens: wyprost w trzech stawach i zamach rąk. | średnia |
| dyn.mis.jerk | EN | Jerking and swinging with force. | Jerky, forced swinging. | (b) „swinging with force” to kalka „na siłę”, a po angielsku „with force” znaczy „z dużą siłą”, nie „na siłę”. | średnia |
| hext.mis.arch | EN | Your back arches as the leg goes up. | Arching your back as your leg goes up. | (b) Spójność z istniejącymi wierszami błędów (gerund: `ht.mis.arch` „Arching your lower back…”, `curl.mis.elbows` „Letting…”). | średnia |
| rot.mis.elbowAway | EN | Your elbow drifts away from your body. | Letting your elbow drift away from your body. | (b) Spójność: `curl.mis.elbows` „Letting your elbows drift…”, `mis.barAway` „Letting the bar drift…”. | średnia |
| oly.mis | EN | The bar drifts away from your body, or your back rounds. | Letting the bar drift away from your body, or rounding your back. | (b) Ta sama spójność, por. `mis.barAway`, `mis.roundBack`. | średnia |
| hext.range | PL | Unoś nogę tylko tak wysoko, jak utrzymasz plecy bez wyginania. | Unoś nogę tylko tak wysoko, żeby plecy się nie wyginały. | (b) Konstrukcja „jak utrzymasz plecy bez wyginania” jest ciężka. | średnia |
| po.slow | EN | Lower the weight back behind your head slowly, and bring it back over your chest the same way. | Lower the weight behind your head slowly, and bring it back over your chest just as slowly. | (b) Podwójne „back”. „the same way” jest niejasne (ten sam tor czy ta sama prędkość?). (e) Zdanie krótsze. | wysoka |
| po.slow | PL | Opuszczaj ciężar za głowę powoli i tak samo wracaj nad klatkę. | Opuszczaj ciężar za głowę powoli i tak samo powoli wracaj nad klatkę. | (b) „tak samo” jest niejasne, jak w EN. | średnia |
| wr.range | PL | Opuść ciężar, na ile pozwala nadgarstek, potem zegnij go do góry. | Opuść ciężar tak nisko, jak pozwala nadgarstek, potem zegnij nadgarstek w górę. | (b) Niejasne „go”: nie wiadomo, czy chodzi o ciężar, czy o nadgarstek. | średnia |
| smr.tender | EN | On a tender spot, slow down and stay for a moment. | When you hit a tender spot, slow down and hold there for a moment. | (b) „stay for a moment” brzmi jak kalka. „hit a tender spot” i „hold there” mówi się przy rolowaniu. | wysoka |
| smr.tender | PL | Na tkliwym miejscu zwolnij i zostań chwilę. | Gdy trafisz na wrażliwe miejsce, zwolnij i zatrzymaj się na chwilę. | (b) „tkliwy” to słowo medyczne i książkowe. | do sprawdzenia przez badacza (czy „wrażliwe” oddaje „tkliwe”) |
| bp.elbowsMid | EN | …— don't flare them out wide. | …— don’t flare them out wide. | (d) Apostrof prosty, a pozostałe teksty EN mają typograficzny (’, 21 wystąpień). | wysoka |
| st.breathe | EN | Breathe calmly — don't hold your breath. | Breathe calmly — don’t hold your breath. | (d) Jak wyżej. | wysoka |

Poza listą 52 (ten sam problem z apostrofem): `carry.noLean` EN ma „don't”.

Bez uwag w obu językach (26 id): cc.slow, cobra.control, cobra.hips, cobra.mis, dyn.control, hab.hips, hab.mis.high, hang.slow, jump.land, jump.mis.stiff, mb.legs, ohp.mis.lock, oly.back, oly.close, po.arms, rot.elbow, rot.slow, smr.mis.fast, smr.slow, st.mis.force, st.noBounce, tgu.arm, ur.elbows, wm.eyes, wr.forearms, wr.mis.lift.

Uwagi merytoryczne poza brzmieniem (dla badacza, nie dla tłumacza):
- `mb.legs` („Rzucaj… razem z wyrzutem”) jest też przy One-Arm Medicine Ball Slam, gdzie piłkę rzuca się w dół. Czy zdanie pasuje do slamu?
- `hab.hips` („pracuje tylko noga”) jest przy Monster Walk i Lateral Band Walk, gdzie ruszają się obie nogi naprzemiennie. Brzmi akceptowalnie, ale do potwierdzenia.

## Nowe terminy do słownika
- `ledzwie`: PL „lędźwie”, EN „lower back”. Powód: w wskazówkach stoją obok siebie „lędźwie” i „dolna część pleców” (ro.back, vup.back, plank.mis.sag, db.back), więc przy przekładzie na 33 języki dobrze ustalić jeden termin.
- `kettlebell`: PL „kettlebell” (nie „odważnik”), EN „kettlebell”. Powód: termin wchodzi teraz w 3 nowe id (halo.close, tgu.*), a przy przekładzie API grozi „odważnik” albo „girja” w innych językach.

## Pytania do native speakerów (EN)
1. ro.back (ab wheel): czy trener powie „Hips extended, back flat” czy raczej „Don’t pike your hips, back flat”?
2. cc.ribs (cable crunch): czy brzmi naturalnie „Crunch down, pulling your ribs toward your hips” czy lepiej „Curl your ribs down toward your hips”?
3. sled.lean: „keep your torso tight” czy „keep your torso braced”?

Podsumowanie: przeczytane 52 id × 2 języki (104 zdania); poprawek 35 (EN 22, PL 13) w 26 id + 1 zdanie PL do decyzji badacza (skull.depthFree); pytań 3 do native speakerów EN + 4 do badacza (skull.depthFree, smr.tender, mb.legs, hab.hips).
