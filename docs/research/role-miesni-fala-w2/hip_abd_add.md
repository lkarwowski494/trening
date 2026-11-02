# Role mięśni — rodzina `hip_abd_add` (fala W2, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny (fala W2)
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1 (wariant A: `nameRules`, docs/18:143)

Luki wg W1 (gałąź badania/g4-nogi, plik `docs/research/role-miesni-fala-w1/hip_abd_add.md`, tabela „Luki”); tylko ćwiczenia rodziny `hip_abd_add`
(Clamshell i Fire Hydrant — rodzina `glute_floor`, inny badacz).

| ćwiczenie | region | rola | proponowana funkcja / reguła `nameRules` | źródła | status |
|---|---|---|---|---|---|
| Hip Abduction | glutes | aux | `glutes.hip_abd` „Pomaga odwodzić udo w bok” | Kenhub (4) + Selkowitz i in. 2016, JOSPT (3) | uproszczenie |
| Cable Hip Abduction | glutes | aux | `glutes.hip_abd` | jak wyżej | uproszczenie |
| Lateral Band Walk | glutes | aux | `glutes.hip_abd` | jak wyżej | uproszczenie |
| Monster Walk | glutes | aux | `glutes.hip_abd` | jak wyżej; ruch figury: krok w przód i na zewnątrz (odwodzenie przy każdym kroku) | uproszczenie |
| Hip Flexion with Band | quads | aux | `quads.hip_flex` — propozycja W1 bez zmian (nie powtarzam) | W1: S2 + S12 | uproszczenie (W1) |

## Uzasadnienie `glutes.hip_abd`

- Region `glutes` to w aplikacji pośladek wielki — odwodziciele mają osobny region `abductors` (`lib/seed.ts:148`, mapa `REGION_MUSCLE`, oba na „pośladki”).
- **Kenhub**, „Gluteus maximus muscle”, sekcja „Function” (https://www.kenhub.com/en/library/anatomy/gluteus-maximus-muscle; cytat z W1, `S29`):
  „The superior portion of the muscle participates in the abduction of the thigh”. Szczebel 4.
- **Selkowitz D.M., Beneck G.J., Powers C.M.** „Comparison of Electromyographic Activity of the Superior and Inferior Portions of the Gluteus Maximus
  Muscle During Common Therapeutic Exercises”, J Orthop Sports Phys Ther 2016 (https://pubmed.ncbi.nlm.nih.gov/27494053/, abstrakt, „Results” i „Conclusion”,
  przeczytane 02.11.2026): górna część pośladka wielkiego miała istotnie większą względną aktywność EMG niż dolna w ćwiczeniach z odwodzeniem
  i/lub rotacją zewnętrzną (5 z 11); wniosek: „preferential activation of the superior portion of the gluteus maximus”. Szczebel 3, niezależny zespół od Kenhub.
- Dwa niezależne źródła, ale twierdzenie dotyczy **górnej części** mięśnia, a region obejmuje cały pośladek wielki → `pewnosc: uproszczenie`
  (wzór: `quads.hip_flex` z W1, `adductors.hip_ext`). Abstrakt nie wymienia, które z 11 ćwiczeń to odwodzenie — nie przypisuję badaniu wyniku dla konkretnego ćwiczenia z katalogu; reguła opiera się na funkcji anatomicznej.
- Zmienia uwagę reguły `isolation/glutes/main` (`data/zrodla/role-miesni.json:1044`: „pośladki pomocnicze przy odwodzicielach głównych → bez opisu”) — dotąd brak źródła; teraz uproszczenie z 2 źródłami. Czy `status: "uproszczenie"` jest pokazywany — to samo pytanie co w W1 (plik W1, „Uwagi do integracji”).

```json
{
  "functions": {
    "glutes.hip_abd": {
      "region": "glutes",
      "staw": "biodro",
      "ruch": "odwiedzenie",
      "pl": {"main": "Odwodzi udo w bok", "aux": "Pomaga odwodzić udo w bok"},
      "en": {"main": "Moves your thigh out to the side", "aux": "Helps move your thigh out to the side"},
      "pewnosc": "uproszczenie",
      "uproszczenie": "Odwodzenie źródła przypisują górnej części pośladka wielkiego; region 'glutes' obejmuje cały mięsień.",
      "zrodla": ["S29", "S30"],
      "status": "uproszczenie"
    }
  },
  "nameRules": {
    "reguly": [
      {"muscle": "glutes", "roles": ["aux"], "function": "glutes.hip_abd", "exercises": ["Hip Abduction", "Cable Hip Abduction", "Lateral Band Walk", "Monster Walk"]}
    ]
  },
  "sources": [
    {
      "id": "S30",
      "tier": 3,
      "cite": "Selkowitz DM, Beneck GJ, Powers CM. J Orthop Sports Phys Ther 2016 (EMG górnej i dolnej części pośladka wielkiego)",
      "url": "https://pubmed.ncbi.nlm.nih.gov/27494053/",
      "miejsce": "Abstract — Results, Conclusion",
      "cytaty": ["„demonstrate preferential activation of the superior portion of the gluteus maximus”"]
    }
  ]
}
```

Numery: `S29` — Kenhub z W1; `S30` — kolejny wolny po propozycji W1 (koordynator nada ostateczny przy scaleniu). Teksty EN — do przeglądu tłumacza.
Funkcja `main` podana tylko dla kompletu formatu — reguła używa wyłącznie `aux`.

## Otwarte

- [OTWARTE] Monster Walk — karta wskazówek otwarta (jedno źródło ruchu), ale rola nie zależy od kierunku kroku: krok w przód i na zewnątrz zawiera odwodzenie. Jeśli figura zmieni się na marsz wyłącznie w przód — sprawdzić regułę ponownie.
- [OTWARTE] Pełny tekst Selkowitz 2016 (lista 11 ćwiczeń) — nieprzeczytany; tylko abstrakt.
