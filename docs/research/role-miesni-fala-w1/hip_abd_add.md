# Role mięśni — rodziny `hip_abd_add` i `glute_floor` (fala W1, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## Luki

| Ćwiczenie | Mięsień | Rola | Wynik |
|---|---|---|---|
| Clamshell | glutes | aux | **propozycja** — nowa funkcja `glutes.hip_ext_rot` (rotacja zewnętrzna uda), reguła po nazwie |
| Hip Abduction | glutes | aux | otwarte — odwodzenie przez pośladek wielki: jedno źródło |
| Cable Hip Abduction | glutes | aux | otwarte — jak wyżej |
| Lateral Band Walk | glutes | aux | otwarte — jak wyżej |
| Monster Walk | glutes | aux | otwarte — jak wyżej; dodatkowo niejasna definicja ruchu (patrz wskazówki) |
| Fire Hydrant | glutes | aux | otwarte — jak wyżej (ruch: odwodzenie przy zgiętym biodrze; ACE 6402 nazywa go „hip abduction”) |
| Hip Flexion with Band | quads | aux | **propozycja** — nowa funkcja `quads.hip_flex` (uproszczenie: tylko prosty uda), reguła po nazwie |

### Uzasadnienie

- **Pośladek wielki — rotacja zewnętrzna:** S11 (TeachMeAnatomy, Gluteal Region, „Gluteus Maximus — Actions”, cytat już w rejestrze: „…assists with lateral rotation.”) + Kenhub „Gluteus maximus muscle”, sekcja „Function”: „The external rotation of the thigh happens simultaneously with the extension”. Dwie niezależne strony szczebla 4 → `dwa_zrodla`. Ruch w Clamshell to rotacja zewnętrzna: ACE 6315 „Clam Shells” — „externally rotate the top leg”; NASM (blog banded clamshell) — pośladek średni „contributes to hip abduction and external rotation”. Region `glutes` obejmuje pośladek wielki — rola aux opisuje funkcję pomocniczą, zgodną z „assists” w S11.
- **Pośladek wielki — odwodzenie (górne włókna):** tylko Kenhub, „Function”: „The superior portion of the muscle participates in the abduction of the thigh”. S11 i OpenStax (S2, tabela ryc. 11.30: „moves the thigh back”) tego nie podają → jedno źródło, „otwarte”. Zgodne z obecną uwagą reguły `isolation/glutes/main`: „pośladki pomocnicze przy odwodzicielach głównych → bez opisu”.
- **Prosty uda — zginanie biodra:** S12 (TeachMeAnatomy, Anterior Thigh, „Rectus Femoris — Actions”: „Extension of the knee joint and flexion of the hip joint”; cytat z rejestru, strony nie czytałem ponownie w tej sesji) + S2 (OpenStax 11.6, akapit po ryc. 11.31, przeczytany 02.11.2026: „The muscles of the anterior compartment of the thigh flex the thigh and extend the leg.”; tabela ryc. 11.31: prosty uda „assists in raising the knee”). Region `quads` to cała grupa, a biodro zgina tylko prosty uda → `pewnosc: uproszczenie` (wzór: `adductors.hip_ext`).

## Propozycje (format `role-miesni.json`)

```json
{
  "functions": {
    "glutes.hip_ext_rot": {
      "region": "glutes",
      "staw": "biodro",
      "ruch": "rotacja zewnętrzna",
      "pl": {"main": "Obraca udo na zewnątrz", "aux": "Pomaga obracać udo na zewnątrz"},
      "en": {"main": "Turns your thigh outward", "aux": "Helps turn your thigh outward"},
      "pewnosc": "dwa źródła",
      "zrodla": ["S11", "S29"],
      "status": "dwa_zrodla"
    },
    "quads.hip_flex": {
      "region": "quads",
      "staw": "biodro",
      "ruch": "zgięcie",
      "pl": {"main": "Unosi udo do przodu", "aux": "Pomaga unosić udo do przodu"},
      "en": {"main": "Lifts your thigh forward", "aux": "Helps lift your thigh forward"},
      "pewnosc": "uproszczenie",
      "uproszczenie": "Zginanie biodra źródła przypisują prostemu uda, nie całej grupie czworogłowych; region 'quads' to cała grupa.",
      "zrodla": ["S2", "S12"],
      "status": "uproszczenie"
    }
  },
  "nameRules": {
    "reguly": [
      {"muscle": "glutes", "roles": ["aux"], "function": "glutes.hip_ext_rot", "exercises": ["Clamshell"]},
      {"muscle": "quads", "roles": ["aux"], "function": "quads.hip_flex", "exercises": ["Hip Flexion with Band"]}
    ]
  },
  "sources": [
    {
      "id": "S29",
      "tier": 4,
      "cite": "Kenhub: Gluteus maximus muscle",
      "url": "https://www.kenhub.com/en/library/anatomy/gluteus-maximus-muscle",
      "miejsce": "Function",
      "cytaty": ["„The external rotation of the thigh happens simultaneously with the extension”", "„The superior portion of the muscle participates in the abduction of the thigh”"]
    }
  ]
}
```

Uwagi do integracji: numer `S29` — kolejny wolny w pliku z gałęzi badań (ostatni S28); koordynator nada numer przy scaleniu.
Czy `status: "uproszczenie"` jest pokazywany (brief: pokazywane tylko `ustalone`/`dwa_zrodla`) — sprawdzić, jak traktowana jest istniejąca
`adductors.hip_ext`; jeśli uproszczenia nie są pokazywane, luka `quads` w Hip Flexion with Band zostaje bez opisu mimo reguły.
Teksty EN — do przeglądu tłumacza (otwarte pytanie w pliku: naturalność).

## Otwarte

- [OTWARTE] Pośladek wielki jako pomocniczy przy odwodzeniu (Hip Abduction, Cable Hip Abduction, Lateral Band Walk, Monster Walk, Fire Hydrant) — jedno źródło (Kenhub); rozstrzygnie drugie źródło anatomiczne szczebla 2–4 (np. podręcznik anatomii) albo przegląd EMG ćwiczeń odwodzenia pokazujący udział pośladka wielkiego.
- [OTWARTE] Fire Hydrant: czy rola pośladka ma brzmieć jak odwodzenie, czy rotacja (ruch przy zgiętym biodrze) — ACE 7409 opisuje uniesienie kolana w bok, ACE 6402 nazywa je odwodzeniem; bez źródła biomechanicznego nie przypisuję rotacji.
- [OTWARTE] Monster Walk — definicja ruchu (w bok vs w przód/skos) do ustalenia przed regułą.
