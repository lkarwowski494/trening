# chest_fly — role mięśni, fala W1 (badacz-merytoryczny, 02.11.2026)

Dane wejściowe: `data/zrodla/role-miesni.json`, `lib/muscleRoles.ts`, `lib/catalog.generated.ts`. Pattern `isolation` (bez fazy). Crucifix ma metric `weight_time` — blokada „faza + time” go nie dotyczy (isolation nie jest rodziną z fazą).

## Ćwiczenia

| Ćwiczenie | Mięsień@udział | Stan | Przyczyna luki |
|---|---|---|---|
| Front Raise And Pullover | front_delt@0.5 | **gotowe** (propozycja) | Reguły `isolation` obejmują tylko `main`; pomocnicze świadomie wyłączone (`withoutRole`: „front_delt… jako pomocnicze w isolation”), bo w izolacji pomocniczy mięsień zwykle nie wykonuje ruchu nazwanego w funkcji. Tu wykonuje: pierwsza część to unoszenie ramienia do przodu (zgięcie barku) → `front_delt.shoulder_flex` przez nameRule. |
| Front Raise And Pullover | lats@0.5 | **gotowe** (propozycja) | j.w. (reguła isolation/lats tylko `main`). Część „pullover” to wyprost barku (W1G5-7) → `lats.shoulder_ext_add` przez nameRule. |
| Bent-Arm Barbell Pullover | chest@0.5 | otwarte | Reguła isolation/chest tylko `main`; funkcja `chest.shoulder_flex_add` („do przodu i do środka”) nie opisuje sprowadzania ramienia znad głowy. Potrzebna osobna funkcja (część mostkowo-żebrowa prostuje ramię zgięte nad głową) — nie znalazłem przeczytanego źródła, które podaje ją wprost (W1G5-7 mówi tylko o dużej aktywności piersiowego). |
| Around The Worlds | front_delt@0.5 | otwarte | Ruch to łuk ramion w leżeniu od bioder za głowę — w układzie ciała bliżej odwodzenia/przywodzenia niż zgięcia; zdanie „Pomaga unosić ramię do przodu” byłoby nietrafne. Brak przeczytanego źródła opisującego pracę stawu w tym ćwiczeniu. |
| Crucifix | front_delt@0.5 | otwarte | Utrzymanie ramion w bok (time) — zdanie o unoszeniu do przodu nie pasuje; brak źródła roli przedniego aktonu w utrzymaniu odwiedzenia. |
| Crucifix | forearms@0.5 | **gotowe** (propozycja) | `isolation` celowo bez reguły dla przedramion (chwyt vs nadgarstek). Tu jednoznacznie trzymanie hantli → `forearms.grip` przez nameRule. |
| Crucifix | upper_back@0.5 | otwarte | Utrzymanie ramion w bok: rola czworobocznego (unoszenie barków vs obrót łopatki) — brak przeczytanego źródła dla tego ćwiczenia. |

Przyczyna wspólna: **pomocnicze mięśnie w `isolation` są wyłączone z reguł rodziny** (słusznie — rodzina obejmuje bardzo różne ruchy). Ćwiczenia złożone z dwóch ruchów (unoszenie + pullover) i utrzymania (Crucifix) wymagają jawnych nameRules albo osobnych funkcji utrzymania.

Opcje dla funkcji utrzymania (Crucifix: przedni akton, czworoboczny) — te same co w `pushup_plank.md` (A: jawne funkcje `*_hold` + nameRules, pokazywane tylko z 2 źródłami — rekomendacja; B: reguły z warunkiem metric time; C: bez opisu).

## Blok JSON do data/zrodla/role-miesni.json

```json
{
 "nameRules": [
  {"muscle": "front_delt", "roles": ["aux"], "function": "front_delt.shoulder_flex", "exercises": ["Front Raise And Pullover"], "uwaga": "część „front raise” = zgięcie barku"},
  {"muscle": "lats", "roles": ["aux"], "function": "lats.shoulder_ext_add", "exercises": ["Front Raise And Pullover"], "uwaga": "część „pullover” = wyprost barku (W1G5-7)"},
  {"muscle": "forearms", "roles": ["aux"], "function": "forearms.grip", "exercises": ["Crucifix"], "uwaga": "trzymanie hantli w wyprostowanych rękach"}
 ]
}
```
Bez nowych funkcji i zdań. Wyświetlane zdania (teksty aux z danych): „Pomaga unosić ramię do przodu.” / „Helps raise your arm forward.”; „Pomaga ściągać ramię w dół i do tyłu.” / „Helps pull your upper arm down and back.”; „Pomaga zaciskać dłoń na uchwycie.” / „Helps keep your hand closed around the grip.”

Uwaga do `lats.shoulder_ext_add` w pullover: „w dół i do tyłu” opisuje kierunek względem tułowia (ramię wraca znad głowy do tułowia); w leżeniu „w dół” może brzmieć nieintuicyjnie — do oceny recenzenta lokalizacji.

## Nowe zdania (id | PL | EN)
Brak.

## Źródła (id | adres | organizacja/zespół | szczebel | miejsce | odczyt)
- **W1G5-7** | https://pmc.ncbi.nlm.nih.gov/articles/PMC9362894 | Teixeira LFM, Gomes WA, da Silva JJ, Magalhães RA, Marchetti PH. Int J Exerc Sci 2022;15(4):797–807 | 3 | Introduction (pullover i ściąganie drążka — podobny ruch barku); Discussion: „for shoulder extension exercises (Pullover and Ab Wheel Rollout)” | 02.11.2026
- Istniejące: **S1, S6, S22, S23** (`front_delt.shoulder_flex`), **S1, S5, S24** (`lats.shoulder_ext_add`), **S1, S9** (`forearms.grip`).

## Otwarte (ćwiczenie/zdanie | powód)
- Bent-Arm Barbell Pullover (chest) | potrzebna funkcja „część mostkowa sprowadza ramię znad głowy”; przeczytane źródła podają tylko aktywność piersiowego w pullover (W1G5-7), opis funkcji niedostępny (Kenhub pectoralis major — 404; artykuł MDPI o pullover — 403).
- Around The Worlds (front_delt) | brak źródła opisu ruchu w stawie; prawdopodobnie inna funkcja niż zgięcie.
- Crucifix (front_delt, upper_back) | utrzymanie odwiedzenia — brak funkcji utrzymania i źródeł.
- Front Raise And Pullover — zastosowanie funkcji wynika z nazwy i przebiegu ćwiczenia (unoszenie + pullover); dla części pullover jedno badanie szczebla 3 (W1G5-7). Funkcje same ustalone.
- Uwaga poboczna (W1G5-7, Discussion): rollout z kółkiem zaliczony do ćwiczeń z wyprostem barku — dotyczy pary `Ab Wheel lats@0.5` (poza zakresem tej fali, do odnotowania przez koordynatora).
