# Wskazówki techniki — rodzina `carry` (fala W1, G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: Overhead Carry (hantle), Farmer's Walk (trap bar), Double Kettlebell Front Rack Carry, Farmer's Walk (Farmers Handles), Rickshaw Carry; dodatkowo próba dopełnienia Farmer's Walk i Suitcase Carry (lista `partial`).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## Korekta szczebli 02.11.2026

Szczeble organizacji przeliczone wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = naraz: (a) organizacja szkoląca
trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor + data albo treść firmowana przez organizację;
(c) nie recenzja z afiliacją ani marketing). Zmiany:

- **Catalyst Athletics** — 4 (rozstrzygnięcie). **StrongFirst** — 4: (a) organizacja szkoląca i certyfikująca instruktorów kettlebell;
  (b) artykuł z autorem (T. Jewett); (c) artykuł merytoryczny, nie recenzja produktu. **Equinox** — 5: sieć klubów fitness (ta sama reguła co
  PureGym — sieci siłowni = 5); dodatkowo autorka bez podanych uprawnień.
- **Overhead Carry (hantle)**: zostaje „częściowe”, ale wypada wskazówka `lunge.torso` (zostaje tylko NSCA; Equinox = 5). Ustawienie (Catalyst + StrongFirst)
  i ruch (Catalyst + NSCA) bez zmian.
- **Farmer's Walk (Farmers Handles)**, **Farmer's Walk (trap bar)**: bez zmian (ACE, NSCA, NASM).
- Physitrack i The Prehab Guys (uwaga koordynatora G6, 02.11.2026): w tym pliku żadne z nich nie jest liczone jako źródło — patrz „Otwarte”.

Metoda: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026) — zdanie wchodzi, gdy potwierdzają je ≥ 2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji. Źródło o tym samym ćwiczeniu z innym sprzętem liczy się z opisem „(wariant: …)”. Bez liczb (tempo, dystans, ciężar) i bez twierdzeń zdrowotnych. Wszystkie strony czytane 02.11.2026 (WebFetch; PDF NSCA czytany jako obraz stron).

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Overhead Carry (hantle) | general (`carry`) | częściowe | ustawienie i ruch; wskazówki i błędy — otwarte (jedno źródło szczebla 4). Ogólny zestaw do zastąpienia — patrz „Otwarte” (tempo, `carry.noLean`). |
| Farmer's Walk (trap bar) | general (`carry`) | częściowe | ruch i 1 wskazówka (wariant: hantle/kettlebelle); ustawienie z trap barem — otwarte (źródła tylko o martwym ciągu = analogia). |
| Double Kettlebell Front Rack Carry | general (`carry`) | otwarte | tylko NSCA opisuje to ćwiczenie wprost; drugie źródło niedostępne (402/410) albo z aplikacji. |
| Farmer's Walk (Farmers Handles) | general (`carry`) | częściowe | ta sama karta co Farmer's Walk (wariant: uchwyty strongman zamiast hantli). |
| Rickshaw Carry | general (`carry`) | otwarte | brak przeczytanego opisu techniki noszenia (znalezione strony — tylko martwy ciąg z rikszą albo bazy bez opisu). |
| Farmer's Walk (dopełnienie) | own, `partial` | bez zmian | kandydaci na nowe zdania mają po jednym źródle — „Otwarte”. |
| Suitcase Carry (dopełnienie) | own, `partial` | bez zmian | jw. |

„Częściowe” = jak lista `partial` w `data/zrodla/cues.json`: komplet tylko tych sekcji, które mają ≥ 2 źródła; brakujących sekcji nie dopisujemy z jednego źródła.

## 2. JSON do `exercises` (cues.json)

Zawiera ćwiczenia „częściowe” — każde zdanie ma ≥ 2 źródła szczebla 4 z różnych organizacji. Proponuję dopisać je do listy `partial`.

```json
{
  "Overhead Carry (hantle)": {
    "setup": [
      {
        "c": "ohc.setup",
        "s": [
          ["catalyst-827", "opis („Hold a dumbbell overhead in each hand with the palms forward and lock in the position…”); Purpose (ręce pionowo)"],
          ["strongfirst-two-carries", "Carry No. 2: Overhead (wariant: przenoszenie nad głową w artykule o odważnikach; łokieć wyprostowany, ramię blisko ucha)"]
        ]
      }
    ],
    "move": [
      {
        "c": "ohc.walk",
        "s": [
          ["catalyst-827", "opis (marsz na zadany czas albo dystans, ciężary jak najstabilniej)"],
          ["nsca-coach-7-3", "s. 52, Exercise Set-Up (wariant: waiter's walk — ciężar nad głową w jednej ręce; przenoszenie na czas albo dystans)"]
        ]
      }
    ],
    "tips": [],
    "mistakes": []
  },
  "Farmer's Walk (Farmers Handles)": {
    "setup": [
      {
        "c": "carry.two",
        "s": [
          ["ace-359", "opis (wariant: hantle; ręce wzdłuż boków, ciężary przy biodrach)"],
          ["nsca-coach-7-3", "s. 52, Exercise Set-Up (wariant: równy ciężar w każdej ręce)"]
        ]
      }
    ],
    "move": [
      {
        "c": "carry.walk",
        "s": [
          ["ace-359", "opis (wariant: hantle; marsz na ustalony dystans)"],
          ["nsca-coach-7-3", "s. 52 („walk slow and controlled”)"]
        ]
      }
    ],
    "tips": [
      {
        "c": "lunge.torso",
        "s": [
          ["ace-359", "opis (wariant: hantle; plecy proste)"],
          ["nsca-coach-7-3", "s. 52 („maintain an upright torso”)"],
          ["nasm-best-abs", "Offset Farmer's Carry, Coaching Tip (wariant: ciężary nierówne; postawa wyprostowana)"]
        ]
      }
    ],
    "mistakes": []
  },
  "Farmer's Walk (trap bar)": {
    "setup": [],
    "move": [
      {
        "c": "carry.walk",
        "s": [
          ["ace-359", "opis (wariant: hantle; marsz na ustalony dystans)"],
          ["nsca-coach-7-3", "s. 52 (wariant: kettlebelle; „walk slow and controlled”)"]
        ]
      }
    ],
    "tips": [
      {
        "c": "lunge.torso",
        "s": [
          ["ace-359", "opis (wariant: hantle; plecy proste)"],
          ["nsca-coach-7-3", "s. 52 (wariant: kettlebelle; „maintain an upright torso”)"]
        ]
      }
    ],
    "mistakes": []
  }
}
```

Uwaga do „Farmer's Walk (trap bar)”: karta bez ustawienia jest bardzo krótka. Jeśli koordynator uzna, że lepiej zostawić to ćwiczenie w trybie „open” niż pokazywać tylko ruch i 1 wskazówkę, to też jest zgodne z zasadami. Rozstrzyga to wzorzec karty `partial`, nie ten research.

## 3. Nowe źródła

| id | org | tytuł | url | szczebel (po korekcie 02.11.2026) | czytane |
|---|---|---|---|---|---|
| catalyst-827 | Catalyst Athletics | Dumbbell Overhead Carry (Exercise Library #827) | https://www.catalystathletics.com/exercise/827/Dumbbell-Overhead-Carry/ | 4 | tak, 02.11.2026 (opis, Purpose) |
| catalyst-888 | Catalyst Athletics | Single-Arm Dumbbell Overhead Carry (#888) | https://catalystathletics.com/exercise/888/Single-Arm-Dumbbell-Overhead-Carry | 4 | tak, 02.11.2026 (opis) — tylko do „Otwarte” |
| strongfirst-two-carries | StrongFirst | T. Jewett, Two Important Carries for the Clinician | https://www.strongfirst.com/two-important-carries-clinician/ | 4 | tak, 02.11.2026 (Carry No 1: Front Rack; Carry No. 2: Overhead) |
| equinox-sa-oh-carry | Equinox | Form Check: Single-Arm Kettlebell Overhead Carry (08.2026) | https://www.equinox.com/articles/2026/08/how-to-single-arm-overhead-carry | 5 — nie liczy się | tak, 02.11.2026 (How to…, Common… Mistakes) — tylko do „Otwarte” |
| ace-390 | ACE | Waiter's Carry (#390) | https://www.acefitness.org/resources/everyone/exercise-library/390/waiter-s-carry/ | 4 | tak, 02.11.2026 — NIE użyte: opisuje noszenie odwróconego odważnika przy barku, a nie nad głową |

Istniejące źródła użyte: `ace-359`, `ace-358`, `nsca-coach-7-3` (PDF przeczytany ponownie: s. 50–52, rycina 3 „Rack Carry”, rycina 5 „Unilateral Overhead Carry”), `nasm-best-abs` (ponownie, sekcje Suitcase Carry i Offset Farmer's Carry).

### Ocena nowych organizacji wg kryteriów (a)–(c) (02.11.2026)

| Organizacja | kind | Szczebel | Uzasadnienie |
|---|---|---|---|
| Catalyst Athletics | org | 4 | rozstrzygnięcie koordynatora linii 1.1; szkolenie trenerów i zawodników podnoszenia ciężarów, biblioteka ćwiczeń firmowana przez organizację |
| StrongFirst | org | 4 | (a) organizacja szkoląca i certyfikująca instruktorów kettlebell; (b) artykuł z autorem (autor z certyfikatem organizacji); (c) artykuł merytoryczny, nie recenzja ani reklama |
| Equinox | site | 5 | sieć klubów fitness — ta sama reguła co sieci siłowni (PureGym = 5); autorka bez podanych uprawnień, brak recenzji eksperckiej na stronie |

## 4. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| ohc.setup | Wypchnij hantle nad głowę i trzymaj je na prostych rękach, ramiona blisko uszu. | Press the dumbbells overhead and hold them on straight arms, upper arms close to your ears. | catalyst-827 (ciężary nad głową, pozycja „zablokowana”, ręce pionowo); strongfirst-two-carries (łokieć wyprostowany, ramię blisko ucha). Celowo „proste ręce”, a nie „zablokowane łokcie”, żeby nie kłócić się z `ohp.mis.lock`. |
| ohc.walk | Idź na ustalony dystans albo czas, z ciężarami cały czas nad głową. | Walk for a set distance or time, keeping the weights overhead the whole way. | catalyst-827 (marsz na czas/dystans, ciężary stabilnie nad głową); nsca-coach-7-3 s. 52 (waiter's walk — ciężar nad głową; przenoszenie na czas albo dystans). Bez tempa — źródła się różnią (patrz „Otwarte”). |

## 5. Otwarte

**Szczebel źródła wg rozstrzygnięcia 02.11.2026:**
- Overhead Carry (hantle), wskazówka `lunge.torso` (tułów wyprostowany) — zostaje tylko NSCA s. 52 (ogólna zasada dla wszystkich odmian); Equinox (krok 3, wariant jednorącz) = 5. Usunięte z bloku JSON do czasu drugiego źródła szczebla 4.
- Physitrack / The Prehab Guys (uwaga koordynatora G6, 02.11.2026: Physitrack — szczebel do decyzji, wstępnie 5, nie liczy się; The Prehab Guys — 4, do potwierdzenia): w tym pliku żadna ich strona nie jest cytowana. Strona fizjoterapeutów z podobną wskazówką do przenoszenia nad głową (punkt niżej) została wcześniej odrzucona jako należąca do firmy z własną aplikacją; nie zapisałem jej adresu, więc nie wiem, czy to The Prehab Guys. Jeśli tak — przy szczeblu 4 „do potwierdzenia” mogłaby dać drugie źródło dla wskazówki o nieruchomych rękach; wymaga ponownego odnalezienia i przeczytania strony.

**Błędy w obecnym zestawie ogólnym (`lib/figures/v2/cue-sets.json`, `f: carry`)** — przeczytane źródła ich nie potwierdzają dla tych wariantów:
- `carry.walk` („spokojnym, kontrolowanym krokiem”) w **Overhead Carry (hantle)**: tempo jest sprzeczne — NSCA s. 52 (ogólna zasada: „walk slow and controlled”) kontra Catalyst #827/#888 („walk at a brisk pace”); Equinox (nie spiesz się) — szczebel 5, nie rozstrzyga. Sprzeczność na tym samym szczeblu, więc w karcie nie podajemy tempa — dlatego nowe `ohc.walk`.
- `carry.noLean` („ani w stronę ciężaru, ani od niego”) w Overhead Carry, Front Rack, trap bar, Farmers Handles, Rickshaw (i w Yoke Walk — patrz strongman.md): zdanie opisuje ciężar po jednej stronie (źródła: NASM i NSCA o suitcase carry). Przy obciążeniu symetrycznym żadne przeczytane źródło nie mówi o przechylaniu „w stronę ciężaru”. W kartach własnych go nie używam.

**Ćwiczenia i zdania bez dwóch źródeł:**
- Overhead Carry (hantle), wskazówka „Ręce i ciężary trzymaj jak najbardziej nieruchomo” — tylko Catalyst (#827). Strona fizjoterapeutów z podobną wskazówką należy do firmy z własną aplikacją treningową, więc nie została policzona (patrz wyżej).
- Overhead Carry (hantle), błąd „Łokcie się uginają, barki podjeżdżają do uszu” — tylko StrongFirst (opis słabej wersji: zgięty łokieć, uniesione barki). Catalyst mówi o „zablokowaniu” pozycji, ale nie opisuje błędu.
- Double Kettlebell Front Rack Carry — ustawienie: NSCA s. 52 (dwa odważniki oparte o przód barków i górę klatki) i StrongFirst Carry No 1 (łokieć w dół, przy żebrach) opisują różne elementy, a żadne z nich nie potwierdza całego zdania. Strona producenta odważników o rack carry zwróciła 402, strona uczelniana (MacEwan, „front loaded carry”) — 410. Pozostałe trafienia to aplikacje albo bazy bez autora. Ruch i postawa: ogólna zasada NSCA to jedno źródło.
- Farmer's Walk (trap bar), ustawienie („Stań w środku ramy, chwyć uchwyty, wstań jak w martwym ciągu”) — przeczytane źródła `tb.inside`/`tb.lift` dotyczą martwego ciągu z trap barem, czyli innego ćwiczenia (analogia). Nie znalazłem przeczytanego źródła szczebla 4 o noszeniu z trap barem (wyniki to aplikacje albo sklepy z suplementami).
- Rickshaw Carry — brak przeczytanego opisu techniki noszenia. EliteFTS i sklepy opisują martwy ciąg z rikszą (inne ćwiczenie).
- Farmer's Walk, dopełnienie: „Barki na jednej wysokości” — tylko NASM (wariant nierówny); „Mocno ściśnij uchwyty” — tylko ACE #359 (#358 to ta sama organizacja, więc nie jest niezależne).
- Suitcase Carry, dopełnienie: „Zmień rękę i przejdź ten sam odcinek” — tylko ACE #358. Błąd „przechylanie/skręt tułowia” (NASM, Offset Farmer's Carry) dubluje istniejącą wskazówkę `carry.noLean`, więc go nie dodaję.

## 6. Stan

- Zrobione: carry — wszystkie 5 ćwiczeń i dwa dopełnienia ocenione (02.11.2026); korekta szczebli 02.11.2026 (Equinox = 5 → Overhead Carry traci `lunge.torso`).
- Pułapki: ExRx 403, Wayback zablokowane (brief); strona producenta odważników (rack carry) 402; strona MacEwan 410; PDF NSCA Coach 7.3 WebFetch zwraca binarnie — czytać plik jako PDF (obraz stron). Wiele trafień na „carry” to strony aplikacji (wykluczone).
