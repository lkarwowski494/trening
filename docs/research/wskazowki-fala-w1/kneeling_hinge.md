# Wskazówki techniki — rodzina `kneeling_hinge`

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda: jak w `docs/research/33-wskazowki-partia2.md` (2 zgodne, niezależne, przeczytane źródła szczebla 4 z różnych organizacji;
bez liczb i uzasadnień zdrowotnych). ExRx (403) i web.archive.org — nie czytane. Strony innych aplikacji pominięte.

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Seated Good Mornings | **gotowe** | Catalyst Athletics 184 „Seated Good Morning” + Fitness Volt (P. Dale, trener). Katalog: siad na skrzyni/ławce w klatce, sztanga na plecach. Zastępuje zestaw ogólny (`f: rdl`). |
| Kneeling Squat | **otwarte** | Katalog: wyprost bioder w klęku ze sztangą na plecach, w klatce z nisko ustawionymi zabezpieczeniami. Przeczytanych źródeł szczebla 4 z opisem techniki nie znaleziono (wyniki: serwisy bez autora i aplikacje). |

## Wpisy do `cues.json` → `exercises`

```json
{
  "Seated Good Mornings": {
    "setup": [
      {"c": "gm.seatSetup", "s": [["catalyst-184", "opis (bar on upper back as for back squat, straddling a bench, feet flat)"], ["fitnessvolt-seated-good-morning", "Setup 1–2"]]}
    ],
    "move": [
      {"c": "gm.seatMove", "s": [["catalyst-184", "opis (hinge at the hip … without losing the back extension; return upright)"], ["fitnessvolt-seated-good-morning", "Movement 1–3"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["catalyst-184", "opis (keep the back tightly extended)"], ["fitnessvolt-seated-good-morning", "Form Tips (neutral spine throughout); Common Mistakes (rounding the lower back)"]]},
      {"c": "gm.seatLoad", "s": [["catalyst-184", "opis (do not add weight that compromises the position)"], ["fitnessvolt-seated-good-morning", "Form Tips (a weight that allows perfect form); Common Mistakes (too much weight too soon)"]]}
    ],
    "mistakes": []
  }
}
```

Uwaga do `hinge.back`: Catalyst dopuszcza zaokrąglanie pleców „tylko u bardzo doświadczonych, ze zdrowymi plecami” — jako wyjątek;
zalecenie podstawowe obu źródeł to plecy wyprostowane przez cały ruch, więc zdanie „bez zaokrąglania” jest zgodne z częścią wspólną.
Z tego powodu **nie** dodano `mis.roundBack` jako błędu (Catalyst nie nazywa zaokrąglenia błędem bez zastrzeżeń).

## Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `gm.seatSetup` | Usiądź okrakiem na ławce, stopy płasko na podłodze, sztanga na górze pleców. | Sit astride a bench, feet flat on the floor, bar across your upper back. | `gm.setup` opisuje wersję stojącą (kolana lekko ugięte). |
| `gm.seatMove` | Pochyl tułów w przód z bioder, z prostymi plecami; wróć do pionu. | Hinge forward from the hips with a straight back, then come back upright. | `gm.move` mówi o cofaniu bioder i wypychaniu ich w przód — w siadzie biodra się nie przesuwają. |
| `gm.seatLoad` | Bierz tylko taki ciężar, przy którym utrzymasz proste plecy. | Only use a weight that lets you keep your back straight. | Zestaw ogólny ma `gm.light` („zacznij od bardzo lekkiego i dokładaj stopniowo”) — Catalyst tego nie mówi (mówi: nie dokładaj ciężaru, który psuje pozycję). Nowe zdanie = część wspólna. |

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / krótki cytat |
|---|---|---|---|---|
| `catalyst-184` | https://www.catalystathletics.com/exercise/184/Seated-Good-Morning/ | Catalyst Athletics (nowa, proponowana też w `hip_bridge.md`) | 4 | opis: „Hinge at the hip to bend forward as far as you can without losing the back extension.” |
| `fitnessvolt-seated-good-morning` | https://fitnessvolt.com/seated-good-morning/ | Fitness Volt (nowa) | 4 | Movement 1: „Slowly hinge forward at your hips while maintaining a solid back arch.” (autor: Patrick Dale, trener) |

```json
{
  "orgs": {
    "Fitness Volt": {"name": "Fitness Volt — poradniki ćwiczeń (fitnessvolt.com, autorzy-trenerzy)", "level": 4, "kind": "site"}
  },
  "sources": {
    "catalyst-184": {"org": "Catalyst Athletics", "title": "Seated Good Morning (#184)", "url": "https://www.catalystathletics.com/exercise/184/Seated-Good-Morning/", "level": 4},
    "fitnessvolt-seated-good-morning": {"org": "Fitness Volt", "title": "Seated Good Morning (P. Dale)", "url": "https://fitnessvolt.com/seated-good-morning/", "level": 4}
  }
}
```

(Organizacja „Catalyst Athletics” — wpis `orgs` w `hip_bridge.md`.)

## Otwarte

| Ćwiczenie / zdanie | Powód | Co by rozstrzygnęło |
|---|---|---|
| Kneeling Squat — całość | brak 2 przeczytanych źródeł szczebla 4 | biblioteka organizacji szkolącej trenerów lub ExRx (gdy dostępny) z opisem przysiadu w klęku ze sztangą |
| Seated Good Mornings — głębokość | Catalyst: „tak nisko, jak utrzymasz wyprost pleców”; Fitness Volt: „do rozciągnięcia tyłu ud” — różne kryteria; `gm.depth` (poziom tułowia) bez źródła dla wersji siedzącej | trzecie źródło albo zdanie z częścią wspólną po decyzji koordynatora |
| Seated Good Mornings — źródło Fitness Volt | artykuł niespójny wewnętrznie (sekcje „Proper Form” i FAQ opisują inny chwyt/krzesło); użyto tylko sekcji instrukcji ze sztangą na plecach | potwierdzenie drugim serwisem |
| Zestaw ogólny (`cue-sets.json`) — informacja o błędach | Seated Good Mornings: `gm.light` — Catalyst nie potwierdza brzmienia; `mis.roundBack` — Catalyst dopuszcza zaokrąglenie u bardzo doświadczonych | karta własna (wyżej) zastępuje zestaw ogólny |
| Rodzina `kneeling_hinge` dla Seated Good Mornings | siad na ławce, nie klęk — nazwa rodziny nie pasuje (ruch: zgięcie w biodrach, jak w rodzinie) | decyzja koordynatora; bez wpływu na wskazówki |

## Dostęp

- exrx.net — 403; web.archive.org — zablokowane.
- coachweb.com/exercises/back-exercises/184/good-morning — czytane, ale opisuje tylko wersję stojącą (nie liczone).
