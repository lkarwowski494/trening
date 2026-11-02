# Role mięśni — region `neck` (szyja), fala W2, 02.11.2026

Tylko zbieranie danych. Podstawa: `role-miesni-fala-w1/neck.md` i **decyzja właściciela 02.11.2026, wariant A**: role mięśni szyi tylko dla ćwiczeń
z jawnej listy `nameRules`; izometrie bez roli, z powodem. Źródła anatomiczne przeczytane ponownie 02.11.2026 (OpenStax 11.3, Conley 1995).

## 1. Pary

| wiersz (ćwiczenie, mięsień) | proponowana funkcja / reguła | źródła (miejsce, szczebel) | status |
|---|---|---|---|
| Lying Neck Flexion (talerz), neck (1, main) | `neck.flex` przez `nameRules` | S4 OpenStax 11.3 (tab. 11.5 + tekst), szczebel 3; S35-g1 Conley 1995 (Results), szczebel 3 | dwa_zrodla |
| Lying Neck Extension (talerz), neck (1, main) | `neck.ext` przez `nameRules` | S4 (tab. 11.5), S35-g1 (Results) — oba szczebel 3 | dwa_zrodla |
| Neck Harness Extension, neck (1, main) | `neck.ext` przez `nameRules` | jw. | dwa_zrodla |
| Isometric Neck Exercise - Front And Back, neck (1) | `exceptions.noRole` | powód niżej | bez roli (decyzja A) |
| Isometric Neck Exercise - Sides, neck (1) | `exceptions.noRole` | powód niżej | bez roli (decyzja A) |

Udział `neck: 1` — `lib/catalog.generated.ts` (sekcja udziałów, m.in. linie 1124–1125 dla zginania z talerzem i uprzęży); wzorzec `isolation`
(bez fazy) → zdanie = sam tekst funkcji + „.”.

## 2. Blok do wdrożenia (`data/zrodla/role-miesni.json`)

### functions

```json
{
  "neck.flex": {
    "region": "neck", "staw": "szyja i głowa", "ruch": "zgięcie (pochylenie głowy w przód)",
    "pl": {"main": "Pochyla głowę do przodu", "aux": "Pomaga pochylać głowę do przodu"},
    "en": {"main": "Tilts your head forward", "aux": "Helps tilt your head forward"},
    "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["S4", "S35-g1"],
    "uwaga": "Tylko jawna lista nameRules (decyzja właściciela 02.11.2026, wariant A). OpenStax i Conley opisują zgięcie głowy/szyi przez mięśnie przednie; opis na poziomie regionu."
  },
  "neck.ext": {
    "region": "neck", "staw": "szyja i głowa", "ruch": "wyprost (odchylenie głowy w tył)",
    "pl": {"main": "Odchyla głowę do tyłu", "aux": "Pomaga odchylać głowę do tyłu"},
    "en": {"main": "Tilts your head back", "aux": "Helps tilt your head back"},
    "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["S4", "S35-g1"],
    "uwaga": "Tylko jawna lista nameRules (decyzja właściciela 02.11.2026, wariant A)."
  }
}
```

Zmiana względem W1: tekst „Zgina szyję” / „Prostuje szyję” zamieniony na „Pochyla głowę do przodu” / „Odchyla głowę do tyłu”, bo oba źródła mówią o zgięciu
i wyproście **głowy** (OpenStax: „the head flexes or extends”; Conley: grupy mięśni wyprostu i zgięcia głowy/szyi), a tak powie trener na siłowni; spójne z W1 `neck.lat_flex`
(„Przechyla głowę na bok”). Jeśli recenzent lokalizacji woli wersję W1 — źródła jej nie przeczą (region „szyja”), to wybór brzmienia.
`neck.lat_flex` z W1 — **nie dodawać** (żadne ćwiczenie katalogu go nie użyje).

### sources (nowe; S4 — dopisać cytaty)

```json
[
  {"id": "S35-g1", "tier": 3,
   "cite": "Conley MS, Meyer RA, Bloomberg JJ, Feeback DL, Dudley GA. Noninvasive analysis of human neck muscle function. Spine 1995;20(23):2505–12",
   "url": "https://pubmed.ncbi.nlm.nih.gov/8610245/",
   "miejsce": "abstrakt, Results",
   "cytaty": ["„extension--semispinalis capitis and cervicis and splenius capitis; flexion--sternocleidomastoid and longus capitis and colli”"]}
]
```

Do istniejącego S4 (OpenStax 11.3): `miejsce` + „; Muscles That Move the Head (tekst i tab. 11.5)”, `cytaty` + „„When they contract bilaterally, the head flexes or extends.””
oraz „tab. 11.5: mostkowo-obojczykowo-sutkowy „bilaterally: flexion”; półkolcowy, płatowy i najdłuższy głowy „bilaterally: extension””.
Numer S35-g1 roboczy (W1 core_floor używa S29-g1…S34-g1) — wdrażający nadaje kolejny wolny.

### nameRules.reguly (dopisać)

```json
[
  {"muscle": "neck", "roles": ["main"], "function": "neck.flex", "exercises": ["Lying Neck Flexion (talerz)"]},
  {"muscle": "neck", "roles": ["main"], "function": "neck.ext", "exercises": ["Lying Neck Extension (talerz)", "Neck Harness Extension"]}
]
```

### exceptions.noRole (dopisać)

```json
[
  {"exercise": "Isometric Neck Exercise - Front And Back", "muscles": ["neck"], "powod": "izometria (metric: time): głowa ma stać w miejscu wbrew oporowi dłoni — czasownik ruchu nie opisuje ćwiczenia; przód i tył angażują przeciwne grupy (decyzja właściciela 02.11.2026, A)"},
  {"exercise": "Isometric Neck Exercise - Sides", "muscles": ["neck"], "powod": "izometria (metric: time): głowa ma stać w miejscu wbrew oporowi dłoni — „przechyla” nie opisuje ćwiczenia (decyzja właściciela 02.11.2026, A)"}
]
```

Powód „głowa stoi w miejscu” ma źródło techniki (W1 `wskazowki-fala-w1/neck.md`: HealthLink BC „your head should not move to either side”; NHS CHT „use your hand to resist the movement”) — to uzasadnienie braku opisu, nie tekst w aplikacji. Precedens w danych: Wall Sit, L-Sit (`exceptions.noRole`).

### Pozostałe zmiany w `role-miesni.json`

- `withoutRole.miesnie`: „neck — każda rodzina (zgięcie/wyprost/skłon tylko z nazwy)” → „neck — poza jawną listą nameRules (decyzja właściciela 02.11.2026, A)”.
- `nameRules._opis`: usunąć „Szyja: bez opisu.”
- `open` poz. 4 (reguły po nazwie dla isolation): część „szyja” zamknięta decyzją A.

## 3. Wdrożenie — miejsca w kodzie i testach (przeczytane, do zmiany w tym samym commicie)

Region szyi jest dziś wyłączony **niezależnie** od danych — sama zmiana JSON nie wystarczy:
- `scripts/zrodla-runtime.mjs:147` — `noRegions: ['neck']` na sztywno; `lib/muscleRoles.ts:32` zwraca `null` dla regionu z `noRegions` **przed** sprawdzeniem `nameRules` (linia 35). Trzeba usunąć `'neck'` z `noRegions`.
- `tests/muscle-roles.test.ts:83` (`matchRole(c('isolation'), 'neck', 1)` → null — sprawdzić, jaki klucz daje `c()`; dla klucza spoza listy nadal null), `:107` (`Lying Neck Flexion (talerz)` na liście „bez opisu”), `:127–131` („szyja — żadnej” wyświetlanej funkcji; `some(f => f.r === 'neck')` → false), `:151` (szyja: wiersz bez zdania) — do odwrócenia z datą decyzji 02.11.2026; nowy test: izometrie szyi → `null` (noRole), talerz/uprząż → zdanie.
- `tests/muscle-roles.test.ts:155` — `REGION_MUSCLE.neck` jest `null` (szyja poza mapą partii); `lib/muscleRoles.ts:61` daje wtedy wiersz z `muscle: null` i zdaniem — czy ekran ćwiczenia pokazuje taki wiersz poprawnie (etykieta regionu) — [OTWARTE] dla programisty, nie merytoryczne.
- Nowe teksty: słownik `lib/i18n.en.ts` (PL → EN) i ewentualnie rejestr twierdzeń (`node scripts/claims.mjs --stub`), jeśli `scripts/claims.mjs` rozpoznaje zdania ról jako dziedzinowe (zakresu strażnika nie sprawdzałem — do sprawdzenia przez wdrażającego).
- Docs/18: wpis decyzji A z 02.11.2026 ma pole `[wdrożenie: …]` — test z datą decyzji.

## 4. Źródła

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| S4 | https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back (czytane 02.11.2026) | OpenStax (Rice University), Anatomy and Physiology 2e | 3 (podręcznik) | „Muscles That Move the Head” — „When they contract bilaterally, the head flexes or extends.”; tab. 11.5 (kolumna działania) |
| S35-g1 | https://pubmed.ncbi.nlm.nih.gov/8610245/ (czytane 02.11.2026) | Conley i in., Spine 1995 (recenzowane badanie) | 3 | abstrakt, Results |

Niezależność: podręcznik anatomii (OpenStax) i badanie (Conley i in.) — różni autorzy i wydawcy.

## 5. Otwarte

1. Brzmienie PL/EN (p. 2) — do recenzenta lokalizacji; merytorycznie obie wersje zgodne ze źródłami.
2. Wiersz z `muscle: null` na ekranie (p. 3) — sprawa programisty.
3. Opis izometrii „utrzymanie” zamiast ruchu — poza decyzją A (brak źródła i typu zdania).
