# Wskazówki techniki — rodzina core_hang (fala W1, 02.11.2026)

Tylko zbieranie danych (polecenie właściciela 02.11.2026). Metoda: docs/research/27 i 33; każde zdanie ma ≥ 2 przeczytane źródła
szczebla 4 z różnych organizacji; wariant tego samego ćwiczenia opisany w miejscu odwołania; inne ćwiczenie = analogia (nie liczy się).
Strony aplikacji treningowych i ExRx — nie używane.

**Korekta wg rozstrzygnięcia koordynatora linii 1.1 (02.11.2026) o szczeblach:** szczebel 4 = naraz (a) organizacja szkoląca/certyfikująca
trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu, (b) autor z datą albo treść jawnie firmowana
przez organizację, (c) nie recenzja afiliacyjna ani marketing. Western Univ. SRS = 5. Zdania z < 2 źródłami szczebla 4 i ćwiczenia
z < 2 zdaniami przeniesione do „otwarte” (p. 5). Wcześniejszy stan (z Western i Dynamo) — historia w p. 6.

## 1. Podsumowanie

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Hanging Leg Raise | gotowe | 3 (tips 2, mistakes 1) | po korekcie: `hang.legs.move` i `hang.setup` mają po jednym źródle szczebla 4 (Catalyst) → otwarte |
| Hanging Knee Raise | gotowe | 3 (tips 2, mistakes 1) | po korekcie: `hang.knees.move` (tylko NASM) i `hang.setup` (tylko Catalyst, wariant) → otwarte |
| Toes to Bar | otwarte | 0 (1 zdanie gotowe, poniżej progu 2 zdań) | `hang.t2b.straight` ma 2 źródła (CrossFit + Catalyst wariant); reszta po jednym; wariant (ścisły / z wymachem) nieustalony — p. 5 |
| L-Sit | otwarte | 0 (1 zdanie gotowe, poniżej progu) | `lsit.move` — CrossFit + FIG; ocena FIG wg (a) niepotwierdzona lekturą — p. 4 |

Zestaw ogólny (`lib/figures/v2/cue-sets.json`, `f: hanging`: ok `hang.slow`, `hang.ribs`; err `hang.noSwing`) — dla HLR i HKR potwierdzony
(Catalyst + NASM). Dla Toes to Bar NIE potwierdzony: zależy od wariantu (p. 5) — **możliwy błąd zestawu ogólnego**.

## 2. Blok do `exercises` (tylko gotowe, po korekcie)

```json
{
  "Hanging Leg Raise": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "hang.slow", "s": [
        ["catalyst-45", "opis ćwiczenia (opuszczenie nóg do zwisu pod kontrolą; parafraza)"],
        ["nasm-best-abs", "Hanging Knee Raise, Coaching Tip (wariant: ugięte kolana; „Focus on moving slowly and maintaining a stable torso throughout each repetition.”)"]
      ]},
      {"c": "hang.ribs", "s": [
        ["catalyst-45", "opis ćwiczenia (napnij brzuch i podwiń miednicę jak w brzuszku, nie samo zgięcie w biodrach; parafraza)"],
        ["nasm-best-abs", "Hanging Knee Raise, Why It Works (wariant: ugięte kolana; „The abdominals help posteriorly tilt the pelvis and lift the knees while the rest of the core works to stabilize the trunk.”)"]
      ]}
    ],
    "mistakes": [
      {"c": "hang.noSwing", "s": [
        ["catalyst-45", "opis ćwiczenia („If performing from pull-up bars, control the speed to minimize swinging.”)"],
        ["nasm-best-abs", "Hanging Knee Raise, Coaching Tip (wariant: ugięte kolana; „Avoid using momentum to swing the legs upward.”)"]
      ]}
    ]
  },
  "Hanging Knee Raise": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "hang.slow", "s": [
        ["nasm-best-abs", "Hanging Knee Raise, Coaching Tip („Focus on moving slowly and maintaining a stable torso throughout each repetition.”)"],
        ["catalyst-45", "opis ćwiczenia (wariant: proste nogi, ugięte kolana jako łatwiejsza wersja; opuszczenie pod kontrolą; parafraza)"]
      ]},
      {"c": "hang.ribs", "s": [
        ["nasm-best-abs", "Hanging Knee Raise, Why It Works („The abdominals help posteriorly tilt the pelvis…”)"],
        ["catalyst-45", "opis ćwiczenia (wariant: proste nogi; podwinięcie miednicy jak w brzuszku; parafraza)"]
      ]}
    ],
    "mistakes": [
      {"c": "hang.noSwing", "s": [
        ["nasm-best-abs", "Hanging Knee Raise, Coaching Tip („Avoid using momentum to swing the legs upward.”)"],
        ["catalyst-45", "opis ćwiczenia (wariant: proste nogi; „control the speed to minimize swinging”)"]
      ]}
    ]
  }
}
```

Uwaga do `hang.ribs` (dla recenzenta): oba źródła mówią o podwinięciu miednicy i stabilnym tułowiu; „żebra w dół” wynika z porównania
Catalyst do brzuszka (zbliżenie żeber do miednicy) — nie jest powiedziane wprost. Jeśli recenzent uzna to za za daleko idące,
karta spada do 2 zdań (`hang.slow`, `hang.noSwing`) — dalej ≥ 2.

## 3. Nowe zdania (wszystkie zebrane; w bloku p. 2 żadne nowe — wszystkie czekają na drugie źródło, p. 5)

| id | PL | EN | stan |
|---|---|---|---|
| hang.legs.move | Ze zwisu unieś wyprostowane nogi przed siebie, potem opuść je z powrotem. | From a hang, raise your straight legs in front of you, then lower them back down. | otwarte (tylko Catalyst) |
| hang.knees.move | Ze zwisu unieś ugięte kolana przed siebie, potem opuść nogi. | From a hang, bring your bent knees up in front of you, then lower your legs. | otwarte (tylko NASM) |
| hang.setup | Zawiśnij na drążku, ciało prosto w dół. | Hang from the bar with your body straight down. | otwarte (tylko Catalyst) |
| hang.t2b.move | Ze zwisu unieś nogi, aż palce stóp dotkną drążka, potem opuść je. | From a hang, raise your legs until your toes touch the bar, then lower them. | otwarte (tylko Catalyst, wariant) |
| hang.t2b.straight | Trzymaj nogi tak proste, jak pozwala gibkość. | Keep your legs as straight as your flexibility allows. | 2 źródła; ćwiczenie poniżej progu |
| hang.pressBar | Przez cały ruch dociskaj drążek w dół. | Keep pressing down on the bar the whole time. | otwarte (tylko CrossFit) |
| lsit.move | Unieś się na rękach i trzymaj wyprostowane nogi przed sobą. | Lift yourself up on your arms and hold your straight legs out in front of you. | 2 źródła (FIG warunkowo); ćwiczenie poniżej progu |

Sprawdzone istniejące zdania: `pu.grip` (zawiera „trochę szerzej niż barki” — szerokości chwytu żadne źródło zwisu nie podaje), `plank.brace`,
`hang.*` — żadne nie pokrywa ustawienia zwisu ani L-situ.

Odwołania gotowe do użycia, gdy ćwiczenie dostanie drugie zdanie:
- `hang.t2b.straight`: crossfit-strict-t2b („Make sure to keep the legs together and as straight as flexibility will allow.”); catalyst-45 (wariant: ścisły, unoszenie prostych nóg do drążka; „lift your straight legs”).
- `lsit.move`: crossfit-lsit (cytat G. Glassmana, „3 Important Ab Exercises”, 05.2003: „The L-Sit is performed by supporting the body entirely by the arms and holding the legs straight out in front.”); fig-a202 (Element description pkt 3: „The body is supported by both arms with only the hands in contact with the floor.”; pkt 4: nogi równolegle do podłogi).

## 4. Źródła i ocena szczebla (kryteria (a)–(c) koordynatora, 02.11.2026)

| id | adres | organizacja | szczebel | ocena |
|---|---|---|---|---|
| catalyst-45 | https://catalystathletics.com/exercise/45/Hanging-Leg-Raise/ (czytane 02.11.2026; pierwsze zdanie wykonania: „Hang from a pull-up bar or stall bars.”) | Catalyst Athletics | 4 | lista koordynatora |
| nasm-best-abs | istniejące (NASM, sekcja Hanging Knee Raise, czytane ponownie 02.11.2026) | NASM | 4 | organizacja certyfikująca trenerów |
| crossfit-strict-t2b | https://crossfit.com/essentials/the-strict-toes-to-bar (02.12.2019; czytane 02.11.2026) | CrossFit | 4 | (a) certyfikuje trenerów (CF-L1–L4), (b) treść firmowana, z datą, (c) nie marketing |
| crossfit-lsit | https://crossfit.com/essentials/the-l-sit (cytat G. Glassmana, 05.2003; czytane 02.11.2026) | CrossFit | 4 | jw. |
| fig-a202 | https://www.fig-aerobic.com/A202-L-SUPPORT_a1677.html (element A202 „L-Support”, Element description pkt 1–5; czytane 02.11.2026) | FIG (Międzynarodowa Federacja Gimnastyczna), kodeks elementów gimnastyki aerobowej | 4 warunkowo | (b) firmowane przez federację, (c) spełnione; (a) — szkolenie trenerów przez FIG nie potwierdzone lekturą w tej sesji; opis elementu sędziowskiego, nie wytyczna treningowa |
| western-abs | istniejące (Western SRS, Captain's Chair) | Western University SRS | 5 | lista koordynatora — nie liczy się |
| dynamo-hlr | https://blog.dynamofitness.com.au/?p=2685 („Hanging Leg Raises”, czytane 02.11.2026) | Dynamo Fitness | 5 | (a) niespełnione — dostawca/sprzedawca sprzętu, a drążek nie jest potwierdzonym własnym produktem; blog firmowy bez autora |
| invictus-t2b | https://www.invictusfitness.com/blog/what-are-toes-to-bar (06.02.2023, B. Weiss, M. Vieux, T. Ewart; czytane 02.11.2026) | Invictus (siłownia afiliowana przy CrossFit) | 5 | (b) spełnione; (a) niepotwierdzone lekturą (strona kursu dla trenerów — 404); dodatkowo nie w pełni niezależne od CrossFit |

Przeczytane, nie użyte: CrossFit „Ask a Coach… Toes-to-Bars” (https://www.crossfit.com/pro-coach/ask-a-coach-how-to-teach-coach-toes-to-bar,
09.07.2025 — ta sama organizacja co crossfit-strict-t2b; wymach, „push-down into the rig”); doctoryessis.com „Hanging Leg Raise” (bez autora
z kwalifikacjami; zaleca wstrzymanie oddechu i lekki łuk w lędźwiach — sprzeczne z zasadami aplikacji); blog sklepu odzieżowego o L-sicie
(marketing — 5); crossfit.com/at-home/static-holds-at-home (bez opisu techniki). Catalyst „L-Sit” (#525) — WebFetch nie zwraca opisu
(adres główny i lustrzane).

## 5. Otwarte

- **Ruch HLR (`hang.legs.move`) i HKR (`hang.knees.move`)** — po korekcie po jednym źródle szczebla 4 (Western = 5). Potrzebne drugie
  (np. ACE, ISSA, NSCA — w tej sesji brak trafień; wyszukiwarka zwraca aplikacje).
- **Ustawienie zwisu (`hang.setup`)** — tylko Catalyst; Dynamo (zgodne: „Take hold of a chin-up bar or handles and allow your body to hang perpendicular to the floor.”) ma szczebel 5. „Ręce proste” — wprost tylko CrossFit (dla T2B).
- **Toes to Bar — wariant (decyzja produktowa dla właściciela):** katalog (`lib/catalog.generated.ts`: `pullup.bar`/`rings`, `core_flexion`, `reps`)
  nie określa wariantu; `docs/research/25-biblioteka/L6.json` — „Analogia do unoszenia nóg w zwisie (S1)”; figura (`lib/figures/v2/poses/core_hang.json`)
  — ruch od zwisu do drążka, bez pól o wymachu. (A) wersja ścisła — pasują `hang.slow`/`hang.noSwing` (Catalyst: bez wymachu);
  (B) wersja z wymachem — te zdania błędne (Invictus, szczebel 5: szybkie ściągnięcie nóg; CrossFit Ask a Coach: wykorzystanie pędu).
  Rekomendacja badacza: A (zgodne z figurą i notatką katalogu). Niezależnie od wyboru potrzebne drugie źródło szczebla 4 dla
  `hang.setup`, `hang.t2b.move`, `hang.pressBar` (CrossFit: „Pushing into the bar with straight arms…”) — Invictus po korekcie się nie liczy.
- **Toes to Bar — „nogi razem”, hollow, aktywny zwis** — po jednej organizacji (CrossFit; Invictus = 5). `hang.ribs` dla T2B — niepotwierdzone.
- **L-Sit:** `lsit.move` ma 2 źródła (FIG warunkowo), ale ćwiczenie ma < 2 zdań → otwarte. Proste ręce, dłonie przy udach, nogi razem,
  nogi w poziomie (FIG pkt 1, 2, 4), łatwiejsza wersja z ugiętymi kolanami, błędy — po jednym źródle. Sprzęt: katalog zaleca poręcze
  (`dip.bars`), FIG opisuje wersję na podłodze — `lsit.move` celowo bez sprzętu. Kandydaci: Catalyst #525 innym sposobem, krajowe federacje
  gimnastyczne (materiały szkoleniowe), producenci paraletek/poręczy (własny sprzęt).
- HKU CSE FHSC Abs (docs/33) — po korekcie: HKU CSE nie spełnia (a) (ośrodek sportowy uczelni, bez szkolenia trenerów na stronie głównej, czytane 02.11.2026) — 5.

## 6. Historia (przed korektą 02.11.2026)

- Sesja 1: HLR i HKR po 4 zdania (z Western jako drugim źródłem ruchu).
- Sesja 2 przed korektą: dodano `hang.setup` (Catalyst + Dynamo), T2B 4 zdania (Catalyst + Invictus + CrossFit), L-Sit 1 zdanie.
  Po rozstrzygnięciu koordynatora Western, Dynamo, Invictus = 5 → stan jak w p. 1–5.

## 7. Stan (aktualny, 02.11.2026)

- Zrobione: HLR, HKR — po 3 zdania (zestaw ogólny potwierdzony); źródła ocenione wg (a)–(c); 7 zdań zebranych z PL/EN (p. 3).
- Zostało: drugie źródło szczebla 4 dla `hang.legs.move`, `hang.knees.move`, `hang.setup`, `hang.t2b.move`, `hang.pressBar`;
  decyzja właściciela o wariancie T2B; L-Sit — drugie zdanie (np. nogi razem/poziomo) i potwierdzenie (a) dla FIG.
- Następny krok: ISSA i NFPT (szczebel 4 wg koordynatora) — wpisy „hanging leg raise”, „toes to bar”, „L-sit”; BarBend — artykuły o technice.
- Pułapki: Catalyst #525 bez treści przez WebFetch; wyszukiwarka zwraca głównie aplikacje; ExRx 403; PDF przez WebFetch — zapisany plik
  da się odczytać narzędziem Read (tak przeczytano HKU i Gaiam w back_extension).


## Korekta szczebli — uzupełnienie 2 (02.11.2026)

Dopisał koordynator grupy G1 na podstawie ustaleń badaczy (sekcja 6 w `wskazowki-fala-w1/core_floor-2.md`).
Bez zmian stanu. Western SRS i HKU CSE to uczelniane centra sportu bez autora — szczebel 5 (jak dotąd). Reguła „błąd = zaprzeczenie standardu” nie przywraca żadnego zdania: `hang.noSwing` ma już dwa źródła szczebla 4; pozostałe błędy nie mają standardu w drugiej organizacji.
