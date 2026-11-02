# Wskazówki techniki — rodzina `kneeling_hinge`

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Korekta szczebli 2 (02.11.2026)

Zastosowano ROZSTRZYGNIĘCIE 2 koordynatora linii 1.1 (02.11.2026 ~07:55). Bez nowych źródeł.

- W pliku nie występują Physitrack, The Prehab Guys, Torokhtiy, Freelap, NSCA, szpitale ani uczelniane centra sportu. Coach
  (`coachweb.com/.../184/good-morning`) jest tylko w „Dostęp” jako nieliczony (wersja stojąca); po sprawdzeniu 02.11.2026 (autor
  Nick Harris-Fry, dziennikarz bez kwalifikacji trenerskich) i tak szczebel 5 — szczegóły w `hinge-cz1.md`, „Korekta szczebli 2”.
- Reguła błędów: w pliku brak zdań `.mis.` (żaden błąd nie był proponowany).
- Zdania w blokach JSON: blok `exercises` pusty — bez zmian.
- Wynik: gotowe **0 → 0** (Seated Good Mornings i Kneeling Squat nadal otwarte; dzięki nowym regułom żadne nie zyskuje drugiego źródła).
- Sekcja „Stan korekty” na końcu pliku (oceny do przeniesienia do `squat-cz2.md`) zostawiona bez zmian. Uwaga dla wykonawcy
  `squat-cz2.md`: lista w tej sekcji powstała przed ROZSTRZYGNIĘCIEM 2 — przy przenoszeniu zastosuj też ROZSTRZYGNIĘCIE 2
  (m.in. Physitrack → 5, co zamyka pytanie z „Pułapek”; uczelniane centra sportu bez autora → 5, uczelniane służby zdrowia → 4;
  The Prehab Guys, Coach, Torokhtiy, Freelap — 4 tylko z autorem z kwalifikacjami).

## Korekta szczebli 02.11.2026

Zastosowano rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = (a) organizacja szkoląca trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść firmowana; (c) nie recenzja z linkami afiliacyjnymi ani marketing).

- Zmieniony szczebel: `Fitness Volt` 4 → **5** (nowa organizacja spoza listy, oceniona wg (a)–(c) po sprawdzeniu strony 02.11): (b) spełnione (autor Patrick Dale z biogramem, data tylko w metadanych strony: 19.09.2023 / zmiana 11.08.2024); (a) niespełnione — serwis treningowy bez organizacji szkolącej trenerów i bez wskazanej recenzji eksperckiej (brak „reviewed by”); (c) wątpliwe — artykuł odsyła do recenzji produktów serwisu (pasy, stojaki, gumy), ten sam rodzaj serwisu co Muscle & Strength / Garage Gym Reviews, które koordynator zostawił „otwarte — nie licz”.
- Catalyst Athletics — 4 (lista koordynatora), bez zmian.
- Ćwiczenia, które spadły do otwartych: **Seated Good Mornings** (gotowe → otwarte; każde zdanie miało Catalyst 184 + Fitness Volt).
- Zdania usunięte z bloku JSON: 4 (`gm.seatSetup`, `gm.seatMove`, `hinge.back`, `gm.seatLoad`) — przeniesione do „Dane częściowe”. Blok JSON wpisów do `exercises` jest pusty.

Metoda: jak w `docs/research/33-wskazowki-partia2.md` (2 zgodne, niezależne, przeczytane źródła szczebla 4 z różnych organizacji;
bez liczb i uzasadnień zdrowotnych). ExRx (403) i web.archive.org — nie czytane. Strony innych aplikacji pominięte.

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Seated Good Mornings | **otwarte (korekta 02.11)** | Catalyst Athletics 184 „Seated Good Morning” (4) + Fitness Volt (5 po korekcie) — tylko 1 źródło szczebla 4. Katalog: siad na skrzyni/ławce w klatce, sztanga na plecach. Dane częściowe niżej. |
| Kneeling Squat | **otwarte** | Katalog: wyprost bioder w klęku ze sztangą na plecach, w klatce z nisko ustawionymi zabezpieczeniami. Przeczytanych źródeł szczebla 4 z opisem techniki nie znaleziono (wyniki: serwisy bez autora i aplikacje). |

## Wpisy do `cues.json` → `exercises`

```json
{}
```

## Dane częściowe — Seated Good Mornings (nie do `cues.json`)

Jedno źródło szczebla 4 (`catalyst-184`); `fitnessvolt-seated-good-morning` — szczebel 5, nie liczy się.

| zdanie | catalyst-184 (4) | fitnessvolt-seated-good-morning (5) |
|---|---|---|
| `gm.seatSetup` (ustawienie) | opis (bar on upper back as for back squat, straddling a bench, feet flat) | Setup 1–2 |
| `gm.seatMove` (ruch) | opis (hinge at the hip … without losing the back extension; return upright) | Movement 1–3 |
| `hinge.back` (wskazówka) | opis (keep the back tightly extended) | Form Tips (neutral spine throughout); Common Mistakes (rounding the lower back) |
| `gm.seatLoad` (wskazówka) | opis (do not add weight that compromises the position) | Form Tips; Common Mistakes (too much weight too soon) |

Uwaga do `hinge.back`: Catalyst dopuszcza zaokrąglanie pleców „tylko u bardzo doświadczonych, ze zdrowymi plecami” — jako wyjątek;
zalecenie podstawowe to plecy wyprostowane przez cały ruch. Z tego powodu **nie** proponowano `mis.roundBack` jako błędu.

## Nowe zdania (wstrzymane — ćwiczenie otwarte)

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `gm.seatSetup` | Usiądź okrakiem na ławce, stopy płasko na podłodze, sztanga na górze pleców. | Sit astride a bench, feet flat on the floor, bar across your upper back. | `gm.setup` opisuje wersję stojącą (kolana lekko ugięte). |
| `gm.seatMove` | Pochyl tułów w przód z bioder, z prostymi plecami; wróć do pionu. | Hinge forward from the hips with a straight back, then come back upright. | `gm.move` mówi o cofaniu bioder i wypychaniu ich w przód — w siadzie biodra się nie przesuwają. |
| `gm.seatLoad` | Bierz tylko taki ciężar, przy którym utrzymasz proste plecy. | Only use a weight that lets you keep your back straight. | Zestaw ogólny ma `gm.light` („zacznij od bardzo lekkiego i dokładaj stopniowo”) — Catalyst tego nie mówi (mówi: nie dokładaj ciężaru, który psuje pozycję). |

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / krótki cytat |
|---|---|---|---|---|
| `catalyst-184` | https://www.catalystathletics.com/exercise/184/Seated-Good-Morning/ | Catalyst Athletics (nowa, proponowana też w `hip_bridge.md`) | 4 | opis: „Hinge at the hip to bend forward as far as you can without losing the back extension.” |
| `fitnessvolt-seated-good-morning` | https://fitnessvolt.com/seated-good-morning/ | Fitness Volt (nowa) | 5 (korekta 02.11) | Movement 1: „Slowly hinge forward at your hips while maintaining a solid back arch.” (autor: Patrick Dale, trener) |

```json
{
  "orgs": {
    "Fitness Volt": {"name": "Fitness Volt — poradniki ćwiczeń (fitnessvolt.com, autorzy-trenerzy; bez recenzji eksperckiej, serwis z recenzjami produktów — szczebel 5 wg rozstrzygnięcia 02.11.2026)", "level": 5, "kind": "site"}
  },
  "sources": {
    "catalyst-184": {"org": "Catalyst Athletics", "title": "Seated Good Morning (#184)", "url": "https://www.catalystathletics.com/exercise/184/Seated-Good-Morning/", "level": 4},
    "fitnessvolt-seated-good-morning": {"org": "Fitness Volt", "title": "Seated Good Morning (P. Dale, 2023/2024)", "url": "https://fitnessvolt.com/seated-good-morning/", "level": 5}
  }
}
```

(Organizacja „Catalyst Athletics” — wpis `orgs` w `hip_bridge.md`.)

## Otwarte

| Ćwiczenie / zdanie | Powód | Co by rozstrzygnęło |
|---|---|---|
| Seated Good Mornings — całość (korekta 02.11) | po korekcie tylko Catalyst 184 (4); Fitness Volt — 5; korekta 2 bez zmian | drugie źródło szczebla 4 o good morning w siadzie (organizacja szkoląca trenerów, serwis z recenzją ekspercką, artykuł z autorem z kwalifikacjami) |
| Kneeling Squat — całość | brak 2 przeczytanych źródeł szczebla 4 | biblioteka organizacji szkolącej trenerów z opisem przysiadu w klęku ze sztangą |
| Seated Good Mornings — głębokość | Catalyst: „tak nisko, jak utrzymasz wyprost pleców”; Fitness Volt: „do rozciągnięcia tyłu ud” — różne kryteria; `gm.depth` (poziom tułowia) bez źródła dla wersji siedzącej | drugie źródło szczebla 4 |
| Seated Good Mornings — źródło Fitness Volt | artykuł niespójny wewnętrznie (sekcje „Proper Form” i FAQ opisują inny chwyt/krzesło); używana była tylko sekcja instrukcji ze sztangą na plecach | — (źródło nie liczy się po korekcie) |
| Zestaw ogólny (`cue-sets.json`) — informacja o błędach | Seated Good Mornings: `gm.light` — Catalyst nie potwierdza brzmienia; `mis.roundBack` — Catalyst dopuszcza zaokrąglenie u bardzo doświadczonych | przegląd zestawu ogólnego |
| Rodzina `kneeling_hinge` dla Seated Good Mornings | siad na ławce, nie klęk — nazwa rodziny nie pasuje (ruch: zgięcie w biodrach, jak w rodzinie) | decyzja koordynatora; bez wpływu na wskazówki |

## Dostęp

- exrx.net — 403; web.archive.org — zablokowane.
- coachweb.com/exercises/back-exercises/184/good-morning — czytane, ale opisuje tylko wersję stojącą (nie liczone; po korekcie 2 i tak szczebel 5 — autor bez kwalifikacji).

## Stan korekty

Korekta szczebli 02.11.2026 (rozstrzygnięcie koordynatora linii 1.1) — przerwana z powodu limitu kontekstu.

- Zrobione: `calf_raise.md`, `hip_bridge.md`, `kneeling_hinge.md`, `hinge-cz2.md`, `leg_machine.md` (każdy ma sekcję „Korekta szczebli 02.11.2026”).
- Zostało: `squat-cz2.md` — nieczytany, bez korekty.
- Następny krok: w `squat-cz2.md` zastosować te same oceny, co w plikach zrobionych (spójność między plikami):
  - Breaking Muscle — 5; BarBend — 4 tylko artykuł o technice; Fitness Volt — 5; Legion Athletics — 5; Dynamo Fitness — 5 (sprzedawca); PureGym — 5; Asphalt Green — 5; uczelniane centra rekreacji (UTHSC itp.) i University of Illinois Extension — 5; BoxLife — 5; Gymreapers — 5;
  - NFPT: strony `nfpt.com` sprawdzone 02.11 (`?p=4330`, `how-to-do-hack-squats`) mają byline „Guest” i ten sam biogram oraz datę → 5; każdą inną stronę NFPT sprawdzić osobno (autor imiennie w byline);
  - Bells of Steel, Major Fitness, RitFit, Onnit, Bodylastics, Performance Health — 4 tylko dla własnego rodzaju sprzętu; Catalyst Athletics, Barbell Logic — 4.
- Pułapki: NFPT „Guest” — gdyby koordynator uznał biogram za autora, NFPT wraca do 4 i odzyskują się zdania opisane w „Otwarte” w `calf_raise.md` i `leg_machine.md` (Hack Squat wróciłby do „gotowe”). Physitrack (szczebel 4 w `cues.json`) — pytanie, czy to „dokumentacja innej aplikacji”, opisane w `calf_raise.md`.
