# bench_press — wskazówki techniki, fala W2, część 3: Floor Press with Chains (badacz-merytoryczny, 02.11.2026)

Wejście: `bench_press-cz1.md`, `bench_press-cz2.md` (W2; „Zostało” pkt 1), W1 `bench_press-cz2.md` (karta „Bench Press with Chains”,
otwarte: Floor Press with Chains, sygnał `bp.control`). Szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md` i przeliczenia z 02.11.2026.
Strony przeczytane WebFetch 02.11.2026. Rysunek: `lib/figures/v2/variants.ts:111` — `BP('chain', { floor: true, vert: true })`;
zestaw ogólny dziś: `lib/figures/v2/cue-sets.json:230` (`bp.blades`, `bp.control`, `mis.jerk`).

## Ćwiczenia

| Ćwiczenie | Stan | Uwaga |
|---|---|---|
| Floor Press with Chains | **gotowe — warunkowo, do recenzji** | ustawienie i ruch: BarBend (4) + Performance Menu (wydawca Catalyst Athletics; szczebel 4 warunkowo — autor bez kwalifikacji trenerskich). Oba teksty wymieniają łańcuchy jako dodatek do wyciskania z podłogi. Błąd wnioskowany `flp.mis.short`; `chain.setup` i `chain.mis.slow` z karty Bench Press with Chains jako uproszczenie. Jeśli Performance Menu = 5 → otwarte (zostaje tylko BarBend) |

Sygnały zestawu ogólnego: `bp.control` („…bez odbijania od klatki”) — nie pasuje (w wyciskaniu z podłogi ruch kończy się na łokciach na podłodze,
nie na klatce; przy łańcuchach Westside każe opuszczać szybko — W1); `bp.blades` — tylko Performance Menu („squeeze the shoulder blades together”)
i W1 RNT Fitness (szczebel nieustalony) — nie dodaję. Przy karcie własnej oba znikają.

## Blok do wdrożenia

### Blok do wdrożenia

```json
{
 "Floor Press with Chains": {
  "setup": [
   {"c": "flp.setup", "s": [["barbend-floor-press", "How to Do the Floor Press, krok 1 (start by positioning yourself on the floor underneath the barbell; grip the bar firmly)"], ["performancemenu-floor-press", "opis wykonania (lie down on the floor with your legs straight out and grip the bar)"]]},
   {"c": "chain.setup", "uproszczenie": "wariant sprzętu Bench Press with Chains — łańcuchy zawieszone na końcach gryfu tak samo; leżysz na podłodze zamiast na ławce, więc przy dolnym położeniu sztangi łańcuchy też leżą na podłodze", "s": [["barbend-floor-press", "Variations: Floor Press with Chains/Bands (add bands or chains to the sides of the bar)"], ["nasm-bench-press-chains", "Step 1: Setup (slack at the bottom, rise as you press) — W1"], ["westside-chains-bands", "Chain Setup (at the chest all of the chain on the floor) — W1"]]}
  ],
  "move": [
   {"c": "flp.move", "s": [["barbend-floor-press", "How to Do the Floor Press (once the back of your arms touches the floor, stay tense and reverse the movement; drive until the elbows fully extend)"], ["performancemenu-floor-press", "opis wykonania (lower the bar until the elbows contact the floor; pause for a brief interval, then press back up)"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "flp.mis.short", "s": [["wniosek", "flp.move"]]},
   {"c": "chain.mis.slow", "uproszczenie": "wariant sprzętu Bench Press with Chains — łańcuchy tak samo dokładają ciężaru w górnej części ruchu", "s": [["nasm-bench-press-chains", "Common Mistakes: not accelerating through the top — W1"], ["westside-chains-bands", "Technique Cues: Speed — W1"]]}
  ]
 }
}
```

Uwagi dla recenzenta: (1) nogi celowo pominięte — BarBend: proste albo ugięte, Performance Menu: proste (ugięcie = praca nóg); część wspólna nie
istnieje, więc zdanie o nogach z W1 (`flp.setup` „nogi wyprostowane, pięty wbite w podłogę”) nie wchodzi. (2) Pauza na dole: Performance Menu —
krótka pauza, BarBend — „stay tense and reverse”; `flp.move` nie mówi o pauzie (część wspólna: łokcie na podłodze, potem wypchnięcie).
(3) `chain.mis.slow` i `chain.setup` są opcjonalne — karta ma ustawienie, ruch i błąd także bez nich. (4) `flp.mis.short` — zaprzeczenie
„aż łokcie dotkną podłogi”; widoczne na rysunku (łokcie nad podłogą w dolnym położeniu).

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| flp.setup (zmiana propozycji W1) | Połóż się na podłodze pod sztangą i chwyć ją pewnie. | Lie on the floor under the bar and grip it firmly. |
| flp.move (zmiana propozycji W1) | Opuść sztangę, aż łokcie dotkną podłogi, potem wypchnij ją do wyprostu rąk. | Lower the bar until your elbows touch the floor, then press it back up to lockout. |
| flp.mis.short | Zatrzymywanie sztangi, zanim łokcie dotkną podłogi. | Stopping the bar before your elbows touch the floor. |

`chain.setup`, `chain.mis.slow` — teksty z W1 (`bench_press-cz2.md`), bez zmian. Uwaga do `chain.setup`: brzmienie „przy klatce leżały na podłodze” pasuje też tu (sztanga nad klatką w dolnym położeniu).

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| barbend-floor-press (NOWE) | https://barbend.com/floor-press/ | BarBend; M. Dewar (MS Exercise Physiology, CSCS), akt. 17.06.2024; bez recenzenta | 4 — warunki BarBend z pliku szczebli: autor z kwalifikacjami i data na stronie | How to Do the Floor Press: „Once the back of your arms touches the floor, stay tense and reverse the movement.”; Variations: Floor Press with Chains/Bands |
| performancemenu-floor-press (NOWE) | https://www.performancemenu.com/article/199/The-Floor-Press/ | „The Performance Menu Journal”, nr 24, styczeń 2007, wydawca Catalyst Athletics, Inc.; autor S. Shafley (zawodnik trójboju, podnoszenia ciężarów i strongman, BS Biology) | **4 warunkowo — do decyzji koordynatora**: wydawca to organizacja ze szczeblem 4 (wiersz Catalyst), data widoczna; autor bez certyfikatu trenerskiego. Jeśli wymagane kwalifikacje trenerskie autora → 5 i karta wraca do „otwarte” | opis wykonania: „Lower the bar until the elbows contact the floor.”; łańcuchy i gumy jako dodatek („Band and chains make an excellent addition to this movement”) |
| nasm-bench-press-chains, westside-chains-bands (W1) | jak w W1 `bench_press-cz2.md` | NASM; Westside Barbell | 4; 4 | miejsca jak w karcie Bench Press with Chains (nie otwierane ponownie) |

Przeczytane, nieużyte: Barbell Logic „How To Floor Press” (https://barbell-logic.com/how-to-floor-press/ — bez autora i daty → 5; nogi proste,
pauza na łokciach); Westside „Dynamic Effort Upper Week 34 Day 4” (https://www.westside-barbell.com/a/blog/dynamic-effort-upper-week-34-day-4-copy —
L. Simmons, 09.07.2018; tylko program i liczby procentowe, techniki nie opisuje; liczb nie przenoszę).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Floor Press with Chains — szczebel Performance Menu | od niego zależy cała karta (drugie źródło ustawienia i ruchu) |
| `bp.blades` (łopatki) | Performance Menu + RNT Fitness (W1, szczebel nieustalony) — za mało |
| Nogi (proste / ugięte) | sprzeczność BarBend vs Performance Menu na tym samym szczeblu; pominięte |
| `bp.control` przy łańcuchach | bez zmian względem W1: Westside — szybko, bez pauzy; NASM — kontrolowanie; zdanie mówi o klatce, nie pasuje do wyciskania z podłogi |
| „Odbijanie łokci od podłogi” jako błąd | tylko RNT (W1); Performance Menu każe zrobić pauzę, ale nie nazywa odbicia błędem — nie dodaję |

## Podsumowanie
- Ćwiczeń zbadanych: 1 (Floor Press with Chains).
- Nowe karty z błędami: 1 (warunkowo — zależy od szczebla Performance Menu); bez błędów: 0.
- Błędy wnioskowane: 1 (`flp.mis.short`); błędy z uproszczeniem: 1 (`chain.mis.slow`).
- Role mięśni: bez luk w zakresie — 0. Otwarte: 5 pozycji (tabela wyżej).
- Nowe zdania: 1 (`flp.mis.short`) + 2 zmiany propozycji W1 (`flp.setup`, `flp.move`).

## Zostało
- Jeśli Performance Menu = 5: drugie źródło szczebla 4 o wyciskaniu z podłogi (NASM/ACE/ISSA nie znalezione w wyszukiwaniu; elitefts — adresy często 404).
