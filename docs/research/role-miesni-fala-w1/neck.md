# Role mięśni — fala W1, region `neck` (szyja)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Zakres: tylko zbieranie danych (polecenie właściciela 02.11.2026). Dziś w
`data/zrodla/role-miesni.json` szyja jest celowo bez opisu (`withoutRole.miesnie`, `nameRules._opis` „Szyja: bez opisu”, `open` — reguły po nazwie
to decyzja produktowa). **Włączenie czegokolwiek z tego pliku wymaga decyzji właściciela** (dopuszczenie reguł po nazwie dla szyi).
Szczeble źródeł 4–5 sprawdzone 02.11.2026 — sekcja „Korekta szczebli 02.11.2026” na końcu (bez zmian statusów).

Dane wejściowe: katalog (`docs/research/equipment/catalog.json`) — wszystkie 5 ćwiczeń: `pattern: isolation`, `muscleLoad: {"neck": 1}` (rola main);
izometrie `metric: time`, talerz i uprząż `metric: weight_reps`. Rodzina isolation nie ma fazy (`phases`), więc zdanie = sam `text.main` + „.”.

## Tabela ćwiczeń

| Ćwiczenie | Metric | Propozycja | Stan |
|---|---|---|---|
| Lying Neck Flexion (talerz) | weight_reps | `neck.flex` (main) | gotowe (dwa_zrodla) — czeka na decyzję właściciela |
| Lying Neck Extension (talerz) | weight_reps | `neck.ext` (main) | gotowe (ustalone: 3 źródła) — czeka na decyzję |
| Neck Harness Extension | weight_reps | `neck.ext` (main) | gotowe — czeka na decyzję |
| Isometric Neck Exercise - Front And Back | time | **bez opisu** (noRole) | rekomendacja; wariant niżej otwarty |
| Isometric Neck Exercise - Sides | time | **bez opisu** (noRole) | rekomendacja; `neck.lat_flex` zostaje w danych bez użycia |

## Proponowane funkcje (do `functions`)

```json
{
  "neck.flex": {
    "region": "neck", "staw": "szyja (odcinek szyjny)", "ruch": "zgięcie",
    "pl": {"main": "Zgina szyję", "aux": "Pomaga zginać szyję"},
    "en": {"main": "Bends your neck forward", "aux": "Helps bend your neck forward"},
    "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["S4", "S30"],
    "uwaga": "Tylko jawna lista nameRules. Kenhub (S31) opisuje mostkowo-obojczykowo-sutkowy obustronnie jako prostownik górnych stawów szyjnych — różnica na poziomie mięśnia, nie regionu; opis dotyczy regionu."
  },
  "neck.ext": {
    "region": "neck", "staw": "szyja (odcinek szyjny)", "ruch": "wyprost",
    "pl": {"main": "Prostuje szyję", "aux": "Pomaga prostować szyję"},
    "en": {"main": "Straightens your neck", "aux": "Helps straighten your neck"},
    "pewnosc": "ustalone", "status": "dwa_zrodla", "zrodla": ["S4", "S30", "S32"],
    "uwaga": "Tylko jawna lista nameRules."
  },
  "neck.lat_flex": {
    "region": "neck", "staw": "szyja (odcinek szyjny)", "ruch": "zgięcie boczne",
    "pl": {"main": "Przechyla głowę na bok", "aux": "Pomaga przechylać głowę na bok"},
    "en": {"main": "Tilts your head to the side", "aux": "Helps tilt your head to the side"},
    "pewnosc": "ustalone", "status": "dwa_zrodla", "zrodla": ["S4", "S30", "S31"],
    "uwaga": "W katalogu brak dynamicznego ćwiczenia na bok — dziś bez reguły (zapas na przyszłość)."
  }
}
```

Status: `dwa_zrodla` przy `neck.ext` celowo (3 źródła szczebla 3–4, nie szczebel 1–2 → nie „ustalone” w sensie wyjątku; pole `pewnosc` do ujednolicenia przez wdrażającego według konwencji pliku, gdzie `glutes.hip_ext` z 3 źródłami ma „ustalone”).

EN: „Straightens your neck” zgodnie ze stylem pliku (`Straightens your hip`); otwarte pytanie tłumacza z `open` („Straightens” vs „Extends”) dotyczy też szyi.

## Proponowane nameRules (do `nameRules.reguly`)

```json
[
  {"muscle": "neck", "roles": ["main"], "function": "neck.flex",
   "exercises": ["Lying Neck Flexion (talerz)"]},
  {"muscle": "neck", "roles": ["main"], "function": "neck.ext",
   "exercises": ["Lying Neck Extension (talerz)", "Neck Harness Extension"]}
]
```

Do `exceptions.noRole` (jawnie, choć brak reguły i tak daje „bez opisu”):

```json
[
  {"exercise": "Isometric Neck Exercise - Front And Back", "muscles": ["neck"], "powod": "utrzymanie pozycji głowy wbrew oporowi ręki (metric: time), nie zgięcie ani wyprost — jak L-Sit i Wall Sit"},
  {"exercise": "Isometric Neck Exercise - Sides", "muscles": ["neck"], "powod": "utrzymanie pozycji głowy wbrew oporowi ręki (metric: time), nie przechylanie — jak L-Sit i Wall Sit"}
]
```

Do zmiany przy wdrożeniu: `withoutRole.miesnie` („neck — każda rodzina…”) → „neck — poza jawną listą nameRules”; `nameRules._opis` — usunąć „Szyja: bez opisu”;
`open` poz. 4 — zamknąć część „szyja” decyzją właściciela.

## Izometria — dlaczego „bez opisu”

Czasowniki „zgina/prostuje/przechyla” opisują ruch w stawie; w izometrii głowa ma się nie ruszać (HealthLink BC: „your head should not move to either side”,
źródło z `wskazowki-fala-w1/neck.md`). Plik już stosuje tę zasadę: Wall Sit („czasownik «prostuje» nie opisuje ruchu”), L-Sit („utrzymanie pozycji, nie zgięcie”).
Ćwiczenie „Front And Back” angażuje na przemian zginacze i prostowniki — jedno zdanie i tak by nie pasowało.

Wariant (odrzucony, otwarty): „Trzyma głowę w miejscu wbrew naciskowi ręki” / „Holds your head still against your hand”. Przeczytane źródła anatomiczne
nie opisują pracy izometrycznej mięśni szyi, a zdanie jest w praktyce powtórzeniem wskazówki techniki → bez opisu, dopóki nie ma źródła i decyzji o nowym typie zdania (utrzymanie zamiast ruchu) dla całej aplikacji.

## Źródła

| id | Adres | Organizacja | Szczebel | Miejsce i cytat (≤ 1 zdanie) |
|---|---|---|---|---|
| S4 (istnieje — dopisać miejsce i cytaty) | https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back | OpenStax (Rice University), Anatomy and Physiology 2e, rozdz. 11.3 | 3 | podrozdz. „Muscles That Move the Head”: „The major muscle that laterally flexes and rotates the head is the sternocleidomastoid.”; tab. „Muscles That Move the Head” (11.5): mostkowo-obojczykowo-sutkowy „bilaterally: flexion”; półkolcowy, płatowy i najdłuższy głowy „bilaterally: extension” |
| S30 (nowe w tym pliku; to samo co L2-S30 w docs/research/25-biblioteka/L2-zrodla.md) | https://pubmed.ncbi.nlm.nih.gov/8610245/ | Conley MS i in., Spine 1995;20(23):2505–12 | 3 | Results (abstrakt): „extension--semispinalis capitis and cervicis and splenius capitis; flexion--sternocleidomastoid and longus capitis and colli” (+ „lateral flexion--sternocleidomastoid”) |
| S31 | https://www.kenhub.com/en/library/anatomy/sternocleidomastoid-muscle | Kenhub (A. Karunaharamoorthy, rec. D. Mytilinaios; akt. 30.10.2023) | 4 (sprawdzone 02.11.2026 wg kryteriów koordynatora — bez zmian) | „Function”: jednostronnie zgina szyję w bok tej samej strony i obraca głowę w przeciwną (parafraza); obustronnie: „A bilateral contraction elevates the head by dorsally extending the upper cervical joints.” |
| S32 | https://www.kenhub.com/en/library/anatomy/splenius-capitis-muscle | Kenhub (S. Shahid; przegl. 25.05.2023) | 4 (jw.) | „Functions”: „Biletaral [sic] contraction of splenius capitis results in extension of the head on the neck.” |

Numery S30–S32 są robocze — plik ma już S1…S28 (wdrażający nada kolejne wolne). S31 i S32 to ta sama organizacja (Kenhub) — liczą się jako jedno źródło przy jednej funkcji (nie używane razem).

## Otwarte

1. **Decyzja właściciela (produktowa):** czy dopuścić reguły po nazwie dla szyi. Opcja A — tak, jawna lista jak szrugsy/nadgarstek (3 ćwiczenia dostają opis; spójność z resztą isolation).
   Opcja B — szyja zostaje bez opisu (zero ryzyka, ale nieuzasadniona luka: źródła anatomiczne są jednoznaczne). Rekomendacja badacza: A — merytorycznie to ten sam przypadek co szrugsy.
2. **Zginanie szyi a głowy:** OpenStax mówi „flexors of the head”, Conley — „flexion” szyi, Kenhub — mostkowo-obojczykowo-sutkowy obustronnie prostuje górne stawy szyjne.
   Część wspólna: przednie mięśnie szyi zginają szyję/głowę w ruchu „broda do klatki” (ćwiczenie z talerzem). Na poziomie regionu „Zgina szyję” jest zgodne; na poziomie pojedynczego mięśnia — różnica, nieistotna dla aplikacji (opis regionu).
3. **Wariant opisu izometrii** (utrzymanie zamiast ruchu) — brak źródła i decyzji o nowym typie zdania.
4. **EN** — „Bends your neck forward” / „Straightens your neck” do przeglądu tłumacza.
5. Ostrzeżenia zdrowotne dot. szyi nie należą do ról mięśni — poza zakresem (aplikacja nie daje porad medycznych).

## Korekta szczebli 02.11.2026

Sprawdzone tylko źródła szczebla 4–5 (polecenie koordynatora linii 1.1); OpenStax (S4) i Conley (S30) — szczebel 3, bez zmian.
- S31, S32 (Kenhub): 4 → 4. (a) serwis edukacyjny z redakcją i recenzją medyczną (recenzent i data przeglądu podane przy wpisach), (b) autor i data, (c) treść edukacyjna.
- Żadna funkcja nie zależy od Kenhub: `neck.flex` i `neck.ext` mają po dwa źródła szczebla 3 (S4 + S30), `neck.lat_flex` — S4 + S30 (+ S31).
- Cytat HealthLink BC w części „Izometria” to tylko uzasadnienie „bez opisu” (nie twierdzenie w aplikacji); jego szczebel oceniono w `wskazowki-fala-w1/neck.md` (4 — treść Healthwise/WebMD Ignite opublikowana z datą przez placówkę medyczną).
- Ćwiczenia gotowe: **3 przed → 3 po** (nadal czekają na decyzję właściciela A/B).

## Stan

02.11.2026: 3 funkcje zaproponowane (2 z regułą, `neck.lat_flex` bez ćwiczenia), 3 ćwiczenia gotowe do reguły po nazwie, 2 izometrie — rekomendacja „bez opisu”.
Korekta szczebli 02.11.2026: bez zmian statusów.
Nic nie wdrożone; blokuje decyzja właściciela (opcje A/B wyżej).
