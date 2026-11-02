# Wskazówki techniki — rodzina `hip_bridge`

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Korekta szczebli 02.11.2026

Zastosowano rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = (a) organizacja szkoląca trenerów, serwis z redakcją i recenzją albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść firmowana; (c) nie marketing ani afiliacja; jeden właściciel = jedno źródło).

- Zmienione szczeble: `PureGym` 4 → **5** (sieć siłowni, lista koordynatora); `Asphalt Green` 4 → **5** (operator centrów sportu, sprawdzone 02.11: nie szkoli ani nie certyfikuje trenerów, artykuł bez autora — ten sam rodzaj co sieć siłowni); `Dynamo Fitness` „4 warunkowo / do akceptacji” → **5** (sprzedawca i serwis sprzętu, nie producent — reguła „sprzedawcy — 5”).
- Potwierdzone 4: Catalyst Athletics (lista koordynatora); Bells of Steel — sprawdzone 02.11: poradnik firmowany przez producenta z datą 27.05.2024, o maszynie do hip thrustu, którą sam produkuje (link do własnego produktu, bez afiliacji) → 4 dla maszyny; Major Fitness — marka własnych maszyn Smitha → 4 dla maszyny Smitha.
- Ćwiczenia, które spadły do otwartych: **Machine Hip Thrust** (gotowe → otwarte; każde zdanie miało Bells of Steel + Asphalt Green), **Smith Machine Hip Thrust** (gotowe warunkowo → otwarte; Major Fitness + Dynamo).
- Zdania usunięte z bloku JSON: 9 (Machine Hip Thrust: `ht.machSetup`, `ht.move`, `ht.machNoRest`, `ht.mis.arch`, `mis.jerk`; Smith: `ht.smithSetup`, `ht.move`, `ht.smithUnhook`, `gb.heels`). Dane przeniesione do „Dane częściowe”.
- Glute Bridge (sztanga) — był otwarty; po korekcie ustawienie i ruch mają już tylko 1 źródło szczebla 4 (ACE Certified 7403).
- Oznaczenie „do akceptacji koordynatora” (Dynamo) usunięte — zastąpione oceną wyżej.

Metoda: jak w `docs/research/33-wskazowki-partia2.md` (wyjątek dla wskazówek techniki z CLAUDE.md: 2 zgodne, niezależne
źródła szczebla 4 z różnych organizacji, przeczytane; żadne przeczytane nie przeczy; bez liczb i bez uzasadnień zdrowotnych).
Wariant jednonóż liczy się jako wariant tego samego ćwiczenia tylko wtedy, gdy źródło opisuje właśnie wersję jednonóż.
ExRx (403) i web.archive.org (zablokowane) — nie czytane, nie liczone (uzupełnienie briefu). Strony innych aplikacji pominięte.

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Single Leg Glute Bridge | **gotowe** | ACE 145 (wersja jednonóż) + Catalyst Athletics 496. Ustawienie wolnej nogi różni się między źródłami (ACE: kolano przyciągnięte do klatki; Catalyst: noga wyprostowana) — zdanie podaje obie możliwości. |
| Glute Bridge (sztanga) | **otwarte** | Po korekcie każde zdanie ma tylko 1 źródło szczebla 4 (ACE Certified 7403); PureGym — szczebel 5. Dane częściowe niżej. |
| Single Leg Hip Thrust | **gotowe** | Catalyst Athletics 723 („Single Leg Bench-Supported Glute Bridge” = plecy na ławce, jednonóż) + The Prehab Guys „Single Leg Hip Thrust”. Wolna noga — jak wyżej. |
| Machine Hip Thrust | **otwarte (korekta 02.11)** | Bells of Steel (producent maszyny, 4) + Asphalt Green (operator centrów sportu, 5) — tylko 1 źródło szczebla 4. Dane częściowe niżej. |
| Smith Machine Hip Thrust | **otwarte (korekta 02.11)** | Major Fitness (4) + Dynamo Fitness (sprzedawca sprzętu, 5) — tylko 1 źródło szczebla 4. Dane częściowe niżej. |
| Frog Pump | **otwarte** | Nie znaleziono 2 przeczytanych źródeł szczebla 4 z różnych organizacji (zgadnięte adresy BarBend, Breaking Muscle — 404; reszta wyników to aplikacje lub blogi bez autora). |
| Stability Ball Hip Bridge | **otwarte** | Wersji „łopatki na piłce, stopy na podłodze” nie znaleziono w źródłach szczebla 4 (wyszukiwanie wskazało w bibliotece ACE tylko mostek ze stopami na piłce — inne ćwiczenie, nieczytane). |
| London Bridges | **otwarte — podejrzenie błędnej rodziny** | W katalogu (`catalog.json`, „London Bridges”, `note`): stoisz na zablokowanej sztandze Smitha/skrzyni i schodzisz rękami po zwisającej linie do poziomu i z powrotem; `pattern: other`, mięśnie lats/forearms/biceps/upper_back/abs, `scope: niche`. To ćwiczenie na linie (chwyt + przyciąganie), **nie mostek biodrowy** — przypisanie do rodziny `hip_bridge` wygląda na błąd (prawdopodobnie dopasowanie po słowie „Bridges”). Bez zmian; do decyzji koordynatora. |

## Wpisy do `cues.json` → `exercises`

```json
{
  "Single Leg Glute Bridge": {
    "setup": [
      {"c": "gb.slSetup", "s": [["ace-145", "Step 1"], ["catalyst-496", "opis (one knee bent, other leg straight)"]]}
    ],
    "move": [
      {"c": "gb.slMove", "s": [["ace-145", "Step 2; Step 3"], ["catalyst-496", "opis (press through the whole foot, emphasizing the heel; lower under control)"]]}
    ],
    "tips": [
      {"c": "ht.rigid", "s": [["ace-145", "Step 1 (brace abs); Step 2 (avoid pushing your hips too high … arching)"], ["catalyst-496", "opis (ensure the motion is at the hip)"]]}
    ],
    "mistakes": [
      {"c": "ht.mis.arch", "s": [["ace-145", "Step 2"], ["catalyst-496", "opis (not excessive lumbar extension)"]]}
    ]
  },
  "Single Leg Hip Thrust": {
    "setup": [
      {"c": "ht.slSetup", "s": [["catalyst-723", "opis (upper back on a padded bench, one foot flat, other leg extended)"], ["prehab-single-leg-hip-thrust", "Setup (mid-back against a bench, one knee toward chest)"]]}
    ],
    "move": [
      {"c": "gb.slMove", "s": [["catalyst-723", "opis (push through the whole foot, favoring the heel; lower under control)"], ["prehab-single-leg-hip-thrust", "Execution; Cues (drive through your heel; slowly return)"]]}
    ],
    "tips": [
      {"c": "ht.rigid", "s": [["catalyst-723", "opis (movement comes from the hip)"], ["prehab-single-leg-hip-thrust", "Avoid (most of the movement from the hips and pelvis)"]]}
    ],
    "mistakes": [
      {"c": "ht.mis.arch", "s": [["catalyst-723", "opis (avoid arching excessively through the lower back)"], ["prehab-single-leg-hip-thrust", "Avoid (arching your lower back)"]]}
    ]
  }
}
```

## Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `gb.slSetup` | Połóż się na plecach, jedno kolano ugięte, stopa płasko na podłodze; drugą nogę wyprostuj albo przyciągnij kolano do klatki. | Lie on your back, one knee bent with that foot flat on the floor; straighten the other leg or pull that knee toward your chest. | `gb.setup` opisuje obie stopy na podłodze; wersja jednonóż ma inne ustawienie. Dwie możliwości wolnej nogi = część wspólna i różnica źródeł (ACE 145 / Catalyst 496). |
| `ht.slSetup` | Oprzyj plecy o ławkę, jedna stopa płasko na podłodze; drugą nogę wyprostuj albo przyciągnij kolano do klatki. | Rest your back against a bench, one foot flat on the floor; straighten the other leg or pull that knee toward your chest. | Jak wyżej, wersja z ławką. „Plecy” bez „górnej części” — Catalyst: upper back, Prehab Guys: mid-back. |
| `gb.slMove` | Dociskając stopę do podłogi, zwłaszcza piętę, unieś biodra; opuść je powoli. | Press your foot into the floor, especially the heel, and lift your hips; lower them slowly. | `gb.move` (linia barki–biodra–kolana) i `gb.heels` („stopy”) nie mają źródeł dla wersji jednonóż w tym brzmieniu; wspólne dla obu wariantów jednonóż. |

Zdania wstrzymane w korekcie 02.11 (ćwiczenia otwarte; propozycje zostają do czasu drugiego źródła): `ht.machSetup`, `ht.machNoRest`, `ht.smithSetup`, `ht.smithUnhook` — brzmienie w „Dane częściowe”.

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / krótki cytat |
|---|---|---|---|---|
| `ace-145` | https://www.acefitness.org/resources/everyone/exercise-library/145/glute-bridge-single-leg-progression/ | ACE (istnieje) | 4 | Step 1–3; Step 2: „Avoid pushing your hips too high as this generally increases the amount of hyperextension (arching).” |
| `catalyst-496` | https://www.catalystathletics.com/exercise/496/Single-Leg-Glute-Bridge/ | Catalyst Athletics (nowa) | 4 | opis: „ensure the motion is at the hip” |
| `catalyst-723` | https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/ | Catalyst Athletics (nowa) | 4 | opis (plecy na ławce, jednonóż; parafraza narzędzia) |
| `prehab-single-leg-hip-thrust` | https://theprehabguys.com/vimeo-video/single-leg-hip-thrust/ | The Prehab Guys (istnieje) | 4 | Setup: „Begin with your mid-back against a bench or elevated surface.” |
| `bos-hip-thrust-machine` | https://bellsofsteel.us/blogs/content/how-to-do-hip-thrusts-with-a-machine | Bells of Steel (nowa; proponowana też w `leg_machine.md`) | 4 (tylko własny rodzaj sprzętu) | krok 3: „Your feet should be flat on the footplate, about shoulder-width apart.” (27.05.2024, bez autora, firmowane) |
| `asphaltgreen-hip-thrust-machine` | https://asphaltgreen.org/blog/the-beginners-guide-to-the-hip-thrust-machine | Asphalt Green (nowa) | 5 (korekta 02.11) | Step-by-step 2–4 (parafraza narzędzia); 10.11.2023, bez autora |
| `majorfitness-smith-hip-thrust` | https://www.majorfitness.com/blogs/wiki/how-to-set-up-hip-thrust-on-smith-machine-a-step-by-step-guide | Major Fitness (nowa) | 4 (tylko maszyna Smitha) | Setup 1–6, Execution 1–5 (parafraza narzędzia); 24.06.2026 |
| `dynamo-smith-hip-thrust` | https://blog.dynamofitness.com.au/exercise-archives/smith-machine-hip-thrust | Dynamo Fitness (nowa; sprzedawca sprzętu) | 5 (korekta 02.11) | krok 4: „Release the bar from the safety hooks by twisting your wrists.” |
| `puregym-barbell-glute-bridges` | https://www.puregym.com/exercises/glutes/glute-bridge/barbell-glute-bridges/ | PureGym (nowa; sieć siłowni) | 5 (korekta 02.11) | kroki 1–5 (tylko w danych częściowych) |
| `nsca-scj-hip-thrust` | Contreras B, Cronin J, Schoenfeld B. Barbell Hip Thrust. Strength Cond J 33(5): 58–61, 2011 (kolumna „Exercise Technique”, NSCA); kopia czytana: https://www.lookgreatnaked.com/articles/barbell_hip_thrust.pdf | NSCA (istnieje) | 3 | „Exercise Technique”, s. 59: „the extension movement comes from the hips, not from the lumbopelvic region” |

`nsca-scj-hip-thrust` nie jest użyte w powyższych kartach (opisuje Hip Thrust ze sztangą na ławce, czyli istniejącą kartę) —
**informacja dla koordynatora**: obecna karta „Hip Thrust (sztanga)” opiera `ht.setup`, `ht.move`, `ht.rigid`, `ht.hold`, `ht.mis.arch`
m.in. na ExRx, którego dziś nie da się odczytać. Ten artykuł (s. 59–60) potwierdza wprost: ustawienie (plecy na ławce, sztanga
w zgięciu bioder, gruba podkładka, stopy płasko), ruch (wyprost bioder, kontrolowane opuszczanie) oraz „ruch z bioder, nie z odcinka
lędźwiowo-miednicznego” (`ht.rigid` / `ht.mis.arch`). Może zastąpić ExRx jako drugie źródło. Nie potwierdza `ht.hold` (jest tylko
„grab a hold of the barbell” przy przetaczaniu sztangi). Kopia PDF leży na stronie trzeciej; oryginał: archiwum Strength Cond J (journals.lww.com/nsca-scj).

```json
{
  "orgs": {
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com, trener podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "Bells of Steel": {"name": "Bells of Steel — blog producenta sprzętu (bellsofsteel.us; szczebel 4 tylko dla własnego rodzaju sprzętu)", "level": 4, "kind": "maker"},
    "Asphalt Green": {"name": "Asphalt Green — blog organizacji prowadzącej centra sportu (asphaltgreen.org; operator obiektów, nie szkoli trenerów — szczebel 5 wg rozstrzygnięcia 02.11.2026)", "level": 5, "kind": "org"},
    "Major Fitness": {"name": "Major Fitness — poradnik marki własnych maszyn Smitha i stojaków (majorfitness.com; szczebel 4 tylko dla tego sprzętu)", "level": 4, "kind": "maker"},
    "Dynamo Fitness": {"name": "Dynamo Fitness — biblioteka ćwiczeń sprzedawcy i serwisu sprzętu (dynamofitness.com.au; sprzedawca — szczebel 5 wg rozstrzygnięcia 02.11.2026)", "level": 5, "kind": "site"},
    "PureGym": {"name": "PureGym — biblioteka ćwiczeń sieci siłowni (puregym.com; szczebel 5 wg rozstrzygnięcia 02.11.2026)", "level": 5, "kind": "site"}
  },
  "sources": {
    "ace-145": {"org": "ACE", "title": "Glute Bridge Single Leg Progression (#145)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/145/glute-bridge-single-leg-progression/", "level": 4},
    "catalyst-496": {"org": "Catalyst Athletics", "title": "Single-Leg Glute Bridge (#496)", "url": "https://www.catalystathletics.com/exercise/496/Single-Leg-Glute-Bridge/", "level": 4},
    "catalyst-723": {"org": "Catalyst Athletics", "title": "Single-Leg Bench-Supported Glute Bridge (#723)", "url": "https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/", "level": 4},
    "prehab-single-leg-hip-thrust": {"org": "The Prehab Guys", "title": "Single Leg Hip Thrust", "url": "https://theprehabguys.com/vimeo-video/single-leg-hip-thrust/", "level": 4},
    "bos-hip-thrust-machine": {"org": "Bells of Steel", "title": "How to Do Hip Thrusts with a Machine (2024)", "url": "https://bellsofsteel.us/blogs/content/how-to-do-hip-thrusts-with-a-machine", "level": 4},
    "asphaltgreen-hip-thrust-machine": {"org": "Asphalt Green", "title": "The Beginner's Guide to the Hip Thrust Machine (2023)", "url": "https://asphaltgreen.org/blog/the-beginners-guide-to-the-hip-thrust-machine", "level": 5},
    "majorfitness-smith-hip-thrust": {"org": "Major Fitness", "title": "How to Do Hip Thrusts on Smith Machine (2026)", "url": "https://www.majorfitness.com/blogs/wiki/how-to-set-up-hip-thrust-on-smith-machine-a-step-by-step-guide", "level": 4},
    "dynamo-smith-hip-thrust": {"org": "Dynamo Fitness", "title": "Smith Machine Hip Thrust", "url": "https://blog.dynamofitness.com.au/exercise-archives/smith-machine-hip-thrust", "level": 5},
    "puregym-barbell-glute-bridges": {"org": "PureGym", "title": "Barbell Glute Bridges", "url": "https://www.puregym.com/exercises/glutes/glute-bridge/barbell-glute-bridges/", "level": 5},
    "nsca-scj-hip-thrust": {"org": "NSCA", "title": "Contreras, Cronin, Schoenfeld — Barbell Hip Thrust, Strength Cond J 33(5):58–61 (2011), kolumna Exercise Technique", "url": "https://www.lookgreatnaked.com/articles/barbell_hip_thrust.pdf", "level": 3}
  }
}
```

## Dane częściowe (ćwiczenia otwarte — nie do `cues.json`)

### Glute Bridge (sztanga)

- Ustawienie: leżenie na plecach, kolana ugięte, stopy płasko, sztanga na biodrach — `acecert-7403` (akapit wstępny:
  „lying face-up on the floor … places a barbell across the top of the hips (usually on a pad)”); `puregym-barbell-glute-bridges`
  (kroki 1–2) — szczebel 5, nie liczy się. Proponowane zdanie `gb.bbSetup` — PL „Połóż się na plecach, sztanga na biodrach, kolana ugięte, stopy płasko na podłodze.”
  / EN „Lie on your back with the bar across your hips, knees bent, feet flat on the floor.”
- Ruch: uniesienie bioder ze sztangą i opuszczenie na podłogę — `acecert-7403` (lowers the tailbone … presses the hips upward);
  PureGym kroki 4–5 (5). Proponowane `gb.bbMove` — PL „Unieś biodra, wypychając sztangę w górę; opuść biodra z powrotem na podłogę.” / EN „Drive your hips up, pushing the bar up; lower your hips back to the floor.”
- Wskazówki/błędy — tylko PureGym (5): pięty (`gb.heels`), trzymanie sztangi dłońmi (`ht.hold`), neutralne plecy.

### Machine Hip Thrust (1 źródło szczebla 4: `bos-hip-thrust-machine`; drugie `asphaltgreen-hip-thrust-machine` — 5)

- `ht.machSetup` — PL „Oprzyj plecy o oparcie, zapnij pas na biodrach, stopy płasko na platformie, mniej więcej na szerokość barków.” / EN „Rest your back on the pad, fasten the belt across your hips, feet flat on the platform about shoulder-width apart.” — BoS krok 3 „Position”; Asphalt Green Setup.
- `ht.move` — BoS krok 5 „Thrust”; Asphalt Green Step-by-step 1–5.
- `ht.machNoRest` — PL „Na dole nie odkładaj ciężaru — zatrzymaj ruch, zanim dotknie podłoża.” / EN „Don't set the weight down at the bottom — stop just before it touches.” — BoS krok 5; Asphalt Green Step-by-step 2.
- `ht.mis.arch` — BoS Common mistakes; Asphalt Green Tips and common mistakes. `mis.jerk` — BoS Form tips; Asphalt Green Tips and common mistakes.

### Smith Machine Hip Thrust (1 źródło szczebla 4: `majorfitness-smith-hip-thrust`; drugie `dynamo-smith-hip-thrust` — 5)

- `ht.smithSetup` — PL „Oprzyj plecy o ławkę, sztangę Smitha z podkładką ustaw nad biodrami; stopy płasko, mniej więcej na szerokość barków.” / EN „Rest your back on a bench with the padded Smith bar over your hips; feet flat, about shoulder-width apart.” — Major Fitness Setup 1–4; Dynamo kroki 1–3.
- `ht.move` — Major Fitness Execution 2–4; Dynamo kroki 5–6.
- `ht.smithUnhook` — PL „Zdejmij sztangę z haków, obracając ją nadgarstkami.” / EN „Unrack the bar by rotating it off the hooks with your wrists.” — Major Fitness Setup 6; Dynamo krok 4.
- `gb.heels` — Major Fitness Execution 2 i Form tips; Dynamo krok 5.
- `ht.mis.arch` — tylko Major Fitness (Common mistakes: hyperextending at the top).

## Otwarte

| Ćwiczenie / zdanie | Powód | Co by rozstrzygnęło |
|---|---|---|
| Glute Bridge (sztanga) — całość | po korekcie 02.11 każde zdanie ma 1 źródło szczebla 4 (ACE Certified 7403); PureGym — 5 | drugie źródło szczebla 4 o mostku ze sztangą na podłodze |
| Machine Hip Thrust — całość (korekta 02.11) | Asphalt Green to operator centrów sportu (5); zostaje tylko Bells of Steel | drugie źródło szczebla 4: inny producent maszyny do hip thrustu albo organizacja szkoląca trenerów |
| Smith Machine Hip Thrust — całość (korekta 02.11) | Dynamo Fitness to sprzedawca (5); zostaje tylko Major Fitness | drugie źródło szczebla 4 o hip thruście na maszynie Smitha |
| Frog Pump — całość | brak 2 przeczytanych źródeł szczebla 4 | biblioteka organizacji szkolącej trenerów lub serwis specjalistyczny z opisem frog pump |
| Stability Ball Hip Bridge — całość | brak źródła o wersji „łopatki na piłce” | ACE/NASM lub inna organizacja szkoląca trenerów z opisem |
| London Bridges | prawdopodobnie błędna rodzina (ćwiczenie na linie, nie mostek) | decyzja koordynatora o rodzinie; wtedy research jako ćwiczenie chwytu/przyciągania |
| Machine Hip Thrust — maszyny bez pasa | `ht.machSetup` zakłada pas na biodrach (oba źródła: maszyna z pasem) | źródło o maszynie z wałkiem/podkładką na biodrach |
| Pozycja wolnej nogi (jednonóż) | ACE 145 i Prehab Guys — kolano do klatki; Catalyst — noga prosta | zdanie podaje obie; figura pokazuje jedną — do decyzji przy animacji |
| Zestawy ogólne (`cue-sets.json`) — informacja o błędach | Single Leg Glute Bridge i Single Leg Hip Thrust: `gb.move` (linia barki–biodra–kolana) i `gb.heels` („stopy”) — przeczytane źródła wersji jednonóż nie potwierdzają tego brzmienia. Frog Pump: `gb.heels` — w frog pump stopy są złączone podeszwami; przeczytanych źródeł brak. Stability Ball Hip Bridge: `gb.move`, `ht.rigid` bez źródeł o tym wariancie. Smith, Machine Hip Thrust, Glute Bridge (sztanga): po korekcie żadne zdanie nie ma 2 źródeł szczebla 4 | przegląd zestawów po integracji kart; zdania niepotwierdzone usunąć z zestawu ogólnego |

## Dostęp

- exrx.net — 403; web.archive.org — zablokowane (nie próbowano, wg uzupełnienia briefu).
- barbend.com/barbell-glute-bridge/, barbend.com/frog-pumps/, breakingmuscle.com/frog-pumps/ — 404 (zgadnięte adresy; prawdziwych w wynikach nie było).
- muscleandstrength.com — 403.
- Instrukcja TKO 723HT (PDF) — nieczytelna dla narzędzia (grafika bez tekstu).
- Strony aplikacji treningowych z wyników wyszukiwania pominięte, nazw nie zapisano.
