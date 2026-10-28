# Sanie (Sled Push, Sled Drag (Harness)) — weryfikacja źródeł wskazówek sled.lean, sled.legs i reguły sanki_plecy

Badacz merytoryczny, 28.10.2026. Dane czytane z worktree `/home/user/wt/tresc-plyo-sanie/data/zrodla/` (cues-zestawy.json, linie 530–665; figury-sens.json, linie 6195–6222); brak Basha, więc bez `git show origin/...`. Każdą stronę otwarto przez WebFetch 28.10.2026.

## 1. Źródła: cytat, ćwiczenie, szczebel

| # | Źródło (adres) | Czy cytat jest na stronie | Którego ćwiczenia dotyczy | Szczebel |
|---|---|---|---|---|
| S1 | ISSA, https://www.issaonline.com/blog/post/hockey-workouts-for-lower-body-power, sekcja „Sled Push” | TAK: „Keep your knees bent and hips low, and maintain a slight forward lean.” oraz „Drive through the legs, not the upper body.” | pchanie. O tułowiu, plecach i rdzeniu nic | **4**: organizacja szkoląca i certyfikująca trenerów; wpis bez podanego autora |
| S2 | ACE ProSource 02.2014, https://www.acefitness.org/continuing-education/prosource/february-2014/3676/strongman-training-for-your-clients/ | TAK, ale w dwóch różnych kontekstach. Pod nagłówkiem „Understanding the Lifts” jest „Pulling a heavy sled (or vehicle) trains athletes how to maintain a forward-leaning body position, while producing the strength to push into the ground one leg at a time”. Natomiast „stiff, stable spine” stoi pod nagłówkiem „Using Strongman Lifts in Your Training Environment” i dotyczy **pchania talerza po podłodze** (zamiennik sanek), a nie ciągnięcia sanek | ciągnięcie sanek (bez informacji o pasie czy uprzęży; pochylenie w przód oznacza, że ćwiczący stoi tyłem do sanek). „Stiff, stable spine” dotyczy pchania talerza | **4**: organizacja certyfikująca, materiał do doszkalania; autor Pete McCall, MS, CSCS |
| S3 | BarBend, https://barbend.com/sled-push/, kroki 2–3 | TAK: „lean forward so that your spine is parallel to the ground and your lower back is flat” (krok 2); „Keep your arms locked and begin aggressively driving forward with your legs.” i „Maintain a forward lean and push through the balls of your feet.” (krok 3) | pchanie | **4**: serwis redakcyjny specjalistyczny z polityką redakcyjną; autor Mike Dewar, MS w fizjologii wysiłku, CSCS, trener przygotowania motorycznego NYU |
| S4 | The Gym Group, https://www.thegymgroup.com/exercises/sled-push-and-pull/ | TAK: „Keep your chest up, spine neutral, and core braced.” i „Drive through the lower body and lean forward slightly…” (kroki pchania). „Drive with your legs.” stoi w ogólnej sekcji Form, wspólnej dla pchania i ciągnięcia | pchanie (i ogólnie oba warianty) | **5**: strona sieci siłowni (marketing członkostwa), bez autora i kwalifikacji. **Nie liczy się** do minimum 2 źródeł szczebla 4 |
| S5 | Breaking Muscle, https://breakingmuscle.com/sled-workouts/, „Heavy Sled Drag” | TAK: „Aggressively lean away from the sled as you walk forward by driving through your hip, knee, and ankle one leg at a time.” | ciągnięcie tyłem do sanek, w uprzęży albo z linami na barkach, czyli to samo ćwiczenie co Sled Drag (Harness). O tułowiu i kręgosłupie nic | **4**: serwis redakcyjny; autor Merrick Lincoln, DPT, CSCS, wykładowca kinezjologii |
| S6 | Motra, https://www.motra.com/exercises/sledDrag | TAK: „Lean forward into the harness or grips with neutral spine.”, „Drive through glutes and hamstrings…”, „Keep core tight and chest up throughout the drag.” | ciągnięcie w uprzęży albo za uchwyty | **5 (pomocniczo)**: biblioteka ćwiczeń firmy sprzedającej aplikację, bez autora i kwalifikacji. Formalnie mieści się w „dokumentacji producentów aplikacji”, ale nie opisuje własnego produktu, tylko technikę. Nie traktować jako „uznanego” źródła do minimum 2 |
| S7 | FitMetrics, https://www.fitmetrics.ch/en/exercise/6733d76d71a2c-forward-sled-drag | TAK: „Lean slightly forward with knees bent and core engaged.” | ciągnięcie w uprzęży (pas albo barki) | **5 (pomocniczo)**: jak S6, katalog ćwiczeń aplikacji, bez autora |

**Niezależność:** S1–S7 to różni wydawcy. S2 i S3 mają autorów z tym samym certyfikatem (CSCS), ale publikują u niezależnych wydawców, więc liczą się jako niezależne. Niezależności S6 i S7 nie da się ocenić (anonimowe, szablonowe teksty).

## 2. Werdykt: wskazówka × ćwiczenie

| Wskazówka (część) | Sled Push | Sled Drag (Harness) |
|---|---|---|
| sled.lean: „pochyl się w przód” (kierunek) | **ustalone**: S1 + S3 | **ustalone**: S2 + S5 |
| sled.lean: „**lekko**” | **nieustalone, sprzeczność na szczeblu 4**: S1 mówi „slight”, a S3 „spine parallel to the ground”. Część wspólna: pochylenie w przód; stopień zależy od wariantu i obciążenia | **nieustalone**: S5 mówi „aggressively lean”, S2 nie podaje stopnia; „slightly” jest tylko w S7 (szczebel 5) |
| sled.lean: „tułów sztywny” | **jedno źródło**: S3 („lower back is flat”). S4 to szczebel 5, a S2 („stiff, stable spine”) dotyczy pchania talerza, więc to tylko analogia | **brak źródła szczebla 4** dla tego ćwiczenia: S2 dotyczy pchania talerza, S5 milczy. Zostają S6 i S7 (szczebel 5). Do wyboru: **uproszczenie (analogia z pchania)** albo [OTWARTE] |
| sled.legs: „pracuj nogami, odpychaj się od podłoża” | **ustalone**: S1 („Drive through the legs, not the upper body”) + S3 („driving forward with your legs”, „push through the balls of your feet”) | **ustalone**: S2 („push into the ground one leg at a time”, ciągnięcie) + S5 („driving through your hip, knee, and ankle one leg at a time”) |

Cała wskazówka sled.lean, czyli „Pochyl się lekko w przód, tułów sztywny”, ma pewność swojej najsłabszej części. Dla pchania to „jedno źródło”, dla ciągnięcia „uproszczenie (analogia)”, a nie „ustalone”. Wskazówka sled.legs jest ustalona dla obu ćwiczeń.

## 3. Reguła sanki_plecy (figury-sens.json, kręgosłup neutralny, -20°…10°)

- Kierunek „plecy płaskie / kręgosłup neutralny” przy pchaniu opiera się na jednym źródle (S3). S4 to szczebel 5. ACE (S2) mówi o pchaniu talerza, więc to analogia.
- Przy ciągnięciu ten kierunek ma tylko S6 („neutral spine”, szczebel 5). S7 mówi „core engaged”, czyli nie o kręgosłupie. S5 milczy.
- Oznaczenie „ustalone (kierunek…)” jest więc **nieuzasadnione**. Zgodne z hierarchią byłoby „jedno źródło” przy pchaniu oraz „uproszczenie (analogia z pchania)” przy ciągnięciu. Liczba -20…10 to „uproszczenie (jak hinge)” i jest oznaczona poprawnie.
- Uwaga pochodna, której nie sprawdzałem w kodzie (czytałem tylko dane): reguła sanki_pochylenie ma przedział 10–75° oznaczony jako konwencja, a S3 opisuje pochylenie „spine parallel to the ground”. Jeśli kąt liczy się od pionu, poziomy tułów (~90°) wypada poza przedział. **[OTWARTE]**: trzeba sprawdzić, jak mierzony jest kąt, i czy przedział nie odrzuca pozycji z S3.

## 4. Błędy przypisań w danych

1. sled.lean, pole `src` najwyższego poziomu oraz `cwiczenia["Sled Push"].analogia`: cytat ACE „stiff, stable spine” jest opisany jako „ciągnięcie sanek”, a w artykule dotyczy pchania talerza po podłodze („Using Strongman Lifts in Your Training Environment”). W `figury-sens.json` (sanki_plecy) opis „talerz po podłodze” jest już poprawny.
2. sled.lean / Sled Drag `src`: S6 i S7 stoją jako pełnoprawne źródła, a to szczebel 5. S4 przy Sled Push też jest szczeblem 5.
3. Pole `uwaga` (szczebel źródeł „do potwierdzenia przez badacza”): rozstrzygnięte w tabeli 1. Po zmianie trzeba je zaktualizować.

## 5. Otwarte pytania

- [OTWARTE] Źródło szczebla 4 dla sztywnego lub neutralnego tułowia przy ciągnięciu sanek w uprzęży. Kandydaci do przeczytania: biblioteki ćwiczeń NASM i ACE (sled drag) oraz artykuły NSCA (Strength and Conditioning Journal) o ciągnięciu sanek.
- [OTWARTE] Stopień pochylenia: „lekko” nie ma wspólnego oparcia w źródłach. Brzmienie bez „lekko” zgadza się ze wszystkimi.
- [OTWARTE] Sposób pomiaru kąta w sanki_pochylenie wobec S3 („spine parallel to the ground”).
