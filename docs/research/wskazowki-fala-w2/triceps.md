# Wskazówki techniki — fala W2, rodzina „triceps”

Data: 02.11.2026. Autor: badacz merytoryczny (agent), grupa G7. Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`.
Podstawa: stan W1 (`docs/research/wskazowki-fala-w1/triceps.md` i `triceps-2.md`, sekcje „Korekta szczebli — przeliczenie koordynatora 02.11.2026”
i bloki „po przeliczeniu”). Zdania W1 oznaczone tam „zostaje” użyte bez ponownego badania. Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md`.
Wszystkie strony wymienione w sekcji 4 przeczytane w tej sesji (WebFetch, 02.11.2026). Przed statusem gotowym — niezależna recenzja (L-047).

## (1) Tabela ćwiczeń (32 klucze rodziny)

| Klucz | Stan po W2 | Co dodano w W2 / powód |
|---|---|---|
| Skullcrusher (hantle) | **własna z błędami** | błąd `tri.mis.elbowsFlare` (Catalyst #903 wprost + ACE #36 standard; wariant sprzętu: sztanga) |
| Machine Triceps Extension | **własna z błędami** | błąd `tri.mis.padLift` (Naternicola Fig. 5.28 wprost + ACE #292 standard) |
| Dumbbell One-Arm Triceps Extension | **własna z błędami** | `tri.mis.elbowDrift1` (Catalyst #894 wprost + ACE #74 standard), `tri.mis.archBack` (Naternicola + BarBend wprost) |
| Overhead Triceps Extension (EZ) | **własna z błędami** | `tri.mis.archBack` (Naternicola + BarBend wprost + ACE #74 standard) |
| Standing Overhead Barbell Triceps Extension | **własna z błędami** | jw. |
| Kettlebell Overhead Triceps Extension | **własna z błędami** | jw. |
| Tate Press | **własna z błędami** | `tri.mis.tateElbows` — wnioskowany z `tate.move` |
| Triceps Kickback | **własna z błędami** | `tri.mis.kickArm` (ACE #55 wprost + Catalyst #910 standard), `tri.mis.kickBack` (ACE #55 wprost + wniosek z `kick.setup`) |
| Skullcrusher (sztanga) | **własna z błędami** (była otwarta) | nowe `tri.skullBb.setup`, `tri.skullBb.move` (ACE #36 + Catalyst #903 [+ ISSA]); `skull.upperArm` z W1; błąd `tri.mis.elbowsFlare` |
| Standing Low-Pulley One-Arm Triceps Extension | **własna z błędami** (była otwarta) | `lpote.setup` (W1, tekst bez zmian) ma teraz drugie źródło: BarBend (M. Dewar, CSCS); błędy `tri.mis.archBack`, `tri.mis.elbowDrift1` |
| Single Arm Triceps Pushdown | własna z błędami (W1, bez zmian) | — |
| Reverse Grip Triceps Pushdown | otwarta | drugie źródło ≤ 4 o podchwycie nie znalezione (wyniki: sklepy, serwisy bez autora); NFPT „Guest” = 5 |
| Triceps Kickback (linki) | otwarta | ustawienie przy wyciągu: tylko BarBend (lista ćwiczeń na triceps, „Cable Kickback”) — jedno źródło; Catalyst #910 opisuje tylko hantel z podparciem (inne ustawienie) |
| Two-Arm Dumbbell Kickback | otwarta | brak źródła o wersji oburącz bez podparcia (Catalyst #910 i ACE #55 — jednorącz z podparciem) |
| Incline Barbell / Cable Incline Triceps Extension | otwarte | Catalyst #903 tylko wymienia ławkę skośną jako wariant („can also be done on an incline bench”) — bez ustawienia; `skull.upperArm` nadal fałszywe na skosie |
| Cable Lying Triceps Extension | otwarta | Catalyst #903 wymienia „low cable” tylko jako wariant — bez ustawienia |
| Band Overhead, Band Skull Crusher, Kneeling Cable, One-Arm Lying Dumbbell, Decline Dumbbell, Decline EZ Bar, Lying Close-Grip … Behind The Head, Chain Handle Extension | otwarte | w tej sesji nie znaleziono źródeł ≤ 4 o tych wersjach (bez zmian względem W1) |
| Body-Up, Bodyweight Triceps Extension, Sled Overhead Triceps Extension | otwarte | brak źródeł (tryb `open`, bez zmian) |
| Cable Overhead Extension, Overhead Triceps Extension (hantel), Skullcrusher (EZ), Triceps Pushdown | KARTA — poza zakresem | uwaga do Skullcrusher (EZ) w sekcji 5 pkt 1 |

Bilans: własne z błędami 11 (było 1), własne bez błędów 0 (było 8), otwarte 17 (było 19), KARTA 4. JM Press i Decline Close-Grip Bench To Skull Crusher
nie są na liście 32 kluczy rodziny — nie badane (JM Press: EliteFTS sprawdzony ponownie — bez biogramu autora, otoczenie sklepu → nadal 5).

## (2) Blok do wdrożenia

### Blok do wdrożenia

Uzupełnia bloki W1 („po przeliczeniu”). Dla 8 kart „własne bez błędów” wpis zawiera **tylko** `mistakes` — `setup`/`move`/`tips` jak w blokach W1.
Dla Skullcrusher (sztanga) i Standing Low-Pulley — wpisy pełne (zastępują wpisy W1). Wpis `["wniosek", "<id>"]` = błąd wnioskowany z zdania tej karty.

```json
{
  "exercises": {
    "Skullcrusher (hantle)": {
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "uproszczenie": "wariant sprzętu sztanga", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides); Variations (dumbbells)"], ["ace-36", "Final Tip (keep your elbows shoulder-width apart) — błąd = zaprzeczenie standardu; wariant: sztanga"]]}
      ]
    },
    "Machine Triceps Extension": {
      "mistakes": [
        {"c": "tri.mis.padLift", "s": [["hk-naternicola", "Figure 5.28 Machine Arm Extension, Misstep (elbows lift off the pad)"], ["ace-292", "Step 2 (rest the upper arms on the pad) — błąd = zaprzeczenie standardu"], ["wniosek", "machTri.setup"]]}
      ]
    },
    "Dumbbell One-Arm Triceps Extension": {
      "mistakes": [
        {"c": "tri.mis.elbowDrift1", "uproszczenie": "wariant sprzętu wyciąg", "s": [["catalyst-894", "Description (keep the elbow high instead of driving it forward; wariant: wyciąg)"], ["ace-74", "Step 3 (without moving your upper arms) — błąd = zaprzeczenie standardu; wariant: oburącz"], ["wniosek", "ote1.upperArm"]]},
        {"c": "tri.mis.archBack", "uproszczenie": "wariant sprzętu hantel oburącz / wyciąg", "s": [["hk-naternicola", "Figure 5.27, Misstep (back arches; wariant: oburącz)"], ["barbend-ote", "Coach's Tips (not allow your lower back to arch excessively; wariant: wyciąg)"], ["ace-74", "Step 2; Step 3 (avoid changing the position of your … torso) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Overhead Triceps Extension (EZ)": {
      "mistakes": [
        {"c": "tri.mis.archBack", "uproszczenie": "wariant sprzętu hantel / wyciąg", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"], ["barbend-ote", "Coach's Tips (wariant: wyciąg)"], ["ace-74", "Step 2; Step 3 (avoid changing the position of your … torso) — błąd = zaprzeczenie standardu; wariant: hantel"]]}
      ]
    },
    "Standing Overhead Barbell Triceps Extension": {
      "mistakes": [
        {"c": "tri.mis.archBack", "uproszczenie": "wariant sprzętu hantel / wyciąg", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"], ["barbend-ote", "Coach's Tips (wariant: wyciąg)"], ["ace-74", "Step 2; Step 3 — błąd = zaprzeczenie standardu; wariant: hantel"]]}
      ]
    },
    "Kettlebell Overhead Triceps Extension": {
      "mistakes": [
        {"c": "tri.mis.archBack", "uproszczenie": "wariant sprzętu hantel / wyciąg", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"], ["barbend-ote", "Coach's Tips (wariant: wyciąg)"], ["ace-74", "Step 2; Step 3 — błąd = zaprzeczenie standardu; wariant: hantel"]]}
      ]
    },
    "Tate Press": {
      "mistakes": [
        {"c": "tri.mis.tateElbows", "s": [["wniosek", "tate.move"]]}
      ]
    },
    "Triceps Kickback": {
      "mistakes": [
        {"c": "tri.mis.kickArm", "s": [["ace-55", "Step 3 (upper arm … stationary next to your torso and not raised)"], ["catalyst-910", "Description (keep the upper arm horizontal and against your side) — błąd = zaprzeczenie standardu"], ["wniosek", "kick.upperArm"]]},
        {"c": "tri.mis.kickBack", "s": [["ace-55", "Step 3 (Avoid any arching (sagging) in your low back)"], ["wniosek", "kick.setup"]]}
      ]
    },
    "Skullcrusher (sztanga)": {
      "setup": [{"c": "tri.skullBb.setup", "s": [["ace-36", "Step 1 (supine on a flat bench; barbell directly above your face, elbows fully extended)"], ["catalyst-903", "Description (lie supine on a bench with a barbell … pressed up above you)"]]}],
      "move": [{"c": "tri.skullBb.move", "s": [["ace-36", "Step 2; Step 3 (towards your forehead or slightly behind your head; return)"], ["catalyst-903", "Description (bend the elbows … bar past the top of the head; extend)"], ["issa-tri-top5", "#2, wersja leżąc (lowered to ear level; barbell instead of dumbbells)"]]}],
      "tips": [
        {"c": "skull.upperArm", "s": [["ace-36", "Step 2; Final Tip (upper arms vertical)"], ["issa-tri-top5", "#2, wersja leżąc (upper arm does not move)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides)"], ["ace-36", "Final Tip (keep your elbows shoulder-width apart) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Standing Low-Pulley One-Arm Triceps Extension": {
      "setup": [{"c": "lpote.setup", "s": [["catalyst-894", "Description (one hand overhead facing away from the machine; elbow high)"], ["barbend-ote", "How to (pulley at a low position; face away from the cable stack; elbows forward and upwards; wariant: oburącz — wersja jednorącz wymieniona w Variations)"]]}],
      "move": [{"c": "lpote.move", "s": [["catalyst-894", "Description (bend the arm as far as you can, then extend it completely)"], ["ace-74", "Step 2; Step 3 (behind the head; wariant: hantel)"]]}],
      "tips": [
        {"c": "ote1.upperArm", "s": [["catalyst-894", "Description (keep the elbow high instead of driving it forward)"], ["issa-tri-top5", "#2 (one arm at a time; without moving the upper arm; wariant: hantel)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.archBack", "uproszczenie": "wariant sprzętu oburącz / hantel", "s": [["barbend-ote", "Coach's Tips (not allow your lower back to arch excessively; wariant: oburącz)"], ["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"]]},
        {"c": "tri.mis.elbowDrift1", "s": [["catalyst-894", "Description (instead of driving it forward)"], ["ace-74", "Step 3 (without moving your upper arms) — błąd = zaprzeczenie standardu; wariant: hantel"], ["wniosek", "ote1.upperArm"]]}
      ]
    }
  },
  "sources": {
    "catalyst-903": {"org": "Catalyst Athletics", "title": "Skullcrusher (#903)", "url": "https://www.catalystathletics.com/exercise/903/Skullcrusher/", "level": 4},
    "catalyst-910": {"org": "Catalyst Athletics", "title": "Tricep Kickback (#910)", "url": "https://www.catalystathletics.com/exercise/910/Tricep-Kickback/", "level": 4},
    "barbend-ote": {"org": "BarBend", "title": "Overhead Triceps Extension (M. Dewar, akt. 13.03.2025)", "url": "https://barbend.com/overhead-triceps-extension/", "level": 4}
  },
  "orgs": {}
}
```

Uwagi do wdrożenia: organizacja „Catalyst Athletics” i źródła catalyst-894, ace-36/55/74/292, issa-tri-top5, hk-naternicola — z bloków W1 (wdrażane razem).
Organizacja BarBend już jest w `data/zrodla/cues.json` (`orgs.BarBend`, szczebel 4). Klucz `"uproszczenie"` przy wpisie zdania — zgodnie z briefem W2;
w kartach z `"wniosek"` obok źródeł wniosek jest dodatkową podstawą, nie jedyną.

## (3) Nowe zdania PL + EN

Id sprawdzone: brak `tri.*` w `lib/cues/text/pl.json` i w plikach W1. `lpote.setup` — id i tekst z W1 (`triceps-2.md`, sekcja 3), bez zmian.

| Id | PL | EN (propozycja) |
|---|---|---|
| tri.skullBb.setup | Połóż się na ławce i trzymaj sztangę nad sobą na prostych rękach. | Lie on a bench and hold the bar above you with straight arms. |
| tri.skullBb.move | Zginaj łokcie, opuszczając sztangę w stronę głowy; wyprostuj ręce do pozycji wyjściowej. | Bend your elbows to lower the bar toward your head; straighten your arms back to the start. |
| tri.mis.elbowsFlare | Łokcie rozjeżdżają się na boki. | Elbows flaring out to the sides. |
| tri.mis.padLift | Łokcie odrywają się od poduszki. | Elbows lifting off the pad. |
| tri.mis.elbowDrift1 | Łokieć opada w przód zamiast zostać wysoko. | Elbow drifting forward instead of staying high. |
| tri.mis.archBack | Wyginanie pleców w łuk. | Arching your back. |
| tri.mis.tateElbows | Łokcie zjeżdżają do tułowia zamiast celować w boki. | Elbows tucking in toward your body instead of pointing out to the sides. |
| tri.mis.kickArm | Ramię się rusza — odjeżdża od tułowia albo zmienia wysokość. | Upper arm moving — drifting away from your body or changing height. |
| tri.mis.kickBack | Plecy zapadają się w dole albo wyginają w łuk. | Lower back sagging or arching. |

Kontrola sformułowań:
- `tri.skullBb.setup` „nad sobą” — część wspólna ACE #36 („directly above your face”) i Catalyst #903 („pressed up above you”).
- `tri.skullBb.move` „w stronę głowy” — część wspólna ACE #36 (czoło albo tuż za głowę), ISSA (do wysokości uszu) i Catalyst #903 (za czubek głowy); jak `skullDb.move` z W1.
- `skull.upperArm` („mniej więcej pionowo”) — Catalyst #903 mówi „slightly behind vertical”; mieści się w „mniej więcej”, nie przeczy. Źródła zdania: ACE + ISSA (jak W1).
- `tri.mis.elbowsFlare` nie trafia do kart nad głową (EZ, Barbell, Kettlebell) — mają już wskazówkę `ote.elbowsIn` o tym samym (dublowanie).
- `tri.mis.kickArm` „zmienia wysokość” — ACE: „not raised”; Catalyst: ramię poziomo przy boku. `tri.mis.kickBack` — ACE wprost: „arching (sagging) in your low back”.
- `tri.mis.archBack` — ten sam tekst co `mis.archBack` z W1 (spadło tam z braku drugiego źródła); nowe id w przestrzeni `tri.`, żeby nie kolidować z innymi rodzinami.
- Bez twierdzeń o zdrowiu (ACE #55 „for safety reasons…”, ostrzeżenia BarBend nie przeniesione).

Cytaty kontrolne (po 1 zdaniu):
- Catalyst #903: „extend the elbows into full lockout, avoiding flaring them out to the sides, then lower again under control.”
- ACE #55, Step 3: „Avoid any arching (sagging) in your low back or any rotation in your torso.”
- BarBend (Dewar), Coach's Tips: „Don't let your elbows flare out.”

## (4) Źródła (nowe w W2)

| Id | Adres | Organizacja | Szczebel | Uzasadnienie (co widać na stronie) |
|---|---|---|---|---|
| catalyst-903 | https://www.catalystathletics.com/exercise/903/Skullcrusher/ — Description; Variations | Catalyst Athletics | 4 | rozstrzygnięcie w szczeble-organizacji (wiersz Catalyst Athletics): biblioteka firmowana przez Catalyst Athletics, Inc., założyciel G. Everett; hasło bez autora i daty. Z catalyst-894 = jedna organizacja |
| catalyst-910 | https://www.catalystathletics.com/exercise/910/Tricep-Kickback/ — Description | Catalyst Athletics | 4 | jw. |
| barbend-ote | https://barbend.com/overhead-triceps-extension/ — kroki „how to”, Coach's Tips, Variations | BarBend | 4 (warunkowo) | rozstrzygnięcie BarBend: artykuł techniki z autorem i datą. Autor: Mike Dewar — biogram: magister fizjologii wysiłku, CSCS, asystent trenera przygotowania motorycznego NYU; „Last updated March 13, 2025”. Bez recenzenta „Expert Verified” — słabsze niż zalecane „najlepiej” |

Ponownie przeczytane w tej sesji (bez zmiany szczebla): ace-36, ace-55, ace-74, ace-292, issa-tri-top5 (autor „ISSA”, 05.02.2024), hk-naternicola (N. L. Naternicola,
„Fitness: Steps to Success”; na stronie fragmentu brak daty książki), catalyst-909.

Przeczytane, nieliczone:
- EliteFTS, D. Tate, „How to Perform the JM Press…” (28.07.2026) — brak biogramu i kwalifikacji, strona otoczona ofertą sklepu → 5 (bez zmian).
- BarBend, lista „11 Best Triceps Exercises…” (M. Dewar, akt. 28.07.2026, Expert Verified: J. Dickson, NASM-CPT, USAW-L2; otwarta przez adres barbend.com/jm-press/,
  ostatecznego adresu narzędzie nie podało) — „Cable Kickback”: wyciąg na wysokości pasa, ramię przy tułowiu, „parallel to the ground”. Jedyne źródło o ustawieniu
  kickbacku z linką → nie użyte (sekcja 5 pkt 3); adres do ustalenia przed użyciem.
- Wyniki wyszukiwania o podchwycie (Bodybuilding.com, Inspire USA Foundation, sklepy suplementów, Mikolo) — nieotwierane jako źródła: serwisy bez autora / sprzedawcy (5).

## (5) Otwarte

1. **[OTWARTE / DO DECYZJI koordynatora] Kierunek opuszczania w skull crusher.** Catalyst #903 (4): sztanga „past the top of the head”; ACE #36: „towards your forehead
   or slightly behind your head”; ISSA: do wysokości uszu. `skull.move` („w stronę czoła”) dla Skullcrusher (sztanga) zastąpione `tri.skullBb.move` („w stronę głowy” —
   część wspólna). Ta sama różnica dotyczy karty **Skullcrusher (EZ)** (ACG-006, `skull.move`, `skull.depth` „tuż nad czołem”) — poza zakresem, tylko zgłaszam.
2. **[OTWARTE] Blokowanie łokcia w skull crusher — sprzeczność na szczeblu 4.** Catalyst #903: „extend the elbows into full lockout”; ISSA #2: „not lock the elbows”.
   `press.noLock` nie trafia do kart skull crusher (było już tak po przeliczeniu W1). Część wspólna: wyprost do końca.
3. **[OTWARTE] Triceps Kickback (linki) — ustawienie.** Jedno źródło ≤ 4 (BarBend, lista ćwiczeń); potrzebne drugie o wersji z wyciągiem.
4. **[OTWARTE] Reverse Grip Triceps Pushdown** — tylko Catalyst #878; drugie źródło ≤ 4 o podchwycie nie znalezione. Gdyby autor NFPT („Guest”) okazał się trenerem
   z kwalifikacjami, karta byłaby gotowa (zdania `rgpd.*` z W1).
5. **[OTWARTE] Błędy z jednym źródłem:** kickback — skręcanie tułowia (tylko ACE #55); maszyna — unoszenie barków (tylko Naternicola); skull crusher — „ramiona uciekają w tył”
   jako granica głębokości (ACE #36; Catalyst dopuszcza lekkie odchylenie w tył — rozbieżność).
6. **[OTWARTE] Niezależność ACE + Naternicola** (autorka jest master trainer ACE) — w W2 żadna para błędu nie stoi tylko na nich: `tri.mis.archBack` ma też BarBend,
   `tri.mis.padLift` — ACE #292 + Naternicola (jak `machTri.*` z W1; wątpliwość W1 nadal dla koordynatora).
7. **[OTWARTE] Rozbieżność ISSA #3 i ACE #55/Catalyst #910 w kickbacku:** ISSA — ramię „perpendicular to the body”; ACE — „parallel to, and close to, your torso”; Catalyst —
   „horizontal and against your side”. `kick.setup` z W1 mówi „ramię przy tułowiu” (ACE + Catalyst zgodne) — recenzent sprawdzi, czy ISSA nadal liczyć jako źródło `kick.setup`.
8. Pozostałe 15 otwartych kluczy (poprawka koordynatora G7: było 13) (tabela 1) — bez źródeł ≤ 4 o tych wersjach; kandydaci jak w W1 (NSCA, biblioteki uczelni z autorem).
