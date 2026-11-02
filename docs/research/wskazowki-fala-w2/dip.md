# dip — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Zasady: CLAUDE.md „Merytoryczne podstawy” i „Wyjątek dla wskazówek techniki”; szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md`
(uzupełnienia 1–3) i przeliczenia G5 (rozstrzygnięcia koordynatora 1.1, 02.11.2026). Wszystkie strony przeczytane 02.11.2026 przez WebFetch.
Punkt wyjścia: wynik W1 (`dip.md` na gałęzi `badania/g5-pchanie`) — wszystkie 4 ćwiczenia otwarte.

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Chest Dip | **gotowe** (ustawienie + ruch + 3 błędy) | 2 niezależne źródła szczebla 4 (ISSA, BarBend). Własna karta zastępuje zestaw ogólny `dip` (`bdip.*` z ławki). Rysunek: tułów pochylony (`pochylenieTulowia` 28) — zgodne z `dip.chestLean`. |
| Triceps Dip | otwarte | Ustawienie i ruch na poręczach są te same co w Chest Dip, ale ISSA opisuje wersję z pochyleniem na klatkę („chest dip”), a brief zabrania rozciągania uproszczenia na inną pozycję ciała. Zostaje 1 źródło szczebla 4 (BarBend: „torso nearly vertical”). Kandydaci niżej. Do decyzji recenzenta: czy ustawienie (`dip.setup`) i ruch (`dip.move`) można przenieść, bo nie zależą od pochylenia — wtedy karta częściowa z błędem `dip.mis.depth` (BarBend + ISSA). |
| Ring Dips | otwarte | Tylko BarBend (krótki akapit o kółkach w artykule o dipach). McKenzie 2022 (szczebel 3) porównuje kółka z poręczami, ale nie opisuje wykonania („self-moderated technique”, bez wskazówek). Kółka jako „wariant sprzętu” poręczy — niesprawdzone (niestabilny chwyt zmienia pracę barku; to samo badanie traktuje je jako osobny wariant) → nie stosuję uproszczenia. |
| Dip Machine | otwarte | Bez zmian względem W1: tylko Hoist RS-1101 (instrukcja własnej maszyny). Precor DPL0521 (strona produktu producenta) nie zawiera instrukcji (tylko wzmianka o tabliczce z kodem QR); Titan Fitness — 403; instrukcja PL-3101 (plik PDF w sklepie) — bez nazwy producenta, nieczytelna. Kandydaci `dipm.*` z W1 bez zmian. |

## Blok do wdrożenia

### Blok do wdrożenia

```json
{
 "Chest Dip": {
  "setup": [
   {"c": "dip.setup", "s": [
    ["issa-chest-dips", "How to Perform the Chest Dip (with your body in between two bars, place both hands on the dip bar; feet off the ground and arms are straight)"],
    ["barbend-dips", "How to Do the Dip, krok 1 (set your hands evenly on the bars); akapit Ring Dips (start w wyproście — steady at lockout before dipping down)"]
   ]}
  ],
  "move": [
   {"c": "dip.move", "s": [
    ["issa-chest-dips", "How to Perform the Chest Dip (bending at the elbows and lowering your body down; press your body back up to the starting position)"],
    ["barbend-dips", "How to Do the Dip (flex your elbows and lower your body; drive through your palms to raise your body back to the starting position)"]
   ]}
  ],
  "tips": [
   {"c": "dip.chestLean", "s": [
    ["issa-chest-dips", "How to Perform the Chest Dip (maintain a slight forward lean to emphasize the strain on your chest)"],
    ["barbend-dips", "How to Do the Dip (nearly vertical, with perhaps a slight lean forward); Common Mistakes — Letting Your Chest Sink (slight forward lean)"]
   ]},
   {"c": "plank.brace", "s": [
    ["issa-chest-dips", "How to Perform the Chest Dip (keep your core engaged)"],
    ["barbend-dips", "How to Do the Dip (your core tight)"]
   ]}
  ],
  "mistakes": [
   {"c": "dip.mis.depth", "s": [
    ["issa-chest-dips", "What to Avoid When Performing Chest Dips (going too low, not going low enough)"],
    ["barbend-dips", "Common Mistakes — Going Too Low; Not Going Low Enough"]
   ]},
   {"c": "dip.mis.leanBack", "s": [
    ["issa-chest-dips", "What to Avoid When Performing Chest Dips (leaning back)"],
    ["barbend-dips", "How to Do the Dip (slight lean forward) — błąd = zaprzeczenie standardu"]
   ]},
   {"c": "dip.mis.overLean", "s": [
    ["barbend-dips", "Common Mistakes — Letting Your Chest Sink (leaning too far forward)"],
    ["issa-chest-dips", "How to Perform the Chest Dip (slight forward lean) — błąd = zaprzeczenie standardu"]
   ]}
  ]
 }
}
```

Uwagi do bloku:
- Głębokość jako liczba (łokieć ok. 90°, ramię równolegle do podłogi) — NIE w karcie: BarBend podaje 90° / „parallel or slightly below”, a ISSA zdanie o ramieniu równoległym ma tylko w wariancie „Straight Bar Dips” (sekcja „Chest Dip Variations”; nie wiadomo, czy to jeden drążek). Zostaje 1 źródło → otwarte. Dlatego `dip.mis.depth` jest jakościowy.
- `mis.jerk` (zestaw ogólny) — ISSA wymienia „going too fast” tylko z nazwy, BarBend nie → 1 źródło, otwarte; nie ma go w karcie.
- Uzasadnienia zdrowotne błędów (ISSA: „excessive strain on the chest and shoulders”; BarBend: obciążenie barków) — nie w aplikacji (twierdzenie o zdrowiu wymaga szczebla 1–2).

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| dip.setup | Chwyć poręcze i unieś się na prostych rękach, stopy nad podłogą. | Grab the bars and push up onto straight arms, feet off the floor. |
| dip.move | Zegnij łokcie i opuść się między poręczami, potem wypchnij się z powrotem do prostych rąk. | Bend your elbows to lower yourself between the bars, then push back up to straight arms. |
| dip.chestLean | Pochyl tułów lekko w przód. | Lean your torso slightly forward. |
| dip.mis.depth | Schodzenie za nisko albo zatrzymywanie się za wysoko. | Dropping too low or stopping too high. |
| dip.mis.leanBack | Odchylanie tułowia do tyłu. | Leaning back. |
| dip.mis.overLean | Za mocne pochylenie — klatka leci w dół między poręcze. | Leaning too far forward and letting your chest sink between the bars. |

Istniejące użyte: `plank.brace` („Napnij brzuch, żeby tułów był sztywny.”) — treść pasuje dosłownie (oba źródła: brzuch napięty w trakcie ruchu).
Prefiks `dip.*` jest wolny w `lib/cues/text/pl.json` (jest tylko `bdip.*` — ławka).

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| issa-chest-dips | https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid | ISSA | 4 — organizacja szkoląca i certyfikująca trenerów; artykuł firmowany „By ISSA”, data 05.02.2024 na stronie (warunek z pliku szczebli: autor i data albo firmowanie „ISSA”) | „How to Perform the Chest Dip”; „Chest Dip Variations”; „What to Avoid When Performing Chest Dips” |
| barbend-dips | https://barbend.com/dips/ | BarBend | 4 (warunkowo 4 — artykuł techniki): autor Mike Dewar (MS Exercise Physiology, CSCS), aktualizacja Alex Polish (ACE-CPT) 01.03.2024, „Expert Verified” — Jake Dickson (CPT-NASM, USAW-L2); w części z krokami brak linków sprzedażowych | „How to Do the Dip” (kroki); „Common Mistakes” (Going Too Low, Not Going Low Enough, Letting Your Chest Sink); akapit „Ring Dips” |
| fitnessvolt-dips | https://fitnessvolt.com/chest-dips-vs-triceps-dips/ | Fitness Volt | 5 — autor Patrick Dale („PT, ex-Marine”), ale bez nazwanego recenzenta i bez daty widocznej na stronie (daty tylko w metadanych) → reguła ogólna uzupełnienia 3 niespełniona; tylko wskazówka, nie liczy się | „How to Do Chest-Focused Dips”; „How to Do Triceps-Focused Dips” |
| W1G5-3 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9603242/ | McKenzie i in., IJERPH 2022;19(20):13211 | 3 — badanie recenzowane; bez opisu techniki (2.3: „self-moderated technique and ROM”, „No coaching cues were provided”) → nie potwierdza żadnego zdania techniki | 2.2–2.3 |
| mckenzie-fatigue-2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9659300/ | McKenzie i in., IJERPH 2022;19(21):14390 (ten sam zespół) | 3 — jw., bez instrukcji techniki (2.3); jedyne kryterium: powtórzenie bez pełnego wyprostu łokci nieliczone (2.4) | 2.3–2.4 |
| hoist-rs-1101 | https://www.hoistfitness.com/pages/rs-1101-seated-dip | HOIST (producent) | 4 tylko dla tej maszyny | „How Do I Use This Machine?” kroki 1–5 (odczyt ponowny 02.11.2026 — bez zmian) |
| precor-dpl0521 | https://files.precor.com/en-GB/products/DPL0521 | Precor (producent) | 4 tylko dla tej maszyny — ale strona nie zawiera instrukcji wykonania (tylko „Simple placard with QR code offers step-by-step instructions”) | opis produktu |

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Triceps Dip — karta | 1 źródło szczebla 4 dla wersji z prostym tułowiem (BarBend „torso nearly vertical”); Fitness Volt („Hold a mostly upright torso”) = 5. Kandydaci: `dip.setup`, `dip.move`, `dip.mis.depth` (jak Chest Dip) + nowe `dip.upright` „Trzymaj tułów prawie pionowo.” / „Keep your torso nearly upright.” Potrzebne drugie źródło szczebla 4 o wersji „na triceps” albo decyzja recenzenta o przeniesieniu ustawienia i ruchu z Chest Dip. |
| Ring Dips — karta | BarBend (akapit „Ring Dips”: kółka na wysokości poręczy, wskocz do podporu, ustabilizuj się w wyproście przed zejściem) — 1 źródło. Kandydaci: `dip.rings` „Ustaw kółka na wysokości poręczy i zanim zaczniesz, złap równowagę na prostych rękach.” / „Set the rings at dip-bar height and get steady on straight arms before you start.” |
| Dip Machine — karta | 1 źródło (Hoist). Do sprawdzenia: instrukcja Precor (tabliczka QR, broszura), Titan Fitness (403), oryginał Life Fitness (support.lifefitness.com — 403 w W1). |
| Chest Dip / Triceps Dip — głębokość liczbowo (łokieć ok. 90°, ramię równolegle) | BarBend tak; ISSA tylko w wariancie „Straight Bar Dips” (niejasne, czy to jeden drążek); Fitness Volt (5): „roughly right-angle elbow bend is a useful reference, not a rule”. 1 źródło szczebla 4 → otwarte. |
| Chest Dip — `mis.jerk` / za szybko | tylko ISSA (nazwa błędu bez opisu) |
| Chest Dip — łopatki ściągnięte, mocny chwyt | tylko BarBend („Squeeze your shoulder blades together and squeeze the bars hard”) |
| Chest Dip — łokcie lekko na boki | tylko Fitness Volt (5) |
| zestaw ogólny `dip` (`bdip.move`, `bdip.range`, `mis.jerk`) dla Triceps Dip, Ring Dips, Dip Machine | Sygnał z W1 bez zmian: zdania z ławki nie pasują do poręczy, kółek ani maszyny. Po wdrożeniu Chest Dip warto, by zestaw ogólny poręczy korzystał z `dip.setup`/`dip.move` zamiast `bdip.*` — decyzja programisty/koordynatora (zestawy ogólne nie są w tym pliku). |

## Podsumowanie

Ćwiczeń zbadanych: 4. Nowe karty z błędami: 1 (Chest Dip: 3 błędy ze źródeł), bez błędów: 0. Błędy wnioskowane: 0 (wszystkie 3 ze źródeł, w tym 2 jako „błąd = zaprzeczenie standardu”). Role gotowe: 0 (luka Dip Machine — `role-miesni-fala-w2/dip.md`). Otwarte: 3 ćwiczenia (Triceps Dip, Ring Dips, Dip Machine). Nowe zdania: 6 (+3 kandydaci w otwartych: `dip.upright`, `dip.rings`, z W1 `dipm.*`).
