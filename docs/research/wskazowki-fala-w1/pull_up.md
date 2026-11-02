# Wskazówki techniki — rodzina `pull_up` (fala W1, G6)

- Data: 02.11.2026 (dwie sesje badacza tego samego dnia; druga — kontynuacja od sekcji „Stan”)
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `pull_up` bez własnych wskazówek: Dead Hang, Muscle Up, Mixed Grip Chin, Scapular Pull-Up, One Arm Chin-Up, Rope Climb, Wide-Grip Rear Pull-Up, Gironda Sternum Chins, Side To Side Chins, Gorilla Chin/Crunch. Pull Up, Chin Up i Neutral Grip Pull Up mają własne wpisy — bez zmian.
- **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda: zasada „wyjątek dla wskazówek techniki” (2 zgodne, przeczytane źródła szczebla 4 z różnych organizacji). Każde źródło otwarte 02.11.2026 przez WebFetch; miejsce podane przy zdaniu. ExRx: `exrx.net` zwraca 403, `web.archive.org` niedostępne dla narzędzia — ExRx w tej fali nie był źródłem. Strony innych aplikacji treningowych i serwisów generowanych automatycznie pominięto (uzupełnienie briefu koordynatora, 02.11.2026).

**Wyjaśnienie koordynatora (02.11.2026, druga sesja):** Physitrack, BarBend i Breaking Muscle są zarejestrowanymi organizacjami szczebla 4 w `data/zrodla/cues.json` (`orgs`) i w `docs/research/27-wskazowki-zrodla.md` (wiersze 61–64); wolno ich używać jak dotąd — zakaz z uzupełnienia briefu dotyczy dokumentacji innych aplikacji treningowych dla użytkowników. To zamyka pytania 1–2 z pierwszej sesji (Physitrack jako źródło Dead Hang; Breaking Muscle jako szczebel 4). Sprawdziłem też: The Prehab Guys i Coach są w `orgs` (szczebel 4).

## 1. Uwaga do Dead Hang (próbna recenzja 02.11.2026)

Obecny zestaw ogólny Dead Hang (`lib/figures/v2/cue-sets.json`: `ok: ["npu.hang"]`) pokazuje zdanie `npu.hang` „Chwyć uchwyty pełnym chwytem (kciuk dookoła) i zawiśnij na prostych rękach.” Zdanie mówi o **uchwytach** (podciąganie chwytem neutralnym), a ćwiczenie i rysunek to **drążek**. Proponuję nowe zdanie `hang.grip` o drążku (sekcja 5) i wpis własny (sekcja 3), który zastępuje zestaw ogólny. Żadne istniejące zdanie nie pasuje wprost: `pu.grip` wymaga nachwytu „trochę szerzej niż barki”, a jedno z dwóch źródeł Dead Hang podaje szerokość barków i nie wspomina nachwytu.

## 2. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Dead Hang | general (`vpull`) | gotowe (krótka karta) | 2 organizacje: Physitrack, BarBend. Ustawienie i 2 wskazówki; brak „ruchu” (ćwiczenie izometryczne) i brak potwierdzonego błędu poza bujaniem. Ściągnięcie barków w dół — otwarte (sekcja 6). |
| Scapular Pull-Up | general (`vpull`) | gotowe (krótka karta) | Druga sesja: The Prehab Guys (wprost to ćwiczenie) + Breaking Muscle (zarejestrowana, szczebel 4); Physitrack jako trzecie źródło z opisem wariantu. Przeniesione z bloku warunkowego do głównego. |
| Muscle Up | open | gotowe (krótka karta) | Druga sesja: Coach (kółka) + BarBend (wariant: drążek; tekst mówi, że na kółkach mechanika „dość podobna”). Katalog (`fedb`) opisuje wersję na kółkach. Tylko część wspólna: fałszywy chwyt, przejście barkami nad dłonie, wypchnięcie do podporu. Zamach (kip) — otwarte. |
| Rope Climb | open | częściowe (warunkowe) | Druga sesja: BarBend + Rx Smart Gear (nowa organizacja — producent sprzętu, do przyjęcia przez koordynatora). Dodatkowo rysunek: `docs/54` — reguł sensu dla wspinania brak, Rope Climb pomijany. |
| Gironda Sternum Chins | general (`vpull`) | częściowe (warunkowe) | Druga sesja: Breaking Muscle (artykuł o chin-upie, sekcja Sternum Chin-Up) + Dynamo Fitness (nowa organizacja — sprzedawca sprzętu; tekst bliski opisowi z bazy katalogu, niezależność wątpliwa). Jedno zdanie ruchu; chwyt — sprzeczny/otwarty. |
| Mixed Grip Chin | general (`vpull`) | otwarte | Druga próba bez wyniku (sekcja 6). |
| One Arm Chin-Up | general (`vpull`) | otwarte | Jedno źródło szczebla 4 (GORNATION, producent sprzętu, wariant: nachwyt). |
| Wide-Grip Rear Pull-Up | general (`vpull`) | otwarte | Jedyne przeczytane źródło tekstu techniki należy do serwisu z własną aplikacją — wykluczone; temat barków i szyi — pełne zasady. |
| Side To Side Chins | general (`vpull`) | otwarte | Przeszukane w drugiej sesji: znalezione opisy dotyczą innego ruchu (przesuwanie się w górze, „typewriter”) — analogia, nie liczy się. |
| Gorilla Chin/Crunch | general (`hanging`) | otwarte | Przeszukane w drugiej sesji: jedyny przeczytany opis spoza aplikacji ma autorkę bez podanych kwalifikacji (szczebel 5). |

## 3. Blok JSON do `exercises` w `data/zrodla/cues.json`

### 3a. Gotowe (≥ 2 źródła z różnych organizacji na każde zdanie)

```json
{
  "Dead Hang": {
    "setup": [
      {
        "c": "hang.grip",
        "s": [
          ["physitrack-dead-hang", "Step 1 (hands shoulder width apart); Step 2 (arms straight, lift your feet off the floor)"],
          ["barbend-grip-exercises", "Dead Hang — How to Do It (overhand grip, slightly wider than shoulder-width; hang from the bar)"]
        ]
      }
    ],
    "tips": [
      {
        "c": "hang.tight",
        "s": [
          ["physitrack-dead-hang", "Step 2 (keep your buttock muscles engaged)"],
          ["barbend-grip-exercises", "Dead Hang — How to Do It (maintain a tight core)"],
          ["barbend-women-pull-up", "Dead hang (make sure your entire body is tensed)"]
        ]
      },
      {
        "c": "pu.noSwing",
        "s": [
          ["physitrack-dead-hang", "FAQ (don't swing or jerk your body)"],
          ["barbend-women-pull-up", "Dead hang (you want to avoid swinging)"]
        ]
      }
    ]
  },
  "Scapular Pull-Up": {
    "setup": [
      {
        "c": "scap.hang",
        "s": [
          ["prehabguys-scapular-pull-up", "opis pod wideo, zdanie 1 (jump or step up to a pull up bar; dalej: keeping your elbows straight)"],
          ["breakingmuscle-shoulders-control", "The Simple Hang (allow yourself to hang freely, with your arms near your ears)"],
          ["physitrack-hanging-scap-retraction", "Step 1 (wariant: zwis ze ściąganiem łopatek i krążeniem barków do tyłu; hang from your arms with your body fully extended)"]
        ]
      }
    ],
    "move": [
      {
        "c": "scap.pull",
        "s": [
          ["prehabguys-scapular-pull-up", "opis pod wideo, zdania 1–2 (elbows straight, shoulder blades high; pull up just enough that the shoulder blades rotate down; nie zginaj łokci)"],
          ["breakingmuscle-shoulders-control", "The Simple Hang (keeping your arms straight; shoulders move away from your ears, scapulae move down your back)"],
          ["physitrack-hanging-scap-retraction", "Step 2 (wariant: zwis ze ściąganiem łopatek i krążeniem barków do tyłu; pull your shoulder blades back and down)"]
        ]
      }
    ]
  },
  "Muscle Up": {
    "setup": [
      {
        "c": "mu.grip",
        "s": [
          ["coach-gymnastic-rings", "sekcja muscle-up, krok Grip (false grip, wrist above the rings)"],
          ["barbend-muscle-up", "How to Do — krok 1 (wariant: drążek; false grip, thumbs not wrapped)"]
        ]
      }
    ],
    "move": [
      {
        "c": "mu.transition",
        "s": [
          ["coach-gymnastic-rings", "sekcja muscle-up, kroki Pull i Transition (pull as high as possible; roll the shoulders forward to get the weight over the hands)"],
          ["barbend-muscle-up", "How to Do — kroki 2–3 (wariant: drążek; pull the chest to the bar, drive chest and shoulders forward over the bar)"]
        ]
      },
      {
        "c": "mu.press",
        "s": [
          ["coach-gymnastic-rings", "sekcja muscle-up, krok Push (press out to the top)"],
          ["barbend-muscle-up", "How to Do — krok 4 (wariant: drążek; press up, fully extending the elbows)"]
        ]
      }
    ]
  }
}
```

Uwagi:
- `barbend-grip-exercises` i `barbend-women-pull-up` to ta sama organizacja (BarBend) — liczą się jako jedno źródło organizacyjne; drugie to zawsze Physitrack.
- Scapular Pull-Up — ocena wariantu Physitrack (druga sesja, strona przeczytana ponownie): „hanging scapular retractions” to zwis na drążku nachwytem, w którym ściąga się łopatki do tyłu i w dół, plus krążenie barków do tyłu (Step 1–2; kroki 3–5 puste). Rdzeń ruchu (zwis, łopatki w dół, bez zginania rąk) jest ten sam co w Scapular Pull-Up, krążenie to dodatek — liczę jako wariant z opisem. Nie jest potrzebny do kompletu: Prehab Guys i Breaking Muscle wystarczają same.
- Muscle Up — autor artykułu Coach to dziennikarz; technikę podaje cytowany w nim trener kalisteniki, były gimnastyk. Organizacja Coach jest zarejestrowana (szczebel 4); do wiadomości koordynatora.

### 3b. Warunkowe — tylko po przyjęciu nowej organizacji jako szczebla 4

```json
{
  "Rope Climb": {
    "setup": [
      {
        "c": "rope.lock",
        "s": [
          ["barbend-rope-climbs", "S-lock — krok Wrap (rope from inside of one leg over the ankle, back under to the middle of the foot)"],
          ["rxsg-rope-foot-locks", "S Wrap / J Wrap (rope wrapped around one leg or under one foot and clamped with the other foot)"]
        ]
      }
    ],
    "move": [
      {
        "c": "rope.legs",
        "s": [
          ["barbend-rope-climbs", "S-lock — krok Stand (foot acts as a step, push up with the legs)"],
          ["rxsg-rope-foot-locks", "część o pracy nóg (push through the legs rather than pulling with the arms)"]
        ]
      },
      {
        "c": "rope.rewrap",
        "s": [
          ["barbend-rope-climbs", "S-lock — krok Re-wrap (re-wrap the foot each time you climb a little)"],
          ["rxsg-rope-foot-locks", "S Wrap / J Wrap (re-wrapping the lock as you ascend)"]
        ]
      }
    ]
  },
  "Gironda Sternum Chins": {
    "move": [
      {
        "c": "gir.pull",
        "s": [
          ["breakingmuscle-chin-up", "Sternum Chin-Up (open the chest, arch through the upper back, mid-chest to the bar instead of the chin)"],
          ["dynamo-gironda", "kroki 2–4 (chest out, body leaning back for the whole movement; pull until the lower chest/sternum touches the bar)"]
        ]
      }
    ]
  }
}
```

Warunki:
- **Rope Climb** — Rx Smart Gear (producent sprzętu do treningu funkcjonalnego, w tym lin; autorka bez podanych kwalifikacji). Producenci sprzętu są dozwoleni (uzupełnienie briefu, pkt 1) — wymaga dopisania organizacji. Dodatkowo rysunek Rope Climb jest dziś pomijany (`docs/54-figury-sprzet.md`, wiersz `lina_pionowa`: brak reguł sensu dla wspinania) — karta ma sens dopiero z rysunkiem albo w trybie bez rysunku.
- **Gironda Sternum Chins** — Dynamo Fitness Equipment (australijski sprzedawca sprzętu, autor „The Dynamo Fitness Team”). Słabość: kroki są bardzo bliskie opisowi z otwartej bazy, z której pochodzi katalog — może to być przeróbka, a nie niezależne źródło. Moja rekomendacja: przyjąć tylko, jeśli koordynator uzna sprzedawcę za „producenta/dokumentację sprzętu”; w przeciwnym razie Gironda zostaje w „Otwarte”. Karta miałaby jedno zdanie — warto rozważyć tryb `open` zamiast niepotwierdzonego zestawu ogólnego (sekcja 6).

## 4. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| physitrack-dead-hang | Physitrack | Step-by-step guide to the dead hang exercise | https://www.physitrack.com/exercise-library/how-to-perform-the-dead-hang-exercise | 4 | 02.11.2026 |
| physitrack-hanging-scap-retraction | Physitrack | Step-by-step guide to hanging scapular retractions | https://www.physitrack.com/exercise-library/how-to-perform-the-hanging-scapular-retractions | 4 | 02.11.2026 (ponownie w 2. sesji) |
| barbend-grip-exercises | BarBend | The 10 Best Grip Exercises (sekcja Dead Hang; autor CSCS) | https://barbend.com/best-grip-exercises/ | 4 | 02.11.2026 |
| barbend-women-pull-up | BarBend | A Ladies' Guide to Your First Pull-Up (sekcja Dead hang; porady DPT) | https://barbend.com/women-pull-up-guide/ | 4 | 02.11.2026 |
| breakingmuscle-shoulders-control | Breaking Muscle | Get Your Shoulders Under Control (sekcja The Simple Hang; autorka M.S. human movement) | https://breakingmuscle.com/fitness/get-your-shoulders-under-control | 4 | 02.11.2026 |
| prehabguys-scapular-pull-up | The Prehab Guys | Scapular Pull Up (opis pod wideo w bibliotece ćwiczeń) | https://theprehabguys.com/vimeo-video/scapular-pull-up-2/ | 4 | 02.11.2026 |
| barbend-muscle-up | BarBend | How to Do Muscle-Ups — Progressions, Benefits, and More (autor CSCS, M.S. fizjologia wysiłku) | https://barbend.com/muscle-up/ | 4 | 02.11.2026 |
| coach-gymnastic-rings | Coach | How To Start Training With Gymnastic Rings (sekcja muscle-up; porady trenera kalisteniki) | https://www.coachweb.com/exercises/home-workouts/4502/gymnastic-ring-workouts-for-small-spaces | 4 | 02.11.2026 |
| barbend-rope-climbs | BarBend | 6 Reasons Strength Athletes Should Do Rope Climbs (Plus How To Master Them) (autor CSCS) | https://barbend.com/6-reasons-strength-athletes-rope-climbs/ | 4 | 02.11.2026 |
| rxsg-rope-foot-locks | Rx Smart Gear (nowa) | Don't be a Dope on a Rope: 3 Foot Locks to Climb like a Champ | https://rxsmartgear.com/blogs/news/dont-be-a-dope-on-a-rope-3-foot-locks-to-climb-like-a-champ | 4 (propozycja) | 02.11.2026 |
| breakingmuscle-chin-up | Breaking Muscle | How to Do the Chin-Up (sekcja Sternum Chin-Up; autor trener sylwetki, bez podanego certyfikatu) | https://breakingmuscle.com/chin-up/ | 4 | 02.11.2026 |
| dynamo-gironda | Dynamo Fitness Equipment (nowa) | Gironda Sternum Grip Chin-Up | https://blog.dynamofitness.com.au/?p=3027 | 4 (propozycja, warunkowo) | 02.11.2026 |
| gornation-one-arm-pull-up | GORNATION (nowa) | The One Arm Pull Up | https://www.gornation.com/blogs/calisthenics-exercises/one-arm-pull-up | 4 (propozycja) — tylko w „Otwarte” | 02.11.2026 |

Organizacje zarejestrowane (szczebel 4, `cues.json` → `orgs`): Physitrack, BarBend, Breaking Muscle, The Prehab Guys, Coach.

Nowe organizacje (propozycja szczebla 4, do decyzji koordynatora):
- **Rx Smart Gear** — producent sprzętu do treningu funkcjonalnego (w tym lin); blog firmowy, autorka bez podanych kwalifikacji.
- **Dynamo Fitness Equipment** — sprzedawca sprzętu (Australia); opisy ćwiczeń „The Dynamo Fitness Team”; zastrzeżenie niezależności (sekcja 3b).
- **GORNATION** — producent sprzętu do kalisteniki (drążki, kółka); artykuły bez podpisu albo założyciela firmy (praktyk kalisteniki od 2013 r., bez podanych certyfikatów).

Przeczytane, ale niewykorzystane (zapis, żeby nie szukać ponownie):
- GORNATION „The Typewriter Pull UP” (https://www.gornation.com/blogs/calisthenics-exercises/typewriter-pull-up) — inny ruch niż Side To Side Chins w katalogu (analogia).
- weighttraining.guide, Gorilla Chin Crunch (https://weighttraining.guide/exercises/gorilla-chin-crunch) — autorka bez podanych kwalifikacji, serwis spoza listy; szczebel 5, nie liczy się.
- Dynamo Fitness, „Chin Up” (https://blog.dynamofitness.com.au/?p=2669) — zwykły chin-up, nie Gorilla Chin.
- Biblioteka ćwiczeń organizacji kalistenicznej z „Wide Grip Behind the Neck Pull-Up” — strona należy do serwisu z własną aplikacją treningową; wykluczona (uzupełnienie briefu, pkt 1).

## 5. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| hang.grip | Chwyć drążek na szerokość barków albo trochę szerzej i zawiśnij na prostych rękach. | Grab the bar about shoulder-width or a bit wider and hang with straight arms. | Physitrack (szerokość barków, proste ręce) + BarBend (trochę szerzej niż barki); część wspólna szerokości zgodnie z zasadą sprzeczności na tym samym szczeblu. Nachwyt podaje tylko BarBend — pominięty. |
| hang.tight | Trzymaj całe ciało napięte i spokojne. | Keep your whole body tight and still. | Physitrack (napięte pośladki, bez bujania) + BarBend (napięty brzuch / całe ciało). Brzuch i pośladki osobno potwierdza tylko po jednym źródle — stąd ogólne „całe ciało”. |
| scap.hang | Chwyć drążek i zawiśnij swobodnie na prostych rękach. | Grab the bar and hang freely with straight arms. | The Prehab Guys + Breaking Muscle (+ Physitrack, wariant). |
| scap.pull | Nie zginając rąk, ściągnij łopatki w dół, z dala od uszu, potem wróć do swobodnego zwisu. | Without bending your arms, pull your shoulder blades down, away from your ears, then return to a relaxed hang. | The Prehab Guys (łokcie proste, tułów unosi się tylko tyle, by łopatki zeszły w dół) + Breaking Muscle (ręce proste, barki od uszu, łopatki w dół) (+ Physitrack, wariant). |
| mu.grip | Złap fałszywym chwytem. | Use a false grip. | Coach (kółka) + BarBend (drążek). Szczegół chwytu źródła opisują różnie (nadgarstek nad kółkiem / kciuk nie obejmuje drążka) — zostaje tylko nazwa chwytu. Uwaga dla tłumacza: termin „fałszywy chwyt” do sprawdzenia w słowniku terminów. |
| mu.transition | Podciągnij się wysoko i przerzuć klatkę i barki do przodu, nad dłonie. | Pull high, then roll your chest and shoulders forward over your hands. | Coach (pull as high as possible; shoulders forward, weight over hands) + BarBend (chest and shoulders forward over the bar). |
| mu.press | Wypchnij się do podporu na prostych rękach. | Press up to a straight-arm support. | Coach (press out to the top) + BarBend (press up, full elbow extension). |
| rope.lock | Owiń linę wokół nogi i zablokuj ją pod stopą. | Wrap the rope around your leg and lock it under your foot. | BarBend (S-lock) + Rx Smart Gear (S/J wrap) — warunkowe (3b). |
| rope.legs | Wstawaj na zablokowanej linie nogami — nie ciągnij samymi rękami. | Stand up on the locked rope with your legs — don't just pull with your arms. | BarBend (stopa jak stopień, wypychanie nogami) + Rx Smart Gear (nogi zamiast rąk) — warunkowe (3b). |
| rope.rewrap | Po każdym wstaniu znów zablokuj linę stopami. | After each stand-up, lock the rope with your feet again. | BarBend (re-wrap) + Rx Smart Gear (ponowne zaplatanie przy wspinaniu) — warunkowe (3b). |
| gir.pull | Odchyl się, wypnij klatkę i ciągnij, aż drążek dotknie środka klatki, nie brody. | Lean back, chest up, and pull until the bar touches your mid-chest, not your chin. | Breaking Muscle + Dynamo Fitness — warunkowe (3b). |

Istniejące zdanie użyte ponownie: `pu.noSwing` („Bez bujania i wymachów nogami.”) — źródła mówią o bujaniu ciałem; wymachy nogami to jego postać, jak w Pull Up.

Uwaga o przestrzeni nazw: prefiks `hang.` jest już używany przez wznosy nóg w zwisie (`hang.noSwing`, `hang.ribs`, `hang.slow`). Nowe `hang.grip` i `hang.tight` nie kolidują identyfikatorem, ale koordynator może woleć prefiks `dh.` dla Dead Hang.

## 6. Otwarte

- **Dead Hang — ściągnięcie barków w dół („aktywny zwis”):** potwierdza tylko BarBend (dwa artykuły, jedna organizacja); Physitrack mówi jedynie, by nie „przeciążać” barków. Istnieje też zwis bierny — bez drugiego źródła nie przesądzamy. Zestaw ogólny tego nie pokazuje, więc nic do usunięcia.
- **Dead Hang — oddech** („nie wstrzymuj oddechu”): tylko Physitrack.
- **Dead Hang — zestaw ogólny `npu.hang`:** zdanie o uchwytach nie pasuje do drążka (sekcja 1) — błąd zestawu ogólnego, do zastąpienia wpisem 3a.
- **Scapular Pull-Up — błąd „żebra do przodu”:** tylko Breaking Muscle. **Bez bujania:** tylko Prehab Guys (dla tego ćwiczenia).
- **Muscle Up (stan po drugiej sesji):** gotowa krótka karta (3a). Otwarte zostają: **zamach** (BarBend opisuje wersję z zamachem, Coach — bez, z prostymi nogami); **odchylenie tułowia przy podciąganiu** (BarBend — tak; tekst Breaking Muscle o drążku — przeciw, ale autorka nie jest trenerką, szczebel 5); **opuszczanie** (tylko Coach: kontrola w dół). Rysunek: katalog opisuje wersję na kółkach — zdania są sformułowane bez sprzętu, więc pasują do obu.
- **Rope Climb:** zjazd (rozluźnienie zamka stopami, schodzenie z kontrolą) — tylko Rx Smart Gear; przechwyt rąk wyżej — żadne z dwóch źródeł nie opisuje wprost. Strony CrossFit — tylko wideo (nieczytane).
- **Gironda Sternum Chins:** chwyt — Dynamo Fitness podchwyt na szerokość barków, Breaking Muscle w tekście nie podaje (tylko podpis wideo: wąski podchwyt); inne wyniki to strony aplikacji, sprzeczne (podchwyt / nachwyt). Bez przyjęcia Dynamo Fitness (3b) całe ćwiczenie zostaje otwarte. **Zestaw ogólny** (`pu.shoulders`, `pu.elbowsDown`, `pu.noSwing`, `pu.partial`) — „łokcie w dół do boków” i „bez wyprostu na dole” nie są sprawdzone dla tego wariantu (odchylenie, klatka do drążka); informacja o błędzie zestawu dla koordynatora.
- **Mixed Grip Chin (druga próba):** szukano poza wcześniej sprawdzonymi organizacjami (Coach, producenci sprzętu do kalisteniki). Coach nie ma tego wariantu; GORNATION opisuje „commando pull-up” (dłonie jedna za drugą wzdłuż drążka) — inne ćwiczenie. Pozostałe wyniki to strony aplikacji lub serwisy bez autora. Wyniki wyszukiwania sugerują zmianę ułożenia dłoni co serię i pracę brzucha przeciw skręcaniu — **nieprzeczytane w dwóch źródłach, nie do aplikacji**.
- **One Arm Chin-Up (druga próba):** GORNATION „The One Arm Pull Up” (wariant: nachwyt) — ściągnięcie barku w dół i do tyłu przed zgięciem łokcia, bez bujania, lekkie przechylenie w stronę ręki pracującej jest normalne, nadmierny obrót tułowia to błąd, powolne opuszczanie. **Jedno źródło** — drugiego nie znaleziono (Coach nie ma; pozostałe wyniki to aplikacje i serwisy bez autora). Zestaw ogólny `vpull` nie mówi o kontroli obrotu tułowia.
- **Wide-Grip Rear Pull-Up (druga próba):** jedyny przeczytany tekst techniki (szeroki nachwyt 1,5–2 × barki, podstawa szyi do drążka) należy do serwisu z własną aplikacją — wykluczony. Przeciążenie barków i szyi to temat zdrowotny — wymaga pełnych zasad (szczebel 2–3), nie wyjątku dla wskazówek. Rekomendacja dla koordynatora: rozważyć tryb `open` zamiast zestawu ogólnego `vpull`, bo `pu.elbowsDown` / `pu.shoulders` nie są sprawdzone dla ruchu za kark.
- **Side To Side Chins:** w opisie z bazy, z której pochodzi katalog, ruch to podciąganie szerokim nachwytem z przechyleniem w jedną stronę, powrót do zwisu i to samo w drugą stronę (zmiana strony na dole). Przeczytane opisy (GORNATION „typewriter”) dotyczą przesuwania się w bok w górnej pozycji — inny ruch, analogia, nie liczy się. Wariant „archer” (druga ręka prosta) — też inny. Zostaje otwarte.
- **Gorilla Chin/Crunch:** jedyny przeczytany opis spoza aplikacji (weighttraining.guide: podchwyt, kolana do klatki razem z podciągnięciem, bez bujania, powolny powrót) ma autorkę bez podanych kwalifikacji — szczebel 5. Inne wyniki to strony aplikacji. Zestaw ogólny `hanging` (`hang.slow` — „opuszczaj nogi powoli”, `pu.shoulders`, `hang.noSwing`) — kierunkowo zgodny z tym jednym opisem, ale niepotwierdzony dwoma źródłami.

## 7. Stan

- Zrobione (sesja 1): Dead Hang (gotowe), Scapular Pull-Up (wtedy warunkowe), Muscle Up / Rope Climb / Gironda (przeszukane), Mixed Grip / One Arm / Wide-Grip Rear (przeszukane ogólnie).
- Zrobione (sesja 2, 02.11.2026): Scapular Pull-Up → gotowe (Prehab Guys + Breaking Muscle; Physitrack jako wariant); Muscle Up → gotowe (Coach + BarBend); Rope Climb i Gironda → warunkowe (nowe organizacje: Rx Smart Gear, Dynamo Fitness); Side To Side Chins i Gorilla Chin/Crunch → przeszukane, otwarte; Mixed Grip / One Arm / Wide-Grip Rear → druga próba, otwarte (One Arm — jedno źródło).
- Zostało: decyzje koordynatora — (1) przyjęcie Rx Smart Gear i Dynamo Fitness (oraz ewentualnie GORNATION) jako organizacji szczebla 4; (2) tryb `open` zamiast zestawu ogólnego dla Gironda i Wide-Grip Rear Pull-Up (zdania zestawu niesprawdzone dla tych wariantów); (3) prefiks `hang.` vs `dh.` dla Dead Hang; (4) termin „fałszywy chwyt” w słowniku terminów.
- Następny krok (jeśli kiedyś wracamy): drugie źródło dla One Arm Chin-Up (np. federacje gimnastyczne, uczelniane programy kalisteniki); tekst techniki Rope Climb od organizacji szkolącej (zamiast wideo).
- Pułapki: `exrx.net` — 403; `web.archive.org` — zablokowane; `barbend.com/dead-hang/` i `barbend.com/rope-climb/` — 404; `bodybuilding.com/exercises/...` przekierowuje na sklep; strony CrossFit o linie — tylko wideo; wiele wyników to strony aplikacji (wykluczone); biblioteka ćwiczeń organizacji gimnastycznej ma własną aplikację (wykluczona).
