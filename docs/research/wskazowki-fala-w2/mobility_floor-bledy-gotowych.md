# Błędy („Czego unikać”) dla 10 gotowych ćwiczeń `mobility_floor` — fala W2, grupa G2

Data: 02.11.2026. Autor: badacz-merytoryczny (agent). Status: PROPOZYCJA.

Zakres: tylko błędy wnioskowane (logiczne zaprzeczenie potwierdzonego zdania ustawienia albo ruchu tego ćwiczenia), bez nowego szukania
źródeł. Podstawa: bloki JSON z plików fali W1 (`mobility_floor-nogi`, `-tulow`, `-uzupelnienie`; późniejszy wygrywa) po odjęciu zdań
z listy „do pominięcia” w przeliczeniu z 02.11.2026 (dla tych ćwiczeń: `mobility_floor.n.bfSoles`, `st.tension` przy Supine Spinal Twist,
`mobility_floor.n.qHipLine` i `mobility_floor.n.core` przy Side-Lying Quad Stretch). Zaprzeczeń tych pominiętych zdań nie używam.
Błędy ze źródeł opisane już w W1 (Butterfly, Supine Spinal Twist, The Straddle) zostają bez zmian.

## 1. Ćwiczenia

| Ćwiczenie | Stan po W1 | Stan po W2 | Błędy (ze źródeł / wnioskowane) | Poza v2? | Uwaga |
|---|---|---|---|---|---|
| Butterfly Stretch | gotowe | gotowe | 1 (W1) / 0 | tak | wymóg błędu spełnia `mobility_floor.n.mis.roundBack` z W1; nowego nie dodaję (zaprzeczenie `n.tall` = ten sam błąd) |
| Cat-Cow | gotowe | gotowe | 0 / 2 | tak | tylko `mistakes` |
| Child's Pose | gotowe | gotowe | 0 / 1 | tak | tylko `mistakes` |
| Kneeling Hip Flexor Stretch | gotowe | gotowe | 0 / 1 | tak | tylko `mistakes` |
| Peroneals Stretch | gotowe | gotowe | 0 / 1 | nie | tylko `mistakes` |
| Posterior Tibialis Stretch | gotowe | gotowe | 0 / 1 | nie | tylko `mistakes` |
| Side-Lying Quad Stretch | gotowe | gotowe | 0 / 1 | tak | tylko `mistakes` |
| Supine Figure-Four Stretch | gotowe | gotowe | 0 / 0 | nie | brak sensownego zaprzeczenia (Otwarte) |
| Supine Spinal Twist | gotowe | gotowe | 1 (W1) / 0 | nie | `mobility_floor.t.supTwist.mis.shoulder` z W1 wystarcza |
| The Straddle | gotowe | gotowe | 1 (W1) / 1 | tak | tylko `mistakes` (dopisz do błędu z W1) |

## 2. Blok do wdrożenia

Tylko klucz `mistakes` — integrator scala z blokami W1. Dla The Straddle lista zawiera też błąd z W1, żeby scalenie nie zgubiło go przy nadpisaniu.

```json
{
  "Cat-Cow": {
    "mistakes": [
      {"c": "mobility_floor.t.catCow.mis.hands", "s": [["wniosek", "mobility_floor.t.catCow.setup"]]},
      {"c": "mobility_floor.t.catCow.mis.headOnly", "s": [["wniosek", "mobility_floor.t.catCow.round"], ["wniosek", "mobility_floor.t.catCow.arch"]]}
    ]
  },
  "Child's Pose": {
    "mistakes": [
      {"c": "mobility_floor.t.child.mis.hipsUp", "s": [["wniosek", "mobility_floor.t.child.sitBack"]]}
    ]
  },
  "Kneeling Hip Flexor Stretch": {
    "mistakes": [
      {"c": "mobility_floor.n.mis.kneePastAnkle", "s": [["wniosek", "mobility_floor.n.hfKnee"]]}
    ]
  },
  "Peroneals Stretch": {
    "mistakes": [
      {"c": "mobility_floor.u.mis.noInvert", "s": [["wniosek", "mobility_floor.u.invert"]]}
    ]
  },
  "Posterior Tibialis Stretch": {
    "mistakes": [
      {"c": "mobility_floor.u.mis.noEvert", "s": [["wniosek", "mobility_floor.u.evert"]]}
    ]
  },
  "Side-Lying Quad Stretch": {
    "mistakes": [
      {"c": "mobility_floor.n.mis.qKneesApart", "s": [["wniosek", "mobility_floor.n.qPull"]]}
    ]
  },
  "The Straddle": {
    "mistakes": [
      {"c": "mobility_floor.u.mis.roundInstead", "s": [["ace-210", "Step 2 (avoid rounding your back)"], ["yogau-wide-angle", "akapit o pochylaniu z bioder (collapse forward with a rounded back)"]]},
      {"c": "mobility_floor.u.mis.legsRoll", "s": [["wniosek", "mobility_floor.u.straddleSit"]]}
    ]
  }
}
```

## 3. Nowe zdania

| id | PL | EN (propozycja) | zaprzeczane zdanie (potwierdzone po W1) |
|---|---|---|---|
| `mobility_floor.t.catCow.mis.hands` | Dłonie wysunięte przed barki albo kolana nie pod biodrami. | Hands out in front of your shoulders or knees not under your hips. | `mobility_floor.t.catCow.setup` „dłonie pod barkami, kolana pod biodrami” (5 źródeł W1) |
| `mobility_floor.t.catCow.mis.headOnly` | Ruch samą głową, a plecy się nie zaokrąglają ani nie wyginają. | Moving only your head while your back stays flat. | `mobility_floor.t.catCow.round` i `.arch` (zaokrąglenie i wygięcie pleców to istota ruchu) |
| `mobility_floor.t.child.mis.hipsUp` | Biodra zostają wysoko zamiast cofnąć się w stronę pięt. | Hips staying high instead of sitting back toward your heels. | `mobility_floor.t.child.sitBack` „cofnij biodra w stronę pięt” (ACE, CCSM, WebMD Ignite) |
| `mobility_floor.n.mis.kneePastAnkle` | Przednie kolano wychodzi daleko przed kostkę. | Front knee drifting well past your ankle. | `mobility_floor.n.hfKnee` „przednie kolano nad kostką” (ACE 142, Livewell) |
| `mobility_floor.u.mis.noInvert` | Ciągnięcie pasa prosto do siebie, bez obracania stopy do środka. | Pulling the strap straight back without turning your foot in. | `mobility_floor.u.invert` (Leeds, ECU) |
| `mobility_floor.u.mis.noEvert` | Ciągnięcie pasa prosto do siebie, bez obracania stopy na zewnątrz. | Pulling the strap straight back without turning your foot out. | `mobility_floor.u.evert` (Leeds, ECU) |
| `mobility_floor.n.mis.qKneesApart` | Górne kolano odjeżdża od dolnego. | Top knee drifting away from the bottom one. | `mobility_floor.n.qPull` „kolana trzymaj razem” (Livewell, OrthoIndy; Topend = 5 nie liczony, zostają 2) |
| `mobility_floor.u.mis.legsRoll` | Kolana i palce stóp przetaczają się na boki zamiast patrzeć w górę. | Knees and toes rolling to the sides instead of pointing up. | `mobility_floor.u.straddleSit` „kolana i palce stóp skieruj w górę” (ACE 210, YogaUOnline) |

Wszystkie błędy dają się pokazać na rysunku (położenie dłoni/kolan, płaskie plecy przy ruchu głowy, wysokie biodra, kolano przed kostką,
rozchodzące się kolana, przetoczone nogi, stopa bez obrotu).

## 4. Źródła

Nowych źródeł brak. Błąd The Straddle z W1 cytuje `ace-210` (ACE, szczebel 4) i `yogau-wide-angle` (YogaUOnline, szczebel 4 graniczny —
ocena z pliku W1 uzupełnienie; przeliczenie z 02.11.2026 utrzymało stan „gotowe”). Źródła zaprzeczanych zdań — w plikach W1.

## 5. Otwarte i uwagi dla integratora

- **Supine Figure-Four Stretch — błąd** → potwierdzone: `n.f4Cross` (kostka na kolanie), `n.f4Pull` (przyciągasz dolną nogę).
  Zaprzeczenie „przyciąganie założonej nogi zamiast dolnej” opisuje inny, istniejący wariant rozciągania pośladka, nie błąd; „kostka zsuwa
  się z kolana” jest trywialne. Figura v2 nie wymaga błędu — bez błędu.
- **Supine Spinal Twist** → po pominięciu `st.tension` zostają setup, ruch, `supTwist.shoulders` i błąd ze źródeł z W1. Zaprzeczenie
  `supTwist.shoulders` = istniejący błąd `supTwist.mis.shoulder` — nie dubluję.
- **Butterfly Stretch** → zaprzeczenie `n.bfSoles` niedozwolone (zdanie pominięte); zaprzeczenie `n.bfHinge` („delikatnie dociśnij”) jako
  „wciskanie kolan na siłę” byłoby trudne do pokazania na rysunku i bliskie ogólnemu `st.mis.force`, którego źródła dla tego ćwiczenia nie
  sprawdzałem. Zostaje jeden błąd z W1.
- **Kneeling Hip Flexor Stretch — „pochylanie tułowia”** jako zaprzeczenie `n.tall` → pominięte: ACE w kroku ruchu używa słów „lean forward
  into the front hip” (przesunięcie bioder), więc błąd „pochylanie się” mógłby wprowadzać w błąd bez ponownego przeczytania strony.
- **Side-Lying Quad Stretch** → zaprzeczenia `qHipLine` („udo w linii z tułowiem”) nie używam, bo zdanie jest na liście do pominięcia.
- Błędów ze źródeł W1 dla Cat-Cow i Child's Pose nie było w przeczytanych fragmentach W1 (W1 podaje tylko ustawienie, ruch, wskazówki).
