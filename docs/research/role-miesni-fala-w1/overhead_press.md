# overhead_press — role mięśni, fala W1 (badacz-merytoryczny, 02.11.2026)

Dane wejściowe: `data/zrodla/role-miesni.json`, `lib/muscleRoles.ts`, `lib/catalog.generated.ts`. Wszystkie ćwiczenia w luce mają pattern `v_push` (rodzina z fazą „gdy pchasz”), metric `weight_reps` — blokada „faza + time” ich nie dotyczy.

## Ćwiczenia

| Ćwiczenie | Mięsień@udział | Stan | Przyczyna luki |
|---|---|---|---|
| Push Press | quads@0.5 | **gotowe** (propozycja) | Brak reguły `v_push`/quads. Funkcja `quads.knee_ext` istnieje (ustalone). Zastosowanie: faza wybicia to wyprost bioder i kolan (W1G5-5). Reguła rodziny nie pasuje (wyciskanie ścisłe nie ma pracy nóg) → nameRule. Zdanie bez fazy „gdy pchasz” (nameRule daje wariant „_”) — dobrze, bo kolano prostuje się przed wyciśnięciem rękami. |
| Push Press - Behind the Neck | quads@0.5 | otwarte (analogia) | j.w.; przeczytane źródło opisuje wybicie z przodu. Ta sama praca nóg jest bardzo prawdopodobna, ale wg zasad to analogia → do potwierdzenia albo decyzji koordynatora (opcje niżej). |
| Landmine Linear Jammer, Single-Arm Linear Jammer | quads@0.5 | otwarte (analogia) | Brak przeczytanego źródła o pracy nóg w tym ćwiczeniu. |
| Landmine Press | chest@0.5 | **gotowe** (propozycja, nowa funkcja) | Reguła `v_push`/chest obejmuje tylko `main` — świadomie: S22 mówi, że w wyciskaniu pionowym przywiedzenie poziome jest minimalne, więc zdanie „do przodu i do środka” byłoby nieprawdziwe. Propozycja: osobna funkcja `chest.shoulder_flex` (część obojczykowa unosi ramię do przodu) + nameRule. |
| See-Saw Press (Alternating Side Press) | obliques@0.5 | otwarte | Brak reguły; funkcja docelowa = utrzymanie tułowia przy nierównym obciążeniu. Przeczytane: tylko aktywność skośnych w wyciskaniu jednorącz stojąc (S26, rozdz. 3.5), bez funkcji. Analogia do `obliques.side_hold` (plik pushup_plank) — niedozwolona bez źródła. |

### Opcje dla wariantów „analogia” (Behind the Neck, Jammery) — do decyzji koordynatora
- **A (rekomendacja):** zostawić bez opisu i dopisać do kolejnej fali szukanie źródła (biomechanika podrzutu/wybicia za głową; opis ćwiczenia jammer u producenta sprzętu albo organizacji szkolącej trenerów).
- **B:** nameRule z `quads.knee_ext` jako `uproszczenie` (status niewyświetlany) — dane gotowe, bez tekstu dla użytkownika do czasu źródła.
- **C:** pokazać od razu jako analogię — niezgodne z zasadą (uproszczenie/analogia nie jest wyświetlane), odradzam.

## Blok JSON do data/zrodla/role-miesni.json

```json
{
 "functions": {
  "chest.shoulder_flex": {
   "region": "chest",
   "staw": "ramienny",
   "ruch": "zgięcie (część obojczykowa)",
   "pl": {"main": "Unosi ramię do przodu", "aux": "Pomaga unosić ramię do przodu"},
   "en": {"main": "Raises your arm forward", "aux": "Helps raise your arm forward"},
   "pewnosc": "ustalone (3 niezależne)",
   "uwaga": "S7: część obojczykowa sama zgina ramię; S22: przedni akton naramiennego pomaga mięśniowi piersiowemu większemu zginać bark; W1G5-6: w wyciskaniu nad głowę z przodu większe zgięcie ramienia wymaga większej pracy piersiowego. Tylko jawna lista nameRules (wyciskania skośne w przód). Tekst = ten sam co front_delt.shoulder_flex — świadomie (ten sam ruch).",
   "zrodla": ["S7", "S22", "W1G5-6"],
   "status": "ustalone"
  }
 },
 "nameRules": [
  {"muscle": "quads", "roles": ["aux"], "function": "quads.knee_ext", "exercises": ["Push Press"], "uwaga": "W1G5-5: wybicie = wyprost bioder i kolan"},
  {"muscle": "chest", "roles": ["aux"], "function": "chest.shoulder_flex", "exercises": ["Landmine Press"]}
 ]
}
```

## Nowe zdania (id | PL | EN)
- `chest.shoulder_flex` main | Unosi ramię do przodu | Raises your arm forward
- `chest.shoulder_flex` aux | Pomaga unosić ramię do przodu | Helps raise your arm forward
(teksty identyczne z `front_delt.shoulder_flex` — brak nowych kluczy tłumaczeń, jeśli runtime współdzieli teksty)
- Push Press quads — istniejące zdanie `quads.knee_ext` aux: „Pomaga prostować kolano” / „Helps straighten your knee”.

## Źródła (id | adres | organizacja/zespół | szczebel | miejsce | odczyt)
- **W1G5-5** | https://eprints.chi.ac.uk/id/eprint/6053/1/RSPB-2021-0246%20CLEAN.pdf | Soriano MA, Lake J, Comfort P, Suchomel TJ, McMahon JJ, Jiménez-Ormeño E, Sainz de Baranda P. „No Differences in Weightlifting Overhead Pressing Exercises Kinetics” — rękopis przyjęty (repozytorium University of Chichester; tytuł czasopisma nie podany w pliku — do uzupełnienia) | 3 | Introduction, s. 4: „the thrust is the rapid propulsion phase via extension of the hips and knees, and plantar flexion of the ankles” | 02.11.2026
- **W1G5-6** | https://pmc.ncbi.nlm.nih.gov/articles/PMC9354811 | Coratella G, Tornatore G, Longo S, Esposito F, Cè E. Front Physiol 2022 (zespół z Mediolanu) | 3 | Discussion, „Front vs. Back”: „less vertical humerus flexion, thus requiring the pectoralis major to be more excited during front-BMP” | 02.11.2026
- Istniejące: **S7** (TeachMeAnatomy, pectoralis major: „The clavicular head also acts individually to flex the upper limb.”), **S22** (Rodríguez-Ridao 2020: „The anterior deltoid muscle assists the pectoralis major to flex the shoulder”), **S2/S12/S20** (`quads.knee_ext`), **S26** (aktywność skośnych).

## Otwarte (ćwiczenie/zdanie | powód)
- Push Press - Behind the Neck, Landmine Linear Jammer, Single-Arm Linear Jammer (quads) | analogia do Push Press; brak przeczytanego źródła dla tych wariantów. Drugi artykuł o technice wybicia (repozytorium Middlesex, „Exercise technique: the push press”) — 405, nieprzeczytany.
- See-Saw Press (obliques) | tylko aktywność EMG (S26), brak funkcji wprost.
- Landmine Press chest — zastosowanie funkcji: brak badania EMG samego wyciskania landmine (wyszukiwanie bez wyniku); przyjęte, bo ruch to wyciskanie w przód i w górę, a W1G5-6 wiąże pracę piersiowego właśnie ze zgięciem ramienia. Jeśli koordynator uzna to za analogię → status `uproszczenie` (niewyświetlane).
- Push Press quads — zastosowanie z jednego źródła szczebla 3 (funkcja sama jest ustalona). Jeśli wymagane 2 źródła zastosowania → do kolejnej fali.
