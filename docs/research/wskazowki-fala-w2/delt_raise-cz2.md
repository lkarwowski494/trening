# Wskazówki techniki — fala W2, rodzina `delt_raise`, część 2

Data: 02.11.2026. Autor: badacz merytoryczny (agent), grupa G7. Status: **PROPOZYCJA** — nic nie trafiło do `lib/` ani `data/`.
Zakres: ćwiczenia z pliku W1 `docs/research/wskazowki-fala-w1/delt_raise-2.md` (stan po przeliczeniu, sekcja „Korekta szczebli…”).
Ćwiczeń rodziny bez wzmianki w W1 i bez flagi KARTA nie ma: wszystkie 38 pozycji z listy rodziny mają flagę W1 („Barbell Incline Shoulder Raise”
bez flag, ale jest w obu plikach W1 jako „Barbell / Dumbbell / Smith Incline Shoulder Raise”). Machine Lateral Raise i Upright Row ×6 występują
w obu plikach W1 jako „bez zmian — czeka” (Western SRS = 5, docs/33) — zostawione badaczowi części 1 (`delt_raise.md`), nie badane tu.

Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` (rozstrzygnięcia, uzupełnienia 2–3). free-exercise-db = 5 (nie liczy się).
ExRx: 403 (02.11.2026, `CBSeatedLateralRaise`) — nie liczy się. Strony aplikacji treningowych pominięte i nie zapisane.
Wszystkie strony czytane przez WebFetch 02.11.2026; narzędzie zwraca krótkie frazy dosłowne i parafrazy — miejsca podane sekcją lub krokiem.

## 1. Ćwiczenia — stan

| Klucz | Stan | Powód / uwagi |
|---|---|---|
| Kettlebell Halo | **gotowe warunkowo — własna z błędami** | ACE #394 (4) + BarBend „Kettlebell Halo” (4 warunkowo: autorka z datą, instruktorka kettlebell, bez nazwy certyfikatu i bez „Expert Verified” — recenzent ocenia). Ustawienie, ruch, 2 wskazówki, 1 błąd ze źródeł |
| Band Lateral Raise | **gotowe warunkowo — własna z błędami** | Bodylastics (4 dla taśm) + ACE #26 (4) jako **uproszczenie „wariant sprzętu hantle”** — ta sama pozycja ciała i tor ramion; taśma zmienia tylko zakotwiczenie (pod stopami). Część „stań na taśmie” ma jedno źródło szczebla 4 (Bodylastics; The Prehab Guys zgodne, ale strona bez autora = 5) — recenzent ocenia uproszczenie. 3 błędy (2 ze źródeł, 1 wnioskowany) |
| One-Arm Incline Lateral Raise | częściowe (otwarte) | NFPT — teraz 4 (artykuł „Guest” z biogramem autora z kwalifikacjami i datą). Leżenie bokiem na skośnej ławce zmienia ustawienie → zdanie ustawienia potrzebuje własnego 2. źródła; nie znaleziono (trafienia: aplikacje, sklep, autor bez kwalifikacji). Ruch `inc1.move` = NFPT + ACE #26 (uproszczenie) — gotowy do użycia, gdy będzie ustawienie |
| One-Arm Cable Rear Lateral Raise | częściowe (otwarte) | Fitness Volt (4 warunkowo, spełnione: autor PT z datą, aktualizacja przez redaktora ACE-CPT) — ustawienie przy dolnym wyciągu. Drugie niezależne źródło nieznalezione (druga strona Fitness Volt = ta sama organizacja; reszta: aplikacje, sklepy, M&S 403) |
| Cable Seated Lateral Raise | otwarte | definicja niejasna: fedb (5) opisuje siad z pochylonym tułowiem i skrzyżowanymi linkami — bliżej tylnego aktonu niż wersji stojącej; brak źródła szczebla 4 (ExRx 403, reszta: aplikacje) |
| Kettlebell Halo with Overhead Extension | otwarte | jedyne trafienie: Breaking Muscle (5, nigdy niezależne od BarBend); BarBend „Kettlebell Halo” nie opisuje wariantu z prostowaniem (tylko osobne „Pull Over”) |
| Y Raise (hantle) | otwarte | poza v2: stojąc w pochyleniu 45° (`lib/figures/v2/poses/delt_raise.json:15017`); NFPT `?p=4429` to bent-over lateral, nie Y; artykuł z serwisu o zdrowiu przekierowuje na stronę główną; reszta: aplikacje, sieć siłowni (5), The Prehab Guys bez autora (5) |
| Cable Y Raise | otwarte | jak wyżej — brak źródła szczebla 4 |
| Car Drivers | otwarte | trafienia: aplikacje, serwis źródłowy fedb, blogi, M&S (403) — brak szczebla 4 |
| Front Incline Dumbbell Raise, Straight Raises on Incline Bench | otwarte | trafienia: Fitness Volt (tylko zestawienia zamienników — nie technika), sklep, aplikacje |
| Barbell / Dumbbell Front Raise to Overhead | otwarte | bez nowych trafień szczebla 4 (wyszukiwanie W1 + to); ruch nad głowę ≠ zwykłe unoszenie w przód — nie wariant sprzętu |
| Barbell / Dumbbell / Smith Incline Shoulder Raise | otwarte | nie szukano ponownie (limit kontekstu); W1: tylko fedb (5), ExRx 403 |
| Sled Reverse Flye | otwarte | nie szukano (limit kontekstu); W1: tylko fedb (5) |

Razem w zakresie: 17 ćwiczeń; **2 karty własne z błędami** (obie warunkowo — do decyzji recenzenta), 2 częściowe, 13 otwartych.
Karty W1 „własne bez błędów” w moim zakresie: brak (obie takie karty — One-Arm Lateral Raise, Dumbbell Scaption — są w `delt_raise.md`).

## 2. Blok do wdrożenia

### Blok do wdrożenia

```json
{
  "exercises": {
    "Kettlebell Halo": {
      "setup": [
        {"c": "halo.setup", "s": [["ace-394", "opis (hold the kettlebell by the horns, directly in front of the chest)"], ["barbend-kettlebell-halo", "instrukcja krok po kroku: pozycja wyjściowa (bottoms-up by its horns in front of your chest)"]]}
      ],
      "move": [
        {"c": "halo.move", "s": [["ace-394", "opis (over the right shoulder, around and behind the head, over the left shoulder to the chest)"], ["barbend-kettlebell-halo", "instrukcja krok po kroku (over your shoulder; around the back of your head; back over the opposite shoulder)"]]}
      ],
      "tips": [
        {"c": "halo.dir", "s": [["ace-394", "opis (desired number of repetitions, then reverse direction)"], ["barbend-kettlebell-halo", "instrukcja krok po kroku (repeat in the opposite direction)"]]},
        {"c": "halo.torso", "s": [["ace-394", "opis (keep the back straight)"], ["barbend-kettlebell-halo", "błędy formy (try not to bend at all during this move)"]]}
      ],
      "mistakes": [
        {"c": "delt2.haloLean", "s": [["barbend-kettlebell-halo", "błędy formy (try not to bend at all during this move)"], ["ace-394", "opis (keep the back straight) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Band Lateral Raise": {
      "setup": [
        {"c": "blat.setup", "s": [["bodylastics-lateral-raise", "Body Position (stand on the bands; arms at your sides, slightly bent)"], ["ace-26", "Step 1 (dumbbells beside your thighs, elbows straight or slightly bent)"]], "uproszczenie": "wariant sprzętu hantle (Lateral Raise (hantle)) — ta sama pozycja ciała; „stań na taśmie” tylko Bodylastics"}
      ],
      "move": [
        {"c": "lat.move", "s": [["bodylastics-lateral-raise", "Movement (straight out to the sides; lower under control)"], ["ace-26", "Step 3; Step 4"]], "uproszczenie": "wariant sprzętu hantle (Lateral Raise (hantle))"}
      ],
      "tips": [
        {"c": "lat.height", "s": [["bodylastics-lateral-raise", "Movement (until your elbows are at shoulder height)"], ["ace-26", "Step 3 (level with the shoulders)"]], "uproszczenie": "wariant sprzętu hantle (Lateral Raise (hantle))"},
        {"c": "lat.elbows", "s": [["bodylastics-lateral-raise", "Points To Remember (elbows stay higher than your hands)"], ["ace-26", "Step 3 (elbows and upper arms slightly ahead of the forearms)"]], "uproszczenie": "wariant sprzętu hantle (Lateral Raise (hantle))"}
      ],
      "mistakes": [
        {"c": "delt2.handsHigh", "s": [["bodylastics-lateral-raise", "Common Mistake (letting the hands rise above the elbows)"], ["ace-26", "Step 3 (elbows ahead of forearms) — błąd = zaprzeczenie standardu"]], "uproszczenie": "wariant sprzętu hantle (Lateral Raise (hantle))"},
        {"c": "delt2.archBack", "s": [["ace-26", "Step 3 (torso erect, no arching your low back)"], ["bodylastics-lateral-raise", "Body Position (stand tall with your back straight) — błąd = zaprzeczenie standardu"]], "uproszczenie": "wariant sprzętu hantle (Lateral Raise (hantle))"},
        {"c": "delt2.overHeight", "s": [["wniosek", "lat.height"]]}
      ]
    }
  },
  "sources": {
    "ace-394": {"org": "ACE", "title": "Halo (#394)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/394/halo/", "level": 4},
    "barbend-kettlebell-halo": {"org": "BarBend", "title": "Kettlebell Halo (D. Fraiser, akt. 01.11.2023)", "url": "https://barbend.com/kettlebell-halo/", "level": 4},
    "bodylastics-lateral-raise": {"org": "Bodylastics", "title": "Lateral Raise With Flat Bands", "url": "https://bodylastics.com/exercise/lateral-raise-with-flat-bands", "level": 4}
  },
  "orgs": {
    "Bodylastics": {"name": "Bodylastics — biblioteka ćwiczeń producenta taśm oporowych (bodylastics.com; szczebel 4 tylko dla ćwiczeń z taśmami)", "level": 4, "kind": "maker"}
  }
}
```

Uwagi do bloku:
- `ace-26` i org `ACE`, `BarBend` już są w `data/zrodla/cues.json` (linie 3, 203, 388) — nie dodawać ponownie.
- Wpis org `BarBend` (cues.json:204) w nazwie opisuje autora i weryfikację innej strony — przy integracji rozważyć nazwę ogólną.
- Miejsca w BarBend podane opisowo (narzędzie nie podało nagłówków sekcji) — sprawdzić nazwy sekcji przy rehash.
- Halo: szerokość stóp pominięta (ACE „shoulder-width”, BarBend „hip-distance” — różnica). `halo.close` (istnieje w pl.json:139) NIE użyte —
  „tuż przy głowie” nie ma w żadnym z dwóch źródeł (BarBend mówi tylko, by nie opierać kettlebella o ciało).
- Halo: oba źródła opisują halo jako ruch mobilności/rozgrzewki — w tekstach brak twierdzeń o korzyściach i zdrowiu.
- Band Lateral Raise: chwyt pominięty (Bodylastics „palms facing in”; fedb — 5 — „dłonie w dół”).
- Do rozważenia przez koordynatora (poza moim zakresem): `delt2.handsHigh` i `delt2.archBack` mają źródła hantlowe (ace-26) pasujące też do karty
  „Lateral Raise (hantle)” (KARTA, bez błędów) — tam drugim źródłem `handsHigh` byłoby exrx (cues.json:5619, „elbows above or equal to wrists”).

## 3. Nowe zdania (PL + EN)

Istniejące w `lib/cues/text/pl.json`, użyte: `lat.move` (171), `lat.height` (170), `lat.elbows` (169).
Zdania z W1 (nie ma ich w pl.json — wchodzą jako nowe, brzmienie z `delt_raise-2.md` sekcja 3): `halo.setup`, `halo.move`, `halo.dir`, `halo.torso`, `blat.setup`.
Kolizje sprawdzone: prefiks `delt2.` nie występuje w pl.json ani w plikach W1; `halo.*` w pl.json tylko `halo.close`.

| Id | PL | EN (propozycja) |
|---|---|---|
| `halo.setup` | Stań prosto i trzymaj kettlebell za rogi przed klatką piersiową. | Stand tall and hold the kettlebell by the horns in front of your chest. |
| `halo.move` | Prowadź kettlebell wokół głowy: nad jednym barkiem, za głową, nad drugim barkiem i z powrotem przed klatkę. | Circle the kettlebell around your head: over one shoulder, behind your head, over the other shoulder and back to your chest. |
| `halo.dir` | Zrób powtórzenia w jedną stronę, potem tyle samo w drugą. | Do your reps in one direction, then the same number the other way. |
| `halo.torso` | Plecy proste, tułów nieruchomy przez cały ruch. | Keep your back straight and your torso still throughout. |
| `blat.setup` | Stań na taśmie, uchwyty w dłoniach przy udach, łokcie lekko ugięte. | Stand on the band with the handles at your thighs, elbows slightly bent. |
| `delt2.haloLean` | Tułów pochyla się albo wygina, kiedy kettlebell idzie za głowę. | Your torso leans or bends as the kettlebell goes behind your head. |
| `delt2.handsHigh` | Dłonie wyprzedzają łokcie i idą wyżej od nich. | Your hands get ahead of your elbows and rise above them. |
| `delt2.archBack` | Wyginanie lędźwi do tyłu przy unoszeniu. | Arching your lower back as you lift. |
| `delt2.overHeight` | Ramiona idą wyraźnie wyżej niż barki. | Your arms go well above shoulder height. |

Propozycje dla kart częściowych (nie do wdrożenia, czekają na 2. źródło ustawienia):

| Id | PL | EN | Źródła |
|---|---|---|---|
| `inc1.setup` (W1) | Połóż się bokiem na skośnej ławce; hantel w górnej ręce, ręka wyciągnięta przed sobą. | (W1) | nfpt-incline-side-lateral (Starting Position) — jedno źródło |
| `inc1.move` (W1) | Unieś rękę bokiem w górę, potem opuść ją z powrotem przed siebie. | (W1) | nfpt-incline-side-lateral (Movement) + ace-26 Step 3–4 (uproszczenie: ten sam tor względem tułowia) |
| `delt2.cRearSetup` | Stań bokiem do dolnego wyciągu, uchwyt w dalszej ręce; pochyl tułów prawie poziomo. | Stand side-on to a low pulley with the handle in your far hand; hinge until your torso is nearly parallel to the floor. | fitnessvolt-cable-rear-delt (ćw. 5 „Single-arm cable rear delt fly”, ustawienie) — jedno źródło |

Każde nowe zdanie: tłumacz (35 języków), `node scripts/claims.mjs --stub`, po przeglądzie `--rehash`. Teksty bez nazw źródeł.

## 4. Źródła

| Id | Adres | Organizacja | Szczebel i uzasadnienie (co widać na stronie) |
|---|---|---|---|
| ace-394 | https://www.acefitness.org/resources/everyone/exercise-library/394/halo/ | ACE | 4 — precedens ACE (szczeble, kryterium pkt 1); strona bez autora, firmowana przez ACE. Fraza: „Keep the back straight” |
| barbend-kettlebell-halo | https://barbend.com/kettlebell-halo/ | BarBend | 4 warunkowo — autorka Damali Fraiser (instruktorka kettlebell hardstyle, trenerka, autorka), „Last updated November 1st, 2023”; brak „Expert Verified” i nazwy certyfikatu. Kryterium BarBend (szczeble, „Rozstrzygnięcia”): artykuł techniki z autorem i datą — spełnione; „najlepiej Expert Verified” — nie. Fraza: „bottoms-up by its horns in front of your chest” |
| bodylastics-lateral-raise | https://bodylastics.com/exercise/lateral-raise-with-flat-bands | Bodylastics | 4 tylko dla taśm (szczeble, wiersz Bodylastics); bez autora i daty, firmowane przez producenta. Fraza: „Letting the hands rise above the elbows.” (Common Mistake) |
| ace-26 (istnieje) | https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/ | ACE | 4. Przeczytane ponownie: Step 3 „Your elbows and upper arms should rise together and be slightly ahead of your forearms and dumbbells.”; „Maintain your torso erect (no arching your low back)” |
| nfpt-incline-side-lateral | https://nfpt.com/how-to-do-incline-side-lateral-dumbbell-raises/ | NFPT | 4 — podpis „Guest”, ale biogram autora: Robert Bovee, „Certified Master PPT, RTS, ETS, FTS”, trener personalny; „Posted August 11th, 2025”. Spełnia warunek NFPT (szczeble, wiersz NFPT). Rozstrzyga otwarte 1 z W1. Fraza: „Do not shrug your shoulder when raising the dumbbell.” |
| fitnessvolt-cable-rear-delt | https://fitnessvolt.com/cable-rear-delt-exercises/ | Fitness Volt | 4 warunkowo, spełnione — autor Patrick Dale, PT (30 lat praktyki, Training Editor), publ. 13.09.2022, akt. 07.06.2024 (Vidur Saini, ACE-CPT, Senior Editor; nie nazwany recenzentem). Fraza: „Stand side-on to a low pulley machine and hold the cable with your furthest hand.” |

Przeczytane, nie liczą się: The Prehab Guys „Lateral Raise – Band” (theprehabguys.com/vimeo-video/lateral-raise-band/; brak autora, daty 2019/2021 → 5; zgodne:
„Stand on a band to anchor it from one end”, „Avoid shrugging”); UW Medicine „Using a Theraband” (PDF, recenzja kliniczna 09/2024 — szczebel 4, ale nie ma tam
unoszenia bokiem); NFPT `?p=4429` (bent-over lateral, nie Y raise); jedna strona ćwiczenia aplikacji treningowej (nie źródło, nazwy nie zapisuję).
Nieotwarte: ExRx `CBSeatedLateralRaise` (403), ufhealth.org PDF (503), artykuł o Y raise z serwisu o zdrowiu (przekierowanie na stronę główną).

## 5. Otwarte

1. **[OTWARTE] Uproszczenie Band Lateral Raise** — czy recenzent przyjmie ACE #26 (hantle) jako drugie źródło zdań taśmy. Ruch i wskazówki: przekonująco
   (tor ramion ten sam). `blat.setup`: część „stań na taśmie” ma tylko Bodylastics; bez akceptacji — karta otwarta (brak ustawienia).
2. **[OTWARTE] BarBend Halo** — kwalifikacje autorki bez nazwy certyfikatu i bez „Expert Verified”. Bez uznania Kettlebell Halo wraca do jednego źródła (ACE).
3. **[OTWARTE] One-Arm Incline Lateral Raise** — 2. źródło ustawienia (leżenie bokiem na ławce skośnej). Kąt ławki: NFPT 55°, inne trafienia 30–60° (szczebel 5) — bez liczby.
   Wysokość: NFPT „łokieć w linii z barkiem”, fedb „ręka do sufitu” — sprzeczność, tekst bez wysokości. Błąd „unoszenie barku” — tylko NFPT.
4. **[OTWARTE] One-Arm Cable Rear Lateral Raise** — 2. niezależne źródło ustawienia przy dolnym wyciągu (nie Fitness Volt). Do sprawdzenia: ACE #353/#354 (czy
   któraś strona ACE opisuje wersję w pochyleniu), Healthline z nazwanym recenzentem.
5. **[OTWARTE] Y Raise ×2, Car Drivers, Front Incline Dumbbell Raise, Straight Raises on Incline Bench, Front Raise to Overhead ×2, Halo + Extension, Cable Seated
   Lateral Raise** — brak źródła szczebla 4 po wyszukiwaniu (wyniki: aplikacje, sklepy, serwisy szczebla 5, M&S 403). Część tych nazw pochodzi z fedb
   i może nie mieć ustalonej definicji poza nim; do decyzji produktowej (właściciel): ukrycie zestawu wskazówek dla tych pozycji na stałe vs dalsze szukanie.
6. **[OTWARTE] Incline Shoulder Raise ×3, Sled Reverse Flye** — nie szukano w W2 (limit kontekstu).

## Stan

- Zrobione: 17 ćwiczeń przejrzanych; Halo i Band Lateral Raise — karty z błędami (warunkowo); NFPT rozstrzygnięty na 4 (biogram); Fitness Volt (rear cable) = 4.
- Zostało: otwarte 3–6.
- Następny krok: otwarte 4 (strony ACE w pochyleniu), otwarte 6 (Incline Shoulder Raise, Sled Reverse Flye).
- Pułapki: ExRx 403; PDF przez WebFetch przychodzi binarnie — czytać zapisany plik narzędziem Read; strony The Prehab Guys bez autora (5);
  wiele trafień to aplikacje — nie zapisywać ich nazw.
