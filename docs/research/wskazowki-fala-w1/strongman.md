# Wskazówki techniki — rodzina `strongman` (fala W1, G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: Tire Flip, Atlas Stones, Sandbag Load, Yoke Walk, Log Lift, Keg Load, Jefferson Squat, Circus Bell, Conan's Wheel, Power Stairs
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda: jak w `carry.md`. Wskazówka wchodzi, gdy potwierdzają ją ≥ 2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji. Bez liczb i bez twierdzeń zdrowotnych: kilka przeczytanych źródeł pisze o urazach (np. bicepsa przy oponie i kamieniu), ale tych treści celowo nie przenoszę. Wszystkie strony czytane 02.11.2026 (WebFetch). W tej niszy źródła szczebla 4 to głównie producenci sprzętu strongman z działem szkoleniowym (artykuły trenerów) i serwisy trenerskie.

## 1. Tabela ćwiczeń

| Ćwiczenie | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Tire Flip | open | gotowe | ustawienie, ruch (2), 1 błąd |
| Atlas Stones | open | częściowe | ustawienie (2), ruch (2); brak wspólnego błędu |
| Sandbag Load | open | otwarte | nie zbadano (limit kontekstu) — patrz „Stan” |
| Yoke Walk | general (`carry`) | gotowe | ustawienie, ruch, 1 wskazówka, 1 błąd; ogólny zestaw do zastąpienia (patrz „Otwarte”) |
| Log Lift | open | gotowe | ustawienie, ruch (2), 1 błąd |
| Keg Load | open | otwarte | nie zbadano |
| Jefferson Squat | general (`squat`) | otwarte | nie zbadano; obecny zestaw przysiadu (`sq.*`) wymaga sprawdzenia (ustawienie okrakiem nad sztangą jest inne) |
| Circus Bell | open | otwarte | nie zbadano |
| Conan's Wheel | open | otwarte | nie zbadano |
| Power Stairs | open | otwarte | nie zbadano |

## 2. JSON do `exercises` (cues.json)

```json
{
  "Tire Flip": {
    "setup": [
      {
        "c": "tf.setup",
        "s": [
          ["elitefts-tire-flip", "setup (four-point stance, klatka wciśnięta w oponę; ręce szeroko)"],
          ["8wo-tire-flip", "Setup (przysiad, klatka oparta o oponę; chwyt na zewnątrz stóp)"]
        ]
      }
    ],
    "move": [
      {
        "c": "tf.drive",
        "s": [
          ["elitefts-tire-flip", "drive (biodra wypychają oponę w górę, pełny wyprost)"],
          ["8wo-tire-flip", "Drive (wstajesz, klatka i barki cały czas w kontakcie z oponą)"]
        ]
      },
      {
        "c": "tf.push",
        "s": [
          ["elitefts-tire-flip", "finish („drive the tire forward as if bench pressing it away from your chest”)"],
          ["8wo-tire-flip", "Flip/Push (dłońmi przepchnij oponę na drugą stronę)"]
        ]
      }
    ],
    "tips": [],
    "mistakes": [
      {
        "c": "tf.mis.arms",
        "s": [
          ["elitefts-tire-flip", "common errors (podnoszenie jak w martwym ciągu na prostych rękach; podciąganie rękami)"],
          ["8wo-tire-flip", "Common Mistakes (klatka i barki tracą kontakt z oponą przy wstawaniu; parafraza)"]
        ]
      }
    ]
  },
  "Atlas Stones": {
    "setup": [
      {
        "c": "as.setup",
        "s": [
          ["8wo-atlas", "Setup and Stance („straddling directly over the top of the stone”)"],
          ["cerberus-atlas", "Setup & Stance (rozstaw stóp mniej więcej na szerokość kamienia)"]
        ]
      },
      {
        "c": "as.grip",
        "s": [
          ["8wo-atlas", "Grip (kamień ściśnięty między przedramionami)"],
          ["cerberus-atlas", "Grip (ściskanie przedramionami i dłońmi)"]
        ]
      }
    ],
    "move": [
      {
        "c": "as.lap",
        "s": [
          ["8wo-atlas", "Loading the Lap"],
          ["cerberus-atlas", "Lapping the Stone (kamień przeniesiony nad kolana)"]
        ]
      },
      {
        "c": "as.extend",
        "s": [
          ["8wo-atlas", "Extension (najpierw biodra w górę, potem wypchnięcie bioder)"],
          ["cerberus-atlas", "Lapping the Stone / Extension (siła bioder, pełny wyprost)"]
        ]
      }
    ],
    "tips": [],
    "mistakes": []
  },
  "Yoke Walk": {
    "setup": [
      {
        "c": "yoke.setup",
        "s": [
          ["bos-yoke", "setup („Position the crossbeam on your back.”)"],
          ["strengthshop-yoke", "Bar Position (belka na górze mięśni czworobocznych)"]
        ]
      }
    ],
    "move": [
      {
        "c": "yoke.brace",
        "s": [
          ["bos-yoke", "Bracing (napięcie brzucha na starcie, utrzymane przez cały marsz)"],
          ["strengthshop-yoke", "Unracking („Take a big breath, brace your core, and stand up with the weight.”)"]
        ]
      }
    ],
    "tips": [
      {
        "c": "yoke.steps",
        "s": [
          ["bos-yoke", "Step Length (krótkie kroki, pięta przed palcami drugiej stopy)"],
          ["strengthshop-yoke", "Step Length („keep your steps small and fast”)"]
        ]
      }
    ],
    "mistakes": [
      {
        "c": "yoke.mis.stride",
        "s": [
          ["bos-yoke", "Common Mistakes (zbyt duże kroki)"],
          ["strengthshop-yoke", "Common Mistakes („Long strides create lateral sway…”)"]
        ]
      }
    ]
  },
  "Log Lift": {
    "setup": [
      {
        "c": "log.grip",
        "s": [
          ["elitefts-log-mistakes", "mistake 2 (chwyt dokładnie pośrodku)"],
          ["cerberus-log", "Setup and Grip („hands bang in the middle of the log”)"]
        ]
      }
    ],
    "move": [
      {
        "c": "log.clean",
        "s": [
          ["elitefts-log-mistakes", "mistakes 4–5 (kłoda na udach, potem łokcie „punch… under the log”)"],
          ["cerberus-log", "The Clean (kłoda przy ciele po podniesieniu na uda, łokcie pod kłodę)"]
        ]
      },
      {
        "c": "log.press",
        "s": [
          ["elitefts-log-mistakes", "Press / mistake 8 (wybicie z bioder)"],
          ["cerberus-log", "Press and Dip-Drive; Lockout (krótkie ugięcie, wypchnięcie, wyprost rąk)"]
        ]
      }
    ],
    "tips": [],
    "mistakes": [
      {
        "c": "log.mis.elbows",
        "s": [
          ["elitefts-log-mistakes", "mistakes 4 i 6 (łokcie za nisko przy zakładaniu i w pozycji na klatce)"],
          ["cerberus-log", "Common Mistakes (opadające łokcie przenoszą ciężar do przodu)"]
        ]
      }
    ]
  }
}
```

„Atlas Stones” jest częściowe (bez wskazówek i błędów), więc proponuję je na listę `partial`.

## 3. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| elitefts-tire-flip | EliteFTS | C.J. Murphy, Tire Flipping: Tips and Techniques (2006) | https://elitefts.com/blogs/training/tire-flipping-tips-and-techniques | 4 | tak, 02.11.2026 |
| elitefts-log-mistakes | EliteFTS | M. Mastell, 9 Log Press Mistakes and How to Fix Them (2015) | https://elitefts.com/blogs/training/9-log-press-mistakes-and-how-to-fix-them | 4 | tak, 02.11.2026 |
| 8wo-tire-flip | 8weeksout | Tire Flip Technique (2014) | https://8weeksout.com/2014/06/03/tire-flip-technique/ | 4 | tak, 02.11.2026 |
| 8wo-atlas | 8weeksout | Atlas Stone (2014) | https://8weeksout.com/?p=2853 | 4 | tak, 02.11.2026 |
| cerberus-atlas | Cerberus Strength | Become the Queen/King of the Atlas Stones (S. Bradley, 2023) | https://cerberus-strength.com/blogs/training-tips/become-the-queen-king-of-the-atlas-stones-with-sandra-bradley | 4 | tak, 02.11.2026 |
| cerberus-log | Cerberus Strength | Log Lifting Tips & Techniques (D. McPherson, 2023) | https://cerberus-strength.com/blogs/training-tips/log-lifting-tips-techniques-with-pro-coach-dale-mcpherson | 4 | tak, 02.11.2026 |
| bos-yoke | Bells of Steel | How to Get Into Strongman: Yoke Walk (2022) | https://www.bellsofsteel.us/blog/gear-education/how-to-get-into-strongman-yoke-walk/ | 4 | tak, 02.11.2026 |
| strengthshop-yoke | Strength Shop | Master the Yoke (2026) | https://strengthshop.eu/blogs/news/master-the-yoke-your-guide-to-yoke-training-for-strongman-athletes | 4 | tak, 02.11.2026 |

Nowe organizacje (propozycja szczebla 4):
- **EliteFTS** — producent sprzętu siłowego z działem szkoleniowym (artykuły trenerów); `kind: maker`.
- **8weeksout** — serwis trenera przygotowania motorycznego (artykuły z autorem); `kind: site`.
- **Cerberus Strength** — producent sprzętu strongman (artykuły trenerów z imienia i nazwiska); `kind: maker`.
- **Bells of Steel** — producent sprzętu (blog, bez autora); `kind: maker`.
- **Strength Shop** — producent sprzętu strongman (blog, bez autora); `kind: maker`.

Niezależność: w każdej parze źródła pochodzą z dwóch różnych organizacji. 8weeksout i Cerberus występują przy dwóch ćwiczeniach, ale za każdym razem z innym partnerem.

## 4. Nowe zdania

| id | PL | EN (propozycja) | Źródła |
|---|---|---|---|
| tf.setup | Przykucnij przy oponie, oprzyj o nią klatkę i chwyć ją szeroko, dłonie szerzej niż stopy. | Crouch at the tire, put your chest against it and take a wide grip, hands outside your feet. | elitefts-tire-flip, 8wo-tire-flip |
| tf.drive | Wypchnij oponę nogami i biodrami w górę i do przodu, klatka cały czas przy oponie. | Drive the tire up and forward with your legs and hips, chest staying on the tire. | elitefts-tire-flip, 8wo-tire-flip |
| tf.push | Gdy opona stanie wyżej, przepchnij ją rękami na drugą stronę. | Once the tire is up, push it over with your hands. | elitefts-tire-flip, 8wo-tire-flip |
| tf.mis.arms | Podrywanie opony samymi rękami, z klatką oderwaną od opony. | Yanking the tire up with your arms, chest off the tire. | elitefts-tire-flip, 8wo-tire-flip (parafraza: utrata kontaktu klatki) |
| as.setup | Stań nad kamieniem tak, żeby był między stopami. | Stand over the stone so it sits between your feet. | 8wo-atlas, cerberus-atlas |
| as.grip | Obejmij kamień przedramionami i dłońmi i mocno go ściśnij. | Wrap your forearms and hands around the stone and squeeze hard. | 8wo-atlas, cerberus-atlas |
| as.lap | Podnieś kamień nad kolana i oprzyj go na udach. | Lift the stone over your knees and rest it on your thighs. | 8wo-atlas, cerberus-atlas |
| as.extend | Z ud mocno wypchnij biodra i wyprostuj się, unosząc kamień wyżej. | From your lap, drive your hips through and stand up, bringing the stone higher. | 8wo-atlas, cerberus-atlas |
| yoke.setup | Wejdź pod jarzmo i oprzyj belkę na górze pleców. | Get under the yoke and set the crossbar on your upper back. | bos-yoke, strengthshop-yoke |
| yoke.brace | Weź wdech, napnij brzuch i wstań; trzymaj to napięcie przez cały marsz. | Breathe in, brace and stand up; keep that brace the whole walk. | bos-yoke, strengthshop-yoke |
| yoke.steps | Rób krótkie kroki. | Take short steps. | bos-yoke, strengthshop-yoke |
| yoke.mis.stride | Za długie kroki — jarzmo zaczyna się kołysać. | Strides too long — the yoke starts to sway. | bos-yoke (zbyt duże kroki), strengthshop-yoke (kołysanie) — druga część zdania tylko w Strength Shop; przy ostrożnej integracji zostaw „Za długie kroki.” |
| log.grip | Chwyć kłodę za uchwyty, dokładnie pośrodku. | Grab the log handles dead centre. | elitefts-log-mistakes, cerberus-log |
| log.clean | Podnieś kłodę na uda, przyciągnij ją do siebie i wbij łokcie pod nią, zakładając ją na klatkę. | Bring the log to your lap, pull it in close and punch your elbows under it to rack it on your chest. | elitefts-log-mistakes, cerberus-log |
| log.press | Krótko ugnij nogi i mocno wypchnij kłodę nad głowę, aż ręce się wyprostują. | Dip briefly and drive the log overhead until your arms are straight. | elitefts-log-mistakes, cerberus-log |
| log.mis.elbows | Łokcie opadają i kłoda ucieka do przodu. | Elbows drop and the log drifts forward. | elitefts-log-mistakes, cerberus-log |

Uwaga do `yoke.brace` i oddechu: zasada wskazówek oddechu to „bez wstrzymywania oddechu”. Zdanie mówi tylko „weź wdech i napnij brzuch”. Oba źródła opisują dalej krótkie oddechy w czasie marszu, a jedno z nich (Cerberus, kłoda) ostrzega przed wstrzymywaniem oddechu. Przed integracją do sprawdzenia przez recenzenta zgodności z wzorcem `plank.brace`/oddech w docs/32. Jeśli istnieje już zdanie „napnij brzuch” (np. `plank.brace`), rozważ jego użycie.

## 5. Otwarte

- **Błędy w zestawie ogólnym — Yoke Walk** (`lib/figures/v2/cue-sets.json`: `ok: ["carry.walk"]`): `carry.walk` mówi „spokojnym, kontrolowanym krokiem”, a oba przeczytane źródła o jarzmie mówią o krokach krótkich i szybkich (Strength Shop: „small and fast”). Zestaw ogólny jest tu sprzeczny ze źródłami; własna karta go zastępuje.
- **Jefferson Squat** (`general`, `squat`: `sq.down`, `sq.back`, `sq.kneesToes`, `sq.mis.kneesIn`, `sq.mis.heels`) — nie sprawdzone; w tym przysiadzie stoi się okrakiem nad sztangą, więc zdania z przysiadu ze sztangą na plecach mogą nie pasować. Do zbadania.
- **Atlas Stones — błędy**: brak wspólnego błędu. 8weeksout wymienia ciągnięcie konwencjonalne/sumo i wkładanie dłoni pod kamień, a Cerberus — puszczanie kamienia na górze. Każde to jedno źródło. Strona EliteFTS „Training the Atlas Stones” zwraca 404.
- **Tire Flip — rozstaw dłoni**: 8weeksout uznaje ustawienie dłoni pośrodku opony (przy rozstawie sumo) za błędną poradę. Inne źródła z wyszukiwania podają różne warianty, dlatego `tf.setup` mówi tylko „szeroko, dłonie szerzej niż stopy” (część wspólna).
- **Log Lift — nieużyte**: wskazówki o głowie przy wyproście (tylko Cerberus) i o pochyleniu kłody od siebie przy chwycie (tylko EliteFTS) mają po jednym źródle.
- **Niedostępne / wykluczone**: NSCA Kinetic Select „Strongman Training” — 403; EliteFTS „Technical Breakdown of the Yoke Walk” i „9 log press mistakes” (adres /education/) — 404 (wersja /blogs/ działa); strona z „log clean and press 101” przekierowuje do domeny aplikacji treningowej, więc jest wykluczona.
- **Nie zbadane** (limit kontekstu): Sandbag Load, Keg Load, Circus Bell, Conan's Wheel, Power Stairs, Jefferson Squat.

## 6. Stan

- Zrobione (02.11.2026): Tire Flip, Atlas Stones (częściowe), Yoke Walk, Log Lift. Plik `carry.md` jest kompletny.
- Zostało: Sandbag Load, Keg Load, Jefferson Squat, Circus Bell, Conan's Wheel, Power Stairs.
- Następny krok: dla każdego ćwiczenia szukać par producent sprzętu strongman (Cerberus, Strength Shop, Bells of Steel, EliteFTS — działy blog/training) i serwisu trenerskiego. Wydaje się, że Cerberus ma serię artykułów trenerskich o konkurencjach (adres `/blogs/training-tips/` — do sprawdzenia). Dla Jefferson Squat najpierw sprawdzić, czy obecny zestaw `sq.*` w ogóle pasuje.
- Pułapki: ExRx 403, Wayback zablokowane; NSCA Kinetic Select 403; EliteFTS — adresy `/education/...` dają 404, działają `/blogs/training/...`; wiele trafień to bazy aplikacji (wykluczone); nie przenosić twierdzeń o urazach ani liczb (wymiarów opon, długości kroku, ciężarów).
