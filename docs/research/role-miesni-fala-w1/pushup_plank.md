# pushup_plank — role mięśni, fala W1 (badacz-merytoryczny, 02.11.2026)

Dane wejściowe: `data/zrodla/role-miesni.json`, `lib/muscleRoles.ts` (`matchRole`: nameRules przed regułami rodziny i PRZED blokadą „rodzina z fazą + metric time”), `lib/catalog.generated.ts` (pattern, metric, muscleLoad).

## Ćwiczenia

| Ćwiczenie (pattern) | Mięsień@udział | Stan | Przyczyna luki |
|---|---|---|---|
| Plank, Ab Wheel, Rollout (sztanga), Standing Barbell Rollout, Barbell Rollout from Bench, Suspended Fallout (core_anti_ext) | abs@1 | otwarte | Reguła istnieje (`core_anti_ext`/abs/main → `abs.antilordosis`), ale funkcja ma status `jedno_zrodlo` → niewyświetlana. Drugiego źródła, które WPROST przypisuje mięśniowi prostemu brzucha opór przed wygięciem lędźwi, nie znalazłem (szczegóły w „Otwarte”). |
| j.w. bez Rollout (sztanga) (core_anti_ext) | obliques@0.5 | otwarte | Brak reguły i brak funkcji „skośne przeciw wyprostowi”; przeczytane źródła podają tylko aktywność EMG (S26), nie funkcję. |
| Side Plank (core_other) | obliques@1 | **gotowe** (propozycja) | `core_other` jest w `withoutRole` (rodzina mieszana); funkcja `obliques.rotate_bend` opisuje ruch, nie utrzymanie. Propozycja: nowa funkcja utrzymania `obliques.side_hold` + nameRule. |
| Side Plank (core_other) | abs@0.5 | otwarte | Brak źródła roli prostego brzucha w desce bocznej (S26 podaje tylko aktywność). |
| Copenhagen Plank (core_other, metric time) | adductors@1 | otwarte (strukturalne) | `core_other` bez reguł; funkcja `adductors.hip_add` („Przyciąga nogę do środka”) opisuje ruch, a w katalogu to utrzymanie (time). Przegląd systematyczny opisuje wersję dynamiczną — przeniesienie na utrzymanie = analogia → „uproszczenie”. Opcje niżej. |
| Copenhagen Plank | obliques@0.5 | **gotowe** (propozycja) | j.w. `core_other`; pozycja deski bocznej (definicja ćwiczenia w W1G5-4) → `obliques.side_hold` aux przez nameRule. |
| Plank Shoulder Taps (core_anti_rot) | abs@1, obliques@0.5 | otwarte | Brak reguł `core_anti_rot`; już otwarte w `open` („skośne przeciw rotacji — brak źródła”); przeczytane źródła anty-rotacji nie nazywają mięśni (W1G5-1 pkt 2, W1G5-2 Pallof Press). |
| Mountain Climbers (cardio) | abs@1 | otwarte (strukturalne) | `cardio` w `withoutRole`; funkcja docelowa = utrzymanie deski (`abs.antilordosis`, niewyświetlana). Po potwierdzeniu tej funkcji — nameRule. |
| Renegade Row (h_pull) | abs@1, obliques@0.5 | otwarte (strukturalne) | `h_pull` nie ma reguł dla abs/obliques; funkcje docelowe (utrzymanie deski, opór przed skrętem) niepotwierdzone. |
| Single-Arm Push-Up (h_push) | obliques@0.5 | otwarte | Brak reguły; funkcja docelowa = opór przed skrętem tułowia — brak źródła. |
| Push Up to Side Plank (h_push) | obliques@0.5 | **gotowe** (propozycja, z uwagą) | Brak reguły; ćwiczenie zawiera pozycję deski bocznej → `obliques.side_hold` aux przez nameRule (nameRule omija fazę „gdy pchasz”, zdanie bez fazy). Uwaga: zdanie opisuje fragment z deską boczną, nie fazę pompki. |

### Przyczyny strukturalne (do decyzji koordynatora, bez zmian w kodzie)
1. **Funkcje utrzymania pozycji** (deska, deska boczna, Copenhagen): katalog funkcji ma prawie tylko czasowniki ruchu („prostuje”, „przyciąga”). Ćwiczenia izometryczne potrzebują osobnych funkcji „trzyma… / nie pozwala…”, a źródła anatomii zwykle podają tylko ruchy. Dowody na utrzymanie dają głównie źródła szczebla 4 i badania EMG (aktywność, nie funkcja).
2. **Rodziny bez reguł** (`core_other`, `cardio`, `core_anti_rot`, mięśnie tułowia w `h_pull`/`h_push`): z rodziny nie wynika ruch — jedyna droga to nameRules.

Opcje (dla 1 i 2):
- **A (rekomendacja):** jawne nameRules + osobne funkcje utrzymania (`*_hold`) z własnym statusem; pokazujemy tylko te z 2 źródłami (dziś: `obliques.side_hold`). Kompromis: lista ręczna, rośnie z biblioteką; za to zero zgadywania.
- **B:** reguły rodziny z warunkiem `metric: time` → funkcja utrzymania (np. `core_other` + time + obliques → `obliques.side_hold`). Kompromis: mniej wpisów, ale `core_other` jest mieszany (deska boczna, skręty, Copenhagen) — ryzyko złego zdania przy nowym ćwiczeniu; wymaga zmiany `matchRole` i testu.
- **C:** zostawić bez opisu do czasu przeglądu źródeł szczebla 2–3 o funkcji mięśni tułowia w utrzymaniu. Kompromis: brak treści przy najpopularniejszych ćwiczeniach brzucha.

Copenhagen Plank (adductors@1) osobno:
- **A (rekomendacja):** nowa funkcja `adductors.hip_add_hold` „Trzyma biodra w górze, dociskając górną nogę do podpory” ze statusem `uproszczenie` (źródło opisuje wersję dynamiczną) → w danych, bez wyświetlania do czasu źródła o wersji izometrycznej.
- **B:** nameRule na `adductors.hip_add` („Przyciąga nogę do środka”) — wyświetlane od razu, ale zdanie opisuje ruch, którego w utrzymaniu nie ma; odradzam.
- **C:** zmiana definicji ćwiczenia na wersję dynamiczną (metric reps) — decyzja produktowa, poza zakresem badacza.

## Blok JSON do data/zrodla/role-miesni.json

```json
{
 "functions": {
  "obliques.side_hold": {
   "region": "obliques",
   "staw": "kręgosłup",
   "ruch": "utrzymanie — opór przed zgięciem bocznym (deska boczna)",
   "pl": {"main": "Trzyma tułów prosto, żeby nie opadał na bok", "aux": "Pomaga trzymać tułów prosto, żeby nie opadał na bok"},
   "en": {"main": "Keeps your trunk from sagging to the side", "aux": "Helps keep your trunk from sagging to the side"},
   "pewnosc": "dwa źródła",
   "uwaga": "Funkcję utrzymania wprost: W1G5-1 (szczebel 4, organizacja szkoląca trenerów) i W1G5-2 (szczebel 4, inna organizacja). Ruch, któremu się opierają (zgięcie boczne): S18. Aktywność: S26 (szczebel 2, największa aktywność skośnych w desce bocznej — tabela 3, Escamilla 2016). Tylko jawna lista nameRules.",
   "zrodla": ["W1G5-1", "W1G5-2", "S18", "S26"],
   "status": "dwa_zrodla"
  },
  "adductors.hip_add_hold": {
   "region": "adductors",
   "staw": "biodro",
   "ruch": "utrzymanie przywiedzenia nogi podpartej (Copenhagen)",
   "pl": {"main": "Trzyma biodra w górze, dociskając górną nogę do podpory", "aux": "Pomaga trzymać biodra w górze, dociskając górną nogę do podpory"},
   "en": {"main": "Holds your hips up by pressing your top leg into the support", "aux": "Helps hold your hips up by pressing your top leg into the support"},
   "pewnosc": "uproszczenie",
   "uwaga": "W1G5-4 (przegląd systematyczny) opisuje wersję dynamiczną: powrót = przywiedzenie koncentryczne nogi podpartej, podnoszące miednicę. Przeniesienie na utrzymanie (metric time) = analogia. Bez wyświetlania do źródła o wersji izometrycznej.",
   "zrodla": ["W1G5-4", "S14"],
   "status": "uproszczenie"
  }
 },
 "nameRules": [
  {"muscle": "obliques", "roles": ["main"], "function": "obliques.side_hold", "exercises": ["Side Plank"]},
  {"muscle": "obliques", "roles": ["aux"], "function": "obliques.side_hold", "exercises": ["Copenhagen Plank", "Push Up to Side Plank"]},
  {"muscle": "adductors", "roles": ["main"], "function": "adductors.hip_add_hold", "exercises": ["Copenhagen Plank"]}
 ]
}
```
Klucz „Side Plank” sprawdzony w `lib/catalog.generated.ts` (bez spacji na końcu). Ostatni nameRule (Copenhagen, adductors) jest bezpieczny tylko dlatego, że funkcja ma status `uproszczenie` → niewyświetlana. Id źródeł W1G5-* są robocze — koordynator nadaje kolejne numery S przy scalaniu.

## Nowe zdania (id | PL | EN)
- `obliques.side_hold` main | Trzyma tułów prosto, żeby nie opadał na bok | Keeps your trunk from sagging to the side
- `obliques.side_hold` aux | Pomaga trzymać tułów prosto, żeby nie opadał na bok | Helps keep your trunk from sagging to the side
- `adductors.hip_add_hold` main/aux (niewyświetlane, uproszczenie) | Trzyma biodra w górze, dociskając górną nogę do podpory / Pomaga… | Holds your hips up by pressing your top leg into the support / Helps…

## Źródła (id | adres | organizacja/zespół | szczebel | miejsce | odczyt)
- **W1G5-1** | https://nfpt.com/anti-core-training-the-importance-of-stabilizing-the-spine/ | NFPT (organizacja certyfikująca trenerów), Nimblett I., 28.04.2025 | 4 | „Anti-Core Training is Real Core Training” → „Types of Anti-Core training”, pkt 3 Anti-Lateral Flexion: „The obliques act to resist motion and maintain a proper hip and core position.” | 02.11.2026
- **W1G5-2** | https://www.nasm.org/resource-center/blog/training/best-abs-exercises | NASM (organizacja certyfikująca trenerów), Cherry H., akt. 23.07.2026 | 4 | sekcja Side Plank: „training the obliques, transverse abdominis, and other muscles responsible for lateral trunk stability”; sekcja Ab Wheel Rollout (o „core” ogólnie, bez nazwy mięśnia) | 02.11.2026
- **W1G5-4** | https://pmc.ncbi.nlm.nih.gov/articles/PMC8486394/ | Schaber M i in., Int J Sports Phys Ther 2021;16(5) — przegląd systematyczny (w repo już jako L6-S6) | 2 | Methods, Eligibility Criteria: pozycja deski bocznej, górna noga podparta; powrót „producing pelvic on femoral concentric adduction on the supported extremity” | 02.11.2026
- Istniejące: **S18** (Kenhub, external oblique — zgięcie boczne), **S26** (Oliva-Lozano i Muyor 2020, przegląd systematyczny; tab. 3, Escamilla 2016: „the greatest IO and EO were observed in lateral planks”), **S14** (przywodziciele — przywiedzenie).

## Otwarte (ćwiczenie/zdanie | powód)
- `abs.antilordosis` (Plank, Ab Wheel, rollouty, Suspended Fallout; potem Mountain Climbers, Renegade Row) | nadal jedno źródło wprost (S17). Sprawdzone bez skutku: Cugliari i Boccia 2017 (PMC5384053, tylko aktywność i „core stability”), S26 (tylko aktywność), TeachMeAnatomy abdominal wall (tylko stabilizacja miednicy w chodzie), W1G5-1 i W1G5-2 (mówią o „core” ogólnie, bez nazwy mięśnia). Niedostępne: StatPearls (captcha), Physiopedia (403). Następny krok: podręcznik kinezjologii lub przegląd o mechanice ćwiczeń przeciw wyprostowi (szczebel 2–3).
- obliques w `core_anti_ext` | tylko aktywność EMG (S26), brak funkcji wprost.
- abs w Side Plank | tylko aktywność (S26).
- abs/obliques w Plank Shoulder Taps, Single-Arm Push-Up, Renegade Row (opór przed skrętem) | przeczytane źródła anty-rotacji nie nazywają mięśni (W1G5-1 pkt 2, W1G5-2 Pallof Press: „The goal is to prevent movement, not create it.”).
- Copenhagen Plank adductors | patrz opcje wyżej; źródło o wersji izometrycznej nieprzeczytane (artykuł BJSM o ćwiczeniach przywodzicieli — 403).
- Push Up to Side Plank obliques | propozycja zakłada, że zdanie o utrzymaniu pasuje do ćwiczenia z fazą deski bocznej — koordynator może woleć noRole (opis tylko części ruchu).
