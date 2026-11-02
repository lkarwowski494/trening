# Role mięśni — grupa G3, rodzina `kb_ballistic` (fala W1)

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3; kontynuacja tego samego dnia — N7, N8)
Zakres: luki „brak reguły” dla ćwiczeń balistycznych z kettlebell/hantlem (zarzut, rwanie, ciągnięcie wysokie, wyciskanie z wybiciem, podrzut).
Reguły wspólne N1–N4 i źródła S29–S34, W1G3-S6 opisane w `olympic.md` (ten sam katalog); N5–N6 w `thruster.md`. Tu nowe reguły wspólne **N7–N8**
(podrzut: ramiona) — dotyczą też Clean and Jerk (sztanga) z `olympic.md`.

Szczeble źródeł według rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): Catalyst Athletics = 4; ACE (organizacja certyfikująca trenerów) = 4.

## Tabela luk (rodzina kb_ballistic)

| Luka (pattern\|region\|rola) | Ćwiczenia | Wynik | Uzasadnienie |
|---|---|---|---|
| v_push\|quads\|aux | Double Kettlebell Push Press, Double Kettlebell Jerk, One-Arm Kettlebell Push Press, One-Arm Kettlebell Jerk, One-Arm Kettlebell Split Jerk | **gotowe** → N1 `quads.knee_ext` | S32 (ACE, push press z kettlebell: ugięcie kolan i wybicie), S33 (ACE, push-jerk), S30 (przegląd: wybicie przez wyprost bioder i kolan) |
| v_push\|glutes\|aux | One-Arm Kettlebell Split Jerk | **gotowe** → N2 `glutes.hip_ext` | S30 (jerk: wyprost bioder, kolan i skokowych), S33 |
| hinge\|triceps\|aux | One-Arm Kettlebell Clean and Jerk (+ Clean and Jerk, sztanga) | **gotowe** → N7 `triceps.elbow_ext` | dwie organizacje szczebla 4 opisują wyprost ramion w podrzucie: S33 (ACE, kettlebell: „punching both arms straight into the air”) i W1G3-S11 (Catalyst Athletics, sztanga: „punch the elbows into a secure overhead position”). S30 (szczebel 3) mówi, że podrzut nie jest typowym wyciskaniem (napęd z nóg), ale nie przeczy prostowaniu łokci → rola pomocnicza zgodna |
| hinge\|front_delt\|aux | Clean and Jerk (sztanga) | **gotowe** → N8 `front_delt.shoulder_flex` | ramiona idą z pozycji na barkach (łokcie z przodu) nad głowę: S33 („arms straight into the air”), W1G3-S11 („push the bar up and slightly back with the arms”); zgięcie barku przy unoszeniu ramienia w górę z przodu — anatomia (S1, S6) |
| hinge\|front_delt\|main | One-Arm Kettlebell Clean and Jerk | otwarte | funkcja jak w N8, ale rola **główna** przeczy S30 i W1G3-S11 (ciężar napędzają nogi: „drive straight back up aggressively with the legs”); rozbieżność z udziałem 1 w katalogu — sprawa danych katalogu |
| hinge\|front_delt\|aux | Kettlebell Snatch, Snatch (hantel), Double Kettlebell Snatch | otwarte | ciężar kończy nad głową, ale nie przeczytałem źródła przebiegu ruchu w barku dla rwania kettlebell/hantlem (praca o rwaniu kettlebell — 403; ACE: tylko notka prasowa o artykule w magazynie); badanie wymachu (Abuwarda i Akl 2024) dotyczy innego ćwiczenia → analogia |
| hinge\|upper_back\|aux | Kettlebell Clean, Kettlebell Snatch, Double Kettlebell Clean, Double Kettlebell Snatch, Bottoms-Up Clean From The Hang Position, Dumbbell Clean, Snatch (hantel) (wg katalogu) | otwarte | badania „wzruszenia” (S29, W1G3-S6) dotyczą sztangi; S34 (ACE, zarzut kettlebell) opisuje podciągnięcie do klatki i opuszczenie łokcia, bez unoszenia barków → przeniesienie = analogia |
| hinge\|upper_back\|main | Kettlebell Sumo High Pull | otwarte | ciągnięcie wysokie — tylko strony komercyjne i porównanie do wiosłowania w pionie (analogia) |
| hinge\|side_delt\|aux | Kettlebell Sumo High Pull | otwarte | jw. |

## Propozycje (format role-miesni.json)

```json
{
  "nameRules": {
    "reguly_odwolania": {
      "N1 (quads.knee_ext, main+aux)": [
        "Double Kettlebell Push Press", "Double Kettlebell Jerk",
        "One-Arm Kettlebell Push Press", "One-Arm Kettlebell Jerk", "One-Arm Kettlebell Split Jerk"
      ],
      "N2 (glutes.hip_ext, main+aux)": ["One-Arm Kettlebell Split Jerk"]
    },
    "reguly": [
      {
        "id": "N7",
        "muscle": "triceps",
        "roles": ["aux"],
        "function": "triceps.elbow_ext",
        "exercises": ["Clean and Jerk", "One-Arm Kettlebell Clean and Jerk"],
        "zrodlaZastosowania": ["S33", "W1G3-S11", "S30"],
        "uwaga": "Podrzut kończy się wyprostem ramion nad głową (ACE: kettlebell; Catalyst Athletics: sztanga). Rola pomocnicza: napęd z nóg (S30, W1G3-S11)."
      },
      {
        "id": "N8",
        "muscle": "front_delt",
        "roles": ["aux"],
        "function": "front_delt.shoulder_flex",
        "exercises": ["Clean and Jerk"],
        "zrodlaZastosowania": ["S33", "W1G3-S11", "S1", "S6"],
        "uwaga": "Ramiona z pozycji na barkach nad głowę. Tylko rola pomocnicza.",
        "pominiete": {
          "One-Arm Kettlebell Clean and Jerk": "w katalogu rola główna; źródła: ciężar napędzają nogi — rozbieżność z danymi katalogu, otwarte"
        }
      }
    ]
  },
  "sources": [
    {
      "id": "W1G3-S11", "tier": 4,
      "cite": "Catalyst Athletics. Exercise Library: Jerk / Split Jerk (nr 60; treść firmowana przez Catalyst Athletics, Inc., bez daty)",
      "url": "https://catalystathletics.com/exercise/60/Jerk-Split-Jerk/",
      "miejsce": "opis wykonania",
      "cytaty": [
        "„push the bar up and slightly back with the arms” i „punch the elbows into a secure overhead position” (fragmenty)",
        "„drive straight back up aggressively with the legs to accelerate the barbell upward maximally” (fragment)"
      ],
      "uwaga": "brak daty strony — kryterium (b) spełnione przez firmowanie treści przez organizację"
    }
  ],
  "sources_odwolania": "S30, S32, S33 — pełne wpisy w olympic.md"
}
```

## Zdania PL | EN

Bez nowych tekstów (istniejące funkcje, nameRules bez fazy):

| Ćwiczenie i mięsień | PL | EN |
|---|---|---|
| KB Push Press / Jerk / Split Jerk — czworogłowe (pomocniczy) | Pomaga prostować kolano. | Helps straighten your knee. |
| One-Arm KB Split Jerk — pośladki (pomocniczy) | Pomaga prostować biodro. | Helps straighten your hip. |
| Clean and Jerk, One-Arm KB Clean and Jerk — triceps (pomocniczy) | Pomaga prostować łokieć. | Helps straighten your elbow. |
| Clean and Jerk — przedni akton (pomocniczy) | Pomaga unosić ramię do przodu. | Helps raise your arm forward. |

## Źródła

Użyte: S30 (Soriano i in., Sports Med 2019, PMC6548056, szczebel 3), S32 (ACE Double Push-press, szczebel 4), S33 (ACE Push-jerk, szczebel 4) — adresy, miejsca i cytaty w `olympic.md`; W1G3-S11 (Catalyst Athletics, Jerk / Split Jerk, szczebel 4) — wyżej.
Przeczytane i **nie użyte**: Abuwarda K, Akl A-R. Assessment of trunk and shoulder muscle asymmetries during two-armed kettlebell swings. Front Sports Act Living 2024;6 (https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1497826/full, Discussion; Fig. 1) — dotyczy wymachu, nie rwania ani zarzutu; jako dowód dla rwania byłaby to analogia. Catalyst Athletics, strona „Clean & Jerk” (nr 56) — bez opisu wykonania.

## Otwarte

- [OTWARTE] Przedni akton w rwaniu kettlebell/hantlem (3 pary): potrzebne źródło przebiegu ruchu (np. praca Ross 2018 o wymaganiach rwania kettlebell — ACU, 403; przegląd Dobrovolski i Galuschenko 2012 — tylko streszczenie; biblioteka ACE nie ma strony rwania kettlebell w wynikach wyszukiwania).
- [OTWARTE, dane katalogu] One-Arm Kettlebell Clean and Jerk — przedni akton z rolą główną: źródła opisują napęd z nóg; do koordynatora (udział 0,5 → N8, albo bez opisu).
- [OTWARTE] Górna część pleców w zarzucie i rwaniu kettlebell/hantlem — badania dotyczą sztangi; brak źródła dla kettlebell.
- [OTWARTE] Kettlebell Sumo High Pull — górna część pleców (główny) i boczny akton (pomocniczy): brak źródła dla ciągnięcia wysokiego; porównanie z wiosłowaniem w pionie byłoby uproszczeniem (nie wyświetlane).

## Stan

- Zrobione: luki kb_ballistic przejrzane; 5 + 1 par pokrytych regułami wspólnymi N1/N2; N7 (triceps w podrzucie: 2 pary) i N8 (przedni akton w Clean and Jerk: 1 para), źródło W1G3-S11.
- Zostało: rwanie kettlebell/hantlem (przedni akton), zarzut/rwanie kettlebell (górna część pleców), Kettlebell Sumo High Pull, KB C&J przedni akton (rola główna).
- Następny krok: przy scalaniu N1/N2/N7/N8; przeliczenie liczb testem.
- Pułapki: nie rozszerzać N1 na Log Lift, Circus Bell, Linear Jammer bez źródła; N4 (unoszenie barków) tylko dla sztangi.
