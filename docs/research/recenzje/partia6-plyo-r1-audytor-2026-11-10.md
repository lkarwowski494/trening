# Recenzja niezależna rodziny v2 `plyo` — partia 6, runda 1 (audytor, 10.11.2026)

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusz ze śladem toru). Stan zamrożony: gałąź `figury/partia-6` @ dff0a3f (zmiany względem b66ecfa). Autor: programista partii 6; recenzent: audytor (nie pisał rodziny, niczego nie poprawiał).

## Werdykt rodziny: **do poprawy** (2 × WYSOKIE: W1, W2)

## Metoda
- Arkusze `scripts/figures/arkusz-slad.mjs` wygenerowane samodzielnie: 27 ćwiczeń × 2 rzuty (side, front) = 54 arkusze, 21 kadrów co 0,05; ślad = miednica, przy Weighted Jump Squat sztanga, przy Dumbbell Seated Box Jump hantel (chwyt R). Obejrzane w pełnej rozdzielczości: Jump Squat, Tuck Jump, Double Leg Butt Kick, Single Leg Butt Kick, Broad Jump, Weighted Jump Squat, Depth Jump, Dumbbell Seated Box Jump, Alternate Leg Push-Off (z boku), Lateral Box Jump i Star Jump (z przodu); pozostałe — liczbowo.
- Liczby z `frameAt` (siatka 1/96): wysokość obu stóp nad podporą (podłoga albo skrzynia z zakresem x i z), przenikanie stóp w skrzynię, kąty stawów (`jointAngles`), położenie miednicy, chwytu i kostek.
- `scripts/figures/v2-validate.mjs` dla 27 póz: wszystkie OK (reguły sensu, styki, kolizje).
- Testy (`--runInBand`): `figures-v2-tor` i `figures-v2-delt-raise-p4` zielone; `figures-v2-plyo` — 1 czerwony (patrz „Testy”).

## Znaleziska

| ID | Klasa | Ćwiczenie | Opis i miara | Realność |
|---|---|---|---|---|
| W1 | WYSOKIE | Broad Jump | Karta (plyo.broadLoad): „zrób zamach rękami w tył”. Na rysunku ręce wiszą prosto przed biodrami w całym ugięciu: chwyt − bark w osi x ≥ +7 cm (u 0,10–0,15), dłonie ani przez chwilę nie są za ciałem; potem tylko wymach w przód. Rysunek sprzeczny z kartą (karta „wyswietlana”). | realny — każdy, kto otworzy kartę |
| W2 | WYSOKIE | Double Leg Butt Kick, Single Leg Butt Kick | Ruch niezgodny z nazwą: brak przyciągnięcia pięt do pośladków. Double: w locie maks. zgięcie kolan 99° (u 0,77), pięta 58 cm od miednicy — goleń poziomo w tył. Single: noga skacząca w locie zgięta ≤ 29°, noga wolna trzymana stale w ok. 70–103° (pięta ≥ 51 cm od miednicy); de facto podskok na jednej nodze. | realny |
| S1 | ŚREDNIE | skoki pionowe i w bok (Jump Squat, Star Jump, Weighted Jump Squat, Depth Jump, Lateral Cone Hops, Side Hop-Sprint, Side Standing Long Jump, Single-Leg Lateral Hop, Lateral Box Jump) | Miednica w locie cofa się względem stóp: przy wybiciu 6–9 cm przed kostkami, w szczycie 19–26 cm za nimi (Jump Squat −21 cm u 0,70; Star Jump −26 cm; Depth Jump −18 cm), tułów pionowo — nogi „wyciągnięte w przód” w szczycie skoku, a ślad miednicy ma zawrócenie w poziomie ok. 30 cm w samym locie (fizycznie środek ciała w locie nie zawraca). Na arkuszu widoczne jako przechył nóg; nie przeczy karcie ani zestawowi. | realny, nie blokuje |
| S2 | ŚREDNIE | Star Jump | Słaba „gwiazda”: rozstaw kostek w locie 58 cm (stanie 24 cm), ręce w wąskim V nad głową (rozstaw dłoni 70 cm), łokcie zgięte przy u 0,80–0,85. Rozpoznawalne, ale nie pozycja X. | realny, nie blokuje |
| N1 | NISKIE | Lateral Cone Hops, Front Cone Hops | Karta (Lateral) mówi o pachołku, rysunek go nie ma (brak sprzętu „pachołek” w GEAR). Lot stóp 18 cm. | backlog |
| N2 | NISKIE | Side Hop-Sprint | Pokazany jeden skok w bok, bez sprintu (uproszczenie nienazwane). | backlog |
| N3 | NISKIE | Depth Jump | Zejście ze skrzyni to mały podskok (stopy 8 cm w górę, miednica +7 cm przy u 0,04), a nie krok w dół. | backlog |
| N4 | NISKIE | Tuck Jump | W szczycie biodro 114°, kolano 110° (reguła „jedno źródło” spełniona), ale kolana 18 cm poniżej środka tułowia (uda poziomo), karta: „do klatki”. Mieści się w uproszczeniu reguły. | backlog |
| N5 | NISKIE | testy | `tests/figures-v2-plyo.test.tsx` `podpora()` pomija położenie skrzyni w osi z: przy Lateral Box Jump (skrzynia z = 55) start na podłodze daje wysokość −40 cm, a warunek „≤ 2 cm” przechodzi z nadwyżką — test podpory dla skrzyń z boku nic nie sprawdza (moja miara z osią z: brak przenikania, stopy na skrzyni przy u = 1). Wyjątek toru Weighted Jump Squat w `tor-wyjatki.json` mówi „ślad = miednica”, a ślad to sztanga. | teoretyczny (jakość testu) |

## Ruch pozostałych ćwiczeń (bez znalezisk)
- Wybicie z potrójnym wyprostem: w każdym skoku z regułą co najmniej jedna noga ma kolano i biodro ≤ 15° (min. 5–11°), kostka w zgięciu podeszwowym. Zamach rąk: dłoń 36–60 cm nad barkami we wszystkich `_skok`.
- Lot: obie stopy ≥ 3 cm nad podporą (maks. 18–74 cm). Lądowanie (u = 1): kolano 60–128°, biodro 47–129° — powyżej progów reguły.
- Skrzynie: Box Jump, Bench Jump, Box Skip, Single-Leg Stride Jump, Lateral Box Jump (skrzynia w bok, z = 55), Dumbbell Seated Box Jump — lądowanie stopami na skrzyni, przenikanie ≤ 0,2 cm. Side to Side Box Shuffle: stopa na skrzyni zmienia się na drugą (z 8 → −8 cm), druga stopa na podłodze. Alternate / Single Leg Push-Off: stopa na skrzyni, zmiana nóg w locie (Alternate) zgodnie z kartą.
- Depth Jump: zejście, lądowanie (kolano 84°), wybicie, lot, lądowanie w tym samym miejscu.
- Skoki w bok widoczne z przodu (przesunięcie miednicy w osi z: 42–103 cm; Lateral Bound z lewej nogi na prawą, Diagonal Bound w przód i w bok).
- Weighted Jump Squat: sztanga na górze pleców przez cały ruch (odstęp 1,3–1,6 cm), dłonie na gryfie, bez zamachu rąk. Dumbbell Seated Box Jump: z siadu na ławce, hantle wzdłuż ciała, zamach hantlami nad głowę (54 cm nad barki), lądowanie na skrzyni (kolano 85°, biodro 88°).
- Ciągłość: maks. krok miednicy 1,9–6,5 cm na 1/96 cyklu, bez skoków między kadrami. Pętla jednokierunkowa: u = 0 (stanie / pozycja startowa) i u = 1 (ugięcie po lądowaniu albo lustrzany wykrok/podpór) — dwie różne, sensowne pozycje.
- Ślad toru (K14): parabola lotu z zejściem w ugięcie, bez szarpnięć; jedyne wybrzuszenie to S1. 34 wyjątki toru: nie są poluzowaniem progu toru prostego (dotyczy gryfu), ale nie mają zastępczej miary kształtu toru skoku (jak N4 thrustera) — S1 przeszło niezauważone.

## Nakładka (`lib/figures/v2/overlay/plyo.ts`) — bez znalezisk
Dwa elementy z reguł „ustalone”: łuk stawu mierzonego (miekkie_ladowanie, tylko z boku — poprawnie, kąt zgięcia z przodu nie jest kątem) i poziom przez bark (zamach_rak, oba rzuty). Cue = wskazówki karty/zestawu (jump.land, bj.land, jump.drive, bj.move). Poziom barków nie rysuje się przy `_podskok` i `_obciazony` (Weighted Jump Squat, Dumbbell Seated Box Jump) — zgodnie z figury-sens. Pominięte reguły z powodem (definicja, jedno źródło, limit łuków).

## Zestawy ogólne (wzorzec `jump`, 19 ćwiczeń — brief podaje 18, w cue-sets.json jest 19)
- jump.drive + jump.land + jump.mis.stiff (9): Double Leg Butt Kick, Star Jump, Bench Jump, Frog Hops, Single-Leg Stride Jump, Alternate Leg Diagonal Bound, Side Standing Long Jump, Lateral Bound, Lateral Box Jump — zgodne z rysunkiem (wyprost przy wybiciu, zamach rąk, ugięcie po lądowaniu). Tekst zestawu przy Butt Kick poprawny; wadą jest sam rysunek (W2).
- jump.land + jump.mis.stiff (8): Front Cone Hops, Single-Leg Hop Progression, Single Leg Butt Kick, Box Skip, Single Leg Push-Off, Side Hop-Sprint, Single-Leg Lateral Hop, Side to Side Box Shuffle — zgodne.
- Depth Jump (jump.land, jump.drive) — zgodne. Dumbbell Seated Box Jump (bj.land, jump.drive, bj.mis.stiff) — „z zamachem rąk” pasuje do zamachu hantlami (figury-sens, otwarte_czesciowo), lądowanie z biodrami w tył.
- Weighted Jump Squat ma kartę własną (nie zestaw ogólny) — bez jump.drive, zgodnie z zamknięciem z 28.10.2026.
- Bez nazw źródeł, liczb i twierdzeń o zdrowiu.

## Karty własne (8)
Jump Squat, Tuck Jump (N4), Box Jump, Weighted Jump Squat, Alternate Leg Push-Off, Split Jump, Lateral Cone Hops (N1) — zgodne z rysunkiem, bez nowego wpisu. **Broad Jump** — sprzeczność z rysunkiem (W1), wpis „do poprawy”. Rodzina nie ma figur v1.

## Testy
- Zmiany testów (figures-v2-data, mapping, nakladka-triceps-olympic, skrot-v2-wynik, strona-eksport): aktualizacje liczb i list o plyo; wyłączenie plyo z pętli faz w figures-v2-data zastąpione testem jednej fazy „Skok” w figures-v2-plyo — bez poluzowania.
- `figures-v2-plyo` „element rysuje się tylko przy regule wariantu… każde ćwiczenie ma co najmniej jeden element” jest czerwony na dff0a3f (pierwsze: Double Leg Butt Kick): zestawy ogólne nie mają jeszcze wpisu recenzji, więc `techniquesOf` zwraca pustą listę dla 19 ćwiczeń. Po przepisaniu wpisów `zestawy` z tej recenzji test powinien przejść.

## Poprawki do testów odtwarzających
- W1: Broad Jump, u ∈ [0; 0,25]: min(chwyt.x − bark.x) ≤ −15 cm (dłonie za tułowiem przed wymachem).
- W2: Double Leg Butt Kick — w locie obie nogi: kolano ≥ 120° i odległość pięta–miednica ≤ 30 cm w co najmniej jednym kadrze; Single Leg Butt Kick — to samo dla nogi skaczącej (albo opisanej w karcie/zestawie), nie tylko dla nogi wolnej.
