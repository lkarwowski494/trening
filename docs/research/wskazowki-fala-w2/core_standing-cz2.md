# Wskazówki techniki — fala W2, rodzina core_standing (część 2)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Tryb: tylko zbieranie danych — nic w `data/`, `lib/`, testach.
Podstawa: wyniki W1 (`core_standing-1.md`, `core_standing-2.md` w katalogu fali W1), szczeble organizacji (rozstrzygnięcie koordynatora linii 1.1
z 02.11.2026 z uzupełnieniami 1–3; Fitness Volt i BarBend = 4 tylko artykuł z autorem z kwalifikacjami i datą), brief wspólny fali W2.
Część 1 (`core_standing-cz1.md`) — czytana tylko dla id zdań i źródeł, bez zmian. Wszystkie strony przeczytane 02.11.2026 (WebFetch).
Strony aplikacji treningowych, agregatory i free-exercise-db — pominięte, nienazwane i niezaliczane. Cytaty — najwyżej jedno krótkie zdanie na źródło.

Zakres: Kettlebell Figure 8, One-Arm High-Pulley Cable Side Bends, Bent Press, Cable Judo Flip, Spell Caster, Bosu Ball Cable Crunch With Side Bends,
Weighted Ball Side Bend, Medicine Ball Full Twist (dwa ostatnie — tylko stan źródeł; pytania produktowe z W1 bez zmian) + role mięśni (sekcja 6).

## 1. Tabela ćwiczeń

| klucz katalogu | stan | zdania | uwagi |
|---|---|---|---|
| Kettlebell Figure 8 | **gotowe** | 3 (`core_standing.figure8.setup` — NOWE brzmienie, `core_standing.figure8.move`, `core_standing.figure8.mis.straightLegs`) | drugie źródło: Fitness Volt (M. Magnante, ACE; 06.02.2022) obok ACE #382. Dziś w `cue-sets.json` `{"b":"open"}` |
| One-Arm High-Pulley Cable Side Bends | otwarte | 0 | brak źródła szczebla 4; jedyny artykuł Fitness Volt o skłonie z wyciągiem dotyczy wyciągu DOLNEGO (kierunek obciążenia odwrotny — nie wariant sprzętu) |
| Bent Press | otwarte | 0 | przeczytane trzy opisy — wszystkie szczebel 5 (Breaking Muscle — reguła „zawsze 5”, mimo autora z kwalifikacjami; Fitness Volt — autor bez kwalifikacji trenerskich; Legendary Strength z W1) |
| Cable Judo Flip | otwarte | 0 | jedno źródło szczebla 4 warunkowo (Fitness Volt, Ash, ACE, MSc; 06.12.2024); opisy w innych miejscach (bazy aplikacji) przeczą mu co do wysokości uchwytu |
| Spell Caster | otwarte | 0 | brak jakiegokolwiek źródła szczebla ≤ 4; wyniki — bazy aplikacji i serwis jednoautorski (5), wzajemnie sprzeczne co do ruchu |
| Bosu Ball Cable Crunch With Side Bends | otwarte | 0 | brak źródła szczebla ≤ 4; opisy sprzeczne (leżenie na Bosu / siad / klęk / stanie) — podejrzenie, że figura stojąca nie pasuje (pkt 5) |
| Weighted Ball Side Bend | otwarte (tylko stan źródeł) | 0 | Fitness Volt (Dr. Malik, 22.04.2019) potwierdza leżenie BOKIEM na piłce (wariant bez ciężaru); kwalifikacje autora „MD and fitness expert” — szczebel niepewny; jedno źródło |
| Medicine Ball Full Twist | otwarte (tylko stan źródeł) | 0 | bez zmian względem W1: Intermountain Health (4) + RDX (5); sprawa katalogowa (ćwiczenie w parze) nierozstrzygnięta; w W2 nie szukano dalej |

### Blok do wdrożenia

```json
{
  "Kettlebell Figure 8": {
    "setup": [
      {"c": "core_standing.figure8.setup", "s": [
        ["ace-382", "Starting position (stopy „wider than shoulder-width apart”, kettlebell w lewej ręce, ugięcie kolan i przysiad do ud równolegle do podłogi)"],
        ["fitnessvolt-kb-figure-8", "How to → setup („Stand close to the kettlebell with feet roughly shoulder-width apart.”; ugięcie kolan i zawias w biodrach)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.figure8.move", "s": [
        ["ace-382", "kroki 1–4 (przełożenie kettlebella pod nogą z ręki do ręki, „Complete the figure eight…”, kontynuacja z ręki do ręki)"],
        ["fitnessvolt-kb-figure-8", "How to („Swing the weight between your legs toward the opposite arm and grab the handle using the empty hand.”)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.figure8.mis.straightLegs", "s": [
        ["wniosek", "core_standing.figure8.setup"]
      ]}
    ]
  }
}
```

Uwagi do bloku:
- `core_standing.figure8.setup` — brzmienie W1 („Stań w szerokim rozkroku, ugnij kolana i zejdź w przysiad…”) ZASTĄPIONE: ACE każe stopy szerzej niż barki i przysiad
  do ud równoległych, Fitness Volt — stopy mniej więcej na szerokość barków, ugięcie kolan i zawias w biodrach. Część wspólna: rozkrok na szerokość barków lub szerzej,
  ugięte kolana, biodra w dół i w tył. Głębokość („uda równolegle”) i rodzaj zejścia (przysiad vs zawias) — poza kartą (pkt 5).
- `core_standing.figure8.move` — brzmienie W1 bez zmian; „ósemka” wprost tylko u ACE, Fitness Volt opisuje przełożenie między nogami do drugiej ręki (tytuł i nazwa ćwiczenia: figure 8).
- `core_standing.figure8.mis.straightLegs` — logiczne zaprzeczenie „ugnij kolana i zejdź biodrami w dół i w tył” z `figure8.setup`; na rysunku: tułów pochylony na prostych
  nogach, kettlebell podawany pod nogą. Żadne źródło szczebla 4 nie nazywa tego błędu wprost (Gymreapers „standing too upright” — szczebel 5, tylko wskazówka).
- `core_standing.figure8.mis.hunch` (W1, „garbienie się”) — NADAL otwarte: wprost tylko Fitness Volt („allowing their backs to round”) + Gymreapers (5); ACE nie podaje
  standardu pleców, a polecenie Fitness Volt jest wewnętrznie sprzeczne („with the back flat and rounded”) — nie da się oprzeć zdania „plecy proste” na dwóch źródłach.
- Fitness Volt bez nazwanego recenzenta — przyjęto jak w `core_standing-cz1.md` (autor z kwalifikacjami + data wystarczają). Jeśli koordynator wymaga recenzenta,
  Figure 8 wraca do „otwarte” (tylko ACE).

## 2. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| core_standing.figure8.setup (nowe brzmienie) | Stań w rozkroku na szerokość barków lub trochę szerzej, ugnij kolana i zejdź biodrami w dół i w tył; kettlebell trzymaj w jednej ręce. | Stand with your feet shoulder-width apart or a bit wider, bend your knees and sit your hips down and back, holding the kettlebell in one hand. |
| core_standing.figure8.move (brzmienie W1) | Przekładaj kettlebell pod nogą z ręki do ręki, zataczając ósemkę wokół nóg. | Pass the kettlebell under your leg from hand to hand, tracing a figure 8 around your legs. |
| core_standing.figure8.mis.straightLegs | Schylanie się po kettlebell na prostych nogach. | Bending down for the kettlebell on straight legs. |

Każde nowe brzmienie wymaga przy wdrożeniu `node scripts/claims.mjs --stub` i przeglądu przed `--rehash`. Zdań z `lib/cues/text/pl.json` nie użyto
(`mis.roundBack` dotyczy przyciągania ciężaru — nie pasuje; `plank.brace`, `rt.control` — bez dwóch źródeł dla tych ćwiczeń).

## 3. Źródła

| id | adres | organizacja | szczebel i uzasadnienie | miejsce |
|---|---|---|---|---|
| ace-382 | https://www.acefitness.org/resources/everyone/exercise-library/382/figure-eight/ | ACE („Figure Eight”, #382) | 4 — organizacja certyfikująca trenerów, treść firmowana (bez autora i daty) | Starting position; kroki 1–4 |
| fitnessvolt-kb-figure-8 | https://fitnessvolt.com/kettlebell-figure-8/ | Fitness Volt (M. Magnante, „ACE”; publ. 06.02.2022, zmiana 11.08.2024) | **4 warunkowo** — autor z certyfikatem trenera ACE w podpisie i data; recenzenta brak; afiliacji na stronie nie znaleziono. Uwaga: polecenie „with the back flat and rounded” wewnętrznie sprzeczne — nie używane | How to (setup, przełożenie), Common mistakes |
| fitnessvolt-cable-side-bend | https://fitnessvolt.com/?p=71212 | Fitness Volt (M. Magnante, ACE; 14.10.2020) | 4 warunkowo, ale **nie dotyczy** High-Pulley — wyciąg dolny („Attach a single-grip handle to a low cable pulley.”) | — |
| fitnessvolt-cable-judo-flip | https://fitnessvolt.com/cable-judo-flip-guide/ | Fitness Volt (Ash, „ACE, MSc”; 06.12.2024) | 4 warunkowo — autor z kwalifikacjami, data; recenzenta brak. Jedyne źródło ≤ 4 dla Judo Flip | setup (wyciąg najniżej, bokiem, uchwyt oburącz ok. na wysokości barków), ruch (obrót do wyciągu, obrót na tylnej stopie), błędy |
| fitnessvolt-bent-press | https://fitnessvolt.com/bent-press/ | Fitness Volt (V. Vukas; 23.05.2024) | **5** — autor opisany jako student wydziału sportu i założyciel bloga, bez certyfikatu trenerskiego (warunek „autor z kwalifikacjami” niespełniony) | kroki 1–5, Common mistakes |
| breakingmuscle-bent-press-marker | https://breakingmuscle.com/how-to-do-a-proper-bent-press-with-a-kettlebell-or-barbell/ | Breaking Muscle (C. Marker, PhD, CSCS, StrongFirst Senior Instructor; akt. 14.07.2023) | **5** — reguła szczebli: Breaking Muscle zawsze 5 i nigdy niezależne od BarBend, niezależnie od autora | rack, stopy, „get under the weight and not press it out”, wzrok na ciężarze |
| fitnessvolt-ball-side-bend | https://fitnessvolt.com/?p=37671 | Fitness Volt (Dr. Malik, „MD and fitness expert”; 22.04.2019) | niepewny (4 warunkowo albo 5) — kwalifikacja lekarska bez kwalifikacji trenerskich i bez recenzenta; artykuł starszy (polityka redakcyjna ostrzega przed starszymi tekstami). Bez wpływu na stan: jedyne źródło | krok 1 („Lie on the stability ball so that you're on your side.”); wariant bez ciężaru |
| intermountain-mb-partner | jak w W1 (`core_standing-1.md`, sekcja 4) | Intermountain Health | 4 (uzupełnienie 2) | Back-to-back pass off |

Niezależność: w karcie Figure 8 jedno źródło Fitness Volt + ACE — różni wydawcy; certyfikat ACE autora nie czyni artykułu „źródłem ACE” (jak w cz1, do potwierdzenia przez koordynatora).

## 4. Różnice między źródłami

- **Kettlebell Figure 8:** ACE — stopy szerzej niż barki, przysiad do ud równoległych, ruch w przysiadzie przez całą serię; Fitness Volt — stopy ok. na szerokość barków,
  zawias w biodrach z ugiętymi kolanami; wariant „squat” Fitness Volt wstaje po każdym przełożeniu. Część wspólna w karcie: rozkrok ≥ szerokość barków, ugięte kolana,
  biodra w dół i w tył, przekładanie z ręki do ręki pod nogą. Głębokość, wstawanie między powtórzeniami — poza kartą.
- **Cable Judo Flip:** Fitness Volt — wyciąg najniżej, uchwyt na wysokości barków, obrót w stronę wyciągu z obrotem na tylnej stopie; bazy aplikacji (nie źródło) — uchwyt
  na wysokości pasa. Kierunek ruchu przy wyciągu dolnym i uchwycie na wysokości barków nie jest jasny (opis może zawierać błąd) — nie wdrażać na jednym źródle.

## 5. Otwarte i pytania do koordynatora

- [OTWARTE] **Kettlebell Figure 8 — plecy:** „garbienie się” (`figure8.mis.hunch`) ma jedno źródło szczebla 4 (Fitness Volt) — potrzebne drugie (ISSA, NFPT z autorem, BarBend z autorem).
- [OTWARTE] **One-Arm High-Pulley Cable Side Bends:** brak źródła szczebla 4; źródła wyciągu dolnego nie są wariantem (kierunek siły odwrotny — przy wyciągu górnym obciążenie
  ściąga tułów w stronę ręki z uchwytem od góry). Zestaw ogólny `sb.plane`, `dyn.control`, `mis.jerk` — bez przeczytanego źródła dla tego ćwiczenia.
- [OTWARTE] **Bent Press:** wszystkie przeczytane opisy — szczebel 5. Kierunkowo zgodne (Marker/Breaking Muscle, Vukas/Fitness Volt, W1: Abbott, Christopher): kettlebell
  na barku, odchylenie tułowia w bok i w dół pod ciężar, ręka prostuje się bez wyciskania, wstanie z ciężarem nad głową, wzrok na ciężarze. To wskazówka, nie podstawa.
  `wm.eyes` w zestawie ogólnym („patrz na górną dłoń”) — wspierają je tylko źródła szczebla 5. Kandydat: organizacja szkoląca instruktorów kettlebell (StrongFirst) — w wynikach tylko forum
  (społeczność bez redakcji = 5); artykułu na stronie organizacji nie znaleziono. Książka D. Whitleya „Taming the Bent Press” — nieprzeczytana (zakup), szczebel autora do oceny.
- [OTWARTE] **Cable Judo Flip:** jedno źródło szczebla 4 warunkowo; dodatkowo wątpliwy opis (pkt 4). Zestaw ogólny `rt.control`, `plank.brace` — Fitness Volt mówi o kontrolowanym
  skręcie i napiętym brzuchu (jedno źródło); `mis.jerk` — niepotwierdzony.
- [OTWARTE] **Spell Caster:** brak źródła; sprzeczne opisy (zamach hantlami w poprzek ciała / skłon w bok / zawias). Przed szukaniem dalej: ustalić, który ruch oznacza pozycja katalogu
  (sprawa katalogowa — opis ruchu w katalogu, nie źródło).
- [OTWARTE] **Bosu Ball Cable Crunch With Side Bends:** brak źródła; opisy w bazach (nie źródło) mówią o leżeniu na Bosu, siadzie albo klęku — **pytanie do koordynatora/recenzji figur:**
  czy przypisanie do rodziny `core_standing` (figura stojąca) jest poprawne.
- [OTWARTE] **Weighted Ball Side Bend:** przeczytany opis (Fitness Volt, Dr. Malik) potwierdza leżenie bokiem na piłce — wzmacnia podejrzenie z W1, że zestaw ogólny `sideBend`
  (skłon stojąc) i figura stojąca są błędnym przypisaniem. Ciężar (talerz przy głowie) — tylko serwis jednoautorski (5). Pytanie produktowe z W1 bez zmian.
- [OTWARTE] **Medicine Ball Full Twist:** stan źródeł bez zmian (Intermountain 4 + RDX 5; ćwiczenie w parze); sprawa katalogowa z W1 do decyzji analityka/właściciela.

## 6. Role mięśni (Bent Press, Kettlebell Figure 8, Spell Caster)

Wiersze bez `role` z W1 (`role/core_standing.md`, wiersze 28, 32, 33). Szukano badań EMG tych ćwiczeń (PubMed/wyszukiwarka, 02.11.2026): **żadnego nie znaleziono**.
Najbliższe wyniki (wyciskanie kettlebella nad głowę, swing/clean/snatch) znam tylko ze streszczenia wyszukiwarki — nie są przeczytanym źródłem i dotyczą innych ruchów; nie użyte.

| wiersz (ćwiczenie, mięsień) | proponowana funkcja / reguła | źródła (miejsce, szczebel) | status |
|---|---|---|---|
| Bent Press, obliques (main) | — | brak badania; opisy techniki (szczebel 5) mówią o odchyleniu tułowia, nie o pracy mięśni | otwarte |
| Bent Press, front_delt (main) | — | jw.; opisy podkreślają, że ręka NIE wyciska („not press it out” — Breaking Muscle, 5) — zgięcie barku jako główna praca niepewne | otwarte |
| Bent Press, triceps (aux) | — | jw.; prostowanie łokcia wynika z ruchu tułowia pod ciężar, nie z wyciskania (5) | otwarte |
| Bent Press, side_delt (aux) | — | brak | otwarte |
| Kettlebell Figure 8, obliques (main) | — | brak badania; ACE #382 nie podaje mięśni („Full Body/Integrated”) | otwarte |
| Kettlebell Figure 8, lower_back (aux) | — | brak badania; analogia do zawiasu biodrowego — „uproszczenie”, bez źródła roli | otwarte |
| Kettlebell Figure 8, hamstrings (aux) | — | jw. | otwarte |
| Spell Caster, front_delt (aux) | — | brak źródła techniki szczebla ≤ 4 — ruch ramion nieustalony | otwarte |

Następny krok dla ról: dopiero po ustaleniu karty techniki (Bent Press, Spell Caster) i znalezieniu badania EMG (czasopisma NSCA/JSCR, nazwy „bent press”, „kettlebell figure eight”).

## Stan

- Zrobione (02.11.2026): 8 ćwiczeń zbadanych; 1 gotowe (Kettlebell Figure 8 — 3 zdania, 1 błąd wnioskowany), 0 częściowych, 7 otwartych (2 z nich — tylko stan źródeł).
  Role: 8 par sprawdzonych, 0 gotowych.
- Zostało: drugie źródło szczebla 4 dla Judo Flip i „pleców” w Figure 8; jakiekolwiek źródło 4 dla Bent Press, High-Pulley, Spell Caster, Bosu; sprawy katalogowe (Bosu, Weighted Ball, Medicine Ball, Spell Caster).
- Następny krok: decyzje koordynatora z pkt 5 (przypisanie rodziny/figury Bosu i Weighted Ball; ruch Spell Caster); potem szukać ISSA/NFPT/BarBend z autorem.
- Pułapki: wyszukiwarka zwraca głównie bazy aplikacji (nie źródło); Fitness Volt — sprawdzać autora każdego artykułu (Bent Press: autor bez kwalifikacji; Weighted Ball: MD bez kwalifikacji trenerskich);
  strony „alternatives” Fitness Volt to zestawienia, nie technika; StrongFirst w wynikach tylko jako forum.
