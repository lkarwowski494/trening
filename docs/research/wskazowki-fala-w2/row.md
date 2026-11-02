# Wskazówki techniki — rodzina `row` (fala W2, G6)

- Data: 02.11.2026, fala W2, badacz-merytoryczny (agent).
- Podstawa: wyniki W1 (`docs/research/wskazowki-fala-w1/row.md`, sekcje „Korekta szczebli — przeliczenie koordynatora 02.11.2026” i „Blok do wdrożenia”), reguły szczebli z 02.11.2026 (`szczeble-organizacji-2026-11-02.md`, uzupełnienia 1–3).
- Co zrobiono: (1) Reverse Grip Bent Over Row — nowa karta z dwóch źródeł szczebla 4 (Catalyst Athletics + Fitness Volt z autorem ACE, MSc i datą); (2) Bent Over Row (linki) i Lying T-Bar Row — karty jako `uproszczenie: wariant sprzętu` (źródła wersji bazowej już w `cues.json`); (3) błędy wnioskowane do kart bez błędów: Seal Row (W1), Chest Supported Row, One Arm Row (hantle); (4) Meadows Row i Barbell Rear Delt Row — szukano drugiego źródła, bez skutku.
- Role mięśni: W1 — brak luk; w W2 nic nowego (pliku `role-miesni-fala-w2/row.md` nie tworzę).

## Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Reverse Grip Bent Over Row | general | **gotowe** (ustawienie + ruch + 1 błąd) | Catalyst (4) + Fitness Volt (4, strona z autorem ACE, MSc, data 02.11.2024); błąd `mis.roundBack` = FV wprost + Catalyst standard |
| Bent Over Row (linki) | general | **gotowe** (uproszczenie) | `uproszczenie: wariant sprzętu Bent Over Row (sztanga)` — ten sam zawias biodrowy i przyciąganie do brzucha; różni się tylko kierunek oporu (linka z dolnego bloczka przed ćwiczącym) |
| Lying T-Bar Row | general | **gotowe** (uproszczenie) | `uproszczenie: wariant sprzętu Chest Supported Row` — klatka na podporze, ten sam ruch; błąd wnioskowany |
| Seal Row (sztanga) | general (W1: własna bez błędów) | tylko błędy wnioskowane dopisane → z W1 staje się „z błędami” | błąd `row.mis.chestOff` wnioskowany z `seal.setup` |
| Chest Supported Row | own (E0) | tylko błędy wnioskowane dopisane | `row.mis.chestOff` z `csr.chest` |
| One Arm Row (hantle) | own (E0) | tylko błędy wnioskowane dopisane | `mis.roundBack` z `row1.bench` („plecy proste”) |
| Smith Machine Bent Over Row | general (W1: własna z błędami) | bez zmian | gotowe w W1 |
| Meadows Row | general | otwarte | drugie źródło nie znalezione (szczegóły w „Otwarte”) |
| Barbell Rear Delt Row | general | otwarte | jw. |
| Bent Over Row (hantle), Bent Over Row (sztanga), Pendlay Row, T-Bar Row | own (E≥1) | poza zakresem | karty z błędami już w aplikacji |

## Blok do wdrożenia

```json
{
  "Reverse Grip Bent Over Row": {
    "setup": [
      {"c": "row.hinge", "s": [["catalyst-reverse-grip-bent-row", "opis (hinge forward at the hips while bending the knees; torso just above horizontal)"], ["fitnessvolt-reverse-grip-row", "How to Do a Barbell Reverse Grip Bent Over Row, ustawienie (hinge at your hips… keeping your back straight and knees slightly bent)"]]},
      {"c": "row.revGrip", "s": [["catalyst-reverse-grip-bent-row", "opis (palms facing forward)"], ["fitnessvolt-reverse-grip-row", "How to Do…, ustawienie (underhand (supinated) grip)"]]}
    ],
    "move": [
      {"c": "row.bbPullCtrl", "s": [["catalyst-reverse-grip-bent-row", "opis (pull the bar to the abdomen; lower the bar to full elbow extension)"], ["fitnessvolt-reverse-grip-row", "How to Do…, kroki 2 i 4 (pull towards your lower ribcage; lower in a controlled manner)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["catalyst-reverse-grip-bent-row", "opis (brace your trunk; braced back position throughout the lowering)"], ["fitnessvolt-reverse-grip-row", "How to Do…, ustawienie (keeping your back straight)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["fitnessvolt-reverse-grip-row", "Common Mistakes — Poor Posture (rounding your back)"], ["catalyst-reverse-grip-bent-row", "opis (standard: brace your trunk, braced back throughout) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Bent Over Row (linki)": {
    "setup": [
      {"c": "row.hinge", "s": [["ace-12", "opis (sztanga — ten sam wzorzec; uproszczenie: wariant sprzętu)"], ["exrx-BackGeneral/BBBentOverRow", "Preparation (sztanga — ten sam wzorzec; uproszczenie: wariant sprzętu)"]]}
    ],
    "move": [
      {"c": "row.cbPull", "s": [["ace-12", "opis (towards the belly button; until the elbows are completely straight — sztanga, uproszczenie: wariant sprzętu)"], ["exrx-BackGeneral/BBBentOverRow", "Execution (to upper waist; arms extended — sztanga, uproszczenie: wariant sprzętu)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["ace-12", "opis (back straight/flat — sztanga, uproszczenie)"], ["exrx-BackGeneral/BBBentOverRow", "Comments (low back straight — sztanga, uproszczenie)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["exrx-BackGeneral/BBBentOverRow", "Comments (low back rounded due to poor form — sztanga, uproszczenie)"], ["ace-12", "opis (keep the back flat — sztanga, uproszczenie)"]]}
    ]
  },
  "Lying T-Bar Row": {
    "setup": [
      {"c": "csr.chest", "s": [["exrx-BackGeneral/DBInclineRow", "Preparation (lie chest down — hantle na ławce, uproszczenie: wariant sprzętu)"], ["ace-168", "Step 1; Step 2 (chest against the chest pad — uproszczenie: wariant sprzętu)"]]}
    ],
    "move": [
      {"c": "csr.pull", "s": [["exrx-BackGeneral/DBInclineRow", "Execution (uproszczenie: wariant sprzętu)"], ["ace-168", "Step 2; Step 3 (uproszczenie: wariant sprzętu)"]]}
    ],
    "tips": [
      {"c": "row.elbowsPast", "s": [["exrx-BackGeneral/DBInclineRow", "Execution (upper arm just beyond height of back — uproszczenie)"], ["ace-168", "Step 3 (until your elbows pass the sides of your body — uproszczenie)"]]}
    ],
    "mistakes": [
      {"c": "row.mis.chestOff", "s": [["wniosek", "csr.chest"]]}
    ]
  },
  "Seal Row (sztanga)": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "row.mis.chestOff", "s": [["wniosek", "seal.setup"]]}
    ]
  },
  "Chest Supported Row": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "row.mis.chestOff", "s": [["wniosek", "csr.chest"]]}
    ]
  },
  "One Arm Row (hantle)": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "mis.roundBack", "s": [["wniosek", "row1.bench"]]}
    ]
  }
}
```

Seal Row (sztanga): pełna karta (setup/move/tips) — z bloku W1; tutaj tylko dopisany błąd.

## Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| `row.revGrip` | Chwyć sztangę podchwytem. | Grab the bar with an underhand grip. | Catalyst + Fitness Volt (oba: podchwyt). Szerokość chwytu pominięta: tylko Catalyst podaje („clean-width”), FV — nie |
| `row.cbPull` | Przyciągnij uchwyty do brzucha, potem wróć do pełnego wyprostu rąk. | Pull the handles to your stomach, then return until your arms are fully straight. | Odpowiednik `row.bbPull` / `row.dbPull` dla linek (rysunek: dwa uchwyty, wyciąg dolny); „wróć” zamiast „opuść”, bo linka idzie skośnie do przodu, nie pionowo w dół |
| `row.mis.chestOff` | Odrywanie klatki od podpory, żeby dociągnąć ciężar. | Lifting your chest off the pad to finish the rep. | WNIOSKOWANY: zaprzeczenie `csr.chest` („trzymaj klatkę na podporze przez cały ruch”) — Chest Supported Row, Lying T-Bar Row; w Seal Row zaprzeczenie `seal.setup` („połóż się na ławce przodem”). Dodatkowo Fitness Volt (Seal Row, sekcja „Mistakes or Cautions”: broda przy ławce; leżenie zapobiega rozpędowi i oszukiwaniu ruchem tułowia) — tylko jako potwierdzenie kierunku, nie drugie źródło błędu. Dla Seal Row słowo „podpora” = ławka |

Istniejące zdania użyte: `row.hinge`, `hinge.back`, `row.bbPullCtrl` (W1, nowe w aplikacji), `mis.roundBack`, `csr.chest`, `csr.pull`, `row.elbowsPast`.

## Źródła

| id | Adres | Organizacja | Szczebel (uzasadnienie) | Co przeczytano (WebFetch 02.11.2026) |
|---|---|---|---|---|
| `catalyst-reverse-grip-bent-row` | https://catalystathletics.com/exercise/875/Reverse-Grip-Bent-Row/ | Catalyst Athletics | 4 — biblioteka firmowana przez Catalyst Athletics (szczeble-organizacji, wiersz „Catalyst Athletics”: 4) | pełny opis: chwyt „clean-width”, dłonie do przodu; zawias w biodrach z ugięciem kolan, tułów tuż nad poziomem; „Pull the bar to the abdomen, squeezing your shoulder blades back together”; opuszczanie do pełnego wyprostu łokci, plecy usztywnione |
| `fitnessvolt-reverse-grip-row` | https://fitnessvolt.com/barbell-reverse-grip-bent-over-row-guide/ | Fitness Volt | 4 — uzup. 3: autor z kwalifikacjami i data na stronie: „Ash, ACE, MSc” (certyfikat ACE, M.S. Exercise Science), opublikowano i zmieniono 02.11.2024 | „How to Do a Barbell Reverse Grip Bent Over Row” (ustawienie + kroki 1–5), „Common Mistakes” (Incorrect Grip, Poor Posture, Flared Elbows, Using Momentum, Neglecting the Pause). Uwaga: W1 użyła tego samego id dla strony FV — jeśli W1 cytowała inny adres, koordynator ujednolica do tego |
| `ace-12`, `exrx-BackGeneral/BBBentOverRow`, `ace-168`, `exrx-BackGeneral/DBInclineRow` | (istniejące w `data/zrodla/cues.json`) | ACE, ExRx | 4 (istniejące wpisy) | nieczytane ponownie w W2 — użyte jako źródła wersji bazowej (uproszczenie), z miejscami jak w obecnych kartach Bent Over Row (sztanga) i Chest Supported Row |
| `fitnessvolt-seal-row` | https://fitnessvolt.com/seal-row/ | Fitness Volt | 4 (W1, przeliczenie 02.11.2026: Vidur Saini, ACE, daty 08.02.2022/11.08.2024) | ponownie: kroki 1–13, „Seal Row Tips”, fragmenty o brodzie przy ławce i o rozpędzie — brak sekcji „Common mistakes” |
| `barbend-reverse-grip-row` | https://barbend.com/reverse-grip-bent-over-row/ | BarBend | 5 na tej stronie — autor bez kwalifikacji trenerskich (scenarzysta, „hobbyist powerlifter”), aktualizacja 18.11.2024 | przeczytane, nie liczone |
| `repfitness-landmine-row` | https://repfitness.com/blogs/training/how-to-do-a-landmine-row-technique-variations-and-benefits | REP Fitness | nie liczone — Meadows Row opisany jednym zdaniem bez ustawienia i ruchu; autorka bez kwalifikacji | przeczytane |
| `rusin-landmine-row` | https://drjohnrusin.com/how-to-build-bulletproof-shoulders/ | Dr John Rusin | nie liczone — brak daty na stronie (wymóg: autor z kwalifikacjami i data widoczna); stopnie ustawienia stóp kwestionowane w komentarzach | przeczytane |

## Otwarte i uwagi dla koordynatora

- **Meadows Row** — [OTWARTE]: nadal tylko Generation Iron (W1). REP Fitness — jedno zdanie bez instrukcji; Rusin — bez daty. Inne trafienia: aplikacje (wykluczone), The Prehab Guys (5), Muscle & Strength (nie liczy się).
- **Barbell Rear Delt Row** — [OTWARTE]: nadal tylko Generation Iron. Trafienia W2: strony Fitness Volt bez instrukcji (normy siły, zamienniki), serwis aplikacji treningowej (wykluczony), bodybuilding.com (sklep/free-exercise-db = 5).
- **Reverse Grip — zestaw ogólny `rowBent`** zawiera dziś tylko `row.hinge`, `hinge.back`, `row.fullStretch` (bez `row.bbGrip`), więc nie przeczy podchwytowi; karta własna zastępuje zestaw. Kąt tułowia: Catalyst „tuż nad poziomem”, FV „prawie równolegle” — zgodne, ale do aplikacji nie wchodzi (zdanie `row.hinge` nie podaje kąta).
- **Reverse Grip — inne błędy jednego źródła**: łokcie szeroko na boki, rozpęd, brak pauzy (tylko FV). Catalyst nie podaje błędów.
- **Bent Over Row (linki)** — uproszczenie przyjęte wg reguły briefu (wariant sprzętu: linka). Rysunek: dwa uchwyty, wyciąg z bloczkiem nisko przed ćwiczącym — zgodny z kartą. Jeśli koordynator uzna, że kierunek oporu linki zmienia ruch (opór skośny do przodu), karta wraca do zestawu ogólnego.
- **Lying T-Bar Row** — uproszczenie wariantu sprzętu Chest Supported Row (maszyna dźwigniowa zamiast hantli na ławce skośnej; podparcie klatką i tor ruchu bez zmian). Zestaw ogólny tego ćwiczenia już używa `csr.chest` i `row.elbowsPast` — karta niczemu w nim nie przeczy.
- **Seal Row — błąd** wnioskowany z `seal.setup`; zdanie ustawienia mówi o pozycji wyjściowej, a błąd o utracie tej pozycji w ruchu. Gdyby koordynator uznał to za zbyt daleki wniosek, Seal Row zostaje kartą bez błędu (W1).
- Zdania nowe (`row.revGrip`, `row.cbPull`, `row.mis.chestOff`) trzeba dodać do `lib/cues/text/pl.json` i `en.json`, a jeśli `check:claims` je rozpozna — do rejestru twierdzeń.
