# Wskazówki techniki — rodzina `pull_up` (fala W1, G6)

> **Korekta szczebli 02.11.2026** (badacz-merytoryczny, agent; wg „Rozstrzygnięcia koordynatora linii 1.1 — szczeble organizacji”, 02.11.2026). Sprawdzone ponownie tylko kryteria (b) autor/data i (c) marketing na już cytowanych stronach (WebFetch 02.11.2026).
> - **Breaking Muscle → 5** (rozstrzygnięcie). Wypadają `breakingmuscle-shoulders-control` i `breakingmuscle-chin-up`.
> - **Physitrack → 5** (organizacja spoza listy, ocena wg (a)–(c)): (a) dostawca oprogramowania do zalecania ćwiczeń (z aplikacją dla pacjentów), nie organizacja szkoląca trenerów, nie serwis z recenzją ekspercką, nie producent sprzętu; (b) strona Dead Hang bez autora i daty (tylko stopka „©2026 Physitrack”); (c) strona otoczona reklamą oprogramowania (wezwanie do darmowego okresu próbnego). Uwaga dla koordynatora: Physitrack jest w `cues.json` → `orgs` jako szczebel 4 — wpis do przeglądu (dotyczy też innych rodzin).
> - **Dynamo Fitness → 5** (sprzedawca sprzętu — rozstrzygnięcie).
> - **Rx Smart Gear → 4** (producent lin — własny rodzaj sprzętu; rozstrzygnięcie). **GORNATION → 4** dla drążków/kalisteniki (rozstrzygnięcie).
> - **BarBend 4** — wszystkie cytowane artykuły dotyczą techniki (nie recenzje produktów). **Coach 4** (zarejestrowany; (b) „By Joel Snape”, „Published 21 May 2018”; (c) sekcja muscle-up bez linków i produktów — link afiliacyjny tylko we wstępie o kółkach; jawnej recenzji eksperckiej brak, technika od cytowanego trenera kalisteniki — do wiadomości koordynatora).
> - **The Prehab Guys** — nie przesądzam: (b) spełnione (treść firmowana, „Updated Aug 6, 2021 Published Jul 2, 2020”), (a) wątpliwe (firma fizjoterapeutów z kursami dla klinicystów i własną aplikacją), (c) strona komercyjna wokół opisu. W tym pliku wynik nie zależy od tej oceny.
> - Skutki: **Dead Hang** gotowe → otwarte (zostaje tylko BarBend); **Scapular Pull-Up** gotowe → otwarte (najwyżej Prehab Guys); **Gironda Sternum Chins** warunkowe → otwarte; **Rope Climb** warunkowe → gotowe (BarBend + Rx Smart Gear); **Muscle Up** — bez zmian (gotowe). One Arm Chin-Up — nadal jedno źródło (GORNATION).
>
> **Przeliczenie koordynatora 02.11.2026 — nadrzędne; sekcja na końcu pliku (Coach = 5 → Muscle Up otwarte).**

- Data: 02.11.2026 (dwie sesje badacza tego samego dnia; druga — kontynuacja od sekcji „Stan”; korekta szczebli — ten sam dzień)
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `pull_up` bez własnych wskazówek: Dead Hang, Muscle Up, Mixed Grip Chin, Scapular Pull-Up, One Arm Chin-Up, Rope Climb, Wide-Grip Rear Pull-Up, Gironda Sternum Chins, Side To Side Chins, Gorilla Chin/Crunch. Pull Up, Chin Up i Neutral Grip Pull Up mają własne wpisy — bez zmian.
- **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda: zasada „wyjątek dla wskazówek techniki” (2 zgodne, przeczytane źródła szczebla 4 z różnych organizacji). Każde źródło otwarte 02.11.2026 przez WebFetch; miejsce podane przy zdaniu. ExRx: `exrx.net` zwraca 403, `web.archive.org` niedostępne dla narzędzia — ExRx w tej fali nie był źródłem. Strony innych aplikacji treningowych i serwisów generowanych automatycznie pominięto (uzupełnienie briefu koordynatora, 02.11.2026).

**Wyjaśnienie koordynatora (02.11.2026, druga sesja) — zastąpione rozstrzygnięciem szczebli z 02.11.2026 (nota na górze):** wcześniej Physitrack, BarBend i Breaking Muscle traktowano jako szczebel 4 na podstawie wpisów w `orgs`. Po rozstrzygnięciu: Breaking Muscle 5, Physitrack 5 (ocena wg (a)–(c)), BarBend 4 tylko artykuły o technice.

## 1. Uwaga do Dead Hang (próbna recenzja 02.11.2026)

Obecny zestaw ogólny Dead Hang (`lib/figures/v2/cue-sets.json`: `ok: ["npu.hang"]`) pokazuje zdanie `npu.hang` „Chwyć uchwyty pełnym chwytem (kciuk dookoła) i zawiśnij na prostych rękach.” Zdanie mówi o **uchwytach** (podciąganie chwytem neutralnym), a ćwiczenie i rysunek to **drążek** — błąd zestawu ogólnego niezależnie od korekty. Po korekcie szczebli wpis własny Dead Hang nie ma kompletu źródeł (sekcja 6); rekomendacja: tryb `open` albo poprawa zestawu ogólnego zamiast `npu.hang`.

## 2. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Muscle Up | open | gotowe (krótka karta) | Coach (kółka) + BarBend (wariant: drążek; tekst mówi, że na kółkach mechanika „dość podobna”). Katalog (`fedb`) opisuje wersję na kółkach. Tylko część wspólna: fałszywy chwyt, przejście barkami nad dłonie, wypchnięcie do podporu. Zamach (kip) — otwarte. Bez zmian po korekcie. |
| Rope Climb | open | gotowe (krótka karta) | Korekta 02.11.2026: Rx Smart Gear = 4 (producent lin) → z warunkowego do gotowego. BarBend + Rx Smart Gear. Rysunek: `docs/54` — reguł sensu dla wspinania brak, Rope Climb pomijany (karta ma sens z rysunkiem albo w trybie bez rysunku). |
| Dead Hang | general (`vpull`) | otwarte | Korekta 02.11.2026: Physitrack = 5 → zostaje tylko BarBend (dwa artykuły, jedna organizacja). Wcześniej „gotowe”. |
| Scapular Pull-Up | general (`vpull`) | otwarte | Korekta 02.11.2026: Breaking Muscle = 5, Physitrack = 5 → zostaje najwyżej The Prehab Guys (jedno źródło). Wcześniej „gotowe”. |
| Gironda Sternum Chins | general (`vpull`) | otwarte | Korekta 02.11.2026: Breaking Muscle = 5, Dynamo Fitness = 5 (sprzedawca) → brak źródła szczebla 4. Wcześniej „warunkowe”. |
| Mixed Grip Chin | general (`vpull`) | otwarte | Druga próba bez wyniku (sekcja 6). |
| One Arm Chin-Up | general (`vpull`) | otwarte | Jedno źródło szczebla 4 (GORNATION — producent drążków/sprzętu do kalisteniki, szczebel 4 potwierdzony rozstrzygnięciem; wariant: nachwyt). |
| Wide-Grip Rear Pull-Up | general (`vpull`) | otwarte | Jedyne przeczytane źródło tekstu techniki należy do serwisu z własną aplikacją — wykluczone; temat barków i szyi — pełne zasady. |
| Side To Side Chins | general (`vpull`) | otwarte | Znalezione opisy dotyczą innego ruchu (przesuwanie się w górze, „typewriter”) — analogia, nie liczy się. |
| Gorilla Chin/Crunch | general (`hanging`) | otwarte | Jedyny przeczytany opis spoza aplikacji ma autorkę bez podanych kwalifikacji (szczebel 5). |

## 3. Blok JSON do `exercises` w `data/zrodla/cues.json` — NIEAKTUALNY — patrz przeliczenie 02.11.2026

Tylko ćwiczenia z ≥ 2 źródłami szczebla 4 z różnych organizacji na każde zdanie (po korekcie szczebli 02.11.2026).

```json
{
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
  },
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
  }
}
```

Uwagi:
- Muscle Up — autor artykułu Coach to dziennikarz; technikę podaje cytowany w nim trener kalisteniki, były gimnastyk. Organizacja Coach jest zarejestrowana (szczebel 4); (b) i (c) sprawdzone przy korekcie (nota na górze).
- Rope Climb — Rx Smart Gear: producent sprzętu do treningu funkcjonalnego, w tym lin; blog firmowy, autorka bez podanych kwalifikacji. Szczebel 4 dla lin wg rozstrzygnięcia 02.11.2026 (producent — własny rodzaj sprzętu). Rysunek Rope Climb jest dziś pomijany (`docs/54-figury-sprzet.md`, wiersz `lina_pionowa`).
- Usunięte z bloku przy korekcie: Dead Hang (`hang.grip`, `hang.tight`, `pu.noSwing`), Scapular Pull-Up (`scap.hang`, `scap.pull`), Gironda Sternum Chins (`gir.pull`) — sekcja 6.

## 4. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| physitrack-dead-hang | Physitrack | Step-by-step guide to the dead hang exercise | https://www.physitrack.com/exercise-library/how-to-perform-the-dead-hang-exercise | 5 (korekta 02.11.2026: (a)–(c) niespełnione — nota) | 02.11.2026 (ponownie przy korekcie) |
| physitrack-hanging-scap-retraction | Physitrack | Step-by-step guide to hanging scapular retractions | https://www.physitrack.com/exercise-library/how-to-perform-the-hanging-scapular-retractions | 5 (korekta 02.11.2026) | 02.11.2026 |
| barbend-grip-exercises | BarBend | The 10 Best Grip Exercises (sekcja Dead Hang; autor CSCS) | https://barbend.com/best-grip-exercises/ | 4 (artykuł o technice) | 02.11.2026 |
| barbend-women-pull-up | BarBend | A Ladies' Guide to Your First Pull-Up (sekcja Dead hang; porady DPT) | https://barbend.com/women-pull-up-guide/ | 4 (artykuł o technice) | 02.11.2026 |
| breakingmuscle-shoulders-control | Breaking Muscle | Get Your Shoulders Under Control (sekcja The Simple Hang) | https://breakingmuscle.com/fitness/get-your-shoulders-under-control | 5 (rozstrzygnięcie 02.11.2026) | 02.11.2026 |
| prehabguys-scapular-pull-up | The Prehab Guys | Scapular Pull Up (opis pod wideo w bibliotece ćwiczeń; „Updated Aug 6, 2021”) | https://theprehabguys.com/vimeo-video/scapular-pull-up-2/ | do oceny koordynatora ((b) tak, (a) wątpliwe, (c) strona komercyjna); przeliczenie 02.11.2026: **5** | 02.11.2026 (ponownie przy korekcie) |
| barbend-muscle-up | BarBend | How to Do Muscle-Ups — Progressions, Benefits, and More (autor CSCS, M.S. fizjologia wysiłku) | https://barbend.com/muscle-up/ | 4 (artykuł o technice) | 02.11.2026 |
| coach-gymnastic-rings | Coach | How To Start Training With Gymnastic Rings (sekcja muscle-up; porady trenera kalisteniki; 21.05.2018) | https://www.coachweb.com/exercises/home-workouts/4502/gymnastic-ring-workouts-for-small-spaces | 4; przeliczenie 02.11.2026: **5** | 02.11.2026 (ponownie przy korekcie) |
| barbend-rope-climbs | BarBend | 6 Reasons Strength Athletes Should Do Rope Climbs (Plus How To Master Them) (autor CSCS) | https://barbend.com/6-reasons-strength-athletes-rope-climbs/ | 4 (artykuł o technice) | 02.11.2026 |
| rxsg-rope-foot-locks | Rx Smart Gear (nowa) | Don't be a Dope on a Rope: 3 Foot Locks to Climb like a Champ | https://rxsmartgear.com/blogs/news/dont-be-a-dope-on-a-rope-3-foot-locks-to-climb-like-a-champ | 4 — tylko liny (rozstrzygnięcie 02.11.2026) | 02.11.2026 |
| breakingmuscle-chin-up | Breaking Muscle | How to Do the Chin-Up (sekcja Sternum Chin-Up) | https://breakingmuscle.com/chin-up/ | 5 (rozstrzygnięcie 02.11.2026) | 02.11.2026 |
| dynamo-gironda | Dynamo Fitness Equipment (nowa) | Gironda Sternum Grip Chin-Up | https://blog.dynamofitness.com.au/?p=3027 | 5 (sprzedawca — rozstrzygnięcie 02.11.2026) | 02.11.2026 |
| gornation-one-arm-pull-up | GORNATION (nowa) | The One Arm Pull Up | https://www.gornation.com/blogs/calisthenics-exercises/one-arm-pull-up | 4 — drążki/kalistenika (rozstrzygnięcie 02.11.2026); tylko w „Otwarte” | 02.11.2026 |

Organizacje zarejestrowane w `cues.json` → `orgs` i ich szczebel po rozstrzygnięciu: BarBend 4 (technika), Coach 4, Breaking Muscle 5, Physitrack 5 (ocena wg (a)–(c) — wpis w `orgs` do przeglądu przez koordynatora), The Prehab Guys — do oceny koordynatora.

Nowe organizacje:
- **Rx Smart Gear** — producent sprzętu do treningu funkcjonalnego (w tym lin); szczebel 4 tylko dla lin.
- **GORNATION** — producent sprzętu do kalisteniki (drążki, kółka); szczebel 4 tylko dla tego sprzętu.
- **Dynamo Fitness Equipment** — sprzedawca sprzętu (Australia); szczebel 5, nie liczy się.

Przeczytane, ale niewykorzystane (zapis, żeby nie szukać ponownie):
- GORNATION „The Typewriter Pull UP” (https://www.gornation.com/blogs/calisthenics-exercises/typewriter-pull-up) — inny ruch niż Side To Side Chins w katalogu (analogia).
- weighttraining.guide, Gorilla Chin Crunch (https://weighttraining.guide/exercises/gorilla-chin-crunch) — autorka bez podanych kwalifikacji, serwis spoza listy; szczebel 5, nie liczy się.
- Dynamo Fitness, „Chin Up” (https://blog.dynamofitness.com.au/?p=2669) — zwykły chin-up, nie Gorilla Chin; sprzedawca, szczebel 5.
- Biblioteka ćwiczeń organizacji kalistenicznej z „Wide Grip Behind the Neck Pull-Up” — strona należy do serwisu z własną aplikacją treningową; wykluczona (uzupełnienie briefu, pkt 1).

## 5. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| mu.grip | Złap fałszywym chwytem. | Use a false grip. | Coach (kółka) + BarBend (drążek). Szczegół chwytu źródła opisują różnie (nadgarstek nad kółkiem / kciuk nie obejmuje drążka) — zostaje tylko nazwa chwytu. Uwaga dla tłumacza: termin „fałszywy chwyt” do sprawdzenia w słowniku terminów. |
| mu.transition | Podciągnij się wysoko i przerzuć klatkę i barki do przodu, nad dłonie. | Pull high, then roll your chest and shoulders forward over your hands. | Coach (pull as high as possible; shoulders forward, weight over hands) + BarBend (chest and shoulders forward over the bar). |
| mu.press | Wypchnij się do podporu na prostych rękach. | Press up to a straight-arm support. | Coach (press out to the top) + BarBend (press up, full elbow extension). |
| rope.lock | Owiń linę wokół nogi i zablokuj ją pod stopą. | Wrap the rope around your leg and lock it under your foot. | BarBend (S-lock) + Rx Smart Gear (S/J wrap). |
| rope.legs | Wstawaj na zablokowanej linie nogami — nie ciągnij samymi rękami. | Stand up on the locked rope with your legs — don't just pull with your arms. | BarBend (stopa jak stopień, wypychanie nogami) + Rx Smart Gear (nogi zamiast rąk). |
| rope.rewrap | Po każdym wstaniu znów zablokuj linę stopami. | After each stand-up, lock the rope with your feet again. | BarBend (re-wrap) + Rx Smart Gear (ponowne zaplatanie przy wspinaniu). |

Zdania zaproponowane wcześniej, po korekcie 02.11.2026 bez kompletu źródeł — NIE do integracji (zapis w sekcji 6): `hang.grip` „Chwyć drążek na szerokość barków albo trochę szerzej i zawiśnij na prostych rękach.”, `hang.tight` „Trzymaj całe ciało napięte i spokojne.”, `scap.hang` „Chwyć drążek i zawiśnij swobodnie na prostych rękach.”, `scap.pull` „Nie zginając rąk, ściągnij łopatki w dół, z dala od uszu, potem wróć do swobodnego zwisu.”, `gir.pull` „Odchyl się, wypnij klatkę i ciągnij, aż drążek dotknie środka klatki, nie brody.”

## 6. Otwarte

- **Dead Hang (cała karta) — szczebel źródła wg rozstrzygnięcia 02.11.2026:** `hang.grip`, `hang.tight`, `pu.noSwing` miały Physitrack + BarBend; Physitrack = 5 → każde zdanie ma tylko BarBend (dwa artykuły, jedna organizacja). Potrzebne drugie źródło szczebla 4 (np. producent drążków, organizacja szkoląca trenerów).
- **Dead Hang — ściągnięcie barków w dół („aktywny zwis”):** potwierdza tylko BarBend; istnieje też zwis bierny — bez drugiego źródła nie przesądzamy.
- **Dead Hang — oddech** („nie wstrzymuj oddechu”): tylko Physitrack (szczebel 5).
- **Dead Hang — zestaw ogólny `npu.hang`:** zdanie o uchwytach nie pasuje do drążka (sekcja 1) — błąd zestawu ogólnego; rekomendacja: tryb `open`.
- **Scapular Pull-Up (cała karta) — szczebel źródła wg rozstrzygnięcia 02.11.2026:** `scap.hang`, `scap.pull` miały The Prehab Guys + Breaking Muscle (+ Physitrack, wariant); Breaking Muscle = 5, Physitrack = 5 → zostaje najwyżej jedno źródło (The Prehab Guys, szczebel do oceny). Błąd „żebra do przodu” — tylko Breaking Muscle (5); „bez bujania” — tylko Prehab Guys.
- **Gironda Sternum Chins — szczebel źródła wg rozstrzygnięcia 02.11.2026:** `gir.pull` miało Breaking Muscle + Dynamo Fitness — oba szczebel 5. Chwyt sprzeczny/nieustalony. **Zestaw ogólny** (`pu.shoulders`, `pu.elbowsDown`, `pu.noSwing`, `pu.partial`) — „łokcie w dół do boków” i „bez wyprostu na dole” nie są sprawdzone dla tego wariantu (odchylenie, klatka do drążka); rekomendacja: tryb `open`.
- **Muscle Up:** otwarte zostają **zamach** (BarBend opisuje wersję z zamachem, Coach — bez, z prostymi nogami); **odchylenie tułowia przy podciąganiu** (BarBend — tak; Breaking Muscle — przeciw, ale szczebel 5); **opuszczanie** (tylko Coach: kontrola w dół).
- **Rope Climb:** zjazd (rozluźnienie zamka stopami, schodzenie z kontrolą) — tylko Rx Smart Gear; przechwyt rąk wyżej — żadne z dwóch źródeł nie opisuje wprost. Strony CrossFit — tylko wideo (nieczytane).
- **Mixed Grip Chin:** Coach nie ma tego wariantu; GORNATION opisuje „commando pull-up” (dłonie jedna za drugą wzdłuż drążka) — inne ćwiczenie. Pozostałe wyniki to strony aplikacji lub serwisy bez autora. Zmiana ułożenia dłoni co serię i praca brzucha przeciw skręcaniu — **nieprzeczytane w dwóch źródłach, nie do aplikacji**.
- **One Arm Chin-Up:** GORNATION „The One Arm Pull Up” (wariant: nachwyt; szczebel 4) — ściągnięcie barku w dół i do tyłu przed zgięciem łokcia, bez bujania, nadmierny obrót tułowia to błąd, powolne opuszczanie. **Jedno źródło** — drugiego nie znaleziono. Zestaw ogólny `vpull` nie mówi o kontroli obrotu tułowia.
- **Wide-Grip Rear Pull-Up:** jedyny przeczytany tekst techniki należy do serwisu z własną aplikacją — wykluczony. Przeciążenie barków i szyi to temat zdrowotny — pełne zasady (szczebel 2–3). Rekomendacja: tryb `open` zamiast zestawu ogólnego `vpull`.
- **Side To Side Chins:** w opisie z bazy katalogu ruch to podciąganie szerokim nachwytem z przechyleniem w jedną stronę, powrót do zwisu, to samo w drugą stronę. Przeczytane opisy („typewriter”, „archer”) dotyczą innych ruchów — analogia.
- **Gorilla Chin/Crunch:** jedyny przeczytany opis spoza aplikacji ma autorkę bez podanych kwalifikacji — szczebel 5. Zestaw ogólny `hanging` — kierunkowo zgodny z tym jednym opisem, ale niepotwierdzony.

## 7. Stan

- Zrobione (sesje 1–2): przeszukanie wszystkich 10 ćwiczeń.
- Zrobione (korekta szczebli 02.11.2026): ponowna ocena szczebli wg rozstrzygnięcia; gotowe: **Muscle Up, Rope Climb**; otwarte: Dead Hang, Scapular Pull-Up, Gironda Sternum Chins (spadły), Mixed Grip Chin, One Arm Chin-Up, Wide-Grip Rear Pull-Up, Side To Side Chins, Gorilla Chin/Crunch.
- Zostało (decyzje koordynatora): (1) przegląd wpisu Physitrack w `orgs` (szczebel 5 wg (a)–(c) — wpływa na inne rodziny); (2) ocena The Prehab Guys wg (a)–(c); (3) tryb `open` zamiast zestawu ogólnego dla Dead Hang (`npu.hang` o uchwytach), Gironda i Wide-Grip Rear Pull-Up; (4) termin „fałszywy chwyt” w słowniku terminów.
- Następny krok (jeśli wracamy): drugie źródło szczebla 4 dla Dead Hang i Scapular Pull-Up (producenci drążków, np. GORNATION; organizacje szkolące trenerów); drugie źródło dla One Arm Chin-Up.
- Pułapki: `exrx.net` — 403; `web.archive.org` — zablokowane; `barbend.com/dead-hang/` i `barbend.com/rope-climb/` — 404; `bodybuilding.com/exercises/...` przekierowuje na sklep; strony CrossFit o linie — tylko wideo; wiele wyników to strony aplikacji (wykluczone).

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3); `g6-szczeble-uzupelnienie-2.md` (strony Coach i The Prehab Guys sprawdzone 02.11.2026); kryterium karty z decyzji 02.11.2026.

### Źródła → szczebel

| Źródło | Szczebel | Dowód |
|---|---|---|
| `coach-gymnastic-rings` (Coach) | **5** | uzup. 2: magazyn Coach warunkowo 4 tylko z autorem z kwalifikacjami w biogramie; `g6-szczeble-uzupelnienie-2.md`, tabela 1: J. Snape — biogram bez kwalifikacji trenerskich, porady o muscle-upie bez przypisanej osoby, link afiliacyjny w treści |
| `barbend-muscle-up` (BarBend) | 4 | artykuł o technice, autor CSCS (zapis w pliku); bez wpływu — Muscle Up i tak ma jedną organizację |
| `barbend-rope-climbs` (BarBend) | **4** | WebFetch 02.11.2026: „Written by Jake Boly, CSCS”; „Last updated on August 29th, 2023”; magister nauk o sporcie; w treści brak linków zakupowych |
| `rxsg-rope-foot-locks` (Rx Smart Gear) | 4 | producent lin — własny rodzaj sprzętu (rozstrzygnięcie dla producentów) |
| `prehabguys-scapular-pull-up` (The Prehab Guys) | 5 | `g6-szczeble-uzupelnienie-2.md`, tabela 1: biblioteka wideo bez autora |
| `gornation-one-arm-pull-up` (GORNATION) | 4 (drążki) | bez zmian; jedno źródło |
| Physitrack, Breaking Muscle, Dynamo | 5 | bez zmian |
| `barbend-grip-exercises`, `barbend-women-pull-up` | 4 | jedna organizacja (BarBend) — Dead Hang nadal jedno źródło |

### Zdania → stan

| Zdanie | Ćwiczenie | Źródła po przeliczeniu | Stan |
|---|---|---|---|
| `mu.grip`, `mu.transition`, `mu.press` | Muscle Up | tylko BarBend | **spadają** |
| `rope.lock`, `rope.legs`, `rope.rewrap` | Rope Climb | BarBend + Rx Smart Gear | zostają |

### Karty → stan

| Ćwiczenie | Stan | Powód |
|---|---|---|
| Rope Climb | własna bez błędów | ustawienie (`rope.lock`) + ruch (`rope.legs`, `rope.rewrap`) |
| Muscle Up | **otwarta** (było: gotowe) | Coach = 5 → jedno źródło |
| Dead Hang, Scapular Pull-Up, Gironda, Mixed Grip, One Arm, Wide-Grip Rear, Side To Side, Gorilla | otwarte | bez zmian |

Liczby: przed — gotowe 2, otwarte 8; po — własne z błędami 0, własne bez błędów 1, otwarte 9.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

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
  }
}
```

Nowe zdania w bloku: `rope.lock`, `rope.legs`, `rope.rewrap` (3). Rysunek Rope Climb dziś pomijany (docs/54) — karta w trybie bez rysunku.
