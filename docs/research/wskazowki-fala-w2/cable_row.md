# Wskazówki techniki — rodzina `cable_row` (fala W2, G6)

- Data: 02.11.2026, fala W2, badacz-merytoryczny (agent).
- Podstawa: wyniki W1 (`docs/research/wskazowki-fala-w1/cable_row.md`, sekcje „Korekta szczebli — przeliczenie koordynatora 02.11.2026” i „Blok do wdrożenia”), reguły szczebli z 02.11.2026.
- Co zrobiono: (1) Standing Cable Row — nowa karta (ACE + Fitness Volt z autorem ACE i datą), błąd ze źródeł; (2) Single Arm Cable Row — przywrócona karta W1 (`cr1.*`) z drugim źródłem szczebla 4 (Healthline, strona z recenzentem DPT), błąd ze źródeł; (3) Face Pull — błąd ze źródeł (NASM + Major Fitness); (4) Cable Rope Rear-Delt Rows — błąd wnioskowany; (5) Kneeling High Pulley Row — ponowne wyszukiwanie bez skutku.
- Role mięśni: W1 — brak luk; w W2 nic nowego (pliku `role-miesni-fala-w2/cable_row.md` nie tworzę).

## Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Standing Cable Row | general | **gotowe** (ustawienie + ruch + 1 błąd) | ACE 335 (4) + Fitness Volt (4: Matthew Magnante, ACE, daty 27.10.2020 / 15.09.2024); błąd: FV wprost + ACE standard |
| Single Arm Cable Row | general | **gotowe** (ustawienie + ruch + 1 błąd) | ACE 337 (stojąc) + Healthline (siedząc, sekcja „Make it harder”) — część wspólna bez pozycji ciała; Healthline opisuje wariant jednorącz krótko (patrz „Otwarte”) |
| Face Pull | own (E0) | błąd ze źródeł dopisany | `mis.jerk`: NASM + Major Fitness, oba wprost |
| Cable Rope Rear-Delt Rows | general (W1: własna bez błędów) | błąd wnioskowany dopisany → z W1 staje się „z błędami” | `rdcr.mis.elbowsIn` z `rdcr.pull` |
| Machine Row | general (W1: własna z błędami) | bez zmian | gotowe w W1 |
| Kneeling High Pulley Row | general | otwarte | brak drugiego (i pierwszego) źródła szczebla 4 |
| Leverage High Row | general | otwarte | bez nowych źródeł w W2 (W1: Fitness Volt bez oceny strony + Set For Set = 5) |
| Sled Row | open | otwarte | bez nowych źródeł w W2 |
| Seated Cable Row, Wiosłowanie na linkach (siedząc) | own (E1) | poza zakresem | karty z błędami już w aplikacji |

## Blok do wdrożenia

```json
{
  "Standing Cable Row": {
    "setup": [
      {"c": "scrow.setup", "s": [["ace-335", "Starting position (cable pulley at about chest-height; two handles, one in each hand; feet hip-width, knees slightly bent)"], ["fitnessvolt-cable-standing-row", "How to (V bar about lower chest height; grip with both hands, step back; feet hip-width, knees slightly bent)"]]}
    ],
    "move": [
      {"c": "scrow.pull", "s": [["ace-335", "Pulling; Return (pull back until the hands reach the front of the stomach; slowly straighten the elbows)"], ["fitnessvolt-cable-standing-row", "How to (drive your elbows behind your body, pull just below your chest; slowly extend your arms forward)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "scrow.mis.lean", "s": [["fitnessvolt-cable-standing-row", "How to / tips (avoid leaning too far back or forward)"], ["ace-335", "Starting position (standard: hips straight, back tall) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Single Arm Cable Row": {
    "setup": [
      {"c": "cr1.setup", "s": [["ace-337", "Upward phase (attach a single handle to the cable pulley; pull with the left hand)"], ["healthline-seated-row", "Make it harder (use one arm at a time)"]]}
    ],
    "move": [
      {"c": "cr1.pull", "s": [["ace-337", "Upward/downward phase (pull the cable back towards the body; slowly straighten the arm)"], ["healthline-seated-row", "Make it harder (with one arm, pull the cable along the side of your body); How to do a seated row (slowly extend the arms)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mis.jerk", "s": [["healthline-seated-row", "Common mistakes to avoid — Swinging torso; Rapid movements"], ["ace-337", "Downward phase (standard: slowly straightening the arm) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Face Pull": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "mis.jerk", "s": [["nasm-face-pull", "Common Mistakes (jerky or uncontrolled movements)"], ["majorfitness-face-pull", "Common mistakes — Using momentum to force a rep (avoid using your legs to throw the weight back)"]]}
    ]
  },
  "Cable Rope Rear-Delt Rows": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "rdcr.mis.elbowsIn", "s": [["wniosek", "rdcr.pull"]]}
    ]
  }
}
```

Cable Rope Rear-Delt Rows: pełna karta (setup/move) — z bloku W1; tutaj tylko dopisany błąd.

## Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| `scrow.setup` | Ustaw wyciąg mniej więcej na wysokości klatki, chwyć uchwyt oburącz i stań przodem do maszyny, kolana lekko ugięte. | Set the cable at about chest height, grab the handle with both hands and stand facing the machine, knees slightly bent. | ACE 335 + FV (wysokość: „about chest-height” / „about lower chest height”; kolana lekko ugięte — oba). Zastępuje kandydata W1 o tym samym id (tamten bez wysokości). Uchwyt: ACE — dwa uchwyty, FV — uchwyt V; „uchwyt oburącz” to część wspólna |
| `scrow.pull` | Przyciągnij uchwyt do tułowia, potem wróć powoli, pod kontrolą. | Pull the handle to your torso, then return slowly and under control. | Brzmienie kandydata W1 bez zmian; teraz ACE 335 („front of stomach”, „slowly straighten”) + FV („just below your chest”, „slowly extend”) — „do tułowia” jako część wspólna brzucha i dołu klatki |
| `scrow.mis.lean` | Odchylanie albo pochylanie tułowia, żeby dociągnąć ciężar. | Leaning back or forward to pull the weight in. | FV wprost („Avoid leaning too far back or forward”) + ACE standard („the hips straight, the back tall”) — reguła „błąd = zaprzeczenie standardu” |
| `rdcr.mis.elbowsIn` | Łokcie przy tułowiu zamiast szeroko na boki. | Elbows tucked in instead of out wide. | WNIOSKOWANY: zaprzeczenie `rdcr.pull` („Łokcie szeroko na boki…”). W1 odnotowała ten błąd wprost w Major Fitness (strona „How to Do a Cable Rear Delt Row”, odczyt W1 02.11.2026; w W2 nieczytane ponownie) — wzmocnienie kierunku |

Zdania W1 przywrócone (były w W1, spadły przy przeliczeniu jako jednoźródłowe): `cr1.setup`, `cr1.pull` (PL/EN jak w W1, sekcja 4). Istniejące użyte: `mis.jerk`.

## Źródła

| id | Adres | Organizacja | Szczebel (uzasadnienie) | Co przeczytano (WebFetch 02.11.2026) |
|---|---|---|---|---|
| `ace-335` | https://www.acefitness.org/resources/everyone/exercise-library/335/standing-row/ | ACE | 4 — organizacja certyfikująca trenerów, biblioteka firmowana (jak `ace-337` w W1) | Starting position, Pulling, Return — wyciąg na wysokości klatki, dwa uchwyty, łokcie przy bokach, pauza przy brzuchu, powolny powrót |
| `fitnessvolt-cable-standing-row` | https://fitnessvolt.com/cable-standing-row/ | Fitness Volt | 4 — uzup. 3: autor z kwalifikacjami i data: „Matthew Magnante, ACE” (certyfikat ACE), publikacja 27.10.2020, zmiana 15.09.2024 | kroki (uchwyt V, wysokość dołu klatki, krok w tył, ruch łokci za tułów, powolny powrót); wskazówki: bez oszukiwanych powtórzeń, „Avoid leaning too far back or forward” |
| `ace-337` | https://www.acefitness.org/resources/everyone/exercise-library/337/single-arm-row/ | ACE | 4 (W1) | ponownie: pozycja wyjściowa stojąc, pojedynczy uchwyt, ciągnięcie do tułowia, pauza, powolny wyprost |
| `healthline-seated-row` | https://www.healthline.com/health/seated-row | Healthline | 4 — uzup. 3: „Medically reviewed by Gregory Minnis, DPT — Written by Kirsten Nunez on May 31, 2019” (sprawdzone ponownie 02.11.2026) | „Make it harder” (wersja jednorącz), nagłówki „Common mistakes to avoid” (m.in. Swinging torso, Rapid movements, Shrugged shoulders) |
| `nasm-face-pull` | https://www.nasm.org/resource-center/exercise-library/face-pull | NASM | 4 (istniejące w `cues.json`) | kroki 1–4 i „Common Mistakes” (m.in. „Jerky or uncontrolled movements”, „Allowing the shoulders to shrug”) |
| `majorfitness-face-pull` | https://www.majorfitness.com/blogs/training-tips/how-to-do-the-face-pull | Major Fitness | 4 — producent sprzętu kablowego, własny rodzaj sprzętu (jak `majorfitness-cable-rear-delt-row` w W1); treść firmowana, data 02.03.2026, bez autora | Start/Execution/End Position, „Common mistakes” (Insufficient external rotation, Using momentum to force a rep, Adding more weight than you can handle), FAQ o odchylaniu się |

## Otwarte i uwagi dla koordynatora

- **Single Arm Cable Row — siła drugiego źródła:** Healthline opisuje wersję jednorącz dwoma zdaniami w sekcji „Make it harder” (siedząc, jedna stopa na podłodze, druga na podeście); ACE — stojąc. Zdania `cr1.*` nie mówią o pozycji ciała, więc są częścią wspólną; rysunek pokazuje wersję stojąc (zgodnie z ACE). Jeśli koordynator uzna wzmiankę Healthline za zbyt krótką, karta wraca do „otwarte” (jak po przeliczeniu W1).
- **Standing Cable Row — rysunek:** wyciąg ma `y: 100` przy maszynie `h: 230` (`lib/figures/v2/poses/cable_row.json`, wpis „Standing Cable Row”) — to raczej wysokość pasa niż klatki; źródła: „about chest-height” (ACE), „about lower chest height” (FV). Do sprawdzenia przy recenzji rysunku (jednostek nie weryfikowałem). Rysunek ma drążek (`chwyt: drazek`), źródła — dwa uchwyty / uchwyt V; zdanie mówi ogólnie „uchwyt”.
- **Standing Cable Row — zestaw ogólny** (`scr.chest`, `row.fullStretch`, `scr.control`) zostaje zastąpiony kartą; `scr.chest` częściowo zgodne (ACE „Lift the chest”, FV „chest up, shoulder blades back”) — nie dodane, bo karta mieści się w minimum; można dodać jako wskazówkę po decyzji.
- **Cable Rope Rear-Delt Rows — rysunek:** w `cable_row.json` wpis tego ćwiczenia ma ławkę z siedziskiem (wersja siedząc), a `rdcr.setup` (W1) mówi „cofnij się, aż linka się napnie” (wersja stojąc, wszystkie trzy źródła W1). Sprzeczność karta–rysunek do rozstrzygnięcia przed wdrożeniem (rysunek albo zdanie).
- **Face Pull — uwaga do wskazówki `fp.elbowsBack`:** Major Fitness w „Common mistakes” pisze „Make sure you don't try and pull the elbows too far back” (łokcie w linii górnej części pleców); NASM: „driving your elbows backward”. Nie przeczy to wprost obecnemu zdaniu, ale przy recenzji karty warto sprawdzić, czy rysunek nie przesadza z cofnięciem łokci. Wzruszanie barkami jako błąd — tylko NASM (jedno źródło).
- **Kneeling High Pulley Row** — [OTWARTE]: ACE ma tylko wersje stojąc („High Row”, 336) i siedząc („Seated High Back Row”, 46) — nie użyte jako analogia, bo klęk zmienia ustawienie; pozostałe trafienia to aplikacje, Physitrack (5) i strony zamienników Fitness Volt (5).
- **Leverage High Row, Sled Row** — [OTWARTE] bez zmian względem W1; w W2 nie szukano ponownie (limit kontekstu; W1 wyczerpała oczywiste ścieżki).
- Zdania nowe (`scrow.setup`, `scrow.pull`, `scrow.mis.lean`, `rdcr.mis.elbowsIn`, a także `cr1.setup`, `cr1.pull`) trzeba dodać do `lib/cues/text/pl.json` i `en.json`, a jeśli `check:claims` je rozpozna — do rejestru twierdzeń; źródła `ace-335`, `fitnessvolt-cable-standing-row`, `majorfitness-face-pull`, `catalyst-reverse-grip-bent-row` (row) — do sekcji `sources` w `data/zrodla/cues.json`.
