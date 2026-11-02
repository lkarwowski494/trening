# Wskazówki techniki — rodzina `glute_floor` (fala W2, G4)

Data: 02.11.2026 · rodzina: `glute_floor` · status: **PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Podstawa: wyniki W1 (gałąź badania/g4-nogi, plik `glute_floor.md`, oraz przeliczenie szczebli z 02.11.2026 — Donkey Kick i Clamshell
gotowe), szczeble wg `szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211). Kryterium karty (docs/18:147): ustawienie + ruch
+ min. 1 błąd (wszystkie 7 ćwiczeń rodziny mają pozy v2). Żadne ćwiczenie rodziny nie ma trybu `own` w `lib/figures/v2/cue-sets.json`
(wiersze 103, 138, 188, 226, 267, 371, 451 — tryb `general`).

## Ćwiczenia

| ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Donkey Kick | tak | gotowe z błędem | błąd wnioskowany `dk.mis.straight` (z `dk.move`) | — |
| Clamshell | tak | **gotowe z błędem** (było: bez błędu) | `clam.mis.roll` (NASM + Catalyst, błąd = zaprzeczenie standardu), `clam.mis.feet` (wniosek z `clam.move`); poprawione miejsca w NASM (strona nie ma sekcji „Setup/Movement”) | — |
| Fire Hydrant | tak | **gotowe z błędem** (było: otwarte) | błąd `fh.mis.twist` (ISSA + ACE 6402, zaprzeczenie standardu `fh.level`); karta wg kryterium W2 nie wymaga drugiej wskazówki | `plank.brace` (1 źródło) poza kartą |
| Cable Kickback | tak | **gotowe z błędem** (było: otwarte) | `ck.mis.sway` (BarBend jawnie + ACE 6355 standard), `hext.mis.arch` (BarBend + HSS — uproszczenie: wariant sprzętu guma) | `ck.slow` (1 źródło) poza kartą |
| Hip Extension with Bands | tak | **gotowe z błędem** (było: otwarte) | nowe źródło HSS (4) + BarBend band (4) + Performance Health (4 dla gum, wariant); `hexb.setup` (nowe brzmienie, guma na obu kostkach — zgodne z pozą), `ck.move`, `plank.brace`, `hext.mis.arch` | — |
| Machine Glute Kickback | tak | otwarte | — | brak źródła szczebla 4 (instrukcja Hoist tylko w kopii manualsdir, inna maszyna — Glute Master) |
| Prone Flutter Kicks | tak | otwarte | — | brak źródła szczebla 4 (nie szukano ponownie w W2) |

Uproszczenia w kartach (do oznaczenia przy integracji): Fire Hydrant `fh.level`/`fh.mis.twist` — ACE 6402 opisuje wariant „Two-legged
Fire Hydrant” (z uniesioną ręką); Cable Kickback `hext.mis.arch` — HSS opisuje wersję z minigumą (`uproszczenie: wariant sprzętu
Hip Extension with Bands` — ten sam wyprost biodra na stojąco przeciw oporowi przy kostce, różni się tylko źródło oporu); Hip Extension
with Bands `ck.move`, `hext.mis.arch` — Performance Health opisuje wersję na desce balansowej (ruch nogi ten sam).

### Blok do wdrożenia

```json
{
  "Clamshell": {
    "setup": [{"c": "clam.setup", "s": [["nasm-blog-banded-clamshell", "How to Perform a Banded Clamshell (lie on one side with the knees bent and stacked)"], ["ace-pro-6315", "Clam Shells (leżenie na boku, kolana ugięte, nogi jedna na drugiej)"], ["catalyst-766", "opis (Lie on one side with the knees bent to approximately 90 degrees)"]]}],
    "move": [{"c": "clam.move", "s": [["nasm-blog-banded-clamshell", "How to Perform a Banded Clamshell (Keeping the feet together… lifts the top knee as high as possible; slow and controlled)"], ["ace-pro-6315", "Clam Shells (Keeping the inner arches of the feet together, externally rotate the top leg)"], ["catalyst-766", "opis (lift the top knee as far as possible and return under control)"]]}],
    "tips": [
      {"c": "clam.noRoll", "s": [["nasm-blog-banded-clamshell", "How to Perform a Banded Clamshell (without allowing the hips to rotate backward)"], ["catalyst-766", "opis (Without rolling the body)"]]},
      {"c": "llc.control", "s": [["nasm-blog-banded-clamshell", "How to Perform; Coaching (avoid using momentum)"], ["catalyst-766", "opis (return under control)"]]}
    ],
    "mistakes": [
      {"c": "clam.mis.roll", "s": [["nasm-blog-banded-clamshell", "How to Perform; FAQ (bez odchylania miednicy do tyłu — błąd = zaprzeczenie standardu)"], ["catalyst-766", "opis (Without rolling the body — błąd = zaprzeczenie standardu)"]]},
      {"c": "clam.mis.feet", "s": [["wniosek", "clam.move"]]}
    ]
  },
  "Donkey Kick": {
    "setup": [{"c": "bd.setup", "s": [["ace-270", "Step 1 (knees directly under your hips, hands directly under your shoulders)"], ["issa-donkey-kicks", "How to Do a Donkey Kick Correctly (Start on all fours…)"]]}],
    "move": [{"c": "dk.move", "s": [["issa-donkey-kicks", "How to Do a Donkey Kick Correctly (stopa w stronę sufitu; The movement should be slow.)"], ["ace-270", "Step 2 (while maintaining your bent-knee position)"]]}],
    "tips": [
      {"c": "plank.brace", "s": [["ace-270", "Step 1/2 (Stiffen your core and abdominal muscles)"], ["issa-donkey-kicks", "How to Do… (Engage and tighten your core)"]]},
      {"c": "hext.range", "s": [["ace-270", "uwaga po kroku 3 (Only raise the leg to a height where the low back position can be maintained)"], ["issa-donkey-kicks", "How to Do… (Don't lift so high that your back starts to arch)"]]}
    ],
    "mistakes": [
      {"c": "hext.mis.arch", "s": [["issa-donkey-kicks", "How to Do… (za wysoko unoszona noga wygina plecy)"], ["ace-270", "uwaga po kroku 3 (an increase in lumbar lordosis)"]]},
      {"c": "dk.mis.straight", "s": [["wniosek", "dk.move"]]}
    ]
  },
  "Fire Hydrant": {
    "setup": [{"c": "bd.setup", "s": [["ace-pro-7409", "Fire Hydrant (Start in a quadruped position with the hands under the shoulders and knees under the hips)"], ["issa-hip-abduction", "Fire Hydrant (klęk podparty, dłonie w linii barków)"]]}],
    "move": [{"c": "fh.move", "s": [["ace-pro-7409", "Fire Hydrant (slowly lifting the right leg out to the side… keeping the knee bent)"], ["issa-hip-abduction", "Fire Hydrant (raising your right knee away from the body keeping the leg flexed)"]]}],
    "tips": [{"c": "fh.level", "s": [["ace-pro-6402", "Two-legged Fire Hydrant (keep your hips level) — wariant z uniesioną ręką"], ["issa-hip-abduction", "Fire Hydrant (without rotating or twisting the hips)"]]}],
    "mistakes": [{"c": "fh.mis.twist", "s": [["issa-hip-abduction", "Fire Hydrant (Raise the leg up as far as you can without rotating or twisting the hips — błąd = zaprzeczenie standardu)"], ["ace-pro-6402", "Two-legged Fire Hydrant (keep your hips level — błąd = zaprzeczenie standardu; wariant)"]]}]
  },
  "Cable Kickback": {
    "setup": [{"c": "ck.setup", "s": [["ace-pro-6355", "Single-leg cable extension (mankiet na kostce, niski wyciąg)"], ["barbend-glute-kickbacks", "How to Do the Glute Kickback, kroki 1–2 (lowest position; face the cable machine)"]]}],
    "move": [{"c": "ck.move", "s": [["ace-pro-6355", "Single-leg cable extension (Slowly raise the heel by initiating the movement from the glutes)"], ["barbend-glute-kickbacks", "How to Do the Glute Kickback (Squeeze your glute… as you drive your leg backward)"]]}],
    "tips": [{"c": "hab.hips", "s": [["barbend-glute-kickbacks", "Common mistakes: Not Bracing Properly (only contract your glutes)"], ["ace-pro-6355", "Single-leg cable extension (keeping an erect torso)"]]}],
    "mistakes": [
      {"c": "ck.mis.sway", "s": [["barbend-glute-kickbacks", "Common mistakes: Not Bracing Properly (don't flare your upper back, or sway your hips)"], ["ace-pro-6355", "Single-leg cable extension (keeping an erect torso — błąd = zaprzeczenie standardu)"]]},
      {"c": "hext.mis.arch", "s": [["barbend-glute-kickbacks", "Common mistakes: Not Bracing Properly (Do not allow your lower back to arch)"], ["hss-mini-band-hip-ext", "Diagonal hip extension, Cautions (Don't arch your lower back to get more range) — uproszczenie: wariant sprzętu guma"]]}
    ]
  },
  "Hip Extension with Bands": {
    "setup": [{"c": "hexb.setup", "s": [["hss-mini-band-hip-ext", "Diagonal hip extension: Setup (mini band around both ankles); shift your weight onto one leg"], ["barbend-band-glutes", "5. Resistance Band Glute Kickback (band at your ankles; shift your weight onto one leg)"]]}],
    "move": [{"c": "ck.move", "s": [["hss-mini-band-hip-ext", "Diagonal hip extension (Reach the other heel back… squeeze the glute… return slowly)"], ["barbend-band-glutes", "5. Resistance Band Glute Kickback (flex your glute to move it away from your body)"], ["ph-wobble-hip-ext", "Step Two (Extend your hip against the band and slowly return) — wariant: na desce balansowej"]]}],
    "tips": [{"c": "plank.brace", "s": [["hss-mini-band-hip-ext", "Diagonal hip extension (core engaged)"], ["barbend-band-glutes", "5. Resistance Band Glute Kickback (a solid core brace)"]]}],
    "mistakes": [{"c": "hext.mis.arch", "s": [["hss-mini-band-hip-ext", "Cautions (Don't arch your lower back to get more range)"], ["ph-wobble-hip-ext", "Step Two (Keep your back and neck straight — błąd = zaprzeczenie standardu; wariant: na desce balansowej)"]]}]
  }
}
```

## Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| clam.mis.roll | Biodra uciekają do tyłu, żeby kolano poszło wyżej. | Your hips roll back to get the knee higher. | NASM i Catalyst wprost: bez odchylania miednicy / tułowia; rysunek: miednica obraca się do tyłu |
| clam.mis.feet | Stopy się rozchodzą — górna idzie w górę razem z kolanem. | Your feet come apart — the top one lifts with the knee. | wniosek z `clam.move` („stopy razem”); bez tego ruch przestaje być rotacją uda |
| dk.mis.straight | Kolano się prostuje i noga idzie w tył jak przy kopnięciu. | Your knee straightens and the leg kicks back. | wniosek z `dk.move` („nie prostując kolana”) |
| fh.mis.twist | Biodra skręcają się albo przechylają, żeby noga poszła wyżej. | Your hips twist or tip to get the leg higher. | ISSA: „without rotating or twisting the hips”; ACE 6402: „keep your hips level” |
| ck.mis.sway | Biodra i tułów się bujają, żeby noga poszła dalej w tył. | Your hips and torso sway to get the leg further back. | BarBend wprost („sway your hips”, „flare your upper back”); ACE 6355: wyprostowany tułów |

Zdania z W1, które wchodzą tu do kart (propozycje W1 nieobecne jeszcze w `lib/cues/text/pl.json`): `clam.setup`, `clam.move`, `clam.noRoll`,
`dk.move`, `fh.move`, `fh.level`, `ck.setup`, `ck.move` — brzmienie z W1 (plik `glute_floor.md`, „Nowe zdania” i „Zdania wstrzymane”).
`hexb.setup` — **nowe brzmienie** (zastępuje propozycję W1 „Załóż gumę na kostkę i przytrzymaj się czegoś stabilnego”, której źródła
miały szczebel 5, a poza v2 ma gumę na obu kostkach — `glute_floor.json:1428–1431`):

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| hexb.setup | Załóż małą gumę na obie kostki i przenieś ciężar ciała na jedną nogę. | Loop a mini band around both ankles and shift your weight onto one leg. | HSS + BarBend: guma na kostkach, ciężar na jednej nodze |

Istniejące zdania użyte: `bd.setup`, `plank.brace`, `hext.range`, `hext.mis.arch`, `hab.hips`, `llc.control` (`lib/cues/text/pl.json:2–5, 135–144, 176, 242`).
Uwaga do brzmienia: `hext.mis.arch` mówi „gdy noga idzie w górę” — przy wyproście na stojąco noga idzie w tył; do oceny recenzenta lokalizacji.

## Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| nasm-blog-banded-clamshell | https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes | NASM | Heather Cherry (CPT, NBC-HWC); „Published 2021 – Updated July 22, 2026” (przeczytane 02.11.2026) | 4 — organizacja szkoląca trenerów, autor z kwalifikacjami i data |
| catalyst-766 | https://catalystathletics.com/exercise/766/Clamshell/ | Catalyst Athletics | biblioteka firmowana Catalyst Athletics, bez autora przy haśle (przeczytane 02.11.2026) | 4 — wiersz Catalyst w tabeli szczebli (firmowanie biblioteki) |
| ace-pro-6315 | (opis w W1, plik `hip_abd_add.md`) | ACE | W1 | 4 |
| ace-270 | https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/ | ACE | biblioteka ACE (W1) | 4 |
| issa-donkey-kicks | https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes | ISSA | treść firmowana ISSA, 05.02.2024 (W1) | 4 |
| ace-pro-7409 | https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/ | ACE | P. McCall, 30.10.2019 (W1) | 4 |
| ace-pro-6402 | https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/ | ACE | A. Chelik, 01.05.2017 (W1) | 4 (ta sama organizacja co 7409 — nigdzie nie w parze z ACE 7409) |
| issa-hip-abduction | https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes | ISSA | firmowane ISSA, 05.02.2024 (W1) | 4 |
| ace-pro-6355 | https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/ | ACE | Mollie Martin, 21.03.2017 (sprawdzone ponownie 02.11.2026) | 4 |
| barbend-glute-kickbacks | https://barbend.com/glute-kickbacks/ | BarBend | Eric Bugera, CSCS, CISSN; „Last updated on April 24th, 2024” (przeczytane 02.11.2026; sekcja wersji z wyciągiem to „How to Do the Glute Kickback”, nie „Cable Glute Kickback”) | 4 — artykuł o technice z autorem i datą |
| barbend-band-glutes | https://barbend.com/resistance-band-exercises-for-glutes/ | BarBend | Eric Bugera, CSCS, CISSN; akt. 17.11.2024 (przeczytane 02.11.2026; ćwiczenie nr 5 „Resistance Band Glute Kickback”) | 4 — ta sama organizacja co wyżej; nigdzie oba BarBend w jednej parze |
| hss-mini-band-hip-ext | https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners | HSS (org. `HSS` istnieje w `cues.json:48`) | „HSS Rehabilitation and Performance”, „Published 7/23/2026”; ćwiczenie „Diagonal hip extension” (Setup, Cautions) | 4 — szpitale, wiersz w tabeli szczebli (precedens HSS, firmowanie instytucji) |
| ph-wobble-hip-ext | https://www.performancehealthacademy.com/exercises/thera-band-wobble-board-hip-extension-with-band.html | Performance Health (TheraBand) | pole autora puste, data 18.02.2005 | 4 tylko dla ćwiczeń z gumą (producent gum — jak w W1 `calf_raise.md`); użyte wyłącznie przy Hip Extension with Bands jako wariant (deska balansowa) |

Cytaty (≤ 2 zdania): HSS, Cautions — „Don't arch your lower back to get more range.”; Performance Health, Step Two — „Extend your hip
against the band and slowly return, keeping your knee straight.”; BarBend (kickback), Not Bracing Properly — „Do not allow your lower
back to arch, don't flare your upper back, or sway your hips.”; NASM — „Keeping the feet together, the client lifts the top knee as high
as possible without allowing the hips to rotate backward.”

Wpisy `sources` do dopisania (format `cues.json`):

```json
{
  "hss-mini-band-hip-ext": {"org": "HSS", "title": "Mini band exercises for runners — Diagonal hip extension (HSS Rehabilitation and Performance, 23.07.2026)", "url": "https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners", "level": 4},
  "ph-wobble-hip-ext": {"org": "Performance Health", "title": "Thera-Band Wobble Board + Hip Extension with Band", "url": "https://www.performancehealthacademy.com/exercises/thera-band-wobble-board-hip-extension-with-band.html", "level": 4},
  "barbend-glute-kickbacks": {"org": "BarBend", "title": "Glute Kickbacks (E. Bugera, CSCS, 24.04.2024)", "url": "https://barbend.com/glute-kickbacks/", "level": 4},
  "barbend-band-glutes": {"org": "BarBend", "title": "The 7 Best Resistance Band Exercises for Glutes (E. Bugera, CSCS, 17.11.2024)", "url": "https://barbend.com/resistance-band-exercises-for-glutes/", "level": 4}
}
```

Pozostałe źródła (`ace-pro-7409`, `ace-pro-6402`, `ace-pro-6355`, `issa-hip-abduction` oraz źródła kart Clamshell i Donkey Kick) — wpisy
JSON jak w W1 (`glute_floor.md`, blok `sources`) + nowe rekordy dla czterech źródeł „tylko w Dane częściowe” wg W1. Klucz organizacji
Performance Health — taki jak w propozycji W1 dla `calf_raise` (do ujednolicenia przy integracji).

## Otwarte

- **Machine Glute Kickback** — bez źródła szczebla 4. Wyszukiwanie 02.11.2026: jedyna instrukcja producenta (Hoist CL-2412 „Glute Master”)
  to kopia w serwisie z instrukcjami (manualsdir) i inna konstrukcja maszyny — nie liczy się (uzup. 3). Najpierw ustalić z figurą, którą
  konstrukcję pokazuje poza v2 (`glute_floor.json:1767`, sprzęt „poręcze”), potem instrukcja producenta tej konstrukcji + druga organizacja.
- **Prone Flutter Kicks** — bez zmian względem W1 (jedyne źródło szczebla 5); w W2 nie szukano ponownie.
- **Fire Hydrant — `hab.mis.high`** z zestawu ogólnego (`cue-sets.json:226`) — bez źródła (ISSA: „as far as you can” bez skręcania bioder);
  karta zastępuje go `fh.mis.twist`. Tak samo Clamshell (`cue-sets.json:138`) — `hab.mis.high` przeczy NASM i Catalyst („as high as possible”);
  zestaw ogólny do poprawy, jeśli karty nie wejdą.
- **Fire Hydrant — `plank.brace`** — tylko ACE 7409 (bez zmian).
- **Cable Kickback — `ck.slow`** — BarBend („slowly lower back”) + HSS przy gumie („don't let the band snap your leg back”, wariant) — można
  dodać jako uproszczenie; nie dodano, karta ma już 2 błędy.
- **Hip Extension with Bands — pochylenie tułowia:** BarBend „slight hinge”, HSS „Stand tall” i „Don't lean forward” — różnica między
  źródłami; zdanie ustawienia celowo o tym milczy. Poza v2 ma pochylenie 8° (`glute_floor.json:1441`) — do oceny w recenzji ruchu.
- **Hip Extension with Bands — kierunek:** HSS opisuje ruch po skosie („back and slightly out”), BarBend w tył; `ck.move` („w tył”) jest częścią wspólną.
- Szczebel Performance Health (TheraBand): strona bez autora — 4 tylko z reguły „producent dla własnego rodzaju sprzętu”; jeśli koordynator
  uzna inaczej, Hip Extension with Bands nadal ma ruch (HSS + BarBend) i błąd (HSS jawnie + BarBend kickback z wyciągiem jako wariant sprzętu).

## Dostęp

- hss.edu, barbend.com, nasm.org, catalystathletics.com, acefitness.org, performancehealthacademy.com — otwarte 02.11.2026.
- vumc.org (PDF ćwiczeń) — narzędzie nie wyciągnęło tekstu; pominięte. Wyniki wyszukiwania będące stronami aplikacji — pominięte.
