# Role mięśni — rodzina `leg_isolation` (fala W1)

Data: 02.11.2026 · autor: badacz-merytoryczny · Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## Tabela luk

| Ćwiczenie | Mięsień | Rola | Wynik |
|---|---|---|---|
| Glute Ham Raise | glutes (0.5) | aux | **otwarte** — bez reguły |

## Analiza

- Stan w `data/zrodla/role-miesni.json`: w `isolation` pośladek ma regułę tylko jako `main` (`glutes.hip_ext`, uwaga: „pośladki pomocnicze przy odwodzicielach głównych → bez opisu”); `hamstrings.hip_ext` aux tylko z `requireMain: glutes`. GHR (hamstrings main, glutes 0.5) wpada w lukę.
- Reguła po nazwie (`nameRules`) z `glutes.hip_ext` aux („Pomaga prostować biodro”) **nie jest uzasadniona** dla techniki, którą opisują przeczytane źródła: w GHR biodro ma pozostać wyprostowane przez cały ruch, ruch zachodzi w kolanie.
  - McAllister i in. 2014 (J Strength Cond Res 28(6):1573–80; szczebel 3), ryc. 1, podpis: badani mieli „maintain 0° at the hip for the entire range of motion”; Procedures (s. 1575): zakres 90° w kolanie „while maintaining a neutral hip”. Badanie mierzyło pośladkowy średni, nie wielki.
  - Technika szczebla 4 (zgodna): The Prehab Guys „Raise - GHD” — ciało „in a plank type of position the whole time”; Bells of Steel — opuszczanie tułowia z wysokiego klęku z prostymi plecami.
  - Pośladek w tej technice pracuje więc najwyżej izometrycznie (trzyma biodro wyprostowane), a nie prostuje biodra w ruchu. Opis „Pomaga prostować biodro” byłby twierdzeniem o ruchu, którego w ćwiczeniu nie ma.
- Ewentualna nowa funkcja (np. `glutes.hip_ext_hold`, PL aux „Pomaga trzymać biodro wyprostowane”, EN aux „Helps keep your hip straight”) wymaga ≥ 2 źródeł szczebla 2–3 o aktywności/funkcji pośladka wielkiego w GHR albo w analogicznym ruchu z biodrem utrzymanym w wyproście. Nie znalazłem przeczytanego źródła, które mierzy pośladek wielki w GHR; źródła szczebla 4 („feel your glutes working”, „contract hamstrings and glutes”) to wskazówki techniki, nie źródła roli mięśnia.
- Ta sama sytuacja dotyczy Nordic Curl (glutes 0.25 — poniżej progu podświetlenia, nie jest luką).

## Propozycje JSON

Brak reguły do dodania. Do sekcji `open` (propozycja wpisu):

```json
{
  "id": "glutes-aux-ghr",
  "opis": "Glute Ham Raise: pośladek pomocniczy (0.5) bez opisu. Przeczytane źródła opisują GHR z biodrem utrzymanym w wyproście (McAllister i in. 2014, ryc. 1; Prehab Guys; Bells of Steel) — funkcja glutes.hip_ext (ruch) nie pasuje; funkcja izometryczna wymaga ≥ 2 źródeł szczebla 2–3 z pomiarem pośladka wielkiego w GHR.",
  "rozstrzygnie": "badanie EMG/biomechaniczne pośladka wielkiego w GHR albo przegląd ćwiczeń tylnej taśmy z tym pomiarem (2 niezależne)"
}
```

Źródło do `sources` (jeśli koordynator chce zapisać ślad analizy):

```json
{
  "id": "S-McAllister2014",
  "tier": 3,
  "cite": "McAllister MJ i in. Muscle Activation During Various Hamstring Exercises. J Strength Cond Res 2014;28(6):1573–1580",
  "url": "https://oliverfinlay.com/assets/pdf/mcallister%20et%20al%20(2014)%20muscle%20activation%20during%20various%20hamstring%20exercises.pdf",
  "miejsce": "ryc. 1 (podpis); Methods — Procedures (s. 1575)",
  "cytaty": ["Subject was instructed to hold the weight at the level of the xiphoid process and maintain 0° at the hip for the entire range of motion."]
}
```

(Adres to kopia PDF na stronie prywatnej; przy integracji lepiej podać PubMed/wydawcę — nie sprawdzono, bo nie przeczytano tamtej wersji.)

## Otwarte

- [OTWARTE] glutes aux w Glute Ham Raise — powód wyżej; nie dodawać opisu „Pomaga prostować biodro”.
- NSCA Kinetic Select „Glute Ham Raise” (fragment podręcznika techniki NSCA) — 403; może opisywać inną odmianę (z ruchem w biodrze). Jeśli tak, to rozbieżność techniki, którą trzeba rozstrzygnąć przed jakąkolwiek regułą.
