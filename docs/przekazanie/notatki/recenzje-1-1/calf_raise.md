# Recenzja ruchu 1.1: rodzina calf_raise (12 ćwiczeń), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, kadry stóp powiększone 4×, liczby z silnika v2).

Walidator: **12/12 OK**. Szczelność reguł automatycznych: **0 z 6 błędów (0%)**. Wszystkie 6 to jedna klasa (nr 1).

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Łydki na stopniu** | **BŁĄD** | stopa za stopniem, na krawędzi tylko czubek palców (nr 1) |
| **Standing Calf Raise** | **BŁĄD** | nr 1; uwaga A |
| **Smith Machine Calf Raise** | **BŁĄD** | nr 1. Poza tym poprawnie: sztanga na górze pleców (chwyt y 138,6 przy barku 141,6), prowadnica pionowo |
| **Calf Raise (sztanga)** | **BŁĄD** | nr 1. Sztanga na plecach poprawnie |
| Calf Raise (linki) | OK | Na podłodze: kostka 11° → −42°, pięta 0 → 17,7 cm, kolano 5–7° (`calf.knees`), linki z dolnych bloczków do dłoni przy biodrach |
| **Donkey Calf Raise** | **BŁĄD** | nr 1. Poza tym poprawnie: skłon 84°, dłonie na skrzyni (blat 62, chwyt y 65), dźwignia na biodrach |
| Band Calf Raise | OK | Na podłodze, guma spod stóp do dłoni, kostka 11° → −42° |
| **Single Leg Calf Raise** | **BŁĄD** | nr 1. Poza tym poprawnie: lewa noga zgięta w tył (kolano 86°), dłonie na ścianie (chwyt x 37 przy ścianie x 40) |
| Seated Calf Raise | OK z uwagą | Kolana 90°, pięty z podłogi do 14 cm, kostka 0° → −45°, uda unoszą się z kolanami (8,6 cm). Uwaga B |
| Seated Calf Raise (hantle) | OK | Jak wyżej, hantle na udach przy kolanach (chwyt (37; 61,9) przy kolanie (42; 48)), unoszą się z kolanami |
| Barbell Seated Calf Raise | OK | Jak wyżej, sztanga na udach przy kolanach, chwyt ±30 |
| Dumbbell Seated One-Leg Calf Raise | OK | Prawa noga z hantlem jak wyżej, lewa nieruchomo (kostka 0°), lewa dłoń na udzie |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Łydki na stopniu, Standing Calf Raise, Smith Machine Calf Raise, Calf Raise (sztanga), Donkey Calf Raise, Single Leg Calf Raise** (6) | wszystkie klatki: stopy i stopień (rzut z boku) | **Stopa stoi za stopniem, a nie na nim.** Stopień (`skrzynia`) zaczyna się w x0 = 7,7 (blat 8 cm, w pozostałych 6 cm). Czubek palców leży dokładnie w (7,7; 8,0), czyli na tylnym narożniku stopnia, a cała stopa jest za nim: pięta (−16,5; 3,7) w u = 0, ok. 2 cm nad podłogą. W u = 1 stopa staje pionowo na samym czubku (palce (7,9; 8), pięta (−9,6; 25,7)). Na powiększeniu kadru u = 0 but leży na podłodze obok niskiego bloczka i tylko go dotyka. W u = 1 postać balansuje na czubku palca na krawędzi. Wskazówki `calf.step` i `calf.edge` mówią: „Stań przednią częścią stóp na stopniu, pięty poza krawędzią”. Ruch w kostce jest poprawny: 21° (rozciągnięcie, pięta 4,3 cm pod blatem) → −42°, kolano 5–6°. | Przednia część stopy (od głów kości śródstopia do palców, ok. 6–8 cm) na blacie, czyli czubek palców w x ≈ x0 + 7, a krawędź stopnia pod głowami śródstopia. Pięty wiszą poza krawędzią. Stopień wyższy (zwykle 10–20 cm, `[DO USTALENIA]`), żeby pięta w dole nie dotykała podłogi. | 85% | realny (każde wyświetlenie) | nie: kontakt stopy ze skrzynią jest sprawdzany z tolerancją, a punkt styku (czubek palców zamiast przodostopia) nie |

## OK z uwagą (backlog, nie blokuje)

- **A. Standing Calf Raise: maszyna nierozpoznawalna.** Dźwignia jest prosta, pionowa, z punktem przy miednicy: na podglądzie pozioma belka na wysokości bioder. Dłonie stoją w powietrzu przed klatką (14; 121,6), łokcie 134°. Maszyna do wspięć stojąc ma poduszki na barkach i uchwyty przy nich. Pewność 60%.
- **B. Seated Calf Raise (maszyna): poduszka w złym miejscu.** Dźwignia (prosta, 52,8°) ma punkt przy kostkach: na podglądzie skośny pręt przy stopach. W maszynie do wspięć siedząc poduszka leży na udach tuż nad kolanami, jak hantle i sztanga w trzech wariantach obok. Pewność 60%.
- **Uwaga ogólna:** warianty siedzące zaczynają z piętą na podłodze (kostka 0°), więc nie pokazują rozciągnięcia z `calf.move` („opuść pięty, aż poczujesz rozciągnięcie”). Przy podkładce pod przodostopiem kostka zeszłaby poniżej 0°. Pewność 45%.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `przodostopie_na_stopniu` | gdy ćwiczenie ma `skrzynia` pod stopami i wskazówkę z „przednią częścią stóp”: w każdej klatce punkt 70% długości stopy od pięty (głowy śródstopia) leży nad blatem (x0 ≤ x ≤ x1), a pięta poza nim | 6 ćwiczeń: głowy śródstopia 7 cm za krawędzią | Calf Raise (linki), Band: bez skrzyni, bez alarmu |
