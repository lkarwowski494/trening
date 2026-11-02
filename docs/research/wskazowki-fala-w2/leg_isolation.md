# Wskazówki techniki — rodzina `leg_isolation` (fala W2)

Data: 02.11.2026 · rodzina: `leg_isolation` · **Status: PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Podstawa: przeliczenie szczebli G4 z 02.11.2026 (gałąź badania/g4-nogi, plik `przeliczenie-szczebli-2026-11-02.md`, sekcja
„leg_isolation.md, hip_bridge.md, glute_floor.md”) i dane W1 (ta sama gałąź, plik `leg_isolation.md`); szczeble organizacji:
`szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211) oraz rozstrzygnięcia koordynatora z 02.11.2026 (brief W2).
Strony czytane narzędziem WebFetch 02.11.2026. Bez liczb (tempo, obciążenia) i bez twierdzeń o zdrowiu.
Ćwiczenia z trybem `own` w `lib/figures/v2/cue-sets.json` (Leg Extension, Leg Curl, Lying Leg Curl) — poza zakresem.

## 1. Tabela ćwiczeń

| ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Single-Leg Leg Extension | tak | **gotowe z błędem** (warunkowo: NFPT = 4 wg reguły „ramka autora z kwalifikacjami”; uproszczenie: wariant jednonóż Leg Extension) | sprawdzona ramka NFPT (R. Bovee, „Certified Master PPT, RTS, ETS, FTS”, wpis 11.08.2025); `lext.setup`, `lext.back`, `lext.move` = NFPT + Hoist; błąd `lext.mis.back` (NFPT wprost + Hoist standard + wniosek) | wskazówka `llc.control` — Hoist mówi tylko o powolnym powrocie (bez tipu); `lext.range` — patrz Otwarte |
| Seated Band Hamstring Curl | tak | **gotowe z błędem** (uproszczenie: wariant sprzętu Seated Leg Curl) | drugie źródło: NASM Single-Leg Seated Leg Curl (maszyna, jednonóż) dla ruchu, zakresu i błędu; `bandcurl.setup` przeredagowane do części wspólnej; błąd `lcurl.mis.partial` | — |
| Slider Hamstring Curl | tak | **gotowe z błędem** (uproszczenie: wariant sprzętu Stability Ball Hamstring Curl) | drugie źródło dla ustawienia i ruchu: ACE #59 i NCSF (piłka); `slcurl.setup` przeredagowane; błąd `ballcurl.mis.sag` (NISMAT wprost + NCSF + wniosek) | — |
| Stability Ball Hamstring Curl | nie | gotowe z błędem (W1) | drugi błąd `ht.mis.arch` (ACE wprost + NCSF standard) | — |
| Glute Ham Raise | nie | **gotowe z błędami** (ruch: Bells of Steel + McAllister 2014, szczebel 3) | ruch potwierdzony badaniem (zakres 90° w kolanie, biodro neutralne); błędy `ghr.mis.arch` (RTS + BoS) i `ghr.mis.toes` (RTS + wniosek) | ustawienie poduszek na udach — jedno źródło; `nordic.hips` — jedno źródło (szczebel 3) |
| Standing Cable Leg Curl | tak | otwarte | nowe źródło ACE #132 (ustawienie i ruch); REP Fitness przeliczony na 5 | drugie źródło szczebla 4 |
| Standing Leg Curl | tak | otwarte | strona Body-Solid nr 53 sprawdzona — to strona konserwacji, nie instrukcja | jakiekolwiek źródło szczebla 4 (kopia instrukcji G6B nieutożsamiona) |
| Reverse Nordic | nie | otwarte | — (nie badane ponownie) | 2 źródła szczebla 4 |
| Sissy Squat | nie | otwarte | — (nie badane ponownie) | ustawienie z 2 źródłami |
| Leg Curl (hantel) | nie | otwarte | — (nie badane ponownie) | 2 źródła szczebla 4 |

### Blok do wdrożenia

```json
{
  "Single-Leg Leg Extension": {
    "setup": [
      {"c": "lext.setup", "s": [
        ["nfpt-leg-extensions", "uproszczenie: wariant jednonóż Leg Extension; Training Tips („The seat should be adjusted to a position where your knees are even with the pivot point of the leg pad arm”; wałek tuż nad kostkami)"],
        ["hoist-hd3400", "uproszczenie: wariant jednonóż, maszyna Hoist; Leg Extension („your knee joint is aligned with the pivot point of the exercise arm”; dolna poduszka na kostkach)"]
      ]},
      {"c": "lext.back", "s": [
        ["nfpt-leg-extensions", "uproszczenie: wariant jednonóż; Starting Position („Sit on the seat with your back against the seat.”)"],
        ["hoist-hd3400", "uproszczenie: wariant jednonóż; Leg Extension („with your back flat against the back pad”)"]
      ]}
    ],
    "move": [
      {"c": "lext.move", "s": [
        ["nfpt-leg-extensions", "uproszczenie: wariant jednonóż; Execution („Push the footpads up until your legs are straight.”; powolne opuszczanie; parafraza)"],
        ["hoist-hd3400", "uproszczenie: wariant jednonóż; Leg Extension (pchnij poduszkę, prostując nogi; powolny powrót; parafraza)"]
      ]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "lext.mis.back", "s": [
        ["nfpt-leg-extensions", "Warning Tips („Do not arch your back during this movement.”)"],
        ["hoist-hd3400", "Leg Extension (plecy płasko na oparciu) — błąd = zaprzeczenie standardu"],
        ["wniosek", "lext.back"]
      ]}
    ]
  },
  "Seated Band Hamstring Curl": {
    "setup": [
      {"c": "bandcurl.setup", "s": [
        ["staywell-seated-hamstring-curl", "kroki 1–3 („Sit in a chair facing the closed door. Slip the loop of the elastic exercise band around the heel of your leg.”)"],
        ["nasm-single-leg-seated-leg-curl", "uproszczenie: wariant sprzętu Seated Leg Curl (maszyna); Step 1–2 (siad, opór z przodu tuż nad kostką; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "bandcurl.move", "s": [
        ["staywell-seated-hamstring-curl", "kroki („Slowly pull the elastic band backward along the floor with your heel”; „Slowly return your leg to the starting position.”)"],
        ["nasm-single-leg-seated-leg-curl", "uproszczenie: wariant sprzętu; Step 3–4 (pięta w stronę pośladka, powrót z kontrolą; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "lcurl.full", "s": [
        ["staywell-seated-hamstring-curl", "kroki („Stop when you can't pull it any farther.”)"],
        ["nasm-single-leg-seated-leg-curl", "uproszczenie: wariant sprzętu; Common Mistakes („Not achieving full range of motion…”)"]
      ]}
    ],
    "mistakes": [
      {"c": "lcurl.mis.partial", "s": [
        ["nasm-single-leg-seated-leg-curl", "uproszczenie: wariant sprzętu; Common Mistakes („Not achieving full range of motion…”)"],
        ["staywell-seated-hamstring-curl", "kroki (ciągnij, aż nie da się dalej) — błąd = zaprzeczenie standardu"],
        ["wniosek", "lcurl.full"]
      ]}
    ]
  },
  "Slider Hamstring Curl": {
    "setup": [
      {"c": "slcurl.setup", "s": [
        ["nismat-hamstring-sliders", "opis („Lie on your back, bend your knees and place a towel under your feet.”; biodra w górę „in a bridge position”)"],
        ["ace-59", "uproszczenie: wariant sprzętu Stability Ball Hamstring Curl; Step 1–2 (na plecach, pięty na piłce, biodra w górę do linii z tułowiem; parafraza)"],
        ["ncsf-single-leg-ball-curl", "uproszczenie: wariant sprzętu (piłka, jednonóż); pozycja wyjściowa (biodra w pełnym wyproście, pięty na piłce; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "slcurl.move", "s": [
        ["nismat-hamstring-sliders", "opis („slide the towel away from your body while extending your legs”; powrót „without dropping your hips”)"],
        ["ace-59", "uproszczenie: wariant sprzętu; Step 3–4 (pięty do bioder, powolny powrót; parafraza)"],
        ["ncsf-single-leg-ball-curl", "uproszczenie: wariant sprzętu; ruch (pięta do pośladków, powolny wyprost; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "llc.control", "s": [
        ["rts-valslide-leg-curl", "punkty techniki („Lower slowly and under control!”)"],
        ["ace-59", "uproszczenie: wariant sprzętu; Step 3 i 4 („slowly contract…”, „slowly lower…”)"]
      ]},
      {"c": "plank.brace", "s": [
        ["nismat-hamstring-sliders", "opis („Engage your abdominals…”)"],
        ["ace-59", "uproszczenie: wariant sprzętu; Step 1; Tips (napięty brzuch przez całe ćwiczenie; parafraza)"]
      ]}
    ],
    "mistakes": [
      {"c": "ballcurl.mis.sag", "s": [
        ["nismat-hamstring-sliders", "opis („…without dropping your hips”)"],
        ["ncsf-single-leg-ball-curl", "uproszczenie: wariant sprzętu; („the hips should not sag”)"],
        ["wniosek", "slcurl.move"]
      ]}
    ]
  },
  "Stability Ball Hamstring Curl": {
    "setup": [
      {"c": "ballcurl.setup", "s": [
        ["ace-59", "Step 1–2 (na plecach, łydki i pięty na piłce; unieś biodra do linii z tułowiem; parafraza)"],
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) pozycja wyjściowa (biodra w pełnym wyproście, obie pięty na piłce; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "ballcurl.move", "s": [
        ["ace-59", "Step 3–4 (przyciągnij pięty do bioder, potem powoli wróć; parafraza)"],
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) przyciągnięcie pięty do pośladków przy wyprostowanym biodrze, powolny powrót; parafraza"]
      ]}
    ],
    "tips": [
      {"c": "plank.brace", "s": [
        ["ace-59", "Step 1; Tips („…keeping them engaged throughout the lift”; parafraza)"],
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) („Maintain proper trunk activation throughout each repetition”)"]
      ]}
    ],
    "mistakes": [
      {"c": "ballcurl.mis.sag", "s": [
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) („the hips should not sag”)"],
        ["ace-59", "Step 3 (tułów stabilny, w linii z udami; parafraza) — błąd = zaprzeczenie standardu"]
      ]},
      {"c": "ht.mis.arch", "s": [
        ["ace-59", "Tips („Avoid pushing your hips too high as this generally increases the amount of hyperextension (arching) in your low back.”)"],
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) („…to ensure a neutral pelvic tilt”) — błąd = zaprzeczenie standardu"]
      ]}
    ]
  },
  "Glute Ham Raise": {
    "setup": [
      {"c": "ghr.heels", "s": [
        ["rts-ghr", "punkty techniki („Find (and keep) your heels.”); błędy (pięty odrywają się od płyty)"],
        ["bos-ghd-use", "sekcja Glute Ham Raise („feet anchored”; „Push through your heels…”)"]
      ]}
    ],
    "move": [
      {"c": "ghr.move", "s": [
        ["bos-ghd-use", "sekcja Glute Ham Raise („Start by kneeling tall”; opuszczanie tułowia „until your torso is parallel to the ground”; powrót tyłem ud)"],
        ["mcallister-2014", "Procedures, s. 1575 (zakres 90° wyprostu i zgięcia w kolanie „while maintaining a neutral hip”); ryc. 1, s. 1574 — szczebel 3"]
      ]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "ghr.mis.arch", "s": [
        ["rts-ghr", "błędy (szybkie powtórzenia z plecami „crazy arched”)"],
        ["bos-ghd-use", "sekcja Glute Ham Raise („keeping your core engaged and your back straight”) — błąd = zaprzeczenie standardu"]
      ]},
      {"c": "ghr.mis.toes", "s": [
        ["rts-ghr", "błędy („if you're on your toes, you're not maximally engaging the hamstrings”; pięty odrywają się od płyty)"],
        ["wniosek", "ghr.heels"]
      ]}
    ]
  }
}
```

Uwagi do bloku:
- **Single-Leg Leg Extension** zależy od NFPT = 4. Ramka po artykule: Robert Bovee, „Certified Master PPT, RTS, ETS, FTS”; podpis artykułu „by Guest Author”, data „Posted August 11th, 2025”. Strona nie łączy wprost ramki z autorstwem (WebFetch 02.11.2026). Reguła koordynatora z briefu W2 („4 tylko gdy ramka autora podaje kwalifikacje”) jest spełniona — gdyby koordynator uznał ramkę za niezwiązaną z autorem, ćwiczenie wraca do otwartych (zostaje samo Hoist).
- Hoist opisuje własną maszynę HD-3400 — przy innej maszynie to uproszczenie (szczeble-organizacji-2026-11-02.md, wiersz Hoist); oba źródła opisują prostowanie obunóż → „uproszczenie: wariant jednonóż Leg Extension” (ruch w kolanie, ustawienie siedziska i wałka takie same).
- **Seated Band Hamstring Curl**: NASM opisuje maszynę (jednonóż). Kierunek zaczepu gumy (przodem do zaczepu) wynika z tego samego układu co na maszynie — opór z przodu, za kostką; pozycję wyjściową nogi pominięto, bo NASM zaczyna od kolana zgiętego ok. 90°, a StayWell od nogi wysuniętej.
- **Slider Hamstring Curl**: ślizgacze i piłka — ten sam ruch (na plecach, biodra w górze, przyciąganie pięt zginaniem kolan); różni się tylko przyrząd pod piętami. Ustawienie przeredagowane do części wspólnej (bez „kolana ugięte”, bo ACE i NCSF zaczynają od nóg prostych).
- **Glute Ham Raise**: ruch = szczebel 4 + szczebel 3 (McAllister i in. 2014 — badanie z obciążeniem przy klatce; technika ruchu ta sama). Ustawienie = tylko zdanie o piętach (`ghr.heels`); poduszki na udach — jedno źródło (Bells of Steel), nie wpisane. Poza v2 dla GHR nie istnieje — karta czeka na rysunek.

## 4. Nowe zdania

Zdania W1 bez zmian brzmienia: `ballcurl.setup`, `ballcurl.move`, `ballcurl.mis.sag`, `lext.setup`, `lext.move`, `lext.back`, `bandcurl.move`,
`lcurl.full`, `ghr.heels`, `ghr.mis.arch` (tekst i EN — W1, sekcja 4). Nowe albo przeredagowane w W2:

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| lext.mis.back | Odrywanie pleców od oparcia albo wyginanie ich w łuk. | Peeling your back off the backrest or arching it. | brak błędu dla prostowania nóg; `bp.mis.arch` dotyczy ławki i wyciskania |
| bandcurl.setup (zmiana W1) | Usiądź przodem do miejsca, gdzie zaczepiona jest guma; pętlę załóż za piętę. | Sit facing the band's anchor point with the loop behind your heel. | W1 miało „noga wysunięta w przód” — NASM zaczyna od zgiętego kolana; zostaje część wspólna |
| lcurl.mis.partial | Zginanie kolana tylko do połowy zamiast tak daleko, jak się da. | Only bending your knee halfway instead of as far as it goes. | `calf.mis.partial` dotyczy łydek |
| slcurl.setup (zmiana W1) | Połóż się na plecach, pięty na ślizgaczach; unieś biodra jak przy mostku. | Lie on your back with your heels on the sliders; lift your hips into a bridge. | część wspólna NISMAT i wersji z piłką |
| slcurl.move (zmiana W1) | Wysuń nogi do wyprostu, potem przyciągnij pięty z powrotem — biodra cały czas w górze. | Slide your legs out until straight, then pull your heels back in — hips up the whole time. | ruch ze ślizgaczami |
| ghr.move (zmiana W1) | Z klęku opuszczaj tułów w przód, aż będzie mniej więcej równolegle do podłogi; potem podciągnij się z powrotem tyłem ud. | From tall kneeling, lower your torso forward until it's roughly parallel to the floor, then pull yourself back up with your hamstrings. | W1: „napinając tył ud i pośladki” — rola pośladka w GHR otwarta (plik ról), więc bez pośladków |
| ghr.mis.toes | Odrywanie pięt od płyty — wspinanie się na palce. | Lifting your heels off the plate — coming up onto your toes. | zaprzeczenie `ghr.heels`; RTS nazywa go wprost |

Do przeglądu recenzenta lokalizacji (brief: teksty naturalne).

## 5. Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| nfpt-leg-extensions | https://nfpt.com/how-to-do-leg-extensions/ | NFPT | „by Guest Author”; ramka: Robert Bovee, „Certified Master PPT, RTS, ETS, FTS”; „Posted August 11th, 2025” | **4 warunkowo** (W1: 5) — reguła koordynatora W2: ramka z kwalifikacjami; wiązanie ramki z autorem niepotwierdzone na stronie |
| hoist-hd3400 | https://www.hoistfitness.com/pages/hd-3400-leg-extension-leg-curl | Hoist Fitness | instrukcja własnej maszyny | 4 dla HD-3400; przy innej maszynie — uproszczenie |
| staywell-seated-hamstring-curl | https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814 | WebMD Ignite (StayWell) — Vanderbilt Health | recenzja: E. Oswald PT DPT i in.; „Date Last Reviewed: 2/1/2025” | 4 (placówka medyczna z datą — rozstrzygnięcie 2) |
| nasm-single-leg-seated-leg-curl | https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl | NASM | treść firmowana NASM, bez daty | 4 (istniejące w `cues.json`) |
| ace-59 | https://www.acefitness.org/resources/everyone/exercise-library/59/stability-ball-hamstring-curl/ | ACE | biblioteka firmowana ACE | 4 (W1) |
| ncsf-single-leg-ball-curl | https://www.ncsf.org/blog/183-single-leg-stability-ball-leg-curl | NCSF | „By NCSF” | 4 (W1) |
| nismat-hamstring-sliders | https://nismat.org/2023/12/11/hamstring-sliders/amp/ | NISMAT (instytut medycyny sportowej przy szpitalu) | wpis „nismatny”; data w adresie 11.12.2023, na stronie data względna | 4 (rozstrzygnięcie 2: jawne firmowanie placówki) |
| rts-valslide-leg-curl | https://robertsontrainingsystems.com/blog/crush-your-hamstrings-and-glutes-with-the-valslide-leg-curl/ | Robertson Training Systems | M. Robertson, 13.03.2019 | 4 (W1; zakres certyfikacji RTS „do potwierdzenia koordynatora”) |
| rts-ghr | https://robertsontrainingsystems.com/blog/how-to-perform-the-glute-ham-raise/ | Robertson Training Systems | M. Robertson, 22.10.2019 | 4 (jw.) |
| bos-ghd-use | https://bellsofsteel.us/blogs/content/how-to-use-a-ghd-machine | Bells of Steel | treść firmowana, 30.05.2023, bez autora | 4 tylko dla GHD (producent własnego GHD — W1). Uwaga: to wpis blogowy, nie instrukcja konkretnego modelu — w świetle uzup. 3 (blog producenta = 5) do potwierdzenia koordynatora; od tego zależy karta GHR |
| mcallister-2014 | https://oliverfinlay.com/assets/pdf/mcallister%20et%20al%20(2014)%20muscle%20activation%20during%20various%20hamstring%20exercises.pdf | McAllister i in., J Strength Cond Res 2014;28(6):1573–1580 | recenzowane badanie; s. 1574 ryc. 1, s. 1575 Procedures | 3 (kopia PDF; przy integracji adres wydawcy/PubMed) |
| ace-132 (nowe) | https://www.acefitness.org/resources/everyone/exercise-library/132/standing-hamstrings-curl/ | ACE | biblioteka firmowana ACE | 4 — tylko Standing Cable Leg Curl (otwarte) |
| rep-ankle-strap | https://repfitness.com/blogs/training/creative-ways-to-use-the-ankle-strap-for-a-cable-machine | REP Fitness | „By: Aimee Heckel”, 11.04.2023, akt. 03.08.2026; brak kwalifikacji | **5** (W1: 4) — blog producenta, nie instrukcja maszyny, autorka bez kwalifikacji (uzup. 3) |

Nie liczone: kopie instrukcji Body-Solid G6B (manualsonline, manualsdir, manualsdump — nieutożsamione z dokumentem producenta, reguła jak
Life Fitness w przeliczeniu); bodysolid.com/exercises/article/53/Standing_Leg_Curl — strona konserwacji, bez instrukcji; serwisy innych
aplikacji z wyników wyszukiwania — pominięte; Muscle & Strength — [OTWARTE] szczebel (403).

## 6. Otwarte

- **Single-Leg Leg Extension — `lext.range`** (zestaw ogólny): „aż do wyprostu kolan” zgadza się z NFPT („until your legs are straight”)
  i Hoist („extending the legs fully”), ale Hoist dodaje „taking care not to lock your knees”. Część wspólna: prostuj do wyprostu; „bez
  blokowania” — jedno źródło. Dolny kąt „mniej więcej pod kątem prostym” — NFPT („Your knees should now be at 90 degrees”) + Hoist? (nie podaje) → jedno źródło. Proponuję w karcie `lext.move` zamiast `lext.range`.
- **Single-Leg Leg Extension — uwaga produktowa:** NFPT pisze, że wersję jednonóż robi się „for rehab purposes only” i że „this can hurt the lower back” — twierdzenie zdrowotne z jednego źródła, nie do aplikacji; do wiadomości koordynatora (to samo źródło zasila kartę).
- **`llc.control` przy Single-Leg Leg Extension** — NFPT (kontrola, nie opuszczać szybciej niż…) + Hoist (tylko powolny powrót) — zgodne kierunkowo, ale Hoist nie mówi o fazie w górę; nie wpisane.
- **Standing Cable Leg Curl** — ACE #132 (ustawienie: dolny bloczek, mankiet nad kostką, przodem do maszyny, ciężar na nodze podporowej; ruch: pięta w stronę kości ogonowej, pauza, powolne opuszczenie) — jedno źródło szczebla 4. REP → 5. Rozstrzygnie drugie źródło szczebla 4 (np. NASM/ISSA/BarBend z autorem).
- **Standing Leg Curl (maszyna)** — 0 źródeł szczebla 4 (kopia G6B nieutożsamiona; Body-Solid nr 53 to strona konserwacji). Rozstrzygnie oryginalna instrukcja producenta maszyny albo 2 serwisy szczebla 4.
- **Glute Ham Raise** — `ghr.setup` (poduszki na przodzie ud) tylko Bells of Steel; `nordic.hips` tylko McAllister 2014 (szczebel 3; jako wskazówka wymaga 2 źródeł). Status Bells of Steel (blog producenta) do potwierdzenia — jeśli 5, karta GHR wraca do otwartych. Odmiana z ruchem w biodrze (NSCA Kinetic Select, 403 w W1) — nieprzeczytana.
- **Reverse Nordic, Sissy Squat, Leg Curl (hantel)** — bez nowych badań w W2 (stan W1, sekcja 6).
- **Zestawy ogólne** (`cue-sets.json`) dla ćwiczeń z kartą w tym pliku: `mis.jerk`, `lcurl.still` przy Seated Band Hamstring Curl, `gb.heels` przy Slider Hamstring Curl — nie potwierdzone dla tych ćwiczeń (W1, sekcja 6); karta własna je zastępuje.
