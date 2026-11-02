# dip — role mięśni, fala W1 (badacz-merytoryczny, 02.11.2026)

Dane wejściowe: `data/zrodla/role-miesni.json`, `lib/muscleRoles.ts`, `lib/catalog.generated.ts`. Pattern `v_push` (faza „gdy pchasz”), metric `weight_reps`.

## Ćwiczenia

| Ćwiczenie | Mięsień@udział | Stan | Przyczyna luki |
|---|---|---|---|
| Triceps Dip (poręcze) | chest@0.5 | **gotowe** (propozycja) | Reguła `v_push`/chest ma tylko `main` (uwaga w danych: pomocniczy wyłączony z myślą o wyciskaniu nad głowę, S22). W pompkach na poręczach powód wyłączenia nie zachodzi: wznoszenie = zgięcie barku, a piersiowy jest w nim agonistą (W1G5-3). Funkcja `chest.shoulder_flex_add` istnieje (ustalone). → nameRule. |
| Ring Dips | chest@0.5 | **gotowe** (propozycja) | j.w.; W1G5-3 dodatkowo: na kółkach piersiowy i najszerszy pracują głównie jako przywodziciele ramienia — zgodne z „do środka”. |
| Triceps Dips (ławka) | chest@0.5 | **gotowe** (propozycja, z uwagą) | j.w.; W1G5-3 badało też wersję na ławce: piersiowy pracuje, ale wyraźnie słabiej niż na poręczach (rozdz. 3.3, 4.1) — udział 0,5 w katalogu jest zgodny z „pomaga”. |
| Dip Machine | chest@0.5 | otwarte (analogia) | Maszyna nie była badana w przeczytanym źródle; tor ruchu zależy od konstrukcji maszyny. Opcje niżej. |

Przyczyna wspólna: **reguła rodziny celowo wyklucza pomocniczy piersiowy w `v_push`**, bo rodzina łączy wyciskanie nad głowę (bez przywiedzenia poziomego) i pompki na poręczach (ze zgięciem i przywiedzeniem barku). To nie brak źródeł funkcji, tylko zbyt szeroka rodzina.

### Opcje (do decyzji koordynatora)
- **A (rekomendacja):** jawna nameRule dla 3 ćwiczeń dipowych (aux) jak niżej. Kompromis: lista ręczna; zero ryzyka dla wyciskań nad głowę.
- **B:** reguła `v_push`/chest/aux z warunkiem `requireMain: "triceps"` (dipy mają triceps 1, wyciskania nad głowę zwykle 0,5). Kompromis: obejmie automatycznie nowe dipy, ale też każde przyszłe wyciskanie z tricepsem głównym — wymaga sprawdzenia listy w katalogu generatorem przed wdrożeniem (nie sprawdzałem całego katalogu).
- **C:** osobny pattern dla dipów w katalogu — zmiana katalogu, szeroki zakres; odradzam w tej fali.

Dip Machine: **A** zostawić bez opisu do źródła o maszynie (opis producenta albo badanie) / **B** dopisać do listy jako analogię ze statusem niewyświetlanym — wymaga osobnej funkcji-kopii, więc raczej A.

## Blok JSON do data/zrodla/role-miesni.json

```json
{
 "nameRules": [
  {
   "muscle": "chest",
   "roles": ["aux"],
   "function": "chest.shoulder_flex_add",
   "exercises": ["Triceps Dip", "Ring Dips", "Triceps Dips (ławka)"],
   "uwaga": "Pompki na poręczach/kółkach/ławce: wznoszenie = zgięcie barku, piersiowy agonistą (W1G5-3, Introduction i 2.2); na kółkach głównie przywiedzenie (4.3). Reguła rodziny v_push/chest obejmuje tylko main — wyciskanie nad głowę bez przywiedzenia poziomego (S22)."
  }
 ]
}
```
Bez nowej funkcji i bez nowych zdań. Zdanie wyświetlane: „Pomaga przyciągać ramię do przodu i do środka.” / „Helps bring your upper arm forward and inward.” (nameRule → bez fazy „gdy pchasz”; pompki z piersiowym głównym mają fazę z reguły rodziny — drobna niespójność brzmienia między ćwiczeniami, do oceny koordynatora; ewentualnie zmiana w `matchRole`, by nameRule mogła nieść `phase` — poza zakresem badacza).

## Nowe zdania (id | PL | EN)
Brak (istniejąca funkcja `chest.shoulder_flex_add`, wariant aux).

## Źródła (id | adres | organizacja/zespół | szczebel | miejsce | odczyt)
- **W1G5-3** | https://pmc.ncbi.nlm.nih.gov/articles/PMC9603242/ | McKenzie A i in. „Bench, Bar, and Ring Dips: Do Kinematics and Muscle Activity Differ?” IJERPH 2022;19(20):13211 (Southern Cross University) | 3 | 1. Introduction: powrót „by extending the elbows and flexing the shoulders”; 2.2 Procedures: „Potential agonists of shoulder flexion and elbow extension: PM clavicular head, anterior deltoid (AD) and TB lateral head”; 4.3: „We postulate that the increases in PM and LD mainly acted to adduct the arm”; 3.3 / 4.1: niższa aktywność piersiowego na ławce | 02.11.2026
- Istniejące: **S1, S7, S22** (funkcja `chest.shoulder_flex_add`).

## Otwarte (ćwiczenie/zdanie | powód)
- Dip Machine (chest) | maszyna niebadana w przeczytanym źródle — analogia.
- Zastosowanie do dipów opiera się na jednym badaniu szczebla 3 (funkcja sama ustalona). Drugie badanie innego zespołu (Çinarli i in., Kinesiologia Slovenica 2021, „Effect of elbow angle on triceps brachii and pectoralis major muscle activity during parallel bar dip”) — pełny tekst niedostępny przez narzędzie; badanie zmęczenia na poręczach (PMC9659300) to ten sam zespół co W1G5-3, więc nie jest niezależne.
