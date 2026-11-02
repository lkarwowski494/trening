# Wskazówki techniki — rodzina `hip_abd_add` (fala W1, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda: brief fali W1 i `docs/research/33-wskazowki-partia2.md` („Metoda”). Każde zdanie ma ≥ 2 przeczytane źródła szczebla 4
z różnych organizacji; żadne przeczytane źródło mu nie przeczy. Bez liczb i bez twierdzeń zdrowotnych.

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Hip Abduction | otwarte | jedyny przeczytany opis maszyny: Western SRS (jedna organizacja); ACE 155 bez opisu (docs/33) |
| Hip Adduction | otwarte | Western SRS opisuje ustawienie wspólne z odwodzeniem, bez ruchu przywodzenia; ACE 104 i HKU opisują wyciąg, nie maszynę |
| Cable Hip Abduction | otwarte | tylko HKU (karta „Cable Hip Abduction”, s. 5); drugie źródło nie znalezione |
| Cable Hip Adduction | otwarte | ustawienie, ruch i „stój prosto” mają 2 źródła (ACE 104, HKU s. 6), ale tylko 1 zdanie z grupy wskazówki/błędy (minimum 2) |
| Lateral Band Walk | **gotowe** | NASM, ACE (2 artykuły), The Prehab Guys |
| Monster Walk | otwarte | źródła różnie definiują ćwiczenie (ACE: chód w bok; inne: krok w przód/skos); strona Physitrack wewnętrznie sprzeczna |
| Band Hip Adduction | otwarte | brak przeczytanego źródła (nie zbadane w tej sesji — patrz „Stan”) |
| Hip Flexion with Band | otwarte | jedno źródło (ACE 6315 „Isometric Standing Hip Flexion” — wersja izometryczna, inna niż ruch); nie zbadane dalej |

## Wpisy do `cues.json` → `exercises`

```json
{
  "Lateral Band Walk": {
    "setup": [
      {"c": "bw.setup", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „Place the mini-band just above your knees (or lower…)”, „feet hip-width apart”"],
        ["ace-pro-5043", "Lateral Band Walks — taśma na podudziach nad kostkami"],
        ["ace-pro-6315", "Monster Walks (wersja: chód w bok) — taśma tuż nad kolanem"],
        ["prehab-tag-lateral-band-walk", "Side Step – Band, On Toes — stopy na szerokość bioder"]
      ]}
    ],
    "move": [
      {"c": "bw.move", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „sidestep in one direction with slow and controlled steps”"],
        ["prehab-tag-lateral-band-walk", "Side Step — duży krok w bok, druga noga powoli dochodzi"],
        ["ace-pro-6315", "Monster Walks — chód w bok, krok zaczyna noga prowadząca"]
      ]}
    ],
    "tips": [
      {"c": "bw.squat", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — „Keep your knees bent … athletic stance (almost a squat)” w trakcie kroków"],
        ["ace-pro-6315", "Monster Walks — „keep a soft bend at the knees”"],
        ["prehab-tag-lateral-band-walk", "Side Step – Band, On Toes — lekko ugięte kolana, mini przysiad"]
      ]},
      {"c": "bw.tension", "s": [
        ["nasm-blog-active-recovery", "Lateral Band Walk — stopy co najmniej na szerokość bioder „to maintain resistance in the band”"],
        ["ace-pro-6315", "Monster Walks — „Maintain resistance with the band”"],
        ["prehab-tag-lateral-band-walk", "Side Step – Knees Straight, Band — „keep that tension as you side step” (wariant: proste kolana)"]
      ]}
    ],
    "mistakes": []
  }
}
```

Uwaga do zestawu ogólnego: obecny zestaw (`cue-sets.json`) ma błąd `mis.jerk` („…rzucanie ciężarem…”) — przy gumie brzmi nietrafnie i żadne
przeczytane źródło nie opisuje tego błędu przy tym ćwiczeniu; w karcie powyżej go nie ma.

## Nowe zdania

| id | PL | EN (propozycja) | Potrzeba |
|---|---|---|---|
| bw.setup | Minigumę załóż nad kolanami albo niżej, nad kostkami; stopy na szerokość bioder. | Put the mini band above your knees or lower, above your ankles; feet hip-width apart. | brak zdania o ustawieniu marszu z gumą |
| bw.move | Zrób krok w bok, a drugą nogę dostaw spokojnie. | Step to the side, then bring the other foot over slowly. | brak zdania o przebiegu ruchu |
| bw.tension | Guma ma być napięta przez cały czas — nie pozwól jej się poluzować. | Keep the band tight the whole time — don't let it go slack. | wspólna wskazówka 3 źródeł; brak istniejącego zdania |

Zdanie istniejące użyte: `bw.squat`.

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| nasm-blog-active-recovery | https://www.nasm.org/resource-center/blog/active-recovery | NASM | 4 | sekcja „Lateral Band Walk”: „sidestep in one direction with slow and controlled steps” |
| ace-pro-5043 | https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/ | ACE | 4 | E. Kovar, 22.09.2014, „Lateral Band Walks” |
| ace-pro-6315 | https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/ | ACE | 4 | E. Kovar, 01.03.2017, „Monster Walks”, „Clam Shells”: „Maintain resistance with the band and keep a soft bend at the knees.” |
| prehab-tag-lateral-band-walk | https://theprehabguys.com/vimeo-tag/lateral-band-walk/ | The Prehab Guys | 4 | „Side Step”, „Side Step – Band, On Toes”, „Side Step – Knees Straight, Band” (opisy skrócone na stronie zbiorczej) |
| ace-104 | https://www.acefitness.org/resources/everyone/exercise-library/104/ | ACE | 4 | Standing Hip Adduction (wyciąg) — tylko w „Otwarte” |
| hku-shsc-legs | https://www.cse.hku.hk/document/exercises-SHSC-GlutesQuadsHipHamstrings.pdf | HKU CSE (nowa org., jak w docs/33) | 4 | s. 5 Cable Hip Abduction; s. 6 (adduction): „Kick the strapped leg inwards, crossing the other leg while keeping a straight posture.” — tylko w „Otwarte” |
| western-hips | https://uwo.ca/campusrec/orientation/equipment_guides/hips_and_glutes.html | Western SRS (nowa org., jak w docs/33) | 4 | „Hip Abductions/Adductions”, „LF Hip and Glute” — tylko w „Otwarte” |

```json
{
  "nasm-blog-active-recovery": {"org": "NASM", "title": "Active Recovery: Benefits, Examples & Best Practices (blog NASM) — Lateral Band Walk", "url": "https://www.nasm.org/resource-center/blog/active-recovery", "level": 4},
  "ace-pro-5043": {"org": "ACE", "title": "Kovar E.: How to Self-Care for the IT Band (ACE, 22.09.2014)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/", "level": 4},
  "ace-pro-6315": {"org": "ACE", "title": "Kovar E.: 8 Hip-strengthening Exercises Using the Versa Loop (ACE, 01.03.2017)", "url": "https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/", "level": 4},
  "prehab-tag-lateral-band-walk": {"org": "The Prehab Guys", "title": "Lateral band walk — Side Step (3 warianty)", "url": "https://theprehabguys.com/vimeo-tag/lateral-band-walk/", "level": 4}
}
```

Uwaga: „Versa Loop” w tytule ACE to nazwa sprzętu z tytułu artykułu — przy integracji można skrócić tytuł.

## Otwarte

- **Hip Abduction** (maszyna) — jedno źródło z opisem (Western SRS: kolana razem, pady przy udach, „Push outwards on the pads with your knees”, powrót z kontrolą). Rozstrzygnie: druga organizacja z opisem maszyny (producent sprzętu: instrukcja/naklejka maszyny; ACE 155 ma tylko wideo).
- **Hip Adduction** (maszyna) — jak w docs/33: opisy przywodzenia dotyczą wyciągu stojąc; Western nie opisuje ruchu przywodzenia na maszynie.
- **Cable Hip Abduction** — HKU s. 5: stań prosto bokiem do wyciągu, mankiet na kostce, „Kick out the strapped leg to the side while keeping a straight posture.” Brak drugiej organizacji (wyszukane strony to serwisy aplikacji albo sklepów — odrzucone).
- **Cable Hip Adduction** — częściowe dane z 2 źródłami: ustawienie (mankiet na kostce, stań bokiem do wyciągu: ACE 104 przygotowanie, HKU s. 6), ruch (noga do środka, przed nogę podporową: ACE 104 krok „directly in front”, HKU s. 6 „crossing the other leg”), wskazówka „stój prosto” (ACE 104 „Keep the back straight”, HKU „straight posture”). Brakuje drugiej wskazówki albo błędu z 2 źródłami („powoli wracaj” — tylko ACE 104). Rozstrzygnie: jedno dodatkowe źródło innej organizacji.
- **Monster Walk** — ACE 6315 nazywa „Monster Walks” chód w bok, a strony Physitrack i wyniki wyszukiwania opisują marsz w przód/skos; strona Physitrack sama sobie przeczy (taśma przy kostkach vs nad kolanami, kolana ugięte vs proste). Najpierw ustalić, który ruch pokazuje figura `bandWalk` dla tego klucza — to pytanie do koordynatora/figur, potem źródła.
- **Band Hip Adduction**, **Hip Flexion with Band** — nie zbadane w tej sesji.
- **Zestawy ogólne (informacja o błędach zestawów):** dla Hip Abduction/Adduction i Cable Hip Abduction/Adduction zestaw zawiera `hab.hips` („Biodra i tułów nieruchomo…”) i `llc.control` — przeczytane źródła potwierdzają tylko „stój prosto / plecy proste”, nie „biodra nieruchomo”; `hab.mis.high` („Noga za wysoko — biodro się przechyla”) — nie znalazłem źródła.

## Dostęp

- ExRx i web.archive.org — nie próbowano (polecenie koordynatora: 403/blokada).
- NASM exercise library: `tube-walking-side-to-side`, `side-lying-hip-abduction` → 404.
- Physitrack „lateral band walks” opisuje inne ćwiczenie (marsz w przód z oporem asystenta) — nie użyto. Physitrack „monster walk with band” — wewnętrznie sprzeczny, nie użyto.
- The Prehab Guys „Monster Walk – Band” — za logowaniem.
- Speediance „cable hip abduction” — brak opisu.
- HKU PDF — tekst w obrazach; przeczytane strony 4–7 jako obraz.
