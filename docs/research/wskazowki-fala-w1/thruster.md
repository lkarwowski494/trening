# Wskazówki techniki — rodzina thruster

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3). Uzupełnienie: druga sesja tego samego dnia (oznaczenia „[sesja 2]”).
Zakres: Thruster (hantle), Kettlebell Thruster, Clean and Press (dziś zestaw ogólny „squat” albo „oly” w `lib/figures/v2/cue-sets.json`).
Status: tylko zebrane dane (polecenie właściciela 02.11.2026) — nic nie jest wdrożone. Metoda jak w docs/research/27 i 33: każde zdanie
w danym ćwiczeniu ma ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji; wariant sprzętu tego samego ćwiczenia liczy się z opisem „(wariant: …)”.

Dostęp: ExRx (403) i web.archive.org nie były używane; strony aplikacji treningowych pominięte. NASM — strony o thrusterze nie znaleziono.

[sesja 2] Szczeble wg rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): ACE (organizacja certyfikująca trenerów, treść firmowana) — 4;
CrossFit (organizacja szkoląca trenerów) — 4; Life Time / Experience Life — magazyn z redakcją, artykuł z autorką i datą, bez recenzji produktów — 4
(warunki a–c spełnione). Wpisy z sesji 1 bez zmian.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Thruster (hantle) | gotowe | ACE #357 „Squat to Overhead Press” (hantle) + CrossFit (sztanga, z opisem wariantu z hantlami) + Life Time (wersja z hantlami) |
| Kettlebell Thruster | gotowe | CrossFit (wariant z kettlebellami opisany wprost) + Life Time (wersja z kettlebellami opisana wprost); uwaga: w `catalog.json` pole `equipment` = „hantle” — do sprawdzenia przez programistę (poza zakresem tego zadania) |
| Clean and Press | otwarte | [sesja 2] ponowne wyszukiwanie (ACE, NASM, ISSA, NSCA, producenci) — brak przeczytanych stron szczebla 4 o tym ćwiczeniu; wyniki to strony aplikacji, portale bez redakcji i serwisy o statusie „otwarte” (np. Muscle & Strength) |

## 2. Dane (propozycja)

```json
{
  "sources": {
    "ace-357": {"org": "ACE", "title": "Squat to Overhead Press (#357)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/", "level": 4},
    "crossfit-thruster": {"org": "CrossFit", "title": "The Thruster (Essentials, 12.04.2019)", "url": "https://www.crossfit.com/essentials/the-thruster", "level": 4},
    "lifetime-thruster": {"org": "Life Time", "title": "How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)", "url": "https://experiencelife.lifetime.life/article/how-to-do-the-thruster/", "level": 4}
  },
  "orgs": {
    "CrossFit": {"name": "CrossFit — Essentials (materiały edukacyjne organizacji szkolącej trenerów)", "level": 4, "kind": "org"},
    "Life Time": {"name": "Life Time — magazyn Experience Life (operator klubów fitness; autorka z certyfikatem trenerskim kettlebell)", "level": 4, "kind": "site"}
  },
  "exercises": {
    "Thruster (hantle)": {
      "setup": [
        {"c": "thruster.dbSetup", "s": [["ace-357", "opis (dumbbells in front of each shoulder)"], ["lifetime-thruster", "Instructions 1 (weight at shoulder height, feet about hip width)"], ["crossfit-thruster", "How to Perform — Set-up (roughly shoulder-width stance; wariant: sztanga, hantle w sekcji wariantów)"]]}
      ],
      "move": [
        {"c": "thruster.move", "s": [["ace-357", "opis (lower into a squat; stand up and at the same time press overhead; return to the shoulders)"], ["lifetime-thruster", "Instructions 2–4 (press overhead as you rise; lower to shoulder height)"]]},
        {"c": "sq.down", "s": [["ace-357", "opis (push back into the hips; push both legs into the ground to stand up)"], ["crossfit-thruster", "Front Squat (pushing hips back and down; heels remain down; wariant: sztanga)"]]}
      ],
      "tips": [
        {"c": "thruster.depth", "s": [["ace-357", "opis (hips below the knees)"], ["lifetime-thruster", "Form Cues — bottom of squat (parallel or below)"], ["crossfit-thruster", "Front Squat (lower than the knees; wariant: sztanga)"]]},
        {"c": "sq.back", "s": [["ace-357", "opis (keep the back straight)"], ["lifetime-thruster", "Instructions 2; Form Cues (chest up, spine neutral)"]]},
        {"c": "thruster.fullExt", "s": [["lifetime-thruster", "Instructions 3 (fully extend through your arms, hips, and knees)"], ["crossfit-thruster", "Finish Position (hips, knees, and arms fully extended; wariant: sztanga)"]]}
      ],
      "mistakes": [
        {"c": "sq.mis.heels", "s": [["crossfit-thruster", "Common Mistakes — Front Squat and Shoulder Press Mechanics (heels lifting)"], ["lifetime-thruster", "Form Cues — feet (keep your heels down)"]]}
      ]
    },
    "Kettlebell Thruster": {
      "setup": [
        {"c": "thruster.kbSetup", "s": [["lifetime-thruster", "Equipment-Specific Versions — Kettlebell (front rack, shoulder height); Instructions 1 (feet about hip width)"], ["crossfit-thruster", "Dumbbell or Kettlebell Thruster (two kettlebells); Set-up (roughly shoulder-width stance)"]]}
      ],
      "move": [
        {"c": "thruster.move", "s": [["lifetime-thruster", "Kettlebell (press the kettlebells straight overhead as you rise); Instructions 4"], ["crossfit-thruster", "How to Perform; Dumbbell or Kettlebell Thruster"]]}
      ],
      "tips": [
        {"c": "thruster.depth", "s": [["lifetime-thruster", "Form Cues — bottom of squat"], ["crossfit-thruster", "Front Squat (lower than the knees)"]]},
        {"c": "thruster.fullExt", "s": [["lifetime-thruster", "Instructions 3"], ["crossfit-thruster", "Finish Position"]]},
        {"c": "ohp.tall", "s": [["lifetime-thruster", "Kettlebell (straight overhead); Form Cues — core (upright chest)"], ["crossfit-thruster", "Overhead Press (press in a straight line to the finish position)"]]}
      ],
      "mistakes": [
        {"c": "sq.mis.heels", "s": [["crossfit-thruster", "Common Mistakes — Front Squat and Shoulder Press Mechanics"], ["lifetime-thruster", "Form Cues — feet"]]}
      ]
    }
  }
}
```

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| thruster.dbSetup | Hantle przy barkach, stopy mniej więcej od szerokości bioder do szerokości barków. | Dumbbells at your shoulders, feet somewhere between hip- and shoulder-width. |
| thruster.kbSetup | Kettlebelle oparte przy barkach, stopy mniej więcej od szerokości bioder do szerokości barków. | Kettlebells racked at your shoulders, feet somewhere between hip- and shoulder-width. |
| thruster.move | Zejdź do przysiadu z ciężarem przy barkach, a wstając, jednym ruchem wypchnij go nad głowę; potem opuść z powrotem do barków. | Squat down with the weight at your shoulders and, as you stand, push it overhead in one move; then bring it back down to your shoulders. |
| thruster.depth | Zejdź co najmniej do równoległego ud. | Go down to at least thighs parallel. |
| thruster.fullExt | Na górze biodra, kolana i ręce są wyprostowane. | At the top, hips, knees and arms are fully straight. |

Istniejące zdania użyte (pasują słowo w słowo): `sq.down`, `sq.back`, `sq.mis.heels` (Thruster hantle), `ohp.tall` (Kettlebell Thruster).
Nie użyte z dzisiejszego zestawu ogólnego: `sq.kneesToes` — tylko CrossFit („knees collapsing inward”), brak drugiego źródła o thrusterze;
`ohp.tall` w Thruster (hantle) — Life Time ma „upright chest”, ale wersja z hantlami opisana jako jednorącz/z odwołaniem; pominięte dla ostrożności.
`fsq.rack`, `fsq.elbows`, `pp.*` — źródła dla innych ćwiczeń (analogia), nie wpisane.

## 4. Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| ace-357 | https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/ | ACE (istniejąca) | 4 | cały opis (akapit bez numerów kroków), sprzęt: hantle |
| crossfit-thruster | https://www.crossfit.com/essentials/the-thruster | CrossFit (nowa; ta sama org co w olympic-jerk.md) | 4 | How to Perform (Set-up, Front Squat, Overhead Press, Finish Position), Common Mistakes (3 punkty), Dumbbell or Kettlebell Thruster |
| lifetime-thruster | https://experiencelife.lifetime.life/article/how-to-do-the-thruster/ | Life Time (nowa) | 4 (sesja 2: potwierdzone wg rozstrzygnięcia z 02.11 — redakcja, autorka, data) | Instructions 1–4, Form Cues, Common Mistakes and Tips, wersje: hantle, kettlebell, sztanga |

## 5. Otwarte

- **Clean and Press** — dziś zestaw ogólny „oly” (`oly.back`, `oly.close`, `ohp.tall`, `oly.mis`). Nie znaleziono dwóch przeczytanych źródeł
  szczebla 4 o tym ćwiczeniu. [sesja 2] Ponowne wyszukiwanie: wyniki to strony aplikacji treningowych (nie są źródłem), portale bez redakcji eksperckiej,
  Muscle & Strength (szczebel „otwarte” wg rozstrzygnięcia z 02.11 — nie liczę) i serwis kursów ogólnych; żadnej strony ACE, NASM, ISSA, NSCA, CrossFit ani
  producenta sztang o połączeniu zarzutu z wyciskaniem. Złożenie karty z kart Power Clean (olympic-clean.md) i wyciskania stojąc = analogia — nie liczę.
  Zgodnie z uzupełnieniem briefu: zdań zestawu ogólnego nie potwierdzono dla tego ćwiczenia — krótsza karta albo brak. **Informacja o zestawie**: `oly.mis`
  („plecy się zaokrąglają…”) i `oly.back` nie mają 2 źródeł nawet dla zarzutów (olympic-clean.md, sekcja 1).
  Kandydaci do sprawdzenia: Eleiko inspire360 (zasoby „Clean” i „Overhead Press — Standing” istnieją osobno; o połączeniu — nieznane),
  materiały NSCA (403 w tej sesji).
- **Kolejność nogi → ręce w thrusterze**: CrossFit, Common Mistakes, „the athlete presses the bar before completing full hip and leg extension”
  (błąd), a ACE #357 mówi „at the same time press the dumbbells overhead”, Life Time „pressing the weight overhead as you rise”. Część wspólna:
  wyciskanie w trakcie wstawania (wpisane jako „wstając, jednym ruchem”); różnica: CrossFit wymaga pełnego wyprostu bioder przed pracą rąk.
  Zdanie o błędzie „za wczesne wyciskanie” — nie wpisane.
- **Zejście do przysiadu, zanim ciężar wróci do barków** (CrossFit, Common Mistakes) — tylko jedno źródło.
- **Kolana do środka** (`sq.mis.kneesIn`, `sq.kneesToes`) — tylko CrossFit dla thrustera.
- **Kettlebell — nadgarstki proste, łokcie pod nadgarstkami** (Life Time, Kettlebell) — tylko jedno źródło.
- **Oddech** (Life Time: wdech przy zejściu, bez wstrzymywania) — jedno źródło; poza tym wymaga 2 zgodnych źródeł wg wyjątku o oddechu.

## 6. Stan

- Zrobione: 3 ćwiczenia przejrzane; 2 gotowe (Thruster hantle, Kettlebell Thruster), 1 otwarte (Clean and Press); 5 nowych zdań; 3 nowe źródła, 2 nowe orgs (CrossFit wspólna z olympic-jerk.md).
  Sesja 2: szczebel Life Time potwierdzony (4); Clean and Press — ponowne wyszukiwanie bez wyniku.
- Zostało: źródła dla Clean and Press (NSCA, gdy dostępne; zasoby Eleiko).
- Pułapka: `catalog.json` — „Kettlebell Thruster” ma `equipment: "hantle"` i `loadMode: "per_dumbbell"` (do zgłoszenia programiście).
