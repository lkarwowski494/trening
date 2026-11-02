# Wskazówki techniki — rodzina `strongman` (fala W2, G6)

- Data: 02.11.2026, fala W2, badacz-merytoryczny (agent)
- Zrobione: nowe źródło szczebla 2 — przegląd systematyczny biomechaniki ćwiczeń strongman (opis faz kamienia, opony, kłody; postawa przy noszeniu). Z nim i z BarBend (przeczytany ponownie) Atlas Stones dostaje kartę z błędem wnioskowanym; Tire Flip i Log Lift — tylko ruch („częściowe (open)”). Yoke Walk gotowe w W1 — bez zmian (przegląd dodatkowo potwierdza napięcie tułowia).
- Bez nowych badań (W1 wyczerpała dostępne źródła): Keg Load, Circus Bell, Conan's Wheel, Power Stairs, Jefferson Squat, Sandbag Load (poza uwagą o prefiksie).

## Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Atlas Stones | open | gotowe (ustawienie + ruch + 1 błąd wnioskowany) | `as.grip` (BarBend + przegląd), `as.lap`, `as.extend` (BarBend + przegląd), `as.mis.away` — wniosek z `as.grip`. `as.setup` (stanie nad kamieniem) nadal jedno źródło — poza kartą |
| Tire Flip | open | częściowe (open) — tylko ruch | `tf.lift` — przegląd systematyczny (szczebel 2, jedno źródło wprost = ustalone wg wyjątku 1–2); ustawienie nadal sporne (W1: rozstaw sumo vs dłonie na zewnątrz stóp) |
| Log Lift | open | częściowe (open) — tylko ruch | `log.lap` — przegląd (szczebel 2) + BarBend (W1); ustawienie (chwyt) — brak źródła szczebla ≤ 4 |
| Yoke Walk | general (W1: własna z błędami) | bez zmian (gotowe w W1) | przegląd: „brace their trunk” — dodatkowe źródło `yoke.brace` (opcjonalnie) |
| Sandbag Load | open | otwarte | bez zmian; **konflikt prefiksu**: W1 proponuje `sb.lap`, a `sb.` jest zajęty (`sb.plane` w `lib/cues/text/pl.json:307`) → przy wdrożeniu np. `sbag.lap` |
| Keg Load | open | otwarte | przegląd opisuje tylko noszenie beczki (keg walk), nie ładowanie — inne ćwiczenie |
| Jefferson Squat | general (`squat`) | otwarte | bez zmian (W1: jedno źródło szczebla 4, zestaw ogólny częściowo niepotwierdzony) |
| Circus Bell | open | otwarte | bez zmian (W1: jedno źródło szczebla 4) |
| Conan's Wheel | open | otwarte | bez zmian (brak źródła) |
| Power Stairs | open | otwarte | bez zmian (brak źródła) |

## Blok do wdrożenia

```json
{
  "Atlas Stones": {
    "setup": [
      {"c": "as.grip", "s": [
        ["barbend-atlas", "Step 2 Lap the Stone („Grip the stone as tightly as possible, as if you were performing a chest flye.”; Form tip: jak najwięcej ciała i klatki wokół kamienia)"],
        ["hindle-2019-strongman", "Discussion › Atlas Stone Lift, faza 1 (podniesienie kamienia z ziemi chwytem „hugged”, obejmując go)"]
      ]}
    ],
    "move": [
      {"c": "as.lap", "s": [
        ["barbend-atlas", "Step 2 Lap the Stone (kamień do bioder, usiądź w tył, kamień na udach)"],
        ["hindle-2019-strongman", "Discussion › Atlas Stone Lift, faza 1 („…the stone resting in the lap”)"]
      ]},
      {"c": "as.extend", "s": [
        ["barbend-atlas", "Step 3 Drive Up to Load the Stone („Pull the stone up your body as you stand up and drive your hips forward.”)"],
        ["hindle-2019-strongman", "Discussion › Atlas Stone Lift, faza 3 (z ćwierćprzysiadu do pełnego wyprostu)"]
      ]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "as.mis.away", "s": [["wniosek", "as.grip"]]}
    ]
  },
  "Tire Flip": {
    "_uwaga": "częściowe (open) — bez ustawienia",
    "setup": [],
    "move": [
      {"c": "tf.lift", "s": [
        ["hindle-2019-strongman", "Discussion › Tire Flip, fazy 1–3 (krawędź opony z ziemi nad kolana; dalej w górę do puszczenia dłoni; złapanie opony mniej więcej na wysokości klatki)"]
      ]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Log Lift": {
    "_uwaga": "częściowe (open) — bez ustawienia",
    "setup": [],
    "move": [
      {"c": "log.lap", "s": [
        ["hindle-2019-strongman", "Discussion › Log Lift (faza 1: z ziemi na wysokość kolan / ud; faza 2: z ud na klatkę)"],
        ["barbend-strongman-ex", "Log lift (kłoda na uda, potem na klatkę) — przeczytane w W1"]
      ]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

## Nowe zdania

| id | PL | EN | Uzasadnienie |
|---|---|---|---|
| as.grip | Obejmij kamień przedramionami i dłońmi i mocno go ściśnij. | Wrap your forearms and hands around the stone and squeeze hard. | brzmienie z W1 (tam: jedno źródło); teraz BarBend Step 2 + przegląd (chwyt obejmujący) |
| as.lap | Podnieś kamień nad kolana i oprzyj go na udach. | Lift the stone over your knees and rest it on your thighs. | brzmienie z W1; BarBend + przegląd (faza 1) |
| as.extend | Z ud mocno wypchnij biodra i wyprostuj się, unosząc kamień wyżej. | From your lap, drive your hips through and stand up, bringing the stone higher. | brzmienie z W1; BarBend Step 3 + przegląd (faza 3) |
| as.mis.away | Kamień odsunięty od ciała, trzymany samymi dłońmi. | Holding the stone away from your body with just your hands. | wniosek: zaprzecza `as.grip` (objęcie przedramionami, ściśnięcie); BarBend: jak najwięcej ciała i klatki wokół kamienia. Nie dotyczy sporu o dłonie pod kamieniem (W1) |
| tf.lift | Unieś krawędź opony nad kolana, a potem pchaj ją wyżej, aż przejmiesz ją na wysokości klatki. | Lift the edge of the tire past your knees, then keep driving it up until you catch it at chest height. | przegląd, Discussion › Tire Flip, fazy 1–3. Bez wskazówek o rozstawie i dłoniach (sporne w W1) |
| log.lap | Podnieś kłodę z ziemi na uda, a potem z ud na klatkę. | Lift the log from the floor onto your thighs, then from your thighs up to your chest. | przegląd (fazy 1–2) + BarBend; zastępuje `log.clean` z W1 — bez „blisko tułowia” (w przeglądzie tylko analogia z zarzutu sztangi) |

`tf.push` (W1) nie wchodzi: BarBend + przegląd potwierdza tylko złapanie opony na wysokości klatki, nie samo przepchnięcie — nadal jedno źródło.

## Źródła

| id | Adres | Organizacja | Szczebel | Co przeczytano (02.11.2026) |
|---|---|---|---|---|
| hindle-2019-strongman | https://pmc.ncbi.nlm.nih.gov/articles/PMC6901656/ | Hindle, Lorimer, Winwood, Keogh — Bond University / University of the Sunshine Coast; Sports Medicine – Open 5:49 (2019) | **2** — przegląd systematyczny, recenzowane czasopismo (istnieje sprostowanie — treści nie czytano) | Discussion › Atlas Stone Lift (fazy 1–3, chwyt obejmujący, wyprost tułowia), Tire Flip (fazy 1–3), Log Lift (fazy 1–2), Bilateral i Unilateral Load Carriage |
| barbend-atlas | https://barbend.com/strongman-atlas-stone-technique/ | BarBend | 4 — autor M. Gill, aktualizacja M. Dewar (CSCS) 26.06.2024, recenzent ekspercki M. Hooper (CSCS) — widoczne na stronie | Step 1–3 z form tips; brak sekcji błędów (tylko ostrzeżenie przed „secondary techniques”) |
| barbend-strongman-ex | https://barbend.com/best-strongman-exercises/ | BarBend | 4 wg W1 (J. Dickson, recenzja 03.07.2024); w W2 nie czytane ponownie | W1: opis log lift |

Opis faz w przeglądzie jest opisem ruchu z badań biomechanicznych, nie zaleceniem trenerskim — dlatego używam go tylko do zdań „ruch / ustawienie”, bez liczb (przegląd podaje m.in. czasy faz i kąty — nie przenosić).

## Otwarte i uwagi dla koordynatora

- **Atlas Stones — `as.setup`:** stanie nad kamieniem między stopami — tylko BarBend (8weeksout — otwarte). Karta działa bez niego (`as.grip` jako ustawienie).
- **Tire Flip, Log Lift:** karty bez ustawienia — „częściowe (open)”, do oceny koordynatora (wyjątek z briefu). Ustawienie opony sporne między BarBend i 8weeksout (W1); chwyt kłody — tylko źródła szczebla 5.
- **Sandbag Load:** przegląd mówi, że worek „may be lifted using a similar technique” jak kamień — to analogia w źródle szczebla 2 (ostrożne „may”). Gdyby koordynator przyjął uproszczenie (analogia do kamienia), karta mogłaby mieć `as.grip`/`as.lap` + Bells of Steel (objęcie worka). Nie wprowadzam bez decyzji.
- **Keg Load:** przegląd opisuje noszenie beczki (objęcie przy brzuchu, na barku) — inne ćwiczenie; ładowanie nadal otwarte.
- **Yoke Walk:** `carry.walk` w zestawie ogólnym nadal sprzeczne ze źródłami (krótkie, szybkie kroki) — karta W1 go zastępuje.
- Role mięśni: bez nowych ustaleń (pliku `role-miesni-fala-w2/strongman.md` nie tworzę).
