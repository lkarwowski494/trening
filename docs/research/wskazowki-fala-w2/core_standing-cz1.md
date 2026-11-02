# Wskazówki techniki — fala W2, rodzina core_standing (część 1)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Tryb: tylko zbieranie danych — nic w `data/`, `lib/`, testach.
Podstawa: wyniki W1 (`core_standing-1.md`, `core_standing-2.md` w katalogu fali W1), szczeble organizacji z rozstrzygnięcia koordynatora linii 1.1
(02.11.2026, z uzupełnieniami 1–3), brief wspólny fali W2. Wszystkie strony przeczytane 02.11.2026 (WebFetch). Strony aplikacji treningowych
pominięte i nienazwane (nie są źródłem). Cytaty — najwyżej jedno krótkie zdanie na źródło.

Zakres tej części: ćwiczenia popularne z grupy „otwarte” W1 (Pallof z obrotem, Cable Russian Twists, Landmine Rotation, Barbell Side Bend)
oraz błąd wnioskowany dla karty „gotowe” bez błędu (Side Bend (hantel)). Pozostałe 9 otwartych — sekcja 5 (stan bez zmian, z powodem).

## 1. Tabela ćwiczeń

| klucz katalogu | stan | zdania | uwagi |
|---|---|---|---|
| Side Bend (hantel) | **gotowe** (karta W1 + 1 błąd) | +1 (`core_standing.sidebend.mis.twist`) | W bloku tylko nowy błąd; `setup`, `move` — z W1 bez zmian |
| Barbell Side Bend | **gotowe** | 3 (`core_standing.sidebend.barSetup`, `core_standing.sidebend.move`, `core_standing.sidebend.mis.twist`) | drugie źródło ustawienia: Fitness Volt (autor ACE, data) |
| Pallof Press With Rotation | **gotowe** | 3 (`pallof.setup`, `core_standing.pallofrot.move`, `core_standing.pallofrot.mis.bentArms`) | drugie źródło obrotu: BarBend (autor ACE-CPT, data); Speediance „4 warunkowo” jak w W1 — patrz pkt 5 |
| Cable Russian Twists | **gotowe** | 5 (`core_standing.cabletwist.setup`, `.move`, `.hips`, `.mis.hipsDrop`, `.mis.bentArms`) | wersja na piłce gimnastycznej (jak w W1); drugie źródło: Fitness Volt (autor ACE, data) obok ACE #65 (wariant bez wyciągu) |
| Landmine Rotation | **gotowe** | 3 (`core_standing.landmine.setup`, `core_standing.landmine.move`, `core_standing.landmine.mis.armsOnly`) | NOWE brzmienia `setup`/`move` (W1 nie wdrożone): bez „szerokiej postawy” i bez „rąk prostych przez cały ruch” — sprzeczność źródeł (pkt 5) |
| Medicine Ball Full Twist | otwarte | 0 | bez zmian: sprawa katalogowa (ćwiczenie w parze), jedno źródło szczebla 4 |
| Bent Press | otwarte | 0 | nie badane w W2 (brak czasu w limicie kontekstu); W1: oba źródła szczebla 5 |
| Kettlebell Figure 8 | otwarte | 0 | nie badane w W2; W1: tylko ACE #382 |
| Seated Barbell Twist | otwarte | 0 | W2: wyszukiwanie wg domen szczebla 4 — opisy sprzeczne co do położenia sztangi (nad głową vs na karku); nic nie przeczytano jako źródło |
| One-Arm High-Pulley Cable Side Bends | otwarte | 0 | nie badane w W2 |
| Weighted Ball Side Bend | otwarte | 0 | nie badane w W2; podejrzenie błędnej figury (W1) |
| Cable Judo Flip | otwarte | 0 | nie badane w W2 |
| Bosu Ball Cable Crunch With Side Bends | otwarte | 0 | nie badane w W2 |
| Spell Caster | otwarte | 0 | nie badane w W2 |

Ćwiczenia gotowe w W1 z błędem (Cable Woodchop, Kettlebell Windmill, Double Kettlebell Windmill) — bez zmian, poza zakresem (b).

### Blok do wdrożenia

```json
{
  "Side Bend (hantel)": {
    "mistakes": [
      {"c": "core_standing.sidebend.mis.twist", "s": [
        ["wniosek", "core_standing.sidebend.move"],
        ["catalyst-497", "opis (biodra i barki „squared off facing forward” — standard; błąd = zaprzeczenie standardu)"]
      ]}
    ]
  },
  "Barbell Side Bend": {
    "setup": [
      {"c": "core_standing.sidebend.barSetup", "s": [
        ["catalyst-701", "opis (sztanga na plecach jak do przysiadu)"],
        ["fitnessvolt-bb-side-bend", "How to → krok 1 („resting it on your shoulders”)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.sidebend.move", "s": [
        ["catalyst-701", "opis („bend the trunk to one side as far as possible and then to the other with a controlled tempo”)"],
        ["fitnessvolt-bb-side-bend", "How to → krok 2–4 („slowly bend to one side”; powrót do pozycji wyjściowej)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.sidebend.mis.twist", "s": [
        ["wniosek", "core_standing.sidebend.move"],
        ["catalyst-701", "opis („your hips and shoulders squared off facing forward” — standard; błąd = zaprzeczenie standardu)"]
      ]}
    ]
  },
  "Pallof Press With Rotation": {
    "setup": [
      {"c": "pallof.setup", "s": [
        ["speediance-pallof-training", "2. Pallof Press with Rotation („Set up exactly as you would for the Standing Cable Pallof Press.”)"],
        ["barbend-pallof-variations", "Rotational Pallof Press (start jak w zwykłym Pallofie)"],
        ["ace-332", "opis (wariant: bez obrotu; wyciąg na wysokości klatki)"],
        ["mullane-2021", "s. 4 (wariant: bez obrotu)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.pallofrot.move", "s": [
        ["speediance-pallof-training", "2. Pallof Press with Rotation (wypchnięcie do wyprostu rąk; „Slowly rotate your upper body away from the machine.”; powrót do środka i do klatki)"],
        ["barbend-pallof-variations", "Rotational Pallof Press (po wypchnięciu „slowly twist your torso away from the anchor”, potem „slowly return to center”)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.pallofrot.mis.bentArms", "s": [
        ["wniosek", "core_standing.pallofrot.move"],
        ["barbend-pallof-variations", "Rotational Pallof Press („Keep your arms long with your elbows soft but not bent.” — standard; błąd = zaprzeczenie standardu)"]
      ]}
    ]
  },
  "Cable Russian Twists": {
    "setup": [
      {"c": "core_standing.cabletwist.setup", "s": [
        ["ace-65", "opis („upper back on the ball”, biodra w górze; wariant: bez wyciągu)"],
        ["fitnessvolt-cable-russian-twist", "Setup (klatka na linii wyciągu na piłce; „extend your arm directly over your chest”, druga dłoń na uchwycie)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.cabletwist.move", "s": [
        ["ace-65", "opis („Twist through the stomach and shoulders”; wariant: bez wyciągu)"],
        ["fitnessvolt-cable-russian-twist", "Execution („Your arms should remain straight and extended in the same position throughout the exercise.”; obrót od wyciągu, powolny powrót)"]
      ]}
    ],
    "tips": [
      {"c": "core_standing.cabletwist.hips", "s": [
        ["ace-65", "opis („with the hips up”)"],
        ["fitnessvolt-cable-russian-twist", "Execution („Keep your hips high”)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.cabletwist.mis.hipsDrop", "s": [
        ["fitnessvolt-cable-russian-twist", "wskazówki („Don't allow your hips and lower body to sink down during the exercise.”)"],
        ["ace-65", "opis („with the hips up” — standard; błąd = zaprzeczenie standardu)"]
      ]},
      {"c": "core_standing.cabletwist.mis.bentArms", "s": [
        ["wniosek", "core_standing.cabletwist.move"],
        ["fitnessvolt-cable-russian-twist", "Execution (ręce proste przez całe ćwiczenie — standard)"]
      ]}
    ]
  },
  "Landmine Rotation": {
    "setup": [
      {"c": "core_standing.landmine.setup", "s": [
        ["barbend-rotational-strength", "Landmine Rotation („Grasp the end of the barbell with both hands”; stopy na szerokość barków, ręce wyprostowane)"],
        ["fitnessvolt-landmine-180", "Setup (stopy ok. na szerokość barków; koniec sztangi oburącz, wstań i wyprostuj ręce przed sobą)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.landmine.move", "s": [
        ["barbend-rotational-strength", "Landmine Rotation (skręt tułowia, sztanga w stronę biodra; powrót do startu; „Repeat, twisting to the other side.”)"],
        ["fitnessvolt-landmine-180", "Movement („Slightly rotate your torso in the direction of the bar as it's pulled down.”; powrót do startu i na drugą stronę)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.landmine.mis.armsOnly", "s": [
        ["wniosek", "core_standing.landmine.move"]
      ]}
    ]
  }
}
```

Uwagi do bloku:
- `core_standing.sidebend.move` w Barbell Side Bend: brzmienie z W1 („Powoli skłoń się w bok, wróć do pionu i skłoń się w drugą stronę.”) — „powoli” ma teraz dwa źródła (Catalyst „controlled tempo”, Fitness Volt „slowly”).
- `core_standing.sidebend.mis.twist` obejmuje skręt i pochylenie w przód. Część „skręt” — wniosek + Catalyst (#497 / #701, standard „squared off facing forward”); część „pochylenie w przód” — wniosek z „skłoń się w bok” (ruch w bok, nie w przód). Jeśli recenzent uzna sumę za zbyt szeroką: wersja tylko „Skręcanie tułowia zamiast skłonu w bok.”
- `core_standing.landmine.mis.armsOnly` — sam wniosek; oba źródła ruchu wymagają obrotu tułowia, żadne nie nazywa tego błędu wprost.
- `core_standing.pallofrot.mis.bentArms` — „łokcie miękkie, ale nie zgięte” (BarBend); rysunek: przy obrocie uchwyt wraca do klatki zamiast zostać na wyprostowanych rękach.
- Zestawy ogólne z `lib/figures/v2/cue-sets.json` (`rt.control`, `plank.brace`, `mis.jerk`, `rt.back`, `sb.plane`, `dyn.control`) NIE wchodzą do tych kart — karta własna je zastępuje; ich podstawy — pkt 5.

## 2. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| core_standing.sidebend.mis.twist | Skręcanie tułowia albo pochylanie go w przód zamiast skłonu w bok. | Twisting or leaning forward instead of bending to the side. |
| core_standing.sidebend.barSetup | Ułóż sztangę na barkach jak do przysiadu i stań prosto. | Set the bar on your shoulders as you would for a squat and stand tall. |
| core_standing.pallofrot.move | Wypchnij uchwyt przed siebie do wyprostu rąk, powoli obróć tułów od wyciągu, wróć do środka i przyciągnij uchwyt do klatki. | Press the handle straight out until your arms are extended, slowly turn your torso away from the cable, come back to the middle and bring the handle back to your chest. |
| core_standing.pallofrot.mis.bentArms | Zginanie rąk w czasie obrotu — uchwyt wraca do klatki za wcześnie. | Bending your arms as you turn, so the handle comes back to your chest too early. |
| core_standing.cabletwist.mis.hipsDrop | Opadanie bioder w czasie obrotu. | Letting your hips sag as you rotate. |
| core_standing.cabletwist.mis.bentArms | Uginanie rąk zamiast obrotu tułowia. | Bending your arms instead of rotating your torso. |
| core_standing.landmine.setup | Chwyć koniec sztangi oburącz, stań w rozkroku na szerokość barków i unieś sztangę przed sobą na wyprostowanych rękach. | Grip the end of the bar with both hands, stand with your feet shoulder-width apart and hold the bar out in front of you on straight arms. |
| core_standing.landmine.move | Obracając tułów, sprowadź koniec sztangi łukiem w dół do biodra, wróć do środka i powtórz na drugą stronę. | Rotate your torso to bring the end of the bar down in an arc toward your hip, come back to the middle and repeat on the other side. |
| core_standing.landmine.mis.armsOnly | Przenoszenie sztangi samymi rękami, bez obrotu tułowia. | Moving the bar with your arms alone, without turning your torso. |

Zdania z W1 użyte bez zmian brzmienia (wprowadzone w `core_standing-1.md`, sekcja 3): `core_standing.sidebend.move`, `core_standing.cabletwist.setup`,
`core_standing.cabletwist.move`, `core_standing.cabletwist.hips`. Zdanie istniejące w `lib/cues/text/pl.json`: `pallof.setup`.
`core_standing.landmine.setup` i `.move` — brzmienia W1 („Stań szeroko…”, „ręce cały czas proste”) ZASTĄPIONE powyższymi (W1 nie wdrożone).
Każde nowe brzmienie wymaga przy wdrożeniu `node scripts/claims.mjs --stub` i przeglądu przed `--rehash`.

## 3. Źródła

| id | adres | organizacja | szczebel i uzasadnienie | miejsce |
|---|---|---|---|---|
| fitnessvolt-bb-side-bend | https://fitnessvolt.com/barbell-side-bends-guide/ | Fitness Volt (Ash, „ACE, MSc”; 11.11.2024) | **4 warunkowo** — uzupełnienie 3: artykuł z autorem z kwalifikacjami w podpisie (certyfikat trenera ACE, MSc nauk o ćwiczeniach) i datą; recenzenta brak (zalecany, nie wymagany); afiliacji na stronie nie znaleziono | How to (kroki 1–4), Common Mistakes |
| fitnessvolt-cable-russian-twist | https://fitnessvolt.com/cable-russian-twists/ | Fitness Volt (M. Magnante, ACE; publ. 16.10.2020, zmiana 11.08.2024) | **4 warunkowo** — jw. (autor z certyfikatem ACE, data); recenzenta brak | Setup, Execution, wskazówki |
| fitnessvolt-landmine-180 | https://fitnessvolt.com/landmine-180/ | Fitness Volt (M. Magnante, ACE; 25.05.2022, zmiana 11.08.2024) | **4 warunkowo** — jw.; ten sam wydawca co dwa wyżej (w jednej karcie nigdy dwa naraz) | Setup, Movement, Common Mistakes |
| barbend-pallof-variations | https://barbend.com/pallof-press-variations/ | BarBend (A. Polish, „NASM-CNC, ACE-CPT, SITA-SIFS”; akt. 20.06.2025) | **4 warunkowo** — artykuł o technice z autorem z certyfikatem trenera i datą; bez znacznika „Expert Verified”; afiliacji w treści nie znaleziono | Rotational Pallof Press |
| barbend-rotational-strength | https://barbend.com/rotational-strength-exercises-build-explosiveness/ | BarBend (S. McLean, „Certified Personal Trainer”; akt. 09.08.2023) | **4 warunkowo** — autor z certyfikatem trenera w podpisie (organizacja certyfikująca nie podana — słabszy punkt), data; bez „Expert Verified” | Landmine Rotation |
| speediance-pallof-training | https://eu.speediance.com/en/blogs/fitness/pallof-press-training | Speediance (Y. Chen, 26.06.2026) | 4 warunkowo (jak w W1: producent własnego wyciągu, autor + data; element marketingu) — do potwierdzenia przez koordynatora | 2. Pallof Press with Rotation |
| catalyst-497, catalyst-701 | jak w W1 (`core_standing-1.md`, sekcja 4) | Catalyst Athletics | 4 | opis |
| ace-65, ace-332 | jak w W1 / `data/zrodla/cues.json` | ACE | 4 | opis |
| mullane-2021 | https://repository.mdx.ac.uk/item/89098 | Mullane, Turner, Bishop, Strength Cond J 43(2) | 3 (jak w `data/zrodla/cues.json`); w W2 strona zwróciła 405 — nie czytano ponownie | s. 4 |
| prehab-pallof-rotation | https://theprehabguys.com/vimeo-video/pallof-press-rotation-band/ | The Prehab Guys (3.04.2024, bez autora) | **5** — uzupełnienie 2: liczy się tylko strona z autorem; tu brak autora, strona z wezwaniami do zakupu programu. Tylko wskazówka | opis (obrót od kotwicy; „Avoid using momentum…”) |
| healthline-landmine | https://www.healthline.com/health/5-landmine-exercises-worth-doing-and-why | Healthline (E. Cronkleton, rec. D. Bubnis; 24.07.2020) | nie dotyczy — artykuł nie ma landmine rotation (przeczytany, odrzucony) | — |

Niezależność: Fitness Volt i BarBend — różni wydawcy; BarBend ≠ Breaking Muscle w tych kartach (Breaking Muscle nieużyty). Autorzy z certyfikatem ACE
nie czynią artykułu „źródłem ACE” — wydawca i redakcja inne, liczone jako niezależne od biblioteki ACE (do potwierdzenia przez koordynatora, jeśli ma inną regułę).

## 4. Różnice między źródłami (część wspólna w kartach)

- **Landmine Rotation:** BarBend — obrót tylnej stopy („pivot with your right foot”) i dynamiczny powrót („explode back”); Fitness Volt — nogi i biodra nie obracają się
  („At no point during the exercise should your lower body turn in either direction.”), ruch powolny, dolna ręka ugięta przy zejściu w bok. W1: Dynamo i Herts (5) — sprzeczne
  co do bioder, „szeroka postawa”. Część wspólna w karcie: chwyt oburącz, rozkrok na szerokość barków, start na wyprostowanych rękach, obrót tułowia z łukiem sztangi do biodra
  i na drugą stronę. Stopy/biodra, tempo i ugięcie rąk — poza kartą [OTWARTE].
- **Pallof z obrotem:** biodra przodem — tylko Speediance; stopy w miejscu — tylko BarBend; zakres obrotu: BarBend „klatka w większości odwrócona”, wyszukiwarka podawała
  20–45° (nieprzeczytane) — poza kartą.
- **Barbell Side Bend:** stopy — Fitness Volt „shoulder-width”, Catalyst nie podaje; plecy proste / „Rounding the Back” — tylko Fitness Volt → poza kartą.

## 5. Otwarte i pytania do koordynatora

- [OTWARTE] **Speediance** — nadal „4 warunkowo” (W1); karta Pallofa z obrotem opiera `pallofrot.move` na Speediance + BarBend. Jeśli koordynator uzna Speediance za 5,
  `pallofrot.move` ma jedno źródło szczebla 4 → karta częściowa/otwarta. Szukać: NFPT/ISSA z autorem, Eleiko Education.
- [OTWARTE] **BarBend — S. McLean** podaje „Certified Personal Trainer” bez nazwy organizacji; jeśli to za mało dla kryterium 4, Landmine Rotation traci drugie źródło (`setup`, `move`).
- [OTWARTE] **Fitness Volt bez recenzenta** — uzupełnienie 3 mówi „najlepiej z nazwanym recenzentem”; przyjąłem, że autor z kwalifikacjami + data wystarcza. Jeśli koordynator wymaga recenzenta,
  Barbell Side Bend wraca do `move` (Catalyst + ISSA wariant) bez `barSetup`, a Cable Russian Twists i Landmine Rotation tracą drugie źródło.
- [OTWARTE] **Landmine Rotation — „Exercise Technique: The Landmine Rotation”** (Allen, Mantei, Wallace; Strength Cond J, doi 10.1519/SSC.0000000000000845) — źródło szczebla 3,
  które mogłoby rozstrzygnąć stopy/biodra; pełny tekst niedostępny (przeglądarka otwartych artykułów pokazała brak tekstu). Nie użyte.
- Zestawy ogólne — możliwe błędy przypisania (dla figur bez karty własnej): `rt.control`/`mis.jerk` przy Landmine Rotation są w sprzeczności z BarBend („explode back”) — tempo
  różni się między źródłami; `chop.close`, `plank.brace` przy Pallofie z obrotem — nie sprawdzane.
- Pozostałe otwarte (Medicine Ball Full Twist, Bent Press, Kettlebell Figure 8, Seated Barbell Twist, One-Arm High-Pulley Cable Side Bends, Weighted Ball Side Bend,
  Cable Judo Flip, Bosu Ball Cable Crunch With Side Bends, Spell Caster) — powody z W1 aktualne; w W2 nie badane (limit kontekstu), poza Seated Barbell Twist (pkt 1).

## Stan

- Zrobione (02.11.2026): 5 ćwiczeń gotowych z błędem (Side Bend (hantel) — tylko nowy błąd; Barbell Side Bend, Pallof Press With Rotation, Cable Russian Twists, Landmine Rotation).
  Błędy: 6 nowych wpisów błędu (4 wnioskowane: `sidebend.mis.twist` ×2 karty, `pallofrot.mis.bentArms`, `cabletwist.mis.bentArms`, `landmine.mis.armsOnly` — razem 5 wpisów wnioskowanych; 1 ze źródeł: `cabletwist.mis.hipsDrop`).
- Zostało: 9 otwartych ćwiczeń (pkt 5).
- Następny krok: Bent Press i Kettlebell Figure 8 — szukać artykułów Fitness Volt/BarBend z autorem i datą (ten sam typ źródła, który zadziałał w W2); Medicine Ball Full Twist — najpierw decyzja katalogowa.
- Pułapki: MDPI 403, preprints.org 403, repozytorium Middlesex 405, PubMed wyszukiwanie „pallof” myli zapytanie; StrengthLog i podobne serwisy to aplikacje (nie źródło); The Prehab Guys — strony wideo bez autora (5).
