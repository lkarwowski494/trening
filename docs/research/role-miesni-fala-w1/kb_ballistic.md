# Role mięśni — grupa G3, rodzina `kb_ballistic` (fala W1)

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3)
Zakres: luki „brak reguły” dla ćwiczeń balistycznych z kettlebell/hantlem (zarzut, rwanie, ciągnięcie wysokie, wyciskanie z wybiciem, podrzut).
Reguły wspólne N1–N3 i źródła S29–S34 opisane w `olympic.md` (ten sam katalog) — tu tylko odwołania.

## Tabela luk (rodzina kb_ballistic)

| Luka (pattern\|region\|rola) | Ćwiczenia | Wynik | Uzasadnienie |
|---|---|---|---|
| v_push\|quads\|aux | Double Kettlebell Push Press, Double Kettlebell Jerk, One-Arm Kettlebell Push Press, One-Arm Kettlebell Jerk, One-Arm Kettlebell Split Jerk | **gotowe** → N1 `quads.knee_ext` | S32 (ACE, push press z kettlebell: ugięcie kolan i wybicie), S33 (ACE, push-jerk), S30 (przegląd: wybicie przez wyprost bioder i kolan) |
| v_push\|glutes\|aux | One-Arm Kettlebell Split Jerk | **gotowe** → N2 `glutes.hip_ext` | S30 (jerk: wyprost bioder, kolan i skokowych), S33 |
| hinge\|front_delt\|aux | Kettlebell Snatch, Snatch (hantel), Double Kettlebell Snatch | otwarte | ciężar kończy nad głową, ale nie przeczytałem źródła przebiegu ruchu w barku dla rwania kettlebell/hantlem (praca o rwaniu kettlebell — 403); badanie wymachu (Abuwarda i Akl 2024) dotyczy innego ćwiczenia → analogia |
| hinge\|front_delt\|main | One-Arm Kettlebell Clean and Jerk | otwarte | jedno źródło szczebla 4 (S33 „punching both arms straight into the air”, ale dla podrzutu oburącz bez zarzutu); S30: podrzut nie jest wyciskaniem |
| hinge\|triceps\|aux | One-Arm Kettlebell Clean and Jerk | otwarte | jw. — jedno źródło (S33) |
| hinge\|upper_back\|aux | Kettlebell Clean, Kettlebell Snatch, Double Kettlebell Clean, Double Kettlebell Snatch, Bottoms-Up Clean From The Hang Position, Dumbbell Clean, Snatch (hantel) (wg katalogu) | otwarte | brak źródła roli górnej części pleców w zarzucie/rwaniu kettlebell; S34 (ACE, zarzut kettlebell) opisuje podciągnięcie do klatki i opuszczenie łokcia, bez unoszenia barków |
| hinge\|upper_back\|main | Kettlebell Sumo High Pull | otwarte | ciągnięcie wysokie — tylko strony komercyjne i porównanie do wiosłowania w pionie (analogia) |
| hinge\|side_delt\|aux | Kettlebell Sumo High Pull | otwarte | jw. |

## Propozycje (format role-miesni.json)

Brak nowych funkcji i reguł poza wspólnymi. Ćwiczenia kb_ballistic w regułach wspólnych:

```json
{
  "nameRules": {
    "reguly_odwolania": {
      "N1 (quads.knee_ext, main+aux)": [
        "Double Kettlebell Push Press", "Double Kettlebell Jerk",
        "One-Arm Kettlebell Push Press", "One-Arm Kettlebell Jerk", "One-Arm Kettlebell Split Jerk"
      ],
      "N2 (glutes.hip_ext, main+aux)": ["One-Arm Kettlebell Split Jerk"]
    }
  },
  "sources": "S30, S32, S33 — pełne wpisy w olympic.md"
}
```

## Zdania PL | EN

Bez nowych tekstów (istniejące funkcje, nameRules bez fazy):

| Ćwiczenie i mięsień | PL | EN |
|---|---|---|
| KB Push Press / Jerk / Split Jerk — czworogłowe (pomocniczy) | Pomaga prostować kolano. | Helps straighten your knee. |
| One-Arm KB Split Jerk — pośladki (pomocniczy) | Pomaga prostować biodro. | Helps straighten your hip. |

## Źródła

Użyte: S30 (Soriano i in., Sports Med 2019, PMC6548056, szczebel 3), S32 (ACE Double Push-press, szczebel 4), S33 (ACE Push-jerk, szczebel 4) — adresy, miejsca i cytaty w `olympic.md`.
Przeczytane i **nie użyte**: Abuwarda K, Akl A-R. Assessment of trunk and shoulder muscle asymmetries during two-armed kettlebell swings. Front Sports Act Living 2024;6 (https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1497826/full, Discussion; Fig. 1) — dotyczy wymachu, nie rwania ani zarzutu; jako dowód dla rwania byłaby to analogia.

## Otwarte

- [OTWARTE] Przedni akton w rwaniu kettlebell/hantlem (3 pary): potrzebne źródło przebiegu ruchu (np. praca Ross 2018 o wymaganiach rwania kettlebell — ACU, 403 w tej sesji; przegląd Dobrovolski i Galuschenko 2012 — tylko streszczenie).
- [OTWARTE] One-Arm Kettlebell Clean and Jerk — przedni akton (główny) i triceps (pomocniczy): drugie źródło dla prostowania ramion w podrzucie.
- [OTWARTE] Górna część pleców w zarzucie i rwaniu kettlebell — brak źródła roli.
- [OTWARTE] Kettlebell Sumo High Pull — górna część pleców (główny) i boczny akton (pomocniczy): brak źródła dla ciągnięcia wysokiego; porównanie z wiosłowaniem w pionie byłoby uproszczeniem (nie wyświetlane).

## Stan

- Zrobione: luki kb_ballistic przejrzane; 5 + 1 par pokrytych regułami wspólnymi N1/N2.
- Zostało: źródła dla rwania kettlebell i ciągnięcia wysokiego (otwarte wyżej).
- Następny krok: przy scalaniu N1/N2 z `olympic.md`; przeliczenie liczb testem.
- Pułapki: nie rozszerzać N1 na Log Lift, Circus Bell, Linear Jammer bez źródła.
