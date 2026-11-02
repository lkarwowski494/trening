# Wskazówki techniki — rodzina core_hang (fala W1, 02.11.2026)

Tylko zbieranie danych (polecenie właściciela 02.11.2026). Metoda: docs/research/27 i 33; każde zdanie ma ≥ 2 przeczytane źródła
z różnych organizacji (szczebel 4); wariant tego samego ćwiczenia opisany w miejscu odwołania; inne ćwiczenie = analogia (nie liczy się).
Strony aplikacji treningowych i ExRx — nie używane (uzupełnienie briefu koordynatora).

## 1. Podsumowanie

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Hanging Leg Raise | gotowe | 4 (move 1, tips 2, mistakes 1) | bez „setup” — tylko jedno źródło opisuje zwis (Catalyst); NASM opisuje wersję z ugiętymi kolanami (wariant), Western — krzesło z podparciem przedramion (wariant) |
| Hanging Knee Raise | gotowe | 4 (move 1, tips 2, mistakes 1) | bez „setup”; Catalyst opisuje wersję z prostymi nogami, ugięte kolana jako łatwiejszą (wariant) |
| Toes to Bar | otwarte | 0 | jedna organizacja przeczytana (CrossFit, 2 zdania o pozycji); patrz p. 5 |
| L-Sit | otwarte | 0 | nie zbadane w tej fali (limit kontekstu) |

Zestaw ogólny (`lib/figures/v2/cue-sets.json`, `f: hanging`: ok `hang.slow`, `hang.ribs`; err `hang.noSwing`) — dla HLR i HKR potwierdzony
przeczytanymi źródłami (niżej). Dla Toes to Bar ten sam zestaw NIE jest potwierdzony: przeczytane źródło (CrossFit) nie mówi o wolnym
opuszczaniu ani o zakazie bujania, a popularna wersja zawodnicza używa wymachu — możliwy błąd zestawu ogólnego (p. 5).

## 2. Blok do `exercises` (tylko gotowe)

```json
{
  "Hanging Leg Raise": {
    "setup": [],
    "move": [
      {"c": "hang.legs.move", "s": [
        ["catalyst-45", "opis ćwiczenia („Without swinging, lift your straight legs up until the toes reach the bar.”)"],
        ["western-abs", "Captain's Chair, Pro-tip (wariant: podpór przedramion; „extend your legs and perform the same movement”)"]
      ]}
    ],
    "tips": [
      {"c": "hang.slow", "s": [
        ["catalyst-45", "opis ćwiczenia (opuszczenie nóg do zwisu pod kontrolą; parafraza)"],
        ["nasm-best-abs", "Hanging Knee Raise, Coaching Tip (wariant: ugięte kolana; „Focus on moving slowly and maintaining a stable torso throughout each repetition.”)"],
        ["western-abs", "Captain's Chair (wariant: podpór przedramion; „Lower your legs back down toward the floor with control.”)"]
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
    "move": [
      {"c": "hang.knees.move", "s": [
        ["nasm-best-abs", "Hanging Knee Raise, Why It Works („…tilt the pelvis and lift the knees…”)"],
        ["western-abs", "Captain's Chair (wariant: podpór przedramion; „drive your knees toward your chest”, potem opuszczenie nóg)"]
      ]}
    ],
    "tips": [
      {"c": "hang.slow", "s": [
        ["nasm-best-abs", "Hanging Knee Raise, Coaching Tip („Focus on moving slowly and maintaining a stable torso throughout each repetition.”)"],
        ["western-abs", "Captain's Chair (wariant: podpór przedramion; „Lower your legs back down toward the floor with control.”)"],
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
zostaje samo `hang.slow` + `hang.noSwing` + ruch (3 zdania, dalej ≥ 2).

## 3. Nowe zdania

| id | PL | EN |
|---|---|---|
| hang.legs.move | Ze zwisu unieś wyprostowane nogi przed siebie, potem opuść je z powrotem. | From a hang, raise your straight legs in front of you, then lower them back down. |
| hang.knees.move | Ze zwisu unieś ugięte kolana przed siebie, potem opuść nogi. | From a hang, bring your bent knees up in front of you, then lower your legs. |

## 4. Nowe źródła

| id | adres | organizacja | szczebel |
|---|---|---|---|
| catalyst-45 | https://catalystathletics.com/exercise/45/Hanging-Leg-Raise/ (czytane 02.11.2026) | Catalyst Athletics (biblioteka ćwiczeń szkoleniowej firmy trenerskiej; ta sama organizacja co L4-S27 w docs/research/25-biblioteka) | 4 |

Istniejące: `nasm-best-abs` (NASM, sekcja Hanging Knee Raise — przeczytana ponownie 02.11.2026), `western-abs` (Western SRS, Captain's Chair — przeczytana 02.11.2026).

## 5. Otwarte

- **Toes to Bar** — przeczytane tylko CrossFit „The Strict Toes-To-Bar” (https://crossfit.com/essentials/the-strict-toes-to-bar, 02.12.2019:
  nogi razem i możliwie proste; parcie prostymi rękami w drążek). Druga organizacja nie znaleziona (NASM — tylko nazwa jako progresja;
  strona zawodów CrossFit z normą ruchu — nieczytelna). Do sprawdzenia: który wariant jest w katalogu (ścisły czy z wymachem — figura
  ma ruch od zwisu do drążka). **Możliwy błąd zestawu ogólnego:** `hang.slow` i `hang.noSwing` nie pasują do wersji z wymachem.
- **L-Sit** — nie zbadane (limit kontekstu). Zestaw dziś „open” — bez zmiany.
- **Setup zwisu (HLR, HKR)** — „zwis na drążku, ręce proste” tylko w Catalyst; NASM nie opisuje ustawienia, Western i HKU — krzesło z podparciem.
  Potrzebne drugie źródło szczebla 4 opisujące zwis.
- HKU CSE FHSC Abs (już w docs/33) — PDF nieczytelny przy tej próbie (binarny); nie liczony.

## 6. Stan

- Zrobione: HLR i HKR (po 4 zdania, 2 nowe zdania, 1 nowe źródło); zestaw ogólny dla nich potwierdzony.
- Zostało: Toes to Bar (druga organizacja + rozstrzygnięcie wariantu), L-Sit (cała karta), setup zwisu.
- Następny krok: szukać biblioteki ćwiczeń organizacji gimnastycznej / uczelnianego centrum sportu dla T2B i L-sit (np. ACE, NSCA Coach, uczelniane „equipment guides”); Catalyst ma też stronę L-sit — sprawdzić.
- Pułapki: wyszukiwarka zwraca prawie wyłącznie strony aplikacji i serwisów treningowych (nie są źródłem); ExRx 403; PDF HKU nie daje się odczytać przez WebFetch.
